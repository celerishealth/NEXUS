import {
  createHash,
} from "node:crypto";

import {
  ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
  type AshaControlledInquiryIntakeReceipt,
} from "./ashaControlledInquiryIntake";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION,
  type AshaLimitedInternalPilotInquiryExecution,
} from "./ashaLimitedInternalPilotInquiryExecution";

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION =
  "nexus-asha-owner-limited-internal-pilot-inquiry-review-decision-v1" as const;

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISIONS = [
  "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_INQUIRY_PREPARATION",
  "REJECT_AND_RETAIN_INQUIRY_ONE_ONLY",
] as const;

export type AshaOwnerLimitedInternalPilotInquiryReviewDecisionType =
  (
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISIONS
  )[number];

export interface CreateAshaOwnerLimitedInternalPilotInquiryReviewDecisionInput {
  readonly limitedInternalPilotInquiryExecution:
    AshaLimitedInternalPilotInquiryExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface AshaOwnerLimitedInternalPilotInquiryReviewDecision {
  readonly version:
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_RECORDED";

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

  readonly limitedInternalPilotInquiryExecutionId:
    string;

  readonly limitedInternalPilotInquiryExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
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

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryReviewDecisionType;

  readonly nextInquiryPreparationApproved:
    boolean;

  readonly inquiryTwoExecutionAuthorized:
    false;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    scenarioId:
      "INCOMPLETE_REQUIREMENT_CLARIFICATION";

    reviewedInquirySequence:
      1;

    maximumInquiryCount:
      3;

    remainingInquiryCapacity:
      2;

    ownerReviewFrequency:
      "AFTER_EVERY_INQUIRY";

    toolId:
      "tool-inquiry-draft";

    toolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    controlledInquiryOutcome:
      "CREATED";

    controlledInquiryStatus:
      "NEW";

    recommendationStatus:
      "NOT_GENERATED";
  }>;

  readonly authorityBoundary: Readonly<{
    limitedInternalPilotInquiryExecutionBound:
      true;

    limitedInternalPilotInquiryExecutionIntegrityVerified:
      true;

    controlledInquiryReceiptIntegrityVerified:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    qualifiedManifestBound:
      true;

    inquiryOneReviewed:
      true;

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    nextInquiryPreparationAuthorized:
      boolean;

    inquiryTwoExecutionAuthorized:
      false;

    concurrentInquiryExecutionAuthorized:
      false;

    limitedInternalPilotCompleted:
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

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO"
    | "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_ONE_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
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
      "Unsupported deterministic limited internal pilot inquiry review value.",
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
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
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
    !SHA_256_PATTERN.test(value)
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

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "Owner limited internal pilot inquiry review reason is required.",
    );
  }

  const reason =
    value.trim();

  if (
    reason.length < 12 ||
    reason.length > 1000
  ) {
    throw new Error(
      "Owner limited internal pilot inquiry review reason must contain 12 to 1000 characters.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(reason)
  ) {
    throw new Error(
      "Owner limited internal pilot inquiry review reason contains prohibited secret-bearing content.",
    );
  }

  return reason;
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

  if (
    sha256(record) !==
    digest
  ) {
    throw new Error(
      `${label} integrity verification failed.`,
    );
  }

  return digest;
}

function validateControlledInquiryReceipt(
  receipt:
    AshaControlledInquiryIntakeReceipt,
  source:
    AshaLimitedInternalPilotInquiryExecution,
): void {
  verifyDigestBoundObject(
    "Limited internal pilot controlled inquiry receipt",
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
      source.runtimeDigest ||
    receipt.tenantId !==
      source.tenantId
  ) {
    throw new Error(
      "Limited internal pilot controlled inquiry receipt identity binding is invalid.",
    );
  }

  const authority =
    receipt.workforceAuthority;

  if (
    authority.employeeQualified !==
      true ||
    authority.employeeOwnerActivated !==
      true ||
    authority.controlledWorkAuthorized !==
      true ||
    authority.toolId !==
      "tool-inquiry-draft" ||
    authority.toolMode !==
      "DRAFT_ONLY" ||
    authority.tenantScoped !==
      true
  ) {
    throw new Error(
      "Limited internal pilot controlled inquiry workforce authority is invalid.",
    );
  }

  const safety =
    receipt.safetyBoundary;

  if (
    safety.recommendationGenerationAuthorized !==
      false ||
    safety.externalMessageDeliveryAuthorized !==
      false ||
    safety.liveProviderExecutionAuthorized !==
      false ||
    safety.paymentExecutionAuthorized !==
      false ||
    safety.ownerApprovalRequiredBeforeExecution !==
      true ||
    safety.executionMode !==
      "SANDBOX_ONLY" ||
    safety.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Limited internal pilot controlled inquiry safety boundary is invalid.",
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
      source.tenantId ||
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
      source.executedAt ||
    authenticated.intakeAuthority.createdByUserId !==
      source.ownerId ||
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
      "Limited internal pilot controlled authenticated inquiry evidence is invalid.",
    );
  }
}

function validateLimitedInternalPilotInquiryExecution(
  source:
    AshaLimitedInternalPilotInquiryExecution,
): void {
  if (
    source.version !==
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_INQUIRY_EXECUTED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 28 limited internal pilot inquiry execution is required.",
    );
  }

  requireSafeIdentifier(
    "Limited internal pilot inquiry execution identity",
    source.executionId,
  );

  requireSafeIdentifier(
    "Limited internal pilot owner execution decision identity",
    source.ownerExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Limited internal pilot runtime issuance identity",
    source.runtimeIssuanceId,
  );

  requireSafeIdentifier(
    "Limited internal pilot runtime identity",
    source.runtimeId,
  );

  requireSafeIdentifier(
    "Limited internal pilot tenant identity",
    source.tenantId,
  );

  requireSafeIdentifier(
    "Limited internal pilot owner identity",
    source.ownerId,
  );

  requireDigest(
    "Limited internal pilot inquiry execution digest",
    source.executionDigest,
  );

  requireDigest(
    "Limited internal pilot owner execution decision digest",
    source.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Limited internal pilot runtime issuance digest",
    source.runtimeIssuanceDigest,
  );

  requireDigest(
    "Limited internal pilot runtime digest",
    source.runtimeDigest,
  );

  requireDigest(
    "Limited internal pilot qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  requireIsoTimestamp(
    "Limited internal pilot inquiry execution time",
    source.executedAt,
  );

  verifyDigestBoundObject(
    "Workforce Day 28 limited internal pilot inquiry execution",
    source,
    "executionDigest",
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
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Asha limited internal pilot inquiry execution identity has changed.",
    );
  }

  const inquiry =
    source.pilotInquiry;

  if (
    inquiry.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    inquiry.dataClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    inquiry.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    inquiry.scenarioId !==
      EXPECTED_SCENARIO ||
    inquiry.inquirySequence !==
      1 ||
    inquiry.maximumInquiryCount !==
      3 ||
    inquiry.remainingInquiryCapacity !==
      2 ||
    inquiry.concurrentInquiryLimit !==
      1 ||
    inquiry.failureThreshold !==
      1 ||
    inquiry.ownerReviewFrequency !==
      "AFTER_EVERY_INQUIRY" ||
    inquiry.toolId !==
      "tool-inquiry-draft" ||
    inquiry.toolMode !==
      "DRAFT_ONLY" ||
    inquiry.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Limited internal pilot inquiry scope evidence is invalid.",
    );
  }

  const expectation =
    source.humanLikeScenarioExpectation;

  if (
    expectation.understandIncompleteRequirement !==
      true ||
    expectation.clarificationBeforeAssumptionRequired !==
      true ||
    expectation.repetitiveQuestioningProhibited !==
      true ||
    expectation.transparentAIIdentityRequired !==
      true ||
    expectation.humanImpersonationAuthorized !==
      false ||
    expectation.responseGenerationPerformed !==
      false
  ) {
    throw new Error(
      "Limited internal pilot human-like scenario expectation is invalid.",
    );
  }

  const evidence =
    source.syntheticInquiryEvidence;

  if (
    evidence.idempotencyKey !==
      SYNTHETIC_IDEMPOTENCY_KEY ||
    evidence.channel !==
      "WEB" ||
    evidence.customerName !==
      SYNTHETIC_CUSTOMER_NAME ||
    evidence.customerEmail !==
      SYNTHETIC_CUSTOMER_EMAIL ||
    evidence.customerPhone !==
      null ||
    evidence.message !==
      SYNTHETIC_MESSAGE ||
    evidence.resultOutcome !==
      "CREATED" ||
    evidence.inquiryId !==
      SYNTHETIC_INQUIRY_ID ||
    evidence.inquiryStatus !==
      "NEW" ||
    evidence.createdAt !==
      source.executedAt
  ) {
    throw new Error(
      "Limited internal pilot synthetic inquiry evidence is invalid.",
    );
  }

  const boundary =
    source.executionBoundary;

  if (
    boundary.ownerExecutionApprovalBound !==
      true ||
    boundary.runtimeIssuanceBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.pilotInquirySequenceEnforced !==
      true ||
    boundary.maximumInquiryCountPreserved !==
      true ||
    boundary.concurrentInquiryLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.ownerReviewAfterInquiryRequired !==
      true ||
    boundary.limitedInternalPilotInquiryExecuted !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticAuthenticatedInquiryCreated !==
      true ||
    boundary.genericPilotArchitectureInvoked !==
      false ||
    boundary.realCustomerInquiryCreated !==
      false ||
    boundary.realCustomerDataAccessed !==
      false ||
    boundary.customerContactPerformed !==
      false ||
    boundary.recommendationGenerationPerformed !==
      false ||
    boundary.externalDeliveryPerformed !==
      false ||
    boundary.liveProviderExecutionPerformed !==
      false ||
    boundary.productionDatabaseUsed !==
      false ||
    boundary.productionMutationPerformed !==
      false ||
    boundary.paymentExecutionPerformed !==
      false ||
    boundary.autonomousDecisionPerformed !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Limited internal pilot inquiry execution authority boundary is invalid.",
    );
  }

  validateControlledInquiryReceipt(
    source.controlledInquiryReceipt,
    source,
  );
}

export function createAshaOwnerLimitedInternalPilotInquiryReviewDecision(
  input:
    CreateAshaOwnerLimitedInternalPilotInquiryReviewDecisionInput,
): AshaOwnerLimitedInternalPilotInquiryReviewDecision {
  const source =
    input.limitedInternalPilotInquiryExecution;

  validateLimitedInternalPilotInquiryExecution(
    source,
  );

  requireSafeIdentifier(
    "Limited internal pilot inquiry review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Limited internal pilot inquiry review owner identity",
    input.ownerId,
  );

  const decidedAt =
    requireIsoTimestamp(
      "Limited internal pilot inquiry review decision time",
      input.decidedAt,
    );

  const reason =
    requireReason(input.reason);

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the limited-internal-pilot-bound owner can issue the inquiry review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_INQUIRY_PREPARATION" &&
    input.decision !==
      "REJECT_AND_RETAIN_INQUIRY_ONE_ONLY"
  ) {
    throw new Error(
      "Asha owner limited internal pilot inquiry review decision is invalid.",
    );
  }

  if (
    Date.parse(decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Owner limited internal pilot inquiry review decision cannot precede inquiry execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_INQUIRY_PREPARATION";

  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_RECORDED" as const,

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

    limitedInternalPilotInquiryExecutionId:
      source.executionId,

    limitedInternalPilotInquiryExecutionDigest:
      source.executionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    runtimeIssuanceId:
      source.runtimeIssuanceId,

    runtimeIssuanceDigest:
      source.runtimeIssuanceDigest,

    runtimeId:
      source.runtimeId,

    runtimeDigest:
      source.runtimeDigest,

    qualifiedManifestDigest:
      source.qualifiedManifestDigest,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    nextInquiryPreparationApproved:
      approved,

    inquiryTwoExecutionAuthorized:
      false as const,

    reason,

    reviewedEvidence: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        EXPECTED_SCENARIO,

      reviewedInquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        2 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      controlledInquiryOutcome:
        "CREATED" as const,

      controlledInquiryStatus:
        "NEW" as const,

      recommendationStatus:
        "NOT_GENERATED" as const,
    },

    authorityBoundary: {
      limitedInternalPilotInquiryExecutionBound:
        true as const,

      limitedInternalPilotInquiryExecutionIntegrityVerified:
        true as const,

      controlledInquiryReceiptIntegrityVerified:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryOneReviewed:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      nextInquiryPreparationAuthorized:
        approved,

      inquiryTwoExecutionAuthorized:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
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

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_ONE_ONLY" as const,

    decidedAt,
  };

  const decision:
    AshaOwnerLimitedInternalPilotInquiryReviewDecision = {
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    decision,
  ) as AshaOwnerLimitedInternalPilotInquiryReviewDecision;
}
