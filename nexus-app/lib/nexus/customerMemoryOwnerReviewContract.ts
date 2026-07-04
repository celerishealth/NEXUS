type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryOwnerReviewContextBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  validatedForOwnerReview?: boolean;
  ownerReviewAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryOwnerReviewContractInput = {
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
  hasMessageSendingIntent?: boolean;
  hasPaymentIntent?: boolean;
  hasApprovalExecutionIntent?: boolean;
  hasRejectExecutionIntent?: boolean;
  hasPromptExecutionIntent?: boolean;
  hasAiModelExecutionIntent?: boolean;
  hasResponseGenerationIntent?: boolean;
  hasResponseSendIntent?: boolean;
  responseDraftValidationDecision?: string;
  isResponseDraftValid?: boolean;
  proposedResponseDraftPreview?: string;
  responseDraftPreview?: string;
  ownerReviewContextBlocks?: CustomerMemoryOwnerReviewContextBlock[];
  validatedResponseDraftContextBlocks?: CustomerMemoryOwnerReviewContextBlock[];
  contextBlocks?: CustomerMemoryOwnerReviewContextBlock[];
};

type ContractCheck = {
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
];

const ALLOWED_OWNER_REVIEW_SOURCES = new Set([
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

function normalizeOwnerReviewContextBlocks(payload: UnknownRecord): CustomerMemoryOwnerReviewContextBlock[] {
  const rawBlocks = getFirstArray(payload, [
    "ownerReviewContextBlocks",
    "validatedResponseDraftContextBlocks",
    "contextBlocks",
  ]);

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `owner-review-context-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Owner review context block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "response-draft-validation-preview",
    confidence: asNumber(block.confidence) ?? 0,
    validatedForOwnerReview: block.validatedForOwnerReview !== false,
    ownerReviewAllowed: block.ownerReviewAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function textContainsProhibitedExecutionTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_EXECUTION_TERMS.some((term) => normalizedText.includes(term));
}

function hasMinimumConfidence(block: CustomerMemoryOwnerReviewContextBlock): boolean {
  return typeof block.confidence === "number" && block.confidence >= 0.5;
}

export function createCustomerMemoryOwnerReviewContract(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const ownerReviewContextBlocks = normalizeOwnerReviewContextBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const responseDraftValidationDecision = asString(payload.responseDraftValidationDecision);
  const proposedResponseDraftPreview =
    asString(payload.proposedResponseDraftPreview) ||
    asString(payload.responseDraftPreview);

  const blockedBlocks = ownerReviewContextBlocks.filter(
    (block) =>
      block.validatedForOwnerReview === false ||
      block.ownerReviewAllowed === false ||
      block.containsSensitiveData === true ||
      !hasMinimumConfidence(block) ||
      textContainsProhibitedExecutionTerm(block.value || "") ||
      !ALLOWED_OWNER_REVIEW_SOURCES.has(block.source || "response-draft-validation-preview"),
  );

  const contractChecks: ContractCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Owner review contract is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks owner review contract.",
    },
    {
      id: "response-draft-validation-readiness",
      label: "Response draft validation passed before owner review contract",
      passed:
        payload.isResponseDraftValid === true ||
        responseDraftValidationDecision === "passed" ||
        responseDraftValidationDecision === "valid",
      reason:
        payload.isResponseDraftValid === true ||
        responseDraftValidationDecision === "passed" ||
        responseDraftValidationDecision === "valid"
          ? "Upstream response draft validation is marked safe for owner review contract preview."
          : "Upstream response draft validation is not marked safe.",
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
      label: "No approve, reject, message, payment, prompt, AI, generation, or sending execution intent",
      passed:
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasRejectExecutionIntent !== true &&
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasPromptExecutionIntent !== true &&
        payload.hasAiModelExecutionIntent !== true &&
        payload.hasResponseGenerationIntent !== true &&
        payload.hasResponseSendIntent !== true,
      reason:
        payload.hasApprovalExecutionIntent === true ||
        payload.hasRejectExecutionIntent === true ||
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasPromptExecutionIntent === true ||
        payload.hasAiModelExecutionIntent === true ||
        payload.hasResponseGenerationIntent === true ||
        payload.hasResponseSendIntent === true
          ? "Execution, generation, sending, approve, reject, or payment intent detected and blocked."
          : "No approve, reject, message sending, payment, prompt execution, AI model call, response generation, or response send intent detected.",
    },
    {
      id: "owner-review-context-contract",
      label: "Owner review context blocks are safe for preview contract",
      passed: ownerReviewContextBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        ownerReviewContextBlocks.length === 0
          ? "No validated response draft context blocks supplied for owner review contract."
          : blockedBlocks.length === 0
            ? "All owner review context blocks pass contract safety checks."
            : "One or more owner review context blocks failed contract safety checks.",
    },
    {
      id: "draft-preview-present",
      label: "Proposed response draft preview is present and non-executing",
      passed:
        Boolean(proposedResponseDraftPreview) &&
        !textContainsProhibitedExecutionTerm(proposedResponseDraftPreview),
      reason:
        !proposedResponseDraftPreview
          ? "No proposed response draft preview supplied for owner review."
          : textContainsProhibitedExecutionTerm(proposedResponseDraftPreview)
            ? "Proposed response draft preview contains prohibited execution language."
            : "Proposed response draft preview is present and remains non-executing.",
    },
    {
      id: "owner-review-required-routing",
      label: "High-risk or approval-required items route to owner review only",
      passed:
        riskLevel !== "high" ||
        payload.ownerApprovalRequired === true ||
        asString(payload.ownerReviewMode) === "mandatory-owner-review-preview",
      reason:
        riskLevel === "high" &&
        payload.ownerApprovalRequired !== true &&
        asString(payload.ownerReviewMode) !== "mandatory-owner-review-preview"
          ? "High-risk item must be routed to mandatory owner review."
          : "Risk and approval boundaries are routed to owner review without execution.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is review-only",
      passed: !requestedAction || !textContainsProhibitedExecutionTerm(requestedAction),
      reason:
        requestedAction && textContainsProhibitedExecutionTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains review-only and non-executing.",
    },
  ];

  const failedChecks = contractChecks.filter((check) => !check.passed);
  const allowedOwnerReviewContextBlocks = ownerReviewContextBlocks.filter(
    (block) => !blockedBlocks.includes(block),
  );

  return {
    day: 91,
    feature: "Backend Customer Memory Owner Review Contract v1",
    version: "v1",
    mode: "owner-review-contract-preview-only",
    isContractReady: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "contract-ready" : "contract-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    contractChecks,
    ownerReviewContract: {
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      ownerReviewMode: asString(payload.ownerReviewMode) || "owner-review-preview",
      riskLevel: riskLevel || "unknown",
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      proposedResponseDraftPreview,
      allowedOwnerReviewContextBlocks,
      blockedOwnerReviewContextBlocks: blockedBlocks,
      ownerReviewRules: [
        "Prepare only a non-executing owner review contract preview.",
        "Never approve or reject from this contract.",
        "Never send WhatsApp, email, SMS, or any outbound message.",
        "Never execute payments, refunds, approvals, rejections, or risky actions.",
        "Never call an AI model from this contract.",
        "Never generate or send a response from this contract.",
        "Never write customer data or memory records.",
        "Never read real database memory from this preview contract.",
        "Route high-risk and owner-approval-required items to manual owner review only.",
        "Keep all future owner decisions inside Safety Layer, Audit Log, and Zero Damage boundaries.",
      ],
    },
    contextSummary: {
      suppliedBlocks: ownerReviewContextBlocks.length,
      allowedBlocks: allowedOwnerReviewContextBlocks.length,
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
      executesOwnerDecision: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this contract only to preview safe owner review routing for customer memory response drafts. Real approve/reject actions, message sending, payments, AI model calls, response generation, DB memory access, customer data writes, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
