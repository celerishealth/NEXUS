import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export type RecoverableSandboxFailureSnapshot =
  Readonly<{
    tracking: Readonly<{
      id: string;
      tenantId: string;
      executionId: string;
      inquiryId: string;
      recommendationId: string;
      ownerApprovalId: string;
      approvalOwnerUserId: string;
      executionStatus: "FAILED";
      resultStatus: "FAILED_REQUIRES_RECOVERY";
      trackingStatus: "RECORDED";
      executionMode: "SANDBOX_ONLY";
      recoveryRequired: true;
      outcomeSummary: string;
      outputPreview: string;
    }>;

    auditEvent: Readonly<{
      id: string;
      tenantId: string;
      trackingId: string;
      executionId: string;
      eventType: "SANDBOX_EXECUTION_FAILED";
      outcome: "FAILURE";
      recoveryRequired: true;
      executionMode: "SANDBOX_ONLY";
      integrityAlgorithm: "SHA-256";
      integrityDigest: string;
      immutable: true;
    }>;

    completedRecoveryAttempts: number;
  }>;

export type SandboxRecoveryReadRepository = Readonly<{
  findRecoverableFailure: (
    tenantId: string,
    trackingId: string,
  ) => Promise<RecoverableSandboxFailureSnapshot | null>;
}>;

export type SandboxRecoveryExecutorInput = Readonly<{
  tenantId: string;
  trackingId: string;
  failedExecutionId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  authorizedOwnerUserId: string;
  recoveryAttemptNumber: number;
  failureSummary: string;
  failureOutputPreview: string;
  executionMode: "SANDBOX_ONLY";
}>;

export type SandboxRecoveryExecutorOutput = Readonly<{
  status: "RECOVERED" | "FAILED";
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
}>;

export type SandboxRecoveryExecutor = Readonly<{
  mode: "SANDBOX_ONLY";

  recover: (
    input: SandboxRecoveryExecutorInput,
  ) => Promise<SandboxRecoveryExecutorOutput>;
}>;

export type SandboxRecoveryClaimInput = Readonly<{
  tenantId: string;
  trackingId: string;
  failedExecutionId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  ownerUserId: string;
  sourceSessionId: string;
  failureAuditEventId: string;
  idempotencyKey: string;
  attemptNumber: number;
  maximumAttempts: 3;
  status: "RUNNING";
  executionMode: "SANDBOX_ONLY";
  automaticRetry: false;
}>;

export type SandboxRecoveryClaim = Readonly<{
  id: string;
  tenantId: string;
  trackingId: string;
  failedExecutionId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  ownerUserId: string;
  sourceSessionId: string;
  failureAuditEventId: string;
  idempotencyKey: string;
  attemptNumber: number;
  maximumAttempts: 3;
  status: "RUNNING";
  executionMode: "SANDBOX_ONLY";
  automaticRetry: false;
  claimedAt: string;
}>;

export type PersistedSandboxRecovery = Readonly<{
  id: string;
  tenantId: string;
  trackingId: string;
  failedExecutionId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  ownerUserId: string;
  sourceSessionId: string;
  failureAuditEventId: string;
  idempotencyKey: string;
  attemptNumber: number;
  maximumAttempts: 3;
  status: "RECOVERED" | "FAILED";
  executionMode: "SANDBOX_ONLY";
  automaticRetry: false;
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
  createdAt: string;
}>;

export type SandboxRecoveryClaimResult =
  | Readonly<{
      outcome: "CLAIMED";
      claim: SandboxRecoveryClaim;
    }>
  | Readonly<{
      outcome: "EXISTING";
      recovery: PersistedSandboxRecovery;
    }>;

export type CompleteSandboxRecoveryInput = Readonly<{
  recoveryId: string;
  tenantId: string;
  trackingId: string;
  failedExecutionId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  ownerUserId: string;
  sourceSessionId: string;
  failureAuditEventId: string;
  idempotencyKey: string;
  attemptNumber: number;
  maximumAttempts: 3;
  expectedStatus: "RUNNING";
  status: "RECOVERED" | "FAILED";
  executionMode: "SANDBOX_ONLY";
  automaticRetry: false;
  summary: string;
  output: string;
  startedAt: string;
  completedAt: string;
}>;

export type SandboxRecoveryRepository = Readonly<{
  claimRecovery: (
    input: SandboxRecoveryClaimInput,
  ) => Promise<SandboxRecoveryClaimResult>;

  completeRecovery: (
    input: CompleteSandboxRecoveryInput,
  ) => Promise<PersistedSandboxRecovery>;
}>;

export type RecoverAuthenticatedSandboxExecutionInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    recoveryReadRepository:
      SandboxRecoveryReadRepository;
    recoveryRepository: SandboxRecoveryRepository;
    recoveryExecutor: SandboxRecoveryExecutor;
    requestedTenantId?: string | null;
    trackingId: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedSandboxRecoveryResult =
  Readonly<{
    outcome: "RECOVERED" | "FAILED" | "EXISTING";

    recovery: Readonly<{
      id: string;
      tenantId: string;
      trackingId: string;
      failedExecutionId: string;
      inquiryId: string;
      recommendationId: string;
      ownerApprovalId: string;
      failureAuditEventId: string;
      attemptNumber: number;
      maximumAttempts: 3;
      status: "RECOVERED" | "FAILED";
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
      explicitRecoveryAuthorization: true;
    }>;

    safetyBoundary: Readonly<{
      automaticRetry: false;
      idempotentRecovery: true;
      maximumAttempts: 3;
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;

    nextBoundary: Readonly<{
      recoveryStatus:
        | "RESOLVED"
        | "RETRY_REVIEW_REQUIRED";
      recoveryAuditStatus: "PENDING";
    }>;
  }>;

export type SandboxRecoveryFailureCode =
  | "SANDBOX_RECOVERY_READ_REPOSITORY_MISCONFIGURED"
  | "SANDBOX_RECOVERY_REPOSITORY_MISCONFIGURED"
  | "SANDBOX_RECOVERY_EXECUTOR_MISCONFIGURED"
  | "LIVE_RECOVERY_EXECUTOR_NOT_AUTHORIZED"
  | "SANDBOX_RECOVERY_TRACKING_ID_REQUIRED"
  | "SANDBOX_RECOVERY_IDEMPOTENCY_KEY_REQUIRED"
  | "SANDBOX_RECOVERY_IDEMPOTENCY_KEY_INVALID"
  | "RECOVERABLE_FAILURE_NOT_AVAILABLE"
  | "RECOVERABLE_TRACKING_TENANT_MISMATCH"
  | "RECOVERABLE_TRACKING_IDENTITY_MISMATCH"
  | "RECOVERABLE_TRACKING_STATUS_INVALID"
  | "RECOVERABLE_TRACKING_MODE_INVALID"
  | "RECOVERABLE_TRACKING_OWNER_MISMATCH"
  | "RECOVERABLE_TRACKING_RELATION_INVALID"
  | "RECOVERABLE_TRACKING_FAILURE_DETAIL_INVALID"
  | "RECOVERABLE_AUDIT_TENANT_MISMATCH"
  | "RECOVERABLE_AUDIT_IDENTITY_MISMATCH"
  | "RECOVERABLE_AUDIT_STATUS_INVALID"
  | "RECOVERABLE_AUDIT_MODE_INVALID"
  | "RECOVERABLE_AUDIT_INTEGRITY_INVALID"
  | "RECOVERY_ATTEMPT_COUNT_INVALID"
  | "RECOVERY_MAXIMUM_ATTEMPTS_REACHED"
  | "SANDBOX_RECOVERY_CLAIM_RESULT_INVALID"
  | "SANDBOX_RECOVERY_CLAIM_ID_REQUIRED"
  | "SANDBOX_RECOVERY_CLAIM_IDENTITY_MISMATCH"
  | "SANDBOX_RECOVERY_CLAIM_STATUS_INVALID"
  | "SANDBOX_RECOVERY_EXECUTOR_OUTPUT_INVALID"
  | "SANDBOX_RECOVERY_EXECUTOR_STATUS_INVALID"
  | "SANDBOX_RECOVERY_EXECUTOR_SUMMARY_INVALID"
  | "SANDBOX_RECOVERY_EXECUTOR_RESULT_INVALID"
  | "SANDBOX_RECOVERY_EXECUTOR_STARTED_AT_INVALID"
  | "SANDBOX_RECOVERY_EXECUTOR_COMPLETED_AT_INVALID"
  | "SANDBOX_RECOVERY_PERSISTED_ID_REQUIRED"
  | "SANDBOX_RECOVERY_PERSISTED_IDENTITY_MISMATCH"
  | "SANDBOX_RECOVERY_PERSISTED_STATUS_INVALID"
  | "SANDBOX_RECOVERY_PERSISTED_MODE_INVALID"
  | "SANDBOX_RECOVERY_PERSISTED_AUTOMATION_INVALID"
  | "SANDBOX_RECOVERY_PERSISTED_DATE_INVALID";

export class SandboxRecoveryDeniedError extends Error {
  readonly code: SandboxRecoveryFailureCode;
  readonly status: number;

  constructor(
    code: SandboxRecoveryFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "SandboxRecoveryDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: SandboxRecoveryFailureCode,
  message: string,
  status = 403,
): never {
  throw new SandboxRecoveryDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: SandboxRecoveryFailureCode,
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
    "SANDBOX_RECOVERY_IDEMPOTENCY_KEY_REQUIRED",
    "A sandbox-recovery idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "SANDBOX_RECOVERY_IDEMPOTENCY_KEY_INVALID",
      "The sandbox-recovery idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireValidDate(
  value: unknown,
  code: SandboxRecoveryFailureCode,
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

function validatePersistedRecovery(
  recovery: PersistedSandboxRecovery,
  expected: Readonly<{
    recoveryId?: string;
    tenantId: string;
    trackingId: string;
    failedExecutionId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    ownerUserId: string;
    sourceSessionId: string;
    failureAuditEventId: string;
    idempotencyKey: string;
    attemptNumber: number;
  }>,
): PersistedSandboxRecovery {
  if (!recovery || typeof recovery !== "object") {
    deny(
      "SANDBOX_RECOVERY_CLAIM_RESULT_INVALID",
      "Sandbox recovery persistence returned an invalid result.",
      500,
    );
  }

  requireText(
    recovery.id,
    "SANDBOX_RECOVERY_PERSISTED_ID_REQUIRED",
    "Persisted sandbox recovery identity is required.",
    1,
    128,
  );

  if (
    expected.recoveryId !== undefined &&
    recovery.id !== expected.recoveryId
  ) {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_IDENTITY_MISMATCH",
      "Sandbox recovery identity changed during completion.",
      500,
    );
  }

  if (
    recovery.tenantId !== expected.tenantId ||
    recovery.trackingId !== expected.trackingId ||
    recovery.failedExecutionId !==
      expected.failedExecutionId ||
    recovery.inquiryId !== expected.inquiryId ||
    recovery.recommendationId !==
      expected.recommendationId ||
    recovery.ownerApprovalId !==
      expected.ownerApprovalId ||
    recovery.ownerUserId !== expected.ownerUserId ||
    recovery.sourceSessionId !==
      expected.sourceSessionId ||
    recovery.failureAuditEventId !==
      expected.failureAuditEventId ||
    recovery.idempotencyKey !==
      expected.idempotencyKey ||
    recovery.attemptNumber !==
      expected.attemptNumber ||
    recovery.maximumAttempts !== 3
  ) {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_IDENTITY_MISMATCH",
      "Persisted sandbox recovery identities are invalid.",
      500,
    );
  }

  if (
    recovery.status !== "RECOVERED" &&
    recovery.status !== "FAILED"
  ) {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_STATUS_INVALID",
      "Persisted sandbox recovery status is invalid.",
      500,
    );
  }

  if (recovery.executionMode !== "SANDBOX_ONLY") {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_MODE_INVALID",
      "Persisted sandbox recovery mode is invalid.",
      500,
    );
  }

  if (recovery.automaticRetry !== false) {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_AUTOMATION_INVALID",
      "Automatic sandbox recovery is not authorized.",
      500,
    );
  }

  requireText(
    recovery.summary,
    "SANDBOX_RECOVERY_EXECUTOR_SUMMARY_INVALID",
    "Persisted sandbox recovery summary is invalid.",
    3,
    1000,
  );

  requireText(
    recovery.output,
    "SANDBOX_RECOVERY_EXECUTOR_RESULT_INVALID",
    "Persisted sandbox recovery output is invalid.",
    1,
    8000,
  );

  const startedAt = requireValidDate(
    recovery.startedAt,
    "SANDBOX_RECOVERY_PERSISTED_DATE_INVALID",
    "Persisted sandbox recovery start time is invalid.",
  );

  const completedAt = requireValidDate(
    recovery.completedAt,
    "SANDBOX_RECOVERY_PERSISTED_DATE_INVALID",
    "Persisted sandbox recovery completion time is invalid.",
  );

  requireValidDate(
    recovery.createdAt,
    "SANDBOX_RECOVERY_PERSISTED_DATE_INVALID",
    "Persisted sandbox recovery creation time is invalid.",
  );

  if (Date.parse(completedAt) < Date.parse(startedAt)) {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_DATE_INVALID",
      "Sandbox recovery completed before it started.",
      500,
    );
  }

  return recovery;
}

function freezeResult(
  result: AuthenticatedSandboxRecoveryResult,
): AuthenticatedSandboxRecoveryResult {
  Object.freeze(result.recovery);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.nextBoundary);

  return Object.freeze(result);
}

/**
 * Performs one explicit owner-authorized recovery attempt for a failed
 * sandbox execution.
 *
 * Safety properties:
 * - requires current authenticated tenant OWNER authority;
 * - accepts only a tenant-owned failed tracking record;
 * - requires an immutable SHA-256 failure audit record;
 * - requires the original approval owner to match the authenticated owner;
 * - never performs automatic retry;
 * - permits at most three completed recovery attempts;
 * - atomically claims recovery before calling the sandbox executor;
 * - duplicate idempotency keys return the existing recovery;
 * - executor exceptions are persisted as safe failures;
 * - live-provider execution and public launch remain disabled.
 */
export async function recoverAuthenticatedSandboxExecution(
  input: RecoverAuthenticatedSandboxExecutionInput,
): Promise<AuthenticatedSandboxRecoveryResult> {
  const workspace =
    await buildAuthenticatedTenantWorkspace({
      principal: input.principal,
      accessRepositories: input.accessRepositories,
      workspaceRepository: input.workspaceRepository,
      requestedTenantId: input.requestedTenantId,
      requireOwner: true,
    });

  if (
    !input.recoveryReadRepository ||
    typeof input.recoveryReadRepository
      .findRecoverableFailure !== "function"
  ) {
    deny(
      "SANDBOX_RECOVERY_READ_REPOSITORY_MISCONFIGURED",
      "Sandbox recovery read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.recoveryRepository ||
    typeof input.recoveryRepository
      .claimRecovery !== "function" ||
    typeof input.recoveryRepository
      .completeRecovery !== "function"
  ) {
    deny(
      "SANDBOX_RECOVERY_REPOSITORY_MISCONFIGURED",
      "Sandbox recovery repository is not safely configured.",
      500,
    );
  }

  if (
    !input.recoveryExecutor ||
    typeof input.recoveryExecutor.recover !== "function"
  ) {
    deny(
      "SANDBOX_RECOVERY_EXECUTOR_MISCONFIGURED",
      "Sandbox recovery executor is not safely configured.",
      500,
    );
  }

  if (input.recoveryExecutor.mode !== "SANDBOX_ONLY") {
    deny(
      "LIVE_RECOVERY_EXECUTOR_NOT_AUTHORIZED",
      "Live-provider recovery execution is not authorized.",
    );
  }

  const trackingId = requireText(
    input.trackingId,
    "SANDBOX_RECOVERY_TRACKING_ID_REQUIRED",
    "Failed result tracking identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const snapshot =
    await input.recoveryReadRepository
      .findRecoverableFailure(
        workspace.tenant.id,
        trackingId,
      );

  if (!snapshot) {
    deny(
      "RECOVERABLE_FAILURE_NOT_AVAILABLE",
      "No recoverable sandbox failure is available to this tenant.",
    );
  }

  const tracking = snapshot.tracking;
  const auditEvent = snapshot.auditEvent;

  if (tracking.tenantId !== workspace.tenant.id) {
    deny(
      "RECOVERABLE_TRACKING_TENANT_MISMATCH",
      "The failed tracking record belongs to another tenant.",
    );
  }

  if (tracking.id !== trackingId) {
    deny(
      "RECOVERABLE_TRACKING_IDENTITY_MISMATCH",
      "The failed tracking identity is invalid.",
    );
  }

  if (
    tracking.executionStatus !== "FAILED" ||
    tracking.resultStatus !==
      "FAILED_REQUIRES_RECOVERY" ||
    tracking.trackingStatus !== "RECORDED" ||
    tracking.recoveryRequired !== true
  ) {
    deny(
      "RECOVERABLE_TRACKING_STATUS_INVALID",
      "The tracking record is not an unresolved failed execution.",
    );
  }

  if (tracking.executionMode !== "SANDBOX_ONLY") {
    deny(
      "RECOVERABLE_TRACKING_MODE_INVALID",
      "Only failed sandbox executions may be recovered.",
    );
  }

  if (
    tracking.approvalOwnerUserId !==
    workspace.actor.userId
  ) {
    deny(
      "RECOVERABLE_TRACKING_OWNER_MISMATCH",
      "The authenticated owner does not match the original approval owner.",
    );
  }

  const failedExecutionId = requireText(
    tracking.executionId,
    "RECOVERABLE_TRACKING_RELATION_INVALID",
    "Failed execution identity is invalid.",
    1,
    128,
  );

  const inquiryId = requireText(
    tracking.inquiryId,
    "RECOVERABLE_TRACKING_RELATION_INVALID",
    "Recovery inquiry identity is invalid.",
    1,
    128,
  );

  const recommendationId = requireText(
    tracking.recommendationId,
    "RECOVERABLE_TRACKING_RELATION_INVALID",
    "Recovery recommendation identity is invalid.",
    1,
    128,
  );

  const ownerApprovalId = requireText(
    tracking.ownerApprovalId,
    "RECOVERABLE_TRACKING_RELATION_INVALID",
    "Recovery owner approval identity is invalid.",
    1,
    128,
  );

  const failureSummary = requireText(
    tracking.outcomeSummary,
    "RECOVERABLE_TRACKING_FAILURE_DETAIL_INVALID",
    "Failed execution summary is invalid.",
    3,
    1000,
  );

  const failureOutputPreview = requireText(
    tracking.outputPreview,
    "RECOVERABLE_TRACKING_FAILURE_DETAIL_INVALID",
    "Failed execution output preview is invalid.",
    1,
    1000,
  );

  if (auditEvent.tenantId !== workspace.tenant.id) {
    deny(
      "RECOVERABLE_AUDIT_TENANT_MISMATCH",
      "The failure audit event belongs to another tenant.",
    );
  }

  const failureAuditEventId = requireText(
    auditEvent.id,
    "RECOVERABLE_AUDIT_IDENTITY_MISMATCH",
    "Failure audit identity is invalid.",
    1,
    128,
  );

  if (
    auditEvent.trackingId !== trackingId ||
    auditEvent.executionId !== failedExecutionId
  ) {
    deny(
      "RECOVERABLE_AUDIT_IDENTITY_MISMATCH",
      "The failure audit does not match the failed execution.",
    );
  }

  if (
    auditEvent.eventType !==
      "SANDBOX_EXECUTION_FAILED" ||
    auditEvent.outcome !== "FAILURE" ||
    auditEvent.recoveryRequired !== true
  ) {
    deny(
      "RECOVERABLE_AUDIT_STATUS_INVALID",
      "The audit event does not verify a recoverable failure.",
    );
  }

  if (auditEvent.executionMode !== "SANDBOX_ONLY") {
    deny(
      "RECOVERABLE_AUDIT_MODE_INVALID",
      "The failure audit is not sandbox-only.",
    );
  }

  if (
    auditEvent.immutable !== true ||
    auditEvent.integrityAlgorithm !== "SHA-256" ||
    !/^[a-f0-9]{64}$/.test(
      auditEvent.integrityDigest,
    )
  ) {
    deny(
      "RECOVERABLE_AUDIT_INTEGRITY_INVALID",
      "The failure audit integrity evidence is invalid.",
    );
  }

  if (
    !Number.isInteger(
      snapshot.completedRecoveryAttempts,
    ) ||
    snapshot.completedRecoveryAttempts < 0
  ) {
    deny(
      "RECOVERY_ATTEMPT_COUNT_INVALID",
      "The completed recovery attempt count is invalid.",
      500,
    );
  }

  if (snapshot.completedRecoveryAttempts >= 3) {
    deny(
      "RECOVERY_MAXIMUM_ATTEMPTS_REACHED",
      "The maximum of three sandbox recovery attempts has been reached.",
    );
  }

  const attemptNumber =
    snapshot.completedRecoveryAttempts + 1;

  const expectedIdentity = {
    tenantId: workspace.tenant.id,
    trackingId,
    failedExecutionId,
    inquiryId,
    recommendationId,
    ownerApprovalId,
    ownerUserId: workspace.actor.userId,
    sourceSessionId: workspace.actor.sessionId,
    failureAuditEventId,
    idempotencyKey,
    attemptNumber,
  } as const;

  const claimResult =
    await input.recoveryRepository.claimRecovery({
      tenantId: expectedIdentity.tenantId,
      trackingId: expectedIdentity.trackingId,
      failedExecutionId:
        expectedIdentity.failedExecutionId,
      inquiryId: expectedIdentity.inquiryId,
      recommendationId:
        expectedIdentity.recommendationId,
      ownerApprovalId:
        expectedIdentity.ownerApprovalId,
      ownerUserId: expectedIdentity.ownerUserId,
      sourceSessionId:
        expectedIdentity.sourceSessionId,
      failureAuditEventId:
        expectedIdentity.failureAuditEventId,
      idempotencyKey,
      attemptNumber,
      maximumAttempts: 3,
      status: "RUNNING",
      executionMode: "SANDBOX_ONLY",
      automaticRetry: false,
    });

  if (!claimResult || typeof claimResult !== "object") {
    deny(
      "SANDBOX_RECOVERY_CLAIM_RESULT_INVALID",
      "Sandbox recovery claim returned an invalid result.",
      500,
    );
  }

  if (claimResult.outcome === "EXISTING") {
    const existing = validatePersistedRecovery(
      claimResult.recovery,
      expectedIdentity,
    );

    return freezeResult({
      outcome: "EXISTING",

      recovery: {
        id: existing.id,
        tenantId: existing.tenantId,
        trackingId: existing.trackingId,
        failedExecutionId:
          existing.failedExecutionId,
        inquiryId: existing.inquiryId,
        recommendationId:
          existing.recommendationId,
        ownerApprovalId:
          existing.ownerApprovalId,
        failureAuditEventId:
          existing.failureAuditEventId,
        attemptNumber: existing.attemptNumber,
        maximumAttempts: 3,
        status: existing.status,
        summary: existing.summary,
        output: existing.output,
        startedAt: existing.startedAt,
        completedAt: existing.completedAt,
        createdAt: existing.createdAt,
      },

      ownerAuthority: {
        ownerUserId: workspace.actor.userId,
        sourceSessionId:
          workspace.actor.sessionId,
        role: "OWNER",
        explicitRecoveryAuthorization: true,
      },

      safetyBoundary: {
        automaticRetry: false,
        idempotentRecovery: true,
        maximumAttempts: 3,
        executionMode: "SANDBOX_ONLY",
        liveProviderExecutionAuthorized: false,
        publicLaunchAuthorized: false,
      },

      nextBoundary: {
        recoveryStatus:
          existing.status === "RECOVERED"
            ? "RESOLVED"
            : "RETRY_REVIEW_REQUIRED",
        recoveryAuditStatus: "PENDING",
      },
    });
  }

  if (
    claimResult.outcome !== "CLAIMED" ||
    !claimResult.claim
  ) {
    deny(
      "SANDBOX_RECOVERY_CLAIM_RESULT_INVALID",
      "Sandbox recovery claim outcome is invalid.",
      500,
    );
  }

  const claim = claimResult.claim;

  const recoveryId = requireText(
    claim.id,
    "SANDBOX_RECOVERY_CLAIM_ID_REQUIRED",
    "Sandbox recovery claim identity is required.",
    1,
    128,
  );

  if (
    claim.tenantId !== expectedIdentity.tenantId ||
    claim.trackingId !== expectedIdentity.trackingId ||
    claim.failedExecutionId !==
      expectedIdentity.failedExecutionId ||
    claim.inquiryId !== expectedIdentity.inquiryId ||
    claim.recommendationId !==
      expectedIdentity.recommendationId ||
    claim.ownerApprovalId !==
      expectedIdentity.ownerApprovalId ||
    claim.ownerUserId !==
      expectedIdentity.ownerUserId ||
    claim.sourceSessionId !==
      expectedIdentity.sourceSessionId ||
    claim.failureAuditEventId !==
      expectedIdentity.failureAuditEventId ||
    claim.idempotencyKey !== idempotencyKey ||
    claim.attemptNumber !== attemptNumber ||
    claim.maximumAttempts !== 3
  ) {
    deny(
      "SANDBOX_RECOVERY_CLAIM_IDENTITY_MISMATCH",
      "Sandbox recovery claim identities are invalid.",
      500,
    );
  }

  if (
    claim.status !== "RUNNING" ||
    claim.executionMode !== "SANDBOX_ONLY" ||
    claim.automaticRetry !== false
  ) {
    deny(
      "SANDBOX_RECOVERY_CLAIM_STATUS_INVALID",
      "Sandbox recovery claim status is invalid.",
      500,
    );
  }

  requireValidDate(
    claim.claimedAt,
    "SANDBOX_RECOVERY_CLAIM_STATUS_INVALID",
    "Sandbox recovery claim time is invalid.",
  );

  const safeStartedAt = new Date().toISOString();

  let executorOutput: SandboxRecoveryExecutorOutput;

  try {
    executorOutput =
      await input.recoveryExecutor.recover({
        tenantId: workspace.tenant.id,
        trackingId,
        failedExecutionId,
        inquiryId,
        recommendationId,
        ownerApprovalId,
        authorizedOwnerUserId:
          workspace.actor.userId,
        recoveryAttemptNumber: attemptNumber,
        failureSummary,
        failureOutputPreview,
        executionMode: "SANDBOX_ONLY",
      });
  } catch {
    executorOutput = {
      status: "FAILED",
      summary:
        "Sandbox recovery failed safely.",
      output:
        "No live-provider execution occurred. Explicit owner review is required before another recovery attempt.",
      startedAt: safeStartedAt,
      completedAt: new Date().toISOString(),
    };
  }

  if (
    !executorOutput ||
    typeof executorOutput !== "object"
  ) {
    deny(
      "SANDBOX_RECOVERY_EXECUTOR_OUTPUT_INVALID",
      "Sandbox recovery executor returned an invalid result.",
      500,
    );
  }

  if (
    executorOutput.status !== "RECOVERED" &&
    executorOutput.status !== "FAILED"
  ) {
    deny(
      "SANDBOX_RECOVERY_EXECUTOR_STATUS_INVALID",
      "Sandbox recovery executor status is invalid.",
      500,
    );
  }

  const summary = requireText(
    executorOutput.summary,
    "SANDBOX_RECOVERY_EXECUTOR_SUMMARY_INVALID",
    "Sandbox recovery summary is invalid.",
    3,
    1000,
  );

  const output = requireText(
    executorOutput.output,
    "SANDBOX_RECOVERY_EXECUTOR_RESULT_INVALID",
    "Sandbox recovery output is invalid.",
    1,
    8000,
  );

  const startedAt = requireValidDate(
    executorOutput.startedAt,
    "SANDBOX_RECOVERY_EXECUTOR_STARTED_AT_INVALID",
    "Sandbox recovery start time is invalid.",
  );

  const completedAt = requireValidDate(
    executorOutput.completedAt,
    "SANDBOX_RECOVERY_EXECUTOR_COMPLETED_AT_INVALID",
    "Sandbox recovery completion time is invalid.",
  );

  if (Date.parse(completedAt) < Date.parse(startedAt)) {
    deny(
      "SANDBOX_RECOVERY_EXECUTOR_COMPLETED_AT_INVALID",
      "Sandbox recovery completed before it started.",
      500,
    );
  }

  const completed =
    await input.recoveryRepository.completeRecovery({
      recoveryId,
      tenantId: expectedIdentity.tenantId,
      trackingId: expectedIdentity.trackingId,
      failedExecutionId:
        expectedIdentity.failedExecutionId,
      inquiryId: expectedIdentity.inquiryId,
      recommendationId:
        expectedIdentity.recommendationId,
      ownerApprovalId:
        expectedIdentity.ownerApprovalId,
      ownerUserId: expectedIdentity.ownerUserId,
      sourceSessionId:
        expectedIdentity.sourceSessionId,
      failureAuditEventId:
        expectedIdentity.failureAuditEventId,
      idempotencyKey,
      attemptNumber,
      maximumAttempts: 3,
      expectedStatus: "RUNNING",
      status: executorOutput.status,
      executionMode: "SANDBOX_ONLY",
      automaticRetry: false,
      summary,
      output,
      startedAt,
      completedAt,
    });

  const recovery = validatePersistedRecovery(
    completed,
    {
      ...expectedIdentity,
      recoveryId,
    },
  );

  if (recovery.status !== executorOutput.status) {
    deny(
      "SANDBOX_RECOVERY_PERSISTED_STATUS_INVALID",
      "Persisted recovery status does not match the sandbox recovery result.",
      500,
    );
  }

  return freezeResult({
    outcome:
      recovery.status === "RECOVERED"
        ? "RECOVERED"
        : "FAILED",

    recovery: {
      id: recovery.id,
      tenantId: recovery.tenantId,
      trackingId: recovery.trackingId,
      failedExecutionId:
        recovery.failedExecutionId,
      inquiryId: recovery.inquiryId,
      recommendationId:
        recovery.recommendationId,
      ownerApprovalId:
        recovery.ownerApprovalId,
      failureAuditEventId:
        recovery.failureAuditEventId,
      attemptNumber: recovery.attemptNumber,
      maximumAttempts: 3,
      status: recovery.status,
      summary: recovery.summary,
      output: recovery.output,
      startedAt: recovery.startedAt,
      completedAt: recovery.completedAt,
      createdAt: recovery.createdAt,
    },

    ownerAuthority: {
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: "OWNER",
      explicitRecoveryAuthorization: true,
    },

    safetyBoundary: {
      automaticRetry: false,
      idempotentRecovery: true,
      maximumAttempts: 3,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    nextBoundary: {
      recoveryStatus:
        recovery.status === "RECOVERED"
          ? "RESOLVED"
          : "RETRY_REVIEW_REQUIRED",
      recoveryAuditStatus: "PENDING",
    },
  });
}
