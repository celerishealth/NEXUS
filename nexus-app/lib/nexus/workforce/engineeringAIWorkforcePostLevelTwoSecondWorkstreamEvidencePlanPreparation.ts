import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION,
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewApprovalRecord";

import {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision,
} from "./engineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision";

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION =
  "nexus-engineering-ai-workforce-post-level-two-second-workstream-evidence-plan-preparation-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_PROFILES =
  [
    {
      controlId:
        "SEQUENTIAL_OWNERSHIP_LEDGER",

      objective:
        "Define one deterministic ownership ledger that prevents two Engineering AI employees from controlling the same bounded work item simultaneously.",

      expectedEvidence:
        "A synthetic ownership-state transition plan proving single active ownership, explicit handoff, stale-owner rejection, and owner-visible audit evidence.",
    },
    {
      controlId:
        "CONFLICT_DETECTION_AND_RESOLUTION",

      objective:
        "Define deterministic conflict detection and fail-closed resolution rules before any concurrent Engineering work can be considered.",

      expectedEvidence:
        "A synthetic conflict matrix covering overlapping scope, incompatible recommendations, duplicate execution, priority conflict, and mandatory owner escalation.",
    },
    {
      controlId:
        "TENANT_ISOLATION_COORDINATION",

      objective:
        "Define coordination rules that preserve tenant isolation and prevent cross-tenant evidence, state, or authority mixing.",

      expectedEvidence:
        "A tenant-bound coordination plan with identity checks, evidence partitioning, cross-tenant rejection, and immutable audit linkage.",
    },
    {
      controlId:
        "EMERGENCY_PAUSE_PROTOCOL",

      objective:
        "Define a fail-closed emergency pause protocol for all proposed coordinated Engineering activity.",

      expectedEvidence:
        "A deterministic pause plan covering trigger conditions, atomic stop state, in-flight task containment, owner notification, and safe resume requirements.",
    },
    {
      controlId:
        "ROLLBACK_COORDINATION_PROTOCOL",

      objective:
        "Define rollback evidence requirements for coordinated Engineering work without authorizing any implementation or repository change.",

      expectedEvidence:
        "A synthetic rollback coordination plan covering checkpoints, dependency order, partial-failure containment, restoration verification, and owner approval.",
    },
    {
      controlId:
        "MONITORING_AND_HEALTH_GATES",

      objective:
        "Define monitoring and health gates required before, during, and after any future bounded concurrent Engineering evaluation.",

      expectedEvidence:
        "A deterministic monitoring plan with health thresholds, evidence freshness, failure counters, automatic pause conditions, and owner-visible status.",
    },
    {
      controlId:
        "ESCALATION_AND_OWNER_REVIEW",

      objective:
        "Define escalation and owner-review gates for every material coordination conflict, failure, or authority question.",

      expectedEvidence:
        "A synthetic escalation plan with severity levels, evidence package requirements, decision deadlines, unresolved-state blocking, and final owner authority.",
    },
    {
      controlId:
        "INDEPENDENT_VALIDATION_AND_AUDIT",

      objective:
        "Define independent validation and immutable audit requirements for the complete concurrent-coordination safety plan.",

      expectedEvidence:
        "A deterministic validation plan covering control completeness, tamper detection, sequencing proof, negative authorization checks, and owner acceptance.",
    },
  ] as const;

export type EngineeringAIWorkforceConcurrentCoordinationSafetyEvidenceProfile =
  (
    typeof ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_PROFILES
  )[number];

export interface EngineeringAIWorkforceConcurrentCoordinationSafetyEvidenceItem {
  readonly sequence:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8;

  readonly evidenceState:
    "ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_ITEM_PREPARED";

  readonly controlId:
    EngineeringAIWorkforceConcurrentCoordinationSafetyEvidenceProfile["controlId"];

  readonly objective: string;

  readonly expectedEvidence: string;

  readonly dataClassification:
    "SYNTHETIC_SANITIZED_ONLY";

  readonly outputMode:
    "PLAN_ONLY";

  readonly evidenceToolMode:
    "READ_ONLY_EVIDENCE_ONLY";

  readonly deterministicEvidenceRequired:
    true;

  readonly independentValidationRequired:
    true;

  readonly ownerReviewRequired:
    true;

  readonly monitoringRequired:
    true;

  readonly emergencyPauseRequired:
    true;

  readonly rollbackEvidenceRequired:
    true;

  readonly taskExecutionAuthorized:
    false;

  readonly concurrentExecutionAuthorized:
    false;

  readonly repositoryReadAuthorized:
    false;

  readonly repositoryWriteAuthorized:
    false;

  readonly branchCreationAuthorized:
    false;

  readonly pullRequestPreparationAuthorized:
    false;

  readonly mergeAuthorized:
    false;

  readonly secretsAccessAuthorized:
    false;

  readonly realCustomerDataAccessAuthorized:
    false;

  readonly realCustomerContactAuthorized:
    false;

  readonly externalDeliveryAuthorized:
    false;

  readonly liveProviderExecutionAuthorized:
    false;

  readonly productionDatabaseAuthorized:
    false;

  readonly productionMutationAuthorized:
    false;

  readonly productionDeploymentAuthorized:
    false;

  readonly paymentExecutionAuthorized:
    false;

  readonly publicLaunchAuthorized:
    false;

  readonly evidenceItemDigest: string;
}

export interface CreateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparationInput {
  readonly preparationId: string;

  readonly sourceWorkstreamPreparationReviewDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;

  readonly sourcePriorWorkstreamClosureDecision:
    typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION;

  readonly preparedAt: string;
}

const IDENTIFIER_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableNormalize(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      stableNormalize,
    );
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
        .map(
          (key) => [
            key,
            stableNormalize(
              record[key],
            ),
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
    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }

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
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

const workstreamPreparation =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION;

const workstreamPreparationReview =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION;

const priorWorkstreamClosure =
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION;

const secondWorkstream =
  workstreamPreparation.preparedWorkstreams[1];

function validateCanonicalSources(): void {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparation(
    workstreamPreparation,
  );

  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
    workstreamPreparationReview,
  );

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
    priorWorkstreamClosure,
  );

  if (
    !secondWorkstream ||
    secondWorkstream.sequence !== 2 ||
    secondWorkstream.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    secondWorkstream.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    secondWorkstream.preparationState !==
      "ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARED" ||
    secondWorkstream.preparationOnly !==
      true ||
    secondWorkstream.syntheticSanitizedEvidenceOnly !==
      true ||
    secondWorkstream.deterministicEvidenceRequired !==
      true ||
    secondWorkstream.ownerReviewRequired !==
      true ||
    secondWorkstream.independentValidationRequired !==
      true ||
    secondWorkstream.monitoringRequired !==
      true ||
    secondWorkstream.emergencyPauseRequired !==
      true ||
    secondWorkstream.rollbackEvidenceRequired !==
      true ||
    secondWorkstream.maximumPlannedEvidenceItemCount !==
      8 ||
    secondWorkstream.taskExecutionAuthorized !==
      false ||
    secondWorkstream.concurrentExecutionAuthorized !==
      false ||
    secondWorkstream.repositoryReadAuthorized !==
      false ||
    secondWorkstream.repositoryWriteAuthorized !==
      false ||
    secondWorkstream.productionMutationAuthorized !==
      false ||
    secondWorkstream.customerContactAuthorized !==
      false ||
    secondWorkstream.paymentExecutionAuthorized !==
      false ||
    secondWorkstream.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Canonical second workstream preparation is invalid.",
    );
  }

  if (
    workstreamPreparationReview.decision !==
      "APPROVE_ENGINEERING_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_EVIDENCE_ONLY" ||
    workstreamPreparationReview.preparationEvidenceAccepted !==
      true ||
    workstreamPreparationReview.consequentialAuthorityGranted !==
      false
  ) {
    throw new Error(
      "Canonical workstream preparation review does not authorize bounded evidence planning.",
    );
  }

  if (
    priorWorkstreamClosure.decision !==
      "APPROVE_ENGINEERING_SECOND_TASK_SEQUENCE_CLOSURE" ||
    priorWorkstreamClosure.secondTaskSequenceClosed !==
      true ||
    priorWorkstreamClosure.sequenceClosureOwnerReviewCompleted !==
      true ||
    priorWorkstreamClosure.sequenceClosureOwnerAcceptanceRecorded !==
      true ||
    priorWorkstreamClosure.nextStep !==
      "AWAIT_OWNER_NEXT_ENGINEERING_POST_LEVEL_TWO_OBJECTIVE" ||
    priorWorkstreamClosure.authorityBoundary
      .concurrentCandidateExecutionAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary
      .thirdSyntheticTaskExecutionAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary
      .levelThreeAuthorityGranted !==
      false ||
    priorWorkstreamClosure.authorityBoundary
      .repositoryReadAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary
      .repositoryWriteAuthorized !==
      false ||
    priorWorkstreamClosure.authorityBoundary
      .founderLiberationAchieved !==
      false ||
    priorWorkstreamClosure.authorityBoundary
      .ownerFinalAuthorityPreserved !==
      true
  ) {
    throw new Error(
      "Prior bounded workstream closure is invalid.",
    );
  }
}

function createEvidenceItems():
  readonly EngineeringAIWorkforceConcurrentCoordinationSafetyEvidenceItem[] {
  return ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_PROFILES.map(
    (
      profile,
      index,
    ) => {
      const evidenceItemCore = {
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
          "ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_ITEM_PREPARED" as const,

        controlId:
          profile.controlId,

        objective:
          profile.objective,

        expectedEvidence:
          profile.expectedEvidence,

        dataClassification:
          "SYNTHETIC_SANITIZED_ONLY" as const,

        outputMode:
          "PLAN_ONLY" as const,

        evidenceToolMode:
          "READ_ONLY_EVIDENCE_ONLY" as const,

        deterministicEvidenceRequired:
          true as const,

        independentValidationRequired:
          true as const,

        ownerReviewRequired:
          true as const,

        monitoringRequired:
          true as const,

        emergencyPauseRequired:
          true as const,

        rollbackEvidenceRequired:
          true as const,

        taskExecutionAuthorized:
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
        ...evidenceItemCore,

        evidenceItemDigest:
          sha256(evidenceItemCore),
      });
    },
  ) as readonly EngineeringAIWorkforceConcurrentCoordinationSafetyEvidenceItem[];
}

function buildPreparation(
  preparationId: string,
  preparedAt: string,
) {
  const evidenceItems =
    createEvidenceItems();

  const preparationCore = {
    version:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION,

    preparationId,

    preparationState:
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARED" as const,

    tenantId:
      workstreamPreparationReview
        .tenantId,

    ownerId:
      workstreamPreparationReview
        .ownerId,

    sourceWorkstreamPreparationReviewDecisionId:
      workstreamPreparationReview
        .decisionId,

    sourceWorkstreamPreparationReviewDecisionDigest:
      workstreamPreparationReview
        .decisionDigest,

    sourceWorkstreamPreparationId:
      workstreamPreparation
        .preparationId,

    sourceWorkstreamPreparationDigest:
      workstreamPreparation
        .preparationDigest,

    sourcePriorWorkstreamClosureDecisionId:
      priorWorkstreamClosure
        .decisionId,

    sourcePriorWorkstreamClosureDecisionDigest:
      priorWorkstreamClosure
        .decisionDigest,

    workstreamSequence:
      2 as const,

    workstreamId:
      "controlled-concurrent-coordination-evidence" as const,

    evidenceClass:
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" as const,

    planOnly:
      true as const,

    evidenceItemCount:
      8 as const,

    evidenceItems,

    summary: {
      evidenceItemCount:
        8 as const,

      syntheticSanitizedEvidenceItemCount:
        8 as const,

      deterministicEvidenceRequiredCount:
        8 as const,

      independentValidationRequiredCount:
        8 as const,

      ownerReviewRequiredCount:
        8 as const,

      monitoringRequiredCount:
        8 as const,

      emergencyPauseRequiredCount:
        8 as const,

      rollbackEvidenceRequiredCount:
        8 as const,

      taskExecutionAuthorizedCount:
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

    ownerEvidencePlanReviewRequired:
      true as const,

    ownerEvidencePlanReviewRecorded:
      false as const,

    authorityBoundary: {
      evidencePlanningOnly:
        true as const,

      canonicalWorkstreamPreparationBound:
        true as const,

      canonicalWorkstreamPreparationReviewBound:
        true as const,

      canonicalPriorWorkstreamClosureBound:
        true as const,

      priorWorkstreamClosed:
        true as const,

      exactEightEvidenceItemsRequired:
        true as const,

      concurrentCoordinationSafetyPlanningAuthorized:
        true as const,

      concurrentCoordinationSafetyEvidencePrepared:
        true as const,

      concurrentExecutionAuthorized:
        false as const,

      taskExecutionAuthorized:
        false as const,

      thirdTaskExecutionAuthorized:
        false as const,

      levelThreeEvaluationAuthorized:
        false as const,

      levelThreeAuthorityGranted:
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

      ownerReviewRequired:
        true as const,

      ownerFinalAuthorityPreserved:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW" as const,

    preparedAt,
  };

  return deepFreeze({
    ...preparationCore,

    preparationDigest:
      sha256(preparationCore),
  });
}

export type EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation =
  ReturnType<
    typeof buildPreparation
  >;

function validateEvidenceItem(
  item:
    EngineeringAIWorkforceConcurrentCoordinationSafetyEvidenceItem,
  index: number,
): void {
  const profile =
    ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_PROFILES[
      index
    ];

  if (!profile) {
    throw new Error(
      "Concurrent-coordination evidence profile is missing.",
    );
  }

  const {
    evidenceItemDigest,
    ...itemCore
  } = item;

  if (
    !SHA256_PATTERN.test(
      evidenceItemDigest,
    ) ||
    sha256(itemCore) !==
      evidenceItemDigest ||
    item.sequence !== index + 1 ||
    item.evidenceState !==
      "ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_ITEM_PREPARED" ||
    item.controlId !==
      profile.controlId ||
    item.objective !==
      profile.objective ||
    item.expectedEvidence !==
      profile.expectedEvidence ||
    item.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    item.outputMode !==
      "PLAN_ONLY" ||
    item.evidenceToolMode !==
      "READ_ONLY_EVIDENCE_ONLY" ||
    item.deterministicEvidenceRequired !==
      true ||
    item.independentValidationRequired !==
      true ||
    item.ownerReviewRequired !==
      true ||
    item.monitoringRequired !==
      true ||
    item.emergencyPauseRequired !==
      true ||
    item.rollbackEvidenceRequired !==
      true ||
    item.taskExecutionAuthorized !==
      false ||
    item.concurrentExecutionAuthorized !==
      false ||
    item.repositoryReadAuthorized !==
      false ||
    item.repositoryWriteAuthorized !==
      false ||
    item.branchCreationAuthorized !==
      false ||
    item.pullRequestPreparationAuthorized !==
      false ||
    item.mergeAuthorized !==
      false ||
    item.secretsAccessAuthorized !==
      false ||
    item.realCustomerDataAccessAuthorized !==
      false ||
    item.realCustomerContactAuthorized !==
      false ||
    item.externalDeliveryAuthorized !==
      false ||
    item.liveProviderExecutionAuthorized !==
      false ||
    item.productionDatabaseAuthorized !==
      false ||
    item.productionMutationAuthorized !==
      false ||
    item.productionDeploymentAuthorized !==
      false ||
    item.paymentExecutionAuthorized !==
      false ||
    item.publicLaunchAuthorized !==
      false ||
    !Object.isFrozen(item)
  ) {
    throw new Error(
      `Concurrent-coordination evidence item ${index + 1} is invalid.`,
    );
  }
}

export function validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
  record:
    EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation,
): void {
  validateCanonicalSources();

  requireIdentifier(
    "Engineering second-workstream evidence-plan preparation ID",
    record.preparationId,
  );

  requireTimestamp(
    "Engineering second-workstream evidence-plan preparation time",
    record.preparedAt,
  );

  const {
    preparationDigest,
    ...preparationCore
  } = record;

  if (
    !SHA256_PATTERN.test(
      preparationDigest,
    ) ||
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan preparation integrity is invalid.",
    );
  }

  if (
    record.version !==
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION_VERSION ||
    record.preparationState !==
      "OWNER_CONTROLLED_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARED" ||
    record.tenantId !==
      workstreamPreparationReview.tenantId ||
    record.ownerId !==
      workstreamPreparationReview.ownerId ||
    record.sourceWorkstreamPreparationReviewDecisionId !==
      workstreamPreparationReview.decisionId ||
    record.sourceWorkstreamPreparationReviewDecisionDigest !==
      workstreamPreparationReview.decisionDigest ||
    record.sourceWorkstreamPreparationId !==
      workstreamPreparation.preparationId ||
    record.sourceWorkstreamPreparationDigest !==
      workstreamPreparation.preparationDigest ||
    record.sourcePriorWorkstreamClosureDecisionId !==
      priorWorkstreamClosure.decisionId ||
    record.sourcePriorWorkstreamClosureDecisionDigest !==
      priorWorkstreamClosure.decisionDigest ||
    record.workstreamSequence !== 2 ||
    record.workstreamId !==
      "controlled-concurrent-coordination-evidence" ||
    record.evidenceClass !==
      "CONCURRENT_COORDINATION_SAFETY_EVIDENCE" ||
    record.planOnly !== true ||
    record.evidenceItemCount !== 8 ||
    record.evidenceItems.length !==
      8 ||
    record.ownerEvidencePlanReviewRequired !==
      true ||
    record.ownerEvidencePlanReviewRecorded !==
      false ||
    record.nextStep !==
      "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_REVIEW" ||
    Date.parse(record.preparedAt) <
      Date.parse(
        priorWorkstreamClosure.decidedAt,
      )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan preparation identity is invalid.",
    );
  }

  record.evidenceItems.forEach(
    validateEvidenceItem,
  );

  if (
    new Set(
      record.evidenceItems.map(
        (item) =>
          item.controlId,
      ),
    ).size !== 8
  ) {
    throw new Error(
      "Concurrent-coordination evidence controls must be unique.",
    );
  }

  const summary =
    record.summary;

  if (
    summary.evidenceItemCount !== 8 ||
    summary.syntheticSanitizedEvidenceItemCount !==
      8 ||
    summary.deterministicEvidenceRequiredCount !==
      8 ||
    summary.independentValidationRequiredCount !==
      8 ||
    summary.ownerReviewRequiredCount !==
      8 ||
    summary.monitoringRequiredCount !==
      8 ||
    summary.emergencyPauseRequiredCount !==
      8 ||
    summary.rollbackEvidenceRequiredCount !==
      8 ||
    summary.taskExecutionAuthorizedCount !==
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
      "Engineering second-workstream evidence-plan summary is invalid.",
    );
  }

  const boundary =
    record.authorityBoundary;

  const requiredTrue = [
    boundary.evidencePlanningOnly,
    boundary.canonicalWorkstreamPreparationBound,
    boundary.canonicalWorkstreamPreparationReviewBound,
    boundary.canonicalPriorWorkstreamClosureBound,
    boundary.priorWorkstreamClosed,
    boundary.exactEightEvidenceItemsRequired,
    boundary.concurrentCoordinationSafetyPlanningAuthorized,
    boundary.concurrentCoordinationSafetyEvidencePrepared,
    boundary.monitoringRequired,
    boundary.emergencyPauseRequired,
    boundary.rollbackEvidenceRequired,
    boundary.ownerReviewRequired,
    boundary.ownerFinalAuthorityPreserved,
  ];

  const requiredFalse = [
    boundary.concurrentExecutionAuthorized,
    boundary.taskExecutionAuthorized,
    boundary.thirdTaskExecutionAuthorized,
    boundary.levelThreeEvaluationAuthorized,
    boundary.levelThreeAuthorityGranted,
    boundary.repositoryReadAuthorized,
    boundary.repositoryWriteAuthorized,
    boundary.branchCreationAuthorized,
    boundary.pullRequestPreparationAuthorized,
    boundary.mergeAuthorized,
    boundary.secretsAccessAuthorized,
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
    boundary.productionReadinessAuthorized,
    boundary.publicLaunchAuthorized,
    boundary.founderLiberationAchieved,
    boundary.founderReleasedFromRoutineExecution,
  ];

  if (
    requiredTrue.some(
      (value) =>
        value !== true,
    ) ||
    requiredFalse.some(
      (value) =>
        value !== false,
    ) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.evidenceItems,
    ) ||
    !Object.isFrozen(
      record.summary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan authority boundary is invalid.",
    );
  }
}

export function createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
  input:
    CreateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparationInput,
): EngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation {
  validateEngineeringAIWorkforcePostLevelTwoWorkstreamPreparationReviewDecision(
    input.sourceWorkstreamPreparationReviewDecision,
  );

  validateEngineeringAIWorkforcePostLevelTwoSecondTaskSequenceClosureOwnerReviewDecision(
    input.sourcePriorWorkstreamClosureDecision,
  );

  if (
    input.sourceWorkstreamPreparationReviewDecision.decisionId !==
      workstreamPreparationReview.decisionId ||
    input.sourceWorkstreamPreparationReviewDecision.decisionDigest !==
      workstreamPreparationReview.decisionDigest
  ) {
    throw new Error(
      "Only the canonical workstream preparation review can authorize second-workstream planning.",
    );
  }

  if (
    input.sourcePriorWorkstreamClosureDecision.decisionId !==
      priorWorkstreamClosure.decisionId ||
    input.sourcePriorWorkstreamClosureDecision.decisionDigest !==
      priorWorkstreamClosure.decisionDigest
  ) {
    throw new Error(
      "Only the canonical prior-workstream closure can authorize second-workstream planning.",
    );
  }

  validateCanonicalSources();

  requireIdentifier(
    "Engineering second-workstream evidence-plan preparation ID",
    input.preparationId,
  );

  requireTimestamp(
    "Engineering second-workstream evidence-plan preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
      Date.parse(
        priorWorkstreamClosure.decidedAt,
      )
  ) {
    throw new Error(
      "Engineering second-workstream evidence-plan preparation cannot precede prior-workstream closure.",
    );
  }

  const record =
    buildPreparation(
      input.preparationId,
      input.preparedAt,
    );

  validateEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation(
    record,
  );

  return record;
}

export const ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_WORKSTREAM_EVIDENCE_PLAN_PREPARATION =
  createEngineeringAIWorkforcePostLevelTwoSecondWorkstreamEvidencePlanPreparation({
    preparationId:
      "engineering-ai-workforce-post-level-two-second-workstream-evidence-plan-preparation-001",

    sourceWorkstreamPreparationReviewDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_WORKSTREAM_PREPARATION_REVIEW_APPROVAL_DECISION,

    sourcePriorWorkstreamClosureDecision:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_CLOSURE_OWNER_REVIEW_DECISION,

    preparedAt:
      "2026-08-02T12:05:00.000Z",
  });