import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
} from "../employeeQualification";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "../engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION,
} from "../engineeringAIWorkforceQualificationExecutionTransitionExecution";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
  ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
  createEngineeringAIWorkforceFormalQualificationTestPlan,
  validateEngineeringAIWorkforceFormalQualificationTestPlan,
} from "../engineeringAIWorkforceFormalQualificationTestPlan";

function input() {
  return {
    planningId:
      "engineering-ai-workforce-formal-qualification-plan-test-001",
    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    evaluatorId:
      ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
    preparedAt:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN
        .preparedAt,
  };
}

describe(
  "Engineering AI Workforce formal qualification test plan",
  () => {
    it(
      "prepares exactly eight candidate plans and eight hundred unexecuted cases",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN;

        expect(
          plan.candidatePlanCount,
        ).toBe(8);

        expect(
          plan.candidatePlans,
        ).toHaveLength(8);

        expect(
          plan.totalPlannedCaseCount,
        ).toBe(800);

        expect(
          plan.candidatePlans.flatMap(
            (candidatePlan) =>
              candidatePlan.plannedCases,
          ),
        ).toHaveLength(800);

        expect(
          plan.candidatePlans.every(
            (candidatePlan) =>
              candidatePlan.plannedCases.length ===
                100,
          ),
        ).toBe(true);
      },
    );

    it(
      "preserves the exact eight Engineering identities and role bindings",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN;

        expect(
          plan.candidatePlans.map(
            (candidatePlan) =>
              candidatePlan.publicName,
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

        expect(
          plan.candidatePlans.map(
            (candidatePlan) =>
              candidatePlan.roleSkillId,
          ),
        ).toEqual([
          "skill-system-architecture-boundary-design",
          "skill-software-delivery-coordination",
          "skill-quality-assurance-regression-design",
          "skill-security-engineering-threat-modeling",
          "skill-reliability-recovery-engineering",
          "skill-chaos-failure-scenario-design",
          "skill-data-engineering-analytics-design",
          "skill-systems-evaluation-red-teaming",
        ]);

        expect(
          plan.candidatePlans.map(
            (candidatePlan) =>
              candidatePlan.roleToolId,
          ),
        ).toEqual([
          "tool-architecture-design-draft",
          "tool-software-delivery-plan-draft",
          "tool-qa-regression-plan-draft",
          "tool-security-threat-model-draft",
          "tool-reliability-recovery-plan-draft",
          "tool-chaos-scenario-draft",
          "tool-data-engineering-plan-draft",
          "tool-red-team-evaluation-draft",
        ]);
      },
    );

    it(
      "applies every canonical qualification minimum to every candidate",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN;

        for (
          const candidatePlan of
          plan.candidatePlans
        ) {
          for (
            const [
              category,
              minimum,
            ] of Object.entries(
              AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
            )
          ) {
            expect(
              candidatePlan.plannedCases.filter(
                (plannedCase) =>
                  plannedCase.category ===
                  category,
              ),
            ).toHaveLength(minimum);
          }
        }
      },
    );

    it(
      "keeps all fixtures execution evidence qualification activation and external authority blocked",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN;

        expect(
          plan.candidatePlans.every(
            (candidatePlan) =>
              candidatePlan.plannedCases.every(
                (plannedCase) =>
                  plannedCase.fixtureState ===
                    "NOT_PREPARED" &&
                  plannedCase.executionState ===
                    "NOT_EXECUTED" &&
                  plannedCase.evidenceState ===
                    "NOT_COLLECTED" &&
                  plannedCase.passed ===
                    null &&
                  plannedCase.evidenceDigest ===
                    null &&
                  plannedCase.executedAt ===
                    null,
              ),
          ),
        ).toBe(true);

        expect(
          plan.authorityBoundary,
        ).toMatchObject({
          formalQualificationPlanPrepared:
            true,
          formalQualificationFixturesCreated:
            false,
          qualificationTestingExecuted:
            false,
          qualificationEvidenceCollected:
            false,
          ownerQualificationApproved:
            false,
          activationCandidateCreated:
            false,
          runtimeActivated:
            false,
          repositoryReadAuthorized:
            false,
          repositoryWriteAuthorized:
            false,
          productionDeploymentAuthorized:
            false,
          realCustomerDataAccessAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          autonomousExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "binds every candidate to its exact qualification-in-progress transition and template digest",
      () => {
        const plan =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN;

        plan.candidatePlans.forEach(
          (
            candidatePlan,
            index,
          ) => {
            const source =
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION
                .transitionRecords[index];

            expect(
              candidatePlan,
            ).toMatchObject({
              employeeId:
                source?.employeeId,
              employeeCode:
                source?.employeeCode,
              publicName:
                source?.publicName,
              officialRole:
                source?.officialRole,
              templateId:
                source?.templateId,
              templateDigest:
                source?.templateDigest,
              sourceTransitionRecordId:
                source?.transitionRecordId,
              sourceTransitionRecordDigest:
                source?.transitionRecordDigest,
              sourceLifecycleState:
                "QUALIFICATION_IN_PROGRESS",
            });
          },
        );
      },
    );

    it(
      "requires an evaluator independent from the owner and blocks cross-scope planning",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationTestPlan({
              ...input(),
              evaluatorId:
                ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "distinct from the owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationTestPlan({
              ...input(),
              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "verified NEXUS owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationTestPlan({
              ...input(),
              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );
      },
    );

    it(
      "blocks planning before qualification-in-progress transition execution",
      () => {
        const earlyTime =
          new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_QUALIFICATION_EXECUTION_TRANSITION_EXECUTION
                .executedAt,
            ) - 1,
          ).toISOString();

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationTestPlan({
              ...input(),
              preparedAt:
                earlyTime,
            }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified planning evidence",
      () => {
        const first =
          createEngineeringAIWorkforceFormalQualificationTestPlan(
            input(),
          );

        const second =
          createEngineeringAIWorkforceFormalQualificationTestPlan(
            input(),
          );

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
            first.candidatePlans,
          ),
        ).toBe(true);

        expect(
          first.candidatePlans.every(
            (candidatePlan) =>
              Object.isFrozen(
                candidatePlan,
              ) &&
              Object.isFrozen(
                candidatePlan.plannedCases,
              ) &&
              candidatePlan.plannedCases.every(
                (plannedCase) =>
                  Object.isFrozen(
                    plannedCase,
                  ),
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceFormalQualificationTestPlan(
              first,
            ),
        ).not.toThrow();
      },
    );
  },
);
