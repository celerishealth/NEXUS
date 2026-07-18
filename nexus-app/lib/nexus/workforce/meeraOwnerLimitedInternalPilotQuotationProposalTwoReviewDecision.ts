import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalTwoExecution,
  type MeeraLimitedInternalPilotQuotationProposalTwoExecution,
} from "./meeraLimitedInternalPilotQuotationProposalTwoExecution";

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION =
  "nexus-meera-owner-limited-internal-pilot-quotation-proposal-two-review-decision-v1" as const;

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION",
  "REJECT_AND_RETAIN_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY",
] as const;

export type MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecisionType =
  (
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISIONS
  )[number];

export interface CreateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecisionInput {
  readonly limitedInternalPilotQuotationProposalTwoExecution:
    MeeraLimitedInternalPilotQuotationProposalTwoExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision {
  readonly version:
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_RECORDED";

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

  readonly limitedInternalPilotQuotationProposalTwoExecutionId:
    string;

  readonly limitedInternalPilotQuotationProposalTwoExecutionDigest:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionId:
    string;

  readonly ownerQuotationProposalTwoExecutionDecisionDigest:
    string;

  readonly quotationProposalTwoPreparationId:
    string;

  readonly quotationProposalTwoPreparationDigest:
    string;

  readonly sourceQuotationProposalReviewDecisionId:
    string;

  readonly sourceQuotationProposalReviewDecisionDigest:
    string;

  readonly sourceQuotationProposalOneExecutionId:
    string;

  readonly sourceQuotationProposalOneExecutionDigest:
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
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecisionType;

  readonly nextQuotationProposalPreparationApproved:
    boolean;

  readonly quotationProposalThreeExecutionAuthorized:
    false;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "MISSING_COMMERCIAL_EVIDENCE";

    reviewedQuotationProposalSequence:
      2;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacity:
      1;

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

    quotationProposalOneReviewed:
      true;

    quotationProposalTwoReviewed:
      true;

    nextQuotationProposalPreparationAuthorized:
      boolean;

    quotationProposalThreePreparationPerformed:
      false;

    quotationProposalThreeExecutionAuthorized:
      false;

    quotationProposalThreeExecutionPerformed:
      false;

    concurrentQuotationProposalExecutionAuthorized:
      false;

    limitedInternalPilotCompleted:
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
    | "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY";

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
      "Unsupported deterministic Meera quotation/proposal two review value.",
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
      "Meera quotation/proposal two review reason is invalid.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Meera quotation/proposal two review reason contains secret-bearing content.",
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
    MeeraLimitedInternalPilotQuotationProposalTwoExecution,
): void {
  validateMeeraLimitedInternalPilotQuotationProposalTwoExecution(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 100 Meera quotation/proposal two execution",
    source,
    "executionDigest",
  );

  if (
    source.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_EXECUTED" ||
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
      "MISSING_COMMERCIAL_EVIDENCE" ||
    source.pilotRecommendation.quotationProposalSequence !==
      2 ||
    source.pilotRecommendation.remainingQuotationProposalCapacity !==
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
    source.executionBoundary.quotationProposalTwoExecutionPerformed !==
      true ||
    source.executionBoundary.ownerReviewRequired !==
      true ||
    source.executionBoundary.limitedInternalPilotCompleted !==
      false ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 100 Meera quotation/proposal two execution is required.",
    );
  }
}

export function validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
  decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Meera quotation/proposal two review decision identity",
        decision.decisionId,
      ],
      [
        "Meera quotation/proposal two execution identity",
        decision.limitedInternalPilotQuotationProposalTwoExecutionId,
      ],
      [
        "Meera quotation/proposal two owner execution decision identity",
        decision.ownerQuotationProposalTwoExecutionDecisionId,
      ],
      [
        "Meera quotation/proposal two preparation identity",
        decision.quotationProposalTwoPreparationId,
      ],
      [
        "Meera quotation/proposal one review decision identity",
        decision.sourceQuotationProposalReviewDecisionId,
      ],
      [
        "Meera quotation/proposal one execution identity",
        decision.sourceQuotationProposalOneExecutionId,
      ],
      [
        "Meera initial owner pilot decision identity",
        decision.initialOwnerPilotExecutionDecisionId,
      ],
      [
        "Meera initial pilot preparation identity",
        decision.initialPilotPreparationId,
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
        "Meera quotation/proposal two execution digest",
        decision.limitedInternalPilotQuotationProposalTwoExecutionDigest,
      ],
      [
        "Meera quotation/proposal two owner decision digest",
        decision.ownerQuotationProposalTwoExecutionDecisionDigest,
      ],
      [
        "Meera quotation/proposal two preparation digest",
        decision.quotationProposalTwoPreparationDigest,
      ],
      [
        "Meera quotation/proposal one review decision digest",
        decision.sourceQuotationProposalReviewDecisionDigest,
      ],
      [
        "Meera quotation/proposal one execution digest",
        decision.sourceQuotationProposalOneExecutionDigest,
      ],
      [
        "Meera initial owner pilot decision digest",
        decision.initialOwnerPilotExecutionDecisionDigest,
      ],
      [
        "Meera initial pilot preparation digest",
        decision.initialPilotPreparationDigest,
      ],
      [
        "Meera controlled shadow execution digest",
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
    "Meera quotation/proposal two review decision time",
    decision.decidedAt,
  );

  verifyDigestBoundObject(
    "Meera quotation/proposal two review decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_RECORDED" ||
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
      "Meera quotation/proposal two review identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY"
  ) {
    throw new Error(
      "Meera quotation/proposal two review decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION";

  if (
    decision.nextQuotationProposalPreparationApproved !==
      approved ||
    decision.quotationProposalThreeExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal three continuation authority is invalid.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "MISSING_COMMERCIAL_EVIDENCE" ||
    evidence.reviewedQuotationProposalSequence !==
      2 ||
    evidence.maximumQuotationProposalCount !==
      3 ||
    evidence.remainingQuotationProposalCapacity !==
      1 ||
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
      "Meera quotation/proposal two reviewed evidence is invalid.",
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
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.quotationProposalTwoReviewed !==
      true ||
    boundary.nextQuotationProposalPreparationAuthorized !==
      approved ||
    boundary.quotationProposalThreePreparationPerformed !==
      false ||
    boundary.quotationProposalThreeExecutionAuthorized !==
      false ||
    boundary.quotationProposalThreeExecutionPerformed !==
      false ||
    boundary.concurrentQuotationProposalExecutionAuthorized !==
      false ||
    boundary.limitedInternalPilotCompleted !==
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
      "Meera quotation/proposal two review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE"
      : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Meera quotation/proposal two review next step is invalid.",
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
      "Meera quotation/proposal two review decision must be deeply frozen.",
    );
  }
}

export function createMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
  input:
    CreateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecisionInput,
): MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision {
  const source =
    input.limitedInternalPilotQuotationProposalTwoExecution;

  validateSourceExecution(
    source,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal two review owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Meera quotation/proposal two review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Meera quotation-proposal-two-execution-bound owner can issue the review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION" &&
    input.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY"
  ) {
    throw new Error(
      "Meera quotation/proposal two review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Meera quotation/proposal two review decision cannot precede quotation/proposal two execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION";

  const decisionCore = {
    version:
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO_REVIEW_RECORDED" as const,

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

    limitedInternalPilotQuotationProposalTwoExecutionId:
      source.executionId,

    limitedInternalPilotQuotationProposalTwoExecutionDigest:
      source.executionDigest,

    ownerQuotationProposalTwoExecutionDecisionId:
      source.ownerQuotationProposalTwoExecutionDecisionId,

    ownerQuotationProposalTwoExecutionDecisionDigest:
      source.ownerQuotationProposalTwoExecutionDecisionDigest,

    quotationProposalTwoPreparationId:
      source.quotationProposalTwoPreparationId,

    quotationProposalTwoPreparationDigest:
      source.quotationProposalTwoPreparationDigest,

    sourceQuotationProposalReviewDecisionId:
      source.sourceQuotationProposalReviewDecisionId,

    sourceQuotationProposalReviewDecisionDigest:
      source.sourceQuotationProposalReviewDecisionDigest,

    sourceQuotationProposalOneExecutionId:
      source.sourceQuotationProposalOneExecutionId,

    sourceQuotationProposalOneExecutionDigest:
      source.sourceQuotationProposalOneExecutionDigest,

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

    nextQuotationProposalPreparationApproved:
      approved,

    quotationProposalThreeExecutionAuthorized:
      false as const,

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

      quotationProposalOneReviewed:
        true as const,

      quotationProposalTwoReviewed:
        true as const,

      nextQuotationProposalPreparationAuthorized:
        approved,

      quotationProposalThreePreparationPerformed:
        false as const,

      quotationProposalThreeExecutionAuthorized:
        false as const,

      quotationProposalThreeExecutionPerformed:
        false as const,

      concurrentQuotationProposalExecutionAuthorized:
        false as const,

      limitedInternalPilotCompleted:
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
        ? "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSALS_ONE_AND_TWO_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision;

  validateMeeraOwnerLimitedInternalPilotQuotationProposalTwoReviewDecision(
    decision,
  );

  return decision;
}
