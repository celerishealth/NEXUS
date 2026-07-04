type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryPipelineStagePreview = {
  stageId?: string;
  label?: string;
  source?: string;
  decision?: string;
  passed?: boolean;
  riskLevel?: string;
  reason?: string;
  confidence?: number;
  containsSensitiveData?: boolean;
  requiresOwnerApproval?: boolean;
};

export type CustomerMemoryFullPipelinePreviewOrchestratorInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  pipelineMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  recoveryFallbackValidationDecision?: string;
  isRecoveryFallbackValid?: boolean;
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
  hasPipelineExecutionIntent?: boolean;
  pipelineStages?: CustomerMemoryPipelineStagePreview[];
  stagePreviews?: CustomerMemoryPipelineStagePreview[];
};

type OrchestratorCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const REQUIRED_STAGE_IDS = [
  "write-eligibility",
  "storage-contract",
  "storage-validator",
  "retrieval-contract",
  "retrieval-validator",
  "context-assembly-contract",
  "context-assembly-validator",
  "context-injection-contract",
  "context-injection-validator",
  "prompt-context-contract",
  "prompt-context-validator",
  "response-draft-contract",
  "response-draft-validator",
  "owner-review-contract",
  "owner-review-validator",
  "final-response-safety-gate",
  "audit-event-contract",
  "audit-event-validator",
  "recovery-fallback-contract",
  "recovery-fallback-validator",
];

const ALLOWED_STAGE_SOURCES = new Set([
  "safe-preview",
  "demo-preview",
  "write-eligibility-preview",
  "storage-contract-preview",
  "storage-validation-preview",
  "retrieval-contract-preview",
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
  "recovery-fallback-validation-preview",
  "full-pipeline-preview-orchestrator",
]);

const ALLOWED_STAGE_DECISIONS = new Set([
  "passed",
  "safe-preview",
  "contract-ready",
  "valid",
  "fallback-preview",
  "manual-review-required",
  "blocked",
  "contract-blocked",
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
  "pipeline_execute",
];

const PROHIBITED_PREVIEW_TEXT_TERMS = [
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
  "pipeline executed",
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

function titleFromStageId(stageId: string): string {
  return stageId
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function defaultStagePreviews(): CustomerMemoryPipelineStagePreview[] {
  return REQUIRED_STAGE_IDS.map((stageId) => ({
    stageId,
    label: titleFromStageId(stageId),
    source:
      stageId === "final-response-safety-gate"
        ? "final-response-safety-gate-preview"
        : `${stageId.replace("validator", "validation")}-preview`,
    decision:
      stageId === "recovery-fallback-validator"
        ? "fallback-preview"
        : stageId.includes("contract")
          ? "contract-ready"
          : "passed",
    passed: true,
    riskLevel: "low",
    reason: `${titleFromStageId(stageId)} completed in preview-only mode.`,
    confidence: 0.92,
    containsSensitiveData: false,
    requiresOwnerApproval: false,
  }));
}

function normalizeStagePreviews(payload: UnknownRecord): CustomerMemoryPipelineStagePreview[] {
  const rawStages = getFirstArray(payload, ["pipelineStages", "stagePreviews"]);

  const sourceStages = rawStages.length > 0 ? rawStages : defaultStagePreviews();

  return sourceStages.filter(isRecord).map((stage, index) => {
    const fallbackStageId = REQUIRED_STAGE_IDS[index] || `pipeline-stage-${index + 1}`;
    const stageId = asString(stage.stageId) || fallbackStageId;

    return {
      stageId,
      label: asString(stage.label) || titleFromStageId(stageId),
      source: asString(stage.source) || "full-pipeline-preview-orchestrator",
      decision: asString(stage.decision) || "passed",
      passed: stage.passed !== false,
      riskLevel: asString(stage.riskLevel) || "low",
      reason: asString(stage.reason) || `${titleFromStageId(stageId)} is included in full pipeline preview.`,
      confidence: asNumber(stage.confidence) ?? 0,
      containsSensitiveData: stage.containsSensitiveData === true,
      requiresOwnerApproval: stage.requiresOwnerApproval === true,
    };
  });
}

function textContainsProhibitedPreviewTerm(text: string): boolean {
  const normalizedText = text.toLowerCase();

  return PROHIBITED_PREVIEW_TEXT_TERMS.some((term) => normalizedText.includes(term));
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasMinimumConfidence(stage: CustomerMemoryPipelineStagePreview): boolean {
  return typeof stage.confidence === "number" && stage.confidence >= 0.5;
}

function hasAllRequiredStages(stages: CustomerMemoryPipelineStagePreview[]): boolean {
  const presentStageIds = new Set(stages.map((stage) => stage.stageId || ""));

  return REQUIRED_STAGE_IDS.every((stageId) => presentStageIds.has(stageId));
}

function hasValidAuditPreviewId(auditEventPreviewId: string): boolean {
  return !auditEventPreviewId || auditEventPreviewId.startsWith("audit-preview-");
}

export function orchestrateCustomerMemoryFullPipelinePreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const stagePreviews = normalizeStagePreviews(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const pipelineMode = asString(payload.pipelineMode) || "full-pipeline-preview-only";
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const recoveryFallbackValidationDecision = asString(payload.recoveryFallbackValidationDecision);
  const auditEventPreviewId = asString(payload.auditEventPreviewId);
  const proposedFinalResponsePreview = asString(payload.proposedFinalResponsePreview);
  const fallbackPreviewMessage = asString(payload.fallbackPreviewMessage);

  const blockedStages = stagePreviews.filter(
    (stage) =>
      stage.passed === false ||
      stage.containsSensitiveData === true ||
      stage.requiresOwnerApproval === true ||
      !hasMinimumConfidence(stage) ||
      textContainsProhibitedPreviewTerm(stage.label || "") ||
      textContainsProhibitedPreviewTerm(stage.reason || "") ||
      !ALLOWED_STAGE_DECISIONS.has(stage.decision || "passed") ||
      !ALLOWED_STAGE_SOURCES.has(stage.source || "full-pipeline-preview-orchestrator"),
  );

  const orchestratorChecks: OrchestratorCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Full pipeline preview is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks full pipeline preview.",
    },
    {
      id: "recovery-fallback-validation-readiness",
      label: "Recovery fallback validation is available before full pipeline preview",
      passed:
        payload.isRecoveryFallbackValid === true ||
        recoveryFallbackValidationDecision === "passed" ||
        recoveryFallbackValidationDecision === "blocked",
      reason:
        payload.isRecoveryFallbackValid === true ||
        recoveryFallbackValidationDecision === "passed" ||
        recoveryFallbackValidationDecision === "blocked"
          ? "Recovery fallback validation decision is available for full pipeline preview."
          : "Recovery fallback validation decision is missing.",
    },
    {
      id: "required-stage-coverage",
      label: "All required customer memory safety stages are represented",
      passed: hasAllRequiredStages(stagePreviews),
      reason: hasAllRequiredStages(stagePreviews)
        ? "All required customer memory safety stages are represented in the pipeline preview."
        : "One or more required customer memory safety stages are missing.",
    },
    {
      id: "stage-preview-safety",
      label: "All stage previews pass safety checks",
      passed: stagePreviews.length > 0 && blockedStages.length === 0,
      reason:
        stagePreviews.length === 0
          ? "No pipeline stages supplied for orchestration."
          : blockedStages.length === 0
            ? "All pipeline stages pass preview orchestration checks."
            : "One or more pipeline stages failed preview orchestration checks.",
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
          ? "Orchestrator detected real database access, audit persistence, recovery write, customer data write, memory write, or write intent."
          : "Orchestrator remains read-only, preview-only, and does not persist or write data.",
    },
    {
      id: "no-execution-intents",
      label: "No approve, reject, owner decision, message, payment, prompt, AI, generation, sending, recovery, or pipeline execution intent",
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
        payload.hasRecoveryExecutionIntent !== true &&
        payload.hasPipelineExecutionIntent !== true,
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
        payload.hasRecoveryExecutionIntent === true ||
        payload.hasPipelineExecutionIntent === true
          ? "Execution, pipeline execution, recovery execution, owner decision, generation, sending, approval, rejection, or payment intent detected and blocked."
          : "No approve, reject, owner decision execution, message sending, payment, prompt execution, AI model call, response generation, response send, recovery execution, or pipeline execution intent detected.",
    },
    {
      id: "final-response-preview-boundary",
      label: "Final response preview is non-executing when present",
      passed:
        !proposedFinalResponsePreview ||
        !textContainsProhibitedPreviewTerm(proposedFinalResponsePreview),
      reason:
        proposedFinalResponsePreview && textContainsProhibitedPreviewTerm(proposedFinalResponsePreview)
          ? "Final response preview contains prohibited execution, sending, payment, database, or safety-bypass language."
          : "Final response preview is absent or remains non-executing.",
    },
    {
      id: "fallback-message-boundary",
      label: "Fallback preview message is non-executing when present",
      passed:
        !fallbackPreviewMessage ||
        !textContainsProhibitedPreviewTerm(fallbackPreviewMessage),
      reason:
        fallbackPreviewMessage && textContainsProhibitedPreviewTerm(fallbackPreviewMessage)
          ? "Fallback preview message contains prohibited execution, sending, payment, database, or safety-bypass language."
          : "Fallback preview message is absent or remains non-executing.",
    },
    {
      id: "risk-boundary",
      label: "Pipeline preview is not high-risk or owner-approval-pending",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-pending pipeline cannot be marked safe automatically."
          : "No high-risk or owner-approval-pending boundary was crossed.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is orchestration-preview-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains orchestration-preview-only and non-executing.",
    },
  ];

  const failedChecks = orchestratorChecks.filter((check) => !check.passed);
  const passedStages = stagePreviews.filter((stage) => !blockedStages.includes(stage));

  return {
    day: 98,
    feature: "Backend Customer Memory Full Pipeline Preview Orchestrator v1",
    version: "v1",
    mode: "full-pipeline-preview-orchestrator-only",
    isPipelinePreviewSafe: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "pipeline-preview-safe" : "pipeline-preview-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    orchestratorChecks,
    fullPipelinePreview: {
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      pipelineMode,
      riskLevel: riskLevel || "unknown",
      recoveryFallbackValidationDecision: recoveryFallbackValidationDecision || "unknown",
      auditEventPreviewId,
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      proposedFinalResponsePreview,
      fallbackPreviewMessage,
      requiredStageIds: REQUIRED_STAGE_IDS,
      passedStages,
      blockedStages,
      pipelineRules: [
        "Create only a read-only full customer memory pipeline preview.",
        "Never execute any pipeline stage from this orchestrator.",
        "Never call an AI model from this orchestrator.",
        "Never send WhatsApp, email, SMS, or any outbound message.",
        "Never approve, reject, execute owner decisions, process payments, or trigger risky actions.",
        "Never write audit events, recovery events, customer data, or memory records.",
        "Never read real database memory from this preview orchestrator.",
        "Preserve Zero Stop by returning safe preview, blocked preview, or fallback preview states.",
        "Preserve Zero Damage by blocking all write and execution paths.",
      ],
    },
    contextSummary: {
      requiredStages: REQUIRED_STAGE_IDS.length,
      suppliedStages: stagePreviews.length,
      passedStages: passedStages.length,
      blockedStages: blockedStages.length,
      hasAllRequiredStages: hasAllRequiredStages(stagePreviews),
      hasFinalResponsePreview: Boolean(proposedFinalResponsePreview),
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
      executesPipeline: false,
      executesRiskyActions: false,
      previewOnly: true,
      readOnly: true,
    },
    nextAllowedStep:
      "Use this orchestrator only to preview the full customer memory safety pipeline. Real pipeline execution, recovery execution, audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
