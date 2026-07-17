import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationThreePreparation,
  type RiyaLimitedInternalPilotRecommendationThreePreparation,
} from "./riyaLimitedInternalPilotRecommendationThreePreparation";

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION =
  "nexus-riya-owner-limited-internal-pilot-recommendation-three-execution-decision-v1" as const;

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION",
  "REJECT_AND_RETAIN_RECOMMENDATION_THREE_PREPARATION_ONLY",
] as const;

export type RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionType =
  (
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISIONS
  )[number];

export interface CreateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionInput {
  readonly limitedInternalPilotRecommendationThreePreparation:
    RiyaLimitedInternalPilotRecommendationThreePreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision {
  readonly version:
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_RECORDED";

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

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionType;

  readonly recommendationThreeExecutionAuthorized:
    boolean;

  readonly recommendationThreeExecutionPerformed:
    false;

  readonly reason:
    string;

  readonly reviewedPreparation: Readonly<
    RiyaLimitedInternalPilotRecommendationThreePreparation[
      "preparedRecommendation"
    ] &
    RiyaLimitedInternalPilotRecommendationThreePreparation[
      "specialistExpectation"
    ]
  >;

  readonly authorityBoundary: Readonly<{
    sourcePreparationBound:
      true;

    sourcePreparationIntegrityVerified:
      true;

    sourceRecommendationTwoReviewDecisionBound:
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

    ownerExecutionDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    recommendationOneReviewed:
      true;

    recommendationTwoReviewed:
      true;

    recommendationThreePreparationPerformed:
      true;

    recommendationThreeExecutionAuthorized:
      boolean;

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
    | "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_ONLY";

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
      "Unsupported deterministic Riya recommendation three execution decision value.",
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

function requireReason(
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 20 ||
    value.length > 500
  ) {
    throw new Error(
      "Riya recommendation three execution decision reason must contain 20 to 500 trimmed characters.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Riya recommendation three execution decision reason contains secret-bearing content.",
    );
  }
}

function requireDecision(
  value: unknown,
): asserts value is
  RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionType {
  if (
    !RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISIONS.includes(
      value as
        RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionType,
    )
  ) {
    throw new Error(
      "Riya recommendation three execution decision is invalid.",
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

function validateSourcePreparation(
  source:
    RiyaLimitedInternalPilotRecommendationThreePreparation,
): void {
  validateRiyaLimitedInternalPilotRecommendationThreePreparation(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 68 Riya recommendation three preparation",
    source,
    "preparationDigest",
  );

  if (
    source.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARED" ||
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
    source.preparedRecommendation.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    source.preparedRecommendation.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    source.preparedRecommendation.recommendationSequence !==
      3 ||
    source.preparedRecommendation.priorReviewedRecommendationSequence !==
      2 ||
    source.preparedRecommendation.maximumRecommendationCount !==
      3 ||
    source.preparedRecommendation.remainingRecommendationCapacityBeforeExecution !==
      1 ||
    source.preparedRecommendation.projectedRemainingRecommendationCapacityAfterExecution !==
      0 ||
    source.preparedRecommendation.concurrentRecommendationLimit !==
      1 ||
    source.preparedRecommendation.failureThreshold !==
      1 ||
    source.preparedRecommendation.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    source.preparedRecommendation.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    source.preparedRecommendation.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    source.preparedRecommendation.customerContextToolMode !==
      "READ_ONLY" ||
    source.preparedRecommendation.recommendationToolId !==
      "tool-recommendation-draft" ||
    source.preparedRecommendation.recommendationToolMode !==
      "DRAFT_ONLY" ||
    source.preparedRecommendation.executionMode !==
      "SANDBOX_ONLY" ||
    source.specialistExpectation.conflictingOptionsMustBeExplicit !==
      true ||
    source.specialistExpectation.optionsAndTradeoffsRequired !==
      true ||
    source.specialistExpectation.recommendationRationaleRequired !==
      true ||
    source.specialistExpectation.riskLevelRequired !==
      true ||
    source.specialistExpectation.nextActionRequired !==
      true ||
    source.specialistExpectation.ownerDecisionMustRemainReserved !==
      true ||
    source.specialistExpectation.verifiedEvidenceOnly !==
      true ||
    source.specialistExpectation.uncertaintyPreserved !==
      true ||
    source.specialistExpectation.recommendationGenerationPerformed !==
      false ||
    source.specialistExpectation.ownerDecisionMade !==
      false ||
    source.specialistExpectation.customerDeliveryPrepared !==
      false ||
    source.specialistExpectation.customerDeliveryExecuted !==
      false ||
    source.authorityBoundary.recommendationOneReviewed !==
      true ||
    source.authorityBoundary.recommendationTwoReviewed !==
      true ||
    source.authorityBoundary.recommendationThreePreparationPerformed !==
      true ||
    source.authorityBoundary.recommendationThreeExecutionAuthorized !==
      false ||
    source.authorityBoundary.recommendationThreeExecutionPerformed !==
      false ||
    source.authorityBoundary.limitedInternalPilotCompleted !==
      false ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 68 Riya recommendation three preparation is required.",
    );
  }
}

export function validateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Riya recommendation three execution decision identity",
        decision.decisionId,
      ],
      [
        "Riya recommendation three preparation identity",
        decision.preparationId,
      ],
      [
        "Riya recommendation two review decision identity",
        decision.sourceRecommendationTwoReviewDecisionId,
      ],
      [
        "Riya recommendation two execution identity",
        decision.sourceRecommendationTwoExecutionId,
      ],
      [
        "Riya recommendation two owner execution decision identity",
        decision.ownerRecommendationTwoExecutionDecisionId,
      ],
      [
        "Riya recommendation two preparation identity",
        decision.recommendationTwoPreparationId,
      ],
      [
        "Riya recommendation one review decision identity",
        decision.sourceRecommendationOneReviewDecisionId,
      ],
      [
        "Riya recommendation one execution identity",
        decision.sourceRecommendationOneExecutionId,
      ],
      [
        "Riya initial owner pilot decision identity",
        decision.initialOwnerPilotExecutionDecisionId,
      ],
      [
        "Riya initial pilot preparation identity",
        decision.initialPilotPreparationId,
      ],
      [
        "Riya controlled shadow execution identity",
        decision.controlledShadowExecutionId,
      ],
      [
        "Riya tenant identity",
        decision.tenantId,
      ],
      [
        "Riya owner identity",
        decision.ownerId,
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
        "Riya recommendation three preparation digest",
        decision.preparationDigest,
      ],
      [
        "Riya recommendation two review decision digest",
        decision.sourceRecommendationTwoReviewDecisionDigest,
      ],
      [
        "Riya recommendation two execution digest",
        decision.sourceRecommendationTwoExecutionDigest,
      ],
      [
        "Riya recommendation two owner execution decision digest",
        decision.ownerRecommendationTwoExecutionDecisionDigest,
      ],
      [
        "Riya recommendation two preparation digest",
        decision.recommendationTwoPreparationDigest,
      ],
      [
        "Riya recommendation one review decision digest",
        decision.sourceRecommendationOneReviewDecisionDigest,
      ],
      [
        "Riya recommendation one execution digest",
        decision.sourceRecommendationOneExecutionDigest,
      ],
      [
        "Riya initial owner pilot decision digest",
        decision.initialOwnerPilotExecutionDecisionDigest,
      ],
      [
        "Riya initial pilot preparation digest",
        decision.initialPilotPreparationDigest,
      ],
      [
        "Riya controlled shadow execution digest",
        decision.controlledShadowExecutionDigest,
      ],
      [
        "Riya recommendation three execution decision digest",
        decision.decisionDigest,
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

  requireDecision(
    decision.decision,
  );

  requireReason(
    decision.reason,
  );

  requireIsoTimestamp(
    "Riya recommendation three execution decision time",
    decision.decidedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation three execution decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_RECORDED" ||
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
      "Riya recommendation three execution decision identity is invalid.",
    );
  }

  const approved =
    decision.decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION";

  if (
    decision.recommendationThreeExecutionAuthorized !==
      approved ||
    decision.recommendationThreeExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Riya recommendation three execution authority is invalid.",
    );
  }

  const reviewed =
    decision.reviewedPreparation;

  if (
    reviewed.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    reviewed.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    reviewed.recommendationSequence !==
      3 ||
    reviewed.priorReviewedRecommendationSequence !==
      2 ||
    reviewed.maximumRecommendationCount !==
      3 ||
    reviewed.remainingRecommendationCapacityBeforeExecution !==
      1 ||
    reviewed.projectedRemainingRecommendationCapacityAfterExecution !==
      0 ||
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
    reviewed.conflictingOptionsMustBeExplicit !==
      true ||
    reviewed.optionsAndTradeoffsRequired !==
      true ||
    reviewed.recommendationRationaleRequired !==
      true ||
    reviewed.riskLevelRequired !==
      true ||
    reviewed.nextActionRequired !==
      true ||
    reviewed.ownerDecisionMustRemainReserved !==
      true ||
    reviewed.verifiedEvidenceOnly !==
      true ||
    reviewed.uncertaintyPreserved !==
      true ||
    reviewed.unsupportedClaimsProhibited !==
      true ||
    reviewed.urgencyExaggerationProhibited !==
      true ||
    reviewed.guaranteeProhibited !==
      true ||
    reviewed.crossCustomerContextProhibited !==
      true ||
    reviewed.crossTenantContextProhibited !==
      true ||
    reviewed.transparentAIIdentityRequired !==
      true ||
    reviewed.recommendationGenerationPerformed !==
      false ||
    reviewed.ownerDecisionMade !==
      false ||
    reviewed.customerDeliveryPrepared !==
      false ||
    reviewed.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Riya recommendation three reviewed preparation is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.sourceRecommendationTwoReviewDecisionBound !==
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
    boundary.ownerExecutionDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.recommendationOneReviewed !==
      true ||
    boundary.recommendationTwoReviewed !==
      true ||
    boundary.recommendationThreePreparationPerformed !==
      true ||
    boundary.recommendationThreeExecutionAuthorized !==
      approved ||
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
      "Riya recommendation three execution decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE"
      : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Riya recommendation three execution decision next step is invalid.",
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
      "Riya recommendation three execution decision must be deeply frozen.",
    );
  }
}

export function createRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision(
  input:
    CreateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecisionInput,
): RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision {
  const source =
    input.limitedInternalPilotRecommendationThreePreparation;

  validateSourcePreparation(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation three execution decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation three execution decision owner identity",
    input.ownerId,
  );

  if (
    input.ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Riya recommendation three execution decision requires the preparation-bound owner.",
    );
  }

  requireDecision(
    input.decision,
  );

  requireReason(
    input.reason,
  );

  requireIsoTimestamp(
    "Riya recommendation three execution decision time",
    input.decidedAt,
  );

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Riya recommendation three execution decision cannot precede its preparation.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION";

  const decisionCore = {
    version:
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_RECORDED" as const,

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

    sourceRecommendationTwoReviewDecisionId:
      source.sourceRecommendationTwoReviewDecisionId,

    sourceRecommendationTwoReviewDecisionDigest:
      source.sourceRecommendationTwoReviewDecisionDigest,

    sourceRecommendationTwoExecutionId:
      source.sourceRecommendationTwoExecutionId,

    sourceRecommendationTwoExecutionDigest:
      source.sourceRecommendationTwoExecutionDigest,

    ownerRecommendationTwoExecutionDecisionId:
      source.ownerRecommendationTwoExecutionDecisionId,

    ownerRecommendationTwoExecutionDecisionDigest:
      source.ownerRecommendationTwoExecutionDecisionDigest,

    recommendationTwoPreparationId:
      source.recommendationTwoPreparationId,

    recommendationTwoPreparationDigest:
      source.recommendationTwoPreparationDigest,

    sourceRecommendationOneReviewDecisionId:
      source.sourceRecommendationOneReviewDecisionId,

    sourceRecommendationOneReviewDecisionDigest:
      source.sourceRecommendationOneReviewDecisionDigest,

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

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    decision:
      input.decision,

    recommendationThreeExecutionAuthorized:
      approved,

    recommendationThreeExecutionPerformed:
      false as const,

    reason:
      input.reason,

    reviewedPreparation: {
      ...source.preparedRecommendation,
      ...source.specialistExpectation,
    },

    authorityBoundary: {
      sourcePreparationBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      sourceRecommendationTwoReviewDecisionBound:
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

      ownerExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      recommendationOneReviewed:
        true as const,

      recommendationTwoReviewed:
        true as const,

      recommendationThreePreparationPerformed:
        true as const,

      recommendationThreeExecutionAuthorized:
        approved,

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
      approved
        ? "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision;

  validateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision(
    decision,
  );

  return decision;
}