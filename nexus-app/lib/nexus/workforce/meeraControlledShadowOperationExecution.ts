import {
  createHash,
} from "node:crypto";

import {
  type AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  validateMeeraOwnerActivatedRuntimeIssuance,
  type MeeraOwnerActivatedRuntimeIssuance,
} from "./meeraOwnerActivatedRuntimeIssuance";

import {
  validateMeeraControlledShadowOperationPreparation,
  type MeeraControlledShadowOperationPreparation,
} from "./meeraControlledShadowOperationPreparation";

export const MEERA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION =
  "nexus-meera-controlled-shadow-operation-execution-v1" as const;

export interface ExecuteMeeraControlledShadowOperationInput {
  readonly executionId:
    string;

  readonly preparation:
    MeeraControlledShadowOperationPreparation;

  readonly ownerActivatedRuntimeIssuance:
    MeeraOwnerActivatedRuntimeIssuance;

  readonly qualifiedManifest:
    AIEmployeeManifest;

  readonly executedAt:
    string;
}

export interface MeeraControlledShadowOperationExecution {
  readonly version:
    typeof MEERA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "CONTROLLED_SHADOW_OPERATION_EXECUTED";

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

  readonly shadowFixture:
    MeeraControlledShadowOperationPreparation[
      "shadowFixture"
    ];

  readonly syntheticInquiryEvidence: Readonly<{
    inquiryEvidenceId:
      "synthetic-meera-inquiry-evidence-001";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    channel:
      "WEB";

    customerRequest:
      "Prepare a budgetary quotation and proposal for a synthetic small metal fabrication workshop requiring a phased worker-safety package.";

    verifiedFacts:
      readonly [
        "The synthetic customer operates a small metal fabrication workshop.",
        "The synthetic requirement covers worker protection during cutting grinding and material handling.",
        "The owner-approved synthetic recommendation requests a basic and enhanced package comparison with transparent trade-offs."
      ];

    missingEvidence:
      readonly [
        "Exact worker count is not provided.",
        "Exact machinery inventory is not provided.",
        "Final brands specifications taxes freight payment terms and site-specific compliance requirements are not approved."
      ];

    unsupportedFactsInvented:
      false;
  }>;

  readonly syntheticRecommendationEvidence: Readonly<{
    recommendationEvidenceId:
      "synthetic-meera-recommendation-evidence-001";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    ownerApprovedRecommendationOnly:
      true;

    approvedRecommendationSummary:
      "Owner-approved synthetic recommendation requests phased basic and enhanced safety packages with transparent assumptions and no customer commitment.";

    crossCustomerEvidenceUsed:
      false;

    crossTenantContextUsed:
      false;
  }>;

  readonly quotationProposalDraft: Readonly<{
    quotationProposalId:
      "synthetic-meera-quotation-proposal-draft-001";

    quotationProposalStatus:
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    toolId:
      "tool-quotation-proposal-draft";

    toolMode:
      "DRAFT_ONLY";

    title:
      "Synthetic budgetary quotation and worker-safety proposal";

    summary:
      "Prepare a two-option budgetary quotation covering eye face hand hearing respiratory and basic site protection with explicit assumptions exclusions and owner approval required.";

    proposedCommercialAction:
      "Present Option A as a bounded basic package and Option B as an enhanced package, then request owner approval before pricing commitment or customer delivery.";

    commercialAssumptions:
      readonly [
        "Pricing remains budgetary because worker count quantities brands taxes freight and payment terms are not fully approved.",
        "The quotation scope is limited to the synthetic safety-equipment package described in the approved recommendation.",
        "No final product specification quantity compliance claim delivery date or commercial commitment is authorized."
      ];

    commercialRiskLevel:
      "MEDIUM";

    scopeAndExclusions:
      readonly [
        "Final product specifications and quantities require confirmed machinery task exposure and worker count.",
        "Taxes freight installation training and payment terms remain excluded until owner approval.",
        "Customer delivery remains blocked until the owner reviews pricing assumptions scope exclusions and commercial risk."
      ];

    ownerDecisionMade:
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

  readonly executionBoundary: Readonly<{
    preparationBound:
      true;

    ownerActivatedRuntimeIssuanceBound:
      true;

    qualifiedManifestBound:
      true;

    registryCreationTimeBound:
      true;

    runtimeIdentityBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    maximumQuotationProposalCountEnforced:
      true;

    quotationProposalCreatorInvocationCount:
      1;

    shadowExecutionExecuted:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticRecommendationEvidenceRead:
      true;

    quotationProposalDraftCreated:
      true;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

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

    emergencyPauseAvailable:
      true;

    publicLaunchAuthorized:
      false;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_SHADOW_OPERATION_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

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
      "Unsupported deterministic Meera controlled shadow execution value.",
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
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function validateBindings(
  preparation:
    MeeraControlledShadowOperationPreparation,

  source:
    MeeraOwnerActivatedRuntimeIssuance,

  manifest:
    AIEmployeeManifest,
): void {
  validateMeeraControlledShadowOperationPreparation(
    preparation,
  );

  validateMeeraOwnerActivatedRuntimeIssuance(
    source,
  );

  if (
    preparation.runtimeIssuanceId !==
      source.runtimeIssuanceId ||
    preparation.runtimeIssuanceDigest !==
      source.runtimeIssuanceDigest ||
    preparation.runtimeId !==
      source.runtimeId ||
    preparation.runtimeDigest !==
      source.ownerActivatedRuntime
        .runtimeDigest ||
    preparation.qualifiedManifestDigest !==
      source.qualifiedManifestDigest ||
    preparation.sourceRegistryCreatedAt !==
      source.sourceRegistryCreatedAt ||
    preparation.tenantId !==
      source.tenantId ||
    preparation.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Meera controlled shadow preparation is not bound to the owner-activated runtime issuance.",
    );
  }

  if (
    manifest.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    manifest.templateId !==
      EXPECTED_TEMPLATE_ID ||
    manifest.manifestDigest !==
      preparation.qualifiedManifestDigest ||
    manifest.manifestDigest !==
      source.qualifiedManifestDigest
  ) {
    throw new Error(
      "Qualified Meera manifest is not bound to the controlled shadow execution.",
    );
  }

  const fixture =
    preparation.shadowFixture;

  if (
    fixture.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    fixture.inquiryEvidenceToolId !==
      "tool-inquiry-read" ||
    fixture.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    fixture.recommendationEvidenceToolId !==
      "tool-recommendation-read" ||
    fixture.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    fixture.quotationProposalDraftToolId !==
      "tool-quotation-proposal-draft" ||
    fixture.quotationProposalDraftToolMode !==
      "DRAFT_ONLY" ||
    fixture.maximumQuotationProposalCount !==
      1 ||
    fixture.executionMode !==
      "SANDBOX_ONLY" ||
    fixture.ownerReviewRequired !==
      true
  ) {
    throw new Error(
      "Meera controlled shadow execution fixture is invalid.",
    );
  }

  if (
    preparation.authorityBoundary
      .shadowExecutionEligible !==
        true ||
    preparation.authorityBoundary
      .shadowExecutionExecuted !==
        false ||
    preparation.authorityBoundary
      .quotationProposalDraftCreated !==
        false ||
    preparation.authorityBoundary
      .ownerReviewRequired !==
        true ||
    preparation.authorityBoundary
      .realCustomerDataAccessAuthorized !==
        false ||
    preparation.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    preparation.authorityBoundary
      .externalDeliveryAuthorized !==
        false ||
    preparation.authorityBoundary
      .liveProviderExecutionAuthorized !==
        false ||
    preparation.authorityBoundary
      .productionDatabaseAuthorized !==
        false ||
    preparation.authorityBoundary
      .productionMutationAuthorized !==
        false ||
    preparation.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    preparation.authorityBoundary
      .autonomousDecisionAuthorized !==
        false ||
    preparation.authorityBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Workforce Day 57 Meera authority boundary has changed.",
    );
  }
}

function createSyntheticInquiryEvidence() {
  return deepFreeze({
    inquiryEvidenceId:
      "synthetic-meera-inquiry-evidence-001" as const,

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY" as const,

    channel:
      "WEB" as const,

    customerRequest:
      "Prepare a budgetary quotation and proposal for a synthetic small metal fabrication workshop requiring a phased worker-safety package." as const,

    verifiedFacts: [
      "The synthetic customer operates a small metal fabrication workshop.",
      "The synthetic requirement covers worker protection during cutting grinding and material handling.",
      "The owner-approved synthetic recommendation requests a basic and enhanced package comparison with transparent trade-offs.",
    ] as const,

    missingEvidence: [
      "Exact worker count is not provided.",
      "Exact machinery inventory is not provided.",
      "Final brands specifications taxes freight payment terms and site-specific compliance requirements are not approved.",
    ] as const,

    unsupportedFactsInvented:
      false as const,
  });
}

function createSyntheticRecommendationEvidence() {
  return deepFreeze({
    recommendationEvidenceId:
      "synthetic-meera-recommendation-evidence-001" as const,

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY" as const,

    ownerApprovedRecommendationOnly:
      true as const,

    approvedRecommendationSummary:
      "Owner-approved synthetic recommendation requests phased basic and enhanced safety packages with transparent assumptions and no customer commitment." as const,

    crossCustomerEvidenceUsed:
      false as const,

    crossTenantContextUsed:
      false as const,
  });
}

function createSyntheticQuotationProposalDraft() {
  return deepFreeze({
    quotationProposalId:
      "synthetic-meera-quotation-proposal-draft-001" as const,

    quotationProposalStatus:
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

    toolId:
      "tool-quotation-proposal-draft" as const,

    toolMode:
      "DRAFT_ONLY" as const,

    title:
      "Synthetic budgetary quotation and worker-safety proposal" as const,

    summary:
      "Prepare a two-option budgetary quotation covering eye face hand hearing respiratory and basic site protection with explicit assumptions exclusions and owner approval required." as const,

    proposedCommercialAction:
      "Present Option A as a bounded basic package and Option B as an enhanced package, then request owner approval before pricing commitment or customer delivery." as const,

    commercialAssumptions: [
      "Pricing remains budgetary because worker count quantities brands taxes freight and payment terms are not fully approved.",
      "The quotation scope is limited to the synthetic safety-equipment package described in the approved recommendation.",
      "No final product specification quantity compliance claim delivery date or commercial commitment is authorized.",
    ] as const,

    commercialRiskLevel:
      "MEDIUM" as const,

    scopeAndExclusions: [
      "Final product specifications and quantities require confirmed machinery task exposure and worker count.",
      "Taxes freight installation training and payment terms remain excluded until owner approval.",
      "Customer delivery remains blocked until the owner reviews pricing assumptions scope exclusions and commercial risk.",
    ] as const,

    ownerDecisionMade:
      false as const,

    unsupportedClaimsIncluded:
      false as const,

    urgencyExaggerated:
      false as const,

    guaranteeMade:
      false as const,

    customerDeliveryPrepared:
      false as const,

    customerDeliveryExecuted:
      false as const,
  });
}

export function validateMeeraControlledShadowOperationExecution(
  execution:
    MeeraControlledShadowOperationExecution,
): void {
  if (
    execution.version !==
      MEERA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION ||
    execution.executionState !==
      "CONTROLLED_SHADOW_OPERATION_EXECUTED" ||
    execution.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    execution.templateId !==
      EXPECTED_TEMPLATE_ID ||
    execution.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    execution.displayName !==
      EXPECTED_DISPLAY_NAME ||
    execution.officialRole !==
      EXPECTED_ROLE ||
    execution.department !==
      EXPECTED_DEPARTMENT ||
    execution.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    execution.nextStep !==
      "AWAIT_OWNER_SHADOW_OPERATION_REVIEW"
  ) {
    throw new Error(
      "Meera controlled shadow operation execution identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "executionId",
        execution.executionId,
      ],
      [
        "preparationId",
        execution.preparationId,
      ],
      [
        "runtimeIssuanceId",
        execution.runtimeIssuanceId,
      ],
      [
        "runtimeId",
        execution.runtimeId,
      ],
      [
        "tenantId",
        execution.tenantId,
      ],
      [
        "ownerId",
        execution.ownerId,
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
        "preparationDigest",
        execution.preparationDigest,
      ],
      [
        "runtimeIssuanceDigest",
        execution.runtimeIssuanceDigest,
      ],
      [
        "runtimeDigest",
        execution.runtimeDigest,
      ],
      [
        "qualifiedManifestDigest",
        execution.qualifiedManifestDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Meera source registry creation time",
    execution.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Meera controlled shadow execution time",
    execution.executedAt,
  );

  const draft =
    execution.quotationProposalDraft;

  if (
    draft.quotationProposalStatus !==
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.toolId !==
      "tool-quotation-proposal-draft" ||
    draft.toolMode !==
      "DRAFT_ONLY" ||
    draft.commercialRiskLevel !==
      "MEDIUM" ||
    draft.ownerDecisionMade !==
      false ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.urgencyExaggerated !==
      false ||
    draft.guaranteeMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Meera controlled shadow quotation or proposal draft is invalid.",
    );
  }

  if (
    execution.syntheticInquiryEvidence
      .dataClassification !==
        "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticInquiryEvidence
      .unsupportedFactsInvented !==
        false ||
    execution.syntheticRecommendationEvidence
      .dataClassification !==
        "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticRecommendationEvidence
      .ownerApprovedRecommendationOnly !==
        true ||
    execution.syntheticRecommendationEvidence
      .crossCustomerEvidenceUsed !==
        false ||
    execution.syntheticRecommendationEvidence
      .crossTenantContextUsed !==
        false
  ) {
    throw new Error(
      "Meera controlled shadow synthetic evidence is invalid.",
    );
  }

  const boundary =
    execution.executionBoundary;

  if (
    boundary.preparationBound !==
      true ||
    boundary
      .ownerActivatedRuntimeIssuanceBound !==
        true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.maximumQuotationProposalCountEnforced !==
      true ||
    boundary.quotationProposalCreatorInvocationCount !==
      1 ||
    boundary.shadowExecutionExecuted !==
      true ||
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticRecommendationEvidenceRead !==
      true ||
    boundary.quotationProposalDraftCreated !==
      true ||
    boundary.ownerDecisionMade !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary
      .realCustomerDataAccessAuthorized !==
        false ||
    boundary
      .realCustomerContactAuthorized !==
        false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary
      .liveProviderExecutionAuthorized !==
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
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Meera controlled shadow execution authority boundary is invalid.",
    );
  }

  const {
    executionDigest,
    ...executionCore
  } = execution;

  if (
    !SHA_256_PATTERN.test(
      executionDigest,
    ) ||
    executionDigest !==
      sha256(executionCore)
  ) {
    throw new Error(
      "Meera controlled shadow operation execution integrity is invalid.",
    );
  }
}

export async function executeMeeraControlledShadowOperation(
  input:
    ExecuteMeeraControlledShadowOperationInput,
): Promise<MeeraControlledShadowOperationExecution> {
  requireIdentifier(
    "Meera controlled shadow executionId",
    input.executionId,
  );

  requireIsoTimestamp(
    "Meera controlled shadow execution time",
    input.executedAt,
  );

  validateBindings(
    input.preparation,
    input.ownerActivatedRuntimeIssuance,
    input.qualifiedManifest,
  );

  if (
    Date.parse(input.executedAt) <
      Date.parse(input.preparation.preparedAt)
  ) {
    throw new Error(
      "Meera controlled shadow execution cannot precede preparation.",
    );
  }

  const inquiryEvidence =
    createSyntheticInquiryEvidence();

  const recommendationEvidence =
    createSyntheticRecommendationEvidence();

  let quotationProposalCreatorInvocationCount =
    0;

  quotationProposalCreatorInvocationCount +=
    1;

  if (
    quotationProposalCreatorInvocationCount >
      input.preparation.shadowFixture
        .maximumQuotationProposalCount
  ) {
    throw new Error(
      "Meera controlled shadow quotation or proposal creator exceeded the one-recommendation limit.",
    );
  }

  const quotationProposalDraft =
    createSyntheticQuotationProposalDraft();

  if (
    quotationProposalCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Meera controlled shadow quotation or proposal creator must execute exactly once.",
    );
  }

  const source =
    input.ownerActivatedRuntimeIssuance;

  const executionCore = {
    version:
      MEERA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "CONTROLLED_SHADOW_OPERATION_EXECUTED" as const,

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

    preparationId:
      input.preparation.preparationId,

    preparationDigest:
      input.preparation.preparationDigest,

    runtimeIssuanceId:
      source.runtimeIssuanceId,

    runtimeIssuanceDigest:
      source.runtimeIssuanceDigest,

    runtimeId:
      source.runtimeId,

    runtimeDigest:
      source.ownerActivatedRuntime
        .runtimeDigest,

    qualifiedManifestDigest:
      input.qualifiedManifest
        .manifestDigest,

    sourceRegistryCreatedAt:
      source.sourceRegistryCreatedAt,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    shadowFixture:
      input.preparation.shadowFixture,

    syntheticInquiryEvidence:
      inquiryEvidence,

    syntheticRecommendationEvidence:
      recommendationEvidence,

    quotationProposalDraft,

    executionBoundary: {
      preparationBound:
        true as const,

      ownerActivatedRuntimeIssuanceBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      registryCreationTimeBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      maximumQuotationProposalCountEnforced:
        true as const,

      quotationProposalCreatorInvocationCount:
        1 as const,

      shadowExecutionExecuted:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticRecommendationEvidenceRead:
        true as const,

      quotationProposalDraftCreated:
        true as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

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

      emergencyPauseAvailable:
        true as const,

      publicLaunchAuthorized:
        false as const,
    },

    nextStep:
      "AWAIT_OWNER_SHADOW_OPERATION_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as MeeraControlledShadowOperationExecution;

  validateMeeraControlledShadowOperationExecution(
    execution,
  );

  return execution;
}
