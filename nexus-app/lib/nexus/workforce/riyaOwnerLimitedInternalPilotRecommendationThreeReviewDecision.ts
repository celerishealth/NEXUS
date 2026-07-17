import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationThreeExecution,
  type RiyaLimitedInternalPilotRecommendationThreeExecution,
} from "./riyaLimitedInternalPilotRecommendationThreeExecution";

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISION_VERSION =
  "nexus-riya-owner-limited-internal-pilot-recommendation-three-review-decision-v1" as const;

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",
  "REJECT_AND_RETAIN_RECOMMENDATION_THREE_ONLY",
] as const;

export type RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionType =
  (
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISIONS
  )[number];

export interface CreateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionInput {
  readonly limitedInternalPilotRecommendationThreeExecution:
    RiyaLimitedInternalPilotRecommendationThreeExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision {
  readonly version:
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED";

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

  readonly limitedInternalPilotRecommendationThreeExecutionId:
    string;

  readonly limitedInternalPilotRecommendationThreeExecutionDigest:
    string;

  readonly ownerRecommendationThreeExecutionDecisionId:
    string;

  readonly ownerRecommendationThreeExecutionDecisionDigest:
    string;

  readonly recommendationThreePreparationId:
    string;

  readonly recommendationThreePreparationDigest:
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
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionType;

  readonly limitedInternalPilotCompleted:
    boolean;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF";

    reviewedRecommendationSequence:
      3;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacity:
      0;

    ownerReviewFrequency:
      "AFTER_EVERY_RECOMMENDATION";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    customerContextToolMode:
      "READ_ONLY";

    recommendationToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    recommendationOutcome:
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS";

    preferredOptionId:
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT";

    optionIds:
      readonly [
        "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",
        "OPTION_B_HIGH_CAPACITY_ROLLOUT",
      ];

    optionRiskLevels:
      readonly [
        "LOW",
        "MEDIUM",
      ];

    verifiedFacts:
      readonly string[];

    conflictingConstraints:
      readonly string[];

    verifiedContext:
      readonly string[];

    unavailableContext:
      readonly string[];

    rationale:
      readonly string[];

    uncertainties:
      readonly string[];

    benefitsAndTradeoffsExplicit:
      true;

    ownerDecisionReserved:
      true;

    assumptionsMade:
      false;

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

    transparentAIIdentity:
      true;

    ownerDecisionMade:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;

    unsupportedFactsInvented:
      false;

    crossCustomerEvidenceUsed:
      false;

    crossTenantEvidenceUsed:
      false;

    realCustomerDataUsed:
      false;

    crossCustomerContextUsed:
      false;

    crossTenantContextUsed:
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

    ownerDecisionRequired:
      true;

    approvalBypassAllowed:
      false;

    recommendationOneReviewed:
      true;

    recommendationTwoReviewed:
      true;

    recommendationThreeReviewed:
      true;

    finalRecommendationSequenceReached:
      true;

    recommendationCapacityExhausted:
      true;

    limitedInternalPilotCompleted:
      boolean;

    furtherRecommendationPreparationAuthorized:
      false;

    furtherRecommendationExecutionAuthorized:
      false;

    concurrentRecommendationExecutionAuthorized:
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
    | "LIMITED_INTERNAL_PILOT_COMPLETE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_ONLY";

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
  /\b(secret|password|authorization|bearer|access[_ -]?token|api[_ -]?key|private[_-]?key|session[_ -]?cookie)\b/i;

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

const EXPECTED_VERIFIED_FACTS = [
  "Option A requires fewer setup steps and has lower initial operational complexity.",
  "Option B provides greater scaling headroom but introduces more dependencies.",
  "The synthetic case requires a reversible owner-controlled first step.",
] as const;

const EXPECTED_CONFLICTING_CONSTRAINTS = [
  "Lower initial complexity conflicts with maximum scaling headroom.",
  "Faster bounded adoption conflicts with broader implementation scope.",
] as const;

const EXPECTED_VERIFIED_CONTEXT = [
  "The owner prioritizes safety, reversibility, and clear operational control.",
  "No external delivery or production mutation is authorized.",
] as const;

const EXPECTED_UNAVAILABLE_CONTEXT = [
  "No verified evidence establishes that immediate maximum capacity is required.",
] as const;

const EXPECTED_RATIONALE = [
  "Option A satisfies the verified need for a reversible owner-controlled first step.",
  "Option B's additional capacity is not currently supported by verified demand evidence.",
  "The recommendation preserves an explicit upgrade path instead of making an irreversible early commitment.",
] as const;

const EXPECTED_UNCERTAINTIES = [
  "Future demand level remains unverified.",
  "The timing of any capacity upgrade remains an owner decision.",
] as const;

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
      "Unsupported deterministic Riya recommendation three review value.",
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

  if (
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
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

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 16 ||
    value.length > 500
  ) {
    throw new Error(
      "Riya recommendation three review reason is invalid.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(value)
  ) {
    throw new Error(
      "Riya recommendation three review reason contains secret-bearing content.",
    );
  }

  return value;
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

function sameValue(
  left: unknown,
  right: unknown,
): boolean {
  return (
    stableStringify(left) ===
    stableStringify(right)
  );
}

function validateSourceExecution(
  source:
    RiyaLimitedInternalPilotRecommendationThreeExecution,
): void {
  validateRiyaLimitedInternalPilotRecommendationThreeExecution(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 70 Riya recommendation three execution",
    source,
    "executionDigest",
  );

  if (
    source.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTED" ||
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
    source.pilotRecommendation.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    source.pilotRecommendation.recommendationSequence !==
      3 ||
    source.pilotRecommendation.maximumRecommendationCount !==
      3 ||
    source.pilotRecommendation.remainingRecommendationCapacity !==
      0 ||
    source.recommendationDraft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    source.recommendationDraft.recommendationOutcome !==
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" ||
    source.recommendationDraft.preferredOptionId !==
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" ||
    source.recommendationDraft.ownerDecisionReserved !==
      true ||
    source.recommendationDraft.ownerDecisionMade !==
      false ||
    source.executionBoundary.recommendationCapacityExhausted !==
      true ||
    source.executionBoundary.recommendationThreeExecutionPerformed !==
      true ||
    source.executionBoundary.limitedInternalPilotCompleted !==
      false ||
    source.executionBoundary.ownerReviewRequired !==
      true ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 70 Riya recommendation three execution is required.",
    );
  }
}

export function validateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Riya recommendation three review decision identity",
        decision.decisionId,
      ],
      [
        "Riya recommendation three execution identity",
        decision.limitedInternalPilotRecommendationThreeExecutionId,
      ],
      [
        "Riya recommendation three owner execution decision identity",
        decision.ownerRecommendationThreeExecutionDecisionId,
      ],
      [
        "Riya recommendation three preparation identity",
        decision.recommendationThreePreparationId,
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
        "Riya initial owner decision identity",
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
        "Riya recommendation three execution digest",
        decision.limitedInternalPilotRecommendationThreeExecutionDigest,
      ],
      [
        "Riya recommendation three owner execution decision digest",
        decision.ownerRecommendationThreeExecutionDecisionDigest,
      ],
      [
        "Riya recommendation three preparation digest",
        decision.recommendationThreePreparationDigest,
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
        "Riya initial owner decision digest",
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
        "Riya recommendation three review decision digest",
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

  requireReason(
    decision.reason,
  );

  requireIsoTimestamp(
    "Riya recommendation three review decision time",
    decision.decidedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation three review decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED" ||
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
      "Riya recommendation three review identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATION_THREE_ONLY"
  ) {
    throw new Error(
      "Riya recommendation three review decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  if (
    decision.limitedInternalPilotCompleted !==
      approved
  ) {
    throw new Error(
      "Riya limited internal pilot completion state is invalid.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    evidence.reviewedRecommendationSequence !==
      3 ||
    evidence.maximumRecommendationCount !==
      3 ||
    evidence.remainingRecommendationCapacity !==
      0 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.customerContextToolMode !==
      "READ_ONLY" ||
    evidence.recommendationToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    evidence.recommendationOutcome !==
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" ||
    evidence.preferredOptionId !==
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" ||
    !sameValue(
      evidence.optionIds,
      [
        "OPTION_A_BOUNDED_SIMPLE_ROLLOUT",
        "OPTION_B_HIGH_CAPACITY_ROLLOUT",
      ],
    ) ||
    !sameValue(
      evidence.optionRiskLevels,
      [
        "LOW",
        "MEDIUM",
      ],
    ) ||
    !sameValue(
      evidence.verifiedFacts,
      EXPECTED_VERIFIED_FACTS,
    ) ||
    !sameValue(
      evidence.conflictingConstraints,
      EXPECTED_CONFLICTING_CONSTRAINTS,
    ) ||
    !sameValue(
      evidence.verifiedContext,
      EXPECTED_VERIFIED_CONTEXT,
    ) ||
    !sameValue(
      evidence.unavailableContext,
      EXPECTED_UNAVAILABLE_CONTEXT,
    ) ||
    !sameValue(
      evidence.rationale,
      EXPECTED_RATIONALE,
    ) ||
    !sameValue(
      evidence.uncertainties,
      EXPECTED_UNCERTAINTIES,
    ) ||
    evidence.benefitsAndTradeoffsExplicit !==
      true ||
    evidence.ownerDecisionReserved !==
      true ||
    evidence.assumptionsMade !==
      false ||
    evidence.unsupportedClaimsIncluded !==
      false ||
    evidence.urgencyExaggerated !==
      false ||
    evidence.guaranteeMade !==
      false ||
    evidence.transparentAIIdentity !==
      true ||
    evidence.ownerDecisionMade !==
      false ||
    evidence.customerDeliveryPrepared !==
      false ||
    evidence.customerDeliveryExecuted !==
      false ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.crossCustomerEvidenceUsed !==
      false ||
    evidence.crossTenantEvidenceUsed !==
      false ||
    evidence.realCustomerDataUsed !==
      false ||
    evidence.crossCustomerContextUsed !==
      false ||
    evidence.crossTenantContextUsed !==
      false
  ) {
    throw new Error(
      "Riya recommendation three reviewed evidence is invalid.",
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
    boundary.ownerDecisionRequired !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.recommendationOneReviewed !==
      true ||
    boundary.recommendationTwoReviewed !==
      true ||
    boundary.recommendationThreeReviewed !==
      true ||
    boundary.finalRecommendationSequenceReached !==
      true ||
    boundary.recommendationCapacityExhausted !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      approved ||
    boundary.furtherRecommendationPreparationAuthorized !==
      false ||
    boundary.furtherRecommendationExecutionAuthorized !==
      false ||
    boundary.concurrentRecommendationExecutionAuthorized !==
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
      "Riya recommendation three review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "LIMITED_INTERNAL_PILOT_COMPLETE"
      : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Riya recommendation three review next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.optionIds,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.optionRiskLevels,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.verifiedFacts,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.conflictingConstraints,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.verifiedContext,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.unavailableContext,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.rationale,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence.uncertainties,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation three review decision must be deeply frozen.",
    );
  }
}

export function createRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
  input:
    CreateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecisionInput,
): RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision {
  const source =
    input.limitedInternalPilotRecommendationThreeExecution;

  validateSourceExecution(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation three review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation three review owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Riya recommendation three review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the recommendation-three-execution-bound owner can issue the final review decision.",
    );
  }

  if (
    !RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Riya recommendation three review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Riya recommendation three review decision cannot precede recommendation three execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  const decisionCore = {
    version:
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW_RECORDED" as const,

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

    limitedInternalPilotRecommendationThreeExecutionId:
      source.executionId,

    limitedInternalPilotRecommendationThreeExecutionDigest:
      source.executionDigest,

    ownerRecommendationThreeExecutionDecisionId:
      source.ownerRecommendationThreeExecutionDecisionId,

    ownerRecommendationThreeExecutionDecisionDigest:
      source.ownerRecommendationThreeExecutionDecisionDigest,

    recommendationThreePreparationId:
      source.recommendationThreePreparationId,

    recommendationThreePreparationDigest:
      source.recommendationThreePreparationDigest,

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
      input.ownerId,

    decision:
      input.decision,

    limitedInternalPilotCompleted:
      approved,

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

      recommendationToolMode:
        source.pilotRecommendation.recommendationToolMode,

      executionMode:
        source.pilotRecommendation.executionMode,

      recommendationStatus:
        source.recommendationDraft.recommendationStatus,

      recommendationOutcome:
        source.recommendationDraft.recommendationOutcome,

      preferredOptionId:
        source.recommendationDraft.preferredOptionId,

      optionIds: [
        source.recommendationDraft.options[0].optionId,
        source.recommendationDraft.options[1].optionId,
      ] as const,

      optionRiskLevels: [
        source.recommendationDraft.options[0].riskLevel,
        source.recommendationDraft.options[1].riskLevel,
      ] as const,

      verifiedFacts:
        [...source.syntheticInquiryEvidence.verifiedFacts],

      conflictingConstraints:
        [...source.syntheticInquiryEvidence.conflictingConstraints],

      verifiedContext:
        [...source.syntheticCustomerContext.verifiedContext],

      unavailableContext:
        [...source.syntheticCustomerContext.unavailableContext],

      rationale:
        [...source.recommendationDraft.rationale],

      uncertainties:
        [...source.recommendationDraft.uncertainties],

      benefitsAndTradeoffsExplicit:
        source.recommendationDraft.options.every(
          (option) =>
            option.benefits.length > 0 &&
            option.tradeoffs.length > 0,
        ) as true,

      ownerDecisionReserved:
        source.recommendationDraft.ownerDecisionReserved,

      assumptionsMade:
        source.recommendationDraft.assumptionsMade,

      unsupportedClaimsIncluded:
        source.recommendationDraft.unsupportedClaimsIncluded,

      urgencyExaggerated:
        source.recommendationDraft.urgencyExaggerated,

      guaranteeMade:
        source.recommendationDraft.guaranteeMade,

      transparentAIIdentity:
        source.recommendationDraft.transparentAIIdentity,

      ownerDecisionMade:
        source.recommendationDraft.ownerDecisionMade,

      customerDeliveryPrepared:
        source.recommendationDraft.customerDeliveryPrepared,

      customerDeliveryExecuted:
        source.recommendationDraft.customerDeliveryExecuted,

      unsupportedFactsInvented:
        source.syntheticInquiryEvidence.unsupportedFactsInvented,

      crossCustomerEvidenceUsed:
        source.syntheticInquiryEvidence.crossCustomerEvidenceUsed,

      crossTenantEvidenceUsed:
        source.syntheticInquiryEvidence.crossTenantEvidenceUsed,

      realCustomerDataUsed:
        source.syntheticCustomerContext.realCustomerDataUsed,

      crossCustomerContextUsed:
        source.syntheticCustomerContext.crossCustomerContextUsed,

      crossTenantContextUsed:
        source.syntheticCustomerContext.crossTenantContextUsed,
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

      ownerDecisionRequired:
        true as const,

      approvalBypassAllowed:
        false as const,

      recommendationOneReviewed:
        true as const,

      recommendationTwoReviewed:
        true as const,

      recommendationThreeReviewed:
        true as const,

      finalRecommendationSequenceReached:
        true as const,

      recommendationCapacityExhausted:
        true as const,

      limitedInternalPilotCompleted:
        approved,

      furtherRecommendationPreparationAuthorized:
        false as const,

      furtherRecommendationExecutionAuthorized:
        false as const,

      concurrentRecommendationExecutionAuthorized:
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
        ? "LIMITED_INTERNAL_PILOT_COMPLETE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as RiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision;

  validateRiyaOwnerLimitedInternalPilotRecommendationThreeReviewDecision(
    decision,
  );

  return decision;
}
