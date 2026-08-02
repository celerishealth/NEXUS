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
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-advik-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_SCENARIO =
  "SYSTEMS_EVALUATION_RED_TEAM_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic systems-evaluation and red-team evidence task without adversarial execution." as const;

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic evaluation plan covering evidence substitution, authority bypass, isolation, recovery, and owner control." as const;

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
      "Unsupported deterministic Advik second-task value.",
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
  ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

const CANONICAL_ADVIK_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName ===
          "Advik",
    );

const CANONICAL_ADVIK_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName ===
          "Advik",
    );

const CANONICAL_ADVIK_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName ===
          "Advik",
    );

if (
  !CANONICAL_ADVIK_PLAN ||
  !CANONICAL_ADVIK_PREPARATION ||
  !CANONICAL_ADVIK_DECISION
) {
  throw new Error(
    "Canonical Advik second-task sources are missing.",
  );
}

function getAdvikPlan():
  NonNullable<
    typeof CANONICAL_ADVIK_PLAN
  > {
  return CANONICAL_ADVIK_PLAN!;
}

function getAdvikPreparation():
  NonNullable<
    typeof CANONICAL_ADVIK_PREPARATION
  > {
  return CANONICAL_ADVIK_PREPARATION!;
}

function getAdvikDecision():
  NonNullable<
    typeof CANONICAL_ADVIK_DECISION
  > {
  return CANONICAL_ADVIK_DECISION!;
}

function validateCanonicalAdvikSources(): void {
  const plan =
    getAdvikPlan();

  const preparation =
    getAdvikPreparation();

  const decision =
    getAdvikDecision();

  if (
    plan.sequence !== 8 ||
    plan.employeeId !==
      "candidate-advik-v1" ||
    plan.employeeCode !==
      "nx-engineering-008" ||
    plan.publicName !==
      "Advik" ||
    plan.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    plan.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_SCENARIO ||
    plan.objective !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    plan.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
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
    plan.secretsAccessAuthorized !==
      false ||
    plan.realCustomerDataAccessAuthorized !==
      false ||
    plan.liveProviderExecutionAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false ||
    plan.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Advik second-task plan is invalid.",
    );
  }

  if (
    preparation.sequence !== 8 ||
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
    preparation.repositoryReadAuthorized !==
      false ||
    preparation.repositoryWriteAuthorized !==
      false ||
    preparation.secretsAccessAuthorized !==
      false ||
    preparation.liveProviderExecutionAuthorized !==
      false ||
    preparation.productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Advik second-task preparation is invalid.",
    );
  }

  if (
    decision.sequence !== 8 ||
    decision.employeeId !==
      plan.employeeId ||
    decision.employeeCode !==
      plan.employeeCode ||
    decision.publicName !==
      "Advik" ||
    decision.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    decision.runtimeId !==
      plan.runtimeId ||
    decision.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    decision.taskSequence !== 2 ||
    decision.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_SCENARIO ||
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
      .repositoryReadAuthorized !==
      false ||
    decision.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    decision.authorityBoundary
      .autonomousDecisionAuthorized !==
      false ||
    decision.authorityBoundary
      .productionMutationAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical Advik second-task decision is invalid.",
    );
  }
}

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_SYSTEMS_EVALUATION_PLAN =
  deepFreeze({
    planId:
      "engineering-advik-second-synthetic-systems-evaluation-plan-001",

    evidenceClass:
      "DETERMINISTIC_SYSTEMS_EVALUATION_RED_TEAM_PLAN",

    reviewOutcome:
      "BOUNDED_SYSTEMS_EVALUATION_RECOMMENDED",

    evaluationMode:
      "PLAN_ONLY_NO_ADVERSARIAL_EXECUTION",

    adversarialExecutionPerformed:
      false,

    authorityBypassPerformed:
      false,

    evidenceSubstitutionPerformed:
      false,

    evidenceSubstitutionChecks: [
      {
        checkId:
          "SOURCE_DIGEST_SUBSTITUTION",

        objective:
          "Detect replacement of a canonical source digest with unrelated or fabricated evidence.",

        expectedControl:
          "Fail closed unless every supplied digest matches its exact canonical source artifact.",
      },
      {
        checkId:
          "EMPLOYEE_IDENTITY_SUBSTITUTION",

        objective:
          "Detect replacement of Advik identity, employee code, role, runtime, or sequence.",

        expectedControl:
          "Reject any identity that does not match the owner-approved final candidate contract.",
      },
      {
        checkId:
          "SCENARIO_SUBSTITUTION",

        objective:
          "Detect replacement of the approved systems-evaluation scenario with another task.",

        expectedControl:
          "Allow only the exact second synthetic systems-evaluation scenario and objective.",
      },
      {
        checkId:
          "OWNER_REVIEW_SUBSTITUTION",

        objective:
          "Detect use of a different owner-review decision to authorize Advik execution.",

        expectedControl:
          "Require the canonical Zara owner-review decision identity and deterministic digest.",
      },
      {
        checkId:
          "OUTPUT_EVIDENCE_SUBSTITUTION",

        objective:
          "Detect mutable, incomplete, or non-deterministic evaluation output.",

        expectedControl:
          "Require deterministic deeply immutable evidence with a valid SHA-256 execution digest.",
      },
    ],

    authorityBypassChecks: [
      {
        checkId:
          "APPROVAL_BYPASS",

        expectedState:
          "Execution is blocked unless the exact canonical owner approval authorizes only Advik.",
      },
      {
        checkId:
          "CONCURRENCY_BYPASS",

        expectedState:
          "No concurrent candidate, parallel execution, or hidden continuation is allowed.",
      },
      {
        checkId:
          "THIRD_TASK_BYPASS",

        expectedState:
          "No third synthetic task or expanded authority is created by this execution.",
      },
      {
        checkId:
          "PRODUCTION_AUTHORITY_BYPASS",

        expectedState:
          "No provider, database, deployment, payment, customer, or public-launch authority is granted.",
      },
      {
        checkId:
          "OWNER_CONTROL_BYPASS",

        expectedState:
          "Owner final authority, emergency pause, rollback, and mandatory review remain preserved.",
      },
    ],

    isolationChecks: [
      {
        checkId:
          "TENANT_ISOLATION",

        expectedState:
          "Execution evidence remains bound to one canonical internal tenant.",
      },
      {
        checkId:
          "OWNER_TENANT_BINDING",

        expectedState:
          "The canonical owner remains bound to the same tenant throughout the evidence chain.",
      },
      {
        checkId:
          "RUNTIME_ISOLATION",

        expectedState:
          "Only Advik's approved runtime identity is referenced by the synthetic plan.",
      },
      {
        checkId:
          "DATA_ISOLATION",

        expectedState:
          "Only synthetic sanitized evidence is used and no real customer data is accessed.",
      },
      {
        checkId:
          "ENVIRONMENT_ISOLATION",

        expectedState:
          "No repository, secret, provider, database, production, or deployment environment is accessed.",
      },
    ],

    recoveryChecks: [
      {
        checkId:
          "RECOVER_FROM_DIGEST_MISMATCH",

        expectedState:
          "Stop at the last verified source and require canonical evidence restoration.",
      },
      {
        checkId:
          "RECOVER_FROM_AUTHORITY_MISMATCH",

        expectedState:
          "Reject continuation and retain owner control when any authority marker becomes unsafe.",
      },
      {
        checkId:
          "RECOVER_FROM_ISOLATION_FAILURE",

        expectedState:
          "Emergency-pause the sequence and require tenant, owner, runtime, and data isolation revalidation.",
      },
      {
        checkId:
          "RECOVER_WITH_FINAL_OWNER_REVIEW",

        expectedState:
          "Require a separate final Advik owner-review record before sequence closure evidence.",
      },
    ],

    ownerControlChecks: [
      {
        checkId:
          "OWNER_APPROVAL_BINDING",

        expectedState:
          "Canonical owner approval is verified before execution.",
      },
      {
        checkId:
          "OWNER_REVIEW_AFTER_EXECUTION",

        expectedState:
          "The sequence stops immediately for owner review after this final candidate task.",
      },
      {
        checkId:
          "OWNER_EMERGENCY_PAUSE",

        expectedState:
          "Owner emergency pause remains available without weakening fail-closed behavior.",
      },
      {
        checkId:
          "OWNER_ROLLBACK_REQUIREMENT",

        expectedState:
          "Rollback evidence remains required before any future authority increase.",
      },
      {
        checkId:
          "OWNER_RESERVED_AUTHORITY",

        expectedState:
          "Production, customer, payment, legal, launch, and Founder Liberation decisions remain owner-reserved.",
      },
    ],

    stopConditions: [
      "Stop on the first source identity, digest, scenario, sequence, tenant, owner, employee, or runtime mismatch.",
      "Stop if evidence substitution, authority bypass, concurrency bypass, or hidden continuation is detected.",
      "Stop if tenant, owner, runtime, data, or environment isolation cannot be verified.",
      "Stop if adversarial execution, repository access, secrets access, customer data, provider activity, or production activity is requested.",
      "Stop if owner approval, emergency pause, rollback, or final-review authority is weakened.",
      "Stop after this final candidate second synthetic task for mandatory owner review and sequence-closure evidence.",
    ],

    knownLimitations: [
      "No adversarial attack, exploit, penetration test, or live red-team action was executed.",
      "No repository, secret, provider, customer, database, production, or deployment environment was accessed.",
      "The artifact is deterministic planning evidence rather than proof of live operational resilience.",
      "Independent validation and final owner sequence-closure review remain pending.",
    ],
  } as const);

function validateSystemsEvaluationPlan(): void {
  const plan =
    ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_SYSTEMS_EVALUATION_PLAN;

  if (
    plan.evidenceClass !==
      "DETERMINISTIC_SYSTEMS_EVALUATION_RED_TEAM_PLAN" ||
    plan.reviewOutcome !==
      "BOUNDED_SYSTEMS_EVALUATION_RECOMMENDED" ||
    plan.evaluationMode !==
      "PLAN_ONLY_NO_ADVERSARIAL_EXECUTION" ||
    plan.adversarialExecutionPerformed !==
      false ||
    plan.authorityBypassPerformed !==
      false ||
    plan.evidenceSubstitutionPerformed !==
      false ||
    plan.evidenceSubstitutionChecks.length !==
      5 ||
    plan.authorityBypassChecks.length !==
      5 ||
    plan.isolationChecks.length !==
      5 ||
    plan.recoveryChecks.length !==
      4 ||
    plan.ownerControlChecks.length !==
      5 ||
    plan.stopConditions.length !==
      6 ||
    plan.knownLimitations.length !==
      4
  ) {
    throw new Error(
      "Advik systems-evaluation plan structure is invalid.",
    );
  }

  const checkIds = [
    ...plan.evidenceSubstitutionChecks.map(
      (entry) =>
        entry.checkId,
    ),
    ...plan.authorityBypassChecks.map(
      (entry) =>
        entry.checkId,
    ),
    ...plan.isolationChecks.map(
      (entry) =>
        entry.checkId,
    ),
    ...plan.recoveryChecks.map(
      (entry) =>
        entry.checkId,
    ),
    ...plan.ownerControlChecks.map(
      (entry) =>
        entry.checkId,
    ),
  ];

  if (
    new Set(checkIds).size !==
      checkIds.length ||
    plan.evidenceSubstitutionChecks.some(
      (entry) =>
        entry.objective.trim().length <
          30 ||
        entry.expectedControl.trim().length <
          30,
    ) ||
    plan.authorityBypassChecks.some(
      (entry) =>
        entry.expectedState.trim().length <
          30,
    ) ||
    plan.isolationChecks.some(
      (entry) =>
        entry.expectedState.trim().length <
          30,
    ) ||
    plan.recoveryChecks.some(
      (entry) =>
        entry.expectedState.trim().length <
          30,
    ) ||
    plan.ownerControlChecks.some(
      (entry) =>
        entry.expectedState.trim().length <
          30,
    )
  ) {
    throw new Error(
      "Advik systems-evaluation evidence is incomplete.",
    );
  }
}

export interface CreateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly zaraOwnerReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

  readonly executedAt: string;
}

function buildAdvikExecution(
  executionId: string,
  executedAt: string,
) {
  const plan =
    getAdvikPlan();

  const preparation =
    getAdvikPreparation();

  const decision =
    getAdvikDecision();

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId,

    executionState:
      "ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      CANONICAL_OWNER_REVIEW.tenantId,

    ownerId:
      CANONICAL_OWNER_REVIEW.ownerId,

    employeeId:
      "candidate-advik-v1" as const,

    employeeCode:
      "nx-engineering-008" as const,

    publicName:
      "Advik" as const,

    officialRole:
      "AI Systems Evaluation & Red-Team Specialist" as const,

    runtimeId:
      decision.runtimeId,

    sourceZaraOwnerReviewDecisionId:
      CANONICAL_OWNER_REVIEW.decisionId,

    sourceZaraOwnerReviewDecisionDigest:
      CANONICAL_OWNER_REVIEW.decisionDigest,

    sourceZaraExecutionId:
      CANONICAL_OWNER_REVIEW.sourceExecutionId,

    sourceZaraExecutionDigest:
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

    candidateSequence:
      8 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

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

    systemsEvaluationPlan:
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_SYSTEMS_EVALUATION_PLAN,

    executionBoundary: {
      canonicalZaraOwnerReviewBound:
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

      exactAdvikSecondTaskExecuted:
        true as const,

      finalCandidateSecondTaskExecuted:
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

      sequenceExecutionCompletePendingOwnerReview:
        true as const,

      noCandidateExecutionRemaining:
        true as const,

      nextCandidateExecutionAuthorized:
        false as const,

      noLaterCandidateExecutionAuthorized:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
        false as const,

      evidenceSubstitutionChecksCreated:
        true as const,

      authorityBypassChecksCreated:
        true as const,

      isolationChecksCreated:
        true as const,

      recoveryChecksCreated:
        true as const,

      ownerControlChecksCreated:
        true as const,

      adversarialExecutionPerformed:
        false as const,

      adversarialExecutionAuthorized:
        false as const,

      authorityBypassPerformed:
        false as const,

      authorityBypassAuthorized:
        false as const,

      evidenceSubstitutionPerformed:
        false as const,

      evidenceSubstitutionAuthorized:
        false as const,

      realCustomerDataUsed:
        false as const,

      realCustomerDataAccessAuthorized:
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
      "AWAIT_OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,

    executionDigest:
      sha256(executionCore),
  });
}

export type EngineeringAIWorkforceAdvikSecondSyntheticTaskExecution =
  ReturnType<
    typeof buildAdvikExecution
  >;

export function validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceAdvikSecondSyntheticTaskExecution,
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
      "Advik second-task execution integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_OWNER_REVIEW,
  );

  validateCanonicalAdvikSources();
  validateSystemsEvaluationPlan();

  const plan =
    getAdvikPlan();

  const preparation =
    getAdvikPreparation();

  const decision =
    getAdvikDecision();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !==
      CANONICAL_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_OWNER_REVIEW.ownerId ||
    record.employeeId !==
      "candidate-advik-v1" ||
    record.employeeCode !==
      "nx-engineering-008" ||
    record.publicName !==
      "Advik" ||
    record.officialRole !==
      "AI Systems Evaluation & Red-Team Specialist" ||
    record.runtimeId !==
      decision.runtimeId ||
    record.sourceZaraOwnerReviewDecisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    record.sourceZaraOwnerReviewDecisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest ||
    record.sourceZaraExecutionId !==
      CANONICAL_OWNER_REVIEW.sourceExecutionId ||
    record.sourceZaraExecutionDigest !==
      CANONICAL_OWNER_REVIEW.sourceExecutionDigest ||
    record.sourceCandidatePlanDigest !==
      plan.candidatePlanDigest ||
    record.sourceCandidateDecisionPreparationDigest !==
      preparation
        .candidateDecisionPreparationDigest ||
    record.candidateDecisionDigest !==
      decision.candidateDecisionDigest ||
    record.taskSequence !== 2 ||
    record.candidateSequence !== 8 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE
  ) {
    throw new Error(
      "Advik second-task canonical binding is invalid.",
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
      "Advik second-task contract is invalid.",
    );
  }

  if (
    record.systemsEvaluationPlan !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_SYSTEMS_EVALUATION_PLAN
  ) {
    throw new Error(
      "Advik systems-evaluation evidence binding is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  const requiredTrue = [
    boundary.canonicalZaraOwnerReviewBound,
    boundary.sourceOwnerReviewIntegrityVerified,
    boundary.sourceCandidatePlanBound,
    boundary.sourceCandidateDecisionPreparationBound,
    boundary.candidateDecisionBound,
    boundary.tenantIdentityBound,
    boundary.ownerIdentityBound,
    boundary.employeeIdentityBound,
    boundary.runtimeIdentityBound,
    boundary.exactAdvikSecondTaskExecuted,
    boundary.finalCandidateSecondTaskExecuted,
    boundary.secondSyntheticTaskExecutionPerformed,
    boundary.deterministicEvidenceCreated,
    boundary.independentValidationRequired,
    boundary.ownerReviewRequired,
    boundary.ownerReviewRequiredImmediately,
    boundary.sequenceExecutionCompletePendingOwnerReview,
    boundary.noCandidateExecutionRemaining,
    boundary.noLaterCandidateExecutionAuthorized,
    boundary.evidenceSubstitutionChecksCreated,
    boundary.authorityBypassChecksCreated,
    boundary.isolationChecksCreated,
    boundary.recoveryChecksCreated,
    boundary.ownerControlChecksCreated,
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
    boundary.adversarialExecutionPerformed,
    boundary.adversarialExecutionAuthorized,
    boundary.authorityBypassPerformed,
    boundary.authorityBypassAuthorized,
    boundary.evidenceSubstitutionPerformed,
    boundary.evidenceSubstitutionAuthorized,
    boundary.realCustomerDataUsed,
    boundary.realCustomerDataAccessAuthorized,
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
      "Advik second-task authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ADVIK_SECOND_SYNTHETIC_TASK_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Advik second-task transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.systemsEvaluationPlan,
    ) ||
    !Object.isFrozen(
      record.systemsEvaluationPlan
        .evidenceSubstitutionChecks,
    ) ||
    !Object.isFrozen(
      record.systemsEvaluationPlan
        .authorityBypassChecks,
    ) ||
    !Object.isFrozen(
      record.systemsEvaluationPlan
        .isolationChecks,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Advik second-task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceAdvikSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceAdvikSecondSyntheticTaskExecution {
  validateEngineeringAIWorkforceZaraSecondSyntheticTaskOwnerReviewDecision(
    input.zaraOwnerReviewDecision,
  );

  if (
    input.zaraOwnerReviewDecision.decisionId !==
      CANONICAL_OWNER_REVIEW.decisionId ||
    input.zaraOwnerReviewDecision.decisionDigest !==
      CANONICAL_OWNER_REVIEW.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Zara second-task owner review can authorize Advik.",
    );
  }

  if (
    CANONICAL_OWNER_REVIEW.decision !==
      "APPROVE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    CANONICAL_OWNER_REVIEW.advikSecondTaskExecutionAuthorized !==
      true ||
    CANONICAL_OWNER_REVIEW.advikSecondTaskExecutionPerformed !==
      false ||
    CANONICAL_OWNER_REVIEW.nextCandidate.employeeId !==
      "candidate-advik-v1" ||
    CANONICAL_OWNER_REVIEW.nextCandidate.taskSequence !==
      2 ||
    CANONICAL_OWNER_REVIEW.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_SCENARIO ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .onlyAdvikCurrentlyExecutable !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .advikIsFinalCandidate !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .noLaterCandidateExecutionAuthorized !==
      true ||
    CANONICAL_OWNER_REVIEW.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    CANONICAL_OWNER_REVIEW.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_EIGHT"
  ) {
    throw new Error(
      "Advik second synthetic task is not owner-authorized.",
    );
  }

  const executionId =
    requireSafeIdentifier(
      "Advik second-task execution identity",
      input.executionId,
    );

  const executedAt =
    requireIsoTimestamp(
      "Advik second-task execution time",
      input.executedAt,
    );

  if (
    Date.parse(executedAt) <
      Date.parse(
        CANONICAL_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Advik second-task execution cannot precede Zara owner review.",
    );
  }

  validateCanonicalAdvikSources();
  validateSystemsEvaluationPlan();

  const record =
    buildAdvikExecution(
      executionId,
      executedAt,
    );

  validateEngineeringAIWorkforceAdvikSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ADVIK_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceAdvikSecondSyntheticTask({
    executionId:
      "engineering-advik-second-synthetic-task-execution-001",

    zaraOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ZARA_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-08-02T11:05:00.000Z",
  });