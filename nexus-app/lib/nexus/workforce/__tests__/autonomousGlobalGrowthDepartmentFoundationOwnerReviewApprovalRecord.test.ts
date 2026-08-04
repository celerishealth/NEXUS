import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION,
} from "../autonomousGlobalGrowthDepartmentFoundationOwnerReviewApprovalRecord";

import {
  validateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision,
} from "../autonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision";

describe(
  "Autonomous Global Growth Department canonical foundation approval",
  () => {
    it(
      "approves only Social Media AI Employee Roster preparation",
      () => {
        const record =
          AUTONOMOUS_GLOBAL_GROWTH_DEPARTMENT_FOUNDATION_OWNER_REVIEW_DECISION;

        expect(record.foundationAccepted).toBe(true);
        expect(
          record.authorityBoundary
            .socialMediaAIEmployeeRosterPreparationAuthorized,
        ).toBe(true);
        expect(
          record.authorityBoundary
            .socialMediaAIEmployeeRosterActivationAuthorized,
        ).toBe(false);

        expect(record.nextStep).toBe(
          "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER_V1",
        );

        expect(record.reviewedEvidence).toMatchObject({
          requiredComponentCount: 15,
          requiredOutcomeCount: 12,
          prohibitedPracticeCount: 7,
          ownerReservedAuthorityCount: 9,
          sandboxOnlyVerified: true,
          failClosedVerified: true,
          tenantIsolationRequiredVerified: true,
          providerIndependenceVerified: true,
          nexusCoreMetaIndependenceVerified: true,
          blockedMetaAccountBypassBlocked: true,
          publicPublishingBlocked: true,
          customerMessagingBlocked: true,
          liveConnectorsBlocked: true,
          realPlatformActionsBlocked: true,
          ownerFinalAuthorityPreserved: true,
          founderLiberationAchieved: false,
        });

        expect(record.authorityBoundary).toMatchObject({
          foundationApproved: true,
          contentFactoryExecutionAuthorized: false,
          videoFactoryExecutionAuthorized: false,
          publishingGatewayActivationAuthorized: false,
          liveConnectorActivationAuthorized: false,
          realPlatformCredentialAccessAuthorized: false,
          realSocialAccountActionAuthorized: false,
          publicContentPublishingAuthorized: false,
          publicPostAuthorized: false,
          customerMessageAuthorized: false,
          commentResponseAuthorized: false,
          leadContactAuthorized: false,
          demoBookingExecutionAuthorized: false,
          proposalDeliveryAuthorized: false,
          paidAdvertisingAuthorized: false,
          pricingDecisionAuthorized: false,
          discountDecisionAuthorized: false,
          contractExecutionAuthorized: false,
          partnershipExecutionAuthorized: false,
          productionDeploymentAuthorized: false,
          publicLaunchAuthorized: false,
          autonomousExternalActionAuthorized: false,
          levelThreeAuthorityGranted: false,
          founderLiberationAchieved: false,
          founderReleasedFromRoutineMarketing: false,
          ownerFinalAuthorityPreserved: true,
        });

        expect(() =>
          validateAutonomousGlobalGrowthDepartmentFoundationOwnerReviewDecision(
            record,
          ),
        ).not.toThrow();
      },
    );
  },
);