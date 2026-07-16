import {
  createHash,
} from "node:crypto";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION,
  type AshaLimitedInternalPilotInquiryTwoPreparation,
} from "./ashaLimitedInternalPilotInquiryTwoPreparation";

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION =
  "nexus-asha-owner-limited-internal-pilot-inquiry-two-execution-decision-v1" as const;

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION",
  "REJECT_AND_RETAIN_INQUIRY_TWO_PREPARATION_ONLY",
] as const;

export type AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecisionType =
  (
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISIONS
  )[number];

export interface CreateAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecisionInput {
  readonly limitedInternalPilotInquiryTwoPreparation:
    AshaLimitedInternalPilotInquiryTwoPreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision {
  readonly version:
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_RECORDED";

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
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecisionType;

  readonly approvedForInquiryTwoExecution:
    boolean;

  readonly reason:
    string;

  readonly reviewedInquiryTwoPreparation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    scenarioId:
      "VERIFIED_URGENCY_WITHOUT_EXAGGERATION";

    inquirySequence:
      2;

    priorReviewedInquirySequence:
      1;

    maximumInquiryCount:
      3;

    remainingInquiryCapacityBeforeExecution:
      2;

    projectedRemainingInquiryCapacityAfterExecution:
      1;

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

    urgencyVerificationStandardBound:
      true;

    urgencyExaggerationProhibited:
      true;

    falseScarcityOrPressureProhibited:
      true;

    transparentAIIdentityRequired:
      true;

    humanImpersonationAuthorized:
      false;

    existingPilotArchitectureBound:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    sourceInquiryTwoPreparationIntegrityVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    exactRuntimeBound:
      true;

    exactQualifiedManifestBound:
      true;

    inquiryOneOwnerReviewApprovalBound:
      true;

    inquiryTwoPreparationBound:
      true;

    inquiryTwoExecutionDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    inquiryTwoExecutionAuthorized:
      boolean;

    inquiryTwoExecutionPerformed:
      false;

    syntheticInquiryExecutionPerformed:
      false;

    concurrentInquiryExecutionAuthorized:
      false;

    inquiryThreePreparationAuthorized:
      false;

    inquiryThreeExecutionAuthorized:
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

    ownerReviewAfterInquiryTwoRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO"
    | "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_ONLY";

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

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const FORBIDDEN_SECRET_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|api[_-]?key)/i;

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
      "Unsupported deterministic inquiry two execution decision value.",
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
    FORBIDDEN_SECRET_PATTERN.test(value)
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

function requireDecision(
  value: unknown,
): AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecisionType {
  if (
    value !==
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION" &&
    value !==
      "REJECT_AND_RETAIN_INQUIRY_TWO_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Inquiry two execution decision is invalid.",
    );
  }

  return value;
}

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < 16 ||
    value.length > 512 ||
    CONTROL_CHARACTER_PATTERN.test(value) ||
    FORBIDDEN_SECRET_PATTERN.test(value)
  ) {
    throw new Error(
      "Inquiry two execution decision reason must be safe and specific.",
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

function validateInquiryTwoPreparation(
  source:
    AshaLimitedInternalPilotInquiryTwoPreparation,
): void {
  if (
    source.version !==
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 30 inquiry two preparation is required.",
    );
  }

  requireSafeIdentifier(
    "Inquiry two preparation identity",
    source.preparationId,
  );

  requireSafeIdentifier(
    "Inquiry one review decision identity",
    source.sourceInquiryReviewDecisionId,
  );

  requireSafeIdentifier(
    "Inquiry one execution identity",
    source.sourceInquiryExecutionId,
  );

  requireSafeIdentifier(
    "Runtime issuance identity",
    source.runtimeIssuanceId,
  );

  requireSafeIdentifier(
    "Runtime identity",
    source.runtimeId,
  );

  requireSafeIdentifier(
    "Tenant identity",
    source.tenantId,
  );

  requireSafeIdentifier(
    "Owner identity",
    source.ownerId,
  );

  requireDigest(
    "Inquiry two preparation digest",
    source.preparationDigest,
  );

  requireDigest(
    "Inquiry one review decision digest",
    source.sourceInquiryReviewDecisionDigest,
  );

  requireDigest(
    "Inquiry one execution digest",
    source.sourceInquiryExecutionDigest,
  );

  requireDigest(
    "Runtime issuance digest",
    source.runtimeIssuanceDigest,
  );

  requireDigest(
    "Runtime digest",
    source.runtimeDigest,
  );

  requireDigest(
    "Qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  requireIsoTimestamp(
    "Inquiry two preparation timestamp",
    source.preparedAt,
  );

  verifyDigestBoundObject(
    "Workforce Day 30 inquiry two preparation",
    source,
    "preparationDigest",
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
      "Asha inquiry two preparation identity has changed.",
    );
  }

  const inquiry =
    source.preparedInquiry;

  if (
    inquiry.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    inquiry.dataClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    inquiry.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    inquiry.scenarioId !==
      "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" ||
    inquiry.inquirySequence !==
      2 ||
    inquiry.priorReviewedInquirySequence !==
      1 ||
    inquiry.maximumInquiryCount !==
      3 ||
    inquiry.remainingInquiryCapacityBeforeExecution !==
      2 ||
    inquiry.projectedRemainingInquiryCapacityAfterExecution !==
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
      "Inquiry two prepared scope is invalid.",
    );
  }

  const standard =
    source.humanLikeScenarioExpectation;

  if (
    standard.urgencyMustBeVerifiedBeforeClaiming !==
      true ||
    standard.urgencyExaggerationProhibited !==
      true ||
    standard.falseScarcityOrPressureProhibited !==
      true ||
    standard.evidenceBasedClarificationRequired !==
      true ||
    standard.transparentAIIdentityRequired !==
      true ||
    standard.naturalProfessionalToneRequired !==
      true ||
    standard.ownerEscalationOnUncertaintyRequired !==
      true ||
    standard.responseGenerationPerformed !==
      false ||
    standard.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Inquiry two human-like urgency standard is invalid.",
    );
  }

  const bridge =
    source.existingPilotArchitectureBridge;

  if (
    bridge.duplicatePilotEngineCreated !==
      false ||
    bridge.enrollmentInvoked !==
      false ||
    bridge.accessGranted !==
      false ||
    bridge.pilotControlInvoked !==
      false ||
    bridge.healthObservationInvoked !==
      false ||
    bridge.operationAdmissionClaimed !==
      false
  ) {
    throw new Error(
      "Inquiry two preparation improperly invoked pilot architecture.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourceInquiryReviewDecisionBound !==
      true ||
    boundary.sourceInquiryReviewDecisionIntegrityVerified !==
      true ||
    boundary.sourceInquiryExecutionBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.inquiryOneOwnerReviewApproved !==
      true ||
    boundary.inquiryTwoPreparationAuthorized !==
      true ||
    boundary.inquiryTwoPrepared !==
      true ||
    boundary.inquiryTwoExecutionAuthorized !==
      false ||
    boundary.concurrentInquiryExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticInquiryCreated !==
      false ||
    boundary.realCustomerInquiryAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
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
      false ||
    boundary.monitoringRequired !==
      true ||
    boundary.ownerReviewAfterInquiryTwoRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Inquiry two preparation authority boundary is invalid.",
    );
  }
}

export function createAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision(
  input:
    CreateAshaOwnerLimitedInternalPilotInquiryTwoExecutionDecisionInput,
): AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision {
  const decisionId =
    requireSafeIdentifier(
      "Inquiry two owner execution decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Owner identity",
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
      "Inquiry two owner execution decision timestamp",
      input.decidedAt,
    );

  const source =
    input.limitedInternalPilotInquiryTwoPreparation;

  validateInquiryTwoPreparation(
    source,
  );

  if (
    ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Only the preparation-bound owner can issue the inquiry two execution decision.",
    );
  }

  if (
    Date.parse(decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Inquiry two execution decision cannot precede its preparation.",
    );
  }

  const approved =
    decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION";

  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_RECORDED" as const,

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

    approvedForInquiryTwoExecution:
      approved,

    reason,

    reviewedInquiryTwoPreparation: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" as const,

      inquirySequence:
        2 as const,

      priorReviewedInquirySequence:
        1 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacityBeforeExecution:
        2 as const,

      projectedRemainingInquiryCapacityAfterExecution:
        1 as const,

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

      urgencyVerificationStandardBound:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      falseScarcityOrPressureProhibited:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      humanImpersonationAuthorized:
        false as const,

      existingPilotArchitectureBound:
        true as const,
    },

    authorityBoundary: {
      sourceInquiryTwoPreparationIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactRuntimeBound:
        true as const,

      exactQualifiedManifestBound:
        true as const,

      inquiryOneOwnerReviewApprovalBound:
        true as const,

      inquiryTwoPreparationBound:
        true as const,

      inquiryTwoExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      inquiryTwoExecutionAuthorized:
        approved,

      inquiryTwoExecutionPerformed:
        false as const,

      syntheticInquiryExecutionPerformed:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      inquiryThreePreparationAuthorized:
        false as const,

      inquiryThreeExecutionAuthorized:
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

      ownerReviewAfterInquiryTwoRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_ONLY" as const,

    decidedAt,
  };

  const result:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision = {
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    result,
  ) as AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision;
}
