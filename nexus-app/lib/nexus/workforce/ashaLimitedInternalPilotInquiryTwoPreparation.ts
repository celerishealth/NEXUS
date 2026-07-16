import {
  createHash,
} from "node:crypto";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryReviewDecision,
} from "./ashaOwnerLimitedInternalPilotInquiryReviewDecision";

export const ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION =
  "nexus-asha-limited-internal-pilot-inquiry-two-preparation-v1" as const;

export interface CreateAshaLimitedInternalPilotInquiryTwoPreparationInput {
  readonly preparationId:
    string;

  readonly ownerLimitedInternalPilotInquiryReviewDecision:
    AshaOwnerLimitedInternalPilotInquiryReviewDecision;

  readonly preparedAt:
    string;
}

export interface AshaLimitedInternalPilotInquiryTwoPreparation {
  readonly version:
    typeof ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARED";

  readonly sourceInquiryReviewDecisionId:
    string;

  readonly sourceInquiryReviewDecisionDigest:
    string;

  readonly sourceInquiryExecutionId:
    string;

  readonly sourceInquiryExecutionDigest:
    string;

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

  readonly preparedInquiry: Readonly<{
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
  }>;

  readonly humanLikeScenarioExpectation: Readonly<{
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

    responseGenerationPerformed:
      false;

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
    sourceInquiryReviewDecisionBound:
      true;

    sourceInquiryReviewDecisionIntegrityVerified:
      true;

    sourceInquiryExecutionBound:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    qualifiedManifestBound:
      true;

    inquiryOneOwnerReviewApproved:
      true;

    inquiryTwoPreparationAuthorized:
      true;

    inquiryTwoPrepared:
      true;

    inquiryTwoExecutionAuthorized:
      false;

    concurrentInquiryExecutionAuthorized:
      false;

    limitedInternalPilotCompleted:
      false;

    syntheticInquiryCreated:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION";

  readonly preparedAt:
    string;

  readonly preparationDigest:
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
      "Unsupported deterministic inquiry two preparation value.",
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

function validateOwnerInquiryReviewDecision(
  source:
    AshaOwnerLimitedInternalPilotInquiryReviewDecision,
): void {
  if (
    source.version !==
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_REVIEW_RECORDED" ||
    source.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_INQUIRY_PREPARATION" ||
    source.nextInquiryPreparationApproved !==
      true ||
    source.inquiryTwoExecutionAuthorized !==
      false ||
    source.nextStep !==
      "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO"
  ) {
    throw new Error(
      "An approved Workforce Day 29 inquiry one owner review decision is required.",
    );
  }

  requireSafeIdentifier(
    "Inquiry one owner review decision identity",
    source.decisionId,
  );

  requireSafeIdentifier(
    "Inquiry one source execution identity",
    source.limitedInternalPilotInquiryExecutionId,
  );

  requireSafeIdentifier(
    "Inquiry one owner execution decision identity",
    source.ownerExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Inquiry two preparation runtime issuance identity",
    source.runtimeIssuanceId,
  );

  requireSafeIdentifier(
    "Inquiry two preparation runtime identity",
    source.runtimeId,
  );

  requireSafeIdentifier(
    "Inquiry two preparation tenant identity",
    source.tenantId,
  );

  requireSafeIdentifier(
    "Inquiry two preparation owner identity",
    source.ownerId,
  );

  requireDigest(
    "Inquiry one owner review decision digest",
    source.decisionDigest,
  );

  requireDigest(
    "Inquiry one source execution digest",
    source.limitedInternalPilotInquiryExecutionDigest,
  );

  requireDigest(
    "Inquiry one owner execution decision digest",
    source.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Inquiry two preparation runtime issuance digest",
    source.runtimeIssuanceDigest,
  );

  requireDigest(
    "Inquiry two preparation runtime digest",
    source.runtimeDigest,
  );

  requireDigest(
    "Inquiry two preparation qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  requireIsoTimestamp(
    "Inquiry one owner review decision time",
    source.decidedAt,
  );

  verifyDigestBoundObject(
    "Workforce Day 29 inquiry one owner review decision",
    source,
    "decisionDigest",
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
      "Asha inquiry one owner review identity has changed.",
    );
  }

  const evidence =
    source.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.dataClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    evidence.scenarioId !==
      "INCOMPLETE_REQUIREMENT_CLARIFICATION" ||
    evidence.reviewedInquirySequence !==
      1 ||
    evidence.maximumInquiryCount !==
      3 ||
    evidence.remainingInquiryCapacity !==
      2 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_INQUIRY" ||
    evidence.toolId !==
      "tool-inquiry-draft" ||
    evidence.toolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.controlledInquiryOutcome !==
      "CREATED" ||
    evidence.controlledInquiryStatus !==
      "NEW" ||
    evidence.recommendationStatus !==
      "NOT_GENERATED"
  ) {
    throw new Error(
      "Inquiry one reviewed evidence is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.limitedInternalPilotInquiryExecutionBound !==
      true ||
    boundary.limitedInternalPilotInquiryExecutionIntegrityVerified !==
      true ||
    boundary.controlledInquiryReceiptIntegrityVerified !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.inquiryOneReviewed !==
      true ||
    boundary.ownerDecisionRequired !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.nextInquiryPreparationAuthorized !==
      true ||
    boundary.inquiryTwoExecutionAuthorized !==
      false ||
    boundary.concurrentInquiryExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotCompleted !==
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
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Inquiry one owner review authority boundary is invalid.",
    );
  }
}

export function createAshaLimitedInternalPilotInquiryTwoPreparation(
  input:
    CreateAshaLimitedInternalPilotInquiryTwoPreparationInput,
): AshaLimitedInternalPilotInquiryTwoPreparation {
  const preparationId =
    requireSafeIdentifier(
      "Inquiry two preparation identity",
      input.preparationId,
    );

  const preparedAt =
    requireIsoTimestamp(
      "Inquiry two preparation time",
      input.preparedAt,
    );

  const source =
    input.ownerLimitedInternalPilotInquiryReviewDecision;

  validateOwnerInquiryReviewDecision(
    source,
  );

  if (
    Date.parse(preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Inquiry two preparation cannot precede the inquiry one owner review decision.",
    );
  }

  const preparationCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARATION_VERSION,

    preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_PREPARED" as const,

    sourceInquiryReviewDecisionId:
      source.decisionId,

    sourceInquiryReviewDecisionDigest:
      source.decisionDigest,

    sourceInquiryExecutionId:
      source.limitedInternalPilotInquiryExecutionId,

    sourceInquiryExecutionDigest:
      source.limitedInternalPilotInquiryExecutionDigest,

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
      source.runtimeDigest,

    qualifiedManifestDigest:
      source.qualifiedManifestDigest,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    preparedInquiry: {
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
    },

    humanLikeScenarioExpectation: {
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

      responseGenerationPerformed:
        false as const,

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
      sourceInquiryReviewDecisionBound:
        true as const,

      sourceInquiryReviewDecisionIntegrityVerified:
        true as const,

      sourceInquiryExecutionBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryOneOwnerReviewApproved:
        true as const,

      inquiryTwoPreparationAuthorized:
        true as const,

      inquiryTwoPrepared:
        true as const,

      inquiryTwoExecutionAuthorized:
        false as const,

      concurrentInquiryExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticInquiryCreated:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION" as const,

    preparedAt,
  };

  const preparation:
    AshaLimitedInternalPilotInquiryTwoPreparation = {
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    };

  return deepFreeze(
    preparation,
  ) as AshaLimitedInternalPilotInquiryTwoPreparation;
}
