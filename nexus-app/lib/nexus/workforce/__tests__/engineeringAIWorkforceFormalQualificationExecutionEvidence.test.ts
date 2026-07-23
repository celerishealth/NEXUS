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
} from "../engineeringAIWorkforceFormalQualificationFixturePack";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE,
  executeEngineeringAIWorkforceFormalQualificationEvidence,
  validateEngineeringAIWorkforceFormalQualificationExecutionEvidence,
} from "../engineeringAIWorkforceFormalQualificationExecutionEvidence";

function input() {
  return {
    ledgerId:
      "engineering-ai-workforce-formal-qualification-evidence-ledger-test-001",
    plan:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
    fixturePack:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    evaluatorId:
      ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
    executedAt:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
        .executedAt,
  };
}

describe(
  "Engineering AI Workforce formal qualification execution evidence",
  () => {
    it(
      "captures exactly eight candidate ledgers and eight hundred qualification cases",
      () => {
        const ledger =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE;

        expect(
          ledger.candidateEvidenceLedgerCount,
        ).toBe(8);

        expect(
          ledger.candidateEvidenceLedgers,
        ).toHaveLength(8);

        expect(
          ledger.evidenceBindings,
        ).toHaveLength(800);

        expect(
          ledger.qualificationCases,
        ).toHaveLength(800);

        expect(
          ledger.candidateEvidenceLedgers.every(
            (candidateLedger) =>
              candidateLedger.evidenceBindings.length ===
                100 &&
              candidateLedger.qualificationCases.length ===
                100,
          ),
        ).toBe(true);
      },
    );

    it(
      "derives thirteen passing assertions per fixture and ten thousand four hundred aggregate assertions",
      () => {
        const ledger =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE;

        expect(
          ledger.evidenceBindings.every(
            (binding) =>
              binding.assertionDerivedEvidence ===
                true &&
              binding.hardCodedPassingEvidenceAccepted ===
                false &&
              binding.assertionCount ===
                13 &&
              binding.assertionsPassed ===
                13 &&
              binding.passed ===
                true &&
              Object.values(
                binding.assertions,
              ).every(
                (assertion) =>
                  assertion === true,
              ),
          ),
        ).toBe(true);

        expect(
          ledger.summary,
        ).toMatchObject({
          assertionsExecuted:
            10400,
          assertionsPassed:
            10400,
          assertionsFailed:
            0,
        });
      },
    );

    it(
      "binds every evidence record to its exact plan case fixture template and role",
      () => {
        const ledger =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE;

        ledger.candidateEvidenceLedgers.forEach(
          (
            candidateLedger,
            candidateIndex,
          ) => {
            const candidatePlan =
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN
                .candidatePlans[
                  candidateIndex
                ];

            const candidateFixturePack =
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK
                .candidateFixturePacks[
                  candidateIndex
                ];

            expect(
              candidateLedger,
            ).toMatchObject({
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
              candidatePlanId:
                candidatePlan?.candidatePlanId,
              candidatePlanDigest:
                candidatePlan?.candidatePlanDigest,
              candidateFixturePackId:
                candidateFixturePack?.candidateFixturePackId,
              candidateFixturePackDigest:
                candidateFixturePack?.candidateFixturePackDigest,
            });

            candidateLedger.evidenceBindings.forEach(
              (
                binding,
                bindingIndex,
              ) => {
                const plannedCase =
                  candidatePlan?.plannedCases[
                    bindingIndex
                  ];

                const fixture =
                  candidateFixturePack?.fixtures[
                    bindingIndex
                  ];

                expect(
                  binding,
                ).toMatchObject({
                  fixtureId:
                    fixture?.fixtureId,
                  fixtureDigest:
                    fixture?.fixtureDigest,
                  plannedCaseId:
                    plannedCase?.caseId,
                  casePlanDigest:
                    plannedCase?.casePlanDigest,
                  category:
                    plannedCase?.category,
                  expectedControl:
                    plannedCase?.expectedControl,
                  observedControl:
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
      "preserves canonical qualification category coverage for every employee",
      () => {
        const ledger =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE;

        for (
          const candidateLedger of
          ledger.candidateEvidenceLedgers
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
              candidateLedger.qualificationCases.filter(
                (qualificationCase) =>
                  qualificationCase.category ===
                  category,
              ),
            ).toHaveLength(minimum);
          }
        }
      },
    );

    it(
      "keeps formal qualification activation runtime repository production and external authority blocked",
      () => {
        const boundary =
          ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE
            .authorityBoundary;

        expect(
          boundary,
        ).toMatchObject({
          qualificationTestingExecuted:
            true,
          qualificationEvidenceCollected:
            true,
          assertionDerivedEvidenceRequired:
            true,
          hardCodedPassingEvidenceAccepted:
            false,
          syntheticFixturePayloadExecutedAgainstProduction:
            false,
          realCustomerDataUsed:
            false,
          repositoryContentUsed:
            false,
          externalEffectPerformed:
            false,
          qualificationEngineInvoked:
            false,
          qualificationReportCreated:
            false,
          formalQualificationIssued:
            false,
          qualifiedManifestCreated:
            false,
          activationCandidateCreated:
            false,
          runtimeActivated:
            false,
          ownerCertificationRequired:
            true,
          productionReady:
            false,
          repositoryReadAuthorized:
            false,
          repositoryWriteAuthorized:
            false,
          realCustomerContactAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          productionDatabaseAuthorized:
            false,
          productionMutationAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          autonomousDecisionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "requires canonical sources the verified owner tenant and independent evaluator",
      () => {
        expect(
          () =>
            executeEngineeringAIWorkforceFormalQualificationEvidence({
              ...input(),
              evaluatorId:
                ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "independent",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceFormalQualificationEvidence({
              ...input(),
              ownerId:
                "owner-other-001" as typeof ENGINEERING_AI_WORKFORCE_OWNER_ID,
            }),
        ).toThrow(
          "plan-bound verified NEXUS owner",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceFormalQualificationEvidence({
              ...input(),
              tenantId:
                "tenant-other-001" as typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
            }),
        ).toThrow(
          "Cross-tenant",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceFormalQualificationEvidence({
              ...input(),
              plan: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
              },
            }),
        ).toThrow(
          "canonical Engineering formal qualification plan",
        );

        expect(
          () =>
            executeEngineeringAIWorkforceFormalQualificationEvidence({
              ...input(),
              fixturePack: {
                ...ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
              },
            }),
        ).toThrow(
          "canonical Engineering formal fixture pack",
        );
      },
    );

    it(
      "blocks evidence execution before fixture preparation",
      () => {
        const earlyTime =
          new Date(
            Date.parse(
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK
                .preparedAt,
            ) - 1,
          ).toISOString();

        expect(
          () =>
            executeEngineeringAIWorkforceFormalQualificationEvidence({
              ...input(),
              executedAt:
                earlyTime,
            }),
        ).toThrow(
          "cannot precede",
        );
      },
    );

    it(
      "creates deterministic immutable digest-verified evidence awaiting owner review",
      () => {
        const first =
          executeEngineeringAIWorkforceFormalQualificationEvidence(
            input(),
          );

        const second =
          executeEngineeringAIWorkforceFormalQualificationEvidence(
            input(),
          );

        expect(second).toEqual(first);

        expect(
          first.nextStep,
        ).toBe(
          "OWNER_REVIEW_AND_ENGINEERING_FORMAL_QUALIFICATION_DECISION",
        );

        expect(
          first.ledgerDigest,
        ).toMatch(
          /^[0-9a-f]{64}$/,
        );

        expect(
          new Set(
            first.evidenceBindings.map(
              (binding) =>
                binding.evidenceDigest,
            ),
          ).size,
        ).toBe(800);

        expect(
          new Set(
            first.evidenceBindings.map(
              (binding) =>
                binding.bindingDigest,
            ),
          ).size,
        ).toBe(800);

        expect(
          Object.isFrozen(first),
        ).toBe(true);

        expect(
          Object.isFrozen(
            first.candidateEvidenceLedgers,
          ),
        ).toBe(true);

        expect(
          first.candidateEvidenceLedgers.every(
            (candidateLedger) =>
              Object.isFrozen(
                candidateLedger,
              ) &&
              Object.isFrozen(
                candidateLedger.evidenceBindings,
              ) &&
              Object.isFrozen(
                candidateLedger.qualificationCases,
              ) &&
              candidateLedger.evidenceBindings.every(
                (binding) =>
                  Object.isFrozen(
                    binding,
                  ) &&
                  Object.isFrozen(
                    binding.assertions,
                  ),
              ),
          ),
        ).toBe(true);

        expect(
          () =>
            validateEngineeringAIWorkforceFormalQualificationExecutionEvidence(
              first,
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
              ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK,
            ),
        ).not.toThrow();
      },
    );
  },
);
