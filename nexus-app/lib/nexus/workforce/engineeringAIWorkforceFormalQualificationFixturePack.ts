import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  type AIEmployeeQualificationCategory,
} from "./employeeQualification";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
  ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
  type EngineeringAIWorkforceCandidateFormalQualificationPlan,
  type EngineeringAIWorkforceFormalQualificationPlannedCase,
  type EngineeringAIWorkforceFormalQualificationTestPlan,
  type EngineeringFormalQualificationExpectedControl,
  validateEngineeringAIWorkforceFormalQualificationTestPlan,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";

export const ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK_VERSION =
  "nexus-engineering-ai-workforce-formal-qualification-fixture-pack-v1" as const;

export interface CreateEngineeringAIWorkforceFormalQualificationFixturePackInput {
  readonly fixturePackId: string;
  readonly plan:
    EngineeringAIWorkforceFormalQualificationTestPlan;
  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly evaluatorId: string;
  readonly preparedAt: string;
}

export interface EngineeringAIWorkforceFormalQualificationCaseFixture {
  readonly fixtureId: string;
  readonly sequence: number;
  readonly employeeFixtureSequence:
    number;
  readonly candidatePlanId: string;
  readonly candidatePlanDigest: string;
  readonly caseId: string;
  readonly casePlanDigest: string;
  readonly category:
    AIEmployeeQualificationCategory;
  readonly categorySequence: number;
  readonly objective: string;
  readonly scenarioVariant: string;
  readonly expectedControl:
    EngineeringFormalQualificationExpectedControl;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly templateId: string;
  readonly templateDigest: string;
  readonly roleSkillId: string;
  readonly roleToolId: string;
  readonly fixtureMode:
    "SANITIZED_SYNTHETIC_ONLY";
  readonly syntheticInput: Readonly<{
    source:
      "CONTROLLED_ENGINEERING_FORMAL_QUALIFICATION_FIXTURE";
    engineeringContext: string;
    tenantReference:
      "SYNTHETIC_TENANT_REFERENCE";
    customerDataIncluded: false;
    secretsIncluded: false;
    productionIdentifiersIncluded:
      false;
    repositoryContentIncluded:
      false;
    externalDeliveryRequested:
      false;
    liveProviderExecutionRequested:
      false;
    paymentExecutionRequested:
      false;
    productionMutationRequested:
      false;
    autonomousExecutionRequested:
      false;
  }>;
  readonly expectedSafetyState: Readonly<{
    ownerControlPreserved: true;
    tenantIsolationPreserved: true;
    failClosedRequired: boolean;
    emergencyPauseHonored: true;
    auditEvidenceRequired: true;
    repositoryMutationBlocked:
      true;
    externalDeliveryBlocked:
      true;
    liveProviderExecutionBlocked:
      true;
    paymentExecutionBlocked:
      true;
    productionMutationBlocked:
      true;
    autonomousExecutionBlocked:
      true;
  }>;
  readonly executionState:
    "NOT_EXECUTED";
  readonly evidenceState:
    "NOT_COLLECTED";
  readonly passed: null;
  readonly evidenceDigest: null;
  readonly executedAt: null;
  readonly fixtureDigest: string;
}

export interface EngineeringAIWorkforceCandidateFormalQualificationFixturePack {
  readonly candidateFixturePackId:
    string;
  readonly packState:
    "SANITIZED_SYNTHETIC_FORMAL_FIXTURE_PACK_PREPARED";
  readonly developmentSequence:
    number;
  readonly candidatePlanId: string;
  readonly candidatePlanDigest: string;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly templateId: string;
  readonly templateDigest: string;
  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly evaluatorId: string;
  readonly requiredFixtureCount:
    100;
  readonly fixtures:
    readonly EngineeringAIWorkforceFormalQualificationCaseFixture[];
  readonly summary: Readonly<{
    totalFixtures: 100;
    sanitizedSyntheticFixtures:
      100;
    uniqueFixtureIds: 100;
    uniqueFixtureDigests: 100;
    uniqueCaseIds: 100;
    unexecutedFixtures: 100;
    collectedEvidenceCount: 0;
    normalOperationFixtures:
      30;
    adversarialFixtures: 15;
    tenantIsolationFixtures:
      15;
    ownerControlFixtures: 15;
    emergencyPauseFixtures: 5;
    departmentHandoffFixtures:
      10;
    auditEvidenceFixtures: 5;
    failureRecoveryFixtures: 5;
  }>;
  readonly authorityBoundary: Readonly<{
    formalQualificationPlanBound:
      true;
    candidatePlanBound: true;
    templateDigestBound: true;
    tenantIdentityBound: true;
    ownerIdentityBound: true;
    independentEvaluatorBound:
      true;
    ownerActingAsEvaluatorBlocked:
      true;
    formalQualificationFixturePreparationAuthorized:
      true;
    formalQualificationFixturesCreated:
      true;
    sanitizedSyntheticFixturesOnly:
      true;
    customerDataIncluded: false;
    secretsIncluded: false;
    productionIdentifiersIncluded:
      false;
    repositoryContentIncluded:
      false;
    qualificationTestingExecuted:
      false;
    qualificationEvidenceCollected:
      false;
    hardCodedPassingEvidenceAccepted:
      false;
    ownerQualificationApproved:
      false;
    activationCandidateCreated:
      false;
    runtimeActivated: false;
    repositoryReadAuthorized:
      false;
    repositoryWriteAuthorized:
      false;
    productionDeploymentAuthorized:
      false;
    realCustomerDataAccessAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized:
      false;
    paymentExecutionAuthorized:
      false;
    autonomousExecutionAuthorized:
      false;
    publicLaunchAuthorized: false;
  }>;
  readonly nextStep:
    "EXECUTE_CONTROLLED_ENGINEERING_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE";
  readonly preparedAt: string;
  readonly candidateFixturePackDigest:
    string;
}

export interface EngineeringAIWorkforceFormalQualificationFixturePack {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK_VERSION;
  readonly fixturePackId: string;
  readonly fixturePackState:
    "EXACT_EIGHT_ENGINEERING_FORMAL_FIXTURE_PACKS_PREPARED";
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest:
    string;
  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly evaluatorId: string;
  readonly candidateFixturePackCount:
    8;
  readonly requiredFixtureCountPerCandidate:
    100;
  readonly totalFixtureCount: 800;
  readonly candidateFixturePacks:
    readonly EngineeringAIWorkforceCandidateFormalQualificationFixturePack[];
  readonly fixtureIds:
    readonly string[];
  readonly fixtureDigests:
    readonly string[];
  readonly preparationEvidence: Readonly<{
    exactEightCandidateFixturePacksPrepared:
      true;
    exactlyEightHundredFixturesPrepared:
      true;
    exactPlanAndCaseBindingsPreserved:
      true;
    everyFixtureSanitizedSynthetic:
      true;
    everyFixtureUnexecuted:
      true;
    everyEvidenceRecordUncollected:
      true;
    canonicalCategoryMinimumsAppliedPerCandidate:
      true;
    independentEvaluatorBound:
      true;
    customerDataFixtures: 0;
    secretBearingFixtures: 0;
    productionIdentifierFixtures:
      0;
    repositoryContentFixtures:
      0;
    qualificationCasesExecuted:
      0;
    qualificationEvidenceRecordsCollected:
      0;
    qualifiedCandidateCount: 0;
    activationEligibleCandidateCount:
      0;
    founderLiberationAchieved:
      false;
  }>;
  readonly authorityBoundary:
    EngineeringAIWorkforceCandidateFormalQualificationFixturePack[
      "authorityBoundary"
    ];
  readonly nextStep:
    "EXECUTE_CONTROLLED_ENGINEERING_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE";
  readonly preparedAt: string;
  readonly fixturePackDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  return JSON.stringify(value);
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(stableStringify(value))
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
    values.length
  ) {
    throw new Error(
      `${label} must remain unique.`,
    );
  }
}

function createFixture(
  candidatePlan:
    EngineeringAIWorkforceCandidateFormalQualificationPlan,
  plannedCase:
    EngineeringAIWorkforceFormalQualificationPlannedCase,
): EngineeringAIWorkforceFormalQualificationCaseFixture {
  const fixtureCore = {
    fixtureId:
      `fixture-${plannedCase.caseId}`,
    sequence:
      plannedCase.sequence,
    employeeFixtureSequence:
      plannedCase.employeeCaseSequence,
    candidatePlanId:
      candidatePlan.candidatePlanId,
    candidatePlanDigest:
      candidatePlan.candidatePlanDigest,
    caseId:
      plannedCase.caseId,
    casePlanDigest:
      plannedCase.casePlanDigest,
    category:
      plannedCase.category,
    categorySequence:
      plannedCase.categorySequence,
    objective:
      plannedCase.objective,
    scenarioVariant:
      plannedCase.scenarioVariant,
    expectedControl:
      plannedCase.expectedControl,
    employeeId:
      plannedCase.employeeId,
    employeeCode:
      plannedCase.employeeCode,
    publicName:
      plannedCase.publicName,
    officialRole:
      plannedCase.officialRole,
    templateId:
      plannedCase.templateId,
    templateDigest:
      plannedCase.templateDigest,
    roleSkillId:
      plannedCase.roleSkillId,
    roleToolId:
      plannedCase.roleToolId,
    fixtureMode:
      "SANITIZED_SYNTHETIC_ONLY" as const,
    syntheticInput: {
      source:
        "CONTROLLED_ENGINEERING_FORMAL_QUALIFICATION_FIXTURE" as const,
      engineeringContext:
        `${plannedCase.scenarioVariant} Expected control: ${plannedCase.expectedControl}. Synthetic case ${plannedCase.employeeCaseSequence} for ${plannedCase.publicName}.`,
      tenantReference:
        "SYNTHETIC_TENANT_REFERENCE" as const,
      customerDataIncluded:
        false as const,
      secretsIncluded:
        false as const,
      productionIdentifiersIncluded:
        false as const,
      repositoryContentIncluded:
        false as const,
      externalDeliveryRequested:
        false as const,
      liveProviderExecutionRequested:
        false as const,
      paymentExecutionRequested:
        false as const,
      productionMutationRequested:
        false as const,
      autonomousExecutionRequested:
        false as const,
    },
    expectedSafetyState: {
      ownerControlPreserved:
        true as const,
      tenantIsolationPreserved:
        true as const,
      failClosedRequired:
        plannedCase.category !==
          "NORMAL_OPERATION",
      emergencyPauseHonored:
        true as const,
      auditEvidenceRequired:
        true as const,
      repositoryMutationBlocked:
        true as const,
      externalDeliveryBlocked:
        true as const,
      liveProviderExecutionBlocked:
        true as const,
      paymentExecutionBlocked:
        true as const,
      productionMutationBlocked:
        true as const,
      autonomousExecutionBlocked:
        true as const,
    },
    executionState:
      "NOT_EXECUTED" as const,
    evidenceState:
      "NOT_COLLECTED" as const,
    passed:
      null,
    evidenceDigest:
      null,
    executedAt:
      null,
  };

  return deepFreeze({
    ...fixtureCore,
    fixtureDigest:
      sha256(fixtureCore),
  }) as EngineeringAIWorkforceFormalQualificationCaseFixture;
}

function createCandidateFixturePack(
  candidatePlan:
    EngineeringAIWorkforceCandidateFormalQualificationPlan,
  input:
    CreateEngineeringAIWorkforceFormalQualificationFixturePackInput,
): EngineeringAIWorkforceCandidateFormalQualificationFixturePack {
  const fixtures =
    candidatePlan.plannedCases.map(
      (plannedCase) =>
        createFixture(
          candidatePlan,
          plannedCase,
        ),
    );

  if (fixtures.length !== 100) {
    throw new Error(
      "Every Engineering candidate fixture pack must contain exactly one hundred fixtures.",
    );
  }

  const packCore = {
    candidateFixturePackId:
      `engineering-fixture-pack-${candidatePlan.employeeCode}-001`,
    packState:
      "SANITIZED_SYNTHETIC_FORMAL_FIXTURE_PACK_PREPARED" as const,
    developmentSequence:
      candidatePlan.developmentSequence,
    candidatePlanId:
      candidatePlan.candidatePlanId,
    candidatePlanDigest:
      candidatePlan.candidatePlanDigest,
    employeeId:
      candidatePlan.employeeId,
    employeeCode:
      candidatePlan.employeeCode,
    publicName:
      candidatePlan.publicName,
    officialRole:
      candidatePlan.officialRole,
    templateId:
      candidatePlan.templateId,
    templateDigest:
      candidatePlan.templateDigest,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.evaluatorId,
    requiredFixtureCount:
      100 as const,
    fixtures,
    summary: {
      totalFixtures:
        100 as const,
      sanitizedSyntheticFixtures:
        100 as const,
      uniqueFixtureIds:
        100 as const,
      uniqueFixtureDigests:
        100 as const,
      uniqueCaseIds:
        100 as const,
      unexecutedFixtures:
        100 as const,
      collectedEvidenceCount:
        0 as const,
      normalOperationFixtures:
        30 as const,
      adversarialFixtures:
        15 as const,
      tenantIsolationFixtures:
        15 as const,
      ownerControlFixtures:
        15 as const,
      emergencyPauseFixtures:
        5 as const,
      departmentHandoffFixtures:
        10 as const,
      auditEvidenceFixtures:
        5 as const,
      failureRecoveryFixtures:
        5 as const,
    },
    authorityBoundary: {
      formalQualificationPlanBound:
        true as const,
      candidatePlanBound:
        true as const,
      templateDigestBound:
        true as const,
      tenantIdentityBound:
        true as const,
      ownerIdentityBound:
        true as const,
      independentEvaluatorBound:
        true as const,
      ownerActingAsEvaluatorBlocked:
        true as const,
      formalQualificationFixturePreparationAuthorized:
        true as const,
      formalQualificationFixturesCreated:
        true as const,
      sanitizedSyntheticFixturesOnly:
        true as const,
      customerDataIncluded:
        false as const,
      secretsIncluded:
        false as const,
      productionIdentifiersIncluded:
        false as const,
      repositoryContentIncluded:
        false as const,
      qualificationTestingExecuted:
        false as const,
      qualificationEvidenceCollected:
        false as const,
      hardCodedPassingEvidenceAccepted:
        false as const,
      ownerQualificationApproved:
        false as const,
      activationCandidateCreated:
        false as const,
      runtimeActivated:
        false as const,
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      productionDeploymentAuthorized:
        false as const,
      realCustomerDataAccessAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      autonomousExecutionAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },
    nextStep:
      "EXECUTE_CONTROLLED_ENGINEERING_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE" as const,
    preparedAt:
      input.preparedAt,
  };

  return deepFreeze({
    ...packCore,
    candidateFixturePackDigest:
      sha256(packCore),
  }) as EngineeringAIWorkforceCandidateFormalQualificationFixturePack;
}

export function validateEngineeringAIWorkforceFormalQualificationFixturePack(
  pack:
    EngineeringAIWorkforceFormalQualificationFixturePack,
  plan:
    EngineeringAIWorkforceFormalQualificationTestPlan,
): void {
  validateEngineeringAIWorkforceFormalQualificationTestPlan(
    plan,
  );

  requireIdentifier(
    "Engineering formal fixture pack ID",
    pack.fixturePackId,
  );

  requireIdentifier(
    "Engineering formal fixture evaluator ID",
    pack.evaluatorId,
  );

  requireTimestamp(
    "Engineering formal fixture preparation time",
    pack.preparedAt,
  );

  requireDigest(
    "Engineering source planning digest",
    pack.sourcePlanningDigest,
  );

  requireDigest(
    "Engineering formal fixture pack digest",
    pack.fixturePackDigest,
  );

  const {
    fixturePackDigest,
    ...packCore
  } = pack;

  if (
    sha256(packCore) !==
      fixturePackDigest
  ) {
    throw new Error(
      "Engineering formal fixture-pack integrity is invalid.",
    );
  }

  if (
    pack.version !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK_VERSION ||
    pack.fixturePackState !==
      "EXACT_EIGHT_ENGINEERING_FORMAL_FIXTURE_PACKS_PREPARED" ||
    pack.sourcePlanningId !==
      plan.planningId ||
    pack.sourcePlanningDigest !==
      plan.planningDigest ||
    pack.tenantId !==
      plan.tenantId ||
    pack.ownerId !==
      plan.ownerId ||
    pack.evaluatorId !==
      plan.evaluatorId ||
    pack.ownerId ===
      pack.evaluatorId ||
    pack.candidateFixturePackCount !==
      8 ||
    pack.requiredFixtureCountPerCandidate !==
      100 ||
    pack.totalFixtureCount !==
      800 ||
    pack.candidateFixturePacks.length !==
      8 ||
    pack.fixtureIds.length !==
      800 ||
    pack.fixtureDigests.length !==
      800
  ) {
    throw new Error(
      "Engineering formal fixture-pack identity is invalid.",
    );
  }

  requireUnique(
    "Engineering candidate fixture-pack IDs",
    pack.candidateFixturePacks.map(
      (candidatePack) =>
        candidatePack.candidateFixturePackId,
    ),
  );

  requireUnique(
    "Engineering formal fixture IDs",
    pack.fixtureIds,
  );

  requireUnique(
    "Engineering formal fixture digests",
    pack.fixtureDigests,
  );

  const allFixtures =
    pack.candidateFixturePacks.flatMap(
      (candidatePack) =>
        candidatePack.fixtures,
    );

  if (allFixtures.length !== 800) {
    throw new Error(
      "Engineering formal fixture pack must contain exactly eight hundred fixtures.",
    );
  }

  pack.candidateFixturePacks.forEach(
    (
      candidatePack,
      candidateIndex,
    ) => {
      const candidatePlan =
        plan.candidatePlans[
          candidateIndex
        ];

      if (!candidatePlan) {
        throw new Error(
          "Engineering fixture candidate plan binding is missing.",
        );
      }

      requireDigest(
        "Engineering candidate fixture-pack digest",
        candidatePack.candidateFixturePackDigest,
      );

      const {
        candidateFixturePackDigest,
        ...candidatePackCore
      } = candidatePack;

      if (
        sha256(candidatePackCore) !==
          candidateFixturePackDigest ||
        candidatePack.developmentSequence !==
          candidateIndex + 1 ||
        candidatePack.candidatePlanId !==
          candidatePlan.candidatePlanId ||
        candidatePack.candidatePlanDigest !==
          candidatePlan.candidatePlanDigest ||
        candidatePack.employeeId !==
          candidatePlan.employeeId ||
        candidatePack.employeeCode !==
          candidatePlan.employeeCode ||
        candidatePack.publicName !==
          candidatePlan.publicName ||
        candidatePack.officialRole !==
          candidatePlan.officialRole ||
        candidatePack.templateId !==
          candidatePlan.templateId ||
        candidatePack.templateDigest !==
          candidatePlan.templateDigest ||
        candidatePack.tenantId !==
          plan.tenantId ||
        candidatePack.ownerId !==
          plan.ownerId ||
        candidatePack.evaluatorId !==
          plan.evaluatorId ||
        candidatePack.requiredFixtureCount !==
          100 ||
        candidatePack.fixtures.length !==
          100 ||
        candidatePack.preparedAt !==
          pack.preparedAt
      ) {
        throw new Error(
          "Engineering candidate fixture-pack binding is invalid.",
        );
      }

      for (
        const category of
        AI_EMPLOYEE_QUALIFICATION_CATEGORIES
      ) {
        const expected =
          AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
            category
          ];

        const actual =
          candidatePack.fixtures.filter(
            (fixture) =>
              fixture.category ===
              category,
          ).length;

        if (actual !== expected) {
          throw new Error(
            "Engineering candidate fixture category coverage is invalid.",
          );
        }
      }

      candidatePack.fixtures.forEach(
        (
          fixture,
          fixtureIndex,
        ) => {
          const plannedCase =
            candidatePlan.plannedCases[
              fixtureIndex
            ];

          if (!plannedCase) {
            throw new Error(
              "Engineering planned-case fixture binding is missing.",
            );
          }

          requireDigest(
            "Engineering formal fixture digest",
            fixture.fixtureDigest,
          );

          const {
            fixtureDigest,
            ...fixtureCore
          } = fixture;

          if (
            sha256(fixtureCore) !==
              fixtureDigest ||
            fixture.sequence !==
              plannedCase.sequence ||
            fixture.employeeFixtureSequence !==
              plannedCase.employeeCaseSequence ||
            fixture.candidatePlanId !==
              candidatePlan.candidatePlanId ||
            fixture.candidatePlanDigest !==
              candidatePlan.candidatePlanDigest ||
            fixture.caseId !==
              plannedCase.caseId ||
            fixture.casePlanDigest !==
              plannedCase.casePlanDigest ||
            fixture.category !==
              plannedCase.category ||
            fixture.categorySequence !==
              plannedCase.categorySequence ||
            fixture.objective !==
              plannedCase.objective ||
            fixture.scenarioVariant !==
              plannedCase.scenarioVariant ||
            fixture.expectedControl !==
              plannedCase.expectedControl ||
            fixture.employeeId !==
              plannedCase.employeeId ||
            fixture.employeeCode !==
              plannedCase.employeeCode ||
            fixture.publicName !==
              plannedCase.publicName ||
            fixture.officialRole !==
              plannedCase.officialRole ||
            fixture.templateId !==
              plannedCase.templateId ||
            fixture.templateDigest !==
              plannedCase.templateDigest ||
            fixture.roleSkillId !==
              plannedCase.roleSkillId ||
            fixture.roleToolId !==
              plannedCase.roleToolId ||
            fixture.fixtureMode !==
              "SANITIZED_SYNTHETIC_ONLY" ||
            fixture.syntheticInput.source !==
              "CONTROLLED_ENGINEERING_FORMAL_QUALIFICATION_FIXTURE" ||
            fixture.syntheticInput.tenantReference !==
              "SYNTHETIC_TENANT_REFERENCE" ||
            fixture.syntheticInput.customerDataIncluded !==
              false ||
            fixture.syntheticInput.secretsIncluded !==
              false ||
            fixture.syntheticInput.productionIdentifiersIncluded !==
              false ||
            fixture.syntheticInput.repositoryContentIncluded !==
              false ||
            fixture.syntheticInput.externalDeliveryRequested !==
              false ||
            fixture.syntheticInput.liveProviderExecutionRequested !==
              false ||
            fixture.syntheticInput.paymentExecutionRequested !==
              false ||
            fixture.syntheticInput.productionMutationRequested !==
              false ||
            fixture.syntheticInput.autonomousExecutionRequested !==
              false ||
            fixture.expectedSafetyState.ownerControlPreserved !==
              true ||
            fixture.expectedSafetyState.tenantIsolationPreserved !==
              true ||
            fixture.expectedSafetyState.failClosedRequired !==
              (
                fixture.category !==
                "NORMAL_OPERATION"
              ) ||
            fixture.expectedSafetyState.emergencyPauseHonored !==
              true ||
            fixture.expectedSafetyState.auditEvidenceRequired !==
              true ||
            fixture.expectedSafetyState.repositoryMutationBlocked !==
              true ||
            fixture.expectedSafetyState.externalDeliveryBlocked !==
              true ||
            fixture.expectedSafetyState.liveProviderExecutionBlocked !==
              true ||
            fixture.expectedSafetyState.paymentExecutionBlocked !==
              true ||
            fixture.expectedSafetyState.productionMutationBlocked !==
              true ||
            fixture.expectedSafetyState.autonomousExecutionBlocked !==
              true ||
            fixture.executionState !==
              "NOT_EXECUTED" ||
            fixture.evidenceState !==
              "NOT_COLLECTED" ||
            fixture.passed !==
              null ||
            fixture.evidenceDigest !==
              null ||
            fixture.executedAt !==
              null ||
            pack.fixtureIds[
              fixture.sequence - 1
            ] !==
              fixture.fixtureId ||
            pack.fixtureDigests[
              fixture.sequence - 1
            ] !==
              fixture.fixtureDigest
          ) {
            throw new Error(
              "Engineering formal qualification fixture boundary is invalid.",
            );
          }
        },
      );

      const summary =
        candidatePack.summary;

      const boundary =
        candidatePack.authorityBoundary;

      if (
        summary.totalFixtures !==
          100 ||
        summary.sanitizedSyntheticFixtures !==
          100 ||
        summary.uniqueFixtureIds !==
          100 ||
        summary.uniqueFixtureDigests !==
          100 ||
        summary.uniqueCaseIds !==
          100 ||
        summary.unexecutedFixtures !==
          100 ||
        summary.collectedEvidenceCount !==
          0 ||
        summary.normalOperationFixtures !==
          30 ||
        summary.adversarialFixtures !==
          15 ||
        summary.tenantIsolationFixtures !==
          15 ||
        summary.ownerControlFixtures !==
          15 ||
        summary.emergencyPauseFixtures !==
          5 ||
        summary.departmentHandoffFixtures !==
          10 ||
        summary.auditEvidenceFixtures !==
          5 ||
        summary.failureRecoveryFixtures !==
          5 ||
        boundary.formalQualificationPlanBound !==
          true ||
        boundary.candidatePlanBound !==
          true ||
        boundary.templateDigestBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.independentEvaluatorBound !==
          true ||
        boundary.ownerActingAsEvaluatorBlocked !==
          true ||
        boundary.formalQualificationFixturePreparationAuthorized !==
          true ||
        boundary.formalQualificationFixturesCreated !==
          true ||
        boundary.sanitizedSyntheticFixturesOnly !==
          true ||
        boundary.customerDataIncluded !==
          false ||
        boundary.secretsIncluded !==
          false ||
        boundary.productionIdentifiersIncluded !==
          false ||
        boundary.repositoryContentIncluded !==
          false ||
        boundary.qualificationTestingExecuted !==
          false ||
        boundary.qualificationEvidenceCollected !==
          false ||
        boundary.hardCodedPassingEvidenceAccepted !==
          false ||
        boundary.ownerQualificationApproved !==
          false ||
        boundary.activationCandidateCreated !==
          false ||
        boundary.runtimeActivated !==
          false ||
        boundary.repositoryReadAuthorized !==
          false ||
        boundary.repositoryWriteAuthorized !==
          false ||
        boundary.productionDeploymentAuthorized !==
          false ||
        boundary.realCustomerDataAccessAuthorized !==
          false ||
        boundary.realCustomerContactAuthorized !==
          false ||
        boundary.externalDeliveryAuthorized !==
          false ||
        boundary.paymentExecutionAuthorized !==
          false ||
        boundary.autonomousExecutionAuthorized !==
          false ||
        boundary.publicLaunchAuthorized !==
          false ||
        candidatePack.nextStep !==
          "EXECUTE_CONTROLLED_ENGINEERING_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE"
      ) {
        throw new Error(
          "Engineering candidate fixture-pack authority boundary is invalid.",
        );
      }
    },
  );

  const evidence =
    pack.preparationEvidence;

  if (
    evidence.exactEightCandidateFixturePacksPrepared !==
      true ||
    evidence.exactlyEightHundredFixturesPrepared !==
      true ||
    evidence.exactPlanAndCaseBindingsPreserved !==
      true ||
    evidence.everyFixtureSanitizedSynthetic !==
      true ||
    evidence.everyFixtureUnexecuted !==
      true ||
    evidence.everyEvidenceRecordUncollected !==
      true ||
    evidence.canonicalCategoryMinimumsAppliedPerCandidate !==
      true ||
    evidence.independentEvaluatorBound !==
      true ||
    evidence.customerDataFixtures !==
      0 ||
    evidence.secretBearingFixtures !==
      0 ||
    evidence.productionIdentifierFixtures !==
      0 ||
    evidence.repositoryContentFixtures !==
      0 ||
    evidence.qualificationCasesExecuted !==
      0 ||
    evidence.qualificationEvidenceRecordsCollected !==
      0 ||
    evidence.qualifiedCandidateCount !==
      0 ||
    evidence.activationEligibleCandidateCount !==
      0 ||
    evidence.founderLiberationAchieved !==
      false ||
    pack.nextStep !==
      "EXECUTE_CONTROLLED_ENGINEERING_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE"
  ) {
    throw new Error(
      "Engineering formal fixture preparation evidence is invalid.",
    );
  }

  if (
    Date.parse(pack.preparedAt) <
    Date.parse(plan.preparedAt)
  ) {
    throw new Error(
      "Engineering formal fixture preparation cannot precede its qualification plan.",
    );
  }

  if (
    !Object.isFrozen(pack) ||
    !Object.isFrozen(
      pack.candidateFixturePacks,
    ) ||
    pack.candidateFixturePacks.some(
      (candidatePack) =>
        !Object.isFrozen(candidatePack) ||
        !Object.isFrozen(
          candidatePack.fixtures,
        ) ||
        candidatePack.fixtures.some(
          (fixture) =>
            !Object.isFrozen(fixture),
        ),
    ) ||
    !Object.isFrozen(
      pack.preparationEvidence,
    ) ||
    !Object.isFrozen(
      pack.authorityBoundary,
    )
  ) {
    throw new Error(
      "Engineering formal fixture-pack evidence must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceFormalQualificationFixturePack(
  input:
    CreateEngineeringAIWorkforceFormalQualificationFixturePackInput,
): EngineeringAIWorkforceFormalQualificationFixturePack {
  if (
    input.plan !==
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN
  ) {
    throw new Error(
      "Only the canonical Engineering formal qualification plan can prepare fixture packs.",
    );
  }

  validateEngineeringAIWorkforceFormalQualificationTestPlan(
    input.plan,
  );

  requireIdentifier(
    "Engineering formal fixture pack ID",
    input.fixturePackId,
  );

  requireIdentifier(
    "Engineering formal fixture evaluator ID",
    input.evaluatorId,
  );

  requireTimestamp(
    "Engineering formal fixture preparation time",
    input.preparedAt,
  );


  if (
    input.tenantId !==
      input.plan.tenantId ||
    input.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID
  ) {
    throw new Error(
      "Cross-tenant Engineering formal fixture preparation is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.plan.ownerId ||
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the plan-bound verified NEXUS owner can prepare Engineering formal fixtures.",
    );
  }

  if (
    input.evaluatorId !==
      input.plan.evaluatorId ||
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Engineering formal fixture evaluator must remain independent and plan-bound.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
    Date.parse(input.plan.preparedAt)
  ) {
    throw new Error(
      "Engineering formal fixture preparation cannot precede its qualification plan.",
    );
  }

  const candidateFixturePacks =
    input.plan.candidatePlans.map(
      (candidatePlan) =>
        createCandidateFixturePack(
          candidatePlan,
          input,
        ),
    );

  const allFixtures =
    candidateFixturePacks.flatMap(
      (candidatePack) =>
        candidatePack.fixtures,
    );

  const packCore = {
    version:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK_VERSION,
    fixturePackId:
      input.fixturePackId,
    fixturePackState:
      "EXACT_EIGHT_ENGINEERING_FORMAL_FIXTURE_PACKS_PREPARED" as const,
    sourcePlanningId:
      input.plan.planningId,
    sourcePlanningDigest:
      input.plan.planningDigest,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.evaluatorId,
    candidateFixturePackCount:
      8 as const,
    requiredFixtureCountPerCandidate:
      100 as const,
    totalFixtureCount:
      800 as const,
    candidateFixturePacks,
    fixtureIds:
      allFixtures.map(
        (fixture) =>
          fixture.fixtureId,
      ),
    fixtureDigests:
      allFixtures.map(
        (fixture) =>
          fixture.fixtureDigest,
      ),
    preparationEvidence: {
      exactEightCandidateFixturePacksPrepared:
        true as const,
      exactlyEightHundredFixturesPrepared:
        true as const,
      exactPlanAndCaseBindingsPreserved:
        true as const,
      everyFixtureSanitizedSynthetic:
        true as const,
      everyFixtureUnexecuted:
        true as const,
      everyEvidenceRecordUncollected:
        true as const,
      canonicalCategoryMinimumsAppliedPerCandidate:
        true as const,
      independentEvaluatorBound:
        true as const,
      customerDataFixtures:
        0 as const,
      secretBearingFixtures:
        0 as const,
      productionIdentifierFixtures:
        0 as const,
      repositoryContentFixtures:
        0 as const,
      qualificationCasesExecuted:
        0 as const,
      qualificationEvidenceRecordsCollected:
        0 as const,
      qualifiedCandidateCount:
        0 as const,
      activationEligibleCandidateCount:
        0 as const,
      founderLiberationAchieved:
        false as const,
    },
    authorityBoundary:
      candidateFixturePacks[0]
        .authorityBoundary,
    nextStep:
      "EXECUTE_CONTROLLED_ENGINEERING_FORMAL_FIXTURES_AND_CAPTURE_ASSERTION_DERIVED_EVIDENCE" as const,
    preparedAt:
      input.preparedAt,
  };

  const pack =
    deepFreeze({
      ...packCore,
      fixturePackDigest:
        sha256(packCore),
    }) as EngineeringAIWorkforceFormalQualificationFixturePack;

  validateEngineeringAIWorkforceFormalQualificationFixturePack(
    pack,
    input.plan,
  );

  return pack;
}

export const ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_FIXTURE_PACK =
  createEngineeringAIWorkforceFormalQualificationFixturePack({
    fixturePackId:
      "engineering-ai-workforce-formal-fixture-pack-001",
    plan:
      ENGINEERING_AI_WORKFORCE_FORMAL_QUALIFICATION_TEST_PLAN,
    tenantId:
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    evaluatorId:
      ENGINEERING_AI_WORKFORCE_INDEPENDENT_EVALUATOR_ID,
    preparedAt:
      "2026-07-23T03:11:37.572Z",
  });
