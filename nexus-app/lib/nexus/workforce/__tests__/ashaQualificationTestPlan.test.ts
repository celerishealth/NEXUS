import {
  createHash,
} from "node:crypto";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ASHA_QUALIFICATION_TESTING_ADMISSION_VERSION,
  type AshaQualificationTestingAdmission,
} from "../ashaQualificationTestingAdmission";

import {
  createAshaQualificationTestPlan,
} from "../ashaQualificationTestPlan";

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            stableStringify(item),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            JSON.stringify(key) +
            ":" +
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported test value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function admission():
  AshaQualificationTestingAdmission {
  const admissionCore = {
    version:
      ASHA_QUALIFICATION_TESTING_ADMISSION_VERSION,
    admissionId:
      "asha-qualification-admission-day-14",
    admissionState:
      "ADMITTED_FOR_CONTROLLED_QUALIFICATION_TEST_PREPARATION" as const,
    employeeId:
      "employee-asha-inquiry-intake-v1",
    templateId:
      "template-asha-inquiry-intake-v1",
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    evaluatorId:
      "evaluator-asha-independent-001",
    decisionId:
      "asha-qualification-decision-day-14",
    decisionDigest:
      sha256("decision-day-14"),
    readinessId:
      "asha-readiness-day-14",
    readinessDigest:
      sha256("readiness-day-14"),
    categoryRequirements: [
      {
        category:
          "NORMAL_OPERATION" as const,
        minimumPassingCases:
          30,
      },
      {
        category:
          "ADVERSARIAL" as const,
        minimumPassingCases:
          15,
      },
      {
        category:
          "TENANT_ISOLATION" as const,
        minimumPassingCases:
          15,
      },
      {
        category:
          "OWNER_CONTROL" as const,
        minimumPassingCases:
          15,
      },
      {
        category:
          "EMERGENCY_PAUSE" as const,
        minimumPassingCases:
          5,
      },
      {
        category:
          "DEPARTMENT_HANDOFF" as const,
        minimumPassingCases:
          10,
      },
      {
        category:
          "AUDIT_EVIDENCE" as const,
        minimumPassingCases:
          5,
      },
      {
        category:
          "FAILURE_RECOVERY" as const,
        minimumPassingCases:
          5,
      },
    ],
    testingPolicy: {
      baselineMinimumTestCases:
        100 as const,
      maximumTestCases:
        1000 as const,
      templateEvaluationMinimumMustAlsoBeSatisfied:
        true,
      everyTestCaseMustPass:
        true,
      uniqueCaseIdsRequired:
        true,
      uniqueEvidenceDigestsRequired:
        true,
      executedEvidenceRequired:
        true,
      mandatoryCategoryCoverageRequired:
        true,
      failedTestCaseFailsQualification:
        true,
    } as const,
    nextStep:
      "BIND_REGISTERED_UNQUALIFIED_TEMPLATE_AND_PREPARE_QUALIFICATION_CASES" as const,
    authorityBoundary: {
      ownerApprovalBound:
        true,
      readinessEvidenceBound:
        true,
      qualificationTestingAdmissionAuthorized:
        true,
      qualificationTestPreparationAuthorized:
        true,
      templateRecordBindingStillRequired:
        true,
      qualificationCasesStillRequired:
        true,
      qualificationTestingExecuted:
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
      shadowEvidenceAcceptedAsQualificationEvidence:
        false,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
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
    } as const,
    preparedAt:
      "2026-07-15T16:20:00.000Z",
  };

  return {
    ...admissionCore,
    admissionDigest:
      sha256(admissionCore),
  };
}

function createPlan(
  admissionValue =
    admission(),
) {
  return createAshaQualificationTestPlan({
    planId:
      "asha-qualification-plan-day-14",
    admission:
      admissionValue,
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    registryCreatedAt:
      "2026-07-15T16:25:00.000Z",
    preparedAt:
      "2026-07-15T16:30:00.000Z",
  });
}

describe(
  "Asha qualification test plan",
  () => {
    it(
      "binds the canonical registered-unqualified Asha template",
      () => {
        const plan =
          createPlan();

        expect(
          plan.planState,
        ).toBe(
          "REGISTERED_TEMPLATE_BOUND_QUALIFICATION_PLAN_PREPARED",
        );

        expect(
          plan.templateBinding,
        ).toMatchObject({
          employeeCode:
            "nx-sales-003",
          publicName:
            "Asha",
          officialRole:
            "AI Inquiry Intake Executive",
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
            adversarialTestsPassed:
              false,
            tenantIsolationPassed:
              false,
            ownerControlPassed:
              false,
            emergencyPausePassed:
              false,
          },
        });

        expect(
          Object.isFrozen(plan),
        ).toBe(true);

        expect(
          Object.isFrozen(
            plan.templateBinding,
          ),
        ).toBe(true);
      },
    );

    it(
      "prepares exactly 100 unique unexecuted planned cases",
      () => {
        const plan =
          createPlan();

        expect(
          plan.requiredMinimumTestCases,
        ).toBe(100);

        expect(
          plan.plannedCases,
        ).toHaveLength(100);

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

        expect(
          plan.plannedCases.every(
            (plannedCase) =>
              plannedCase.executionState ===
                "NOT_EXECUTED" &&
              plannedCase.evidenceState ===
                "NOT_COLLECTED" &&
              plannedCase.passed === null &&
              plannedCase.evidenceDigest ===
                null &&
              plannedCase.executedAt ===
                null,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves the mandatory category distribution",
      () => {
        const plan =
          createPlan();

        expect(
          plan.preparationSummary,
        ).toMatchObject({
          plannedCaseCount:
            100,
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
          unexecutedCaseCount:
            100,
          collectedEvidenceCount:
            0,
          passedCaseCount:
            0,
          failedCaseCount:
            0,
        });
      },
    );

    it(
      "blocks a tampered admission digest",
      () => {
        const validAdmission =
          admission();

        const tampered = {
          ...validAdmission,
          admissionDigest:
            sha256("tampered-admission"),
        } as AshaQualificationTestingAdmission;

        expect(
          () =>
            createPlan(
              tampered,
            ),
        ).toThrow(
          "Qualification admission digest is invalid",
        );
      },
    );

    it(
      "blocks cross-tenant qualification planning",
      () => {
        expect(
          () =>
            createAshaQualificationTestPlan({
              planId:
                "asha-qualification-plan-cross-tenant",
              admission:
                admission(),
              tenantId:
                "tenant-other-business",
              ownerId:
                "owner-prashant-001",
              registryCreatedAt:
                "2026-07-15T16:25:00.000Z",
              preparedAt:
                "2026-07-15T16:30:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant qualification planning is blocked",
        );
      },
    );

    it(
      "blocks cross-owner qualification planning",
      () => {
        expect(
          () =>
            createAshaQualificationTestPlan({
              planId:
                "asha-qualification-plan-cross-owner",
              admission:
                admission(),
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-other-001",
              registryCreatedAt:
                "2026-07-15T16:25:00.000Z",
              preparedAt:
                "2026-07-15T16:30:00.000Z",
            }),
        ).toThrow(
          "Only the admission-bound owner",
        );
      },
    );

    it(
      "blocks plan preparation before admission or registry",
      () => {
        expect(
          () =>
            createAshaQualificationTestPlan({
              planId:
                "asha-qualification-plan-early",
              admission:
                admission(),
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              registryCreatedAt:
                "2026-07-15T16:25:00.000Z",
              preparedAt:
                "2026-07-15T16:19:00.000Z",
            }),
        ).toThrow(
          "cannot precede its admission or template registry",
        );
      },
    );

    it(
      "creates deterministic case and plan digests",
      () => {
        const first =
          createPlan();

        const second =
          createPlan();

        expect(
          first.planDigest,
        ).toBe(
          second.planDigest,
        );

        expect(
          first.plannedCases.map(
            (plannedCase) =>
              plannedCase.casePlanDigest,
          ),
        ).toEqual(
          second.plannedCases.map(
            (plannedCase) =>
              plannedCase.casePlanDigest,
          ),
        );
      },
    );

    it(
      "does not fabricate passing qualification evidence",
      () => {
        const plan =
          createPlan();

        expect(
          plan.authorityBoundary
            .syntheticPassingEvidenceCreated,
        ).toBe(false);

        expect(
          plan.authorityBoundary
            .shadowEvidenceAcceptedAsQualificationEvidence,
        ).toBe(false);

        expect(
          plan.authorityBoundary
            .qualificationEvidenceCollected,
        ).toBe(false);

        expect(
          plan.authorityBoundary
            .qualificationTestingExecuted,
        ).toBe(false);
      },
    );

    it(
      "does not grant qualification, activation, or production authority",
      () => {
        const plan =
          createPlan();

        expect(
          plan.authorityBoundary,
        ).toMatchObject({
          qualificationPlanPrepared:
            true,
          qualificationFixturesCreated:
            false,
          qualificationTestingExecuted:
            false,
          qualificationEvidenceCollected:
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
          customerDataAccessAuthorized:
            false,
          customerContactAuthorized:
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