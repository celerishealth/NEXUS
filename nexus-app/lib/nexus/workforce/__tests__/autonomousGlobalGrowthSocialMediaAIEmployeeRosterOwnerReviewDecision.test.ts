import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeRoster";
import {
  createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision,
  type AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision";
import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

const roster =
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER;

function approvalInput() {
  return {
    sourceRoster: roster,
    decisionId:
      "autonomous-global-growth-social-media-roster-owner-review-001",
    ownerId: ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1" as const,
    reason:
      "Owner approves the twelve-role Global Growth Social Media AI employee roster and authorizes only controlled Factory admission preparation while qualification, activation, credentials, publishing, customer contact, production, autonomous external action, Level 3 authority, and Founder Liberation remain blocked.",
    decidedAt: new Date(
      Date.parse(roster.createdAt) + 1000,
    ).toISOString(),
  };
}

describe("Global Growth Social Media roster owner review", () => {
  it("authorizes only Factory admission preparation", () => {
    const record =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
        approvalInput(),
      );

    expect(record.rosterAccepted).toBe(true);
    expect(
      record.authorityBoundary.factoryAdmissionPreparationAuthorized,
    ).toBe(true);
    expect(record.authorityBoundary.factoryAdmissionAuthorized).toBe(false);
    expect(record.nextStep).toBe(
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1",
    );
  });

  it("preserves roster evidence", () => {
    const evidence =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
        approvalInput(),
      ).reviewedEvidence;

    expect(evidence).toMatchObject({
      totalEmployeeCount: 12,
      coveredFunctionCount: 12,
      existingCandidateCount: 3,
      newCandidateProposalCount: 9,
      allCandidatesInactive: true,
      allExternalActionsBlocked: true,
      founderLiberationAchieved: false,
    });
  });

  it("keeps all consequential authority blocked", () => {
    const boundary =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
        approvalInput(),
      ).authorityBoundary;

    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.blockedMetaAccountBypassAuthorized).toBe(false);
    expect(boundary.levelThreeAuthorityGranted).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("supports rejection without admission-preparation authority", () => {
    const record =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision({
        ...approvalInput(),
        decision:
          "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_AWAITING_REVIEW",
      });

    expect(record.rosterAccepted).toBe(false);
    expect(
      record.authorityBoundary.factoryAdmissionPreparationAuthorized,
    ).toBe(false);
  });

  it("rejects invalid owner, copied roster, premature review and tampering", () => {
    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision({
        ...approvalInput(),
        ownerId:
          "owner-invalid-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
      }),
    ).toThrow("Only the verified NEXUS owner");

    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision({
        ...approvalInput(),
        sourceRoster: { ...roster } as typeof roster,
      }),
    ).toThrow("Only the canonical Global Growth roster");

    expect(() =>
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision({
        ...approvalInput(),
        decidedAt: new Date(
          Date.parse(roster.createdAt) - 1,
        ).toISOString(),
      }),
    ).toThrow();

    const valid =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
        approvalInput(),
      );

    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision;

    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
        tampered,
      ),
    ).toThrow();
  });
});