import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "../aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
} from "../engineeringAIWorkforceDevelopmentPlan";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
} from "../engineeringAIWorkforceTemplateCreationExecution";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION,
  createEngineeringAIWorkforceFactoryLifecycleTransitionDecision,
  validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionDecision";

const DECIDED_AT =
  new Date(
    Date.parse(
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
        .executedAt,
    ) + 1000,
  ).toISOString();

function createApproval() {
  return createEngineeringAIWorkforceFactoryLifecycleTransitionDecision({
    developmentPlan:
      ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
    templateCreationExecution:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-factory-lifecycle-transition-decision-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION",
    reason:
      "Owner approves only the first sequential Factory lifecycle transition for exactly eight Engineering AI candidates from PLANNED_CANDIDATE to TEMPLATE_PREPARATION_PENDING while retaining qualification, activation, runtime, repository, deployment, customer, financial, legal, autonomous, and public-launch restrictions.",
    decidedAt:
      DECIDED_AT,
  });
}

describe(
  "Engineering AI Workforce Factory lifecycle-transition decision",
  () => {
    it(
      "authorizes exactly eight first-step lifecycle transitions",
      () => {
        const decision =
          createApproval();

        expect(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_DECISION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-factory-lifecycle-transition-decision-v1",
        );

        expect(
          decision.lifecycleTransitionApproved,
        ).toBe(true);

        expect(
          decision.candidateTransitionEligibility,
        ).toHaveLength(8);

        expect(
          decision.candidateTransitionEligibility.every(
            (candidate) =>
              candidate.sourceLifecycleState ===
                "PLANNED_CANDIDATE" &&
              candidate.targetLifecycleState ===
                "TEMPLATE_PREPARATION_PENDING" &&
              candidate.lifecycleTransitionAuthorized ===
                true &&
              candidate.lifecycleTransitionExecuted ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "uses only the allowed sequential Factory lifecycle transition",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .PLANNED_CANDIDATE,
        ).toContain(
          "TEMPLATE_PREPARATION_PENDING",
        );

        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .PLANNED_CANDIDATE,
        ).not.toContain(
          "TEMPLATE_PREPARED",
        );

        expect(
          createApproval().authorityBoundary
            .directTemplatePreparedTransitionAuthorized,
        ).toBe(false);
      },
    );

    it(
      "binds each Factory record to the exact created template evidence",
      () => {
        const decision =
          createApproval();

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
          decision.candidateTransitionEligibility.map(
            (candidate) => ({
              employeeId:
                candidate.employeeId,
              factoryRecordId:
                candidate.factoryRecordId,
              templateId:
                candidate.templateId,
              templateDigest:
                candidate.templateDigest,
            }),
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .plannedCandidates.map(
              (
                candidate,
                index,
              ) => ({
                employeeId:
                  candidate.employeeId,
                factoryRecordId:
                  candidate.sourceFactoryRecordId,
                templateId:
                  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
                    .templateRegistry
                    .templates[index]
                    ?.templateId,
                templateDigest:
                  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
                    .templateRegistry
                    .templates[index]
                    ?.templateDigest,
              }),
            ),
        );
      },
    );

    it(
      "supports rejection without lifecycle-transition authority",
      () => {
        const decision =
          createEngineeringAIWorkforceFactoryLifecycleTransitionDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            templateCreationExecution:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-factory-lifecycle-transition-rejection-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED",
            reason:
              "Owner rejects the first Engineering Factory lifecycle transition and retains all eight candidates in the PLANNED_CANDIDATE state with qualification, activation, runtime, and external authority blocked.",
            decidedAt:
              DECIDED_AT,
          });

        expect(
          decision.lifecycleTransitionApproved,
        ).toBe(false);

        expect(
          decision.authorityBoundary
            .lifecycleTransitionAuthorized,
        ).toBe(false);

        expect(
          decision.candidateTransitionEligibility.every(
            (candidate) =>
              candidate.lifecycleTransitionAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_FACTORY_CANDIDATES_PLANNED",
        );
      },
    );

    it(
      "fails closed for an invalid owner identity",
      () => {
        expect(() =>
          createEngineeringAIWorkforceFactoryLifecycleTransitionDecision({
            developmentPlan:
              ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
            templateCreationExecution:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-factory-lifecycle-transition-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION",
            reason:
              "An invalid owner identity must never authorize an Engineering Factory lifecycle transition or any downstream employee authority.",
            decidedAt:
              DECIDED_AT,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "retains template-prepared qualification activation runtime and external blocks",
      () => {
        const decision =
          createApproval();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          lifecycleTransitionAuthorized:
            true,
          lifecycleTransitionExecuted:
            false,
          directTemplatePreparedTransitionAuthorized:
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
      "creates deterministic immutable digest-verified decision evidence",
      () => {
        const first =
          createApproval();

        const second =
          createApproval();

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
          validateEngineeringAIWorkforceFactoryLifecycleTransitionDecision(
            first,
          ),
        ).not.toThrow();

        expect(
          first.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION",
        );
      },
    );
  },
);
