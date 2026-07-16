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
  validateRiyaFormalQualificationFixturePack,
  type RiyaFormalQualificationFixturePack,
} from "../riyaFormalQualificationFixturePack";

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

function input() {
  return {
    fixturePackId:
      "riya-formal-fixture-pack-001",

    plan:
      formalPlan(),

    tenantId:
      "tenant-nexus-internal-001",

    ownerId:
      "owner-prashant-001",

    preparedAt:
      "2026-07-16T16:15:00.000Z",
  };
}

describe(
  "Riya formal qualification fixture pack",
  () => {
    it(
      "creates exactly one hundred immutable sanitized synthetic fixtures",
      () => {
        const pack =
          createRiyaFormalQualificationFixturePack(
            input(),
          );

        expect(
          pack.fixtures,
        ).toHaveLength(100);

        expect(
          pack.summary,
        ).toMatchObject({
          totalFixtures:
            100,

          sanitizedSyntheticFixtures:
            100,

          customerDataFixtures:
            0,

          executedFixtures:
            0,

          collectedEvidenceCount:
            0,
        });

        expect(
          Object.isFrozen(pack),
        ).toBe(true);

        expect(
          Object.isFrozen(
            pack.fixtures,
          ),
        ).toBe(true);
      },
    );

    it(
      "binds one unique fixture and digest to every formal planned case",
      () => {
        const pack =
          createRiyaFormalQualificationFixturePack(
            input(),
          );

        expect(
          new Set(
            pack.fixtures.map(
              (fixture) =>
                fixture.fixtureId,
            ),
          ).size,
        ).toBe(100);

        expect(
          new Set(
            pack.fixtures.map(
              (fixture) =>
                fixture.fixtureDigest,
            ),
          ).size,
        ).toBe(100);

        expect(
          new Set(
            pack.fixtures.map(
              (fixture) =>
                fixture.caseId,
            ),
          ).size,
        ).toBe(100);

        for (
          const fixture of
          pack.fixtures
        ) {
          const plannedCase =
            input().plan.plannedCases.find(
              (candidate) =>
                candidate.caseId ===
                fixture.caseId,
            );

          expect(
            plannedCase,
          ).toBeDefined();

          expect(
            fixture.casePlanDigest,
          ).toBe(
            plannedCase?.casePlanDigest,
          );
        }
      },
    );

    it(
      "preserves every mandatory qualification category count",
      () => {
        const pack =
          createRiyaFormalQualificationFixturePack(
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
            pack.fixtures.filter(
              (fixture) =>
                fixture.category ===
                category,
            ),
          ).toHaveLength(
            minimum,
          );
        }
      },
    );

    it(
      "contains no customer data secrets production identifiers or external requests",
      () => {
        const pack =
          createRiyaFormalQualificationFixturePack(
            input(),
          );

        for (
          const fixture of
          pack.fixtures
        ) {
          expect(
            fixture.fixtureMode,
          ).toBe(
            "SANITIZED_SYNTHETIC_ONLY",
          );

          expect(
            fixture.syntheticInput,
          ).toMatchObject({
            customerDataIncluded:
              false,

            secretsIncluded:
              false,

            productionIdentifiersIncluded:
              false,

            externalDeliveryRequested:
              false,

            liveProviderExecutionRequested:
              false,

            paymentExecutionRequested:
              false,

            productionMutationRequested:
              false,
          });
        }
      },
    );

    it(
      "blocks cross-tenant cross-owner and premature fixture preparation",
      () => {
        expect(
          () =>
            createRiyaFormalQualificationFixturePack({
              ...input(),

              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createRiyaFormalQualificationFixturePack({
              ...input(),

              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "formal-plan-bound owner",
        );

        expect(
          () =>
            createRiyaFormalQualificationFixturePack({
              ...input(),

              preparedAt:
                "2026-07-16T15:59:59.000Z",
            }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "blocks tampered plan and fixture evidence",
      () => {
        const validInput =
          input();

        const tamperedPlan = {
          ...validInput.plan,

          planDigest:
            digest(
              "tampered-plan",
            ),
        };

        expect(
          () =>
            createRiyaFormalQualificationFixturePack({
              ...validInput,

              plan:
                tamperedPlan,
            }),
        ).toThrow();

        const validPack =
          createRiyaFormalQualificationFixturePack(
            validInput,
          );

        const tamperedPack = {
          ...validPack,

          fixtures: [
            {
              ...validPack.fixtures[0],

              executionState:
                "NOT_EXECUTED",

              passed:
                true,
            },

            ...validPack.fixtures.slice(
              1,
            ),
          ],
        } as unknown as
          RiyaFormalQualificationFixturePack;

        expect(
          () =>
            validateRiyaFormalQualificationFixturePack(
              tamperedPack,
              validInput.plan,
            ),
        ).toThrow();
      },
    );

    it(
      "creates deterministic immutable fixture and pack digests",
      () => {
        const firstInput =
          input();

        const secondInput =
          input();

        const first =
          createRiyaFormalQualificationFixturePack(
            firstInput,
          );

        const second =
          createRiyaFormalQualificationFixturePack(
            secondInput,
          );

        expect(first).toEqual(second);

        expect(
          () =>
            validateRiyaFormalQualificationFixturePack(
              first,
              firstInput.plan,
            ),
        ).not.toThrow();
      },
    );

    it(
      "does not execute tests fabricate passing evidence or grant production authority",
      () => {
        const pack =
          createRiyaFormalQualificationFixturePack(
            input(),
          );

        for (
          const fixture of
          pack.fixtures
        ) {
          expect(fixture).toMatchObject({
            executionState:
              "NOT_EXECUTED",

            evidenceState:
              "NOT_COLLECTED",

            passed:
              null,

            evidenceDigest:
              null,

            executedAt:
              null,
          });
        }

        expect(
          pack.authorityBoundary,
        ).toMatchObject({
          formalQualificationFixturesCreated:
            true,

          qualificationTestingExecuted:
            false,

          qualificationEvidenceCollected:
            false,

          syntheticPassingEvidenceCreated:
            false,

          hardCodedPassingEvidenceAccepted:
            false,

          qualificationEngineInvoked:
            false,

          formalQualificationIssued:
            false,

          qualifiedManifestCreated:
            false,

          activationCandidateCreated:
            false,

          runtimeActivated:
            false,

          customerContactAuthorized:
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