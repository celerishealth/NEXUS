import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION,
  AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_RECORD_VERSION,
} from "../autonomousGlobalGrowthTemplatePreparedFactoryTransitionApprovalRecord";
import {
  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision,
} from "../autonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision";

describe("Autonomous Global Growth TEMPLATE_PREPARED Factory transition approval record", () => {
  it("records owner approval only for TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED", () => {
    const decision =
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION;

    expect(
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_RECORD_VERSION,
    ).toBe(
      "nexus-autonomous-global-growth-template-prepared-factory-transition-approval-record-v1",
    );

    expect(decision.templatePreparedTransitionApproved).toBe(true);
    expect(decision.candidateCount).toBe(9);
    expect(decision.sourceLifecycleState).toBe("TEMPLATE_PREPARATION_PENDING");
    expect(decision.targetLifecycleState).toBe("TEMPLATE_PREPARED");
    expect(decision.nextStep).toBe(
      "APPLY_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_V1",
    );
  });

  it("keeps qualification activation runtime publishing and external authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION
        .authorityBoundary;

    expect(boundary.templatePreparedTransitionAuthorized).toBe(true);
    expect(boundary.templatePreparedTransitionExecuted).toBe(false);
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
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_APPROVAL_DECISION;

    expect(Object.isFrozen(decision)).toBe(true);
    expect(Object.isFrozen(decision.authorityBoundary)).toBe(true);
    expect(Object.isFrozen(decision.candidateTransitionEligibility)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionDecision(
        decision,
      ),
    ).not.toThrow();
  });
});