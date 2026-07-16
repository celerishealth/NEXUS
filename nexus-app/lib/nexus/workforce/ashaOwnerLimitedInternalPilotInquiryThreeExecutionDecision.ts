import { createHash } from "node:crypto";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION,
  type AshaLimitedInternalPilotInquiryThreePreparation,
} from "./ashaLimitedInternalPilotInquiryThreePreparation";

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION =
  "nexus-asha-owner-limited-internal-pilot-inquiry-three-execution-decision-v1" as const;

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION",
  "REJECT_AND_RETAIN_INQUIRY_THREE_PREPARATION_ONLY",
] as const;

export type AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionType =
  (
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISIONS
  )[number];

export interface CreateAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionInput {
  readonly limitedInternalPilotInquiryThreePreparation:
    AshaLimitedInternalPilotInquiryThreePreparation;

  readonly decisionId: string;
  readonly ownerId: string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionType;

  readonly reason: string;
  readonly decidedAt: string;
}

export interface AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision {
  readonly version:
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_RECORDED";

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

  readonly inquiryThreePreparationId: string;
  readonly inquiryThreePreparationDigest: string;

  readonly sourceInquiryTwoReviewDecisionId: string;
  readonly sourceInquiryTwoReviewDecisionDigest: string;

  readonly sourceInquiryTwoExecutionId: string;
  readonly sourceInquiryTwoExecutionDigest: string;

  readonly ownerInquiryTwoExecutionDecisionId: string;
  readonly ownerInquiryTwoExecutionDecisionDigest: string;

  readonly inquiryTwoPreparationId: string;
  readonly inquiryTwoPreparationDigest: string;

  readonly sourceInquiryOneReviewDecisionId: string;
  readonly sourceInquiryOneReviewDecisionDigest: string;

  readonly sourceInquiryOneExecutionId: string;
  readonly sourceInquiryOneExecutionDigest: string;

  readonly runtimeIssuanceId: string;
  readonly runtimeIssuanceDigest: string;

  readonly runtimeId: string;
  readonly runtimeDigest: string;

  readonly qualifiedManifestDigest: string;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionType;

  readonly executionApproved: boolean;

  readonly inquiryThreeExecutionAuthorized: boolean;

  readonly reason: string;

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

  readonly authorityBoundary: Readonly<{
    inquiryThreePreparationBound:
      true;

    inquiryThreePreparationIntegrityVerified:
      true;

    sourceInquiryTwoReviewDecisionBound:
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

    inquiryThreePrepared:
      true;

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    inquiryThreeExecutionAuthorized:
      boolean;

    inquiryThreeExecutionPerformed:
      false;

    syntheticInquiryExecutionPerformed:
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
    | "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_ONLY";

  readonly decidedAt: string;

  readonly decisionDigest: string;
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
    return (
      "{" +
      Object.entries(
        value as Record<string, unknown>,
      )
        .sort(
          ([left], [right]) =>
            left.localeCompare(right),
        )
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

function requireDecision(
  value: string,
): AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionType {
  if (
    value !==
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION" &&
    value !==
      "REJECT_AND_RETAIN_INQUIRY_THREE_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Inquiry three execution decision is invalid.",
    );
  }

  return value;
}

function requireReason(
  value: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length < 10 ||
    normalized.length > 1000 ||
    FORBIDDEN_REASON_PATTERN.test(normalized)
  ) {
    throw new Error(
      "Inquiry three execution decision reason is invalid or secret-bearing.",
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

function validateInquiryThreePreparation(
  source:
    AshaLimitedInternalPilotInquiryThreePreparation,
): void {
  if (
    source.version !==
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 34 inquiry three preparation is required.",
    );
  }

  for (
    const [label, value] of [
      [
        "Inquiry three preparation identity",
        source.preparationId,
      ],
      [
        "Inquiry two review decision identity",
        source.sourceInquiryTwoReviewDecisionId,
      ],
      [
        "Inquiry two execution identity",
        source.sourceInquiryTwoExecutionId,
      ],
      [
        "Owner inquiry two execution decision identity",
        source.ownerExecutionDecisionId,
      ],
      [
        "Inquiry two preparation identity",
        source.inquiryTwoPreparationId,
      ],
      [
        "Inquiry one review decision identity",
        source.sourceInquiryOneReviewDecisionId,
      ],
      [
        "Inquiry one execution identity",
        source.sourceInquiryOneExecutionId,
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
        "Inquiry three preparation digest",
        source.preparationDigest,
      ],
      [
        "Inquiry two review decision digest",
        source.sourceInquiryTwoReviewDecisionDigest,
      ],
      [
        "Inquiry two execution digest",
        source.sourceInquiryTwoExecutionDigest,
      ],
      [
        "Owner inquiry two execution decision digest",
        source.ownerExecutionDecisionDigest,
      ],
      [
        "Inquiry two preparation digest",
        source.inquiryTwoPreparationDigest,
      ],
      [
        "Inquiry one review decision digest",
        source.sourceInquiryOneReviewDecisionDigest,
      ],
      [
        "Inquiry one execution digest",
        source.sourceInquiryOneExecutionDigest,
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
    "Inquiry three preparation time",
    source.preparedAt,
  );

  verifyDigestBoundObject(
    "Workforce Day 34 inquiry three preparation",
    source as unknown as Record<string, unknown>,
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
      "Asha inquiry-three preparation identity has changed.",
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
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY" ||
    inquiry.inquirySequence !==
      3 ||
    inquiry.priorReviewedInquirySequence !==
      2 ||
    inquiry.maximumInquiryCount !==
      3 ||
    inquiry.remainingInquiryCapacityBeforeExecution !==
      1 ||
    inquiry.projectedRemainingInquiryCapacityAfterExecution !==
      0 ||
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
      "Inquiry three preparation scope is invalid.",
    );
  }

  const expectation =
    source.customerContextContinuityExpectation;

  if (
    expectation.customerContextContinuityRequired !== true ||
    expectation.repeatedQuestionAvoidanceRequired !== true ||
    expectation.clarificationBeforeGuessingRequired !== true ||
    expectation.promiseAndFollowUpTrackingRequired !== true ||
    expectation.uncertaintyEscalatesToOwner !== true ||
    expectation.tenantScopedContextOnly !== true ||
    expectation.customerScopedContextOnly !== true ||
    expectation.crossTenantContextReuseAuthorized !== false ||
    expectation.crossCustomerContextReuseAuthorized !== false ||
    expectation.responseGenerationPerformed !== false ||
    expectation.humanImpersonationAuthorized !== false
  ) {
    throw new Error(
      "Inquiry three customer-context continuity expectation is invalid.",
    );
  }

  const bridge =
    source.existingPilotArchitectureBridge;

  if (
    bridge.duplicatePilotEngineCreated !== false ||
    bridge.enrollmentModule !==
      "lib/nexus/pilot/authenticatedControlledPilotEnrollment" ||
    bridge.enrollmentFunction !==
      "enrollAuthenticatedControlledPilot" ||
    bridge.accessModule !==
      "lib/nexus/pilot/authenticatedControlledPilotAccess" ||
    bridge.accessFunction !==
      "enforceAuthenticatedControlledPilotAccess" ||
    bridge.controlModule !==
      "lib/nexus/pilot/authenticatedControlledPilotControl" ||
    bridge.controlFunction !==
      "controlAuthenticatedPilot" ||
    bridge.healthModule !==
      "lib/nexus/pilot/authenticatedControlledPilotHealth" ||
    bridge.healthFunction !==
      "observeAuthenticatedControlledPilotHealth" ||
    bridge.operationAdmissionModule !==
      "lib/nexus/pilot/authenticatedControlledPilotOperationAdmission" ||
    bridge.operationAdmissionFunction !==
      "admitAuthenticatedPilotOperation" ||
    bridge.enrollmentInvoked !== false ||
    bridge.accessGranted !== false ||
    bridge.pilotControlInvoked !== false ||
    bridge.healthObservationInvoked !== false ||
    bridge.operationAdmissionClaimed !== false
  ) {
    throw new Error(
      "Inquiry three pilot architecture boundary is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourceInquiryTwoReviewDecisionBound !== true ||
    boundary.sourceInquiryTwoReviewDecisionIntegrityVerified !== true ||
    boundary.sourceInquiryTwoExecutionBound !== true ||
    boundary.sourceInquiryTwoPreparationBound !== true ||
    boundary.sourceInquiryOneReviewDecisionBound !== true ||
    boundary.sourceInquiryOneExecutionBound !== true ||
    boundary.ownerIdentityBound !== true ||
    boundary.tenantIdentityBound !== true ||
    boundary.runtimeIdentityBound !== true ||
    boundary.qualifiedManifestBound !== true ||
    boundary.inquiryTwoOwnerReviewApproved !== true ||
    boundary.inquiryThreePreparationAuthorized !== true ||
    boundary.inquiryThreePrepared !== true ||
    boundary.inquiryThreeExecutionAuthorized !== false ||
    boundary.concurrentInquiryExecutionAuthorized !== false ||
    boundary.limitedInternalPilotCompleted !== false ||
    boundary.syntheticInquiryCreated !== false ||
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
      "Inquiry three preparation authority boundary is invalid.",
    );
  }
}

export function createAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision(
  input:
    CreateAshaOwnerLimitedInternalPilotInquiryThreeExecutionDecisionInput,
): AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision {
  const source =
    input.limitedInternalPilotInquiryThreePreparation;

  validateInquiryThreePreparation(
    source,
  );

  const decisionId =
    requireSafeIdentifier(
      "Inquiry three owner execution decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Inquiry three owner execution decision owner identity",
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
      "Inquiry three owner execution decision time",
      input.decidedAt,
    );

  if (
    ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Only the inquiry-three-bound owner can issue its execution decision.",
    );
  }

  if (
    Date.parse(decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Inquiry three execution decision cannot precede inquiry three preparation.",
    );
  }

  const approved =
    decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION";

  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_DECISION_RECORDED" as const,

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

    inquiryThreePreparationId:
      source.preparationId,

    inquiryThreePreparationDigest:
      source.preparationDigest,

    sourceInquiryTwoReviewDecisionId:
      source.sourceInquiryTwoReviewDecisionId,

    sourceInquiryTwoReviewDecisionDigest:
      source.sourceInquiryTwoReviewDecisionDigest,

    sourceInquiryTwoExecutionId:
      source.sourceInquiryTwoExecutionId,

    sourceInquiryTwoExecutionDigest:
      source.sourceInquiryTwoExecutionDigest,

    ownerInquiryTwoExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerInquiryTwoExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    inquiryTwoPreparationId:
      source.inquiryTwoPreparationId,

    inquiryTwoPreparationDigest:
      source.inquiryTwoPreparationDigest,

    sourceInquiryOneReviewDecisionId:
      source.sourceInquiryOneReviewDecisionId,

    sourceInquiryOneReviewDecisionDigest:
      source.sourceInquiryOneReviewDecisionDigest,

    sourceInquiryOneExecutionId:
      source.sourceInquiryOneExecutionId,

    sourceInquiryOneExecutionDigest:
      source.sourceInquiryOneExecutionDigest,

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

    executionApproved:
      approved,

    inquiryThreeExecutionAuthorized:
      approved,

    reason,

    preparedInquiry:
      source.preparedInquiry,

    customerContextContinuityExpectation:
      source.customerContextContinuityExpectation,

    authorityBoundary: {
      inquiryThreePreparationBound:
        true as const,

      inquiryThreePreparationIntegrityVerified:
        true as const,

      sourceInquiryTwoReviewDecisionBound:
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

      inquiryThreePrepared:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      inquiryThreeExecutionAuthorized:
        approved,

      inquiryThreeExecutionPerformed:
        false as const,

      syntheticInquiryExecutionPerformed:
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
        ? "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_THREE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_PREPARATION_ONLY" as const,

    decidedAt,
  };

  const result:
    AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision = {
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    result,
  ) as AshaOwnerLimitedInternalPilotInquiryThreeExecutionDecision;
}
