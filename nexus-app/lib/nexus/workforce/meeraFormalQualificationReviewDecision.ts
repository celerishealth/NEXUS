import {
  createHash,
} from "node:crypto";

import {
  validateMeeraQualificationExecutionEvidence,
  type MeeraQualificationExecutionEvidenceLedger,
} from "./meeraQualificationExecutionEvidence";

export const MEERA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION =
  "nexus-meera-formal-qualification-review-decision-v1" as const;

export type MeeraFormalQualificationReviewOutcome =
  | "APPROVE_FORMAL_QUALIFICATION"
  | "REJECT_FORMAL_QUALIFICATION";

export interface CreateMeeraFormalQualificationReviewDecisionInput {
  readonly decisionId: string;

  readonly evidenceLedger:
    MeeraQualificationExecutionEvidenceLedger;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly outcome:
    MeeraFormalQualificationReviewOutcome;

  readonly rationale: string;
  readonly reviewedAt: string;
}

export interface MeeraFormalQualificationReviewDecision {
  readonly version:
    typeof MEERA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    | "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
    | "FORMAL_QUALIFICATION_REJECTED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly evidenceLedgerId: string;
  readonly evidenceLedgerDigest: string;

  readonly fixturePackDigest: string;
  readonly planDigest: string;

  readonly outcome:
    MeeraFormalQualificationReviewOutcome;

  readonly rationale: string;

  readonly evidenceSummary: Readonly<{
    qualificationCasesExecuted: 12;
    qualificationCasesPassed: 12;
    qualificationCasesFailed: 0;

    qualificationEvidenceCount: 12;

    uniqueFixtureIds: 12;
    uniqueCaseIds: 12;
    uniqueEvidenceDigests: 12;
    uniqueBindingDigests: 12;

    safeQuotationProposalDraftCases: 9;
    ownerEscalationCases: 3;

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

    formalQualificationEngineInvocationAuthorized:
      boolean;

    qualificationEngineInvoked: false;
    qualificationReportCreated: false;
    formalQualificationIssued: false;

    qualifiedManifestCreated: false;
    activationCandidateCreated: false;
    runtimeActivated: false;
    ownerActivationRecorded: false;

    realCustomerDataAccessAuthorized: false;
    realCustomerContactAuthorized: false;
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
    "Unsupported deterministic Meera formal-review value.",
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
  value: string,
): void {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      "Meera formal qualification review time must be an exact ISO timestamp.",
    );
  }
}

function requireRationale(
  value: string,
): string {
  const rationale =
    typeof value === "string"
      ? value.trim()
      : "";

  if (
    rationale.length < 20 ||
    rationale.length > 500 ||
    FORBIDDEN_SECRET_TEXT.test(rationale)
  ) {
    throw new Error(
      "Meera formal qualification review requires a meaningful safe rationale.",
    );
  }

  return rationale;
}

export function validateMeeraFormalQualificationReviewDecision(
  decision:
    MeeraFormalQualificationReviewDecision,
): void {
  if (
    decision.version !==
      MEERA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION ||
    decision.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    decision.templateId !==
      "template-meera-quotation-proposal-specialist-v1"
  ) {
    throw new Error(
      "Meera formal qualification review identity is invalid.",
    );
  }

  const approved =
    decision.outcome ===
      "APPROVE_FORMAL_QUALIFICATION";

  if (
    decision.outcome !==
      "APPROVE_FORMAL_QUALIFICATION" &&
    decision.outcome !==
      "REJECT_FORMAL_QUALIFICATION"
  ) {
    throw new Error(
      "Meera formal qualification review outcome is invalid.",
    );
  }

  if (
    decision.decisionState !==
      (
        approved
          ? "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED"
          : "FORMAL_QUALIFICATION_REJECTED"
      ) ||
    decision.nextStep !==
      (
        approved
          ? "INVOKE_FORMAL_QUALIFICATION_ENGINE"
          : "RETURN_TO_CONTROLLED_REQUALIFICATION"
      )
  ) {
    throw new Error(
      "Meera formal qualification review state is invalid.",
    );
  }

  if (
    !SHA256.test(
      decision.evidenceLedgerDigest,
    ) ||
    !SHA256.test(
      decision.fixturePackDigest,
    ) ||
    !SHA256.test(
      decision.planDigest,
    )
  ) {
    throw new Error(
      "Meera formal qualification source evidence is invalid.",
    );
  }

  const summary =
    decision.evidenceSummary;

  if (
    summary.qualificationCasesExecuted !==
      12 ||
    summary.qualificationCasesPassed !==
      12 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCount !==
      12 ||
    summary.uniqueFixtureIds !==
      12 ||
    summary.uniqueCaseIds !==
      12 ||
    summary.uniqueEvidenceDigests !==
      12 ||
    summary.uniqueBindingDigests !==
      12 ||
    summary.safeQuotationProposalDraftCases !==
      9 ||
    summary.ownerEscalationCases !==
      3 ||
    summary.assertionDerivedEvidence !==
      true ||
    summary.hardCodedPassingEvidenceAccepted !==
      false
  ) {
    throw new Error(
      "Meera formal qualification evidence summary is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.executionEvidenceBound !==
      true ||
    boundary.independentEvaluatorEvidenceVerified !==
      true ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.formalQualificationEngineInvocationAuthorized !==
      approved ||
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
    boundary.ownerActivationRecorded !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
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
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Meera formal qualification authority boundary is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    !SHA256.test(decisionDigest) ||
    decisionDigest !==
      sha256(decisionCore)
  ) {
    throw new Error(
      "Meera formal qualification review integrity is invalid.",
    );
  }
}

export function createMeeraFormalQualificationReviewDecision(
  input:
    CreateMeeraFormalQualificationReviewDecisionInput,
): MeeraFormalQualificationReviewDecision {
  requireIdentifier(
    "Meera formal qualification decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "Meera formal qualification tenantId",
    input.tenantId,
  );

  requireIdentifier(
    "Meera formal qualification ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    input.reviewedAt,
  );

  const rationale =
    requireRationale(
      input.rationale,
    );

  validateMeeraQualificationExecutionEvidence(
    input.evidenceLedger,
  );

  if (
    input.tenantId !==
      input.evidenceLedger.tenantId
  ) {
    throw new Error(
      "Cross-tenant Meera formal qualification review is blocked.",
    );
  }

  if (
    input.ownerId !==
      input.evidenceLedger.ownerId
  ) {
    throw new Error(
      "Only the evidence-bound owner can record the Meera formal qualification decision.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
    Date.parse(
      input.evidenceLedger.executedAt,
    )
  ) {
    throw new Error(
      "Meera formal qualification review cannot precede evidence execution.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_FORMAL_QUALIFICATION" &&
    input.outcome !==
      "REJECT_FORMAL_QUALIFICATION"
  ) {
    throw new Error(
      "Meera formal qualification review outcome is invalid.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_FORMAL_QUALIFICATION";

  const decisionCore = {
    version:
      MEERA_FORMAL_QUALIFICATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      approved
        ? "FORMAL_QUALIFICATION_ENGINE_ADMISSION_APPROVED" as const
        : "FORMAL_QUALIFICATION_REJECTED" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    templateId:
      "template-meera-quotation-proposal-specialist-v1" as const,

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
      input.evidenceLedger.fixturePackDigest,

    planDigest:
      input.evidenceLedger.planDigest,

    outcome:
      input.outcome,

    rationale,

    evidenceSummary: {
      qualificationCasesExecuted:
        12 as const,

      qualificationCasesPassed:
        12 as const,

      qualificationCasesFailed:
        0 as const,

      qualificationEvidenceCount:
        12 as const,

      uniqueFixtureIds:
        12 as const,

      uniqueCaseIds:
        12 as const,

      uniqueEvidenceDigests:
        12 as const,

      uniqueBindingDigests:
        12 as const,

      safeQuotationProposalDraftCases:
        9 as const,

      ownerEscalationCases:
        3 as const,

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
        true as const,

      independentEvaluatorEvidenceVerified:
        true as const,

      ownerReviewRequired:
        true as const,

      ownerDecisionRecorded:
        true as const,

      formalQualificationEngineInvocationAuthorized:
        approved,

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

      ownerActivationRecorded:
        false as const,

      realCustomerDataAccessAuthorized:
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

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    reviewedAt:
      input.reviewedAt,
  };

  const decision = deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  });

  validateMeeraFormalQualificationReviewDecision(
    decision,
  );

  return decision;
}
