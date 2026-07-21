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
  createEngineeringAIWorkforceTemplatePreparationPlanDecision,
  validateEngineeringAIWorkforceTemplatePreparationPlanDecision,
} from "../engineeringAIWorkforceTemplatePreparationPlanDecision";

const decidedAt =
  "2026-07-21T15:45:00.000Z";

function createDecision(
  decision:
    | "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN"
    | "REJECT_AND_RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY",
) {
  return createEngineeringAIWorkforceTemplatePreparationPlanDecision({
    templatePreparationPlan:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
    decisionId:
      "engineering-template-preparation-plan-decision-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision,
    reason:
      "Owner reviewed the exact source-bound Engineering template-planning evidence and recorded a bounded decision.",
    decidedAt,
  });
}

describe(
  "Engineering AI Workforce template-preparation plan decision",
  () => {
    it(
      "approves registry-expansion preparation for exactly eight Engineering candidates",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(
          decision.templatePreparationPlanApproved,
        ).toBe(true);

        expect(
          decision.registryExpansionPreparationEligible,
        ).toBe(true);

        expect(
          decision.candidateRegistryExpansionEligibility,
        ).toHaveLength(8);

        expect(
          decision.candidateRegistryExpansionEligibility.every(
            (candidate) =>
              candidate.registryExpansionPreparationEligible ===
                true,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );

    it(
      "rejects without creating any downstream Engineering authority",
      () => {
        const decision =
          createDecision(
            "REJECT_AND_RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY",
          );

        expect(
          decision.templatePreparationPlanApproved,
        ).toBe(false);

        expect(
          decision.registryExpansionPreparationEligible,
        ).toBe(false);

        expect(
          decision.candidateRegistryExpansionEligibility.every(
            (candidate) =>
              candidate.registryExpansionPreparationEligible ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_TEMPLATE_PREPARATION_PLANNING_ONLY",
        );
      },
    );

    it(
      "binds the decision to the exact Engineering template-preparation plan",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

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
          decision.sourceDevelopmentPlanApprovalDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .sourceApprovalDecisionId,
        );

        expect(
          decision.reviewedPlan.proposedLaunchSequences,
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
      },
    );

    it(
      "fails closed for an invalid owner identity",
      () => {
        expect(() =>
          createEngineeringAIWorkforceTemplatePreparationPlanDecision({
            templatePreparationPlan:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
            decisionId:
              "engineering-template-preparation-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as unknown as
                typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
            reason:
              "An invalid owner must never authorize Engineering registry-expansion preparation.",
            decidedAt,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "keeps registry mutation templates qualification activation repository and deployment authority blocked",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
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
          ownerQualificationApproved:
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
          externalDeliveryAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "keeps every candidate blocked from code and production authority",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(
          decision.candidateRegistryExpansionEligibility.every(
            (candidate) =>
              candidate.skillRegistryMutationAuthorized ===
                false &&
              candidate.toolRegistryMutationAuthorized ===
                false &&
              candidate.templatePreparationAuthorized ===
                false &&
              candidate.templateCreated ===
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
      "creates deterministic immutable digest-verified Engineering decision evidence",
      () => {
        const first =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        const second =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN",
          );

        expect(second).toEqual(first);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateRegistryExpansionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplatePreparationPlanDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
