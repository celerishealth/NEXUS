import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecisionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_OWNER_APPROVAL_REASONS,
  createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
  validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
  type EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision,
} from "../engineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision";

function approvalInput() {
  return {
    decisionId:
      "engineering-concurrent-coordination-evidence-execution-decision-test-001",

    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION,

    ownerId:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION.ownerId,

    decisions: [
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
      "APPROVE_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
    ] as const,

    reasons:
      ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_OWNER_APPROVAL_REASONS,

    decidedAt:
      new Date(
        Date.parse(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION
            .preparedAt,
        ) + 1,
      ).toISOString(),
  };
}

describe(
  "Engineering concurrent-coordination evidence execution owner decision",
  () => {
    it(
      "records eight approvals but makes only sequence one executable",
      () => {
        const record =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
            approvalInput(),
          );

        expect(record).toMatchObject({
          decisionState:
            "OWNER_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISIONS_RECORDED",

          candidateDecisionCount:
            8,

          nextStep:
            "EXECUTE_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_SEQUENCE_ONE",
        });

        expect(
          record.aggregateSummary
            .evidenceExecutionAuthorizedCount,
        ).toBe(8);

        expect(
          record.aggregateSummary
            .currentlyExecutableEvidenceCount,
        ).toBe(1);

        expect(
          record.candidateDecisions[0]
            ?.currentlyExecutable,
        ).toBe(true);

        expect(
          record.candidateDecisions
            .slice(1)
            .every(
              (candidate) =>
                candidate.waitingForPriorEvidenceOwnerReview,
            ),
        ).toBe(true);
      },
    );

    it(
      "binds the canonical eight-control decision preparation",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION;

        expect(
          record.sourcePreparationDigest,
        ).toBe(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION
            .preparationDigest,
        );

        expect(
          record.candidateDecisions.map(
            (candidate) =>
              candidate.controlId,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION
            .evidenceDecisionPreparations
            .map(
              (item) =>
                item.controlId,
            ),
        );
      },
    );

    it(
      "preserves sequential evidence execution and blocks concurrent Engineering work",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION
            .authorityBoundary;

        expect(boundary).toMatchObject({
          concurrentCoordinationEvidenceExecutionAuthorized:
            true,

          concurrentCoordinationEvidenceExecutionAuthorizedCount:
            8,

          concurrentCoordinationEvidenceExecutionPerformedCount:
            0,

          onlyOneEvidenceItemCurrentlyExecutable:
            true,

          sequentialEvidenceExecutionRequired:
            true,

          aggregateEvidenceExecutionLimit:
            1,

          stopAfterEveryEvidenceForOwnerReview:
            true,

          stopOnFirstFailure:
            true,

          concurrentEngineeringWorkAuthorized:
            false,

          aggregateConcurrentEngineeringWorkLimit:
            0,

          repositoryReadAuthorized:
            false,

          repositoryWriteAuthorized:
            false,

          productionDeploymentAuthorized:
            false,

          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "keeps every approved evidence item synthetic read-only and unperformed",
      () => {
        for (
          const candidate of
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION
            .candidateDecisions
        ) {
          expect(candidate).toMatchObject({
            evidenceExecutionAuthorized:
              true,

            evidenceExecutionPerformed:
              false,

            reviewedPreparation: {
              executionMode:
                "SYNTHETIC_SANDBOX_EVIDENCE_ONLY",

              evidenceToolMode:
                "READ_ONLY_EVIDENCE_ONLY",

              maximumEvidenceExecutionCount:
                1,

              concurrentExecutionLimit:
                0,

              ownerReviewAfterExecutionRequired:
                true,
            },

            authorityBoundary: {
              concurrentEngineeringWorkAuthorized:
                false,

              repositoryReadAuthorized:
                false,

              repositoryWriteAuthorized:
                false,

              founderLiberationAchieved:
                false,
            },
          });
        }
      },
    );

    it(
      "supports fail-closed rejection with zero executable evidence",
      () => {
        const rejected =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision({
            ...approvalInput(),

            decisionId:
              "engineering-concurrent-coordination-evidence-rejection-test-001",

            decisions: [
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
              "REJECT_AND_RETAIN_ENGINEERING_CONCURRENT_COORDINATION_SAFETY_EVIDENCE_EXECUTION",
            ] as const,

            reasons:
              ENGINEERING_AI_WORKFORCE_CONCURRENT_COORDINATION_EVIDENCE_OWNER_APPROVAL_REASONS,
          });

        expect(
          rejected.aggregateSummary
            .evidenceExecutionAuthorizedCount,
        ).toBe(0);

        expect(
          rejected.aggregateSummary
            .currentlyExecutableEvidenceCount,
        ).toBe(0);

        expect(rejected.nextStep).toBe(
          "RETAIN_ENGINEERING_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION",
        );
      },
    );

    it(
      "rejects non-owner malformed count and premature decisions",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision({
              ...approvalInput(),

              ownerId:
                "owner-other-001",
            }),
        ).toThrow(
          "Only the preparation-bound NEXUS owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision({
              ...approvalInput(),

              decisions:
                approvalInput()
                  .decisions
                  .slice(0, 7),
            }),
        ).toThrow(
          "Exactly eight",
        );

        expect(
          () =>
            createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision({
              ...approvalInput(),

              decidedAt:
                new Date(
                  Date.parse(
                    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION_PREPARATION
                      .preparedAt,
                  ) - 1,
                ).toISOString(),
            }),
        ).toThrow(
          "cannot precede decision preparation",
        );
      },
      120_000,
    );

    it(
      "is deterministic deeply immutable and detects tampering",
      () => {
        const first =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
            approvalInput(),
          );

        const second =
          createEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
            approvalInput(),
          );

        expect(second).toEqual(first);

        expect(
          first.decisionDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateDecisions,
          ),
        ).toBe(true);

        expect(
          first.candidateDecisions.every(
            (candidate) =>
              Object.isFrozen(candidate),
          ),
        ).toBe(true);

        const tampered = {
          ...first,

          authorityBoundary: {
            ...first.authorityBoundary,

            concurrentEngineeringWorkAuthorized:
              true,
          },
        } as unknown as
          EngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
              tampered,
            ),
        ).toThrow();
      },
      120_000,
    );

    it(
      "exports one valid owner decision while Founder Liberation remains Level 2",
      () => {
        const record =
          ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_CONCURRENT_COORDINATION_EVIDENCE_EXECUTION_DECISION;

        expect(
          () =>
            validateEngineeringAIWorkforcePostLevelTwoConcurrentCoordinationEvidenceExecutionDecision(
              record,
            ),
        ).not.toThrow();

        expect(
          record.authorityBoundary
            .levelThreeAuthorityGranted,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .founderLiberationAchieved,
        ).toBe(false);

        expect(
          record.authorityBoundary
            .ownerFinalAuthorityPreserved,
        ).toBe(true);
      },
      120_000,
    );
  },
);