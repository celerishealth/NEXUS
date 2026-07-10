export type ControlledPilotHealthStatus =
  | "healthy"
  | "degraded"
  | "critical";

export type ControlledPilotRecoveryStatus =
  | "continue-controlled-pilot"
  | "pause-controlled-pilot"
  | "hold-for-owner-review";

export type ControlledPilotRecoveryCode =
  | "INVALID_INPUT_FAIL_CLOSED"
  | "CRITICAL_HEALTH_PAUSE_REQUIRED"
  | "OWNER_ACKNOWLEDGEMENT_REQUIRED"
  | "BLOCKING_FAILURES_REMAIN"
  | "DEGRADED_HEALTH_REQUIRES_REVIEW"
  | "RECOVERY_EVIDENCE_REQUIRED"
  | "OWNER_RESUME_APPROVAL_REQUIRED"
  | "CONTROLLED_PILOT_HEALTHY";

export interface ControlledPilotRecoveryInput {
  healthStatus: ControlledPilotHealthStatus;
  ownerAlertRequired: boolean;
  ownerAcknowledged: boolean;
  blockingFailureCount: number;
  consecutiveHealthyChecks: number;
  signalId?: string;
}

export interface ControlledPilotRecoveryDecision {
  status: ControlledPilotRecoveryStatus;
  code: ControlledPilotRecoveryCode;
  reason: string;
  ownerActionRequired: boolean;
  pilotOperationPermitted: boolean;
  automaticResumeAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
  signalId: string | null;
}

const REQUIRED_HEALTHY_CHECKS = 3;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHealthStatus(
  value: unknown,
): value is ControlledPilotHealthStatus {
  return (
    value === "healthy" ||
    value === "degraded" ||
    value === "critical"
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
  );
}

function normalizeInput(
  value: unknown,
): ControlledPilotRecoveryInput | null {
  if (!isRecord(value)) {
    return null;
  }

  if (!isHealthStatus(value.healthStatus)) {
    return null;
  }

  if (typeof value.ownerAlertRequired !== "boolean") {
    return null;
  }

  if (typeof value.ownerAcknowledged !== "boolean") {
    return null;
  }

  if (!isNonNegativeInteger(value.blockingFailureCount)) {
    return null;
  }

  if (!isNonNegativeInteger(value.consecutiveHealthyChecks)) {
    return null;
  }

  if (
    value.signalId !== undefined &&
    typeof value.signalId !== "string"
  ) {
    return null;
  }

  return {
    healthStatus: value.healthStatus,
    ownerAlertRequired: value.ownerAlertRequired,
    ownerAcknowledged: value.ownerAcknowledged,
    blockingFailureCount: value.blockingFailureCount,
    consecutiveHealthyChecks: value.consecutiveHealthyChecks,
    signalId:
      typeof value.signalId === "string" && value.signalId.trim()
        ? value.signalId.trim()
        : undefined,
  };
}

function createDecision(
  status: ControlledPilotRecoveryStatus,
  code: ControlledPilotRecoveryCode,
  reason: string,
  ownerActionRequired: boolean,
  pilotOperationPermitted: boolean,
  signalId: string | null,
): ControlledPilotRecoveryDecision {
  return {
    status,
    code,
    reason,
    ownerActionRequired,
    pilotOperationPermitted,
    automaticResumeAuthorized: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
    signalId,
  };
}

export function evaluateControlledPilotRecovery(
  value: unknown,
): ControlledPilotRecoveryDecision {
  const input = normalizeInput(value);

  if (!input) {
    return createDecision(
      "pause-controlled-pilot",
      "INVALID_INPUT_FAIL_CLOSED",
      "Recovery input is incomplete or invalid. Pilot operation remains paused.",
      true,
      false,
      null,
    );
  }

  const signalId = input.signalId ?? null;

  if (input.healthStatus === "critical") {
    return createDecision(
      "pause-controlled-pilot",
      "CRITICAL_HEALTH_PAUSE_REQUIRED",
      "Critical pilot health requires an immediate fail-closed pause and owner review.",
      true,
      false,
      signalId,
    );
  }

  if (input.ownerAlertRequired && !input.ownerAcknowledged) {
    return createDecision(
      "pause-controlled-pilot",
      "OWNER_ACKNOWLEDGEMENT_REQUIRED",
      "The active owner alert must be acknowledged before recovery can be assessed.",
      true,
      false,
      signalId,
    );
  }

  if (input.blockingFailureCount > 0) {
    return createDecision(
      "pause-controlled-pilot",
      "BLOCKING_FAILURES_REMAIN",
      "One or more blocking failures remain unresolved. Pilot operation cannot resume.",
      true,
      false,
      signalId,
    );
  }

  if (input.healthStatus === "degraded") {
    return createDecision(
      "hold-for-owner-review",
      "DEGRADED_HEALTH_REQUIRES_REVIEW",
      "Pilot health remains degraded and requires owner-controlled review.",
      true,
      false,
      signalId,
    );
  }

  if (
    input.ownerAlertRequired &&
    input.consecutiveHealthyChecks < REQUIRED_HEALTHY_CHECKS
  ) {
    return createDecision(
      "hold-for-owner-review",
      "RECOVERY_EVIDENCE_REQUIRED",
      `At least ${REQUIRED_HEALTHY_CHECKS} consecutive healthy checks are required after an alert.`,
      true,
      false,
      signalId,
    );
  }

  if (input.ownerAlertRequired) {
    return createDecision(
      "hold-for-owner-review",
      "OWNER_RESUME_APPROVAL_REQUIRED",
      "Recovery evidence is sufficient, but only the owner may explicitly authorize controlled pilot resumption.",
      true,
      false,
      signalId,
    );
  }

  return createDecision(
    "continue-controlled-pilot",
    "CONTROLLED_PILOT_HEALTHY",
    "Pilot health is stable and no active recovery alert exists.",
    false,
    true,
    signalId,
  );
}
