import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationExecution,
  type RiyaLimitedInternalPilotRecommendationExecution,
} from "./riyaLimitedInternalPilotRecommendationExecution";

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION =
  "nexus-riya-owner-limited-internal-pilot-recommendation-review-decision-v1" as const;

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISIONS = [
  "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION",
  "REJECT_AND_RETAIN_RECOMMENDATION_ONE_ONLY",
] as const;

export type RiyaOwnerLimitedInternalPilotRecommendationReviewDecisionType =
  (
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISIONS
  )[number];

export interface CreateRiyaOwnerLimitedInternalPilotRecommendationReviewDecisionInput {
  readonly limitedInternalPilotRecommendationExecution:
    RiyaLimitedInternalPilotRecommendationExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface RiyaOwnerLimitedInternalPilotRecommendationReviewDecision {
  readonly version:
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_RECORDED";

  readonly employeeId:
    "employee-riya-recommendation-specialist-v1";

  readonly templateId:
    "template-riya-recommendation-specialist-v1";

  readonly employeeCode:
    "nx-sales-004";

  readonly displayName:
    "Riya";

  readonly role:
    "AI Recommendation Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly limitedInternalPilotRecommendationExecutionId:
    string;

  readonly limitedInternalPilotRecommendationExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationReviewDecisionType;

  readonly nextRecommendationPreparationApproved:
    boolean;

  readonly recommendationTwoExecutionAuthorized:
    false;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "EVIDENCE_GROUNDED_RECOMMENDATION";

    reviewedRecommendationSequence:
      1;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacity:
      2;

    ownerReviewFrequency:
      "AFTER_EVERY_RECOMMENDATION";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    customerContextToolMode:
      "READ_ONLY";

    recommendationToolId:
      "tool-recommendation-draft";

    recommendationToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    unsupportedFactsInvented:
      false;

    crossCustomerContextUsed:
      false;

    crossTenantContextUsed:
      false;

    ownerDecisionMade:
      false;

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    sourceExecutionIntegrityVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    ownerReviewDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    recommendationOneReviewed:
      true;

    nextRecommendationPreparationAuthorized:
      boolean;

    recommendationTwoPreparationPerformed:
      false;

    recommendationTwoExecutionAuthorized:
      false;

    recommendationTwoExecutionPerformed:
      false;

    concurrentRecommendationExecutionAuthorized:
      false;

    limitedInternalPilotCompleted:
      false;

    recommendationCustomerDeliveryAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
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

    ownerReviewAfterEveryRecommendation:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO"
    | "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_ONE_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

type UnknownRecord =
  Record<string, unknown>;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /\b(secret|password|authorization|bearer|access[_ -]?token|api[_ -]?key|private[_ -]?key|session[_ -]?cookie)\b/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const EXPECTED_EMPLOYEE_ID =
  "employee-riya-recommendation-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-riya-recommendation-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-004" as const;

const EXPECTED_DISPLAY_NAME =
  "Riya" as const;

const EXPECTED_ROLE =
  "AI Recommendation Specialist" as const;

const EXPECTED_DEPARTMENT =
  "SALES" as const;

const EXPECTED_AUTONOMY_LEVEL =
  "DRAFTING_ASSISTANT" as const;

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
            stableStringify(
              record[key],
            ),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Riya recommendation review value.",
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
            UnknownRecord
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
): asserts value is string {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  if (FORBIDDEN_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} contains prohibited credential-bearing content.`,
    );
  }
}

function requireDigest(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireIsoTimestamp(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !Number.isFinite(
      Date.parse(value),
    ) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 20 ||
    value.length > 500 ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error(
      "Riya owner recommendation review reason must be a clear bounded statement.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Riya owner recommendation review reason contains prohibited secret-bearing content.",
    );
  }

  return value;
}

function verifyDigestBoundObject(
  label: string,
  value: unknown,
  digestField: string,
): void {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error(
      `${label} must be an object.`,
    );
  }

  const record = {
    ...(
      value as UnknownRecord
    ),
  };

  const digest =
    record[digestField];

  requireDigest(
    `${label} digest`,
    digest,
  );

  delete record[digestField];

  if (
    digest !==
    sha256(record)
  ) {
    throw new Error(
      `${label} integrity verification failed.`,
    );
  }
}

function validateSourceExecution(
  source:
    RiyaLimitedInternalPilotRecommendationExecution,
): void {
  validateRiyaLimitedInternalPilotRecommendationExecution(
    source,
  );

  if (
    source.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 62 Riya pilot recommendation execution is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 62 Riya pilot recommendation execution",
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
    source.role !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Workforce Day 62 Riya identity is invalid.",
    );
  }

  const pilot =
    source.pilotRecommendation;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "EVIDENCE_GROUNDED_RECOMMENDATION" ||
    pilot.recommendationSequence !==
      1 ||
    pilot.maximumRecommendationCount !==
      3 ||
    pilot.remainingRecommendationCapacity !==
      2 ||
    pilot.concurrentRecommendationLimit !==
      1 ||
    pilot.failureThreshold !==
      1 ||
    pilot.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    pilot.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    pilot.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    pilot.customerContextToolMode !==
      "READ_ONLY" ||
    pilot.recommendationToolMode !==
      "DRAFT_ONLY" ||
    pilot.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Workforce Day 62 Riya pilot scope is invalid.",
    );
  }

  const inquiryEvidence =
    source.syntheticInquiryEvidence;

  const customerContext =
    source.syntheticCustomerContext;

  const draft =
    source.recommendationDraft;

  if (
    inquiryEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    inquiryEvidence.unsupportedFactsInvented !==
      false ||
    customerContext.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    customerContext.approvedTenantContextOnly !==
      true ||
    customerContext.crossCustomerContextUsed !==
      false ||
    customerContext.crossTenantContextUsed !==
      false ||
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.toolId !==
      "tool-recommendation-draft" ||
    draft.toolMode !==
      "DRAFT_ONLY" ||
    draft.ownerDecisionMade !==
      false ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.urgencyExaggerated !==
      false ||
    draft.guaranteeMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Workforce Day 62 Riya reviewed evidence is invalid.",
    );
  }

  const boundary =
    source.executionBoundary;

  if (
    boundary.ownerExecutionApprovalBound !==
      true ||
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourceControlledShadowExecutionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.recommendationSequenceEnforced !==
      true ||
    boundary.maximumRecommendationCountPreserved !==
      true ||
    boundary.concurrentRecommendationLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.recommendationCreatorInvocationCount !==
      1 ||
    boundary.limitedInternalPilotExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticRecommendationExecutionPerformed !==
      true ||
    boundary.ownerDecisionMade !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.recommendationCustomerDeliveryAuthorized !==
      false ||
    boundary.customerDeliveryPrepared !==
      false ||
    boundary.customerDeliveryExecuted !==
      false ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
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
    boundary.ownerReviewAfterEveryRecommendation !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Workforce Day 62 Riya authority boundary is invalid.",
    );
  }
}

export function validateRiyaOwnerLimitedInternalPilotRecommendationReviewDecision(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationReviewDecision,
): void {
  requireSafeIdentifier(
    "Riya recommendation review decision identity",
    decision.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation execution identity",
    decision.limitedInternalPilotRecommendationExecutionId,
  );

  requireSafeIdentifier(
    "Riya owner execution decision identity",
    decision.ownerExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Riya pilot preparation identity",
    decision.preparationId,
  );

  requireSafeIdentifier(
    "Riya controlled shadow execution identity",
    decision.controlledShadowExecutionId,
  );

  requireSafeIdentifier(
    "Riya tenant identity",
    decision.tenantId,
  );

  requireSafeIdentifier(
    "Riya owner identity",
    decision.ownerId,
  );

  requireDigest(
    "Riya recommendation execution digest",
    decision.limitedInternalPilotRecommendationExecutionDigest,
  );

  requireDigest(
    "Riya owner execution decision digest",
    decision.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Riya pilot preparation digest",
    decision.preparationDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    decision.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya recommendation review decision time",
    decision.decidedAt,
  );

  requireReason(
    decision.reason,
  );

  verifyDigestBoundObject(
    "Riya owner recommendation review decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_RECORDED" ||
    decision.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    decision.templateId !==
      EXPECTED_TEMPLATE_ID ||
    decision.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    decision.displayName !==
      EXPECTED_DISPLAY_NAME ||
    decision.role !==
      EXPECTED_ROLE ||
    decision.department !==
      EXPECTED_DEPARTMENT ||
    decision.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Riya recommendation review decision identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATION_ONE_ONLY"
  ) {
    throw new Error(
      "Riya owner recommendation review decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION";

  if (
    decision.nextRecommendationPreparationApproved !==
      approved ||
    decision.recommendationTwoExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Riya recommendation continuation authority is invalid.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "EVIDENCE_GROUNDED_RECOMMENDATION" ||
    evidence.reviewedRecommendationSequence !==
      1 ||
    evidence.maximumRecommendationCount !==
      3 ||
    evidence.remainingRecommendationCapacity !==
      2 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.customerContextToolMode !==
      "READ_ONLY" ||
    evidence.recommendationToolId !==
      "tool-recommendation-draft" ||
    evidence.recommendationToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.crossCustomerContextUsed !==
      false ||
    evidence.crossTenantContextUsed !==
      false ||
    evidence.ownerDecisionMade !==
      false ||
    evidence.unsupportedClaimsIncluded !==
      false ||
    evidence.urgencyExaggerated !==
      false ||
    evidence.guaranteeMade !==
      false ||
    evidence.customerDeliveryPrepared !==
      false ||
    evidence.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Riya recommendation reviewed evidence is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.sourceExecutionIntegrityVerified !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerReviewDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.recommendationOneReviewed !==
      true ||
    boundary.nextRecommendationPreparationAuthorized !==
      approved ||
    boundary.recommendationTwoPreparationPerformed !==
      false ||
    boundary.recommendationTwoExecutionAuthorized !==
      false ||
    boundary.recommendationTwoExecutionPerformed !==
      false ||
    boundary.concurrentRecommendationExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.recommendationCustomerDeliveryAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
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
    boundary.ownerReviewAfterEveryRecommendation !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Riya recommendation review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO"
      : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_ONE_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Riya recommendation review next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation review decision must be deeply frozen.",
    );
  }
}

export function createRiyaOwnerLimitedInternalPilotRecommendationReviewDecision(
  input:
    CreateRiyaOwnerLimitedInternalPilotRecommendationReviewDecisionInput,
): RiyaOwnerLimitedInternalPilotRecommendationReviewDecision {
  const source =
    input.limitedInternalPilotRecommendationExecution;

  validateSourceExecution(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation review owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Riya recommendation review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Riya limited-internal-pilot-bound owner can issue the recommendation review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION" &&
    input.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATION_ONE_ONLY"
  ) {
    throw new Error(
      "Riya owner recommendation review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Riya recommendation review decision cannot precede recommendation execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION";

  const decisionCore = {
    version:
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_RECORDED" as const,

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

    limitedInternalPilotRecommendationExecutionId:
      source.executionId,

    limitedInternalPilotRecommendationExecutionDigest:
      source.executionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    controlledShadowExecutionId:
      source.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      source.controlledShadowExecutionDigest,

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    nextRecommendationPreparationApproved:
      approved,

    recommendationTwoExecutionAuthorized:
      false as const,

    reason,

    reviewedEvidence: {
      pilotClass:
        source.pilotRecommendation.pilotClass,

      scenarioId:
        source.pilotRecommendation.scenarioId,

      reviewedRecommendationSequence:
        source.pilotRecommendation.recommendationSequence,

      maximumRecommendationCount:
        source.pilotRecommendation.maximumRecommendationCount,

      remainingRecommendationCapacity:
        source.pilotRecommendation.remainingRecommendationCapacity,

      ownerReviewFrequency:
        source.pilotRecommendation.ownerReviewFrequency,

      dataClassification:
        source.pilotRecommendation.dataClassification,

      inquiryEvidenceToolMode:
        source.pilotRecommendation.inquiryEvidenceToolMode,

      customerContextToolMode:
        source.pilotRecommendation.customerContextToolMode,

      recommendationToolId:
        source.recommendationDraft.toolId,

      recommendationToolMode:
        source.recommendationDraft.toolMode,

      executionMode:
        source.pilotRecommendation.executionMode,

      recommendationStatus:
        source.recommendationDraft.recommendationStatus,

      unsupportedFactsInvented:
        source.syntheticInquiryEvidence.unsupportedFactsInvented,

      crossCustomerContextUsed:
        source.syntheticCustomerContext.crossCustomerContextUsed,

      crossTenantContextUsed:
        source.syntheticCustomerContext.crossTenantContextUsed,

      ownerDecisionMade:
        source.recommendationDraft.ownerDecisionMade,

      unsupportedClaimsIncluded:
        source.recommendationDraft.unsupportedClaimsIncluded,

      urgencyExaggerated:
        source.recommendationDraft.urgencyExaggerated,

      guaranteeMade:
        source.recommendationDraft.guaranteeMade,

      customerDeliveryPrepared:
        source.recommendationDraft.customerDeliveryPrepared,

      customerDeliveryExecuted:
        source.recommendationDraft.customerDeliveryExecuted,
    },

    authorityBoundary: {
      sourceExecutionIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      ownerReviewDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      recommendationOneReviewed:
        true as const,

      nextRecommendationPreparationAuthorized:
        approved,

      recommendationTwoPreparationPerformed:
        false as const,

      recommendationTwoExecutionAuthorized:
        false as const,

      recommendationTwoExecutionPerformed:
        false as const,

      concurrentRecommendationExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
        false as const,

      recommendationCustomerDeliveryAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
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

      ownerReviewAfterEveryRecommendation:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_ONE_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as RiyaOwnerLimitedInternalPilotRecommendationReviewDecision;

  validateRiyaOwnerLimitedInternalPilotRecommendationReviewDecision(
    decision,
  );

  return decision;
}