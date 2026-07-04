type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryContextInjectionBlock = {
  blockId?: string;
  label?: string;
  value?: string;
  source?: string;
  confidence?: number;
  injectionAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryContextInjectionContractInput = {
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
  assembledContextBlocks?: CustomerMemoryContextInjectionBlock[];
  contextBlocks?: CustomerMemoryContextInjectionBlock[];
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
];

const ALLOWED_INJECTION_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "retrieval-validator-preview",
  "context-assembly-contract-preview",
  "context-assembly-validation-preview",
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

function normalizeInjectionBlocks(payload: UnknownRecord): CustomerMemoryContextInjectionBlock[] {
  const rawBlocks =
    (Array.isArray(payload.assembledContextBlocks) && payload.assembledContextBlocks) ||
    (Array.isArray(payload.contextBlocks) && payload.contextBlocks) ||
    [];

  return rawBlocks.filter(isRecord).map((block, index) => ({
    blockId: asString(block.blockId) || `injection-block-${index + 1}`,
    label: asString(block.label) || asString(block.key) || `Context injection block ${index + 1}`,
    value: asString(block.value) || asString(block.summary),
    source: asString(block.source) || "safe-preview",
    confidence: asNumber(block.confidence) ?? 0,
    injectionAllowed: block.injectionAllowed !== false,
    containsSensitiveData: block.containsSensitiveData === true,
    requiresOwnerApproval: block.requiresOwnerApproval === true,
  }));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

export function createCustomerMemoryContextInjectionContract(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const injectionBlocks = normalizeInjectionBlocks(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();

  const blockedBlocks = injectionBlocks.filter(
    (block) =>
      block.injectionAllowed === false ||
      block.containsSensitiveData === true ||
      block.requiresOwnerApproval === true ||
      !ALLOWED_INJECTION_SOURCES.has(block.source || "safe-preview"),
  );

  const contractChecks: ContractCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, and conversation scope is present",
      passed: Boolean(businessId && customerId && conversationId),
      reason:
        businessId && customerId && conversationId
          ? "Context injection preview is scoped to one business, one customer, and one conversation."
          : "Missing businessId, customerId, or conversationId blocks context injection.",
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
      id: "no-message-or-payment-intent",
      label: "No message sending or payment intent",
      passed: payload.hasMessageSendingIntent !== true && payload.hasPaymentIntent !== true,
      reason:
        payload.hasMessageSendingIntent === true || payload.hasPaymentIntent === true
          ? "Message sending or payment intent is blocked."
          : "No message sending or payment execution intent detected.",
    },
    {
      id: "context-injection-block-safety",
      label: "Context blocks are safe for prompt injection preview",
      passed: injectionBlocks.length > 0 && blockedBlocks.length === 0,
      reason:
        injectionBlocks.length === 0
          ? "No assembled context blocks supplied for injection contract."
          : blockedBlocks.length === 0
            ? "All assembled context blocks pass injection contract safety checks."
            : "One or more assembled context blocks failed injection contract safety checks.",
    },
    {
      id: "owner-approval-boundary",
      label: "No high-risk or owner-approval-only context",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-only context must not be injected automatically."
          : "No owner-approval-only boundary was crossed.",
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

  const failedChecks = contractChecks.filter((check) => !check.passed);
  const allowedInjectionBlocks = injectionBlocks.filter((block) => !blockedBlocks.includes(block));

  return {
    day: 85,
    feature: "Backend Customer Memory Context Injection Contract v1",
    version: "v1",
    mode: "context-injection-contract-preview-only",
    isContractReady: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "contract-ready" : "contract-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    contractChecks,
    injectionContract: {
      scope: {
        businessId,
        customerId,
        conversationId,
      },
      allowedInjectionBlocks,
      blockedInjectionBlocks: blockedBlocks,
      promptInjectionRules: [
        "Use customer memory only as safe context.",
        "Never override owner approval.",
        "Never execute payments, refunds, approvals, rejections, or message sending.",
        "Never write customer data or memory records.",
        "Never read real database memory from this preview contract.",
        "Keep final AI output inside the locked NEXUS Safety Layer.",
      ],
    },
    contextSummary: {
      suppliedBlocks: injectionBlocks.length,
      allowedBlocks: allowedInjectionBlocks.length,
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
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this contract only to preview safe customer memory context injection rules. Real prompt injection, real DB memory access, customer data writes, messaging, approvals, payments, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
