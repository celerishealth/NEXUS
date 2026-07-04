type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryPipelineSummaryStage = {
  stageId?: string;
  label?: string;
  source?: string;
  decision?: string;
  passed?: boolean;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  executionBlocked?: boolean;
  writeBlocked?: boolean;
  confidence?: number;
};

export type CustomerMemoryPipelineSummaryDashboardInput = {
  businessId?: string;
  customerId?: string;
  conversationId?: string;
  ownerId?: string;
  dashboardMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  fullPipelineDecision?: string;
  isPipelinePreviewSafe?: boolean;
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
  stages?: CustomerMemoryPipelineSummaryStage[];
  pipelineStages?: CustomerMemoryPipelineSummaryStage[];
};

type DashboardCheck = {
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
  "full-pipeline-preview-orchestrator",
];

const ALLOWED_STAGE_DECISIONS = new Set([
  "passed",
  "safe-preview",
  "contract-ready",
  "valid",
  "fallback-preview",
  "manual-review-required",
  "pipeline-preview-safe",
  "blocked",
  "contract-blocked",
  "pipeline-preview-blocked",
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

function titleFromStageId(stageId: string): string {
  return stageId
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function defaultStageSummaries(): CustomerMemoryPipelineSummaryStage[] {
  return REQUIRED_STAGE_IDS.map((stageId) => ({
    stageId,
    label: titleFromStageId(stageId),
    source: "full-pipeline-preview-orchestrator",
    decision:
      stageId === "full-pipeline-preview-orchestrator"
        ? "pipeline-preview-safe"
        : stageId === "recovery-fallback-validator"
          ? "fallback-preview"
          : stageId.includes("contract")
            ? "contract-ready"
            : stageId === "final-response-safety-gate"
              ? "safe-preview"
              : "passed",
    passed: true,
    riskLevel: "low",
    ownerApprovalRequired: false,
    executionBlocked: true,
    writeBlocked: true,
    confidence: 0.92,
  }));
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

function normalizeStages(payload: UnknownRecord): CustomerMemoryPipelineSummaryStage[] {
  const rawStages = getFirstArray(payload, ["stages", "pipelineStages"]);
  const sourceStages = rawStages.length > 0 ? rawStages : defaultStageSummaries();

  return sourceStages.filter(isRecord).map((stage, index) => {
    const fallbackStageId = REQUIRED_STAGE_IDS[index] || `summary-stage-${index + 1}`;
    const stageId = asString(stage.stageId) || fallbackStageId;

    return {
      stageId,
      label: asString(stage.label) || titleFromStageId(stageId),
      source: asString(stage.source) || "full-pipeline-preview-orchestrator",
      decision: asString(stage.decision) || "passed",
      passed: stage.passed !== false,
      riskLevel: asString(stage.riskLevel) || "low",
      ownerApprovalRequired: stage.ownerApprovalRequired === true,
      executionBlocked: stage.executionBlocked !== false,
      writeBlocked: stage.writeBlocked !== false,
      confidence: asNumber(stage.confidence) ?? 0,
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

function hasMinimumConfidence(stage: CustomerMemoryPipelineSummaryStage): boolean {
  return typeof stage.confidence === "number" && stage.confidence >= 0.5;
}

function hasAllRequiredStages(stages: CustomerMemoryPipelineSummaryStage[]): boolean {
  const presentStageIds = new Set(stages.map((stage) => stage.stageId || ""));

  return REQUIRED_STAGE_IDS.every((stageId) => presentStageIds.has(stageId));
}

export function createCustomerMemoryPipelineSummaryDashboardPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const stages = normalizeStages(payload);

  const businessId = asString(payload.businessId);
  const customerId = asString(payload.customerId);
  const conversationId = asString(payload.conversationId);
  const ownerId = asString(payload.ownerId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();
  const fullPipelineDecision = asString(payload.fullPipelineDecision);
  const proposedFinalResponsePreview = asString(payload.proposedFinalResponsePreview);
  const fallbackPreviewMessage = asString(payload.fallbackPreviewMessage);

  const blockedStages = stages.filter(
    (stage) =>
      stage.passed === false ||
      stage.ownerApprovalRequired === true ||
      stage.executionBlocked !== true ||
      stage.writeBlocked !== true ||
      !hasMinimumConfidence(stage) ||
      textContainsProhibitedPreviewTerm(stage.label || "") ||
      !ALLOWED_STAGE_DECISIONS.has(stage.decision || "passed"),
  );

  const dashboardChecks: DashboardCheck[] = [
    {
      id: "identity-scope",
      label: "Business, customer, conversation, and owner scope is present",
      passed: Boolean(businessId && customerId && conversationId && ownerId),
      reason:
        businessId && customerId && conversationId && ownerId
          ? "Pipeline summary dashboard is scoped to one business, one customer, one conversation, and one owner."
          : "Missing businessId, customerId, conversationId, or ownerId blocks pipeline summary dashboard preview.",
    },
    {
      id: "full-pipeline-readiness",
      label: "Full pipeline preview is available before dashboard summary",
      passed:
        payload.isPipelinePreviewSafe === true ||
        fullPipelineDecision === "pipeline-preview-safe" ||
        fullPipelineDecision === "pipeline-preview-blocked",
      reason:
        payload.isPipelinePreviewSafe === true ||
        fullPipelineDecision === "pipeline-preview-safe" ||
        fullPipelineDecision === "pipeline-preview-blocked"
          ? "Full pipeline preview decision is available for dashboard summary."
          : "Full pipeline preview decision is missing.",
    },
    {
      id: "required-stage-coverage",
      label: "All required customer memory safety stages are represented",
      passed: hasAllRequiredStages(stages),
      reason: hasAllRequiredStages(stages)
        ? "All required customer memory safety stages are represented in the dashboard summary."
        : "One or more required customer memory safety stages are missing from the dashboard summary.",
    },
    {
      id: "stage-summary-safety",
      label: "Stage summaries remain safe, blocked from execution, and blocked from writes",
      passed: stages.length > 0 && blockedStages.length === 0,
      reason:
        stages.length === 0
          ? "No stage summaries supplied."
          : blockedStages.length === 0
            ? "All stage summaries are safe, execution-blocked, and write-blocked."
            : "One or more stage summaries failed dashboard safety checks.",
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
          ? "Dashboard detected real database access, audit persistence, recovery write, customer data write, memory write, or write intent."
          : "Dashboard remains read-only, preview-only, and does not persist or write data.",
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
      id: "preview-text-boundary",
      label: "Final response and fallback preview text remain non-executing",
      passed:
        (!proposedFinalResponsePreview || !textContainsProhibitedPreviewTerm(proposedFinalResponsePreview)) &&
        (!fallbackPreviewMessage || !textContainsProhibitedPreviewTerm(fallbackPreviewMessage)),
      reason:
        proposedFinalResponsePreview && textContainsProhibitedPreviewTerm(proposedFinalResponsePreview)
          ? "Final response preview contains prohibited execution language."
          : fallbackPreviewMessage && textContainsProhibitedPreviewTerm(fallbackPreviewMessage)
            ? "Fallback preview message contains prohibited execution language."
            : "Final response and fallback preview text are absent or non-executing.",
    },
    {
      id: "risk-boundary",
      label: "Dashboard summary is not high-risk or owner-approval-pending",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-pending dashboard summary cannot be marked safe automatically."
          : "No high-risk or owner-approval-pending boundary was crossed.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is dashboard-preview-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains dashboard-preview-only and non-executing.",
    },
  ];

  const failedChecks = dashboardChecks.filter((check) => !check.passed);
  const passedStages = stages.filter((stage) => !blockedStages.includes(stage));

  return {
    day: 99,
    feature: "Customer Memory Pipeline Summary Dashboard v1",
    version: "v1",
    mode: "pipeline-summary-dashboard-preview-only",
    isDashboardPreviewSafe: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "dashboard-preview-safe" : "dashboard-preview-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    dashboardChecks,
    pipelineSummaryDashboard: {
      scope: {
        businessId,
        customerId,
        conversationId,
        ownerId,
      },
      dashboardMode: asString(payload.dashboardMode) || "pipeline-summary-dashboard-preview",
      fullPipelineDecision: fullPipelineDecision || "unknown",
      riskLevel: riskLevel || "unknown",
      ownerApprovalRequired: payload.ownerApprovalRequired === true,
      summaryCards: [
        {
          id: "stage-coverage",
          label: "Stage Coverage",
          value: `${passedStages.length}/${REQUIRED_STAGE_IDS.length}`,
          status: hasAllRequiredStages(stages) ? "complete" : "incomplete",
        },
        {
          id: "execution-wall",
          label: "Execution Wall",
          value: "Locked",
          status: "safe",
        },
        {
          id: "write-wall",
          label: "Write Wall",
          value: "Locked",
          status: "safe",
        },
        {
          id: "owner-control",
          label: "Owner Control",
          value: payload.ownerApprovalRequired === true ? "Required" : "Preview",
          status: payload.ownerApprovalRequired === true ? "manual-review" : "safe-preview",
        },
      ],
      passedStages,
      blockedStages,
      dashboardRules: [
        "Show only read-only customer memory pipeline summary data.",
        "Never execute any pipeline stage from this dashboard.",
        "Never call an AI model from this dashboard.",
        "Never send WhatsApp, email, SMS, or any outbound message.",
        "Never approve, reject, execute owner decisions, process payments, or trigger risky actions.",
        "Never write audit events, recovery events, customer data, or memory records.",
        "Never read real database memory from this preview dashboard.",
        "Preserve Zero Stop with clear safe, blocked, and fallback summary states.",
        "Preserve Zero Damage by keeping all write and execution paths blocked.",
      ],
    },
    contextSummary: {
      requiredStages: REQUIRED_STAGE_IDS.length,
      suppliedStages: stages.length,
      passedStages: passedStages.length,
      blockedStages: blockedStages.length,
      hasAllRequiredStages: hasAllRequiredStages(stages),
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
      "Use this dashboard only to summarize the full customer memory safety pipeline preview. Real pipeline execution, recovery execution, audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
