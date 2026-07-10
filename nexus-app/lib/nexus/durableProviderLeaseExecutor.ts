import {
  assertLeaseSafeContinuityStore,
  type ProviderContinuityDurableStore,
  type ProviderContinuityLease,
} from "./providerContinuityDurableStore"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export interface DurableProviderLeaseExecutionInput {
  tenantId: string
  providerDomain: ProviderDomain
  leaseId: string
  ownerId: string
  ttlMs: number
  now: () => number
}

export type DurableProviderLeaseExecutionResult<T> =
  | {
      outcome: "executed"
      lease: ProviderContinuityLease
      value: T
      leaseReleased: boolean
    }
  | {
      outcome: "blocked"
      code: "CONTINUITY_LEASE_ALREADY_HELD"
      activeLease: ProviderContinuityLease
    }

export const executeWithDurableProviderLease =
  async <T>(
    store: ProviderContinuityDurableStore,
    input: DurableProviderLeaseExecutionInput,
    operation: (
      lease: ProviderContinuityLease,
    ) => Promise<T>,
  ): Promise<
    DurableProviderLeaseExecutionResult<T>
  > => {
    assertLeaseSafeContinuityStore(store)

    const acquired = await store.acquireLease({
      tenantId: input.tenantId,
      providerDomain: input.providerDomain,
      leaseId: input.leaseId,
      ownerId: input.ownerId,
      ttlMs: input.ttlMs,
      now: input.now(),
    })

    if (!acquired.acquired) {
      return {
        outcome: "blocked",
        code:
          "CONTINUITY_LEASE_ALREADY_HELD",
        activeLease: acquired.activeLease,
      }
    }

    try {
      const value = await operation(
        acquired.lease,
      )

      const leaseReleased =
        await store.releaseLease({
          lease: acquired.lease,
          now: input.now(),
        })

      return {
        outcome: "executed",
        lease: acquired.lease,
        value,
        leaseReleased,
      }
    } catch (error: unknown) {
      await store.releaseLease({
        lease: acquired.lease,
        now: input.now(),
      })

      throw error
    }
  }
