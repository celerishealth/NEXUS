import {
  describe,
  expect,
  it,
} from "vitest"

import type {
  DurableProviderContainmentReader,
} from "../durableProviderContainmentReader"
import {
  createDurableProviderExecutionGuard,
} from "../durableProviderExecutionGuard"
import {
  InMemoryTestProviderContinuityStore,
} from "../inMemoryTestProviderContinuityStore"
import type {
  CompareAndSwapProviderContinuityInput,
  CompareAndSwapProviderContinuityResult,
  ProviderContinuityDurableStore,
  ProviderContinuityJsonValue,
} from "../providerContinuityDurableStore"

const createClock = (
  initial = 100,
) => {
  let now = initial

  return () => now++
}

const createEmptyReader =
  (): DurableProviderContainmentReader => ({
    async listActive() {
      return []
    },
  })

const executionInput = {
  tenantId: "tenant-a",
  providerDomain: "payments" as const,
  operationId: "operation-one",
  leaseId: "lease-one",
  workerId: "worker-one",
  leaseTtlMs: 5_000,
  executionTimeoutMs: 500,
  safetyMarginMs: 500,
}

describe(
  "durable provider execution receipt and crash duplicate guard",
  () => {
    it("creates an in-flight claim before execution and completes it after success", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock()

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      let inFlightSeen = false

      const result =
        await guard.execute(
          executionInput,
          async (context) => {
            const receipt =
              await store.read({
                tenantId:
                  context.tenantId,
                providerDomain:
                  context.providerDomain,
                kind:
                  "replay-idempotency",
                recordId:
                  context.idempotencyKey,
              })

            inFlightSeen = Boolean(
              receipt?.payload &&
              typeof receipt.payload ===
                "object" &&
              !Array.isArray(
                receipt.payload,
              ) &&
              receipt.payload.status ===
                "in-flight",
            )

            return "payment-success"
          },
        )

      expect(inFlightSeen).toBe(true)

      expect(result).toMatchObject({
        outcome: "executed",
        value: "payment-success",
        receiptVersion: 2,
        leaseReleased: true,
      })

      if (result.outcome !== "executed") {
        throw new Error(
          "expected successful execution",
        )
      }

      const completedReceipt =
        await store.read({
          tenantId: "tenant-a",
          providerDomain: "payments",
          kind: "replay-idempotency",
          recordId:
            result.context.idempotencyKey,
        })

      expect(completedReceipt).toMatchObject({
        version: 2,
        payload: {
          status: "completed",
          operationId: "operation-one",
          completedAt:
            expect.any(Number),
        },
      })
    })

    it("blocks a completed operation across new workers and leases", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(200)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      let executionCount = 0

      const first = await guard.execute(
        executionInput,
        async () => {
          executionCount += 1
          return "first-success"
        },
      )

      expect(first.outcome).toBe(
        "executed",
      )

      const second = await guard.execute(
        {
          ...executionInput,
          leaseId: "different-lease",
          workerId: "different-worker",
        },
        async () => {
          executionCount += 1
          return "duplicate-result"
        },
      )

      expect(second).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_ALREADY_COMPLETED",
        automaticRetryAuthorized: false,
        manualResolutionRequired: false,
      })

      expect(executionCount).toBe(1)
    })

    it("blocks an existing in-flight crash receipt without retrying", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(300)

      const acquired =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "payments",
          leaseId: "crashed-lease",
          ownerId: "crashed-worker",
          ttlMs: 1_000,
          now: now(),
        })

      if (!acquired.acquired) {
        throw new Error(
          "expected crash lease acquisition",
        )
      }

      const idempotencyKey =
        [
          "nexus-provider-operation-v1",
          "tenant-a",
          "payments",
          "operation-one",
        ]
          .map(
            (part) =>
              `${part.length}:${part}`,
          )
          .join("|")

      await store.compareAndSwap({
        scope: {
          tenantId: "tenant-a",
          providerDomain: "payments",
          kind: "replay-idempotency",
          recordId: idempotencyKey,
        },
        expectedVersion: null,
        payload: {
          status: "in-flight",
          operationId: "operation-one",
          ownerId: "crashed-worker",
          reason:
            "provider-execution-claimed",
          idempotencyKey,
          fenceToken:
            acquired.lease.fenceToken,
          startedAt: now(),
          completedAt: null,
        },
        lease: acquired.lease,
        now: now(),
      })

      await store.releaseLease({
        lease: acquired.lease,
        now: now(),
      })

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      let providerExecuted = false

      const result =
        await guard.execute(
          {
            ...executionInput,
            leaseId: "recovery-lease",
            workerId: "recovery-worker",
          },
          async () => {
            providerExecuted = true
            return "unsafe-retry"
          },
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_INDETERMINATE",
        automaticRetryAuthorized: false,
        manualResolutionRequired: true,
        receipt: {
          payload: {
            status: "in-flight",
          },
        },
      })

      expect(providerExecuted).toBe(false)
    })

    it("leaves timeout receipt in-flight and blocks the next attempt", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(400)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      const timedOut =
        await guard.execute(
          {
            ...executionInput,
            executionTimeoutMs: 20,
          },
          async ({ signal }) =>
            new Promise<string>(() => {
              signal.addEventListener(
                "abort",
                () => undefined,
              )
            }),
        )

      expect(timedOut).toMatchObject({
        outcome: "failed",
        code:
          "PROVIDER_EXECUTION_TIMEOUT",
        automaticRetryAuthorized: false,
        manualResolutionRequired: true,
        receiptVersion: 1,
      })

      let secondExecutionStarted = false

      const second =
        await guard.execute(
          {
            ...executionInput,
            leaseId: "second-lease",
            workerId: "second-worker",
          },
          async () => {
            secondExecutionStarted = true
            return "unsafe-retry"
          },
        )

      expect(second).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_INDETERMINATE",
      })

      expect(
        secondExecutionStarted,
      ).toBe(false)
    })

    it("returns indeterminate when provider succeeds but completion receipt cannot commit", async () => {
      const baseStore =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(500)

      let mutationCount = 0

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
        releaseLease:
          baseStore.releaseLease.bind(
            baseStore,
          ),
        async compareAndSwap<
          TPayload extends
            ProviderContinuityJsonValue,
        >(
          input:
            CompareAndSwapProviderContinuityInput<TPayload>,
        ): Promise<
          CompareAndSwapProviderContinuityResult<TPayload>
        > {
          mutationCount += 1

          if (mutationCount === 2) {
            return {
              applied: false,
              code: "LEASE_INVALID",
              currentRecord:
                await baseStore.read<TPayload>(
                  input.scope,
                ),
            }
          }

          return baseStore.compareAndSwap(
            input,
          )
        },
      }

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      let executionCount = 0

      const result =
        await guard.execute(
          executionInput,
          async () => {
            executionCount += 1
            return "provider-side-success"
          },
        )

      expect(result).toMatchObject({
        outcome: "indeterminate",
        code:
          "PROVIDER_EXECUTION_SUCCEEDED_RECEIPT_NOT_COMMITTED",
        receiptCommitCode:
          "LEASE_INVALID",
        automaticRetryAuthorized: false,
        manualResolutionRequired: true,
      })

      expect(executionCount).toBe(1)
    })

    it("treats receipt RPC failure after provider success as indeterminate", async () => {
      const baseStore =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(600)

      let mutationCount = 0

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
        releaseLease:
          baseStore.releaseLease.bind(
            baseStore,
          ),
        async compareAndSwap<
          TPayload extends
            ProviderContinuityJsonValue,
        >(
          input:
            CompareAndSwapProviderContinuityInput<TPayload>,
        ): Promise<
          CompareAndSwapProviderContinuityResult<TPayload>
        > {
          mutationCount += 1

          if (mutationCount === 2) {
            throw new Error(
              "database unavailable after provider success",
            )
          }

          return baseStore.compareAndSwap(
            input,
          )
        },
      }

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      const result =
        await guard.execute(
          executionInput,
          async () => "provider-success",
        )

      expect(result).toMatchObject({
        outcome: "indeterminate",
        receiptCommitCode:
          "RECEIPT_COMMIT_ERROR",
        automaticRetryAuthorized: false,
        manualResolutionRequired: true,
      })
    })

    it("keeps completed receipt authoritative when lease release fails", async () => {
      const baseStore =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(700)

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
          now,
        })

      const result =
        await guard.execute(
          executionInput,
          async () => "safe-success",
        )

      expect(result).toMatchObject({
        outcome: "executed",
        value: "safe-success",
        receiptVersion: 2,
        leaseReleased: false,
      })

      expect(
        "automaticRetryAuthorized" in result,
      ).toBe(false)
    })

    it("fails closed on malformed durable receipts", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(800)

      const acquired =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "payments",
          leaseId: "malformed-lease",
          ownerId: "malformed-worker",
          ttlMs: 1_000,
          now: now(),
        })

      if (!acquired.acquired) {
        throw new Error(
          "expected malformed receipt lease",
        )
      }

      const idempotencyKey =
        [
          "nexus-provider-operation-v1",
          "tenant-a",
          "payments",
          "operation-one",
        ]
          .map(
            (part) =>
              `${part.length}:${part}`,
          )
          .join("|")

      await store.compareAndSwap({
        scope: {
          tenantId: "tenant-a",
          providerDomain: "payments",
          kind: "replay-idempotency",
          recordId: idempotencyKey,
        },
        expectedVersion: null,
        payload: {
          status: "unknown",
        },
        lease: acquired.lease,
        now: now(),
      })

      await store.releaseLease({
        lease: acquired.lease,
        now: now(),
      })

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      let providerExecuted = false

      await expect(
        guard.execute(
          {
            ...executionInput,
            leaseId: "safe-lease",
          },
          async () => {
            providerExecuted = true
            return "unsafe-result"
          },
        ),
      ).rejects.toMatchObject({
        code:
          "MALFORMED_EXECUTION_RECEIPT",
      })

      expect(providerExecuted).toBe(false)
    })
  },
)
