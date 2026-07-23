import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-ishaan-first-synthetic-pilot-task-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "BOUNDED_MODULAR_ARCHITECTURE_REVIEW" as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_SYNTHETIC_ARCHITECTURE_FIXTURE =
  {
    fixtureId:
      "engineering-ishaan-synthetic-architecture-fixture-001",

    systemName:
      "NEXUS Synthetic Tenant Work Coordination Service",

    objective:
      "Review and draft a bounded modular architecture for a synthetic tenant-scoped work coordination flow without accessing a repository, production system, customer record, provider, credential, or external network.",

    problemStatement:
      "A synthetic owner-supervised workflow needs clear module boundaries, tenant isolation, fail-closed authorization, immutable audit evidence, and reversible internal drafting before any implementation authority can be considered.",

    syntheticOnly:
      true,

    realCustomerDataUsed:
      false,

    repositoryEvidenceUsed:
      false,

    productionEvidenceUsed:
      false,

    modules: [
      "Tenant Command Intake",
      "Owner Authority Policy",
      "Bounded Work Planner",
      "Draft Result Store",
      "Immutable Audit Evidence",
      "Emergency Pause Coordinator",
    ],

    requiredQualityAttributes: [
      "Tenant isolation",
      "Owner-controlled authority",
      "Fail-closed behavior",
      "Deterministic audit evidence",
      "Reversible internal drafting",
      "Emergency pause support",
    ],

    constraints: [
      "Synthetic sanitized evidence only",
      "Sandbox execution only",
      "Read-only evidence interpretation",
      "Draft-only output",
      "No repository access",
      "No production mutation",
      "No customer contact",
      "No payment or legal commitment",
    ],
  } as const;

export const ENGINEERING_AI_WORKFORCE_ISHAAN_ARCHITECTURE_REVIEW_DRAFT =
  {
    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    reviewOutcome:
      "BOUNDED_MODULAR_ARCHITECTURE_RECOMMENDED",

    recommendedArchitecture:
      "MODULAR_MONOLITH_WITH_EXPLICIT_POLICY_AND_AUDIT_BOUNDARIES",

    recommendation:
      "Use a bounded modular monolith for the synthetic coordination flow. Keep tenant command intake, owner authority policy, work planning, draft storage, immutable audit evidence, and emergency pause coordination as explicit internal modules with narrow interfaces and fail-closed defaults.",

    moduleDecisions: [
      {
        module:
          "Tenant Command Intake",

        responsibility:
          "Accept only synthetic tenant-scoped commands and normalize them into an immutable internal request.",

        prohibitedAuthority:
          "No external delivery, customer contact, provider invocation, or production mutation.",
      },

      {
        module:
          "Owner Authority Policy",

        responsibility:
          "Verify the exact owner decision and deny every action that is not explicitly authorized.",

        prohibitedAuthority:
          "No inferred, inherited, or autonomous expansion of authority.",
      },

      {
        module:
          "Bounded Work Planner",

        responsibility:
          "Create one synthetic draft plan for the currently authorized task only.",

        prohibitedAuthority:
          "No concurrent candidate execution and no task-two or task-three execution.",
      },

      {
        module:
          "Draft Result Store",

        responsibility:
          "Hold the synthetic architecture review draft pending owner review.",

        prohibitedAuthority:
          "No publication, customer delivery, repository write, or production release.",
      },

      {
        module:
          "Immutable Audit Evidence",

        responsibility:
          "Record source decision identity, execution identity, boundaries, and deterministic evidence digests.",

        prohibitedAuthority:
          "No secret storage and no mutable audit replacement.",
      },

      {
        module:
          "Emergency Pause Coordinator",

        responsibility:
          "Stop the bounded pilot immediately when a boundary, integrity, or validation failure occurs.",

        prohibitedAuthority:
          "No automatic resume without a later owner-controlled decision.",
      },
    ],

    interfaceRules: [
      "Every module receives an explicit tenant and owner-bound context.",
      "Owner Authority Policy must run before any work-planning operation.",
      "Bounded Work Planner may create exactly one draft for this execution.",
      "Draft Result Store cannot expose a customer-facing delivery interface.",
      "Immutable Audit Evidence accepts append-only synthetic execution evidence.",
      "Emergency Pause Coordinator can halt the flow but cannot grant authority.",
    ],

    tenantIsolationControls: [
      "Tenant identity is bound to the canonical owner decision.",
      "Cross-tenant reads and writes are prohibited.",
      "No shared customer context is available to this synthetic execution.",
      "Every future persistence interface must require explicit tenant scope.",
    ],

    identifiedRisks: [
      {
        risk:
          "Module boundaries become naming-only abstractions.",

        mitigation:
          "Require narrow typed interfaces and prohibit direct cross-module state mutation.",
      },

      {
        risk:
          "Authority checks are bypassed by internal callers.",

        mitigation:
          "Make owner policy verification a required entry gate and fail closed on missing evidence.",
      },

      {
        risk:
          "Audit evidence diverges from execution state.",

        mitigation:
          "Bind deterministic execution digests to the exact source decision and immutable result.",
      },

      {
        risk:
          "A synthetic draft is mistaken for production approval.",

        mitigation:
          "Keep repository, deployment, customer, payment, provider, and launch authority explicitly false.",
      },
    ],

    rollbackPlan: [
      "Discard the synthetic draft if owner review rejects the architecture recommendation.",
      "Retain immutable execution evidence showing the rejected or superseded draft.",
      "Do not authorize the next candidate until a separate owner review decision is recorded.",
      "Use emergency pause on any integrity, tenant-boundary, or authorization mismatch.",
    ],

    assumptionsMade:
      false,

    unsupportedClaimsIncluded:
      false,

    ownerDecisionMade:
      false,

    implementationPrepared:
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

export interface CreateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly ownerFirstTaskExecutionDecision:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    string;

  readonly employeeCode:
    string;

  readonly publicName:
    "Ishaan";

  readonly officialRole:
    string;

  readonly runtimeId:
    string;

  readonly ownerFirstTaskExecutionDecisionId:
    string;

  readonly ownerFirstTaskExecutionDecisionDigest:
    string;

  readonly sourcePreparationId:
    string;

  readonly sourcePreparationDigest:
    string;

  readonly candidateDecisionDigest:
    string;

  readonly taskSequence:
    1;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO;

  readonly pilotTask: Readonly<{
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

    maximumTaskCount:
      3;

    executedTaskCount:
      1;

    remainingTaskCapacity:
      2;

    concurrentTaskLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_PILOT_TASK";
  }>;

  readonly syntheticArchitectureFixture:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_SYNTHETIC_ARCHITECTURE_FIXTURE;

  readonly architectureReviewDraft:
    typeof ENGINEERING_AI_WORKFORCE_ISHAAN_ARCHITECTURE_REVIEW_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalOwnerDecisionBound:
      true;

    ownerDecisionIntegrityVerified:
      true;

    canonicalPilotPreparationBound:
      true;

    candidateDecisionBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    employeeIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    approvalBypassAllowed:
      false;

    exactIshaanFirstTaskExecuted:
      true;

    syntheticPilotTaskExecutionPerformed:
      true;

    taskExecutorInvocationCount:
      1;

    pilotDraftCreated:
      true;

    pilotCompleted:
      false;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

    ownerReviewRequiredImmediately:
      true;

    nextCandidateExecutionAuthorized:
      false;

    remainingSevenAuthorizedCandidatesWaiting:
      true;

    concurrentCandidateExecutionAuthorized:
      false;

    secondSyntheticPilotTaskExecutionAuthorized:
      false;

    thirdSyntheticPilotTaskExecutionAuthorized:
      false;

    repositoryReadPerformed:
      false;

    repositoryReadAuthorized:
      false;

    repositoryWritePerformed:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    secretsAccessPerformed:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataUsed:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactPerformed:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryPrepared:
      false;

    externalDeliveryExecuted:
      false;

    externalDeliveryAuthorized:
      false;

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

    paymentExecutionPerformed:
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

  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

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
      "Unsupported deterministic Ishaan first synthetic pilot execution value.",
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

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
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
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function validateCanonicalOwnerDecision(): void {
  const decision =
    ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    decision,
  );

  const ishaan =
    decision.candidateDecisions[0];

  if (
    !ishaan ||
    decision.candidateDecisions.length !==
      8 ||
    decision.aggregateSummary
      .approvedFirstTaskCount !==
        8 ||
    decision.aggregateSummary
      .firstTaskExecutionAuthorizedCount !==
        8 ||
    decision.aggregateSummary
      .firstTaskExecutionPerformedCount !==
        0 ||
    decision.aggregateSummary
      .currentlyExecutableCandidateCount !==
        1 ||
    decision.aggregateSummary
      .pendingAuthorizedCandidateCount !==
        7 ||
    decision.authorityBoundary
      .aggregateConcurrentExecutionLimit !==
        1 ||
    decision.authorityBoundary
      .stopAfterEveryTaskForOwnerReview !==
        true ||
    ishaan.developmentSequence !==
      1 ||
    ishaan.executionSequence !==
      1 ||
    ishaan.publicName !==
      "Ishaan" ||
    ishaan.taskSequence !==
      1 ||
    ishaan.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    ishaan.firstTaskExecutionAuthorized !==
      true ||
    ishaan.firstTaskExecutionPerformed !==
      false ||
    ishaan.currentlyExecutable !==
      true ||
    ishaan.waitingForPriorCandidateOwnerReview !==
      false ||
    decision.candidateDecisions
      .slice(1)
      .some(
        (candidate) =>
          candidate.currentlyExecutable !==
            false ||
          candidate.waitingForPriorCandidateOwnerReview !==
            true ||
          candidate.firstTaskExecutionPerformed !==
            false,
      ) ||
    decision.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    decision.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    decision.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    decision.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    decision.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    decision.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    decision.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_ONE"
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution requires the exact canonical approved sequence-one decision.",
    );
  }
}

export function validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalOwnerDecision();

  requireIdentifier(
    "Ishaan first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Ishaan first synthetic pilot execution time",
    record.executedAt,
  );

  requireDigest(
    "Ishaan first synthetic pilot execution digest",
    record.executionDigest,
  );

  const decision =
    ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

  const ishaan =
    decision.candidateDecisions[0];

  if (!ishaan) {
    throw new Error(
      "Canonical Ishaan first-task decision is missing.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      decision.tenantId ||
    record.ownerId !==
      decision.ownerId ||
    record.employeeId !==
      ishaan.employeeId ||
    record.employeeCode !==
      ishaan.employeeCode ||
    record.publicName !==
      "Ishaan" ||
    record.officialRole !==
      ishaan.officialRole ||
    record.runtimeId !==
      ishaan.runtimeId ||
    record.ownerFirstTaskExecutionDecisionId !==
      decision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      decision.decisionDigest ||
    record.sourcePreparationId !==
      decision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      decision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      ishaan.candidateDecisionDigest ||
    record.taskSequence !==
      1 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution source binding is invalid.",
    );
  }

  const pilotTask =
    record.pilotTask;

  if (
    pilotTask.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilotTask.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    pilotTask.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    pilotTask.executionMode !==
      "SANDBOX_ONLY" ||
    pilotTask.evidenceToolMode !==
      "READ_ONLY" ||
    pilotTask.draftToolMode !==
      "DRAFT_ONLY" ||
    pilotTask.maximumTaskCount !==
      3 ||
    pilotTask.executedTaskCount !==
      1 ||
    pilotTask.remainingTaskCapacity !==
      2 ||
    pilotTask.concurrentTaskLimit !==
      1 ||
    pilotTask.failureThreshold !==
      1 ||
    pilotTask.ownerReviewFrequency !==
      "AFTER_EVERY_PILOT_TASK"
  ) {
    throw new Error(
      "Ishaan first synthetic pilot task contract is invalid.",
    );
  }

  if (
    stableStringify(
      record.syntheticArchitectureFixture,
    ) !==
      stableStringify(
        ENGINEERING_AI_WORKFORCE_ISHAAN_SYNTHETIC_ARCHITECTURE_FIXTURE,
      ) ||
    stableStringify(
      record.architectureReviewDraft,
    ) !==
      stableStringify(
        ENGINEERING_AI_WORKFORCE_ISHAAN_ARCHITECTURE_REVIEW_DRAFT,
      )
  ) {
    throw new Error(
      "Ishaan synthetic architecture evidence or review draft is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalOwnerDecisionBound !==
      true ||
    boundary.ownerDecisionIntegrityVerified !==
      true ||
    boundary.canonicalPilotPreparationBound !==
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
    boundary.exactIshaanFirstTaskExecuted !==
      true ||
    boundary.syntheticPilotTaskExecutionPerformed !==
      true ||
    boundary.taskExecutorInvocationCount !==
      1 ||
    boundary.pilotDraftCreated !==
      true ||
    boundary.pilotCompleted !==
      false ||
    boundary.ownerDecisionMade !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerReviewRequiredImmediately !==
      true ||
    boundary.nextCandidateExecutionAuthorized !==
      false ||
    boundary.remainingSevenAuthorizedCandidatesWaiting !==
      true ||
    boundary.concurrentCandidateExecutionAuthorized !==
      false ||
    boundary.secondSyntheticPilotTaskExecutionAuthorized !==
      false ||
    boundary.thirdSyntheticPilotTaskExecutionAuthorized !==
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
    boundary.mergeAuthorized !==
      false ||
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
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution cannot precede owner approval.",
    );
  }

  const {
    executionDigest,
    ...recordCore
  } = record;

  if (
    sha256(recordCore) !==
      executionDigest
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution integrity verification failed.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture.modules,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture.requiredQualityAttributes,
    ) ||
    !Object.isFrozen(
      record.syntheticArchitectureFixture.constraints,
    ) ||
    !Object.isFrozen(
      record.architectureReviewDraft,
    ) ||
    !Object.isFrozen(
      record.architectureReviewDraft.moduleDecisions,
    ) ||
    record.architectureReviewDraft.moduleDecisions.some(
      (entry) =>
        !Object.isFrozen(entry),
    ) ||
    !Object.isFrozen(
      record.architectureReviewDraft.interfaceRules,
    ) ||
    !Object.isFrozen(
      record.architectureReviewDraft.tenantIsolationControls,
    ) ||
    !Object.isFrozen(
      record.architectureReviewDraft.identifiedRisks,
    ) ||
    record.architectureReviewDraft.identifiedRisks.some(
      (entry) =>
        !Object.isFrozen(entry),
    ) ||
    !Object.isFrozen(
      record.architectureReviewDraft.rollbackPlan,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution {
  if (
    input.ownerFirstTaskExecutionDecision !==
      ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution requires the canonical owner first-task execution decision.",
    );
  }

  validateCanonicalOwnerDecision();

  requireIdentifier(
    "Ishaan first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Ishaan first synthetic pilot execution time",
    input.executedAt,
  );

  const decision =
    input.ownerFirstTaskExecutionDecision;

  const ishaan =
    decision.candidateDecisions[0];

  if (!ishaan) {
    throw new Error(
      "Canonical Ishaan first-task decision is missing.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Ishaan first synthetic pilot execution cannot precede owner approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    employeeId:
      ishaan.employeeId,

    employeeCode:
      ishaan.employeeCode,

    publicName:
      "Ishaan" as const,

    officialRole:
      ishaan.officialRole,

    runtimeId:
      ishaan.runtimeId,

    ownerFirstTaskExecutionDecisionId:
      decision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      decision.decisionDigest,

    sourcePreparationId:
      decision.sourcePreparationId,

    sourcePreparationDigest:
      decision.sourcePreparationDigest,

    candidateDecisionDigest:
      ishaan.candidateDecisionDigest,

    taskSequence:
      1 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_SCENARIO,

    pilotTask: {
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

      maximumTaskCount:
        3 as const,

      executedTaskCount:
        1 as const,

      remainingTaskCapacity:
        2 as const,

      concurrentTaskLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_PILOT_TASK" as const,
    },

    syntheticArchitectureFixture:
      ENGINEERING_AI_WORKFORCE_ISHAAN_SYNTHETIC_ARCHITECTURE_FIXTURE,

    architectureReviewDraft:
      ENGINEERING_AI_WORKFORCE_ISHAAN_ARCHITECTURE_REVIEW_DRAFT,

    executionBoundary: {
      canonicalOwnerDecisionBound:
        true as const,

      ownerDecisionIntegrityVerified:
        true as const,

      canonicalPilotPreparationBound:
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

      exactIshaanFirstTaskExecuted:
        true as const,

      syntheticPilotTaskExecutionPerformed:
        true as const,

      taskExecutorInvocationCount:
        1 as const,

      pilotDraftCreated:
        true as const,

      pilotCompleted:
        false as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      ownerReviewRequiredImmediately:
        true as const,

      nextCandidateExecutionAuthorized:
        false as const,

      remainingSevenAuthorizedCandidatesWaiting:
        true as const,

      concurrentCandidateExecutionAuthorized:
        false as const,

      secondSyntheticPilotTaskExecutionAuthorized:
        false as const,

      thirdSyntheticPilotTaskExecutionAuthorized:
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
      "AWAIT_OWNER_ENGINEERING_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceIshaanFirstSyntheticPilotTask({
    executionId:
      "engineering-ishaan-first-synthetic-pilot-task-execution-001",

    ownerFirstTaskExecutionDecision:
      ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,

    executedAt:
      "2026-07-23T17:46:08.866Z",
  });
