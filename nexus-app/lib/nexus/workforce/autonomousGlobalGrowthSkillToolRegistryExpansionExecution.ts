import { createHash } from "node:crypto";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD,
} from "./autonomousGlobalGrowthSkillToolRegistryExpansionApprovalRecord";
import {
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision,
} from "./autonomousGlobalGrowthSkillToolRegistryExpansionDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation,
} from "./autonomousGlobalGrowthSkillToolRegistryExpansionPreparation";
import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
} from "./engineeringAIWorkforceSkillToolRegistryExpansionExecution";
import {
  createSkillToolRegistry,
  SKILL_TOOL_REGISTRY_VERSION,
  type SkillToolRegistry,
} from "./skillToolRegistry";

export const AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION_VERSION =
  "nexus-autonomous-global-growth-skill-tool-registry-expansion-execution-v1" as const;

const preparation =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

const decision =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD;

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

function validatePrerequisites(executedAt: string): void {
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
    preparation,
  );

  validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
    decision,
  );

  if (
    decision.registryExpansionApproved !== true ||
    decision.reviewedSkillCount !== 9 ||
    decision.reviewedToolCount !== 9 ||
    decision.authorityBoundary.skillRegistryMutationAuthorized !== true ||
    decision.authorityBoundary.toolRegistryMutationAuthorized !== true ||
    decision.authorityBoundary.appendOnlyRegistryExpansionRequired !== true ||
    decision.authorityBoundary.existingRegistryPreservationRequired !== true ||
    decision.authorityBoundary.collisionFreeDefinitionsRequired !== true ||
    decision.authorityBoundary.templateCreationAuthorized !== false ||
    decision.authorityBoundary.qualificationExecutionAuthorized !== false ||
    decision.authorityBoundary.employeeActivationAuthorized !== false ||
    decision.authorityBoundary.publicPublishingAuthorized !== false ||
    decision.authorityBoundary.productionExecutionAuthorized !== false ||
    decision.authorityBoundary.founderLiberationAchieved !== false ||
    decision.sourcePreparationId !== preparation.preparationId ||
    decision.sourcePreparationDigest !== preparation.preparationDigest ||
    decision.sourceRegistryDigest !== sourceRegistry.registryDigest ||
    decision.nextStep !==
      "EXECUTE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1"
  ) {
    throw new Error(
      "Global Growth registry-expansion execution prerequisites are invalid.",
    );
  }

  if (
    Number.isNaN(Date.parse(executedAt)) ||
    new Date(executedAt).toISOString() !== executedAt ||
    Date.parse(executedAt) < Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Global Growth registry-expansion execution time is invalid.",
    );
  }
}

function buildExecution(executedAt: string) {
  validatePrerequisites(executedAt);

  const existingSkillIds =
    new Set(sourceRegistry.skills.map((skill) => skill.skillId));

  const existingToolIds =
    new Set(sourceRegistry.tools.map((tool) => tool.toolId));

  if (
    preparation.proposedSkills.some(
      (skill) => existingSkillIds.has(skill.skillId),
    ) ||
    preparation.proposedTools.some(
      (tool) => existingToolIds.has(tool.toolId),
    )
  ) {
    throw new Error(
      "Global Growth registry expansion collides with the preserved registry.",
    );
  }

  const appliedSkills =
    preparation.proposedSkills.map((skill) => ({
      ...skill,
    }));

  const appliedTools =
    preparation.proposedTools.map((tool) => ({
      ...tool,
      allowedModes: [
        ...tool.allowedModes,
      ],
    }));

  const expandedRegistry =
    createSkillToolRegistry({
      skills: [
        ...sourceRegistry.skills,
        ...appliedSkills,
      ],
      tools: [
        ...sourceRegistry.tools,
        ...appliedTools,
      ],
      createdAt:
        executedAt,
    });

  const core = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION_VERSION,
    executionId:
      "autonomous-global-growth-skill-tool-registry-expansion-execution-001",
    executionState:
      "AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTED" as const,
    sourceDecisionId:
      decision.decisionId,
    sourceDecisionDigest:
      decision.decisionDigest,
    sourcePreparationId:
      preparation.preparationId,
    sourcePreparationDigest:
      preparation.preparationDigest,
    sourceRegistryVersion:
      SKILL_TOOL_REGISTRY_VERSION,
    sourceRegistryDigest:
      sourceRegistry.registryDigest,
    sourceSkillCount:
      sourceRegistry.skills.length,
    sourceToolCount:
      sourceRegistry.tools.length,
    appliedSkillCount:
      9 as const,
    appliedToolCount:
      9 as const,
    appliedSkills,
    appliedTools,
    expandedRegistry:
      expandedRegistry as SkillToolRegistry,
    expandedRegistryDigest:
      expandedRegistry.registryDigest,
    expandedSkillCount:
      expandedRegistry.skills.length,
    expandedToolCount:
      expandedRegistry.tools.length,
    preservationEvidence: {
      sourceSkillsPreserved:
        sourceRegistry.skills.every((sourceSkill) =>
          expandedRegistry.skills.some(
            (expandedSkill) =>
              expandedSkill.skillId === sourceSkill.skillId &&
              sha256(expandedSkill) === sha256(sourceSkill),
          ),
        ),
      sourceToolsPreserved:
        sourceRegistry.tools.every((sourceTool) =>
          expandedRegistry.tools.some(
            (expandedTool) =>
              expandedTool.toolId === sourceTool.toolId &&
              sha256(expandedTool) === sha256(sourceTool),
          ),
        ),
      appliedSkillIdentityCount:
        new Set(appliedSkills.map((skill) => skill.skillId)).size,
      appliedToolIdentityCount:
        new Set(appliedTools.map((tool) => tool.toolId)).size,
      appendOnlyExpansionVerified:
        true as const,
      collisionFreeExpansionVerified:
        true as const,
    },
    authorityBoundary: {
      registryExpansionExecuted:
        true as const,
      appendOnlyRegistryExpansion:
        true as const,
      existingRegistryPreserved:
        true as const,
      collisionFreeDefinitionsVerified:
        true as const,
      skillDefinitionsAdded:
        true as const,
      toolDefinitionsAdded:
        true as const,
      toolsDraftOnly:
        true as const,
      toolsNonExternal:
        true as const,
      toolsTenantScoped:
        true as const,
      toolsAuditRequired:
        true as const,
      runtimeToolExecutionAuthorized:
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
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_DECISION_V1" as const,
    executedAt,
  };

  return deepFreeze({
    ...core,
    executionDigest:
      sha256(core),
  });
}

export type AutonomousGlobalGrowthSkillToolRegistryExpansionExecution =
  ReturnType<typeof buildExecution>;

export function validateAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
  record: AutonomousGlobalGrowthSkillToolRegistryExpansionExecution,
): void {
  const expected =
    buildExecution(record.executedAt);

  if (
    record.executionDigest !== expected.executionDigest ||
    sha256(record) !== sha256(expected) ||
    record.appliedSkillCount !== 9 ||
    record.appliedToolCount !== 9 ||
    record.appliedSkills.length !== 9 ||
    record.appliedTools.length !== 9 ||
    record.expandedSkillCount !== record.sourceSkillCount + 9 ||
    record.expandedToolCount !== record.sourceToolCount + 9 ||
    record.expandedRegistryDigest !==
      record.expandedRegistry.registryDigest ||
    record.preservationEvidence.sourceSkillsPreserved !== true ||
    record.preservationEvidence.sourceToolsPreserved !== true ||
    record.preservationEvidence.appliedSkillIdentityCount !== 9 ||
    record.preservationEvidence.appliedToolIdentityCount !== 9 ||
    record.appliedTools.some(
      (tool) =>
        tool.risk !== "MEDIUM" ||
        tool.allowedModes.length !== 1 ||
        tool.allowedModes[0] !== "DRAFT_ONLY" ||
        tool.externalEffect !== false ||
        tool.tenantScoped !== true ||
        tool.auditRequired !== true,
    ) ||
    record.authorityBoundary.registryExpansionExecuted !== true ||
    record.authorityBoundary.existingRegistryPreserved !== true ||
    record.authorityBoundary.runtimeToolExecutionAuthorized !== false ||
    record.authorityBoundary.templateCreationAuthorized !== false ||
    record.authorityBoundary.qualificationExecutionAuthorized !== false ||
    record.authorityBoundary.employeeActivationAuthorized !== false ||
    record.authorityBoundary.publicPublishingAuthorized !== false ||
    record.authorityBoundary.customerMessagingAuthorized !== false ||
    record.authorityBoundary.productionExecutionAuthorized !== false ||
    record.authorityBoundary.autonomousExternalActionAuthorized !== false ||
    record.authorityBoundary.founderLiberationAchieved !== false ||
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.appliedSkills) ||
    !Object.isFrozen(record.appliedTools) ||
    !Object.isFrozen(record.expandedRegistry) ||
    !Object.isFrozen(record.preservationEvidence) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Global Growth skill/tool registry-expansion execution is invalid.",
    );
  }
}

export function createAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
  executedAt: string,
): AutonomousGlobalGrowthSkillToolRegistryExpansionExecution {
  const record =
    buildExecution(executedAt);

  validateAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
    record,
  );

  return record;
}

export const AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION =
  createAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
    "2026-08-06T02:17:29.849Z",
  );

export const AUTONOMOUS_GLOBAL_GROWTH_EXPANDED_SKILL_TOOL_REGISTRY =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
    .expandedRegistry;