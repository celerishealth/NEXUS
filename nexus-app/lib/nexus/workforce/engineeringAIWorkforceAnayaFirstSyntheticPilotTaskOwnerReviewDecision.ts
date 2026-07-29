import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution,
  type EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution,
} from "./engineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-anaya-first-synthetic-pilot-task-owner-review-decision-v1";

export const ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS = [
  "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
  "REJECT_AND_RETAIN_ANAYA_FIRST_TASK_ONLY",
] as const;

export type EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecisionType =
  typeof ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS[number];

export interface CreateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecisionInput {
  readonly decisionId:
    string;

  readonly sourceExecution:
    EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution;

  readonly ownerId:
    string;

  readonly decision:
    EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED";

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
      "candidate-anaya-v1";

    employeeCode:
      "nx-engineering-004";

    publicName:
      "Anaya";

    officialRole:
      "AI Security Engineering Director";

    runtimeId:
      "runtime-engineering-nx-engineering-004-candidate-v1";

    taskSequence:
      1;

    executionSequence:
      4;

    scenarioId:
      "AUTHORITY_ESCALATION_THREAT_REVIEW";
  }>;

  readonly nextCandidate: Readonly<{
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

  readonly decision:
    EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly anayaFirstTaskApproved:
    boolean;

  readonly atharvFirstTaskExecutionAuthorized:
    boolean;

  readonly atharvFirstTaskExecutionPerformed:
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
      4;

    reviewedScenarioId:
      "AUTHORITY_ESCALATION_THREAT_REVIEW";

    analysisOutcome:
      "BOUNDED_AUTHORITY_ESCALATION_THREAT_REVIEW_RECOMMENDED";

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
    canonicalAnayaExecutionBound:
      true;

    sourceExecutionIntegrityVerified:
      true;

    canonicalOwnerFirstTaskDecisionBound:
      true;

    ownerReviewDecisionRecorded:
      true;

    anayaFirstTaskReviewed:
      true;

    atharvFirstTaskExecutionAuthorized:
      boolean;

    atharvFirstTaskExecutionPerformed:
      false;

    onlyAtharvCurrentlyExecutable:
      boolean;

    remainingThreeAuthorizedCandidatesWaiting:
      true;

    stopAfterEveryTaskForOwnerReview:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    anayaSecondSyntheticPilotTaskExecutionAuthorized:
      false;

    anayaThirdSyntheticPilotTaskExecutionAuthorized:
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
    | "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_FIVE"
    | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ANAYA_REVIEW_REJECTION";

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
      "Anaya owner-review reason is invalid or credential-bearing.",
    );
  }
}

const canonicalSourceExecution =
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

const canonicalOwnerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const atharvCandidate =
  canonicalOwnerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Atharv",
  );

if (
  !atharvCandidate ||
  atharvCandidate.developmentSequence !==
    5 ||
  atharvCandidate.executionSequence !==
    5 ||
  atharvCandidate.employeeId !==
    "candidate-atharv-v1" ||
  atharvCandidate.employeeCode !==
    "nx-engineering-005" ||
  atharvCandidate.officialRole !==
    "AI Reliability Engineering Specialist" ||
  atharvCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-005-candidate-v1" ||
  atharvCandidate.taskSequence !==
    1 ||
  atharvCandidate.scenarioId !==
    "RECOVERY_EVIDENCE_REVIEW" ||
  atharvCandidate.decision !==
    "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
  atharvCandidate.firstTaskExecutionAuthorized !==
    true ||
  atharvCandidate.firstTaskExecutionPerformed !==
    false ||
  atharvCandidate.currentlyExecutable !==
    false ||
  atharvCandidate.waitingForPriorCandidateOwnerReview !==
    true
) {
  throw new Error(
    "Canonical Atharv first-task candidate decision is invalid.",
  );
}

const canonicalAtharvCandidate =
  atharvCandidate;

let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution(
    canonicalSourceExecution,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    canonicalOwnerFirstTaskDecision,
  );

  if (
    canonicalSourceExecution.executionState !==
      "ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    canonicalSourceExecution.publicName !==
      "Anaya" ||
    canonicalSourceExecution.taskSequence !==
      1 ||
    canonicalSourceExecution.executionSequence !==
      4 ||
    canonicalSourceExecution.scenarioId !==
      "AUTHORITY_ESCALATION_THREAT_REVIEW" ||
    canonicalSourceExecution.executionBoundary
      .ownerReviewRequiredImmediately !==
        true ||
    canonicalSourceExecution.executionBoundary
      .nextCandidateExecutionAuthorized !==
        false ||
    canonicalSourceExecution.executionBoundary
      .remainingFourAuthorizedCandidatesWaiting !==
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
      "AWAIT_OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Anaya owner review requires the exact canonical completed execution.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Anaya first-task owner-review decision ID",
    record.decisionId,
  );

  requireTimestamp(
    "Anaya first-task owner-review decision time",
    record.decidedAt,
  );

  requireReason(
    record.reason,
  );

  const approved =
    record.decision ===
      "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  if (
    !ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      record.decision,
    ) ||
    record.version !==
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" ||
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
      "Anaya" ||
    record.reviewedEmployee.officialRole !==
      canonicalSourceExecution.officialRole ||
    record.reviewedEmployee.runtimeId !==
      canonicalSourceExecution.runtimeId ||
    record.reviewedEmployee.taskSequence !==
      1 ||
    record.reviewedEmployee.executionSequence !==
      4 ||
    record.reviewedEmployee.scenarioId !==
      "AUTHORITY_ESCALATION_THREAT_REVIEW" ||
    record.nextCandidate.employeeId !==
      canonicalAtharvCandidate.employeeId ||
    record.nextCandidate.employeeCode !==
      canonicalAtharvCandidate.employeeCode ||
    record.nextCandidate.publicName !==
      "Atharv" ||
    record.nextCandidate.officialRole !==
      canonicalAtharvCandidate.officialRole ||
    record.nextCandidate.runtimeId !==
      canonicalAtharvCandidate.runtimeId ||
    record.nextCandidate.taskSequence !==
      1 ||
    record.nextCandidate.executionSequence !==
      5 ||
    record.nextCandidate.scenarioId !==
      "RECOVERY_EVIDENCE_REVIEW" ||
    record.anayaFirstTaskApproved !==
      approved ||
    record.atharvFirstTaskExecutionAuthorized !==
      approved ||
    record.atharvFirstTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Anaya first-task owner-review source or decision binding is invalid.",
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
      4 ||
    evidence.reviewedScenarioId !==
      "AUTHORITY_ESCALATION_THREAT_REVIEW" ||
    evidence.analysisOutcome !==
      "BOUNDED_AUTHORITY_ESCALATION_THREAT_REVIEW_RECOMMENDED" ||
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
      "Anaya owner-review evidence is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.canonicalAnayaExecutionBound !== true ||
    boundary.sourceExecutionIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.ownerReviewDecisionRecorded !== true ||
    boundary.anayaFirstTaskReviewed !== true ||
    boundary.atharvFirstTaskExecutionAuthorized !==
      approved ||
    boundary.atharvFirstTaskExecutionPerformed !==
      false ||
    boundary.onlyAtharvCurrentlyExecutable !==
      approved ||
    boundary.remainingThreeAuthorizedCandidatesWaiting !==
      true ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.anayaSecondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.anayaThirdSyntheticPilotTaskExecutionAuthorized !==
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
      "Anaya first-task owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_FIVE"
      : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ANAYA_REVIEW_REJECTION";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(
        canonicalSourceExecution.executedAt,
      )
  ) {
    throw new Error(
      "Anaya first-task owner-review sequencing is invalid.",
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
      "Anaya first-task owner-review digest is invalid.",
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
      "Anaya first-task owner-review decision must remain deeply immutable.",
    );
  }
}

export function createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision {
  validateCanonicalSources();

  if (
    input.sourceExecution !==
      canonicalSourceExecution
  ) {
    validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution(
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
      "Anaya first-task owner review requires the canonical source execution.",
    );
  }

  requireIdentifier(
    "Anaya first-task owner-review decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Anaya first-task owner-review owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Anaya first-task owner-review decision time",
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
      "Anaya first-task owner review is bound to the canonical owner.",
    );
  }

  if (
    !ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Anaya first-task owner-review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(
      canonicalSourceExecution.executedAt,
    )
  ) {
    throw new Error(
      "Anaya first-task owner review cannot precede task execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_DECISION_RECORDED" as const,

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
        "candidate-anaya-v1" as const,

      employeeCode:
        "nx-engineering-004" as const,

      publicName:
        "Anaya" as const,

      officialRole:
        "AI Security Engineering Director" as const,

      runtimeId:
        "runtime-engineering-nx-engineering-004-candidate-v1" as const,

      taskSequence:
        1 as const,

      executionSequence:
        4 as const,

      scenarioId:
        "AUTHORITY_ESCALATION_THREAT_REVIEW" as const,
    },

    nextCandidate: {
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

    decision:
      input.decision,

    anayaFirstTaskApproved:
      approved,

    atharvFirstTaskExecutionAuthorized:
      approved,

    atharvFirstTaskExecutionPerformed:
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
        4 as const,

      reviewedScenarioId:
        "AUTHORITY_ESCALATION_THREAT_REVIEW" as const,

      analysisOutcome:
        canonicalSourceExecution
          .authorityEscalationThreatReviewDraft
          .analysisOutcome,

      riskLevel:
        canonicalSourceExecution
          .authorityEscalationThreatReviewDraft
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
      canonicalAnayaExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerFirstTaskDecisionBound:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      anayaFirstTaskReviewed:
        true as const,

      atharvFirstTaskExecutionAuthorized:
        approved,

      atharvFirstTaskExecutionPerformed:
        false as const,

      onlyAtharvCurrentlyExecutable:
        approved,

      remainingThreeAuthorizedCandidatesWaiting:
        true as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      anayaSecondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      anayaThirdSyntheticPilotTaskExecutionAuthorized:
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
        ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_FIVE" as const
        : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AFTER_ANAYA_REVIEW_REJECTION" as const,

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      decisionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision;

  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision({
    decisionId:
      "engineering-anaya-first-synthetic-pilot-task-owner-review-decision-001",

    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",

    reason:
      "Prashant Srivastav reviewed Anaya's first bounded synthetic authority escalation threat review and approved only Atharv's already owner-authorized first synthetic reliability pilot task as the next sequential execution. Repository access, deployment, customer contact, external delivery, payments, autonomous action, and public launch remain blocked.",

    decidedAt:
      "2026-07-25T15:45:00.000Z",
  });
