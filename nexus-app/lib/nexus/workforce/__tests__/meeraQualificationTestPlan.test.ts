import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES,
} from "../meeraQuotationProposalSpecialistQualificationStandard";

import {
  createMeeraQualificationReadinessAssessment,
} from "../meeraQualificationReadinessAssessment";

import {
  createMeeraOwnerQualificationReviewDecision,
} from "../meeraOwnerQualificationReviewDecision";

import {
  createMeeraQualificationTestingAdmission,
} from "../meeraQualificationTestingAdmission";

import {
  createMeeraQualificationTestPlan,
  validateMeeraQualificationTestPlan,
  type MeeraQualificationTestPlan,
} from "../meeraQualificationTestPlan";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function createAdmission() {
  const readiness =
    createMeeraQualificationReadinessAssessment({
      assessmentId:
        "meera-readiness-assessment-001",
      employeeId:
        "employee-meera-quotation-proposal-specialist-v1",
      templateId:
        "template-meera-quotation-proposal-specialist-v1",
      tenantId:
        "tenant-nexus-internal-001",
      ownerId:
        "owner-prashant-001",
      evaluatedAt:
        "2026-07-17T15:30:00.000Z",
      caseEvidence:
        MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
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
    createMeeraOwnerQualificationReviewDecision({
      decisionId:
        "meera-owner-review-decision-001",
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
        "2026-07-17T15:45:00.000Z",
    });

  return createMeeraQualificationTestingAdmission({
    admissionId:
      "meera-testing-admission-001",
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
      "2026-07-17T16:00:00.000Z",
  });
}

function createInput() {
  return {
    planId:
      "meera-qualification-plan-001",
    admission:
      createAdmission(),
    tenantId:
      "tenant-nexus-internal-001",
    ownerId:
      "owner-prashant-001",
    plannedAt:
      "2026-07-17T16:15:00.000Z",
  };
}

describe(
  "Meera qualification test plan",
  () => {
    it(
      "prepares exactly twelve canonical qualification cases",
      () => {
        const plan =
          createMeeraQualificationTestPlan(
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
          createMeeraQualificationTestPlan(
            createInput(),
          );

        expect(
          plan.plannedCases.map(
            (plannedCase) =>
              plannedCase.caseId,
          ),
        ).toEqual(
          MEERA_QUOTATION_PROPOSAL_SPECIALIST_QUALIFICATION_CASES.map(
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
          createMeeraQualificationTestPlan(
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
          createMeeraQualificationTestPlan(
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
          createMeeraQualificationTestPlan(
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
          createMeeraQualificationTestPlan(
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
          createMeeraQualificationTestPlan(
            createInput(),
          );

        const second =
          createMeeraQualificationTestPlan(
            createInput(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.plannedCases)).toBe(true);

        expect(
          () =>
            validateMeeraQualificationTestPlan(
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
            createMeeraQualificationTestPlan({
              ...createInput(),
              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createMeeraQualificationTestPlan({
              ...createInput(),
              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "admission-bound owner",
        );

        const valid =
          createMeeraQualificationTestPlan(
            createInput(),
          );

        const tampered = {
          ...valid,
          totalPlannedCases:
            11,
        } as unknown as
          MeeraQualificationTestPlan;

        expect(
          () =>
            validateMeeraQualificationTestPlan(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);
