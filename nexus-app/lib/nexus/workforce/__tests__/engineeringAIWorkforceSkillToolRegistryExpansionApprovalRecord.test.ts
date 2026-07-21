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
  validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionDecision";

import {
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceSkillToolRegistryExpansionApprovalRecord";

describe(
  "Engineering AI Workforce skill/tool registry-expansion approval record",
  () => {
    it(
      "records the explicit verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-skill-tool-registry-expansion-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION",
        );

        expect(
          decision.registryExpansionApproved,
        ).toBe(true);

        expect(
          decision.registryMutationExecutionAuthorized,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact immutable preparation and combined preview",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION;

        const preparation =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_PREPARATION;

        expect(
          decision.sourcePreparationId,
        ).toBe(
          preparation.preparationId,
        );

        expect(
          decision.sourcePreparationDigest,
        ).toBe(
          preparation.preparationDigest,
        );

        expect(
          decision.sourcePreviewRegistryDigest,
        ).toBe(
          preparation.previewRegistryDigest,
        );

        expect(
          decision.sourceRevenueGrowthPreparationId,
        ).toBe(
          preparation.sourceRevenueGrowthPreparationId,
        );

        expect(
          decision.sourceRevenueGrowthPreparationDigest,
        ).toBe(
          preparation.sourceRevenueGrowthPreparationDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            preparation.preparedAt,
          ),
        );
      },
    );

    it(
      "authorizes exactly eight bounded definition mutations without performing them",
      () => {
        const definitions =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
            .definitionMutationEligibility;

        expect(definitions).toHaveLength(8);

        expect(
          definitions.every(
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
      },
    );

    it(
      "preserves the combined core Revenue Growth and Engineering counts",
      () => {
        const reviewed =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
            .reviewedPreparation;

        expect(
          reviewed.reservedRevenueGrowthSkillCount,
        ).toBe(9);

        expect(
          reviewed.reservedRevenueGrowthToolCount,
        ).toBe(9);

        expect(
          reviewed.proposedEngineeringSkillCount,
        ).toBe(8);

        expect(
          reviewed.proposedEngineeringToolCount,
        ).toBe(8);

        expect(
          reviewed.targetCombinedSkillCount,
        ).toBe(
          reviewed.currentCoreSkillCount +
            9 +
            8,
        );

        expect(
          reviewed.targetCombinedToolCount,
        ).toBe(
          reviewed.currentCoreToolCount +
            9 +
            8,
        );

        expect(
          reviewed.safeForRegistryDecisionReview,
        ).toBe(true);
      },
    );

    it(
      "retains template qualification activation repository deployment and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          ownerDecisionRecorded:
            true,
          ownerIdentityBound:
            true,
          sourcePreparationBound:
            true,
          sourceRevenueGrowthReservationBound:
            true,
          approvalBypassAllowed:
            false,
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
      "keeps every definition blocked from templates runtime code and production authority",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION
            .definitionMutationEligibility.every(
              (definition) =>
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
      "records immutable digest-verified evidence and advances only to bounded application",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_SKILL_TOOL_REGISTRY_EXPANSION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(
            decision,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.definitionMutationEligibility,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceSkillToolRegistryExpansionDecision(
            decision,
          ),
        ).not.toThrow();

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_SKILL_TOOL_REGISTRY_EXPANSION",
        );
      },
    );
  },
);
