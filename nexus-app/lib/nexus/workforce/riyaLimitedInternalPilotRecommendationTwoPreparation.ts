import {
  createHash,
} from "node:crypto";

import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION,
  validateRiyaOwnerLimitedInternalPilotRecommendationReviewDecision,
  type RiyaOwnerLimitedInternalPilotRecommendationReviewDecision,
} from "./riyaOwnerLimitedInternalPilotRecommendationReviewDecision";

export const RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION =
  "nexus-riya-limited-internal-pilot-recommendation-two-preparation-v1" as const;

export interface CreateRiyaLimitedInternalPilotRecommendationTwoPreparationInput {
  readonly preparationId:
    string;

  readonly ownerLimitedInternalPilotRecommendationReviewDecision:
    RiyaOwnerLimitedInternalPilotRecommendationReviewDecision;

  readonly preparedAt:
    string;
}

export interface RiyaLimitedInternalPilotRecommendationTwoPreparation {
  readonly version:
    typeof RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARED";

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

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly preparedRecommendation: Readonly<{
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
  }>;

  readonly specialistExpectation: Readonly<{
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

    unsupportedClaimsProhibited:
      true;

    urgencyExaggerationProhibited:
      true;

    guaranteeProhibited:
      true;

    crossCustomerContextProhibited:
      true;

    crossTenantContextProhibited:
      true;

    transparentAIIdentityRequired:
      true;

    recommendationGenerationPerformed:
      false;

    ownerDecisionMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    sourceRecommendationReviewDecisionBound:
      true;

    sourceRecommendationReviewDecisionIntegrityVerified:
      true;

    sourceRecommendationExecutionBound:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    recommendationOneReviewed:
      true;

    nextRecommendationPreparationAuthorized:
      true;

    recommendationTwoPreparationPerformed:
      true;

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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION";

  readonly preparedAt:
    string;

  readonly preparationDigest:
    string;
}

type UnknownRecord =
  Record<string, unknown>;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

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
      "Unsupported deterministic Riya recommendation two preparation value.",
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

function validateSourceReviewDecision(
  source:
    RiyaOwnerLimitedInternalPilotRecommendationReviewDecision,
): void {
  validateRiyaOwnerLimitedInternalPilotRecommendationReviewDecision(
    source,
  );

  if (
    source.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW_RECORDED" ||
    source.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_RECOMMENDATION_PREPARATION" ||
    source.nextRecommendationPreparationApproved !==
      true ||
    source.recommendationTwoExecutionAuthorized !==
      false ||
    source.nextStep !==
      "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO"
  ) {
    throw new Error(
      "An approved Workforce Day 63 Riya recommendation review decision is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 63 Riya recommendation review decision",
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
    source.role !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Workforce Day 63 Riya identity is invalid.",
    );
  }

  const evidence =
    source.reviewedEvidence;

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
      "Workforce Day 63 Riya reviewed evidence is invalid.",
    );
  }

  const boundary =
    source.authorityBoundary;

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
      true ||
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
      "Workforce Day 63 Riya preparation authority boundary is invalid.",
    );
  }
}

export function validateRiyaLimitedInternalPilotRecommendationTwoPreparation(
  preparation:
    RiyaLimitedInternalPilotRecommendationTwoPreparation,
): void {
  requireSafeIdentifier(
    "Riya recommendation two preparation identity",
    preparation.preparationId,
  );

  requireSafeIdentifier(
    "Riya source recommendation review decision identity",
    preparation.sourceRecommendationReviewDecisionId,
  );

  requireSafeIdentifier(
    "Riya source recommendation execution identity",
    preparation.sourceRecommendationExecutionId,
  );

  requireSafeIdentifier(
    "Riya owner execution decision identity",
    preparation.ownerExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Riya source pilot preparation identity",
    preparation.sourcePilotPreparationId,
  );

  requireSafeIdentifier(
    "Riya controlled shadow execution identity",
    preparation.controlledShadowExecutionId,
  );

  requireSafeIdentifier(
    "Riya tenant identity",
    preparation.tenantId,
  );

  requireSafeIdentifier(
    "Riya owner identity",
    preparation.ownerId,
  );

  requireDigest(
    "Riya source recommendation review decision digest",
    preparation.sourceRecommendationReviewDecisionDigest,
  );

  requireDigest(
    "Riya source recommendation execution digest",
    preparation.sourceRecommendationExecutionDigest,
  );

  requireDigest(
    "Riya owner execution decision digest",
    preparation.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Riya source pilot preparation digest",
    preparation.sourcePilotPreparationDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    preparation.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya recommendation two preparation time",
    preparation.preparedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation two preparation",
    preparation,
    "preparationDigest",
  );

  if (
    preparation.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARED" ||
    preparation.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    preparation.templateId !==
      EXPECTED_TEMPLATE_ID ||
    preparation.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    preparation.displayName !==
      EXPECTED_DISPLAY_NAME ||
    preparation.role !==
      EXPECTED_ROLE ||
    preparation.department !==
      EXPECTED_DEPARTMENT ||
    preparation.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Riya recommendation two preparation identity is invalid.",
    );
  }

  const prepared =
    preparation.preparedRecommendation;

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
      "Riya recommendation two prepared scope is invalid.",
    );
  }

  const expectation =
    preparation.specialistExpectation;

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
      "Riya recommendation two specialist expectation is invalid.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

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
      true ||
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Riya recommendation two preparation authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(preparation) ||
    !Object.isFrozen(
      preparation.preparedRecommendation,
    ) ||
    !Object.isFrozen(
      preparation.specialistExpectation,
    ) ||
    !Object.isFrozen(
      preparation.authorityBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation two preparation must be deeply frozen.",
    );
  }
}

export function createRiyaLimitedInternalPilotRecommendationTwoPreparation(
  input:
    CreateRiyaLimitedInternalPilotRecommendationTwoPreparationInput,
): RiyaLimitedInternalPilotRecommendationTwoPreparation {
  const source =
    input.ownerLimitedInternalPilotRecommendationReviewDecision;

  validateSourceReviewDecision(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation two preparation identity",
    input.preparationId,
  );

  requireIsoTimestamp(
    "Riya recommendation two preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Riya recommendation two preparation cannot precede the recommendation one owner review decision.",
    );
  }

  const preparationCore = {
    version:
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARED" as const,

    sourceRecommendationReviewDecisionId:
      source.decisionId,

    sourceRecommendationReviewDecisionDigest:
      source.decisionDigest,

    sourceRecommendationExecutionId:
      source.limitedInternalPilotRecommendationExecutionId,

    sourceRecommendationExecutionDigest:
      source.limitedInternalPilotRecommendationExecutionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    sourcePilotPreparationId:
      source.preparationId,

    sourcePilotPreparationDigest:
      source.preparationDigest,

    controlledShadowExecutionId:
      source.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      source.controlledShadowExecutionDigest,

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

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    preparedRecommendation: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      scenarioId:
        "MISSING_FACT_CLARIFICATION" as const,

      recommendationSequence:
        2 as const,

      priorReviewedRecommendationSequence:
        1 as const,

      maximumRecommendationCount:
        3 as const,

      remainingRecommendationCapacityBeforeExecution:
        2 as const,

      projectedRemainingRecommendationCapacityAfterExecution:
        1 as const,

      concurrentRecommendationLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_RECOMMENDATION" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      customerContextToolMode:
        "READ_ONLY" as const,

      recommendationToolId:
        "tool-recommendation-draft" as const,

      recommendationToolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    specialistExpectation: {
      clarificationBeforeGuessingRequired:
        true as const,

      missingFactsMustBeExplicit:
        true as const,

      verifiedFactsSeparatedFromAssumptions:
        true as const,

      uncertaintyPreserved:
        true as const,

      practicalClarifyingQuestionsRequired:
        true as const,

      unsupportedClaimsProhibited:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      guaranteeProhibited:
        true as const,

      crossCustomerContextProhibited:
        true as const,

      crossTenantContextProhibited:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      recommendationGenerationPerformed:
        false as const,

      ownerDecisionMade:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,
    },

    authorityBoundary: {
      sourceRecommendationReviewDecisionBound:
        true as const,

      sourceRecommendationReviewDecisionIntegrityVerified:
        true as const,

      sourceRecommendationExecutionBound:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      recommendationOneReviewed:
        true as const,

      nextRecommendationPreparationAuthorized:
        true as const,

      recommendationTwoPreparationPerformed:
        true as const,

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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as RiyaLimitedInternalPilotRecommendationTwoPreparation;

  validateRiyaLimitedInternalPilotRecommendationTwoPreparation(
    preparation,
  );

  return preparation;
}