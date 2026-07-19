import { createHash } from "node:crypto";

import {
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecution,
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution,
} from "./salesCoreLaunchBoundedRealCustomerOnboardingExecution";

export const SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_DECISION_VERSION =
  "sales-core-launch-bounded-real-customer-onboarding-execution-review-decision-v1" as const;

export const SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_OUTCOMES =
  [
    "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW",
    "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY",
  ] as const;

export type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewOutcome =
  (
    typeof SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_OUTCOMES
  )[number];

export interface CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecisionInput {
  readonly reviewId:
    string;

  readonly boundedRealCustomerOnboardingExecution:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecution;

  readonly ownerId:
    string;

  readonly outcome:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewOutcome;

  readonly rationale:
    string;

  readonly reviewedAt:
    string;
}

export interface SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_DECISION_VERSION;

  readonly reviewId:
    string;

  readonly reviewState:
    "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_RECORDED";

  readonly department:
    "SALES";

  readonly executionId:
    string;

  readonly executionDigest:
    string;

  readonly decisionId:
    string;

  readonly decisionDigest:
    string;

  readonly preparationId:
    string;

  readonly preparationDigest:
    string;

  readonly sourceBoundaryDecisionId:
    string;

  readonly sourceBoundaryDecisionDigest:
    string;

  readonly sourceBoundaryPreparationId:
    string;

  readonly sourceBoundaryPreparationDigest:
    string;

  readonly tenantId:
    string;

  readonly ownerId:
    string;

  readonly customerOrganizationId:
    string;

  readonly customerOrganizationName:
    string;

  readonly outcome:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewOutcome;

  readonly approved:
    boolean;

  readonly reviewedExecution: Readonly<{
    executionState:
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED";

    customerOrganizationCount:
      1;

    executionAttemptCount:
      1;

    ownerSupervisionVerified:
      true;

    authenticatedCustomerIdentityRequirementPreserved:
      true;

    explicitCustomerConsentRequirementPreserved:
      true;

    tenantScopePreserved:
      true;

    customerScopePreserved:
      true;

    minimumNecessaryDataRequirementPreserved:
      true;

    retentionAndRedactionRequirementPreserved:
      true;

    idempotencyControlEnforced:
      true;

    atomicityControlEnforced:
      true;

    rollbackControlAvailable:
      true;

    auditEvidenceCreated:
      true;

    executionNextStep:
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW";
  }>;

  readonly reviewBoundary: Readonly<{
    sourceExecutionIntegrityVerified:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    exactCustomerOrganizationBound:
      true;

    ownerExecutionApprovalBound:
      true;

    ownerReviewRequiredAfterExecution:
      true;

    ownerPostExecutionReviewRecorded:
      true;

    boundedOnboardingExecutionAuthorized:
      true;

    boundedOnboardingExecutionPerformed:
      true;

    controlledExecutionReceiptVerified:
      true;

    controlledExecutionEvidenceAccepted:
      boolean;

    boundedExecutionReviewCompleted:
      true;

    approvalBypassAllowed:
      false;

    duplicateBoundedExecutionAuthorized:
      false;

    realCustomerOnboardingExecuted:
      false;

    realCustomerOnboardingCompletionRecorded:
      false;

    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;

    priorActivationAuthorityRevived:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    realCustomerContactDetailsStorageAuthorized:
      false;

    customerAccountCreationAuthorized:
      false;

    customerSessionIssuanceAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    customerCommitmentAuthorized:
      false;

    authenticatedPortalReleaseExecutionAuthorized:
      false;

    externalDeliveryExecutionAuthorized:
      false;

    externalEmailDeliveryAuthorized:
      false;

    externalWhatsAppDeliveryAuthorized:
      false;

    externalSmsDeliveryAuthorized:
      false;

    publicLinkDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paidPilotEligible:
      false;

    paidPilotAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    invoiceCreationAuthorized:
      false;

    subscriptionActivationAuthorized:
      false;

    entitlementMutationAuthorized:
      false;

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly rationale:
    string;

  readonly nextStep:
    | "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_COMPLETE"
    | "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY";

  readonly reviewedAt:
    string;

  readonly reviewDigest:
    string;
}

type DigestRecord =
  Readonly<Record<string, unknown>>;

const SAFE_ID =
  /^[a-z0-9][a-z0-9:_-]{2,127}$/;

const SHA256 =
  /^[0-9a-f]{64}$/;

const FORBIDDEN =
  /(secret|token|password|session|cookie|csrf|authorization|bearer|api[-_]?key)/i;

function canonicalize(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return `[${value
      .map(canonicalize)
      .join(",")}]`;
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(record[key])}`,
      )
      .join(",")}}`;
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic bounded-onboarding execution review value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(canonicalize(value))
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
      const key of
      Object.getOwnPropertyNames(value)
    ) {
      const child =
        (
          value as unknown as
            Record<string, unknown>
        )[key];

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
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !SAFE_ID.test(value) ||
    FORBIDDEN.test(value)
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
  if (
    typeof value !== "string" ||
    !SHA256.test(value)
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !Number.isFinite(
      Date.parse(value),
    )
  ) {
    throw new Error(
      "Bounded onboarding execution review time is invalid.",
    );
  }
}

function requireRationale(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < 12 ||
    value.length > 1000 ||
    FORBIDDEN.test(value)
  ) {
    throw new Error(
      "Bounded onboarding execution review rationale must be safe, explicit, and non-secret.",
    );
  }
}

function verifyReviewDigest(
  record:
    DigestRecord,
): void {
  const digest =
    record.reviewDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Bounded onboarding execution review digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.reviewDigest;

  if (
    sha256(unsigned) !==
    digest
  ) {
    throw new Error(
      "Bounded onboarding execution review integrity verification failed.",
    );
  }
}

function validateReviewableExecution(
  execution:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecution,
): void {
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution(
    execution,
  );

  const receipt =
    execution.executionReceipt;

  const boundary =
    execution.executionBoundary;

  if (
    execution.executionState !==
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED" ||
    execution.nextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW" ||
    receipt.customerOrganizationCount !==
      1 ||
    receipt.executionAttemptCount !==
      1 ||
    receipt.ownerSupervisionVerified !==
      true ||
    receipt.authenticatedCustomerIdentityRequirementPreserved !==
      true ||
    receipt.explicitCustomerConsentRequirementPreserved !==
      true ||
    receipt.tenantScopePreserved !==
      true ||
    receipt.customerScopePreserved !==
      true ||
    receipt.minimumNecessaryDataRequirementPreserved !==
      true ||
    receipt.retentionAndRedactionRequirementPreserved !==
      true ||
    receipt.idempotencyControlEnforced !==
      true ||
    receipt.atomicityControlEnforced !==
      true ||
    receipt.rollbackControlAvailable !==
      true ||
    receipt.auditEvidenceCreated !==
      true ||
    receipt.realCustomerContactDetailsStored !==
      false ||
    receipt.customerAccountCreated !==
      false ||
    receipt.customerSessionIssued !==
      false ||
    receipt.realCustomerDataAccessed !==
      false ||
    receipt.realCustomerContactPerformed !==
      false ||
    receipt.customerCommitmentCreated !==
      false ||
    receipt.realCustomerOnboardingExecuted !==
      false ||
    receipt.authenticatedPortalReleaseExecuted !==
      false
  ) {
    throw new Error(
      "Bounded onboarding execution receipt is not eligible for owner review.",
    );
  }

  if (
    boundary.sourceDecisionIntegrityVerified !==
      true ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.exactCustomerOrganizationBound !==
      true ||
    boundary.ownerExecutionApprovalBound !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.boundedOnboardingExecutionAuthorized !==
      true ||
    boundary.boundedOnboardingExecutionPerformed !==
      true ||
    boundary.controlledExecutionReceiptCreated !==
      true ||
    boundary.ownerReviewRequiredAfterExecution !==
      true ||
    boundary.ownerPostExecutionReviewRecorded !==
      false ||
    boundary.realCustomerOnboardingExecuted !==
      false ||
    boundary.realCustomerContactDetailsStored !==
      false ||
    boundary.customerAccountCreationAuthorized !==
      false ||
    boundary.customerAccountCreated !==
      false ||
    boundary.customerSessionIssuanceAuthorized !==
      false ||
    boundary.customerSessionIssued !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerDataAccessed !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.realCustomerContactPerformed !==
      false ||
    boundary.customerCommitmentAuthorized !==
      false ||
    boundary.customerCommitmentCreated !==
      false ||
    boundary.authenticatedPortalReleaseExecutionAuthorized !==
      false ||
    boundary.authenticatedPortalReleaseExecuted !==
      false ||
    boundary.externalDeliveryExecutionAuthorized !==
      false ||
    boundary.externalEmailDeliveryAuthorized !==
      false ||
    boundary.externalWhatsAppDeliveryAuthorized !==
      false ||
    boundary.externalSmsDeliveryAuthorized !==
      false ||
    boundary.publicLinkDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paidPilotEligible !==
      false ||
    boundary.paidPilotAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.invoiceCreationAuthorized !==
      false ||
    boundary.subscriptionActivationAuthorized !==
      false ||
    boundary.entitlementMutationAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.historicalSourceDigestsPreserved !==
      true ||
    boundary.priorActivationAuthorityRevived !==
      false
  ) {
    throw new Error(
      "Bounded onboarding execution authority boundary is not eligible for owner review.",
    );
  }
}

export function validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
  record:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision,
): void {
  verifyReviewDigest(
    record as unknown as
      DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      [
        "Bounded onboarding execution review ID",
        record.reviewId,
      ],
      [
        "Bounded onboarding execution ID",
        record.executionId,
      ],
      [
        "Bounded onboarding decision ID",
        record.decisionId,
      ],
      [
        "Bounded onboarding preparation ID",
        record.preparationId,
      ],
      [
        "Source boundary decision ID",
        record.sourceBoundaryDecisionId,
      ],
      [
        "Source boundary preparation ID",
        record.sourceBoundaryPreparationId,
      ],
      [
        "Bounded onboarding tenant ID",
        record.tenantId,
      ],
      [
        "Bounded onboarding owner ID",
        record.ownerId,
      ],
      [
        "Bounded onboarding customer organization ID",
        record.customerOrganizationId,
      ],
    ] as const
  ) {
    requireIdentifier(
      label,
      value,
    );
  }

  for (
    const [
      label,
      value,
    ] of [
      [
        "Bounded onboarding execution digest",
        record.executionDigest,
      ],
      [
        "Bounded onboarding decision digest",
        record.decisionDigest,
      ],
      [
        "Bounded onboarding preparation digest",
        record.preparationDigest,
      ],
      [
        "Source boundary decision digest",
        record.sourceBoundaryDecisionDigest,
      ],
      [
        "Source boundary preparation digest",
        record.sourceBoundaryPreparationDigest,
      ],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireRationale(
    record.rationale,
  );

  requireTimestamp(
    record.reviewedAt,
  );

  const approved =
    record.outcome ===
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW";

  if (
    record.version !==
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_DECISION_VERSION ||
    record.reviewState !==
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_RECORDED" ||
    record.department !==
      "SALES" ||
    (
      record.outcome !==
        "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW" &&
      record.outcome !==
        "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY"
    ) ||
    record.approved !==
      approved ||
    typeof record.customerOrganizationName !==
      "string" ||
    record.customerOrganizationName.trim() !==
      record.customerOrganizationName ||
    record.customerOrganizationName.length <
      2
  ) {
    throw new Error(
      "Bounded onboarding execution review identity or outcome is invalid.",
    );
  }

  const reviewed =
    record.reviewedExecution;

  if (
    reviewed.executionState !==
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED" ||
    reviewed.customerOrganizationCount !==
      1 ||
    reviewed.executionAttemptCount !==
      1 ||
    reviewed.ownerSupervisionVerified !==
      true ||
    reviewed.authenticatedCustomerIdentityRequirementPreserved !==
      true ||
    reviewed.explicitCustomerConsentRequirementPreserved !==
      true ||
    reviewed.tenantScopePreserved !==
      true ||
    reviewed.customerScopePreserved !==
      true ||
    reviewed.minimumNecessaryDataRequirementPreserved !==
      true ||
    reviewed.retentionAndRedactionRequirementPreserved !==
      true ||
    reviewed.idempotencyControlEnforced !==
      true ||
    reviewed.atomicityControlEnforced !==
      true ||
    reviewed.rollbackControlAvailable !==
      true ||
    reviewed.auditEvidenceCreated !==
      true ||
    reviewed.executionNextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Bounded onboarding reviewed execution evidence is invalid.",
    );
  }

  const review =
    record.reviewBoundary;

  if (
    review.sourceExecutionIntegrityVerified !==
      true ||
    review.exactTenantBound !==
      true ||
    review.exactOwnerBound !==
      true ||
    review.exactCustomerOrganizationBound !==
      true ||
    review.ownerExecutionApprovalBound !==
      true ||
    review.ownerReviewRequiredAfterExecution !==
      true ||
    review.ownerPostExecutionReviewRecorded !==
      true ||
    review.boundedOnboardingExecutionAuthorized !==
      true ||
    review.boundedOnboardingExecutionPerformed !==
      true ||
    review.controlledExecutionReceiptVerified !==
      true ||
    review.controlledExecutionEvidenceAccepted !==
      approved ||
    review.boundedExecutionReviewCompleted !==
      true ||
    review.approvalBypassAllowed !==
      false ||
    review.duplicateBoundedExecutionAuthorized !==
      false ||
    review.realCustomerOnboardingExecuted !==
      false ||
    review.realCustomerOnboardingCompletionRecorded !==
      false ||
    review.historicalRecordsMutated !==
      false ||
    review.historicalSourceDigestsPreserved !==
      true ||
    review.priorActivationAuthorityRevived !==
      false ||
    Object.values(
      record.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    ) ||
    record.nextStep !==
      (
        approved
          ? "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_COMPLETE"
          : "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY"
      )
  ) {
    throw new Error(
      "Bounded onboarding execution review state or authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedExecution,
    ) ||
    !Object.isFrozen(
      record.reviewBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Bounded onboarding execution review decision must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
  input:
    CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecisionInput,
): SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision {
  const execution =
    input.boundedRealCustomerOnboardingExecution;

  validateReviewableExecution(
    execution,
  );

  requireIdentifier(
    "Bounded onboarding execution review ID",
    input.reviewId,
  );

  requireIdentifier(
    "Bounded onboarding execution review owner ID",
    input.ownerId,
  );

  requireRationale(
    input.rationale,
  );

  requireTimestamp(
    input.reviewedAt,
  );

  if (
    input.ownerId !==
    execution.ownerId
  ) {
    throw new Error(
      "Only the bounded-onboarding-execution-bound owner may record this review.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW" &&
    input.outcome !==
      "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY"
  ) {
    throw new Error(
      "Bounded onboarding execution review outcome is invalid.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
    Date.parse(execution.executedAt)
  ) {
    throw new Error(
      "Bounded onboarding execution review cannot precede execution.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW";

  const receipt =
    execution.executionReceipt;

  const core = {
    version:
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_DECISION_VERSION,

    reviewId:
      input.reviewId,

    reviewState:
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_RECORDED" as const,

    department:
      "SALES" as const,

    executionId:
      execution.executionId,

    executionDigest:
      execution.executionDigest,

    decisionId:
      execution.decisionId,

    decisionDigest:
      execution.decisionDigest,

    preparationId:
      execution.preparationId,

    preparationDigest:
      execution.preparationDigest,

    sourceBoundaryDecisionId:
      execution.sourceBoundaryDecisionId,

    sourceBoundaryDecisionDigest:
      execution.sourceBoundaryDecisionDigest,

    sourceBoundaryPreparationId:
      execution.sourceBoundaryPreparationId,

    sourceBoundaryPreparationDigest:
      execution.sourceBoundaryPreparationDigest,

    tenantId:
      execution.tenantId,

    ownerId:
      execution.ownerId,

    customerOrganizationId:
      execution.customerOrganizationId,

    customerOrganizationName:
      execution.customerOrganizationName,

    outcome:
      input.outcome,

    approved,

    reviewedExecution: {
      executionState:
        execution.executionState,

      customerOrganizationCount:
        receipt.customerOrganizationCount,

      executionAttemptCount:
        receipt.executionAttemptCount,

      ownerSupervisionVerified:
        receipt.ownerSupervisionVerified,

      authenticatedCustomerIdentityRequirementPreserved:
        receipt.authenticatedCustomerIdentityRequirementPreserved,

      explicitCustomerConsentRequirementPreserved:
        receipt.explicitCustomerConsentRequirementPreserved,

      tenantScopePreserved:
        receipt.tenantScopePreserved,

      customerScopePreserved:
        receipt.customerScopePreserved,

      minimumNecessaryDataRequirementPreserved:
        receipt.minimumNecessaryDataRequirementPreserved,

      retentionAndRedactionRequirementPreserved:
        receipt.retentionAndRedactionRequirementPreserved,

      idempotencyControlEnforced:
        receipt.idempotencyControlEnforced,

      atomicityControlEnforced:
        receipt.atomicityControlEnforced,

      rollbackControlAvailable:
        receipt.rollbackControlAvailable,

      auditEvidenceCreated:
        receipt.auditEvidenceCreated,

      executionNextStep:
        execution.nextStep,
    },

    reviewBoundary: {
      sourceExecutionIntegrityVerified:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactCustomerOrganizationBound:
        true as const,

      ownerExecutionApprovalBound:
        true as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      ownerPostExecutionReviewRecorded:
        true as const,

      boundedOnboardingExecutionAuthorized:
        true as const,

      boundedOnboardingExecutionPerformed:
        true as const,

      controlledExecutionReceiptVerified:
        true as const,

      controlledExecutionEvidenceAccepted:
        approved,

      boundedExecutionReviewCompleted:
        true as const,

      approvalBypassAllowed:
        false as const,

      duplicateBoundedExecutionAuthorized:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      realCustomerOnboardingCompletionRecorded:
        false as const,

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      priorActivationAuthorityRevived:
        false as const,
    },

    authorityBoundary: {
      realCustomerContactDetailsStorageAuthorized:
        false as const,

      customerAccountCreationAuthorized:
        false as const,

      customerSessionIssuanceAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      customerCommitmentAuthorized:
        false as const,

      authenticatedPortalReleaseExecutionAuthorized:
        false as const,

      externalDeliveryExecutionAuthorized:
        false as const,

      externalEmailDeliveryAuthorized:
        false as const,

      externalWhatsAppDeliveryAuthorized:
        false as const,

      externalSmsDeliveryAuthorized:
        false as const,

      publicLinkDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paidPilotEligible:
        false as const,

      paidPilotAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      invoiceCreationAuthorized:
        false as const,

      subscriptionActivationAuthorized:
        false as const,

      entitlementMutationAuthorized:
        false as const,

      autonomousExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    rationale:
      input.rationale.trim(),

    nextStep:
      (
        approved
          ? "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_COMPLETE"
          : "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY"
      ) as
        | "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW_COMPLETE"
        | "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_ONLY",

    reviewedAt:
      input.reviewedAt,
  };

  const review =
    deepFreeze({
      ...core,

      reviewDigest:
        sha256(core),
    }) as
      SalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision;

  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionReviewDecision(
    review,
  );

  return review;
}