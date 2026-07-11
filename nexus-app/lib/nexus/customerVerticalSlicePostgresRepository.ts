import type {
  CustomerVerticalSliceTransactionalRepository,
  CustomerVerticalSliceTransactionRepositories,
} from "./customerVerticalSliceAuditedTransition";

import type {
  CustomerVerticalSliceStateRecord,
  CustomerVerticalSliceTransitionEvent,
} from "./customerVerticalSliceTransitionGuard";

import type {
  CustomerVerticalSliceAuditEntry,
} from "./customerVerticalSliceAuditLedger";

export interface PostgresQueryResult<Row> {
  rows: Row[];
  rowCount: number | null;
}

export interface PostgresTransactionClient {
  query<Row = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<PostgresQueryResult<Row>>;

  release(): void;
}

export interface PostgresPool {
  connect(): Promise<PostgresTransactionClient>;
}

export interface PostgresCustomerVerticalSliceRepository
  extends CustomerVerticalSliceTransactionalRepository {
  createInitialStateIfAbsent(
    state: CustomerVerticalSliceStateRecord,
  ): Promise<{
    created: boolean;
    state: CustomerVerticalSliceStateRecord;
  }>;
}

export type PostgresVerticalSliceRepositoryErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_TENANT"
  | "INVALID_RECORD"
  | "CROSS_TENANT_TRANSACTION"
  | "STATE_NOT_FOUND"
  | "STATE_REFERENCE_MISMATCH"
  | "EVENT_REFERENCE_MISMATCH"
  | "AUDIT_REFERENCE_MISMATCH"
  | "INITIAL_STATE_CONFLICT"
  | "IDEMPOTENCY_CONFLICT"
  | "AUDIT_CHAIN_CONFLICT"
  | "PERSISTENCE_MISMATCH";

export class PostgresVerticalSliceRepositoryError extends Error {
  readonly code: PostgresVerticalSliceRepositoryErrorCode;

  constructor(
    code: PostgresVerticalSliceRepositoryErrorCode,
    message = "Customer vertical slice persistence failed safely.",
  ) {
    super(message);
    this.name = "PostgresVerticalSliceRepositoryError";
    this.code = code;
  }
}

type TimestampValue = string | Date;

interface StateRow {
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  status: CustomerVerticalSliceStateRecord["status"];
  version: string;
  createdAt: TimestampValue;
  updatedAt: TimestampValue;
}

interface EventRow {
  eventId: string;
  idempotencyKey: string;
  tenantId: string;
  inquiryId: string;
  customerId: string;
  ownerId: string;
  actorId: string;
  actorRole: CustomerVerticalSliceTransitionEvent["actorRole"];
  transition: CustomerVerticalSliceTransitionEvent["transition"];
  fromStatus: CustomerVerticalSliceTransitionEvent["fromStatus"];
  toStatus: CustomerVerticalSliceTransitionEvent["toStatus"];
  previousVersion: string;
  nextVersion: string;
  createdAt: TimestampValue;
}

interface AuditRow {
  auditId: string;
  tenantId: string;
  inquiryId: string;
  sequence: number;
  sourceEventId: string;
  sourceIdempotencyKey: string;
  customerId: string;
  ownerId: string;
  actorId: string;
  actorRole: CustomerVerticalSliceAuditEntry["actorRole"];
  transition: CustomerVerticalSliceAuditEntry["transition"];
  fromStatus: CustomerVerticalSliceAuditEntry["fromStatus"];
  toStatus: CustomerVerticalSliceAuditEntry["toStatus"];
  previousVersion: string;
  nextVersion: string;
  previousHash: string;
  hash: string;
  recordedByServiceId: string;
  sourceCreatedAt: TimestampValue;
  recordedAt: TimestampValue;
}

function requireString(
  value: string | null | undefined,
  code: PostgresVerticalSliceRepositoryErrorCode,
  maximumLength = 512,
): string {
  const normalized = value?.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new PostgresVerticalSliceRepositoryError(code);
  }

  return normalized;
}

function timestamp(
  value: TimestampValue,
): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new PostgresVerticalSliceRepositoryError(
        "INVALID_RECORD",
      );
    }

    return value.toISOString();
  }

  if (
    typeof value !== "string" ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new PostgresVerticalSliceRepositoryError(
      "INVALID_RECORD",
    );
  }

  return new Date(value).toISOString();
}

function stateFromRow(
  row: StateRow,
): CustomerVerticalSliceStateRecord {
  return {
    tenantId: requireString(
      row.tenantId,
      "INVALID_RECORD",
    ),
    inquiryId: requireString(
      row.inquiryId,
      "INVALID_RECORD",
    ),
    customerId: requireString(
      row.customerId,
      "INVALID_RECORD",
    ),
    ownerId: requireString(
      row.ownerId,
      "INVALID_RECORD",
    ),
    status: row.status,
    version: requireString(
      row.version,
      "INVALID_RECORD",
    ),
    createdAt: timestamp(row.createdAt),
    updatedAt: timestamp(row.updatedAt),
  };
}

function eventFromRow(
  row: EventRow,
): CustomerVerticalSliceTransitionEvent {
  return {
    eventId: requireString(
      row.eventId,
      "INVALID_RECORD",
    ),
    idempotencyKey: requireString(
      row.idempotencyKey,
      "INVALID_RECORD",
    ),
    tenantId: requireString(
      row.tenantId,
      "INVALID_RECORD",
    ),
    inquiryId: requireString(
      row.inquiryId,
      "INVALID_RECORD",
    ),
    customerId: requireString(
      row.customerId,
      "INVALID_RECORD",
    ),
    ownerId: requireString(
      row.ownerId,
      "INVALID_RECORD",
    ),
    actorId: requireString(
      row.actorId,
      "INVALID_RECORD",
    ),
    actorRole: row.actorRole,
    transition: row.transition,
    fromStatus: row.fromStatus,
    toStatus: row.toStatus,
    previousVersion: requireString(
      row.previousVersion,
      "INVALID_RECORD",
    ),
    nextVersion: requireString(
      row.nextVersion,
      "INVALID_RECORD",
    ),
    createdAt: timestamp(row.createdAt),
  };
}

function auditFromRow(
  row: AuditRow,
): CustomerVerticalSliceAuditEntry {
  return {
    auditId: requireString(
      row.auditId,
      "INVALID_RECORD",
    ),
    tenantId: requireString(
      row.tenantId,
      "INVALID_RECORD",
    ),
    inquiryId: requireString(
      row.inquiryId,
      "INVALID_RECORD",
    ),
    sequence: row.sequence,
    sourceEventId: requireString(
      row.sourceEventId,
      "INVALID_RECORD",
    ),
    sourceIdempotencyKey: requireString(
      row.sourceIdempotencyKey,
      "INVALID_RECORD",
    ),
    customerId: requireString(
      row.customerId,
      "INVALID_RECORD",
    ),
    ownerId: requireString(
      row.ownerId,
      "INVALID_RECORD",
    ),
    actorId: requireString(
      row.actorId,
      "INVALID_RECORD",
    ),
    actorRole: row.actorRole,
    transition: row.transition,
    fromStatus: row.fromStatus,
    toStatus: row.toStatus,
    previousVersion: requireString(
      row.previousVersion,
      "INVALID_RECORD",
    ),
    nextVersion: requireString(
      row.nextVersion,
      "INVALID_RECORD",
    ),
    previousHash: requireString(
      row.previousHash,
      "INVALID_RECORD",
    ),
    hash: requireString(
      row.hash,
      "INVALID_RECORD",
    ),
    recordedByServiceId: requireString(
      row.recordedByServiceId,
      "INVALID_RECORD",
    ),
    sourceCreatedAt: timestamp(
      row.sourceCreatedAt,
    ),
    recordedAt: timestamp(
      row.recordedAt,
    ),
  };
}

function statesMatch(
  left: CustomerVerticalSliceStateRecord,
  right: CustomerVerticalSliceStateRecord,
): boolean {
  return (
    left.tenantId === right.tenantId &&
    left.inquiryId === right.inquiryId &&
    left.customerId === right.customerId &&
    left.ownerId === right.ownerId &&
    left.status === right.status &&
    left.version === right.version &&
    timestamp(left.createdAt) ===
      timestamp(right.createdAt) &&
    timestamp(left.updatedAt) ===
      timestamp(right.updatedAt)
  );
}

function auditsMatch(
  left: CustomerVerticalSliceAuditEntry,
  right: CustomerVerticalSliceAuditEntry,
): boolean {
  return (
    left.auditId === right.auditId &&
    left.tenantId === right.tenantId &&
    left.inquiryId === right.inquiryId &&
    left.sequence === right.sequence &&
    left.sourceEventId === right.sourceEventId &&
    left.sourceIdempotencyKey ===
      right.sourceIdempotencyKey &&
    left.customerId === right.customerId &&
    left.ownerId === right.ownerId &&
    left.actorId === right.actorId &&
    left.actorRole === right.actorRole &&
    left.transition === right.transition &&
    left.fromStatus === right.fromStatus &&
    left.toStatus === right.toStatus &&
    left.previousVersion === right.previousVersion &&
    left.nextVersion === right.nextVersion &&
    left.previousHash === right.previousHash &&
    left.hash === right.hash &&
    left.recordedByServiceId ===
      right.recordedByServiceId &&
    timestamp(left.sourceCreatedAt) ===
      timestamp(right.sourceCreatedAt) &&
    timestamp(left.recordedAt) ===
      timestamp(right.recordedAt)
  );
}

async function runTransaction<T>(
  pool: PostgresPool,
  operation: (
    client: PostgresTransactionClient,
  ) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    const result = await operation(client);

    await client.query("COMMIT");

    return result;
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // Preserve the original failure.
      }
    }

    throw error;
  } finally {
    client.release();
  }
}

function createTenantBinder(
  client: PostgresTransactionClient,
): (tenantId: string) => Promise<string> {
  let boundTenantId: string | null = null;

  return async (tenantId) => {
    const normalizedTenantId = requireString(
      tenantId,
      "INVALID_TENANT",
      256,
    );

    if (boundTenantId === null) {
      await client.query(
        "SELECT set_config('app.tenant_id', $1, true)",
        [normalizedTenantId],
      );

      boundTenantId = normalizedTenantId;

      return normalizedTenantId;
    }

    if (boundTenantId !== normalizedTenantId) {
      throw new PostgresVerticalSliceRepositoryError(
        "CROSS_TENANT_TRANSACTION",
      );
    }

    return normalizedTenantId;
  };
}

const STATE_SELECT = `
SELECT
  tenant_id AS "tenantId",
  inquiry_id AS "inquiryId",
  customer_id AS "customerId",
  owner_id AS "ownerId",
  status,
  version,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM nexus_customer_vertical_slice_state
WHERE tenant_id = $1
  AND inquiry_id = $2
LIMIT 1
`;

const EVENT_SELECT = `
SELECT
  event_id AS "eventId",
  idempotency_key AS "idempotencyKey",
  tenant_id AS "tenantId",
  inquiry_id AS "inquiryId",
  customer_id AS "customerId",
  owner_id AS "ownerId",
  actor_id AS "actorId",
  actor_role AS "actorRole",
  transition,
  from_status AS "fromStatus",
  to_status AS "toStatus",
  previous_version AS "previousVersion",
  next_version AS "nextVersion",
  created_at AS "createdAt"
FROM nexus_customer_vertical_slice_event
WHERE tenant_id = $1
  AND idempotency_key = $2
LIMIT 1
`;

const AUDIT_SELECT_BY_SOURCE = `
SELECT
  audit_id AS "auditId",
  tenant_id AS "tenantId",
  inquiry_id AS "inquiryId",
  sequence,
  source_event_id AS "sourceEventId",
  source_idempotency_key AS "sourceIdempotencyKey",
  customer_id AS "customerId",
  owner_id AS "ownerId",
  actor_id AS "actorId",
  actor_role AS "actorRole",
  transition,
  from_status AS "fromStatus",
  to_status AS "toStatus",
  previous_version AS "previousVersion",
  next_version AS "nextVersion",
  previous_hash AS "previousHash",
  hash,
  recorded_by_service_id AS "recordedByServiceId",
  source_created_at AS "sourceCreatedAt",
  recorded_at AS "recordedAt"
FROM nexus_customer_vertical_slice_audit
WHERE tenant_id = $1
  AND source_event_id = $2
LIMIT 1
`;

const AUDIT_SELECT_LATEST = `
SELECT
  audit_id AS "auditId",
  tenant_id AS "tenantId",
  inquiry_id AS "inquiryId",
  sequence,
  source_event_id AS "sourceEventId",
  source_idempotency_key AS "sourceIdempotencyKey",
  customer_id AS "customerId",
  owner_id AS "ownerId",
  actor_id AS "actorId",
  actor_role AS "actorRole",
  transition,
  from_status AS "fromStatus",
  to_status AS "toStatus",
  previous_version AS "previousVersion",
  next_version AS "nextVersion",
  previous_hash AS "previousHash",
  hash,
  recorded_by_service_id AS "recordedByServiceId",
  source_created_at AS "sourceCreatedAt",
  recorded_at AS "recordedAt"
FROM nexus_customer_vertical_slice_audit
WHERE tenant_id = $1
  AND inquiry_id = $2
ORDER BY sequence DESC
LIMIT 1
`;

export function createPostgresCustomerVerticalSliceRepository(input: {
  pool: PostgresPool;
}): PostgresCustomerVerticalSliceRepository {
  if (
    !input?.pool ||
    typeof input.pool.connect !== "function"
  ) {
    throw new PostgresVerticalSliceRepositoryError(
      "INVALID_CONFIGURATION",
    );
  }

  return {
    async createInitialStateIfAbsent(state) {
      if (state.status !== "inquiry_received") {
        throw new PostgresVerticalSliceRepositoryError(
          "INVALID_RECORD",
        );
      }

      return runTransaction(
        input.pool,
        async (client) => {
          const bindTenant =
            createTenantBinder(client);

          const tenantId =
            await bindTenant(state.tenantId);

          const inserted =
            await client.query<StateRow>(
              `
              INSERT INTO nexus_customer_vertical_slice_state (
                tenant_id,
                inquiry_id,
                customer_id,
                owner_id,
                status,
                version,
                created_at,
                updated_at
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              ON CONFLICT (tenant_id, inquiry_id)
              DO NOTHING
              RETURNING
                tenant_id AS "tenantId",
                inquiry_id AS "inquiryId",
                customer_id AS "customerId",
                owner_id AS "ownerId",
                status,
                version,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
              `,
              [
                tenantId,
                state.inquiryId,
                state.customerId,
                state.ownerId,
                state.status,
                state.version,
                state.createdAt,
                state.updatedAt,
              ],
            );

          if (inserted.rows[0]) {
            return {
              created: true,
              state: stateFromRow(
                inserted.rows[0],
              ),
            };
          }

          const existing =
            await client.query<StateRow>(
              STATE_SELECT,
              [
                tenantId,
                state.inquiryId,
              ],
            );

          if (!existing.rows[0]) {
            throw new PostgresVerticalSliceRepositoryError(
              "PERSISTENCE_MISMATCH",
            );
          }

          const existingState =
            stateFromRow(existing.rows[0]);

          if (!statesMatch(existingState, state)) {
            throw new PostgresVerticalSliceRepositoryError(
              "INITIAL_STATE_CONFLICT",
            );
          }

          return {
            created: false,
            state: existingState,
          };
        },
      );
    },

    async runInTransaction<T>(
      operation: (
        repositories: CustomerVerticalSliceTransactionRepositories,
      ) => Promise<T>,
    ): Promise<T> {
      return runTransaction(
        input.pool,
        async (client) => {
          const bindTenant =
            createTenantBinder(client);

          const transitionRepository = {
            async findState(request: {
              tenantId: string;
              inquiryId: string;
            }) {
              const tenantId =
                await bindTenant(
                  request.tenantId,
                );

              const result =
                await client.query<StateRow>(
                  STATE_SELECT,
                  [
                    tenantId,
                    request.inquiryId,
                  ],
                );

              return result.rows[0]
                ? stateFromRow(result.rows[0])
                : null;
            },

            async findEventByIdempotencyKey(request: {
              tenantId: string;
              idempotencyKey: string;
            }) {
              const tenantId =
                await bindTenant(
                  request.tenantId,
                );

              const result =
                await client.query<EventRow>(
                  EVENT_SELECT,
                  [
                    tenantId,
                    request.idempotencyKey,
                  ],
                );

              return result.rows[0]
                ? eventFromRow(result.rows[0])
                : null;
            },

            async compareAndSet(request: {
              tenantId: string;
              inquiryId: string;
              expectedVersion: string;
              nextState: CustomerVerticalSliceStateRecord;
              event: CustomerVerticalSliceTransitionEvent;
            }) {
              const tenantId =
                await bindTenant(
                  request.tenantId,
                );

              if (
                request.nextState.tenantId !== tenantId ||
                request.nextState.inquiryId !==
                  request.inquiryId
              ) {
                throw new PostgresVerticalSliceRepositoryError(
                  "STATE_REFERENCE_MISMATCH",
                );
              }

              if (
                request.event.tenantId !== tenantId ||
                request.event.inquiryId !==
                  request.inquiryId ||
                request.event.nextVersion !==
                  request.nextState.version
              ) {
                throw new PostgresVerticalSliceRepositoryError(
                  "EVENT_REFERENCE_MISMATCH",
                );
              }

              const updated =
                await client.query<StateRow>(
                  `
                  UPDATE nexus_customer_vertical_slice_state
                  SET
                    status = $4,
                    version = $5,
                    updated_at = $6
                  WHERE tenant_id = $1
                    AND inquiry_id = $2
                    AND version = $3
                  RETURNING
                    tenant_id AS "tenantId",
                    inquiry_id AS "inquiryId",
                    customer_id AS "customerId",
                    owner_id AS "ownerId",
                    status,
                    version,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
                  `,
                  [
                    tenantId,
                    request.inquiryId,
                    request.expectedVersion,
                    request.nextState.status,
                    request.nextState.version,
                    request.nextState.updatedAt,
                  ],
                );

              if (!updated.rows[0]) {
                const current =
                  await client.query<StateRow>(
                    STATE_SELECT,
                    [
                      tenantId,
                      request.inquiryId,
                    ],
                  );

                if (!current.rows[0]) {
                  throw new PostgresVerticalSliceRepositoryError(
                    "STATE_NOT_FOUND",
                  );
                }

                return {
                  applied: false,
                  state: stateFromRow(
                    current.rows[0],
                  ),
                };
              }

              const insertedEvent =
                await client.query<EventRow>(
                  `
                  INSERT INTO nexus_customer_vertical_slice_event (
                    tenant_id,
                    event_id,
                    idempotency_key,
                    inquiry_id,
                    customer_id,
                    owner_id,
                    actor_id,
                    actor_role,
                    transition,
                    from_status,
                    to_status,
                    previous_version,
                    next_version,
                    created_at
                  )
                  VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, $13, $14
                  )
                  ON CONFLICT (tenant_id, idempotency_key)
                  DO NOTHING
                  RETURNING
                    event_id AS "eventId",
                    idempotency_key AS "idempotencyKey",
                    tenant_id AS "tenantId",
                    inquiry_id AS "inquiryId",
                    customer_id AS "customerId",
                    owner_id AS "ownerId",
                    actor_id AS "actorId",
                    actor_role AS "actorRole",
                    transition,
                    from_status AS "fromStatus",
                    to_status AS "toStatus",
                    previous_version AS "previousVersion",
                    next_version AS "nextVersion",
                    created_at AS "createdAt"
                  `,
                  [
                    tenantId,
                    request.event.eventId,
                    request.event.idempotencyKey,
                    request.event.inquiryId,
                    request.event.customerId,
                    request.event.ownerId,
                    request.event.actorId,
                    request.event.actorRole,
                    request.event.transition,
                    request.event.fromStatus,
                    request.event.toStatus,
                    request.event.previousVersion,
                    request.event.nextVersion,
                    request.event.createdAt,
                  ],
                );

              if (!insertedEvent.rows[0]) {
                throw new PostgresVerticalSliceRepositoryError(
                  "IDEMPOTENCY_CONFLICT",
                );
              }

              return {
                applied: true,
                state: stateFromRow(
                  updated.rows[0],
                ),
              };
            },
          };

          const auditRepository = {
            async findBySourceEventId(request: {
              tenantId: string;
              sourceEventId: string;
            }) {
              const tenantId =
                await bindTenant(
                  request.tenantId,
                );

              const result =
                await client.query<AuditRow>(
                  AUDIT_SELECT_BY_SOURCE,
                  [
                    tenantId,
                    request.sourceEventId,
                  ],
                );

              return result.rows[0]
                ? auditFromRow(result.rows[0])
                : null;
            },

            async findLatest(request: {
              tenantId: string;
              inquiryId: string;
            }) {
              const tenantId =
                await bindTenant(
                  request.tenantId,
                );

              const result =
                await client.query<AuditRow>(
                  AUDIT_SELECT_LATEST,
                  [
                    tenantId,
                    request.inquiryId,
                  ],
                );

              return result.rows[0]
                ? auditFromRow(result.rows[0])
                : null;
            },

            async appendIfCurrent(request: {
              entry: CustomerVerticalSliceAuditEntry;
              expectedSequence: number;
              expectedPreviousHash: string;
            }) {
              const tenantId =
                await bindTenant(
                  request.entry.tenantId,
                );

              if (
                request.entry.tenantId !== tenantId ||
                !request.entry.inquiryId
              ) {
                throw new PostgresVerticalSliceRepositoryError(
                  "AUDIT_REFERENCE_MISMATCH",
                );
              }

              await client.query(
                `
                SELECT pg_advisory_xact_lock(
                  hashtextextended($1, 0)
                )
                `,
                [
                  `${tenantId}:${request.entry.inquiryId}`,
                ],
              );

              const latestResult =
                await client.query<AuditRow>(
                  AUDIT_SELECT_LATEST,
                  [
                    tenantId,
                    request.entry.inquiryId,
                  ],
                );

              const latest = latestResult.rows[0]
                ? auditFromRow(
                    latestResult.rows[0],
                  )
                : null;

              const actualSequence = latest
                ? latest.sequence + 1
                : 1;

              const actualPreviousHash = latest
                ? latest.hash
                : "GENESIS";

              if (
                actualSequence !==
                  request.expectedSequence ||
                actualPreviousHash !==
                  request.expectedPreviousHash
              ) {
                throw new PostgresVerticalSliceRepositoryError(
                  "AUDIT_CHAIN_CONFLICT",
                );
              }

              const inserted =
                await client.query<AuditRow>(
                  `
                  INSERT INTO nexus_customer_vertical_slice_audit (
                    tenant_id,
                    audit_id,
                    inquiry_id,
                    sequence,
                    source_event_id,
                    source_idempotency_key,
                    customer_id,
                    owner_id,
                    actor_id,
                    actor_role,
                    transition,
                    from_status,
                    to_status,
                    previous_version,
                    next_version,
                    previous_hash,
                    hash,
                    recorded_by_service_id,
                    source_created_at,
                    recorded_at
                  )
                  VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, $13,
                    $14, $15, $16, $17, $18, $19, $20
                  )
                  ON CONFLICT (tenant_id, source_event_id)
                  DO NOTHING
                  RETURNING
                    audit_id AS "auditId",
                    tenant_id AS "tenantId",
                    inquiry_id AS "inquiryId",
                    sequence,
                    source_event_id AS "sourceEventId",
                    source_idempotency_key AS "sourceIdempotencyKey",
                    customer_id AS "customerId",
                    owner_id AS "ownerId",
                    actor_id AS "actorId",
                    actor_role AS "actorRole",
                    transition,
                    from_status AS "fromStatus",
                    to_status AS "toStatus",
                    previous_version AS "previousVersion",
                    next_version AS "nextVersion",
                    previous_hash AS "previousHash",
                    hash,
                    recorded_by_service_id AS "recordedByServiceId",
                    source_created_at AS "sourceCreatedAt",
                    recorded_at AS "recordedAt"
                  `,
                  [
                    tenantId,
                    request.entry.auditId,
                    request.entry.inquiryId,
                    request.entry.sequence,
                    request.entry.sourceEventId,
                    request.entry.sourceIdempotencyKey,
                    request.entry.customerId,
                    request.entry.ownerId,
                    request.entry.actorId,
                    request.entry.actorRole,
                    request.entry.transition,
                    request.entry.fromStatus,
                    request.entry.toStatus,
                    request.entry.previousVersion,
                    request.entry.nextVersion,
                    request.entry.previousHash,
                    request.entry.hash,
                    request.entry.recordedByServiceId,
                    request.entry.sourceCreatedAt,
                    request.entry.recordedAt,
                  ],
                );

              if (inserted.rows[0]) {
                return {
                  created: true,
                  entry: auditFromRow(
                    inserted.rows[0],
                  ),
                };
              }

              const existing =
                await client.query<AuditRow>(
                  AUDIT_SELECT_BY_SOURCE,
                  [
                    tenantId,
                    request.entry.sourceEventId,
                  ],
                );

              if (!existing.rows[0]) {
                throw new PostgresVerticalSliceRepositoryError(
                  "PERSISTENCE_MISMATCH",
                );
              }

              const existingEntry =
                auditFromRow(existing.rows[0]);

              if (
                !auditsMatch(
                  existingEntry,
                  request.entry,
                )
              ) {
                throw new PostgresVerticalSliceRepositoryError(
                  "IDEMPOTENCY_CONFLICT",
                );
              }

              return {
                created: false,
                entry: existingEntry,
              };
            },
          };

          return operation({
            transitionRepository,
            auditRepository,
          });
        },
      );
    },
  };
}
