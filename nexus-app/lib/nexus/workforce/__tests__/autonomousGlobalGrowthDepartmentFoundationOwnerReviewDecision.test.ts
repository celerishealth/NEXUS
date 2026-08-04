import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
} from "../autonomousGlobalGrowthDepartmentFoundation";

import {
  createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision,
  validateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision,
  type AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision,
} from "../autonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

function createApproval() {
  return createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision({
    sourceFoundation:
      AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
    decisionId:
      "autonomous-global-growth-department-foundation-owner-review-decision-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1",
    reason:
      "Owner approves the sandbox-only and fail-closed Autonomous Global Growth Department Foundation v1, authorizing only preparation of its Social Media AI Employee Roster while retaining all activation, credential, publishing, customer-contact, commercial, production, external-action, Level 3, and Founder Liberation authority blocks.",
    decidedAt:
      new Date(
        Date.parse(
          AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION.createdAt,
        ) + 1000,
      ).toISOString(),
  });
}

describe(
  "Autonomous Global Growth Department foundation owner review",
  () => {
    it(
      "authorizes only Social Media AI Employee Roster preparation",
      () => {
        const decision = createApproval();

        expect(decision.foundationAccepted).toBe(true);
        expect(
          decision.authorityBoundary
            .socialMediaAIEmployeeRosterPreparationAuthorized,
        ).toBe(true);
        expect(
          decision.authorityBoundary
            .socialMediaAIEmployeeRosterActivationAuthorized,
        ).toBe(false);
        expect(decision.nextStep).toBe(
          "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1",
        );
      },
    );

    it(
      "keeps all live and consequential authority blocked",
      () => {
        const boundary = createApproval().authorityBoundary;

        expect(boundary.liveConnectorActivationAuthorized).toBe(false);
        expect(boundary.realPlatformCredentialAccessAuthorized).toBe(false);
        expect(boundary.realSocialAccountActionAuthorized).toBe(false);
        expect(boundary.publicContentPublishingAuthorized).toBe(false);
        expect(boundary.customerMessageAuthorized).toBe(false);
        expect(boundary.paidAdvertisingAuthorized).toBe(false);
        expect(boundary.productionDeploymentAuthorized).toBe(false);
        expect(boundary.publicLaunchAuthorized).toBe(false);
        expect(boundary.levelThreeAuthorityGranted).toBe(false);
        expect(boundary.founderLiberationAchieved).toBe(false);
      },
    );

    it(
      "supports rejection without roster-preparation authority",
      () => {
        const rejected =
          createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision({
            sourceFoundation:
              AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
            decisionId:
              "autonomous-global-growth-department-foundation-owner-review-rejection-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_AWAITING_REVIEW",
            reason:
              "Owner rejects the current Autonomous Global Growth Department foundation review and retains the foundation awaiting further review with roster preparation, activation, publishing, customer contact, production, external actions, Level 3 authority, and Founder Liberation fully blocked.",
            decidedAt:
              new Date(
                Date.parse(
                  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION.createdAt,
                ) + 1000,
              ).toISOString(),
          });

        expect(rejected.foundationAccepted).toBe(false);
        expect(
          rejected.authorityBoundary
            .socialMediaAIEmployeeRosterPreparationAuthorized,
        ).toBe(false);
        expect(rejected.nextStep).toBe(
          "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_AWAITING_OWNER_REVIEW",
        );
      },
    );

    it(
      "rejects copied foundation and invalid owner",
      () => {
        const copied = {
          ...AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
        } as typeof AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION;

        expect(() =>
          createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision({
            sourceFoundation: copied,
            decisionId:
              "autonomous-global-growth-department-copied-foundation-review-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1",
            reason:
              "A copied foundation must not receive owner approval or authorize roster preparation, activation, credentials, publishing, customer contact, production, external execution, Level 3 authority, or Founder Liberation.",
            decidedAt:
              new Date(
                Date.parse(
                  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION.createdAt,
                ) + 1000,
              ).toISOString(),
          }),
        ).toThrow(
          "Only the canonical Autonomous Global Growth Department foundation",
        );

        expect(() =>
          createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision({
            sourceFoundation:
              AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
            decisionId:
              "autonomous-global-growth-department-invalid-owner-review-001",
            ownerId:
              "owner-invalid-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1",
            reason:
              "An invalid owner identity must never approve the Autonomous Global Growth Department foundation or authorize roster preparation, activation, publishing, customer contact, production, external actions, Level 3 authority, or Founder Liberation.",
            decidedAt:
              new Date(
                Date.parse(
                  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION.createdAt,
                ) + 1000,
              ).toISOString(),
          }),
        ).toThrow("Only the verified NEXUS owner");
      },
    );

    it(
      "rejects premature review and tampering",
      () => {
        expect(() =>
          createAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision({
            sourceFoundation:
              AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION,
            decisionId:
              "autonomous-global-growth-department-premature-review-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_V1",
            reason:
              "A review timestamp before foundation creation must fail closed and must not authorize roster preparation, activation, publishing, customer contact, production, external actions, Level 3 authority, or Founder Liberation.",
            decidedAt:
              new Date(
                Date.parse(
                  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION.createdAt,
                ) - 1,
              ).toISOString(),
          }),
        ).toThrow("cannot precede foundation creation");

        const valid = createApproval();
        const tampered = {
          ...valid,
          authorityBoundary: {
            ...valid.authorityBoundary,
            publicContentPublishingAuthorized: true,
          },
        } as unknown as AutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision;

        expect(() =>
          validateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);