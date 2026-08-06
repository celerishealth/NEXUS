import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution";

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_VERSION =
  "nexus-autonomous-global-growth-social-media-ai-employee-template-preparation-plan-v1" as const;

const execution =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION;

const TEMPLATE_BLUEPRINTS = [
  {
    employeeCode: "nx-marketing-004",
    capability: "RESEARCH_AND_FACT_VERIFICATION",
    skillId: "skill-global-growth-research-fact-verification",
    toolId: "tool-global-growth-research-draft",
  },
  {
    employeeCode: "nx-marketing-005",
    capability: "COPYWRITING_AND_PLATFORM_ADAPTATION",
    skillId: "skill-global-growth-platform-copywriting",
    toolId: "tool-global-growth-copy-draft",
  },
  {
    employeeCode: "nx-marketing-006",
    capability: "GRAPHIC_CONTENT_PRODUCTION",
    skillId: "skill-global-growth-graphic-content-planning",
    toolId: "tool-global-growth-graphic-brief-draft",
  },
  {
    employeeCode: "nx-marketing-007",
    capability: "VIDEO_CONTENT_PRODUCTION",
    skillId: "skill-global-growth-video-content-planning",
    toolId: "tool-global-growth-video-brief-draft",
  },
  {
    employeeCode: "nx-marketing-008",
    capability: "PUBLISHING_GATEWAY_OPERATIONS",
    skillId: "skill-global-growth-publishing-gateway-planning",
    toolId: "tool-global-growth-publishing-plan-draft",
  },
  {
    employeeCode: "nx-marketing-009",
    capability: "COMMUNITY_ENGAGEMENT_AND_INQUIRIES",
    skillId: "skill-global-growth-community-inquiry-analysis",
    toolId: "tool-global-growth-community-response-draft",
  },
  {
    employeeCode: "nx-marketing-010",
    capability: "LEAD_QUALIFICATION",
    skillId: "skill-global-growth-lead-qualification",
    toolId: "tool-global-growth-lead-assessment-draft",
  },
  {
    employeeCode: "nx-marketing-011",
    capability: "DEMO_BOOKING_COORDINATION",
    skillId: "skill-global-growth-demo-coordination",
    toolId: "tool-global-growth-demo-booking-draft",
  },
  {
    employeeCode: "nx-marketing-012",
    capability: "GROWTH_ANALYTICS_AND_REVENUE_ATTRIBUTION",
    skillId: "skill-global-growth-analytics-attribution",
    toolId: "tool-global-growth-analytics-draft",
  },
] as const;

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

function validatePrerequisites(preparedAt: string): void {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
    execution,
  );

  if (
    execution.admittedFactoryCandidateCount !== 9 ||
    execution.candidateRecords.length !== 9 ||
    execution.authorityBoundary.factoryAdmissionExecuted !== true ||
    execution.authorityBoundary.templatePreparationAuthorized !== false ||
    execution.authorityBoundary.qualificationExecutionAuthorized !== false ||
    execution.authorityBoundary.runtimeAuthorized !== false ||
    execution.authorityBoundary.publicPublishingAuthorized !== false ||
    execution.authorityBoundary.customerMessagingAuthorized !== false ||
    execution.authorityBoundary.productionExecutionAuthorized !== false ||
    execution.authorityBoundary.founderLiberationAchieved !== false ||
    execution.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_V1"
  ) {
    throw new Error("Global Growth template-planning prerequisites are invalid.");
  }

  if (
    Number.isNaN(Date.parse(preparedAt)) ||
    new Date(preparedAt).toISOString() !== preparedAt ||
    Date.parse(preparedAt) < Date.parse(execution.executedAt)
  ) {
    throw new Error("Global Growth template-plan time is invalid.");
  }
}

function buildPlan(preparedAt: string) {
  validatePrerequisites(preparedAt);

  const templatePreparations = TEMPLATE_BLUEPRINTS.map(
    (blueprint, index) => {
      const factoryRecord = execution.candidateRecords.find(
        (candidate) =>
          candidate.employeeCode === blueprint.employeeCode,
      );

      if (
        !factoryRecord ||
        factoryRecord.lifecycleState !== "PLANNED_CANDIDATE" ||
        factoryRecord.templatePrepared !== false ||
        factoryRecord.qualificationAdmissionAuthorized !== false ||
        factoryRecord.ownerActivationApproved !== false ||
        factoryRecord.runtimeAuthorized !== false ||
        factoryRecord.externalCommunicationAuthorized !== false ||
        factoryRecord.productionExecutionAuthorized !== false
      ) {
        throw new Error(
          `Factory candidate is not eligible for template planning: ${blueprint.employeeCode}.`,
        );
      }

      return {
        preparationSequence: index + 1,
        templateId:
          `template-${factoryRecord.employeeCode}-v1`,
        factoryRecordId:
          factoryRecord.factoryRecordId,
        employeeId:
          factoryRecord.employeeId,
        employeeCode:
          factoryRecord.employeeCode,
        publicName:
          factoryRecord.publicName,
        officialRole:
          factoryRecord.officialRole,
        department:
          factoryRecord.department,
        capability:
          blueprint.capability,
        requiredSkillId:
          blueprint.skillId,
        requiredToolId:
          blueprint.toolId,
        toolMode:
          "DRAFT_ONLY" as const,
        toolRisk:
          "MEDIUM" as const,
        toolExternalEffect:
          false as const,
        tenantScoped:
          true as const,
        auditRequired:
          true as const,
        transparentAIIdentityRequired:
          true as const,
        humanImpersonationAuthorized:
          false as const,
        sourceLifecycleState:
          "PLANNED_CANDIDATE" as const,
        registryExpansionPreparationEligible:
          true as const,
        skillRegistryMutationAuthorized:
          false as const,
        toolRegistryMutationAuthorized:
          false as const,
        templatePreparationAuthorized:
          false as const,
        templateCreationAuthorized:
          false as const,
        qualificationAdmissionAuthorized:
          false as const,
        qualificationExecutionAuthorized:
          false as const,
        employeeActivationAuthorized:
          false as const,
        runtimeAuthorized:
          false as const,
        externalActionAuthorized:
          false as const,
      };
    },
  );

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_VERSION,
    planningId:
      "autonomous-global-growth-social-media-ai-employee-template-preparation-plan-001",
    planningState:
      "GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLANNED_AWAITING_OWNER_REVIEW" as const,
    sourceFactoryAdmissionExecutionId:
      execution.executionId,
    sourceFactoryAdmissionExecutionDigest:
      execution.executionDigest,
    sourceFactoryFoundationDigest:
      execution.sourceFactoryFoundationDigest,
    plannedTemplateCount:
      9 as const,
    requiredSkillCount:
      9 as const,
    requiredDraftOnlyToolCount:
      9 as const,
    templatePreparations,
    registryGapSummary: {
      skillRegistryExpansionPreparationRequired:
        true as const,
      toolRegistryExpansionPreparationRequired:
        true as const,
      directRegistryMutationBlocked:
        true as const,
      directTemplateCreationBlocked:
        true as const,
    },
    humanLikeEmployeeStandard: {
      naturalProfessionalCommunicationRequired:
        true as const,
      contextAwarenessRequired:
        true as const,
      proactiveSpecialistWorkRequired:
        true as const,
      transparentAIIdentityRequired:
        true as const,
      humanImpersonationAuthorized:
        false as const,
      fabricatedHumanExperienceAuthorized:
        false as const,
    },
    authorityBoundary: {
      planningOnly:
        true as const,
      ownerReviewRequired:
        true as const,
      sourceFactoryAdmissionExecutionBound:
        true as const,
      skillRegistryExpansionPreparationAuthorized:
        false as const,
      toolRegistryExpansionPreparationAuthorized:
        false as const,
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
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_V1" as const,
    preparedAt,
  };

  return deepFreeze({
    ...core,
    planningDigest: sha256(core),
  });
}

export type AutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan =
  ReturnType<typeof buildPlan>;

export function validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
  record: AutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
): void {
  const expected = buildPlan(record.preparedAt);

  const templateIds = record.templatePreparations.map(
    (template) => template.templateId,
  );
  const employeeIds = record.templatePreparations.map(
    (template) => template.employeeId,
  );
  const skillIds = record.templatePreparations.map(
    (template) => template.requiredSkillId,
  );
  const toolIds = record.templatePreparations.map(
    (template) => template.requiredToolId,
  );

  if (
    record.planningDigest !== expected.planningDigest ||
    sha256(record) !== sha256(expected) ||
    record.plannedTemplateCount !== 9 ||
    record.templatePreparations.length !== 9 ||
    new Set(templateIds).size !== 9 ||
    new Set(employeeIds).size !== 9 ||
    new Set(skillIds).size !== 9 ||
    new Set(toolIds).size !== 9 ||
    record.templatePreparations.some(
      (template) =>
        template.sourceLifecycleState !== "PLANNED_CANDIDATE" ||
        template.toolMode !== "DRAFT_ONLY" ||
        template.toolExternalEffect !== false ||
        template.tenantScoped !== true ||
        template.auditRequired !== true ||
        template.transparentAIIdentityRequired !== true ||
        template.humanImpersonationAuthorized !== false ||
        template.registryExpansionPreparationEligible !== true ||
        template.skillRegistryMutationAuthorized !== false ||
        template.toolRegistryMutationAuthorized !== false ||
        template.templatePreparationAuthorized !== false ||
        template.templateCreationAuthorized !== false ||
        template.qualificationExecutionAuthorized !== false ||
        template.employeeActivationAuthorized !== false ||
        template.runtimeAuthorized !== false ||
        template.externalActionAuthorized !== false,
    ) ||
    record.authorityBoundary.skillRegistryMutationAuthorized !== false ||
    record.authorityBoundary.toolRegistryMutationAuthorized !== false ||
    record.authorityBoundary.templatePreparationAuthorized !== false ||
    record.authorityBoundary.templateCreationAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.templatePreparations) ||
    !Object.isFrozen(record.registryGapSummary) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth Social Media template-preparation plan is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
  preparedAt: string,
): AutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan {
  const record = buildPlan(preparedAt);

  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN =
  createAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
    "2026-08-05T17:17:19.200Z",
  );