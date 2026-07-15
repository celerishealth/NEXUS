import {
  createHash,
} from "node:crypto";

import type {
  AuthenticatedCustomerInquiryResult,
  CreateAuthenticatedCustomerInquiryInput,
} from "../inquiry/authenticatedCustomerInquiry";

import type {
  AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
  executeAshaControlledInquiryIntake,
  type AshaControlledInquiryIntakeReceipt,
} from "./ashaControlledInquiryIntake";

import {
  ASHA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION,
  type AshaControlledShadowOperationPreparation,
} from "./ashaControlledShadowOperationPreparation";

import {
  ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,
  type AshaOwnerActivatedRuntimeIssuance,
} from "./ashaOwnerActivatedRuntimeIssuance";

export const ASHA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION =
  "nexus-asha-controlled-shadow-operation-execution-v1" as const;

export interface ExecuteAshaControlledShadowOperationInput {
  readonly executionId:
    string;
  readonly preparation:
    AshaControlledShadowOperationPreparation;
  readonly ownerActivatedRuntimeIssuance:
    AshaOwnerActivatedRuntimeIssuance;
  readonly qualifiedManifest:
    AIEmployeeManifest;
  readonly executedAt:
    string;
}

export interface AshaControlledShadowOperationExecution {
  readonly version:
    typeof ASHA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION;
  readonly executionId:
    string;
  readonly executionState:
    "CONTROLLED_SHADOW_OPERATION_EXECUTED";
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
  readonly syntheticInquiryEvidence: Readonly<{
    idempotencyKey:
      "asha-controlled-shadow-inquiry-request-001";
    channel:
      "WEB";
    customerName:
      "Synthetic Shadow Customer";
    customerEmail:
      "synthetic.shadow@example.invalid";
    customerPhone:
      null;
    message:
      "Synthetic shadow inquiry requesting guidance for industrial safety equipment.";
    resultOutcome:
      "CREATED";
    inquiryId:
      "inquiry-asha-controlled-shadow-001";
    inquiryStatus:
      "NEW";
    createdAt:
      string;
  }>;
  readonly controlledInquiryReceipt:
    AshaControlledInquiryIntakeReceipt;
  readonly executionBoundary: Readonly<{
    preparationBound:
      true;
    ownerActivatedRuntimeIssuanceBound:
      true;
    qualifiedManifestBound:
      true;
    runtimeIdentityBound:
      true;
    tenantIdentityBound:
      true;
    ownerIdentityBound:
      true;
    maximumInquiryCountEnforced:
      true;
    syntheticCreatorInvocationCount:
      1;
    shadowExecutionExecuted:
      true;
    syntheticAuthenticatedInquiryCreated:
      true;
    realCustomerInquiryCreated:
      false;
    realCustomerDataAccessAuthorized:
      false;
    customerContactAuthorized:
      false;
    recommendationGenerated:
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
    ownerReviewRequired:
      true;
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

const EXPECTED_FIXTURE_ID =
  "fixture-asha-controlled-shadow-inquiry-v1" as const;

const EXPECTED_SCENARIO_ID =
  "scenario-asha-controlled-shadow-inquiry-intake-001" as const;

const SYNTHETIC_IDEMPOTENCY_KEY =
  "asha-controlled-shadow-inquiry-request-001" as const;

const SYNTHETIC_CUSTOMER_NAME =
  "Synthetic Shadow Customer" as const;

const SYNTHETIC_CUSTOMER_EMAIL =
  "synthetic.shadow@example.invalid" as const;

const SYNTHETIC_MESSAGE =
  "Synthetic shadow inquiry requesting guidance for industrial safety equipment." as const;

const SYNTHETIC_INQUIRY_ID =
  "inquiry-asha-controlled-shadow-001" as const;

const SYNTHETIC_SESSION_ID =
  "session-asha-controlled-shadow-001" as const;

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
      "Unsupported deterministic controlled shadow execution value.",
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

function validatePreparation(
  preparation:
    AshaControlledShadowOperationPreparation,
): void {
  if (
    preparation.version !==
      ASHA_CONTROLLED_SHADOW_OPERATION_PREPARATION_VERSION ||
    preparation.preparationState !==
      "CONTROLLED_SHADOW_OPERATION_PREPARED" ||
    preparation.nextStep !==
      "EXECUTE_CONTROLLED_SHADOW_OPERATION"
  ) {
    throw new Error(
      "A valid Workforce Day 23 controlled shadow preparation is required.",
    );
  }

  requireIdentifier(
    "controlled shadow preparationId",
    preparation.preparationId,
  );

  requireDigest(
    "controlled shadow preparation digest",
    preparation.preparationDigest,
  );

  requireIsoDate(
    "controlled shadow preparation time",
    preparation.preparedAt,
  );

  const {
    preparationDigest,
    ...preparationCore
  } = preparation;

  if (
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Workforce Day 23 controlled shadow preparation integrity verification failed.",
    );
  }

  if (
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
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Asha controlled shadow preparation identity has changed.",
    );
  }

  const fixture =
    preparation.shadowFixture;

  if (
    fixture.fixtureId !==
      EXPECTED_FIXTURE_ID ||
    fixture.scenarioId !==
      EXPECTED_SCENARIO_ID ||
    fixture.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    fixture.toolId !==
      "tool-inquiry-draft" ||
    fixture.toolMode !==
      "DRAFT_ONLY" ||
    fixture.maximumInquiryCount !==
      1 ||
    fixture.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Controlled shadow fixture contract has changed.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

  if (
    boundary.ownerActivatedRuntimeIssuanceBound !==
      true ||
    boundary.ownerActivationBound !==
      true ||
    boundary.qualifiedManifestBound !==
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
    boundary.authenticatedInquiryCreated !==
      false ||
    boundary.syntheticSanitizedDataOnly !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.customerDataAccessAuthorized !==
      false ||
    boundary.customerContactAuthorized !==
      false ||
    boundary.recommendationGenerationAuthorized !==
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
      "Workforce Day 23 controlled shadow authority boundary has changed.",
    );
  }
}

function validateRuntimeIssuance(
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

  requireIdentifier(
    "runtime issuanceId",
    source.runtimeIssuanceId,
  );

  requireDigest(
    "runtime issuance digest",
    source.runtimeIssuanceDigest,
  );

  const {
    runtimeIssuanceDigest,
    ...issuanceCore
  } = source;

  if (
    sha256(issuanceCore) !==
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

  const runtime =
    source.ownerActivatedRuntime;

  requireDigest(
    "owner-activated runtime digest",
    runtime.runtimeDigest,
  );

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
      true ||
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
      "Asha runtime is not eligible for controlled shadow execution.",
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
      "Workforce Day 22 runtime authority boundary has changed.",
    );
  }
}

function validateBindings(
  preparation:
    AshaControlledShadowOperationPreparation,
  source:
    AshaOwnerActivatedRuntimeIssuance,
  manifest:
    AIEmployeeManifest,
): void {
  requireDigest(
    "qualified manifest digest",
    manifest.manifestDigest,
  );

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
      "Qualified Asha manifest is not bound to the controlled shadow preparation.",
    );
  }

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
    preparation.tenantId !==
      source.tenantId ||
    preparation.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Controlled shadow preparation is not bound to the owner-activated runtime issuance.",
    );
  }
}

function createSyntheticInquiryInput(
  preparation:
    AshaControlledShadowOperationPreparation,
): CreateAuthenticatedCustomerInquiryInput {
  return deepFreeze({
    principal:
      null,
    accessRepositories:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "accessRepositories"
      ],
    workspaceRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "workspaceRepository"
      ],
    inquiryRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "inquiryRepository"
      ],
    requestedTenantId:
      preparation.tenantId,
    idempotencyKey:
      SYNTHETIC_IDEMPOTENCY_KEY,
    channel:
      "WEB",
    customerName:
      SYNTHETIC_CUSTOMER_NAME,
    customerEmail:
      SYNTHETIC_CUSTOMER_EMAIL,
    customerPhone:
      null,
    message:
      SYNTHETIC_MESSAGE,
  });
}

function createSyntheticAuthenticatedResult(
  preparation:
    AshaControlledShadowOperationPreparation,
  executedAt:
    string,
): AuthenticatedCustomerInquiryResult {
  return deepFreeze({
    outcome:
      "CREATED",
    inquiry: {
      id:
        SYNTHETIC_INQUIRY_ID,
      tenantId:
        preparation.tenantId,
      customerName:
        SYNTHETIC_CUSTOMER_NAME,
      customerEmail:
        SYNTHETIC_CUSTOMER_EMAIL,
      customerPhone:
        null,
      channel:
        "WEB",
      message:
        SYNTHETIC_MESSAGE,
      status:
        "NEW",
      createdAt:
        executedAt,
    },
    intakeAuthority: {
      createdByUserId:
        preparation.ownerId,
      sourceSessionId:
        SYNTHETIC_SESSION_ID,
      role:
        "OWNER",
    },
    safetyBoundary: {
      recommendationStatus:
        "NOT_GENERATED",
      ownerApprovalRequiredBeforeExecution:
        true,
      executionMode:
        "SANDBOX_ONLY",
      liveProviderExecutionAuthorized:
        false,
      publicLaunchAuthorized:
        false,
    },
  });
}

function validateControlledInquiryReceipt(
  receipt:
    AshaControlledInquiryIntakeReceipt,
  preparation:
    AshaControlledShadowOperationPreparation,
  source:
    AshaOwnerActivatedRuntimeIssuance,
  executedAt:
    string,
): void {
  requireDigest(
    "controlled inquiry receipt digest",
    receipt.receiptDigest,
  );

  const {
    receiptDigest,
    ...receiptCore
  } = receipt;

  if (
    sha256(receiptCore) !==
      receiptDigest
  ) {
    throw new Error(
      "Controlled inquiry receipt integrity verification failed.",
    );
  }

  if (
    receipt.version !==
      ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION ||
    receipt.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    receipt.templateId !==
      EXPECTED_TEMPLATE_ID ||
    receipt.runtimeId !==
      source.runtimeId ||
    receipt.runtimeDigest !==
      source.ownerActivatedRuntime
        .runtimeDigest ||
    receipt.tenantId !==
      preparation.tenantId
  ) {
    throw new Error(
      "Controlled inquiry receipt identity binding is invalid.",
    );
  }

  if (
    receipt.workforceAuthority
      .employeeQualified !==
      true ||
    receipt.workforceAuthority
      .employeeOwnerActivated !==
      true ||
    receipt.workforceAuthority
      .controlledWorkAuthorized !==
      true ||
    receipt.workforceAuthority
      .toolId !==
      "tool-inquiry-draft" ||
    receipt.workforceAuthority
      .toolMode !==
      "DRAFT_ONLY" ||
    receipt.workforceAuthority
      .tenantScoped !==
      true
  ) {
    throw new Error(
      "Controlled inquiry workforce authority is invalid.",
    );
  }

  if (
    receipt.safetyBoundary
      .recommendationGenerationAuthorized !==
      false ||
    receipt.safetyBoundary
      .externalMessageDeliveryAuthorized !==
      false ||
    receipt.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    receipt.safetyBoundary
      .paymentExecutionAuthorized !==
      false ||
    receipt.safetyBoundary
      .ownerApprovalRequiredBeforeExecution !==
      true ||
    receipt.safetyBoundary
      .executionMode !==
      "SANDBOX_ONLY" ||
    receipt.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Controlled inquiry receipt safety boundary is invalid.",
    );
  }

  const authenticated =
    receipt.authenticatedInquiry;

  if (
    authenticated.outcome !==
      "CREATED" ||
    authenticated.inquiry.id !==
      SYNTHETIC_INQUIRY_ID ||
    authenticated.inquiry.tenantId !==
      preparation.tenantId ||
    authenticated.inquiry.customerName !==
      SYNTHETIC_CUSTOMER_NAME ||
    authenticated.inquiry.customerEmail !==
      SYNTHETIC_CUSTOMER_EMAIL ||
    authenticated.inquiry.customerPhone !==
      null ||
    authenticated.inquiry.channel !==
      "WEB" ||
    authenticated.inquiry.message !==
      SYNTHETIC_MESSAGE ||
    authenticated.inquiry.status !==
      "NEW" ||
    authenticated.inquiry.createdAt !==
      executedAt ||
    authenticated.intakeAuthority
      .createdByUserId !==
      preparation.ownerId ||
    authenticated.intakeAuthority
      .sourceSessionId !==
      SYNTHETIC_SESSION_ID ||
    authenticated.intakeAuthority.role !==
      "OWNER" ||
    authenticated.safetyBoundary
      .recommendationStatus !==
      "NOT_GENERATED" ||
    authenticated.safetyBoundary
      .ownerApprovalRequiredBeforeExecution !==
      true ||
    authenticated.safetyBoundary
      .executionMode !==
      "SANDBOX_ONLY" ||
    authenticated.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    authenticated.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Controlled shadow authenticated inquiry evidence is invalid.",
    );
  }
}

export async function executeAshaControlledShadowOperation(
  input:
    ExecuteAshaControlledShadowOperationInput,
): Promise<AshaControlledShadowOperationExecution> {
  requireIdentifier(
    "controlled shadow executionId",
    input.executionId,
  );

  requireIsoDate(
    "controlled shadow execution time",
    input.executedAt,
  );

  validatePreparation(
    input.preparation,
  );

  validateRuntimeIssuance(
    input.ownerActivatedRuntimeIssuance,
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
      "Controlled shadow execution cannot precede preparation.",
    );
  }

  const syntheticInquiry =
    createSyntheticInquiryInput(
      input.preparation,
    );

  const syntheticResult =
    createSyntheticAuthenticatedResult(
      input.preparation,
      input.executedAt,
    );

  let syntheticCreatorInvocationCount =
    0;

  const receipt =
    await executeAshaControlledInquiryIntake({
      manifest:
        input.qualifiedManifest,
      runtime:
        input.ownerActivatedRuntimeIssuance
          .ownerActivatedRuntime,
      inquiry:
        syntheticInquiry,
      createInquiry:
        async (
          receivedInquiry,
        ) => {
          syntheticCreatorInvocationCount +=
            1;

          if (
            syntheticCreatorInvocationCount >
            1
          ) {
            throw new Error(
              "Controlled shadow synthetic inquiry creator exceeded the one-inquiry limit.",
            );
          }

          if (
            receivedInquiry !==
              syntheticInquiry
          ) {
            throw new Error(
              "Controlled shadow inquiry input identity changed before execution.",
            );
          }

          return syntheticResult;
        },
    });

  if (
    syntheticCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Controlled shadow synthetic inquiry creator must execute exactly once.",
    );
  }

  validateControlledInquiryReceipt(
    receipt,
    input.preparation,
    input.ownerActivatedRuntimeIssuance,
    input.executedAt,
  );

  const executionCore = {
    version:
      ASHA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION,
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
      input.ownerActivatedRuntimeIssuance
        .runtimeIssuanceId,
    runtimeIssuanceDigest:
      input.ownerActivatedRuntimeIssuance
        .runtimeIssuanceDigest,
    runtimeId:
      input.ownerActivatedRuntimeIssuance
        .runtimeId,
    runtimeDigest:
      input.ownerActivatedRuntimeIssuance
        .ownerActivatedRuntime.runtimeDigest,
    qualifiedManifestDigest:
      input.qualifiedManifest
        .manifestDigest,
    tenantId:
      input.preparation.tenantId,
    ownerId:
      input.preparation.ownerId,
    shadowFixture: {
      fixtureId:
        EXPECTED_FIXTURE_ID,
      scenarioId:
        EXPECTED_SCENARIO_ID,
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
    syntheticInquiryEvidence: {
      idempotencyKey:
        SYNTHETIC_IDEMPOTENCY_KEY,
      channel:
        "WEB" as const,
      customerName:
        SYNTHETIC_CUSTOMER_NAME,
      customerEmail:
        SYNTHETIC_CUSTOMER_EMAIL,
      customerPhone:
        null,
      message:
        SYNTHETIC_MESSAGE,
      resultOutcome:
        "CREATED" as const,
      inquiryId:
        SYNTHETIC_INQUIRY_ID,
      inquiryStatus:
        "NEW" as const,
      createdAt:
        input.executedAt,
    },
    controlledInquiryReceipt:
      receipt,
    executionBoundary: {
      preparationBound:
        true,
      ownerActivatedRuntimeIssuanceBound:
        true,
      qualifiedManifestBound:
        true,
      runtimeIdentityBound:
        true,
      tenantIdentityBound:
        true,
      ownerIdentityBound:
        true,
      maximumInquiryCountEnforced:
        true,
      syntheticCreatorInvocationCount:
        1 as const,
      shadowExecutionExecuted:
        true,
      syntheticAuthenticatedInquiryCreated:
        true,
      realCustomerInquiryCreated:
        false,
      realCustomerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      recommendationGenerated:
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
      ownerReviewRequired:
        true,
      emergencyPauseAvailable:
        true,
      publicLaunchAuthorized:
        false,
    } as const,
    nextStep:
      "AWAIT_OWNER_SHADOW_OPERATION_REVIEW" as const,
    executedAt:
      input.executedAt,
  };

  const execution:
    AshaControlledShadowOperationExecution = {
      ...executionCore,
      executionDigest:
        sha256(executionCore),
    };

  return deepFreeze(
    execution,
  ) as AshaControlledShadowOperationExecution;
}