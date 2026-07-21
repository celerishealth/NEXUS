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
  REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS,
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../revenueGrowthWorkforceTemplatePreparationPlan";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION,
} from "../revenueGrowthWorkforceTemplatePreparationPlanApprovalRecord";

import {
  REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
  createRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
  validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation,
} from "../revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

describe(
  "Revenue Growth Workforce skill/tool registry-expansion preparation",
  () => {
    it(
      "prepares exactly nine skills and nine draft-only tools",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.proposedSkills,
        ).toHaveLength(9);

        expect(
          preparation.proposedTools,
        ).toHaveLength(9);

        expect(
          preparation.targetSkillCount,
        ).toBe(
          CORE_WORKFORCE_SKILLS.length +
            9,
        );

        expect(
          preparation.targetToolCount,
        ).toBe(
          CORE_WORKFORCE_TOOLS.length +
            9,
        );
      },
    );

    it(
      "matches every approved capability blueprint exactly",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.proposedSkills.map(
            (skill) =>
              skill.skillId,
          ),
        ).toEqual(
          REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
            (blueprint) =>
              blueprint.proposedSkill.skillId,
          ),
        );

        expect(
          preparation.proposedTools.map(
            (tool) =>
              tool.toolId,
          ),
        ).toEqual(
          REVENUE_GROWTH_TEMPLATE_CAPABILITY_BLUEPRINTS.map(
            (blueprint) =>
              blueprint.proposedTool.toolId,
          ),
        );
      },
    );

    it(
      "binds preparation to the exact owner approval and source plan",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.sourceApprovalDecisionId,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          preparation.sourceApprovalDecisionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          preparation.sourcePlanningDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .planningDigest,
        );
      },
    );

    it(
      "validates a collision-free preview without mutating the core registry",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        const preview =
          createSkillToolRegistry({
            skills: [
              ...CORE_WORKFORCE_SKILLS,
              ...preparation.proposedSkills,
            ],
            tools: [
              ...CORE_WORKFORCE_TOOLS,
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
          existingSkillCollisionCount:
            0,
          existingToolCollisionCount:
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
      },
    );

    it(
      "keeps every proposed tool tenant-scoped audited non-external and draft-only",
      () => {
        const preparation =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          preparation.proposedTools.every(
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
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "retains all mutation template qualification activation runtime and external blocks",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          preparationOnly:
            true,
          sourceOwnerApprovalBound:
            true,
          registryPreviewValidationCompleted:
            true,
          skillRegistryMutationAuthorized:
            false,
          toolRegistryMutationAuthorized:
            false,
          coreRegistryMutationPerformed:
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
          liveSocialPostingAuthorized:
            false,
          paidAdvertisingSpendAuthorized:
            false,
          customerMessagingAuthorized:
            false,
          productionExecutionAuthorized:
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
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        const second =
          createRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation({
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
          first.nextStep,
        ).toBe(
          "AWAIT_OWNER_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_DECISION",
        );

        expect(() =>
          validateRevenueGrowthWorkforceSkillToolRegistryExpansionPreparation(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
