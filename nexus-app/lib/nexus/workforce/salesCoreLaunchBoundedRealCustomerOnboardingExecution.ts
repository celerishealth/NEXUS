import { createHash } from "node:crypto";

import {
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
} from "./salesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision";

export const SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_VERSION =
  "sales-core-launch-bounded-real-customer-onboarding-execution-v1" as const;

export interface ExecuteSalesCoreLaunchBoundedRealCustomerOnboardingInput {
  readonly executionId:
    string;

  readonly boundedRealCustomerOnboardingExecutionDecision:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision;

  readonly ownerId:
    string;

  readonly executedAt:
    string;
}

export interface SalesCoreLaunchBoundedRealCustomerOnboardingExecution {
  readonly version:
    typeof SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED";

  readonly department:
    "SALES";

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

  readonly reviewedDecision: Readonly<{
    decisionState:
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_RECORDED";

    decision:
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION";

    approvedForBoundedOnboardingExecution:
      true;

    preparationState:
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED";

    customerOrganizationCount:
      1;

    onboardingMode:
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER";

    deliveryMode:
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY";

    ownerSupervisionRequired:
      true;

    authenticatedCustomerIdentityRequired:
      true;

    explicitCustomerConsentRequired:
      true;

    tenantScopedAccessRequired:
      true;

    customerScopedAccessRequired:
      true;

    minimumNecessaryDataRequired:
      true;

    retentionAndRedactionRequired:
      true;

    idempotentExecutionRequired:
      true;

    atomicExecutionRequired:
      true;

    rollbackRequired:
      true;

    auditEvidenceRequired:
      true;

    preparationNextStep:
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION";

    decisionNextStep:
      "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING";
  }>;

  readonly executionReceipt: Readonly<{
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

    realCustomerContactDetailsStored:
      false;

    customerAccountCreated:
      false;

    customerSessionIssued:
      false;

    realCustomerDataAccessed:
      false;

    realCustomerContactPerformed:
      false;

    customerCommitmentCreated:
      false;

    realCustomerOnboardingExecuted:
      false;

    authenticatedPortalReleaseExecuted:
      false;
  }>;

  readonly executionBoundary: Readonly<{
    sourceDecisionIntegrityVerified:
      true;

    sourcePreparationIntegrityVerified:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    exactCustomerOrganizationBound:
      true;

    ownerExecutionApprovalBound:
      true;

    approvalBypassAllowed:
      false;

    boundedOnboardingExecutionAuthorized:
      true;

    boundedOnboardingExecutionPerformed:
      true;

    controlledExecutionReceiptCreated:
      true;

    ownerReviewRequiredAfterExecution:
      true;

    ownerPostExecutionReviewRecorded:
      false;

    realCustomerOnboardingExecuted:
      false;

    realCustomerContactDetailsStored:
      false;

    customerAccountCreationAuthorized:
      false;

    customerAccountCreated:
      false;

    customerSessionIssuanceAuthorized:
      false;

    customerSessionIssued:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerDataAccessed:
      false;

    realCustomerContactAuthorized:
      false;

    realCustomerContactPerformed:
      false;

    customerCommitmentAuthorized:
      false;

    customerCommitmentCreated:
      false;

    authenticatedPortalReleaseExecutionAuthorized:
      false;

    authenticatedPortalReleaseExecuted:
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

    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;

    priorActivationAuthorityRevived:
      false;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW";

  readonly executedAt:
    string;

  readonly executionDigest:
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
      "Unsupported deterministic bounded-onboarding execution value.",
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
      "Bounded real-customer onboarding execution time is invalid.",
    );
  }
}

function verifyExecutionDigest(
  record: DigestRecord,
): void {
  const digest =
    record.executionDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Bounded real-customer onboarding execution digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.executionDigest;

  if (
    sha256(unsigned) !==
    digest
  ) {
    throw new Error(
      "Bounded real-customer onboarding execution integrity verification failed.",
    );
  }
}

function validateApprovedSource(
  source:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
): void {
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
    source,
  );

  const reviewed =
    source.reviewedPreparation;

  const boundary =
    source.authorityBoundary;

  if (
    source.decisionState !==
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_RECORDED" ||
    source.decision !==
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" ||
    source.approvedForBoundedOnboardingExecution !==
      true ||
    source.nextStep !==
      "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING"
  ) {
    throw new Error(
      "Bounded onboarding execution requires the approved Workforce Day 124 owner decision.",
    );
  }

  if (
    reviewed.preparationState !==
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED" ||
    reviewed.customerOrganizationCount !==
      1 ||
    reviewed.onboardingMode !==
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" ||
    reviewed.deliveryMode !==
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" ||
    reviewed.ownerSupervisionRequired !==
      true ||
    reviewed.authenticatedCustomerIdentityRequired !==
      true ||
    reviewed.explicitCustomerConsentRequired !==
      true ||
    reviewed.tenantScopedAccessRequired !==
      true ||
    reviewed.customerScopedAccessRequired !==
      true ||
    reviewed.minimumNecessaryDataRequired !==
      true ||
    reviewed.retentionAndRedactionRequired !==
      true ||
    reviewed.idempotentExecutionRequired !==
      true ||
    reviewed.atomicExecutionRequired !==
      true ||
    reviewed.rollbackRequired !==
      true ||
    reviewed.auditEvidenceRequired !==
      true ||
    reviewed.realCustomerContactDetailsStored !==
      false ||
    reviewed.customerAccountCreated !==
      false ||
    reviewed.customerSessionIssued !==
      false ||
    reviewed.realCustomerOnboardingExecuted !==
      false ||
    reviewed.authenticatedPortalReleaseExecuted !==
      false ||
    reviewed.preparationNextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Bounded onboarding execution reviewed preparation is invalid.",
    );
  }

  if (
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.exactCustomerOrganizationBound !==
      true ||
    boundary.ownerExecutionDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.boundedExecutionPreparationEligible !==
      true ||
    boundary.boundedExecutionPreparationCreated !==
      true ||
    boundary.boundedOnboardingExecutionAuthorized !==
      true ||
    boundary.boundedOnboardingExecutionPerformed !==
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
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.customerCommitmentAuthorized !==
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
      "Bounded onboarding execution owner-decision authority boundary is invalid.",
    );
  }
}

export function validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution(
  record:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecution,
): void {
  verifyExecutionDigest(
    record as unknown as
      DigestRecord,
  );

  requireIdentifier(
    "Bounded onboarding execution ID",
    record.executionId,
  );

  requireIdentifier(
    "Bounded onboarding decision ID",
    record.decisionId,
  );

  requireIdentifier(
    "Bounded onboarding preparation ID",
    record.preparationId,
  );

  requireIdentifier(
    "Bounded onboarding source-boundary decision ID",
    record.sourceBoundaryDecisionId,
  );

  requireIdentifier(
    "Bounded onboarding source-boundary preparation ID",
    record.sourceBoundaryPreparationId,
  );

  requireIdentifier(
    "Bounded onboarding tenant ID",
    record.tenantId,
  );

  requireIdentifier(
    "Bounded onboarding owner ID",
    record.ownerId,
  );

  requireIdentifier(
    "Bounded onboarding customer organization ID",
    record.customerOrganizationId,
  );

  requireDigest(
    "Bounded onboarding decision digest",
    record.decisionDigest,
  );

  requireDigest(
    "Bounded onboarding preparation digest",
    record.preparationDigest,
  );

  requireDigest(
    "Bounded onboarding source-boundary decision digest",
    record.sourceBoundaryDecisionDigest,
  );

  requireDigest(
    "Bounded onboarding source-boundary preparation digest",
    record.sourceBoundaryPreparationDigest,
  );

  requireTimestamp(
    record.executedAt,
  );

  if (
    record.version !==
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_VERSION ||
    record.executionState !==
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED" ||
    record.department !==
      "SALES" ||
    typeof record.customerOrganizationName !==
      "string" ||
    record.customerOrganizationName.trim() !==
      record.customerOrganizationName ||
    record.customerOrganizationName.length <
      2
  ) {
    throw new Error(
      "Bounded real-customer onboarding execution identity is invalid.",
    );
  }

  const reviewed =
    record.reviewedDecision;

  if (
    reviewed.decisionState !==
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_RECORDED" ||
    reviewed.decision !==
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" ||
    reviewed.approvedForBoundedOnboardingExecution !==
      true ||
    reviewed.preparationState !==
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED" ||
    reviewed.customerOrganizationCount !==
      1 ||
    reviewed.onboardingMode !==
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" ||
    reviewed.deliveryMode !==
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" ||
    reviewed.ownerSupervisionRequired !==
      true ||
    reviewed.authenticatedCustomerIdentityRequired !==
      true ||
    reviewed.explicitCustomerConsentRequired !==
      true ||
    reviewed.tenantScopedAccessRequired !==
      true ||
    reviewed.customerScopedAccessRequired !==
      true ||
    reviewed.minimumNecessaryDataRequired !==
      true ||
    reviewed.retentionAndRedactionRequired !==
      true ||
    reviewed.idempotentExecutionRequired !==
      true ||
    reviewed.atomicExecutionRequired !==
      true ||
    reviewed.rollbackRequired !==
      true ||
    reviewed.auditEvidenceRequired !==
      true ||
    reviewed.preparationNextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION" ||
    reviewed.decisionNextStep !==
      "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING"
  ) {
    throw new Error(
      "Bounded real-customer onboarding reviewed decision is invalid.",
    );
  }

  const receipt =
    record.executionReceipt;

  if (
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
      "Bounded real-customer onboarding execution receipt is invalid.",
    );
  }

  const boundary =
    record.executionBoundary;

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
      false ||
    record.nextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Bounded real-customer onboarding execution authority boundary is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedDecision,
    ) ||
    !Object.isFrozen(
      record.executionReceipt,
    ) ||
    !Object.isFrozen(
      record.executionBoundary,
    )
  ) {
    throw new Error(
      "Bounded real-customer onboarding execution must be deeply immutable.",
    );
  }
}

export function executeSalesCoreLaunchBoundedRealCustomerOnboarding(
  input:
    ExecuteSalesCoreLaunchBoundedRealCustomerOnboardingInput,
): SalesCoreLaunchBoundedRealCustomerOnboardingExecution {
  const source =
    input.boundedRealCustomerOnboardingExecutionDecision;

  validateApprovedSource(
    source,
  );

  requireIdentifier(
    "Bounded onboarding execution ID",
    input.executionId,
  );

  requireIdentifier(
    "Bounded onboarding execution owner ID",
    input.ownerId,
  );

  requireTimestamp(
    input.executedAt,
  );

  if (
    input.ownerId !==
    source.ownerId
  ) {
    throw new Error(
      "Only the Day 124 decision-bound owner may execute bounded onboarding.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Bounded real-customer onboarding execution cannot precede owner approval.",
    );
  }

  const reviewed =
    source.reviewedPreparation;

  const executionCore = {
    version:
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_RECORDED" as const,

    department:
      "SALES" as const,

    decisionId:
      source.decisionId,

    decisionDigest:
      source.decisionDigest,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceBoundaryDecisionId:
      source.sourceBoundaryDecisionId,

    sourceBoundaryDecisionDigest:
      source.sourceBoundaryDecisionDigest,

    sourceBoundaryPreparationId:
      source.sourceBoundaryPreparationId,

    sourceBoundaryPreparationDigest:
      source.sourceBoundaryPreparationDigest,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    customerOrganizationId:
      source.customerOrganizationId,

    customerOrganizationName:
      source.customerOrganizationName,

    reviewedDecision: {
      decisionState:
        source.decisionState,

      decision:
        source.decision,

      approvedForBoundedOnboardingExecution:
        true as const,

      preparationState:
        reviewed.preparationState,

      customerOrganizationCount:
        reviewed.customerOrganizationCount,

      onboardingMode:
        reviewed.onboardingMode,

      deliveryMode:
        reviewed.deliveryMode,

      ownerSupervisionRequired:
        reviewed.ownerSupervisionRequired,

      authenticatedCustomerIdentityRequired:
        reviewed.authenticatedCustomerIdentityRequired,

      explicitCustomerConsentRequired:
        reviewed.explicitCustomerConsentRequired,

      tenantScopedAccessRequired:
        reviewed.tenantScopedAccessRequired,

      customerScopedAccessRequired:
        reviewed.customerScopedAccessRequired,

      minimumNecessaryDataRequired:
        reviewed.minimumNecessaryDataRequired,

      retentionAndRedactionRequired:
        reviewed.retentionAndRedactionRequired,

      idempotentExecutionRequired:
        reviewed.idempotentExecutionRequired,

      atomicExecutionRequired:
        reviewed.atomicExecutionRequired,

      rollbackRequired:
        reviewed.rollbackRequired,

      auditEvidenceRequired:
        reviewed.auditEvidenceRequired,

      preparationNextStep:
        reviewed.preparationNextStep,

      decisionNextStep:
        source.nextStep,
    },

    executionReceipt: {
      customerOrganizationCount:
        1 as const,

      executionAttemptCount:
        1 as const,

      ownerSupervisionVerified:
        true as const,

      authenticatedCustomerIdentityRequirementPreserved:
        true as const,

      explicitCustomerConsentRequirementPreserved:
        true as const,

      tenantScopePreserved:
        true as const,

      customerScopePreserved:
        true as const,

      minimumNecessaryDataRequirementPreserved:
        true as const,

      retentionAndRedactionRequirementPreserved:
        true as const,

      idempotencyControlEnforced:
        true as const,

      atomicityControlEnforced:
        true as const,

      rollbackControlAvailable:
        true as const,

      auditEvidenceCreated:
        true as const,

      realCustomerContactDetailsStored:
        false as const,

      customerAccountCreated:
        false as const,

      customerSessionIssued:
        false as const,

      realCustomerDataAccessed:
        false as const,

      realCustomerContactPerformed:
        false as const,

      customerCommitmentCreated:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      authenticatedPortalReleaseExecuted:
        false as const,
    },

    executionBoundary: {
      sourceDecisionIntegrityVerified:
        true as const,

      sourcePreparationIntegrityVerified:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactCustomerOrganizationBound:
        true as const,

      ownerExecutionApprovalBound:
        true as const,

      approvalBypassAllowed:
        false as const,

      boundedOnboardingExecutionAuthorized:
        true as const,

      boundedOnboardingExecutionPerformed:
        true as const,

      controlledExecutionReceiptCreated:
        true as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      ownerPostExecutionReviewRecorded:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      realCustomerContactDetailsStored:
        false as const,

      customerAccountCreationAuthorized:
        false as const,

      customerAccountCreated:
        false as const,

      customerSessionIssuanceAuthorized:
        false as const,

      customerSessionIssued:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerDataAccessed:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      realCustomerContactPerformed:
        false as const,

      customerCommitmentAuthorized:
        false as const,

      customerCommitmentCreated:
        false as const,

      authenticatedPortalReleaseExecutionAuthorized:
        false as const,

      authenticatedPortalReleaseExecuted:
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

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      priorActivationAuthorityRevived:
        false as const,
    },

    nextStep:
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as
      SalesCoreLaunchBoundedRealCustomerOnboardingExecution;

  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecution(
    execution,
  );

  return execution;
}