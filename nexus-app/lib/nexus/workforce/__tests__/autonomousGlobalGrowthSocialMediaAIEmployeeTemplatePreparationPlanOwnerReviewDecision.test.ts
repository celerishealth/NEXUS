import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";
import {
  createAutonomousGlobalGrowthTemplatePreparationPlanDecision,
  validateAutonomousGlobalGrowthTemplatePreparationPlanDecision,
  type AutonomousGlobalGrowthTemplatePreparationPlanDecision,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlanOwnerReviewDecision";

const plan =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

function approvalInput() {
  return {
    sourcePlan: plan,
    decisionId:
      "autonomous-global-growth-template-preparation-owner-decision-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_V1" as const,
    reason:
      "Owner approves controlled skill and draft-only tool registry expansion preparation while registry mutation, template creation, qualification, activation, publishing, production and Founder Liberation remain blocked.",
    decidedAt:
      new Date(
        Date.parse(plan.preparedAt) + 1000,
      ).toISOString(),
  };
}

describe("Global Growth template-preparation owner decision", () => {
  it("approves registry-expansion preparation for nine candidates", () => {
    const record =
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision(
        approvalInput(),
      );

    expect(record.planApproved).toBe(true);
    expect(record.reviewedTemplateCount).toBe(9);
    expect(
      record.candidateRegistryExpansionEligibility,
    ).toHaveLength(9);
    expect(
      record.authorityBoundary
        .skillRegistryExpansionPreparationAuthorized,
    ).toBe(true);
    expect(
      record.authorityBoundary
        .toolRegistryExpansionPreparationAuthorized,
    ).toBe(true);
  });

  it("keeps registry mutation and template creation blocked", () => {
    const boundary =
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.skillRegistryMutationAuthorized).toBe(false);
    expect(boundary.toolRegistryMutationAuthorized).toBe(false);
    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.factoryLifecycleTransitionAuthorized).toBe(false);
  });

  it("keeps qualification, activation and live authority blocked", () => {
    const boundary =
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("supports rejection without registry-expansion preparation authority", () => {
    const record =
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision({
        ...approvalInput(),
        decision:
          "REJECT_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARATION_PLAN_V1",
      });

    expect(record.planApproved).toBe(false);
    expect(
      record.authorityBoundary
        .skillRegistryExpansionPreparationAuthorized,
    ).toBe(false);
    expect(
      record.authorityBoundary
        .toolRegistryExpansionPreparationAuthorized,
    ).toBe(false);
  });

  it("rejects invalid owner, copied plan, premature time and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision({
        ...approvalInput(),
        ownerId:
          "owner-invalid" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
      }),
    ).toThrow();

    expect(() =>
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision({
        ...approvalInput(),
        sourcePlan: {
          ...plan,
        } as typeof plan,
      }),
    ).toThrow();

    expect(() =>
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision({
        ...approvalInput(),
        decidedAt:
          new Date(
            Date.parse(plan.preparedAt) - 1,
          ).toISOString(),
      }),
    ).toThrow();

    const valid =
      createAutonomousGlobalGrowthTemplatePreparationPlanDecision(
        approvalInput(),
      );

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthTemplatePreparationPlanDecision;

    expect(() =>
      validateAutonomousGlobalGrowthTemplatePreparationPlanDecision(
        tampered,
      ),
    ).toThrow();
  });
});