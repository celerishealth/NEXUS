import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
} from "../engineeringAIWorkforceTemplateCreationExecution";

import {
  validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionDecision";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionApprovalRecord";

describe(
  "Engineering AI Workforce Factory lifecycle-transition approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-factory-lifecycle-transition-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION",
        );

        expect(
          decision.lifecycleTransitionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact completed template-creation evidence",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.sourceTemplateCreationExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceTemplateCreationExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
            .executionDigest,
        );

        expect(
          decision.sourceTemplateRegistryDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
            .templateRegistryDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
              .executedAt,
          ),
        );
      },
    );

    it(
      "authorizes exactly eight first-step transitions without executing them",
      () => {
        const candidates =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION
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
                "PLANNED_CANDIDATE" &&
              candidate.targetLifecycleState ===
                "TEMPLATE_PREPARATION_PENDING" &&
              candidate.lifecycleTransitionAuthorized ===
                true &&
              candidate.lifecycleTransitionExecuted ===
                false &&
              candidate.templatePrepared ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not authorize a direct TEMPLATE_PREPARED transition",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.authorityBoundary
            .directTemplatePreparedTransitionAuthorized,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .targetLifecycleStateLocked,
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION",
        );
      },
    );

    it(
      "retains qualification activation runtime repository and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          lifecycleTransitionAuthorized:
            true,
          lifecycleTransitionExecuted:
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
      },
    );

    it(
      "preserves immutable digest-verified approval evidence",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

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
          validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
            decision,
          ),
        ).not.toThrow();
      },
    );
  },
);
