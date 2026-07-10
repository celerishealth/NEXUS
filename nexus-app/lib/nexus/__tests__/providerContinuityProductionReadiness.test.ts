import {
  readFileSync,
} from "node:fs"
import {
  resolve,
} from "node:path"

import {
  describe,
  expect,
  it,
} from "vitest"

import {
  createReadyPostgresProviderContinuityStore,
  probeProviderContinuityProductionReadiness,
  PROVIDER_CONTINUITY_SCHEMA_VERSION,
  ProviderContinuityProductionReadinessError,
  withReadyProviderContinuityStore,
} from "../providerContinuityProductionReadiness"
import type {
  SupabaseRpcClientLike,
} from "../postgresProviderContinuityStore"

const readyResponse = {
  schemaVersion:
    PROVIDER_CONTINUITY_SCHEMA_VERSION,
  ready: true,
  checks: {
    tablesPresent: true,
    requiredFunctionsPresent: true,
    rowLevelSecurityEnabled: true,
    forceRowLevelSecurityEnabled: true,
    serviceRoleOnlyExecution: true,
  },
}

const createClient = (
  data: unknown,
): SupabaseRpcClientLike => ({
  async rpc<T = unknown>() {
    return {
      data: data as T,
      error: null,
    }
  },
})

describe(
  "provider continuity production readiness gate",
  () => {
    it("accepts an exact production-safe schema handshake", async () => {
      const readiness =
        await probeProviderContinuityProductionReadiness(
          createClient(readyResponse),
        )

      expect(readiness).toEqual(
        readyResponse,
      )
    })

    it("creates the Postgres store only after readiness passes", async () => {
      const bootstrap =
        await createReadyPostgresProviderContinuityStore(
          createClient(readyResponse),
        )

      expect(
        bootstrap.readiness.ready,
      ).toBe(true)

      expect(
        bootstrap.store.storageKind,
      ).toBe("postgres-supabase-rpc")

      expect(
        bootstrap.store.capabilities,
      ).toEqual({
        durableAcrossRestarts: true,
        atomicCompareAndSwap: true,
        monotonicFencingTokens: true,
        tenantIsolation: true,
      })
    })

    it("blocks a mismatched database schema version", async () => {
      await expect(
        probeProviderContinuityProductionReadiness(
          createClient({
            ...readyResponse,
            schemaVersion:
              "provider-continuity-legacy-v0",
          }),
        ),
      ).rejects.toMatchObject({
        code: "SCHEMA_VERSION_MISMATCH",
      })
    })

    it("blocks production when a required function is missing", async () => {
      await expect(
        probeProviderContinuityProductionReadiness(
          createClient({
            ...readyResponse,
            ready: false,
            checks: {
              ...readyResponse.checks,
              requiredFunctionsPresent:
                false,
            },
          }),
        ),
      ).rejects.toEqual(
        new ProviderContinuityProductionReadinessError(
          "CONTINUITY_SCHEMA_NOT_READY",
          "provider continuity schema is not production-ready; failed checks: requiredFunctionsPresent",
          ["requiredFunctionsPresent"],
        ),
      )
    })

    it("blocks production when RLS safety is incomplete", async () => {
      await expect(
        probeProviderContinuityProductionReadiness(
          createClient({
            ...readyResponse,
            ready: false,
            checks: {
              ...readyResponse.checks,
              rowLevelSecurityEnabled:
                false,
              forceRowLevelSecurityEnabled:
                false,
            },
          }),
        ),
      ).rejects.toMatchObject({
        code:
          "CONTINUITY_SCHEMA_NOT_READY",
        failedChecks: [
          "rowLevelSecurityEnabled",
          "forceRowLevelSecurityEnabled",
        ],
      })
    })

    it("blocks production when execution permissions are unsafe", async () => {
      await expect(
        probeProviderContinuityProductionReadiness(
          createClient({
            ...readyResponse,
            ready: false,
            checks: {
              ...readyResponse.checks,
              serviceRoleOnlyExecution:
                false,
            },
          }),
        ),
      ).rejects.toMatchObject({
        code:
          "CONTINUITY_SCHEMA_NOT_READY",
        failedChecks: [
          "serviceRoleOnlyExecution",
        ],
      })
    })

    it("fails closed when the readiness RPC is unavailable", async () => {
      const client:
        SupabaseRpcClientLike = {
          async rpc<T = unknown>() {
            return {
              data: null as T | null,
              error: {
                message:
                  "function does not exist",
              },
            }
          },
        }

      await expect(
        probeProviderContinuityProductionReadiness(
          client,
        ),
      ).rejects.toMatchObject({
        code: "READINESS_RPC_FAILED",
      })
    })

    it("rejects malformed readiness responses", async () => {
      await expect(
        probeProviderContinuityProductionReadiness(
          createClient({
            schemaVersion:
              PROVIDER_CONTINUITY_SCHEMA_VERSION,
            ready: "yes",
            checks: {},
          }),
        ),
      ).rejects.toMatchObject({
        code:
          "MALFORMED_READINESS_RESPONSE",
      })
    })

    it("never executes the protected operation when readiness fails", async () => {
      let operationExecuted = false

      await expect(
        withReadyProviderContinuityStore(
          createClient({
            ...readyResponse,
            ready: false,
            checks: {
              ...readyResponse.checks,
              tablesPresent: false,
            },
          }),
          async () => {
            operationExecuted = true
            return "unsafe-result"
          },
        ),
      ).rejects.toMatchObject({
        code:
          "CONTINUITY_SCHEMA_NOT_READY",
      })

      expect(operationExecuted).toBe(false)
    })

    it("executes the protected operation only after readiness passes", async () => {
      let operationExecuted = false

      const result =
        await withReadyProviderContinuityStore(
          createClient(readyResponse),
          async ({ store, readiness }) => {
            operationExecuted = true

            return {
              storageKind:
                store.storageKind,
              schemaVersion:
                readiness.schemaVersion,
            }
          },
        )

      expect(operationExecuted).toBe(true)

      expect(result).toEqual({
        storageKind:
          "postgres-supabase-rpc",
        schemaVersion:
          PROVIDER_CONTINUITY_SCHEMA_VERSION,
      })
    })

    it("keeps the readiness migration read-only and service-role-only", () => {
      const migration = readFileSync(
        resolve(
          process.cwd(),
          "supabase/migrations/20260710065200_provider_continuity_schema_readiness_v1.sql",
        ),
        "utf8",
      )

      expect(migration).toContain(
        "to_regclass",
      )

      expect(migration).toContain(
        "to_regprocedure",
      )

      expect(migration).toContain(
        "relrowsecurity",
      )

      expect(migration).toContain(
        "relforcerowsecurity",
      )

      expect(migration).toContain(
        "has_function_privilege",
      )

      expect(migration).toContain(
        "from public, anon, authenticated",
      )

      expect(migration).toContain(
        "to service_role",
      )

      expect(migration).not.toContain(
        "insert into public.nexus_provider_continuity_records",
      )

      expect(migration).not.toContain(
        "delete from public.nexus_provider_continuity_records",
      )
    })
  },
)
