type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryAuditEventValidationSubject = {
  subjectId?: string;
  subjectType?: string;
  label?: string;
  source?: string;
  riskLevel?: string;
  decision?: string;
  confidence?: number;
  validatedByContract?: boolean;
  auditAllowed?: boolean;
  containsSensitiveData?: boolean;
};

export type CustomerMemoryAuditEventValidationInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  auditEventPreviewId?: string;
  auditEventType?: string;
  auditMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  safetyDecision?: string;
  ownerApprovalRequired?: boolean;
  auditEventContractDecision?: string;
  isAuditEventContractReady?: boolean;
  proposedFinalResponsePreview?: string;
  finalResponsePreview?: string;
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
  auditSubjects?: CustomerMemoryAuditEventValidationSubject[];
  allowedAuditSubjects?: CustomerMemoryAuditEventValidationSubject[];
  finalResponseSafetyBlocks?: CustomerMemoryAuditEventValidationSubject[];
};

type ValidationCheck = {
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

const ALLOWED_AUDIT_VALIDATION_SOURCES = new Set([
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

const ALLOWED_SAFETY_DECISIONS = new Set([
  "safe-preview",
  "blocked",
  "contract-ready",
  "contract-blocked",
  "manual-review-required",
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
  "memory_delete",
  "customer_data_write",
  "execute",
  "prompt_execute",
  "ai_execute",
  "model_call",
  "owner_decision_execute",
];

const PROHIBITED_TEXT_TERMS = [
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
  "skip audit",
  "ignore safety layer",
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

function normalizeAuditSubjects(payload: UnknownRecord): CustomerMemoryAuditEventValidationSubject[] {
  const rawSubjects = getFirstArray(payload, [
    "auditSubjects",
    "allowedAuditSubjects",
    "finalResponseSafetyBlocks",
  ]);

  return rawSubjects.filter(isRecord).map((subject, index) => ({
    subjectId: asString(subject.subjectId) || asString(subject.blockId) || `validated-audit-subject-${index + 1}`,
    subjectType: asString(subject.subjectType) || "customer-memory-safety-preview",
    label: asString(subject.label) || asString(subject.key) || `Validated audit subject ${index + 1}`,
    source: asString(subject.source) || "audit-event-contract-preview",
    riskLevel: asString(subject.riskLevel) || "low",
    decision: asString(subject.decision) || "preview",
    confidence: asNumber(subject.confidence) ?? 0,
    validatedByContract: subject.validatedByContract !== false,
    auditAllowed: subject.auditAllowed !== false,
    containsSensitiveData: subject.containsSensitiveData === true,
  }));
}

function textContainsProhibitedTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_TEXT_TERMS.some((term) => normalizedText.includes(term));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(subject: CustomerMemoryAuditEventValidationSubject): boolean {
  return typeof subject.confidence === "number" && subject.confidence >= 0.5;
}

function hasValidAuditPreviewId(auditEventPreviewId: string): boolean {
  return auditEventPreviewId.startsWith("audit-preview-") && auditEventPreviewId.length >= 24;
}

export function validateCustomerMemoryAuditEventPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const auditSubjects = normalizeAuditSubjects(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const auditEventPreviewId = asString(payload.auditEventPreviewId);
  const auditEventType = asString(payload.auditEventType) || "final-response-safety-preview";
  const auditMode = asString(payload.auditMode) || "audit-event-validation-preview";
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const safetyDecision = asString(payload.safetyDecision) || "unknown";
  const auditEventContractDecision = asString(payload.auditEventContractDecision);
  const proposedFinalResponsePreview =
    asString(payload.proposedFinalResponsePreview) ||
    asString(payload.finalResponsePreview);

  const blockedSubjects = auditSubjects.filter(
    (subject) =>
      subject.validatedByContract === false ||
      subject.auditAllowed === false ||
      subject.containsSensitiveData === true ||
      !hasMinimumConfidence(subject) ||
      textContainsProhibitedTerm(subject.label || "") ||
      textContainsProhibitedTerm(subject.decision || "") ||
      !ALLOWED_AUDIT_VALIDATION_SOURCES.has(subject.source || "audit-event-contract-preview"),
  );

  const validationChecks: ValidationCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Audit event validation is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks audit event validation.",
    },
    {
      id: "audit-contract-readiness",
      label: "Audit event contract is ready before validation",
      passed:
        payload.isAuditEventContractReady === true ||
        auditEventContractDecision === "contract-ready" ||
        auditEventContractDecision === "passed",
      reason:
        payload.isAuditEventContractReady === true ||
        auditEventContractDecision === "contract-ready" ||
        auditEventContractDecision === "passed"
          ? "Upstream audit event contract is marked ready for preview validation."
          : "Upstream audit event contract is not marked ready.",
    },
    {
      id: "audit-preview-id",
      label: "Audit preview id is deterministic and preview-only",
      passed: Boolean(auditEventPreviewId && hasValidAuditPreviewId(auditEventPreviewId)),
      reason:
        auditEventPreviewId && hasValidAuditPreviewId(auditEventPreviewId)
          ? "Audit preview id uses a preview-only deterministic structure."
          : "Audit preview id is missing or not in the expected preview-only structure.",
    },
    {
      id: "audit-event-type",
      label: "Audit event type is allowed",
      passed: ALLOWED_AUDIT_EVENT_TYPES.has(auditEventType),
      reason: ALLOWED_AUDIT_EVENT_TYPES.has(auditEventType)
        ? "Audit event type is approved for preview validation."
        : "Audit event type is not approved for preview validation.",
    },
    {
      id: "safety-decision-boundary",
      label: "Safety decision is explicit and allowed",
      passed: ALLOWED_SAFETY_DECISIONS.has(safetyDecision),
      reason: ALLOWED_SAFETY_DECISIONS.has(safetyDecision)
        ? "Safety decision is explicit and allowed for audit preview."
        : "Safety decision is missing or not allowed.",
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
          ? "Validator detected real database access, audit persistence intent, customer data write, memory write, or write intent."
          : "Validator remains read-only, preview-only, and does not persist audit events.",
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
      id: "audit-subject-validation",
      label: "Audit subjects pass validation",
      passed: auditSubjects.length > 0 && blockedSubjects.length === 0,
      reason:
        auditSubjects.length === 0
          ? "No audit subjects supplied for validation."
          : blockedSubjects.length === 0
            ? "All audit subjects pass preview validation."
            : "One or more audit subjects failed preview validation.",
    },
    {
      id: "final-response-preview-boundary",
      label: "Final response preview is non-executing when present",
      passed:
        !proposedFinalResponsePreview ||
        !textContainsProhibitedTerm(proposedFinalResponsePreview),
      reason:
        proposedFinalResponsePreview && textContainsProhibitedTerm(proposedFinalResponsePreview)
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
  const validatedAuditSubjects = auditSubjects.filter((subject) => !blockedSubjects.includes(subject));

  return {
    day: 95,
    feature: "Backend Customer Memory Audit Event Validator v1",
    version: "v1",
    mode: "audit-event-validation-preview-only",
    isValid: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "passed" : "blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    validationChecks,
    auditEventValidation: {
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
      safetyDecision,
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      proposedFinalResponsePreview,
      validatedAuditSubjects,
      blockedAuditSubjects: blockedSubjects,
      allowedPreviewActions: [
        "view-audit-preview",
        "copy-audit-preview",
        "hold-for-future-audit-persistence-design",
        "route-to-safety-review",
      ],
      blockedExecutionActions: [
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
      suppliedSubjects: auditSubjects.length,
      validatedSubjects: validatedAuditSubjects.length,
      blockedSubjects: blockedSubjects.length,
      hasFinalResponsePreview: Boolean(proposedFinalResponsePreview),
    },
    lockedSafetyBoundary: {
      readsRealDatabaseMemory: false,
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
      "Use this validator only to validate non-persisted audit event previews. Real audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
