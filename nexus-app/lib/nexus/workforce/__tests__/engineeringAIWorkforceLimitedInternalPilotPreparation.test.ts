import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
} from "../engineeringAIWorkforceOwnerControlledShadowOperationReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION,
  createEngineeringAIWorkforceLimitedInternalPilotPreparation,
  validateEngineeringAIWorkforceLimitedInternalPilotPreparation,
  type EngineeringAIWorkforceLimitedInternalPilotPreparation,
} from "../engineeringAIWorkforceLimitedInternalPilotPreparation";

function input() {
  return {
    preparationId:
      "engineering-limited-internal-pilot-preparation-test-001",

    ownerControlledShadowOperationReviewDecision:
      ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,

    preparedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce limited internal pilot preparation",
  () => {
    it(
      "prepares exactly eight limited internal synthetic pilots",
      () => {
        const preparation =
          createEngineeringAIWorkforceLimitedInternalPilotPreparation(
            input(),
          );

        expect(
          preparation.preparationState,
        ).toBe(
          "ENGINEERING_LIMITED_INTERNAL_PILOTS_PREPARED",
        );

        expect(
          preparation.candidatePreparations,
        ).toHaveLength(8);

        expect(
          preparation.candidatePreparations.every(
            (entry) =>
              entry.preparationState ===
                "ENGINEERING_CANDIDATE_LIMITED_INTERNAL_PILOT_PREPARED",
          ),
        ).toBe(true);
      },
      30_000,
    );

    it(
      "preserves exact Engineering specialist identity and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
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
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
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
      "defines three unique role-specific scenarios per specialist",
      () => {
        const entries =
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
            .candidatePreparations;

        expect(
          entries.every(
            (entry) =>
              entry.pilotPlan.scenarios.length ===
                3 &&
              entry.pilotPlan.maximumTaskCount ===
                3 &&
              entry.pilotPlan.concurrentTaskLimit ===
                1 &&
              entry.pilotPlan.failureThreshold ===
                1,
          ),
        ).toBe(true);

        expect(
          new Set(
            entries.flatMap(
              (entry) =>
                entry.pilotPlan.scenarios,
            ),
          ).size,
        ).toBe(24);
      },
    );

    it(
      "uses synthetic sanitized sandbox plans with read-only evidence and draft-only output",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
            .candidatePreparations
            .every(
              (entry) =>
                entry.pilotPlan.pilotClass ===
                  "LIMITED_INTERNAL_SYNTHETIC_PILOT" &&
                entry.pilotPlan.dataClassification ===
                  "SYNTHETIC_SANITIZED_ONLY" &&
                entry.pilotPlan.actorClass ===
                  "OWNER_SUPERVISED_INTERNAL_ONLY" &&
                entry.pilotPlan.executionMode ===
                  "SANDBOX_ONLY" &&
                entry.pilotPlan.evidenceToolMode ===
                  "READ_ONLY" &&
                entry.pilotPlan.draftToolMode ===
                  "DRAFT_ONLY" &&
                entry.pilotPlan.ownerReviewFrequency ===
                  "AFTER_EVERY_PILOT_TASK" &&
                entry.pilotPlan.externalDeliveryMode ===
                  "DISABLED" &&
                entry.pilotPlan.productionMutationMode ===
                  "DISABLED",
            ),
        ).toBe(true);
      },
    );

    it(
      "locks specialist quality owner-control isolation rollback and audit standards",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
            .candidatePreparations
            .every(
              (entry) =>
                Object.values(
                  entry.specialistStandard,
                ).every(
                  (value) =>
                    value === true,
                ),
            ),
        ).toBe(true);
      },
    );

    it(
      "authorizes preparation only and does not authorize pilot execution",
      () => {
        const preparation =
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION;

        expect(
          preparation.aggregateSummary,
        ).toMatchObject({
          reviewedCandidateCount:
            8,

          approvedCandidateCount:
            8,

          preparedPilotCount:
            8,

          pilotExecutionEligibleCount:
            0,

          pilotExecutionAuthorizedCount:
            0,

          pilotTaskExecutedCount:
            0,

          pilotDraftCreatedCount:
            0,

          maximumAggregateTaskCount:
            24,
        });

        expect(
          preparation.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS",
        );
      },
    );

    it(
      "keeps every consequential authority blocked",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          limitedInternalPilotPreparationAuthorized:
            true,

          limitedInternalPilotPreparationAuthorizedCount:
            8,

          limitedInternalPilotExecutionAuthorized:
            false,

          limitedInternalPilotExecutionAuthorizedCount:
            0,

          pilotTaskExecutedCount:
            0,

          pilotDraftCreatedCount:
            0,

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

          monitoringRequired:
            true,

          ownerReviewAfterEveryPilotTask:
            true,

          emergencyPauseAvailable:
            true,
        });

        expect(
          ENGINEERING_AI_WORKFORCE_LIMITED_INTERNAL_PILOT_PREPARATION
            .candidatePreparations
            .every(
              (entry) =>
                entry.authorityBoundary
                  .limitedInternalPilotExecutionAuthorized ===
                  false &&
                entry.authorityBoundary
                  .syntheticPilotTaskExecutionAuthorized ===
                  false &&
                entry.authorityBoundary
                  .pilotTaskExecuted ===
                  false &&
                entry.authorityBoundary
                  .pilotDraftCreated ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "requires the canonical owner-review decision",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceLimitedInternalPilotPreparation({
              ...input(),

              ownerControlledShadowOperationReviewDecision: {
                ...ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION,
            }),
        ).toThrow(
          "canonical Engineering owner controlled-shadow review decision",
        );
      },
    );

    it(
      "blocks preparation before the owner-review decision",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceLimitedInternalPilotPreparation({
              ...input(),

              preparedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede the owner review decision",
        );
      },
      30_000,
    );

    it(
      "is deterministic deeply immutable digest-bound and rejects tampering",
      () => {
        const first =
          createEngineeringAIWorkforceLimitedInternalPilotPreparation(
            input(),
          );

        const second =
          createEngineeringAIWorkforceLimitedInternalPilotPreparation(
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
                entry.pilotPlan,
              ) &&
              Object.isFrozen(
                entry.pilotPlan.scenarios,
              ) &&
              Object.isFrozen(
                entry.specialistStandard,
              ) &&
              Object.isFrozen(
                entry.authorityBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceLimitedInternalPilotPreparation(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            limitedInternalPilotExecutionAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforceLimitedInternalPilotPreparation;

        expect(
          () =>
            validateEngineeringAIWorkforceLimitedInternalPilotPreparation(
              tampered,
            ),
        ).toThrow(
          "aggregate authority boundary is invalid",
        );
      },
      40_000,
    );

    it(
      "rejects secret-bearing preparation identity",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceLimitedInternalPilotPreparation({
              ...input(),

              preparationId:
                "token-engineering-limited-pilot-preparation-001",
            }),
        ).toThrow(
          "invalid or secret-bearing",
        );
      },
    );
  },
);
