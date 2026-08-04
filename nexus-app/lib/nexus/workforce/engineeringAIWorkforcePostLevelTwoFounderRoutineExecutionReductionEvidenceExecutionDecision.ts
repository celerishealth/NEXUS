import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
  type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionOption,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation,
} from "./engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-execution-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_OWNER_APPROVAL_REASONS = [
  "Owner approved bounded synthetic routine-engineering work coverage baseline evidence only, with repeatable work, exception handling, prohibited work and founder-reserved decisions kept explicitly separated.",
  "Owner approved bounded synthetic founder-reserved authority and decision-boundary evidence only, with financial, legal, production, customer-contact and emergency-control decisions retained by the owner.",
  "Owner approved bounded synthetic routine-task quality and acceptance-threshold evidence only, with below-threshold work rejected and correctness, completeness, safety and owner acceptance measured.",
  "Owner approved bounded synthetic failure recovery, rollback and safe-resume evidence only, with fail-closed pause, deterministic retry, duplicate rejection and owner-controlled restoration required.",
  "Owner approved bounded synthetic exception escalation and owner-response evidence only, with ambiguity, defects, repeated failure, scope escape and unauthorized authority requests paused for owner review.",
  "Owner approved bounded synthetic founder-intervention and time-reduction measurement evidence only, without treating reduced founder activity or reduced review time as proof of Founder Liberation.",
  "Owner approved bounded synthetic sustained-operation quality and regression-stability evidence only, with repeated-cycle quality, recovery, escalation, audit continuity and regression gates required.",
  "Owner approved bounded synthetic final owner-acceptance and Founder Liberation separation evidence only, with every prior control required to pass before any separate liberation assessment may be considered.",
] as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation: typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;
  readonly ownerId: string;
  readonly decisions: readonly EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionOption[];
  readonly reasons: readonly string[];
  readonly decidedAt: string;
}

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DIGEST = /^[0-9a-f]{64}$/;
const SENSITIVE = /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|credential|bearer|private[_ -]?key)\b/i;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, normalize(record[key])]),
    );
  }
  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function requireIdentifier(label: string, value: string): void {
  if (value.trim() !== value || !ID.test(value)) throw new Error(`${label} is invalid.`);
}

function requireTimestamp(label: string, value: string): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireReason(value: string): string {
  const normalized = value.trim();
  if (
    normalized !== value ||
    normalized.length < 80 ||
    normalized.length > 1600 ||
    SENSITIVE.test(normalized)
  ) {
    throw new Error("Founder Routine Execution Reduction evidence-execution decision reason is invalid.");
  }
  return normalized;
}

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation(
    preparation,
  );
  const boundary = preparation.authorityBoundary;
  if (
    preparation.workstreamSequence !== 4 ||
    preparation.workstreamId !== "founder-routine-execution-reduction-evidence" ||
    preparation.evidenceClass !== "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    preparation.decisionPreparationOnly !== true ||
    preparation.evidenceDecisionPreparationCount !== 8 ||
    preparation.evidenceDecisionPreparations.length !== 8 ||
    preparation.ownerExecutionDecisionReviewRequired !== true ||
    preparation.ownerExecutionDecisionReviewRecorded !== false ||
    boundary.workstreamFourEvidenceExecutionDecisionPreparationAuthorized !== true ||
    boundary.workstreamFourEvidenceExecutionDecisionPreparationPerformed !== true ||
    boundary.workstreamFourEvidenceExecutionAuthorized !== false ||
    boundary.oneAtATimeEvidenceExecutionRequired !== true ||
    boundary.aggregateConcurrentExecutionLimit !== 0 ||
    boundary.taskExecutionAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.commandExecutionAuthorized !== false ||
    boundary.networkAccessAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_REVIEW"
  ) {
    throw new Error(
      "Canonical Founder Routine Execution Reduction evidence-execution decision preparation is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decisions: readonly EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceExecutionDecisionOption[],
  reasons: readonly string[],
  decidedAt: string,
) {
  const approvedIndexes = decisions
    .map((decision, index) =>
      decision === "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION"
        ? index
        : -1,
    )
    .filter((index) => index >= 0);
  const firstApprovedIndex = approvedIndexes.length > 0 ? approvedIndexes[0] : -1;

  const candidateDecisions = deepFreeze(
    preparation.evidenceDecisionPreparations.map((source, index) => {
      const decision = decisions[index];
      const reason = reasons[index];
      if (
        !decision ||
        !ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_OPTIONS.includes(
          decision,
        ) ||
        !reason
      ) {
        throw new Error(
          `Founder Routine Execution Reduction evidence-execution decision ${index + 1} is missing.`,
        );
      }
      const approved =
        decision === "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION";
      const currentlyExecutable = approved && index === firstApprovedIndex;
      const waitingForPriorEvidenceOwnerReview = approved && index > firstApprovedIndex;
      const candidateCore = {
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        decisionState:
          "OWNER_ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_RECORDED" as const,
        controlId: source.controlId,
        sourceDecisionPreparationDigest: source.decisionPreparationDigest,
        decision,
        evidenceExecutionAuthorized: approved,
        evidenceExecutionPerformed: false as const,
        currentlyExecutable,
        waitingForPriorEvidenceOwnerReview,
        retainedAtPreparationOnly: !approved,
        reason: requireReason(reason),
        reviewedPreparation: {
          executionMode: source.executionMode,
          evidenceToolMode: source.evidenceToolMode,
          maximumEvidenceExecutionCount: source.maximumEvidenceExecutionCount,
          concurrentExecutionLimit: source.concurrentExecutionLimit,
          deterministicEvidenceRequired: source.deterministicEvidenceRequired,
          independentValidationRequired: source.independentValidationRequired,
          ownerReviewAfterExecutionRequired: source.ownerReviewAfterExecutionRequired,
          monitoringRequired: source.monitoringRequired,
          emergencyPauseRequired: source.emergencyPauseRequired,
          rollbackEvidenceRequired: source.rollbackEvidenceRequired,
          routineWorkCoverageRequired: source.routineWorkCoverageRequired,
          qualityThresholdRequired: source.qualityThresholdRequired,
          recoveryEvidenceRequired: source.recoveryEvidenceRequired,
          escalationEvidenceRequired: source.escalationEvidenceRequired,
          founderInterventionMeasurementRequired:
            source.founderInterventionMeasurementRequired,
          ownerAcceptanceRequired: source.ownerAcceptanceRequired,
          founderLiberationSeparationRequired: source.founderLiberationSeparationRequired,
        },
        authorityBoundary: {
          canonicalDecisionPreparationBound: true as const,
          preparationIntegrityVerified: true as const,
          ownerIdentityBound: true as const,
          tenantIdentityBound: true as const,
          controlIdentityBound: true as const,
          approvalBypassAllowed: false as const,
          syntheticRoutineExecutionReductionEvidenceAuthorized: approved,
          syntheticRoutineExecutionReductionEvidencePerformed: false as const,
          currentlyExecutable,
          waitingForPriorEvidenceOwnerReview,
          ownerReviewRequiredImmediatelyAfterExecution: true as const,
          monitoringRequired: true as const,
          emergencyPauseAvailable: true as const,
          rollbackEvidenceRequired: true as const,
          taskExecutionAuthorized: false as const,
          repositoryReadAuthorized: false as const,
          repositoryWriteAuthorized: false as const,
          filesystemMutationAuthorized: false as const,
          commandExecutionAuthorized: false as const,
          packageExecutionAuthorized: false as const,
          networkAccessAuthorized: false as const,
          productionDeploymentAuthorized: false as const,
          paymentExecutionAuthorized: false as const,
          publicLaunchAuthorized: false as const,
          levelThreeAuthorityGranted: false as const,
          founderLiberationAssessmentAuthorized: false as const,
          founderLiberationAchieved: false as const,
          founderReleasedFromRoutineExecution: false as const,
        },
      };
      return deepFreeze({
        ...candidateCore,
        candidateDecisionDigest: sha256(candidateCore),
      });
    }),
  );

  const approvedCount = approvedIndexes.length;
  const rejectedCount = 8 - approvedCount;
  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISIONS_RECORDED" as const,
    sourcePreparationId: preparation.preparationId,
    sourcePreparationDigest: preparation.preparationDigest,
    sourceEvidencePlanReviewDecisionId: preparation.sourceEvidencePlanReviewDecisionId,
    sourceEvidencePlanReviewDecisionDigest: preparation.sourceEvidencePlanReviewDecisionDigest,
    sourceEvidencePlanPreparationId: preparation.sourceEvidencePlanPreparationId,
    sourceEvidencePlanPreparationDigest: preparation.sourceEvidencePlanPreparationDigest,
    tenantId: preparation.tenantId,
    ownerId,
    workstreamSequence: 4 as const,
    workstreamId: "founder-routine-execution-reduction-evidence" as const,
    evidenceClass: "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    ownerExecutionDecisionsRecorded: true as const,
    evidenceExecutionDecisionCount: 8 as const,
    candidateDecisions,
    summary: {
      evidenceExecutionDecisionCount: 8 as const,
      approvedEvidenceExecutionCount: approvedCount,
      rejectedEvidenceExecutionCount: rejectedCount,
      currentlyExecutableCount: approvedCount > 0 ? (1 as const) : (0 as const),
      waitingForPriorEvidenceOwnerReviewCount:
        approvedCount > 0 ? approvedCount - 1 : 0,
      evidenceExecutionPerformedCount: 0 as const,
      taskExecutionAuthorizedCount: 0 as const,
      maximumEvidenceExecutionCount: 1 as const,
      aggregateConcurrentExecutionLimit: 0 as const,
      repositoryReadAuthorizedCount: 0 as const,
      repositoryWriteAuthorizedCount: 0 as const,
      commandExecutionAuthorizedCount: 0 as const,
      networkAccessAuthorizedCount: 0 as const,
      productionDeploymentAuthorizedCount: 0 as const,
      paymentExecutionAuthorizedCount: 0 as const,
      publicLaunchAuthorizedCount: 0 as const,
      uniqueCandidateDecisionDigestCount: new Set(
        candidateDecisions.map((candidate) => candidate.candidateDecisionDigest),
      ).size,
    },
    authorityBoundary: {
      canonicalPreparationBound: true as const,
      canonicalPreparationIntegrityVerified: true as const,
      exactEightEvidenceExecutionDecisionsRequired: true as const,
      ownerIdentityBound: true as const,
      tenantIdentityBound: true as const,
      ownerExecutionDecisionsRecorded: true as const,
      approvalBypassAllowed: false as const,
      syntheticRoutineExecutionReductionEvidenceAuthorized: approvedCount > 0,
      syntheticRoutineExecutionReductionEvidencePerformed: false as const,
      workstreamFourEvidenceExecutionAuthorized: approvedCount > 0,
      founderRoutineExecutionReductionEvidenceAuthorized: approvedCount > 0,
      founderRoutineExecutionReductionExecutionAuthorized: false as const,
      founderRoutineExecutionReductionClaimAuthorized: false as const,
      founderRoutineExecutionReductionClaimed: false as const,
      founderLiberationAssessmentAuthorized: false as const,
      founderLiberationAcceptanceAuthorized: false as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      currentlyExecutableEvidenceCount: approvedCount > 0 ? (1 as const) : (0 as const),
      aggregateConcurrentExecutionLimit: 0 as const,
      taskExecutionAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      publicLaunchAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      founderReleasedFromRoutineExecution: false as const,
      monitoringRequired: true as const,
      emergencyPauseAvailable: true as const,
      rollbackEvidenceRequired: true as const,
      ownerReviewRequiredImmediatelyAfterEveryExecution: true as const,
      ownerFinalAuthorityPreserved: true as const,
    },
    nextStep: (
      approvedCount > 0
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION",
    decidedAt,
  };
  return deepFreeze({ ...recordCore, decisionDigest: sha256(recordCore) });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision =
  ReturnType<typeof buildDecision>;

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
  record: EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
): void {
  validateCanonicalPreparation();
  requireIdentifier("Founder Routine Execution Reduction evidence-execution decision ID", record.decisionId);
  requireTimestamp("Founder Routine Execution Reduction evidence-execution decision time", record.decidedAt);
  const { decisionDigest, ...recordCore } = record;
  if (!DIGEST.test(decisionDigest) || sha256(recordCore) !== decisionDigest) {
    throw new Error("Founder Routine Execution Reduction evidence-execution decision integrity is invalid.");
  }
  if (
    record.sourcePreparationId !== preparation.preparationId ||
    record.sourcePreparationDigest !== preparation.preparationDigest ||
    record.ownerId !== preparation.ownerId ||
    record.workstreamSequence !== 4 ||
    record.workstreamId !== "founder-routine-execution-reduction-evidence" ||
    record.evidenceClass !== "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    record.ownerExecutionDecisionsRecorded !== true ||
    record.evidenceExecutionDecisionCount !== 8 ||
    record.candidateDecisions.length !== 8 ||
    Date.parse(record.decidedAt) < Date.parse(preparation.preparedAt)
  ) {
    throw new Error("Founder Routine Execution Reduction evidence-execution decision identity is invalid.");
  }
  const approvedIndexes = record.candidateDecisions
    .map((candidate, index) => (candidate.evidenceExecutionAuthorized ? index : -1))
    .filter((index) => index >= 0);
  const firstApprovedIndex = approvedIndexes.length > 0 ? approvedIndexes[0] : -1;
  record.candidateDecisions.forEach((candidate, index) => {
    const source = preparation.evidenceDecisionPreparations[index];
    const { candidateDecisionDigest, ...candidateCore } = candidate;
    const approved =
      candidate.decision === "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION";
    if (
      !source ||
      !DIGEST.test(candidateDecisionDigest) ||
      sha256(candidateCore) !== candidateDecisionDigest ||
      candidate.sequence !== index + 1 ||
      candidate.controlId !== source.controlId ||
      candidate.sourceDecisionPreparationDigest !== source.decisionPreparationDigest ||
      candidate.evidenceExecutionAuthorized !== approved ||
      candidate.evidenceExecutionPerformed !== false ||
      candidate.currentlyExecutable !== (approved && index === firstApprovedIndex) ||
      candidate.waitingForPriorEvidenceOwnerReview !==
        (approved && index > firstApprovedIndex) ||
      candidate.retainedAtPreparationOnly !== !approved ||
      candidate.reason.length < 80 ||
      candidate.authorityBoundary.taskExecutionAuthorized !== false ||
      candidate.authorityBoundary.repositoryReadAuthorized !== false ||
      candidate.authorityBoundary.repositoryWriteAuthorized !== false ||
      candidate.authorityBoundary.commandExecutionAuthorized !== false ||
      candidate.authorityBoundary.networkAccessAuthorized !== false ||
      candidate.authorityBoundary.founderLiberationAchieved !== false ||
      !Object.isFrozen(candidate)
    ) {
      throw new Error(
        `Founder Routine Execution Reduction evidence-execution candidate decision ${index + 1} is invalid.`,
      );
    }
  });
  const approvedCount = approvedIndexes.length;
  const boundary = record.authorityBoundary;
  if (
    record.summary.approvedEvidenceExecutionCount !== approvedCount ||
    record.summary.rejectedEvidenceExecutionCount !== 8 - approvedCount ||
    record.summary.currentlyExecutableCount !== (approvedCount > 0 ? 1 : 0) ||
    record.summary.waitingForPriorEvidenceOwnerReviewCount !==
      (approvedCount > 0 ? approvedCount - 1 : 0) ||
    record.summary.evidenceExecutionPerformedCount !== 0 ||
    record.summary.uniqueCandidateDecisionDigestCount !== 8 ||
    boundary.syntheticRoutineExecutionReductionEvidenceAuthorized !== (approvedCount > 0) ||
    boundary.workstreamFourEvidenceExecutionAuthorized !== (approvedCount > 0) ||
    boundary.founderRoutineExecutionReductionEvidenceAuthorized !== (approvedCount > 0) ||
    boundary.currentlyExecutableEvidenceCount !== (approvedCount > 0 ? 1 : 0) ||
    boundary.founderRoutineExecutionReductionExecutionAuthorized !== false ||
    boundary.founderRoutineExecutionReductionClaimAuthorized !== false ||
    boundary.founderLiberationAssessmentAuthorized !== false ||
    boundary.taskExecutionAuthorized !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.commandExecutionAuthorized !== false ||
    boundary.networkAccessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.levelThreeAuthorityGranted !== false ||
    boundary.founderLiberationAchieved !== false ||
    record.nextStep !==
      (approvedCount > 0
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION") ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.candidateDecisions) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(boundary)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-execution decision authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
  input: CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision {
  if (input.sourcePreparation !== preparation) {
    throw new Error(
      "Only the canonical Founder Routine Execution Reduction execution-decision preparation can receive owner decisions.",
    );
  }
  validateCanonicalPreparation();
  requireIdentifier("Founder Routine Execution Reduction evidence-execution decision ID", input.decisionId);
  requireTimestamp("Founder Routine Execution Reduction evidence-execution decision time", input.decidedAt);
  if (input.ownerId !== preparation.ownerId) {
    throw new Error("Only the preparation-bound NEXUS owner can record these decisions.");
  }
  if (input.decisions.length !== 8 || input.reasons.length !== 8) {
    throw new Error(
      "Exactly eight Founder Routine Execution Reduction evidence-execution decisions and reasons are required.",
    );
  }
  if (Date.parse(input.decidedAt) < Date.parse(preparation.preparedAt)) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-execution decisions cannot precede preparation.",
    );
  }
  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decisions,
    input.reasons,
    input.decidedAt,
  );
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
    record,
  );
  return record;
}
