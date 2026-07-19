import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalThreePreparation,
  type MeeraLimitedInternalPilotQuotationProposalThreePreparation,
} from "./meeraLimitedInternalPilotQuotationProposalThreePreparation";

import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION,
  validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision,
  type MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision,
} from "./meeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision";

export const MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION =
  "nexus-meera-limited-internal-pilot-quotation-proposal-three-execution-v1" as const;

export interface ExecuteMeeraLimitedInternalPilotQuotationProposalThreeInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision;

  readonly limitedInternalPilotQuotationProposalThreePreparation:
    MeeraLimitedInternalPilotQuotationProposalThreePreparation;

  readonly executedAt:
    string;
}

export interface MeeraLimitedInternalPilotQuotationProposalThreeExecution {
  readonly version:
    typeof MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTED";

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

  readonly pilotRecommendation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "CONFLICTING_COMMERCIAL_OPTIONS";

    quotationProposalSequence:
      3;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacity:
      0;

    concurrentQuotationProposalLimit:
      1;

    failureThreshold:
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
  }>;

  readonly syntheticInquiryEvidence: Readonly<{
    evidenceClass:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryId:
      "synthetic-meera-pilot-inquiry-three";

    request:
      "Compare two conflicting implementation options and prepare a bounded quotationProposal with explicit tradeoffs.";

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
      "synthetic-meera-pilot-customer-context-three";

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

  readonly quotationProposalDraft: Readonly<{
    quotationProposalStatus:
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

    quotationProposalSequenceEnforced:
      true;

    maximumQuotationProposalCountPreserved:
      true;

    quotationProposalCapacityExhausted:
      true;

    concurrentQuotationProposalLimitEnforced:
      true;

    failureThresholdPreserved:
      true;

    quotationProposalCreatorInvocationCount:
      1;

    quotationProposalThreeExecutionPerformed:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticQuotationProposalExecutionPerformed:
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

    quotationProposalCustomerDeliveryAuthorized:
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

    ownerReviewAfterEveryQuotationProposal:
      true;

    emergencyPauseAvailable:
      true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW";

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
  "The quotationProposal preserves an explicit upgrade path instead of making an irreversible early commitment.",
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
      "Unsupported deterministic Meera quotationProposal three execution value.",
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
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision,
  preparation:
    MeeraLimitedInternalPilotQuotationProposalThreePreparation,
): void {
  validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision(
    decision,
  );

  validateMeeraLimitedInternalPilotQuotationProposalThreePreparation(
    preparation,
  );

  verifyDigestBoundObject(
    "Workforce Day 103 Meera quotationProposal three execution decision",
    decision,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Workforce Day 102 Meera quotationProposal three preparation",
    preparation,
    "preparationDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_RECORDED" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION" ||
    decision.quotationProposalThreeExecutionAuthorized !==
      true ||
    decision.quotationProposalThreeExecutionPerformed !==
      false ||
    decision.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE"
  ) {
    throw new Error(
      "Meera quotationProposal three execution requires an approved Workforce Day 103 owner decision.",
    );
  }

  if (
    preparation.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARED" ||
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Meera quotationProposal three execution requires the exact Workforce Day 102 preparation.",
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
    decision.sourceQuotationProposalTwoReviewDecisionId !==
      preparation.sourceQuotationProposalTwoReviewDecisionId ||
    decision.sourceQuotationProposalTwoReviewDecisionDigest !==
      preparation.sourceQuotationProposalTwoReviewDecisionDigest ||
    decision.sourceQuotationProposalTwoExecutionId !==
      preparation.sourceQuotationProposalTwoExecutionId ||
    decision.sourceQuotationProposalTwoExecutionDigest !==
      preparation.sourceQuotationProposalTwoExecutionDigest ||
    decision.ownerQuotationProposalTwoExecutionDecisionId !==
      preparation.ownerQuotationProposalTwoExecutionDecisionId ||
    decision.ownerQuotationProposalTwoExecutionDecisionDigest !==
      preparation.ownerQuotationProposalTwoExecutionDecisionDigest ||
    decision.quotationProposalTwoPreparationId !==
      preparation.quotationProposalTwoPreparationId ||
    decision.quotationProposalTwoPreparationDigest !==
      preparation.quotationProposalTwoPreparationDigest ||
    decision.controlledShadowExecutionId !==
      preparation.controlledShadowExecutionId ||
    decision.controlledShadowExecutionDigest !==
      preparation.controlledShadowExecutionDigest
  ) {
    throw new Error(
      "Meera quotationProposal three source binding verification failed.",
    );
  }

  if (
    !sameValue(
      decision.reviewedPreparation,
      {
        ...preparation.preparedQuotationProposal,
        ...preparation.specialistExpectation,
      },
    )
  ) {
    throw new Error(
      "Meera quotationProposal three reviewed preparation binding is invalid.",
    );
  }
}

export function validateMeeraLimitedInternalPilotQuotationProposalThreeExecution(
  execution:
    MeeraLimitedInternalPilotQuotationProposalThreeExecution,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Meera quotationProposal three execution identity",
        execution.executionId,
      ],
      [
        "Meera quotationProposal three owner decision identity",
        execution.ownerQuotationProposalThreeExecutionDecisionId,
      ],
      [
        "Meera quotationProposal three preparation identity",
        execution.quotationProposalThreePreparationId,
      ],
      [
        "Meera quotationProposal two review decision identity",
        execution.sourceQuotationProposalTwoReviewDecisionId,
      ],
      [
        "Meera quotationProposal two execution identity",
        execution.sourceQuotationProposalTwoExecutionId,
      ],
      [
        "Meera quotationProposal two owner decision identity",
        execution.ownerQuotationProposalTwoExecutionDecisionId,
      ],
      [
        "Meera quotationProposal two preparation identity",
        execution.quotationProposalTwoPreparationId,
      ],
      [
        "Meera controlled shadow execution identity",
        execution.controlledShadowExecutionId,
      ],
      [
        "Meera tenant identity",
        execution.tenantId,
      ],
      [
        "Meera owner identity",
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
        "Meera quotationProposal three owner decision digest",
        execution.ownerQuotationProposalThreeExecutionDecisionDigest,
      ],
      [
        "Meera quotationProposal three preparation digest",
        execution.quotationProposalThreePreparationDigest,
      ],
      [
        "Meera quotationProposal two review decision digest",
        execution.sourceQuotationProposalTwoReviewDecisionDigest,
      ],
      [
        "Meera quotationProposal two execution digest",
        execution.sourceQuotationProposalTwoExecutionDigest,
      ],
      [
        "Meera quotationProposal two owner decision digest",
        execution.ownerQuotationProposalTwoExecutionDecisionDigest,
      ],
      [
        "Meera quotationProposal two preparation digest",
        execution.quotationProposalTwoPreparationDigest,
      ],
      [
        "Meera controlled shadow execution digest",
        execution.controlledShadowExecutionDigest,
      ],
      [
        "Meera quotationProposal three execution digest",
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
    "Meera quotationProposal three execution time",
    execution.executedAt,
  );

  verifyDigestBoundObject(
    "Meera quotationProposal three execution",
    execution,
    "executionDigest",
  );

  if (
    execution.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION ||
    execution.executionState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTED" ||
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
      "Meera quotationProposal three execution identity is invalid.",
    );
  }

  const pilot =
    execution.pilotRecommendation;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "CONFLICTING_COMMERCIAL_OPTIONS" ||
    pilot.quotationProposalSequence !==
      3 ||
    pilot.maximumQuotationProposalCount !==
      3 ||
    pilot.remainingQuotationProposalCapacity !==
      0 ||
    pilot.concurrentQuotationProposalLimit !==
      1 ||
    pilot.failureThreshold !==
      1 ||
    pilot.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    pilot.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    pilot.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    pilot.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    pilot.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    pilot.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Meera quotationProposal three pilot scope is invalid.",
    );
  }

  const evidence =
    execution.syntheticInquiryEvidence;

  if (
    evidence.evidenceClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryId !==
      "synthetic-meera-pilot-inquiry-three" ||
    evidence.request !==
      "Compare two conflicting implementation options and prepare a bounded quotationProposal with explicit tradeoffs." ||
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
      "Meera quotationProposal three synthetic inquiry evidence is invalid.",
    );
  }

  const context =
    execution.syntheticCustomerContext;

  if (
    context.contextClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    context.contextId !==
      "synthetic-meera-pilot-customer-context-three" ||
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
      "Meera quotationProposal three synthetic customer context is invalid.",
    );
  }

  const draft =
    execution.quotationProposalDraft;

  if (
    draft.quotationProposalStatus !==
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
      "Meera quotationProposal three tradeoff draft is invalid.",
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
    boundary.quotationProposalSequenceEnforced !==
      true ||
    boundary.maximumQuotationProposalCountPreserved !==
      true ||
    boundary.quotationProposalCapacityExhausted !==
      true ||
    boundary.concurrentQuotationProposalLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.quotationProposalCreatorInvocationCount !==
      1 ||
    boundary.quotationProposalThreeExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticQuotationProposalExecutionPerformed !==
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
    boundary.quotationProposalCustomerDeliveryAuthorized !==
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
    boundary.ownerReviewAfterEveryQuotationProposal !==
      true ||
    boundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Meera quotationProposal three execution authority boundary is invalid.",
    );
  }

  if (
    execution.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW"
  ) {
    throw new Error(
      "Meera quotationProposal three execution next step is invalid.",
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
      execution.quotationProposalDraft,
    ) ||
    !Object.isFrozen(
      execution.quotationProposalDraft.options,
    ) ||
    !execution.quotationProposalDraft.options.every(
      (option) =>
        Object.isFrozen(option) &&
        Object.isFrozen(option.benefits) &&
        Object.isFrozen(option.tradeoffs),
    ) ||
    !Object.isFrozen(
      execution.quotationProposalDraft.rationale,
    ) ||
    !Object.isFrozen(
      execution.quotationProposalDraft.uncertainties,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Meera quotationProposal three execution must be deeply frozen.",
    );
  }
}

export async function executeMeeraLimitedInternalPilotQuotationProposalThree(
  input:
    ExecuteMeeraLimitedInternalPilotQuotationProposalThreeInput,
): Promise<MeeraLimitedInternalPilotQuotationProposalThreeExecution> {
  requireSafeIdentifier(
    "Meera quotationProposal three execution identity",
    input.executionId,
  );

  requireIsoTimestamp(
    "Meera quotationProposal three execution time",
    input.executedAt,
  );

  const decision =
    input.ownerLimitedInternalPilotQuotationProposalThreeExecutionDecision;

  const preparation =
    input.limitedInternalPilotQuotationProposalThreePreparation;

  validateSourceBindings(
    decision,
    preparation,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Meera quotationProposal three execution cannot precede owner approval.",
    );
  }

  let quotationProposalCreatorInvocationCount =
    0;

  quotationProposalCreatorInvocationCount +=
    1;

  if (
    quotationProposalCreatorInvocationCount >
    preparation.preparedQuotationProposal
      .concurrentQuotationProposalLimit
  ) {
    throw new Error(
      "Meera quotationProposal three concurrent execution limit was exceeded.",
    );
  }

  if (
    quotationProposalCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Meera quotationProposal three creator must execute exactly once.",
    );
  }

  const executionCore = {
    version:
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTED" as const,

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

    ownerQuotationProposalThreeExecutionDecisionId:
      decision.decisionId,

    ownerQuotationProposalThreeExecutionDecisionDigest:
      decision.decisionDigest,

    quotationProposalThreePreparationId:
      preparation.preparationId,

    quotationProposalThreePreparationDigest:
      preparation.preparationDigest,

    sourceQuotationProposalTwoReviewDecisionId:
      preparation.sourceQuotationProposalTwoReviewDecisionId,

    sourceQuotationProposalTwoReviewDecisionDigest:
      preparation.sourceQuotationProposalTwoReviewDecisionDigest,

    sourceQuotationProposalTwoExecutionId:
      preparation.sourceQuotationProposalTwoExecutionId,

    sourceQuotationProposalTwoExecutionDigest:
      preparation.sourceQuotationProposalTwoExecutionDigest,

    ownerQuotationProposalTwoExecutionDecisionId:
      preparation.ownerQuotationProposalTwoExecutionDecisionId,

    ownerQuotationProposalTwoExecutionDecisionDigest:
      preparation.ownerQuotationProposalTwoExecutionDecisionDigest,

    quotationProposalTwoPreparationId:
      preparation.quotationProposalTwoPreparationId,

    quotationProposalTwoPreparationDigest:
      preparation.quotationProposalTwoPreparationDigest,

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
        "CONFLICTING_COMMERCIAL_OPTIONS" as const,

      quotationProposalSequence:
        3 as const,

      maximumQuotationProposalCount:
        3 as const,

      remainingQuotationProposalCapacity:
        0 as const,

      concurrentQuotationProposalLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_QUOTATION_PROPOSAL" as const,

      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      recommendationEvidenceToolMode:
        "READ_ONLY" as const,

      quotationProposalToolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    syntheticInquiryEvidence: {
      evidenceClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      inquiryId:
        "synthetic-meera-pilot-inquiry-three" as const,

      request:
        "Compare two conflicting implementation options and prepare a bounded quotationProposal with explicit tradeoffs." as const,

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
        "synthetic-meera-pilot-customer-context-three" as const,

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

    quotationProposalDraft: {
      quotationProposalStatus:
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

      quotationProposalSequenceEnforced:
        true as const,

      maximumQuotationProposalCountPreserved:
        true as const,

      quotationProposalCapacityExhausted:
        true as const,

      concurrentQuotationProposalLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      quotationProposalCreatorInvocationCount:
        quotationProposalCreatorInvocationCount as 1,

      quotationProposalThreeExecutionPerformed:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticQuotationProposalExecutionPerformed:
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

      quotationProposalCustomerDeliveryAuthorized:
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

      ownerReviewAfterEveryQuotationProposal:
        true as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as MeeraLimitedInternalPilotQuotationProposalThreeExecution;

  validateMeeraLimitedInternalPilotQuotationProposalThreeExecution(
    execution,
  );

  return execution;
}