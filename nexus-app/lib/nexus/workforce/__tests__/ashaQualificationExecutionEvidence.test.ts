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
} from "../ashaQualificationExecutionEvidence";

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
      "asha-qualification-admission-day-16",
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
      "asha-qualification-decision-day-16",
    decisionDigest:
      sha256("decision-day-16"),
    readinessId:
      "asha-readiness-day-16",
    readinessDigest:
      sha256("readiness-day-16"),
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

function fixturePack() {
  const plan =
    createAshaQualificationTestPlan({
      planId:
        "asha-qualification-plan-day-16",
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

  return createAshaQualificationFixturePack({
    fixturePackId:
      "asha-qualification-fixture-pack-day-16",
    plan,
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-15T17:15:00.000Z",
  });
}

async function ledger() {
  return executeAshaQualificationEvidence({
    ledgerId:
      "asha-qualification-evidence-ledger-day-16",
    fixturePack:
      fixturePack(),
    ownerId:
      "owner-prashant-001",
    evaluatorId:
      "evaluator-asha-independent-001",
    executedAt:
      "2026-07-15T17:20:00.000Z",
  });
}

describe(
  "Asha qualification execution evidence",
  () => {
    it(
      "executes the 400-case independent harness and captures 100 foundation qualification cases",
      async () => {
        const result =
          await ledger();

        expect(
          result.harnessExecution,
        ).toMatchObject({
          totalCases:
            400,
          passedCases:
            400,
          foundationCases:
            100,
          foundationPassedCases:
            100,
          specialistCases:
            300,
          specialistPassedCases:
            300,
          assertionDerivedEvidence:
            true,
          everyCaseExecuted:
            true,
          everyCasePassed:
            true,
          failedAssertionBlocksReport:
            true,
          duplicateEvidenceBlocked:
            true,
        });

        expect(
          result.qualificationCases,
        ).toHaveLength(100);

        expect(
          result.evidenceBindings,
        ).toHaveLength(100);
      },
    );

    it(
      "creates unique assertion-derived evidence for all 100 qualification cases",
      async () => {
        const result =
          await ledger();

        expect(
          new Set(
            result.qualificationCases.map(
              (qualificationCase) =>
                qualificationCase.caseId,
            ),
          ).size,
        ).toBe(100);

        expect(
          new Set(
            result.qualificationCases.map(
              (qualificationCase) =>
                qualificationCase
                  .evidenceDigest,
            ),
          ).size,
        ).toBe(100);

        expect(
          result.qualificationCases.every(
            (qualificationCase) =>
              qualificationCase.passed ===
                true,
          ),
        ).toBe(true);

        expect(
          result.evidenceBindings.every(
            (binding) =>
              binding
                .assertionDerivedEvidence ===
                true &&
              binding
                .hardCodedPassingEvidenceAccepted ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves mandatory qualification category coverage",
      async () => {
        const result =
          await ledger();

        expect(
          result.summary,
        ).toMatchObject({
          qualificationCasesExecuted:
            100,
          qualificationCasesPassed:
            100,
          qualificationCasesFailed:
            0,
          qualificationEvidenceCollected:
            100,
          uniqueQualificationCaseIds:
            100,
          uniqueQualificationEvidenceDigests:
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
        });
      },
    );

    it(
      "creates deterministic immutable execution evidence",
      async () => {
        const first =
          await ledger();

        const second =
          await ledger();

        expect(
          first.ledgerDigest,
        ).toBe(
          second.ledgerDigest,
        );

        expect(
          first.qualificationCases,
        ).toEqual(
          second.qualificationCases,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.qualificationCases,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.evidenceBindings,
          ),
        ).toBe(true);
      },
    );

    it(
      "blocks cross-owner qualification execution",
      async () => {
        await expect(
          executeAshaQualificationEvidence({
            ledgerId:
              "asha-evidence-ledger-cross-owner",
            fixturePack:
              fixturePack(),
            ownerId:
              "owner-other-001",
            evaluatorId:
              "evaluator-asha-independent-001",
            executedAt:
              "2026-07-15T17:20:00.000Z",
          }),
        ).rejects.toThrow(
          "Only the fixture-pack-bound owner",
        );
      },
    );

    it(
      "blocks evaluator identity mismatch",
      async () => {
        await expect(
          executeAshaQualificationEvidence({
            ledgerId:
              "asha-evidence-ledger-cross-evaluator",
            fixturePack:
              fixturePack(),
            ownerId:
              "owner-prashant-001",
            evaluatorId:
              "evaluator-other-independent-001",
            executedAt:
              "2026-07-15T17:20:00.000Z",
          }),
        ).rejects.toThrow(
          "does not match the fixture pack",
        );
      },
    );

    it(
      "blocks owner acting as independent evaluator",
      async () => {
        const pack =
          fixturePack();

        const alteredPack = {
          ...pack,
          evaluatorId:
            "owner-prashant-001",
        };

        const {
          fixturePackDigest:
            _ignored,
          ...alteredCore
        } = alteredPack;

        await expect(
          executeAshaQualificationEvidence({
            ledgerId:
              "asha-evidence-ledger-owner-evaluator",
            fixturePack: {
              ...alteredPack,
              fixturePackDigest:
                sha256(alteredCore),
            },
            ownerId:
              "owner-prashant-001",
            evaluatorId:
              "owner-prashant-001",
            executedAt:
              "2026-07-15T17:20:00.000Z",
          }),
        ).rejects.toThrow(
          "must be distinct from the owner",
        );
      },
    );

    it(
      "blocks execution before fixture preparation",
      async () => {
        await expect(
          executeAshaQualificationEvidence({
            ledgerId:
              "asha-evidence-ledger-early",
            fixturePack:
              fixturePack(),
            ownerId:
              "owner-prashant-001",
            evaluatorId:
              "evaluator-asha-independent-001",
            executedAt:
              "2026-07-15T17:14:00.000Z",
          }),
        ).rejects.toThrow(
          "cannot precede fixture preparation",
        );
      },
    );

    it(
      "blocks a tampered fixture-pack digest",
      async () => {
        const pack =
          fixturePack();

        await expect(
          executeAshaQualificationEvidence({
            ledgerId:
              "asha-evidence-ledger-tampered",
            fixturePack: {
              ...pack,
              fixturePackDigest:
                sha256("tampered-pack"),
            },
            ownerId:
              "owner-prashant-001",
            evaluatorId:
              "evaluator-asha-independent-001",
            executedAt:
              "2026-07-15T17:20:00.000Z",
          }),
        ).rejects.toThrow(
          "fixture-pack digest is invalid",
        );
      },
    );

    it(
      "does not issue qualification, activation, or production authority",
      async () => {
        const result =
          await ledger();

        expect(
          result.authorityBoundary,
        ).toMatchObject({
          fixturePackBound:
            true,
          independentEvaluationHarnessExecuted:
            true,
          assertionDerivedEvidenceRequired:
            true,
          hardCodedPassingEvidenceAccepted:
            false,
          qualificationTestingExecuted:
            true,
          qualificationEvidenceCollected:
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
          ownerCertificationRequired:
            true,
          shadowModeRequired:
            true,
          controlledPilotRequired:
            true,
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