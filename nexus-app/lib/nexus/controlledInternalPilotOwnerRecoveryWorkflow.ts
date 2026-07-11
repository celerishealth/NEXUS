import {
  ControlledInternalPilotOwnerConsoleError,
  type ControlledInternalPilotOwnerConsole,
  type ControlledInternalPilotOwnerConsoleSnapshot,
} from "./controlledInternalPilotOwnerConsole";

export type ControlledInternalPilotRecoveryPhase =
  | "ready"
  | "session-ready"
  | "running"
  | "failed-retryable"
  | "failed-terminal"
  | "recovering"
  | "completed"
  | "revoking"
  | "revoked"
  | "error";

export type ControlledInternalPilotRecoveryErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "OPERATION_IN_PROGRESS"
  | "RETRY_NOT_AVAILABLE"
  | "TERMINAL_FAILURE"
  | "RECOVERY_ATTEMPTS_EXHAUSTED"
  | "CONSOLE_REVOKED"
  | "CONSOLE_STATE_INVALID"
  | "REPLAY_IDENTITY_MISMATCH"
  | "RECOVERY_OPERATION_FAILED";

export class ControlledInternalPilotRecoveryError extends Error {
  readonly code: string;

  constructor(
    code: string,
    message: string,
  ) {
    super(message);
    this.name =
      "ControlledInternalPilotRecoveryError";
    this.code = code;
  }
}

export interface ControlledInternalPilotOwnerRecoveryRuntime {
  tenantId: string;
  ownerConsole: ControlledInternalPilotOwnerConsole;
  maxRecoveryAttempts?: number;
}

export interface ControlledInternalPilotRecoveryRunInput {
  batchSize: number;
}

export interface ControlledInternalPilotRecoveryFailure {
  code: string;
  message: string;
  retryable: boolean;
}

export interface ControlledInternalPilotOwnerRecoverySnapshot {
  tenantId: string;
  phase: ControlledInternalPilotRecoveryPhase;
  statusMessage: string;
  busy: boolean;
  recoveryAttempt: number;
  maxRecoveryAttempts: number;
  pendingBatchSize: number | null;
  lastFailure:
    ControlledInternalPilotRecoveryFailure | null;
  console:
    ControlledInternalPilotOwnerConsoleSnapshot;
  canRetryFailedRun: boolean;
  ownerApprovalRequired: true;
  liveProviderExecution: "blocked";
  externalDelivery: "blocked";
  paymentExecution: "blocked";
  publicLaunch: "blocked";
}

export interface ControlledInternalPilotOwnerRecoveryWorkflow {
  getSnapshot():
    ControlledInternalPilotOwnerRecoverySnapshot;

  issueSession(
    ttlSeconds: number,
  ): Promise<ControlledInternalPilotOwnerRecoverySnapshot>;

  runSandboxCycle(
    input: ControlledInternalPilotRecoveryRunInput,
  ): Promise<ControlledInternalPilotOwnerRecoverySnapshot>;

  retryFailedRun():
    Promise<ControlledInternalPilotOwnerRecoverySnapshot>;

  replayLastRun():
    Promise<ControlledInternalPilotOwnerRecoverySnapshot>;

  revokeSession():
    Promise<ControlledInternalPilotOwnerRecoverySnapshot>;
}

const DEFAULT_MAX_RECOVERY_ATTEMPTS = 2;

const RUN_INPUT_KEYS = [
  "batchSize",
] as const;

const VALID_CONSOLE_PHASES = new Set([
  "authority-ready",
  "issuing-session",
  "session-ready",
  "running-sandbox",
  "completed",
  "revoking-session",
  "revoked",
  "error",
]);

const RETRYABLE_FAILURE_CODES = new Set([
  "AUDIT_UNAVAILABLE",
  "AUTHENTICATION_UNAVAILABLE",
  "BODY_READ_FAILED",
  "CYCLE_EXECUTION_FAILED",
  "FETCH_FAILED",
  "INTERNAL_ERROR",
  "RECEIPT_UNAVAILABLE",
  "ROUTE_EXECUTION_FAILED",
  "ROUTER_EXECUTION_FAILED",
  "SESSION_SERVICE_UNAVAILABLE",
  "SERVICE_ERROR",
  "SERVICE_UNAVAILABLE",
]);

const TERMINAL_FAILURE_CODES = new Set([
  "AUTHENTICATION_REQUIRED",
  "CONSOLE_REVOKED",
  "CSRF_TOKEN_INVALID",
  "CSRF_TOKEN_REQUIRED",
  "IDEMPOTENCY_CONFLICT",
  "INVALID_INPUT",
  "INVALID_REQUEST",
  "OWNER_APPROVAL_REQUIRED",
  "OWNER_ROLE_REQUIRED",
  "SESSION_EXPIRED",
  "SESSION_REQUIRED",
  "TENANT_MISMATCH",
]);

const FORBIDDEN_SNAPSHOT_KEYS = new Set([
  "authorization",
  "cookie",
  "csrfToken",
  "csrf_token",
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

function recoveryError(
  code: string,
  message: string,
): ControlledInternalPilotRecoveryError {
  return new ControlledInternalPilotRecoveryError(
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

function isDigest(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-f0-9]{64}$/.test(value)
  );
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

function containsForbiddenSnapshotKey(
  value: unknown,
  depth = 0,
): boolean {
  if (depth > 8) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      containsForbiddenSnapshotKey(
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
      FORBIDDEN_SNAPSHOT_KEYS.has(key) ||
      containsForbiddenSnapshotKey(
        child,
        depth + 1,
      )
    ) {
      return true;
    }
  }

  return false;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value),
  ) as T;
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

function validateRuntime(
  runtime: unknown,
): asserts runtime is ControlledInternalPilotOwnerRecoveryRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !isPlainRecord(runtime.ownerConsole) ||
    typeof runtime.ownerConsole.getSnapshot !==
      "function" ||
    typeof runtime.ownerConsole.issueSession !==
      "function" ||
    typeof runtime.ownerConsole.runSandboxCycle !==
      "function" ||
    typeof runtime.ownerConsole.replayLastRun !==
      "function" ||
    typeof runtime.ownerConsole.revokeSession !==
      "function" ||
    (
      runtime.maxRecoveryAttempts !== undefined &&
      (
        typeof runtime.maxRecoveryAttempts !== "number" ||
        !Number.isInteger(runtime.maxRecoveryAttempts) ||
        runtime.maxRecoveryAttempts < 1 ||
        runtime.maxRecoveryAttempts > 5
      )
    )
  ) {
    throw recoveryError(
      "INVALID_CONFIGURATION",
      "The controlled internal pilot recovery workflow configuration is invalid.",
    );
  }
}

function validateRunInput(
  input: unknown,
): asserts input is ControlledInternalPilotRecoveryRunInput {
  if (!isPlainRecord(input)) {
    throw recoveryError(
      "INVALID_INPUT",
      "The controlled sandbox recovery input is invalid.",
    );
  }

  const actual =
    Object.keys(input).sort();

  const expected =
    [...RUN_INPUT_KEYS].sort();

  if (
    actual.length !== expected.length ||
    actual.some(
      (key, index) =>
        key !== expected[index],
    ) ||
    typeof input.batchSize !== "number" ||
    !Number.isInteger(input.batchSize) ||
    input.batchSize < 1 ||
    input.batchSize > 100
  ) {
    throw recoveryError(
      "INVALID_INPUT",
      "The controlled sandbox recovery input is invalid.",
    );
  }
}

function validateConsoleSnapshot(
  value: unknown,
  tenantId: string,
): ControlledInternalPilotOwnerConsoleSnapshot {
  if (
    !isPlainRecord(value) ||
    value.tenantId !== tenantId ||
    typeof value.phase !== "string" ||
    !VALID_CONSOLE_PHASES.has(
      value.phase,
    ) ||
    typeof value.statusMessage !==
      "string" ||
    value.statusMessage.length < 1 ||
    value.statusMessage.length > 512 ||
    /[\r\n\0]/.test(
      value.statusMessage,
    ) ||
    typeof value.busy !== "boolean" ||
    (
      value.activeSessionId !== null &&
      !isIdentifier(
        value.activeSessionId,
        8,
      )
    ) ||
    typeof value.canIssueSession !==
      "boolean" ||
    typeof value.canRunSandbox !==
      "boolean" ||
    typeof value.canReplayLastRun !==
      "boolean" ||
    typeof value.canRevokeSession !==
      "boolean" ||
    !hasSafetyBoundaries(value) ||
    containsForbiddenSnapshotKey(value)
  ) {
    throw recoveryError(
      "CONSOLE_STATE_INVALID",
      "The controlled internal pilot console returned an invalid protected state.",
    );
  }

  if (value.lastRun !== null) {
    if (
      !isPlainRecord(value.lastRun) ||
      !isIdentifier(
        value.lastRun.requestId,
        8,
      ) ||
      !isIdentifier(
        value.lastRun.idempotencyKey,
        8,
      ) ||
      typeof value.lastRun.requestedAt !==
        "string" ||
      !isDigest(
        value.lastRun.requestDigest,
      ) ||
      typeof value.lastRun.replay !==
        "boolean" ||
      !isPlainRecord(
        value.lastRun.result,
      ) ||
      containsForbiddenSnapshotKey(
        value.lastRun.result,
      )
    ) {
      throw recoveryError(
        "CONSOLE_STATE_INVALID",
        "The controlled internal pilot console returned an invalid protected run state.",
      );
    }
  }

  if (value.lastError !== null) {
    if (
      !isPlainRecord(value.lastError) ||
      typeof value.lastError.code !==
        "string" ||
      !/^[A-Z][A-Z0-9_]{2,63}$/.test(
        value.lastError.code,
      ) ||
      typeof value.lastError.message !==
        "string" ||
      value.lastError.message.length < 1 ||
      value.lastError.message.length > 256 ||
      /[\r\n\0]/.test(
        value.lastError.message,
      )
    ) {
      throw recoveryError(
        "CONSOLE_STATE_INVALID",
        "The controlled internal pilot console returned an invalid protected error state.",
      );
    }
  }

  return deepFreeze(
    cloneJson(
      value as unknown as
        ControlledInternalPilotOwnerConsoleSnapshot,
    ),
  ) as ControlledInternalPilotOwnerConsoleSnapshot;
}

function toSafeFailure(
  error: unknown,
): ControlledInternalPilotRecoveryError {
  if (
    error instanceof
    ControlledInternalPilotRecoveryError
  ) {
    return error;
  }

  if (
    error instanceof
    ControlledInternalPilotOwnerConsoleError &&
    typeof error.code === "string" &&
    /^[A-Z][A-Z0-9_]{2,63}$/.test(
      error.code,
    ) &&
    typeof error.message === "string" &&
    error.message.length >= 1 &&
    error.message.length <= 256 &&
    !/[\r\n\0]/.test(error.message)
  ) {
    return recoveryError(
      error.code,
      error.message,
    );
  }

  return recoveryError(
    "RECOVERY_OPERATION_FAILED",
    "The controlled internal pilot recovery operation failed safely.",
  );
}

function isRetryableFailure(
  code: string,
): boolean {
  return RETRYABLE_FAILURE_CODES.has(
    code,
  );
}

function isTerminalFailure(
  code: string,
): boolean {
  return TERMINAL_FAILURE_CODES.has(
    code,
  );
}

export function createControlledInternalPilotOwnerRecoveryWorkflow(
  runtime:
    ControlledInternalPilotOwnerRecoveryRuntime,
): ControlledInternalPilotOwnerRecoveryWorkflow {
  validateRuntime(runtime);

  const maxRecoveryAttempts =
    runtime.maxRecoveryAttempts ??
    DEFAULT_MAX_RECOVERY_ATTEMPTS;

  let phase:
    ControlledInternalPilotRecoveryPhase =
      "ready";

  let busy = false;
  let revoked = false;
  let recoveryAttempt = 0;
  let pendingBatchSize:
    number | null = null;

  let lastFailure:
    ControlledInternalPilotRecoveryFailure | null =
      null;

  let lastValidatedConsoleSnapshot =
    validateConsoleSnapshot(
      runtime.ownerConsole.getSnapshot(),
      runtime.tenantId,
    );

  function statusMessage(): string {
    switch (phase) {
      case "ready":
        return "Controlled internal pilot recovery workflow is ready.";
      case "session-ready":
        return "Secure owner session is ready for sandbox execution.";
      case "running":
        return "Running the owner-approved sandbox command.";
      case "failed-retryable":
        return "Sandbox execution failed safely and can be retried with a new command identity.";
      case "failed-terminal":
        return "Sandbox execution was blocked by a terminal safety condition.";
      case "recovering":
        return `Running safe recovery attempt ${recoveryAttempt} of ${maxRecoveryAttempts}.`;
      case "completed":
        return lastValidatedConsoleSnapshot
          .lastRun?.replay
          ? "Completed sandbox result replay verified without duplicate execution."
          : recoveryAttempt > 0
            ? "Sandbox execution recovered safely with a new command identity."
            : "Sandbox execution completed safely.";
      case "revoking":
        return "Revoking the secure controlled pilot session.";
      case "revoked":
        return "Controlled internal pilot session revoked.";
      case "error":
        return lastFailure?.message ??
          "The controlled internal pilot recovery operation failed safely.";
    }
  }

  function getSnapshot():
    ControlledInternalPilotOwnerRecoverySnapshot {
    const canRetryFailedRun =
      !busy &&
      !revoked &&
      phase === "failed-retryable" &&
      pendingBatchSize !== null &&
      recoveryAttempt <
        maxRecoveryAttempts;

    return deepFreeze({
      tenantId: runtime.tenantId,
      phase,
      statusMessage: statusMessage(),
      busy,
      recoveryAttempt,
      maxRecoveryAttempts,
      pendingBatchSize,
      lastFailure:
        lastFailure === null
          ? null
          : {
              code: lastFailure.code,
              message:
                lastFailure.message,
              retryable:
                lastFailure.retryable,
            },
      console:
        cloneJson(
          lastValidatedConsoleSnapshot,
        ),
      canRetryFailedRun,
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
      throw recoveryError(
        "OPERATION_IN_PROGRESS",
        "Another controlled internal pilot recovery operation is already in progress.",
      );
    }
  }

  function assertNotRevoked(): void {
    if (revoked) {
      throw recoveryError(
        "CONSOLE_REVOKED",
        "The controlled internal pilot recovery workflow has been revoked.",
      );
    }
  }

  function refreshConsoleSnapshot():
    ControlledInternalPilotOwnerConsoleSnapshot {
    lastValidatedConsoleSnapshot =
      validateConsoleSnapshot(
        runtime.ownerConsole.getSnapshot(),
        runtime.tenantId,
      );

    return lastValidatedConsoleSnapshot;
  }

  function recordFailure(
    safeError:
      ControlledInternalPilotRecoveryError,
    batchSize: number | null,
  ): never {
    const retryable =
      isRetryableFailure(
        safeError.code,
      );

    const terminal =
      isTerminalFailure(
        safeError.code,
      );

    lastFailure =
      Object.freeze({
        code: safeError.code,
        message: safeError.message,
        retryable,
      });

    if (retryable) {
      pendingBatchSize =
        batchSize;

      phase =
        "failed-retryable";
    } else {
      pendingBatchSize = null;
      phase =
        terminal
          ? "failed-terminal"
          : "error";
    }

    throw safeError;
  }

  async function executeSandbox(
    batchSize: number,
    recovery: boolean,
  ): Promise<ControlledInternalPilotOwnerRecoverySnapshot> {
    assertNotBusy();
    assertNotRevoked();

    busy = true;
    phase = recovery
      ? "recovering"
      : "running";

    lastFailure = null;

    try {
      const result =
        await runtime.ownerConsole.runSandboxCycle({
          batchSize,
        });

      lastValidatedConsoleSnapshot =
        validateConsoleSnapshot(
          result,
          runtime.tenantId,
        );

      if (
        lastValidatedConsoleSnapshot.phase !==
          "completed" ||
        lastValidatedConsoleSnapshot.lastRun ===
          null ||
        lastValidatedConsoleSnapshot.lastRun
          .replay !== false
      ) {
        throw recoveryError(
          "CONSOLE_STATE_INVALID",
          "The controlled internal pilot console did not return a valid completed sandbox result.",
        );
      }

      pendingBatchSize = null;
      phase = "completed";

      return getSnapshot();
    } catch (error) {
      const safeError =
        toSafeFailure(error);

      try {
        refreshConsoleSnapshot();
      } catch {
        // Preserve the original safe operation failure.
      }

      return recordFailure(
        safeError,
        batchSize,
      );
    } finally {
      busy = false;
    }
  }

  return Object.freeze({
    getSnapshot,

    async issueSession(
      ttlSeconds: number,
    ): Promise<ControlledInternalPilotOwnerRecoverySnapshot> {
      assertNotBusy();
      assertNotRevoked();

      if (
        !Number.isInteger(ttlSeconds) ||
        ttlSeconds < 300 ||
        ttlSeconds > 86_400
      ) {
        throw recoveryError(
          "INVALID_INPUT",
          "The controlled internal pilot session TTL is invalid.",
        );
      }

      busy = true;
      lastFailure = null;

      try {
        const result =
          await runtime.ownerConsole.issueSession({
            ttlSeconds,
          });

        lastValidatedConsoleSnapshot =
          validateConsoleSnapshot(
            result,
            runtime.tenantId,
          );

        if (
          lastValidatedConsoleSnapshot.phase !==
            "session-ready" ||
          lastValidatedConsoleSnapshot
            .activeSessionId === null ||
          lastValidatedConsoleSnapshot
            .canRunSandbox !== true
        ) {
          throw recoveryError(
            "CONSOLE_STATE_INVALID",
            "The controlled internal pilot console did not return a valid session-ready state.",
          );
        }

        phase = "session-ready";
        return getSnapshot();
      } catch (error) {
        const safeError =
          toSafeFailure(error);

        lastFailure =
          Object.freeze({
            code: safeError.code,
            message:
              safeError.message,
            retryable: false,
          });

        phase = "error";
        throw safeError;
      } finally {
        busy = false;
      }
    },

    async runSandboxCycle(
      input:
        ControlledInternalPilotRecoveryRunInput,
    ): Promise<ControlledInternalPilotOwnerRecoverySnapshot> {
      validateRunInput(input);

      recoveryAttempt = 0;
      pendingBatchSize = null;
      lastFailure = null;

      return executeSandbox(
        input.batchSize,
        false,
      );
    },

    async retryFailedRun():
      Promise<ControlledInternalPilotOwnerRecoverySnapshot> {
      assertNotBusy();
      assertNotRevoked();

      if (
        phase === "failed-terminal" ||
        (
          lastFailure !== null &&
          isTerminalFailure(
            lastFailure.code,
          )
        )
      ) {
        throw recoveryError(
          "TERMINAL_FAILURE",
          "The failed sandbox operation cannot be retried because a terminal safety condition was reached.",
        );
      }

      if (
        phase !== "failed-retryable" ||
        pendingBatchSize === null ||
        lastFailure === null ||
        lastFailure.retryable !== true
      ) {
        throw recoveryError(
          "RETRY_NOT_AVAILABLE",
          "No safely retryable sandbox failure is available.",
        );
      }

      if (
        recoveryAttempt >=
        maxRecoveryAttempts
      ) {
        throw recoveryError(
          "RECOVERY_ATTEMPTS_EXHAUSTED",
          "The controlled sandbox recovery attempt limit has been reached.",
        );
      }

      recoveryAttempt += 1;

      return executeSandbox(
        pendingBatchSize,
        true,
      );
    },

    async replayLastRun():
      Promise<ControlledInternalPilotOwnerRecoverySnapshot> {
      assertNotBusy();
      assertNotRevoked();

      const before =
        refreshConsoleSnapshot();

      if (
        before.lastRun === null ||
        before.phase !== "completed"
      ) {
        throw recoveryError(
          "RETRY_NOT_AVAILABLE",
          "No completed sandbox result is available for replay verification.",
        );
      }

      const expectedRequestId =
        before.lastRun.requestId;

      const expectedIdempotencyKey =
        before.lastRun.idempotencyKey;

      busy = true;
      lastFailure = null;

      try {
        const result =
          await runtime.ownerConsole.replayLastRun();

        lastValidatedConsoleSnapshot =
          validateConsoleSnapshot(
            result,
            runtime.tenantId,
          );

        const replay =
          lastValidatedConsoleSnapshot
            .lastRun;

        if (
          replay === null ||
          replay.replay !== true ||
          replay.requestId !==
            expectedRequestId ||
          replay.idempotencyKey !==
            expectedIdempotencyKey
        ) {
          throw recoveryError(
            "REPLAY_IDENTITY_MISMATCH",
            "The completed sandbox replay identity did not match the original command.",
          );
        }

        phase = "completed";
        return getSnapshot();
      } catch (error) {
        const safeError =
          toSafeFailure(error);

        lastFailure =
          Object.freeze({
            code: safeError.code,
            message:
              safeError.message,
            retryable: false,
          });

        phase = "error";
        throw safeError;
      } finally {
        busy = false;
      }
    },

    async revokeSession():
      Promise<ControlledInternalPilotOwnerRecoverySnapshot> {
      assertNotBusy();
      assertNotRevoked();

      busy = true;
      phase = "revoking";
      lastFailure = null;

      try {
        const result =
          await runtime.ownerConsole.revokeSession();

        lastValidatedConsoleSnapshot =
          validateConsoleSnapshot(
            result,
            runtime.tenantId,
          );

        if (
          lastValidatedConsoleSnapshot.phase !==
            "revoked" ||
          lastValidatedConsoleSnapshot
            .activeSessionId !== null ||
          lastValidatedConsoleSnapshot
            .canRunSandbox !== false
        ) {
          throw recoveryError(
            "CONSOLE_STATE_INVALID",
            "The controlled internal pilot console did not return a valid revoked state.",
          );
        }

        revoked = true;
        pendingBatchSize = null;
        lastFailure = null;
        phase = "revoked";

        return getSnapshot();
      } catch (error) {
        const safeError =
          toSafeFailure(error);

        lastFailure =
          Object.freeze({
            code: safeError.code,
            message:
              safeError.message,
            retryable: false,
          });

        phase = "error";
        throw safeError;
      } finally {
        busy = false;
      }
    },
  });
}
