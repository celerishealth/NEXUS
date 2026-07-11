import {
  describe,
  expect,
  it,
} from "vitest"

import {
  createPostgresDurableProviderContainmentReader,
  type DurableProviderContainmentReader,
} from "../durableProviderContainmentReader"
import {
  createDurableProviderExecutionGuard,
} from "../durableProviderExecutionGuard"
import {
  InMemoryTestProviderContinuityStore,
} from "../inMemoryTestProviderContinuityStore"
import {
  createProviderContinuityProductionBootstrap,
} from "../providerContinuityProductionBootstrap"
import {
  PROVIDER_CONTINUITY_SCHEMA_VERSION,
} from "../providerContinuityProductionReadiness"
import type {
  ProviderContinuityDurableStore,
} from "../providerContinuityDurableStore"
import type {
  SupabaseRpcClientLike,
} from "../postgresProviderContinuityStore"

const createClock = (
  initial = 100,
) => {
  let now = initial

  return {
    now: () => now++,
    set: (value: number) => {
      now = value
    },
  }
}

const createEmptyReader =
  (): DurableProviderContainmentReader => ({
    async listActive() {
      return []
    },
  })

const executionInput = {
  tenantId: "tenant-a",
  providerDomain: "database" as const,
  operationId: "operation-one",
  leaseId: "lease-one",
  workerId: "worker-one",
  leaseTtlMs: 5_000,
  executionTimeoutMs: 500,
  safetyMarginMs: 500,
}

describe(
  "durable provider execution lease and TOCTOU guard",
  () => {
    it("holds the distributed lease while checking containment and executing", async () => {
      const clock = createClock()

      const store =
        new InMemoryTestProviderContinuityStore()

      let providerExecuted = false

      const reader:
        DurableProviderContainmentReader = {
          async listActive(
            tenantId,
            providerDomain,
          ) {
            const competingLease =
              await store.acquireLease({
                tenantId,
                providerDomain,
                leaseId:
                  "competing-lease",
                ownerId:
                  "competing-worker",
                ttlMs: 5_000,
                now: clock.now(),
              })

            expect(
              competingLease.acquired,
            ).toBe(false)

            return []
          },
        }

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader: reader,
          now: clock.now,
        })

      const result =
        await guard.execute(
          executionInput,
          async (context) => {
            providerExecuted = true

            expect(
              context.fenceToken,
            ).toBeGreaterThan(0)

            expect(
              context.idempotencyKey,
            ).toContain(
              "operation-one",
            )

            return "safe-result"
          },
        )

      expect(providerExecuted).toBe(true)

      expect(result).toMatchObject({
        outcome: "executed",
        code:
          "DURABLE_PROVIDER_EXECUTION_SUCCEEDED",
        value: "safe-result",
        leaseReleased: true,
      })
    })

    it("blocks callback while durable containment is active", async () => {
      const clock = createClock(200)

      const store =
        new InMemoryTestProviderContinuityStore()

      const reader:
        DurableProviderContainmentReader = {
          async listActive(
            tenantId,
            providerDomain,
          ) {
            return [
              {
                containmentId:
                  "containment-one",
                tenantId,
                providerDomain,
                status: "active",
                version: 2,
                updatedAt: 200,
                lastFenceToken: 4,
              },
            ]
          },
        }

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader: reader,
          now: clock.now,
        })

      let providerExecuted = false

      const result =
        await guard.execute(
          executionInput,
          async () => {
            providerExecuted = true
            return "unsafe-result"
          },
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "DURABLE_PROVIDER_DOMAIN_CONTAINED",
        leaseReleased: true,
      })

      expect(providerExecuted).toBe(false)
    })

    it("blocks a concurrent operation for the same tenant and domain", async () => {
      const clock = createClock(300)

      const store =
        new InMemoryTestProviderContinuityStore()

      const existing =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "database",
          leaseId: "existing-lease",
          ownerId: "existing-worker",
          ttlMs: 5_000,
          now: clock.now(),
        })

      expect(existing.acquired).toBe(true)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now: clock.now,
        })

      let providerExecuted = false

      const result =
        await guard.execute(
          executionInput,
          async () => {
            providerExecuted = true
            return "unsafe-result"
          },
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "CONTINUITY_LEASE_ALREADY_HELD",
        leaseReleased: null,
      })

      expect(providerExecuted).toBe(false)
    })

    it("releases the lease when containment preflight throws", async () => {
      const clock = createClock(400)

      const store =
        new InMemoryTestProviderContinuityStore()

      const failingReader:
        DurableProviderContainmentReader = {
          async listActive() {
            throw new Error(
              "controlled preflight failure",
            )
          },
        }

      const failingGuard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            failingReader,
          now: clock.now,
        })

      await expect(
        failingGuard.execute(
          executionInput,
          async () => "must-not-run",
        ),
      ).rejects.toThrow(
        "controlled preflight failure",
      )

      const safeGuard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now: clock.now,
        })

      const nextResult =
        await safeGuard.execute(
          {
            ...executionInput,
            leaseId: "next-lease",
          },
          async () => "recovered",
        )

      expect(nextResult).toMatchObject({
        outcome: "executed",
        value: "recovered",
      })
    })

    it("aborts timed-out execution and never authorizes automatic retry", async () => {
      const clock = createClock(500)

      const store =
        new InMemoryTestProviderContinuityStore()

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now: clock.now,
        })

      let signalAborted = false

      const result =
        await guard.execute(
          {
            ...executionInput,
            leaseTtlMs: 1_000,
            executionTimeoutMs: 20,
            safetyMarginMs: 100,
          },
          async ({ signal }) =>
            new Promise<string>(() => {
              signal.addEventListener(
                "abort",
                () => {
                  signalAborted = true
                },
              )
            }),
        )

      expect(result).toMatchObject({
        outcome: "failed",
        code:
          "PROVIDER_EXECUTION_TIMEOUT",
        automaticRetryAuthorized: false,
        leaseReleased: true,
      })

      expect(signalAborted).toBe(true)
    })

    it("blocks execution when preflight consumes the lease safety window", async () => {
      const clock = createClock(0)

      const store =
        new InMemoryTestProviderContinuityStore()

      const reader:
        DurableProviderContainmentReader = {
          async listActive() {
            clock.set(4_700)
            return []
          },
        }

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader: reader,
          now: clock.now,
        })

      let providerExecuted = false

      const result =
        await guard.execute(
          executionInput,
          async () => {
            providerExecuted = true
            return "unsafe-result"
          },
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "LEASE_SAFETY_WINDOW_EXHAUSTED",
        leaseReleased: true,
      })

      expect(providerExecuted).toBe(false)
    })

    it("requires lease TTL to exceed timeout plus safety margin", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
        })

      await expect(
        guard.execute(
          {
            ...executionInput,
            leaseTtlMs: 1_000,
            executionTimeoutMs: 700,
            safetyMarginMs: 300,
          },
          async () => "must-not-run",
        ),
      ).rejects.toThrow(
        "leaseTtlMs must exceed executionTimeoutMs plus safetyMarginMs",
      )
    })

    it("does not convert lease-release failure into a duplicate-retry instruction", async () => {
      const clock = createClock(700)

      const baseStore =
        new InMemoryTestProviderContinuityStore()

      const store:
        ProviderContinuityDurableStore = {
        storageKind:
          baseStore.storageKind,
        capabilities:
          baseStore.capabilities,
        read:
          baseStore.read.bind(baseStore),
        acquireLease:
          baseStore.acquireLease.bind(
            baseStore,
          ),
        compareAndSwap:
          baseStore.compareAndSwap.bind(
            baseStore,
          ),
        async releaseLease() {
          return false
        },
      }

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now: clock.now,
        })

      let executionCount = 0

      const result =
        await guard.execute(
          executionInput,
          async () => {
            executionCount += 1
            return "provider-success"
          },
        )

      expect(result).toMatchObject({
        outcome: "executed",
        value: "provider-success",
        leaseReleased: false,
      })

      expect(executionCount).toBe(1)
      expect(
        "automaticRetryAuthorized" in result,
      ).toBe(false)
    })

    it("keeps execution leases tenant-isolated", async () => {
      const clock = createClock(800)

      const store =
        new InMemoryTestProviderContinuityStore()

      const tenantALease =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "payments",
          leaseId: "tenant-a-lease",
          ownerId: "tenant-a-worker",
          ttlMs: 5_000,
          now: clock.now(),
        })

      expect(
        tenantALease.acquired,
      ).toBe(true)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now: clock.now,
        })

      const tenantBResult =
        await guard.execute(
          {
            ...executionInput,
            tenantId: "tenant-b",
            providerDomain: "payments",
            operationId:
              "tenant-b-operation",
            leaseId: "tenant-b-lease",
            workerId: "tenant-b-worker",
          },
          async () => "tenant-b-safe",
        )

      expect(tenantBResult).toMatchObject({
        outcome: "executed",
        value: "tenant-b-safe",
      })
    })

    it("adds the execution guard only after production credential and readiness gates pass", async () => {
      let now = 1_000

      const client:
        SupabaseRpcClientLike = {
          async rpc<T = unknown>(
            functionName: string,
            parameters?: Record<string, unknown>,
          ) {
            if (
              functionName ===
              "nexus_get_provider_continuity_store_readiness"
            ) {
              return {
                data: {
                  schemaVersion:
                    PROVIDER_CONTINUITY_SCHEMA_VERSION,
                  ready: true,
                  checks: {
                    tablesPresent: true,
                    requiredFunctionsPresent:
                      true,
                    rowLevelSecurityEnabled:
                      true,
                    forceRowLevelSecurityEnabled:
                      true,
                    serviceRoleOnlyExecution:
                      true,
                  },
                } as T,
                error: null,
              }
            }

            if (
              functionName ===
              "nexus_acquire_provider_continuity_lease"
            ) {
              return {
                data: {
                  acquired: true,
                  lease: {
                    leaseId:
                      "production-lease",
                    ownerId:
                      "production-worker",
                    tenantId:
                      "tenant-a",
                    providerDomain: "ai",
                    fenceToken: 11,
                    acquiredAt: 1_000,
                    expiresAt: 10_000,
                  },
                } as T,
                error: null,
              }
            }

            if (
              functionName ===
              "nexus_list_active_provider_containments"
            ) {
              return {
                data: [] as T,
                error: null,
              }
            }

            if (
              functionName ===
              "nexus_release_provider_continuity_lease"
            ) {
              return {
                data: true as T,
                error: null,
              }
            }

            if (
              functionName ===
              "nexus_compare_and_swap_provider_continuity_record"
            ) {
              if (
                !parameters ||
                Array.isArray(parameters)
              ) {
                return {
                  data: null as T | null,
                  error: null,
                }
              }

              const params =
                parameters as Record<string, unknown>

              if (
                typeof params.p_tenant_id !==
                  "string" ||
                typeof params.p_provider_domain !==
                  "string" ||
                typeof params.p_record_kind !==
                  "string" ||
                typeof params.p_record_id !==
                  "string" ||
                typeof params.p_lease_id !==
                  "string" ||
                typeof params.p_owner_id !==
                  "string" ||
                typeof params.p_fence_token !==
                  "number" ||
                typeof params.p_now !== "string" ||
                !(
                  typeof params.p_expected_version ===
                    "number" ||
                  params.p_expected_version === null
                )
              ) {
                return {
                  data: null as T | null,
                  error: null,
                }
              }

              const recordVersion =
                params.p_expected_version === null
                  ? 1
                  : params.p_expected_version + 1

              return {
                data: {
                  applied: true,
                  record: {
                    tenantId: params.p_tenant_id,
                    providerDomain:
                      params.p_provider_domain,
                    kind: params.p_record_kind,
                    recordId: params.p_record_id,
                    version: recordVersion,
                    payload: params.p_payload,
                    updatedAt: Date.parse(
                      params.p_now,
                    ),
                    lastFenceToken:
                      params.p_fence_token,
                  },
                } as T,
                error: null,
              }
            }

            return {
              data: null as T | null,
              error: null,
            }
          },
        }

      const serviceRoleKey =
        "service-role-secret-key-for-tests-123456789"

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
            now: () => now++,
          },
        )

      const result =
        await bootstrap.executionGuard.execute(
          {
            tenantId: "tenant-a",
            providerDomain: "ai",
            operationId:
              "production-ai-operation",
            leaseId:
              "production-lease",
            workerId:
              "production-worker",
            leaseTtlMs: 9_000,
            executionTimeoutMs: 500,
            safetyMarginMs: 500,
          },
          async (context) => ({
            result: "production-safe",
            fenceToken:
              context.fenceToken,
          }),
        )

      expect(result).toMatchObject({
        outcome: "executed",
        value: {
          result: "production-safe",
          fenceToken: 11,
        },
        leaseReleased: true,
      })

      expect(
        Object.keys(bootstrap),
      ).not.toContain("client")

      expect(
        JSON.stringify(bootstrap),
      ).not.toContain(serviceRoleKey)
    })
  },
)
