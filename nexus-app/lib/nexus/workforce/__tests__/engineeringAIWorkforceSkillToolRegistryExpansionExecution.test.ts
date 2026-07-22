import {
  describe,
  expect,
  it,
} from "vitest";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
  createSkillToolRegistry,
} from "../skillToolRegistry";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "../revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY,
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION,
  createEngineeringAIWorkforceSkillToolRegistryExpansionExecution,
  validateEngineeringAIWorkforceSkillToolRegistryExpansionExecution,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionExecution";

describe(
  "Engineering AI Workforce skill/tool registry-expansion execution",
  () => {
    it(
      "applies exactly eight Engineering skills and eight Engineering tools",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

        expect(
          execution.appliedEngineeringSkillCount,
        ).toBe(8);

        expect(
          execution.appliedEngineeringToolCount,
        ).toBe(8);

        expect(
          execution.appliedSkills,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .proposedSkills,
        );

        expect(
          execution.appliedTools,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .proposedTools,
        );
      },
    );

    it(
      "creates the immutable expanded registry with core plus Engineering definitions only",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

        expect(
          execution.resultSkillCount,
        ).toBe(
          CORE_WORKFORCE_SKILLS.length +
            8,
        );

        expect(
          execution.resultToolCount,
        ).toBe(
          CORE_WORKFORCE_TOOLS.length +
            8,
        );

        expect(
          ENGINEERING_AI_WORKFORCE_EXPANDED_SKILL_TOOL_REGISTRY
            .registryDigest,
        ).toBe(
          execution.expandedRegistryDigest,
        );

        const expected =
          createSkillToolRegistry({
            skills: [
              ...CORE_WORKFORCE_SKILLS,
              ...execution.appliedSkills,
            ],
            tools: [
              ...CORE_WORKFORCE_TOOLS,
              ...execution.appliedTools,
            ],
            createdAt:
              execution.executedAt,
          });

        expect(
          execution.expandedRegistry,
        ).toEqual(expected);
      },
    );

    it(
      "binds execution to the exact immutable owner approval and preparation",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

        expect(
          execution.sourceDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          execution.sourcePreparationDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .preparationDigest,
        );

        expect(
          Date.parse(
            execution.executedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
              .decidedAt,
          ),
        );
      },
    );

    it(
      "preserves the Revenue Growth reservation without applying its definitions",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

        const revenue =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        const resultSkillIds =
          new Set(
            execution.expandedRegistry.skills.map(
              (skill) =>
                skill.skillId,
            ),
          );

        const resultToolIds =
          new Set(
            execution.expandedRegistry.tools.map(
              (tool) =>
                tool.toolId,
            ),
          );

        expect(
          revenue.proposedSkills.every(
            (skill) =>
              !resultSkillIds.has(
                skill.skillId,
              ),
          ),
        ).toBe(true);

        expect(
          revenue.proposedTools.every(
            (tool) =>
              !resultToolIds.has(
                tool.toolId,
              ),
          ),
        ).toBe(true);

        expect(
          execution.applicationEvidence,
        ).toMatchObject({
          revenueGrowthReservationPreserved:
            true,
          revenueGrowthDefinitionsApplied:
            false,
        });
      },
    );

    it(
      "keeps every applied Engineering tool draft-only audited tenant-scoped and non-external",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION
            .appliedTools.every(
              (tool) =>
                tool.risk ===
                  "MEDIUM" &&
                tool.allowedModes.length ===
                  1 &&
                tool.allowedModes[0] ===
                  "DRAFT_ONLY" &&
                tool.ownerApprovalRequired ===
                  false &&
                tool.externalEffect ===
                  false &&
                tool.tenantScoped ===
                  true &&
                tool.auditRequired ===
                  true &&
                tool.active ===
                  true,
            ),
        ).toBe(true);
      },
    );

    it(
      "executes registry application while retaining all downstream authority blocks",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

        expect(
          execution.applicationEvidence,
        ).toMatchObject({
          registryMutationExecuted:
            true,
          immutableExpandedRegistrySnapshotCreated:
            true,
          appendOnlyEngineeringDefinitionsApplied:
            true,
          coreRegistryPreserved:
            true,
          engineeringDefinitionsRegistered:
            true,
          templatePreparationEligibilityAchieved:
            true,
        });

        expect(
          execution.authorityBoundary,
        ).toMatchObject({
          boundedRegistryApplicationExecuted:
            true,
          sourceOwnerApprovalBound:
            true,
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
          realCustomerContactAuthorized:
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
      "creates deterministic immutable digest-verified execution evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_EXECUTION;

        const second =
          createEngineeringAIWorkforceSkillToolRegistryExpansionExecution({
            executionId:
              first.executionId,
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION,
            executedAt:
              first.executedAt,
          });

        expect(second).toEqual(first);

        expect(
          first.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          first.expandedRegistryDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.expandedRegistry,
          ),
        ).toBe(true);

        expect(
          CORE_WORKFORCE_SKILLS,
        ).toHaveLength(9);

        expect(
          CORE_WORKFORCE_TOOLS,
        ).toHaveLength(7);

        expect(() =>
          validateEngineeringAIWorkforceSkillToolRegistryExpansionExecution(
            first,
          ),
        ).not.toThrow();

        expect(
          first.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_CREATION_DECISION",
        );
      },
    );
  },
);
