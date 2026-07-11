import {
  INTERNAL_PILOT_SESSION_ROUTE_PATH,
  INTERNAL_PILOT_WORKER_ROUTE_PATH,
} from "./controlledInternalPilotProductionApiRouter";

export type ControlledInternalPilotOwnerConsolePhase =
  | "authority-ready"
  | "issuing-session"
  | "session-ready"
  | "running-sandbox"
  | "completed"
  | "revoking-session"
  | "revoked"
  | "error";

export type ControlledInternalPilotOwnerConsoleErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "OPERATION_IN_PROGRESS"
  | "SESSION_ALREADY_ACTIVE"
  | "SESSION_REQUIRED"
  | "REPLAY_NOT_AVAILABLE"
  | "CONSOLE_REVOKED"
  | "CLOCK_INVALID"
  | "IDENTIFIER_GENERATION_FAILED"
  | "FETCH_FAILED"
  | "RESPONSE_TOO_LARGE"
  | "RESPONSE_INVALID"
  | "SERVICE_ERROR";

export class ControlledInternalPilotOwnerConsoleError extends Error {
  readonly code: string;

  constructor(
    code: string,
    message: string,
  ) {
    super(message);
    this.name =
      "ControlledInternalPilotOwnerConsoleError";
    this.code = code;
  }
}

export interface ControlledInternalPilotOwnerConsoleFetch {
  (
    input: string,
    init: RequestInit,
  ): Promise<Response>;
}

export interface ControlledInternalPilotOwnerConsoleRuntime {
  tenantId: string;
  authorityCsrfToken: string;
  fetch: ControlledInternalPilotOwnerConsoleFetch;
  now?: () => Date;
  createRequestId?: () => string;
  createIdempotencyKey?: () => string;
  maxBatchSize?: number;
  maxResponseBodyBytes?: number;
}

export interface ControlledInternalPilotOwnerConsoleIssueInput {
  ttlSeconds: number;
}

export interface ControlledInternalPilotOwnerConsoleRunInput {
  batchSize: number;
}

export interface ControlledInternalPilotOwnerConsoleErrorState {
  code: string;
  message: string;
}

export interface ControlledInternalPilotOwnerConsoleRunState {
  requestId: string;
  idempotencyKey: string;
  requestedAt: string;
  requestDigest: string;
  replay: boolean;
  result: Readonly<Record<string, unknown>>;
}

export interface ControlledInternalPilotOwnerConsoleSnapshot {
  tenantId: string;
  phase: ControlledInternalPilotOwnerConsolePhase;
  statusMessage: string;
  busy: boolean;
  activeSessionId: string | null;
  lastRun: ControlledInternalPilotOwnerConsoleRunState | null;
  lastError: ControlledInternalPilotOwnerConsoleErrorState | null;
  canIssueSession: boolean;
  canRunSandbox: boolean;
  canReplayLastRun: boolean;
  canRevokeSession: boolean;
  ownerApprovalRequired: true;
  liveProviderExecution: "blocked";
  externalDelivery: "blocked";
  paymentExecution: "blocked";
  publicLaunch: "blocked";
}

export interface ControlledInternalPilotOwnerConsole {
  getSnapshot(): ControlledInternalPilotOwnerConsoleSnapshot;

  issueSession(
    input: ControlledInternalPilotOwnerConsoleIssueInput,
  ): Promise<ControlledInternalPilotOwnerConsoleSnapshot>;

  runSandboxCycle(
    input: ControlledInternalPilotOwnerConsoleRunInput,
  ): Promise<ControlledInternalPilotOwnerConsoleSnapshot>;

  replayLastRun(): Promise<ControlledInternalPilotOwnerConsoleSnapshot>;

  revokeSession(): Promise<ControlledInternalPilotOwnerConsoleSnapshot>;
}

interface ActivePilotSession {
  sessionId: string;
  csrfToken: string;
  issuedAt: string;
  expiresAt: string;
}

interface StoredSandboxCommand {
  tenantId: string;
  requestId: string;
  idempotencyKey: string;
  batchSize: number;
  requestedAt: string;
  executionMode: "sandbox";
}

const DEFAULT_MAX_BATCH_SIZE = 25;
const DEFAULT_MAX_RESPONSE_BODY_BYTES = 65_536;

const ISSUE_INPUT_KEYS = [
  "ttlSeconds",
] as const;

const RUN_INPUT_KEYS = [
  "batchSize",
] as const;

const ISSUE_RESPONSE_KEYS = [
  "actorId",
  "csrfToken",
  "expiresAt",
  "externalDelivery",
  "issuedAt",
  "liveProviderExecution",
  "ok",
  "operation",
  "ownerApprovalRequired",
  "paymentExecution",
  "publicLaunch",
  "sessionId",
  "tenantId",
] as const;

const REVOKE_RESPONSE_KEYS = [
  "actorId",
  "externalDelivery",
  "liveProviderExecution",
  "ok",
  "operation",
  "ownerApprovalRequired",
  "paymentExecution",
  "publicLaunch",
  "replay",
  "revoked",
  "revokedAt",
  "sessionId",
  "tenantId",
] as const;

const WORKER_RESPONSE_KEYS = [
  "externalDelivery",
  "liveProviderExecution",
  "ok",
  "ownerApprovalRequired",
  "paymentExecution",
  "publicLaunch",
  "replay",
  "requestDigest",
  "requestId",
  "result",
  "tenantId",
] as const;

const ERROR_RESPONSE_KEYS = [
  "error",
  "ok",
] as const;

const ERROR_DETAIL_KEYS = [
  "code",
  "message",
] as const;

const FORBIDDEN_RESPONSE_KEYS =
  new Set([
    "authorization",
    "cookie",
    "csrfTokenDigest",
    "csrf_token_digest",
    "databaseUrl",
    "database_url",
    "password",
    "privateKey",
    "private_key",
    "rawError",
    "raw_error",
    "sessionToken",
    "session_token",
    "sessionTokenDigest",
    "session_token_digest",
    "stack",
  ]);

function consoleError(
  code: string,
  message: string,
): ControlledInternalPilotOwnerConsoleError {
  return new ControlledInternalPilotOwnerConsoleError(
    code,
    message,
  );
}

function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) ===
      Object.prototype
  );
}

function assertExactKeys(
  value: unknown,
  expectedKeys: readonly string[],
  code: ControlledInternalPilotOwnerConsoleErrorCode,
  message: string,
): asserts value is Record<string, unknown> {
  if (!isPlainRecord(value)) {
    throw consoleError(code, message);
  }

  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();

  if (
    actual.length !== expected.length ||
    actual.some(
      (key, index) =>
        key !== expected[index],
    )
  ) {
    throw consoleError(code, message);
  }
}

function isIdentifier(
  value: unknown,
  minimumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= minimumLength &&
    value.length <= 128 &&
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(
      value,
    )
  );
}

function isOpaqueToken(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 32 &&
    value.length <= 256 &&
    /^[A-Za-z0-9._~-]+$/.test(value)
  );
}

function isDigest(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-f0-9]{64}$/.test(value)
  );
}

function parseIsoTimestamp(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = new Date(value);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString() !== value
  ) {
    return null;
  }

  return value;
}

function hasSafetyBoundaries(
  value: Record<string, unknown>,
): boolean {
  return (
    value.ownerApprovalRequired === true &&
    value.liveProviderExecution ===
      "blocked" &&
    value.externalDelivery === "blocked" &&
    value.paymentExecution === "blocked" &&
    value.publicLaunch === "blocked"
  );
}

function containsForbiddenResponseKey(
  value: unknown,
  depth = 0,
): boolean {
  if (depth > 8) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      containsForbiddenResponseKey(
        item,
        depth + 1,
      ),
    );
  }

  if (!isPlainRecord(value)) {
    return false;
  }

  for (const [key, child] of Object.entries(
    value,
  )) {
    if (
      FORBIDDEN_RESPONSE_KEYS.has(key) ||
      containsForbiddenResponseKey(
        child,
        depth + 1,
      )
    ) {
      return true;
    }
  }

  return false;
}

function cloneJsonRecord(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return JSON.parse(
    JSON.stringify(value),
  ) as Record<string, unknown>;
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (
    typeof value !== "object" ||
    value === null ||
    Object.isFrozen(value)
  ) {
    return value as Readonly<T>;
  }

  Object.freeze(value);

  for (const child of Object.values(
    value as Record<string, unknown>,
  )) {
    deepFreeze(child);
  }

  return value as Readonly<T>;
}

function defaultGeneratedIdentifier(
  prefix: string,
): string {
  const cryptoApi = globalThis.crypto;

  if (
    !cryptoApi ||
    typeof cryptoApi.randomUUID !==
      "function"
  ) {
    throw consoleError(
      "IDENTIFIER_GENERATION_FAILED",
      "A secure internal pilot request identifier could not be generated.",
    );
  }

  return `${prefix}-${cryptoApi.randomUUID()}`;
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is ControlledInternalPilotOwnerConsoleRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !isOpaqueToken(
      runtime.authorityCsrfToken,
    ) ||
    typeof runtime.fetch !== "function" ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    ) ||
    (
      runtime.createRequestId !==
        undefined &&
      typeof runtime.createRequestId !==
        "function"
    ) ||
    (
      runtime.createIdempotencyKey !==
        undefined &&
      typeof runtime.createIdempotencyKey !==
        "function"
    ) ||
    (
      runtime.maxBatchSize !== undefined &&
      (
        !Number.isInteger(
          runtime.maxBatchSize,
        ) ||
        runtime.maxBatchSize < 1 ||
        runtime.maxBatchSize > 100
      )
    ) ||
    (
      runtime.maxResponseBodyBytes !==
        undefined &&
      (
        !Number.isInteger(
          runtime.maxResponseBodyBytes,
        ) ||
        runtime.maxResponseBodyBytes < 1_024 ||
        runtime.maxResponseBodyBytes >
          262_144
      )
    )
  ) {
    throw consoleError(
      "INVALID_CONFIGURATION",
      "The controlled internal pilot owner console configuration is invalid.",
    );
  }
}

function validateIssueInput(
  input: unknown,
): asserts input is ControlledInternalPilotOwnerConsoleIssueInput {
  assertExactKeys(
    input,
    ISSUE_INPUT_KEYS,
    "INVALID_INPUT",
    "The internal pilot session issue input is invalid.",
  );

  if (
    !Number.isInteger(input.ttlSeconds) ||
    input.ttlSeconds < 300 ||
    input.ttlSeconds > 86_400
  ) {
    throw consoleError(
      "INVALID_INPUT",
      "The internal pilot session TTL is invalid.",
    );
  }
}

function validateRunInput(
  input: unknown,
  maxBatchSize: number,
): asserts input is ControlledInternalPilotOwnerConsoleRunInput {
  assertExactKeys(
    input,
    RUN_INPUT_KEYS,
    "INVALID_INPUT",
    "The sandbox worker run input is invalid.",
  );

  if (
    !Number.isInteger(input.batchSize) ||
    input.batchSize < 1 ||
    input.batchSize > maxBatchSize
  ) {
    throw consoleError(
      "INVALID_INPUT",
      "The sandbox worker batch size is invalid.",
    );
  }
}

function validateGeneratedIdentifier(
  value: unknown,
  kind: "request" | "idempotency",
): string {
  if (!isIdentifier(value, 8)) {
    throw consoleError(
      "IDENTIFIER_GENERATION_FAILED",
      `A valid ${kind} identifier could not be generated.`,
    );
  }

  return value;
}

function validateCurrentTime(
  now: () => Date,
): string {
  const value = now();

  if (
    !(value instanceof Date) ||
    Number.isNaN(value.getTime())
  ) {
    throw consoleError(
      "CLOCK_INVALID",
      "The controlled internal pilot console clock is invalid.",
    );
  }

  return value.toISOString();
}

function validateResponseHeaders(
  response: Response,
): void {
  const contentType =
    response.headers.get(
      "content-type",
    );

  const cacheControl =
    response.headers.get(
      "cache-control",
    );

  if (
    contentType !==
      "application/json; charset=utf-8" ||
    cacheControl !== "no-store"
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned invalid security headers.",
    );
  }
}

function parseSafeServiceError(
  value: unknown,
): ControlledInternalPilotOwnerConsoleError {
  assertExactKeys(
    value,
    ERROR_RESPONSE_KEYS,
    "RESPONSE_INVALID",
    "The controlled internal pilot service returned an invalid error response.",
  );

  if (
    value.ok !== false ||
    !isPlainRecord(value.error)
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned an invalid error response.",
    );
  }

  assertExactKeys(
    value.error,
    ERROR_DETAIL_KEYS,
    "RESPONSE_INVALID",
    "The controlled internal pilot service returned an invalid error response.",
  );

  if (
    typeof value.error.code !== "string" ||
    !/^[A-Z][A-Z0-9_]{2,63}$/.test(
      value.error.code,
    ) ||
    typeof value.error.message !==
      "string" ||
    value.error.message.length < 1 ||
    value.error.message.length > 256 ||
    /[\r\n\0]/.test(
      value.error.message,
    )
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned an invalid error response.",
    );
  }

  return consoleError(
    value.error.code,
    value.error.message,
  );
}

async function requestJson(
  runtime: ControlledInternalPilotOwnerConsoleRuntime,
  pathName: string,
  csrfToken: string,
  body: Record<string, unknown>,
  additionalHeaders:
    Readonly<Record<string, string>>,
  maxResponseBodyBytes: number,
): Promise<Record<string, unknown>> {
  let response: Response;

  try {
    response = await runtime.fetch(
      pathName,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        redirect: "error",
        headers: {
          "content-type":
            "application/json",
          "x-nexus-internal-pilot":
            "sandbox-v1",
          "x-nexus-csrf-token":
            csrfToken,
          ...additionalHeaders,
        },
        body: JSON.stringify(body),
      },
    );
  } catch {
    throw consoleError(
      "FETCH_FAILED",
      "The controlled internal pilot service could not be reached safely.",
    );
  }

  if (
    typeof response !== "object" ||
    response === null ||
    !Number.isInteger(response.status) ||
    typeof response.text !== "function" ||
    typeof response.headers?.get !==
      "function"
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned an invalid response.",
    );
  }

  validateResponseHeaders(response);

  let responseText: string;

  try {
    responseText = await response.text();
  } catch {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot response could not be read safely.",
    );
  }

  if (
    Buffer.byteLength(
      responseText,
      "utf8",
    ) > maxResponseBodyBytes
  ) {
    throw consoleError(
      "RESPONSE_TOO_LARGE",
      "The controlled internal pilot response exceeded the safe size limit.",
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned invalid JSON.",
    );
  }

  if (
    !isPlainRecord(parsed) ||
    containsForbiddenResponseKey(parsed)
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned an unsafe response.",
    );
  }

  if (response.status >= 400) {
    throw parseSafeServiceError(parsed);
  }

  if (
    response.status < 200 ||
    response.status > 299
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The controlled internal pilot service returned an invalid status.",
    );
  }

  return parsed;
}

function validateIssueResponse(
  value: Record<string, unknown>,
  tenantId: string,
): ActivePilotSession {
  assertExactKeys(
    value,
    ISSUE_RESPONSE_KEYS,
    "RESPONSE_INVALID",
    "The session issue response contract is invalid.",
  );

  const issuedAt =
    parseIsoTimestamp(value.issuedAt);

  const expiresAt =
    parseIsoTimestamp(value.expiresAt);

  if (
    value.ok !== true ||
    value.operation !== "issue" ||
    value.tenantId !== tenantId ||
    !isIdentifier(value.actorId, 3) ||
    !isIdentifier(value.sessionId, 8) ||
    !isOpaqueToken(value.csrfToken) ||
    issuedAt === null ||
    expiresAt === null ||
    new Date(expiresAt).getTime() <=
      new Date(issuedAt).getTime() ||
    !hasSafetyBoundaries(value)
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The session issue response binding is invalid.",
    );
  }

  return Object.freeze({
    sessionId: value.sessionId,
    csrfToken: value.csrfToken,
    issuedAt,
    expiresAt,
  });
}

function validateRevokeResponse(
  value: Record<string, unknown>,
  tenantId: string,
  sessionId: string,
): void {
  assertExactKeys(
    value,
    REVOKE_RESPONSE_KEYS,
    "RESPONSE_INVALID",
    "The session revoke response contract is invalid.",
  );

  if (
    value.ok !== true ||
    value.operation !== "revoke" ||
    value.tenantId !== tenantId ||
    value.sessionId !== sessionId ||
    !isIdentifier(value.actorId, 3) ||
    value.revoked !== true ||
    typeof value.replay !== "boolean" ||
    parseIsoTimestamp(
      value.revokedAt,
    ) === null ||
    !hasSafetyBoundaries(value)
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The session revoke response binding is invalid.",
    );
  }
}

function validateWorkerResponse(
  value: Record<string, unknown>,
  command: StoredSandboxCommand,
  expectedReplay: boolean,
): ControlledInternalPilotOwnerConsoleRunState {
  assertExactKeys(
    value,
    WORKER_RESPONSE_KEYS,
    "RESPONSE_INVALID",
    "The sandbox worker response contract is invalid.",
  );

  if (
    value.ok !== true ||
    value.tenantId !== command.tenantId ||
    value.requestId !== command.requestId ||
    !isDigest(value.requestDigest) ||
    value.replay !== expectedReplay ||
    !isPlainRecord(value.result) ||
    containsForbiddenResponseKey(
      value.result,
    ) ||
    !hasSafetyBoundaries(value)
  ) {
    throw consoleError(
      "RESPONSE_INVALID",
      "The sandbox worker response binding is invalid.",
    );
  }

  return deepFreeze({
    requestId: command.requestId,
    idempotencyKey:
      command.idempotencyKey,
    requestedAt: command.requestedAt,
    requestDigest: value.requestDigest,
    replay: value.replay,
    result: cloneJsonRecord(
      value.result,
    ),
  });
}

function safeOperationError(
  error: unknown,
): ControlledInternalPilotOwnerConsoleError {
  if (
    error instanceof
    ControlledInternalPilotOwnerConsoleError
  ) {
    return error;
  }

  return consoleError(
    "SERVICE_ERROR",
    "The controlled internal pilot operation could not be completed safely.",
  );
}

export function createControlledInternalPilotOwnerConsole(
  runtime: ControlledInternalPilotOwnerConsoleRuntime,
): ControlledInternalPilotOwnerConsole {
  validateRuntime(runtime);

  const now = runtime.now ??
    (() => new Date());

  const createRequestId =
    runtime.createRequestId ??
    (() =>
      defaultGeneratedIdentifier(
        "request",
      ));

  const createIdempotencyKey =
    runtime.createIdempotencyKey ??
    (() =>
      defaultGeneratedIdentifier(
        "idem",
      ));

  const maxBatchSize =
    runtime.maxBatchSize ??
    DEFAULT_MAX_BATCH_SIZE;

  const maxResponseBodyBytes =
    runtime.maxResponseBodyBytes ??
    DEFAULT_MAX_RESPONSE_BODY_BYTES;

  let phase:
    ControlledInternalPilotOwnerConsolePhase =
      "authority-ready";

  let busy = false;
  let lifecycleClosed = false;
  let activeSession:
    ActivePilotSession | null = null;
  let lastCommand:
    StoredSandboxCommand | null = null;
  let lastRun:
    ControlledInternalPilotOwnerConsoleRunState | null =
      null;
  let lastError:
    ControlledInternalPilotOwnerConsoleErrorState | null =
      null;

  function statusMessage(): string {
    switch (phase) {
      case "authority-ready":
        return "Trusted owner authority is ready to issue a controlled pilot session.";
      case "issuing-session":
        return "Issuing the secure controlled pilot session.";
      case "session-ready":
        return "Secure controlled pilot session is ready.";
      case "running-sandbox":
        return "Running the owner-approved sandbox worker cycle.";
      case "completed":
        return lastRun?.replay
          ? "Sandbox result replay verified without duplicate execution."
          : "Sandbox worker cycle completed safely.";
      case "revoking-session":
        return "Revoking the controlled pilot session.";
      case "revoked":
        return "Controlled pilot session revoked.";
      case "error":
        return lastError?.message ??
          "The controlled pilot operation failed safely.";
    }
  }

  function getSnapshot():
    ControlledInternalPilotOwnerConsoleSnapshot {
    const canIssueSession =
      !busy &&
      !lifecycleClosed &&
      activeSession === null;

    const canRunSandbox =
      !busy &&
      !lifecycleClosed &&
      activeSession !== null;

    const canReplayLastRun =
      canRunSandbox &&
      lastCommand !== null &&
      lastRun !== null;

    const canRevokeSession =
      canRunSandbox;

    return deepFreeze({
      tenantId: runtime.tenantId,
      phase,
      statusMessage: statusMessage(),
      busy,
      activeSessionId:
        activeSession?.sessionId ??
        null,
      lastRun:
        lastRun === null
          ? null
          : {
              requestId:
                lastRun.requestId,
              idempotencyKey:
                lastRun.idempotencyKey,
              requestedAt:
                lastRun.requestedAt,
              requestDigest:
                lastRun.requestDigest,
              replay: lastRun.replay,
              result:
                cloneJsonRecord(
                  lastRun.result,
                ),
            },
      lastError:
        lastError === null
          ? null
          : {
              code: lastError.code,
              message:
                lastError.message,
            },
      canIssueSession,
      canRunSandbox,
      canReplayLastRun,
      canRevokeSession,
      ownerApprovalRequired: true,
      liveProviderExecution:
        "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    });
  }

  function assertNotBusy(): void {
    if (busy) {
      throw consoleError(
        "OPERATION_IN_PROGRESS",
        "Another controlled internal pilot operation is already in progress.",
      );
    }
  }

  async function executeOperation<T>(
    operationPhase:
      ControlledInternalPilotOwnerConsolePhase,
    work: () => Promise<T>,
  ): Promise<T> {
    assertNotBusy();

    busy = true;
    phase = operationPhase;
    lastError = null;

    try {
      return await work();
    } catch (error) {
      const safeError =
        safeOperationError(error);

      lastError = Object.freeze({
        code: safeError.code,
        message: safeError.message,
      });

      phase = "error";
      throw safeError;
    } finally {
      busy = false;
    }
  }

  async function executeWorkerCommand(
    command: StoredSandboxCommand,
    expectedReplay: boolean,
  ): Promise<ControlledInternalPilotOwnerConsoleSnapshot> {
    if (
      lifecycleClosed ||
      activeSession === null
    ) {
      throw consoleError(
        lifecycleClosed
          ? "CONSOLE_REVOKED"
          : "SESSION_REQUIRED",
        lifecycleClosed
          ? "The controlled internal pilot console has been revoked."
          : "A secure controlled pilot session is required.",
      );
    }

    return executeOperation(
      "running-sandbox",
      async () => {
        const response =
          await requestJson(
            runtime,
            INTERNAL_PILOT_WORKER_ROUTE_PATH,
            activeSession.csrfToken,
            command,
            {
              "x-nexus-idempotency-key":
                command.idempotencyKey,
            },
            maxResponseBodyBytes,
          );

        const validated =
          validateWorkerResponse(
            response,
            command,
            expectedReplay,
          );

        lastCommand =
          Object.freeze({
            ...command,
          });

        lastRun = validated;
        phase = "completed";

        return getSnapshot();
      },
    );
  }

  const ownerConsole:
    ControlledInternalPilotOwnerConsole = {
    getSnapshot,

    async issueSession(
      input:
        ControlledInternalPilotOwnerConsoleIssueInput,
    ): Promise<ControlledInternalPilotOwnerConsoleSnapshot> {
      validateIssueInput(input);
      assertNotBusy();

      if (lifecycleClosed) {
        throw consoleError(
          "CONSOLE_REVOKED",
          "The controlled internal pilot console has been revoked.",
        );
      }

      if (activeSession !== null) {
        throw consoleError(
          "SESSION_ALREADY_ACTIVE",
          "A controlled internal pilot session is already active.",
        );
      }

      return executeOperation(
        "issuing-session",
        async () => {
          const response =
            await requestJson(
              runtime,
              INTERNAL_PILOT_SESSION_ROUTE_PATH,
              runtime.authorityCsrfToken,
              {
                operation: "issue",
                tenantId:
                  runtime.tenantId,
                ownerApprovalGranted:
                  true,
                ttlSeconds:
                  input.ttlSeconds,
              },
              {},
              maxResponseBodyBytes,
            );

          activeSession =
            validateIssueResponse(
              response,
              runtime.tenantId,
            );

          phase = "session-ready";
          return getSnapshot();
        },
      );
    },

    async runSandboxCycle(
      input:
        ControlledInternalPilotOwnerConsoleRunInput,
    ): Promise<ControlledInternalPilotOwnerConsoleSnapshot> {
      validateRunInput(
        input,
        maxBatchSize,
      );

      if (
        lifecycleClosed ||
        activeSession === null
      ) {
        throw consoleError(
          lifecycleClosed
            ? "CONSOLE_REVOKED"
            : "SESSION_REQUIRED",
          lifecycleClosed
            ? "The controlled internal pilot console has been revoked."
            : "A secure controlled pilot session is required.",
        );
      }

      const command:
        StoredSandboxCommand = {
        tenantId: runtime.tenantId,
        requestId:
          validateGeneratedIdentifier(
            createRequestId(),
            "request",
          ),
        idempotencyKey:
          validateGeneratedIdentifier(
            createIdempotencyKey(),
            "idempotency",
          ),
        batchSize: input.batchSize,
        requestedAt:
          validateCurrentTime(now),
        executionMode: "sandbox",
      };

      return executeWorkerCommand(
        Object.freeze(command),
        false,
      );
    },

    async replayLastRun():
      Promise<ControlledInternalPilotOwnerConsoleSnapshot> {
      if (
        lifecycleClosed ||
        activeSession === null
      ) {
        throw consoleError(
          lifecycleClosed
            ? "CONSOLE_REVOKED"
            : "SESSION_REQUIRED",
          lifecycleClosed
            ? "The controlled internal pilot console has been revoked."
            : "A secure controlled pilot session is required.",
        );
      }

      if (
        lastCommand === null ||
        lastRun === null
      ) {
        throw consoleError(
          "REPLAY_NOT_AVAILABLE",
          "No completed sandbox command is available for replay verification.",
        );
      }

      return executeWorkerCommand(
        lastCommand,
        true,
      );
    },

    async revokeSession():
      Promise<ControlledInternalPilotOwnerConsoleSnapshot> {
      assertNotBusy();

      if (lifecycleClosed) {
        throw consoleError(
          "CONSOLE_REVOKED",
          "The controlled internal pilot console has already been revoked.",
        );
      }

      if (activeSession === null) {
        throw consoleError(
          "SESSION_REQUIRED",
          "A secure controlled pilot session is required.",
        );
      }

      const sessionToRevoke =
        activeSession;

      return executeOperation(
        "revoking-session",
        async () => {
          const response =
            await requestJson(
              runtime,
              INTERNAL_PILOT_SESSION_ROUTE_PATH,
              sessionToRevoke.csrfToken,
              {
                operation: "revoke",
                tenantId:
                  runtime.tenantId,
                sessionId:
                  sessionToRevoke.sessionId,
              },
              {},
              maxResponseBodyBytes,
            );

          validateRevokeResponse(
            response,
            runtime.tenantId,
            sessionToRevoke.sessionId,
          );

          activeSession = null;
          lastCommand = null;
          lastRun = null;
          lifecycleClosed = true;
          phase = "revoked";

          return getSnapshot();
        },
      );
    },
  };

  return Object.freeze(ownerConsole);
}
