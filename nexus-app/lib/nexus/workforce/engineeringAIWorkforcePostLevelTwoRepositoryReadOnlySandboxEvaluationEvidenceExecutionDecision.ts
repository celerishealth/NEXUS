import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS,
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
  type EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionOption,
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-repository-read-only-sandbox-evaluation-evidence-execution-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_OWNER_APPROVAL_REASONS =
  [
    "Owner approved bounded synthetic evidence for the repository-read scope allowlist only, with immediate owner review afterward and no actual repository evaluation or read authority.",
    "Owner approved bounded synthetic path-containment and traversal-rejection evidence only, with fail-closed handling and no filesystem or repository access authority.",
    "Owner approved bounded synthetic tenant-owner-session context-binding evidence only, with copied, stale, missing, and mismatched context rejection.",
    "Owner approved bounded synthetic secrets and sensitive-content exclusion evidence only, with no secrets, credentials, customer data, environment values, or production configuration access.",
    "Owner approved bounded synthetic read-only filesystem and tool-enforcement evidence only, with all write, Git mutation, command, package, network, deployment, and production authority blocked.",
    "Owner approved bounded synthetic resource, query, and output-limit evidence only, with one-at-a-time execution, deterministic limits, emergency pause, and immediate owner review.",
    "Owner approved bounded synthetic immutable-audit and tamper-detection evidence only, with digest binding, replay rejection, ordering proof, and no repository authority.",
    "Owner approved bounded synthetic emergency-pause, escalation, independent-validation, and owner-review evidence only, with unresolved progression blocked and final owner authority preserved.",
  ] as const;

export interface CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionInput {
  readonly decisionId: string;
  readonly sourcePreparation:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;
  readonly ownerId: string;
  readonly decisions:
    readonly EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionOption[];
  readonly reasons: readonly string[];
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionCandidateDecision {
  readonly sequence: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  readonly decisionState:
    "OWNER_ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_RECORDED";
  readonly controlId: string;
  readonly sourceDecisionPreparationDigest: string;
  readonly decision:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionOption;
  readonly evidenceExecutionAuthorized: boolean;
  readonly evidenceExecutionPerformed: false;
  readonly currentlyExecutable: boolean;
  readonly waitingForPriorEvidenceOwnerReview: boolean;
  readonly retainedAtPreparationOnly: boolean;
  readonly reason: string;
  readonly reviewedPreparation: Readonly<{
    readonly executionMode: "SYNTHETIC_SANDBOX_EVIDENCE_ONLY";
    readonly evidenceToolMode: "READ_ONLY_EVIDENCE_ONLY";
    readonly maximumEvidenceExecutionCount: 1;
    readonly concurrentExecutionLimit: 0;
    readonly deterministicEvidenceRequired: true;
    readonly independentValidationRequired: true;
    readonly ownerReviewAfterExecutionRequired: true;
    readonly monitoringRequired: true;
    readonly emergencyPauseRequired: true;
    readonly rollbackEvidenceRequired: true;
    readonly tenantBindingRequired: true;
    readonly ownerBindingRequired: true;
    readonly pathContainmentRequired: true;
    readonly secretExclusionRequired: true;
    readonly immutableAuditRequired: true;
    readonly evidenceExecutionPerformed: false;
  }>;
  readonly authorityBoundary: Readonly<{
    readonly canonicalDecisionPreparationBound: true;
    readonly preparationIntegrityVerified: true;
    readonly ownerIdentityBound: true;
    readonly tenantIdentityBound: true;
    readonly controlIdentityBound: true;
    readonly approvalBypassAllowed: false;
    readonly syntheticSafetyEvidenceExecutionAuthorized: boolean;
    readonly syntheticSafetyEvidenceExecutionPerformed: false;
    readonly currentlyExecutable: boolean;
    readonly waitingForPriorEvidenceOwnerReview: boolean;
    readonly ownerReviewRequiredImmediatelyAfterExecution: true;
    readonly monitoringRequired: true;
    readonly emergencyPauseAvailable: true;
    readonly rollbackEvidenceRequired: true;
    readonly repositoryReadOnlySandboxEvaluationAuthorized: false;
    readonly repositoryReadOnlySandboxExecutionAuthorized: false;
    readonly repositoryReadAuthorized: false;
    readonly repositoryWriteAuthorized: false;
    readonly filesystemMutationAuthorized: false;
    readonly gitMutationAuthorized: false;
    readonly commandExecutionAuthorized: false;
    readonly packageExecutionAuthorized: false;
    readonly networkAccessAuthorized: false;
    readonly productionDeploymentAuthorized: false;
    readonly paymentExecutionAuthorized: false;
    readonly publicLaunchAuthorized: false;
    readonly founderLiberationAchieved: false;
    readonly founderReleasedFromRoutineExecution: false;
  }>;
  readonly candidateDecisionDigest: string;
}

const IDENTIFIER_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|secret|credential|bearer|private[_ -]?key)\b/i;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

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
  if (value.trim() !== value || !IDENTIFIER_PATTERN.test(value)) {
    throw new Error(`${label} is invalid.`);
  }
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
    normalized.length > 1400 ||
    SENSITIVE_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-execution decision reason is invalid.",
    );
  }

  return normalized;
}

const preparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION;

function validateCanonicalPreparation(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionPreparation(
    preparation,
  );

  if (
    preparation.workstreamSequence !== 3 ||
    preparation.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    preparation.decisionPreparationOnly !== true ||
    preparation.evidenceDecisionPreparationCount !== 8 ||
    preparation.evidenceDecisionPreparations.length !== 8 ||
    preparation.ownerExecutionDecisionReviewRequired !== true ||
    preparation.ownerExecutionDecisionReviewRecorded !== false ||
    preparation.summary.ownerExecutionDecisionRecordedCount !== 0 ||
    preparation.summary.evidenceExecutionAuthorizedCount !== 0 ||
    preparation.summary.evidenceExecutionPerformedCount !== 0 ||
    preparation.summary.repositoryEvaluationAuthorizedCount !== 0 ||
    preparation.summary.repositoryReadAuthorizedCount !== 0 ||
    preparation.summary.repositoryWriteAuthorizedCount !== 0 ||
    preparation.authorityBoundary
      .workstreamThreeEvidenceExecutionDecisionPreparationAuthorized !== true ||
    preparation.authorityBoundary
      .workstreamThreeEvidenceExecutionDecisionPreparationPerformed !== true ||
    preparation.authorityBoundary
      .workstreamThreeEvidenceExecutionAuthorized !== false ||
    preparation.authorityBoundary.aggregateConcurrentExecutionLimit !== 0 ||
    preparation.authorityBoundary
      .repositoryReadOnlySandboxEvaluationAuthorized !== false ||
    preparation.authorityBoundary
      .repositoryReadOnlySandboxExecutionAuthorized !== false ||
    preparation.authorityBoundary.repositoryReadAuthorized !== false ||
    preparation.authorityBoundary.repositoryWriteAuthorized !== false ||
    preparation.authorityBoundary.commandExecutionAuthorized !== false ||
    preparation.authorityBoundary.networkAccessAuthorized !== false ||
    preparation.authorityBoundary.productionDeploymentAuthorized !== false ||
    preparation.authorityBoundary.publicLaunchAuthorized !== false ||
    preparation.authorityBoundary.founderLiberationAchieved !== false ||
    preparation.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_REVIEW"
  ) {
    throw new Error(
      "Canonical repository read-only sandbox execution-decision preparation is invalid.",
    );
  }
}

function buildDecision(
  decisionId: string,
  ownerId: string,
  decisions:
    readonly EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionOption[],
  reasons: readonly string[],
  decidedAt: string,
) {
  const approvedIndexes = decisions
    .map((decision, index) =>
      decision ===
      "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION"
        ? index
        : -1,
    )
    .filter((index) => index >= 0);

  const firstApprovedIndex =
    approvedIndexes.length > 0 ? approvedIndexes[0] : -1;

  const candidateDecisions = deepFreeze(
    preparation.evidenceDecisionPreparations.map((source, index) => {
      const selectedDecision = decisions[index];
      const reason = reasons[index];
      const approved =
        selectedDecision ===
        "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION";
      const currentlyExecutable =
        approved && index === firstApprovedIndex;
      const waiting =
        approved && index > firstApprovedIndex;

      if (
        !selectedDecision ||
        !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS.includes(
          selectedDecision,
        ) ||
        !reason
      ) {
        throw new Error(
          `Repository read-only sandbox evidence-execution decision ${index + 1} is missing.`,
        );
      }

      const candidateCore = {
        sequence: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        decisionState:
          "OWNER_ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_RECORDED" as const,
        controlId: source.controlId,
        sourceDecisionPreparationDigest:
          source.decisionPreparationDigest,
        decision: selectedDecision,
        evidenceExecutionAuthorized: approved,
        evidenceExecutionPerformed: false as const,
        currentlyExecutable,
        waitingForPriorEvidenceOwnerReview: waiting,
        retainedAtPreparationOnly: !approved,
        reason: requireReason(reason),
        reviewedPreparation: {
          executionMode: source.executionMode,
          evidenceToolMode: source.evidenceToolMode,
          maximumEvidenceExecutionCount:
            source.maximumEvidenceExecutionCount,
          concurrentExecutionLimit: source.concurrentExecutionLimit,
          deterministicEvidenceRequired:
            source.deterministicEvidenceRequired,
          independentValidationRequired:
            source.independentValidationRequired,
          ownerReviewAfterExecutionRequired:
            source.ownerReviewAfterExecutionRequired,
          monitoringRequired: source.monitoringRequired,
          emergencyPauseRequired:
            source.emergencyPauseRequired,
          rollbackEvidenceRequired:
            source.rollbackEvidenceRequired,
          tenantBindingRequired: source.tenantBindingRequired,
          ownerBindingRequired: source.ownerBindingRequired,
          pathContainmentRequired:
            source.pathContainmentRequired,
          secretExclusionRequired:
            source.secretExclusionRequired,
          immutableAuditRequired: source.immutableAuditRequired,
          evidenceExecutionPerformed: false as const,
        },
        authorityBoundary: {
          canonicalDecisionPreparationBound: true as const,
          preparationIntegrityVerified: true as const,
          ownerIdentityBound: true as const,
          tenantIdentityBound: true as const,
          controlIdentityBound: true as const,
          approvalBypassAllowed: false as const,
          syntheticSafetyEvidenceExecutionAuthorized: approved,
          syntheticSafetyEvidenceExecutionPerformed: false as const,
          currentlyExecutable,
          waitingForPriorEvidenceOwnerReview: waiting,
          ownerReviewRequiredImmediatelyAfterExecution: true as const,
          monitoringRequired: true as const,
          emergencyPauseAvailable: true as const,
          rollbackEvidenceRequired: true as const,
          repositoryReadOnlySandboxEvaluationAuthorized: false as const,
          repositoryReadOnlySandboxExecutionAuthorized: false as const,
          repositoryReadAuthorized: false as const,
          repositoryWriteAuthorized: false as const,
          filesystemMutationAuthorized: false as const,
          gitMutationAuthorized: false as const,
          commandExecutionAuthorized: false as const,
          packageExecutionAuthorized: false as const,
          networkAccessAuthorized: false as const,
          productionDeploymentAuthorized: false as const,
          paymentExecutionAuthorized: false as const,
          publicLaunchAuthorized: false as const,
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
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_VERSION,
    decisionId,
    decisionState:
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISIONS_RECORDED" as const,
    sourcePreparationId: preparation.preparationId,
    sourcePreparationDigest: preparation.preparationDigest,
    sourceEvidencePlanReviewDecisionId:
      preparation.sourceEvidencePlanReviewDecisionId,
    sourceEvidencePlanReviewDecisionDigest:
      preparation.sourceEvidencePlanReviewDecisionDigest,
    sourceEvidencePlanPreparationId:
      preparation.sourceEvidencePlanPreparationId,
    sourceEvidencePlanPreparationDigest:
      preparation.sourceEvidencePlanPreparationDigest,
    tenantId: preparation.tenantId,
    ownerId,
    workstreamSequence: 3 as const,
    workstreamId:
      "repository-read-only-sandbox-evaluation" as const,
    evidenceClass:
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" as const,
    ownerExecutionDecisionsRecorded: true as const,
    evidenceExecutionDecisionCount: 8 as const,
    candidateDecisions,
    summary: {
      evidenceExecutionDecisionCount: 8 as const,
      approvedEvidenceExecutionCount: approvedCount,
      rejectedEvidenceExecutionCount: rejectedCount,
      currentlyExecutableCount:
        approvedCount > 0 ? (1 as const) : (0 as const),
      waitingForPriorEvidenceOwnerReviewCount:
        approvedCount > 0 ? approvedCount - 1 : 0,
      evidenceExecutionPerformedCount: 0 as const,
      maximumEvidenceExecutionCount: 1 as const,
      aggregateConcurrentExecutionLimit: 0 as const,
      repositoryEvaluationAuthorizedCount: 0 as const,
      repositoryReadAuthorizedCount: 0 as const,
      repositoryWriteAuthorizedCount: 0 as const,
      filesystemMutationAuthorizedCount: 0 as const,
      gitMutationAuthorizedCount: 0 as const,
      commandExecutionAuthorizedCount: 0 as const,
      packageExecutionAuthorizedCount: 0 as const,
      networkAccessAuthorizedCount: 0 as const,
      productionDeploymentAuthorizedCount: 0 as const,
      paymentExecutionAuthorizedCount: 0 as const,
      publicLaunchAuthorizedCount: 0 as const,
      uniqueCandidateDecisionDigestCount:
        new Set(
          candidateDecisions.map(
            (candidate) => candidate.candidateDecisionDigest,
          ),
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
      syntheticSafetyEvidenceExecutionAuthorized:
        approvedCount > 0,
      syntheticSafetyEvidenceExecutionPerformed: false as const,
      oneAtATimeEvidenceExecutionRequired: true as const,
      currentlyExecutableEvidenceCount:
        approvedCount > 0 ? (1 as const) : (0 as const),
      aggregateConcurrentExecutionLimit: 0 as const,
      repositoryReadOnlySandboxEvaluationAuthorized: false as const,
      repositoryReadOnlySandboxExecutionAuthorized: false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemMutationAuthorized: false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized: false as const,
      packageExecutionAuthorized: false as const,
      networkAccessAuthorized: false as const,
      branchCreationAuthorized: false as const,
      pullRequestPreparationAuthorized: false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized: false as const,
      realCustomerDataAccessAuthorized: false as const,
      realCustomerContactAuthorized: false as const,
      externalDeliveryAuthorized: false as const,
      liveProviderExecutionAuthorized: false as const,
      productionDatabaseAuthorized: false as const,
      productionMutationAuthorized: false as const,
      productionDeploymentAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      financialCommitmentAuthorized: false as const,
      legalCommitmentAuthorized: false as const,
      autonomousDecisionAuthorized: false as const,
      concurrentEngineeringWorkAuthorized: false as const,
      levelThreeEvaluationAuthorized: false as const,
      levelThreeAuthorityGranted: false as const,
      productionReadinessAuthorized: false as const,
      publicLaunchAuthorized: false as const,
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
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE"
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION"
    ) as
      | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE"
      | "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION",
    decidedAt,
  };

  return deepFreeze({
    ...recordCore,
    decisionDigest: sha256(recordCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision =
  ReturnType<typeof buildDecision>;

function validateCandidateDecision(
  candidate:
    EngineeringAIWorkforceRepositoryReadOnlySandboxEvaluationEvidenceExecutionCandidateDecision,
  index: number,
  approvedIndexes: readonly number[],
): void {
  const source = preparation.evidenceDecisionPreparations[index];

  if (!source) {
    throw new Error(
      "Repository read-only sandbox source decision preparation is missing.",
    );
  }

  const {
    candidateDecisionDigest,
    ...candidateCore
  } = candidate;

  const approved =
    candidate.decision ===
    "APPROVE_REPOSITORY_READ_ONLY_SANDBOX_SAFETY_EVIDENCE_EXECUTION";

  const firstApprovedIndex =
    approvedIndexes.length > 0 ? approvedIndexes[0] : -1;

  const expectedCurrentlyExecutable =
    approved && index === firstApprovedIndex;

  const expectedWaiting =
    approved && index > firstApprovedIndex;

  const boundary = candidate.authorityBoundary;

  const forbidden = [
    boundary.approvalBypassAllowed,
    boundary.syntheticSafetyEvidenceExecutionPerformed,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
    boundary.productionDeploymentAuthorized,
    boundary.paymentExecutionAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    !SHA256_PATTERN.test(candidateDecisionDigest) ||
    sha256(candidateCore) !== candidateDecisionDigest ||
    candidate.sequence !== index + 1 ||
    candidate.decisionState !==
      "OWNER_ENGINEERING_REPOSITORY_READ_ONLY_SANDBOX_EVIDENCE_EXECUTION_DECISION_RECORDED" ||
    candidate.controlId !== source.controlId ||
    candidate.sourceDecisionPreparationDigest !==
      source.decisionPreparationDigest ||
    !ENGINEERING_AI_WORKFORCE_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_OPTIONS.includes(
      candidate.decision,
    ) ||
    candidate.evidenceExecutionAuthorized !== approved ||
    candidate.evidenceExecutionPerformed !== false ||
    candidate.currentlyExecutable !== expectedCurrentlyExecutable ||
    candidate.waitingForPriorEvidenceOwnerReview !== expectedWaiting ||
    candidate.retainedAtPreparationOnly !== !approved ||
    candidate.reason.length < 80 ||
    candidate.reviewedPreparation.executionMode !==
      "SYNTHETIC_SANDBOX_EVIDENCE_ONLY" ||
    candidate.reviewedPreparation.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    candidate.reviewedPreparation.maximumEvidenceExecutionCount !== 1 ||
    candidate.reviewedPreparation.concurrentExecutionLimit !== 0 ||
    candidate.reviewedPreparation.deterministicEvidenceRequired !== true ||
    candidate.reviewedPreparation.independentValidationRequired !== true ||
    candidate.reviewedPreparation.ownerReviewAfterExecutionRequired !== true ||
    candidate.reviewedPreparation.monitoringRequired !== true ||
    candidate.reviewedPreparation.emergencyPauseRequired !== true ||
    candidate.reviewedPreparation.rollbackEvidenceRequired !== true ||
    candidate.reviewedPreparation.tenantBindingRequired !== true ||
    candidate.reviewedPreparation.ownerBindingRequired !== true ||
    candidate.reviewedPreparation.pathContainmentRequired !== true ||
    candidate.reviewedPreparation.secretExclusionRequired !== true ||
    candidate.reviewedPreparation.immutableAuditRequired !== true ||
    candidate.reviewedPreparation.evidenceExecutionPerformed !== false ||
    boundary.canonicalDecisionPreparationBound !== true ||
    boundary.preparationIntegrityVerified !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.controlIdentityBound !== true ||
    boundary.syntheticSafetyEvidenceExecutionAuthorized !== approved ||
    boundary.currentlyExecutable !== expectedCurrentlyExecutable ||
    boundary.waitingForPriorEvidenceOwnerReview !== expectedWaiting ||
    boundary.ownerReviewRequiredImmediatelyAfterExecution !== true ||
    boundary.monitoringRequired !== true ||
    boundary.emergencyPauseAvailable !== true ||
    boundary.rollbackEvidenceRequired !== true ||
    forbidden.some((value) => value !== false) ||
    !Object.isFrozen(candidate) ||
    !Object.isFrozen(candidate.reviewedPreparation) ||
    !Object.isFrozen(candidate.authorityBoundary)
  ) {
    throw new Error(
      `Repository read-only sandbox evidence-execution candidate decision ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
  record:
    EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision,
): void {
  validateCanonicalPreparation();

  requireIdentifier(
    "Repository read-only sandbox evidence-execution decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox evidence-execution decision time",
    record.decidedAt,
  );

  const {
    decisionDigest,
    ...recordCore
  } = record;

  if (
    !SHA256_PATTERN.test(decisionDigest) ||
    sha256(recordCore) !== decisionDigest
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-execution decision integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISIONS_RECORDED" ||
    record.sourcePreparationId !== preparation.preparationId ||
    record.sourcePreparationDigest !== preparation.preparationDigest ||
    record.sourceEvidencePlanReviewDecisionId !==
      preparation.sourceEvidencePlanReviewDecisionId ||
    record.sourceEvidencePlanReviewDecisionDigest !==
      preparation.sourceEvidencePlanReviewDecisionDigest ||
    record.sourceEvidencePlanPreparationId !==
      preparation.sourceEvidencePlanPreparationId ||
    record.sourceEvidencePlanPreparationDigest !==
      preparation.sourceEvidencePlanPreparationDigest ||
    record.tenantId !== preparation.tenantId ||
    record.ownerId !== preparation.ownerId ||
    record.workstreamSequence !== 3 ||
    record.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.evidenceClass !==
      "REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_SAFETY_EVIDENCE" ||
    record.ownerExecutionDecisionsRecorded !== true ||
    record.evidenceExecutionDecisionCount !== 8 ||
    record.candidateDecisions.length !== 8 ||
    Date.parse(record.decidedAt) < Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-execution decision identity is invalid.",
    );
  }

  const approvedIndexes = record.candidateDecisions
    .map((candidate, index) =>
      candidate.evidenceExecutionAuthorized ? index : -1,
    )
    .filter((index) => index >= 0);

  record.candidateDecisions.forEach(
    (candidate, index) =>
      validateCandidateDecision(
        candidate,
        index,
        approvedIndexes,
      ),
  );

  const approvedCount = approvedIndexes.length;
  const rejectedCount = 8 - approvedCount;
  const summary = record.summary;

  if (
    summary.evidenceExecutionDecisionCount !== 8 ||
    summary.approvedEvidenceExecutionCount !== approvedCount ||
    summary.rejectedEvidenceExecutionCount !== rejectedCount ||
    summary.currentlyExecutableCount !==
      (approvedCount > 0 ? 1 : 0) ||
    summary.waitingForPriorEvidenceOwnerReviewCount !==
      (approvedCount > 0 ? approvedCount - 1 : 0) ||
    summary.evidenceExecutionPerformedCount !== 0 ||
    summary.maximumEvidenceExecutionCount !== 1 ||
    summary.aggregateConcurrentExecutionLimit !== 0 ||
    summary.repositoryEvaluationAuthorizedCount !== 0 ||
    summary.repositoryReadAuthorizedCount !== 0 ||
    summary.repositoryWriteAuthorizedCount !== 0 ||
    summary.filesystemMutationAuthorizedCount !== 0 ||
    summary.gitMutationAuthorizedCount !== 0 ||
    summary.commandExecutionAuthorizedCount !== 0 ||
    summary.packageExecutionAuthorizedCount !== 0 ||
    summary.networkAccessAuthorizedCount !== 0 ||
    summary.productionDeploymentAuthorizedCount !== 0 ||
    summary.paymentExecutionAuthorizedCount !== 0 ||
    summary.publicLaunchAuthorizedCount !== 0 ||
    summary.uniqueCandidateDecisionDigestCount !== 8
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-execution decision summary is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.canonicalPreparationBound,
    boundary.canonicalPreparationIntegrityVerified,
    boundary.exactEightEvidenceExecutionDecisionsRequired,
    boundary.ownerIdentityBound,
    boundary.tenantIdentityBound,
    boundary.ownerExecutionDecisionsRecorded,
    boundary.oneAtATimeEvidenceExecutionRequired,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequiredImmediatelyAfterEveryExecution,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.syntheticSafetyEvidenceExecutionPerformed,
    boundary.repositoryReadOnlySandboxEvaluationAuthorized,
    boundary.repositoryReadOnlySandboxExecutionAuthorized,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessAuthorized,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryAuthorized,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentAuthorized,
    boundary.paymentExecutionAuthorized,
    boundary.financialCommitmentAuthorized,
    boundary.legalCommitmentAuthorized,
    boundary.autonomousDecisionAuthorized,
    boundary.concurrentEngineeringWorkAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  const expectedNextStep =
    approvedCount > 0
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_SEQUENCE_ONE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_EVIDENCE_EXECUTION_DECISION_PREPARATION";

  if (
    boundary.syntheticSafetyEvidenceExecutionAuthorized !==
      (approvedCount > 0) ||
    boundary.currentlyExecutableEvidenceCount !==
      (approvedCount > 0 ? 1 : 0) ||
    boundary.aggregateConcurrentExecutionLimit !== 0 ||
    requiredTrue.some((value) => value !== true) ||
    requiredFalse.some((value) => value !== false) ||
    record.nextStep !== expectedNextStep ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.candidateDecisions) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-execution decision authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecisionInput,
): EngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision {
  if (input.sourcePreparation !== preparation) {
    throw new Error(
      "Only the canonical repository read-only sandbox execution-decision preparation can receive owner decisions.",
    );
  }

  validateCanonicalPreparation();

  requireIdentifier(
    "Repository read-only sandbox evidence-execution decision ID",
    input.decisionId,
  );

  requireTimestamp(
    "Repository read-only sandbox evidence-execution decision time",
    input.decidedAt,
  );

  if (input.ownerId !== preparation.ownerId) {
    throw new Error(
      "Only the preparation-bound NEXUS owner can record these execution decisions.",
    );
  }

  if (
    input.decisions.length !== 8 ||
    input.reasons.length !== 8
  ) {
    throw new Error(
      "Exactly eight repository read-only sandbox evidence-execution decisions and reasons are required.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(preparation.preparedAt)
  ) {
    throw new Error(
      "Repository read-only sandbox evidence-execution decisions cannot precede preparation.",
    );
  }

  const record = buildDecision(
    input.decisionId,
    input.ownerId,
    input.decisions,
    input.reasons,
    input.decidedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationEvidenceExecutionDecision(
    record,
  );

  return record;
}