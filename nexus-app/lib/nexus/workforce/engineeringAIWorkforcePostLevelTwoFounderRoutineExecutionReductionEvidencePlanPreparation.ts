import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision,
} from "./engineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-plan-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PROFILES =
  [
    {
      controlId:
        "ROUTINE_ENGINEERING_WORK_COVERAGE_BASELINE",
      objective:
        "Define the bounded routine engineering work categories whose repeatable execution may be evaluated for AI workforce coverage without transferring founder-reserved authority.",
      expectedEvidence:
        "A synthetic routine-work inventory and coverage matrix distinguishing repeatable execution, exception handling, owner-reserved decisions, prohibited actions, and uncovered work.",
    },
    {
      controlId:
        "OWNER_RESERVED_AUTHORITY_AND_DECISION_BOUNDARY",
      objective:
        "Define the exact founder-reserved decisions, approvals, credentials, financial commitments, legal commitments, production actions, customer contact, and emergency controls that cannot be delegated.",
      expectedEvidence:
        "A deterministic authority-boundary matrix proving every founder-reserved decision remains blocked from autonomous AI execution and routes to explicit owner review.",
    },
    {
      controlId:
        "ROUTINE_TASK_QUALITY_AND_ACCEPTANCE_THRESHOLD",
      objective:
        "Define measurable correctness, completeness, consistency, safety, evidence quality, and owner-acceptance thresholds for routine engineering work.",
      expectedEvidence:
        "Synthetic task-result comparisons with explicit pass, reject, correction, regression, and owner-acceptance criteria and zero acceptance of below-threshold work.",
    },
    {
      controlId:
        "FAILURE_RECOVERY_ROLLBACK_AND_RESUME_READINESS",
      objective:
        "Define recovery, rollback, deterministic retry, duplicate prevention, safe resume, and owner-controlled restoration evidence for routine engineering failures.",
      expectedEvidence:
        "Synthetic failure and recovery scenarios proving fail-closed pause, bounded rollback, idempotent retry, duplicate rejection, safe resume, and complete recovery evidence.",
    },
    {
      controlId:
        "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY",
      objective:
        "Define escalation triggers and response boundaries for ambiguity, conflicting instructions, quality defects, security signals, repeated failure, scope escape, and unauthorized authority requests.",
      expectedEvidence:
        "A synthetic escalation matrix proving risky or ambiguous routine work is paused, owner control is returned, no unauthorized progression occurs, and every escalation is auditable.",
    },
    {
      controlId:
        "FOUNDER_INTERVENTION_AND_TIME_REDUCTION_MEASUREMENT",
      objective:
        "Define measurable founder intervention, review time, correction time, routine execution time, escalation load, and retained decision load without treating reduced activity as proof of liberation.",
      expectedEvidence:
        "A deterministic before-and-after measurement plan with bounded workload units, founder touchpoints, intervention minutes, review minutes, correction minutes, and explicit non-liberation safeguards.",
    },
    {
      controlId:
        "SUSTAINED_OPERATION_QUALITY_AND_REGRESSION_STABILITY",
      objective:
        "Define sustained multi-cycle evidence showing routine engineering coverage remains correct, recoverable, auditable, tenant-bound, owner-controlled, and regression-safe over repeated synthetic operation.",
      expectedEvidence:
        "A synthetic repeated-cycle stability plan with quality trends, defect containment, recovery consistency, escalation consistency, audit continuity, and regression-gate evidence.",
    },
    {
      controlId:
        "FINAL_OWNER_ACCEPTANCE_AND_FOUNDER_LIBERATION_GATE",
      objective:
        "Define the final owner-acceptance evidence and explicit gate separating routine execution reduction from any later Founder Liberation determination.",
      expectedEvidence:
        "A synthetic final evidence-summary plan proving all required coverage, quality, recovery, escalation, measurement, stability, and owner-acceptance evidence must pass before any separate Founder Liberation assessment can be considered.",
    },
  ] as const;

export type EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceControlId =
  (typeof ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PROFILES)[number]["controlId"];

export interface EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceItem {
  readonly sequence: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  readonly evidenceState:
    "ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ITEM_PREPARED";
  readonly controlId:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceControlId;
  readonly objective: string;
  readonly expectedEvidence: string;
  readonly dataClassification:
    "SYNTHETIC_SANITIZED_ONLY";
  readonly outputMode: "PLAN_ONLY";
  readonly evidenceToolMode:
    "READ_ONLY_EVIDENCE_ONLY";
  readonly deterministicEvidenceRequired: true;
  readonly independentValidationRequired: true;
  readonly ownerReviewRequired: true;
  readonly monitoringRequired: true;
  readonly emergencyPauseRequired: true;
  readonly rollbackEvidenceRequired: true;
  readonly tenantBindingRequired: true;
  readonly ownerBindingRequired: true;
  readonly routineWorkCoverageRequired: true;
  readonly qualityThresholdRequired: true;
  readonly recoveryEvidenceRequired: true;
  readonly escalationEvidenceRequired: true;
  readonly founderInterventionMeasurementRequired:
    true;
  readonly ownerAcceptanceRequired: true;
  readonly founderLiberationSeparationRequired:
    true;
  readonly planPreparationAuthorized: true;
  readonly evidenceExecutionAuthorized: false;
  readonly taskExecutionAuthorized: false;
  readonly repositoryEvaluationAuthorized: false;
  readonly repositoryReadAuthorized: false;
  readonly repositoryWriteAuthorized: false;
  readonly filesystemMutationAuthorized: false;
  readonly gitMutationAuthorized: false;
  readonly commandExecutionAuthorized: false;
  readonly packageExecutionAuthorized: false;
  readonly networkAccessAuthorized: false;
  readonly branchCreationAuthorized: false;
  readonly pullRequestPreparationAuthorized: false;
  readonly mergeAuthorized: false;
  readonly secretsAccessAuthorized: false;
  readonly realCustomerDataAccessAuthorized: false;
  readonly realCustomerContactAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly liveProviderExecutionAuthorized: false;
  readonly productionDatabaseAuthorized: false;
  readonly productionMutationAuthorized: false;
  readonly productionDeploymentAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly publicLaunchAuthorized: false;
  readonly evidenceItemDigest: string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparationInput {
  readonly preparationId: string;
  readonly sourcePriorWorkstreamClosure:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION;
  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

const priorWorkstreamClosure =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [
          key,
          normalize(record[key]),
        ]),
    );
  }

  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(
      JSON.stringify(normalize(value)),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.values(
      value as Record<string, unknown>,
    ).forEach(deepFreeze);

    Object.freeze(value);
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    value.trim() !== value ||
    !IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    value.trim() !== value ||
    !value.endsWith("Z") ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(`${label} is invalid.`);
  }
}

function validateCanonicalPriorWorkstreamClosure(): void {
  validateEngineeringAIWorkforcePostLevelTwoRepositoryReadOnlySandboxEvaluationWorkstreamClosureDecision(
    priorWorkstreamClosure,
  );

  const boundary =
    priorWorkstreamClosure.authorityBoundary;

  if (
    priorWorkstreamClosure.workstreamSequence !==
      3 ||
    priorWorkstreamClosure.workstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    priorWorkstreamClosure.closureRecordAccepted !==
      true ||
    priorWorkstreamClosure
      .formalClosureDecisionRecorded !== true ||
    priorWorkstreamClosure
      .workstreamClosureAuthorized !== true ||
    priorWorkstreamClosure
      .workstreamClosurePerformed !== true ||
    priorWorkstreamClosure.workstreamClosed !==
      true ||
    priorWorkstreamClosure.nextWorkstreamSequence !==
      4 ||
    priorWorkstreamClosure.nextWorkstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    priorWorkstreamClosure
      .nextWorkstreamEvidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    boundary.workstreamThreeClosed !== true ||
    boundary
      .workstreamFourPlanPreparationAuthorized !==
      true ||
    boundary
      .workstreamFourPlanPreparationPerformed !==
      false ||
    boundary
      .onlyWorkstreamFourPlanPreparationAuthorizedNext !==
      true ||
    boundary
      .workstreamFourEvidenceExecutionAuthorized !==
      false ||
    boundary.nextWorkstreamExecutionAuthorized !==
      false ||
    boundary
      .nextWorkstreamAutonomousStartAuthorized !==
      false ||
    boundary
      .actualRepositoryEvaluationAuthorized !==
      false ||
    boundary
      .actualRepositoryEvaluationPerformed !==
      false ||
    boundary.repositoryReadAuthorized !== false ||
    boundary.repositoryWriteAuthorized !== false ||
    boundary.filesystemReadAuthorized !== false ||
    boundary.filesystemMutationAuthorized !==
      false ||
    boundary.commandExecutionAuthorized !== false ||
    boundary.packageExecutionAuthorized !== false ||
    boundary.networkAccessAuthorized !== false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.founderLiberationAchieved !== false ||
    boundary
      .founderReleasedFromRoutineExecution !==
      false ||
    priorWorkstreamClosure.nextStep !==
      "PREPARE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN"
  ) {
    throw new Error(
      "Canonical Founder Routine Execution Reduction evidence-plan prerequisites are invalid.",
    );
  }
}

function createEvidenceItems(): readonly EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceItem[] {
  return ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PROFILES.map(
    (profile, index) => {
      const itemCore = {
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
        evidenceState:
          "ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ITEM_PREPARED" as const,
        controlId: profile.controlId,
        objective: profile.objective,
        expectedEvidence:
          profile.expectedEvidence,
        dataClassification:
          "SYNTHETIC_SANITIZED_ONLY" as const,
        outputMode: "PLAN_ONLY" as const,
        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY" as const,
        deterministicEvidenceRequired:
          true as const,
        independentValidationRequired:
          true as const,
        ownerReviewRequired: true as const,
        monitoringRequired: true as const,
        emergencyPauseRequired: true as const,
        rollbackEvidenceRequired: true as const,
        tenantBindingRequired: true as const,
        ownerBindingRequired: true as const,
        routineWorkCoverageRequired:
          true as const,
        qualityThresholdRequired: true as const,
        recoveryEvidenceRequired: true as const,
        escalationEvidenceRequired: true as const,
        founderInterventionMeasurementRequired:
          true as const,
        ownerAcceptanceRequired: true as const,
        founderLiberationSeparationRequired:
          true as const,
        planPreparationAuthorized: true as const,
        evidenceExecutionAuthorized:
          false as const,
        taskExecutionAuthorized: false as const,
        repositoryEvaluationAuthorized:
          false as const,
        repositoryReadAuthorized: false as const,
        repositoryWriteAuthorized:
          false as const,
        filesystemMutationAuthorized:
          false as const,
        gitMutationAuthorized: false as const,
        commandExecutionAuthorized:
          false as const,
        packageExecutionAuthorized:
          false as const,
        networkAccessAuthorized: false as const,
        branchCreationAuthorized: false as const,
        pullRequestPreparationAuthorized:
          false as const,
        mergeAuthorized: false as const,
        secretsAccessAuthorized: false as const,
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
        publicLaunchAuthorized: false as const,
      };

      return deepFreeze({
        ...itemCore,
        evidenceItemDigest:
          sha256(itemCore),
      });
    },
  );
}

function buildPreparation(
  preparationId: string,
  preparedAt: string,
) {
  const evidenceItems =
    deepFreeze(createEvidenceItems());

  const summary = deepFreeze({
    evidenceItemCount: 8 as const,
    syntheticSanitizedEvidenceItemCount:
      8 as const,
    planOnlyEvidenceItemCount: 8 as const,
    deterministicEvidenceRequiredCount:
      8 as const,
    independentValidationRequiredCount:
      8 as const,
    ownerReviewRequiredCount: 8 as const,
    monitoringRequiredCount: 8 as const,
    emergencyPauseRequiredCount: 8 as const,
    rollbackEvidenceRequiredCount:
      8 as const,
    tenantBindingRequiredCount: 8 as const,
    ownerBindingRequiredCount: 8 as const,
    routineWorkCoverageRequiredCount:
      8 as const,
    qualityThresholdRequiredCount:
      8 as const,
    recoveryEvidenceRequiredCount:
      8 as const,
    escalationEvidenceRequiredCount:
      8 as const,
    founderInterventionMeasurementRequiredCount:
      8 as const,
    ownerAcceptanceRequiredCount:
      8 as const,
    founderLiberationSeparationRequiredCount:
      8 as const,
    planPreparationAuthorizedCount:
      8 as const,
    evidenceExecutionAuthorizedCount:
      0 as const,
    taskExecutionAuthorizedCount: 0 as const,
    repositoryEvaluationAuthorizedCount:
      0 as const,
    repositoryReadAuthorizedCount:
      0 as const,
    repositoryWriteAuthorizedCount:
      0 as const,
    filesystemMutationAuthorizedCount:
      0 as const,
    gitMutationAuthorizedCount: 0 as const,
    commandExecutionAuthorizedCount:
      0 as const,
    packageExecutionAuthorizedCount:
      0 as const,
    networkAccessAuthorizedCount:
      0 as const,
    productionDeploymentAuthorizedCount:
      0 as const,
    paymentExecutionAuthorizedCount:
      0 as const,
    publicLaunchAuthorizedCount: 0 as const,
  });

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION_VERSION,
    preparationId,
    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARED" as const,
    tenantId: priorWorkstreamClosure.tenantId,
    ownerId: priorWorkstreamClosure.ownerId,
    sourcePriorWorkstreamClosureDecisionId:
      priorWorkstreamClosure.decisionId,
    sourcePriorWorkstreamClosureDecisionDigest:
      priorWorkstreamClosure.decisionDigest,
    sourcePriorWorkstreamSequence:
      priorWorkstreamClosure.workstreamSequence,
    sourcePriorWorkstreamId:
      priorWorkstreamClosure.workstreamId,
    workstreamSequence: 4 as const,
    workstreamId:
      "founder-routine-execution-reduction-evidence" as const,
    objective:
      "Define measurable evidence for reducing founder routine engineering execution while preserving final owner authority." as const,
    completionEvidenceRequired:
      "Verified routine-work coverage, quality, recovery, escalation, and owner-acceptance evidence." as const,
    evidenceClass:
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" as const,
    planOnly: true as const,
    evidenceItemCount: 8 as const,
    evidenceItems,
    summary,
    ownerEvidencePlanReviewRequired:
      true as const,
    ownerEvidencePlanReviewRecorded:
      false as const,
    authorityBoundary: {
      evidencePlanningOnly: true as const,
      canonicalPriorWorkstreamClosureBound:
        true as const,
      priorWorkstreamClosed: true as const,
      exactEightEvidenceItemsRequired:
        true as const,
      workstreamFourPlanPreparationAuthorized:
        true as const,
      workstreamFourPlanPreparationPerformed:
        true as const,
      workstreamFourEvidenceExecutionAuthorized:
        false as const,
      founderRoutineExecutionReductionPlanningAuthorized:
        true as const,
      founderRoutineExecutionReductionPlanPrepared:
        true as const,
      founderRoutineExecutionReductionEvidenceAuthorized:
        false as const,
      founderRoutineExecutionReductionExecutionAuthorized:
        false as const,
      founderRoutineExecutionReductionClaimAuthorized:
        false as const,
      founderRoutineExecutionReductionClaimed:
        false as const,
      founderLiberationAssessmentAuthorized:
        false as const,
      founderLiberationAcceptanceAuthorized:
        false as const,
      taskExecutionAuthorized: false as const,
      actualRepositoryEvaluationAuthorized:
        false as const,
      actualRepositoryEvaluationPerformed:
        false as const,
      repositoryReadAuthorized: false as const,
      repositoryWriteAuthorized: false as const,
      filesystemReadAuthorized: false as const,
      filesystemMutationAuthorized:
        false as const,
      gitMutationAuthorized: false as const,
      commandExecutionAuthorized:
        false as const,
      packageExecutionAuthorized:
        false as const,
      networkAccessAuthorized: false as const,
      branchCreationAuthorized: false as const,
      pullRequestPreparationAuthorized:
        false as const,
      mergeAuthorized: false as const,
      secretsAccessAuthorized: false as const,
      sensitiveContentAccessAuthorized:
        false as const,
      sensitiveContentMaterializationAuthorized:
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
      concurrentEngineeringWorkAuthorized:
        false as const,
      aggregateConcurrentEngineeringWorkLimit:
        0 as const,
      levelThreeEvaluationAuthorized:
        false as const,
      levelThreeAuthorityGranted:
        false as const,
      productionReadinessAuthorized:
        false as const,
      publicLaunchAuthorized: false as const,
      founderLiberationAchieved:
        false as const,
      founderReleasedFromRoutineExecution:
        false as const,
      monitoringRequired: true as const,
      emergencyPauseRequired: true as const,
      rollbackEvidenceRequired: true as const,
      ownerReviewRequired: true as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },
    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW" as const,
    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,
    preparationDigest:
      sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation =
  ReturnType<typeof buildPreparation>;

function validateEvidenceItem(
  item:
    EngineeringAIWorkforceFounderRoutineExecutionReductionEvidenceItem,
  index: number,
): void {
  const profile =
    ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PROFILES[
      index
    ];

  if (!profile) {
    throw new Error(
      "Founder Routine Execution Reduction evidence profile is missing.",
    );
  }

  const {
    evidenceItemDigest,
    ...itemCore
  } = item;

  const requiredTrue = [
    item.deterministicEvidenceRequired,
    item.independentValidationRequired,
    item.ownerReviewRequired,
    item.monitoringRequired,
    item.emergencyPauseRequired,
    item.rollbackEvidenceRequired,
    item.tenantBindingRequired,
    item.ownerBindingRequired,
    item.routineWorkCoverageRequired,
    item.qualityThresholdRequired,
    item.recoveryEvidenceRequired,
    item.escalationEvidenceRequired,
    item.founderInterventionMeasurementRequired,
    item.ownerAcceptanceRequired,
    item.founderLiberationSeparationRequired,
    item.planPreparationAuthorized,
  ];

  const requiredFalse = [
    item.evidenceExecutionAuthorized,
    item.taskExecutionAuthorized,
    item.repositoryEvaluationAuthorized,
    item.repositoryReadAuthorized,
    item.repositoryWriteAuthorized,
    item.filesystemMutationAuthorized,
    item.gitMutationAuthorized,
    item.commandExecutionAuthorized,
    item.packageExecutionAuthorized,
    item.networkAccessAuthorized,
    item.branchCreationAuthorized,
    item.pullRequestPreparationAuthorized,
    item.mergeAuthorized,
    item.secretsAccessAuthorized,
    item.realCustomerDataAccessAuthorized,
    item.realCustomerContactAuthorized,
    item.externalDeliveryAuthorized,
    item.liveProviderExecutionAuthorized,
    item.productionDatabaseAuthorized,
    item.productionMutationAuthorized,
    item.productionDeploymentAuthorized,
    item.paymentExecutionAuthorized,
    item.publicLaunchAuthorized,
  ];

  if (
    !SHA256_PATTERN.test(evidenceItemDigest) ||
    sha256(itemCore) !== evidenceItemDigest ||
    item.sequence !== index + 1 ||
    item.evidenceState !==
      "ENGINEERING_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_ITEM_PREPARED" ||
    item.controlId !== profile.controlId ||
    item.objective !== profile.objective ||
    item.expectedEvidence !==
      profile.expectedEvidence ||
    item.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    item.outputMode !== "PLAN_ONLY" ||
    item.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    requiredTrue.some(
      (value) => value !== true,
    ) ||
    requiredFalse.some(
      (value) => value !== false,
    ) ||
    !Object.isFrozen(item)
  ) {
    throw new Error(
      `Founder Routine Execution Reduction evidence item ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation,
): void {
  validateCanonicalPriorWorkstreamClosure();

  requireIdentifier(
    "Founder Routine Execution Reduction evidence-plan preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Founder Routine Execution Reduction evidence-plan preparation time",
    record.preparedAt,
  );

  const {
    preparationDigest,
    ...preparationCore
  } = record;

  if (
    !SHA256_PATTERN.test(preparationDigest) ||
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARED" ||
    record.tenantId !==
      priorWorkstreamClosure.tenantId ||
    record.ownerId !==
      priorWorkstreamClosure.ownerId ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      priorWorkstreamClosure.decisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      priorWorkstreamClosure.decisionDigest ||
    record.sourcePriorWorkstreamSequence !== 3 ||
    record.sourcePriorWorkstreamId !==
      "repository-read-only-sandbox-evaluation" ||
    record.workstreamSequence !== 4 ||
    record.workstreamId !==
      "founder-routine-execution-reduction-evidence" ||
    record.objective !==
      "Define measurable evidence for reducing founder routine engineering execution while preserving final owner authority." ||
    record.completionEvidenceRequired !==
      "Verified routine-work coverage, quality, recovery, escalation, and owner-acceptance evidence." ||
    record.evidenceClass !==
      "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE" ||
    record.planOnly !== true ||
    record.evidenceItemCount !== 8 ||
    record.evidenceItems.length !== 8 ||
    record.ownerEvidencePlanReviewRequired !==
      true ||
    record.ownerEvidencePlanReviewRecorded !==
      false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(
        priorWorkstreamClosure.decidedAt,
      )
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan identity is invalid.",
    );
  }

  record.evidenceItems.forEach(
    validateEvidenceItem,
  );

  const summary = record.summary;

  if (
    summary.evidenceItemCount !== 8 ||
    summary.syntheticSanitizedEvidenceItemCount !==
      8 ||
    summary.planOnlyEvidenceItemCount !== 8 ||
    summary.deterministicEvidenceRequiredCount !==
      8 ||
    summary.independentValidationRequiredCount !==
      8 ||
    summary.ownerReviewRequiredCount !== 8 ||
    summary.monitoringRequiredCount !== 8 ||
    summary.emergencyPauseRequiredCount !== 8 ||
    summary.rollbackEvidenceRequiredCount !== 8 ||
    summary.tenantBindingRequiredCount !== 8 ||
    summary.ownerBindingRequiredCount !== 8 ||
    summary.routineWorkCoverageRequiredCount !==
      8 ||
    summary.qualityThresholdRequiredCount !== 8 ||
    summary.recoveryEvidenceRequiredCount !== 8 ||
    summary.escalationEvidenceRequiredCount !==
      8 ||
    summary.founderInterventionMeasurementRequiredCount !==
      8 ||
    summary.ownerAcceptanceRequiredCount !== 8 ||
    summary.founderLiberationSeparationRequiredCount !==
      8 ||
    summary.planPreparationAuthorizedCount !==
      8 ||
    summary.evidenceExecutionAuthorizedCount !==
      0 ||
    summary.taskExecutionAuthorizedCount !== 0 ||
    summary.repositoryEvaluationAuthorizedCount !==
      0 ||
    summary.repositoryReadAuthorizedCount !== 0 ||
    summary.repositoryWriteAuthorizedCount !==
      0 ||
    summary.filesystemMutationAuthorizedCount !==
      0 ||
    summary.gitMutationAuthorizedCount !== 0 ||
    summary.commandExecutionAuthorizedCount !==
      0 ||
    summary.packageExecutionAuthorizedCount !==
      0 ||
    summary.networkAccessAuthorizedCount !== 0 ||
    summary.productionDeploymentAuthorizedCount !==
      0 ||
    summary.paymentExecutionAuthorizedCount !==
      0 ||
    summary.publicLaunchAuthorizedCount !== 0
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan summary is invalid.",
    );
  }

  const boundary = record.authorityBoundary;

  const requiredTrue = [
    boundary.evidencePlanningOnly,
    boundary.canonicalPriorWorkstreamClosureBound,
    boundary.priorWorkstreamClosed,
    boundary.exactEightEvidenceItemsRequired,
    boundary.workstreamFourPlanPreparationAuthorized,
    boundary.workstreamFourPlanPreparationPerformed,
    boundary.founderRoutineExecutionReductionPlanningAuthorized,
    boundary.founderRoutineExecutionReductionPlanPrepared,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.workstreamFourEvidenceExecutionAuthorized,
    boundary.founderRoutineExecutionReductionEvidenceAuthorized,
    boundary.founderRoutineExecutionReductionExecutionAuthorized,
    boundary.founderRoutineExecutionReductionClaimAuthorized,
    boundary.founderRoutineExecutionReductionClaimed,
    boundary.founderLiberationAssessmentAuthorized,
    boundary.founderLiberationAcceptanceAuthorized,
    boundary.taskExecutionAuthorized,
    boundary.actualRepositoryEvaluationAuthorized,
    boundary.actualRepositoryEvaluationPerformed,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.filesystemReadAuthorized,
    boundary.filesystemMutationAuthorized,
    boundary.gitMutationAuthorized,
    boundary.commandExecutionAuthorized,
    boundary.packageExecutionAuthorized,
    boundary.networkAccessAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessAuthorized,
    boundary.sensitiveContentAccessAuthorized,
    boundary.sensitiveContentMaterializationAuthorized,
    boundary.realCustomerDataAccessAuthorized,
    boundary.realCustomerContactAuthorized,
    boundary.externalDeliveryAuthorized,
    boundary.liveProviderExecutionAuthorized,
    boundary.productionDatabaseAuthorized,
    boundary.productionMutationAuthorized,
    boundary.productionDeploymentAuthorized,
    boundary.paymentExecutionAuthorized,
    boundary.financialCommitmentAuthorized,
    boundary.legalCommitmentAuthorized,
    boundary.autonomousDecisionAuthorized,
    boundary.concurrentEngineeringWorkAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    boundary.aggregateConcurrentEngineeringWorkLimit !==
      0 ||
    requiredTrue.some(
      (value) => value !== true,
    ) ||
    requiredFalse.some(
      (value) => value !== false,
    ) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.evidenceItems) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparationInput,
): EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation {
  if (
    input.sourcePriorWorkstreamClosure !==
    priorWorkstreamClosure
  ) {
    throw new Error(
      "Only the canonical closed workstream-three decision can prepare the Founder Routine Execution Reduction evidence plan.",
    );
  }

  validateCanonicalPriorWorkstreamClosure();

  requireIdentifier(
    "Founder Routine Execution Reduction evidence-plan preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Founder Routine Execution Reduction evidence-plan preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(priorWorkstreamClosure.decidedAt)
  ) {
    throw new Error(
      "Founder Routine Execution Reduction evidence-plan preparation cannot precede workstream-three closure.",
    );
  }

  const record = buildPreparation(
    input.preparationId,
    input.preparedAt,
  );

  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_PLAN_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidencePlanPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-founder-routine-execution-reduction-evidence-plan-preparation-001",
    sourcePriorWorkstreamClosure:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_REPOSITORY_READ_ONLY_SANDBOX_EVALUATION_WORKSTREAM_CLOSURE_DECISION,
    preparedAt: "2026-08-02T22:10:00.000Z",
  });