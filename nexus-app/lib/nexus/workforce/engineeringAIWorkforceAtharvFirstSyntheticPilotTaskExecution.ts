import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-atharv-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "RECOVERY_EVIDENCE_REVIEW" as const;

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

export const ENGINEERING_AI_WORKFORCE_ATHARV_SYNTHETIC_RELIABILITY_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-atharv-recovery-evidence-review-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_RELIABILITY_RECOVERY_REVIEW_INPUT",

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
      "Review bounded synthetic recovery, rollback, continuity, monitoring, emergency-pause, and fail-closed reliability evidence without touching repository, provider, customer, or production systems.",

    verifiedFacts: [
      "The exercise is sandbox only and uses synthetic sanitized evidence.",
      "Atharv is owner-authorized only for this first bounded synthetic reliability pilot task.",
      "Anaya's first synthetic pilot task has been reviewed by the owner.",
      "Emergency pause is available for every Engineering runtime.",
      "No production database, deployment, customer delivery, payment, or provider execution is permitted.",
      "Every pilot task must stop for immediate owner review.",
    ],

    reliabilityConstraints: [
      "Use one sequential candidate execution at a time.",
      "Verify recovery evidence independently from normal-path success.",
      "Bind runtime identity, tenant identity, owner identity, and immutable audit evidence.",
      "Keep missing or inconsistent recovery state fail closed.",
      "Do not infer production readiness or availability guarantees from synthetic evidence.",
    ],

    requiredEvidenceClasses: [
      "RECOVERY_EVIDENCE",
      "ROLLBACK_EVIDENCE",
      "OBSERVABILITY_EVIDENCE",
      "CONTINUITY_EVIDENCE",
      "EMERGENCY_PAUSE_EVIDENCE",
      "AUDIT_INTEGRITY_EVIDENCE",
      "OWNER_REVIEW_EVIDENCE",
    ],
  });

export const ENGINEERING_AI_WORKFORCE_ATHARV_RECOVERY_EVIDENCE_REVIEW_DRAFT =
  deepFreeze({
    draftId:
      "engineering-atharv-recovery-evidence-review-plan-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic recovery evidence review",

    summary:
      "Assess bounded failure recovery, rollback, monitoring, continuity, and emergency-pause evidence while keeping live systems and every consequential authority blocked.",

    analysisOutcome:
      "BOUNDED_RECOVERY_EVIDENCE_REVIEW_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Atharv's first synthetic pilot task is currently executable.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "Recovery evidence must be verified independently from normal-path success.",
      "No repository, production, customer, provider, financial, legal, or launch authority is granted.",
      "Owner review is mandatory immediately after this draft.",
    ],

    analysisStages: [
      {
        sequence: 1,
        stage: "RELIABILITY_SCOPE_CONFIRMATION",
        purpose: "Confirm exact synthetic scope, identities, evidence sources, blocked authorities, recovery objectives, and stop conditions.",
        requiredEvidence: [
          "Canonical Anaya owner-review decision",
          "Canonical Atharv candidate and runtime identity",
          "Controlled-shadow reliability evidence",
          "Clean repository state",
        ],
        exitGate: "All source identities, recovery scope, and blocked authorities validate exactly.",
        reversible: true,
      },
      {
        sequence: 2,
        stage: "RECOVERY_EVIDENCE_CLASSIFICATION",
        purpose: "Classify recovery, rollback, observability, continuity, emergency-pause, immutable-audit, and unsafe-replay evidence without touching live systems.",
        requiredEvidence: [
          "Independent recovery evidence",
          "Rollback and continuity evidence",
          "Monitoring and emergency-pause evidence",
          "Runtime identity and immutable audit evidence",
        ],
        exitGate: "Missing, stale, copied, tampered, or inconsistent evidence remains a fail-closed blocker.",
        reversible: true,
      },
      {
        sequence: 3,
        stage: "FAIL_CLOSED_RECOVERY_RECOMMENDATION",
        purpose: "Recommend the smallest owner-reviewed recovery and rollback validation sequence without claiming availability or production readiness.",
        requiredEvidence: [
          "Recovery-path validation",
          "Rollback validation",
          "Graceful-degradation validation",
          "Emergency-pause validation",
          "Audit-integrity validation",
        ],
        exitGate: "Every required reliability evidence class is explicit and unresolved high-risk gaps remain blocked.",
        reversible: true,
      },
      {
        sequence: 4,
        stage: "OWNER_RELIABILITY_REVIEW",
        purpose: "Present verified recovery evidence, residual reliability risks, blocked assumptions, and fail-closed recommendations while retaining every consequential decision with the owner.",
        requiredEvidence: [
          "Immutable evidence summary",
          "Open risks and uncertainties",
          "Rollback and emergency-pause evidence",
          "Explicit owner decision",
        ],
        exitGate: "No next candidate or consequential action occurs without a new explicit owner approval.",
        reversible: true,
      },
    ],

    evidenceGates: [
      "Reject stale, copied, tampered, cross-owner, cross-tenant, or identity-mismatched evidence.",
      "Verify recovery evidence independently from normal-path success.",
      "Keep recovery, rollback, observability, continuity, emergency-pause, and audit evidence independently verifiable.",
      "Require explicit recovery and rollback evidence before any future production-eligibility decision.",
      "Treat missing or inconsistent state as a blocker, not as assumed success.",
    ],

    identifiedBlockers: [
      "Repository access is not authorized.",
      "No production release, provider failover, or live availability test is authorized.",
      "No customer delivery, payment, or external execution authority exists.",
    ],

    recommendations: [
      "Require explicit recovery and rollback evidence before production eligibility.",
      "Keep fail-closed behavior for missing or inconsistent state.",
      "Verify emergency pause across every future execution stage.",
    ],

    uncertainties: [
      "No live availability objective is tested here.",
      "No production incident history is in scope.",
      "No provider failover execution is authorized.",
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

export interface CreateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly anayaOwnerReviewDecision:
    EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-atharv-v1";

  readonly employeeCode:
    "nx-engineering-005";

  readonly publicName:
    "Atharv";

  readonly officialRole:
    "AI Reliability Engineering Specialist";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-005-candidate-v1";

  readonly sourceAnayaOwnerReviewDecisionId:
    string;

  readonly sourceAnayaOwnerReviewDecisionDigest:
    string;

  readonly sourceAnayaExecutionId:
    string;

  readonly sourceAnayaExecutionDigest:
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
    5;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_SCENARIO;

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

  readonly syntheticReliabilityFixture:
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_SYNTHETIC_RELIABILITY_FIXTURE;

  readonly recoveryEvidenceReviewDraft:
    typeof ENGINEERING_AI_WORKFORCE_ATHARV_RECOVERY_EVIDENCE_REVIEW_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalAnayaOwnerReviewBound:
      true;

    anayaOwnerReviewIntegrityVerified:
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

    exactAtharvFirstTaskExecuted:
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

    remainingThreeAuthorizedCandidatesWaiting:
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
    "AWAIT_OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const anayaOwnerReview =
  ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const atharvCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Atharv",
  );

const atharvShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Atharv",
    );

if (
  !atharvCandidate ||
  atharvCandidate.employeeId !==
    "candidate-atharv-v1" ||
  atharvCandidate.employeeCode !==
    "nx-engineering-005" ||
  atharvCandidate.officialRole !==
    "AI Reliability Engineering Specialist" ||
  atharvCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-005-candidate-v1" ||
  atharvCandidate.developmentSequence !==
    5 ||
  atharvCandidate.executionSequence !==
    5 ||
  atharvCandidate.taskSequence !==
    1 ||
  atharvCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  atharvCandidate.firstTaskExecutionAuthorized !==
    true ||
  atharvCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Atharv first-task candidate decision is invalid.",
  );
}

if (
  !atharvShadowExecution ||
  atharvShadowExecution.employeeId !==
    "candidate-atharv-v1" ||
  atharvShadowExecution.employeeCode !==
    "nx-engineering-005" ||
  atharvShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-005-candidate-v1" ||
  atharvShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  atharvShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  atharvShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  atharvShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  atharvShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  atharvShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  atharvShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  atharvShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  atharvShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Atharv controlled-shadow evidence is invalid.",
  );
}

const canonicalAtharvCandidate =
  atharvCandidate;

const canonicalAtharvShadowExecution =
  atharvShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskOwnerReviewDecision(
    anayaOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    anayaOwnerReview.decision !==
      "APPROVE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    anayaOwnerReview.atharvFirstTaskExecutionAuthorized !==
      true ||
    anayaOwnerReview.atharvFirstTaskExecutionPerformed !==
      false ||
    anayaOwnerReview.nextCandidate.employeeId !==
      canonicalAtharvCandidate.employeeId ||
    anayaOwnerReview.nextCandidate.runtimeId !==
      canonicalAtharvCandidate.runtimeId ||
    anayaOwnerReview.nextCandidate.executionSequence !==
      5 ||
    anayaOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    anayaOwnerReview.authorityBoundary
      .onlyAtharvCurrentlyExecutable !==
        true ||
    anayaOwnerReview.authorityBoundary
      .remainingThreeAuthorizedCandidatesWaiting !==
        true ||
    anayaOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    anayaOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    anayaOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    anayaOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    anayaOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    anayaOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    anayaOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_FIVE"
  ) {
    throw new Error(
      "Atharv execution requires the exact canonical approved sequence-four owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Atharv first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Atharv first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      anayaOwnerReview.tenantId ||
    record.ownerId !==
      anayaOwnerReview.ownerId ||
    record.employeeId !==
      canonicalAtharvCandidate.employeeId ||
    record.employeeCode !==
      canonicalAtharvCandidate.employeeCode ||
    record.publicName !==
      "Atharv" ||
    record.officialRole !==
      canonicalAtharvCandidate.officialRole ||
    record.runtimeId !==
      canonicalAtharvCandidate.runtimeId ||
    record.sourceAnayaOwnerReviewDecisionId !==
      anayaOwnerReview.decisionId ||
    record.sourceAnayaOwnerReviewDecisionDigest !==
      anayaOwnerReview.decisionDigest ||
    record.sourceAnayaExecutionId !==
      anayaOwnerReview.sourceExecutionId ||
    record.sourceAnayaExecutionDigest !==
      anayaOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalAtharvCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalAtharvShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      5 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Atharv first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(anayaOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Atharv first synthetic pilot execution cannot precede Anaya owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticReliabilityFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ATHARV_SYNTHETIC_RELIABILITY_FIXTURE,
      ) ||
    sha256(
      record.recoveryEvidenceReviewDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ATHARV_RECOVERY_EVIDENCE_REVIEW_DRAFT,
      )
  ) {
    throw new Error(
      "Atharv first synthetic pilot reliability evidence is invalid.",
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
      "Atharv first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalAnayaOwnerReviewBound !== true ||
    boundary.anayaOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactAtharvFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingThreeAuthorizedCandidatesWaiting !== true ||
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
      "Atharv first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Atharv first synthetic pilot execution next step is invalid.",
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
      "Atharv first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticReliabilityFixture) ||
    !Object.isFrozen(
      record.syntheticReliabilityFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticReliabilityFixture.reliabilityConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticReliabilityFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.recoveryEvidenceReviewDraft,
    ) ||
    !Object.isFrozen(
      record.recoveryEvidenceReviewDraft.analysisStages,
    ) ||
    record.recoveryEvidenceReviewDraft.analysisStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.recoveryEvidenceReviewDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.recoveryEvidenceReviewDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.recoveryEvidenceReviewDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.recoveryEvidenceReviewDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Atharv first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceAtharvFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution {
  if (
    input.anayaOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Atharv first synthetic pilot execution requires the canonical Anaya owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Atharv first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Atharv first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.anayaOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Atharv first synthetic pilot execution cannot precede Anaya owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      anayaOwnerReview.tenantId,

    ownerId:
      anayaOwnerReview.ownerId,

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

    sourceAnayaOwnerReviewDecisionId:
      anayaOwnerReview.decisionId,

    sourceAnayaOwnerReviewDecisionDigest:
      anayaOwnerReview.decisionDigest,

    sourceAnayaExecutionId:
      anayaOwnerReview.sourceExecutionId,

    sourceAnayaExecutionDigest:
      anayaOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalAtharvCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalAtharvShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      5 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_SCENARIO,

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

    syntheticReliabilityFixture:
      ENGINEERING_AI_WORKFORCE_ATHARV_SYNTHETIC_RELIABILITY_FIXTURE,

    recoveryEvidenceReviewDraft:
      ENGINEERING_AI_WORKFORCE_ATHARV_RECOVERY_EVIDENCE_REVIEW_DRAFT,

    executionBoundary: {
      canonicalAnayaOwnerReviewBound:
        true as const,

      anayaOwnerReviewIntegrityVerified:
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

      exactAtharvFirstTaskExecuted:
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

      remainingThreeAuthorizedCandidatesWaiting:
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
      "AWAIT_OWNER_ENGINEERING_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceAtharvFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ATHARV_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceAtharvFirstSyntheticPilotTask({
    executionId:
      "engineering-atharv-first-synthetic-pilot-task-execution-001",

    anayaOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-25T15:46:00.000Z",
  });
