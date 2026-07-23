import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  validateEngineeringAIWorkforceFormalQualificationReviewDecision,
} from "../engineeringAIWorkforceFormalQualificationReviewDecision";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD,
} from "../engineeringAIWorkforceFormalQualificationReviewApprovalRecord";

describe(
  "Engineering AI Workforce formal qualification review approval record",
  () => {
    it(
      "records Prashant Srivastav's explicit approval for exactly eight candidates",
      () => {
        const approval =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

        expect(
          approval.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          approval.outcome,
        ).toBe(
          "APPROVE_ENGINEERING_FORMAL_QUALIFICATION",
        );

        expect(
          approval.candidateReviews.map(
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
      "binds eight hundred passing cases and ten thousand four hundred passing assertions",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
            .evidenceSummary,
        ).toMatchObject({
          qualificationCasesExecuted:
            800,

          qualificationCasesPassed:
            800,

          qualificationCasesFailed:
            0,

          assertionsExecuted:
            10400,

          assertionsPassed:
            10400,

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
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

        expect(
          approval.authorityBoundary
            .formalQualificationEngineInvocationAuthorized,
        ).toBe(true);

        expect(
          approval.nextStep,
        ).toBe(
          "INVOKE_OWNER_APPROVED_ENGINEERING_FORMAL_QUALIFICATION_ENGINE",
        );
      },
    );

    it(
      "does not invoke the engine issue qualification create manifests or activate runtimes",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
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
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD
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
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_REVIEW_APPROVAL_RECORD;

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
            validateEngineeringAIWorkforceFormalQualificationReviewDecision(
              approval,
            ),
        ).not.toThrow();
      },
    );
  },
);
