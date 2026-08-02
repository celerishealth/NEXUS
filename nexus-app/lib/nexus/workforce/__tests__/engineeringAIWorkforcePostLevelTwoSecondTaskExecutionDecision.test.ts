import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION,
  ENGINEERING_AI_WORKFORCE_SECOND_TASK_OWNER_APPROVAL_REASONS,
  createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision,
  validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision,
  type EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision,
} from "../engineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision";

describe(
  "Engineering AI Workforce post-Level-2 second-task execution decision",
  () => {
    it(
      "binds the owner decision to the canonical decision preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

        expect(
          record.sourcePreparationId,
        ).toBe(preparation.preparationId);
        expect(
          record.sourcePreparationDigest,
        ).toBe(preparation.preparationDigest);
        expect(record.ownerId).toBe(
          preparation.ownerId,
        );
      },
    );

    it(
      "records exactly eight employee and runtime-bound second-task decisions",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;
        const preparation =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION;

        expect(
          record.candidateDecisions,
        ).toHaveLength(8);
        expect(
          record.candidateDecisions.map(
            (decision) => ({
              employeeId: decision.employeeId,
              employeeCode:
                decision.employeeCode,
              publicName: decision.publicName,
              officialRole:
                decision.officialRole,
              runtimeId: decision.runtimeId,
              sourceDigest:
                decision.sourceCandidateDecisionPreparationDigest,
            }),
          ),
        ).toEqual(
          preparation
            .candidateDecisionPreparations
            .map((source) => ({
              employeeId: source.employeeId,
              employeeCode:
                source.employeeCode,
              publicName: source.publicName,
              officialRole:
                source.officialRole,
              runtimeId: source.runtimeId,
              sourceDigest:
                source.candidateDecisionPreparationDigest,
            })),
        );
      },
    );

    it(
      "authorizes only one candidate for immediate sequential execution",
      () => {
        const decisions =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .candidateDecisions;

        expect(
          decisions.every(
            (decision) =>
              decision.secondTaskExecutionAuthorized ===
                true &&
              decision.secondTaskExecutionPerformed ===
                false,
          ),
        ).toBe(true);

        expect(
          decisions.filter(
            (decision) =>
              decision.currentlyExecutable,
          ),
        ).toHaveLength(1);

        expect(
          decisions[0]
            ?.currentlyExecutable,
        ).toBe(true);

        expect(
          decisions
            .slice(1)
            .every(
              (decision) =>
                decision.waitingForPriorCandidateOwnerReview,
            ),
        ).toBe(true);
      },
    );

    it(
      "keeps execution synthetic sandboxed read-only and owner supervised",
      () => {
        const decisions =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .candidateDecisions;

        expect(
          decisions.every(
            (decision) =>
              decision.reviewedPreparation
                .dataClassification ===
                "SYNTHETIC_SANITIZED_ONLY" &&
              decision.reviewedPreparation
                .executionMode ===
                "SANDBOX_ONLY" &&
              decision.reviewedPreparation
                .evidenceToolMode ===
                "READ_ONLY" &&
              decision.reviewedPreparation
                .ownerReviewFrequency ===
                "AFTER_EVERY_SYNTHETIC_TASK",
          ),
        ).toBe(true);
      },
    );

    it(
      "records the bounded aggregate execution authority",
      () => {
        const summary =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .aggregateSummary;

        expect(summary).toEqual({
          preparedCandidateCount: 8,
          reviewedCandidateCount: 8,
          approvedSecondTaskCount: 8,
          rejectedSecondTaskCount: 0,
          secondTaskExecutionAuthorizedCount:
            8,
          secondTaskExecutionPerformedCount:
            0,
          currentlyExecutableCandidateCount:
            1,
          pendingAuthorizedCandidateCount:
            7,
          thirdTaskExecutionAuthorizedCount:
            0,
          maximumAuthorizedTaskCount: 8,
          aggregateConcurrentExecutionLimit:
            1,
          ownerReviewRequiredAfterEveryExecutionCount:
            8,
          uniqueCandidateDecisionDigests:
            8,
        });
      },
    );

    it(
      "preserves repository production external payment Level-3 and Founder Liberation blocks",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .authorityBoundary,
        ).toMatchObject({
          secondSyntheticTaskExecutionAuthorized:
            true,
          secondSyntheticTaskExecutionAuthorizedCount:
            8,
          secondSyntheticTaskExecutionPerformedCount:
            0,
          onlyOneCandidateCurrentlyExecutable:
            true,
          sequentialExecutionRequired: true,
          aggregateConcurrentExecutionLimit:
            1,
          stopAfterEveryTaskForOwnerReview:
            true,
          stopOnFirstFailure: true,
          thirdSyntheticTaskExecutionAuthorized:
            false,
          repositoryReadAuthorized: false,
          repositoryWriteAuthorized: false,
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          paymentExecutionAuthorized: false,
          autonomousDecisionAuthorized:
            false,
          levelThreeAuthorityGranted:
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
      "advances only to bounded sequence-one execution",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION
            .nextStep,
        ).toBe(
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_SEQUENCE_ONE",
        );
      },
    );

    it(
      "supports rejection without execution authority",
      () => {
        const rejected =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision({
            decisionId:
              "engineering-second-task-rejection-test",
            sourcePreparation:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
            ownerId:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION.ownerId,
            decisions: Array.from(
              { length: 8 },
              () =>
                "REJECT_AND_RETAIN_ENGINEERING_SECOND_SYNTHETIC_TASK_EXECUTION" as const,
            ),
            reasons:
              ENGINEERING_AI_WORKFORCE_SECOND_TASK_OWNER_APPROVAL_REASONS,
            decidedAt:
              "2026-08-02T03:32:01.000Z",
          });

        expect(
          rejected.aggregateSummary
            .approvedSecondTaskCount,
        ).toBe(0);
        expect(
          rejected.aggregateSummary
            .currentlyExecutableCandidateCount,
        ).toBe(0);
        expect(
          rejected.authorityBoundary
            .secondSyntheticTaskExecutionAuthorized,
        ).toBe(false);
        expect(rejected.nextStep).toBe(
          "RETAIN_ENGINEERING_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION",
        );
      },
      15000,
    );

    it(
      "creates deterministic immutable digest-bound owner decision evidence",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

        const recreated =
          createEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision({
            decisionId:
              source.decisionId,
            sourcePreparation:
              ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION_PREPARATION,
            ownerId:
              source.ownerId,
            decisions:
              source.candidateDecisions.map(
                (decision) =>
                  decision.decision,
              ),
            reasons:
              source.candidateDecisions.map(
                (decision) =>
                  decision.reason,
              ),
            decidedAt:
              source.decidedAt,
          });

        expect(recreated).toEqual(source);
        expect(
          source.decisionDigest,
        ).toMatch(/^[0-9a-f]{64}$/);
        expect(Object.isFrozen(source)).toBe(
          true,
        );
        expect(
          source.candidateDecisions.every(
            (decision) =>
              Object.isFrozen(decision) &&
              Object.isFrozen(
                decision.reviewedPreparation,
              ) &&
              Object.isFrozen(
                decision.authorityBoundary,
              ) &&
              /^[0-9a-f]{64}$/.test(
                decision.candidateDecisionDigest,
              ),
          ),
        ).toBe(true);
        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision(
            source,
          ),
        ).not.toThrow();
      },
      15000,
    );

    it(
      "fails closed when repository or production authority is injected",
      () => {
        const source =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_SECOND_TASK_EXECUTION_DECISION;

        const tampered = {
          ...source,
          authorityBoundary: {
            ...source.authorityBoundary,
            repositoryReadAuthorized:
              true,
          },
        } as unknown as EngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision;

        expect(() =>
          validateEngineeringAIWorkforcePostLevelTwoSecondTaskExecutionDecision(
            tampered,
          ),
        ).toThrow();
      },
    );
  },
);