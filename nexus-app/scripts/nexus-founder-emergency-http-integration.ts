import assert from "node:assert/strict";
import {
  spawn,
} from "node:child_process";
import {
  randomUUID,
} from "node:crypto";
import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type {
  AddressInfo,
} from "node:net";
import {
  tmpdir,
} from "node:os";
import {
  join,
  resolve,
} from "node:path";

import {
  SQLiteAuthenticatedPrincipalStore,
} from "../lib/nexus/sqliteAuthenticatedPrincipalStore";
import {
  signAuthenticatedTenantSessionToken,
  SQLiteAuthenticatedTenantSessionStore,
} from "../lib/nexus/sqliteAuthenticatedTenantSessionStore";
import {
  SQLiteTenantOwnerBootstrapStore,
} from "../lib/nexus/sqliteTenantOwnerBootstrap";

interface JsonResult {
  status: number;
  body: Record<string, unknown>;
  headers: Headers;
}

interface StubRequest {
  pathname: string;
  tenantId: string | null;
  authorizationVerified: boolean;
}

interface StubState {
  tenantId: string;
  operationStatus:
    | "active"
    | "paused";
  blockingSignalId:
    | string
    | null;
  stateVersion: number;
  lastTransitionAt: number;
}

interface LocalStub {
  server: Server;
  port: number;
  requests: StubRequest[];
  getCommitCount(): number;
  getState(): StubState;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function requireRecord(
  value: unknown,
  label: string,
): Record<string, unknown> {
  assert.ok(
    isRecord(value),
    `${label} must be an object.`,
  );

  return value;
}

function requireString(
  value: unknown,
  label: string,
): string {
  assert.equal(
    typeof value,
    "string",
    `${label} must be a string.`,
  );

  const normalized =
    String(value).trim();

  assert.ok(
    normalized.length > 0,
    `${label} must not be empty.`,
  );

  return normalized;
}

async function readRequestBody(
  request: IncomingMessage,
): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk),
    );
  }

  const text =
    Buffer.concat(chunks)
      .toString("utf8")
      .trim();

  if (!text) {
    return {};
  }

  return requireRecord(
    JSON.parse(text) as unknown,
    "Stub request body",
  );
}

function writeJson(
  response: ServerResponse,
  status: number,
  body: unknown,
): void {
  response.statusCode = status;
  response.setHeader(
    "content-type",
    "application/json",
  );
  response.setHeader(
    "cache-control",
    "no-store",
  );
  response.end(
    JSON.stringify(body),
  );
}

async function listenLocal(
  server: Server,
): Promise<number> {
  await new Promise<void>(
    (resolveListen, rejectListen) => {
      const onError =
        (error: Error) => {
          server.off(
            "listening",
            onListening,
          );
          rejectListen(error);
        };

      const onListening = () => {
        server.off(
          "error",
          onError,
        );
        resolveListen();
      };

      server.once(
        "error",
        onError,
      );
      server.once(
        "listening",
        onListening,
      );
      server.listen(
        0,
        "127.0.0.1",
      );
    },
  );

  const address =
    server.address();

  assert.ok(
    address &&
      typeof address !== "string",
    "Local server address is unavailable.",
  );

  return (
    address as AddressInfo
  ).port;
}

async function closeServer(
  server: Server,
): Promise<void> {
  if (!server.listening) {
    return;
  }

  await new Promise<void>(
    (resolveClose, rejectClose) => {
      server.close((error) => {
        if (error) {
          rejectClose(error);
          return;
        }

        resolveClose();
      });
    },
  );
}

async function createLocalSupabaseStub(
  tenantId: string,
  serviceRoleKey: string,
): Promise<LocalStub> {
  const requests: StubRequest[] = [];

  const state: StubState = {
    tenantId,
    operationStatus:
      "active",
    blockingSignalId: null,
    stateVersion: 1,
    lastTransitionAt:
      Date.now(),
  };

  let commitCount = 0;

  const server = createServer(
    (request, response) => {
      void (async () => {
        const url =
          new URL(
            request.url ?? "/",
            "http://127.0.0.1",
          );

        if (
          request.method !== "POST"
        ) {
          writeJson(
            response,
            405,
            {
              error:
                "Method not allowed.",
            },
          );
          return;
        }

        const authorization =
          request.headers.authorization;

        const apiKey =
          request.headers.apikey;

        const authorizationVerified =
          authorization ===
            `Bearer ${serviceRoleKey}` &&
          apiKey === serviceRoleKey;

        if (
          !authorizationVerified
        ) {
          writeJson(
            response,
            401,
            {
              error:
                "Local stub authentication failed.",
            },
          );
          return;
        }

        const body =
          await readRequestBody(
            request,
          );

        const requestTenantId =
          typeof body.p_tenant_id ===
          "string"
            ? body.p_tenant_id
            : null;

        requests.push({
          pathname: url.pathname,
          tenantId:
            requestTenantId,
          authorizationVerified,
        });

        if (
          requestTenantId !==
          tenantId
        ) {
          writeJson(
            response,
            200,
            [],
          );
          return;
        }

        if (
          url.pathname ===
          "/rest/v1/rpc/nexus_read_controlled_pilot_operation_state"
        ) {
          writeJson(
            response,
            200,
            [
              {
                tenant_id:
                  state.tenantId,
                operation_status:
                  state.operationStatus,
                blocking_signal_id:
                  state.blockingSignalId,
                state_version:
                  state.stateVersion,
                last_transition_at_epoch:
                  state.lastTransitionAt,
              },
            ],
          );
          return;
        }

        if (
          url.pathname ===
          "/rest/v1/rpc/nexus_commit_controlled_pilot_health_pause"
        ) {
          commitCount += 1;

          const signalId =
            requireString(
              body.p_signal_id,
              "Pause signal ID",
            );

          const signalSource =
            body.p_signal_source;

          const severity =
            body.p_severity;

          const observedAt =
            body.p_observed_at_epoch;

          const expectedStateVersion =
            body.p_expected_state_version;

          assert.equal(
            signalSource,
            "founder-emergency-operations",
          );
          assert.equal(
            severity,
            "critical",
          );
          assert.ok(
            Number.isSafeInteger(
              observedAt,
            ),
          );
          assert.ok(
            Number.isSafeInteger(
              expectedStateVersion,
            ),
          );

          if (
            state.operationStatus ===
            "paused"
          ) {
            writeJson(
              response,
              200,
              [
                {
                  status:
                    "already-paused",
                  operation_status:
                    state.operationStatus,
                  blocking_signal_id:
                    state.blockingSignalId,
                  state_version:
                    state.stateVersion,
                },
              ],
            );
            return;
          }

          if (
            expectedStateVersion !==
            state.stateVersion
          ) {
            writeJson(
              response,
              200,
              [
                {
                  status:
                    "state-version-conflict",
                  operation_status:
                    state.operationStatus,
                  state_version:
                    state.stateVersion,
                },
              ],
            );
            return;
          }

          state.operationStatus =
            "paused";
          state.blockingSignalId =
            signalId;
          state.stateVersion += 1;
          state.lastTransitionAt =
            Number(observedAt);

          writeJson(
            response,
            200,
            [
              {
                status:
                  "committed",
                operation_status:
                  "paused",
                blocking_signal_id:
                  signalId,
                state_version:
                  state.stateVersion,
              },
            ],
          );
          return;
        }

        writeJson(
          response,
          404,
          {
            error:
              "Unknown local RPC.",
          },
        );
      })().catch(() => {
        writeJson(
          response,
          500,
          {
            error:
              "Local stub failed safely.",
          },
        );
      });
    },
  );

  const port =
    await listenLocal(server);

  return {
    server,
    port,
    requests,
    getCommitCount() {
      return commitCount;
    },
    getState() {
      return {
        ...state,
      };
    },
  };
}

async function reserveLocalPort():
Promise<number> {
  const server =
    createServer();

  const port =
    await listenLocal(server);

  await closeServer(server);

  return port;
}

async function requestJson(
  url: string,
  init?: RequestInit,
): Promise<JsonResult> {
  const response =
    await fetch(
      url,
      {
        ...init,
        cache: "no-store",
      },
    );

  const text =
    await response.text();

  let body: unknown = {};

  if (text.trim()) {
    try {
      body =
        JSON.parse(text) as unknown;
    } catch {
      body = {};
    }
  }

  return {
    status: response.status,
    body:
      isRecord(body)
        ? body
        : {},
    headers:
      response.headers,
  };
}

async function waitForNextServer(
  baseUrl: string,
  getLogTail: () => string,
): Promise<void> {
  const deadline =
    Date.now() + 60_000;

  while (
    Date.now() < deadline
  ) {
    try {
      const response =
        await fetch(
          baseUrl,
          {
            cache:
              "no-store",
          },
        );

      if (
        response.status > 0
      ) {
        return;
      }
    } catch {
      // The production server is still starting.
    }

    await new Promise<void>(
      (resolveWait) => {
        setTimeout(
          resolveWait,
          250,
        );
      },
    );
  }

  throw new Error(
    `Local Next server did not become ready. ${getLogTail()}`,
  );
}

async function stopChild(
  child:
    ReturnType<typeof spawn> | null,
): Promise<void> {
  if (
    !child ||
    child.exitCode !== null
  ) {
    return;
  }

  child.kill();

  await Promise.race([
    new Promise<void>(
      (resolveExit) => {
        child.once(
          "exit",
          () => {
            resolveExit();
          },
        );
      },
    ),
    new Promise<void>(
      (resolveTimeout) => {
        setTimeout(
          resolveTimeout,
          5_000,
        );
      },
    ),
  ]);

  if (
    child.exitCode === null
  ) {
    child.kill("SIGKILL");
  }
}

async function main(): Promise<void> {
const suffix =
  randomUUID()
    .replaceAll("-", "")
    .slice(0, 16);

const tenantId =
  `tenant-day805-${suffix}`;

const tenantSlug =
  `day805-${suffix}`;

const principalId =
  `principal-day805-${suffix}`;

const actorId =
  `owner-day805-${suffix}`;

const unauthorizedActorId =
  `owner-day806-unauthorized-${suffix}`;

const unauthorizedSessionId =
  `session-day806-unauthorized-${suffix}`;

const ownerEmail =
  `day805-${suffix}@example.test`;

const ownerPassword =
  "Day805-Owner-Password-2026!";

const keyId =
  "day805-local-key";

const signingSecret =
  "day805-local-signing-secret-000000000000000000000000000000000000";

const serviceRoleKey =
  "day805-local-service-role-key-0000000000000000000000000000000000";

const temporaryRoot =
  await mkdtemp(
    join(
      tmpdir(),
      "nexus-day805-",
    ),
  );

const sqlitePath =
  join(
    temporaryRoot,
    "founder-emergency.sqlite",
  );

let supabaseStub:
  LocalStub | null = null;

let nextChild:
  ReturnType<typeof spawn> | null =
    null;

let failure:
  Error | null = null;

let report:
  Record<string, unknown>;

let nextLogs = "";

try {
  const principalStore =
    new SQLiteAuthenticatedPrincipalStore(
      sqlitePath,
    );

  principalStore.close();

  const sessionStore =
    new SQLiteAuthenticatedTenantSessionStore(
      sqlitePath,
    );

  sessionStore.close();

  const createdAt =
    new Date().toISOString();

  const expiresAt =
    new Date(
      Date.now() +
        60 * 60 * 1000,
    ).toISOString();

  const bootstrapStore =
    new SQLiteTenantOwnerBootstrapStore(
      sqlitePath,
    );

  try {
    const bootstrap =
      await bootstrapStore
        .bootstrapTenantOwner({
          tenantId,
          tenantSlug,
          tenantDisplayName:
            "Day 805 Local HTTP Tenant",
          principalId,
          actorId,
          ownerEmail,
          ownerPassword,
          sessionClaims: {
            version: 1,
            keyId,
            sessionId:
              `seed-session-${suffix}`,
            tenantId,
            actorId,
            role: "owner",
            issuedAt:
              createdAt,
            expiresAt,
          },
          createdAt,
        });

    assert.equal(
      bootstrap.tenant.tenantId,
      tenantId,
    );
    assert.equal(
      bootstrap.owner.actorId,
      actorId,
    );
    assert.equal(
      bootstrap.liveProviderExecutionAuthorized,
      false,
    );
  } finally {
    bootstrapStore.close();
  }

  const unauthorizedClaims = {
    version: 1 as const,
    keyId,
    sessionId:
      unauthorizedSessionId,
    tenantId,
    actorId:
      unauthorizedActorId,
    role: "owner",
    issuedAt:
      createdAt,
    expiresAt,
  };

  const unauthorizedSessionStore =
    new SQLiteAuthenticatedTenantSessionStore(
      sqlitePath,
    );

  try {
    await unauthorizedSessionStore
      .createSession({
        ...unauthorizedClaims,
        createdAt,
      });
  } finally {
    unauthorizedSessionStore.close();
  }

  const unauthorizedAccessToken =
    signAuthenticatedTenantSessionToken(
      unauthorizedClaims,
      signingSecret,
    );

  supabaseStub =
    await createLocalSupabaseStub(
      tenantId,
      serviceRoleKey,
    );

  const nextPort =
    await reserveLocalPort();

  const nextBaseUrl =
    `http://127.0.0.1:${nextPort}`;

  const stubBaseUrl =
    `http://127.0.0.1:${supabaseStub.port}`;

  assert.equal(
    new URL(nextBaseUrl)
      .hostname,
    "127.0.0.1",
  );

  assert.equal(
    new URL(stubBaseUrl)
      .hostname,
    "127.0.0.1",
  );

  const nextBin =
    resolve(
      process.cwd(),
      "node_modules",
      "next",
      "dist",
      "bin",
      "next",
    );

  nextChild = spawn(
    process.execPath,
    [
      nextBin,
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      String(nextPort),
    ],
    {
      cwd:
        process.cwd(),
      env: {
        ...process.env,
        NODE_ENV:
          "production",
        NEXUS_AUTH_SESSION_ISSUANCE_ENABLED:
          "true",
        NEXUS_AUTH_SESSION_REVOCATION_ENABLED:
          "true",
        NEXUS_CONTROLLED_ACTION_STORAGE:
          "sqlite",
        NEXUS_CONTROLLED_ACTION_SQLITE_PATH:
          sqlitePath,
        NEXUS_AUTH_SESSION_KEY_ID:
          keyId,
        NEXUS_AUTH_SESSION_SIGNING_SECRET:
          signingSecret,
        NEXUS_AUTH_SESSION_DURATION_MS:
          "3600000",
        NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS:
          "60000",
        NEXUS_FOUNDER_EMERGENCY_OPERATIONS_ENABLED:
          "true",
        NEXUS_FOUNDER_EMERGENCY_OWNER_ACTOR_ID:
          actorId,
        SUPABASE_URL:
          stubBaseUrl,
        NEXT_PUBLIC_SUPABASE_URL:
          stubBaseUrl,
        SUPABASE_SERVICE_ROLE_KEY:
          serviceRoleKey,
      },
      stdio: [
        "ignore",
        "pipe",
        "pipe",
      ],
      windowsHide: true,
    },
  );

  const appendLog =
    (chunk: Buffer | string) => {
      nextLogs +=
        chunk.toString();

      if (
        nextLogs.length >
        20_000
      ) {
        nextLogs =
          nextLogs.slice(-20_000);
      }
    };

  nextChild.stdout?.on(
    "data",
    appendLog,
  );

  nextChild.stderr?.on(
    "data",
    appendLog,
  );

  await waitForNextServer(
    nextBaseUrl,
    () =>
      nextLogs.slice(-2_000),
  );

  const unauthenticated =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "GET",
      },
    );

  assert.equal(
    unauthenticated.status,
    401,
  );
  assert.equal(
    unauthenticated.body
      .liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(
    unauthenticated.body
      .resumeAuthorized,
    false,
  );

  const rpcCountBeforeUnauthorized =
    supabaseStub.requests.length;

  const unauthorizedOwnerStatus =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "GET",
        headers: {
          authorization:
            `Bearer ${unauthorizedAccessToken}`,
        },
      },
    );

  assert.equal(
    unauthorizedOwnerStatus.status,
    403,
  );
  assert.equal(
    unauthorizedOwnerStatus.body.error,
    "Owner authority is required.",
  );
  assert.equal(
    unauthorizedOwnerStatus.body
      .liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(
    unauthorizedOwnerStatus.body
      .resumeAuthorized,
    false,
  );
  assert.equal(
    supabaseStub.requests.length,
    rpcCountBeforeUnauthorized,
  );

  const login =
    await requestJson(
      `${nextBaseUrl}/api/nexus/auth/session`,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          tenantId,
          email: ownerEmail,
          password:
            ownerPassword,
        }),
      },
    );

  assert.equal(
    login.status,
    200,
  );

  const accessToken =
    requireString(
      login.body.accessToken,
      "Issued access token",
    );

  assert.equal(
    login.body.tokenType,
    "Bearer",
  );
  assert.equal(
    login.body
      .liveProviderExecutionAuthorized,
    false,
  );

  const loginSession =
    requireRecord(
      login.body.session,
      "Issued session",
    );

  assert.equal(
    loginSession.tenantId,
    tenantId,
  );
  assert.equal(
    loginSession.actorId,
    actorId,
  );
  assert.equal(
    loginSession.role,
    "owner",
  );

  const authorization =
    `Bearer ${accessToken}`;

  const initialStatus =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    );

  assert.equal(
    initialStatus.status,
    200,
  );
  assert.equal(
    initialStatus.body
      .tenantId,
    tenantId,
  );
  assert.equal(
    initialStatus.body
      .ownerActorId,
    actorId,
  );
  assert.equal(
    initialStatus.body
      .operationStatus,
    "active",
  );
  assert.equal(
    initialStatus.body
      .emergencyPauseAvailable,
    true,
  );
  assert.equal(
    initialStatus.body
      .liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(
    initialStatus.body
      .resumeAuthorized,
    false,
  );

  const attackerSignal =
    `attacker-signal-${suffix}`;

  const pause =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "POST",
        headers: {
          authorization,
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          tenantId:
            "attacker-tenant",
          ownerActorId:
            "attacker-owner",
          signalId:
            attackerSignal,
          resumeAuthorized:
            true,
        }),
      },
    );

  assert.equal(
    pause.status,
    200,
  );
  assert.equal(
    pause.body.pauseStatus,
    "paused",
  );
  assert.equal(
    pause.body.tenantId,
    tenantId,
  );
  assert.equal(
    pause.body.ownerActorId,
    actorId,
  );
  assert.equal(
    pause.body.operationStatus,
    "paused",
  );
  assert.equal(
    pause.body
      .liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(
    pause.body
      .resumeAuthorized,
    false,
  );

  const blockingSignalId =
    requireString(
      pause.body.blockingSignalId,
      "Server-generated blocking signal",
    );

  assert.notEqual(
    blockingSignalId,
    attackerSignal,
  );

  const finalStatus =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "GET",
        headers: {
          authorization,
        },
      },
    );

  assert.equal(
    finalStatus.status,
    200,
  );
  assert.equal(
    finalStatus.body
      .operationStatus,
    "paused",
  );
  assert.equal(
    finalStatus.body
      .blockingSignalId,
    blockingSignalId,
  );
  assert.equal(
    finalStatus.body
      .emergencyPauseAvailable,
    false,
  );

  const replay =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "POST",
        headers: {
          authorization,
        },
      },
    );

  assert.equal(
    replay.status,
    200,
  );
  assert.equal(
    replay.body.pauseStatus,
    "already-paused",
  );
  assert.equal(
    replay.body.blockingSignalId,
    blockingSignalId,
  );
  assert.equal(
    supabaseStub.getCommitCount(),
    1,
  );

  const resumeAttempt =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency/resume`,
      {
        method: "POST",
        headers: {
          authorization,
        },
      },
    );

  assert.equal(
    resumeAttempt.status,
    404,
  );

  const revocationLogin =
    await requestJson(
      `${nextBaseUrl}/api/nexus/auth/session`,
      {
        method: "POST",
        headers: {
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          tenantId,
          email: ownerEmail,
          password:
            ownerPassword,
        }),
      },
    );

  assert.equal(
    revocationLogin.status,
    200,
  );

  const revocationAccessToken =
    requireString(
      revocationLogin.body.accessToken,
      "Revocation access token",
    );

  const revocationLoginSession =
    requireRecord(
      revocationLogin.body.session,
      "Revocation login session",
    );

  const revocationSessionId =
    requireString(
      revocationLoginSession.sessionId,
      "Revocation session ID",
    );

  const revocationAuthorization =
    `Bearer ${revocationAccessToken}`;

  const authorizedBeforeRevocation =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "GET",
        headers: {
          authorization:
            revocationAuthorization,
        },
      },
    );

  assert.equal(
    authorizedBeforeRevocation.status,
    200,
  );
  assert.equal(
    authorizedBeforeRevocation.body
      .tenantId,
    tenantId,
  );
  assert.equal(
    authorizedBeforeRevocation.body
      .ownerActorId,
    actorId,
  );
  assert.equal(
    authorizedBeforeRevocation.body
      .operationStatus,
    "paused",
  );

  const revocation =
    await requestJson(
      `${nextBaseUrl}/api/nexus/auth/session/revoke`,
      {
        method: "POST",
        headers: {
          authorization:
            revocationAuthorization,
        },
      },
    );

  assert.equal(
    revocation.status,
    200,
  );
  assert.equal(
    revocation.body.revoked,
    true,
  );
  assert.equal(
    revocation.body
      .liveProviderExecutionAuthorized,
    false,
  );

  const revokedAt =
    requireString(
      revocation.body.revokedAt,
      "Revocation timestamp",
    );

  const durableRevocationStore =
    new SQLiteAuthenticatedTenantSessionStore(
      sqlitePath,
    );

  let durableRevocationRecord:
    Awaited<
      ReturnType<
        SQLiteAuthenticatedTenantSessionStore["readSnapshot"]
      >
    >[number] | undefined;

  try {
    const snapshot =
      await durableRevocationStore
        .readSnapshot();

    durableRevocationRecord =
      snapshot.find(
        (session) =>
          session.sessionId ===
          revocationSessionId,
      );
  } finally {
    durableRevocationStore.close();
  }

  assert.ok(
    durableRevocationRecord,
    "Revoked durable session record must exist.",
  );
  assert.equal(
    durableRevocationRecord.revokedAt,
    revokedAt,
  );
  assert.equal(
    durableRevocationRecord.revocationReason,
    "SELF_LOGOUT",
  );

  const rpcCountAfterRevocation =
    supabaseStub.requests.length;

  const revokedStatus =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "GET",
        headers: {
          authorization:
            revocationAuthorization,
        },
      },
    );

  assert.equal(
    revokedStatus.status,
    401,
  );
  assert.equal(
    revokedStatus.body.error,
    "Authentication failed.",
  );
  assert.equal(
    revokedStatus.body
      .liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(
    revokedStatus.body
      .resumeAuthorized,
    false,
  );

  const revokedPause =
    await requestJson(
      `${nextBaseUrl}/api/nexus/founder-emergency`,
      {
        method: "POST",
        headers: {
          authorization:
            revocationAuthorization,
          "content-type":
            "application/json",
        },
        body: JSON.stringify({
          tenantId:
            "attacker-tenant-after-revocation",
          ownerActorId:
            "attacker-owner-after-revocation",
          resumeAuthorized:
            true,
        }),
      },
    );

  assert.equal(
    revokedPause.status,
    401,
  );
  assert.equal(
    revokedPause.body.error,
    "Authentication failed.",
  );
  assert.equal(
    revokedPause.body
      .liveProviderExecutionAuthorized,
    false,
  );
  assert.equal(
    revokedPause.body
      .resumeAuthorized,
    false,
  );

  const revocationReplay =
    await requestJson(
      `${nextBaseUrl}/api/nexus/auth/session/revoke`,
      {
        method: "POST",
        headers: {
          authorization:
            revocationAuthorization,
        },
      },
    );

  assert.equal(
    revocationReplay.status,
    401,
  );
  assert.equal(
    revocationReplay.body.error,
    "Authentication failed.",
  );
  assert.equal(
    revocationReplay.body
      .liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    supabaseStub.requests.length,
    rpcCountAfterRevocation,
  );

  const stubState =
    supabaseStub.getState();

  assert.equal(
    stubState.tenantId,
    tenantId,
  );
  assert.equal(
    stubState.operationStatus,
    "paused",
  );
  assert.equal(
    stubState.blockingSignalId,
    blockingSignalId,
  );

  assert.ok(
    supabaseStub.requests.length >=
      4,
  );

  assert.ok(
    supabaseStub.requests.every(
      (request) =>
        request.tenantId ===
          tenantId &&
        request.authorizationVerified &&
        request.pathname.startsWith(
          "/rest/v1/rpc/nexus_",
        ),
    ),
  );

  const controls = [
    {
      id:
        "REAL_NEXT_PRODUCTION_SERVER",
      passed: true,
    },
    {
      id:
        "LOCAL_SQLITE_OWNER_AUTHENTICATION",
      passed:
        login.status === 200,
    },
    {
      id:
        "UNAUTHENTICATED_REQUEST_BLOCKED",
      passed:
        unauthenticated.status ===
        401,
    },
    {
      id:
        "AUTHENTICATED_STATUS_ACTIVE",
      passed:
        initialStatus.body
          .operationStatus ===
        "active",
    },
    {
      id:
        "SERVER_BOUND_TENANT_OWNER",
      passed:
        pause.body.tenantId ===
          tenantId &&
        pause.body
          .ownerActorId ===
          actorId,
    },
    {
      id:
        "BROWSER_BODY_OVERRIDE_BLOCKED",
      passed:
        blockingSignalId !==
          attackerSignal,
    },
    {
      id:
        "ATOMIC_PAUSE_VERIFIED",
      passed:
        finalStatus.body
          .operationStatus ===
          "paused" &&
        finalStatus.body
          .blockingSignalId ===
          blockingSignalId,
    },
    {
      id:
        "IDEMPOTENT_REPLAY_NO_SECOND_COMMIT",
      passed:
        replay.body
          .pauseStatus ===
          "already-paused" &&
        supabaseStub
          .getCommitCount() ===
          1,
    },
    {
      id:
        "RESUME_ENDPOINT_ABSENT",
      passed:
        resumeAttempt.status ===
        404,
    },
    {
      id:
        "LOCAL_SUPABASE_RPC_STUB_ONLY",
      passed:
        supabaseStub.requests
          .every(
            (request) =>
              request
                .authorizationVerified,
          ),
    },
    {
      id:
        "UNAUTHORIZED_DURABLE_OWNER_BLOCKED",
      passed:
        unauthorizedOwnerStatus.status ===
          403 &&
        unauthorizedOwnerStatus.body.error ===
          "Owner authority is required.",
    },
    {
      id:
        "UNAUTHORIZED_OWNER_NO_RPC_ACCESS",
      passed:
        rpcCountBeforeUnauthorized ===
        0,
    },
    {
      id:
        "AUTHORIZED_SESSION_WORKS_BEFORE_REVOCATION",
      passed:
        authorizedBeforeRevocation.status ===
          200,
    },
    {
      id:
        "SESSION_REVOCATION_HTTP_VERIFIED",
      passed:
        revocation.status ===
          200 &&
        revocation.body.revoked ===
          true,
    },
    {
      id:
        "DURABLE_REVOCATION_EVIDENCE_VERIFIED",
      passed:
        durableRevocationRecord.revokedAt ===
          revokedAt &&
        durableRevocationRecord.revocationReason ===
          "SELF_LOGOUT",
    },
    {
      id:
        "REVOKED_STATUS_ACCESS_BLOCKED",
      passed:
        revokedStatus.status ===
          401,
    },
    {
      id:
        "REVOKED_PAUSE_ACCESS_BLOCKED",
      passed:
        revokedPause.status ===
          401,
    },
    {
      id:
        "REVOKED_REQUESTS_NO_RPC_ACCESS",
      passed:
        supabaseStub.requests.length ===
          rpcCountAfterRevocation,
    },
    {
      id:
        "REVOCATION_REPLAY_BLOCKED",
      passed:
        revocationReplay.status ===
          401,
    },
    {
      id:
        "LIVE_EXECUTION_LOCKED",
      passed:
        pause.body
          .liveProviderExecutionAuthorized ===
          false,
    },
    {
      id:
        "RESUME_AUTHORIZATION_LOCKED",
      passed:
        pause.body
          .resumeAuthorized ===
          false,
    },
  ];

  const passed =
    controls.every(
      (control) =>
        control.passed,
    );

  report = {
    schemaVersion:
      "nexus.founder-emergency-real-http-integration.v2",
    passed,
    statuses: {
      unauthenticated:
        unauthenticated.status,
      login:
        login.status,
      initialStatus:
        initialStatus.status,
      pause:
        pause.status,
      finalStatus:
        finalStatus.status,
      replay:
        replay.status,
      resumeAttempt:
        resumeAttempt.status,
      unauthorizedOwner:
        unauthorizedOwnerStatus.status,
      authorizedBeforeRevocation:
        authorizedBeforeRevocation.status,
      revocation:
        revocation.status,
      revokedStatus:
        revokedStatus.status,
      revokedPause:
        revokedPause.status,
      revocationReplay:
        revocationReplay.status,
    },
    controls,
    rpcRequestCount:
      supabaseStub.requests.length,
    atomicCommitCount:
      supabaseStub.getCommitCount(),
    realNextServerVerified:
      true,
    localSQLiteVerified:
      true,
    localSupabaseStubVerified:
      true,
    productionDatabaseModified:
      false,
    productionDeploymentModified:
      false,
    liveProviderExecutionAuthorized:
      false,
    resumeAuthorized:
      false,
  };

  if (!passed) {
    throw new Error(
      "Founder emergency real HTTP controls failed.",
    );
  }
} catch (error) {
  failure =
    error instanceof Error
      ? error
      : new Error(
          "Unknown Day 805 integration failure.",
        );

  report = {
    schemaVersion:
      "nexus.founder-emergency-real-http-integration.v2",
    passed: false,
    error:
      failure.message,
    productionDatabaseModified:
      false,
    productionDeploymentModified:
      false,
    liveProviderExecutionAuthorized:
      false,
    resumeAuthorized:
      false,
  };
} finally {
  await stopChild(
    nextChild,
  );

  if (supabaseStub) {
    await closeServer(
      supabaseStub.server,
    );
  }

  await rm(
    temporaryRoot,
    {
      recursive: true,
      force: true,
    },
  );
}

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

if (failure) {
  process.exitCode = 1;
}
}

void main().catch((error) => {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown Day 805 runner failure.";

  process.stderr.write(
    `${message}\n`,
  );
  process.exitCode = 1;
});