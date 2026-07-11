import {
  createHash,
} from "node:crypto";

import type {
  ControlledInternalPilotOwnerRecoverySnapshot,
  ControlledInternalPilotOwnerRecoveryWorkflow,
} from "./controlledInternalPilotOwnerRecoveryWorkflow";

export type ControlledInternalPilotReadinessProbePhase =
  | "idle"
  | "running"
  | "ready"
  | "not-ready";

export type ControlledInternalPilotReadinessProbeStatus =
  | "ready"
  | "not-ready";

export type ControlledInternalPilotReadinessProbeCheckName =
  | "initial-safety-boundaries"
  | "secure-session-issue"
  | "sandbox-execution"
  | "idempotent-replay"
  | "secure-session-revocation"
  | "final-safety-boundaries"
  | "failure-cleanup-revocation";

export type ControlledInternalPilotReadinessProbeErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_INPUT"
  | "OPERATION_IN_PROGRESS"
  | "PROBE_ALREADY_COMPLETED"
  | "WORKFLOW_STATE_INVALID"
  | "CLOCK_INVALID"
  | "PROBE_ID_INVALID"
  | "READINESS_PROBE_FAILED";

export class ControlledInternalPilotReadinessProbeError extends Error {
  readonly code: string;

  constructor(
    code: string,
    message: string,
  ) {
    super(message);
    this.name =
      "ControlledInternalPilotReadinessProbeError";
    this.code = code;
  }
}

export interface ControlledInternalPilotReadinessProbeRuntime {
  tenantId: string;
  workflow: ControlledInternalPilotOwnerRecoveryWorkflow;
  now?: () => Date;
  createProbeId?: () => string;
}

export interface ControlledInternalPilotReadinessProbeInput {
  ttlSeconds: number;
  batchSize: number;
}

export interface ControlledInternalPilotReadinessCheck {
  name: ControlledInternalPilotReadinessProbeCheckName;
  passed: boolean;
  code: string;
}

export interface ControlledInternalPilotReadinessFailure {
  code: string;
  message: string;
}

export interface ControlledInternalPilotReadinessReport {
  tenantId: string;
  probeId: string;
  status: ControlledInternalPilotReadinessProbeStatus;
  startedAt: string;
  completedAt: string;
  checks: readonly ControlledInternalPilotReadinessCheck[];
  failure: ControlledInternalPilotReadinessFailure | null;
  evidenceDigest: string;
  ownerApprovalRequired: true;
  liveProviderExecution: "blocked";
  externalDelivery: "blocked";
  paymentExecution: "blocked";
  publicLaunch: "blocked";
}

export interface ControlledInternalPilotReadinessProbeSnapshot {
  tenantId: string;
  phase: ControlledInternalPilotReadinessProbePhase;
  busy: boolean;
  canRun: boolean;
  report: ControlledInternalPilotReadinessReport | null;
  ownerApprovalRequired: true;
  liveProviderExecution: "blocked";
  externalDelivery: "blocked";
  paymentExecution: "blocked";
  publicLaunch: "blocked";
}

export interface ControlledInternalPilotReadinessProbe {
  getSnapshot():
    ControlledInternalPilotReadinessProbeSnapshot;

  run(
    input: ControlledInternalPilotReadinessProbeInput,
  ): Promise<ControlledInternalPilotReadinessProbeSnapshot>;
}

const INPUT_KEYS = [
  "batchSize",
  "ttlSeconds",
] as const;

const VALID_RECOVERY_PHASES = new Set([
  "ready",
  "session-ready",
  "running",
  "failed-retryable",
  "failed-terminal",
  "recovering",
  "completed",
  "revoking",
  "revoked",
  "error",
]);

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

const FORBIDDEN_STATE_KEYS = new Set([
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

function probeError(
  code: string,
  message: string,
): ControlledInternalPilotReadinessProbeError {
  return new ControlledInternalPilotReadinessProbeError(
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

function containsForbiddenStateKey(
  value: unknown,
  depth = 0,
): boolean {
  if (depth > 10) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((item) =>
      containsForbiddenStateKey(
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
      FORBIDDEN_STATE_KEYS.has(key) ||
      containsForbiddenStateKey(
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

function canonicalize(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (isPlainRecord(value)) {
    const result:
      Record<string, unknown> = {};

    for (
      const key
      of Object.keys(value).sort()
    ) {
      result[key] =
        canonicalize(value[key]);
    }

    return result;
  }

  return value;
}

function createEvidenceDigest(
  value: Record<string, unknown>,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        canonicalize(value),
      ),
      "utf8",
    )
    .digest("hex");
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is ControlledInternalPilotReadinessProbeRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    !isPlainRecord(runtime.workflow) ||
    typeof runtime.workflow.getSnapshot !==
      "function" ||
    typeof runtime.workflow.issueSession !==
      "function" ||
    typeof runtime.workflow.runSandboxCycle !==
      "function" ||
    typeof runtime.workflow.retryFailedRun !==
      "function" ||
    typeof runtime.workflow.replayLastRun !==
      "function" ||
    typeof runtime.workflow.revokeSession !==
      "function" ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    ) ||
    (
      runtime.createProbeId !==
        undefined &&
      typeof runtime.createProbeId !==
        "function"
    )
  ) {
    throw probeError(
      "INVALID_CONFIGURATION",
      "The controlled internal pilot readiness probe configuration is invalid.",
    );
  }
}

function validateInput(
  input: unknown,
): asserts input is ControlledInternalPilotReadinessProbeInput {
  if (!isPlainRecord(input)) {
    throw probeError(
      "INVALID_INPUT",
      "The controlled internal pilot readiness probe input is invalid.",
    );
  }

  const actual =
    Object.keys(input).sort();

  const expected =
    [...INPUT_KEYS].sort();

  if (
    actual.length !== expected.length ||
    actual.some(
      (key, index) =>
        key !== expected[index],
    ) ||
    typeof input.ttlSeconds !== "number" ||
    !Number.isInteger(input.ttlSeconds) ||
    input.ttlSeconds < 300 ||
    input.ttlSeconds > 86_400 ||
    typeof input.batchSize !== "number" ||
    !Number.isInteger(input.batchSize) ||
    input.batchSize < 1 ||
    input.batchSize > 100
  ) {
    throw probeError(
      "INVALID_INPUT",
      "The controlled internal pilot readiness probe input is invalid.",
    );
  }
}

function validateTime(
  now: () => Date,
): string {
  const value = now();

  if (
    !(value instanceof Date) ||
    Number.isNaN(value.getTime())
  ) {
    throw probeError(
      "CLOCK_INVALID",
      "The controlled internal pilot readiness probe clock is invalid.",
    );
  }

  return value.toISOString();
}

function validateProbeId(
  createProbeId: () => string,
): string {
  const value = createProbeId();

  if (!isIdentifier(value, 8)) {
    throw probeError(
      "PROBE_ID_INVALID",
      "A valid controlled internal pilot readiness probe identifier could not be generated.",
    );
  }

  return value;
}

function validateWorkflowSnapshot(
  value: unknown,
  tenantId: string,
): ControlledInternalPilotOwnerRecoverySnapshot {
  if (
    !isPlainRecord(value) ||
    value.tenantId !== tenantId ||
    typeof value.phase !== "string" ||
    !VALID_RECOVERY_PHASES.has(
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
    typeof value.recoveryAttempt !== "number" ||
    !Number.isInteger(
      value.recoveryAttempt,
    ) ||
    value.recoveryAttempt < 0 ||
    typeof value.maxRecoveryAttempts !== "number" ||
    !Number.isInteger(
      value.maxRecoveryAttempts,
    ) ||
    value.maxRecoveryAttempts < 1 ||
    typeof value.canRetryFailedRun !==
      "boolean" ||
    !hasSafetyBoundaries(value) ||
    containsForbiddenStateKey(value) ||
    !isPlainRecord(value.console)
  ) {
    throw probeError(
      "WORKFLOW_STATE_INVALID",
      "The controlled internal pilot workflow returned an invalid readiness state.",
    );
  }

  const consoleState = value.console;

  if (
    consoleState.tenantId !== tenantId ||
    typeof consoleState.phase !==
      "string" ||
    !VALID_CONSOLE_PHASES.has(
      consoleState.phase,
    ) ||
    typeof consoleState.busy !==
      "boolean" ||
    (
      consoleState.activeSessionId !==
        null &&
      !isIdentifier(
        consoleState.activeSessionId,
        8,
      )
    ) ||
    typeof consoleState.canRunSandbox !==
      "boolean" ||
    typeof consoleState.canReplayLastRun !==
      "boolean" ||
    typeof consoleState.canRevokeSession !==
      "boolean" ||
    !hasSafetyBoundaries(
      consoleState,
    )
  ) {
    throw probeError(
      "WORKFLOW_STATE_INVALID",
      "The controlled internal pilot console returned an invalid readiness state.",
    );
  }

  if (consoleState.lastRun !== null) {
    if (
      !isPlainRecord(
        consoleState.lastRun,
      ) ||
      !isIdentifier(
        consoleState.lastRun.requestId,
        8,
      ) ||
      !isIdentifier(
        consoleState.lastRun
          .idempotencyKey,
        8,
      ) ||
      typeof consoleState.lastRun
        .requestedAt !== "string" ||
      !isDigest(
        consoleState.lastRun
          .requestDigest,
      ) ||
      typeof consoleState.lastRun
        .replay !== "boolean" ||
      !isPlainRecord(
        consoleState.lastRun.result,
      ) ||
      containsForbiddenStateKey(
        consoleState.lastRun.result,
      )
    ) {
      throw probeError(
        "WORKFLOW_STATE_INVALID",
        "The controlled internal pilot run evidence is invalid.",
      );
    }
  }

  return deepFreeze(
    cloneJson(
      value as unknown as
        ControlledInternalPilotOwnerRecoverySnapshot,
    ),
  ) as ControlledInternalPilotOwnerRecoverySnapshot;
}

function safeFailure(
  error: unknown,
): ControlledInternalPilotReadinessFailure {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof error.code === "string" &&
    /^[A-Z][A-Z0-9_]{2,63}$/.test(
      error.code,
    ) &&
    typeof error.message === "string" &&
    error.message.length >= 1 &&
    error.message.length <= 256 &&
    !/[\r\n\0]/.test(
      error.message,
    )
  ) {
    return Object.freeze({
      code: error.code,
      message: error.message,
    });
  }

  return Object.freeze({
    code: "READINESS_PROBE_FAILED",
    message:
      "The controlled internal pilot readiness probe failed safely.",
  });
}

function createDefaultProbeId(): string {
  const cryptoApi =
    globalThis.crypto;

  if (
    !cryptoApi ||
    typeof cryptoApi.randomUUID !==
      "function"
  ) {
    throw probeError(
      "PROBE_ID_INVALID",
      "A secure readiness probe identifier could not be generated.",
    );
  }

  return `probe-${cryptoApi.randomUUID()}`;
}

export function createControlledInternalPilotReadinessProbe(
  runtime:
    ControlledInternalPilotReadinessProbeRuntime,
): ControlledInternalPilotReadinessProbe {
  validateRuntime(runtime);

  const now =
    runtime.now ?? (() => new Date());

  const createProbeId =
    runtime.createProbeId ??
    createDefaultProbeId;

  let phase:
    ControlledInternalPilotReadinessProbePhase =
      "idle";

  let busy = false;

  let report:
    ControlledInternalPilotReadinessReport | null =
      null;

  function getSnapshot():
    ControlledInternalPilotReadinessProbeSnapshot {
    return deepFreeze({
      tenantId: runtime.tenantId,
      phase,
      busy,
      canRun:
        !busy &&
        phase === "idle" &&
        report === null,
      report:
        report === null
          ? null
          : cloneJson(report),
      ownerApprovalRequired: true,
      liveProviderExecution:
        "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    });
  }

  function createReport(
    probeId: string,
    status:
      ControlledInternalPilotReadinessProbeStatus,
    startedAt: string,
    completedAt: string,
    checks:
      readonly ControlledInternalPilotReadinessCheck[],
    failure:
      ControlledInternalPilotReadinessFailure | null,
  ): ControlledInternalPilotReadinessReport {
    if (
      new Date(completedAt).getTime() <
      new Date(startedAt).getTime()
    ) {
      throw probeError(
        "CLOCK_INVALID",
        "The controlled internal pilot readiness probe clock moved backwards.",
      );
    }

    const evidence = {
      tenantId: runtime.tenantId,
      probeId,
      status,
      startedAt,
      completedAt,
      checks,
      failure,
      ownerApprovalRequired: true,
      liveProviderExecution:
        "blocked",
      externalDelivery: "blocked",
      paymentExecution: "blocked",
      publicLaunch: "blocked",
    };

    const completedReport = {
      ...evidence,
      evidenceDigest:
        createEvidenceDigest(evidence),
    };

    if (
      containsForbiddenStateKey(
        completedReport,
      )
    ) {
      throw probeError(
        "READINESS_PROBE_FAILED",
        "The controlled internal pilot readiness report contained unsafe data.",
      );
    }

    return deepFreeze(
      cloneJson(
        completedReport,
      ),
    ) as ControlledInternalPilotReadinessReport;
  }

  return Object.freeze({
    getSnapshot,

    async run(
      input:
        ControlledInternalPilotReadinessProbeInput,
    ): Promise<ControlledInternalPilotReadinessProbeSnapshot> {
      validateInput(input);

      if (busy) {
        throw probeError(
          "OPERATION_IN_PROGRESS",
          "A controlled internal pilot readiness probe is already running.",
        );
      }

      if (
        phase !== "idle" ||
        report !== null
      ) {
        throw probeError(
          "PROBE_ALREADY_COMPLETED",
          "This controlled internal pilot readiness probe has already completed.",
        );
      }

      busy = true;
      phase = "running";

      const probeId =
        validateProbeId(
          createProbeId,
        );

      const startedAt =
        validateTime(now);

      const checks:
        ControlledInternalPilotReadinessCheck[] =
          [];

      let currentCheck:
        ControlledInternalPilotReadinessProbeCheckName =
          "initial-safety-boundaries";

      let sessionIssued = false;
      let sessionRevoked = false;

      const pass = (
        name:
          ControlledInternalPilotReadinessProbeCheckName,
        code: string,
      ): void => {
        checks.push({
          name,
          passed: true,
          code,
        });
      };

      const fail = (
        name:
          ControlledInternalPilotReadinessProbeCheckName,
        code: string,
      ): void => {
        checks.push({
          name,
          passed: false,
          code,
        });
      };

      try {
        currentCheck =
          "initial-safety-boundaries";

        const initial =
          validateWorkflowSnapshot(
            runtime.workflow.getSnapshot(),
            runtime.tenantId,
          );

        if (
          initial.phase !== "ready" ||
          initial.console.phase !==
            "authority-ready" ||
          initial.console.activeSessionId !==
            null
        ) {
          throw probeError(
            "WORKFLOW_STATE_INVALID",
            "The controlled internal pilot workflow was not in a clean initial readiness state.",
          );
        }

        pass(
          currentCheck,
          "INITIAL_BOUNDARIES_LOCKED",
        );

        currentCheck =
          "secure-session-issue";

        const issued =
          validateWorkflowSnapshot(
            await runtime.workflow.issueSession(
              input.ttlSeconds,
            ),
            runtime.tenantId,
          );

        if (
          issued.phase !==
            "session-ready" ||
          issued.console.phase !==
            "session-ready" ||
          issued.console.activeSessionId ===
            null ||
          issued.console.canRunSandbox !==
            true ||
          issued.console.canRevokeSession !==
            true
        ) {
          throw probeError(
            "WORKFLOW_STATE_INVALID",
            "The controlled internal pilot session issue readiness check failed.",
          );
        }

        sessionIssued = true;

        pass(
          currentCheck,
          "SECURE_SESSION_READY",
        );

        currentCheck =
          "sandbox-execution";

        const completed =
          validateWorkflowSnapshot(
            await runtime.workflow.runSandboxCycle({
              batchSize:
                input.batchSize,
            }),
            runtime.tenantId,
          );

        const originalRun =
          completed.console.lastRun;

        if (
          completed.phase !==
            "completed" ||
          completed.console.phase !==
            "completed" ||
          originalRun === null ||
          originalRun.replay !== false ||
          completed.console
            .canReplayLastRun !== true
        ) {
          throw probeError(
            "WORKFLOW_STATE_INVALID",
            "The controlled internal pilot sandbox execution readiness check failed.",
          );
        }

        pass(
          currentCheck,
          "SANDBOX_EXECUTION_COMPLETED",
        );

        currentCheck =
          "idempotent-replay";

        const replayed =
          validateWorkflowSnapshot(
            await runtime.workflow.replayLastRun(),
            runtime.tenantId,
          );

        const replay =
          replayed.console.lastRun;

        if (
          replayed.phase !==
            "completed" ||
          replay === null ||
          replay.replay !== true ||
          replay.requestId !==
            originalRun.requestId ||
          replay.idempotencyKey !==
            originalRun.idempotencyKey ||
          replay.requestDigest !==
            originalRun.requestDigest
        ) {
          throw probeError(
            "WORKFLOW_STATE_INVALID",
            "The controlled internal pilot idempotent replay readiness check failed.",
          );
        }

        pass(
          currentCheck,
          "IDEMPOTENT_REPLAY_VERIFIED",
        );

        currentCheck =
          "secure-session-revocation";

        const revoked =
          validateWorkflowSnapshot(
            await runtime.workflow.revokeSession(),
            runtime.tenantId,
          );

        if (
          revoked.phase !== "revoked" ||
          revoked.console.phase !==
            "revoked" ||
          revoked.console.activeSessionId !==
            null ||
          revoked.console.canRunSandbox !==
            false ||
          revoked.console.canRevokeSession !==
            false
        ) {
          throw probeError(
            "WORKFLOW_STATE_INVALID",
            "The controlled internal pilot session revocation readiness check failed.",
          );
        }

        sessionRevoked = true;

        pass(
          currentCheck,
          "SESSION_REVOCATION_VERIFIED",
        );

        currentCheck =
          "final-safety-boundaries";

        if (
          !hasSafetyBoundaries(
            revoked as unknown as
              Record<string, unknown>,
          ) ||
          !hasSafetyBoundaries(
            revoked.console as unknown as
              Record<string, unknown>,
          )
        ) {
          throw probeError(
            "WORKFLOW_STATE_INVALID",
            "The controlled internal pilot final safety boundaries were not locked.",
          );
        }

        pass(
          currentCheck,
          "FINAL_BOUNDARIES_LOCKED",
        );

        const completedAt =
          validateTime(now);

        report = createReport(
          probeId,
          "ready",
          startedAt,
          completedAt,
          checks,
          null,
        );

        phase = "ready";
        return getSnapshot();
      } catch (error) {
        const failure =
          safeFailure(error);

        if (
          !checks.some(
            (check) =>
              check.name ===
                currentCheck &&
              check.passed === false,
          )
        ) {
          fail(
            currentCheck,
            failure.code,
          );
        }

        if (
          sessionIssued &&
          !sessionRevoked
        ) {
          try {
            const cleanup =
              validateWorkflowSnapshot(
                await runtime.workflow.revokeSession(),
                runtime.tenantId,
              );

            if (
              cleanup.phase !==
                "revoked" ||
              cleanup.console.phase !==
                "revoked" ||
              cleanup.console.activeSessionId !==
                null ||
              cleanup.console.canRunSandbox !==
                false
            ) {
              throw probeError(
                "WORKFLOW_STATE_INVALID",
                "The failed readiness probe session cleanup state was invalid.",
              );
            }

            sessionRevoked = true;

            pass(
              "failure-cleanup-revocation",
              "FAILED_PROBE_SESSION_REVOKED",
            );
          } catch (cleanupError) {
            const cleanupFailure =
              safeFailure(cleanupError);

            fail(
              "failure-cleanup-revocation",
              cleanupFailure.code,
            );
          }
        }

        let completedAt: string;

        try {
          completedAt =
            validateTime(now);
        } catch {
          completedAt = startedAt;
        }

        report = createReport(
          probeId,
          "not-ready",
          startedAt,
          completedAt,
          checks,
          failure,
        );

        phase = "not-ready";
        return getSnapshot();
      } finally {
        busy = false;
      }
    },
  });
}
