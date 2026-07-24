import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,
  type EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution,
  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution,
} from "./engineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION =
  "nexus-engineering-ai-workforce-ishaan-first-synthetic-pilot-task-owner-review-decision-v1";

export const ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS = [
  "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",
  "REJECT_AND_RETAIN_ISHAAN_FIRST_TASK_ONLY",
] as const;

export type EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecisionType =
  (typeof ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISIONS)[number];

export interface CreateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecisionInput {
  readonly sourceExecution:
    EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_RECORDED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly sourceExecutionId:
    string;

  readonly sourceExecutionDigest:
    string;

  readonly ownerFirstTaskExecutionDecisionId:
    string;

  readonly ownerFirstTaskExecutionDecisionDigest:
    string;

  readonly sourcePreparationId:
    string;

  readonly sourcePreparationDigest:
    string;

  readonly sourceCandidateDecisionDigest:
    string;

  readonly reviewedEmployee: {
    readonly employeeId:
      "candidate-ishaan-v1";

    readonly employeeCode:
      "nx-engineering-001";

    readonly publicName:
      "Ishaan";

    readonly officialRole:
      "AI Principal Software Architect";

    readonly runtimeId:
      string;
  };

  readonly nextCandidate: {
    readonly employeeId:
      "candidate-leela-v1";

    readonly employeeCode:
      "nx-engineering-002";

    readonly publicName:
      "Leela";

    readonly officialRole:
      "AI Software Engineering Director";

    readonly runtimeId:
      string;

    readonly taskSequence:
      1;

    readonly scenarioId:
      "EVIDENCE_GATED_DELIVERY_PLAN";
  };

  readonly decision:
    EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecisionType;

  readonly ishaanFirstTaskApproved:
    boolean;

  readonly leelaFirstTaskExecutionAuthorized:
    boolean;

  readonly leelaFirstTaskExecutionPerformed:
    false;

  readonly reason:
    string;

  readonly reviewedEvidence: {
    readonly pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    readonly dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    readonly actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    readonly executionMode:
      "SANDBOX_ONLY";

    readonly evidenceToolMode:
      "READ_ONLY";

    readonly draftToolMode:
      "DRAFT_ONLY";

    readonly reviewedTaskSequence:
      1;

    readonly reviewedScenarioId:
      "BOUNDED_MODULAR_ARCHITECTURE_REVIEW";

    readonly maximumTaskCount:
      3;

    readonly executedTaskCount:
      1;

    readonly remainingTaskCapacity:
      2;

    readonly ownerReviewFrequency:
      "AFTER_EVERY_PILOT_TASK";

    readonly pilotDraftCreated:
      true;

    readonly pilotCompleted:
      false;
  };

  readonly authorityBoundary: {
    readonly canonicalIshaanExecutionBound:
      true;

    readonly sourceExecutionIntegrityVerified:
      true;

    readonly canonicalOwnerExecutionDecisionBound:
      true;

    readonly ownerIdentityBound:
      true;

    readonly tenantIdentityBound:
      true;

    readonly approvalBypassAllowed:
      false;

    readonly ishaanFirstTaskReviewed:
      true;

    readonly ownerReviewDecisionRecorded:
      true;

    readonly leelaFirstTaskExecutionAuthorized:
      boolean;

    readonly leelaFirstTaskExecutionPerformed:
      false;

    readonly onlyLeelaCurrentlyExecutable:
      boolean;

    readonly remainingSixAuthorizedCandidatesWaiting:
      boolean;

    readonly concurrentCandidateExecutionAuthorized:
      false;

    readonly sequentialExecutionRequired:
      true;

    readonly stopAfterEveryTaskForOwnerReview:
      true;

    readonly stopOnFirstFailure:
      true;

    readonly ishaanSecondSyntheticPilotTaskExecutionAuthorized:
      false;

    readonly ishaanThirdSyntheticPilotTaskExecutionAuthorized:
      false;

    readonly repositoryReadAuthorized:
      false;

    readonly repositoryWriteAuthorized:
      false;

    readonly branchCreationAuthorized:
      false;

    readonly pullRequestPreparationAuthorized:
      false;

    readonly mergeAuthorized:
      false;

    readonly secretsAccessAuthorized:
      false;

    readonly realCustomerDataAccessAuthorized:
      false;

    readonly realCustomerContactAuthorized:
      false;

    readonly externalDeliveryAuthorized:
      false;

    readonly liveProviderExecutionAuthorized:
      false;

    readonly productionDatabaseAuthorized:
      false;

    readonly productionMutationAuthorized:
      false;

    readonly productionDeploymentAuthorized:
      false;

    readonly paymentExecutionAuthorized:
      false;

    readonly financialCommitmentAuthorized:
      false;

    readonly legalCommitmentAuthorized:
      false;

    readonly autonomousDecisionAuthorized:
      false;

    readonly productionReadinessAuthorized:
      false;

    readonly publicLaunchAuthorized:
      false;

    readonly monitoringRequired:
      true;

    readonly emergencyPauseAvailable:
      true;
  };

  readonly nextStep:
    | "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_TWO"
    | "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ISHAAN_FIRST_TASK_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          stableStringify(item),
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
            JSON.stringify(key) +
            ":" +
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic owner-review value.",
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
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (
    const nestedValue of
    Object.values(
      value as Record<string, unknown>,
    )
  ) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
}

function requireSafeIdentifier(
  label: string,
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length < 3 ||
    normalized.length > 160 ||
    !/^[a-z0-9][a-z0-9._:-]*$/u.test(
      normalized,
    ) ||
    /(secret|token|password|credential|private[-_]?key|access[-_]?key)/iu.test(
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
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(parsed) ||
    new Date(parsed).toISOString() !==
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
      "Ishaan owner-review reason must contain 20 to 1200 characters.",
    );
  }

  if (
    /(secret|access[_ -]?token|password|private[_ -]?key|api[_ -]?key|credential)\b/iu.test(
      normalized,
    )
  ) {
    throw new Error(
      "Ishaan owner-review reason contains prohibited secret-bearing content.",
    );
  }

  return normalized;
}

const CANONICAL_ISHAAN_EXECUTION =
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION;

const CANONICAL_OWNER_FIRST_TASK_EXECUTION_DECISION =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const CANONICAL_LEELA_FIRST_TASK_CANDIDATE =
  CANONICAL_OWNER_FIRST_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName === "Leela",
    );

if (
  !CANONICAL_LEELA_FIRST_TASK_CANDIDATE ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.employeeId !==
    "candidate-leela-v1" ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.employeeCode !==
    "nx-engineering-002" ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.officialRole !==
    "AI Software Engineering Director" ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.taskSequence !==
    1 ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.scenarioId !==
    "EVIDENCE_GATED_DELIVERY_PLAN" ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.decision !==
    "APPROVE_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.firstTaskExecutionAuthorized !==
    true ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.firstTaskExecutionPerformed !==
    false ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.currentlyExecutable !==
    false ||
  CANONICAL_LEELA_FIRST_TASK_CANDIDATE.waitingForPriorCandidateOwnerReview !==
    true
) {
  throw new Error(
    "Canonical Leela first-task candidate decision is invalid.",
  );
}

function getLeelaCandidate():
  NonNullable<
    typeof CANONICAL_LEELA_FIRST_TASK_CANDIDATE
  > {
  return CANONICAL_LEELA_FIRST_TASK_CANDIDATE!;
}

export function validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
  record:
    EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision,
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
      "Ishaan first synthetic pilot task owner-review decision integrity verification failed.",
    );
  }

  const source =
    CANONICAL_ISHAAN_EXECUTION;

  const leela =
    getLeelaCandidate();

  const approved =
    record.decision ===
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_RECORDED" ||
    record.tenantId !==
      source.tenantId ||
    record.ownerId !==
      source.ownerId ||
    record.sourceExecutionId !==
      source.executionId ||
    record.sourceExecutionDigest !==
      source.executionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      source.ownerFirstTaskExecutionDecisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      source.ownerFirstTaskExecutionDecisionDigest ||
    record.sourcePreparationId !==
      source.sourcePreparationId ||
    record.sourcePreparationDigest !==
      source.sourcePreparationDigest ||
    record.sourceCandidateDecisionDigest !==
      source.candidateDecisionDigest
  ) {
    throw new Error(
      "Ishaan owner-review canonical source binding is invalid.",
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
      source.runtimeId
  ) {
    throw new Error(
      "Ishaan owner-review employee identity is invalid.",
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
      1 ||
    record.nextCandidate.scenarioId !==
      "EVIDENCE_GATED_DELIVERY_PLAN"
  ) {
    throw new Error(
      "Ishaan owner-review next-candidate binding is invalid.",
    );
  }

  if (
    record.decision !==
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" &&
    record.decision !==
      "REJECT_AND_RETAIN_ISHAAN_FIRST_TASK_ONLY"
  ) {
    throw new Error(
      "Ishaan owner-review decision is invalid.",
    );
  }

  if (
    record.ishaanFirstTaskApproved !==
      approved ||
    record.leelaFirstTaskExecutionAuthorized !==
      approved ||
    record.leelaFirstTaskExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Ishaan owner-review continuation state is invalid.",
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
    evidence.reviewedScenarioId !==
      "BOUNDED_MODULAR_ARCHITECTURE_REVIEW" ||
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
      "Ishaan owner-review evidence is invalid.",
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
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.ishaanFirstTaskReviewed !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.leelaFirstTaskExecutionAuthorized !==
      approved ||
    boundary.leelaFirstTaskExecutionPerformed !==
      false ||
    boundary.onlyLeelaCurrentlyExecutable !==
      approved ||
    boundary.remainingSixAuthorizedCandidatesWaiting !==
      approved ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.sequentialExecutionRequired !==
      true ||
    boundary.stopAfterEveryTaskForOwnerReview !==
      true ||
    boundary.stopOnFirstFailure !==
      true ||
    boundary.ishaanSecondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.ishaanThirdSyntheticPilotTaskExecutionAuthorized !==
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
      "Ishaan owner-review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_TWO"
      : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ISHAAN_FIRST_TASK_ONLY";

  if (
    record.nextStep !==
      expectedNextStep ||
    Date.parse(record.decidedAt) <
      Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Ishaan owner-review transition is invalid.",
    );
  }
}

export function createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
  input:
    CreateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecisionInput,
): EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision {
  const canonicalSource =
    CANONICAL_ISHAAN_EXECUTION;

  if (
    input.sourceExecution !==
      canonicalSource
  ) {
    validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution(
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
      "Only the canonical Ishaan first synthetic pilot task execution can be reviewed.",
    );
  }

  const decisionId =
    requireSafeIdentifier(
      "Ishaan owner-review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Ishaan owner-review owner identity",
      input.ownerId,
    );

  if (
    ownerId !==
      input.sourceExecution.ownerId
  ) {
    throw new Error(
      "Only the execution-bound owner can review Ishaan's first synthetic pilot task.",
    );
  }

  const decidedAt =
    requireIsoTimestamp(
      "Ishaan owner-review decision time",
      input.decidedAt,
    );

  if (
    Date.parse(decidedAt) <
      Date.parse(
        input.sourceExecution.executedAt,
      )
  ) {
    throw new Error(
      "Ishaan owner-review decision cannot precede task execution.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" &&
    input.decision !==
      "REJECT_AND_RETAIN_ISHAAN_FIRST_TASK_ONLY"
  ) {
    throw new Error(
      "Ishaan owner-review decision is invalid.",
    );
  }

  const reason =
    requireReason(input.reason);

  const approved =
    input.decision ===
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION";

  const source =
    input.sourceExecution;

  const leela =
    getLeelaCandidate();

  const decisionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW_RECORDED" as const,

    tenantId:
      source.tenantId,

    ownerId,

    sourceExecutionId:
      source.executionId,

    sourceExecutionDigest:
      source.executionDigest,

    ownerFirstTaskExecutionDecisionId:
      source.ownerFirstTaskExecutionDecisionId,

    ownerFirstTaskExecutionDecisionDigest:
      source.ownerFirstTaskExecutionDecisionDigest,

    sourcePreparationId:
      source.sourcePreparationId,

    sourcePreparationDigest:
      source.sourcePreparationDigest,

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
        1 as const,

      scenarioId:
        "EVIDENCE_GATED_DELIVERY_PLAN" as const,
    },

    decision:
      input.decision,

    ishaanFirstTaskApproved:
      approved,

    leelaFirstTaskExecutionAuthorized:
      approved,

    leelaFirstTaskExecutionPerformed:
      false as const,

    reason,

    reviewedEvidence: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      evidenceToolMode:
        "READ_ONLY" as const,

      draftToolMode:
        "DRAFT_ONLY" as const,

      reviewedTaskSequence:
        1 as const,

      reviewedScenarioId:
        "BOUNDED_MODULAR_ARCHITECTURE_REVIEW" as const,

      maximumTaskCount:
        source.pilotTask.maximumTaskCount,

      executedTaskCount:
        source.pilotTask.executedTaskCount,

      remainingTaskCapacity:
        source.pilotTask.remainingTaskCapacity,

      ownerReviewFrequency:
        source.pilotTask.ownerReviewFrequency,

      pilotDraftCreated:
        true as const,

      pilotCompleted:
        false as const,
    },

    authorityBoundary: {
      canonicalIshaanExecutionBound:
        true as const,

      sourceExecutionIntegrityVerified:
        true as const,

      canonicalOwnerExecutionDecisionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      ishaanFirstTaskReviewed:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      leelaFirstTaskExecutionAuthorized:
        approved,

      leelaFirstTaskExecutionPerformed:
        false as const,

      onlyLeelaCurrentlyExecutable:
        approved,

      remainingSixAuthorizedCandidatesWaiting:
        approved,

      concurrentCandidateExecutionAuthorized:
        false as const,

      sequentialExecutionRequired:
        true as const,

      stopAfterEveryTaskForOwnerReview:
        true as const,

      stopOnFirstFailure:
        true as const,

      ishaanSecondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      ishaanThirdSyntheticPilotTaskExecutionAuthorized:
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

    nextStep:
      approved
        ? "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_TWO" as const
        : "RETAIN_ENGINEERING_LIMITED_INTERNAL_PILOT_AT_ISHAAN_FIRST_TASK_ONLY" as const,

    decidedAt,
  };

  const record = {
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  } as EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision;

  const frozen =
    deepFreeze(record);

  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
    frozen,
  );

  return frozen;
}

export const ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION =
  createEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision({
    sourceExecution:
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION,

    decisionId:
      "engineering-ishaan-first-synthetic-pilot-task-owner-review-decision-001",

    ownerId:
      "owner-prashant-001",

    decision:
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION",

    reason:
      "Prashant Srivastav reviewed Ishaan's first bounded synthetic architecture pilot result and approved only Leela's already owner-authorized first synthetic pilot task execution as the next sequential step. Repository access, production deployment, customer contact, external delivery, payments, autonomous action, and public launch remain blocked.",

    decidedAt:
      "2026-07-24T02:08:30.124Z",
  });
