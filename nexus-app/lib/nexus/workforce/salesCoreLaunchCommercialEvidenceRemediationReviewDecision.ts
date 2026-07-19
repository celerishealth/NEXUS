import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialEvidenceRemediationRecord,
  type SalesCoreLaunchCommercialEvidenceRemediationRecord,
} from "./salesCoreLaunchCommercialEvidenceRemediationRecord";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_DECISION_VERSION =
  "sales-core-launch-commercial-evidence-remediation-review-decision-v1" as const;

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_DECISIONS =
  [
    "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION",
    "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY",
  ] as const;

export type SalesCoreLaunchCommercialEvidenceRemediationReviewDecisionType =
  (
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_DECISIONS
  )[number];

export interface CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput {
  readonly decisionId: string;

  readonly commercialEvidenceRemediation:
    SalesCoreLaunchCommercialEvidenceRemediationRecord;

  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchCommercialEvidenceRemediationReviewDecisionType;

  readonly reason: string;
  readonly reviewedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceRemediationReviewDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_RECORDED";

  readonly department:
    "SALES";

  readonly affectedEmployeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly affectedEmployeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;
  readonly sourceCompositeEvidenceDigest: string;
  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly decision:
    SalesCoreLaunchCommercialEvidenceRemediationReviewDecisionType;

  readonly approvedForControlledRequalificationPreparation:
    boolean;

  readonly reviewedEvidence: Readonly<{
    remediationState:
      "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED";

    remediationNextStep:
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW";

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

    historicalDirectAshaToRiyaDigestLinkClaimed:
      false;

    remediationCompositeChainVerified:
      true;

    productsAndServicesStatus:
      "UNRESOLVED_NO_VERIFIED_COMMERCIAL_ITEMS";

    verifiedCommercialItemCount:
      0;

    quantityStatus:
      "UNRESOLVED_NOT_VERIFIED";

    pricingStatus:
      "UNPRICED_AWAITING_VERIFIED_COMMERCIAL_INPUTS";

    currencyStatus:
      "UNRESOLVED_NOT_VERIFIED";

    pricedLineItemCount:
      0;

    unresolvedPricingInputCount:
      4;

    taxStatus:
      "UNRESOLVED_NOT_VERIFIED";

    freightStatus:
      "UNRESOLVED_NOT_VERIFIED";

    discountStatus:
      "UNRESOLVED_NOT_VERIFIED";

    validityStatus:
      "UNRESOLVED_NOT_VERIFIED";

    paymentTermStatus:
      "UNRESOLVED_NOT_VERIFIED";

    includedScopeCount:
      3;

    exclusionCount:
      3;

    dependencyCount:
      4;

    missingCommercialEvidenceCount:
      6;

    assumptionsMade:
      false;

    commercialAssumptionCount:
      0;

    commercialRiskLevel:
      "HIGH";

    pricedCommitmentAllowed:
      false;

    customerCommitmentAllowed:
      false;

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

    commercialContractFieldsPresent:
      true;

    commercialValuesInvented:
      false;

    pricedCustomerQuotationEligible:
      false;

    controlledRequalificationPreparationEligible:
      boolean;
  }>;

  readonly authorityBoundary: Readonly<{
    sourceRemediationBound:
      true;

    sourceRemediationIntegrityVerified:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    ownerReviewRequired:
      true;

    ownerDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;

    controlledRequalificationPreparationAuthorized:
      boolean;

    controlledRequalificationPreparationExecuted:
      false;

    controlledRequalificationExecutionAuthorized:
      false;

    controlledRequalificationExecuted:
      false;

    formalQualificationEngineInvocationAuthorized:
      false;

    formalQualificationEngineInvoked:
      false;

    meeraCommercialEvidenceRequalified:
      false;

    salesCoreLaunchRequalificationEligible:
      false;

    salesCoreLaunchReadinessApproved:
      false;

    activationPlanningAuthorized:
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

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    productionAuthorityGranted:
      false;

    paymentExecutionAuthorized:
      false;

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    monitoringRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly reason: string;

  readonly nextStep:
    | "PREPARE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
    | "RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY";

  readonly reviewedAt: string;
  readonly decisionDigest: string;
}

type DigestBoundRecord =
  Readonly<Record<string, unknown>>;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const FORBIDDEN_TEXT_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|api[-_]?key)/i;

function canonicalize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
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
      "Unsupported deterministic remediation-review value.",
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
    FORBIDDEN_TEXT_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a safe non-secret identifier.`,
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

function requireTimestamp(
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
    FORBIDDEN_TEXT_PATTERN.test(value)
  ) {
    throw new Error(
      "Remediation-review reason must be safe, explicit, and non-secret.",
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

export function validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
  record:
    SalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
): void {
  verifyDigestBoundObject(
    "Sales core launch commercial-remediation review decision",
    record as unknown as
      DigestBoundRecord,
    "decisionDigest",
  );

  requireSafeIdentifier(
    "Remediation-review decision ID",
    record.decisionId,
  );

  requireSafeIdentifier(
    "Remediation-review tenant ID",
    record.tenantId,
  );

  requireSafeIdentifier(
    "Remediation-review owner ID",
    record.ownerId,
  );

  requireSafeIdentifier(
    "Source remediation ID",
    record.sourceRemediationId,
  );

  requireDigest(
    "Source remediation digest",
    record.sourceRemediationDigest,
  );

  requireDigest(
    "Source composite evidence digest",
    record.sourceCompositeEvidenceDigest,
  );

  requireDigest(
    "Source containment digest",
    record.sourceContainmentDigest,
  );

  requireDigest(
    "Source registry digest",
    record.sourceRegistryDigest,
  );

  requireReason(record.reason);

  requireTimestamp(
    "Remediation-review time",
    record.reviewedAt,
  );

  const approved =
    record.decision ===
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION";

  const evidence =
    record.reviewedEvidence;

  const boundary =
    record.authorityBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_RECORDED" ||
    record.department !==
      "SALES" ||
    record.affectedEmployeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.affectedEmployeeCode !==
      "nx-sales-005" ||
    (
      record.decision !==
        "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION" &&
      record.decision !==
        "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY"
    ) ||
    record.approvedForControlledRequalificationPreparation !==
      approved ||
    evidence.remediationState !==
      "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED" ||
    evidence.remediationNextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW" ||
    evidence.evidenceClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.historicalDirectAshaToRiyaDigestLinkClaimed !==
      false ||
    evidence.remediationCompositeChainVerified !==
      true ||
    evidence.productsAndServicesStatus !==
      "UNRESOLVED_NO_VERIFIED_COMMERCIAL_ITEMS" ||
    evidence.verifiedCommercialItemCount !==
      0 ||
    evidence.quantityStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.pricingStatus !==
      "UNPRICED_AWAITING_VERIFIED_COMMERCIAL_INPUTS" ||
    evidence.currencyStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.pricedLineItemCount !==
      0 ||
    evidence.unresolvedPricingInputCount !==
      4 ||
    evidence.taxStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.freightStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.discountStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.validityStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.paymentTermStatus !==
      "UNRESOLVED_NOT_VERIFIED" ||
    evidence.includedScopeCount !==
      3 ||
    evidence.exclusionCount !==
      3 ||
    evidence.dependencyCount !==
      4 ||
    evidence.missingCommercialEvidenceCount !==
      6 ||
    evidence.assumptionsMade !==
      false ||
    evidence.commercialAssumptionCount !==
      0 ||
    evidence.commercialRiskLevel !==
      "HIGH" ||
    evidence.pricedCommitmentAllowed !==
      false ||
    evidence.customerCommitmentAllowed !==
      false ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.unsupportedClaimsIncluded !==
      false ||
    evidence.customerCommitmentMade !==
      false ||
    evidence.customerDeliveryPrepared !==
      false ||
    evidence.customerDeliveryExecuted !==
      false ||
    evidence.commercialContractFieldsPresent !==
      true ||
    evidence.commercialValuesInvented !==
      false ||
    evidence.pricedCustomerQuotationEligible !==
      false ||
    evidence.controlledRequalificationPreparationEligible !==
      approved ||
    boundary.sourceRemediationBound !==
      true ||
    boundary.sourceRemediationIntegrityVerified !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.historicalSourceDigestsPreserved !==
      true ||
    boundary.controlledRequalificationPreparationAuthorized !==
      approved ||
    boundary.controlledRequalificationPreparationExecuted !==
      false ||
    boundary.controlledRequalificationExecutionAuthorized !==
      false ||
    boundary.controlledRequalificationExecuted !==
      false ||
    boundary.formalQualificationEngineInvocationAuthorized !==
      false ||
    boundary.formalQualificationEngineInvoked !==
      false ||
    boundary.meeraCommercialEvidenceRequalified !==
      false ||
    boundary.salesCoreLaunchRequalificationEligible !==
      false ||
    boundary.salesCoreLaunchReadinessApproved !==
      false ||
    boundary.activationPlanningAuthorized !==
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
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    record.nextStep !==
      (
        approved
          ? "PREPARE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
          : "RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY"
      )
  ) {
    throw new Error(
      "Sales core launch commercial-remediation review decision is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Sales core launch commercial-remediation review decision must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
  input:
    CreateSalesCoreLaunchCommercialEvidenceRemediationReviewDecisionInput,
): SalesCoreLaunchCommercialEvidenceRemediationReviewDecision {
  const source =
    input.commercialEvidenceRemediation;

  validateSalesCoreLaunchCommercialEvidenceRemediationRecord(
    source,
  );

  requireSafeIdentifier(
    "Remediation-review decision ID",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Remediation-review owner ID",
    input.ownerId,
  );

  requireReason(input.reason);

  requireTimestamp(
    "Remediation-review time",
    input.reviewedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the commercial-remediation-bound owner may record this review.",
    );
  }

  if (
    input.decision !==
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION" &&
    input.decision !==
      "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY"
  ) {
    throw new Error(
      "Commercial-remediation review decision is invalid.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
      Date.parse(source.remediatedAt)
  ) {
    throw new Error(
      "Commercial-remediation review cannot precede remediation creation.",
    );
  }

  if (
    source.remediationState !==
      "MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_CREATED" ||
    source.nextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW" ||
    source.remediationBoundary
      .ownerReviewRequired !==
        true ||
    source.remediationBoundary
      .ownerReviewDecisionRecorded !==
        false ||
    source.remediationBoundary
      .meeraCommercialEvidenceRequalified !==
        false ||
    source.remediationBoundary
      .salesCoreLaunchRequalificationEligible !==
        false ||
    source.remediationBoundary
      .runtimeActivationAuthorized !==
        false ||
    source.remediationBoundary
      .productionAuthorityGranted !==
        false ||
    source.remediationBoundary
      .externalDeliveryAuthorized !==
        false ||
    source.remediationBoundary
      .paymentExecutionAuthorized !==
        false ||
    source.remediationBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Commercial-remediation source is not awaiting bounded owner review.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION";

  const draft =
    source.commercialDraft;

  const decisionCore = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_REVIEW_RECORDED" as const,

    department:
      "SALES" as const,

    affectedEmployeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    affectedEmployeeCode:
      "nx-sales-005" as const,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    sourceRemediationId:
      source.remediationId,

    sourceRemediationDigest:
      source.remediationDigest,

    sourceCompositeEvidenceDigest:
      source.sourceChain
        .compositeEvidenceDigest,

    sourceContainmentDigest:
      source.sourceChain
        .containmentDigest,

    sourceRegistryDigest:
      source.sourceChain
        .sourceRegistryDigest,

    decision:
      input.decision,

    approvedForControlledRequalificationPreparation:
      approved,

    reviewedEvidence: {
      remediationState:
        source.remediationState,

      remediationNextStep:
        source.nextStep,

      evidenceClassification:
        draft.evidenceClassification,

      inquiryEvidenceToolMode:
        draft.inquiryEvidenceToolMode,

      recommendationEvidenceToolMode:
        draft.recommendationEvidenceToolMode,

      quotationProposalToolMode:
        draft.quotationProposalToolMode,

      executionMode:
        draft.executionMode,

      historicalDirectAshaToRiyaDigestLinkClaimed:
        source.remediationBoundary
          .historicalDirectAshaToRiyaDigestLinkClaimed,

      remediationCompositeChainVerified:
        source.sourceChain
          .remediationCompositeChainCreated,

      productsAndServicesStatus:
        draft.productsAndServices.status,

      verifiedCommercialItemCount:
        0 as const,

      quantityStatus:
        draft.quantity.status,

      pricingStatus:
        draft.pricing.status,

      currencyStatus:
        draft.pricing.currencyStatus,

      pricedLineItemCount:
        0 as const,

      unresolvedPricingInputCount:
        4 as const,

      taxStatus:
        draft.tax.status,

      freightStatus:
        draft.freight.status,

      discountStatus:
        draft.discount.status,

      validityStatus:
        draft.validity.status,

      paymentTermStatus:
        draft.paymentTerms.status,

      includedScopeCount:
        3 as const,

      exclusionCount:
        3 as const,

      dependencyCount:
        4 as const,

      missingCommercialEvidenceCount:
        6 as const,

      assumptionsMade:
        draft.assumptionsMade,

      commercialAssumptionCount:
        0 as const,

      commercialRiskLevel:
        draft.commercialRisk.level,

      pricedCommitmentAllowed:
        draft.commercialRisk
          .pricedCommitmentAllowed,

      customerCommitmentAllowed:
        draft.commercialRisk
          .customerCommitmentAllowed,

      unsupportedFactsInvented:
        draft.unsupportedFactsInvented,

      unsupportedClaimsIncluded:
        draft.unsupportedClaimsIncluded,

      customerCommitmentMade:
        draft.customerCommitmentMade,

      customerDeliveryPrepared:
        draft.customerDeliveryPrepared,

      customerDeliveryExecuted:
        draft.customerDeliveryExecuted,

      commercialContractFieldsPresent:
        true as const,

      commercialValuesInvented:
        false as const,

      pricedCustomerQuotationEligible:
        false as const,

      controlledRequalificationPreparationEligible:
        approved,
    },

    authorityBoundary: {
      sourceRemediationBound:
        true as const,

      sourceRemediationIntegrityVerified:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      ownerReviewRequired:
        true as const,

      ownerDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      controlledRequalificationPreparationAuthorized:
        approved,

      controlledRequalificationPreparationExecuted:
        false as const,

      controlledRequalificationExecutionAuthorized:
        false as const,

      controlledRequalificationExecuted:
        false as const,

      formalQualificationEngineInvocationAuthorized:
        false as const,

      formalQualificationEngineInvoked:
        false as const,

      meeraCommercialEvidenceRequalified:
        false as const,

      salesCoreLaunchRequalificationEligible:
        false as const,

      salesCoreLaunchReadinessApproved:
        false as const,

      activationPlanningAuthorized:
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

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      productionAuthorityGranted:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      autonomousExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      monitoringRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    reason:
      input.reason.trim(),

    nextStep:
      (
        approved
          ? "PREPARE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
          : "RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY"
      ) as
        | "PREPARE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
        | "RETAIN_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_DRAFT_ONLY",

    reviewedAt:
      input.reviewedAt,
  };

  const record = deepFreeze({
    ...decisionCore,

    decisionDigest:
      sha256(decisionCore),
  }) as SalesCoreLaunchCommercialEvidenceRemediationReviewDecision;

  validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
    record,
  );

  return record;
}
