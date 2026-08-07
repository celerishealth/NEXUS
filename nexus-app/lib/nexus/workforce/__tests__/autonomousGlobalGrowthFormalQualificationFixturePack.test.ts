import { describe, expect, it } from "vitest";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
  validateAutonomousGlobalGrowthFormalQualificationFixturePack,
} from "../autonomousGlobalGrowthFormalQualificationFixturePack";

import { AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN } from "../autonomousGlobalGrowthFormalQualificationTestPlan";

describe("Autonomous Global Growth formal qualification fixture pack", () => {
  const pack =
    AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK;

  it("prepares exactly nine candidate packs and nine hundred sanitized synthetic fixtures", () => {
    expect(pack.candidateFixturePackCount).toBe(9);
    expect(pack.candidateFixturePacks).toHaveLength(9);
    expect(pack.requiredFixtureCountPerCandidate).toBe(100);
    expect(pack.totalFixtureCount).toBe(900);

    expect(
      pack.candidateFixturePacks.every(
        (candidatePack) =>
          candidatePack.requiredFixtureCount === 100 &&
          candidatePack.fixtures.length === 100,
      ),
    ).toBe(true);

    expect(
      pack.candidateFixturePacks.flatMap(
        (candidatePack) => candidatePack.fixtures,
      ),
    ).toHaveLength(900);
  });

  it("keeps every fixture sanitized synthetic unexecuted and without evidence", () => {
    const fixtures =
      pack.candidateFixturePacks.flatMap(
        (candidatePack) => candidatePack.fixtures,
      );

    expect(
      fixtures.every(
        (fixture) =>
          fixture.fixtureMode === "SANITIZED_SYNTHETIC_ONLY" &&
          fixture.syntheticInput.customerDataIncluded === false &&
          fixture.syntheticInput.secretsIncluded === false &&
          fixture.syntheticInput.productionIdentifiersIncluded === false &&
          fixture.syntheticInput.repositoryContentIncluded === false &&
          fixture.syntheticInput.externalDeliveryRequested === false &&
          fixture.syntheticInput.liveProviderExecutionRequested === false &&
          fixture.syntheticInput.paymentExecutionRequested === false &&
          fixture.syntheticInput.productionMutationRequested === false &&
          fixture.syntheticInput.autonomousExecutionRequested === false &&
          fixture.executionState === "NOT_EXECUTED" &&
          fixture.evidenceState === "NOT_COLLECTED" &&
          fixture.passed === null &&
          fixture.evidenceDigest === null &&
          fixture.executedAt === null,
      ),
    ).toBe(true);
  });

  it("preserves owner control and blocks qualification acceptance activation runtime and external authority", () => {
    expect(pack.preparationEvidence.exactNineCandidateFixturePacksPrepared).toBe(true);
    expect(pack.preparationEvidence.exactlyNineHundredFixturesPrepared).toBe(true);
    expect(pack.preparationEvidence.qualificationCasesExecuted).toBe(0);
    expect(pack.preparationEvidence.qualificationEvidenceRecordsCollected).toBe(0);
    expect(pack.preparationEvidence.qualifiedCandidateCount).toBe(0);
    expect(pack.preparationEvidence.activationEligibleCandidateCount).toBe(0);
    expect(pack.preparationEvidence.founderLiberationAchieved).toBe(false);

    expect(pack.authorityBoundary.formalQualificationFixturesCreated).toBe(true);
    expect(pack.authorityBoundary.qualificationTestingExecuted).toBe(false);
    expect(pack.authorityBoundary.qualificationEvidenceCollected).toBe(false);
    expect(pack.authorityBoundary.hardCodedPassingEvidenceAccepted).toBe(false);
    expect(pack.authorityBoundary.ownerQualificationApproved).toBe(false);
    expect(pack.authorityBoundary.activationCandidateCreated).toBe(false);
    expect(pack.authorityBoundary.runtimeActivated).toBe(false);
    expect(pack.authorityBoundary.repositoryReadAuthorized).toBe(false);
    expect(pack.authorityBoundary.repositoryWriteAuthorized).toBe(false);
    expect(pack.authorityBoundary.productionDeploymentAuthorized).toBe(false);
    expect(pack.authorityBoundary.realCustomerDataAccessAuthorized).toBe(false);
    expect(pack.authorityBoundary.realCustomerContactAuthorized).toBe(false);
    expect(pack.authorityBoundary.externalDeliveryAuthorized).toBe(false);
    expect(pack.authorityBoundary.paymentExecutionAuthorized).toBe(false);
    expect(pack.authorityBoundary.autonomousExecutionAuthorized).toBe(false);
    expect(pack.authorityBoundary.publicLaunchAuthorized).toBe(false);

    expect(pack.nextStep).toBe(
      "EXECUTE_CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE_V1",
    );
  });

  it("validates immutable canonical fixture preparation evidence", () => {
    expect(() =>
      validateAutonomousGlobalGrowthFormalQualificationFixturePack(pack, AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN),
    ).not.toThrow();

    expect(Object.isFrozen(pack)).toBe(true);
    expect(Object.isFrozen(pack.candidateFixturePacks)).toBe(true);
    expect(Object.isFrozen(pack.authorityBoundary)).toBe(true);

    const firstCandidate = pack.candidateFixturePacks[0];
    const firstFixture = firstCandidate?.fixtures[0];

    expect(Object.isFrozen(firstCandidate)).toBe(true);
    expect(Object.isFrozen(firstCandidate?.fixtures)).toBe(true);
    expect(Object.isFrozen(firstFixture)).toBe(true);
  });
});