import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
} from "../autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
} from "../autonomousGlobalGrowthFormalQualificationFixturePack";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
} from "../autonomousGlobalGrowthFormalQualificationExecutionEvidence";

import {
  createAutonomousGlobalGrowthFormalQualificationReviewDecision,
  validateAutonomousGlobalGrowthFormalQualificationReviewDecision,
} from "../autonomousGlobalGrowthFormalQualificationReviewDecision";

function input() {
  return {
    decisionId:
      "engineering-ai-workforce-formal-review-test-001",

    evidenceLedger:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,

    plan:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,

    fixturePack:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,

    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    outcome:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION" as const,

    rationale:
      "The verified NEXUS owner reviewed exact evidence for nine Autonomous Global Growth candidates and approved only formal qualification-engine admission while preserving every activation, runtime, repository, production, customer, payment, autonomous-action, and public-launch boundary.",

    reviewedAt:
      new Date(
        Date.parse(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Autonomous Global Growth formal qualification review decision",
  () => {
    it(
      "approves engine admission for exactly nine evidence-bound candidates without invoking it",
      () => {
        const decision =
          createAutonomousGlobalGrowthFormalQualificationReviewDecision(
            input(),
          );

        expect(
          decision.decisionState,
        ).toBe(
          "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED",
        );

        expect(
          decision.candidateReviews,
        ).toHaveLength(9);

        expect(
          decision.candidateReviews.every(
            (record) =>
              record.formalQualificationEngineInvocationAuthorized ===
                true &&
              record.qualificationEngineInvoked ===
                false &&
              record.formalQualificationIssued ===
                false,
          ),
        ).toBe(true);

        expect(
          decision.nextStep,
        ).toBe(
          "INVOKE_OWNER_APPROVED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE",
        );
      },
    );

    it(
      "binds the exact aggregate evidence reviewed by the owner",
      () => {
        const decision =
          createAutonomousGlobalGrowthFormalQualificationReviewDecision(
            input(),
          );

        expect(
          decision.evidenceSummary,
        ).toEqual({
          qualificationCasesExecuted:
            900,

          qualificationCasesPassed:
            900,

          qualificationCasesFailed:
            0,

          qualificationEvidenceCollected:
            900,

          assertionsExecuted:
            11700,

          assertionsPassed:
            11700,

          assertionsFailed:
            0,

          exactNineCandidatesReviewed:
            true,

          independentEvaluatorEvidenceVerified:
            true,

          assertionDerivedEvidenceVerified:
            true,

          hardCodedPassingEvidenceAccepted:
            false,
        });
      },
    );

    it(
      "supports rejection without authorizing the qualification engine",
      () => {
        const decision =
          createAutonomousGlobalGrowthFormalQualificationReviewDecision({
            ...input(),

            outcome:
              "REJECT_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION",

            rationale:
              "The verified NEXUS owner rejected formal qualification-engine admission and returned all nine Autonomous Global Growth candidates to controlled requalification without granting any runtime, repository, production, customer, payment, autonomous-action, or launch authority.",
          });

        expect(
          decision.decisionState,
        ).toBe(
          "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REJECTED",
        );

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETURN_AUTONOMOUS_GLOBAL_GROWTH_WORKFORCE_TO_CONTROLLED_REQUALIFICATION",
        );
      },
    );

    it(
      "requires canonical plan fixture and execution-evidence sources",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthFormalQualificationReviewDecision({
              ...input(),

              evidenceLedger: {
                ...AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth formal qualification execution evidence",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthFormalQualificationReviewDecision({
              ...input(),

              plan: {
                ...AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth formal qualification plan",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthFormalQualificationReviewDecision({
              ...input(),

              fixturePack: {
                ...AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth formal qualification fixture pack",
        );
      },
    );

    it(
      "requires the exact evidence-bound tenant and owner",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthFormalQualificationReviewDecision({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createAutonomousGlobalGrowthFormalQualificationReviewDecision({
              ...input(),

              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "evidence-bound verified NEXUS owner",
        );
      },
    );

    it(
      "blocks owner review before evidence execution",
      () => {
        expect(
          () =>
            createAutonomousGlobalGrowthFormalQualificationReviewDecision({
              ...input(),

              reviewedAt:
                new Date(
                  Date.parse(
                    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
                      .executedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "preserves all post-review authority boundaries",
      () => {
        const boundary =
          createAutonomousGlobalGrowthFormalQualificationReviewDecision(
            input(),
          ).authorityBoundary;

        expect(boundary).toMatchObject({
          formalQualificationEngineInvocationAuthorized:
            true,

          qualificationEngineInvoked:
            false,

          qualificationReportCreated:
            false,

          formalQualificationIssued:
            false,

          qualifiedManifestCreated:
            false,

          activationCandidateCreated:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
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
      "creates deterministic immutable digest-verified review evidence",
      () => {
        const first =
          createAutonomousGlobalGrowthFormalQualificationReviewDecision(
            input(),
          );

        const second =
          createAutonomousGlobalGrowthFormalQualificationReviewDecision(
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
            first.candidateReviews.map(
              (record) =>
                record.candidateReviewDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateReviews,
          ),
        ).toBe(true);

        expect(
          first.candidateReviews.every(
            (record) =>
              Object.isFrozen(record),
          ),
        ).toBe(true);

        expect(
          () =>
            validateAutonomousGlobalGrowthFormalQualificationReviewDecision(
              first,
            ),
        ).not.toThrow();
      },
    );
  },
);
