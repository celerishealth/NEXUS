import {
  createHash,
} from "node:crypto";

import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision,
  type MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision,
} from "./meeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision";

export const MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION =
  "nexus-meera-limited-internal-pilot-quotation-proposal-three-preparation-v1" as const;

export interface CreateMeeraLimitedInternalPilotQuotationProposalThreePreparationInput {
  readonly preparationId:
    string;

  readonly ownerLimitedInternalPilotQuotationProposalTwoReviewDecision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision;

  readonly preparedAt:
    string;
}

export interface MeeraLimitedInternalPilotQuotationProposalThreePreparation {
  readonly version:
    typeof MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARED";

  readonly sourceQuotationProposalTwoReviewDecisionId:
    string;

  readonly sourceQuotationProposalTwoReviewDecisionDigest:
    string;

  readonly sourceQuotationProposalTwoExecutionId:
    string;

  readonly sourceQuotationProposalTwoExecutionDigest:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionId:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionDigest:
    string;

  readonly quotationProposalTwoPreparationId:
    string;

  readonly quotationProposalTwoPreparationDigest:
    string;

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

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

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly preparedQuotationProposal: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "CONFLICTING_COMMERCIAL_OPTIONS";

    quotationProposalSequence:
      3;

    priorReviewedQuotationProposalSequence:
      2;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacityBeforeExecution:
      1;

    projectedRemainingQuotationProposalCapacityAfterExecution:
      0;

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
  }>;

  readonly specialistExpectation: Readonly<{
    conflictingOptionsMustBeExplicit:
      true;

    optionsAndTradeoffsRequired:
      true;

    recommendationRationaleRequired:
      true;

    uncertaintyPreserved:
      true;

    riskLevelRequired:
      true;

    nextActionRequired:
      true;

    ownerDecisionMustRemainReserved:
      true;

    verifiedEvidenceOnly:
      true;

    unsupportedClaimsProhibited:
      true;

    urgencyExaggerationProhibited:
      true;

    guaranteeProhibited:
      true;

    crossCustomerContextProhibited:
      true;

    crossTenantContextProhibited:
      true;

    transparentAIIdentityRequired:
      true;

    quotationProposalGenerationPerformed:
      false;

    ownerDecisionMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    sourceQuotationProposalTwoReviewDecisionBound:
      true;

    sourceQuotationProposalTwoReviewDecisionIntegrityVerified:
      true;

    sourceQuotationProposalTwoExecutionBound:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    quotationProposalOneReviewed:
      true;

    quotationProposalTwoReviewed:
      true;

    nextQuotationProposalPreparationAuthorized:
      true;

    quotationProposalThreePreparationPerformed:
      true;

    quotationProposalThreeExecutionAuthorized:
      false;

    quotationProposalThreeExecutionPerformed:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION";

  readonly preparedAt:
    string;

  readonly preparationDigest:
    string;
}

type UnknownRecord =
  Record<string, unknown>;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

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
      "Unsupported deterministic Meera quotation/proposal two preparation value.",
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

function validateSourceReviewDecision(
  source:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision,
): void {
  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 101 Meera quotation/proposal two review decision",
    source,
    "decisionDigest",
  );

  if (
    source.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_RECORDED" ||
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
      EXPECTED_AUTONOMY_LEVEL ||
    source.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION" ||
    source.nextQuotationProposalPreparationApproved !==
      true ||
    source.quotationProposalThreeExecutionAuthorized !==
      false ||
    source.nextStep !==
      "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE"
  ) {
    throw new Error(
      "An approved Workforce Day 101 Meera quotation/proposal three preparation decision is required.",
    );
  }

  const evidence =
    source.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "MISSING_COMMERCIAL_EVIDENCE" ||
    evidence.reviewedQuotationProposalSequence !==
      2 ||
    evidence.maximumQuotationProposalCount !==
      3 ||
    evidence.remainingQuotationProposalCapacity !==
      1 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    evidence.recommendationOutcome !==
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    !Array.isArray(evidence.verifiedFacts) ||
    evidence.verifiedFacts.length ===
      0 ||
    !evidence.verifiedFacts.every(
      (fact) =>
        typeof fact === "string" &&
        fact.trim().length > 0,
    ) ||
    !Array.isArray(evidence.missingFacts) ||
    evidence.missingFacts.length ===
      0 ||
    !evidence.missingFacts.every(
      (fact) =>
        typeof fact === "string" &&
        fact.trim().length > 0,
    ) ||
    !Array.isArray(evidence.clarifyingQuestions) ||
    evidence.clarifyingQuestions.length ===
      0 ||
    !evidence.clarifyingQuestions.every(
      (question) =>
        typeof question === "string" &&
        question.trim().length > 0,
    ) ||
    evidence.assumptionsMade !==
      false ||
    evidence.missingFactsExplicit !==
      true ||
    evidence.verifiedFactsSeparatedFromAssumptions !==
      true ||
    evidence.uncertaintyPreserved !==
      true ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.crossCustomerEvidenceUsed !==
      false ||
    evidence.crossTenantEvidenceUsed !==
      false ||
    evidence.realCustomerDataUsed !==
      false ||
    evidence.crossCustomerContextUsed !==
      false ||
    evidence.crossTenantContextUsed !==
      false ||
    evidence.ownerDecisionMade !==
      false ||
    evidence.unsupportedClaimsIncluded !==
      false ||
    evidence.urgencyExaggerated !==
      false ||
    evidence.guaranteeMade !==
      false ||
    evidence.customerDeliveryPrepared !==
      false ||
    evidence.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Workforce Day 101 Meera reviewed evidence is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourceExecutionIntegrityVerified !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.quotationProposalTwoReviewed !==
      true ||
    boundary.nextQuotationProposalPreparationAuthorized !==
      true ||
    boundary.quotationProposalThreePreparationPerformed !==
      false ||
    boundary.quotationProposalThreeExecutionAuthorized !==
      false ||
    boundary.quotationProposalThreeExecutionPerformed !==
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
      "Workforce Day 101 Meera authority boundary is invalid.",
    );
  }
}
export function validateMeeraLimitedInternalPilotQuotationProposalThreePreparation(
  preparation:
    MeeraLimitedInternalPilotQuotationProposalThreePreparation,
): void {
  requireSafeIdentifier(
    "Meera quotation/proposal two preparation identity",
    preparation.preparationId,
  );

  requireSafeIdentifier(
    "Meera source quotation/proposal review decision identity",
    preparation.sourceQuotationProposalTwoReviewDecisionId,
  );

  requireSafeIdentifier(
    "Meera source recommendation execution identity",
    preparation.sourceQuotationProposalTwoExecutionId,
  );

  requireSafeIdentifier(
    "Meera owner execution decision identity",
    preparation.ownerQuotationProposalTwoExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Meera source pilot preparation identity",
    preparation.quotationProposalTwoPreparationId,
  );

  requireSafeIdentifier(
    "Meera controlled shadow execution identity",
    preparation.controlledShadowExecutionId,
  );

  requireSafeIdentifier(
    "Meera tenant identity",
    preparation.tenantId,
  );

  requireSafeIdentifier(
    "Meera owner identity",
    preparation.ownerId,
  );

  requireDigest(
    "Meera source quotation/proposal review decision digest",
    preparation.sourceQuotationProposalTwoReviewDecisionDigest,
  );

  requireDigest(
    "Meera source recommendation execution digest",
    preparation.sourceQuotationProposalTwoExecutionDigest,
  );

  requireDigest(
    "Meera owner execution decision digest",
    preparation.ownerQuotationProposalTwoExecutionDecisionDigest,
  );

  requireDigest(
    "Meera source pilot preparation digest",
    preparation.quotationProposalTwoPreparationDigest,
  );

  requireDigest(
    "Meera controlled shadow execution digest",
    preparation.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal two preparation time",
    preparation.preparedAt,
  );

  verifyDigestBoundObject(
    "Meera quotation/proposal two preparation",
    preparation,
    "preparationDigest",
  );

  if (
    preparation.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARED" ||
    preparation.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    preparation.templateId !==
      EXPECTED_TEMPLATE_ID ||
    preparation.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    preparation.displayName !==
      EXPECTED_DISPLAY_NAME ||
    preparation.role !==
      EXPECTED_ROLE ||
    preparation.department !==
      EXPECTED_DEPARTMENT ||
    preparation.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera quotation/proposal two preparation identity is invalid.",
    );
  }

  const prepared =
    preparation.preparedQuotationProposal;

  if (
    prepared.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    prepared.scenarioId !==
      "CONFLICTING_COMMERCIAL_OPTIONS" ||
    prepared.quotationProposalSequence !==
      3 ||
    prepared.priorReviewedQuotationProposalSequence !==
      2 ||
    prepared.maximumQuotationProposalCount !==
      3 ||
    prepared.remainingQuotationProposalCapacityBeforeExecution !==
      1 ||
    prepared.projectedRemainingQuotationProposalCapacityAfterExecution !==
      0 ||
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
      "Meera quotation/proposal two prepared scope is invalid.",
    );
  }

  const expectation =
    preparation.specialistExpectation;

  if (
    expectation.conflictingOptionsMustBeExplicit !==
      true ||
    expectation.optionsAndTradeoffsRequired !==
      true ||
    expectation.recommendationRationaleRequired !==
      true ||
    expectation.uncertaintyPreserved !==
      true ||
    expectation.riskLevelRequired !==
      true ||
    expectation.nextActionRequired !==
      true ||
    expectation.ownerDecisionMustRemainReserved !==
      true ||
    expectation.verifiedEvidenceOnly !==
      true ||
    expectation.unsupportedClaimsProhibited !==
      true ||
    expectation.urgencyExaggerationProhibited !==
      true ||
    expectation.guaranteeProhibited !==
      true ||
    expectation.crossCustomerContextProhibited !==
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
      "Meera quotation/proposal three specialist expectation is invalid.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

  if (
    boundary.sourceQuotationProposalTwoReviewDecisionBound !==
      true ||
    boundary.sourceQuotationProposalTwoReviewDecisionIntegrityVerified !==
      true ||
    boundary.sourceQuotationProposalTwoExecutionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.quotationProposalTwoReviewed !==
      true ||
    boundary.nextQuotationProposalPreparationAuthorized !==
      true ||
    boundary.quotationProposalThreePreparationPerformed !==
      true ||
    boundary.quotationProposalThreeExecutionAuthorized !==
      false ||
    boundary.quotationProposalThreeExecutionPerformed !==
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
      true ||
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Meera quotation/proposal three preparation authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(preparation) ||
    !Object.isFrozen(
      preparation.preparedQuotationProposal,
    ) ||
    !Object.isFrozen(
      preparation.specialistExpectation,
    ) ||
    !Object.isFrozen(
      preparation.authorityBoundary,
    )
  ) {
    throw new Error(
      "Meera quotation/proposal two preparation must be deeply frozen.",
    );
  }
}

export function createMeeraLimitedInternalPilotQuotationProposalThreePreparation(
  input:
    CreateMeeraLimitedInternalPilotQuotationProposalThreePreparationInput,
): MeeraLimitedInternalPilotQuotationProposalThreePreparation {
  const source =
    input.ownerLimitedInternalPilotQuotationProposalTwoReviewDecision;

  validateSourceReviewDecision(
    source,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two preparation identity",
    input.preparationId,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal two preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Meera quotation/proposal two preparation cannot precede the quotation/proposal one owner review decision.",
    );
  }

  const preparationCore = {
    version:
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARED" as const,

    sourceQuotationProposalTwoReviewDecisionId:
      source.decisionId,

    sourceQuotationProposalTwoReviewDecisionDigest:
      source.decisionDigest,

    sourceQuotationProposalTwoExecutionId:
      source.limitedInternalPilotQuotationProposalTwoExecutionId,

    sourceQuotationProposalTwoExecutionDigest:
      source.limitedInternalPilotQuotationProposalTwoExecutionDigest,

    ownerQuotationProposalTwoExecutionDecisionId:
      source.ownerQuotationProposalTwoExecutionDecisionId,

    ownerQuotationProposalTwoExecutionDecisionDigest:
      source.ownerQuotationProposalTwoExecutionDecisionDigest,

    quotationProposalTwoPreparationId:
      source.quotationProposalTwoPreparationId,

    quotationProposalTwoPreparationDigest:
      source.quotationProposalTwoPreparationDigest,

    controlledShadowExecutionId:
      source.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      source.controlledShadowExecutionDigest,

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

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    preparedQuotationProposal: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      scenarioId:
        "CONFLICTING_COMMERCIAL_OPTIONS" as const,

      quotationProposalSequence:
        3 as const,

      priorReviewedQuotationProposalSequence:
        2 as const,

      maximumQuotationProposalCount:
        3 as const,

      remainingQuotationProposalCapacityBeforeExecution:
        1 as const,

      projectedRemainingQuotationProposalCapacityAfterExecution:
        0 as const,

      concurrentQuotationProposalLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_QUOTATION_PROPOSAL" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      recommendationEvidenceToolMode:
        "READ_ONLY" as const,

      quotationProposalToolId:
        "tool-quotation-proposal-draft" as const,

      quotationProposalToolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    specialistExpectation: {
      conflictingOptionsMustBeExplicit:
        true as const,

      optionsAndTradeoffsRequired:
        true as const,

      recommendationRationaleRequired:
        true as const,

      uncertaintyPreserved:
        true as const,

      riskLevelRequired:
        true as const,

      nextActionRequired:
        true as const,

      ownerDecisionMustRemainReserved:
        true as const,

      verifiedEvidenceOnly:
        true as const,

      unsupportedClaimsProhibited:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      guaranteeProhibited:
        true as const,

      crossCustomerContextProhibited:
        true as const,

      crossTenantContextProhibited:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      quotationProposalGenerationPerformed:
        false as const,

      ownerDecisionMade:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,
    },

    authorityBoundary: {
      sourceQuotationProposalTwoReviewDecisionBound:
        true as const,

      sourceQuotationProposalTwoReviewDecisionIntegrityVerified:
        true as const,

      sourceQuotationProposalTwoExecutionBound:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      quotationProposalOneReviewed:
        true as const,

      quotationProposalTwoReviewed:
        true as const,

      nextQuotationProposalPreparationAuthorized:
        true as const,

      quotationProposalThreePreparationPerformed:
        true as const,

      quotationProposalThreeExecutionAuthorized:
        false as const,

      quotationProposalThreeExecutionPerformed:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as MeeraLimitedInternalPilotQuotationProposalThreePreparation;

  validateMeeraLimitedInternalPilotQuotationProposalThreePreparation(
    preparation,
  );

  return preparation;
}
