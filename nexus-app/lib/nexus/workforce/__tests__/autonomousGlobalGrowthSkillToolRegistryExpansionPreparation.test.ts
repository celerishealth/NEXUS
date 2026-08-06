import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  createAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation,
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation,
  type AutonomousGlobalGrowthSkillToolRegistryExpansionPreparation,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionPreparation";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlanOwnerReviewApprovalRecord";

describe("Global Growth skill/tool registry-expansion preparation", () => {
  it("prepares nine unique skills and nine unique draft-only tools", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

    expect(record.proposedSkills).toHaveLength(9);
    expect(record.proposedTools).toHaveLength(9);
    expect(new Set(record.proposedSkills.map((x) => x.skillId)).size).toBe(9);
    expect(new Set(record.proposedTools.map((x) => x.toolId)).size).toBe(9);
  });

  it("preserves the existing expanded registry without collisions", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

    expect(record.sourceRegistryDigest).toBe(
      ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY.registryDigest,
    );
    expect(record.targetSkillCount).toBe(record.currentSkillCount + 9);
    expect(record.targetToolCount).toBe(record.currentToolCount + 9);
    expect(record.collisionCheck.existingSkillCollisionCount).toBe(0);
    expect(record.collisionCheck.existingToolCollisionCount).toBe(0);
  });

  it("uses only medium-risk non-external tenant-scoped audited draft tools", () => {
    expect(
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
        .proposedTools.every(
          (tool) =>
            tool.risk === "MEDIUM" &&
            tool.allowedModes.length === 1 &&
            tool.allowedModes[0] === "DRAFT_ONLY" &&
            tool.externalEffect === false &&
            tool.tenantScoped === true &&
            tool.auditRequired === true,
        ),
    ).toBe(true);
  });

  it("keeps registry mutation, templates and all live authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
        .authorityBoundary;

    expect(boundary.skillRegistryMutationAuthorized).toBe(false);
    expect(boundary.toolRegistryMutationAuthorized).toBe(false);
    expect(boundary.coreRegistryMutationPerformed).toBe(false);
    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects premature preparation and tampering", () => {
    const approval =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD;

    expect(() =>
      createAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
        new Date(Date.parse(approval.decidedAt) - 1).toISOString(),
      ),
    ).toThrow();

    const valid =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSkillToolRegistryExpansionPreparation;

    expect(() =>
      validateAutonomousGlobalGrowthSkillToolRegistryExpansionPreparation(
        tampered,
      ),
    ).toThrow();
  });
});