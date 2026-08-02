import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision,
} from "./engineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
} from "./engineeringAIWorkforceOwnerActivatedRuntimeIssuance";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-first-workstream-evidence-plan-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_SECOND_SYNTHETIC_TASK_EVIDENCE_PROFILES =
  [
    {
      scenarioId:
        "MODULAR_ARCHITECTURE_EVOLUTION_PLAN",
      objective:
        "Plan one bounded synthetic architecture-evolution evidence task without repository access or implementation authority.",
      expectedEvidence:
        "A deterministic architecture trade-off plan with tenant isolation, owner control, rollback, and audit requirements.",
    },
    {
      scenarioId:
        "ENGINEERING_DELIVERY_COORDINATION_PLAN",
      objective:
        "Plan one bounded synthetic engineering-delivery coordination evidence task without concurrent execution.",
      expectedEvidence:
        "A deterministic coordination plan with sequencing, conflict prevention, pause, escalation, and owner-review controls.",
    },
    {
      scenarioId:
        "REGRESSION_RISK_CONTAINMENT_PLAN",
      objective:
        "Plan one bounded synthetic regression-risk containment evidence task without executing tests or changing code.",
      expectedEvidence:
        "A deterministic risk-based regression plan with coverage, stop conditions, evidence requirements, and recovery checks.",
    },
    {
      scenarioId:
        "SECURITY_BOUNDARY_REVIEW_PLAN",
      objective:
        "Plan one bounded synthetic security-boundary review evidence task without secrets, repository, or production access.",
      expectedEvidence:
        "A deterministic threat and control review plan covering tenant isolation, fail-closed behavior, and owner escalation.",
    },
    {
      scenarioId:
        "RELIABILITY_RECOVERY_VALIDATION_PLAN",
      objective:
        "Plan one bounded synthetic reliability and recovery evidence task without live-provider or production execution.",
      expectedEvidence:
        "A deterministic recovery validation plan with monitoring, graceful degradation, rollback, and audit checkpoints.",
    },
    {
      scenarioId:
        "CHAOS_FAILURE_CONTAINMENT_PLAN",
      objective:
        "Plan one bounded synthetic chaos and failure-containment evidence task without injecting any real failure.",
      expectedEvidence:
        "A deterministic simulated-failure plan with blast-radius limits, emergency pause, rollback, and owner-review gates.",
    },
    {
      scenarioId:
        "DATA_PIPELINE_QUALITY_PLAN",
      objective:
        "Plan one bounded synthetic data-pipeline quality evidence task without customer data or database mutation.",
      expectedEvidence:
        "A deterministic data-quality plan with schema checks, tenant boundaries, lineage, reconciliation, and recovery evidence.",
    },
    {
      scenarioId:
        "SYSTEMS_EVALUATION_RED_TEAM_PLAN",
      objective:
        "Plan one bounded synthetic systems-evaluation and red-team evidence task without adversarial execution.",
      expectedEvidence:
        "A deterministic evaluation plan covering evidence substitution, authority bypass, isolation, recovery, and owner control.",
    },
  ] as const;

export type EngineeringAIWorkforceSecondSyntheticTaskEvidenceProfile =
  (
    typeof ENGINEERING_AI_WORKFORCE_SECOND_SYNTHETIC_TASK_EVIDENCE_PROFILES
  )[number];

export interface EngineeringAIWorkforceSecondSyntheticTaskEvidencePlan {
  readonly sequence:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8;
  readonly planState:
    "ENGINEERING_SECOND_SYNTHETIC_TASK_EVIDENCE_PLAN_PREPARED";
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly runtimeId: string;
  readonly sourceCandidateRuntimeIssuanceDigest:
    string;
  readonly scenarioId:
    EngineeringAIWorkforceSecondSyntheticTaskEvidenceProfile["scenarioId"];
  readonly objective: string;
  readonly expectedEvidence: string;
  readonly dataClassification:
    "SYNTHETIC_SANITIZED_ONLY";
  readonly outputMode: "PLAN_ONLY";
  readonly evidenceToolMode: "READ_ONLY";
  readonly maximumTaskCount: 1;
  readonly concurrentTaskLimit: 0;
  readonly deterministicEvidenceRequired:
    true;
  readonly independentValidationRequired:
    true;
  readonly ownerExecutionDecisionRequired:
    true;
  readonly ownerExecutionDecisionRecorded:
    false;
  readonly ownerReviewAfterExecutionRequired:
    true;
  readonly secondTaskExecutionAuthorized:
    false;
  readonly secondTaskExecuted: false;
  readonly concurrentExecutionAuthorized:
    false;
  readonly repositoryReadAuthorized: false;
  readonly repositoryWriteAuthorized: false;
  readonly branchCreationAuthorized: false;
  readonly pullRequestPreparationAuthorized:
    false;
  readonly mergeAuthorized: false;
  readonly secretsAccessAuthorized: false;
  readonly realCustomerDataAccessAuthorized:
    false;
  readonly realCustomerContactAuthorized:
    false;
  readonly externalDeliveryAuthorized: false;
  readonly liveProviderExecutionAuthorized:
    false;
  readonly productionDatabaseAuthorized:
    false;
  readonly productionMutationAuthorized:
    false;
  readonly productionDeploymentAuthorized:
    false;
  readonly paymentExecutionAuthorized: false;
  readonly publicLaunchAuthorized: false;
  readonly candidatePlanDigest: string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparationInput {
  readonly preparationId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION;
  readonly preparationId: string;
  readonly preparationState:
    "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARED";
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceWorkstreamPreparationReviewDecisionId:
    string;
  readonly sourceWorkstreamPreparationReviewDecisionDigest:
    string;
  readonly sourceWorkstreamPreparationId:
    string;
  readonly sourceWorkstreamPreparationDigest:
    string;
  readonly sourceLevelTwoOwnerReviewDecisionId:
    string;
  readonly sourceLevelTwoOwnerReviewDecisionDigest:
    string;
  readonly sourceRuntimeIssuanceId: string;
  readonly sourceRuntimeIssuanceDigest:
    string;
  readonly workstreamSequence: 1;
  readonly workstreamId:
    "routine-engineering-second-task-evidence";
  readonly evidenceClass:
    "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE";
  readonly planOnly: true;
  readonly candidatePlanCount: 8;
  readonly candidatePlans:
    readonly EngineeringAIWorkforceSecondSyntheticTaskEvidencePlan[];
  readonly summary: Readonly<{
    candidateCount: 8;
    firstTaskReviewedAndApprovedCount:
      8;
    activatedRuntimeCount: 8;
    secondTaskEvidencePlanPreparedCount:
      8;
    ownerExecutionDecisionRequiredCount:
      8;
    ownerExecutionDecisionRecordedCount:
      0;
    secondTaskExecutionAuthorizedCount:
      0;
    secondTaskExecutedCount: 0;
    concurrentExecutionAuthorizedCount:
      0;
    repositoryReadAuthorizedCount: 0;
    repositoryWriteAuthorizedCount: 0;
    syntheticSanitizedPlanCount: 8;
    deterministicEvidenceRequiredCount:
      8;
    independentValidationRequiredCount:
      8;
  }>;
  readonly ownerEvidencePlanReviewRequired:
    true;
  readonly ownerEvidencePlanReviewRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    evidencePlanningOnly: true;
    canonicalApprovalBound: true;
    canonicalLevelTwoEvidenceBound:
      true;
    canonicalRuntimeIssuanceBound:
      true;
    exactEightCandidatePlansRequired:
      true;
    levelThreeAuthorityGranted: false;
    secondTaskExecutionAuthorized:
      false;
    thirdTaskExecutionAuthorized: false;
    concurrentExecutionAuthorized: false;
    repositoryReadAuthorized: false;
    repositoryWriteAuthorized: false;
    branchCreationAuthorized: false;
    pullRequestPreparationAuthorized:
      false;
    mergeAuthorized: false;
    secretsAccessAuthorized: false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    productionDatabaseAuthorized:
      false;
    productionMutationAuthorized:
      false;
    productionDeploymentAuthorized:
      false;
    paymentExecutionAuthorized: false;
    financialCommitmentAuthorized:
      false;
    legalCommitmentAuthorized: false;
    autonomousDecisionAuthorized:
      false;
    productionReadinessAuthorized:
      false;
    publicLaunchAuthorized: false;
    founderLiberationAchieved: false;
    founderReleasedFromRoutineExecution:
      false;
    monitoringRequired: true;
    emergencyPauseRequired: true;
    rollbackEvidenceRequired: true;
    ownerFinalAuthorityPreserved: true;
  }>;
  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW";
  readonly preparedAt: string;
  readonly preparationDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

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
): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (
    const nestedValue of
    Object.values(
      value as Record<string, unknown>,
    )
  ) {
    deepFreeze(nestedValue);
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

const approval =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;

const workstreamPreparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

const levelTwoOwnerReview =
  ENGINEERING_AI_WORKFORCE_LEVEL_TWO_COMPLETION_EVIDENCE_OWNER_REVIEW_DECISION;

const runtimeIssuance =
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE;

function validateCanonicalSources(): void {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
    approval,
  );

  validateEngineeringAIWorkforceLevelTwoCompletionEvidenceOwnerReviewDecision(
    levelTwoOwnerReview,
  );

  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
    runtimeIssuance,
  );

  const firstWorkstream =
    workstreamPreparation.preparedWorkstreams[0];

  if (
    approval.decision !==
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY" ||
    approval.preparationEvidenceAccepted !==
      true ||
    approval.firstWorkstreamEvidencePlanPreparationAuthorized !==
      true ||
    approval.consequentialAuthorityGranted !==
      false ||
    approval.nextStep !==
      "AWAIT_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION" ||
    levelTwoOwnerReview.decision !==
      "APPROVE_ENGINEERING_LEVEL_TWO_COMPLETION_EVIDENCE_ONLY" ||
    levelTwoOwnerReview.levelTwoEvidenceAccepted !==
      true ||
    levelTwoOwnerReview.additionalAuthorityGranted !==
      false ||
    levelTwoOwnerReview.reviewedEvidence
      .candidateCount !==
      8 ||
    levelTwoOwnerReview.reviewedEvidence
      .firstSyntheticPilotTaskExecutionReviewedCount !==
      8 ||
    levelTwoOwnerReview.reviewedEvidence
      .firstSyntheticPilotTaskExecutionApprovedCount !==
      8 ||
    levelTwoOwnerReview.authorityBoundary
      .secondTaskExecutionAuthorized !==
      false ||
    levelTwoOwnerReview.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    levelTwoOwnerReview.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    levelTwoOwnerReview.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    levelTwoOwnerReview.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    runtimeIssuance.candidateRuntimeIssuances.length !==
      8 ||
    runtimeIssuance.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    runtimeIssuance.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    runtimeIssuance.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    runtimeIssuance.authorityBoundary
      .paymentExecutionAuthorized !==
      false ||
    runtimeIssuance.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    !firstWorkstream ||
    firstWorkstream.sequence !== 1 ||
    firstWorkstream.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    firstWorkstream.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" ||
    firstWorkstream.taskExecutionAuthorized !==
      false ||
    firstWorkstream.repositoryReadAuthorized !==
      false ||
    firstWorkstream.repositoryWriteAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering first post-Level-2 workstream evidence-plan sources are invalid.",
    );
  }
}

function validateCandidatePlan(
  plan:
    EngineeringAIWorkforceSecondSyntheticTaskEvidencePlan,
  index: number,
): void {
  const runtime =
    runtimeIssuance.candidateRuntimeIssuances[index];

  const profile =
    ENGINEERING_AI_WORKFORCE_SECOND_SYNTHETIC_TASK_EVIDENCE_PROFILES[index];

  if (!runtime || !profile) {
    throw new Error(
      "Engineering second-task candidate plan source is missing.",
    );
  }

  if (
    plan.sequence !== index + 1 ||
    plan.planState !==
      "ENGINEERING_SECOND_SYNTHETIC_TASK_EVIDENCE_PLAN_PREPARED" ||
    plan.employeeId !==
      runtime.employeeId ||
    plan.employeeCode !==
      runtime.employeeCode ||
    plan.publicName !==
      runtime.publicName ||
    plan.officialRole !==
      runtime.officialRole ||
    plan.runtimeId !==
      runtime.runtimeId ||
    plan.sourceCandidateRuntimeIssuanceDigest !==
      runtime.candidateRuntimeIssuanceDigest ||
    plan.scenarioId !==
      profile.scenarioId ||
    plan.objective !==
      profile.objective ||
    plan.expectedEvidence !==
      profile.expectedEvidence ||
    plan.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    plan.outputMode !== "PLAN_ONLY" ||
    plan.evidenceToolMode !==
      "READ_ONLY" ||
    plan.maximumTaskCount !== 1 ||
    plan.concurrentTaskLimit !== 0 ||
    plan.deterministicEvidenceRequired !==
      true ||
    plan.independentValidationRequired !==
      true ||
    plan.ownerExecutionDecisionRequired !==
      true ||
    plan.ownerExecutionDecisionRecorded !==
      false ||
    plan.ownerReviewAfterExecutionRequired !==
      true ||
    plan.secondTaskExecutionAuthorized !==
      false ||
    plan.secondTaskExecuted !== false ||
    plan.concurrentExecutionAuthorized !==
      false ||
    plan.repositoryReadAuthorized !==
      false ||
    plan.repositoryWriteAuthorized !==
      false ||
    plan.branchCreationAuthorized !==
      false ||
    plan.pullRequestPreparationAuthorized !==
      false ||
    plan.mergeAuthorized !== false ||
    plan.secretsAccessAuthorized !==
      false ||
    plan.realCustomerDataAccessAuthorized !==
      false ||
    plan.realCustomerContactAuthorized !==
      false ||
    plan.externalDeliveryAuthorized !==
      false ||
    plan.liveProviderExecutionAuthorized !==
      false ||
    plan.productionDatabaseAuthorized !==
      false ||
    plan.productionMutationAuthorized !==
      false ||
    plan.productionDeploymentAuthorized !==
      false ||
    plan.paymentExecutionAuthorized !==
      false ||
    plan.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering second synthetic task evidence plan is invalid.",
    );
  }

  const {
    candidatePlanDigest,
    ...candidatePlanCore
  } = plan;

  if (
    !SHA256_PATTERN.test(
      candidatePlanDigest,
    ) ||
    sha256(candidatePlanCore) !==
      candidatePlanDigest
  ) {
    throw new Error(
      "Engineering second synthetic task candidate-plan digest is invalid.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering first-workstream evidence-plan preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Engineering first-workstream evidence-plan preparation time",
    record.preparedAt,
  );

  if (
    !SHA256_PATTERN.test(
      record.preparationDigest,
    )
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan preparation digest is invalid.",
    );
  }

  const {
    preparationDigest,
    ...preparationCore
  } = record;

  if (
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARED" ||
    record.tenantId !==
      approval.tenantId ||
    record.ownerId !== approval.ownerId ||
    record.sourceWorkstreamPreparationReviewDecisionId !==
      approval.decisionId ||
    record.sourceWorkstreamPreparationReviewDecisionDigest !==
      approval.decisionDigest ||
    record.sourceWorkstreamPreparationId !==
      workstreamPreparation.preparationId ||
    record.sourceWorkstreamPreparationDigest !==
      workstreamPreparation.preparationDigest ||
    record.sourceLevelTwoOwnerReviewDecisionId !==
      levelTwoOwnerReview.decisionId ||
    record.sourceLevelTwoOwnerReviewDecisionDigest !==
      levelTwoOwnerReview.decisionDigest ||
    record.sourceRuntimeIssuanceId !==
      runtimeIssuance.runtimeIssuanceId ||
    record.sourceRuntimeIssuanceDigest !==
      runtimeIssuance.runtimeIssuanceDigest ||
    record.workstreamSequence !== 1 ||
    record.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    record.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" ||
    record.planOnly !== true ||
    record.candidatePlanCount !== 8 ||
    record.candidatePlans.length !== 8 ||
    record.ownerEvidencePlanReviewRequired !==
      true ||
    record.ownerEvidencePlanReviewRecorded !==
      false ||
    Date.parse(record.preparedAt) <
      Date.parse(approval.decidedAt) ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW"
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan preparation identity is invalid.",
    );
  }

  record.candidatePlans.forEach(
    validateCandidatePlan,
  );

  const summary =
    record.summary;

  if (
    summary.candidateCount !== 8 ||
    summary.firstTaskReviewedAndApprovedCount !==
      8 ||
    summary.activatedRuntimeCount !== 8 ||
    summary.secondTaskEvidencePlanPreparedCount !==
      8 ||
    summary.ownerExecutionDecisionRequiredCount !==
      8 ||
    summary.ownerExecutionDecisionRecordedCount !==
      0 ||
    summary.secondTaskExecutionAuthorizedCount !==
      0 ||
    summary.secondTaskExecutedCount !== 0 ||
    summary.concurrentExecutionAuthorizedCount !==
      0 ||
    summary.repositoryReadAuthorizedCount !==
      0 ||
    summary.repositoryWriteAuthorizedCount !==
      0 ||
    summary.syntheticSanitizedPlanCount !==
      8 ||
    summary.deterministicEvidenceRequiredCount !==
      8 ||
    summary.independentValidationRequiredCount !==
      8
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.evidencePlanningOnly !==
      true ||
    boundary.canonicalApprovalBound !==
      true ||
    boundary.canonicalLevelTwoEvidenceBound !==
      true ||
    boundary.canonicalRuntimeIssuanceBound !==
      true ||
    boundary.exactEightCandidatePlansRequired !==
      true ||
    boundary.levelThreeAuthorityGranted !==
      false ||
    boundary.secondTaskExecutionAuthorized !==
      false ||
    boundary.thirdTaskExecutionAuthorized !==
      false ||
    boundary.concurrentExecutionAuthorized !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !== false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
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
    boundary.founderLiberationAchieved !==
      false ||
    boundary.founderReleasedFromRoutineExecution !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseRequired !==
      true ||
    boundary.rollbackEvidenceRequired !==
      true ||
    boundary.ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparationInput,
): EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering first-workstream evidence-plan preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering first-workstream evidence-plan preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
      Date.parse(approval.decidedAt)
  ) {
    throw new Error(
      "Engineering first-workstream evidence-plan preparation cannot precede owner approval.",
    );
  }

  const candidatePlans =
    runtimeIssuance.candidateRuntimeIssuances.map(
      (runtime, index) => {
        const profile =
          ENGINEERING_AI_WORKFORCE_SECOND_SYNTHETIC_TASK_EVIDENCE_PROFILES[index];

        if (!profile) {
          throw new Error(
            "Engineering second-task evidence profile is missing.",
          );
        }

        const candidatePlanCore = {
          sequence:
            (index + 1) as
              | 1
              | 2
              | 3
              | 4
              | 5
              | 6
              | 7
              | 8,
          planState:
            "ENGINEERING_SECOND_SYNTHETIC_TASK_EVIDENCE_PLAN_PREPARED" as const,
          employeeId:
            runtime.employeeId,
          employeeCode:
            runtime.employeeCode,
          publicName:
            runtime.publicName,
          officialRole:
            runtime.officialRole,
          runtimeId:
            runtime.runtimeId,
          sourceCandidateRuntimeIssuanceDigest:
            runtime.candidateRuntimeIssuanceDigest,
          scenarioId:
            profile.scenarioId,
          objective:
            profile.objective,
          expectedEvidence:
            profile.expectedEvidence,
          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY" as const,
          outputMode:
            "PLAN_ONLY" as const,
          evidenceToolMode:
            "READ_ONLY" as const,
          maximumTaskCount: 1 as const,
          concurrentTaskLimit: 0 as const,
          deterministicEvidenceRequired:
            true as const,
          independentValidationRequired:
            true as const,
          ownerExecutionDecisionRequired:
            true as const,
          ownerExecutionDecisionRecorded:
            false as const,
          ownerReviewAfterExecutionRequired:
            true as const,
          secondTaskExecutionAuthorized:
            false as const,
          secondTaskExecuted:
            false as const,
          concurrentExecutionAuthorized:
            false as const,
          repositoryReadAuthorized:
            false as const,
          repositoryWriteAuthorized:
            false as const,
          branchCreationAuthorized:
            false as const,
          pullRequestPreparationAuthorized:
            false as const,
          mergeAuthorized:
            false as const,
          secretsAccessAuthorized:
            false as const,
          realCustomerDataAccessAuthorized:
            false as const,
          realCustomerContactAuthorized:
            false as const,
          externalDeliveryAuthorized:
            false as const,
          liveProviderExecutionAuthorized:
            false as const,
          productionDatabaseAuthorized:
            false as const,
          productionMutationAuthorized:
            false as const,
          productionDeploymentAuthorized:
            false as const,
          paymentExecutionAuthorized:
            false as const,
          publicLaunchAuthorized:
            false as const,
        };

        return deepFreeze({
          ...candidatePlanCore,
          candidatePlanDigest:
            sha256(candidatePlanCore),
        });
      },
    ) as readonly EngineeringAIWorkforceSecondSyntheticTaskEvidencePlan[];

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION,
    preparationId:
      input.preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARED" as const,
    tenantId:
      approval.tenantId,
    ownerId:
      approval.ownerId,
    sourceWorkstreamPreparationReviewDecisionId:
      approval.decisionId,
    sourceWorkstreamPreparationReviewDecisionDigest:
      approval.decisionDigest,
    sourceWorkstreamPreparationId:
      workstreamPreparation.preparationId,
    sourceWorkstreamPreparationDigest:
      workstreamPreparation.preparationDigest,
    sourceLevelTwoOwnerReviewDecisionId:
      levelTwoOwnerReview.decisionId,
    sourceLevelTwoOwnerReviewDecisionDigest:
      levelTwoOwnerReview.decisionDigest,
    sourceRuntimeIssuanceId:
      runtimeIssuance.runtimeIssuanceId,
    sourceRuntimeIssuanceDigest:
      runtimeIssuance.runtimeIssuanceDigest,
    workstreamSequence: 1 as const,
    workstreamId:
      "routine-engineering-second-task-evidence" as const,
    evidenceClass:
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" as const,
    planOnly: true as const,
    candidatePlanCount: 8 as const,
    candidatePlans,
    summary: {
      candidateCount: 8 as const,
      firstTaskReviewedAndApprovedCount:
        8 as const,
      activatedRuntimeCount: 8 as const,
      secondTaskEvidencePlanPreparedCount:
        8 as const,
      ownerExecutionDecisionRequiredCount:
        8 as const,
      ownerExecutionDecisionRecordedCount:
        0 as const,
      secondTaskExecutionAuthorizedCount:
        0 as const,
      secondTaskExecutedCount: 0 as const,
      concurrentExecutionAuthorizedCount:
        0 as const,
      repositoryReadAuthorizedCount:
        0 as const,
      repositoryWriteAuthorizedCount:
        0 as const,
      syntheticSanitizedPlanCount:
        8 as const,
      deterministicEvidenceRequiredCount:
        8 as const,
      independentValidationRequiredCount:
        8 as const,
    },
    ownerEvidencePlanReviewRequired:
      true as const,
    ownerEvidencePlanReviewRecorded:
      false as const,
    authorityBoundary: {
      evidencePlanningOnly: true as const,
      canonicalApprovalBound: true as const,
      canonicalLevelTwoEvidenceBound:
        true as const,
      canonicalRuntimeIssuanceBound:
        true as const,
      exactEightCandidatePlansRequired:
        true as const,
      levelThreeAuthorityGranted:
        false as const,
      secondTaskExecutionAuthorized:
        false as const,
      thirdTaskExecutionAuthorized:
        false as const,
      concurrentExecutionAuthorized:
        false as const,
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      branchCreationAuthorized:
        false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      productionDatabaseAuthorized:
        false as const,
      productionMutationAuthorized:
        false as const,
      productionDeploymentAuthorized:
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
      founderLiberationAchieved:
        false as const,
      founderReleasedFromRoutineExecution:
        false as const,
      monitoringRequired: true as const,
      emergencyPauseRequired:
        true as const,
      rollbackEvidenceRequired:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW" as const,
    preparedAt:
      input.preparedAt,
  };

  const record =
    deepFreeze({
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    }) as EngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation;

  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-first-workstream-evidence-plan-preparation-001",
    preparedAt:
      "2026-08-01T17:45:00.000Z",
  });