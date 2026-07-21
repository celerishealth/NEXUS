import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
} from "../engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
  createEngineeringAIWorkforceDevelopmentPlanDecision,
  validateEngineeringAIWorkforceDevelopmentPlanDecision,
  type EngineeringAIWorkforceDevelopmentPlanDecision,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

const APPROVAL_REASON =
  "Approve preparation of the owner-controlled Engineering AI Workforce template plan while retaining qualification, activation, repository, merge, deployment, secrets, customer, payment, and public-launch restrictions.";

function timestampAfterPlan(
  milliseconds = 1000,
): string {
  return new Date(
    Date.parse(
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
        .preparedAt,
    ) + milliseconds,
  ).toISOString();
}

describe(
  "Engineering AI Workforce development-plan decision",
  () => {
    it(
      "records approval as template-plan preparation eligibility only",
      () => {
        const decision =
          createEngineeringAIWorkforceDevelopmentPlanDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            decisionId:
              "engineering-workforce-plan-decision-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              timestampAfterPlan(),
          });

        expect(
          decision.developmentPlanApproved,
        ).toBe(true);

        expect(
          decision.templatePreparationPlanEligible,
        ).toBe(true);

        expect(
          decision.candidateDevelopmentEligibility.every(
            (candidate) =>
              candidate.templatePreparationPlanEligible ===
                true &&
              candidate.templatePreparationAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.ownerActivationAuthorized ===
                false &&
              candidate.runtimeActivationAuthorized ===
                false &&
              candidate.repositoryReadAuthorized ===
                false &&
              candidate.repositoryWriteAuthorized ===
                false &&
              candidate.mergeAuthorized ===
                false &&
              candidate.productionDeploymentAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARATION_PLAN",
        );
      },
    );

    it(
      "records rejection without preparation eligibility",
      () => {
        const decision =
          createEngineeringAIWorkforceDevelopmentPlanDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            decisionId:
              "engineering-workforce-plan-decision-002",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING",
            reason:
              "Retain the verified Engineering Workforce development plan without permitting template-plan preparation.",
            decidedAt:
              timestampAfterPlan(2000),
          });

        expect(
          decision.developmentPlanApproved,
        ).toBe(false);

        expect(
          decision.templatePreparationPlanEligible,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLANNING_ONLY",
        );
      },
    );

    it(
      "blocks every identity except the verified NEXUS owner",
      () => {
        expect(() =>
          createEngineeringAIWorkforceDevelopmentPlanDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            decisionId:
              "engineering-workforce-plan-decision-003",
            ownerId:
              "owner-attacker-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              timestampAfterPlan(3000),
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "blocks decisions dated before the source plan",
      () => {
        expect(() =>
          createEngineeringAIWorkforceDevelopmentPlanDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            decisionId:
              "engineering-workforce-plan-decision-004",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
                    .preparedAt,
                ) - 1,
              ).toISOString(),
          }),
        ).toThrow(
          "cannot precede development planning",
        );
      },
    );

    it(
      "keeps repository production external financial and legal authority blocked",
      () => {
        const decision =
          createEngineeringAIWorkforceDevelopmentPlanDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            decisionId:
              "engineering-workforce-plan-decision-005",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              timestampAfterPlan(4000),
          });

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          templatePreparationPlanEligible:
            true,
          rosterMutationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerActivationAuthorized:
            false,
          runtimeActivationAuthorized:
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
      "creates deterministic immutable digest-bound decision evidence",
      () => {
        const input = {
          developmentPlan:
            ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
          decisionId:
            "engineering-workforce-plan-decision-006",
          ownerId:
            ENGINEERING_AI_WORKFORCE_OWNER_ID,
          decision:
            "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
          reason:
            APPROVAL_REASON,
          decidedAt:
            timestampAfterPlan(5000),
        } as const;

        const first =
          createEngineeringAIWorkforceDevelopmentPlanDecision(
            input,
          );

        const second =
          createEngineeringAIWorkforceDevelopmentPlanDecision(
            input,
          );

        expect(first).toEqual(second);

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
            first.candidateDevelopmentEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceDevelopmentPlanDecision(
            first,
          ),
        ).not.toThrow();
      },
    );

    it(
      "detects mutation of recorded decision evidence",
      () => {
        const record =
          createEngineeringAIWorkforceDevelopmentPlanDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            decisionId:
              "engineering-workforce-plan-decision-007",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN",
            reason:
              APPROVAL_REASON,
            decidedAt:
              timestampAfterPlan(6000),
          });

        const tampered = {
          ...record,
          ownerId:
            "owner-attacker-001",
        } as unknown as
          EngineeringAIWorkforceDevelopmentPlanDecision;

        expect(() =>
          validateEngineeringAIWorkforceDevelopmentPlanDecision(
            tampered,
          ),
        ).toThrow(
          "digest verification failed",
        );
      },
    );
  },
);
