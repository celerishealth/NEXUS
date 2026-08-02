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
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,
  type EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-leela-second-synthetic-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO =
  "ENGINEERING_DELIVERY_COORDINATION_PLAN" as const;

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OBJECTIVE =
  "Plan one bounded synthetic engineering-delivery coordination evidence task without concurrent execution." as const;

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE =
  "A deterministic coordination plan with sequencing, conflict prevention, pause, escalation, and owner-review controls." as const;

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_FIXTURE =
  {
    fixtureId:
      "engineering-leela-second-synthetic-delivery-fixture-001",

    fixtureClass:
      "SYNTHETIC_ENGINEERING_DELIVERY_COORDINATION_FIXTURE",

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY",

    scenarioId:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO,

    coordinationProblem:
      "Coordinate one synthetic engineering change through evidence preparation, bounded validation, owner review, and retained execution authority without concurrent work or repository access.",

    syntheticWorkItems: [
      {
        workItemId:
          "SYNTHETIC_REQUIREMENT_CONTRACT_REVIEW",

        sequence: 1,

        dependsOn:
          [] as readonly string[],

        responsibility:
          "Confirm the bounded synthetic objective, evidence expectations, tenant boundary, owner authority, and prohibited actions.",

        sharedStateMutationRequired:
          false,

        repositoryAccessRequired:
          false,

        productionAccessRequired:
          false,
      },
      {
        workItemId:
          "SYNTHETIC_COORDINATION_SEQUENCE_DRAFT",

        sequence: 2,

        dependsOn: [
          "SYNTHETIC_REQUIREMENT_CONTRACT_REVIEW",
        ],

        responsibility:
          "Draft one deterministic sequential coordination path with explicit entry, exit, pause, and escalation conditions.",

        sharedStateMutationRequired:
          false,

        repositoryAccessRequired:
          false,

        productionAccessRequired:
          false,
      },
      {
        workItemId:
          "SYNTHETIC_CONFLICT_AND_FAILURE_REVIEW",

        sequence: 3,

        dependsOn: [
          "SYNTHETIC_COORDINATION_SEQUENCE_DRAFT",
        ],

        responsibility:
          "Review synthetic ownership conflicts, stale evidence, dependency failure, sequencing ambiguity, and unauthorized authority expansion.",

        sharedStateMutationRequired:
          false,

        repositoryAccessRequired:
          false,

        productionAccessRequired:
          false,
      },
      {
        workItemId:
          "SYNTHETIC_OWNER_REVIEW_PACKAGE",

        sequence: 4,

        dependsOn: [
          "SYNTHETIC_CONFLICT_AND_FAILURE_REVIEW",
        ],

        responsibility:
          "Prepare one immutable synthetic owner-review package without implementing, merging, deploying, delivering, or committing funds.",

        sharedStateMutationRequired:
          false,

        repositoryAccessRequired:
          false,

        productionAccessRequired:
          false,
      },
    ],

    syntheticConflictRisks: [
      {
        riskId:
          "CONFLICT_PARALLEL_STAGE_EXECUTION",

        condition:
          "Two synthetic coordination stages are treated as simultaneously executable.",

        prevention:
          "Authorize exactly one ordered stage at a time and reject any concurrent-stage state.",
      },
      {
        riskId:
          "CONFLICT_STALE_OR_CROSS_TENANT_EVIDENCE",

        condition:
          "Evidence identity, tenant identity, owner identity, runtime identity, or digest does not match the canonical source.",

        prevention:
          "Fail closed, activate emergency pause, and require a new owner-controlled review.",
      },
      {
        riskId:
          "CONFLICT_UNRESOLVED_DEPENDENCY",

        condition:
          "A stage attempts to continue before its predecessor evidence and exit condition are complete.",

        prevention:
          "Block progression and escalate the unresolved dependency to the owner.",
      },
      {
        riskId:
          "CONFLICT_AUTHORITY_EXPANSION",

        condition:
          "Synthetic coordination is interpreted as repository, production, customer, payment, legal, or public-launch authority.",

        prevention:
          "Retain every consequential authority with the owner and mark the transition invalid.",
      },
    ],

    prohibitedActions: [
      "Repository reading or writing",
      "Branch creation, pull-request preparation, or merge",
      "Secrets or credential access",
      "Real customer data or customer contact",
      "External delivery or live-provider execution",
      "Production database access or mutation",
      "Production deployment",
      "Payment, financial, or legal commitment",
      "Autonomous consequential decision",
      "Level 3 authority or Founder Liberation declaration",
      "Public launch",
    ],
  } as const;

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN =
  {
    planId:
      "engineering-leela-second-synthetic-delivery-coordination-plan-001",

    evidenceClass:
      "DETERMINISTIC_ENGINEERING_DELIVERY_COORDINATION_PLAN",

    reviewOutcome:
      "BOUNDED_SEQUENTIAL_COORDINATION_RECOMMENDED",

    coordinationMode:
      "STRICTLY_SEQUENTIAL_OWNER_CONTROLLED",

    concurrentExecutionAllowed:
      false,

    recommendedSequence: [
      {
        stageId:
          "STAGE_1_BIND_CANONICAL_SCOPE",

        sequence: 1,

        entryCondition:
          "Canonical Leela identity, runtime, second-task plan, execution decision, and Ishaan owner-review approval are digest-bound.",

        boundedAction:
          "Bind the synthetic coordination scope and prohibited authority boundary.",

        requiredEvidence: [
          "Canonical candidate plan digest",
          "Canonical decision-preparation digest",
          "Canonical candidate decision digest",
          "Canonical Ishaan owner-review decision digest",
        ],

        exitCondition:
          "Every canonical identity and digest matches and no authority expansion is detected.",

        pauseCondition:
          "Any source identity, tenant, owner, runtime, sequence, scenario, or digest mismatch.",

        escalationCondition:
          "Owner review is required before replacing or repairing any canonical source.",
      },
      {
        stageId:
          "STAGE_2_ORDER_SYNTHETIC_DEPENDENCIES",

        sequence: 2,

        entryCondition:
          "Stage 1 canonical binding has completed without a defect.",

        boundedAction:
          "Order the four synthetic work items into one non-overlapping dependency chain.",

        requiredEvidence: [
          "Unique stage sequence",
          "Explicit predecessor for every stage after stage one",
          "Concurrent execution disabled",
          "Single task-executor invocation",
        ],

        exitCondition:
          "Every work item has one deterministic position and no parallel execution path exists.",

        pauseCondition:
          "Duplicate sequence, missing predecessor, cyclic dependency, or concurrent-stage eligibility.",

        escalationCondition:
          "Leela pauses the task and presents the dependency conflict to the owner.",
      },
      {
        stageId:
          "STAGE_3_APPLY_CONFLICT_PREVENTION",

        sequence: 3,

        entryCondition:
          "The synthetic dependency order is complete and deterministic.",

        boundedAction:
          "Apply fail-closed controls for ownership conflict, stale evidence, unresolved dependency, and authority expansion.",

        requiredEvidence: [
          "Conflict register",
          "Fail-closed response per conflict",
          "Emergency-pause trigger",
          "Owner escalation route",
        ],

        exitCondition:
          "Every identified synthetic conflict has one preventive control and one owner escalation path.",

        pauseCondition:
          "A conflict lacks a deterministic preventive control or escalation route.",

        escalationCondition:
          "Stop on the first unresolved conflict and retain the sequence at Leela.",
      },
      {
        stageId:
          "STAGE_4_PACKAGE_OWNER_REVIEW_EVIDENCE",

        sequence: 4,

        entryCondition:
          "The ordered coordination path and conflict controls are complete.",

        boundedAction:
          "Package the deterministic synthetic coordination evidence for immediate owner review.",

        requiredEvidence: [
          "Ordered coordination stages",
          "Conflict-prevention controls",
          "Pause controls",
          "Escalation controls",
          "Authority boundary summary",
        ],

        exitCondition:
          "The immutable review package is complete without implementation, repository activity, deployment, delivery, or commitment.",

        pauseCondition:
          "Evidence is missing, mutable, stale, inconsistent, or implies unsupported authority.",

        escalationCondition:
          "Return the incomplete package to emergency pause and require owner-controlled correction.",
      },
      {
        stageId:
          "STAGE_5_STOP_FOR_OWNER_DECISION",

        sequence: 5,

        entryCondition:
          "The deterministic synthetic review package has been created.",

        boundedAction:
          "Stop all further candidate execution and await the owner's Leela second-task review decision.",

        requiredEvidence: [
          "Leela second-task execution digest",
          "Immediate owner-review requirement",
          "Next-candidate execution blocked",
          "Remaining six candidates waiting",
        ],

        exitCondition:
          "No next candidate is executable until the owner records a separate valid review decision.",

        pauseCondition:
          "Any attempted continuation before owner review.",

        escalationCondition:
          "Reject the continuation attempt and preserve owner final authority.",
      },
    ],

    conflictPreventionControls: [
      "Exactly one synthetic candidate task may execute at a time.",
      "Exactly one coordination stage may be active at a time.",
      "Every stage after stage one requires the previous stage's exit evidence.",
      "Canonical owner, tenant, candidate, runtime, scenario, sequence, and digest binding is mandatory.",
      "Missing, stale, copied, cross-tenant, cross-owner, or tampered evidence fails closed.",
      "No coordination artifact can grant repository, production, customer, provider, financial, legal, or launch authority.",
    ],

    pauseControls: [
      "Pause on the first source identity or digest mismatch.",
      "Pause on duplicate, missing, cyclic, or concurrent stage sequencing.",
      "Pause when required evidence is absent or inconsistent.",
      "Pause when a requested action exceeds synthetic read-only draft-only authority.",
      "Pause on any attempted third task, next-candidate execution, repository action, production action, payment, or public launch.",
    ],

    escalationControls: [
      "Escalate unresolved dependency conflict to the owner.",
      "Escalate authority-boundary ambiguity to the owner.",
      "Escalate evidence-integrity failure to the owner with emergency pause active.",
      "Escalate any requested customer, provider, production, payment, legal, or launch action without executing it.",
      "Escalate any attempted continuation before the mandatory owner review.",
    ],

    ownerReviewControls: [
      "Owner review is required immediately after this one synthetic task.",
      "No next candidate becomes executable from this execution artifact.",
      "The remaining six candidates continue waiting.",
      "Independent validation remains required and incomplete.",
      "The owner retains final scope, authority, continuation, pause, rollback, and rejection control.",
    ],

    uncertainties: [
      "This synthetic plan does not validate real repository delivery performance.",
      "This synthetic plan does not establish production readiness.",
      "This synthetic plan does not authorize implementation or external execution.",
      "Independent validation remains pending.",
    ],

    implementationPrepared:
      false,

    implementationExecuted:
      false,

    repositoryChangePrepared:
      false,

    repositoryChangeExecuted:
      false,

    productionDeploymentPrepared:
      false,

    productionDeploymentExecuted:
      false,

    customerDeliveryPrepared:
      false,

    customerDeliveryExecuted:
      false,
  } as const;

export interface CreateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecutionInput {
  readonly executionId: string;

  readonly ishaanOwnerReviewDecision:
    EngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision;

  readonly executedAt: string;
}

export interface EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION;

  readonly executionId: string;

  readonly executionState:
    "ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_EXECUTED";

  readonly tenantId: string;

  readonly ownerId: string;

  readonly employeeId:
    "candidate-leela-v1";

  readonly employeeCode:
    "nx-engineering-002";

  readonly publicName: "Leela";

  readonly officialRole:
    "AI Software Engineering Director";

  readonly runtimeId: string;

  readonly sourceIshaanOwnerReviewDecisionId:
    string;

  readonly sourceIshaanOwnerReviewDecisionDigest:
    string;

  readonly sourceIshaanExecutionId:
    string;

  readonly sourceIshaanExecutionDigest:
    string;

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

  readonly candidateDecisionDigest:
    string;

  readonly taskSequence: 2;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO;

  readonly objective:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OBJECTIVE;

  readonly expectedEvidence:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE;

  readonly taskContract: Readonly<{
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

    maximumTaskCount: 1;

    executedTaskCount: 1;

    remainingTaskCapacity: 0;

    concurrentTaskLimit: 1;

    failureThreshold: 1;

    ownerReviewFrequency:
      "AFTER_EVERY_SYNTHETIC_TASK";
  }>;

  readonly syntheticDeliveryFixture:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_FIXTURE;

  readonly deliveryCoordinationPlan:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN;

  readonly executionBoundary: Readonly<{
    canonicalIshaanOwnerReviewBound:
      true;

    ishaanOwnerReviewIntegrityVerified:
      true;

    canonicalOwnerDecisionBound:
      true;

    canonicalDecisionPreparationBound:
      true;

    sourceCandidatePlanBound:
      true;

    candidateDecisionBound:
      true;

    tenantIdentityBound: true;

    ownerIdentityBound: true;

    employeeIdentityBound: true;

    runtimeIdentityBound: true;

    approvalBypassAllowed: false;

    exactLeelaSecondTaskExecuted:
      true;

    secondSyntheticTaskExecutionPerformed:
      true;

    taskExecutorInvocationCount: 1;

    deterministicEvidenceCreated:
      true;

    independentValidationRequired:
      true;

    independentValidationCompleted:
      false;

    ownerDecisionMade: false;

    ownerReviewRequired: true;

    ownerReviewRequiredImmediately:
      true;

    nextCandidateExecutionAuthorized:
      false;

    remainingSixAuthorizedCandidatesWaiting:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    thirdSyntheticTaskExecutionAuthorized:
      false;

    repositoryReadPerformed: false;

    repositoryReadAuthorized: false;

    repositoryWritePerformed: false;

    repositoryWriteAuthorized: false;

    branchCreationAuthorized: false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized: false;

    secretsAccessPerformed: false;

    secretsAccessAuthorized: false;

    realCustomerDataUsed: false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactPerformed:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryPrepared: false;

    externalDeliveryExecuted: false;

    externalDeliveryAuthorized: false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAccessPerformed:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationPerformed:
      false;

    productionMutationAuthorized:
      false;

    productionDeploymentPrepared:
      false;

    productionDeploymentExecuted:
      false;

    productionDeploymentAuthorized:
      false;

    paymentExecutionPerformed: false;

    paymentExecutionAuthorized: false;

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
    "AWAIT_OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW";

  readonly executedAt: string;

  readonly executionDigest: string;
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
      "Unsupported deterministic Leela second synthetic task execution value.",
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

const CANONICAL_EVIDENCE_PLAN =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

const CANONICAL_DECISION_PREPARATION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

const CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

const CANONICAL_ISHAAN_OWNER_REVIEW =
  ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION;

const CANONICAL_LEELA_PLAN =
  CANONICAL_EVIDENCE_PLAN
    .candidatePlans
    .find(
      (entry) =>
        entry.publicName === "Leela",
    );

const CANONICAL_LEELA_DECISION_PREPARATION =
  CANONICAL_DECISION_PREPARATION
    .candidateDecisionPreparations
    .find(
      (entry) =>
        entry.publicName === "Leela",
    );

const CANONICAL_LEELA_DECISION =
  CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION
    .candidateDecisions
    .find(
      (entry) =>
        entry.publicName === "Leela",
    );

if (
  !CANONICAL_LEELA_PLAN ||
  !CANONICAL_LEELA_DECISION_PREPARATION ||
  !CANONICAL_LEELA_DECISION ||
  CANONICAL_LEELA_PLAN.sequence !== 2 ||
  CANONICAL_LEELA_PLAN.employeeId !==
    "candidate-leela-v1" ||
  CANONICAL_LEELA_PLAN.employeeCode !==
    "nx-engineering-002" ||
  CANONICAL_LEELA_PLAN.officialRole !==
    "AI Software Engineering Director" ||
  CANONICAL_LEELA_PLAN.scenarioId !==
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO ||
  CANONICAL_LEELA_PLAN.objective !==
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
  CANONICAL_LEELA_PLAN.expectedEvidence !==
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
  CANONICAL_LEELA_PLAN.dataClassification !==
    "SYNTHETIC_SANITIZED_ONLY" ||
  CANONICAL_LEELA_PLAN.outputMode !==
    "PLAN_ONLY" ||
  CANONICAL_LEELA_PLAN.evidenceToolMode !==
    "READ_ONLY" ||
  CANONICAL_LEELA_PLAN.maximumTaskCount !==
    1 ||
  CANONICAL_LEELA_PLAN.concurrentTaskLimit !==
    0 ||
  CANONICAL_LEELA_PLAN.deterministicEvidenceRequired !==
    true ||
  CANONICAL_LEELA_PLAN.independentValidationRequired !==
    true ||
  CANONICAL_LEELA_PLAN.ownerReviewAfterExecutionRequired !==
    true ||
  CANONICAL_LEELA_PLAN.secondTaskExecutionAuthorized !==
    false ||
  CANONICAL_LEELA_PLAN.secondTaskExecuted !==
    false ||
  CANONICAL_LEELA_PLAN.concurrentExecutionAuthorized !==
    false
) {
  throw new Error(
    "Canonical Leela second-task evidence plan is invalid.",
  );
}

if (
  CANONICAL_LEELA_DECISION_PREPARATION.sequence !==
    2 ||
  CANONICAL_LEELA_DECISION_PREPARATION.employeeId !==
    "candidate-leela-v1" ||
  CANONICAL_LEELA_DECISION_PREPARATION.runtimeId !==
    CANONICAL_LEELA_PLAN.runtimeId ||
  CANONICAL_LEELA_DECISION_PREPARATION.sourceCandidatePlanDigest !==
    CANONICAL_LEELA_PLAN.candidatePlanDigest ||
  CANONICAL_LEELA_DECISION_PREPARATION.scenarioId !==
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO ||
  CANONICAL_LEELA_DECISION_PREPARATION.recommendedDecision !==
    "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
  CANONICAL_LEELA_DECISION_PREPARATION.secondTaskExecutionAuthorized !==
    false ||
  CANONICAL_LEELA_DECISION_PREPARATION.secondTaskExecuted !==
    false ||
  CANONICAL_LEELA_DECISION_PREPARATION.concurrentExecutionAuthorized !==
    false
) {
  throw new Error(
    "Canonical Leela second-task decision preparation is invalid.",
  );
}

if (
  CANONICAL_LEELA_DECISION.sequence !==
    2 ||
  CANONICAL_LEELA_DECISION.employeeId !==
    "candidate-leela-v1" ||
  CANONICAL_LEELA_DECISION.employeeCode !==
    "nx-engineering-002" ||
  CANONICAL_LEELA_DECISION.runtimeId !==
    CANONICAL_LEELA_PLAN.runtimeId ||
  CANONICAL_LEELA_DECISION.sourceCandidateDecisionPreparationDigest !==
    CANONICAL_LEELA_DECISION_PREPARATION
      .candidateDecisionPreparationDigest ||
  CANONICAL_LEELA_DECISION.taskSequence !==
    2 ||
  CANONICAL_LEELA_DECISION.scenarioId !==
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO ||
  CANONICAL_LEELA_DECISION.decision !==
    "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
  CANONICAL_LEELA_DECISION.secondTaskExecutionAuthorized !==
    true ||
  CANONICAL_LEELA_DECISION.secondTaskExecutionPerformed !==
    false ||
  CANONICAL_LEELA_DECISION.currentlyExecutable !==
    false ||
  CANONICAL_LEELA_DECISION.waitingForPriorCandidateOwnerReview !==
    true ||
  CANONICAL_LEELA_DECISION.authorityBoundary
    .concurrentCandidateExecutionAuthorized !==
    false ||
  CANONICAL_LEELA_DECISION.authorityBoundary
    .ownerReviewRequiredImmediatelyAfterExecution !==
    true
) {
  throw new Error(
    "Canonical Leela second-task owner decision is invalid.",
  );
}

function getCanonicalLeelaPlan():
  NonNullable<
    typeof CANONICAL_LEELA_PLAN
  > {
  return CANONICAL_LEELA_PLAN!;
}

function getCanonicalLeelaDecisionPreparation():
  NonNullable<
    typeof CANONICAL_LEELA_DECISION_PREPARATION
  > {
  return CANONICAL_LEELA_DECISION_PREPARATION!;
}

function getCanonicalLeelaDecision():
  NonNullable<
    typeof CANONICAL_LEELA_DECISION
  > {
  return CANONICAL_LEELA_DECISION!;
}

function validateCoordinationPlan(): void {
  const plan =
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN;

  const fixture =
    ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_FIXTURE;

  if (
    plan.evidenceClass !==
      "DETERMINISTIC_ENGINEERING_DELIVERY_COORDINATION_PLAN" ||
    plan.reviewOutcome !==
      "BOUNDED_SEQUENTIAL_COORDINATION_RECOMMENDED" ||
    plan.coordinationMode !==
      "STRICTLY_SEQUENTIAL_OWNER_CONTROLLED" ||
    plan.concurrentExecutionAllowed !==
      false ||
    plan.recommendedSequence.length !==
      5 ||
    fixture.syntheticWorkItems.length !==
      4 ||
    fixture.syntheticConflictRisks.length !==
      4
  ) {
    throw new Error(
      "Leela deterministic delivery-coordination evidence is invalid.",
    );
  }

  const stageSequences =
    plan.recommendedSequence.map(
      (stage) =>
        stage.sequence,
    );

  if (
    new Set(stageSequences).size !==
      stageSequences.length ||
    stageSequences.some(
      (sequence, index) =>
        sequence !== index + 1,
    )
  ) {
    throw new Error(
      "Leela delivery-coordination stage sequence is invalid.",
    );
  }

  const workItemSequences =
    fixture.syntheticWorkItems.map(
      (workItem) =>
        workItem.sequence,
    );

  if (
    new Set(workItemSequences).size !==
      workItemSequences.length ||
    workItemSequences.some(
      (sequence, index) =>
        sequence !== index + 1,
    )
  ) {
    throw new Error(
      "Leela synthetic work-item sequence is invalid.",
    );
  }

  if (
    plan.recommendedSequence.some(
      (stage) =>
        stage.requiredEvidence.some(
          (evidence) =>
            evidence.trim().length === 0,
        ) ||
        stage.pauseCondition.length <
          20 ||
        stage.escalationCondition.length <
          20,
    ) ||
    plan.conflictPreventionControls.length <
      5 ||
    plan.pauseControls.length < 5 ||
    plan.escalationControls.length <
      5 ||
    plan.ownerReviewControls.length <
      5
  ) {
    throw new Error(
      "Leela delivery-coordination controls are incomplete.",
    );
  }

  if (
    plan.implementationPrepared !==
      false ||
    plan.implementationExecuted !==
      false ||
    plan.repositoryChangePrepared !==
      false ||
    plan.repositoryChangeExecuted !==
      false ||
    plan.productionDeploymentPrepared !==
      false ||
    plan.productionDeploymentExecuted !==
      false ||
    plan.customerDeliveryPrepared !==
      false ||
    plan.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Leela synthetic coordination plan exceeded its authority.",
    );
  }
}

export function validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
  record:
    EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution,
): void {
  const {
    executionDigest,
    ...executionCore
  } = record;

  if (
    executionDigest !==
      sha256(executionCore)
  ) {
    throw new Error(
      "Leela second synthetic task execution integrity verification failed.",
    );
  }

  validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
    CANONICAL_ISHAAN_OWNER_REVIEW,
  );

  validateCoordinationPlan();

  const leelaPlan =
    getCanonicalLeelaPlan();

  const leelaPreparation =
    getCanonicalLeelaDecisionPreparation();

  const leelaDecision =
    getCanonicalLeelaDecision();

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_EXECUTED" ||
    record.tenantId !==
      CANONICAL_ISHAAN_OWNER_REVIEW.tenantId ||
    record.ownerId !==
      CANONICAL_ISHAAN_OWNER_REVIEW.ownerId ||
    record.employeeId !==
      "candidate-leela-v1" ||
    record.employeeCode !==
      "nx-engineering-002" ||
    record.publicName !== "Leela" ||
    record.officialRole !==
      "AI Software Engineering Director" ||
    record.runtimeId !==
      leelaDecision.runtimeId ||
    record.sourceIshaanOwnerReviewDecisionId !==
      CANONICAL_ISHAAN_OWNER_REVIEW.decisionId ||
    record.sourceIshaanOwnerReviewDecisionDigest !==
      CANONICAL_ISHAAN_OWNER_REVIEW.decisionDigest ||
    record.sourceIshaanExecutionId !==
      CANONICAL_ISHAAN_OWNER_REVIEW.sourceExecutionId ||
    record.sourceIshaanExecutionDigest !==
      CANONICAL_ISHAAN_OWNER_REVIEW.sourceExecutionDigest ||
    record.ownerSecondTaskExecutionDecisionId !==
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION.decisionId ||
    record.ownerSecondTaskExecutionDecisionDigest !==
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION.decisionDigest ||
    record.sourceDecisionPreparationId !==
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION.sourcePreparationId ||
    record.sourceDecisionPreparationDigest !==
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION.sourcePreparationDigest ||
    record.sourceCandidateDecisionPreparationDigest !==
      leelaDecision.sourceCandidateDecisionPreparationDigest ||
    record.sourceCandidatePlanDigest !==
      leelaPreparation.sourceCandidatePlanDigest ||
    record.candidateDecisionDigest !==
      leelaDecision.candidateDecisionDigest ||
    record.taskSequence !== 2 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    record.objective !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OBJECTIVE ||
    record.expectedEvidence !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE ||
    leelaPlan.candidatePlanDigest !==
      record.sourceCandidatePlanDigest
  ) {
    throw new Error(
      "Leela second-task canonical source binding is invalid.",
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
      "Leela second-task execution contract is invalid.",
    );
  }

  if (
    record.syntheticDeliveryFixture !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_FIXTURE ||
    record.deliveryCoordinationPlan !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN
  ) {
    throw new Error(
      "Leela second-task deterministic coordination evidence binding is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalIshaanOwnerReviewBound !==
      true ||
    boundary.ishaanOwnerReviewIntegrityVerified !==
      true ||
    boundary.canonicalOwnerDecisionBound !==
      true ||
    boundary.canonicalDecisionPreparationBound !==
      true ||
    boundary.sourceCandidatePlanBound !==
      true ||
    boundary.candidateDecisionBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.employeeIdentityBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.exactLeelaSecondTaskExecuted !==
      true ||
    boundary.secondSyntheticTaskExecutionPerformed !==
      true ||
    boundary.taskExecutorInvocationCount !==
      1 ||
    boundary.deterministicEvidenceCreated !==
      true ||
    boundary.independentValidationRequired !==
      true ||
    boundary.independentValidationCompleted !==
      false ||
    boundary.ownerDecisionMade !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerReviewRequiredImmediately !==
      true ||
    boundary.nextCandidateExecutionAuthorized !==
      false ||
    boundary.remainingSixAuthorizedCandidatesWaiting !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.thirdSyntheticTaskExecutionAuthorized !==
      false ||
    boundary.repositoryReadPerformed !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWritePerformed !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !== false ||
    boundary.secretsAccessPerformed !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactPerformed !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryPrepared !==
      false ||
    boundary.externalDeliveryExecuted !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAccessPerformed !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationPerformed !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionDeploymentPrepared !==
      false ||
    boundary.productionDeploymentExecuted !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.paymentExecutionPerformed !==
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
      "Leela second-task execution authority boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW" ||
    Date.parse(record.executedAt) <
      Date.parse(
        CANONICAL_ISHAAN_OWNER_REVIEW.decidedAt,
      )
  ) {
    throw new Error(
      "Leela second-task execution transition is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.taskContract,
    ) ||
    !Object.isFrozen(
      record.syntheticDeliveryFixture,
    ) ||
    !Object.isFrozen(
      record.syntheticDeliveryFixture
        .syntheticWorkItems,
    ) ||
    !Object.isFrozen(
      record.deliveryCoordinationPlan,
    ) ||
    !Object.isFrozen(
      record.deliveryCoordinationPlan
        .recommendedSequence,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Leela second-task execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceLeelaSecondSyntheticTask(
  input:
    CreateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecutionInput,
): EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution {
  const canonicalReview =
    CANONICAL_ISHAAN_OWNER_REVIEW;

  if (
    input.ishaanOwnerReviewDecision !==
      canonicalReview
  ) {
    validateEngineeringAIWorkforceIshaanSecondSyntheticTaskOwnerReviewDecision(
      input.ishaanOwnerReviewDecision,
    );
  }

  if (
    input.ishaanOwnerReviewDecision.decisionId !==
      canonicalReview.decisionId ||
    input.ishaanOwnerReviewDecision.decisionDigest !==
      canonicalReview.decisionDigest
  ) {
    throw new Error(
      "Only the canonical Ishaan second-task owner review can authorize Leela's second synthetic task.",
    );
  }

  if (
    canonicalReview.decision !==
      "APPROVE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    canonicalReview.leelaSecondTaskExecutionAuthorized !==
      true ||
    canonicalReview.leelaSecondTaskExecutionPerformed !==
      false ||
    canonicalReview.nextCandidate.employeeId !==
      "candidate-leela-v1" ||
    canonicalReview.nextCandidate.taskSequence !==
      2 ||
    canonicalReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO ||
    canonicalReview.authorityBoundary
      .onlyLeelaCurrentlyExecutable !==
      true ||
    canonicalReview.authorityBoundary
      .remainingSixAuthorizedCandidatesWaiting !==
      true ||
    canonicalReview.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    canonicalReview.nextStep !==
      "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_TWO"
  ) {
    throw new Error(
      "Leela second synthetic task execution is not owner-authorized.",
    );
  }

  const executionId =
    requireSafeIdentifier(
      "Leela second-task execution identity",
      input.executionId,
    );

  const executedAt =
    requireIsoTimestamp(
      "Leela second-task execution time",
      input.executedAt,
    );

  if (
    Date.parse(executedAt) <
      Date.parse(
        canonicalReview.decidedAt,
      )
  ) {
    throw new Error(
      "Leela second-task execution cannot precede Ishaan owner review.",
    );
  }

  validateCoordinationPlan();

  const leelaPlan =
    getCanonicalLeelaPlan();

  const leelaPreparation =
    getCanonicalLeelaDecisionPreparation();

  const leelaDecision =
    getCanonicalLeelaDecision();

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION_VERSION,

    executionId,

    executionState:
      "ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_EXECUTED" as const,

    tenantId:
      canonicalReview.tenantId,

    ownerId:
      canonicalReview.ownerId,

    employeeId:
      "candidate-leela-v1" as const,

    employeeCode:
      "nx-engineering-002" as const,

    publicName:
      "Leela" as const,

    officialRole:
      "AI Software Engineering Director" as const,

    runtimeId:
      leelaDecision.runtimeId,

    sourceIshaanOwnerReviewDecisionId:
      canonicalReview.decisionId,

    sourceIshaanOwnerReviewDecisionDigest:
      canonicalReview.decisionDigest,

    sourceIshaanExecutionId:
      canonicalReview.sourceExecutionId,

    sourceIshaanExecutionDigest:
      canonicalReview.sourceExecutionDigest,

    ownerSecondTaskExecutionDecisionId:
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION
        .decisionId,

    ownerSecondTaskExecutionDecisionDigest:
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION
        .decisionDigest,

    sourceDecisionPreparationId:
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION
        .sourcePreparationId,

    sourceDecisionPreparationDigest:
      CANONICAL_OWNER_SECOND_TASK_EXECUTION_DECISION
        .sourcePreparationDigest,

    sourceCandidateDecisionPreparationDigest:
      leelaDecision
        .sourceCandidateDecisionPreparationDigest,

    sourceCandidatePlanDigest:
      leelaPreparation
        .sourceCandidatePlanDigest,

    candidateDecisionDigest:
      leelaDecision
        .candidateDecisionDigest,

    taskSequence:
      2 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_SCENARIO,

    objective:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_OBJECTIVE,

    expectedEvidence:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXPECTED_EVIDENCE,

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

    syntheticDeliveryFixture:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_FIXTURE,

    deliveryCoordinationPlan:
      ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_DELIVERY_COORDINATION_PLAN,

    executionBoundary: {
      canonicalIshaanOwnerReviewBound:
        true as const,

      ishaanOwnerReviewIntegrityVerified:
        true as const,

      canonicalOwnerDecisionBound:
        true as const,

      canonicalDecisionPreparationBound:
        true as const,

      sourceCandidatePlanBound:
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

      exactLeelaSecondTaskExecuted:
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

      remainingSixAuthorizedCandidatesWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      thirdSyntheticTaskExecutionAuthorized:
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
      "AWAIT_OWNER_ENGINEERING_LEELA_SECOND_SYNTHETIC_TASK_REVIEW" as const,

    executedAt,
  };

  if (
    leelaPlan.candidatePlanDigest !==
      executionCore.sourceCandidatePlanDigest
  ) {
    throw new Error(
      "Leela second-task source plan digest is invalid.",
    );
  }

  const record =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceLeelaSecondSyntheticTaskExecution;

  validateEngineeringAIWorkforceLeelaSecondSyntheticTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_LEELA_SECOND_SYNTHETIC_TASK_EXECUTION =
  executeEngineeringAIWorkforceLeelaSecondSyntheticTask({
    executionId:
      "engineering-leela-second-synthetic-task-execution-001",

    ishaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SECOND_SYNTHETIC_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-08-02T08:05:00.000Z",
  });