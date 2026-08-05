import { describe, expect, it } from "vitest";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "../aiEmployeeFactoryLifecycle";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION,
  createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
  type AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution";
import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionPreparationOwnerReviewApprovalRecord";

describe("Global Growth Social Media Factory-admission execution", () => {
  it("creates exactly nine append-only Factory records", () => {
    const record =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION;

    expect(record.admittedFactoryCandidateCount).toBe(9);
    expect(record.candidateRecords).toHaveLength(9);
    expect(record.admittedFactoryRecordIds).toHaveLength(9);
    expect(record.authorityBoundary.factoryAdmissionExecuted).toBe(true);
  });

  it("does not collide with preserved Factory identities", () => {
    const existingIds = new Set(
      AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
        .candidateRecords
        .map((candidate) => candidate.employeeId),
    );

    expect(
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION
        .candidateRecords
        .every((candidate) => !existingIds.has(candidate.employeeId)),
    ).toBe(true);
  });

  it("keeps every admitted candidate planned and inactive", () => {
    const candidates =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION
        .candidateRecords;

    expect(
      candidates.every(
        (candidate) =>
          candidate.lifecycleState === "PLANNED_CANDIDATE" &&
          candidate.templatePrepared === false &&
          candidate.qualificationAdmissionAuthorized === false &&
          candidate.ownerQualificationApproved === false &&
          candidate.ownerActivationApproved === false &&
          candidate.runtimeAuthorized === false &&
          candidate.externalCommunicationAuthorized === false &&
          candidate.productionExecutionAuthorized === false,
      ),
    ).toBe(true);
  });

  it("keeps publishing, customer contact and Founder Liberation blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION
        .authorityBoundary;

    expect(boundary.templatePreparationAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("rejects premature execution and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
        new Date(
          Date.parse(
            AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_OWNER_REVIEW_DECISION
              .decidedAt,
          ) - 1,
        ).toISOString(),
      ),
    ).toThrow();

    const valid =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_EXECUTION;

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution;

    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeFactoryAdmissionExecution(
        tampered,
      ),
    ).toThrow();
  });
});