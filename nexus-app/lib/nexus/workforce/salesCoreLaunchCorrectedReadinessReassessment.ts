import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialEvidenceRequalificationRecord,
  type SalesCoreLaunchCommercialEvidenceRequalificationRecord,
} from "./salesCoreLaunchCommercialEvidenceRequalificationRecord";

export const SALES_CORE_LAUNCH_CORRECTED_READINESS_REASSESSMENT_VERSION =
  "sales-core-launch-corrected-readiness-reassessment-v1" as const;

export interface CreateSalesCoreLaunchCorrectedReadinessReassessmentInput {
  readonly reassessmentId: string;

  readonly commercialEvidenceRequalification:
    SalesCoreLaunchCommercialEvidenceRequalificationRecord;

  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly rationale: string;
  readonly assessedAt: string;
}

export interface SalesCoreLaunchCorrectedReadinessReassessment {
  readonly version:
    typeof SALES_CORE_LAUNCH_CORRECTED_READINESS_REASSESSMENT_VERSION;

  readonly reassessmentId: string;

  readonly reassessmentState:
    "CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT_CREATED";

  readonly department:
    "SALES";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

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

  readonly assessedEmployees: Readonly<{
    employeeIds: readonly [
      "employee-asha-inquiry-intake-v1",
      "employee-riya-recommendation-specialist-v1",
      "employee-meera-quotation-proposal-specialist-v1",
    ];

    employeeCodes: readonly [
      "nx-sales-003",
      "nx-sales-004",
      "nx-sales-005",
    ];

    launchSequence: readonly [
      3,
      4,
      5,
    ];

    ashaEvidenceStatus:
      "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY";

    riyaEvidenceStatus:
      "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY";

    meeraEvidenceStatus:
      "REQUALIFIED_ASSERTION_DERIVED_COMMERCIAL_EVIDENCE";
  }>;

  readonly verifiedCommercialEvidence: Readonly<{
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

    syntheticCommercialDraftAllowedCases:
      8;

    ownerEscalationCases:
      4;
  }>;

  readonly reassessmentBoundary: Readonly<{
    sourceRequalificationIntegrityVerified:
      true;

    salesCoreLaunchCommercialEvidenceRequalified:
      true;

    containmentRemediationRequirementSatisfied:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    independentEvaluatorRequired:
      true;

    independentEvaluatorVerified:
      true;

    ownerActingAsEvaluatorBlocked:
      true;

    correctedReadinessReassessmentEligible:
      true;

    correctedReadinessReassessmentCreated:
      true;

    correctedReadinessDecisionRecorded:
      false;

    correctedReadinessApproved:
      false;

    ownerReviewRequired:
      true;

    ownerReviewRecorded:
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

    activationPlanningEligible:
      false;

    commercialInfrastructureClosureEligible:
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

  readonly rationale: string;

  readonly nextStep:
    "AWAIT_OWNER_CORRECTED_SALES_CORE_LAUNCH_READINESS_DECISION";

  readonly assessedAt: string;
  readonly reassessmentDigest: string;
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
      "Unsupported deterministic corrected Sales-core readiness value.",
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
      "Corrected Sales-core readiness reassessment time is invalid.",
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
      "Corrected Sales-core readiness rationale must be safe, explicit, and non-secret.",
    );
  }
}

function verifyReassessmentDigest(
  record: DigestRecord,
): void {
  const digest =
    record.reassessmentDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Corrected Sales-core readiness reassessment digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.reassessmentDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Corrected Sales-core readiness reassessment integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCorrectedReadinessReassessment(
  record:
    SalesCoreLaunchCorrectedReadinessReassessment,
): void {
  verifyReassessmentDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Reassessment ID", record.reassessmentId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Evaluator ID", record.evaluatorId],
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
  requireTimestamp(record.assessedAt);

  const employees =
    record.assessedEmployees;

  const evidence =
    record.verifiedCommercialEvidence;

  const boundary =
    record.reassessmentBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_CORRECTED_READINESS_REASSESSMENT_VERSION ||
    record.reassessmentState !==
      "CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT_CREATED" ||
    record.department !==
      "SALES" ||
    record.evaluatorId ===
      record.ownerId ||
    JSON.stringify(
      employees.employeeIds,
    ) !==
      JSON.stringify([
        "employee-asha-inquiry-intake-v1",
        "employee-riya-recommendation-specialist-v1",
        "employee-meera-quotation-proposal-specialist-v1",
      ]) ||
    JSON.stringify(
      employees.employeeCodes,
    ) !==
      JSON.stringify([
        "nx-sales-003",
        "nx-sales-004",
        "nx-sales-005",
      ]) ||
    JSON.stringify(
      employees.launchSequence,
    ) !==
      JSON.stringify([
        3,
        4,
        5,
      ]) ||
    employees.ashaEvidenceStatus !==
      "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY" ||
    employees.riyaEvidenceStatus !==
      "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY" ||
    employees.meeraEvidenceStatus !==
      "REQUALIFIED_ASSERTION_DERIVED_COMMERCIAL_EVIDENCE" ||
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
    evidence.syntheticCommercialDraftAllowedCases !==
      8 ||
    evidence.ownerEscalationCases !==
      4 ||
    boundary.sourceRequalificationIntegrityVerified !==
      true ||
    boundary.salesCoreLaunchCommercialEvidenceRequalified !==
      true ||
    boundary.containmentRemediationRequirementSatisfied !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.independentEvaluatorRequired !==
      true ||
    boundary.independentEvaluatorVerified !==
      true ||
    boundary.ownerActingAsEvaluatorBlocked !==
      true ||
    boundary.correctedReadinessReassessmentEligible !==
      true ||
    boundary.correctedReadinessReassessmentCreated !==
      true ||
    boundary.correctedReadinessDecisionRecorded !==
      false ||
    boundary.correctedReadinessApproved !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerReviewRecorded !==
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
    boundary.activationPlanningEligible !==
      false ||
    boundary.commercialInfrastructureClosureEligible !==
      false ||
    Object.values(
      record.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    ) ||
    record.nextStep !==
      "AWAIT_OWNER_CORRECTED_SALES_CORE_LAUNCH_READINESS_DECISION"
  ) {
    throw new Error(
      "Corrected Sales-core readiness reassessment state is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.assessedEmployees,
    ) ||
    !Object.isFrozen(
      record.assessedEmployees.employeeIds,
    ) ||
    !Object.isFrozen(
      record.assessedEmployees.employeeCodes,
    ) ||
    !Object.isFrozen(
      record.assessedEmployees.launchSequence,
    ) ||
    !Object.isFrozen(
      record.verifiedCommercialEvidence,
    ) ||
    !Object.isFrozen(
      record.reassessmentBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Corrected Sales-core readiness reassessment must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCorrectedReadinessReassessment(
  input:
    CreateSalesCoreLaunchCorrectedReadinessReassessmentInput,
): SalesCoreLaunchCorrectedReadinessReassessment {
  const requalification =
    input.commercialEvidenceRequalification;

  validateSalesCoreLaunchCommercialEvidenceRequalificationRecord(
    requalification,
  );

  requireIdentifier(
    "Reassessment ID",
    input.reassessmentId,
  );

  requireIdentifier(
    "Reassessment owner ID",
    input.ownerId,
  );

  requireIdentifier(
    "Reassessment evaluator ID",
    input.evaluatorId,
  );

  requireRationale(input.rationale);
  requireTimestamp(input.assessedAt);

  if (
    input.ownerId !==
      requalification.ownerId
  ) {
    throw new Error(
      "Corrected readiness reassessment must use the requalification-bound owner.",
    );
  }

  if (
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Owner cannot act as the corrected readiness evaluator.",
    );
  }

  if (
    Date.parse(input.assessedAt) <
      Date.parse(requalification.requalifiedAt)
  ) {
    throw new Error(
      "Corrected readiness reassessment cannot precede commercial evidence requalification.",
    );
  }

  const sourceBoundary =
    requalification.requalificationBoundary;

  if (
    requalification.requalificationState !==
      "SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_REQUALIFIED" ||
    requalification.nextStep !==
      "CREATE_CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT" ||
    requalification.evaluatorId ===
      requalification.ownerId ||
    sourceBoundary.salesCoreLaunchCommercialEvidenceRequalified !==
      true ||
    sourceBoundary.salesCoreLaunchRequalificationCompleted !==
      true ||
    sourceBoundary.containmentRemediationRequirementSatisfied !==
      true ||
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
    sourceBoundary.correctedReadinessReassessmentEligible !==
      true ||
    sourceBoundary.correctedReadinessReassessmentCreated !==
      false ||
    sourceBoundary.correctedReadinessDecisionRecorded !==
      false
  ) {
    throw new Error(
      "Commercial evidence requalification is not eligible for corrected readiness reassessment.",
    );
  }

  const sourceEvidence =
    requalification.verifiedEvidence;

  const core = {
    version:
      SALES_CORE_LAUNCH_CORRECTED_READINESS_REASSESSMENT_VERSION,

    reassessmentId:
      input.reassessmentId,

    reassessmentState:
      "CORRECTED_SALES_CORE_LAUNCH_READINESS_REASSESSMENT_CREATED" as const,

    department:
      "SALES" as const,

    tenantId:
      requalification.tenantId,

    ownerId:
      requalification.ownerId,

    evaluatorId:
      input.evaluatorId,

    sourceRequalificationId:
      requalification.requalificationId,

    sourceRequalificationDigest:
      requalification.requalificationDigest,

    sourceExecutionReviewId:
      requalification.sourceExecutionReviewId,

    sourceExecutionReviewDigest:
      requalification.sourceExecutionReviewDigest,

    sourceExecutionEvidenceLedgerId:
      requalification.sourceExecutionEvidenceLedgerId,

    sourceExecutionEvidenceLedgerDigest:
      requalification.sourceExecutionEvidenceLedgerDigest,

    sourceRemediationId:
      requalification.sourceRemediationId,

    sourceRemediationDigest:
      requalification.sourceRemediationDigest,

    sourceContainmentDigest:
      requalification.sourceContainmentDigest,

    sourceRegistryDigest:
      requalification.sourceRegistryDigest,

    assessedEmployees: {
      employeeIds: [
        "employee-asha-inquiry-intake-v1",
        "employee-riya-recommendation-specialist-v1",
        "employee-meera-quotation-proposal-specialist-v1",
      ] as const,

      employeeCodes: [
        "nx-sales-003",
        "nx-sales-004",
        "nx-sales-005",
      ] as const,

      launchSequence: [
        3,
        4,
        5,
      ] as const,

      ashaEvidenceStatus:
        "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY" as const,

      riyaEvidenceStatus:
        "HISTORICAL_VERIFIED_PILOT_EVIDENCE_ONLY" as const,

      meeraEvidenceStatus:
        "REQUALIFIED_ASSERTION_DERIVED_COMMERCIAL_EVIDENCE" as const,
    },

    verifiedCommercialEvidence: {
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

      syntheticCommercialDraftAllowedCases:
        sourceEvidence.syntheticCommercialDraftAllowedCases,

      ownerEscalationCases:
        sourceEvidence.ownerEscalationCases,
    },

    reassessmentBoundary: {
      sourceRequalificationIntegrityVerified:
        true as const,

      salesCoreLaunchCommercialEvidenceRequalified:
        true as const,

      containmentRemediationRequirementSatisfied:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      independentEvaluatorRequired:
        true as const,

      independentEvaluatorVerified:
        true as const,

      ownerActingAsEvaluatorBlocked:
        true as const,

      correctedReadinessReassessmentEligible:
        true as const,

      correctedReadinessReassessmentCreated:
        true as const,

      correctedReadinessDecisionRecorded:
        false as const,

      correctedReadinessApproved:
        false as const,

      ownerReviewRequired:
        true as const,

      ownerReviewRecorded:
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

      activationPlanningEligible:
        false as const,

      commercialInfrastructureClosureEligible:
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

    rationale:
      input.rationale.trim(),

    nextStep:
      "AWAIT_OWNER_CORRECTED_SALES_CORE_LAUNCH_READINESS_DECISION" as const,

    assessedAt:
      input.assessedAt,
  };

  const reassessment =
    deepFreeze({
      ...core,

      reassessmentDigest:
        sha256(core),
    }) as SalesCoreLaunchCorrectedReadinessReassessment;

  validateSalesCoreLaunchCorrectedReadinessReassessment(
    reassessment,
  );

  return reassessment;
}
