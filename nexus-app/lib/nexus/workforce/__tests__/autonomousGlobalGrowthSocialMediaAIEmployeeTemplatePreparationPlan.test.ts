import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN,
  createAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
  type AutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan";

describe("Global Growth Social Media template-preparation plan", () => {
  it("plans exactly nine unique specialist templates", () => {
    const plan =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

    expect(plan.plannedTemplateCount).toBe(9);
    expect(plan.requiredSkillCount).toBe(9);
    expect(plan.requiredDraftOnlyToolCount).toBe(9);
    expect(plan.templatePreparations).toHaveLength(9);
  });

  it("binds every template to an admitted Factory candidate", () => {
    const admittedIds = new Set(
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION
        .candidateRecords
        .map((candidate) => candidate.employeeId),
    );

    expect(
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN
        .templatePreparations
        .every((template) => admittedIds.has(template.employeeId)),
    ).toBe(true);
  });

  it("uses only draft-only tenant-scoped audited tools", () => {
    const templates =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN
        .templatePreparations;

    expect(
      templates.every(
        (template) =>
          template.toolMode === "DRAFT_ONLY" &&
          template.toolExternalEffect === false &&
          template.tenantScoped === true &&
          template.auditRequired === true,
      ),
    ).toBe(true);
  });

  it("keeps registry mutation, templates, qualification and live actions blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN
        .authorityBoundary;

    expect(boundary.skillRegistryMutationAuthorized).toBe(false);
    expect(boundary.toolRegistryMutationAuthorized).toBe(false);
    expect(boundary.templatePreparationAuthorized).toBe(false);
    expect(boundary.templateCreationAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects premature planning and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
        new Date(
          Date.parse(
            AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION
              .executedAt,
          ) - 1,
        ).toISOString(),
      ),
    ).toThrow();

    const valid =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_TEMPLATE_PREPARATION_PLAN;

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan;

    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeTemplatePreparationPlan(
        tampered,
      ),
    ).toThrow();
  });
});