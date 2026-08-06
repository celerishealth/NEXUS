import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlanOwnerReviewApprovalRecord";
import {
  validateAutonomousGlobalGrowthTemplatePreparationPlanDecision,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlanOwnerReviewDecision";

describe("Canonical Global Growth template-plan owner approval", () => {
  it("approves registry-expansion preparation for exactly nine candidates", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD;

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
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD
        .authorityBoundary;

    expect(boundary.skillRegistryMutationAuthorized).toBe(false);
    expect(boundary.toolRegistryMutationAuthorized).toBe(false);
    expect(boundary.templatePreparationAuthorized).toBe(false);
    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.factoryLifecycleTransitionAuthorized).toBe(false);
  });

  it("keeps qualification, activation and live actions blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD
        .authorityBoundary;

    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.paidAdvertisingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("authorizes only the next controlled preparation step", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD;

    expect(record.nextStep).toBe(
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SKILL_AND_DRAFT_ONLY_TOOL_REGISTRY_EXPANSION_V1",
    );

    expect(
      record.candidateRegistryExpansionEligibility.every(
        (candidate) =>
          candidate.registryExpansionPreparationAuthorized === true &&
          candidate.skillRegistryMutationAuthorized === false &&
          candidate.toolRegistryMutationAuthorized === false &&
          candidate.templateCreationAuthorized === false &&
          candidate.qualificationExecutionAuthorized === false &&
          candidate.employeeActivationAuthorized === false &&
          candidate.runtimeAuthorized === false &&
          candidate.externalActionAuthorized === false,
      ),
    ).toBe(true);
  });

  it("passes canonical integrity validation", () => {
    expect(() =>
      validateAutonomousGlobalGrowthTemplatePreparationPlanDecision(
        AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN_OWNER_REVIEW_APPROVAL_RECORD,
      ),
    ).not.toThrow();
  });
});