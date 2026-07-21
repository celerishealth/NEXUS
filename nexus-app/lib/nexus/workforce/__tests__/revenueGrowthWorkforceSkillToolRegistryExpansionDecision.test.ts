import {
  describe,
  expect,
  it,
} from "vitest";

import {
  REVENUE_GROWTH_WORKFORCE_OWNER_ID,
} from "../revenueGrowthWorkforceExpansionDecision";

import {
  REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "../revenueGrowthWorkforceSkillToolRegistryExpansionPreparation";

import {
  createRevenueGrowthWorkforceSkillToolRegistryExpansionDecision,
  validateRevenueGrowthWorkforceSkillToolRegistryExpansionDecision,
} from "../revenueGrowthWorkforceSkillToolRegistryExpansionDecision";

const decidedAt =
  new Date(
    Date.parse(
      REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
        .preparedAt,
    ) + 1000,
  ).toISOString();

function createDecision(
  decision:
    | "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION"
    | "REJECT_AND_RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
) {
  return createRevenueGrowthWorkforceSkillToolRegistryExpansionDecision({
    registryExpansionPreparation:
      REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
    decisionId:
      "revenue-growth-skill-tool-registry-expansion-decision-test-001",
    ownerId:
      REVENUE_GROWTH_WORKFORCE_OWNER_ID,
    decision,
    reason:
      "Owner reviewed the exact collision-free registry-expansion preparation evidence and recorded a bounded decision.",
    decidedAt,
  });
}

describe(
  "Revenue Growth Workforce skill/tool registry-expansion decision",
  () => {
    it(
      "approves bounded registry mutation for exactly nine skill-tool pairs",
      () => {
        const decision =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        expect(
          decision.registryExpansionApproved,
        ).toBe(true);

        expect(
          decision.registryMutationExecutionAuthorized,
        ).toBe(true);

        expect(
          decision.definitionMutationEligibility,
        ).toHaveLength(9);

        expect(
          decision.definitionMutationEligibility.every(
            (definition) =>
              definition.skillRegistryMutationAuthorized ===
                true &&
              definition.toolRegistryMutationAuthorized ===
                true &&
              definition.registryMutationPerformed ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );

    it(
      "rejects without authorizing registry mutation",
      () => {
        const decision =
          createDecision(
            "REJECT_AND_RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
          );

        expect(
          decision.registryExpansionApproved,
        ).toBe(false);

        expect(
          decision.registryMutationExecutionAuthorized,
        ).toBe(false);

        expect(
          decision.definitionMutationEligibility.every(
            (definition) =>
              definition.skillRegistryMutationAuthorized ===
                false &&
              definition.toolRegistryMutationAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "RETAIN_REVENUE_GROWTH_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
        );
      },
    );

    it(
      "binds the decision to the exact preparation and preview digest",
      () => {
        const decision =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        const source =
          REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          decision.sourcePreparationId,
        ).toBe(
          source.preparationId,
        );

        expect(
          decision.sourcePreparationDigest,
        ).toBe(
          source.preparationDigest,
        );

        expect(
          decision.sourcePreviewRegistryDigest,
        ).toBe(
          source.previewRegistryDigest,
        );

        expect(
          decision.reviewedPreparation.proposedSkillCount,
        ).toBe(9);

        expect(
          decision.reviewedPreparation.proposedToolCount,
        ).toBe(9);
      },
    );

    it(
      "fails closed for an invalid owner identity",
      () => {
        expect(() =>
          createRevenueGrowthWorkforceSkillToolRegistryExpansionDecision({
            registryExpansionPreparation:
              REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
            decisionId:
              "revenue-growth-registry-expansion-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as unknown as
                typeof REVENUE_GROWTH_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
            reason:
              "An invalid owner identity must never authorize registry mutation.",
            decidedAt,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "does not perform mutation or authorize templates qualification activation runtime or external action",
      () => {
        const decision =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          skillRegistryMutationAuthorized:
            true,
          toolRegistryMutationAuthorized:
            true,
          registryMutationExecutionAuthorized:
            true,
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
          controlledWorkAuthorized:
            false,
          liveSocialPostingAuthorized:
            false,
          paidAdvertisingSpendAuthorized:
            false,
          customerMessagingAuthorized:
            false,
          externalDeliveryAuthorized:
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
      "creates deterministic immutable digest-verified decision evidence",
      () => {
        const first =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        const second =
          createDecision(
            "APPROVE_REVENUE_GROWTH_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

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
            first.definitionMutationEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateRevenueGrowthWorkforceSkillToolRegistryExpansionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
