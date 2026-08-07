import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
} from "./aiEmployeeFactoryLifecycle";
import {
  AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
} from "./autonomousGlobalGrowthFactoryLifecycleTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision,
} from "./autonomousGlobalGrowthFactoryLifecycleTransitionDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION,
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution,
} from "./autonomousGlobalGrowthAIEmployeeTemplateCreationExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-factory-lifecycle-transition-execution-v1" as const;

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
      "Global Growth lifecycle-transition execution time is invalid.",
    );
  }
}

function buildExecution(executedAt: string) {
  const decision =
    AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;
  const admission =
    AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION;
  const templateExecution =
    AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION;

  validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision(
    decision,
  );
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
    admission,
  );
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
    templateExecution,
  );

  requireTimestamp(executedAt);

  if (
    Date.parse(executedAt) < Date.parse(decision.decidedAt) ||
    decision.lifecycleTransitionApproved !== true ||
    decision.authorityBoundary.lifecycleTransitionAuthorized !== true ||
    decision.authorityBoundary.lifecycleTransitionExecuted !== false ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1" ||
    decision.candidateCount !== 9 ||
    decision.candidateTransitionEligibility.length !== 9
  ) {
    throw new Error(
      "Exact approved Global Growth lifecycle-transition decision is required.",
    );
  }

  const allowedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .PLANNED_CANDIDATE as readonly string[];

  if (!allowedTargets.includes("TEMPLATE_PREPARATION_PENDING")) {
    throw new Error(
      "Global Growth pending lifecycle transition is not sequentially legal.",
    );
  }

  const transitionRecords =
    decision.candidateTransitionEligibility.map((candidate, index) => {
      const sourceFactoryRecord =
        admission.candidateRecords.find(
          (record) =>
            record.factoryRecordId === candidate.factoryRecordId &&
            record.recordDigest === candidate.factoryRecordDigest &&
            record.employeeId === candidate.employeeId &&
            record.employeeCode === candidate.employeeCode,
        );

      const template =
        templateExecution.templateRegistry.templates.find(
          (entry) =>
            entry.templateId === candidate.templateId &&
            entry.templateDigest === candidate.templateDigest &&
            entry.employeeId === candidate.employeeId &&
            entry.employeeCode === candidate.employeeCode,
        );

      if (
        !sourceFactoryRecord ||
        !template ||
        sourceFactoryRecord.lifecycleState !== "PLANNED_CANDIDATE" ||
        sourceFactoryRecord.templatePrepared !== false ||
        sourceFactoryRecord.qualificationAdmissionAuthorized !== false ||
        sourceFactoryRecord.qualificationEvidenceAccepted !== false ||
        sourceFactoryRecord.ownerQualificationApproved !== false ||
        sourceFactoryRecord.activationCandidatePrepared !== false ||
        sourceFactoryRecord.ownerActivationApproved !== false ||
        sourceFactoryRecord.runtimeAuthorized !== false ||
        template.status !== "REGISTERED_UNQUALIFIED" ||
        candidate.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        candidate.templateCreationEvidenceBound !== true ||
        candidate.lifecycleTransitionAuthorized !== true ||
        candidate.lifecycleTransitionExecuted !== false
      ) {
        throw new Error(
          `Global Growth transition source evidence is invalid: ${candidate.employeeCode}.`,
        );
      }

      const core = {
        version:
          AI_EMPLOYEE_FACTORY_LIFECYCLE_VERSION,
        transitionRecordId:
          `global-growth-template-preparation-pending-transition-${candidate.employeeId}`,
        transitionSequence:
          index + 1,
        sourceFactoryRecordId:
          sourceFactoryRecord.factoryRecordId,
        sourceFactoryRecordDigest:
          sourceFactoryRecord.recordDigest,
        sourceFactoryRecordCreatedAt:
          sourceFactoryRecord.createdAt,
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
        templateId:
          candidate.templateId,
        templateDigest:
          candidate.templateDigest,

        sourceLifecycleState:
          "PLANNED_CANDIDATE" as const,
        targetLifecycleState:
          "TEMPLATE_PREPARATION_PENDING" as const,

        lifecycleTransitionAuthorized:
          true as const,
        lifecycleTransitionExecuted:
          true as const,
        sourceFactoryRecordPreserved:
          true as const,
        templateCreationEvidenceBound:
          true as const,

        templatePreparationExecutionAuthorized:
          false as const,
        templatePrepared:
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
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION,
    executionId:
      "autonomous-global-growth-factory-lifecycle-transition-execution-001",
    executionState:
      "OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTED" as const,

    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,

    sourceFactoryAdmissionExecutionId:
      admission.executionId,
    sourceFactoryAdmissionExecutionDigest:
      admission.executionDigest,
    sourceFactoryFoundationDigest:
      admission.sourceFactoryFoundationDigest,

    sourceTemplateCreationExecutionId:
      templateExecution.executionId,
    sourceTemplateCreationExecutionDigest:
      templateExecution.executionDigest,
    sourceTemplateRegistryDigest:
      templateExecution.templateRegistryDigest,

    sourceFactoryCandidateCount:
      admission.admittedFactoryCandidateCount,
    transitionedCandidateCount:
      9 as const,

    sourceLifecycleState:
      "PLANNED_CANDIDATE" as const,
    targetLifecycleState:
      "TEMPLATE_PREPARATION_PENDING" as const,

    transitionRecords,

    transitionRecordIds:
      transitionRecords.map(
        (record) => record.transitionRecordId,
      ),
    sourceFactoryRecordIds:
      transitionRecords.map(
        (record) => record.sourceFactoryRecordId,
      ),

    executionEvidence: {
      exactApprovedDecisionBound:
        true as const,
      exactNineCandidatesTransitioned:
        true as const,
      exactSourceFactoryRecordsBound:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,
      exactTemplateCreationEvidenceBound:
        true as const,
      sequentialLifecycleTransitionVerified:
        true as const,
      templatePreparationPendingRecorded:
        true as const,
      templatePrepared:
        false as const,
    },

    authorityBoundary: {
      lifecycleTransitionExecuted:
        true as const,
      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,

      directTemplatePreparedBypassAuthorized:
        false as const,
      templatePreparationExecutionAuthorized:
        false as const,
      templatePrepared:
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
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_V1" as const,

    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthFactoryLifecycleTransitionExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
  record: AutonomousGlobalGrowthFactoryLifecycleTransitionExecution,
): void {
  const {
    executionDigest,
    ...core
  } = record;

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION ||
    record.transitionedCandidateCount !== 9 ||
    record.transitionRecords.length !== 9 ||
    record.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
    record.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
    executionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth lifecycle-transition execution integrity validation failed.",
    );
  }

  if (
    record.transitionRecords.some(
      (transition) =>
        transition.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        transition.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        transition.lifecycleTransitionAuthorized !== true ||
        transition.lifecycleTransitionExecuted !== true ||
        transition.sourceFactoryRecordPreserved !== true ||
        transition.templateCreationEvidenceBound !== true ||
        transition.templatePreparationExecutionAuthorized !== false ||
        transition.templatePrepared !== false ||
        transition.qualificationAdmissionAuthorized !== false ||
        transition.qualificationExecutionAuthorized !== false ||
        transition.qualificationEvidenceAccepted !== false ||
        transition.ownerQualificationApproved !== false ||
        transition.activationCandidatePrepared !== false ||
        transition.employeeActivationAuthorized !== false ||
        transition.ownerActivationApproved !== false ||
        transition.runtimeAuthorized !== false ||
        transition.publicPublishingAuthorized !== false ||
        transition.productionExecutionAuthorized !== false ||
        transition.autonomousExternalActionAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth lifecycle-transition record boundary is invalid.",
    );
  }

  if (
    record.executionEvidence.exactApprovedDecisionBound !== true ||
    record.executionEvidence.exactNineCandidatesTransitioned !== true ||
    record.executionEvidence.exactSourceFactoryRecordsBound !== true ||
    record.executionEvidence.sourceFactoryRecordsPreserved !== true ||
    record.executionEvidence.exactTemplateCreationEvidenceBound !== true ||
    record.executionEvidence.sequentialLifecycleTransitionVerified !== true ||
    record.executionEvidence.templatePreparationPendingRecorded !== true ||
    record.executionEvidence.templatePrepared !== false ||
    record.authorityBoundary.lifecycleTransitionExecuted !== true ||
    record.authorityBoundary.directTemplatePreparedBypassAuthorized !== false ||
    record.authorityBoundary.templatePrepared !== false ||
    record.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.runtimeAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.levelThreeAuthorityGranted !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.authorityBoundary.ownerFinalAuthorityPreserved !== true ||
    record.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_V1"
  ) {
    throw new Error(
      "Global Growth lifecycle-transition execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.transitionRecords) ||
    !Object.isFrozen(record.executionEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth lifecycle-transition execution must be immutable.",
    );
  }
}

export function createAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
  executedAt: string,
): AutonomousGlobalGrowthFactoryLifecycleTransitionExecution {
  const record =
    buildExecution(executedAt);

  validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION =
  createAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
    "2026-08-07T03:31:00.000Z",
  );