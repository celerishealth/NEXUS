import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision,
  type SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision,
} from "./salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision";

export const SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_VERSION =
  "sales-core-launch-bounded-real-customer-onboarding-execution-preparation-v1" as const;

export interface CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput {
  readonly preparationId: string;

  readonly customerOnboardingAndDeliveryBoundaryDecision:
    SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision;

  readonly ownerId: string;
  readonly rationale: string;
  readonly preparedAt: string;
}

export interface SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation {
  readonly version:
    typeof SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_VERSION;

  readonly preparationId: string;

  readonly preparationState:
    "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED";

  readonly department:
    "SALES";

  readonly sourceDecisionId: string;
  readonly sourceDecisionDigest: string;

  readonly sourceBoundaryPreparationId: string;
  readonly sourceBoundaryPreparationDigest: string;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly customerOrganizationId: string;
  readonly customerOrganizationName: string;

  readonly executionPlan: Readonly<{
    planClass:
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION";

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

    realCustomerContactDetailsStored:
      false;

    customerAccountCreated:
      false;

    customerSessionIssued:
      false;

    realCustomerOnboardingExecuted:
      false;

    authenticatedPortalReleaseExecuted:
      false;
  }>;

  readonly preparationBoundary: Readonly<{
    sourceDecisionIntegrityVerified:
      true;

    sourceApprovedBoundaryVerified:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    exactCustomerOrganizationBound:
      true;

    boundedExecutionPreparationEligible:
      true;

    boundedExecutionPreparationCreated:
      true;

    ownerExecutionDecisionRequired:
      true;

    ownerExecutionDecisionRecorded:
      false;

    boundedOnboardingExecutionAuthorized:
      false;

    realCustomerOnboardingExecuted:
      false;

    authenticatedPortalReleaseExecutionAuthorized:
      false;

    authenticatedPortalReleaseExecuted:
      false;

    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;

    priorActivationAuthorityRevived:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    approvalBypassAllowed:
      false;

    runtimeActivationAuthorized:
      false;

    controlledWorkAuthorized:
      false;

    boundedOnboardingExecutionAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    customerAccountCreationAuthorized:
      false;

    customerSessionIssuanceAuthorized:
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

  readonly rationale: string;

  readonly nextStep:
    "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION";

  readonly preparedAt: string;
  readonly preparationDigest: string;
}

type DigestRecord =
  Record<string, unknown>;

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
      "Unsupported deterministic bounded-onboarding preparation value.",
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
    !Number.isFinite(Date.parse(value))
  ) {
    throw new Error(
      "Bounded onboarding execution preparation time is invalid.",
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
      "Bounded onboarding execution preparation rationale must be safe, explicit, and non-secret.",
    );
  }
}

function verifyPreparationDigest(
  record: DigestRecord,
): void {
  const digest =
    record.preparationDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Bounded onboarding execution preparation digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.preparationDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Bounded onboarding execution preparation integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
  record:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
): void {
  verifyPreparationDigest(
    record as unknown as DigestRecord,
  );

  requireIdentifier(
    "Bounded onboarding execution preparation ID",
    record.preparationId,
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

  requireIdentifier(
    "Source onboarding decision ID",
    record.sourceDecisionId,
  );

  requireIdentifier(
    "Source boundary preparation ID",
    record.sourceBoundaryPreparationId,
  );

  requireDigest(
    "Source onboarding decision digest",
    record.sourceDecisionDigest,
  );

  requireDigest(
    "Source boundary preparation digest",
    record.sourceBoundaryPreparationDigest,
  );

  requireRationale(record.rationale);
  requireTimestamp(record.preparedAt);

  const plan =
    record.executionPlan;

  const boundary =
    record.preparationBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_VERSION ||
    record.preparationState !==
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED" ||
    record.department !==
      "SALES" ||
    plan.planClass !==
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" ||
    plan.customerOrganizationCount !==
      1 ||
    plan.onboardingMode !==
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" ||
    plan.deliveryMode !==
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" ||
    plan.ownerSupervisionRequired !==
      true ||
    plan.authenticatedCustomerIdentityRequired !==
      true ||
    plan.explicitCustomerConsentRequired !==
      true ||
    plan.tenantScopedAccessRequired !==
      true ||
    plan.customerScopedAccessRequired !==
      true ||
    plan.minimumNecessaryDataRequired !==
      true ||
    plan.retentionAndRedactionRequired !==
      true ||
    plan.idempotentExecutionRequired !==
      true ||
    plan.atomicExecutionRequired !==
      true ||
    plan.rollbackRequired !==
      true ||
    plan.auditEvidenceRequired !==
      true ||
    plan.realCustomerContactDetailsStored !==
      false ||
    plan.customerAccountCreated !==
      false ||
    plan.customerSessionIssued !==
      false ||
    plan.realCustomerOnboardingExecuted !==
      false ||
    plan.authenticatedPortalReleaseExecuted !==
      false ||
    boundary.sourceDecisionIntegrityVerified !==
      true ||
    boundary.sourceApprovedBoundaryVerified !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.exactCustomerOrganizationBound !==
      true ||
    boundary.boundedExecutionPreparationEligible !==
      true ||
    boundary.boundedExecutionPreparationCreated !==
      true ||
    boundary.ownerExecutionDecisionRequired !==
      true ||
    boundary.ownerExecutionDecisionRecorded !==
      false ||
    boundary.boundedOnboardingExecutionAuthorized !==
      false ||
    boundary.realCustomerOnboardingExecuted !==
      false ||
    boundary.authenticatedPortalReleaseExecutionAuthorized !==
      false ||
    boundary.authenticatedPortalReleaseExecuted !==
      false ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.historicalSourceDigestsPreserved !==
      true ||
    boundary.priorActivationAuthorityRevived !==
      false ||
    Object.values(
      record.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    ) ||
    record.nextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION"
  ) {
    throw new Error(
      "Sales core launch bounded real-customer onboarding execution preparation is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.executionPlan,
    ) ||
    !Object.isFrozen(
      record.preparationBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Sales core launch bounded real-customer onboarding execution preparation must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
  input:
    CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparationInput,
): SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation {
  const source =
    input.customerOnboardingAndDeliveryBoundaryDecision;

  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
    source,
  );

  requireIdentifier(
    "Bounded onboarding execution preparation ID",
    input.preparationId,
  );

  requireIdentifier(
    "Bounded onboarding owner ID",
    input.ownerId,
  );

  requireRationale(input.rationale);
  requireTimestamp(input.preparedAt);

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the onboarding-decision-bound owner may prepare bounded onboarding execution.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
      Date.parse(source.decidedAt)
  ) {
    throw new Error(
      "Bounded onboarding execution preparation cannot precede the owner decision.",
    );
  }

  const sourceBoundary =
    source.decisionBoundary;

  if (
    source.decision !==
      "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES" ||
    source.approved !==
      true ||
    source.nextStep !==
      "PREPARE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" ||
    sourceBoundary.sourcePreparationIntegrityVerified !==
      true ||
    sourceBoundary.sourceCommercialInfrastructureClosureVerified !==
      true ||
    sourceBoundary.exactTenantBound !==
      true ||
    sourceBoundary.exactOwnerBound !==
      true ||
    sourceBoundary.exactCustomerOrganizationBound !==
      true ||
    sourceBoundary.ownerDecisionRecorded !==
      true ||
    sourceBoundary.approvalBypassAllowed !==
      false ||
    sourceBoundary.realCustomerOnboardingBoundaryApproved !==
      true ||
    sourceBoundary.ownerApprovedDeliveryBoundaryRecorded !==
      true ||
    sourceBoundary.boundedOnboardingExecutionPreparationEligible !==
      true ||
    sourceBoundary.boundedOnboardingExecutionAuthorized !==
      false ||
    sourceBoundary.realCustomerOnboardingExecuted !==
      false ||
    sourceBoundary.realCustomerContactDetailsStored !==
      false ||
    sourceBoundary.customerAccountCreationAuthorized !==
      false ||
    sourceBoundary.customerAccountCreated !==
      false ||
    sourceBoundary.customerSessionIssuanceAuthorized !==
      false ||
    sourceBoundary.customerSessionIssued !==
      false ||
    sourceBoundary.realCustomerDataAccessAuthorized !==
      false ||
    sourceBoundary.realCustomerContactAuthorized !==
      false ||
    sourceBoundary.customerCommitmentAuthorized !==
      false ||
    sourceBoundary.externalDeliveryExecutionAuthorized !==
      false ||
    sourceBoundary.liveProviderExecutionAuthorized !==
      false ||
    sourceBoundary.productionDatabaseAuthorized !==
      false ||
    sourceBoundary.productionMutationAuthorized !==
      false ||
    sourceBoundary.paidPilotEligible !==
      false ||
    sourceBoundary.paidPilotAuthorized !==
      false ||
    sourceBoundary.paymentExecutionAuthorized !==
      false ||
    sourceBoundary.invoiceCreationAuthorized !==
      false ||
    sourceBoundary.subscriptionActivationAuthorized !==
      false ||
    sourceBoundary.entitlementMutationAuthorized !==
      false ||
    sourceBoundary.autonomousExecutionAuthorized !==
      false ||
    sourceBoundary.publicLaunchAuthorized !==
      false ||
    sourceBoundary.historicalRecordsMutated !==
      false ||
    sourceBoundary.historicalSourceDigestsPreserved !==
      true ||
    sourceBoundary.priorActivationAuthorityRevived !==
      false
  ) {
    throw new Error(
      "Customer onboarding decision does not authorize bounded execution preparation.",
    );
  }

  const core = {
    version:
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED" as const,

    department:
      "SALES" as const,

    sourceDecisionId:
      source.decisionId,

    sourceDecisionDigest:
      source.decisionDigest,

    sourceBoundaryPreparationId:
      source.preparationId,

    sourceBoundaryPreparationDigest:
      source.preparationDigest,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    customerOrganizationId:
      source.customerOrganizationId,

    customerOrganizationName:
      source.customerOrganizationName,

    executionPlan: {
      planClass:
        "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" as const,

      customerOrganizationCount:
        1 as const,

      onboardingMode:
        source.reviewedPreparation.onboardingMode,

      deliveryMode:
        source.reviewedPreparation.deliveryMode,

      ownerSupervisionRequired:
        true as const,

      authenticatedCustomerIdentityRequired:
        source.reviewedPreparation.authenticatedCustomerIdentityRequired,

      explicitCustomerConsentRequired:
        source.reviewedPreparation.explicitCustomerConsentRequired,

      tenantScopedAccessRequired:
        source.reviewedPreparation.tenantScopedAccessRequired,

      customerScopedAccessRequired:
        source.reviewedPreparation.customerScopedAccessRequired,

      minimumNecessaryDataRequired:
        true as const,

      retentionAndRedactionRequired:
        true as const,

      idempotentExecutionRequired:
        true as const,

      atomicExecutionRequired:
        true as const,

      rollbackRequired:
        true as const,

      auditEvidenceRequired:
        true as const,

      realCustomerContactDetailsStored:
        false as const,

      customerAccountCreated:
        false as const,

      customerSessionIssued:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      authenticatedPortalReleaseExecuted:
        false as const,
    },

    preparationBoundary: {
      sourceDecisionIntegrityVerified:
        true as const,

      sourceApprovedBoundaryVerified:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactCustomerOrganizationBound:
        true as const,

      boundedExecutionPreparationEligible:
        true as const,

      boundedExecutionPreparationCreated:
        true as const,

      ownerExecutionDecisionRequired:
        true as const,

      ownerExecutionDecisionRecorded:
        false as const,

      boundedOnboardingExecutionAuthorized:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      authenticatedPortalReleaseExecutionAuthorized:
        false as const,

      authenticatedPortalReleaseExecuted:
        false as const,

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      priorActivationAuthorityRevived:
        false as const,
    },

    authorityBoundary: {
      approvalBypassAllowed:
        false as const,

      runtimeActivationAuthorized:
        false as const,

      controlledWorkAuthorized:
        false as const,

      boundedOnboardingExecutionAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      customerAccountCreationAuthorized:
        false as const,

      customerSessionIssuanceAuthorized:
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
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...core,

      preparationDigest:
        sha256(core),
    }) as
      SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation;

  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
    preparation,
  );

  return preparation;
}
