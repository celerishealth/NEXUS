import { createHash } from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionExecution";
import {
  createSkillToolRegistry,
  SKILL_TOOL_REGISTRY_VERSION,
  type WorkforceSkillDefinition,
  type WorkforceToolDefinition,
} from "./skillToolRegistry";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlanOwnerReviewApprovalRecord";
import {
  validateAutonomousGlobalGrowthTemplatePreparationPlanDecision,
} from "./autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlanOwnerReviewDecision";

export const AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION =
  "nexus-autonomous-global-growth-skill-tool-registry-expansion-preparation-v1" as const;

const plan =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;
const approval =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD;
const sourceRegistry =
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY;

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

function buildPreparation(preparedAt: string) {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
    plan,
  );
  validateAutonomousGlobalGrowthTemplatePreparationPlanDecision(
    approval,
  );

  if (
    approval.planApproved !== true ||
    approval.reviewedTemplateCount !== 9 ||
    approval.authorityBoundary
      .skillRegistryExpansionPreparationAuthorized !== true ||
    approval.authorityBoundary
      .toolRegistryExpansionPreparationAuthorized !== true ||
    approval.authorityBoundary.skillRegistryMutationAuthorized !== false ||
    approval.authorityBoundary.toolRegistryMutationAuthorized !== false ||
    approval.authorityBoundary.templateCreationAuthorized !== false ||
    approval.authorityBoundary.qualificationExecutionAuthorized !== false ||
    approval.authorityBoundary.employeeActivationAuthorized !== false ||
    approval.authorityBoundary.publicPublishingAuthorized !== false ||
    approval.authorityBoundary.productionExecutionAuthorized !== false ||
    approval.authorityBoundary.founderLiberationAchieved !== false ||
    approval.sourcePlanningId !== plan.planningId ||
    approval.sourcePlanningDigest !== plan.planningDigest ||
    approval.nextStep !==
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_AND_DRAFT_ONLY_TOOL_REGISTRY_EXPANSION_V1"
  ) {
    throw new Error(
      "Verified owner approval does not authorize registry-expansion preparation.",
    );
  }

  if (
    Number.isNaN(Date.parse(preparedAt)) ||
    new Date(preparedAt).toISOString() !== preparedAt ||
    Date.parse(preparedAt) < Date.parse(approval.decidedAt)
  ) {
    throw new Error("Registry-expansion preparation time is invalid.");
  }

  const proposedSkills: readonly WorkforceSkillDefinition[] =
    plan.templatePreparations.map((template) => ({
      skillId:
        template.requiredSkillId,
      name:
        `${template.publicName} — ${template.capability.replaceAll("_", " ").toLowerCase()}`,
      description:
        `Provides owner-reviewable, evidence-bound ${template.capability.replaceAll("_", " ").toLowerCase()} support for ${template.officialRole} without external execution.`,
      category:
        "autonomous-global-growth",
      version:
        1,
      active:
        true,
    }));

  const proposedTools: readonly WorkforceToolDefinition[] =
    plan.templatePreparations.map((template) => ({
      toolId:
        template.requiredToolId,
      name:
        `${template.publicName} draft-only workbench`,
      capability:
        `Create a tenant-scoped, audited ${template.capability.replaceAll("_", " ").toLowerCase()} draft for owner review`,
      risk:
        "MEDIUM",
      allowedModes: [
        "DRAFT_ONLY",
      ],
      ownerApprovalRequired:
        false,
      externalEffect:
        false,
      tenantScoped:
        true,
      auditRequired:
        true,
      active:
        true,
    }));

  const existingSkillIds =
    new Set(sourceRegistry.skills.map((skill) => skill.skillId));
  const existingToolIds =
    new Set(sourceRegistry.tools.map((tool) => tool.toolId));

  const existingSkillCollisionCount =
    proposedSkills.filter(
      (skill) => existingSkillIds.has(skill.skillId),
    ).length;

  const existingToolCollisionCount =
    proposedTools.filter(
      (tool) => existingToolIds.has(tool.toolId),
    ).length;

  const proposedSkillDuplicateCount =
    proposedSkills.length -
    new Set(proposedSkills.map((skill) => skill.skillId)).size;

  const proposedToolDuplicateCount =
    proposedTools.length -
    new Set(proposedTools.map((tool) => tool.toolId)).size;

  if (
    existingSkillCollisionCount !== 0 ||
    existingToolCollisionCount !== 0 ||
    proposedSkillDuplicateCount !== 0 ||
    proposedToolDuplicateCount !== 0
  ) {
    throw new Error(
      "Global Growth skill/tool registry expansion contains identity collisions.",
    );
  }

  const previewRegistry =
    createSkillToolRegistry({
      skills: [
        ...sourceRegistry.skills,
        ...proposedSkills,
      ],
      tools: [
        ...sourceRegistry.tools,
        ...proposedTools,
      ],
      createdAt:
        preparedAt,
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_VERSION,
    preparationId:
      "autonomous-global-growth-skill-tool-registry-expansion-preparation-001",
    preparationState:
      "AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARED_FOR_OWNER_REVIEW" as const,
    sourceApprovalDecisionId:
      approval.decisionId,
    sourceApprovalDecisionDigest:
      approval.decisionDigest,
    sourcePlanningId:
      plan.planningId,
    sourcePlanningDigest:
      plan.planningDigest,
    sourceRegistryVersion:
      SKILL_TOOL_REGISTRY_VERSION,
    sourceRegistryDigest:
      sourceRegistry.registryDigest,
    currentSkillCount:
      sourceRegistry.skills.length,
    currentToolCount:
      sourceRegistry.tools.length,
    proposedSkillCount:
      9 as const,
    proposedToolCount:
      9 as const,
    targetSkillCount:
      previewRegistry.skills.length,
    targetToolCount:
      previewRegistry.tools.length,
    proposedSkills,
    proposedTools,
    previewRegistryDigest:
      previewRegistry.registryDigest,
    collisionCheck: {
      existingSkillCollisionCount,
      existingToolCollisionCount,
      proposedSkillDuplicateCount,
      proposedToolDuplicateCount,
      safeForOwnerDecisionReview:
        true as const,
    },
    safetyStandard: {
      allToolsDraftOnly:
        true as const,
      allToolsMediumRisk:
        true as const,
      allToolsNonExternal:
        true as const,
      allToolsTenantScoped:
        true as const,
      allToolsAudited:
        true as const,
      transparentAIIdentityPreserved:
        true as const,
      humanImpersonationAuthorized:
        false as const,
    },
    authorityBoundary: {
      preparationOnly:
        true as const,
      sourceOwnerApprovalBound:
        true as const,
      registryPreviewValidationCompleted:
        true as const,
      skillRegistryMutationAuthorized:
        false as const,
      toolRegistryMutationAuthorized:
        false as const,
      coreRegistryMutationPerformed:
        false as const,
      proposedDefinitionsActivatedInRuntime:
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
    nextStep:
      "AWAIT_OWNER_REVIEW_OF_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_V1" as const,
    preparedAt,
  };

  return deepFreeze({
    ...core,
    preparationDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthSkillToolRegistryExpansionPreparation =
  ReturnType<typeof buildPreparation>;

export function validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
  record: AutonomousGlobalGrowthSkillToolRegistryExpansionPreparation,
): void {
  const expected =
    buildPreparation(record.preparedAt);

  if (
    record.preparationDigest !== expected.preparationDigest ||
    sha256(record) !== sha256(expected) ||
    record.proposedSkillCount !== 9 ||
    record.proposedToolCount !== 9 ||
    record.proposedSkills.length !== 9 ||
    record.proposedTools.length !== 9 ||
    record.targetSkillCount !== record.currentSkillCount + 9 ||
    record.targetToolCount !== record.currentToolCount + 9 ||
    record.collisionCheck.existingSkillCollisionCount !== 0 ||
    record.collisionCheck.existingToolCollisionCount !== 0 ||
    record.collisionCheck.proposedSkillDuplicateCount !== 0 ||
    record.collisionCheck.proposedToolDuplicateCount !== 0 ||
    record.proposedTools.some(
      (tool) =>
        tool.risk !== "MEDIUM" ||
        tool.allowedModes.length !== 1 ||
        tool.allowedModes[0] !== "DRAFT_ONLY" ||
        tool.ownerApprovalRequired !== false ||
        tool.externalEffect !== false ||
        tool.tenantScoped !== true ||
        tool.auditRequired !== true,
    ) ||
    record.authorityBoundary.skillRegistryMutationAuthorized !== false ||
    record.authorityBoundary.toolRegistryMutationAuthorized !== false ||
    record.authorityBoundary.coreRegistryMutationPerformed !== false ||
    record.authorityBoundary.proposedDefinitionsActivatedInRuntime !== false ||
    record.authorityBoundary.templateCreationAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.proposedSkills) ||
    !Object.isFrozen(record.proposedTools) ||
    !Object.isFrozen(record.collisionCheck) ||
    !Object.isFrozen(record.safetyStandard) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth skill/tool registry-expansion preparation is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
  preparedAt: string,
): AutonomousGlobalGrowthSkillToolRegistryExpansionPreparation {
  const record =
    buildPreparation(preparedAt);

  validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION =
  createAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
    "2026-08-06T02:07:53.904Z",
  );