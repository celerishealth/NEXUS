import { resolveControlledActionSQLiteRuntimePath } from "./controlledActionSQLiteRuntimePath";
import {
  SQLiteAuthenticatedTenantSessionStore,
  verifyAuthenticatedTenantSessionToken,
} from "./sqliteAuthenticatedTenantSessionStore";

export type FounderCommandAuthenticationFailureReason =
  | "authentication-failed"
  | "authentication-not-configured"
  | "owner-authority-required";

export type FounderCommandAuthenticationResult =
  | {
      ok: true;
      tenantId: string;
      actorId: string;
    }
  | {
      ok: false;
      status: 401 | 403 | 503;
      reason: FounderCommandAuthenticationFailureReason;
    };

function readBearerToken(request: Request): string | null {
  const authorization =
    request.headers.get("authorization")?.trim() ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization);

  if (!match) {
    return null;
  }

  const token = match[1]?.trim() ?? "";
  return token.length > 0 ? token : null;
}

function readMaximumClockSkewMs(): number {
  const raw =
    process.env.NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS?.trim();

  if (!raw) {
    return 60_000;
  }

  const parsed = Number(raw);

  if (
    !Number.isInteger(parsed) ||
    parsed < 0 ||
    parsed > 300_000
  ) {
    return 60_000;
  }

  return parsed;
}

export async function authenticateFounderCommandRequest(
  request: Request,
): Promise<FounderCommandAuthenticationResult> {
  const token = readBearerToken(request);

  if (!token) {
    return {
      ok: false,
      status: 401,
      reason: "authentication-failed",
    };
  }

  const keyId =
    process.env.NEXUS_AUTH_SESSION_KEY_ID?.trim() ?? "primary";
  const signingSecret =
    process.env.NEXUS_AUTH_SESSION_SIGNING_SECRET?.trim() ?? "";
  const allowedOwnerActorId =
    process.env.NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID?.trim() ?? "";

  if (!signingSecret || !allowedOwnerActorId) {
    return {
      ok: false,
      status: 503,
      reason: "authentication-not-configured",
    };
  }

  const now = new Date().toISOString();
  let sessionStore: SQLiteAuthenticatedTenantSessionStore | null = null;

  try {
    const claims = verifyAuthenticatedTenantSessionToken(
      token,
      { [keyId]: signingSecret },
      {
        now,
        maxClockSkewMs: readMaximumClockSkewMs(),
      },
    );

    sessionStore = new SQLiteAuthenticatedTenantSessionStore(
      resolveControlledActionSQLiteRuntimePath(
        process.env.NEXUS_CONTROLLED_ACTION_SQLITE_PATH,
      ),
    );

    await sessionStore.assertActiveSession(claims, now);

    if (
      claims.role !== "owner" ||
      claims.actorId !== allowedOwnerActorId
    ) {
      return {
        ok: false,
        status: 403,
        reason: "owner-authority-required",
      };
    }

    return {
      ok: true,
      tenantId: claims.tenantId,
      actorId: claims.actorId,
    };
  } catch {
    return {
      ok: false,
      status: 401,
      reason: "authentication-failed",
    };
  } finally {
    sessionStore?.close();
  }
}