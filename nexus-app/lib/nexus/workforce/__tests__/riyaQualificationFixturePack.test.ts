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
  validateRiyaQualificationFixturePack,
  type RiyaQualificationFixturePack,
} from "../riyaQualificationFixturePack";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createPlan() {
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
        "All qualification evidence passed and formal sandbox testing may proceed.",
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
      "riya-qualification-plan-001",
    admission,
    tenantId:
      admission.tenantId,
    ownerId:
      admission.ownerId,
    plannedAt:
      "2026-07-16T15:45:00.000Z",
  });
}

function createInput() {
  return {
    fixturePackId:
      "riya-fixture-pack-001",
    plan:
      createPlan(),
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-16T16:00:00.000Z",
  };
}

describe(
  "Riya qualification fixture pack",
  () => {
    it(
      "prepares exactly twelve canonical fixtures",
      () => {
        const fixturePack =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        expect(fixturePack).toMatchObject({
          fixturePackState:
            "QUALIFICATION_FIXTURE_PACK_PREPARED",
          totalFixtures:
            12,
        });

        expect(
          fixturePack.fixtures,
        ).toHaveLength(12);
      },
    );

    it(
      "preserves canonical case order",
      () => {
        const fixturePack =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        expect(
          fixturePack.fixtures.map(
            (fixture) =>
              fixture.caseId,
          ),
        ).toEqual(
          RIYA_RECOMMENDATION_SPECIALIST_QUALIFICATION_CASES.map(
            (qualificationCase) =>
              qualificationCase.caseId,
          ),
        );
      },
    );

    it(
      "binds fixtures to plan and upstream evidence",
      () => {
        const input =
          createInput();

        const fixturePack =
          createRiyaQualificationFixturePack(
            input,
          );

        expect(fixturePack).toMatchObject({
          planId:
            input.plan.planId,
          planDigest:
            input.plan.planDigest,
          admissionId:
            input.plan.admissionId,
          admissionDigest:
            input.plan.admissionDigest,
          decisionId:
            input.plan.decisionId,
          readinessAssessmentId:
            input.plan.readinessAssessmentId,
        });
      },
    );

    it(
      "marks unsafe cases for owner escalation",
      () => {
        const fixturePack =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        const blockedCases =
          fixturePack.fixtures
            .filter(
              (fixture) =>
                fixture.expectedControl ===
                "BLOCK_AND_ESCALATE_TO_OWNER",
            )
            .map(
              (fixture) =>
                fixture.caseId,
            );

        expect(blockedCases).toEqual([
          "riya-case-008",
          "riya-case-011",
          "riya-case-012",
        ]);
      },
    );

    it(
      "uses synthetic sandbox fixtures without external effects",
      () => {
        const fixturePack =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        expect(
          fixturePack.fixtures.every(
            (fixture) =>
              fixture.executionMode ===
                "SANDBOX_ONLY" &&
              fixture.syntheticOnly ===
                true &&
              fixture.realCustomerDataIncluded ===
                false &&
              fixture.externalEffectAllowed ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not execute testing or issue qualification",
      () => {
        const fixturePack =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        expect(
          fixturePack.executionBoundary,
        ).toMatchObject({
          testPlanPrepared:
            true,
          fixturePackPrepared:
            true,
          qualificationTestingExecuted:
            false,
          formalQualificationIssued:
            false,
          productionReady:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable valid evidence",
      () => {
        const first =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        const second =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.fixtures)).toBe(true);

        expect(
          () =>
            validateRiyaQualificationFixturePack(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-scope and tampered fixture packs",
      () => {
        expect(
          () =>
            createRiyaQualificationFixturePack({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createRiyaQualificationFixturePack({
              ...createInput(),
              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "plan-bound owner",
        );

        const valid =
          createRiyaQualificationFixturePack(
            createInput(),
          );

        const tampered = {
          ...valid,
          totalFixtures:
            11,
        } as unknown as
          RiyaQualificationFixturePack;

        expect(
          () =>
            validateRiyaQualificationFixturePack(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);