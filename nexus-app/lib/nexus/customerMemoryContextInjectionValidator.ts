type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryContextInjectionValidationBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  injectionAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
  approvedByContract?: boolean;
};

export type CustomerMemoryContextInjectionValidationInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  hasRealDatabaseAccess?: boolean;
  hasWriteIntent?: boolean;
  hasMessageSendingIntent?: boolean;
  hasPaymentIntent?: boolean;
  hasApprovalExecutionIntent?: boolean;
  hasPromptExecutionIntent?: boolean;
  contractDecision?: string;
  isContractReady?: boolean;
  injectionBlocks?: CustomerMemoryContextInjectionValidationBlock[];
  allowedInjectionBlocks?: CustomerMemoryContextInjectionValidationBlock[];
  assembledContextBlocks?: CustomerMemoryContextInjectionValidationBlock[];
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
  "whatsapp",
  "email",
  "sms",
  "db_write",
  "memory_write",
  "memory_delete",
  "customer_data_write",
  "execute",
];

const ALLOWED_VALIDATION_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "context-assembly-validation-preview",
  "context-injection-contract-preview",
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

function normalizeValidationBlocks(payload: UnknownRecord): CustomerMemoryContextInjectionValidationBlock[] {
  const rawBlocks =
    (Array.isArray(payload.injectionBlocks) && payload.injectionBlocks) ||
    (Array.isArray(payload.allowedInjectionBlocks) && payload.allowedInjectionBlocks) ||
    (Array.isArray(payload.assembledContextBlocks) && payload.assembledContextBlocks) ||
    [];

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `validated-injection-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Validated context injection block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "context-injection-contract-preview",
    confidence: asNumber(block.confidence) ?? 0,
    injectionAllowed: block.injectionAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
    approvedByContract: block.approvedByContract !== false,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryContextInjectionValidationBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function validateCustomerMemoryContextInjectionPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const injectionBlocks = normalizeValidationBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const contractDecision = asString(payload.contractDecision);

  const blockedBlocks = injectionBlocks.filter(
    (block) =>
      block.injectionAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      block.approvedByContract === false ||
      !hasMinimumConfidence(block) ||
      !ALLOWED_VALIDATION_SOURCES.has(block.source || "context-injection-contract-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, and conversation scope is present",
      passed: Boolean(businessId && customerId && conversationId),
      reason:
        businessId && customerId && conversationId
          ? "Context injection validation is scoped to one business, one customer, and one conversation."
          : "Missing businessId, customerId, or conversationId blocks injection validation.",
    },
    {
      id: "contract-readiness",
      label: "Injection contract is ready before validation",
      passed:
        payload.isContractReady === true ||
        contractDecision === "contract-ready" ||
        contractDecision === "passed",
      reason:
        payload.isContractReady === true ||
        contractDecision === "contract-ready" ||
        contractDecision === "passed"
          ? "Upstream context injection contract is marked ready for preview validation."
          : "Upstream context injection contract is not marked ready.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access or write intent",
      passed: payload.hasRealDatabaseAccess !== true && payload.hasWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true || payload.hasWriteIntent === true
          ? "Validator detected real database access or write intent."
          : "Validator remains read-only and preview-only.",
    },
    {
      id: "no-execution-intents",
      label: "No message, payment, approval, or prompt execution intent",
      passed:
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasPromptExecutionIntent !== true,
      reason:
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasApprovalExecutionIntent === true ||
        payload.hasPromptExecutionIntent === true
          ? "Execution intent detected and blocked."
          : "No message sending, payment, approval, reject, or prompt execution intent detected.",
    },
    {
      id: "context-injection-block-validation",
      label: "Injection blocks pass validation",
      passed: injectionBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        injectionBlocks.length === 0
          ? "No injection blocks supplied for validation."
          : blockedBlocks.length === 0
            ? "All supplied injection blocks pass preview validation."
            : "One or more injection blocks failed preview validation.",
    },
    {
      id: "risk-boundary",
      label: "No high-risk or owner-approval-only context",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-only context must not be injected automatically."
          : "No high-risk owner-approval boundary was crossed.",
    },
    {
      id: "prohibited-action-boundary",
      label: "No risky execution action requested",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains a prohibited execution term."
          : "No approve, reject, payment, message sending, DB write, or execution action requested.",
    },
  ];

  const failedChecks = validationChecks.filter((check) => !check.passed);
  const validatedInjectionBlocks = injectionBlocks.filter((block) => !blockedBlocks.includes(block));

  return {
    day: 86,
    feature: "Backend Customer Memory Context Injection Validator v1",
    version: "v1",
    mode: "context-injection-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    validatedInjectionBlocks,
    blockedInjectionBlocks: blockedBlocks,
    contextSummary: {
      suppliedBlocks: injectionBlocks.length,
      validatedBlocks: validatedInjectionBlocks.length,
      blockedBlocks: blockedBlocks.length,
    },
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
      executesPromptInjection: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this validator only to validate safe customer memory context injection previews. Real prompt execution, real DB memory access, customer data writes, messaging, approvals, payments, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
