import { createHash } from "node:crypto";

import {
  ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION,
  type AshaOwnerControlledShadowOperationReviewDecision,
} from "./ashaOwnerControlledShadowOperationReviewDecision";

export const ASHA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION =
  "nexus-asha-limited-internal-pilot-preparation-v1" as const;

export const ASHA_LIMITED_INTERNAL_PILOT_SCENARIOS = [
  "INCOMPLETE_REQUIREMENT_CLARIFICATION",
  "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",
  "SAFE_CUSTOMER_CONTEXT_CONTINUITY",
] as const;

export type AshaLimitedInternalPilotScenario =
  (typeof ASHA_LIMITED_INTERNAL_PILOT_SCENARIOS)[number];

export interface CreateAshaLimitedInternalPilotPreparationInput {
  readonly preparationId: string;
  readonly ownerControlledShadowOperationReviewDecision:
    AshaOwnerControlledShadowOperationReviewDecision;
  readonly preparedAt: string;
}

export interface AshaLimitedInternalPilotPreparation {
  readonly version:
    typeof ASHA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION;

  readonly preparationId: string;
  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_PREPARED";

  readonly sourceReviewDecisionId: string;
  readonly sourceReviewDecisionDigest: string;

  readonly employeeId:
    "employee-asha-inquiry-intake-v1";
  readonly templateId:
    "template-asha-inquiry-intake-v1";
  readonly employeeCode:
    "nx-sales-003";
  readonly displayName:
    "Asha";
  readonly role:
    "AI Inquiry Intake Executive";
  readonly department:
    "SALES";
  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly pilotScope: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";
    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";
    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";
    executionMode:
      "SANDBOX_ONLY";
    toolId:
      "tool-inquiry-draft";
    toolMode:
      "DRAFT_ONLY";

    maximumInquiryCount:
      3;
    concurrentInquiryLimit:
      1;
    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_INQUIRY";
    externalDeliveryMode:
      "DISABLED";
    productionMutationMode:
      "DISABLED";

    scenarios:
      readonly AshaLimitedInternalPilotScenario[];
  }>;

  readonly humanLikeEmployeeStandard: Readonly<{
    aiIdentityTransparent:
      true;
    naturalProfessionalConversationRequired:
      true;
    customerContextContinuityRequired:
      true;
    repeatedQuestionAvoidanceRequired:
      true;
    clarificationBeforeGuessingRequired:
      true;
    urgencyAndEmotionAwarenessRequired:
      true;
    promiseAndFollowUpTrackingRequired:
      true;
    uncertaintyEscalatesToOwner:
      true;
    nonRoboticCommunicationRequired:
      true;
    humanImpersonationAuthorized:
      false;
  }>;

  readonly existingPilotArchitectureBridge: Readonly<{
    duplicatePilotEngineCreated:
      false;

    enrollmentModule:
      "lib/nexus/pilot/authenticatedControlledPilotEnrollment";
    enrollmentFunction:
      "enrollAuthenticatedControlledPilot";

    accessModule:
      "lib/nexus/pilot/authenticatedControlledPilotAccess";
    accessFunction:
      "enforceAuthenticatedControlledPilotAccess";

    controlModule:
      "lib/nexus/pilot/authenticatedControlledPilotControl";
    controlFunction:
      "controlAuthenticatedPilot";

    healthModule:
      "lib/nexus/pilot/authenticatedControlledPilotHealth";
    healthFunction:
      "observeAuthenticatedControlledPilotHealth";

    operationAdmissionModule:
      "lib/nexus/pilot/authenticatedControlledPilotOperationAdmission";
    operationAdmissionFunction:
      "admitAuthenticatedPilotOperation";

    enrollmentInvoked:
      false;
    accessGranted:
      false;
    pilotControlInvoked:
      false;
    healthObservationInvoked:
      false;
    operationAdmissionClaimed:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    sourceDecisionIntegrityVerified:
      true;
    exactEmployeeIdentityBound:
      true;
    exactTenantBound:
      true;
    exactOwnerBound:
      true;
    ownerPilotPreparationApprovalBound:
      true;
    approvalBypassAllowed:
      false;

    limitedInternalPilotPreparationAuthorized:
      true;
    limitedInternalPilotExecutionAuthorized:
      false;
    syntheticInquiryExecutionAuthorized:
      false;

    realCustomerInquiryAuthorized:
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

    monitoringRequired:
      true;
    ownerReviewAfterEveryInquiry:
      true;
    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION";

  readonly preparedAt: string;
  readonly preparationDigest: string;
}

type UnknownRecord =
  Record<string, unknown>;

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

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

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
      value as UnknownRecord;

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
      "Unsupported deterministic limited-pilot preparation value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(stableStringify(value))
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
      const child of Object.values(
        value as UnknownRecord,
      )
    ) {
      deepFreeze(child);
    }
  }

  return value;
}

function requireRecord(
  value: unknown,
  message: string,
): UnknownRecord {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(message);
  }

  return value as UnknownRecord;
}

function requireString(
  value: unknown,
  message: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(message);
  }

  return value;
}

function requireSafeIdentifier(
  value: unknown,
  label: string,
): string {
  const identifier =
    requireString(
      value,
      `${label} is required.`,
    );

  if (
    !SAFE_IDENTIFIER_PATTERN.test(identifier) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(identifier)
  ) {
    throw new Error(
      `${label} is invalid or secret-bearing.`,
    );
  }

  return identifier;
}

function requireExactString(
  value: unknown,
  expected: string,
  label: string,
): void {
  if (value !== expected) {
    throw new Error(
      `${label} does not match the qualified Asha identity.`,
    );
  }
}

function requireTimestamp(
  value: unknown,
  label: string,
): string {
  const timestamp =
    requireString(
      value,
      `${label} is required.`,
    );

  if (
    !Number.isFinite(
      Date.parse(timestamp),
    )
  ) {
    throw new Error(
      `${label} must be a valid timestamp.`,
    );
  }

  return timestamp;
}

function assertFalseBoundary(
  boundary: UnknownRecord,
  key: string,
): void {
  if (boundary[key] !== false) {
    throw new Error(
      `Day 25 authority boundary '${key}' must remain false.`,
    );
  }
}

function validateOwnerReviewDecision(
  source:
    AshaOwnerControlledShadowOperationReviewDecision,
): Readonly<{
  decisionId: string;
  decisionDigest: string;
  tenantId: string;
  ownerId: string;
  decidedAt: string;
}> {
  const record =
    requireRecord(
      source,
      "Day 25 owner review decision is required.",
    );

  const decisionDigest =
    requireString(
      record.decisionDigest,
      "Day 25 owner review decision digest is required.",
    );

  if (
    !SHA_256_PATTERN.test(decisionDigest)
  ) {
    throw new Error(
      "Day 25 owner review decision digest is invalid.",
    );
  }

  const {
    decisionDigest: ignoredDigest,
    ...decisionCore
  } = record;

  void ignoredDigest;

  if (
    sha256(decisionCore) !==
    decisionDigest
  ) {
    throw new Error(
      "Day 25 owner review decision integrity verification failed.",
    );
  }

  if (
    record.version !==
    ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION
  ) {
    throw new Error(
      "Unsupported Day 25 owner review decision version.",
    );
  }

  if (
    record.decisionState !==
    "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED"
  ) {
    throw new Error(
      "Day 25 owner review decision state is invalid.",
    );
  }

  if (
    record.decision !==
    "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION"
  ) {
    throw new Error(
      "Limited internal pilot preparation requires explicit owner approval.",
    );
  }

  if (
    record.nextStep !==
    "PREPARE_LIMITED_INTERNAL_PILOT"
  ) {
    throw new Error(
      "Day 25 decision does not authorize limited internal pilot preparation.",
    );
  }

  requireExactString(
    record.employeeId,
    EXPECTED_EMPLOYEE_ID,
    "Employee identity",
  );

  requireExactString(
    record.templateId,
    EXPECTED_TEMPLATE_ID,
    "Template identity",
  );

  requireExactString(
    record.employeeCode,
    EXPECTED_EMPLOYEE_CODE,
    "Employee code",
  );

  requireExactString(
    record.displayName,
    EXPECTED_DISPLAY_NAME,
    "Display name",
  );

  requireExactString(
    record.officialRole,
    EXPECTED_ROLE,
    "Employee role",
  );

  requireExactString(
    record.department,
    EXPECTED_DEPARTMENT,
    "Employee department",
  );

  requireExactString(
    record.autonomyLevel,
    EXPECTED_AUTONOMY_LEVEL,
    "Employee autonomy",
  );

  const boundary =
    requireRecord(
      record.authorityBoundary,
      "Day 25 authority boundary is required.",
    );

  if (
    boundary
      .limitedInternalPilotPreparationAuthorized !==
      true ||
    boundary
      .limitedInternalPilotExecutionAuthorized !==
      false ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Day 25 limited-pilot authority boundary is invalid.",
    );
  }

  for (
    const key of [
      "realCustomerInquiryAuthorized",
      "realCustomerDataAccessAuthorized",
      "customerContactAuthorized",
      "recommendationGenerationAuthorized",
      "externalDeliveryAuthorized",
      "liveProviderExecutionAuthorized",
      "productionDatabaseAuthorized",
      "productionMutationAuthorized",
      "paymentExecutionAuthorized",
      "autonomousDecisionAuthorized",
      "productionReadinessAuthorized",
      "publicLaunchAuthorized",
    ]
  ) {
    assertFalseBoundary(
      boundary,
      key,
    );
  }

  return {
    decisionId:
      requireSafeIdentifier(
        record.decisionId,
        "Decision identity",
      ),

    decisionDigest,

    tenantId:
      requireSafeIdentifier(
        record.tenantId,
        "Tenant identity",
      ),

    ownerId:
      requireSafeIdentifier(
        record.ownerId,
        "Owner identity",
      ),

    decidedAt:
      requireTimestamp(
        record.decidedAt,
        "Decision timestamp",
      ),
  };
}

export function createAshaLimitedInternalPilotPreparation(
  input:
    CreateAshaLimitedInternalPilotPreparationInput,
): AshaLimitedInternalPilotPreparation {
  const preparationId =
    requireSafeIdentifier(
      input.preparationId,
      "Preparation identity",
    );

  const preparedAt =
    requireTimestamp(
      input.preparedAt,
      "Preparation timestamp",
    );

  const source =
    validateOwnerReviewDecision(
      input
        .ownerControlledShadowOperationReviewDecision,
    );

  if (
    Date.parse(preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Limited internal pilot preparation cannot precede the owner review decision.",
    );
  }

  const preparationCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,

    preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_PREPARED" as const,

    sourceReviewDecisionId:
      source.decisionId,

    sourceReviewDecisionDigest:
      source.decisionDigest,

    employeeId:
      EXPECTED_EMPLOYEE_ID,

    templateId:
      EXPECTED_TEMPLATE_ID,

    employeeCode:
      EXPECTED_EMPLOYEE_CODE,

    displayName:
      EXPECTED_DISPLAY_NAME,

    role:
      EXPECTED_ROLE,

    department:
      EXPECTED_DEPARTMENT,

    autonomyLevel:
      EXPECTED_AUTONOMY_LEVEL,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    pilotScope: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      maximumInquiryCount:
        3 as const,

      concurrentInquiryLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      externalDeliveryMode:
        "DISABLED" as const,

      productionMutationMode:
        "DISABLED" as const,

      scenarios: [
        "INCOMPLETE_REQUIREMENT_CLARIFICATION",
        "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",
        "SAFE_CUSTOMER_CONTEXT_CONTINUITY",
      ] as const,
    },

    humanLikeEmployeeStandard: {
      aiIdentityTransparent:
        true as const,

      naturalProfessionalConversationRequired:
        true as const,

      customerContextContinuityRequired:
        true as const,

      repeatedQuestionAvoidanceRequired:
        true as const,

      clarificationBeforeGuessingRequired:
        true as const,

      urgencyAndEmotionAwarenessRequired:
        true as const,

      promiseAndFollowUpTrackingRequired:
        true as const,

      uncertaintyEscalatesToOwner:
        true as const,

      nonRoboticCommunicationRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,
    },

    existingPilotArchitectureBridge: {
      duplicatePilotEngineCreated:
        false as const,

      enrollmentModule:
        "lib/nexus/pilot/authenticatedControlledPilotEnrollment" as const,

      enrollmentFunction:
        "enrollAuthenticatedControlledPilot" as const,

      accessModule:
        "lib/nexus/pilot/authenticatedControlledPilotAccess" as const,

      accessFunction:
        "enforceAuthenticatedControlledPilotAccess" as const,

      controlModule:
        "lib/nexus/pilot/authenticatedControlledPilotControl" as const,

      controlFunction:
        "controlAuthenticatedPilot" as const,

      healthModule:
        "lib/nexus/pilot/authenticatedControlledPilotHealth" as const,

      healthFunction:
        "observeAuthenticatedControlledPilotHealth" as const,

      operationAdmissionModule:
        "lib/nexus/pilot/authenticatedControlledPilotOperationAdmission" as const,

      operationAdmissionFunction:
        "admitAuthenticatedPilotOperation" as const,

      enrollmentInvoked:
        false as const,

      accessGranted:
        false as const,

      pilotControlInvoked:
        false as const,

      healthObservationInvoked:
        false as const,

      operationAdmissionClaimed:
        false as const,
    },

    authorityBoundary: {
      sourceDecisionIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      ownerPilotPreparationApprovalBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      limitedInternalPilotPreparationAuthorized:
        true as const,

      limitedInternalPilotExecutionAuthorized:
        false as const,

      syntheticInquiryExecutionAuthorized:
        false as const,

      realCustomerInquiryAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      customerContactAuthorized:
        false as const,

      recommendationGenerationAuthorized:
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

      monitoringRequired:
        true as const,

      ownerReviewAfterEveryInquiry:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION" as const,

    preparedAt,
  };

  const preparation:
    AshaLimitedInternalPilotPreparation = {
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    };

  return deepFreeze(
    preparation,
  ) as AshaLimitedInternalPilotPreparation;
}