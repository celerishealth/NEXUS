import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export type TrackableSandboxExecution = Readonly<{
  id: string;
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  requestedByOwnerUserId: string;
  sourceSessionId: string;
  status: "SUCCEEDED" | "FAILED";
  executionMode: "SANDBOX_ONLY";
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}>;

export type SandboxExecutionResultReadRepository = Readonly<{
  findExecutionByTenantAndId: (
    tenantId: string,
    executionId: string,
  ) => Promise<TrackableSandboxExecution | null>;
}>;

export type ExecutionResultTrackingPersistenceInput =
  Readonly<{
    tenantId: string;
    executionId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    originalOwnerUserId: string;
    trackedByUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    executionStatus: "SUCCEEDED" | "FAILED";
    resultStatus:
      | "AVAILABLE"
      | "FAILED_REQUIRES_RECOVERY";
    trackingStatus: "RECORDED";
    executionMode: "SANDBOX_ONLY";
    outcomeSummary: string;
    outputPreview: string;
    startedAt: string;
    completedAt: string;
    recoveryRequired: boolean;
  }>;

export type PersistedExecutionResultTracking =
  Readonly<{
    id: string;
    tenantId: string;
    executionId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    originalOwnerUserId: string;
    trackedByUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    executionStatus: "SUCCEEDED" | "FAILED";
    resultStatus:
      | "AVAILABLE"
      | "FAILED_REQUIRES_RECOVERY";
    trackingStatus: "RECORDED";
    executionMode: "SANDBOX_ONLY";
    outcomeSummary: string;
    outputPreview: string;
    startedAt: string;
    completedAt: string;
    recoveryRequired: boolean;
    createdAt: string;
  }>;

export type ExecutionResultTrackingPersistenceResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";
    tracking: PersistedExecutionResultTracking;
  }>;

export type SandboxExecutionResultTrackingRepository =
  Readonly<{
    createOrGetTracking: (
      input: ExecutionResultTrackingPersistenceInput,
    ) => Promise<ExecutionResultTrackingPersistenceResult>;
  }>;

export type RecordAuthenticatedSandboxExecutionResultInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    executionReadRepository:
      SandboxExecutionResultReadRepository;
    trackingRepository:
      SandboxExecutionResultTrackingRepository;
    requestedTenantId?: string | null;
    executionId: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedExecutionResultTrackingResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    tracking: Readonly<{
      id: string;
      tenantId: string;
      executionId: string;
      inquiryId: string;
      recommendationId: string;
      ownerApprovalId: string;
      executionStatus: "SUCCEEDED" | "FAILED";
      resultStatus:
        | "AVAILABLE"
        | "FAILED_REQUIRES_RECOVERY";
      outcomeSummary: string;
      outputPreview: string;
      startedAt: string;
      completedAt: string;
      recoveryRequired: boolean;
      createdAt: string;
    }>;

    trackingAuthority: Readonly<{
      trackedByUserId: string;
      sourceSessionId: string;
      role: "OWNER" | "ADMIN" | "OPERATOR";
    }>;

    safetyBoundary: Readonly<{
      resultOnlyOperation: true;
      executionTriggered: false;
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;

    nextBoundary: Readonly<{
      auditStatus: "PENDING";
      recoveryStatus:
        | "NOT_REQUIRED"
        | "REQUIRED";
    }>;
  }>;

export type ExecutionResultTrackingFailureCode =
  | "RESULT_TRACKING_ROLE_NOT_AUTHORIZED"
  | "EXECUTION_RESULT_READ_REPOSITORY_MISCONFIGURED"
  | "EXECUTION_RESULT_TRACKING_REPOSITORY_MISCONFIGURED"
  | "RESULT_TRACKING_EXECUTION_ID_REQUIRED"
  | "RESULT_TRACKING_IDEMPOTENCY_KEY_REQUIRED"
  | "RESULT_TRACKING_IDEMPOTENCY_KEY_INVALID"
  | "TRACKABLE_EXECUTION_NOT_AVAILABLE"
  | "TRACKABLE_EXECUTION_TENANT_MISMATCH"
  | "TRACKABLE_EXECUTION_IDENTITY_MISMATCH"
  | "TRACKABLE_EXECUTION_STATUS_INVALID"
  | "TRACKABLE_EXECUTION_MODE_INVALID"
  | "TRACKABLE_EXECUTION_OWNER_ID_REQUIRED"
  | "TRACKABLE_EXECUTION_INQUIRY_ID_REQUIRED"
  | "TRACKABLE_EXECUTION_RECOMMENDATION_ID_REQUIRED"
  | "TRACKABLE_EXECUTION_APPROVAL_ID_REQUIRED"
  | "TRACKABLE_EXECUTION_SUMMARY_INVALID"
  | "TRACKABLE_EXECUTION_OUTPUT_INVALID"
  | "TRACKABLE_EXECUTION_STARTED_AT_INVALID"
  | "TRACKABLE_EXECUTION_COMPLETED_AT_INVALID"
  | "TRACKABLE_EXECUTION_CREATED_AT_INVALID"
  | "RESULT_TRACKING_PERSISTENCE_RESULT_INVALID"
  | "RESULT_TRACKING_PERSISTED_ID_REQUIRED"
  | "RESULT_TRACKING_PERSISTED_IDENTITY_MISMATCH"
  | "RESULT_TRACKING_PERSISTED_STATUS_INVALID"
  | "RESULT_TRACKING_PERSISTED_MODE_INVALID"
  | "RESULT_TRACKING_PERSISTED_RECOVERY_INVALID"
  | "RESULT_TRACKING_PERSISTED_DATE_INVALID";

export class ExecutionResultTrackingDeniedError
  extends Error {
  readonly code: ExecutionResultTrackingFailureCode;
  readonly status: number;

  constructor(
    code: ExecutionResultTrackingFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "ExecutionResultTrackingDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ExecutionResultTrackingFailureCode,
  message: string,
  status = 403,
): never {
  throw new ExecutionResultTrackingDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ExecutionResultTrackingFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 8000,
): string {
  if (typeof value !== "string") {
    deny(code, message, 400);
  }

  const normalized = value.trim();

  if (
    normalized.length < minimumLength ||
    normalized.length > maximumLength
  ) {
    deny(code, message, 400);
  }

  return normalized;
}

function normalizeIdempotencyKey(
  value: unknown,
): string {
  const normalized = requireText(
    value,
    "RESULT_TRACKING_IDEMPOTENCY_KEY_REQUIRED",
    "A result-tracking idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "RESULT_TRACKING_IDEMPOTENCY_KEY_INVALID",
      "The result-tracking idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireValidDate(
  value: unknown,
  code: ExecutionResultTrackingFailureCode,
  message: string,
): string {
  const normalized = requireText(
    value,
    code,
    message,
    1,
    64,
  );

  if (Number.isNaN(Date.parse(normalized))) {
    deny(code, message, 500);
  }

  return normalized;
}

function createOutputPreview(output: string): string {
  if (output.length <= 500) {
    return output;
  }

  return `${output.slice(0, 497)}...`;
}

function freezeResult(
  result: AuthenticatedExecutionResultTrackingResult,
): AuthenticatedExecutionResultTrackingResult {
  Object.freeze(result.tracking);
  Object.freeze(result.trackingAuthority);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.nextBoundary);

  return Object.freeze(result);
}

/**
 * Records a completed sandbox execution result for the authenticated tenant.
 *
 * Safety properties:
 * - tenant identity comes only from authenticated context;
 * - VIEWER members cannot create tracking records;
 * - only completed sandbox executions may be tracked;
 * - result tracking never calls an executor;
 * - persistence is idempotent;
 * - persisted tenant, execution, inquiry, recommendation, approval,
 *   actor and session identities are verified;
 * - failed executions are explicitly marked for recovery.
 */
export async function recordAuthenticatedSandboxExecutionResult(
  input: RecordAuthenticatedSandboxExecutionResultInput,
): Promise<AuthenticatedExecutionResultTrackingResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: false,
    });

  if (workspace.actor.role === "VIEWER") {
    deny(
      "RESULT_TRACKING_ROLE_NOT_AUTHORIZED",
      "Viewer membership cannot create execution result tracking records.",
    );
  }

  if (
    !input.executionReadRepository ||
    typeof input.executionReadRepository
      .findExecutionByTenantAndId !== "function"
  ) {
    deny(
      "EXECUTION_RESULT_READ_REPOSITORY_MISCONFIGURED",
      "Execution result read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.trackingRepository ||
    typeof input.trackingRepository
      .createOrGetTracking !== "function"
  ) {
    deny(
      "EXECUTION_RESULT_TRACKING_REPOSITORY_MISCONFIGURED",
      "Execution result tracking repository is not safely configured.",
      500,
    );
  }

  const executionId = requireText(
    input.executionId,
    "RESULT_TRACKING_EXECUTION_ID_REQUIRED",
    "Sandbox execution identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const execution =
    await input.executionReadRepository
      .findExecutionByTenantAndId(
        workspace.tenant.id,
        executionId,
      );

  if (!execution) {
    deny(
      "TRACKABLE_EXECUTION_NOT_AVAILABLE",
      "The sandbox execution is not available to this tenant.",
    );
  }

  if (execution.tenantId !== workspace.tenant.id) {
    deny(
      "TRACKABLE_EXECUTION_TENANT_MISMATCH",
      "The sandbox execution belongs to another tenant.",
    );
  }

  if (execution.id !== executionId) {
    deny(
      "TRACKABLE_EXECUTION_IDENTITY_MISMATCH",
      "The sandbox execution identity is invalid.",
    );
  }

  if (
    execution.status !== "SUCCEEDED" &&
    execution.status !== "FAILED"
  ) {
    deny(
      "TRACKABLE_EXECUTION_STATUS_INVALID",
      "Only completed sandbox executions may be tracked.",
    );
  }

  if (execution.executionMode !== "SANDBOX_ONLY") {
    deny(
      "TRACKABLE_EXECUTION_MODE_INVALID",
      "Only sandbox execution results may be tracked.",
    );
  }

  const inquiryId = requireText(
    execution.inquiryId,
    "TRACKABLE_EXECUTION_INQUIRY_ID_REQUIRED",
    "Execution inquiry identity is required.",
    1,
    128,
  );

  const recommendationId = requireText(
    execution.recommendationId,
    "TRACKABLE_EXECUTION_RECOMMENDATION_ID_REQUIRED",
    "Execution recommendation identity is required.",
    1,
    128,
  );

  const ownerApprovalId = requireText(
    execution.ownerApprovalId,
    "TRACKABLE_EXECUTION_APPROVAL_ID_REQUIRED",
    "Execution owner approval identity is required.",
    1,
    128,
  );

  const originalOwnerUserId = requireText(
    execution.requestedByOwnerUserId,
    "TRACKABLE_EXECUTION_OWNER_ID_REQUIRED",
    "Execution owner identity is required.",
    1,
    128,
  );

  const outcomeSummary = requireText(
    execution.summary,
    "TRACKABLE_EXECUTION_SUMMARY_INVALID",
    "Execution outcome summary is invalid.",
    3,
    1000,
  );

  const executionOutput = requireText(
    execution.output,
    "TRACKABLE_EXECUTION_OUTPUT_INVALID",
    "Execution output is invalid.",
    1,
    8000,
  );

  const startedAt = requireValidDate(
    execution.startedAt,
    "TRACKABLE_EXECUTION_STARTED_AT_INVALID",
    "Execution start time is invalid.",
  );

  const completedAt = requireValidDate(
    execution.completedAt,
    "TRACKABLE_EXECUTION_COMPLETED_AT_INVALID",
    "Execution completion time is invalid.",
  );

  requireValidDate(
    execution.createdAt,
    "TRACKABLE_EXECUTION_CREATED_AT_INVALID",
    "Execution creation time is invalid.",
  );

  if (Date.parse(completedAt) < Date.parse(startedAt)) {
    deny(
      "TRACKABLE_EXECUTION_COMPLETED_AT_INVALID",
      "Execution completed before it started.",
      500,
    );
  }

  const recoveryRequired =
    execution.status === "FAILED";

  const resultStatus = recoveryRequired
    ? "FAILED_REQUIRES_RECOVERY"
    : "AVAILABLE";

  const outputPreview =
    createOutputPreview(executionOutput);

  const persisted =
    await input.trackingRepository
      .createOrGetTracking({
        tenantId: workspace.tenant.id,
        executionId,
        inquiryId,
        recommendationId,
        ownerApprovalId,
        originalOwnerUserId,
        trackedByUserId: workspace.actor.userId,
        sourceSessionId: workspace.actor.sessionId,
        idempotencyKey,
        executionStatus: execution.status,
        resultStatus,
        trackingStatus: "RECORDED",
        executionMode: "SANDBOX_ONLY",
        outcomeSummary,
        outputPreview,
        startedAt,
        completedAt,
        recoveryRequired,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.tracking
  ) {
    deny(
      "RESULT_TRACKING_PERSISTENCE_RESULT_INVALID",
      "Execution result tracking persistence returned an invalid result.",
      500,
    );
  }

  const tracking = persisted.tracking;

  const trackingId = requireText(
    tracking.id,
    "RESULT_TRACKING_PERSISTED_ID_REQUIRED",
    "Persisted result tracking identity is required.",
    1,
    128,
  );

  if (
    tracking.tenantId !== workspace.tenant.id ||
    tracking.executionId !== executionId ||
    tracking.inquiryId !== inquiryId ||
    tracking.recommendationId !== recommendationId ||
    tracking.ownerApprovalId !== ownerApprovalId ||
    tracking.originalOwnerUserId !==
      originalOwnerUserId ||
    tracking.trackedByUserId !==
      workspace.actor.userId ||
    tracking.sourceSessionId !==
      workspace.actor.sessionId ||
    tracking.idempotencyKey !== idempotencyKey
  ) {
    deny(
      "RESULT_TRACKING_PERSISTED_IDENTITY_MISMATCH",
      "Persisted execution result tracking identities are invalid.",
      500,
    );
  }

  if (
    tracking.executionStatus !== execution.status ||
    tracking.resultStatus !== resultStatus ||
    tracking.trackingStatus !== "RECORDED"
  ) {
    deny(
      "RESULT_TRACKING_PERSISTED_STATUS_INVALID",
      "Persisted execution result tracking status is invalid.",
      500,
    );
  }

  if (tracking.executionMode !== "SANDBOX_ONLY") {
    deny(
      "RESULT_TRACKING_PERSISTED_MODE_INVALID",
      "Persisted result tracking mode is invalid.",
      500,
    );
  }

  if (
    tracking.recoveryRequired !==
    recoveryRequired
  ) {
    deny(
      "RESULT_TRACKING_PERSISTED_RECOVERY_INVALID",
      "Persisted recovery requirement is invalid.",
      500,
    );
  }

  const persistedStartedAt = requireValidDate(
    tracking.startedAt,
    "RESULT_TRACKING_PERSISTED_DATE_INVALID",
    "Persisted execution start time is invalid.",
  );

  const persistedCompletedAt = requireValidDate(
    tracking.completedAt,
    "RESULT_TRACKING_PERSISTED_DATE_INVALID",
    "Persisted execution completion time is invalid.",
  );

  const createdAt = requireValidDate(
    tracking.createdAt,
    "RESULT_TRACKING_PERSISTED_DATE_INVALID",
    "Persisted tracking creation time is invalid.",
  );

  if (
    persistedStartedAt !== startedAt ||
    persistedCompletedAt !== completedAt
  ) {
    deny(
      "RESULT_TRACKING_PERSISTED_DATE_INVALID",
      "Persisted execution tracking times do not match the execution result.",
      500,
    );
  }

  return freezeResult({
    outcome: persisted.outcome,

    tracking: {
      id: trackingId,
      tenantId: workspace.tenant.id,
      executionId,
      inquiryId,
      recommendationId,
      ownerApprovalId,
      executionStatus: tracking.executionStatus,
      resultStatus: tracking.resultStatus,
      outcomeSummary: tracking.outcomeSummary,
      outputPreview: tracking.outputPreview,
      startedAt: persistedStartedAt,
      completedAt: persistedCompletedAt,
      recoveryRequired:
        tracking.recoveryRequired,
      createdAt,
    },

    trackingAuthority: {
      trackedByUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: workspace.actor.role,
    },

    safetyBoundary: {
      resultOnlyOperation: true,
      executionTriggered: false,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    nextBoundary: {
      auditStatus: "PENDING",
      recoveryStatus: recoveryRequired
        ? "REQUIRED"
        : "NOT_REQUIRED",
    },
  });
}
