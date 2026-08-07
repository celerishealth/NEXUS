import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION,
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../autonomousGlobalGrowthQualificationExecutionTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision,
} from "../autonomousGlobalGrowthQualificationExecutionTransitionDecision";

describe("Autonomous Global Growth qualification-execution transition approval record", () => {
  it("records owner approval only for QUALIFICATION_ADMISSION_PENDING to QUALIFICATION_IN_PROGRESS", () => {
    const decision =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

    expect(
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_RECORD_VERSION,
    ).toBe(
      "nexus-autonomous-global-growth-qualification-execution-transition-approval-record-v1",
    );

    expect(decision.qualificationExecutionTransitionApproved).toBe(true);
    expect(decision.reviewedEvidence.candidateCount).toBe(9);
    expect(decision.reviewedEvidence.sourceLifecycleState).toBe(
      "QUALIFICATION_ADMISSION_PENDING",
    );
    expect(decision.reviewedEvidence.targetLifecycleState).toBe(
      "QUALIFICATION_IN_PROGRESS",
    );
    expect(decision.nextStep).toBe(
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_V1",
    );
  });

  it("keeps fixtures evidence acceptance activation runtime and external authority blocked", () => {
    const decision =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;
    const boundary =
      decision.authorityBoundary;

    expect(boundary.qualificationExecutionTransitionAuthorized).toBe(true);
    expect(boundary.qualificationExecutionTransitionExecuted).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.qualificationFixtureExecutionStarted).toBe(false);
    expect(boundary.qualificationFixtureExecutionCompleted).toBe(false);
    expect(boundary.qualificationEvidenceCreated).toBe(false);
    expect(boundary.qualificationEvidenceAccepted).toBe(false);
    expect(boundary.ownerQualificationApproved).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.leadContactAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.levelThreeAuthorityGranted).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
    expect(boundary.ownerFinalAuthorityPreserved).toBe(true);
  });

  it("remains immutable and digest-valid", () => {
    const decision =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_APPROVAL_DECISION;

    expect(Object.isFrozen(decision)).toBe(true);
    expect(Object.isFrozen(decision.reviewedEvidence)).toBe(true);
    expect(Object.isFrozen(decision.authorityBoundary)).toBe(true);
    expect(
      Object.isFrozen(decision.candidateQualificationExecutionEligibility),
    ).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthQualificationExecutionTransitionDecision(
        decision,
      ),
    ).not.toThrow();
  });
});