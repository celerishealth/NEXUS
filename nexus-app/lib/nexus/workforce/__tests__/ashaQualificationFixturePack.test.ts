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
      "asha-qualification-admission-day-15",
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
      "asha-qualification-decision-day-15",
    decisionDigest:
      sha256("decision-day-15"),
    readinessId:
      "asha-readiness-day-15",
    readinessDigest:
      sha256("readiness-day-15"),
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

function plan() {
  return createAshaQualificationTestPlan({
    planId:
      "asha-qualification-plan-day-15",
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
}

function fixturePack() {
  return createAshaQualificationFixturePack({
    fixturePackId:
      "asha-qualification-fixture-pack-day-15",
    plan:
      plan(),
    tenantId:
      "tenant-ppa-industrial",
    ownerId:
      "owner-prashant-001",
    preparedAt:
      "2026-07-15T17:15:00.000Z",
  });
}

describe(
  "Asha qualification fixture pack",
  () => {
    it(
      "creates exactly 100 immutable sanitized synthetic fixtures",
      () => {
        const pack =
          fixturePack();

        expect(
          pack.fixturePackState,
        ).toBe(
          "SANITIZED_SYNTHETIC_FIXTURES_PREPARED",
        );

        expect(
          pack.fixtures,
        ).toHaveLength(100);

        expect(
          pack.summary.totalFixtures,
        ).toBe(100);

        expect(
          pack.summary
            .sanitizedSyntheticFixtures,
        ).toBe(100);

        expect(
          Object.isFrozen(pack),
        ).toBe(true);

        expect(
          Object.isFrozen(
            pack.fixtures,
          ),
        ).toBe(true);

        expect(
          pack.fixtures.every(
            (fixture) =>
              Object.isFrozen(fixture),
          ),
        ).toBe(true);
      },
    );

    it(
      "binds one unique fixture to every planned case",
      () => {
        const pack =
          fixturePack();

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
                fixture.caseId,
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
      },
    );

    it(
      "contains no customer data, secrets, or production identifiers",
      () => {
        const pack =
          fixturePack();

        expect(
          pack.summary,
        ).toMatchObject({
          customerDataFixtures:
            0,
          secretBearingFixtures:
            0,
          productionIdentifierFixtures:
            0,
        });

        expect(
          pack.fixtures.every(
            (fixture) =>
              fixture.fixtureMode ===
                "SANITIZED_SYNTHETIC_ONLY" &&
              fixture.syntheticInput
                .customerDataIncluded ===
                false &&
              fixture.syntheticInput
                .secretsIncluded ===
                false &&
              fixture.syntheticInput
                .productionIdentifiersIncluded ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves all mandatory category counts",
      () => {
        const pack =
          fixturePack();

        expect(
          pack.summary,
        ).toMatchObject({
          normalOperationFixtures:
            30,
          adversarialFixtures:
            15,
          tenantIsolationFixtures:
            15,
          ownerControlFixtures:
            15,
          emergencyPauseFixtures:
            5,
          departmentHandoffFixtures:
            10,
          auditEvidenceFixtures:
            5,
          failureRecoveryFixtures:
            5,
        });
      },
    );

    it(
      "blocks cross-tenant fixture preparation",
      () => {
        expect(
          () =>
            createAshaQualificationFixturePack({
              fixturePackId:
                "asha-fixture-pack-cross-tenant",
              plan:
                plan(),
              tenantId:
                "tenant-other-business",
              ownerId:
                "owner-prashant-001",
              preparedAt:
                "2026-07-15T17:15:00.000Z",
            }),
        ).toThrow(
          "Cross-tenant qualification fixture preparation is blocked",
        );
      },
    );

    it(
      "blocks cross-owner fixture preparation",
      () => {
        expect(
          () =>
            createAshaQualificationFixturePack({
              fixturePackId:
                "asha-fixture-pack-cross-owner",
              plan:
                plan(),
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-other-001",
              preparedAt:
                "2026-07-15T17:15:00.000Z",
            }),
        ).toThrow(
          "Only the plan-bound owner",
        );
      },
    );

    it(
      "blocks a tampered test-plan digest",
      () => {
        const validPlan =
          plan();

        const tampered = {
          ...validPlan,
          planDigest:
            sha256("tampered-plan"),
        };

        expect(
          () =>
            createAshaQualificationFixturePack({
              fixturePackId:
                "asha-fixture-pack-tampered-plan",
              plan:
                tampered,
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              preparedAt:
                "2026-07-15T17:15:00.000Z",
            }),
        ).toThrow(
          "Qualification test-plan digest is invalid",
        );
      },
    );

    it(
      "blocks fixture preparation before the plan",
      () => {
        expect(
          () =>
            createAshaQualificationFixturePack({
              fixturePackId:
                "asha-fixture-pack-early",
              plan:
                plan(),
              tenantId:
                "tenant-ppa-industrial",
              ownerId:
                "owner-prashant-001",
              preparedAt:
                "2026-07-15T17:09:00.000Z",
            }),
        ).toThrow(
          "cannot precede the test plan",
        );
      },
    );

    it(
      "creates deterministic fixture and pack digests",
      () => {
        const first =
          fixturePack();

        const second =
          fixturePack();

        expect(
          first.fixturePackDigest,
        ).toBe(
          second.fixturePackDigest,
        );

        expect(
          first.fixtures.map(
            (fixture) =>
              fixture.fixtureDigest,
          ),
        ).toEqual(
          second.fixtures.map(
            (fixture) =>
              fixture.fixtureDigest,
          ),
        );
      },
    );

    it(
      "does not execute cases or fabricate passing evidence",
      () => {
        const pack =
          fixturePack();

        expect(
          pack.fixtures.every(
            (fixture) =>
              fixture.executionState ===
                "NOT_EXECUTED" &&
              fixture.evidenceState ===
                "NOT_COLLECTED" &&
              fixture.passed === null &&
              fixture.evidenceDigest ===
                null &&
              fixture.executedAt ===
                null,
          ),
        ).toBe(true);

        expect(
          pack.summary.executedFixtures,
        ).toBe(0);

        expect(
          pack.summary
            .collectedEvidenceCount,
        ).toBe(0);

        expect(
          pack.authorityBoundary
            .syntheticPassingEvidenceCreated,
        ).toBe(false);
      },
    );

    it(
      "does not grant qualification, activation, or production authority",
      () => {
        const pack =
          fixturePack();

        expect(
          pack.authorityBoundary,
        ).toMatchObject({
          qualificationFixturesCreated:
            true,
          qualificationTestingExecuted:
            false,
          qualificationEvidenceCollected:
            false,
          syntheticPassingEvidenceCreated:
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