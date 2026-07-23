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
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
  ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "../engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
  createEngineeringAIWorkforceFormalQualificationFixturePack,
  validateEngineeringAIWorkforceFormalQualificationFixturePack,
} from "../engineeringAIWorkforceFormalQualificationFixturePack";

function input() {
  return {
    fixturePackId:
      "engineering-ai-workforce-formal-fixture-pack-test-001",
    plan:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    evaluatorId:
      ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
    preparedAt:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK
        .preparedAt,
  };
}

describe(
  "Engineering AI Workforce formal qualification fixture pack",
  () => {
    it(
      "prepares exactly eight candidate packs and eight hundred fixtures",
      () => {
        const pack =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK;

        expect(
          pack.candidateFixturePackCount,
        ).toBe(8);

        expect(
          pack.candidateFixturePacks,
        ).toHaveLength(8);

        expect(
          pack.totalFixtureCount,
        ).toBe(800);

        expect(
          pack.candidateFixturePacks.flatMap(
            (candidatePack) =>
              candidatePack.fixtures,
          ),
        ).toHaveLength(800);

        expect(
          pack.candidateFixturePacks.every(
            (candidatePack) =>
              candidatePack.fixtures.length ===
                100,
          ),
        ).toBe(true);
      },
    );

    it(
      "binds every fixture to its exact candidate plan and planned case",
      () => {
        const pack =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK;

        pack.candidateFixturePacks.forEach(
          (
            candidatePack,
            candidateIndex,
          ) => {
            const candidatePlan =
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN
                .candidatePlans[
                  candidateIndex
                ];

            expect(
              candidatePack,
            ).toMatchObject({
              candidatePlanId:
                candidatePlan?.candidatePlanId,
              candidatePlanDigest:
                candidatePlan?.candidatePlanDigest,
              employeeId:
                candidatePlan?.employeeId,
              employeeCode:
                candidatePlan?.employeeCode,
              publicName:
                candidatePlan?.publicName,
              officialRole:
                candidatePlan?.officialRole,
              templateId:
                candidatePlan?.templateId,
              templateDigest:
                candidatePlan?.templateDigest,
            });

            candidatePack.fixtures.forEach(
              (
                fixture,
                fixtureIndex,
              ) => {
                const plannedCase =
                  candidatePlan?.plannedCases[
                    fixtureIndex
                  ];

                expect(
                  fixture,
                ).toMatchObject({
                  caseId:
                    plannedCase?.caseId,
                  casePlanDigest:
                    plannedCase?.casePlanDigest,
                  category:
                    plannedCase?.category,
                  expectedControl:
                    plannedCase?.expectedControl,
                  employeeId:
                    plannedCase?.employeeId,
                  templateId:
                    plannedCase?.templateId,
                  roleSkillId:
                    plannedCase?.roleSkillId,
                  roleToolId:
                    plannedCase?.roleToolId,
                });
              },
            );
          },
        );
      },
    );

    it(
      "applies canonical category minimums to every candidate fixture pack",
      () => {
        const pack =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK;

        for (
          const candidatePack of
          pack.candidateFixturePacks
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
              candidatePack.fixtures.filter(
                (fixture) =>
                  fixture.category ===
                  category,
              ),
            ).toHaveLength(minimum);
          }
        }
      },
    );

    it(
      "uses only sanitized synthetic payloads with no customer secrets production identifiers or repository content",
      () => {
        const fixtures =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK
            .candidateFixturePacks
            .flatMap(
              (candidatePack) =>
                candidatePack.fixtures,
            );

        expect(
          fixtures.every(
            (fixture) =>
              fixture.fixtureMode ===
                "SANITIZED_SYNTHETIC_ONLY" &&
              fixture.syntheticInput
                .customerDataIncluded ===
                false &&
              fixture.syntheticInput
                .secretsIncluded ===
                false &&
              fixture.syntheticInput
                .productionIdentifiersIncluded ===
                false &&
              fixture.syntheticInput
                .repositoryContentIncluded ===
                false &&
              fixture.syntheticInput
                .externalDeliveryRequested ===
                false &&
              fixture.syntheticInput
                .liveProviderExecutionRequested ===
                false &&
              fixture.syntheticInput
                .paymentExecutionRequested ===
                false &&
              fixture.syntheticInput
                .productionMutationRequested ===
                false &&
              fixture.syntheticInput
                .autonomousExecutionRequested ===
                false,
          ),
        ).toBe(true);
      },
    );

    it(
      "keeps fixture execution evidence qualification activation runtime and external authority blocked",
      () => {
        const pack =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK;

        expect(
          pack.candidateFixturePacks.every(
            (candidatePack) =>
              candidatePack.fixtures.every(
                (fixture) =>
                  fixture.executionState ===
                    "NOT_EXECUTED" &&
                  fixture.evidenceState ===
                    "NOT_COLLECTED" &&
                  fixture.passed ===
                    null &&
                  fixture.evidenceDigest ===
                    null &&
                  fixture.executedAt ===
                    null,
              ),
          ),
        ).toBe(true);

        expect(
          pack.authorityBoundary,
        ).toMatchObject({
          formalQualificationFixturesCreated:
            true,
          qualificationTestingExecuted:
            false,
          qualificationEvidenceCollected:
            false,
          hardCodedPassingEvidenceAccepted:
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
      "requires the canonical plan owner tenant and independent evaluator",
      () => {
        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationFixturePack({
              ...input(),
              evaluatorId:
                ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "independent",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationFixturePack({
              ...input(),
              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "plan-bound verified NEXUS owner",
        );

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationFixturePack({
              ...input(),
              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        const clonedPlan = {
          ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
        };

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationFixturePack({
              ...input(),
              plan:
                clonedPlan,
            }),
        ).toThrow(
          "canonical Engineering formal qualification plan",
        );
      },
    );

    it(
      "blocks fixture preparation before its qualification plan",
      () => {
        const earlyTime =
          new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN
                .preparedAt,
            ) - 1,
          ).toISOString();

        expect(
          () =>
            createEngineeringAIWorkforceFormalQualificationFixturePack({
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
      "creates deterministic immutable digest-verified fixture evidence",
      () => {
        const first =
          createEngineeringAIWorkforceFormalQualificationFixturePack(
            input(),
          );

        const second =
          createEngineeringAIWorkforceFormalQualificationFixturePack(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.fixturePackDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(first.fixtureIds).size,
        ).toBe(800);

        expect(
          new Set(first.fixtureDigests).size,
        ).toBe(800);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateFixturePacks,
          ),
        ).toBe(true);

        expect(
          first.candidateFixturePacks.every(
            (candidatePack) =>
              Object.isFrozen(
                candidatePack,
              ) &&
              Object.isFrozen(
                candidatePack.fixtures,
              ) &&
              candidatePack.fixtures.every(
                (fixture) =>
                  Object.isFrozen(
                    fixture,
                  ),
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceFormalQualificationFixturePack(
              first,
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
            ),
        ).not.toThrow();
      },
    );
  },
);
