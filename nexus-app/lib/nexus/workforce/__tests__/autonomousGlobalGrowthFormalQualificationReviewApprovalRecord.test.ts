import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  validateAutonomousGlobalGrowthFormalQualificationReviewDecision,
} from "../autonomousGlobalGrowthFormalQualificationReviewDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
} from "../autonomousGlobalGrowthFormalQualificationReviewApprovalRecord";

describe(
  "Autonomous Global Growth formal qualification review approval record",
  () => {
    it(
      "records Prashant Srivastav's explicit approval for exactly nine candidates",
      () => {
        const approval =
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

        expect(
          approval.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          approval.outcome,
        ).toBe(
          "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION",
        );

        expect(
          approval.candidateReviews.map(
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
      "binds nine hundred passing cases and eleven thousand seven hundred passing assertions",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
            .evidenceSummary,
        ).toMatchObject({
          qualificationCasesExecuted:
            900,

          qualificationCasesPassed:
            900,

          qualificationCasesFailed:
            0,

          assertionsExecuted:
            11700,

          assertionsPassed:
            11700,

          assertionsFailed:
            0,

          hardCodedPassingEvidenceAccepted:
            false,
        });
      },
    );

    it(
      "authorizes only the next formal qualification-engine invocation step",
      () => {
        const approval =
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

        expect(
          approval.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(true);

        expect(
          approval.nextStep,
        ).toBe(
          "INVOKE_OWNER_APPROVED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_ENGINE",
        );
      },
    );

    it(
      "does not invoke the engine issue qualification create manifests or activate runtimes",
      () => {
        expect(
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
            .authorityBoundary,
        ).toMatchObject({
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
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
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
      "is immutable and passes exact decision validation",
      () => {
        const approval =
          AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

        expect(
          Object.isFrozen(approval),
        ).toBe(true);

        expect(
          approval.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          () =>
            validateAutonomousGlobalGrowthFormalQualificationReviewDecision(
              approval,
            ),
        ).not.toThrow();
      },
    );
  },
);
