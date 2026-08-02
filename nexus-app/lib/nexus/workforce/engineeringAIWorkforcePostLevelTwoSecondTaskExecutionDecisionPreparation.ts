import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation,
} from "./engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-second-task-execution-decision-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS =
  [
    "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
    "REJECT_AND_RETAIN_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION",
  ] as const;

export type EngineeringAIWorkforceSecondTaskExecutionDecisionOption =
  (
    typeof ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS
  )[number];

export const ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_REASONS =
  [
    "Prepare an owner decision for Ishaan's bounded synthetic architecture-evolution task only, with deterministic evidence, immediate owner review, zero repository access, and no production authority.",
    "Prepare an owner decision for Leela's bounded synthetic engineering-delivery coordination task only, with sequential operation, deterministic evidence, and no concurrent execution authority.",
    "Prepare an owner decision for Vivaan's bounded synthetic regression-risk containment task only, without executing tests, changing code, or accessing any repository.",
    "Prepare an owner decision for Anaya's bounded synthetic security-boundary review task only, without secrets, repository, customer, provider, or production access.",
    "Prepare an owner decision for Atharv's bounded synthetic reliability and recovery task only, without live-provider activity, production access, or deployment authority.",
    "Prepare an owner decision for Mahir's bounded synthetic chaos and failure-containment task only, without injecting any real failure or affecting any live environment.",
    "Prepare an owner decision for Zara's bounded synthetic data-pipeline quality task only, without customer data, database access, mutation, or external delivery.",
    "Prepare an owner decision for Advik's bounded synthetic systems-evaluation and red-team task only, without adversarial execution, authority bypass, or repository access.",
  ] as const;

export interface EngineeringAIWorkforceCandidateSecondTaskExecutionDecisionPreparation {
  readonly sequence:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8;
  readonly preparationState:
    "ENGINEERING_SECOND_TASK_EXECUTION_DECISION_PREPARED";
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly runtimeId: string;
  readonly sourceCandidatePlanDigest:
    string;
  readonly scenarioId: string;
  readonly objective: string;
  readonly expectedEvidence: string;
  readonly allowedDecisions:
    typeof ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS;
  readonly recommendedDecision:
    "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION";
  readonly reason: string;
  readonly dataClassification:
    "SYNTHETIC_SANITIZED_ONLY";
  readonly outputMode:
    "DECISION_PREPARATION_ONLY";
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
  readonly concurrentTaskLimit: 0;
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
  readonly candidateDecisionPreparationDigest:
    string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparationInput {
  readonly preparationId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_VERSION;
  readonly preparationId: string;
  readonly preparationState:
    "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_RECORDED";
  readonly tenantId: string;
  readonly ownerId: string;
  readonly sourceEvidencePlanReviewDecisionId:
    string;
  readonly sourceEvidencePlanReviewDecisionDigest:
    string;
  readonly sourceEvidencePlanPreparationId:
    string;
  readonly sourceEvidencePlanPreparationDigest:
    string;
  readonly workstreamSequence: 1;
  readonly workstreamId:
    "routine-engineering-second-task-evidence";
  readonly evidenceClass:
    "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE";
  readonly decisionPreparationOnly: true;
  readonly candidateDecisionPreparationCount:
    8;
  readonly candidateDecisionPreparations:
    readonly EngineeringAIWorkforceCandidateSecondTaskExecutionDecisionPreparation[];
  readonly summary: Readonly<{
    candidateCount: 8;
    evidencePlanAcceptedCount: 8;
    decisionPreparationCount: 8;
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
    productionDeploymentAuthorizedCount:
      0;
    publicLaunchAuthorizedCount: 0;
  }>;
  readonly ownerExecutionDecisionReviewRequired:
    true;
  readonly ownerExecutionDecisionReviewRecorded:
    false;
  readonly authorityBoundary: Readonly<{
    decisionPreparationOnly: true;
    canonicalEvidencePlanApprovalBound:
      true;
    canonicalEvidencePlanBound: true;
    exactEightCandidateDecisionPreparationsRequired:
      true;
    secondTaskExecutionAuthorized:
      false;
    secondTaskExecutionAuthorizedCount:
      0;
    thirdTaskExecutionAuthorized: false;
    concurrentExecutionAuthorized:
      false;
    aggregateConcurrentExecutionLimit:
      0;
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
    levelThreeAuthorityGranted: false;
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
    "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_REVIEW";
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
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;

const evidencePlan =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

function validateCanonicalSources(): void {
  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewDecision(
    approval,
  );

  validateEngineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation(
    evidencePlan,
  );

  if (
    approval.decision !==
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_ONLY" ||
    approval.evidencePlanAccepted !==
      true ||
    approval.secondTaskExecutionDecisionPreparationAuthorized !==
      true ||
    approval.secondTaskExecutionAuthorized !==
      false ||
    approval.consequentialAuthorityGranted !==
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
      .paymentExecutionAuthorized !==
      false ||
    approval.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    approval.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    approval.nextStep !==
      "AWAIT_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION" ||
    evidencePlan.candidatePlanCount !==
      8 ||
    evidencePlan.candidatePlans.length !==
      8 ||
    evidencePlan.summary
      .ownerExecutionDecisionRecordedCount !==
      0 ||
    evidencePlan.summary
      .secondTaskExecutionAuthorizedCount !==
      0 ||
    evidencePlan.summary
      .secondTaskExecutedCount !==
      0 ||
    evidencePlan.authorityBoundary
      .secondTaskExecutionAuthorized !==
      false ||
    evidencePlan.authorityBoundary
      .concurrentExecutionAuthorized !==
      false ||
    evidencePlan.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    evidencePlan.authorityBoundary
      .repositoryWriteAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering second-task execution-decision preparation sources are invalid.",
    );
  }
}

function validateCandidateDecisionPreparation(
  record:
    EngineeringAIWorkforceCandidateSecondTaskExecutionDecisionPreparation,
  index: number,
): void {
  const source =
    evidencePlan.candidatePlans[index];

  const reason =
    ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_REASONS[index];

  if (!source || !reason) {
    throw new Error(
      "Engineering second-task execution-decision candidate source is missing.",
    );
  }

  if (
    record.sequence !== index + 1 ||
    record.preparationState !==
      "ENGINEERING_SECOND_TASK_EXECUTION_DECISION_PREPARED" ||
    record.employeeId !==
      source.employeeId ||
    record.employeeCode !==
      source.employeeCode ||
    record.publicName !==
      source.publicName ||
    record.officialRole !==
      source.officialRole ||
    record.runtimeId !==
      source.runtimeId ||
    record.sourceCandidatePlanDigest !==
      source.candidatePlanDigest ||
    record.scenarioId !==
      source.scenarioId ||
    record.objective !==
      source.objective ||
    record.expectedEvidence !==
      source.expectedEvidence ||
    record.allowedDecisions !==
      ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS ||
    record.recommendedDecision !==
      "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" ||
    record.reason !== reason ||
    record.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    record.outputMode !==
      "DECISION_PREPARATION_ONLY" ||
    record.ownerExecutionDecisionRequired !==
      true ||
    record.ownerExecutionDecisionRecorded !==
      false ||
    record.ownerReviewAfterExecutionRequired !==
      true ||
    record.secondTaskExecutionAuthorized !==
      false ||
    record.secondTaskExecuted !== false ||
    record.concurrentExecutionAuthorized !==
      false ||
    record.concurrentTaskLimit !== 0 ||
    record.repositoryReadAuthorized !==
      false ||
    record.repositoryWriteAuthorized !==
      false ||
    record.branchCreationAuthorized !==
      false ||
    record.pullRequestPreparationAuthorized !==
      false ||
    record.mergeAuthorized !== false ||
    record.secretsAccessAuthorized !==
      false ||
    record.realCustomerDataAccessAuthorized !==
      false ||
    record.realCustomerContactAuthorized !==
      false ||
    record.externalDeliveryAuthorized !==
      false ||
    record.liveProviderExecutionAuthorized !==
      false ||
    record.productionDatabaseAuthorized !==
      false ||
    record.productionMutationAuthorized !==
      false ||
    record.productionDeploymentAuthorized !==
      false ||
    record.paymentExecutionAuthorized !==
      false ||
    record.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Engineering second-task execution-decision candidate preparation is invalid.",
    );
  }

  const {
    candidateDecisionPreparationDigest,
    ...candidateCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      candidateDecisionPreparationDigest,
    ) ||
    sha256(candidateCore) !==
      candidateDecisionPreparationDigest
  ) {
    throw new Error(
      "Engineering second-task execution-decision candidate preparation digest is invalid.",
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering second-task execution-decision preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Engineering second-task execution-decision preparation time",
    record.preparedAt,
  );

  if (
    !SHA256_PATTERN.test(
      record.preparationDigest,
    )
  ) {
    throw new Error(
      "Engineering second-task execution-decision preparation digest is invalid.",
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
      "Engineering second-task execution-decision preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_RECORDED" ||
    record.tenantId !==
      approval.tenantId ||
    record.ownerId !== approval.ownerId ||
    record.sourceEvidencePlanReviewDecisionId !==
      approval.decisionId ||
    record.sourceEvidencePlanReviewDecisionDigest !==
      approval.decisionDigest ||
    record.sourceEvidencePlanPreparationId !==
      evidencePlan.preparationId ||
    record.sourceEvidencePlanPreparationDigest !==
      evidencePlan.preparationDigest ||
    record.workstreamSequence !== 1 ||
    record.workstreamId !==
      "routine-engineering-second-task-evidence" ||
    record.evidenceClass !==
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" ||
    record.decisionPreparationOnly !==
      true ||
    record.candidateDecisionPreparationCount !==
      8 ||
    record.candidateDecisionPreparations.length !==
      8 ||
    record.ownerExecutionDecisionReviewRequired !==
      true ||
    record.ownerExecutionDecisionReviewRecorded !==
      false ||
    Date.parse(record.preparedAt) <
      Date.parse(approval.decidedAt) ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_REVIEW"
  ) {
    throw new Error(
      "Engineering second-task execution-decision preparation identity is invalid.",
    );
  }

  record.candidateDecisionPreparations.forEach(
    validateCandidateDecisionPreparation,
  );

  const summary =
    record.summary;

  if (
    summary.candidateCount !== 8 ||
    summary.evidencePlanAcceptedCount !==
      8 ||
    summary.decisionPreparationCount !==
      8 ||
    summary.ownerExecutionDecisionRequiredCount !==
      8 ||
    summary.ownerExecutionDecisionRecordedCount !==
      0 ||
    summary.secondTaskExecutionAuthorizedCount !==
      0 ||
    summary.secondTaskExecutedCount !==
      0 ||
    summary.concurrentExecutionAuthorizedCount !==
      0 ||
    summary.repositoryReadAuthorizedCount !==
      0 ||
    summary.repositoryWriteAuthorizedCount !==
      0 ||
    summary.productionDeploymentAuthorizedCount !==
      0 ||
    summary.publicLaunchAuthorizedCount !==
      0
  ) {
    throw new Error(
      "Engineering second-task execution-decision preparation summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  if (
    boundary.decisionPreparationOnly !==
      true ||
    boundary.canonicalEvidencePlanApprovalBound !==
      true ||
    boundary.canonicalEvidencePlanBound !==
      true ||
    boundary.exactEightCandidateDecisionPreparationsRequired !==
      true ||
    boundary.secondTaskExecutionAuthorized !==
      false ||
    boundary.secondTaskExecutionAuthorizedCount !==
      0 ||
    boundary.thirdTaskExecutionAuthorized !==
      false ||
    boundary.concurrentExecutionAuthorized !==
      false ||
    boundary.aggregateConcurrentExecutionLimit !==
      0 ||
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
      "Engineering second-task execution-decision preparation authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparationInput,
): EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering second-task execution-decision preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering second-task execution-decision preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
      Date.parse(approval.decidedAt)
  ) {
    throw new Error(
      "Engineering second-task execution-decision preparation cannot precede owner evidence-plan approval.",
    );
  }

  const candidateDecisionPreparations =
    evidencePlan.candidatePlans.map(
      (source, index) => {
        const reason =
          ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_REASONS[index];

        if (!reason) {
          throw new Error(
            "Engineering second-task execution-decision preparation reason is missing.",
          );
        }

        const candidateCore = {
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
          preparationState:
            "ENGINEERING_SECOND_TASK_EXECUTION_DECISION_PREPARED" as const,
          employeeId:
            source.employeeId,
          employeeCode:
            source.employeeCode,
          publicName:
            source.publicName,
          officialRole:
            source.officialRole,
          runtimeId:
            source.runtimeId,
          sourceCandidatePlanDigest:
            source.candidatePlanDigest,
          scenarioId:
            source.scenarioId,
          objective:
            source.objective,
          expectedEvidence:
            source.expectedEvidence,
          allowedDecisions:
            ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS,
          recommendedDecision:
            "APPROVE_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" as const,
          reason,
          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY" as const,
          outputMode:
            "DECISION_PREPARATION_ONLY" as const,
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
          concurrentTaskLimit: 0 as const,
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
          ...candidateCore,
          candidateDecisionPreparationDigest:
            sha256(candidateCore),
        });
      },
    ) as readonly EngineeringAIWorkforceCandidateSecondTaskExecutionDecisionPreparation[];

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_VERSION,
    preparationId:
      input.preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION_RECORDED" as const,
    tenantId:
      approval.tenantId,
    ownerId:
      approval.ownerId,
    sourceEvidencePlanReviewDecisionId:
      approval.decisionId,
    sourceEvidencePlanReviewDecisionDigest:
      approval.decisionDigest,
    sourceEvidencePlanPreparationId:
      evidencePlan.preparationId,
    sourceEvidencePlanPreparationDigest:
      evidencePlan.preparationDigest,
    workstreamSequence: 1 as const,
    workstreamId:
      "routine-engineering-second-task-evidence" as const,
    evidenceClass:
      "SECOND_SYNTHETIC_TASK_PLANNING_EVIDENCE" as const,
    decisionPreparationOnly:
      true as const,
    candidateDecisionPreparationCount:
      8 as const,
    candidateDecisionPreparations,
    summary: {
      candidateCount: 8 as const,
      evidencePlanAcceptedCount:
        8 as const,
      decisionPreparationCount:
        8 as const,
      ownerExecutionDecisionRequiredCount:
        8 as const,
      ownerExecutionDecisionRecordedCount:
        0 as const,
      secondTaskExecutionAuthorizedCount:
        0 as const,
      secondTaskExecutedCount:
        0 as const,
      concurrentExecutionAuthorizedCount:
        0 as const,
      repositoryReadAuthorizedCount:
        0 as const,
      repositoryWriteAuthorizedCount:
        0 as const,
      productionDeploymentAuthorizedCount:
        0 as const,
      publicLaunchAuthorizedCount:
        0 as const,
    },
    ownerExecutionDecisionReviewRequired:
      true as const,
    ownerExecutionDecisionReviewRecorded:
      false as const,
    authorityBoundary: {
      decisionPreparationOnly:
        true as const,
      canonicalEvidencePlanApprovalBound:
        true as const,
      canonicalEvidencePlanBound:
        true as const,
      exactEightCandidateDecisionPreparationsRequired:
        true as const,
      secondTaskExecutionAuthorized:
        false as const,
      secondTaskExecutionAuthorizedCount:
        0 as const,
      thirdTaskExecutionAuthorized:
        false as const,
      concurrentExecutionAuthorized:
        false as const,
      aggregateConcurrentExecutionLimit:
        0 as const,
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
      emergencyPauseRequired:
        true as const,
      rollbackEvidenceRequired:
        true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_REVIEW" as const,
    preparedAt:
      input.preparedAt,
  };

  const record =
    deepFreeze({
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    }) as EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation;

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-second-task-execution-decision-preparation-001",
    preparedAt:
      "2026-08-01T18:05:00.000Z",
  });