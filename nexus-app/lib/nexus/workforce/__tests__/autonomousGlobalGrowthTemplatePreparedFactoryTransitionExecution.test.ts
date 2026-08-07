import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION,
  createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution,
  validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution,
} from "../autonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution";

describe("Autonomous Global Growth TEMPLATE_PREPARED Factory transition execution", () => {
  it("executes exactly nine TEMPLATE_PREPARATION_PENDING to TEMPLATE_PREPARED transitions", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION;

    expect(execution.transitionedCandidateCount).toBe(9);
    expect(execution.transitionRecords).toHaveLength(9);
    expect(execution.sourceLifecycleState).toBe("TEMPLATE_PREPARATION_PENDING");
    expect(execution.targetLifecycleState).toBe("TEMPLATE_PREPARED");

    expect(
      execution.transitionRecords.every(
        (record) =>
          record.templatePreparedTransitionAuthorized === true &&
          record.templatePreparedTransitionExecuted === true &&
          record.templatePrepared === true,
      ),
    ).toBe(true);
  });

  it("preserves pending and Factory source evidence", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION;

    expect(execution.executionEvidence.exactPendingExecutionBound).toBe(true);
    expect(execution.executionEvidence.sourceTransitionRecordsPreserved).toBe(
      true,
    );
    expect(execution.executionEvidence.sourceFactoryRecordsPreserved).toBe(
      true,
    );

    expect(
      execution.transitionRecords.every(
        (record) =>
          record.sourceTransitionRecordPreserved === true &&
          record.sourceFactoryRecordPreserved === true &&
          record.templateCreationEvidenceBound === true,
      ),
    ).toBe(true);
  });

  it("keeps qualification activation runtime publishing and external authority blocked", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_TEMPLATE_PREPARED_FACTORY_TRANSITION_EXECUTION;
    const boundary =
      execution.authorityBoundary;

    expect(execution.executionEvidence.qualificationNotStarted).toBe(true);
    expect(boundary.qualificationAdmissionAuthorized).toBe(false);
    expect(boundary.qualificationExecutionAuthorized).toBe(false);
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
  });

  it("creates deterministic immutable digest-verified execution evidence", () => {
    const first =
      createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
        "2026-08-07T03:50:00.000Z",
      );
    const second =
      createAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
        "2026-08-07T03:50:00.000Z",
      );

    expect(first.executionDigest).toBe(second.executionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.transitionRecords)).toBe(true);
    expect(Object.isFrozen(first.executionEvidence)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthTemplatePreparedFactoryTransitionExecution(
        first,
      ),
    ).not.toThrow();

    expect(first.nextStep).toBe(
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_DECISION_V1",
    );
  });
});