export interface AuthenticatedCustomerResultContext {
  authenticated: boolean;
  tenantId: string | null;
  customerId: string | null;
}

export interface PersistedCustomerReleasedResult {
  releaseId: string;
  releaseIdempotencyKey: string;
  tenantId: string;
  ownerId: string;
  customerId: string;
  inquiryId: string;
  decisionId: string;
  executionId: string;
  status: "released";
  result: {
    summary: string;
    recommendation: string | null;
    nextStep: string | null;
    reference: string | null;
    status: "completed";
    mode: "sandbox";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResultAcknowledgementRecord {
  acknowledgementId: string;
  acknowledgementIdempotencyKey: string;
  tenantId: string;
  customerId: string;
  releaseId: string;
  inquiryId: string;
  executionId: string;
  releaseVersion: string;
  status: "acknowledged";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerReleasedResultRepository {
  findReleasedResult(input: {
    tenantId: string;
    releaseId: string;
  }): Promise<PersistedCustomerReleasedResult | null>;

  findAcknowledgementByIdempotencyKey(input: {
    tenantId: string;
    acknowledgementIdempotencyKey: string;
  }): Promise<CustomerResultAcknowledgementRecord | null>;

  insertAcknowledgementIfAbsent(input: {
    acknowledgement: CustomerResultAcknowledgementRecord;
  }): Promise<{
    created: boolean;
    acknowledgement: CustomerResultAcknowledgementRecord;
  }>;
}

export interface CustomerReleasedResultView {
  releaseId: string;
  inquiryId: string;
  executionId: string;
  version: string;
  status: "completed";
  mode: "sandbox";
  summary: string;
  recommendation: string | null;
  nextStep: string | null;
  reference: string | null;
  releasedAt: string;
}

export type CustomerReleasedResultAccessErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_CUSTOMER_CONTEXT"
  | "CROSS_TENANT_ACCESS"
  | "INVALID_REQUEST"
  | "RELEASE_NOT_FOUND"
  | "INVALID_RELEASE_RECORD"
  | "RELEASE_TENANT_MISMATCH"
  | "RELEASE_CUSTOMER_MISMATCH"
  | "RELEASE_NOT_AVAILABLE"
  | "INVALID_ACKNOWLEDGEMENT_RECORD"
  | "IDEMPOTENCY_CONFLICT";

export class CustomerReleasedResultAccessError extends Error {
  readonly code: CustomerReleasedResultAccessErrorCode;

  constructor(
    code: CustomerReleasedResultAccessErrorCode,
    message = "Customer result access denied.",
  ) {
    super(message);
    this.name = "CustomerReleasedResultAccessError";
    this.code = code;
  }
}

function requireString(
  value: string | null | undefined,
  code: CustomerReleasedResultAccessErrorCode,
  maximumLength = 256,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new CustomerReleasedResultAccessError(code);
  }

  return normalized;
}

function validateOptionalResultString(
  value: string | null,
  maximumLength: number,
): void {
  if (value === null) {
    return;
  }

  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maximumLength
  ) {
    throw new CustomerReleasedResultAccessError(
      "INVALID_RELEASE_RECORD",
    );
  }
}

function createStableIdentifier(prefix: string, source: string): string {
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${prefix}_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function createReleaseVersion(
  release: PersistedCustomerReleasedResult,
): string {
  return createStableIdentifier(
    "crv1",
    [
      release.tenantId,
      release.customerId,
      release.releaseId,
      release.inquiryId,
      release.decisionId,
      release.executionId,
      release.updatedAt,
      release.result.summary,
      release.result.recommendation ?? "",
      release.result.nextStep ?? "",
      release.result.reference ?? "",
    ].join("|"),
  );
}

function validateReleaseRecord(
  release: PersistedCustomerReleasedResult,
): void {
  const requiredValues = [
    release.releaseId,
    release.releaseIdempotencyKey,
    release.tenantId,
    release.ownerId,
    release.customerId,
    release.inquiryId,
    release.decisionId,
    release.executionId,
    release.createdAt,
    release.updatedAt,
  ];

  if (
    requiredValues.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.length > 512,
    ) ||
    release.status !== "released" ||
    release.result.status !== "completed" ||
    release.result.mode !== "sandbox" ||
    typeof release.result.summary !== "string" ||
    !release.result.summary.trim() ||
    release.result.summary.length > 2000 ||
    Number.isNaN(Date.parse(release.createdAt)) ||
    Number.isNaN(Date.parse(release.updatedAt))
  ) {
    throw new CustomerReleasedResultAccessError(
      "INVALID_RELEASE_RECORD",
    );
  }

  validateOptionalResultString(
    release.result.recommendation,
    2000,
  );

  validateOptionalResultString(
    release.result.nextStep,
    2000,
  );

  validateOptionalResultString(
    release.result.reference,
    256,
  );
}

function validateAcknowledgementRecord(
  acknowledgement: CustomerResultAcknowledgementRecord,
): void {
  const requiredValues = [
    acknowledgement.acknowledgementId,
    acknowledgement.acknowledgementIdempotencyKey,
    acknowledgement.tenantId,
    acknowledgement.customerId,
    acknowledgement.releaseId,
    acknowledgement.inquiryId,
    acknowledgement.executionId,
    acknowledgement.releaseVersion,
    acknowledgement.createdAt,
    acknowledgement.updatedAt,
  ];

  if (
    requiredValues.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.length > 512,
    ) ||
    acknowledgement.status !== "acknowledged" ||
    Number.isNaN(Date.parse(acknowledgement.createdAt)) ||
    Number.isNaN(Date.parse(acknowledgement.updatedAt))
  ) {
    throw new CustomerReleasedResultAccessError(
      "INVALID_ACKNOWLEDGEMENT_RECORD",
    );
  }
}

function acknowledgementsMatch(
  actual: CustomerResultAcknowledgementRecord,
  expected: CustomerResultAcknowledgementRecord,
): boolean {
  return (
    actual.acknowledgementId === expected.acknowledgementId &&
    actual.acknowledgementIdempotencyKey ===
      expected.acknowledgementIdempotencyKey &&
    actual.tenantId === expected.tenantId &&
    actual.customerId === expected.customerId &&
    actual.releaseId === expected.releaseId &&
    actual.inquiryId === expected.inquiryId &&
    actual.executionId === expected.executionId &&
    actual.releaseVersion === expected.releaseVersion &&
    actual.status === expected.status
  );
}

function projectCustomerResult(
  release: PersistedCustomerReleasedResult,
  version: string,
): CustomerReleasedResultView {
  return {
    releaseId: release.releaseId,
    inquiryId: release.inquiryId,
    executionId: release.executionId,
    version,
    status: "completed",
    mode: "sandbox",
    summary: release.result.summary.trim(),
    recommendation:
      release.result.recommendation?.trim() ?? null,
    nextStep: release.result.nextStep?.trim() ?? null,
    reference: release.result.reference?.trim() ?? null,
    releasedAt: release.updatedAt,
  };
}

export async function accessReleasedCustomerResult(input: {
  context: AuthenticatedCustomerResultContext;
  requestedTenantId: string;
  releaseId: string;
  acknowledge: boolean;
  repository: CustomerReleasedResultRepository;
  nowIso?: string;
}): Promise<{
  result: CustomerReleasedResultView;
  acknowledgement: {
    created: boolean;
    record: CustomerResultAcknowledgementRecord;
  } | null;
}> {
  if (input.context.authenticated !== true) {
    throw new CustomerReleasedResultAccessError("UNAUTHENTICATED");
  }

  const contextTenantId = requireString(
    input.context.tenantId,
    "INVALID_CUSTOMER_CONTEXT",
  );

  const customerId = requireString(
    input.context.customerId,
    "INVALID_CUSTOMER_CONTEXT",
  );

  const requestedTenantId = requireString(
    input.requestedTenantId,
    "CROSS_TENANT_ACCESS",
  );

  if (requestedTenantId !== contextTenantId) {
    throw new CustomerReleasedResultAccessError(
      "CROSS_TENANT_ACCESS",
    );
  }

  const releaseId = requireString(
    input.releaseId,
    "INVALID_REQUEST",
  );

  const release = await input.repository.findReleasedResult({
    tenantId: contextTenantId,
    releaseId,
  });

  if (!release) {
    throw new CustomerReleasedResultAccessError(
      "RELEASE_NOT_FOUND",
    );
  }

  validateReleaseRecord(release);

  if (release.tenantId !== contextTenantId) {
    throw new CustomerReleasedResultAccessError(
      "RELEASE_TENANT_MISMATCH",
    );
  }

  if (release.customerId !== customerId) {
    throw new CustomerReleasedResultAccessError(
      "RELEASE_CUSTOMER_MISMATCH",
    );
  }

  if (
    release.status !== "released" ||
    release.result.status !== "completed" ||
    release.result.mode !== "sandbox"
  ) {
    throw new CustomerReleasedResultAccessError(
      "RELEASE_NOT_AVAILABLE",
    );
  }

  const releaseVersion = createReleaseVersion(release);
  const result = projectCustomerResult(release, releaseVersion);

  if (input.acknowledge !== true) {
    return {
      result,
      acknowledgement: null,
    };
  }

  const timestamp = input.nowIso ?? new Date().toISOString();

  if (Number.isNaN(Date.parse(timestamp))) {
    throw new CustomerReleasedResultAccessError(
      "INVALID_REQUEST",
    );
  }

  const acknowledgementIdempotencyKey = [
    "customer-result-acknowledgement",
    "v1",
    contextTenantId,
    customerId,
    releaseId,
    releaseVersion,
  ].join(":");

  const acknowledgementId = createStableIdentifier(
    "cra1",
    acknowledgementIdempotencyKey,
  );

  const expectedAcknowledgement: CustomerResultAcknowledgementRecord = {
    acknowledgementId,
    acknowledgementIdempotencyKey,
    tenantId: contextTenantId,
    customerId,
    releaseId,
    inquiryId: release.inquiryId,
    executionId: release.executionId,
    releaseVersion,
    status: "acknowledged",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const existingAcknowledgement =
    await input.repository.findAcknowledgementByIdempotencyKey({
      tenantId: contextTenantId,
      acknowledgementIdempotencyKey,
    });

  if (existingAcknowledgement) {
    validateAcknowledgementRecord(existingAcknowledgement);

    if (
      !acknowledgementsMatch(
        existingAcknowledgement,
        expectedAcknowledgement,
      )
    ) {
      throw new CustomerReleasedResultAccessError(
        "IDEMPOTENCY_CONFLICT",
      );
    }

    return {
      result,
      acknowledgement: {
        created: false,
        record: existingAcknowledgement,
      },
    };
  }

  const persisted =
    await input.repository.insertAcknowledgementIfAbsent({
      acknowledgement: expectedAcknowledgement,
    });

  validateAcknowledgementRecord(persisted.acknowledgement);

  if (
    !acknowledgementsMatch(
      persisted.acknowledgement,
      expectedAcknowledgement,
    )
  ) {
    throw new CustomerReleasedResultAccessError(
      "IDEMPOTENCY_CONFLICT",
    );
  }

  return {
    result,
    acknowledgement: {
      created: persisted.created,
      record: persisted.acknowledgement,
    },
  };
}
