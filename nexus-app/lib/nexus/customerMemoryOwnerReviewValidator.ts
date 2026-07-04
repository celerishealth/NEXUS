type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryOwnerReviewValidationBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedByContract?: boolean;
  ownerReviewAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryOwnerReviewValidationInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  ownerReviewMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  hasRealDatabaseAccess?: boolean;
  hasWriteIntent?: boolean;
  hasCustomerDataWriteIntent?: boolean;
  hasMessageSendingIntent?: boolean;
  hasPaymentIntent?: boolean;
  hasApprovalExecutionIntent?: boolean;
  hasRejectExecutionIntent?: boolean;
  hasOwnerDecisionExecutionIntent?: boolean;
  hasPromptExecutionIntent?: boolean;
  hasAiModelExecutionIntent?: boolean;
  hasResponseGenerationIntent?: boolean;
  hasResponseSendIntent?: boolean;
  ownerReviewContractDecision?: string;
  isOwnerReviewContractReady?: boolean;
  proposedResponseDraftPreview?: string;
  responseDraftPreview?: string;
  ownerReviewInstruction?: string;
  ownerReviewContextBlocks?: CustomerMemoryOwnerReviewValidationBlock[];
  allowedOwnerReviewContextBlocks?: CustomerMemoryOwnerReviewValidationBlock[];
  validatedResponseDraftContextBlocks?: CustomerMemoryOwnerReviewValidationBlock[];
};

type ValidationCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const PROHIBITED_EXECUTION_TERMS = [
  "auto approve",
  "auto reject",
  "approve now",
  "reject now",
  "execute approval",
  "execute rejection",
  "execute payment",
  "process payment",
  "charge customer",
  "send now",
  "auto send",
  "dispatch message",
  "write to database",
  "delete memory",
  "create memory",
  "update memory",
  "bypass safety",
  "skip owner review",
  "skip owner approval",
  "override owner",
];

const ALLOWED_OWNER_REVIEW_VALIDATION_SOURCES = new Set([
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

function normalizeOwnerReviewContextBlocks(payload: UnknownRecord): CustomerMemoryOwnerReviewValidationBlock[] {
  const rawBlocks = getFirstArray(payload, [
    "ownerReviewContextBlocks",
    "allowedOwnerReviewContextBlocks",
    "validatedResponseDraftContextBlocks",
  ]);

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `validated-owner-review-context-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Validated owner review context block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "owner-review-contract-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedByContract: block.validatedByContract !== false,
    ownerReviewAllowed: block.ownerReviewAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function textContainsProhibitedExecutionTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_EXECUTION_TERMS.some((term) => normalizedText.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryOwnerReviewValidationBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function validateCustomerMemoryOwnerReviewPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const ownerReviewContextBlocks = normalizeOwnerReviewContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const ownerReviewMode = asString(payload.ownerReviewMode);
  const ownerReviewContractDecision = asString(payload.ownerReviewContractDecision);
  const proposedResponseDraftPreview =
    asString(payload.proposedResponseDraftPreview) ||
    asString(payload.responseDraftPreview);
  const ownerReviewInstruction = asString(payload.ownerReviewInstruction);

  const blockedBlocks = ownerReviewContextBlocks.filter(
    (block) =>
      block.validatedByContract === false ||
      block.ownerReviewAllowed === false ||
      block.containsSensitiveData === true ||
      !hasMinimumConfidence(block) ||
      textContainsProhibitedExecutionTerm(block.value || "") ||
      !ALLOWED_OWNER_REVIEW_VALIDATION_SOURCES.has(block.source || "owner-review-contract-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Owner review validation is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks owner review validation.",
    },
    {
      id: "owner-review-contract-readiness",
      label: "Owner review contract is ready before validation",
      passed:
        payload.isOwnerReviewContractReady === true ||
        ownerReviewContractDecision === "contract-ready" ||
        ownerReviewContractDecision === "passed",
      reason:
        payload.isOwnerReviewContractReady === true ||
        ownerReviewContractDecision === "contract-ready" ||
        ownerReviewContractDecision === "passed"
          ? "Upstream owner review contract is marked ready for preview validation."
          : "Upstream owner review contract is not marked ready.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access, customer data write, or write intent",
      passed:
        payload.hasRealDatabaseAccess !== true &&
        payload.hasWriteIntent !== true &&
        payload.hasCustomerDataWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true ||
        payload.hasWriteIntent === true ||
        payload.hasCustomerDataWriteIntent === true
          ? "Validator detected real database access, write intent, or customer data write intent."
          : "Validator remains read-only and preview-only.",
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
      id: "owner-review-context-validation",
      label: "Owner review context blocks pass validation",
      passed: ownerReviewContextBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        ownerReviewContextBlocks.length === 0
          ? "No owner review context blocks supplied for validation."
          : blockedBlocks.length === 0
            ? "All owner review context blocks pass preview validation."
            : "One or more owner review context blocks failed preview validation.",
    },
    {
      id: "draft-preview-validation",
      label: "Proposed response draft preview is present and non-executing",
      passed:
        Boolean(proposedResponseDraftPreview) &&
        !textContainsProhibitedExecutionTerm(proposedResponseDraftPreview),
      reason:
        !proposedResponseDraftPreview
          ? "No proposed response draft preview supplied for owner review validation."
          : textContainsProhibitedExecutionTerm(proposedResponseDraftPreview)
            ? "Proposed response draft preview contains prohibited execution language."
            : "Proposed response draft preview is present and remains non-executing.",
    },
    {
      id: "owner-review-instruction-validation",
      label: "Owner review instruction is manual and non-executing",
      passed:
        !ownerReviewInstruction ||
        !textContainsProhibitedExecutionTerm(ownerReviewInstruction),
      reason:
        ownerReviewInstruction && textContainsProhibitedExecutionTerm(ownerReviewInstruction)
          ? "Owner review instruction contains prohibited execution language."
          : "Owner review instruction remains manual, review-only, and non-executing.",
    },
    {
      id: "risk-routing-validation",
      label: "High-risk or approval-required cases remain routed to owner review only",
      passed:
        riskLevel !== "high" ||
        payload.ownerApprovalRequired === true ||
        ownerReviewMode === "mandatory-owner-review-preview",
      reason:
        riskLevel === "high" &&
        payload.ownerApprovalRequired !== true &&
        ownerReviewMode !== "mandatory-owner-review-preview"
          ? "High-risk case is not marked for mandatory owner review."
          : "Risk and approval boundaries remain routed to owner review without execution.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is validation-only",
      passed: !requestedAction || !textContainsProhibitedExecutionTerm(requestedAction),
      reason:
        requestedAction && textContainsProhibitedExecutionTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains validation-only and non-executing.",
    },
  ];

  const failedChecks = validationChecks.filter((check) => !check.passed);
  const validatedOwnerReviewContextBlocks = ownerReviewContextBlocks.filter(
    (block) => !blockedBlocks.includes(block),
  );

  return {
    day: 92,
    feature: "Backend Customer Memory Owner Review Validator v1",
    version: "v1",
    mode: "owner-review-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    proposedResponseDraftPreview,
    ownerReviewInstruction,
    validatedOwnerReviewContextBlocks,
    blockedOwnerReviewContextBlocks: blockedBlocks,
    ownerReviewValidation: {
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      ownerReviewMode: ownerReviewMode || "owner-review-preview",
      riskLevel: riskLevel || "unknown",
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      allowedManualReviewActions: [
        "review-preview",
        "copy-preview",
        "hold-for-later",
        "request-more-info",
        "mark-needs-owner-decision",
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
      ],
    },
    contextSummary: {
      suppliedBlocks: ownerReviewContextBlocks.length,
      validatedBlocks: validatedOwnerReviewContextBlocks.length,
      blockedBlocks: blockedBlocks.length,
      hasProposedDraftPreview: Boolean(proposedResponseDraftPreview),
      hasOwnerReviewInstruction: Boolean(ownerReviewInstruction),
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
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this validator only to validate safe owner review previews. Real approve/reject actions, owner decision execution, message sending, payments, AI model calls, response generation, DB memory access, customer data writes, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
