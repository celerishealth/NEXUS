import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
} from "../engineeringAIWorkforceActivationCandidateIssuance";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
} from "../engineeringAIWorkforceOwnerActivationDecision";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE,
  createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
  validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
  type EngineeringAIWorkforceOwnerActivatedRuntimeIssuance,
} from "../engineeringAIWorkforceOwnerActivatedRuntimeIssuance";

function input() {
  return {
    runtimeIssuanceId:
      "engineering-owner-activated-runtime-test-001",

    activationCandidateIssuance:
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,

    ownerActivationDecision:
      ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,

    activatedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
            .decidedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce owner-activated runtime issuance",
  () => {
    it(
      "issues exactly eight owner-activated runtimes",
      () => {
        const issuance =
          createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "ENGINEERING_OWNER_ACTIVATED_RUNTIMES_ISSUED",
        );

        expect(
          issuance.candidateRuntimeIssuances,
        ).toHaveLength(8);

        expect(
          issuance.candidateRuntimeIssuances.every(
            (entry) =>
              entry.ownerActivatedRuntime
                .ownerActivated ===
                true &&
              entry.ownerActivatedRuntime
                .runtimeState ===
                "READY_FOR_CONTROLLED_WORK" &&
              entry.ownerActivatedRuntime
                .controlledWorkAuthorized ===
                true,
          ),
        ).toBe(true);
      },
      20_000,
    );

    it(
      "preserves exact Engineering identities and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .candidateRuntimeIssuances
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
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .candidateRuntimeIssuances
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
      "preserves runtime candidate decision and manifest bindings",
      () => {
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
          .candidateRuntimeIssuances
          .forEach(
            (
              entry,
              index,
            ) => {
              const source =
                ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
                  .candidateIssuances[index];

              const decision =
                ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
                  .candidateDecisions[index];

              expect(
                entry.runtimeId,
              ).toBe(
                source?.runtimeId,
              );

              expect(
                entry.activationCandidateDigest,
              ).toBe(
                source
                  ?.activationCandidateDigest,
              );

              expect(
                entry.ownerActivationDecisionDigest,
              ).toBe(
                decision
                  ?.candidateDecisionDigest,
              );

              expect(
                entry.ownerActivatedRuntime
                  .manifestDigest,
              ).toBe(
                source
                  ?.qualifiedManifestDigest,
              );
            },
          );
      },
    );

    it(
      "replaces every paused runtime digest with a new activated digest",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .candidateRuntimeIssuances
            .every(
              (entry) =>
                entry.ownerActivatedRuntimeDigest !==
                entry.pausedRuntimeDigest,
            ),
        ).toBe(true);

        expect(
          new Set(
            ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
              .candidateRuntimeIssuances
              .map(
                (entry) =>
                  entry.ownerActivatedRuntimeDigest,
              ),
          ).size,
        ).toBe(8);
      },
    );

    it(
      "records the exact runtime activation aggregate summary",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          activationCandidateCount:
            8,

          ownerActivationApprovalCount:
            8,

          runtimeActivationExecutedCount:
            8,

          activatedRuntimeCount:
            8,

          controlledWorkAuthorizationCount:
            8,

          emergencyPauseAvailableCount:
            8,

          exactEightOwnerActivatedRuntimesIssued:
            true,

          exactCandidateSequencePreserved:
            true,

          exactCandidateIdentityPreserved:
            true,

          exactRuntimeIdentityPreserved:
            true,

          exactManifestBindingsPreserved:
            true,

          uniqueOwnerActivatedRuntimeDigests:
            8,

          pausedRuntimeDigestReplacementCount:
            8,
        });
      },
    );

    it(
      "keeps controlled work internal and every consequential authority blocked",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .authorityBoundary,
        ).toMatchObject({
          runtimeActivationExecuted:
            true,

          runtimeActivated:
            true,

          controlledWorkAuthorized:
            true,

          controlledInternalWorkOnly:
            true,

          emergencyPauseAvailable:
            true,

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

          controlledShadowOperationPrepared:
            false,

          controlledShadowOperationExecuted:
            false,
        });

        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .nextStep,
        ).toBe(
          "PREPARE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS",
        );
      },
    );

    it(
      "requires canonical activation candidates and owner decision",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance({
              ...input(),

              activationCandidateIssuance: {
                ...ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
              } as typeof ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
            }),
        ).toThrow(
          "canonical Engineering activation-candidate issuance",
        );

        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance({
              ...input(),

              ownerActivationDecision: {
                ...ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
              } as typeof ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
            }),
        ).toThrow(
          "canonical approved Engineering owner-activation decision",
        );
      },
      20_000,
    );

    it(
      "blocks runtime activation before the owner decision",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance({
              ...input(),

              activatedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
                      .decidedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede the owner activation decision",
        );
      },
      20_000,
    );

    it(
      "preserves emergency pause and blocks external runtime safety authority",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATED_RUNTIME_ISSUANCE
            .candidateRuntimeIssuances
            .every(
              (entry) =>
                entry.ownerActivatedRuntime
                  .safetyBoundary
                  .emergencyPauseAvailable ===
                  true &&
                entry.ownerActivatedRuntime
                  .safetyBoundary
                  .liveProviderExecutionAuthorized ===
                  false &&
                entry.ownerActivatedRuntime
                  .safetyBoundary
                  .externalDeliveryAuthorized ===
                  false &&
                entry.ownerActivatedRuntime
                  .safetyBoundary
                  .paymentExecutionAuthorized ===
                  false &&
                entry.ownerActivatedRuntime
                  .safetyBoundary
                  .publicLaunchAuthorized ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "creates deterministic immutable digest-verified runtime issuance",
      () => {
        const first =
          createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
            input(),
          );

        const second =
          createEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.runtimeIssuanceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateRuntimeIssuances,
          ),
        ).toBe(true);

        expect(
          first.candidateRuntimeIssuances.every(
            (entry) =>
              Object.isFrozen(entry) &&
              Object.isFrozen(
                entry.ownerActivatedRuntime,
              ) &&
              Object.isFrozen(
                entry.ownerActivatedRuntime
                  .safetyBoundary,
              ) &&
              Object.isFrozen(
                entry.authorityBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            runtimeIssuanceDigest:
              "0".repeat(64),
          } as
            EngineeringAIWorkforceOwnerActivatedRuntimeIssuance;

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerActivatedRuntimeIssuance(
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
