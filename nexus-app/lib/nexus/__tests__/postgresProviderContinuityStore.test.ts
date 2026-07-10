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
  createPostgresProviderContinuityStore,
  ProviderContinuityStoreRpcError,
  type SupabaseRpcClientLike,
} from "../postgresProviderContinuityStore"
import {
  assertProductionDurableContinuityStore,
} from "../providerContinuityDurableStore"

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
  "Postgres provider continuity store",
  () => {
    it("advertises every required production safety capability", () => {
      const store =
        createPostgresProviderContinuityStore(
          createClient(() => null),
        )

      expect(
        assertProductionDurableContinuityStore(
          store,
        ),
      ).toBe(store)

      expect(store.capabilities).toEqual({
        durableAcrossRestarts: true,
        atomicCompareAndSwap: true,
        monotonicFencingTokens: true,
        tenantIsolation: true,
      })
    })

    it("reads a tenant-scoped durable record through RPC", async () => {
      const calls: Array<{
        functionName: string
        parameters:
          | Record<string, unknown>
          | undefined
      }> = []

      const store =
        createPostgresProviderContinuityStore(
          createClient(
            (
              functionName,
              parameters,
            ) => {
              calls.push({
                functionName,
                parameters,
              })

              return {
                tenantId: "tenant-a",
                providerDomain: "database",
                kind: "incident",
                recordId: "incident-one",
                version: 3,
                payload: {
                  status: "open",
                },
                updatedAt: 1_000,
                lastFenceToken: 7,
              }
            },
          ),
        )

      const record = await store.read({
        tenantId: "tenant-a",
        providerDomain: "database",
        kind: "incident",
        recordId: "incident-one",
      })

      expect(record).toEqual({
        tenantId: "tenant-a",
        providerDomain: "database",
        kind: "incident",
        recordId: "incident-one",
        version: 3,
        payload: {
          status: "open",
        },
        updatedAt: 1_000,
        lastFenceToken: 7,
      })

      expect(calls).toEqual([
        {
          functionName:
            "nexus_read_provider_continuity_record",
          parameters: {
            p_tenant_id: "tenant-a",
            p_provider_domain:
              "database",
            p_record_kind: "incident",
            p_record_id:
              "incident-one",
          },
        },
      ])
    })

    it("maps atomic lease acquisition and release", async () => {
      const calls: string[] = []

      const store =
        createPostgresProviderContinuityStore(
          createClient(
            (
              functionName,
            ) => {
              calls.push(functionName)

              if (
                functionName ===
                "nexus_acquire_provider_continuity_lease"
              ) {
                return {
                  acquired: true,
                  lease: {
                    leaseId: "lease-one",
                    ownerId: "worker-one",
                    tenantId: "tenant-a",
                    providerDomain:
                      "payments",
                    fenceToken: 9,
                    acquiredAt: 2_000,
                    expiresAt: 7_000,
                  },
                }
              }

              if (
                functionName ===
                "nexus_release_provider_continuity_lease"
              ) {
                return true
              }

              return null
            },
          ),
        )

      const acquired =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "payments",
          leaseId: "lease-one",
          ownerId: "worker-one",
          ttlMs: 5_000,
          now: 2_000,
        })

      expect(acquired).toEqual({
        acquired: true,
        lease: {
          leaseId: "lease-one",
          ownerId: "worker-one",
          tenantId: "tenant-a",
          providerDomain: "payments",
          fenceToken: 9,
          acquiredAt: 2_000,
          expiresAt: 7_000,
        },
      })

      if (!acquired.acquired) {
        throw new Error(
          "expected lease acquisition",
        )
      }

      const released =
        await store.releaseLease({
          lease: acquired.lease,
          now: 3_000,
        })

      expect(released).toBe(true)

      expect(calls).toEqual([
        "nexus_acquire_provider_continuity_lease",
        "nexus_release_provider_continuity_lease",
      ])
    })

    it("maps compare-and-swap conflicts without unsafe retry", async () => {
      const store =
        createPostgresProviderContinuityStore(
          createClient(() => ({
            applied: false,
            code: "VERSION_CONFLICT",
            currentRecord: {
              tenantId: "tenant-a",
              providerDomain: "ai",
              kind: "recovery",
              recordId: "recovery-one",
              version: 4,
              payload: {
                status: "approved",
              },
              updatedAt: 4_000,
              lastFenceToken: 12,
            },
          })),
        )

      const result =
        await store.compareAndSwap({
          scope: {
            tenantId: "tenant-a",
            providerDomain: "ai",
            kind: "recovery",
            recordId: "recovery-one",
          },
          expectedVersion: 3,
          payload: {
            status:
              "replay-authorized",
          },
          lease: {
            leaseId: "lease-ai",
            ownerId: "worker-ai",
            tenantId: "tenant-a",
            providerDomain: "ai",
            fenceToken: 12,
            acquiredAt: 3_000,
            expiresAt: 8_000,
          },
          now: 4_000,
        })

      expect(result).toEqual({
        applied: false,
        code: "VERSION_CONFLICT",
        currentRecord: {
          tenantId: "tenant-a",
          providerDomain: "ai",
          kind: "recovery",
          recordId: "recovery-one",
          version: 4,
          payload: {
            status: "approved",
          },
          updatedAt: 4_000,
          lastFenceToken: 12,
        },
      })
    })

    it("fails closed when the database RPC reports an error", async () => {
      const client:
        SupabaseRpcClientLike = {
          async rpc<T = unknown>() {
            return {
              data: null as T | null,
              error: {
                message:
                  "database transaction failed",
              },
            }
          },
        }

      const store =
        createPostgresProviderContinuityStore(
          client,
        )

      await expect(
        store.read({
          tenantId: "tenant-a",
          providerDomain: "database",
          kind: "containment",
          recordId: "containment-one",
        }),
      ).rejects.toEqual(
        new ProviderContinuityStoreRpcError(
          "nexus_read_provider_continuity_record",
          "database transaction failed",
        ),
      )
    })

    it("rejects malformed RPC responses", async () => {
      const store =
        createPostgresProviderContinuityStore(
          createClient(() => ({
            acquired: true,
            lease: {
              leaseId: "",
            },
          })),
        )

      await expect(
        store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "messaging",
          leaseId: "lease-one",
          ownerId: "worker-one",
          ttlMs: 5_000,
          now: 5_000,
        }),
      ).rejects.toThrow(
        "invalid provider continuity RPC field: leaseId",
      )
    })

    it("keeps migration access service-role-only and concurrency-safe", () => {
      const migration = readFileSync(
        resolve(
          process.cwd(),
          "supabase/migrations/20260710065000_provider_continuity_durable_store_v1.sql",
        ),
        "utf8",
      )

      expect(migration).toContain(
        "enable row level security",
      )

      expect(migration).toContain(
        "force row level security",
      )

      expect(migration).toContain(
        "from public, anon, authenticated",
      )

      expect(migration).toContain(
        "to service_role",
      )

      expect(migration).toContain(
        "for update",
      )

      expect(migration).toContain(
        "latest_fence_token",
      )

      expect(migration).toContain(
        "STALE_FENCE_TOKEN",
      )

      expect(migration).toContain(
        "VERSION_CONFLICT",
      )

      expect(migration).toContain(
        "LEASE_INVALID",
      )
    })
  },
)
