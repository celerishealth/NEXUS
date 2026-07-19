import {
  createHash,
} from "node:crypto";

import type {
  AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
} from "./ashaOwnerLimitedInternalPilotInquiryThreeReviewDecision";

import type {
  RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
} from "./riyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision";

import type {
  SalesCoreLaunchEvidenceDefectContainmentRecord,
} from "./salesCoreLaunchEvidenceDefectContainmentRecord";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_RECORD_VERSION =
  "sales-core-launch-commercial-evidence-remediation-record-v1" as const;

export interface CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput {
  readonly remediationId: string;

  readonly containmentRecord:
    SalesCoreLaunchEvidenceDefectContainmentRecord;

  readonly ashaInquiryReviewDecision:
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;

  readonly riyaRecommendationReviewDecision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;

  readonly reason: string;
  readonly remediatedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceRemediationRecord {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_RECORD_VERSION;

  readonly remediationId: string;

  readonly remediationState:
    "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED";

  readonly department:
    "SALES";

  readonly affectedEmployeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly affectedEmployeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceChain: Readonly<{
    containmentId: string;
    containmentDigest: string;
    sourceRegistryDigest: string;

    ashaInquiryReviewDecisionId: string;
    ashaInquiryReviewDecisionDigest: string;
    ashaInquiryExecutionId: string;
    ashaInquiryExecutionDigest: string;
    ashaInquiryScenarioId:
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY";

    riyaRecommendationReviewDecisionId: string;
    riyaRecommendationReviewDecisionDigest: string;
    riyaRecommendationExecutionId: string;
    riyaRecommendationExecutionDigest: string;
    riyaRecommendationScenarioId:
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF";

    historicalDirectAshaToRiyaDigestLinkPresent:
      false;

    remediationCompositeChainCreated:
      true;

    compositeEvidenceDigest: string;
  }>;

  readonly commercialDraft: Readonly<{
    quotationProposalId: string;

    quotationProposalStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    sourceEvidenceDigest: string;

    evidenceClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    recommendationEvidenceToolMode:
      "READ_ONLY";

    quotationProposalToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    productsAndServices: Readonly<{
      status:
        "UNRESOLVED_NO_VERIFIED_COMMERCIAL_ITEMS";

      verifiedItems:
        readonly [];
    }>;

    quantity: Readonly<{
      status:
        "UNRESOLVED_NOT_VERIFIED";

      verifiedQuantity:
        null;

      verifiedUnit:
        null;
    }>;

    pricing: Readonly<{
      status:
        "UNPRICED_AWAITING_VERIFIED_COMMERCIAL_INPUTS";

      currencyStatus:
        "UNRESOLVED_NOT_VERIFIED";

      currency:
        null;

      lineItems:
        readonly [];

      unresolvedInputs:
        readonly [
          "VERIFIED_PRODUCTS_OR_SERVICES",
          "VERIFIED_QUANTITIES_AND_UNITS",
          "APPROVED_UNIT_PRICES",
          "APPROVED_CURRENCY"
        ];

      subtotal:
        null;

      total:
        null;
    }>;

    tax: Readonly<{
      status:
        "UNRESOLVED_NOT_VERIFIED";

      amount:
        null;
    }>;

    freight: Readonly<{
      status:
        "UNRESOLVED_NOT_VERIFIED";

      amount:
        null;
    }>;

    discount: Readonly<{
      status:
        "UNRESOLVED_NOT_VERIFIED";

      amount:
        null;
    }>;

    validity: Readonly<{
      status:
        "UNRESOLVED_NOT_VERIFIED";

      value:
        null;
    }>;

    paymentTerms: Readonly<{
      status:
        "UNRESOLVED_NOT_VERIFIED";

      value:
        null;
    }>;

    includedScope:
      readonly [
        "Use only the digest-bound owner-reviewed synthetic inquiry evidence.",
        "Use only the digest-bound owner-reviewed synthetic recommendation evidence.",
        "Prepare one bounded internal commercial draft for owner review only."
      ];

    exclusions:
      readonly [
        "No product service quantity price currency tax freight discount validity or payment term is asserted.",
        "No customer-facing quotation proposal delivery or commercial commitment is prepared.",
        "No production provider payment autonomous runtime or public authority is granted."
      ];

    dependencies:
      readonly [
        "Verified product or service identity.",
        "Verified quantities units and specifications.",
        "Owner-approved pricing currency tax freight discount validity and payment terms.",
        "New owner review of the remediated commercial evidence."
      ];

    commercialAssumptions:
      readonly [];

    assumptionsMade:
      false;

    missingCommercialEvidence:
      readonly [
        "Verified product or service identity is missing.",
        "Verified quantities units and specifications are missing.",
        "Approved unit prices and currency are missing.",
        "Approved tax freight and discount treatment is missing.",
        "Approved validity and payment terms are missing.",
        "Customer commitment authority is absent."
      ];

    commercialRisk: Readonly<{
      level:
        "HIGH";

      classification:
        "PRICED_QUOTATION_BLOCKED_BY_MISSING_VERIFIED_COMMERCIAL_INPUTS";

      pricedCommitmentAllowed:
        false;

      customerCommitmentAllowed:
        false;
    }>;

    ownerReview: Readonly<{
      required:
        true;

      decisionRecorded:
        false;

      approvalBypassAllowed:
        false;
    }>;

    unsupportedFactsInvented:
      false;

    unsupportedClaimsIncluded:
      false;

    customerCommitmentMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly remediationBoundary: Readonly<{
    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;

    containmentRecordBound:
      true;

    containmentIntegrityVerified:
      true;

    ashaOwnerReviewedInquiryBound:
      true;

    ashaOwnerReviewedInquiryIntegrityVerified:
      true;

    riyaOwnerReviewedRecommendationBound:
      true;

    riyaOwnerReviewedRecommendationIntegrityVerified:
      true;

    historicalDirectAshaToRiyaDigestLinkClaimed:
      false;

    remediationCompositeChainCreated:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    additiveRemediationOnly:
      true;

    meeraCommercialDraftCreated:
      true;

    ownerReviewRequired:
      true;

    ownerReviewDecisionRecorded:
      false;

    meeraCommercialEvidenceRequalified:
      false;

    salesCoreLaunchRequalificationEligible:
      false;

    runtimeActivationPreparationEligible:
      false;

    runtimeActivationAuthorized:
      false;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionAuthorityGranted:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly reason: string;

  readonly nextStep:
    "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW";

  readonly remediatedAt: string;
  readonly remediationDigest: string;
}

type DigestBoundRecord =
  Readonly<Record<string, unknown>>;

interface AshaReviewContract
  extends DigestBoundRecord {
  readonly decisionId: string;
  readonly decisionDigest: string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_RECORDED";

  readonly employeeId:
    "employee-asha-inquiry-intake-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly limitedInternalPilotInquiryThreeExecutionId:
    string;

  readonly limitedInternalPilotInquiryThreeExecutionDigest:
    string;

  readonly decision:
    "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  readonly limitedInternalPilotCompleted:
    true;

  readonly reviewedEvidence: Readonly<{
    scenarioId:
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY";

    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";

    toolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    clarificationBeforeGuessingRequired:
      true;

    tenantScopedContextOnly:
      true;

    customerScopedContextOnly:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    realCustomerDataAccessAuthorized:
      false;

    customerContactAuthorized:
      false;

    recommendationGenerationAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly nextStep:
    "LIMITED_INTERNAL_PILOT_COMPLETE";

  readonly decidedAt: string;
}

interface RiyaReviewContract
  extends DigestBoundRecord {
  readonly decisionId: string;
  readonly decisionDigest: string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly limitedInternalPilotRecommendationThreeExecutionId:
    string;

  readonly limitedInternalPilotRecommendationThreeExecutionDigest:
    string;

  readonly decision:
    "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  readonly limitedInternalPilotCompleted:
    true;

  readonly reviewedEvidence: Readonly<{
    scenarioId:
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    recommendationToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    ownerDecisionReserved:
      true;

    assumptionsMade:
      false;

    unsupportedClaimsIncluded:
      false;

    unsupportedFactsInvented:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;

    realCustomerDataUsed:
      false;

    crossCustomerEvidenceUsed:
      false;

    crossTenantEvidenceUsed:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    recommendationCustomerDeliveryAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly nextStep:
    "LIMITED_INTERNAL_PILOT_COMPLETE";

  readonly decidedAt: string;
}

interface ContainmentContract
  extends DigestBoundRecord {
  readonly containmentId: string;
  readonly containmentDigest: string;

  readonly containmentState:
    "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED";

  readonly affectedEmployeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly affectedEmployeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceChain: Readonly<{
    sourceRegistryDigest: string;
  }>;

  readonly containmentBoundary: Readonly<{
    historicalRecordsMutated:
      false;

    sourceDigestsPreserved:
      true;

    runtimeActivationPreparationEligible:
      false;

    runtimeActivationAuthorized:
      false;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    productionAuthorityGranted:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    remediationRequired:
      true;

    ownerReapprovalRequiredAfterRemediation:
      true;
  }>;

  readonly nextStep:
    "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH";

  readonly detectedAt: string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function canonicalize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
            canonicalize(item),
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
            canonicalize(
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
      "Unsupported deterministic commercial-remediation value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      canonicalize(value),
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

function requireSafeIdentifier(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
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
    value !== value.trim() ||
    !Number.isFinite(
      Date.parse(value),
    )
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireReason(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < 12 ||
    value.length > 1000 ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      "Commercial evidence remediation reason is invalid.",
    );
  }
}

function verifyDigestBoundObject(
  label: string,
  record: DigestBoundRecord,
  digestField: string,
): void {
  const digest =
    record[digestField];

  if (
    typeof digest !== "string" ||
    !SHA_256_PATTERN.test(digest)
  ) {
    throw new Error(
      `${label} digest is invalid.`,
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned[digestField];

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      `${label} integrity verification failed.`,
    );
  }
}

function validateContainment(
  source:
    SalesCoreLaunchEvidenceDefectContainmentRecord,
): ContainmentContract {
  const containment =
    source as unknown as
      ContainmentContract;

  verifyDigestBoundObject(
    "Sales core launch containment",
    containment,
    "containmentDigest",
  );

  const boundary =
    containment.containmentBoundary;

  if (
    containment.containmentState !==
      "SALES_CORE_LAUNCH_EVIDENCE_DEFECT_CONTAINED" ||
    containment.affectedEmployeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    containment.affectedEmployeeCode !==
      "nx-sales-005" ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.sourceDigestsPreserved !==
      true ||
    boundary.runtimeActivationPreparationEligible !==
      false ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.remediationRequired !==
      true ||
    boundary.ownerReapprovalRequiredAfterRemediation !==
      true ||
    containment.nextStep !==
      "REMEDIATE_MEERA_COMMERCIAL_EVIDENCE_AND_REQUALIFY_SALES_CORE_LAUNCH"
  ) {
    throw new Error(
      "Sales core launch containment is not eligible for additive remediation.",
    );
  }

  requireSafeIdentifier(
    "Containment identity",
    containment.containmentId,
  );

  requireDigest(
    "Source registry digest",
    containment.sourceChain
      .sourceRegistryDigest,
  );

  requireIsoTimestamp(
    "Containment detection time",
    containment.detectedAt,
  );

  return containment;
}

function validateAshaReview(
  source:
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision,
): AshaReviewContract {
  const decision =
    source as unknown as
      AshaReviewContract;

  verifyDigestBoundObject(
    "Asha owner-reviewed inquiry",
    decision,
    "decisionDigest",
  );

  const evidence =
    decision.reviewedEvidence;

  const boundary =
    decision.authorityBoundary;

  if (
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_RECORDED" ||
    decision.employeeId !==
      "employee-asha-inquiry-intake-v1" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" ||
    decision.limitedInternalPilotCompleted !==
      true ||
    evidence.scenarioId !==
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY" ||
    evidence.dataClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.toolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.clarificationBeforeGuessingRequired !==
      true ||
    evidence.tenantScopedContextOnly !==
      true ||
    evidence.customerScopedContextOnly !==
      true ||
    boundary.ownerDecisionRequired !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.customerContactAuthorized !==
      false ||
    boundary.recommendationGenerationAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    decision.nextStep !==
      "LIMITED_INTERNAL_PILOT_COMPLETE"
  ) {
    throw new Error(
      "Asha inquiry is not valid owner-reviewed remediation evidence.",
    );
  }

  requireSafeIdentifier(
    "Asha review identity",
    decision.decisionId,
  );

  requireSafeIdentifier(
    "Asha inquiry execution identity",
    decision
      .limitedInternalPilotInquiryThreeExecutionId,
  );

  requireDigest(
    "Asha inquiry execution digest",
    decision
      .limitedInternalPilotInquiryThreeExecutionDigest,
  );

  requireIsoTimestamp(
    "Asha review time",
    decision.decidedAt,
  );

  return decision;
}

function validateRiyaReview(
  source:
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
): RiyaReviewContract {
  const decision =
    source as unknown as
      RiyaReviewContract;

  verifyDigestBoundObject(
    "Riya owner-reviewed recommendation",
    decision,
    "decisionDigest",
  );

  const evidence =
    decision.reviewedEvidence;

  const boundary =
    decision.authorityBoundary;

  if (
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED" ||
    decision.employeeId !==
      "employee-riya-recommendation-specialist-v1" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" ||
    decision.limitedInternalPilotCompleted !==
      true ||
    evidence.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.recommendationToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.ownerDecisionReserved !==
      true ||
    evidence.assumptionsMade !==
      false ||
    evidence.unsupportedClaimsIncluded !==
      false ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.customerDeliveryPrepared !==
      false ||
    evidence.customerDeliveryExecuted !==
      false ||
    evidence.realCustomerDataUsed !==
      false ||
    evidence.crossCustomerEvidenceUsed !==
      false ||
    evidence.crossTenantEvidenceUsed !==
      false ||
    boundary.ownerDecisionRequired !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.recommendationCustomerDeliveryAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    decision.nextStep !==
      "LIMITED_INTERNAL_PILOT_COMPLETE"
  ) {
    throw new Error(
      "Riya recommendation is not valid owner-reviewed remediation evidence.",
    );
  }

  requireSafeIdentifier(
    "Riya review identity",
    decision.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation execution identity",
    decision
      .limitedInternalPilotRecommendationThreeExecutionId,
  );

  requireDigest(
    "Riya recommendation execution digest",
    decision
      .limitedInternalPilotRecommendationThreeExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya review time",
    decision.decidedAt,
  );

  return decision;
}

function validateSourceChain(
  input:
    CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput,
): {
  containment: ContainmentContract;
  asha: AshaReviewContract;
  riya: RiyaReviewContract;
} {
  const containment =
    validateContainment(
      input.containmentRecord,
    );

  const asha =
    validateAshaReview(
      input.ashaInquiryReviewDecision,
    );

  const riya =
    validateRiyaReview(
      input.riyaRecommendationReviewDecision,
    );

  if (
    containment.tenantId !==
      asha.tenantId ||
    containment.tenantId !==
      riya.tenantId ||
    containment.ownerId !==
      asha.ownerId ||
    containment.ownerId !==
      riya.ownerId
  ) {
    throw new Error(
      "Commercial remediation tenant or owner binding failed.",
    );
  }

  const remediatedAt =
    Date.parse(input.remediatedAt);

  if (
    remediatedAt <
      Date.parse(containment.detectedAt) ||
    remediatedAt <
      Date.parse(asha.decidedAt) ||
    remediatedAt <
      Date.parse(riya.decidedAt)
  ) {
    throw new Error(
      "Commercial remediation time precedes source evidence.",
    );
  }

  return {
    containment,
    asha,
    riya,
  };
}

export function validateSalesCoreLaunchCommercialEvidenceRemediationRecord(
  record:
    SalesCoreLaunchCommercialEvidenceRemediationRecord,
): void {
  verifyDigestBoundObject(
    "Sales core launch commercial remediation",
    record as unknown as
      DigestBoundRecord,
    "remediationDigest",
  );

  requireSafeIdentifier(
    "Commercial remediation identity",
    record.remediationId,
  );

  requireSafeIdentifier(
    "Quotation proposal identity",
    record.commercialDraft
      .quotationProposalId,
  );

  requireReason(
    record.reason,
  );

  requireIsoTimestamp(
    "Commercial remediation time",
    record.remediatedAt,
  );

  const source =
    record.sourceChain;

  const expectedCompositeDigest =
    sha256({
      containmentDigest:
        source.containmentDigest,

      ashaInquiryReviewDecisionDigest:
        source.ashaInquiryReviewDecisionDigest,

      riyaRecommendationReviewDecisionDigest:
        source.riyaRecommendationReviewDecisionDigest,

      historicalDirectAshaToRiyaDigestLinkPresent:
        false,
    });

  requireDigest(
    "Containment digest",
    source.containmentDigest,
  );

  requireDigest(
    "Source registry digest",
    source.sourceRegistryDigest,
  );

  requireDigest(
    "Asha review digest",
    source.ashaInquiryReviewDecisionDigest,
  );

  requireDigest(
    "Asha inquiry execution digest",
    source.ashaInquiryExecutionDigest,
  );

  requireDigest(
    "Riya review digest",
    source.riyaRecommendationReviewDecisionDigest,
  );

  requireDigest(
    "Riya recommendation execution digest",
    source.riyaRecommendationExecutionDigest,
  );

  requireDigest(
    "Composite evidence digest",
    source.compositeEvidenceDigest,
  );

  const draft =
    record.commercialDraft;

  const boundary =
    record.remediationBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_RECORD_VERSION ||
    record.remediationState !==
      "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED" ||
    record.department !==
      "SALES" ||
    record.affectedEmployeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.affectedEmployeeCode !==
      "nx-sales-005" ||
    source.ashaInquiryScenarioId !==
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY" ||
    source.riyaRecommendationScenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    source.historicalDirectAshaToRiyaDigestLinkPresent !==
      false ||
    source.remediationCompositeChainCreated !==
      true ||
    source.compositeEvidenceDigest !==
      expectedCompositeDigest ||
    draft.sourceEvidenceDigest !==
      source.compositeEvidenceDigest ||
    draft.quotationProposalStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.evidenceClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    draft.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    draft.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    draft.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    draft.executionMode !==
      "SANDBOX_ONLY" ||
    draft.productsAndServices.status !==
      "UNRESOLVED_NO_VERIFIED_COMMERCIAL_ITEMS" ||
    draft.productsAndServices.verifiedItems.length !==
      0 ||
    draft.quantity.status !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.quantity.verifiedQuantity !==
      null ||
    draft.quantity.verifiedUnit !==
      null ||
    draft.pricing.status !==
      "UNPRICED_AWAITING_VERIFIED_COMMERCIAL_INPUTS" ||
    draft.pricing.currencyStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.pricing.currency !==
      null ||
    draft.pricing.lineItems.length !==
      0 ||
    draft.pricing.unresolvedInputs.length !==
      4 ||
    draft.pricing.subtotal !==
      null ||
    draft.pricing.total !==
      null ||
    draft.tax.status !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.tax.amount !==
      null ||
    draft.freight.status !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.freight.amount !==
      null ||
    draft.discount.status !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.discount.amount !==
      null ||
    draft.validity.status !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.validity.value !==
      null ||
    draft.paymentTerms.status !==
      "UNRESOLVED_NOT_VERIFIED" ||
    draft.paymentTerms.value !==
      null ||
    draft.includedScope.length !==
      3 ||
    draft.exclusions.length !==
      3 ||
    draft.dependencies.length !==
      4 ||
    draft.commercialAssumptions.length !==
      0 ||
    draft.assumptionsMade !==
      false ||
    draft.missingCommercialEvidence.length !==
      6 ||
    draft.commercialRisk.level !==
      "HIGH" ||
    draft.commercialRisk.classification !==
      "PRICED_QUOTATION_BLOCKED_BY_MISSING_VERIFIED_COMMERCIAL_INPUTS" ||
    draft.commercialRisk.pricedCommitmentAllowed !==
      false ||
    draft.commercialRisk.customerCommitmentAllowed !==
      false ||
    draft.ownerReview.required !==
      true ||
    draft.ownerReview.decisionRecorded !==
      false ||
    draft.ownerReview.approvalBypassAllowed !==
      false ||
    draft.unsupportedFactsInvented !==
      false ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.customerCommitmentMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.historicalSourceDigestsPreserved !==
      true ||
    boundary.containmentRecordBound !==
      true ||
    boundary.containmentIntegrityVerified !==
      true ||
    boundary.ashaOwnerReviewedInquiryBound !==
      true ||
    boundary.ashaOwnerReviewedInquiryIntegrityVerified !==
      true ||
    boundary.riyaOwnerReviewedRecommendationBound !==
      true ||
    boundary.riyaOwnerReviewedRecommendationIntegrityVerified !==
      true ||
    boundary.historicalDirectAshaToRiyaDigestLinkClaimed !==
      false ||
    boundary.remediationCompositeChainCreated !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.additiveRemediationOnly !==
      true ||
    boundary.meeraCommercialDraftCreated !==
      true ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      false ||
    boundary.meeraCommercialEvidenceRequalified !==
      false ||
    boundary.salesCoreLaunchRequalificationEligible !==
      false ||
    boundary.runtimeActivationPreparationEligible !==
      false ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    record.nextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW"
  ) {
    throw new Error(
      "Sales core launch commercial remediation record is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.sourceChain) ||
    !Object.isFrozen(record.commercialDraft) ||
    !Object.isFrozen(
      record.commercialDraft
        .productsAndServices,
    ) ||
    !Object.isFrozen(
      record.commercialDraft
        .productsAndServices
        .verifiedItems,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.quantity,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.pricing,
    ) ||
    !Object.isFrozen(
      record.commercialDraft
        .pricing.lineItems,
    ) ||
    !Object.isFrozen(
      record.commercialDraft
        .pricing.unresolvedInputs,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.tax,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.freight,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.discount,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.validity,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.paymentTerms,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.includedScope,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.exclusions,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.dependencies,
    ) ||
    !Object.isFrozen(
      record.commercialDraft
        .commercialAssumptions,
    ) ||
    !Object.isFrozen(
      record.commercialDraft
        .missingCommercialEvidence,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.commercialRisk,
    ) ||
    !Object.isFrozen(
      record.commercialDraft.ownerReview,
    ) ||
    !Object.isFrozen(
      record.remediationBoundary,
    )
  ) {
    throw new Error(
      "Sales core launch commercial remediation record must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialEvidenceRemediationRecord(
  input:
    CreateSalesCoreLaunchCommercialEvidenceRemediationRecordInput,
): SalesCoreLaunchCommercialEvidenceRemediationRecord {
  requireSafeIdentifier(
    "Commercial remediation identity",
    input.remediationId,
  );

  requireReason(
    input.reason,
  );

  requireIsoTimestamp(
    "Commercial remediation time",
    input.remediatedAt,
  );

  const {
    containment,
    asha,
    riya,
  } = validateSourceChain(input);

  const compositeEvidenceDigest =
    sha256({
      containmentDigest:
        containment.containmentDigest,

      ashaInquiryReviewDecisionDigest:
        asha.decisionDigest,

      riyaRecommendationReviewDecisionDigest:
        riya.decisionDigest,

      historicalDirectAshaToRiyaDigestLinkPresent:
        false,
    });

  const remediationCore = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_RECORD_VERSION,

    remediationId:
      input.remediationId,

    remediationState:
      "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED" as const,

    department:
      "SALES" as const,

    affectedEmployeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    affectedEmployeeCode:
      "nx-sales-005" as const,

    tenantId:
      containment.tenantId,

    ownerId:
      containment.ownerId,

    sourceChain: {
      containmentId:
        containment.containmentId,

      containmentDigest:
        containment.containmentDigest,

      sourceRegistryDigest:
        containment.sourceChain
          .sourceRegistryDigest,

      ashaInquiryReviewDecisionId:
        asha.decisionId,

      ashaInquiryReviewDecisionDigest:
        asha.decisionDigest,

      ashaInquiryExecutionId:
        asha
          .limitedInternalPilotInquiryThreeExecutionId,

      ashaInquiryExecutionDigest:
        asha
          .limitedInternalPilotInquiryThreeExecutionDigest,

      ashaInquiryScenarioId:
        asha.reviewedEvidence.scenarioId,

      riyaRecommendationReviewDecisionId:
        riya.decisionId,

      riyaRecommendationReviewDecisionDigest:
        riya.decisionDigest,

      riyaRecommendationExecutionId:
        riya
          .limitedInternalPilotRecommendationThreeExecutionId,

      riyaRecommendationExecutionDigest:
        riya
          .limitedInternalPilotRecommendationThreeExecutionDigest,

      riyaRecommendationScenarioId:
        riya.reviewedEvidence.scenarioId,

      historicalDirectAshaToRiyaDigestLinkPresent:
        false as const,

      remediationCompositeChainCreated:
        true as const,

      compositeEvidenceDigest,
    },

    commercialDraft: {
      quotationProposalId:
        `${input.remediationId}-commercial-draft`,

      quotationProposalStatus:
        "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

      sourceEvidenceDigest:
        compositeEvidenceDigest,

      evidenceClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      recommendationEvidenceToolMode:
        "READ_ONLY" as const,

      quotationProposalToolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      productsAndServices: {
        status:
          "UNRESOLVED_NO_VERIFIED_COMMERCIAL_ITEMS" as const,

        verifiedItems:
          [] as const,
      },

      quantity: {
        status:
          "UNRESOLVED_NOT_VERIFIED" as const,

        verifiedQuantity:
          null,

        verifiedUnit:
          null,
      },

      pricing: {
        status:
          "UNPRICED_AWAITING_VERIFIED_COMMERCIAL_INPUTS" as const,

        currencyStatus:
          "UNRESOLVED_NOT_VERIFIED" as const,

        currency:
          null,

        lineItems:
          [] as const,

        unresolvedInputs: [
          "VERIFIED_PRODUCTS_OR_SERVICES",
          "VERIFIED_QUANTITIES_AND_UNITS",
          "APPROVED_UNIT_PRICES",
          "APPROVED_CURRENCY",
        ] as const,

        subtotal:
          null,

        total:
          null,
      },

      tax: {
        status:
          "UNRESOLVED_NOT_VERIFIED" as const,

        amount:
          null,
      },

      freight: {
        status:
          "UNRESOLVED_NOT_VERIFIED" as const,

        amount:
          null,
      },

      discount: {
        status:
          "UNRESOLVED_NOT_VERIFIED" as const,

        amount:
          null,
      },

      validity: {
        status:
          "UNRESOLVED_NOT_VERIFIED" as const,

        value:
          null,
      },

      paymentTerms: {
        status:
          "UNRESOLVED_NOT_VERIFIED" as const,

        value:
          null,
      },

      includedScope: [
        "Use only the digest-bound owner-reviewed synthetic inquiry evidence.",
        "Use only the digest-bound owner-reviewed synthetic recommendation evidence.",
        "Prepare one bounded internal commercial draft for owner review only.",
      ] as const,

      exclusions: [
        "No product service quantity price currency tax freight discount validity or payment term is asserted.",
        "No customer-facing quotation proposal delivery or commercial commitment is prepared.",
        "No production provider payment autonomous runtime or public authority is granted.",
      ] as const,

      dependencies: [
        "Verified product or service identity.",
        "Verified quantities units and specifications.",
        "Owner-approved pricing currency tax freight discount validity and payment terms.",
        "New owner review of the remediated commercial evidence.",
      ] as const,

      commercialAssumptions:
        [] as const,

      assumptionsMade:
        false as const,

      missingCommercialEvidence: [
        "Verified product or service identity is missing.",
        "Verified quantities units and specifications are missing.",
        "Approved unit prices and currency are missing.",
        "Approved tax freight and discount treatment is missing.",
        "Approved validity and payment terms are missing.",
        "Customer commitment authority is absent.",
      ] as const,

      commercialRisk: {
        level:
          "HIGH" as const,

        classification:
          "PRICED_QUOTATION_BLOCKED_BY_MISSING_VERIFIED_COMMERCIAL_INPUTS" as const,

        pricedCommitmentAllowed:
          false as const,

        customerCommitmentAllowed:
          false as const,
      },

      ownerReview: {
        required:
          true as const,

        decisionRecorded:
          false as const,

        approvalBypassAllowed:
          false as const,
      },

      unsupportedFactsInvented:
        false as const,

      unsupportedClaimsIncluded:
        false as const,

      customerCommitmentMade:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,
    },

    remediationBoundary: {
      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      containmentRecordBound:
        true as const,

      containmentIntegrityVerified:
        true as const,

      ashaOwnerReviewedInquiryBound:
        true as const,

      ashaOwnerReviewedInquiryIntegrityVerified:
        true as const,

      riyaOwnerReviewedRecommendationBound:
        true as const,

      riyaOwnerReviewedRecommendationIntegrityVerified:
        true as const,

      historicalDirectAshaToRiyaDigestLinkClaimed:
        false as const,

      remediationCompositeChainCreated:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      additiveRemediationOnly:
        true as const,

      meeraCommercialDraftCreated:
        true as const,

      ownerReviewRequired:
        true as const,

      ownerReviewDecisionRecorded:
        false as const,

      meeraCommercialEvidenceRequalified:
        false as const,

      salesCoreLaunchRequalificationEligible:
        false as const,

      runtimeActivationPreparationEligible:
        false as const,

      runtimeActivationAuthorized:
        false as const,

      runtimeActivationExecuted:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionAuthorityGranted:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      autonomousExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    reason:
      input.reason.trim(),

    nextStep:
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW" as const,

    remediatedAt:
      input.remediatedAt,
  };

  const record = deepFreeze({
    ...remediationCore,

    remediationDigest:
      sha256(remediationCore),
  }) as SalesCoreLaunchCommercialEvidenceRemediationRecord;

  validateSalesCoreLaunchCommercialEvidenceRemediationRecord(
    record,
  );

  return record;
}
