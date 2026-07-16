import {
  createHash,
} from "node:crypto";

import type {
  AuthenticatedCustomerInquiryResult,
  CreateAuthenticatedCustomerInquiryInput,
} from "../inquiry/authenticatedCustomerInquiry";

import type {
  AIEmployeeManifest,
} from "./aiEmployeeManifest";

import {
  ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION,
  executeAshaControlledInquiryIntake,
  type AshaControlledInquiryIntakeReceipt,
} from "./ashaControlledInquiryIntake";

import {
  ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION,
  type AshaOwnerActivatedRuntimeIssuance,
} from "./ashaOwnerActivatedRuntimeIssuance";

import {
  ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION,
  type AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
} from "./ashaOwnerLimitedInternalPilotInquiryTwoExecutionDecision";

export const ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION =
  "nexus-asha-limited-internal-pilot-inquiry-two-execution-v1" as const;

export interface ExecuteAshaLimitedInternalPilotInquiryTwoInput {
  readonly executionId: string;
  readonly ownerLimitedInternalPilotInquiryTwoExecutionDecision:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision;
  readonly ownerActivatedRuntimeIssuance:
    AshaOwnerActivatedRuntimeIssuance;
  readonly qualifiedManifest:
    AIEmployeeManifest;
  readonly executedAt: string;
}

export interface AshaLimitedInternalPilotInquiryTwoExecution {
  readonly version:
    typeof ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION;
  readonly executionId: string;
  readonly executionState:
    "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTED";
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
  readonly ownerExecutionDecisionId: string;
  readonly ownerExecutionDecisionDigest: string;
  readonly preparationId: string;
  readonly preparationDigest: string;
  readonly sourceInquiryReviewDecisionId: string;
  readonly sourceInquiryReviewDecisionDigest: string;
  readonly sourceInquiryExecutionId: string;
  readonly sourceInquiryExecutionDigest: string;
  readonly runtimeIssuanceId: string;
  readonly runtimeIssuanceDigest: string;
  readonly runtimeId: string;
  readonly runtimeDigest: string;
  readonly qualifiedManifestDigest: string;
  readonly tenantId: string;
  readonly ownerId: string;

  readonly pilotInquiry: Readonly<{
    pilotClass:
      "LIMITED_INTERNAL_SYNTHETIC_PILOT";
    dataClass:
      "SYNTHETIC_SANITIZED_ONLY";
    actorClass:
      "OWNER_SUPERVISED_INTERNAL_ONLY";
    scenarioId:
      "VERIFIED_URGENCY_WITHOUT_EXAGGERATION";
    inquirySequence: 2;
    maximumInquiryCount: 3;
    remainingInquiryCapacity: 1;
    concurrentInquiryLimit: 1;
    failureThreshold: 1;
    ownerReviewFrequency:
      "AFTER_EVERY_INQUIRY";
    toolId:
      "tool-inquiry-draft";
    toolMode:
      "DRAFT_ONLY";
    executionMode:
      "SANDBOX_ONLY";
  }>;

  readonly humanLikeScenarioExpectation: Readonly<{
    urgencyMustBeVerifiedBeforeClaiming: true;
    urgencyExaggerationProhibited: true;
    falseScarcityOrPressureProhibited: true;
    evidenceBasedClarificationRequired: true;
    transparentAIIdentityRequired: true;
    naturalProfessionalToneRequired: true;
    ownerEscalationOnUncertaintyRequired: true;
    responseGenerationPerformed: false;
    humanImpersonationAuthorized: false;
  }>;

  readonly syntheticInquiryEvidence: Readonly<{
    idempotencyKey:
      "asha-limited-internal-pilot-inquiry-002";
    channel:
      "WEB";
    customerName:
      "Synthetic Pilot Customer Two";
    customerEmail:
      "synthetic.pilot.two@example.invalid";
    customerPhone:
      null;
    message:
      "Our internal workshop begins in three business days, and we need 40 certified safety helmets. Please confirm whether verified stock and realistic delivery timing can meet that date; if not, state the limitation clearly.";
    resultOutcome:
      "CREATED";
    inquiryId:
      "inquiry-asha-limited-internal-pilot-002";
    inquiryStatus:
      "NEW";
    createdAt:
      string;
  }>;

  readonly controlledInquiryReceipt:
    AshaControlledInquiryIntakeReceipt;

  readonly executionBoundary: Readonly<{
    ownerExecutionApprovalBound: true;
    runtimeIssuanceBound: true;
    qualifiedManifestBound: true;
    tenantIdentityBound: true;
    ownerIdentityBound: true;
    pilotInquirySequenceEnforced: true;
    maximumInquiryCountPreserved: true;
    concurrentInquiryLimitEnforced: true;
    failureThresholdPreserved: true;
    ownerReviewAfterInquiryRequired: true;
    inquiryTwoExecutionDecisionBound: true;
    inquiryTwoExecutionPerformed: true;
    inquiryThreePreparationAuthorized: false;
    inquiryThreeExecutionAuthorized: false;
    ownerReviewAfterInquiryTwoRequired: true;
    limitedInternalPilotInquiryExecuted: true;
    limitedInternalPilotCompleted: false;
    syntheticAuthenticatedInquiryCreated: true;
    genericPilotArchitectureInvoked: false;
    realCustomerInquiryCreated: false;
    realCustomerDataAccessed: false;
    customerContactPerformed: false;
    recommendationGenerationPerformed: false;
    externalDeliveryPerformed: false;
    liveProviderExecutionPerformed: false;
    productionDatabaseUsed: false;
    productionMutationPerformed: false;
    paymentExecutionPerformed: false;
    autonomousDecisionPerformed: false;
    productionReadinessAuthorized: false;
    publicLaunchAuthorized: false;
    emergencyPauseAvailable: true;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW";
  readonly executedAt: string;
  readonly executionDigest: string;
}

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
const EXPECTED_SCENARIO =
  "VERIFIED_URGENCY_WITHOUT_EXAGGERATION" as const;

const SYNTHETIC_IDEMPOTENCY_KEY =
  "asha-limited-internal-pilot-inquiry-002" as const;
const SYNTHETIC_CUSTOMER_NAME =
  "Synthetic Pilot Customer Two" as const;
const SYNTHETIC_CUSTOMER_EMAIL =
  "synthetic.pilot.two@example.invalid" as const;
const SYNTHETIC_MESSAGE =
  "Our internal workshop begins in three business days, and we need 40 certified safety helmets. Please confirm whether verified stock and realistic delivery timing can meet that date; if not, state the limitation clearly." as const;
const SYNTHETIC_INQUIRY_ID =
  "inquiry-asha-limited-internal-pilot-002" as const;
const SYNTHETIC_SESSION_ID =
  "session-asha-limited-internal-pilot-002" as const;

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;
const FORBIDDEN_IDENTIFIER_PATTERN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer)/i;


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
            stableStringify(record[key]),
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported value in deterministic limited internal pilot execution.",
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
            Record<string, unknown>
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
): string {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} must be a canonical safe identifier.`,
    );
  }

  if (
    FORBIDDEN_IDENTIFIER_PATTERN.test(value)
  ) {
    throw new Error(
      `${label} contains a credential-bearing term.`,
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
    !/^[0-9a-f]{64}$/.test(value)
  ) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
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
    Number.isNaN(Date.parse(value)) ||
    new Date(Date.parse(value))
      .toISOString() !== value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }

  return value;
}

function verifyDigestBoundObject(
  label: string,
  value: object,
  digestField: string,
): string {
  const record = {
    ...(
      value as unknown as
        Record<string, unknown>
    ),
  };

  const digest =
    requireDigest(
      `${label} digest`,
      record[digestField],
    );

  delete record[digestField];

  if (sha256(record) !== digest) {
    throw new Error(
      `${label} integrity verification failed.`,
    );
  }

  return digest;
}


function validateOwnerInquiryTwoExecutionDecision(
  source:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
): void {
  verifyDigestBoundObject(
    "Owner inquiry two execution decision",
    source,
    "decisionDigest",
  );

  requireSafeIdentifier(
    "Inquiry two execution decision identity",
    source.decisionId,
  );

  requireSafeIdentifier(
    "Inquiry two preparation identity",
    source.preparationId,
  );

  requireDigest(
    "Inquiry two preparation digest",
    source.preparationDigest,
  );

  requireSafeIdentifier(
    "Inquiry one review decision identity",
    source.sourceInquiryReviewDecisionId,
  );

  requireDigest(
    "Inquiry one review decision digest",
    source.sourceInquiryReviewDecisionDigest,
  );

  requireSafeIdentifier(
    "Inquiry one execution identity",
    source.sourceInquiryExecutionId,
  );

  requireDigest(
    "Inquiry one execution digest",
    source.sourceInquiryExecutionDigest,
  );

  requireSafeIdentifier(
    "Tenant identity",
    source.tenantId,
  );

  requireSafeIdentifier(
    "Owner identity",
    source.ownerId,
  );

  requireIsoTimestamp(
    "Inquiry two execution decision time",
    source.decidedAt,
  );

  if (
    source.version !==
      ASHA_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_VERSION ||
    source.decisionState !==
      "OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_DECISION_RECORDED" ||
    source.decision !==
      "APPROVE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION" ||
    source.approvedForInquiryTwoExecution !==
      true ||
    source.nextStep !==
      "EXECUTE_LIMITED_INTERNAL_PILOT_INQUIRY_TWO"
  ) {
    throw new Error(
      "An approved Workforce Day 31 inquiry two execution decision is required.",
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
      "Asha inquiry two execution identity has changed.",
    );
  }

  const scope =
    source.reviewedInquiryTwoPreparation;

  if (
    scope.pilotClass !==
      "LIMITED_INTERNAL_SYNTHETIC_PILOT" ||
    scope.dataClass !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    scope.actorClass !==
      "OWNER_SUPERVISED_INTERNAL_ONLY" ||
    scope.scenarioId !==
      EXPECTED_SCENARIO ||
    scope.inquirySequence !==
      2 ||
    scope.priorReviewedInquirySequence !==
      1 ||
    scope.maximumInquiryCount !==
      3 ||
    scope.remainingInquiryCapacityBeforeExecution !==
      2 ||
    scope.projectedRemainingInquiryCapacityAfterExecution !==
      1 ||
    scope.concurrentInquiryLimit !==
      1 ||
    scope.failureThreshold !==
      1 ||
    scope.ownerReviewFrequency !==
      "AFTER_EVERY_INQUIRY" ||
    scope.toolId !==
      "tool-inquiry-draft" ||
    scope.toolMode !==
      "DRAFT_ONLY" ||
    scope.executionMode !==
      "SANDBOX_ONLY" ||
    scope.urgencyVerificationStandardBound !==
      true ||
    scope.urgencyExaggerationProhibited !==
      true ||
    scope.falseScarcityOrPressureProhibited !==
      true ||
    scope.transparentAIIdentityRequired !==
      true ||
    scope.humanImpersonationAuthorized !==
      false ||
    scope.existingPilotArchitectureBound !==
      true
  ) {
    throw new Error(
      "Workforce Day 31 inquiry two execution scope has changed.",
    );
  }

  const boundary =
    source.authorityBoundary;

  if (
    boundary.sourceInquiryTwoPreparationIntegrityVerified !== true ||
    boundary.exactEmployeeIdentityBound !== true ||
    boundary.exactTenantBound !== true ||
    boundary.exactOwnerBound !== true ||
    boundary.exactRuntimeBound !== true ||
    boundary.exactQualifiedManifestBound !== true ||
    boundary.inquiryOneOwnerReviewApprovalBound !== true ||
    boundary.inquiryTwoPreparationBound !== true ||
    boundary.inquiryTwoExecutionDecisionRecorded !== true ||
    boundary.approvalBypassAllowed !== false ||
    boundary.inquiryTwoExecutionAuthorized !== true ||
    boundary.inquiryTwoExecutionPerformed !== false ||
    boundary.syntheticInquiryExecutionPerformed !== false ||
    boundary.concurrentInquiryExecutionAuthorized !== false ||
    boundary.inquiryThreePreparationAuthorized !== false ||
    boundary.inquiryThreeExecutionAuthorized !== false ||
    boundary.limitedInternalPilotCompleted !== false ||
    boundary.realCustomerInquiryAuthorized !== false ||
    boundary.realCustomerDataAccessAuthorized !== false ||
    boundary.customerContactAuthorized !== false ||
    boundary.recommendationGenerationAuthorized !== false ||
    boundary.externalDeliveryAuthorized !== false ||
    boundary.liveProviderExecutionAuthorized !== false ||
    boundary.productionDatabaseAuthorized !== false ||
    boundary.productionMutationAuthorized !== false ||
    boundary.paymentExecutionAuthorized !== false ||
    boundary.autonomousDecisionAuthorized !== false ||
    boundary.productionReadinessAuthorized !== false ||
    boundary.publicLaunchAuthorized !== false ||
    boundary.monitoringRequired !== true ||
    boundary.ownerReviewAfterInquiryTwoRequired !== true ||
    boundary.emergencyPauseAvailable !== true
  ) {
    throw new Error(
      "Workforce Day 31 inquiry two authority boundary has changed.",
    );
  }
}


function validateRuntimeAndManifest(
  source:
    AshaOwnerActivatedRuntimeIssuance,
  manifest:
    AIEmployeeManifest,
  decision:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
): void {
  if (
    source.runtimeIssuanceId !==
      decision.runtimeIssuanceId ||
    source.runtimeIssuanceDigest !==
      decision.runtimeIssuanceDigest ||
    source.runtimeId !==
      decision.runtimeId ||
    source.ownerActivatedRuntime.runtimeDigest !==
      decision.runtimeDigest ||
    manifest.manifestDigest !==
      decision.qualifiedManifestDigest
  ) {
    throw new Error(
      "Inquiry two execution runtime or qualified manifest evidence does not match the owner decision.",
    );
  }

  verifyDigestBoundObject(
    "Owner-activated runtime issuance",
    source,
    "runtimeIssuanceDigest",
  );

  verifyDigestBoundObject(
    "Owner-activated runtime",
    source.ownerActivatedRuntime,
    "runtimeDigest",
  );

  verifyDigestBoundObject(
    "Qualified employee manifest",
    manifest,
    "manifestDigest",
  );

  requireSafeIdentifier(
    "Runtime issuance identity",
    source.runtimeIssuanceId,
  );

  requireSafeIdentifier(
    "Runtime identity",
    source.runtimeId,
  );

  if (
    source.version !==
      ASHA_OWNER_ACTIVATED_RUNTIME_ISSUANCE_VERSION ||
    source.issuanceState !==
      "OWNER_ACTIVATED_RUNTIME_ISSUED" ||
    source.nextStep !==
      "PREPARE_CONTROLLED_SHADOW_OPERATION"
  ) {
    throw new Error(
      "A valid Workforce Day 22 owner-activated runtime issuance is required.",
    );
  }

  const runtime =
    source.ownerActivatedRuntime;

  if (
    runtime.runtimeId !==
      source.runtimeId ||
    runtime.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    runtime.templateId !==
      EXPECTED_TEMPLATE_ID ||
    runtime.manifestDigest !==
      manifest.manifestDigest ||
    runtime.tenantId !==
      decision.tenantId ||
    runtime.ownerId !==
      decision.ownerId ||
    runtime.ownerActivated !==
      true ||
    runtime.runtimeState !==
      "READY_FOR_CONTROLLED_WORK" ||
    runtime.controlledWorkAuthorized !==
      true
  ) {
    throw new Error(
      "Owner-activated runtime is not bound to the approved Asha pilot decision.",
    );
  }

  if (
    runtime.authority.ownerApprovalRequired !==
      true ||
    runtime.authority.approvalBypassAllowed !==
      false ||
    runtime.authority.tenantScoped !==
      true ||
    runtime.authority.crossTenantDelegationAllowed !==
      false ||
    runtime.safetyBoundary.emergencyPauseAvailable !==
      true ||
    runtime.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    runtime.safetyBoundary.externalDeliveryAuthorized !==
      false ||
    runtime.safetyBoundary.paymentExecutionAuthorized !==
      false ||
    runtime.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Owner-activated runtime safety boundary has changed.",
    );
  }

  if (
    manifest.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    manifest.templateId !==
      EXPECTED_TEMPLATE_ID ||
    manifest.evaluation.status !==
      "QUALIFIED"
  ) {
    throw new Error(
      "The exact qualified Asha manifest is required.",
    );
  }

  if (
    manifest.safetyBoundary.ownerControlled !==
      true ||
    manifest.safetyBoundary.emergencyPauseRequired !==
      true ||
    manifest.safetyBoundary.crossTenantAccessAuthorized !==
      false ||
    manifest.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    manifest.safetyBoundary.externalDeliveryAuthorized !==
      false ||
    manifest.safetyBoundary.paymentExecutionAuthorized !==
      false ||
    manifest.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Qualified Asha manifest safety boundary has changed.",
    );
  }
}

function createSyntheticInquiryInput(
  decision:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
): CreateAuthenticatedCustomerInquiryInput {
  return deepFreeze({
    principal:
      null,

    accessRepositories:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "accessRepositories"
      ],

    workspaceRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "workspaceRepository"
      ],

    inquiryRepository:
      {} as CreateAuthenticatedCustomerInquiryInput[
        "inquiryRepository"
      ],

    requestedTenantId:
      decision.tenantId,

    idempotencyKey:
      SYNTHETIC_IDEMPOTENCY_KEY,

    channel:
      "WEB",

    customerName:
      SYNTHETIC_CUSTOMER_NAME,

    customerEmail:
      SYNTHETIC_CUSTOMER_EMAIL,

    customerPhone:
      null,

    message:
      SYNTHETIC_MESSAGE,
  });
}

function createSyntheticAuthenticatedResult(
  decision:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
  executedAt:
    string,
): AuthenticatedCustomerInquiryResult {
  return deepFreeze({
    outcome:
      "CREATED",

    inquiry: {
      id:
        SYNTHETIC_INQUIRY_ID,

      tenantId:
        decision.tenantId,

      customerName:
        SYNTHETIC_CUSTOMER_NAME,

      customerEmail:
        SYNTHETIC_CUSTOMER_EMAIL,

      customerPhone:
        null,

      channel:
        "WEB",

      message:
        SYNTHETIC_MESSAGE,

      status:
        "NEW",

      createdAt:
        executedAt,
    },

    intakeAuthority: {
      createdByUserId:
        decision.ownerId,

      sourceSessionId:
        SYNTHETIC_SESSION_ID,

      role:
        "OWNER",
    },

    safetyBoundary: {
      recommendationStatus:
        "NOT_GENERATED",

      ownerApprovalRequiredBeforeExecution:
        true,

      executionMode:
        "SANDBOX_ONLY",

      liveProviderExecutionAuthorized:
        false,

      publicLaunchAuthorized:
        false,
    },
  });
}

function validateControlledInquiryReceipt(
  receipt:
    AshaControlledInquiryIntakeReceipt,
  decision:
    AshaOwnerLimitedInternalPilotInquiryTwoExecutionDecision,
  source:
    AshaOwnerActivatedRuntimeIssuance,
  executedAt:
    string,
): void {
  verifyDigestBoundObject(
    "Limited internal pilot inquiry receipt",
    receipt,
    "receiptDigest",
  );

  if (
    receipt.version !==
      ASHA_CONTROLLED_INQUIRY_INTAKE_VERSION ||
    receipt.employeeId !==
      EXPECTED_EMPLOYEE_ID ||
    receipt.templateId !==
      EXPECTED_TEMPLATE_ID ||
    receipt.runtimeId !==
      source.runtimeId ||
    receipt.runtimeDigest !==
      source.ownerActivatedRuntime.runtimeDigest ||
    receipt.tenantId !==
      decision.tenantId
  ) {
    throw new Error(
      "Limited internal pilot inquiry receipt identity binding is invalid.",
    );
  }

  if (
    receipt.workforceAuthority.employeeQualified !==
      true ||
    receipt.workforceAuthority.employeeOwnerActivated !==
      true ||
    receipt.workforceAuthority.controlledWorkAuthorized !==
      true ||
    receipt.workforceAuthority.toolId !==
      "tool-inquiry-draft" ||
    receipt.workforceAuthority.toolMode !==
      "DRAFT_ONLY" ||
    receipt.workforceAuthority.tenantScoped !==
      true
  ) {
    throw new Error(
      "Limited internal pilot inquiry workforce authority is invalid.",
    );
  }

  if (
    receipt.safetyBoundary.recommendationGenerationAuthorized !==
      false ||
    receipt.safetyBoundary.externalMessageDeliveryAuthorized !==
      false ||
    receipt.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    receipt.safetyBoundary.paymentExecutionAuthorized !==
      false ||
    receipt.safetyBoundary.ownerApprovalRequiredBeforeExecution !==
      true ||
    receipt.safetyBoundary.executionMode !==
      "SANDBOX_ONLY" ||
    receipt.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Limited internal pilot inquiry receipt safety boundary is invalid.",
    );
  }

  const authenticated =
    receipt.authenticatedInquiry;

  if (
    authenticated.outcome !==
      "CREATED" ||
    authenticated.inquiry.id !==
      SYNTHETIC_INQUIRY_ID ||
    authenticated.inquiry.tenantId !==
      decision.tenantId ||
    authenticated.inquiry.customerName !==
      SYNTHETIC_CUSTOMER_NAME ||
    authenticated.inquiry.customerEmail !==
      SYNTHETIC_CUSTOMER_EMAIL ||
    authenticated.inquiry.customerPhone !==
      null ||
    authenticated.inquiry.channel !==
      "WEB" ||
    authenticated.inquiry.message !==
      SYNTHETIC_MESSAGE ||
    authenticated.inquiry.status !==
      "NEW" ||
    authenticated.inquiry.createdAt !==
      executedAt ||
    authenticated.intakeAuthority.createdByUserId !==
      decision.ownerId ||
    authenticated.intakeAuthority.sourceSessionId !==
      SYNTHETIC_SESSION_ID ||
    authenticated.intakeAuthority.role !==
      "OWNER" ||
    authenticated.safetyBoundary.recommendationStatus !==
      "NOT_GENERATED" ||
    authenticated.safetyBoundary.ownerApprovalRequiredBeforeExecution !==
      true ||
    authenticated.safetyBoundary.executionMode !==
      "SANDBOX_ONLY" ||
    authenticated.safetyBoundary.liveProviderExecutionAuthorized !==
      false ||
    authenticated.safetyBoundary.publicLaunchAuthorized !==
      false
  ) {
    throw new Error(
      "Limited internal pilot authenticated inquiry evidence is invalid.",
    );
  }
}

export async function executeAshaLimitedInternalPilotInquiryTwo(
  input:
    ExecuteAshaLimitedInternalPilotInquiryTwoInput,
): Promise<AshaLimitedInternalPilotInquiryTwoExecution> {
  requireSafeIdentifier(
    "Limited internal pilot inquiry execution identity",
    input.executionId,
  );

  const executedAt =
    requireIsoTimestamp(
      "Limited internal pilot inquiry execution time",
      input.executedAt,
    );

  const decision =
    input.ownerLimitedInternalPilotInquiryTwoExecutionDecision;

  validateOwnerInquiryTwoExecutionDecision(
    decision,
  );

  validateRuntimeAndManifest(
    input.ownerActivatedRuntimeIssuance,
    input.qualifiedManifest,
    decision,
  );

  if (
    Date.parse(executedAt) <
    Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Limited internal pilot inquiry execution cannot precede owner approval.",
    );
  }

  const syntheticInquiry =
    createSyntheticInquiryInput(
      decision,
    );

  const syntheticResult =
    createSyntheticAuthenticatedResult(
      decision,
      executedAt,
    );

  let syntheticCreatorInvocationCount =
    0;

  const receipt =
    await executeAshaControlledInquiryIntake({
      manifest:
        input.qualifiedManifest,

      runtime:
        input.ownerActivatedRuntimeIssuance
          .ownerActivatedRuntime,

      inquiry:
        syntheticInquiry,

      createInquiry:
        async (
          receivedInquiry,
        ) => {
          syntheticCreatorInvocationCount +=
            1;

          if (
            syntheticCreatorInvocationCount >
            1
          ) {
            throw new Error(
              "Limited internal pilot synthetic inquiry creator exceeded the single-inquiry execution limit.",
            );
          }

          if (
            receivedInquiry !==
            syntheticInquiry
          ) {
            throw new Error(
              "Limited internal pilot inquiry input identity changed before execution.",
            );
          }

          return syntheticResult;
        },
    });

  if (
    syntheticCreatorInvocationCount !==
    1
  ) {
    throw new Error(
      "Limited internal pilot synthetic inquiry creator must execute exactly once.",
    );
  }

  validateControlledInquiryReceipt(
    receipt,
    decision,
    input.ownerActivatedRuntimeIssuance,
    executedAt,
  );

  const executionCore = {
    version:
      ASHA_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "LIMITED_INTERNAL_PILOT_INQUIRY_TWO_EXECUTED" as const,

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

    ownerExecutionDecisionId:
      decision.decisionId,

    ownerExecutionDecisionDigest:
      decision.decisionDigest,

    preparationId:
      decision.preparationId,

    preparationDigest:
      decision.preparationDigest,

    sourceInquiryReviewDecisionId:
      decision.sourceInquiryReviewDecisionId,

    sourceInquiryReviewDecisionDigest:
      decision.sourceInquiryReviewDecisionDigest,

    sourceInquiryExecutionId:
      decision.sourceInquiryExecutionId,

    sourceInquiryExecutionDigest:
      decision.sourceInquiryExecutionDigest,

    runtimeIssuanceId:
      input.ownerActivatedRuntimeIssuance
        .runtimeIssuanceId,

    runtimeIssuanceDigest:
      input.ownerActivatedRuntimeIssuance
        .runtimeIssuanceDigest,

    runtimeId:
      input.ownerActivatedRuntimeIssuance
        .runtimeId,

    runtimeDigest:
      input.ownerActivatedRuntimeIssuance
        .ownerActivatedRuntime
        .runtimeDigest,

    qualifiedManifestDigest:
      input.qualifiedManifest
        .manifestDigest,

    tenantId:
      decision.tenantId,

    ownerId:
      decision.ownerId,

    pilotInquiry: {
      pilotClass:
        "LIMITED_INTERNAL_SYNTHETIC_PILOT" as const,

      dataClass:
        "SYNTHETIC_SANITIZED_ONLY" as const,

      actorClass:
        "OWNER_SUPERVISED_INTERNAL_ONLY" as const,

      scenarioId:
        EXPECTED_SCENARIO,

      inquirySequence:
        2 as const,

      maximumInquiryCount:
        3 as const,

      remainingInquiryCapacity:
        1 as const,

      concurrentInquiryLimit:
        1 as const,

      failureThreshold:
        1 as const,

      ownerReviewFrequency:
        "AFTER_EVERY_INQUIRY" as const,

      toolId:
        "tool-inquiry-draft" as const,

      toolMode:
        "DRAFT_ONLY" as const,

      executionMode:
        "SANDBOX_ONLY" as const,
    },

    humanLikeScenarioExpectation: {
      urgencyMustBeVerifiedBeforeClaiming:
        true as const,

      urgencyExaggerationProhibited:
        true as const,

      falseScarcityOrPressureProhibited:
        true as const,

      evidenceBasedClarificationRequired:
        true as const,

      transparentAIIdentityRequired:
        true as const,

      naturalProfessionalToneRequired:
        true as const,

      ownerEscalationOnUncertaintyRequired:
        true as const,

      responseGenerationPerformed:
        false as const,

      humanImpersonationAuthorized:
        false as const,
    },

    syntheticInquiryEvidence: {
      idempotencyKey:
        SYNTHETIC_IDEMPOTENCY_KEY,

      channel:
        "WEB" as const,

      customerName:
        SYNTHETIC_CUSTOMER_NAME,

      customerEmail:
        SYNTHETIC_CUSTOMER_EMAIL,

      customerPhone:
        null,

      message:
        SYNTHETIC_MESSAGE,

      resultOutcome:
        "CREATED" as const,

      inquiryId:
        SYNTHETIC_INQUIRY_ID,

      inquiryStatus:
        "NEW" as const,

      createdAt:
        executedAt,
    },

    controlledInquiryReceipt:
      receipt,

    executionBoundary: {
      ownerExecutionApprovalBound:
        true as const,

      runtimeIssuanceBound:
        true as const,

      qualifiedManifestBound:
        true as const,

      tenantIdentityBound:
        true as const,

      ownerIdentityBound:
        true as const,

      pilotInquirySequenceEnforced:
        true as const,

      maximumInquiryCountPreserved:
        true as const,

      concurrentInquiryLimitEnforced:
        true as const,

      failureThresholdPreserved:
        true as const,

      ownerReviewAfterInquiryRequired:
        true as const,

      inquiryTwoExecutionDecisionBound:
        true as const,

      inquiryTwoExecutionPerformed:
        true as const,

      inquiryThreePreparationAuthorized:
        false as const,

      inquiryThreeExecutionAuthorized:
        false as const,

      ownerReviewAfterInquiryTwoRequired:
        true as const,

      limitedInternalPilotInquiryExecuted:
        true as const,

      limitedInternalPilotCompleted:
        false as const,

      syntheticAuthenticatedInquiryCreated:
        true as const,

      genericPilotArchitectureInvoked:
        false as const,

      realCustomerInquiryCreated:
        false as const,

      realCustomerDataAccessed:
        false as const,

      customerContactPerformed:
        false as const,

      recommendationGenerationPerformed:
        false as const,

      externalDeliveryPerformed:
        false as const,

      liveProviderExecutionPerformed:
        false as const,

      productionDatabaseUsed:
        false as const,

      productionMutationPerformed:
        false as const,

      paymentExecutionPerformed:
        false as const,

      autonomousDecisionPerformed:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,

      emergencyPauseAvailable:
        true as const,
    },

    nextStep:
      "AWAIT_OWNER_LIMITED_INTERNAL_PILOT_INQUIRY_TWO_REVIEW" as const,

    executedAt,
  };

  const result:
    AshaLimitedInternalPilotInquiryTwoExecution = {
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    };

  return deepFreeze(
    result,
  ) as AshaLimitedInternalPilotInquiryTwoExecution;
}
