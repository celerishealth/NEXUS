import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
} from "../employeeQualification";

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
  validateRiyaFormalQualificationExecutionEvidence,
  type RiyaFormalQualificationExecutionEvidenceLedger,
} from "../riyaFormalQualificationExecutionEvidence";

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
        "Controlled qualification testing is approved after complete specialist evidence review.",

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

function formalPlan() {
  return createRiyaFormalQualificationTestPlan({
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
}

function source() {
  const plan =
    formalPlan();

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

function input() {
  const evidenceSource =
    source();

  return {
    ledgerId:
      "riya-formal-evidence-ledger-001",

    plan:
      evidenceSource.plan,

    fixturePack:
      evidenceSource.fixturePack,

    ownerId:
      "owner-prashant-001",

    evaluatorId:
      "evaluator-independent-001",

    executedAt:
      "2026-07-16T16:30:00.000Z",
  };
}

describe(
  "Riya formal qualification execution evidence",
  () => {
    it(
      "executes exactly one hundred controlled formal fixtures",
      async () => {
        const ledger =
          await executeRiyaFormalQualificationEvidence(
            input(),
          );

        expect(
          ledger.evidenceBindings,
        ).toHaveLength(100);

        expect(
          ledger.qualificationCases,
        ).toHaveLength(100);

        expect(
          ledger.summary,
        ).toMatchObject({
          qualificationCasesExecuted:
            100,

          qualificationCasesPassed:
            100,

          qualificationCasesFailed:
            0,

          qualificationEvidenceCollected:
            100,

          assertionsExecuted:
            1300,

          assertionsPassed:
            1300,

          assertionsFailed:
            0,
        });
      },
    );

    it(
      "creates unique assertion-derived evidence for every fixture",
      async () => {
        const ledger =
          await executeRiyaFormalQualificationEvidence(
            input(),
          );

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.fixtureId,
            ),
          ).size,
        ).toBe(100);

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.evidenceDigest,
            ),
          ).size,
        ).toBe(100);

        expect(
          new Set(
            ledger.evidenceBindings.map(
              (binding) =>
                binding.bindingDigest,
            ),
          ).size,
        ).toBe(100);

        for (
          const binding of
          ledger.evidenceBindings
        ) {
          expect(binding).toMatchObject({
            assertionDerivedEvidence:
              true,

            hardCodedPassingEvidenceAccepted:
              false,

            assertionCount:
              13,

            assertionsPassed:
              13,

            passed:
              true,
          });
        }
      },
    );

    it(
      "preserves every mandatory qualification category",
      async () => {
        const ledger =
          await executeRiyaFormalQualificationEvidence(
            input(),
          );

        for (
          const [
            category,
            minimum,
          ] of Object.entries(
            AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
          )
        ) {
          expect(
            ledger.qualificationCases.filter(
              (qualificationCase) =>
                qualificationCase.category ===
                category,
            ),
          ).toHaveLength(
            minimum,
          );
        }
      },
    );

    it(
      "creates deterministic immutable valid evidence",
      async () => {
        const firstInput =
          input();

        const secondInput =
          input();

        const first =
          await executeRiyaFormalQualificationEvidence(
            firstInput,
          );

        const second =
          await executeRiyaFormalQualificationEvidence(
            secondInput,
          );

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceBindings,
          ),
        ).toBe(true);

        expect(
          () =>
            validateRiyaFormalQualificationExecutionEvidence(
              first,
              firstInput.plan,
              firstInput.fixturePack,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-owner evaluator mismatch and owner self-evaluation",
      async () => {
        await expect(
          executeRiyaFormalQualificationEvidence({
            ...input(),

            ownerId:
              "owner-other-001",
          }),
        ).rejects.toThrow(
          "formal-fixture-bound owner",
        );

        await expect(
          executeRiyaFormalQualificationEvidence({
            ...input(),

            evaluatorId:
              "evaluator-other-001",
          }),
        ).rejects.toThrow(
          "does not match",
        );

        const selfEvaluationInput =
          input();

        await expect(
          executeRiyaFormalQualificationEvidence({
            ...selfEvaluationInput,

            evaluatorId:
              selfEvaluationInput.ownerId,
          }),
        ).rejects.toThrow();
      },
    );

    it(
      "blocks early execution and tampered source evidence",
      async () => {
        await expect(
          executeRiyaFormalQualificationEvidence({
            ...input(),

            executedAt:
              "2026-07-16T16:14:59.000Z",
          }),
        ).rejects.toThrow(
          "cannot precede",
        );

        const validInput =
          input();

        const tamperedPack = {
          ...validInput.fixturePack,

          fixturePackDigest:
            digest(
              "tampered-formal-fixture-pack",
            ),
        };

        await expect(
          executeRiyaFormalQualificationEvidence({
            ...validInput,

            fixturePack:
              tamperedPack,
          }),
        ).rejects.toThrow();
      },
    );

    it(
      "blocks tampered assertion-derived ledger evidence",
      async () => {
        const validInput =
          input();

        const ledger =
          await executeRiyaFormalQualificationEvidence(
            validInput,
          );

        const tampered = {
          ...ledger,

          evidenceBindings: [
            {
              ...ledger.evidenceBindings[0],

              assertionsPassed:
                12,
            },

            ...ledger.evidenceBindings.slice(
              1,
            ),
          ],
        } as unknown as
          RiyaFormalQualificationExecutionEvidenceLedger;

        expect(
          () =>
            validateRiyaFormalQualificationExecutionEvidence(
              tampered,
              validInput.plan,
              validInput.fixturePack,
            ),
        ).toThrow(
          "binding integrity",
        );
      },
    );

    it(
      "does not issue qualification activation or real-world authority",
      async () => {
        const ledger =
          await executeRiyaFormalQualificationEvidence(
            input(),
          );

        expect(
          ledger.authorityBoundary,
        ).toMatchObject({
          qualificationTestingExecuted:
            true,

          qualificationEvidenceCollected:
            true,

          hardCodedPassingEvidenceAccepted:
            false,

          syntheticFixturePayloadExecutedAgainstProduction:
            false,

          realCustomerDataUsed:
            false,

          externalEffectPerformed:
            false,

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

          productionReady:
            false,

          realCustomerContactAuthorized:
            false,

          externalDeliveryAuthorized:
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