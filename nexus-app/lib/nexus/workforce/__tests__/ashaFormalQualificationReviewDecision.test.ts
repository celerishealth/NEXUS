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

import {
  createAshaQualificationFixturePack,
} from "../ashaQualificationFixturePack";

import {
  executeAshaQualificationEvidence,
  type AshaQualificationExecutionEvidenceLedger,
} from "../ashaQualificationExecutionEvidence";

import {
  createAshaFormalQualificationReviewDecision,
} from "../ashaFormalQualificationReviewDecision";

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
  const core = {
    version:
      ASHA_QUALIFICATION_TESTING_ADMISSION_VERSION,
    admissionId:
      "asha-qualification-admission-day-17",
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
      "asha-qualification-decision-day-17",
    decisionDigest:
      sha256("decision-day-17"),
    readinessId:
      "asha-readiness-day-17",
    readinessDigest:
      sha256("readiness-day-17"),
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
      "2026-07-15T17:00:00.000Z",
  };

  return {
    ...core,
    admissionDigest:
      sha256(core),
  };
}

let cachedLedger:
  AshaQualificationExecutionEvidenceLedger |
  null = null;

async function evidenceLedger():
  Promise<AshaQualificationExecutionEvidenceLedger> {
  if (cachedLedger !== null) {
    return cachedLedger;
  }

  const plan =
    createAshaQualificationTestPlan({
      planId:
        "asha-qualification-plan-day-17",
      admission:
        admission(),
      tenantId:
        "tenant-ppa-industrial",
      ownerId:
        "owner-prashant-001",
      registryCreatedAt:
        "2026-07-15T17:05:00.000Z",
      preparedAt:
        "2026-07-15T17:10:00.000Z",
    });

  const fixturePack =
    createAshaQualificationFixturePack({
      fixturePackId:
        "asha-qualification-fixture-pack-day-17",
      plan,
      tenantId:
        "tenant-ppa-industrial",
      ownerId:
        "owner-prashant-001",
      preparedAt:
        "2026-07-15T17:15:00.000Z",
    });

  cachedLedger =
    await executeAshaQualificationEvidence({
      ledgerId:
        "asha-qualification-evidence-ledger-day-17",
      fixturePack,
      ownerId:
        "owner-prashant-001",
      evaluatorId:
        "evaluator-asha-independent-001",
      executedAt:
        "2026-07-15T17:20:00.000Z",
    });

  return cachedLedger;
}

async function approvedDecision() {
  return createAshaFormalQualificationReviewDecision({
    decisionId:
      "asha-formal-qualification-review-day-17",
    evidenceLedger:
      await evidenceLedger(),
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    outcome:
      "APPROVE_FORMAL_QUALIFICATION",
    rationale:
      "All independently executed qualification evidence passed and remains within the locked owner-controlled safety boundary.",
    reviewedAt:
      "2026-07-15T17:25:00.000Z",
  });
}

describe(
  "Asha formal qualification review decision",
  () => {
    it(
      "allows the evidence-bound owner to approve formal engine admission",
      async () => {
        const decision =
          await approvedDecision();

        expect(
          decision.decisionState,
        ).toBe(
          "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED",
        );

        expect(
          decision.nextStep,
        ).toBe(
          "INVOKE_FORMAL_QUALIFICATION_ENGINE",
        );

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(true);

        expect(
          decision.evidenceSummary,
        ).toMatchObject({
          independentHarnessCasesExecuted:
            400,
          independentHarnessCasesPassed:
            400,
          foundationCasesExecuted:
            100,
          foundationCasesPassed:
            100,
          specialistCasesExecuted:
            300,
          specialistCasesPassed:
            300,
          qualificationCasesExecuted:
            100,
          qualificationCasesPassed:
            100,
          qualificationCasesFailed:
            0,
          qualificationEvidenceCount:
            100,
          assertionDerivedEvidence:
            true,
          hardCodedPassingEvidenceAccepted:
            false,
        });
      },
    );

    it(
      "records an owner rejection without engine authority",
      async () => {
        const decision =
          createAshaFormalQualificationReviewDecision({
            decisionId:
              "asha-formal-qualification-rejection-day-17",
            evidenceLedger:
              await evidenceLedger(),
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            outcome:
              "REJECT_FORMAL_QUALIFICATION",
            rationale:
              "The owner requires another controlled qualification cycle before any formal qualification engine invocation.",
            reviewedAt:
              "2026-07-15T17:25:00.000Z",
          });

        expect(
          decision.decisionState,
        ).toBe(
          "FORMAL_QUALIFICATION_REJECTED",
        );

        expect(
          decision.nextStep,
        ).toBe(
          "RETURN_TO_CONTROLLED_REQUALIFICATION",
        );

        expect(
          decision.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(false);
      },
    );

    it(
      "blocks cross-tenant formal qualification review",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createAshaFormalQualificationReviewDecision({
              decisionId:
                "asha-formal-review-cross-tenant",
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-other-business",
              ownerId:
                "owner-prashant-001",
              outcome:
                "APPROVE_FORMAL_QUALIFICATION",
              rationale:
                "This deliberately invalid cross-tenant review must be blocked before qualification authority is granted.",
              reviewedAt:
                "2026-07-15T17:25:00.000Z",
            }),
        ).toThrow();
      },
    );

    it(
      "blocks cross-owner formal qualification review",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createAshaFormalQualificationReviewDecision({
              decisionId:
                "asha-formal-review-cross-owner",
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-other-001",
              outcome:
                "APPROVE_FORMAL_QUALIFICATION",
              rationale:
                "This non-owner review must never authorize formal qualification engine admission for Asha.",
              reviewedAt:
                "2026-07-15T17:25:00.000Z",
            }),
        ).toThrow(
          "Only the evidence-bound owner",
        );
      },
    );

    it(
      "blocks a tampered execution-evidence ledger",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createAshaFormalQualificationReviewDecision({
              decisionId:
                "asha-formal-review-tampered-evidence",
              evidenceLedger: {
                ...ledger,
                ledgerDigest:
                  sha256("tampered-ledger"),
              },
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              outcome:
                "APPROVE_FORMAL_QUALIFICATION",
              rationale:
                "Tampered qualification evidence must remain blocked regardless of the requested owner decision.",
              reviewedAt:
                "2026-07-15T17:25:00.000Z",
            }),
        ).toThrow(
          "execution ledger digest is invalid",
        );
      },
    );

    it(
      "blocks review before qualification evidence execution",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createAshaFormalQualificationReviewDecision({
              decisionId:
                "asha-formal-review-early",
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              outcome:
                "APPROVE_FORMAL_QUALIFICATION",
              rationale:
                "Formal qualification review cannot occur before the independent evidence execution has completed.",
              reviewedAt:
                "2026-07-15T17:19:00.000Z",
            }),
        ).toThrow(
          "cannot precede evidence execution",
        );
      },
    );

    it(
      "requires a meaningful owner rationale",
      async () => {
        const ledger =
          await evidenceLedger();

        expect(
          () =>
            createAshaFormalQualificationReviewDecision({
              decisionId:
                "asha-formal-review-no-rationale",
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              outcome:
                "APPROVE_FORMAL_QUALIFICATION",
              rationale:
                "Approved.",
              reviewedAt:
                "2026-07-15T17:25:00.000Z",
            }),
        ).toThrow(
          "20 to 500 characters",
        );
      },
    );

    it(
      "creates deterministic immutable owner decisions",
      async () => {
        const first =
          await approvedDecision();

        const second =
          await approvedDecision();

        expect(
          first.decisionDigest,
        ).toBe(
          second.decisionDigest,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceSummary,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.authorityBoundary,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not invoke qualification, create a manifest, or activate runtime",
      async () => {
        const decision =
          await approvedDecision();

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          executionEvidenceBound:
            true,
          independentEvaluatorEvidenceVerified:
            true,
          ownerReviewRequired:
            true,
          ownerDecisionRecorded:
            true,
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
          ownerActivationRecorded:
            false,
          customerDataAccessAuthorized:
            false,
          customerContactAuthorized:
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