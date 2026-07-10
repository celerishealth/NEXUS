import {
  assertProductionDurableContinuityStore,
  type AcquireProviderContinuityLeaseInput,
  type AcquireProviderContinuityLeaseResult,
  type CompareAndSwapProviderContinuityInput,
  type CompareAndSwapProviderContinuityResult,
  type ProviderContinuityDurableRecord,
  type ProviderContinuityDurableStore,
  type ProviderContinuityJsonValue,
  type ProviderContinuityLease,
  type ProviderContinuityRecordScope,
  type ProviderContinuityStoreCapabilities,
  type ReleaseProviderContinuityLeaseInput,
} from "./providerContinuityDurableStore"

export interface SupabaseRpcErrorLike {
  message: string
}

export interface SupabaseRpcResultLike<T> {
  data: T | null
  error: SupabaseRpcErrorLike | null
}

export interface SupabaseRpcClientLike {
  rpc<T = unknown>(
    functionName: string,
    parameters?: Record<string, unknown>,
  ): Promise<SupabaseRpcResultLike<T>>
}

export class ProviderContinuityStoreRpcError
  extends Error
{
  constructor(
    readonly functionName: string,
    message: string,
  ) {
    super(
      `provider continuity RPC ${functionName} failed: ${message}`,
    )
    this.name =
      "ProviderContinuityStoreRpcError"
  }
}

const isRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value)

const readString = (
  value: unknown,
  fieldName: string,
): string => {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `invalid provider continuity RPC field: ${fieldName}`,
    )
  }

  return value
}

const readNumber = (
  value: unknown,
  fieldName: string,
): number => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    throw new Error(
      `invalid provider continuity RPC field: ${fieldName}`,
    )
  }

  return value
}

const parseLease = (
  value: unknown,
): ProviderContinuityLease => {
  if (!isRecord(value)) {
    throw new Error(
      "invalid provider continuity RPC lease",
    )
  }

  return {
    leaseId: readString(
      value.leaseId,
      "leaseId",
    ),
    ownerId: readString(
      value.ownerId,
      "ownerId",
    ),
    tenantId: readString(
      value.tenantId,
      "tenantId",
    ),
    providerDomain: readString(
      value.providerDomain,
      "providerDomain",
    ) as ProviderContinuityLease["providerDomain"],
    fenceToken: readNumber(
      value.fenceToken,
      "fenceToken",
    ),
    acquiredAt: readNumber(
      value.acquiredAt,
      "acquiredAt",
    ),
    expiresAt: readNumber(
      value.expiresAt,
      "expiresAt",
    ),
  }
}

const parseRecord = <
  TPayload extends ProviderContinuityJsonValue,
>(
  value: unknown,
): ProviderContinuityDurableRecord<TPayload> => {
  if (!isRecord(value)) {
    throw new Error(
      "invalid provider continuity RPC record",
    )
  }

  return {
    tenantId: readString(
      value.tenantId,
      "tenantId",
    ),
    providerDomain: readString(
      value.providerDomain,
      "providerDomain",
    ) as ProviderContinuityDurableRecord<TPayload>["providerDomain"],
    kind: readString(
      value.kind,
      "kind",
    ) as ProviderContinuityDurableRecord<TPayload>["kind"],
    recordId: readString(
      value.recordId,
      "recordId",
    ),
    version: readNumber(
      value.version,
      "version",
    ),
    payload: value.payload as TPayload,
    updatedAt: readNumber(
      value.updatedAt,
      "updatedAt",
    ),
    lastFenceToken: readNumber(
      value.lastFenceToken,
      "lastFenceToken",
    ),
  }
}

const toTimestamp = (
  value: number,
): string => {
  if (!Number.isFinite(value)) {
    throw new Error(
      "provider continuity timestamp must be finite",
    )
  }

  return new Date(value).toISOString()
}

export class PostgresProviderContinuityStore
  implements ProviderContinuityDurableStore
{
  readonly storageKind =
    "postgres-supabase-rpc"

  readonly capabilities:
    ProviderContinuityStoreCapabilities = {
      durableAcrossRestarts: true,
      atomicCompareAndSwap: true,
      monotonicFencingTokens: true,
      tenantIsolation: true,
    }

  constructor(
    private readonly client:
      SupabaseRpcClientLike,
  ) {
    assertProductionDurableContinuityStore(
      this,
    )
  }

  async read<
    TPayload extends ProviderContinuityJsonValue,
  >(
    scope: ProviderContinuityRecordScope,
  ): Promise<
    ProviderContinuityDurableRecord<TPayload> | null
  > {
    const data = await this.call(
      "nexus_read_provider_continuity_record",
      {
        p_tenant_id: scope.tenantId,
        p_provider_domain:
          scope.providerDomain,
        p_record_kind: scope.kind,
        p_record_id: scope.recordId,
      },
    )

    return data === null
      ? null
      : parseRecord<TPayload>(data)
  }

  async acquireLease(
    input: AcquireProviderContinuityLeaseInput,
  ): Promise<AcquireProviderContinuityLeaseResult> {
    const data = await this.call(
      "nexus_acquire_provider_continuity_lease",
      {
        p_tenant_id: input.tenantId,
        p_provider_domain:
          input.providerDomain,
        p_lease_id: input.leaseId,
        p_owner_id: input.ownerId,
        p_ttl_ms: input.ttlMs,
        p_now: toTimestamp(input.now),
      },
    )

    if (!isRecord(data)) {
      throw new Error(
        "invalid acquire lease RPC response",
      )
    }

    if (data.acquired === true) {
      return {
        acquired: true,
        lease: parseLease(data.lease),
      }
    }

    if (
      data.acquired === false &&
      data.code === "LEASE_ALREADY_HELD"
    ) {
      return {
        acquired: false,
        code: "LEASE_ALREADY_HELD",
        activeLease: parseLease(
          data.activeLease,
        ),
      }
    }

    throw new Error(
      "invalid acquire lease RPC response",
    )
  }

  async releaseLease(
    input: ReleaseProviderContinuityLeaseInput,
  ): Promise<boolean> {
    const data = await this.call(
      "nexus_release_provider_continuity_lease",
      {
        p_tenant_id:
          input.lease.tenantId,
        p_provider_domain:
          input.lease.providerDomain,
        p_lease_id:
          input.lease.leaseId,
        p_owner_id:
          input.lease.ownerId,
        p_fence_token:
          input.lease.fenceToken,
        p_now: toTimestamp(input.now),
      },
    )

    if (typeof data !== "boolean") {
      throw new Error(
        "invalid release lease RPC response",
      )
    }

    return data
  }

  async compareAndSwap<
    TPayload extends ProviderContinuityJsonValue,
  >(
    input:
      CompareAndSwapProviderContinuityInput<TPayload>,
  ): Promise<
    CompareAndSwapProviderContinuityResult<TPayload>
  > {
    const data = await this.call(
      "nexus_compare_and_swap_provider_continuity_record",
      {
        p_tenant_id:
          input.scope.tenantId,
        p_provider_domain:
          input.scope.providerDomain,
        p_record_kind:
          input.scope.kind,
        p_record_id:
          input.scope.recordId,
        p_expected_version:
          input.expectedVersion,
        p_payload: input.payload,
        p_lease_id:
          input.lease.leaseId,
        p_owner_id:
          input.lease.ownerId,
        p_fence_token:
          input.lease.fenceToken,
        p_now: toTimestamp(input.now),
      },
    )

    if (!isRecord(data)) {
      throw new Error(
        "invalid compare-and-swap RPC response",
      )
    }

    if (data.applied === true) {
      return {
        applied: true,
        record: parseRecord<TPayload>(
          data.record,
        ),
      }
    }

    if (
      data.applied === false &&
      (
        data.code === "VERSION_CONFLICT" ||
        data.code === "LEASE_INVALID" ||
        data.code === "STALE_FENCE_TOKEN"
      )
    ) {
      return {
        applied: false,
        code: data.code,
        currentRecord:
          data.currentRecord === null
            ? null
            : parseRecord<TPayload>(
                data.currentRecord,
              ),
      }
    }

    throw new Error(
      "invalid compare-and-swap RPC response",
    )
  }

  private async call(
    functionName: string,
    parameters: Record<string, unknown>,
  ): Promise<unknown> {
    const response =
      await this.client.rpc(
        functionName,
        parameters,
      )

    if (response.error) {
      throw new ProviderContinuityStoreRpcError(
        functionName,
        response.error.message,
      )
    }

    return response.data
  }
}

export const createPostgresProviderContinuityStore = (
  client: SupabaseRpcClientLike,
): PostgresProviderContinuityStore =>
  new PostgresProviderContinuityStore(client)
