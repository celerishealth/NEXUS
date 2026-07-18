import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalTwoPreparation,
  type MeeraLimitedInternalPilotQuotationProposalTwoPreparation,
} from "./meeraLimitedInternalPilotQuotationProposalTwoPreparation";

import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision,
  type MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision,
} from "./meeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision";

export const MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION =
  "nexus-meera-limited-internal-pilot-recommendation-two-execution-v1" as const;

export interface ExecuteMeeraLimitedInternalPilotQuotationProposalTwoInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotQuotationProposalTwoExecutionDecision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision;

  readonly limitedInternalPilotQuotationProposalTwoPreparation:
    MeeraLimitedInternalPilotQuotationProposalTwoPreparation;

  readonly executedAt:
    string;
}

export interface MeeraLimitedInternalPilotQuotationProposalTwoExecution {
  readonly version:
    typeof MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTED";

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

  readonly ownerQuotationProposalTwoExecutionDecisionId:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionDigest:
    string;

  readonly quotationProposalTwoPreparationId:
    string;

  readonly quotationProposalTwoPreparationDigest:
    string;

  readonly sourceQuotationProposalReviewDecisionId:
    string;

  readonly sourceQuotationProposalReviewDecisionDigest:
    string;

  readonly sourceQuotationProposalOneExecutionId:
    string;

  readonly sourceQuotationProposalOneExecutionDigest:
    string;

  readonly initialOwnerPilotExecutionDecisionId:
    string;

  readonly initialOwnerPilotExecutionDecisionDigest:
    string;

  readonly initialPilotPreparationId:
    string;

  readonly initialPilotPreparationDigest:
    string;

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly pilotRecommendation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "MISSING_COMMERCIAL_EVIDENCE";

    quotationProposalSequence:
      2;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacity:
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

    quotationProposalToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";
  }>;

  readonly syntheticInquiryEvidence: Readonly<{
    evidenceClass:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryId:
      "synthetic-meera-pilot-inquiry-two";

    request:
      "Recommend the most suitable implementation option for this synthetic business case.";

    verifiedFacts:
      readonly string[];

    missingFacts:
      readonly string[];

    unsupportedFactsInvented:
      false;

    crossCustomerEvidenceUsed:
      false;

    crossTenantEvidenceUsed:
      false;
  }>;

  readonly syntheticCustomerContext: Readonly<{
    contextClass:
      "SYNTHETIC_SANITIZED_ONLY";

    contextId:
      "synthetic-meera-pilot-customer-context-two";

    verifiedContext:
      readonly string[];

    unavailableContext:
      readonly string[];

    realCustomerDataUsed:
      false;

    crossCustomerContextUsed:
      false;

    crossTenantContextUsed:
      false;
  }>;

  readonly recommendationDraft: Readonly<{
    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    recommendationOutcome:
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION";

    draftSummary:
      "A reliable option cannot be ranked until the missing decision facts are clarified.";

    verifiedFacts:
      readonly string[];

    missingFacts:
      readonly string[];

    clarifyingQuestions:
      readonly string[];

    assumptionsMade:
      false;

    missingFactsExplicit:
      true;

    verifiedFactsSeparatedFromAssumptions:
      true;

    uncertaintyPreserved:
      true;

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

    ownerDecisionMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly executionBoundary: Readonly<{
    ownerExecutionApprovalBound:
      true;

    sourceDecisionIntegrityVerified:
      true;

    sourcePreparationBound:
      true;

    sourcePreparationIntegrityVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    quotationProposalSequenceEnforced:
      true;

    maximumQuotationProposalCountPreserved:
      true;

    concurrentQuotationProposalLimitEnforced:
      true;

    failureThresholdPreserved:
      true;

    recommendationCreatorInvocationCount:
      1;

    quotationProposalTwoExecutionPerformed:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticQuotationProposalExecutionPerformed:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticCustomerContextRead:
      true;

    clarificationDraftCreated:
      true;

    unsupportedFactGenerationBlocked:
      true;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

    quotationProposalCustomerDeliveryAuthorized:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;

    realCustomerDataUsed:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
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

const VERIFIED_FACTS = [
  "The synthetic business requested an implementation recommendation.",
  "The recommendation must remain owner-reviewed before any further action.",
] as const;

const MISSING_FACTS = [
  "Approved budget range",
  "Required implementation timeline",
  "Primary decision criteria",
] as const;

const VERIFIED_CONTEXT = [
  "The case is synthetic and sanitized.",
  "No real customer identity or production record is available.",
] as const;

const UNAVAILABLE_CONTEXT = [
  "Confirmed budget",
  "Confirmed deadline",
  "Confirmed priority ranking",
] as const;

const CLARIFYING_QUESTIONS = [
  "What budget range has the owner approved?",
  "What implementation deadline must the option satisfy?",
  "Which decision criterion has the highest priority?",
] as const;

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
      "Unsupported deterministic Meera quotation/proposal two execution value.",
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
      `${label} contains a prohibited credential-bearing term.`,
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

function sameStringArray(
  actual:
    readonly string[],
  expected:
    readonly string[],
): boolean {
  return (
    actual.length ===
      expected.length &&
    actual.every(
      (value, index) =>
        value ===
        expected[index],
    )
  );
}

function validateSourceBindings(
  decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision,
  preparation:
    MeeraLimitedInternalPilotQuotationProposalTwoPreparation,
): void {
  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoExecutionDecision(
    decision,
  );

  validateMeeraLimitedInternalPilotQuotationProposalTwoPreparation(
    preparation,
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION_RECORDED" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION" ||
    decision.quotationProposalTwoExecutionAuthorized !==
      true ||
    decision.quotationProposalTwoExecutionPerformed !==
      false ||
    decision.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO"
  ) {
    throw new Error(
      "An approved Workforce Day 99 Meera quotation/proposal two execution decision is required.",
    );
  }

  if (
    preparation.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_PREPARED" ||
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 98 Meera quotation/proposal two preparation is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 99 Meera quotation/proposal two execution decision",
    decision,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Workforce Day 98 Meera quotation/proposal two preparation",
    preparation,
    "preparationDigest",
  );

  if (
    decision.preparationId !==
      preparation.preparationId ||
    decision.preparationDigest !==
      preparation.preparationDigest ||
    decision.sourceQuotationProposalReviewDecisionId !==
      preparation.sourceQuotationProposalReviewDecisionId ||
    decision.sourceQuotationProposalReviewDecisionDigest !==
      preparation.sourceQuotationProposalReviewDecisionDigest ||
    decision.sourceQuotationProposalExecutionId !==
      preparation.sourceQuotationProposalExecutionId ||
    decision.sourceQuotationProposalExecutionDigest !==
      preparation.sourceQuotationProposalExecutionDigest ||
    decision.ownerExecutionDecisionId !==
      preparation.ownerExecutionDecisionId ||
    decision.ownerExecutionDecisionDigest !==
      preparation.ownerExecutionDecisionDigest ||
    decision.sourcePilotPreparationId !==
      preparation.sourcePilotPreparationId ||
    decision.sourcePilotPreparationDigest !==
      preparation.sourcePilotPreparationDigest ||
    decision.controlledShadowExecutionId !==
      preparation.controlledShadowExecutionId ||
    decision.controlledShadowExecutionDigest !==
      preparation.controlledShadowExecutionDigest ||
    decision.tenantId !==
      preparation.tenantId ||
    decision.ownerId !==
      preparation.ownerId
  ) {
    throw new Error(
      "Meera quotation/proposal two source binding verification failed.",
    );
  }

  if (
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
      EXPECTED_AUTONOMY_LEVEL ||
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
      "Meera quotation/proposal two employee identity binding is invalid.",
    );
  }

  const reviewed =
    decision.reviewedPreparation;

  const prepared =
    preparation.preparedQuotationProposal;

  if (
    reviewed.pilotClass !==
      prepared.pilotClass ||
    reviewed.scenarioId !==
      prepared.scenarioId ||
    reviewed.quotationProposalSequence !==
      prepared.quotationProposalSequence ||
    reviewed.priorReviewedQuotationProposalSequence !==
      prepared.priorReviewedQuotationProposalSequence ||
    reviewed.maximumQuotationProposalCount !==
      prepared.maximumQuotationProposalCount ||
    reviewed.remainingQuotationProposalCapacityBeforeExecution !==
      prepared.remainingQuotationProposalCapacityBeforeExecution ||
    reviewed.projectedRemainingQuotationProposalCapacityAfterExecution !==
      prepared.projectedRemainingQuotationProposalCapacityAfterExecution ||
    reviewed.concurrentQuotationProposalLimit !==
      prepared.concurrentQuotationProposalLimit ||
    reviewed.failureThreshold !==
      prepared.failureThreshold ||
    reviewed.ownerReviewFrequency !==
      prepared.ownerReviewFrequency ||
    reviewed.dataClassification !==
      prepared.dataClassification ||
    reviewed.inquiryEvidenceToolMode !==
      prepared.inquiryEvidenceToolMode ||
    reviewed.recommendationEvidenceToolMode !==
      prepared.recommendationEvidenceToolMode ||
    reviewed.quotationProposalToolId !==
      prepared.quotationProposalToolId ||
    reviewed.quotationProposalToolMode !==
      prepared.quotationProposalToolMode ||
    reviewed.executionMode !==
      prepared.executionMode
  ) {
    throw new Error(
      "Meera quotation/proposal two reviewed preparation binding is invalid.",
    );
  }
}

export function validateMeeraLimitedInternalPilotQuotationProposalTwoExecution(
  execution:
    MeeraLimitedInternalPilotQuotationProposalTwoExecution,
): void {
  requireSafeIdentifier(
    "Meera quotation/proposal two execution identity",
    execution.executionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two owner decision identity",
    execution.ownerQuotationProposalTwoExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two preparation identity",
    execution.quotationProposalTwoPreparationId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal one execution identity",
    execution.sourceQuotationProposalOneExecutionId,
  );

  requireSafeIdentifier(
    "Meera tenant identity",
    execution.tenantId,
  );

  requireSafeIdentifier(
    "Meera owner identity",
    execution.ownerId,
  );

  requireDigest(
    "Meera quotation/proposal two owner decision digest",
    execution.ownerQuotationProposalTwoExecutionDecisionDigest,
  );

  requireDigest(
    "Meera quotation/proposal two preparation digest",
    execution.quotationProposalTwoPreparationDigest,
  );

  requireDigest(
    "Meera recommendation review decision digest",
    execution.sourceQuotationProposalReviewDecisionDigest,
  );

  requireDigest(
    "Meera quotation/proposal one execution digest",
    execution.sourceQuotationProposalOneExecutionDigest,
  );

  requireDigest(
    "Meera initial owner pilot execution decision digest",
    execution.initialOwnerPilotExecutionDecisionDigest,
  );

  requireDigest(
    "Meera initial pilot preparation digest",
    execution.initialPilotPreparationDigest,
  );

  requireDigest(
    "Meera controlled shadow execution digest",
    execution.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal two execution time",
    execution.executedAt,
  );

  verifyDigestBoundObject(
    "Meera quotation/proposal two execution",
    execution,
    "executionDigest",
  );

  if (
    execution.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION ||
    execution.executionState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTED" ||
    execution.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    execution.templateId !==
      EXPECTED_TEMPLATE_ID ||
    execution.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    execution.displayName !==
      EXPECTED_DISPLAY_NAME ||
    execution.role !==
      EXPECTED_ROLE ||
    execution.department !==
      EXPECTED_DEPARTMENT ||
    execution.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera quotation/proposal two execution identity is invalid.",
    );
  }

  const pilot =
    execution.pilotRecommendation;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "MISSING_COMMERCIAL_EVIDENCE" ||
    pilot.quotationProposalSequence !==
      2 ||
    pilot.maximumQuotationProposalCount !==
      3 ||
    pilot.remainingQuotationProposalCapacity !==
      1 ||
    pilot.concurrentQuotationProposalLimit !==
      1 ||
    pilot.failureThreshold !==
      1 ||
    pilot.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    pilot.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    pilot.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    pilot.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    pilot.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    pilot.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Meera quotation/proposal two pilot scope is invalid.",
    );
  }

  const evidence =
    execution.syntheticInquiryEvidence;

  if (
    evidence.evidenceClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryId !==
      "synthetic-meera-pilot-inquiry-two" ||
    evidence.request !==
      "Recommend the most suitable implementation option for this synthetic business case." ||
    !sameStringArray(
      evidence.verifiedFacts,
      VERIFIED_FACTS,
    ) ||
    !sameStringArray(
      evidence.missingFacts,
      MISSING_FACTS,
    ) ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.crossCustomerEvidenceUsed !==
      false ||
    evidence.crossTenantEvidenceUsed !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal two synthetic inquiry evidence is invalid.",
    );
  }

  const context =
    execution.syntheticCustomerContext;

  if (
    context.contextClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    context.contextId !==
      "synthetic-meera-pilot-customer-context-two" ||
    !sameStringArray(
      context.verifiedContext,
      VERIFIED_CONTEXT,
    ) ||
    !sameStringArray(
      context.unavailableContext,
      UNAVAILABLE_CONTEXT,
    ) ||
    context.realCustomerDataUsed !==
      false ||
    context.crossCustomerContextUsed !==
      false ||
    context.crossTenantContextUsed !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal two synthetic customer context is invalid.",
    );
  }

  const draft =
    execution.recommendationDraft;

  if (
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.recommendationOutcome !==
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    draft.draftSummary !==
      "A reliable option cannot be ranked until the missing decision facts are clarified." ||
    !sameStringArray(
      draft.verifiedFacts,
      VERIFIED_FACTS,
    ) ||
    !sameStringArray(
      draft.missingFacts,
      MISSING_FACTS,
    ) ||
    !sameStringArray(
      draft.clarifyingQuestions,
      CLARIFYING_QUESTIONS,
    ) ||
    draft.assumptionsMade !==
      false ||
    draft.missingFactsExplicit !==
      true ||
    draft.verifiedFactsSeparatedFromAssumptions !==
      true ||
    draft.uncertaintyPreserved !==
      true ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.urgencyExaggerated !==
      false ||
    draft.guaranteeMade !==
      false ||
    draft.ownerDecisionMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal two clarification draft is invalid.",
    );
  }

  const boundary =
    execution.executionBoundary;

  if (
    boundary.ownerExecutionApprovalBound !==
      true ||
    boundary.sourceDecisionIntegrityVerified !==
      true ||
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.quotationProposalSequenceEnforced !==
      true ||
    boundary.maximumQuotationProposalCountPreserved !==
      true ||
    boundary.concurrentQuotationProposalLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.recommendationCreatorInvocationCount !==
      1 ||
    boundary.quotationProposalTwoExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticQuotationProposalExecutionPerformed !==
      true ||
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticCustomerContextRead !==
      true ||
    boundary.clarificationDraftCreated !==
      true ||
    boundary.unsupportedFactGenerationBlocked !==
      true ||
    boundary.ownerDecisionMade !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.quotationProposalCustomerDeliveryAuthorized !==
      false ||
    boundary.customerDeliveryPrepared !==
      false ||
    boundary.customerDeliveryExecuted !==
      false ||
    boundary.realCustomerDataUsed !==
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
    execution.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW"
  ) {
    throw new Error(
      "Meera quotation/proposal two execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.pilotRecommendation,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence
        .verifiedFacts,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence
        .missingFacts,
    ) ||
    !Object.isFrozen(
      execution.syntheticCustomerContext,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft
        .clarifyingQuestions,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Meera quotation/proposal two execution must be deeply frozen.",
    );
  }
}

export async function executeMeeraLimitedInternalPilotQuotationProposalTwo(
  input:
    ExecuteMeeraLimitedInternalPilotQuotationProposalTwoInput,
): Promise<MeeraLimitedInternalPilotQuotationProposalTwoExecution> {
  requireSafeIdentifier(
    "Meera quotation/proposal two execution identity",
    input.executionId,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal two execution time",
    input.executedAt,
  );

  const decision =
    input.ownerLimitedInternalPilotQuotationProposalTwoExecutionDecision;

  const preparation =
    input.limitedInternalPilotQuotationProposalTwoPreparation;

  validateSourceBindings(
    decision,
    preparation,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Meera quotation/proposal two execution cannot precede owner approval.",
    );
  }

  let recommendationCreatorInvocationCount =
    0;

  recommendationCreatorInvocationCount +=
    1;

  if (
    recommendationCreatorInvocationCount >
    preparation.preparedQuotationProposal
      .concurrentQuotationProposalLimit
  ) {
    throw new Error(
      "Meera quotation/proposal two concurrent execution limit was exceeded.",
    );
  }

  if (
    recommendationCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Meera quotation/proposal two creator must execute exactly once.",
    );
  }

  const executionCore = {
    version:
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTED" as const,

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

    ownerQuotationProposalTwoExecutionDecisionId:
      decision.decisionId,

    ownerQuotationProposalTwoExecutionDecisionDigest:
      decision.decisionDigest,

    quotationProposalTwoPreparationId:
      preparation.preparationId,

    quotationProposalTwoPreparationDigest:
      preparation.preparationDigest,

    sourceQuotationProposalReviewDecisionId:
      preparation.sourceQuotationProposalReviewDecisionId,

    sourceQuotationProposalReviewDecisionDigest:
      preparation.sourceQuotationProposalReviewDecisionDigest,

    sourceQuotationProposalOneExecutionId:
      preparation.sourceQuotationProposalExecutionId,

    sourceQuotationProposalOneExecutionDigest:
      preparation.sourceQuotationProposalExecutionDigest,

    initialOwnerPilotExecutionDecisionId:
      preparation.ownerExecutionDecisionId,

    initialOwnerPilotExecutionDecisionDigest:
      preparation.ownerExecutionDecisionDigest,

    initialPilotPreparationId:
      preparation.sourcePilotPreparationId,

    initialPilotPreparationDigest:
      preparation.sourcePilotPreparationDigest,

    controlledShadowExecutionId:
      preparation.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      preparation.controlledShadowExecutionDigest,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    pilotRecommendation: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      scenarioId:
        "MISSING_COMMERCIAL_EVIDENCE" as const,

      quotationProposalSequence:
        2 as const,

      maximumQuotationProposalCount:
        3 as const,

      remainingQuotationProposalCapacity:
        1 as const,

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

      quotationProposalToolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    syntheticInquiryEvidence: {
      evidenceClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryId:
        "synthetic-meera-pilot-inquiry-two" as const,

      request:
        "Recommend the most suitable implementation option for this synthetic business case." as const,

      verifiedFacts:
        [...VERIFIED_FACTS],

      missingFacts:
        [...MISSING_FACTS],

      unsupportedFactsInvented:
        false as const,

      crossCustomerEvidenceUsed:
        false as const,

      crossTenantEvidenceUsed:
        false as const,
    },

    syntheticCustomerContext: {
      contextClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      contextId:
        "synthetic-meera-pilot-customer-context-two" as const,

      verifiedContext:
        [...VERIFIED_CONTEXT],

      unavailableContext:
        [...UNAVAILABLE_CONTEXT],

      realCustomerDataUsed:
        false as const,

      crossCustomerContextUsed:
        false as const,

      crossTenantContextUsed:
        false as const,
    },

    recommendationDraft: {
      recommendationStatus:
        "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

      recommendationOutcome:
        "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" as const,

      draftSummary:
        "A reliable option cannot be ranked until the missing decision facts are clarified." as const,

      verifiedFacts:
        [...VERIFIED_FACTS],

      missingFacts:
        [...MISSING_FACTS],

      clarifyingQuestions:
        [...CLARIFYING_QUESTIONS],

      assumptionsMade:
        false as const,

      missingFactsExplicit:
        true as const,

      verifiedFactsSeparatedFromAssumptions:
        true as const,

      uncertaintyPreserved:
        true as const,

      unsupportedClaimsIncluded:
        false as const,

      urgencyExaggerated:
        false as const,

      guaranteeMade:
        false as const,

      ownerDecisionMade:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,
    },

    executionBoundary: {
      ownerExecutionApprovalBound:
        true as const,

      sourceDecisionIntegrityVerified:
        true as const,

      sourcePreparationBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      quotationProposalSequenceEnforced:
        true as const,

      maximumQuotationProposalCountPreserved:
        true as const,

      concurrentQuotationProposalLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      recommendationCreatorInvocationCount:
        recommendationCreatorInvocationCount as 1,

      quotationProposalTwoExecutionPerformed:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticQuotationProposalExecutionPerformed:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticCustomerContextRead:
        true as const,

      clarificationDraftCreated:
        true as const,

      unsupportedFactGenerationBlocked:
        true as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      quotationProposalCustomerDeliveryAuthorized:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,

      realCustomerDataUsed:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as MeeraLimitedInternalPilotQuotationProposalTwoExecution;

  validateMeeraLimitedInternalPilotQuotationProposalTwoExecution(
    execution,
  );

  return execution;
}
