import {
  randomBytes,
  randomUUID,
} from "node:crypto";

import {
  createRequire,
} from "node:module";

import {
  createPostgresAuthenticatedOwnerAccess,
} from "./postgresAuthenticatedOwnerAccess";
import type {
  PostgresAuthenticatedOwnerAuthAccess,
  PostgresAuthenticatedOwnerAuthRuntime,
} from "./postgresAuthenticatedOwnerAuthApi";

const nodeRequire =
  createRequire(
    import.meta.url,
  );

interface PgPoolConstructor {
  new (
    options: Readonly<{
      connectionString: string;
      max: number;
      idleTimeoutMillis: number;
      ssl:
        | Readonly<{
            rejectUnauthorized: boolean;
          }>
        | undefined;
    }>,
  ): PgPool;
}

const {
  Pool,
} = nodeRequire(
  "pg",
) as Readonly<{
  Pool: PgPoolConstructor;
}>;

interface QueryResult<Row> {
  readonly rows: readonly Row[];
  readonly rowCount: number;
}

interface AccessQueryClient {
  query<Row>(
    text: string,
    values?: readonly unknown[],
  ): Promise<QueryResult<Row>>;
}

interface PgQueryResult {
  readonly rows: readonly unknown[];
  readonly rowCount: number | null;
}

interface PgClient {
  query(
    text: string,
    values?: readonly unknown[],
  ): Promise<PgQueryResult>;

  release(): void;
}

interface PgPool {
  connect(): Promise<PgClient>;

  end(): Promise<void>;
}

interface FactoryInput {
  readonly tenantId: string;

  randomBytes(
    size: number,
  ): Uint8Array;

  withTransaction<Result>(
    work: (
      client: AccessQueryClient,
    ) => Promise<Result>,
  ): Promise<Result>;
}

type AccessFactory = (
  input: FactoryInput,
) => PostgresAuthenticatedOwnerAuthAccess;

interface SharedPool {
  readonly connectionString: string;
  readonly sslRequired: boolean;
  readonly pool: PgPool;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let sharedPool:
  SharedPool | null =
  null;

function configurationError(
  message: string,
): Error & {
  readonly code: string;
} {
  return Object.assign(
    new Error(message),
    {
      code:
        "INVALID_CONFIGURATION",
    },
  );
}

function requireEnvironmentValue(
  environment:
    NodeJS.ProcessEnv,
  key: string,
): string {
  const value =
    environment[key]?.trim() ?? "";

  if (!value) {
    throw configurationError(
      `${key} is not configured.`,
    );
  }

  return value;
}

function readSystemActorId(
  environment:
    NodeJS.ProcessEnv,
): string {
  const actorId =
    requireEnvironmentValue(
      environment,
      "NEXUS_AUTH_SYSTEM_ACTOR_ID",
    );

  if (!UUID_PATTERN.test(actorId)) {
    throw configurationError(
      "NEXUS_AUTH_SYSTEM_ACTOR_ID must be a UUID.",
    );
  }

  return actorId;
}

function readSslRequired(
  environment:
    NodeJS.ProcessEnv,
): boolean {
  const mode =
    environment
      .NEXUS_DATABASE_SSL_MODE
      ?.trim()
      .toLowerCase() ??
    "disable";

  if (
    mode !== "disable" &&
    mode !== "require"
  ) {
    throw configurationError(
      "NEXUS_DATABASE_SSL_MODE must be disable or require.",
    );
  }

  return mode === "require";
}

function createPool(
  connectionString: string,
  sslRequired: boolean,
): PgPool {
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis:
      10_000,
    ssl:
      sslRequired
        ? {
            rejectUnauthorized:
              false,
          }
        : undefined,
  }) as unknown as PgPool;
}

function getPool(
  environment:
    NodeJS.ProcessEnv,
): PgPool {
  const connectionString =
    requireEnvironmentValue(
      environment,
      "DATABASE_URL",
    );

  const sslRequired =
    readSslRequired(
      environment,
    );

  if (sharedPool !== null) {
    if (
      sharedPool.connectionString !==
        connectionString ||
      sharedPool.sslRequired !==
        sslRequired
    ) {
      throw configurationError(
        "PostgreSQL authentication pool configuration changed during runtime.",
      );
    }

    return sharedPool.pool;
  }

  const pool =
    createPool(
      connectionString,
      sslRequired,
    );

  sharedPool = {
    connectionString,
    sslRequired,
    pool,
  };

  return pool;
}

async function executeTenantTransaction<Result>(
  pool: PgPool,
  context: Readonly<{
    tenantId: string;
    actorId: string;
    requestId: string;
  }>,
  work: (
    client: AccessQueryClient,
  ) => Promise<Result>,
): Promise<Result> {
  const client =
    await pool.connect();

  let transactionStarted =
    false;

  try {
    await client.query(
      "BEGIN",
    );

    transactionStarted =
      true;

    await client.query(
      `
        SELECT
          set_config(
            'app.tenant_id',
            $1,
            true
          ),
          set_config(
            'app.actor_id',
            $2,
            true
          ),
          set_config(
            'app.request_id',
            $3,
            true
          )
      `,
      [
        context.tenantId,
        context.actorId,
        context.requestId,
      ],
    );

    const accessClient:
      AccessQueryClient =
      {
        async query<Row>(
          text: string,
          values?: readonly unknown[],
        ) {
          const result =
            await client.query(
              text,
              values,
            );

          return {
            rows:
              result.rows as readonly Row[],
            rowCount:
              result.rowCount ?? 0,
          };
        },
      };

    const result =
      await work(
        accessClient,
      );

    await client.query(
      "COMMIT",
    );

    return result;
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query(
          "ROLLBACK",
        );
      } catch {
        throw configurationError(
          "PostgreSQL authentication transaction rollback failed.",
        );
      }
    }

    throw error;
  } finally {
    client.release();
  }
}

export function createPostgresAuthenticatedOwnerAuthRuntime(
  environment:
    NodeJS.ProcessEnv =
      process.env,
): PostgresAuthenticatedOwnerAuthRuntime {
  return {
    createAccess(
      input,
    ) {
      if (!UUID_PATTERN.test(input.tenantId)) {
        throw {
          code:
            "INVALID_INPUT",
        };
      }

      const actorId =
        readSystemActorId(
          environment,
        );

      const requestId =
        UUID_PATTERN.test(
          input.requestId,
        )
          ? input.requestId
          : randomUUID();

      const factory =
        createPostgresAuthenticatedOwnerAccess as unknown as AccessFactory;

      return factory({
        tenantId:
          input.tenantId,

        randomBytes(
          size,
        ) {
          return randomBytes(
            size,
          );
        },

        withTransaction<Result>(
          work: (
            client:
              AccessQueryClient,
          ) => Promise<Result>,
        ) {
          return executeTenantTransaction(
            getPool(
              environment,
            ),
            {
              tenantId:
                input.tenantId,
              actorId,
              requestId,
            },
            work,
          );
        },
      });
    },

    now() {
      return new Date()
        .toISOString();
    },

    randomRequestId() {
      return randomUUID();
    },
  };
}

export async function closePostgresAuthenticatedOwnerAuthPoolForTests():
  Promise<void> {
  const current =
    sharedPool;

  sharedPool =
    null;

  if (current !== null) {
    await current.pool.end();
  }
}
