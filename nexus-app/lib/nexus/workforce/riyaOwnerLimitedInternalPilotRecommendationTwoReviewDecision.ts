import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationTwoExecution,
  type RiyaLimitedInternalPilotRecommendationTwoExecution,
} from "./riyaLimitedInternalPilotRecommendationTwoExecution";

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION =
  "nexus-riya-owner-limited-internal-pilot-recommendation-two-review-decision-v1" as const;

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION",
  "REJECT_AND_RETAIN_RECOMMENDATIONS_ONE_AND_TWO_ONLY",
] as const;

export type RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecisionType =
  (
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISIONS
  )[number];

export interface CreateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecisionInput {
  readonly limitedInternalPilotRecommendationTwoExecution:
    RiyaLimitedInternalPilotRecommendationTwoExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision {
  readonly version:
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_RECORDED";

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

  readonly limitedInternalPilotRecommendationTwoExecutionId:
    string;

  readonly limitedInternalPilotRecommendationTwoExecutionDigest:
    string;

  readonly ownerRecommendationTwoExecutionDecisionId:
    string;

  readonly ownerRecommendationTwoExecutionDecisionDigest:
    string;

  readonly recommendationTwoPreparationId:
    string;

  readonly recommendationTwoPreparationDigest:
    string;

  readonly sourceRecommendationReviewDecisionId:
    string;

  readonly sourceRecommendationReviewDecisionDigest:
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
    RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecisionType;

  readonly nextRecommendationPreparationApproved:
    boolean;

  readonly recommendationThreeExecutionAuthorized:
    false;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "MISSING_FACT_CLARIFICATION";

    reviewedRecommendationSequence:
      2;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacity:
      1;

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
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION";

    verifiedFacts:
      readonly string[];

    missingFacts:
      readonly string[];

    clarifyingQuestions:
      readonly string[];

    assumptionsMade:
      false;

    missingFactsExplicit:
      true;

    verifiedFactsSeparatedFromAssumptions:
      true;

    uncertaintyPreserved:
      true;

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

    recommendationTwoReviewed:
      true;

    nextRecommendationPreparationAuthorized:
      boolean;

    recommendationThreePreparationPerformed:
      false;

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
    | "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATIONS_ONE_AND_TWO_ONLY";

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

const EXPECTED_VERIFIED_FACTS = [
  "The synthetic business requested an implementation recommendation.",
  "The recommendation must remain owner-reviewed before any further action.",
] as const;

const EXPECTED_MISSING_FACTS = [
  "Approved budget range",
  "Required implementation timeline",
  "Primary decision criteria",
] as const;

const EXPECTED_CLARIFYING_QUESTIONS = [
  "What budget range has the owner approved?",
  "What implementation deadline must the option satisfy?",
  "Which decision criterion has the highest priority?",
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
      "Unsupported deterministic Riya recommendation two review value.",
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
      "Riya recommendation two review reason is invalid.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Riya recommendation two review reason contains secret-bearing content.",
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

function sameStringArray(
  actual:
    readonly string[],
  expected:
    readonly string[],
): boolean {
  return (
    actual.length ===
      expected.length &&
    actual.every(
      (value, index) =>
        value ===
        expected[index],
    )
  );
}

function validateSourceExecution(
  source:
    RiyaLimitedInternalPilotRecommendationTwoExecution,
): void {
  validateRiyaLimitedInternalPilotRecommendationTwoExecution(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 66 Riya recommendation two execution",
    source,
    "executionDigest",
  );

  if (
    source.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTED" ||
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
      "MISSING_FACT_CLARIFICATION" ||
    source.pilotRecommendation.recommendationSequence !==
      2 ||
    source.pilotRecommendation.remainingRecommendationCapacity !==
      1 ||
    source.recommendationDraft.recommendationOutcome !==
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    source.recommendationDraft.assumptionsMade !==
      false ||
    source.recommendationDraft.missingFactsExplicit !==
      true ||
    source.recommendationDraft.verifiedFactsSeparatedFromAssumptions !==
      true ||
    source.recommendationDraft.uncertaintyPreserved !==
      true ||
    source.executionBoundary.recommendationTwoExecutionPerformed !==
      true ||
    source.executionBoundary.ownerReviewRequired !==
      true ||
    source.executionBoundary.limitedInternalPilotCompleted !==
      false ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 66 Riya recommendation two execution is required.",
    );
  }
}

export function validateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Riya recommendation two review decision identity",
        decision.decisionId,
      ],
      [
        "Riya recommendation two execution identity",
        decision.limitedInternalPilotRecommendationTwoExecutionId,
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
        decision.sourceRecommendationReviewDecisionId,
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
        "Riya recommendation two execution digest",
        decision.limitedInternalPilotRecommendationTwoExecutionDigest,
      ],
      [
        "Riya recommendation two owner decision digest",
        decision.ownerRecommendationTwoExecutionDecisionDigest,
      ],
      [
        "Riya recommendation two preparation digest",
        decision.recommendationTwoPreparationDigest,
      ],
      [
        "Riya recommendation one review decision digest",
        decision.sourceRecommendationReviewDecisionDigest,
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
    "Riya recommendation two review decision time",
    decision.decidedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation two review decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_RECORDED" ||
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
      "Riya recommendation two review identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATIONS_ONE_AND_TWO_ONLY"
  ) {
    throw new Error(
      "Riya recommendation two review decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION";

  if (
    decision.nextRecommendationPreparationApproved !==
      approved ||
    decision.recommendationThreeExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Riya recommendation three continuation authority is invalid.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "MISSING_FACT_CLARIFICATION" ||
    evidence.reviewedRecommendationSequence !==
      2 ||
    evidence.maximumRecommendationCount !==
      3 ||
    evidence.remainingRecommendationCapacity !==
      1 ||
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
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    !sameStringArray(
      evidence.verifiedFacts,
      EXPECTED_VERIFIED_FACTS,
    ) ||
    !sameStringArray(
      evidence.missingFacts,
      EXPECTED_MISSING_FACTS,
    ) ||
    !sameStringArray(
      evidence.clarifyingQuestions,
      EXPECTED_CLARIFYING_QUESTIONS,
    ) ||
    evidence.assumptionsMade !==
      false ||
    evidence.missingFactsExplicit !==
      true ||
    evidence.verifiedFactsSeparatedFromAssumptions !==
      true ||
    evidence.uncertaintyPreserved !==
      true ||
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
      "Riya recommendation two reviewed evidence is invalid.",
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
    boundary.recommendationTwoReviewed !==
      true ||
    boundary.nextRecommendationPreparationAuthorized !==
      approved ||
    boundary.recommendationThreePreparationPerformed !==
      false ||
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
      "Riya recommendation two review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE"
      : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATIONS_ONE_AND_TWO_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Riya recommendation two review next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence
        .verifiedFacts,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence
        .missingFacts,
    ) ||
    !Object.isFrozen(
      decision.reviewedEvidence
        .clarifyingQuestions,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation two review decision must be deeply frozen.",
    );
  }
}

export function createRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
  input:
    CreateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecisionInput,
): RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision {
  const source =
    input.limitedInternalPilotRecommendationTwoExecution;

  validateSourceExecution(
    source,
  );

  requireSafeIdentifier(
    "Riya recommendation two review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation two review owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Riya recommendation two review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Riya recommendation-two-execution-bound owner can issue the review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION" &&
    input.decision !==
      "REJECT_AND_RETAIN_RECOMMENDATIONS_ONE_AND_TWO_ONLY"
  ) {
    throw new Error(
      "Riya recommendation two review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Riya recommendation two review decision cannot precede recommendation two execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION";

  const decisionCore = {
    version:
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW_RECORDED" as const,

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

    limitedInternalPilotRecommendationTwoExecutionId:
      source.executionId,

    limitedInternalPilotRecommendationTwoExecutionDigest:
      source.executionDigest,

    ownerRecommendationTwoExecutionDecisionId:
      source.ownerRecommendationTwoExecutionDecisionId,

    ownerRecommendationTwoExecutionDecisionDigest:
      source.ownerRecommendationTwoExecutionDecisionDigest,

    recommendationTwoPreparationId:
      source.recommendationTwoPreparationId,

    recommendationTwoPreparationDigest:
      source.recommendationTwoPreparationDigest,

    sourceRecommendationReviewDecisionId:
      source.sourceRecommendationReviewDecisionId,

    sourceRecommendationReviewDecisionDigest:
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

    tenantId:
      source.tenantId,

    ownerId:
      input.ownerId,

    decision:
      input.decision,

    nextRecommendationPreparationApproved:
      approved,

    recommendationThreeExecutionAuthorized:
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

      recommendationToolMode:
        source.pilotRecommendation.recommendationToolMode,

      executionMode:
        source.pilotRecommendation.executionMode,

      recommendationStatus:
        source.recommendationDraft.recommendationStatus,

      recommendationOutcome:
        source.recommendationDraft.recommendationOutcome,

      verifiedFacts:
        [...source.recommendationDraft.verifiedFacts],

      missingFacts:
        [...source.recommendationDraft.missingFacts],

      clarifyingQuestions:
        [...source.recommendationDraft.clarifyingQuestions],

      assumptionsMade:
        source.recommendationDraft.assumptionsMade,

      missingFactsExplicit:
        source.recommendationDraft.missingFactsExplicit,

      verifiedFactsSeparatedFromAssumptions:
        source.recommendationDraft.verifiedFactsSeparatedFromAssumptions,

      uncertaintyPreserved:
        source.recommendationDraft.uncertaintyPreserved,

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

      recommendationTwoReviewed:
        true as const,

      nextRecommendationPreparationAuthorized:
        approved,

      recommendationThreePreparationPerformed:
        false as const,

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
      approved
        ? "PREPARE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_RECOMMENDATIONS_ONE_AND_TWO_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as RiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision;

  validateRiyaOwnerLimitedInternalPilotRecommendationTwoReviewDecision(
    decision,
  );

  return decision;
}