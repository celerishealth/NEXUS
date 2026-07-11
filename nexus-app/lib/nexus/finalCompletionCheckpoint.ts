import { createHash } from "node:crypto";

export const FINAL_COMPLETION_CHECKPOINT_VERSION =
  "nexus-final-completion-checkpoint-v1" as const;

export const EXPECTED_FINAL_COMPLETION_SOURCE_COMMIT = "f7698d4" as const;

export const REQUIRED_FINAL_COMPLETION_GATES = [
  "controlledInternalPilotReadinessProbe",
  "singleOwnerRunReadinessWorkflow",
  "initialCleanSafetyState",
  "secureSessionIssue",
  "sandboxExecution",
  "idempotentReplay",
  "secureSessionRevocation",
  "finalSafetyBoundary",
  "exactIssueRunReplayRevokeOrder",
  "readyNotReadyMachineReport",
  "deterministicEvidenceDigest",
  "immutableReadinessReport",
  "credentialExposureBlocked",
  "crossTenantReadinessStateBlocked",
  "unlockedSafetyBoundaryNotReady",
  "malformedWorkflowStateBlocked",
  "malformedCommandDigestBlocked",
  "replayIdentityMutationBlocked",
  "nonReplayResponseBlocked",
  "failedProbeSessionCleanup",
  "failedCleanupVisibleAndFailClosed",
  "rawInfrastructureFailureLeakageBlocked",
  "secretBearingWorkflowStateBlocked",
  "concurrentReadinessProbesBlocked",
  "duplicateReadinessProbeExecutionBlocked",
  "backwardClockMovementFailClosed",
  "realRecoveryWorkflowIntegration",
  "liveExecutionControlSurfaceAbsent",
  "ownerApprovalRequirementLocked",
  "liveProviderExecutionBlocked",
  "externalDeliveryBlocked",
  "paymentExecutionBlocked",
  "publicLaunchBlocked",
  "day779Regression",
  "day778Regression",
  "priorArtifactRegression",
  "projectTypecheck",
  "regressionCheck",
  "productionBuild",
  "originMainSync",
  "workingTreeClean",
] as const;

export type FinalCompletionGate =
  (typeof REQUIRED_FINAL_COMPLETION_GATES)[number];

export type FinalCompletionEvidence = Readonly<
  Record<FinalCompletionGate, boolean>
>;

export type FinalCompletionStatus =
  | "DAY_781_TARGET_COMPLETE"
  | "NOT_COMPLETE";

export interface FinalCompletionCheckpointInput {
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceCommit: string;
  readonly checkpointCommit: string;
  readonly evidence: FinalCompletionEvidence;
}

export interface FinalCompletionCheckpointReport {
  readonly version: typeof FINAL_COMPLETION_CHECKPOINT_VERSION;
  readonly checkpointId: "day-781";
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceCommit: string;
  readonly checkpointCommit: string;
  readonly status: FinalCompletionStatus;
  readonly completionCheckpointSatisfied: boolean;
  readonly failedGates: readonly FinalCompletionGate[];
  readonly evidence: FinalCompletionEvidence;
  readonly evidenceDigest: string;
  readonly safetyBoundary: Readonly<{
    ownerApprovalRequired: true;
    liveExecutionControlSurfacePresent: false;
    liveProviderExecutionAuthorized: false;
    externalDeliveryAuthorized: false;
    paymentExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly finalStatement:
    | "NEXUS_DAY_781_TARGET_COMPLETE_PUBLIC_LAUNCH_BLOCKED"
    | "NEXUS_DAY_781_NOT_COMPLETE_RESOLVE_FAILED_GATES";
  readonly reportDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[A-Za-z0-9][A-Za-z0-9:_-]{2,63}$/;

const COMMIT_PATTERN =
  /^[0-9a-f]{7,40}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|csrf|cookie|authorization|bearer)/i;

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value
      .map((item) => stableStringify(item))
      .join(",")}]`;
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(record[key])}`,
      )
      .join(",")}}`;
  }

  const primitive = JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported value in deterministic checkpoint report.",
    );
  }

  return primitive;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(stableStringify(value), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (const propertyName of Object.getOwnPropertyNames(value)) {
      const child =
        (value as Record<string, unknown>)[propertyName];

      if (child !== null && typeof child === "object") {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function assertSafeIdentifier(
  label: string,
  value: string,
): void {
  if (
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  if (FORBIDDEN_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} contains a credential-bearing term.`,
    );
  }
}

function assertExactEvidenceShape(
  evidence: FinalCompletionEvidence,
): void {
  if (
    evidence === null ||
    typeof evidence !== "object" ||
    Array.isArray(evidence)
  ) {
    throw new Error(
      "Final completion evidence must be an object.",
    );
  }

  const actualKeys =
    Object.keys(evidence).sort();

  const expectedKeys =
    [...REQUIRED_FINAL_COMPLETION_GATES].sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some(
      (key, index) => key !== expectedKeys[index],
    )
  ) {
    throw new Error(
      "Final completion evidence must contain the exact required gates.",
    );
  }

  for (const gate of REQUIRED_FINAL_COMPLETION_GATES) {
    if (typeof evidence[gate] !== "boolean") {
      throw new Error(
        `Final completion gate ${gate} must be boolean.`,
      );
    }
  }
}

export function createFinalCompletionCheckpoint(
  input: FinalCompletionCheckpointInput,
): FinalCompletionCheckpointReport {
  assertSafeIdentifier("tenantId", input.tenantId);
  assertSafeIdentifier("ownerId", input.ownerId);

  if (
    input.sourceCommit !==
    EXPECTED_FINAL_COMPLETION_SOURCE_COMMIT
  ) {
    throw new Error(
      `sourceCommit must equal ${EXPECTED_FINAL_COMPLETION_SOURCE_COMMIT}.`,
    );
  }

  if (
    !COMMIT_PATTERN.test(input.checkpointCommit) ||
    input.checkpointCommit === input.sourceCommit
  ) {
    throw new Error(
      "checkpointCommit must be a distinct lowercase hexadecimal Git commit.",
    );
  }

  assertExactEvidenceShape(input.evidence);

  const normalizedEvidence =
    Object.fromEntries(
      REQUIRED_FINAL_COMPLETION_GATES.map(
        (gate) => [gate, input.evidence[gate]],
      ),
    ) as Record<FinalCompletionGate, boolean>;

  const frozenEvidence =
    deepFreeze(normalizedEvidence) as FinalCompletionEvidence;

  const failedGates =
    REQUIRED_FINAL_COMPLETION_GATES.filter(
      (gate) => !frozenEvidence[gate],
    );

  const completionCheckpointSatisfied =
    failedGates.length === 0;

  const status: FinalCompletionStatus =
    completionCheckpointSatisfied
      ? "DAY_781_TARGET_COMPLETE"
      : "NOT_COMPLETE";

  const evidenceDigest = sha256({
    checkpointId: "day-781",
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    sourceCommit: input.sourceCommit,
    checkpointCommit: input.checkpointCommit,
    evidence: frozenEvidence,
  });

  const finalStatement:
    FinalCompletionCheckpointReport["finalStatement"] =
    completionCheckpointSatisfied
      ? "NEXUS_DAY_781_TARGET_COMPLETE_PUBLIC_LAUNCH_BLOCKED"
      : "NEXUS_DAY_781_NOT_COMPLETE_RESOLVE_FAILED_GATES";

  const reportCore = {
    version: FINAL_COMPLETION_CHECKPOINT_VERSION,
    checkpointId: "day-781" as const,
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    sourceCommit: input.sourceCommit,
    checkpointCommit: input.checkpointCommit,
    status,
    completionCheckpointSatisfied,
    failedGates,
    evidence: frozenEvidence,
    evidenceDigest,
    safetyBoundary: {
      ownerApprovalRequired: true,
      liveExecutionControlSurfacePresent: false,
      liveProviderExecutionAuthorized: false,
      externalDeliveryAuthorized: false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    } as const,
    finalStatement,
  };

  const report: FinalCompletionCheckpointReport = {
    ...reportCore,
    reportDigest: sha256(reportCore),
  };

  return deepFreeze(
    report,
  ) as FinalCompletionCheckpointReport;
}
