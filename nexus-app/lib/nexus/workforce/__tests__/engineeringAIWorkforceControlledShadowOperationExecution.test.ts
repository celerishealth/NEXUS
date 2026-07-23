import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,
} from "../engineeringAIWorkforceControlledShadowOperationPreparation";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION,
  createEngineeringAIWorkforceControlledShadowOperationExecution,
  validateEngineeringAIWorkforceControlledShadowOperationExecution,
  type EngineeringAIWorkforceControlledShadowOperationExecution,
} from "../engineeringAIWorkforceControlledShadowOperationExecution";

function input() {
  return {
    executionId:
      "engineering-controlled-shadow-execution-test-001",

    preparation:
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,

    executedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce controlled-shadow operation execution",
  () => {
    it(
      "executes exactly eight prepared controlled-shadow operations",
      () => {
        const execution =
          createEngineeringAIWorkforceControlledShadowOperationExecution(
            input(),
          );

        expect(
          execution.executionState,
        ).toBe(
          "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_EXECUTED",
        );

        expect(
          execution.candidateExecutions,
        ).toHaveLength(8);

        expect(
          execution.candidateExecutions.every(
            (entry) =>
              entry.executionState ===
                "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_EXECUTED" &&
              entry.executionBoundary
                .shadowExecutionExecuted ===
                true,
          ),
        ).toBe(true);
      },
      30_000,
    );

    it(
      "preserves exact Engineering identities and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .candidateExecutions
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
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .candidateExecutions
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
      "creates exactly one synthetic draft per specialist",
      () => {
        const entries =
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .candidateExecutions;

        expect(
          entries.every(
            (entry) =>
              entry.executionBoundary
                .maximumTaskCountEnforced ===
                true &&
              entry.executionBoundary
                .draftCreatorInvocationCount ===
                1 &&
              entry.executionBoundary
                .draftCreated ===
                true &&
              entry.draftEvidence
                .draftStatus ===
                "DRAFT_CREATED_AWAITING_OWNER_REVIEW",
          ),
        ).toBe(true);

        expect(
          new Set(
            entries.map(
              (entry) =>
                entry.draftEvidence
                  .draftId,
            ),
          ).size,
        ).toBe(8);
      },
    );

    it(
      "uses synthetic sanitized read-only evidence and draft-only tools",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .candidateExecutions
            .every(
              (entry) =>
                entry.syntheticEvidence
                  .dataClassification ===
                  "SYNTHETIC_SANITIZED_ONLY" &&
                entry.syntheticEvidence
                  .evidenceToolMode ===
                  "READ_ONLY" &&
                entry.syntheticEvidence
                  .executionMode ===
                  "SANDBOX_ONLY" &&
                entry.draftEvidence
                  .draftToolMode ===
                  "DRAFT_ONLY" &&
                entry.syntheticEvidence
                  .realCustomerDataUsed ===
                  false &&
                entry.syntheticEvidence
                  .crossTenantContextUsed ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "records bounded quality evidence without unsupported claims",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .candidateExecutions
            .every(
              (entry) =>
                entry.syntheticEvidence
                  .verifiedFacts.length ===
                  3 &&
                entry.syntheticEvidence
                  .unsupportedFactsInvented ===
                  false &&
                entry.draftEvidence
                  .findings.length ===
                  3 &&
                entry.draftEvidence
                  .recommendations.length ===
                  3 &&
                entry.draftEvidence
                  .uncertainties.length ===
                  3 &&
                entry.draftEvidence
                  .riskLevel ===
                  "MEDIUM" &&
                entry.draftEvidence
                  .unsupportedClaimsIncluded ===
                  false &&
                entry.draftEvidence
                  .urgencyExaggerated ===
                  false &&
                entry.draftEvidence
                  .guaranteeMade ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "stops every execution at mandatory owner review",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .aggregateSummary,
        ).toMatchObject({
          executedOperationCount:
            8,

          draftCreatedCount:
            8,

          ownerReviewRequiredCount:
            8,

          ownerDecisionMadeCount:
            0,

          actualAggregateTaskCount:
            8,

          remainingAggregateTaskCapacity:
            0,
        });

        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .executionBoundary,
        ).toMatchObject({
          controlledShadowOperationExecuted:
            true,

          ownerDecisionMade:
            false,

          ownerReviewRequired:
            true,

          ownerReviewRequiredCount:
            8,

          approvalBypassAllowed:
            false,
        });

        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS",
        );
      },
    );

    it(
      "keeps repository production customer payment autonomy and launch blocked",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .executionBoundary,
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

          realCustomerDataUsed:
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

        expect(
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION
            .candidateExecutions
            .every(
              (entry) =>
                entry.draftEvidence
                  .repositoryChangePrepared ===
                  false &&
                entry.draftEvidence
                  .repositoryChangeExecuted ===
                  false &&
                entry.draftEvidence
                  .productionChangePrepared ===
                  false &&
                entry.draftEvidence
                  .productionChangeExecuted ===
                  false &&
                entry.draftEvidence
                  .customerDeliveryPrepared ===
                  false &&
                entry.draftEvidence
                  .customerDeliveryExecuted ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "requires the canonical controlled-shadow preparation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceControlledShadowOperationExecution({
              ...input(),

              preparation: {
                ...ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,
              } as typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,
            }),
        ).toThrow(
          "canonical Engineering controlled-shadow preparation",
        );
      },
    );

    it(
      "blocks execution before preparation",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceControlledShadowOperationExecution({
              ...input(),

              executedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
                      .preparedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede preparation",
        );
      },
      20_000,
    );

    it(
      "creates deterministic immutable digest-verified execution evidence",
      () => {
        const first =
          createEngineeringAIWorkforceControlledShadowOperationExecution(
            input(),
          );

        const second =
          createEngineeringAIWorkforceControlledShadowOperationExecution(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateExecutions,
          ),
        ).toBe(true);

        expect(
          first.candidateExecutions.every(
            (entry) =>
              Object.isFrozen(entry) &&
              Object.isFrozen(
                entry.syntheticEvidence,
              ) &&
              Object.isFrozen(
                entry.syntheticEvidence
                  .verifiedFacts,
              ) &&
              Object.isFrozen(
                entry.draftEvidence,
              ) &&
              Object.isFrozen(
                entry.draftEvidence
                  .findings,
              ) &&
              Object.isFrozen(
                entry.draftEvidence
                  .recommendations,
              ) &&
              Object.isFrozen(
                entry.draftEvidence
                  .uncertainties,
              ) &&
              Object.isFrozen(
                entry.executionBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceControlledShadowOperationExecution(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            executionDigest:
              "0".repeat(64),
          } as
            EngineeringAIWorkforceControlledShadowOperationExecution;

        expect(
          () =>
            validateEngineeringAIWorkforceControlledShadowOperationExecution(
              tampered,
            ),
        ).toThrow(
          "integrity is invalid",
        );
      },
      40_000,
    );
  },
);
