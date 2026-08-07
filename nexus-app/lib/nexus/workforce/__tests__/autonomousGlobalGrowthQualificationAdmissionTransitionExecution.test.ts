import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION,
  createAutonomousGlobalGrowthQualificationAdmissionTransitionExecution,
  validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution,
} from "../autonomousGlobalGrowthQualificationAdmissionTransitionExecution";

describe("Autonomous Global Growth qualification-admission transition execution", () => {
  it("executes exactly nine TEMPLATE_PREPARED to QUALIFICATION_ADMISSION_PENDING transitions", () => {
    const execution =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION;

    expect(execution.transitionedCandidateCount).toBe(9);
    expect(execution.transitionRecords).toHaveLength(9);
    expect(execution.sourceLifecycleState).toBe("TEMPLATE_PREPARED");
    expect(execution.targetLifecycleState).toBe(
      "QUALIFICATION_ADMISSION_PENDING",
    );

    expect(
      execution.transitionRecords.every(
        (item) =>
          item.qualificationAdmissionTransitionAuthorized === true &&
          item.qualificationAdmissionTransitionExecuted === true &&
          item.qualificationAdmissionPendingRecorded === true,
      ),
    ).toBe(true);
  });

  it("preserves source evidence and blocks direct qualification execution", () => {
    const evidence =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .executionEvidence;

    expect(evidence.sourceOwnerApprovalBound).toBe(true);
    expect(evidence.sourceTemplatePreparedExecutionPreserved).toBe(true);
    expect(evidence.sourceFactoryRecordsPreserved).toBe(true);
    expect(evidence.exactNineTransitionsExecuted).toBe(true);
    expect(evidence.directQualificationExecutionBypassBlocked).toBe(true);
    expect(evidence.qualificationExecutionStarted).toBe(false);
  });

  it("keeps qualification execution activation runtime and external authority blocked", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_ADMISSION_TRANSITION_EXECUTION
        .authorityBoundary;

    expect(boundary.qualificationAdmissionTransitionExecuted).toBe(true);
    expect(boundary.qualificationAdmissionPendingRecorded).toBe(true);
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
      createAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
        "2026-08-07T04:34:00.000Z",
      );

    const second =
      createAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
        "2026-08-07T04:34:00.000Z",
      );

    expect(first.executionDigest).toBe(second.executionDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.transitionRecords)).toBe(true);
    expect(Object.isFrozen(first.executionEvidence)).toBe(true);
    expect(Object.isFrozen(first.authorityBoundary)).toBe(true);

    expect(() =>
      validateAutonomousGlobalGrowthQualificationAdmissionTransitionExecution(
        first,
      ),
    ).not.toThrow();

    expect(first.nextStep).toBe(
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_QUALIFICATION_EXECUTION_DECISION_V1",
    );
  });
});