import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
} from "../autonomousGlobalGrowthSkillToolRegistryExpansionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";
import {
  createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision,
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision,
  type AutonomousGlobalGrowthAIEmployeeTemplateCreationDecision,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationDecision";

const plan =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

const execution =
  AUTONOMOUS_GLOBAL_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

function approvalInput() {
  return {
    sourcePlan:
      plan,
    sourceRegistryExecution:
      execution,
    decisionId:
      "autonomous-global-growth-ai-employee-template-creation-owner-decision-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1" as const,
    reason:
      "Owner approves controlled creation of exactly nine unqualified Global Growth AI employee templates while Factory transitions, qualification, activation, credentials, publishing, production and Founder Liberation remain blocked.",
    decidedAt:
      new Date(
        Date.parse(execution.executedAt) + 1000,
      ).toISOString(),
  };
}

describe("Global Growth AI employee template-creation decision", () => {
  it("approves creation eligibility for exactly nine templates", () => {
    const record =
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
        approvalInput(),
      );

    expect(record.templateCreationApproved).toBe(true);
    expect(record.templateCreationExecutionAuthorized).toBe(true);
    expect(
      record.candidateTemplateCreationEligibility,
    ).toHaveLength(9);
  });

  it("verifies every required skill and tool is registered", () => {
    const record =
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
        approvalInput(),
      );

    expect(
      record.candidateTemplateCreationEligibility.every(
        (candidate) =>
          candidate.registryRequirementsSatisfied === true &&
          candidate.templateCreationAuthorized === true,
      ),
    ).toBe(true);
  });

  it("keeps Factory transition, qualification and live authority blocked", () => {
    const boundary =
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.factoryLifecycleTransitionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("supports rejection without template-creation authority", () => {
    const record =
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision({
        ...approvalInput(),
        decision:
          "REJECT_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1",
      });

    expect(record.templateCreationApproved).toBe(false);
    expect(record.templateCreationExecutionAuthorized).toBe(false);
    expect(
      record.authorityBoundary.templateCreationAuthorized,
    ).toBe(false);
  });

  it("rejects invalid owner, copied evidence, premature time and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision({
        ...approvalInput(),
        ownerId:
          "owner-invalid" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
      }),
    ).toThrow();

    expect(() =>
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision({
        ...approvalInput(),
        sourcePlan: {
          ...plan,
        } as typeof plan,
      }),
    ).toThrow();

    expect(() =>
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision({
        ...approvalInput(),
        decidedAt:
          new Date(
            Date.parse(execution.executedAt) - 1,
          ).toISOString(),
      }),
    ).toThrow();

    const valid =
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
        approvalInput(),
      );

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthAIEmployeeTemplateCreationDecision;

    expect(() =>
      validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
        tampered,
      ),
    ).toThrow();
  });
});