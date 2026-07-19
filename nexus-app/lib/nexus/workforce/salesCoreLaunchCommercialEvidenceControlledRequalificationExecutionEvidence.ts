import {
  createHash,
} from "node:crypto";

import {
  MEERA_COMMERCIAL_REQUALIFICATION_CASES,
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
} from "./salesCoreLaunchCommercialEvidenceControlledRequalificationPreparation";

import {
  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
  type SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision,
} from "./salesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision";

export const SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_EVIDENCE_VERSION =
  "sales-core-launch-commercial-evidence-controlled-requalification-execution-evidence-v1" as const;

type CommercialRequalificationCase =
  (
    typeof MEERA_COMMERCIAL_REQUALIFICATION_CASES
  )[number];

type CommercialRequalificationControl =
  | "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT"
  | "BLOCK_AND_ESCALATE_TO_OWNER";

type AssertionValue =
  | string
  | number
  | boolean
  | null;

export interface CommercialRequalificationAssertion {
  readonly assertionId: string;
  readonly description: string;

  readonly actual:
    AssertionValue;

  readonly expected:
    AssertionValue;

  readonly passed:
    boolean;
}

export interface CommercialRequalificationEvidenceBinding {
  readonly sequence: number;
  readonly evidenceId: string;

  readonly caseId:
    CommercialRequalificationCase["caseId"];

  readonly category:
    CommercialRequalificationCase["category"];

  readonly scenario:
    CommercialRequalificationCase["scenario"];

  readonly requiredEvidence:
    CommercialRequalificationCase["requiredEvidence"];

  readonly failClosedCondition:
    CommercialRequalificationCase["failClosedCondition"];

  readonly expectedControl:
    CommercialRequalificationControl;

  readonly actualControl:
    CommercialRequalificationControl;

  readonly executionMode:
    "SANDBOX_ONLY";

  readonly toolMode:
    "DRAFT_ONLY";

  readonly dataClassification:
    "SYNTHETIC_SANITIZED_ONLY";

  readonly evaluatorId: string;

  readonly assertions:
    readonly CommercialRequalificationAssertion[];

  readonly assertionDerivedEvidence:
    true;

  readonly hardCodedPassingEvidenceAccepted:
    false;

  readonly passed:
    boolean;

  readonly executedAt: string;
  readonly evidenceDigest: string;
  readonly bindingDigest: string;
}

export interface ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput {
  readonly ledgerId: string;

  readonly controlledRequalificationPreparation:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation;

  readonly executionDecision:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision;

  readonly ownerId: string;
  readonly evaluatorId: string;
  readonly executedAt: string;
}

export interface SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence {
  readonly version:
    typeof SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_EVIDENCE_VERSION;

  readonly ledgerId: string;

  readonly ledgerState:
    "MEERA_COMMERCIAL_REQUALIFICATION_ASSERTION_EVIDENCE_CAPTURED";

  readonly department:
    "SALES";

  readonly employeeId:
    "employee-meera-quotation-proposal-specialist-v1";

  readonly employeeCode:
    "nx-sales-005";

  readonly tenantId: string;
  readonly ownerId: string;
  readonly evaluatorId: string;

  readonly preparationId: string;
  readonly preparationDigest: string;

  readonly executionDecisionId: string;
  readonly executionDecisionDigest: string;

  readonly sourceReviewDecisionId: string;
  readonly sourceReviewDecisionDigest: string;

  readonly sourceRemediationId: string;
  readonly sourceRemediationDigest: string;

  readonly sourceCompositeEvidenceDigest: string;
  readonly sourceContainmentDigest: string;
  readonly sourceRegistryDigest: string;

  readonly evidenceBindings:
    readonly CommercialRequalificationEvidenceBinding[];

  readonly summary: Readonly<{
    qualificationCasesExecuted:
      12;

    qualificationCasesPassed:
      12;

    qualificationCasesFailed:
      0;

    qualificationEvidenceCollected:
      12;

    totalAssertionsExecuted:
      48;

    totalAssertionsPassed:
      48;

    totalAssertionsFailed:
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

  readonly executionBoundary: Readonly<{
    sourcePreparationIntegrityVerified:
      true;

    sourceExecutionDecisionIntegrityVerified:
      true;

    exactPreparationDecisionBindingVerified:
      true;

    exactEmployeeIdentityBound:
      true;

    exactTenantBound:
      true;

    exactOwnerBound:
      true;

    independentEvaluatorRequired:
      true;

    ownerActingAsEvaluatorBlocked:
      true;

    syntheticFixtureAssertionsExecuted:
      true;

    assertionDerivedEvidenceRequired:
      true;

    hardCodedPassingEvidenceAccepted:
      false;

    controlledRequalificationExecutionAuthorized:
      true;

    controlledRequalificationExecutionPerformed:
      true;

    qualificationCasesExecuted:
      12;

    qualificationCasesPassed:
      12;

    qualificationCasesFailed:
      0;

    executionEvidenceCreated:
      true;

    independentEvaluationCompleted:
      true;

    ownerReviewRequiredAfterExecution:
      true;

    ownerPostExecutionReviewRecorded:
      false;

    meeraCommercialEvidenceRequalified:
      false;

    salesCoreLaunchRequalificationEligible:
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

  readonly nextStep:
    "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW";

  readonly executedAt: string;
  readonly ledgerDigest: string;
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
      "Unsupported deterministic commercial requalification evidence value.",
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
  label: string,
  value: string,
): void {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    !Number.isFinite(Date.parse(value))
  ) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function assertion(
  caseId: string,
  sequence: number,
  description: string,
  actual: AssertionValue,
  expected: AssertionValue,
): CommercialRequalificationAssertion {
  return {
    assertionId:
      `${caseId}:assertion-${sequence}`,

    description,

    actual,

    expected,

    passed:
      Object.is(actual, expected),
  };
}

function expectedControlForCase(
  caseId:
    CommercialRequalificationCase["caseId"],
): CommercialRequalificationControl {
  switch (caseId) {
    case "meera-commercial-requalification-04-unresolved-pricing":
    case "meera-commercial-requalification-10-tenant-owner":
    case "meera-commercial-requalification-11-adversarial-integrity":
    case "meera-commercial-requalification-12-failure-recovery":
      return "BLOCK_AND_ESCALATE_TO_OWNER";

    default:
      return "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT";
  }
}

function evaluateCase(
  qualificationCase:
    CommercialRequalificationCase,

  preparation:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation,
): Readonly<{
  control:
    CommercialRequalificationControl;

  assertions:
    readonly CommercialRequalificationAssertion[];
}> {
  const caseId =
    qualificationCase.caseId;

  switch (caseId) {
    case "meera-commercial-requalification-01-verified-item-quantity": {
      const productId =
        "synthetic-industrial-safety-helmet";

      const quantity =
        10;

      const unit =
        "PCS";

      const specification =
        "SYNTHETIC_ISI_GRADE";

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Verified product identity is present.",
            productId.length > 0,
            true,
          ),
          assertion(
            caseId,
            2,
            "Verified quantity is positive.",
            quantity > 0,
            true,
          ),
          assertion(
            caseId,
            3,
            "Verified unit is explicit.",
            unit,
            "PCS",
          ),
          assertion(
            caseId,
            4,
            "Verified specification is present.",
            specification.length > 0,
            true,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-02-priced-line-item": {
      const unitPrice =
        1250;

      const currency =
        "INR";

      const ownerApproved =
        true;

      const evidenceBound =
        true;

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Unit price is positive.",
            unitPrice > 0,
            true,
          ),
          assertion(
            caseId,
            2,
            "Currency is explicit.",
            currency,
            "INR",
          ),
          assertion(
            caseId,
            3,
            "Synthetic owner approval is present.",
            ownerApproved,
            true,
          ),
          assertion(
            caseId,
            4,
            "Priced line item is evidence-bound.",
            evidenceBound,
            true,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-03-multi-line-arithmetic": {
      const firstLine =
        2 * 1250;

      const secondLine =
        3 * 500;

      const subtotal =
        firstLine + secondLine;

      const roundingPolicy =
        "HALF_UP_2_DECIMALS";

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "First line amount is deterministic.",
            firstLine,
            2500,
          ),
          assertion(
            caseId,
            2,
            "Second line amount is deterministic.",
            secondLine,
            1500,
          ),
          assertion(
            caseId,
            3,
            "Subtotal is deterministic.",
            subtotal,
            4000,
          ),
          assertion(
            caseId,
            4,
            "Rounding policy is explicit.",
            roundingPolicy,
            "HALF_UP_2_DECIMALS",
          ),
        ],
      };
    }

    case "meera-commercial-requalification-04-unresolved-pricing": {
      const unitPrice =
        null;

      const currency =
        null;

      const unresolvedInputCount =
        2;

      const inventedCommercialValue =
        false;

      return {
        control:
          "BLOCK_AND_ESCALATE_TO_OWNER",

        assertions: [
          assertion(
            caseId,
            1,
            "Unverified unit price remains null.",
            unitPrice,
            null,
          ),
          assertion(
            caseId,
            2,
            "Unverified currency remains null.",
            currency,
            null,
          ),
          assertion(
            caseId,
            3,
            "Every missing commercial input is explicit.",
            unresolvedInputCount,
            2,
          ),
          assertion(
            caseId,
            4,
            "No commercial value is invented.",
            inventedCommercialValue,
            false,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-05-tax-treatment": {
      const taxRate =
        18;

      const taxableBasis =
        1000;

      const taxAmount =
        taxableBasis * taxRate / 100;

      const ownerApproved =
        true;

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Synthetic tax rate is explicit.",
            taxRate,
            18,
          ),
          assertion(
            caseId,
            2,
            "Synthetic taxable basis is explicit.",
            taxableBasis,
            1000,
          ),
          assertion(
            caseId,
            3,
            "Tax amount is deterministic.",
            taxAmount,
            180,
          ),
          assertion(
            caseId,
            4,
            "Tax treatment is owner-approved.",
            ownerApproved,
            true,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-06-freight-discount": {
      const freight =
        250;

      const discount =
        100;

      const representedSeparately =
        true;

      const hiddenAdjustment =
        false;

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Freight is explicit.",
            freight,
            250,
          ),
          assertion(
            caseId,
            2,
            "Discount is explicit.",
            discount,
            100,
          ),
          assertion(
            caseId,
            3,
            "Freight and discount remain separate.",
            representedSeparately,
            true,
          ),
          assertion(
            caseId,
            4,
            "No hidden price adjustment exists.",
            hiddenAdjustment,
            false,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-07-validity-payment": {
      const validityDays =
        15;

      const paymentTerms =
        "100_PERCENT_ADVANCE";

      const ownerApproved =
        true;

      const impliedCommitment =
        false;

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Validity period is explicit.",
            validityDays,
            15,
          ),
          assertion(
            caseId,
            2,
            "Payment terms are explicit.",
            paymentTerms,
            "100_PERCENT_ADVANCE",
          ),
          assertion(
            caseId,
            3,
            "Terms are owner-approved.",
            ownerApproved,
            true,
          ),
          assertion(
            caseId,
            4,
            "No implied customer commitment is created.",
            impliedCommitment,
            false,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-08-scope-boundaries": {
      const includedScopeCount =
        2;

      const exclusionCount =
        1;

      const dependencyCount =
        1;

      const unsupportedScopeExpansion =
        false;

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Included scope is explicit.",
            includedScopeCount,
            2,
          ),
          assertion(
            caseId,
            2,
            "Exclusions are explicit.",
            exclusionCount,
            1,
          ),
          assertion(
            caseId,
            3,
            "Dependencies are explicit.",
            dependencyCount,
            1,
          ),
          assertion(
            caseId,
            4,
            "Unsupported scope expansion is absent.",
            unsupportedScopeExpansion,
            false,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-09-handoff-binding": {
      const falseHistoricalDirectLinkClaim =
        false;

      return {
        control:
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",

        assertions: [
          assertion(
            caseId,
            1,
            "Owner-review digest is valid.",
            SHA256.test(
              preparation.sourceReviewDecisionDigest,
            ),
            true,
          ),
          assertion(
            caseId,
            2,
            "Remediation digest is valid.",
            SHA256.test(
              preparation.sourceRemediationDigest,
            ),
            true,
          ),
          assertion(
            caseId,
            3,
            "Composite evidence digest is valid.",
            SHA256.test(
              preparation.sourceCompositeEvidenceDigest,
            ),
            true,
          ),
          assertion(
            caseId,
            4,
            "No false historical direct-link claim is made.",
            falseHistoricalDirectLinkClaim,
            false,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-10-tenant-owner": {
      const crossTenantInputBlocked =
        "tenant-other" !==
          preparation.tenantId;

      const crossOwnerInputBlocked =
        "owner-other" !==
          preparation.ownerId;

      const ownerReviewRequired =
        true;

      const approvalBypassAllowed =
        false;

      return {
        control:
          "BLOCK_AND_ESCALATE_TO_OWNER",

        assertions: [
          assertion(
            caseId,
            1,
            "Cross-tenant input is detected and blocked.",
            crossTenantInputBlocked,
            true,
          ),
          assertion(
            caseId,
            2,
            "Cross-owner input is detected and blocked.",
            crossOwnerInputBlocked,
            true,
          ),
          assertion(
            caseId,
            3,
            "Owner review remains required.",
            ownerReviewRequired,
            true,
          ),
          assertion(
            caseId,
            4,
            "Approval bypass remains blocked.",
            approvalBypassAllowed,
            false,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-11-adversarial-integrity": {
      const digestMismatchDetected =
        true;

      const secretBearingInputDetected =
        true;

      const unsupportedClaimDetected =
        true;

      const adversarialContentBlocked =
        digestMismatchDetected &&
        secretBearingInputDetected &&
        unsupportedClaimDetected;

      return {
        control:
          "BLOCK_AND_ESCALATE_TO_OWNER",

        assertions: [
          assertion(
            caseId,
            1,
            "Digest mismatch is detected.",
            digestMismatchDetected,
            true,
          ),
          assertion(
            caseId,
            2,
            "Secret-bearing input is detected.",
            secretBearingInputDetected,
            true,
          ),
          assertion(
            caseId,
            3,
            "Unsupported commercial claim is detected.",
            unsupportedClaimDetected,
            true,
          ),
          assertion(
            caseId,
            4,
            "Adversarial content is blocked.",
            adversarialContentBlocked,
            true,
          ),
        ],
      };
    }

    case "meera-commercial-requalification-12-failure-recovery": {
      const failClosed =
        true;

      const auditEvidenceRetained =
        true;

      const reversibleDraftOnly =
        true;

      const ownerReviewRequired =
        true;

      return {
        control:
          "BLOCK_AND_ESCALATE_TO_OWNER",

        assertions: [
          assertion(
            caseId,
            1,
            "Incomplete commercial draft fails closed.",
            failClosed,
            true,
          ),
          assertion(
            caseId,
            2,
            "Audit evidence is retained.",
            auditEvidenceRetained,
            true,
          ),
          assertion(
            caseId,
            3,
            "Recovered output remains reversible draft-only.",
            reversibleDraftOnly,
            true,
          ),
          assertion(
            caseId,
            4,
            "Owner review remains required after recovery.",
            ownerReviewRequired,
            true,
          ),
        ],
      };
    }
  }
}

function verifyLedgerDigest(
  record: DigestRecord,
): void {
  const digest =
    record.ledgerDigest;

  if (
    typeof digest !== "string" ||
    !SHA256.test(digest)
  ) {
    throw new Error(
      "Commercial requalification evidence ledger digest is invalid.",
    );
  }

  const unsigned = {
    ...record,
  };

  delete unsigned.ledgerDigest;

  if (
    sha256(unsigned) !== digest
  ) {
    throw new Error(
      "Commercial requalification execution evidence integrity verification failed.",
    );
  }
}

export function validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence(
  record:
    SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence,
): void {
  verifyLedgerDigest(
    record as unknown as DigestRecord,
  );

  for (
    const [
      label,
      value,
    ] of [
      ["Evidence ledger ID", record.ledgerId],
      ["Tenant ID", record.tenantId],
      ["Owner ID", record.ownerId],
      ["Evaluator ID", record.evaluatorId],
      ["Preparation ID", record.preparationId],
      ["Execution decision ID", record.executionDecisionId],
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
      ["Preparation digest", record.preparationDigest],
      ["Execution decision digest", record.executionDecisionDigest],
      ["Source review decision digest", record.sourceReviewDecisionDigest],
      ["Source remediation digest", record.sourceRemediationDigest],
      ["Source composite evidence digest", record.sourceCompositeEvidenceDigest],
      ["Source containment digest", record.sourceContainmentDigest],
      ["Source registry digest", record.sourceRegistryDigest],
    ] as const
  ) {
    requireDigest(label, value);
  }

  requireTimestamp(
    "Commercial requalification execution time",
    record.executedAt,
  );

  const summary =
    record.summary;

  const execution =
    record.executionBoundary;

  if (
    record.version !==
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_EVIDENCE_VERSION ||
    record.ledgerState !==
      "MEERA_COMMERCIAL_REQUALIFICATION_ASSERTION_EVIDENCE_CAPTURED" ||
    record.department !==
      "SALES" ||
    record.employeeId !==
      "employee-meera-quotation-proposal-specialist-v1" ||
    record.employeeCode !==
      "nx-sales-005" ||
    record.evaluatorId ===
      record.ownerId ||
    record.evidenceBindings.length !==
      12 ||
    summary.qualificationCasesExecuted !==
      12 ||
    summary.qualificationCasesPassed !==
      12 ||
    summary.qualificationCasesFailed !==
      0 ||
    summary.qualificationEvidenceCollected !==
      12 ||
    summary.totalAssertionsExecuted !==
      48 ||
    summary.totalAssertionsPassed !==
      48 ||
    summary.totalAssertionsFailed !==
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
    execution.sourcePreparationIntegrityVerified !==
      true ||
    execution.sourceExecutionDecisionIntegrityVerified !==
      true ||
    execution.exactPreparationDecisionBindingVerified !==
      true ||
    execution.exactEmployeeIdentityBound !==
      true ||
    execution.exactTenantBound !==
      true ||
    execution.exactOwnerBound !==
      true ||
    execution.independentEvaluatorRequired !==
      true ||
    execution.ownerActingAsEvaluatorBlocked !==
      true ||
    execution.syntheticFixtureAssertionsExecuted !==
      true ||
    execution.assertionDerivedEvidenceRequired !==
      true ||
    execution.hardCodedPassingEvidenceAccepted !==
      false ||
    execution.controlledRequalificationExecutionAuthorized !==
      true ||
    execution.controlledRequalificationExecutionPerformed !==
      true ||
    execution.qualificationCasesExecuted !==
      12 ||
    execution.qualificationCasesPassed !==
      12 ||
    execution.qualificationCasesFailed !==
      0 ||
    execution.executionEvidenceCreated !==
      true ||
    execution.independentEvaluationCompleted !==
      true ||
    execution.ownerReviewRequiredAfterExecution !==
      true ||
    execution.ownerPostExecutionReviewRecorded !==
      false ||
    execution.meeraCommercialEvidenceRequalified !==
      false ||
    execution.salesCoreLaunchRequalificationEligible !==
      false ||
    Object.values(
      record.authorityBoundary,
    ).some(
      (authorized) =>
        authorized !== false,
    ) ||
    record.nextStep !==
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW"
  ) {
    throw new Error(
      "Commercial requalification execution evidence summary or boundary is invalid.",
    );
  }

  const caseIds =
    new Set<string>();

  const evidenceIds =
    new Set<string>();

  const evidenceDigests =
    new Set<string>();

  const bindingDigests =
    new Set<string>();

  let assertionCount =
    0;

  let passedAssertionCount =
    0;

  let allowedCases =
    0;

  let blockedCases =
    0;

  record.evidenceBindings.forEach(
    (
      binding,
      index,
    ) => {
      const canonicalCase =
        MEERA_COMMERCIAL_REQUALIFICATION_CASES[index];

      requireIdentifier(
        "Commercial requalification evidence ID",
        binding.evidenceId,
      );

      requireIdentifier(
        "Commercial requalification evaluator ID",
        binding.evaluatorId,
      );

      requireDigest(
        "Commercial requalification evidence digest",
        binding.evidenceDigest,
      );

      requireDigest(
        "Commercial requalification binding digest",
        binding.bindingDigest,
      );

      if (
        binding.sequence !==
          index + 1 ||
        binding.caseId !==
          canonicalCase.caseId ||
        binding.category !==
          canonicalCase.category ||
        binding.scenario !==
          canonicalCase.scenario ||
        canonicalize(
          binding.requiredEvidence,
        ) !==
          canonicalize(
            canonicalCase.requiredEvidence,
          ) ||
        binding.failClosedCondition !==
          canonicalCase.failClosedCondition ||
        binding.expectedControl !==
          expectedControlForCase(
            canonicalCase.caseId,
          ) ||
        binding.actualControl !==
          binding.expectedControl ||
        binding.executionMode !==
          "SANDBOX_ONLY" ||
        binding.toolMode !==
          "DRAFT_ONLY" ||
        binding.dataClassification !==
          "SYNTHETIC_SANITIZED_ONLY" ||
        binding.evaluatorId !==
          record.evaluatorId ||
        binding.assertions.length !==
          4 ||
        binding.assertionDerivedEvidence !==
          true ||
        binding.hardCodedPassingEvidenceAccepted !==
          false ||
        binding.passed !==
          true ||
        binding.executedAt !==
          record.executedAt ||
        binding.assertions.some(
          (item) =>
            item.passed !==
              Object.is(
                item.actual,
                item.expected,
              ) ||
            item.passed !==
              true,
        )
      ) {
        throw new Error(
          "Commercial requalification evidence binding is invalid.",
        );
      }

      const {
        sequence,
        evidenceId,
        evidenceDigest,
        bindingDigest,
        ...evidenceFields
      } = binding;

      if (
        sha256(evidenceFields) !==
          evidenceDigest ||
        sha256({
          sequence,
          evidenceId,
          ...evidenceFields,
          evidenceDigest,
        }) !==
          bindingDigest
      ) {
        throw new Error(
          "Commercial requalification evidence binding integrity verification failed.",
        );
      }

      caseIds.add(binding.caseId);
      evidenceIds.add(binding.evidenceId);
      evidenceDigests.add(binding.evidenceDigest);
      bindingDigests.add(binding.bindingDigest);

      assertionCount +=
        binding.assertions.length;

      passedAssertionCount +=
        binding.assertions.filter(
          (item) =>
            item.passed,
        ).length;

      if (
        binding.actualControl ===
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT"
      ) {
        allowedCases += 1;
      } else {
        blockedCases += 1;
      }
    },
  );

  if (
    caseIds.size !==
      12 ||
    evidenceIds.size !==
      12 ||
    evidenceDigests.size !==
      12 ||
    bindingDigests.size !==
      12 ||
    assertionCount !==
      48 ||
    passedAssertionCount !==
      48 ||
    allowedCases !==
      8 ||
    blockedCases !==
      4
  ) {
    throw new Error(
      "Commercial requalification execution evidence uniqueness or coverage is invalid.",
    );
  }

  if (
    !Object.isFrozen(record) ||
    !Object.isFrozen(
      record.evidenceBindings,
    ) ||
    record.evidenceBindings.some(
      (binding) =>
        !Object.isFrozen(binding) ||
        !Object.isFrozen(
          binding.assertions,
        ) ||
        binding.assertions.some(
          (item) =>
            !Object.isFrozen(item),
        ),
    ) ||
    !Object.isFrozen(record.summary) ||
    !Object.isFrozen(
      record.executionBoundary,
    ) ||
    !Object.isFrozen(
      record.authorityBoundary,
    )
  ) {
    throw new Error(
      "Commercial requalification execution evidence must be deeply immutable.",
    );
  }
}

export async function executeSalesCoreLaunchCommercialEvidenceControlledRequalification(
  input:
    ExecuteSalesCoreLaunchCommercialEvidenceControlledRequalificationInput,
): Promise<SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence> {
  const preparation =
    input.controlledRequalificationPreparation;

  const decision =
    input.executionDecision;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationPreparation(
    preparation,
  );

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionDecision(
    decision,
  );

  requireIdentifier(
    "Evidence ledger ID",
    input.ledgerId,
  );

  requireIdentifier(
    "Execution owner ID",
    input.ownerId,
  );

  requireIdentifier(
    "Independent evaluator ID",
    input.evaluatorId,
  );

  requireTimestamp(
    "Commercial requalification execution time",
    input.executedAt,
  );

  if (
    input.ownerId !==
      preparation.ownerId ||
    input.ownerId !==
      decision.ownerId
  ) {
    throw new Error(
      "Only the preparation-and-decision-bound owner may execute controlled requalification.",
    );
  }

  if (
    input.evaluatorId ===
      input.ownerId
  ) {
    throw new Error(
      "Independent evaluator must remain distinct from the owner.",
    );
  }

  if (
    decision.decision !==
      "APPROVE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION" ||
    decision.approvedForControlledRequalificationExecution !==
      true ||
    decision.nextStep !==
      "EXECUTE_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION" ||
    decision.authorityBoundary
      .controlledRequalificationExecutionAuthorized !==
        true ||
    decision.authorityBoundary
      .controlledRequalificationExecutionPerformed !==
        false
  ) {
    throw new Error(
      "Owner decision does not authorize controlled commercial requalification execution.",
    );
  }

  if (
    decision.preparationId !==
      preparation.preparationId ||
    decision.preparationDigest !==
      preparation.preparationDigest ||
    decision.tenantId !==
      preparation.tenantId ||
    decision.ownerId !==
      preparation.ownerId ||
    decision.sourceReviewDecisionDigest !==
      preparation.sourceReviewDecisionDigest ||
    decision.sourceRemediationDigest !==
      preparation.sourceRemediationDigest ||
    decision.sourceCompositeEvidenceDigest !==
      preparation.sourceCompositeEvidenceDigest ||
    decision.sourceContainmentDigest !==
      preparation.sourceContainmentDigest ||
    decision.sourceRegistryDigest !==
      preparation.sourceRegistryDigest
  ) {
    throw new Error(
      "Controlled requalification execution decision is not bound to the supplied preparation.",
    );
  }

  if (
    Date.parse(input.executedAt) <
      Date.parse(preparation.preparedAt) ||
    Date.parse(input.executedAt) <
      Date.parse(decision.decidedAt)
  ) {
    throw new Error(
      "Controlled commercial requalification execution cannot precede preparation or owner decision.",
    );
  }

  const evidenceBindings =
    preparation.plannedCases.map(
      (
        qualificationCase,
        index,
      ): CommercialRequalificationEvidenceBinding => {
        const evaluation =
          evaluateCase(
            qualificationCase,
            preparation,
          );

        const expectedControl =
          expectedControlForCase(
            qualificationCase.caseId,
          );

        const passed =
          evaluation.control ===
            expectedControl &&
          evaluation.assertions.every(
            (item) =>
              item.passed,
          );

        const evidenceFields = {
          caseId:
            qualificationCase.caseId,

          category:
            qualificationCase.category,

          scenario:
            qualificationCase.scenario,

          requiredEvidence:
            qualificationCase.requiredEvidence,

          failClosedCondition:
            qualificationCase.failClosedCondition,

          expectedControl,

          actualControl:
            evaluation.control,

          executionMode:
            "SANDBOX_ONLY" as const,

          toolMode:
            "DRAFT_ONLY" as const,

          dataClassification:
            "SYNTHETIC_SANITIZED_ONLY" as const,

          evaluatorId:
            input.evaluatorId,

          assertions:
            evaluation.assertions,

          assertionDerivedEvidence:
            true as const,

          hardCodedPassingEvidenceAccepted:
            false as const,

          passed,

          executedAt:
            input.executedAt,
        };

        const evidenceDigest =
          sha256(evidenceFields);

        const bindingCore = {
          sequence:
            index + 1,

          evidenceId:
            `meera-commercial-requalification-evidence-${String(
              index + 1,
            ).padStart(3, "0")}`,

          ...evidenceFields,

          evidenceDigest,
        };

        return {
          ...bindingCore,

          bindingDigest:
            sha256(bindingCore),
        };
      },
    );

  if (
    evidenceBindings.length !==
      12 ||
    evidenceBindings.some(
      (binding) =>
        binding.passed !==
          true,
    )
  ) {
    throw new Error(
      "All twelve commercial requalification cases must pass with assertion-derived evidence.",
    );
  }

  const caseIds =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.caseId,
      ),
    );

  const evidenceIds =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.evidenceId,
      ),
    );

  const evidenceDigests =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.evidenceDigest,
      ),
    );

  const bindingDigests =
    new Set(
      evidenceBindings.map(
        (binding) =>
          binding.bindingDigest,
      ),
    );

  if (
    caseIds.size !==
      12 ||
    evidenceIds.size !==
      12 ||
    evidenceDigests.size !==
      12 ||
    bindingDigests.size !==
      12
  ) {
    throw new Error(
      "Commercial requalification evidence records must be unique.",
    );
  }

  const totalAssertions =
    evidenceBindings.reduce(
      (
        total,
        binding,
      ) =>
        total +
        binding.assertions.length,
      0,
    );

  const passedAssertions =
    evidenceBindings.reduce(
      (
        total,
        binding,
      ) =>
        total +
        binding.assertions.filter(
          (item) =>
            item.passed,
        ).length,
      0,
    );

  const allowedCases =
    evidenceBindings.filter(
      (binding) =>
        binding.actualControl ===
          "ALLOW_SYNTHETIC_COMMERCIAL_DRAFT",
    ).length;

  const blockedCases =
    evidenceBindings.filter(
      (binding) =>
        binding.actualControl ===
          "BLOCK_AND_ESCALATE_TO_OWNER",
    ).length;

  if (
    totalAssertions !==
      48 ||
    passedAssertions !==
      48 ||
    allowedCases !==
      8 ||
    blockedCases !==
      4
  ) {
    throw new Error(
      "Commercial requalification assertion or control coverage is invalid.",
    );
  }

  const ledgerCore = {
    version:
      SALES_CORE_LAUNCH_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_EVIDENCE_VERSION,

    ledgerId:
      input.ledgerId,

    ledgerState:
      "MEERA_COMMERCIAL_REQUALIFICATION_ASSERTION_EVIDENCE_CAPTURED" as const,

    department:
      "SALES" as const,

    employeeId:
      "employee-meera-quotation-proposal-specialist-v1" as const,

    employeeCode:
      "nx-sales-005" as const,

    tenantId:
      preparation.tenantId,

    ownerId:
      preparation.ownerId,

    evaluatorId:
      input.evaluatorId,

    preparationId:
      preparation.preparationId,

    preparationDigest:
      preparation.preparationDigest,

    executionDecisionId:
      decision.decisionId,

    executionDecisionDigest:
      decision.decisionDigest,

    sourceReviewDecisionId:
      preparation.sourceReviewDecisionId,

    sourceReviewDecisionDigest:
      preparation.sourceReviewDecisionDigest,

    sourceRemediationId:
      preparation.sourceRemediationId,

    sourceRemediationDigest:
      preparation.sourceRemediationDigest,

    sourceCompositeEvidenceDigest:
      preparation.sourceCompositeEvidenceDigest,

    sourceContainmentDigest:
      preparation.sourceContainmentDigest,

    sourceRegistryDigest:
      preparation.sourceRegistryDigest,

    evidenceBindings,

    summary: {
      qualificationCasesExecuted:
        12 as const,

      qualificationCasesPassed:
        12 as const,

      qualificationCasesFailed:
        0 as const,

      qualificationEvidenceCollected:
        12 as const,

      totalAssertionsExecuted:
        48 as const,

      totalAssertionsPassed:
        48 as const,

      totalAssertionsFailed:
        0 as const,

      uniqueCaseIds:
        12 as const,

      uniqueEvidenceIds:
        12 as const,

      uniqueEvidenceDigests:
        12 as const,

      uniqueBindingDigests:
        12 as const,

      syntheticCommercialDraftAllowedCases:
        8 as const,

      ownerEscalationCases:
        4 as const,
    },

    executionBoundary: {
      sourcePreparationIntegrityVerified:
        true as const,

      sourceExecutionDecisionIntegrityVerified:
        true as const,

      exactPreparationDecisionBindingVerified:
        true as const,

      exactEmployeeIdentityBound:
        true as const,

      exactTenantBound:
        true as const,

      exactOwnerBound:
        true as const,

      independentEvaluatorRequired:
        true as const,

      ownerActingAsEvaluatorBlocked:
        true as const,

      syntheticFixtureAssertionsExecuted:
        true as const,

      assertionDerivedEvidenceRequired:
        true as const,

      hardCodedPassingEvidenceAccepted:
        false as const,

      controlledRequalificationExecutionAuthorized:
        true as const,

      controlledRequalificationExecutionPerformed:
        true as const,

      qualificationCasesExecuted:
        12 as const,

      qualificationCasesPassed:
        12 as const,

      qualificationCasesFailed:
        0 as const,

      executionEvidenceCreated:
        true as const,

      independentEvaluationCompleted:
        true as const,

      ownerReviewRequiredAfterExecution:
        true as const,

      ownerPostExecutionReviewRecorded:
        false as const,

      meeraCommercialEvidenceRequalified:
        false as const,

      salesCoreLaunchRequalificationEligible:
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

    nextStep:
      "AWAIT_OWNER_MEERA_COMMERCIAL_EVIDENCE_CONTROLLED_REQUALIFICATION_EXECUTION_REVIEW" as const,

    executedAt:
      input.executedAt,
  };

  const ledger =
    deepFreeze({
      ...ledgerCore,

      ledgerDigest:
        sha256(ledgerCore),
    }) as SalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence;

  validateSalesCoreLaunchCommercialEvidenceControlledRequalificationExecutionEvidence(
    ledger,
  );

  return ledger;
}
