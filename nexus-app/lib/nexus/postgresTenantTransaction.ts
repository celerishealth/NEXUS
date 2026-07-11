export interface PostgreSqlQueryResult<
  Row extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly rows: readonly Row[];
  readonly rowCount?: number;
}

export interface PostgreSqlTransactionClient {
  query<Row extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<PostgreSqlQueryResult<Row>>;

  release(): void;
}

export interface PostgreSqlConnectionPool {
  connect(): Promise<PostgreSqlTransactionClient>;
}

export interface TenantTransactionContext {
  readonly tenantId: string;
  readonly actorId: string;
  readonly requestId: string;
}

export interface TenantScopedSql {
  readonly context: TenantTransactionContext;

  query<Row extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<PostgreSqlQueryResult<Row>>;
}

interface PostgreSqlTenantContextRow extends Record<string, unknown> {
  readonly tenant_id: string | null;
  readonly actor_id: string | null;
  readonly request_id: string | null;
}

export class PostgreSqlTenantContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostgreSqlTenantContextError";
  }
}

export class PostgreSqlTenantRollbackError extends Error {
  readonly operationError: unknown;
  readonly rollbackError: unknown;

  constructor(operationError: unknown, rollbackError: unknown) {
    super(
      "PostgreSQL tenant transaction failed and rollback also failed. " +
        "The connection must not be reused outside the pool release boundary.",
    );

    this.name = "PostgreSqlTenantRollbackError";
    this.operationError = operationError;
    this.rollbackError = rollbackError;
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireUuid(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!UUID_PATTERN.test(normalized)) {
    throw new PostgreSqlTenantContextError(
      `${fieldName} must be a valid UUID.`,
    );
  }

  return normalized.toLowerCase();
}

function requireRequestId(value: string): string {
  const normalized = value.trim();

  if (normalized.length < 1 || normalized.length > 128) {
    throw new PostgreSqlTenantContextError(
      "requestId must contain between 1 and 128 characters.",
    );
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new PostgreSqlTenantContextError(
      "requestId must not contain control characters.",
    );
  }

  return normalized;
}

function requireQueryText(text: string): string {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new PostgreSqlTenantContextError(
      "Tenant-scoped SQL query text must not be empty.",
    );
  }

  return text;
}

/**
 * Executes one database unit of work with transaction-local PostgreSQL
 * tenant, actor and request context.
 *
 * Safety properties:
 * - Context is validated before a pooled connection is acquired.
 * - PostgreSQL context uses set_config(..., true), making it local to
 *   the current transaction instead of leaking across pooled connections.
 * - Context is read back and compared before customer code can query.
 * - Context mismatch fails closed.
 * - Successful work commits exactly once.
 * - Failed work rolls back.
 * - The connection is always released.
 * - No automatic retry occurs, preventing uncontrolled duplicate effects.
 */
export async function withPostgreSqlTenantTransaction<T>(
  pool: PostgreSqlConnectionPool,
  context: TenantTransactionContext,
  work: (sql: TenantScopedSql) => Promise<T>,
): Promise<T> {
  if (!pool || typeof pool.connect !== "function") {
    throw new PostgreSqlTenantContextError(
      "A PostgreSQL connection pool is required.",
    );
  }

  if (typeof work !== "function") {
    throw new PostgreSqlTenantContextError(
      "A tenant transaction operation is required.",
    );
  }

  const safeContext: TenantTransactionContext = Object.freeze({
    tenantId: requireUuid(context.tenantId, "tenantId"),
    actorId: requireUuid(context.actorId, "actorId"),
    requestId: requireRequestId(context.requestId),
  });

  const client = await pool.connect();

  let transactionStarted = false;
  let transactionCommitted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    await client.query(
      "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE",
    );

    await client.query(
      `
        SELECT
          set_config('app.tenant_id', $1, true) AS tenant_id,
          set_config('app.actor_id', $2, true) AS actor_id,
          set_config('app.request_id', $3, true) AS request_id
      `,
      [
        safeContext.tenantId,
        safeContext.actorId,
        safeContext.requestId,
      ],
    );

    const verification =
      await client.query<PostgreSqlTenantContextRow>(
        `
          SELECT
            current_setting('app.tenant_id', true) AS tenant_id,
            current_setting('app.actor_id', true) AS actor_id,
            current_setting('app.request_id', true) AS request_id
        `,
      );

    const verifiedContext = verification.rows[0];

    if (
      !verifiedContext ||
      verifiedContext.tenant_id !== safeContext.tenantId ||
      verifiedContext.actor_id !== safeContext.actorId ||
      verifiedContext.request_id !== safeContext.requestId
    ) {
      throw new PostgreSqlTenantContextError(
        "PostgreSQL transaction tenant context verification failed.",
      );
    }

    const tenantScopedSql: TenantScopedSql = {
      context: safeContext,

      query<Row extends Record<string, unknown> = Record<string, unknown>>(
        text: string,
        values?: readonly unknown[],
      ): Promise<PostgreSqlQueryResult<Row>> {
        return client.query<Row>(requireQueryText(text), values);
      },
    };

    Object.freeze(tenantScopedSql);

    const result = await work(tenantScopedSql);

    await client.query("COMMIT");
    transactionCommitted = true;

    return result;
  } catch (operationError) {
    if (transactionStarted && !transactionCommitted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        throw new PostgreSqlTenantRollbackError(
          operationError,
          rollbackError,
        );
      }
    }

    throw operationError;
  } finally {
    client.release();
  }
}
