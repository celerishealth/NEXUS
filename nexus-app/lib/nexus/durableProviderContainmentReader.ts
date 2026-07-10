import type {
  ProviderDomain,
} from "./providerRecoveryQueue"
import type {
  SupabaseRpcClientLike,
} from "./postgresProviderContinuityStore"

export interface DurableActiveProviderContainment {
  containmentId: string
  tenantId: string
  providerDomain: ProviderDomain
  status: "active"
  version: number
  updatedAt: number
  lastFenceToken: number
}

export interface DurableProviderContainmentReader {
  listActive(
    tenantId: string,
    providerDomain: ProviderDomain,
  ): Promise<DurableActiveProviderContainment[]>
}

export type DurableContainmentReadErrorCode =
  | "ACTIVE_CONTAINMENT_RPC_FAILED"
  | "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE"
  | "ACTIVE_CONTAINMENT_SCOPE_MISMATCH"

export class DurableContainmentReadError
  extends Error
{
  constructor(
    readonly code:
      DurableContainmentReadErrorCode,
    message: string,
  ) {
    super(message)
    this.name =
      "DurableContainmentReadError"
  }
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
    throw new DurableContainmentReadError(
      "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
      `invalid active containment field: ${fieldName}`,
    )
  }

  return value
}

const readPositiveInteger = (
  value: unknown,
  fieldName: string,
): number => {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 1
  ) {
    throw new DurableContainmentReadError(
      "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
      `invalid active containment field: ${fieldName}`,
    )
  }

  return value
}

const readTimestamp = (
  value: unknown,
  fieldName: string,
): number => {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new DurableContainmentReadError(
      "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
      `invalid active containment field: ${fieldName}`,
    )
  }

  return value
}

export class PostgresDurableProviderContainmentReader
  implements DurableProviderContainmentReader
{
  constructor(
    private readonly client:
      SupabaseRpcClientLike,
  ) {}

  async listActive(
    tenantId: string,
    providerDomain: ProviderDomain,
  ): Promise<DurableActiveProviderContainment[]> {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    const response = await this.client.rpc(
      "nexus_list_active_provider_containments",
      {
        p_tenant_id: normalizedTenantId,
        p_provider_domain: providerDomain,
      },
    )

    if (response.error) {
      throw new DurableContainmentReadError(
        "ACTIVE_CONTAINMENT_RPC_FAILED",
        `active provider containment RPC failed: ${response.error.message}`,
      )
    }

    if (!Array.isArray(response.data)) {
      throw new DurableContainmentReadError(
        "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
        "active provider containment RPC returned a non-array response",
      )
    }

    return response.data.map(
      (value, index) => {
        if (!isRecord(value)) {
          throw new DurableContainmentReadError(
            "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
            `invalid active containment record at index ${index}`,
          )
        }

        const containment: DurableActiveProviderContainment =
          {
            containmentId: readString(
              value.containmentId,
              `${index}.containmentId`,
            ),
            tenantId: readString(
              value.tenantId,
              `${index}.tenantId`,
            ),
            providerDomain: readString(
              value.providerDomain,
              `${index}.providerDomain`,
            ) as ProviderDomain,
            status: readString(
              value.status,
              `${index}.status`,
            ) as "active",
            version: readPositiveInteger(
              value.version,
              `${index}.version`,
            ),
            updatedAt: readTimestamp(
              value.updatedAt,
              `${index}.updatedAt`,
            ),
            lastFenceToken:
              readPositiveInteger(
                value.lastFenceToken,
                `${index}.lastFenceToken`,
              ),
          }

        if (containment.status !== "active") {
          throw new DurableContainmentReadError(
            "MALFORMED_ACTIVE_CONTAINMENT_RESPONSE",
            `invalid active containment status at index ${index}`,
          )
        }

        if (
          containment.tenantId !==
            normalizedTenantId ||
          containment.providerDomain !==
            providerDomain
        ) {
          throw new DurableContainmentReadError(
            "ACTIVE_CONTAINMENT_SCOPE_MISMATCH",
            "active provider containment response crossed its requested tenant or provider-domain scope",
          )
        }

        return containment
      },
    )
  }
}

export const createPostgresDurableProviderContainmentReader =
  (
    client: SupabaseRpcClientLike,
  ): PostgresDurableProviderContainmentReader =>
    new PostgresDurableProviderContainmentReader(
      client,
    )
