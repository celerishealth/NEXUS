import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
} from "../engineeringAIWorkforceOwnerActivatedRuntimeIssuance";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_SCENARIOS,
  createEngineeringAIWorkforceControlledShadowOperationPreparation,
  validateEngineeringAIWorkforceControlledShadowOperationPreparation,
  type EngineeringAIWorkforceControlledShadowOperationPreparation,
} from "../engineeringAIWorkforceControlledShadowOperationPreparation";

function input() {
  return {
    preparationId:
      "engineering-controlled-shadow-preparation-test-001",

    ownerActivatedRuntimeIssuance:
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,

    preparedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .activatedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce controlled-shadow operation preparation",
  () => {
    it(
      "prepares exactly eight bounded controlled-shadow operations",
      () => {
        const preparation =
          createEngineeringAIWorkforceControlledShadowOperationPreparation(
            input(),
          );

        expect(
          preparation.preparationState,
        ).toBe(
          "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_PREPARED",
        );

        expect(
          preparation.candidatePreparations,
        ).toHaveLength(8);

        expect(
          preparation.candidatePreparations.every(
            (entry) =>
              entry.preparationState ===
                "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_PREPARED" &&
              entry.authorityBoundary
                .shadowExecutionEligible ===
                true &&
              entry.authorityBoundary
                .shadowExecutionExecuted ===
                false,
          ),
        ).toBe(true);
      },
      20_000,
    );

    it(
      "preserves exact Engineering identities and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .candidatePreparations
            .map(
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

        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .candidatePreparations
            .map(
              (entry) =>
                entry.developmentSequence,
            ),
        ).toEqual([
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
        ]);
      },
    );

    it(
      "prepares one role-specific synthetic scenario per specialist",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .candidatePreparations
            .map(
              (entry) =>
                entry.shadowFixture
                  .scenarioId,
            ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_SCENARIOS.map(
            (scenario) =>
              scenario.scenarioId,
          ),
        );

        expect(
          new Set(
            ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
              .candidatePreparations
              .map(
                (entry) =>
                  entry.shadowFixture
                    .scenarioId,
              ),
          ).size,
        ).toBe(8);
      },
    );

    it(
      "uses synthetic sanitized sandbox read-only and draft-only fixtures",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .candidatePreparations
            .every(
              (entry) =>
                entry.shadowFixture
                  .dataClassification ===
                  "SYNTHETIC_SANITIZED_ONLY" &&
                entry.shadowFixture
                  .executionMode ===
                  "SANDBOX_ONLY" &&
                entry.shadowFixture
                  .evidenceToolMode ===
                  "READ_ONLY" &&
                entry.shadowFixture
                  .draftToolMode ===
                  "DRAFT_ONLY" &&
                entry.shadowFixture
                  .maximumTaskCount ===
                  1 &&
                entry.shadowFixture
                  .ownerReviewRequired ===
                  true,
            ),
        ).toBe(true);
      },
    );

    it(
      "binds each preparation to the exact activated runtime",
      () => {
        ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
          .candidatePreparations
          .forEach(
            (
              entry,
              index,
            ) => {
              const source =
                ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
                  .candidateRuntimeIssuances[index];

              expect(
                entry.runtimeId,
              ).toBe(
                source?.runtimeId,
              );

              expect(
                entry.runtimeDigest,
              ).toBe(
                source
                  ?.ownerActivatedRuntimeDigest,
              );

              expect(
                entry.runtimeIssuanceDigest,
              ).toBe(
                source
                  ?.candidateRuntimeIssuanceDigest,
              );

              expect(
                entry.qualifiedManifestDigest,
              ).toBe(
                source
                  ?.qualifiedManifestDigest,
              );
            },
          );
      },
    );

    it(
      "prepares but does not execute or create any draft",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .aggregateSummary,
        ).toMatchObject({
          controlledShadowPreparationCount:
            8,

          shadowExecutionEligibleCount:
            8,

          shadowExecutionExecutedCount:
            0,

          draftCreatedCount:
            0,

          ownerReviewRequiredCount:
            8,

          maximumAggregateTaskCount:
            8,
        });

        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          controlledShadowOperationPrepared:
            true,

          controlledShadowOperationExecuted:
            false,

          shadowExecutionEligible:
            true,

          ownerReviewRequiredAfterExecution:
            true,
        });

        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS",
        );
      },
    );

    it(
      "keeps repository production customer payment autonomy and launch blocked",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
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

          realCustomerDataAccessAuthorized:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionDatabaseAuthorized:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionAuthorized:
            false,

          financialCommitmentAuthorized:
            false,

          legalCommitmentAuthorized:
            false,

          autonomousDecisionAuthorized:
            false,

          productionReadinessAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "requires the canonical owner-activated runtime issuance",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceControlledShadowOperationPreparation({
              ...input(),

              ownerActivatedRuntimeIssuance: {
                ...ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
              } as typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
            }),
        ).toThrow(
          "canonical Engineering owner-activated runtime issuance",
        );
      },
    );

    it(
      "blocks preparation before runtime activation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceControlledShadowOperationPreparation({
              ...input(),

              preparedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
                      .activatedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede runtime activation",
        );
      },
      20_000,
    );

    it(
      "creates deterministic immutable digest-verified preparation evidence",
      () => {
        const first =
          createEngineeringAIWorkforceControlledShadowOperationPreparation(
            input(),
          );

        const second =
          createEngineeringAIWorkforceControlledShadowOperationPreparation(
            input(),
          );

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
            first.candidatePreparations,
          ),
        ).toBe(true);

        expect(
          first.candidatePreparations.every(
            (entry) =>
              Object.isFrozen(entry) &&
              Object.isFrozen(
                entry.shadowFixture,
              ) &&
              Object.isFrozen(
                entry.authorityBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceControlledShadowOperationPreparation(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            preparationDigest:
              "0".repeat(64),
          } as
            EngineeringAIWorkforceControlledShadowOperationPreparation;

        expect(
          () =>
            validateEngineeringAIWorkforceControlledShadowOperationPreparation(
              tampered,
            ),
        ).toThrow(
          "integrity is invalid",
        );
      },
      30_000,
    );
  },
);
