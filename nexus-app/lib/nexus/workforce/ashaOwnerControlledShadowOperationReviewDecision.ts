import {
  createHash,
} from "node:crypto";

import {
  ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
  type AshaControlledInquiryIntakeReceipt,
} from "./ashaControlledInquiryIntake";

import {
  ASHA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION,
  type AshaControlledShadowOperationExecution,
} from "./ashaControlledShadowOperationExecution";

export const ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION =
  "nexus-asha-owner-controlled-shadow-operation-review-decision-v1" as const;

export const ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISIONS = [
  "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION",
  "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION",
] as const;

export type AshaOwnerControlledShadowOperationReviewDecisionType =
  (
    typeof ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISIONS
  )[number];

export interface CreateAshaOwnerControlledShadowOperationReviewDecisionInput {
  readonly controlledShadowOperationExecution:
    AshaControlledShadowOperationExecution;
  readonly decisionId:
    string;
  readonly ownerId:
    string;
  readonly decision:
    AshaOwnerControlledShadowOperationReviewDecisionType;
  readonly reason:
    string;
  readonly decidedAt:
    string;
}

export interface AshaOwnerControlledShadowOperationReviewDecision {
  readonly version:
    typeof ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION;
  readonly decisionId:
    string;
  readonly decisionState:
    "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED";
  readonly employeeId:
    "employee-asha-inquiry-intake-v1";
  readonly templateId:
    "template-asha-inquiry-intake-v1";
  readonly employeeCode:
    "nx-sales-003";
  readonly displayName:
    "Asha";
  readonly officialRole:
    "AI Inquiry Intake Executive";
  readonly department:
    "SALES";
  readonly autonomyLevel:
    "DRAFTING_ASSISTANT";
  readonly controlledShadowExecutionId:
    string;
  readonly controlledShadowExecutionDigest:
    string;
  readonly preparationId:
    string;
  readonly preparationDigest:
    string;
  readonly runtimeIssuanceId:
    string;
  readonly runtimeIssuanceDigest:
    string;
  readonly runtimeId:
    string;
  readonly runtimeDigest:
    string;
  readonly qualifiedManifestDigest:
    string;
  readonly tenantId:
    string;
  readonly ownerId:
    string;
  readonly decision:
    AshaOwnerControlledShadowOperationReviewDecisionType;
  readonly shadowOperationApproved:
    boolean;
  readonly limitedInternalPilotPreparationEligible:
    boolean;
  readonly reason:
    string;
  readonly reviewedEvidence: Readonly<{
    fixtureId:
      "fixture-asha-controlled-shadow-inquiry-v1";
    scenarioId:
      "scenario-asha-controlled-shadow-inquiry-intake-001";
    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";
    toolId:
      "tool-inquiry-draft";
    toolMode:
      "DRAFT_ONLY";
    executionMode:
      "SANDBOX_ONLY";
    maximumInquiryCount:
      1;
    actualInquiryCount:
      1;
    authenticatedInquiryOutcome:
      "CREATED";
    authenticatedInquiryStatus:
      "NEW";
    recommendationStatus:
      "NOT_GENERATED";
  }>;
  readonly authorityBoundary: Readonly<{
    controlledShadowExecutionBound:
      true;
    controlledShadowExecutionIntegrityVerified:
      true;
    ownerIdentityBound:
      true;
    tenantIdentityBound:
      true;
    runtimeIdentityBound:
      true;
    qualifiedManifestBound:
      true;
    syntheticSanitizedDataOnly:
      true;
    maximumOneInquiryVerified:
      true;
    ownerDecisionRequired:
      true;
    approvalBypassAllowed:
      false;
    ownerReviewDecisionRecorded:
      true;
    limitedInternalPilotPreparationAuthorized:
      boolean;
    limitedInternalPilotExecutionAuthorized:
      false;
    realCustomerInquiryAuthorized:
      false;
    realCustomerDataAccessAuthorized:
      false;
    customerContactAuthorized:
      false;
    recommendationGenerationAuthorized:
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
    emergencyPauseAvailable:
      true;
  }>;
  readonly nextStep:
    | "PREPARE_LIMITED_INTERNAL_PILOT"
    | "RETAIN_CONTROLLED_SHADOW_ONLY";
  readonly decidedAt:
    string;
  readonly decisionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,95}$/;

const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;

const FORBIDDEN_REASON_PATTERN =
  /(bearer\s+[a-z0-9._-]+|api[_-]?key|password|secret|access[_-]?token|refresh[_-]?token)/i;

const SHA_256_PATTERN =
  /^[0-9a-f]{64}$/;

const EXPECTED_EMPLOYEE_ID =
  "employee-asha-inquiry-intake-v1" as const;

const EXPECTED_TEMPLATE_ID =
  "template-asha-inquiry-intake-v1" as const;

const EXPECTED_EMPLOYEE_CODE =
  "nx-sales-003" as const;

const EXPECTED_DISPLAY_NAME =
  "Asha" as const;

const EXPECTED_ROLE =
  "AI Inquiry Intake Executive" as const;

const EXPECTED_DEPARTMENT =
  "SALES" as const;

const EXPECTED_AUTONOMY_LEVEL =
  "DRAFTING_ASSISTANT" as const;

const EXPECTED_FIXTURE_ID =
  "fixture-asha-controlled-shadow-inquiry-v1" as const;

const EXPECTED_SCENARIO_ID =
  "scenario-asha-controlled-shadow-inquiry-intake-001" as const;

const EXPECTED_SYNTHETIC_IDEMPOTENCY_KEY =
  "asha-controlled-shadow-inquiry-request-001" as const;

const EXPECTED_SYNTHETIC_CUSTOMER_NAME =
  "Synthetic Shadow Customer" as const;

const EXPECTED_SYNTHETIC_CUSTOMER_EMAIL =
  "synthetic.shadow@example.invalid" as const;

const EXPECTED_SYNTHETIC_MESSAGE =
  "Synthetic shadow inquiry requesting guidance for industrial safety equipment." as const;

const EXPECTED_SYNTHETIC_INQUIRY_ID =
  "inquiry-asha-controlled-shadow-001" as const;

const EXPECTED_SYNTHETIC_SESSION_ID =
  "session-asha-controlled-shadow-001" as const;

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
      value as Record<string, unknown>;

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
      "Unsupported deterministic controlled-shadow review value.",
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
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (
    !SAFE_IDENTIFIER_PATTERN.test(value) ||
    FORBIDDEN_IDENTIFIER_PATTERN.test(
      value,
    )
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA_256_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireIsoDate(
  label: string,
  value: string,
): void {
  const timestamp =
    Date.parse(value);

  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp)
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireReason(
  value: string,
): string {
  const reason =
    value.trim();

  if (
    reason.length < 12 ||
    reason.length > 1000
  ) {
    throw new Error(
      "Owner controlled-shadow review reason must contain 12 to 1000 characters.",
    );
  }

  if (
    FORBIDDEN_REASON_PATTERN.test(
      reason,
    )
  ) {
    throw new Error(
      "Owner controlled-shadow review reason contains prohibited secret-bearing content.",
    );
  }

  return reason;
}

function validateControlledInquiryReceipt(
  receipt:
    AshaControlledInquiryIntakeReceipt,
  source:
    AshaControlledShadowOperationExecution,
): void {
  if (
    receipt.version !==
      ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION
  ) {
    throw new Error(
      "Controlled inquiry receipt version is invalid.",
    );
  }

  requireDigest(
    "controlled inquiry receipt digest",
    receipt.receiptDigest,
  );

  const {
    receiptDigest,
    ...receiptCore
  } = receipt;

  if (
    sha256(receiptCore) !==
      receiptDigest
  ) {
    throw new Error(
      "Controlled inquiry receipt integrity verification failed.",
    );
  }

  if (
    receipt.employeeId !==
      source.employeeId ||
    receipt.templateId !==
      source.templateId ||
    receipt.runtimeId !==
      source.runtimeId ||
    receipt.runtimeDigest !==
      source.runtimeDigest ||
    receipt.tenantId !==
      source.tenantId
  ) {
    throw new Error(
      "Controlled inquiry receipt is not bound to the controlled shadow execution.",
    );
  }

  const authority =
    receipt.workforceAuthority;

  if (
    authority.employeeQualified !==
      true ||
    authority.employeeOwnerActivated !==
      true ||
    authority.controlledWorkAuthorized !==
      true ||
    authority.toolId !==
      "tool-inquiry-draft" ||
    authority.toolMode !==
      "DRAFT_ONLY" ||
    authority.tenantScoped !==
      true
  ) {
    throw new Error(
      "Controlled inquiry workforce authority is invalid.",
    );
  }

  const safety =
    receipt.safetyBoundary;

  if (
    safety.recommendationGenerationAuthorized !==
      false ||
    safety.externalMessageDeliveryAuthorized !==
      false ||
    safety.liveProviderExecutionAuthorized !==
      false ||
    safety.paymentExecutionAuthorized !==
      false ||
    safety.ownerApprovalRequiredBeforeExecution !==
      true ||
    safety.executionMode !==
      "SANDBOX_ONLY" ||
    safety.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Controlled inquiry safety boundary is invalid.",
    );
  }

  const authenticated =
    receipt.authenticatedInquiry;

  if (
    authenticated.outcome !==
      "CREATED" ||
    authenticated.inquiry.id !==
      EXPECTED_SYNTHETIC_INQUIRY_ID ||
    authenticated.inquiry.tenantId !==
      source.tenantId ||
    authenticated.inquiry.customerName !==
      EXPECTED_SYNTHETIC_CUSTOMER_NAME ||
    authenticated.inquiry.customerEmail !==
      EXPECTED_SYNTHETIC_CUSTOMER_EMAIL ||
    authenticated.inquiry.customerPhone !==
      null ||
    authenticated.inquiry.channel !==
      "WEB" ||
    authenticated.inquiry.message !==
      EXPECTED_SYNTHETIC_MESSAGE ||
    authenticated.inquiry.status !==
      "NEW" ||
    authenticated.inquiry.createdAt !==
      source.executedAt ||
    authenticated.intakeAuthority
      .createdByUserId !==
      source.ownerId ||
    authenticated.intakeAuthority
      .sourceSessionId !==
      EXPECTED_SYNTHETIC_SESSION_ID ||
    authenticated.intakeAuthority.role !==
      "OWNER" ||
    authenticated.safetyBoundary
      .recommendationStatus !==
      "NOT_GENERATED" ||
    authenticated.safetyBoundary
      .ownerApprovalRequiredBeforeExecution !==
      true ||
    authenticated.safetyBoundary
      .executionMode !==
      "SANDBOX_ONLY" ||
    authenticated.safetyBoundary
      .liveProviderExecutionAuthorized !==
      false ||
    authenticated.safetyBoundary
      .publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Controlled shadow authenticated inquiry evidence is invalid.",
    );
  }
}

function validateControlledShadowExecution(
  source:
    AshaControlledShadowOperationExecution,
): void {
  if (
    source.version !==
      ASHA_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION ||
    source.executionState !==
      "CONTROLLED_SHADOW_OPERATION_EXECUTED" ||
    source.nextStep !==
      "AWAIT_OWNER_SHADOW_OPERATION_REVIEW"
  ) {
    throw new Error(
      "A valid Workforce Day 24 controlled shadow execution is required.",
    );
  }

  requireIdentifier(
    "controlled shadow executionId",
    source.executionId,
  );

  requireIdentifier(
    "controlled shadow preparationId",
    source.preparationId,
  );

  requireIdentifier(
    "runtime issuanceId",
    source.runtimeIssuanceId,
  );

  requireIdentifier(
    "controlled shadow runtimeId",
    source.runtimeId,
  );

  requireIdentifier(
    "controlled shadow tenantId",
    source.tenantId,
  );

  requireIdentifier(
    "controlled shadow ownerId",
    source.ownerId,
  );

  requireDigest(
    "controlled shadow execution digest",
    source.executionDigest,
  );

  requireDigest(
    "controlled shadow preparation digest",
    source.preparationDigest,
  );

  requireDigest(
    "runtime issuance digest",
    source.runtimeIssuanceDigest,
  );

  requireDigest(
    "controlled shadow runtime digest",
    source.runtimeDigest,
  );

  requireDigest(
    "qualified manifest digest",
    source.qualifiedManifestDigest,
  );

  requireIsoDate(
    "controlled shadow execution time",
    source.executedAt,
  );

  const {
    executionDigest,
    ...executionCore
  } = source;

  if (
    sha256(executionCore) !==
      executionDigest
  ) {
    throw new Error(
      "Workforce Day 24 controlled shadow execution integrity verification failed.",
    );
  }

  if (
    source.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    source.templateId !==
      EXPECTED_TEMPLATE_ID ||
    source.employeeCode !==
      EXPECTED_EMPLOYEE_CODE ||
    source.displayName !==
      EXPECTED_DISPLAY_NAME ||
    source.officialRole !==
      EXPECTED_ROLE ||
    source.department !==
      EXPECTED_DEPARTMENT ||
    source.autonomyLevel !==
      EXPECTED_AUTONOMY_LEVEL
  ) {
    throw new Error(
      "Asha controlled shadow execution identity has changed.",
    );
  }

  const fixture =
    source.shadowFixture;

  if (
    fixture.fixtureId !==
      EXPECTED_FIXTURE_ID ||
    fixture.scenarioId !==
      EXPECTED_SCENARIO_ID ||
    fixture.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    fixture.toolId !==
      "tool-inquiry-draft" ||
    fixture.toolMode !==
      "DRAFT_ONLY" ||
    fixture.maximumInquiryCount !==
      1 ||
    fixture.executionMode !==
      "SANDBOX_ONLY"
  ) {
    throw new Error(
      "Controlled shadow fixture evidence is invalid.",
    );
  }

  const inquiry =
    source.syntheticInquiryEvidence;

  if (
    inquiry.idempotencyKey !==
      EXPECTED_SYNTHETIC_IDEMPOTENCY_KEY ||
    inquiry.channel !==
      "WEB" ||
    inquiry.customerName !==
      EXPECTED_SYNTHETIC_CUSTOMER_NAME ||
    inquiry.customerEmail !==
      EXPECTED_SYNTHETIC_CUSTOMER_EMAIL ||
    inquiry.customerPhone !==
      null ||
    inquiry.message !==
      EXPECTED_SYNTHETIC_MESSAGE ||
    inquiry.resultOutcome !==
      "CREATED" ||
    inquiry.inquiryId !==
      EXPECTED_SYNTHETIC_INQUIRY_ID ||
    inquiry.inquiryStatus !==
      "NEW" ||
    inquiry.createdAt !==
      source.executedAt
  ) {
    throw new Error(
      "Controlled synthetic inquiry evidence is invalid.",
    );
  }

  const boundary =
    source.executionBoundary;

  if (
    boundary.preparationBound !==
      true ||
    boundary.ownerActivatedRuntimeIssuanceBound !==
      true ||
    boundary.qualifiedManifestBound !==
      true ||
    boundary.runtimeIdentityBound !==
      true ||
    boundary.tenantIdentityBound !==
      true ||
    boundary.ownerIdentityBound !==
      true ||
    boundary.maximumInquiryCountEnforced !==
      true ||
    boundary.syntheticCreatorInvocationCount !==
      1 ||
    boundary.shadowExecutionExecuted !==
      true ||
    boundary.syntheticAuthenticatedInquiryCreated !==
      true ||
    boundary.realCustomerInquiryCreated !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.customerContactAuthorized !==
      false ||
    boundary.recommendationGenerated !==
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
    boundary.ownerReviewRequired !==
      true ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Controlled shadow execution authority boundary is invalid.",
    );
  }

  validateControlledInquiryReceipt(
    source.controlledInquiryReceipt,
    source,
  );
}

export function createAshaOwnerControlledShadowOperationReviewDecision(
  input:
    CreateAshaOwnerControlledShadowOperationReviewDecisionInput,
): AshaOwnerControlledShadowOperationReviewDecision {
  validateControlledShadowExecution(
    input.controlledShadowOperationExecution,
  );

  requireIdentifier(
    "controlled-shadow review decisionId",
    input.decisionId,
  );

  requireIdentifier(
    "controlled-shadow review ownerId",
    input.ownerId,
  );

  requireIsoDate(
    "controlled-shadow review decision time",
    input.decidedAt,
  );

  const reason =
    requireReason(input.reason);

  const source =
    input.controlledShadowOperationExecution;

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the controlled-shadow-bound owner can issue the review decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION" &&
    input.decision !==
      "REJECT_LIMITED_INTERNAL_PILOT_PREPARATION"
  ) {
    throw new Error(
      "Asha owner controlled-shadow review decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
    Date.parse(source.executedAt)
  ) {
    throw new Error(
      "Owner controlled-shadow review decision cannot precede shadow execution.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_LIMITED_INTERNAL_PILOT_PREPARATION";

  const decisionCore = {
    version:
      ASHA_OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_DECISION_VERSION,
    decisionId:
      input.decisionId,
    decisionState:
      "OWNER_CONTROLLED_SHADOW_OPERATION_REVIEW_RECORDED" as const,
    employeeId:
      EXPECTED_EMPLOYEE_ID,
    templateId:
      EXPECTED_TEMPLATE_ID,
    employeeCode:
      EXPECTED_EMPLOYEE_CODE,
    displayName:
      EXPECTED_DISPLAY_NAME,
    officialRole:
      EXPECTED_ROLE,
    department:
      EXPECTED_DEPARTMENT,
    autonomyLevel:
      EXPECTED_AUTONOMY_LEVEL,
    controlledShadowExecutionId:
      source.executionId,
    controlledShadowExecutionDigest:
      source.executionDigest,
    preparationId:
      source.preparationId,
    preparationDigest:
      source.preparationDigest,
    runtimeIssuanceId:
      source.runtimeIssuanceId,
    runtimeIssuanceDigest:
      source.runtimeIssuanceDigest,
    runtimeId:
      source.runtimeId,
    runtimeDigest:
      source.runtimeDigest,
    qualifiedManifestDigest:
      source.qualifiedManifestDigest,
    tenantId:
      source.tenantId,
    ownerId:
      input.ownerId,
    decision:
      input.decision,
    shadowOperationApproved:
      approved,
    limitedInternalPilotPreparationEligible:
      approved,
    reason,
    reviewedEvidence: {
      fixtureId:
        EXPECTED_FIXTURE_ID,
      scenarioId:
        EXPECTED_SCENARIO_ID,
      dataClassification:
        "SYNTHETIC_SANITIZED_ONLY" as const,
      toolId:
        "tool-inquiry-draft" as const,
      toolMode:
        "DRAFT_ONLY" as const,
      executionMode:
        "SANDBOX_ONLY" as const,
      maximumInquiryCount:
        1 as const,
      actualInquiryCount:
        1 as const,
      authenticatedInquiryOutcome:
        "CREATED" as const,
      authenticatedInquiryStatus:
        "NEW" as const,
      recommendationStatus:
        "NOT_GENERATED" as const,
    },
    authorityBoundary: {
      controlledShadowExecutionBound:
        true,
      controlledShadowExecutionIntegrityVerified:
        true,
      ownerIdentityBound:
        true,
      tenantIdentityBound:
        true,
      runtimeIdentityBound:
        true,
      qualifiedManifestBound:
        true,
      syntheticSanitizedDataOnly:
        true,
      maximumOneInquiryVerified:
        true,
      ownerDecisionRequired:
        true,
      approvalBypassAllowed:
        false,
      ownerReviewDecisionRecorded:
        true,
      limitedInternalPilotPreparationAuthorized:
        approved,
      limitedInternalPilotExecutionAuthorized:
        false,
      realCustomerInquiryAuthorized:
        false,
      realCustomerDataAccessAuthorized:
        false,
      customerContactAuthorized:
        false,
      recommendationGenerationAuthorized:
        false,
      externalDeliveryAuthorized:
        false,
      liveProviderExecutionAuthorized:
        false,
      productionDatabaseAuthorized:
        false,
      productionMutationAuthorized:
        false,
      paymentExecutionAuthorized:
        false,
      autonomousDecisionAuthorized:
        false,
      productionReadinessAuthorized:
        false,
      publicLaunchAuthorized:
        false,
      emergencyPauseAvailable:
        true,
    } as const,
    nextStep:
      approved
        ? "PREPARE_LIMITED_INTERNAL_PILOT" as const
        : "RETAIN_CONTROLLED_SHADOW_ONLY" as const,
    decidedAt:
      input.decidedAt,
  };

  const decision:
    AshaOwnerControlledShadowOperationReviewDecision = {
      ...decisionCore,
      decisionDigest:
        sha256(decisionCore),
    };

  return deepFreeze(
    decision,
  ) as AshaOwnerControlledShadowOperationReviewDecision;
}