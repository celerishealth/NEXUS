import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "./aiEmployeeFactoryLifecycle";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution,
} from "./autonomousGlobalGrowthFactoryLifecycleTransitionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_VERSION =
  "nexus-autonomous-global-growth-template-prepared-factory-transition-decision-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1",
  "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARATION_PENDING",
] as const;

export type AutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecisionInput {
  readonly decisionId: string;
  readonly ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision: AutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecisionType;
  readonly reason: string;
  readonly decidedAt: string;
}

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

function buildDecision(
  input: CreateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecisionInput,
) {
  const source =
    AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

  validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(source);

  if (
    Number.isNaN(Date.parse(input.decidedAt)) ||
    new Date(input.decidedAt).toISOString() !== input.decidedAt ||
    Date.parse(input.decidedAt) < Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED transition decision time is invalid.",
    );
  }

  if (
    input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.decisionId.trim().length === 0 ||
    input.reason.trim().length < 20
  ) {
    throw new Error(
      "Verified owner identity, decision ID and reason are required.",
    );
  }

  if (
    !AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED transition owner decision is invalid.",
    );
  }

  if (
    source.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_V1" ||
    source.transitionedCandidateCount !== 9 ||
    source.transitionRecords.length !== 9 ||
    source.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
    source.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
    source.executionEvidence.templatePreparationPendingRecorded !== true ||
    source.executionEvidence.templatePrepared !== false ||
    source.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    source.authorityBoundary.qualificationExecutionAuthorized !== false ||
    source.authorityBoundary.runtimeAuthorized !== false
  ) {
    throw new Error(
      "Completed and safely bounded Global Growth pending-transition execution is required.",
    );
  }

  const allowedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .TEMPLATE_PREPARATION_PENDING as readonly string[];

  if (!allowedTargets.includes("TEMPLATE_PREPARED")) {
    throw new Error(
      "TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED is not a legal sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1";

  const candidateTransitionEligibility =
    source.transitionRecords.map((transition, index) => {
      if (
        transition.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        transition.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        transition.lifecycleTransitionExecuted !== true ||
        transition.sourceFactoryRecordPreserved !== true ||
        transition.templateCreationEvidenceBound !== true ||
        transition.templatePreparationExecutionAuthorized !== false ||
        transition.templatePrepared !== false ||
        transition.qualificationAdmissionAuthorized !== false ||
        transition.qualificationExecutionAuthorized !== false ||
        transition.ownerQualificationApproved !== false ||
        transition.employeeActivationAuthorized !== false ||
        transition.runtimeAuthorized !== false
      ) {
        throw new Error(
          `Exact inactive pending source evidence is required: ${transition.employeeCode}.`,
        );
      }

      return {
        transitionSequence: index + 1,
        sourceTransitionRecordId:
          transition.transitionRecordId,
        sourceTransitionRecordDigest:
          transition.transitionRecordDigest,
        sourceFactoryRecordId:
          transition.sourceFactoryRecordId,
        sourceFactoryRecordDigest:
          transition.sourceFactoryRecordDigest,
        templateId:
          transition.templateId,
        templateDigest:
          transition.templateDigest,
        employeeId:
          transition.employeeId,
        employeeCode:
          transition.employeeCode,
        publicName:
          transition.publicName,
        officialRole:
          transition.officialRole,
        department:
          transition.department,
        sourceLifecycleState:
          "TEMPLATE_PREPARATION_PENDING" as const,
        targetLifecycleState:
          "TEMPLATE_PREPARED" as const,
        templatePreparedTransitionAuthorized:
          approved,
        templatePreparedTransitionExecuted:
          false as const,
        qualificationAdmissionAuthorized:
          false as const,
        qualificationExecutionAuthorized:
          false as const,
        qualificationEvidenceAccepted:
          false as const,
        ownerQualificationApproved:
          false as const,
        employeeActivationAuthorized:
          false as const,
        runtimeAuthorized:
          false as const,
      };
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_RECORDED" as const,
    ownerId:
      input.ownerId,

    sourceExecutionId:
      source.executionId,
    sourceExecutionDigest:
      source.executionDigest,
    sourceFactoryFoundationDigest:
      source.sourceFactoryFoundationDigest,

    decision:
      input.decision,
    templatePreparedTransitionApproved:
      approved,
    reason:
      input.reason,

    candidateCount:
      9 as const,
    sourceLifecycleState:
      "TEMPLATE_PREPARATION_PENDING" as const,
    targetLifecycleState:
      "TEMPLATE_PREPARED" as const,

    candidateTransitionEligibility,

    authorityBoundary: {
      exactPendingTransitionEvidenceBound:
        true as const,
      sourceLifecycleStateLocked:
        true as const,
      targetLifecycleStateLocked:
        true as const,

      templatePreparedTransitionAuthorized:
        approved,
      templatePreparedTransitionExecuted:
        false as const,

      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      qualificationEvidenceAccepted:
        false as const,
      ownerQualificationApproved:
        false as const,

      employeeActivationAuthorized:
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

    nextStep: approved
      ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1" as const
      : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARATION_PENDING" as const,

    decidedAt:
      input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision(
  record: AutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision,
): void {
  const {
    decisionDigest,
    ...core
  } = record;

  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1";

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_VERSION ||
    record.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.candidateCount !== 9 ||
    record.candidateTransitionEligibility.length !== 9 ||
    record.sourceLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
    record.targetLifecycleState !== "TEMPLATE_PREPARED" ||
    record.templatePreparedTransitionApproved !== approved ||
    decisionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED transition decision integrity validation failed.",
    );
  }

  if (
    record.authorityBoundary.templatePreparedTransitionAuthorized !== approved ||
    record.authorityBoundary.templatePreparedTransitionExecuted !== false ||
    record.authorityBoundary.qualificationAdmissionAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
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
      "Global Growth TEMPLATE_PREPARED transition authority boundary is invalid.",
    );
  }

  if (
    record.candidateTransitionEligibility.some(
      (candidate) =>
        candidate.sourceLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        candidate.targetLifecycleState !== "TEMPLATE_PREPARED" ||
        candidate.templatePreparedTransitionAuthorized !== approved ||
        candidate.templatePreparedTransitionExecuted !== false ||
        candidate.qualificationAdmissionAuthorized !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED candidate boundary is invalid.",
    );
  }

  if (
    record.nextStep !==
      (approved
        ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1"
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARATION_PENDING") ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.authorityBoundary) ||
    !Object.isFrozen(record.candidateTransitionEligibility)
  ) {
    throw new Error(
      "Global Growth TEMPLATE_PREPARED decision must remain immutable and sequential.",
    );
  }
}

export function createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision(
  input: CreateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecisionInput,
): AutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision {
  const record =
    buildDecision(input);

  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision(
    record,
  );

  return record;
}