import {
  createHash,
} from "node:crypto";

import {
  ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
  type AshaControlledInquiryIntakeReceipt,
} from "./ashaControlledInquiryIntake";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION,
  type AshaLimitedInternalPilotInquiryTwoExecution,
} from "./ashaLimitedInternalPilotInquiryTwoExecution";

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION =
  "nexus-asha-owner-limited-internal-pilot-inquiry-two-review-decision-v1" as const;

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION",
  "REJECT_AND_RETAIN_INQUIRY_TWO_ONLY",
] as const;

export type AshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionType =
  (
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISIONS
  )[number];

export interface CreateAshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionInput {
  readonly limitedInternalPilotInquiryTwoExecution:
    AshaLimitedInternalPilotInquiryTwoExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision {
  readonly version:
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_RECORDED";

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

  readonly limitedInternalPilotInquiryTwoExecutionId:
    string;

  readonly limitedInternalPilotInquiryTwoExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly sourceInquiryReviewDecisionId:
    string;

  readonly sourceInquiryReviewDecisionDigest:
    string;

  readonly sourceInquiryExecutionId:
    string;

  readonly sourceInquiryExecutionDigest:
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
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionType;

  readonly inquiryThreePreparationApproved:
    boolean;

  readonly inquiryThreeExecutionAuthorized:
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
      "VERIFIED_URGENCY_WITHOUT_EXAGGERATION";

    reviewedInquirySequence:
      2;

    maximumInquiryCount:
      3;

    remainingInquiryCapacity:
      1;

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

    urgencyMustBeVerifiedBeforeClaiming:
      true;

    urgencyExaggerationProhibited:
      true;

    falseScarcityOrPressureProhibited:
      true;

    evidenceBasedClarificationRequired:
      true;

    transparentAIIdentityRequired:
      true;

    naturalProfessionalToneRequired:
      true;

    ownerEscalationOnUncertaintyRequired:
      true;

    humanImpersonationAuthorized:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    limitedInternalPilotInquiryTwoExecutionBound:
      true;

    limitedInternalPilotInquiryTwoExecutionIntegrityVerified:
      true;

    controlledInquiryReceiptIntegrityVerified:
      true;

    ownerExecutionDecisionBound:
      true;

    inquiryTwoPreparationBound:
      true;

    sourceInquiryOneReviewDecisionBound:
      true;

    sourceInquiryOneExecutionBound:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    qualifiedManifestBound:
      true;

    inquiryTwoReviewed:
      true;

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    inquiryThreePreparationAuthorized:
      boolean;

    inquiryThreeExecutionAuthorized:
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

    monitoringRequired:
      true;

    ownerReviewAfterInquiryThreeRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_ONLY";

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
  "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" as const;

const SYNTHETIC_IDEMPOTENCY_KEY =
  "asha-limited-internal-pilot-inquiry-002" as const;

const SYNTHETIC_CUSTOMER_NAME =
  "Synthetic Pilot Customer Two" as const;

const SYNTHETIC_CUSTOMER_EMAIL =
  "synthetic.pilot.two@example.invalid" as const;

const SYNTHETIC_MESSAGE =
  "Our internal workshop begins in three business days, and we need 40 certified safety helmets. Please confirm whether verified stock and realistic delivery timing can meet that date; if not, state the limitation clearly." as const;

const SYNTHETIC_INQUIRY_ID =
  "inquiry-asha-limited-internal-pilot-002" as const;

const SYNTHETIC_SESSION_ID =
  "session-asha-limited-internal-pilot-002" as const;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token)/i;

const CONTROL_CHARACTER_PATTERN =
  /[\u0000-\u001f\u007f]/;

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
      "Unsupported deterministic inquiry two review value.",
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
      label + " must be a canonical safe identifier.",
    );
  }

  if (
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      label + " contains a credential-bearing term.",
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
      label + " must be a SHA-256 digest.",
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
      label + " must be an exact ISO timestamp.",
    );
  }

  return value;
}

function requireDecision(
  value: unknown,
): AshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionType {
  if (
    typeof value !== "string" ||
    !ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISIONS
      .includes(
        value as AshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionType,
      )
  ) {
    throw new Error(
      "Asha owner inquiry two review decision is invalid.",
    );
  }

  return value as
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionType;
}

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < 24 ||
    value.length > 1_000 ||
    CONTROL_CHARACTER_PATTERN.test(value) ||
    FORBIDDEN_REASON_PATTERN.test(value)
  ) {
    throw new Error(
      "Inquiry two review reason must be safe, explicit, and non-secret.",
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
      label + " digest",
      record[digestField],
    );

  delete record[digestField];

  if (
    sha256(record) !==
    digest
  ) {
    throw new Error(
      label + " integrity verification failed.",
    );
  }

  return digest;
}

function validateControlledInquiryReceipt(
  receipt:
    AshaControlledInquiryIntakeReceipt,
  source:
    AshaLimitedInternalPilotInquiryTwoExecution,
): void {
  verifyDigestBoundObject(
    "Inquiry two controlled inquiry receipt",
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
      "Inquiry two controlled receipt identity binding is invalid.",
    );
  }

  const authority =
    receipt.workforceAuthority;

  if (
    authority.employeeQualified !== true ||
    authority.employeeOwnerActivated !== true ||
    authority.controlledWorkAuthorized !== true ||
    authority.toolId !==
      "tool-inquiry-draft" ||
    authority.toolMode !==
      "DRAFT_ONLY" ||
    authority.tenantScoped !==
      true
  ) {
    throw new Error(
      "Inquiry two controlled receipt workforce authority is invalid.",
    );
  }

  const safety =
    receipt.safetyBoundary;

  if (
    safety.recommendationGenerationAuthorized !== false ||
    safety.externalMessageDeliveryAuthorized !== false ||
    safety.liveProviderExecutionAuthorized !== false ||
    safety.paymentExecutionAuthorized !== false ||
    safety.ownerApprovalRequiredBeforeExecution !== true ||
    safety.executionMode !==
      "SANDBOX_ONLY" ||
    safety.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Inquiry two controlled receipt safety boundary is invalid.",
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
      "Inquiry two controlled authenticated evidence is invalid.",
    );
  }
}

function validateInquiryTwoExecution(
  source:
    AshaLimitedInternalPilotInquiryTwoExecution,
): void {
  if (
    source.version !==
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 32 inquiry two execution is required.",
    );
  }

  for (
    const [label, value] of [
      ["Inquiry two execution identity", source.executionId],
      ["Owner execution decision identity", source.ownerExecutionDecisionId],
      ["Inquiry two preparation identity", source.preparationId],
      ["Inquiry one review decision identity", source.sourceInquiryReviewDecisionId],
      ["Inquiry one execution identity", source.sourceInquiryExecutionId],
      ["Runtime issuance identity", source.runtimeIssuanceId],
      ["Runtime identity", source.runtimeId],
      ["Tenant identity", source.tenantId],
      ["Owner identity", source.ownerId],
    ] as const
  ) {
    requireSafeIdentifier(
      label,
      value,
    );
  }

  for (
    const [label, value] of [
      ["Inquiry two execution digest", source.executionDigest],
      ["Owner execution decision digest", source.ownerExecutionDecisionDigest],
      ["Inquiry two preparation digest", source.preparationDigest],
      ["Inquiry one review decision digest", source.sourceInquiryReviewDecisionDigest],
      ["Inquiry one execution digest", source.sourceInquiryExecutionDigest],
      ["Runtime issuance digest", source.runtimeIssuanceDigest],
      ["Runtime digest", source.runtimeDigest],
      ["Qualified manifest digest", source.qualifiedManifestDigest],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Inquiry two execution time",
    source.executedAt,
  );

  verifyDigestBoundObject(
    "Workforce Day 32 inquiry two execution",
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
      "Asha inquiry two execution identity has changed.",
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
      2 ||
    inquiry.maximumInquiryCount !==
      3 ||
    inquiry.remainingInquiryCapacity !==
      1 ||
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
      "Inquiry two scope evidence is invalid.",
    );
  }

  const expectation =
    source.humanLikeScenarioExpectation;

  if (
    expectation.urgencyMustBeVerifiedBeforeClaiming !== true ||
    expectation.urgencyExaggerationProhibited !== true ||
    expectation.falseScarcityOrPressureProhibited !== true ||
    expectation.evidenceBasedClarificationRequired !== true ||
    expectation.transparentAIIdentityRequired !== true ||
    expectation.naturalProfessionalToneRequired !== true ||
    expectation.ownerEscalationOnUncertaintyRequired !== true ||
    expectation.responseGenerationPerformed !== false ||
    expectation.humanImpersonationAuthorized !== false
  ) {
    throw new Error(
      "Inquiry two verified-urgency expectation is invalid.",
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
      "Inquiry two synthetic evidence is invalid.",
    );
  }

  const boundary =
    source.executionBoundary;

  if (
    boundary.ownerExecutionApprovalBound !== true ||
    boundary.runtimeIssuanceBound !== true ||
    boundary.qualifiedManifestBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.pilotInquirySequenceEnforced !== true ||
    boundary.maximumInquiryCountPreserved !== true ||
    boundary.concurrentInquiryLimitEnforced !== true ||
    boundary.failureThresholdPreserved !== true ||
    boundary.ownerReviewAfterInquiryRequired !== true ||
    boundary.inquiryTwoExecutionDecisionBound !== true ||
    boundary.inquiryTwoExecutionPerformed !== true ||
    boundary.inquiryThreePreparationAuthorized !== false ||
    boundary.inquiryThreeExecutionAuthorized !== false ||
    boundary.ownerReviewAfterInquiryTwoRequired !== true ||
    boundary.limitedInternalPilotInquiryExecuted !== true ||
    boundary.limitedInternalPilotCompleted !== false ||
    boundary.syntheticAuthenticatedInquiryCreated !== true ||
    boundary.genericPilotArchitectureInvoked !== false ||
    boundary.realCustomerInquiryCreated !== false ||
    boundary.realCustomerDataAccessed !== false ||
    boundary.customerContactPerformed !== false ||
    boundary.recommendationGenerationPerformed !== false ||
    boundary.externalDeliveryPerformed !== false ||
    boundary.liveProviderExecutionPerformed !== false ||
    boundary.productionDatabaseUsed !== false ||
    boundary.productionMutationPerformed !== false ||
    boundary.paymentExecutionPerformed !== false ||
    boundary.autonomousDecisionPerformed !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.emergencyPauseAvailable !== true
  ) {
    throw new Error(
      "Inquiry two execution authority boundary is invalid.",
    );
  }

  validateControlledInquiryReceipt(
    source.controlledInquiryReceipt,
    source,
  );
}

export function createAshaOwnerLimitedInternalPilotInquiryTwoReviewDecision(
  input:
    CreateAshaOwnerLimitedInternalPilotInquiryTwoReviewDecisionInput,
): AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision {
  const source =
    input.limitedInternalPilotInquiryTwoExecution;

  validateInquiryTwoExecution(
    source,
  );

  const decisionId =
    requireSafeIdentifier(
      "Inquiry two review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Inquiry two review owner identity",
      input.ownerId,
    );

  const decision =
    requireDecision(
      input.decision,
    );

  const reason =
    requireReason(
      input.reason,
    );

  const decidedAt =
    requireIsoTimestamp(
      "Inquiry two review decision time",
      input.decidedAt,
    );

  if (
    ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Only the inquiry-two-bound owner can issue its review decision.",
    );
  }

  if (
    Date.parse(decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Inquiry two review decision cannot precede inquiry two execution.",
    );
  }

  const approved =
    decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION";

  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_RECORDED" as const,

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

    limitedInternalPilotInquiryTwoExecutionId:
      source.executionId,

    limitedInternalPilotInquiryTwoExecutionDigest:
      source.executionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceInquiryReviewDecisionId:
      source.sourceInquiryReviewDecisionId,

    sourceInquiryReviewDecisionDigest:
      source.sourceInquiryReviewDecisionDigest,

    sourceInquiryExecutionId:
      source.sourceInquiryExecutionId,

    sourceInquiryExecutionDigest:
      source.sourceInquiryExecutionDigest,

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

    ownerId,

    decision,

    inquiryThreePreparationApproved:
      approved,

    inquiryThreeExecutionAuthorized:
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
        2 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        1 as const,

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

      urgencyMustBeVerifiedBeforeClaiming:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      falseScarcityOrPressureProhibited:
        true as const,

      evidenceBasedClarificationRequired:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      naturalProfessionalToneRequired:
        true as const,

      ownerEscalationOnUncertaintyRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,
    },

    authorityBoundary: {
      limitedInternalPilotInquiryTwoExecutionBound:
        true as const,

      limitedInternalPilotInquiryTwoExecutionIntegrityVerified:
        true as const,

      controlledInquiryReceiptIntegrityVerified:
        true as const,

      ownerExecutionDecisionBound:
        true as const,

      inquiryTwoPreparationBound:
        true as const,

      sourceInquiryOneReviewDecisionBound:
        true as const,

      sourceInquiryOneExecutionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryTwoReviewed:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      inquiryThreePreparationAuthorized:
        approved,

      inquiryThreeExecutionAuthorized:
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

      monitoringRequired:
        true as const,

      ownerReviewAfterInquiryThreeRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_ONLY" as const,

    decidedAt,
  };

  const result:
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision = {
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    result,
  ) as AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision;
}
