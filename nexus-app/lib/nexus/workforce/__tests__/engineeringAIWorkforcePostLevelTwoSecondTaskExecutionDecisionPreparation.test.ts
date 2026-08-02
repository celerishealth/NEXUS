import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFirstWorkstreamEvidencePlanReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
  ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS,
  createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation,
  type EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

describe(
  "Engineering AI Workforce post-Level-2 second-task execution-decision preparation",
  () => {
    it(
      "binds to the canonical evidence-plan approval and preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;
        const approval =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_REVIEW_APPROVAL_DECISION;
        const plan =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION;

        expect(
          record.sourceEvidencePlanReviewDecisionId,
        ).toBe(approval.decisionId);
        expect(
          record.sourceEvidencePlanReviewDecisionDigest,
        ).toBe(approval.decisionDigest);
        expect(
          record.sourceEvidencePlanPreparationId,
        ).toBe(plan.preparationId);
        expect(
          record.sourceEvidencePlanPreparationDigest,
        ).toBe(plan.preparationDigest);
      },
    );

    it(
      "prepares exactly eight employee-bound owner decision records",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;
        const plans =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FIRST_WORKSTREAM_EVIDENCE_PLAN_PREPARATION
            .candidatePlans;

        expect(
          record.candidateDecisionPreparationCount,
        ).toBe(8);
        expect(
          record.candidateDecisionPreparations,
        ).toHaveLength(8);
        expect(
          record.candidateDecisionPreparations.map(
            (entry) => ({
              employeeId: entry.employeeId,
              employeeCode: entry.employeeCode,
              publicName: entry.publicName,
              officialRole: entry.officialRole,
              runtimeId: entry.runtimeId,
              sourceCandidatePlanDigest:
                entry.sourceCandidatePlanDigest,
            }),
          ),
        ).toEqual(
          plans.map((plan) => ({
            employeeId: plan.employeeId,
            employeeCode: plan.employeeCode,
            publicName: plan.publicName,
            officialRole: plan.officialRole,
            runtimeId: plan.runtimeId,
            sourceCandidatePlanDigest:
              plan.candidatePlanDigest,
          })),
        );
      },
    );

    it(
      "provides explicit approve-or-reject choices without recording any owner decision",
      () => {
        const entries =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
            .candidateDecisionPreparations;

        expect(
          entries.every(
            (entry) =>
              entry.allowedDecisions ===
                ENGINEERING_AI_WORKFORCE_SECOND_TASK_EXECUTION_DECISION_OPTIONS &&
              entry.ownerExecutionDecisionRequired ===
                true &&
              entry.ownerExecutionDecisionRecorded ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps every candidate synthetic decision-preparation only",
      () => {
        const entries =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
            .candidateDecisionPreparations;

        expect(
          entries.every(
            (entry) =>
              entry.dataClassification ===
                "SYNTHETIC_SANITIZED_ONLY" &&
              entry.outputMode ===
                "DECISION_PREPARATION_ONLY" &&
              entry.secondTaskExecutionAuthorized ===
                false &&
              entry.secondTaskExecuted ===
                false &&
              entry.concurrentExecutionAuthorized ===
                false &&
              entry.concurrentTaskLimit === 0,
          ),
        ).toBe(true);
      },
    );

    it(
      "records zero execution concurrency repository and production authority",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

        expect(record.summary).toEqual({
          candidateCount: 8,
          evidencePlanAcceptedCount: 8,
          decisionPreparationCount: 8,
          ownerExecutionDecisionRequiredCount:
            8,
          ownerExecutionDecisionRecordedCount:
            0,
          secondTaskExecutionAuthorizedCount:
            0,
          secondTaskExecutedCount: 0,
          concurrentExecutionAuthorizedCount:
            0,
          repositoryReadAuthorizedCount: 0,
          repositoryWriteAuthorizedCount:
            0,
          productionDeploymentAuthorizedCount:
            0,
          publicLaunchAuthorizedCount: 0,
        });
      },
    );

    it(
      "preserves Level-3 production external payment launch and Founder Liberation blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION
            .authorityBoundary,
        ).toMatchObject({
          decisionPreparationOnly: true,
          secondTaskExecutionAuthorized:
            false,
          secondTaskExecutionAuthorizedCount:
            0,
          thirdTaskExecutionAuthorized:
            false,
          concurrentExecutionAuthorized:
            false,
          aggregateConcurrentExecutionLimit:
            0,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          paymentExecutionAuthorized: false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized: false,
          autonomousDecisionAuthorized:
            false,
          levelThreeAuthorityGranted:
            false,
          productionReadinessAuthorized:
            false,
          publicLaunchAuthorized: false,
          founderLiberationAchieved: false,
          founderReleasedFromRoutineExecution:
            false,
          ownerFinalAuthorityPreserved:
            true,
        });
      },
    );

    it(
      "requires owner review before any execution authorization",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

        expect(
          record.ownerExecutionDecisionReviewRequired,
        ).toBe(true);
        expect(
          record.ownerExecutionDecisionReviewRecorded,
        ).toBe(false);
        expect(record.nextStep).toBe(
          "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_REVIEW",
        );
      },
    );

    it(
      "creates deterministic immutable digest-bound preparation evidence",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;
        const recreated =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation({
            preparationId:
              source.preparationId,
            preparedAt:
              source.preparedAt,
          });

        expect(recreated).toEqual(source);
        expect(
          source.preparationDigest,
        ).toMatch(/^[0-9a-f]{64}$/);
        expect(Object.isFrozen(source)).toBe(
          true,
        );
        expect(
          Object.isFrozen(
            source.candidateDecisionPreparations,
          ),
        ).toBe(true);
        expect(
          source.candidateDecisionPreparations.every(
            (entry) =>
              Object.isFrozen(entry) &&
              /^[0-9a-f]{64}$/.test(
                entry.candidateDecisionPreparationDigest,
              ),
          ),
        ).toBe(true);
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation(
            source,
          ),
        ).not.toThrow();
      },
      15000,
    );

    it(
      "fails closed when execution authority is injected",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;
        const tampered = {
          ...source,
          authorityBoundary: {
            ...source.authorityBoundary,
            secondTaskExecutionAuthorized:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);