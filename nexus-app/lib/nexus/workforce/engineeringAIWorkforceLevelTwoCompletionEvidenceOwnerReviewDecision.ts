import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,
  type EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence,
  validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence,
} from "./engineeringAIWorkforceLevelTwoCompletionCriteriaEvidence";

export const ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-level-two-completion-evidence-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISIONS = [
  "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY",
  "REJECT_AND_RETAIN_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW",
] as const;

export type EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecisionType =
  typeof ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISIONS[number];

export interface CreateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecisionInput {
  readonly decisionId: string;
  readonly sourceEvidence:
    EngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence;
  readonly ownerId: string;
  readonly decision:
    EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW_DECISION_RECORDED";

  readonly sourceEvidenceId: string;
  readonly sourceEvidenceDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecisionType;

  readonly levelTwoEvidenceAccepted:
    boolean;

  readonly additionalAuthorityGranted:
    false;

  readonly reviewedEvidence: Readonly<{
    candidateCount: 8;
    qualificationCasesExecuted: 800;
    qualificationCasesPassed: 800;
    qualificationCasesFailed: 0;
    qualificationEvidenceCollected: 800;
    ownerActivationApprovedCount: 8;
    runtimeActivationExecutedCount: 8;
    activatedRuntimeCount: 8;
    controlledWorkAuthorizationCount: 8;
    shadowReviewApprovedCount: 8;
    shadowReviewRejectedCount: 0;
    limitedInternalPilotPreparationAuthorizedCount: 8;
    firstSyntheticPilotTaskExecutionAuthorizedCount: 8;
    firstSyntheticPilotTaskExecutionReviewedCount: 8;
    firstSyntheticPilotTaskExecutionApprovedCount: 8;
    engineeringFirstTaskSequenceCompleted: true;
    levelTwoEvidenceCriteriaSatisfied: true;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalLevelTwoEvidenceBound: true;
    sourceEvidenceIntegrityVerified: true;
    ownerReviewDecisionRecorded: true;
    ownerIdentityBound: true;
    ownerFinalAuthorityPreserved: true;
    levelTwoEvidenceCriteriaSatisfied: true;
    ownerCompletionReviewAccepted:
      boolean;
    additionalAuthorityGranted: false;
    levelThreeAuthorityGranted: false;
    pilotCompleted: false;
    furtherCandidateExecutionAuthorized: false;
    secondTaskExecutionAuthorized: false;
    thirdTaskExecutionAuthorized: false;
    concurrentExecutionAuthorized: false;
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized: false;
    mergeAuthorized: false;
    secretsAccessAuthorized: false;
    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    productionDeploymentAuthorized: false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized: false;
    legalCommitmentAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
    monitoringRequired: true;
    emergencyPauseAvailable: true;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution: false;
  }>;

  readonly reason: string;

  readonly nextStep:
    | "AWAIT_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINITION"
    | "RETAIN_ENGINEERING_LEVEL_TWO_EVIDENCE_REVIEW_REJECTION";

  readonly decidedAt: string;
  readonly decisionDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const SENSITIVE_REASON_PATTERN =
  /\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|password|secret|credential|bearer|private[_ -]?key)\b/i;

function stableNormalize(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    return Object.fromEntries(
      Object.entries(
        value as Record<string, unknown>,
      )
        .sort(
          ([left], [right]) =>
            left.localeCompare(right),
        )
        .map(
          ([key, nestedValue]) => [
            key,
            stableNormalize(nestedValue),
          ],
        ),
    );
  }

  return value;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        stableNormalize(value),
      ),
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (
    const nestedValue of
    Object.values(
      value as Record<string, unknown>,
    )
  ) {
    deepFreeze(nestedValue);
  }

  return value;
}


function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    value.trim() !== value ||
    Number.isNaN(
      Date.parse(value),
    )
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireReason(
  value: string,
): void {
  const normalized =
    value.trim();

  if (
    normalized.length < 40 ||
    normalized.length > 1200
  ) {
    throw new Error(
      "Engineering Level-2 owner-review reason is invalid.",
    );
  }

  if (
    SENSITIVE_REASON_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Engineering Level-2 owner-review reason must not contain sensitive material.",
    );
  }
}

const canonicalSourceEvidence =
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE;

function validateSourceEvidence(): void {
  validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
    canonicalSourceEvidence,
  );

  if (
    canonicalSourceEvidence.summary
      .levelTwoEvidenceCriteriaSatisfied !==
      true ||
    canonicalSourceEvidence.summary
      .engineeringFirstTaskSequenceCompleted !==
      true ||
    canonicalSourceEvidence.authorityBoundary
      .ownerCompletionReviewRequired !==
      true ||
    canonicalSourceEvidence.authorityBoundary
      .ownerCompletionReviewAccepted !==
      false ||
    canonicalSourceEvidence.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    canonicalSourceEvidence.authorityBoundary
      .pilotCompleted !==
      false ||
    canonicalSourceEvidence.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    canonicalSourceEvidence.authorityBoundary
      .founderReleasedFromRoutineExecution !==
      false
  ) {
    throw new Error(
      "Engineering Level-2 owner-review source evidence is not eligible for review.",
    );
  }
}

export function validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
  record:
    EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision,
): void {
  validateSourceEvidence();

  requireIdentifier(
    "Engineering Level-2 owner-review decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Engineering Level-2 owner-review owner ID",
    record.ownerId,
  );

  requireTimestamp(
    "Engineering Level-2 owner-review decision time",
    record.decidedAt,
  );

  requireDigest(
    "Engineering Level-2 owner-review decision digest",
    record.decisionDigest,
  );

  requireReason(
    record.reason,
  );

  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Engineering Level-2 owner-review decision integrity is invalid.",
    );
  }

  const approved =
    record.decision ===
      "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW_DECISION_RECORDED" ||
    record.sourceEvidenceId !==
      canonicalSourceEvidence.evidenceId ||
    record.sourceEvidenceDigest !==
      canonicalSourceEvidence.evidenceDigest ||
    record.tenantId !==
      canonicalSourceEvidence.tenantId ||
    record.ownerId !==
      canonicalSourceEvidence.ownerId ||
    !ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.levelTwoEvidenceAccepted !==
      approved ||
    record.additionalAuthorityGranted !==
      false ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalSourceEvidence.auditedAt,
      )
  ) {
    throw new Error(
      "Engineering Level-2 owner-review decision identity is invalid.",
    );
  }

  const expectedReviewedEvidence =
    canonicalSourceEvidence.summary;

  if (
    JSON.stringify(
      record.reviewedEvidence,
    ) !==
      JSON.stringify(
        expectedReviewedEvidence,
      )
  ) {
    throw new Error(
      "Engineering Level-2 owner-review reviewed evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalLevelTwoEvidenceBound !==
      true ||
    boundary.sourceEvidenceIntegrityVerified !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true ||
    boundary.levelTwoEvidenceCriteriaSatisfied !==
      true ||
    boundary.ownerCompletionReviewAccepted !==
      approved ||
    boundary.additionalAuthorityGranted !==
      false ||
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.pilotCompleted !==
      false ||
    boundary.furtherCandidateExecutionAuthorized !==
      false ||
    boundary.secondTaskExecutionAuthorized !==
      false ||
    boundary.thirdTaskExecutionAuthorized !==
      false ||
    boundary.concurrentExecutionAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false
  ) {
    throw new Error(
      "Engineering Level-2 owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINITION"
      : "RETAIN_ENGINEERING_LEVEL_TWO_EVIDENCE_REVIEW_REJECTION";

  if (
    record.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Engineering Level-2 owner-review next step is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecisionInput,
): EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision {
  validateSourceEvidence();

  if (
    input.sourceEvidence !==
      canonicalSourceEvidence
  ) {
    validateEngineeringAIWorkforceLevelTwoCompletionCriteriaEvidence(
      input.sourceEvidence,
    );
  }

  if (
    input.sourceEvidence.evidenceId !==
      canonicalSourceEvidence.evidenceId ||
    input.sourceEvidence.evidenceDigest !==
      canonicalSourceEvidence.evidenceDigest
  ) {
    throw new Error(
      "Engineering Level-2 owner review requires the canonical completion evidence.",
    );
  }

  requireIdentifier(
    "Engineering Level-2 owner-review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Engineering Level-2 owner-review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Engineering Level-2 owner-review decision time",
    input.decidedAt,
  );

  requireReason(
    input.reason,
  );

  if (
    input.ownerId !==
      canonicalSourceEvidence.ownerId
  ) {
    throw new Error(
      "Engineering Level-2 owner review is bound to the canonical owner.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Engineering Level-2 owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(
        canonicalSourceEvidence.auditedAt,
      )
  ) {
    throw new Error(
      "Engineering Level-2 owner review cannot precede the evidence audit.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_REVIEW_DECISION_RECORDED" as const,

    sourceEvidenceId:
      canonicalSourceEvidence.evidenceId,

    sourceEvidenceDigest:
      canonicalSourceEvidence.evidenceDigest,

    tenantId:
      canonicalSourceEvidence.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    levelTwoEvidenceAccepted:
      approved,

    additionalAuthorityGranted:
      false as const,

    reviewedEvidence: {
      ...canonicalSourceEvidence.summary,
    },

    authorityBoundary: {
      canonicalLevelTwoEvidenceBound:
        true as const,
      sourceEvidenceIntegrityVerified:
        true as const,
      ownerReviewDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
      levelTwoEvidenceCriteriaSatisfied:
        true as const,
      ownerCompletionReviewAccepted:
        approved,
      additionalAuthorityGranted:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      pilotCompleted:
        false as const,
      furtherCandidateExecutionAuthorized:
        false as const,
      secondTaskExecutionAuthorized:
        false as const,
      thirdTaskExecutionAuthorized:
        false as const,
      concurrentExecutionAuthorized:
        false as const,
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized:
        false as const,
      secretsAccessAuthorized:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      productionDatabaseAuthorized:
        false as const,
      productionMutationAuthorized:
        false as const,
      productionDeploymentAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      financialCommitmentAuthorized:
        false as const,
      legalCommitmentAuthorized:
        false as const,
      autonomousDecisionAuthorized:
        false as const,
      productionReadinessAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
      monitoringRequired:
        true as const,
      emergencyPauseAvailable:
        true as const,
      founderLiberationAchieved:
        false as const,
      founderReleasedFromRoutineExecution:
        false as const,
    },

    reason:
      input.reason.trim(),

    nextStep:
      approved
        ? "AWAIT_ENGINEERING_POST_LEVEL_TWO_SCOPE_DEFINITION" as const
        : "RETAIN_ENGINEERING_LEVEL_TWO_EVIDENCE_REVIEW_REJECTION" as const,

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision;

  validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision({
    decisionId:
      "engineering-ai-workforce-level-two-completion-evidence-owner-review-decision-001",

    sourceEvidence:
      ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY",

    reason:
      "Prashant Srivastav reviewed and accepted the canonical Engineering Level-2 completion-criteria evidence only. This acceptance grants no additional task, Level-3, repository, production, customer, provider, payment, financial, legal, autonomous, readiness, public-launch, or Founder Liberation authority.",

    decidedAt:
      "2026-07-31T16:10:59.8762424Z",
  });
