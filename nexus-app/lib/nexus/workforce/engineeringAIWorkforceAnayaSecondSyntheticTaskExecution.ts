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
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-anaya-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_SCENARIO =
  "SECURITY_BOUNDARY_REVIEW_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic security-boundary review evidence task without secrets, repository, or production access." as const;

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic threat and control review plan covering tenant isolation, fail-closed behavior, and owner escalation." as const;

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
      "Unsupported deterministic Anaya second-task value.",
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
  ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

const CANONICAL_ANAYA_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Anaya",
    );

const CANONICAL_ANAYA_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Anaya",
    );

const CANONICAL_ANAYA_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Anaya",
    );

if (
  !CANONICAL_ANAYA_PLAN ||
  !CANONICAL_ANAYA_PREPARATION ||
  !CANONICAL_ANAYA_DECISION
) {
  throw new Error(
    "Canonical Anaya second-task sources are missing.",
  );
}

function getAnayaPlan():
  NonNullable<
    typeof CANONICAL_ANAYA_PLAN
  > {
  return CANONICAL_ANAYA_PLAN!;
}

function getAnayaPreparation():
  NonNullable<
    typeof CANONICAL_ANAYA_PREPARATION
  > {
  return CANONICAL_ANAYA_PREPARATION!;
}

function getAnayaDecision():
  NonNullable<
    typeof CANONICAL_ANAYA_DECISION
  > {
  return CANONICAL_ANAYA_DECISION!;
}

function validateCanonicalAnayaSources(): void {
  const plan =
    getAnayaPlan();

  const preparation =
    getAnayaPreparation();

  const decision =
    getAnayaDecision();

  if (
    plan.sequence !== 4 ||
    plan.employeeId !==
      "candidate-anaya-v1" ||
    plan.employeeCode !==
      "nx-engineering-004" ||
    plan.publicName !==
      "Anaya" ||
    plan.officialRole !==
      "AI Security Engineering Director" ||
    plan.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    plan.objective !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    plan.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
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
    plan.secretsAccessAuthorized !==
      false ||
    plan.repositoryReadAuthorized !==
      false ||
    plan.repositoryWriteAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Anaya second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 4 ||
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
    preparation.secretsAccessAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Anaya second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 4 ||
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
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_SCENARIO ||
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
      .secretsAccessAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Anaya second-task decision is invalid.",
    );
  }
}

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_SECURITY_REVIEW_PLAN =
  deepFreeze({
    planId:
      "engineering-anaya-second-synthetic-security-boundary-plan-001",

    evidenceClass:
      "DETERMINISTIC_SECURITY_BOUNDARY_REVIEW_PLAN",

    reviewOutcome:
      "BOUNDED_FAIL_CLOSED_SECURITY_REVIEW_RECOMMENDED",

    planningMode:
      "PLAN_ONLY_NO_PROTECTED_ACCESS",

    secretsAccessPerformed:
      false,

    repositoryAccessPerformed:
      false,

    productionAccessPerformed:
      false,

    threatModel: [
      {
        threatId:
          "CROSS_TENANT_DATA_EXPOSURE",

        riskLevel:
          "CRITICAL",

        protectedBoundary:
          "Tenant identity, tenant-owned data, and tenant-scoped execution context",

        preventiveControls: [
          "Canonical tenant identity binding",
          "Deny-by-default cross-tenant access",
          "Tenant-scoped authorization validation",
          "Immutable tenant audit evidence",
        ],

        detectionEvidence: [
          "Tenant identity digest",
          "Cross-tenant denial marker",
          "Owner-visible audit event",
        ],

        failClosedCondition:
          "Reject the task immediately when tenant identity is missing, mismatched, stale, or ambiguous.",

        ownerEscalationCondition:
          "Escalate any suspected cross-tenant exposure to the owner and retain all later candidates in waiting state.",
      },
      {
        threatId:
          "OWNER_AUTHORITY_BYPASS",

        riskLevel:
          "CRITICAL",

        protectedBoundary:
          "Owner approval, final authority, and sequential candidate execution",

        preventiveControls: [
          "Canonical owner identity binding",
          "Approval-bypass prohibition",
          "One-candidate concurrency limit",
          "Owner review after every synthetic task",
        ],

        detectionEvidence: [
          "Owner decision digest",
          "Only-Anaya executable marker",
          "Concurrent execution denial marker",
        ],

        failClosedCondition:
          "Stop when owner approval is absent, invalid, tampered, or does not authorize exactly Anaya.",

        ownerEscalationCondition:
          "Escalate any attempted approval bypass or concurrent execution directly to the owner.",
      },
      {
        threatId:
          "SECRET_OR_PROTECTED_MATERIAL_ACCESS",

        riskLevel:
          "CRITICAL",

        protectedBoundary:
          "Secrets, credentials, tokens, protected configuration, and private customer material",

        preventiveControls: [
          "Synthetic sanitized data only",
          "Secrets access prohibited",
          "Repository access prohibited",
          "Credential-bearing identifiers rejected",
        ],

        detectionEvidence: [
          "Secrets-access false marker",
          "Protected-material-use false marker",
          "Safe-identifier validation result",
        ],

        failClosedCondition:
          "Reject any task input containing or requesting secret, token, password, session, credential, or private-key material.",

        ownerEscalationCondition:
          "Escalate any protected-material request without exposing or recording the protected value.",
      },
      {
        threatId:
          "PRODUCTION_OR_EXTERNAL_EXECUTION",

        riskLevel:
          "CRITICAL",

        protectedBoundary:
          "Production systems, providers, customers, payments, legal commitments, and public launch",

        preventiveControls: [
          "Sandbox-only planning",
          "No provider execution",
          "No production database access",
          "No external delivery or customer contact",
        ],

        detectionEvidence: [
          "Production authority false markers",
          "External-delivery false markers",
          "Payment and legal authority false markers",
        ],

        failClosedCondition:
          "Stop when any production, provider, customer, payment, legal, or launch action is requested.",

        ownerEscalationCondition:
          "Escalate the blocked request with its category and preserve all consequential authority as false.",
      },
      {
        threatId:
          "EVIDENCE_TAMPERING_OR_NONDETERMINISM",

        riskLevel:
          "HIGH",

        protectedBoundary:
          "Canonical source digests, immutable evidence, and reproducible security conclusions",

        preventiveControls: [
          "SHA-256 execution digest",
          "Stable deterministic serialization",
          "Deep immutability",
          "Canonical source-digest validation",
        ],

        detectionEvidence: [
          "Execution digest verification",
          "Source-plan digest verification",
          "Source-decision digest verification",
        ],

        failClosedCondition:
          "Reject evidence when any digest fails, the result is mutable, or identical input produces a different result.",

        ownerEscalationCondition:
          "Escalate evidence-integrity failure and require canonical revalidation before continuation.",
      },
    ],

    controlReview: [
      {
        controlId:
          "TENANT_ISOLATION_CONTROL",

        controlObjective:
          "Prevent cross-tenant access and preserve exact tenant ownership.",

        expectedState:
          "Tenant identity is canonically bound and cross-tenant access is denied by default.",
      },
      {
        controlId:
          "FAIL_CLOSED_CONTROL",

        controlObjective:
          "Stop safely on missing, invalid, ambiguous, or tampered evidence.",

        expectedState:
          "No continuation, fallback authority, or partial execution is permitted after the first failure.",
      },
      {
        controlId:
          "OWNER_ESCALATION_CONTROL",

        controlObjective:
          "Preserve owner final authority for every consequential decision.",

        expectedState:
          "Execution stops after this task and awaits a separate owner review.",
      },
      {
        controlId:
          "PROTECTED_ACCESS_CONTROL",

        controlObjective:
          "Prevent secrets, repository, production, customer, and provider access.",

        expectedState:
          "Every protected-access and consequential-authority marker remains false.",
      },
      {
        controlId:
          "RECOVERY_AND_AUDIT_CONTROL",

        controlObjective:
          "Preserve emergency pause, rollback evidence, canonical recovery, and auditability.",

        expectedState:
          "Pause and rollback evidence remain mandatory before any authorized continuation.",
      },
    ],

    failClosedRules: [
      "Reject missing or mismatched tenant, owner, candidate, runtime, sequence, scenario, or digest evidence.",
      "Reject any request for secrets, credentials, tokens, private keys, protected configuration, or private customer material.",
      "Reject repository read, repository write, branch, pull-request, merge, provider, production, payment, legal, or public-launch actions.",
      "Reject concurrent execution and any attempt to authorize more than one candidate.",
      "Stop on the first security-control failure without fallback execution.",
      "Stop after this single synthetic task for mandatory owner review.",
    ],

    ownerEscalationRules: [
      "Escalate suspected tenant-isolation failure immediately.",
      "Escalate owner-approval bypass or concurrent-execution attempts immediately.",
      "Escalate protected-material requests without exposing protected values.",
      "Escalate production, external-delivery, payment, legal, or launch requests as blocked authority requests.",
      "Escalate evidence-integrity failure and require canonical revalidation.",
    ],

    recoveryChecks: [
      {
        checkId:
          "SECURITY_RECOVERY_EMERGENCY_PAUSE",

        expectedState:
          "Emergency pause remains available and active on the first security failure.",
      },
      {
        checkId:
          "SECURITY_RECOVERY_ROLLBACK_EVIDENCE",

        expectedState:
          "Rollback evidence remains mandatory before any continuation.",
      },
      {
        checkId:
          "SECURITY_RECOVERY_CANONICAL_REVALIDATION",

        expectedState:
          "Tenant, owner, candidate, runtime, sequence, scenario, and source digests are revalidated.",
      },
      {
        checkId:
          "SECURITY_RECOVERY_OWNER_DECISION",

        expectedState:
          "Only a separate valid owner-review decision may authorize the next candidate.",
      },
    ],

    knownLimitations: [
      "No secrets or protected material were accessed.",
      "No repository or production system was accessed.",
      "No real penetration test or vulnerability scan was executed.",
      "Independent security validation remains pending.",
    ],
  } as const);

function validateSecurityReviewPlan(): void {
  const plan =
    ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_SECURITY_REVIEW_PLAN;

  if (
    plan.evidenceClass !==
      "DETERMINISTIC_SECURITY_BOUNDARY_REVIEW_PLAN" ||
    plan.reviewOutcome !==
      "BOUNDED_FAIL_CLOSED_SECURITY_REVIEW_RECOMMENDED" ||
    plan.planningMode !==
      "PLAN_ONLY_NO_PROTECTED_ACCESS" ||
    plan.secretsAccessPerformed !==
      false ||
    plan.repositoryAccessPerformed !==
      false ||
    plan.productionAccessPerformed !==
      false ||
    plan.threatModel.length !==
      5 ||
    plan.controlReview.length !==
      5 ||
    plan.failClosedRules.length !==
      6 ||
    plan.ownerEscalationRules.length !==
      5 ||
    plan.recoveryChecks.length !==
      4
  ) {
    throw new Error(
      "Anaya security-boundary review structure is invalid.",
    );
  }

  const threatIds =
    plan.threatModel.map(
      (entry) =>
        entry.threatId,
    );

  const controlIds =
    plan.controlReview.map(
      (entry) =>
        entry.controlId,
    );

  if (
    new Set(threatIds).size !==
      threatIds.length ||
    new Set(controlIds).size !==
      controlIds.length ||
    plan.threatModel.some(
      (entry) =>
        entry.preventiveControls.length <
          3 ||
        entry.detectionEvidence.length <
          2 ||
        entry.failClosedCondition.trim().length <
          30 ||
        entry.ownerEscalationCondition.trim().length <
          30,
    )
  ) {
    throw new Error(
      "Anaya security-boundary review evidence is incomplete.",
    );
  }
}

export interface CreateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly vivaanOwnerReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

  readonly executedAt: string;
}

function buildAnayaExecution(
  executionId: string,
  executedAt: string,
) {
  const plan =
    getAnayaPlan();

  const preparation =
    getAnayaPreparation();

  const decision =
    getAnayaDecision();

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId,

    executionState:
      "ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      CANONICAL_OWNER_REVIEW.tenantId,

    ownerId:
      CANONICAL_OWNER_REVIEW.ownerId,

    employeeId:
      "candidate-anaya-v1" as const,

    employeeCode:
      "nx-engineering-004" as const,

    publicName:
      "Anaya" as const,

    officialRole:
      "AI Security Engineering Director" as const,

    runtimeId:
      decision.runtimeId,

    sourceVivaanOwnerReviewDecisionId:
      CANONICAL_OWNER_REVIEW.decisionId,

    sourceVivaanOwnerReviewDecisionDigest:
      CANONICAL_OWNER_REVIEW.decisionDigest,

    sourceVivaanExecutionId:
      CANONICAL_OWNER_REVIEW.sourceExecutionId,

    sourceVivaanExecutionDigest:
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
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

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

    securityReviewPlan:
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_SECURITY_REVIEW_PLAN,

    executionBoundary: {
      canonicalVivaanOwnerReviewBound:
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

      exactAnayaSecondTaskExecuted:
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

      remainingFourAuthorizedCandidatesWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      protectedMaterialUsed:
        false as const,

      secretsAccessPerformed:
        false as const,

      secretsAccessAuthorized:
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
      "AWAIT_OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,

    executionDigest:
      sha256(executionCore),
  });
}

export type EngineeringAIWorkforceAnayaSecondSyntheticTaskExecution =
  ReturnType<
    typeof buildAnayaExecution
  >;

export function validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceAnayaSecondSyntheticTaskExecution,
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
      "Anaya second-task execution integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_OWNER_REVIEW,
  );

  validateCanonicalAnayaSources();
  validateSecurityReviewPlan();

  const plan =
    getAnayaPlan();

  const preparation =
    getAnayaPreparation();

  const decision =
    getAnayaDecision();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !==
      CANONICAL_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_OWNER_REVIEW.ownerId ||
    record.employeeId !==
      "candidate-anaya-v1" ||
    record.employeeCode !==
      "nx-engineering-004" ||
    record.publicName !==
      "Anaya" ||
    record.officialRole !==
      "AI Security Engineering Director" ||
    record.runtimeId !==
      decision.runtimeId ||
    record.sourceVivaanOwnerReviewDecisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    record.sourceVivaanOwnerReviewDecisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest ||
    record.sourceVivaanExecutionId !==
      CANONICAL_OWNER_REVIEW.sourceExecutionId ||
    record.sourceVivaanExecutionDigest !==
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
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE
  ) {
    throw new Error(
      "Anaya second-task canonical binding is invalid.",
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
      "Anaya second-task contract is invalid.",
    );
  }

  if (
    record.securityReviewPlan !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_SECURITY_REVIEW_PLAN
  ) {
    throw new Error(
      "Anaya security-review evidence binding is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  const requiredTrue = [
    boundary.canonicalVivaanOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceCandidatePlanBound,
    boundary.sourceCandidateDecisionPreparationBound,
    boundary.candidateDecisionBound,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.employeeIdentityBound,
    boundary.runtimeIdentityBound,
    boundary.exactAnayaSecondTaskExecuted,
    boundary.secondSyntheticTaskExecutionPerformed,
    boundary.deterministicEvidenceCreated,
    boundary.independentValidationRequired,
    boundary.ownerReviewRequired,
    boundary.ownerReviewRequiredImmediately,
    boundary.remainingFourAuthorizedCandidatesWaiting,
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
    boundary.protectedMaterialUsed,
    boundary.secretsAccessPerformed,
    boundary.secretsAccessAuthorized,
    boundary.testsExecuted,
    boundary.codeChanged,
    boundary.repositoryReadPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWritePerformed,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.realCustomerDataUsed,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactPerformed,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryPrepared,
    boundary.externalDeliveryExecuted,
    boundary.externalDeliveryAuthorized,
    boundary.liveProviderExecutionPerformed,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAccessPerformed,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationPerformed,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentPrepared,
    boundary.productionDeploymentExecuted,
    boundary.productionDeploymentAuthorized,
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
      "Anaya second-task authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ANAYA_SECOND_SYNTHETIC_TASK_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Anaya second-task transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.securityReviewPlan,
    ) ||
    !Object.isFrozen(
      record.securityReviewPlan
        .threatModel,
    ) ||
    !Object.isFrozen(
      record.securityReviewPlan
        .controlReview,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Anaya second-task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceAnayaSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceAnayaSecondSyntheticTaskExecution {
  validateEngineeringAIWorkforceVivaanSecondSyntheticTaskOwnerReviewDecision(
    input.vivaanOwnerReviewDecision,
  );

  if (
    input.vivaanOwnerReviewDecision.decisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    input.vivaanOwnerReviewDecision.decisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Vivaan second-task owner review can authorize Anaya.",
    );
  }

  if (
    CANONICAL_OWNER_REVIEW.decision !==
      "APPROVE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    CANONICAL_OWNER_REVIEW.anayaSecondTaskExecutionAuthorized !==
      true ||
    CANONICAL_OWNER_REVIEW.anayaSecondTaskExecutionPerformed !==
      false ||
    CANONICAL_OWNER_REVIEW.nextCandidate.employeeId !==
      "candidate-anaya-v1" ||
    CANONICAL_OWNER_REVIEW.nextCandidate.taskSequence !==
      2 ||
    CANONICAL_OWNER_REVIEW.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .onlyAnayaCurrentlyExecutable !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .remainingFourAuthorizedCandidatesWaiting !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    CANONICAL_OWNER_REVIEW.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_FOUR"
  ) {
    throw new Error(
      "Anaya second synthetic task is not owner-authorized.",
    );
  }

  const executionId =
    requireSafeIdentifier(
      "Anaya second-task execution identity",
      input.executionId,
    );

  const executedAt =
    requireIsoTimestamp(
      "Anaya second-task execution time",
      input.executedAt,
    );

  if (
    Date.parse(executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Anaya second-task execution cannot precede Vivaan owner review.",
    );
  }

  validateCanonicalAnayaSources();
  validateSecurityReviewPlan();

  const record =
    buildAnayaExecution(
      executionId,
      executedAt,
    );

  validateEngineeringAIWorkforceAnayaSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ANAYA_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceAnayaSecondSyntheticTask({
    executionId:
      "engineering-anaya-second-synthetic-task-execution-001",

    vivaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-08-02T09:05:00.000Z",
  });