export type OwnerExecutionState =
  | "approved"
  | "executing"
  | "succeeded"
  | "failed"
  | "rejected";

export interface AuthenticatedOwnerContext {
  authenticated: boolean;
  ownerId: string | null;
  tenantId: string | null;
}

export interface PersistedOwnerExecutionResult {
  tenantId: string;
  ownerId: string;
  inquiryId: string;
  decisionId: string;
  executionId: string;
  idempotencyKey: string;
  state: OwnerExecutionState;
  publicResult: Record<string, unknown> | null;
  failureCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerExecutionResultRepository {
  findLatestByInquiry(input: {
    tenantId: string;
    inquiryId: string;
  }): Promise<PersistedOwnerExecutionResult | null>;
}

export type OwnerExecutionResultView =
  | {
      found: false;
      tenantId: string;
      inquiryId: string;
      status: "not_started";
      version: null;
      executionId: null;
      decisionId: null;
      idempotencyKey: null;
      updatedAt: null;
      result: null;
      failureCode: null;
    }
  | {
      found: true;
      tenantId: string;
      inquiryId: string;
      status: OwnerExecutionState;
      version: string;
      executionId: string;
      decisionId: string;
      idempotencyKey: string;
      updatedAt: string;
      result: Record<string, unknown> | null;
      failureCode: string | null;
    };

export type OwnerExecutionResultAccessErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_OWNER_CONTEXT"
  | "CROSS_TENANT_ACCESS"
  | "INVALID_INQUIRY_ID"
  | "RECORD_TENANT_MISMATCH"
  | "RECORD_OWNER_MISMATCH"
  | "RECORD_INQUIRY_MISMATCH"
  | "INVALID_EXECUTION_RECORD";

export class OwnerExecutionResultAccessError extends Error {
  readonly code: OwnerExecutionResultAccessErrorCode;

  constructor(
    code: OwnerExecutionResultAccessErrorCode,
    message = "Execution result access denied.",
  ) {
    super(message);
    this.name = "OwnerExecutionResultAccessError";
    this.code = code;
  }
}

function requireNonEmpty(value: string | null, code: OwnerExecutionResultAccessErrorCode): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new OwnerExecutionResultAccessError(code);
  }

  return normalized;
}

function isKnownState(value: string): value is OwnerExecutionState {
  return (
    value === "approved" ||
    value === "executing" ||
    value === "succeeded" ||
    value === "failed" ||
    value === "rejected"
  );
}

function normalizeFailureCode(value: string | null): string {
  const normalized = value
    ?.trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_:-]/g, "_")
    .slice(0, 64);

  return normalized || "SANDBOX_EXECUTION_FAILED";
}

function createStableVersion(record: PersistedOwnerExecutionResult): string {
  const source = [
    record.tenantId,
    record.ownerId,
    record.inquiryId,
    record.decisionId,
    record.executionId,
    record.idempotencyKey,
    record.state,
    record.updatedAt,
  ].join("|");

  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `erv1_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function validatePersistedRecord(record: PersistedOwnerExecutionResult): void {
  const requiredValues = [
    record.tenantId,
    record.ownerId,
    record.inquiryId,
    record.decisionId,
    record.executionId,
    record.idempotencyKey,
    record.createdAt,
    record.updatedAt,
  ];

  if (
    requiredValues.some((value) => typeof value !== "string" || value.trim().length === 0) ||
    !isKnownState(record.state) ||
    Number.isNaN(Date.parse(record.createdAt)) ||
    Number.isNaN(Date.parse(record.updatedAt))
  ) {
    throw new OwnerExecutionResultAccessError("INVALID_EXECUTION_RECORD");
  }
}

export async function trackOwnerExecutionResult(input: {
  context: AuthenticatedOwnerContext;
  requestedTenantId: string;
  inquiryId: string;
  repository: OwnerExecutionResultRepository;
}): Promise<OwnerExecutionResultView> {
  if (input.context.authenticated !== true) {
    throw new OwnerExecutionResultAccessError("UNAUTHENTICATED");
  }

  const ownerId = requireNonEmpty(input.context.ownerId, "INVALID_OWNER_CONTEXT");
  const contextTenantId = requireNonEmpty(
    input.context.tenantId,
    "INVALID_OWNER_CONTEXT",
  );
  const requestedTenantId = requireNonEmpty(
    input.requestedTenantId,
    "CROSS_TENANT_ACCESS",
  );
  const inquiryId = requireNonEmpty(input.inquiryId, "INVALID_INQUIRY_ID");

  if (requestedTenantId !== contextTenantId) {
    throw new OwnerExecutionResultAccessError("CROSS_TENANT_ACCESS");
  }

  const record = await input.repository.findLatestByInquiry({
    tenantId: contextTenantId,
    inquiryId,
  });

  if (!record) {
    return {
      found: false,
      tenantId: contextTenantId,
      inquiryId,
      status: "not_started",
      version: null,
      executionId: null,
      decisionId: null,
      idempotencyKey: null,
      updatedAt: null,
      result: null,
      failureCode: null,
    };
  }

  validatePersistedRecord(record);

  if (record.tenantId !== contextTenantId) {
    throw new OwnerExecutionResultAccessError("RECORD_TENANT_MISMATCH");
  }

  if (record.ownerId !== ownerId) {
    throw new OwnerExecutionResultAccessError("RECORD_OWNER_MISMATCH");
  }

  if (record.inquiryId !== inquiryId) {
    throw new OwnerExecutionResultAccessError("RECORD_INQUIRY_MISMATCH");
  }

  return {
    found: true,
    tenantId: record.tenantId,
    inquiryId: record.inquiryId,
    status: record.state,
    version: createStableVersion(record),
    executionId: record.executionId,
    decisionId: record.decisionId,
    idempotencyKey: record.idempotencyKey,
    updatedAt: record.updatedAt,
    result: record.state === "succeeded" ? record.publicResult : null,
    failureCode:
      record.state === "failed"
        ? normalizeFailureCode(record.failureCode)
        : null,
  };
}
