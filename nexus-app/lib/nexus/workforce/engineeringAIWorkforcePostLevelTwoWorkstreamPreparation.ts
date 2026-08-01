import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION,
} from "./engineeringAIWorkforcePostLevelTwoScopeDefinition";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoScopeApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoScopeDecision,
} from "./engineeringAIWorkforcePostLevelTwoScopeDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-workstream-preparation-v1" as const;

export type EngineeringAIWorkforcePostLevelTwoEvidenceClass =
  | "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE"
  | "CONCURRENT_COORDINATION_SAFETY_EVIDENCE"
  | "REPOSITORY_READ_ONLY_SANDBOX_QUALIFICATION_EVIDENCE"
  | "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE";

export interface EngineeringAIWorkforcePostLevelTwoPreparedWorkstream {
  readonly sequence: 1 | 2 | 3 | 4;
  readonly workstreamId: string;
  readonly objective: string;
  readonly completionEvidenceRequired:
    string;
  readonly evidenceClass:
    EngineeringAIWorkforcePostLevelTwoEvidenceClass;
  readonly preparationState:
    "ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARED";
  readonly preparationOnly: true;
  readonly syntheticSanitizedEvidenceOnly:
    true;
  readonly deterministicEvidenceRequired:
    true;
  readonly ownerReviewRequired: true;
  readonly independentValidationRequired:
    true;
  readonly monitoringRequired: true;
  readonly emergencyPauseRequired: true;
  readonly rollbackEvidenceRequired: true;
  readonly maximumPlannedEvidenceItemCount:
    8;
  readonly taskExecutionAuthorized: false;
  readonly concurrentExecutionAuthorized:
    false;
  readonly repositoryReadAuthorized: false;
  readonly repositoryWriteAuthorized: false;
  readonly productionMutationAuthorized:
    false;
  readonly customerContactAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly publicLaunchAuthorized: false;
  readonly workstreamDigest: string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationInput {
  readonly preparationId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_VERSION;
  readonly preparationId: string;
  readonly preparationState:
    "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_WORKSTREAMS_PREPARED";
  readonly sourceApprovalDecisionId:
    string;
  readonly sourceApprovalDecisionDigest:
    string;
  readonly sourceScopeId: string;
  readonly sourceScopeDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly boundedPreparationAuthorized:
    true;
  readonly consequentialAuthorityGranted:
    false;
  readonly workstreamCount: 4;
  readonly preparedWorkstreams:
    readonly EngineeringAIWorkforcePostLevelTwoPreparedWorkstream[];
  readonly evidencePlanSummary: Readonly<{
    preparedWorkstreamCount: 4;
    totalMaximumPlannedEvidenceItemCount:
      32;
    syntheticSanitizedOnlyCount: 4;
    ownerReviewRequiredCount: 4;
    independentValidationRequiredCount:
      4;
    monitoringRequiredCount: 4;
    emergencyPauseRequiredCount: 4;
    rollbackEvidenceRequiredCount: 4;
    taskExecutionAuthorizedCount: 0;
    concurrentExecutionAuthorizedCount:
      0;
    repositoryReadAuthorizedCount: 0;
    repositoryWriteAuthorizedCount: 0;
  }>;
  readonly ownerPreparationReviewRequired:
    true;
  readonly ownerPreparationReviewRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    preparationOnly: true;
    sourceApprovalBound: true;
    exactFourWorkstreamsRequired: true;
    workstreamExecutionAuthorized:
      false;
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
    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized:
      false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
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
    "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW";
  readonly preparedAt: string;
  readonly preparationDigest: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const EVIDENCE_CLASSES:
  readonly EngineeringAIWorkforcePostLevelTwoEvidenceClass[] =
  [
    "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE",
    "CONCURRENT_COORDINATION_SAFETY_EVIDENCE",
    "REPOSITORY_READ_ONLY_SANDBOX_QUALIFICATION_EVIDENCE",
    "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE",
  ];

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
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_APPROVAL_DECISION;

const scope =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SCOPE_DEFINITION;

function validateCanonicalApproval(): void {
  validateEngineeringAIWorkforcePostLevelTwoScopeDecision(
    approval,
  );

  if (
    approval.decision !==
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_SCOPE_PREPARATION_ONLY" ||
    approval.scopeApproved !== true ||
    approval.boundedPreparationAuthorized !==
      true ||
    approval.consequentialAuthorityGranted !==
      false ||
    approval.sourceScopeId !==
      scope.scopeId ||
    approval.sourceScopeDigest !==
      scope.scopeDigest ||
    approval.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    approval.authorityBoundary
      .secondTaskExecutionAuthorized !==
      false ||
    approval.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    approval.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    approval.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    approval.authorityBoundary
      .productionDeploymentAuthorized !==
      false ||
    approval.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    approval.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    approval.nextStep !==
      "AWAIT_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION"
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream preparation approval is invalid.",
    );
  }
}

function validatePreparedWorkstream(
  workstream:
    EngineeringAIWorkforcePostLevelTwoPreparedWorkstream,
  index: number,
): void {
  const source =
    scope.workstreams[index];

  if (!source) {
    throw new Error(
      "Engineering post-Level-2 source workstream is missing.",
    );
  }

  if (
    workstream.sequence !==
      index + 1 ||
    workstream.workstreamId !==
      source.workstreamId ||
    workstream.objective !==
      source.objective ||
    workstream.completionEvidenceRequired !==
      source.completionEvidenceRequired ||
    workstream.evidenceClass !==
      EVIDENCE_CLASSES[index] ||
    workstream.preparationState !==
      "ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARED" ||
    workstream.preparationOnly !==
      true ||
    workstream.syntheticSanitizedEvidenceOnly !==
      true ||
    workstream.deterministicEvidenceRequired !==
      true ||
    workstream.ownerReviewRequired !==
      true ||
    workstream.independentValidationRequired !==
      true ||
    workstream.monitoringRequired !==
      true ||
    workstream.emergencyPauseRequired !==
      true ||
    workstream.rollbackEvidenceRequired !==
      true ||
    workstream.maximumPlannedEvidenceItemCount !==
      8 ||
    workstream.taskExecutionAuthorized !==
      false ||
    workstream.concurrentExecutionAuthorized !==
      false ||
    workstream.repositoryReadAuthorized !==
      false ||
    workstream.repositoryWriteAuthorized !==
      false ||
    workstream.productionMutationAuthorized !==
      false ||
    workstream.customerContactAuthorized !==
      false ||
    workstream.paymentExecutionAuthorized !==
      false ||
    workstream.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering post-Level-2 prepared workstream is invalid.",
    );
  }

  const {
    workstreamDigest,
    ...workstreamCore
  } = workstream;

  if (
    !SHA256_PATTERN.test(
      workstreamDigest,
    ) ||
    sha256(workstreamCore) !==
      workstreamDigest
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream digest is invalid.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
): void {
  validateCanonicalApproval();

  requireIdentifier(
    "Engineering post-Level-2 workstream preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Engineering post-Level-2 workstream preparation time",
    record.preparedAt,
  );

  if (
    !SHA256_PATTERN.test(
      record.preparationDigest,
    )
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream preparation digest is invalid.",
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
      "Engineering post-Level-2 workstream preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_WORKSTREAMS_PREPARED" ||
    record.sourceApprovalDecisionId !==
      approval.decisionId ||
    record.sourceApprovalDecisionDigest !==
      approval.decisionDigest ||
    record.sourceScopeId !==
      scope.scopeId ||
    record.sourceScopeDigest !==
      scope.scopeDigest ||
    record.tenantId !==
      approval.tenantId ||
    record.ownerId !==
      approval.ownerId ||
    record.boundedPreparationAuthorized !==
      true ||
    record.consequentialAuthorityGranted !==
      false ||
    record.workstreamCount !==
      4 ||
    record.preparedWorkstreams.length !==
      4 ||
    record.ownerPreparationReviewRequired !==
      true ||
    record.ownerPreparationReviewRecorded !==
      false ||
    Date.parse(record.preparedAt) <
      Date.parse(approval.decidedAt) ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW"
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream preparation identity is invalid.",
    );
  }

  record.preparedWorkstreams.forEach(
    validatePreparedWorkstream,
  );

  const summary =
    record.evidencePlanSummary;

  if (
    summary.preparedWorkstreamCount !==
      4 ||
    summary.totalMaximumPlannedEvidenceItemCount !==
      32 ||
    summary.syntheticSanitizedOnlyCount !==
      4 ||
    summary.ownerReviewRequiredCount !==
      4 ||
    summary.independentValidationRequiredCount !==
      4 ||
    summary.monitoringRequiredCount !==
      4 ||
    summary.emergencyPauseRequiredCount !==
      4 ||
    summary.rollbackEvidenceRequiredCount !==
      4 ||
    summary.taskExecutionAuthorizedCount !==
      0 ||
    summary.concurrentExecutionAuthorizedCount !==
      0 ||
    summary.repositoryReadAuthorizedCount !==
      0 ||
    summary.repositoryWriteAuthorizedCount !==
      0
  ) {
    throw new Error(
      "Engineering post-Level-2 evidence-plan summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.preparationOnly !== true ||
    boundary.sourceApprovalBound !==
      true ||
    boundary.exactFourWorkstreamsRequired !==
      true ||
    boundary.workstreamExecutionAuthorized !==
      false ||
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
      "Engineering post-Level-2 workstream preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationInput,
): EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation {
  validateCanonicalApproval();

  requireIdentifier(
    "Engineering post-Level-2 workstream preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering post-Level-2 workstream preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
      Date.parse(approval.decidedAt)
  ) {
    throw new Error(
      "Engineering post-Level-2 workstream preparation cannot precede owner approval.",
    );
  }

  const preparedWorkstreams =
    scope.workstreams.map(
      (sourceWorkstream, index) => {
        const workstreamCore = {
          sequence:
            (index + 1) as 1 | 2 | 3 | 4,
          workstreamId:
            sourceWorkstream.workstreamId,
          objective:
            sourceWorkstream.objective,
          completionEvidenceRequired:
            sourceWorkstream.completionEvidenceRequired,
          evidenceClass:
            EVIDENCE_CLASSES[index] as EngineeringAIWorkforcePostLevelTwoEvidenceClass,
          preparationState:
            "ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARED" as const,
          preparationOnly:
            true as const,
          syntheticSanitizedEvidenceOnly:
            true as const,
          deterministicEvidenceRequired:
            true as const,
          ownerReviewRequired:
            true as const,
          independentValidationRequired:
            true as const,
          monitoringRequired:
            true as const,
          emergencyPauseRequired:
            true as const,
          rollbackEvidenceRequired:
            true as const,
          maximumPlannedEvidenceItemCount:
            8 as const,
          taskExecutionAuthorized:
            false as const,
          concurrentExecutionAuthorized:
            false as const,
          repositoryReadAuthorized:
            false as const,
          repositoryWriteAuthorized:
            false as const,
          productionMutationAuthorized:
            false as const,
          customerContactAuthorized:
            false as const,
          paymentExecutionAuthorized:
            false as const,
          publicLaunchAuthorized:
            false as const,
        };

        return deepFreeze({
          ...workstreamCore,
          workstreamDigest:
            sha256(workstreamCore),
        });
      },
    ) as readonly EngineeringAIWorkforcePostLevelTwoPreparedWorkstream[];

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_VERSION,
    preparationId:
      input.preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_WORKSTREAMS_PREPARED" as const,
    sourceApprovalDecisionId:
      approval.decisionId,
    sourceApprovalDecisionDigest:
      approval.decisionDigest,
    sourceScopeId:
      scope.scopeId,
    sourceScopeDigest:
      scope.scopeDigest,
    tenantId:
      approval.tenantId,
    ownerId:
      approval.ownerId,
    boundedPreparationAuthorized:
      true as const,
    consequentialAuthorityGranted:
      false as const,
    workstreamCount:
      4 as const,
    preparedWorkstreams,
    evidencePlanSummary: {
      preparedWorkstreamCount:
        4 as const,
      totalMaximumPlannedEvidenceItemCount:
        32 as const,
      syntheticSanitizedOnlyCount:
        4 as const,
      ownerReviewRequiredCount:
        4 as const,
      independentValidationRequiredCount:
        4 as const,
      monitoringRequiredCount:
        4 as const,
      emergencyPauseRequiredCount:
        4 as const,
      rollbackEvidenceRequiredCount:
        4 as const,
      taskExecutionAuthorizedCount:
        0 as const,
      concurrentExecutionAuthorizedCount:
        0 as const,
      repositoryReadAuthorizedCount:
        0 as const,
      repositoryWriteAuthorizedCount:
        0 as const,
    },
    ownerPreparationReviewRequired:
      true as const,
    ownerPreparationReviewRecorded:
      false as const,
    authorityBoundary: {
      preparationOnly:
        true as const,
      sourceApprovalBound:
        true as const,
      exactFourWorkstreamsRequired:
        true as const,
      workstreamExecutionAuthorized:
        false as const,
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
      monitoringRequired:
        true as const,
      emergencyPauseRequired:
        true as const,
      rollbackEvidenceRequired:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW" as const,
    preparedAt:
      input.preparedAt,
  };

  const record =
    deepFreeze({
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    }) as EngineeringAIWorkforcePostLevelTwoWorkstreamPreparation;

  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-workstream-preparation-001",
    preparedAt:
      "2026-08-01T17:20:00.000Z",
  });