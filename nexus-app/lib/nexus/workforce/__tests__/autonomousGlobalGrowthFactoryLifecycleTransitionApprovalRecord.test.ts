import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION,
  AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../autonomousGlobalGrowthFactoryLifecycleTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision,
} from "../autonomousGlobalGrowthFactoryLifecycleTransitionDecision";

describe("Autonomous Global Growth Factory lifecycle-transition approval record", () => {
  it("records owner approval only for the first sequential Factory transition", () => {
    const decision =
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

    expect(
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_RECORD_VERSION,
    ).toBe(
      "nexus-autonomous-global-growth-factory-lifecycle-transition-approval-record-v1",
    );

    expect(decision.lifecycleTransitionApproved).toBe(true);
    expect(decision.candidateCount).toBe(9);
    expect(decision.sourceLifecycleState).toBe("PLANNED_CANDIDATE");
    expect(decision.targetLifecycleState).toBe("TEMPLATE_PREPARATION_PENDING");
    expect(decision.nextStep).toBe(
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_V1",
    );
  });

  it("keeps all later authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION
        .authorityBoundary;

    expect(boundary.lifecycleTransitionAuthorized).toBe(true);
    expect(boundary.lifecycleTransitionExecuted).toBe(false);
    expect(boundary.directTemplatePreparedBypassAuthorized).toBe(false);
    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
    expect(boundary.qualificationEvidenceAccepted).toBe(false);
    expect(boundary.employeeActivationAuthorized).toBe(false);
    expect(boundary.runtimeAuthorized).toBe(false);
    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.leadContactAuthorized).toBe(false);
    expect(boundary.demoBookingExecutionAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.levelThreeAuthorityGranted).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
    expect(boundary.ownerFinalAuthorityPreserved).toBe(true);
  });

  it("remains immutable and digest-valid", () => {
    const decision =
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_APPROVAL_DECISION;

    expect(Object.isFrozen(decision)).toBe(true);
    expect(Object.isFrozen(decision.authorityBoundary)).toBe(true);
    expect(Object.isFrozen(decision.candidateTransitionEligibility)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthFactoryLifecycleTransitionDecision(
        decision,
      ),
    ).not.toThrow();
  });
});