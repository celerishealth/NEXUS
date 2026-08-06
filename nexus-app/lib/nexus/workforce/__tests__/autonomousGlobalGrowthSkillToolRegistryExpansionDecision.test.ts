import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionPreparation";
import {
  createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision,
  validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision,
  type AutonomousGlobalGrowthSkillToolRegistryExpansionDecision,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionDecision";

const preparation =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

function approvalInput() {
  return {
    sourcePreparation:
      preparation,
    decisionId:
      "autonomous-global-growth-skill-tool-registry-expansion-owner-decision-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1" as const,
    reason:
      "Owner approves controlled append-only registry expansion for exactly nine Global Growth skills and nine draft-only tools while templates, qualification, activation, publishing, production and Founder Liberation remain blocked.",
    decidedAt:
      new Date(
        Date.parse(preparation.preparedAt) + 1000,
      ).toISOString(),
  };
}

describe("Global Growth skill/tool registry-expansion decision", () => {
  it("approves exactly nine skills and nine tools", () => {
    const record =
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
        approvalInput(),
      );

    expect(record.registryExpansionApproved).toBe(true);
    expect(record.reviewedSkillCount).toBe(9);
    expect(record.reviewedToolCount).toBe(9);
    expect(record.definitionMutationEligibility).toHaveLength(9);
  });

  it("authorizes only append-only registry mutation", () => {
    const boundary =
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.skillRegistryMutationAuthorized).toBe(true);
    expect(boundary.toolRegistryMutationAuthorized).toBe(true);
    expect(boundary.appendOnlyRegistryExpansionRequired).toBe(true);
    expect(boundary.existingRegistryPreservationRequired).toBe(true);
  });

  it("keeps templates, qualification and live authority blocked", () => {
    const boundary =
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("supports rejection without mutation authority", () => {
    const record =
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision({
        ...approvalInput(),
        decision:
          "REJECT_AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_V1",
      });

    expect(record.registryExpansionApproved).toBe(false);
    expect(
      record.authorityBoundary.skillRegistryMutationAuthorized,
    ).toBe(false);
    expect(
      record.authorityBoundary.toolRegistryMutationAuthorized,
    ).toBe(false);
  });

  it("rejects invalid owner, copied preparation, premature time and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision({
        ...approvalInput(),
        ownerId:
          "owner-invalid" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
      }),
    ).toThrow();

    expect(() =>
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision({
        ...approvalInput(),
        sourcePreparation: {
          ...preparation,
        } as typeof preparation,
      }),
    ).toThrow();

    expect(() =>
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision({
        ...approvalInput(),
        decidedAt:
          new Date(
            Date.parse(preparation.preparedAt) - 1,
          ).toISOString(),
      }),
    ).toThrow();

    const valid =
      createAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
        approvalInput(),
      );

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSkillToolRegistryExpansionDecision;

    expect(() =>
      validateAutonomousGlobalGrowthSkillToolRegistryExpansionDecision(
        tampered,
      ),
    ).toThrow();
  });
});