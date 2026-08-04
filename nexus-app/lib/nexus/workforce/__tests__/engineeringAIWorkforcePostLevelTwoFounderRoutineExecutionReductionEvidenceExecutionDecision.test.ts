import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionPreparation";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecisionApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_OWNER_APPROVAL_REASONS,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision";

function canonicalInput() {
  const canonical =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
  return {
    decisionId: canonical.decisionId,
    sourcePreparation:
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
    ownerId: canonical.ownerId,
    decisions: Array(8).fill(
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION",
    ) as readonly "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION"[],
    reasons:
      ENGINEERING_AI_WORKFORCE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_OWNER_APPROVAL_REASONS,
    decidedAt: canonical.decidedAt,
  };
}

describe(
  "Engineering Founder Routine Execution Reduction evidence-execution decisions",
  () => {
    it("records all eight owner execution decisions", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
      expect(record).toMatchObject({
        workstreamSequence: 4,
        workstreamId:
          "founder-routine-execution-reduction-evidence",
        evidenceClass:
          "FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE",
        ownerExecutionDecisionsRecorded: true,
        evidenceExecutionDecisionCount: 8,
        nextStep:
          "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_ONE",
      });
      expect(record.candidateDecisions).toHaveLength(8);
      expect(record.summary).toMatchObject({
        approvedEvidenceExecutionCount: 8,
        rejectedEvidenceExecutionCount: 0,
        currentlyExecutableCount: 1,
        waitingForPriorEvidenceOwnerReviewCount: 7,
        evidenceExecutionPerformedCount: 0,
        taskExecutionAuthorizedCount: 0,
        maximumEvidenceExecutionCount: 1,
        aggregateConcurrentExecutionLimit: 0,
        uniqueCandidateDecisionDigestCount: 8,
      });
    });

    it("authorizes only sequence one immediately", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
      expect(record.candidateDecisions[0]).toMatchObject({
        sequence: 1,
        evidenceExecutionAuthorized: true,
        evidenceExecutionPerformed: false,
        currentlyExecutable: true,
        waitingForPriorEvidenceOwnerReview: false,
      });
      for (const candidate of record.candidateDecisions.slice(1)) {
        expect(candidate).toMatchObject({
          evidenceExecutionAuthorized: true,
          evidenceExecutionPerformed: false,
          currentlyExecutable: false,
          waitingForPriorEvidenceOwnerReview: true,
        });
      }
    });

    it("preserves actual task and consequential authority blocks", () => {
      const record =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
      expect(record.authorityBoundary).toMatchObject({
        syntheticRoutineExecutionReductionEvidenceAuthorized: true,
        syntheticRoutineExecutionReductionEvidencePerformed: false,
        workstreamFourEvidenceExecutionAuthorized: true,
        founderRoutineExecutionReductionEvidenceAuthorized: true,
        founderRoutineExecutionReductionExecutionAuthorized: false,
        founderRoutineExecutionReductionClaimAuthorized: false,
        founderLiberationAssessmentAuthorized: false,
        oneAtATimeEvidenceExecutionRequired: true,
        currentlyExecutableEvidenceCount: 1,
        aggregateConcurrentExecutionLimit: 0,
        taskExecutionAuthorized: false,
        repositoryReadAuthorized: false,
        repositoryWriteAuthorized: false,
        commandExecutionAuthorized: false,
        networkAccessAuthorized: false,
        publicLaunchAuthorized: false,
        levelThreeAuthorityGranted: false,
        founderLiberationAchieved: false,
        ownerFinalAuthorityPreserved: true,
      });
    });

    it("retains all execution when every candidate is rejected", () => {
      const rejected =
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision({
          ...canonicalInput(),
          decisionId:
            "founder-routine-execution-reduction-evidence-execution-rejection-test-001",
          decisions: Array(8).fill(
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION",
          ) as readonly "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION"[],
        });
      expect(rejected.summary).toMatchObject({
        approvedEvidenceExecutionCount: 0,
        rejectedEvidenceExecutionCount: 8,
        currentlyExecutableCount: 0,
        waitingForPriorEvidenceOwnerReviewCount: 0,
      });
      expect(rejected.nextStep).toBe(
        "RETAIN_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION",
      );
    });

    it("rejects copied preparation and detects tampering", () => {
      const copiedPreparation = {
        ...ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION,
      } as typeof ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION_PREPARATION;
      expect(() =>
        createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision({
          ...canonicalInput(),
          sourcePreparation: copiedPreparation,
        }),
      ).toThrow("Only the canonical");
      const canonical =
        ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_EXECUTION_DECISION;
      const tampered = {
        ...canonical,
        authorityBoundary: {
          ...canonical.authorityBoundary,
          taskExecutionAuthorized: true,
        },
      } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision;
      expect(() =>
        validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceExecutionDecision(
          tampered,
        ),
      ).toThrow();
    });
  },
);
