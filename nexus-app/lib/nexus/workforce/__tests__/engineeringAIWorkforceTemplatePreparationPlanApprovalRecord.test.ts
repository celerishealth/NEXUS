import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../engineeringAIWorkforceTemplatePreparationPlan";

import {
  validateEngineeringAIWorkforceTemplatePreparationPlanDecision,
} from "../engineeringAIWorkforceTemplatePreparationPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceTemplatePreparationPlanApprovalRecord";

describe(
  "Engineering AI Workforce template-preparation plan approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-template-preparation-plan-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
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
      "binds approval to the exact immutable Engineering source plan",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

        expect(
          decision.sourcePlanningId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningId,
        );

        expect(
          decision.sourcePlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );

        expect(
          decision.sourceDevelopmentPlanningId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceDevelopmentPlanningId,
        );

        expect(
          decision.sourceDevelopmentPlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceDevelopmentPlanningDigest,
        );

        expect(
          decision.sourceDevelopmentPlanApprovalDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceApprovalDecisionId,
        );

        expect(
          decision.sourceDevelopmentPlanApprovalDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceApprovalDecisionDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
              .preparedAt,
          ),
        );
      },
    );

    it(
      "makes exactly eight candidates eligible for registry-expansion preparation only",
      () => {
        const candidates =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .candidateRegistryExpansionEligibility;

        expect(candidates).toHaveLength(8);

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
              candidate.qualificationAdmissionAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.activationAuthorized ===
                false &&
              candidate.runtimeAuthorized ===
                false &&
              candidate.repositoryReadAuthorized ===
                false &&
              candidate.repositoryWriteAuthorized ===
                false &&
              candidate.branchCreationAuthorized ===
                false &&
              candidate.pullRequestPreparationAuthorized ===
                false &&
              candidate.mergeAuthorized ===
                false &&
              candidate.productionDeploymentAuthorized ===
                false &&
              candidate.secretsAccessAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves the planned launch sequence range fifteen through twenty-two",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .reviewedPlan
            .proposedLaunchSequences,
        ).toEqual([
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
        ]);

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .reviewedPlan
            .sourceReservedRevenueGrowthLaunchSequences,
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
      "retains registry mutation template qualification activation repository and deployment blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          ownerDecisionRecorded:
            true,
          ownerIdentityBound:
            true,
          sourcePlanningBound:
            true,
          sourceDevelopmentApprovalBound:
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
          repositoryReadAuthorized:
            false,
          repositoryWriteAuthorized:
            false,
          branchCreationAuthorized:
            false,
          pullRequestPreparationAuthorized:
            false,
          mergeAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          secretsAccessAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
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
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION;

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
          validateEngineeringAIWorkforceTemplatePreparationPlanDecision(
            decision,
          ),
        ).not.toThrow();

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );
  },
);
