import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "./aiEmployeeFactoryLifecycle";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
  validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution,
} from "./autonomousGlobalGrowthQualificationAdmissionTransitionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION =
  "nexus-autonomous-global-growth-qualification-execution-transition-decision-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1",
  "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_PENDING",
] as const;

export type AutonomousGlobalGrowthQualificationExecutionTransitionDecisionValue =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthQualificationExecutionTransitionDecisionInput {
  readonly decisionId: string;
  readonly ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision: AutonomousGlobalGrowthQualificationExecutionTransitionDecisionValue;
  readonly reason: string;
  readonly decidedAt: string;
}

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

function buildDecision(
  input: CreateAutonomousGlobalGrowthQualificationExecutionTransitionDecisionInput,
) {
  const source =
    AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

  validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
    source,
  );

  if (
    input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.decisionId.trim().length === 0 ||
    input.reason.trim().length < 20
  ) {
    throw new Error(
      "Verified owner identity, decision ID and substantive reason are required.",
    );
  }

  if (
    !AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Global Growth qualification-execution decision is unsupported.",
    );
  }

  if (
    Number.isNaN(Date.parse(input.decidedAt)) ||
    new Date(input.decidedAt).toISOString() !== input.decidedAt ||
    Date.parse(input.decidedAt) < Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Global Growth qualification-execution decision time is invalid.",
    );
  }

  if (
    source.transitionedCandidateCount !== 9 ||
    source.transitionRecords.length !== 9 ||
    source.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
    source.executionEvidence.qualificationAdmissionPendingRecorded !== true ||
    source.executionEvidence.directQualificationExecutionBypassBlocked !== true ||
    source.executionEvidence.qualificationExecutionStarted !== false ||
    source.authorityBoundary.qualificationAdmissionTransitionExecuted !== true ||
    source.authorityBoundary.qualificationAdmissionPendingRecorded !== true ||
    source.authorityBoundary.qualificationExecutionAuthorized !== false ||
    source.authorityBoundary.qualificationEvidenceAccepted !== false ||
    source.authorityBoundary.ownerQualificationApproved !== false ||
    source.authorityBoundary.employeeActivationAuthorized !== false ||
    source.authorityBoundary.runtimeAuthorized !== false ||
    source.nextStep !==
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_DECISION_V1"
  ) {
    throw new Error(
      "Exact inactive Global Growth qualification-admission execution is required.",
    );
  }

  const allowedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .QUALIFICATION_ADMISSION_PENDING as readonly string[];

  if (
    !allowedTargets.includes("QUALIFICATION_IN_PROGRESS") ||
    allowedTargets.includes("OWNER_QUALIFICATION_REVIEW_PENDING")
  ) {
    throw new Error(
      "Qualification execution must use the exact sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1";

  const candidateQualificationExecutionEligibility =
    source.transitionRecords.map((record, index) => {
      if (
        record.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
        record.qualificationAdmissionTransitionExecuted !== true ||
        record.qualificationAdmissionPendingRecorded !== true ||
        record.qualificationExecutionAuthorized !== false ||
        record.qualificationEvidenceAccepted !== false ||
        record.ownerQualificationApproved !== false ||
        record.employeeActivationAuthorized !== false ||
        record.runtimeAuthorized !== false
      ) {
        throw new Error(
          `Exact pending and inactive qualification source evidence is required: ${record.employeeCode}.`,
        );
      }

      return {
        transitionSequence:
          index + 1,
        sourceTransitionRecordId:
          record.transitionRecordId,
        sourceTransitionRecordDigest:
          record.transitionRecordDigest,
        sourceFactoryRecordId:
          record.sourceFactoryRecordId,
        sourceFactoryRecordDigest:
          record.sourceFactoryRecordDigest,
        templateId:
          record.templateId,
        templateDigest:
          record.templateDigest,
        employeeId:
          record.employeeId,
        employeeCode:
          record.employeeCode,
        publicName:
          record.publicName,
        officialRole:
          record.officialRole,
        department:
          record.department,

        sourceLifecycleState:
          "QUALIFICATION_ADMISSION_PENDING" as const,
        targetLifecycleState:
          "QUALIFICATION_IN_PROGRESS" as const,

        sourceQualificationAdmissionPendingRecorded:
          true as const,

        qualificationExecutionTransitionAuthorized:
          approved,
        qualificationExecutionTransitionExecuted:
          false as const,
        qualificationExecutionAuthorized:
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
      };
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION,

    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISION_RECORDED" as const,

    ownerId:
      input.ownerId,

    sourceExecutionId:
      source.executionId,
    sourceExecutionDigest:
      source.executionDigest,

    decision:
      input.decision,
    qualificationExecutionTransitionApproved:
      approved,
    reason:
      input.reason,

    reviewedEvidence: {
      candidateCount:
        9 as const,
      sourceLifecycleState:
        "QUALIFICATION_ADMISSION_PENDING" as const,
      targetLifecycleState:
        "QUALIFICATION_IN_PROGRESS" as const,
      exactAdmissionExecutionBound:
        true as const,
      allowedSequentialTransitionVerified:
        true as const,
      exactCandidateIdentityBindingVerified:
        true as const,
      immutableTemplateEvidenceVerified:
        true as const,
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

    candidateQualificationExecutionEligibility,

    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourceExecutionBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      exactNineTransitionsRequired:
        true as const,
      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,

      qualificationExecutionTransitionAuthorized:
        approved,
      qualificationExecutionTransitionExecuted:
        false as const,
      qualificationExecutionAuthorized:
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
      approved
        ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1" as const
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_PENDING" as const,

    decidedAt:
      input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthQualificationExecutionTransitionDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision(
  record: AutonomousGlobalGrowthQualificationExecutionTransitionDecision,
): void {
  const {
    decisionDigest,
    ...core
  } = record;

  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1";

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_DECISION_VERSION ||
    record.qualificationExecutionTransitionApproved !== approved ||
    record.reviewedEvidence.candidateCount !== 9 ||
    record.reviewedEvidence.sourceLifecycleState !==
      "QUALIFICATION_ADMISSION_PENDING" ||
    record.reviewedEvidence.targetLifecycleState !==
      "QUALIFICATION_IN_PROGRESS" ||
    record.candidateQualificationExecutionEligibility.length !== 9 ||
    decisionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth qualification-execution decision integrity validation failed.",
    );
  }

  if (
    record.authorityBoundary.qualificationExecutionTransitionAuthorized !== approved ||
    record.authorityBoundary.qualificationExecutionTransitionExecuted !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
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
    record.authorityBoundary.ownerFinalAuthorityPreserved !== true
  ) {
    throw new Error(
      "Global Growth qualification-execution decision authority boundary is invalid.",
    );
  }

  if (
    record.candidateQualificationExecutionEligibility.some(
      (candidate) =>
        candidate.sourceLifecycleState !==
          "QUALIFICATION_ADMISSION_PENDING" ||
        candidate.targetLifecycleState !== "QUALIFICATION_IN_PROGRESS" ||
        candidate.sourceQualificationAdmissionPendingRecorded !== true ||
        candidate.qualificationExecutionTransitionAuthorized !== approved ||
        candidate.qualificationExecutionTransitionExecuted !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.qualificationEvidenceCreated !== false ||
        candidate.qualificationEvidenceAccepted !== false ||
        candidate.ownerQualificationApproved !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth qualification-execution candidate boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      (approved
        ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1"
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_PENDING") ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedEvidence) ||
    !Object.isFrozen(record.authorityBoundary) ||
    !Object.isFrozen(record.candidateQualificationExecutionEligibility)
  ) {
    throw new Error(
      "Global Growth qualification-execution decision must remain immutable and sequential.",
    );
  }
}

export function createAutonomousGlobalGrowthQualificationExecutionTransitionDecision(
  input: CreateAutonomousGlobalGrowthQualificationExecutionTransitionDecisionInput,
): AutonomousGlobalGrowthQualificationExecutionTransitionDecision {
  const record =
    buildDecision(input);

  validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision(
    record,
  );

  return record;
}