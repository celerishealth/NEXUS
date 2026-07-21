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
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../engineeringAIWorkforceTemplatePreparationPlan";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION,
} from "../engineeringAIWorkforceTemplatePreparationPlanApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "../revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  createEngineeringAIWorkforceSkillToolRegistryExpansionPreparation,
  validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionPreparation";

describe(
  "Engineering AI Workforce skill/tool registry-expansion preparation",
  () => {
    it(
      "prepares exactly eight Engineering skills and eight draft-only tools",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.proposedSkills,
        ).toHaveLength(8);

        expect(
          preparation.proposedTools,
        ).toHaveLength(8);

        expect(
          preparation.targetCombinedSkillCount,
        ).toBe(
          CORE_WORKFORCE_SKILLS.length +
            9 +
            8,
        );

        expect(
          preparation.targetCombinedToolCount,
        ).toBe(
          CORE_WORKFORCE_TOOLS.length +
            9 +
            8,
        );
      },
    );

    it(
      "matches every approved Engineering capability blueprint exactly",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.proposedSkills,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
            (blueprint) =>
              blueprint.proposedSkill,
          ),
        );

        expect(
          preparation.proposedTools,
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
            (blueprint) =>
              blueprint.proposedTool,
          ),
        );
      },
    );

    it(
      "binds preparation to the exact Engineering owner approval source plan and Revenue Growth reservation",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.sourceApprovalDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          preparation.sourceApprovalDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          preparation.sourcePlanningDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );

        expect(
          preparation.sourceRevenueGrowthPreparationDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .preparationDigest,
        );
      },
    );

    it(
      "validates a combined collision-free preview without mutating core or Revenue Growth evidence",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        const revenue =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        const preview =
          createSkillToolRegistry({
            skills: [
              ...CORE_WORKFORCE_SKILLS,
              ...revenue.proposedSkills,
              ...preparation.proposedSkills,
            ],
            tools: [
              ...CORE_WORKFORCE_TOOLS,
              ...revenue.proposedTools,
              ...preparation.proposedTools,
            ],
            createdAt:
              preparation.preparedAt,
          });

        expect(
          preview.registryDigest,
        ).toBe(
          preparation.previewRegistryDigest,
        );

        expect(
          preparation.collisionCheck,
        ).toEqual({
          coreSkillCollisionCount:
            0,
          coreToolCollisionCount:
            0,
          revenueGrowthSkillCollisionCount:
            0,
          revenueGrowthToolCollisionCount:
            0,
          proposedSkillDuplicateCount:
            0,
          proposedToolDuplicateCount:
            0,
          safeForRegistryDecisionReview:
            true,
        });

        expect(
          CORE_WORKFORCE_SKILLS,
        ).toHaveLength(9);

        expect(
          CORE_WORKFORCE_TOOLS,
        ).toHaveLength(7);

        expect(
          revenue.proposedSkills,
        ).toHaveLength(9);

        expect(
          revenue.proposedTools,
        ).toHaveLength(9);
      },
    );

    it(
      "keeps every proposed Engineering tool tenant-scoped audited non-external and draft-only",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .proposedTools.every(
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
      "retains registry template qualification activation repository deployment and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          preparationOnly:
            true,
          sourceOwnerApprovalBound:
            true,
          sourceRevenueGrowthReservationBound:
            true,
          combinedRegistryPreviewValidationCompleted:
            true,
          skillRegistryMutationAuthorized:
            false,
          toolRegistryMutationAuthorized:
            false,
          coreRegistryMutationPerformed:
            false,
          revenueGrowthReservationMutationPerformed:
            false,
          proposedDefinitionsActivated:
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
      "creates deterministic immutable owner-decision-gated preparation evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        const second =
          createEngineeringAIWorkforceSkillToolRegistryExpansionPreparation({
            preparationId:
              first.preparationId,
            preparedAt:
              first.preparedAt,
          });

        expect(second).toEqual(first);

        expect(
          first.preparationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.proposedSkills,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.proposedTools,
          ),
        ).toBe(true);

        expect(
          first.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_DECISION",
        );

        expect(() =>
          validateEngineeringAIWorkforceSkillToolRegistryExpansionPreparation(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
