import {
  assertLeaseSafeContinuityStore,
  assertProductionDurableContinuityStore,
  type ProviderContinuityDurableRecord,
  type ProviderContinuityDurableStore,
  type ProviderContinuityRecordScope,
} from "./providerContinuityDurableStore"
import {
  durableContinuityPayloadsMatch,
  validateDurableContinuityTransition,
  type DurableContinuityStatePayload,
} from "./durableContinuityStateMachine"

export interface DurableContinuityTransitionInput {
  scope: ProviderContinuityRecordScope
  expectedVersion: number | null
  nextPayload: DurableContinuityStatePayload
  leaseId: string
  workerId: string
  leaseTtlMs: number
  now: () => number
}

export type DurableContinuityTransitionResult =
  | {
      outcome: "applied"
      record:
        ProviderContinuityDurableRecord<DurableContinuityStatePayload>
    }
  | {
      outcome: "idempotent"
      record:
        ProviderContinuityDurableRecord<DurableContinuityStatePayload>
    }
  | {
      outcome: "blocked"
      code:
        | "CONTINUITY_LEASE_ALREADY_HELD"
        | "INVALID_INITIAL_STATE"
        | "INVALID_STATE_TRANSITION"
        | "TERMINAL_STATE_REOPEN_BLOCKED"
        | "VERSION_CONFLICT"
        | "LEASE_INVALID"
        | "STALE_FENCE_TOKEN"
      currentRecord:
        | ProviderContinuityDurableRecord<DurableContinuityStatePayload>
        | null
    }

const requireValue = (
  value: string,
  fieldName: string,
): string => {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`)
  }

  return normalizedValue
}

const requirePositiveInteger = (
  value: number,
  fieldName: string,
): number => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(
      `${fieldName} must be a positive integer`,
    )
  }

  return value
}

const versionMatches = (
  current:
    | ProviderContinuityDurableRecord<DurableContinuityStatePayload>
    | null,
  expectedVersion: number | null,
): boolean =>
  expectedVersion === null
    ? current === null
    : current?.version === expectedVersion

export const executeDurableContinuityTransition =
  async (
    store: ProviderContinuityDurableStore,
    input: DurableContinuityTransitionInput,
  ): Promise<DurableContinuityTransitionResult> => {
    assertLeaseSafeContinuityStore(store)

    const leaseId = requireValue(
      input.leaseId,
      "leaseId",
    )
    const workerId = requireValue(
      input.workerId,
      "workerId",
    )
    const leaseTtlMs = requirePositiveInteger(
      input.leaseTtlMs,
      "leaseTtlMs",
    )

    const acquired = await store.acquireLease({
      tenantId: input.scope.tenantId,
      providerDomain:
        input.scope.providerDomain,
      leaseId,
      ownerId: workerId,
      ttlMs: leaseTtlMs,
      now: input.now(),
    })

    if (!acquired.acquired) {
      return {
        outcome: "blocked",
        code:
          "CONTINUITY_LEASE_ALREADY_HELD",
        currentRecord: null,
      }
    }

    try {
      const current =
        await store.read<DurableContinuityStatePayload>(
          input.scope,
        )

      if (
        !versionMatches(
          current,
          input.expectedVersion,
        )
      ) {
        return {
          outcome: "blocked",
          code: "VERSION_CONFLICT",
          currentRecord: current,
        }
      }

      const validation =
        validateDurableContinuityTransition(
          input.scope.kind,
          current?.payload ?? null,
          input.nextPayload,
        )

      if (!validation.allowed) {
        return {
          outcome: "blocked",
          code: validation.code,
          currentRecord: current,
        }
      }

      if (
        validation.code ===
          "STATE_ALREADY_APPLIED" &&
        current &&
        durableContinuityPayloadsMatch(
          current.payload,
          input.nextPayload,
        )
      ) {
        return {
          outcome: "idempotent",
          record: current,
        }
      }

      const mutation =
        await store.compareAndSwap({
          scope: input.scope,
          expectedVersion:
            input.expectedVersion,
          payload: input.nextPayload,
          lease: acquired.lease,
          now: input.now(),
        })

      if (!mutation.applied) {
        return {
          outcome: "blocked",
          code: mutation.code,
          currentRecord:
            mutation.currentRecord as
              | ProviderContinuityDurableRecord<DurableContinuityStatePayload>
              | null,
        }
      }

      return {
        outcome: "applied",
        record: mutation.record,
      }
    } finally {
      await store.releaseLease({
        lease: acquired.lease,
        now: input.now(),
      })
    }
  }

export interface ProductionDurableContinuityCoordinator {
  transition(
    input: DurableContinuityTransitionInput,
  ): Promise<DurableContinuityTransitionResult>
}

export const createProductionDurableContinuityCoordinator =
  (
    store: ProviderContinuityDurableStore,
  ): ProductionDurableContinuityCoordinator => {
    assertProductionDurableContinuityStore(
      store,
    )

    return {
      transition: (
        input: DurableContinuityTransitionInput,
      ) =>
        executeDurableContinuityTransition(
          store,
          input,
        ),
    }
  }
