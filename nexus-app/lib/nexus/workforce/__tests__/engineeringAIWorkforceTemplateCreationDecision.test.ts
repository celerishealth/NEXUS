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
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionExecution";

import {
  createEngineeringAIWorkforceTemplateCreationDecision,
  validateEngineeringAIWorkforceTemplateCreationDecision,
} from "../engineeringAIWorkforceTemplateCreationDecision";

const approvedDecision =
  createEngineeringAIWorkforceTemplateCreationDecision({
    templatePreparationPlan:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
    registryExpansionExecution:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
    decisionId:
      "engineering-ai-workforce-template-creation-owner-decision-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION",
    reason:
      "Owner approves only the bounded creation of exactly eight Engineering AI employee templates while retaining all lifecycle, qualification, activation, repository, deployment, customer, external, payment, legal, autonomous, and public-launch restrictions.",
    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .executedAt,
        ) + 1000,
      ).toISOString(),
  });

describe(
  "Engineering AI Workforce template-creation decision",
  () => {
    it(
      "authorizes bounded creation of exactly eight templates",
      () => {
        expect(
          approvedDecision.templateCreationApproved,
        ).toBe(true);

        expect(
          approvedDecision.templateCreationExecutionAuthorized,
        ).toBe(true);

        expect(
          approvedDecision.candidateTemplateCreationEligibility,
        ).toHaveLength(8);

        expect(
          approvedDecision.candidateTemplateCreationEligibility.every(
            (candidate) =>
              candidate.templateCreationAuthorized ===
                true &&
              candidate.templateCreated ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "supports rejection without template-creation authority",
      () => {
        const rejected =
          createEngineeringAIWorkforceTemplateCreationDecision({
            templatePreparationPlan:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
            registryExpansionExecution:
              ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-template-creation-owner-decision-rejected-001",
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "REJECT_AND_RETAIN_ENGINEERING_TEMPLATE_CREATION_BLOCKED",
            reason:
              "Owner rejects Engineering template creation and retains every template, lifecycle, qualification, activation, repository, deployment, external, payment, legal, and launch boundary.",
            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
                    .executedAt,
                ) + 1000,
              ).toISOString(),
          });

        expect(
          rejected.templateCreationApproved,
        ).toBe(false);

        expect(
          rejected.templateCreationExecutionAuthorized,
        ).toBe(false);

        expect(
          rejected.candidateTemplateCreationEligibility.every(
            (candidate) =>
              candidate.templateCreationAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          rejected.nextStep,
        ).toBe(
          "RETAIN_ENGINEERING_TEMPLATE_CREATION_BLOCKED",
        );
      },
    );

    it(
      "binds to the exact plan registry execution and expanded registry",
      () => {
        expect(
          approvedDecision.sourcePlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );

        expect(
          approvedDecision.sourceRegistryExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .executionDigest,
        );

        expect(
          approvedDecision.sourceExpandedRegistryDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .expandedRegistryDigest,
        );

        expect(
          approvedDecision.reviewedEvidence
            .registryRequirementsSatisfied,
        ).toBe(true);
      },
    );

    it(
      "fails closed for an invalid owner identity",
      () => {
        expect(() =>
          createEngineeringAIWorkforceTemplateCreationDecision({
            templatePreparationPlan:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
            registryExpansionExecution:
              ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
            decisionId:
              "engineering-ai-workforce-template-creation-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION",
            reason:
              "Invalid owner identity must never authorize Engineering AI employee template creation or any downstream authority.",
            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
                    .executedAt,
                ) + 1000,
              ).toISOString(),
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "does not create templates or mutate the template registry",
      () => {
        expect(
          approvedDecision.authorityBoundary,
        ).toMatchObject({
          templateCreationExecutionAuthorized:
            true,
          templateCreationPerformed:
            false,
          employeeTemplateRegistryMutationPerformed:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
        });

        expect(
          approvedDecision.candidateTemplateCreationEligibility.every(
            (candidate) =>
              candidate.templateCreated ===
                false &&
              candidate.factoryLifecycleTransitionExecuted ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "retains qualification activation repository deployment and external blocks",
      () => {
        expect(
          approvedDecision.authorityBoundary,
        ).toMatchObject({
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
        const second =
          createEngineeringAIWorkforceTemplateCreationDecision({
            templatePreparationPlan:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
            registryExpansionExecution:
              ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
            decisionId:
              approvedDecision.decisionId,
            ownerId:
              ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              approvedDecision.decision,
            reason:
              approvedDecision.reason,
            decidedAt:
              approvedDecision.decidedAt,
          });

        expect(second).toEqual(
          approvedDecision,
        );

        expect(
          approvedDecision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(
            approvedDecision,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            approvedDecision.candidateTemplateCreationEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplateCreationDecision(
            approvedDecision,
          ),
        ).not.toThrow();

        expect(
          approvedDecision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION",
        );
      },
    );
  },
);
