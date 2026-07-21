import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION,
} from "../revenueGrowthWorkforceRosterAdmissionExecution";

import {
  validateRevenueGrowthWorkforceFactoryAdmissionDecision,
} from "../revenueGrowthWorkforceFactoryAdmissionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION,
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_RECORD_VERSION,
} from "../revenueGrowthWorkforceFactoryAdmissionApprovalRecord";

describe(
  "Revenue Growth Workforce factory-admission approval record",
  () => {
    it(
      "records the explicit verified-owner factory-admission approval",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION;

        expect(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-revenue-growth-workforce-factory-admission-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION",
        );

        expect(
          decision.factoryAdmissionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact roster-admission execution",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION;

        expect(
          decision.sourceExecutionId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceExecutionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
            .executionDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            REVENUE_GROWTH_WORKFORCE_ROSTER_ADMISSION_EXECUTION
              .executedAt,
          ),
        );
      },
    );

    it(
      "authorizes factory admission for exactly nine planned candidates",
      () => {
        const candidates =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION
            .candidateFactoryAdmissionEligibility;

        expect(candidates).toHaveLength(9);

        expect(
          candidates.every(
            (candidate) =>
              candidate.sourceRosterStatus ===
                "PLANNED_CANDIDATE" &&
              candidate.targetFactoryLifecycleState ===
                "PLANNED_CANDIDATE" &&
              candidate.factoryAdmissionAuthorized ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not itself create factory records",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION
            .nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_FACTORY_ADMISSION",
        );
      },
    );

    it(
      "retains template qualification activation and external blocks",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION;

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          factoryAdmissionAuthorized:
            true,
          factoryRecordCreationAuthorized:
            true,
          initialLifecycleStateLocked:
            true,
          directTemplateBypassBlocked:
            true,
          directQualificationBypassBlocked:
            true,
          incompleteQualificationBlocked:
            true,
          directActivationBypassBlocked:
            true,
          selfActivationBlocked:
            true,
          templatePreparationAuthorized:
            false,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          qualificationEvidenceAccepted:
            false,
          ownerQualificationApproved:
            false,
          activationCandidatePrepared:
            false,
          ownerActivationApproved:
            false,
          runtimeAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          contentDraftingAuthorityGranted:
            false,
          videoGenerationExecutionAuthorized:
            false,
          liveSocialPostingAuthorized:
            false,
          paidAdvertisingSpendAuthorized:
            false,
          customerMessagingAuthorized:
            false,
          customerDataAccessAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "records immutable digest-verified decision evidence",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(
            decision,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.candidateFactoryAdmissionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceFactoryAdmissionDecision(
            decision,
          ),
        ).not.toThrow();
      },
    );
  },
);
