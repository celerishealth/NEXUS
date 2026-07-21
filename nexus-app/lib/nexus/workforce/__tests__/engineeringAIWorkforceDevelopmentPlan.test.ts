import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_FACTORY_LIFECYCLE_FOUNDATION,
} from "../aiEmployeeFactoryLifecycle";

import {
  AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES,
} from "../aiWorkforceDirectorPlanningFoundation";

import {
  WORLD_CLASS_AI_WORKFORCE_MASTER_ROSTER,
} from "../worldClassAIWorkforceMasterRoster";

import {
  ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN,
  ENGINEERING_AI_WORKFORCE_ROLE_DEFINITIONS,
  createEngineeringAIWorkforceDevelopmentPlan,
  validateEngineeringAIWorkforceDevelopmentPlan,
} from "../engineeringAIWorkforceDevelopmentPlan";

describe(
  "Engineering AI Workforce development plan",
  () => {
    it(
      "plans exactly eight source-bound Engineering specialists",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

        expect(
          plan.plannedEngineeringEmployeeCount,
        ).toBe(8);

        expect(
          plan.plannedCandidates,
        ).toHaveLength(8);

        expect(
          plan.plannedCandidates.map(
            (candidate) =>
              candidate.publicName,
          ),
        ).toEqual([
          "Ishaan",
          "Leela",
          "Vivaan",
          "Anaya",
          "Atharv",
          "Mahir",
          "Zara",
          "Advik",
        ]);
      },
    );

    it(
      "matches the exact master-roster and factory identities",
      () => {
        for (
          const candidate of
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
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

          expect(rosterEntry).toMatchObject({
            employeeCode:
              candidate.employeeCode,
            publicName:
              candidate.publicName,
            officialRole:
              candidate.officialRole,
            status:
              "PLANNED_CANDIDATE",
            qualificationRequired:
              true,
            activationAuthorized:
              false,
          });

          expect(factoryRecord).toMatchObject({
            factoryRecordId:
              candidate.sourceFactoryRecordId,
            recordDigest:
              candidate.sourceFactoryRecordDigest,
            lifecycleState:
              "PLANNED_CANDIDATE",
            ownerActivationApproved:
              false,
            runtimeAuthorized:
              false,
          });
        }
      },
    );

    it(
      "records five Director first-wave overlaps and three Engineering extensions",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

        expect(
          plan.directorFirstWaveEngineeringOverlapCount,
        ).toBe(5);

        expect(
          plan.engineeringSpecialistExtensionCount,
        ).toBe(3);

        expect(
          plan.plannedCandidates.filter(
            (candidate) =>
              candidate.includedInWorkforceDirectorFirstWave,
          ).map(
            (candidate) =>
              candidate.officialRole,
          ),
        ).toEqual(
          ENGINEERING_AI_WORKFORCE_ROLE_DEFINITIONS
            .filter(
              (definition) =>
                AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES.includes(
                  definition.officialRole as
                    typeof AI_WORKFORCE_DIRECTOR_FIRST_WAVE_ROLES[number],
                ),
            )
            .map(
              (definition) =>
                definition.officialRole,
            ),
        );
      },
    );

    it(
      "defines specialist missions for architecture delivery quality security reliability chaos data and red-team work",
      () => {
        const missions =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .plannedCandidates.map(
              (candidate) =>
                candidate.roleMission,
            );

        expect(missions).toHaveLength(8);

        expect(
          missions.every(
            (mission) =>
              mission.length >=
                40,
          ),
        ).toBe(true);
      },
    );

    it(
      "targets founder liberation while preserving final owner authority",
      () => {
        expect(
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN
            .founderLiberationObjective,
        ).toEqual({
          routineCodingTakeoverTarget:
            true,
          routineTestingTakeoverTarget:
            true,
          routineSecurityReviewTakeoverTarget:
            true,
          routineReliabilityReviewTakeoverTarget:
            true,
          founderReleaseAchieved:
            false,
          ownerRetainsFinalProductAuthority:
            true,
          ownerRetainsMergeAuthority:
            true,
          ownerRetainsProductionDeploymentAuthority:
            true,
        });
      },
    );

    it(
      "keeps qualification activation repository merge deployment and external authority blocked",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

        expect(
          plan.plannedCandidates.every(
            (candidate) =>
              candidate.templatePreparationAuthorized ===
                false &&
              candidate.qualificationExecutionAuthorized ===
                false &&
              candidate.ownerActivationAuthorized ===
                false &&
              candidate.runtimeActivationAuthorized ===
                false &&
              candidate.repositoryReadAuthorized ===
                false &&
              candidate.repositoryWriteAuthorized ===
                false &&
              candidate.mergeAuthorized ===
                false &&
              candidate.productionDeploymentAuthorized ===
                false &&
              candidate.secretsAccessAuthorized ===
                false,
          ),
        ).toBe(true);

        expect(
          plan.authorityBoundary,
        ).toMatchObject({
          planningOnly:
            true,
          rosterMutationAuthorized:
            false,
          factoryLifecycleTransitionAuthorized:
            false,
          qualificationExecutionAuthorized:
            false,
          ownerActivationAuthorized:
            false,
          runtimeActivationAuthorized:
            false,
          repositoryReadAuthorized:
            false,
          repositoryWriteAuthorized:
            false,
          branchCreationAuthorized:
            false,
          pullRequestPreparationAuthorized:
            false,
          mergeAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          secretsAccessAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          legalCommitmentAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "creates deterministic immutable owner-decision-gated planning evidence",
      () => {
        const first =
          ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN;

        const second =
          createEngineeringAIWorkforceDevelopmentPlan({
            planningId:
              first.planningId,
            preparedAt:
              first.preparedAt,
          });

        expect(second).toEqual(first);

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

        expect(
          first.nextStep,
        ).toBe(
          "AWAIT_OWNER_ENGINEERING_AI_WORKFORCE_DEVELOPMENT_PLAN_DECISION",
        );

        expect(() =>
          validateEngineeringAIWorkforceDevelopmentPlan(
            first,
          ),
        ).not.toThrow();
      },
    );
  },
);
