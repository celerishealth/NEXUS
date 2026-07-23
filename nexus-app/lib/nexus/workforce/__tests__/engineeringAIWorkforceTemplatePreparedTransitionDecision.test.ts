import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISION_VERSION,
  createEngineeringAIWorkforceTemplatePreparedTransitionDecision,
  validateEngineeringAIWorkforceTemplatePreparedTransitionDecision,
} from "../engineeringAIWorkforceTemplatePreparedTransitionDecision";

const approvalTime =
  new Date(
    Date.parse(
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
        .executedAt,
    ) + 1,
  ).toISOString();

function createApprovedDecision() {
  return createEngineeringAIWorkforceTemplatePreparedTransitionDecision({
    lifecycleTransitionExecution:
      ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-template-prepared-transition-owner-approval-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION",
    reason:
      "Owner approves only the next sequential transition from TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED while retaining every qualification, activation, runtime, repository, deployment, customer, payment, legal, autonomous, and public-launch boundary.",
    decidedAt:
      approvalTime,
  });
}

describe(
  "Engineering AI Workforce template-prepared transition decision",
  () => {
    it(
      "creates the exact bounded owner decision contract",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_DECISION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-template-prepared-transition-decision-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION",
        );

        expect(
          decision.templatePreparedTransitionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds the decision to the exact pending-transition execution",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          decision.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
            .executionDigest,
        );

        expect(
          decision.sourceFactoryFoundationDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
            .sourceFactoryFoundationDigest,
        );
      },
    );

    it(
      "authorizes exactly eight sequential transitions without executing them",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          decision.candidateTransitionEligibility,
        ).toHaveLength(8);

        expect(
          decision.candidateTransitionEligibility.map(
            (candidate) =>
              candidate.publicName,
          ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);

        expect(
          decision.candidateTransitionEligibility.every(
            (candidate) =>
              candidate.sourceLifecycleState ===
                "TEMPLATE_PREPARATION_PENDING" &&
              candidate.targetLifecycleState ===
                "TEMPLATE_PREPARED" &&
              candidate.templatePreparedTransitionAuthorized ===
                true &&
              candidate.templatePreparedTransitionExecuted ===
                false &&
              candidate.templatePrepared ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "retains qualification activation runtime repository and external blocks",
      () => {
        const decision =
          createApprovedDecision();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          templatePreparedTransitionAuthorized:
            true,
          templatePreparedTransitionExecuted:
            false,
          templatePrepared:
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

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION",
        );
      },
    );

    it(
      "supports rejection while retaining every candidate pending",
      () => {
        const rejected =
          createEngineeringAIWorkforceTemplatePreparedTransitionDecision({
            lifecycleTransitionExecution:
              ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-template-prepared-transition-owner-rejection-test-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_TEMPLATES_PREPARATION_PENDING",
            reason:
              "Owner rejects the proposed template-prepared transition and retains all eight Engineering candidates at TEMPLATE_PREPARATION_PENDING without qualification, activation, runtime, repository, deployment, or external authority.",
            decidedAt:
              approvalTime,
          });

        expect(
          rejected.templatePreparedTransitionApproved,
        ).toBe(false);

        expect(
          rejected.candidateTransitionEligibility.every(
            (candidate) =>
              candidate.templatePreparedTransitionAuthorized ===
                false &&
              candidate.templatePreparedTransitionExecuted ===
                false &&
              candidate.templatePrepared ===
                false,
          ),
        ).toBe(true);

        expect(
          rejected.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_TEMPLATES_PREPARATION_PENDING",
        );
      },
    );

    it(
      "fails closed when the decision predates source execution",
      () => {
        expect(() =>
          createEngineeringAIWorkforceTemplatePreparedTransitionDecision({
            lifecycleTransitionExecution:
              ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-template-prepared-transition-too-early-test-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION",
            reason:
              "This intentionally invalid test decision attempts to precede the exact source lifecycle-transition execution and must fail closed.",
            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
                    .executedAt,
                ) - 1,
              ).toISOString(),
          }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified evidence",
      () => {
        const first =
          createApprovedDecision();

        const second =
          createApprovedDecision();

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
            first.candidateTransitionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplatePreparedTransitionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
