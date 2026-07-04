type UnknownRecord = Record<string, unknown>;

export type CustomerMemoryArchitectureCheckpointStage = {
  day: number;
  stageId: string;
  label: string;
  expectedMode: string;
  status?: string;
  readOnly?: boolean;
  previewOnly?: boolean;
  executionBlocked?: boolean;
  writeBlocked?: boolean;
  routeExpected?: boolean;
  dashboardExpected?: boolean;
};

export type CustomerMemoryArchitectureCheckpointInput = {
  businessId?: string;
  ownerId?: string;
  checkpointMode?: string;
  requestedAction?: string;
  riskLevel?: string;
  ownerApprovalRequired?: boolean;
  hasRealDatabaseAccess?: boolean;
  hasWriteIntent?: boolean;
  hasCustomerDataWriteIntent?: boolean;
  hasMemoryWriteIntent?: boolean;
  hasAuditWriteIntent?: boolean;
  hasAuditPersistenceIntent?: boolean;
  hasRecoveryWriteIntent?: boolean;
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
  hasExternalSystemMutationIntent?: boolean;
  checkpointStages?: CustomerMemoryArchitectureCheckpointStage[];
};

type CheckpointCheck = {
  id: string;
  label: string;
  passed: boolean;
  reason: string;
};

const REQUIRED_STAGE_SEQUENCE: CustomerMemoryArchitectureCheckpointStage[] = [
  {
    day: 78,
    stageId: "write-eligibility-gate",
    label: "Customer Memory Final Write Eligibility Gate",
    expectedMode: "write-eligibility-preview-only",
  },
  {
    day: 79,
    stageId: "storage-contract",
    label: "Customer Memory Storage Contract",
    expectedMode: "storage-contract-preview-only",
  },
  {
    day: 80,
    stageId: "storage-validator",
    label: "Customer Memory Storage Validator",
    expectedMode: "storage-validation-preview-only",
  },
  {
    day: 81,
    stageId: "retrieval-contract",
    label: "Customer Memory Retrieval Contract",
    expectedMode: "retrieval-contract-preview-only",
  },
  {
    day: 82,
    stageId: "retrieval-validator",
    label: "Customer Memory Retrieval Validator",
    expectedMode: "retrieval-validation-preview-only",
  },
  {
    day: 83,
    stageId: "context-assembly-contract",
    label: "Customer Memory Context Assembly Contract",
    expectedMode: "context-assembly-contract-preview-only",
  },
  {
    day: 84,
    stageId: "context-assembly-validator",
    label: "Customer Memory Context Assembly Validator",
    expectedMode: "context-assembly-validation-preview-only",
  },
  {
    day: 85,
    stageId: "context-injection-contract",
    label: "Customer Memory Context Injection Contract",
    expectedMode: "context-injection-contract-preview-only",
  },
  {
    day: 86,
    stageId: "context-injection-validator",
    label: "Customer Memory Context Injection Validator",
    expectedMode: "context-injection-validation-preview-only",
  },
  {
    day: 87,
    stageId: "prompt-context-contract",
    label: "Customer Memory Prompt Context Contract",
    expectedMode: "prompt-context-contract-preview-only",
  },
  {
    day: 88,
    stageId: "prompt-context-validator",
    label: "Customer Memory Prompt Context Validator",
    expectedMode: "prompt-context-validation-preview-only",
  },
  {
    day: 89,
    stageId: "response-draft-contract",
    label: "Customer Memory Response Draft Contract",
    expectedMode: "response-draft-contract-preview-only",
  },
  {
    day: 90,
    stageId: "response-draft-validator",
    label: "Customer Memory Response Draft Validator",
    expectedMode: "response-draft-validation-preview-only",
  },
  {
    day: 91,
    stageId: "owner-review-contract",
    label: "Customer Memory Owner Review Contract",
    expectedMode: "owner-review-contract-preview-only",
  },
  {
    day: 92,
    stageId: "owner-review-validator",
    label: "Customer Memory Owner Review Validator",
    expectedMode: "owner-review-validation-preview-only",
  },
  {
    day: 93,
    stageId: "final-response-safety-gate",
    label: "Customer Memory Final Response Safety Gate",
    expectedMode: "final-response-safety-gate-preview-only",
  },
  {
    day: 94,
    stageId: "audit-event-contract",
    label: "Customer Memory Audit Event Contract",
    expectedMode: "audit-event-contract-preview-only",
  },
  {
    day: 95,
    stageId: "audit-event-validator",
    label: "Customer Memory Audit Event Validator",
    expectedMode: "audit-event-validation-preview-only",
  },
  {
    day: 96,
    stageId: "recovery-fallback-contract",
    label: "Customer Memory Recovery/Fallback Contract",
    expectedMode: "recovery-fallback-contract-preview-only",
  },
  {
    day: 97,
    stageId: "recovery-fallback-validator",
    label: "Customer Memory Recovery/Fallback Validator",
    expectedMode: "recovery-fallback-validation-preview-only",
  },
  {
    day: 98,
    stageId: "full-pipeline-preview-orchestrator",
    label: "Customer Memory Full Pipeline Preview Orchestrator",
    expectedMode: "full-pipeline-preview-orchestrator-only",
  },
  {
    day: 99,
    stageId: "pipeline-summary-dashboard",
    label: "Customer Memory Pipeline Summary Dashboard",
    expectedMode: "pipeline-summary-dashboard-preview-only",
  },
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
  "external_system_mutation",
];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCheckpointStages(input: unknown): CustomerMemoryArchitectureCheckpointStage[] {
  if (!Array.isArray(input)) {
    return REQUIRED_STAGE_SEQUENCE.map((stage) => ({
      ...stage,
      status: "completed-preview",
      readOnly: true,
      previewOnly: true,
      executionBlocked: true,
      writeBlocked: true,
      routeExpected: true,
      dashboardExpected: true,
    }));
  }

  return input.filter(isRecord).map((stage, index) => {
    const requiredStage = REQUIRED_STAGE_SEQUENCE[index];

    return {
      day: typeof stage.day === "number" ? stage.day : requiredStage?.day ?? index + 1,
      stageId: asString(stage.stageId) || requiredStage?.stageId || `checkpoint-stage-${index + 1}`,
      label: asString(stage.label) || requiredStage?.label || `Checkpoint stage ${index + 1}`,
      expectedMode: asString(stage.expectedMode) || requiredStage?.expectedMode || "preview-only",
      status: asString(stage.status) || "completed-preview",
      readOnly: stage.readOnly !== false,
      previewOnly: stage.previewOnly !== false,
      executionBlocked: stage.executionBlocked !== false,
      writeBlocked: stage.writeBlocked !== false,
      routeExpected: stage.routeExpected !== false,
      dashboardExpected: stage.dashboardExpected !== false,
    };
  });
}

function requestedActionContainsProhibitedTerm(requestedAction: string): boolean {
  const normalizedAction = requestedAction.toLowerCase();

  return PROHIBITED_ACTION_TERMS.some((term) => normalizedAction.includes(term));
}

function hasAllRequiredStages(stages: CustomerMemoryArchitectureCheckpointStage[]): boolean {
  const stageIds = new Set(stages.map((stage) => stage.stageId));

  return REQUIRED_STAGE_SEQUENCE.every((stage) => stageIds.has(stage.stageId));
}

function hasOrderedDaySequence(stages: CustomerMemoryArchitectureCheckpointStage[]): boolean {
  const days = stages.map((stage) => stage.day).sort((a, b) => a - b);

  return days[0] === 78 && days[days.length - 1] === 99 && days.length >= REQUIRED_STAGE_SEQUENCE.length;
}

function countByStatus(stages: CustomerMemoryArchitectureCheckpointStage[], status: string): number {
  return stages.filter((stage) => stage.status === status).length;
}

export function createCustomerMemoryArchitectureCheckpointPreview(input: unknown = {}) {
  const payload = isRecord(input) ? input : {};
  const stages = normalizeCheckpointStages(payload.checkpointStages);

  const businessId = asString(payload.businessId);
  const ownerId = asString(payload.ownerId);
  const requestedAction = asString(payload.requestedAction);
  const riskLevel = asString(payload.riskLevel).toLowerCase();

  const unsafeStages = stages.filter(
    (stage) =>
      stage.readOnly !== true ||
      stage.previewOnly !== true ||
      stage.executionBlocked !== true ||
      stage.writeBlocked !== true,
  );

  const checkpointChecks: CheckpointCheck[] = [
    {
      id: "checkpoint-scope",
      label: "Checkpoint business and owner scope is present",
      passed: Boolean(businessId && ownerId),
      reason:
        businessId && ownerId
          ? "Architecture checkpoint is scoped to one business and one owner."
          : "Missing businessId or ownerId blocks architecture checkpoint preview.",
    },
    {
      id: "stage-coverage",
      label: "Day 78 through Day 99 customer memory architecture stages are represented",
      passed: hasAllRequiredStages(stages),
      reason: hasAllRequiredStages(stages)
        ? "All required customer memory architecture stages are represented."
        : "One or more required customer memory architecture stages are missing.",
    },
    {
      id: "ordered-sequence",
      label: "Checkpoint covers the expected Day 78 to Day 99 sequence",
      passed: hasOrderedDaySequence(stages),
      reason: hasOrderedDaySequence(stages)
        ? "Checkpoint covers the expected Day 78 to Day 99 sequence."
        : "Checkpoint does not cover the expected Day 78 to Day 99 sequence.",
    },
    {
      id: "read-only-preview-integrity",
      label: "All checkpoint stages remain read-only and preview-only",
      passed: stages.length > 0 && unsafeStages.length === 0,
      reason:
        stages.length === 0
          ? "No checkpoint stages supplied."
          : unsafeStages.length === 0
            ? "All checkpoint stages remain read-only, preview-only, execution-blocked, and write-blocked."
            : "One or more checkpoint stages broke read-only, preview-only, execution-blocked, or write-blocked rules.",
    },
    {
      id: "write-boundary",
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
          ? "Checkpoint detected real database access, audit persistence, recovery write, customer data write, memory write, or write intent."
          : "Checkpoint remains read-only, preview-only, and does not persist or write data.",
    },
    {
      id: "execution-boundary",
      label: "No approve, reject, owner decision, message, payment, prompt, AI, generation, sending, recovery, pipeline, or external-system execution intent",
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
        payload.hasPipelineExecutionIntent !== true &&
        payload.hasExternalSystemMutationIntent !== true,
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
        payload.hasPipelineExecutionIntent === true ||
        payload.hasExternalSystemMutationIntent === true
          ? "Execution, external-system mutation, pipeline execution, recovery execution, owner decision, generation, sending, approval, rejection, or payment intent detected and blocked."
          : "No approve, reject, owner decision execution, message sending, payment, prompt execution, AI model call, response generation, response send, recovery execution, pipeline execution, or external-system mutation intent detected.",
    },
    {
      id: "risk-boundary",
      label: "Checkpoint is not high-risk or owner-approval-pending",
      passed: riskLevel !== "high" && payload.ownerApprovalRequired !== true,
      reason:
        riskLevel === "high" || payload.ownerApprovalRequired === true
          ? "High-risk or owner-approval-pending checkpoint cannot be marked safe automatically."
          : "No high-risk or owner-approval-pending boundary was crossed.",
    },
    {
      id: "requested-action-boundary",
      label: "Requested action is checkpoint-preview-only",
      passed: !requestedAction || !requestedActionContainsProhibitedTerm(requestedAction),
      reason:
        requestedAction && requestedActionContainsProhibitedTerm(requestedAction)
          ? "Requested action contains prohibited execution language."
          : "Requested action remains checkpoint-preview-only and non-executing.",
    },
  ];

  const failedChecks = checkpointChecks.filter((check) => !check.passed);
  const safeStages = stages.filter((stage) => !unsafeStages.includes(stage));

  return {
    day: 100,
    feature: "Customer Memory Architecture Checkpoint + Build Integrity Review v1",
    version: "v1",
    mode: "architecture-checkpoint-preview-only",
    isCheckpointSafe: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "checkpoint-safe" : "checkpoint-blocked",
    blockedReasons: failedChecks.map((check) => check.reason),
    checkpointChecks,
    architectureCheckpoint: {
      scope: {
        businessId,
        ownerId,
      },
      checkpointMode: asString(payload.checkpointMode) || "customer-memory-architecture-review-preview",
      coveredDays: "78-99",
      totalRequiredStages: REQUIRED_STAGE_SEQUENCE.length,
      suppliedStages: stages.length,
      completedPreviewStages: countByStatus(stages, "completed-preview"),
      safeStages,
      unsafeStages,
      requiredStageSequence: REQUIRED_STAGE_SEQUENCE,
      checkpointSummaryCards: [
        {
          id: "customer-memory-foundation",
          label: "Customer Memory Foundation",
          value: "Complete Preview Chain",
          status: "safe-preview",
        },
        {
          id: "execution-wall",
          label: "Execution Wall",
          value: "Locked",
          status: "zero-damage",
        },
        {
          id: "write-wall",
          label: "Write Wall",
          value: "Locked",
          status: "zero-damage",
        },
        {
          id: "next-phase",
          label: "Next Phase",
          value: "Trust + Pilot Readiness",
          status: "planned",
        },
      ],
      checkpointRules: [
        "Use this checkpoint only to review Day 78 through Day 99 customer memory architecture.",
        "Never execute any pipeline stage from this checkpoint.",
        "Never call an AI model from this checkpoint.",
        "Never send WhatsApp, email, SMS, or any outbound message.",
        "Never approve, reject, execute owner decisions, process payments, or trigger risky actions.",
        "Never write audit events, recovery events, customer data, or memory records.",
        "Never read real database memory from this preview checkpoint.",
        "Preserve NEXUS as an owner-controlled AI Business Operating Layer above existing business software.",
        "Preserve Zero Stop with clear safe, blocked, and fallback review states.",
        "Preserve Zero Damage by keeping all write and execution paths blocked.",
      ],
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
      mutatesExternalSystems: false,
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
      "Use this checkpoint only to review customer memory architecture integrity. Real pipeline execution, recovery execution, audit persistence, DB access, customer data writes, memory writes, approve/reject actions, owner decision execution, payments, message sending, AI model calls, response generation, external-system mutation, and risky execution remain blocked until explicitly planned later with safety architecture.",
  };
}
