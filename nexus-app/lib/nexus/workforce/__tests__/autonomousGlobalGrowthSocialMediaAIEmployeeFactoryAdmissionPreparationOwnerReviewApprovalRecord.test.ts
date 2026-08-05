import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparationOwnerReviewApprovalRecord";
import {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparationOwnerReviewDecision";

describe("Canonical Global Growth Factory-admission owner approval", () => {
  it("authorizes append-only Factory admission for exactly nine candidates", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION;

    expect(record.preparationAccepted).toBe(true);
    expect(record.candidateAuthorizations).toHaveLength(9);
    expect(record.authorityBoundary.factoryAdmissionAuthorized).toBe(true);
    expect(record.authorityBoundary.factoryRecordCreationAuthorized).toBe(true);
    expect(record.nextStep).toBe(
      "EXECUTE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1",
    );
  });

  it("keeps every candidate planned, inactive and externally blocked", () => {
    const candidates =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION
        .candidateAuthorizations;

    expect(
      candidates.every(
        (candidate) =>
          candidate.targetLifecycleState === "PLANNED_CANDIDATE" &&
          candidate.qualificationExecutionAuthorized === false &&
          candidate.employeeActivationAuthorized === false &&
          candidate.runtimeAuthorized === false &&
          candidate.externalActionAuthorized === false,
      ),
    ).toBe(true);
  });

  it("keeps qualification, activation and all live authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION
        .authorityBoundary;

    expect(boundary.templatePreparationAuthorized).toBe(false);
    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.credentialAccessAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("passes canonical integrity validation", () => {
    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
        AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION,
      ),
    ).not.toThrow();
  });
});