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
  ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,
  type AshaOwnerActivatedRuntimeIssuance,
} from "./ashaOwnerActivatedRuntimeIssuance";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotExecutionDecision,
} from "./ashaOwnerLimitedInternalPilotExecutionDecision";

export const ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION =
  "nexus-asha-limited-internal-pilot-inquiry-execution-v1" as const;

export interface ExecuteAshaLimitedInternalPilotInquiryInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotExecutionDecision:
    AshaOwnerLimitedInternalPilotExecutionDecision;

  readonly ownerActivatedRuntimeIssuance:
    AshaOwnerActivatedRuntimeIssuance;

  readonly qualifiedManifest:
    AIEmployeeManifest;

  readonly executedAt:
    string;
}

export interface AshaLimitedInternalPilotInquiryExecution {
  readonly version:
    typeof ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTED";

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

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly sourceReviewDecisionId:
    string;

  readonly sourceReviewDecisionDigest:
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

  readonly pilotInquiry: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    scenarioId:
      "INCOMPLETE_REQUIREMENT_CLARIFICATION";

    inquirySequence:
      1;

    maximumInquiryCount:
      3;

    remainingInquiryCapacity:
      2;

    concurrentInquiryLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_INQUIRY";

    toolId:
      "tool-inquiry-draft";

    toolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";
  }>;

  readonly humanLikeScenarioExpectation: Readonly<{
    understandIncompleteRequirement:
      true;

    clarificationBeforeAssumptionRequired:
      true;

    repetitiveQuestioningProhibited:
      true;

    transparentAIIdentityRequired:
      true;

    humanImpersonationAuthorized:
      false;

    responseGenerationPerformed:
      false;
  }>;

  readonly syntheticInquiryEvidence: Readonly<{
    idempotencyKey:
      "asha-limited-internal-pilot-inquiry-001";

    channel:
      "WEB";

    customerName:
      "Synthetic Pilot Customer One";

    customerEmail:
      "synthetic.pilot.one@example.invalid";

    customerPhone:
      null;

    message:
      "We need safety equipment for a workshop, but the product type, quantity, specifications, budget, and delivery date are not yet provided.";

    resultOutcome:
      "CREATED";

    inquiryId:
      "inquiry-asha-limited-internal-pilot-001";

    inquiryStatus:
      "NEW";

    createdAt:
      string;
  }>;

  readonly controlledInquiryReceipt:
    AshaControlledInquiryIntakeReceipt;

  readonly executionBoundary: Readonly<{
    ownerExecutionApprovalBound:
      true;

    runtimeIssuanceBound:
      true;

    qualifiedManifestBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    pilotInquirySequenceEnforced:
      true;

    maximumInquiryCountPreserved:
      true;

    concurrentInquiryLimitEnforced:
      true;

    failureThresholdPreserved:
      true;

    ownerReviewAfterInquiryRequired:
      true;

    limitedInternalPilotInquiryExecuted:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticAuthenticatedInquiryCreated:
      true;

    genericPilotArchitectureInvoked:
      false;

    realCustomerInquiryCreated:
      false;

    realCustomerDataAccessed:
      false;

    customerContactPerformed:
      false;

    recommendationGenerationPerformed:
      false;

    externalDeliveryPerformed:
      false;

    liveProviderExecutionPerformed:
      false;

    productionDatabaseUsed:
      false;

    productionMutationPerformed:
      false;

    paymentExecutionPerformed:
      false;

    autonomousDecisionPerformed:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

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

const EXPECTED_SCENARIO =
  "INCOMPLETE_REQUIREMENT_CLARIFICATION" as const;

const SYNTHETIC_IDEMPOTENCY_KEY =
  "asha-limited-internal-pilot-inquiry-001" as const;

const SYNTHETIC_CUSTOMER_NAME =
  "Synthetic Pilot Customer One" as const;

const SYNTHETIC_CUSTOMER_EMAIL =
  "synthetic.pilot.one@example.invalid" as const;

const SYNTHETIC_MESSAGE =
  "We need safety equipment for a workshop, but the product type, quantity, specifications, budget, and delivery date are not yet provided." as const;

const SYNTHETIC_INQUIRY_ID =
  "inquiry-asha-limited-internal-pilot-001" as const;

const SYNTHETIC_SESSION_ID =
  "session-asha-limited-internal-pilot-001" as const;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

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
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported value in deterministic limited internal pilot execution.",
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

function requireSafeIdentifier(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  if (
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} contains a credential-bearing term.`,
    );
  }

  return value;
}

function requireDigest(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }

  return value;
}

function requireIsoTimestamp(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value)) ||
    new Date(Date.parse(value))
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }

  return value;
}

function verifyDigestBoundObject(
  label: string,
  value: object,
  digestField: string,
): string {
  const record = {
    ...(
      value as unknown as
        Record<string, unknown>
    ),
  };

  const digest =
    requireDigest(
      `${label} digest`,
      record[digestField],
    );

  delete record[digestField];

  if (sha256(record) !== digest) {
    throw new Error(
      `${label} integrity verification failed.`,
    );
  }

  return digest;
}

function validateOwnerExecutionDecision(
  source:
    AshaOwnerLimitedInternalPilotExecutionDecision,
): void {
  verifyDigestBoundObject(
    "Owner limited internal pilot execution decision",
    source,
    "decisionDigest",
  );

  requireSafeIdentifier(
    "Owner execution decision identity",
    source.decisionId,
  );

  requireSafeIdentifier(
    "Limited pilot preparation identity",
    source.preparationId,
  );

  requireDigest(
    "Limited pilot preparation digest",
    source.preparationDigest,
  );

  requireSafeIdentifier(
    "Source review decision identity",
    source.sourceReviewDecisionId,
  );

  requireDigest(
    "Source review decision digest",
    source.sourceReviewDecisionDigest,
  );

  requireSafeIdentifier(
    "Tenant identity",
    source.tenantId,
  );

  requireSafeIdentifier(
    "Owner identity",
    source.ownerId,
  );

  requireIsoTimestamp(
    "Owner execution decision time",
    source.decidedAt,
  );

  if (
    source.version !==
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED" ||
    source.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION" ||
    source.approvedForLimitedInternalPilotExecution !==
      true ||
    source.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT"
  ) {
    throw new Error(
      "An approved Workforce Day 27 limited internal pilot execution decision is required.",
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
      "Asha owner execution decision identity has changed.",
    );
  }

  const scope =
    source.reviewedPilotPreparation;

  if (
    scope.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    scope.dataClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    scope.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    scope.executionMode !==
      "SANDBOX_ONLY" ||
    scope.toolId !==
      "tool-inquiry-draft" ||
    scope.toolMode !==
      "DRAFT_ONLY" ||
    scope.maximumInquiryCount !==
      3 ||
    scope.concurrentInquiryLimit !==
      1 ||
    scope.failureThreshold !==
      1 ||
    scope.ownerReviewFrequency !==
      "AFTER_EVERY_INQUIRY" ||
    scope.scenarioCount !==
      3 ||
    scope.humanLikeEmployeeStandardBound !==
      true ||
    scope.transparentAIIdentityRequired !==
      true ||
    scope.humanImpersonationAuthorized !==
      false ||
    scope.existingPilotArchitectureBound !==
      true
  ) {
    throw new Error(
      "Workforce Day 27 limited internal pilot scope has changed.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerExecutionDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.limitedInternalPilotPreparationAuthorized !==
      true ||
    boundary.limitedInternalPilotExecutionAuthorized !==
      true ||
    boundary.limitedInternalPilotExecutionPerformed !==
      false ||
    boundary.syntheticInquiryExecutionPerformed !==
      false ||
    boundary.realCustomerInquiryAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
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
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.ownerReviewAfterEveryInquiry !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Workforce Day 27 owner execution authority boundary has changed.",
    );
  }
}

function validateRuntimeAndManifest(
  source:
    AshaOwnerActivatedRuntimeIssuance,
  manifest:
    AIEmployeeManifest,
  decision:
    AshaOwnerLimitedInternalPilotExecutionDecision,
): void {
  verifyDigestBoundObject(
    "Owner-activated runtime issuance",
    source,
    "runtimeIssuanceDigest",
  );

  verifyDigestBoundObject(
    "Owner-activated runtime",
    source.ownerActivatedRuntime,
    "runtimeDigest",
  );

  verifyDigestBoundObject(
    "Qualified employee manifest",
    manifest,
    "manifestDigest",
  );

  requireSafeIdentifier(
    "Runtime issuance identity",
    source.runtimeIssuanceId,
  );

  requireSafeIdentifier(
    "Runtime identity",
    source.runtimeId,
  );

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

  const runtime =
    source.ownerActivatedRuntime;

  if (
    runtime.runtimeId !==
      source.runtimeId ||
    runtime.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    runtime.templateId !==
      EXPECTED_TEMPLATE_ID ||
    runtime.manifestDigest !==
      manifest.manifestDigest ||
    runtime.tenantId !==
      decision.tenantId ||
    runtime.ownerId !==
      decision.ownerId ||
    runtime.ownerActivated !==
      true ||
    runtime.runtimeState !==
      "READY_FOR_CONTROLLED_WORK" ||
    runtime.controlledWorkAuthorized !==
      true
  ) {
    throw new Error(
      "Owner-activated runtime is not bound to the approved Asha pilot decision.",
    );
  }

  if (
    runtime.authority.ownerApprovalRequired !==
      true ||
    runtime.authority.approvalBypassAllowed !==
      false ||
    runtime.authority.tenantScoped !==
      true ||
    runtime.authority.crossTenantDelegationAllowed !==
      false ||
    runtime.safetyBoundary.emergencyPauseAvailable !==
      true ||
    runtime.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    runtime.safetyBoundary.externalDeliveryAuthorized !==
      false ||
    runtime.safetyBoundary.paymentExecutionAuthorized !==
      false ||
    runtime.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Owner-activated runtime safety boundary has changed.",
    );
  }

  if (
    manifest.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    manifest.templateId !==
      EXPECTED_TEMPLATE_ID ||
    manifest.evaluation.status !==
      "QUALIFIED"
  ) {
    throw new Error(
      "The exact qualified Asha manifest is required.",
    );
  }

  if (
    manifest.safetyBoundary.ownerControlled !==
      true ||
    manifest.safetyBoundary.emergencyPauseRequired !==
      true ||
    manifest.safetyBoundary.crossTenantAccessAuthorized !==
      false ||
    manifest.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    manifest.safetyBoundary.externalDeliveryAuthorized !==
      false ||
    manifest.safetyBoundary.paymentExecutionAuthorized !==
      false ||
    manifest.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Qualified Asha manifest safety boundary has changed.",
    );
  }
}

function createSyntheticInquiryInput(
  decision:
    AshaOwnerLimitedInternalPilotExecutionDecision,
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
      decision.tenantId,

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
  decision:
    AshaOwnerLimitedInternalPilotExecutionDecision,
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
        decision.tenantId,

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
        decision.ownerId,

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
  decision:
    AshaOwnerLimitedInternalPilotExecutionDecision,
  source:
    AshaOwnerActivatedRuntimeIssuance,
  executedAt:
    string,
): void {
  verifyDigestBoundObject(
    "Limited internal pilot inquiry receipt",
    receipt,
    "receiptDigest",
  );

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
      source.ownerActivatedRuntime.runtimeDigest ||
    receipt.tenantId !==
      decision.tenantId
  ) {
    throw new Error(
      "Limited internal pilot inquiry receipt identity binding is invalid.",
    );
  }

  if (
    receipt.workforceAuthority.employeeQualified !==
      true ||
    receipt.workforceAuthority.employeeOwnerActivated !==
      true ||
    receipt.workforceAuthority.controlledWorkAuthorized !==
      true ||
    receipt.workforceAuthority.toolId !==
      "tool-inquiry-draft" ||
    receipt.workforceAuthority.toolMode !==
      "DRAFT_ONLY" ||
    receipt.workforceAuthority.tenantScoped !==
      true
  ) {
    throw new Error(
      "Limited internal pilot inquiry workforce authority is invalid.",
    );
  }

  if (
    receipt.safetyBoundary.recommendationGenerationAuthorized !==
      false ||
    receipt.safetyBoundary.externalMessageDeliveryAuthorized !==
      false ||
    receipt.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    receipt.safetyBoundary.paymentExecutionAuthorized !==
      false ||
    receipt.safetyBoundary.ownerApprovalRequiredBeforeExecution !==
      true ||
    receipt.safetyBoundary.executionMode !==
      "SANDBOX_ONLY" ||
    receipt.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Limited internal pilot inquiry receipt safety boundary is invalid.",
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
      decision.tenantId ||
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
    authenticated.intakeAuthority.createdByUserId !==
      decision.ownerId ||
    authenticated.intakeAuthority.sourceSessionId !==
      SYNTHETIC_SESSION_ID ||
    authenticated.intakeAuthority.role !==
      "OWNER" ||
    authenticated.safetyBoundary.recommendationStatus !==
      "NOT_GENERATED" ||
    authenticated.safetyBoundary.ownerApprovalRequiredBeforeExecution !==
      true ||
    authenticated.safetyBoundary.executionMode !==
      "SANDBOX_ONLY" ||
    authenticated.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    authenticated.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Limited internal pilot authenticated inquiry evidence is invalid.",
    );
  }
}

export async function executeAshaLimitedInternalPilotInquiry(
  input:
    ExecuteAshaLimitedInternalPilotInquiryInput,
): Promise<AshaLimitedInternalPilotInquiryExecution> {
  requireSafeIdentifier(
    "Limited internal pilot inquiry execution identity",
    input.executionId,
  );

  const executedAt =
    requireIsoTimestamp(
      "Limited internal pilot inquiry execution time",
      input.executedAt,
    );

  const decision =
    input.ownerLimitedInternalPilotExecutionDecision;

  validateOwnerExecutionDecision(
    decision,
  );

  validateRuntimeAndManifest(
    input.ownerActivatedRuntimeIssuance,
    input.qualifiedManifest,
    decision,
  );

  if (
    Date.parse(executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Limited internal pilot inquiry execution cannot precede owner approval.",
    );
  }

  const syntheticInquiry =
    createSyntheticInquiryInput(
      decision,
    );

  const syntheticResult =
    createSyntheticAuthenticatedResult(
      decision,
      executedAt,
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
              "Limited internal pilot synthetic inquiry creator exceeded the single-inquiry execution limit.",
            );
          }

          if (
            receivedInquiry !==
            syntheticInquiry
          ) {
            throw new Error(
              "Limited internal pilot inquiry input identity changed before execution.",
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
      "Limited internal pilot synthetic inquiry creator must execute exactly once.",
    );
  }

  validateControlledInquiryReceipt(
    receipt,
    decision,
    input.ownerActivatedRuntimeIssuance,
    executedAt,
  );

  const executionCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTED" as const,

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

    ownerExecutionDecisionId:
      decision.decisionId,

    ownerExecutionDecisionDigest:
      decision.decisionDigest,

    preparationId:
      decision.preparationId,

    preparationDigest:
      decision.preparationDigest,

    sourceReviewDecisionId:
      decision.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      decision.sourceReviewDecisionDigest,

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
        .ownerActivatedRuntime
        .runtimeDigest,

    qualifiedManifestDigest:
      input.qualifiedManifest
        .manifestDigest,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    pilotInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        EXPECTED_SCENARIO,

      inquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        2 as const,

      concurrentInquiryLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    humanLikeScenarioExpectation: {
      understandIncompleteRequirement:
        true as const,

      clarificationBeforeAssumptionRequired:
        true as const,

      repetitiveQuestioningProhibited:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,

      responseGenerationPerformed:
        false as const,
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
        executedAt,
    },

    controlledInquiryReceipt:
      receipt,

    executionBoundary: {
      ownerExecutionApprovalBound:
        true as const,

      runtimeIssuanceBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      pilotInquirySequenceEnforced:
        true as const,

      maximumInquiryCountPreserved:
        true as const,

      concurrentInquiryLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      ownerReviewAfterInquiryRequired:
        true as const,

      limitedInternalPilotInquiryExecuted:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticAuthenticatedInquiryCreated:
        true as const,

      genericPilotArchitectureInvoked:
        false as const,

      realCustomerInquiryCreated:
        false as const,

      realCustomerDataAccessed:
        false as const,

      customerContactPerformed:
        false as const,

      recommendationGenerationPerformed:
        false as const,

      externalDeliveryPerformed:
        false as const,

      liveProviderExecutionPerformed:
        false as const,

      productionDatabaseUsed:
        false as const,

      productionMutationPerformed:
        false as const,

      paymentExecutionPerformed:
        false as const,

      autonomousDecisionPerformed:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW" as const,

    executedAt,
  };

  const result:
    AshaLimitedInternalPilotInquiryExecution = {
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    };

  return deepFreeze(
    result,
  ) as AshaLimitedInternalPilotInquiryExecution;
}