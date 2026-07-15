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
  type AshaQualificationTestPlan,
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
  type AshaFormalQualificationReviewDecision,
} from "../ashaFormalQualificationReviewDecision";

import {
  issueAshaFormalQualification,
} from "../ashaFormalQualificationIssuance";

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
      "asha-qualification-admission-day-18",
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
      "asha-qualification-decision-day-18",
    decisionDigest:
      sha256("decision-day-18"),
    readinessId:
      "asha-readiness-day-18",
    readinessDigest:
      sha256("readiness-day-18"),
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
      "2026-07-15T18:00:00.000Z",
  };

  return {
    ...core,
    admissionDigest:
      sha256(core),
  };
}

let cachedPlan:
  AshaQualificationTestPlan |
  null = null;

let cachedLedger:
  AshaQualificationExecutionEvidenceLedger |
  null = null;

let cachedDecision:
  AshaFormalQualificationReviewDecision |
  null = null;

async function evidenceLedger():
  Promise<AshaQualificationExecutionEvidenceLedger> {
  if (cachedLedger !== null) {
    return cachedLedger;
  }

  const plan =
    createAshaQualificationTestPlan({
      planId:
        "asha-qualification-plan-day-18",
      admission:
        admission(),
      tenantId:
        "tenant-ppa-industrial",
      ownerId:
        "owner-prashant-001",
      registryCreatedAt:
        "2026-07-15T18:05:00.000Z",
      preparedAt:
        "2026-07-15T18:10:00.000Z",
    });

  cachedPlan =
    plan;

  const fixturePack =
    createAshaQualificationFixturePack({
      fixturePackId:
        "asha-qualification-fixture-pack-day-18",
      plan,
      tenantId:
        "tenant-ppa-industrial",
      ownerId:
        "owner-prashant-001",
      preparedAt:
        "2026-07-15T18:15:00.000Z",
    });

  cachedLedger =
    await executeAshaQualificationEvidence({
      ledgerId:
        "asha-qualification-evidence-ledger-day-18",
      fixturePack,
      ownerId:
        "owner-prashant-001",
      evaluatorId:
        "evaluator-asha-independent-001",
      executedAt:
        "2026-07-15T18:20:00.000Z",
    });

  return cachedLedger;
}

function qualificationPlan():
  AshaQualificationTestPlan {
  if (cachedPlan === null) {
    throw new Error(
      "Qualification plan has not been prepared.",
    );
  }

  return cachedPlan;
}

async function approvedDecision():
  Promise<AshaFormalQualificationReviewDecision> {
  if (cachedDecision !== null) {
    return cachedDecision;
  }

  cachedDecision =
    createAshaFormalQualificationReviewDecision({
      decisionId:
        "asha-formal-qualification-review-day-18",
      evidenceLedger:
        await evidenceLedger(),
      tenantId:
        "tenant-ppa-industrial",
      ownerId:
        "owner-prashant-001",
      outcome:
        "APPROVE_FORMAL_QUALIFICATION",
      rationale:
        "All independently executed qualification cases passed and the owner approves controlled formal qualification issuance.",
      reviewedAt:
        "2026-07-15T18:25:00.000Z",
    });

  return cachedDecision;
}

async function issuance() {
  const decision =
    await approvedDecision();

  const ledger =
    await evidenceLedger();

  return issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
    issuanceId:
      "asha-formal-qualification-issuance-day-18",
    decision,
    evidenceLedger:
      ledger,
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    qualifiedAt:
      "2026-07-15T18:30:00.000Z",
  });
}

describe(
  "Asha formal qualification issuance",
  () => {
    it(
      "invokes the generic engine and formally qualifies Asha",
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
          result.qualificationReport
            .ownerApproval,
        ).toEqual({
          ownerId:
            "owner-prashant-001",
          approved:
            true,
          approvedAt:
            "2026-07-15T18:25:00.000Z",
        });

        expect(
          result.nextStep,
        ).toBe(
          "PREPARE_QUALIFIED_EMPLOYEE_MANIFEST",
        );
      },
    );

    it(
      "issues a complete 100-case formal qualification report",
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

        expect(
          result.qualificationReport
            .categoryCounts,
        ).toEqual({
          NORMAL_OPERATION:
            30,
          ADVERSARIAL:
            15,
          TENANT_ISOLATION:
            15,
          OWNER_CONTROL:
            15,
          EMERGENCY_PAUSE:
            5,
          DEPARTMENT_HANDOFF:
            10,
          AUDIT_EVIDENCE:
            5,
          FAILURE_RECOVERY:
            5,
        });
      },
    );

    it(
      "blocks a rejected owner decision",
      async () => {
        const ledger =
          await evidenceLedger();

        const rejection =
          createAshaFormalQualificationReviewDecision({
            decisionId:
              "asha-formal-qualification-rejection-day-18",
            evidenceLedger:
              ledger,
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            outcome:
              "REJECT_FORMAL_QUALIFICATION",
            rationale:
              "The owner rejects formal qualification and requires another controlled evaluation cycle before reconsideration.",
            reviewedAt:
              "2026-07-15T18:25:00.000Z",
          });

        expect(
          () =>
            issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
              issuanceId:
                "asha-formal-qualification-rejected",
              decision:
                rejection,
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              qualifiedAt:
                "2026-07-15T18:30:00.000Z",
            }),
        ).toThrow(
          "requires an approved owner decision",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner issuance",
      async () => {
        const decision =
          await approvedDecision();

        const ledger =
          await evidenceLedger();

        expect(
          () =>
            issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
              issuanceId:
                "asha-formal-qualification-cross-tenant",
              decision,
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-other-business",
              ownerId:
                "owner-prashant-001",
              qualifiedAt:
                "2026-07-15T18:30:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
              issuanceId:
                "asha-formal-qualification-cross-owner",
              decision,
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-other-001",
              qualifiedAt:
                "2026-07-15T18:30:00.000Z",
            }),
        ).toThrow(
          "Only the evidence-bound approving owner",
        );
      },
    );

    it(
      "blocks a tampered owner decision",
      async () => {
        const decision =
          await approvedDecision();

        const ledger =
          await evidenceLedger();

        expect(
          () =>
            issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
              issuanceId:
                "asha-formal-qualification-tampered-decision",
              decision: {
                ...decision,
                decisionDigest:
                  sha256("tampered-decision"),
              },
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              qualifiedAt:
                "2026-07-15T18:30:00.000Z",
            }),
        ).toThrow(
          "decision digest is invalid",
        );
      },
    );

    it(
      "blocks a tampered execution-evidence ledger",
      async () => {
        const decision =
          await approvedDecision();

        const ledger =
          await evidenceLedger();

        expect(
          () =>
            issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
              issuanceId:
                "asha-formal-qualification-tampered-ledger",
              decision,
              evidenceLedger: {
                ...ledger,
                ledgerDigest:
                  sha256("tampered-ledger"),
              },
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              qualifiedAt:
                "2026-07-15T18:30:00.000Z",
            }),
        ).toThrow(
          "ledger digest is invalid",
        );
      },
    );

    it(
      "blocks qualification before owner approval",
      async () => {
        const decision =
          await approvedDecision();

        const ledger =
          await evidenceLedger();

        expect(
          () =>
            issueAshaFormalQualification({
    qualificationPlan:
      qualificationPlan(),
              issuanceId:
                "asha-formal-qualification-early",
              decision,
              evidenceLedger:
                ledger,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              qualifiedAt:
                "2026-07-15T18:24:00.000Z",
            }),
        ).toThrow(
          "cannot precede evidence execution or owner approval",
        );
      },
    );

    it(
      "creates deterministic immutable formal qualification",
      async () => {
        const first =
          await issuance();

        const second =
          await issuance();

        expect(
          first.issuanceDigest,
        ).toBe(
          second.issuanceDigest,
        );

        expect(
          first.qualificationDigest,
        ).toBe(
          second.qualificationDigest,
        );

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
      },
    );

    it(
      "does not create a manifest, candidate, runtime, or production authority",
      async () => {
        const result =
          await issuance();

        expect(
          result.authorityBoundary,
        ).toEqual({
          registeredUnqualifiedTemplateBound:
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