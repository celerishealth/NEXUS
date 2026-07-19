import {
  createHash,
} from "node:crypto";

import {
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
} from "./salesCoreLaunchCommercialEvidenceControlledRequalificationPreparation";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_VERSION =
  "sales-core-launch-commercial-evidence-controlled-requalification-execution-decision-v1" as const;

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISIONS =
  [
    "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION",
    "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY",
  ] as const;

export type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionType =
  (
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISIONS
  )[number];

export interface CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput {
  readonly controlledRequalificationPreparation:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation;

  readonly decisionId: string;
  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionType;

  readonly reason: string;
  readonly decidedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_VERSION;

  readonly decisionId: string;

  readonly decisionState:
    "OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_RECORDED";

  readonly department:
    "SALES";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly preparationId: string;
  readonly preparationDigest: string;

  readonly sourceReviewDecisionId: string;
  readonly sourceReviewDecisionDigest: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;

  readonly sourceCompositeEvidenceDigest: string;
  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly tenantId: string;
  readonly ownerId: string;

  readonly decision:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionType;

  readonly approvedForControlledRequalificationExecution:
    boolean;

  readonly reviewedPreparation: Readonly<{
    preparationState:
      "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED";

    qualificationObjective:
      "VERIFY_GENUINE_COMMERCIAL_QUOTATION_AND_PROPOSAL_COMPETENCE";

    executionMode:
      "SANDBOX_ONLY";

    toolMode:
      "DRAFT_ONLY";

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    inquiryEvidenceMode:
      "READ_ONLY";

    recommendationEvidenceMode:
      "READ_ONLY";

    commercialDraftMode:
      "DRAFT_ONLY";

    totalRequiredCases:
      12;

    minimumPassingCases:
      12;

    everyCaseMustPass:
      true;

    independentEvaluationRequired:
      true;

    ownerReviewRequiredAfterExecution:
      true;

    zeroInventionRequired:
      true;

    customerDeliveryForbidden:
      true;

    realCustomerDataForbidden:
      true;

    productionAccessForbidden:
      true;

    plannedCaseCount:
      12;

    uniquePlannedCaseCount:
      12;

    preparationNextStep:
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION";
  }>;

  readonly authorityBoundary: Readonly<{
    sourcePreparationIntegrityVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    ownerExecutionDecisionRecorded:
      true;

    approvalBypassAllowed:
      false;

    preparationAuthorized:
      true;

    preparationExecuted:
      true;

    controlledRequalificationExecutionAuthorized:
      boolean;

    controlledRequalificationExecutionPerformed:
      false;

    qualificationCasesExecuted:
      0;

    qualificationCasesPassed:
      0;

    qualificationCasesFailed:
      0;

    executionEvidenceCreated:
      false;

    independentEvaluationCompleted:
      false;

    ownerReviewRequiredAfterExecution:
      true;

    ownerPostExecutionReviewRecorded:
      false;

    meeraCommercialEvidenceRequalified:
      false;

    salesCoreLaunchRequalificationEligible:
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
    | "EXECUTE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
    | "RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY";

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
      "Unsupported deterministic execution-decision value.",
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
      "Controlled-requalification execution decision time is invalid.",
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
      "Controlled-requalification execution reason must be safe, explicit, and non-secret.",
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
      "Execution decision digest is invalid.",
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
      "Sales core launch commercial requalification execution decision integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
  record:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
): void {
  verifyDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Execution decision ID", record.decisionId],
      ["Preparation ID", record.preparationId],
      ["Source review decision ID", record.sourceReviewDecisionId],
      ["Source remediation ID", record.sourceRemediationId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
    ] as const
  ) {
    requireIdentifier(label, value);
  }

  for (
    const [
      label,
      value,
    ] of [
      ["Preparation digest", record.preparationDigest],
      ["Source review decision digest", record.sourceReviewDecisionDigest],
      ["Source remediation digest", record.sourceRemediationDigest],
      ["Source composite evidence digest", record.sourceCompositeEvidenceDigest],
      ["Source containment digest", record.sourceContainmentDigest],
      ["Source registry digest", record.sourceRegistryDigest],
    ] as const
  ) {
    requireDigest(label, value);
  }

  requireReason(record.reason);
  requireTimestamp(record.decidedAt);

  const approved =
    record.decision ===
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION";

  const reviewed =
    record.reviewedPreparation;

  const boundary =
    record.authorityBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_VERSION ||
    record.decisionState !==
      "OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_RECORDED" ||
    record.department !==
      "SALES" ||
    record.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.employeeCode !==
      "nx-sales-005" ||
    (
      record.decision !==
        "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION" &&
      record.decision !==
        "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY"
    ) ||
    record.approvedForControlledRequalificationExecution !==
      approved ||
    reviewed.preparationState !==
      "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED" ||
    reviewed.qualificationObjective !==
      "VERIFY_GENUINE_COMMERCIAL_QUOTATION_AND_PROPOSAL_COMPETENCE" ||
    reviewed.executionMode !==
      "SANDBOX_ONLY" ||
    reviewed.toolMode !==
      "DRAFT_ONLY" ||
    reviewed.dataClassification !==
      "SYNTHETIC_SANITIZED_ONLY" ||
    reviewed.inquiryEvidenceMode !==
      "READ_ONLY" ||
    reviewed.recommendationEvidenceMode !==
      "READ_ONLY" ||
    reviewed.commercialDraftMode !==
      "DRAFT_ONLY" ||
    reviewed.totalRequiredCases !==
      12 ||
    reviewed.minimumPassingCases !==
      12 ||
    reviewed.everyCaseMustPass !==
      true ||
    reviewed.independentEvaluationRequired !==
      true ||
    reviewed.ownerReviewRequiredAfterExecution !==
      true ||
    reviewed.zeroInventionRequired !==
      true ||
    reviewed.customerDeliveryForbidden !==
      true ||
    reviewed.realCustomerDataForbidden !==
      true ||
    reviewed.productionAccessForbidden !==
      true ||
    reviewed.plannedCaseCount !==
      12 ||
    reviewed.uniquePlannedCaseCount !==
      12 ||
    reviewed.preparationNextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION" ||
    boundary.sourcePreparationIntegrityVerified !==
      true ||
    boundary.exactEmployeeIdentityBound !==
      true ||
    boundary.exactTenantBound !==
      true ||
    boundary.exactOwnerBound !==
      true ||
    boundary.ownerExecutionDecisionRecorded !==
      true ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.preparationAuthorized !==
      true ||
    boundary.preparationExecuted !==
      true ||
    boundary.controlledRequalificationExecutionAuthorized !==
      approved ||
    boundary.controlledRequalificationExecutionPerformed !==
      false ||
    boundary.qualificationCasesExecuted !==
      0 ||
    boundary.qualificationCasesPassed !==
      0 ||
    boundary.qualificationCasesFailed !==
      0 ||
    boundary.executionEvidenceCreated !==
      false ||
    boundary.independentEvaluationCompleted !==
      false ||
    boundary.ownerReviewRequiredAfterExecution !==
      true ||
    boundary.ownerPostExecutionReviewRecorded !==
      false ||
    boundary.meeraCommercialEvidenceRequalified !==
      false ||
    boundary.salesCoreLaunchRequalificationEligible !==
      false ||
    boundary.runtimeActivationPreparationEligible !==
      false ||
    boundary.runtimeActivationAuthorized !==
      false ||
    boundary.runtimeActivationExecuted !==
      false ||
    boundary.runtimeActivated !==
      false ||
    boundary.controlledWorkAuthorized !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.customerCommitmentAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.productionAuthorityGranted !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.autonomousExecutionAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    record.nextStep !==
      (
        approved
          ? "EXECUTE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
          : "RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY"
      )
  ) {
    throw new Error(
      "Sales core launch commercial requalification execution decision is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(record.reviewedPreparation) ||
    !Object.isFrozen(record.authorityBoundary)
  ) {
    throw new Error(
      "Sales core launch commercial requalification execution decision must be deeply immutable.",
    );
  }
}

export function createSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
  input:
    CreateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecisionInput,
): SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision {
  const source =
    input.controlledRequalificationPreparation;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
    source,
  );

  requireIdentifier(
    "Execution decision ID",
    input.decisionId,
  );

  requireIdentifier(
    "Execution decision owner ID",
    input.ownerId,
  );

  requireReason(input.reason);
  requireTimestamp(input.decidedAt);

  if (
    input.ownerId !== source.ownerId
  ) {
    throw new Error(
      "Only the controlled-requalification-preparation-bound owner may issue this execution decision.",
    );
  }

  if (
    input.decision !==
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION" &&
    input.decision !==
      "REJECT_AND_RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY"
  ) {
    throw new Error(
      "Controlled-requalification execution decision is invalid.",
    );
  }

  if (
    Date.parse(input.decidedAt) <
      Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Controlled-requalification execution decision cannot precede preparation.",
    );
  }

  if (
    source.preparationState !==
      "MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARED" ||
    source.nextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION" ||
    source.executionBoundary
      .ownerExecutionDecisionRequired !==
        true ||
    source.executionBoundary
      .ownerExecutionDecisionRecorded !==
        false ||
    source.executionBoundary
      .controlledRequalificationExecutionAuthorized !==
        false ||
    source.executionBoundary
      .controlledRequalificationExecuted !==
        false ||
    source.executionBoundary
      .qualificationCasesExecuted !==
        0 ||
    source.executionBoundary
      .meeraCommercialEvidenceRequalified !==
        false ||
    source.executionBoundary
      .salesCoreLaunchRequalificationEligible !==
        false ||
    Object.values(
      source.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    )
  ) {
    throw new Error(
      "Controlled-requalification preparation is not eligible for an owner execution decision.",
    );
  }

  const approved =
    input.decision ===
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION";

  const policy =
    source.qualificationPolicy;

  const core = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_VERSION,

    decisionId:
      input.decisionId,

    decisionState:
      "OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_DECISION_RECORDED" as const,

    department:
      "SALES" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    employeeCode:
      "nx-sales-005" as const,

    preparationId:
      source.preparationId,

    preparationDigest:
      source.preparationDigest,

    sourceReviewDecisionId:
      source.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      source.sourceReviewDecisionDigest,

    sourceRemediationId:
      source.sourceRemediationId,

    sourceRemediationDigest:
      source.sourceRemediationDigest,

    sourceCompositeEvidenceDigest:
      source.sourceCompositeEvidenceDigest,

    sourceContainmentDigest:
      source.sourceContainmentDigest,

    sourceRegistryDigest:
      source.sourceRegistryDigest,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    decision:
      input.decision,

    approvedForControlledRequalificationExecution:
      approved,

    reviewedPreparation: {
      preparationState:
        source.preparationState,

      qualificationObjective:
        source.qualificationObjective,

      executionMode:
        policy.executionMode,

      toolMode:
        policy.toolMode,

      dataClassification:
        policy.dataClassification,

      inquiryEvidenceMode:
        policy.inquiryEvidenceMode,

      recommendationEvidenceMode:
        policy.recommendationEvidenceMode,

      commercialDraftMode:
        policy.commercialDraftMode,

      totalRequiredCases:
        policy.totalRequiredCases,

      minimumPassingCases:
        policy.minimumPassingCases,

      everyCaseMustPass:
        policy.everyCaseMustPass,

      independentEvaluationRequired:
        policy.independentEvaluationRequired,

      ownerReviewRequiredAfterExecution:
        policy.ownerReviewRequiredAfterExecution,

      zeroInventionRequired:
        policy.zeroInventionRequired,

      customerDeliveryForbidden:
        policy.customerDeliveryForbidden,

      realCustomerDataForbidden:
        policy.realCustomerDataForbidden,

      productionAccessForbidden:
        policy.productionAccessForbidden,

      plannedCaseCount:
        source.plannedCases.length as 12,

      uniquePlannedCaseCount:
        new Set(
          source.plannedCases.map(
            (plannedCase) =>
              plannedCase.caseId,
          ),
        ).size as 12,

      preparationNextStep:
        source.nextStep,
    },

    authorityBoundary: {
      sourcePreparationIntegrityVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      ownerExecutionDecisionRecorded:
        true as const,

      approvalBypassAllowed:
        false as const,

      preparationAuthorized:
        true as const,

      preparationExecuted:
        true as const,

      controlledRequalificationExecutionAuthorized:
        approved,

      controlledRequalificationExecutionPerformed:
        false as const,

      qualificationCasesExecuted:
        0 as const,

      qualificationCasesPassed:
        0 as const,

      qualificationCasesFailed:
        0 as const,

      executionEvidenceCreated:
        false as const,

      independentEvaluationCompleted:
        false as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      ownerPostExecutionReviewRecorded:
        false as const,

      meeraCommercialEvidenceRequalified:
        false as const,

      salesCoreLaunchRequalificationEligible:
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
      (
        approved
          ? "EXECUTE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
          : "RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY"
      ) as
        | "EXECUTE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION"
        | "RETAIN_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_PREPARATION_ONLY",

    decidedAt:
      input.decidedAt,
  };

  const record =
    deepFreeze({
      ...core,

      decisionDigest:
        sha256(core),
    }) as SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
    record,
  );

  return record;
}
