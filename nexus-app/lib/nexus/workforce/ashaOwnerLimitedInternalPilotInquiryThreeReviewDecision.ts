import {
  createHash,
} from "node:crypto";

import {
  ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_VERSION,
  type AshaLimitedInternalPilotInquiryThreeExecution,
} from "./ashaLimitedInternalPilotInquiryThreeExecution";

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_DECISION_VERSION =
  "nexus-asha-owner-limited-internal-pilot-inquiry-three-review-decision-v1" as const;

export const ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",
  "REJECT_AND_RETAIN_INQUIRY_THREE_ONLY",
] as const;

export type AshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionType =
  (
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_DECISIONS
  )[number];

export interface CreateAshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionInput {
  readonly limitedInternalPilotInquiryThreeExecution:
    AshaLimitedInternalPilotInquiryThreeExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision {
  readonly version:
    typeof ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_RECORDED";

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

  readonly limitedInternalPilotInquiryThreeExecutionId:
    string;

  readonly limitedInternalPilotInquiryThreeExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly inquiryThreePreparationId:
    string;

  readonly inquiryThreePreparationDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionType;

  readonly limitedInternalPilotCompleted:
    boolean;

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
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY";

    reviewedInquirySequence:
      3;

    maximumInquiryCount:
      3;

    remainingInquiryCapacity:
      0;

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
    limitedInternalPilotInquiryThreeExecutionBound:
      true;

    limitedInternalPilotInquiryThreeExecutionIntegrityVerified:
      true;

    controlledInquiryReceiptIntegrityVerified:
      true;

    ownerExecutionDecisionBound:
      true;

    inquiryThreePreparationBound:
      true;

    ownerIdentityBound:
      true;

    tenantIdentityBound:
      true;

    runtimeIdentityBound:
      true;

    qualifiedManifestBound:
      true;

    inquiryThreeReviewed:
      true;

    finalInquirySequenceReached:
      true;

    remainingInquiryCapacityExhausted:
      true;

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    limitedInternalPilotCompleted:
      boolean;

    furtherInquiryPreparationAuthorized:
      false;

    furtherInquiryExecutionAuthorized:
      false;

    concurrentInquiryExecutionAuthorized:
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

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "LIMITED_INTERNAL_PILOT_COMPLETE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_ONLY";

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

const SECRET_PATTERN =
  /(password|passwd|secret|api[-_ ]?key|access[-_ ]?token|refresh[-_ ]?token|bearer\s+|private[-_ ]?key|client[-_ ]?secret|sk-[a-z0-9_-]{8,})/i;

function canonicalize(
  value:
    unknown,
): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(
      value,
    );
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return `[${value
      .map((item) =>
        canonicalize(
          item,
        ))
      .join(",")}]`;
  }

  if (
    typeof value === "object"
  ) {
    const record =
      value as Record<
        string,
        unknown
      >;

    return `{${Object.keys(
      record,
    )
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(
            key,
          )}:${canonicalize(
            record[key],
          )}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Unsupported deterministic inquiry three review value.",
  );
}

function sha256(
  value:
    unknown,
): string {
  return createHash(
    "sha256",
  )
    .update(
      canonicalize(
        value,
      ),
    )
    .digest(
      "hex",
    );
}

function deepFreeze<T>(
  value:
    T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(
      value,
    )
  ) {
    Object.freeze(
      value,
    );

    for (
      const nestedValue of Object.values(
        value as Record<
          string,
          unknown
        >,
      )
    ) {
      deepFreeze(
        nestedValue,
      );
    }
  }

  return value;
}

function requireSafeIdentifier(
  label:
    string,
  value:
    string,
): string {
  const normalized =
    typeof value === "string"
      ? value.trim()
      : "";

  if (
    normalized.length < 3 ||
    normalized.length > 200 ||
    !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(
      normalized,
    ) ||
    SECRET_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      `${label} must be a safe non-secret identifier.`,
    );
  }

  return normalized;
}

function requireDigest(
  label:
    string,
  value:
    string,
): string {
  if (
    typeof value !== "string" ||
    !/^[a-f0-9]{64}$/.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }

  return value;
}

function requireIsoTimestamp(
  label:
    string,
  value:
    string,
): string {
  if (
    typeof value !== "string" ||
    Number.isNaN(
      Date.parse(
        value,
      ),
    ) ||
    new Date(
      value,
    ).toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }

  return value;
}

function requireReason(
  value:
    string,
): string {
  const normalized =
    typeof value === "string"
      ? value.trim()
      : "";

  if (
    normalized.length < 12 ||
    normalized.length > 1000 ||
    SECRET_PATTERN.test(
      normalized,
    )
  ) {
    throw new Error(
      "Inquiry three review reason must be safe, explicit, and non-secret.",
    );
  }

  return normalized;
}

function requireDecision(
  value:
    string,
): AshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionType {
  if (
    !ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_DECISIONS.includes(
      value as AshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionType,
    )
  ) {
    throw new Error(
      "Asha owner inquiry three review decision is invalid.",
    );
  }

  return value as AshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionType;
}

function validateInquiryThreeExecution(
  source:
    AshaLimitedInternalPilotInquiryThreeExecution,
): void {
  if (
    !source ||
    source.version !==
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_INQUIRY_THREE_EXECUTED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 36 inquiry three execution is required.",
    );
  }

  requireSafeIdentifier(
    "Inquiry three execution identity",
    source.executionId,
  );

  requireSafeIdentifier(
    "Inquiry three owner execution decision identity",
    source.ownerExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Inquiry three preparation identity",
    source.inquiryThreePreparationId,
  );

  requireSafeIdentifier(
    "Inquiry three tenant identity",
    source.tenantId,
  );

  requireSafeIdentifier(
    "Inquiry three owner identity",
    source.ownerId,
  );

  requireDigest(
    "Inquiry three execution digest",
    source.executionDigest,
  );

  requireDigest(
    "Inquiry three owner execution decision digest",
    source.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Inquiry three preparation digest",
    source.inquiryThreePreparationDigest,
  );

  requireIsoTimestamp(
    "Inquiry three execution time",
    source.executedAt,
  );

  const {
    executionDigest,
    ...executionCore
  } = source;

  if (
    executionDigest !==
    sha256(
      executionCore,
    )
  ) {
    throw new Error(
      "Asha inquiry three execution integrity is invalid.",
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
      "Asha inquiry three workforce identity is invalid.",
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
      "SAFE_CUSTOMER_CONTEXT_CONTINUITY" ||
    inquiry.inquirySequence !==
      3 ||
    inquiry.priorReviewedInquirySequence !==
      2 ||
    inquiry.maximumInquiryCount !==
      3 ||
    inquiry.remainingInquiryCapacity !==
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
      "Inquiry three final pilot scope evidence is invalid.",
    );
  }

  const continuity =
    source.customerContextContinuityExpectation;

  if (
    continuity.customerContextContinuityRequired !== true ||
    continuity.repeatedQuestionAvoidanceRequired !== true ||
    continuity.clarificationBeforeGuessingRequired !== true ||
    continuity.promiseAndFollowUpTrackingRequired !== true ||
    continuity.uncertaintyEscalatesToOwner !== true ||
    continuity.tenantScopedContextOnly !== true ||
    continuity.customerScopedContextOnly !== true ||
    continuity.crossTenantContextReuseAuthorized !== false ||
    continuity.crossCustomerContextReuseAuthorized !== false ||
    continuity.responseGenerationPerformed !== false ||
    continuity.humanImpersonationAuthorized !== false
  ) {
    throw new Error(
      "Inquiry three customer context continuity evidence is invalid.",
    );
  }

  const synthetic =
    source.syntheticInquiryEvidence;

  if (
    synthetic.idempotencyKey !==
      "asha-limited-internal-pilot-inquiry-003" ||
    synthetic.channel !==
      "WEB" ||
    synthetic.customerName !==
      "Synthetic Pilot Customer Three" ||
    synthetic.customerEmail !==
      "synthetic.pilot.three@example.invalid" ||
    synthetic.customerPhone !==
      null ||
    synthetic.message !==
      "I previously asked about certified safety helmets for our workshop. Please continue from that confirmed context without asking me to repeat known details, and clearly identify anything still missing before drafting a response." ||
    synthetic.resultOutcome !==
      "CREATED" ||
    synthetic.inquiryId !==
      "inquiry-asha-limited-internal-pilot-003" ||
    synthetic.inquiryStatus !==
      "NEW" ||
    synthetic.createdAt !==
      source.executedAt
  ) {
    throw new Error(
      "Inquiry three synthetic evidence is invalid.",
    );
  }

  if (
    !source.controlledInquiryReceipt ||
    typeof source.controlledInquiryReceipt !==
      "object"
  ) {
    throw new Error(
      "Inquiry three controlled intake receipt is invalid.",
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
    boundary.inquiryThreeExecutionDecisionBound !== true ||
    boundary.inquiryThreeExecutionPerformed !== true ||
    boundary.finalInquirySequenceReached !== true ||
    boundary.remainingInquiryCapacityExhausted !== true ||
    boundary.ownerReviewAfterInquiryThreeRequired !== true ||
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
      "Inquiry three execution authority boundary is invalid.",
    );
  }
}

export function createAshaOwnerLimitedInternalPilotInquiryThreeReviewDecision(
  input:
    CreateAshaOwnerLimitedInternalPilotInquiryThreeReviewDecisionInput,
): AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision {
  const source =
    input.limitedInternalPilotInquiryThreeExecution;

  validateInquiryThreeExecution(
    source,
  );

  const decisionId =
    requireSafeIdentifier(
      "Inquiry three review decision identity",
      input.decisionId,
    );

  const ownerId =
    requireSafeIdentifier(
      "Inquiry three review owner identity",
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
      "Inquiry three review decision time",
      input.decidedAt,
    );

  if (
    ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Only the inquiry-three-bound owner can issue its final review decision.",
    );
  }

  if (
    Date.parse(
      decidedAt,
    ) <
    Date.parse(
      source.executedAt,
    )
  ) {
    throw new Error(
      "Inquiry three review decision cannot precede inquiry three execution.",
    );
  }

  const approved =
    decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  const decisionCore = {
    version:
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_REVIEW_RECORDED" as const,

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

    limitedInternalPilotInquiryThreeExecutionId:
      source.executionId,

    limitedInternalPilotInquiryThreeExecutionDigest:
      source.executionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    inquiryThreePreparationId:
      source.inquiryThreePreparationId,

    inquiryThreePreparationDigest:
      source.inquiryThreePreparationDigest,

    tenantId:
      source.tenantId,

    ownerId,

    decision,

    limitedInternalPilotCompleted:
      approved,

    reason,

    reviewedEvidence: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        "SAFE_CUSTOMER_CONTEXT_CONTINUITY" as const,

      reviewedInquirySequence:
        3 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        0 as const,

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

    authorityBoundary: {
      limitedInternalPilotInquiryThreeExecutionBound:
        true as const,

      limitedInternalPilotInquiryThreeExecutionIntegrityVerified:
        true as const,

      controlledInquiryReceiptIntegrityVerified:
        true as const,

      ownerExecutionDecisionBound:
        true as const,

      inquiryThreePreparationBound:
        true as const,

      ownerIdentityBound:
        true as const,

      tenantIdentityBound:
        true as const,

      runtimeIdentityBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      inquiryThreeReviewed:
        true as const,

      finalInquirySequenceReached:
        true as const,

      remainingInquiryCapacityExhausted:
        true as const,

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      limitedInternalPilotCompleted:
        approved,

      furtherInquiryPreparationAuthorized:
        false as const,

      furtherInquiryExecutionAuthorized:
        false as const,

      concurrentInquiryExecutionAuthorized:
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

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "LIMITED_INTERNAL_PILOT_COMPLETE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_INQUIRY_THREE_ONLY" as const,

    decidedAt,
  };

  const result:
    AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision = {
      ...decisionCore,

      decisionDigest:
        sha256(
          decisionCore,
        ),
    };

  return deepFreeze(
    result,
  ) as AshaOwnerLimitedInternalPilotInquiryThreeReviewDecision;
}