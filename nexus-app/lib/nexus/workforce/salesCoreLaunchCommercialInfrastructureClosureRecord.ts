import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCorrectedReadinessReassessment,
  type SalesCoreLaunchCorrectedReadinessReassessment,
} from "./salesCoreLaunchCorrectedReadinessReassessment";

export const SALES_CORE_LAUNCH_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORD_VERSION =
  "sales-core-launch-commercial-infrastructure-closure-record-v1" as const;

export type SalesCoreLaunchCommercialInfrastructureClosureOutcome =
  | "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE"
  | "REJECT_AND_RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT";

export interface CreateSalesCoreLaunchCommercialInfrastructureClosureRecordInput {
  readonly closureId: string;

  readonly correctedReadinessReassessment:
    SalesCoreLaunchCorrectedReadinessReassessment;

  readonly ownerId: string;

  readonly outcome:
    SalesCoreLaunchCommercialInfrastructureClosureOutcome;

  readonly rationale: string;
  readonly closedAt: string;
}

export interface SalesCoreLaunchCommercialInfrastructureClosureRecord {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORD_VERSION;

  readonly closureId: string;

  readonly closureState:
    "OWNER_SALES_CORE_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORDED";

  readonly department:
    "SALES";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly sourceReassessmentId: string;
  readonly sourceReassessmentDigest: string;

  readonly sourceRequalificationId: string;
  readonly sourceRequalificationDigest: string;

  readonly sourceExecutionReviewId: string;
  readonly sourceExecutionReviewDigest: string;

  readonly sourceExecutionEvidenceLedgerId: string;
  readonly sourceExecutionEvidenceLedgerDigest: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;

  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly outcome:
    SalesCoreLaunchCommercialInfrastructureClosureOutcome;

  readonly approved:
    boolean;

  readonly infrastructureFoundation: Readonly<{
    authenticatedTenantOnboardingFoundationVerified:
      true;

    tenantIsolationFoundationVerified:
      true;

    tenantScopedCustomerWorkflowPersistenceVerified:
      true;

    ownerControlledCommandGatewayVerified:
      true;

    immutableAuditFoundationVerified:
      true;

    providerContinuityContainmentVerified:
      true;

    sandboxRecoveryFoundationVerified:
      true;

    emergencyPauseAndKillSwitchFoundationVerified:
      true;

    subscriptionEntitlementDataFoundationVerified:
      true;

    correctedCommercialEvidenceVerified:
      true;

    externalMessagingExecutionReady:
      false;

    paymentExecutionReady:
      false;

    invoiceExecutionReady:
      false;

    subscriptionActivationReady:
      false;

    entitlementMutationReady:
      false;

    publicLaunchInfrastructureReady:
      false;
  }>;

  readonly closureBoundary: Readonly<{
    sourceReassessmentIntegrityVerified:
      true;

    independentEvaluatorVerified:
      true;

    ownerActingAsEvaluatorBlocked:
      true;

    ownerCorrectedReadinessDecisionRequired:
      true;

    ownerCorrectedReadinessDecisionRecorded:
      true;

    correctedReadinessApproved:
      boolean;

    commercialInfrastructureFoundationClosureApproved:
      boolean;

    commercialInfrastructureFoundationClosed:
      boolean;

    commercialInfrastructureExecutionReady:
      false;

    realCustomerOnboardingPreparationEligible:
      boolean;

    realCustomerOnboardingExecutionAuthorized:
      false;

    ownerApprovedDeliveryBoundaryPreparationEligible:
      boolean;

    ownerApprovedDeliveryBoundaryRecorded:
      false;

    paidPilotEligible:
      false;

    paidPilotAuthorized:
      false;

    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;

    priorPilotCompletionRetainedAsHistoricalEvidenceOnly:
      true;

    priorReadinessApprovalRetainedAsHistoricalEvidenceOnly:
      true;

    priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly:
      true;

    priorActivationAuthorityRevived:
      false;
  }>;

  readonly authorityBoundary: Readonly<{
    approvalBypassAllowed:
      false;

    runtimeActivationPreparationEligible:
      false;

    runtimeActivationAuthorized:
      false;

    runtimeActivationExecuted:
      false;

    runtimeActivated:
      false;

    controlledWorkAuthorized:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
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

    productionAuthorityGranted:
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
    | "PREPARE_REAL_CUSTOMER_ONBOARDING_AND_OWNER_APPROVED_DELIVERY_BOUNDARIES"
    | "RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT";

  readonly closedAt: string;
  readonly closureDigest: string;
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
      "Unsupported deterministic commercial infrastructure closure value.",
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
      "Commercial infrastructure closure time is invalid.",
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
      "Commercial infrastructure closure rationale must be safe, explicit, and non-secret.",
    );
  }
}

function verifyClosureDigest(
  record: DigestRecord,
): void {
  const digest =
    record.closureDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Commercial infrastructure closure digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.closureDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Commercial infrastructure closure integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCommercialInfrastructureClosureRecord(
  record:
    SalesCoreLaunchCommercialInfrastructureClosureRecord,
): void {
  verifyClosureDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Closure ID", record.closureId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Evaluator ID", record.evaluatorId],
      ["Source reassessment ID", record.sourceReassessmentId],
      ["Source requalification ID", record.sourceRequalificationId],
      ["Source execution review ID", record.sourceExecutionReviewId],
      ["Source execution evidence ledger ID", record.sourceExecutionEvidenceLedgerId],
      ["Source remediation ID", record.sourceRemediationId],
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
      ["Source reassessment digest", record.sourceReassessmentDigest],
      ["Source requalification digest", record.sourceRequalificationDigest],
      ["Source execution review digest", record.sourceExecutionReviewDigest],
      ["Source execution evidence ledger digest", record.sourceExecutionEvidenceLedgerDigest],
      ["Source remediation digest", record.sourceRemediationDigest],
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
  requireTimestamp(record.closedAt);

  const approved =
    record.outcome ===
      "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE";

  const foundation =
    record.infrastructureFoundation;

  const boundary =
    record.closureBoundary;

  const expectedNextStep =
    approved
      ? "PREPARE_REAL_CUSTOMER_ONBOARDING_AND_OWNER_APPROVED_DELIVERY_BOUNDARIES"
      : "RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT";

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORD_VERSION ||
    record.closureState !==
      "OWNER_SALES_CORE_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORDED" ||
    record.department !==
      "SALES" ||
    record.evaluatorId ===
      record.ownerId ||
    record.approved !==
      approved ||
    foundation.authenticatedTenantOnboardingFoundationVerified !==
      true ||
    foundation.tenantIsolationFoundationVerified !==
      true ||
    foundation.tenantScopedCustomerWorkflowPersistenceVerified !==
      true ||
    foundation.ownerControlledCommandGatewayVerified !==
      true ||
    foundation.immutableAuditFoundationVerified !==
      true ||
    foundation.providerContinuityContainmentVerified !==
      true ||
    foundation.sandboxRecoveryFoundationVerified !==
      true ||
    foundation.emergencyPauseAndKillSwitchFoundationVerified !==
      true ||
    foundation.subscriptionEntitlementDataFoundationVerified !==
      true ||
    foundation.correctedCommercialEvidenceVerified !==
      true ||
    foundation.externalMessagingExecutionReady !==
      false ||
    foundation.paymentExecutionReady !==
      false ||
    foundation.invoiceExecutionReady !==
      false ||
    foundation.subscriptionActivationReady !==
      false ||
    foundation.entitlementMutationReady !==
      false ||
    foundation.publicLaunchInfrastructureReady !==
      false ||
    boundary.sourceReassessmentIntegrityVerified !==
      true ||
    boundary.independentEvaluatorVerified !==
      true ||
    boundary.ownerActingAsEvaluatorBlocked !==
      true ||
    boundary.ownerCorrectedReadinessDecisionRequired !==
      true ||
    boundary.ownerCorrectedReadinessDecisionRecorded !==
      true ||
    boundary.correctedReadinessApproved !==
      approved ||
    boundary.commercialInfrastructureFoundationClosureApproved !==
      approved ||
    boundary.commercialInfrastructureFoundationClosed !==
      approved ||
    boundary.commercialInfrastructureExecutionReady !==
      false ||
    boundary.realCustomerOnboardingPreparationEligible !==
      approved ||
    boundary.realCustomerOnboardingExecutionAuthorized !==
      false ||
    boundary.ownerApprovedDeliveryBoundaryPreparationEligible !==
      approved ||
    boundary.ownerApprovedDeliveryBoundaryRecorded !==
      false ||
    boundary.paidPilotEligible !==
      false ||
    boundary.paidPilotAuthorized !==
      false ||
    boundary.historicalRecordsMutated !==
      false ||
    boundary.historicalSourceDigestsPreserved !==
      true ||
    boundary.priorPilotCompletionRetainedAsHistoricalEvidenceOnly !==
      true ||
    boundary.priorReadinessApprovalRetainedAsHistoricalEvidenceOnly !==
      true ||
    boundary.priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly !==
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
      expectedNextStep
  ) {
    throw new Error(
      "Commercial infrastructure closure record state is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.infrastructureFoundation,
    ) ||
    !Object.isFrozen(
      record.closureBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Commercial infrastructure closure record must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialInfrastructureClosureRecord(
  input:
    CreateSalesCoreLaunchCommercialInfrastructureClosureRecordInput,
): SalesCoreLaunchCommercialInfrastructureClosureRecord {
  const reassessment =
    input.correctedReadinessReassessment;

  validateSalesCoreLaunchCorrectedReadinessReassessment(
    reassessment,
  );

  requireIdentifier(
    "Closure ID",
    input.closureId,
  );

  requireIdentifier(
    "Closure owner ID",
    input.ownerId,
  );

  requireRationale(input.rationale);
  requireTimestamp(input.closedAt);

  if (
    input.ownerId !==
      reassessment.ownerId
  ) {
    throw new Error(
      "Only the reassessment-bound owner may record commercial infrastructure closure.",
    );
  }

  if (
    Date.parse(input.closedAt) <
      Date.parse(reassessment.assessedAt)
  ) {
    throw new Error(
      "Commercial infrastructure closure cannot precede corrected readiness reassessment.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE" &&
    input.outcome !==
      "REJECT_AND_RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT"
  ) {
    throw new Error(
      "Commercial infrastructure closure outcome is invalid.",
    );
  }

  const sourceBoundary =
    reassessment.reassessmentBoundary;

  if (
    reassessment.reassessmentState !==
      "CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT_CREATED" ||
    reassessment.nextStep !==
      "AWAIT_OWNER_CORRECTED_SALES_CORE_LAUNCH_READINESS_DECISION" ||
    reassessment.evaluatorId ===
      reassessment.ownerId ||
    sourceBoundary.sourceRequalificationIntegrityVerified !==
      true ||
    sourceBoundary.salesCoreLaunchCommercialEvidenceRequalified !==
      true ||
    sourceBoundary.containmentRemediationRequirementSatisfied !==
      true ||
    sourceBoundary.independentEvaluatorVerified !==
      true ||
    sourceBoundary.ownerActingAsEvaluatorBlocked !==
      true ||
    sourceBoundary.correctedReadinessReassessmentCreated !==
      true ||
    sourceBoundary.correctedReadinessDecisionRecorded !==
      false ||
    sourceBoundary.correctedReadinessApproved !==
      false ||
    sourceBoundary.ownerReviewRequired !==
      true ||
    sourceBoundary.ownerReviewRecorded !==
      false ||
    sourceBoundary.historicalRecordsMutated !==
      false ||
    sourceBoundary.historicalSourceDigestsPreserved !==
      true ||
    sourceBoundary.priorPilotCompletionRetainedAsHistoricalEvidenceOnly !==
      true ||
    sourceBoundary.priorReadinessApprovalRetainedAsHistoricalEvidenceOnly !==
      true ||
    sourceBoundary.priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly !==
      true ||
    sourceBoundary.priorActivationAuthorityRevived !==
      false ||
    sourceBoundary.activationPlanningEligible !==
      false ||
    sourceBoundary.commercialInfrastructureClosureEligible !==
      false
  ) {
    throw new Error(
      "Corrected readiness reassessment is not eligible for owner commercial infrastructure closure.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_CONTROLLED_COMMERCIAL_INFRASTRUCTURE_FOUNDATION_CLOSURE";

  const core = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORD_VERSION,

    closureId:
      input.closureId,

    closureState:
      "OWNER_SALES_CORE_COMMERCIAL_INFRASTRUCTURE_CLOSURE_RECORDED" as const,

    department:
      "SALES" as const,

    tenantId:
      reassessment.tenantId,

    ownerId:
      reassessment.ownerId,

    evaluatorId:
      reassessment.evaluatorId,

    sourceReassessmentId:
      reassessment.reassessmentId,

    sourceReassessmentDigest:
      reassessment.reassessmentDigest,

    sourceRequalificationId:
      reassessment.sourceRequalificationId,

    sourceRequalificationDigest:
      reassessment.sourceRequalificationDigest,

    sourceExecutionReviewId:
      reassessment.sourceExecutionReviewId,

    sourceExecutionReviewDigest:
      reassessment.sourceExecutionReviewDigest,

    sourceExecutionEvidenceLedgerId:
      reassessment.sourceExecutionEvidenceLedgerId,

    sourceExecutionEvidenceLedgerDigest:
      reassessment.sourceExecutionEvidenceLedgerDigest,

    sourceRemediationId:
      reassessment.sourceRemediationId,

    sourceRemediationDigest:
      reassessment.sourceRemediationDigest,

    sourceContainmentDigest:
      reassessment.sourceContainmentDigest,

    sourceRegistryDigest:
      reassessment.sourceRegistryDigest,

    outcome:
      input.outcome,

    approved,

    infrastructureFoundation: {
      authenticatedTenantOnboardingFoundationVerified:
        true as const,

      tenantIsolationFoundationVerified:
        true as const,

      tenantScopedCustomerWorkflowPersistenceVerified:
        true as const,

      ownerControlledCommandGatewayVerified:
        true as const,

      immutableAuditFoundationVerified:
        true as const,

      providerContinuityContainmentVerified:
        true as const,

      sandboxRecoveryFoundationVerified:
        true as const,

      emergencyPauseAndKillSwitchFoundationVerified:
        true as const,

      subscriptionEntitlementDataFoundationVerified:
        true as const,

      correctedCommercialEvidenceVerified:
        true as const,

      externalMessagingExecutionReady:
        false as const,

      paymentExecutionReady:
        false as const,

      invoiceExecutionReady:
        false as const,

      subscriptionActivationReady:
        false as const,

      entitlementMutationReady:
        false as const,

      publicLaunchInfrastructureReady:
        false as const,
    },

    closureBoundary: {
      sourceReassessmentIntegrityVerified:
        true as const,

      independentEvaluatorVerified:
        true as const,

      ownerActingAsEvaluatorBlocked:
        true as const,

      ownerCorrectedReadinessDecisionRequired:
        true as const,

      ownerCorrectedReadinessDecisionRecorded:
        true as const,

      correctedReadinessApproved:
        approved,

      commercialInfrastructureFoundationClosureApproved:
        approved,

      commercialInfrastructureFoundationClosed:
        approved,

      commercialInfrastructureExecutionReady:
        false as const,

      realCustomerOnboardingPreparationEligible:
        approved,

      realCustomerOnboardingExecutionAuthorized:
        false as const,

      ownerApprovedDeliveryBoundaryPreparationEligible:
        approved,

      ownerApprovedDeliveryBoundaryRecorded:
        false as const,

      paidPilotEligible:
        false as const,

      paidPilotAuthorized:
        false as const,

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,

      priorPilotCompletionRetainedAsHistoricalEvidenceOnly:
        true as const,

      priorReadinessApprovalRetainedAsHistoricalEvidenceOnly:
        true as const,

      priorActivationPlanApprovalRetainedAsHistoricalEvidenceOnly:
        true as const,

      priorActivationAuthorityRevived:
        false as const,
    },

    authorityBoundary: {
      approvalBypassAllowed:
        false as const,

      runtimeActivationPreparationEligible:
        false as const,

      runtimeActivationAuthorized:
        false as const,

      runtimeActivationExecuted:
        false as const,

      runtimeActivated:
        false as const,

      controlledWorkAuthorized:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
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

      productionAuthorityGranted:
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
          ? "PREPARE_REAL_CUSTOMER_ONBOARDING_AND_OWNER_APPROVED_DELIVERY_BOUNDARIES"
          : "RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT"
      ) as
        | "PREPARE_REAL_CUSTOMER_ONBOARDING_AND_OWNER_APPROVED_DELIVERY_BOUNDARIES"
        | "RETURN_TO_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT",

    closedAt:
      input.closedAt,
  };

  const record =
    deepFreeze({
      ...core,

      closureDigest:
        sha256(core),
    }) as SalesCoreLaunchCommercialInfrastructureClosureRecord;

  validateSalesCoreLaunchCommercialInfrastructureClosureRecord(
    record,
  );

  return record;
}
