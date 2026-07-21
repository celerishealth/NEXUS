import {
  describe,
  expect,
  it,
} from "vitest";

import {
  CORE_WORKFORCE_SKILLS,
  CORE_WORKFORCE_TOOLS,
} from "../skillToolRegistry";

import {
  REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION,
} from "../revenueGrowthWorkforceFactoryAdmissionExecution";

import {
  REVENUE_GROWTH_TEMPLATE_CAPABILITIES,
  REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN,
  createRevenueGrowthWorkforceTemplatePreparationPlan,
  validateRevenueGrowthWorkforceTemplatePreparationPlan,
} from "../revenueGrowthWorkforceTemplatePreparationPlan";

describe(
  "Revenue Growth Workforce template-preparation plan",
  () => {
    it(
      "plans exactly nine source-bound employee templates",
      () => {
        const plan =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.proposedTemplateCount,
        ).toBe(9);

        expect(
          plan.proposedTemplates,
        ).toHaveLength(9);

        expect(
          plan.sourceFactoryAdmissionExecutionDigest,
        ).toBe(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION
            .executionDigest,
        );

        expect(
          plan.proposedTemplates.map(
            (entry) =>
              entry.employeeId,
          ),
        ).toEqual(
          REVENUE_GROWTH_WORKFORCE_FACTORY_ADMISSION_EXECUTION
            .candidateRecords.map(
              (candidate) =>
                candidate.employeeId,
            ),
        );
      },
    );

    it(
      "reserves non-colliding launch sequences six through fourteen",
      () => {
        const plan =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.sourceRegisteredTemplateLaunchSequences,
        ).toEqual([
          3,
          4,
          5,
        ]);

        expect(
          plan.proposedLaunchSequences,
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
          new Set(
            plan.proposedLaunchSequences,
          ).size,
        ).toBe(9);
      },
    );

    it(
      "maps every specialist to one missing role skill and one missing draft tool",
      () => {
        const plan =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        expect(
          plan.proposedTemplates.map(
            (entry) =>
              entry.capability,
          ),
        ).toEqual(
          REVENUE_GROWTH_TEMPLATE_CAPABILITIES,
        );

        expect(
          plan.proposedSkillRegistryExpansion,
        ).toHaveLength(9);

        expect(
          plan.proposedToolRegistryExpansion,
        ).toHaveLength(9);

        const existingSkills =
          new Set<string>(
            CORE_WORKFORCE_SKILLS.map(
              (skill) =>
                skill.skillId,
            ),
          );

        const existingTools =
          new Set<string>(
            CORE_WORKFORCE_TOOLS.map(
              (tool) =>
                tool.toolId,
            ),
          );

        expect(
          plan.proposedSkillRegistryExpansion.every(
            (skill) =>
              !existingSkills.has(
                skill.skillId,
              ),
          ),
        ).toBe(true);

        expect(
          plan.proposedToolRegistryExpansion.every(
            (tool) =>
              !existingTools.has(
                tool.toolId,
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps all candidates planned and every downstream authority blocked",
      () => {
        const plan =
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

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
              entry.qualificationExecutionAuthorized ===
                false &&
              entry.activationAuthorized ===
                false &&
              entry.runtimeAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          plan.authorityBoundary,
        ).toMatchObject({
          planningOnly:
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
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "preserves human-like capability without human impersonation",
      () => {
        expect(
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN
            .humanLikeEmployeeStandard,
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
          REVENUE_GROWTH_WORKFORCE_TEMPLATE_PREPARATION_PLAN;

        const second =
          createRevenueGrowthWorkforceTemplatePreparationPlan({
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

        expect(() =>
          validateRevenueGrowthWorkforceTemplatePreparationPlan(
            first,
          ),
        ).not.toThrow();

        expect(
          first.nextStep,
        ).toBe(
          "AWAIT_OWNER_REVENUE_GROWTH_TEMPLATE_PREPARATION_PLAN_DECISION",
        );
      },
    );
  },
);
