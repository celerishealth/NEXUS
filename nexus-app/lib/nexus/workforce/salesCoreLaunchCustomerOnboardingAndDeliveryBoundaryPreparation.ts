import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialInfrastructureClosureRecord,
  type SalesCoreLaunchCommercialInfrastructureClosureRecord,
} from "./salesCoreLaunchCommercialInfrastructureClosureRecord";

export const SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_VERSION =
  "sales-core-launch-customer-onboarding-and-delivery-boundary-preparation-v1" as const;

export interface CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparationInput {
  readonly preparationId: string;

  readonly commercialInfrastructureClosure:
    SalesCoreLaunchCommercialInfrastructureClosureRecord;

  readonly ownerId: string;

  readonly customerOrganizationId: string;
  readonly customerOrganizationName: string;

  readonly rationale: string;
  readonly preparedAt: string;
}

export interface SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation {
  readonly version:
    typeof SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_VERSION;

  readonly preparationId: string;

  readonly preparationState:
    "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED";

  readonly department:
    "SALES";

  readonly tenantId: string;
  readonly ownerId: string;

  readonly customerOrganizationId: string;
  readonly customerOrganizationName: string;

  readonly sourceClosureId: string;
  readonly sourceClosureDigest: string;

  readonly sourceReassessmentId: string;
  readonly sourceReassessmentDigest: string;

  readonly sourceRequalificationId: string;
  readonly sourceRequalificationDigest: string;

  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly onboardingPreparation: Readonly<{
    onboardingMode:
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER";

    tenantBindingRequired:
      true;

    ownerBindingRequired:
      true;

    authenticatedCustomerIdentityRequired:
      true;

    explicitCustomerConsentRequired:
      true;

    minimumNecessaryCustomerDataOnly:
      true;

    customerDataRetentionPolicyRequired:
      true;

    customerDataRedactionRequired:
      true;

    crossTenantAccessBlocked:
      true;

    idempotentOnboardingRequired:
      true;

    atomicOnboardingRequired:
      true;

    rollbackOnFailureRequired:
      true;

    auditEvidenceRequired:
      true;

    realCustomerContactDetailsStored:
      false;

    customerAccountCreated:
      false;

    customerSessionIssued:
      false;

    customerOnboardingExecuted:
      false;
  }>;

  readonly deliveryBoundaryPreparation: Readonly<{
    deliveryMode:
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY";

    ownerReleaseRequired:
      true;

    authenticatedCustomerAccessRequired:
      true;

    tenantScopedAccessRequired:
      true;

    customerScopedAccessRequired:
      true;

    releasedResultOnly:
      true;

    sandboxResultOnly:
      true;

    idempotentAcknowledgementRequired:
      true;

    externalEmailDeliveryAllowed:
      false;

    externalWhatsAppDeliveryAllowed:
      false;

    externalSmsDeliveryAllowed:
      false;

    publicLinkDeliveryAllowed:
      false;

    liveProviderDeliveryAllowed:
      false;

    paymentCollectionAllowed:
      false;

    invoiceCreationAllowed:
      false;

    customerCommitmentAllowed:
      false;
  }>;

  readonly preparationBoundary: Readonly<{
    sourceCommercialInfrastructureClosureVerified:
      true;

    commercialInfrastructureFoundationClosed:
      true;

    realCustomerOnboardingPreparationEligible:
      true;

    realCustomerOnboardingPreparationCreated:
      true;

    realCustomerOnboardingDecisionRecorded:
      false;

    realCustomerOnboardingAuthorized:
      false;

    realCustomerOnboardingExecuted:
      false;

    ownerApprovedDeliveryBoundaryPreparationEligible:
      true;

    ownerApprovedDeliveryBoundaryPreparationCreated:
      true;

    ownerApprovedDeliveryBoundaryDecisionRecorded:
      false;

    ownerApprovedDeliveryBoundaryRecorded:
      false;

    externalDeliveryExecutionAuthorized:
      false;

    paidPilotEligible:
      false;

    paidPilotAuthorized:
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
    "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION";

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
      "Unsupported deterministic customer onboarding preparation value.",
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

function requireOrganizationName(
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < 3 ||
    value.length > 160 ||
    FORBIDDEN.test(value)
  ) {
    throw new Error(
      "Customer organization name is invalid.",
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
      "Customer onboarding preparation time is invalid.",
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
      "Customer onboarding preparation rationale must be safe, explicit, and non-secret.",
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
      "Customer onboarding preparation digest is invalid.",
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
      "Customer onboarding preparation integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
  record:
    SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
): void {
  verifyPreparationDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Preparation ID", record.preparationId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Customer organization ID", record.customerOrganizationId],
      ["Source closure ID", record.sourceClosureId],
      ["Source reassessment ID", record.sourceReassessmentId],
      ["Source requalification ID", record.sourceRequalificationId],
    ] as const
  ) {
    requireIdentifier(
      label,
      value,
    );
  }

  requireOrganizationName(
    record.customerOrganizationName,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Source closure digest", record.sourceClosureDigest],
      ["Source reassessment digest", record.sourceReassessmentDigest],
      ["Source requalification digest", record.sourceRequalificationDigest],
      ["Source containment digest", record.sourceContainmentDigest],
      ["Source registry digest", record.sourceRegistryDigest],
    ] as const
  ) {
    requireDigest(
      label,
      value,
    );
  }

  requireRationale(record.rationale);
  requireTimestamp(record.preparedAt);

  const onboarding =
    record.onboardingPreparation;

  const delivery =
    record.deliveryBoundaryPreparation;

  const boundary =
    record.preparationBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_VERSION ||
    record.preparationState !==
      "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED" ||
    record.department !==
      "SALES" ||
    onboarding.onboardingMode !==
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" ||
    onboarding.tenantBindingRequired !==
      true ||
    onboarding.ownerBindingRequired !==
      true ||
    onboarding.authenticatedCustomerIdentityRequired !==
      true ||
    onboarding.explicitCustomerConsentRequired !==
      true ||
    onboarding.minimumNecessaryCustomerDataOnly !==
      true ||
    onboarding.customerDataRetentionPolicyRequired !==
      true ||
    onboarding.customerDataRedactionRequired !==
      true ||
    onboarding.crossTenantAccessBlocked !==
      true ||
    onboarding.idempotentOnboardingRequired !==
      true ||
    onboarding.atomicOnboardingRequired !==
      true ||
    onboarding.rollbackOnFailureRequired !==
      true ||
    onboarding.auditEvidenceRequired !==
      true ||
    onboarding.realCustomerContactDetailsStored !==
      false ||
    onboarding.customerAccountCreated !==
      false ||
    onboarding.customerSessionIssued !==
      false ||
    onboarding.customerOnboardingExecuted !==
      false ||
    delivery.deliveryMode !==
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" ||
    delivery.ownerReleaseRequired !==
      true ||
    delivery.authenticatedCustomerAccessRequired !==
      true ||
    delivery.tenantScopedAccessRequired !==
      true ||
    delivery.customerScopedAccessRequired !==
      true ||
    delivery.releasedResultOnly !==
      true ||
    delivery.sandboxResultOnly !==
      true ||
    delivery.idempotentAcknowledgementRequired !==
      true ||
    delivery.externalEmailDeliveryAllowed !==
      false ||
    delivery.externalWhatsAppDeliveryAllowed !==
      false ||
    delivery.externalSmsDeliveryAllowed !==
      false ||
    delivery.publicLinkDeliveryAllowed !==
      false ||
    delivery.liveProviderDeliveryAllowed !==
      false ||
    delivery.paymentCollectionAllowed !==
      false ||
    delivery.invoiceCreationAllowed !==
      false ||
    delivery.customerCommitmentAllowed !==
      false ||
    boundary.sourceCommercialInfrastructureClosureVerified !==
      true ||
    boundary.commercialInfrastructureFoundationClosed !==
      true ||
    boundary.realCustomerOnboardingPreparationEligible !==
      true ||
    boundary.realCustomerOnboardingPreparationCreated !==
      true ||
    boundary.realCustomerOnboardingDecisionRecorded !==
      false ||
    boundary.realCustomerOnboardingAuthorized !==
      false ||
    boundary.realCustomerOnboardingExecuted !==
      false ||
    boundary.ownerApprovedDeliveryBoundaryPreparationEligible !==
      true ||
    boundary.ownerApprovedDeliveryBoundaryPreparationCreated !==
      true ||
    boundary.ownerApprovedDeliveryBoundaryDecisionRecorded !==
      false ||
    boundary.ownerApprovedDeliveryBoundaryRecorded !==
      false ||
    boundary.externalDeliveryExecutionAuthorized !==
      false ||
    boundary.paidPilotEligible !==
      false ||
    boundary.paidPilotAuthorized !==
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
      "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION"
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary preparation state is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.onboardingPreparation,
    ) ||
    !Object.isFrozen(
      record.deliveryBoundaryPreparation,
    ) ||
    !Object.isFrozen(
      record.preparationBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary preparation must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
  input:
    CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparationInput,
): SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation {
  const closure =
    input.commercialInfrastructureClosure;

  validateSalesCoreLaunchCommercialInfrastructureClosureRecord(
    closure,
  );

  requireIdentifier(
    "Preparation ID",
    input.preparationId,
  );

  requireIdentifier(
    "Preparation owner ID",
    input.ownerId,
  );

  requireIdentifier(
    "Customer organization ID",
    input.customerOrganizationId,
  );

  requireOrganizationName(
    input.customerOrganizationName,
  );

  requireRationale(input.rationale);
  requireTimestamp(input.preparedAt);

  if (
    input.ownerId !==
      closure.ownerId
  ) {
    throw new Error(
      "Only the closure-bound owner may prepare real customer onboarding and delivery boundaries.",
    );
  }

  if (
    Date.parse(input.preparedAt) <
      Date.parse(closure.closedAt)
  ) {
    throw new Error(
      "Customer onboarding preparation cannot precede commercial infrastructure closure.",
    );
  }

  const sourceBoundary =
    closure.closureBoundary;

  if (
    closure.closureState !==
      "OWNER_SALES_CORE_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORDED" ||
    closure.approved !==
      true ||
    closure.outcome !==
      "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE" ||
    closure.nextStep !==
      "PREPARE_REAL_CUSTOMER_ONBOARDING_AND_OWNER_APPROVED_DELIVERY_BOUNDARIES" ||
    sourceBoundary.correctedReadinessApproved !==
      true ||
    sourceBoundary.commercialInfrastructureFoundationClosureApproved !==
      true ||
    sourceBoundary.commercialInfrastructureFoundationClosed !==
      true ||
    sourceBoundary.commercialInfrastructureExecutionReady !==
      false ||
    sourceBoundary.realCustomerOnboardingPreparationEligible !==
      true ||
    sourceBoundary.realCustomerOnboardingExecutionAuthorized !==
      false ||
    sourceBoundary.ownerApprovedDeliveryBoundaryPreparationEligible !==
      true ||
    sourceBoundary.ownerApprovedDeliveryBoundaryRecorded !==
      false ||
    sourceBoundary.paidPilotEligible !==
      false ||
    sourceBoundary.paidPilotAuthorized !==
      false ||
    sourceBoundary.historicalRecordsMutated !==
      false ||
    sourceBoundary.historicalSourceDigestsPreserved !==
      true ||
    sourceBoundary.priorActivationAuthorityRevived !==
      false
  ) {
    throw new Error(
      "Commercial infrastructure closure is not eligible for onboarding and delivery-boundary preparation.",
    );
  }

  const core = {
    version:
      SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_VERSION,

    preparationId:
      input.preparationId,

    preparationState:
      "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED" as const,

    department:
      "SALES" as const,

    tenantId:
      closure.tenantId,

    ownerId:
      closure.ownerId,

    customerOrganizationId:
      input.customerOrganizationId,

    customerOrganizationName:
      input.customerOrganizationName,

    sourceClosureId:
      closure.closureId,

    sourceClosureDigest:
      closure.closureDigest,

    sourceReassessmentId:
      closure.sourceReassessmentId,

    sourceReassessmentDigest:
      closure.sourceReassessmentDigest,

    sourceRequalificationId:
      closure.sourceRequalificationId,

    sourceRequalificationDigest:
      closure.sourceRequalificationDigest,

    sourceContainmentDigest:
      closure.sourceContainmentDigest,

    sourceRegistryDigest:
      closure.sourceRegistryDigest,

    onboardingPreparation: {
      onboardingMode:
        "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" as const,

      tenantBindingRequired:
        true as const,

      ownerBindingRequired:
        true as const,

      authenticatedCustomerIdentityRequired:
        true as const,

      explicitCustomerConsentRequired:
        true as const,

      minimumNecessaryCustomerDataOnly:
        true as const,

      customerDataRetentionPolicyRequired:
        true as const,

      customerDataRedactionRequired:
        true as const,

      crossTenantAccessBlocked:
        true as const,

      idempotentOnboardingRequired:
        true as const,

      atomicOnboardingRequired:
        true as const,

      rollbackOnFailureRequired:
        true as const,

      auditEvidenceRequired:
        true as const,

      realCustomerContactDetailsStored:
        false as const,

      customerAccountCreated:
        false as const,

      customerSessionIssued:
        false as const,

      customerOnboardingExecuted:
        false as const,
    },

    deliveryBoundaryPreparation: {
      deliveryMode:
        "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" as const,

      ownerReleaseRequired:
        true as const,

      authenticatedCustomerAccessRequired:
        true as const,

      tenantScopedAccessRequired:
        true as const,

      customerScopedAccessRequired:
        true as const,

      releasedResultOnly:
        true as const,

      sandboxResultOnly:
        true as const,

      idempotentAcknowledgementRequired:
        true as const,

      externalEmailDeliveryAllowed:
        false as const,

      externalWhatsAppDeliveryAllowed:
        false as const,

      externalSmsDeliveryAllowed:
        false as const,

      publicLinkDeliveryAllowed:
        false as const,

      liveProviderDeliveryAllowed:
        false as const,

      paymentCollectionAllowed:
        false as const,

      invoiceCreationAllowed:
        false as const,

      customerCommitmentAllowed:
        false as const,
    },

    preparationBoundary: {
      sourceCommercialInfrastructureClosureVerified:
        true as const,

      commercialInfrastructureFoundationClosed:
        true as const,

      realCustomerOnboardingPreparationEligible:
        true as const,

      realCustomerOnboardingPreparationCreated:
        true as const,

      realCustomerOnboardingDecisionRecorded:
        false as const,

      realCustomerOnboardingAuthorized:
        false as const,

      realCustomerOnboardingExecuted:
        false as const,

      ownerApprovedDeliveryBoundaryPreparationEligible:
        true as const,

      ownerApprovedDeliveryBoundaryPreparationCreated:
        true as const,

      ownerApprovedDeliveryBoundaryDecisionRecorded:
        false as const,

      ownerApprovedDeliveryBoundaryRecorded:
        false as const,

      externalDeliveryExecutionAuthorized:
        false as const,

      paidPilotEligible:
        false as const,

      paidPilotAuthorized:
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
      "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION" as const,

    preparedAt:
      input.preparedAt,
  };

  const preparation =
    deepFreeze({
      ...core,

      preparationDigest:
        sha256(core),
    }) as SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation;

  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
    preparation,
  );

  return preparation;
}
