import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionExecution";

import {
  validateEngineeringAIWorkforceQualificationExecutionTransitionDecision,
} from "../engineeringAIWorkforceQualificationExecutionTransitionDecision";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../engineeringAIWorkforceQualificationExecutionTransitionApprovalRecord";

describe(
  "Engineering AI Workforce qualification-execution transition approval record",
  () => {
    it(
      "records explicit verified-owner approval",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_RECORD_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-qualification-execution-transition-approval-record-v1",
        );

        expect(
          decision.ownerId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        );

        expect(
          decision.decision,
        ).toBe(
          "APPROVE_ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION",
        );

        expect(
          decision.qualificationExecutionTransitionApproved,
        ).toBe(true);
      },
    );

    it(
      "binds approval to the exact qualification-admission execution",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.sourceExecutionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
            .executionId,
        );

        expect(
          decision.sourceExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
            .executionDigest,
        );

        expect(
          decision.sourceFactoryFoundationDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
            .sourceFactoryFoundationDigest,
        );

        expect(
          Date.parse(
            decision.decidedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
              .executedAt,
          ),
        );
      },
    );

    it(
      "authorizes exactly eight transitions without executing them",
      () => {
        const candidates =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION
            .candidateQualificationExecutionEligibility;

        expect(candidates).toHaveLength(8);

        expect(
          candidates.map(
            (candidate) =>
              candidate.publicName,
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

        expect(
          candidates.every(
            (candidate) =>
              candidate.sourceLifecycleState ===
                "QUALIFICATION_ADMISSION_PENDING" &&
              candidate.targetLifecycleState ===
                "QUALIFICATION_IN_PROGRESS" &&
              candidate.qualificationExecutionTransitionAuthorized ===
                true &&
              candidate.qualificationExecutionTransitionExecuted ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not start qualification fixtures or evidence creation",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.reviewedEvidence,
        ).toMatchObject({
          qualificationFixturesExecuted:
            0,
          qualificationEvidenceRecordsCreated:
            0,
          qualificationEvidenceRecordsAccepted:
            0,
          qualifiedCandidateCount:
            0,
          activationEligibleCandidateCount:
            0,
          founderLiberationAchieved:
            false,
        });

        expect(
          decision.authorityBoundary,
        ).toMatchObject({
          qualificationExecutionTransitionAuthorized:
            true,
          qualificationExecutionTransitionExecuted:
            false,
          qualificationExecutionAuthorized:
            false,
          qualificationFixtureExecutionStarted:
            false,
          qualificationFixtureExecutionCompleted:
            false,
          qualificationEvidenceCreated:
            false,
          qualificationEvidenceAccepted:
            false,
          ownerQualificationApproved:
            false,
        });

        expect(
          decision.nextStep,
        ).toBe(
          "APPLY_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_TRANSITION",
        );
      },
    );

    it(
      "retains activation runtime repository deployment and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION
            .authorityBoundary,
        ).toMatchObject({
          activationCandidatePrepared:
            false,
          ownerActivationApproved:
            false,
          runtimeAuthorized:
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
          controlledWorkAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "records immutable digest-verified approval evidence",
      () => {
        const decision =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

        expect(
          decision.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(decision),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.reviewedEvidence,
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.candidateQualificationExecutionEligibility,
          ),
        ).toBe(true);

        expect(
          decision.candidateQualificationExecutionEligibility.every(
            (candidate) =>
              Object.isFrozen(candidate),
          ),
        ).toBe(true);

        expect(
          Object.isFrozen(
            decision.authorityBoundary,
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceQualificationExecutionTransitionDecision(
            decision,
          ),
        ).not.toThrow();
      },
    );
  },
);
