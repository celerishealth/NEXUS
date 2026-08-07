import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
  validateAutonomousGlobalGrowthFormalQualificationTestPlan,
} from "../autonomousGlobalGrowthFormalQualificationTestPlan";

describe("Autonomous Global Growth formal qualification test plan", () => {
  const plan =
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN;

  it("plans exactly nine candidates and nine hundred synthetic cases", () => {
    expect(plan.tenantId).toBe("tenant-nexus-internal-001");
    expect(plan.ownerId).toBe("owner-prashant-001");
    expect(plan.candidatePlanCount).toBe(9);
    expect(plan.candidatePlans).toHaveLength(9);
    expect(plan.totalPlannedCaseCount).toBe(900);

    expect(
      plan.candidatePlans.every(
        (candidate) =>
          candidate.requiredMinimumTestCases === 100 &&
          candidate.plannedCases.length === 100,
      ),
    ).toBe(true);
  });

  it("keeps all planned cases synthetic unprepared unexecuted and without evidence", () => {
    const cases =
      plan.candidatePlans.flatMap(
        (candidate) => candidate.plannedCases,
      );

    expect(cases).toHaveLength(900);

    expect(
      cases.every(
        (plannedCase) =>
          plannedCase.executionMode === "SANDBOX_ONLY" &&
          plannedCase.dataClassification === "SYNTHETIC_SANITIZED_ONLY" &&
          plannedCase.fixtureState === "NOT_PREPARED" &&
          plannedCase.executionState === "NOT_EXECUTED" &&
          plannedCase.evidenceState === "NOT_COLLECTED" &&
          plannedCase.passed === null &&
          plannedCase.evidenceDigest === null &&
          plannedCase.executedAt === null,
      ),
    ).toBe(true);
  });

  it("preserves exact Global Growth candidate codes and blocked authority", () => {
    expect(
      plan.candidatePlans.map(
        (candidate) => candidate.employeeCode,
      ),
    ).toEqual([
      "nx-marketing-004",
      "nx-marketing-005",
      "nx-marketing-006",
      "nx-marketing-007",
      "nx-marketing-008",
      "nx-marketing-009",
      "nx-marketing-010",
      "nx-marketing-011",
      "nx-marketing-012",
    ]);

    expect(plan.preparationEvidence.qualificationFixturesCreated).toBe(0);
    expect(plan.preparationEvidence.qualificationCasesExecuted).toBe(0);
    expect(plan.preparationEvidence.qualificationEvidenceRecordsCollected).toBe(0);
    expect(plan.preparationEvidence.qualifiedCandidateCount).toBe(0);
    expect(plan.preparationEvidence.activationEligibleCandidateCount).toBe(0);
    expect(plan.preparationEvidence.founderLiberationAchieved).toBe(false);

    expect(plan.authorityBoundary.formalQualificationPlanPrepared).toBe(true);
    expect(plan.authorityBoundary.formalQualificationFixturesCreated).toBe(false);
    expect(plan.authorityBoundary.qualificationTestingExecuted).toBe(false);
    expect(plan.authorityBoundary.qualificationEvidenceCollected).toBe(false);
    expect(plan.authorityBoundary.ownerQualificationApproved).toBe(false);
    expect(plan.authorityBoundary.activationCandidateCreated).toBe(false);
    expect(plan.authorityBoundary.runtimeActivated).toBe(false);
    expect(plan.authorityBoundary.externalDeliveryAuthorized).toBe(false);
    expect(plan.authorityBoundary.autonomousExecutionAuthorized).toBe(false);
    expect(plan.authorityBoundary.publicLaunchAuthorized).toBe(false);

    expect(plan.nextStep).toBe(
      "PREPARE_OWNER_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACKS_V1",
    );
  });

  it("validates immutable canonical planning evidence", () => {
    expect(() =>
      validateAutonomousGlobalGrowthFormalQualificationTestPlan(plan),
    ).not.toThrow();

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.candidatePlans)).toBe(true);
    expect(Object.isFrozen(plan.authorityBoundary)).toBe(true);
  });
});