import { createHash } from "node:crypto";

import type {
  AuthenticatedPrincipal,
  TenantAccessRepositories,
} from "../auth/tenantAccessContext";

import {
  buildAuthenticatedTenantWorkspace,
  type TenantWorkspaceRepository,
} from "../onboarding/authenticatedTenantWorkspace";

export type AuditableExecutionTrackingRecord = Readonly<{
  id: string;
  tenantId: string;
  executionId: string;
  inquiryId: string;
  recommendationId: string;
  ownerApprovalId: string;
  trackedByUserId: string;
  executionStatus: "SUCCEEDED" | "FAILED";
  resultStatus:
    | "AVAILABLE"
    | "FAILED_REQUIRES_RECOVERY";
  trackingStatus: "RECORDED";
  executionMode: "SANDBOX_ONLY";
  recoveryRequired: boolean;
  createdAt: string;
}>;

export type ExecutionAuditTrackingReadRepository =
  Readonly<{
    findTrackingByTenantAndId: (
      tenantId: string,
      trackingId: string,
    ) => Promise<AuditableExecutionTrackingRecord | null>;
  }>;

export type ExecutionAuditEventType =
  | "SANDBOX_EXECUTION_SUCCEEDED"
  | "SANDBOX_EXECUTION_FAILED";

export type ExecutionAuditPersistenceInput =
  Readonly<{
    tenantId: string;
    eventType: ExecutionAuditEventType;
    entityType: "EXECUTION_RESULT_TRACKING";
    entityId: string;
    trackingId: string;
    executionId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    actorUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    severity: "INFO" | "ERROR";
    outcome: "SUCCESS" | "FAILURE";
    recoveryRequired: boolean;
    executionMode: "SANDBOX_ONLY";
    occurredAt: string;
    integrityAlgorithm: "SHA-256";
    integrityDigest: string;
    immutable: true;
  }>;

export type PersistedExecutionAuditEvent =
  Readonly<{
    id: string;
    tenantId: string;
    eventType: ExecutionAuditEventType;
    entityType: "EXECUTION_RESULT_TRACKING";
    entityId: string;
    trackingId: string;
    executionId: string;
    inquiryId: string;
    recommendationId: string;
    ownerApprovalId: string;
    actorUserId: string;
    sourceSessionId: string;
    idempotencyKey: string;
    severity: "INFO" | "ERROR";
    outcome: "SUCCESS" | "FAILURE";
    recoveryRequired: boolean;
    executionMode: "SANDBOX_ONLY";
    occurredAt: string;
    integrityAlgorithm: "SHA-256";
    integrityDigest: string;
    immutable: true;
    createdAt: string;
  }>;

export type ExecutionAuditPersistenceResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";
    event: PersistedExecutionAuditEvent;
  }>;

export type ExecutionAuditRepository = Readonly<{
  appendOrGetEvent: (
    input: ExecutionAuditPersistenceInput,
  ) => Promise<ExecutionAuditPersistenceResult>;
}>;

export type RecordAuthenticatedExecutionAuditInput =
  Readonly<{
    principal: AuthenticatedPrincipal | null | undefined;
    accessRepositories: TenantAccessRepositories;
    workspaceRepository: TenantWorkspaceRepository;
    trackingReadRepository:
      ExecutionAuditTrackingReadRepository;
    auditRepository: ExecutionAuditRepository;
    requestedTenantId?: string | null;
    trackingId: string;
    idempotencyKey: string;
  }>;

export type AuthenticatedExecutionAuditResult =
  Readonly<{
    outcome: "CREATED" | "EXISTING";

    auditEvent: Readonly<{
      id: string;
      tenantId: string;
      eventType: ExecutionAuditEventType;
      trackingId: string;
      executionId: string;
      inquiryId: string;
      recommendationId: string;
      ownerApprovalId: string;
      severity: "INFO" | "ERROR";
      outcome: "SUCCESS" | "FAILURE";
      recoveryRequired: boolean;
      occurredAt: string;
      integrityAlgorithm: "SHA-256";
      integrityDigest: string;
      immutable: true;
      createdAt: string;
    }>;

    auditAuthority: Readonly<{
      actorUserId: string;
      sourceSessionId: string;
      role: "OWNER" | "ADMIN" | "OPERATOR";
    }>;

    safetyBoundary: Readonly<{
      appendOnlyAudit: true;
      resultOnlyOperation: true;
      executionTriggered: false;
      executionMode: "SANDBOX_ONLY";
      liveProviderExecutionAuthorized: false;
      publicLaunchAuthorized: false;
    }>;

    nextBoundary: Readonly<{
      auditStatus: "RECORDED";
      recoveryStatus:
        | "NOT_REQUIRED"
        | "REQUIRED";
    }>;
  }>;

export type ExecutionAuditFailureCode =
  | "EXECUTION_AUDIT_ROLE_NOT_AUTHORIZED"
  | "EXECUTION_AUDIT_TRACKING_REPOSITORY_MISCONFIGURED"
  | "EXECUTION_AUDIT_REPOSITORY_MISCONFIGURED"
  | "EXECUTION_AUDIT_TRACKING_ID_REQUIRED"
  | "EXECUTION_AUDIT_IDEMPOTENCY_KEY_REQUIRED"
  | "EXECUTION_AUDIT_IDEMPOTENCY_KEY_INVALID"
  | "AUDITABLE_TRACKING_NOT_AVAILABLE"
  | "AUDITABLE_TRACKING_TENANT_MISMATCH"
  | "AUDITABLE_TRACKING_IDENTITY_MISMATCH"
  | "AUDITABLE_TRACKING_STATUS_INVALID"
  | "AUDITABLE_TRACKING_MODE_INVALID"
  | "AUDITABLE_TRACKING_RELATION_ID_INVALID"
  | "AUDITABLE_TRACKING_RESULT_INVALID"
  | "AUDITABLE_TRACKING_RECOVERY_INVALID"
  | "AUDITABLE_TRACKING_CREATED_AT_INVALID"
  | "EXECUTION_AUDIT_PERSISTENCE_RESULT_INVALID"
  | "EXECUTION_AUDIT_PERSISTED_ID_REQUIRED"
  | "EXECUTION_AUDIT_PERSISTED_IDENTITY_MISMATCH"
  | "EXECUTION_AUDIT_PERSISTED_STATUS_INVALID"
  | "EXECUTION_AUDIT_PERSISTED_MODE_INVALID"
  | "EXECUTION_AUDIT_PERSISTED_IMMUTABILITY_INVALID"
  | "EXECUTION_AUDIT_PERSISTED_DIGEST_INVALID"
  | "EXECUTION_AUDIT_PERSISTED_DATE_INVALID";

export class ExecutionAuditDeniedError extends Error {
  readonly code: ExecutionAuditFailureCode;
  readonly status: number;

  constructor(
    code: ExecutionAuditFailureCode,
    message: string,
    status = 403,
  ) {
    super(message);
    this.name = "ExecutionAuditDeniedError";
    this.code = code;
    this.status = status;
  }
}

function deny(
  code: ExecutionAuditFailureCode,
  message: string,
  status = 403,
): never {
  throw new ExecutionAuditDeniedError(
    code,
    message,
    status,
  );
}

function requireText(
  value: unknown,
  code: ExecutionAuditFailureCode,
  message: string,
  minimumLength = 1,
  maximumLength = 256,
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
    "EXECUTION_AUDIT_IDEMPOTENCY_KEY_REQUIRED",
    "An execution-audit idempotency key is required.",
    8,
    128,
  );

  if (!/^[A-Za-z0-9._:-]+$/.test(normalized)) {
    deny(
      "EXECUTION_AUDIT_IDEMPOTENCY_KEY_INVALID",
      "The execution-audit idempotency key is invalid.",
      400,
    );
  }

  return normalized;
}

function requireValidDate(
  value: unknown,
  code: ExecutionAuditFailureCode,
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
    ExecutionAuditPersistenceInput,
    "integrityAlgorithm" | "integrityDigest"
  >,
): string {
  const canonicalPayload = JSON.stringify([
    input.tenantId,
    input.eventType,
    input.entityType,
    input.entityId,
    input.trackingId,
    input.executionId,
    input.inquiryId,
    input.recommendationId,
    input.ownerApprovalId,
    input.actorUserId,
    input.sourceSessionId,
    input.idempotencyKey,
    input.severity,
    input.outcome,
    input.recoveryRequired,
    input.executionMode,
    input.occurredAt,
    input.immutable,
  ]);

  return createHash("sha256")
    .update(canonicalPayload, "utf8")
    .digest("hex");
}

function freezeResult(
  result: AuthenticatedExecutionAuditResult,
): AuthenticatedExecutionAuditResult {
  Object.freeze(result.auditEvent);
  Object.freeze(result.auditAuthority);
  Object.freeze(result.safetyBoundary);
  Object.freeze(result.nextBoundary);

  return Object.freeze(result);
}

/**
 * Appends one immutable audit event for a recorded sandbox result.
 *
 * Safety properties:
 * - tenant identity comes only from authenticated context;
 * - VIEWER membership cannot create audit records;
 * - only tenant-owned, recorded sandbox results are accepted;
 * - success, failure and recovery status must remain consistent;
 * - SHA-256 digest protects the canonical audit payload;
 * - persistence is append-only and idempotent;
 * - persisted identities and integrity digest are revalidated;
 * - this operation cannot invoke or repeat execution.
 */
export async function recordAuthenticatedExecutionAudit(
  input: RecordAuthenticatedExecutionAuditInput,
): Promise<AuthenticatedExecutionAuditResult> {
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
      "EXECUTION_AUDIT_ROLE_NOT_AUTHORIZED",
      "Viewer membership cannot create execution audit records.",
    );
  }

  if (
    !input.trackingReadRepository ||
    typeof input.trackingReadRepository
      .findTrackingByTenantAndId !== "function"
  ) {
    deny(
      "EXECUTION_AUDIT_TRACKING_REPOSITORY_MISCONFIGURED",
      "Execution tracking read repository is not safely configured.",
      500,
    );
  }

  if (
    !input.auditRepository ||
    typeof input.auditRepository
      .appendOrGetEvent !== "function"
  ) {
    deny(
      "EXECUTION_AUDIT_REPOSITORY_MISCONFIGURED",
      "Execution audit repository is not safely configured.",
      500,
    );
  }

  const trackingId = requireText(
    input.trackingId,
    "EXECUTION_AUDIT_TRACKING_ID_REQUIRED",
    "Execution result tracking identity is required.",
    1,
    128,
  );

  const idempotencyKey = normalizeIdempotencyKey(
    input.idempotencyKey,
  );

  const tracking =
    await input.trackingReadRepository
      .findTrackingByTenantAndId(
        workspace.tenant.id,
        trackingId,
      );

  if (!tracking) {
    deny(
      "AUDITABLE_TRACKING_NOT_AVAILABLE",
      "The execution result tracking record is not available to this tenant.",
    );
  }

  if (tracking.tenantId !== workspace.tenant.id) {
    deny(
      "AUDITABLE_TRACKING_TENANT_MISMATCH",
      "The execution result tracking record belongs to another tenant.",
    );
  }

  if (tracking.id !== trackingId) {
    deny(
      "AUDITABLE_TRACKING_IDENTITY_MISMATCH",
      "The execution result tracking identity is invalid.",
    );
  }

  if (tracking.trackingStatus !== "RECORDED") {
    deny(
      "AUDITABLE_TRACKING_STATUS_INVALID",
      "Only recorded execution results may be audited.",
    );
  }

  if (tracking.executionMode !== "SANDBOX_ONLY") {
    deny(
      "AUDITABLE_TRACKING_MODE_INVALID",
      "Only sandbox execution results may be audited.",
    );
  }

  const executionId = requireText(
    tracking.executionId,
    "AUDITABLE_TRACKING_RELATION_ID_INVALID",
    "Execution identity is invalid.",
    1,
    128,
  );

  const inquiryId = requireText(
    tracking.inquiryId,
    "AUDITABLE_TRACKING_RELATION_ID_INVALID",
    "Inquiry identity is invalid.",
    1,
    128,
  );

  const recommendationId = requireText(
    tracking.recommendationId,
    "AUDITABLE_TRACKING_RELATION_ID_INVALID",
    "Recommendation identity is invalid.",
    1,
    128,
  );

  const ownerApprovalId = requireText(
    tracking.ownerApprovalId,
    "AUDITABLE_TRACKING_RELATION_ID_INVALID",
    "Owner approval identity is invalid.",
    1,
    128,
  );

  requireText(
    tracking.trackedByUserId,
    "AUDITABLE_TRACKING_RELATION_ID_INVALID",
    "Result tracking actor identity is invalid.",
    1,
    128,
  );

  if (
    tracking.executionStatus !== "SUCCEEDED" &&
    tracking.executionStatus !== "FAILED"
  ) {
    deny(
      "AUDITABLE_TRACKING_RESULT_INVALID",
      "Execution tracking status is invalid.",
    );
  }

  const expectedResultStatus =
    tracking.executionStatus === "SUCCEEDED"
      ? "AVAILABLE"
      : "FAILED_REQUIRES_RECOVERY";

  const expectedRecoveryRequired =
    tracking.executionStatus === "FAILED";

  if (tracking.resultStatus !== expectedResultStatus) {
    deny(
      "AUDITABLE_TRACKING_RESULT_INVALID",
      "Execution result status is inconsistent.",
    );
  }

  if (
    tracking.recoveryRequired !==
    expectedRecoveryRequired
  ) {
    deny(
      "AUDITABLE_TRACKING_RECOVERY_INVALID",
      "Execution recovery requirement is inconsistent.",
    );
  }

  const occurredAt = requireValidDate(
    tracking.createdAt,
    "AUDITABLE_TRACKING_CREATED_AT_INVALID",
    "Execution result tracking creation time is invalid.",
  );

  const eventType: ExecutionAuditEventType =
    tracking.executionStatus === "SUCCEEDED"
      ? "SANDBOX_EXECUTION_SUCCEEDED"
      : "SANDBOX_EXECUTION_FAILED";

  const severity =
    tracking.executionStatus === "SUCCEEDED"
      ? "INFO"
      : "ERROR";

  const auditOutcome =
    tracking.executionStatus === "SUCCEEDED"
      ? "SUCCESS"
      : "FAILURE";

  const unsignedAuditInput = {
    tenantId: workspace.tenant.id,
    eventType,
    entityType: "EXECUTION_RESULT_TRACKING",
    entityId: trackingId,
    trackingId,
    executionId,
    inquiryId,
    recommendationId,
    ownerApprovalId,
    actorUserId: workspace.actor.userId,
    sourceSessionId: workspace.actor.sessionId,
    idempotencyKey,
    severity,
    outcome: auditOutcome,
    recoveryRequired: expectedRecoveryRequired,
    executionMode: "SANDBOX_ONLY",
    occurredAt,
    immutable: true,
  } as const;

  const integrityDigest =
    createIntegrityDigest(unsignedAuditInput);

  const persisted =
    await input.auditRepository.appendOrGetEvent({
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
      "EXECUTION_AUDIT_PERSISTENCE_RESULT_INVALID",
      "Execution audit persistence returned an invalid result.",
      500,
    );
  }

  const event = persisted.event;

  const eventId = requireText(
    event.id,
    "EXECUTION_AUDIT_PERSISTED_ID_REQUIRED",
    "Persisted execution audit identity is required.",
    1,
    128,
  );

  if (
    event.tenantId !== workspace.tenant.id ||
    event.entityId !== trackingId ||
    event.trackingId !== trackingId ||
    event.executionId !== executionId ||
    event.inquiryId !== inquiryId ||
    event.recommendationId !== recommendationId ||
    event.ownerApprovalId !== ownerApprovalId ||
    event.actorUserId !== workspace.actor.userId ||
    event.sourceSessionId !==
      workspace.actor.sessionId ||
    event.idempotencyKey !== idempotencyKey
  ) {
    deny(
      "EXECUTION_AUDIT_PERSISTED_IDENTITY_MISMATCH",
      "Persisted execution audit identities are invalid.",
      500,
    );
  }

  if (
    event.eventType !== eventType ||
    event.entityType !==
      "EXECUTION_RESULT_TRACKING" ||
    event.severity !== severity ||
    event.outcome !== auditOutcome ||
    event.recoveryRequired !==
      expectedRecoveryRequired
  ) {
    deny(
      "EXECUTION_AUDIT_PERSISTED_STATUS_INVALID",
      "Persisted execution audit status is invalid.",
      500,
    );
  }

  if (event.executionMode !== "SANDBOX_ONLY") {
    deny(
      "EXECUTION_AUDIT_PERSISTED_MODE_INVALID",
      "Persisted execution audit mode is invalid.",
      500,
    );
  }

  if (event.immutable !== true) {
    deny(
      "EXECUTION_AUDIT_PERSISTED_IMMUTABILITY_INVALID",
      "Persisted execution audit event is not immutable.",
      500,
    );
  }

  if (
    event.integrityAlgorithm !== "SHA-256" ||
    event.integrityDigest !== integrityDigest ||
    !/^[a-f0-9]{64}$/.test(event.integrityDigest)
  ) {
    deny(
      "EXECUTION_AUDIT_PERSISTED_DIGEST_INVALID",
      "Persisted execution audit integrity digest is invalid.",
      500,
    );
  }

  const persistedOccurredAt = requireValidDate(
    event.occurredAt,
    "EXECUTION_AUDIT_PERSISTED_DATE_INVALID",
    "Persisted execution audit occurrence time is invalid.",
  );

  const createdAt = requireValidDate(
    event.createdAt,
    "EXECUTION_AUDIT_PERSISTED_DATE_INVALID",
    "Persisted execution audit creation time is invalid.",
  );

  if (persistedOccurredAt !== occurredAt) {
    deny(
      "EXECUTION_AUDIT_PERSISTED_DATE_INVALID",
      "Persisted audit occurrence time does not match the tracked result.",
      500,
    );
  }

  return freezeResult({
    outcome: persisted.outcome,

    auditEvent: {
      id: eventId,
      tenantId: workspace.tenant.id,
      eventType,
      trackingId,
      executionId,
      inquiryId,
      recommendationId,
      ownerApprovalId,
      severity,
      outcome: auditOutcome,
      recoveryRequired:
        expectedRecoveryRequired,
      occurredAt,
      integrityAlgorithm: "SHA-256",
      integrityDigest,
      immutable: true,
      createdAt,
    },

    auditAuthority: {
      actorUserId: workspace.actor.userId,
      sourceSessionId: workspace.actor.sessionId,
      role: workspace.actor.role,
    },

    safetyBoundary: {
      appendOnlyAudit: true,
      resultOnlyOperation: true,
      executionTriggered: false,
      executionMode: "SANDBOX_ONLY",
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },

    nextBoundary: {
      auditStatus: "RECORDED",
      recoveryStatus:
        expectedRecoveryRequired
          ? "REQUIRED"
          : "NOT_REQUIRED",
    },
  });
}
