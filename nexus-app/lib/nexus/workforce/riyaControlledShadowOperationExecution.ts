import {
  createHash,
} from "node:crypto";

import {
  type AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  validateRiyaOwnerActivatedRuntimeIssuance,
  type RiyaOwnerActivatedRuntimeIssuance,
} from "./riyaOwnerActivatedRuntimeIssuance";

import {
  validateRiyaControlledShadowOperationPreparation,
  type RiyaControlledShadowOperationPreparation,
} from "./riyaControlledShadowOperationPreparation";

export const RIYA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION =
  "nexus-riya-controlled-shadow-operation-execution-v1" as const;

export interface ExecuteRiyaControlledShadowOperationInput {
  readonly executionId:
    string;

  readonly preparation:
    RiyaControlledShadowOperationPreparation;

  readonly ownerActivatedRuntimeIssuance:
    RiyaOwnerActivatedRuntimeIssuance;

  readonly qualifiedManifest:
    AIEmployeeManifest;

  readonly executedAt:
    string;
}

export interface RiyaControlledShadowOperationExecution {
  readonly version:
    typeof RIYA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "CONTROLLED_SHADOW_OPERATION_EXECUTED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly employeeCode:
    "nx-sales-004";

  readonly displayName:
    "Riya";

  readonly officialRole:
    "AI Recommendation Specialist";

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
    RiyaControlledShadowOperationPreparation[
      "shadowFixture"
    ];

  readonly syntheticInquiryEvidence: Readonly<{
    inquiryEvidenceId:
      "synthetic-riya-inquiry-evidence-001";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    channel:
      "WEB";

    customerRequest:
      "Recommend suitable industrial safety equipment for a small metal fabrication workshop.";

    verifiedFacts:
      readonly [
        "The synthetic customer operates a small metal fabrication workshop.",
        "The synthetic request concerns worker protection during cutting grinding and material handling.",
        "The synthetic customer requested practical options with clear trade-offs."
      ];

    missingEvidence:
      readonly [
        "Exact worker count is not provided.",
        "Exact machinery inventory is not provided.",
        "Applicable site-specific compliance requirements are not confirmed."
      ];

    unsupportedFactsInvented:
      false;
  }>;

  readonly syntheticCustomerContext: Readonly<{
    customerContextId:
      "synthetic-riya-customer-context-001";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    approvedTenantContextOnly:
      true;

    relevantPreference:
      "Prefers practical safety options with transparent assumptions and owner-reviewed trade-offs.";

    crossCustomerContextUsed:
      false;

    crossTenantContextUsed:
      false;
  }>;

  readonly recommendationDraft: Readonly<{
    recommendationId:
      "synthetic-riya-recommendation-draft-001";

    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    toolId:
      "tool-recommendation-draft";

    toolMode:
      "DRAFT_ONLY";

    title:
      "Synthetic workshop safety-equipment recommendation";

    summary:
      "Prepare a phased safety-equipment package covering eye face hand hearing respiratory and basic site protection, subject to owner review and confirmation of missing site facts.";

    recommendedAction:
      "Request the missing site details, then compare a basic compliant package with an enhanced protection package before any customer-facing quotation or commitment.";

    rationale:
      readonly [
        "The verified synthetic evidence indicates cutting grinding and material-handling exposure.",
        "A phased package avoids unsupported product certainty while keeping the recommendation practical.",
        "Missing worker machinery and compliance facts prevent a final product or quantity decision."
      ];

    riskLevel:
      "MEDIUM";

    uncertainty:
      readonly [
        "Final product specifications require confirmed machinery and task exposure.",
        "Final quantities require the worker count.",
        "Compliance claims require owner-verified jurisdiction and site requirements."
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

    maximumRecommendationCountEnforced:
      true;

    recommendationCreatorInvocationCount:
      1;

    shadowExecutionExecuted:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticCustomerContextRead:
      true;

    recommendationDraftCreated:
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
  "employee-riya-recommendation-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-riya-recommendation-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-004" as const;

const EXPECTED_DISPLAY_NAME =
  "Riya" as const;

const EXPECTED_ROLE =
  "AI Recommendation Specialist" as const;

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
      "Unsupported deterministic Riya controlled shadow execution value.",
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
    RiyaControlledShadowOperationPreparation,

  source:
    RiyaOwnerActivatedRuntimeIssuance,

  manifest:
    AIEmployeeManifest,
): void {
  validateRiyaControlledShadowOperationPreparation(
    preparation,
  );

  validateRiyaOwnerActivatedRuntimeIssuance(
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
      "Riya controlled shadow preparation is not bound to the owner-activated runtime issuance.",
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
      "Qualified Riya manifest is not bound to the controlled shadow execution.",
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
    fixture.customerContextToolId !==
      "tool-customer-memory-read" ||
    fixture.customerContextToolMode !==
      "READ_ONLY" ||
    fixture.recommendationDraftToolId !==
      "tool-recommendation-draft" ||
    fixture.recommendationDraftToolMode !==
      "DRAFT_ONLY" ||
    fixture.maximumRecommendationCount !==
      1 ||
    fixture.executionMode !==
      "SANDBOX_ONLY" ||
    fixture.ownerReviewRequired !==
      true
  ) {
    throw new Error(
      "Riya controlled shadow execution fixture is invalid.",
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
      .recommendationDraftCreated !==
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
      "Workforce Day 57 Riya authority boundary has changed.",
    );
  }
}

function createSyntheticInquiryEvidence() {
  return deepFreeze({
    inquiryEvidenceId:
      "synthetic-riya-inquiry-evidence-001" as const,

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY" as const,

    channel:
      "WEB" as const,

    customerRequest:
      "Recommend suitable industrial safety equipment for a small metal fabrication workshop." as const,

    verifiedFacts: [
      "The synthetic customer operates a small metal fabrication workshop.",
      "The synthetic request concerns worker protection during cutting grinding and material handling.",
      "The synthetic customer requested practical options with clear trade-offs.",
    ] as const,

    missingEvidence: [
      "Exact worker count is not provided.",
      "Exact machinery inventory is not provided.",
      "Applicable site-specific compliance requirements are not confirmed.",
    ] as const,

    unsupportedFactsInvented:
      false as const,
  });
}

function createSyntheticCustomerContext() {
  return deepFreeze({
    customerContextId:
      "synthetic-riya-customer-context-001" as const,

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY" as const,

    approvedTenantContextOnly:
      true as const,

    relevantPreference:
      "Prefers practical safety options with transparent assumptions and owner-reviewed trade-offs." as const,

    crossCustomerContextUsed:
      false as const,

    crossTenantContextUsed:
      false as const,
  });
}

function createSyntheticRecommendationDraft() {
  return deepFreeze({
    recommendationId:
      "synthetic-riya-recommendation-draft-001" as const,

    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

    toolId:
      "tool-recommendation-draft" as const,

    toolMode:
      "DRAFT_ONLY" as const,

    title:
      "Synthetic workshop safety-equipment recommendation" as const,

    summary:
      "Prepare a phased safety-equipment package covering eye face hand hearing respiratory and basic site protection, subject to owner review and confirmation of missing site facts." as const,

    recommendedAction:
      "Request the missing site details, then compare a basic compliant package with an enhanced protection package before any customer-facing quotation or commitment." as const,

    rationale: [
      "The verified synthetic evidence indicates cutting grinding and material-handling exposure.",
      "A phased package avoids unsupported product certainty while keeping the recommendation practical.",
      "Missing worker machinery and compliance facts prevent a final product or quantity decision.",
    ] as const,

    riskLevel:
      "MEDIUM" as const,

    uncertainty: [
      "Final product specifications require confirmed machinery and task exposure.",
      "Final quantities require the worker count.",
      "Compliance claims require owner-verified jurisdiction and site requirements.",
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

export function validateRiyaControlledShadowOperationExecution(
  execution:
    RiyaControlledShadowOperationExecution,
): void {
  if (
    execution.version !==
      RIYA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION ||
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
      "Riya controlled shadow operation execution identity is invalid.",
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
    "Riya source registry creation time",
    execution.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Riya controlled shadow execution time",
    execution.executedAt,
  );

  const draft =
    execution.recommendationDraft;

  if (
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.toolId !==
      "tool-recommendation-draft" ||
    draft.toolMode !==
      "DRAFT_ONLY" ||
    draft.riskLevel !==
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
      "Riya controlled shadow recommendation draft is invalid.",
    );
  }

  if (
    execution.syntheticInquiryEvidence
      .dataClassification !==
        "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticInquiryEvidence
      .unsupportedFactsInvented !==
        false ||
    execution.syntheticCustomerContext
      .dataClassification !==
        "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticCustomerContext
      .approvedTenantContextOnly !==
        true ||
    execution.syntheticCustomerContext
      .crossCustomerContextUsed !==
        false ||
    execution.syntheticCustomerContext
      .crossTenantContextUsed !==
        false
  ) {
    throw new Error(
      "Riya controlled shadow synthetic evidence is invalid.",
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
    boundary.maximumRecommendationCountEnforced !==
      true ||
    boundary.recommendationCreatorInvocationCount !==
      1 ||
    boundary.shadowExecutionExecuted !==
      true ||
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticCustomerContextRead !==
      true ||
    boundary.recommendationDraftCreated !==
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
      "Riya controlled shadow execution authority boundary is invalid.",
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
      "Riya controlled shadow operation execution integrity is invalid.",
    );
  }
}

export async function executeRiyaControlledShadowOperation(
  input:
    ExecuteRiyaControlledShadowOperationInput,
): Promise<RiyaControlledShadowOperationExecution> {
  requireIdentifier(
    "Riya controlled shadow executionId",
    input.executionId,
  );

  requireIsoTimestamp(
    "Riya controlled shadow execution time",
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
      "Riya controlled shadow execution cannot precede preparation.",
    );
  }

  const inquiryEvidence =
    createSyntheticInquiryEvidence();

  const customerContext =
    createSyntheticCustomerContext();

  let recommendationCreatorInvocationCount =
    0;

  recommendationCreatorInvocationCount +=
    1;

  if (
    recommendationCreatorInvocationCount >
      input.preparation.shadowFixture
        .maximumRecommendationCount
  ) {
    throw new Error(
      "Riya controlled shadow recommendation creator exceeded the one-recommendation limit.",
    );
  }

  const recommendationDraft =
    createSyntheticRecommendationDraft();

  if (
    recommendationCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Riya controlled shadow recommendation creator must execute exactly once.",
    );
  }

  const source =
    input.ownerActivatedRuntimeIssuance;

  const executionCore = {
    version:
      RIYA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION,

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

    syntheticCustomerContext:
      customerContext,

    recommendationDraft,

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

      maximumRecommendationCountEnforced:
        true as const,

      recommendationCreatorInvocationCount:
        1 as const,

      shadowExecutionExecuted:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticCustomerContextRead:
        true as const,

      recommendationDraftCreated:
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
    }) as RiyaControlledShadowOperationExecution;

  validateRiyaControlledShadowOperationExecution(
    execution,
  );

  return execution;
}
