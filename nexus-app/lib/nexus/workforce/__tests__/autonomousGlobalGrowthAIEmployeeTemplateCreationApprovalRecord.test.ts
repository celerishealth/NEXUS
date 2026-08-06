import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationApprovalRecord";
import {
  validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationDecision";

describe("Canonical Global Growth AI employee template-creation approval", () => {
  it("approves controlled creation of exactly nine templates", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD;

    expect(record.templateCreationApproved).toBe(true);
    expect(record.templateCreationExecutionAuthorized).toBe(true);
    expect(record.reviewedEvidence.proposedTemplateCount).toBe(9);
    expect(record.candidateTemplateCreationEligibility).toHaveLength(9);
  });

  it("binds all nine templates to registered skills and tools", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD;

    expect(
      record.candidateTemplateCreationEligibility.every(
        (candidate) =>
          candidate.registryRequirementsSatisfied === true &&
          candidate.templateCreationAuthorized === true &&
          candidate.templateCreated === false,
      ),
    ).toBe(true);
  });

  it("keeps lifecycle transition, qualification and activation blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD
        .authorityBoundary;

    expect(boundary.factoryLifecycleTransitionAuthorized).toBe(false);
    expect(boundary.factoryLifecycleTransitionPerformed).toBe(false);
    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.qualificationEvidenceAccepted).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
  });

  it("keeps every live and external authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD
        .authorityBoundary;

    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.contentDraftingAuthorityGranted).toBe(false);
    expect(boundary.videoGenerationExecutionAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.leadContactAuthorized).toBe(false);
    expect(boundary.demoBookingExecutionAuthorized).toBe(false);
    expect(boundary.paidAdvertisingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.blockedMetaAccountUseAuthorized).toBe(false);
    expect(boundary.blockedMetaAccountBypassAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("authorizes only the controlled template-creation execution step", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_APPROVAL_RECORD;

    expect(record.nextStep).toBe(
      "EXECUTE_AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_CREATION_V1",
    );

    expect(() =>
      validateAutonomousGlobalGrowthAIEmployeeTemplateCreationDecision(
        record,
      ),
    ).not.toThrow();
  });
});