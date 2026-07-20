import {
  describe,
  expect,
  it,
} from "vitest";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
  AI_EMPLOYEE_FACTORY_LIFECYCLE_STATES,
  createAIEmployeeFactoryLifecycleFoundation,
} from "../aiEmployeeFactoryLifecycle";

describe(
  "owner-controlled AI Employee Factory lifecycle foundation",
  () => {
    it(
      "creates records only for planned roster candidates",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .plannedCandidateCount,
        ).toBe(
          WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
            .plannedCandidateCount,
        );

        expect(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .candidateRecords.some(
              (record) =>
                [
                  "Asha",
                  "Riya",
                  "Meera",
                ].includes(
                  record.publicName,
                ),
            ),
        ).toBe(false);
      },
    );

    it(
      "keeps every initial candidate planned and completely activation-blocked",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .candidateRecords.every(
              (record) =>
                record.lifecycleState ===
                  "PLANNED_CANDIDATE" &&
                record.templatePrepared ===
                  false &&
                record.qualificationAdmissionAuthorized ===
                  false &&
                record.qualificationEvidenceAccepted ===
                  false &&
                record.ownerQualificationApproved ===
                  false &&
                record.activationCandidatePrepared ===
                  false &&
                record.ownerActivationApproved ===
                  false &&
                record.runtimeAuthorized ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "defines a sequential fail-closed lifecycle without direct activation",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_STATES,
        ).toContain(
          "PAUSED_AWAITING_OWNER_ACTIVATION",
        );

        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .PLANNED_CANDIDATE,
        ).not.toContain(
          "OWNER_ACTIVATED",
        );

        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .TEMPLATE_PREPARED,
        ).not.toContain(
          "OWNER_ACTIVATED",
        );

        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .QUALIFICATION_IN_PROGRESS,
        ).not.toContain(
          "OWNER_ACTIVATED",
        );

        expect(
          AI_EMPLOYEE_FACTORY_ALLOWED_TRANSITIONS
            .PAUSED_AWAITING_OWNER_ACTIVATION,
        ).toContain(
          "OWNER_ACTIVATED",
        );
      },
    );

    it(
      "requires owner qualification and activation control while blocking external authority",
      () => {
        expect(
          AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
            .safetyBoundary,
        ).toEqual({
          existingActivatedEmployeesExcluded:
            true,
          directTemplateBypassBlocked:
            true,
          directQualificationBypassBlocked:
            true,
          incompleteQualificationBlocked:
            true,
          directActivationBypassBlocked:
            true,
          selfActivationBlocked:
            true,
          ownerQualificationApprovalRequired:
            true,
          ownerActivationApprovalRequired:
            true,
          emergencyPauseRequired:
            true,
          tenantIsolationRequired:
            true,
          evidencePreservationRequired:
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

    it(
      "creates unique deterministic immutable factory evidence",
      () => {
        const first =
          createAIEmployeeFactoryLifecycleFoundation(
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
            "2026-07-20T16:20:00.000Z",
          );

        const second =
          createAIEmployeeFactoryLifecycleFoundation(
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
            "2026-07-20T16:20:00.000Z",
          );

        expect(first).toEqual(second);

        expect(
          first.foundationDigest,
        ).toBe(
          second.foundationDigest,
        );

        expect(
          first.foundationDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.candidateRecords.map(
              (record) =>
                record.employeeId,
            ),
          ).size,
        ).toBe(
          first.plannedCandidateCount,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateRecords,
          ),
        ).toBe(true);

        expect(
          first.candidateRecords.every(
            (record) =>
              Object.isFrozen(record),
          ),
        ).toBe(true);
      },
    );
  },
);
