import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationTwoPreparation,
  type RiyaLimitedInternalPilotRecommendationTwoPreparation,
} from "./riyaLimitedInternalPilotRecommendationTwoPreparation";

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION =
  "nexus-riya-owner-limited-internal-pilot-recommendation-two-execution-decision-v1" as const;

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION",
  "REJECT_AND_RETAIN_RECOMMENDATION_TWO_PREPARATION_ONLY",
] as const;

export type RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecisionType =
  (
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISIONS
  )[number];

export interface CreateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecisionInput {
  readonly limitedInternalPilotRecommendationTwoPreparation:
    RiyaLimitedInternalPilotRecommendationTwoPreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision {
  readonly version:
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_RECORDED";

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

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly sourceRecommendationReviewDecisionId:
    string;

  readonly sourceRecommendationReviewDecisionDigest:
    string;

  readonly sourceRecommendationExecutionId:
    string;

  readonly sourceRecommendationExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly sourcePilotPreparationId:
    string;

  readonly sourcePilotPreparationDigest:
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
    RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecisionType;

  readonly recommendationTwoExecutionAuthorized:
    boolean;

  readonly recommendationTwoExecutionPerformed:
    false;

  readonly reason:
    string;

  readonly reviewedPreparation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "MISSING_FACT_CLARIFICATION";

    recommendationSequence:
      2;

    priorReviewedRecommendationSequence:
      1;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacityBeforeExecution:
      2;

    projectedRemainingRecommendationCapacityAfterExecution:
      1;

    concurrentRecommendationLimit:
      1;

    failureThreshold:
      1;

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

    clarificationBeforeGuessingRequired:
      true;

    missingFactsMustBeExplicit:
      true;

    verifiedFactsSeparatedFromAssumptions:
      true;

    uncertaintyPreserved:
      true;

    practicalClarifyingQuestionsRequired:
      true;

    recommendationGenerationPerformed:
      false;

    ownerDecisionMade:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    sourcePreparationBound:
      true;

    sourcePreparationIntegrityVerified:
      true;

    sourceRecommendationReviewDecisionBound:
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

    recommendationOneReviewed:
      true;

    recommendationTwoPreparationPerformed:
      true;

    recommendationTwoExecutionAuthorized:
      boolean;

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
    | "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO"
    | "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_ONLY";

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
      "Unsupported deterministic Riya recommendation two execution decision value.",
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
      "Riya recommendation two execution decision reason must be safe and specific.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Riya recommendation two execution decision reason contains prohibited secret-bearing content.",
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

function validateSourcePreparation(
  source:
    RiyaLimitedInternalPilotRecommendationTwoPreparation,
): void {
  validateRiyaLimitedInternalPilotRecommendationTwoPreparation(
    source,
  );

  if (
    source.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 64 Riya recommendation two preparation is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 64 Riya recommendation two preparation",
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
    source.role !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Workforce Day 64 Riya identity is invalid.",
    );
  }

  const prepared =
    source.preparedRecommendation;

  if (
    prepared.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    prepared.scenarioId !==
      "MISSING_FACT_CLARIFICATION" ||
    prepared.recommendationSequence !==
      2 ||
    prepared.priorReviewedRecommendationSequence !==
      1 ||
    prepared.maximumRecommendationCount !==
      3 ||
    prepared.remainingRecommendationCapacityBeforeExecution !==
      2 ||
    prepared.projectedRemainingRecommendationCapacityAfterExecution !==
      1 ||
    prepared.concurrentRecommendationLimit !==
      1 ||
    prepared.failureThreshold !==
      1 ||
    prepared.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    prepared.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    prepared.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    prepared.customerContextToolMode !==
      "READ_ONLY" ||
    prepared.recommendationToolId !==
      "tool-recommendation-draft" ||
    prepared.recommendationToolMode !==
      "DRAFT_ONLY" ||
    prepared.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Workforce Day 64 Riya prepared recommendation scope is invalid.",
    );
  }

  const expectation =
    source.specialistExpectation;

  if (
    expectation.clarificationBeforeGuessingRequired !==
      true ||
    expectation.missingFactsMustBeExplicit !==
      true ||
    expectation.verifiedFactsSeparatedFromAssumptions !==
      true ||
    expectation.uncertaintyPreserved !==
      true ||
    expectation.practicalClarifyingQuestionsRequired !==
      true ||
    expectation.unsupportedClaimsProhibited !==
      true ||
    expectation.urgencyExaggerationProhibited !==
      true ||
    expectation.guaranteeProhibited !==
      true ||
    expectation.crossCustomerContextProhibited !==
      true ||
    expectation.crossTenantContextProhibited !==
      true ||
    expectation.transparentAIIdentityRequired !==
      true ||
    expectation.recommendationGenerationPerformed !==
      false ||
    expectation.ownerDecisionMade !==
      false ||
    expectation.customerDeliveryPrepared !==
      false ||
    expectation.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Workforce Day 64 Riya specialist expectation is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourceRecommendationReviewDecisionBound !==
      true ||
    boundary.sourceRecommendationReviewDecisionIntegrityVerified !==
      true ||
    boundary.sourceRecommendationExecutionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.recommendationOneReviewed !==
      true ||
    boundary.nextRecommendationPreparationAuthorized !==
      true ||
    boundary.recommendationTwoPreparationPerformed !==
      true ||
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
      "Workforce Day 64 Riya preparation authority boundary is invalid.",
    );
  }
}

export function validateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision,
): void {
  requireSafeIdentifier(
    "Riya recommendation two execution decision identity",
    decision.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation two preparation identity",
    decision.preparationId,
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
    "Riya recommendation two preparation digest",
    decision.preparationDigest,
  );

  requireDigest(
    "Riya source recommendation review decision digest",
    decision.sourceRecommendationReviewDecisionDigest,
  );

  requireDigest(
    "Riya source recommendation execution digest",
    decision.sourceRecommendationExecutionDigest,
  );

  requireDigest(
    "Riya owner execution decision digest",
    decision.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Riya source pilot preparation digest",
    decision.sourcePilotPreparationDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    decision.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya recommendation two execution decision time",
    decision.decidedAt,
  );

  requireReason(
    decision.reason,
  );

  verifyDigestBoundObject(
    "Riya recommendation two execution decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_RECORDED" ||
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
      "Riya recommendation two execution decision identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATION_TWO_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Riya recommendation two execution decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION";

  if (
    decision.recommendationTwoExecutionAuthorized !==
      approved ||
    decision.recommendationTwoExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Riya recommendation two execution authority is invalid.",
    );
  }

  const reviewed =
    decision.reviewedPreparation;

  if (
    reviewed.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    reviewed.scenarioId !==
      "MISSING_FACT_CLARIFICATION" ||
    reviewed.recommendationSequence !==
      2 ||
    reviewed.priorReviewedRecommendationSequence !==
      1 ||
    reviewed.maximumRecommendationCount !==
      3 ||
    reviewed.remainingRecommendationCapacityBeforeExecution !==
      2 ||
    reviewed.projectedRemainingRecommendationCapacityAfterExecution !==
      1 ||
    reviewed.concurrentRecommendationLimit !==
      1 ||
    reviewed.failureThreshold !==
      1 ||
    reviewed.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    reviewed.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    reviewed.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    reviewed.customerContextToolMode !==
      "READ_ONLY" ||
    reviewed.recommendationToolId !==
      "tool-recommendation-draft" ||
    reviewed.recommendationToolMode !==
      "DRAFT_ONLY" ||
    reviewed.executionMode !==
      "SANDBOX_ONLY" ||
    reviewed.clarificationBeforeGuessingRequired !==
      true ||
    reviewed.missingFactsMustBeExplicit !==
      true ||
    reviewed.verifiedFactsSeparatedFromAssumptions !==
      true ||
    reviewed.uncertaintyPreserved !==
      true ||
    reviewed.practicalClarifyingQuestionsRequired !==
      true ||
    reviewed.recommendationGenerationPerformed !==
      false ||
    reviewed.ownerDecisionMade !==
      false
  ) {
    throw new Error(
      "Riya recommendation two reviewed preparation is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.sourceRecommendationReviewDecisionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerExecutionDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.recommendationOneReviewed !==
      true ||
    boundary.recommendationTwoPreparationPerformed !==
      true ||
    boundary.recommendationTwoExecutionAuthorized !==
      approved ||
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
      "Riya recommendation two execution decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO"
      : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Riya recommendation two execution decision next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedPreparation,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation two execution decision must be deeply frozen.",
    );
  }
}

export function createRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision(
  input:
    CreateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecisionInput,
): RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision {
  const source =
    input.limitedInternalPilotRecommendationTwoPreparation;

  validateSourcePreparation(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation two execution decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation two execution decision owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Riya recommendation two execution decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Riya recommendation-two-preparation-bound owner can issue the execution decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION" &&
    input.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATION_TWO_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Riya recommendation two execution decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Riya recommendation two execution decision cannot precede its preparation.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION";

  const decisionCore = {
    version:
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_RECORDED" as const,

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

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceRecommendationReviewDecisionId:
      source.sourceRecommendationReviewDecisionId,

    sourceRecommendationReviewDecisionDigest:
      source.sourceRecommendationReviewDecisionDigest,

    sourceRecommendationExecutionId:
      source.sourceRecommendationExecutionId,

    sourceRecommendationExecutionDigest:
      source.sourceRecommendationExecutionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    sourcePilotPreparationId:
      source.sourcePilotPreparationId,

    sourcePilotPreparationDigest:
      source.sourcePilotPreparationDigest,

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

    recommendationTwoExecutionAuthorized:
      approved,

    recommendationTwoExecutionPerformed:
      false as const,

    reason,

    reviewedPreparation: {
      pilotClass:
        source.preparedRecommendation.pilotClass,

      scenarioId:
        source.preparedRecommendation.scenarioId,

      recommendationSequence:
        source.preparedRecommendation.recommendationSequence,

      priorReviewedRecommendationSequence:
        source.preparedRecommendation.priorReviewedRecommendationSequence,

      maximumRecommendationCount:
        source.preparedRecommendation.maximumRecommendationCount,

      remainingRecommendationCapacityBeforeExecution:
        source.preparedRecommendation.remainingRecommendationCapacityBeforeExecution,

      projectedRemainingRecommendationCapacityAfterExecution:
        source.preparedRecommendation.projectedRemainingRecommendationCapacityAfterExecution,

      concurrentRecommendationLimit:
        source.preparedRecommendation.concurrentRecommendationLimit,

      failureThreshold:
        source.preparedRecommendation.failureThreshold,

      ownerReviewFrequency:
        source.preparedRecommendation.ownerReviewFrequency,

      dataClassification:
        source.preparedRecommendation.dataClassification,

      inquiryEvidenceToolMode:
        source.preparedRecommendation.inquiryEvidenceToolMode,

      customerContextToolMode:
        source.preparedRecommendation.customerContextToolMode,

      recommendationToolId:
        source.preparedRecommendation.recommendationToolId,

      recommendationToolMode:
        source.preparedRecommendation.recommendationToolMode,

      executionMode:
        source.preparedRecommendation.executionMode,

      clarificationBeforeGuessingRequired:
        source.specialistExpectation.clarificationBeforeGuessingRequired,

      missingFactsMustBeExplicit:
        source.specialistExpectation.missingFactsMustBeExplicit,

      verifiedFactsSeparatedFromAssumptions:
        source.specialistExpectation.verifiedFactsSeparatedFromAssumptions,

      uncertaintyPreserved:
        source.specialistExpectation.uncertaintyPreserved,

      practicalClarifyingQuestionsRequired:
        source.specialistExpectation.practicalClarifyingQuestionsRequired,

      recommendationGenerationPerformed:
        source.specialistExpectation.recommendationGenerationPerformed,

      ownerDecisionMade:
        source.specialistExpectation.ownerDecisionMade,
    },

    authorityBoundary: {
      sourcePreparationBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      sourceRecommendationReviewDecisionBound:
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

      recommendationOneReviewed:
        true as const,

      recommendationTwoPreparationPerformed:
        true as const,

      recommendationTwoExecutionAuthorized:
        approved,

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
        ? "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision;

  validateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision(
    decision,
  );

  return decision;
}