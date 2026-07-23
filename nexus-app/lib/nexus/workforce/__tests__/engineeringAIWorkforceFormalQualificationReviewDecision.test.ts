import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "../engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
} from "../engineeringAIWorkforceFormalQualificationFixturePack";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
} from "../engineeringAIWorkforceFormalQualificationExecutionEvidence";

import {
  createEngineeringAIWorkforceFormalQualificationReviewDecision,
  validateEngineeringAIWorkforceFormalQualificationReviewDecision,
} from "../engineeringAIWorkforceFormalQualificationReviewDecision";

function input() {
  return {
    decisionId:
      "engineering-ai-workforce-formal-review-test-001",

    evidenceLedger:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,

    plan:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,

    fixturePack:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    outcome:
      "APPROVE_ENGINEERING_FORMAL_QUALIFICATION" as const,

    rationale:
      "The verified NEXUS owner reviewed exact evidence for eight Engineering candidates and approved only formal qualification-engine admission while preserving every activation, runtime, repository, production, customer, payment, autonomous-action, and public-launch boundary.",

    reviewedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
            .executedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce formal qualification review decision",
  () => {
    it(
      "approves engine admission for exactly eight evidence-bound candidates without invoking it",
      () => {
        const decision =
          createEngineeringAIWorkforceFormalQualificationReviewDecision(
            input(),
          );

        expect(
          decision.decisionState,
        ).toBe(
          "ENGINEERING_FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED",
        );

        expect(
          decision.candidateReviews,
        ).toHaveLength(8);

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
          "INVOKE_OWNER_APPROVED_ENGINEERING_FORMAL_QUALIFICATION_ENGINE",
        );
      },
    );

    it(
      "binds the exact aggregate evidence reviewed by the owner",
      () => {
        const decision =
          createEngineeringAIWorkforceFormalQualificationReviewDecision(
            input(),
          );

        expect(
          decision.evidenceSummary,
        ).toEqual({
          qualificationCasesExecuted:
            800,

          qualificationCasesPassed:
            800,

          qualificationCasesFailed:
            0,

          qualificationEvidenceCollected:
            800,

          assertionsExecuted:
            10400,

          assertionsPassed:
            10400,

          assertionsFailed:
            0,

          exactEightCandidatesReviewed:
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
          createEngineeringAIWorkforceFormalQualificationReviewDecision({
            ...input(),

            outcome:
              "REJECT_ENGINEERING_FORMAL_QUALIFICATION",

            rationale:
              "The verified NEXUS owner rejected formal qualification-engine admission and returned all eight Engineering candidates to controlled requalification without granting any runtime, repository, production, customer, payment, autonomous-action, or launch authority.",
          });

        expect(
          decision.decisionState,
        ).toBe(
          "ENGINEERING_FORMAL_QUALIFICATION_REJECTED",
        );

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(false);

        expect(
          decision.nextStep,
        ).toBe(
          "RETURN_ENGINEERING_WORKFORCE_TO_CONTROLLED_REQUALIFICATION",
        );
      },
    );

    it(
      "requires canonical plan fixture and execution-evidence sources",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationReviewDecision({
              ...input(),

              evidenceLedger: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
              },
            }),
        ).toThrow(
          "canonical Engineering formal qualification execution evidence",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationReviewDecision({
              ...input(),

              plan: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
              },
            }),
        ).toThrow(
          "canonical Engineering formal qualification plan",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationReviewDecision({
              ...input(),

              fixturePack: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
              },
            }),
        ).toThrow(
          "canonical Engineering formal qualification fixture pack",
        );
      },
    );

    it(
      "requires the exact evidence-bound tenant and owner",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationReviewDecision({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationReviewDecision({
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
            createEngineeringAIWorkforceFormalQualificationReviewDecision({
              ...input(),

              reviewedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
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
          createEngineeringAIWorkforceFormalQualificationReviewDecision(
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
          createEngineeringAIWorkforceFormalQualificationReviewDecision(
            input(),
          );

        const second =
          createEngineeringAIWorkforceFormalQualificationReviewDecision(
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
        ).toBe(8);

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
            validateEngineeringAIWorkforceFormalQualificationReviewDecision(
              first,
            ),
        ).not.toThrow();
      },
    );
  },
);
