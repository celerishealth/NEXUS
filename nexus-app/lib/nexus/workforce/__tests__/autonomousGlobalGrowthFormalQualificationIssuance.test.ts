import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
} from "../autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,
} from "../autonomousGlobalGrowthAIEmployeeTemplateCreationExecution";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
} from "../autonomousGlobalGrowthFormalQualificationExecutionEvidence";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthFormalQualificationReviewApprovalRecord";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE,
  issueAutonomousGlobalGrowthFormalQualification,
  validateAutonomousGlobalGrowthFormalQualificationIssuance,
} from "../autonomousGlobalGrowthFormalQualificationIssuance";

function input() {
  return {
    issuanceId:
      "engineering-formal-qualification-issuance-test-001",

    templateRegistry:
      AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,

    executionEvidence:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,

    approvalDecision:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,

    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    qualifiedAt:
      new Date(
        Date.parse(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
            .reviewedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Autonomous Global Growth formal qualification issuance",
  () => {
    it(
      "invokes the generic qualification engine and formally qualifies exactly nine candidates",
      () => {
        const issuance =
          issueAutonomousGlobalGrowthFormalQualification(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUED",
        );

        expect(
          issuance.candidateIssuances,
        ).toHaveLength(9);

        expect(
          issuance.candidateIssuances.every(
            (record) =>
              record.qualificationReport
                .qualificationPassed ===
                true &&
              record.authorityBoundary
                .qualificationEngineInvoked ===
                true &&
              record.authorityBoundary
                .formalQualificationIssued ===
                true,
          ),
        ).toBe(true);

        expect(
          issuance.nextStep,
        ).toBe(
          "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFIED_EMPLOYEE_MANIFESTS",
        );
      },
    );

    it(
      "issues one hundred passing cases and thirteen hundred passing assertions per candidate",
      () => {
        for (
          const record of
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
            .candidateIssuances
        ) {
          expect(
            record.reportSummary,
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
        }
      },
    );

    it(
      "preserves exact Autonomous Global Growth candidate identities in sequence",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
            .candidateIssuances
            .map(
              (record) =>
                record.publicName,
            ),
        ).toEqual([
          "Niyara",
          "Rivaan",
          "Ahaana",
          "Kairav",
          "Samyra",
          "Ruhan",
          "Tavisha",
          "Yuvaan",
          "Vedanshi",
        ]);
      },
    );

    it(
      "binds each qualification report to its exact template evidence and owner review",
      () => {
        AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
          .candidateIssuances
          .forEach(
            (
              record,
              index,
            ) => {
              const template =
                AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY
                  .templates[index];

              const evidence =
                AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
                  .candidateEvidenceLedgers[
                    index
                  ];

              const review =
                AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
                  .candidateReviews[index];

              expect(template).toBeDefined();
              expect(evidence).toBeDefined();
              expect(review).toBeDefined();

              expect(
                record.employeeId,
              ).toBe(
                template?.employeeId,
              );

              expect(
                record.templateDigest,
              ).toBe(
                evidence?.templateDigest,
              );

              expect(
                record.candidateReviewDigest,
              ).toBe(
                review?.candidateReviewDigest,
              );

              expect(
                record.qualificationReport
                  .ownerApproval.ownerId,
              ).toBe(
                ENGINEERING_AI_WORKFORCE_OWNER_ID,
              );
            },
          );
      },
    );

    it(
      "records the complete nine-candidate aggregate qualification summary",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          formallyQualifiedCandidateCount:
            9,

          qualificationReportsCreated:
            9,

          qualificationCasesExecuted:
            900,

          qualificationCasesPassed:
            900,

          qualificationCasesFailed:
            0,

          qualificationEvidenceCount:
            900,

          assertionsExecuted:
            11700,

          assertionsPassed:
            11700,

          assertionsFailed:
            0,

          uniqueQualificationDigests:
            9,

          exactNineCandidatesQualified:
            true,

          everyQualificationPassed:
            true,

          independentEvaluatorEvidenceVerified:
            true,

          ownerApprovalRecorded:
            true,
        });
      },
    );

    it(
      "requires canonical template evidence and owner approval sources",
      () => {
        expect(
          () =>
            issueAutonomousGlobalGrowthFormalQualification({
              ...input(),

              templateRegistry: {
                ...AUTONOMOUS_GLOBAL_GROWTH_AI_EMPLOYEE_TEMPLATE_REGISTRY,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth template registry",
        );

        expect(
          () =>
            issueAutonomousGlobalGrowthFormalQualification({
              ...input(),

              executionEvidence: {
                ...AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth formal qualification execution evidence",
        );

        expect(
          () =>
            issueAutonomousGlobalGrowthFormalQualification({
              ...input(),

              approvalDecision: {
                ...AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
              },
            }),
        ).toThrow(
          "canonical Autonomous Global Growth owner approval decision",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner qualification issuance",
      () => {
        expect(
          () =>
            issueAutonomousGlobalGrowthFormalQualification({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            issueAutonomousGlobalGrowthFormalQualification({
              ...input(),

              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "verified evidence-bound NEXUS owner",
        );
      },
    );

    it(
      "blocks qualification issuance before owner approval",
      () => {
        expect(
          () =>
            issueAutonomousGlobalGrowthFormalQualification({
              ...input(),

              qualifiedAt:
                new Date(
                  Date.parse(
                    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
                      .reviewedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "does not create manifests activation candidates or runtimes",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
            .authorityBoundary,
        ).toMatchObject({
          qualificationEngineInvocationAuthorized:
            true,

          qualificationEngineInvoked:
            true,

          qualificationReportCreated:
            true,

          formalQualificationIssued:
            true,

          qualifiedManifestCreated:
            false,

          activationCandidateCreated:
            false,

          ownerActivationRecorded:
            false,

          runtimeActivated:
            false,
        });
      },
    );

    it(
      "keeps repository production customer payment autonomy and public launch blocked",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ISSUANCE
            .authorityBoundary,
        ).toMatchObject({
          controlledWorkAuthorized:
            false,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          branchCreationAuthorized:
            false,

          pullRequestPreparationAuthorized:
            false,

          mergeAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          secretsAccessAuthorized:
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

          financialCommitmentAuthorized:
            false,

          legalCommitmentAuthorized:
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

    it(
      "creates deterministic immutable digest-verified qualification issuance",
      () => {
        const first =
          issueAutonomousGlobalGrowthFormalQualification(
            input(),
          );

        const second =
          issueAutonomousGlobalGrowthFormalQualification(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.issuanceDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.candidateIssuances.map(
              (record) =>
                record.qualificationDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          new Set(
            first.candidateIssuances.map(
              (record) =>
                record.candidateIssuanceDigest,
            ),
          ).size,
        ).toBe(9);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateIssuances,
          ),
        ).toBe(true);

        expect(
          first.candidateIssuances.every(
            (record) =>
              Object.isFrozen(record) &&
              Object.isFrozen(
                record.qualificationReport,
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateAutonomousGlobalGrowthFormalQualificationIssuance(
              first,
            ),
        ).not.toThrow();
      },
      15_000,

    );
  },
);
