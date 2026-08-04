import { describe, expect, it } from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosurePreparation";
import {
  createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision,
  validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision,
  type EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision,
} from "../engineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision";

function canonicalInput() {
  const preparation =
    ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;

  return {
    decisionId:
      "engineering-founder-routine-execution-reduction-workstream-closure-decision-test-001",
    sourcePreparation: preparation,
    ownerId: preparation.ownerId,
    decision:
      "APPROVE_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE" as const,
    reason:
      "Owner reviewed the formal closure preparation, accepted all eight synthetic evidence sequences and owner reviews, confirmed zero evidence, audit, or authority-boundary gaps, and closed only this synthetic evidence workstream while explicitly retaining Founder Liberation at Level 2 pending actual operational evidence and a separate formal assessment.",
    decidedAt: new Date(Date.parse(preparation.preparedAt) + 1).toISOString(),
  };
}

describe("Founder routine execution reduction workstream closure decision", () => {
  it("closes only the synthetic evidence workstream", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        canonicalInput(),
      );

    expect(record.workstreamClosed).toBe(true);
    expect(record.nextStep).toBe(
      "RETAIN_FOUNDER_LIBERATION_LEVEL_TWO_PENDING_ACTUAL_OPERATIONAL_EVIDENCE_AND_SEPARATE_FORMAL_ASSESSMENT",
    );
  });

  it("records all eight accepted evidence sequences", () => {
    const reviewed =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        canonicalInput(),
      ).reviewedClosureEvidence;

    expect(reviewed.requiredEvidenceSequenceCount).toBe(8);
    expect(reviewed.completedEvidenceSequenceCount).toBe(8);
    expect(reviewed.acceptedOwnerReviewCount).toBe(8);
  });

  it("keeps Founder Liberation and consequential authority blocked", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        canonicalInput(),
      );

    expect(record.reviewedClosureEvidence.actualRoutineTaskExecuted).toBe(false);
    expect(record.reviewedClosureEvidence.actualFounderTimeReductionVerified).toBe(
      false,
    );
    expect(record.authorityBoundary.repositoryReadAuthorized).toBe(false);
    expect(record.authorityBoundary.productionDeploymentAuthorized).toBe(false);
    expect(record.authorityBoundary.levelThreeAuthorityGranted).toBe(false);
    expect(record.authorityBoundary.founderLiberationAchieved).toBe(false);
  });

  it("retains the workstream when rejected", () => {
    const record =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        {
          ...canonicalInput(),
          decision:
            "REJECT_AND_RETAIN_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_OPEN",
        },
      );

    expect(record.workstreamClosed).toBe(false);
    expect(record.authorityBoundary.workstreamFourClosed).toBe(false);
  });

  it("rejects copied preparation, wrong owner, premature decision, and tampering", () => {
    const preparation =
      ENGINEERING_AI_WORKFORCE_POST_LEVEL_TWO_FOUNDER_ROUTINE_EXECUTION_REDUCTION_EVIDENCE_WORKSTREAM_CLOSURE_PREPARATION;
    const copied = { ...preparation } as typeof preparation;

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        { ...canonicalInput(), sourcePreparation: copied },
      ),
    ).toThrow("Only the canonical workstream-closure preparation");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        { ...canonicalInput(), ownerId: "unauthorized-owner" },
      ),
    ).toThrow("Only the preparation-bound NEXUS owner");

    expect(() =>
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        {
          ...canonicalInput(),
          decidedAt: new Date(Date.parse(preparation.preparedAt) - 1).toISOString(),
        },
      ),
    ).toThrow("cannot precede closure preparation");

    const valid =
      createEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        canonicalInput(),
      );
    const tampered = {
      ...valid,
      authorityBoundary: {
        ...valid.authorityBoundary,
        founderLiberationAchieved: true,
      },
    } as unknown as EngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision;

    expect(() =>
      validateEngineeringAIWorkforcePostLevelTwoFounderRoutineExecutionReductionEvidenceWorkstreamClosureDecision(
        tampered,
      ),
    ).toThrow();
  });
});