import {
  describe,
  expect,
  it,
} from "vitest"

import {
  createProductionDurableContinuityCoordinator,
  executeDurableContinuityTransition,
} from "../durableContinuityTransactionCoordinator"
import {
  InMemoryTestProviderContinuityStore,
} from "../inMemoryTestProviderContinuityStore"
import {
  createPostgresProviderContinuityStore,
  type SupabaseRpcClientLike,
} from "../postgresProviderContinuityStore"

const createClock = (
  initial = 100,
) => {
  let now = initial

  return () => now++
}

const recoveryScope = {
  tenantId: "tenant-a",
  providerDomain: "database" as const,
  kind: "recovery" as const,
  recordId: "recovery-one",
}

describe(
  "durable continuity state transaction coordinator",
  () => {
    it("runs the complete durable recovery state lifecycle", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock()

      const pending =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: null,
            nextPayload: {
              status:
                "pending-owner-approval",
              operationId: "operation-one",
              ownerId: null,
              reason:
                "all providers unavailable",
            },
            leaseId: "lease-pending",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(pending).toMatchObject({
        outcome: "applied",
        record: {
          version: 1,
          payload: {
            status:
              "pending-owner-approval",
          },
        },
      })

      const approved =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: 1,
            nextPayload: {
              status: "approved",
              operationId: "operation-one",
              ownerId: "owner-a",
              reason:
                "owner approved controlled recovery",
            },
            leaseId: "lease-approved",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(approved).toMatchObject({
        outcome: "applied",
        record: {
          version: 2,
          payload: {
            status: "approved",
          },
        },
      })

      const authorized =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: 2,
            nextPayload: {
              status:
                "replay-authorized",
              operationId: "operation-one",
              ownerId: "owner-a",
              reason:
                "explicit replay authorization",
            },
            leaseId: "lease-authorized",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(authorized).toMatchObject({
        outcome: "applied",
        record: {
          version: 3,
          payload: {
            status:
              "replay-authorized",
          },
        },
      })

      const completed =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: 3,
            nextPayload: {
              status: "completed",
              operationId: "operation-one",
              ownerId: "owner-a",
              reason:
                "authorized replay completed",
            },
            leaseId: "lease-completed",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(completed).toMatchObject({
        outcome: "applied",
        record: {
          version: 4,
          payload: {
            status: "completed",
          },
        },
      })
    })

    it("blocks skipped owner approval transitions", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(200)

      await executeDurableContinuityTransition(
        store,
        {
          scope: recoveryScope,
          expectedVersion: null,
          nextPayload: {
            status:
              "pending-owner-approval",
            operationId: "operation-one",
            ownerId: null,
            reason: "provider failure",
          },
          leaseId: "lease-create",
          workerId: "worker-a",
          leaseTtlMs: 1_000,
          now,
        },
      )

      const skipped =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: 1,
            nextPayload: {
              status:
                "replay-authorized",
              operationId: "operation-one",
              ownerId: "owner-a",
              reason:
                "unsafe skipped approval",
            },
            leaseId: "lease-skip",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(skipped).toMatchObject({
        outcome: "blocked",
        code:
          "INVALID_STATE_TRANSITION",
        currentRecord: {
          version: 1,
          payload: {
            status:
              "pending-owner-approval",
          },
        },
      })
    })

    it("blocks terminal state reopening", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(300)

      const scope = {
        tenantId: "tenant-a",
        providerDomain: "payments" as const,
        kind: "containment" as const,
        recordId: "containment-one",
      }

      await executeDurableContinuityTransition(
        store,
        {
          scope,
          expectedVersion: null,
          nextPayload: {
            status: "active",
            operationId: "payment-operation",
            ownerId: null,
            reason:
              "critical payment incident",
          },
          leaseId: "lease-active",
          workerId: "worker-a",
          leaseTtlMs: 1_000,
          now,
        },
      )

      await executeDurableContinuityTransition(
        store,
        {
          scope,
          expectedVersion: 1,
          nextPayload: {
            status: "released",
            operationId: "payment-operation",
            ownerId: "owner-a",
            reason:
              "incident safely resolved",
          },
          leaseId: "lease-release",
          workerId: "worker-a",
          leaseTtlMs: 1_000,
          now,
        },
      )

      const reopened =
        await executeDurableContinuityTransition(
          store,
          {
            scope,
            expectedVersion: 2,
            nextPayload: {
              status: "active",
              operationId:
                "payment-operation",
              ownerId: null,
              reason:
                "unsafe containment reopening",
            },
            leaseId: "lease-reopen",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(reopened).toMatchObject({
        outcome: "blocked",
        code:
          "TERMINAL_STATE_REOPEN_BLOCKED",
      })
    })

    it("returns idempotent result without increasing version", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(400)

      const payload = {
        status:
          "pending-owner-approval" as const,
        operationId: "operation-one",
        ownerId: null,
        reason: "provider unavailable",
      }

      const first =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: null,
            nextPayload: payload,
            leaseId: "lease-first",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(first.outcome).toBe("applied")

      const second =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: 1,
            nextPayload: {
              reason: "provider unavailable",
              ownerId: null,
              operationId: "operation-one",
              status:
                "pending-owner-approval",
            },
            leaseId: "lease-second",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(second).toMatchObject({
        outcome: "idempotent",
        record: {
          version: 1,
        },
      })
    })

    it("blocks stale expected versions without overwriting state", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(500)

      await executeDurableContinuityTransition(
        store,
        {
          scope: recoveryScope,
          expectedVersion: null,
          nextPayload: {
            status:
              "pending-owner-approval",
            operationId: "operation-one",
            ownerId: null,
            reason: "provider unavailable",
          },
          leaseId: "lease-create",
          workerId: "worker-a",
          leaseTtlMs: 1_000,
          now,
        },
      )

      const stale =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: 0,
            nextPayload: {
              status: "approved",
              operationId: "operation-one",
              ownerId: "owner-a",
              reason: "stale approval",
            },
            leaseId: "lease-stale",
            workerId: "worker-b",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(stale).toMatchObject({
        outcome: "blocked",
        code: "VERSION_CONFLICT",
        currentRecord: {
          version: 1,
          payload: {
            status:
              "pending-owner-approval",
          },
        },
      })

      const stored = await store.read(
        recoveryScope,
      )

      expect(stored).toMatchObject({
        version: 1,
        payload: {
          status:
            "pending-owner-approval",
        },
      })
    })

    it("releases lease after an invalid transition", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(600)

      const invalid =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: null,
            nextPayload: {
              status: "completed",
              operationId: "operation-one",
              ownerId: "owner-a",
              reason:
                "invalid initial completion",
            },
            leaseId: "lease-invalid",
            workerId: "worker-a",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(invalid).toMatchObject({
        outcome: "blocked",
        code: "INVALID_INITIAL_STATE",
      })

      const valid =
        await executeDurableContinuityTransition(
          store,
          {
            scope: recoveryScope,
            expectedVersion: null,
            nextPayload: {
              status:
                "pending-owner-approval",
              operationId: "operation-one",
              ownerId: null,
              reason:
                "valid initial recovery",
            },
            leaseId: "lease-valid",
            workerId: "worker-b",
            leaseTtlMs: 1_000,
            now,
          },
        )

      expect(valid.outcome).toBe("applied")
    })

    it("keeps durable transitions tenant-isolated", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(700)

      await executeDurableContinuityTransition(
        store,
        {
          scope: recoveryScope,
          expectedVersion: null,
          nextPayload: {
            status:
              "pending-owner-approval",
            operationId:
              "tenant-a-operation",
            ownerId: null,
            reason:
              "tenant-a provider failure",
          },
          leaseId: "tenant-a-lease",
          workerId: "worker-a",
          leaseTtlMs: 1_000,
          now,
        },
      )

      const tenantBRecord =
        await store.read({
          ...recoveryScope,
          tenantId: "tenant-b",
        })

      expect(tenantBRecord).toBeNull()
    })

    it("rejects ephemeral storage for production coordination", () => {
      const store =
        new InMemoryTestProviderContinuityStore()

      expect(() =>
        createProductionDurableContinuityCoordinator(
          store,
        ),
      ).toThrow(
        "provider continuity store is not production-safe; missing capabilities: durableAcrossRestarts",
      )
    })

    it("accepts the Postgres durable store for production coordination", () => {
      const client:
        SupabaseRpcClientLike = {
          async rpc<T = unknown>() {
            return {
              data: null as T | null,
              error: null,
            }
          },
        }

      const store =
        createPostgresProviderContinuityStore(
          client,
        )

      const coordinator =
        createProductionDurableContinuityCoordinator(
          store,
        )

      expect(
        typeof coordinator.transition,
      ).toBe("function")
    })
  },
)
