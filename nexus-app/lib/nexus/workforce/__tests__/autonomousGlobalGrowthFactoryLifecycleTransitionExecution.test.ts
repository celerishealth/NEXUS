import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION,
  createAutonomousGlobalGrowthFactoryLifecycleTransitionExecution,
  validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution,
} from "../autonomousGlobalGrowthFactoryLifecycleTransitionExecution";

describe("Autonomous Global Growth Factory lifecycle-transition execution", () => {
  it("executes exactly nine sequential PLANNED_CANDIDATE to TEMPLATE_PREPARATION_PENDING transitions", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

    expect(execution.transitionedCandidateCount).toBe(9);
    expect(execution.transitionRecords).toHaveLength(9);
    expect(execution.sourceLifecycleState).toBe("PLANNED_CANDIDATE");
    expect(execution.targetLifecycleState).toBe(
      "TEMPLATE_PREPARATION_PENDING",
    );

    expect(
      execution.transitionRecords.every(
        (record) =>
          record.lifecycleTransitionAuthorized === true &&
          record.lifecycleTransitionExecuted === true &&
          record.sourceFactoryRecordPreserved === true &&
          record.templateCreationEvidenceBound === true,
      ),
    ).toBe(true);
  });

  it("does not bypass TEMPLATE_PREPARED or qualification", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION;

    expect(execution.executionEvidence.templatePreparationPendingRecorded).toBe(
      true,
    );
    expect(execution.executionEvidence.templatePrepared).toBe(false);

    expect(execution.authorityBoundary).toMatchObject({
      directTemplatePreparedBypassAuthorized: false,
      templatePreparationExecutionAuthorized: false,
      templatePrepared: false,
      qualificationAdmissionAuthorized: false,
      qualificationExecutionAuthorized: false,
      qualificationEvidenceAccepted: false,
      ownerQualificationApproved: false,
      activationCandidatePrepared: false,
      employeeActivationAuthorized: false,
      ownerActivationApproved: false,
      runtimeAuthorized: false,
    });
  });

  it("keeps publishing production credentials and external action blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_FACTORY_LIFECYCLE_TRANSITION_EXECUTION
        .authorityBoundary;

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

  it("creates deterministic immutable digest-verified execution evidence", () => {
    const first =
      createAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
        "2026-08-07T03:31:00.000Z",
      );
    const second =
      createAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
        "2026-08-07T03:31:00.000Z",
      );

    expect(first.executionDigest).toBe(second.executionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.transitionRecords)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthFactoryLifecycleTransitionExecution(
        first,
      ),
    ).not.toThrow();

    expect(first.nextStep).toBe(
      "PREPARE_AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_DECISION_V1",
    );
  });
});