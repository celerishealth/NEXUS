import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION,
} from "../engineeringAIWorkforceDevelopmentPlanApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITIES,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
  createEngineeringAIWorkforceTemplatePreparationPlan,
  validateEngineeringAIWorkforceTemplatePreparationPlan,
} from "../engineeringAIWorkforceTemplatePreparationPlan";

import {
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
} from "../revenueGrowthWorkforceTemplatePreparationPlan";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
} from "../skillToolRegistry";

describe(
  "Engineering AI Workforce template-preparation plan",
  () => {
    it(
      "plans exactly eight approval-bound Engineering templates",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.proposedTemplateCount,
        ).toBe(8);

        expect(
          plan.proposedTemplates,
        ).toHaveLength(8);

        expect(
          plan.sourceApprovalDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          plan.sourceApprovalDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          plan.proposedTemplates.map(
            (entry) =>
              entry.publicName,
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
      "reserves non-colliding launch sequences fifteen through twenty-two",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.sourceRegisteredTemplateLaunchSequences,
        ).toEqual([
          3,
          4,
          5,
        ]);

        expect(
          plan.sourceReservedRevenueGrowthLaunchSequences,
        ).toEqual([
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
        ]);

        expect(
          plan.proposedLaunchSequences,
        ).toEqual([
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
        ]);

        expect(
          new Set([
            ...plan.sourceRegisteredTemplateLaunchSequences,
            ...plan.sourceReservedRevenueGrowthLaunchSequences,
            ...plan.proposedLaunchSequences,
          ]).size,
        ).toBe(20);
      },
    );

    it(
      "maps every Engineering specialist to one missing role skill and one safe draft-only tool",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.proposedTemplates.map(
            (entry) =>
              entry.capability,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_CAPABILITIES,
        );

        expect(
          plan.proposedSkillRegistryExpansion,
        ).toHaveLength(8);

        expect(
          plan.proposedToolRegistryExpansion,
        ).toHaveLength(8);

        expect(
          plan.proposedToolRegistryExpansion.every(
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
      "avoids core and Revenue Growth registry collisions",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        const occupiedSkillIds =
          new Set([
            ...CORE_WORKFORCE_SKILLS.map(
              (skill) =>
                skill.skillId,
            ),
            ...REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
              .proposedSkillRegistryExpansion.map(
                (skill) =>
                  skill.skillId,
              ),
          ]);

        const occupiedToolIds =
          new Set([
            ...CORE_WORKFORCE_TOOLS.map(
              (tool) =>
                tool.toolId,
            ),
            ...REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
              .proposedToolRegistryExpansion.map(
                (tool) =>
                  tool.toolId,
              ),
          ]);

        expect(
          plan.proposedSkillRegistryExpansion.every(
            (skill) =>
              !occupiedSkillIds.has(
                skill.skillId,
              ),
          ),
        ).toBe(true);

        expect(
          plan.proposedToolRegistryExpansion.every(
            (tool) =>
              !occupiedToolIds.has(
                tool.toolId,
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps all candidates planned and downstream Engineering authority blocked",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.proposedTemplates.every(
            (entry) =>
              entry.sourceLifecycleState ===
                "PLANNED_CANDIDATE" &&
              entry.plannedTargetLifecycleState ===
                "TEMPLATE_PREPARATION_PENDING" &&
              entry.templatePreparationAuthorized ===
                false &&
              entry.templateCreated ===
                false &&
              entry.lifecycleTransitionExecuted ===
                false &&
              entry.qualificationAdmissionAuthorized ===
                false &&
              entry.qualificationExecutionAuthorized ===
                false &&
              entry.activationAuthorized ===
                false &&
              entry.runtimeAuthorized ===
                false &&
              entry.repositoryReadAuthorized ===
                false &&
              entry.repositoryWriteAuthorized ===
                false &&
              entry.mergeAuthorized ===
                false &&
              entry.productionDeploymentAuthorized ===
                false &&
              entry.secretsAccessAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          plan.authorityBoundary,
        ).toMatchObject({
          planningOnly:
            true,
          sourceOwnerApprovalBound:
            true,
          skillRegistryMutationAuthorized:
            false,
          toolRegistryMutationAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          templateCreationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
          qualificationExecutionAuthorized:
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
      "preserves founder authority and transparent human-like specialist behavior",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.founderLiberationObjective,
        ).toEqual({
          routineEngineeringTemplateFoundationTarget:
            true,
          founderReleaseAchieved:
            false,
          ownerRetainsFinalProductAuthority:
            true,
          ownerRetainsMergeAuthority:
            true,
          ownerRetainsProductionDeploymentAuthority:
            true,
        });

        expect(
          plan.humanLikeEmployeeStandard,
        ).toEqual({
          naturalProfessionalCommunicationRequired:
            true,
          contextAwarenessRequired:
            true,
          proactiveSpecialistWorkRequired:
            true,
          transparentAIIdentityRequired:
            true,
          humanImpersonationAuthorized:
            false,
          fabricatedHumanExperienceAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable owner-decision-gated planning evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        const second =
          createEngineeringAIWorkforceTemplatePreparationPlan({
            planningId:
              first.planningId,
            preparedAt:
              first.preparedAt,
          });

        expect(second).toEqual(first);

        expect(
          first.planningDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.proposedTemplates,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.proposedSkillRegistryExpansion,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.proposedToolRegistryExpansion,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceTemplatePreparationPlan(
            first,
          ),
        ).not.toThrow();

        expect(
          first.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_TEMPLATE_PREPARATION_PLAN_DECISION",
        );
      },
    );
  },
);
