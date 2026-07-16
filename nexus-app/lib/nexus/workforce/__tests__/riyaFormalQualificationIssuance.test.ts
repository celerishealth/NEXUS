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
} from "../riyaFormalQualificationReviewDecision";

import {
  issueRiyaFormalQualification,
  validateRiyaFormalQualificationIssuance,
  type RiyaFormalQualificationIssuance,
} from "../riyaFormalQualificationIssuance";

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
        "riya-readiness-assessment-day-52",

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
        "riya-owner-review-decision-day-52",

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
        "riya-testing-admission-day-52",

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
      "riya-specialist-plan-day-52",

    admission,

    tenantId:
      admission.tenantId,

    ownerId:
      admission.ownerId,

    plannedAt:
      "2026-07-16T15:45:00.000Z",
  });
}

let cachedSource:
  Awaited<ReturnType<typeof createSource>> |
  null = null;

async function createSource() {
  const plan =
    createRiyaFormalQualificationTestPlan({
      planId:
        "riya-formal-plan-day-52",

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
        "riya-formal-fixture-pack-day-52",

      plan,

      tenantId:
        plan.tenantId,

      ownerId:
        plan.ownerId,

      preparedAt:
        "2026-07-16T16:15:00.000Z",
    });

  const evidenceLedger =
    await executeRiyaFormalQualificationEvidence({
      ledgerId:
        "riya-formal-evidence-ledger-day-52",

      plan,

      fixturePack,

      ownerId:
        plan.ownerId,

      evaluatorId:
        plan.evaluatorId,

      executedAt:
        "2026-07-16T16:30:00.000Z",
    });

  const decision =
    createRiyaFormalQualificationReviewDecision({
      decisionId:
        "riya-formal-review-day-52",

      evidenceLedger,

      plan,

      fixturePack,

      tenantId:
        evidenceLedger.tenantId,

      ownerId:
        evidenceLedger.ownerId,

      outcome:
        "APPROVE_FORMAL_QUALIFICATION",

      rationale:
        "Owner reviewed all one hundred formal cases and all one thousand three hundred assertion-derived results.",

      reviewedAt:
        "2026-07-16T16:45:00.000Z",
    });

  return {
    plan,
    fixturePack,
    evidenceLedger,
    decision,
  };
}

async function source() {
  if (cachedSource === null) {
    cachedSource =
      await createSource();
  }

  return cachedSource;
}

async function issuance() {
  const qualificationSource =
    await source();

  return issueRiyaFormalQualification({
    issuanceId:
      "riya-formal-qualification-issuance-day-52",

    qualificationPlan:
      qualificationSource.plan,

    fixturePack:
      qualificationSource.fixturePack,

    decision:
      qualificationSource.decision,

    evidenceLedger:
      qualificationSource.evidenceLedger,

    tenantId:
      qualificationSource.evidenceLedger.tenantId,

    ownerId:
      qualificationSource.evidenceLedger.ownerId,

    qualifiedAt:
      "2026-07-16T17:00:00.000Z",
  });
}

describe(
  "Riya formal qualification issuance",
  () => {
    it(
      "invokes the generic qualification engine and formally qualifies Riya",
      async () => {
        const result =
          await issuance();

        expect(
          result.issuanceState,
        ).toBe(
          "FORMAL_QUALIFICATION_ISSUED",
        );

        expect(
          result.qualificationReport
            .qualificationPassed,
        ).toBe(true);

        expect(
          result.nextStep,
        ).toBe(
          "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST",
        );
      },
    );

    it(
      "issues the complete one-hundred-case qualification report",
      async () => {
        const result =
          await issuance();

        expect(
          result.reportSummary,
        ).toEqual({
          totalTestCases:
            100,

          passedTestCases:
            100,

          failedTestCases:
            0,

          qualificationEvidenceCount:
            100,

          assertionsExecuted:
            1300,

          assertionsPassed:
            1300,

          assertionsFailed:
            0,

          mandatoryCategoryCoveragePassed:
            true,

          everyTestCasePassed:
            true,

          ownerApprovalRecorded:
            true,

          qualificationPassed:
            true,

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
      "blocks a rejected owner decision",
      async () => {
        const qualificationSource =
          await source();

        const rejection =
          createRiyaFormalQualificationReviewDecision({
            decisionId:
              "riya-formal-rejection-day-52",

            evidenceLedger:
              qualificationSource.evidenceLedger,

            plan:
              qualificationSource.plan,

            fixturePack:
              qualificationSource.fixturePack,

            tenantId:
              qualificationSource.evidenceLedger.tenantId,

            ownerId:
              qualificationSource.evidenceLedger.ownerId,

            outcome:
              "REJECT_FORMAL_QUALIFICATION",

            rationale:
              "The owner requires another controlled qualification cycle before formal qualification can be issued.",

            reviewedAt:
              "2026-07-16T16:45:00.000Z",
          });

        expect(
          () =>
            issueRiyaFormalQualification({
              issuanceId:
                "riya-formal-rejected-day-52",

              qualificationPlan:
                qualificationSource.plan,

              fixturePack:
                qualificationSource.fixturePack,

              decision:
                rejection,

              evidenceLedger:
                qualificationSource.evidenceLedger,

              tenantId:
                qualificationSource.evidenceLedger.tenantId,

              ownerId:
                qualificationSource.evidenceLedger.ownerId,

              qualifiedAt:
                "2026-07-16T17:00:00.000Z",
            }),
        ).toThrow(
          "requires an approved owner decision",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner issuance",
      async () => {
        const qualificationSource =
          await source();

        expect(
          () =>
            issueRiyaFormalQualification({
              issuanceId:
                "riya-formal-cross-tenant-day-52",

              qualificationPlan:
                qualificationSource.plan,

              fixturePack:
                qualificationSource.fixturePack,

              decision:
                qualificationSource.decision,

              evidenceLedger:
                qualificationSource.evidenceLedger,

              tenantId:
                "tenant-other-001",

              ownerId:
                qualificationSource.evidenceLedger.ownerId,

              qualifiedAt:
                "2026-07-16T17:00:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            issueRiyaFormalQualification({
              issuanceId:
                "riya-formal-cross-owner-day-52",

              qualificationPlan:
                qualificationSource.plan,

              fixturePack:
                qualificationSource.fixturePack,

              decision:
                qualificationSource.decision,

              evidenceLedger:
                qualificationSource.evidenceLedger,

              tenantId:
                qualificationSource.evidenceLedger.tenantId,

              ownerId:
                "owner-other-001",

              qualifiedAt:
                "2026-07-16T17:00:00.000Z",
            }),
        ).toThrow(
          "evidence-bound approving owner",
        );
      },
    );

    it(
      "blocks tampered owner decisions and execution evidence",
      async () => {
        const qualificationSource =
          await source();

        expect(
          () =>
            issueRiyaFormalQualification({
              issuanceId:
                "riya-formal-tampered-decision-day-52",

              qualificationPlan:
                qualificationSource.plan,

              fixturePack:
                qualificationSource.fixturePack,

              decision: {
                ...qualificationSource.decision,

                decisionDigest:
                  digest(
                    "tampered-decision-day-52",
                  ),
              },

              evidenceLedger:
                qualificationSource.evidenceLedger,

              tenantId:
                qualificationSource.evidenceLedger.tenantId,

              ownerId:
                qualificationSource.evidenceLedger.ownerId,

              qualifiedAt:
                "2026-07-16T17:00:00.000Z",
            }),
        ).toThrow();

        expect(
          () =>
            issueRiyaFormalQualification({
              issuanceId:
                "riya-formal-tampered-ledger-day-52",

              qualificationPlan:
                qualificationSource.plan,

              fixturePack:
                qualificationSource.fixturePack,

              decision:
                qualificationSource.decision,

              evidenceLedger: {
                ...qualificationSource.evidenceLedger,

                ledgerDigest:
                  digest(
                    "tampered-ledger-day-52",
                  ),
              },

              tenantId:
                qualificationSource.evidenceLedger.tenantId,

              ownerId:
                qualificationSource.evidenceLedger.ownerId,

              qualifiedAt:
                "2026-07-16T17:00:00.000Z",
            }),
        ).toThrow();
      },
    );

    it(
      "blocks qualification before owner approval",
      async () => {
        const qualificationSource =
          await source();

        expect(
          () =>
            issueRiyaFormalQualification({
              issuanceId:
                "riya-formal-early-day-52",

              qualificationPlan:
                qualificationSource.plan,

              fixturePack:
                qualificationSource.fixturePack,

              decision:
                qualificationSource.decision,

              evidenceLedger:
                qualificationSource.evidenceLedger,

              tenantId:
                qualificationSource.evidenceLedger.tenantId,

              ownerId:
                qualificationSource.evidenceLedger.ownerId,

              qualifiedAt:
                "2026-07-16T16:44:59.000Z",
            }),
        ).toThrow(
          "cannot precede evidence execution or owner approval",
        );
      },
    );

    it(
      "creates deterministic immutable valid qualification issuance",
      async () => {
        const first =
          await issuance();

        const second =
          await issuance();

        expect(first).toEqual(second);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.qualificationReport,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);

        expect(
          () =>
            validateRiyaFormalQualificationIssuance(
              first,
            ),
        ).not.toThrow();

        const tampered = {
          ...first,

          nextStep:
            "ACTIVATE_RUNTIME",
        } as unknown as
          RiyaFormalQualificationIssuance;

        expect(
          () =>
            validateRiyaFormalQualificationIssuance(
              tampered,
            ),
        ).toThrow(
          "identity is invalid",
        );
      },
    );

    it(
      "does not create a manifest activate runtime or grant external authority",
      async () => {
        const result =
          await issuance();

        expect(
          result.authorityBoundary,
        ).toEqual({
          registeredUnqualifiedTemplateBound:
            true,

          formalPlanBound:
            true,

          formalFixturePackBound:
            true,

          executionEvidenceBound:
            true,

          independentEvaluatorEvidenceVerified:
            true,

          ownerApprovalDecisionBound:
            true,

          qualificationEngineInvocationAuthorized:
            true,

          qualificationEngineInvoked:
            true,

          qualificationReportCreated:
            true,

          formalQualificationIssued:
            true,

          qualificationPassed:
            true,

          qualifiedManifestCreated:
            false,

          activationCandidateCreated:
            false,

          ownerActivationRecorded:
            false,

          runtimeActivated:
            false,

          controlledWorkAuthorized:
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
