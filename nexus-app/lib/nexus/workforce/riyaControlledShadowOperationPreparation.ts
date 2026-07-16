import {
  createHash,
} from "node:crypto";

import {
  validateRiyaOwnerActivatedRuntimeIssuance,
  type RiyaOwnerActivatedRuntimeIssuance,
} from "./riyaOwnerActivatedRuntimeIssuance";

export const RIYA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION =
  "nexus-riya-controlled-shadow-operation-preparation-v1" as const;

export interface CreateRiyaControlledShadowOperationPreparationInput {
  readonly preparationId:
    string;

  readonly ownerActivatedRuntimeIssuance:
    RiyaOwnerActivatedRuntimeIssuance;

  readonly preparedAt:
    string;
}

export interface RiyaControlledShadowOperationPreparation {
  readonly version:
    typeof RIYA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "CONTROLLED_SHADOW_OPERATION_PREPARED";

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

  readonly shadowFixture: Readonly<{
    fixtureId:
      "fixture-riya-controlled-shadow-recommendation-v1";

    scenarioId:
      "scenario-riya-controlled-shadow-recommendation-001";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolId:
      "tool-inquiry-read";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    customerContextToolId:
      "tool-customer-memory-read";

    customerContextToolMode:
      "READ_ONLY";

    recommendationDraftToolId:
      "tool-recommendation-draft";

    recommendationDraftToolMode:
      "DRAFT_ONLY";

    maximumRecommendationCount:
      1;

    executionMode:
      "SANDBOX_ONLY";

    ownerReviewRequired:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerActivatedRuntimeIssuanceBound:
      true;

    ownerActivationBound:
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

    approvalBypassAllowed:
      false;

    runtimeReadyForControlledWork:
      true;

    shadowExecutionEligible:
      true;

    shadowExecutionExecuted:
      false;

    syntheticInquiryEvidencePrepared:
      true;

    syntheticCustomerContextOnly:
      true;

    recommendationDraftCreated:
      false;

    ownerReviewRequired:
      true;

    emergencyPauseAvailable:
      true;

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
  }>;

  readonly nextStep:
    "EXECUTE_CONTROLLED_SHADOW_OPERATION";

  readonly preparedAt:
    string;

  readonly preparationDigest:
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
      "Unsupported deterministic Riya controlled shadow preparation value.",
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

function validateRuntimeIssuanceForShadow(
  source:
    RiyaOwnerActivatedRuntimeIssuance,
): void {
  validateRiyaOwnerActivatedRuntimeIssuance(
    source,
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
    source.officialRole !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    source.issuanceState !==
      "OWNER_ACTIVATED_RUNTIME_ISSUED" ||
    source.nextStep !==
      "PREPARE_CONTROLLED_SHADOW_OPERATION"
  ) {
    throw new Error(
      "A valid Workforce Day 56 Riya owner-activated runtime issuance is required.",
    );
  }

  const runtime =
    source.ownerActivatedRuntime;

  if (
    runtime.runtimeId !==
      source.runtimeId ||
    runtime.employeeId !==
      source.employeeId ||
    runtime.templateId !==
      source.templateId ||
    runtime.manifestDigest !==
      source.qualifiedManifestDigest ||
    runtime.tenantId !==
      source.tenantId ||
    runtime.ownerId !==
      source.ownerId ||
    runtime.ownerActivated !==
      true ||
    runtime.runtimeState !==
      "READY_FOR_CONTROLLED_WORK" ||
    runtime.controlledWorkAuthorized !==
      true
  ) {
    throw new Error(
      "Riya runtime is not ready for controlled shadow work.",
    );
  }

  if (
    runtime.authority
      .ownerApprovalRequired !==
        true ||
    runtime.authority
      .approvalBypassAllowed !==
        false ||
    runtime.authority
      .tenantScoped !==
        true ||
    runtime.authority
      .crossTenantDelegationAllowed !==
        false ||
    runtime.safetyBoundary
      .emergencyPauseAvailable !==
        true ||
    runtime.safetyBoundary
      .liveProviderExecutionAuthorized !==
        false ||
    runtime.safetyBoundary
      .externalDeliveryAuthorized !==
        false ||
    runtime.safetyBoundary
      .paymentExecutionAuthorized !==
        false ||
    runtime.safetyBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Riya runtime safety boundary is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary
      .activationCandidateIssuanceBound !==
        true ||
    boundary.ownerActivationDecisionBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.qualificationBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.registryCreationTimeBound !==
      true ||
    boundary.runtimeIdentityPreserved !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.runtimeActivationExecuted !==
      true ||
    boundary.runtimeActivated !==
      true ||
    boundary.controlledWorkAuthorized !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
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
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Workforce Day 56 Riya authority boundary has been changed.",
    );
  }
}

export function validateRiyaControlledShadowOperationPreparation(
  preparation:
    RiyaControlledShadowOperationPreparation,
): void {
  if (
    preparation.version !==
      RIYA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION ||
    preparation.preparationState !==
      "CONTROLLED_SHADOW_OPERATION_PREPARED" ||
    preparation.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    preparation.templateId !==
      EXPECTED_TEMPLATE_ID ||
    preparation.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    preparation.displayName !==
      EXPECTED_DISPLAY_NAME ||
    preparation.officialRole !==
      EXPECTED_ROLE ||
    preparation.department !==
      EXPECTED_DEPARTMENT ||
    preparation.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL ||
    preparation.nextStep !==
      "EXECUTE_CONTROLLED_SHADOW_OPERATION"
  ) {
    throw new Error(
      "Riya controlled shadow operation preparation identity is invalid.",
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "preparationId",
        preparation.preparationId,
      ],
      [
        "runtimeIssuanceId",
        preparation.runtimeIssuanceId,
      ],
      [
        "runtimeId",
        preparation.runtimeId,
      ],
      [
        "tenantId",
        preparation.tenantId,
      ],
      [
        "ownerId",
        preparation.ownerId,
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
        "runtimeIssuanceDigest",
        preparation.runtimeIssuanceDigest,
      ],
      [
        "runtimeDigest",
        preparation.runtimeDigest,
      ],
      [
        "qualifiedManifestDigest",
        preparation.qualifiedManifestDigest,
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
    preparation.sourceRegistryCreatedAt,
  );

  requireIsoTimestamp(
    "Riya controlled shadow preparation time",
    preparation.preparedAt,
  );

  const fixture =
    preparation.shadowFixture;

  if (
    fixture.fixtureId !==
      "fixture-riya-controlled-shadow-recommendation-v1" ||
    fixture.scenarioId !==
      "scenario-riya-controlled-shadow-recommendation-001" ||
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
      "Riya controlled shadow fixture is invalid.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

  if (
    boundary
      .ownerActivatedRuntimeIssuanceBound !==
        true ||
    boundary.ownerActivationBound !==
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
    boundary.approvalBypassAllowed !==
      false ||
    boundary.runtimeReadyForControlledWork !==
      true ||
    boundary.shadowExecutionEligible !==
      true ||
    boundary.shadowExecutionExecuted !==
      false ||
    boundary.syntheticInquiryEvidencePrepared !==
      true ||
    boundary.syntheticCustomerContextOnly !==
      true ||
    boundary.recommendationDraftCreated !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
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
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Riya controlled shadow preparation authority boundary is invalid.",
    );
  }

  const {
    preparationDigest,
    ...preparationCore
  } = preparation;

  if (
    !SHA_256_PATTERN.test(
      preparationDigest,
    ) ||
    preparationDigest !==
      sha256(preparationCore)
  ) {
    throw new Error(
      "Riya controlled shadow operation preparation integrity is invalid.",
    );
  }
}

export function createRiyaControlledShadowOperationPreparation(
  input:
    CreateRiyaControlledShadowOperationPreparationInput,
): RiyaControlledShadowOperationPreparation {
  requireIdentifier(
    "Riya controlled shadow preparationId",
    input.preparationId,
  );

  requireIsoTimestamp(
    "Riya controlled shadow preparation time",
    input.preparedAt,
  );

  validateRuntimeIssuanceForShadow(
    input.ownerActivatedRuntimeIssuance,
  );

  const source =
    input.ownerActivatedRuntimeIssuance;

  if (
    Date.parse(input.preparedAt) <
      Date.parse(source.activatedAt)
  ) {
    throw new Error(
      "Riya controlled shadow preparation cannot precede runtime activation.",
    );
  }

  const preparationCore = {
    version:
      RIYA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "CONTROLLED_SHADOW_OPERATION_PREPARED" as const,

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
      source.qualifiedManifestDigest,

    sourceRegistryCreatedAt:
      source.sourceRegistryCreatedAt,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    shadowFixture: {
      fixtureId:
        "fixture-riya-controlled-shadow-recommendation-v1" as const,

      scenarioId:
        "scenario-riya-controlled-shadow-recommendation-001" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceToolId:
        "tool-inquiry-read" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      customerContextToolId:
        "tool-customer-memory-read" as const,

      customerContextToolMode:
        "READ_ONLY" as const,

      recommendationDraftToolId:
        "tool-recommendation-draft" as const,

      recommendationDraftToolMode:
        "DRAFT_ONLY" as const,

      maximumRecommendationCount:
        1 as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      ownerReviewRequired:
        true as const,
    },

    authorityBoundary: {
      ownerActivatedRuntimeIssuanceBound:
        true as const,

      ownerActivationBound:
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

      approvalBypassAllowed:
        false as const,

      runtimeReadyForControlledWork:
        true as const,

      shadowExecutionEligible:
        true as const,

      shadowExecutionExecuted:
        false as const,

      syntheticInquiryEvidencePrepared:
        true as const,

      syntheticCustomerContextOnly:
        true as const,

      recommendationDraftCreated:
        false as const,

      ownerReviewRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,

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

    nextStep:
      "EXECUTE_CONTROLLED_SHADOW_OPERATION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as RiyaControlledShadowOperationPreparation;

  validateRiyaControlledShadowOperationPreparation(
    preparation,
  );

  return preparation;
}
