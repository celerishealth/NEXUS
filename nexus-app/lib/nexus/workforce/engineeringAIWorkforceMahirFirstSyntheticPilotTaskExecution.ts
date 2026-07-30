import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-mahir-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN" as const;

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

export const ENGINEERING_AI_WORKFORCE_MAHIR_SYNTHETIC_CHAOS_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-mahir-single-failure-class-experiment-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_CHAOS_EXPERIMENT_DESIGN_INPUT",

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
      "Design one bounded non-executed synthetic failure-class experiment with strict blast-radius, rollback, tenant-isolation, emergency-pause, and owner-review controls.",

    verifiedFacts: [
      "No chaos experiment is executed against real infrastructure.",
      "The scenario is synthetic sanitized and sandbox restricted.",
      "Mahir is owner-authorized only for this first bounded synthetic chaos-engineering pilot task.",
      "Atharv's first synthetic pilot task has been reviewed by the owner.",
      "Production mutation, deployment, provider execution, customer contact, and payments remain blocked.",
      "Every pilot task must stop for immediate owner review.",
    ],

    chaosConstraints: [
      "Limit the plan to one synthetic failure class.",
      "Define exact scope, blast radius, stop conditions, rollback, and expected recovery evidence.",
      "Verify tenant isolation during the proposed degraded state.",
      "Owner emergency pause must override every experiment step.",
      "Do not execute faults or infer production readiness from this synthetic plan.",
    ],

    requiredEvidenceClasses: [
      "FAILURE_CLASS_SCOPE_EVIDENCE",
      "BLAST_RADIUS_CONTROL_EVIDENCE",
      "ROLLBACK_AND_STOP_CONDITION_EVIDENCE",
      "TENANT_ISOLATION_EVIDENCE",
      "EMERGENCY_PAUSE_EVIDENCE",
      "FALLBACK_AND_RECOVERY_EVIDENCE",
      "OWNER_REVIEW_EVIDENCE",
    ],
  });

export const ENGINEERING_AI_WORKFORCE_MAHIR_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_DRAFT =
  deepFreeze({
    draftId:
      "engineering-mahir-single-failure-class-experiment-plan-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic single failure class experiment plan",

    summary:
      "Design a non-executed chaos experiment plan using one synthetic failure class, strict blast-radius controls, explicit stop conditions, rollback, tenant-isolation checks, and owner emergency pause.",

    analysisOutcome:
      "BOUNDED_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Mahir's first synthetic pilot task is currently executable.",
      "No chaos experiment is executed against real infrastructure.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "Production mutation, deployment, provider execution, customer contact, payments, and public launch remain blocked.",
      "Owner review is mandatory immediately after this draft.",
    ],

    analysisStages: [
      {
        sequence: 1,
        stage: "CHAOS_SCOPE_CONFIRMATION",
        purpose: "Confirm canonical identities, one synthetic failure class, blocked authorities, experiment boundaries, and mandatory stop conditions.",
        requiredEvidence: [
          "Canonical Atharv owner-review decision",
          "Canonical Mahir candidate and runtime identity",
          "Controlled-shadow chaos-design evidence",
          "Clean repository state",
        ],
        exitGate: "All source identities, scope limits, and blocked authorities validate exactly.",
        reversible: true,
      },
      {
        sequence: 2,
        stage: "SINGLE_FAILURE_CLASS_DESIGN",
        purpose: "Design one non-executed synthetic failure injection with measurable expected fallback and recovery evidence.",
        requiredEvidence: [
          "One explicit failure class",
          "Expected degraded behavior",
          "Fallback and recovery evidence",
          "Tenant-isolation checks",
        ],
        exitGate: "The draft contains no multi-failure expansion and performs no environment-level execution.",
        reversible: true,
      },
      {
        sequence: 3,
        stage: "BLAST_RADIUS_AND_ROLLBACK_RECOMMENDATION",
        purpose: "Define strict blast radius, stop conditions, rollback, emergency pause, and fail-closed handling for missing evidence.",
        requiredEvidence: [
          "Blast-radius boundary",
          "Rollback sequence",
          "Stop-condition evidence",
          "Emergency-pause override",
          "Audit-integrity evidence",
        ],
        exitGate: "Every safety control is explicit and unresolved high-risk gaps remain blocked.",
        reversible: true,
      },
      {
        sequence: 4,
        stage: "OWNER_CHAOS_REVIEW",
        purpose: "Present the non-executed experiment design, residual risks, uncertainties, and safety controls while retaining every consequential decision with the owner.",
        requiredEvidence: [
          "Immutable experiment-plan summary",
          "Open risks and uncertainties",
          "Rollback and emergency-pause evidence",
          "Explicit owner decision",
        ],
        exitGate: "No experiment or next-candidate execution occurs without new explicit owner approval.",
        reversible: true,
      },
    ],

    evidenceGates: [
      "Reject stale, copied, tampered, cross-owner, cross-tenant, or identity-mismatched evidence.",
      "Permit only one synthetic failure class in this plan.",
      "Require exact blast-radius, stop-condition, rollback, tenant-isolation, and emergency-pause evidence.",
      "Keep all fault execution, provider access, repository mutation, and production authority blocked.",
      "Treat missing or inconsistent safety evidence as a blocker, not as assumed success.",
    ],

    identifiedBlockers: [
      "No chaos experiment execution authority exists.",
      "No production topology or real fault budget is supplied.",
      "No repository, provider, customer, payment, deployment, or public-launch authority exists.",
    ],

    recommendations: [
      "Limit future synthetic experiments to one failure class at a time.",
      "Define measurable expected fallback and recovery evidence.",
      "Require explicit owner approval before any environment-level execution.",
    ],

    uncertainties: [
      "No production topology is supplied.",
      "No real fault budget is approved.",
      "No live chaos authority exists.",
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

export interface CreateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly atharvOwnerReviewDecision:
    EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-mahir-v1";

  readonly employeeCode:
    "nx-engineering-006";

  readonly publicName:
    "Mahir";

  readonly officialRole:
    "AI Chaos Engineering Specialist";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-006-candidate-v1";

  readonly sourceAtharvOwnerReviewDecisionId:
    string;

  readonly sourceAtharvOwnerReviewDecisionDigest:
    string;

  readonly sourceAtharvExecutionId:
    string;

  readonly sourceAtharvExecutionDigest:
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
    6;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO;

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

  readonly syntheticChaosFixture:
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_SYNTHETIC_CHAOS_FIXTURE;

  readonly singleFailureClassExperimentPlanDraft:
    typeof ENGINEERING_AI_WORKFORCE_MAHIR_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalAtharvOwnerReviewBound:
      true;

    atharvOwnerReviewIntegrityVerified:
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

    exactMahirFirstTaskExecuted:
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

    remainingTwoAuthorizedCandidatesWaiting:
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
    "AWAIT_OWNER_ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const atharvOwnerReview =
  ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const mahirCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Mahir",
  );

const mahirShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Mahir",
    );

if (
  !mahirCandidate ||
  mahirCandidate.employeeId !==
    "candidate-mahir-v1" ||
  mahirCandidate.employeeCode !==
    "nx-engineering-006" ||
  mahirCandidate.officialRole !==
    "AI Chaos Engineering Specialist" ||
  mahirCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-006-candidate-v1" ||
  mahirCandidate.developmentSequence !==
    6 ||
  mahirCandidate.executionSequence !==
    6 ||
  mahirCandidate.taskSequence !==
    1 ||
  mahirCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  mahirCandidate.firstTaskExecutionAuthorized !==
    true ||
  mahirCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Mahir first-task candidate decision is invalid.",
  );
}

if (
  !mahirShadowExecution ||
  mahirShadowExecution.employeeId !==
    "candidate-mahir-v1" ||
  mahirShadowExecution.employeeCode !==
    "nx-engineering-006" ||
  mahirShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-006-candidate-v1" ||
  mahirShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  mahirShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  mahirShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  mahirShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  mahirShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  mahirShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  mahirShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  mahirShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  mahirShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Mahir controlled-shadow evidence is invalid.",
  );
}

const canonicalMahirCandidate =
  mahirCandidate;

const canonicalMahirShadowExecution =
  mahirShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskOwnerReviewDecision(
    atharvOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    atharvOwnerReview.decision !==
      "APPROVE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    atharvOwnerReview.mahirFirstTaskExecutionAuthorized !==
      true ||
    atharvOwnerReview.mahirFirstTaskExecutionPerformed !==
      false ||
    atharvOwnerReview.nextCandidate.employeeId !==
      canonicalMahirCandidate.employeeId ||
    atharvOwnerReview.nextCandidate.runtimeId !==
      canonicalMahirCandidate.runtimeId ||
    atharvOwnerReview.nextCandidate.executionSequence !==
      6 ||
    atharvOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    atharvOwnerReview.authorityBoundary
      .onlyMahirCurrentlyExecutable !==
        true ||
    atharvOwnerReview.authorityBoundary
      .remainingTwoAuthorizedCandidatesWaiting !==
        true ||
    atharvOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    atharvOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    atharvOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    atharvOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    atharvOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    atharvOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    atharvOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_SIX"
  ) {
    throw new Error(
      "Mahir execution requires the exact canonical approved sequence-six owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Mahir first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Mahir first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      atharvOwnerReview.tenantId ||
    record.ownerId !==
      atharvOwnerReview.ownerId ||
    record.employeeId !==
      canonicalMahirCandidate.employeeId ||
    record.employeeCode !==
      canonicalMahirCandidate.employeeCode ||
    record.publicName !==
      "Mahir" ||
    record.officialRole !==
      canonicalMahirCandidate.officialRole ||
    record.runtimeId !==
      canonicalMahirCandidate.runtimeId ||
    record.sourceAtharvOwnerReviewDecisionId !==
      atharvOwnerReview.decisionId ||
    record.sourceAtharvOwnerReviewDecisionDigest !==
      atharvOwnerReview.decisionDigest ||
    record.sourceAtharvExecutionId !==
      atharvOwnerReview.sourceExecutionId ||
    record.sourceAtharvExecutionDigest !==
      atharvOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalMahirCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalMahirShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      6 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Mahir first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(atharvOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Mahir first synthetic pilot execution cannot precede Atharv owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticChaosFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_MAHIR_SYNTHETIC_CHAOS_FIXTURE,
      ) ||
    sha256(
      record.singleFailureClassExperimentPlanDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_MAHIR_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_DRAFT,
      )
  ) {
    throw new Error(
      "Mahir first synthetic pilot reliability evidence is invalid.",
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
      "Mahir first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalAtharvOwnerReviewBound !== true ||
    boundary.atharvOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactMahirFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingTwoAuthorizedCandidatesWaiting !== true ||
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
      "Mahir first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Mahir first synthetic pilot execution next step is invalid.",
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
      "Mahir first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticChaosFixture) ||
    !Object.isFrozen(
      record.syntheticChaosFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticChaosFixture.chaosConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticChaosFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.singleFailureClassExperimentPlanDraft,
    ) ||
    !Object.isFrozen(
      record.singleFailureClassExperimentPlanDraft.analysisStages,
    ) ||
    record.singleFailureClassExperimentPlanDraft.analysisStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.singleFailureClassExperimentPlanDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.singleFailureClassExperimentPlanDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.singleFailureClassExperimentPlanDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.singleFailureClassExperimentPlanDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Mahir first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution {
  if (
    input.atharvOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Mahir first synthetic pilot execution requires the canonical Atharv owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Mahir first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Mahir first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.atharvOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Mahir first synthetic pilot execution cannot precede Atharv owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      atharvOwnerReview.tenantId,

    ownerId:
      atharvOwnerReview.ownerId,

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

    sourceAtharvOwnerReviewDecisionId:
      atharvOwnerReview.decisionId,

    sourceAtharvOwnerReviewDecisionDigest:
      atharvOwnerReview.decisionDigest,

    sourceAtharvExecutionId:
      atharvOwnerReview.sourceExecutionId,

    sourceAtharvExecutionDigest:
      atharvOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalMahirCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalMahirShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      6 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_SCENARIO,

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

    syntheticChaosFixture:
      ENGINEERING_AI_WORKFORCE_MAHIR_SYNTHETIC_CHAOS_FIXTURE,

    singleFailureClassExperimentPlanDraft:
      ENGINEERING_AI_WORKFORCE_MAHIR_SINGLE_FAILURE_CLASS_EXPERIMENT_PLAN_DRAFT,

    executionBoundary: {
      canonicalAtharvOwnerReviewBound:
        true as const,

      atharvOwnerReviewIntegrityVerified:
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

      exactMahirFirstTaskExecuted:
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

      remainingTwoAuthorizedCandidatesWaiting:
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
      "AWAIT_OWNER_ENGINEERING_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceMahirFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_MAHIR_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceMahirFirstSyntheticPilotTask({
    executionId:
      "engineering-mahir-first-synthetic-pilot-task-execution-001",

    atharvOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-25T15:48:00.000Z",
  });
