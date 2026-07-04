type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryAuditEventSubject = {
  subjectId?: string;
  subjectType?: string;
  label?: string;
  source?: string;
  riskLevel?: string;
  decision?: string;
  confidence?: number;
  auditAllowed?: boolean;
  containsSensitiveData?: boolean;
};

export type CustomerMemoryAuditEventContractInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  auditEventType?: string;
  auditMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  safetyDecision?: string;
  ownerApprovalRequired?: boolean;
  finalResponseSafetyGateDecision?: string;
  isFinalResponseSafeForPreview?: boolean;
  proposedFinalResponsePreview?: string;
  finalResponsePreview?: string;
  hasRealDatabaseAccess?: boolean;
  hasAuditWriteIntent?: boolean;
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
  auditSubjects?: CustomerMemoryAuditEventSubject[];
  finalResponseSafetyBlocks?: CustomerMemoryAuditEventSubject[];
  contextBlocks?: CustomerMemoryAuditEventSubject[];
};

type ContractCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const ALLOWED_AUDIT_EVENT_TYPES = new Set([
  "customer-memory-preview",
  "customer-memory-blocked",
  "response-safety-preview",
  "owner-review-preview",
  "risk-blocked-preview",
  "final-response-safety-preview",
  "manual-review-required-preview",
]);

const ALLOWED_AUDIT_SOURCES = new Set([
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
  "audit-event-contract-preview",
]);

const PROHIBITED_AUDIT_ACTION_TERMS = [
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
  "audit_write",
  "memory_delete",
  "customer_data_write",
  "execute",
  "prompt_execute",
  "ai_execute",
  "model_call",
  "owner_decision_execute",
];

const PROHIBITED_AUDIT_TEXT_TERMS = [
  "message sent",
  "payment processed",
  "refund processed",
  "approved automatically",
  "rejected automatically",
  "write to database",
  "memory updated",
  "audit persisted",
  "customer data updated",
  "execute payment",
  "auto send",
  "send now",
  "bypass safety",
  "skip audit",
];

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

function normalizeAuditSubjects(payload: UnknownRecord): CustomerMemoryAuditEventSubject[] {
  const rawSubjects = getFirstArray(payload, [
    "auditSubjects",
    "finalResponseSafetyBlocks",
    "contextBlocks",
  ]);

  return rawSubjects.filter(isRecord).map((subject, index) => ({
    subjectId: asString(subject.subjectId) || asString(subject.blockId) || `audit-subject-${index + 1}`,
    subjectType: asString(subject.subjectType) || "customer-memory-safety-preview",
    label: asString(subject.label) || asString(subject.key) || `Audit subject ${index + 1}`,
    source: asString(subject.source) || "final-response-safety-gate-preview",
    riskLevel: asString(subject.riskLevel) || "low",
    decision: asString(subject.decision) || "preview",
    confidence: asNumber(subject.confidence) ?? 0,
    auditAllowed: subject.auditAllowed !== false,
    containsSensitiveData: subject.containsSensitiveData === true,
  }));
}

function textContainsProhibitedAuditTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_AUDIT_TEXT_TERMS.some((term) => normalizedText.includes(term));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_AUDIT_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(subject: CustomerMemoryAuditEventSubject): boolean {
  return typeof subject.confidence === "number" && subject.confidence >= 0.5;
}

function createDeterministicAuditEventId(
  businessId: string,
  customerId: string,
  conversationId: string,
  auditEventType: string,
): string {
  const safeBusinessId = businessId || "missing-business";
  const safeCustomerId = customerId || "missing-customer";
  const safeConversationId = conversationId || "missing-conversation";
  const safeAuditEventType = auditEventType || "missing-event-type";

  return [
    "audit-preview",
    safeBusinessId,
    safeCustomerId,
    safeConversationId,
    safeAuditEventType,
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

export function createCustomerMemoryAuditEventContract(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const auditSubjects = normalizeAuditSubjects(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const auditEventType = asString(payload.auditEventType) || "final-response-safety-preview";
  const auditMode = asString(payload.auditMode) || "audit-event-contract-preview";
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const safetyDecision = asString(payload.safetyDecision) || asString(payload.finalResponseSafetyGateDecision);
  const proposedFinalResponsePreview =
    asString(payload.proposedFinalResponsePreview) ||
    asString(payload.finalResponsePreview);

  const blockedSubjects = auditSubjects.filter(
    (subject) =>
      subject.auditAllowed === false ||
      subject.containsSensitiveData === true ||
      !hasMinimumConfidence(subject) ||
      textContainsProhibitedAuditTerm(subject.label || "") ||
      textContainsProhibitedAuditTerm(subject.decision || "") ||
      !ALLOWED_AUDIT_SOURCES.has(subject.source || "final-response-safety-gate-preview"),
  );

  const contractChecks: ContractCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Audit event contract is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks audit event contract.",
    },
    {
      id: "audit-event-type",
      label: "Audit event type is allowed",
      passed: ALLOWED_AUDIT_EVENT_TYPES.has(auditEventType),
      reason: ALLOWED_AUDIT_EVENT_TYPES.has(auditEventType)
        ? "Audit event type is approved for preview contract use."
        : "Audit event type is not approved for preview contract use.",
    },
    {
      id: "final-response-safety-readiness",
      label: "Final response safety gate is available before audit event contract",
      passed:
        payload.isFinalResponseSafeForPreview === true ||
        safetyDecision === "safe-preview" ||
        safetyDecision === "blocked",
      reason:
        payload.isFinalResponseSafeForPreview === true ||
        safetyDecision === "safe-preview" ||
        safetyDecision === "blocked"
          ? "Final response safety gate decision is available for audit preview."
          : "Final response safety gate decision is missing.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access, audit write, customer data write, memory write, or write intent",
      passed:
        payload.hasRealDatabaseAccess !== true &&
        payload.hasAuditWriteIntent !== true &&
        payload.hasWriteIntent !== true &&
        payload.hasCustomerDataWriteIntent !== true &&
        payload.hasMemoryWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true ||
        payload.hasAuditWriteIntent === true ||
        payload.hasWriteIntent === true ||
        payload.hasCustomerDataWriteIntent === true ||
        payload.hasMemoryWriteIntent === true
          ? "Contract detected real database access, audit write intent, customer data write, memory write, or write intent."
          : "Contract remains read-only, preview-only, and does not persist audit events.",
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
      id: "audit-subject-contract",
      label: "Audit subjects are safe for preview contract",
      passed: auditSubjects.length > 0 && blockedSubjects.length === 0,
      reason:
        auditSubjects.length === 0
          ? "No audit subjects supplied for audit event contract."
          : blockedSubjects.length === 0
            ? "All audit subjects pass preview contract checks."
            : "One or more audit subjects failed preview contract checks.",
    },
    {
      id: "final-response-preview-boundary",
      label: "Final response preview is non-executing when present",
      passed:
        !proposedFinalResponsePreview ||
        !textContainsProhibitedAuditTerm(proposedFinalResponsePreview),
      reason:
        proposedFinalResponsePreview && textContainsProhibitedAuditTerm(proposedFinalResponsePreview)
          ? "Final response preview contains prohibited execution, sending, payment, database, or safety-bypass language."
          : "Final response preview is absent or remains non-executing.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is audit-contract-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains audit-contract-only and non-executing.",
    },
  ];

  const failedChecks = contractChecks.filter((check) => !check.passed);
  const allowedAuditSubjects = auditSubjects.filter((subject) => !blockedSubjects.includes(subject));
  const auditEventPreviewId = createDeterministicAuditEventId(
    businessId,
    customerId,
    conversationId,
    auditEventType,
  );

  return {
    day: 94,
    feature: "Backend Customer Memory Audit Event Contract v1",
    version: "v1",
    mode: "audit-event-contract-preview-only",
    isContractReady: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "contract-ready" : "contract-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    contractChecks,
    auditEventContract: {
      auditEventPreviewId,
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      auditMode,
      auditEventType,
      riskLevel: riskLevel || "unknown",
      safetyDecision: safetyDecision || "unknown",
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      proposedFinalResponsePreview,
      allowedAuditSubjects,
      blockedAuditSubjects: blockedSubjects,
      auditEventRules: [
        "Create only a non-persisted audit event contract preview.",
        "Never write audit events to a real database from this contract.",
        "Never write customer data or memory records.",
        "Never read real database memory from this preview contract.",
        "Never execute approve, reject, owner decision, payment, message sending, AI model call, response generation, or response sending.",
        "Capture blocked safety decisions as preview metadata only.",
        "Keep future audit persistence behind an explicit validator, storage contract, and safety architecture.",
      ],
    },
    contextSummary: {
      suppliedSubjects: auditSubjects.length,
      allowedSubjects: allowedAuditSubjects.length,
      blockedSubjects: blockedSubjects.length,
      hasFinalResponsePreview: Boolean(proposedFinalResponsePreview),
    },
    lockedSafetyBoundary: {
      readsRealDatabaseMemory: false,
      writesAuditEvents: false,
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
      "Use this contract only to preview audit event structure for customer memory safety decisions. Real audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
