import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationApprovalRecord";
import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION,
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,
  createAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution,
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution,
  type AutonomousGlobalGrowthAIEmployeeTemplateCreationExecution,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationExecution";

describe("Global Growth AI employee template-creation execution", () => {
  it("creates exactly nine registered-unqualified templates", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION;

    expect(record.createdTemplates).toHaveLength(9);
    expect(record.templateRegistry.registeredTemplateCount).toBe(9);
    expect(record.templateRegistry.qualifiedTemplateCount).toBe(0);
    expect(record.templateRegistry.activationEligibleTemplateCount).toBe(0);
  });

  it("binds each template to one draft-only tool and owner escalation", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION;

    expect(
      record.createdTemplates.every(
        (template) =>
          template.manifestInput.skills.length === 2 &&
          template.manifestInput.skills.some(
            (skill) => skill.skillId === "skill-owner-escalation",
          ) &&
          template.manifestInput.toolGrants.length === 1 &&
          template.manifestInput.toolGrants[0].mode === "DRAFT_ONLY",
      ),
    ).toBe(true);
  });

  it("keeps every template unqualified and activation-blocked", () => {
    expect(
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY.templates.every(
        (template) =>
          template.status === "REGISTERED_UNQUALIFIED" &&
          template.controlledActivationEligible === false,
      ),
    ).toBe(true);
  });

  it("keeps lifecycle, publishing, production and Founder Liberation blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION
        .authorityBoundary;

    expect(boundary.factoryLifecycleTransitionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects premature execution and tampering", () => {
    const approval =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD;

    expect(() =>
      createAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
        new Date(Date.parse(approval.decidedAt) - 1).toISOString(),
      ),
    ).toThrow();

    const valid =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_EXECUTION;

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthAIEmployeeTemplateCreationExecution;

    expect(() =>
      validateAutonomousGlobalGrowthAIEmployeeTemplateCreationExecution(
        tampered,
      ),
    ).toThrow();
  });
});