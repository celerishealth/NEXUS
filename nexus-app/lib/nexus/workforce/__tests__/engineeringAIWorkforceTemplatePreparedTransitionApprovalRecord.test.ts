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
  validateEngineeringAIWorkforceTemplatePreparedTransitionDecision,
} from "../engineeringAIWorkforceTemplatePreparedTransitionDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceTemplatePreparedTransitionApprovalRecord";

describe(
  "Engineering AI Workforce template-prepared transition approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-template-prepared-transition-approval-record-v1",
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
      "binds approval to the exact pending-transition execution",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION;

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

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
              .executedAt,
          ),
        );
      },
    );

    it(
      "authorizes exactly eight TEMPLATE_PREPARED transitions without executing them",
      () => {
        const candidates =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION
            .candidateTransitionEligibility;

        expect(candidates).toHaveLength(8);

        expect(
          candidates.map(
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
          candidates.every(
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
      "does not execute the transition inside the approval record",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          templatePreparedTransitionAuthorized:
            true,
          templatePreparedTransitionExecuted:
            false,
          templatePrepared:
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
      "retains qualification activation runtime repository and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
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
      "records immutable digest-verified approval evidence",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(decision),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.candidateTransitionEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplatePreparedTransitionDecision(
            decision,
          ),
        ).not.toThrow();
      },
    );
  },
);
