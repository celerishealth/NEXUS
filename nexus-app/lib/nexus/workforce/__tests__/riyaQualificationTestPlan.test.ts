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
  validateRiyaQualificationTestPlan,
  type RiyaQualificationTestPlan,
} from "../riyaQualificationTestPlan";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createAdmission() {
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

  return createRiyaQualificationTestingAdmission({
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
}

function createInput() {
  return {
    planId:
      "riya-qualification-plan-001",
    admission:
      createAdmission(),
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    plannedAt:
      "2026-07-16T15:45:00.000Z",
  };
}

describe(
  "Riya qualification test plan",
  () => {
    it(
      "prepares exactly twelve canonical qualification cases",
      () => {
        const plan =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        expect(plan).toMatchObject({
          planState:
            "QUALIFICATION_TEST_PLAN_PREPARED",
          totalPlannedCases:
            12,
        });

        expect(
          plan.plannedCases,
        ).toHaveLength(12);
      },
    );

    it(
      "preserves canonical qualification case order",
      () => {
        const plan =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        expect(
          plan.plannedCases.map(
            (plannedCase) =>
              plannedCase.caseId,
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
      "binds the plan to admission decision and readiness evidence",
      () => {
        const input =
          createInput();

        const plan =
          createRiyaQualificationTestPlan(
            input,
          );

        expect(plan).toMatchObject({
          admissionId:
            input.admission.admissionId,
          admissionDigest:
            input.admission.admissionDigest,
          decisionId:
            input.admission.decisionId,
          decisionDigest:
            input.admission.decisionDigest,
          readinessAssessmentId:
            input.admission.readinessAssessmentId,
          readinessDigest:
            input.admission.readinessDigest,
        });
      },
    );

    it(
      "makes every planned case sandbox-only and evidence-bound",
      () => {
        const plan =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        expect(
          plan.plannedCases.every(
            (plannedCase) =>
              plannedCase.executionMode ===
                "SANDBOX_ONLY" &&
              plannedCase.evidenceRequired ===
                true,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not execute testing or issue qualification",
      () => {
        const plan =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        expect(
          plan.executionBoundary,
        ).toEqual({
          testPlanPrepared:
            true,
          fixturePackPrepared:
            false,
          qualificationTestingExecuted:
            false,
          formalQualificationIssued:
            false,
          automaticQualificationBlocked:
            true,
          productionReady:
            false,
        });
      },
    );

    it(
      "keeps every real-world authority blocked",
      () => {
        const plan =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        expect(
          Object.values(
            plan.authorityBoundary,
          ).every(
            (authorized) =>
              authorized === false,
          ),
        ).toBe(true);
      },
    );

    it(
      "creates deterministic immutable valid evidence",
      () => {
        const first =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        const second =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.plannedCases)).toBe(true);

        expect(
          () =>
            validateRiyaQualificationTestPlan(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-tenant owner and tampered plans",
      () => {
        expect(
          () =>
            createRiyaQualificationTestPlan({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createRiyaQualificationTestPlan({
              ...createInput(),
              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "admission-bound owner",
        );

        const valid =
          createRiyaQualificationTestPlan(
            createInput(),
          );

        const tampered = {
          ...valid,
          totalPlannedCases:
            11,
        } as unknown as
          RiyaQualificationTestPlan;

        expect(
          () =>
            validateRiyaQualificationTestPlan(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);