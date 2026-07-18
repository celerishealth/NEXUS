import {
  createHash,
} from "node:crypto";

import {
  validateMeeraControlledShadowOperationExecution,
  type MeeraControlledShadowOperationExecution,
} from "./meeraControlledShadowOperationExecution";

export const MEERA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION =
  "nexus-meera-owner-controlled-shadow-operation-review-decision-v1" as const;

export const MEERA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
  "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",
] as const;

export type MeeraOwnerControlledShadowOperationReviewDecisionType =
  (
    typeof MEERA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISIONS
  )[number];

export interface CreateMeeraOwnerControlledShadowOperationReviewDecisionInput {
  readonly controlledShadowOperationExecution:
    MeeraControlledShadowOperationExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerControlledShadowOperationReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerControlledShadowOperationReviewDecision {
  readonly version:
    typeof MEERA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly displayName:
    "Meera";

  readonly officialRole:
    "AI Quotation & Proposal Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly runtimeIssuanceId:
    string;

  readonly runtimeIssuanceDigest:
    string;

  readonly runtimeId:
    string;

  readonly runtimeDigest:
    string;

  readonly qualifiedManifestDigest:
    string;

  readonly sourceRegistryCreatedAt:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerControlledShadowOperationReviewDecisionType;

  readonly shadowOperationApproved:
    boolean;

  readonly limitedInternalPilotPreparationEligible:
    boolean;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    inquiryEvidenceId:
      "synthetic-meera-inquiry-evidence-001";

    recommendationEvidenceId:
      "synthetic-meera-recommendation-evidence-001";

    quotationProposalId:
      "synthetic-meera-quotation-proposal-draft-001";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolId:
      "tool-inquiry-read";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    recommendationEvidenceToolId:
      "tool-recommendation-read";

    recommendationEvidenceToolMode:
      "READ_ONLY";

    quotationProposalToolId:
      "tool-quotation-proposal-draft";

    quotationProposalToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    maximumQuotationProposalCount:
      1;

    actualQuotationProposalCount:
      1;

    quotationProposalStatus:
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    commercialRiskLevel:
      "MEDIUM";

    verifiedFactCount:
      3;

    missingEvidenceCount:
      3;

    commercialAssumptionCount:
      3;

    scopeExclusionCount:
      3;

    unsupportedFactsInvented:
      false;

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    controlledShadowExecutionBound:
      true;

    controlledShadowExecutionIntegrityVerified:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    qualifiedManifestBound:
      true;

    registryCreationTimeBound:
      true;

    syntheticSanitizedDataOnly:
      true;

    maximumOneQuotationProposalVerified:
      true;

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    ownerReviewDecisionRecorded:
      true;

    limitedInternalPilotPreparationAuthorized:
      boolean;

    limitedInternalPilotExecutionAuthorized:
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

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "PREPARE_LIMITED_INTERNAL_PILOT"
    | "RETAIN_CONTROLLED_SHADOW_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

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

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function normalizeForDigest(
  value:
    unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      normalizeForDigest,
    );
  }

  if (
    value !== null &&
    typeof value ===
      "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [
          key,
          normalizeForDigest(
            record[key],
          ),
        ]),
    );
  }

  return value;
}

function sha256(
  value:
    unknown,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        normalizeForDigest(value),
      ),
    )
    .digest("hex");
}

function deepFreeze<T>(
  value:
    T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value ===
      "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const child of Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(child);
    }

    Object.freeze(value);
  }

  return value;
}

function requireIdentifier(
  field:
    string,
  value:
    string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${field} is invalid.`,
    );
  }
}

function requireDigest(
  field:
    string,
  value:
    string,
): void {
  if (
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${field} is invalid.`,
    );
  }
}

function requireIsoTimestamp(
  field:
    string,
  value:
    string,
): void {
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(parsed) ||
    new Date(parsed).toISOString() !==
      value
  ) {
    throw new Error(
      `${field} is invalid.`,
    );
  }
}

function requireReason(
  value:
    string,
): string {
  const reason =
    value.trim();

  if (
    reason.length < 12 ||
    reason.length > 500
  ) {
    throw new Error(
      "Owner controlled-shadow review reason is invalid.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(reason)
  ) {
    throw new Error(
      "Owner controlled-shadow review reason contains prohibited secret-bearing content.",
    );
  }

  return reason;
}

function validateExecutionForReview(
  source:
    MeeraControlledShadowOperationExecution,
): void {
  validateMeeraControlledShadowOperationExecution(
    source,
  );

  if (
    source.nextStep !==
      "AWAIT_OWNER_SHADOW_OPERATION_REVIEW" ||
    source.quotationProposalDraft
      .quotationProposalStatus !==
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    source.quotationProposalDraft
      .ownerDecisionMade !==
      false ||
    source.quotationProposalDraft
      .customerDeliveryPrepared !==
      false ||
    source.quotationProposalDraft
      .customerDeliveryExecuted !==
      false ||
    source.executionBoundary
      .ownerDecisionMade !==
      false ||
    source.executionBoundary
      .ownerReviewRequired !==
      true ||
    source.executionBoundary
      .quotationProposalCreatorInvocationCount !==
      1 ||
    source.executionBoundary
      .realCustomerDataAccessAuthorized !==
      false ||
    source.executionBoundary
      .realCustomerContactAuthorized !==
      false ||
    source.executionBoundary
      .externalDeliveryAuthorized !==
      false ||
    source.executionBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    source.executionBoundary
      .productionDatabaseAuthorized !==
      false ||
    source.executionBoundary
      .productionMutationAuthorized !==
      false ||
    source.executionBoundary
      .paymentExecutionAuthorized !==
      false ||
    source.executionBoundary
      .autonomousDecisionAuthorized !==
      false ||
    source.executionBoundary
      .productionReadinessAuthorized !==
      false ||
    source.executionBoundary
      .publicLaunchAuthorized !==
      false ||
    source.executionBoundary
      .emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "A valid Workforce Day 92 Meera controlled shadow execution awaiting owner review is required.",
    );
  }
}

export function validateMeeraOwnerControlledShadowOperationReviewDecision(
  decision:
    MeeraOwnerControlledShadowOperationReviewDecision,
): void {
  const approved =
    decision.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION";

  if (
    decision.version !==
      MEERA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED" ||
    decision.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    decision.templateId !==
      EXPECTED_TEMPLATE_ID ||
    decision.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    decision.displayName !==
      EXPECTED_DISPLAY_NAME ||
    decision.officialRole !==
      EXPECTED_ROLE ||
    decision.department !==
      EXPECTED_DEPARTMENT ||
    decision.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    (
      decision.decision !==
        "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" &&
      decision.decision !==
        "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION"
    ) ||
    decision.shadowOperationApproved !==
      approved ||
    decision
      .limitedInternalPilotPreparationEligible !==
      approved ||
    decision.nextStep !==
      (
        approved
          ? "PREPARE_LIMITED_INTERNAL_PILOT"
          : "RETAIN_CONTROLLED_SHADOW_ONLY"
      )
  ) {
    throw new Error(
      "Meera owner controlled-shadow review decision identity is invalid.",
    );
  }

  requireIdentifier(
    "Meera controlled-shadow review decisionId",
    decision.decisionId,
  );

  requireIdentifier(
    "Meera controlled-shadow review ownerId",
    decision.ownerId,
  );

  requireIdentifier(
    "Meera controlled shadow executionId",
    decision.controlledShadowExecutionId,
  );

  requireIdentifier(
    "Meera controlled shadow preparationId",
    decision.preparationId,
  );

  requireIdentifier(
    "Meera runtime issuanceId",
    decision.runtimeIssuanceId,
  );

  requireIdentifier(
    "Meera runtimeId",
    decision.runtimeId,
  );

  requireIdentifier(
    "Meera tenantId",
    decision.tenantId,
  );

  requireDigest(
    "Meera controlled shadow execution digest",
    decision.controlledShadowExecutionDigest,
  );

  requireDigest(
    "Meera controlled shadow preparation digest",
    decision.preparationDigest,
  );

  requireDigest(
    "Meera runtime issuance digest",
    decision.runtimeIssuanceDigest,
  );

  requireDigest(
    "Meera runtime digest",
    decision.runtimeDigest,
  );

  requireDigest(
    "Meera qualified manifest digest",
    decision.qualifiedManifestDigest,
  );

  requireIsoTimestamp(
    "Meera source registry creation time",
    decision.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Meera controlled-shadow review decision time",
    decision.decidedAt,
  );

  if (
    requireReason(decision.reason) !==
      decision.reason
  ) {
    throw new Error(
      "Owner controlled-shadow review reason must be normalized.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.inquiryEvidenceId !==
      "synthetic-meera-inquiry-evidence-001" ||
    evidence.recommendationEvidenceId !==
      "synthetic-meera-recommendation-evidence-001" ||
    evidence.quotationProposalId !==
      "synthetic-meera-quotation-proposal-draft-001" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolId !==
      "tool-inquiry-read" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.recommendationEvidenceToolId !==
      "tool-recommendation-read" ||
    evidence.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.quotationProposalToolId !==
      "tool-quotation-proposal-draft" ||
    evidence.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.maximumQuotationProposalCount !==
      1 ||
    evidence.actualQuotationProposalCount !==
      1 ||
    evidence.quotationProposalStatus !==
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    evidence.commercialRiskLevel !==
      "MEDIUM" ||
    evidence.verifiedFactCount !==
      3 ||
    evidence.missingEvidenceCount !==
      3 ||
    evidence.commercialAssumptionCount !==
      3 ||
    evidence.scopeExclusionCount !==
      3 ||
    evidence.unsupportedFactsInvented !==
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
      "Meera controlled-shadow reviewed evidence is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.controlledShadowExecutionBound !==
      true ||
    boundary.controlledShadowExecutionIntegrityVerified !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.syntheticSanitizedDataOnly !==
      true ||
    boundary.maximumOneQuotationProposalVerified !==
      true ||
    boundary.ownerDecisionRequired !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.limitedInternalPilotPreparationAuthorized !==
      approved ||
    boundary.limitedInternalPilotExecutionAuthorized !==
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
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Meera owner controlled-shadow review authority boundary is invalid.",
    );
  }

  const {
    decisionDigest,
    ...decisionCore
  } = decision;

  if (
    sha256(decisionCore) !==
      decisionDigest
  ) {
    throw new Error(
      "Workforce Day 93 Meera owner review decision integrity verification failed.",
    );
  }
}

export function createMeeraOwnerControlledShadowOperationReviewDecision(
  input:
    CreateMeeraOwnerControlledShadowOperationReviewDecisionInput,
): MeeraOwnerControlledShadowOperationReviewDecision {
  const source =
    input.controlledShadowOperationExecution;

  validateExecutionForReview(
    source,
  );

  requireIdentifier(
    "Meera controlled-shadow review decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "Meera controlled-shadow review ownerId",
    input.ownerId,
  );

  requireIsoTimestamp(
    "Meera controlled-shadow review decision time",
    input.decidedAt,
  );

  const reason =
    requireReason(input.reason);

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Meera controlled-shadow-bound owner can issue the review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" &&
    input.decision !==
      "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION"
  ) {
    throw new Error(
      "Meera owner controlled-shadow review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Meera owner controlled-shadow review decision cannot precede shadow execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION";

  const decisionCore = {
    version:
      MEERA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED" as const,

    employeeId:
      EXPECTED_EMPLOYEE_ID,

    templateId:
      EXPECTED_TEMPLATE_ID,

    employeeCode:
      EXPECTED_EMPLOYEE_CODE,

    displayName:
      EXPECTED_DISPLAY_NAME,

    officialRole:
      EXPECTED_ROLE,

    department:
      EXPECTED_DEPARTMENT,

    autonomyLevel:
      EXPECTED_AUTONOMY_LEVEL,

    controlledShadowExecutionId:
      source.executionId,

    controlledShadowExecutionDigest:
      source.executionDigest,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    runtimeIssuanceId:
      source.runtimeIssuanceId,

    runtimeIssuanceDigest:
      source.runtimeIssuanceDigest,

    runtimeId:
      source.runtimeId,

    runtimeDigest:
      source.runtimeDigest,

    qualifiedManifestDigest:
      source.qualifiedManifestDigest,

    sourceRegistryCreatedAt:
      source.sourceRegistryCreatedAt,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    shadowOperationApproved:
      approved,

    limitedInternalPilotPreparationEligible:
      approved,

    reason,

    reviewedEvidence: {
      inquiryEvidenceId:
        source.syntheticInquiryEvidence
          .inquiryEvidenceId,

      recommendationEvidenceId:
        source.syntheticRecommendationEvidence
          .recommendationEvidenceId,

      quotationProposalId:
        source.quotationProposalDraft
          .quotationProposalId,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceToolId:
        "tool-inquiry-read" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      recommendationEvidenceToolId:
        "tool-recommendation-read" as const,

      recommendationEvidenceToolMode:
        "READ_ONLY" as const,

      quotationProposalToolId:
        source.quotationProposalDraft
          .toolId,

      quotationProposalToolMode:
        source.quotationProposalDraft
          .toolMode,

      executionMode:
        "SANDBOX_ONLY" as const,

      maximumQuotationProposalCount:
        1 as const,

      actualQuotationProposalCount:
        source.executionBoundary
          .quotationProposalCreatorInvocationCount,

      quotationProposalStatus:
        source.quotationProposalDraft
          .quotationProposalStatus,

      commercialRiskLevel:
        source.quotationProposalDraft
          .commercialRiskLevel,

      verifiedFactCount:
        source.syntheticInquiryEvidence
          .verifiedFacts.length as 3,

      missingEvidenceCount:
        source.syntheticInquiryEvidence
          .missingEvidence.length as 3,

      commercialAssumptionCount:
        source.quotationProposalDraft
          .commercialAssumptions.length as 3,

      scopeExclusionCount:
        source.quotationProposalDraft
          .scopeAndExclusions.length as 3,

      unsupportedFactsInvented:
        source.syntheticInquiryEvidence
          .unsupportedFactsInvented,

      unsupportedClaimsIncluded:
        source.quotationProposalDraft
          .unsupportedClaimsIncluded,

      urgencyExaggerated:
        source.quotationProposalDraft
          .urgencyExaggerated,

      guaranteeMade:
        source.quotationProposalDraft
          .guaranteeMade,

      customerDeliveryPrepared:
        source.quotationProposalDraft
          .customerDeliveryPrepared,

      customerDeliveryExecuted:
        source.quotationProposalDraft
          .customerDeliveryExecuted,
    } as const,

    authorityBoundary: {
      controlledShadowExecutionBound:
        true,

      controlledShadowExecutionIntegrityVerified:
        true,

      ownerIdentityBound:
        true,

      tenantIdentityBound:
        true,

      runtimeIdentityBound:
        true,

      qualifiedManifestBound:
        true,

      registryCreationTimeBound:
        true,

      syntheticSanitizedDataOnly:
        true,

      maximumOneQuotationProposalVerified:
        true,

      ownerDecisionRequired:
        true,

      approvalBypassAllowed:
        false,

      ownerReviewDecisionRecorded:
        true,

      limitedInternalPilotPreparationAuthorized:
        approved,

      limitedInternalPilotExecutionAuthorized:
        false,

      quotationProposalCustomerDeliveryAuthorized:
        false,

      realCustomerDataAccessAuthorized:
        false,

      realCustomerContactAuthorized:
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

      emergencyPauseAvailable:
        true,
    } as const,

    nextStep:
      approved
        ? "PREPARE_LIMITED_INTERNAL_PILOT" as const
        : "RETAIN_CONTROLLED_SHADOW_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerControlledShadowOperationReviewDecision;

  validateMeeraOwnerControlledShadowOperationReviewDecision(
    decision,
  );

  return decision;
}
