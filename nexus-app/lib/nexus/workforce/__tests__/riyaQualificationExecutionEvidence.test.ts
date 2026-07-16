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
  validateRiyaQualificationExecutionEvidence,
  type RiyaQualificationExecutionEvidenceLedger,
} from "../riyaQualificationExecutionEvidence";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function fixturePack() {
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

  const decision =
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
        "All evidence passed and controlled sandbox qualification testing may proceed.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createRiyaQualificationTestingAdmission({
      admissionId:
        "riya-testing-admission-001",

      decision,

      employeeId:
        decision.employeeId,

      templateId:
        decision.templateId,

      tenantId:
        decision.tenantId,

      ownerId:
        decision.ownerId,

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

  return createRiyaQualificationFixturePack({
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
}

function input() {
  return {
    ledgerId:
      "riya-evidence-ledger-001",

    fixturePack:
      fixturePack(),

    ownerId:
      "owner-prashant-001",

    evaluatorId:
      "evaluator-independent-001",

    executedAt:
      "2026-07-16T16:15:00.000Z",
  };
}

describe(
  "Riya qualification execution evidence",
  () => {
    it(
      "executes exactly twelve synthetic qualification fixtures",
      async () => {
        const ledger =
          await executeRiyaQualificationEvidence(
            input(),
          );

        expect(ledger).toMatchObject({
          ledgerState:
            "SYNTHETIC_ASSERTION_EVIDENCE_CAPTURED",

          summary: {
            qualificationCasesExecuted:
              12,

            qualificationCasesPassed:
              12,

            qualificationCasesFailed:
              0,

            qualificationEvidenceCollected:
              12,
          },
        });

        expect(
          ledger.evidenceBindings,
        ).toHaveLength(12);
      },
    );

    it(
      "creates unique assertion-derived evidence for every fixture",
      async () => {
        const ledger =
          await executeRiyaQualificationEvidence(
            input(),
          );

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.fixtureId,
            ),
          ).size,
        ).toBe(12);

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.evidenceDigest,
            ),
          ).size,
        ).toBe(12);

        expect(
          ledger.evidenceBindings.every(
            (binding) =>
              binding.assertionDerivedEvidence ===
                true &&
              binding.hardCodedPassingEvidenceAccepted ===
                false &&
              binding.passed ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves safe-draft and owner-escalation coverage",
      async () => {
        const ledger =
          await executeRiyaQualificationEvidence(
            input(),
          );

        expect(
          ledger.summary,
        ).toMatchObject({
          safeRecommendationDraftCases:
            9,

          ownerEscalationCases:
            3,
        });
      },
    );

    it(
      "creates deterministic immutable valid execution evidence",
      async () => {
        const first =
          await executeRiyaQualificationEvidence(
            input(),
          );

        const second =
          await executeRiyaQualificationEvidence(
            input(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceBindings,
          ),
        ).toBe(true);

        expect(
          () =>
            validateRiyaQualificationExecutionEvidence(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-owner qualification execution",
      async () => {
        await expect(
          executeRiyaQualificationEvidence({
            ...input(),

            ownerId:
              "owner-other-001",
          }),
        ).rejects.toThrow(
          "fixture-pack-bound owner",
        );
      },
    );

    it(
      "blocks the owner acting as independent evaluator",
      async () => {
        await expect(
          executeRiyaQualificationEvidence({
            ...input(),

            evaluatorId:
              "owner-prashant-001",
          }),
        ).rejects.toThrow(
          "distinct from the owner",
        );
      },
    );

    it(
      "blocks early execution and tampered evidence",
      async () => {
        await expect(
          executeRiyaQualificationEvidence({
            ...input(),

            executedAt:
              "2026-07-16T15:59:59.000Z",
          }),
        ).rejects.toThrow(
          "cannot precede fixture preparation",
        );

        const valid =
          await executeRiyaQualificationEvidence(
            input(),
          );

        const tampered = {
          ...valid,

          summary: {
            ...valid.summary,

            qualificationCasesPassed:
              11,
          },
        } as unknown as
          RiyaQualificationExecutionEvidenceLedger;

        expect(
          () =>
            validateRiyaQualificationExecutionEvidence(
              tampered,
            ),
        ).toThrow(
          "summary is invalid",
        );
      },
    );

    it(
      "does not issue qualification or real-world authority",
      async () => {
        const ledger =
          await executeRiyaQualificationEvidence(
            input(),
          );

        expect(
          ledger.nextStep,
        ).toBe(
          "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION",
        );

        expect(
          ledger.authorityBoundary,
        ).toMatchObject({
          qualificationTestingExecuted:
            true,

          qualificationEvidenceCollected:
            true,

          formalQualificationIssued:
            false,

          automaticQualificationBlocked:
            true,

          ownerCertificationRequired:
            true,

          productionReady:
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

          publicLaunchAuthorized:
            false,
        });
      },
    );
  },
);