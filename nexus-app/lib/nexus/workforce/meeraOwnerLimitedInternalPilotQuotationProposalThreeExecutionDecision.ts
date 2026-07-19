import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalThreePreparation,
  type MeeraLimitedInternalPilotQuotationProposalThreePreparation,
} from "./meeraLimitedInternalPilotQuotationProposalThreePreparation";

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION =
  "nexus-meera-owner-limited-internal-pilot-quotation-proposal-three-execution-decision-v1" as const;

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION",
  "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_THREE_PREPARATION_ONLY",
] as const;

export type MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionType =
  (
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISIONS
  )[number];

export interface CreateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionInput {
  readonly limitedInternalPilotQuotationProposalThreePreparation:
    MeeraLimitedInternalPilotQuotationProposalThreePreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision {
  readonly version:
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_RECORDED";

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

  readonly preparationId:
    string;

  readonly preparationDigest:
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
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionType;

  readonly quotationProposalThreeExecutionAuthorized:
    boolean;

  readonly quotationProposalThreeExecutionPerformed:
    false;

  readonly reason:
    string;

  readonly reviewedPreparation: Readonly<
    MeeraLimitedInternalPilotQuotationProposalThreePreparation[
      "preparedQuotationProposal"
    ] &
    MeeraLimitedInternalPilotQuotationProposalThreePreparation[
      "specialistExpectation"
    ]
  >;

  readonly authorityBoundary: Readonly<{
    sourcePreparationBound:
      true;

    sourcePreparationIntegrityVerified:
      true;

    sourceQuotationProposalTwoReviewDecisionBound:
      true;

    sourceQuotationProposalTwoExecutionBound:
      true;

    sourceQuotationProposalTwoPreparationBound:
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

    quotationProposalOneReviewed:
      true;

    quotationProposalTwoReviewed:
      true;

    quotationProposalThreePreparationPerformed:
      true;

    quotationProposalThreeExecutionAuthorized:
      boolean;

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
    | "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE"
    | "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_ONLY";

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
      "Unsupported deterministic Meera quotation/proposal three execution decision value.",
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
      "Meera quotation/proposal three execution decision reason must contain 20 to 500 trimmed characters.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Meera quotation/proposal three execution decision reason contains secret-bearing content.",
    );
  }
}

function requireDecision(
  value: unknown,
): asserts value is
  MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionType {
  if (
    !MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISIONS.includes(
      value as
        MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionType,
    )
  ) {
    throw new Error(
      "Meera quotation/proposal three execution decision is invalid.",
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
    MeeraLimitedInternalPilotQuotationProposalThreePreparation,
): void {
  validateMeeraLimitedInternalPilotQuotationProposalThreePreparation(
    source,
  );

  verifyDigestBoundObject(
    "Workforce Day 102 Meera quotation/proposal three preparation",
    source,
    "preparationDigest",
  );

  if (
    source.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARED" ||
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
    source.preparedQuotationProposal.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    source.preparedQuotationProposal.scenarioId !==
      "CONFLICTING_COMMERCIAL_OPTIONS" ||
    source.preparedQuotationProposal.quotationProposalSequence !==
      3 ||
    source.preparedQuotationProposal.priorReviewedQuotationProposalSequence !==
      2 ||
    source.preparedQuotationProposal.maximumQuotationProposalCount !==
      3 ||
    source.preparedQuotationProposal.remainingQuotationProposalCapacityBeforeExecution !==
      1 ||
    source.preparedQuotationProposal.projectedRemainingQuotationProposalCapacityAfterExecution !==
      0 ||
    source.preparedQuotationProposal.concurrentQuotationProposalLimit !==
      1 ||
    source.preparedQuotationProposal.failureThreshold !==
      1 ||
    source.preparedQuotationProposal.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    source.preparedQuotationProposal.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    source.preparedQuotationProposal.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    source.preparedQuotationProposal.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    source.preparedQuotationProposal.quotationProposalToolId !==
      "tool-quotation-proposal-draft" ||
    source.preparedQuotationProposal.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    source.preparedQuotationProposal.executionMode !==
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
    source.specialistExpectation.quotationProposalGenerationPerformed !==
      false ||
    source.specialistExpectation.ownerDecisionMade !==
      false ||
    source.specialistExpectation.customerDeliveryPrepared !==
      false ||
    source.specialistExpectation.customerDeliveryExecuted !==
      false ||
    source.authorityBoundary.quotationProposalOneReviewed !==
      true ||
    source.authorityBoundary.quotationProposalTwoReviewed !==
      true ||
    source.authorityBoundary.quotationProposalThreePreparationPerformed !==
      true ||
    source.authorityBoundary.quotationProposalThreeExecutionAuthorized !==
      false ||
    source.authorityBoundary.quotationProposalThreeExecutionPerformed !==
      false ||
    source.authorityBoundary.limitedInternalPilotCompleted !==
      false ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 102 Meera quotation/proposal three preparation is required.",
    );
  }
}

export function validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision(
  decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision,
): void {
  const identifiers:
    readonly (
      readonly [
        string,
        string,
      ]
    )[] = [
      [
        "Meera quotation/proposal three execution decision identity",
        decision.decisionId,
      ],
      [
        "Meera quotation/proposal three preparation identity",
        decision.preparationId,
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
      ],      [
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
        "Meera quotation/proposal three preparation digest",
        decision.preparationDigest,
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
      ],      [
        "Meera controlled shadow execution digest",
        decision.controlledShadowExecutionDigest,
      ],
      [
        "Meera quotation/proposal three execution decision digest",
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
    "Meera quotation/proposal three execution decision time",
    decision.decidedAt,
  );

  verifyDigestBoundObject(
    "Meera quotation/proposal three execution decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_RECORDED" ||
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
      "Meera quotation/proposal three execution decision identity is invalid.",
    );
  }

  const approved =
    decision.decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION";

  if (
    decision.quotationProposalThreeExecutionAuthorized !==
      approved ||
    decision.quotationProposalThreeExecutionPerformed !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal three execution authority is invalid.",
    );
  }

  const reviewed =
    decision.reviewedPreparation;

  if (
    reviewed.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    reviewed.scenarioId !==
      "CONFLICTING_COMMERCIAL_OPTIONS" ||
    reviewed.quotationProposalSequence !==
      3 ||
    reviewed.priorReviewedQuotationProposalSequence !==
      2 ||
    reviewed.maximumQuotationProposalCount !==
      3 ||
    reviewed.remainingQuotationProposalCapacityBeforeExecution !==
      1 ||
    reviewed.projectedRemainingQuotationProposalCapacityAfterExecution !==
      0 ||
    reviewed.concurrentQuotationProposalLimit !==
      1 ||
    reviewed.failureThreshold !==
      1 ||
    reviewed.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    reviewed.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    reviewed.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    reviewed.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    reviewed.quotationProposalToolId !==
      "tool-quotation-proposal-draft" ||
    reviewed.quotationProposalToolMode !==
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
    reviewed.quotationProposalGenerationPerformed !==
      false ||
    reviewed.ownerDecisionMade !==
      false ||
    reviewed.customerDeliveryPrepared !==
      false ||
    reviewed.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal three reviewed preparation is invalid.",
    );
  }

  const boundary =
    decision.authorityBoundary;

  if (
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.sourceQuotationProposalTwoReviewDecisionBound !==
      true ||
    boundary.sourceQuotationProposalTwoExecutionBound !==
      true ||
    boundary.sourceQuotationProposalTwoPreparationBound !==
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
    boundary.quotationProposalOneReviewed !==
      true ||
    boundary.quotationProposalTwoReviewed !==
      true ||
    boundary.quotationProposalThreePreparationPerformed !==
      true ||
    boundary.quotationProposalThreeExecutionAuthorized !==
      approved ||
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
      "Meera quotation/proposal three execution decision authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE"
      : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Meera quotation/proposal three execution decision next step is invalid.",
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
      "Meera quotation/proposal three execution decision must be deeply frozen.",
    );
  }
}

export function createMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision(
  input:
    CreateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecisionInput,
): MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision {
  const source =
    input.limitedInternalPilotQuotationProposalThreePreparation;

  validateSourcePreparation(
    source,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal three execution decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal three execution decision owner identity",
    input.ownerId,
  );

  if (
    input.ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Meera quotation/proposal three execution decision requires the preparation-bound owner.",
    );
  }

  requireDecision(
    input.decision,
  );

  requireReason(
    input.reason,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal three execution decision time",
    input.decidedAt,
  );

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Meera quotation/proposal three execution decision cannot precede its preparation.",
    );
  }

  const approved =
    input.decision ===
    "APPROVE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION";

  const decisionCore = {
    version:
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_EXECUTION_DECISION_RECORDED" as const,

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
      source.ownerId,

    decision:
      input.decision,

    quotationProposalThreeExecutionAuthorized:
      approved,

    quotationProposalThreeExecutionPerformed:
      false as const,

    reason:
      input.reason,

    reviewedPreparation: {
      ...source.preparedQuotationProposal,
      ...source.specialistExpectation,
    },

    authorityBoundary: {
      sourcePreparationBound:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      sourceQuotationProposalTwoReviewDecisionBound:
        true as const,

      sourceQuotationProposalTwoExecutionBound:
        true as const,

      sourceQuotationProposalTwoPreparationBound:
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

      quotationProposalOneReviewed:
        true as const,

      quotationProposalTwoReviewed:
        true as const,

      quotationProposalThreePreparationPerformed:
        true as const,

      quotationProposalThreeExecutionAuthorized:
        approved,

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
        ? "EXECUTE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_THREE_PREPARATION_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision;

  validateMeeraOwnerLimitedInternalPilotQuotationProposalThreeExecutionDecision(
    decision,
  );

  return decision;
}