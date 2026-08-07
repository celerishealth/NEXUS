import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthQualificationAdmissionTransitionDecision,
  validateAutonomousGlobalGrowthQualificationAdmissionTransitionDecision,
} from "../autonomousGlobalGrowthQualificationAdmissionTransitionDecision";

function createApprovedDecision() {
  return createAutonomousGlobalGrowthQualificationAdmissionTransitionDecision({
    decisionId:
      "autonomous-global-growth-qualification-admission-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1",
    reason:
      "Synthetic owner decision authorizes only the exact sequential qualification-admission transition while qualification execution and all later authority remain blocked.",
    decidedAt:
      "2026-08-07T04:00:00.000Z",
  });
}

describe("Autonomous Global Growth qualification-admission transition decision", () => {
  it("authorizes exactly nine TEMPLATE_PREPARED to QUALIFICATION_ADMISSION_PENDING transitions", () => {
    const decision =
      createApprovedDecision();

    expect(decision.qualificationAdmissionTransitionApproved).toBe(true);
    expect(decision.candidateCount).toBe(9);
    expect(decision.sourceLifecycleState).toBe("TEMPLATE_PREPARED");
    expect(decision.targetLifecycleState).toBe(
      "QUALIFICATION_ADMISSION_PENDING",
    );

    expect(
      decision.candidateQualificationAdmissionEligibility.every(
        (candidate) =>
          candidate.sourceLifecycleState === "TEMPLATE_PREPARED" &&
          candidate.targetLifecycleState ===
            "QUALIFICATION_ADMISSION_PENDING" &&
          candidate.qualificationAdmissionTransitionAuthorized === true &&
          candidate.qualificationAdmissionTransitionExecuted === false,
      ),
    ).toBe(true);
  });

  it("blocks direct qualification execution and all later authority", () => {
    const decision =
      createApprovedDecision();
    const boundary =
      decision.authorityBoundary;

    expect(
      decision.decisionEvidence.directQualificationExecutionBypassBlocked,
    ).toBe(true);
    expect(
      decision.decisionEvidence.qualificationExecutionCandidateCount,
    ).toBe(0);

    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.qualificationEvidenceAccepted).toBe(false);
    expect(boundary.ownerQualificationApproved).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.levelThreeAuthorityGranted).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("fails closed when owner rejects qualification admission", () => {
    const decision =
      createAutonomousGlobalGrowthQualificationAdmissionTransitionDecision({
        decisionId:
          "autonomous-global-growth-qualification-admission-test-002",
        ownerId:
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        decision:
          "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARED",
        reason:
          "Synthetic rejection retains all nine Global Growth candidates at TEMPLATE_PREPARED and keeps every qualification and runtime authority blocked.",
        decidedAt:
          "2026-08-07T04:01:00.000Z",
      });

    expect(decision.qualificationAdmissionTransitionApproved).toBe(false);
    expect(
      decision.authorityBoundary
        .qualificationAdmissionTransitionAuthorized,
    ).toBe(false);
    expect(decision.nextStep).toBe(
      "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARED",
    );
  });

  it("creates deterministic immutable digest-verified decision evidence", () => {
    const first =
      createApprovedDecision();
    const second =
      createApprovedDecision();

    expect(first.decisionDigest).toBe(second.decisionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.decisionEvidence)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);
    expect(
      Object.isFrozen(first.candidateQualificationAdmissionEligibility),
    ).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthQualificationAdmissionTransitionDecision(
        first,
      ),
    ).not.toThrow();

    expect(first.nextStep).toBe(
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_V1",
    );
  });
});