import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
} from "./engineeringAIWorkforceControlledShadowOperationExecution";

import {
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
  type EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision,
} from "./engineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION,
  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision,
} from "./engineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision";

export const ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-vivaan-first-synthetic-pilot-task-execution-v1";

export const ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_SCENARIO =
  "TARGETED_QUALITY_GAP_ANALYSIS" as const;

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

export const ENGINEERING_AI_WORKFORCE_VIVAAN_SYNTHETIC_QUALITY_FIXTURE =
  deepFreeze({
    fixtureId:
      "engineering-vivaan-targeted-quality-gap-analysis-fixture-001",

    fixtureClass:
      "SYNTHETIC_SANITIZED_QUALITY_ANALYSIS_INPUT",

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
      "Analyze bounded synthetic quality evidence, identify verification gaps, classify risk, and recommend fail-closed validation without modifying repository or production state.",

    verifiedFacts: [
      "The exercise uses synthetic sanitized planning inputs only.",
      "Vivaan is owner-authorized only for this first bounded synthetic pilot task.",
      "Leela's first synthetic pilot task has been reviewed by the owner.",
      "Repository access, merge, deployment, customer delivery, payments, and public launch remain blocked.",
      "Every pilot task must stop for immediate owner review.",
    ],

    qualityConstraints: [
      "Use one sequential candidate execution at a time.",
      "Require direct evidence before every quality conclusion.",
      "Keep every recommendation non-executing, reversible, and fail closed.",
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

export const ENGINEERING_AI_WORKFORCE_VIVAAN_TARGETED_QUALITY_GAP_ANALYSIS_DRAFT =
  deepFreeze({
    draftId:
      "engineering-vivaan-targeted-quality-gap-analysis-plan-draft-001",

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW",

    title:
      "Synthetic targeted quality gap analysis",

    summary:
      "Identify missing or weak test evidence, separate failure classes, and recommend the smallest owner-reviewed validation sequence without claiming production readiness.",

    analysisOutcome:
      "BOUNDED_TARGETED_QUALITY_GAP_ANALYSIS_RECOMMENDED",

    riskLevel:
      "MEDIUM",

    verifiedFacts: [
      "Only Vivaan's first synthetic pilot task is currently executable.",
      "The task is sandbox-only and uses read-only synthetic evidence.",
      "No repository, production, customer, provider, financial, legal, or launch authority is granted.",
      "Owner review is mandatory immediately after this draft.",
    ],

    analysisStages: [
      {
        sequence:
          1,

        stage:
          "EVIDENCE_SCOPE_CONFIRMATION",

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
          "QUALITY_GAP_CLASSIFICATION",

        purpose:
          "Classify missing, weak, conflicting, stale, or unverified quality evidence without changing code or tests.",

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
          "BOUNDED_VALIDATION_RECOMMENDATION",

        purpose:
          "Recommend the smallest bounded validation sequence across targeted, regression, type, lint, build, security, and recovery checks.",

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
          "OWNER_QUALITY_REVIEW",

        purpose:
          "Present verified gaps, failure classifications, residual risks, and recommendations while retaining every consequential decision with the owner.",

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
      "Keep evidence collection, failure classification, validation recommendation, and owner review as separate milestones.",
      "Require exact outputs, immutable evidence, and clean repository state before accepting any quality conclusion.",
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

export interface CreateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecutionInput {
  readonly executionId:
    string;

  readonly leelaOwnerReviewDecision:
    EngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED";

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly employeeId:
    "candidate-vivaan-v1";

  readonly employeeCode:
    "nx-engineering-003";

  readonly publicName:
    "Vivaan";

  readonly officialRole:
    "AI Quality Assurance Director";

  readonly runtimeId:
    "runtime-engineering-nx-engineering-003-candidate-v1";

  readonly sourceLeelaOwnerReviewDecisionId:
    string;

  readonly sourceLeelaOwnerReviewDecisionDigest:
    string;

  readonly sourceLeelaExecutionId:
    string;

  readonly sourceLeelaExecutionDigest:
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
    3;

  readonly scenarioId:
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_SCENARIO;

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

  readonly syntheticQualityFixture:
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_SYNTHETIC_QUALITY_FIXTURE;

  readonly targetedQualityGapAnalysisDraft:
    typeof ENGINEERING_AI_WORKFORCE_VIVAAN_TARGETED_QUALITY_GAP_ANALYSIS_DRAFT;

  readonly executionBoundary: Readonly<{
    canonicalLeelaOwnerReviewBound:
      true;

    leelaOwnerReviewIntegrityVerified:
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

    exactVivaanFirstTaskExecuted:
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

    remainingFiveAuthorizedCandidatesWaiting:
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
    "AWAIT_OWNER_ENGINEERING_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const ownerFirstTaskDecision =
  ENGINEERING_AI_WORKFORCE_OWNER_LIMITED_INTERNAL_PILOT_FIRST_TASK_EXECUTION_DECISION;

const leelaOwnerReview =
  ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION;

const vivaanCandidate =
  ownerFirstTaskDecision.candidateDecisions.find(
    (candidate) =>
      candidate.publicName === "Vivaan",
  );

const vivaanShadowExecution =
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
    .candidateExecutions.find(
      (candidate) =>
        candidate.publicName === "Vivaan",
    );

if (
  !vivaanCandidate ||
  vivaanCandidate.employeeId !==
    "candidate-vivaan-v1" ||
  vivaanCandidate.employeeCode !==
    "nx-engineering-003" ||
  vivaanCandidate.officialRole !==
    "AI Quality Assurance Director" ||
  vivaanCandidate.runtimeId !==
    "runtime-engineering-nx-engineering-003-candidate-v1" ||
  vivaanCandidate.executionSequence !==
    3 ||
  vivaanCandidate.taskSequence !==
    1 ||
  vivaanCandidate.scenarioId !==
    ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_SCENARIO ||
  vivaanCandidate.firstTaskExecutionAuthorized !==
    true ||
  vivaanCandidate.firstTaskExecutionPerformed !==
    false
) {
  throw new Error(
    "Canonical Vivaan first-task candidate decision is invalid.",
  );
}

if (
  !vivaanShadowExecution ||
  vivaanShadowExecution.employeeId !==
    "candidate-vivaan-v1" ||
  vivaanShadowExecution.employeeCode !==
    "nx-engineering-003" ||
  vivaanShadowExecution.runtimeId !==
    "runtime-engineering-nx-engineering-003-candidate-v1" ||
  vivaanShadowExecution.syntheticEvidence
    .dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
  vivaanShadowExecution.syntheticEvidence
    .evidenceToolMode !==
      "READ_ONLY" ||
  vivaanShadowExecution.syntheticEvidence
    .realCustomerDataUsed !==
      false ||
  vivaanShadowExecution.syntheticEvidence
    .crossTenantContextUsed !==
      false ||
  vivaanShadowExecution.draftEvidence
    .draftToolMode !==
      "DRAFT_ONLY" ||
  vivaanShadowExecution.executionBoundary
    .repositoryReadAuthorized !==
      false ||
  vivaanShadowExecution.executionBoundary
    .repositoryWriteAuthorized !==
      false ||
  vivaanShadowExecution.executionBoundary
    .productionDeploymentAuthorized !==
      false ||
  vivaanShadowExecution.executionBoundary
    .publicLaunchAuthorized !==
      false
) {
  throw new Error(
    "Canonical Vivaan controlled-shadow evidence is invalid.",
  );
}

const canonicalVivaanCandidate =
  vivaanCandidate;

const canonicalVivaanShadowExecution =
  vivaanShadowExecution;
let canonicalSourcesValidated =
  false;

function validateCanonicalSources(): void {
  if (canonicalSourcesValidated) {
    return;
  }

  validateEngineeringAIWorkforceLeelaFirstSyntheticPilotTaskOwnerReviewDecision(
    leelaOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerLimitedInternalPilotFirstTaskExecutionDecision(
    ownerFirstTaskDecision,
  );

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  );

  if (
    leelaOwnerReview.decision !==
      "APPROVE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION" ||
    leelaOwnerReview.vivaanFirstTaskExecutionAuthorized !==
      true ||
    leelaOwnerReview.vivaanFirstTaskExecutionPerformed !==
      false ||
    leelaOwnerReview.nextCandidate.employeeId !==
      canonicalVivaanCandidate.employeeId ||
    leelaOwnerReview.nextCandidate.runtimeId !==
      canonicalVivaanCandidate.runtimeId ||
    leelaOwnerReview.nextCandidate.scenarioId !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_SCENARIO ||
    leelaOwnerReview.authorityBoundary
      .onlyVivaanCurrentlyExecutable !==
        true ||
    leelaOwnerReview.authorityBoundary
      .remainingFiveAuthorizedCandidatesWaiting !==
        true ||
    leelaOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    leelaOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    leelaOwnerReview.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    leelaOwnerReview.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    leelaOwnerReview.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    leelaOwnerReview.authorityBoundary
      .publicLaunchAuthorized !==
        false ||
    leelaOwnerReview.nextStep !==
      "EXECUTE_ENGINEERING_LIMITED_INTERNAL_PILOT_FIRST_TASK_SEQUENCE_THREE"
  ) {
    throw new Error(
      "Vivaan execution requires the exact canonical approved sequence-three owner review.",
    );
  }

  canonicalSourcesValidated =
    true;
}

export function validateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecution(
  record:
    EngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecution,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Vivaan first synthetic pilot execution ID",
    record.executionId,
  );

  requireTimestamp(
    "Vivaan first synthetic pilot execution time",
    record.executedAt,
  );

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION ||
    record.executionState !==
      "ENGINEERING_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" ||
    record.tenantId !==
      leelaOwnerReview.tenantId ||
    record.ownerId !==
      leelaOwnerReview.ownerId ||
    record.employeeId !==
      canonicalVivaanCandidate.employeeId ||
    record.employeeCode !==
      canonicalVivaanCandidate.employeeCode ||
    record.publicName !==
      "Vivaan" ||
    record.officialRole !==
      canonicalVivaanCandidate.officialRole ||
    record.runtimeId !==
      canonicalVivaanCandidate.runtimeId ||
    record.sourceLeelaOwnerReviewDecisionId !==
      leelaOwnerReview.decisionId ||
    record.sourceLeelaOwnerReviewDecisionDigest !==
      leelaOwnerReview.decisionDigest ||
    record.sourceLeelaExecutionId !==
      leelaOwnerReview.sourceExecutionId ||
    record.sourceLeelaExecutionDigest !==
      leelaOwnerReview.sourceExecutionDigest ||
    record.ownerFirstTaskExecutionDecisionId !==
      ownerFirstTaskDecision.decisionId ||
    record.ownerFirstTaskExecutionDecisionDigest !==
      ownerFirstTaskDecision.decisionDigest ||
    record.sourcePreparationId !==
      ownerFirstTaskDecision.sourcePreparationId ||
    record.sourcePreparationDigest !==
      ownerFirstTaskDecision.sourcePreparationDigest ||
    record.candidateDecisionDigest !==
      canonicalVivaanCandidate.candidateDecisionDigest ||
    record.sourceControlledShadowExecutionDigest !==
      canonicalVivaanShadowExecution.candidateExecutionDigest ||
    record.taskSequence !==
      1 ||
    record.executionSequence !==
      3 ||
    record.scenarioId !==
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_SCENARIO
  ) {
    throw new Error(
      "Vivaan first synthetic pilot execution source binding is invalid.",
    );
  }

  if (
    Date.parse(record.executedAt) <
    Date.parse(leelaOwnerReview.decidedAt)
  ) {
    throw new Error(
      "Vivaan first synthetic pilot execution cannot precede Leela owner review approval.",
    );
  }

  if (
    sha256(
      record.syntheticQualityFixture,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_VIVAAN_SYNTHETIC_QUALITY_FIXTURE,
      ) ||
    sha256(
      record.targetedQualityGapAnalysisDraft,
    ) !==
      sha256(
        ENGINEERING_AI_WORKFORCE_VIVAAN_TARGETED_QUALITY_GAP_ANALYSIS_DRAFT,
      )
  ) {
    throw new Error(
      "Vivaan first synthetic pilot delivery evidence is invalid.",
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
      "Vivaan first synthetic pilot task contract is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

  if (
    boundary.canonicalLeelaOwnerReviewBound !== true ||
    boundary.leelaOwnerReviewIntegrityVerified !== true ||
    boundary.canonicalOwnerFirstTaskDecisionBound !== true ||
    boundary.canonicalPilotPreparationBound !== true ||
    boundary.candidateDecisionBound !== true ||
    boundary.controlledShadowEvidenceBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.employeeIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.exactVivaanFirstTaskExecuted !== true ||
    boundary.syntheticPilotTaskExecutionPerformed !== true ||
    boundary.taskExecutorInvocationCount !== 1 ||
    boundary.pilotDraftCreated !== true ||
    boundary.pilotCompleted !== false ||
    boundary.ownerDecisionMade !== false ||
    boundary.ownerReviewRequired !== true ||
    boundary.ownerReviewRequiredImmediately !== true ||
    boundary.nextCandidateExecutionAuthorized !== false ||
    boundary.remainingFiveAuthorizedCandidatesWaiting !== true ||
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
      "Vivaan first synthetic pilot execution boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW"
  ) {
    throw new Error(
      "Vivaan first synthetic pilot execution next step is invalid.",
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
      "Vivaan first synthetic pilot execution digest is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.pilotTask) ||
    !Object.isFrozen(record.syntheticQualityFixture) ||
    !Object.isFrozen(
      record.syntheticQualityFixture.verifiedFacts,
    ) ||
    !Object.isFrozen(
      record.syntheticQualityFixture.qualityConstraints,
    ) ||
    !Object.isFrozen(
      record.syntheticQualityFixture.requiredEvidenceClasses,
    ) ||
    !Object.isFrozen(
      record.targetedQualityGapAnalysisDraft,
    ) ||
    !Object.isFrozen(
      record.targetedQualityGapAnalysisDraft.analysisStages,
    ) ||
    record.targetedQualityGapAnalysisDraft.analysisStages.some(
      (stage) =>
        !Object.isFrozen(stage) ||
        !Object.isFrozen(stage.requiredEvidence),
    ) ||
    !Object.isFrozen(
      record.targetedQualityGapAnalysisDraft.evidenceGates,
    ) ||
    !Object.isFrozen(
      record.targetedQualityGapAnalysisDraft.identifiedBlockers,
    ) ||
    !Object.isFrozen(
      record.targetedQualityGapAnalysisDraft.recommendations,
    ) ||
    !Object.isFrozen(
      record.targetedQualityGapAnalysisDraft.uncertainties,
    ) ||
    !Object.isFrozen(record.executionBoundary)
  ) {
    throw new Error(
      "Vivaan first synthetic pilot execution must remain deeply immutable.",
    );
  }
}

export function executeEngineeringAIWorkforceVivaanFirstSyntheticPilotTask(
  input:
    CreateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecutionInput,
): EngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecution {
  if (
    input.leelaOwnerReviewDecision !==
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION
  ) {
    throw new Error(
      "Vivaan first synthetic pilot execution requires the canonical Leela owner-review decision.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Vivaan first synthetic pilot execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Vivaan first synthetic pilot execution time",
    input.executedAt,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.leelaOwnerReviewDecision.decidedAt,
    )
  ) {
    throw new Error(
      "Vivaan first synthetic pilot execution cannot precede Leela owner review approval.",
    );
  }

  const recordCore = {
    version:
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTED" as const,

    tenantId:
      leelaOwnerReview.tenantId,

    ownerId:
      leelaOwnerReview.ownerId,

    employeeId:
      "candidate-vivaan-v1" as const,

    employeeCode:
      "nx-engineering-003" as const,

    publicName:
      "Vivaan" as const,

    officialRole:
      "AI Quality Assurance Director" as const,

    runtimeId:
      "runtime-engineering-nx-engineering-003-candidate-v1" as const,

    sourceLeelaOwnerReviewDecisionId:
      leelaOwnerReview.decisionId,

    sourceLeelaOwnerReviewDecisionDigest:
      leelaOwnerReview.decisionDigest,

    sourceLeelaExecutionId:
      leelaOwnerReview.sourceExecutionId,

    sourceLeelaExecutionDigest:
      leelaOwnerReview.sourceExecutionDigest,

    ownerFirstTaskExecutionDecisionId:
      ownerFirstTaskDecision.decisionId,

    ownerFirstTaskExecutionDecisionDigest:
      ownerFirstTaskDecision.decisionDigest,

    sourcePreparationId:
      ownerFirstTaskDecision.sourcePreparationId,

    sourcePreparationDigest:
      ownerFirstTaskDecision.sourcePreparationDigest,

    candidateDecisionDigest:
      canonicalVivaanCandidate.candidateDecisionDigest,

    sourceControlledShadowExecutionDigest:
      canonicalVivaanShadowExecution.candidateExecutionDigest,

    taskSequence:
      1 as const,

    executionSequence:
      3 as const,

    scenarioId:
      ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_SCENARIO,

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

    syntheticQualityFixture:
      ENGINEERING_AI_WORKFORCE_VIVAAN_SYNTHETIC_QUALITY_FIXTURE,

    targetedQualityGapAnalysisDraft:
      ENGINEERING_AI_WORKFORCE_VIVAAN_TARGETED_QUALITY_GAP_ANALYSIS_DRAFT,

    executionBoundary: {
      canonicalLeelaOwnerReviewBound:
        true as const,

      leelaOwnerReviewIntegrityVerified:
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

      exactVivaanFirstTaskExecuted:
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

      remainingFiveAuthorizedCandidatesWaiting:
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
      "AWAIT_OWNER_ENGINEERING_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const record =
    deepFreeze({
      ...recordCore,

      executionDigest:
        sha256(recordCore),
    }) as EngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecution;

  validateEngineeringAIWorkforceVivaanFirstSyntheticPilotTaskExecution(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_VIVAAN_FIRST_SYNTHETIC_PILOT_TASK_EXECUTION =
  executeEngineeringAIWorkforceVivaanFirstSyntheticPilotTask({
    executionId:
      "engineering-vivaan-first-synthetic-pilot-task-execution-001",

    leelaOwnerReviewDecision:
      ENGINEERING_AI_WORKFORCE_LEELA_FIRST_SYNTHETIC_PILOT_TASK_OWNER_REVIEW_DECISION,

    executedAt:
      "2026-07-25T15:42:00.000Z",
  });
