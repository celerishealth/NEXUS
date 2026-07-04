type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryRecoveryFallbackValidationSubject = {
  subjectId?: string;
  subjectType?: string;
  label?: string;
  source?: string;
  failedStage?: string;
  decision?: string;
  riskLevel?: string;
  confidence?: number;
  validatedByContract?: boolean;
  fallbackAllowed?: boolean;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryRecoveryFallbackValidationInput = {
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
  recoveryFallbackContractDecision?: string;
  isRecoveryFallbackContractReady?: boolean;
  auditEventPreviewId?: string;
  proposedFinalResponsePreview?: string;
  fallbackPreviewMessage?: string;
  hasRealDatabaseAccess?: boolean;
  hasAuditWriteIntent?: boolean;
  hasAuditPersistenceIntent?: boolean;
  hasRecoveryWriteIntent?: boolean;
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
  fallbackSubjects?: CustomerMemoryRecoveryFallbackValidationSubject[];
  allowedFallbackSubjects?: CustomerMemoryRecoveryFallbackValidationSubject[];
  auditSubjects?: CustomerMemoryRecoveryFallbackValidationSubject[];
};

type ValidationCheck = {
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
  "recovery-fallback-contract",
  "customer-memory-pipeline-preview",
]);

const ALLOWED_FALLBACK_VALIDATION_SOURCES = new Set([
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

const ALLOWED_SAFETY_DECISIONS = new Set([
  "safe-preview",
  "blocked",
  "contract-ready",
  "contract-blocked",
  "manual-review-required",
  "fallback-preview",
  "unknown",
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
  "recovery_write",
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
  "recovery executed",
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

function normalizeFallbackSubjects(payload: UnknownRecord): CustomerMemoryRecoveryFallbackValidationSubject[] {
  const rawSubjects = getFirstArray(payload, [
    "fallbackSubjects",
    "allowedFallbackSubjects",
    "auditSubjects",
  ]);

  return rawSubjects.filter(isRecord).map((subject, index) => ({
    subjectId: asString(subject.subjectId) || asString(subject.blockId) || `validated-fallback-subject-${index + 1}`,
    subjectType: asString(subject.subjectType) || "customer-memory-recovery-validation-preview",
    label: asString(subject.label) || asString(subject.key) || `Validated recovery fallback subject ${index + 1}`,
    source: asString(subject.source) || "recovery-fallback-contract-preview",
    failedStage: asString(subject.failedStage) || "customer-memory-pipeline-preview",
    decision: asString(subject.decision) || "fallback-preview",
    riskLevel: asString(subject.riskLevel) || "low",
    confidence: asNumber(subject.confidence) ?? 0,
    validatedByContract: subject.validatedByContract !== false,
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

function hasMinimumConfidence(subject: CustomerMemoryRecoveryFallbackValidationSubject): boolean {
  return typeof subject.confidence === "number" && subject.confidence >= 0.5;
}

function hasValidAuditPreviewId(auditEventPreviewId: string): boolean {
  return !auditEventPreviewId || auditEventPreviewId.startsWith("audit-preview-");
}

export function validateCustomerMemoryRecoveryFallbackPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const fallbackSubjects = normalizeFallbackSubjects(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const recoveryMode = asString(payload.recoveryMode) || "safe-fallback-preview";
  const fallbackReason = asString(payload.fallbackReason);
  const failedStage = asString(payload.failedStage) || "customer-memory-pipeline-preview";
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const safetyDecision = asString(payload.safetyDecision) || "unknown";
  const recoveryFallbackContractDecision = asString(payload.recoveryFallbackContractDecision);
  const auditEventPreviewId = asString(payload.auditEventPreviewId);
  const proposedFinalResponsePreview = asString(payload.proposedFinalResponsePreview);
  const fallbackPreviewMessage = asString(payload.fallbackPreviewMessage);

  const blockedSubjects = fallbackSubjects.filter(
    (subject) =>
      subject.validatedByContract === false ||
      subject.fallbackAllowed === false ||
      subject.containsSensitiveData === true ||
      !hasMinimumConfidence(subject) ||
      textContainsProhibitedFallbackTerm(subject.label || "") ||
      textContainsProhibitedFallbackTerm(subject.decision || "") ||
      !ALLOWED_FAILED_STAGES.has(subject.failedStage || "customer-memory-pipeline-preview") ||
      !ALLOWED_FALLBACK_VALIDATION_SOURCES.has(subject.source || "recovery-fallback-contract-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Recovery fallback validation is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks recovery fallback validation.",
    },
    {
      id: "contract-readiness",
      label: "Recovery fallback contract is ready before validation",
      passed:
        payload.isRecoveryFallbackContractReady === true ||
        recoveryFallbackContractDecision === "contract-ready" ||
        recoveryFallbackContractDecision === "passed",
      reason:
        payload.isRecoveryFallbackContractReady === true ||
        recoveryFallbackContractDecision === "contract-ready" ||
        recoveryFallbackContractDecision === "passed"
          ? "Upstream recovery fallback contract is marked ready for preview validation."
          : "Upstream recovery fallback contract is not marked ready.",
    },
    {
      id: "recovery-mode-boundary",
      label: "Recovery mode is allowed",
      passed: ALLOWED_RECOVERY_MODES.has(recoveryMode),
      reason: ALLOWED_RECOVERY_MODES.has(recoveryMode)
        ? "Recovery mode is approved for preview-only fallback validation."
        : "Recovery mode is not approved for fallback validation preview.",
    },
    {
      id: "failed-stage-boundary",
      label: "Failed stage is recognized",
      passed: ALLOWED_FAILED_STAGES.has(failedStage),
      reason: ALLOWED_FAILED_STAGES.has(failedStage)
        ? "Failed stage is recognized for recovery fallback validation."
        : "Failed stage is not recognized for recovery fallback validation.",
    },
    {
      id: "safety-decision-boundary",
      label: "Safety decision is explicit and allowed",
      passed: ALLOWED_SAFETY_DECISIONS.has(safetyDecision),
      reason: ALLOWED_SAFETY_DECISIONS.has(safetyDecision)
        ? "Safety decision is explicit and allowed for recovery fallback validation."
        : "Safety decision is missing or not allowed.",
    },
    {
      id: "audit-preview-id-boundary",
      label: "Audit preview id is preview-only when present",
      passed: hasValidAuditPreviewId(auditEventPreviewId),
      reason: hasValidAuditPreviewId(auditEventPreviewId)
        ? "Audit preview id is absent or uses preview-only structure."
        : "Audit preview id is not in the expected preview-only structure.",
    },
    {
      id: "read-only-preview-boundary",
      label: "No real DB access, audit persistence, recovery write, customer data write, memory write, or write intent",
      passed:
        payload.hasRealDatabaseAccess !== true &&
        payload.hasAuditWriteIntent !== true &&
        payload.hasAuditPersistenceIntent !== true &&
        payload.hasRecoveryWriteIntent !== true &&
        payload.hasWriteIntent !== true &&
        payload.hasCustomerDataWriteIntent !== true &&
        payload.hasMemoryWriteIntent !== true,
      reason:
        payload.hasRealDatabaseAccess === true ||
        payload.hasAuditWriteIntent === true ||
        payload.hasAuditPersistenceIntent === true ||
        payload.hasRecoveryWriteIntent === true ||
        payload.hasWriteIntent === true ||
        payload.hasCustomerDataWriteIntent === true ||
        payload.hasMemoryWriteIntent === true
          ? "Validator detected real database access, audit persistence, recovery write, customer data write, memory write, or write intent."
          : "Validator remains read-only, preview-only, and does not persist recovery events.",
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
      id: "fallback-subject-validation",
      label: "Fallback subjects pass validation",
      passed: fallbackSubjects.length > 0 && blockedSubjects.length === 0,
      reason:
        fallbackSubjects.length === 0
          ? "No fallback subjects supplied for recovery fallback validation."
          : blockedSubjects.length === 0
            ? "All fallback subjects pass preview validation."
            : "One or more fallback subjects failed preview validation.",
    },
    {
      id: "fallback-reason-boundary",
      label: "Fallback reason is present and non-executing",
      passed: Boolean(fallbackReason) && !textContainsProhibitedFallbackTerm(fallbackReason),
      reason:
        !fallbackReason
          ? "No fallback reason supplied."
          : textContainsProhibitedFallbackTerm(fallbackReason)
            ? "Fallback reason contains prohibited execution, sending, payment, database, or safety-bypass language."
            : "Fallback reason is present and remains non-executing.",
    },
    {
      id: "fallback-message-boundary",
      label: "Fallback preview message is present and non-executing",
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
      label: "Requested action is validation-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains validation-only and non-executing.",
    },
  ];

  const failedChecks = validationChecks.filter((check) => !check.passed);
  const validatedFallbackSubjects = fallbackSubjects.filter((subject) => !blockedSubjects.includes(subject));

  return {
    day: 97,
    feature: "Backend Customer Memory Recovery/Fallback Validator v1",
    version: "v1",
    mode: "recovery-fallback-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    recoveryFallbackValidation: {
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
      safetyDecision,
      auditEventPreviewId,
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      proposedFinalResponsePreview,
      fallbackPreviewMessage,
      validatedFallbackSubjects,
      blockedFallbackSubjects: blockedSubjects,
      allowedPreviewActions: [
        "view-fallback-preview",
        "copy-fallback-preview",
        "hold-for-owner-review",
        "request-more-info",
        "route-to-safe-stop",
      ],
      blockedExecutionActions: [
        "recovery-execution",
        "audit-persistence",
        "db-write",
        "customer-data-write",
        "memory-write",
        "approve-execution",
        "reject-execution",
        "owner-decision-execution",
        "message-send",
        "payment-execution",
        "ai-model-call",
        "response-generation",
        "response-send",
      ],
    },
    contextSummary: {
      suppliedSubjects: fallbackSubjects.length,
      validatedSubjects: validatedFallbackSubjects.length,
      blockedSubjects: blockedSubjects.length,
      hasFinalResponsePreview: Boolean(proposedFinalResponsePreview),
      hasFallbackReason: Boolean(fallbackReason),
      hasFallbackPreviewMessage: Boolean(fallbackPreviewMessage),
    },
    lockedSafetyBoundary: {
      readsRealDatabaseMemory: false,
      writesRecoveryEvents: false,
      executesRecovery: false,
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
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this validator only to validate safe recovery and fallback previews. Real recovery execution, audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
