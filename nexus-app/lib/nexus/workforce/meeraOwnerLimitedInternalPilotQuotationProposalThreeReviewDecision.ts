import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalThreeExecution,
  type MeeraLimitedInternalPilotQuotationProposalThreeExecution,
} from "./meeraLimitedInternalPilotQuotationProposalThreeExecution";

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISION_VERSION =
  "nexus-meera-owner-limited-internal-pilot-quotation-proposal-three-review-decision-v1" as const;

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION",
  "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_THREE_ONLY",
] as const;

export type MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecisionType =
  (
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISIONS
  )[number];

export interface CreateMeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecisionInput {
  readonly limitedInternalPilotQuotationProposalThreeExecution:
    MeeraLimitedInternalPilotQuotationProposalThreeExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision {
  readonly version:
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_RECORDED";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly templateId:
    "template-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly displayName:
    "Meera";

  readonly role:
    "AI Quotation & Proposal Specialist";

  readonly department:
    "SALES";

  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";

  readonly limitedInternalPilotQuotationProposalThreeExecutionId:
    string;

  readonly limitedInternalPilotQuotationProposalThreeExecutionDigest:
    string;

  readonly ownerQuotationProposalThreeExecutionDecisionId:
    string;

  readonly ownerQuotationProposalThreeExecutionDecisionDigest:
    string;

  readonly quotationProposalThreePreparationId:
    string;

  readonly quotationProposalThreePreparationDigest:
    string;

  readonly sourceQuotationProposalTwoReviewDecisionId:
    string;

  readonly sourceQuotationProposalTwoReviewDecisionDigest:
    string;

  readonly sourceQuotationProposalTwoExecutionId:
    string;

  readonly sourceQuotationProposalTwoExecutionDigest:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionId:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionDigest:
    string;

  readonly quotationProposalTwoPreparationId:
    string;

  readonly quotationProposalTwoPreparationDigest:
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
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecisionType;

  readonly limitedInternalPilotCompleted:
    boolean;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "CONFLICTING_COMMERCIAL_OPTIONS";

    reviewedQuotationProposalSequence:
      3;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacity:
      0;

    ownerReviewFrequency:
      "AFTER_EVERY_QUOTATION_PROPOSAL";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    recommendationEvidenceToolMode:
      "READ_ONLY";

    quotationProposalToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    quotationProposalStatus:
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

    quotationProposalOneReviewed:
      true;

    quotationProposalTwoReviewed:
      true;

    quotationProposalThreeReviewed:
      true;

    finalQuotationProposalSequenceReached:
      true;

    quotationProposalCapacityExhausted:
      true;

    limitedInternalPilotCompleted:
      boolean;

    furtherQuotationProposalPreparationAuthorized:
      false;

    furtherQuotationProposalExecutionAuthorized:
      false;

    concurrentQuotationProposalExecutionAuthorized:
      false;

    quotationProposalCustomerDeliveryAuthorized:
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

    ownerReviewAfterEveryQuotationProposal:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    | "LIMITED_INTERNAL_PILOT_COMPLETE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_ONLY";

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
  "employee-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-meera-quotation-proposal-specialist-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-005" as const;

const EXPECTED_DISPLAY_NAME =
  "Meera" as const;

const EXPECTED_ROLE =
  "AI Quotation & Proposal Specialist" as const;

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
  "The quotationProposal preserves an explicit upgrade path instead of making an irreversible early commitment.",
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
      "Unsupported deterministic Meera quotationProposal three review value.",
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
      "Meera quotationProposal three review reason is invalid.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(value)
  ) {
    throw new Error(
      "Meera quotationProposal three review reason contains secret-bearing content.",
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
    MeeraLimitedInternalPilotQuotationProposalThreeExecution,
): void {
  validateMeeraLimitedInternalPilotQuotationProposalThreeExecution(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 104 Meera quotationProposal three execution",
    source,
    "executionDigest",
  );

  if (
    source.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTED" ||
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
      "CONFLICTING_COMMERCIAL_OPTIONS" ||
    source.pilotRecommendation.quotationProposalSequence !==
      3 ||
    source.pilotRecommendation.maximumQuotationProposalCount !==
      3 ||
    source.pilotRecommendation.remainingQuotationProposalCapacity !==
      0 ||
    source.quotationProposalDraft.quotationProposalStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    source.quotationProposalDraft.recommendationOutcome !==
      "BOUNDED_OPTION_RECOMMENDED_WITH_EXPLICIT_TRADEOFFS" ||
    source.quotationProposalDraft.preferredOptionId !==
      "OPTION_A_BOUNDED_SIMPLE_ROLLOUT" ||
    source.quotationProposalDraft.ownerDecisionReserved !==
      true ||
    source.quotationProposalDraft.ownerDecisionMade !==
      false ||
    source.executionBoundary.quotationProposalCapacityExhausted !==
      true ||
    source.executionBoundary.quotationProposalThreeExecutionPerformed !==
      true ||
    source.executionBoundary.limitedInternalPilotCompleted !==
      false ||
    source.executionBoundary.ownerReviewRequired !==
      true ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 104 Meera quotationProposal three execution is required.",
    );
  }
}

export function validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision(
  decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Meera quotationProposal three review decision identity",
        decision.decisionId,
      ],
      [
        "Meera quotationProposal three execution identity",
        decision.limitedInternalPilotQuotationProposalThreeExecutionId,
      ],
      [
        "Meera quotationProposal three owner execution decision identity",
        decision.ownerQuotationProposalThreeExecutionDecisionId,
      ],
      [
        "Meera quotationProposal three preparation identity",
        decision.quotationProposalThreePreparationId,
      ],
      [
        "Meera quotationProposal two review decision identity",
        decision.sourceQuotationProposalTwoReviewDecisionId,
      ],
      [
        "Meera quotationProposal two execution identity",
        decision.sourceQuotationProposalTwoExecutionId,
      ],
      [
        "Meera quotationProposal two owner execution decision identity",
        decision.ownerQuotationProposalTwoExecutionDecisionId,
      ],
      [
        "Meera quotationProposal two preparation identity",
        decision.quotationProposalTwoPreparationId,
      ],
      [
        "Meera controlled shadow execution identity",
        decision.controlledShadowExecutionId,
      ],
      [
        "Meera tenant identity",
        decision.tenantId,
      ],
      [
        "Meera owner identity",
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
        "Meera quotationProposal three execution digest",
        decision.limitedInternalPilotQuotationProposalThreeExecutionDigest,
      ],
      [
        "Meera quotationProposal three owner execution decision digest",
        decision.ownerQuotationProposalThreeExecutionDecisionDigest,
      ],
      [
        "Meera quotationProposal three preparation digest",
        decision.quotationProposalThreePreparationDigest,
      ],
      [
        "Meera quotationProposal two review decision digest",
        decision.sourceQuotationProposalTwoReviewDecisionDigest,
      ],
      [
        "Meera quotationProposal two execution digest",
        decision.sourceQuotationProposalTwoExecutionDigest,
      ],
      [
        "Meera quotationProposal two owner execution decision digest",
        decision.ownerQuotationProposalTwoExecutionDecisionDigest,
      ],
      [
        "Meera quotationProposal two preparation digest",
        decision.quotationProposalTwoPreparationDigest,
      ],
      [
        "Meera controlled shadow execution digest",
        decision.controlledShadowExecutionDigest,
      ],
      [
        "Meera quotationProposal three review decision digest",
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
    "Meera quotationProposal three review decision time",
    decision.decidedAt,
  );

  verifyDigestBoundObject(
    "Meera quotationProposal three review decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_RECORDED" ||
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
      "Meera quotationProposal three review identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_THREE_ONLY"
  ) {
    throw new Error(
      "Meera quotationProposal three review decision is invalid.",
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
      "Meera limited internal pilot completion state is invalid.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "CONFLICTING_COMMERCIAL_OPTIONS" ||
    evidence.reviewedQuotationProposalSequence !==
      3 ||
    evidence.maximumQuotationProposalCount !==
      3 ||
    evidence.remainingQuotationProposalCapacity !==
      0 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.quotationProposalStatus !==
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
      "Meera quotationProposal three reviewed evidence is invalid.",
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
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.quotationProposalTwoReviewed !==
      true ||
    boundary.quotationProposalThreeReviewed !==
      true ||
    boundary.finalQuotationProposalSequenceReached !==
      true ||
    boundary.quotationProposalCapacityExhausted !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      approved ||
    boundary.furtherQuotationProposalPreparationAuthorized !==
      false ||
    boundary.furtherQuotationProposalExecutionAuthorized !==
      false ||
    boundary.concurrentQuotationProposalExecutionAuthorized !==
      false ||
    boundary.quotationProposalCustomerDeliveryAuthorized !==
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
    boundary.ownerReviewAfterEveryQuotationProposal !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Meera quotationProposal three review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "LIMITED_INTERNAL_PILOT_COMPLETE"
      : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Meera quotationProposal three review next step is invalid.",
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
      "Meera quotationProposal three review decision must be deeply frozen.",
    );
  }
}

export function createMeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision(
  input:
    CreateMeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecisionInput,
): MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision {
  const source =
    input.limitedInternalPilotQuotationProposalThreeExecution;

  validateSourceExecution(
    source,
  );

  requireSafeIdentifier(
    "Meera quotationProposal three review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotationProposal three review owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Meera quotationProposal three review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the quotationProposal-three-execution-bound owner can issue the final review decision.",
    );
  }

  if (
    !MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISIONS.includes(
      input.decision,
    )
  ) {
    throw new Error(
      "Meera quotationProposal three review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Meera quotationProposal three review decision cannot precede quotationProposal three execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_COMPLETION";

  const decisionCore = {
    version:
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW_RECORDED" as const,

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

    limitedInternalPilotQuotationProposalThreeExecutionId:
      source.executionId,

    limitedInternalPilotQuotationProposalThreeExecutionDigest:
      source.executionDigest,

    ownerQuotationProposalThreeExecutionDecisionId:
      source.ownerQuotationProposalThreeExecutionDecisionId,

    ownerQuotationProposalThreeExecutionDecisionDigest:
      source.ownerQuotationProposalThreeExecutionDecisionDigest,

    quotationProposalThreePreparationId:
      source.quotationProposalThreePreparationId,

    quotationProposalThreePreparationDigest:
      source.quotationProposalThreePreparationDigest,

    sourceQuotationProposalTwoReviewDecisionId:
      source.sourceQuotationProposalTwoReviewDecisionId,

    sourceQuotationProposalTwoReviewDecisionDigest:
      source.sourceQuotationProposalTwoReviewDecisionDigest,

    sourceQuotationProposalTwoExecutionId:
      source.sourceQuotationProposalTwoExecutionId,

    sourceQuotationProposalTwoExecutionDigest:
      source.sourceQuotationProposalTwoExecutionDigest,

    ownerQuotationProposalTwoExecutionDecisionId:
      source.ownerQuotationProposalTwoExecutionDecisionId,

    ownerQuotationProposalTwoExecutionDecisionDigest:
      source.ownerQuotationProposalTwoExecutionDecisionDigest,

    quotationProposalTwoPreparationId:
      source.quotationProposalTwoPreparationId,

    quotationProposalTwoPreparationDigest:
      source.quotationProposalTwoPreparationDigest,









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

      reviewedQuotationProposalSequence:
        source.pilotRecommendation.quotationProposalSequence,

      maximumQuotationProposalCount:
        source.pilotRecommendation.maximumQuotationProposalCount,

      remainingQuotationProposalCapacity:
        source.pilotRecommendation.remainingQuotationProposalCapacity,

      ownerReviewFrequency:
        source.pilotRecommendation.ownerReviewFrequency,

      dataClassification:
        source.pilotRecommendation.dataClassification,

      inquiryEvidenceToolMode:
        source.pilotRecommendation.inquiryEvidenceToolMode,

      recommendationEvidenceToolMode:
        source.pilotRecommendation.recommendationEvidenceToolMode,

      quotationProposalToolMode:
        source.pilotRecommendation.quotationProposalToolMode,

      executionMode:
        source.pilotRecommendation.executionMode,

      quotationProposalStatus:
        source.quotationProposalDraft.quotationProposalStatus,

      recommendationOutcome:
        source.quotationProposalDraft.recommendationOutcome,

      preferredOptionId:
        source.quotationProposalDraft.preferredOptionId,

      optionIds: [
        source.quotationProposalDraft.options[0].optionId,
        source.quotationProposalDraft.options[1].optionId,
      ] as const,

      optionRiskLevels: [
        source.quotationProposalDraft.options[0].riskLevel,
        source.quotationProposalDraft.options[1].riskLevel,
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
        [...source.quotationProposalDraft.rationale],

      uncertainties:
        [...source.quotationProposalDraft.uncertainties],

      benefitsAndTradeoffsExplicit:
        source.quotationProposalDraft.options.every(
          (option) =>
            option.benefits.length > 0 &&
            option.tradeoffs.length > 0,
        ) as true,

      ownerDecisionReserved:
        source.quotationProposalDraft.ownerDecisionReserved,

      assumptionsMade:
        source.quotationProposalDraft.assumptionsMade,

      unsupportedClaimsIncluded:
        source.quotationProposalDraft.unsupportedClaimsIncluded,

      urgencyExaggerated:
        source.quotationProposalDraft.urgencyExaggerated,

      guaranteeMade:
        source.quotationProposalDraft.guaranteeMade,

      transparentAIIdentity:
        source.quotationProposalDraft.transparentAIIdentity,

      ownerDecisionMade:
        source.quotationProposalDraft.ownerDecisionMade,

      customerDeliveryPrepared:
        source.quotationProposalDraft.customerDeliveryPrepared,

      customerDeliveryExecuted:
        source.quotationProposalDraft.customerDeliveryExecuted,

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

      quotationProposalOneReviewed:
        true as const,

      quotationProposalTwoReviewed:
        true as const,

      quotationProposalThreeReviewed:
        true as const,

      finalQuotationProposalSequenceReached:
        true as const,

      quotationProposalCapacityExhausted:
        true as const,

      limitedInternalPilotCompleted:
        approved,

      furtherQuotationProposalPreparationAuthorized:
        false as const,

      furtherQuotationProposalExecutionAuthorized:
        false as const,

      concurrentQuotationProposalExecutionAuthorized:
        false as const,

      quotationProposalCustomerDeliveryAuthorized:
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

      ownerReviewAfterEveryQuotationProposal:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      approved
        ? "LIMITED_INTERNAL_PILOT_COMPLETE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision;

  validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeReviewDecision(
    decision,
  );

  return decision;
}
