import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-leela-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "EVIDENCE_GATED_DELIVERY_PLAN" as const;

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

export const ENGINEERING_AI_WORKFORCE_LEELA_SYNTHETIC_DELIVERY_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-leela-evidence-gated-delivery-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_ENGINEERING_DELIVERY_INPUT",

    syntheticOnly:
      true,

    realCustomerDataUsed:
      false,

    crossTenantContextUsed:
      false,

    repositoryEvidenceUsed:
      false,

    productionEvidenceUsed:
      false,

    objective:
      "Prepare a bounded internal engineering delivery plan that separates preparation, execution, verification, owner review, and release authority.",

    verifiedFacts: [
      "The exercise uses synthetic sanitized planning inputs only.",
      "Leela is owner-authorized only for this first bounded synthetic pilot task.",
      "Ishaan's first synthetic pilot task has been reviewed by the owner.",
      "Repository access, merge, deployment, customer delivery, payments, and public launch remain blocked.",
      "Every pilot task must stop for immediate owner review.",
    ],

    deliveryConstraints: [
      "Use one sequential candidate execution at a time.",
      "Require evidence before every consequential transition.",
      "Keep every stage reversible and fail closed.",
      "Separate test, typecheck, build, security, recovery, and owner-decision evidence.",
      "Do not infer production readiness from synthetic evidence.",
    ],

    requiredEvidenceClasses: [
      "TARGETED_TEST_EVIDENCE",
      "FULL_REGRESSION_EVIDENCE",
      "TYPESCRIPT_EVIDENCE",
      "PRODUCTION_BUILD_EVIDENCE",
      "SECURITY_BOUNDARY_EVIDENCE",
      "ROLLBACK_AND_RECOVERY_EVIDENCE",
      "OWNER_REVIEW_EVIDENCE",
    ],
  });

export const ENGINEERING_AI_WORKFORCE_LEELA_EVIDENCE_GATED_DELIVERY_PLAN_DRAFT =
  deepFreeze({
    draftId:
      "engineering-leela-evidence-gated-delivery-plan-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic evidence-gated engineering delivery plan",

    summary:
      "Use reversible internal stages with explicit evidence gates and owner-controlled authority boundaries before any later implementation or release decision.",

    planOutcome:
      "BOUNDED_EVIDENCE_GATED_DELIVERY_PLAN_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Leela's first synthetic pilot task is currently executable.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "No repository, production, customer, provider, financial, legal, or launch authority is granted.",
      "Owner review is mandatory immediately after this draft.",
    ],

    deliveryStages: [
      {
        sequence:
          1,

        stage:
          "SCOPE_AND_BOUNDARY_CONFIRMATION",

        purpose:
          "Confirm exact synthetic scope, identities, authority limits, and stop conditions.",

        requiredEvidence: [
          "Canonical owner-review decision",
          "Canonical candidate and runtime identity",
          "Clean repository state",
        ],

        exitGate:
          "All source identities and blocked authorities validate exactly.",

        reversible:
          true,
      },
      {
        sequence:
          2,

        stage:
          "BOUNDED_IMPLEMENTATION_PREPARATION",

        purpose:
          "Prepare only the smallest internal change set after a separately approved future owner decision.",

        requiredEvidence: [
          "Explicit owner scope approval",
          "Dependency and tenant-isolation review",
          "Rollback plan",
        ],

        exitGate:
          "No implementation begins without separately granted repository authority.",

        reversible:
          true,
      },
      {
        sequence:
          3,

        stage:
          "INDEPENDENT_VERIFICATION",

        purpose:
          "Collect targeted, regression, type, build, security, and recovery evidence as distinct checks.",

        requiredEvidence: [
          "Targeted tests",
          "Full regression",
          "TypeScript validation",
          "Production build",
          "Security boundary validation",
          "Recovery and rollback validation",
        ],

        exitGate:
          "Every required evidence class passes with no unresolved high-risk defect.",

        reversible:
          true,
      },
      {
        sequence:
          4,

        stage:
          "OWNER_RELEASE_DECISION",

        purpose:
          "Present evidence and retain final merge, deployment, delivery, and launch authority with the owner.",

        requiredEvidence: [
          "Immutable evidence summary",
          "Open risks and uncertainties",
          "Rollback readiness",
          "Explicit owner decision",
        ],

        exitGate:
          "No consequential action occurs without a new explicit owner approval.",

        reversible:
          true,
      },
    ],

    evidenceGates: [
      "Reject stale, copied, tampered, cross-owner, or cross-tenant evidence.",
      "Stop when repository state differs from the approved bounded scope.",
      "Keep targeted tests, full regression, typecheck, build, and direct contract verification separate.",
      "Require rollback and recovery evidence before any future production-eligibility decision.",
      "Treat missing evidence as a blocker, not as assumed success.",
    ],

    identifiedBlockers: [
      "Repository access is not authorized.",
      "No production release scope is authorized.",
      "No customer delivery or live-provider authority exists.",
    ],

    recommendations: [
      "Use preparation, execution, verification, review, and approval as separate milestones.",
      "Require a clean repository and immutable evidence at every future code milestone.",
      "Retain owner authority over scope, repository actions, merge, deployment, delivery, payments, and release.",
    ],

    uncertainties: [
      "No real delivery date is authorized.",
      "No external dependency commitment is approved.",
      "No production readiness conclusion can be drawn from this synthetic task.",
    ],

    assumptionsMade:
      false,

    unsupportedClaimsIncluded:
      false,

    urgencyExaggerated:
      false,

    guaranteeMade:
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
  });

export interface CreateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly ishaanOwnerReviewDecision:
    EngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-leela-v1";

  readonly employeeCode:
    "nx-engineering-002";

  readonly publicName:
    "Leela";

  readonly officialRole:
    "AI Software Engineering Director";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-002-candidate-v1";

  readonly sourceIshaanOwnerReviewDecisionId:
    string;

  readonly sourceIshaanOwnerReviewDecisionDigest:
    string;

  readonly sourceIshaanExecutionId:
    string;

  readonly sourceIshaanExecutionDigest:
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

  readonly sourceControlledShadowExecutionDigest:
    string;

  readonly taskSequence:
    1;

  readonly executionSequence:
    2;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO;

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

  readonly syntheticDeliveryFixture:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_SYNTHETIC_DELIVERY_FIXTURE;

  readonly evidenceGatedDeliveryPlanDraft:
    typeof ENGINEERING_AI_WORKFORCE_LEELA_EVIDENCE_GATED_DELIVERY_PLAN_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalIshaanOwnerReviewBound:
      true;

    ishaanOwnerReviewIntegrityVerified:
      true;

    canonicalOwnerFirstTaskDecisionBound:
      true;

    canonicalPilotPreparationBound:
      true;

    candidateDecisionBound:
      true;

    controlledShadowEvidenceBound:
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

    exactLeelaFirstTaskExecuted:
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

    remainingSixAuthorizedCandidatesWaiting:
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
    "AWAIT_OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const ishaanOwnerReview =
  ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const leelaCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Leela",
  );

const leelaShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Leela",
    );

if (
  !leelaCandidate ||
  leelaCandidate.employeeId !==
    "candidate-leela-v1" ||
  leelaCandidate.employeeCode !==
    "nx-engineering-002" ||
  leelaCandidate.officialRole !==
    "AI Software Engineering Director" ||
  leelaCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-002-candidate-v1" ||
  leelaCandidate.executionSequence !==
    2 ||
  leelaCandidate.taskSequence !==
    1 ||
  leelaCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  leelaCandidate.firstTaskExecutionAuthorized !==
    true ||
  leelaCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Leela first-task candidate decision is invalid.",
  );
}

if (
  !leelaShadowExecution ||
  leelaShadowExecution.employeeId !==
    "candidate-leela-v1" ||
  leelaShadowExecution.employeeCode !==
    "nx-engineering-002" ||
  leelaShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-002-candidate-v1" ||
  leelaShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  leelaShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  leelaShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  leelaShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  leelaShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  leelaShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  leelaShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  leelaShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  leelaShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Leela controlled-shadow evidence is invalid.",
  );
}

const canonicalLeelaCandidate =
  leelaCandidate;

const canonicalLeelaShadowExecution =
  leelaShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceIshaanFirstSyntheticPilotTaskOwnerReviewDecision(
    ishaanOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    ishaanOwnerReview.decision !==
      "APPROVE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    ishaanOwnerReview.leelaFirstTaskExecutionAuthorized !==
      true ||
    ishaanOwnerReview.leelaFirstTaskExecutionPerformed !==
      false ||
    ishaanOwnerReview.nextCandidate.employeeId !==
      canonicalLeelaCandidate.employeeId ||
    ishaanOwnerReview.nextCandidate.runtimeId !==
      canonicalLeelaCandidate.runtimeId ||
    ishaanOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    ishaanOwnerReview.authorityBoundary
      .onlyLeelaCurrentlyExecutable !==
        true ||
    ishaanOwnerReview.authorityBoundary
      .remainingSixAuthorizedCandidatesWaiting !==
        true ||
    ishaanOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    ishaanOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    ishaanOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    ishaanOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    ishaanOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    ishaanOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    ishaanOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_TWO"
  ) {
    throw new Error(
      "Leela execution requires the exact canonical approved sequence-two owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Leela first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Leela first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      ishaanOwnerReview.tenantId ||
    record.ownerId !==
      ishaanOwnerReview.ownerId ||
    record.employeeId !==
      canonicalLeelaCandidate.employeeId ||
    record.employeeCode !==
      canonicalLeelaCandidate.employeeCode ||
    record.publicName !==
      "Leela" ||
    record.officialRole !==
      canonicalLeelaCandidate.officialRole ||
    record.runtimeId !==
      canonicalLeelaCandidate.runtimeId ||
    record.sourceIshaanOwnerReviewDecisionId !==
      ishaanOwnerReview.decisionId ||
    record.sourceIshaanOwnerReviewDecisionDigest !==
      ishaanOwnerReview.decisionDigest ||
    record.sourceIshaanExecutionId !==
      ishaanOwnerReview.sourceExecutionId ||
    record.sourceIshaanExecutionDigest !==
      ishaanOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalLeelaCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalLeelaShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      2 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Leela first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(ishaanOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Leela first synthetic pilot execution cannot precede Ishaan owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticDeliveryFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_LEELA_SYNTHETIC_DELIVERY_FIXTURE,
      ) ||
    sha256(
      record.evidenceGatedDeliveryPlanDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_LEELA_EVIDENCE_GATED_DELIVERY_PLAN_DRAFT,
      )
  ) {
    throw new Error(
      "Leela first synthetic pilot delivery evidence is invalid.",
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
      "Leela first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalIshaanOwnerReviewBound !== true ||
    boundary.ishaanOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactLeelaFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingSixAuthorizedCandidatesWaiting !== true ||
    boundary.concurrentCandidateExecutionAuthorized !== false ||
    boundary.secondSyntheticPilotTaskExecutionAuthorized !== false ||
    boundary.thirdSyntheticPilotTaskExecutionAuthorized !== false ||
    boundary.repositoryReadPerformed !== false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWritePerformed !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.branchCreationAuthorized !== false ||
    boundary.pullRequestPreparationAuthorized !== false ||
    boundary.mergeAuthorized !== false ||
    boundary.secretsAccessPerformed !== false ||
    boundary.secretsAccessAuthorized !== false ||
    boundary.realCustomerDataUsed !== false ||
    boundary.realCustomerDataAccessAuthorized !== false ||
    boundary.realCustomerContactPerformed !== false ||
    boundary.realCustomerContactAuthorized !== false ||
    boundary.externalDeliveryPrepared !== false ||
    boundary.externalDeliveryExecuted !== false ||
    boundary.externalDeliveryAuthorized !== false ||
    boundary.liveProviderExecutionAuthorized !== false ||
    boundary.productionDatabaseAccessPerformed !== false ||
    boundary.productionDatabaseAuthorized !== false ||
    boundary.productionMutationPerformed !== false ||
    boundary.productionMutationAuthorized !== false ||
    boundary.productionDeploymentPrepared !== false ||
    boundary.productionDeploymentExecuted !== false ||
    boundary.productionDeploymentAuthorized !== false ||
    boundary.paymentExecutionPerformed !== false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.financialCommitmentAuthorized !== false ||
    boundary.legalCommitmentAuthorized !== false ||
    boundary.autonomousDecisionAuthorized !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.monitoringRequired !== true ||
    boundary.emergencyPauseAvailable !== true
  ) {
    throw new Error(
      "Leela first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Leela first synthetic pilot execution next step is invalid.",
    );
  }

  const {
    executionDigest,
    ...recordCore
  } = record;

  if (
    executionDigest !==
      sha256(recordCore)
  ) {
    throw new Error(
      "Leela first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticDeliveryFixture) ||
    !Object.isFrozen(
      record.syntheticDeliveryFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticDeliveryFixture.deliveryConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticDeliveryFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.evidenceGatedDeliveryPlanDraft,
    ) ||
    !Object.isFrozen(
      record.evidenceGatedDeliveryPlanDraft.deliveryStages,
    ) ||
    record.evidenceGatedDeliveryPlanDraft.deliveryStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.evidenceGatedDeliveryPlanDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.evidenceGatedDeliveryPlanDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.evidenceGatedDeliveryPlanDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.evidenceGatedDeliveryPlanDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Leela first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution {
  if (
    input.ishaanOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Leela first synthetic pilot execution requires the canonical Ishaan owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Leela first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Leela first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.ishaanOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Leela first synthetic pilot execution cannot precede Ishaan owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      ishaanOwnerReview.tenantId,

    ownerId:
      ishaanOwnerReview.ownerId,

    employeeId:
      "candidate-leela-v1" as const,

    employeeCode:
      "nx-engineering-002" as const,

    publicName:
      "Leela" as const,

    officialRole:
      "AI Software Engineering Director" as const,

    runtimeId:
      "runtime-engineering-nx-engineering-002-candidate-v1" as const,

    sourceIshaanOwnerReviewDecisionId:
      ishaanOwnerReview.decisionId,

    sourceIshaanOwnerReviewDecisionDigest:
      ishaanOwnerReview.decisionDigest,

    sourceIshaanExecutionId:
      ishaanOwnerReview.sourceExecutionId,

    sourceIshaanExecutionDigest:
      ishaanOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalLeelaCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalLeelaShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      2 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_SCENARIO,

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

    syntheticDeliveryFixture:
      ENGINEERING_AI_WORKFORCE_LEELA_SYNTHETIC_DELIVERY_FIXTURE,

    evidenceGatedDeliveryPlanDraft:
      ENGINEERING_AI_WORKFORCE_LEELA_EVIDENCE_GATED_DELIVERY_PLAN_DRAFT,

    executionBoundary: {
      canonicalIshaanOwnerReviewBound:
        true as const,

      ishaanOwnerReviewIntegrityVerified:
        true as const,

      canonicalOwnerFirstTaskDecisionBound:
        true as const,

      canonicalPilotPreparationBound:
        true as const,

      candidateDecisionBound:
        true as const,

      controlledShadowEvidenceBound:
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

      exactLeelaFirstTaskExecuted:
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

      remainingSixAuthorizedCandidatesWaiting:
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
      "AWAIT_OWNER_ENGINEERING_LEELA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceLeelaFirstSyntheticPilotTask({
    executionId:
      "engineering-leela-first-synthetic-pilot-task-execution-001",

    ishaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ISHAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-24T02:20:00.000Z",
  });
