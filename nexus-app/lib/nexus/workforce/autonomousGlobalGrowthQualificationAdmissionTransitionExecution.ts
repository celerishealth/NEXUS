import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION,
} from "./autonomousGlobalGrowthQualificationAdmissionTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthQualificationAdmissionTransitionDecision,
} from "./autonomousGlobalGrowthQualificationAdmissionTransitionDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION,
  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution,
} from "./autonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-qualification-admission-transition-execution-v1" as const;

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

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

function buildExecution(executedAt: string) {
  const decision =
    AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION;

  const source =
    AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION;

  validateAutonomousGlobalGrowthQualificationAdmissionTransitionDecision(
    decision,
  );

  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
    source,
  );

  if (
    Number.isNaN(Date.parse(executedAt)) ||
    new Date(executedAt).toISOString() !== executedAt ||
    Date.parse(executedAt) < Date.parse(decision.decidedAt) ||
    Date.parse(executedAt) < Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Global Growth qualification-admission execution time is invalid.",
    );
  }

  if (
    decision.qualificationAdmissionTransitionApproved !== true ||
    decision.authorityBoundary.qualificationAdmissionTransitionAuthorized !== true ||
    decision.authorityBoundary.qualificationAdmissionTransitionExecuted !== false ||
    decision.candidateCount !== 9 ||
    decision.candidateQualificationAdmissionEligibility.length !== 9 ||
    decision.sourceLifecycleState !== "TEMPLATE_PREPARED" ||
    decision.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1"
  ) {
    throw new Error(
      "Exact owner-approved Global Growth qualification-admission decision is required.",
    );
  }

  if (
    source.transitionedCandidateCount !== 9 ||
    source.transitionRecords.length !== 9 ||
    source.targetLifecycleState !== "TEMPLATE_PREPARED" ||
    source.executionEvidence.templatePrepared !== true ||
    source.executionEvidence.qualificationNotStarted !== true ||
    source.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    source.authorityBoundary.qualificationExecutionAuthorized !== false ||
    source.authorityBoundary.qualificationEvidenceAccepted !== false ||
    source.authorityBoundary.ownerQualificationApproved !== false ||
    source.authorityBoundary.employeeActivationAuthorized !== false ||
    source.authorityBoundary.runtimeAuthorized !== false
  ) {
    throw new Error(
      "Exact prepared and inactive Global Growth source execution is required.",
    );
  }

  const transitionRecords =
    decision.candidateQualificationAdmissionEligibility.map(
      (candidate, index) => {
        const sourceRecord =
          source.transitionRecords.find(
            (record) =>
              record.transitionRecordId === candidate.sourceTransitionRecordId &&
              record.transitionRecordDigest === candidate.sourceTransitionRecordDigest &&
              record.employeeId === candidate.employeeId &&
              record.employeeCode === candidate.employeeCode &&
              record.templateId === candidate.templateId &&
              record.templateDigest === candidate.templateDigest,
          );

        if (
          !sourceRecord ||
          sourceRecord.targetLifecycleState !== "TEMPLATE_PREPARED" ||
          sourceRecord.templatePreparedTransitionExecuted !== true ||
          sourceRecord.templatePrepared !== true ||
          sourceRecord.qualificationAdmissionAuthorized !== false ||
          sourceRecord.qualificationExecutionAuthorized !== false ||
          sourceRecord.qualificationEvidenceAccepted !== false ||
          sourceRecord.ownerQualificationApproved !== false ||
          sourceRecord.employeeActivationAuthorized !== false ||
          sourceRecord.runtimeAuthorized !== false ||
          candidate.sourceLifecycleState !== "TEMPLATE_PREPARED" ||
          candidate.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
          candidate.qualificationAdmissionTransitionAuthorized !== true ||
          candidate.qualificationAdmissionTransitionExecuted !== false
        ) {
          throw new Error(
            `Invalid qualification-admission source evidence: ${candidate.employeeCode}.`,
          );
        }

        const recordCore = {
          transitionRecordId:
            `global-growth-qualification-admission-${candidate.employeeId}`,
          transitionSequence:
            index + 1,

          sourceTransitionRecordId:
            sourceRecord.transitionRecordId,
          sourceTransitionRecordDigest:
            sourceRecord.transitionRecordDigest,
          sourceFactoryRecordId:
            sourceRecord.sourceFactoryRecordId,
          sourceFactoryRecordDigest:
            sourceRecord.sourceFactoryRecordDigest,

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
            "TEMPLATE_PREPARED" as const,
          targetLifecycleState:
            "QUALIFICATION_ADMISSION_PENDING" as const,

          qualificationAdmissionTransitionAuthorized:
            true as const,
          qualificationAdmissionTransitionExecuted:
            true as const,
          qualificationAdmissionPendingRecorded:
            true as const,

          sourceTemplatePreparedRecordPreserved:
            true as const,
          sourceFactoryRecordPreserved:
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

          publicPublishingAuthorized:
            false as const,
          customerMessagingAuthorized:
            false as const,
          leadContactAuthorized:
            false as const,
          productionExecutionAuthorized:
            false as const,
          autonomousExternalActionAuthorized:
            false as const,

          transitionedAt:
            executedAt,
        };

        return deepFreeze({
          ...recordCore,
          transitionRecordDigest:
            sha256(recordCore),
        });
      },
    );

  const executionCore = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION,

    executionId:
      "autonomous-global-growth-qualification-admission-transition-execution-001",

    executionState:
      "OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTED" as const,

    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,

    sourceTemplatePreparedExecutionId:
      source.executionId,
    sourceTemplatePreparedExecutionDigest:
      source.executionDigest,

    transitionedCandidateCount:
      9 as const,

    sourceLifecycleState:
      "TEMPLATE_PREPARED" as const,
    targetLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,

    transitionRecords,

    executionEvidence: {
      sourceOwnerApprovalBound:
        true as const,
      sourceTemplatePreparedExecutionPreserved:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,
      exactNineTransitionsExecuted:
        true as const,
      qualificationAdmissionPendingRecorded:
        true as const,
      directQualificationExecutionBypassBlocked:
        true as const,
      qualificationExecutionStarted:
        false as const,
    },

    authorityBoundary: {
      sourceOwnerApprovalBound:
        true as const,
      sourceTemplatePreparedExecutionPreserved:
        true as const,
      sourceFactoryRecordsPreserved:
        true as const,

      qualificationAdmissionTransitionPerformed:
        true as const,
      qualificationAdmissionTransitionExecuted:
        true as const,
      qualificationAdmissionPendingRecorded:
        true as const,

      sourceTransitionRecordsMutated:
        false as const,
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
      paidAdvertisingAuthorized:
        false as const,
      productionExecutionAuthorized:
        false as const,
      autonomousExternalActionAuthorized:
        false as const,

      levelThreeAuthorityGranted:
        false as const,
      founderLiberationAchieved:
        false as const,
      ownerFinalAuthorityPreserved:
        true as const,
    },

    nextStep:
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_DECISION_V1" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest:
      sha256(executionCore),
  });
}

export type AutonomousGlobalGrowthQualificationAdmissionTransitionExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
  record: AutonomousGlobalGrowthQualificationAdmissionTransitionExecution,
): void {
  const {
    executionDigest,
    ...core
  } = record;

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION ||
    record.transitionedCandidateCount !== 9 ||
    record.transitionRecords.length !== 9 ||
    record.sourceLifecycleState !== "TEMPLATE_PREPARED" ||
    record.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
    executionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth qualification-admission execution integrity validation failed.",
    );
  }

  if (
    record.transitionRecords.some(
      (item) =>
        item.sourceLifecycleState !== "TEMPLATE_PREPARED" ||
        item.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
        item.qualificationAdmissionTransitionAuthorized !== true ||
        item.qualificationAdmissionTransitionExecuted !== true ||
        item.qualificationAdmissionPendingRecorded !== true ||
        item.templatePrepared !== true ||
        item.qualificationAdmissionAuthorized !== false ||
        item.qualificationExecutionAuthorized !== false ||
        item.qualificationEvidenceAccepted !== false ||
        item.ownerQualificationApproved !== false ||
        item.employeeActivationAuthorized !== false ||
        item.runtimeAuthorized !== false ||
        item.publicPublishingAuthorized !== false ||
        item.productionExecutionAuthorized !== false ||
        item.autonomousExternalActionAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth qualification-admission transition record boundary is invalid.",
    );
  }

  if (
    record.executionEvidence.sourceOwnerApprovalBound !== true ||
    record.executionEvidence.sourceTemplatePreparedExecutionPreserved !== true ||
    record.executionEvidence.sourceFactoryRecordsPreserved !== true ||
    record.executionEvidence.exactNineTransitionsExecuted !== true ||
    record.executionEvidence.qualificationAdmissionPendingRecorded !== true ||
    record.executionEvidence.directQualificationExecutionBypassBlocked !== true ||
    record.executionEvidence.qualificationExecutionStarted !== false ||
    record.authorityBoundary.qualificationAdmissionTransitionPerformed !== true ||
    record.authorityBoundary.qualificationAdmissionTransitionExecuted !== true ||
    record.authorityBoundary.qualificationAdmissionPendingRecorded !== true ||
    record.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.qualificationEvidenceAccepted !== false ||
    record.authorityBoundary.ownerQualificationApproved !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.runtimeAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.levelThreeAuthorityGranted !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.authorityBoundary.ownerFinalAuthorityPreserved !== true ||
    record.nextStep !==
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_DECISION_V1"
  ) {
    throw new Error(
      "Global Growth qualification-admission execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.transitionRecords) ||
    !Object.isFrozen(record.executionEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth qualification-admission execution must remain immutable.",
    );
  }
}

export function createAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
  executedAt: string,
): AutonomousGlobalGrowthQualificationAdmissionTransitionExecution {
  const record =
    buildExecution(executedAt);

  validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION =
  createAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
    "2026-08-07T04:34:00.000Z",
  );