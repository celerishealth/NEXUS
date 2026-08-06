import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_EXPANDED_SKILL_TOOL_REGISTRY,
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
  createAutonomousGlobalGrowthSkillToolRegistryExpansionExecution,
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionExecution,
  type AutonomousGlobalGrowthSkillToolRegistryExpansionExecution,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionApprovalRecord";
import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionExecution";

describe("Global Growth skill/tool registry-expansion execution", () => {
  it("appends exactly nine skills and nine draft-only tools", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

    expect(record.appliedSkills).toHaveLength(9);
    expect(record.appliedTools).toHaveLength(9);
    expect(record.expandedSkillCount).toBe(record.sourceSkillCount + 9);
    expect(record.expandedToolCount).toBe(record.sourceToolCount + 9);
  });

  it("preserves every existing skill and tool definition", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

    expect(record.sourceRegistryDigest).toBe(
      ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY.registryDigest,
    );
    expect(record.preservationEvidence.sourceSkillsPreserved).toBe(true);
    expect(record.preservationEvidence.sourceToolsPreserved).toBe(true);
    expect(record.authorityBoundary.existingRegistryPreserved).toBe(true);
  });

  it("adds only audited tenant-scoped non-external draft tools", () => {
    expect(
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
        .appliedTools.every(
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

  it("keeps templates, qualification, activation and live actions blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
        .authorityBoundary;

    expect(boundary.runtimeToolExecutionAuthorized).toBe(false);
    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);

    expect(
      AUTONOMOUS_GLOBAL_GROWTH_EXPANDED_SKILL_TOOL_REGISTRY.registryDigest,
    ).toBe(
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
        .expandedRegistryDigest,
    );
  });

  it("rejects premature execution and tampering", () => {
    const approval =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD;

    expect(() =>
      createAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
        new Date(Date.parse(approval.decidedAt) - 1).toISOString(),
      ),
    ).toThrow();

    const valid =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSkillToolRegistryExpansionExecution;

    expect(() =>
      validateAutonomousGlobalGrowthSkillToolRegistryExpansionExecution(
        tampered,
      ),
    ).toThrow();
  });
});