import {
  createHash,
} from "node:crypto";

import {
  MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTION_VERSION,
  validateMeeraLimitedInternalPilotQuotationProposalExecution,
  type MeeraLimitedInternalPilotQuotationProposalExecution,
} from "./meeraLimitedInternalPilotQuotationProposalExecution";

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISION_VERSION =
  "nexus-meera-owner-limited-internal-pilot-quotation-proposal-review-decision-v1" as const;

export const MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISIONS = [
  "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_PREPARATION",
  "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_ONE_ONLY",
] as const;

export type MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecisionType =
  (
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISIONS
  )[number];

export interface CreateMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecisionInput {
  readonly limitedInternalPilotQuotationProposalExecution:
    MeeraLimitedInternalPilotQuotationProposalExecution;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision {
  readonly version:
    typeof MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_RECORDED";

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

  readonly limitedInternalPilotQuotationProposalExecutionId:
    string;

  readonly limitedInternalPilotQuotationProposalExecutionDigest:
    string;

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
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
    MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecisionType;

  readonly nextQuotationProposalPreparationApproved:
    boolean;

  readonly quotationProposalTwoExecutionAuthorized:
    false;

  readonly reason:
    string;

  readonly reviewedEvidence: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE";

    reviewedQuotationProposalSequence:
      1;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacity:
      2;

    ownerReviewFrequency:
      "AFTER_EVERY_QUOTATION_PROPOSAL";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    recommendationEvidenceToolMode:
      "READ_ONLY";

    quotationProposalToolId:
      "tool-quotation-proposal-draft";

    quotationProposalToolMode:
      "DRAFT_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    quotationProposalStatus:
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    unsupportedFactsInvented:
      false;

    ownerApprovedRecommendationOnly:
      true;

    crossCustomerEvidenceUsed:
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

    nextQuotationProposalPreparationAuthorized:
      boolean;

    quotationProposalTwoPreparationPerformed:
      false;

    quotationProposalTwoExecutionAuthorized:
      false;

    quotationProposalTwoExecutionPerformed:
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
    | "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO"
    | "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_ONE_ONLY";

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
      "Unsupported deterministic Meera quotation/proposal review value.",
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

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    value.trim() !== value ||
    value.length < 20 ||
    value.length > 500 ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw new Error(
      "Meera owner recommendation review reason must be a clear bounded statement.",
    );
  }

  if (FORBIDDEN_REASON_PATTERN.test(value)) {
    throw new Error(
      "Meera owner recommendation review reason contains prohibited secret-bearing content.",
    );
  }

  return value;
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

function validateSourceExecution(
  source:
    MeeraLimitedInternalPilotQuotationProposalExecution,
): void {
  validateMeeraLimitedInternalPilotQuotationProposalExecution(
    source,
  );

  if (
    source.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTION_VERSION ||
    source.executionState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 96 Meera pilot quotation/proposal execution is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 96 Meera pilot quotation/proposal execution",
    source,
    "executionDigest",
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
      "Workforce Day 96 Meera identity is invalid.",
    );
  }

  const pilot =
    source.pilotQuotationProposal;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE" ||
    pilot.quotationProposalSequence !==
      1 ||
    pilot.maximumQuotationProposalCount !==
      3 ||
    pilot.remainingQuotationProposalCapacity !==
      2 ||
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
      "Workforce Day 96 Meera pilot scope is invalid.",
    );
  }

  const inquiryEvidence =
    source.syntheticInquiryEvidence;

  const recommendationEvidence =
    source.syntheticRecommendationEvidence;

  const draft =
    source.quotationProposalDraft;

  if (
    inquiryEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    inquiryEvidence.unsupportedFactsInvented !==
      false ||
    recommendationEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    recommendationEvidence.ownerApprovedRecommendationOnly !==
      true ||
    recommendationEvidence.crossCustomerEvidenceUsed !==
      false ||
    recommendationEvidence.crossTenantContextUsed !==
      false ||
    draft.quotationProposalStatus !==
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.toolId !==
      "tool-quotation-proposal-draft" ||
    draft.toolMode !==
      "DRAFT_ONLY" ||
    draft.ownerDecisionMade !==
      false ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.urgencyExaggerated !==
      false ||
    draft.guaranteeMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Workforce Day 96 Meera reviewed evidence is invalid.",
    );
  }

  const boundary =
    source.executionBoundary;

  if (
    boundary.ownerExecutionApprovalBound !==
      true ||
    boundary.sourcePreparationBound !==
      true ||
    boundary.sourceControlledShadowExecutionBound !==
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
    boundary.concurrentQuotationProposalLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.quotationProposalCreatorInvocationCount !==
      1 ||
    boundary.limitedInternalPilotExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticQuotationProposalExecutionPerformed !==
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
      "Workforce Day 96 Meera authority boundary is invalid.",
    );
  }
}

export function validateMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision(
  decision:
    MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision,
): void {
  requireSafeIdentifier(
    "Meera quotation/proposal review decision identity",
    decision.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal execution identity",
    decision.limitedInternalPilotQuotationProposalExecutionId,
  );

  requireSafeIdentifier(
    "Meera owner execution decision identity",
    decision.ownerExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Meera pilot preparation identity",
    decision.preparationId,
  );

  requireSafeIdentifier(
    "Meera controlled shadow execution identity",
    decision.controlledShadowExecutionId,
  );

  requireSafeIdentifier(
    "Meera tenant identity",
    decision.tenantId,
  );

  requireSafeIdentifier(
    "Meera owner identity",
    decision.ownerId,
  );

  requireDigest(
    "Meera quotation/proposal execution digest",
    decision.limitedInternalPilotQuotationProposalExecutionDigest,
  );

  requireDigest(
    "Meera owner execution decision digest",
    decision.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Meera pilot preparation digest",
    decision.preparationDigest,
  );

  requireDigest(
    "Meera controlled shadow execution digest",
    decision.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Meera quotation/proposal review decision time",
    decision.decidedAt,
  );

  requireReason(
    decision.reason,
  );

  verifyDigestBoundObject(
    "Meera owner recommendation review decision",
    decision,
    "decisionDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_RECORDED" ||
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
      "Meera quotation/proposal review decision identity is invalid.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_PREPARATION" &&
    decision.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_ONE_ONLY"
  ) {
    throw new Error(
      "Meera owner recommendation review decision is invalid.",
    );
  }

  const approved =
    decision.decision ===
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_PREPARATION";

  if (
    decision.nextQuotationProposalPreparationApproved !==
      approved ||
    decision.quotationProposalTwoExecutionAuthorized !==
      false
  ) {
    throw new Error(
      "Meera quotation/proposal continuation authority is invalid.",
    );
  }

  const evidence =
    decision.reviewedEvidence;

  if (
    evidence.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    evidence.scenarioId !==
      "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE" ||
    evidence.reviewedQuotationProposalSequence !==
      1 ||
    evidence.maximumQuotationProposalCount !==
      3 ||
    evidence.remainingQuotationProposalCapacity !==
      2 ||
    evidence.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    evidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    evidence.quotationProposalToolId !==
      "tool-quotation-proposal-draft" ||
    evidence.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    evidence.executionMode !==
      "SANDBOX_ONLY" ||
    evidence.quotationProposalStatus !==
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.ownerApprovedRecommendationOnly !==
      true ||
    evidence.crossCustomerEvidenceUsed !==
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
      "Meera quotation/proposal reviewed evidence is invalid.",
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
    boundary.nextQuotationProposalPreparationAuthorized !==
      approved ||
    boundary.quotationProposalTwoPreparationPerformed !==
      false ||
    boundary.quotationProposalTwoExecutionAuthorized !==
      false ||
    boundary.quotationProposalTwoExecutionPerformed !==
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
      "Meera quotation/proposal review authority boundary is invalid.",
    );
  }

  const expectedNextStep =
    approved
      ? "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO"
      : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_ONE_ONLY";

  if (
    decision.nextStep !==
      expectedNextStep
  ) {
    throw new Error(
      "Meera quotation/proposal review next step is invalid.",
    );
  }

  if (
    !Object.isFrozen(decision) ||
    !Object.isFrozen(
      decision.reviewedEvidence,
    ) ||
    !Object.isFrozen(
      decision.authorityBoundary,
    )
  ) {
    throw new Error(
      "Meera quotation/proposal review decision must be deeply frozen.",
    );
  }
}

export function createMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision(
  input:
    CreateMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecisionInput,
): MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision {
  const source =
    input.limitedInternalPilotQuotationProposalExecution;

  validateSourceExecution(
    source,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal review decision identity",
    input.decisionId,
  );

  requireSafeIdentifier(
    "Meera quotation/proposal review owner identity",
    input.ownerId,
  );

  const reason =
    requireReason(
      input.reason,
    );

  requireIsoTimestamp(
    "Meera quotation/proposal review decision time",
    input.decidedAt,
  );

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the Meera limited-internal-pilot-bound owner can issue the recommendation review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_PREPARATION" &&
    input.decision !==
      "REJECT_AND_RETAIN_QUOTATION_PROPOSAL_ONE_ONLY"
  ) {
    throw new Error(
      "Meera owner recommendation review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Meera quotation/proposal review decision cannot precede recommendation execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_NEXT_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_PREPARATION";

  const decisionCore = {
    version:
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW_RECORDED" as const,

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

    limitedInternalPilotQuotationProposalExecutionId:
      source.executionId,

    limitedInternalPilotQuotationProposalExecutionDigest:
      source.executionDigest,

    ownerExecutionDecisionId:
      source.ownerExecutionDecisionId,

    ownerExecutionDecisionDigest:
      source.ownerExecutionDecisionDigest,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

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

    quotationProposalTwoExecutionAuthorized:
      false as const,

    reason,

    reviewedEvidence: {
      pilotClass:
        source.pilotQuotationProposal.pilotClass,

      scenarioId:
        source.pilotQuotationProposal.scenarioId,

      reviewedQuotationProposalSequence:
        source.pilotQuotationProposal.quotationProposalSequence,

      maximumQuotationProposalCount:
        source.pilotQuotationProposal.maximumQuotationProposalCount,

      remainingQuotationProposalCapacity:
        source.pilotQuotationProposal.remainingQuotationProposalCapacity,

      ownerReviewFrequency:
        source.pilotQuotationProposal.ownerReviewFrequency,

      dataClassification:
        source.pilotQuotationProposal.dataClassification,

      inquiryEvidenceToolMode:
        source.pilotQuotationProposal.inquiryEvidenceToolMode,

      recommendationEvidenceToolMode:
        source.pilotQuotationProposal.recommendationEvidenceToolMode,

      quotationProposalToolId:
        source.quotationProposalDraft.toolId,

      quotationProposalToolMode:
        source.quotationProposalDraft.toolMode,

      executionMode:
        source.pilotQuotationProposal.executionMode,

      quotationProposalStatus:
        source.quotationProposalDraft.quotationProposalStatus,

      unsupportedFactsInvented:
        source.syntheticInquiryEvidence.unsupportedFactsInvented,

      ownerApprovedRecommendationOnly:
        source.syntheticRecommendationEvidence.ownerApprovedRecommendationOnly,

      crossCustomerEvidenceUsed:
        source.syntheticRecommendationEvidence.crossCustomerEvidenceUsed,

      crossTenantContextUsed:
        source.syntheticRecommendationEvidence.crossTenantContextUsed,

      ownerDecisionMade:
        source.quotationProposalDraft.ownerDecisionMade,

      unsupportedClaimsIncluded:
        source.quotationProposalDraft.unsupportedClaimsIncluded,

      urgencyExaggerated:
        source.quotationProposalDraft.urgencyExaggerated,

      guaranteeMade:
        source.quotationProposalDraft.guaranteeMade,

      customerDeliveryPrepared:
        source.quotationProposalDraft.customerDeliveryPrepared,

      customerDeliveryExecuted:
        source.quotationProposalDraft.customerDeliveryExecuted,
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

      nextQuotationProposalPreparationAuthorized:
        approved,

      quotationProposalTwoPreparationPerformed:
        false as const,

      quotationProposalTwoExecutionAuthorized:
        false as const,

      quotationProposalTwoExecutionPerformed:
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
        ? "PREPARE_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_TWO" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_ONE_ONLY" as const,

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as MeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision;

  validateMeeraOwnerLimitedInternalPilotQuotationProposalReviewDecision(
    decision,
  );

  return decision;
}
