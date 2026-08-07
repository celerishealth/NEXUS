import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
} from "./autonomousGlobalGrowthQualificationExecutionTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision,
} from "./autonomousGlobalGrowthQualificationExecutionTransitionDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
  validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution,
} from "./autonomousGlobalGrowthQualificationAdmissionTransitionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-qualification-execution-transition-execution-v1" as const;

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
    AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

  const source =
    AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

  validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision(
    decision,
  );

  validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
    source,
  );

  if (
    Number.isNaN(Date.parse(executedAt)) ||
    new Date(executedAt).toISOString() !== executedAt ||
    Date.parse(executedAt) < Date.parse(decision.decidedAt) ||
    Date.parse(executedAt) < Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Global Growth qualification-execution transition time is invalid.",
    );
  }

  if (
    decision.qualificationExecutionTransitionApproved !== true ||
    decision.authorityBoundary.qualificationExecutionTransitionAuthorized !== true ||
    decision.authorityBoundary.qualificationExecutionTransitionExecuted !== false ||
    decision.reviewedEvidence.candidateCount !== 9 ||
    decision.reviewedEvidence.sourceLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    decision.reviewedEvidence.targetLifecycleState !==
      "QUALIFICATION_IN_PROGRESS" ||
    decision.nextStep !==
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1"
  ) {
    throw new Error(
      "Exact owner-approved Global Growth qualification-execution decision is required.",
    );
  }

  if (
    source.transitionedCandidateCount !== 9 ||
    source.transitionRecords.length !== 9 ||
    source.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
    source.authorityBoundary.qualificationAdmissionPendingRecorded !== true ||
    source.authorityBoundary.qualificationExecutionAuthorized !== false ||
    source.authorityBoundary.qualificationEvidenceAccepted !== false ||
    source.authorityBoundary.ownerQualificationApproved !== false ||
    source.authorityBoundary.runtimeAuthorized !== false
  ) {
    throw new Error(
      "Exact qualification-admission-pending source execution is required.",
    );
  }


  const transitionRecords =
    decision.candidateQualificationExecutionEligibility.map(
      (candidate, index) => {
        const sourceRecord =
          source.transitionRecords.find(
            (record) =>
              record.transitionRecordId ===
                candidate.sourceTransitionRecordId &&
              record.transitionRecordDigest ===
                candidate.sourceTransitionRecordDigest &&
              record.employeeId === candidate.employeeId &&
              record.employeeCode === candidate.employeeCode &&
              record.templateId === candidate.templateId &&
              record.templateDigest === candidate.templateDigest,
          );

        if (
          !sourceRecord ||
          sourceRecord.targetLifecycleState !==
            "QUALIFICATION_ADMISSION_PENDING" ||
          sourceRecord.qualificationAdmissionPendingRecorded !== true ||
          sourceRecord.qualificationExecutionAuthorized !== false ||
          sourceRecord.qualificationEvidenceAccepted !== false ||
          sourceRecord.ownerQualificationApproved !== false ||
          sourceRecord.runtimeAuthorized !== false ||
          candidate.sourceLifecycleState !==
            "QUALIFICATION_ADMISSION_PENDING" ||
          candidate.targetLifecycleState !== "QUALIFICATION_IN_PROGRESS" ||
          candidate.qualificationExecutionTransitionAuthorized !== true ||
          candidate.qualificationExecutionTransitionExecuted !== false ||
          candidate.qualificationFixtureExecutionStarted !== false ||
          candidate.qualificationEvidenceCreated !== false
        ) {
          throw new Error(
            `Invalid qualification-execution source evidence: ${candidate.employeeCode}.`,
          );
        }

        const recordCore = {
          transitionRecordId:
            `global-growth-qualification-execution-${candidate.employeeId}`,
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
            "QUALIFICATION_ADMISSION_PENDING" as const,
          targetLifecycleState:
            "QUALIFICATION_IN_PROGRESS" as const,

          sourceQualificationAdmissionPendingRecorded:
            true as const,

          qualificationExecutionTransitionAuthorized:
            true as const,
          qualificationExecutionTransitionExecuted:
            true as const,
          qualificationExecutionAuthorized:
            true as const,

          qualificationFixturePackPrepared:
            false as const,
          qualificationFixtureExecutionStarted:
            false as const,
          qualificationFixtureExecutionCompleted:
            false as const,

          qualificationEvidenceCreated:
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
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION,

    executionId:
      "autonomous-global-growth-qualification-execution-transition-execution-001",

    executionState:
      "OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTED" as const,

    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,

    sourceAdmissionExecutionId:
      source.executionId,
    sourceAdmissionExecutionDigest:
      source.executionDigest,

    transitionedCandidateCount:
      9 as const,

    sourceLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,
    targetLifecycleState:
      "QUALIFICATION_IN_PROGRESS" as const,

    transitionRecords,

    executionEvidence: {
      exactOwnerApprovalBound:
        true as const,
      exactAdmissionExecutionBound:
        true as const,
      exactNineTransitionsExecuted:
        true as const,

      qualificationExecutionInProgressRecorded:
        true as const,
      qualificationExecutionAuthorized:
        true as const,

      qualificationFixturePacksPrepared:
        0 as const,
      qualificationFixturesExecuted:
        0 as const,
      qualificationEvidenceRecordsCreated:
        0 as const,
      qualificationEvidenceRecordsAccepted:
        0 as const,
      qualifiedCandidateCount:
        0 as const,
      activationEligibleCandidateCount:
        0 as const,

      founderLiberationAchieved:
        false as const,
    },

    authorityBoundary: {
      qualificationExecutionTransitionExecuted:
        true as const,
      qualificationExecutionAuthorized:
        true as const,

      qualificationFixturePackPrepared:
        false as const,
      qualificationFixtureExecutionStarted:
        false as const,
      qualificationFixtureExecutionCompleted:
        false as const,

      qualificationEvidenceCreated:
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
      "PREPARE_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_FIXTURE_PACKS_V1" as const,

    executedAt,
  };

  return deepFreeze({
    ...executionCore,
    executionDigest:
      sha256(executionCore),
  });
}

export type AutonomousGlobalGrowthQualificationExecutionTransitionExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
  record: AutonomousGlobalGrowthQualificationExecutionTransitionExecution,
): void {
  const {
    executionDigest,
    ...core
  } = record;

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION ||
    record.transitionedCandidateCount !== 9 ||
    record.transitionRecords.length !== 9 ||
    record.sourceLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    record.targetLifecycleState !== "QUALIFICATION_IN_PROGRESS" ||
    executionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth qualification-execution transition integrity validation failed.",
    );
  }

  if (
    record.transitionRecords.some(
      (item) =>
        item.sourceLifecycleState !==
          "QUALIFICATION_ADMISSION_PENDING" ||
        item.targetLifecycleState !== "QUALIFICATION_IN_PROGRESS" ||
        item.sourceQualificationAdmissionPendingRecorded !== true ||
        item.qualificationExecutionTransitionAuthorized !== true ||
        item.qualificationExecutionTransitionExecuted !== true ||
        item.qualificationExecutionAuthorized !== true ||
        item.qualificationFixturePackPrepared !== false ||
        item.qualificationFixtureExecutionStarted !== false ||
        item.qualificationFixtureExecutionCompleted !== false ||
        item.qualificationEvidenceCreated !== false ||
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
      "Global Growth qualification-execution transition record boundary is invalid.",
    );
  }

  if (
    record.executionEvidence.exactOwnerApprovalBound !== true ||
    record.executionEvidence.exactAdmissionExecutionBound !== true ||
    record.executionEvidence.exactNineTransitionsExecuted !== true ||
    record.executionEvidence.qualificationExecutionInProgressRecorded !== true ||
    record.executionEvidence.qualificationExecutionAuthorized !== true ||
    record.executionEvidence.qualificationFixturePacksPrepared !== 0 ||
    record.executionEvidence.qualificationFixturesExecuted !== 0 ||
    record.executionEvidence.qualificationEvidenceRecordsCreated !== 0 ||
    record.executionEvidence.qualificationEvidenceRecordsAccepted !== 0 ||
    record.executionEvidence.qualifiedCandidateCount !== 0 ||
    record.executionEvidence.activationEligibleCandidateCount !== 0 ||
    record.authorityBoundary.qualificationExecutionTransitionExecuted !== true ||
    record.authorityBoundary.qualificationExecutionAuthorized !== true ||
    record.authorityBoundary.qualificationFixturePackPrepared !== false ||
    record.authorityBoundary.qualificationFixtureExecutionStarted !== false ||
    record.authorityBoundary.qualificationFixtureExecutionCompleted !== false ||
    record.authorityBoundary.qualificationEvidenceCreated !== false ||
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
      "PREPARE_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_FIXTURE_PACKS_V1"
  ) {
    throw new Error(
      "Global Growth qualification-execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.transitionRecords) ||
    !Object.isFrozen(record.executionEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth qualification-execution transition must remain immutable.",
    );
  }
}

export function createAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
  executedAt: string,
): AutonomousGlobalGrowthQualificationExecutionTransitionExecution {
  const record =
    buildExecution(executedAt);

  validateAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION =
  createAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
    "2026-08-07T05:00:00.000Z",
  );
