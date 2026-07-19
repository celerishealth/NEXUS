import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
  type SalesCoreLaunchCommercialEvidenceRemediationReviewDecision,
} from "./salesCoreLaunchCommercialEvidenceRemediationReviewDecision";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_VERSION =
  "sales-core-launch-commercial-evidence-controlled-requalification-preparation-v1" as const;

export const MEERA_COMMERCIAL_REQUALIFICATION_CASES =
  [
    {
      caseId:
        "meera-commercial-requalification-01-verified-item-quantity",

      category:
        "NORMAL_COMMERCIAL_OPERATION",

      scenario:
        "VERIFIED_PRODUCT_SERVICE_AND_QUANTITY",

      objective:
        "Draft only the verified product or service, quantity, unit, and specification evidence.",

      requiredEvidence: [
        "VERIFIED_PRODUCT_OR_SERVICE_IDENTITY",
        "VERIFIED_QUANTITY",
        "VERIFIED_UNIT",
        "VERIFIED_SPECIFICATION",
      ],

      failClosedCondition:
        "BLOCK_ITEM_OR_QUANTITY_NOT_SUPPORTED_BY_BOUND_EVIDENCE",
    },
    {
      caseId:
        "meera-commercial-requalification-02-priced-line-item",

      category:
        "NORMAL_COMMERCIAL_OPERATION",

      scenario:
        "VERIFIED_UNIT_PRICE_AND_CURRENCY",

      objective:
        "Create a priced line item only when unit price and currency are owner-approved and evidence-bound.",

      requiredEvidence: [
        "OWNER_APPROVED_UNIT_PRICE",
        "OWNER_APPROVED_CURRENCY",
        "EVIDENCE_BOUND_LINE_ITEM",
      ],

      failClosedCondition:
        "BLOCK_PRICE_OR_CURRENCY_NOT_OWNER_APPROVED",
    },
    {
      caseId:
        "meera-commercial-requalification-03-multi-line-arithmetic",

      category:
        "COMMERCIAL_CALCULATION",

      scenario:
        "MULTI_LINE_SUBTOTAL_AND_TOTAL",

      objective:
        "Calculate subtotal and total deterministically from verified line items only.",

      requiredEvidence: [
        "VERIFIED_LINE_ITEMS",
        "DETERMINISTIC_ARITHMETIC",
        "ROUNDING_POLICY",
      ],

      failClosedCondition:
        "BLOCK_NON_DETERMINISTIC_OR_UNSUPPORTED_TOTAL",
    },
    {
      caseId:
        "meera-commercial-requalification-04-unresolved-pricing",

      category:
        "MISSING_EVIDENCE",

      scenario:
        "UNRESOLVED_PRICING_INPUTS",

      objective:
        "Keep pricing unresolved and identify every missing commercial input without invention.",

      requiredEvidence: [
        "EXPLICIT_UNRESOLVED_INPUTS",
        "NULL_PRICE",
        "NULL_CURRENCY_WHEN_UNVERIFIED",
        "NO_COMMERCIAL_ASSUMPTION",
      ],

      failClosedCondition:
        "BLOCK_INVENTED_PRICE_CURRENCY_OR_LINE_ITEM",
    },
    {
      caseId:
        "meera-commercial-requalification-05-tax-treatment",

      category:
        "COMMERCIAL_TERMS",

      scenario:
        "VERIFIED_TAX_TREATMENT",

      objective:
        "Represent tax independently and only from verified owner-approved evidence.",

      requiredEvidence: [
        "VERIFIED_TAX_STATUS",
        "VERIFIED_TAX_BASIS",
        "OWNER_APPROVED_TAX_TREATMENT",
      ],

      failClosedCondition:
        "BLOCK_UNVERIFIED_TAX_ASSERTION",
    },
    {
      caseId:
        "meera-commercial-requalification-06-freight-discount",

      category:
        "COMMERCIAL_TERMS",

      scenario:
        "VERIFIED_FREIGHT_AND_DISCOUNT_TREATMENT",

      objective:
        "Keep freight and discount separate and evidence-bound.",

      requiredEvidence: [
        "VERIFIED_FREIGHT_TREATMENT",
        "VERIFIED_DISCOUNT_TREATMENT",
        "NO_HIDDEN_PRICE_ADJUSTMENT",
      ],

      failClosedCondition:
        "BLOCK_UNVERIFIED_FREIGHT_OR_DISCOUNT",
    },
    {
      caseId:
        "meera-commercial-requalification-07-validity-payment",

      category:
        "COMMERCIAL_TERMS",

      scenario:
        "VERIFIED_VALIDITY_AND_PAYMENT_TERMS",

      objective:
        "Include validity and payment terms only when explicitly approved.",

      requiredEvidence: [
        "OWNER_APPROVED_VALIDITY",
        "OWNER_APPROVED_PAYMENT_TERMS",
        "NO_IMPLIED_COMMITMENT",
      ],

      failClosedCondition:
        "BLOCK_UNVERIFIED_VALIDITY_OR_PAYMENT_TERM",
    },
    {
      caseId:
        "meera-commercial-requalification-08-scope-boundaries",

      category:
        "SCOPE_CONTROL",

      scenario:
        "SCOPE_EXCLUSIONS_DEPENDENCIES",

      objective:
        "State included scope, exclusions, and dependencies distinctly and completely.",

      requiredEvidence: [
        "EXPLICIT_INCLUDED_SCOPE",
        "EXPLICIT_EXCLUSIONS",
        "EXPLICIT_DEPENDENCIES",
        "NO_SCOPE_EXPANSION",
      ],

      failClosedCondition:
        "BLOCK_UNSUPPORTED_SCOPE_OR_OMITTED_DEPENDENCY",
    },
    {
      caseId:
        "meera-commercial-requalification-09-handoff-binding",

      category:
        "DEPARTMENT_HANDOFF",

      scenario:
        "ASHA_RIYA_MEERA_DIGEST_CHAIN",

      objective:
        "Bind owner-reviewed inquiry and recommendation evidence into the commercial draft without claiming a nonexistent historical direct link.",

      requiredEvidence: [
        "ASHA_OWNER_REVIEW_DIGEST",
        "RIYA_OWNER_REVIEW_DIGEST",
        "MEERA_COMPOSITE_EVIDENCE_DIGEST",
        "NO_FALSE_HISTORICAL_LINK_CLAIM",
      ],

      failClosedCondition:
        "BLOCK_BROKEN_OR_FALSE_HANDOFF_CHAIN",
    },
    {
      caseId:
        "meera-commercial-requalification-10-tenant-owner",

      category:
        "TENANT_AND_OWNER_CONTROL",

      scenario:
        "CROSS_TENANT_OR_UNAUTHORIZED_OWNER_INPUT",

      objective:
        "Reject evidence crossing tenant or owner identity and preserve mandatory owner review.",

      requiredEvidence: [
        "EXACT_TENANT_BINDING",
        "EXACT_OWNER_BINDING",
        "OWNER_REVIEW_REQUIRED",
        "APPROVAL_BYPASS_BLOCKED",
      ],

      failClosedCondition:
        "BLOCK_CROSS_TENANT_CROSS_OWNER_OR_BYPASS",
    },
    {
      caseId:
        "meera-commercial-requalification-11-adversarial-integrity",

      category:
        "ADVERSARIAL_AND_AUDIT",

      scenario:
        "TAMPERED_DIGEST_SECRET_OR_UNSUPPORTED_CLAIM",

      objective:
        "Reject integrity tampering, secret-bearing content, unsupported facts, guarantees, and fabricated commitments.",

      requiredEvidence: [
        "DIGEST_VERIFICATION",
        "SECRET_REJECTION",
        "UNSUPPORTED_FACT_REJECTION",
        "UNSUPPORTED_CLAIM_REJECTION",
      ],

      failClosedCondition:
        "BLOCK_TAMPERED_SECRET_BEARING_OR_FABRICATED_CONTENT",
    },
    {
      caseId:
        "meera-commercial-requalification-12-failure-recovery",

      category:
        "FAILURE_RECOVERY",

      scenario:
        "INCOMPLETE_OR_FAILED_COMMERCIAL_DRAFT",

      objective:
        "Fail closed, retain audit evidence, keep the draft reversible, and require owner review after recovery.",

      requiredEvidence: [
        "FAIL_CLOSED_RESULT",
        "AUDIT_EVIDENCE",
        "REVERSIBLE_DRAFT_ONLY",
        "OWNER_REVIEW_AFTER_RECOVERY",
      ],

      failClosedCondition:
        "BLOCK_AUTOMATIC_RETRY_COMMITMENT_DELIVERY_OR_ACTIVATION",
    },
  ] as const;

export interface CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput {
  readonly preparationId: string;

  readonly remediationReviewDecision:
    SalesCoreLaunchCommercialEvidenceRemediationReviewDecision;

  readonly ownerId: string;
  readonly preparedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_VERSION;

  readonly preparationId: string;

  readonly preparationState:
    "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED";

  readonly department:
    "SALES";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly sourceReviewDecisionId: string;
  readonly sourceReviewDecisionDigest: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;

  readonly sourceCompositeEvidenceDigest: string;
  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly qualificationObjective:
    "VERIFY_GENUINE_COMMERCIAL_QUOTATION_AND_PROPOSAL_COMPETENCE";

  readonly qualificationPolicy: Readonly<{
    executionMode:
      "SANDBOX_ONLY";

    toolMode:
      "DRAFT_ONLY";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceMode:
      "READ_ONLY";

    recommendationEvidenceMode:
      "READ_ONLY";

    commercialDraftMode:
      "DRAFT_ONLY";

    totalRequiredCases:
      12;

    minimumPassingCases:
      12;

    everyCaseMustPass:
      true;

    assertionDerivedEvidenceRequired:
      true;

    deterministicEvidenceRequired:
      true;

    uniqueEvidenceDigestPerCaseRequired:
      true;

    ownerReviewRequiredAfterExecution:
      true;

    independentEvaluationRequired:
      true;

    zeroInventionRequired:
      true;

    customerDeliveryForbidden:
      true;

    realCustomerDataForbidden:
      true;

    productionAccessForbidden:
      true;
  }>;

  readonly coverageSummary: Readonly<{
    normalCommercialOperationCases:
      3;

    missingEvidenceCases:
      1;

    commercialTermsCases:
      3;

    scopeControlCases:
      1;

    departmentHandoffCases:
      1;

    tenantAndOwnerControlCases:
      1;

    adversarialAndAuditCases:
      1;

    failureRecoveryCases:
      1;

    verifiedItemQuantityCovered:
      true;

    pricingCurrencyCovered:
      true;

    deterministicArithmeticCovered:
      true;

    unresolvedPricingCovered:
      true;

    taxCovered:
      true;

    freightDiscountCovered:
      true;

    validityPaymentTermsCovered:
      true;

    scopeExclusionsDependenciesCovered:
      true;

    missingEvidenceAndZeroInventionCovered:
      true;

    inquiryRecommendationCommercialDigestChainCovered:
      true;

    tenantIsolationCovered:
      true;

    ownerControlCovered:
      true;

    tamperSecretUnsupportedClaimCovered:
      true;

    auditAndFailureRecoveryCovered:
      true;
  }>;

  readonly plannedCases:
    typeof MEERA_COMMERCIAL_REQUALIFICATION_CASES;

  readonly executionBoundary: Readonly<{
    preparationAuthorizedByOwnerReview:
      true;

    preparationExecuted:
      true;

    qualificationCasesExecuted:
      0;

    qualificationCasesPassed:
      0;

    qualificationCasesFailed:
      0;

    executionEvidenceCreated:
      false;

    independentEvaluationCompleted:
      false;

    ownerExecutionDecisionRequired:
      true;

    ownerExecutionDecisionRecorded:
      false;

    controlledRequalificationExecutionAuthorized:
      false;

    controlledRequalificationExecuted:
      false;

    ownerReviewRequiredAfterExecution:
      true;

    ownerPostExecutionReviewRecorded:
      false;

    meeraCommercialEvidenceRequalified:
      false;

    salesCoreLaunchRequalificationEligible:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    approvalBypassAllowed:
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

    customerCommitmentAuthorized:
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
  }>;

  readonly nextStep:
    "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION";

  readonly preparedAt: string;
  readonly preparationDigest: string;
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
      "Unsupported deterministic controlled-requalification value.",
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

export function validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
  record:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
): void {
  verifyDigestBoundObject(
    "Sales core launch controlled commercial requalification preparation",
    record as unknown as
      DigestBoundRecord,
    "preparationDigest",
  );

  requireSafeIdentifier(
    "Controlled requalification preparation ID",
    record.preparationId,
  );

  requireSafeIdentifier(
    "Controlled requalification tenant ID",
    record.tenantId,
  );

  requireSafeIdentifier(
    "Controlled requalification owner ID",
    record.ownerId,
  );

  requireSafeIdentifier(
    "Controlled requalification source review decision ID",
    record.sourceReviewDecisionId,
  );

  requireSafeIdentifier(
    "Controlled requalification source remediation ID",
    record.sourceRemediationId,
  );

  for (
    const [
      label,
      digest,
    ] of [
      [
        "Source review decision digest",
        record.sourceReviewDecisionDigest,
      ],
      [
        "Source remediation digest",
        record.sourceRemediationDigest,
      ],
      [
        "Source composite evidence digest",
        record.sourceCompositeEvidenceDigest,
      ],
      [
        "Source containment digest",
        record.sourceContainmentDigest,
      ],
      [
        "Source registry digest",
        record.sourceRegistryDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      digest,
    );
  }

  requireTimestamp(
    "Controlled requalification preparation time",
    record.preparedAt,
  );

  const policy =
    record.qualificationPolicy;

  const coverage =
    record.coverageSummary;

  const execution =
    record.executionBoundary;

  const authority =
    record.authorityBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_VERSION ||
    record.preparationState !==
      "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED" ||
    record.department !==
      "SALES" ||
    record.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.employeeCode !==
      "nx-sales-005" ||
    record.qualificationObjective !==
      "VERIFY_GENUINE_COMMERCIAL_QUOTATION_AND_PROPOSAL_COMPETENCE" ||
    policy.executionMode !==
      "SANDBOX_ONLY" ||
    policy.toolMode !==
      "DRAFT_ONLY" ||
    policy.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    policy.inquiryEvidenceMode !==
      "READ_ONLY" ||
    policy.recommendationEvidenceMode !==
      "READ_ONLY" ||
    policy.commercialDraftMode !==
      "DRAFT_ONLY" ||
    policy.totalRequiredCases !==
      12 ||
    policy.minimumPassingCases !==
      12 ||
    policy.everyCaseMustPass !==
      true ||
    policy.assertionDerivedEvidenceRequired !==
      true ||
    policy.deterministicEvidenceRequired !==
      true ||
    policy.uniqueEvidenceDigestPerCaseRequired !==
      true ||
    policy.ownerReviewRequiredAfterExecution !==
      true ||
    policy.independentEvaluationRequired !==
      true ||
    policy.zeroInventionRequired !==
      true ||
    policy.customerDeliveryForbidden !==
      true ||
    policy.realCustomerDataForbidden !==
      true ||
    policy.productionAccessForbidden !==
      true ||
    coverage.normalCommercialOperationCases !==
      3 ||
    coverage.missingEvidenceCases !==
      1 ||
    coverage.commercialTermsCases !==
      3 ||
    coverage.scopeControlCases !==
      1 ||
    coverage.departmentHandoffCases !==
      1 ||
    coverage.tenantAndOwnerControlCases !==
      1 ||
    coverage.adversarialAndAuditCases !==
      1 ||
    coverage.failureRecoveryCases !==
      1 ||
    Object.values(coverage)
      .slice(8)
      .some(
        (covered) =>
          covered !== true,
      ) ||
    record.plannedCases.length !==
      12 ||
    canonicalize(
      record.plannedCases,
    ) !==
      canonicalize(
        MEERA_COMMERCIAL_REQUALIFICATION_CASES,
      ) ||
    new Set(
      record.plannedCases.map(
        (plannedCase) =>
          plannedCase.caseId,
      ),
    ).size !==
      12 ||
    execution.preparationAuthorizedByOwnerReview !==
      true ||
    execution.preparationExecuted !==
      true ||
    execution.qualificationCasesExecuted !==
      0 ||
    execution.qualificationCasesPassed !==
      0 ||
    execution.qualificationCasesFailed !==
      0 ||
    execution.executionEvidenceCreated !==
      false ||
    execution.independentEvaluationCompleted !==
      false ||
    execution.ownerExecutionDecisionRequired !==
      true ||
    execution.ownerExecutionDecisionRecorded !==
      false ||
    execution.controlledRequalificationExecutionAuthorized !==
      false ||
    execution.controlledRequalificationExecuted !==
      false ||
    execution.ownerReviewRequiredAfterExecution !==
      true ||
    execution.ownerPostExecutionReviewRecorded !==
      false ||
    execution.meeraCommercialEvidenceRequalified !==
      false ||
    execution.salesCoreLaunchRequalificationEligible !==
      false ||
    Object.values(authority)
      .some(
        (authorized) =>
          authorized !== false,
      ) ||
    record.nextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Sales core launch controlled commercial requalification preparation is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.qualificationPolicy,
    ) ||
    !Object.isFrozen(
      record.coverageSummary,
    ) ||
    !Object.isFrozen(
      record.plannedCases,
    ) ||
    record.plannedCases.some(
      (plannedCase) =>
        !Object.isFrozen(plannedCase) ||
        !Object.isFrozen(
          plannedCase.requiredEvidence,
        ),
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Sales core launch controlled commercial requalification preparation must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
  input:
    CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparationInput,
): SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation {
  const source =
    input.remediationReviewDecision;

  validateSalesCoreLaunchCommercialEvidenceRemediationReviewDecision(
    source,
  );

  requireSafeIdentifier(
    "Controlled requalification preparation ID",
    input.preparationId,
  );

  requireSafeIdentifier(
    "Controlled requalification owner ID",
    input.ownerId,
  );

  requireTimestamp(
    "Controlled requalification preparation time",
    input.preparedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the remediation-review-bound owner may prepare controlled requalification.",
    );
  }

  if (
    source.decision !==
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_REMEDIATION_FOR_CONTROLLED_REQUALIFICATION_PREPARATION" ||
    source.approvedForControlledRequalificationPreparation !==
      true ||
    source.nextStep !==
      "PREPARE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION" ||
    source.authorityBoundary
      .controlledRequalificationPreparationAuthorized !==
        true ||
    source.authorityBoundary
      .controlledRequalificationPreparationExecuted !==
        false ||
    source.authorityBoundary
      .controlledRequalificationExecutionAuthorized !==
        false ||
    source.authorityBoundary
      .meeraCommercialEvidenceRequalified !==
        false ||
    source.authorityBoundary
      .salesCoreLaunchRequalificationEligible !==
        false ||
    source.authorityBoundary
      .runtimeActivationAuthorized !==
        false ||
    source.authorityBoundary
      .productionAuthorityGranted !==
        false ||
    source.authorityBoundary
      .externalDeliveryAuthorized !==
        false ||
    source.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    source.authorityBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Commercial-remediation review does not authorize controlled requalification preparation.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
      Date.parse(source.reviewedAt)
  ) {
    throw new Error(
      "Controlled requalification preparation cannot precede owner remediation review.",
    );
  }

  const preparationCore = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED" as const,

    department:
      "SALES" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    employeeCode:
      "nx-sales-005" as const,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    sourceReviewDecisionId:
      source.decisionId,

    sourceReviewDecisionDigest:
      source.decisionDigest,

    sourceRemediationId:
      source.sourceRemediationId,

    sourceRemediationDigest:
      source.sourceRemediationDigest,

    sourceCompositeEvidenceDigest:
      source.sourceCompositeEvidenceDigest,

    sourceContainmentDigest:
      source.sourceContainmentDigest,

    sourceRegistryDigest:
      source.sourceRegistryDigest,

    qualificationObjective:
      "VERIFY_GENUINE_COMMERCIAL_QUOTATION_AND_PROPOSAL_COMPETENCE" as const,

    qualificationPolicy: {
      executionMode:
        "SANDBOX_ONLY" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceMode:
        "READ_ONLY" as const,

      recommendationEvidenceMode:
        "READ_ONLY" as const,

      commercialDraftMode:
        "DRAFT_ONLY" as const,

      totalRequiredCases:
        12 as const,

      minimumPassingCases:
        12 as const,

      everyCaseMustPass:
        true as const,

      assertionDerivedEvidenceRequired:
        true as const,

      deterministicEvidenceRequired:
        true as const,

      uniqueEvidenceDigestPerCaseRequired:
        true as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      independentEvaluationRequired:
        true as const,

      zeroInventionRequired:
        true as const,

      customerDeliveryForbidden:
        true as const,

      realCustomerDataForbidden:
        true as const,

      productionAccessForbidden:
        true as const,
    },

    coverageSummary: {
      normalCommercialOperationCases:
        3 as const,

      missingEvidenceCases:
        1 as const,

      commercialTermsCases:
        3 as const,

      scopeControlCases:
        1 as const,

      departmentHandoffCases:
        1 as const,

      tenantAndOwnerControlCases:
        1 as const,

      adversarialAndAuditCases:
        1 as const,

      failureRecoveryCases:
        1 as const,

      verifiedItemQuantityCovered:
        true as const,

      pricingCurrencyCovered:
        true as const,

      deterministicArithmeticCovered:
        true as const,

      unresolvedPricingCovered:
        true as const,

      taxCovered:
        true as const,

      freightDiscountCovered:
        true as const,

      validityPaymentTermsCovered:
        true as const,

      scopeExclusionsDependenciesCovered:
        true as const,

      missingEvidenceAndZeroInventionCovered:
        true as const,

      inquiryRecommendationCommercialDigestChainCovered:
        true as const,

      tenantIsolationCovered:
        true as const,

      ownerControlCovered:
        true as const,

      tamperSecretUnsupportedClaimCovered:
        true as const,

      auditAndFailureRecoveryCovered:
        true as const,
    },

    plannedCases:
      MEERA_COMMERCIAL_REQUALIFICATION_CASES,

    executionBoundary: {
      preparationAuthorizedByOwnerReview:
        true as const,

      preparationExecuted:
        true as const,

      qualificationCasesExecuted:
        0 as const,

      qualificationCasesPassed:
        0 as const,

      qualificationCasesFailed:
        0 as const,

      executionEvidenceCreated:
        false as const,

      independentEvaluationCompleted:
        false as const,

      ownerExecutionDecisionRequired:
        true as const,

      ownerExecutionDecisionRecorded:
        false as const,

      controlledRequalificationExecutionAuthorized:
        false as const,

      controlledRequalificationExecuted:
        false as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      ownerPostExecutionReviewRecorded:
        false as const,

      meeraCommercialEvidenceRequalified:
        false as const,

      salesCoreLaunchRequalificationEligible:
        false as const,
    },

    authorityBoundary: {
      approvalBypassAllowed:
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

      customerCommitmentAuthorized:
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
    },

    nextStep:
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const record = deepFreeze({
    ...preparationCore,

    preparationDigest:
      sha256(preparationCore),
  }) as SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
    record,
  );

  return record;
}
