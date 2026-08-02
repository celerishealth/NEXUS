import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-atharv-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_SCENARIO =
  "RELIABILITY_RECOVERY_VALIDATION_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic reliability and recovery evidence task without live-provider or production execution." as const;

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic recovery validation plan with monitoring, graceful degradation, rollback, and audit checkpoints." as const;

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
      "Unsupported deterministic Atharv second-task value.",
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

const CANONICAL_OWNER_REVIEW =
  ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

const CANONICAL_ATHARV_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Atharv",
    );

const CANONICAL_ATHARV_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Atharv",
    );

const CANONICAL_ATHARV_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Atharv",
    );

if (
  !CANONICAL_ATHARV_PLAN ||
  !CANONICAL_ATHARV_PREPARATION ||
  !CANONICAL_ATHARV_DECISION
) {
  throw new Error(
    "Canonical Atharv second-task sources are missing.",
  );
}

function getAtharvPlan():
  NonNullable<
    typeof CANONICAL_ATHARV_PLAN
  > {
  return CANONICAL_ATHARV_PLAN!;
}

function getAtharvPreparation():
  NonNullable<
    typeof CANONICAL_ATHARV_PREPARATION
  > {
  return CANONICAL_ATHARV_PREPARATION!;
}

function getAtharvDecision():
  NonNullable<
    typeof CANONICAL_ATHARV_DECISION
  > {
  return CANONICAL_ATHARV_DECISION!;
}

function validateCanonicalAtharvSources(): void {
  const plan =
    getAtharvPlan();

  const preparation =
    getAtharvPreparation();

  const decision =
    getAtharvDecision();

  if (
    plan.sequence !== 5 ||
    plan.employeeId !==
      "candidate-atharv-v1" ||
    plan.employeeCode !==
      "nx-engineering-005" ||
    plan.publicName !==
      "Atharv" ||
    plan.officialRole !==
      "AI Reliability Engineering Specialist" ||
    plan.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_SCENARIO ||
    plan.objective !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    plan.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
    plan.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    plan.outputMode !==
      "PLAN_ONLY" ||
    plan.evidenceToolMode !==
      "READ_ONLY" ||
    plan.maximumTaskCount !== 1 ||
    plan.concurrentTaskLimit !== 0 ||
    plan.secondTaskExecutionAuthorized !==
      false ||
    plan.secondTaskExecuted !==
      false ||
    plan.concurrentExecutionAuthorized !==
      false ||
    plan.liveProviderExecutionAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Atharv second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 5 ||
    preparation.employeeId !==
      plan.employeeId ||
    preparation.employeeCode !==
      plan.employeeCode ||
    preparation.runtimeId !==
      plan.runtimeId ||
    preparation.sourceCandidatePlanDigest !==
      plan.candidatePlanDigest ||
    preparation.scenarioId !==
      plan.scenarioId ||
    preparation.recommendedDecision !==
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    preparation.secondTaskExecutionAuthorized !==
      false ||
    preparation.secondTaskExecuted !==
      false ||
    preparation.concurrentExecutionAuthorized !==
      false ||
    preparation.liveProviderExecutionAuthorized !==
      false ||
    preparation.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Atharv second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 5 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_SCENARIO ||
    decision.decision !==
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    decision.secondTaskExecutionAuthorized !==
      true ||
    decision.secondTaskExecutionPerformed !==
      false ||
    decision.currentlyExecutable !==
      false ||
    decision.waitingForPriorCandidateOwnerReview !==
      true ||
    decision.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    decision.authorityBoundary
      .ownerReviewRequiredImmediatelyAfterExecution !==
      true ||
    decision.authorityBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    decision.authorityBoundary
      .productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Atharv second-task decision is invalid.",
    );
  }
}

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_RECOVERY_VALIDATION_PLAN =
  deepFreeze({
    planId:
      "engineering-atharv-second-synthetic-recovery-validation-plan-001",

    evidenceClass:
      "DETERMINISTIC_RELIABILITY_RECOVERY_VALIDATION_PLAN",

    reviewOutcome:
      "BOUNDED_RECOVERY_VALIDATION_RECOMMENDED",

    planningMode:
      "PLAN_ONLY_NO_LIVE_EXECUTION",

    liveProviderExecutionPerformed:
      false,

    productionExecutionPerformed:
      false,

    deploymentPerformed:
      false,

    monitoringCheckpoints: [
      {
        checkpointId:
          "SERVICE_HEALTH_VISIBILITY",

        objective:
          "Confirm synthetic service-health signals expose availability, latency, error, and dependency state.",

        expectedEvidence: [
          "Availability-state marker",
          "Latency-threshold marker",
          "Error-rate marker",
          "Dependency-health marker",
        ],

        failureCondition:
          "Stop when required health evidence is missing, stale, contradictory, or cross-tenant.",
      },
      {
        checkpointId:
          "DEGRADATION_DETECTION",

        objective:
          "Confirm deterministic detection of degraded operation before unsafe continuation.",

        expectedEvidence: [
          "Degradation-state classification",
          "Fail-closed transition marker",
          "Owner escalation marker",
        ],

        failureCondition:
          "Stop when degradation cannot be classified or safely contained.",
      },
      {
        checkpointId:
          "RECOVERY_PROGRESS_AUDIT",

        objective:
          "Confirm every synthetic recovery transition remains ordered, attributable, and auditable.",

        expectedEvidence: [
          "Recovery-step sequence",
          "Actor and owner identity binding",
          "Immutable transition digest",
        ],

        failureCondition:
          "Stop when a recovery transition is skipped, duplicated, unordered, or not attributable.",
      },
      {
        checkpointId:
          "POST_RECOVERY_REVALIDATION",

        objective:
          "Confirm canonical identity, safety boundaries, and expected state are revalidated before continuation.",

        expectedEvidence: [
          "Tenant revalidation",
          "Owner revalidation",
          "Authority-boundary revalidation",
          "Digest revalidation",
        ],

        failureCondition:
          "Stop when any canonical identity, boundary, or digest fails revalidation.",
      },
    ],

    gracefulDegradationPlan: [
      {
        degradationId:
          "DEPENDENCY_UNAVAILABLE",

        safeResponse:
          "Retain read-only synthetic planning, block consequential execution, and escalate dependency status.",

        prohibitedResponse:
          "Do not silently substitute an unverified provider or weaken authorization.",
      },
      {
        degradationId:
          "PARTIAL_EVIDENCE_AVAILABLE",

        safeResponse:
          "Mark evidence incomplete, stop progression, and require owner-visible remediation.",

        prohibitedResponse:
          "Do not infer missing evidence or claim recovery completion.",
      },
      {
        degradationId:
          "AUDIT_WRITE_UNAVAILABLE",

        safeResponse:
          "Fail closed before any continuation and retain the last verified immutable checkpoint.",

        prohibitedResponse:
          "Do not proceed without durable audit evidence.",
      },
      {
        degradationId:
          "OWNER_REVIEW_UNAVAILABLE",

        safeResponse:
          "Keep all later candidates waiting and preserve emergency pause.",

        prohibitedResponse:
          "Do not auto-approve or bypass owner review.",
      },
    ],

    rollbackPlan: [
      {
        rollbackId:
          "ROLLBACK_TO_LAST_VERIFIED_CHECKPOINT",

        trigger:
          "Any recovery-step integrity, authorization, or state-validation failure.",

        requiredEvidence:
          "Exact last verified state, digest, owner identity, tenant identity, and rollback reason.",
      },
      {
        rollbackId:
          "ROLLBACK_AFTER_DEGRADATION_FAILURE",

        trigger:
          "Graceful degradation cannot preserve safety or auditability.",

        requiredEvidence:
          "Degradation classification, failed control, containment result, and owner escalation.",
      },
      {
        rollbackId:
          "ROLLBACK_AFTER_AUDIT_DEFECT",

        trigger:
          "Audit evidence is missing, mutable, duplicated, or inconsistent.",

        requiredEvidence:
          "Defect record, affected checkpoint, immutable pre-defect digest, and recovery approval requirement.",
      },
      {
        rollbackId:
          "ROLLBACK_AFTER_AUTHORITY_DRIFT",

        trigger:
          "Any consequential authority becomes true, missing, or ambiguous.",

        requiredEvidence:
          "Authority-drift record and restoration of every blocked authority marker to false.",
      },
    ],

    auditCheckpoints: [
      "Canonical Anaya owner-review decision and digest",
      "Canonical Atharv plan, preparation, and candidate-decision digests",
      "Monitoring checkpoint results",
      "Graceful degradation classification and containment result",
      "Rollback trigger and required evidence",
      "Owner escalation and continuation decision",
    ],

    stopConditions: [
      "Stop on the first canonical identity, sequence, scenario, or digest mismatch.",
      "Stop if monitoring evidence is missing, stale, contradictory, or cross-tenant.",
      "Stop if graceful degradation cannot preserve fail-closed behavior and auditability.",
      "Stop if rollback evidence is incomplete or the last verified checkpoint cannot be identified.",
      "Stop if live-provider, production, deployment, payment, legal, customer, or public-launch activity is requested.",
      "Stop after this single synthetic task for mandatory owner review.",
    ],

    recoveryChecks: [
      {
        checkId:
          "RECOVERY_MONITORING_AVAILABLE",

        expectedState:
          "Synthetic monitoring checkpoints remain complete and owner-visible.",
      },
      {
        checkId:
          "RECOVERY_GRACEFUL_DEGRADATION_AVAILABLE",

        expectedState:
          "A safe fail-closed degradation response exists for each modeled dependency failure.",
      },
      {
        checkId:
          "RECOVERY_ROLLBACK_EVIDENCE_COMPLETE",

        expectedState:
          "Every rollback path identifies a trigger, last verified checkpoint, and required evidence.",
      },
      {
        checkId:
          "RECOVERY_AUDIT_CHAIN_INTACT",

        expectedState:
          "Every synthetic recovery transition remains ordered, immutable, attributable, and digest-bound.",
      },
      {
        checkId:
          "RECOVERY_OWNER_CONTINUATION_REQUIRED",

        expectedState:
          "Only a separate valid owner-review decision may authorize the next candidate.",
      },
    ],

    knownLimitations: [
      "No live provider was invoked.",
      "No production system or database was accessed.",
      "No deployment, failover, restore, or rollback was executed.",
      "Independent reliability validation remains pending.",
    ],
  } as const);

function validateRecoveryPlan(): void {
  const plan =
    ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_RECOVERY_VALIDATION_PLAN;

  if (
    plan.evidenceClass !==
      "DETERMINISTIC_RELIABILITY_RECOVERY_VALIDATION_PLAN" ||
    plan.reviewOutcome !==
      "BOUNDED_RECOVERY_VALIDATION_RECOMMENDED" ||
    plan.planningMode !==
      "PLAN_ONLY_NO_LIVE_EXECUTION" ||
    plan.liveProviderExecutionPerformed !==
      false ||
    plan.productionExecutionPerformed !==
      false ||
    plan.deploymentPerformed !==
      false ||
    plan.monitoringCheckpoints.length !==
      4 ||
    plan.gracefulDegradationPlan.length !==
      4 ||
    plan.rollbackPlan.length !==
      4 ||
    plan.auditCheckpoints.length !==
      6 ||
    plan.stopConditions.length !==
      6 ||
    plan.recoveryChecks.length !==
      5
  ) {
    throw new Error(
      "Atharv recovery-validation plan structure is invalid.",
    );
  }

  const monitoringIds =
    plan.monitoringCheckpoints.map(
      (entry) =>
        entry.checkpointId,
    );

  const degradationIds =
    plan.gracefulDegradationPlan.map(
      (entry) =>
        entry.degradationId,
    );

  const rollbackIds =
    plan.rollbackPlan.map(
      (entry) =>
        entry.rollbackId,
    );

  if (
    new Set(monitoringIds).size !==
      monitoringIds.length ||
    new Set(degradationIds).size !==
      degradationIds.length ||
    new Set(rollbackIds).size !==
      rollbackIds.length ||
    plan.monitoringCheckpoints.some(
      (entry) =>
        entry.expectedEvidence.length <
          3 ||
        entry.failureCondition.trim().length <
          30,
    ) ||
    plan.rollbackPlan.some(
      (entry) =>
        entry.trigger.trim().length <
          20 ||
        entry.requiredEvidence.trim().length <
          30,
    )
  ) {
    throw new Error(
      "Atharv recovery-validation evidence is incomplete.",
    );
  }
}

export interface CreateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly anayaOwnerReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

  readonly executedAt: string;
}

function buildAtharvExecution(
  executionId: string,
  executedAt: string,
) {
  const plan =
    getAtharvPlan();

  const preparation =
    getAtharvPreparation();

  const decision =
    getAtharvDecision();

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId,

    executionState:
      "ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      CANONICAL_OWNER_REVIEW.tenantId,

    ownerId:
      CANONICAL_OWNER_REVIEW.ownerId,

    employeeId:
      "candidate-atharv-v1" as const,

    employeeCode:
      "nx-engineering-005" as const,

    publicName:
      "Atharv" as const,

    officialRole:
      "AI Reliability Engineering Specialist" as const,

    runtimeId:
      decision.runtimeId,

    sourceAnayaOwnerReviewDecisionId:
      CANONICAL_OWNER_REVIEW.decisionId,

    sourceAnayaOwnerReviewDecisionDigest:
      CANONICAL_OWNER_REVIEW.decisionDigest,

    sourceAnayaExecutionId:
      CANONICAL_OWNER_REVIEW.sourceExecutionId,

    sourceAnayaExecutionDigest:
      CANONICAL_OWNER_REVIEW.sourceExecutionDigest,

    sourceCandidatePlanDigest:
      plan.candidatePlanDigest,

    sourceCandidateDecisionPreparationDigest:
      preparation
        .candidateDecisionPreparationDigest,

    candidateDecisionDigest:
      decision.candidateDecisionDigest,

    taskSequence:
      2 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

    taskContract: {
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

      maximumTaskCount:
        1 as const,

      executedTaskCount:
        1 as const,

      remainingTaskCapacity:
        0 as const,

      concurrentTaskLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_SYNTHETIC_TASK" as const,
    },

    recoveryValidationPlan:
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_RECOVERY_VALIDATION_PLAN,

    executionBoundary: {
      canonicalAnayaOwnerReviewBound:
        true as const,

      sourceOwnerReviewIntegrityVerified:
        true as const,

      sourceCandidatePlanBound:
        true as const,

      sourceCandidateDecisionPreparationBound:
        true as const,

      candidateDecisionBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      employeeIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      exactAtharvSecondTaskExecuted:
        true as const,

      secondSyntheticTaskExecutionPerformed:
        true as const,

      taskExecutorInvocationCount:
        1 as const,

      deterministicEvidenceCreated:
        true as const,

      independentValidationRequired:
        true as const,

      independentValidationCompleted:
        false as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      ownerReviewRequiredImmediately:
        true as const,

      nextCandidateExecutionAuthorized:
        false as const,

      remainingThreeAuthorizedCandidatesWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      monitoringPlanCreated:
        true as const,

      gracefulDegradationPlanCreated:
        true as const,

      rollbackPlanCreated:
        true as const,

      auditCheckpointsCreated:
        true as const,

      liveProviderExecutionPerformed:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAccessPerformed:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationPerformed:
        false as const,

      productionMutationAuthorized:
        false as const,

      productionDeploymentPrepared:
        false as const,

      productionDeploymentExecuted:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      testsExecuted:
        false as const,

      codeChanged:
        false as const,

      repositoryReadPerformed:
        false as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWritePerformed:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      secretsAccessPerformed:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataUsed:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactPerformed:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryPrepared:
        false as const,

      externalDeliveryExecuted:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      paymentExecutionPerformed:
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
      "AWAIT_OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,

    executionDigest:
      sha256(executionCore),
  });
}

export type EngineeringAIWorkforceAtharvSecondSyntheticTaskExecution =
  ReturnType<
    typeof buildAtharvExecution
  >;

export function validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceAtharvSecondSyntheticTaskExecution,
): void {
  const {
    executionDigest,
    ...executionCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      executionDigest,
    ) ||
    executionDigest !==
      sha256(executionCore)
  ) {
    throw new Error(
      "Atharv second-task execution integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_OWNER_REVIEW,
  );

  validateCanonicalAtharvSources();
  validateRecoveryPlan();

  const plan =
    getAtharvPlan();

  const preparation =
    getAtharvPreparation();

  const decision =
    getAtharvDecision();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !==
      CANONICAL_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_OWNER_REVIEW.ownerId ||
    record.employeeId !==
      "candidate-atharv-v1" ||
    record.employeeCode !==
      "nx-engineering-005" ||
    record.publicName !==
      "Atharv" ||
    record.officialRole !==
      "AI Reliability Engineering Specialist" ||
    record.runtimeId !==
      decision.runtimeId ||
    record.sourceAnayaOwnerReviewDecisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    record.sourceAnayaOwnerReviewDecisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest ||
    record.sourceAnayaExecutionId !==
      CANONICAL_OWNER_REVIEW.sourceExecutionId ||
    record.sourceAnayaExecutionDigest !==
      CANONICAL_OWNER_REVIEW.sourceExecutionDigest ||
    record.sourceCandidatePlanDigest !==
      plan.candidatePlanDigest ||
    record.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    record.candidateDecisionDigest !==
      decision.candidateDecisionDigest ||
    record.taskSequence !== 2 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE
  ) {
    throw new Error(
      "Atharv second-task canonical binding is invalid.",
    );
  }

  const task =
    record.taskContract;

  if (
    task.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    task.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_EXECUTION_EVIDENCE" ||
    task.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    task.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    task.executionMode !==
      "SANDBOX_ONLY" ||
    task.evidenceToolMode !==
      "READ_ONLY" ||
    task.outputMode !==
      "DRAFT_ONLY" ||
    task.maximumTaskCount !== 1 ||
    task.executedTaskCount !== 1 ||
    task.remainingTaskCapacity !==
      0 ||
    task.concurrentTaskLimit !== 1 ||
    task.failureThreshold !== 1 ||
    task.ownerReviewFrequency !==
      "AFTER_EVERY_SYNTHETIC_TASK"
  ) {
    throw new Error(
      "Atharv second-task contract is invalid.",
    );
  }

  if (
    record.recoveryValidationPlan !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_RECOVERY_VALIDATION_PLAN
  ) {
    throw new Error(
      "Atharv recovery-validation evidence binding is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  const requiredTrue = [
    boundary.canonicalAnayaOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceCandidatePlanBound,
    boundary.sourceCandidateDecisionPreparationBound,
    boundary.candidateDecisionBound,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.employeeIdentityBound,
    boundary.runtimeIdentityBound,
    boundary.exactAtharvSecondTaskExecuted,
    boundary.secondSyntheticTaskExecutionPerformed,
    boundary.deterministicEvidenceCreated,
    boundary.independentValidationRequired,
    boundary.ownerReviewRequired,
    boundary.ownerReviewRequiredImmediately,
    boundary.remainingThreeAuthorizedCandidatesWaiting,
    boundary.monitoringPlanCreated,
    boundary.gracefulDegradationPlanCreated,
    boundary.rollbackPlanCreated,
    boundary.auditCheckpointsCreated,
    boundary.monitoringRequired,
    boundary.emergencyPauseAvailable,
    boundary.rollbackEvidenceRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.approvalBypassAllowed,
    boundary.independentValidationCompleted,
    boundary.ownerDecisionMade,
    boundary.nextCandidateExecutionAuthorized,
    boundary.concurrentCandidateExecutionAuthorized,
    boundary.thirdSyntheticTaskExecutionAuthorized,
    boundary.liveProviderExecutionPerformed,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAccessPerformed,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationPerformed,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentPrepared,
    boundary.productionDeploymentExecuted,
    boundary.productionDeploymentAuthorized,
    boundary.testsExecuted,
    boundary.codeChanged,
    boundary.repositoryReadPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWritePerformed,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessPerformed,
    boundary.secretsAccessAuthorized,
    boundary.realCustomerDataUsed,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactPerformed,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryPrepared,
    boundary.externalDeliveryExecuted,
    boundary.externalDeliveryAuthorized,
    boundary.paymentExecutionPerformed,
    boundary.paymentExecutionAuthorized,
    boundary.financialCommitmentAuthorized,
    boundary.legalCommitmentAuthorized,
    boundary.autonomousDecisionAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    boundary.taskExecutorInvocationCount !==
      1
  ) {
    throw new Error(
      "Atharv second-task authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ATHARV_SECOND_SYNTHETIC_TASK_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Atharv second-task transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.recoveryValidationPlan,
    ) ||
    !Object.isFrozen(
      record.recoveryValidationPlan
        .monitoringCheckpoints,
    ) ||
    !Object.isFrozen(
      record.recoveryValidationPlan
        .gracefulDegradationPlan,
    ) ||
    !Object.isFrozen(
      record.recoveryValidationPlan
        .rollbackPlan,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Atharv second-task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceAtharvSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceAtharvSecondSyntheticTaskExecution {
  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskOwnerReviewDecision(
    input.anayaOwnerReviewDecision,
  );

  if (
    input.anayaOwnerReviewDecision.decisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    input.anayaOwnerReviewDecision.decisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Anaya second-task owner review can authorize Atharv.",
    );
  }

  if (
    CANONICAL_OWNER_REVIEW.decision !==
      "APPROVE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    CANONICAL_OWNER_REVIEW.atharvSecondTaskExecutionAuthorized !==
      true ||
    CANONICAL_OWNER_REVIEW.atharvSecondTaskExecutionPerformed !==
      false ||
    CANONICAL_OWNER_REVIEW.nextCandidate.employeeId !==
      "candidate-atharv-v1" ||
    CANONICAL_OWNER_REVIEW.nextCandidate.taskSequence !==
      2 ||
    CANONICAL_OWNER_REVIEW.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_SCENARIO ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .onlyAtharvCurrentlyExecutable !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .remainingThreeAuthorizedCandidatesWaiting !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    CANONICAL_OWNER_REVIEW.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FIVE"
  ) {
    throw new Error(
      "Atharv second synthetic task is not owner-authorized.",
    );
  }

  const executionId =
    requireSafeIdentifier(
      "Atharv second-task execution identity",
      input.executionId,
    );

  const executedAt =
    requireIsoTimestamp(
      "Atharv second-task execution time",
      input.executedAt,
    );

  if (
    Date.parse(executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Atharv second-task execution cannot precede Anaya owner review.",
    );
  }

  validateCanonicalAtharvSources();
  validateRecoveryPlan();

  const record =
    buildAtharvExecution(
      executionId,
      executedAt,
    );

  validateEngineeringAIWorkforceAtharvSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ATHARV_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceAtharvSecondSyntheticTask({
    executionId:
      "engineering-atharv-second-synthetic-task-execution-001",

    anayaOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-08-02T09:35:00.000Z",
  });