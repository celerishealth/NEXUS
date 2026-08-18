import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
} from "../autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE,
} from "../autonomousGlobalGrowthActivationCandidateIssuance";

import {
  AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION,
  createAutonomousGlobalGrowthOwnerActivationDecision,
  validateAutonomousGlobalGrowthOwnerActivationDecision,
  type AutonomousGlobalGrowthOwnerActivationDecision,
} from "../autonomousGlobalGrowthOwnerActivationDecision";

function input() {
  return {
    activationCandidateIssuance:
      AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE,

    decisionId:
      "autonomous-global-growth-owner-activation-test-001",

    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION" as const,

    reason:
      "Owner explicitly approves preparation of the nine owner-activated Autonomous Global Growth runtimes while all external authority remains blocked.",

    decidedAt:
      new Date(
        Date.parse(
          AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Autonomous Global Growth AI Workforce owner-activation decision",
  () => {
    it(
      "records owner activation approval for exactly nine candidates",
      () => {
        const record =
          createAutonomousGlobalGrowthOwnerActivationDecision(
            input(),
          );

        expect(
          record.decisionState,
        ).toBe(
          "AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION_RECORDED",
        );

        expect(
          record.decision,
        ).toBe(
          "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION",
        );

        expect(
          record.ownerActivationApproved,
        ).toBe(true);

        expect(
          record.candidateDecisions,
        ).toHaveLength(9);

        expect(
          record.candidateDecisions.every(
            (entry) =>
              entry.ownerActivationApproved ===
                true &&
              entry.runtimeActivationEligible ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves exact Autonomous Global Growth candidate identities and sequence",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION
            .candidateDecisions
            .map(
              (entry) =>
                entry.publicName,
            ),
        ).toEqual([
          "Niyara",
          "Rivaan",
          "Ahaana",
          "Kairav",
          "Samyra",
          "Ruhan",
          "Tavisha",
          "Yuvaan",
          "Vedanshi",
        ]);

        expect(
          AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION
            .candidateDecisions
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
          9,
        ]);
      },
    );

    it(
      "binds every decision to its exact paused activation candidate",
      () => {
        AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION
          .candidateDecisions
          .forEach(
            (
              entry,
              index,
            ) => {
              const source =
                AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
                  .candidateIssuances[index];

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
                entry.pausedRuntimeDigest,
              ).toBe(
                source
                  ?.pausedRuntimeDigest,
              );
            },
          );
      },
    );

    it(
      "authorizes only preparation of owner-activated runtimes",
      () => {
        const record =
          AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION;

        expect(
          record.nextStep,
        ).toBe(
          "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATED_RUNTIMES",
        );

        expect(
          record.authorityBoundary,
        ).toMatchObject({
          ownerActivationDecisionRecorded:
            true,

          ownerActivationApproved:
            true,

          runtimePreparationAuthorized:
            true,

          runtimeActivationExecuted:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
            false,
        });
      },
    );

    it(
      "records rejection while retaining all runtimes paused",
      () => {
        const rejected =
          createAutonomousGlobalGrowthOwnerActivationDecision({
            ...input(),

            decisionId:
              "autonomous-global-growth-owner-activation-rejection-test-001",

            decision:
              "REJECT_AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION",

            reason:
              "Owner rejects Autonomous Global Growth runtime activation preparation and requires every candidate runtime to remain paused.",

            decidedAt:
              new Date(
                Date.parse(
                  AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
                    .preparedAt,
                ) + 2,
              ).toISOString(),
          });

        expect(
          rejected.ownerActivationApproved,
        ).toBe(false);

        expect(
          rejected.runtimeActivationEligible,
        ).toBe(false);

        expect(
          rejected.aggregateSummary
            .ownerActivationApprovedCount,
        ).toBe(0);

        expect(
          rejected.nextStep,
        ).toBe(
          "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_PAUSED_RUNTIMES",
        );
      },
    );

    it(
      "requires the canonical activation-candidate issuance",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthOwnerActivationDecision({
              ...input(),

              activationCandidateIssuance: {
                ...AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth activation-candidate issuance",
        );
      },
    );

    it(
      "blocks cross-tenant cross-owner and premature decisions",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthOwnerActivationDecision({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthOwnerActivationDecision({
              ...input(),

              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "activation-candidate-bound NEXUS owner",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthOwnerActivationDecision({
              ...input(),

              decidedAt:
                new Date(
                  Date.parse(
                    AUTONOMOUS_GLOBAL_GROWTH_ACTIVATION_CANDIDATE_ISSUANCE
                      .preparedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede activation-candidate preparation",
        );
      },
      15_000,
    );

    it(
      "keeps runtime repository production customer payment autonomy and launch blocked",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_OWNER_ACTIVATION_DECISION
            .authorityBoundary,
        ).toMatchObject({
          runtimeActivationExecuted:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
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
      "rejects secret-bearing owner rationale",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthOwnerActivationDecision({
              ...input(),

              reason:
                "Owner approves using secret access_token abc123 for runtime preparation.",
            }),
        ).toThrow(
          "secret-bearing content",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified owner decision",
      () => {
        const first =
          createAutonomousGlobalGrowthOwnerActivationDecision(
            input(),
          );

        const second =
          createAutonomousGlobalGrowthOwnerActivationDecision(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.candidateDecisions.map(
              (entry) =>
                entry.candidateDecisionDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateDecisions,
          ),
        ).toBe(true);

        expect(
          first.candidateDecisions.every(
            (entry) =>
              Object.isFrozen(entry) &&
              Object.isFrozen(
                entry.authorityBoundary,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateAutonomousGlobalGrowthOwnerActivationDecision(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            decisionDigest:
              "0".repeat(64),
          } as
            AutonomousGlobalGrowthOwnerActivationDecision;

        expect(
          () =>
            validateAutonomousGlobalGrowthOwnerActivationDecision(
              tampered,
            ),
        ).toThrow(
          "integrity is invalid",
        );
      },
      15_000,
    );
  },
);
