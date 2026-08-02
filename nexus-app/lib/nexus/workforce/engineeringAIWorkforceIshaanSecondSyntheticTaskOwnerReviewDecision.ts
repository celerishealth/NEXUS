import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE,
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO,
  type EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution,
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution,
} from "./engineeringAIWorkforceIshaanSecondSyntheticTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-ishaan-second-synthetic-task-owner-review-decision-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS =
  [
    "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY",
  ] as const;

export type EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecisionType =
  (
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISIONS
  )[number];

export interface CreateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecisionInput {
  readonly sourceExecution:
    EngineeringAIWorkforceIshaanSecondSyntheticTaskExecution;

  readonly decisionId: string;

  readonly ownerId: string;

  readonly decision:
    EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecisionType;

  readonly reason: string;

  readonly decidedAt: string;
}

export interface EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED";

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

  readonly sourceCandidateDecisionPreparationDigest:
    string;

  readonly sourceCandidatePlanDigest:
    string;

  readonly sourceCandidateDecisionDigest:
    string;

  readonly reviewedEmployee: Readonly<{
    employeeId:
      "candidate-ishaan-v1";

    employeeCode:
      "nx-engineering-001";

    publicName: "Ishaan";

    officialRole:
      "AI Principal Software Architect";

    runtimeId: string;

    taskSequence: 2;

    scenarioId:
      typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO;
  }>;

  readonly nextCandidate: Readonly<{
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
  }>;

  readonly decision:
    EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecisionType;

  readonly ishaanSecondTaskApproved:
    boolean;

  readonly leelaSecondTaskExecutionAuthorized:
    boolean;

  readonly leelaSecondTaskExecutionPerformed:
    false;

  readonly reason: string;

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

    reviewedTaskSequence: 2;

    reviewedScenarioId:
      typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO;

    objective:
      typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE;

    expectedEvidence:
      typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE;

    architectureEvidenceClass:
      "DETERMINISTIC_ARCHITECTURE_TRADE_OFF_PLAN";

    architectureReviewOutcome:
      "BOUNDED_INCREMENTAL_EVOLUTION_RECOMMENDED";

    recommendedOptionId:
      "OPTION_A_RETAIN_MODULAR_MONOLITH_WITH_STRONGER_INTERNAL_BOUNDARIES";

    deterministicEvidenceProduced:
      true;

    independentValidationRequired:
      true;

    independentValidationCompleted:
      false;

    sourceOwnerReviewPending:
      true;

    implementationExecuted: false;

    repositoryChangeExecuted: false;

    productionDeploymentExecuted:
      false;

    customerDeliveryExecuted: false;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalIshaanExecutionBound:
      true;

    sourceExecutionIntegrityVerified:
      true;

    canonicalOwnerExecutionDecisionBound:
      true;

    canonicalDecisionPreparationBound:
      true;

    sourceCandidatePlanBound: true;

    sourceCandidateDecisionBound:
      true;

    ownerIdentityBound: true;

    tenantIdentityBound: true;

    approvalBypassAllowed: false;

    ishaanSecondTaskReviewed: true;

    ownerReviewDecisionRecorded:
      true;

    ishaanSecondTaskApproved:
      boolean;

    leelaSecondTaskExecutionAuthorized:
      boolean;

    leelaSecondTaskExecutionPerformed:
      false;

    onlyLeelaCurrentlyExecutable:
      boolean;

    remainingSixAuthorizedCandidatesWaiting:
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

  readonly nextStep:
    | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_TWO"
    | "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY";

  readonly decidedAt: string;

  readonly decisionDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,159}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|credential|private[-_]?key|access[-_]?key)/i;

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
      "Unsupported deterministic Ishaan second-task owner-review value.",
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

function requireReason(
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length < 20 ||
    normalized.length > 1200
  ) {
    throw new Error(
      "Ishaan second-task owner-review reason must contain 20 to 1200 characters.",
    );
  }

  if (
    /(secret|access[_ -]?token|password|private[_ -]?key|api[_ -]?key|credential)\b/iu.test(
      normalized,
    )
  ) {
    throw new Error(
      "Ishaan second-task owner-review reason contains prohibited protected-material content.",
    );
  }

  return normalized;
}

const CANONICAL_ISHAAN_SECOND_TASK_EXECUTION =
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION;

const CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

const CANONICAL_LEELA_SECOND_TASK_CANDIDATE =
  CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName === "Leela",
    );

if (
  !CANONICAL_LEELA_SECOND_TASK_CANDIDATE ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.sequence !==
    2 ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.employeeId !==
    "candidate-leela-v1" ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.employeeCode !==
    "nx-engineering-002" ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.officialRole !==
    "AI Software Engineering Director" ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.taskSequence !==
    2 ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.scenarioId !==
    "ENGINEERING_DELIVERY_COORDINATION_PLAN" ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.decision !==
    "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.secondTaskExecutionAuthorized !==
    true ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.secondTaskExecutionPerformed !==
    false ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.currentlyExecutable !==
    false ||
  CANONICAL_LEELA_SECOND_TASK_CANDIDATE.waitingForPriorCandidateOwnerReview !==
    true
) {
  throw new Error(
    "Canonical Leela second-task candidate decision is invalid.",
  );
}

function getLeelaCandidate():
  NonNullable<
    typeof CANONICAL_LEELA_SECOND_TASK_CANDIDATE
  > {
  return CANONICAL_LEELA_SECOND_TASK_CANDIDATE!;
}

export function validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
): void {
  const {
    decisionDigest,
    ...decisionCore
  } = record;

  if (
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Ishaan second synthetic task owner-review decision integrity verification failed.",
    );
  }

  const source =
    CANONICAL_ISHAAN_SECOND_TASK_EXECUTION;

  const leela =
    getLeelaCandidate();

  const approved =
    record.decision ===
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" ||
    record.tenantId !== source.tenantId ||
    record.ownerId !== source.ownerId ||
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
      source.sourceDecisionPreparationDigest ||
    record.sourceCandidateDecisionPreparationDigest !==
      source.sourceCandidateDecisionPreparationDigest ||
    record.sourceCandidatePlanDigest !==
      source.sourceCandidatePlanDigest ||
    record.sourceCandidateDecisionDigest !==
      source.candidateDecisionDigest
  ) {
    throw new Error(
      "Ishaan second-task owner-review canonical source binding is invalid.",
    );
  }

  if (
    record.reviewedEmployee.employeeId !==
      "candidate-ishaan-v1" ||
    record.reviewedEmployee.employeeCode !==
      "nx-engineering-001" ||
    record.reviewedEmployee.publicName !==
      "Ishaan" ||
    record.reviewedEmployee.officialRole !==
      "AI Principal Software Architect" ||
    record.reviewedEmployee.runtimeId !==
      source.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO
  ) {
    throw new Error(
      "Ishaan second-task owner-review employee identity is invalid.",
    );
  }

  if (
    record.nextCandidate.employeeId !==
      leela.employeeId ||
    record.nextCandidate.employeeCode !==
      leela.employeeCode ||
    record.nextCandidate.publicName !==
      "Leela" ||
    record.nextCandidate.officialRole !==
      "AI Software Engineering Director" ||
    record.nextCandidate.runtimeId !==
      leela.runtimeId ||
    record.nextCandidate.taskSequence !==
      2 ||
    record.nextCandidate.scenarioId !==
      "ENGINEERING_DELIVERY_COORDINATION_PLAN"
  ) {
    throw new Error(
      "Ishaan second-task owner-review next-candidate binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Ishaan second-task owner-review decision is invalid.",
    );
  }

  if (
    record.ishaanSecondTaskApproved !==
      approved ||
    record.leelaSecondTaskExecutionAuthorized !==
      approved ||
    record.leelaSecondTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Ishaan second-task owner-review continuation state is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.workstreamId !==
      source.taskContract.workstreamId ||
    evidence.evidenceClass !==
      source.taskContract.evidenceClass ||
    evidence.dataClassification !==
      source.taskContract.dataClassification ||
    evidence.actorClass !==
      source.taskContract.actorClass ||
    evidence.executionMode !==
      source.taskContract.executionMode ||
    evidence.evidenceToolMode !==
      source.taskContract.evidenceToolMode ||
    evidence.outputMode !==
      source.taskContract.outputMode ||
    evidence.reviewedTaskSequence !==
      2 ||
    evidence.reviewedScenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO ||
    evidence.objective !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    evidence.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
    evidence.architectureEvidenceClass !==
      source.architectureTradeOffPlan.evidenceClass ||
    evidence.architectureReviewOutcome !==
      source.architectureTradeOffPlan.reviewOutcome ||
    evidence.recommendedOptionId !==
      source.architectureTradeOffPlan.recommendedOptionId ||
    evidence.deterministicEvidenceProduced !==
      true ||
    evidence.independentValidationRequired !==
      true ||
    evidence.independentValidationCompleted !==
      false ||
    evidence.sourceOwnerReviewPending !==
      true ||
    evidence.implementationExecuted !==
      false ||
    evidence.repositoryChangeExecuted !==
      false ||
    evidence.productionDeploymentExecuted !==
      false ||
    evidence.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Ishaan second-task owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalIshaanExecutionBound !==
      true ||
    boundary.sourceExecutionIntegrityVerified !==
      true ||
    boundary.canonicalOwnerExecutionDecisionBound !==
      true ||
    boundary.canonicalDecisionPreparationBound !==
      true ||
    boundary.sourceCandidatePlanBound !==
      true ||
    boundary.sourceCandidateDecisionBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.ishaanSecondTaskReviewed !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.ishaanSecondTaskApproved !==
      approved ||
    boundary.leelaSecondTaskExecutionAuthorized !==
      approved ||
    boundary.leelaSecondTaskExecutionPerformed !==
      false ||
    boundary.onlyLeelaCurrentlyExecutable !==
      approved ||
    boundary.remainingSixAuthorizedCandidatesWaiting !==
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
    boundary.monitoringRequired !== true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Ishaan second-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_TWO"
      : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Ishaan second-task owner-review transition is invalid.",
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
      "Ishaan second-task owner-review decision must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision {
  const canonicalSource =
    CANONICAL_ISHAAN_SECOND_TASK_EXECUTION;

  if (
    input.sourceExecution !==
      canonicalSource
  ) {
    validateEngineeringAIWorkforceIshaanSecondSyntheticTaskExecution(
      input.sourceExecution,
    );
  }

  if (
    input.sourceExecution.executionId !==
      canonicalSource.executionId ||
    input.sourceExecution.executionDigest !==
      canonicalSource.executionDigest
  ) {
    throw new Error(
      "Only the canonical Ishaan second synthetic task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Ishaan second-task owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Ishaan second-task owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      input.sourceExecution.ownerId
  ) {
    throw new Error(
      "Only the execution-bound owner can review Ishaan's second synthetic task.",
    );
  }

  const decidedAt =
    requireIsoTimestamp(
      "Ishaan second-task owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        input.sourceExecution.executedAt,
      )
  ) {
    throw new Error(
      "Ishaan second-task owner-review decision cannot precede task execution.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION" &&
    input.decision !==
      "REJECT_AND_RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY"
  ) {
    throw new Error(
      "Ishaan second-task owner-review decision is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const approved =
    input.decision ===
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION";

  const source =
    input.sourceExecution;

  const leela =
    getLeelaCandidate();

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_ISHAAN_SECOND_SYNTHETIC_TASK_REVIEW_RECORDED" as const,

    tenantId:
      source.tenantId,

    ownerId,

    sourceExecutionId:
      source.executionId,

    sourceExecutionDigest:
      source.executionDigest,

    ownerSecondTaskExecutionDecisionId:
      source.ownerSecondTaskExecutionDecisionId,

    ownerSecondTaskExecutionDecisionDigest:
      source.ownerSecondTaskExecutionDecisionDigest,

    sourceDecisionPreparationId:
      source.sourceDecisionPreparationId,

    sourceDecisionPreparationDigest:
      source.sourceDecisionPreparationDigest,

    sourceCandidateDecisionPreparationDigest:
      source.sourceCandidateDecisionPreparationDigest,

    sourceCandidatePlanDigest:
      source.sourceCandidatePlanDigest,

    sourceCandidateDecisionDigest:
      source.candidateDecisionDigest,

    reviewedEmployee: {
      employeeId:
        "candidate-ishaan-v1" as const,

      employeeCode:
        "nx-engineering-001" as const,

      publicName:
        "Ishaan" as const,

      officialRole:
        "AI Principal Software Architect" as const,

      runtimeId:
        source.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO,
    },

    nextCandidate: {
      employeeId:
        "candidate-leela-v1" as const,

      employeeCode:
        "nx-engineering-002" as const,

      publicName:
        "Leela" as const,

      officialRole:
        "AI Software Engineering Director" as const,

      runtimeId:
        leela.runtimeId,

      taskSequence:
        2 as const,

      scenarioId:
        "ENGINEERING_DELIVERY_COORDINATION_PLAN" as const,
    },

    decision:
      input.decision,

    ishaanSecondTaskApproved:
      approved,

    leelaSecondTaskExecutionAuthorized:
      approved,

    leelaSecondTaskExecutionPerformed:
      false as const,

    reason,

    reviewedEvidence: {
      workstreamId:
        source.taskContract.workstreamId,

      evidenceClass:
        source.taskContract.evidenceClass,

      dataClassification:
        source.taskContract.dataClassification,

      actorClass:
        source.taskContract.actorClass,

      executionMode:
        source.taskContract.executionMode,

      evidenceToolMode:
        source.taskContract.evidenceToolMode,

      outputMode:
        source.taskContract.outputMode,

      reviewedTaskSequence:
        2 as const,

      reviewedScenarioId:
        ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_SCENARIO,

      objective:
        ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OBJECTIVE,

      expectedEvidence:
        ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

      architectureEvidenceClass:
        source.architectureTradeOffPlan.evidenceClass,

      architectureReviewOutcome:
        source.architectureTradeOffPlan.reviewOutcome,

      recommendedOptionId:
        source.architectureTradeOffPlan.recommendedOptionId,

      deterministicEvidenceProduced:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,

      sourceOwnerReviewPending:
        true as const,

      implementationExecuted:
        false as const,

      repositoryChangeExecuted:
        false as const,

      productionDeploymentExecuted:
        false as const,

      customerDeliveryExecuted:
        false as const,
    },

    authorityBoundary: {
      canonicalIshaanExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerExecutionDecisionBound:
        true as const,

      canonicalDecisionPreparationBound:
        true as const,

      sourceCandidatePlanBound:
        true as const,

      sourceCandidateDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      ishaanSecondTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      ishaanSecondTaskApproved:
        approved,

      leelaSecondTaskExecutionAuthorized:
        approved,

      leelaSecondTaskExecutionPerformed:
        false as const,

      onlyLeelaCurrentlyExecutable:
        approved,

      remainingSixAuthorizedCandidatesWaiting:
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

    nextStep:
      (
        approved
          ? "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_TWO"
          : "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY"
      ) as
        | "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_TWO"
        | "RETAIN_ENGINEERING_POST_LEVEL_TWO_AT_ISHAAN_SECOND_TASK_ONLY",

    decidedAt,
  };

  const record =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision;

  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision({
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION,

    decisionId:
      "engineering-ishaan-second-task-owner-review-decision-001",

    ownerId:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_EXECUTION
        .ownerId,

    decision:
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION",

    reason:
      "Owner reviewed Ishaan's deterministic synthetic architecture trade-off evidence and approved only Leela's bounded second synthetic task as the next sequential step.",

    decidedAt:
      "2026-08-02T07:40:00.000Z",
  });