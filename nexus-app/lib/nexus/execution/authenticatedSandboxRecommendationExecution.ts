import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export type ExecutableRecommendationSnapshot = Readonly<{
  recommendation: Readonly<{
    id: string;
    tenantId: string;
    inquiryId: string;
    recommendedAction: string;
    status: "APPROVED";
    engineMode: "SANDBOX_ONLY";
  }>;

  approval: Readonly<{
    id: string;
    tenantId: string;
    recommendationId: string;
    inquiryId: string;
    ownerUserId: string;
    recommendationStatus: "APPROVED";
    executionStatus: "READY_FOR_SANDBOX";
    executionMode: "SANDBOX_ONLY";
  }>;
}>;

export type SandboxExecutionReadRepository = Readonly<{
  findExecutableRecommendation: (
    tenantId: string,
    recommendationId: string,
  ) => Promise<ExecutableRecommendationSnapshot | null>;
}>;

export type SandboxExecutorInput = Readonly<{
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  recommendedAction: string;
  requestedByOwnerUserId: string;
  executionMode: "SANDBOX_ONLY";
}>;

export type SandboxExecutorOutput = Readonly<{
  status: "SUCCEEDED" | "FAILED";
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
}>;

export type SandboxRecommendationExecutor = Readonly<{
  mode: "SANDBOX_ONLY";

  execute: (
    input: SandboxExecutorInput,
  ) => Promise<SandboxExecutorOutput>;
}>;

export type SandboxExecutionClaimInput = Readonly<{
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  requestedByOwnerUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  status: "RUNNING";
  executionMode: "SANDBOX_ONLY";
}>;

export type SandboxExecutionClaim = Readonly<{
  id: string;
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  requestedByOwnerUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  status: "RUNNING";
  executionMode: "SANDBOX_ONLY";
  claimedAt: string;
}>;

export type PersistedSandboxExecution = Readonly<{
  id: string;
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  requestedByOwnerUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  status: "SUCCEEDED" | "FAILED";
  executionMode: "SANDBOX_ONLY";
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}>;

export type SandboxExecutionClaimResult =
  | Readonly<{
      outcome: "CLAIMED";
      claim: SandboxExecutionClaim;
    }>
  | Readonly<{
      outcome: "EXISTING";
      execution: PersistedSandboxExecution;
    }>;

export type CompleteSandboxExecutionInput = Readonly<{
  executionId: string;
  tenantId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  requestedByOwnerUserId: string;
  sourceSessionId: string;
  idempotencyKey: string;
  expectedStatus: "RUNNING";
  status: "SUCCEEDED" | "FAILED";
  executionMode: "SANDBOX_ONLY";
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
}>;

export type SandboxExecutionRepository = Readonly<{
  claimExecution: (
    input: SandboxExecutionClaimInput,
  ) => Promise<SandboxExecutionClaimResult>;

  completeExecution: (
    input: CompleteSandboxExecutionInput,
  ) => Promise<PersistedSandboxExecution>;
}>;

export type ExecuteApprovedSandboxRecommendationInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    executionReadRepository:
      SandboxExecutionReadRepository;
    executionRepository: SandboxExecutionRepository;
    sandboxExecutor: SandboxRecommendationExecutor;
    requestedTenantId?: string | null;
    recommendationId: string;
    idempotencyKey: string;
  }>;

export type ApprovedSandboxExecutionResult = Readonly<{
  outcome: "EXECUTED" | "EXISTING";

  execution: Readonly<{
    id: string;
    tenantId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    status: "SUCCEEDED" | "FAILED";
    summary: string;
    output: string;
    startedAt: string;
    completedAt: string;
    createdAt: string;
  }>;

  ownerAuthority: Readonly<{
    ownerUserId: string;
    sourceSessionId: string;
    role: "OWNER";
    approvalVerified: true;
  }>;

  safetyBoundary: Readonly<{
    executionMode: "SANDBOX_ONLY";
    duplicateExecutionPrevented: true;
    liveProviderExecutionAuthorized: false;
    publicLaunchAuthorized: false;
  }>;

  nextBoundary: Readonly<{
    resultTrackingStatus: "PENDING";
    auditStatus: "PENDING";
    recoveryRequired: boolean;
  }>;
}>;

export type ApprovedSandboxExecutionFailureCode =
  | "SANDBOX_EXECUTION_READ_REPOSITORY_MISCONFIGURED"
  | "SANDBOX_EXECUTION_REPOSITORY_MISCONFIGURED"
  | "SANDBOX_EXECUTOR_MISCONFIGURED"
  | "LIVE_EXECUTOR_NOT_AUTHORIZED"
  | "SANDBOX_EXECUTION_RECOMMENDATION_ID_REQUIRED"
  | "SANDBOX_EXECUTION_IDEMPOTENCY_KEY_REQUIRED"
  | "SANDBOX_EXECUTION_IDEMPOTENCY_KEY_INVALID"
  | "EXECUTABLE_RECOMMENDATION_NOT_AVAILABLE"
  | "EXECUTABLE_RECOMMENDATION_TENANT_MISMATCH"
  | "EXECUTABLE_RECOMMENDATION_IDENTITY_MISMATCH"
  | "EXECUTABLE_RECOMMENDATION_STATUS_INVALID"
  | "EXECUTABLE_RECOMMENDATION_ENGINE_MODE_INVALID"
  | "EXECUTABLE_RECOMMENDATION_ACTION_INVALID"
  | "OWNER_APPROVAL_TENANT_MISMATCH"
  | "OWNER_APPROVAL_RECOMMENDATION_MISMATCH"
  | "OWNER_APPROVAL_INQUIRY_MISMATCH"
  | "OWNER_APPROVAL_OWNER_MISMATCH"
  | "OWNER_APPROVAL_STATUS_INVALID"
  | "OWNER_APPROVAL_EXECUTION_STATUS_INVALID"
  | "OWNER_APPROVAL_EXECUTION_MODE_INVALID"
  | "SANDBOX_EXECUTION_CLAIM_RESULT_INVALID"
  | "SANDBOX_EXECUTION_CLAIM_ID_REQUIRED"
  | "SANDBOX_EXECUTION_CLAIM_IDENTITY_MISMATCH"
  | "SANDBOX_EXECUTION_CLAIM_STATUS_INVALID"
  | "SANDBOX_EXECUTOR_OUTPUT_INVALID"
  | "SANDBOX_EXECUTOR_STATUS_INVALID"
  | "SANDBOX_EXECUTOR_SUMMARY_INVALID"
  | "SANDBOX_EXECUTOR_RESULT_INVALID"
  | "SANDBOX_EXECUTOR_STARTED_AT_INVALID"
  | "SANDBOX_EXECUTOR_COMPLETED_AT_INVALID"
  | "SANDBOX_EXECUTION_PERSISTED_ID_REQUIRED"
  | "SANDBOX_EXECUTION_PERSISTED_IDENTITY_MISMATCH"
  | "SANDBOX_EXECUTION_PERSISTED_STATUS_INVALID"
  | "SANDBOX_EXECUTION_PERSISTED_MODE_INVALID"
  | "SANDBOX_EXECUTION_PERSISTED_DATE_INVALID";

export class ApprovedSandboxExecutionDeniedError
  extends Error {
  readonly code:
    ApprovedSandboxExecutionFailureCode;

  readonly status: number;

  constructor(
    code: ApprovedSandboxExecutionFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name =
      "ApprovedSandboxExecutionDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ApprovedSandboxExecutionFailureCode,
  message: string,
  status = 403,
): never {
  throw new ApprovedSandboxExecutionDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ApprovedSandboxExecutionFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 4000,
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
    "SANDBOX_EXECUTION_IDEMPOTENCY_KEY_REQUIRED",
    "A sandbox-execution idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "SANDBOX_EXECUTION_IDEMPOTENCY_KEY_INVALID",
      "The sandbox-execution idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireValidDate(
  value: unknown,
  code: ApprovedSandboxExecutionFailureCode,
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

function validatePersistedExecution(
  execution: PersistedSandboxExecution,
  expected: Readonly<{
    executionId?: string;
    tenantId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    ownerUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
  }>,
): PersistedSandboxExecution {
  if (!execution || typeof execution !== "object") {
    deny(
      "SANDBOX_EXECUTION_CLAIM_RESULT_INVALID",
      "Sandbox execution persistence returned an invalid result.",
      500,
    );
  }

  requireText(
    execution.id,
    "SANDBOX_EXECUTION_PERSISTED_ID_REQUIRED",
    "Persisted sandbox execution identity is required.",
    1,
    128,
  );

  if (
    expected.executionId !== undefined &&
    execution.id !== expected.executionId
  ) {
    deny(
      "SANDBOX_EXECUTION_PERSISTED_IDENTITY_MISMATCH",
      "Persisted execution identity changed during completion.",
      500,
    );
  }

  if (
    execution.tenantId !== expected.tenantId ||
    execution.inquiryId !== expected.inquiryId ||
    execution.recommendationId !==
      expected.recommendationId ||
    execution.ownerApprovalId !==
      expected.ownerApprovalId ||
    execution.requestedByOwnerUserId !==
      expected.ownerUserId ||
    execution.sourceSessionId !==
      expected.sourceSessionId ||
    execution.idempotencyKey !==
      expected.idempotencyKey
  ) {
    deny(
      "SANDBOX_EXECUTION_PERSISTED_IDENTITY_MISMATCH",
      "Persisted sandbox execution identities are invalid.",
      500,
    );
  }

  if (
    execution.status !== "SUCCEEDED" &&
    execution.status !== "FAILED"
  ) {
    deny(
      "SANDBOX_EXECUTION_PERSISTED_STATUS_INVALID",
      "Persisted sandbox execution status is invalid.",
      500,
    );
  }

  if (execution.executionMode !== "SANDBOX_ONLY") {
    deny(
      "SANDBOX_EXECUTION_PERSISTED_MODE_INVALID",
      "Persisted execution mode is invalid.",
      500,
    );
  }

  requireText(
    execution.summary,
    "SANDBOX_EXECUTOR_SUMMARY_INVALID",
    "Persisted sandbox execution summary is invalid.",
    3,
    1000,
  );

  requireText(
    execution.output,
    "SANDBOX_EXECUTOR_RESULT_INVALID",
    "Persisted sandbox execution output is invalid.",
    1,
    8000,
  );

  requireValidDate(
    execution.startedAt,
    "SANDBOX_EXECUTION_PERSISTED_DATE_INVALID",
    "Persisted sandbox execution start time is invalid.",
  );

  requireValidDate(
    execution.completedAt,
    "SANDBOX_EXECUTION_PERSISTED_DATE_INVALID",
    "Persisted sandbox execution completion time is invalid.",
  );

  requireValidDate(
    execution.createdAt,
    "SANDBOX_EXECUTION_PERSISTED_DATE_INVALID",
    "Persisted sandbox execution creation time is invalid.",
  );

  return execution;
}

function freezeResult(
  result: ApprovedSandboxExecutionResult,
): ApprovedSandboxExecutionResult {
  Object.freeze(result.execution);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.nextBoundary);

  return Object.freeze(result);
}

/**
 * Executes one approved recommendation exactly once in sandbox mode.
 *
 * Safety properties:
 * - requires current authenticated tenant OWNER authority;
 * - verifies recommendation and owner approval identities;
 * - requires APPROVED and READY_FOR_SANDBOX states;
 * - rejects every executor except SANDBOX_ONLY;
 * - atomically claims the execution before invoking the executor;
 * - repeated idempotency keys return the existing result;
 * - executor failures are recorded fail-closed;
 * - live-provider execution and public launch remain disabled.
 */
export async function executeApprovedSandboxRecommendation(
  input: ExecuteApprovedSandboxRecommendationInput,
): Promise<ApprovedSandboxExecutionResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: true,
    });

  if (
    !input.executionReadRepository ||
    typeof input.executionReadRepository
      .findExecutableRecommendation !== "function"
  ) {
    deny(
      "SANDBOX_EXECUTION_READ_REPOSITORY_MISCONFIGURED",
      "Sandbox execution read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.executionRepository ||
    typeof input.executionRepository
      .claimExecution !== "function" ||
    typeof input.executionRepository
      .completeExecution !== "function"
  ) {
    deny(
      "SANDBOX_EXECUTION_REPOSITORY_MISCONFIGURED",
      "Sandbox execution repository is not safely configured.",
      500,
    );
  }

  if (
    !input.sandboxExecutor ||
    typeof input.sandboxExecutor.execute !== "function"
  ) {
    deny(
      "SANDBOX_EXECUTOR_MISCONFIGURED",
      "Sandbox executor is not safely configured.",
      500,
    );
  }

  if (input.sandboxExecutor.mode !== "SANDBOX_ONLY") {
    deny(
      "LIVE_EXECUTOR_NOT_AUTHORIZED",
      "Live-provider execution is not authorized.",
    );
  }

  const recommendationId = requireText(
    input.recommendationId,
    "SANDBOX_EXECUTION_RECOMMENDATION_ID_REQUIRED",
    "Recommendation identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const snapshot =
    await input.executionReadRepository
      .findExecutableRecommendation(
        workspace.tenant.id,
        recommendationId,
      );

  if (!snapshot) {
    deny(
      "EXECUTABLE_RECOMMENDATION_NOT_AVAILABLE",
      "No executable recommendation is available to this tenant.",
    );
  }

  const recommendation = snapshot.recommendation;
  const approval = snapshot.approval;

  if (recommendation.tenantId !== workspace.tenant.id) {
    deny(
      "EXECUTABLE_RECOMMENDATION_TENANT_MISMATCH",
      "The recommendation belongs to another tenant.",
    );
  }

  if (recommendation.id !== recommendationId) {
    deny(
      "EXECUTABLE_RECOMMENDATION_IDENTITY_MISMATCH",
      "The recommendation identity is invalid.",
    );
  }

  if (recommendation.status !== "APPROVED") {
    deny(
      "EXECUTABLE_RECOMMENDATION_STATUS_INVALID",
      "The recommendation has not been approved.",
    );
  }

  if (recommendation.engineMode !== "SANDBOX_ONLY") {
    deny(
      "EXECUTABLE_RECOMMENDATION_ENGINE_MODE_INVALID",
      "The recommendation was not generated in sandbox mode.",
    );
  }

  const recommendedAction = requireText(
    recommendation.recommendedAction,
    "EXECUTABLE_RECOMMENDATION_ACTION_INVALID",
    "The approved recommendation action is invalid.",
    5,
    2000,
  );

  if (approval.tenantId !== workspace.tenant.id) {
    deny(
      "OWNER_APPROVAL_TENANT_MISMATCH",
      "The owner approval belongs to another tenant.",
    );
  }

  if (approval.recommendationId !== recommendationId) {
    deny(
      "OWNER_APPROVAL_RECOMMENDATION_MISMATCH",
      "The owner approval does not match the recommendation.",
    );
  }

  if (
    approval.inquiryId !== recommendation.inquiryId
  ) {
    deny(
      "OWNER_APPROVAL_INQUIRY_MISMATCH",
      "The owner approval inquiry identity is invalid.",
    );
  }

  if (approval.ownerUserId !== workspace.actor.userId) {
    deny(
      "OWNER_APPROVAL_OWNER_MISMATCH",
      "The authenticated owner did not create this approval.",
    );
  }

  if (approval.recommendationStatus !== "APPROVED") {
    deny(
      "OWNER_APPROVAL_STATUS_INVALID",
      "The recommendation is not owner-approved.",
    );
  }

  if (
    approval.executionStatus !==
    "READY_FOR_SANDBOX"
  ) {
    deny(
      "OWNER_APPROVAL_EXECUTION_STATUS_INVALID",
      "The recommendation is not ready for sandbox execution.",
    );
  }

  if (approval.executionMode !== "SANDBOX_ONLY") {
    deny(
      "OWNER_APPROVAL_EXECUTION_MODE_INVALID",
      "The owner approval does not authorize sandbox-only execution.",
    );
  }

  const expectedIdentity = {
    tenantId: workspace.tenant.id,
    inquiryId: recommendation.inquiryId,
    recommendationId,
    ownerApprovalId: approval.id,
    ownerUserId: workspace.actor.userId,
    sourceSessionId: workspace.actor.sessionId,
    idempotencyKey,
  } as const;

  const claimResult =
    await input.executionRepository.claimExecution({
      tenantId: expectedIdentity.tenantId,
      inquiryId: expectedIdentity.inquiryId,
      recommendationId:
        expectedIdentity.recommendationId,
      ownerApprovalId:
        expectedIdentity.ownerApprovalId,
      requestedByOwnerUserId:
        expectedIdentity.ownerUserId,
      sourceSessionId:
        expectedIdentity.sourceSessionId,
      idempotencyKey,
      status: "RUNNING",
      executionMode: "SANDBOX_ONLY",
    });

  if (!claimResult || typeof claimResult !== "object") {
    deny(
      "SANDBOX_EXECUTION_CLAIM_RESULT_INVALID",
      "Sandbox execution claim returned an invalid result.",
      500,
    );
  }

  if (claimResult.outcome === "EXISTING") {
    const execution = validatePersistedExecution(
      claimResult.execution,
      expectedIdentity,
    );

    return freezeResult({
      outcome: "EXISTING",

      execution: {
        id: execution.id,
        tenantId: execution.tenantId,
        inquiryId: execution.inquiryId,
        recommendationId:
          execution.recommendationId,
        ownerApprovalId:
          execution.ownerApprovalId,
        status: execution.status,
        summary: execution.summary,
        output: execution.output,
        startedAt: execution.startedAt,
        completedAt: execution.completedAt,
        createdAt: execution.createdAt,
      },

      ownerAuthority: {
        ownerUserId: workspace.actor.userId,
        sourceSessionId:
          workspace.actor.sessionId,
        role: "OWNER",
        approvalVerified: true,
      },

      safetyBoundary: {
        executionMode: "SANDBOX_ONLY",
        duplicateExecutionPrevented: true,
        liveProviderExecutionAuthorized: false,
        publicLaunchAuthorized: false,
      },

      nextBoundary: {
        resultTrackingStatus: "PENDING",
        auditStatus: "PENDING",
        recoveryRequired:
          execution.status === "FAILED",
      },
    });
  }

  if (
    claimResult.outcome !== "CLAIMED" ||
    !claimResult.claim
  ) {
    deny(
      "SANDBOX_EXECUTION_CLAIM_RESULT_INVALID",
      "Sandbox execution claim outcome is invalid.",
      500,
    );
  }

  const claim = claimResult.claim;

  const executionId = requireText(
    claim.id,
    "SANDBOX_EXECUTION_CLAIM_ID_REQUIRED",
    "Sandbox execution claim identity is required.",
    1,
    128,
  );

  if (
    claim.tenantId !== expectedIdentity.tenantId ||
    claim.inquiryId !== expectedIdentity.inquiryId ||
    claim.recommendationId !==
      expectedIdentity.recommendationId ||
    claim.ownerApprovalId !==
      expectedIdentity.ownerApprovalId ||
    claim.requestedByOwnerUserId !==
      expectedIdentity.ownerUserId ||
    claim.sourceSessionId !==
      expectedIdentity.sourceSessionId ||
    claim.idempotencyKey !== idempotencyKey
  ) {
    deny(
      "SANDBOX_EXECUTION_CLAIM_IDENTITY_MISMATCH",
      "Sandbox execution claim identities are invalid.",
      500,
    );
  }

  if (
    claim.status !== "RUNNING" ||
    claim.executionMode !== "SANDBOX_ONLY"
  ) {
    deny(
      "SANDBOX_EXECUTION_CLAIM_STATUS_INVALID",
      "Sandbox execution claim status is invalid.",
      500,
    );
  }

  requireValidDate(
    claim.claimedAt,
    "SANDBOX_EXECUTION_CLAIM_STATUS_INVALID",
    "Sandbox execution claim time is invalid.",
  );

  let executorOutput: SandboxExecutorOutput;

  const safeStartedAt = new Date().toISOString();

  try {
    executorOutput =
      await input.sandboxExecutor.execute({
        tenantId: workspace.tenant.id,
        inquiryId: recommendation.inquiryId,
        recommendationId,
        ownerApprovalId: approval.id,
        recommendedAction,
        requestedByOwnerUserId:
          workspace.actor.userId,
        executionMode: "SANDBOX_ONLY",
      });
  } catch {
    executorOutput = {
      status: "FAILED",
      summary:
        "Sandbox execution failed safely.",
      output:
        "No live-provider execution occurred. Recovery review is required.",
      startedAt: safeStartedAt,
      completedAt: new Date().toISOString(),
    };
  }

  if (
    !executorOutput ||
    typeof executorOutput !== "object"
  ) {
    deny(
      "SANDBOX_EXECUTOR_OUTPUT_INVALID",
      "Sandbox executor returned an invalid result.",
      500,
    );
  }

  if (
    executorOutput.status !== "SUCCEEDED" &&
    executorOutput.status !== "FAILED"
  ) {
    deny(
      "SANDBOX_EXECUTOR_STATUS_INVALID",
      "Sandbox executor status is invalid.",
      500,
    );
  }

  const summary = requireText(
    executorOutput.summary,
    "SANDBOX_EXECUTOR_SUMMARY_INVALID",
    "Sandbox executor summary is invalid.",
    3,
    1000,
  );

  const output = requireText(
    executorOutput.output,
    "SANDBOX_EXECUTOR_RESULT_INVALID",
    "Sandbox executor output is invalid.",
    1,
    8000,
  );

  const startedAt = requireValidDate(
    executorOutput.startedAt,
    "SANDBOX_EXECUTOR_STARTED_AT_INVALID",
    "Sandbox executor start time is invalid.",
  );

  const completedAt = requireValidDate(
    executorOutput.completedAt,
    "SANDBOX_EXECUTOR_COMPLETED_AT_INVALID",
    "Sandbox executor completion time is invalid.",
  );

  if (
    Date.parse(completedAt) < Date.parse(startedAt)
  ) {
    deny(
      "SANDBOX_EXECUTOR_COMPLETED_AT_INVALID",
      "Sandbox execution completed before it started.",
      500,
    );
  }

  const completed =
    await input.executionRepository.completeExecution({
      executionId,
      tenantId: expectedIdentity.tenantId,
      inquiryId: expectedIdentity.inquiryId,
      recommendationId:
        expectedIdentity.recommendationId,
      ownerApprovalId:
        expectedIdentity.ownerApprovalId,
      requestedByOwnerUserId:
        expectedIdentity.ownerUserId,
      sourceSessionId:
        expectedIdentity.sourceSessionId,
      idempotencyKey,
      expectedStatus: "RUNNING",
      status: executorOutput.status,
      executionMode: "SANDBOX_ONLY",
      summary,
      output,
      startedAt,
      completedAt,
    });

  const execution = validatePersistedExecution(
    completed,
    {
      ...expectedIdentity,
      executionId,
    },
  );

  if (execution.status !== executorOutput.status) {
    deny(
      "SANDBOX_EXECUTION_PERSISTED_STATUS_INVALID",
      "Persisted execution status does not match the sandbox result.",
      500,
    );
  }

  return freezeResult({
    outcome: "EXECUTED",

    execution: {
      id: execution.id,
      tenantId: execution.tenantId,
      inquiryId: execution.inquiryId,
      recommendationId:
        execution.recommendationId,
      ownerApprovalId: execution.ownerApprovalId,
      status: execution.status,
      summary: execution.summary,
      output: execution.output,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      createdAt: execution.createdAt,
    },

    ownerAuthority: {
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: "OWNER",
      approvalVerified: true,
    },

    safetyBoundary: {
      executionMode: "SANDBOX_ONLY",
      duplicateExecutionPrevented: true,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    nextBoundary: {
      resultTrackingStatus: "PENDING",
      auditStatus: "PENDING",
      recoveryRequired:
        execution.status === "FAILED",
    },
  });
}
