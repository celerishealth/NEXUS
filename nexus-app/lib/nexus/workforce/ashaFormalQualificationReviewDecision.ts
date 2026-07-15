import {
  createHash,
} from "node:crypto";

import {
  AI_EMPLOYEE_QUALIFICATION_CATEGORIES,
  AI_EMPLOYEE_QUALIFICATION_MINIMUMS,
} from "./employeeQualification";

import {
  ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION,
  type AshaQualificationExecutionEvidenceLedger,
} from "./ashaQualificationExecutionEvidence";

export const ASHA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION =
  "nexus-asha-formal-qualification-review-decision-v1" as const;

export type AshaFormalQualificationReviewOutcome =
  | "APPROVE_FORMAL_QUALIFICATION"
  | "REJECT_FORMAL_QUALIFICATION";

export interface CreateAshaFormalQualificationReviewDecisionInput {
  readonly decisionId: string;
  readonly evidenceLedger:
    AshaQualificationExecutionEvidenceLedger;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly outcome:
    AshaFormalQualificationReviewOutcome;
  readonly rationale: string;
  readonly reviewedAt: string;
}

export interface AshaFormalQualificationReviewDecision {
  readonly version:
    typeof ASHA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION;
  readonly decisionId: string;
  readonly decisionState:
    | "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
    | "FORMAL_QUALIFICATION_REJECTED";
  readonly employeeId: string;
  readonly templateId: string;
  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly evidenceLedgerId: string;
  readonly evidenceLedgerDigest: string;
  readonly fixturePackDigest: string;
  readonly planDigest: string;
  readonly independentEvaluationReportDigest: string;
  readonly outcome:
    AshaFormalQualificationReviewOutcome;
  readonly rationale: string;
  readonly evidenceSummary: Readonly<{
    independentHarnessCasesExecuted: 400;
    independentHarnessCasesPassed: 400;
    foundationCasesExecuted: 100;
    foundationCasesPassed: 100;
    specialistCasesExecuted: 300;
    specialistCasesPassed: 300;
    qualificationCasesExecuted: 100;
    qualificationCasesPassed: 100;
    qualificationCasesFailed: 0;
    qualificationEvidenceCount: 100;
    uniqueQualificationCaseIds: 100;
    uniqueQualificationEvidenceDigests: 100;
    assertionDerivedEvidence: true;
    hardCodedPassingEvidenceAccepted: false;
  }>;
  readonly nextStep:
    | "INVOKE_FORMAL_QUALIFICATION_ENGINE"
    | "RETURN_TO_CONTROLLED_REQUALIFICATION";
  readonly authorityBoundary: Readonly<{
    executionEvidenceBound: true;
    independentEvaluatorEvidenceVerified: true;
    ownerReviewRequired: true;
    ownerDecisionRecorded: true;
    formalQualificationEngineInvocationAuthorized: boolean;
    qualificationEngineInvoked: false;
    qualificationReportCreated: false;
    formalQualificationIssued: false;
    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    ownerActivationRecorded: false;
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
  readonly reviewedAt: string;
  readonly decisionDigest: string;
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
      "Unsupported deterministic qualification-review value.",
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

function requireRationale(
  value: string,
): string {
  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "Formal qualification rationale is required.",
    );
  }

  const normalized =
    value.trim();

  if (
    normalized.length < 20 ||
    normalized.length > 500
  ) {
    throw new Error(
      "Formal qualification rationale must contain 20 to 500 characters.",
    );
  }

  return normalized;
}

function validateExecutionEvidence(
  ledger:
    AshaQualificationExecutionEvidenceLedger,
): void {
  if (
    ledger.version !==
      ASHA_QUALIFICATION_EXECUTION_EVIDENCE_VERSION ||
    ledger.ledgerState !==
      "INDEPENDENT_ASSERTION_EVIDENCE_CAPTURED"
  ) {
    throw new Error(
      "Asha qualification execution-evidence state is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "ledgerId",
        ledger.ledgerId,
      ],
      [
        "employeeId",
        ledger.employeeId,
      ],
      [
        "templateId",
        ledger.templateId,
      ],
      [
        "tenantId",
        ledger.tenantId,
      ],
      [
        "ownerId",
        ledger.ownerId,
      ],
      [
        "evaluatorId",
        ledger.evaluatorId,
      ],
      [
        "fixturePackId",
        ledger.fixturePackId,
      ],
      [
        "planId",
        ledger.planId,
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
        "execution ledger digest",
        ledger.ledgerDigest,
      ],
      [
        "fixture-pack digest",
        ledger.fixturePackDigest,
      ],
      [
        "qualification plan digest",
        ledger.planDigest,
      ],
      [
        "independent evaluation report digest",
        ledger
          .independentEvaluationReportDigest,
      ],
    ] as const
  ) {
    requireSha256(
      label,
      value,
    );
  }

  requireIsoDate(
    "qualification execution time",
    ledger.executedAt,
  );

  if (
    ledger.ownerId ===
      ledger.evaluatorId
  ) {
    throw new Error(
      "Qualification owner and independent evaluator must remain distinct.",
    );
  }

  if (
    ledger.harnessExecution
      .totalCases !== 400 ||
    ledger.harnessExecution
      .passedCases !== 400 ||
    ledger.harnessExecution
      .foundationCases !== 100 ||
    ledger.harnessExecution
      .foundationPassedCases !== 100 ||
    ledger.harnessExecution
      .specialistCases !== 300 ||
    ledger.harnessExecution
      .specialistPassedCases !== 300 ||
    ledger.harnessExecution
      .assertionDerivedEvidence !== true ||
    ledger.harnessExecution
      .everyCaseExecuted !== true ||
    ledger.harnessExecution
      .everyCasePassed !== true ||
    ledger.harnessExecution
      .failedAssertionBlocksReport !== true ||
    ledger.harnessExecution
      .duplicateEvidenceBlocked !== true
  ) {
    throw new Error(
      "Independent qualification harness evidence is incomplete.",
    );
  }

  if (
    ledger.evidenceBindings.length !== 100 ||
    ledger.qualificationCases.length !== 100 ||
    ledger.summary
      .qualificationCasesExecuted !== 100 ||
    ledger.summary
      .qualificationCasesPassed !== 100 ||
    ledger.summary
      .qualificationCasesFailed !== 0 ||
    ledger.summary
      .qualificationEvidenceCollected !== 100 ||
    ledger.summary
      .uniqueQualificationCaseIds !== 100 ||
    ledger.summary
      .uniqueQualificationEvidenceDigests !== 100
  ) {
    throw new Error(
      "Qualification execution evidence summary is incomplete.",
    );
  }

  const qualificationCaseIds =
    new Set<string>();

  const qualificationEvidenceDigests =
    new Set<string>();

  for (
    const qualificationCase of
    ledger.qualificationCases
  ) {
    requireIdentifier(
      "qualification caseId",
      qualificationCase.caseId,
    );

    requireSha256(
      "qualification evidence digest",
      qualificationCase.evidenceDigest,
    );

    requireIsoDate(
      "qualification case execution time",
      qualificationCase.executedAt,
    );

    if (
      qualificationCase.passed !== true ||
      qualificationCase.executedAt !==
        ledger.executedAt
    ) {
      throw new Error(
        "Qualification case evidence is not a verified passing execution.",
      );
    }

    qualificationCaseIds.add(
      qualificationCase.caseId,
    );

    qualificationEvidenceDigests.add(
      qualificationCase.evidenceDigest,
    );
  }

  if (
    qualificationCaseIds.size !== 100 ||
    qualificationEvidenceDigests.size !== 100
  ) {
    throw new Error(
      "Qualification execution evidence contains duplicate identity or evidence.",
    );
  }

  for (
    const category of
    AI_EMPLOYEE_QUALIFICATION_CATEGORIES
  ) {
    const count =
      ledger.qualificationCases.filter(
        (qualificationCase) =>
          qualificationCase.category ===
          category,
      ).length;

    if (
      count !==
      AI_EMPLOYEE_QUALIFICATION_MINIMUMS[
        category
      ]
    ) {
      throw new Error(
        "Qualification execution category coverage is incomplete.",
      );
    }
  }

  if (
    ledger.authorityBoundary
      .fixturePackBound !== true ||
    ledger.authorityBoundary
      .independentEvaluationHarnessExecuted !== true ||
    ledger.authorityBoundary
      .assertionDerivedEvidenceRequired !== true ||
    ledger.authorityBoundary
      .hardCodedPassingEvidenceAccepted !== false ||
    ledger.authorityBoundary
      .fixtureBoundaryMappingsCreated !== true ||
    ledger.authorityBoundary
      .syntheticFixturePayloadExecutedAgainstProduction !== false ||
    ledger.authorityBoundary
      .qualificationTestingExecuted !== true ||
    ledger.authorityBoundary
      .qualificationEvidenceCollected !== true ||
    ledger.authorityBoundary
      .qualificationEngineInvoked !== false ||
    ledger.authorityBoundary
      .qualificationReportCreated !== false ||
    ledger.authorityBoundary
      .formalQualificationIssued !== false ||
    ledger.authorityBoundary
      .qualifiedManifestCreated !== false ||
    ledger.authorityBoundary
      .activationCandidateCreated !== false ||
    ledger.authorityBoundary
      .runtimeActivated !== false ||
    ledger.authorityBoundary
      .ownerCertificationRequired !== true ||
    ledger.authorityBoundary
      .shadowModeRequired !== true ||
    ledger.authorityBoundary
      .controlledPilotRequired !== true ||
    ledger.authorityBoundary
      .customerDataAccessAuthorized !== false ||
    ledger.authorityBoundary
      .customerContactAuthorized !== false ||
    ledger.authorityBoundary
      .externalDeliveryAuthorized !== false ||
    ledger.authorityBoundary
      .liveProviderExecutionAuthorized !== false ||
    ledger.authorityBoundary
      .productionDatabaseAuthorized !== false ||
    ledger.authorityBoundary
      .productionMutationAuthorized !== false ||
    ledger.authorityBoundary
      .paymentExecutionAuthorized !== false ||
    ledger.authorityBoundary
      .autonomousDecisionAuthorized !== false ||
    ledger.authorityBoundary
      .productionReadinessAuthorized !== false ||
    ledger.authorityBoundary
      .publicLaunchAuthorized !== false
  ) {
    throw new Error(
      "Qualification execution authority boundary is invalid.",
    );
  }

  const {
    ledgerDigest,
    ...ledgerCore
  } = ledger;

  if (
    sha256(ledgerCore) !==
      ledgerDigest
  ) {
    throw new Error(
      "Qualification execution ledger digest is invalid.",
    );
  }
}

export function createAshaFormalQualificationReviewDecision(
  input:
    CreateAshaFormalQualificationReviewDecisionInput,
): AshaFormalQualificationReviewDecision {
  requireIdentifier(
    "formal qualification decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "formal qualification tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "formal qualification ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "formal qualification review time",
    input.reviewedAt,
  );

  const rationale =
    requireRationale(
      input.rationale,
    );

  validateExecutionEvidence(
    input.evidenceLedger,
  );

  if (
    input.tenantId !==
      input.evidenceLedger.tenantId
  ) {
    throw new Error(
      "Cross-tenant formal qualification review is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.evidenceLedger.ownerId
  ) {
    throw new Error(
      "Only the evidence-bound owner can record the formal qualification decision.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
    Date.parse(
      input.evidenceLedger.executedAt,
    )
  ) {
    throw new Error(
      "Formal qualification review cannot precede evidence execution.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_FORMAL_QUALIFICATION" &&
    input.outcome !==
      "REJECT_FORMAL_QUALIFICATION"
  ) {
    throw new Error(
      "Formal qualification review outcome is invalid.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_FORMAL_QUALIFICATION";

  const decisionCore = {
    version:
      ASHA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      approved
        ? "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED" as const
        : "FORMAL_QUALIFICATION_REJECTED" as const,
    employeeId:
      input.evidenceLedger.employeeId,
    templateId:
      input.evidenceLedger.templateId,
    tenantId:
      input.tenantId,
    ownerId:
      input.ownerId,
    evaluatorId:
      input.evidenceLedger.evaluatorId,
    evidenceLedgerId:
      input.evidenceLedger.ledgerId,
    evidenceLedgerDigest:
      input.evidenceLedger.ledgerDigest,
    fixturePackDigest:
      input.evidenceLedger
        .fixturePackDigest,
    planDigest:
      input.evidenceLedger.planDigest,
    independentEvaluationReportDigest:
      input.evidenceLedger
        .independentEvaluationReportDigest,
    outcome:
      input.outcome,
    rationale,
    evidenceSummary: {
      independentHarnessCasesExecuted:
        400 as const,
      independentHarnessCasesPassed:
        400 as const,
      foundationCasesExecuted:
        100 as const,
      foundationCasesPassed:
        100 as const,
      specialistCasesExecuted:
        300 as const,
      specialistCasesPassed:
        300 as const,
      qualificationCasesExecuted:
        100 as const,
      qualificationCasesPassed:
        100 as const,
      qualificationCasesFailed:
        0 as const,
      qualificationEvidenceCount:
        100 as const,
      uniqueQualificationCaseIds:
        100 as const,
      uniqueQualificationEvidenceDigests:
        100 as const,
      assertionDerivedEvidence:
        true as const,
      hardCodedPassingEvidenceAccepted:
        false as const,
    },
    nextStep:
      approved
        ? "INVOKE_FORMAL_QUALIFICATION_ENGINE" as const
        : "RETURN_TO_CONTROLLED_REQUALIFICATION" as const,
    authorityBoundary: {
      executionEvidenceBound:
        true,
      independentEvaluatorEvidenceVerified:
        true,
      ownerReviewRequired:
        true,
      ownerDecisionRecorded:
        true,
      formalQualificationEngineInvocationAuthorized:
        approved,
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
      ownerActivationRecorded:
        false,
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
    reviewedAt:
      input.reviewedAt,
  };

  const decision:
    AshaFormalQualificationReviewDecision = {
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
  };

  return deepFreeze(
    decision,
  ) as AshaFormalQualificationReviewDecision;
}