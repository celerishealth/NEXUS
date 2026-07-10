import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  TENANT_AUTHORIZATION_MODE,
  PostgresProtectedApiTenantAuthorizationStore,
  getProtectedApiTenantAuthorizationPosture,
} from "../lib/nexus/protectedApiTenantAuthorizationStore.mjs";

import {
  authorizeProtectedApiTenantOwnerContext,
  getProtectedApiTenantAuthorizationGuardPosture,
} from "../lib/nexus/protectedApiTenantAuthorizationGuard.mjs";

const ROUTES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
];

function createAuthorizationContext(
  overrides = {},
) {
  return {
    schemaVersion:
      "nexus.protected-api-authorization-context.v1",
    tenantId:
      "tenant-day-671",
    ownerId:
      "owner-day-671",
    signatureVerified: true,
    timestampVerified: true,
    bodyIntegrityVerified: true,
    durableReplayPersistenceVerified:
      true,
    executionAuthorized: false,
    ...overrides,
  };
}

function createActiveStore() {
  return {
    async authorizeOwner({
      tenantId,
      ownerId,
    }) {
      return {
        ok: true,
        allowed: true,
        membership: {
          tenantId,
          ownerId,
          role: "OWNER",
          authorityEpoch:
            "authority-epoch-day-671",
        },
      };
    },
  };
}

test(
  "authorizes a signed identity with an active matching durable membership",
  async () => {
    const result =
      await authorizeProtectedApiTenantOwnerContext(
        createAuthorizationContext(),
        {
          requestId:
            "request-day-671",
          mode:
            TENANT_AUTHORIZATION_MODE,
          store:
            createActiveStore(),
          isProduction: true,
        },
      );

    assert.equal(result.ok, true);

    assert.equal(
      result.tenantAuthorizationContext
        .tenantId,
      "tenant-day-671",
    );

    assert.equal(
      result.tenantAuthorizationContext
        .ownerId,
      "owner-day-671",
    );

    assert.equal(
      result.tenantAuthorizationContext
        .role,
      "OWNER",
    );

    assert.equal(
      result.tenantAuthorizationContext
        .crossTenantAccessAllowed,
      false,
    );

    assert.equal(
      result.tenantAuthorizationContext
        .executionAuthorized,
      false,
    );
  },
);

test(
  "blocks an owner without active tenant membership",
  async () => {
    const result =
      await authorizeProtectedApiTenantOwnerContext(
        createAuthorizationContext(),
        {
          mode:
            TENANT_AUTHORIZATION_MODE,
          store: {
            async authorizeOwner() {
              return {
                ok: true,
                allowed: false,
                reasonCode:
                  "TENANT_OWNER_MEMBERSHIP_NOT_FOUND",
              };
            },
          },
          isProduction: true,
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 403);

    assert.equal(
      result.error.errorCode,
      "TENANT_OWNER_ACCESS_DENIED",
    );
  },
);

test(
  "blocks cross-tenant membership substitution",
  async () => {
    const result =
      await authorizeProtectedApiTenantOwnerContext(
        createAuthorizationContext(),
        {
          mode:
            TENANT_AUTHORIZATION_MODE,
          store: {
            async authorizeOwner() {
              return {
                ok: true,
                allowed: true,
                membership: {
                  tenantId:
                    "tenant-foreign-671",
                  ownerId:
                    "owner-day-671",
                  role: "OWNER",
                  authorityEpoch:
                    "epoch-foreign-671",
                },
              };
            },
          },
          isProduction: true,
        },
      );

    assert.equal(result.ok, false);

    assert.equal(
      result.error.errorCode,
      "TENANT_MEMBERSHIP_BINDING_INVALID",
    );
  },
);

test(
  "blocks production authorization without durable replay verification",
  async () => {
    const result =
      await authorizeProtectedApiTenantOwnerContext(
        createAuthorizationContext({
          durableReplayPersistenceVerified:
            false,
        }),
        {
          mode:
            TENANT_AUTHORIZATION_MODE,
          store:
            createActiveStore(),
          isProduction: true,
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "DURABLE_REPLAY_VERIFICATION_REQUIRED",
    );
  },
);

test(
  "fails closed when tenant authorization mode is absent",
  async () => {
    const result =
      await authorizeProtectedApiTenantOwnerContext(
        createAuthorizationContext(),
        {
          mode: "",
          store:
            createActiveStore(),
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);

    assert.equal(
      result.error.errorCode,
      "TENANT_AUTHORIZATION_REQUIRED",
    );
  },
);

test(
  "fails closed when the durable authorization store fails",
  async () => {
    const result =
      await authorizeProtectedApiTenantOwnerContext(
        createAuthorizationContext(),
        {
          mode:
            TENANT_AUTHORIZATION_MODE,
          store: {
            async authorizeOwner() {
              return {
                ok: false,
                allowed: false,
                errorCode:
                  "TENANT_AUTHORIZATION_STORE_FAILURE",
              };
            },
          },
          isProduction: true,
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "TENANT_AUTHORIZATION_STORE_FAILURE",
    );
  },
);

test(
  "PostgreSQL store verifies tenant owner and membership status together",
  async () => {
    const queries = [];

    const store =
      new PostgresProtectedApiTenantAuthorizationStore({
        pool: {
          async query(sql, values) {
            queries.push({
              sql,
              values,
            });

            return {
              rows: [
                {
                  tenant_id:
                    "tenant-day-671",
                  tenant_status:
                    "ACTIVE",
                  owner_id:
                    "owner-day-671",
                  owner_status:
                    "ACTIVE",
                  role:
                    "OWNER",
                  membership_status:
                    "ACTIVE",
                  authority_epoch:
                    "authority-epoch-day-671",
                },
              ],
            };
          },
        },
      });

    const result =
      await store.authorizeOwner({
        tenantId:
          "tenant-day-671",
        ownerId:
          "owner-day-671",
      });

    assert.equal(result.ok, true);
    assert.equal(result.allowed, true);
    assert.equal(queries.length, 1);

    assert.match(
      queries[0].sql,
      /nexus_tenant_owner_membership/,
    );

    assert.match(
      queries[0].sql,
      /nexus_tenant/,
    );

    assert.match(
      queries[0].sql,
      /nexus_owner_identity/,
    );

    assert.equal(
      queries[0].values[0],
      "tenant-day-671",
    );

    assert.equal(
      queries[0].values[1],
      "owner-day-671",
    );
  },
);

test(
  "PostgreSQL store denies suspended tenant or membership state",
  async () => {
    const store =
      new PostgresProtectedApiTenantAuthorizationStore({
        pool: {
          async query() {
            return {
              rows: [
                {
                  tenant_id:
                    "tenant-day-671",
                  tenant_status:
                    "SUSPENDED",
                  owner_id:
                    "owner-day-671",
                  owner_status:
                    "ACTIVE",
                  role:
                    "OWNER",
                  membership_status:
                    "ACTIVE",
                  authority_epoch:
                    "authority-epoch-day-671",
                },
              ],
            };
          },
        },
      });

    const result =
      await store.authorizeOwner({
        tenantId:
          "tenant-day-671",
        ownerId:
          "owner-day-671",
      });

    assert.equal(result.ok, true);
    assert.equal(result.allowed, false);

    assert.equal(
      result.reasonCode,
      "TENANT_OWNER_MEMBERSHIP_INACTIVE",
    );
  },
);

test(
  "migration creates tenant owner and composite membership boundaries",
  () => {
    const migration =
      readFileSync(
        "db/migrations/0002_nexus_tenant_owner_membership.sql",
        "utf8",
      );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_tenant/,
    );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_owner_identity/,
    );

    assert.match(
      migration,
      /CREATE TABLE IF NOT EXISTS nexus_tenant_owner_membership/,
    );

    assert.match(
      migration,
      /PRIMARY KEY\s*\(\s*tenant_id,\s*owner_id\s*\)/s,
    );

    assert.match(
      migration,
      /FOREIGN KEY \(tenant_id\)/,
    );

    assert.match(
      migration,
      /FOREIGN KEY \(owner_id\)/,
    );
  },
);

test(
  "connects every protected POST route to durable tenant authorization",
  () => {
    for (const route of ROUTES) {
      const content =
        readFileSync(
          route,
          "utf8",
        );

      assert.match(
        content,
        /authorizeProtectedApiTenantOwnerContext/,
        route,
      );

      assert.match(
        content,
        /getProtectedApiTenantAuthorizationStore/,
        route,
      );

      assert.match(
        content,
        /NEXUS_TENANT_AUTHORIZATION_MODE/,
        route,
      );

      assert.match(
        content,
        /const tenantAuthorizationGuard/,
        route,
      );
    }
  },
);

test(
  "reports honest tenant authorization posture without claiming migration execution",
  () => {
    const storePosture =
      getProtectedApiTenantAuthorizationPosture();

    const guardPosture =
      getProtectedApiTenantAuthorizationGuardPosture();

    assert.equal(
      storePosture.mode,
      TENANT_AUTHORIZATION_MODE,
    );

    assert.equal(
      storePosture.crossTenantAccessAllowed,
      false,
    );

    assert.equal(
      storePosture.liveMigrationPerformed,
      false,
    );

    assert.equal(
      storePosture.executionAuthorized,
      false,
    );

    assert.equal(
      guardPosture.executionAuthorized,
      false,
    );

    assert.ok(
      guardPosture.controls.includes(
        "CROSS_TENANT_ACCESS_DENIED",
      ),
    );
  },
);
