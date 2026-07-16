import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES,
} from "../riyaRecommendationSpecialistQualificationStandard";

import {
  createRiyaQualificationReadinessAssessment,
} from "../riyaQualificationReadinessAssessment";

import {
  createRiyaOwnerQualificationReviewDecision,
} from "../riyaOwnerQualificationReviewDecision";

import {
  createRiyaQualificationTestingAdmission,
} from "../riyaQualificationTestingAdmission";

import {
  createRiyaQualificationTestPlan,
} from "../riyaQualificationTestPlan";

import {
  createRiyaQualificationFixturePack,
} from "../riyaQualificationFixturePack";

import {
  executeRiyaQualificationEvidence,
} from "../riyaQualificationExecutionEvidence";

import {
  createRiyaFormalQualificationReviewDecision,
  validateRiyaFormalQualificationReviewDecision,
  type RiyaFormalQualificationReviewDecision,
} from "../riyaFormalQualificationReviewDecision";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

async function evidenceLedger() {
  const readiness =
    createRiyaQualificationReadinessAssessment({
      assessmentId:
        "riya-readiness-assessment-001",

      employeeId:
        "employee-riya-recommendation-specialist-v1",

      templateId:
        "template-riya-recommendation-specialist-v1",

      tenantId:
        "tenant-nexus-internal-001",

      ownerId:
        "owner-prashant-001",

      evaluatedAt:
        "2026-07-16T15:00:00.000Z",

      caseEvidence:
        RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES.map(
          (
            qualificationCase,
            index,
          ) => ({
            caseId:
              qualificationCase.caseId,

            passed:
              true,

            evidenceDigest:
              digest(
                `${qualificationCase.caseId}:${index}`,
              ),
          }),
        ),

      safetyEvidence: {
        sandboxOnlyPassed:
          true,
        tenantIsolationPassed:
          true,
        customerContextIsolationPassed:
          true,
        unsupportedClaimsBlocked:
          true,
        realCustomerContactPerformed:
          false,
        externalDeliveryPerformed:
          false,
        liveProviderExecutionPerformed:
          false,
        productionDatabaseTouched:
          false,
        paymentExecutionPerformed:
          false,
        autonomousDecisionPerformed:
          false,
      },
    });

  const admissionDecision =
    createRiyaOwnerQualificationReviewDecision({
      decisionId:
        "riya-owner-review-decision-001",

      readiness,

      tenantId:
        readiness.tenantId,

      ownerId:
        readiness.ownerId,

      decision:
        "APPROVE_FORMAL_QUALIFICATION_TESTING",

      rationale:
        "Controlled sandbox qualification testing is approved based on complete evidence.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createRiyaQualificationTestingAdmission({
      admissionId:
        "riya-testing-admission-001",

      decision:
        admissionDecision,

      employeeId:
        admissionDecision.employeeId,

      templateId:
        admissionDecision.templateId,

      tenantId:
        admissionDecision.tenantId,

      ownerId:
        admissionDecision.ownerId,

      preparedAt:
        "2026-07-16T15:30:00.000Z",
    });

  const plan =
    createRiyaQualificationTestPlan({
      planId:
        "riya-qualification-plan-001",

      admission,

      tenantId:
        admission.tenantId,

      ownerId:
        admission.ownerId,

      plannedAt:
        "2026-07-16T15:45:00.000Z",
    });

  const fixturePack =
    createRiyaQualificationFixturePack({
      fixturePackId:
        "riya-fixture-pack-001",

      plan,

      tenantId:
        plan.tenantId,

      ownerId:
        plan.ownerId,

      preparedAt:
        "2026-07-16T16:00:00.000Z",
    });

  return executeRiyaQualificationEvidence({
    ledgerId:
      "riya-evidence-ledger-001",

    fixturePack,

    ownerId:
      fixturePack.ownerId,

    evaluatorId:
      "evaluator-independent-001",

    executedAt:
      "2026-07-16T16:15:00.000Z",
  });
}

async function approvedDecision() {
  const ledger =
    await evidenceLedger();

  return createRiyaFormalQualificationReviewDecision({
    decisionId:
      "riya-formal-review-001",

    evidenceLedger:
      ledger,

    tenantId:
      ledger.tenantId,

    ownerId:
      ledger.ownerId,

    outcome:
      "APPROVE_FORMAL_QUALIFICATION",

    rationale:
      "All twelve synthetic qualification cases passed with unique assertion-derived evidence.",

    reviewedAt:
      "2026-07-16T16:30:00.000Z",
  });
}

describe(
  "Riya formal qualification review decision",
  () => {
    it(
      "allows the evidence-bound owner to approve formal engine admission",
      async () => {
        const decision =
          await approvedDecision();

        expect(decision).toMatchObject({
          decisionState:
            "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED",

          outcome:
            "APPROVE_FORMAL_QUALIFICATION",

          nextStep:
            "INVOKE_FORMAL_QUALIFICATION_ENGINE",
        });

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(true);
      },
    );

    it(
      "records rejection without formal engine authority",
      async () => {
        const ledger =
          await evidenceLedger();

        const decision =
          createRiyaFormalQualificationReviewDecision({
            decisionId:
              "riya-formal-review-rejected-001",

            evidenceLedger:
              ledger,

            tenantId:
              ledger.tenantId,

            ownerId:
              ledger.ownerId,

            outcome:
              "REJECT_FORMAL_QUALIFICATION",

            rationale:
              "Owner requires controlled requalification before any formal qualification engine invocation.",

            reviewedAt:
              "2026-07-16T16:30:00.000Z",
          });

        expect(decision).toMatchObject({
          decisionState:
            "FORMAL_QUALIFICATION_REJECTED",

          nextStep:
            "RETURN_TO_CONTROLLED_REQUALIFICATION",
        });

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "blocks cross-tenant formal qualification review",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-cross-tenant",

              evidenceLedger:
                ledger,

              tenantId:
                "tenant-other-001",

              ownerId:
                ledger.ownerId,

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled qualification evidence has been reviewed and approved.",

              reviewedAt:
                "2026-07-16T16:30:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant",
        );
      },
    );

    it(
      "blocks cross-owner formal qualification review",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-cross-owner",

              evidenceLedger:
                ledger,

              tenantId:
                ledger.tenantId,

              ownerId:
                "owner-other-001",

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled qualification evidence has been reviewed and approved.",

              reviewedAt:
                "2026-07-16T16:30:00.000Z",
            }),
        ).toThrow(
          "evidence-bound owner",
        );
      },
    );

    it(
      "blocks review before evidence execution",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-early",

              evidenceLedger:
                ledger,

              tenantId:
                ledger.tenantId,

              ownerId:
                ledger.ownerId,

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled qualification evidence has been reviewed and approved.",

              reviewedAt:
                "2026-07-16T16:14:59.000Z",
            }),
        ).toThrow(
          "cannot precede evidence execution",
        );
      },
    );

    it(
      "requires a meaningful owner rationale",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-no-rationale",

              evidenceLedger:
                ledger,

              tenantId:
                ledger.tenantId,

              ownerId:
                ledger.ownerId,

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "Approved.",

              reviewedAt:
                "2026-07-16T16:30:00.000Z",
            }),
        ).toThrow(
          "meaningful safe rationale",
        );
      },
    );

    it(
      "creates deterministic immutable valid owner decisions",
      async () => {
        const first =
          await approvedDecision();

        const second =
          await approvedDecision();

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.evidenceSummary)).toBe(true);

        expect(
          () =>
            validateRiyaFormalQualificationReviewDecision(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "RETURN_TO_CONTROLLED_REQUALIFICATION",
        } as unknown as
          RiyaFormalQualificationReviewDecision;

        expect(
          () =>
            validateRiyaFormalQualificationReviewDecision(
              tampered,
            ),
        ).toThrow(
          "state is invalid",
        );
      },
    );

    it(
      "does not invoke qualification create a manifest or activate runtime",
      async () => {
        const decision =
          await approvedDecision();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
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

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
            false,

          liveProviderExecutionAuthorized:
            false,

          productionMutationAuthorized:
            false,

          paymentExecutionAuthorized:
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
  },
);