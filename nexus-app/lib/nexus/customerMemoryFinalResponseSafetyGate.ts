type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryFinalResponseSafetyBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedByOwnerReview?: boolean;
  finalResponseAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryFinalResponseSafetyGateInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  finalResponseMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  ownerReviewValidationDecision?: string;
  isOwnerReviewValid?: boolean;
  proposedFinalResponsePreview?: string;
  finalResponsePreview?: string;
  proposedResponseDraftPreview?: string;
  hasRealDatabaseAccess?: boolean;
  hasWriteIntent?: boolean;
  hasCustomerDataWriteIntent?: boolean;
  hasMemoryWriteIntent?: boolean;
  hasMessageSendingIntent?: boolean;
  hasPaymentIntent?: boolean;
  hasApprovalExecutionIntent?: boolean;
  hasRejectExecutionIntent?: boolean;
  hasOwnerDecisionExecutionIntent?: boolean;
  hasPromptExecutionIntent?: boolean;
  hasAiModelExecutionIntent?: boolean;
  hasResponseGenerationIntent?: boolean;
  hasResponseSendIntent?: boolean;
  finalResponseSafetyBlocks?: CustomerMemoryFinalResponseSafetyBlock[];
  validatedOwnerReviewContextBlocks?: CustomerMemoryFinalResponseSafetyBlock[];
  ownerReviewContextBlocks?: CustomerMemoryFinalResponseSafetyBlock[];
};

type SafetyCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const PROHIBITED_FINAL_RESPONSE_TERMS = [
  "message sent",
  "sent successfully",
  "payment processed",
  "refund processed",
  "charged successfully",
  "approved automatically",
  "rejected automatically",
  "approved now",
  "rejected now",
  "order confirmed without approval",
  "skip owner approval",
  "bypass safety",
  "ignore safety layer",
  "write to database",
  "memory updated",
  "customer data updated",
  "execute payment",
  "auto send",
  "send now",
];

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
  "owner_decision_execute",
];

const ALLOWED_FINAL_RESPONSE_SOURCES = new Set([
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
  "response-draft-validation-preview",
  "owner-review-contract-preview",
  "owner-review-validation-preview",
  "final-response-safety-gate-preview",
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

function normalizeFinalResponseSafetyBlocks(payload: UnknownRecord): CustomerMemoryFinalResponseSafetyBlock[] {
  const rawBlocks = getFirstArray(payload, [
    "finalResponseSafetyBlocks",
    "validatedOwnerReviewContextBlocks",
    "ownerReviewContextBlocks",
  ]);

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `final-response-safety-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Final response safety block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "owner-review-validation-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedByOwnerReview: block.validatedByOwnerReview !== false,
    finalResponseAllowed: block.finalResponseAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function textContainsProhibitedFinalResponseTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_FINAL_RESPONSE_TERMS.some((term) => normalizedText.includes(term));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryFinalResponseSafetyBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function runCustomerMemoryFinalResponseSafetyGate(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const safetyBlocks = normalizeFinalResponseSafetyBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const ownerReviewValidationDecision = asString(payload.ownerReviewValidationDecision);
  const proposedFinalResponsePreview =
    asString(payload.proposedFinalResponsePreview) ||
    asString(payload.finalResponsePreview) ||
    asString(payload.proposedResponseDraftPreview);

  const blockedBlocks = safetyBlocks.filter(
    (block) =>
      block.validatedByOwnerReview === false ||
      block.finalResponseAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !hasMinimumConfidence(block) ||
      textContainsProhibitedFinalResponseTerm(block.value || "") ||
      !ALLOWED_FINAL_RESPONSE_SOURCES.has(block.source || "owner-review-validation-preview"),
  );

  const safetyChecks: SafetyCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Final response safety gate is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks final response safety gate.",
    },
    {
      id: "owner-review-validation-readiness",
      label: "Owner review validation passed before final response safety gate",
      passed:
        payload.isOwnerReviewValid === true ||
        ownerReviewValidationDecision === "passed" ||
        ownerReviewValidationDecision === "valid",
      reason:
        payload.isOwnerReviewValid === true ||
        ownerReviewValidationDecision === "passed" ||
        ownerReviewValidationDecision === "valid"
          ? "Upstream owner review validation is marked safe for final response safety preview."
          : "Upstream owner review validation is not marked safe.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access, customer data write, memory write, or write intent",
      passed:
        payload.hasRealDatabaseAccess !== true &&
        payload.hasWriteIntent !== true &&
        payload.hasCustomerDataWriteIntent !== true &&
        payload.hasMemoryWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true ||
        payload.hasWriteIntent === true ||
        payload.hasCustomerDataWriteIntent === true ||
        payload.hasMemoryWriteIntent === true
          ? "Gate detected real database access, customer data write, memory write, or write intent."
          : "Gate remains read-only and preview-only.",
    },
    {
      id: "no-execution-intents",
      label: "No approve, reject, owner decision, message, payment, prompt, AI, generation, or sending execution intent",
      passed:
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasRejectExecutionIntent !== true &&
        payload.hasOwnerDecisionExecutionIntent !== true &&
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasPromptExecutionIntent !== true &&
        payload.hasAiModelExecutionIntent !== true &&
        payload.hasResponseGenerationIntent !== true &&
        payload.hasResponseSendIntent !== true,
      reason:
        payload.hasApprovalExecutionIntent === true ||
        payload.hasRejectExecutionIntent === true ||
        payload.hasOwnerDecisionExecutionIntent === true ||
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasPromptExecutionIntent === true ||
        payload.hasAiModelExecutionIntent === true ||
        payload.hasResponseGenerationIntent === true ||
        payload.hasResponseSendIntent === true
          ? "Execution, owner decision, generation, sending, approval, rejection, or payment intent detected and blocked."
          : "No approve, reject, owner decision execution, message sending, payment, prompt execution, AI model call, response generation, or response send intent detected.",
    },
    {
      id: "final-response-context-safety",
      label: "Final response safety blocks pass validation",
      passed: safetyBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        safetyBlocks.length === 0
          ? "No final response safety blocks supplied for validation."
          : blockedBlocks.length === 0
            ? "All final response safety blocks pass preview validation."
            : "One or more final response safety blocks failed preview validation.",
    },
    {
      id: "final-response-preview-safety",
      label: "Final response preview is present and non-executing",
      passed:
        Boolean(proposedFinalResponsePreview) &&
        !textContainsProhibitedFinalResponseTerm(proposedFinalResponsePreview),
      reason:
        !proposedFinalResponsePreview
          ? "No proposed final response preview supplied for safety gate."
          : textContainsProhibitedFinalResponseTerm(proposedFinalResponsePreview)
            ? "Proposed final response preview contains prohibited execution, sending, payment, approval, database, or safety-bypass language."
            : "Proposed final response preview is present and remains non-executing.",
    },
    {
      id: "risk-boundary",
      label: "Final response preview is not high-risk or owner-approval-pending",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-pending response cannot pass the final safety gate automatically."
          : "No high-risk or owner-approval-pending boundary was crossed.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is safety-gate-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains safety-gate-only and non-executing.",
    },
  ];

  const failedChecks = safetyChecks.filter((check) => !check.passed);
  const passedSafetyBlocks = safetyBlocks.filter((block) => !blockedBlocks.includes(block));

  return {
    day: 93,
    feature: "Backend Customer Memory Final Response Safety Gate v1",
    version: "v1",
    mode: "final-response-safety-gate-preview-only",
    isSafeForPreview: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "safe-preview" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    safetyChecks,
    proposedFinalResponsePreview,
    finalResponseSafetyGate: {
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      finalResponseMode: asString(payload.finalResponseMode) || "safe-preview",
      riskLevel: riskLevel || "unknown",
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      passedSafetyBlocks,
      blockedSafetyBlocks: blockedBlocks,
      allowedFinalPreviewActions: [
        "view-preview",
        "copy-preview",
        "hold-for-owner",
        "request-more-info",
        "send-to-future-audit-preview",
      ],
      blockedExecutionActions: [
        "approve-execution",
        "reject-execution",
        "message-send",
        "payment-execution",
        "customer-data-write",
        "memory-write",
        "ai-model-call",
        "response-generation",
        "response-send",
        "owner-decision-execution",
      ],
    },
    contextSummary: {
      suppliedBlocks: safetyBlocks.length,
      passedBlocks: passedSafetyBlocks.length,
      blockedBlocks: blockedBlocks.length,
      hasFinalResponsePreview: Boolean(proposedFinalResponsePreview),
    },
    lockedSafetyBoundary: {
      readsRealDatabaseMemory: false,
      writesCustomerMemory: false,
      createsMemoryRecords: false,
      updatesMemoryRecords: false,
      deletesMemoryRecords: false,
      writesCustomerData: false,
      approvesOrRejects: false,
      executesOwnerDecision: false,
      executesPayments: false,
      sendsMessages: false,
      executesPromptContext: false,
      executesAiModelCall: false,
      generatesResponseDraft: false,
      sendsResponseDraft: false,
      sendsFinalResponse: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this gate only to preview whether a customer memory response is safe for future handling. Real approve/reject actions, owner decision execution, message sending, payments, AI model calls, response generation, DB memory access, customer data writes, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
