import {
  createHash,
} from "node:crypto";

import {
  validateMeeraControlledShadowOperationExecution,
  type MeeraControlledShadowOperationExecution,
} from "./meeraControlledShadowOperationExecution";

import {
  MEERA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,
  validateMeeraLimitedInternalPilotPreparation,
  type MeeraLimitedInternalPilotPreparation,
} from "./meeraLimitedInternalPilotPreparation";

import {
  MEERA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION,
  validateMeeraOwnerLimitedInternalPilotExecutionDecision,
  type MeeraOwnerLimitedInternalPilotExecutionDecision,
} from "./meeraOwnerLimitedInternalPilotExecutionDecision";

export const MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTION_VERSION =
  "nexus-meera-limited-internal-pilot-quotation-proposal-execution-v1" as const;

export interface ExecuteMeeraLimitedInternalPilotQuotationProposalInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotExecutionDecision:
    MeeraOwnerLimitedInternalPilotExecutionDecision;

  readonly limitedInternalPilotPreparation:
    MeeraLimitedInternalPilotPreparation;

  readonly controlledShadowOperationExecution:
    MeeraControlledShadowOperationExecution;

  readonly executedAt:
    string;
}

export interface MeeraLimitedInternalPilotQuotationProposalExecution {
  readonly version:
    typeof MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTED";

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

  readonly ownerExecutionDecisionId:
    string;

  readonly ownerExecutionDecisionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly sourceReviewDecisionId:
    string;

  readonly sourceReviewDecisionDigest:
    string;

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly pilotQuotationProposal: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE";

    quotationProposalSequence:
      1;

    maximumQuotationProposalCount:
      3;

    remainingQuotationProposalCapacity:
      2;

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

  readonly syntheticInquiryEvidence:
    MeeraControlledShadowOperationExecution[
      "syntheticInquiryEvidence"
    ];

  readonly syntheticRecommendationEvidence:
    MeeraControlledShadowOperationExecution[
      "syntheticRecommendationEvidence"
    ];

  readonly quotationProposalDraft:
    MeeraControlledShadowOperationExecution[
      "quotationProposalDraft"
    ];

  readonly executionBoundary: Readonly<{
    ownerExecutionApprovalBound:
      true;

    sourcePreparationBound:
      true;

    sourceControlledShadowExecutionBound:
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

    concurrentQuotationProposalLimitEnforced:
      true;

    failureThresholdPreserved:
      true;

    quotationProposalCreatorInvocationCount:
      1;

    limitedInternalPilotExecutionPerformed:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticQuotationProposalExecutionPerformed:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticRecommendationEvidenceRead:
      true;

    quotationProposalDraftCreated:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW";

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

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map(
          (item) =>
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
      "Unsupported deterministic Meera pilot execution value.",
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

function requireIdentifier(
  label: string,
  value: unknown,
): asserts value is string {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a safe identifier.`,
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

function validateSourceBindings(
  decision:
    MeeraOwnerLimitedInternalPilotExecutionDecision,

  preparation:
    MeeraLimitedInternalPilotPreparation,

  shadow:
    MeeraControlledShadowOperationExecution,
): void {
  validateMeeraOwnerLimitedInternalPilotExecutionDecision(
    decision,
  );

  validateMeeraLimitedInternalPilotPreparation(
    preparation,
  );

  validateMeeraControlledShadowOperationExecution(
    shadow,
  );

  verifyDigestBoundObject(
    "Meera owner pilot execution decision",
    decision,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Meera limited pilot preparation",
    preparation,
    "preparationDigest",
  );

  verifyDigestBoundObject(
    "Meera controlled shadow execution",
    shadow,
    "executionDigest",
  );

  if (
    decision.version !==
      MEERA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION" ||
    decision.approvedForLimitedInternalPilotExecution !==
      true ||
    decision.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT"
  ) {
    throw new Error(
      "An approved Workforce Day 95 Meera pilot execution decision is required.",
    );
  }

  if (
    preparation.version !==
      MEERA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_PREPARED"
  ) {
    throw new Error(
      "A valid Workforce Day 94 Meera pilot preparation is required.",
    );
  }

  if (
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
      EXPECTED_AUTONOMY_LEVEL ||
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
      EXPECTED_AUTONOMY_LEVEL ||
    shadow.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    shadow.templateId !==
      EXPECTED_TEMPLATE_ID ||
    shadow.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    shadow.displayName !==
      EXPECTED_DISPLAY_NAME ||
    shadow.officialRole !==
      EXPECTED_ROLE ||
    shadow.department !==
      EXPECTED_DEPARTMENT ||
    shadow.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Meera limited pilot employee identity has changed.",
    );
  }

  if (
    decision.preparationId !==
      preparation.preparationId ||
    decision.preparationDigest !==
      preparation.preparationDigest ||
    decision.sourceReviewDecisionId !==
      preparation.sourceReviewDecisionId ||
    decision.sourceReviewDecisionDigest !==
      preparation.sourceReviewDecisionDigest ||
    decision.controlledShadowExecutionId !==
      preparation.controlledShadowExecutionId ||
    decision.controlledShadowExecutionDigest !==
      preparation.controlledShadowExecutionDigest ||
    preparation.controlledShadowExecutionId !==
      shadow.executionId ||
    preparation.controlledShadowExecutionDigest !==
      shadow.executionDigest ||
    decision.tenantId !==
      preparation.tenantId ||
    decision.tenantId !==
      shadow.tenantId ||
    decision.ownerId !==
      preparation.ownerId ||
    decision.ownerId !==
      shadow.ownerId
  ) {
    throw new Error(
      "Meera limited pilot source binding verification failed.",
    );
  }

  const plan =
    preparation.pilotPlan;

  if (
    plan.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    plan.executionMode !==
      "SANDBOX_ONLY" ||
    plan.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    plan.recommendationEvidenceToolMode !==
      "READ_ONLY" ||
    plan.quotationProposalToolMode !==
      "DRAFT_ONLY" ||
    plan.maximumQuotationProposalCount !==
      3 ||
    plan.concurrentQuotationProposalLimit !==
      1 ||
    plan.failureThreshold !==
      1 ||
    plan.ownerReviewFrequency !==
      "AFTER_EVERY_QUOTATION_PROPOSAL" ||
    plan.externalDeliveryMode !==
      "DISABLED" ||
    plan.productionMutationMode !==
      "DISABLED" ||
    plan.scenarios.length !==
      3 ||
    plan.scenarios[0] !==
      "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE" ||
    plan.scenarios[1] !==
      "MISSING_COMMERCIAL_EVIDENCE" ||
    plan.scenarios[2] !==
      "CONFLICTING_COMMERCIAL_OPTIONS"
  ) {
    throw new Error(
      "Workforce Day 94 Meera pilot plan has changed.",
    );
  }

  const reviewed =
    decision.reviewedPilotPreparation;

  if (
    reviewed.dataClassification !==
      plan.dataClassification ||
    reviewed.executionMode !==
      plan.executionMode ||
    reviewed.inquiryEvidenceToolMode !==
      plan.inquiryEvidenceToolMode ||
    reviewed.recommendationEvidenceToolMode !==
      plan.recommendationEvidenceToolMode ||
    reviewed.quotationProposalToolMode !==
      plan.quotationProposalToolMode ||
    reviewed.maximumQuotationProposalCount !==
      plan.maximumQuotationProposalCount ||
    reviewed.concurrentQuotationProposalLimit !==
      plan.concurrentQuotationProposalLimit ||
    reviewed.failureThreshold !==
      plan.failureThreshold ||
    reviewed.ownerReviewFrequency !==
      plan.ownerReviewFrequency ||
    reviewed.externalDeliveryMode !==
      plan.externalDeliveryMode ||
    reviewed.productionMutationMode !==
      plan.productionMutationMode ||
    reviewed.scenarioCount !==
      plan.scenarios.length ||
    reviewed.specialistStandardBound !==
      true ||
    reviewed.transparentAIIdentityRequired !==
      true ||
    reviewed.quotationProposalDeliveryRequiresSeparateOwnerAuthority !==
      true
  ) {
    throw new Error(
      "Workforce Day 95 reviewed Meera pilot scope has changed.",
    );
  }

  const decisionBoundary =
    decision.authorityBoundary;

  if (
    decisionBoundary.sourcePreparationIntegrityVerified !==
      true ||
    decisionBoundary.exactEmployeeIdentityBound !==
      true ||
    decisionBoundary.exactTenantBound !==
      true ||
    decisionBoundary.exactOwnerBound !==
      true ||
    decisionBoundary.ownerExecutionDecisionRecorded !==
      true ||
    decisionBoundary.approvalBypassAllowed !==
      false ||
    decisionBoundary.limitedInternalPilotPreparationAuthorized !==
      true ||
    decisionBoundary.limitedInternalPilotExecutionAuthorized !==
      true ||
    decisionBoundary.limitedInternalPilotExecutionPerformed !==
      false ||
    decisionBoundary.syntheticQuotationProposalExecutionPerformed !==
      false ||
    decisionBoundary.quotationProposalCustomerDeliveryAuthorized !==
      false ||
    decisionBoundary.realCustomerDataAccessAuthorized !==
      false ||
    decisionBoundary.realCustomerContactAuthorized !==
      false ||
    decisionBoundary.externalDeliveryAuthorized !==
      false ||
    decisionBoundary.liveProviderExecutionAuthorized !==
      false ||
    decisionBoundary.productionDatabaseAuthorized !==
      false ||
    decisionBoundary.productionMutationAuthorized !==
      false ||
    decisionBoundary.paymentExecutionAuthorized !==
      false ||
    decisionBoundary.autonomousDecisionAuthorized !==
      false ||
    decisionBoundary.productionReadinessAuthorized !==
      false ||
    decisionBoundary.publicLaunchAuthorized !==
      false ||
    decisionBoundary.monitoringRequired !==
      true ||
    decisionBoundary.ownerReviewAfterEveryQuotationProposal !==
      true ||
    decisionBoundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Workforce Day 95 Meera execution authority boundary has changed.",
    );
  }

  const shadowBoundary =
    shadow.executionBoundary;

  if (
    shadowBoundary.quotationProposalCreatorInvocationCount !==
      1 ||
    shadowBoundary.shadowExecutionExecuted !==
      true ||
    shadowBoundary.syntheticInquiryEvidenceRead !==
      true ||
    shadowBoundary.syntheticRecommendationEvidenceRead !==
      true ||
    shadowBoundary.quotationProposalDraftCreated !==
      true ||
    shadowBoundary.ownerDecisionMade !==
      false ||
    shadowBoundary.ownerReviewRequired !==
      true ||
    shadowBoundary.realCustomerDataUsed !==
      false ||
    shadowBoundary.realCustomerDataAccessAuthorized !==
      false ||
    shadowBoundary.realCustomerContactAuthorized !==
      false ||
    shadowBoundary.externalDeliveryAuthorized !==
      false ||
    shadowBoundary.liveProviderExecutionAuthorized !==
      false ||
    shadowBoundary.productionDatabaseAuthorized !==
      false ||
    shadowBoundary.productionMutationAuthorized !==
      false ||
    shadowBoundary.paymentExecutionAuthorized !==
      false ||
    shadowBoundary.autonomousDecisionAuthorized !==
      false ||
    shadowBoundary.productionReadinessAuthorized !==
      false ||
    shadowBoundary.publicLaunchAuthorized !==
      false ||
    shadowBoundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Verified Meera controlled shadow execution boundary has changed.",
    );
  }

  const draft =
    shadow.quotationProposalDraft;

  if (
    shadow.syntheticInquiryEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    shadow.syntheticInquiryEvidence.unsupportedFactsInvented !==
      false ||
    shadow.syntheticRecommendationEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    shadow.syntheticRecommendationEvidence.ownerApprovedRecommendationOnly !==
      true ||
    shadow.syntheticRecommendationEvidence.crossCustomerEvidenceUsed !==
      false ||
    shadow.syntheticRecommendationEvidence.crossTenantContextUsed !==
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
      "Verified Meera synthetic quotation/proposal evidence is unsafe.",
    );
  }
}

export function validateMeeraLimitedInternalPilotQuotationProposalExecution(
  execution:
    MeeraLimitedInternalPilotQuotationProposalExecution,
): void {
  requireIdentifier(
    "Meera limited pilot execution identity",
    execution.executionId,
  );

  requireIdentifier(
    "Meera owner execution decision identity",
    execution.ownerExecutionDecisionId,
  );

  requireIdentifier(
    "Meera limited pilot preparation identity",
    execution.preparationId,
  );

  requireIdentifier(
    "Meera source review decision identity",
    execution.sourceReviewDecisionId,
  );

  requireIdentifier(
    "Meera controlled shadow execution identity",
    execution.controlledShadowExecutionId,
  );

  requireIdentifier(
    "Meera tenant identity",
    execution.tenantId,
  );

  requireIdentifier(
    "Meera owner identity",
    execution.ownerId,
  );

  requireDigest(
    "Meera owner execution decision digest",
    execution.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Meera limited pilot preparation digest",
    execution.preparationDigest,
  );

  requireDigest(
    "Meera source review decision digest",
    execution.sourceReviewDecisionDigest,
  );

  requireDigest(
    "Meera controlled shadow execution digest",
    execution.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Meera limited pilot execution time",
    execution.executedAt,
  );

  verifyDigestBoundObject(
    "Meera limited pilot quotation/proposal execution",
    execution,
    "executionDigest",
  );

  if (
    execution.version !==
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTION_VERSION ||
    execution.executionState !==
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTED" ||
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
      "Meera limited pilot quotation/proposal execution identity is invalid.",
    );
  }

  const pilot =
    execution.pilotQuotationProposal;

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
      "Meera limited pilot quotation/proposal scope is invalid.",
    );
  }

  const draft =
    execution.quotationProposalDraft;

  if (
    execution.syntheticInquiryEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticInquiryEvidence.unsupportedFactsInvented !==
      false ||
    execution.syntheticRecommendationEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticRecommendationEvidence.crossCustomerEvidenceUsed !==
      false ||
    execution.syntheticRecommendationEvidence.crossTenantContextUsed !==
      false ||
    draft.quotationProposalStatus !==
      "QUOTATION_PROPOSAL_DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
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
      "Meera limited pilot quotation/proposal evidence is invalid.",
    );
  }

  const boundary =
    execution.executionBoundary;

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
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticRecommendationEvidenceRead !==
      true ||
    boundary.quotationProposalDraftCreated !==
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
      true ||
    execution.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW"
  ) {
    throw new Error(
      "Meera limited pilot execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.pilotQuotationProposal,
    ) ||
    !Object.isFrozen(
      execution.syntheticInquiryEvidence,
    ) ||
    !Object.isFrozen(
      execution.syntheticRecommendationEvidence,
    ) ||
    !Object.isFrozen(
      execution.quotationProposalDraft,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Meera limited pilot quotation/proposal execution must be deeply frozen.",
    );
  }
}

export async function executeMeeraLimitedInternalPilotQuotationProposal(
  input:
    ExecuteMeeraLimitedInternalPilotQuotationProposalInput,
): Promise<MeeraLimitedInternalPilotQuotationProposalExecution> {
  requireIdentifier(
    "Meera limited pilot execution identity",
    input.executionId,
  );

  requireIsoTimestamp(
    "Meera limited pilot execution time",
    input.executedAt,
  );

  const decision =
    input.ownerLimitedInternalPilotExecutionDecision;

  const preparation =
    input.limitedInternalPilotPreparation;

  const shadow =
    input.controlledShadowOperationExecution;

  validateSourceBindings(
    decision,
    preparation,
    shadow,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Meera limited internal pilot quotation/proposal execution cannot precede owner approval.",
    );
  }

  let quotationProposalCreatorInvocationCount =
    0;

  quotationProposalCreatorInvocationCount +=
    1;

  if (
    quotationProposalCreatorInvocationCount >
    preparation.pilotPlan
      .concurrentQuotationProposalLimit
  ) {
    throw new Error(
      "Meera limited pilot concurrent recommendation limit was exceeded.",
    );
  }

  if (
    quotationProposalCreatorInvocationCount !==
    1
  ) {
    throw new Error(
      "Meera limited pilot quotation/proposal creator must execute exactly once.",
    );
  }

  const executionCore = {
    version:
      MEERA_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_EXECUTED" as const,

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

    ownerExecutionDecisionId:
      decision.decisionId,

    ownerExecutionDecisionDigest:
      decision.decisionDigest,

    preparationId:
      preparation.preparationId,

    preparationDigest:
      preparation.preparationDigest,

    sourceReviewDecisionId:
      preparation.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      preparation.sourceReviewDecisionDigest,

    controlledShadowExecutionId:
      shadow.executionId,

    controlledShadowExecutionDigest:
      shadow.executionDigest,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    pilotQuotationProposal: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      scenarioId:
        "AUTHORIZED_INQUIRY_AND_RECOMMENDATION_EVIDENCE" as const,

      quotationProposalSequence:
        1 as const,

      maximumQuotationProposalCount:
        3 as const,

      remainingQuotationProposalCapacity:
        2 as const,

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

    syntheticInquiryEvidence:
      shadow.syntheticInquiryEvidence,

    syntheticRecommendationEvidence:
      shadow.syntheticRecommendationEvidence,

    quotationProposalDraft:
      shadow.quotationProposalDraft,

    executionBoundary: {
      ownerExecutionApprovalBound:
        true as const,

      sourcePreparationBound:
        true as const,

      sourceControlledShadowExecutionBound:
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

      concurrentQuotationProposalLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      quotationProposalCreatorInvocationCount:
        1 as const,

      limitedInternalPilotExecutionPerformed:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticQuotationProposalExecutionPerformed:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticRecommendationEvidenceRead:
        true as const,

      quotationProposalDraftCreated:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_QUOTATION_PROPOSAL_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as MeeraLimitedInternalPilotQuotationProposalExecution;

  validateMeeraLimitedInternalPilotQuotationProposalExecution(
    execution,
  );

  return execution;
}
