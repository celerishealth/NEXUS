import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthQualificationExecutionTransitionDecision,
  validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision,
} from "../autonomousGlobalGrowthQualificationExecutionTransitionDecision";

function approvedDecision() {
  return createAutonomousGlobalGrowthQualificationExecutionTransitionDecision({
    decisionId:
      "autonomous-global-growth-qualification-execution-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1",
    reason:
      "Synthetic owner decision authorizes only the sequential qualification execution lifecycle transition while fixtures, evidence acceptance, activation and runtime remain blocked.",
    decidedAt:
      "2026-08-07T04:39:00.000Z",
  });
}

describe("Autonomous Global Growth qualification-execution transition decision", () => {
  it("authorizes exactly nine pending-to-in-progress transitions without executing them", () => {
    const decision =
      approvedDecision();

    expect(decision.qualificationExecutionTransitionApproved).toBe(true);
    expect(decision.reviewedEvidence.candidateCount).toBe(9);
    expect(decision.reviewedEvidence.sourceLifecycleState).toBe(
      "QUALIFICATION_ADMISSION_PENDING",
    );
    expect(decision.reviewedEvidence.targetLifecycleState).toBe(
      "QUALIFICATION_IN_PROGRESS",
    );

    expect(
      decision.candidateQualificationExecutionEligibility.every(
        (candidate) =>
          candidate.qualificationExecutionTransitionAuthorized === true &&
          candidate.qualificationExecutionTransitionExecuted === false,
      ),
    ).toBe(true);
  });

  it("keeps fixtures evidence acceptance activation runtime and external authority blocked", () => {
    const decision =
      approvedDecision();
    const boundary =
      decision.authorityBoundary;

    expect(decision.reviewedEvidence.qualificationFixturesExecuted).toBe(0);
    expect(decision.reviewedEvidence.qualificationEvidenceRecordsCreated).toBe(0);
    expect(decision.reviewedEvidence.qualifiedCandidateCount).toBe(0);

    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.qualificationFixtureExecutionStarted).toBe(false);
    expect(boundary.qualificationFixtureExecutionCompleted).toBe(false);
    expect(boundary.qualificationEvidenceCreated).toBe(false);
    expect(boundary.qualificationEvidenceAccepted).toBe(false);
    expect(boundary.ownerQualificationApproved).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("fails closed when owner rejects qualification execution transition", () => {
    const decision =
      createAutonomousGlobalGrowthQualificationExecutionTransitionDecision({
        decisionId:
          "autonomous-global-growth-qualification-execution-test-002",
        ownerId:
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        decision:
          "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_PENDING",
        reason:
          "Synthetic rejection retains all nine candidates at qualification admission pending and keeps qualification execution and all later authority blocked.",
        decidedAt:
          "2026-08-07T04:39:30.000Z",
      });

    expect(decision.qualificationExecutionTransitionApproved).toBe(false);
    expect(
      decision.authorityBoundary.qualificationExecutionTransitionAuthorized,
    ).toBe(false);
    expect(decision.nextStep).toBe(
      "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_PENDING",
    );
  });

  it("creates deterministic immutable digest-verified decision evidence", () => {
    const first =
      approvedDecision();
    const second =
      approvedDecision();

    expect(first.decisionDigest).toBe(second.decisionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.reviewedEvidence)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);
    expect(
      Object.isFrozen(first.candidateQualificationExecutionEligibility),
    ).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision(
        first,
      ),
    ).not.toThrow();

    expect(first.nextStep).toBe(
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1",
    );
  });
});