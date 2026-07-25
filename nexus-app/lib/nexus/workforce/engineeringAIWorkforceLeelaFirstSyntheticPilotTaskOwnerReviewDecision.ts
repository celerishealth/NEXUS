import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution,
} from "./engineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-leela-first-synthetic-pilot-task-owner-review-decision-v1";

export const ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS = [
  "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
  "REJECT_AND_RETAIN_LEELA_FIRST_TASK_ONLY",
] as const;

export type EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecisionType =
  typeof ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS[number];

export interface CreateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecisionInput {
  readonly decisionId:
    string;

  readonly sourceExecution:
    EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution;

  readonly ownerId:
    string;

  readonly decision:
    EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED";

  readonly sourceExecutionId:
    string;

  readonly sourceExecutionDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly reviewedEmployee: Readonly<{
    employeeId:
      "candidate-leela-v1";

    employeeCode:
      "nx-engineering-002";

    publicName:
      "Leela";

    officialRole:
      "AI Software Engineering Director";

    runtimeId:
      "runtime-engineering-nx-engineering-002-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      2;

    scenarioId:
      "EVIDENCE_GATED_DELIVERY_PLAN";
  }>;

  readonly nextCandidate: Readonly<{
    employeeId:
      "candidate-vivaan-v1";

    employeeCode:
      "nx-engineering-003";

    publicName:
      "Vivaan";

    officialRole:
      "AI Quality Assurance Director";

    runtimeId:
      "runtime-engineering-nx-engineering-003-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      3;

    scenarioId:
      "TARGETED_QUALITY_GAP_ANALYSIS";
  }>;

  readonly decision:
    EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly leelaFirstTaskApproved:
    boolean;

  readonly vivaanFirstTaskExecutionAuthorized:
    boolean;

  readonly vivaanFirstTaskExecutionPerformed:
    false;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    evidenceToolMode:
      "READ_ONLY";

    draftToolMode:
      "DRAFT_ONLY";

    reviewedTaskSequence:
      1;

    reviewedExecutionSequence:
      2;

    reviewedScenarioId:
      "EVIDENCE_GATED_DELIVERY_PLAN";

    draftOutcome:
      "BOUNDED_EVIDENCE_GATED_DELIVERY_PLAN_RECOMMENDED";

    riskLevel:
      "MEDIUM";

    deliveryStageCount:
      4;

    evidenceGateCount:
      5;

    maximumTaskCount:
      3;

    executedTaskCount:
      1;

    remainingTaskCapacity:
      2;

    ownerReviewFrequency:
      "AFTER_EVERY_PILOT_TASK";

    pilotDraftCreated:
      true;

    pilotCompleted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    canonicalLeelaExecutionBound:
      true;

    sourceExecutionIntegrityVerified:
      true;

    canonicalOwnerFirstTaskDecisionBound:
      true;

    ownerReviewDecisionRecorded:
      true;

    leelaFirstTaskReviewed:
      true;

    vivaanFirstTaskExecutionAuthorized:
      boolean;

    vivaanFirstTaskExecutionPerformed:
      false;

    onlyVivaanCurrentlyExecutable:
      boolean;

    remainingFiveAuthorizedCandidatesWaiting:
      true;

    stopAfterEveryTaskForOwnerReview:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    leelaSecondSyntheticPilotTaskExecutionAuthorized:
      false;

    leelaThirdSyntheticPilotTaskExecutionAuthorized:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

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

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly reason:
    string;

  readonly nextStep:
    | "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_THREE"
    | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_LEELA_REVIEW_REJECTION";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

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
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !/^[a-z0-9][a-z0-9-]{2,159}$/u.test(
      value,
    ) ||
    /(secret|password|token|credential|api[-_]?key|private[-_]?key)/iu.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid or credential-bearing.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(
      Date.parse(value),
    ) ||
    new Date(value).toISOString() !==
      value
  ) {
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
    normalized.length < 20 ||
    normalized.length > 1200 ||
    /(password|secret|credential|api[-_]?key|private[-_]?key|bearer\s+[a-z0-9._-]+)/iu.test(
      normalized,
    )
  ) {
    throw new Error(
      "Leela owner-review reason is invalid or credential-bearing.",
    );
  }
}

const canonicalSourceExecution =
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

const canonicalOwnerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const vivaanCandidate =
  canonicalOwnerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Vivaan",
  );

if (
  !vivaanCandidate ||
  vivaanCandidate.developmentSequence !==
    3 ||
  vivaanCandidate.executionSequence !==
    3 ||
  vivaanCandidate.employeeId !==
    "candidate-vivaan-v1" ||
  vivaanCandidate.employeeCode !==
    "nx-engineering-003" ||
  vivaanCandidate.officialRole !==
    "AI Quality Assurance Director" ||
  vivaanCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-003-candidate-v1" ||
  vivaanCandidate.taskSequence !==
    1 ||
  vivaanCandidate.scenarioId !==
    "TARGETED_QUALITY_GAP_ANALYSIS" ||
  vivaanCandidate.decision !==
    "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
  vivaanCandidate.firstTaskExecutionAuthorized !==
    true ||
  vivaanCandidate.firstTaskExecutionPerformed !==
    false ||
  vivaanCandidate.currentlyExecutable !==
    false ||
  vivaanCandidate.waitingForPriorCandidateOwnerReview !==
    true
) {
  throw new Error(
    "Canonical Vivaan first-task candidate decision is invalid.",
  );
}

const canonicalVivaanCandidate =
  vivaanCandidate;

let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution(
    canonicalSourceExecution,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    canonicalOwnerFirstTaskDecision,
  );

  if (
    canonicalSourceExecution.executionState !==
      "ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    canonicalSourceExecution.publicName !==
      "Leela" ||
    canonicalSourceExecution.taskSequence !==
      1 ||
    canonicalSourceExecution.executionSequence !==
      2 ||
    canonicalSourceExecution.scenarioId !==
      "EVIDENCE_GATED_DELIVERY_PLAN" ||
    canonicalSourceExecution.executionBoundary
      .ownerReviewRequiredImmediately !==
        true ||
    canonicalSourceExecution.executionBoundary
      .nextCandidateExecutionAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .remainingSixAuthorizedCandidatesWaiting !==
        true ||
    canonicalSourceExecution.executionBoundary
      .repositoryReadAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .repositoryWriteAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .productionDeploymentAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .realCustomerContactAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .paymentExecutionAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .publicLaunchAuthorized !==
        false ||
    canonicalSourceExecution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Leela owner review requires the exact canonical completed execution.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Leela first-task owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Leela first-task owner-review decision time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  const approved =
    record.decision ===
      "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  if (
    !ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" ||
    record.sourceExecutionId !==
      canonicalSourceExecution.executionId ||
    record.sourceExecutionDigest !==
      canonicalSourceExecution.executionDigest ||
    record.tenantId !==
      canonicalSourceExecution.tenantId ||
    record.ownerId !==
      canonicalSourceExecution.ownerId ||
    record.reviewedEmployee.employeeId !==
      canonicalSourceExecution.employeeId ||
    record.reviewedEmployee.employeeCode !==
      canonicalSourceExecution.employeeCode ||
    record.reviewedEmployee.publicName !==
      "Leela" ||
    record.reviewedEmployee.officialRole !==
      canonicalSourceExecution.officialRole ||
    record.reviewedEmployee.runtimeId !==
      canonicalSourceExecution.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      1 ||
    record.reviewedEmployee.executionSequence !==
      2 ||
    record.reviewedEmployee.scenarioId !==
      "EVIDENCE_GATED_DELIVERY_PLAN" ||
    record.nextCandidate.employeeId !==
      canonicalVivaanCandidate.employeeId ||
    record.nextCandidate.employeeCode !==
      canonicalVivaanCandidate.employeeCode ||
    record.nextCandidate.publicName !==
      "Vivaan" ||
    record.nextCandidate.officialRole !==
      canonicalVivaanCandidate.officialRole ||
    record.nextCandidate.runtimeId !==
      canonicalVivaanCandidate.runtimeId ||
    record.nextCandidate.taskSequence !==
      1 ||
    record.nextCandidate.executionSequence !==
      3 ||
    record.nextCandidate.scenarioId !==
      "TARGETED_QUALITY_GAP_ANALYSIS" ||
    record.leelaFirstTaskApproved !==
      approved ||
    record.vivaanFirstTaskExecutionAuthorized !==
      approved ||
    record.vivaanFirstTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Leela first-task owner-review source or decision binding is invalid.",
    );
  }

  const evidence =
    record.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.evidenceToolMode !==
      "READ_ONLY" ||
    evidence.draftToolMode !==
      "DRAFT_ONLY" ||
    evidence.reviewedTaskSequence !==
      1 ||
    evidence.reviewedExecutionSequence !==
      2 ||
    evidence.reviewedScenarioId !==
      "EVIDENCE_GATED_DELIVERY_PLAN" ||
    evidence.draftOutcome !==
      "BOUNDED_EVIDENCE_GATED_DELIVERY_PLAN_RECOMMENDED" ||
    evidence.riskLevel !==
      "MEDIUM" ||
    evidence.deliveryStageCount !==
      4 ||
    evidence.evidenceGateCount !==
      5 ||
    evidence.maximumTaskCount !==
      3 ||
    evidence.executedTaskCount !==
      1 ||
    evidence.remainingTaskCapacity !==
      2 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_PILOT_TASK" ||
    evidence.pilotDraftCreated !==
      true ||
    evidence.pilotCompleted !==
      false
  ) {
    throw new Error(
      "Leela owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalLeelaExecutionBound !== true ||
    boundary.sourceExecutionIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.ownerReviewDecisionRecorded !== true ||
    boundary.leelaFirstTaskReviewed !== true ||
    boundary.vivaanFirstTaskExecutionAuthorized !==
      approved ||
    boundary.vivaanFirstTaskExecutionPerformed !==
      false ||
    boundary.onlyVivaanCurrentlyExecutable !==
      approved ||
    boundary.remainingFiveAuthorizedCandidatesWaiting !==
      true ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.leelaSecondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.leelaThirdSyntheticPilotTaskExecutionAuthorized !==
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
      true
  ) {
    throw new Error(
      "Leela first-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_THREE"
      : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_LEELA_REVIEW_REJECTION";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalSourceExecution.executedAt,
      )
  ) {
    throw new Error(
      "Leela first-task owner-review sequencing is invalid.",
    );
  }

  const {
    decisionDigest,
    ...recordCore
  } = record;

  if (
    decisionDigest !==
      sha256(recordCore)
  ) {
    throw new Error(
      "Leela first-task owner-review digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEmployee) ||
    !Object.isFrozen(record.nextCandidate) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Leela first-task owner-review decision must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision {
  validateCanonicalSources();

  if (
    input.sourceExecution !==
      canonicalSourceExecution
  ) {
    validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution(
      input.sourceExecution,
    );
  }

  if (
    input.sourceExecution.executionId !==
      canonicalSourceExecution.executionId ||
    input.sourceExecution.executionDigest !==
      canonicalSourceExecution.executionDigest
  ) {
    throw new Error(
      "Leela first-task owner review requires the canonical source execution.",
    );
  }

  requireIdentifier(
    "Leela first-task owner-review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Leela first-task owner-review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Leela first-task owner-review decision time",
    input.decidedAt,
  );

  requireReason(
    input.reason,
  );

  if (
    input.ownerId !==
      canonicalSourceExecution.ownerId
  ) {
    throw new Error(
      "Leela first-task owner review is bound to the canonical owner.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Leela first-task owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      canonicalSourceExecution.executedAt,
    )
  ) {
    throw new Error(
      "Leela first-task owner review cannot precede task execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" as const,

    sourceExecutionId:
      canonicalSourceExecution.executionId,

    sourceExecutionDigest:
      canonicalSourceExecution.executionDigest,

    tenantId:
      canonicalSourceExecution.tenantId,

    ownerId:
      input.ownerId,

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
        "runtime-engineering-nx-engineering-002-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        2 as const,

      scenarioId:
        "EVIDENCE_GATED_DELIVERY_PLAN" as const,
    },

    nextCandidate: {
      employeeId:
        "candidate-vivaan-v1" as const,

      employeeCode:
        "nx-engineering-003" as const,

      publicName:
        "Vivaan" as const,

      officialRole:
        "AI Quality Assurance Director" as const,

      runtimeId:
        "runtime-engineering-nx-engineering-003-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        3 as const,

      scenarioId:
        "TARGETED_QUALITY_GAP_ANALYSIS" as const,
    },

    decision:
      input.decision,

    leelaFirstTaskApproved:
      approved,

    vivaanFirstTaskExecutionAuthorized:
      approved,

    vivaanFirstTaskExecutionPerformed:
      false as const,

    reviewedEvidence: {
      pilotClass:
        canonicalSourceExecution.pilotTask.pilotClass,

      dataClassification:
        canonicalSourceExecution.pilotTask.dataClassification,

      actorClass:
        canonicalSourceExecution.pilotTask.actorClass,

      executionMode:
        canonicalSourceExecution.pilotTask.executionMode,

      evidenceToolMode:
        canonicalSourceExecution.pilotTask.evidenceToolMode,

      draftToolMode:
        canonicalSourceExecution.pilotTask.draftToolMode,

      reviewedTaskSequence:
        1 as const,

      reviewedExecutionSequence:
        2 as const,

      reviewedScenarioId:
        "EVIDENCE_GATED_DELIVERY_PLAN" as const,

      draftOutcome:
        canonicalSourceExecution
          .evidenceGatedDeliveryPlanDraft
          .planOutcome,

      riskLevel:
        canonicalSourceExecution
          .evidenceGatedDeliveryPlanDraft
          .riskLevel,

      deliveryStageCount:
        4 as const,

      evidenceGateCount:
        5 as const,

      maximumTaskCount:
        canonicalSourceExecution.pilotTask.maximumTaskCount,

      executedTaskCount:
        canonicalSourceExecution.pilotTask.executedTaskCount,

      remainingTaskCapacity:
        canonicalSourceExecution.pilotTask.remainingTaskCapacity,

      ownerReviewFrequency:
        canonicalSourceExecution.pilotTask.ownerReviewFrequency,

      pilotDraftCreated:
        true as const,

      pilotCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalLeelaExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerFirstTaskDecisionBound:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      leelaFirstTaskReviewed:
        true as const,

      vivaanFirstTaskExecutionAuthorized:
        approved,

      vivaanFirstTaskExecutionPerformed:
        false as const,

      onlyVivaanCurrentlyExecutable:
        approved,

      remainingFiveAuthorizedCandidatesWaiting:
        true as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      leelaSecondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      leelaThirdSyntheticPilotTaskExecutionAuthorized:
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
    },

    reason:
      input.reason.trim(),

    nextStep:
      approved
        ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_THREE" as const
        : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_LEELA_REVIEW_REJECTION" as const,

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      decisionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision;

  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision({
    decisionId:
      "engineering-leela-first-synthetic-pilot-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",

    reason:
      "Prashant Srivastav reviewed Leela's first bounded synthetic evidence-gated engineering delivery plan and approved only Vivaan's already owner-authorized first synthetic quality pilot task as the next sequential execution. Repository access, deployment, customer contact, external delivery, payments, autonomous action, and public launch remain blocked.",

    decidedAt:
      "2026-07-25T15:41:21.061Z",
  });
