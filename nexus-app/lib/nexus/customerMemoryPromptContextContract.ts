type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryPromptContextBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedForInjection?: boolean;
  promptContextAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryPromptContextContractInput = {
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
  injectionValidationDecision?: string;
  isInjectionValid?: boolean;
  validatedInjectionBlocks?: CustomerMemoryPromptContextBlock[];
  injectionBlocks?: CustomerMemoryPromptContextBlock[];
  contextBlocks?: CustomerMemoryPromptContextBlock[];
};

type ContractCheck = {
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
];

const ALLOWED_PROMPT_CONTEXT_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "context-assembly-validation-preview",
  "context-injection-contract-preview",
  "context-injection-validation-preview",
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

function normalizePromptContextBlocks(payload: UnknownRecord): CustomerMemoryPromptContextBlock[] {
  const rawBlocks =
    (Array.isArray(payload.validatedInjectionBlocks) && payload.validatedInjectionBlocks) ||
    (Array.isArray(payload.injectionBlocks) && payload.injectionBlocks) ||
    (Array.isArray(payload.contextBlocks) && payload.contextBlocks) ||
    [];

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `prompt-context-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Prompt context block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "context-injection-validation-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedForInjection: block.validatedForInjection !== false,
    promptContextAllowed: block.promptContextAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryPromptContextBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function createCustomerMemoryPromptContextContract(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const promptContextBlocks = normalizePromptContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const injectionValidationDecision = asString(payload.injectionValidationDecision);

  const blockedBlocks = promptContextBlocks.filter(
    (block) =>
      block.validatedForInjection === false ||
      block.promptContextAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !hasMinimumConfidence(block) ||
      !ALLOWED_PROMPT_CONTEXT_SOURCES.has(block.source || "context-injection-validation-preview"),
  );

  const contractChecks: ContractCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, and conversation scope is present",
      passed: Boolean(businessId && customerId && conversationId),
      reason:
        businessId && customerId && conversationId
          ? "Prompt context contract is scoped to one business, one customer, and one conversation."
          : "Missing businessId, customerId, or conversationId blocks prompt context contract.",
    },
    {
      id: "injection-validation-readiness",
      label: "Context injection validation passed before prompt context contract",
      passed:
        payload.isInjectionValid === true ||
        injectionValidationDecision === "passed" ||
        injectionValidationDecision === "valid",
      reason:
        payload.isInjectionValid === true ||
        injectionValidationDecision === "passed" ||
        injectionValidationDecision === "valid"
          ? "Upstream context injection validation is marked safe for prompt context preview."
          : "Upstream context injection validation is not marked safe.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access or write intent",
      passed: payload.hasRealDatabaseAccess !== true && payload.hasWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true || payload.hasWriteIntent === true
          ? "Contract detected real database access or write intent."
          : "Contract remains read-only and preview-only.",
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
      id: "prompt-context-block-contract",
      label: "Prompt context blocks are safe for preview contract",
      passed: promptContextBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        promptContextBlocks.length === 0
          ? "No validated context blocks supplied for prompt context contract."
          : blockedBlocks.length === 0
            ? "All prompt context blocks pass contract safety checks."
            : "One or more prompt context blocks failed contract safety checks.",
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
          : "No approve, reject, payment, message sending, DB write, prompt execution, or risky execution action requested.",
    },
  ];

  const failedChecks = contractChecks.filter((check) => !check.passed);
  const allowedPromptContextBlocks = promptContextBlocks.filter((block) => !blockedBlocks.includes(block));

  return {
    day: 87,
    feature: "Backend Customer Memory Prompt Context Contract v1",
    version: "v1",
    mode: "prompt-context-contract-preview-only",
    isContractReady: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "contract-ready" : "contract-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    contractChecks,
    promptContextContract: {
      scope: {
        businessId,
        customerId,
        conversationId,
      },
      promptContextMode: asString(payload.promptContextMode) || "safe-preview",
      allowedPromptContextBlocks,
      blockedPromptContextBlocks: blockedBlocks,
      promptContextRules: [
        "Use validated customer memory only as non-executing context.",
        "Never override Owner Approval.",
        "Never bypass the Safety Layer.",
        "Never execute payments, refunds, approvals, rejections, or message sending.",
        "Never write customer data or memory records.",
        "Never read real database memory from this preview contract.",
        "Never execute the prompt context from this contract.",
        "Keep all future AI output inside Zero Damage and Zero Stop boundaries.",
      ],
    },
    contextSummary: {
      suppliedBlocks: promptContextBlocks.length,
      allowedBlocks: allowedPromptContextBlocks.length,
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
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this contract only to preview safe customer memory prompt context rules. Real AI prompt execution, real DB memory access, customer data writes, messaging, approvals, payments, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
