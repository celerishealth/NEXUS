import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution,
} from "./engineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-atharv-first-synthetic-pilot-task-owner-review-decision-v1";

export const ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS = [
  "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
  "REJECT_AND_RETAIN_ATHARV_FIRST_TASK_ONLY",
] as const;

export type EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecisionType =
  typeof ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS[number];

export interface CreateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecisionInput {
  readonly decisionId:
    string;

  readonly sourceExecution:
    EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution;

  readonly ownerId:
    string;

  readonly decision:
    EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED";

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
      "candidate-atharv-v1";

    employeeCode:
      "nx-engineering-005";

    publicName:
      "Atharv";

    officialRole:
      "AI Reliability Engineering Specialist";

    runtimeId:
      "runtime-engineering-nx-engineering-005-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      5;

    scenarioId:
      "RECOVERY_EVIDENCE_REVIEW";
  }>;

  readonly nextCandidate: Readonly<{
    employeeId:
      "candidate-mahir-v1";

    employeeCode:
      "nx-engineering-006";

    publicName:
      "Mahir";

    officialRole:
      "AI Chaos Engineering Specialist";

    runtimeId:
      "runtime-engineering-nx-engineering-006-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      6;

    scenarioId:
      "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN";
  }>;

  readonly decision:
    EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly atharvFirstTaskApproved:
    boolean;

  readonly mahirFirstTaskExecutionAuthorized:
    boolean;

  readonly mahirFirstTaskExecutionPerformed:
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
      5;

    reviewedScenarioId:
      "RECOVERY_EVIDENCE_REVIEW";

    analysisOutcome:
      "BOUNDED_RECOVERY_EVIDENCE_REVIEW_RECOMMENDED";

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
    canonicalAtharvExecutionBound:
      true;

    sourceExecutionIntegrityVerified:
      true;

    canonicalOwnerFirstTaskDecisionBound:
      true;

    ownerReviewDecisionRecorded:
      true;

    atharvFirstTaskReviewed:
      true;

    mahirFirstTaskExecutionAuthorized:
      boolean;

    mahirFirstTaskExecutionPerformed:
      false;

    onlyMahirCurrentlyExecutable:
      boolean;

    remainingTwoAuthorizedCandidatesWaiting:
      true;

    stopAfterEveryTaskForOwnerReview:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    atharvSecondSyntheticPilotTaskExecutionAuthorized:
      false;

    atharvThirdSyntheticPilotTaskExecutionAuthorized:
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
    | "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SIX"
    | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ATHARV_REVIEW_REJECTION";

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
      "Atharv owner-review reason is invalid or credential-bearing.",
    );
  }
}

const canonicalSourceExecution =
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

const canonicalOwnerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const mahirCandidate =
  canonicalOwnerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Mahir",
  );

if (
  !mahirCandidate ||
  mahirCandidate.developmentSequence !==
    6 ||
  mahirCandidate.executionSequence !==
    6 ||
  mahirCandidate.employeeId !==
    "candidate-mahir-v1" ||
  mahirCandidate.employeeCode !==
    "nx-engineering-006" ||
  mahirCandidate.officialRole !==
    "AI Chaos Engineering Specialist" ||
  mahirCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-006-candidate-v1" ||
  mahirCandidate.taskSequence !==
    1 ||
  mahirCandidate.scenarioId !==
    "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN" ||
  mahirCandidate.decision !==
    "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
  mahirCandidate.firstTaskExecutionAuthorized !==
    true ||
  mahirCandidate.firstTaskExecutionPerformed !==
    false ||
  mahirCandidate.currentlyExecutable !==
    false ||
  mahirCandidate.waitingForPriorCandidateOwnerReview !==
    true
) {
  throw new Error(
    "Canonical Mahir first-task candidate decision is invalid.",
  );
}

const canonicalMahirCandidate =
  mahirCandidate;

let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution(
    canonicalSourceExecution,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    canonicalOwnerFirstTaskDecision,
  );

  if (
    canonicalSourceExecution.executionState !==
      "ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    canonicalSourceExecution.publicName !==
      "Atharv" ||
    canonicalSourceExecution.taskSequence !==
      1 ||
    canonicalSourceExecution.executionSequence !==
      5 ||
    canonicalSourceExecution.scenarioId !==
      "RECOVERY_EVIDENCE_REVIEW" ||
    canonicalSourceExecution.executionBoundary
      .ownerReviewRequiredImmediately !==
        true ||
    canonicalSourceExecution.executionBoundary
      .nextCandidateExecutionAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .remainingThreeAuthorizedCandidatesWaiting !==
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
      "AWAIT_OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Atharv owner review requires the exact canonical completed execution.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Atharv first-task owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Atharv first-task owner-review decision time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  const approved =
    record.decision ===
      "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  if (
    !ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" ||
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
      "Atharv" ||
    record.reviewedEmployee.officialRole !==
      canonicalSourceExecution.officialRole ||
    record.reviewedEmployee.runtimeId !==
      canonicalSourceExecution.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      1 ||
    record.reviewedEmployee.executionSequence !==
      5 ||
    record.reviewedEmployee.scenarioId !==
      "RECOVERY_EVIDENCE_REVIEW" ||
    record.nextCandidate.employeeId !==
      canonicalMahirCandidate.employeeId ||
    record.nextCandidate.employeeCode !==
      canonicalMahirCandidate.employeeCode ||
    record.nextCandidate.publicName !==
      "Mahir" ||
    record.nextCandidate.officialRole !==
      canonicalMahirCandidate.officialRole ||
    record.nextCandidate.runtimeId !==
      canonicalMahirCandidate.runtimeId ||
    record.nextCandidate.taskSequence !==
      1 ||
    record.nextCandidate.executionSequence !==
      6 ||
    record.nextCandidate.scenarioId !==
      "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN" ||
    record.atharvFirstTaskApproved !==
      approved ||
    record.mahirFirstTaskExecutionAuthorized !==
      approved ||
    record.mahirFirstTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Atharv first-task owner-review source or decision binding is invalid.",
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
      5 ||
    evidence.reviewedScenarioId !==
      "RECOVERY_EVIDENCE_REVIEW" ||
    evidence.analysisOutcome !==
      "BOUNDED_RECOVERY_EVIDENCE_REVIEW_RECOMMENDED" ||
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
      "Atharv owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalAtharvExecutionBound !== true ||
    boundary.sourceExecutionIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.ownerReviewDecisionRecorded !== true ||
    boundary.atharvFirstTaskReviewed !== true ||
    boundary.mahirFirstTaskExecutionAuthorized !==
      approved ||
    boundary.mahirFirstTaskExecutionPerformed !==
      false ||
    boundary.onlyMahirCurrentlyExecutable !==
      approved ||
    boundary.remainingTwoAuthorizedCandidatesWaiting !==
      true ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.atharvSecondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.atharvThirdSyntheticPilotTaskExecutionAuthorized !==
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
      "Atharv first-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SIX"
      : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ATHARV_REVIEW_REJECTION";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalSourceExecution.executedAt,
      )
  ) {
    throw new Error(
      "Atharv first-task owner-review sequencing is invalid.",
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
      "Atharv first-task owner-review digest is invalid.",
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
      "Atharv first-task owner-review decision must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision {
  validateCanonicalSources();

  if (
    input.sourceExecution !==
      canonicalSourceExecution
  ) {
    validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution(
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
      "Atharv first-task owner review requires the canonical source execution.",
    );
  }

  requireIdentifier(
    "Atharv first-task owner-review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Atharv first-task owner-review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Atharv first-task owner-review decision time",
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
      "Atharv first-task owner review is bound to the canonical owner.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Atharv first-task owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      canonicalSourceExecution.executedAt,
    )
  ) {
    throw new Error(
      "Atharv first-task owner review cannot precede task execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" as const,

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
        "candidate-atharv-v1" as const,

      employeeCode:
        "nx-engineering-005" as const,

      publicName:
        "Atharv" as const,

      officialRole:
        "AI Reliability Engineering Specialist" as const,

      runtimeId:
        "runtime-engineering-nx-engineering-005-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        5 as const,

      scenarioId:
        "RECOVERY_EVIDENCE_REVIEW" as const,
    },

    nextCandidate: {
      employeeId:
        "candidate-mahir-v1" as const,

      employeeCode:
        "nx-engineering-006" as const,

      publicName:
        "Mahir" as const,

      officialRole:
        "AI Chaos Engineering Specialist" as const,

      runtimeId:
        "runtime-engineering-nx-engineering-006-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        6 as const,

      scenarioId:
        "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN" as const,
    },

    decision:
      input.decision,

    atharvFirstTaskApproved:
      approved,

    mahirFirstTaskExecutionAuthorized:
      approved,

    mahirFirstTaskExecutionPerformed:
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
        5 as const,

      reviewedScenarioId:
        "RECOVERY_EVIDENCE_REVIEW" as const,

      analysisOutcome:
        canonicalSourceExecution
          .recoveryEvidenceReviewDraft
          .analysisOutcome,

      riskLevel:
        canonicalSourceExecution
          .recoveryEvidenceReviewDraft
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
      canonicalAtharvExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerFirstTaskDecisionBound:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      atharvFirstTaskReviewed:
        true as const,

      mahirFirstTaskExecutionAuthorized:
        approved,

      mahirFirstTaskExecutionPerformed:
        false as const,

      onlyMahirCurrentlyExecutable:
        approved,

      remainingTwoAuthorizedCandidatesWaiting:
        true as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      atharvSecondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      atharvThirdSyntheticPilotTaskExecutionAuthorized:
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
        ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SIX" as const
        : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ATHARV_REVIEW_REJECTION" as const,

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      decisionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision;

  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision({
    decisionId:
      "engineering-atharv-first-synthetic-pilot-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",

    reason:
      "Prashant Srivastav reviewed Atharv's first bounded synthetic recovery evidence review and approved only Mahir's already owner-authorized first synthetic chaos-engineering pilot task as the next sequential execution. Repository access, deployment, customer contact, external delivery, payments, autonomous action, live chaos execution, and public launch remain blocked.",

    decidedAt:
      "2026-07-25T15:47:00.000Z",
  });
