import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "../aiEmployeeFactoryLifecycle";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES,
  AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION,
  createAIWorkforceDirectorPlanningFoundation,
  validateAIWorkforceDirectorPlanningFoundation,
} from "../aiWorkforceDirectorPlanningFoundation";

describe(
  "AI Workforce Director planning foundation",
  () => {
    it(
      "plans exactly the eight contract-priority first-wave specialists",
      () => {
        expect(
          AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION
            .firstWaveCandidateCount,
        ).toBe(8);

        expect(
          AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION
            .plannedCandidates.map(
              (candidate) =>
                candidate.officialRole,
            ),
        ).toEqual(
          AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES,
        );
      },
    );

    it(
      "binds every planned specialist to the roster and factory lifecycle",
      () => {
        for (
          const candidate of
          AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION
            .plannedCandidates
        ) {
          const rosterEntry =
            WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER
              .entries.find(
                (entry) =>
                  entry.employeeId ===
                  candidate.employeeId,
              );

          const factoryRecord =
            AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION
              .candidateRecords.find(
                (record) =>
                  record.employeeId ===
                  candidate.employeeId,
              );

          expect(rosterEntry).toBeDefined();
          expect(factoryRecord).toBeDefined();

          expect(
            rosterEntry?.status,
          ).toBe(
            "PLANNED_CANDIDATE",
          );

          expect(
            factoryRecord?.lifecycleState,
          ).toBe(
            "PLANNED_CANDIDATE",
          );
        }
      },
    );

    it(
      "records planning only without authorizing lifecycle progress",
      () => {
        expect(
          AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION
            .plannedCandidates.every(
              (candidate) =>
                candidate.templatePreparationAuthorized ===
                  false &&
                candidate.qualificationAdmissionAuthorized ===
                  false &&
                candidate.qualificationExecutionAuthorized ===
                  false &&
                candidate.ownerQualificationApprovalRecorded ===
                  false &&
                candidate.activationCandidatePreparationAuthorized ===
                  false &&
                candidate.ownerActivationAuthorized ===
                  false &&
                candidate.runtimeActivationAuthorized ===
                  false &&
                candidate.controlledWorkAuthorized ===
                  false,
            ),
        ).toBe(true);
      },
    );

    it(
      "requires a separate owner plan decision and blocks external authority",
      () => {
        const plan =
          AI_WORKFORCE_DIRECTOR_PLANNING_FOUNDATION;

        expect(
          plan.ownerPlanDecisionRequired,
        ).toBe(true);

        expect(
          plan.ownerPlanDecisionRecorded,
        ).toBe(false);

        expect(
          plan.nextStep,
        ).toBe(
          "AWAIT_OWNER_WORKFORCE_DIRECTOR_PLAN_DECISION",
        );

        expect(
          plan.authorityBoundary,
        ).toEqual({
          internalPlanningOnly:
            true,
          rosterMutationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
          templatePreparationAuthorized:
            false,
          qualificationAdmissionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerQualificationApprovalRecorded:
            false,
          activationCandidatePreparationAuthorized:
            false,
          ownerActivationAuthorized:
            false,
          runtimeActivationAuthorized:
            false,
          controlledWorkAuthorized:
            false,
          productionAuthorityGranted:
            false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          financialCommitmentAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable digest-bound planning evidence",
      () => {
        const first =
          createAIWorkforceDirectorPlanningFoundation({
            planningId:
              "ai-workforce-director-first-wave-plan-v1",
            sourceRoster:
              WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
            sourceFactory:
              AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
            preparedAt:
              "2026-07-20T16:45:00.000Z",
          });

        const second =
          createAIWorkforceDirectorPlanningFoundation({
            planningId:
              "ai-workforce-director-first-wave-plan-v1",
            sourceRoster:
              WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
            sourceFactory:
              AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
            preparedAt:
              "2026-07-20T16:45:00.000Z",
          });

        expect(first).toEqual(second);

        expect(
          first.planningDigest,
        ).toBe(
          second.planningDigest,
        );

        expect(
          first.planningDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.plannedCandidates,
          ),
        ).toBe(true);

        expect(() =>
          validateAIWorkforceDirectorPlanningFoundation(
            first,
          ),
        ).not.toThrow();
      },
    );

    it(
      "fails closed when source roster and factory evidence are not bound",
      () => {
        const mismatchedFactory = {
          ...AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
          sourceRosterDigest:
            "0".repeat(64),
        };

        expect(() =>
          createAIWorkforceDirectorPlanningFoundation({
            planningId:
              "ai-workforce-director-mismatch-plan-v1",
            sourceRoster:
              WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
            sourceFactory:
              mismatchedFactory,
            preparedAt:
              "2026-07-20T16:46:00.000Z",
          }),
        ).toThrow(
          "planning sources are not integrity-bound",
        );
      },
    );
  },
);
