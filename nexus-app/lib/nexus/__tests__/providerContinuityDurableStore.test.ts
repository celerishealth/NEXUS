import {
  describe,
  expect,
  it,
} from "vitest"

import {
  executeWithDurableProviderLease,
} from "../durableProviderLeaseExecutor"
import {
  InMemoryTestProviderContinuityStore,
} from "../inMemoryTestProviderContinuityStore"
import {
  assertProductionDurableContinuityStore,
  type ProviderContinuityDurableStore,
} from "../providerContinuityDurableStore"

describe(
  "durable continuity store and split-brain guard",
  () => {
    it("rejects the test in-memory store for production", () => {
      const store =
        new InMemoryTestProviderContinuityStore()

      expect(() =>
        assertProductionDurableContinuityStore(
          store,
        ),
      ).toThrow(
        "provider continuity store is not production-safe; missing capabilities: durableAcrossRestarts",
      )
    })

    it("forbids constructing the test store in production", () => {
      expect(() =>
        new InMemoryTestProviderContinuityStore(
          "production",
        ),
      ).toThrow(
        "in-memory continuity store is forbidden in production",
      )
    })

    it("blocks concurrent execution for the same tenant and domain", async () => {
      let now = 100

      const store =
        new InMemoryTestProviderContinuityStore()

      const firstLease =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "database",
          leaseId: "lease-one",
          ownerId: "worker-one",
          ttlMs: 1_000,
          now: now++,
        })

      expect(firstLease.acquired).toBe(true)

      let operationExecuted = false

      const second =
        await executeWithDurableProviderLease(
          store,
          {
            tenantId: "tenant-a",
            providerDomain: "database",
            leaseId: "lease-two",
            ownerId: "worker-two",
            ttlMs: 1_000,
            now: () => now++,
          },
          async () => {
            operationExecuted = true
            return "unsafe-result"
          },
        )

      expect(second).toMatchObject({
        outcome: "blocked",
        code:
          "CONTINUITY_LEASE_ALREADY_HELD",
      })

      expect(operationExecuted).toBe(false)
    })

    it("allows independent tenant and domain scopes", async () => {
      let now = 200

      const store =
        new InMemoryTestProviderContinuityStore()

      const tenantALease =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "database",
          leaseId: "tenant-a-lease",
          ownerId: "worker-a",
          ttlMs: 1_000,
          now: now++,
        })

      expect(tenantALease.acquired).toBe(
        true,
      )

      const tenantBResult =
        await executeWithDurableProviderLease(
          store,
          {
            tenantId: "tenant-b",
            providerDomain: "database",
            leaseId: "tenant-b-lease",
            ownerId: "worker-b",
            ttlMs: 1_000,
            now: () => now++,
          },
          async () => "tenant-b-result",
        )

      const differentDomainResult =
        await executeWithDurableProviderLease(
          store,
          {
            tenantId: "tenant-a",
            providerDomain: "ai",
            leaseId: "tenant-a-ai-lease",
            ownerId: "worker-c",
            ttlMs: 1_000,
            now: () => now++,
          },
          async () => "ai-result",
        )

      expect(
        tenantBResult.outcome,
      ).toBe("executed")

      expect(
        differentDomainResult.outcome,
      ).toBe("executed")
    })

    it("enforces optimistic concurrency on durable records", async () => {
      let now = 300

      const store =
        new InMemoryTestProviderContinuityStore()

      const acquired =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "payments",
          leaseId: "payments-lease",
          ownerId: "worker-a",
          ttlMs: 1_000,
          now: now++,
        })

      if (!acquired.acquired) {
        throw new Error(
          "expected lease acquisition",
        )
      }

      const created =
        await store.compareAndSwap({
          scope: {
            tenantId: "tenant-a",
            providerDomain: "payments",
            kind: "incident",
            recordId: "incident-one",
          },
          expectedVersion: null,
          payload: {
            status: "open",
          },
          lease: acquired.lease,
          now: now++,
        })

      expect(created).toMatchObject({
        applied: true,
        record: {
          version: 1,
        },
      })

      const staleUpdate =
        await store.compareAndSwap({
          scope: {
            tenantId: "tenant-a",
            providerDomain: "payments",
            kind: "incident",
            recordId: "incident-one",
          },
          expectedVersion: 0,
          payload: {
            status: "resolved",
          },
          lease: acquired.lease,
          now: now++,
        })

      expect(staleUpdate).toMatchObject({
        applied: false,
        code: "VERSION_CONFLICT",
        currentRecord: {
          version: 1,
          payload: {
            status: "open",
          },
        },
      })

      const validUpdate =
        await store.compareAndSwap({
          scope: {
            tenantId: "tenant-a",
            providerDomain: "payments",
            kind: "incident",
            recordId: "incident-one",
          },
          expectedVersion: 1,
          payload: {
            status: "resolved",
          },
          lease: acquired.lease,
          now: now++,
        })

      expect(validUpdate).toMatchObject({
        applied: true,
        record: {
          version: 2,
          payload: {
            status: "resolved",
          },
        },
      })
    })

    it("rejects stale workers with monotonic fencing tokens", async () => {
      let now = 400

      const store =
        new InMemoryTestProviderContinuityStore()

      const oldLeaseResult =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "database",
          leaseId: "old-lease",
          ownerId: "old-worker",
          ttlMs: 10,
          now,
        })

      if (!oldLeaseResult.acquired) {
        throw new Error(
          "expected old lease acquisition",
        )
      }

      now = 411

      const newLeaseResult =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "database",
          leaseId: "new-lease",
          ownerId: "new-worker",
          ttlMs: 100,
          now,
        })

      if (!newLeaseResult.acquired) {
        throw new Error(
          "expected new lease acquisition",
        )
      }

      expect(
        newLeaseResult.lease.fenceToken,
      ).toBeGreaterThan(
        oldLeaseResult.lease.fenceToken,
      )

      const staleWrite =
        await store.compareAndSwap({
          scope: {
            tenantId: "tenant-a",
            providerDomain: "database",
            kind: "containment",
            recordId: "containment-one",
          },
          expectedVersion: null,
          payload: {
            status: "released",
          },
          lease: oldLeaseResult.lease,
          now,
        })

      expect(staleWrite).toMatchObject({
        applied: false,
        code: "STALE_FENCE_TOKEN",
      })

      const currentWrite =
        await store.compareAndSwap({
          scope: {
            tenantId: "tenant-a",
            providerDomain: "database",
            kind: "containment",
            recordId: "containment-one",
          },
          expectedVersion: null,
          payload: {
            status: "active",
          },
          lease: newLeaseResult.lease,
          now: now + 1,
        })

      expect(currentWrite).toMatchObject({
        applied: true,
        record: {
          lastFenceToken:
            newLeaseResult.lease.fenceToken,
        },
      })
    })

    it("keeps durable records tenant-isolated", async () => {
      let now = 500

      const store =
        new InMemoryTestProviderContinuityStore()

      const acquired =
        await store.acquireLease({
          tenantId: "tenant-a",
          providerDomain: "ai",
          leaseId: "tenant-a-ai-lease",
          ownerId: "worker-a",
          ttlMs: 1_000,
          now: now++,
        })

      if (!acquired.acquired) {
        throw new Error(
          "expected lease acquisition",
        )
      }

      await store.compareAndSwap({
        scope: {
          tenantId: "tenant-a",
          providerDomain: "ai",
          kind: "recovery",
          recordId: "private-recovery",
        },
        expectedVersion: null,
        payload: {
          status:
            "pending-owner-approval",
        },
        lease: acquired.lease,
        now: now++,
      })

      const tenantARecord =
        await store.read({
          tenantId: "tenant-a",
          providerDomain: "ai",
          kind: "recovery",
          recordId: "private-recovery",
        })

      const tenantBRecord =
        await store.read({
          tenantId: "tenant-b",
          providerDomain: "ai",
          kind: "recovery",
          recordId: "private-recovery",
        })

      expect(tenantARecord).not.toBeNull()
      expect(tenantBRecord).toBeNull()
    })

    it("releases the lease when execution throws", async () => {
      let now = 600

      const store =
        new InMemoryTestProviderContinuityStore()

      await expect(
        executeWithDurableProviderLease(
          store,
          {
            tenantId: "tenant-a",
            providerDomain: "messaging",
            leaseId: "failed-lease",
            ownerId: "worker-a",
            ttlMs: 1_000,
            now: () => now++,
          },
          async () => {
            throw new Error(
              "controlled operation failure",
            )
          },
        ),
      ).rejects.toThrow(
        "controlled operation failure",
      )

      const nextExecution =
        await executeWithDurableProviderLease(
          store,
          {
            tenantId: "tenant-a",
            providerDomain: "messaging",
            leaseId: "next-lease",
            ownerId: "worker-b",
            ttlMs: 1_000,
            now: () => now++,
          },
          async () => "recovered",
        )

      expect(nextExecution).toMatchObject({
        outcome: "executed",
        value: "recovered",
        leaseReleased: true,
      })
    })

    it("fails closed when distributed safety capabilities are missing", async () => {
      const unsafeStore = {
        storageKind: "unsafe-test-store",
        capabilities: {
          durableAcrossRestarts: true,
          atomicCompareAndSwap: false,
          monotonicFencingTokens: false,
          tenantIsolation: false,
        },
      } as ProviderContinuityDurableStore

      await expect(
        executeWithDurableProviderLease(
          unsafeStore,
          {
            tenantId: "tenant-a",
            providerDomain: "database",
            leaseId: "unsafe-lease",
            ownerId: "unsafe-worker",
            ttlMs: 1_000,
            now: () => 700,
          },
          async () => "must-not-run",
        ),
      ).rejects.toThrow(
        "provider continuity store cannot safely coordinate distributed execution",
      )
    })
  },
)
