import {
  createHash,
} from "node:crypto";

import {
  validateRiyaOwnerControlledShadowOperationReviewDecision,
  type RiyaOwnerControlledShadowOperationReviewDecision,
} from "./riyaOwnerControlledShadowOperationReviewDecision";

export const RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION =
  "nexus-riya-limited-internal-pilot-preparation-v1" as const;

export const RIYA_LIMITED_INTERNAL_PILOT_SCENARIOS = [
  "EVIDENCE_GROUNDED_RECOMMENDATION",
  "MISSING_FACT_CLARIFICATION",
  "RISK_AWARE_TRADEOFF_COMPARISON",
] as const;

export type RiyaLimitedInternalPilotScenario =
  (
    typeof RIYA_LIMITED_INTERNAL_PILOT_SCENARIOS
  )[number];

export interface CreateRiyaLimitedInternalPilotPreparationInput {
  readonly preparationId:
    string;

  readonly ownerControlledShadowOperationReviewDecision:
    RiyaOwnerControlledShadowOperationReviewDecision;

  readonly preparedAt:
    string;
}

export interface RiyaLimitedInternalPilotPreparation {
  readonly version:
    typeof RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION;

  readonly preparationId:
    string;

  readonly preparationState:
    "LIMITED_INTERNAL_PILOT_PREPARED";

  readonly sourceReviewDecisionId:
    string;

  readonly sourceReviewDecisionDigest:
    string;

  readonly controlledShadowExecutionId:
    string;

  readonly controlledShadowExecutionDigest:
    string;

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

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly pilotPlan: Readonly<{
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

    scenarios:
      readonly RiyaLimitedInternalPilotScenario[];
  }>;

  readonly specialistStandard: Readonly<{
    aiIdentityTransparent:
      true;

    evidenceGroundingRequired:
      true;

    verifiedFactsSeparatedFromAssumptions:
      true;

    missingFactsIdentified:
      true;

    clarificationBeforeGuessingRequired:
      true;

    riskLevelRequired:
      true;

    uncertaintyRequired:
      true;

    practicalTradeoffsRequired:
      true;

    ownerReadyBriefRequired:
      true;

    unsupportedClaimsBlocked:
      true;

    urgencyExaggerationBlocked:
      true;

    guaranteeBlocked:
      true;

    crossCustomerContextBlocked:
      true;

    crossTenantContextBlocked:
      true;

    customerDeliveryRequiresSeparateOwnerAuthority:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
    ownerReviewDecisionBound:
      true;

    ownerReviewDecisionIntegrityVerified:
      true;

    ownerPilotPreparationApprovalBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    controlledShadowExecutionBound:
      true;

    approvalBypassAllowed:
      false;

    limitedInternalPilotPreparationAuthorized:
      true;

    limitedInternalPilotExecutionAuthorized:
      false;

    syntheticRecommendationExecutionAuthorized:
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
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION";

  readonly preparedAt:
    string;

  readonly preparationDigest:
    string;
}

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

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

function normalizeForDigest(
  value:
    unknown,
): unknown {
  if (Array.isArray(value)) {
    return value.map(
      normalizeForDigest,
    );
  }

  if (
    value !== null &&
    typeof value ===
      "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [
          key,
          normalizeForDigest(
            record[key],
          ),
        ]),
    );
  }

  return value;
}

function sha256(
  value:
    unknown,
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
  value:
    T,
): Readonly<T> {
  if (
    value !== null &&
    typeof value ===
      "object" &&
    !Object.isFrozen(value)
  ) {
    for (
      const child of Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(child);
    }

    Object.freeze(value);
  }

  return value;
}

function requireIdentifier(
  field:
    string,
  value:
    string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${field} is invalid.`,
    );
  }
}

function requireDigest(
  field:
    string,
  value:
    string,
): void {
  if (
    !SHA_256_PATTERN.test(value)
  ) {
    throw new Error(
      `${field} is invalid.`,
    );
  }
}

function requireIsoTimestamp(
  field:
    string,
  value:
    string,
): void {
  const parsed =
    Date.parse(value);

  if (
    !Number.isFinite(parsed) ||
    new Date(parsed).toISOString() !==
      value
  ) {
    throw new Error(
      `${field} is invalid.`,
    );
  }
}

function validateApprovedOwnerReviewDecision(
  source:
    RiyaOwnerControlledShadowOperationReviewDecision,
): void {
  validateRiyaOwnerControlledShadowOperationReviewDecision(
    source,
  );

  if (
    source.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" ||
    source.shadowOperationApproved !==
      true ||
    source.limitedInternalPilotPreparationEligible !==
      true ||
    source.nextStep !==
      "PREPARE_LIMITED_INTERNAL_PILOT"
  ) {
    throw new Error(
      "Limited internal pilot preparation requires explicit Riya owner approval.",
    );
  }

  if (
    source.authorityBoundary
      .limitedInternalPilotPreparationAuthorized !==
      true ||
    source.authorityBoundary
      .limitedInternalPilotExecutionAuthorized !==
      false ||
    source.authorityBoundary
      .approvalBypassAllowed !==
      false ||
    source.authorityBoundary
      .recommendationCustomerDeliveryAuthorized !==
      false ||
    source.authorityBoundary
      .realCustomerDataAccessAuthorized !==
      false ||
    source.authorityBoundary
      .realCustomerContactAuthorized !==
      false ||
    source.authorityBoundary
      .externalDeliveryAuthorized !==
      false ||
    source.authorityBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    source.authorityBoundary
      .productionDatabaseAuthorized !==
      false ||
    source.authorityBoundary
      .productionMutationAuthorized !==
      false ||
    source.authorityBoundary
      .paymentExecutionAuthorized !==
      false ||
    source.authorityBoundary
      .autonomousDecisionAuthorized !==
      false ||
    source.authorityBoundary
      .productionReadinessAuthorized !==
      false ||
    source.authorityBoundary
      .publicLaunchAuthorized !==
      false ||
    source.authorityBoundary
      .emergencyPauseAvailable !==
      true
  ) {
    throw new Error(
      "Riya owner review limited-pilot authority boundary is invalid.",
    );
  }
}

export function validateRiyaLimitedInternalPilotPreparation(
  preparation:
    RiyaLimitedInternalPilotPreparation,
): void {
  if (
    preparation.version !==
      RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION ||
    preparation.preparationState !==
      "LIMITED_INTERNAL_PILOT_PREPARED" ||
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
    preparation.nextStep !==
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Riya limited internal pilot preparation identity is invalid.",
    );
  }

  requireIdentifier(
    "Riya limited internal pilot preparationId",
    preparation.preparationId,
  );

  requireIdentifier(
    "Riya source review decisionId",
    preparation.sourceReviewDecisionId,
  );

  requireIdentifier(
    "Riya controlled shadow executionId",
    preparation.controlledShadowExecutionId,
  );

  requireIdentifier(
    "Riya tenantId",
    preparation.tenantId,
  );

  requireIdentifier(
    "Riya ownerId",
    preparation.ownerId,
  );

  requireDigest(
    "Riya source review decision digest",
    preparation.sourceReviewDecisionDigest,
  );

  requireDigest(
    "Riya controlled shadow execution digest",
    preparation.controlledShadowExecutionDigest,
  );

  requireIsoTimestamp(
    "Riya limited internal pilot preparation time",
    preparation.preparedAt,
  );

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
      "Riya limited internal pilot plan is invalid.",
    );
  }

  const standard =
    preparation.specialistStandard;

  if (
    standard.aiIdentityTransparent !==
      true ||
    standard.evidenceGroundingRequired !==
      true ||
    standard.verifiedFactsSeparatedFromAssumptions !==
      true ||
    standard.missingFactsIdentified !==
      true ||
    standard.clarificationBeforeGuessingRequired !==
      true ||
    standard.riskLevelRequired !==
      true ||
    standard.uncertaintyRequired !==
      true ||
    standard.practicalTradeoffsRequired !==
      true ||
    standard.ownerReadyBriefRequired !==
      true ||
    standard.unsupportedClaimsBlocked !==
      true ||
    standard.urgencyExaggerationBlocked !==
      true ||
    standard.guaranteeBlocked !==
      true ||
    standard.crossCustomerContextBlocked !==
      true ||
    standard.crossTenantContextBlocked !==
      true ||
    standard.customerDeliveryRequiresSeparateOwnerAuthority !==
      true
  ) {
    throw new Error(
      "Riya limited internal pilot specialist standard is invalid.",
    );
  }

  const boundary =
    preparation.authorityBoundary;

  if (
    boundary.ownerReviewDecisionBound !==
      true ||
    boundary.ownerReviewDecisionIntegrityVerified !==
      true ||
    boundary.ownerPilotPreparationApprovalBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.controlledShadowExecutionBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.limitedInternalPilotPreparationAuthorized !==
      true ||
    boundary.limitedInternalPilotExecutionAuthorized !==
      false ||
    boundary.syntheticRecommendationExecutionAuthorized !==
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
      "Riya limited internal pilot preparation authority boundary is invalid.",
    );
  }

  const {
    preparationDigest,
    ...preparationCore
  } = preparation;

  if (
    sha256(preparationCore) !==
      preparationDigest
  ) {
    throw new Error(
      "Workforce Day 60 Riya limited internal pilot preparation integrity verification failed.",
    );
  }
}

export function createRiyaLimitedInternalPilotPreparation(
  input:
    CreateRiyaLimitedInternalPilotPreparationInput,
): RiyaLimitedInternalPilotPreparation {
  requireIdentifier(
    "Riya limited internal pilot preparationId",
    input.preparationId,
  );

  requireIsoTimestamp(
    "Riya limited internal pilot preparation time",
    input.preparedAt,
  );

  const source =
    input
      .ownerControlledShadowOperationReviewDecision;

  validateApprovedOwnerReviewDecision(
    source,
  );

  if (
    Date.parse(input.preparedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Riya limited internal pilot preparation cannot precede the owner review decision.",
    );
  }

  const preparationCore = {
    version:
      RIYA_LIMITED_INTERNAL_PILOT_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "LIMITED_INTERNAL_PILOT_PREPARED" as const,

    sourceReviewDecisionId:
      source.decisionId,

    sourceReviewDecisionDigest:
      source.decisionDigest,

    controlledShadowExecutionId:
      source.controlledShadowExecutionId,

    controlledShadowExecutionDigest:
      source.controlledShadowExecutionDigest,

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

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    pilotPlan: {
      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,

      inquiryEvidenceToolMode:
        "READ_ONLY" as const,

      customerContextToolMode:
        "READ_ONLY" as const,

      recommendationToolMode:
        "DRAFT_ONLY" as const,

      maximumRecommendationCount:
        3 as const,

      concurrentRecommendationLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_RECOMMENDATION" as const,

      externalDeliveryMode:
        "DISABLED" as const,

      productionMutationMode:
        "DISABLED" as const,

      scenarios: [
        "EVIDENCE_GROUNDED_RECOMMENDATION",
        "MISSING_FACT_CLARIFICATION",
        "RISK_AWARE_TRADEOFF_COMPARISON",
      ] as const,
    },

    specialistStandard: {
      aiIdentityTransparent:
        true as const,

      evidenceGroundingRequired:
        true as const,

      verifiedFactsSeparatedFromAssumptions:
        true as const,

      missingFactsIdentified:
        true as const,

      clarificationBeforeGuessingRequired:
        true as const,

      riskLevelRequired:
        true as const,

      uncertaintyRequired:
        true as const,

      practicalTradeoffsRequired:
        true as const,

      ownerReadyBriefRequired:
        true as const,

      unsupportedClaimsBlocked:
        true as const,

      urgencyExaggerationBlocked:
        true as const,

      guaranteeBlocked:
        true as const,

      crossCustomerContextBlocked:
        true as const,

      crossTenantContextBlocked:
        true as const,

      customerDeliveryRequiresSeparateOwnerAuthority:
        true as const,
    },

    authorityBoundary: {
      ownerReviewDecisionBound:
        true as const,

      ownerReviewDecisionIntegrityVerified:
        true as const,

      ownerPilotPreparationApprovalBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      controlledShadowExecutionBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      limitedInternalPilotPreparationAuthorized:
        true as const,

      limitedInternalPilotExecutionAuthorized:
        false as const,

      syntheticRecommendationExecutionAuthorized:
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
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_EXECUTION_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...preparationCore,

      preparationDigest:
        sha256(preparationCore),
    }) as RiyaLimitedInternalPilotPreparation;

  validateRiyaLimitedInternalPilotPreparation(
    preparation,
  );

  return preparation;
}