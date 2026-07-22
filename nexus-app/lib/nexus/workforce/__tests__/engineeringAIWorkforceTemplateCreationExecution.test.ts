import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION,
} from "../engineeringAIWorkforceTemplateCreationApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../engineeringAIWorkforceTemplatePreparationPlan";

import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionExecution";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION_VERSION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,
  createEngineeringAIWorkforceTemplateCreationExecution,
  validateEngineeringAIWorkforceTemplateCreationExecution,
} from "../engineeringAIWorkforceTemplateCreationExecution";

describe(
  "Engineering AI Workforce template-creation execution",
  () => {
    it(
      "creates exactly eight approved Engineering employee templates",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-template-creation-execution-v1",
        );

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
            .createdTemplateCount,
        ).toBe(8);

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
            .templates.map(
              (template) =>
                template.publicName,
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
      },
    );

    it(
      "preserves the exact planned identities and launch sequences",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
            .templates.map(
              (template) => ({
                templateId:
                  template.templateId,
                employeeId:
                  template.employeeId,
                employeeCode:
                  template.employeeCode,
                launchSequence:
                  template.launchSequence,
              }),
            ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .proposedTemplates.map(
              (candidate) => ({
                templateId:
                  candidate.templateId,
                employeeId:
                  candidate.employeeId,
                employeeCode:
                  candidate.employeeCode,
                launchSequence:
                  candidate.proposedLaunchSequence,
              }),
            ),
        );
      },
    );

    it(
      "binds every template to the expanded skill and draft-only tool registry",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION;

        expect(
          execution.sourceExpandedRegistryDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY
            .registryDigest,
        );

        expect(
          execution.templateRegistry
            .skillToolRegistryDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY
            .registryDigest,
        );

        expect(
          execution.templateRegistry
            .templates.every(
              (template) =>
                template.manifest.skills.length ===
                  2 &&
                template.manifest.skills.some(
                  (skill) =>
                    skill.skillId ===
                    "skill-owner-escalation",
                ) &&
                template.manifest.toolGrants.length ===
                  1 &&
                template.manifest.toolGrants[0]
                  ?.mode ===
                  "DRAFT_ONLY",
            ),
        ).toBe(true);
      },
    );

    it(
      "keeps every Engineering template unqualified and activation-blocked",
      () => {
        const registry =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY;

        expect(
          registry.qualifiedTemplateCount,
        ).toBe(0);

        expect(
          registry.activationEligibleTemplateCount,
        ).toBe(0);

        expect(
          registry.templates.every(
            (template) =>
              template.status ===
                "REGISTERED_UNQUALIFIED" &&
              template.controlledActivationEligible ===
                false &&
              template.manifest.evaluation
                .status ===
                "UNQUALIFIED" &&
              template.manifest.evaluation
                .testCasesPassed ===
                0 &&
              template.manifest.evaluation
                .testCasesRequired ===
                100,
          ),
        ).toBe(true);
      },
    );

    it(
      "retains factory qualification runtime repository deployment and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION
            .authorityBoundary,
        ).toMatchObject({
          templateCreationExecuted:
            true,
          employeeTemplateRegistryMutationPerformed:
            true,
          factoryLifecycleTransitionAuthorized:
            false,
          factoryLifecycleTransitionPerformed:
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
      "fails closed when execution predates owner approval",
      () => {
        expect(() =>
          createEngineeringAIWorkforceTemplateCreationExecution({
            executionId:
              "engineering-ai-workforce-template-creation-too-early-001",
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION,
            executedAt:
              "2026-07-22T17:30:05.182Z",
          }),
        ).toThrow(
          "cannot precede owner approval",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_EXECUTION;

        const second =
          createEngineeringAIWorkforceTemplateCreationExecution({
            executionId:
              execution.executionId,
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_CREATION_APPROVAL_DECISION,
            executedAt:
              execution.executedAt,
          });

        expect(second).toEqual(
          execution,
        );

        expect(
          execution.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          execution.templateRegistryDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(execution),
        ).toBe(true);

        expect(
          Object.isFrozen(
            execution.createdTemplates,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            execution.templateRegistry,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplateCreationExecution(
            execution,
          ),
        ).not.toThrow();

        expect(
          execution.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_FACTORY_LIFECYCLE_TRANSITION_DECISION",
        );
      },
    );
  },
);
