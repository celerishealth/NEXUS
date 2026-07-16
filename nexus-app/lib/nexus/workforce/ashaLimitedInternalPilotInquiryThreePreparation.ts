import { createHash } from "node:crypto";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision,
} from "./ashaOwnerLimitedInternalPilotInquiryTwoReviewDecision";

export const ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION =
  "nexus-asha-limited-internal-pilot-inquiry-three-preparation-v1" as const;

export interface CreateAshaLimitedInternalPilotInquiryThreePreparationInput {
  readonly preparationId: string;

  readonly ownerLimitedInternalPilotInquiryTwoReviewDecision:
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision;

  readonly preparedAt: string;
}

export interface AshaLimitedInternalPilotInquiryThreePreparation {
  readonly version:
    typeof ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION;

  readonly preparationId: string;

  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARED";

  readonly sourceInquiryTwoReviewDecisionId: string;
  readonly sourceInquiryTwoReviewDecisionDigest: string;

  readonly sourceInquiryTwoExecutionId: string;
  readonly sourceInquiryTwoExecutionDigest: string;

  readonly ownerExecutionDecisionId: string;
  readonly ownerExecutionDecisionDigest: string;

  readonly inquiryTwoPreparationId: string;
  readonly inquiryTwoPreparationDigest: string;

  readonly sourceInquiryOneReviewDecisionId: string;
  readonly sourceInquiryOneReviewDecisionDigest: string;

  readonly sourceInquiryOneExecutionId: string;
  readonly sourceInquiryOneExecutionDigest: string;

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

  readonly runtimeIssuanceId: string;
  readonly runtimeIssuanceDigest: string;

  readonly runtimeId: string;
  readonly runtimeDigest: string;

  readonly qualifiedManifestDigest: string;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly preparedInquiry: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";

    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";

    scenarioId:
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY";

    inquirySequence:
      3;

    priorReviewedInquirySequence:
      2;

    maximumInquiryCount:
      3;

    remainingInquiryCapacityBeforeExecution:
      1;

    projectedRemainingInquiryCapacityAfterExecution:
      0;

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

  readonly customerContextContinuityExpectation: Readonly<{
    customerContextContinuityRequired:
      true;

    repeatedQuestionAvoidanceRequired:
      true;

    clarificationBeforeGuessingRequired:
      true;

    promiseAndFollowUpTrackingRequired:
      true;

    uncertaintyEscalatesToOwner:
      true;

    tenantScopedContextOnly:
      true;

    customerScopedContextOnly:
      true;

    crossTenantContextReuseAuthorized:
      false;

    crossCustomerContextReuseAuthorized:
      false;

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
    sourceInquiryTwoReviewDecisionBound:
      true;

    sourceInquiryTwoReviewDecisionIntegrityVerified:
      true;

    sourceInquiryTwoExecutionBound:
      true;

    sourceInquiryTwoPreparationBound:
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

    inquiryTwoOwnerReviewApproved:
      true;

    inquiryThreePreparationAuthorized:
      true;

    inquiryThreePrepared:
      true;

    inquiryThreeExecutionAuthorized:
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

    ownerReviewAfterInquiryThreeRequired:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION";

  readonly preparedAt: string;

  readonly preparationDigest: string;
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

const FORBIDDEN_TEXT_PATTERN =
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
    const entries =
      Object.entries(
        value as Record<string, unknown>,
      ).sort(
        ([left], [right]) =>
          left.localeCompare(right),
      );

    return (
      "{" +
      entries
        .map(
          ([key, item]) =>
            `${JSON.stringify(key)}:${stableStringify(item)}`,
        )
        .join(",") +
      "}"
    );
  }

  return JSON.stringify(value);
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
    for (
      const child of Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(child);
    }

    Object.freeze(value);
  }

  return value;
}

function requireSafeIdentifier(
  label: string,
  value: string,
): string {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid or secret-bearing.`,
    );
  }

  return value;
}

function requireDigest(
  label: string,
  value: string,
): string {
  if (!SHA_256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a lowercase SHA-256 digest.`,
    );
  }

  return value;
}

function requireIsoTimestamp(
  label: string,
  value: string,
): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new Error(
      `${label} must be a valid ISO timestamp.`,
    );
  }

  return value;
}

function requireSafeText(
  label: string,
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length < 10 ||
    normalized.length > 1000 ||
    FORBIDDEN_TEXT_PATTERN.test(normalized)
  ) {
    throw new Error(
      `${label} is invalid or secret-bearing.`,
    );
  }

  return normalized;
}

function verifyDigestBoundObject(
  label: string,
  source: Record<string, unknown>,
  digestKey: string,
): void {
  const suppliedDigest =
    source[digestKey];

  if (
    typeof suppliedDigest !== "string"
  ) {
    throw new Error(
      `${label} digest is missing.`,
    );
  }

  requireDigest(
    `${label} digest`,
    suppliedDigest,
  );

  const digestCore = {
    ...source,
  };

  delete digestCore[digestKey];

  if (
    sha256(digestCore) !==
    suppliedDigest
  ) {
    throw new Error(
      `${label} digest verification failed.`,
    );
  }
}

function validateInquiryTwoReviewDecision(
  source:
    AshaOwnerLimitedInternalPilotInquiryTwoReviewDecision,
): void {
  if (
    source.version !==
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW_RECORDED" ||
    source.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION" ||
    source.inquiryThreePreparationApproved !==
      true ||
    source.inquiryThreeExecutionAuthorized !==
      false ||
    source.nextStep !==
      "PREPARE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE"
  ) {
    throw new Error(
      "An approved Workforce Day 33 inquiry-two review decision is required.",
    );
  }

  for (
    const [label, value] of [
      [
        "Inquiry two review decision identity",
        source.decisionId,
      ],
      [
        "Inquiry two execution identity",
        source.limitedInternalPilotInquiryTwoExecutionId,
      ],
      [
        "Owner execution decision identity",
        source.ownerExecutionDecisionId,
      ],
      [
        "Inquiry two preparation identity",
        source.preparationId,
      ],
      [
        "Inquiry one review decision identity",
        source.sourceInquiryReviewDecisionId,
      ],
      [
        "Inquiry one execution identity",
        source.sourceInquiryExecutionId,
      ],
      [
        "Runtime issuance identity",
        source.runtimeIssuanceId,
      ],
      [
        "Runtime identity",
        source.runtimeId,
      ],
      [
        "Tenant identity",
        source.tenantId,
      ],
      [
        "Owner identity",
        source.ownerId,
      ],
    ] as const
  ) {
    requireSafeIdentifier(
      label,
      value,
    );
  }

  for (
    const [label, value] of [
      [
        "Inquiry two review decision digest",
        source.decisionDigest,
      ],
      [
        "Inquiry two execution digest",
        source.limitedInternalPilotInquiryTwoExecutionDigest,
      ],
      [
        "Owner execution decision digest",
        source.ownerExecutionDecisionDigest,
      ],
      [
        "Inquiry two preparation digest",
        source.preparationDigest,
      ],
      [
        "Inquiry one review decision digest",
        source.sourceInquiryReviewDecisionDigest,
      ],
      [
        "Inquiry one execution digest",
        source.sourceInquiryExecutionDigest,
      ],
      [
        "Runtime issuance digest",
        source.runtimeIssuanceDigest,
      ],
      [
        "Runtime digest",
        source.runtimeDigest,
      ],
      [
        "Qualified manifest digest",
        source.qualifiedManifestDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Inquiry two review decision time",
    source.decidedAt,
  );

  requireSafeText(
    "Inquiry two review reason",
    source.reason,
  );

  verifyDigestBoundObject(
    "Workforce Day 33 inquiry two review decision",
    source as unknown as Record<string, unknown>,
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
      "Asha inquiry-two review identity has changed.",
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
      "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" ||
    evidence.reviewedInquirySequence !==
      2 ||
    evidence.maximumInquiryCount !==
      3 ||
    evidence.remainingInquiryCapacity !==
      1 ||
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
      "NOT_GENERATED" ||
    evidence.urgencyMustBeVerifiedBeforeClaiming !==
      true ||
    evidence.urgencyExaggerationProhibited !==
      true ||
    evidence.falseScarcityOrPressureProhibited !==
      true ||
    evidence.evidenceBasedClarificationRequired !==
      true ||
    evidence.transparentAIIdentityRequired !==
      true ||
    evidence.naturalProfessionalToneRequired !==
      true ||
    evidence.ownerEscalationOnUncertaintyRequired !==
      true ||
    evidence.humanImpersonationAuthorized !==
      false
  ) {
    throw new Error(
      "Inquiry two reviewed evidence is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.limitedInternalPilotInquiryTwoExecutionBound !== true ||
    boundary.limitedInternalPilotInquiryTwoExecutionIntegrityVerified !== true ||
    boundary.controlledInquiryReceiptIntegrityVerified !== true ||
    boundary.ownerExecutionDecisionBound !== true ||
    boundary.inquiryTwoPreparationBound !== true ||
    boundary.sourceInquiryOneReviewDecisionBound !== true ||
    boundary.sourceInquiryOneExecutionBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.qualifiedManifestBound !== true ||
    boundary.inquiryTwoReviewed !== true ||
    boundary.ownerDecisionRequired !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.inquiryThreePreparationAuthorized !== true ||
    boundary.inquiryThreeExecutionAuthorized !== false ||
    boundary.concurrentInquiryExecutionAuthorized !== false ||
    boundary.limitedInternalPilotCompleted !== false ||
    boundary.realCustomerInquiryAuthorized !== false ||
    boundary.realCustomerDataAccessAuthorized !== false ||
    boundary.customerContactAuthorized !== false ||
    boundary.recommendationGenerationAuthorized !== false ||
    boundary.externalDeliveryAuthorized !== false ||
    boundary.liveProviderExecutionAuthorized !== false ||
    boundary.productionDatabaseAuthorized !== false ||
    boundary.productionMutationAuthorized !== false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.autonomousDecisionAuthorized !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.monitoringRequired !== true ||
    boundary.ownerReviewAfterInquiryThreeRequired !== true ||
    boundary.emergencyPauseAvailable !== true
  ) {
    throw new Error(
      "Inquiry two review authority boundary is invalid.",
    );
  }
}

export function createAshaLimitedInternalPilotInquiryThreePreparation(
  input:
    CreateAshaLimitedInternalPilotInquiryThreePreparationInput,
): AshaLimitedInternalPilotInquiryThreePreparation {
  const preparationId =
    requireSafeIdentifier(
      "Inquiry three preparation identity",
      input.preparationId,
    );

  const preparedAt =
    requireIsoTimestamp(
      "Inquiry three preparation time",
      input.preparedAt,
    );

  const source =
    input.ownerLimitedInternalPilotInquiryTwoReviewDecision;

  validateInquiryTwoReviewDecision(
    source,
  );

  if (
    Date.parse(preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Inquiry three preparation cannot precede the inquiry two owner review decision.",
    );
  }

  const preparationCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION,

    preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARED" as const,

    sourceInquiryTwoReviewDecisionId:
      source.decisionId,

    sourceInquiryTwoReviewDecisionDigest:
      source.decisionDigest,

    sourceInquiryTwoExecutionId:
      source.limitedInternalPilotInquiryTwoExecutionId,

    sourceInquiryTwoExecutionDigest:
      source.limitedInternalPilotInquiryTwoExecutionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    inquiryTwoPreparationId:
      source.preparationId,

    inquiryTwoPreparationDigest:
      source.preparationDigest,

    sourceInquiryOneReviewDecisionId:
      source.sourceInquiryReviewDecisionId,

    sourceInquiryOneReviewDecisionDigest:
      source.sourceInquiryReviewDecisionDigest,

    sourceInquiryOneExecutionId:
      source.sourceInquiryExecutionId,

    sourceInquiryOneExecutionDigest:
      source.sourceInquiryExecutionDigest,

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
        "SAFE_CUSTOMER_CONTEXT_CONTINUITY" as const,

      inquirySequence:
        3 as const,

      priorReviewedInquirySequence:
        2 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacityBeforeExecution:
        1 as const,

      projectedRemainingInquiryCapacityAfterExecution:
        0 as const,

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

    customerContextContinuityExpectation: {
      customerContextContinuityRequired:
        true as const,

      repeatedQuestionAvoidanceRequired:
        true as const,

      clarificationBeforeGuessingRequired:
        true as const,

      promiseAndFollowUpTrackingRequired:
        true as const,

      uncertaintyEscalatesToOwner:
        true as const,

      tenantScopedContextOnly:
        true as const,

      customerScopedContextOnly:
        true as const,

      crossTenantContextReuseAuthorized:
        false as const,

      crossCustomerContextReuseAuthorized:
        false as const,

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
      sourceInquiryTwoReviewDecisionBound:
        true as const,

      sourceInquiryTwoReviewDecisionIntegrityVerified:
        true as const,

      sourceInquiryTwoExecutionBound:
        true as const,

      sourceInquiryTwoPreparationBound:
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

      inquiryTwoOwnerReviewApproved:
        true as const,

      inquiryThreePreparationAuthorized:
        true as const,

      inquiryThreePrepared:
        true as const,

      inquiryThreeExecutionAuthorized:
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

      ownerReviewAfterInquiryThreeRequired:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION" as const,

    preparedAt,
  };

  const preparation:
    AshaLimitedInternalPilotInquiryThreePreparation = {
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    };

  return deepFreeze(
    preparation,
  ) as AshaLimitedInternalPilotInquiryThreePreparation;
}
