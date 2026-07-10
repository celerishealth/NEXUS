import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  DURABLE_REPLAY_MODE,
  PostgresProtectedApiReplayStore,
  getProtectedApiReplayStorePosture,
} from "../lib/nexus/protectedApiReplayStore.mjs";

import {
  createProtectedApiEnvelopeHeaders,
  inspectProtectedApiSignedEnvelope,
  resetProtectedApiNonceCacheForTests,
} from "../lib/nexus/protectedApiSignedEnvelope.mjs";

const SECRET =
  "day-670-durable-replay-test-secret";

const URL =
  "https://nexus.example/api/nexus/controlled-action-review-console";

const NOW =
  1783680000000;

const ROUTES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
];

function createSignedRequest({
  nonce =
    "nonce-day-670-00000001",
} = {}) {
  const bodyText =
    JSON.stringify({
      actionId:
        "action-day-670",
    });

  const headers =
    createProtectedApiEnvelopeHeaders({
      url: URL,
      method: "POST",
      bodyText,
      tenantId:
        "tenant-day-670",
      ownerId:
        "owner-day-670",
      timestamp: NOW,
      nonce,
      secret: SECRET,
      requestId:
        "request-day-670",
    });

  return new Request(URL, {
    method: "POST",
    headers,
    body: bodyText,
  });
}

function createFakeDurableStore() {
  const consumed =
    new Set();

  return {
    async consumeNonce(input) {
      const key =
        `${input.tenantId}:${input.ownerId}:${input.nonce}`;

      if (consumed.has(key)) {
        return {
          ok: true,
          consumed: false,
          durable: true,
        };
      }

      consumed.add(key);

      return {
        ok: true,
        consumed: true,
        durable: true,
      };
    },
  };
}

test.beforeEach(() => {
  resetProtectedApiNonceCacheForTests();
});

test(
  "accepts a production request through the durable atomic replay store",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode:
            DURABLE_REPLAY_MODE,
          replayStore:
            createFakeDurableStore(),
        },
      );

    assert.equal(result.ok, true);

    assert.equal(
      result.authorizationContext
        .durableReplayPersistenceVerified,
      true,
    );

    assert.equal(
      result.authorizationContext
        .replayProtectionMode,
      DURABLE_REPLAY_MODE,
    );

    assert.equal(
      result.authorizationContext
        .executionAuthorized,
      false,
    );
  },
);

test(
  "blocks a duplicate nonce through the shared durable store",
  async () => {
    const store =
      createFakeDurableStore();

    const first =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode:
            DURABLE_REPLAY_MODE,
          replayStore: store,
        },
      );

    const second =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode:
            DURABLE_REPLAY_MODE,
          replayStore: store,
        },
      );

    assert.equal(first.ok, true);
    assert.equal(second.ok, false);
    assert.equal(second.status, 409);

    assert.equal(
      second.error.errorCode,
      "SIGNED_ENVELOPE_REPLAY_BLOCKED",
    );
  },
);

test(
  "fails closed when the durable store fails",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode:
            DURABLE_REPLAY_MODE,
          replayStore: {
            async consumeNonce() {
              return {
                ok: false,
                consumed: false,
                errorCode:
                  "DURABLE_REPLAY_STORE_FAILURE",
              };
            },
          },
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "DURABLE_REPLAY_STORE_FAILURE",
    );
  },
);

test(
  "blocks production process-local replay mode",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode:
            "process-local-preview",
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "DURABLE_REPLAY_PROTECTION_REQUIRED",
    );
  },
);

test(
  "uses one atomic PostgreSQL insert with conflict rejection",
  async () => {
    const queries = [];

    const store =
      new PostgresProtectedApiReplayStore({
        pool: {
          async query(sql, values) {
            queries.push({
              sql,
              values,
            });

            return {
              rowCount: 1,
              rows: [
                {
                  nonce_hash:
                    "a".repeat(64),
                },
              ],
            };
          },
        },
      });

    const result =
      await store.consumeNonce({
        tenantId:
          "tenant-day-670",
        ownerId:
          "owner-day-670",
        nonce:
          "nonce-day-670-atomic-01",
        requestId:
          "request-day-670",
        pathname:
          "/api/nexus/test",
        bodySha256:
          "b".repeat(64),
        nowMs: NOW,
        expiresAtMs:
          NOW + 300000,
      });

    assert.equal(result.ok, true);
    assert.equal(result.consumed, true);
    assert.equal(queries.length, 1);

    assert.match(
      queries[0].sql,
      /ON CONFLICT/,
    );

    assert.match(
      queries[0].sql,
      /DO NOTHING/,
    );

    assert.equal(
      queries[0].values[0],
      "tenant-day-670",
    );

    assert.equal(
      queries[0].values[1],
      "owner-day-670",
    );

    assert.match(
      queries[0].values[2],
      /^[a-f0-9]{64}$/,
    );
  },
);

test(
  "treats a zero-row atomic insert as replay",
  async () => {
    const store =
      new PostgresProtectedApiReplayStore({
        pool: {
          async query() {
            return {
              rowCount: 0,
              rows: [],
            };
          },
        },
      });

    const result =
      await store.consumeNonce({
        tenantId:
          "tenant-day-670",
        ownerId:
          "owner-day-670",
        nonce:
          "nonce-day-670-replay-01",
        requestId:
          "request-day-670",
        pathname:
          "/api/nexus/test",
        bodySha256:
          "c".repeat(64),
        nowMs: NOW,
        expiresAtMs:
          NOW + 300000,
      });

    assert.equal(result.ok, true);
    assert.equal(
      result.consumed,
      false,
    );
  },
);

test(
  "migration defines tenant-owner-nonce primary-key uniqueness",
  () => {
    const migration =
      readFileSync(
        "db/migrations/0001_nexus_protected_api_nonce.sql",
        "utf8",
      );

    assert.match(
      migration,
      /PRIMARY KEY\s*\(\s*tenant_id,\s*owner_id,\s*nonce_hash\s*\)/s,
    );

    assert.match(
      migration,
      /expires_at TIMESTAMPTZ NOT NULL/,
    );
  },
);

test(
  "connects every protected POST route to the durable replay store",
  () => {
    for (const route of ROUTES) {
      const content =
        readFileSync(
          route,
          "utf8",
        );

      assert.match(
        content,
        /getProtectedApiReplayStore/,
        route,
      );

      assert.match(
        content,
        /replayStore:/,
        route,
      );

      assert.match(
        content,
        /NEXUS_PROTECTED_API_REPLAY_MODE/,
        route,
      );
    }
  },
);

test(
  "reports honest durable replay posture without claiming migration execution",
  () => {
    const posture =
      getProtectedApiReplayStorePosture();

    assert.equal(
      posture.mode,
      DURABLE_REPLAY_MODE,
    );

    assert.equal(
      posture.atomicControl,
      "POSTGRES_PRIMARY_KEY_AND_INSERT_ON_CONFLICT",
    );

    assert.equal(
      posture.rawNoncePersisted,
      false,
    );

    assert.equal(
      posture.distributedReplayProtection,
      true,
    );

    assert.equal(
      posture.liveMigrationPerformed,
      false,
    );

    assert.equal(
      posture.executionAuthorized,
      false,
    );
  },
);
