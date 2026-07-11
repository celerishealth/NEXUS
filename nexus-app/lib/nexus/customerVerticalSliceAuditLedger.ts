import { createHash } from "node:crypto";

export type VerticalSliceAuditActorRole =
  | "owner"
  | "customer"
  | "service";

export type VerticalSliceAuditTransition =
  | "generate_recommendation"
  | "approve_recommendation"
  | "reject_recommendation"
  | "start_sandbox_execution"
  | "complete_sandbox_execution"
  | "fail_sandbox_execution"
  | "release_result"
  | "acknowledge_result";

export type VerticalSliceAuditStatus =
  | "inquiry_received"
  | "recommendation_ready"
  | "owner_approved"
  | "owner_rejected"
  | "sandbox_executing"
  | "sandbox_succeeded"
  | "sandbox_failed"
  | "result_released"
  | "customer_acknowledged";

export interface AuthenticatedAuditWriterContext {
  authenticated: boolean;
  tenantId: string | null;
  serviceId: string | null;
  role: "service" | "owner" | "customer";
}

export interface VerticalSliceTransitionAuditSource {
  eventId: string;
  idempotencyKey: string;
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  actorId: string;
  actorRole: VerticalSliceAuditActorRole;
  transition: VerticalSliceAuditTransition;
  fromStatus: VerticalSliceAuditStatus;
  toStatus: VerticalSliceAuditStatus;
  previousVersion: string;
  nextVersion: string;
  createdAt: string;
}

export interface CustomerVerticalSliceAuditEntry {
  auditId: string;
  tenantId: string;
  inquiryId: string;
  sequence: number;
  sourceEventId: string;
  sourceIdempotencyKey: string;
  customerId: string;
  ownerId: string;
  actorId: string;
  actorRole: VerticalSliceAuditActorRole;
  transition: VerticalSliceAuditTransition;
  fromStatus: VerticalSliceAuditStatus;
  toStatus: VerticalSliceAuditStatus;
  previousVersion: string;
  nextVersion: string;
  previousHash: string;
  hash: string;
  recordedByServiceId: string;
  sourceCreatedAt: string;
  recordedAt: string;
}

export interface CustomerVerticalSliceAuditRepository {
  findBySourceEventId(input: {
    tenantId: string;
    sourceEventId: string;
  }): Promise<CustomerVerticalSliceAuditEntry | null>;

  findLatest(input: {
    tenantId: string;
    inquiryId: string;
  }): Promise<CustomerVerticalSliceAuditEntry | null>;

  appendIfCurrent(input: {
    entry: CustomerVerticalSliceAuditEntry;
    expectedSequence: number;
    expectedPreviousHash: string;
  }): Promise<{
    created: boolean;
    entry: CustomerVerticalSliceAuditEntry;
  }>;
}

export type CustomerVerticalSliceAuditErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_WRITER_CONTEXT"
  | "WRITER_NOT_AUTHORIZED"
  | "CROSS_TENANT_ACCESS"
  | "INVALID_SOURCE_EVENT"
  | "SOURCE_TENANT_MISMATCH"
  | "INVALID_AUDIT_ENTRY"
  | "AUDIT_REFERENCE_MISMATCH"
  | "CHAIN_VERSION_MISMATCH"
  | "IDEMPOTENCY_CONFLICT"
  | "CONCURRENT_APPEND"
  | "PERSISTENCE_MISMATCH"
  | "AUDIT_CHAIN_INVALID";

export class CustomerVerticalSliceAuditError extends Error {
  readonly code: CustomerVerticalSliceAuditErrorCode;

  constructor(
    code: CustomerVerticalSliceAuditErrorCode,
    message = "Customer vertical slice audit operation denied.",
  ) {
    super(message);
    this.name = "CustomerVerticalSliceAuditError";
    this.code = code;
  }
}

const GENESIS_HASH = "GENESIS";

function requireString(
  value: string | null | undefined,
  code: CustomerVerticalSliceAuditErrorCode,
  maximumLength = 512,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new CustomerVerticalSliceAuditError(code);
  }

  return normalized;
}

function requireTimestamp(
  value: string,
  code: CustomerVerticalSliceAuditErrorCode,
): string {
  const normalized = requireString(value, code);

  if (Number.isNaN(Date.parse(normalized))) {
    throw new CustomerVerticalSliceAuditError(code);
  }

  return normalized;
}

function isKnownRole(
  value: string,
): value is VerticalSliceAuditActorRole {
  return (
    value === "owner" ||
    value === "customer" ||
    value === "service"
  );
}

function isKnownTransition(
  value: string,
): value is VerticalSliceAuditTransition {
  return (
    value === "generate_recommendation" ||
    value === "approve_recommendation" ||
    value === "reject_recommendation" ||
    value === "start_sandbox_execution" ||
    value === "complete_sandbox_execution" ||
    value === "fail_sandbox_execution" ||
    value === "release_result" ||
    value === "acknowledge_result"
  );
}

function isKnownStatus(
  value: string,
): value is VerticalSliceAuditStatus {
  return (
    value === "inquiry_received" ||
    value === "recommendation_ready" ||
    value === "owner_approved" ||
    value === "owner_rejected" ||
    value === "sandbox_executing" ||
    value === "sandbox_succeeded" ||
    value === "sandbox_failed" ||
    value === "result_released" ||
    value === "customer_acknowledged"
  );
}

function sha256(value: string): string {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

function createAuditHash(input: {
  tenantId: string;
  inquiryId: string;
  sequence: number;
  sourceEventId: string;
  sourceIdempotencyKey: string;
  customerId: string;
  ownerId: string;
  actorId: string;
  actorRole: VerticalSliceAuditActorRole;
  transition: VerticalSliceAuditTransition;
  fromStatus: VerticalSliceAuditStatus;
  toStatus: VerticalSliceAuditStatus;
  previousVersion: string;
  nextVersion: string;
  previousHash: string;
  recordedByServiceId: string;
  sourceCreatedAt: string;
  recordedAt: string;
}): string {
  return sha256(
    JSON.stringify([
      input.tenantId,
      input.inquiryId,
      input.sequence,
      input.sourceEventId,
      input.sourceIdempotencyKey,
      input.customerId,
      input.ownerId,
      input.actorId,
      input.actorRole,
      input.transition,
      input.fromStatus,
      input.toStatus,
      input.previousVersion,
      input.nextVersion,
      input.previousHash,
      input.recordedByServiceId,
      input.sourceCreatedAt,
      input.recordedAt,
    ]),
  );
}

function createAuditId(
  tenantId: string,
  inquiryId: string,
  sourceEventId: string,
): string {
  return `vsa1_${sha256(
    `${tenantId}|${inquiryId}|${sourceEventId}`,
  ).slice(0, 20)}`;
}

function validateSourceEvent(
  source: VerticalSliceTransitionAuditSource,
): void {
  const requiredValues = [
    source.eventId,
    source.idempotencyKey,
    source.tenantId,
    source.inquiryId,
    source.customerId,
    source.ownerId,
    source.actorId,
    source.previousVersion,
    source.nextVersion,
    source.createdAt,
  ];

  if (
    requiredValues.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.length > 512,
    ) ||
    !isKnownRole(source.actorRole) ||
    !isKnownTransition(source.transition) ||
    !isKnownStatus(source.fromStatus) ||
    !isKnownStatus(source.toStatus) ||
    source.previousVersion === source.nextVersion
  ) {
    throw new CustomerVerticalSliceAuditError(
      "INVALID_SOURCE_EVENT",
    );
  }

  requireTimestamp(
    source.createdAt,
    "INVALID_SOURCE_EVENT",
  );
}

function validateAuditEntry(
  entry: CustomerVerticalSliceAuditEntry,
): void {
  const requiredValues = [
    entry.auditId,
    entry.tenantId,
    entry.inquiryId,
    entry.sourceEventId,
    entry.sourceIdempotencyKey,
    entry.customerId,
    entry.ownerId,
    entry.actorId,
    entry.previousVersion,
    entry.nextVersion,
    entry.previousHash,
    entry.hash,
    entry.recordedByServiceId,
    entry.sourceCreatedAt,
    entry.recordedAt,
  ];

  if (
    requiredValues.some(
      (value) =>
        typeof value !== "string" ||
        !value.trim() ||
        value.length > 512,
    ) ||
    !Number.isSafeInteger(entry.sequence) ||
    entry.sequence < 1 ||
    !isKnownRole(entry.actorRole) ||
    !isKnownTransition(entry.transition) ||
    !isKnownStatus(entry.fromStatus) ||
    !isKnownStatus(entry.toStatus) ||
    !/^[a-f0-9]{64}$/.test(entry.hash) ||
    !(
      entry.previousHash === GENESIS_HASH ||
      /^[a-f0-9]{64}$/.test(entry.previousHash)
    )
  ) {
    throw new CustomerVerticalSliceAuditError(
      "INVALID_AUDIT_ENTRY",
    );
  }

  requireTimestamp(
    entry.sourceCreatedAt,
    "INVALID_AUDIT_ENTRY",
  );

  requireTimestamp(
    entry.recordedAt,
    "INVALID_AUDIT_ENTRY",
  );

  const expectedHash = createAuditHash(entry);

  if (entry.hash !== expectedHash) {
    throw new CustomerVerticalSliceAuditError(
      "AUDIT_CHAIN_INVALID",
    );
  }
}

function entryMatchesSource(
  entry: CustomerVerticalSliceAuditEntry,
  source: VerticalSliceTransitionAuditSource,
  serviceId: string,
): boolean {
  return (
    entry.sourceEventId === source.eventId &&
    entry.sourceIdempotencyKey === source.idempotencyKey &&
    entry.tenantId === source.tenantId &&
    entry.inquiryId === source.inquiryId &&
    entry.customerId === source.customerId &&
    entry.ownerId === source.ownerId &&
    entry.actorId === source.actorId &&
    entry.actorRole === source.actorRole &&
    entry.transition === source.transition &&
    entry.fromStatus === source.fromStatus &&
    entry.toStatus === source.toStatus &&
    entry.previousVersion === source.previousVersion &&
    entry.nextVersion === source.nextVersion &&
    entry.sourceCreatedAt === source.createdAt &&
    entry.recordedByServiceId === serviceId
  );
}

function entriesMatch(
  actual: CustomerVerticalSliceAuditEntry,
  expected: CustomerVerticalSliceAuditEntry,
): boolean {
  return (
    actual.auditId === expected.auditId &&
    actual.tenantId === expected.tenantId &&
    actual.inquiryId === expected.inquiryId &&
    actual.sequence === expected.sequence &&
    actual.sourceEventId === expected.sourceEventId &&
    actual.sourceIdempotencyKey ===
      expected.sourceIdempotencyKey &&
    actual.customerId === expected.customerId &&
    actual.ownerId === expected.ownerId &&
    actual.actorId === expected.actorId &&
    actual.actorRole === expected.actorRole &&
    actual.transition === expected.transition &&
    actual.fromStatus === expected.fromStatus &&
    actual.toStatus === expected.toStatus &&
    actual.previousVersion === expected.previousVersion &&
    actual.nextVersion === expected.nextVersion &&
    actual.previousHash === expected.previousHash &&
    actual.hash === expected.hash &&
    actual.recordedByServiceId ===
      expected.recordedByServiceId &&
    actual.sourceCreatedAt === expected.sourceCreatedAt &&
    actual.recordedAt === expected.recordedAt
  );
}

export async function appendVerticalSliceAuditEvent(input: {
  context: AuthenticatedAuditWriterContext;
  requestedTenantId: string;
  source: VerticalSliceTransitionAuditSource;
  repository: CustomerVerticalSliceAuditRepository;
  nowIso?: string;
}): Promise<{
  created: boolean;
  idempotent: boolean;
  entry: CustomerVerticalSliceAuditEntry;
}> {
  if (input.context.authenticated !== true) {
    throw new CustomerVerticalSliceAuditError(
      "UNAUTHENTICATED",
    );
  }

  const contextTenantId = requireString(
    input.context.tenantId,
    "INVALID_WRITER_CONTEXT",
  );

  const serviceId = requireString(
    input.context.serviceId,
    "INVALID_WRITER_CONTEXT",
  );

  if (input.context.role !== "service") {
    throw new CustomerVerticalSliceAuditError(
      "WRITER_NOT_AUTHORIZED",
    );
  }

  const requestedTenantId = requireString(
    input.requestedTenantId,
    "CROSS_TENANT_ACCESS",
  );

  if (requestedTenantId !== contextTenantId) {
    throw new CustomerVerticalSliceAuditError(
      "CROSS_TENANT_ACCESS",
    );
  }

  validateSourceEvent(input.source);

  if (input.source.tenantId !== contextTenantId) {
    throw new CustomerVerticalSliceAuditError(
      "SOURCE_TENANT_MISMATCH",
    );
  }

  const existing =
    await input.repository.findBySourceEventId({
      tenantId: contextTenantId,
      sourceEventId: input.source.eventId,
    });

  if (existing) {
    validateAuditEntry(existing);

    if (
      !entryMatchesSource(
        existing,
        input.source,
        serviceId,
      )
    ) {
      throw new CustomerVerticalSliceAuditError(
        "IDEMPOTENCY_CONFLICT",
      );
    }

    return {
      created: false,
      idempotent: true,
      entry: existing,
    };
  }

  const latest = await input.repository.findLatest({
    tenantId: contextTenantId,
    inquiryId: input.source.inquiryId,
  });

  if (latest) {
    validateAuditEntry(latest);

    if (
      latest.tenantId !== contextTenantId ||
      latest.inquiryId !== input.source.inquiryId
    ) {
      throw new CustomerVerticalSliceAuditError(
        "AUDIT_REFERENCE_MISMATCH",
      );
    }

    if (
      latest.nextVersion !== input.source.previousVersion
    ) {
      throw new CustomerVerticalSliceAuditError(
        "CHAIN_VERSION_MISMATCH",
      );
    }
  }

  const sequence = latest ? latest.sequence + 1 : 1;
  const previousHash = latest
    ? latest.hash
    : GENESIS_HASH;

  const recordedAt =
    input.nowIso ?? new Date().toISOString();

  if (Number.isNaN(Date.parse(recordedAt))) {
    throw new CustomerVerticalSliceAuditError(
      "INVALID_SOURCE_EVENT",
    );
  }

  const entryWithoutHash = {
    auditId: createAuditId(
      contextTenantId,
      input.source.inquiryId,
      input.source.eventId,
    ),
    tenantId: contextTenantId,
    inquiryId: input.source.inquiryId,
    sequence,
    sourceEventId: input.source.eventId,
    sourceIdempotencyKey:
      input.source.idempotencyKey,
    customerId: input.source.customerId,
    ownerId: input.source.ownerId,
    actorId: input.source.actorId,
    actorRole: input.source.actorRole,
    transition: input.source.transition,
    fromStatus: input.source.fromStatus,
    toStatus: input.source.toStatus,
    previousVersion: input.source.previousVersion,
    nextVersion: input.source.nextVersion,
    previousHash,
    recordedByServiceId: serviceId,
    sourceCreatedAt: input.source.createdAt,
    recordedAt,
  };

  const expectedEntry: CustomerVerticalSliceAuditEntry = {
    ...entryWithoutHash,
    hash: createAuditHash(entryWithoutHash),
  };

  const persisted =
    await input.repository.appendIfCurrent({
      entry: expectedEntry,
      expectedSequence: sequence,
      expectedPreviousHash: previousHash,
    });

  validateAuditEntry(persisted.entry);

  if (!entriesMatch(persisted.entry, expectedEntry)) {
    if (
      persisted.entry.sourceEventId ===
        expectedEntry.sourceEventId &&
      entryMatchesSource(
        persisted.entry,
        input.source,
        serviceId,
      )
    ) {
      return {
        created: false,
        idempotent: true,
        entry: persisted.entry,
      };
    }

    throw new CustomerVerticalSliceAuditError(
      persisted.created
        ? "PERSISTENCE_MISMATCH"
        : "CONCURRENT_APPEND",
    );
  }

  return {
    created: persisted.created,
    idempotent: !persisted.created,
    entry: persisted.entry,
  };
}

export function verifyVerticalSliceAuditChain(input: {
  tenantId: string;
  inquiryId: string;
  entries: CustomerVerticalSliceAuditEntry[];
}): {
  valid: true;
  entryCount: number;
  headHash: string;
  finalVersion: string | null;
} {
  const tenantId = requireString(
    input.tenantId,
    "AUDIT_CHAIN_INVALID",
  );

  const inquiryId = requireString(
    input.inquiryId,
    "AUDIT_CHAIN_INVALID",
  );

  let previousHash = GENESIS_HASH;
  let previousVersion: string | null = null;
  const sourceEventIds = new Set<string>();
  const idempotencyKeys = new Set<string>();

  for (
    let index = 0;
    index < input.entries.length;
    index += 1
  ) {
    const entry = input.entries[index];

    validateAuditEntry(entry);

    if (
      entry.tenantId !== tenantId ||
      entry.inquiryId !== inquiryId ||
      entry.sequence !== index + 1 ||
      entry.previousHash !== previousHash ||
      sourceEventIds.has(entry.sourceEventId) ||
      idempotencyKeys.has(entry.sourceIdempotencyKey)
    ) {
      throw new CustomerVerticalSliceAuditError(
        "AUDIT_CHAIN_INVALID",
      );
    }

    if (
      previousVersion !== null &&
      entry.previousVersion !== previousVersion
    ) {
      throw new CustomerVerticalSliceAuditError(
        "AUDIT_CHAIN_INVALID",
      );
    }

    sourceEventIds.add(entry.sourceEventId);
    idempotencyKeys.add(entry.sourceIdempotencyKey);
    previousHash = entry.hash;
    previousVersion = entry.nextVersion;
  }

  return {
    valid: true,
    entryCount: input.entries.length,
    headHash: previousHash,
    finalVersion: previousVersion,
  };
}
