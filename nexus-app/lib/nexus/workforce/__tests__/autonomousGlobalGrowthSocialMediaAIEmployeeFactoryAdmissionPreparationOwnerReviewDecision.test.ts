import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation";
import {
  createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision,
  type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparationOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

const preparation =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;

function approvalInput() {
  return {
    sourcePreparation: preparation,
    decisionId:
      "autonomous-global-growth-social-media-factory-admission-owner-decision-001",
    ownerId: ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1" as const,
    reason:
      "Owner approves controlled append-only Factory admission for the nine new Global Growth Social Media AI employee candidates while qualification, activation, credentials, publishing, customer contact, production, autonomous external action, Level 3 authority and Founder Liberation remain blocked.",
    decidedAt: new Date(
      Date.parse(preparation.preparedAt) + 1000,
    ).toISOString(),
  };
}

describe("Global Growth Factory-admission owner decision", () => {
  it("authorizes admission records for exactly nine candidates", () => {
    const record =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
        approvalInput(),
      );

    expect(record.preparationAccepted).toBe(true);
    expect(record.candidateAuthorizations).toHaveLength(9);
    expect(record.authorityBoundary.factoryAdmissionAuthorized).toBe(true);
    expect(record.authorityBoundary.factoryRecordCreationAuthorized).toBe(true);
  });

  it("keeps candidates planned, inactive and externally blocked", () => {
    const candidates =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
        approvalInput(),
      ).candidateAuthorizations;

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

  it("keeps qualification, activation and live authority blocked", () => {
    const boundary =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.templatePreparationAuthorized).toBe(false);
    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("supports rejection without Factory-admission authority", () => {
    const record =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision({
        ...approvalInput(),
        decision:
          "REJECT_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1",
      });

    expect(record.preparationAccepted).toBe(false);
    expect(record.authorityBoundary.factoryAdmissionAuthorized).toBe(false);
    expect(record.authorityBoundary.factoryRecordCreationAuthorized).toBe(false);
  });

  it("rejects invalid owner, copied preparation, premature time and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision({
        ...approvalInput(),
        ownerId:
          "owner-invalid-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
      }),
    ).toThrow("Only the verified NEXUS owner");

    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision({
        ...approvalInput(),
        sourcePreparation: {
          ...preparation,
        } as typeof preparation,
      }),
    ).toThrow("Only the canonical Factory-admission preparation");

    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision({
        ...approvalInput(),
        decidedAt: new Date(
          Date.parse(preparation.preparedAt) - 1,
        ).toISOString(),
      }),
    ).toThrow();

    const valid =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
        approvalInput(),
      );

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision;

    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionDecision(
        tampered,
      ),
    ).toThrow();
  });
});