import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "./aiEmployeeFactoryLifecycle";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION,
  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution,
} from "./autonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION =
  "nexus-autonomous-global-growth-qualification-admission-transition-decision-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1",
  "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARED",
] as const;

export type AutonomousGlobalGrowthQualificationAdmissionTransitionDecisionValue =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthQualificationAdmissionTransitionDecisionInput {
  readonly decisionId: string;
  readonly ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision: AutonomousGlobalGrowthQualificationAdmissionTransitionDecisionValue;
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
  input: CreateAutonomousGlobalGrowthQualificationAdmissionTransitionDecisionInput,
) {
  const source =
    AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION;

  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
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
    !AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth qualification-admission decision is unsupported.",
    );
  }

  if (
    Number.isNaN(Date.parse(input.decidedAt)) ||
    new Date(input.decidedAt).toISOString() !== input.decidedAt ||
    Date.parse(input.decidedAt) < Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Qualification-admission decision time is invalid.",
    );
  }

  if (
    source !==
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION ||
    source.transitionedCandidateCount !== 9 ||
    source.transitionRecords.length !== 9 ||
    source.targetLifecycleState !== "TEMPLATE_PREPARED" ||
    source.executionEvidence.templatePrepared !== true ||
    source.executionEvidence.qualificationNotStarted !== true ||
    source.authorityBoundary.templatePrepared !== true ||
    source.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    source.authorityBoundary.qualificationExecutionAuthorized !== false ||
    source.authorityBoundary.qualificationEvidenceAccepted !== false ||
    source.authorityBoundary.ownerQualificationApproved !== false ||
    source.authorityBoundary.employeeActivationAuthorized !== false ||
    source.authorityBoundary.runtimeAuthorized !== false ||
    source.nextStep !==
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_DECISION_V1"
  ) {
    throw new Error(
      "Exact completed and inactive Global Growth TEMPLATE_PREPARED execution is required.",
    );
  }

  const templatePreparedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .TEMPLATE_PREPARED as readonly string[];

  if (
    !templatePreparedTargets.includes("QUALIFICATION_ADMISSION_PENDING") ||
    templatePreparedTargets.includes("QUALIFICATION_IN_PROGRESS")
  ) {
    throw new Error(
      "Qualification admission must use the exact sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1";

  const candidateQualificationAdmissionEligibility =
    source.transitionRecords.map((record, index) => {
      if (
        record.sourceLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        record.targetLifecycleState !== "TEMPLATE_PREPARED" ||
        record.templatePreparedTransitionExecuted !== true ||
        record.templatePrepared !== true ||
        record.qualificationAdmissionAuthorized !== false ||
        record.qualificationExecutionAuthorized !== false ||
        record.qualificationEvidenceAccepted !== false ||
        record.ownerQualificationApproved !== false ||
        record.employeeActivationAuthorized !== false ||
        record.ownerActivationApproved !== false ||
        record.runtimeAuthorized !== false
      ) {
        throw new Error(
          `Exact prepared and inactive candidate evidence is required: ${record.employeeCode}.`,
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
          "TEMPLATE_PREPARED" as const,
        targetLifecycleState:
          "QUALIFICATION_ADMISSION_PENDING" as const,

        sourceTemplatePreparedTransitionExecuted:
          true as const,
        sourceTemplatePrepared:
          true as const,

        qualificationAdmissionTransitionAuthorized:
          approved,
        qualificationAdmissionTransitionExecuted:
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
      };
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION,

    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISION_RECORDED" as const,

    ownerId:
      input.ownerId,

    sourceExecutionId:
      source.executionId,
    sourceExecutionDigest:
      source.executionDigest,

    decision:
      input.decision,
    qualificationAdmissionTransitionApproved:
      approved,
    reason:
      input.reason,

    candidateCount:
      9 as const,
    sourceLifecycleState:
      "TEMPLATE_PREPARED" as const,
    targetLifecycleState:
      "QUALIFICATION_ADMISSION_PENDING" as const,

    decisionEvidence: {
      exactTemplatePreparedExecutionBound:
        true as const,
      allowedSequentialTransitionVerified:
        true as const,
      directQualificationExecutionBypassBlocked:
        true as const,
      qualificationExecutionCandidateCount:
        0 as const,
    },

    candidateQualificationAdmissionEligibility,

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

      qualificationAdmissionTransitionAuthorized:
        approved,
      qualificationAdmissionTransitionExecuted:
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
      approved
        ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1" as const
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARED" as const,

    decidedAt:
      input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthQualificationAdmissionTransitionDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthQualificationAdmissionTransitionDecision(
  record: AutonomousGlobalGrowthQualificationAdmissionTransitionDecision,
): void {
  const {
    decisionDigest,
    ...core
  } = record;

  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1";

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_DECISION_VERSION ||
    record.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.candidateCount !== 9 ||
    record.candidateQualificationAdmissionEligibility.length !== 9 ||
    record.sourceLifecycleState !== "TEMPLATE_PREPARED" ||
    record.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
    record.qualificationAdmissionTransitionApproved !== approved ||
    record.decisionEvidence.exactTemplatePreparedExecutionBound !== true ||
    record.decisionEvidence.allowedSequentialTransitionVerified !== true ||
    record.decisionEvidence.directQualificationExecutionBypassBlocked !== true ||
    record.decisionEvidence.qualificationExecutionCandidateCount !== 0 ||
    decisionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth qualification-admission decision integrity validation failed.",
    );
  }

  if (
    record.authorityBoundary.qualificationAdmissionTransitionAuthorized !== approved ||
    record.authorityBoundary.qualificationAdmissionTransitionExecuted !== false ||
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
    record.authorityBoundary.ownerFinalAuthorityPreserved !== true
  ) {
    throw new Error(
      "Global Growth qualification-admission authority boundary is invalid.",
    );
  }

  if (
    record.candidateQualificationAdmissionEligibility.some(
      (candidate) =>
        candidate.sourceLifecycleState !== "TEMPLATE_PREPARED" ||
        candidate.targetLifecycleState !== "QUALIFICATION_ADMISSION_PENDING" ||
        candidate.sourceTemplatePreparedTransitionExecuted !== true ||
        candidate.sourceTemplatePrepared !== true ||
        candidate.qualificationAdmissionTransitionAuthorized !== approved ||
        candidate.qualificationAdmissionTransitionExecuted !== false ||
        candidate.qualificationAdmissionAuthorized !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.qualificationEvidenceAccepted !== false ||
        candidate.ownerQualificationApproved !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth qualification-admission candidate boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      (approved
        ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1"
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARED") ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.decisionEvidence) ||
    !Object.isFrozen(record.authorityBoundary) ||
    !Object.isFrozen(record.candidateQualificationAdmissionEligibility)
  ) {
    throw new Error(
      "Global Growth qualification-admission decision must remain immutable and sequential.",
    );
  }
}

export function createAutonomousGlobalGrowthQualificationAdmissionTransitionDecision(
  input: CreateAutonomousGlobalGrowthQualificationAdmissionTransitionDecisionInput,
): AutonomousGlobalGrowthQualificationAdmissionTransitionDecision {
  const record =
    buildDecision(input);

  validateAutonomousGlobalGrowthQualificationAdmissionTransitionDecision(
    record,
  );

  return record;
}
