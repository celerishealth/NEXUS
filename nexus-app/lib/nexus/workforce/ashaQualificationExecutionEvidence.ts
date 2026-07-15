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
  executeAshaIndependentEvaluation,
  type AshaIndependentEvaluationReport,
} from "./ashaIndependentEvaluationHarness";

import {
  ASHA_QUALIFICATION_FIXTURE_PACK_VERSION,
  type AshaQualificationCaseFixture,
  type AshaQualificationFixturePack,
} from "./ashaQualificationFixturePack";

export const ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION =
  "nexus-asha-qualification-execution-evidence-v1" as const;

export interface ExecuteAshaQualificationEvidenceInput {
  readonly ledgerId: string;
  readonly fixturePack:
    AshaQualificationFixturePack;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly executedAt: string;
}

export interface AshaQualificationEvidenceBinding {
  readonly fixtureId: string;
  readonly fixtureDigest: string;
  readonly plannedCaseId: string;
  readonly casePlanDigest: string;
  readonly category:
    AIEmployeeQualificationCategory;
  readonly categorySequence: number;
  readonly harnessCaseId: string;
  readonly harnessEvidenceDigest: string;
  readonly mappingMode:
    "CATEGORY_ORDER_ASSERTION_EVIDENCE_BINDING";
  readonly assertionDerivedEvidence: true;
  readonly hardCodedPassingEvidenceAccepted: false;
  readonly passed: true;
  readonly executedAt: string;
  readonly bindingDigest: string;
}

export interface AshaQualificationExecutionEvidenceLedger {
  readonly version:
    typeof ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION;
  readonly ledgerId: string;
  readonly ledgerState:
    "INDEPENDENT_ASSERTION_EVIDENCE_CAPTURED";
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly fixturePackId: string;
  readonly fixturePackDigest: string;
  readonly planId: string;
  readonly planDigest: string;
  readonly independentEvaluationReportDigest: string;
  readonly harnessExecution: Readonly<{
    totalCases: number;
    passedCases: number;
    foundationCases: number;
    foundationPassedCases: number;
    specialistCases: number;
    specialistPassedCases: number;
    assertionDerivedEvidence: true;
    everyCaseExecuted: true;
    everyCasePassed: true;
    failedAssertionBlocksReport: true;
    duplicateEvidenceBlocked: true;
  }>;
  readonly evidenceBindings:
    readonly AshaQualificationEvidenceBinding[];
  readonly qualificationCases:
    readonly AIEmployeeQualificationCase[];
  readonly summary: Readonly<{
    qualificationCasesExecuted: number;
    qualificationCasesPassed: number;
    qualificationCasesFailed: 0;
    qualificationEvidenceCollected: number;
    uniqueQualificationCaseIds: number;
    uniqueQualificationEvidenceDigests: number;
    normalOperationCases: number;
    adversarialCases: number;
    tenantIsolationCases: number;
    ownerControlCases: number;
    emergencyPauseCases: number;
    departmentHandoffCases: number;
    auditEvidenceCases: number;
    failureRecoveryCases: number;
  }>;
  readonly nextStep:
    "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION";
  readonly authorityBoundary: Readonly<{
    fixturePackBound: true;
    independentEvaluationHarnessExecuted: true;
    assertionDerivedEvidenceRequired: true;
    hardCodedPassingEvidenceAccepted: false;
    fixtureBoundaryMappingsCreated: true;
    syntheticFixturePayloadExecutedAgainstProduction: false;
    qualificationTestingExecuted: true;
    qualificationEvidenceCollected: true;
    qualificationEngineInvoked: false;
    qualificationReportCreated: false;
    formalQualificationIssued: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    ownerCertificationRequired: true;
    shadowModeRequired: true;
    controlledPilotRequired: true;
    customerDataAccessAuthorized: false;
    customerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
  }>;
  readonly executedAt: string;
  readonly ledgerDigest: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            stableStringify(item),
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
            JSON.stringify(key) +
            ":" +
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic qualification-evidence value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const propertyName of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[propertyName];

      if (
        child !== null &&
        typeof child === "object"
      ) {
        deepFreeze(child);
      }
    }

    Object.freeze(value);
  }

  return value as Readonly<T>;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a safe identifier.",
    );
  }
}

function requireSha256(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      label +
        " must be a SHA-256 digest.",
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      label +
        " must be a valid ISO timestamp.",
    );
  }
}

function validateFixture(
  fixture:
    AshaQualificationCaseFixture,
): void {
  requireIdentifier(
    "qualification fixtureId",
    fixture.fixtureId,
  );

  requireIdentifier(
    "qualification planned caseId",
    fixture.caseId,
  );

  requireSha256(
    "qualification fixture digest",
    fixture.fixtureDigest,
  );

  requireSha256(
    "qualification case-plan digest",
    fixture.casePlanDigest,
  );

  if (
    fixture.fixtureMode !==
      "SANITIZED_SYNTHETIC_ONLY" ||
    fixture.executionState !==
      "NOT_EXECUTED" ||
    fixture.evidenceState !==
      "NOT_COLLECTED" ||
    fixture.passed !== null ||
    fixture.evidenceDigest !== null ||
    fixture.executedAt !== null
  ) {
    throw new Error(
      "Qualification fixture is not in its authorized pre-execution state.",
    );
  }

  if (
    fixture.syntheticInput
      .customerDataIncluded !== false ||
    fixture.syntheticInput
      .secretsIncluded !== false ||
    fixture.syntheticInput
      .productionIdentifiersIncluded !== false ||
    fixture.syntheticInput
      .externalDeliveryRequested !== false ||
    fixture.syntheticInput
      .liveProviderExecutionRequested !== false ||
    fixture.syntheticInput
      .paymentExecutionRequested !== false
  ) {
    throw new Error(
      "Qualification fixture contains an unauthorized data or execution request.",
    );
  }

  if (
    fixture.expectedSafetyState
      .ownerControlPreserved !== true ||
    fixture.expectedSafetyState
      .tenantIsolationPreserved !== true ||
    fixture.expectedSafetyState
      .emergencyPauseHonored !== true ||
    fixture.expectedSafetyState
      .externalDeliveryBlocked !== true ||
    fixture.expectedSafetyState
      .liveProviderExecutionBlocked !== true ||
    fixture.expectedSafetyState
      .paymentExecutionBlocked !== true ||
    fixture.expectedSafetyState
      .productionMutationBlocked !== true
  ) {
    throw new Error(
      "Qualification fixture safety state is invalid.",
    );
  }

  const {
    fixtureDigest,
    ...fixtureCore
  } = fixture;

  if (
    sha256(fixtureCore) !==
      fixtureDigest
  ) {
    throw new Error(
      "Qualification fixture digest is invalid.",
    );
  }
}

function validateFixturePack(
  pack:
    AshaQualificationFixturePack,
): void {
  if (
    pack.version !==
      ASHA_QUALIFICATION_FIXTURE_PACK_VERSION ||
    pack.fixturePackState !==
      "SANITIZED_SYNTHETIC_FIXTURES_PREPARED"
  ) {
    throw new Error(
      "Asha qualification fixture-pack state is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "fixturePackId",
        pack.fixturePackId,
      ],
      [
        "planId",
        pack.planId,
      ],
      [
        "employeeId",
        pack.employeeId,
      ],
      [
        "templateId",
        pack.templateId,
      ],
      [
        "tenantId",
        pack.tenantId,
      ],
      [
        "ownerId",
        pack.ownerId,
      ],
      [
        "evaluatorId",
        pack.evaluatorId,
      ],
    ] as const
  ) {
    requireIdentifier(
      label,
      value,
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "fixture-pack digest",
        pack.fixturePackDigest,
      ],
      [
        "qualification plan digest",
        pack.planDigest,
      ],
    ] as const
  ) {
    requireSha256(
      label,
      value,
    );
  }

  requireIsoDate(
    "fixture-pack preparation time",
    pack.preparedAt,
  );

  if (
    pack.requiredFixtureCount !== 100 ||
    pack.fixtures.length !== 100 ||
    pack.summary.totalFixtures !== 100 ||
    pack.summary
      .sanitizedSyntheticFixtures !== 100 ||
    pack.summary.customerDataFixtures !== 0 ||
    pack.summary.secretBearingFixtures !== 0 ||
    pack.summary
      .productionIdentifierFixtures !== 0 ||
    pack.summary.executedFixtures !== 0 ||
    pack.summary
      .collectedEvidenceCount !== 0 ||
    pack.summary.passedCaseCount !== 0 ||
    pack.summary.failedCaseCount !== 0
  ) {
    throw new Error(
      "Qualification fixture-pack summary is invalid.",
    );
  }

  if (
    pack.authorityBoundary
      .qualificationPlanBound !== true ||
    pack.authorityBoundary
      .tenantIdentityBound !== true ||
    pack.authorityBoundary
      .ownerIdentityBound !== true ||
    pack.authorityBoundary
      .qualificationFixturesCreated !== true ||
    pack.authorityBoundary
      .sanitizedSyntheticFixturesOnly !== true ||
    pack.authorityBoundary
      .customerDataIncluded !== false ||
    pack.authorityBoundary
      .secretsIncluded !== false ||
    pack.authorityBoundary
      .productionIdentifiersIncluded !== false ||
    pack.authorityBoundary
      .qualificationTestingExecuted !== false ||
    pack.authorityBoundary
      .qualificationEvidenceCollected !== false ||
    pack.authorityBoundary
      .syntheticPassingEvidenceCreated !== false ||
    pack.authorityBoundary
      .qualificationEngineInvoked !== false ||
    pack.authorityBoundary
      .qualificationReportCreated !== false ||
    pack.authorityBoundary
      .formalQualificationIssued !== false ||
    pack.authorityBoundary
      .qualifiedManifestCreated !== false ||
    pack.authorityBoundary
      .activationCandidateCreated !== false ||
    pack.authorityBoundary
      .runtimeActivated !== false ||
    pack.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    pack.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    pack.authorityBoundary
      .productionMutationAuthorized !== false ||
    pack.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    pack.authorityBoundary
      .productionReadinessAuthorized !== false ||
    pack.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Qualification fixture-pack authority boundary is invalid.",
    );
  }

  const fixtureIds =
    new Set<string>();

  const fixtureDigests =
    new Set<string>();

  const caseIds =
    new Set<string>();

  for (
    const fixture of pack.fixtures
  ) {
    validateFixture(
      fixture,
    );

    fixtureIds.add(
      fixture.fixtureId,
    );

    fixtureDigests.add(
      fixture.fixtureDigest,
    );

    caseIds.add(
      fixture.caseId,
    );
  }

  if (
    fixtureIds.size !== 100 ||
    fixtureDigests.size !== 100 ||
    caseIds.size !== 100
  ) {
    throw new Error(
      "Qualification fixture-pack identities or digests are not unique.",
    );
  }

  const {
    fixturePackDigest,
    ...packCore
  } = pack;

  if (
    sha256(packCore) !==
      fixturePackDigest
  ) {
    throw new Error(
      "Qualification fixture-pack digest is invalid.",
    );
  }
}

function validateEvaluationReport(
  report:
    AshaIndependentEvaluationReport,
): void {
  requireSha256(
    "independent evaluation report digest",
    report.reportDigest,
  );

  requireSha256(
    "foundation evidence digest",
    report.foundation.evidenceDigest,
  );

  requireSha256(
    "specialist evidence digest",
    report.specialist.evidenceDigest,
  );

  requireIsoDate(
    "independent evaluation time",
    report.evaluatedAt,
  );

  if (
    report.totalCases !== 400 ||
    report.passedCases !== 400 ||
    report.foundation.totalCases !== 100 ||
    report.foundation.passedCases !== 100 ||
    report.specialist.totalCases !== 300 ||
    report.specialist.passedCases !== 300 ||
    report.caseResults.length !== 400
  ) {
    throw new Error(
      "Independent evaluation execution totals are invalid.",
    );
  }

  if (
    report.assertionDerivedEvidence !== true ||
    report.hardCodedPassingEvidenceAccepted !== false ||
    report
      .syntheticQualificationFixtureUsedOnlyForBoundaryTesting !== true ||
    report.formalQualificationIssued !== false ||
    report.controlledActivationAuthorized !== false ||
    report.productionReady !== false ||
    report.safetyBoundary
      .independentEvaluatorRequired !== true ||
    report.safetyBoundary.everyCaseExecuted !== true ||
    report.safetyBoundary.everyCasePassed !== true ||
    report.safetyBoundary
      .failedAssertionBlocksReport !== true ||
    report.safetyBoundary
      .duplicateEvidenceBlocked !== true ||
    report.safetyBoundary
      .ownerCertificationRequired !== true ||
    report.safetyBoundary.shadowModeRequired !== true ||
    report.safetyBoundary
      .controlledPilotRequired !== true ||
    report.safetyBoundary
      .liveProviderExecutionAuthorized !== false ||
    report.safetyBoundary
      .externalDeliveryAuthorized !== false ||
    report.safetyBoundary
      .paymentExecutionAuthorized !== false ||
    report.safetyBoundary
      .productionDatabaseAuthorized !== false ||
    report.safetyBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Independent evaluation authority boundary is invalid.",
    );
  }

  const caseIds =
    new Set(
      report.caseResults.map(
        (result) =>
          result.caseId,
      ),
    );

  const evidenceDigests =
    new Set(
      report.caseResults.map(
        (result) =>
          result.evidenceDigest,
      ),
    );

  if (
    caseIds.size !== 400 ||
    evidenceDigests.size !== 400
  ) {
    throw new Error(
      "Independent evaluation case identity or evidence is duplicated.",
    );
  }

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    if (
      report.foundation
        .categoryCounts[category] !==
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ]
    ) {
      throw new Error(
        "Independent foundation category coverage is incomplete.",
      );
    }
  }

  const {
    reportDigest,
    ...reportCore
  } = report;

  if (
    sha256(reportCore) !==
      reportDigest
  ) {
    throw new Error(
      "Independent evaluation report digest is invalid.",
    );
  }
}

function categoryCount(
  cases:
    readonly AIEmployeeQualificationCase[],
  category:
    AIEmployeeQualificationCategory,
): number {
  return cases.filter(
    (qualificationCase) =>
      qualificationCase.category ===
      category,
  ).length;
}

export async function executeAshaQualificationEvidence(
  input:
    ExecuteAshaQualificationEvidenceInput,
): Promise<AshaQualificationExecutionEvidenceLedger> {
  requireIdentifier(
    "qualification evidence ledgerId",
    input.ledgerId,
  );

  requireIdentifier(
    "qualification evidence ownerId",
    input.ownerId,
  );

  requireIdentifier(
    "qualification evidence evaluatorId",
    input.evaluatorId,
  );

  requireIsoDate(
    "qualification execution time",
    input.executedAt,
  );

  validateFixturePack(
    input.fixturePack,
  );

  if (
    input.ownerId !==
      input.fixturePack.ownerId
  ) {
    throw new Error(
      "Only the fixture-pack-bound owner can authorize qualification execution.",
    );
  }

  if (
    input.evaluatorId !==
      input.fixturePack.evaluatorId
  ) {
    throw new Error(
      "Qualification execution evaluator does not match the fixture pack.",
    );
  }

  if (
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Asha qualification evaluator must be distinct from the owner.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.fixturePack.preparedAt,
    )
  ) {
    throw new Error(
      "Qualification execution cannot precede fixture preparation.",
    );
  }

  const evaluationReport =
    await executeAshaIndependentEvaluation({
      evaluatorId:
        input.evaluatorId,
      ownerId:
        input.ownerId,
      evaluatedAt:
        input.executedAt,
    });

  validateEvaluationReport(
    evaluationReport,
  );

  if (
    evaluationReport.ownerId !==
      input.ownerId ||
    evaluationReport.evaluatorId !==
      input.evaluatorId ||
    evaluationReport.employeeId !==
      input.fixturePack.employeeId ||
    evaluationReport.templateId !==
      input.fixturePack.templateId ||
    evaluationReport.evaluatedAt !==
      input.executedAt
  ) {
    throw new Error(
      "Independent evaluation identity binding is invalid.",
    );
  }

  const foundationResults =
    evaluationReport.caseResults.filter(
      (result) =>
        result.scope ===
        "FOUNDATION",
    );

  if (
    foundationResults.length !== 100
  ) {
    throw new Error(
      "Independent evaluation did not produce exactly 100 foundation results.",
    );
  }

  const evidenceBindings:
    AshaQualificationEvidenceBinding[] = [];

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    const categoryFixtures =
      input.fixturePack.fixtures.filter(
        (fixture) =>
          fixture.category ===
          category,
      );

    const categoryResults =
      foundationResults.filter(
        (result) =>
          result.category ===
          category,
      );

    const expectedCount =
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ];

    if (
      categoryFixtures.length !==
        expectedCount ||
      categoryResults.length !==
        expectedCount
    ) {
      throw new Error(
        "Qualification fixture and assertion-evidence category coverage do not match.",
      );
    }

    for (
      let index = 0;
      index <
      expectedCount;
      index++
    ) {
      const fixture =
        categoryFixtures[index];

      const result =
        categoryResults[index];

      if (
        fixture === undefined ||
        result === undefined
      ) {
        throw new Error(
          "Qualification evidence category binding is incomplete.",
        );
      }

      requireSha256(
        "independent assertion evidence digest",
        result.evidenceDigest,
      );

      const bindingCore = {
        fixtureId:
          fixture.fixtureId,
        fixtureDigest:
          fixture.fixtureDigest,
        plannedCaseId:
          fixture.caseId,
        casePlanDigest:
          fixture.casePlanDigest,
        category,
        categorySequence:
          fixture.categorySequence,
        harnessCaseId:
          result.caseId,
        harnessEvidenceDigest:
          result.evidenceDigest,
        mappingMode:
          "CATEGORY_ORDER_ASSERTION_EVIDENCE_BINDING" as const,
        assertionDerivedEvidence:
          true as const,
        hardCodedPassingEvidenceAccepted:
          false as const,
        passed:
          true as const,
        executedAt:
          input.executedAt,
      };

      evidenceBindings.push({
        ...bindingCore,
        bindingDigest:
          sha256(bindingCore),
      });
    }
  }

  if (
    evidenceBindings.length !== 100
  ) {
    throw new Error(
      "Qualification evidence binding did not cover all 100 cases.",
    );
  }

  const bindingDigests =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.bindingDigest,
      ),
    );

  const harnessCaseIds =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.harnessCaseId,
      ),
    );

  const plannedCaseIds =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.plannedCaseId,
      ),
    );

  if (
    bindingDigests.size !== 100 ||
    harnessCaseIds.size !== 100 ||
    plannedCaseIds.size !== 100
  ) {
    throw new Error(
      "Qualification evidence bindings are not unique.",
    );
  }

  const qualificationCases:
    AIEmployeeQualificationCase[] =
      evidenceBindings.map(
        (binding) => ({
          caseId:
            binding.plannedCaseId,
          category:
            binding.category,
          passed:
            true,
          evidenceDigest:
            binding.bindingDigest,
          executedAt:
            binding.executedAt,
        }),
      );

  const qualificationCaseIds =
    new Set(
      qualificationCases.map(
        (qualificationCase) =>
          qualificationCase.caseId,
      ),
    );

  const qualificationEvidenceDigests =
    new Set(
      qualificationCases.map(
        (qualificationCase) =>
          qualificationCase
            .evidenceDigest,
      ),
    );

  if (
    qualificationCaseIds.size !== 100 ||
    qualificationEvidenceDigests.size !== 100
  ) {
    throw new Error(
      "Qualification cases or evidence digests are not unique.",
    );
  }

  const ledgerCore = {
    version:
      ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION,
    ledgerId:
      input.ledgerId,
    ledgerState:
      "INDEPENDENT_ASSERTION_EVIDENCE_CAPTURED" as const,
    employeeId:
      input.fixturePack.employeeId,
    templateId:
      input.fixturePack.templateId,
    tenantId:
      input.fixturePack.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.evaluatorId,
    fixturePackId:
      input.fixturePack.fixturePackId,
    fixturePackDigest:
      input.fixturePack.fixturePackDigest,
    planId:
      input.fixturePack.planId,
    planDigest:
      input.fixturePack.planDigest,
    independentEvaluationReportDigest:
      evaluationReport.reportDigest,
    harnessExecution: {
      totalCases:
        evaluationReport.totalCases,
      passedCases:
        evaluationReport.passedCases,
      foundationCases:
        evaluationReport.foundation
          .totalCases,
      foundationPassedCases:
        evaluationReport.foundation
          .passedCases,
      specialistCases:
        evaluationReport.specialist
          .totalCases,
      specialistPassedCases:
        evaluationReport.specialist
          .passedCases,
      assertionDerivedEvidence:
        true as const,
      everyCaseExecuted:
        true as const,
      everyCasePassed:
        true as const,
      failedAssertionBlocksReport:
        true as const,
      duplicateEvidenceBlocked:
        true as const,
    },
    evidenceBindings,
    qualificationCases,
    summary: {
      qualificationCasesExecuted:
        qualificationCases.length,
      qualificationCasesPassed:
        qualificationCases.length,
      qualificationCasesFailed:
        0 as const,
      qualificationEvidenceCollected:
        qualificationCases.length,
      uniqueQualificationCaseIds:
        qualificationCaseIds.size,
      uniqueQualificationEvidenceDigests:
        qualificationEvidenceDigests.size,
      normalOperationCases:
        categoryCount(
          qualificationCases,
          "NORMAL_OPERATION",
        ),
      adversarialCases:
        categoryCount(
          qualificationCases,
          "ADVERSARIAL",
        ),
      tenantIsolationCases:
        categoryCount(
          qualificationCases,
          "TENANT_ISOLATION",
        ),
      ownerControlCases:
        categoryCount(
          qualificationCases,
          "OWNER_CONTROL",
        ),
      emergencyPauseCases:
        categoryCount(
          qualificationCases,
          "EMERGENCY_PAUSE",
        ),
      departmentHandoffCases:
        categoryCount(
          qualificationCases,
          "DEPARTMENT_HANDOFF",
        ),
      auditEvidenceCases:
        categoryCount(
          qualificationCases,
          "AUDIT_EVIDENCE",
        ),
      failureRecoveryCases:
        categoryCount(
          qualificationCases,
          "FAILURE_RECOVERY",
        ),
    },
    nextStep:
      "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION" as const,
    authorityBoundary: {
      fixturePackBound:
        true,
      independentEvaluationHarnessExecuted:
        true,
      assertionDerivedEvidenceRequired:
        true,
      hardCodedPassingEvidenceAccepted:
        false,
      fixtureBoundaryMappingsCreated:
        true,
      syntheticFixturePayloadExecutedAgainstProduction:
        false,
      qualificationTestingExecuted:
        true,
      qualificationEvidenceCollected:
        true,
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
      shadowModeRequired:
        true,
      controlledPilotRequired:
        true,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
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
      productionReadinessAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    } as const,
    executedAt:
      input.executedAt,
  };

  const ledger:
    AshaQualificationExecutionEvidenceLedger = {
      ...ledgerCore,
      ledgerDigest:
        sha256(ledgerCore),
  };

  return deepFreeze(
    ledger,
  ) as AshaQualificationExecutionEvidenceLedger;
}