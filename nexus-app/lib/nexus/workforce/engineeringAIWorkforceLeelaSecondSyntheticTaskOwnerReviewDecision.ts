import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,
  type EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceLeelaSecondSyntheticTaskExecution";

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-leela-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly sourceExecution:
    EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution;

  readonly decisionId: string;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED";

  readonly tenantId: string;

  readonly ownerId: string;

  readonly sourceExecutionId: string;

  readonly sourceExecutionDigest: string;

  readonly ownerSecondTaskExecutionDecisionId:
    string;

  readonly ownerSecondTaskExecutionDecisionDigest:
    string;

  readonly sourceDecisionPreparationId:
    string;

  readonly sourceDecisionPreparationDigest:
    string;

  readonly reviewedEmployee: Readonly<{
    employeeId:
      "candidate-leela-v1";

    employeeCode:
      "nx-engineering-002";

    publicName: "Leela";

    officialRole:
      "AI Software Engineering Director";

    runtimeId: string;

    taskSequence: 2;

    scenarioId:
      "ENGINEERING_DELIVERY_COORDINATION_PLAN";

    sourceCandidateDecisionPreparationDigest:
      string;

    sourceCandidatePlanDigest: string;

    candidateDecisionDigest: string;
  }>;

  readonly nextCandidate: Readonly<{
    sequence: 3;

    employeeId:
      "candidate-vivaan-v1";

    employeeCode:
      "nx-engineering-003";

    publicName: "Vivaan";

    officialRole:
      "AI Quality Assurance Director";

    runtimeId: string;

    taskSequence: 2;

    scenarioId:
      "REGRESSION_RISK_CONTAINMENT_PLAN";

    sourceCandidateDecisionPreparationDigest:
      string;

    sourceCandidatePlanDigest: string;

    candidateDecisionDigest: string;
  }>;

  readonly decision:
    EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecisionType;

  readonly leelaSecondTaskApproved:
    boolean;

  readonly vivaanSecondTaskExecutionAuthorized:
    boolean;

  readonly vivaanSecondTaskExecutionPerformed:
    false;

  readonly reviewedEvidence: Readonly<{
    workstreamId:
      "routine-engineering-second-task-evidence";

    evidenceClass:
      "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    evidenceToolMode:
      "READ_ONLY";

    outputMode:
      "DRAFT_ONLY";

    taskSequence: 2;

    scenarioId:
      "ENGINEERING_DELIVERY_COORDINATION_PLAN";

    executionDigest: string;

    coordinationEvidenceDigest: string;

    deterministicEvidenceCreated: true;

    coordinationStageCount: 5;

    conflictPreventionControlCount: 6;

    pauseControlCount: 5;

    escalationControlCount: 5;

    ownerReviewControlCount: 5;

    implementationExecuted: false;

    repositoryChangeExecuted: false;

    productionDeploymentExecuted:
      false;

    customerDeliveryExecuted: false;

    ownerReviewCompleted: true;

    independentValidationRequired:
      true;

    independentValidationCompleted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalLeelaExecutionBound:
      true;

    sourceExecutionIntegrityVerified:
      true;

    canonicalOwnerExecutionDecisionBound:
      true;

    canonicalDecisionPreparationBound:
      true;

    sourceVivaanCandidateDecisionBound:
      true;

    ownerIdentityBound: true;

    tenantIdentityBound: true;

    approvalBypassAllowed: false;

    leelaSecondTaskReviewed: true;

    ownerReviewDecisionRecorded:
      true;

    leelaSecondTaskApproved:
      boolean;

    vivaanSecondTaskExecutionAuthorized:
      boolean;

    vivaanSecondTaskExecutionPerformed:
      false;

    onlyVivaanCurrentlyExecutable:
      boolean;

    remainingFiveAuthorizedCandidatesWaiting:
      boolean;

    concurrentCandidateExecutionAuthorized:
      false;

    sequentialExecutionRequired:
      true;

    aggregateConcurrentExecutionLimit:
      1;

    stopAfterEveryTaskForOwnerReview:
      true;

    stopOnFirstFailure: true;

    thirdSyntheticTaskExecutionAuthorized:
      false;

    repositoryReadAuthorized: false;

    repositoryWriteAuthorized: false;

    branchCreationAuthorized: false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized: false;

    secretsAccessAuthorized: false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized: false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized: false;

    autonomousDecisionAuthorized:
      false;

    levelThreeAuthorityGranted: false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized: false;

    founderLiberationAchieved: false;

    founderReleasedFromRoutineExecution:
      false;

    monitoringRequired: true;

    emergencyPauseAvailable: true;

    rollbackEvidenceRequired: true;

    ownerFinalAuthorityPreserved:
      true;
  }>;

  readonly reason: string;

  readonly nextStep:
    | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_THREE"
    | "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY";

  readonly decidedAt: string;

  readonly decisionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,159}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|credential|private[-_]?key|access[-_]?key)/i;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Leela second-task owner-review value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }

    Object.freeze(value);
  }

  return value;
}

function requireSafeIdentifier(
  label: string,
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    !SAFE_IDENTIFIER_PATTERN.test(
      normalized,
    ) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  return normalized;
}

function requireReason(
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length < 40 ||
    normalized.length > 1_000 ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Leela second-task owner-review reason is invalid.",
    );
  }

  return normalized;
}

function requireIsoTimestamp(
  label: string,
  value: string,
): string {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be a canonical ISO timestamp.`,
    );
  }

  return value;
}

const CANONICAL_LEELA_EXECUTION =
  ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_SECOND_TASK_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

const CANONICAL_SECOND_TASK_DECISION_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

const CANONICAL_VIVAAN_DECISION =
  CANONICAL_SECOND_TASK_DECISION
    .candidateDecisions
    .find(
      (candidate) =>
        candidate.publicName ===
          "Vivaan",
    );

const CANONICAL_VIVAAN_PREPARATION =
  CANONICAL_SECOND_TASK_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (candidate) =>
        candidate.publicName ===
          "Vivaan",
    );

if (
  !CANONICAL_VIVAAN_DECISION ||
  !CANONICAL_VIVAAN_PREPARATION ||
  CANONICAL_VIVAAN_DECISION.sequence !==
    3 ||
  CANONICAL_VIVAAN_DECISION.employeeId !==
    "candidate-vivaan-v1" ||
  CANONICAL_VIVAAN_DECISION.employeeCode !==
    "nx-engineering-003" ||
  CANONICAL_VIVAAN_DECISION.officialRole !==
    "AI Quality Assurance Director" ||
  CANONICAL_VIVAAN_DECISION.taskSequence !==
    2 ||
  CANONICAL_VIVAAN_DECISION.scenarioId !==
    "REGRESSION_RISK_CONTAINMENT_PLAN" ||
  CANONICAL_VIVAAN_DECISION.decision !==
    "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
  CANONICAL_VIVAAN_DECISION.secondTaskExecutionAuthorized !==
    true ||
  CANONICAL_VIVAAN_DECISION.secondTaskExecutionPerformed !==
    false ||
  CANONICAL_VIVAAN_DECISION.currentlyExecutable !==
    false ||
  CANONICAL_VIVAAN_DECISION.waitingForPriorCandidateOwnerReview !==
    true ||
  CANONICAL_VIVAAN_DECISION.authorityBoundary
    .concurrentCandidateExecutionAuthorized !==
    false ||
  CANONICAL_VIVAAN_PREPARATION.sequence !==
    3 ||
  CANONICAL_VIVAAN_PREPARATION.employeeId !==
    "candidate-vivaan-v1" ||
  CANONICAL_VIVAAN_PREPARATION.scenarioId !==
    "REGRESSION_RISK_CONTAINMENT_PLAN" ||
  CANONICAL_VIVAAN_DECISION.sourceCandidateDecisionPreparationDigest !==
    CANONICAL_VIVAAN_PREPARATION
      .candidateDecisionPreparationDigest
) {
  throw new Error(
    "Canonical Vivaan second-task continuation contract is invalid.",
  );
}

function getCanonicalVivaanDecision():
  NonNullable<
    typeof CANONICAL_VIVAAN_DECISION
  > {
  return CANONICAL_VIVAAN_DECISION!;
}

function getCanonicalVivaanPreparation():
  NonNullable<
    typeof CANONICAL_VIVAAN_PREPARATION
  > {
  return CANONICAL_VIVAAN_PREPARATION!;
}

function coordinationEvidenceDigest(
  source:
    EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
): string {
  return sha256({
    fixture:
      source.syntheticDeliveryFixture,

    plan:
      source.deliveryCoordinationPlan,
  });
}

export function validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision,
): void {
  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      decisionDigest,
    ) ||
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Leela second-task owner-review integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
    CANONICAL_LEELA_EXECUTION,
  );

  const source =
    CANONICAL_LEELA_EXECUTION;

  const vivaan =
    getCanonicalVivaanDecision();

  const vivaanPreparation =
    getCanonicalVivaanPreparation();

  const approved =
    record.decision ===
      "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      source.tenantId ||
    record.ownerId !==
      source.ownerId ||
    record.sourceExecutionId !==
      source.executionId ||
    record.sourceExecutionDigest !==
      source.executionDigest ||
    record.ownerSecondTaskExecutionDecisionId !==
      source.ownerSecondTaskExecutionDecisionId ||
    record.ownerSecondTaskExecutionDecisionDigest !==
      source.ownerSecondTaskExecutionDecisionDigest ||
    record.sourceDecisionPreparationId !==
      source.sourceDecisionPreparationId ||
    record.sourceDecisionPreparationDigest !==
      source.sourceDecisionPreparationDigest
  ) {
    throw new Error(
      "Leela second-task owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-leela-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-002" ||
    record.reviewedEmployee.publicName !==
      "Leela" ||
    record.reviewedEmployee.officialRole !==
      "AI Software Engineering Director" ||
    record.reviewedEmployee.runtimeId !==
      source.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "ENGINEERING_DELIVERY_COORDINATION_PLAN" ||
    record.reviewedEmployee.sourceCandidateDecisionPreparationDigest !==
      source.sourceCandidateDecisionPreparationDigest ||
    record.reviewedEmployee.sourceCandidatePlanDigest !==
      source.sourceCandidatePlanDigest ||
    record.reviewedEmployee.candidateDecisionDigest !==
      source.candidateDecisionDigest
  ) {
    throw new Error(
      "Leela second-task owner-review employee binding is invalid.",
    );
  }

  if (
    record.nextCandidate.sequence !==
      3 ||
    record.nextCandidate.employeeId !==
      "candidate-vivaan-v1" ||
    record.nextCandidate.employeeCode !==
      "nx-engineering-003" ||
    record.nextCandidate.publicName !==
      "Vivaan" ||
    record.nextCandidate.officialRole !==
      "AI Quality Assurance Director" ||
    record.nextCandidate.runtimeId !==
      vivaan.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "REGRESSION_RISK_CONTAINMENT_PLAN" ||
    record.nextCandidate.sourceCandidateDecisionPreparationDigest !==
      vivaan.sourceCandidateDecisionPreparationDigest ||
    record.nextCandidate.sourceCandidatePlanDigest !==
      vivaanPreparation
        .sourceCandidatePlanDigest ||
    record.nextCandidate.candidateDecisionDigest !==
      vivaan.candidateDecisionDigest
  ) {
    throw new Error(
      "Leela second-task owner-review Vivaan binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Leela second-task owner-review decision is invalid.",
    );
  }

  if (
    record.leelaSecondTaskApproved !==
      approved ||
    record.vivaanSecondTaskExecutionAuthorized !==
      approved ||
    record.vivaanSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Leela second-task owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    evidence.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.evidenceToolMode !==
      "READ_ONLY" ||
    evidence.outputMode !==
      "DRAFT_ONLY" ||
    evidence.taskSequence !== 2 ||
    evidence.scenarioId !==
      "ENGINEERING_DELIVERY_COORDINATION_PLAN" ||
    evidence.executionDigest !==
      source.executionDigest ||
    evidence.coordinationEvidenceDigest !==
      coordinationEvidenceDigest(
        source,
      ) ||
    evidence.deterministicEvidenceCreated !==
      true ||
    evidence.coordinationStageCount !==
      5 ||
    evidence.conflictPreventionControlCount !==
      6 ||
    evidence.pauseControlCount !==
      5 ||
    evidence.escalationControlCount !==
      5 ||
    evidence.ownerReviewControlCount !==
      5 ||
    evidence.implementationExecuted !==
      false ||
    evidence.repositoryChangeExecuted !==
      false ||
    evidence.productionDeploymentExecuted !==
      false ||
    evidence.customerDeliveryExecuted !==
      false ||
    evidence.ownerReviewCompleted !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false
  ) {
    throw new Error(
      "Leela second-task owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalLeelaExecutionBound !==
      true ||
    boundary.sourceExecutionIntegrityVerified !==
      true ||
    boundary.canonicalOwnerExecutionDecisionBound !==
      true ||
    boundary.canonicalDecisionPreparationBound !==
      true ||
    boundary.sourceVivaanCandidateDecisionBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.leelaSecondTaskReviewed !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.leelaSecondTaskApproved !==
      approved ||
    boundary.vivaanSecondTaskExecutionAuthorized !==
      approved ||
    boundary.vivaanSecondTaskExecutionPerformed !==
      false ||
    boundary.onlyVivaanCurrentlyExecutable !==
      approved ||
    boundary.remainingFiveAuthorizedCandidatesWaiting !==
      approved ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.sequentialExecutionRequired !==
      true ||
    boundary.aggregateConcurrentExecutionLimit !==
      1 ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.stopOnFirstFailure !==
      true ||
    boundary.thirdSyntheticTaskExecutionAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !== false ||
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
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Leela second-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_THREE"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Leela second-task owner-review transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedEmployee,
    ) ||
    !Object.isFrozen(
      record.nextCandidate,
    ) ||
    !Object.isFrozen(
      record.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Leela second-task owner-review must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision {
  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
    input.sourceExecution,
  );

  if (
    input.sourceExecution.executionId !==
      CANONICAL_LEELA_EXECUTION.executionId ||
    input.sourceExecution.executionDigest !==
      CANONICAL_LEELA_EXECUTION.executionDigest
  ) {
    throw new Error(
      "Only the canonical Leela second-task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Leela second-task owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Leela second-task owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      CANONICAL_LEELA_EXECUTION.ownerId
  ) {
    throw new Error(
      "Leela second-task owner-review owner identity is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const decidedAt =
    requireIsoTimestamp(
      "Leela second-task owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        CANONICAL_LEELA_EXECUTION
          .executedAt,
      )
  ) {
    throw new Error(
      "Leela second-task owner review cannot precede execution.",
    );
  }

  const vivaan =
    getCanonicalVivaanDecision();

  const vivaanPreparation =
    getCanonicalVivaanPreparation();

  const approved =
    input.decision ===
      "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION";

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      CANONICAL_LEELA_EXECUTION.tenantId,

    ownerId,

    sourceExecutionId:
      CANONICAL_LEELA_EXECUTION
        .executionId,

    sourceExecutionDigest:
      CANONICAL_LEELA_EXECUTION
        .executionDigest,

    ownerSecondTaskExecutionDecisionId:
      CANONICAL_LEELA_EXECUTION
        .ownerSecondTaskExecutionDecisionId,

    ownerSecondTaskExecutionDecisionDigest:
      CANONICAL_LEELA_EXECUTION
        .ownerSecondTaskExecutionDecisionDigest,

    sourceDecisionPreparationId:
      CANONICAL_LEELA_EXECUTION
        .sourceDecisionPreparationId,

    sourceDecisionPreparationDigest:
      CANONICAL_LEELA_EXECUTION
        .sourceDecisionPreparationDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-leela-v1" as const,

      employeeCode:
        "nx-engineering-002" as const,

      publicName:
        "Leela" as const,

      officialRole:
        "AI Software Engineering Director" as const,

      runtimeId:
        CANONICAL_LEELA_EXECUTION
          .runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "ENGINEERING_DELIVERY_COORDINATION_PLAN" as const,

      sourceCandidateDecisionPreparationDigest:
        CANONICAL_LEELA_EXECUTION
          .sourceCandidateDecisionPreparationDigest,

      sourceCandidatePlanDigest:
        CANONICAL_LEELA_EXECUTION
          .sourceCandidatePlanDigest,

      candidateDecisionDigest:
        CANONICAL_LEELA_EXECUTION
          .candidateDecisionDigest,
    },

    nextCandidate: {
      sequence:
        3 as const,

      employeeId:
        "candidate-vivaan-v1" as const,

      employeeCode:
        "nx-engineering-003" as const,

      publicName:
        "Vivaan" as const,

      officialRole:
        "AI Quality Assurance Director" as const,

      runtimeId:
        vivaan.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "REGRESSION_RISK_CONTAINMENT_PLAN" as const,

      sourceCandidateDecisionPreparationDigest:
        vivaan
          .sourceCandidateDecisionPreparationDigest,

      sourceCandidatePlanDigest:
        vivaanPreparation
          .sourceCandidatePlanDigest,

      candidateDecisionDigest:
        vivaan.candidateDecisionDigest,
    },

    decision:
      input.decision,

    leelaSecondTaskApproved:
      approved,

    vivaanSecondTaskExecutionAuthorized:
      approved,

    vivaanSecondTaskExecutionPerformed:
      false as const,

    reviewedEvidence: {
      workstreamId:
        "routine-engineering-second-task-evidence" as const,

      evidenceClass:
        "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      evidenceToolMode:
        "READ_ONLY" as const,

      outputMode:
        "DRAFT_ONLY" as const,

      taskSequence:
        2 as const,

      scenarioId:
        "ENGINEERING_DELIVERY_COORDINATION_PLAN" as const,

      executionDigest:
        CANONICAL_LEELA_EXECUTION
          .executionDigest,

      coordinationEvidenceDigest:
        coordinationEvidenceDigest(
          CANONICAL_LEELA_EXECUTION,
        ),

      deterministicEvidenceCreated:
        true as const,

      coordinationStageCount:
        5 as const,

      conflictPreventionControlCount:
        6 as const,

      pauseControlCount:
        5 as const,

      escalationControlCount:
        5 as const,

      ownerReviewControlCount:
        5 as const,

      implementationExecuted:
        false as const,

      repositoryChangeExecuted:
        false as const,

      productionDeploymentExecuted:
        false as const,

      customerDeliveryExecuted:
        false as const,

      ownerReviewCompleted:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalLeelaExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerExecutionDecisionBound:
        true as const,

      canonicalDecisionPreparationBound:
        true as const,

      sourceVivaanCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      leelaSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      leelaSecondTaskApproved:
        approved,

      vivaanSecondTaskExecutionAuthorized:
        approved,

      vivaanSecondTaskExecutionPerformed:
        false as const,

      onlyVivaanCurrentlyExecutable:
        approved,

      remainingFiveAuthorizedCandidatesWaiting:
        approved,

      concurrentCandidateExecutionAuthorized:
        false as const,

      sequentialExecutionRequired:
        true as const,

      aggregateConcurrentExecutionLimit:
        1 as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      stopOnFirstFailure:
        true as const,

      thirdSyntheticTaskExecutionAuthorized:
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

      levelThreeAuthorityGranted:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      founderLiberationAchieved:
        false as const,

      founderReleasedFromRoutineExecution:
        false as const,

      monitoringRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,

      rollbackEvidenceRequired:
        true as const,

      ownerFinalAuthorityPreserved:
        true as const,
    },

    reason,

    nextStep:
      approved
        ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_THREE" as const
        : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_LEELA_SECOND_TASK_ONLY" as const,

    decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision;

  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceLeelaSecondSyntheticTaskOwnerReviewDecision({
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION,

    decisionId:
      "engineering-leela-second-task-owner-review-decision-001",

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_VIVAAN_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Leela's deterministic bounded engineering-delivery coordination evidence, approved the result, and authorized only Vivaan's second synthetic regression-risk containment task next.",

    decidedAt:
      "2026-08-02T08:20:00.000Z",
  });