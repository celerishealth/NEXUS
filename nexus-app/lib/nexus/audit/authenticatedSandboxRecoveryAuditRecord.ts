import { createHash } from "node:crypto";

import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export type AuditableSandboxRecovery = Readonly<{
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

export type SandboxRecoveryAuditReadRepository = Readonly<{
  findRecoveryByTenantAndId: (
    tenantId: string,
    recoveryId: string,
  ) => Promise<AuditableSandboxRecovery | null>;
}>;

export type SandboxRecoveryAuditEventType =
  | "SANDBOX_RECOVERY_SUCCEEDED"
  | "SANDBOX_RECOVERY_FAILED";

export type SandboxRecoveryAuditPersistenceInput =
  Readonly<{
    tenantId: string;
    eventType: SandboxRecoveryAuditEventType;
    entityType: "SANDBOX_RECOVERY";
    entityId: string;
    recoveryId: string;
    trackingId: string;
    failedExecutionId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    failureAuditEventId: string;
    ownerUserId: string;
    actorUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    attemptNumber: number;
    maximumAttempts: 3;
    recoveryStatus: "RECOVERED" | "FAILED";
    severity: "INFO" | "ERROR";
    outcome: "SUCCESS" | "FAILURE";
    executionMode: "SANDBOX_ONLY";
    automaticRetry: false;
    occurredAt: string;
    integrityAlgorithm: "SHA-256";
    integrityDigest: string;
    immutable: true;
  }>;

export type PersistedSandboxRecoveryAuditEvent =
  SandboxRecoveryAuditPersistenceInput &
  Readonly<{
    id: string;
    createdAt: string;
  }>;

export type SandboxRecoveryAuditPersistenceResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";
    event: PersistedSandboxRecoveryAuditEvent;
  }>;

export type SandboxRecoveryAuditRepository = Readonly<{
  appendOrGetRecoveryEvent: (
    input: SandboxRecoveryAuditPersistenceInput,
  ) => Promise<SandboxRecoveryAuditPersistenceResult>;
}>;

export type RecordAuthenticatedSandboxRecoveryAuditInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    recoveryReadRepository:
      SandboxRecoveryAuditReadRepository;
    auditRepository: SandboxRecoveryAuditRepository;
    requestedTenantId?: string | null;
    recoveryId: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedSandboxRecoveryAuditResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    auditEvent: Readonly<{
      id: string;
      tenantId: string;
      eventType: SandboxRecoveryAuditEventType;
      recoveryId: string;
      trackingId: string;
      failedExecutionId: string;
      inquiryId: string;
      recommendationId: string;
      ownerApprovalId: string;
      failureAuditEventId: string;
      attemptNumber: number;
      maximumAttempts: 3;
      recoveryStatus: "RECOVERED" | "FAILED";
      severity: "INFO" | "ERROR";
      outcome: "SUCCESS" | "FAILURE";
      occurredAt: string;
      integrityAlgorithm: "SHA-256";
      integrityDigest: string;
      immutable: true;
      createdAt: string;
    }>;

    ownerAuthority: Readonly<{
      ownerUserId: string;
      sourceSessionId: string;
      role: "OWNER";
      recoveryOwnershipVerified: true;
    }>;

    safetyBoundary: Readonly<{
      appendOnlyAudit: true;
      recoveryTriggered: false;
      executionTriggered: false;
      automaticRetry: false;
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;

    nextBoundary: Readonly<{
      recoveryAuditStatus: "RECORDED";
      securityTestingStatus: "PENDING";
    }>;
  }>;

export type SandboxRecoveryAuditFailureCode =
  | "RECOVERY_AUDIT_READ_REPOSITORY_MISCONFIGURED"
  | "RECOVERY_AUDIT_REPOSITORY_MISCONFIGURED"
  | "RECOVERY_AUDIT_RECOVERY_ID_REQUIRED"
  | "RECOVERY_AUDIT_IDEMPOTENCY_KEY_REQUIRED"
  | "RECOVERY_AUDIT_IDEMPOTENCY_KEY_INVALID"
  | "AUDITABLE_RECOVERY_NOT_AVAILABLE"
  | "AUDITABLE_RECOVERY_TENANT_MISMATCH"
  | "AUDITABLE_RECOVERY_IDENTITY_MISMATCH"
  | "AUDITABLE_RECOVERY_OWNER_MISMATCH"
  | "AUDITABLE_RECOVERY_RELATION_INVALID"
  | "AUDITABLE_RECOVERY_ATTEMPT_INVALID"
  | "AUDITABLE_RECOVERY_STATUS_INVALID"
  | "AUDITABLE_RECOVERY_MODE_INVALID"
  | "AUDITABLE_RECOVERY_AUTOMATION_INVALID"
  | "AUDITABLE_RECOVERY_SUMMARY_INVALID"
  | "AUDITABLE_RECOVERY_OUTPUT_INVALID"
  | "AUDITABLE_RECOVERY_STARTED_AT_INVALID"
  | "AUDITABLE_RECOVERY_COMPLETED_AT_INVALID"
  | "AUDITABLE_RECOVERY_CREATED_AT_INVALID"
  | "RECOVERY_AUDIT_PERSISTENCE_RESULT_INVALID"
  | "RECOVERY_AUDIT_PERSISTED_ID_REQUIRED"
  | "RECOVERY_AUDIT_PERSISTED_IDENTITY_MISMATCH"
  | "RECOVERY_AUDIT_PERSISTED_STATUS_INVALID"
  | "RECOVERY_AUDIT_PERSISTED_MODE_INVALID"
  | "RECOVERY_AUDIT_PERSISTED_AUTOMATION_INVALID"
  | "RECOVERY_AUDIT_PERSISTED_IMMUTABILITY_INVALID"
  | "RECOVERY_AUDIT_PERSISTED_DIGEST_INVALID"
  | "RECOVERY_AUDIT_PERSISTED_DATE_INVALID";

export class SandboxRecoveryAuditDeniedError
  extends Error {
  readonly code: SandboxRecoveryAuditFailureCode;
  readonly status: number;

  constructor(
    code: SandboxRecoveryAuditFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "SandboxRecoveryAuditDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: SandboxRecoveryAuditFailureCode,
  message: string,
  status = 403,
): never {
  throw new SandboxRecoveryAuditDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: SandboxRecoveryAuditFailureCode,
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
    "RECOVERY_AUDIT_IDEMPOTENCY_KEY_REQUIRED",
    "A recovery-audit idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "RECOVERY_AUDIT_IDEMPOTENCY_KEY_INVALID",
      "The recovery-audit idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireValidDate(
  value: unknown,
  code: SandboxRecoveryAuditFailureCode,
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

function createIntegrityDigest(
  input: Omit<
    SandboxRecoveryAuditPersistenceInput,
    "integrityAlgorithm" | "integrityDigest"
  >,
): string {
  const canonicalPayload = JSON.stringify([
    input.tenantId,
    input.eventType,
    input.entityType,
    input.entityId,
    input.recoveryId,
    input.trackingId,
    input.failedExecutionId,
    input.inquiryId,
    input.recommendationId,
    input.ownerApprovalId,
    input.failureAuditEventId,
    input.ownerUserId,
    input.actorUserId,
    input.sourceSessionId,
    input.idempotencyKey,
    input.attemptNumber,
    input.maximumAttempts,
    input.recoveryStatus,
    input.severity,
    input.outcome,
    input.executionMode,
    input.automaticRetry,
    input.occurredAt,
    input.immutable,
  ]);

  return createHash("sha256")
    .update(canonicalPayload, "utf8")
    .digest("hex");
}

function freezeResult(
  result: AuthenticatedSandboxRecoveryAuditResult,
): AuthenticatedSandboxRecoveryAuditResult {
  Object.freeze(result.auditEvent);
  Object.freeze(result.ownerAuthority);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.nextBoundary);

  return Object.freeze(result);
}

/**
 * Appends one immutable audit event for an owner-authorized sandbox
 * recovery attempt.
 *
 * Safety properties:
 * - requires current authenticated tenant OWNER authority;
 * - recovery tenant and owner identities must match authenticated context;
 * - only completed sandbox recovery records are auditable;
 * - automatic retry must remain false;
 * - SHA-256 protects the canonical recovery audit payload;
 * - persistence is append-only and idempotent;
 * - this operation cannot invoke recovery, execution or live providers.
 */
export async function recordAuthenticatedSandboxRecoveryAudit(
  input: RecordAuthenticatedSandboxRecoveryAuditInput,
): Promise<AuthenticatedSandboxRecoveryAuditResult> {
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
      .findRecoveryByTenantAndId !== "function"
  ) {
    deny(
      "RECOVERY_AUDIT_READ_REPOSITORY_MISCONFIGURED",
      "Recovery audit read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.auditRepository ||
    typeof input.auditRepository
      .appendOrGetRecoveryEvent !== "function"
  ) {
    deny(
      "RECOVERY_AUDIT_REPOSITORY_MISCONFIGURED",
      "Recovery audit repository is not safely configured.",
      500,
    );
  }

  const recoveryId = requireText(
    input.recoveryId,
    "RECOVERY_AUDIT_RECOVERY_ID_REQUIRED",
    "Sandbox recovery identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const recovery =
    await input.recoveryReadRepository
      .findRecoveryByTenantAndId(
        workspace.tenant.id,
        recoveryId,
      );

  if (!recovery) {
    deny(
      "AUDITABLE_RECOVERY_NOT_AVAILABLE",
      "The sandbox recovery is not available to this tenant.",
    );
  }

  if (recovery.tenantId !== workspace.tenant.id) {
    deny(
      "AUDITABLE_RECOVERY_TENANT_MISMATCH",
      "The sandbox recovery belongs to another tenant.",
    );
  }

  if (recovery.id !== recoveryId) {
    deny(
      "AUDITABLE_RECOVERY_IDENTITY_MISMATCH",
      "The sandbox recovery identity is invalid.",
    );
  }

  if (recovery.ownerUserId !== workspace.actor.userId) {
    deny(
      "AUDITABLE_RECOVERY_OWNER_MISMATCH",
      "The authenticated owner does not own this recovery attempt.",
    );
  }

  const trackingId = requireText(
    recovery.trackingId,
    "AUDITABLE_RECOVERY_RELATION_INVALID",
    "Recovery tracking identity is invalid.",
    1,
    128,
  );

  const failedExecutionId = requireText(
    recovery.failedExecutionId,
    "AUDITABLE_RECOVERY_RELATION_INVALID",
    "Failed execution identity is invalid.",
    1,
    128,
  );

  const inquiryId = requireText(
    recovery.inquiryId,
    "AUDITABLE_RECOVERY_RELATION_INVALID",
    "Recovery inquiry identity is invalid.",
    1,
    128,
  );

  const recommendationId = requireText(
    recovery.recommendationId,
    "AUDITABLE_RECOVERY_RELATION_INVALID",
    "Recovery recommendation identity is invalid.",
    1,
    128,
  );

  const ownerApprovalId = requireText(
    recovery.ownerApprovalId,
    "AUDITABLE_RECOVERY_RELATION_INVALID",
    "Recovery owner approval identity is invalid.",
    1,
    128,
  );

  const failureAuditEventId = requireText(
    recovery.failureAuditEventId,
    "AUDITABLE_RECOVERY_RELATION_INVALID",
    "Recovery failure audit identity is invalid.",
    1,
    128,
  );

  if (
    !Number.isInteger(recovery.attemptNumber) ||
    recovery.attemptNumber < 1 ||
    recovery.attemptNumber > 3 ||
    recovery.maximumAttempts !== 3
  ) {
    deny(
      "AUDITABLE_RECOVERY_ATTEMPT_INVALID",
      "Recovery attempt information is invalid.",
    );
  }

  if (
    recovery.status !== "RECOVERED" &&
    recovery.status !== "FAILED"
  ) {
    deny(
      "AUDITABLE_RECOVERY_STATUS_INVALID",
      "Only completed recovery attempts may be audited.",
    );
  }

  if (recovery.executionMode !== "SANDBOX_ONLY") {
    deny(
      "AUDITABLE_RECOVERY_MODE_INVALID",
      "Only sandbox recovery attempts may be audited.",
    );
  }

  if (recovery.automaticRetry !== false) {
    deny(
      "AUDITABLE_RECOVERY_AUTOMATION_INVALID",
      "Automatic recovery attempts are not authorized.",
    );
  }

  requireText(
    recovery.summary,
    "AUDITABLE_RECOVERY_SUMMARY_INVALID",
    "Recovery summary is invalid.",
    3,
    1000,
  );

  requireText(
    recovery.output,
    "AUDITABLE_RECOVERY_OUTPUT_INVALID",
    "Recovery output is invalid.",
    1,
    8000,
  );

  const startedAt = requireValidDate(
    recovery.startedAt,
    "AUDITABLE_RECOVERY_STARTED_AT_INVALID",
    "Recovery start time is invalid.",
  );

  const completedAt = requireValidDate(
    recovery.completedAt,
    "AUDITABLE_RECOVERY_COMPLETED_AT_INVALID",
    "Recovery completion time is invalid.",
  );

  const occurredAt = requireValidDate(
    recovery.createdAt,
    "AUDITABLE_RECOVERY_CREATED_AT_INVALID",
    "Recovery creation time is invalid.",
  );

  if (Date.parse(completedAt) < Date.parse(startedAt)) {
    deny(
      "AUDITABLE_RECOVERY_COMPLETED_AT_INVALID",
      "Recovery completed before it started.",
      500,
    );
  }

  const eventType: SandboxRecoveryAuditEventType =
    recovery.status === "RECOVERED"
      ? "SANDBOX_RECOVERY_SUCCEEDED"
      : "SANDBOX_RECOVERY_FAILED";

  const severity: "INFO" | "ERROR" =
    recovery.status === "RECOVERED"
      ? "INFO"
      : "ERROR";

  const auditOutcome: "SUCCESS" | "FAILURE" =
    recovery.status === "RECOVERED"
      ? "SUCCESS"
      : "FAILURE";

  const unsignedAuditInput = {
    tenantId: workspace.tenant.id,
    eventType,
    entityType: "SANDBOX_RECOVERY",
    entityId: recoveryId,
    recoveryId,
    trackingId,
    failedExecutionId,
    inquiryId,
    recommendationId,
    ownerApprovalId,
    failureAuditEventId,
    ownerUserId: recovery.ownerUserId,
    actorUserId: workspace.actor.userId,
    sourceSessionId: workspace.actor.sessionId,
    idempotencyKey,
    attemptNumber: recovery.attemptNumber,
    maximumAttempts: 3,
    recoveryStatus: recovery.status,
    severity,
    outcome: auditOutcome,
    executionMode: "SANDBOX_ONLY",
    automaticRetry: false,
    occurredAt,
    immutable: true,
  } as const;

  const integrityDigest =
    createIntegrityDigest(unsignedAuditInput);

  const persisted =
    await input.auditRepository
      .appendOrGetRecoveryEvent({
        ...unsignedAuditInput,
        integrityAlgorithm: "SHA-256",
        integrityDigest,
      });

  if (
    !persisted ||
    (
      persisted.outcome !== "CREATED" &&
      persisted.outcome !== "EXISTING"
    ) ||
    !persisted.event
  ) {
    deny(
      "RECOVERY_AUDIT_PERSISTENCE_RESULT_INVALID",
      "Recovery audit persistence returned an invalid result.",
      500,
    );
  }

  const event = persisted.event;

  const eventId = requireText(
    event.id,
    "RECOVERY_AUDIT_PERSISTED_ID_REQUIRED",
    "Persisted recovery audit identity is required.",
    1,
    128,
  );

  if (
    event.tenantId !== workspace.tenant.id ||
    event.entityId !== recoveryId ||
    event.recoveryId !== recoveryId ||
    event.trackingId !== trackingId ||
    event.failedExecutionId !== failedExecutionId ||
    event.inquiryId !== inquiryId ||
    event.recommendationId !== recommendationId ||
    event.ownerApprovalId !== ownerApprovalId ||
    event.failureAuditEventId !==
      failureAuditEventId ||
    event.ownerUserId !== recovery.ownerUserId ||
    event.actorUserId !== workspace.actor.userId ||
    event.sourceSessionId !==
      workspace.actor.sessionId ||
    event.idempotencyKey !== idempotencyKey ||
    event.attemptNumber !== recovery.attemptNumber ||
    event.maximumAttempts !== 3
  ) {
    deny(
      "RECOVERY_AUDIT_PERSISTED_IDENTITY_MISMATCH",
      "Persisted recovery audit identities are invalid.",
      500,
    );
  }

  if (
    event.eventType !== eventType ||
    event.entityType !== "SANDBOX_RECOVERY" ||
    event.recoveryStatus !== recovery.status ||
    event.severity !== severity ||
    event.outcome !== auditOutcome
  ) {
    deny(
      "RECOVERY_AUDIT_PERSISTED_STATUS_INVALID",
      "Persisted recovery audit status is invalid.",
      500,
    );
  }

  if (event.executionMode !== "SANDBOX_ONLY") {
    deny(
      "RECOVERY_AUDIT_PERSISTED_MODE_INVALID",
      "Persisted recovery audit mode is invalid.",
      500,
    );
  }

  if (event.automaticRetry !== false) {
    deny(
      "RECOVERY_AUDIT_PERSISTED_AUTOMATION_INVALID",
      "Persisted recovery audit incorrectly authorizes automatic retry.",
      500,
    );
  }

  if (event.immutable !== true) {
    deny(
      "RECOVERY_AUDIT_PERSISTED_IMMUTABILITY_INVALID",
      "Persisted recovery audit is not immutable.",
      500,
    );
  }

  if (
    event.integrityAlgorithm !== "SHA-256" ||
    event.integrityDigest !== integrityDigest ||
    !/^[a-f0-9]{64}$/.test(event.integrityDigest)
  ) {
    deny(
      "RECOVERY_AUDIT_PERSISTED_DIGEST_INVALID",
      "Persisted recovery audit integrity digest is invalid.",
      500,
    );
  }

  const persistedOccurredAt = requireValidDate(
    event.occurredAt,
    "RECOVERY_AUDIT_PERSISTED_DATE_INVALID",
    "Persisted recovery audit occurrence time is invalid.",
  );

  const createdAt = requireValidDate(
    event.createdAt,
    "RECOVERY_AUDIT_PERSISTED_DATE_INVALID",
    "Persisted recovery audit creation time is invalid.",
  );

  if (persistedOccurredAt !== occurredAt) {
    deny(
      "RECOVERY_AUDIT_PERSISTED_DATE_INVALID",
      "Persisted recovery audit occurrence time is invalid.",
      500,
    );
  }

  return freezeResult({
    outcome: persisted.outcome,

    auditEvent: {
      id: eventId,
      tenantId: workspace.tenant.id,
      eventType,
      recoveryId,
      trackingId,
      failedExecutionId,
      inquiryId,
      recommendationId,
      ownerApprovalId,
      failureAuditEventId,
      attemptNumber: recovery.attemptNumber,
      maximumAttempts: 3,
      recoveryStatus: recovery.status,
      severity,
      outcome: auditOutcome,
      occurredAt,
      integrityAlgorithm: "SHA-256",
      integrityDigest,
      immutable: true,
      createdAt,
    },

    ownerAuthority: {
      ownerUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: "OWNER",
      recoveryOwnershipVerified: true,
    },

    safetyBoundary: {
      appendOnlyAudit: true,
      recoveryTriggered: false,
      executionTriggered: false,
      automaticRetry: false,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    nextBoundary: {
      recoveryAuditStatus: "RECORDED",
      securityTestingStatus: "PENDING",
    },
  });
}
