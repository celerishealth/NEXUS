import { randomUUID } from "node:crypto";
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
  SignedControlledActionGatewayEnvelope,
} from "./signedControlledActionGatewayEnvelope";

export type GatewayJournalJsonValue =
  | string
  | number
  | boolean
  | null
  | GatewayJournalJsonValue[]
  | {
      [key: string]: GatewayJournalJsonValue;
    };

export type SignedGatewayOutcomeStatus =
  | "in_progress"
  | "completed"
  | "failed";

export interface SignedGatewayOutcomeJournalEntry {
  keyId: string;
  nonce: string;
  signature: string;
  requestId: string;
  tenantId: string;
  actorId: string;
  commandType: string;
  status: SignedGatewayOutcomeStatus;
  startedAt: string;
  expiresAt: string;
  completedAt: string | null;
  httpStatus: number | null;
  responseBody: GatewayJournalJsonValue | null;
}

interface SignedGatewayOutcomeJournalState {
  schemaVersion: 1;
  revision: number;
  entries: Record<
    string,
    SignedGatewayOutcomeJournalEntry
  >;
}

export type BeginSignedGatewayOutcomeResult =
  | {
      disposition: "started";
      entry: SignedGatewayOutcomeJournalEntry;
    }
  | {
      disposition: "in_progress";
      entry: SignedGatewayOutcomeJournalEntry;
    }
  | {
      disposition: "replay";
      entry: SignedGatewayOutcomeJournalEntry;
    };

const LOCK_WAIT_TIMEOUT_MS = 5_000;
const STALE_LOCK_MS = 30_000;
const MAX_JOURNAL_ENTRIES = 100_000;

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function parseTimestamp(
  value: string,
  fieldName: string,
): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      `${fieldName} must be a valid timestamp.`,
    );
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

function isJsonValue(
  value: unknown,
): value is GatewayJournalJsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

function normalizeJsonValue(
  value: unknown,
): GatewayJournalJsonValue {
  const serialized = JSON.stringify(value);

  if (serialized === undefined) {
    throw new Error(
      "Gateway outcome response is not JSON serializable.",
    );
  }

  const parsed: unknown = JSON.parse(serialized);

  if (!isJsonValue(parsed)) {
    throw new Error(
      "Gateway outcome response is not valid JSON.",
    );
  }

  return parsed;
}

function stableStringify(value: GatewayJournalJsonValue): string {
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

  const keys = Object.keys(value).sort();

  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableStringify(
          value[key],
        )}`,
    )
    .join(",")}}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createInitialState(): SignedGatewayOutcomeJournalState {
  return {
    schemaVersion: 1,
    revision: 0,
    entries: {},
  };
}

function entryKey(
  keyId: string,
  nonce: string,
): string {
  return `${keyId}:${nonce}`;
}

function validateEntry(
  key: string,
  entry: SignedGatewayOutcomeJournalEntry,
): void {
  requireNonEmpty(entry.keyId, "Journal keyId");
  requireNonEmpty(entry.nonce, "Journal nonce");
  requireNonEmpty(entry.signature, "Journal signature");
  requireNonEmpty(entry.requestId, "Journal requestId");
  requireNonEmpty(entry.tenantId, "Journal tenantId");
  requireNonEmpty(entry.actorId, "Journal actorId");
  requireNonEmpty(
    entry.commandType,
    "Journal commandType",
  );

  if (key !== entryKey(entry.keyId, entry.nonce)) {
    throw new Error(
      "Gateway outcome journal entry identity is invalid.",
    );
  }

  parseTimestamp(entry.startedAt, "Journal startedAt");
  parseTimestamp(entry.expiresAt, "Journal expiresAt");

  if (entry.completedAt) {
    parseTimestamp(
      entry.completedAt,
      "Journal completedAt",
    );
  }

  if (entry.status === "in_progress") {
    if (
      entry.completedAt !== null ||
      entry.httpStatus !== null ||
      entry.responseBody !== null
    ) {
      throw new Error(
        "In-progress journal entry contains terminal outcome data.",
      );
    }
  } else {
    if (
      entry.completedAt === null ||
      entry.httpStatus === null ||
      entry.responseBody === null
    ) {
      throw new Error(
        "Terminal journal entry is missing outcome data.",
      );
    }

    if (
      !Number.isSafeInteger(entry.httpStatus) ||
      entry.httpStatus < 100 ||
      entry.httpStatus > 599
    ) {
      throw new Error(
        "Gateway outcome HTTP status is invalid.",
      );
    }

    if (!isJsonValue(entry.responseBody)) {
      throw new Error(
        "Gateway outcome response body is invalid.",
      );
    }
  }
}

function validateState(
  state: SignedGatewayOutcomeJournalState,
): void {
  if (state.schemaVersion !== 1) {
    throw new Error(
      "Unsupported gateway outcome-journal schema version.",
    );
  }

  if (
    !Number.isSafeInteger(state.revision) ||
    state.revision < 0
  ) {
    throw new Error(
      "Gateway outcome-journal revision is invalid.",
    );
  }

  for (const [key, entry] of Object.entries(
    state.entries,
  )) {
    validateEntry(key, entry);
  }
}

function matchesEnvelope(
  entry: SignedGatewayOutcomeJournalEntry,
  envelope: SignedControlledActionGatewayEnvelope,
): boolean {
  return (
    entry.keyId === envelope.keyId &&
    entry.nonce === envelope.nonce &&
    entry.signature === envelope.signature &&
    entry.requestId === envelope.context.requestId &&
    entry.tenantId === envelope.context.tenantId &&
    entry.actorId === envelope.context.actorId &&
    entry.commandType === envelope.command.type
  );
}

async function pathExists(
  path: string,
): Promise<boolean> {
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

async function sleep(
  milliseconds: number,
): Promise<void> {
  await new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}

export class DurableSignedGatewayOutcomeJournal {
  private readonly lockPath: string;
  private readonly backupPath: string;

  constructor(private readonly statePath: string) {
    requireNonEmpty(
      statePath,
      "Gateway outcome-journal path",
    );

    this.lockPath = `${statePath}.lock`;
    this.backupPath = `${statePath}.bak`;
  }

  async begin(
    envelope: SignedControlledActionGatewayEnvelope,
    startedAt: string,
    expiresAt: string,
  ): Promise<BeginSignedGatewayOutcomeResult> {
    const normalizedStartedAt = requireNonEmpty(
      startedAt,
      "Gateway outcome startedAt",
    );

    const normalizedExpiresAt = requireNonEmpty(
      expiresAt,
      "Gateway outcome expiresAt",
    );

    const startedAtTimestamp = parseTimestamp(
      normalizedStartedAt,
      "Gateway outcome startedAt",
    );

    const expiresAtTimestamp = parseTimestamp(
      normalizedExpiresAt,
      "Gateway outcome expiresAt",
    );

    if (expiresAtTimestamp <= startedAtTimestamp) {
      throw new Error(
        "Gateway outcome expiry must be after start time.",
      );
    }

    const releaseLock = await this.acquireLock();

    try {
      const state = await this.readState();

      for (const [key, entry] of Object.entries(
        state.entries,
      )) {
        if (
          parseTimestamp(
            entry.expiresAt,
            "Journal expiresAt",
          ) <= startedAtTimestamp
        ) {
          delete state.entries[key];
        }
      }

      const key = entryKey(
        envelope.keyId,
        envelope.nonce,
      );

      const existing = state.entries[key];

      if (existing) {
        if (!matchesEnvelope(existing, envelope)) {
          throw new Error(
            "Signed gateway nonce conflicts with another durable request.",
          );
        }

        return {
          disposition:
            existing.status === "in_progress"
              ? "in_progress"
              : "replay",
          entry: clone(existing),
        };
      }

      if (
        Object.keys(state.entries).length >=
        MAX_JOURNAL_ENTRIES
      ) {
        throw new Error(
          "Gateway outcome-journal capacity is exhausted.",
        );
      }

      const entry: SignedGatewayOutcomeJournalEntry = {
        keyId: envelope.keyId,
        nonce: envelope.nonce,
        signature: envelope.signature,
        requestId: envelope.context.requestId,
        tenantId: envelope.context.tenantId,
        actorId: envelope.context.actorId,
        commandType: envelope.command.type,
        status: "in_progress",
        startedAt: normalizedStartedAt,
        expiresAt: normalizedExpiresAt,
        completedAt: null,
        httpStatus: null,
        responseBody: null,
      };

      state.entries[key] = entry;
      state.revision += 1;

      validateState(state);
      await this.persistState(state);

      return {
        disposition: "started",
        entry: clone(entry),
      };
    } finally {
      await releaseLock();
    }
  }

  async finish(
    keyId: string,
    nonce: string,
    signature: string,
    status: Exclude<
      SignedGatewayOutcomeStatus,
      "in_progress"
    >,
    completedAt: string,
    httpStatus: number,
    responseBody: unknown,
  ): Promise<SignedGatewayOutcomeJournalEntry> {
    const normalizedKeyId = requireNonEmpty(
      keyId,
      "Gateway outcome keyId",
    );

    const normalizedNonce = requireNonEmpty(
      nonce,
      "Gateway outcome nonce",
    );

    const normalizedSignature = requireNonEmpty(
      signature,
      "Gateway outcome signature",
    );

    parseTimestamp(
      completedAt,
      "Gateway outcome completedAt",
    );

    if (
      !Number.isSafeInteger(httpStatus) ||
      httpStatus < 100 ||
      httpStatus > 599
    ) {
      throw new Error(
        "Gateway outcome HTTP status is invalid.",
      );
    }

    const normalizedBody =
      normalizeJsonValue(responseBody);

    const releaseLock = await this.acquireLock();

    try {
      const state = await this.readState();
      const key = entryKey(
        normalizedKeyId,
        normalizedNonce,
      );

      const entry = state.entries[key];

      if (!entry) {
        throw new Error(
          "Gateway outcome journal entry was not found.",
        );
      }

      if (entry.signature !== normalizedSignature) {
        throw new Error(
          "Gateway outcome signature does not match the durable request.",
        );
      }

      if (entry.status !== "in_progress") {
        const sameOutcome =
          entry.status === status &&
          entry.httpStatus === httpStatus &&
          entry.responseBody !== null &&
          stableStringify(entry.responseBody) ===
            stableStringify(normalizedBody);

        if (!sameOutcome) {
          throw new Error(
            "Gateway outcome conflicts with an existing terminal result.",
          );
        }

        return clone(entry);
      }

      entry.status = status;
      entry.completedAt = completedAt;
      entry.httpStatus = httpStatus;
      entry.responseBody = normalizedBody;
      state.revision += 1;

      validateState(state);
      await this.persistState(state);

      return clone(entry);
    } finally {
      await releaseLock();
    }
  }

  async readSnapshot(): Promise<SignedGatewayOutcomeJournalState> {
    const state = await this.readState();
    return clone(state);
  }

  private async acquireLock(): Promise<
    () => Promise<void>
  > {
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
          await rm(this.lockPath, {
            force: true,
          });
        };
      } catch (error) {
        if (
          (error as NodeJS.ErrnoException).code !==
          "EEXIST"
        ) {
          throw error;
        }

        try {
          const lockState = await stat(
            this.lockPath,
          );

          if (
            Date.now() - lockState.mtimeMs >
            STALE_LOCK_MS
          ) {
            await rm(this.lockPath, {
              force: true,
            });

            continue;
          }
        } catch (lockError) {
          if (
            (
              lockError as NodeJS.ErrnoException
            ).code !== "ENOENT"
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
            "Timed out waiting for gateway outcome-journal lock.",
          );
        }

        await sleep(10);
      }
    }
  }

  private async readState(): Promise<SignedGatewayOutcomeJournalState> {
    let selectedPath: string | null = null;

    if (await pathExists(this.statePath)) {
      selectedPath = this.statePath;
    } else if (await pathExists(this.backupPath)) {
      selectedPath = this.backupPath;
    }

    if (!selectedPath) {
      return createInitialState();
    }

    const raw = await readFile(
      selectedPath,
      "utf8",
    );

    const state = JSON.parse(
      raw,
    ) as SignedGatewayOutcomeJournalState;

    validateState(state);

    return state;
  }

  private async persistState(
    state: SignedGatewayOutcomeJournalState,
  ): Promise<void> {
    await mkdir(dirname(this.statePath), {
      recursive: true,
    });

    const temporaryPath =
      `${this.statePath}.${randomUUID()}.tmp`;

    const temporaryHandle = await open(
      temporaryPath,
      "wx",
    );

    try {
      await temporaryHandle.writeFile(
        `${JSON.stringify(state, null, 2)}\n`,
        "utf8",
      );

      await temporaryHandle.sync();
    } finally {
      await temporaryHandle.close();
    }

    await rm(this.backupPath, {
      force: true,
    });

    if (await pathExists(this.statePath)) {
      await rename(
        this.statePath,
        this.backupPath,
      );
    }

    try {
      await rename(
        temporaryPath,
        this.statePath,
      );

      await rm(this.backupPath, {
        force: true,
      });
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

      await rm(temporaryPath, {
        force: true,
      });

      throw error;
    }
  }
}
