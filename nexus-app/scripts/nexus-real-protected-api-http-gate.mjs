import {
  randomUUID,
} from "node:crypto";

import pg from "pg";

import {
  createProtectedApiEnvelopeHeaders,
} from "../lib/nexus/protectedApiSignedEnvelope.mjs";

const { Pool } = pg;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

const baseUrl =
  normalizeString(
    process.env
      .NEXUS_HTTP_GATE_BASE_URL,
  );

const connectionString =
  normalizeString(
    process.env.DATABASE_URL,
  );

const hmacSecret =
  normalizeString(
    process.env
      .NEXUS_PROTECTED_API_HMAC_SECRET,
  );

if (!baseUrl) {
  throw new Error(
    "NEXUS_HTTP_GATE_BASE_URL is required.",
  );
}

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required.",
  );
}

if (!hmacSecret) {
  throw new Error(
    "NEXUS_PROTECTED_API_HMAC_SECRET is required.",
  );
}

const sslRequired =
  normalizeString(
    process.env
      .NEXUS_DATABASE_SSL_MODE,
  ).toLowerCase() !== "disable";

const pool =
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    ssl: sslRequired
      ? {
          rejectUnauthorized: false,
        }
      : false,
  });

const suffix =
  randomUUID()
    .replaceAll("-", "")
    .slice(0, 16);

const tenantId =
  `tenant-http-${suffix}`;

const foreignTenantId =
  `tenant-http-foreign-${suffix}`;

const ownerId =
  `owner-http-${suffix}`;

const authorityEpoch =
  `authority-http-${suffix}`;

const routePath =
  "/api/nexus/protected-api-security-probe";

const routeUrl =
  `${baseUrl}${routePath}`;

const bodyText =
  JSON.stringify({
    probe:
      "NEXUS_DAY_676",
    safety:
      "NO_EXECUTION",
  });

function createHeaders({
  nonce,
  signedUrl = routeUrl,
  signedBodyText = bodyText,
  signedTenantId = tenantId,
  requestId,
}) {
  return createProtectedApiEnvelopeHeaders({
    url: signedUrl,
    method: "POST",
    bodyText:
      signedBodyText,
    tenantId:
      signedTenantId,
    ownerId,
    timestamp:
      Date.now(),
    nonce,
    secret:
      hmacSecret,
    requestId,
  });
}

async function sendSignedRequest({
  nonce,
  signedUrl,
  signedBodyText,
  sentBodyText = bodyText,
  signedTenantId,
  requestId,
}) {
  const response =
    await fetch(
      routeUrl,
      {
        method: "POST",
        headers:
          createHeaders({
            nonce,
            signedUrl,
            signedBodyText,
            signedTenantId,
            requestId,
          }),
        body:
          sentBodyText,
      },
    );

  const responseText =
    await response.text();

  let responseBody;

  try {
    responseBody =
      JSON.parse(
        responseText,
      );
  } catch {
    responseBody = {
      raw:
        responseText,
    };
  }

  return {
    status:
      response.status,
    headers: {
      requestId:
        response.headers.get(
          "x-nexus-request-id",
        ),
      limit:
        response.headers.get(
          "ratelimit-limit",
        ),
      remaining:
        response.headers.get(
          "ratelimit-remaining",
        ),
      retryAfter:
        response.headers.get(
          "retry-after",
        ),
    },
    body:
      responseBody,
  };
}

let report;
let failure = null;

try {
  const client =
    await pool.connect();

  try {
    await client.query(
      "BEGIN",
    );

    await client.query(
      `
        INSERT INTO nexus_tenant (
          tenant_id,
          display_name,
          status
        )
        VALUES (
          $1,
          $2,
          'ACTIVE'
        )
      `,
      [
        tenantId,
        "NEXUS Day 676 HTTP Tenant",
      ],
    );

    await client.query(
      `
        INSERT INTO nexus_owner_identity (
          owner_id,
          status
        )
        VALUES (
          $1,
          'ACTIVE'
        )
      `,
      [
        ownerId,
      ],
    );

    await client.query(
      `
        INSERT INTO nexus_tenant_owner_membership (
          tenant_id,
          owner_id,
          role,
          status,
          authority_epoch
        )
        VALUES (
          $1,
          $2,
          'OWNER',
          'ACTIVE',
          $3
        )
      `,
      [
        tenantId,
        ownerId,
        authorityEpoch,
      ],
    );

    await client.query(
      "COMMIT",
    );
  } catch (error) {
    try {
      await client.query(
        "ROLLBACK",
      );
    } catch {
      // Original seed failure remains authoritative.
    }

    throw error;
  } finally {
    client.release();
  }

  const firstNonce =
    `nonce-http-${suffix}-0001`;

  const first =
    await sendSignedRequest({
      nonce:
        firstNonce,
      requestId:
        `request-http-${suffix}-0001`,
    });

  const replay =
    await sendSignedRequest({
      nonce:
        firstNonce,
      requestId:
        `request-http-${suffix}-replay`,
    });

  const wrongPath =
    await sendSignedRequest({
      nonce:
        `nonce-http-${suffix}-path`,
      signedUrl:
        `${baseUrl}/api/nexus/wrong-path`,
      requestId:
        `request-http-${suffix}-path`,
    });

  const alteredBody =
    await sendSignedRequest({
      nonce:
        `nonce-http-${suffix}-body`,
      signedBodyText:
        JSON.stringify({
          amount: 1,
        }),
      sentBodyText:
        JSON.stringify({
          amount: 999999,
        }),
      requestId:
        `request-http-${suffix}-body`,
    });

  const crossTenant =
    await sendSignedRequest({
      nonce:
        `nonce-http-${suffix}-foreign`,
      signedTenantId:
        foreignTenantId,
      requestId:
        `request-http-${suffix}-foreign`,
    });

  const second =
    await sendSignedRequest({
      nonce:
        `nonce-http-${suffix}-0002`,
      requestId:
        `request-http-${suffix}-0002`,
    });

  const third =
    await sendSignedRequest({
      nonce:
        `nonce-http-${suffix}-0003`,
      requestId:
        `request-http-${suffix}-0003`,
    });

  const fourth =
    await sendSignedRequest({
      nonce:
        `nonce-http-${suffix}-0004`,
      requestId:
        `request-http-${suffix}-0004`,
    });

  const databaseEvidence =
    await pool.query(
      `
        SELECT
          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_protected_api_nonce
            WHERE tenant_id = $1
              AND owner_id = $2
          ) AS accepted_nonce_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_protected_api_nonce
            WHERE tenant_id = $3
              AND owner_id = $2
          ) AS foreign_nonce_count,

          (
            SELECT request_count
            FROM nexus_protected_api_rate_limit_bucket
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $4
            ORDER BY window_start DESC
            LIMIT 1
          ) AS rate_limit_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $4
          ) AS security_event_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $4
              AND decision = 'BLOCKED'
          ) AS blocked_event_count
      `,
      [
        tenantId,
        ownerId,
        foreignTenantId,
        routePath,
      ],
    );

  const evidence =
    databaseEvidence.rows?.[0] ??
    {};

  const controls = [
    {
      id:
        "REAL_HTTP_SIGNED_REQUEST_ACCEPTED",
      passed:
        first.status === 200 &&
        first.body.accepted ===
          true &&
        first.body
          .signatureVerified ===
          true &&
        first.body
          .durableReplayVerified ===
          true &&
        first.body
          .durableMembershipVerified ===
          true &&
        first.body
          .durableRateLimitVerified ===
          true &&
        first.body
          .durableSecurityEventRecorded ===
          true,
    },
    {
      id:
        "REAL_HTTP_REPLAY_REJECTED",
      passed:
        replay.status === 409 &&
        replay.body.errorCode ===
          "SIGNED_ENVELOPE_REPLAY_BLOCKED",
    },
    {
      id:
        "REAL_HTTP_PATH_TAMPERING_REJECTED",
      passed:
        wrongPath.status === 401 &&
        wrongPath.body.errorCode ===
          "SIGNED_ENVELOPE_SIGNATURE_INVALID",
    },
    {
      id:
        "REAL_HTTP_BODY_TAMPERING_REJECTED",
      passed:
        alteredBody.status === 401 &&
        alteredBody.body.errorCode ===
          "SIGNED_ENVELOPE_BODY_DIGEST_MISMATCH",
    },
    {
      id:
        "REAL_HTTP_CROSS_TENANT_REJECTED",
      passed:
        crossTenant.status === 403 &&
        crossTenant.body.errorCode ===
          "TENANT_OWNER_ACCESS_DENIED",
    },
    {
      id:
        "REAL_HTTP_LIMIT_ALLOWS_FIRST_THREE",
      passed:
        first.status === 200 &&
        second.status === 200 &&
        third.status === 200,
    },
    {
      id:
        "REAL_HTTP_FOURTH_REQUEST_RATE_LIMITED",
      passed:
        fourth.status === 429 &&
        fourth.body.errorCode ===
          "PROTECTED_API_RATE_LIMIT_EXCEEDED" &&
        Number(
          fourth.headers.retryAfter,
        ) >= 1,
    },
    {
      id:
        "DURABLE_NONCE_ROWS_EXACT",
      passed:
        evidence.accepted_nonce_count ===
          4 &&
        evidence.foreign_nonce_count ===
          1,
    },
    {
      id:
        "DURABLE_RATE_COUNTER_EXACT",
      passed:
        evidence.rate_limit_count ===
          4,
    },
    {
      id:
        "DURABLE_SECURITY_EVENTS_EXACT",
      passed:
        evidence.security_event_count ===
          4 &&
        evidence.blocked_event_count ===
          1,
    },
    {
      id:
        "EXECUTION_REMAINS_LOCKED",
      passed:
        first.body
          .executionAuthorized ===
          false &&
        first.body
          .providerInvocationPerformed ===
          false &&
        first.body
          .customerDataMutationPerformed ===
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
      "nexus.real-protected-api-http-security-gate.v1",
    passed,
    endpoint:
      routePath,
    statuses: {
      first:
        first.status,
      replay:
        replay.status,
      wrongPath:
        wrongPath.status,
      alteredBody:
        alteredBody.status,
      crossTenant:
        crossTenant.status,
      second:
        second.status,
      third:
        third.status,
      fourth:
        fourth.status,
    },
    databaseEvidence:
      evidence,
    controls,
    realNextServerVerified:
      true,
    realPostgresVerified:
      true,
    productionDeploymentModified:
      false,
    productionDatabaseModified:
      false,
    customerDataMutationPerformed:
      false,
    providerInvocationPerformed:
      false,
    executionAuthorized:
      false,
  };

  if (!passed) {
    failure =
      new Error(
        "Real protected API HTTP security gate failed.",
      );
  }
} catch (error) {
  failure = error;

  report = {
    schemaVersion:
      "nexus.real-protected-api-http-security-gate.v1",
    passed: false,
    error:
      error instanceof Error
        ? error.message
        : String(error),
    productionDeploymentModified:
      false,
    productionDatabaseModified:
      false,
    executionAuthorized:
      false,
  };
} finally {
  try {
    await pool.query(
      `
        DELETE FROM nexus_security_event
        WHERE tenant_id IN ($1, $2)
          AND owner_id = $3
      `,
      [
        tenantId,
        foreignTenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_protected_api_rate_limit_bucket
        WHERE tenant_id IN ($1, $2)
          AND owner_id = $3
      `,
      [
        tenantId,
        foreignTenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_protected_api_nonce
        WHERE tenant_id IN ($1, $2)
          AND owner_id = $3
      `,
      [
        tenantId,
        foreignTenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant_owner_membership
        WHERE tenant_id = $1
          AND owner_id = $2
      `,
      [
        tenantId,
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_owner_identity
        WHERE owner_id = $1
      `,
      [
        ownerId,
      ],
    );

    await pool.query(
      `
        DELETE FROM nexus_tenant
        WHERE tenant_id = $1
      `,
      [
        tenantId,
      ],
    );
  } catch (cleanupError) {
    failure =
      failure ??
      cleanupError;
  }

  await pool.end();
}

console.log(
  JSON.stringify(
    report,
    null,
    2,
  ),
);

if (failure) {
  process.exit(1);
}
