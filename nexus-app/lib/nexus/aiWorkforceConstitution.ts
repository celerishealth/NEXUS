export const AI_WORKFORCE_PROHIBITION_IDS = [
  "FRAUD",
  "FORGERY",
  "FAKE_DOCUMENTS",
  "FAKE_CERTIFICATES",
  "FAKE_INVOICES",
  "FABRICATED_CITATIONS",
  "FAKE_GOVERNMENT_RECORDS",
  "MISLEADING_PROFESSIONAL_CREDENTIALS",
  "IDENTITY_THEFT",
  "CREDENTIAL_THEFT",
  "UNAUTHORIZED_SYSTEM_ACCESS",
  "UNAUTHORIZED_PAYMENT",
  "UNAUTHORIZED_LEGAL_FILING",
  "FALSE_DECLARATION",
  "BRIBERY_CORRUPTION",
  "CONCEALING_EVIDENCE",
  "AUDIT_LOG_TAMPERING",
  "FOUNDER_CONTROL_BYPASS",
  "ILLEGAL_CUSTOMER_REQUEST",
] as const;

export type AiWorkforceProhibitionId =
  (typeof AI_WORKFORCE_PROHIBITION_IDS)[number];

export const AI_WORKFORCE_STOP_LAW_IDS = [
  "UNKNOWN",
  "UNVERIFIED",
  "UNAUTHORIZED",
  "CONFLICTING_EVIDENCE",
  "REGULATED_ACTIVITY",
  "HIGH_RISK_ACTION",
  "LEGAL_UNCERTAINTY",
  "COUNTRY_NOT_APPROVED",
] as const;

export type AiWorkforceStopLawId =
  (typeof AI_WORKFORCE_STOP_LAW_IDS)[number];

export const AI_WORKFORCE_CONSTITUTION_DECISIONS = [
  "ALLOW_CONSTITUTIONALLY",
  "BLOCK_PROHIBITED",
  "BLOCK_UNKNOWN",
  "BLOCK_UNVERIFIED",
  "BLOCK_UNAUTHORIZED",
  "BLOCK_CONFLICTING_EVIDENCE",
  "REQUIRE_PROFESSIONAL_REVIEW",
  "REQUIRE_HUMAN_APPROVAL",
  "BLOCK_LEGAL_UNCERTAINTY",
  "BLOCK_COUNTRY_NOT_APPROVED",
] as const;

export type AiWorkforceConstitutionDecision =
  (typeof AI_WORKFORCE_CONSTITUTION_DECISIONS)[number];

export type AiWorkforceRequesterSource =
  | "SYSTEM"
  | "AI_PROMPT"
  | "EMPLOYEE"
  | "EXTERNAL_DOCUMENT"
  | "CUSTOMER"
  | "VENDOR"
  | "FOUNDER";

export interface AiWorkforceConstitutionEvaluationInput {
  tenantId: string;
  actorId: string;
  requesterSource: AiWorkforceRequesterSource;
  actionClass: string;
  actionClassState: "KNOWN" | "UNKNOWN";
  requestedCapability: string;
  countryState: "APPROVED" | "NOT_APPROVED" | "UNKNOWN";
  authorityState: "AUTHORIZED" | "UNAUTHORIZED" | "UNKNOWN";
  verificationState: "VERIFIED" | "UNVERIFIED" | "UNKNOWN";
  provenanceState: "VERIFIED" | "UNVERIFIED" | "UNKNOWN";
  legalState: "LAWFUL" | "UNLAWFUL" | "UNCERTAIN" | "UNKNOWN";
  regulatedActivityState:
    | "NOT_REGULATED"
    | "PROFESSIONAL_REVIEW_REQUIRED"
    | "UNKNOWN";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  humanApprovalRequirement: "NOT_REQUIRED" | "REQUIRED" | "UNKNOWN";
  humanApprovalState:
    | "NOT_APPLICABLE"
    | "APPROVED"
    | "MISSING"
    | "UNKNOWN";
  evidenceState: "CLEAR" | "CONFLICTING" | "UNKNOWN";
  prohibitionFindings: readonly AiWorkforceProhibitionId[];
  constitutionalOverrideAttempted: boolean;
}

export interface AiWorkforceConstitutionEvaluation {
  constitutionVersion: "NEXUS_AI_WORKFORCE_CONSTITUTION_V1";
  allowed: boolean;
  decision: AiWorkforceConstitutionDecision;
  reasonCodes: readonly string[];
  prohibitionFindings: readonly AiWorkforceProhibitionId[];
  requesterSource: AiWorkforceRequesterSource | "UNKNOWN";
  actionClass: string | null;
  requestedCapability: string | null;
}

const REQUESTER_SOURCES = new Set<AiWorkforceRequesterSource>([
  "SYSTEM",
  "AI_PROMPT",
  "EMPLOYEE",
  "EXTERNAL_DOCUMENT",
  "CUSTOMER",
  "VENDOR",
  "FOUNDER",
]);

const PROHIBITION_IDS = new Set<string>(
  AI_WORKFORCE_PROHIBITION_IDS,
);
const REGULATED_ACTIVITY_STATES = new Set([
  "NOT_REGULATED",
  "PROFESSIONAL_REVIEW_REQUIRED",
  "UNKNOWN",
]);

const RISK_LEVELS = new Set([
  "LOW",
  "MEDIUM",
  "HIGH",
  "UNKNOWN",
]);

const HUMAN_APPROVAL_REQUIREMENTS = new Set([
  "NOT_REQUIRED",
  "REQUIRED",
  "UNKNOWN",
]);

const HUMAN_APPROVAL_STATES = new Set([
  "NOT_APPLICABLE",
  "APPROVED",
  "MISSING",
  "UNKNOWN",
]);

function deepFreeze<T>(value: T): Readonly<T> {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (const nested of Object.values(
      value as Record<string, unknown>,
    )) {
      deepFreeze(nested);
    }
  }

  return value;
}

export const AI_WORKFORCE_CONSTITUTION = deepFreeze({
  identity: "NEXUS AI Workforce Constitution",
  version: "NEXUS_AI_WORKFORCE_CONSTITUTION_V1",
  precedence:
    "CONSTITUTION_OUTRANKS_ORDINARY_PROMPTS_AND_REQUESTER_AUTHORITY",
  stopLaws: AI_WORKFORCE_STOP_LAW_IDS,
  permanentProhibitions: AI_WORKFORCE_PROHIBITION_IDS,
  overridePolicy: {
    ordinaryPromptCanOverride: false,
    employeeCanOverride: false,
    externalDocumentCanOverride: false,
    customerCanOverride: false,
    vendorCanOverride: false,
    founderCanOverrideUnlawfulRequest: false,
  },
  executionRule:
    "ONLY_EXPLICIT_ALLOW_CONSTITUTIONALLY_IS_PERMISSION",
} as const);

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function normalizeText(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function decision(
  input: unknown,
  result: {
    decision: AiWorkforceConstitutionDecision;
    reasonCodes: readonly string[];
    prohibitionFindings?: readonly AiWorkforceProhibitionId[];
    requesterSource?: AiWorkforceRequesterSource | "UNKNOWN";
    actionClass?: string | null;
    requestedCapability?: string | null;
  },
): AiWorkforceConstitutionEvaluation {
  const allowed =
    result.decision === "ALLOW_CONSTITUTIONALLY";

  return deepFreeze({
    constitutionVersion:
      "NEXUS_AI_WORKFORCE_CONSTITUTION_V1",
    allowed,
    decision: result.decision,
    reasonCodes: [...result.reasonCodes],
    prohibitionFindings: [
      ...(result.prohibitionFindings ?? []),
    ],
    requesterSource:
      result.requesterSource ?? "UNKNOWN",
    actionClass:
      result.actionClass ?? null,
    requestedCapability:
      result.requestedCapability ?? null,
  }) as AiWorkforceConstitutionEvaluation;
}

export function evaluateAiWorkforceConstitution(
  rawInput: unknown,
): AiWorkforceConstitutionEvaluation {
  if (!isRecord(rawInput)) {
    return decision(rawInput, {
      decision: "BLOCK_UNKNOWN",
      reasonCodes: ["CONSTITUTION_INPUT_INVALID"],
    });
  }

  const tenantId = normalizeText(rawInput.tenantId);
  const actorId = normalizeText(rawInput.actorId);
  const requesterSource =
    typeof rawInput.requesterSource === "string" &&
    REQUESTER_SOURCES.has(
      rawInput.requesterSource as AiWorkforceRequesterSource,
    )
      ? (rawInput.requesterSource as AiWorkforceRequesterSource)
      : "UNKNOWN";

  const actionClass = normalizeText(rawInput.actionClass);
  const requestedCapability = normalizeText(
    rawInput.requestedCapability,
  );

  const rawFindings = Array.isArray(
    rawInput.prohibitionFindings,
  )
    ? rawInput.prohibitionFindings
    : null;

  if (
    !tenantId ||
    !actorId ||
    requesterSource === "UNKNOWN" ||
    !actionClass ||
    !requestedCapability ||
    rawFindings === null ||
    typeof rawInput.constitutionalOverrideAttempted !== "boolean"
  ) {
    return decision(rawInput, {
      decision: "BLOCK_UNKNOWN",
      reasonCodes: ["REQUIRED_CONSTITUTION_EVIDENCE_MISSING"],
      requesterSource,
      actionClass: actionClass || null,
      requestedCapability: requestedCapability || null,
    });
  }

  if (
    !REGULATED_ACTIVITY_STATES.has(
      rawInput.regulatedActivityState as string,
    ) ||
    !RISK_LEVELS.has(
      rawInput.riskLevel as string,
    ) ||
    !HUMAN_APPROVAL_REQUIREMENTS.has(
      rawInput.humanApprovalRequirement as string,
    ) ||
    !HUMAN_APPROVAL_STATES.has(
      rawInput.humanApprovalState as string,
    )
  ) {
    return decision(rawInput, {
      decision: "BLOCK_UNKNOWN",
      reasonCodes: ["REQUIRED_CONSTITUTION_EVIDENCE_INVALID"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }
  const unknownFinding = rawFindings.find(
    (finding) =>
      typeof finding !== "string" ||
      !PROHIBITION_IDS.has(finding),
  );

  if (unknownFinding !== undefined) {
    return decision(rawInput, {
      decision: "BLOCK_UNKNOWN",
      reasonCodes: ["UNKNOWN_PROHIBITION_FINDING"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  const prohibitionFindings =
    rawFindings as AiWorkforceProhibitionId[];

  if (rawInput.constitutionalOverrideAttempted === true) {
    return decision(rawInput, {
      decision: "BLOCK_PROHIBITED",
      reasonCodes: ["CONSTITUTION_OVERRIDE_ATTEMPT"],
      prohibitionFindings,
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (prohibitionFindings.length > 0) {
    return decision(rawInput, {
      decision: "BLOCK_PROHIBITED",
      reasonCodes: ["PERMANENT_PROHIBITION_FOUND"],
      prohibitionFindings,
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (rawInput.legalState === "UNLAWFUL") {
    return decision(rawInput, {
      decision: "BLOCK_PROHIBITED",
      reasonCodes: ["UNLAWFUL_REQUEST"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (rawInput.authorityState === "UNAUTHORIZED") {
    return decision(rawInput, {
      decision: "BLOCK_UNAUTHORIZED",
      reasonCodes: ["ACTION_UNAUTHORIZED"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (rawInput.evidenceState === "CONFLICTING") {
    return decision(rawInput, {
      decision: "BLOCK_CONFLICTING_EVIDENCE",
      reasonCodes: ["CONFLICTING_EVIDENCE"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (rawInput.legalState === "UNCERTAIN") {
    return decision(rawInput, {
      decision: "BLOCK_LEGAL_UNCERTAINTY",
      reasonCodes: ["LEGAL_UNCERTAINTY"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (rawInput.countryState === "NOT_APPROVED") {
    return decision(rawInput, {
      decision: "BLOCK_COUNTRY_NOT_APPROVED",
      reasonCodes: ["COUNTRY_NOT_APPROVED"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (
    rawInput.verificationState === "UNVERIFIED" ||
    rawInput.provenanceState === "UNVERIFIED"
  ) {
    return decision(rawInput, {
      decision: "BLOCK_UNVERIFIED",
      reasonCodes: ["REQUIRED_EVIDENCE_UNVERIFIED"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  const hasUnknownEvidence =
    rawInput.actionClassState !== "KNOWN" ||
    rawInput.countryState === "UNKNOWN" ||
    rawInput.authorityState === "UNKNOWN" ||
    rawInput.verificationState === "UNKNOWN" ||
    rawInput.provenanceState === "UNKNOWN" ||
    rawInput.legalState === "UNKNOWN" ||
    rawInput.regulatedActivityState === "UNKNOWN" ||
    rawInput.riskLevel === "UNKNOWN" ||
    rawInput.humanApprovalRequirement === "UNKNOWN" ||
    rawInput.humanApprovalState === "UNKNOWN" ||
    rawInput.evidenceState === "UNKNOWN";

  if (hasUnknownEvidence) {
    return decision(rawInput, {
      decision: "BLOCK_UNKNOWN",
      reasonCodes: ["REQUIRED_CONSTITUTION_EVIDENCE_UNKNOWN"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (
    rawInput.regulatedActivityState ===
    "PROFESSIONAL_REVIEW_REQUIRED"
  ) {
    return decision(rawInput, {
      decision: "REQUIRE_PROFESSIONAL_REVIEW",
      reasonCodes: ["REGULATED_ACTIVITY_REVIEW_REQUIRED"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  const humanApprovalRequired =
    rawInput.riskLevel === "HIGH" ||
    rawInput.humanApprovalRequirement === "REQUIRED";

  if (
    humanApprovalRequired &&
    rawInput.humanApprovalState !== "APPROVED"
  ) {
    return decision(rawInput, {
      decision: "REQUIRE_HUMAN_APPROVAL",
      reasonCodes: ["HUMAN_APPROVAL_REQUIRED"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  if (
    rawInput.authorityState !== "AUTHORIZED" ||
    rawInput.verificationState !== "VERIFIED" ||
    rawInput.provenanceState !== "VERIFIED" ||
    rawInput.legalState !== "LAWFUL" ||
    rawInput.countryState !== "APPROVED" ||
    rawInput.evidenceState !== "CLEAR" ||
    rawInput.actionClassState !== "KNOWN"
  ) {
    return decision(rawInput, {
      decision: "BLOCK_UNKNOWN",
      reasonCodes: ["CONSTITUTION_ALLOW_PRECONDITION_INCOMPLETE"],
      requesterSource,
      actionClass,
      requestedCapability,
    });
  }

  return decision(rawInput, {
    decision: "ALLOW_CONSTITUTIONALLY",
    reasonCodes: ["ALL_CONSTITUTION_REQUIREMENTS_SATISFIED"],
    requesterSource,
    actionClass,
    requestedCapability,
  });
}