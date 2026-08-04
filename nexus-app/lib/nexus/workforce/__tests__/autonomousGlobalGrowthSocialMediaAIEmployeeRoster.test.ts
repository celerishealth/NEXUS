import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER,
  AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_FUNCTIONS,
  createAutonomousGlobalGrowthSocialMediaAIEmployeeRoster,
  validateAutonomousGlobalGrowthSocialMediaAIEmployeeRoster,
  type AutonomousGlobalGrowthSocialMediaAIEmployeeRoster,
} from "../autonomousGlobalGrowthSocialMediaAIEmployeeRoster";

describe("Autonomous Global Growth Social Media AI Employee Roster v1", () => {
  it("prepares twelve distinct Marketing AI employee roles", () => {
    const roster =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER;

    expect(roster.entries).toHaveLength(12);
    expect(roster.totalEmployeeCount).toBe(12);
    expect(roster.existingMasterRosterCandidateCount).toBe(3);
    expect(roster.newSpecialistCandidateProposalCount).toBe(9);
  });

  it("binds Anika, Aarav and Isha without replacing them", () => {
    const entries =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER.entries;

    expect(
      entries.map((entry) => entry.employeeCode).slice(0, 3),
    ).toEqual([
      "nx-marketing-001",
      "nx-marketing-002",
      "nx-marketing-003",
    ]);

    expect(
      entries.map((entry) => entry.publicName).slice(0, 3),
    ).toEqual(["Anika", "Aarav", "Isha"]);
  });

  it("covers every required Social Media function exactly once", () => {
    const functions =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER.entries.map(
        (entry) => entry.functionKey,
      );

    expect(new Set(functions)).toEqual(
      new Set(AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_FUNCTIONS),
    );
  });

  it("keeps every candidate unqualified and inactive", () => {
    const entries =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER.entries;

    expect(
      entries.every(
        (entry) =>
          entry.lifecycleState === "PLANNED_CANDIDATE" &&
          entry.qualificationRequired === true &&
          entry.activationAuthorized === false &&
          entry.externalActionAuthorized === false,
      ),
    ).toBe(true);
  });

  it("blocks every live, external and Meta action", () => {
    const boundary =
      AUTONOMOUS_GLOBAL_GROWTH_SOCIAL_MEDIA_AI_EMPLOYEE_ROSTER.safetyBoundary;

    expect(boundary.rosterActivationAuthorized).toBe(false);
    expect(boundary.realCredentialAccessAuthorized).toBe(false);
    expect(boundary.liveConnectorActivationAuthorized).toBe(false);
    expect(boundary.publicPublishingAuthorized).toBe(false);
    expect(boundary.customerMessagingAuthorized).toBe(false);
    expect(boundary.productionExecutionAuthorized).toBe(false);
    expect(boundary.autonomousExternalActionAuthorized).toBe(false);
    expect(boundary.blockedMetaAccountUseAuthorized).toBe(false);
    expect(boundary.blockedMetaAccountBypassAuthorized).toBe(false);
    expect(boundary.founderLiberationAchieved).toBe(false);
  });

  it("preserves immutable deterministic evidence and rejects tampering", () => {
    const first =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(
        "2026-08-04T13:20:00.000Z",
      );
    const second =
      createAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(
        "2026-08-04T13:20:00.000Z",
      );

    expect(first).toEqual(second);
    expect(first.rosterDigest).toBe(second.rosterDigest);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.entries)).toBe(true);

    const tampered = {
      ...first,
      safetyBoundary: {
        ...first.safetyBoundary,
        publicPublishingAuthorized: true,
      },
    } as unknown as AutonomousGlobalGrowthSocialMediaAIEmployeeRoster;

    expect(() =>
      validateAutonomousGlobalGrowthSocialMediaAIEmployeeRoster(tampered),
    ).toThrow(
      "Autonomous Global Growth Social Media AI employee roster is invalid",
    );
  });
});