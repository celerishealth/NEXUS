type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryResponseDraftValidationBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedByContract?: boolean;
  responseDraftAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryResponseDraftValidationInput = {
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
  hasResponseGenerationIntent?: boolean;
  responseDraftContractDecision?: string;
  isResponseDraftContractReady?: boolean;
  proposedResponseDraftPreview?: string;
  draftText?: string;
  responseDraftPreview?: string;
  responseDraftContextBlocks?: CustomerMemoryResponseDraftValidationBlock[];
  allowedResponseDraftContextBlocks?: CustomerMemoryResponseDraftValidationBlock[];
  validatedPromptContextBlocks?: CustomerMemoryResponseDraftValidationBlock[];
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
  "model_call",
  "dispatch",
];

const UNSAFE_RESPONSE_DRAFT_TERMS = [
  "send now",
  "auto send",
  "message sent",
  "payment processed",
  "refund processed",
  "order approved automatically",
  "request rejected automatically",
  "skip owner approval",
  "bypass safety",
  "ignore safety layer",
  "write to database",
  "delete memory",
  "charge customer",
  "execute payment",
];

const ALLOWED_RESPONSE_DRAFT_VALIDATION_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "context-assembly-validation-preview",
  "context-injection-contract-preview",
  "context-injection-validation-preview",
  "prompt-context-contract-preview",
  "prompt-context-validation-preview",
  "response-draft-contract-preview",
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

function normalizeResponseDraftContextBlocks(payload: UnknownRecord): CustomerMemoryResponseDraftValidationBlock[] {
  const rawBlocks = getFirstArray(payload, [
    "responseDraftContextBlocks",
    "allowedResponseDraftContextBlocks",
    "validatedPromptContextBlocks",
  ]);

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `validated-response-draft-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Validated response draft block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "response-draft-contract-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedByContract: block.validatedByContract !== false,
    responseDraftAllowed: block.responseDraftAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function textContainsUnsafeDraftInstruction(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return UNSAFE_RESPONSE_DRAFT_TERMS.some((term) => normalizedText.includes(term));
}

function blockContainsUnsafeDraftInstruction(block: CustomerMemoryResponseDraftValidationBlock): boolean {
  return textContainsUnsafeDraftInstruction(block.value || "");
}

function hasMinimumConfidence(block: CustomerMemoryResponseDraftValidationBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function validateCustomerMemoryResponseDraftPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const responseDraftContextBlocks = normalizeResponseDraftContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const responseDraftContractDecision = asString(payload.responseDraftContractDecision);
  const proposedResponseDraftPreview =
    asString(payload.proposedResponseDraftPreview) ||
    asString(payload.draftText) ||
    asString(payload.responseDraftPreview);

  const blockedBlocks = responseDraftContextBlocks.filter(
    (block) =>
      block.validatedByContract === false ||
      block.responseDraftAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !hasMinimumConfidence(block) ||
      blockContainsUnsafeDraftInstruction(block) ||
      !ALLOWED_RESPONSE_DRAFT_VALIDATION_SOURCES.has(block.source || "response-draft-contract-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, and conversation scope is present",
      passed: Boolean(businessId && customerId && conversationId),
      reason:
        businessId && customerId && conversationId
          ? "Response draft validation is scoped to one business, one customer, and one conversation."
          : "Missing businessId, customerId, or conversationId blocks response draft validation.",
    },
    {
      id: "response-draft-contract-readiness",
      label: "Response draft contract is ready before validation",
      passed:
        payload.isResponseDraftContractReady === true ||
        responseDraftContractDecision === "contract-ready" ||
        responseDraftContractDecision === "passed",
      reason:
        payload.isResponseDraftContractReady === true ||
        responseDraftContractDecision === "contract-ready" ||
        responseDraftContractDecision === "passed"
          ? "Upstream response draft contract is marked ready for preview validation."
          : "Upstream response draft contract is not marked ready.",
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
      id: "no-execution-or-generation-intents",
      label: "No message, payment, approval, prompt, AI, generation, or sending intent",
      passed:
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasPromptExecutionIntent !== true &&
        payload.hasAiModelExecutionIntent !== true &&
        payload.hasResponseSendIntent !== true &&
        payload.hasResponseGenerationIntent !== true,
      reason:
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasApprovalExecutionIntent === true ||
        payload.hasPromptExecutionIntent === true ||
        payload.hasAiModelExecutionIntent === true ||
        payload.hasResponseSendIntent === true ||
        payload.hasResponseGenerationIntent === true
          ? "Execution, generation, or sending intent detected and blocked."
          : "No message sending, payment, approval, reject, prompt execution, AI model call, response generation, or response send intent detected.",
    },
    {
      id: "response-draft-context-validation",
      label: "Response draft context blocks pass safety validation",
      passed: responseDraftContextBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        responseDraftContextBlocks.length === 0
          ? "No response draft context blocks supplied for validation."
          : blockedBlocks.length === 0
            ? "All supplied response draft context blocks pass preview validation."
            : "One or more response draft context blocks failed preview validation.",
    },
    {
      id: "draft-preview-text-validation",
      label: "Proposed response draft preview is safe and non-sending",
      passed:
        Boolean(proposedResponseDraftPreview) &&
        !textContainsUnsafeDraftInstruction(proposedResponseDraftPreview),
      reason:
        !proposedResponseDraftPreview
          ? "No proposed response draft preview supplied for validation."
          : textContainsUnsafeDraftInstruction(proposedResponseDraftPreview)
            ? "Proposed response draft preview contains unsafe sending, payment, approval, database, or safety-bypass language."
            : "Proposed response draft preview is present and does not contain blocked execution language.",
    },
    {
      id: "risk-boundary",
      label: "No high-risk or owner-approval-only response draft",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-only response draft must not be validated for automatic use."
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
  const validatedResponseDraftContextBlocks = responseDraftContextBlocks.filter(
    (block) => !blockedBlocks.includes(block),
  );

  return {
    day: 90,
    feature: "Backend Customer Memory Response Draft Validator v1",
    version: "v1",
    mode: "response-draft-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    proposedResponseDraftPreview,
    validatedResponseDraftContextBlocks,
    blockedResponseDraftContextBlocks: blockedBlocks,
    contextSummary: {
      suppliedBlocks: responseDraftContextBlocks.length,
      validatedBlocks: validatedResponseDraftContextBlocks.length,
      blockedBlocks: blockedBlocks.length,
      hasProposedDraftPreview: Boolean(proposedResponseDraftPreview),
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
      generatesResponseDraft: false,
      sendsResponseDraft: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this validator only to validate safe customer memory response draft previews. Real AI model calls, response generation, response sending, real DB memory access, customer data writes, approvals, payments, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
