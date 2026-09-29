import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildPhase5CustomerSuccessSnapshot,
} from "../phase5CustomerSuccessExperience";

describe(
  "Phase 5 Customer Success Experience",
  () => {

    const snapshot=
      buildPhase5CustomerSuccessSnapshot({
        userName: "Pilot User",
        businessType: "industrial safety",
        goal: "quotation follow-up",
        technicalConfidence: "LOW",
        mobileUser: true,
        preferredLanguage: "English",
        hasExistingData: false,
        currentIssue: {
          title: "Quotation import failed",
          severity: "HIGH",
        },
      });

    it(
      "provides a minimal recommended setup",
      () => {
        expect(
          snapshot.recommendedSetup,
        ).toEqual({
          mode: "GUIDED",
          complexity: "MINIMAL",
          useSampleData: true,
          recommendedLanguage: "English",
        });
      },
    );

    it(
      "provides synthetic demo sample data",
      () => {
        expect(
          snapshot.demoSampleData,
        ).toEqual({
          available: true,
          syntheticOnly: true,
          customerDataRequired: false,
        });
      },
    );

    it(
      "provides contextual in-app help",
      () => {
        expect(
          snapshot.inAppHelp
            .contextualHelpEnabled,
        ).toBe(true);

        expect(
          snapshot.inAppHelp
            .plainLanguageEnabled,
        ).toBe(true);
      },
    );

    it(
      "provides bounded customer support workflow",
      () => {
        expect(
          snapshot.customerInboxSupportWorkflow,
        ).toEqual({
          intakeEnabled: true,
          classificationEnabled: true,
          escalationEnabled: true,
          externalReplyRequiresHumanApproval: true,
        });
      },
    );

    it(
      "tracks adoption and value milestones",
      () => {
        expect(
          snapshot.adoptionValueMilestones,
        ).toEqual([
          "ONBOARDING_COMPLETE",
          "FIRST_USEFUL_RESULT",
          "REPEAT_VALUE",
          "OWNER_CONFIDENCE",
        ]);
      },
    );

    it(
      "supports mobile-first simplified use",
      () => {
        expect(
          snapshot.mobileFriendlyUse,
        ).toEqual({
          mobileSupported: true,
          smallScreenPriority: true,
          primaryActionsLimited: true,
        });
      },
    );

    it(
      "uses friendly fail-safe recovery",
      () => {
        expect(
          snapshot.friendlyErrorRecovery,
        ).toEqual({
          blameFreeMessage: true,
          safeRetryOffered: true,
          destructiveRecoveryAutomatic: false,
        });
      },
    );

    it(
      "simplifies language and accessibility",
      () => {
        expect(
          snapshot
            .accessibilityLanguageSimplification,
        ).toEqual({
          plainLanguage: true,
          conciseInstructions: true,
          preferredLanguage: "English",
        });
      },
    );

    it(
      "targets a fast first useful result without technical expertise",
      () => {
        expect(
          snapshot.fastFirstUsefulResult
            .targetSteps,
        ).toBe(3);

        expect(
          snapshot.fastFirstUsefulResult
            .requiresTechnicalExpertise,
        ).toBe(false);

        expect(
          snapshot.fastFirstUsefulResult
            .nextAction.length,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "escalates high severity support incidents",
      () => {
        expect(
          snapshot.supportIncident,
        ).toEqual({
          issuePresent: true,
          severity: "HIGH",
          escalationRequired: true,
        });
      },
    );

    it(
      "preserves owner and execution boundaries",
      () => {
        expect(
          snapshot.authorityBoundary,
        ).toEqual({
          externalMessageSendAuthorized: false,
          autonomousCustomerActionAuthorized: false,
          databaseMutationAuthorized: false,
          productionMutationAuthorized: false,
          ownerFinalAuthorityPreserved: true,
        });
      },
    );
  },
);