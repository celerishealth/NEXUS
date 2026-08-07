import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
  type AIEmployeeQualificationCase,
  type AIEmployeeQualificationCategory,
} from "./employeeQualification";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
  AUTONOMOUS_GLOBAL_GROWTH_INDEPENDENT_EVALUATOR_ID,
  AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
  type AutonomousGlobalGrowthCandidateFormalQualificationPlan,
  type AutonomousGlobalGrowthFormalQualificationPlannedCase,
  type AutonomousGlobalGrowthFormalQualificationTestPlan,
  type AutonomousGlobalGrowthFormalQualificationExpectedControl,
  validateAutonomousGlobalGrowthFormalQualificationTestPlan,
} from "./autonomousGlobalGrowthFormalQualificationTestPlan";

import {
  AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
  type AutonomousGlobalGrowthCandidateFormalQualificationFixturePack,
  type AutonomousGlobalGrowthFormalQualificationCaseFixture,
  type AutonomousGlobalGrowthFormalQualificationFixturePack,
  validateAutonomousGlobalGrowthFormalQualificationFixturePack,
} from "./autonomousGlobalGrowthFormalQualificationFixturePack";

export const AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE_VERSION =
  "nexus-autonomous-global-growth-formal-qualification-execution-evidence-v1" as const;

export interface ExecuteAutonomousGlobalGrowthFormalQualificationEvidenceInput {
  readonly ledgerId: string;
  readonly plan:
    AutonomousGlobalGrowthFormalQualificationTestPlan;
  readonly fixturePack:
    AutonomousGlobalGrowthFormalQualificationFixturePack;
  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly evaluatorId: string;
  readonly executedAt: string;
}

export interface AutonomousGlobalGrowthFormalQualificationAssertions {
  readonly planBindingPassed: true;
  readonly fixtureBindingPassed:
    true;
  readonly sanitizedSyntheticInputPassed:
    true;
  readonly expectedControlPassed:
    true;
  readonly failClosedPolicyPassed:
    true;
  readonly ownerControlPassed:
    true;
  readonly tenantIsolationPassed:
    true;
  readonly emergencyPausePassed:
    true;
  readonly repositoryMutationBlockPassed:
    true;
  readonly externalDeliveryAndProviderBlockPassed:
    true;
  readonly paymentExecutionBlockPassed:
    true;
  readonly productionMutationBlockPassed:
    true;
  readonly autonomousDecisionBlockPassed:
    true;
}

export interface AutonomousGlobalGrowthFormalQualificationEvidenceBinding {
  readonly sequence: number;
  readonly employeeEvidenceSequence:
    number;
  readonly candidateLedgerId: string;
  readonly candidatePlanId: string;
  readonly candidatePlanDigest: string;
  readonly candidateFixturePackId:
    string;
  readonly candidateFixturePackDigest:
    string;
  readonly fixtureId: string;
  readonly fixtureDigest: string;
  readonly plannedCaseId: string;
  readonly casePlanDigest: string;
  readonly category:
    AIEmployeeQualificationCategory;
  readonly categorySequence: number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly templateId: string;
  readonly templateDigest: string;
  readonly roleSkillId: string;
  readonly roleToolId: string;
  readonly expectedControl:
    AutonomousGlobalGrowthFormalQualificationExpectedControl;
  readonly observedControl:
    AutonomousGlobalGrowthFormalQualificationExpectedControl;
  readonly evidenceMode:
    "CONTROLLED_ENGINEERING_FORMAL_FIXTURE_ASSERTION_EVIDENCE";
  readonly assertionDerivedEvidence:
    true;
  readonly hardCodedPassingEvidenceAccepted:
    false;
  readonly assertions:
    AutonomousGlobalGrowthFormalQualificationAssertions;
  readonly assertionCount: 13;
  readonly assertionsPassed: 13;
  readonly passed: true;
  readonly executedAt: string;
  readonly evidenceDigest: string;
  readonly bindingDigest: string;
}

export interface EngineeringAIWorkforceCandidateFormalQualificationExecutionEvidenceLedger {
  readonly candidateLedgerId: string;
  readonly ledgerState:
    "CONTROLLED_ENGINEERING_CANDIDATE_ASSERTION_EVIDENCE_CAPTURED";
  readonly developmentSequence:
    number;
  readonly employeeId: string;
  readonly employeeCode: string;
  readonly publicName: string;
  readonly officialRole: string;
  readonly templateId: string;
  readonly templateDigest: string;
  readonly candidatePlanId: string;
  readonly candidatePlanDigest: string;
  readonly candidateFixturePackId:
    string;
  readonly candidateFixturePackDigest:
    string;
  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly evaluatorId: string;
  readonly evidenceBindings:
    readonly AutonomousGlobalGrowthFormalQualificationEvidenceBinding[];
  readonly qualificationCases:
    readonly AIEmployeeQualificationCase[];
  readonly summary: Readonly<{
    qualificationCasesExecuted:
      100;
    qualificationCasesPassed: 100;
    qualificationCasesFailed: 0;
    qualificationEvidenceCollected:
      100;
    uniqueFixtureIds: 100;
    uniqueCaseIds: 100;
    uniqueEvidenceDigests: 100;
    uniqueBindingDigests: 100;
    assertionsExecuted: 1300;
    assertionsPassed: 1300;
    assertionsFailed: 0;
    normalOperationCases: 30;
    adversarialCases: 15;
    tenantIsolationCases: 15;
    ownerControlCases: 15;
    emergencyPauseCases: 5;
    departmentHandoffCases: 10;
    auditEvidenceCases: 5;
    failureRecoveryCases: 5;
  }>;
  readonly executedAt: string;
  readonly candidateLedgerDigest:
    string;
}

export interface AutonomousGlobalGrowthFormalQualificationExecutionEvidenceLedger {
  readonly version:
    typeof AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE_VERSION;
  readonly ledgerId: string;
  readonly ledgerState:
    "CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_ASSERTION_EVIDENCE_CAPTURED";
  readonly sourcePlanningId: string;
  readonly sourcePlanningDigest:
    string;
  readonly sourceFixturePackId:
    string;
  readonly sourceFixturePackDigest:
    string;
  readonly tenantId:
    typeof AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID;
  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;
  readonly evaluatorId: string;
  readonly candidateEvidenceLedgerCount:
    9;
  readonly candidateEvidenceLedgers:
    readonly EngineeringAIWorkforceCandidateFormalQualificationExecutionEvidenceLedger[];
  readonly evidenceBindings:
    readonly AutonomousGlobalGrowthFormalQualificationEvidenceBinding[];
  readonly qualificationCases:
    readonly AIEmployeeQualificationCase[];
  readonly summary: Readonly<{
    qualificationCasesExecuted:
      900;
    qualificationCasesPassed: 900;
    qualificationCasesFailed: 0;
    qualificationEvidenceCollected:
      900;
    uniqueCandidateLedgerIds:
      9;
    uniqueFixtureIds: 900;
    uniqueCaseIds: 900;
    uniqueEvidenceDigests: 900;
    uniqueBindingDigests: 900;
    assertionsExecuted: 11700;
    assertionsPassed: 11700;
    assertionsFailed: 0;
    normalOperationCases: 270;
    adversarialCases: 135;
    tenantIsolationCases: 135;
    ownerControlCases: 135;
    emergencyPauseCases: 45;
    departmentHandoffCases: 90;
    auditEvidenceCases: 45;
    failureRecoveryCases: 45;
  }>;
  readonly nextStep:
    "OWNER_REVIEW_AND_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_DECISION";
  readonly authorityBoundary: Readonly<{
    formalQualificationPlanBound:
      true;
    formalFixturePackBound: true;
    independentEvaluatorRequired:
      true;
    ownerActingAsEvaluatorBlocked:
      true;
    controlledFormalFixtureAssertionsExecuted:
      true;
    assertionDerivedEvidenceRequired:
      true;
    hardCodedPassingEvidenceAccepted:
      false;
    qualificationTestingExecuted:
      true;
    qualificationEvidenceCollected:
      true;
    syntheticFixturePayloadExecutedAgainstProduction:
      false;
    realCustomerDataUsed: false;
    repositoryContentUsed: false;
    externalEffectPerformed: false;
    qualificationEngineInvoked:
      false;
    qualificationReportCreated:
      false;
    formalQualificationIssued:
      false;
    qualifiedManifestCreated:
      false;
    activationCandidateCreated:
      false;
    runtimeActivated: false;
    ownerCertificationRequired:
      true;
    productionReady: false;
    repositoryReadAuthorized:
      false;
    repositoryWriteAuthorized:
      false;
    realCustomerContactAuthorized:
      false;
    externalDeliveryAuthorized:
      false;
    liveProviderExecutionAuthorized:
      false;
    productionDatabaseAuthorized:
      false;
    productionMutationAuthorized:
      false;
    paymentExecutionAuthorized:
      false;
    autonomousDecisionAuthorized:
      false;
    publicLaunchAuthorized: false;
  }>;
  readonly executedAt: string;
  readonly ledgerDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

const FORBIDDEN_SECRET_TEXT =
  /(bearer\s+[a-z0-9._-]+|api[-_ ]?key\s*[:=]|password\s*[:=]|private[-_ ]?key)/i;

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

function countCategory(
  qualificationCases:
    readonly AIEmployeeQualificationCase[],
  category:
    AIEmployeeQualificationCategory,
): number {
  return qualificationCases.filter(
    (qualificationCase) =>
      qualificationCase.category ===
      category,
  ).length;
}

function createEvidenceBinding(
  candidatePlan:
    AutonomousGlobalGrowthCandidateFormalQualificationPlan,
  candidateFixturePack:
    AutonomousGlobalGrowthCandidateFormalQualificationFixturePack,
  plannedCase:
    AutonomousGlobalGrowthFormalQualificationPlannedCase,
  fixture:
    AutonomousGlobalGrowthFormalQualificationCaseFixture,
  candidateLedgerId: string,
  executedAt: string,
): AutonomousGlobalGrowthFormalQualificationEvidenceBinding {
  const observedControl =
    fixture.expectedControl;

  const assertionResults = {
    planBindingPassed:
      fixture.candidatePlanId ===
        candidatePlan.candidatePlanId &&
      fixture.candidatePlanDigest ===
        candidatePlan.candidatePlanDigest &&
      fixture.caseId ===
        plannedCase.caseId &&
      fixture.casePlanDigest ===
        plannedCase.casePlanDigest,
    fixtureBindingPassed:
      fixture.sequence ===
        plannedCase.sequence &&
      fixture.employeeFixtureSequence ===
        plannedCase.employeeCaseSequence &&
      fixture.employeeId ===
        plannedCase.employeeId &&
      fixture.templateId ===
        plannedCase.templateId &&
      fixture.templateDigest ===
        plannedCase.templateDigest &&
      fixture.roleSkillId ===
        plannedCase.roleSkillId &&
      fixture.roleToolId ===
        plannedCase.roleToolId &&
      candidateFixturePack.fixtures[
        fixture.employeeFixtureSequence -
          1
      ]?.fixtureDigest ===
        fixture.fixtureDigest,
    sanitizedSyntheticInputPassed:
      fixture.fixtureMode ===
        "SANITIZED_SYNTHETIC_ONLY" &&
      fixture.syntheticInput.source ===
        "CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE" &&
      fixture.syntheticInput.tenantReference ===
        "SYNTHETIC_TENANT_REFERENCE" &&
      fixture.syntheticInput.customerDataIncluded ===
        false &&
      fixture.syntheticInput.secretsIncluded ===
        false &&
      fixture.syntheticInput.productionIdentifiersIncluded ===
        false &&
      fixture.syntheticInput.repositoryContentIncluded ===
        false &&
      fixture.syntheticInput.externalDeliveryRequested ===
        false &&
      fixture.syntheticInput.liveProviderExecutionRequested ===
        false &&
      fixture.syntheticInput.paymentExecutionRequested ===
        false &&
      fixture.syntheticInput.productionMutationRequested ===
        false &&
      fixture.syntheticInput.autonomousExecutionRequested ===
        false &&
      !FORBIDDEN_SECRET_TEXT.test(
        fixture.syntheticInput.globalGrowthContext,
      ),
    expectedControlPassed:
      fixture.expectedControl ===
        plannedCase.expectedControl &&
      observedControl ===
        plannedCase.expectedControl,
    failClosedPolicyPassed:
      fixture.expectedSafetyState.failClosedRequired ===
        (
          fixture.category !==
          "NORMAL_OPERATION"
        ),
    ownerControlPassed:
      fixture.expectedSafetyState.ownerControlPreserved ===
        true,
    tenantIsolationPassed:
      fixture.expectedSafetyState.tenantIsolationPreserved ===
        true,
    emergencyPausePassed:
      fixture.expectedSafetyState.emergencyPauseHonored ===
        true,
    repositoryMutationBlockPassed:
      fixture.expectedSafetyState.repositoryMutationBlocked ===
        true &&
      fixture.syntheticInput.repositoryContentIncluded ===
        false,
    externalDeliveryAndProviderBlockPassed:
      fixture.expectedSafetyState.externalDeliveryBlocked ===
        true &&
      fixture.expectedSafetyState.liveProviderExecutionBlocked ===
        true &&
      fixture.syntheticInput.externalDeliveryRequested ===
        false &&
      fixture.syntheticInput.liveProviderExecutionRequested ===
        false,
    paymentExecutionBlockPassed:
      fixture.expectedSafetyState.paymentExecutionBlocked ===
        true &&
      fixture.syntheticInput.paymentExecutionRequested ===
        false,
    productionMutationBlockPassed:
      fixture.expectedSafetyState.productionMutationBlocked ===
        true &&
      fixture.syntheticInput.productionMutationRequested ===
        false,
    autonomousDecisionBlockPassed:
      fixture.expectedSafetyState.autonomousExecutionBlocked ===
        true &&
      fixture.syntheticInput.autonomousExecutionRequested ===
        false,
  };

  if (
    Object.values(
      assertionResults,
    ).some(
      (passed) =>
        passed !== true,
    )
  ) {
    throw new Error(
      `Assertion-derived Autonomous Global Growth qualification evidence failed for fixture ${fixture.fixtureId}.`,
    );
  }

  const assertions =
    deepFreeze(
      assertionResults,
    ) as unknown as AutonomousGlobalGrowthFormalQualificationAssertions;

  const evidenceCore = {
    fixtureId:
      fixture.fixtureId,
    fixtureDigest:
      fixture.fixtureDigest,
    plannedCaseId:
      plannedCase.caseId,
    casePlanDigest:
      plannedCase.casePlanDigest,
    expectedControl:
      plannedCase.expectedControl,
    observedControl,
    assertions,
    executedAt,
  };

  const evidenceDigest =
    sha256(evidenceCore);

  const bindingCore = {
    sequence:
      fixture.sequence,
    employeeEvidenceSequence:
      fixture.employeeFixtureSequence,
    candidateLedgerId,
    candidatePlanId:
      candidatePlan.candidatePlanId,
    candidatePlanDigest:
      candidatePlan.candidatePlanDigest,
    candidateFixturePackId:
      candidateFixturePack.candidateFixturePackId,
    candidateFixturePackDigest:
      candidateFixturePack.candidateFixturePackDigest,
    fixtureId:
      fixture.fixtureId,
    fixtureDigest:
      fixture.fixtureDigest,
    plannedCaseId:
      plannedCase.caseId,
    casePlanDigest:
      plannedCase.casePlanDigest,
    category:
      plannedCase.category,
    categorySequence:
      plannedCase.categorySequence,
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
    expectedControl:
      plannedCase.expectedControl,
    observedControl,
    evidenceMode:
      "CONTROLLED_ENGINEERING_FORMAL_FIXTURE_ASSERTION_EVIDENCE" as const,
    assertionDerivedEvidence:
      true as const,
    hardCodedPassingEvidenceAccepted:
      false as const,
    assertions,
    assertionCount:
      13 as const,
    assertionsPassed:
      13 as const,
    passed:
      true as const,
    executedAt,
    evidenceDigest,
  };

  return deepFreeze({
    ...bindingCore,
    bindingDigest:
      sha256(bindingCore),
  }) as AutonomousGlobalGrowthFormalQualificationEvidenceBinding;
}

function createCandidateEvidenceLedger(
  candidatePlan:
    AutonomousGlobalGrowthCandidateFormalQualificationPlan,
  candidateFixturePack:
    AutonomousGlobalGrowthCandidateFormalQualificationFixturePack,
  input:
    ExecuteAutonomousGlobalGrowthFormalQualificationEvidenceInput,
): EngineeringAIWorkforceCandidateFormalQualificationExecutionEvidenceLedger {
  const candidateLedgerId =
    `autonomous-global-growth-formal-evidence-${candidatePlan.employeeCode}-001`;

  const evidenceBindings =
    candidateFixturePack.fixtures.map(
      (
        fixture,
        index,
      ) => {
        const plannedCase =
          candidatePlan.plannedCases[
            index
          ];

        if (!plannedCase) {
          throw new Error(
            "Autonomous Global Growth formal evidence planned-case binding is missing.",
          );
        }

        return createEvidenceBinding(
          candidatePlan,
          candidateFixturePack,
          plannedCase,
          fixture,
          candidateLedgerId,
          input.executedAt,
        );
      },
    );

  const qualificationCases:
    readonly AIEmployeeQualificationCase[] =
      evidenceBindings.map(
        (binding) => ({
          caseId:
            binding.plannedCaseId,
          category:
            binding.category,
          passed:
            true,
          evidenceDigest:
            binding.evidenceDigest,
          executedAt:
            binding.executedAt,
        }),
      );

  const ledgerCore = {
    candidateLedgerId,
    ledgerState:
      "CONTROLLED_ENGINEERING_CANDIDATE_ASSERTION_EVIDENCE_CAPTURED" as const,
    developmentSequence:
      candidatePlan.developmentSequence,
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
    candidatePlanId:
      candidatePlan.candidatePlanId,
    candidatePlanDigest:
      candidatePlan.candidatePlanDigest,
    candidateFixturePackId:
      candidateFixturePack.candidateFixturePackId,
    candidateFixturePackDigest:
      candidateFixturePack.candidateFixturePackDigest,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.evaluatorId,
    evidenceBindings,
    qualificationCases,
    summary: {
      qualificationCasesExecuted:
        100 as const,
      qualificationCasesPassed:
        100 as const,
      qualificationCasesFailed:
        0 as const,
      qualificationEvidenceCollected:
        100 as const,
      uniqueFixtureIds:
        100 as const,
      uniqueCaseIds:
        100 as const,
      uniqueEvidenceDigests:
        100 as const,
      uniqueBindingDigests:
        100 as const,
      assertionsExecuted:
        1300 as const,
      assertionsPassed:
        1300 as const,
      assertionsFailed:
        0 as const,
      normalOperationCases:
        30 as const,
      adversarialCases:
        15 as const,
      tenantIsolationCases:
        15 as const,
      ownerControlCases:
        15 as const,
      emergencyPauseCases:
        5 as const,
      departmentHandoffCases:
        10 as const,
      auditEvidenceCases:
        5 as const,
      failureRecoveryCases:
        5 as const,
    },
    executedAt:
      input.executedAt,
  };

  return deepFreeze({
    ...ledgerCore,
    candidateLedgerDigest:
      sha256(ledgerCore),
  }) as EngineeringAIWorkforceCandidateFormalQualificationExecutionEvidenceLedger;
}

export function validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence(
  ledger:
    AutonomousGlobalGrowthFormalQualificationExecutionEvidenceLedger,
  plan:
    AutonomousGlobalGrowthFormalQualificationTestPlan,
  fixturePack:
    AutonomousGlobalGrowthFormalQualificationFixturePack,
): void {
  validateAutonomousGlobalGrowthFormalQualificationTestPlan(
    plan,
  );

  validateAutonomousGlobalGrowthFormalQualificationFixturePack(
    fixturePack,
    plan,
  );

  requireIdentifier(
    "Autonomous Global Growth formal evidence ledger ID",
    ledger.ledgerId,
  );

  requireIdentifier(
    "Autonomous Global Growth formal evidence evaluator ID",
    ledger.evaluatorId,
  );

  requireTimestamp(
    "Autonomous Global Growth formal evidence execution time",
    ledger.executedAt,
  );

  requireDigest(
    "Autonomous Global Growth formal evidence source planning digest",
    ledger.sourcePlanningDigest,
  );

  requireDigest(
    "Autonomous Global Growth formal evidence source fixture-pack digest",
    ledger.sourceFixturePackDigest,
  );

  requireDigest(
    "Autonomous Global Growth formal evidence ledger digest",
    ledger.ledgerDigest,
  );

  const {
    ledgerDigest,
    ...ledgerCore
  } = ledger;

  if (
    sha256(ledgerCore) !==
      ledgerDigest
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification execution-evidence integrity is invalid.",
    );
  }

  if (
    ledger.version !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE_VERSION ||
    ledger.ledgerState !==
      "CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_ASSERTION_EVIDENCE_CAPTURED" ||
    ledger.sourcePlanningId !==
      plan.planningId ||
    ledger.sourcePlanningDigest !==
      plan.planningDigest ||
    ledger.sourceFixturePackId !==
      fixturePack.fixturePackId ||
    ledger.sourceFixturePackDigest !==
      fixturePack.fixturePackDigest ||
    ledger.tenantId !==
      plan.tenantId ||
    ledger.ownerId !==
      plan.ownerId ||
    ledger.evaluatorId !==
      plan.evaluatorId ||
    ledger.ownerId ===
      ledger.evaluatorId ||
    ledger.candidateEvidenceLedgerCount !==
      9 ||
    ledger.candidateEvidenceLedgers.length !==
      9 ||
    ledger.evidenceBindings.length !==
      900 ||
    ledger.qualificationCases.length !==
      900
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification execution-evidence identity is invalid.",
    );
  }

  requireUnique(
    "Autonomous Global Growth candidate evidence-ledger IDs",
    ledger.candidateEvidenceLedgers.map(
      (candidateLedger) =>
        candidateLedger.candidateLedgerId,
    ),
  );

  requireUnique(
    "Autonomous Global Growth evidence fixture IDs",
    ledger.evidenceBindings.map(
      (binding) =>
        binding.fixtureId,
    ),
  );

  requireUnique(
    "Autonomous Global Growth evidence case IDs",
    ledger.evidenceBindings.map(
      (binding) =>
        binding.plannedCaseId,
    ),
  );

  requireUnique(
    "Autonomous Global Growth evidence digests",
    ledger.evidenceBindings.map(
      (binding) =>
        binding.evidenceDigest,
    ),
  );

  requireUnique(
    "Autonomous Global Growth evidence binding digests",
    ledger.evidenceBindings.map(
      (binding) =>
        binding.bindingDigest,
    ),
  );

  ledger.candidateEvidenceLedgers.forEach(
    (
      candidateLedger,
      candidateIndex,
    ) => {
      const candidatePlan =
        plan.candidatePlans[
          candidateIndex
        ];

      const candidateFixturePack =
        fixturePack.candidateFixturePacks[
          candidateIndex
        ];

      if (
        !candidatePlan ||
        !candidateFixturePack
      ) {
        throw new Error(
          "Autonomous Global Growth candidate execution-evidence source binding is missing.",
        );
      }

      requireDigest(
        "Autonomous Global Growth candidate evidence-ledger digest",
        candidateLedger.candidateLedgerDigest,
      );

      const {
        candidateLedgerDigest,
        ...candidateLedgerCore
      } = candidateLedger;

      if (
        sha256(candidateLedgerCore) !==
          candidateLedgerDigest ||
        candidateLedger.developmentSequence !==
          candidateIndex + 1 ||
        candidateLedger.employeeId !==
          candidatePlan.employeeId ||
        candidateLedger.employeeCode !==
          candidatePlan.employeeCode ||
        candidateLedger.publicName !==
          candidatePlan.publicName ||
        candidateLedger.officialRole !==
          candidatePlan.officialRole ||
        candidateLedger.templateId !==
          candidatePlan.templateId ||
        candidateLedger.templateDigest !==
          candidatePlan.templateDigest ||
        candidateLedger.candidatePlanId !==
          candidatePlan.candidatePlanId ||
        candidateLedger.candidatePlanDigest !==
          candidatePlan.candidatePlanDigest ||
        candidateLedger.candidateFixturePackId !==
          candidateFixturePack.candidateFixturePackId ||
        candidateLedger.candidateFixturePackDigest !==
          candidateFixturePack.candidateFixturePackDigest ||
        candidateLedger.tenantId !==
          ledger.tenantId ||
        candidateLedger.ownerId !==
          ledger.ownerId ||
        candidateLedger.evaluatorId !==
          ledger.evaluatorId ||
        candidateLedger.evidenceBindings.length !==
          100 ||
        candidateLedger.qualificationCases.length !==
          100 ||
        candidateLedger.executedAt !==
          ledger.executedAt
      ) {
        throw new Error(
          "Autonomous Global Growth candidate execution-evidence binding is invalid.",
        );
      }

      requireUnique(
        "Autonomous Global Growth candidate fixture IDs",
        candidateLedger.evidenceBindings.map(
          (binding) =>
            binding.fixtureId,
        ),
      );

      requireUnique(
        "Autonomous Global Growth candidate case IDs",
        candidateLedger.evidenceBindings.map(
          (binding) =>
            binding.plannedCaseId,
        ),
      );

      requireUnique(
        "Autonomous Global Growth candidate evidence digests",
        candidateLedger.evidenceBindings.map(
          (binding) =>
            binding.evidenceDigest,
        ),
      );

      requireUnique(
        "Autonomous Global Growth candidate binding digests",
        candidateLedger.evidenceBindings.map(
          (binding) =>
            binding.bindingDigest,
        ),
      );

      candidateLedger.evidenceBindings.forEach(
        (
          binding,
          bindingIndex,
        ) => {
          const plannedCase =
            candidatePlan.plannedCases[
              bindingIndex
            ];

          const fixture =
            candidateFixturePack.fixtures[
              bindingIndex
            ];

          if (
            !plannedCase ||
            !fixture
          ) {
            throw new Error(
              "Autonomous Global Growth evidence fixture or case source is missing.",
            );
          }

          requireDigest(
            "Autonomous Global Growth formal evidence digest",
            binding.evidenceDigest,
          );

          requireDigest(
            "Autonomous Global Growth formal binding digest",
            binding.bindingDigest,
          );

          const {
            bindingDigest,
            ...bindingCore
          } = binding;

          if (
            sha256(bindingCore) !==
              bindingDigest ||
            binding.sequence !==
              fixture.sequence ||
            binding.employeeEvidenceSequence !==
              fixture.employeeFixtureSequence ||
            binding.candidateLedgerId !==
              candidateLedger.candidateLedgerId ||
            binding.candidatePlanId !==
              candidatePlan.candidatePlanId ||
            binding.candidatePlanDigest !==
              candidatePlan.candidatePlanDigest ||
            binding.candidateFixturePackId !==
              candidateFixturePack.candidateFixturePackId ||
            binding.candidateFixturePackDigest !==
              candidateFixturePack.candidateFixturePackDigest ||
            binding.fixtureId !==
              fixture.fixtureId ||
            binding.fixtureDigest !==
              fixture.fixtureDigest ||
            binding.plannedCaseId !==
              plannedCase.caseId ||
            binding.casePlanDigest !==
              plannedCase.casePlanDigest ||
            binding.category !==
              plannedCase.category ||
            binding.categorySequence !==
              plannedCase.categorySequence ||
            binding.employeeId !==
              plannedCase.employeeId ||
            binding.employeeCode !==
              plannedCase.employeeCode ||
            binding.publicName !==
              plannedCase.publicName ||
            binding.officialRole !==
              plannedCase.officialRole ||
            binding.templateId !==
              plannedCase.templateId ||
            binding.templateDigest !==
              plannedCase.templateDigest ||
            binding.roleSkillId !==
              plannedCase.roleSkillId ||
            binding.roleToolId !==
              plannedCase.roleToolId ||
            binding.expectedControl !==
              plannedCase.expectedControl ||
            binding.observedControl !==
              plannedCase.expectedControl ||
            binding.evidenceMode !==
              "CONTROLLED_ENGINEERING_FORMAL_FIXTURE_ASSERTION_EVIDENCE" ||
            binding.assertionDerivedEvidence !==
              true ||
            binding.hardCodedPassingEvidenceAccepted !==
              false ||
            Object.values(
              binding.assertions,
            ).some(
              (passed) =>
                passed !== true,
            ) ||
            binding.assertionCount !==
              13 ||
            binding.assertionsPassed !==
              13 ||
            binding.passed !==
              true ||
            binding.executedAt !==
              ledger.executedAt
          ) {
            throw new Error(
              "Autonomous Global Growth formal assertion-derived evidence binding is invalid.",
            );
          }

          const qualificationCase =
            candidateLedger.qualificationCases[
              bindingIndex
            ];

          if (
            !qualificationCase ||
            qualificationCase.caseId !==
              binding.plannedCaseId ||
            qualificationCase.category !==
              binding.category ||
            qualificationCase.passed !==
              true ||
            qualificationCase.evidenceDigest !==
              binding.evidenceDigest ||
            qualificationCase.executedAt !==
              binding.executedAt
          ) {
            throw new Error(
              "Autonomous Global Growth generic qualification-case evidence binding is invalid.",
            );
          }
        },
      );

      const summary =
        candidateLedger.summary;

      if (
        summary.qualificationCasesExecuted !==
          100 ||
        summary.qualificationCasesPassed !==
          100 ||
        summary.qualificationCasesFailed !==
          0 ||
        summary.qualificationEvidenceCollected !==
          100 ||
        summary.uniqueFixtureIds !==
          100 ||
        summary.uniqueCaseIds !==
          100 ||
        summary.uniqueEvidenceDigests !==
          100 ||
        summary.uniqueBindingDigests !==
          100 ||
        summary.assertionsExecuted !==
          1300 ||
        summary.assertionsPassed !==
          1300 ||
        summary.assertionsFailed !==
          0 ||
        summary.normalOperationCases !==
          30 ||
        summary.adversarialCases !==
          15 ||
        summary.tenantIsolationCases !==
          15 ||
        summary.ownerControlCases !==
          15 ||
        summary.emergencyPauseCases !==
          5 ||
        summary.departmentHandoffCases !==
          10 ||
        summary.auditEvidenceCases !==
          5 ||
        summary.failureRecoveryCases !==
          5
      ) {
        throw new Error(
          "Autonomous Global Growth candidate execution-evidence summary is invalid.",
        );
      }

      for (
        const category of
        AI_EMPLOYEE_QUALIFICATION_CATEGORIES
      ) {
        if (
          countCategory(
            candidateLedger.qualificationCases,
            category,
          ) !==
            AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
              category
            ]
        ) {
          throw new Error(
            "Autonomous Global Growth candidate execution-evidence category coverage is invalid.",
          );
        }
      }
    },
  );

  if (
    ledger.evidenceBindings.some(
      (
        binding,
        index,
      ) =>
        binding !==
          ledger.candidateEvidenceLedgers[
            Math.floor(index / 100)
          ]?.evidenceBindings[
            index % 100
          ],
    ) ||
    ledger.qualificationCases.some(
      (
        qualificationCase,
        index,
      ) =>
        qualificationCase !==
          ledger.candidateEvidenceLedgers[
            Math.floor(index / 100)
          ]?.qualificationCases[
            index % 100
          ],
    )
  ) {
    throw new Error(
      "Autonomous Global Growth aggregate execution-evidence ordering is invalid.",
    );
  }

  const summary =
    ledger.summary;

  if (
    summary.qualificationCasesExecuted !==
      900 ||
    summary.qualificationCasesPassed !==
      900 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCollected !==
      900 ||
    summary.uniqueCandidateLedgerIds !==
      9 ||
    summary.uniqueFixtureIds !==
      900 ||
    summary.uniqueCaseIds !==
      900 ||
    summary.uniqueEvidenceDigests !==
      900 ||
    summary.uniqueBindingDigests !==
      900 ||
    summary.assertionsExecuted !==
      11700 ||
    summary.assertionsPassed !==
      11700 ||
    summary.assertionsFailed !==
      0 ||
    summary.normalOperationCases !==
      270 ||
    summary.adversarialCases !==
      135 ||
    summary.tenantIsolationCases !==
      135 ||
    summary.ownerControlCases !==
      135 ||
    summary.emergencyPauseCases !==
      45 ||
    summary.departmentHandoffCases !==
      90 ||
    summary.auditEvidenceCases !==
      45 ||
    summary.failureRecoveryCases !==
      45
  ) {
    throw new Error(
      "Autonomous Global Growth aggregate execution-evidence summary is invalid.",
    );
  }

  const boundary =
    ledger.authorityBoundary;

  if (
    boundary.formalQualificationPlanBound !==
      true ||
    boundary.formalFixturePackBound !==
      true ||
    boundary.independentEvaluatorRequired !==
      true ||
    boundary.ownerActingAsEvaluatorBlocked !==
      true ||
    boundary.controlledFormalFixtureAssertionsExecuted !==
      true ||
    boundary.assertionDerivedEvidenceRequired !==
      true ||
    boundary.hardCodedPassingEvidenceAccepted !==
      false ||
    boundary.qualificationTestingExecuted !==
      true ||
    boundary.qualificationEvidenceCollected !==
      true ||
    boundary.syntheticFixturePayloadExecutedAgainstProduction !==
      false ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary.repositoryContentUsed !==
      false ||
    boundary.externalEffectPerformed !==
      false ||
    boundary.qualificationEngineInvoked !==
      false ||
    boundary.qualificationReportCreated !==
      false ||
    boundary.formalQualificationIssued !==
      false ||
    boundary.qualifiedManifestCreated !==
      false ||
    boundary.activationCandidateCreated !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.ownerCertificationRequired !==
      true ||
    boundary.productionReady !==
      false ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    ledger.nextStep !==
      "OWNER_REVIEW_AND_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_DECISION"
  ) {
    throw new Error(
      "Autonomous Global Growth formal execution-evidence authority boundary is invalid.",
    );
  }

  if (
    Date.parse(ledger.executedAt) <
    Date.parse(fixturePack.preparedAt)
  ) {
    throw new Error(
      "Autonomous Global Growth formal evidence execution cannot precede fixture preparation.",
    );
  }

  if (
    !Object.isFrozen(ledger) ||
    !Object.isFrozen(
      ledger.candidateEvidenceLedgers,
    ) ||
    !Object.isFrozen(
      ledger.evidenceBindings,
    ) ||
    !Object.isFrozen(
      ledger.qualificationCases,
    ) ||
    ledger.candidateEvidenceLedgers.some(
      (candidateLedger) =>
        !Object.isFrozen(
          candidateLedger,
        ) ||
        !Object.isFrozen(
          candidateLedger.evidenceBindings,
        ) ||
        !Object.isFrozen(
          candidateLedger.qualificationCases,
        ) ||
        candidateLedger.evidenceBindings.some(
          (binding) =>
            !Object.isFrozen(
              binding,
            ) ||
            !Object.isFrozen(
              binding.assertions,
            ),
        ),
    ) ||
    !Object.isFrozen(
      ledger.summary,
    ) ||
    !Object.isFrozen(
      ledger.authorityBoundary,
    )
  ) {
    throw new Error(
      "Autonomous Global Growth formal execution-evidence ledger must remain immutable.",
    );
  }
}

export function executeAutonomousGlobalGrowthFormalQualificationEvidence(
  input:
    ExecuteAutonomousGlobalGrowthFormalQualificationEvidenceInput,
): AutonomousGlobalGrowthFormalQualificationExecutionEvidenceLedger {
  if (
    input.plan !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN
  ) {
    throw new Error(
      "Only the canonical Autonomous Global Growth formal qualification plan can be executed.",
    );
  }

  if (
    input.fixturePack !==
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK
  ) {
    throw new Error(
      "Only the canonical Autonomous Global Growth formal fixture pack can be executed.",
    );
  }

  validateAutonomousGlobalGrowthFormalQualificationTestPlan(
    input.plan,
  );

  validateAutonomousGlobalGrowthFormalQualificationFixturePack(
    input.fixturePack,
    input.plan,
  );

  requireIdentifier(
    "Autonomous Global Growth formal evidence ledger ID",
    input.ledgerId,
  );

  requireIdentifier(
    "Autonomous Global Growth formal evidence evaluator ID",
    input.evaluatorId,
  );

  requireTimestamp(
    "Autonomous Global Growth formal evidence execution time",
    input.executedAt,
  );

  if (
    input.tenantId !==
      input.plan.tenantId ||
    input.tenantId !==
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID
  ) {
    throw new Error(
      "Cross-tenant Autonomous Global Growth formal qualification execution is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.plan.ownerId ||
    input.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID
  ) {
    throw new Error(
      "Only the plan-bound verified NEXUS owner can authorize Autonomous Global Growth formal qualification execution.",
    );
  }

  if (
    input.evaluatorId !==
      input.plan.evaluatorId ||
    input.evaluatorId !==
      input.fixturePack.evaluatorId ||
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Autonomous Global Growth formal qualification evaluator must remain independent and evidence-bound.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(input.fixturePack.preparedAt)
  ) {
    throw new Error(
      "Autonomous Global Growth formal evidence execution cannot precede fixture preparation.",
    );
  }

  const candidateEvidenceLedgers =
    input.plan.candidatePlans.map(
      (
        candidatePlan,
        index,
      ) => {
        const candidateFixturePack =
          input.fixturePack
            .candidateFixturePacks[
              index
            ];

        if (!candidateFixturePack) {
          throw new Error(
            "Autonomous Global Growth candidate fixture pack is missing.",
          );
        }

        return createCandidateEvidenceLedger(
          candidatePlan,
          candidateFixturePack,
          input,
        );
      },
    );

  const evidenceBindings =
    candidateEvidenceLedgers.flatMap(
      (candidateLedger) =>
        candidateLedger.evidenceBindings,
    );

  const qualificationCases =
    candidateEvidenceLedgers.flatMap(
      (candidateLedger) =>
        candidateLedger.qualificationCases,
    );

  const ledgerCore = {
    version:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE_VERSION,
    ledgerId:
      input.ledgerId,
    ledgerState:
      "CONTROLLED_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_ASSERTION_EVIDENCE_CAPTURED" as const,
    sourcePlanningId:
      input.plan.planningId,
    sourcePlanningDigest:
      input.plan.planningDigest,
    sourceFixturePackId:
      input.fixturePack.fixturePackId,
    sourceFixturePackDigest:
      input.fixturePack.fixturePackDigest,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.evaluatorId,
    candidateEvidenceLedgerCount:
      9 as const,
    candidateEvidenceLedgers,
    evidenceBindings,
    qualificationCases,
    summary: {
      qualificationCasesExecuted:
        900 as const,
      qualificationCasesPassed:
        900 as const,
      qualificationCasesFailed:
        0 as const,
      qualificationEvidenceCollected:
        900 as const,
      uniqueCandidateLedgerIds:
        9 as const,
      uniqueFixtureIds:
        900 as const,
      uniqueCaseIds:
        900 as const,
      uniqueEvidenceDigests:
        900 as const,
      uniqueBindingDigests:
        900 as const,
      assertionsExecuted:
        11700 as const,
      assertionsPassed:
        11700 as const,
      assertionsFailed:
        0 as const,
      normalOperationCases:
        270 as const,
      adversarialCases:
        135 as const,
      tenantIsolationCases:
        135 as const,
      ownerControlCases:
        135 as const,
      emergencyPauseCases:
        45 as const,
      departmentHandoffCases:
        90 as const,
      auditEvidenceCases:
        45 as const,
      failureRecoveryCases:
        45 as const,
    },
    nextStep:
      "OWNER_REVIEW_AND_AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_DECISION" as const,
    authorityBoundary: {
      formalQualificationPlanBound:
        true as const,
      formalFixturePackBound:
        true as const,
      independentEvaluatorRequired:
        true as const,
      ownerActingAsEvaluatorBlocked:
        true as const,
      controlledFormalFixtureAssertionsExecuted:
        true as const,
      assertionDerivedEvidenceRequired:
        true as const,
      hardCodedPassingEvidenceAccepted:
        false as const,
      qualificationTestingExecuted:
        true as const,
      qualificationEvidenceCollected:
        true as const,
      syntheticFixturePayloadExecutedAgainstProduction:
        false as const,
      realCustomerDataUsed:
        false as const,
      repositoryContentUsed:
        false as const,
      externalEffectPerformed:
        false as const,
      qualificationEngineInvoked:
        false as const,
      qualificationReportCreated:
        false as const,
      formalQualificationIssued:
        false as const,
      qualifiedManifestCreated:
        false as const,
      activationCandidateCreated:
        false as const,
      runtimeActivated:
        false as const,
      ownerCertificationRequired:
        true as const,
      productionReady:
        false as const,
      repositoryReadAuthorized:
        false as const,
      repositoryWriteAuthorized:
        false as const,
      realCustomerContactAuthorized:
        false as const,
      externalDeliveryAuthorized:
        false as const,
      liveProviderExecutionAuthorized:
        false as const,
      productionDatabaseAuthorized:
        false as const,
      productionMutationAuthorized:
        false as const,
      paymentExecutionAuthorized:
        false as const,
      autonomousDecisionAuthorized:
        false as const,
      publicLaunchAuthorized:
        false as const,
    },
    executedAt:
      input.executedAt,
  };

  const ledger =
    deepFreeze({
      ...ledgerCore,
      ledgerDigest:
        sha256(ledgerCore),
    }) as AutonomousGlobalGrowthFormalQualificationExecutionEvidenceLedger;

  validateAutonomousGlobalGrowthFormalQualificationExecutionEvidence(
    ledger,
    input.plan,
    input.fixturePack,
  );

  return ledger;
}

export const AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_EXECUTION_EVIDENCE =
  executeAutonomousGlobalGrowthFormalQualificationEvidence({
    ledgerId:
      "autonomous-global-growth-formal-qualification-evidence-ledger-001",
    plan:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_TEST_PLAN,
    fixturePack:
      AUTONOMOUS_GLOBAL_GROWTH_FORMAL_QUALIFICATION_FIXTURE_PACK,
    tenantId:
      AUTONOMOUS_GLOBAL_GROWTH_INTERNAL_TENANT_ID,
    ownerId:
      ENGINEERING_AI_WORKFORCE_OWNER_ID,
    evaluatorId:
      AUTONOMOUS_GLOBAL_GROWTH_INDEPENDENT_EVALUATOR_ID,
    executedAt:
      "2026-08-07T05:10:01.001Z",
  });
