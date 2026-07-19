import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
} from "./salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW_DECISION_VERSION =
  "sales-core-launch-commercial-evidence-controlled-requalification-execution-review-decision-v1" as const;

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW_OUTCOMES =
  [
    "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",
    "REJECT_AND_RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",
  ] as const;

export type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewOutcome =
  (
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW_OUTCOMES
  )[number];

export interface CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecisionInput {
  readonly reviewId: string;

  readonly executionEvidence:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence;

  readonly ownerId: string;

  readonly outcome:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewOutcome;

  readonly rationale: string;
  readonly reviewedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW_DECISION_VERSION;

  readonly reviewId: string;

  readonly reviewState:
    "OWNER_MEERA_COMMERCIAL_REQUALIFICATION_EXECUTION_REVIEW_RECORDED";

  readonly department:
    "SALES";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly sourceLedgerId: string;
  readonly sourceLedgerDigest: string;

  readonly sourcePreparationId: string;
  readonly sourcePreparationDigest: string;

  readonly sourceExecutionDecisionId: string;
  readonly sourceExecutionDecisionDigest: string;

  readonly sourceReviewDecisionId: string;
  readonly sourceReviewDecisionDigest: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;

  readonly sourceCompositeEvidenceDigest: string;
  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly outcome:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewOutcome;

  readonly approved:
    boolean;

  readonly evidenceSummary: Readonly<{
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

  readonly reviewBoundary: Readonly<{
    sourceExecutionEvidenceIntegrityVerified:
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

    controlledRequalificationExecutionAuthorized:
      true;

    controlledRequalificationExecutionPerformed:
      true;

    assertionDerivedEvidenceVerified:
      true;

    hardCodedPassingEvidenceAccepted:
      false;

    ownerReviewRequiredAfterExecution:
      true;

    ownerPostExecutionReviewRecorded:
      true;

    executionEvidenceAccepted:
      boolean;

    meeraCommercialEvidenceRequalified:
      boolean;

    salesCoreLaunchRequalificationEligible:
      boolean;

    salesCoreLaunchRequalified:
      false;

    salesCoreLaunchReadinessAssessmentCreated:
      false;

    approvalBypassAllowed:
      false;

    historicalRecordsMutated:
      false;

    historicalSourceDigestsPreserved:
      true;
  }>;

  readonly authorityBoundary: Readonly<{
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

  readonly rationale: string;

  readonly nextStep:
    | "REQUALIFY_SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE"
    | "RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION";

  readonly reviewedAt: string;
  readonly reviewDigest: string;
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
      "Unsupported deterministic commercial requalification review value.",
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
      "Commercial requalification execution review time is invalid.",
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
      "Commercial requalification execution review rationale must be safe, explicit, and non-secret.",
    );
  }
}

function verifyReviewDigest(
  record: DigestRecord,
): void {
  const digest =
    record.reviewDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Commercial requalification execution review digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.reviewDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Commercial requalification execution review integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
  record:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision,
): void {
  verifyReviewDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Commercial requalification review ID", record.reviewId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Evaluator ID", record.evaluatorId],
      ["Source ledger ID", record.sourceLedgerId],
      ["Source preparation ID", record.sourcePreparationId],
      ["Source execution decision ID", record.sourceExecutionDecisionId],
      ["Source review decision ID", record.sourceReviewDecisionId],
      ["Source remediation ID", record.sourceRemediationId],
    ] as const
  ) {
    requireIdentifier(label, value);
  }

  for (
    const [
      label,
      value,
    ] of [
      ["Source ledger digest", record.sourceLedgerDigest],
      ["Source preparation digest", record.sourcePreparationDigest],
      ["Source execution decision digest", record.sourceExecutionDecisionDigest],
      ["Source review decision digest", record.sourceReviewDecisionDigest],
      ["Source remediation digest", record.sourceRemediationDigest],
      ["Source composite evidence digest", record.sourceCompositeEvidenceDigest],
      ["Source containment digest", record.sourceContainmentDigest],
      ["Source registry digest", record.sourceRegistryDigest],
    ] as const
  ) {
    requireDigest(label, value);
  }

  requireRationale(record.rationale);
  requireTimestamp(record.reviewedAt);

  const approved =
    record.outcome ===
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION";

  const summary =
    record.evidenceSummary;

  const review =
    record.reviewBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW_DECISION_VERSION ||
    record.reviewState !==
      "OWNER_MEERA_COMMERCIAL_REQUALIFICATION_EXECUTION_REVIEW_RECORDED" ||
    record.department !==
      "SALES" ||
    record.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.employeeCode !==
      "nx-sales-005" ||
    record.evaluatorId ===
      record.ownerId ||
    (
      record.outcome !==
        "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION" &&
      record.outcome !==
        "REJECT_AND_RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
    ) ||
    record.approved !==
      approved ||
    summary.qualificationCasesExecuted !==
      12 ||
    summary.qualificationCasesPassed !==
      12 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCollected !==
      12 ||
    summary.assertionsExecuted !==
      48 ||
    summary.assertionsPassed !==
      48 ||
    summary.assertionsFailed !==
      0 ||
    summary.uniqueCaseIds !==
      12 ||
    summary.uniqueEvidenceIds !==
      12 ||
    summary.uniqueEvidenceDigests !==
      12 ||
    summary.uniqueBindingDigests !==
      12 ||
    summary.syntheticCommercialDraftAllowedCases !==
      8 ||
    summary.ownerEscalationCases !==
      4 ||
    review.sourceExecutionEvidenceIntegrityVerified !==
      true ||
    review.exactEmployeeIdentityBound !==
      true ||
    review.exactTenantBound !==
      true ||
    review.exactOwnerBound !==
      true ||
    review.independentEvaluatorVerified !==
      true ||
    review.ownerActingAsEvaluatorBlocked !==
      true ||
    review.controlledRequalificationExecutionAuthorized !==
      true ||
    review.controlledRequalificationExecutionPerformed !==
      true ||
    review.assertionDerivedEvidenceVerified !==
      true ||
    review.hardCodedPassingEvidenceAccepted !==
      false ||
    review.ownerReviewRequiredAfterExecution !==
      true ||
    review.ownerPostExecutionReviewRecorded !==
      true ||
    review.executionEvidenceAccepted !==
      approved ||
    review.meeraCommercialEvidenceRequalified !==
      approved ||
    review.salesCoreLaunchRequalificationEligible !==
      approved ||
    review.salesCoreLaunchRequalified !==
      false ||
    review.salesCoreLaunchReadinessAssessmentCreated !==
      false ||
    review.approvalBypassAllowed !==
      false ||
    review.historicalRecordsMutated !==
      false ||
    review.historicalSourceDigestsPreserved !==
      true ||
    Object.values(
      record.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    ) ||
    record.nextStep !==
      (
        approved
          ? "REQUALIFY_SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE"
          : "RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
      )
  ) {
    throw new Error(
      "Commercial requalification execution review decision state is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.evidenceSummary,
    ) ||
    !Object.isFrozen(
      record.reviewBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Commercial requalification execution review decision must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
  input:
    CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecisionInput,
): SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision {
  const evidence =
    input.executionEvidence;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence(
    evidence,
  );

  requireIdentifier(
    "Commercial requalification review ID",
    input.reviewId,
  );

  requireIdentifier(
    "Commercial requalification review owner ID",
    input.ownerId,
  );

  requireRationale(input.rationale);
  requireTimestamp(input.reviewedAt);

  if (
    input.ownerId !==
      evidence.ownerId
  ) {
    throw new Error(
      "Only the execution-evidence-bound owner may record this review.",
    );
  }

  if (
    input.outcome !==
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION" &&
    input.outcome !==
      "REJECT_AND_RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
  ) {
    throw new Error(
      "Commercial requalification execution review outcome is invalid.",
    );
  }

  if (
    Date.parse(input.reviewedAt) <
      Date.parse(evidence.executedAt)
  ) {
    throw new Error(
      "Commercial requalification execution review cannot precede evidence execution.",
    );
  }

  if (
    evidence.ledgerState !==
      "MEERA_COMMERCIAL_REQUALIFICATION_ASSERTION_EVIDENCE_CAPTURED" ||
    evidence.nextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW" ||
    evidence.evaluatorId ===
      evidence.ownerId ||
    evidence.executionBoundary
      .controlledRequalificationExecutionAuthorized !==
        true ||
    evidence.executionBoundary
      .controlledRequalificationExecutionPerformed !==
        true ||
    evidence.executionBoundary
      .qualificationCasesExecuted !==
        12 ||
    evidence.executionBoundary
      .qualificationCasesPassed !==
        12 ||
    evidence.executionBoundary
      .qualificationCasesFailed !==
        0 ||
    evidence.executionBoundary
      .executionEvidenceCreated !==
        true ||
    evidence.executionBoundary
      .independentEvaluationCompleted !==
        true ||
    evidence.executionBoundary
      .ownerReviewRequiredAfterExecution !==
        true ||
    evidence.executionBoundary
      .ownerPostExecutionReviewRecorded !==
        false ||
    evidence.executionBoundary
      .meeraCommercialEvidenceRequalified !==
        false ||
    evidence.executionBoundary
      .salesCoreLaunchRequalificationEligible !==
        false ||
    evidence.evidenceBindings.some(
      (binding) =>
        binding.assertionDerivedEvidence !==
          true ||
        binding.hardCodedPassingEvidenceAccepted !==
          false ||
        binding.passed !==
          true
    )
  ) {
    throw new Error(
      "Commercial requalification execution evidence is not eligible for owner review.",
    );
  }

  const approved =
    input.outcome ===
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION";

  const sourceSummary =
    evidence.summary;

  const core = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW_DECISION_VERSION,

    reviewId:
      input.reviewId,

    reviewState:
      "OWNER_MEERA_COMMERCIAL_REQUALIFICATION_EXECUTION_REVIEW_RECORDED" as const,

    department:
      "SALES" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    employeeCode:
      "nx-sales-005" as const,

    tenantId:
      evidence.tenantId,

    ownerId:
      evidence.ownerId,

    evaluatorId:
      evidence.evaluatorId,

    sourceLedgerId:
      evidence.ledgerId,

    sourceLedgerDigest:
      evidence.ledgerDigest,

    sourcePreparationId:
      evidence.preparationId,

    sourcePreparationDigest:
      evidence.preparationDigest,

    sourceExecutionDecisionId:
      evidence.executionDecisionId,

    sourceExecutionDecisionDigest:
      evidence.executionDecisionDigest,

    sourceReviewDecisionId:
      evidence.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      evidence.sourceReviewDecisionDigest,

    sourceRemediationId:
      evidence.sourceRemediationId,

    sourceRemediationDigest:
      evidence.sourceRemediationDigest,

    sourceCompositeEvidenceDigest:
      evidence.sourceCompositeEvidenceDigest,

    sourceContainmentDigest:
      evidence.sourceContainmentDigest,

    sourceRegistryDigest:
      evidence.sourceRegistryDigest,

    outcome:
      input.outcome,

    approved,

    evidenceSummary: {
      qualificationCasesExecuted:
        sourceSummary.qualificationCasesExecuted,

      qualificationCasesPassed:
        sourceSummary.qualificationCasesPassed,

      qualificationCasesFailed:
        sourceSummary.qualificationCasesFailed,

      qualificationEvidenceCollected:
        sourceSummary.qualificationEvidenceCollected,

      assertionsExecuted:
        sourceSummary.totalAssertionsExecuted,

      assertionsPassed:
        sourceSummary.totalAssertionsPassed,

      assertionsFailed:
        sourceSummary.totalAssertionsFailed,

      uniqueCaseIds:
        sourceSummary.uniqueCaseIds,

      uniqueEvidenceIds:
        sourceSummary.uniqueEvidenceIds,

      uniqueEvidenceDigests:
        sourceSummary.uniqueEvidenceDigests,

      uniqueBindingDigests:
        sourceSummary.uniqueBindingDigests,

      syntheticCommercialDraftAllowedCases:
        sourceSummary.syntheticCommercialDraftAllowedCases,

      ownerEscalationCases:
        sourceSummary.ownerEscalationCases,
    },

    reviewBoundary: {
      sourceExecutionEvidenceIntegrityVerified:
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

      controlledRequalificationExecutionAuthorized:
        true as const,

      controlledRequalificationExecutionPerformed:
        true as const,

      assertionDerivedEvidenceVerified:
        true as const,

      hardCodedPassingEvidenceAccepted:
        false as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      ownerPostExecutionReviewRecorded:
        true as const,

      executionEvidenceAccepted:
        approved,

      meeraCommercialEvidenceRequalified:
        approved,

      salesCoreLaunchRequalificationEligible:
        approved,

      salesCoreLaunchRequalified:
        false as const,

      salesCoreLaunchReadinessAssessmentCreated:
        false as const,

      approvalBypassAllowed:
        false as const,

      historicalRecordsMutated:
        false as const,

      historicalSourceDigestsPreserved:
        true as const,
    },

    authorityBoundary: {
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

    rationale:
      input.rationale.trim(),

    nextStep:
      (
        approved
          ? "REQUALIFY_SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE"
          : "RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
      ) as
        | "REQUALIFY_SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE"
        | "RETURN_TO_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION",

    reviewedAt:
      input.reviewedAt,
  };

  const decision =
    deepFreeze({
      ...core,

      reviewDigest:
        sha256(core),
    }) as SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionReviewDecision(
    decision,
  );

  return decision;
}
