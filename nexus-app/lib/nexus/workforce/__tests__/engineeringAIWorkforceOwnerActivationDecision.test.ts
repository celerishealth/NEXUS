import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "../engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
} from "../engineeringAIWorkforceActivationCandidateIssuance";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION,
  createEngineeringAIWorkforceOwnerActivationDecision,
  validateEngineeringAIWorkforceOwnerActivationDecision,
  type EngineeringAIWorkforceOwnerActivationDecision,
} from "../engineeringAIWorkforceOwnerActivationDecision";

function input() {
  return {
    activationCandidateIssuance:
      ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,

    decisionId:
      "engineering-owner-activation-test-001",

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    decision:
      "APPROVE_ENGINEERING_OWNER_ACTIVATION" as const,

    reason:
      "Owner explicitly approves preparation of the eight owner-activated Engineering runtimes while all external authority remains blocked.",

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce owner-activation decision",
  () => {
    it(
      "records owner activation approval for exactly eight candidates",
      () => {
        const record =
          createEngineeringAIWorkforceOwnerActivationDecision(
            input(),
          );

        expect(
          record.decisionState,
        ).toBe(
          "ENGINEERING_OWNER_ACTIVATION_DECISION_RECORDED",
        );

        expect(
          record.decision,
        ).toBe(
          "APPROVE_ENGINEERING_OWNER_ACTIVATION",
        );

        expect(
          record.ownerActivationApproved,
        ).toBe(true);

        expect(
          record.candidateDecisions,
        ).toHaveLength(8);

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
      "preserves exact Engineering candidate identities and sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
            .candidateDecisions
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
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
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
        ]);
      },
    );

    it(
      "binds every decision to its exact paused activation candidate",
      () => {
        ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
          .candidateDecisions
          .forEach(
            (
              entry,
              index,
            ) => {
              const source =
                ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
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
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION;

        expect(
          record.nextStep,
        ).toBe(
          "PREPARE_ENGINEERING_OWNER_ACTIVATED_RUNTIMES",
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
          createEngineeringAIWorkforceOwnerActivationDecision({
            ...input(),

            decisionId:
              "engineering-owner-activation-rejection-test-001",

            decision:
              "REJECT_ENGINEERING_OWNER_ACTIVATION",

            reason:
              "Owner rejects Engineering runtime activation preparation and requires every candidate runtime to remain paused.",

            decidedAt:
              new Date(
                Date.parse(
                  ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
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
          "RETAIN_ENGINEERING_PAUSED_RUNTIMES",
        );
      },
    );

    it(
      "requires the canonical activation-candidate issuance",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivationDecision({
              ...input(),

              activationCandidateIssuance: {
                ...ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE,
              },
            }),
        ).toThrow(
          "canonical Engineering activation-candidate issuance",
        );
      },
    );

    it(
      "blocks cross-tenant cross-owner and premature decisions",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivationDecision({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivationDecision({
              ...input(),

              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "activation-candidate-bound NEXUS owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceOwnerActivationDecision({
              ...input(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_ACTIVATION_CANDIDATE_ISSUANCE
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
          ENGINEERING_AI_WORKFORCE_OWNER_ACTIVATION_DECISION
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
            createEngineeringAIWorkforceOwnerActivationDecision({
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
          createEngineeringAIWorkforceOwnerActivationDecision(
            input(),
          );

        const second =
          createEngineeringAIWorkforceOwnerActivationDecision(
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
        ).toBe(8);

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
            validateEngineeringAIWorkforceOwnerActivationDecision(
              first,
            ),
        ).not.toThrow();

        const tampered =
          {
            ...first,

            decisionDigest:
              "0".repeat(64),
          } as
            EngineeringAIWorkforceOwnerActivationDecision;

        expect(
          () =>
            validateEngineeringAIWorkforceOwnerActivationDecision(
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
