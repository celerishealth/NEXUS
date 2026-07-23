import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "../aiEmployeeFactoryLifecycle";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
  ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION,
  createEngineeringAIWorkforceFactoryLifecycleTransitionExecution,
  validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution,
} from "../engineeringAIWorkforceFactoryLifecycleTransitionExecution";

describe(
  "Engineering AI Workforce Factory lifecycle-transition execution",
  () => {
    it(
      "executes exactly eight first-step lifecycle transitions",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

        expect(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION_VERSION,
        ).toBe(
          "nexus-engineering-ai-workforce-factory-lifecycle-transition-execution-v1",
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
      "records only PLANNED_CANDIDATE to TEMPLATE_PREPARATION_PENDING",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
            .transitionRecords.every(
              (record) =>
                record.sourceLifecycleState ===
                  "PLANNED_CANDIDATE" &&
                record.targetLifecycleState ===
                  "TEMPLATE_PREPARATION_PENDING" &&
                record.lifecycleTransitionAuthorized ===
                  true &&
                record.lifecycleTransitionExecuted ===
                  true,
            ),
        ).toBe(true);
      },
    );

    it(
      "preserves every exact source Factory record and digest",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

        expect(
          execution.sourceFactoryFoundationDigest,
        ).toBe(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .foundationDigest,
        );

        execution.transitionRecords.forEach(
          (record) => {
            const source =
              AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
                .candidateRecords.find(
                  (candidate) =>
                    candidate.factoryRecordId ===
                    record.sourceFactoryRecordId,
                );

            expect(source).toBeDefined();

            expect(
              record.sourceFactoryRecordDigest,
            ).toBe(
              source?.recordDigest,
            );

            expect(
              record.sourceFactoryRecordPreserved,
            ).toBe(true);
          },
        );
      },
    );

    it(
      "binds transition evidence to the exact owner approval and templates",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

        expect(
          execution.sourceDecisionDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION
            .decisionDigest,
        );

        expect(
          execution.transitionRecords.map(
            (record) => ({
              employeeId:
                record.employeeId,
              templateId:
                record.templateId,
              templateDigest:
                record.templateDigest,
            }),
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION
            .candidateTransitionEligibility
            .map(
              (candidate) => ({
                employeeId:
                  candidate.employeeId,
                templateId:
                  candidate.templateId,
                templateDigest:
                  candidate.templateDigest,
              }),
            ),
        );
      },
    );

    it(
      "does not mark templates prepared or grant downstream authority",
      () => {
        const execution =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

        expect(
          execution.transitionRecords.every(
            (record) =>
              record.templatePreparationExecutionAuthorized ===
                false &&
              record.templatePrepared ===
                false &&
              record.qualificationAdmissionAuthorized ===
                false &&
              record.qualificationExecutionAuthorized ===
                false &&
              record.ownerQualificationApproved ===
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
          directTemplatePreparedTransitionAuthorized:
            false,
          templatePreparationExecutionAuthorized:
            false,
          templatePrepared:
            false,
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
      "fails closed when execution predates owner approval",
      () => {
        expect(() =>
          createEngineeringAIWorkforceFactoryLifecycleTransitionExecution({
            executionId:
              "engineering-ai-workforce-factory-lifecycle-transition-too-early-001",
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
            executedAt:
              "2026-07-22T17:31:07.181Z",
          }),
        ).toThrow(
          "cannot precede owner approval",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified execution evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

        const second =
          createEngineeringAIWorkforceFactoryLifecycleTransitionExecution({
            executionId:
              first.executionId,
            approvalDecision:
              ENGINEERING_AI_WORKFORCE_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
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
          validateEngineeringAIWorkforceFactoryLifecycleTransitionExecution(
            first,
          ),
        ).not.toThrow();

        expect(
          first.nextStep,
        ).toBe(
          "PREPARE_OWNER_CONTROLLED_ENGINEERING_TEMPLATE_PREPARED_TRANSITION_DECISION",
        );
      },
    );
  },
);
