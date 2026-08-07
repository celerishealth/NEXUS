import { createHash } from "node:crypto";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "./aiEmployeeFactoryLifecycle";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION,
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution,
} from "./autonomousGlobalGrowthAIEmployeeTemplateCreationExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION =
  "nexus-autonomous-global-growth-factory-lifecycle-transition-decision-v1" as const;

export const AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1",
  "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_CANDIDATES_PLANNED",
] as const;

export type AutonomousGlobalGrowthFactoryLifecycleTransitionDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISIONS)[number];

export interface CreateAutonomousGlobalGrowthFactoryLifecycleTransitionDecisionInput {
  readonly decisionId: string;
  readonly ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly decision: AutonomousGlobalGrowthFactoryLifecycleTransitionDecisionType;
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

function requireTimestamp(value: string): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error("Global Growth lifecycle-transition decision time is invalid.");
  }
}

function buildDecision(
  input: CreateAutonomousGlobalGrowthFactoryLifecycleTransitionDecisionInput,
) {
  const admission =
    AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION;
  const templateExecution =
    AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION;

  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
    admission,
  );
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
    templateExecution,
  );

  requireTimestamp(input.decidedAt);

  if (
    input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    input.decisionId.trim().length === 0 ||
    input.reason.trim().length < 20
  ) {
    throw new Error(
      "Verified owner identity, decision ID and reason are required for Global Growth lifecycle-transition review.",
    );
  }

  if (
    !AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error("Global Growth lifecycle-transition owner decision is invalid.");
  }

  if (
    Date.parse(input.decidedAt) < Date.parse(templateExecution.executedAt) ||
    Date.parse(input.decidedAt) < Date.parse(admission.executedAt)
  ) {
    throw new Error(
      "Global Growth lifecycle-transition decision cannot precede its source evidence.",
    );
  }

  if (
    admission.admittedFactoryCandidateCount !== 9 ||
    admission.candidateRecords.length !== 9 ||
    templateExecution.templateRegistry.registeredTemplateCount !== 9 ||
    templateExecution.templateRegistry.qualifiedTemplateCount !== 0 ||
    templateExecution.templateRegistry.activationEligibleTemplateCount !== 0 ||
    templateExecution.authorityBoundary.factoryLifecycleTransitionAuthorized !== false ||
    templateExecution.creationEvidence.everyTemplateUnqualified !== true ||
    templateExecution.creationEvidence.everyTemplateActivationBlocked !== true
  ) {
    throw new Error(
      "Exact bounded Global Growth Factory and template evidence is required.",
    );
  }

  const allowedTargets =
    AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
      .PLANNED_CANDIDATE as readonly string[];

  if (!allowedTargets.includes("TEMPLATE_PREPARATION_PENDING")) {
    throw new Error(
      "Global Growth pending transition is not a legal sequential Factory transition.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1";

  const candidateTransitionEligibility =
    admission.candidateRecords.map((candidate, index) => {
      const template =
        templateExecution.templateRegistry.templates.find(
          (entry) =>
            entry.employeeId === candidate.employeeId &&
            entry.employeeCode === candidate.employeeCode &&
            entry.publicName === candidate.publicName &&
            entry.officialRole === candidate.officialRole &&
            entry.department === candidate.department,
        );

      if (
        !template ||
        candidate.lifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.templatePrepared !== false ||
        candidate.qualificationAdmissionAuthorized !== false ||
        candidate.qualificationEvidenceAccepted !== false ||
        candidate.ownerQualificationApproved !== false ||
        candidate.activationCandidatePrepared !== false ||
        candidate.ownerActivationApproved !== false ||
        candidate.runtimeAuthorized !== false ||
        template.status !== "REGISTERED_UNQUALIFIED"
      ) {
        throw new Error(
          `Global Growth candidate is not bound to exact inactive template evidence: ${candidate.employeeCode}.`,
        );
      }

      return {
        transitionSequence: index + 1,
        factoryRecordId: candidate.factoryRecordId,
        factoryRecordDigest: candidate.recordDigest,
        templateId: template.templateId,
        templateDigest: template.templateDigest,
        employeeId: candidate.employeeId,
        employeeCode: candidate.employeeCode,
        publicName: candidate.publicName,
        officialRole: candidate.officialRole,
        department: candidate.department,
        sourceLifecycleState: "PLANNED_CANDIDATE" as const,
        targetLifecycleState: "TEMPLATE_PREPARATION_PENDING" as const,
        templateCreationEvidenceBound: true as const,
        lifecycleTransitionAuthorized: approved,
        lifecycleTransitionExecuted: false as const,
        templatePrepared: false as const,
        qualificationAdmissionAuthorized: false as const,
        qualificationExecutionAuthorized: false as const,
        qualificationEvidenceAccepted: false as const,
        ownerQualificationApproved: false as const,
        activationCandidatePrepared: false as const,
        ownerActivationApproved: false as const,
        runtimeAuthorized: false as const,
      };
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION,
    decisionId: input.decisionId,
    decisionState:
      "OWNER_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISION_RECORDED" as const,
    ownerId: input.ownerId,

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

    decision: input.decision,
    lifecycleTransitionApproved: approved,
    reason: input.reason,

    candidateCount: 9 as const,
    sourceLifecycleState:
      "PLANNED_CANDIDATE" as const,
    targetLifecycleState:
      "TEMPLATE_PREPARATION_PENDING" as const,

    candidateTransitionEligibility,

    authorityBoundary: {
      exactCandidateIdentityBindingVerified: true as const,
      exactTemplateEvidenceBindingVerified: true as const,
      sourceFactoryRecordsPreserved: true as const,
      sourceLifecycleStateLocked: true as const,
      targetLifecycleStateLocked: true as const,

      lifecycleTransitionAuthorized: approved,
      lifecycleTransitionExecuted: false as const,

      directTemplatePreparedBypassAuthorized: false as const,
      qualificationAdmissionAuthorized: false as const,
      qualificationExecutionAuthorized: false as const,
      qualificationEvidenceAccepted: false as const,
      ownerQualificationApproved: false as const,

      activationCandidatePrepared: false as const,
      employeeActivationAuthorized: false as const,
      ownerActivationApproved: false as const,
      runtimeAuthorized: false as const,
      controlledWorkAuthorized: false as const,

      realCredentialAccessAuthorized: false as const,
      liveConnectorActivationAuthorized: false as const,
      videoGenerationExecutionAuthorized: false as const,
      publicPublishingAuthorized: false as const,
      customerMessagingAuthorized: false as const,
      commentResponseAuthorized: false as const,
      leadContactAuthorized: false as const,
      demoBookingExecutionAuthorized: false as const,
      proposalDeliveryAuthorized: false as const,
      paidAdvertisingAuthorized: false as const,
      productionExecutionAuthorized: false as const,
      autonomousExternalActionAuthorized: false as const,
      blockedMetaAccountUseAuthorized: false as const,
      blockedMetaAccountBypassAuthorized: false as const,

      levelThreeAuthorityGranted: false as const,
      founderLiberationAchieved: false as const,
      ownerFinalAuthorityPreserved: true as const,
    },

    nextStep: approved
      ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1" as const
      : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_CANDIDATES_PLANNED" as const,

    decidedAt: input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest: sha256(core),
  });
}

export type AutonomousGlobalGrowthFactoryLifecycleTransitionDecision =
  ReturnType<typeof buildDecision>;

export function validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision(
  record: AutonomousGlobalGrowthFactoryLifecycleTransitionDecision,
): void {
  const {
    decisionDigest,
    ...core
  } = record;

  if (
    record.version !==
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION ||
    record.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    record.candidateCount !== 9 ||
    record.candidateTransitionEligibility.length !== 9 ||
    record.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
    record.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
    decisionDigest !== sha256(core)
  ) {
    throw new Error(
      "Global Growth lifecycle-transition decision integrity validation failed.",
    );
  }

  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1";

  if (
    record.lifecycleTransitionApproved !== approved ||
    record.authorityBoundary.lifecycleTransitionAuthorized !== approved ||
    record.authorityBoundary.lifecycleTransitionExecuted !== false ||
    record.authorityBoundary.directTemplatePreparedBypassAuthorized !== false ||
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
      (approved
        ? "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1"
        : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_CANDIDATES_PLANNED")
  ) {
    throw new Error(
      "Global Growth lifecycle-transition authority boundary is invalid.",
    );
  }

  if (
    record.candidateTransitionEligibility.some(
      (candidate) =>
        candidate.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        candidate.targetLifecycleState !== "TEMPLATE_PREPARATION_PENDING" ||
        candidate.templateCreationEvidenceBound !== true ||
        candidate.lifecycleTransitionAuthorized !== approved ||
        candidate.lifecycleTransitionExecuted !== false ||
        candidate.templatePrepared !== false ||
        candidate.qualificationAdmissionAuthorized !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.qualificationEvidenceAccepted !== false ||
        candidate.ownerQualificationApproved !== false ||
        candidate.activationCandidatePrepared !== false ||
        candidate.ownerActivationApproved !== false ||
        candidate.runtimeAuthorized !== false,
    )
  ) {
    throw new Error(
      "Global Growth lifecycle-transition candidate boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.authorityBoundary) ||
    !Object.isFrozen(record.candidateTransitionEligibility)
  ) {
    throw new Error(
      "Global Growth lifecycle-transition decision must be immutable.",
    );
  }
}

export function createAutonomousGlobalGrowthFactoryLifecycleTransitionDecision(
  input: CreateAutonomousGlobalGrowthFactoryLifecycleTransitionDecisionInput,
): AutonomousGlobalGrowthFactoryLifecycleTransitionDecision {
  const record = buildDecision(input);

  validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision(record);

  return record;
}