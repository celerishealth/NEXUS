import {
  createHash,
} from "node:crypto";

import {
  ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,
  type AshaOwnerActivatedRuntimeIssuance,
} from "./ashaOwnerActivatedRuntimeIssuance";

export const ASHA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION =
  "nexus-asha-controlled-shadow-operation-preparation-v1" as const;

export interface CreateAshaControlledShadowOperationPreparationInput {
  readonly preparationId:
    string;
  readonly ownerActivatedRuntimeIssuance:
    AshaOwnerActivatedRuntimeIssuance;
  readonly preparedAt:
    string;
}

export interface AshaControlledShadowOperationPreparation {
  readonly version:
    typeof ASHA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION;
  readonly preparationId:
    string;
  readonly preparationState:
    "CONTROLLED_SHADOW_OPERATION_PREPARED";
  readonly employeeId:
    "employee-asha-inquiry-intake-v1";
  readonly templateId:
    "template-asha-inquiry-intake-v1";
  readonly employeeCode:
    "nx-sales-003";
  readonly displayName:
    "Asha";
  readonly officialRole:
    "AI Inquiry Intake Executive";
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
  readonly tenantId:
    string;
  readonly ownerId:
    string;
  readonly shadowFixture: Readonly<{
    fixtureId:
      "fixture-asha-controlled-shadow-inquiry-v1";
    scenarioId:
      "scenario-asha-controlled-shadow-inquiry-intake-001";
    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";
    toolId:
      "tool-inquiry-draft";
    toolMode:
      "DRAFT_ONLY";
    maximumInquiryCount:
      1;
    executionMode:
      "SANDBOX_ONLY";
  }>;
  readonly authorityBoundary: Readonly<{
    ownerActivatedRuntimeIssuanceBound:
      true;
    ownerActivationBound:
      true;
    qualifiedManifestBound:
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
    authenticatedInquiryCreated:
      false;
    syntheticSanitizedDataOnly:
      true;
    emergencyPauseAvailable:
      true;
    customerDataAccessAuthorized:
      false;
    customerContactAuthorized:
      false;
    recommendationGenerationAuthorized:
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
  "employee-asha-inquiry-intake-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-asha-inquiry-intake-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-003" as const;

const EXPECTED_DISPLAY_NAME =
  "Asha" as const;

const EXPECTED_ROLE =
  "AI Inquiry Intake Executive" as const;

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
      "Unsupported deterministic controlled shadow preparation value.",
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
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      value,
    )
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
  if (!SHA_256_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function validateOwnerActivatedRuntimeIssuance(
  source:
    AshaOwnerActivatedRuntimeIssuance,
): void {
  if (
    source.version !==
      ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION ||
    source.issuanceState !==
      "OWNER_ACTIVATED_RUNTIME_ISSUED" ||
    source.nextStep !==
      "PREPARE_CONTROLLED_SHADOW_OPERATION"
  ) {
    throw new Error(
      "A valid Workforce Day 22 owner-activated runtime issuance is required.",
    );
  }

  requireDigest(
    "owner-activated runtime issuance digest",
    source.runtimeIssuanceDigest,
  );

  const {
    runtimeIssuanceDigest,
    ...sourceCore
  } = source;

  if (
    sha256(sourceCore) !==
      runtimeIssuanceDigest
  ) {
    throw new Error(
      "Workforce Day 22 runtime issuance integrity verification failed.",
    );
  }

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
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Asha owner-activated runtime identity has changed.",
    );
  }

  requireIdentifier(
    "runtime issuanceId",
    source.runtimeIssuanceId,
  );

  requireIdentifier(
    "runtimeId",
    source.runtimeId,
  );

  requireIdentifier(
    "tenantId",
    source.tenantId,
  );

  requireIdentifier(
    "ownerId",
    source.ownerId,
  );

  requireDigest(
    "qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  requireDigest(
    "owner-activated runtime digest",
    source.ownerActivatedRuntime
      .runtimeDigest,
  );

  const runtime =
    source.ownerActivatedRuntime;

  const {
    runtimeDigest,
    ...runtimeCore
  } = runtime;

  if (
    sha256(runtimeCore) !==
      runtimeDigest
  ) {
    throw new Error(
      "Asha owner-activated runtime integrity verification failed.",
    );
  }

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
      "Asha runtime is not ready for controlled shadow work.",
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
      "Asha runtime safety boundary is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.activationCandidateIssuanceBound !==
      true ||
    boundary.ownerActivationDecisionBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.qualificationBound !==
      true ||
    boundary.qualifiedManifestBound !==
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
    boundary.customerDataAccessAuthorized !==
      false ||
    boundary.customerContactAuthorized !==
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
      false
  ) {
    throw new Error(
      "Workforce Day 22 authority boundary has been changed.",
    );
  }
}

export function createAshaControlledShadowOperationPreparation(
  input:
    CreateAshaControlledShadowOperationPreparationInput,
): AshaControlledShadowOperationPreparation {
  requireIdentifier(
    "controlled shadow preparationId",
    input.preparationId,
  );

  requireIsoDate(
    "controlled shadow preparation time",
    input.preparedAt,
  );

  validateOwnerActivatedRuntimeIssuance(
    input.ownerActivatedRuntimeIssuance,
  );

  const source =
    input.ownerActivatedRuntimeIssuance;

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.activatedAt)
  ) {
    throw new Error(
      "Controlled shadow preparation cannot precede runtime activation.",
    );
  }

  const preparationCore = {
    version:
      ASHA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION,
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
    tenantId:
      source.tenantId,
    ownerId:
      source.ownerId,
    shadowFixture: {
      fixtureId:
        "fixture-asha-controlled-shadow-inquiry-v1" as const,
      scenarioId:
        "scenario-asha-controlled-shadow-inquiry-intake-001" as const,
      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,
      toolId:
        "tool-inquiry-draft" as const,
      toolMode:
        "DRAFT_ONLY" as const,
      maximumInquiryCount:
        1 as const,
      executionMode:
        "SANDBOX_ONLY" as const,
    },
    authorityBoundary: {
      ownerActivatedRuntimeIssuanceBound:
        true,
      ownerActivationBound:
        true,
      qualifiedManifestBound:
        true,
      runtimeIdentityBound:
        true,
      tenantIdentityBound:
        true,
      ownerIdentityBound:
        true,
      approvalBypassAllowed:
        false,
      runtimeReadyForControlledWork:
        true,
      shadowExecutionEligible:
        true,
      shadowExecutionExecuted:
        false,
      authenticatedInquiryCreated:
        false,
      syntheticSanitizedDataOnly:
        true,
      emergencyPauseAvailable:
        true,
      customerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      recommendationGenerationAuthorized:
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
    } as const,
    nextStep:
      "EXECUTE_CONTROLLED_SHADOW_OPERATION" as const,
    preparedAt:
      input.preparedAt,
  };

  const preparation:
    AshaControlledShadowOperationPreparation = {
      ...preparationCore,
      preparationDigest:
        sha256(preparationCore),
    };

  return deepFreeze(
    preparation,
  ) as AshaControlledShadowOperationPreparation;
}