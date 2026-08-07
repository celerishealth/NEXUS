import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION,
} from "./autonomousGlobalGrowthTemplatePreparedFactoryTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision,
} from "./autonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution,
} from "./autonomousGlobalGrowthFactoryLifecycleTransitionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-template-prepared-factory-transition-execution-v1" as const;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, normalize(record[key])]),
);
  }

  return value;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)), "utf8")
    .digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }

  return value;
}

function requireTimestamp(value: string): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED transition execution time is invalid.",
    );
  }
}

function buildExecution(executedAt: string) {
  const decision =
    AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION;
  const source =
    AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision(
    decision,
  );
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
    source,
  );

  requireTimestamp(executedAt);

  if (
    Date.parse(executedAt) < Date.parse(decision.decidedAt) ||
    Date.parse(executedAt) < Date.parse(source.executedAt) ||
    decision.templatePreparedTransitionApproved !== true ||
    decision.authorityBoundary.templatePreparedTransitionAuthorized !== true ||
    decision.authorityBoundary.templatePreparedTransitionExecuted !== false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1" ||
    decision.candidateCount !== 9 ||
    decision.candidateTransitionEligibility.length !== 9 ||
    source.transitionedCandidateCount !== 9 ||
    source.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
    source.executionEvidence.templatePreparationPendingRecorded !== true ||
    source.executionEvidence.templatePrepared !== false
  ) {
    throw new Error(
      "Exact approved and bounded Global Growth TEMPLATE_PREPARED transition evidence is required.",
    );
  }

  const transitionRecords =
    decision.candidateTransitionEligibility.map((candidate, index) => {
      const pendingTransition =
        source.transitionRecords.find(
          (record) =>
            record.transitionRecordId === candidate.sourceTransitionRecordId &&
            record.transitionRecordDigest === candidate.sourceTransitionRecordDigest &&
            record.sourceFactoryRecordId === candidate.sourceFactoryRecordId &&
            record.sourceFactoryRecordDigest === candidate.sourceFactoryRecordDigest &&
            record.templateId === candidate.templateId &&
            record.templateDigest === candidate.templateDigest &&
            record.employeeId === candidate.employeeId &&
            record.employeeCode === candidate.employeeCode,
        );

      if (
        !pendingTransition ||
        pendingTransition.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        pendingTransition.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        pendingTransition.lifecycleTransitionExecuted !== true ||
        pendingTransition.sourceFactoryRecordPreserved !== true ||
        pendingTransition.templateCreationEvidenceBound !== true ||
        pendingTransition.templatePrepared !== false ||
        pendingTransition.qualificationAdmissionAuthorized !== false ||
        pendingTransition.qualificationExecutionAuthorized !== false ||
        pendingTransition.ownerQualificationApproved !== false ||
        pendingTransition.employeeActivationAuthorized !== false ||
        pendingTransition.runtimeAuthorized !== false ||
        candidate.sourceLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        candidate.targetLifecycleState !== "TEMPLATE_PREPARED" ||
        candidate.templatePreparedTransitionAuthorized !== true ||
        candidate.templatePreparedTransitionExecuted !== false
      ) {
        throw new Error(
          `Global Growth TEMPLATE_PREPARED source evidence is invalid: ${candidate.employeeCode}.`,
        );
      }

      const core = {
        transitionRecordId:
          `global-growth-template-prepared-transition-${candidate.employeeId}`,
        transitionSequence:
          index + 1,

        sourceTransitionRecordId:
          pendingTransition.transitionRecordId,
        sourceTransitionRecordDigest:
          pendingTransition.transitionRecordDigest,
        sourceFactoryRecordId:
          pendingTransition.sourceFactoryRecordId,
        sourceFactoryRecordDigest:
          pendingTransition.sourceFactoryRecordDigest,

        templateId:
          candidate.templateId,
        templateDigest:
          candidate.templateDigest,
        employeeId:
          candidate.employeeId,
        employeeCode:
          candidate.employeeCode,
        publicName:
          candidate.publicName,
        officialRole:
          candidate.officialRole,
        department:
          candidate.department,

        sourceLifecycleState:
          "TEMPLATE_PREPARATION_PENDING" as const,
        targetLifecycleState:
          "TEMPLATE_PREPARED" as const,

        templatePreparedTransitionAuthorized:
          true as const,
        templatePreparedTransitionExecuted:
          true as const,

        sourceTransitionRecordPreserved:
          true as const,
        sourceFactoryRecordPreserved:
          true as const,
        templateCreationEvidenceBound:
          true as const,
        templatePrepared:
          true as const,

        qualificationAdmissionAuthorized:
          false as const,
        qualificationExecutionAuthorized:
          false as const,
        qualificationEvidenceAccepted:
          false as const,
        ownerQualificationApproved:
          false as const,

        activationCandidatePrepared:
          false as const,
        employeeActivationAuthorized:
          false as const,
        ownerActivationApproved:
          false as const,
        runtimeAuthorized:
          false as const,
        controlledWorkAuthorized:
          false as const,

        realCredentialAccessAuthorized:
          false as const,
        liveConnectorActivationAuthorized:
          false as const,
        publicPublishingAuthorized:
          false as const,
        customerMessagingAuthorized:
          false as const,
        leadContactAuthorized:
          false as const,
        demoBookingExecutionAuthorized:
          false as const,
        productionExecutionAuthorized:
          false as const,
        autonomousExternalActionAuthorized:
          false as const,

        transitionedAt:
          executedAt,
      };

      return deepFreeze({
        ...core,
        transitionRecordDigest:
          sha256(core),
      });
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION_VERSION,
    executionId:
      "autonomous-global-growth-template-prepared-factory-transition-execution-001",
    executionState:
      "OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTED" as const,

    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,

    sourcePendingExecutionId:
      source.executionId,
    sourcePendingExecutionDigest:
      source.executionDigest,
    sourceFactoryFoundationDigest:
      source.sourceFactoryFoundationDigest,

    transitionedCandidateCount:
      9 as const,
    sourceLifecycleState:
      "TEMPLATE_PREPARATION_PENDING" as const,
    targetLifecycleState:
      "TEMPLATE_PREPARED" as const,

    transitionRecords,

    transitionedTemplateIds:
      transitionRecords.map(
        (record) => record.templateId,
      ),
    sourceTransitionRecordIds:
      transitionRecords.map(
        (record) => record.sourceTransitionRecordId,
      ),

    executionEvidence: {
      exactApprovedDecisionBound:
        true as const,
      exactPendingExecutionBound:
        true as const,
      exactNineCandidatesTransitioned:
        true as const,
      sourceTransitionRecordsPreserved:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,
      templatePreparedTransitionExecuted:
        true as const,
      templatePrepared:
        true as const,
      qualificationNotStarted:
        true as const,
    },

    authorityBoundary: {
      templatePreparedTransitionExecuted:
        true as const,
      templatePrepared:
        true as const,

      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,
      sourceTransitionRecordsMutated:
        false as const,

      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      qualificationEvidenceAccepted:
        false as const,
      ownerQualificationApproved:
        false as const,

      activationCandidatePrepared:
        false as const,
      employeeActivationAuthorized:
        false as const,
      ownerActivationApproved:
        false as const,
      runtimeAuthorized:
        false as const,
      controlledWorkAuthorized:
        false as const,

      realCredentialAccessAuthorized:
        false as const,
      liveConnectorActivationAuthorized:
        false as const,
      videoGenerationExecutionAuthorized:
        false as const,
      publicPublishingAuthorized:
        false as const,
      customerMessagingAuthorized:
        false as const,
      commentResponseAuthorized:
        false as const,
      leadContactAuthorized:
        false as const,
      demoBookingExecutionAuthorized:
        false as const,
      proposalDeliveryAuthorized:
        false as const,
      paidAdvertisingAuthorized:
        false as const,
      productionExecutionAuthorized:
        false as const,
      autonomousExternalActionAuthorized:
        false as const,
      blockedMetaAccountUseAuthorized:
        false as const,
      blockedMetaAccountBypassAuthorized:
        false as const,

      levelThreeAuthorityGranted:
        false as const,
      founderLiberationAchieved:
        false as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },

    nextStep:
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_DECISION_V1" as const,

    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
  record: AutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution,
): void {
  const {
    executionDigest,
    ...core
  } = record;

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION_VERSION ||
    record.transitionedCandidateCount !== 9 ||
    record.transitionRecords.length !== 9 ||
    record.sourceLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
    record.targetLifecycleState !== "TEMPLATE_PREPARED" ||
    executionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED transition execution integrity validation failed.",
    );
  }

  if (
    record.transitionRecords.some(
      (transition) =>
        transition.sourceLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        transition.targetLifecycleState !== "TEMPLATE_PREPARED" ||
        transition.templatePreparedTransitionAuthorized !== true ||
        transition.templatePreparedTransitionExecuted !== true ||
        transition.sourceTransitionRecordPreserved !== true ||
        transition.sourceFactoryRecordPreserved !== true ||
        transition.templateCreationEvidenceBound !== true ||
        transition.templatePrepared !== true ||
        transition.qualificationAdmissionAuthorized !== false ||
        transition.qualificationExecutionAuthorized !== false ||
        transition.qualificationEvidenceAccepted !== false ||
        transition.ownerQualificationApproved !== false ||
        transition.employeeActivationAuthorized !== false ||
        transition.runtimeAuthorized !== false ||
        transition.publicPublishingAuthorized !== false ||
        transition.productionExecutionAuthorized !== false ||
        transition.autonomousExternalActionAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED transition record boundary is invalid.",
    );
  }

  if (
    record.executionEvidence.exactApprovedDecisionBound !== true ||
    record.executionEvidence.exactPendingExecutionBound !== true ||
    record.executionEvidence.exactNineCandidatesTransitioned !== true ||
    record.executionEvidence.sourceTransitionRecordsPreserved !== true ||
    record.executionEvidence.sourceFactoryRecordsPreserved !== true ||
    record.executionEvidence.templatePreparedTransitionExecuted !== true ||
    record.executionEvidence.templatePrepared !== true ||
    record.executionEvidence.qualificationNotStarted !== true ||
    record.authorityBoundary.templatePreparedTransitionExecuted !== true ||
    record.authorityBoundary.templatePrepared !== true ||
    record.authorityBoundary.sourceTransitionRecordsMutated !== false ||
    record.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.qualificationEvidenceAccepted !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.runtimeAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.levelThreeAuthorityGranted !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.authorityBoundary.ownerFinalAuthorityPreserved !== true ||
    record.nextStep !==
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_DECISION_V1"
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.transitionRecords) ||
    !Object.isFrozen(record.executionEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED execution must be immutable.",
    );
  }
}

export function createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
  executedAt: string,
): AutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution {
  const record =
    buildExecution(executedAt);

  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION =
  createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
    "2026-08-07T03:50:00.000Z",
  );
