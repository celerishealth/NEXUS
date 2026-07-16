import {
  createHash,
} from "node:crypto";

import {
  validateRiyaQualificationFixturePack,
  type RiyaQualificationExpectedControl,
  type RiyaQualificationFixturePack,
} from "./riyaQualificationFixturePack";

export const RIYA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION =
  "nexus-riya-qualification-execution-evidence-v1" as const;

export interface ExecuteRiyaQualificationEvidenceInput {
  readonly ledgerId: string;

  readonly fixturePack:
    RiyaQualificationFixturePack;

  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly executedAt: string;
}

export interface RiyaQualificationEvidenceBinding {
  readonly sequence: number;

  readonly fixtureId: string;
  readonly caseId: string;
  readonly competencyId: string;

  readonly expectedControl:
    RiyaQualificationExpectedControl;

  readonly executionMode:
    "SANDBOX_ONLY";

  readonly evidenceMode:
    "SYNTHETIC_FIXTURE_ASSERTION_EVIDENCE";

  readonly assertionDerivedEvidence:
    true;

  readonly hardCodedPassingEvidenceAccepted:
    false;

  readonly passed:
    true;

  readonly executedAt: string;

  readonly evidenceDigest: string;
  readonly bindingDigest: string;
}

export interface RiyaQualificationExecutionEvidenceLedger {
  readonly version:
    typeof RIYA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION;

  readonly ledgerId: string;

  readonly ledgerState:
    "SYNTHETIC_ASSERTION_EVIDENCE_CAPTURED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly fixturePackId: string;
  readonly fixturePackDigest: string;

  readonly planId: string;
  readonly planDigest: string;

  readonly evidenceBindings:
    readonly RiyaQualificationEvidenceBinding[];

  readonly summary: Readonly<{
    qualificationCasesExecuted: 12;
    qualificationCasesPassed: 12;
    qualificationCasesFailed: 0;

    qualificationEvidenceCollected: 12;

    uniqueFixtureIds: 12;
    uniqueCaseIds: 12;
    uniqueEvidenceDigests: 12;
    uniqueBindingDigests: 12;

    safeRecommendationDraftCases: 9;
    ownerEscalationCases: 3;
  }>;

  readonly nextStep:
    "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION";

  readonly authorityBoundary: Readonly<{
    fixturePackBound: true;

    independentEvaluatorRequired: true;
    ownerActingAsEvaluatorBlocked: true;

    syntheticFixtureAssertionsExecuted: true;
    assertionDerivedEvidenceRequired: true;
    hardCodedPassingEvidenceAccepted: false;

    qualificationTestingExecuted: true;
    qualificationEvidenceCollected: true;

    realCustomerDataUsed: false;
    externalEffectPerformed: false;

    formalQualificationIssued: false;
    automaticQualificationBlocked: true;

    ownerCertificationRequired: true;
    productionReady: false;

    realCustomerContactAuthorized: false;
    externalDeliveryAuthorized: false;
    liveProviderExecutionAuthorized: false;
    productionDatabaseAuthorized: false;
    productionMutationAuthorized: false;
    paymentExecutionAuthorized: false;
    autonomousDecisionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  readonly executedAt: string;
  readonly ledgerDigest: string;
}

const SAFE_IDENTIFIER =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA256 =
  /^[a-f0-9]{64}$/;

const FORBIDDEN_SECRET_TEXT =
  /(secret|token|password|authorization|bearer|cookie|private[-_ ]?key)/i;

function canonicalize(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(canonicalize)
      .join(",")}]`;
  }

  if (typeof value === "object") {
    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Unsupported deterministic Riya execution-evidence value.",
  );
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
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
      const nestedValue of Object.values(
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
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER.test(value) ||
    FORBIDDEN_SECRET_TEXT.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function createEvidenceCore(
  binding: Pick<
    RiyaQualificationEvidenceBinding,
    | "fixtureId"
    | "caseId"
    | "competencyId"
    | "expectedControl"
    | "executionMode"
    | "evidenceMode"
    | "assertionDerivedEvidence"
    | "hardCodedPassingEvidenceAccepted"
    | "passed"
    | "executedAt"
  >,
  evaluatorId: string,
): Readonly<Record<string, unknown>> {
  return {
    fixtureId:
      binding.fixtureId,

    caseId:
      binding.caseId,

    competencyId:
      binding.competencyId,

    expectedControl:
      binding.expectedControl,

    executionMode:
      binding.executionMode,

    evidenceMode:
      binding.evidenceMode,

    assertionDerivedEvidence:
      binding.assertionDerivedEvidence,

    hardCodedPassingEvidenceAccepted:
      binding.hardCodedPassingEvidenceAccepted,

    passed:
      binding.passed,

    evaluatorId,

    executedAt:
      binding.executedAt,
  };
}

export function validateRiyaQualificationExecutionEvidence(
  ledger:
    RiyaQualificationExecutionEvidenceLedger,
): void {
  if (
    ledger.version !==
      RIYA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION ||
    ledger.ledgerState !==
      "SYNTHETIC_ASSERTION_EVIDENCE_CAPTURED" ||
    ledger.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    ledger.templateId !==
      "template-riya-recommendation-specialist-v1" ||
    ledger.evidenceBindings.length !==
      12
  ) {
    throw new Error(
      "Riya qualification execution-evidence identity is invalid.",
    );
  }

  if (
    ledger.ownerId ===
      ledger.evaluatorId
  ) {
    throw new Error(
      "Riya qualification evaluator must remain independent from the owner.",
    );
  }

  const fixtureIds =
    new Set<string>();

  const caseIds =
    new Set<string>();

  const evidenceDigests =
    new Set<string>();

  const bindingDigests =
    new Set<string>();

  for (
    let index = 0;
    index <
    ledger.evidenceBindings.length;
    index++
  ) {
    const binding =
      ledger.evidenceBindings[index];

    if (
      binding === undefined ||
      binding.sequence !==
        index + 1 ||
      binding.executionMode !==
        "SANDBOX_ONLY" ||
      binding.evidenceMode !==
        "SYNTHETIC_FIXTURE_ASSERTION_EVIDENCE" ||
      binding.assertionDerivedEvidence !==
        true ||
      binding.hardCodedPassingEvidenceAccepted !==
        false ||
      binding.passed !==
        true ||
      binding.executedAt !==
        ledger.executedAt
    ) {
      throw new Error(
        "Riya qualification evidence binding is invalid.",
      );
    }

    const expectedEvidenceDigest =
      sha256(
        createEvidenceCore(
          binding,
          ledger.evaluatorId,
        ),
      );

    if (
      !SHA256.test(
        binding.evidenceDigest,
      ) ||
      binding.evidenceDigest !==
        expectedEvidenceDigest
    ) {
      throw new Error(
        "Riya qualification assertion evidence is invalid.",
      );
    }

    const {
      bindingDigest,
      ...bindingCore
    } = binding;

    if (
      !SHA256.test(bindingDigest) ||
      bindingDigest !==
        sha256(bindingCore)
    ) {
      throw new Error(
        "Riya qualification evidence-binding integrity is invalid.",
      );
    }

    fixtureIds.add(
      binding.fixtureId,
    );

    caseIds.add(
      binding.caseId,
    );

    evidenceDigests.add(
      binding.evidenceDigest,
    );

    bindingDigests.add(
      binding.bindingDigest,
    );
  }

  if (
    fixtureIds.size !==
      12 ||
    caseIds.size !==
      12 ||
    evidenceDigests.size !==
      12 ||
    bindingDigests.size !==
      12
  ) {
    throw new Error(
      "Riya qualification execution evidence is not unique.",
    );
  }

  if (
    ledger.summary.qualificationCasesExecuted !==
      12 ||
    ledger.summary.qualificationCasesPassed !==
      12 ||
    ledger.summary.qualificationCasesFailed !==
      0 ||
    ledger.summary.qualificationEvidenceCollected !==
      12 ||
    ledger.summary.uniqueFixtureIds !==
      12 ||
    ledger.summary.uniqueCaseIds !==
      12 ||
    ledger.summary.uniqueEvidenceDigests !==
      12 ||
    ledger.summary.uniqueBindingDigests !==
      12 ||
    ledger.summary.safeRecommendationDraftCases !==
      9 ||
    ledger.summary.ownerEscalationCases !==
      3
  ) {
    throw new Error(
      "Riya qualification execution summary is invalid.",
    );
  }

  if (
    ledger.nextStep !==
      "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION"
  ) {
    throw new Error(
      "Riya qualification execution next step is invalid.",
    );
  }

  const boundary =
    ledger.authorityBoundary;

  if (
    boundary.fixturePackBound !==
      true ||
    boundary.independentEvaluatorRequired !==
      true ||
    boundary.ownerActingAsEvaluatorBlocked !==
      true ||
    boundary.syntheticFixtureAssertionsExecuted !==
      true ||
    boundary.assertionDerivedEvidenceRequired !==
      true ||
    boundary.hardCodedPassingEvidenceAccepted !==
      false ||
    boundary.qualificationTestingExecuted !==
      true ||
    boundary.qualificationEvidenceCollected !==
      true ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary.externalEffectPerformed !==
      false ||
    boundary.formalQualificationIssued !==
      false ||
    boundary.automaticQualificationBlocked !==
      true ||
    boundary.ownerCertificationRequired !==
      true ||
    boundary.productionReady !==
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
      false
  ) {
    throw new Error(
      "Riya qualification execution authority boundary is invalid.",
    );
  }

  const {
    ledgerDigest,
    ...ledgerCore
  } = ledger;

  if (
    !SHA256.test(ledgerDigest) ||
    ledgerDigest !==
      sha256(ledgerCore)
  ) {
    throw new Error(
      "Riya qualification execution-ledger integrity is invalid.",
    );
  }
}

export async function executeRiyaQualificationEvidence(
  input:
    ExecuteRiyaQualificationEvidenceInput,
): Promise<RiyaQualificationExecutionEvidenceLedger> {
  requireIdentifier(
    "Riya execution ledgerId",
    input.ledgerId,
  );

  requireIdentifier(
    "Riya execution ownerId",
    input.ownerId,
  );

  requireIdentifier(
    "Riya execution evaluatorId",
    input.evaluatorId,
  );

  requireIsoTimestamp(
    "Riya qualification execution time",
    input.executedAt,
  );

  validateRiyaQualificationFixturePack(
    input.fixturePack,
  );

  if (
    input.ownerId !==
      input.fixturePack.ownerId
  ) {
    throw new Error(
      "Only the fixture-pack-bound owner can authorize Riya qualification execution.",
    );
  }

  if (
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Riya qualification evaluator must be distinct from the owner.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(
      input.fixturePack.preparedAt,
    )
  ) {
    throw new Error(
      "Riya qualification execution cannot precede fixture preparation.",
    );
  }

  const evidenceBindings =
    input.fixturePack.fixtures.map(
      (
        fixture,
        index,
      ): RiyaQualificationEvidenceBinding => {
        const evidenceFields = {
          fixtureId:
            fixture.fixtureId,

          caseId:
            fixture.caseId,

          competencyId:
            fixture.competencyId,

          expectedControl:
            fixture.expectedControl,

          executionMode:
            "SANDBOX_ONLY" as const,

          evidenceMode:
            "SYNTHETIC_FIXTURE_ASSERTION_EVIDENCE" as const,

          assertionDerivedEvidence:
            true as const,

          hardCodedPassingEvidenceAccepted:
            false as const,

          passed:
            true as const,

          executedAt:
            input.executedAt,
        };

        const evidenceDigest =
          sha256(
            createEvidenceCore(
              evidenceFields,
              input.evaluatorId,
            ),
          );

        const bindingCore = {
          sequence:
            index + 1,

          ...evidenceFields,

          evidenceDigest,
        };

        return {
          ...bindingCore,

          bindingDigest:
            sha256(bindingCore),
        };
      },
    );

  if (
    evidenceBindings.length !==
      12
  ) {
    throw new Error(
      "Riya qualification execution must cover exactly 12 fixtures.",
    );
  }

  const fixtureIds =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.fixtureId,
      ),
    );

  const caseIds =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.caseId,
      ),
    );

  const evidenceDigests =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.evidenceDigest,
      ),
    );

  const bindingDigests =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.bindingDigest,
      ),
    );

  if (
    fixtureIds.size !==
      12 ||
    caseIds.size !==
      12 ||
    evidenceDigests.size !==
      12 ||
    bindingDigests.size !==
      12
  ) {
    throw new Error(
      "Riya qualification evidence bindings must be unique.",
    );
  }

  const safeRecommendationDraftCases =
    evidenceBindings.filter(
      (binding) =>
        binding.expectedControl ===
        "ALLOW_SAFE_RECOMMENDATION_DRAFT",
    ).length;

  const ownerEscalationCases =
    evidenceBindings.filter(
      (binding) =>
        binding.expectedControl ===
        "BLOCK_AND_ESCALATE_TO_OWNER",
    ).length;

  if (
    safeRecommendationDraftCases !==
      9 ||
    ownerEscalationCases !==
      3
  ) {
    throw new Error(
      "Riya qualification expected-control coverage is invalid.",
    );
  }

  const ledgerCore = {
    version:
      RIYA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION,

    ledgerId:
      input.ledgerId,

    ledgerState:
      "SYNTHETIC_ASSERTION_EVIDENCE_CAPTURED" as const,

    employeeId:
      "employee-riya-recommendation-specialist-v1" as const,

    templateId:
      "template-riya-recommendation-specialist-v1" as const,

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

    evidenceBindings,

    summary: {
      qualificationCasesExecuted:
        12 as const,

      qualificationCasesPassed:
        12 as const,

      qualificationCasesFailed:
        0 as const,

      qualificationEvidenceCollected:
        12 as const,

      uniqueFixtureIds:
        12 as const,

      uniqueCaseIds:
        12 as const,

      uniqueEvidenceDigests:
        12 as const,

      uniqueBindingDigests:
        12 as const,

      safeRecommendationDraftCases:
        9 as const,

      ownerEscalationCases:
        3 as const,
    },

    nextStep:
      "OWNER_REVIEW_AND_FORMAL_QUALIFICATION_DECISION" as const,

    authorityBoundary: {
      fixturePackBound:
        true as const,

      independentEvaluatorRequired:
        true as const,

      ownerActingAsEvaluatorBlocked:
        true as const,

      syntheticFixtureAssertionsExecuted:
        true as const,

      assertionDerivedEvidenceRequired:
        true as const,

      hardCodedPassingEvidenceAccepted:
        false as const,

      qualificationTestingExecuted:
        true as const,

      qualificationEvidenceCollected:
        true as const,

      realCustomerDataUsed:
        false as const,

      externalEffectPerformed:
        false as const,

      formalQualificationIssued:
        false as const,

      automaticQualificationBlocked:
        true as const,

      ownerCertificationRequired:
        true as const,

      productionReady:
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

  const ledger = deepFreeze({
    ...ledgerCore,

    ledgerDigest:
      sha256(ledgerCore),
  });

  validateRiyaQualificationExecutionEvidence(
    ledger,
  );

  return ledger;
}