import { createHash } from "node:crypto";

import type {
  InternalPilotHttpRequest,
} from "./internalPilotSandboxWorkerEndpoint";

import type {
  InternalPilotRouteRuntime,
  TrustedInternalPilotRouteSession,
} from "./internalPilotSandboxWorkerRoute";

export type PostgresInternalPilotSessionResolverErrorCode =
  | "INVALID_CONFIGURATION"
  | "INVALID_REQUEST"
  | "SESSION_QUERY_FAILED"
  | "SESSION_ROW_INVALID";

export class PostgresInternalPilotSessionResolverError extends Error {
  readonly code: PostgresInternalPilotSessionResolverErrorCode;

  constructor(
    code: PostgresInternalPilotSessionResolverErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PostgresInternalPilotSessionResolverError";
    this.code = code;
  }
}

export interface PostgresInternalPilotSessionQueryResult<
  Row extends Record<string, unknown> = Record<string, unknown>,
> {
  rows: Row[];
  rowCount: number | null;
}

export interface PostgresInternalPilotSessionQuery {
  <Row extends Record<string, unknown> = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<PostgresInternalPilotSessionQueryResult<Row>>;
}

export interface PostgresInternalPilotSessionResolverRuntime {
  tenantId: string;
  query: PostgresInternalPilotSessionQuery;
  now?: () => Date;
  cookieName?: string;
  maxCookieHeaderBytes?: number;
}

interface SessionRow extends Record<string, unknown> {
  tenant_id: unknown;
  session_id: unknown;
  session_digest: unknown;
  actor_id: unknown;
  role: unknown;
  owner_approval_granted: unknown;
  csrf_token_digest: unknown;
  expires_at: unknown;
}

const DEFAULT_COOKIE_NAME =
  "nexus_internal_pilot_session";

const DEFAULT_MAX_COOKIE_HEADER_BYTES = 4_096;

const SESSION_ROW_KEYS = [
  "actor_id",
  "csrf_token_digest",
  "expires_at",
  "owner_approval_granted",
  "role",
  "session_digest",
  "session_id",
  "tenant_id",
] as const;

const RESOLVE_SESSION_SQL = `
/* nexus-day768:resolve-session */
SELECT
  tenant_id,
  session_id,
  session_digest,
  actor_id,
  role,
  owner_approval_granted,
  csrf_token_digest,
  expires_at
FROM nexus_internal_pilot_owner_sessions
WHERE tenant_id = $1
  AND session_digest = $2
  AND revoked_at IS NULL
  AND expires_at > $3::timestamptz
LIMIT 1
`;

function resolverError(
  code: PostgresInternalPilotSessionResolverErrorCode,
  message: string,
): PostgresInternalPilotSessionResolverError {
  return new PostgresInternalPilotSessionResolverError(
    code,
    message,
  );
}

function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isIdentifier(
  value: unknown,
  minimumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= minimumLength &&
    value.length <= 128 &&
    /^[A-Za-z0-9][A-Za-z0-9:_-]*$/.test(value)
  );
}

function isDigest(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-f0-9]{64}$/.test(value)
  );
}

function assertExactRowKeys(
  value: unknown,
): asserts value is SessionRow {
  if (!isPlainRecord(value)) {
    throw resolverError(
      "SESSION_ROW_INVALID",
      "The internal pilot session record is invalid.",
    );
  }

  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...SESSION_ROW_KEYS].sort();

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some(
      (key, index) => key !== expectedKeys[index],
    )
  ) {
    throw resolverError(
      "SESSION_ROW_INVALID",
      "The internal pilot session record contract is invalid.",
    );
  }
}

function parseTimestamp(
  value: unknown,
): string {
  let parsed: Date;

  if (value instanceof Date) {
    parsed = value;
  } else if (typeof value === "string") {
    parsed = new Date(value);
  } else {
    throw resolverError(
      "SESSION_ROW_INVALID",
      "The internal pilot session expiry is invalid.",
    );
  }

  if (Number.isNaN(parsed.getTime())) {
    throw resolverError(
      "SESSION_ROW_INVALID",
      "The internal pilot session expiry is invalid.",
    );
  }

  return parsed.toISOString();
}

function readSingleHeader(
  headers: Readonly<Record<string, string | undefined>>,
  name: string,
): string | undefined {
  const normalizedName = name.toLowerCase();
  let found: string | undefined;

  for (const [key, value] of Object.entries(headers)) {
    if (
      key.toLowerCase() !== normalizedName ||
      value === undefined
    ) {
      continue;
    }

    if (typeof value !== "string") {
      throw resolverError(
        "INVALID_REQUEST",
        "The internal pilot request headers are invalid.",
      );
    }

    if (found !== undefined) {
      throw resolverError(
        "INVALID_REQUEST",
        "Duplicate internal pilot request headers are blocked.",
      );
    }

    found = value;
  }

  return found;
}

function readSessionToken(
  request: InternalPilotHttpRequest,
  cookieName: string,
  maxCookieHeaderBytes: number,
): string | null {
  if (
    !isPlainRecord(request) ||
    typeof request.method !== "string" ||
    !isPlainRecord(request.headers) ||
    typeof request.bodyText !== "string"
  ) {
    throw resolverError(
      "INVALID_REQUEST",
      "The internal pilot authentication request is invalid.",
    );
  }

  const cookieHeader = readSingleHeader(
    request.headers,
    "cookie",
  );

  if (cookieHeader === undefined) {
    return null;
  }

  if (
    Buffer.byteLength(cookieHeader, "utf8") >
    maxCookieHeaderBytes
  ) {
    return null;
  }

  let sessionToken: string | null = null;

  for (const rawPart of cookieHeader.split(";")) {
    const part = rawPart.trim();

    if (!part) {
      continue;
    }

    const separatorIndex = part.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const name = part
      .slice(0, separatorIndex)
      .trim();

    if (name !== cookieName) {
      continue;
    }

    if (sessionToken !== null) {
      throw resolverError(
        "INVALID_REQUEST",
        "Duplicate internal pilot session cookies are blocked.",
      );
    }

    const value = part
      .slice(separatorIndex + 1)
      .trim();

    if (
      value.length < 32 ||
      value.length > 256 ||
      !/^[A-Za-z0-9._~-]+$/.test(value)
    ) {
      return null;
    }

    sessionToken = value;
  }

  return sessionToken;
}

function validateRuntime(
  runtime: unknown,
): asserts runtime is PostgresInternalPilotSessionResolverRuntime {
  if (
    !isPlainRecord(runtime) ||
    !isIdentifier(runtime.tenantId, 3) ||
    typeof runtime.query !== "function" ||
    (
      runtime.now !== undefined &&
      typeof runtime.now !== "function"
    ) ||
    (
      runtime.cookieName !== undefined &&
      (
        typeof runtime.cookieName !== "string" ||
        runtime.cookieName.length < 3 ||
        runtime.cookieName.length > 64 ||
        !/^[A-Za-z0-9_-]+$/.test(runtime.cookieName)
      )
    ) ||
    (
      runtime.maxCookieHeaderBytes !== undefined &&
      (
        typeof runtime.maxCookieHeaderBytes !== "number" ||
        !Number.isInteger(runtime.maxCookieHeaderBytes) ||
        runtime.maxCookieHeaderBytes < 512 ||
        runtime.maxCookieHeaderBytes > 16_384
      )
    )
  ) {
    throw resolverError(
      "INVALID_CONFIGURATION",
      "The Postgres internal pilot session resolver configuration is invalid.",
    );
  }
}

function validateRowCount(
  result: PostgresInternalPilotSessionQueryResult,
): void {
  if (
    typeof result.rowCount !== "number" ||
    !Number.isInteger(result.rowCount) ||
    (
      result.rowCount !== 0 &&
      result.rowCount !== 1
    ) ||
    result.rows.length !== result.rowCount
  ) {
    throw resolverError(
      "SESSION_ROW_INVALID",
      "The internal pilot session query response is invalid.",
    );
  }
}

function parseSessionRow(
  rawRow: unknown,
  expectedTenantId: string,
  expectedSessionDigest: string,
  currentTime: Date,
): TrustedInternalPilotRouteSession | null {
  assertExactRowKeys(rawRow);

  if (
    !isIdentifier(rawRow.tenant_id, 3) ||
    rawRow.tenant_id !== expectedTenantId ||
    !isIdentifier(rawRow.session_id, 8) ||
    !isDigest(rawRow.session_digest) ||
    rawRow.session_digest !== expectedSessionDigest ||
    !isIdentifier(rawRow.actor_id, 3) ||
    (
      rawRow.role !== "owner" &&
      rawRow.role !== "operator"
    ) ||
    typeof rawRow.owner_approval_granted !== "boolean" ||
    !isDigest(rawRow.csrf_token_digest)
  ) {
    throw resolverError(
      "SESSION_ROW_INVALID",
      "The internal pilot session record binding is invalid.",
    );
  }

  const expiresAt = parseTimestamp(
    rawRow.expires_at,
  );

  if (
    new Date(expiresAt).getTime() <=
    currentTime.getTime()
  ) {
    return null;
  }

  return {
    sessionId: rawRow.session_id,
    actorId: rawRow.actor_id,
    tenantId: rawRow.tenant_id,
    authenticated: true,
    role: rawRow.role,
    ownerApprovalGranted:
      rawRow.owner_approval_granted,
    csrfTokenDigest:
      rawRow.csrf_token_digest,
    expiresAt,
  };
}

export function createInternalPilotSessionTokenDigest(
  sessionToken: string,
): string {
  if (
    typeof sessionToken !== "string" ||
    sessionToken.length < 32 ||
    sessionToken.length > 256 ||
    !/^[A-Za-z0-9._~-]+$/.test(sessionToken)
  ) {
    throw resolverError(
      "INVALID_REQUEST",
      "The internal pilot session credential is invalid.",
    );
  }

  return createHash("sha256")
    .update(sessionToken, "utf8")
    .digest("hex");
}

export function createPostgresInternalPilotSessionResolver(
  runtime: PostgresInternalPilotSessionResolverRuntime,
): InternalPilotRouteRuntime["resolveSession"] {
  validateRuntime(runtime);

  const now = runtime.now ?? (() => new Date());
  const cookieName =
    runtime.cookieName ?? DEFAULT_COOKIE_NAME;
  const maxCookieHeaderBytes =
    runtime.maxCookieHeaderBytes ??
    DEFAULT_MAX_COOKIE_HEADER_BYTES;

  return async (
    request: InternalPilotHttpRequest,
  ): Promise<TrustedInternalPilotRouteSession | null> => {
    const sessionToken = readSessionToken(
      request,
      cookieName,
      maxCookieHeaderBytes,
    );

    if (sessionToken === null) {
      return null;
    }

    const sessionDigest =
      createInternalPilotSessionTokenDigest(
        sessionToken,
      );

    const currentTime = now();

    if (
      !(currentTime instanceof Date) ||
      Number.isNaN(currentTime.getTime())
    ) {
      throw resolverError(
        "INVALID_CONFIGURATION",
        "The internal pilot session resolver clock is invalid.",
      );
    }

    let result: PostgresInternalPilotSessionQueryResult<SessionRow>;

    try {
      result = await runtime.query<SessionRow>(
        RESOLVE_SESSION_SQL,
        [
          runtime.tenantId,
          sessionDigest,
          currentTime.toISOString(),
        ],
      );
    } catch (error) {
      if (
        error instanceof
        PostgresInternalPilotSessionResolverError
      ) {
        throw error;
      }

      throw resolverError(
        "SESSION_QUERY_FAILED",
        "The internal pilot authentication service is unavailable.",
      );
    }

    validateRowCount(result);

    if (result.rowCount === 0) {
      return null;
    }

    return parseSessionRow(
      result.rows[0],
      runtime.tenantId,
      sessionDigest,
      currentTime,
    );
  };
}
