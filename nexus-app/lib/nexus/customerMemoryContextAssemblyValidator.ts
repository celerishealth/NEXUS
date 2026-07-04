type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryContextBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  isAllowedForContext?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryContextAssemblyValidationInput = {
  businessId?: string;
  customerId?: string;
  assemblyMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  hasRealDatabaseAccess?: boolean;
  hasWriteIntent?: boolean;
  memoryContextBlocks?: CustomerMemoryContextBlock[];
  contextBlocks?: CustomerMemoryContextBlock[];
  retrievedMemoryItems?: CustomerMemoryContextBlock[];
};

type ValidationCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const PROHIBITED_ACTION_TERMS = [
  "approve",
  "reject",
  "payment",
  "charge",
  "refund",
  "send",
  "message",
  "db_write",
  "memory_write",
  "memory_delete",
  "customer_data_write",
  "execute",
];

const ALLOWED_CONTEXT_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "owner-approved-preview",
]);

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return value;
}

function normalizeContextBlocks(payload: UnknownRecord): CustomerMemoryContextBlock[] {
  const rawBlocks =
    (Array.isArray(payload.memoryContextBlocks) && payload.memoryContextBlocks) ||
    (Array.isArray(payload.contextBlocks) && payload.contextBlocks) ||
    (Array.isArray(payload.retrievedMemoryItems) && payload.retrievedMemoryItems) ||
    [];

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `context-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Memory context block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "safe-preview",
    confidence: asNumber(block.confidence) ?? 0,
    isAllowedForContext: block.isAllowedForContext !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

export function validateCustomerMemoryContextAssemblyPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const contextBlocks = normalizeContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();

  const unsafeBlocks = contextBlocks.filter(
    (block) =>
      block.isAllowedForContext === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !ALLOWED_CONTEXT_SOURCES.has(block.source || "safe-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business and customer scope is present",
      passed: Boolean(businessId && customerId),
      reason: businessId && customerId
        ? "Context assembly preview is scoped to one business and one customer."
        : "Missing businessId or customerId blocks context validation.",
    },
    {
      id: "read-only-boundary",
      label: "No real DB access or write intent",
      passed: payload.hasRealDatabaseAccess !== true && payload.hasWriteIntent !== true,
      reason: payload.hasRealDatabaseAccess === true || payload.hasWriteIntent === true
        ? "Validator detected real database access or write intent."
        : "Validator remains read-only and preview-only.",
    },
    {
      id: "context-block-safety",
      label: "Context blocks are safe for assembly",
      passed: contextBlocks.length > 0 && unsafeBlocks.length === 0,
      reason: contextBlocks.length === 0
        ? "No context blocks supplied for validation."
        : unsafeBlocks.length === 0
          ? "All supplied context blocks pass preview safety checks."
          : "One or more context blocks failed preview safety checks.",
    },
    {
      id: "risk-boundary",
      label: "No high-risk or owner-approval-only context",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason: riskLevel === "high" || payload.ownerApprovalRequired === true
        ? "High-risk or owner-approval-only context must not be assembled automatically."
        : "No high-risk context boundary was crossed.",
    },
    {
      id: "prohibited-action-boundary",
      label: "No risky execution action requested",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason: requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
        ? "Requested action contains a prohibited execution term."
        : "No approve, reject, payment, message sending, DB write, or execution action requested.",
    },
  ];

  const failedChecks = validationChecks.filter((check) => !check.passed);
  const safeContextBlocks = contextBlocks.filter((block) => !unsafeBlocks.includes(block));

  return {
    day: 84,
    feature: "Backend Customer Memory Context Assembly Validator v1",
    version: "v1",
    mode: "context-assembly-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    contextSummary: {
      suppliedBlocks: contextBlocks.length,
      safeBlocks: safeContextBlocks.length,
      excludedBlocks: unsafeBlocks.length,
    },
    safeContextBlocks,
    excludedContextBlocks: unsafeBlocks,
    lockedSafetyBoundary: {
      readsRealDatabaseMemory: false,
      writesCustomerMemory: false,
      createsMemoryRecords: false,
      updatesMemoryRecords: false,
      deletesMemoryRecords: false,
      writesCustomerData: false,
      approvesOrRejects: false,
      executesPayments: false,
      sendsMessages: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this validator only for safe preview validation. Real DB memory read/write, execution, messaging, approval, payment, and customer-data writes remain blocked until explicitly planned later with safety architecture.",
  };
}
