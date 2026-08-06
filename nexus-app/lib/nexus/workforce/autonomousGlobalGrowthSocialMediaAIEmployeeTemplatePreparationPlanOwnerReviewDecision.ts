import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";

export const AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISIONS = [
  "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_V1",
  "REJECT_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_V1",
] as const;

export type AutonomousGlobalGrowthTemplatePreparationPlanDecisionType =
  (typeof AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISIONS)[number];

const plan =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

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

export function createAutonomousGlobalGrowthTemplatePreparationPlanDecision(
  input: Readonly<{
    sourcePlan: typeof plan;
    decisionId: string;
    ownerId: typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
    decision: AutonomousGlobalGrowthTemplatePreparationPlanDecisionType;
    reason: string;
    decidedAt: string;
  }>,
) {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
    input.sourcePlan,
  );

  if (input.sourcePlan !== plan) {
    throw new Error(
      "Only the canonical Global Growth template-preparation plan is allowed.",
    );
  }

  if (input.ownerId !== ENGINEERING_AI_WORKFORCE_OWNER_ID) {
    throw new Error(
      "Only the verified NEXUS owner may decide this plan.",
    );
  }

  if (
    Number.isNaN(Date.parse(input.decidedAt)) ||
    new Date(input.decidedAt).toISOString() !== input.decidedAt ||
    Date.parse(input.decidedAt) < Date.parse(plan.preparedAt)
  ) {
    throw new Error(
      "Global Growth template-preparation decision time is invalid.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_V1";

  const core = {
    version:
      "nexus-autonomous-global-growth-template-preparation-plan-owner-decision-v1" as const,
    decisionId: input.decisionId,
    ownerId: input.ownerId,
    sourcePlanningId: plan.planningId,
    sourcePlanningDigest: plan.planningDigest,
    decision: input.decision,
    reason: input.reason,
    planApproved: approved,
    reviewedTemplateCount: plan.plannedTemplateCount,
    candidateRegistryExpansionEligibility:
      plan.templatePreparations.map((template) => ({
        preparationSequence:
          template.preparationSequence,
        templateId:
          template.templateId,
        employeeId:
          template.employeeId,
        employeeCode:
          template.employeeCode,
        publicName:
          template.publicName,
        officialRole:
          template.officialRole,
        capability:
          template.capability,
        requiredSkillId:
          template.requiredSkillId,
        requiredToolId:
          template.requiredToolId,
        registryExpansionPreparationAuthorized:
          approved,
        skillRegistryMutationAuthorized:
          false as const,
        toolRegistryMutationAuthorized:
          false as const,
        templateCreationAuthorized:
          false as const,
        qualificationExecutionAuthorized:
          false as const,
        employeeActivationAuthorized:
          false as const,
        runtimeAuthorized:
          false as const,
        externalActionAuthorized:
          false as const,
      })),
    authorityBoundary: {
      ownerDecisionRecorded:
        true as const,
      ownerIdentityBound:
        true as const,
      sourcePlanningBound:
        true as const,
      approvalBypassAllowed:
        false as const,
      skillRegistryExpansionPreparationAuthorized:
        approved,
      toolRegistryExpansionPreparationAuthorized:
        approved,
      skillRegistryMutationAuthorized:
        false as const,
      toolRegistryMutationAuthorized:
        false as const,
      templatePreparationAuthorized:
        false as const,
      templateCreationAuthorized:
        false as const,
      factoryLifecycleTransitionAuthorized:
        false as const,
      qualificationAdmissionAuthorized:
        false as const,
      qualificationExecutionAuthorized:
        false as const,
      employeeActivationAuthorized:
        false as const,
      runtimeAuthorized:
        false as const,
      realCredentialAccessAuthorized:
        false as const,
      liveConnectorActivationAuthorized:
        false as const,
      contentDraftingAuthorityGranted:
        false as const,
      videoGenerationExecutionAuthorized:
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
      ? "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_AND_DRAFT_ONLY_TOOL_REGISTRY_EXPANSION_V1"
      : "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLANNING_ONLY",
    decidedAt: input.decidedAt,
  };

  return deepFreeze({
    ...core,
    decisionDigest: sha256(core),
  });
}

export type AutonomousGlobalGrowthTemplatePreparationPlanDecision =
  ReturnType<
    typeof createAutonomousGlobalGrowthTemplatePreparationPlanDecision
  >;

export function validateAutonomousGlobalGrowthTemplatePreparationPlanDecision(
  record: AutonomousGlobalGrowthTemplatePreparationPlanDecision,
): void {
  const approved =
    record.decision ===
    "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_V1";

  const unsignedRecord = Object.fromEntries(
    Object.entries(record).filter(
      ([key]) => key !== "decisionDigest",
    ),
  );

  if (
    record.sourcePlanningId !== plan.planningId ||
    record.sourcePlanningDigest !== plan.planningDigest ||
    record.planApproved !== approved ||
    record.reviewedTemplateCount !== 9 ||
    record.candidateRegistryExpansionEligibility.length !== 9 ||
    record.candidateRegistryExpansionEligibility.some(
      (candidate) =>
        candidate.registryExpansionPreparationAuthorized !== approved ||
        candidate.skillRegistryMutationAuthorized !== false ||
        candidate.toolRegistryMutationAuthorized !== false ||
        candidate.templateCreationAuthorized !== false ||
        candidate.qualificationExecutionAuthorized !== false ||
        candidate.employeeActivationAuthorized !== false ||
        candidate.runtimeAuthorized !== false ||
        candidate.externalActionAuthorized !== false,
    ) ||
    record.authorityBoundary.skillRegistryExpansionPreparationAuthorized !==
      approved ||
    record.authorityBoundary.toolRegistryExpansionPreparationAuthorized !==
      approved ||
    record.authorityBoundary.skillRegistryMutationAuthorized !== false ||
    record.authorityBoundary.toolRegistryMutationAuthorized !== false ||
    record.authorityBoundary.templateCreationAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    record.decisionDigest !== sha256(unsignedRecord) ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.candidateRegistryExpansionEligibility) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth template-preparation owner decision is invalid.",
    );
  }
}