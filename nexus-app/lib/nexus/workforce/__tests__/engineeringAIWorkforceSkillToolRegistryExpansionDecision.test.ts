import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionPreparation";

import {
  createEngineeringAIWorkforceSkillToolRegistryExpansionDecision,
  validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionDecision";

const decidedAt =
  new Date(
    Date.parse(
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION
        .preparedAt,
    ) + 1000,
  ).toISOString();

function createDecision(
  decision:
    | "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION"
    | "REJECT_AND_RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
) {
  return createEngineeringAIWorkforceSkillToolRegistryExpansionDecision({
    registryExpansionPreparation:
      ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
    decisionId:
      "engineering-skill-tool-registry-expansion-decision-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision,
    reason:
      "Owner reviewed the exact Engineering combined collision-free registry-expansion preparation evidence and recorded a bounded decision.",
    decidedAt,
  });
}

describe(
  "Engineering AI Workforce skill/tool registry-expansion decision",
  () => {
    it(
      "approves bounded registry mutation for exactly eight skill-tool pairs",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        expect(
          decision.registryExpansionApproved,
        ).toBe(true);

        expect(
          decision.registryMutationExecutionAuthorized,
        ).toBe(true);

        expect(
          decision.definitionMutationEligibility,
        ).toHaveLength(8);

        expect(
          decision.definitionMutationEligibility.every(
            (definition) =>
              definition.skillRegistryMutationAuthorized ===
                true &&
              definition.toolRegistryMutationAuthorized ===
                true &&
              definition.registryMutationPerformed ===
                false &&
              definition.definitionActivated ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );

    it(
      "rejects without authorizing registry mutation",
      () => {
        const decision =
          createDecision(
            "REJECT_AND_RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
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
          "RETAIN_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION_ONLY",
        );
      },
    );

    it(
      "binds the decision to the exact Engineering preparation combined preview and Revenue Growth reservation",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        const source =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

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
          decision.sourceRevenueGrowthPreparationId,
        ).toBe(
          source.sourceRevenueGrowthPreparationId,
        );

        expect(
          decision.sourceRevenueGrowthPreparationDigest,
        ).toBe(
          source.sourceRevenueGrowthPreparationDigest,
        );

        expect(
          decision.reviewedPreparation.proposedEngineeringSkillCount,
        ).toBe(8);

        expect(
          decision.reviewedPreparation.reservedRevenueGrowthSkillCount,
        ).toBe(9);
      },
    );

    it(
      "fails closed for an invalid owner identity",
      () => {
        expect(() =>
          createEngineeringAIWorkforceSkillToolRegistryExpansionDecision({
            registryExpansionPreparation:
              ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION,
            decisionId:
              "engineering-registry-expansion-invalid-owner-001",
            ownerId:
              "owner-invalid-001" as unknown as
                typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            decision:
              "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
            reason:
              "An invalid owner identity must never authorize Engineering registry mutation.",
            decidedAt,
          }),
        ).toThrow(
          "Only the verified NEXUS owner",
        );
      },
    );

    it(
      "does not perform mutation or authorize templates qualification activation repository deployment or external action",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
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
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
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
      "keeps every definition blocked from templates runtime code and production authority",
      () => {
        const decision =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        expect(
          decision.definitionMutationEligibility.every(
            (definition) =>
              definition.registryMutationPerformed ===
                false &&
              definition.definitionActivated ===
                false &&
              definition.templatePreparationAuthorized ===
                false &&
              definition.templateCreationAuthorized ===
                false &&
              definition.factoryLifecycleTransitionAuthorized ===
                false &&
              definition.qualificationAdmissionAuthorized ===
                false &&
              definition.qualificationExecutionAuthorized ===
                false &&
              definition.activationAuthorized ===
                false &&
              definition.runtimeAuthorized ===
                false &&
              definition.repositoryReadAuthorized ===
                false &&
              definition.repositoryWriteAuthorized ===
                false &&
              definition.branchCreationAuthorized ===
                false &&
              definition.pullRequestPreparationAuthorized ===
                false &&
              definition.mergeAuthorized ===
                false &&
              definition.productionDeploymentAuthorized ===
                false &&
              definition.secretsAccessAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "creates deterministic immutable digest-verified Engineering decision evidence",
      () => {
        const first =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
          );

        const second =
          createDecision(
            "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
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
          validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
