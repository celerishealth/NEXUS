import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  PROTECTED_API_RATE_LIMIT_MODE,
  PostgresProtectedApiRateLimitStore,
  getProtectedApiRateLimitStorePosture,
} from "../lib/nexus/protectedApiRateLimitStore.mjs";

import {
  enforceProtectedApiRateLimit,
  getProtectedApiRateLimitGuardPosture,
} from "../lib/nexus/protectedApiRateLimitGuard.mjs";

const ROUTES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
  "app/api/nexus/protected-api-security-probe/route.js",
  "app/api/nexus/controlled-action-state/route.js",
];

function signedContext(
  overrides = {},
) {
  return {
    schemaVersion:
      "nexus.protected-api-authorization-context.v1",
    tenantId:
      "tenant-day-675",
    ownerId:
      "owner-day-675",
    pathname:
      "/api/nexus/test",
    signatureVerified: true,
    bodyIntegrityVerified: true,
    ...overrides,
  };
}

function tenantContext(
  overrides = {},
) {
  return {
    schemaVersion:
      "nexus.protected-api-tenant-authorization-context.v1",
    tenantId:
      "tenant-day-675",
    ownerId:
      "owner-day-675",
    durableMembershipVerified:
      true,
    ...overrides,
  };
}

test(
  "allows a protected request below the distributed limit",
  async () => {
    const result =
      await enforceProtectedApiRateLimit(
        signedContext(),
        tenantContext(),
        {
          requestId:
            "request-day-675",
          mode:
            PROTECTED_API_RATE_LIMIT_MODE,
          nowMs:
            1783680000000,
          maximumRequests: 5,
          windowMs: 60000,
          store: {
            async consume() {
              return {
                ok: true,
                allowed: true,
                requestCount: 1,
                maximumRequests: 5,
                remaining: 4,
                windowStartMs:
                  1783680000000,
                windowEndMs:
                  1783680060000,
                retryAfterSeconds: 0,
                eventId:
                  "security-event-675",
              };
            },
          },
        },
      );

    assert.equal(result.ok, true);

    assert.equal(
      result.rateLimitContext
        .durableCounterVerified,
      true,
    );

    assert.equal(
      result.rateLimitContext
        .durableSecurityEventRecorded,
      true,
    );

    assert.equal(
      result.rateLimitContext
        .executionAuthorized,
      false,
    );
  },
);

test(
  "returns HTTP 429 after the durable limit is exceeded",
  async () => {
    const result =
      await enforceProtectedApiRateLimit(
        signedContext(),
        tenantContext(),
        {
          mode:
            PROTECTED_API_RATE_LIMIT_MODE,
          nowMs:
            1783680000000,
          store: {
            async consume() {
              return {
                ok: true,
                allowed: false,
                requestCount: 6,
                maximumRequests: 5,
                remaining: 0,
                windowStartMs:
                  1783680000000,
                windowEndMs:
                  1783680060000,
                retryAfterSeconds: 60,
                eventId:
                  "security-block-675",
              };
            },
          },
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 429);

    assert.equal(
      result.error.errorCode,
      "PROTECTED_API_RATE_LIMIT_EXCEEDED",
    );

    assert.equal(
      result.headers["Retry-After"],
      "60",
    );
  },
);

test(
  "blocks mismatched signed and durable tenant identities",
  async () => {
    const result =
      await enforceProtectedApiRateLimit(
        signedContext(),
        tenantContext({
          tenantId:
            "tenant-foreign-675",
        }),
        {
          mode:
            PROTECTED_API_RATE_LIMIT_MODE,
          store: {
            async consume() {
              throw new Error(
                "Store must not be called.",
              );
            },
          },
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 403);

    assert.equal(
      result.error.errorCode,
      "RATE_LIMIT_IDENTITY_BINDING_MISMATCH",
    );
  },
);

test(
  "fails closed when the distributed rate-limit mode is missing",
  async () => {
    const result =
      await enforceProtectedApiRateLimit(
        signedContext(),
        tenantContext(),
        {
          mode: "",
          store: {
            async consume() {
              return {
                ok: true,
                allowed: true,
              };
            },
          },
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "DISTRIBUTED_RATE_LIMIT_REQUIRED",
    );
  },
);

test(
  "uses one PostgreSQL statement for counter and security evidence",
  async () => {
    const calls = [];

    const store =
      new PostgresProtectedApiRateLimitStore({
        pool: {
          async query(sql, values) {
            calls.push({
              sql,
              values,
            });

            return {
              rows: [
                {
                  request_count: 1,
                  event_id:
                    "security-event-675",
                },
              ],
            };
          },
        },
      });

    const result =
      await store.consume({
        tenantId:
          "tenant-day-675",
        ownerId:
          "owner-day-675",
        routeKey:
          "/api/nexus/test",
        requestId:
          "request-day-675",
        nowMs:
          1783680000000,
        windowMs: 60000,
        maximumRequests: 5,
      });

    assert.equal(result.ok, true);
    assert.equal(result.allowed, true);
    assert.equal(calls.length, 1);

    assert.match(
      calls[0].sql,
      /ON CONFLICT/,
    );

    assert.match(
      calls[0].sql,
      /nexus_security_event/,
    );

    assert.match(
      calls[0].sql,
      /RATE_LIMIT_BLOCKED/,
    );
  },
);

test(
  "migration creates atomic buckets and durable security events",
  () => {
    const migration =
      readFileSync(
        "db/migrations/0003_nexus_rate_limit_security_event.sql",
        "utf8",
      );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_protected_api_rate_limit_bucket/,
    );

    assert.match(
      migration,
      /PRIMARY KEY\s*\(\s*tenant_id,\s*owner_id,\s*route_key,\s*window_start\s*\)/s,
    );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_security_event/,
    );

    assert.match(
      migration,
      /metadata_json JSONB/,
    );
  },
);

test(
  "every protected POST route uses the distributed limiter",
  () => {
    for (const route of ROUTES) {
      const content =
        readFileSync(
          route,
          "utf8",
        );

      assert.match(
        content,
        /enforceProtectedApiRateLimit/,
        route,
      );

      assert.match(
        content,
        /getProtectedApiRateLimitStore/,
        route,
      );

      assert.match(
        content,
        /NEXUS_PROTECTED_API_RATE_LIMIT_MODE/,
        route,
      );

      assert.match(
        content,
        /const rateLimitGuard/,
        route,
      );
    }
  },
);

test(
  "reports honest non-execution rate-limit posture",
  () => {
    const store =
      getProtectedApiRateLimitStorePosture();

    const guard =
      getProtectedApiRateLimitGuardPosture();

    assert.equal(
      store.mode,
      PROTECTED_API_RATE_LIMIT_MODE,
    );

    assert.equal(
      store.distributedAtomicCounter,
      true,
    );

    assert.equal(
      store.durableSecurityEventEvidence,
      true,
    );

    assert.equal(
      store.liveMigrationPerformed,
      false,
    );

    assert.equal(
      store.executionAuthorized,
      false,
    );

    assert.equal(
      guard.executionAuthorized,
      false,
    );
  },
);


