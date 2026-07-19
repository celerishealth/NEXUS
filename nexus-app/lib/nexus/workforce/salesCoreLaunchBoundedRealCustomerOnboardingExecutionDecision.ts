import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
  type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation,
} from "./salesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation";

export const SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_VERSION =
  "sales-core-launch-bounded-real-customer-onboarding-execution-decision-v1" as const;

export type SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionType =
  | "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION"
  | "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY";

export interface CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionInput {
  readonly decisionId: string;

  readonly boundedRealCustomerOnboardingExecutionPreparation:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation;

  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionType;

  readonly reason: string;
  readonly decidedAt: string;
}

export interface SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_RECORDED";

  readonly department:
    "SALES";

  readonly preparationId: string;
  readonly preparationDigest: string;

  readonly sourceBoundaryDecisionId: string;
  readonly sourceBoundaryDecisionDigest: string;

  readonly sourceBoundaryPreparationId: string;
  readonly sourceBoundaryPreparationDigest: string;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly customerOrganizationId: string;
  readonly customerOrganizationName: string;

  readonly decision:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionType;

  readonly approvedForBoundedOnboardingExecution:
    boolean;

  readonly reviewedPreparation: Readonly<{
    preparationState:
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED";

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

    preparationNextStep:
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION";
  }>;

  readonly authorityBoundary: Readonly<{
    sourcePreparationIntegrityVerified:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    exactCustomerOrganizationBound:
      true;

    ownerExecutionDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    boundedExecutionPreparationEligible:
      true;

    boundedExecutionPreparationCreated:
      true;

    boundedOnboardingExecutionAuthorized:
      boolean;

    boundedOnboardingExecutionPerformed:
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

  readonly reason: string;

  readonly nextStep:
    | "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING"
    | "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY";

  readonly decidedAt: string;
  readonly decisionDigest: string;
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
      "Unsupported deterministic bounded-onboarding execution-decision value.",
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
      "Bounded onboarding execution decision time is invalid.",
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
      "Bounded onboarding execution decision reason must be safe, explicit, and non-secret.",
    );
  }
}

function verifyDigest(
  record: DigestRecord,
): void {
  const digest =
    record.decisionDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Bounded onboarding execution decision digest is invalid.",
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
      "Bounded onboarding execution decision integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
  record:
    SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision,
): void {
  verifyDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      [
        "Bounded onboarding execution decision ID",
        record.decisionId,
      ],
      [
        "Bounded onboarding execution preparation ID",
        record.preparationId,
      ],
      [
        "Source onboarding boundary decision ID",
        record.sourceBoundaryDecisionId,
      ],
      [
        "Source onboarding boundary preparation ID",
        record.sourceBoundaryPreparationId,
      ],
      [
        "Tenant ID",
        record.tenantId,
      ],
      [
        "Owner ID",
        record.ownerId,
      ],
      [
        "Customer organization ID",
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
        "Bounded onboarding execution preparation digest",
        record.preparationDigest,
      ],
      [
        "Source onboarding boundary decision digest",
        record.sourceBoundaryDecisionDigest,
      ],
      [
        "Source onboarding boundary preparation digest",
        record.sourceBoundaryPreparationDigest,
      ],
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
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION";

  const reviewed =
    record.reviewedPreparation;

  const boundary =
    record.authorityBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_RECORDED" ||
    record.department !==
      "SALES" ||
    (
      record.decision !==
        "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" &&
      record.decision !==
        "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY"
    ) ||
    record.approvedForBoundedOnboardingExecution !==
      approved ||
    reviewed.preparationState !==
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED" ||
    reviewed.planClass !==
      "SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" ||
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
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION" ||
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
      approved ||
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
      false ||
    record.nextStep !==
      (
        approved
          ? "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING"
          : "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY"
      )
  ) {
    throw new Error(
      "Sales core launch bounded real-customer onboarding execution decision is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.reviewedPreparation,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Sales core launch bounded real-customer onboarding execution decision must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
  input:
    CreateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecisionInput,
): SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision {
  const source =
    input.boundedRealCustomerOnboardingExecutionPreparation;

  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionPreparation(
    source,
  );

  requireIdentifier(
    "Bounded onboarding execution decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Bounded onboarding execution decision owner ID",
    input.ownerId,
  );

  requireReason(input.reason);
  requireTimestamp(input.decidedAt);

  if (
    input.ownerId !==
      source.ownerId
  ) {
    throw new Error(
      "Only the bounded-onboarding-preparation-bound owner may issue this execution decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION" &&
    input.decision !==
      "REJECT_AND_RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Bounded onboarding execution decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Bounded onboarding execution decision cannot precede preparation.",
    );
  }

  const sourceBoundary =
    source.preparationBoundary;

  if (
    source.preparationState !==
      "BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION" ||
    sourceBoundary.sourceDecisionIntegrityVerified !==
      true ||
    sourceBoundary.sourceApprovedBoundaryVerified !==
      true ||
    sourceBoundary.exactTenantBound !==
      true ||
    sourceBoundary.exactOwnerBound !==
      true ||
    sourceBoundary.exactCustomerOrganizationBound !==
      true ||
    sourceBoundary.boundedExecutionPreparationEligible !==
      true ||
    sourceBoundary.boundedExecutionPreparationCreated !==
      true ||
    sourceBoundary.ownerExecutionDecisionRequired !==
      true ||
    sourceBoundary.ownerExecutionDecisionRecorded !==
      false ||
    sourceBoundary.boundedOnboardingExecutionAuthorized !==
      false ||
    sourceBoundary.realCustomerOnboardingExecuted !==
      false ||
    sourceBoundary.authenticatedPortalReleaseExecutionAuthorized !==
      false ||
    sourceBoundary.authenticatedPortalReleaseExecuted !==
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
      "Bounded onboarding execution preparation is not eligible for an owner execution decision.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION";

  const plan =
    source.executionPlan;

  const core = {
    version:
      SALES_CORE_LAUNCH_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_DECISION_RECORDED" as const,

    department:
      "SALES" as const,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceBoundaryDecisionId:
      source.sourceDecisionId,

    sourceBoundaryDecisionDigest:
      source.sourceDecisionDigest,

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

    decision:
      input.decision,

    approvedForBoundedOnboardingExecution:
      approved,

    reviewedPreparation: {
      preparationState:
        source.preparationState,

      planClass:
        plan.planClass,

      customerOrganizationCount:
        plan.customerOrganizationCount,

      onboardingMode:
        plan.onboardingMode,

      deliveryMode:
        plan.deliveryMode,

      ownerSupervisionRequired:
        plan.ownerSupervisionRequired,

      authenticatedCustomerIdentityRequired:
        plan.authenticatedCustomerIdentityRequired,

      explicitCustomerConsentRequired:
        plan.explicitCustomerConsentRequired,

      tenantScopedAccessRequired:
        plan.tenantScopedAccessRequired,

      customerScopedAccessRequired:
        plan.customerScopedAccessRequired,

      minimumNecessaryDataRequired:
        plan.minimumNecessaryDataRequired,

      retentionAndRedactionRequired:
        plan.retentionAndRedactionRequired,

      idempotentExecutionRequired:
        plan.idempotentExecutionRequired,

      atomicExecutionRequired:
        plan.atomicExecutionRequired,

      rollbackRequired:
        plan.rollbackRequired,

      auditEvidenceRequired:
        plan.auditEvidenceRequired,

      realCustomerContactDetailsStored:
        plan.realCustomerContactDetailsStored,

      customerAccountCreated:
        plan.customerAccountCreated,

      customerSessionIssued:
        plan.customerSessionIssued,

      realCustomerOnboardingExecuted:
        plan.realCustomerOnboardingExecuted,

      authenticatedPortalReleaseExecuted:
        plan.authenticatedPortalReleaseExecuted,

      preparationNextStep:
        source.nextStep,
    },

    authorityBoundary: {
      sourcePreparationIntegrityVerified:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      exactCustomerOrganizationBound:
        true as const,

      ownerExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      boundedExecutionPreparationEligible:
        true as const,

      boundedExecutionPreparationCreated:
        true as const,

      boundedOnboardingExecutionAuthorized:
        approved,

      boundedOnboardingExecutionPerformed:
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

    reason:
      input.reason.trim(),

    nextStep:
      (
        approved
          ? "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING"
          : "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY"
      ) as
        | "EXECUTE_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING"
        | "RETAIN_SPECIFIC_BOUNDED_REAL_CUSTOMER_ONBOARDING_EXECUTION_PREPARATION_ONLY",

    decidedAt:
      input.decidedAt,
  };

  const decision =
    deepFreeze({
      ...core,

      decisionDigest:
        sha256(core),
    }) as
      SalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision;

  validateSalesCoreLaunchBoundedRealCustomerOnboardingExecutionDecision(
    decision,
  );

  return decision;
}
