import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-anaya-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "AUTHORITY_ESCALATION_THREAT_REVIEW" as const;

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

export const ENGINEERING_AI_WORKFORCE_ANAYA_SYNTHETIC_SECURITY_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-anaya-authority-escalation-threat-review-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_SECURITY_THREAT_REVIEW_INPUT",

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
      "Review bounded synthetic authority-escalation threats, verify owner-control and tenant-isolation boundaries, classify security risk, and recommend fail-closed mitigation without modifying repository or production state.",

    verifiedFacts: [
      "The exercise uses synthetic sanitized planning inputs only.",
      "Anaya is owner-authorized only for this first bounded synthetic pilot task.",
      "Vivaan's first synthetic pilot task has been reviewed by the owner.",
      "Repository access, merge, deployment, customer delivery, payments, and public launch remain blocked.",
      "Every pilot task must stop for immediate owner review.",
    ],

    securityConstraints: [
      "Use one sequential candidate execution at a time.",
      "Require direct evidence before every authority, tenant-isolation, secret-handling, and audit-integrity conclusion.",
      "Keep every recommendation non-executing, reversible, and fail closed.",
      "Separate authority-boundary, tenant-isolation, secret-handling, audit-integrity, recovery, and owner-decision evidence.",
      "Do not infer production readiness from synthetic evidence.",
    ],

    requiredEvidenceClasses: [
      "AUTHORITY_BOUNDARY_EVIDENCE",
      "CROSS_TENANT_ISOLATION_EVIDENCE",
      "SECRET_HANDLING_EVIDENCE",
      "AUDIT_INTEGRITY_EVIDENCE",
      "SECURITY_BOUNDARY_EVIDENCE",
      "ROLLBACK_AND_RECOVERY_EVIDENCE",
      "OWNER_REVIEW_EVIDENCE",
    ],
  });

export const ENGINEERING_AI_WORKFORCE_ANAYA_AUTHORITY_ESCALATION_THREAT_REVIEW_DRAFT =
  deepFreeze({
    draftId:
      "engineering-anaya-authority-escalation-threat-review-plan-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic authority escalation threat review",

    summary:
      "Identify authority-escalation, owner-control bypass, cross-tenant access, secret-exposure, and audit-tampering threats, then recommend the smallest owner-reviewed fail-closed response without claiming production readiness.",

    analysisOutcome:
      "BOUNDED_AUTHORITY_ESCALATION_THREAT_REVIEW_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Anaya's first synthetic pilot task is currently executable.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "No repository, production, customer, provider, financial, legal, or launch authority is granted.",
      "Owner review is mandatory immediately after this draft.",
    ],

    analysisStages: [
      {
        sequence:
          1,

        stage:
          "AUTHORITY_BOUNDARY_CONFIRMATION",

        purpose:
          "Confirm exact synthetic scope, evidence sources, identities, authority limits, and stop conditions.",

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
          "AUTHORITY_ESCALATION_THREAT_CLASSIFICATION",

        purpose:
          "Classify unauthorized privilege escalation, owner-control bypass, cross-tenant access, secret exposure, and audit tampering threats without changing code or systems.",

        requiredEvidence: [
          "Explicit owner authority boundary",
          "Tenant-isolation and identity-binding evidence",
          "Secret-handling, audit-integrity, and rollback evidence",
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
          "FAIL_CLOSED_SECURITY_RECOMMENDATION",

        purpose:
          "Recommend the smallest fail-closed validation sequence across authority control, tenant isolation, secret handling, audit integrity, rollback, and recovery.",

        requiredEvidence: [
          "Authority-boundary validation",
          "Cross-tenant isolation validation",
          "Secret-handling validation",
          "Audit-integrity validation",
          "Security boundary validation",
          "Recovery and rollback validation",
        ],

        exitGate:
          "Every required security evidence class passes with no unresolved high-risk threat.",

        reversible:
          true,
      },
      {
        sequence:
          4,

        stage:
          "OWNER_SECURITY_REVIEW",

        purpose:
          "Present verified authority threats, boundary failures, residual security risks, and fail-closed recommendations while retaining every consequential decision with the owner.",

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
      "Keep authority, tenant-isolation, secret-handling, audit-integrity, recovery, and direct contract evidence independently verifiable.",
      "Require rollback and recovery evidence before any future production-eligibility decision.",
      "Treat missing evidence as a blocker, not as assumed success.",
    ],

    identifiedBlockers: [
      "Repository access is not authorized.",
      "No production release scope is authorized.",
      "No customer delivery or live-provider authority exists.",
    ],

    recommendations: [
      "Keep authority verification, threat classification, fail-closed recommendation, and owner review as separate milestones.",
      "Require exact outputs, immutable evidence, and clean repository state before accepting any security conclusion.",
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

export interface CreateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly vivaanOwnerReviewDecision:
    EngineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-anaya-v1";

  readonly employeeCode:
    "nx-engineering-004";

  readonly publicName:
    "Anaya";

  readonly officialRole:
    "AI Security Engineering Director";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-004-candidate-v1";

  readonly sourceVivaanOwnerReviewDecisionId:
    string;

  readonly sourceVivaanOwnerReviewDecisionDigest:
    string;

  readonly sourceVivaanExecutionId:
    string;

  readonly sourceVivaanExecutionDigest:
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
    4;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO;

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

  readonly syntheticSecurityFixture:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_SYNTHETIC_SECURITY_FIXTURE;

  readonly authorityEscalationThreatReviewDraft:
    typeof ENGINEERING_AI_WORKFORCE_ANAYA_AUTHORITY_ESCALATION_THREAT_REVIEW_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalVivaanOwnerReviewBound:
      true;

    vivaanOwnerReviewIntegrityVerified:
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

    exactAnayaFirstTaskExecuted:
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

    remainingFourAuthorizedCandidatesWaiting:
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
    "AWAIT_OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const vivaanOwnerReview =
  ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const anayaCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Anaya",
  );

const anayaShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Anaya",
    );

if (
  !anayaCandidate ||
  anayaCandidate.employeeId !==
    "candidate-anaya-v1" ||
  anayaCandidate.employeeCode !==
    "nx-engineering-004" ||
  anayaCandidate.officialRole !==
    "AI Security Engineering Director" ||
  anayaCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-004-candidate-v1" ||
  anayaCandidate.developmentSequence !==
    4 ||
  anayaCandidate.executionSequence !==
    4 ||
  anayaCandidate.taskSequence !==
    1 ||
  anayaCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  anayaCandidate.firstTaskExecutionAuthorized !==
    true ||
  anayaCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Anaya first-task candidate decision is invalid.",
  );
}

if (
  !anayaShadowExecution ||
  anayaShadowExecution.employeeId !==
    "candidate-anaya-v1" ||
  anayaShadowExecution.employeeCode !==
    "nx-engineering-004" ||
  anayaShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-004-candidate-v1" ||
  anayaShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  anayaShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  anayaShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  anayaShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  anayaShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  anayaShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  anayaShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  anayaShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  anayaShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Anaya controlled-shadow evidence is invalid.",
  );
}

const canonicalAnayaCandidate =
  anayaCandidate;

const canonicalAnayaShadowExecution =
  anayaShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskOwnerReviewDecision(
    vivaanOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    vivaanOwnerReview.decision !==
      "APPROVE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    vivaanOwnerReview.anayaFirstTaskExecutionAuthorized !==
      true ||
    vivaanOwnerReview.anayaFirstTaskExecutionPerformed !==
      false ||
    vivaanOwnerReview.nextCandidate.employeeId !==
      canonicalAnayaCandidate.employeeId ||
    vivaanOwnerReview.nextCandidate.runtimeId !==
      canonicalAnayaCandidate.runtimeId ||
    vivaanOwnerReview.nextCandidate.executionSequence !==
      4 ||
    vivaanOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    vivaanOwnerReview.authorityBoundary
      .onlyAnayaCurrentlyExecutable !==
        true ||
    vivaanOwnerReview.authorityBoundary
      .remainingFourAuthorizedCandidatesWaiting !==
        true ||
    vivaanOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    vivaanOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    vivaanOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    vivaanOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    vivaanOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    vivaanOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    vivaanOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_FOUR"
  ) {
    throw new Error(
      "Anaya execution requires the exact canonical approved sequence-four owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Anaya first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Anaya first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      vivaanOwnerReview.tenantId ||
    record.ownerId !==
      vivaanOwnerReview.ownerId ||
    record.employeeId !==
      canonicalAnayaCandidate.employeeId ||
    record.employeeCode !==
      canonicalAnayaCandidate.employeeCode ||
    record.publicName !==
      "Anaya" ||
    record.officialRole !==
      canonicalAnayaCandidate.officialRole ||
    record.runtimeId !==
      canonicalAnayaCandidate.runtimeId ||
    record.sourceVivaanOwnerReviewDecisionId !==
      vivaanOwnerReview.decisionId ||
    record.sourceVivaanOwnerReviewDecisionDigest !==
      vivaanOwnerReview.decisionDigest ||
    record.sourceVivaanExecutionId !==
      vivaanOwnerReview.sourceExecutionId ||
    record.sourceVivaanExecutionDigest !==
      vivaanOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalAnayaCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalAnayaShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      4 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Anaya first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(vivaanOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Anaya first synthetic pilot execution cannot precede Vivaan owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticSecurityFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ANAYA_SYNTHETIC_SECURITY_FIXTURE,
      ) ||
    sha256(
      record.authorityEscalationThreatReviewDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_ANAYA_AUTHORITY_ESCALATION_THREAT_REVIEW_DRAFT,
      )
  ) {
    throw new Error(
      "Anaya first synthetic pilot security evidence is invalid.",
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
      "Anaya first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalVivaanOwnerReviewBound !== true ||
    boundary.vivaanOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactAnayaFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingFourAuthorizedCandidatesWaiting !== true ||
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
      "Anaya first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Anaya first synthetic pilot execution next step is invalid.",
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
      "Anaya first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticSecurityFixture) ||
    !Object.isFrozen(
      record.syntheticSecurityFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticSecurityFixture.securityConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticSecurityFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.authorityEscalationThreatReviewDraft,
    ) ||
    !Object.isFrozen(
      record.authorityEscalationThreatReviewDraft.analysisStages,
    ) ||
    record.authorityEscalationThreatReviewDraft.analysisStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.authorityEscalationThreatReviewDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.authorityEscalationThreatReviewDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.authorityEscalationThreatReviewDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.authorityEscalationThreatReviewDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Anaya first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution {
  if (
    input.vivaanOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Anaya first synthetic pilot execution requires the canonical Vivaan owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Anaya first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Anaya first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.vivaanOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Anaya first synthetic pilot execution cannot precede Vivaan owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      vivaanOwnerReview.tenantId,

    ownerId:
      vivaanOwnerReview.ownerId,

    employeeId:
      "candidate-anaya-v1" as const,

    employeeCode:
      "nx-engineering-004" as const,

    publicName:
      "Anaya" as const,

    officialRole:
      "AI Security Engineering Director" as const,

    runtimeId:
      "runtime-engineering-nx-engineering-004-candidate-v1" as const,

    sourceVivaanOwnerReviewDecisionId:
      vivaanOwnerReview.decisionId,

    sourceVivaanOwnerReviewDecisionDigest:
      vivaanOwnerReview.decisionDigest,

    sourceVivaanExecutionId:
      vivaanOwnerReview.sourceExecutionId,

    sourceVivaanExecutionDigest:
      vivaanOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalAnayaCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalAnayaShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      4 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_SCENARIO,

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

    syntheticSecurityFixture:
      ENGINEERING_AI_WORKFORCE_ANAYA_SYNTHETIC_SECURITY_FIXTURE,

    authorityEscalationThreatReviewDraft:
      ENGINEERING_AI_WORKFORCE_ANAYA_AUTHORITY_ESCALATION_THREAT_REVIEW_DRAFT,

    executionBoundary: {
      canonicalVivaanOwnerReviewBound:
        true as const,

      vivaanOwnerReviewIntegrityVerified:
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

      exactAnayaFirstTaskExecuted:
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

      remainingFourAuthorizedCandidatesWaiting:
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
      "AWAIT_OWNER_ENGINEERING_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceAnayaFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_ANAYA_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceAnayaFirstSyntheticPilotTask({
    executionId:
      "engineering-anaya-first-synthetic-pilot-task-execution-001",

    vivaanOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-25T15:44:00.000Z",
  });
