import {
  assertAuthenticatedSessionMatchesGatewayContext,
  AuthenticatedTenantSessionRecord,
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "./sqliteAuthenticatedTenantSessionStore";

export interface RevokeAuthenticatedTenantSessionOptions {
  token: string;
  signingSecrets:
    Readonly<Record<string, string>>;
  now: string;
  maxClockSkewMs: number;
  reason?: string;
}

export interface AuthenticatedTenantSessionRevocationResult {
  revoked: true;
  sessionId: string;
  tenantId: string;
  actorId: string;
  role: string;
  revokedAt: string;
  revocationReason: string;
  liveProviderExecutionAuthorized: false;
}

function requireNonEmpty(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return normalized;
}

function parseTimestamp(
  value: string,
  fieldName: string,
): number {
  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(
      `${fieldName} must be a valid timestamp.`,
    );
  }

  return timestamp;
}

function validateRevokedRecord(
  record:
    AuthenticatedTenantSessionRecord,
  expectedRevokedAt: string,
  expectedReason: string,
): void {
  if (
    record.revokedAt !==
      expectedRevokedAt ||
    record.revocationReason !==
      expectedReason
  ) {
    throw new Error(
      "Durable authenticated-session revocation evidence is inconsistent.",
    );
  }
}

export async function revokeAuthenticatedTenantSession(
  store:
    SQLiteAuthenticatedTenantSessionStore,
  options:
    RevokeAuthenticatedTenantSessionOptions,
): Promise<AuthenticatedTenantSessionRevocationResult> {
  const token =
    requireNonEmpty(
      options.token,
      "Bearer authenticated session token",
    );

  const now =
    requireNonEmpty(
      options.now,
      "Authenticated session revocation time",
    );

  parseTimestamp(
    now,
    "Authenticated session revocation time",
  );

  const reason =
    requireNonEmpty(
      options.reason ??
        "SELF_LOGOUT",
      "Authenticated session revocation reason",
    );

  const claims =
    verifyAuthenticatedTenantSessionToken(
      token,
      options.signingSecrets,
      {
        now,
        maxClockSkewMs:
          options.maxClockSkewMs,
      },
    );

  assertAuthenticatedSessionMatchesGatewayContext(
    claims,
    {
      tenantId:
        claims.tenantId,
      actorId:
        claims.actorId,
      role:
        claims.role,
    },
  );

  await store.assertActiveSession(
    claims,
    now,
  );

  const revokedRecord =
    await store.revokeSession({
      sessionId:
        claims.sessionId,
      reason,
      revokedAt:
        now,
    });

  validateRevokedRecord(
    revokedRecord,
    now,
    reason,
  );

  return {
    revoked: true,
    sessionId:
      claims.sessionId,
    tenantId:
      claims.tenantId,
    actorId:
      claims.actorId,
    role:
      claims.role,
    revokedAt:
      now,
    revocationReason:
      reason,
    liveProviderExecutionAuthorized:
      false,
  };
}
