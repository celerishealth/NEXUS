
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createAIEmployeeRuntimeContract,
} from "../aiEmployeeManifest";

import {
  createCoreLaunchEmployeeTemplateRegistry,
} from "../employeeTemplateRegistry";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  createAIEmployeeActivationCandidate,
  createAIEmployeeQualificationReport,
  createQualifiedAIEmployeeManifest,
  type AIEmployeeQualificationCase,
} from "../employeeQualification";

function ashaTemplate() {
  return createCoreLaunchEmployeeTemplateRegistry(
    "2026-07-14T22:35:00.000Z",
  ).templates[0];
}

function qualificationCases():
  AIEmployeeQualificationCase[] {
  const result:
    AIEmployeeQualificationCase[] = [];

  let sequence = 1;

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    const count =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ];

    for (
      let index = 1;
      index <= count;
      index += 1
    ) {
      result.push({
        caseId:
          "case-" +
          category
            .toLowerCase()
            .replaceAll("_", "-") +
          "-" +
          String(index).padStart(
            3,
            "0",
          ),
        category,
        passed:
          true,
        evidenceDigest:
          sequence
            .toString(16)
            .padStart(64, "0"),
        executedAt:
          "2026-07-15T08:00:00.000Z",
      });

      sequence += 1;
    }
  }

  return result;
}

function passingReport() {
  return createAIEmployeeQualificationReport({
    template:
      ashaTemplate(),
    testCases:
      qualificationCases(),
    ownerApproval: {
      ownerId:
        "owner-prashant-001",
      approved:
        true,
      approvedAt:
        "2026-07-15T09:00:00.000Z",
    },
    qualifiedAt:
      "2026-07-15T09:05:00.000Z",
  });
}

describe(
  "AI employee qualification framework",
  () => {
    it(
      "requires and validates 100 category-balanced passing test cases",
      () => {
        const report =
          passingReport();

        expect(
          report.totalTestCases,
        ).toBe(100);

        expect(
          report.passedTestCases,
        ).toBe(100);

        expect(
          report
            .mandatoryCategoryCoveragePassed,
        ).toBe(true);

        expect(
          report.everyTestCasePassed,
        ).toBe(true);

        expect(
          report.qualificationPassed,
        ).toBe(true);

        expect(
          report.categoryCounts
            .NORMAL_OPERATION,
        ).toBe(30);

        expect(
          report.categoryCounts
            .TENANT_ISOLATION,
        ).toBe(15);

        expect(
          report.categoryCounts
            .DEPARTMENT_HANDOFF,
        ).toBe(10);
      },
    );

    it(
      "creates deterministic immutable qualification evidence",
      () => {
        const cases =
          qualificationCases();

        const first =
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              cases,
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          });

        const second =
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              [...cases].reverse(),
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          });

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
            first.categoryCounts,
          ),
        ).toBe(true);
      },
    );

    it(
      "blocks fewer than 100 qualification cases",
      () => {
        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              qualificationCases()
                .slice(0, 99),
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "requires between 100 and 1000 test cases",
        );
      },
    );

    it(
      "blocks incomplete mandatory category coverage",
      () => {
        const cases =
          qualificationCases();

        const emergencyIndex =
          cases.findIndex(
            (testCase) =>
              testCase.category ===
              "EMERGENCY_PAUSE",
          );

        cases.splice(
          emergencyIndex,
          1,
        );

        cases.push({
          caseId:
            "case-normal-operation-extra",
          category:
            "NORMAL_OPERATION",
          passed:
            true,
          evidenceDigest:
            "f".repeat(63) + "e",
          executedAt:
            "2026-07-15T08:00:00.000Z",
        });

        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              cases,
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "EMERGENCY_PAUSE requires at least 5",
        );
      },
    );

    it(
      "blocks any failed qualification case",
      () => {
        const cases =
          qualificationCases();

        cases[0] = {
          ...cases[0],
          passed:
            false,
        };

        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              cases,
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "Every employee qualification test case must pass",
        );
      },
    );

    it(
      "blocks duplicate case IDs and evidence digests",
      () => {
        const duplicateIds =
          qualificationCases();

        duplicateIds[1] = {
          ...duplicateIds[1],
          caseId:
            duplicateIds[0].caseId,
        };

        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              duplicateIds,
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "test-case IDs must not contain duplicates",
        );

        const duplicateEvidence =
          qualificationCases();

        duplicateEvidence[1] = {
          ...duplicateEvidence[1],
          evidenceDigest:
            duplicateEvidence[0]
              .evidenceDigest,
        };

        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              duplicateEvidence,
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "evidence digests must not contain duplicates",
        );
      },
    );

    it(
      "blocks zero or malformed evidence digests",
      () => {
        const cases =
          qualificationCases();

        cases[0] = {
          ...cases[0],
          evidenceDigest:
            "0".repeat(64),
        };

        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              cases,
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                true,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "non-zero SHA-256 digest",
        );
      },
    );

    it(
      "blocks qualification without explicit owner approval",
      () => {
        expect(() =>
          createAIEmployeeQualificationReport({
            template:
              ashaTemplate(),
            testCases:
              qualificationCases(),
            ownerApproval: {
              ownerId:
                "owner-prashant-001",
              approved:
                false,
              approvedAt:
                "2026-07-15T09:00:00.000Z",
            },
            qualifiedAt:
              "2026-07-15T09:05:00.000Z",
          }),
        ).toThrow(
          "Explicit owner approval is required",
        );
      },
    );

    it(
      "creates a qualified manifest only from matching passing evidence",
      () => {
        const template =
          ashaTemplate();

        const report =
          passingReport();

        const manifest =
          createQualifiedAIEmployeeManifest(
            template,
            report,
          );

        expect(
          manifest.evaluation.status,
        ).toBe("QUALIFIED");

        expect(
          manifest.evaluation
            .testCasesPassed,
        ).toBe(100);

        expect(
          manifest.evaluation
            .adversarialTestsPassed,
        ).toBe(true);

        expect(
          manifest.evaluation
            .tenantIsolationPassed,
        ).toBe(true);

        expect(
          manifest.evaluation
            .ownerControlPassed,
        ).toBe(true);

        expect(
          manifest.evaluation
            .emergencyPausePassed,
        ).toBe(true);
      },
    );

    it(
      "blocks qualification evidence belonging to another template",
      () => {
        const template =
          ashaTemplate();

        const report = {
          ...passingReport(),
          templateDigest:
            "f".repeat(64),
        };

        expect(() =>
          createQualifiedAIEmployeeManifest(
            template,
            report,
          ),
        ).toThrow(
          "does not belong to the employee template",
        );
      },
    );

    it(
      "prepares an eligible employee runtime but keeps it paused for owner activation",
      () => {
        const candidate =
          createAIEmployeeActivationCandidate({
            template:
              ashaTemplate(),
            qualification:
              passingReport(),
            runtimeId:
              "runtime-asha-candidate-001",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            preparedAt:
              "2026-07-15T09:10:00.000Z",
          });

        expect(
          candidate.activationEligible,
        ).toBe(true);

        expect(
          candidate
            .ownerActivationRequired,
        ).toBe(true);

        expect(
          candidate.pausedRuntime
            .runtimeState,
        ).toBe(
          "PAUSED_AWAITING_OWNER",
        );

        expect(
          candidate.pausedRuntime
            .controlledWorkAuthorized,
        ).toBe(false);

        expect(
          candidate.safetyBoundary
            .externalDeliveryAuthorized,
        ).toBe(false);
      },
    );

    it(
      "permits controlled runtime only after explicit owner activation",
      () => {
        const candidate =
          createAIEmployeeActivationCandidate({
            template:
              ashaTemplate(),
            qualification:
              passingReport(),
            runtimeId:
              "runtime-asha-candidate-002",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            preparedAt:
              "2026-07-15T09:10:00.000Z",
          });

        const activeRuntime =
          createAIEmployeeRuntimeContract({
            manifest:
              candidate
                .qualifiedManifest,
            runtimeId:
              "runtime-asha-active-001",
            tenantId:
              "tenant-ppa-industrial",
            ownerId:
              "owner-prashant-001",
            ownerActivated:
              true,
            startedAt:
              "2026-07-15T09:15:00.000Z",
          });

        expect(
          activeRuntime.runtimeState,
        ).toBe(
          "READY_FOR_CONTROLLED_WORK",
        );

        expect(
          activeRuntime
            .controlledWorkAuthorized,
        ).toBe(true);

        expect(
          activeRuntime
            .safetyBoundary
            .liveProviderExecutionAuthorized,
        ).toBe(false);

        expect(
          activeRuntime
            .safetyBoundary
            .externalDeliveryAuthorized,
        ).toBe(false);

        expect(
          activeRuntime
            .safetyBoundary
            .paymentExecutionAuthorized,
        ).toBe(false);
      },
    );

    it(
      "does not mutate the registered Asha template into a qualified employee",
      () => {
        const template =
          ashaTemplate();

        createQualifiedAIEmployeeManifest(
          template,
          passingReport(),
        );

        expect(
          template.status,
        ).toBe(
          "REGISTERED_UNQUALIFIED",
        );

        expect(
          template.manifest
            .evaluation.status,
        ).toBe("UNQUALIFIED");

        expect(
          template
            .controlledActivationEligible,
        ).toBe(false);
      },
    );
  },
);
