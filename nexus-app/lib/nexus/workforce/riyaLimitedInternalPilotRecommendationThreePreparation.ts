import {
  createHash,
} from "node:crypto";

import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION,
  validateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision,
  type RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision,
} from "./riyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision";

export const RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION =
  "nexus-riya-limited-internal-pilot-recommendation-three-preparation-v1" as const;

export interface CreateRiyaLimitedInternalPilotRecommendationThreePreparationInput {
  readonly preparationId:
    string;

  readonly ownerLimitedInternalPilotRecommendationTwoReviewDecision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision;

  readonly preparedAt:
    string;
}

export interface RiyaLimitedInternalPilotRecommendationThreePreparation {
  readonly version:
    typeof RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARED";

  readonly sourceRecommendationTwoReviewDecisionId:
    string;

  readonly sourceRecommendationTwoReviewDecisionDigest:
    string;

  readonly sourceRecommendationTwoExecutionId:
    string;

  readonly sourceRecommendationTwoExecutionDigest:
    string;

  readonly ownerRecommendationTwoExecutionDecisionId:
    string;

  readonly ownerRecommendationTwoExecutionDecisionDigest:
    string;

  readonly recommendationTwoPreparationId:
    string;

  readonly recommendationTwoPreparationDigest:
    string;

  readonly sourceRecommendationOneReviewDecisionId:
    string;

  readonly sourceRecommendationOneReviewDecisionDigest:
    string;

  readonly sourceRecommendationOneExecutionId:
    string;

  readonly sourceRecommendationOneExecutionDigest:
    string;

  readonly initialOwnerPilotExecutionDecisionId:
    string;

  readonly initialOwnerPilotExecutionDecisionDigest:
    string;

  readonly initialPilotPreparationId:
    string;

  readonly initialPilotPreparationDigest:
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
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF";

    recommendationSequence:
      3;

    priorReviewedRecommendationSequence:
      2;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacityBeforeExecution:
      1;

    projectedRemainingRecommendationCapacityAfterExecution:
      0;

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
    conflictingOptionsMustBeExplicit:
      true;

    optionsAndTradeoffsRequired:
      true;

    recommendationRationaleRequired:
      true;

    riskLevelRequired:
      true;

    nextActionRequired:
      true;

    ownerDecisionMustRemainReserved:
      true;

    verifiedEvidenceOnly:
      true;

    uncertaintyPreserved:
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
    sourceRecommendationTwoReviewDecisionBound:
      true;

    sourceRecommendationTwoReviewDecisionIntegrityVerified:
      true;

    sourceRecommendationTwoExecutionBound:
      true;

    sourceRecommendationTwoPreparationBound:
      true;

    sourceRecommendationOneReviewDecisionBound:
      true;

    sourceRecommendationOneExecutionBound:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    recommendationOneReviewed:
      true;

    recommendationTwoReviewed:
      true;

    recommendationThreePreparationAuthorized:
      true;

    recommendationThreePreparationPerformed:
      true;

    recommendationThreeExecutionAuthorized:
      false;

    recommendationThreeExecutionPerformed:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION";

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
      "Unsupported deterministic Riya recommendation three preparation value.",
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
      `${label} contains credential-bearing content.`,
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
    RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision,
): void {
  validateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 67 Riya recommendation two review decision",
    source,
    "decisionDigest",
  );

  if (
    source.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_RECORDED" ||
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
      EXPECTED_AUTONOMY_LEVEL ||
    source.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION" ||
    source.nextRecommendationPreparationApproved !==
      true ||
    source.recommendationThreeExecutionAuthorized !==
      false ||
    source.reviewedEvidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    source.reviewedEvidence.scenarioId !==
      "MISSING_FACT_CLARIFICATION" ||
    source.reviewedEvidence.reviewedRecommendationSequence !==
      2 ||
    source.reviewedEvidence.maximumRecommendationCount !==
      3 ||
    source.reviewedEvidence.remainingRecommendationCapacity !==
      1 ||
    source.authorityBoundary.recommendationOneReviewed !==
      true ||
    source.authorityBoundary.recommendationTwoReviewed !==
      true ||
    source.authorityBoundary.nextRecommendationPreparationAuthorized !==
      true ||
    source.authorityBoundary.recommendationThreePreparationPerformed !==
      false ||
    source.authorityBoundary.recommendationThreeExecutionAuthorized !==
      false ||
    source.authorityBoundary.recommendationThreeExecutionPerformed !==
      false ||
    source.authorityBoundary.limitedInternalPilotCompleted !==
      false ||
    source.nextStep !==
      "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE"
  ) {
    throw new Error(
      "An approved Workforce Day 67 Riya recommendation three preparation decision is required.",
    );
  }
}

export function validateRiyaLimitedInternalPilotRecommendationThreePreparation(
  preparation:
    RiyaLimitedInternalPilotRecommendationThreePreparation,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Riya recommendation three preparation identity",
        preparation.preparationId,
      ],
      [
        "Riya recommendation two review decision identity",
        preparation.sourceRecommendationTwoReviewDecisionId,
      ],
      [
        "Riya recommendation two execution identity",
        preparation.sourceRecommendationTwoExecutionId,
      ],
      [
        "Riya recommendation two owner execution decision identity",
        preparation.ownerRecommendationTwoExecutionDecisionId,
      ],
      [
        "Riya recommendation two preparation identity",
        preparation.recommendationTwoPreparationId,
      ],
      [
        "Riya recommendation one review decision identity",
        preparation.sourceRecommendationOneReviewDecisionId,
      ],
      [
        "Riya recommendation one execution identity",
        preparation.sourceRecommendationOneExecutionId,
      ],
      [
        "Riya initial owner pilot decision identity",
        preparation.initialOwnerPilotExecutionDecisionId,
      ],
      [
        "Riya initial pilot preparation identity",
        preparation.initialPilotPreparationId,
      ],
      [
        "Riya controlled shadow execution identity",
        preparation.controlledShadowExecutionId,
      ],
      [
        "Riya tenant identity",
        preparation.tenantId,
      ],
      [
        "Riya owner identity",
        preparation.ownerId,
      ],
    ];

  for (
    const [
      label,
      value,
    ] of identifiers
  ) {
    requireSafeIdentifier(
      label,
      value,
    );
  }

  const digests:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Riya recommendation two review decision digest",
        preparation.sourceRecommendationTwoReviewDecisionDigest,
      ],
      [
        "Riya recommendation two execution digest",
        preparation.sourceRecommendationTwoExecutionDigest,
      ],
      [
        "Riya recommendation two owner execution decision digest",
        preparation.ownerRecommendationTwoExecutionDecisionDigest,
      ],
      [
        "Riya recommendation two preparation digest",
        preparation.recommendationTwoPreparationDigest,
      ],
      [
        "Riya recommendation one review decision digest",
        preparation.sourceRecommendationOneReviewDecisionDigest,
      ],
      [
        "Riya recommendation one execution digest",
        preparation.sourceRecommendationOneExecutionDigest,
      ],
      [
        "Riya initial owner pilot decision digest",
        preparation.initialOwnerPilotExecutionDecisionDigest,
      ],
      [
        "Riya initial pilot preparation digest",
        preparation.initialPilotPreparationDigest,
      ],
      [
        "Riya controlled shadow execution digest",
        preparation.controlledShadowExecutionDigest,
      ],
      [
        "Riya recommendation three preparation digest",
        preparation.preparationDigest,
      ],
    ];

  for (
    const [
      label,
      value,
    ] of digests
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireIsoTimestamp(
    "Riya recommendation three preparation time",
    preparation.preparedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation three preparation",
    preparation,
    "preparationDigest",
  );

  if (
    preparation.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARED" ||
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
      "Riya recommendation three preparation identity is invalid.",
    );
  }

  const prepared =
    preparation.preparedRecommendation;

  if (
    prepared.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    prepared.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    prepared.recommendationSequence !==
      3 ||
    prepared.priorReviewedRecommendationSequence !==
      2 ||
    prepared.maximumRecommendationCount !==
      3 ||
    prepared.remainingRecommendationCapacityBeforeExecution !==
      1 ||
    prepared.projectedRemainingRecommendationCapacityAfterExecution !==
      0 ||
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
      "Riya recommendation three bounded scenario is invalid.",
    );
  }

  const expectation =
    preparation.specialistExpectation;

  if (
    expectation.conflictingOptionsMustBeExplicit !==
      true ||
    expectation.optionsAndTradeoffsRequired !==
      true ||
    expectation.recommendationRationaleRequired !==
      true ||
    expectation.riskLevelRequired !==
      true ||
    expectation.nextActionRequired !==
      true ||
    expectation.ownerDecisionMustRemainReserved !==
      true ||
    expectation.verifiedEvidenceOnly !==
      true ||
    expectation.uncertaintyPreserved !==
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
      "Riya recommendation three specialist expectation is invalid.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

  if (
    boundary.sourceRecommendationTwoReviewDecisionBound !==
      true ||
    boundary.sourceRecommendationTwoReviewDecisionIntegrityVerified !==
      true ||
    boundary.sourceRecommendationTwoExecutionBound !==
      true ||
    boundary.sourceRecommendationTwoPreparationBound !==
      true ||
    boundary.sourceRecommendationOneReviewDecisionBound !==
      true ||
    boundary.sourceRecommendationOneExecutionBound !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.recommendationOneReviewed !==
      true ||
    boundary.recommendationTwoReviewed !==
      true ||
    boundary.recommendationThreePreparationAuthorized !==
      true ||
    boundary.recommendationThreePreparationPerformed !==
      true ||
    boundary.recommendationThreeExecutionAuthorized !==
      false ||
    boundary.recommendationThreeExecutionPerformed !==
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
      "Riya recommendation three preparation authority boundary is invalid.",
    );
  }

  if (
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Riya recommendation three preparation next step is invalid.",
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
      "Riya recommendation three preparation must be deeply frozen.",
    );
  }
}

export function createRiyaLimitedInternalPilotRecommendationThreePreparation(
  input:
    CreateRiyaLimitedInternalPilotRecommendationThreePreparationInput,
): RiyaLimitedInternalPilotRecommendationThreePreparation {
  const source =
    input.ownerLimitedInternalPilotRecommendationTwoReviewDecision;

  validateSourceReviewDecision(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation three preparation identity",
    input.preparationId,
  );

  requireIsoTimestamp(
    "Riya recommendation three preparation time",
    input.preparedAt,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Riya recommendation three preparation cannot precede recommendation two owner review.",
    );
  }

  const preparationCore = {
    version:
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARED" as const,

    sourceRecommendationTwoReviewDecisionId:
      source.decisionId,

    sourceRecommendationTwoReviewDecisionDigest:
      source.decisionDigest,

    sourceRecommendationTwoExecutionId:
      source.limitedInternalPilotRecommendationTwoExecutionId,

    sourceRecommendationTwoExecutionDigest:
      source.limitedInternalPilotRecommendationTwoExecutionDigest,

    ownerRecommendationTwoExecutionDecisionId:
      source.ownerRecommendationTwoExecutionDecisionId,

    ownerRecommendationTwoExecutionDecisionDigest:
      source.ownerRecommendationTwoExecutionDecisionDigest,

    recommendationTwoPreparationId:
      source.recommendationTwoPreparationId,

    recommendationTwoPreparationDigest:
      source.recommendationTwoPreparationDigest,

    sourceRecommendationOneReviewDecisionId:
      source.sourceRecommendationReviewDecisionId,

    sourceRecommendationOneReviewDecisionDigest:
      source.sourceRecommendationReviewDecisionDigest,

    sourceRecommendationOneExecutionId:
      source.sourceRecommendationOneExecutionId,

    sourceRecommendationOneExecutionDigest:
      source.sourceRecommendationOneExecutionDigest,

    initialOwnerPilotExecutionDecisionId:
      source.initialOwnerPilotExecutionDecisionId,

    initialOwnerPilotExecutionDecisionDigest:
      source.initialOwnerPilotExecutionDecisionDigest,

    initialPilotPreparationId:
      source.initialPilotPreparationId,

    initialPilotPreparationDigest:
      source.initialPilotPreparationDigest,

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
        "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" as const,

      recommendationSequence:
        3 as const,

      priorReviewedRecommendationSequence:
        2 as const,

      maximumRecommendationCount:
        3 as const,

      remainingRecommendationCapacityBeforeExecution:
        1 as const,

      projectedRemainingRecommendationCapacityAfterExecution:
        0 as const,

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
      conflictingOptionsMustBeExplicit:
        true as const,

      optionsAndTradeoffsRequired:
        true as const,

      recommendationRationaleRequired:
        true as const,

      riskLevelRequired:
        true as const,

      nextActionRequired:
        true as const,

      ownerDecisionMustRemainReserved:
        true as const,

      verifiedEvidenceOnly:
        true as const,

      uncertaintyPreserved:
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
      sourceRecommendationTwoReviewDecisionBound:
        true as const,

      sourceRecommendationTwoReviewDecisionIntegrityVerified:
        true as const,

      sourceRecommendationTwoExecutionBound:
        true as const,

      sourceRecommendationTwoPreparationBound:
        true as const,

      sourceRecommendationOneReviewDecisionBound:
        true as const,

      sourceRecommendationOneExecutionBound:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      recommendationOneReviewed:
        true as const,

      recommendationTwoReviewed:
        true as const,

      recommendationThreePreparationAuthorized:
        true as const,

      recommendationThreePreparationPerformed:
        true as const,

      recommendationThreeExecutionAuthorized:
        false as const,

      recommendationThreeExecutionPerformed:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as RiyaLimitedInternalPilotRecommendationThreePreparation;

  validateRiyaLimitedInternalPilotRecommendationThreePreparation(
    preparation,
  );

  return preparation;
}