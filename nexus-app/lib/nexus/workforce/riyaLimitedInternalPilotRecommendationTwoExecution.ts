import {
  createHash,
} from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION,
  validateRiyaLimitedInternalPilotRecommendationTwoPreparation,
  type RiyaLimitedInternalPilotRecommendationTwoPreparation,
} from "./riyaLimitedInternalPilotRecommendationTwoPreparation";

import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION,
  validateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision,
  type RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision,
} from "./riyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision";

export const RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION =
  "nexus-riya-limited-internal-pilot-recommendation-two-execution-v1" as const;

export interface ExecuteRiyaLimitedInternalPilotRecommendationTwoInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotRecommendationTwoExecutionDecision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision;

  readonly limitedInternalPilotRecommendationTwoPreparation:
    RiyaLimitedInternalPilotRecommendationTwoPreparation;

  readonly executedAt:
    string;
}

export interface RiyaLimitedInternalPilotRecommendationTwoExecution {
  readonly version:
    typeof RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTED";

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

  readonly pilotRecommendation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "MISSING_FACT_CLARIFICATION";

    recommendationSequence:
      2;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacity:
      1;

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
      "synthetic-riya-pilot-inquiry-two";

    request:
      "Recommend the most suitable implementation option for this synthetic business case.";

    verifiedFacts:
      readonly string[];

    missingFacts:
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
      "synthetic-riya-pilot-customer-context-two";

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
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION";

    draftSummary:
      "A reliable option cannot be ranked until the missing decision facts are clarified.";

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

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

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

    concurrentRecommendationLimitEnforced:
      true;

    failureThresholdPreserved:
      true;

    recommendationCreatorInvocationCount:
      1;

    recommendationTwoExecutionPerformed:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticRecommendationExecutionPerformed:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticCustomerContextRead:
      true;

    clarificationDraftCreated:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW";

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
  "The synthetic business requested an implementation recommendation.",
  "The recommendation must remain owner-reviewed before any further action.",
] as const;

const MISSING_FACTS = [
  "Approved budget range",
  "Required implementation timeline",
  "Primary decision criteria",
] as const;

const VERIFIED_CONTEXT = [
  "The case is synthetic and sanitized.",
  "No real customer identity or production record is available.",
] as const;

const UNAVAILABLE_CONTEXT = [
  "Confirmed budget",
  "Confirmed deadline",
  "Confirmed priority ranking",
] as const;

const CLARIFYING_QUESTIONS = [
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
      "Unsupported deterministic Riya recommendation two execution value.",
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
      `${label} contains a prohibited credential-bearing term.`,
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

function validateSourceBindings(
  decision:
    RiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision,
  preparation:
    RiyaLimitedInternalPilotRecommendationTwoPreparation,
): void {
  validateRiyaOwnerLimitedInternalPilotRecommendationTwoExecutionDecision(
    decision,
  );

  validateRiyaLimitedInternalPilotRecommendationTwoPreparation(
    preparation,
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION_RECORDED" ||
    decision.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION" ||
    decision.recommendationTwoExecutionAuthorized !==
      true ||
    decision.recommendationTwoExecutionPerformed !==
      false ||
    decision.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO"
  ) {
    throw new Error(
      "An approved Workforce Day 65 Riya recommendation two execution decision is required.",
    );
  }

  if (
    preparation.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_PREPARED" ||
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 64 Riya recommendation two preparation is required.",
    );
  }

  verifyDigestBoundObject(
    "Workforce Day 65 Riya recommendation two execution decision",
    decision,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Workforce Day 64 Riya recommendation two preparation",
    preparation,
    "preparationDigest",
  );

  if (
    decision.preparationId !==
      preparation.preparationId ||
    decision.preparationDigest !==
      preparation.preparationDigest ||
    decision.sourceRecommendationReviewDecisionId !==
      preparation.sourceRecommendationReviewDecisionId ||
    decision.sourceRecommendationReviewDecisionDigest !==
      preparation.sourceRecommendationReviewDecisionDigest ||
    decision.sourceRecommendationExecutionId !==
      preparation.sourceRecommendationExecutionId ||
    decision.sourceRecommendationExecutionDigest !==
      preparation.sourceRecommendationExecutionDigest ||
    decision.ownerExecutionDecisionId !==
      preparation.ownerExecutionDecisionId ||
    decision.ownerExecutionDecisionDigest !==
      preparation.ownerExecutionDecisionDigest ||
    decision.sourcePilotPreparationId !==
      preparation.sourcePilotPreparationId ||
    decision.sourcePilotPreparationDigest !==
      preparation.sourcePilotPreparationDigest ||
    decision.controlledShadowExecutionId !==
      preparation.controlledShadowExecutionId ||
    decision.controlledShadowExecutionDigest !==
      preparation.controlledShadowExecutionDigest ||
    decision.tenantId !==
      preparation.tenantId ||
    decision.ownerId !==
      preparation.ownerId
  ) {
    throw new Error(
      "Riya recommendation two source binding verification failed.",
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
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Riya recommendation two employee identity binding is invalid.",
    );
  }

  const reviewed =
    decision.reviewedPreparation;

  const prepared =
    preparation.preparedRecommendation;

  if (
    reviewed.pilotClass !==
      prepared.pilotClass ||
    reviewed.scenarioId !==
      prepared.scenarioId ||
    reviewed.recommendationSequence !==
      prepared.recommendationSequence ||
    reviewed.priorReviewedRecommendationSequence !==
      prepared.priorReviewedRecommendationSequence ||
    reviewed.maximumRecommendationCount !==
      prepared.maximumRecommendationCount ||
    reviewed.remainingRecommendationCapacityBeforeExecution !==
      prepared.remainingRecommendationCapacityBeforeExecution ||
    reviewed.projectedRemainingRecommendationCapacityAfterExecution !==
      prepared.projectedRemainingRecommendationCapacityAfterExecution ||
    reviewed.concurrentRecommendationLimit !==
      prepared.concurrentRecommendationLimit ||
    reviewed.failureThreshold !==
      prepared.failureThreshold ||
    reviewed.ownerReviewFrequency !==
      prepared.ownerReviewFrequency ||
    reviewed.dataClassification !==
      prepared.dataClassification ||
    reviewed.inquiryEvidenceToolMode !==
      prepared.inquiryEvidenceToolMode ||
    reviewed.customerContextToolMode !==
      prepared.customerContextToolMode ||
    reviewed.recommendationToolId !==
      prepared.recommendationToolId ||
    reviewed.recommendationToolMode !==
      prepared.recommendationToolMode ||
    reviewed.executionMode !==
      prepared.executionMode
  ) {
    throw new Error(
      "Riya recommendation two reviewed preparation binding is invalid.",
    );
  }
}

export function validateRiyaLimitedInternalPilotRecommendationTwoExecution(
  execution:
    RiyaLimitedInternalPilotRecommendationTwoExecution,
): void {
  requireSafeIdentifier(
    "Riya recommendation two execution identity",
    execution.executionId,
  );

  requireSafeIdentifier(
    "Riya recommendation two owner decision identity",
    execution.ownerRecommendationTwoExecutionDecisionId,
  );

  requireSafeIdentifier(
    "Riya recommendation two preparation identity",
    execution.recommendationTwoPreparationId,
  );

  requireSafeIdentifier(
    "Riya recommendation one execution identity",
    execution.sourceRecommendationOneExecutionId,
  );

  requireSafeIdentifier(
    "Riya tenant identity",
    execution.tenantId,
  );

  requireSafeIdentifier(
    "Riya owner identity",
    execution.ownerId,
  );

  requireDigest(
    "Riya recommendation two owner decision digest",
    execution.ownerRecommendationTwoExecutionDecisionDigest,
  );

  requireDigest(
    "Riya recommendation two preparation digest",
    execution.recommendationTwoPreparationDigest,
  );

  requireDigest(
    "Riya recommendation review decision digest",
    execution.sourceRecommendationReviewDecisionDigest,
  );

  requireDigest(
    "Riya recommendation one execution digest",
    execution.sourceRecommendationOneExecutionDigest,
  );

  requireDigest(
    "Riya initial owner pilot execution decision digest",
    execution.initialOwnerPilotExecutionDecisionDigest,
  );

  requireDigest(
    "Riya initial pilot preparation digest",
    execution.initialPilotPreparationDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    execution.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya recommendation two execution time",
    execution.executedAt,
  );

  verifyDigestBoundObject(
    "Riya recommendation two execution",
    execution,
    "executionDigest",
  );

  if (
    execution.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION ||
    execution.executionState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTED" ||
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
      "Riya recommendation two execution identity is invalid.",
    );
  }

  const pilot =
    execution.pilotRecommendation;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "MISSING_FACT_CLARIFICATION" ||
    pilot.recommendationSequence !==
      2 ||
    pilot.maximumRecommendationCount !==
      3 ||
    pilot.remainingRecommendationCapacity !==
      1 ||
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
      "Riya recommendation two pilot scope is invalid.",
    );
  }

  const evidence =
    execution.syntheticInquiryEvidence;

  if (
    evidence.evidenceClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    evidence.inquiryId !==
      "synthetic-riya-pilot-inquiry-two" ||
    evidence.request !==
      "Recommend the most suitable implementation option for this synthetic business case." ||
    !sameStringArray(
      evidence.verifiedFacts,
      VERIFIED_FACTS,
    ) ||
    !sameStringArray(
      evidence.missingFacts,
      MISSING_FACTS,
    ) ||
    evidence.unsupportedFactsInvented !==
      false ||
    evidence.crossCustomerEvidenceUsed !==
      false ||
    evidence.crossTenantEvidenceUsed !==
      false
  ) {
    throw new Error(
      "Riya recommendation two synthetic inquiry evidence is invalid.",
    );
  }

  const context =
    execution.syntheticCustomerContext;

  if (
    context.contextClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    context.contextId !==
      "synthetic-riya-pilot-customer-context-two" ||
    !sameStringArray(
      context.verifiedContext,
      VERIFIED_CONTEXT,
    ) ||
    !sameStringArray(
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
      "Riya recommendation two synthetic customer context is invalid.",
    );
  }

  const draft =
    execution.recommendationDraft;

  if (
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.recommendationOutcome !==
      "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" ||
    draft.draftSummary !==
      "A reliable option cannot be ranked until the missing decision facts are clarified." ||
    !sameStringArray(
      draft.verifiedFacts,
      VERIFIED_FACTS,
    ) ||
    !sameStringArray(
      draft.missingFacts,
      MISSING_FACTS,
    ) ||
    !sameStringArray(
      draft.clarifyingQuestions,
      CLARIFYING_QUESTIONS,
    ) ||
    draft.assumptionsMade !==
      false ||
    draft.missingFactsExplicit !==
      true ||
    draft.verifiedFactsSeparatedFromAssumptions !==
      true ||
    draft.uncertaintyPreserved !==
      true ||
    draft.unsupportedClaimsIncluded !==
      false ||
    draft.urgencyExaggerated !==
      false ||
    draft.guaranteeMade !==
      false ||
    draft.ownerDecisionMade !==
      false ||
    draft.customerDeliveryPrepared !==
      false ||
    draft.customerDeliveryExecuted !==
      false
  ) {
    throw new Error(
      "Riya recommendation two clarification draft is invalid.",
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
    boundary.concurrentRecommendationLimitEnforced !==
      true ||
    boundary.failureThresholdPreserved !==
      true ||
    boundary.recommendationCreatorInvocationCount !==
      1 ||
    boundary.recommendationTwoExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticRecommendationExecutionPerformed !==
      true ||
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticCustomerContextRead !==
      true ||
    boundary.clarificationDraftCreated !==
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
      true ||
    execution.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW"
  ) {
    throw new Error(
      "Riya recommendation two execution authority boundary is invalid.",
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
        .missingFacts,
    ) ||
    !Object.isFrozen(
      execution.syntheticCustomerContext,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft
        .clarifyingQuestions,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Riya recommendation two execution must be deeply frozen.",
    );
  }
}

export async function executeRiyaLimitedInternalPilotRecommendationTwo(
  input:
    ExecuteRiyaLimitedInternalPilotRecommendationTwoInput,
): Promise<RiyaLimitedInternalPilotRecommendationTwoExecution> {
  requireSafeIdentifier(
    "Riya recommendation two execution identity",
    input.executionId,
  );

  requireIsoTimestamp(
    "Riya recommendation two execution time",
    input.executedAt,
  );

  const decision =
    input.ownerLimitedInternalPilotRecommendationTwoExecutionDecision;

  const preparation =
    input.limitedInternalPilotRecommendationTwoPreparation;

  validateSourceBindings(
    decision,
    preparation,
  );

  if (
    Date.parse(input.executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Riya recommendation two execution cannot precede owner approval.",
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
      "Riya recommendation two concurrent execution limit was exceeded.",
    );
  }

  if (
    recommendationCreatorInvocationCount !==
      1
  ) {
    throw new Error(
      "Riya recommendation two creator must execute exactly once.",
    );
  }

  const executionCore = {
    version:
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_EXECUTED" as const,

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

    ownerRecommendationTwoExecutionDecisionId:
      decision.decisionId,

    ownerRecommendationTwoExecutionDecisionDigest:
      decision.decisionDigest,

    recommendationTwoPreparationId:
      preparation.preparationId,

    recommendationTwoPreparationDigest:
      preparation.preparationDigest,

    sourceRecommendationReviewDecisionId:
      preparation.sourceRecommendationReviewDecisionId,

    sourceRecommendationReviewDecisionDigest:
      preparation.sourceRecommendationReviewDecisionDigest,

    sourceRecommendationOneExecutionId:
      preparation.sourceRecommendationExecutionId,

    sourceRecommendationOneExecutionDigest:
      preparation.sourceRecommendationExecutionDigest,

    initialOwnerPilotExecutionDecisionId:
      preparation.ownerExecutionDecisionId,

    initialOwnerPilotExecutionDecisionDigest:
      preparation.ownerExecutionDecisionDigest,

    initialPilotPreparationId:
      preparation.sourcePilotPreparationId,

    initialPilotPreparationDigest:
      preparation.sourcePilotPreparationDigest,

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
        "MISSING_FACT_CLARIFICATION" as const,

      recommendationSequence:
        2 as const,

      maximumRecommendationCount:
        3 as const,

      remainingRecommendationCapacity:
        1 as const,

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
        "synthetic-riya-pilot-inquiry-two" as const,

      request:
        "Recommend the most suitable implementation option for this synthetic business case." as const,

      verifiedFacts:
        [...VERIFIED_FACTS],

      missingFacts:
        [...MISSING_FACTS],

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
        "synthetic-riya-pilot-customer-context-two" as const,

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
        "CLARIFICATION_REQUIRED_BEFORE_RECOMMENDATION" as const,

      draftSummary:
        "A reliable option cannot be ranked until the missing decision facts are clarified." as const,

      verifiedFacts:
        [...VERIFIED_FACTS],

      missingFacts:
        [...MISSING_FACTS],

      clarifyingQuestions:
        [...CLARIFYING_QUESTIONS],

      assumptionsMade:
        false as const,

      missingFactsExplicit:
        true as const,

      verifiedFactsSeparatedFromAssumptions:
        true as const,

      uncertaintyPreserved:
        true as const,

      unsupportedClaimsIncluded:
        false as const,

      urgencyExaggerated:
        false as const,

      guaranteeMade:
        false as const,

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

      concurrentRecommendationLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      recommendationCreatorInvocationCount:
        recommendationCreatorInvocationCount as 1,

      recommendationTwoExecutionPerformed:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticRecommendationExecutionPerformed:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticCustomerContextRead:
        true as const,

      clarificationDraftCreated:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_TWO_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as RiyaLimitedInternalPilotRecommendationTwoExecution;

  validateRiyaLimitedInternalPilotRecommendationTwoExecution(
    execution,
  );

  return execution;
}