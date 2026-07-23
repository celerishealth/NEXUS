import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "../aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION,
} from "../engineeringAIWorkforceTemplatePreparedTransitionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION_VERSION,
  createEngineeringAIWorkforceTemplatePreparedTransitionExecution,
  validateEngineeringAIWorkforceTemplatePreparedTransitionExecution,
} from "../engineeringAIWorkforceTemplatePreparedTransitionExecution";

describe(
  "Engineering AI Workforce template-prepared transition execution",
  () => {
    it(
      "executes exactly eight template-prepared transitions",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION;

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-template-prepared-transition-execution-v1",
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
      "records only the exact sequential template-prepared transition",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
            .transitionRecords.every(
              (record) =>
                record.sourceLifecycleState ===
                  "TEMPLATE_PREPARATION_PENDING" &&
                record.targetLifecycleState ===
                  "TEMPLATE_PREPARED" &&
                record.templatePreparedTransitionExecuted ===
                  true &&
                record.templatePrepared ===
                  true,
            ),
        ).toBe(true);
      },
    );

    it(
      "binds exact owner approval and source transition evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION;

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          execution.sourcePendingExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
            .executionDigest,
        );
      },
    );

    it(
      "preserves all source records as append-only evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION;

        expect(
          execution.transitionRecords.every(
            (record) =>
              record.sourcePendingTransitionPreserved ===
                true &&
              record.sourceFactoryRecordPreserved ===
                true &&
              record.templateEvidenceBound ===
                true,
          ),
        ).toBe(true);

        expect(
          execution.authorityBoundary
            .sourceTransitionRecordsMutated,
        ).toBe(false);
      },
    );

    it(
      "retains qualification activation runtime and external blocks",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION;

        expect(
          execution.transitionRecords.every(
            (record) =>
              record.qualificationAdmissionAuthorized ===
                false &&
              record.qualificationExecutionAuthorized ===
                false &&
              record.qualificationEvidenceAccepted ===
                false &&
              record.ownerQualificationApproved ===
                false &&
              record.activationCandidatePrepared ===
                false &&
              record.ownerActivationApproved ===
                false &&
              record.runtimeAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          execution.authorityBoundary,
        ).toMatchObject({
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
      "retains separately controlled qualification admission as next step",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .TEMPLATE_PREPARED,
        ).toContain(
          "QUALIFICATION_ADMISSION_PENDING",
        );

        expect(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
            .nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_ADMISSION_DECISION",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION;

        const second =
          createEngineeringAIWorkforceTemplatePreparedTransitionExecution({
            executionId:
              first.executionId,
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_APPROVAL_DECISION,
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
          validateEngineeringAIWorkforceTemplatePreparedTransitionExecution(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
