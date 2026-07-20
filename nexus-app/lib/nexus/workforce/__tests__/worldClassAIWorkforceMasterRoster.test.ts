import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_DEPARTMENTS,
} from "../aiEmployeeManifest";

import {
  createWorldClassAIWorkforceMasterRoster,
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

describe(
  "world-class NEXUS AI workforce master roster",
  () => {
    it(
      "preserves Asha, Riya, and Meera as the only existing owner-activated employees",
      () => {
        const existing =
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .entries.filter(
              (entry) =>
                entry.status ===
                "EXISTING_OWNER_ACTIVATED",
            );

        expect(
          existing.map(
            (entry) =>
              entry.publicName,
          ),
        ).toEqual([
          "Asha",
          "Riya",
          "Meera",
        ]);

        expect(
          existing.every(
            (entry) =>
              entry.activationAuthorized ===
                true &&
              entry.department ===
                "SALES",
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps every planned specialist unqualified and activation-blocked",
      () => {
        const planned =
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .entries.filter(
              (entry) =>
                entry.status ===
                "PLANNED_CANDIDATE",
            );

        expect(
          planned.length,
        ).toBeGreaterThan(0);

        expect(
          planned.every(
            (entry) =>
              entry.qualificationRequired ===
                true &&
              entry.activationAuthorized ===
                false &&
              entry.consequentialAuthorityAuthorized ===
                false &&
              entry.externalCommunicationAuthorized ===
                false &&
              entry.productionExecutionAuthorized ===
                false &&
              entry.financialCommitmentAuthorized ===
                false &&
              entry.legalCommitmentAuthorized ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "covers every official NEXUS workforce department",
      () => {
        expect(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .coveredDepartments,
        ).toEqual(
          AI_EMPLOYEE_DEPARTMENTS,
        );
      },
    );

    it(
      "includes Founder Liberation priority specialists",
      () => {
        const roles =
          new Set(
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
              .entries.map(
                (entry) =>
                  entry.officialRole,
              ),
          );

        for (
          const requiredRole of
          [
            "AI Workforce Director",
            "AI Market Intelligence Director",
            "AI Product Director",
            "AI Principal Software Architect",
            "AI Software Engineering Director",
            "AI Quality Assurance Director",
            "AI Security Engineering Director",
            "AI Reliability Engineering Specialist",
            "AI Chaos Engineering Specialist",
            "AI Founder Command & Decision Analyst",
          ]
        ) {
          expect(
            roles.has(requiredRole),
          ).toBe(true);
        }
      },
    );

    it(
      "blocks duplicate employee identities and preserves deterministic immutable evidence",
      () => {
        const first =
          createWorldClassAIWorkforceMasterRoster();
        const second =
          createWorldClassAIWorkforceMasterRoster();

        expect(
          first,
        ).toEqual(second);

        expect(
          first.rosterDigest,
        ).toBe(
          second.rosterDigest,
        );

        expect(
          first.rosterDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.entries.map(
              (entry) =>
                entry.employeeId,
            ),
          ).size,
        ).toBe(
          first.totalEmployeeCount,
        );

        expect(
          new Set(
            first.entries.map(
              (entry) =>
                entry.employeeCode,
            ),
          ).size,
        ).toBe(
          first.totalEmployeeCount,
        );

        expect(
          new Set(
            first.entries.map(
              (entry) =>
                entry.publicName.toLowerCase(),
            ),
          ).size,
        ).toBe(
          first.totalEmployeeCount,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.entries,
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps all consequential and external boundaries blocked",
      () => {
        expect(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .safetyBoundary,
        ).toEqual({
          existingEmployeesPreserved:
            true,
          plannedCandidatesRemainUnqualified:
            true,
          plannedCandidateActivationBlocked:
            true,
          ownerQualificationApprovalRequired:
            true,
          ownerActivationApprovalRequired:
            true,
          tenantIsolationRequired:
            true,
          externalCommunicationAuthorized:
            false,
          productionExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );
  },
);
