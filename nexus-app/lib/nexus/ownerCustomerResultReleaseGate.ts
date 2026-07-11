export type SandboxExecutionState =
  | "approved"
  | "executing"
  | "succeeded"
  | "failed"
  | "rejected";

export interface AuthenticatedOwnerReleaseContext {
  authenticated: boolean;
  ownerId: string | null;
  tenantId: string | null;
}

export interface PersistedOwnerApprovedSandboxExecution {
  tenantId: string;
  ownerId: string;
  customerId: string;
  inquiryId: string;
  decisionId: string;
  executionId: string;
  state: SandboxExecutionState;
  publicResult: Record<string, unknown> | null;
  failureCode: string | null;
  updatedAt: string;
}

export interface CustomerSafeSandboxResult {
  summary: string;
  recommendation: string | null;
  nextStep: string | null;
  reference: string | null;
  status: "completed";
  mode: "sandbox";
}

export interface CustomerResultReleaseRecord {
  releaseId: string;
  releaseIdempotencyKey: string;
  tenantId: string;
  ownerId: string;
  customerId: string;
  inquiryId: string;
  decisionId: string;
  executionId: string;
  status: "released";
  result: CustomerSafeSandboxResult;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerCustomerResultReleaseRepository {
  findExecution(input: {
    tenantId: string;
    executionId: string;
  }): Promise<PersistedOwnerApprovedSandboxExecution | null>;

  findReleaseByIdempotencyKey(input: {
    tenantId: string;
    releaseIdempotencyKey: string;
  }): Promise<CustomerResultReleaseRecord | null>;

  insertReleaseIfAbsent(input: {
    release: CustomerResultReleaseRecord;
  }): Promise<{
    created: boolean;
    release: CustomerResultReleaseRecord;
  }>;
}

export type OwnerCustomerResultReleaseErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_OWNER_CONTEXT"
  | "CROSS_TENANT_ACCESS"
  | "INVALID_REQUEST"
  | "EXECUTION_NOT_FOUND"
  | "INVALID_EXECUTION_RECORD"
  | "EXECUTION_TENANT_MISMATCH"
  | "EXECUTION_OWNER_MISMATCH"
  | "EXECUTION_CUSTOMER_MISMATCH"
  | "EXECUTION_INQUIRY_MISMATCH"
  | "EXECUTION_NOT_SUCCEEDED"
  | "UNSAFE_CUSTOMER_RESULT"
  | "INVALID_RELEASE_RECORD"
  | "IDEMPOTENCY_CONFLICT";

export class OwnerCustomerResultReleaseError extends Error {
  readonly code: OwnerCustomerResultReleaseErrorCode;

  constructor(
    code: OwnerCustomerResultReleaseErrorCode,
    message = "Customer result release denied.",
  ) {
    super(message);
    this.name = "OwnerCustomerResultReleaseError";
    this.code = code;
  }
}

function requireString(
  value: string | null | undefined,
  code: OwnerCustomerResultReleaseErrorCode,
  maximumLength = 256,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new OwnerCustomerResultReleaseError(code);
  }

  return normalized;
}

function isKnownExecutionState(value: string): value is SandboxExecutionState {
  return (
    value === "approved" ||
    value === "executing" ||
    value === "succeeded" ||
    value === "failed" ||
    value === "rejected"
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readRequiredPublicString(
  source: Record<string, unknown>,
  key: string,
  maximumLength: number,
): string {
  const value = source[key];

  if (typeof value !== "string") {
    throw new OwnerCustomerResultReleaseError("UNSAFE_CUSTOMER_RESULT");
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new OwnerCustomerResultReleaseError("UNSAFE_CUSTOMER_RESULT");
  }

  return normalized;
}

function readOptionalPublicString(
  source: Record<string, unknown>,
  key: string,
  maximumLength: number,
): string | null {
  const value = source[key];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new OwnerCustomerResultReleaseError("UNSAFE_CUSTOMER_RESULT");
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > maximumLength) {
    throw new OwnerCustomerResultReleaseError("UNSAFE_CUSTOMER_RESULT");
  }

  return normalized;
}

function projectCustomerSafeResult(
  publicResult: Record<string, unknown> | null,
): CustomerSafeSandboxResult {
  if (!isPlainRecord(publicResult)) {
    throw new OwnerCustomerResultReleaseError("UNSAFE_CUSTOMER_RESULT");
  }

  return {
    summary: readRequiredPublicString(publicResult, "summary", 2000),
    recommendation: readOptionalPublicString(
      publicResult,
      "recommendation",
      2000,
    ),
    nextStep: readOptionalPublicString(publicResult, "nextStep", 2000),
    reference: readOptionalPublicString(publicResult, "reference", 256),
    status: "completed",
    mode: "sandbox",
  };
}

function createStableIdentifier(prefix: string, source: string): string {
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${prefix}_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function validateExecutionRecord(
  record: PersistedOwnerApprovedSandboxExecution,
): void {
  const requiredValues = [
    record.tenantId,
    record.ownerId,
    record.customerId,
    record.inquiryId,
    record.decisionId,
    record.executionId,
    record.updatedAt,
  ];

  if (
    requiredValues.some(
      (value) => typeof value !== "string" || value.trim().length === 0,
    ) ||
    !isKnownExecutionState(record.state) ||
    Number.isNaN(Date.parse(record.updatedAt))
  ) {
    throw new OwnerCustomerResultReleaseError(
      "INVALID_EXECUTION_RECORD",
    );
  }
}

function validateReleaseRecord(
  record: CustomerResultReleaseRecord,
): void {
  const requiredValues = [
    record.releaseId,
    record.releaseIdempotencyKey,
    record.tenantId,
    record.ownerId,
    record.customerId,
    record.inquiryId,
    record.decisionId,
    record.executionId,
    record.createdAt,
    record.updatedAt,
  ];

  if (
    requiredValues.some(
      (value) => typeof value !== "string" || value.trim().length === 0,
    ) ||
    record.status !== "released" ||
    Number.isNaN(Date.parse(record.createdAt)) ||
    Number.isNaN(Date.parse(record.updatedAt)) ||
    record.result.status !== "completed" ||
    record.result.mode !== "sandbox" ||
    !record.result.summary.trim()
  ) {
    throw new OwnerCustomerResultReleaseError(
      "INVALID_RELEASE_RECORD",
    );
  }
}

function recordsMatch(
  actual: CustomerResultReleaseRecord,
  expected: CustomerResultReleaseRecord,
): boolean {
  return (
    actual.releaseId === expected.releaseId &&
    actual.releaseIdempotencyKey === expected.releaseIdempotencyKey &&
    actual.tenantId === expected.tenantId &&
    actual.ownerId === expected.ownerId &&
    actual.customerId === expected.customerId &&
    actual.inquiryId === expected.inquiryId &&
    actual.decisionId === expected.decisionId &&
    actual.executionId === expected.executionId &&
    actual.status === expected.status &&
    JSON.stringify(actual.result) === JSON.stringify(expected.result)
  );
}

export async function releaseOwnerApprovedCustomerResult(input: {
  context: AuthenticatedOwnerReleaseContext;
  requestedTenantId: string;
  customerId: string;
  inquiryId: string;
  executionId: string;
  repository: OwnerCustomerResultReleaseRepository;
  nowIso?: string;
}): Promise<{
  created: boolean;
  release: CustomerResultReleaseRecord;
}> {
  if (input.context.authenticated !== true) {
    throw new OwnerCustomerResultReleaseError("UNAUTHENTICATED");
  }

  const ownerId = requireString(
    input.context.ownerId,
    "INVALID_OWNER_CONTEXT",
  );

  const contextTenantId = requireString(
    input.context.tenantId,
    "INVALID_OWNER_CONTEXT",
  );

  const requestedTenantId = requireString(
    input.requestedTenantId,
    "CROSS_TENANT_ACCESS",
  );

  if (requestedTenantId !== contextTenantId) {
    throw new OwnerCustomerResultReleaseError("CROSS_TENANT_ACCESS");
  }

  const customerId = requireString(
    input.customerId,
    "INVALID_REQUEST",
  );

  const inquiryId = requireString(
    input.inquiryId,
    "INVALID_REQUEST",
  );

  const executionId = requireString(
    input.executionId,
    "INVALID_REQUEST",
  );

  const execution = await input.repository.findExecution({
    tenantId: contextTenantId,
    executionId,
  });

  if (!execution) {
    throw new OwnerCustomerResultReleaseError("EXECUTION_NOT_FOUND");
  }

  validateExecutionRecord(execution);

  if (execution.tenantId !== contextTenantId) {
    throw new OwnerCustomerResultReleaseError(
      "EXECUTION_TENANT_MISMATCH",
    );
  }

  if (execution.ownerId !== ownerId) {
    throw new OwnerCustomerResultReleaseError(
      "EXECUTION_OWNER_MISMATCH",
    );
  }

  if (execution.customerId !== customerId) {
    throw new OwnerCustomerResultReleaseError(
      "EXECUTION_CUSTOMER_MISMATCH",
    );
  }

  if (execution.inquiryId !== inquiryId) {
    throw new OwnerCustomerResultReleaseError(
      "EXECUTION_INQUIRY_MISMATCH",
    );
  }

  if (
    execution.state !== "succeeded" ||
    execution.failureCode !== null
  ) {
    throw new OwnerCustomerResultReleaseError(
      "EXECUTION_NOT_SUCCEEDED",
    );
  }

  const result = projectCustomerSafeResult(execution.publicResult);

  const releaseIdempotencyKey = [
    "customer-result-release",
    "v1",
    contextTenantId,
    ownerId,
    customerId,
    inquiryId,
    execution.decisionId,
    executionId,
  ].join(":");

  const releaseId = createStableIdentifier(
    "crr1",
    releaseIdempotencyKey,
  );

  const timestamp = input.nowIso ?? new Date().toISOString();

  if (Number.isNaN(Date.parse(timestamp))) {
    throw new OwnerCustomerResultReleaseError("INVALID_REQUEST");
  }

  const expectedRelease: CustomerResultReleaseRecord = {
    releaseId,
    releaseIdempotencyKey,
    tenantId: contextTenantId,
    ownerId,
    customerId,
    inquiryId,
    decisionId: execution.decisionId,
    executionId,
    status: "released",
    result,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const existingRelease =
    await input.repository.findReleaseByIdempotencyKey({
      tenantId: contextTenantId,
      releaseIdempotencyKey,
    });

  if (existingRelease) {
    validateReleaseRecord(existingRelease);

    if (!recordsMatch(existingRelease, expectedRelease)) {
      throw new OwnerCustomerResultReleaseError(
        "IDEMPOTENCY_CONFLICT",
      );
    }

    return {
      created: false,
      release: existingRelease,
    };
  }

  const persisted = await input.repository.insertReleaseIfAbsent({
    release: expectedRelease,
  });

  validateReleaseRecord(persisted.release);

  if (!recordsMatch(persisted.release, expectedRelease)) {
    throw new OwnerCustomerResultReleaseError(
      "IDEMPOTENCY_CONFLICT",
    );
  }

  return persisted;
}
