import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthFactoryLifecycleTransitionDecision,
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision,
} from "../autonomousGlobalGrowthFactoryLifecycleTransitionDecision";

function createApprovedDecision() {
  return createAutonomousGlobalGrowthFactoryLifecycleTransitionDecision({
    decisionId:
      "autonomous-global-growth-factory-lifecycle-transition-owner-decision-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1",
    reason:
      "Synthetic test approval authorizes only the first sequential Factory transition while every qualification, activation, runtime, publishing and external authority remains blocked.",
    decidedAt:
      "2026-08-07T02:30:00.000Z",
  });
}

describe("Autonomous Global Growth Factory lifecycle-transition decision", () => {
  it("authorizes exactly nine PLANNED_CANDIDATE to TEMPLATE_PREPARATION_PENDING transitions", () => {
    const decision =
      createApprovedDecision();

    expect(decision.lifecycleTransitionApproved).toBe(true);
    expect(decision.candidateCount).toBe(9);
    expect(decision.candidateTransitionEligibility).toHaveLength(9);

    expect(
      decision.candidateTransitionEligibility.every(
        (candidate) =>
          candidate.sourceLifecycleState === "PLANNED_CANDIDATE" &&
          candidate.targetLifecycleState === "TEMPLATE_PREPARATION_PENDING" &&
          candidate.templateCreationEvidenceBound === true &&
          candidate.lifecycleTransitionAuthorized === true &&
          candidate.lifecycleTransitionExecuted === false,
      ),
    ).toBe(true);
  });

  it("keeps qualification activation runtime publishing and external authority blocked", () => {
    const decision =
      createApprovedDecision();

    expect(decision.authorityBoundary).toMatchObject({
      directTemplatePreparedBypassAuthorized: false,
      qualificationAdmissionAuthorized: false,
      qualificationExecutionAuthorized: false,
      qualificationEvidenceAccepted: false,
      ownerQualificationApproved: false,
      activationCandidatePrepared: false,
      employeeActivationAuthorized: false,
      ownerActivationApproved: false,
      runtimeAuthorized: false,
      controlledWorkAuthorized: false,
      realCredentialAccessAuthorized: false,
      liveConnectorActivationAuthorized: false,
      videoGenerationExecutionAuthorized: false,
      publicPublishingAuthorized: false,
      customerMessagingAuthorized: false,
      leadContactAuthorized: false,
      demoBookingExecutionAuthorized: false,
      productionExecutionAuthorized: false,
      autonomousExternalActionAuthorized: false,
      blockedMetaAccountUseAuthorized: false,
      blockedMetaAccountBypassAuthorized: false,
      levelThreeAuthorityGranted: false,
      founderLiberationAchieved: false,
      ownerFinalAuthorityPreserved: true,
    });
  });

  it("fails closed on rejection", () => {
    const decision =
      createAutonomousGlobalGrowthFactoryLifecycleTransitionDecision({
        decisionId:
          "autonomous-global-growth-factory-lifecycle-transition-owner-decision-test-002",
        ownerId:
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        decision:
          "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_CANDIDATES_PLANNED",
        reason:
          "Synthetic rejection test retains all nine candidates in the planned state with every later authority blocked.",
        decidedAt:
          "2026-08-07T02:31:00.000Z",
      });

    expect(decision.lifecycleTransitionApproved).toBe(false);
    expect(decision.authorityBoundary.lifecycleTransitionAuthorized).toBe(false);
    expect(
      decision.candidateTransitionEligibility.every(
        (candidate) =>
          candidate.lifecycleTransitionAuthorized === false &&
          candidate.lifecycleTransitionExecuted === false,
      ),
    ).toBe(true);
    expect(decision.nextStep).toBe(
      "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_CANDIDATES_PLANNED",
    );
  });

  it("creates deterministic immutable digest-verified evidence", () => {
    const first =
      createApprovedDecision();
    const second =
      createApprovedDecision();

    expect(first.decisionDigest).toBe(second.decisionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);
    expect(Object.isFrozen(first.candidateTransitionEligibility)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision(first),
    ).not.toThrow();
  });
});