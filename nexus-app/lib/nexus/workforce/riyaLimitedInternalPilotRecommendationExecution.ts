import {
  createHash,
} from "node:crypto";

import {
  validateRiyaControlledShadowOperationExecution,
  type RiyaControlledShadowOperationExecution,
} from "./riyaControlledShadowOperationExecution";

import {
  RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,
  validateRiyaLimitedInternalPilotPreparation,
  type RiyaLimitedInternalPilotPreparation,
} from "./riyaLimitedInternalPilotPreparation";

import {
  RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION,
  validateRiyaOwnerLimitedInternalPilotExecutionDecision,
  type RiyaOwnerLimitedInternalPilotExecutionDecision,
} from "./riyaOwnerLimitedInternalPilotExecutionDecision";

export const RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTION_VERSION =
  "nexus-riya-limited-internal-pilot-recommendation-execution-v1" as const;

export interface ExecuteRiyaLimitedInternalPilotRecommendationInput {
  readonly executionId:
    string;

  readonly ownerLimitedInternalPilotExecutionDecision:
    RiyaOwnerLimitedInternalPilotExecutionDecision;

  readonly limitedInternalPilotPreparation:
    RiyaLimitedInternalPilotPreparation;

  readonly controlledShadowOperationExecution:
    RiyaControlledShadowOperationExecution;

  readonly executedAt:
    string;
}

export interface RiyaLimitedInternalPilotRecommendationExecution {
  readonly version:
    typeof RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTED";

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

  readonly pilotRecommendation: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";

    scenarioId:
      "EVIDENCE_GROUNDED_RECOMMENDATION";

    recommendationSequence:
      1;

    maximumRecommendationCount:
      3;

    remainingRecommendationCapacity:
      2;

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

  readonly syntheticInquiryEvidence:
    RiyaControlledShadowOperationExecution[
      "syntheticInquiryEvidence"
    ];

  readonly syntheticCustomerContext:
    RiyaControlledShadowOperationExecution[
      "syntheticCustomerContext"
    ];

  readonly recommendationDraft:
    RiyaControlledShadowOperationExecution[
      "recommendationDraft"
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

    limitedInternalPilotExecutionPerformed:
      true;

    limitedInternalPilotCompleted:
      false;

    syntheticRecommendationExecutionPerformed:
      true;

    syntheticInquiryEvidenceRead:
      true;

    syntheticCustomerContextRead:
      true;

    recommendationDraftCreated:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW";

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
      "Unsupported deterministic Riya pilot execution value.",
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
    RiyaOwnerLimitedInternalPilotExecutionDecision,

  preparation:
    RiyaLimitedInternalPilotPreparation,

  shadow:
    RiyaControlledShadowOperationExecution,
): void {
  validateRiyaOwnerLimitedInternalPilotExecutionDecision(
    decision,
  );

  validateRiyaLimitedInternalPilotPreparation(
    preparation,
  );

  validateRiyaControlledShadowOperationExecution(
    shadow,
  );

  verifyDigestBoundObject(
    "Riya owner pilot execution decision",
    decision,
    "decisionDigest",
  );

  verifyDigestBoundObject(
    "Riya limited pilot preparation",
    preparation,
    "preparationDigest",
  );

  verifyDigestBoundObject(
    "Riya controlled shadow execution",
    shadow,
    "executionDigest",
  );

  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION ||
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
      "An approved Workforce Day 61 Riya pilot execution decision is required.",
    );
  }

  if (
    preparation.version !==
      RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_PREPARED"
  ) {
    throw new Error(
      "A valid Workforce Day 60 Riya pilot preparation is required.",
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
      "Riya limited pilot employee identity has changed.",
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
      "Riya limited pilot source binding verification failed.",
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
    plan.customerContextToolMode !==
      "READ_ONLY" ||
    plan.recommendationToolMode !==
      "DRAFT_ONLY" ||
    plan.maximumRecommendationCount !==
      3 ||
    plan.concurrentRecommendationLimit !==
      1 ||
    plan.failureThreshold !==
      1 ||
    plan.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    plan.externalDeliveryMode !==
      "DISABLED" ||
    plan.productionMutationMode !==
      "DISABLED" ||
    plan.scenarios.length !==
      3 ||
    plan.scenarios[0] !==
      "EVIDENCE_GROUNDED_RECOMMENDATION" ||
    plan.scenarios[1] !==
      "MISSING_FACT_CLARIFICATION" ||
    plan.scenarios[2] !==
      "RISK_AWARE_TRADEOFF_COMPARISON"
  ) {
    throw new Error(
      "Workforce Day 60 Riya pilot plan has changed.",
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
    reviewed.customerContextToolMode !==
      plan.customerContextToolMode ||
    reviewed.recommendationToolMode !==
      plan.recommendationToolMode ||
    reviewed.maximumRecommendationCount !==
      plan.maximumRecommendationCount ||
    reviewed.concurrentRecommendationLimit !==
      plan.concurrentRecommendationLimit ||
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
    reviewed.customerDeliveryRequiresSeparateOwnerAuthority !==
      true
  ) {
    throw new Error(
      "Workforce Day 61 reviewed Riya pilot scope has changed.",
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
    decisionBoundary.syntheticRecommendationExecutionPerformed !==
      false ||
    decisionBoundary.recommendationCustomerDeliveryAuthorized !==
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
    decisionBoundary.ownerReviewAfterEveryRecommendation !==
      true ||
    decisionBoundary.emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Workforce Day 61 Riya execution authority boundary has changed.",
    );
  }

  const shadowBoundary =
    shadow.executionBoundary;

  if (
    shadowBoundary.recommendationCreatorInvocationCount !==
      1 ||
    shadowBoundary.shadowExecutionExecuted !==
      true ||
    shadowBoundary.syntheticInquiryEvidenceRead !==
      true ||
    shadowBoundary.syntheticCustomerContextRead !==
      true ||
    shadowBoundary.recommendationDraftCreated !==
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
      "Verified Riya controlled shadow execution boundary has changed.",
    );
  }

  const draft =
    shadow.recommendationDraft;

  if (
    shadow.syntheticInquiryEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    shadow.syntheticInquiryEvidence.unsupportedFactsInvented !==
      false ||
    shadow.syntheticCustomerContext.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    shadow.syntheticCustomerContext.approvedTenantContextOnly !==
      true ||
    shadow.syntheticCustomerContext.crossCustomerContextUsed !==
      false ||
    shadow.syntheticCustomerContext.crossTenantContextUsed !==
      false ||
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
    draft.toolId !==
      "tool-recommendation-draft" ||
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
      "Verified Riya synthetic recommendation evidence is unsafe.",
    );
  }
}

export function validateRiyaLimitedInternalPilotRecommendationExecution(
  execution:
    RiyaLimitedInternalPilotRecommendationExecution,
): void {
  requireIdentifier(
    "Riya limited pilot execution identity",
    execution.executionId,
  );

  requireIdentifier(
    "Riya owner execution decision identity",
    execution.ownerExecutionDecisionId,
  );

  requireIdentifier(
    "Riya limited pilot preparation identity",
    execution.preparationId,
  );

  requireIdentifier(
    "Riya source review decision identity",
    execution.sourceReviewDecisionId,
  );

  requireIdentifier(
    "Riya controlled shadow execution identity",
    execution.controlledShadowExecutionId,
  );

  requireIdentifier(
    "Riya tenant identity",
    execution.tenantId,
  );

  requireIdentifier(
    "Riya owner identity",
    execution.ownerId,
  );

  requireDigest(
    "Riya owner execution decision digest",
    execution.ownerExecutionDecisionDigest,
  );

  requireDigest(
    "Riya limited pilot preparation digest",
    execution.preparationDigest,
  );

  requireDigest(
    "Riya source review decision digest",
    execution.sourceReviewDecisionDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    execution.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya limited pilot execution time",
    execution.executedAt,
  );

  verifyDigestBoundObject(
    "Riya limited pilot recommendation execution",
    execution,
    "executionDigest",
  );

  if (
    execution.version !==
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTION_VERSION ||
    execution.executionState !==
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTED" ||
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
      "Riya limited pilot recommendation execution identity is invalid.",
    );
  }

  const pilot =
    execution.pilotRecommendation;

  if (
    pilot.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    pilot.scenarioId !==
      "EVIDENCE_GROUNDED_RECOMMENDATION" ||
    pilot.recommendationSequence !==
      1 ||
    pilot.maximumRecommendationCount !==
      3 ||
    pilot.remainingRecommendationCapacity !==
      2 ||
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
      "Riya limited pilot recommendation scope is invalid.",
    );
  }

  const draft =
    execution.recommendationDraft;

  if (
    execution.syntheticInquiryEvidence.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticInquiryEvidence.unsupportedFactsInvented !==
      false ||
    execution.syntheticCustomerContext.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    execution.syntheticCustomerContext.crossCustomerContextUsed !==
      false ||
    execution.syntheticCustomerContext.crossTenantContextUsed !==
      false ||
    draft.recommendationStatus !==
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
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
      "Riya limited pilot recommendation evidence is invalid.",
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
    boundary.limitedInternalPilotExecutionPerformed !==
      true ||
    boundary.limitedInternalPilotCompleted !==
      false ||
    boundary.syntheticRecommendationExecutionPerformed !==
      true ||
    boundary.syntheticInquiryEvidenceRead !==
      true ||
    boundary.syntheticCustomerContextRead !==
      true ||
    boundary.recommendationDraftCreated !==
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW"
  ) {
    throw new Error(
      "Riya limited pilot execution authority boundary is invalid.",
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
      execution.syntheticCustomerContext,
    ) ||
    !Object.isFrozen(
      execution.recommendationDraft,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Riya limited pilot recommendation execution must be deeply frozen.",
    );
  }
}

export async function executeRiyaLimitedInternalPilotRecommendation(
  input:
    ExecuteRiyaLimitedInternalPilotRecommendationInput,
): Promise<RiyaLimitedInternalPilotRecommendationExecution> {
  requireIdentifier(
    "Riya limited pilot execution identity",
    input.executionId,
  );

  requireIsoTimestamp(
    "Riya limited pilot execution time",
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
      "Riya limited internal pilot recommendation execution cannot precede owner approval.",
    );
  }

  let recommendationCreatorInvocationCount =
    0;

  recommendationCreatorInvocationCount +=
    1;

  if (
    recommendationCreatorInvocationCount >
    preparation.pilotPlan
      .concurrentRecommendationLimit
  ) {
    throw new Error(
      "Riya limited pilot concurrent recommendation limit was exceeded.",
    );
  }

  if (
    recommendationCreatorInvocationCount !==
    1
  ) {
    throw new Error(
      "Riya limited pilot recommendation creator must execute exactly once.",
    );
  }

  const executionCore = {
    version:
      RIYA_LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_RECOMMENDATION_EXECUTED" as const,

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

    pilotRecommendation: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      scenarioId:
        "EVIDENCE_GROUNDED_RECOMMENDATION" as const,

      recommendationSequence:
        1 as const,

      maximumRecommendationCount:
        3 as const,

      remainingRecommendationCapacity:
        2 as const,

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

    syntheticInquiryEvidence:
      shadow.syntheticInquiryEvidence,

    syntheticCustomerContext:
      shadow.syntheticCustomerContext,

    recommendationDraft:
      shadow.recommendationDraft,

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

      recommendationSequenceEnforced:
        true as const,

      maximumRecommendationCountPreserved:
        true as const,

      concurrentRecommendationLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      recommendationCreatorInvocationCount:
        1 as const,

      limitedInternalPilotExecutionPerformed:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticRecommendationExecutionPerformed:
        true as const,

      syntheticInquiryEvidenceRead:
        true as const,

      syntheticCustomerContextRead:
        true as const,

      recommendationDraftCreated:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_RECOMMENDATION_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as RiyaLimitedInternalPilotRecommendationExecution;

  validateRiyaLimitedInternalPilotRecommendationExecution(
    execution,
  );

  return execution;
}