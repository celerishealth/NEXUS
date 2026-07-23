import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "../aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
} from "../engineeringAIWorkforceQualificationExecutionTransitionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION,
  createEngineeringAIWorkforceQualificationExecutionTransitionExecution,
  validateEngineeringAIWorkforceQualificationExecutionTransitionExecution,
} from "../engineeringAIWorkforceQualificationExecutionTransitionExecution";

describe(
  "Engineering AI Workforce qualification-execution transition execution",
  () => {
    it(
      "executes exactly eight approved sequential transitions",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION;

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-qualification-execution-transition-execution-v1",
        );

        expect(
          execution.transitionedCandidateCount,
        ).toBe(8);

        expect(
          execution.transitionRecords,
        ).toHaveLength(8);

        expect(
          execution.transitionRecords.map(
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
      "moves only admission-pending candidates into qualification-in-progress",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION
            .transitionRecords.every(
              (record) =>
                record.sourceLifecycleState ===
                  "QUALIFICATION_ADMISSION_PENDING" &&
                record.targetLifecycleState ===
                  "QUALIFICATION_IN_PROGRESS" &&
                record.qualificationExecutionTransitionAuthorized ===
                  true &&
                record.qualificationExecutionTransitionExecuted ===
                  true,
            ),
        ).toBe(true);
      },
    );

    it(
      "enables bounded qualification execution authority without running fixtures",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION;

        expect(
          execution.transitionRecords.every(
            (record) =>
              record.qualificationExecutionAuthorized ===
                true &&
              record.qualificationFixturePackPrepared ===
                false &&
              record.qualificationFixtureExecutionStarted ===
                false &&
              record.qualificationFixtureExecutionCompleted ===
                false &&
              record.qualificationEvidenceCreated ===
                false &&
              record.qualificationEvidenceAccepted ===
                false,
          ),
        ).toBe(true);

        expect(
          execution.transitionEvidence,
        ).toMatchObject({
          qualificationExecutionAuthorityEnabled:
            true,
          qualificationFixturesExecuted:
            0,
          qualificationEvidenceRecordsCreated:
            0,
          qualificationEvidenceRecordsAccepted:
            0,
          qualifiedCandidateCount:
            0,
        });
      },
    );

    it(
      "retains owner qualification activation runtime and external blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION
            .authorityBoundary,
        ).toMatchObject({
          qualificationExecutionTransitionExecuted:
            true,
          qualificationExecutionAuthorized:
            true,
          qualificationFixturePackPrepared:
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
      "binds execution to the exact owner approval",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION;

        expect(
          execution.sourceDecisionId,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION
            .decisionId,
        );

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          Date.parse(
            execution.executedAt,
          ),
        ).toBeGreaterThanOrEqual(
          Date.parse(
            ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION
              .decidedAt,
          ),
        );
      },
    );

    it(
      "retains controlled fixture preparation as the next step",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .QUALIFICATION_IN_PROGRESS,
        ).toContain(
          "OWNER_QUALIFICATION_REVIEW_PENDING",
        );

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION
            .nextStep,
        ).toBe(
          "PREPARE_CONTROLLED_ENGINEERING_QUALIFICATION_FIXTURE_PACKS",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified execution evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION;

        const second =
          createEngineeringAIWorkforceQualificationExecutionTransitionExecution({
            executionId:
              first.executionId,
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
            executedAt:
              first.executedAt,
          });

        expect(second).toEqual(first);

        expect(
          first.executionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.transitionRecords,
          ),
        ).toBe(true);

        expect(
          first.transitionRecords.every(
            (record) =>
              Object.isFrozen(record),
          ),
        ).toBe(true);

        expect(() =>
          validateEngineeringAIWorkforceQualificationExecutionTransitionExecution(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
