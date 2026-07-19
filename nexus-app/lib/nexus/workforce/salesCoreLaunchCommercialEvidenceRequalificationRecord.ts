import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision,
} from "./salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFICATION_RECORD_VERSION =
  "sales-core-launch-commercial-evidence-requalification-record-v1" as const;

export interface CreateSalesCoreLaunchCommercialEvidenceRequalificationRecordInput {
  readonly requalificationId: string;

  readonly executionReviewDecision:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision;

  readonly ownerId: string;
  readonly reason: string;
  readonly requalifiedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceRequalificationRecord {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFICATION_RECORD_VERSION;

  readonly requalificationId: string;

  readonly requalificationState:
    "SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFIED";

  readonly department:
    "SALES";

  readonly affectedEmployeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly affectedEmployeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly sourceExecutionReviewId: string;
  readonly sourceExecutionReviewDigest: string;

  readonly sourceExecutionEvidenceLedgerId: string;
  readonly sourceExecutionEvidenceLedgerDigest: string;

  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest: string;

  readonly sourceExecutionDecisionId: string;
  readonly sourceExecutionDecisionDigest: string;

  readonly sourceRemediationReviewDecisionId: string;
  readonly sourceRemediationReviewDecisionDigest: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;

  readonly sourceCompositeEvidenceDigest: string;
  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly verifiedEvidence: Readonly<{
    qualificationCasesExecuted:
      12;

    qualificationCasesPassed:
      12;

    qualificationCasesFailed:
      0;

    qualificationEvidenceCollected:
      12;

    assertionsExecuted:
      48;

    assertionsPassed:
      48;

    assertionsFailed:
      0;

    uniqueCaseIds:
      12;

    uniqueEvidenceIds:
      12;

    uniqueEvidenceDigests:
      12;

    uniqueBindingDigests:
      12;

    syntheticCommercialDraftAllowedCases:
      8;

    ownerEscalationCases:
      4;
  }>;

  readonly requalificationBoundary: Readonly<{
    sourceExecutionReviewIntegrityVerified:
      true;

    ownerExecutionReviewApprovalVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    independentEvaluatorVerified:
      true;

    ownerActingAsEvaluatorBlocked:
      true;

    assertionDerivedEvidenceVerified:
      true;

    hardCodedPassingEvidenceAccepted:
      false;

    meeraCommercialEvidenceRequalified:
      true;

    salesCoreLaunchCommercialEvidenceRequalified:
      true;

    salesCoreLaunchRequalificationCompleted:
      true;

    containmentRemediationRequirementSatisfied:
      true;

    containmentRecordPreserved:
      true;

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

    correctedReadinessReassessmentEligible:
      true;

    correctedReadinessReassessmentCreated:
      false;

    correctedReadinessDecisionRecorded:
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

    autonomousExecutionAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly reason: string;

  readonly nextStep:
    "CREATE_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT";

  readonly requalifiedAt: string;
  readonly requalificationDigest: string;
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
      "Unsupported deterministic Sales-core commercial requalification value.",
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
      "Sales-core commercial evidence requalification time is invalid.",
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
      "Sales-core commercial evidence requalification reason must be safe, explicit, and non-secret.",
    );
  }
}

function verifyRecordDigest(
  record: DigestRecord,
): void {
  const digest =
    record.requalificationDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Sales-core commercial evidence requalification digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.requalificationDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Sales-core commercial evidence requalification integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCommercialEvidenceRequalificationRecord(
  record:
    SalesCoreLaunchCommercialEvidenceRequalificationRecord,
): void {
  verifyRecordDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Requalification ID", record.requalificationId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Evaluator ID", record.evaluatorId],
      ["Source execution review ID", record.sourceExecutionReviewId],
      ["Source execution evidence ledger ID", record.sourceExecutionEvidenceLedgerId],
      ["Source preparation ID", record.sourcePreparationId],
      ["Source execution decision ID", record.sourceExecutionDecisionId],
      ["Source remediation review decision ID", record.sourceRemediationReviewDecisionId],
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
      ["Source execution review digest", record.sourceExecutionReviewDigest],
      ["Source execution evidence ledger digest", record.sourceExecutionEvidenceLedgerDigest],
      ["Source preparation digest", record.sourcePreparationDigest],
      ["Source execution decision digest", record.sourceExecutionDecisionDigest],
      ["Source remediation review decision digest", record.sourceRemediationReviewDecisionDigest],
      ["Source remediation digest", record.sourceRemediationDigest],
      ["Source composite evidence digest", record.sourceCompositeEvidenceDigest],
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
  requireTimestamp(record.requalifiedAt);

  const evidence =
    record.verifiedEvidence;

  const boundary =
    record.requalificationBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFICATION_RECORD_VERSION ||
    record.requalificationState !==
      "SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFIED" ||
    record.department !==
      "SALES" ||
    record.affectedEmployeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.affectedEmployeeCode !==
      "nx-sales-005" ||
    record.evaluatorId ===
      record.ownerId ||
    evidence.qualificationCasesExecuted !==
      12 ||
    evidence.qualificationCasesPassed !==
      12 ||
    evidence.qualificationCasesFailed !==
      0 ||
    evidence.qualificationEvidenceCollected !==
      12 ||
    evidence.assertionsExecuted !==
      48 ||
    evidence.assertionsPassed !==
      48 ||
    evidence.assertionsFailed !==
      0 ||
    evidence.uniqueCaseIds !==
      12 ||
    evidence.uniqueEvidenceIds !==
      12 ||
    evidence.uniqueEvidenceDigests !==
      12 ||
    evidence.uniqueBindingDigests !==
      12 ||
    evidence.syntheticCommercialDraftAllowedCases !==
      8 ||
    evidence.ownerEscalationCases !==
      4 ||
    boundary.sourceExecutionReviewIntegrityVerified !==
      true ||
    boundary.ownerExecutionReviewApprovalVerified !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.independentEvaluatorVerified !==
      true ||
    boundary.ownerActingAsEvaluatorBlocked !==
      true ||
    boundary.assertionDerivedEvidenceVerified !==
      true ||
    boundary.hardCodedPassingEvidenceAccepted !==
      false ||
    boundary.meeraCommercialEvidenceRequalified !==
      true ||
    boundary.salesCoreLaunchCommercialEvidenceRequalified !==
      true ||
    boundary.salesCoreLaunchRequalificationCompleted !==
      true ||
    boundary.containmentRemediationRequirementSatisfied !==
      true ||
    boundary.containmentRecordPreserved !==
      true ||
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
    boundary.correctedReadinessReassessmentEligible !==
      true ||
    boundary.correctedReadinessReassessmentCreated !==
      false ||
    boundary.correctedReadinessDecisionRecorded !==
      false ||
    Object.values(
      record.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    ) ||
    record.nextStep !==
      "CREATE_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT"
  ) {
    throw new Error(
      "Sales-core commercial evidence requalification record state is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.verifiedEvidence,
    ) ||
    !Object.isFrozen(
      record.requalificationBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Sales-core commercial evidence requalification record must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialEvidenceRequalificationRecord(
  input:
    CreateSalesCoreLaunchCommercialEvidenceRequalificationRecordInput,
): SalesCoreLaunchCommercialEvidenceRequalificationRecord {
  const review =
    input.executionReviewDecision;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
    review,
  );

  requireIdentifier(
    "Requalification ID",
    input.requalificationId,
  );

  requireIdentifier(
    "Requalification owner ID",
    input.ownerId,
  );

  requireReason(input.reason);
  requireTimestamp(input.requalifiedAt);

  if (
    input.ownerId !==
      review.ownerId
  ) {
    throw new Error(
      "Only the execution-review-bound owner may requalify Sales-core commercial evidence.",
    );
  }

  if (
    Date.parse(input.requalifiedAt) <
      Date.parse(review.reviewedAt)
  ) {
    throw new Error(
      "Sales-core commercial evidence requalification cannot precede owner execution review.",
    );
  }

  if (
    review.reviewState !==
      "OWNER_MEERA_COMMERCIAL_REQUALIFICATION_EXECUTION_REVIEW_RECORDED" ||
    review.outcome !==
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION" ||
    review.approved !==
      true ||
    review.nextStep !==
      "REQUALIFY_SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE" ||
    review.evaluatorId ===
      review.ownerId ||
    review.reviewBoundary
      .sourceExecutionEvidenceIntegrityVerified !==
        true ||
    review.reviewBoundary
      .independentEvaluatorVerified !==
        true ||
    review.reviewBoundary
      .assertionDerivedEvidenceVerified !==
        true ||
    review.reviewBoundary
      .hardCodedPassingEvidenceAccepted !==
        false ||
    review.reviewBoundary
      .ownerPostExecutionReviewRecorded !==
        true ||
    review.reviewBoundary
      .executionEvidenceAccepted !==
        true ||
    review.reviewBoundary
      .meeraCommercialEvidenceRequalified !==
        true ||
    review.reviewBoundary
      .salesCoreLaunchRequalificationEligible !==
        true ||
    review.reviewBoundary
      .salesCoreLaunchRequalified !==
        false ||
    review.reviewBoundary
      .historicalRecordsMutated !==
        false ||
    review.reviewBoundary
      .historicalSourceDigestsPreserved !==
        true
  ) {
    throw new Error(
      "Sales-core commercial evidence requalification requires an approved owner execution review.",
    );
  }

  const sourceEvidence =
    review.evidenceSummary;

  const core = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFICATION_RECORD_VERSION,

    requalificationId:
      input.requalificationId,

    requalificationState:
      "SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFIED" as const,

    department:
      "SALES" as const,

    affectedEmployeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    affectedEmployeeCode:
      "nx-sales-005" as const,

    tenantId:
      review.tenantId,

    ownerId:
      review.ownerId,

    evaluatorId:
      review.evaluatorId,

    sourceExecutionReviewId:
      review.reviewId,

    sourceExecutionReviewDigest:
      review.reviewDigest,

    sourceExecutionEvidenceLedgerId:
      review.sourceLedgerId,

    sourceExecutionEvidenceLedgerDigest:
      review.sourceLedgerDigest,

    sourcePreparationId:
      review.sourcePreparationId,

    sourcePreparationDigest:
      review.sourcePreparationDigest,

    sourceExecutionDecisionId:
      review.sourceExecutionDecisionId,

    sourceExecutionDecisionDigest:
      review.sourceExecutionDecisionDigest,

    sourceRemediationReviewDecisionId:
      review.sourceReviewDecisionId,

    sourceRemediationReviewDecisionDigest:
      review.sourceReviewDecisionDigest,

    sourceRemediationId:
      review.sourceRemediationId,

    sourceRemediationDigest:
      review.sourceRemediationDigest,

    sourceCompositeEvidenceDigest:
      review.sourceCompositeEvidenceDigest,

    sourceContainmentDigest:
      review.sourceContainmentDigest,

    sourceRegistryDigest:
      review.sourceRegistryDigest,

    verifiedEvidence: {
      qualificationCasesExecuted:
        sourceEvidence.qualificationCasesExecuted,

      qualificationCasesPassed:
        sourceEvidence.qualificationCasesPassed,

      qualificationCasesFailed:
        sourceEvidence.qualificationCasesFailed,

      qualificationEvidenceCollected:
        sourceEvidence.qualificationEvidenceCollected,

      assertionsExecuted:
        sourceEvidence.assertionsExecuted,

      assertionsPassed:
        sourceEvidence.assertionsPassed,

      assertionsFailed:
        sourceEvidence.assertionsFailed,

      uniqueCaseIds:
        sourceEvidence.uniqueCaseIds,

      uniqueEvidenceIds:
        sourceEvidence.uniqueEvidenceIds,

      uniqueEvidenceDigests:
        sourceEvidence.uniqueEvidenceDigests,

      uniqueBindingDigests:
        sourceEvidence.uniqueBindingDigests,

      syntheticCommercialDraftAllowedCases:
        sourceEvidence.syntheticCommercialDraftAllowedCases,

      ownerEscalationCases:
        sourceEvidence.ownerEscalationCases,
    },

    requalificationBoundary: {
      sourceExecutionReviewIntegrityVerified:
        true as const,

      ownerExecutionReviewApprovalVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      independentEvaluatorVerified:
        true as const,

      ownerActingAsEvaluatorBlocked:
        true as const,

      assertionDerivedEvidenceVerified:
        true as const,

      hardCodedPassingEvidenceAccepted:
        false as const,

      meeraCommercialEvidenceRequalified:
        true as const,

      salesCoreLaunchCommercialEvidenceRequalified:
        true as const,

      salesCoreLaunchRequalificationCompleted:
        true as const,

      containmentRemediationRequirementSatisfied:
        true as const,

      containmentRecordPreserved:
        true as const,

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

      correctedReadinessReassessmentEligible:
        true as const,

      correctedReadinessReassessmentCreated:
        false as const,

      correctedReadinessDecisionRecorded:
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

      autonomousExecutionAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    reason:
      input.reason.trim(),

    nextStep:
      "CREATE_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT" as const,

    requalifiedAt:
      input.requalifiedAt,
  };

  const record =
    deepFreeze({
      ...core,

      requalificationDigest:
        sha256(core),
    }) as SalesCoreLaunchCommercialEvidenceRequalificationRecord;

  validateSalesCoreLaunchCommercialEvidenceRequalificationRecord(
    record,
  );

  return record;
}
