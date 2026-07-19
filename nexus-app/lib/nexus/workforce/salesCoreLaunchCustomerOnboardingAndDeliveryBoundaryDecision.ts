import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
  type SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation,
} from "./salesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation";

export const SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_VERSION =
  "sales-core-launch-customer-onboarding-and-delivery-boundary-decision-v1" as const;

export const SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISIONS = [
  "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES",
  "REJECT_AND_RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY",
] as const;

export type SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionType =
  (typeof SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISIONS)[number];

export interface CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionInput {
  readonly decisionId: string;

  readonly customerOnboardingAndDeliveryBoundaryPreparation:
    SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation;

  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionType;

  readonly reason: string;
  readonly decidedAt: string;
}

export interface SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_RECORDED";

  readonly department:
    "SALES";

  readonly preparationId: string;
  readonly preparationDigest: string;

  readonly sourceClosureId: string;
  readonly sourceClosureDigest: string;

  readonly sourceReassessmentId: string;
  readonly sourceReassessmentDigest: string;

  readonly sourceRequalificationId: string;
  readonly sourceRequalificationDigest: string;

  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly customerOrganizationId: string;
  readonly customerOrganizationName: string;

  readonly decision:
    SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionType;

  readonly approved:
    boolean;

  readonly reviewedPreparation: Readonly<{
    preparationState:
      "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED";

    onboardingMode:
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER";

    deliveryMode:
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY";

    authenticatedCustomerIdentityRequired:
      true;

    explicitCustomerConsentRequired:
      true;

    tenantScopedAccessRequired:
      true;

    customerScopedAccessRequired:
      true;

    ownerReleaseRequired:
      true;

    realCustomerContactDetailsStored:
      false;

    customerAccountCreated:
      false;

    customerSessionIssued:
      false;

    customerOnboardingExecuted:
      false;

    preparationNextStep:
      "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION";
  }>;

  readonly decisionBoundary: Readonly<{
    sourcePreparationIntegrityVerified:
      true;

    sourceCommercialInfrastructureClosureVerified:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    exactCustomerOrganizationBound:
      true;

    ownerDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    realCustomerOnboardingBoundaryApproved:
      boolean;

    ownerApprovedDeliveryBoundaryRecorded:
      boolean;

    boundedOnboardingExecutionPreparationEligible:
      boolean;

    boundedOnboardingExecutionAuthorized:
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

    realCustomerContactAuthorized:
      false;

    customerCommitmentAuthorized:
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

  readonly reason: string;

  readonly nextStep:
    | "PREPARE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION"
    | "RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY";

  readonly decidedAt: string;
  readonly decisionDigest: string;
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
      "Unsupported deterministic onboarding-boundary decision value.",
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
      "Customer onboarding and delivery-boundary decision time is invalid.",
    );
  }
}

function requireReason(
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
      "Customer onboarding and delivery-boundary decision reason must be safe, explicit, and non-secret.",
    );
  }
}

function verifyDecisionDigest(
  record: DigestRecord,
): void {
  const digest =
    record.decisionDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary decision digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.decisionDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary decision integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
  record:
    SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision,
): void {
  verifyDecisionDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Decision ID", record.decisionId],
      ["Preparation ID", record.preparationId],
      ["Source closure ID", record.sourceClosureId],
      ["Source reassessment ID", record.sourceReassessmentId],
      ["Source requalification ID", record.sourceRequalificationId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Customer organization ID", record.customerOrganizationId],
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
      ["Preparation digest", record.preparationDigest],
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

  requireReason(record.reason);
  requireTimestamp(record.decidedAt);

  const approved =
    record.decision ===
      "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES";

  const reviewed =
    record.reviewedPreparation;

  const boundary =
    record.decisionBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_RECORDED" ||
    record.department !==
      "SALES" ||
    (
      record.decision !==
        "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES" &&
      record.decision !==
        "REJECT_AND_RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY"
    ) ||
    record.approved !==
      approved ||
    reviewed.preparationState !==
      "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED" ||
    reviewed.onboardingMode !==
      "OWNER_SUPERVISED_CONTROLLED_REAL_CUSTOMER" ||
    reviewed.deliveryMode !==
      "AUTHENTICATED_CUSTOMER_PORTAL_RELEASE_ONLY" ||
    reviewed.authenticatedCustomerIdentityRequired !==
      true ||
    reviewed.explicitCustomerConsentRequired !==
      true ||
    reviewed.tenantScopedAccessRequired !==
      true ||
    reviewed.customerScopedAccessRequired !==
      true ||
    reviewed.ownerReleaseRequired !==
      true ||
    reviewed.realCustomerContactDetailsStored !==
      false ||
    reviewed.customerAccountCreated !==
      false ||
    reviewed.customerSessionIssued !==
      false ||
    reviewed.customerOnboardingExecuted !==
      false ||
    reviewed.preparationNextStep !==
      "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION" ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.sourceCommercialInfrastructureClosureVerified !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.exactCustomerOrganizationBound !==
      true ||
    boundary.ownerDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.realCustomerOnboardingBoundaryApproved !==
      approved ||
    boundary.ownerApprovedDeliveryBoundaryRecorded !==
      approved ||
    boundary.boundedOnboardingExecutionPreparationEligible !==
      approved ||
    boundary.boundedOnboardingExecutionAuthorized !==
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
      (
        approved
          ? "PREPARE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION"
          : "RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY"
      )
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary owner decision is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedPreparation) ||
    !Object.isFrozen(record.decisionBoundary)
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary owner decision must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
  input:
    CreateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecisionInput,
): SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision {
  const source =
    input.customerOnboardingAndDeliveryBoundaryPreparation;

  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryPreparation(
    source,
  );

  requireIdentifier(
    "Decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Decision owner ID",
    input.ownerId,
  );

  requireReason(input.reason);
  requireTimestamp(input.decidedAt);

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the onboarding-preparation-bound owner may issue this decision.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary decision cannot precede preparation.",
    );
  }

  if (
    input.decision !==
      "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES" &&
    input.decision !==
      "REJECT_AND_RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary decision is invalid.",
    );
  }

  const sourceBoundary =
    source.preparationBoundary;

  if (
    source.preparationState !==
      "REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION" ||
    sourceBoundary.sourceCommercialInfrastructureClosureVerified !==
      true ||
    sourceBoundary.commercialInfrastructureFoundationClosed !==
      true ||
    sourceBoundary.realCustomerOnboardingPreparationEligible !==
      true ||
    sourceBoundary.realCustomerOnboardingPreparationCreated !==
      true ||
    sourceBoundary.realCustomerOnboardingDecisionRecorded !==
      false ||
    sourceBoundary.realCustomerOnboardingAuthorized !==
      false ||
    sourceBoundary.realCustomerOnboardingExecuted !==
      false ||
    sourceBoundary.ownerApprovedDeliveryBoundaryPreparationEligible !==
      true ||
    sourceBoundary.ownerApprovedDeliveryBoundaryPreparationCreated !==
      true ||
    sourceBoundary.ownerApprovedDeliveryBoundaryDecisionRecorded !==
      false ||
    sourceBoundary.ownerApprovedDeliveryBoundaryRecorded !==
      false ||
    sourceBoundary.externalDeliveryExecutionAuthorized !==
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
      false ||
    Object.values(
      source.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    )
  ) {
    throw new Error(
      "Customer onboarding and delivery-boundary preparation is not eligible for an owner decision.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_REAL_CUSTOMER_ONBOARDING_AND_AUTHENTICATED_PORTAL_DELIVERY_BOUNDARIES";

  const core = {
    version:
      SALES_CORE_LAUNCH_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_DECISION_RECORDED" as const,

    department:
      "SALES" as const,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceClosureId:
      source.sourceClosureId,

    sourceClosureDigest:
      source.sourceClosureDigest,

    sourceReassessmentId:
      source.sourceReassessmentId,

    sourceReassessmentDigest:
      source.sourceReassessmentDigest,

    sourceRequalificationId:
      source.sourceRequalificationId,

    sourceRequalificationDigest:
      source.sourceRequalificationDigest,

    sourceContainmentDigest:
      source.sourceContainmentDigest,

    sourceRegistryDigest:
      source.sourceRegistryDigest,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    customerOrganizationId:
      source.customerOrganizationId,

    customerOrganizationName:
      source.customerOrganizationName,

    decision:
      input.decision,

    approved,

    reviewedPreparation: {
      preparationState:
        source.preparationState,

      onboardingMode:
        source.onboardingPreparation.onboardingMode,

      deliveryMode:
        source.deliveryBoundaryPreparation.deliveryMode,

      authenticatedCustomerIdentityRequired:
        source.onboardingPreparation.authenticatedCustomerIdentityRequired,

      explicitCustomerConsentRequired:
        source.onboardingPreparation.explicitCustomerConsentRequired,

      tenantScopedAccessRequired:
        source.deliveryBoundaryPreparation.tenantScopedAccessRequired,

      customerScopedAccessRequired:
        source.deliveryBoundaryPreparation.customerScopedAccessRequired,

      ownerReleaseRequired:
        source.deliveryBoundaryPreparation.ownerReleaseRequired,

      realCustomerContactDetailsStored:
        source.onboardingPreparation.realCustomerContactDetailsStored,

      customerAccountCreated:
        source.onboardingPreparation.customerAccountCreated,

      customerSessionIssued:
        source.onboardingPreparation.customerSessionIssued,

      customerOnboardingExecuted:
        source.onboardingPreparation.customerOnboardingExecuted,

      preparationNextStep:
        source.nextStep,
    },

    decisionBoundary: {
      sourcePreparationIntegrityVerified:
        true as const,

      sourceCommercialInfrastructureClosureVerified:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactCustomerOrganizationBound:
        true as const,

      ownerDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      realCustomerOnboardingBoundaryApproved:
        approved,

      ownerApprovedDeliveryBoundaryRecorded:
        approved,

      boundedOnboardingExecutionPreparationEligible:
        approved,

      boundedOnboardingExecutionAuthorized:
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

      realCustomerContactAuthorized:
        false as const,

      customerCommitmentAuthorized:
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

    reason:
      input.reason.trim(),

    nextStep:
      (
        approved
          ? "PREPARE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION"
          : "RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY"
      ) as
        | "PREPARE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION"
        | "RETAIN_REAL_CUSTOMER_ONBOARDING_AND_DELIVERY_BOUNDARY_PREPARATION_ONLY",

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...core,

      decisionDigest:
        sha256(core),
    }) as SalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision;

  validateSalesCoreLaunchCustomerOnboardingAndDeliveryBoundaryDecision(
    decision,
  );

  return decision;
}