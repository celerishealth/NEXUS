import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionApprovalRecord";
import {
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionDecision";

describe("Canonical Global Growth registry-expansion approval", () => {
  it("authorizes controlled mutation for nine skills and nine tools", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD;

    expect(record.registryExpansionApproved).toBe(true);
    expect(record.reviewedSkillCount).toBe(9);
    expect(record.reviewedToolCount).toBe(9);
    expect(
      record.authorityBoundary.skillRegistryMutationAuthorized,
    ).toBe(true);
    expect(
      record.authorityBoundary.toolRegistryMutationAuthorized,
    ).toBe(true);
  });

  it("requires append-only collision-free preservation", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD
        .authorityBoundary;

    expect(boundary.appendOnlyRegistryExpansionRequired).toBe(true);
    expect(boundary.existingRegistryPreservationRequired).toBe(true);
    expect(boundary.collisionFreeDefinitionsRequired).toBe(true);
  });

  it("keeps templates, qualification and live actions blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD
        .authorityBoundary;

    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.paidAdvertisingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("authorizes only the controlled execution step", () => {
    expect(
      AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD
        .nextStep,
    ).toBe(
      "EXECUTE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1",
    );
  });

  it("passes canonical integrity validation", () => {
    expect(() =>
      validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
        AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD,
      ),
    ).not.toThrow();
  });
});