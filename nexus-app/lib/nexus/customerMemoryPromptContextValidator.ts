type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryPromptContextValidationBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedByContract?: boolean;
  promptContextAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryPromptContextValidationInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  promptContextMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  hasRealDatabaseAccess?: boolean;
  hasWriteIntent?: boolean;
  hasMessageSendingIntent?: boolean;
  hasPaymentIntent?: boolean;
  hasApprovalExecutionIntent?: boolean;
  hasPromptExecutionIntent?: boolean;
  hasAiModelExecutionIntent?: boolean;
  promptContextContractDecision?: string;
  isPromptContextContractReady?: boolean;
  promptContextBlocks?: CustomerMemoryPromptContextValidationBlock[];
  allowedPromptContextBlocks?: CustomerMemoryPromptContextValidationBlock[];
  validatedPromptContextBlocks?: CustomerMemoryPromptContextValidationBlock[];
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
  "prompt_execute",
  "ai_execute",
];

const UNSAFE_PROMPT_CONTEXT_TERMS = [
  "ignore previous instructions",
  "bypass safety",
  "override owner approval",
  "skip approval",
  "execute payment",
  "send message",
  "write to database",
  "delete memory",
  "approve automatically",
  "reject automatically",
];

const ALLOWED_PROMPT_CONTEXT_VALIDATION_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "context-assembly-validation-preview",
  "context-injection-contract-preview",
  "context-injection-validation-preview",
  "prompt-context-contract-preview",
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

function getFirstArray(payload: UnknownRecord, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function normalizePromptContextBlocks(payload: UnknownRecord): CustomerMemoryPromptContextValidationBlock[] {
  const rawBlocks = getFirstArray(payload, [
    "validatedPromptContextBlocks",
    "allowedPromptContextBlocks",
    "promptContextBlocks",
  ]);

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `validated-prompt-context-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Validated prompt context block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "prompt-context-contract-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedByContract: block.validatedByContract !== false,
    promptContextAllowed: block.promptContextAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function promptContextContainsUnsafeInstruction(block: CustomerMemoryPromptContextValidationBlock): boolean {
  const normalizedValue = (block.value || "").toLowerCase();

  return UNSAFE_PROMPT_CONTEXT_TERMS.some((term) => normalizedValue.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryPromptContextValidationBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function validateCustomerMemoryPromptContextPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const promptContextBlocks = normalizePromptContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const promptContextContractDecision = asString(payload.promptContextContractDecision);

  const blockedBlocks = promptContextBlocks.filter(
    (block) =>
      block.validatedByContract === false ||
      block.promptContextAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !hasMinimumConfidence(block) ||
      promptContextContainsUnsafeInstruction(block) ||
      !ALLOWED_PROMPT_CONTEXT_VALIDATION_SOURCES.has(block.source || "prompt-context-contract-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, and conversation scope is present",
      passed: Boolean(businessId && customerId && conversationId),
      reason:
        businessId && customerId && conversationId
          ? "Prompt context validation is scoped to one business, one customer, and one conversation."
          : "Missing businessId, customerId, or conversationId blocks prompt context validation.",
    },
    {
      id: "prompt-context-contract-readiness",
      label: "Prompt context contract is ready before validation",
      passed:
        payload.isPromptContextContractReady === true ||
        promptContextContractDecision === "contract-ready" ||
        promptContextContractDecision === "passed",
      reason:
        payload.isPromptContextContractReady === true ||
        promptContextContractDecision === "contract-ready" ||
        promptContextContractDecision === "passed"
          ? "Upstream prompt context contract is marked ready for preview validation."
          : "Upstream prompt context contract is not marked ready.",
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
      label: "No message, payment, approval, prompt, or AI execution intent",
      passed:
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasPromptExecutionIntent !== true &&
        payload.hasAiModelExecutionIntent !== true,
      reason:
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasApprovalExecutionIntent === true ||
        payload.hasPromptExecutionIntent === true ||
        payload.hasAiModelExecutionIntent === true
          ? "Execution intent detected and blocked."
          : "No message sending, payment, approval, reject, prompt execution, or AI model execution intent detected.",
    },
    {
      id: "prompt-context-block-validation",
      label: "Prompt context blocks pass safety validation",
      passed: promptContextBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        promptContextBlocks.length === 0
          ? "No prompt context blocks supplied for validation."
          : blockedBlocks.length === 0
            ? "All supplied prompt context blocks pass preview validation."
            : "One or more prompt context blocks failed preview validation.",
    },
    {
      id: "risk-boundary",
      label: "No high-risk or owner-approval-only prompt context",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-only context must not enter prompt context automatically."
          : "No high-risk owner-approval boundary was crossed.",
    },
    {
      id: "prohibited-action-boundary",
      label: "No risky execution action requested",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains a prohibited execution term."
          : "No approve, reject, payment, message sending, DB write, prompt execution, AI execution, or risky execution action requested.",
    },
  ];

  const failedChecks = validationChecks.filter((check) => !check.passed);
  const validatedPromptContextBlocks = promptContextBlocks.filter((block) => !blockedBlocks.includes(block));

  return {
    day: 88,
    feature: "Backend Customer Memory Prompt Context Validator v1",
    version: "v1",
    mode: "prompt-context-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    validatedPromptContextBlocks,
    blockedPromptContextBlocks: blockedBlocks,
    contextSummary: {
      suppliedBlocks: promptContextBlocks.length,
      validatedBlocks: validatedPromptContextBlocks.length,
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
      executesPromptContext: false,
      executesAiModelCall: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this validator only to validate safe customer memory prompt context previews. Real AI prompt execution, AI model calls, real DB memory access, customer data writes, messaging, approvals, payments, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
