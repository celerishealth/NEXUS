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
} from "../meeraQualificationTestPlan";

import {
  createMeeraFormalQualificationTestPlan,
  validateMeeraFormalQualificationTestPlan,
  type MeeraFormalQualificationTestPlan,
} from "../meeraFormalQualificationTestPlan";

function digest(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function specialistPlan() {
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
        "2026-07-16T15:00:00.000Z",

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
        "Controlled qualification testing is approved after complete specialist evidence review.",

      decidedAt:
        "2026-07-16T15:15:00.000Z",
    });

  const admission =
    createMeeraQualificationTestingAdmission({
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
        "2026-07-16T15:30:00.000Z",
    });

  return createMeeraQualificationTestPlan({
    planId:
      "meera-specialist-plan-001",

    admission,

    tenantId:
      admission.tenantId,

    ownerId:
      admission.ownerId,

    plannedAt:
      "2026-07-16T15:45:00.000Z",
  });
}

function input() {
  return {
    planId:
      "meera-formal-plan-001",

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
  };
}

describe(
  "Meera 100-case formal qualification test plan",
  () => {
    it(
      "prepares exactly one hundred unexecuted formal qualification cases",
      () => {
        const plan =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        expect(plan).toMatchObject({
          planState:
            "REGISTERED_TEMPLATE_BOUND_FORMAL_QUALIFICATION_PLAN_PREPARED",

          requiredMinimumTestCases:
            100,

          preparationSummary: {
            plannedCaseCount:
              100,

            unexecutedCaseCount:
              100,

            collectedEvidenceCount:
              0,

            passedCaseCount:
              0,
          },
        });

        expect(
          plan.plannedCases,
        ).toHaveLength(100);
      },
    );

    it(
      "satisfies every generic qualification category minimum",
      () => {
        const plan =
          createMeeraFormalQualificationTestPlan(
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
            plan.plannedCases.filter(
              (plannedCase) =>
                plannedCase.category ===
                category,
            ),
          ).toHaveLength(
            minimum,
          );
        }
      },
    );

    it(
      "binds the canonical registered Meera template",
      () => {
        const plan =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        expect(
          plan.templateBinding,
        ).toMatchObject({
          employeeCode:
            "nx-sales-005",

          publicName:
            "Meera",

          officialRole:
            "AI Quotation & Proposal Specialist",

          department:
            "SALES",

          templateStatus:
            "REGISTERED_UNQUALIFIED",

          controlledActivationEligible:
            false,

          manifestEvaluation: {
            status:
              "UNQUALIFIED",

            testCasesPassed:
              0,

            testCasesRequired:
              100,
          },
        });
      },
    );

    it(
      "covers all twelve specialist source scenarios without duplicate formal identities",
      () => {
        const plan =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        expect(
          new Set(
            plan.plannedCases.map(
              (plannedCase) =>
                plannedCase.sourceSpecialistCaseId,
            ),
          ).size,
        ).toBe(12);

        expect(
          new Set(
            plan.plannedCases.map(
              (plannedCase) =>
                plannedCase.caseId,
            ),
          ).size,
        ).toBe(100);

        expect(
          new Set(
            plan.plannedCases.map(
              (plannedCase) =>
                plannedCase.casePlanDigest,
            ),
          ).size,
        ).toBe(100);
      },
    );

    it(
      "requires an evaluator independent from the owner",
      () => {
        expect(
          () =>
            createMeeraFormalQualificationTestPlan({
              ...input(),

              evaluatorId:
                "owner-prashant-001",
            }),
        ).toThrow(
          "distinct from the owner",
        );
      },
    );

    it(
      "keeps execution qualification activation and production authority blocked",
      () => {
        const plan =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        expect(
          plan.authorityBoundary,
        ).toMatchObject({
          formalQualificationPlanPrepared:
            true,

          formalQualificationFixturesCreated:
            false,

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

    it(
      "creates deterministic immutable valid planning evidence",
      () => {
        const first =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        const second =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        expect(first).toEqual(second);
        expect(Object.isFrozen(first)).toBe(true);
        expect(Object.isFrozen(first.plannedCases)).toBe(true);

        expect(
          () =>
            validateMeeraFormalQualificationTestPlan(
              first,
            ),
        ).not.toThrow();
      },
    );

    it(
      "blocks cross-scope early and tampered formal plans",
      () => {
        expect(
          () =>
            createMeeraFormalQualificationTestPlan({
              ...input(),

              tenantId:
                "tenant-other-001",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            createMeeraFormalQualificationTestPlan({
              ...input(),

              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "specialist-plan-bound owner",
        );

        expect(
          () =>
            createMeeraFormalQualificationTestPlan({
              ...input(),

              preparedAt:
                "2026-07-16T15:44:59.000Z",
            }),
        ).toThrow(
          "cannot precede",
        );

        const valid =
          createMeeraFormalQualificationTestPlan(
            input(),
          );

        const tampered = {
          ...valid,

          requiredMinimumTestCases:
            99,
        } as unknown as
          MeeraFormalQualificationTestPlan;

        expect(
          () =>
            validateMeeraFormalQualificationTestPlan(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );
  },
);
