import { createHash } from "node:crypto";

import {
  RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,
  validateRiyaLimitedInternalPilotPreparation,
  type RiyaLimitedInternalPilotPreparation,
} from "./riyaLimitedInternalPilotPreparation";

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION =
  "nexus-riya-owner-limited-internal-pilot-execution-decision-v1" as const;

export const RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION",
  "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION",
] as const;

export type RiyaOwnerLimitedInternalPilotExecutionDecisionType =
  (
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISIONS
  )[number];

export interface CreateRiyaOwnerLimitedInternalPilotExecutionDecisionInput {
  readonly limitedInternalPilotPreparation:
    RiyaLimitedInternalPilotPreparation;

  readonly decisionId:
    string;

  readonly ownerId:
    string;

  readonly decision:
    RiyaOwnerLimitedInternalPilotExecutionDecisionType;

  readonly reason:
    string;

  readonly decidedAt:
    string;
}

export interface RiyaOwnerLimitedInternalPilotExecutionDecision {
  readonly version:
    typeof RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION;

  readonly decisionId:
    string;

  readonly decisionState:
    "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED";

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

  readonly decision:
    RiyaOwnerLimitedInternalPilotExecutionDecisionType;

  readonly approvedForLimitedInternalPilotExecution:
    boolean;

  readonly reason:
    string;

  readonly reviewedPilotPreparation: Readonly<{
    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    inquiryEvidenceToolMode:
      "READ_ONLY";

    customerContextToolMode:
      "READ_ONLY";

    recommendationToolMode:
      "DRAFT_ONLY";

    maximumRecommendationCount:
      3;

    concurrentRecommendationLimit:
      1;

    failureThreshold:
      1;

    ownerReviewFrequency:
      "AFTER_EVERY_RECOMMENDATION";

    externalDeliveryMode:
      "DISABLED";

    productionMutationMode:
      "DISABLED";

    scenarioCount:
      3;

    specialistStandardBound:
      true;

    transparentAIIdentityRequired:
      true;

    customerDeliveryRequiresSeparateOwnerAuthority:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    sourcePreparationIntegrityVerified:
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

    limitedInternalPilotPreparationAuthorized:
      true;

    limitedInternalPilotExecutionAuthorized:
      boolean;

    limitedInternalPilotExecutionPerformed:
      false;

    syntheticRecommendationExecutionPerformed:
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
    | "EXECUTE_LIMITED_INTERNAL_PILOT"
    | "RETAIN_LIMITED_INTERNAL_PILOT_PREPARATION_ONLY";

  readonly decidedAt:
    string;

  readonly decisionDigest:
    string;
}

type UnknownRecord =
  Record<string, unknown>;

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

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function normalizeForDigest(
  value: unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      normalizeForDigest,
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const source =
      value as UnknownRecord;

    const normalized:
      UnknownRecord = {};

    for (
      const key of Object.keys(source).sort()
    ) {
      normalized[key] =
        normalizeForDigest(
          source[key],
        );
    }

    return normalized;
  }

  if (
    value === undefined ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint"
  ) {
    throw new Error(
      "Unsupported deterministic Riya owner execution-decision value.",
    );
  }

  return value;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      JSON.stringify(
        normalizeForDigest(value),
      ),
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const child of Object.values(
        value as UnknownRecord,
      )
    ) {
      deepFreeze(child);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }

  return value;
}

function requireDigest(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }

  return value;
}

function requireIsoTimestamp(
  label: string,
  value: unknown,
): string {
  if (
    typeof value !== "string" ||
    !Number.isFinite(
      Date.parse(value),
    ) ||
    new Date(value).toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }

  return value;
}

function requireReason(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    throw new Error(
      "A clear Riya owner execution-decision reason is required.",
    );
  }

  const reason =
    value.trim();

  if (
    reason.length < 8 ||
    reason.length > 500
  ) {
    throw new Error(
      "Riya owner execution-decision reason must contain 8 to 500 characters.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(reason)
  ) {
    throw new Error(
      "Riya owner execution-decision reason contains secret-bearing information.",
    );
  }

  return reason;
}

function requireDecision(
  value: unknown,
): RiyaOwnerLimitedInternalPilotExecutionDecisionType {
  if (
    value !==
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION" &&
    value !==
      "REJECT_LIMITED_INTERNAL_PILOT_EXECUTION"
  ) {
    throw new Error(
      "Riya owner limited internal pilot execution decision is invalid.",
    );
  }

  return value;
}

function validateReviewedPreparation(
  reviewed:
    RiyaOwnerLimitedInternalPilotExecutionDecision[
      "reviewedPilotPreparation"
    ],
): void {
  if (
    reviewed.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    reviewed.executionMode !==
      "SANDBOX_ONLY" ||
    reviewed.inquiryEvidenceToolMode !==
      "READ_ONLY" ||
    reviewed.customerContextToolMode !==
      "READ_ONLY" ||
    reviewed.recommendationToolMode !==
      "DRAFT_ONLY" ||
    reviewed.maximumRecommendationCount !==
      3 ||
    reviewed.concurrentRecommendationLimit !==
      1 ||
    reviewed.failureThreshold !==
      1 ||
    reviewed.ownerReviewFrequency !==
      "AFTER_EVERY_RECOMMENDATION" ||
    reviewed.externalDeliveryMode !==
      "DISABLED" ||
    reviewed.productionMutationMode !==
      "DISABLED" ||
    reviewed.scenarioCount !==
      3 ||
    reviewed.specialistStandardBound !==
      true ||
    reviewed.transparentAIIdentityRequired !==
      true ||
    reviewed.customerDeliveryRequiresSeparateOwnerAuthority !==
      true
  ) {
    throw new Error(
      "Riya reviewed limited internal pilot preparation is invalid.",
    );
  }
}

function validateAuthorityBoundary(
  decision:
    RiyaOwnerLimitedInternalPilotExecutionDecision,
): void {
  const boundary =
    decision.authorityBoundary;

  if (
    boundary.sourcePreparationIntegrityVerified !==
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
    boundary.limitedInternalPilotPreparationAuthorized !==
      true ||
    boundary.limitedInternalPilotExecutionAuthorized !==
      decision.approvedForLimitedInternalPilotExecution ||
    boundary.limitedInternalPilotExecutionPerformed !==
      false ||
    boundary.syntheticRecommendationExecutionPerformed !==
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
      "Riya owner limited internal pilot execution authority boundary is invalid.",
    );
  }
}

export function validateRiyaOwnerLimitedInternalPilotExecutionDecision(
  decision:
    RiyaOwnerLimitedInternalPilotExecutionDecision,
): void {
  if (
    decision.version !==
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION ||
    decision.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED" ||
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
      "Riya owner limited internal pilot execution decision identity is invalid.",
    );
  }

  requireIdentifier(
    "Riya owner execution decisionId",
    decision.decisionId,
  );

  requireIdentifier(
    "Riya limited internal pilot preparationId",
    decision.preparationId,
  );

  requireIdentifier(
    "Riya source review decisionId",
    decision.sourceReviewDecisionId,
  );

  requireIdentifier(
    "Riya controlled shadow executionId",
    decision.controlledShadowExecutionId,
  );

  requireIdentifier(
    "Riya tenantId",
    decision.tenantId,
  );

  requireIdentifier(
    "Riya ownerId",
    decision.ownerId,
  );

  requireDigest(
    "Riya limited internal pilot preparation digest",
    decision.preparationDigest,
  );

  requireDigest(
    "Riya source review decision digest",
    decision.sourceReviewDecisionDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    decision.controlledShadowExecutionDigest,
  );

  requireDigest(
    "Riya owner execution decision digest",
    decision.decisionDigest,
  );

  requireIsoTimestamp(
    "Riya owner execution decision time",
    decision.decidedAt,
  );

  requireReason(
    decision.reason,
  );

  const validatedDecision =
    requireDecision(
      decision.decision,
    );

  const approved =
    validatedDecision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION";

  if (
    decision.approvedForLimitedInternalPilotExecution !==
      approved ||
    decision.nextStep !==
      (
        approved
          ? "EXECUTE_LIMITED_INTERNAL_PILOT"
          : "RETAIN_LIMITED_INTERNAL_PILOT_PREPARATION_ONLY"
      )
  ) {
    throw new Error(
      "Riya owner limited internal pilot execution decision state is invalid.",
    );
  }

  validateReviewedPreparation(
    decision.reviewedPilotPreparation,
  );

  validateAuthorityBoundary(
    decision,
  );

  const {
    decisionDigest:
      ignoredDecisionDigest,
    ...decisionCore
  } = decision;

  void ignoredDecisionDigest;

  if (
    sha256(decisionCore) !==
      decision.decisionDigest
  ) {
    throw new Error(
      "Workforce Day 61 Riya owner execution decision integrity verification failed.",
    );
  }
}

export function createRiyaOwnerLimitedInternalPilotExecutionDecision(
  input:
    CreateRiyaOwnerLimitedInternalPilotExecutionDecisionInput,
): RiyaOwnerLimitedInternalPilotExecutionDecision {
  const decisionId =
    requireIdentifier(
      "Riya owner execution decisionId",
      input.decisionId,
    );

  const ownerId =
    requireIdentifier(
      "Riya ownerId",
      input.ownerId,
    );

  const decision =
    requireDecision(
      input.decision,
    );

  const reason =
    requireReason(
      input.reason,
    );

  const decidedAt =
    requireIsoTimestamp(
      "Riya owner execution decision time",
      input.decidedAt,
    );

  const source =
    input.limitedInternalPilotPreparation;

  validateRiyaLimitedInternalPilotPreparation(
    source,
  );

  if (
    source.version !==
      RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION ||
    source.preparationState !==
      "LIMITED_INTERNAL_PILOT_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION"
  ) {
    throw new Error(
      "A valid Workforce Day 60 Riya limited internal pilot preparation is required.",
    );
  }

  if (
    ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the preparation-bound owner can issue Riya's limited internal pilot execution decision.",
    );
  }

  if (
    Date.parse(decidedAt) <
      Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Riya limited internal pilot execution decision cannot precede its preparation.",
    );
  }

  const approved =
    decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_EXECUTION";

  const decisionCore = {
    version:
      RIYA_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_VERSION,

    decisionId,

    decisionState:
      "OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION_RECORDED" as const,

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

    sourceReviewDecisionId:
      source.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      source.sourceReviewDecisionDigest,

    controlledShadowExecutionId:
      source.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      source.controlledShadowExecutionDigest,

    tenantId:
      source.tenantId,

    ownerId,

    decision,

    approvedForLimitedInternalPilotExecution:
      approved,

    reason,

    reviewedPilotPreparation: {
      dataClassification:
        source.pilotPlan.dataClassification,

      executionMode:
        source.pilotPlan.executionMode,

      inquiryEvidenceToolMode:
        source.pilotPlan.inquiryEvidenceToolMode,

      customerContextToolMode:
        source.pilotPlan.customerContextToolMode,

      recommendationToolMode:
        source.pilotPlan.recommendationToolMode,

      maximumRecommendationCount:
        source.pilotPlan.maximumRecommendationCount,

      concurrentRecommendationLimit:
        source.pilotPlan.concurrentRecommendationLimit,

      failureThreshold:
        source.pilotPlan.failureThreshold,

      ownerReviewFrequency:
        source.pilotPlan.ownerReviewFrequency,

      externalDeliveryMode:
        source.pilotPlan.externalDeliveryMode,

      productionMutationMode:
        source.pilotPlan.productionMutationMode,

      scenarioCount:
        source.pilotPlan.scenarios.length as 3,

      specialistStandardBound:
        true as const,

      transparentAIIdentityRequired:
        source.specialistStandard.aiIdentityTransparent,

      customerDeliveryRequiresSeparateOwnerAuthority:
        source.specialistStandard
          .customerDeliveryRequiresSeparateOwnerAuthority,
    },

    authorityBoundary: {
      sourcePreparationIntegrityVerified:
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

      limitedInternalPilotPreparationAuthorized:
        true as const,

      limitedInternalPilotExecutionAuthorized:
        approved,

      limitedInternalPilotExecutionPerformed:
        false as const,

      syntheticRecommendationExecutionPerformed:
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
        ? "EXECUTE_LIMITED_INTERNAL_PILOT" as const
        : "RETAIN_LIMITED_INTERNAL_PILOT_PREPARATION_ONLY" as const,

    decidedAt,
  };

  const result =
    deepFreeze({
      ...decisionCore,

      decisionDigest:
        sha256(decisionCore),
    }) as RiyaOwnerLimitedInternalPilotExecutionDecision;

  validateRiyaOwnerLimitedInternalPilotExecutionDecision(
    result,
  );

  return result;
}