import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewApprovalRecord";

import {
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision";

describe(
  "Canonical Global Growth Social Media roster owner approval",
  () => {
    it(
      "approves only Factory admission preparation",
      () => {
        const record =
          AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION;

        expect(record.rosterAccepted).toBe(true);
        expect(
          record.authorityBoundary
            .rosterApproved,
        ).toBe(true);
        expect(
          record.authorityBoundary
            .factoryAdmissionPreparationAuthorized,
        ).toBe(true);
        expect(
          record.authorityBoundary
            .factoryAdmissionAuthorized,
        ).toBe(false);

        expect(record.nextStep).toBe(
          "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_FACTORY_ADMISSION_V1",
        );
      },
    );

    it(
      "preserves all reviewed roster evidence",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION
            .reviewedEvidence,
        ).toMatchObject({
          totalEmployeeCount: 12,
          coveredFunctionCount: 12,
          existingCandidateCount: 3,
          newCandidateProposalCount: 9,
          allCandidatesInactive: true,
          allExternalActionsBlocked: true,
          founderLiberationAchieved: false,
        });
      },
    );

    it(
      "keeps qualification, activation and live authority blocked",
      () => {
        const boundary =
          AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION
            .authorityBoundary;

        expect(boundary.factoryAdmissionAuthorized).toBe(false);
        expect(boundary.qualificationExecutionAuthorized).toBe(false);
        expect(boundary.employeeActivationAuthorized).toBe(false);
        expect(boundary.realCredentialAccessAuthorized).toBe(false);
        expect(boundary.liveConnectorActivationAuthorized).toBe(false);
        expect(boundary.publicPublishingAuthorized).toBe(false);
        expect(boundary.customerMessagingAuthorized).toBe(false);
        expect(boundary.productionExecutionAuthorized).toBe(false);
        expect(boundary.autonomousExternalActionAuthorized).toBe(false);
        expect(boundary.blockedMetaAccountUseAuthorized).toBe(false);
        expect(boundary.blockedMetaAccountBypassAuthorized).toBe(false);
        expect(boundary.levelThreeAuthorityGranted).toBe(false);
        expect(boundary.founderLiberationAchieved).toBe(false);
        expect(boundary.ownerFinalAuthorityPreserved).toBe(true);
      },
    );

    it(
      "passes canonical integrity validation",
      () => {
        expect(() =>
          validateAutonomousGlobalGrowthSocialMediaAIEmployeeRosterOwnerReviewDecision(
            AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_OWNER_REVIEW_DECISION,
          ),
        ).not.toThrow();
      },
    );
  },
);