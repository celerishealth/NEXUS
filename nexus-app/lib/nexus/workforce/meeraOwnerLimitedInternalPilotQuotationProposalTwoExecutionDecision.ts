import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalTwoPreparation,
  type MeeraLimitedInternalPilotQuotationProposalTwoPreparation,
} from "./meeraLimitedInternalPilotQuotationProposalTwoPreparation";

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION =
  "nexus-meera-owner-limited-internal-pilot-recommendation-two-execution-decision-v1" as const;

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION",
  "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY",
] as const;

export type MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecisionType =
  (
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISIONS
  )[number];

export interface CreateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecisionInput {
  readonly limitedInternalPilotQuotationProposalTwoPreparation:
    MeeraLimitedInternalPilotQuotationProposalTwoPreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision {
  readonly version:
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_RECORDED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly displayName:
    "Meera";

  readonly role:
    "AI Quotation & Proposal Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly sourceQuotationProposalReviewDecisionId:
    string;

  readonly sourceQuotationProposalReviewDecisionDigest:
    string;

  readonly sourceQuotationProposalExecutionId:
    string;

  readonly sourceQuotationProposalExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly sourcePilotPreparationId:
    string;

  readonly sourcePilotPreparationDigest:
    string;

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecisionType;

  readonly quotationProposalTwoExecutionAuthorized:
    boolean;

  readonly quotationProposalTwoExecutionPerformed:
    false;

  readonly reason:
    string;

  readonly reviewedPreparation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "MISSING_COMMERCIAL_EVIDENCE";

    quotationProposalSequence:
      2;

    priorReviewedQuotationProposalSequence:
      1;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacityBeforeExecution:
      2;

    projectedRemainingQuotationProposalCapacityAfterExecution:
      1;

    concurrentQuotationProposalLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_QUOTATION_PROPOSAL";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    recommendationEvidenceToolMode:
      "READ_ONLY";

    quotationProposalToolId:
      "tool-quotation-proposal-draft";

    quotationProposalToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    clarificationBeforeGuessingRequired:
      true;

    missingFactsMustBeExplicit:
      true;

    verifiedFactsSeparatedFromAssumptions:
      true;

    uncertaintyPreserved:
      true;

    practicalClarifyingQuestionsRequired:
      true;

    quotationProposalGenerationPerformed:
      false;

    ownerDecisionMade:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    sourcePreparationBound:
      true;

    sourcePreparationIntegrityVerified:
      true;

    sourceQuotationProposalReviewDecisionBound:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    ownerExecutionDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    quotationProposalOneReviewed:
      true;

    quotationProposalTwoPreparationPerformed:
      true;

    quotationProposalTwoExecutionAuthorized:
      boolean;

    quotationProposalTwoExecutionPerformed:
      false;

    concurrentQuotationProposalExecutionAuthorized:
      false;

    limitedInternalPilotCompleted:
      false;

    quotationProposalCustomerDeliveryAuthorized:
      false;

    realCustomerDataAccessAuthorized:
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

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    ownerReviewAfterEveryQuotationProposal:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO"
    | "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

type UnknownRecord =
  Record<string, unknown>;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /\b(secret|password|authorization|bearer|access[_ -]?token|api[_ -]?key|private[_ -]?key|session[_ -]?cookie)\b/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const EXPECTED_EMPLOYEE_ID =
  "employee-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-005" as const;

const EXPECTED_DISPLAY_NAME =
  "Meera" as const;

const EXPECTED_ROLE =
  "AI Quotation & Proposal Specialist" as const;

const EXPECTED_DEPARTMENT =
  "SALES" as const;

const EXPECTED_AUTONOMY_LEVEL =
  "DRAFTING_ASSISTANT" as const;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
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
      value as UnknownRecord;

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
      "Unsupported deterministic Meera quotation/proposal two execution decision value.",
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
            UnknownRecord
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

function requireSafeIdentifier(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  if (FORBIDDEN_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} contains prohibited credential-bearing content.`,
    );
  }
}

function requireDigest(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !Number.isFinite(
      Date.parse(value),
    ) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 20 ||
    value.length > 500 ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision reason must be safe and specific.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Meera quotation/proposal two execution decision reason contains prohibited secret-bearing content.",
    );
  }

  return value;
}

function verifyDigestBoundObject(
  label: string,
  value: unknown,
  digestField: string,
): void {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      `${label} must be an object.`,
    );
  }

  const record = {
    ...(
      value as UnknownRecord
    ),
  };

  const digest =
    record[digestField];

  requireDigest(
    `${label} digest`,
    digest,
  );

  delete record[digestField];

  if (
    digest !==
    sha256(record)
  ) {
    throw new Error(
      `${label} integrity verification failed.`,
    );
  }
}

function validateSourcePreparation(
  source:
    MeeraLimitedInternalPilotQuotationProposalTwoPreparation,
): void {
  validateMeeraLimitedInternalPilotQuotationProposalTwoPreparation(
    source,
  );

  if (
    source.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 98 Meera quotation/proposal two preparation is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 98 Meera quotation/proposal two preparation",
    source,
    "preparationDigest",
  );

  if (
    source.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    source.templateId !==
      EXPECTED_TEMPLATE_ID ||
    source.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    source.displayName !==
      EXPECTED_DISPLAY_NAME ||
    source.role !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Workforce Day 98 Meera identity is invalid.",
    );
  }

  const prepared =
    source.preparedQuotationProposal;

  if (
    prepared.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    prepared.scenarioId !==
      "MISSING_COMMERCIAL_EVIDENCE" ||
    prepared.quotationProposalSequence !==
      2 ||
    prepared.priorReviewedQuotationProposalSequence !==
      1 ||
    prepared.maximumQuotationProposalCount !==
      3 ||
    prepared.remainingQuotationProposalCapacityBeforeExecution !==
      2 ||
    prepared.projectedRemainingQuotationProposalCapacityAfterExecution !==
      1 ||
    prepared.concurrentQuotationProposalLimit !==
      1 ||
    prepared.failureThreshold !==
      1 ||
    prepared.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    prepared.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    prepared.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    prepared.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    prepared.quotationProposalToolId !==
      "tool-quotation-proposal-draft" ||
    prepared.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    prepared.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Workforce Day 98 Meera prepared recommendation scope is invalid.",
    );
  }

  const expectation =
    source.specialistExpectation;

  if (
    expectation.clarificationBeforeGuessingRequired !==
      true ||
    expectation.missingFactsMustBeExplicit !==
      true ||
    expectation.verifiedFactsSeparatedFromAssumptions !==
      true ||
    expectation.uncertaintyPreserved !==
      true ||
    expectation.practicalClarifyingQuestionsRequired !==
      true ||
    expectation.unsupportedClaimsProhibited !==
      true ||
    expectation.urgencyExaggerationProhibited !==
      true ||
    expectation.guaranteeProhibited !==
      true ||
    expectation.crossCustomerEvidenceProhibited !==
      true ||
    expectation.crossTenantContextProhibited !==
      true ||
    expectation.transparentAIIdentityRequired !==
      true ||
    expectation.quotationProposalGenerationPerformed !==
      false ||
    expectation.ownerDecisionMade !==
      false ||
    expectation.customerDeliveryPrepared !==
      false ||
    expectation.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Workforce Day 98 Meera specialist expectation is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourceQuotationProposalReviewDecisionBound !==
      true ||
    boundary.sourceQuotationProposalReviewDecisionIntegrityVerified !==
      true ||
    boundary.sourceQuotationProposalExecutionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.nextQuotationProposalPreparationAuthorized !==
      true ||
    boundary.quotationProposalTwoPreparationPerformed !==
      true ||
    boundary.quotationProposalTwoExecutionAuthorized !==
      false ||
    boundary.quotationProposalTwoExecutionPerformed !==
      false ||
    boundary.concurrentQuotationProposalExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.quotationProposalCustomerDeliveryAuthorized !==
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
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.ownerReviewAfterEveryQuotationProposal !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Workforce Day 98 Meera preparation authority boundary is invalid.",
    );
  }
}

export function validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
  decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision,
): void {
  requireSafeIdentifier(
    "Meera quotation/proposal two execution decision identity",
    decision.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two preparation identity",
    decision.preparationId,
  );

  requireSafeIdentifier(
    "Meera tenant identity",
    decision.tenantId,
  );

  requireSafeIdentifier(
    "Meera owner identity",
    decision.ownerId,
  );

  requireDigest(
    "Meera quotation/proposal two preparation digest",
    decision.preparationDigest,
  );

  requireDigest(
    "Meera source recommendation review decision digest",
    decision.sourceQuotationProposalReviewDecisionDigest,
  );

  requireDigest(
    "Meera source recommendation execution digest",
    decision.sourceQuotationProposalExecutionDigest,
  );

  requireDigest(
    "Meera owner execution decision digest",
    decision.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Meera source pilot preparation digest",
    decision.sourcePilotPreparationDigest,
  );

  requireDigest(
    "Meera controlled shadow execution digest",
    decision.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal two execution decision time",
    decision.decidedAt,
  );

  requireReason(
    decision.reason,
  );

  verifyDigestBoundObject(
    "Meera quotation/proposal two execution decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_RECORDED" ||
    decision.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    decision.templateId !==
      EXPECTED_TEMPLATE_ID ||
    decision.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    decision.displayName !==
      EXPECTED_DISPLAY_NAME ||
    decision.role !==
      EXPECTED_ROLE ||
    decision.department !==
      EXPECTED_DEPARTMENT ||
    decision.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION";

  if (
    decision.quotationProposalTwoExecutionAuthorized !==
      approved ||
    decision.quotationProposalTwoExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal two execution authority is invalid.",
    );
  }

  const reviewed =
    decision.reviewedPreparation;

  if (
    reviewed.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    reviewed.scenarioId !==
      "MISSING_COMMERCIAL_EVIDENCE" ||
    reviewed.quotationProposalSequence !==
      2 ||
    reviewed.priorReviewedQuotationProposalSequence !==
      1 ||
    reviewed.maximumQuotationProposalCount !==
      3 ||
    reviewed.remainingQuotationProposalCapacityBeforeExecution !==
      2 ||
    reviewed.projectedRemainingQuotationProposalCapacityAfterExecution !==
      1 ||
    reviewed.concurrentQuotationProposalLimit !==
      1 ||
    reviewed.failureThreshold !==
      1 ||
    reviewed.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    reviewed.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    reviewed.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    reviewed.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    reviewed.quotationProposalToolId !==
      "tool-quotation-proposal-draft" ||
    reviewed.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    reviewed.executionMode !==
      "SANDBOX_ONLY" ||
    reviewed.clarificationBeforeGuessingRequired !==
      true ||
    reviewed.missingFactsMustBeExplicit !==
      true ||
    reviewed.verifiedFactsSeparatedFromAssumptions !==
      true ||
    reviewed.uncertaintyPreserved !==
      true ||
    reviewed.practicalClarifyingQuestionsRequired !==
      true ||
    reviewed.quotationProposalGenerationPerformed !==
      false ||
    reviewed.ownerDecisionMade !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal two reviewed preparation is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.sourceQuotationProposalReviewDecisionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerExecutionDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.quotationProposalTwoPreparationPerformed !==
      true ||
    boundary.quotationProposalTwoExecutionAuthorized !==
      approved ||
    boundary.quotationProposalTwoExecutionPerformed !==
      false ||
    boundary.concurrentQuotationProposalExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.quotationProposalCustomerDeliveryAuthorized !==
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
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.ownerReviewAfterEveryQuotationProposal !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO"
      : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedPreparation,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision must be deeply frozen.",
    );
  }
}

export function createMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
  input:
    CreateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecisionInput,
): MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision {
  const source =
    input.limitedInternalPilotQuotationProposalTwoPreparation;

  validateSourcePreparation(
    source,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two execution decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two execution decision owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Meera quotation/proposal two execution decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Meera recommendation-two-preparation-bound owner can issue the execution decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION" &&
    input.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Meera quotation/proposal two execution decision cannot precede its preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION";

  const decisionCore = {
    version:
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_RECORDED" as const,

    employeeId:
      EXPECTED_EMPLOYEE_ID,

    templateId:
      EXPECTED_TEMPLATE_ID,

    employeeCode:
      EXPECTED_EMPLOYEE_CODE,

    displayName:
      EXPECTED_DISPLAY_NAME,

    role:
      EXPECTED_ROLE,

    department:
      EXPECTED_DEPARTMENT,

    autonomyLevel:
      EXPECTED_AUTONOMY_LEVEL,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceQuotationProposalReviewDecisionId:
      source.sourceQuotationProposalReviewDecisionId,

    sourceQuotationProposalReviewDecisionDigest:
      source.sourceQuotationProposalReviewDecisionDigest,

    sourceQuotationProposalExecutionId:
      source.sourceQuotationProposalExecutionId,

    sourceQuotationProposalExecutionDigest:
      source.sourceQuotationProposalExecutionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    sourcePilotPreparationId:
      source.sourcePilotPreparationId,

    sourcePilotPreparationDigest:
      source.sourcePilotPreparationDigest,

    controlledShadowExecutionId:
      source.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      source.controlledShadowExecutionDigest,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    quotationProposalTwoExecutionAuthorized:
      approved,

    quotationProposalTwoExecutionPerformed:
      false as const,

    reason,

    reviewedPreparation: {
      pilotClass:
        source.preparedQuotationProposal.pilotClass,

      scenarioId:
        source.preparedQuotationProposal.scenarioId,

      quotationProposalSequence:
        source.preparedQuotationProposal.quotationProposalSequence,

      priorReviewedQuotationProposalSequence:
        source.preparedQuotationProposal.priorReviewedQuotationProposalSequence,

      maximumQuotationProposalCount:
        source.preparedQuotationProposal.maximumQuotationProposalCount,

      remainingQuotationProposalCapacityBeforeExecution:
        source.preparedQuotationProposal.remainingQuotationProposalCapacityBeforeExecution,

      projectedRemainingQuotationProposalCapacityAfterExecution:
        source.preparedQuotationProposal.projectedRemainingQuotationProposalCapacityAfterExecution,

      concurrentQuotationProposalLimit:
        source.preparedQuotationProposal.concurrentQuotationProposalLimit,

      failureThreshold:
        source.preparedQuotationProposal.failureThreshold,

      ownerReviewFrequency:
        source.preparedQuotationProposal.ownerReviewFrequency,

      dataClassification:
        source.preparedQuotationProposal.dataClassification,

      inquiryEvidenceToolMode:
        source.preparedQuotationProposal.inquiryEvidenceToolMode,

      recommendationEvidenceToolMode:
        source.preparedQuotationProposal.recommendationEvidenceToolMode,

      quotationProposalToolId:
        source.preparedQuotationProposal.quotationProposalToolId,

      quotationProposalToolMode:
        source.preparedQuotationProposal.quotationProposalToolMode,

      executionMode:
        source.preparedQuotationProposal.executionMode,

      clarificationBeforeGuessingRequired:
        source.specialistExpectation.clarificationBeforeGuessingRequired,

      missingFactsMustBeExplicit:
        source.specialistExpectation.missingFactsMustBeExplicit,

      verifiedFactsSeparatedFromAssumptions:
        source.specialistExpectation.verifiedFactsSeparatedFromAssumptions,

      uncertaintyPreserved:
        source.specialistExpectation.uncertaintyPreserved,

      practicalClarifyingQuestionsRequired:
        source.specialistExpectation.practicalClarifyingQuestionsRequired,

      quotationProposalGenerationPerformed:
        source.specialistExpectation.quotationProposalGenerationPerformed,

      ownerDecisionMade:
        source.specialistExpectation.ownerDecisionMade,
    },

    authorityBoundary: {
      sourcePreparationBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      sourceQuotationProposalReviewDecisionBound:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      ownerExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      quotationProposalOneReviewed:
        true as const,

      quotationProposalTwoPreparationPerformed:
        true as const,

      quotationProposalTwoExecutionAuthorized:
        approved,

      quotationProposalTwoExecutionPerformed:
        false as const,

      concurrentQuotationProposalExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
        false as const,

      quotationProposalCustomerDeliveryAuthorized:
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

      monitoringRequired:
        true as const,

      ownerReviewAfterEveryQuotationProposal:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision;

  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
    decision,
  );

  return decision;
}
