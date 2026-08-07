import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";
import {
  createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision,
  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision,
} from "../autonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision";

function createApprovedDecision() {
  return createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision({
    decisionId:
      "autonomous-global-growth-template-prepared-transition-test-001",
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    decision:
      "APPROVE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1",
    reason:
      "Synthetic approval permits only the next sequential TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED transition while every later authority remains blocked.",
    decidedAt:
      "2026-08-07T03:35:00.000Z",
  });
}

describe("Autonomous Global Growth TEMPLATE_PREPARED Factory transition decision", () => {
  it("authorizes exactly nine sequential TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED transitions", () => {
    const decision =
      createApprovedDecision();

    expect(decision.templatePreparedTransitionApproved).toBe(true);
    expect(decision.candidateCount).toBe(9);

    expect(
      decision.candidateTransitionEligibility.every(
        (candidate) =>
          candidate.sourceLifecycleState === "TEMPLATE_PREPARATION_PENDING" &&
          candidate.targetLifecycleState === "TEMPLATE_PREPARED" &&
          candidate.templatePreparedTransitionAuthorized === true &&
          candidate.templatePreparedTransitionExecuted === false,
      ),
    ).toBe(true);
  });

  it("keeps qualification activation runtime and external authority blocked", () => {
    const boundary =
      createApprovedDecision().authorityBoundary;

    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
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

  it("fails closed on owner rejection", () => {
    const decision =
      createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision({
        decisionId:
          "autonomous-global-growth-template-prepared-transition-test-002",
        ownerId:
          ENGINEERING_AI_WORKFORCE_OWNER_ID,
        decision:
          "REJECT_AND_RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARATION_PENDING",
        reason:
          "Synthetic rejection retains all nine Global Growth candidates in TEMPLATE_PREPARATION_PENDING with every later authority blocked.",
        decidedAt:
          "2026-08-07T03:36:00.000Z",
      });

    expect(decision.templatePreparedTransitionApproved).toBe(false);
    expect(
      decision.authorityBoundary.templatePreparedTransitionAuthorized,
    ).toBe(false);
    expect(decision.nextStep).toBe(
      "RETAIN_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATES_PREPARATION_PENDING",
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
      validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision(
        first,
      ),
    ).not.toThrow();
  });
});