import { createHash } from "node:crypto";

import {
  ASHA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,
  type AshaLimitedInternalPilotPreparation,
} from "./ashaLimitedInternalPilotPreparation";

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION =
  "nexus-asha-owner-limited-internal-pilot-execution-decision-v1" as const;

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",
  "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION",
] as const;

export type AshaOwnerLimitedInternalPilotExecutionDecisionType =
  (
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS
  )[number];

export interface CreateAshaOwnerLimitedInternalPilotExecutionDecisionInput {
  readonly limitedInternalPilotPreparation:
    AshaLimitedInternalPilotPreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface AshaOwnerLimitedInternalPilotExecutionDecision {
  readonly version:
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED";

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

  readonly sourceReviewDecisionId:
    string;

  readonly sourceReviewDecisionDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotExecutionDecisionType;

  readonly approvedForLimitedInternalPilotExecution:
    boolean;

  readonly reason:
    string;

  readonly reviewedPilotPreparation: Readonly<{
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

    scenarioCount:
      3;

    humanLikeEmployeeStandardBound:
      true;

    transparentAIIdentityRequired:
      true;

    humanImpersonationAuthorized:
      false;

    existingPilotArchitectureBound:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    sourcePreparationIntegrityVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    ownerExecutionDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    limitedInternalPilotPreparationAuthorized:
      true;

    limitedInternalPilotExecutionAuthorized:
      boolean;

    limitedInternalPilotExecutionPerformed:
      false;

    syntheticInquiryExecutionPerformed:
      false;

    realCustomerInquiryAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    customerContactAuthorized:
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
    | "EXECUTE_LIMITED_INTERNAL_PILOT"
    | "RETAIN_LIMITED_INTERNAL_PILOT_PREPARATION_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
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

const EXPECTED_SCENARIOS = [
  "INCOMPLETE_REQUIREMENT_CLARIFICATION",
  "VERIFIED_URGENCY_WITHOUT_EXAGGERATION",
  "SAFE_CUSTOMER_CONTEXT_CONTINUITY",
] as const;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token)/i;

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
      "Unsupported deterministic owner execution decision value.",
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

  return value.trim();
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

function requireDigest(
  value: unknown,
  label: string,
): string {
  const digest =
    requireString(
      value,
      `${label} is required.`,
    );

  if (!SHA_256_PATTERN.test(digest)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }

  return digest;
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

function requireReason(
  value: unknown,
): string {
  const reason =
    requireString(
      value,
      "A clear owner execution-decision reason is required.",
    );

  if (
    reason.length < 8 ||
    reason.length > 500
  ) {
    throw new Error(
      "Owner execution-decision reason must contain 8 to 500 characters.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(reason)
  ) {
    throw new Error(
      "Owner execution-decision reason contains secret-bearing information.",
    );
  }

  return reason;
}

function requireExact(
  value: unknown,
  expected: unknown,
  label: string,
): void {
  if (value !== expected) {
    throw new Error(
      `${label} does not match the approved limited internal pilot preparation.`,
    );
  }
}

function validateDecision(
  value: unknown,
): AshaOwnerLimitedInternalPilotExecutionDecisionType {
  if (
    value !==
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION" &&
    value !==
      "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION"
  ) {
    throw new Error(
      "Asha owner limited internal pilot execution decision is invalid.",
    );
  }

  return value;
}

function validateScenarioList(
  value: unknown,
): void {
  if (
    !Array.isArray(value) ||
    value.length !==
      EXPECTED_SCENARIOS.length
  ) {
    throw new Error(
      "Limited internal pilot scenario scope is invalid.",
    );
  }

  for (
    let index = 0;
    index < EXPECTED_SCENARIOS.length;
    index++
  ) {
    if (
      value[index] !==
      EXPECTED_SCENARIOS[index]
    ) {
      throw new Error(
        "Limited internal pilot scenario ordering or identity is invalid.",
      );
    }
  }
}

function validatePreparation(
  source:
    AshaLimitedInternalPilotPreparation,
): Readonly<{
  preparationId: string;
  preparationDigest: string;
  sourceReviewDecisionId: string;
  sourceReviewDecisionDigest: string;
  tenantId: string;
  ownerId: string;
  preparedAt: string;
}> {
  const record =
    requireRecord(
      source,
      "Workforce Day 26 limited internal pilot preparation is required.",
    );

  const preparationDigest =
    requireDigest(
      record.preparationDigest,
      "Limited internal pilot preparation digest",
    );

  const {
    preparationDigest: ignoredDigest,
    ...preparationCore
  } = record;

  void ignoredDigest;

  if (
    sha256(preparationCore) !==
    preparationDigest
  ) {
    throw new Error(
      "Limited internal pilot preparation integrity verification failed.",
    );
  }

  requireExact(
    record.version,
    ASHA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,
    "Preparation version",
  );

  requireExact(
    record.preparationState,
    "LIMITED_INTERNAL_PILOT_PREPARED",
    "Preparation state",
  );

  requireExact(
    record.nextStep,
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION",
    "Preparation next step",
  );

  requireExact(
    record.employeeId,
    EXPECTED_EMPLOYEE_ID,
    "Employee identity",
  );

  requireExact(
    record.templateId,
    EXPECTED_TEMPLATE_ID,
    "Template identity",
  );

  requireExact(
    record.employeeCode,
    EXPECTED_EMPLOYEE_CODE,
    "Employee code",
  );

  requireExact(
    record.displayName,
    EXPECTED_DISPLAY_NAME,
    "Display name",
  );

  requireExact(
    record.role,
    EXPECTED_ROLE,
    "Official role",
  );

  requireExact(
    record.department,
    EXPECTED_DEPARTMENT,
    "Department",
  );

  requireExact(
    record.autonomyLevel,
    EXPECTED_AUTONOMY_LEVEL,
    "Autonomy level",
  );

  const scope =
    requireRecord(
      record.pilotScope,
      "Limited internal pilot scope is required.",
    );

  requireExact(
    scope.pilotClass,
    "LIMITED_INTERNAL_SYNTHETIC_PILOT",
    "Pilot class",
  );

  requireExact(
    scope.dataClass,
    "SYNTHETIC_SANITIZED_ONLY",
    "Pilot data class",
  );

  requireExact(
    scope.actorClass,
    "OWNER_SUPERVISED_INTERNAL_ONLY",
    "Pilot actor class",
  );

  requireExact(
    scope.executionMode,
    "SANDBOX_ONLY",
    "Pilot execution mode",
  );

  requireExact(
    scope.toolId,
    "tool-inquiry-draft",
    "Pilot tool identity",
  );

  requireExact(
    scope.toolMode,
    "DRAFT_ONLY",
    "Pilot tool mode",
  );

  requireExact(
    scope.maximumInquiryCount,
    3,
    "Maximum inquiry count",
  );

  requireExact(
    scope.concurrentInquiryLimit,
    1,
    "Concurrent inquiry limit",
  );

  requireExact(
    scope.failureThreshold,
    1,
    "Failure threshold",
  );

  requireExact(
    scope.ownerReviewFrequency,
    "AFTER_EVERY_INQUIRY",
    "Owner review frequency",
  );

  requireExact(
    scope.externalDeliveryMode,
    "DISABLED",
    "External delivery mode",
  );

  requireExact(
    scope.productionMutationMode,
    "DISABLED",
    "Production mutation mode",
  );

  validateScenarioList(
    scope.scenarios,
  );

  const humanLike =
    requireRecord(
      record.humanLikeEmployeeStandard,
      "Human-like employee standard is required.",
    );

  for (
    const key of [
      "aiIdentityTransparent",
      "naturalProfessionalConversationRequired",
      "customerContextContinuityRequired",
      "repeatedQuestionAvoidanceRequired",
      "clarificationBeforeGuessingRequired",
      "urgencyAndEmotionAwarenessRequired",
      "promiseAndFollowUpTrackingRequired",
      "uncertaintyEscalatesToOwner",
      "nonRoboticCommunicationRequired",
    ]
  ) {
    requireExact(
      humanLike[key],
      true,
      `Human-like employee standard '${key}'`,
    );
  }

  requireExact(
    humanLike.humanImpersonationAuthorized,
    false,
    "Human impersonation authority",
  );

  const bridge =
    requireRecord(
      record.existingPilotArchitectureBridge,
      "Existing pilot architecture bridge is required.",
    );

  requireExact(
    bridge.duplicatePilotEngineCreated,
    false,
    "Duplicate pilot engine state",
  );

  for (
    const key of [
      "enrollmentInvoked",
      "accessGranted",
      "pilotControlInvoked",
      "healthObservationInvoked",
      "operationAdmissionClaimed",
    ]
  ) {
    requireExact(
      bridge[key],
      false,
      `Pilot bridge '${key}'`,
    );
  }

  const boundary =
    requireRecord(
      record.authorityBoundary,
      "Limited internal pilot preparation authority boundary is required.",
    );

  for (
    const key of [
      "sourceDecisionIntegrityVerified",
      "exactEmployeeIdentityBound",
      "exactTenantBound",
      "exactOwnerBound",
      "ownerPilotPreparationApprovalBound",
      "limitedInternalPilotPreparationAuthorized",
      "monitoringRequired",
      "ownerReviewAfterEveryInquiry",
      "emergencyPauseAvailable",
    ]
  ) {
    requireExact(
      boundary[key],
      true,
      `Preparation authority '${key}'`,
    );
  }

  for (
    const key of [
      "approvalBypassAllowed",
      "limitedInternalPilotExecutionAuthorized",
      "syntheticInquiryExecutionAuthorized",
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
    requireExact(
      boundary[key],
      false,
      `Preparation authority '${key}'`,
    );
  }

  return {
    preparationId:
      requireSafeIdentifier(
        record.preparationId,
        "Preparation identity",
      ),

    preparationDigest,

    sourceReviewDecisionId:
      requireSafeIdentifier(
        record.sourceReviewDecisionId,
        "Source review decision identity",
      ),

    sourceReviewDecisionDigest:
      requireDigest(
        record.sourceReviewDecisionDigest,
        "Source review decision digest",
      ),

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

    preparedAt:
      requireTimestamp(
        record.preparedAt,
        "Preparation timestamp",
      ),
  };
}

export function createAshaOwnerLimitedInternalPilotExecutionDecision(
  input:
    CreateAshaOwnerLimitedInternalPilotExecutionDecisionInput,
): AshaOwnerLimitedInternalPilotExecutionDecision {
  const decisionId =
    requireSafeIdentifier(
      input.decisionId,
      "Owner execution decision identity",
    );

  const ownerId =
    requireSafeIdentifier(
      input.ownerId,
      "Owner identity",
    );

  const decision =
    validateDecision(
      input.decision,
    );

  const reason =
    requireReason(
      input.reason,
    );

  const decidedAt =
    requireTimestamp(
      input.decidedAt,
      "Owner execution decision timestamp",
    );

  const source =
    validatePreparation(
      input.limitedInternalPilotPreparation,
    );

  if (
    ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Only the preparation-bound owner can issue the limited internal pilot execution decision.",
    );
  }

  if (
    Date.parse(decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Limited internal pilot execution decision cannot precede its preparation.",
    );
  }

  const approved =
    decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION";

  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED" as const,

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
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceReviewDecisionId:
      source.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      source.sourceReviewDecisionDigest,

    tenantId:
      source.tenantId,

    ownerId,

    decision,

    approvedForLimitedInternalPilotExecution:
      approved,

    reason,

    reviewedPilotPreparation: {
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

      scenarioCount:
        3 as const,

      humanLikeEmployeeStandardBound:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,

      existingPilotArchitectureBound:
        true as const,
    },

    authorityBoundary: {
      sourcePreparationIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      ownerExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      limitedInternalPilotPreparationAuthorized:
        true as const,

      limitedInternalPilotExecutionAuthorized:
        approved,

      limitedInternalPilotExecutionPerformed:
        false as const,

      syntheticInquiryExecutionPerformed:
        false as const,

      realCustomerInquiryAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      customerContactAuthorized:
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
      approved
        ? "EXECUTE_LIMITED_INTERNAL_PILOT" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_PREPARATION_ONLY" as const,

    decidedAt,
  };

  const result:
    AshaOwnerLimitedInternalPilotExecutionDecision = {
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    result,
  ) as AshaOwnerLimitedInternalPilotExecutionDecision;
}