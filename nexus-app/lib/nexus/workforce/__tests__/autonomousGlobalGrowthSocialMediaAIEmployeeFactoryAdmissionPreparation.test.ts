import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION,
  createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation,
  type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewApprovalRecord";

describe("Global Growth Social Media Factory-admission preparation", () => {
  it("preserves three existing Factory candidates and prepares nine new candidates", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;

    expect(record.existingFactoryCandidateCount).toBe(3);
    expect(record.newFactoryAdmissionCandidateCount).toBe(9);
    expect(record.existingFactoryBindings).toHaveLength(3);
    expect(record.candidateAdmissionPreparations).toHaveLength(9);
  });

  it("does not duplicate existing Marketing candidates", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;

    expect(
      record.existingFactoryBindings.every(
        (candidate) =>
          candidate.factoryAdmissionRequired === false &&
          candidate.duplicateFactoryAdmissionBlocked === true,
      ),
    ).toBe(true);
  });

  it("keeps all new candidates planned, inactive and unadmitted", () => {
    const candidates =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION
        .candidateAdmissionPreparations;

    expect(
      candidates.every(
        (candidate) =>
          candidate.sourceLifecycleState === "PLANNED_CANDIDATE" &&
          candidate.targetFactoryLifecycleState === "PLANNED_CANDIDATE" &&
          candidate.factoryAdmissionAuthorized === false &&
          candidate.qualificationExecutionAuthorized === false &&
          candidate.employeeActivationAuthorized === false &&
          candidate.runtimeAuthorized === false &&
          candidate.externalActionAuthorized === false,
      ),
    ).toBe(true);
  });

  it("keeps all live and Founder Liberation authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION
        .authorityBoundary;

    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.blockedMetaAccountBypassAuthorized).toBe(false);
    expect(boundary.levelThreeAuthorityGranted).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects premature preparation and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
        new Date(
          Date.parse(
            AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION
              .decidedAt,
          ) - 1,
        ).toISOString(),
      ),
    ).toThrow();

    const valid =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_PREPARATION;

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation;

    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparation(
        tampered,
      ),
    ).toThrow();
  });
});