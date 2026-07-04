type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryRecoveryFallbackSubject = {
  subjectId?: string;
  subjectType?: string;
  label?: string;
  source?: string;
  failedStage?: string;
  decision?: string;
  riskLevel?: string;
  confidence?: number;
  fallbackAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryRecoveryFallbackContractInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  recoveryMode?: string;
  fallbackReason?: string;
  failedStage?: string;
  requestedAction?: string;
  riskLevel?: string;
  safetyDecision?: string;
  ownerApprovalRequired?: boolean;
  auditEventValidationDecision?: string;
  isAuditEventValid?: boolean;
  auditEventPreviewId?: string;
  proposedFinalResponsePreview?: string;
  fallbackPreviewMessage?: string;
  hasRealDatabaseAccess?: boolean;
  hasAuditWriteIntent?: boolean;
  hasAuditPersistenceIntent?: boolean;
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
  hasRecoveryExecutionIntent?: boolean;
  fallbackSubjects?: CustomerMemoryRecoveryFallbackSubject[];
  auditSubjects?: CustomerMemoryRecoveryFallbackSubject[];
  contextBlocks?: CustomerMemoryRecoveryFallbackSubject[];
};

type ContractCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const ALLOWED_RECOVERY_MODES = new Set([
  "safe-fallback-preview",
  "manual-owner-review-preview",
  "hold-and-review-preview",
  "request-more-info-preview",
  "blocked-safe-stop-preview",
  "zero-stop-safe-preview",
]);

const ALLOWED_FAILED_STAGES = new Set([
  "customer-memory-storage",
  "customer-memory-retrieval",
  "context-assembly",
  "context-injection",
  "prompt-context",
  "response-draft",
  "owner-review",
  "final-response-safety-gate",
  "audit-event-validation",
  "customer-memory-pipeline-preview",
]);

const ALLOWED_FALLBACK_SOURCES = new Set([
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
  "audit-event-validation-preview",
  "recovery-fallback-contract-preview",
]);

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
  "audit_write",
  "audit_persist",
  "memory_delete",
  "customer_data_write",
  "execute",
  "prompt_execute",
  "ai_execute",
  "model_call",
  "owner_decision_execute",
  "recovery_execute",
];

const PROHIBITED_FALLBACK_TEXT_TERMS = [
  "message sent",
  "payment processed",
  "refund processed",
  "approved automatically",
  "rejected automatically",
  "write to database",
  "memory updated",
  "audit persisted",
  "audit saved",
  "customer data updated",
  "execute payment",
  "auto send",
  "send now",
  "bypass safety",
  "ignore safety layer",
  "skip owner approval",
  "force recovery",
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

function normalizeFallbackSubjects(payload: UnknownRecord): CustomerMemoryRecoveryFallbackSubject[] {
  const rawSubjects = getFirstArray(payload, [
    "fallbackSubjects",
    "auditSubjects",
    "contextBlocks",
  ]);

  return rawSubjects.filter(isRecord).map((subject, index) => ({
    subjectId: asString(subject.subjectId) || asString(subject.blockId) || `fallback-subject-${index + 1}`,
    subjectType: asString(subject.subjectType) || "customer-memory-recovery-preview",
    label: asString(subject.label) || asString(subject.key) || `Recovery fallback subject ${index + 1}`,
    source: asString(subject.source) || "audit-event-validation-preview",
    failedStage: asString(subject.failedStage) || "customer-memory-pipeline-preview",
    decision: asString(subject.decision) || "fallback-preview",
    riskLevel: asString(subject.riskLevel) || "low",
    confidence: asNumber(subject.confidence) ?? 0,
    fallbackAllowed: subject.fallbackAllowed !== false,
    containsSensitiveData: subject.containsSensitiveData === true,
    requiresOwnerApproval: subject.requiresOwnerApproval === true,
  }));
}

function textContainsProhibitedFallbackTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_FALLBACK_TEXT_TERMS.some((term) => normalizedText.includes(term));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(subject: CustomerMemoryRecoveryFallbackSubject): boolean {
  return typeof subject.confidence === "number" && subject.confidence >= 0.5;
}

export function createCustomerMemoryRecoveryFallbackContract(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const fallbackSubjects = normalizeFallbackSubjects(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const recoveryMode = asString(payload.recoveryMode) || "safe-fallback-preview";
  const fallbackReason = asString(payload.fallbackReason) || "safe fallback preview required";
  const failedStage = asString(payload.failedStage) || "customer-memory-pipeline-preview";
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const auditEventValidationDecision = asString(payload.auditEventValidationDecision);
  const proposedFinalResponsePreview = asString(payload.proposedFinalResponsePreview);
  const fallbackPreviewMessage =
    asString(payload.fallbackPreviewMessage) ||
    "Safe fallback preview only. No action is executed. Manual owner review may be required.";

  const blockedSubjects = fallbackSubjects.filter(
    (subject) =>
      subject.fallbackAllowed === false ||
      subject.containsSensitiveData === true ||
      !hasMinimumConfidence(subject) ||
      textContainsProhibitedFallbackTerm(subject.label || "") ||
      textContainsProhibitedFallbackTerm(subject.decision || "") ||
      !ALLOWED_FAILED_STAGES.has(subject.failedStage || "customer-memory-pipeline-preview") ||
      !ALLOWED_FALLBACK_SOURCES.has(subject.source || "audit-event-validation-preview"),
  );

  const contractChecks: ContractCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Recovery fallback contract is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks recovery fallback contract.",
    },
    {
      id: "audit-validation-readiness",
      label: "Audit event validation decision is available before recovery fallback contract",
      passed:
        payload.isAuditEventValid === true ||
        auditEventValidationDecision === "passed" ||
        auditEventValidationDecision === "blocked",
      reason:
        payload.isAuditEventValid === true ||
        auditEventValidationDecision === "passed" ||
        auditEventValidationDecision === "blocked"
          ? "Audit event validation decision is available for recovery fallback preview."
          : "Audit event validation decision is missing.",
    },
    {
      id: "recovery-mode-boundary",
      label: "Recovery mode is allowed",
      passed: ALLOWED_RECOVERY_MODES.has(recoveryMode),
      reason: ALLOWED_RECOVERY_MODES.has(recoveryMode)
        ? "Recovery mode is approved for preview-only fallback handling."
        : "Recovery mode is not approved for fallback contract preview.",
    },
    {
      id: "failed-stage-boundary",
      label: "Failed stage is recognized",
      passed: ALLOWED_FAILED_STAGES.has(failedStage),
      reason: ALLOWED_FAILED_STAGES.has(failedStage)
        ? "Failed stage is recognized for recovery fallback preview."
        : "Failed stage is not recognized for recovery fallback preview.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access, audit persistence, customer data write, memory write, or write intent",
      passed:
        payload.hasRealDatabaseAccess !== true &&
        payload.hasAuditWriteIntent !== true &&
        payload.hasAuditPersistenceIntent !== true &&
        payload.hasWriteIntent !== true &&
        payload.hasCustomerDataWriteIntent !== true &&
        payload.hasMemoryWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true ||
        payload.hasAuditWriteIntent === true ||
        payload.hasAuditPersistenceIntent === true ||
        payload.hasWriteIntent === true ||
        payload.hasCustomerDataWriteIntent === true ||
        payload.hasMemoryWriteIntent === true
          ? "Contract detected real database access, audit persistence intent, customer data write, memory write, or write intent."
          : "Contract remains read-only, preview-only, and does not persist recovery events.",
    },
    {
      id: "no-execution-intents",
      label: "No approve, reject, owner decision, message, payment, prompt, AI, generation, sending, or recovery execution intent",
      passed:
        payload.hasApprovalExecutionIntent !== true &&
        payload.hasRejectExecutionIntent !== true &&
        payload.hasOwnerDecisionExecutionIntent !== true &&
        payload.hasMessageSendingIntent !== true &&
        payload.hasPaymentIntent !== true &&
        payload.hasPromptExecutionIntent !== true &&
        payload.hasAiModelExecutionIntent !== true &&
        payload.hasResponseGenerationIntent !== true &&
        payload.hasResponseSendIntent !== true &&
        payload.hasRecoveryExecutionIntent !== true,
      reason:
        payload.hasApprovalExecutionIntent === true ||
        payload.hasRejectExecutionIntent === true ||
        payload.hasOwnerDecisionExecutionIntent === true ||
        payload.hasMessageSendingIntent === true ||
        payload.hasPaymentIntent === true ||
        payload.hasPromptExecutionIntent === true ||
        payload.hasAiModelExecutionIntent === true ||
        payload.hasResponseGenerationIntent === true ||
        payload.hasResponseSendIntent === true ||
        payload.hasRecoveryExecutionIntent === true
          ? "Execution, recovery execution, owner decision, generation, sending, approval, rejection, or payment intent detected and blocked."
          : "No approve, reject, owner decision execution, message sending, payment, prompt execution, AI model call, response generation, response send, or recovery execution intent detected.",
    },
    {
      id: "fallback-subject-contract",
      label: "Fallback subjects are safe for preview contract",
      passed: fallbackSubjects.length > 0 && blockedSubjects.length === 0,
      reason:
        fallbackSubjects.length === 0
          ? "No fallback subjects supplied for recovery fallback contract."
          : blockedSubjects.length === 0
            ? "All fallback subjects pass preview contract checks."
            : "One or more fallback subjects failed preview contract checks.",
    },
    {
      id: "fallback-message-boundary",
      label: "Fallback preview message is non-executing",
      passed:
        Boolean(fallbackPreviewMessage) &&
        !textContainsProhibitedFallbackTerm(fallbackPreviewMessage),
      reason:
        !fallbackPreviewMessage
          ? "No fallback preview message supplied."
          : textContainsProhibitedFallbackTerm(fallbackPreviewMessage)
            ? "Fallback preview message contains prohibited execution, sending, payment, database, or safety-bypass language."
            : "Fallback preview message is present and remains non-executing.",
    },
    {
      id: "final-response-preview-boundary",
      label: "Final response preview is non-executing when present",
      passed:
        !proposedFinalResponsePreview ||
        !textContainsProhibitedFallbackTerm(proposedFinalResponsePreview),
      reason:
        proposedFinalResponsePreview && textContainsProhibitedFallbackTerm(proposedFinalResponsePreview)
          ? "Final response preview contains prohibited execution, sending, payment, database, or safety-bypass language."
          : "Final response preview is absent or remains non-executing.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is recovery-contract-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains recovery-contract-only and non-executing.",
    },
  ];

  const failedChecks = contractChecks.filter((check) => !check.passed);
  const allowedFallbackSubjects = fallbackSubjects.filter((subject) => !blockedSubjects.includes(subject));

  return {
    day: 96,
    feature: "Backend Customer Memory Recovery/Fallback Contract v1",
    version: "v1",
    mode: "recovery-fallback-contract-preview-only",
    isContractReady: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "contract-ready" : "contract-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    contractChecks,
    recoveryFallbackContract: {
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      recoveryMode,
      fallbackReason,
      failedStage,
      riskLevel: riskLevel || "unknown",
      safetyDecision: asString(payload.safetyDecision) || "unknown",
      auditEventPreviewId: asString(payload.auditEventPreviewId),
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      proposedFinalResponsePreview,
      fallbackPreviewMessage,
      allowedFallbackSubjects,
      blockedFallbackSubjects: blockedSubjects,
      fallbackRules: [
        "Create only a non-executing recovery fallback contract preview.",
        "Never execute recovery from this contract.",
        "Never write recovery events, audit events, customer data, or memory records.",
        "Never read real database memory from this preview contract.",
        "Never execute approve, reject, owner decision, payment, message sending, AI model call, response generation, or response sending.",
        "Route unresolved, high-risk, blocked, or unclear states to manual owner review or safe hold.",
        "Preserve Zero Stop by returning safe fallback guidance without touching customer systems.",
        "Preserve Zero Damage by blocking all write and execution paths.",
      ],
    },
    contextSummary: {
      suppliedSubjects: fallbackSubjects.length,
      allowedSubjects: allowedFallbackSubjects.length,
      blockedSubjects: blockedSubjects.length,
      hasFinalResponsePreview: Boolean(proposedFinalResponsePreview),
      hasFallbackPreviewMessage: Boolean(fallbackPreviewMessage),
    },
    lockedSafetyBoundary: {
      readsRealDatabaseMemory: false,
      writesRecoveryEvents: false,
      writesAuditEvents: false,
      persistsAuditEvents: false,
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
      executesRecovery: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this contract only to preview safe recovery and fallback behavior. Real recovery execution, audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
