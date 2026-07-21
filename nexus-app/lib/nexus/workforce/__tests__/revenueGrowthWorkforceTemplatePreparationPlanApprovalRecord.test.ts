import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../revenueGrowthWorkforceTemplatePreparationPlan";

import {
  validateRevenueGrowthWorkforceTemplatePreparationPlanDecision,
} from "../revenueGrowthWorkforceTemplatePreparationPlanDecision";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION,
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_RECORD_VERSION,
} from "../revenueGrowthWorkforceTemplatePreparationPlanApprovalRecord";

describe(
  "Revenue Growth Workforce template-preparation plan approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

        expect(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-revenue-growth-workforce-template-preparation-plan-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
        );

        expect(
          decision.templatePreparationPlanApproved,
        ).toBe(true);

        expect(
          decision.registryExpansionPreparationEligible,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact immutable source plan",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

        expect(
          decision.sourcePlanningId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningId,
        );

        expect(
          decision.sourcePlanningDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );

        expect(
          decision.sourceFactoryAdmissionExecutionId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceFactoryAdmissionExecutionId,
        );

        expect(
          decision.sourceFactoryAdmissionExecutionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceFactoryAdmissionExecutionDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
              .preparedAt,
          ),
        );
      },
    );

    it(
      "makes exactly nine candidates eligible for registry-expansion preparation only",
      () => {
        const candidates =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .candidateRegistryExpansionEligibility;

        expect(candidates).toHaveLength(9);

        expect(
          candidates.every(
            (candidate) =>
              candidate.registryExpansionPreparationEligible ===
                true &&
              candidate.skillRegistryMutationAuthorized ===
                false &&
              candidate.toolRegistryMutationAuthorized ===
                false &&
              candidate.templatePreparationAuthorized ===
                false &&
              candidate.templateCreated ===
                false &&
              candidate.factoryLifecycleTransitionAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.activationAuthorized ===
                false &&
              candidate.runtimeAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves the planned launch sequence range six through fourteen",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .reviewedPlan
            .proposedLaunchSequences,
        ).toEqual([
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
        ]);
      },
    );

    it(
      "retains registry mutation template qualification activation and external blocks",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          ownerDecisionRecorded:
            true,
          ownerIdentityBound:
            true,
          sourcePlanningBound:
            true,
          approvalBypassAllowed:
            false,
          skillRegistryExpansionPreparationAuthorized:
            true,
          toolRegistryExpansionPreparationAuthorized:
            true,
          skillRegistryMutationAuthorized:
            false,
          toolRegistryMutationAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          templateCreationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
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
      "records immutable digest-verified evidence and advances only to preparation",
      () => {
        const decision =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

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
            decision.candidateRegistryExpansionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceTemplatePreparationPlanDecision(
            decision,
          ),
        ).not.toThrow();

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );
  },
);
