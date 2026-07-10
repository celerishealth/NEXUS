import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type ProviderContinuityRecordKind =
  | "recovery"
  | "incident"
  | "containment"
  | "telemetry"
  | "replay-idempotency"

export type ProviderContinuityJsonPrimitive =
  | string
  | number
  | boolean
  | null

export type ProviderContinuityJsonValue =
  | ProviderContinuityJsonPrimitive
  | ProviderContinuityJsonValue[]
  | {
      [key: string]: ProviderContinuityJsonValue
    }

export interface ProviderContinuityRecordScope {
  tenantId: string
  providerDomain: ProviderDomain
  kind: ProviderContinuityRecordKind
  recordId: string
}

export interface ProviderContinuityLeaseScope {
  tenantId: string
  providerDomain: ProviderDomain
}

export interface ProviderContinuityLease {
  leaseId: string
  ownerId: string
  tenantId: string
  providerDomain: ProviderDomain
  fenceToken: number
  acquiredAt: number
  expiresAt: number
}

export interface ProviderContinuityDurableRecord<
  TPayload extends ProviderContinuityJsonValue,
> extends ProviderContinuityRecordScope {
  version: number
  payload: TPayload
  updatedAt: number
  lastFenceToken: number
}

export interface ProviderContinuityStoreCapabilities {
  durableAcrossRestarts: boolean
  atomicCompareAndSwap: boolean
  monotonicFencingTokens: boolean
  tenantIsolation: boolean
}

export interface AcquireProviderContinuityLeaseInput
  extends ProviderContinuityLeaseScope {
  leaseId: string
  ownerId: string
  ttlMs: number
  now: number
}

export type AcquireProviderContinuityLeaseResult =
  | {
      acquired: true
      lease: ProviderContinuityLease
    }
  | {
      acquired: false
      code: "LEASE_ALREADY_HELD"
      activeLease: ProviderContinuityLease
    }

export interface ReleaseProviderContinuityLeaseInput {
  lease: ProviderContinuityLease
  now: number
}

export interface CompareAndSwapProviderContinuityInput<
  TPayload extends ProviderContinuityJsonValue,
> {
  scope: ProviderContinuityRecordScope
  expectedVersion: number | null
  payload: TPayload
  lease: ProviderContinuityLease
  now: number
}

export type CompareAndSwapProviderContinuityResult<
  TPayload extends ProviderContinuityJsonValue,
> =
  | {
      applied: true
      record: ProviderContinuityDurableRecord<TPayload>
    }
  | {
      applied: false
      code:
        | "VERSION_CONFLICT"
        | "LEASE_INVALID"
        | "STALE_FENCE_TOKEN"
      currentRecord:
        | ProviderContinuityDurableRecord<TPayload>
        | null
    }

export interface ProviderContinuityDurableStore {
  readonly storageKind: string
  readonly capabilities:
    ProviderContinuityStoreCapabilities

  read<TPayload extends ProviderContinuityJsonValue>(
    scope: ProviderContinuityRecordScope,
  ): Promise<
    ProviderContinuityDurableRecord<TPayload> | null
  >

  acquireLease(
    input: AcquireProviderContinuityLeaseInput,
  ): Promise<AcquireProviderContinuityLeaseResult>

  releaseLease(
    input: ReleaseProviderContinuityLeaseInput,
  ): Promise<boolean>

  compareAndSwap<
    TPayload extends ProviderContinuityJsonValue,
  >(
    input: CompareAndSwapProviderContinuityInput<TPayload>,
  ): Promise<
    CompareAndSwapProviderContinuityResult<TPayload>
  >
}

const missingProductionCapabilities = (
  store: ProviderContinuityDurableStore,
): string[] => {
  const missing: string[] = []

  if (
    !store.capabilities.durableAcrossRestarts
  ) {
    missing.push("durableAcrossRestarts")
  }

  if (
    !store.capabilities.atomicCompareAndSwap
  ) {
    missing.push("atomicCompareAndSwap")
  }

  if (
    !store.capabilities.monotonicFencingTokens
  ) {
    missing.push("monotonicFencingTokens")
  }

  if (!store.capabilities.tenantIsolation) {
    missing.push("tenantIsolation")
  }

  return missing
}

export const assertProductionDurableContinuityStore = (
  store: ProviderContinuityDurableStore,
): ProviderContinuityDurableStore => {
  const missing =
    missingProductionCapabilities(store)

  if (missing.length > 0) {
    throw new Error(
      `provider continuity store is not production-safe; missing capabilities: ${missing.join(
        ", ",
      )}`,
    )
  }

  return store
}

export const assertLeaseSafeContinuityStore = (
  store: ProviderContinuityDurableStore,
): ProviderContinuityDurableStore => {
  const missing: string[] = []

  if (
    !store.capabilities.atomicCompareAndSwap
  ) {
    missing.push("atomicCompareAndSwap")
  }

  if (
    !store.capabilities.monotonicFencingTokens
  ) {
    missing.push("monotonicFencingTokens")
  }

  if (!store.capabilities.tenantIsolation) {
    missing.push("tenantIsolation")
  }

  if (missing.length > 0) {
    throw new Error(
      `provider continuity store cannot safely coordinate distributed execution; missing capabilities: ${missing.join(
        ", ",
      )}`,
    )
  }

  return store
}
