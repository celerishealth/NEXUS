import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFourExecutionOwnerReviewApprovalRecord";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution";

function canonicalInput() {
  const review =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;

  return {
    executionId:
      "engineering-founder-routine-execution-reduction-sequence-five-test-001",
    sourceOwnerReview: review,
    executedAt: new Date(Date.parse(review.decidedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction evidence sequence five", () => {
  it("creates deterministic exception-escalation evidence", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      workstreamSequence: 4,
      evidenceSequence: 5,
      controlId: "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY",
      evidenceExecutionPerformed: true,
      nextStep:
        "AWAIT_OWNER_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION_REVIEW",
    });

    expect(record.evidence).toMatchObject({
      evaluatedEscalationCaseCount: 7,
      triggerDetectedCaseCount: 7,
      pausedCaseCount: 7,
      ownerControlReturnedCaseCount: 7,
      unauthorizedProgressionAllowedCount: 0,
      completeAuditEvidenceCaseCount: 7,
      deterministicEscalationVerified: true,
    });
  });

  it("pauses every risky case and returns owner control", () => {
    const evidence =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
        .evidence;

    expect(
      evidence.escalationCases.every(
        (entry) =>
          entry.triggerDetected &&
          entry.workPaused &&
          entry.ownerControlReturned &&
          !entry.unauthorizedProgressionAllowed &&
          entry.auditable,
      ),
    ).toBe(true);
  });

  it("executes five evidence items and blocks the final three", () => {
    const ledger =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
        .evidence.sequenceLedger;

    expect(ledger.filter((entry) => entry.evidenceExecutionPerformed)).toHaveLength(5);
    expect(ledger.filter((entry) => !entry.evidenceExecutionPerformed)).toHaveLength(3);
  });

  it("blocks sequence six and all consequential authority", () => {
    const boundary =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION
        .authorityBoundary;

    expect(boundary).toMatchObject({
      sequenceSixEvidenceExecutionAuthorized: false,
      nextEvidenceExecutionAuthorized: false,
      actualRoutineTaskExecutionAuthorized: false,
      actualOwnerResponseExecutionAuthorized: false,
      unauthorizedProgressionAuthorized: false,
      exceptionBypassAuthorized: false,
      scopeEscapeAuthorized: false,
      repositoryReadAuthorized: false,
      repositoryWriteAuthorized: false,
      productionDeploymentAuthorized: false,
      customerContactAuthorized: false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
      levelThreeAuthorityGranted: false,
      founderLiberationAssessmentAuthorized: false,
      founderLiberationAchieved: false,
      founderReleasedFromRoutineExecution: false,
      ownerFinalAuthorityPreserved: true,
    });
  });

  it("rejects copied review, premature execution, and tampering", () => {
    const review =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FOUR_EXECUTION_OWNER_REVIEW_DECISION;
    const copiedReview = { ...review } as typeof review;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
        { ...canonicalInput(), sourceOwnerReview: copiedReview },
      ),
    ).toThrow("Only the canonical approved sequence-four owner review");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
        {
          ...canonicalInput(),
          executedAt: new Date(Date.parse(review.decidedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-four owner review");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        unauthorizedProgressionAuthorized: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution(
        tampered,
      ),
    ).toThrow();
  });
});