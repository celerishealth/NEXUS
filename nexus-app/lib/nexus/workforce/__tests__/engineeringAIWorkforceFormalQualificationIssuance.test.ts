import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "../engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,
} from "../engineeringAIWorkforceTemplateCreationExecution";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
} from "../engineeringAIWorkforceFormalQualificationExecutionEvidence";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
} from "../engineeringAIWorkforceFormalQualificationReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE,
  issueEngineeringAIWorkforceFormalQualification,
  validateEngineeringAIWorkforceFormalQualificationIssuance,
} from "../engineeringAIWorkforceFormalQualificationIssuance";

function input() {
  return {
    issuanceId:
      "engineering-formal-qualification-issuance-test-001",

    templateRegistry:
      ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,

    executionEvidence:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,

    approvalDecision:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,

    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,

    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,

    qualifiedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
            .reviewedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering AI Workforce formal qualification issuance",
  () => {
    it(
      "invokes the generic qualification engine and formally qualifies exactly eight candidates",
      () => {
        const issuance =
          issueEngineeringAIWorkforceFormalQualification(
            input(),
          );

        expect(
          issuance.issuanceState,
        ).toBe(
          "ENGINEERING_FORMAL_QUALIFICATION_ISSUED",
        );

        expect(
          issuance.candidateIssuances,
        ).toHaveLength(8);

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
          "PREPARE_ENGINEERING_QUALIFIED_EMPLOYEE_MANIFESTS",
        );
      },
    );

    it(
      "issues one hundred passing cases and thirteen hundred passing assertions per candidate",
      () => {
        for (
          const record of
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
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
      "preserves exact Engineering candidate identities in sequence",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
            .candidateIssuances
            .map(
              (record) =>
                record.publicName,
            ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);
      },
    );

    it(
      "binds each qualification report to its exact template evidence and owner review",
      () => {
        ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
          .candidateIssuances
          .forEach(
            (
              record,
              index,
            ) => {
              const template =
                ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY
                  .templates[index];

              const evidence =
                ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
                  .candidateEvidenceLedgers[
                    index
                  ];

              const review =
                ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
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
      "records the complete eight-candidate aggregate qualification summary",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
            .aggregateSummary,
        ).toEqual({
          formallyQualifiedCandidateCount:
            8,

          qualificationReportsCreated:
            8,

          qualificationCasesExecuted:
            800,

          qualificationCasesPassed:
            800,

          qualificationCasesFailed:
            0,

          qualificationEvidenceCount:
            800,

          assertionsExecuted:
            10400,

          assertionsPassed:
            10400,

          assertionsFailed:
            0,

          uniqueQualificationDigests:
            8,

          exactEightCandidatesQualified:
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
            issueEngineeringAIWorkforceFormalQualification({
              ...input(),

              templateRegistry: {
                ...ENGINEERING_AI_WORKFORCE_TEMPLATE_REGISTRY,
              },
            }),
        ).toThrow(
          "canonical Engineering template registry",
        );

        expect(
          () =>
            issueEngineeringAIWorkforceFormalQualification({
              ...input(),

              executionEvidence: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
              },
            }),
        ).toThrow(
          "canonical Engineering formal qualification execution evidence",
        );

        expect(
          () =>
            issueEngineeringAIWorkforceFormalQualification({
              ...input(),

              approvalDecision: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
              },
            }),
        ).toThrow(
          "canonical Engineering owner approval decision",
        );
      },
    );

    it(
      "blocks cross-tenant and cross-owner qualification issuance",
      () => {
        expect(
          () =>
            issueEngineeringAIWorkforceFormalQualification({
              ...input(),

              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            issueEngineeringAIWorkforceFormalQualification({
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
            issueEngineeringAIWorkforceFormalQualification({
              ...input(),

              qualifiedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
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
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
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
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_ISSUANCE
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
          issueEngineeringAIWorkforceFormalQualification(
            input(),
          );

        const second =
          issueEngineeringAIWorkforceFormalQualification(
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
        ).toBe(8);

        expect(
          new Set(
            first.candidateIssuances.map(
              (record) =>
                record.candidateIssuanceDigest,
            ),
          ).size,
        ).toBe(8);

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
            validateEngineeringAIWorkforceFormalQualificationIssuance(
              first,
            ),
        ).not.toThrow();
      },
      15_000,

    );
  },
);
