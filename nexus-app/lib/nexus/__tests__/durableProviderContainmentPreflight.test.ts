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
  DurableContainmentReadError,
  createPostgresDurableProviderContainmentReader,
} from "../durableProviderContainmentReader"
import {
  executeWithDurableContainmentPreflight,
} from "../durableProviderContainmentPreflight"
import {
  createProviderContinuityProductionBootstrap,
} from "../providerContinuityProductionBootstrap"
import {
  PROVIDER_CONTINUITY_SCHEMA_VERSION,
} from "../providerContinuityProductionReadiness"
import type {
  SupabaseRpcClientLike,
} from "../postgresProviderContinuityStore"

const serviceRoleKey =
  "service-role-secret-key-for-tests-123456789"

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
  handler: (
    functionName: string,
    parameters:
      | Record<string, unknown>
      | undefined,
  ) => unknown,
): SupabaseRpcClientLike => ({
  async rpc<T = unknown>(
    functionName: string,
    parameters?: Record<string, unknown>,
  ) {
    return {
      data: handler(
        functionName,
        parameters,
      ) as T,
      error: null,
    }
  },
})

describe(
  "durable provider containment preflight",
  () => {
    it("blocks provider execution when durable containment is active", async () => {
      const reader =
        createPostgresDurableProviderContainmentReader(
          createClient(() => [
            {
              containmentId:
                "containment-one",
              tenantId: "tenant-a",
              providerDomain: "database",
              status: "active",
              version: 3,
              updatedAt: 1_000,
              lastFenceToken: 8,
            },
          ]),
        )

      let operationExecuted = false

      const result =
        await executeWithDurableContainmentPreflight(
          reader,
          {
            tenantId: "tenant-a",
            providerDomain: "database",
          },
          async () => {
            operationExecuted = true
            return "unsafe-result"
          },
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        decision: {
          allowed: false,
          code:
            "DURABLE_PROVIDER_DOMAIN_CONTAINED",
          tenantId: "tenant-a",
          providerDomain: "database",
          activeContainments: [
            {
              containmentId:
                "containment-one",
              status: "active",
            },
          ],
        },
        value: null,
      })

      expect(operationExecuted).toBe(false)
    })

    it("executes only when no active durable containment exists", async () => {
      const reader =
        createPostgresDurableProviderContainmentReader(
          createClient(() => []),
        )

      let operationExecuted = false

      const result =
        await executeWithDurableContainmentPreflight(
          reader,
          {
            tenantId: "tenant-a",
            providerDomain: "ai",
          },
          async () => {
            operationExecuted = true
            return "safe-result"
          },
        )

      expect(operationExecuted).toBe(true)

      expect(result).toEqual({
        outcome: "executed",
        decision: {
          allowed: true,
          code:
            "DURABLE_PROVIDER_DOMAIN_ALLOWED",
          tenantId: "tenant-a",
          providerDomain: "ai",
          activeContainments: [],
        },
        value: "safe-result",
      })
    })

    it("fails closed before execution when the containment RPC fails", async () => {
      const client:
        SupabaseRpcClientLike = {
          async rpc<T = unknown>() {
            return {
              data: null as T | null,
              error: {
                message:
                  "database unavailable",
              },
            }
          },
        }

      const reader =
        createPostgresDurableProviderContainmentReader(
          client,
        )

      let operationExecuted = false

      await expect(
        executeWithDurableContainmentPreflight(
          reader,
          {
            tenantId: "tenant-a",
            providerDomain: "payments",
          },
          async () => {
            operationExecuted = true
            return "unsafe-result"
          },
        ),
      ).rejects.toEqual(
        new DurableContainmentReadError(
          "ACTIVE_CONTAINMENT_RPC_FAILED",
          "active provider containment RPC failed: database unavailable",
        ),
      )

      expect(operationExecuted).toBe(false)
    })

    it("fails closed on malformed containment records", async () => {
      const reader =
        createPostgresDurableProviderContainmentReader(
          createClient(() => [
            {
              containmentId:
                "containment-one",
              tenantId: "tenant-a",
              providerDomain: "database",
              status: "active",
              version: 0,
              updatedAt: 1_000,
              lastFenceToken: 8,
            },
          ]),
        )

      let operationExecuted = false

      await expect(
        executeWithDurableContainmentPreflight(
          reader,
          {
            tenantId: "tenant-a",
            providerDomain: "database",
          },
          async () => {
            operationExecuted = true
            return "unsafe-result"
          },
        ),
      ).rejects.toMatchObject({
        code:
          "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
      })

      expect(operationExecuted).toBe(false)
    })

    it("blocks cross-tenant or cross-domain RPC data", async () => {
      const reader =
        createPostgresDurableProviderContainmentReader(
          createClient(() => [
            {
              containmentId:
                "private-containment",
              tenantId: "tenant-b",
              providerDomain: "database",
              status: "active",
              version: 1,
              updatedAt: 2_000,
              lastFenceToken: 4,
            },
          ]),
        )

      await expect(
        reader.listActive(
          "tenant-a",
          "database",
        ),
      ).rejects.toEqual(
        new DurableContainmentReadError(
          "ACTIVE_CONTAINMENT_SCOPE_MISMATCH",
          "active provider containment response crossed its requested tenant or provider-domain scope",
        ),
      )
    })

    it("passes exact tenant and provider-domain scope to the RPC", async () => {
      const calls: Array<{
        functionName: string
        parameters:
          | Record<string, unknown>
          | undefined
      }> = []

      const reader =
        createPostgresDurableProviderContainmentReader(
          createClient(
            (
              functionName,
              parameters,
            ) => {
              calls.push({
                functionName,
                parameters,
              })

              return []
            },
          ),
        )

      await reader.listActive(
        "tenant-a",
        "messaging",
      )

      expect(calls).toEqual([
        {
          functionName:
            "nexus_list_active_provider_containments",
          parameters: {
            p_tenant_id: "tenant-a",
            p_provider_domain:
              "messaging",
          },
        },
      ])
    })

    it("adds the durable reader only after the production readiness gate passes", async () => {
      const client = createClient(
        (functionName) => {
          if (
            functionName ===
            "nexus_get_provider_continuity_store_readiness"
          ) {
            return readyResponse
          }

          if (
            functionName ===
            "nexus_list_active_provider_containments"
          ) {
            return []
          }

          return null
        },
      )

      const bootstrap =
        await createProviderContinuityProductionBootstrap(
          {
            credentials: {
              nodeEnvironment:
                "production",
              runtime: "nodejs",
              supabaseUrl:
                "https://nexus-example.supabase.co",
              serviceRoleKey,
              anonKey:
                "anon-public-test-key-987654321",
              serviceRoleEnvironmentName:
                "SUPABASE_SERVICE_ROLE_KEY",
            },
            clientFactory: () => client,
          },
        )

      expect(
        typeof bootstrap.containmentReader
          .listActive,
      ).toBe("function")

      expect(
        Object.keys(bootstrap),
      ).not.toContain("client")

      expect(
        JSON.stringify(bootstrap),
      ).not.toContain(serviceRoleKey)
    })

    it("updates readiness to schema v2 and keeps the new RPC service-role-only", () => {
      expect(
        PROVIDER_CONTINUITY_SCHEMA_VERSION,
      ).toBe(
        "provider-continuity-durable-store-v2",
      )

      const migration = readFileSync(
        resolve(
          process.cwd(),
          "supabase/migrations/20260710065400_durable_containment_preflight_v1.sql",
        ),
        "utf8",
      )

      expect(migration).toContain(
        "nexus_list_active_provider_containments",
      )

      expect(migration).toContain(
        "payload ->> 'status' = 'active'",
      )

      expect(migration).toContain(
        "from public, anon, authenticated",
      )

      expect(migration).toContain(
        "to service_role",
      )

      expect(migration).toContain(
        "provider-continuity-durable-store-v2",
      )

      expect(migration).toContain(
        "has_function_privilege",
      )
    })
  },
)
