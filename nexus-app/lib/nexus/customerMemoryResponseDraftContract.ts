type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryResponseDraftContextBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedPromptContext?: boolean;
  responseDraftAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryResponseDraftContractInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  responseDraftMode?: string;
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
  hasResponseSendIntent?: boolean;
  promptContextValidationDecision?: string;
  isPromptContextValid?: boolean;
  validatedPromptContextBlocks?: CustomerMemoryResponseDraftContextBlock[];
  promptContextBlocks?: CustomerMemoryResponseDraftContextBlock[];
  contextBlocks?: CustomerMemoryResponseDraftContextBlock[];
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
  "ai_execute",
  "model_call",
];

const UNSAFE_RESPONSE_DRAFT_TERMS = [
  "send now",
  "auto send",
  "execute payment",
  "charge customer",
  "approve automatically",
  "reject automatically",
  "skip owner approval",
  "bypass safety",
  "write to database",
  "delete memory",
  "ignore safety layer",
];

const ALLOWED_RESPONSE_DRAFT_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "context-assembly-validation-preview",
  "context-injection-contract-preview",
  "context-injection-validation-preview",
  "prompt-context-contract-preview",
  "prompt-context-validation-preview",
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

function normalizeResponseDraftContextBlocks(payload: UnknownRecord): CustomerMemoryResponseDraftContextBlock[] {
  const rawBlocks = getFirstArray(payload, [
    "validatedPromptContextBlocks",
    "promptContextBlocks",
    "contextBlocks",
  ]);

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `response-draft-context-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Response draft context block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "prompt-context-validation-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedPromptContext: block.validatedPromptContext !== false,
    responseDraftAllowed: block.responseDraftAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function blockContainsUnsafeDraftInstruction(block: CustomerMemoryResponseDraftContextBlock): boolean {
  const normalizedValue = (block.value || "").toLowerCase();

  return UNSAFE_RESPONSE_DRAFT_TERMS.some((term) => normalizedValue.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryResponseDraftContextBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function createCustomerMemoryResponseDraftContract(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const responseDraftContextBlocks = normalizeResponseDraftContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const promptContextValidationDecision = asString(payload.promptContextValidationDecision);

  const blockedBlocks = responseDraftContextBlocks.filter(
    (block) =>
      block.validatedPromptContext === false ||
      block.responseDraftAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !hasMinimumConfidence(block) ||
      blockContainsUnsafeDraftInstruction(block) ||
      !ALLOWED_RESPONSE_DRAFT_SOURCES.has(block.source || "prompt-context-validation-preview"),
  );

  const contractChecks: ContractCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, and conversation scope is present",
      passed: Boolean(businessId && customerId && conversationId),
      reason:
        businessId && customerId && conversationId
          ? "Response draft contract is scoped to one business, one customer, and one conversation."
          : "Missing businessId, customerId, or conversationId blocks response draft contract.",
    },
    {
      id: "prompt-context-validation-readiness",
      label: "Prompt context validation passed before response draft contract",
      passed:
        payload.isPromptContextValid === true ||
        promptContextValidationDecision === "passed" ||
        promptContextValidationDecision === "valid",
      reason:
        payload.isPromptContextValid === true ||
        promptContextValidationDecision === "passed" ||
        promptContextValidationDecision === "valid"
          ? "Upstream prompt context validation is marked safe for response draft contract preview."
          : "Upstream prompt context validation is not marked safe.",
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
      label: "No message, payment, approval, prompt, AI, or response send intent",
      passed:
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasPromptExecutionIntent !== true &&
        payload.hasAiModelExecutionIntent !== true &&
        payload.hasResponseSendIntent !== true,
      reason:
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasApprovalExecutionIntent === true ||
        payload.hasPromptExecutionIntent === true ||
        payload.hasAiModelExecutionIntent === true ||
        payload.hasResponseSendIntent === true
          ? "Execution or sending intent detected and blocked."
          : "No message sending, payment, approval, reject, prompt execution, AI model call, or response send intent detected.",
    },
    {
      id: "response-draft-context-contract",
      label: "Response draft context blocks are safe for preview contract",
      passed: responseDraftContextBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        responseDraftContextBlocks.length === 0
          ? "No validated prompt context blocks supplied for response draft contract."
          : blockedBlocks.length === 0
            ? "All response draft context blocks pass contract safety checks."
            : "One or more response draft context blocks failed contract safety checks.",
    },
    {
      id: "risk-boundary",
      label: "No high-risk or owner-approval-only response draft context",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-only context must not enter response drafting automatically."
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

  const failedChecks = contractChecks.filter((check) => !check.passed);
  const allowedResponseDraftContextBlocks = responseDraftContextBlocks.filter(
    (block) => !blockedBlocks.includes(block),
  );

  return {
    day: 89,
    feature: "Backend Customer Memory Response Draft Contract v1",
    version: "v1",
    mode: "response-draft-contract-preview-only",
    isContractReady: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "contract-ready" : "contract-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    contractChecks,
    responseDraftContract: {
      scope: {
        businessId,
        customerId,
        conversationId,
      },
      responseDraftMode: asString(payload.responseDraftMode) || "safe-preview",
      allowedResponseDraftContextBlocks,
      blockedResponseDraftContextBlocks: blockedBlocks,
      responseDraftRules: [
        "Prepare only a non-sending response draft contract preview.",
        "Never call an AI model from this contract.",
        "Never send WhatsApp, email, SMS, or any outbound message.",
        "Never override Owner Approval.",
        "Never bypass the Safety Layer.",
        "Never execute payments, refunds, approvals, rejections, or risky actions.",
        "Never write customer data or memory records.",
        "Never read real database memory from this preview contract.",
        "Keep all future response drafting inside Zero Damage and Zero Stop boundaries.",
      ],
    },
    contextSummary: {
      suppliedBlocks: responseDraftContextBlocks.length,
      allowedBlocks: allowedResponseDraftContextBlocks.length,
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
      sendsResponseDraft: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this contract only to preview safe customer memory response draft rules. Real AI model calls, real response drafting, message sending, real DB memory access, customer data writes, approvals, payments, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
