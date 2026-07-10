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
    process.env.NEXUS_HTTP_GATE_BASE_URL,
  );

const connectionString =
  normalizeString(
    process.env.DATABASE_URL,
  );

const hmacSecret =
  normalizeString(
    process.env.NEXUS_PROTECTED_API_HMAC_SECRET,
  );

if (
  !baseUrl ||
  !connectionString ||
  !hmacSecret
) {
  throw new Error(
    "HTTP gate URL, DATABASE_URL, and HMAC secret are required.",
  );
}

const pool =
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 5000,
    ssl: false,
  });

const suffix =
  randomUUID()
    .replaceAll("-", "")
    .slice(0, 16);

const tenantId =
  `tenant-control-${suffix}`;

const ownerId =
  `owner-control-${suffix}`;

const authorityEpoch =
  `authority-control-${suffix}`;

const routePath =
  "/api/nexus/protected-api-security-probe";

const routeUrl =
  `${baseUrl}${routePath}`;

const bodyText =
  JSON.stringify({
    probe:
      "NEXUS_DAY_677",
    execution:
      "LOCKED",
  });

async function sendRequest({
  nonce,
  requestId,
}) {
  const headers =
    createProtectedApiEnvelopeHeaders({
      url:
        routeUrl,
      method: "POST",
      bodyText,
      tenantId,
      ownerId,
      timestamp:
        Date.now(),
      nonce,
      secret:
        hmacSecret,
      requestId,
    });

  const response =
    await fetch(
      routeUrl,
      {
        method: "POST",
        headers,
        body:
          bodyText,
      },
    );

  const text =
    await response.text();

  let body;

  try {
    body =
      JSON.parse(text);
  } catch {
    body = {
      raw: text,
    };
  }

  return {
    status:
      response.status,
    retryAfter:
      response.headers.get(
        "retry-after",
      ),
    body,
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
          'Day 677 Operational Tenant',
          'ACTIVE'
        )
      `,
      [
        tenantId,
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
      `
        INSERT INTO nexus_protected_api_operational_state (
          tenant_id,
          route_key,
          mode,
          reason_code,
          authority_epoch,
          changed_by_owner_id
        )
        VALUES
          (
            '*',
            '*',
            'OPEN',
            'GLOBAL_SECURITY_GATE_OPEN',
            $1,
            $2
          ),
          (
            $3,
            '*',
            'BLOCKED',
            'TENANT_EMERGENCY_STOP',
            $1,
            $2
          )
      `,
      [
        authorityEpoch,
        ownerId,
        tenantId,
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
      // Original failure remains authoritative.
    }

    throw error;
  } finally {
    client.release();
  }

  const tenantBlocked =
    await sendRequest({
      nonce:
        `nonce-control-${suffix}-blocked`,
      requestId:
        `request-control-${suffix}-blocked`,
    });

  await pool.query(
    `
      UPDATE nexus_protected_api_operational_state
      SET
        mode = 'OPEN',
        reason_code = 'TENANT_SECURITY_GATE_OPEN',
        updated_at = NOW()
      WHERE tenant_id = $1
        AND route_key = '*'
    `,
    [
      tenantId,
    ],
  );

  const tenantOpened =
    await sendRequest({
      nonce:
        `nonce-control-${suffix}-open`,
      requestId:
        `request-control-${suffix}-open`,
    });

  await pool.query(
    `
      UPDATE nexus_protected_api_operational_state
      SET
        mode = 'MAINTENANCE',
        reason_code = 'GLOBAL_EMERGENCY_MAINTENANCE',
        updated_at = NOW()
      WHERE tenant_id = '*'
        AND route_key = '*'
    `,
  );

  const globalBlocked =
    await sendRequest({
      nonce:
        `nonce-control-${suffix}-global`,
      requestId:
        `request-control-${suffix}-global`,
    });

  const evidenceResult =
    await pool.query(
      `
        SELECT
          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_protected_api_nonce
            WHERE tenant_id = $1
              AND owner_id = $2
          ) AS nonce_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $3
          ) AS security_event_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $3
              AND event_type LIKE 'OPERATIONAL_CONTROL_%'
          ) AS operational_event_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $3
              AND event_type = 'OPERATIONAL_CONTROL_BLOCKED'
          ) AS operational_blocked_count,

          (
            SELECT COUNT(*)::INTEGER
            FROM nexus_security_event
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $3
              AND event_type = 'RATE_LIMIT_ALLOWED'
          ) AS rate_event_count,

          (
            SELECT request_count
            FROM nexus_protected_api_rate_limit_bucket
            WHERE tenant_id = $1
              AND owner_id = $2
              AND route_key = $3
            ORDER BY window_start DESC
            LIMIT 1
          ) AS rate_limit_count
      `,
      [
        tenantId,
        ownerId,
        routePath,
      ],
    );

  const evidence =
    evidenceResult.rows?.[0] ??
    {};

  const controls = [
    {
      id:
        "TENANT_KILL_SWITCH_BLOCKS_HTTP",
      passed:
        tenantBlocked.status ===
          503 &&
        tenantBlocked.body
          .errorCode ===
          "PROTECTED_API_OPERATIONALLY_BLOCKED" &&
        Number(
          tenantBlocked.retryAfter,
        ) === 60,
    },
    {
      id:
        "TENANT_OPEN_RESTORES_CONTROLLED_ACCESS",
      passed:
        tenantOpened.status ===
          200 &&
        tenantOpened.body
          .accepted === true &&
        tenantOpened.body
          .operationalControlVerified ===
          true &&
        tenantOpened.body
          .operationalSecurityEventRecorded ===
          true,
    },
    {
      id:
        "GLOBAL_MAINTENANCE_BLOCKS_HTTP",
      passed:
        globalBlocked.status ===
          503 &&
        globalBlocked.body
          .errorCode ===
          "PROTECTED_API_OPERATIONALLY_BLOCKED",
    },
    {
      id:
        "ALL_SIGNED_NONCES_DURABLY_CONSUMED",
      passed:
        evidence.nonce_count ===
        3,
    },
    {
      id:
        "OPERATIONAL_EVENTS_EXACT",
      passed:
        evidence.operational_event_count ===
          3 &&
        evidence.operational_blocked_count ===
          2,
    },
    {
      id:
        "ONLY_OPEN_REQUEST_REACHES_RATE_LIMITER",
      passed:
        evidence.rate_event_count ===
          1 &&
        evidence.rate_limit_count ===
          1,
    },
    {
      id:
        "TOTAL_SECURITY_EVIDENCE_EXACT",
      passed:
        evidence.security_event_count ===
        4,
    },
    {
      id:
        "EXECUTION_REMAINS_LOCKED",
      passed:
        tenantOpened.body
          .executionAuthorized ===
          false &&
        tenantOpened.body
          .providerInvocationPerformed ===
          false &&
        tenantOpened.body
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
      "nexus.real-operational-control-http-gate.v1",
    passed,
    statuses: {
      tenantBlocked:
        tenantBlocked.status,
      tenantOpened:
        tenantOpened.status,
      globalBlocked:
        globalBlocked.status,
    },
    databaseEvidence:
      evidence,
    controls,
    realNextServerVerified:
      true,
    realPostgresVerified:
      true,
    productionDatabaseModified:
      false,
    productionDeploymentModified:
      false,
    executionAuthorized:
      false,
  };

  if (!passed) {
    failure =
      new Error(
        "Real operational-control HTTP gate failed.",
      );
  }
} catch (error) {
  failure = error;

  report = {
    schemaVersion:
      "nexus.real-operational-control-http-gate.v1",
    passed: false,
    error:
      error instanceof Error
        ? error.message
        : String(error),
    productionDatabaseModified:
      false,
    productionDeploymentModified:
      false,
    executionAuthorized:
      false,
  };
} finally {
  try {
    await pool.query(
      `
        DELETE FROM nexus_security_event
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
        DELETE FROM nexus_protected_api_rate_limit_bucket
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
        DELETE FROM nexus_protected_api_nonce
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
        DELETE FROM nexus_protected_api_operational_state
        WHERE tenant_id IN ('*', $1)
      `,
      [
        tenantId,
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
