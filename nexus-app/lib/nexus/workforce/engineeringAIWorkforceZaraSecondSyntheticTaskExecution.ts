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
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-zara-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_SCENARIO =
  "DATA_PIPELINE_QUALITY_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic data-pipeline quality evidence task without customer data or database mutation." as const;

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic data-quality plan with schema checks, tenant boundaries, lineage, reconciliation, and recovery evidence." as const;

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
      "Unsupported deterministic Zara second-task value.",
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
  ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

const CANONICAL_ZARA_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Zara",
    );

const CANONICAL_ZARA_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Zara",
    );

const CANONICAL_ZARA_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Zara",
    );

if (
  !CANONICAL_ZARA_PLAN ||
  !CANONICAL_ZARA_PREPARATION ||
  !CANONICAL_ZARA_DECISION
) {
  throw new Error(
    "Canonical Zara second-task sources are missing.",
  );
}

function getZaraPlan():
  NonNullable<
    typeof CANONICAL_ZARA_PLAN
  > {
  return CANONICAL_ZARA_PLAN!;
}

function getZaraPreparation():
  NonNullable<
    typeof CANONICAL_ZARA_PREPARATION
  > {
  return CANONICAL_ZARA_PREPARATION!;
}

function getZaraDecision():
  NonNullable<
    typeof CANONICAL_ZARA_DECISION
  > {
  return CANONICAL_ZARA_DECISION!;
}

function validateCanonicalZaraSources(): void {
  const plan =
    getZaraPlan();

  const preparation =
    getZaraPreparation();

  const decision =
    getZaraDecision();

  if (
    plan.sequence !== 7 ||
    plan.employeeId !==
      "candidate-zara-v1" ||
    plan.employeeCode !==
      "nx-engineering-007" ||
    plan.publicName !==
      "Zara" ||
    plan.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    plan.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    plan.objective !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    plan.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
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
    plan.repositoryReadAuthorized !==
      false ||
    plan.repositoryWriteAuthorized !==
      false ||
    plan.realCustomerDataAccessAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Zara second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 7 ||
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
    preparation.realCustomerDataAccessAuthorized !==
      false ||
    preparation.productionDatabaseAuthorized !==
      false ||
    preparation.productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Zara second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 7 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Zara" ||
    decision.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_SCENARIO ||
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
      .realCustomerDataAccessAuthorized !==
      false ||
    decision.authorityBoundary
      .productionDatabaseAuthorized !==
      false ||
    decision.authorityBoundary
      .productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Zara second-task decision is invalid.",
    );
  }
}

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_DATA_QUALITY_PLAN =
  deepFreeze({
    planId:
      "engineering-zara-second-synthetic-data-quality-plan-001",

    evidenceClass:
      "DETERMINISTIC_DATA_PIPELINE_QUALITY_PLAN",

    reviewOutcome:
      "BOUNDED_DATA_QUALITY_VALIDATION_RECOMMENDED",

    planningMode:
      "PLAN_ONLY_NO_DATABASE_ACCESS_OR_MUTATION",

    realCustomerDataUsed:
      false,

    databaseAccessPerformed:
      false,

    databaseMutationPerformed:
      false,

    schemaChecks: [
      {
        checkId:
          "REQUIRED_FIELD_CONTRACT",

        objective:
          "Confirm every synthetic record contains the required canonical fields before pipeline acceptance.",

        failureResponse:
          "Reject the record and stop progression when a required field is absent, malformed, or ambiguous.",
      },
      {
        checkId:
          "DATA_TYPE_CONTRACT",

        objective:
          "Confirm each synthetic field matches its declared deterministic data type.",

        failureResponse:
          "Reject type coercion that could hide invalid, truncated, or cross-domain data.",
      },
      {
        checkId:
          "ENUM_AND_STATE_CONTRACT",

        objective:
          "Confirm status, authority, and lifecycle fields use only canonical allowed values.",

        failureResponse:
          "Fail closed when an unknown, deprecated, or unauthorized state appears.",
      },
      {
        checkId:
          "IDENTIFIER_FORMAT_CONTRACT",

        objective:
          "Confirm tenant, owner, employee, runtime, task, and evidence identifiers remain canonical.",

        failureResponse:
          "Stop when an identifier is missing, credential-bearing, duplicated, or non-canonical.",
      },
      {
        checkId:
          "DIGEST_FORMAT_CONTRACT",

        objective:
          "Confirm every required deterministic digest is present and formatted as canonical SHA-256 evidence.",

        failureResponse:
          "Stop when a digest is absent, malformed, mutable, or inconsistent with its source evidence.",
      },
    ],

    tenantBoundaryChecks: [
      {
        checkId:
          "TENANT_IDENTITY_BINDING",

        expectedState:
          "Every synthetic record is bound to exactly one canonical tenant identity.",
      },
      {
        checkId:
          "OWNER_TENANT_ASSOCIATION",

        expectedState:
          "The canonical owner identity remains associated with the same tenant throughout the pipeline.",
      },
      {
        checkId:
          "NO_CROSS_TENANT_JOIN",

        expectedState:
          "No synthetic reconciliation or lineage step combines evidence from different tenants.",
      },
      {
        checkId:
          "NO_AMBIGUOUS_TENANT_FALLBACK",

        expectedState:
          "Missing or invalid tenant identity fails closed without defaulting to another tenant.",
      },
      {
        checkId:
          "TENANT_BOUNDARY_REVALIDATION",

        expectedState:
          "Tenant identity and isolation markers are revalidated before any later continuation.",
      },
    ],

    lineageCheckpoints: [
      {
        checkpointId:
          "SOURCE_PLAN_LINEAGE",

        requiredEvidence:
          "Canonical Zara candidate-plan identity and digest.",
      },
      {
        checkpointId:
          "DECISION_PREPARATION_LINEAGE",

        requiredEvidence:
          "Canonical Zara decision-preparation identity and digest.",
      },
      {
        checkpointId:
          "OWNER_DECISION_LINEAGE",

        requiredEvidence:
          "Canonical Zara candidate-decision identity and digest.",
      },
      {
        checkpointId:
          "PRIOR_OWNER_REVIEW_LINEAGE",

        requiredEvidence:
          "Canonical Mahir owner-review identity and digest.",
      },
      {
        checkpointId:
          "EXECUTION_EVIDENCE_LINEAGE",

        requiredEvidence:
          "Exact Zara execution identity, deterministic output digest, and task sequence.",
      },
    ],

    reconciliationChecks: [
      {
        checkId:
          "RECORD_COUNT_RECONCILIATION",

        expectedState:
          "Input, accepted, rejected, and output synthetic record counts reconcile exactly.",
      },
      {
        checkId:
          "IDENTITY_RECONCILIATION",

        expectedState:
          "Tenant, owner, employee, runtime, scenario, and sequence identities match across all evidence.",
      },
      {
        checkId:
          "DIGEST_RECONCILIATION",

        expectedState:
          "Every source digest matches the canonical source used by the execution artifact.",
      },
      {
        checkId:
          "AUTHORITY_RECONCILIATION",

        expectedState:
          "Every prohibited customer, database, repository, provider, deployment, payment, and public authority remains false.",
      },
    ],

    recoveryChecks: [
      {
        checkId:
          "RECOVER_FROM_SCHEMA_REJECTION",

        expectedState:
          "Retain the last valid synthetic record and require corrected evidence before reprocessing.",
      },
      {
        checkId:
          "RECOVER_FROM_LINEAGE_BREAK",

        expectedState:
          "Stop at the last verified lineage checkpoint and require canonical digest restoration.",
      },
      {
        checkId:
          "RECOVER_FROM_RECONCILIATION_MISMATCH",

        expectedState:
          "Block continuation until counts, identities, digests, and authority markers reconcile.",
      },
      {
        checkId:
          "RECOVER_WITH_OWNER_REVIEW",

        expectedState:
          "Require a separate owner-review decision before authorizing the next candidate.",
      },
    ],

    stopConditions: [
      "Stop on the first canonical identity, sequence, scenario, or digest mismatch.",
      "Stop when schema evidence is missing, malformed, contradictory, mutable, or ambiguous.",
      "Stop when tenant isolation or owner-tenant association cannot be verified.",
      "Stop when lineage, reconciliation, or recovery evidence is incomplete.",
      "Stop if customer data, database access, database mutation, repository access, deployment, payment, or external delivery is requested.",
      "Stop after this single synthetic task for mandatory owner review.",
    ],

    knownLimitations: [
      "No real customer data was used.",
      "No database, repository, provider, or production environment was accessed.",
      "No pipeline write, migration, mutation, deployment, or external delivery was executed.",
      "Independent data-quality validation remains pending.",
    ],
  } as const);

function validateDataQualityPlan(): void {
  const plan =
    ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_DATA_QUALITY_PLAN;

  if (
    plan.evidenceClass !==
      "DETERMINISTIC_DATA_PIPELINE_QUALITY_PLAN" ||
    plan.reviewOutcome !==
      "BOUNDED_DATA_QUALITY_VALIDATION_RECOMMENDED" ||
    plan.planningMode !==
      "PLAN_ONLY_NO_DATABASE_ACCESS_OR_MUTATION" ||
    plan.realCustomerDataUsed !==
      false ||
    plan.databaseAccessPerformed !==
      false ||
    plan.databaseMutationPerformed !==
      false ||
    plan.schemaChecks.length !== 5 ||
    plan.tenantBoundaryChecks.length !==
      5 ||
    plan.lineageCheckpoints.length !==
      5 ||
    plan.reconciliationChecks.length !==
      4 ||
    plan.recoveryChecks.length !==
      4 ||
    plan.stopConditions.length !==
      6
  ) {
    throw new Error(
      "Zara data-quality plan structure is invalid.",
    );
  }

  const schemaIds =
    plan.schemaChecks.map(
      (entry) =>
        entry.checkId,
    );

  const tenantIds =
    plan.tenantBoundaryChecks.map(
      (entry) =>
        entry.checkId,
    );

  const lineageIds =
    plan.lineageCheckpoints.map(
      (entry) =>
        entry.checkpointId,
    );

  if (
    new Set(schemaIds).size !==
      schemaIds.length ||
    new Set(tenantIds).size !==
      tenantIds.length ||
    new Set(lineageIds).size !==
      lineageIds.length ||
    plan.schemaChecks.some(
      (entry) =>
        entry.objective.trim().length <
          30 ||
        entry.failureResponse.trim().length <
          30,
    ) ||
    plan.lineageCheckpoints.some(
      (entry) =>
        entry.requiredEvidence.trim().length <
          25,
    )
  ) {
    throw new Error(
      "Zara data-quality evidence is incomplete.",
    );
  }
}

export interface CreateEngineeringAIWorkforceZaraSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly mahirOwnerReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

  readonly executedAt: string;
}

function buildZaraExecution(
  executionId: string,
  executedAt: string,
) {
  const plan =
    getZaraPlan();

  const preparation =
    getZaraPreparation();

  const decision =
    getZaraDecision();

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId,

    executionState:
      "ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      CANONICAL_OWNER_REVIEW.tenantId,

    ownerId:
      CANONICAL_OWNER_REVIEW.ownerId,

    employeeId:
      "candidate-zara-v1" as const,

    employeeCode:
      "nx-engineering-007" as const,

    publicName:
      "Zara" as const,

    officialRole:
      "AI Data Engineering & Analytics Specialist" as const,

    runtimeId:
      decision.runtimeId,

    sourceMahirOwnerReviewDecisionId:
      CANONICAL_OWNER_REVIEW.decisionId,

    sourceMahirOwnerReviewDecisionDigest:
      CANONICAL_OWNER_REVIEW.decisionDigest,

    sourceMahirExecutionId:
      CANONICAL_OWNER_REVIEW.sourceExecutionId,

    sourceMahirExecutionDigest:
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
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

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

    dataQualityPlan:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_DATA_QUALITY_PLAN,

    executionBoundary: {
      canonicalMahirOwnerReviewBound:
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

      exactZaraSecondTaskExecuted:
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

      remainingOneAuthorizedCandidateWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      schemaChecksCreated:
        true as const,

      tenantBoundaryChecksCreated:
        true as const,

      lineageCheckpointsCreated:
        true as const,

      reconciliationChecksCreated:
        true as const,

      recoveryChecksCreated:
        true as const,

      realCustomerDataUsed:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      databaseAccessPerformed:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      databaseMutationPerformed:
        false as const,

      productionMutationAuthorized:
        false as const,

      liveProviderExecutionPerformed:
        false as const,

      liveProviderExecutionAuthorized:
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
      "AWAIT_OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,

    executionDigest:
      sha256(executionCore),
  });
}

export type EngineeringAIWorkforceZaraSecondSyntheticTaskExecution =
  ReturnType<
    typeof buildZaraExecution
  >;

export function validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceZaraSecondSyntheticTaskExecution,
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
      "Zara second-task execution integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_OWNER_REVIEW,
  );

  validateCanonicalZaraSources();
  validateDataQualityPlan();

  const plan =
    getZaraPlan();

  const preparation =
    getZaraPreparation();

  const decision =
    getZaraDecision();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !==
      CANONICAL_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_OWNER_REVIEW.ownerId ||
    record.employeeId !==
      "candidate-zara-v1" ||
    record.employeeCode !==
      "nx-engineering-007" ||
    record.publicName !==
      "Zara" ||
    record.officialRole !==
      "AI Data Engineering & Analytics Specialist" ||
    record.runtimeId !==
      decision.runtimeId ||
    record.sourceMahirOwnerReviewDecisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    record.sourceMahirOwnerReviewDecisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest ||
    record.sourceMahirExecutionId !==
      CANONICAL_OWNER_REVIEW.sourceExecutionId ||
    record.sourceMahirExecutionDigest !==
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
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE
  ) {
    throw new Error(
      "Zara second-task canonical binding is invalid.",
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
      "Zara second-task contract is invalid.",
    );
  }

  if (
    record.dataQualityPlan !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_DATA_QUALITY_PLAN
  ) {
    throw new Error(
      "Zara data-quality evidence binding is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  const requiredTrue = [
    boundary.canonicalMahirOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceCandidatePlanBound,
    boundary.sourceCandidateDecisionPreparationBound,
    boundary.candidateDecisionBound,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.employeeIdentityBound,
    boundary.runtimeIdentityBound,
    boundary.exactZaraSecondTaskExecuted,
    boundary.secondSyntheticTaskExecutionPerformed,
    boundary.deterministicEvidenceCreated,
    boundary.independentValidationRequired,
    boundary.ownerReviewRequired,
    boundary.ownerReviewRequiredImmediately,
    boundary.remainingOneAuthorizedCandidateWaiting,
    boundary.schemaChecksCreated,
    boundary.tenantBoundaryChecksCreated,
    boundary.lineageCheckpointsCreated,
    boundary.reconciliationChecksCreated,
    boundary.recoveryChecksCreated,
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
    boundary.realCustomerDataUsed,
    boundary.realCustomerDataAccessAuthorized,
    boundary.databaseAccessPerformed,
    boundary.productionDatabaseAuthorized,
    boundary.databaseMutationPerformed,
    boundary.productionMutationAuthorized,
    boundary.liveProviderExecutionPerformed,
    boundary.liveProviderExecutionAuthorized,
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
      "Zara second-task authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ZARA_SECOND_SYNTHETIC_TASK_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Zara second-task transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.dataQualityPlan,
    ) ||
    !Object.isFrozen(
      record.dataQualityPlan
        .schemaChecks,
    ) ||
    !Object.isFrozen(
      record.dataQualityPlan
        .tenantBoundaryChecks,
    ) ||
    !Object.isFrozen(
      record.dataQualityPlan
        .lineageCheckpoints,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Zara second-task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceZaraSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceZaraSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceZaraSecondSyntheticTaskExecution {
  validateEngineeringAIWorkforceMahirSecondSyntheticTaskOwnerReviewDecision(
    input.mahirOwnerReviewDecision,
  );

  if (
    input.mahirOwnerReviewDecision.decisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    input.mahirOwnerReviewDecision.decisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Mahir second-task owner review can authorize Zara.",
    );
  }

  if (
    CANONICAL_OWNER_REVIEW.decision !==
      "APPROVE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    CANONICAL_OWNER_REVIEW.zaraSecondTaskExecutionAuthorized !==
      true ||
    CANONICAL_OWNER_REVIEW.zaraSecondTaskExecutionPerformed !==
      false ||
    CANONICAL_OWNER_REVIEW.nextCandidate.employeeId !==
      "candidate-zara-v1" ||
    CANONICAL_OWNER_REVIEW.nextCandidate.taskSequence !==
      2 ||
    CANONICAL_OWNER_REVIEW.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .onlyZaraCurrentlyExecutable !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .remainingOneAuthorizedCandidateWaiting !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    CANONICAL_OWNER_REVIEW.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_SEVEN"
  ) {
    throw new Error(
      "Zara second synthetic task is not owner-authorized.",
    );
  }

  const executionId =
    requireSafeIdentifier(
      "Zara second-task execution identity",
      input.executionId,
    );

  const executedAt =
    requireIsoTimestamp(
      "Zara second-task execution time",
      input.executedAt,
    );

  if (
    Date.parse(executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Zara second-task execution cannot precede Mahir owner review.",
    );
  }

  validateCanonicalZaraSources();
  validateDataQualityPlan();

  const record =
    buildZaraExecution(
      executionId,
      executedAt,
    );

  validateEngineeringAIWorkforceZaraSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceZaraSecondSyntheticTask({
    executionId:
      "engineering-zara-second-synthetic-task-execution-001",

    mahirOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_MAHIR_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-08-02T10:35:00.000Z",
  });