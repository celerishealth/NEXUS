import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
} from "../aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceTemplatePreparedTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION,
  createEngineeringAIWorkforceQualificationAdmissionTransitionExecution,
  validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution,
} from "../engineeringAIWorkforceQualificationAdmissionTransitionExecution";

describe(
  "Engineering AI Workforce qualification-admission transition execution",
  () => {
    it(
      "executes exactly eight qualification-admission transitions",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-qualification-admission-transition-execution-v1",
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
      "records only TEMPLATE_PREPARED to QUALIFICATION_ADMISSION_PENDING",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
            .transitionRecords.every(
              (record) =>
                record.sourceLifecycleState ===
                  "TEMPLATE_PREPARED" &&
                record.targetLifecycleState ===
                  "QUALIFICATION_ADMISSION_PENDING" &&
                record.qualificationAdmissionTransitionAuthorized ===
                  true &&
                record.qualificationAdmissionTransitionExecuted ===
                  true &&
                record.qualificationAdmissionPendingRecorded ===
                  true,
            ),
        ).toBe(true);
      },
    );

    it(
      "binds execution to exact owner approval and template-prepared evidence",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          execution.sourceTemplatePreparedExecutionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_TEMPLATE_PREPARED_TRANSITION_EXECUTION
            .executionDigest,
        );
      },
    );

    it(
      "preserves all source evidence append-only",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

        expect(
          execution.transitionRecords.every(
            (record) =>
              record.sourceTemplatePreparedTransitionPreserved ===
                true &&
              record.sourceFactoryRecordPreserved ===
                true &&
              record.templateEvidenceBound ===
                true &&
              record.templatePrepared ===
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
      "does not authorize qualification execution activation runtime or external action",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

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
          qualificationAdmissionPendingRecorded:
            true,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
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
      "retains qualification execution as a separately controlled next step",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .QUALIFICATION_ADMISSION_PENDING,
        ).toContain(
          "QUALIFICATION_IN_PROGRESS",
        );

        expect(
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
            .nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_QUALIFICATION_EXECUTION_DECISION",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

        const second =
          createEngineeringAIWorkforceQualificationAdmissionTransitionExecution({
            executionId:
              first.executionId,
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_ADMISSION_TRANSITION_APPROVAL_DECISION,
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
          validateEngineeringAIWorkforceQualificationAdmissionTransitionExecution(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
