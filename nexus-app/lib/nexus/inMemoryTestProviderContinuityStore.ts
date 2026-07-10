import type {
  AcquireProviderContinuityLeaseInput,
  AcquireProviderContinuityLeaseResult,
  CompareAndSwapProviderContinuityInput,
  CompareAndSwapProviderContinuityResult,
  ProviderContinuityDurableRecord,
  ProviderContinuityDurableStore,
  ProviderContinuityJsonValue,
  ProviderContinuityLease,
  ProviderContinuityLeaseScope,
  ProviderContinuityRecordScope,
  ProviderContinuityStoreCapabilities,
  ReleaseProviderContinuityLeaseInput,
} from "./providerContinuityDurableStore"

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

const cloneJson = <
  TValue extends ProviderContinuityJsonValue,
>(
  value: TValue,
): TValue =>
  JSON.parse(JSON.stringify(value)) as TValue

const cloneLease = (
  lease: ProviderContinuityLease,
): ProviderContinuityLease => ({
  ...lease,
})

const cloneRecord = <
  TPayload extends ProviderContinuityJsonValue,
>(
  record:
    ProviderContinuityDurableRecord<TPayload>,
): ProviderContinuityDurableRecord<TPayload> => ({
  ...record,
  payload: cloneJson(record.payload),
})

const leaseScopeKey = (
  scope: ProviderContinuityLeaseScope,
): string =>
  [
    requireValue(scope.tenantId, "tenantId"),
    scope.providerDomain,
  ].join(":")

const recordScopeKey = (
  scope: ProviderContinuityRecordScope,
): string =>
  [
    requireValue(scope.tenantId, "tenantId"),
    scope.providerDomain,
    scope.kind,
    requireValue(scope.recordId, "recordId"),
  ].join(":")

export class InMemoryTestProviderContinuityStore
  implements ProviderContinuityDurableStore
{
  readonly storageKind =
    "ephemeral-in-memory-test"

  readonly capabilities:
    ProviderContinuityStoreCapabilities = {
      durableAcrossRestarts: false,
      atomicCompareAndSwap: true,
      monotonicFencingTokens: true,
      tenantIsolation: true,
    }

  private readonly records =
    new Map<
      string,
      ProviderContinuityDurableRecord<ProviderContinuityJsonValue>
    >()

  private readonly activeLeases =
    new Map<string, ProviderContinuityLease>()

  private readonly latestFenceTokens =
    new Map<string, number>()

  constructor(
    environment = "test",
  ) {
    if (
      environment.trim().toLowerCase() ===
      "production"
    ) {
      throw new Error(
        "in-memory continuity store is forbidden in production",
      )
    }
  }

  async read<
    TPayload extends ProviderContinuityJsonValue,
  >(
    scope: ProviderContinuityRecordScope,
  ): Promise<
    ProviderContinuityDurableRecord<TPayload> | null
  > {
    const record = this.records.get(
      recordScopeKey(scope),
    )

    return record
      ? cloneRecord(
          record as ProviderContinuityDurableRecord<TPayload>,
        )
      : null
  }

  async acquireLease(
    input: AcquireProviderContinuityLeaseInput,
  ): Promise<AcquireProviderContinuityLeaseResult> {
    const leaseId = requireValue(
      input.leaseId,
      "leaseId",
    )
    const ownerId = requireValue(
      input.ownerId,
      "ownerId",
    )
    const ttlMs = requirePositiveInteger(
      input.ttlMs,
      "ttlMs",
    )

    const scopeKey = leaseScopeKey(input)
    const existingLease =
      this.activeLeases.get(scopeKey)

    if (
      existingLease &&
      existingLease.expiresAt > input.now
    ) {
      if (
        existingLease.leaseId === leaseId &&
        existingLease.ownerId === ownerId
      ) {
        return {
          acquired: true,
          lease: cloneLease(existingLease),
        }
      }

      return {
        acquired: false,
        code: "LEASE_ALREADY_HELD",
        activeLease:
          cloneLease(existingLease),
      }
    }

    const fenceToken =
      (this.latestFenceTokens.get(scopeKey) ??
        0) + 1

    const lease: ProviderContinuityLease = {
      leaseId,
      ownerId,
      tenantId: requireValue(
        input.tenantId,
        "tenantId",
      ),
      providerDomain: input.providerDomain,
      fenceToken,
      acquiredAt: input.now,
      expiresAt: input.now + ttlMs,
    }

    this.latestFenceTokens.set(
      scopeKey,
      fenceToken,
    )

    this.activeLeases.set(scopeKey, lease)

    return {
      acquired: true,
      lease: cloneLease(lease),
    }
  }

  async releaseLease(
    input: ReleaseProviderContinuityLeaseInput,
  ): Promise<boolean> {
    const scopeKey = leaseScopeKey(
      input.lease,
    )

    const activeLease =
      this.activeLeases.get(scopeKey)

    if (
      !activeLease ||
      activeLease.leaseId !==
        input.lease.leaseId ||
      activeLease.ownerId !==
        input.lease.ownerId ||
      activeLease.fenceToken !==
        input.lease.fenceToken
    ) {
      return false
    }

    this.activeLeases.delete(scopeKey)
    return true
  }

  async compareAndSwap<
    TPayload extends ProviderContinuityJsonValue,
  >(
    input:
      CompareAndSwapProviderContinuityInput<TPayload>,
  ): Promise<
    CompareAndSwapProviderContinuityResult<TPayload>
  > {
    const scopeKey = leaseScopeKey(
      input.scope,
    )

    const latestFenceToken =
      this.latestFenceTokens.get(scopeKey) ?? 0

    const recordKey = recordScopeKey(
      input.scope,
    )

    const currentRecord =
      this.records.get(recordKey) as
        | ProviderContinuityDurableRecord<TPayload>
        | undefined

    if (
      input.lease.fenceToken <
      latestFenceToken
    ) {
      return {
        applied: false,
        code: "STALE_FENCE_TOKEN",
        currentRecord: currentRecord
          ? cloneRecord(currentRecord)
          : null,
      }
    }

    const activeLease =
      this.activeLeases.get(scopeKey)

    const leaseIsValid =
      activeLease !== undefined &&
      activeLease.expiresAt > input.now &&
      activeLease.leaseId ===
        input.lease.leaseId &&
      activeLease.ownerId ===
        input.lease.ownerId &&
      activeLease.fenceToken ===
        input.lease.fenceToken &&
      input.lease.tenantId ===
        input.scope.tenantId &&
      input.lease.providerDomain ===
        input.scope.providerDomain

    if (!leaseIsValid) {
      return {
        applied: false,
        code: "LEASE_INVALID",
        currentRecord: currentRecord
          ? cloneRecord(currentRecord)
          : null,
      }
    }

    const versionMatches =
      input.expectedVersion === null
        ? currentRecord === undefined
        : currentRecord?.version ===
          input.expectedVersion

    if (!versionMatches) {
      return {
        applied: false,
        code: "VERSION_CONFLICT",
        currentRecord: currentRecord
          ? cloneRecord(currentRecord)
          : null,
      }
    }

    const record:
      ProviderContinuityDurableRecord<TPayload> =
      {
        tenantId: requireValue(
          input.scope.tenantId,
          "tenantId",
        ),
        providerDomain:
          input.scope.providerDomain,
        kind: input.scope.kind,
        recordId: requireValue(
          input.scope.recordId,
          "recordId",
        ),
        version:
          (currentRecord?.version ?? 0) + 1,
        payload: cloneJson(input.payload),
        updatedAt: input.now,
        lastFenceToken:
          input.lease.fenceToken,
      }

    this.records.set(
      recordKey,
      record as ProviderContinuityDurableRecord<ProviderContinuityJsonValue>,
    )

    return {
      applied: true,
      record: cloneRecord(record),
    }
  }
}
