import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION,
  createAutonomousGlobalGrowthQualificationExecutionTransitionExecution,
  validateAutonomousGlobalGrowthQualificationExecutionTransitionExecution,
} from "../autonomousGlobalGrowthQualificationExecutionTransitionExecution";

describe("Autonomous Global Growth qualification-execution transition execution", () => {
  it("executes exactly nine pending-to-in-progress lifecycle transitions", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION;

    expect(execution.transitionedCandidateCount).toBe(9);
    expect(execution.transitionRecords).toHaveLength(9);
    expect(execution.sourceLifecycleState).toBe(
      "QUALIFICATION_ADMISSION_PENDING",
    );
    expect(execution.targetLifecycleState).toBe(
      "QUALIFICATION_IN_PROGRESS",
    );

    expect(
      execution.transitionRecords.every(
        (item) =>
          item.qualificationExecutionTransitionAuthorized === true &&
          item.qualificationExecutionTransitionExecuted === true &&
          item.qualificationExecutionAuthorized === true,
      ),
    ).toBe(true);
  });

  it("does not execute fixture packs or create qualification evidence", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION;

    expect(
      execution.executionEvidence.qualificationFixturePacksPrepared,
    ).toBe(0);
    expect(
      execution.executionEvidence.qualificationFixturesExecuted,
    ).toBe(0);
    expect(
      execution.executionEvidence.qualificationEvidenceRecordsCreated,
    ).toBe(0);
    expect(
      execution.executionEvidence.qualificationEvidenceRecordsAccepted,
    ).toBe(0);

    expect(
      execution.authorityBoundary.qualificationFixturePackPrepared,
    ).toBe(false);
    expect(
      execution.authorityBoundary.qualificationFixtureExecutionStarted,
    ).toBe(false);
    expect(
      execution.authorityBoundary.qualificationEvidenceCreated,
    ).toBe(false);
    expect(
      execution.authorityBoundary.qualificationEvidenceAccepted,
    ).toBe(false);
  });

  it("keeps qualification approval activation runtime and external authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION
        .authorityBoundary;

    expect(boundary.qualificationExecutionAuthorized).toBe(true);
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

  it("creates deterministic immutable digest-verified evidence", () => {
    const first =
      createAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
        "2026-08-07T05:00:00.000Z",
      );

    const second =
      createAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
        "2026-08-07T05:00:00.000Z",
      );

    expect(first.executionDigest).toBe(second.executionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.transitionRecords)).toBe(true);
    expect(Object.isFrozen(first.executionEvidence)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthQualificationExecutionTransitionExecution(
        first,
      ),
    ).not.toThrow();

    expect(first.nextStep).toBe(
      "PREPARE_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_FIXTURE_PACKS_V1",
    );
  });
});