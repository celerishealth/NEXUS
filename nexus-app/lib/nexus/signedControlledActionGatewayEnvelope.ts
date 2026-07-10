import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat,
} from "node:fs/promises";
import { dirname } from "node:path";
import type {
  ControlledActionGatewayCommand,
  ControlledActionGatewayContext,
} from "./controlledActionCommandGateway";
import {
  isControlledActionGatewayRole,
} from "./controlledActionCommandGateway";

export interface UnsignedControlledActionGatewayEnvelope {
  version: 1;
  keyId: string;
  issuedAt: string;
  nonce: string;
  context: ControlledActionGatewayContext;
  command: ControlledActionGatewayCommand;
}

export interface SignedControlledActionGatewayEnvelope
  extends UnsignedControlledActionGatewayEnvelope {
  signature: string;
}

export interface VerifySignedGatewayEnvelopeOptions {
  now: string;
  maxClockSkewMs: number;
}

interface GatewayReplayEntry {
  keyId: string;
  nonce: string;
  reservedAt: string;
  expiresAt: string;
}

interface GatewayReplayState {
  schemaVersion: 1;
  revision: number;
  entries: Record<string, GatewayReplayEntry>;
}

const LOCK_WAIT_TIMEOUT_MS = 5_000;
const STALE_LOCK_MS = 30_000;
const MAX_REPLAY_ENTRIES = 100_000;

function requireNonEmpty(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function parseTimestamp(value: string, fieldName: string): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`${fieldName} must be a valid timestamp.`);
  }

  return timestamp;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stableStringify(value: unknown): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (isRecord(value)) {
    const keys = Object.keys(value).sort();

    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(value[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Signed gateway envelope contains an unsupported value.",
  );
}

function canonicalEnvelopePayload(
  envelope: UnsignedControlledActionGatewayEnvelope,
): string {
  return stableStringify({
    version: envelope.version,
    keyId: envelope.keyId,
    issuedAt: envelope.issuedAt,
    nonce: envelope.nonce,
    context: envelope.context,
    command: envelope.command,
  });
}

function calculateSignature(
  envelope: UnsignedControlledActionGatewayEnvelope,
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(canonicalEnvelopePayload(envelope), "utf8")
    .digest("hex");
}

function secureHexEquals(
  actual: string,
  expected: string,
): boolean {
  if (
    !/^[a-f0-9]{64}$/i.test(actual) ||
    !/^[a-f0-9]{64}$/i.test(expected)
  ) {
    return false;
  }

  const actualBuffer = Buffer.from(
    actual.toLowerCase(),
    "hex",
  );

  const expectedBuffer = Buffer.from(
    expected.toLowerCase(),
    "hex",
  );

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function validateUnsignedEnvelope(
  value: unknown,
): UnsignedControlledActionGatewayEnvelope {
  if (!isRecord(value)) {
    throw new Error(
      "Signed gateway envelope must be an object.",
    );
  }

  if (value.version !== 1) {
    throw new Error(
      "Unsupported signed gateway envelope version.",
    );
  }

  if (typeof value.keyId !== "string") {
    throw new Error("Signed gateway keyId is required.");
  }

  if (typeof value.issuedAt !== "string") {
    throw new Error("Signed gateway issuedAt is required.");
  }

  if (typeof value.nonce !== "string") {
    throw new Error("Signed gateway nonce is required.");
  }

  if (!isRecord(value.context)) {
    throw new Error("Signed gateway context is required.");
  }

  if (!isRecord(value.command)) {
    throw new Error("Signed gateway command is required.");
  }

  const tenantId =
    typeof value.context.tenantId === "string"
      ? requireNonEmpty(
          value.context.tenantId,
          "Signed gateway context tenantId",
        )
      : "";

  const actorId =
    typeof value.context.actorId === "string"
      ? requireNonEmpty(
          value.context.actorId,
          "Signed gateway context actorId",
        )
      : "";

  const requestId =
    typeof value.context.requestId === "string"
      ? requireNonEmpty(
          value.context.requestId,
          "Signed gateway context requestId",
        )
      : "";

  const role =
    typeof value.context.role === "string"
      ? value.context.role
      : "";

  if (!isControlledActionGatewayRole(role)) {
    throw new Error("Signed gateway role is invalid.");
  }

  if (typeof value.command.type !== "string") {
    throw new Error(
      "Signed gateway command type is required.",
    );
  }

  return {
    version: 1,
    keyId: requireNonEmpty(
      value.keyId,
      "Signed gateway keyId",
    ),
    issuedAt: requireNonEmpty(
      value.issuedAt,
      "Signed gateway issuedAt",
    ),
    nonce: requireNonEmpty(
      value.nonce,
      "Signed gateway nonce",
    ),
    context: {
      tenantId,
      actorId,
      requestId,
      role,
    },
    command:
      value.command as unknown as ControlledActionGatewayCommand,
  };
}

function createInitialReplayState(): GatewayReplayState {
  return {
    schemaVersion: 1,
    revision: 0,
    entries: {},
  };
}

function validateReplayState(
  state: GatewayReplayState,
): void {
  if (state.schemaVersion !== 1) {
    throw new Error(
      "Unsupported gateway replay-state schema version.",
    );
  }

  if (!Number.isSafeInteger(state.revision) || state.revision < 0) {
    throw new Error(
      "Gateway replay-state revision is invalid.",
    );
  }

  for (const [entryKey, entry] of Object.entries(
    state.entries,
  )) {
    requireNonEmpty(entryKey, "Gateway replay entry key");
    requireNonEmpty(entry.keyId, "Gateway replay keyId");
    requireNonEmpty(entry.nonce, "Gateway replay nonce");

    parseTimestamp(
      entry.reservedAt,
      "Gateway replay reservedAt",
    );

    parseTimestamp(
      entry.expiresAt,
      "Gateway replay expiresAt",
    );

    if (entryKey !== `${entry.keyId}:${entry.nonce}`) {
      throw new Error(
        "Gateway replay entry identity is invalid.",
      );
    }
  }
}

async function sleep(milliseconds: number): Promise<void> {
  await new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
}

export function signControlledActionGatewayEnvelope(
  envelope: UnsignedControlledActionGatewayEnvelope,
  secret: string,
): SignedControlledActionGatewayEnvelope {
  const normalizedSecret = requireNonEmpty(
    secret,
    "Gateway signing secret",
  );

  const validatedEnvelope =
    validateUnsignedEnvelope(envelope);

  parseTimestamp(
    validatedEnvelope.issuedAt,
    "Signed gateway issuedAt",
  );

  return {
    ...validatedEnvelope,
    signature: calculateSignature(
      validatedEnvelope,
      normalizedSecret,
    ),
  };
}

export function verifySignedControlledActionGatewayEnvelope(
  input: unknown,
  secrets: Readonly<Record<string, string>>,
  options: VerifySignedGatewayEnvelopeOptions,
): SignedControlledActionGatewayEnvelope {
  if (!isRecord(input)) {
    throw new Error(
      "Signed gateway envelope must be an object.",
    );
  }

  if (typeof input.signature !== "string") {
    throw new Error(
      "Signed gateway signature is required.",
    );
  }

  const unsignedEnvelope =
    validateUnsignedEnvelope(input);

  const signature = requireNonEmpty(
    input.signature,
    "Signed gateway signature",
  );

  const now = parseTimestamp(
    options.now,
    "Gateway verification now",
  );

  if (
    !Number.isSafeInteger(options.maxClockSkewMs) ||
    options.maxClockSkewMs < 1 ||
    options.maxClockSkewMs > 900_000
  ) {
    throw new Error(
      "Gateway maxClockSkewMs must be between 1 and 900000.",
    );
  }

  const issuedAt = parseTimestamp(
    unsignedEnvelope.issuedAt,
    "Signed gateway issuedAt",
  );

  if (
    Math.abs(now - issuedAt) >
    options.maxClockSkewMs
  ) {
    throw new Error(
      "Signed gateway envelope is stale or issued too far in the future.",
    );
  }

  const configuredSecret =
    secrets[unsignedEnvelope.keyId]?.trim() ?? "";

  if (!configuredSecret) {
    throw new Error(
      "Signed gateway key is unknown or disabled.",
    );
  }

  const expectedSignature = calculateSignature(
    unsignedEnvelope,
    configuredSecret,
  );

  if (!secureHexEquals(signature, expectedSignature)) {
    throw new Error(
      "Signed gateway signature verification failed.",
    );
  }

  return {
    ...unsignedEnvelope,
    signature,
  };
}

export function calculateGatewayReplayExpiry(
  issuedAt: string,
  maxClockSkewMs: number,
): string {
  const issuedAtTimestamp = parseTimestamp(
    issuedAt,
    "Signed gateway issuedAt",
  );

  if (
    !Number.isSafeInteger(maxClockSkewMs) ||
    maxClockSkewMs < 1 ||
    maxClockSkewMs > 900_000
  ) {
    throw new Error(
      "Gateway maxClockSkewMs must be between 1 and 900000.",
    );
  }

  return new Date(
    issuedAtTimestamp + maxClockSkewMs,
  ).toISOString();
}

export class PersistentControlledActionGatewayReplayGuard {
  private readonly lockPath: string;
  private readonly backupPath: string;

  constructor(private readonly statePath: string) {
    requireNonEmpty(
      statePath,
      "Gateway replay-state path",
    );

    this.lockPath = `${statePath}.lock`;
    this.backupPath = `${statePath}.bak`;
  }

  async reserve(
    keyId: string,
    nonce: string,
    reservedAt: string,
    expiresAt: string,
  ): Promise<boolean> {
    const normalizedKeyId = requireNonEmpty(
      keyId,
      "Gateway replay keyId",
    );

    const normalizedNonce = requireNonEmpty(
      nonce,
      "Gateway replay nonce",
    );

    const reservedAtTimestamp = parseTimestamp(
      reservedAt,
      "Gateway replay reservedAt",
    );

    const expiresAtTimestamp = parseTimestamp(
      expiresAt,
      "Gateway replay expiresAt",
    );

    if (expiresAtTimestamp <= reservedAtTimestamp) {
      throw new Error(
        "Gateway replay expiry must be after reservation time.",
      );
    }

    const releaseLock = await this.acquireLock();

    try {
      const state = await this.readState();
      const entryKey =
        `${normalizedKeyId}:${normalizedNonce}`;

      for (const [existingKey, entry] of Object.entries(
        state.entries,
      )) {
        if (
          parseTimestamp(
            entry.expiresAt,
            "Gateway replay expiresAt",
          ) <= reservedAtTimestamp
        ) {
          delete state.entries[existingKey];
        }
      }

      if (state.entries[entryKey]) {
        return false;
      }

      if (
        Object.keys(state.entries).length >=
        MAX_REPLAY_ENTRIES
      ) {
        throw new Error(
          "Gateway replay registry capacity is exhausted.",
        );
      }

      state.entries[entryKey] = {
        keyId: normalizedKeyId,
        nonce: normalizedNonce,
        reservedAt,
        expiresAt,
      };

      state.revision += 1;

      validateReplayState(state);
      await this.persistState(state);

      return true;
    } finally {
      await releaseLock();
    }
  }

  async readSnapshot(): Promise<GatewayReplayState> {
    const state = await this.readState();
    return JSON.parse(JSON.stringify(state));
  }

  private async acquireLock(): Promise<() => Promise<void>> {
    await mkdir(dirname(this.statePath), {
      recursive: true,
    });

    const startedAt = Date.now();

    while (true) {
      try {
        const lockHandle = await open(
          this.lockPath,
          "wx",
        );

        await lockHandle.writeFile(
          JSON.stringify({
            owner: randomUUID(),
            createdAt: new Date().toISOString(),
          }),
          "utf8",
        );

        await lockHandle.sync();

        return async () => {
          await lockHandle.close();
          await rm(this.lockPath, { force: true });
        };
      } catch (error) {
        if (
          (error as NodeJS.ErrnoException).code !==
          "EEXIST"
        ) {
          throw error;
        }

        try {
          const lockState = await stat(this.lockPath);

          if (
            Date.now() - lockState.mtimeMs >
            STALE_LOCK_MS
          ) {
            await rm(this.lockPath, { force: true });
            continue;
          }
        } catch (lockError) {
          if (
            (lockError as NodeJS.ErrnoException).code !==
            "ENOENT"
          ) {
            throw lockError;
          }

          continue;
        }

        if (
          Date.now() - startedAt >=
          LOCK_WAIT_TIMEOUT_MS
        ) {
          throw new Error(
            "Timed out waiting for gateway replay-state lock.",
          );
        }

        await sleep(10);
      }
    }
  }

  private async readState(): Promise<GatewayReplayState> {
    let selectedPath: string | null = null;

    if (await pathExists(this.statePath)) {
      selectedPath = this.statePath;
    } else if (await pathExists(this.backupPath)) {
      selectedPath = this.backupPath;
    }

    if (!selectedPath) {
      return createInitialReplayState();
    }

    const raw = await readFile(selectedPath, "utf8");
    const state = JSON.parse(raw) as GatewayReplayState;

    validateReplayState(state);
    return state;
  }

  private async persistState(
    state: GatewayReplayState,
  ): Promise<void> {
    await mkdir(dirname(this.statePath), {
      recursive: true,
    });

    const temporaryPath =
      `${this.statePath}.${randomUUID()}.tmp`;

    const handle = await open(temporaryPath, "wx");

    try {
      await handle.writeFile(
        `${JSON.stringify(state, null, 2)}\n`,
        "utf8",
      );

      await handle.sync();
    } finally {
      await handle.close();
    }

    await rm(this.backupPath, { force: true });

    if (await pathExists(this.statePath)) {
      await rename(this.statePath, this.backupPath);
    }

    try {
      await rename(temporaryPath, this.statePath);
      await rm(this.backupPath, { force: true });
    } catch (error) {
      if (
        !(await pathExists(this.statePath)) &&
        (await pathExists(this.backupPath))
      ) {
        await rename(
          this.backupPath,
          this.statePath,
        );
      }

      await rm(temporaryPath, { force: true });
      throw error;
    }
  }
}
