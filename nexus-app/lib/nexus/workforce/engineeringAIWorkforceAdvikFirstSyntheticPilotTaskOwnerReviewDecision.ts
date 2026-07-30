import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution,
} from "./engineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-advik-first-synthetic-pilot-task-owner-review-decision-v1";

export const ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS = [
  "APPROVE_ADVIK_FIRST_TASK_AND_COMPLETE_ENGINEERING_FIRST_TASK_SEQUENCE",
  "REJECT_AND_RETAIN_ADVIK_FIRST_TASK_REVIEW_ONLY",
] as const;

export type EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecisionType =
  typeof ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS[number];

export interface CreateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecisionInput {
  readonly decisionId:
    string;

  readonly sourceExecution:
    EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution;

  readonly ownerId:
    string;

  readonly decision:
    EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED";

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
      "candidate-advik-v1";

    employeeCode:
      "nx-engineering-008";

    publicName:
      "Advik";

    officialRole:
      "AI Systems Evaluation & Red-Team Specialist";

    runtimeId:
      "runtime-engineering-nx-engineering-008-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      8;

    scenarioId:
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN";
  }>;

  readonly canonicalCandidateDecision: Readonly<{
    employeeId:
      "candidate-advik-v1";

    employeeCode:
      "nx-engineering-008";

    publicName:
      "Advik";

    officialRole:
      "AI Systems Evaluation & Red-Team Specialist";

    runtimeId:
      "runtime-engineering-nx-engineering-008-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      8;

    scenarioId:
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN";
  }>;

  readonly decision:
    EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly advikFirstTaskApproved:
    boolean;

  readonly engineeringFirstTaskSequenceCompleted:
    boolean;

  readonly furtherCandidateExecutionAuthorized:
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
      8;

    reviewedScenarioId:
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN";

    analysisOutcome:
      "BOUNDED_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_RECOMMENDED";

    riskLevel:
      "MEDIUM";

    analysisStageCount:
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
    canonicalAdvikExecutionBound:
      true;

    sourceExecutionIntegrityVerified:
      true;

    canonicalOwnerFirstTaskDecisionBound:
      true;

    ownerReviewDecisionRecorded:
      true;

    advikFirstTaskReviewed:
      true;

    engineeringFirstTaskSequenceCompleted:
      boolean;

    furtherCandidateExecutionAuthorized:
      false;

    finalExecutionSequenceReached:
      true;

    firstTaskExecutionCapacityExhausted:
      true;

    stopAfterEveryTaskForOwnerReview:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    advikSecondSyntheticPilotTaskExecutionAuthorized:
      false;

    advikThirdSyntheticPilotTaskExecutionAuthorized:
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
    | "AWAIT_ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDIT"
    | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ADVIK_FIRST_TASK_REVIEW_REJECTION";

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
      "Advik owner-review reason is invalid or credential-bearing.",
    );
  }
}

const canonicalSourceExecution =
  ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

const canonicalOwnerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const advikCandidate =
  canonicalOwnerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Advik",
  );

if (
  !advikCandidate ||
  advikCandidate.developmentSequence !==
    8 ||
  advikCandidate.executionSequence !==
    8 ||
  advikCandidate.employeeId !==
    "candidate-advik-v1" ||
  advikCandidate.employeeCode !==
    "nx-engineering-008" ||
  advikCandidate.officialRole !==
    "AI Systems Evaluation & Red-Team Specialist" ||
  advikCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-008-candidate-v1" ||
  advikCandidate.taskSequence !==
    1 ||
  advikCandidate.scenarioId !==
    "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" ||
  advikCandidate.decision !==
    "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
  advikCandidate.firstTaskExecutionAuthorized !==
    true ||
  advikCandidate.firstTaskExecutionPerformed !==
    false ||
  advikCandidate.currentlyExecutable !==
    false ||
  advikCandidate.waitingForPriorCandidateOwnerReview !==
    true
) {
  throw new Error(
    "Canonical Advik first-task candidate decision is invalid.",
  );
}

const canonicalAdvikCandidate =
  advikCandidate;

let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution(
    canonicalSourceExecution,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    canonicalOwnerFirstTaskDecision,
  );

  if (
    canonicalSourceExecution.executionState !==
      "ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    canonicalSourceExecution.publicName !==
      "Advik" ||
    canonicalSourceExecution.taskSequence !==
      1 ||
    canonicalSourceExecution.executionSequence !==
      8 ||
    canonicalSourceExecution.scenarioId !==
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" ||
    canonicalSourceExecution.executionBoundary
      .ownerReviewRequiredImmediately !==
        true ||
    canonicalSourceExecution.executionBoundary
      .nextCandidateExecutionAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .remainingOneAuthorizedCandidateWaiting !==
        false ||
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
      "AWAIT_OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Advik owner review requires the exact canonical completed execution.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Advik first-task owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Advik first-task owner-review decision time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  const approved =
    record.decision ===
      "APPROVE_ADVIK_FIRST_TASK_AND_COMPLETE_ENGINEERING_FIRST_TASK_SEQUENCE";

  if (
    !ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" ||
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
      "Advik" ||
    record.reviewedEmployee.officialRole !==
      canonicalSourceExecution.officialRole ||
    record.reviewedEmployee.runtimeId !==
      canonicalSourceExecution.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      1 ||
    record.reviewedEmployee.executionSequence !==
      8 ||
    record.reviewedEmployee.scenarioId !==
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" ||
    record.canonicalCandidateDecision.employeeId !==
      canonicalAdvikCandidate.employeeId ||
    record.canonicalCandidateDecision.employeeCode !==
      canonicalAdvikCandidate.employeeCode ||
    record.canonicalCandidateDecision.publicName !==
      "Advik" ||
    record.canonicalCandidateDecision.officialRole !==
      canonicalAdvikCandidate.officialRole ||
    record.canonicalCandidateDecision.runtimeId !==
      canonicalAdvikCandidate.runtimeId ||
    record.canonicalCandidateDecision.taskSequence !==
      1 ||
    record.canonicalCandidateDecision.executionSequence !==
      8 ||
    record.canonicalCandidateDecision.scenarioId !==
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" ||
    record.advikFirstTaskApproved !==
      approved ||
    record.engineeringFirstTaskSequenceCompleted !==
      approved ||
    record.furtherCandidateExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Advik first-task owner-review source or decision binding is invalid.",
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
      8 ||
    evidence.reviewedScenarioId !==
      "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" ||
    evidence.analysisOutcome !==
      "BOUNDED_CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN_RECOMMENDED" ||
    evidence.riskLevel !==
      "MEDIUM" ||
    evidence.analysisStageCount !==
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
      "Advik owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalAdvikExecutionBound !== true ||
    boundary.sourceExecutionIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.ownerReviewDecisionRecorded !== true ||
    boundary.advikFirstTaskReviewed !== true ||
    boundary.engineeringFirstTaskSequenceCompleted !==
      approved ||
    boundary.furtherCandidateExecutionAuthorized !==
      false ||
    boundary.finalExecutionSequenceReached !==
      true ||
    boundary.firstTaskExecutionCapacityExhausted !==
      true ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.advikSecondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.advikThirdSyntheticPilotTaskExecutionAuthorized !==
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
      "Advik first-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "AWAIT_ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDIT"
      : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ADVIK_FIRST_TASK_REVIEW_REJECTION";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalSourceExecution.executedAt,
      )
  ) {
    throw new Error(
      "Advik first-task owner-review sequencing is invalid.",
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
      "Advik first-task owner-review digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEmployee) ||
    !Object.isFrozen(record.canonicalCandidateDecision) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Advik first-task owner-review decision must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision {
  validateCanonicalSources();

  if (
    input.sourceExecution !==
      canonicalSourceExecution
  ) {
    validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskExecution(
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
      "Advik first-task owner review requires the canonical source execution.",
    );
  }

  requireIdentifier(
    "Advik first-task owner-review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Advik first-task owner-review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Advik first-task owner-review decision time",
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
      "Advik first-task owner review is bound to the canonical owner.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Advik first-task owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      canonicalSourceExecution.executedAt,
    )
  ) {
    throw new Error(
      "Advik first-task owner review cannot precede task execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ADVIK_FIRST_TASK_AND_COMPLETE_ENGINEERING_FIRST_TASK_SEQUENCE";

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" as const,

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
        "candidate-advik-v1" as const,

      employeeCode:
        "nx-engineering-008" as const,

      publicName:
        "Advik" as const,

      officialRole:
        "AI Systems Evaluation & Red-Team Specialist" as const,

      runtimeId:
        "runtime-engineering-nx-engineering-008-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        8 as const,

      scenarioId:
        "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" as const,
    },

    canonicalCandidateDecision: {
      employeeId:
        "candidate-advik-v1" as const,

      employeeCode:
        "nx-engineering-008" as const,

      publicName:
        "Advik" as const,

      officialRole:
        "AI Systems Evaluation & Red-Team Specialist" as const,

      runtimeId:
        "runtime-engineering-nx-engineering-008-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        8 as const,

      scenarioId:
        "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" as const,
    },

    decision:
      input.decision,

    advikFirstTaskApproved:
      approved,

    engineeringFirstTaskSequenceCompleted:
      approved,

    furtherCandidateExecutionAuthorized:
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
        8 as const,

      reviewedScenarioId:
        "CANONICAL_EVIDENCE_SUBSTITUTION_TEST_PLAN" as const,

      analysisOutcome:
        canonicalSourceExecution
          .canonicalEvidenceSubstitutionTestPlanDraft
          .analysisOutcome,

      riskLevel:
        canonicalSourceExecution
          .canonicalEvidenceSubstitutionTestPlanDraft
          .riskLevel,

      analysisStageCount:
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
      canonicalAdvikExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerFirstTaskDecisionBound:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      advikFirstTaskReviewed:
        true as const,

      engineeringFirstTaskSequenceCompleted:
        approved,

      furtherCandidateExecutionAuthorized:
        false as const,

      finalExecutionSequenceReached:
        true as const,

      firstTaskExecutionCapacityExhausted:
        true as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      advikSecondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      advikThirdSyntheticPilotTaskExecutionAuthorized:
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
        ? "AWAIT_ENGINEERING_LEVEL_TWO_COMPLETION_CRITERIA_EVIDENCE_AUDIT" as const
        : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ADVIK_FIRST_TASK_REVIEW_REJECTION" as const,

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      decisionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision;

  validateEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceAdvikFirstSyntheticPilotTaskOwnerReviewDecision({
    decisionId:
      "engineering-advik-first-synthetic-pilot-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ADVIK_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ADVIK_FIRST_TASK_AND_COMPLETE_ENGINEERING_FIRST_TASK_SEQUENCE",

    reason:
      "Prashant Srivastav reviewed Advik's first bounded synthetic red-team evaluation and approved completion of only the eight-candidate Engineering first-task sequence. No further candidate task, second task, third task, repository operation, production action, customer contact, payment, autonomous action, real attack execution, or public launch is authorized.",

    decidedAt:
      "2026-07-25T15:53:00.000Z",
  });
