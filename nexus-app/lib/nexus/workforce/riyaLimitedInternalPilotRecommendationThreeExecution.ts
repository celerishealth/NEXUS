import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationThreePreparation,
  type RiyaLimitedInternalPilotRecommendationThreePreparation,
} from "./riyaLimitedInternalPilotRecommendationThreePreparation";

import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION,
  validateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
  type RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
} from "./riyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision";

export const RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION =
  "nexus-riya-limited-internal-pilot-recommendation-three-execution-v1" as const;

export interface ExecuteRiyaLimitedInternalPilotRecommendationThreeInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotRecommendationThreeExecutionDecision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision;

  readonly limitedInternalPilotRecommendationThreePreparation:
    RiyaLimitedInternalPilotRecommendationThreePreparation;

  readonly executedAt:
    string;
}

export interface RiyaLimitedInternalPilotRecommendationThreeExecution {
  readonly version:
    typeof RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTED";

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

  readonly pilotRecommendation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF";

    recommendationSequence:
      3;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacity:
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

    recommendationToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";
  }>;

  readonly syntheticInquiryEvidence: Readonly<{
    evidenceClass:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryId:
      "synthetic-riya-pilot-inquiry-three";

    request:
      "Compare two conflicting implementation options and prepare a bounded recommendation with explicit tradeoffs.";

    verifiedFacts:
      readonly string[];

    conflictingConstraints:
      readonly string[];

    unsupportedFactsInvented:
      false;

    crossCustomerEvidenceUsed:
      false;

    crossTenantEvidenceUsed:
      false;
  }>;

  readonly syntheticCustomerContext: Readonly<{
    contextClass:
      "SYNTHETIC_SANITIZED_ONLY";

    contextId:
      "synthetic-riya-pilot-customer-context-three";

    verifiedContext:
      readonly string[];

    unavailableContext:
      readonly string[];

    realCustomerDataUsed:
      false;

    crossCustomerContextUsed:
      false;

    crossTenantContextUsed:
      false;
  }>;

  readonly recommendationDraft: Readonly<{
    recommendationStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    recommendationOutcome:
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS";

    draftSummary:
      "Option A is preferred for the synthetic case because it provides the safer reversible starting point while preserving an explicit upgrade path.";

    options:
      readonly Readonly<{
        optionId:
          | "OPTION_A_BOUNDED_SIMPLE_ROLLOUT"
          | "OPTION_B_HIGH_CAPACITY_ROLLOUT";

        summary:
          string;

        benefits:
          readonly string[];

        tradeoffs:
          readonly string[];

        riskLevel:
          "LOW" | "MEDIUM";
      }>[];

    preferredOptionId:
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT";

    rationale:
      readonly string[];

    uncertainties:
      readonly string[];

    nextAction:
      "Owner reviews both options and decides whether to approve, reject, or request revision.";

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
  }>;

  readonly executionBoundary: Readonly<{
    ownerExecutionApprovalBound:
      true;

    sourceDecisionIntegrityVerified:
      true;

    sourcePreparationBound:
      true;

    sourcePreparationIntegrityVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    recommendationSequenceEnforced:
      true;

    maximumRecommendationCountPreserved:
      true;

    recommendationCapacityExhausted:
      true;

    concurrentRecommendationLimitEnforced:
      true;

    failureThresholdPreserved:
      true;

    recommendationCreatorInvocationCount:
      1;

    recommendationThreeExecutionPerformed:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticRecommendationExecutionPerformed:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticCustomerContextRead:
      true;

    tradeoffDraftCreated:
      true;

    unsupportedFactGenerationBlocked:
      true;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

    recommendationCustomerDeliveryAuthorized:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;

    realCustomerDataUsed:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
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

const VERIFIED_FACTS = [
  "Option A requires fewer setup steps and has lower initial operational complexity.",
  "Option B provides greater scaling headroom but introduces more dependencies.",
  "The synthetic case requires a reversible owner-controlled first step.",
] as const;

const CONFLICTING_CONSTRAINTS = [
  "Lower initial complexity conflicts with maximum scaling headroom.",
  "Faster bounded adoption conflicts with broader implementation scope.",
] as const;

const VERIFIED_CONTEXT = [
  "The owner prioritizes safety, reversibility, and clear operational control.",
  "No external delivery or production mutation is authorized.",
] as const;

const UNAVAILABLE_CONTEXT = [
  "No verified evidence establishes that immediate maximum capacity is required.",
] as const;

const OPTIONS = [
  {
    optionId:
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" as const,

    summary:
      "Begin with a bounded reversible rollout using the minimum required dependencies.",

    benefits: [
      "Lower initial operational complexity.",
      "Clearer rollback path.",
      "Stronger alignment with owner-controlled adoption.",
    ],

    tradeoffs: [
      "Lower initial scaling headroom.",
      "A later controlled upgrade may be required.",
    ],

    riskLevel:
      "LOW" as const,
  },
  {
    optionId:
      "OPTION_B_HIGH_CAPACITY_ROLLOUT" as const,

    summary:
      "Begin with a broader high-capacity rollout using additional dependencies.",

    benefits: [
      "Greater initial scaling headroom.",
      "Fewer capacity changes if future demand is verified.",
    ],

    tradeoffs: [
      "Higher initial complexity.",
      "More dependencies and a more demanding rollback path.",
    ],

    riskLevel:
      "MEDIUM" as const,
  },
] as const;

const RATIONALE = [
  "Option A satisfies the verified need for a reversible owner-controlled first step.",
  "Option B's additional capacity is not currently supported by verified demand evidence.",
  "The recommendation preserves an explicit upgrade path instead of making an irreversible early commitment.",
] as const;

const UNCERTAINTIES = [
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
      "Unsupported deterministic Riya recommendation three execution value.",
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
      `${label} contains a credential-bearing term.`,
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

function sameValue(
  left: unknown,
  right: unknown,
): boolean {
  return (
    stableStringify(left) ===
    stableStringify(right)
  );
}

function validateSourceBindings(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision,
  preparation:
    RiyaLimitedInternalPilotRecommendationThreePreparation,
): void {
  validateRiyaOwnerLimitedInternalPilotRecommendationThreeExecutionDecision(
    decision,
  );

  validateRiyaLimitedInternalPilotRecommendationThreePreparation(
    preparation,
  );

  verifyDigestBoundObject(
    "Workforce Day 69 Riya recommendation three execution decision",
    decision,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Workforce Day 68 Riya recommendation three preparation",
    preparation,
    "preparationDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION_RECORDED" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION" ||
    decision.recommendationThreeExecutionAuthorized !==
      true ||
    decision.recommendationThreeExecutionPerformed !==
      false ||
    decision.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE"
  ) {
    throw new Error(
      "Riya recommendation three execution requires an approved Workforce Day 69 owner decision.",
    );
  }

  if (
    preparation.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_PREPARED" ||
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Riya recommendation three execution requires the exact Workforce Day 68 preparation.",
    );
  }

  if (
    decision.preparationId !==
      preparation.preparationId ||
    decision.preparationDigest !==
      preparation.preparationDigest ||
    decision.employeeId !==
      preparation.employeeId ||
    decision.templateId !==
      preparation.templateId ||
    decision.employeeCode !==
      preparation.employeeCode ||
    decision.tenantId !==
      preparation.tenantId ||
    decision.ownerId !==
      preparation.ownerId ||
    decision.sourceRecommendationTwoReviewDecisionId !==
      preparation.sourceRecommendationTwoReviewDecisionId ||
    decision.sourceRecommendationTwoReviewDecisionDigest !==
      preparation.sourceRecommendationTwoReviewDecisionDigest ||
    decision.sourceRecommendationTwoExecutionId !==
      preparation.sourceRecommendationTwoExecutionId ||
    decision.sourceRecommendationTwoExecutionDigest !==
      preparation.sourceRecommendationTwoExecutionDigest ||
    decision.ownerRecommendationTwoExecutionDecisionId !==
      preparation.ownerRecommendationTwoExecutionDecisionId ||
    decision.ownerRecommendationTwoExecutionDecisionDigest !==
      preparation.ownerRecommendationTwoExecutionDecisionDigest ||
    decision.recommendationTwoPreparationId !==
      preparation.recommendationTwoPreparationId ||
    decision.recommendationTwoPreparationDigest !==
      preparation.recommendationTwoPreparationDigest ||
    decision.sourceRecommendationOneReviewDecisionId !==
      preparation.sourceRecommendationOneReviewDecisionId ||
    decision.sourceRecommendationOneReviewDecisionDigest !==
      preparation.sourceRecommendationOneReviewDecisionDigest ||
    decision.sourceRecommendationOneExecutionId !==
      preparation.sourceRecommendationOneExecutionId ||
    decision.sourceRecommendationOneExecutionDigest !==
      preparation.sourceRecommendationOneExecutionDigest ||
    decision.initialOwnerPilotExecutionDecisionId !==
      preparation.initialOwnerPilotExecutionDecisionId ||
    decision.initialOwnerPilotExecutionDecisionDigest !==
      preparation.initialOwnerPilotExecutionDecisionDigest ||
    decision.initialPilotPreparationId !==
      preparation.initialPilotPreparationId ||
    decision.initialPilotPreparationDigest !==
      preparation.initialPilotPreparationDigest ||
    decision.controlledShadowExecutionId !==
      preparation.controlledShadowExecutionId ||
    decision.controlledShadowExecutionDigest !==
      preparation.controlledShadowExecutionDigest
  ) {
    throw new Error(
      "Riya recommendation three source binding verification failed.",
    );
  }

  if (
    !sameValue(
      decision.reviewedPreparation,
      {
        ...preparation.preparedRecommendation,
        ...preparation.specialistExpectation,
      },
    )
  ) {
    throw new Error(
      "Riya recommendation three reviewed preparation binding is invalid.",
    );
  }
}

export function validateRiyaLimitedInternalPilotRecommendationThreeExecution(
  execution:
    RiyaLimitedInternalPilotRecommendationThreeExecution,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Riya recommendation three execution identity",
        execution.executionId,
      ],
      [
        "Riya recommendation three owner decision identity",
        execution.ownerRecommendationThreeExecutionDecisionId,
      ],
      [
        "Riya recommendation three preparation identity",
        execution.recommendationThreePreparationId,
      ],
      [
        "Riya recommendation two review decision identity",
        execution.sourceRecommendationTwoReviewDecisionId,
      ],
      [
        "Riya recommendation two execution identity",
        execution.sourceRecommendationTwoExecutionId,
      ],
      [
        "Riya recommendation two owner decision identity",
        execution.ownerRecommendationTwoExecutionDecisionId,
      ],
      [
        "Riya recommendation two preparation identity",
        execution.recommendationTwoPreparationId,
      ],
      [
        "Riya recommendation one review decision identity",
        execution.sourceRecommendationOneReviewDecisionId,
      ],
      [
        "Riya recommendation one execution identity",
        execution.sourceRecommendationOneExecutionId,
      ],
      [
        "Riya initial owner decision identity",
        execution.initialOwnerPilotExecutionDecisionId,
      ],
      [
        "Riya initial pilot preparation identity",
        execution.initialPilotPreparationId,
      ],
      [
        "Riya controlled shadow execution identity",
        execution.controlledShadowExecutionId,
      ],
      [
        "Riya tenant identity",
        execution.tenantId,
      ],
      [
        "Riya owner identity",
        execution.ownerId,
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
        "Riya recommendation three owner decision digest",
        execution.ownerRecommendationThreeExecutionDecisionDigest,
      ],
      [
        "Riya recommendation three preparation digest",
        execution.recommendationThreePreparationDigest,
      ],
      [
        "Riya recommendation two review decision digest",
        execution.sourceRecommendationTwoReviewDecisionDigest,
      ],
      [
        "Riya recommendation two execution digest",
        execution.sourceRecommendationTwoExecutionDigest,
      ],
      [
        "Riya recommendation two owner decision digest",
        execution.ownerRecommendationTwoExecutionDecisionDigest,
      ],
      [
        "Riya recommendation two preparation digest",
        execution.recommendationTwoPreparationDigest,
      ],
      [
        "Riya recommendation one review decision digest",
        execution.sourceRecommendationOneReviewDecisionDigest,
      ],
      [
        "Riya recommendation one execution digest",
        execution.sourceRecommendationOneExecutionDigest,
      ],
      [
        "Riya initial owner decision digest",
        execution.initialOwnerPilotExecutionDecisionDigest,
      ],
      [
        "Riya initial pilot preparation digest",
        execution.initialPilotPreparationDigest,
      ],
      [
        "Riya controlled shadow execution digest",
        execution.controlledShadowExecutionDigest,
      ],
      [
        "Riya recommendation three execution digest",
        execution.executionDigest,
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
    "Riya recommendation three execution time",
    execution.executedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation three execution",
    execution,
    "executionDigest",
  );

  if (
    execution.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION ||
    execution.executionState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTED" ||
    execution.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    execution.templateId !==
      EXPECTED_TEMPLATE_ID ||
    execution.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    execution.displayName !==
      EXPECTED_DISPLAY_NAME ||
    execution.role !==
      EXPECTED_ROLE ||
    execution.department !==
      EXPECTED_DEPARTMENT ||
    execution.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Riya recommendation three execution identity is invalid.",
    );
  }

  const pilot =
    execution.pilotRecommendation;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" ||
    pilot.recommendationSequence !==
      3 ||
    pilot.maximumRecommendationCount !==
      3 ||
    pilot.remainingRecommendationCapacity !==
      0 ||
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
      "Riya recommendation three pilot scope is invalid.",
    );
  }

  const evidence =
    execution.syntheticInquiryEvidence;

  if (
    evidence.evidenceClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryId !==
      "synthetic-riya-pilot-inquiry-three" ||
    evidence.request !==
      "Compare two conflicting implementation options and prepare a bounded recommendation with explicit tradeoffs." ||
    !sameValue(
      evidence.verifiedFacts,
      VERIFIED_FACTS,
    ) ||
    !sameValue(
      evidence.conflictingConstraints,
      CONFLICTING_CONSTRAINTS,
    ) ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.crossCustomerEvidenceUsed !==
      false ||
    evidence.crossTenantEvidenceUsed !==
      false
  ) {
    throw new Error(
      "Riya recommendation three synthetic inquiry evidence is invalid.",
    );
  }

  const context =
    execution.syntheticCustomerContext;

  if (
    context.contextClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    context.contextId !==
      "synthetic-riya-pilot-customer-context-three" ||
    !sameValue(
      context.verifiedContext,
      VERIFIED_CONTEXT,
    ) ||
    !sameValue(
      context.unavailableContext,
      UNAVAILABLE_CONTEXT,
    ) ||
    context.realCustomerDataUsed !==
      false ||
    context.crossCustomerContextUsed !==
      false ||
    context.crossTenantContextUsed !==
      false
  ) {
    throw new Error(
      "Riya recommendation three synthetic customer context is invalid.",
    );
  }

  const draft =
    execution.recommendationDraft;

  if (
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.recommendationOutcome !==
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" ||
    draft.draftSummary !==
      "Option A is preferred for the synthetic case because it provides the safer reversible starting point while preserving an explicit upgrade path." ||
    !sameValue(
      draft.options,
      OPTIONS,
    ) ||
    draft.preferredOptionId !==
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" ||
    !sameValue(
      draft.rationale,
      RATIONALE,
    ) ||
    !sameValue(
      draft.uncertainties,
      UNCERTAINTIES,
    ) ||
    draft.nextAction !==
      "Owner reviews both options and decides whether to approve, reject, or request revision." ||
    draft.ownerDecisionReserved !==
      true ||
    draft.assumptionsMade !==
      false ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.urgencyExaggerated !==
      false ||
    draft.guaranteeMade !==
      false ||
    draft.transparentAIIdentity !==
      true ||
    draft.ownerDecisionMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Riya recommendation three tradeoff draft is invalid.",
    );
  }

  const boundary =
    execution.executionBoundary;

  if (
    boundary.ownerExecutionApprovalBound !==
      true ||
    boundary.sourceDecisionIntegrityVerified !==
      true ||
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
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
    boundary.recommendationCapacityExhausted !==
      true ||
    boundary.concurrentRecommendationLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.recommendationCreatorInvocationCount !==
      1 ||
    boundary.recommendationThreeExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticRecommendationExecutionPerformed !==
      true ||
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticCustomerContextRead !==
      true ||
    boundary.tradeoffDraftCreated !==
      true ||
    boundary.unsupportedFactGenerationBlocked !==
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
      "Riya recommendation three execution authority boundary is invalid.",
    );
  }

  if (
    execution.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW"
  ) {
    throw new Error(
      "Riya recommendation three execution next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.pilotRecommendation,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence
        .verifiedFacts,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence
        .conflictingConstraints,
    ) ||
    !Object.isFrozen(
      execution.syntheticCustomerContext,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft.options,
    ) ||
    !execution.recommendationDraft.options.every(
      (option) =>
        Object.isFrozen(option) &&
        Object.isFrozen(option.benefits) &&
        Object.isFrozen(option.tradeoffs),
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft.rationale,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft.uncertainties,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation three execution must be deeply frozen.",
    );
  }
}

export async function executeRiyaLimitedInternalPilotRecommendationThree(
  input:
    ExecuteRiyaLimitedInternalPilotRecommendationThreeInput,
): Promise<RiyaLimitedInternalPilotRecommendationThreeExecution> {
  requireSafeIdentifier(
    "Riya recommendation three execution identity",
    input.executionId,
  );

  requireIsoTimestamp(
    "Riya recommendation three execution time",
    input.executedAt,
  );

  const decision =
    input.ownerLimitedInternalPilotRecommendationThreeExecutionDecision;

  const preparation =
    input.limitedInternalPilotRecommendationThreePreparation;

  validateSourceBindings(
    decision,
    preparation,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Riya recommendation three execution cannot precede owner approval.",
    );
  }

  let recommendationCreatorInvocationCount =
    0;

  recommendationCreatorInvocationCount +=
    1;

  if (
    recommendationCreatorInvocationCount >
    preparation.preparedRecommendation
      .concurrentRecommendationLimit
  ) {
    throw new Error(
      "Riya recommendation three concurrent execution limit was exceeded.",
    );
  }

  if (
    recommendationCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Riya recommendation three creator must execute exactly once.",
    );
  }

  const executionCore = {
    version:
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_EXECUTED" as const,

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

    ownerRecommendationThreeExecutionDecisionId:
      decision.decisionId,

    ownerRecommendationThreeExecutionDecisionDigest:
      decision.decisionDigest,

    recommendationThreePreparationId:
      preparation.preparationId,

    recommendationThreePreparationDigest:
      preparation.preparationDigest,

    sourceRecommendationTwoReviewDecisionId:
      preparation.sourceRecommendationTwoReviewDecisionId,

    sourceRecommendationTwoReviewDecisionDigest:
      preparation.sourceRecommendationTwoReviewDecisionDigest,

    sourceRecommendationTwoExecutionId:
      preparation.sourceRecommendationTwoExecutionId,

    sourceRecommendationTwoExecutionDigest:
      preparation.sourceRecommendationTwoExecutionDigest,

    ownerRecommendationTwoExecutionDecisionId:
      preparation.ownerRecommendationTwoExecutionDecisionId,

    ownerRecommendationTwoExecutionDecisionDigest:
      preparation.ownerRecommendationTwoExecutionDecisionDigest,

    recommendationTwoPreparationId:
      preparation.recommendationTwoPreparationId,

    recommendationTwoPreparationDigest:
      preparation.recommendationTwoPreparationDigest,

    sourceRecommendationOneReviewDecisionId:
      preparation.sourceRecommendationOneReviewDecisionId,

    sourceRecommendationOneReviewDecisionDigest:
      preparation.sourceRecommendationOneReviewDecisionDigest,

    sourceRecommendationOneExecutionId:
      preparation.sourceRecommendationOneExecutionId,

    sourceRecommendationOneExecutionDigest:
      preparation.sourceRecommendationOneExecutionDigest,

    initialOwnerPilotExecutionDecisionId:
      preparation.initialOwnerPilotExecutionDecisionId,

    initialOwnerPilotExecutionDecisionDigest:
      preparation.initialOwnerPilotExecutionDecisionDigest,

    initialPilotPreparationId:
      preparation.initialPilotPreparationId,

    initialPilotPreparationDigest:
      preparation.initialPilotPreparationDigest,

    controlledShadowExecutionId:
      preparation.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      preparation.controlledShadowExecutionDigest,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    pilotRecommendation: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      scenarioId:
        "CONFLICTING_OPTIONS_TRADEOFF_BRIEF" as const,

      recommendationSequence:
        3 as const,

      maximumRecommendationCount:
        3 as const,

      remainingRecommendationCapacity:
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

      recommendationToolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    syntheticInquiryEvidence: {
      evidenceClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryId:
        "synthetic-riya-pilot-inquiry-three" as const,

      request:
        "Compare two conflicting implementation options and prepare a bounded recommendation with explicit tradeoffs." as const,

      verifiedFacts:
        [...VERIFIED_FACTS],

      conflictingConstraints:
        [...CONFLICTING_CONSTRAINTS],

      unsupportedFactsInvented:
        false as const,

      crossCustomerEvidenceUsed:
        false as const,

      crossTenantEvidenceUsed:
        false as const,
    },

    syntheticCustomerContext: {
      contextClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      contextId:
        "synthetic-riya-pilot-customer-context-three" as const,

      verifiedContext:
        [...VERIFIED_CONTEXT],

      unavailableContext:
        [...UNAVAILABLE_CONTEXT],

      realCustomerDataUsed:
        false as const,

      crossCustomerContextUsed:
        false as const,

      crossTenantContextUsed:
        false as const,
    },

    recommendationDraft: {
      recommendationStatus:
        "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

      recommendationOutcome:
        "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" as const,

      draftSummary:
        "Option A is preferred for the synthetic case because it provides the safer reversible starting point while preserving an explicit upgrade path." as const,

      options:
        OPTIONS.map(
          (option) => ({
            ...option,

            benefits:
              [...option.benefits],

            tradeoffs:
              [...option.tradeoffs],
          }),
        ),

      preferredOptionId:
        "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" as const,

      rationale:
        [...RATIONALE],

      uncertainties:
        [...UNCERTAINTIES],

      nextAction:
        "Owner reviews both options and decides whether to approve, reject, or request revision." as const,

      ownerDecisionReserved:
        true as const,

      assumptionsMade:
        false as const,

      unsupportedClaimsIncluded:
        false as const,

      urgencyExaggerated:
        false as const,

      guaranteeMade:
        false as const,

      transparentAIIdentity:
        true as const,

      ownerDecisionMade:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,
    },

    executionBoundary: {
      ownerExecutionApprovalBound:
        true as const,

      sourceDecisionIntegrityVerified:
        true as const,

      sourcePreparationBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      recommendationSequenceEnforced:
        true as const,

      maximumRecommendationCountPreserved:
        true as const,

      recommendationCapacityExhausted:
        true as const,

      concurrentRecommendationLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      recommendationCreatorInvocationCount:
        recommendationCreatorInvocationCount as 1,

      recommendationThreeExecutionPerformed:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticRecommendationExecutionPerformed:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticCustomerContextRead:
        true as const,

      tradeoffDraftCreated:
        true as const,

      unsupportedFactGenerationBlocked:
        true as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      recommendationCustomerDeliveryAuthorized:
        false as const,

      customerDeliveryPrepared:
        false as const,

      customerDeliveryExecuted:
        false as const,

      realCustomerDataUsed:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_THREE_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as RiyaLimitedInternalPilotRecommendationThreeExecution;

  validateRiyaLimitedInternalPilotRecommendationThreeExecution(
    execution,
  );

  return execution;
}