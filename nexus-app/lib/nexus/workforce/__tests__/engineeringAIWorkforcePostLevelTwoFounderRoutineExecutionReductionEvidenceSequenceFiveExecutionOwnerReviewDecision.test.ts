import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecution";

import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision";

function canonicalInput() {
  const execution =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-sequence-five-owner-review-test-001",
    sourceExecution: execution,
    ownerId: execution.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION" as const,
    reason:
      "Owner reviewed the deterministic synthetic escalation matrix, confirmed ambiguity, conflicting instructions, quality defects, security signals, repeated failure, scope escape, and unauthorized authority requests all pause fail closed, return owner control, prevent unauthorized progression, and remain fully auditable, while no actual routine task or owner response was executed.",
    decidedAt: new Date(Date.parse(execution.executedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction sequence-five owner review", () => {
  it("accepts sequence five and authorizes only sequence six", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record).toMatchObject({
      workstreamSequence: 4,
      evidenceSequence: 5,
      controlId: "EXCEPTION_ESCALATION_AND_OWNER_RESPONSE_BOUNDARY",
      executionAccepted: true,
      evidenceAccepted: true,
      sequenceFiveClosed: true,
      nextStep:
        "EXECUTE_ENGINEERING_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_SIX",
    });
  });

  it("records complete escalation evidence", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        canonicalInput(),
      );

    expect(record.reviewedEvidence).toMatchObject({
      evaluatedEscalationCaseCount: 7,
      triggerDetectedCaseCount: 7,
      pausedCaseCount: 7,
      ownerControlReturnedCaseCount: 7,
      unauthorizedProgressionAllowedCount: 0,
      completeAuditEvidenceCaseCount: 7,
      deterministicEscalationVerified: true,
      actualRoutineTaskExecuted: false,
      actualOwnerResponsePerformed: false,
      actualExternalActionPerformed: false,
    });
  });

  it("keeps every consequential authority blocked", () => {
    const boundary =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        canonicalInput(),
      ).authorityBoundary;

    expect(boundary).toMatchObject({
      sequenceSixSyntheticEvidenceAuthorized: true,
      nextEvidenceExecutionAuthorized: true,
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

  it("retains sequence five safely when rejected", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decision:
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION",
        },
      );

    expect(record.executionAccepted).toBe(false);
    expect(record.evidenceAccepted).toBe(false);
    expect(record.sequenceFiveClosed).toBe(false);
    expect(record.authorityBoundary.nextEvidenceExecutionAuthorized).toBe(false);
  });

  it("rejects copied execution, wrong owner, premature review, and tampering", () => {
    const execution =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_SEQUENCE_FIVE_EXECUTION;
    const copiedExecution = { ...execution } as typeof execution;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        { ...canonicalInput(), sourceExecution: copiedExecution },
      ),
    ).toThrow("Only the canonical sequence-five execution");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        { ...canonicalInput(), ownerId: "unauthorized-owner" },
      ),
    ).toThrow("Owner identity is invalid");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        {
          ...canonicalInput(),
          decidedAt: new Date(Date.parse(execution.executedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede sequence-five execution");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        unauthorizedProgressionAuthorized: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceSequenceFiveExecutionOwnerReviewDecision(
        tampered,
      ),
    ).toThrow();
  });
});