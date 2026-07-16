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
  createRiyaFormalQualificationTestPlan,
} from "../riyaFormalQualificationTestPlan";

import {
  createRiyaFormalQualificationFixturePack,
} from "../riyaFormalQualificationFixturePack";

import {
  executeRiyaFormalQualificationEvidence,
} from "../riyaFormalQualificationExecutionEvidence";

import {
  createRiyaFormalQualificationReviewDecision,
  validateRiyaFormalQualificationReviewDecision,
  type RiyaFormalQualificationReviewDecision,
} from "../riyaFormalQualificationReviewDecision";

import {
  createHash,
} from "node:crypto";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function specialistPlan() {
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

  const ownerDecision =
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
        "Controlled qualification testing is approved after complete specialist evidence review.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createRiyaQualificationTestingAdmission({
      admissionId:
        "riya-testing-admission-001",

      decision:
        ownerDecision,

      employeeId:
        ownerDecision.employeeId,

      templateId:
        ownerDecision.templateId,

      tenantId:
        ownerDecision.tenantId,

      ownerId:
        ownerDecision.ownerId,

      preparedAt:
        "2026-07-16T15:30:00.000Z",
    });

  return createRiyaQualificationTestPlan({
    planId:
      "riya-specialist-plan-001",

    admission,

    tenantId:
      admission.tenantId,

    ownerId:
      admission.ownerId,

    plannedAt:
      "2026-07-16T15:45:00.000Z",
  });
}

function formalSource() {
  const plan =
    createRiyaFormalQualificationTestPlan({
      planId:
        "riya-formal-plan-001",

      specialistPlan:
        specialistPlan(),

      tenantId:
        "tenant-nexus-internal-001",

      ownerId:
        "owner-prashant-001",

      evaluatorId:
        "evaluator-independent-001",

      registryCreatedAt:
        "2026-07-16T14:00:00.000Z",

      preparedAt:
        "2026-07-16T16:00:00.000Z",
    });

  const fixturePack =
    createRiyaFormalQualificationFixturePack({
      fixturePackId:
        "riya-formal-fixture-pack-001",

      plan,

      tenantId:
        plan.tenantId,

      ownerId:
        plan.ownerId,

      preparedAt:
        "2026-07-16T16:15:00.000Z",
    });

  return {
    plan,
    fixturePack,
  };
}

async function reviewSource() {
  const source =
    formalSource();

  const evidenceLedger =
    await executeRiyaFormalQualificationEvidence({
      ledgerId:
        "riya-formal-evidence-ledger-001",

      plan:
        source.plan,

      fixturePack:
        source.fixturePack,

      ownerId:
        source.plan.ownerId,

      evaluatorId:
        source.plan.evaluatorId,

      executedAt:
        "2026-07-16T16:30:00.000Z",
    });

  return {
    ...source,
    evidenceLedger,
  };
}

async function approvedDecision() {
  const source =
    await reviewSource();

  return createRiyaFormalQualificationReviewDecision({
    decisionId:
      "riya-formal-review-100-case-001",

    evidenceLedger:
      source.evidenceLedger,

    plan:
      source.plan,

    fixturePack:
      source.fixturePack,

    tenantId:
      source.evidenceLedger.tenantId,

    ownerId:
      source.evidenceLedger.ownerId,

    outcome:
      "APPROVE_FORMAL_QUALIFICATION",

    rationale:
      "Owner reviewed all one hundred controlled formal cases and all one thousand three hundred assertion-derived results.",

    reviewedAt:
      "2026-07-16T16:45:00.000Z",
  });
}

describe(
  "Riya 100-case formal qualification owner review",
  () => {
    it(
      "records owner approval against the complete formal evidence ledger",
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

          evidenceSummary: {
            qualificationCasesExecuted:
              100,

            qualificationCasesPassed:
              100,

            qualificationCasesFailed:
              0,

            qualificationEvidenceCount:
              100,

            assertionsExecuted:
              1300,

            assertionsPassed:
              1300,

            assertionsFailed:
              0,
          },
        });

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(true);
      },
    );

    it(
      "preserves mandatory qualification-category coverage",
      async () => {
        const decision =
          await approvedDecision();

        expect(
          decision.evidenceSummary,
        ).toMatchObject({
          normalOperationCases:
            30,

          adversarialCases:
            15,

          tenantIsolationCases:
            15,

          ownerControlCases:
            15,

          emergencyPauseCases:
            5,

          departmentHandoffCases:
            10,

          auditEvidenceCases:
            5,

          failureRecoveryCases:
            5,
        });
      },
    );

    it(
      "records rejection without qualification-engine authority",
      async () => {
        const source =
          await reviewSource();

        const decision =
          createRiyaFormalQualificationReviewDecision({
            decisionId:
              "riya-formal-review-rejected-001",

            evidenceLedger:
              source.evidenceLedger,

            plan:
              source.plan,

            fixturePack:
              source.fixturePack,

            tenantId:
              source.evidenceLedger.tenantId,

            ownerId:
              source.evidenceLedger.ownerId,

            outcome:
              "REJECT_FORMAL_QUALIFICATION",

            rationale:
              "Owner requires controlled requalification before any formal qualification-engine invocation.",

            reviewedAt:
              "2026-07-16T16:45:00.000Z",
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
      "blocks cross-tenant and cross-owner review",
      async () => {
        const source =
          await reviewSource();

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-cross-tenant",

              evidenceLedger:
                source.evidenceLedger,

              plan:
                source.plan,

              fixturePack:
                source.fixturePack,

              tenantId:
                "tenant-other-001",

              ownerId:
                source.evidenceLedger.ownerId,

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled formal qualification evidence was reviewed and approved by the owner.",

              reviewedAt:
                "2026-07-16T16:45:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-cross-owner",

              evidenceLedger:
                source.evidenceLedger,

              plan:
                source.plan,

              fixturePack:
                source.fixturePack,

              tenantId:
                source.evidenceLedger.tenantId,

              ownerId:
                "owner-other-001",

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled formal qualification evidence was reviewed and approved by the owner.",

              reviewedAt:
                "2026-07-16T16:45:00.000Z",
            }),
        ).toThrow(
          "evidence-bound owner",
        );
      },
    );

    it(
      "blocks review before formal evidence execution",
      async () => {
        const source =
          await reviewSource();

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-early",

              evidenceLedger:
                source.evidenceLedger,

              plan:
                source.plan,

              fixturePack:
                source.fixturePack,

              tenantId:
                source.evidenceLedger.tenantId,

              ownerId:
                source.evidenceLedger.ownerId,

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled formal qualification evidence was reviewed and approved by the owner.",

              reviewedAt:
                "2026-07-16T16:29:59.000Z",
            }),
        ).toThrow(
          "cannot precede evidence execution",
        );
      },
    );

    it(
      "blocks tampered formal evidence and source bindings",
      async () => {
        const source =
          await reviewSource();

        const tamperedLedger = {
          ...source.evidenceLedger,

          summary: {
            ...source.evidenceLedger.summary,

            assertionsPassed:
              1299,
          },
        };

        expect(
          () =>
            createRiyaFormalQualificationReviewDecision({
              decisionId:
                "riya-formal-review-tampered",

              evidenceLedger:
                tamperedLedger as typeof source.evidenceLedger,

              plan:
                source.plan,

              fixturePack:
                source.fixturePack,

              tenantId:
                source.evidenceLedger.tenantId,

              ownerId:
                source.evidenceLedger.ownerId,

              outcome:
                "APPROVE_FORMAL_QUALIFICATION",

              rationale:
                "All controlled formal qualification evidence was reviewed and approved by the owner.",

              reviewedAt:
                "2026-07-16T16:45:00.000Z",
            }),
        ).toThrow();
      },
    );

    it(
      "creates deterministic immutable valid decisions",
      async () => {
        const first =
          await approvedDecision();

        const second =
          await approvedDecision();

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceSummary,
          ),
        ).toBe(true);

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
      "records only the review decision and grants no runtime or external authority",
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
