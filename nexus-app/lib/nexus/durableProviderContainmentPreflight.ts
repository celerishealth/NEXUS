import type {
  DurableActiveProviderContainment,
  DurableProviderContainmentReader,
} from "./durableProviderContainmentReader"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export interface DurableContainmentPreflightDecision {
  allowed: boolean
  code:
    | "DURABLE_PROVIDER_DOMAIN_ALLOWED"
    | "DURABLE_PROVIDER_DOMAIN_CONTAINED"
  tenantId: string
  providerDomain: ProviderDomain
  activeContainments:
    DurableActiveProviderContainment[]
}

export type DurableContainmentPreflightResult<T> =
  | {
      outcome: "executed"
      decision:
        DurableContainmentPreflightDecision
      value: T
    }
  | {
      outcome: "blocked"
      decision:
        DurableContainmentPreflightDecision
      value: null
    }

const requireTenantId = (
  tenantId: string,
): string => {
  const normalizedTenantId =
    tenantId.trim()

  if (!normalizedTenantId) {
    throw new Error("tenantId is required")
  }

  return normalizedTenantId
}

export const evaluateDurableProviderContainment =
  async (
    reader:
      DurableProviderContainmentReader,
    tenantId: string,
    providerDomain: ProviderDomain,
  ): Promise<
    DurableContainmentPreflightDecision
  > => {
    const normalizedTenantId =
      requireTenantId(tenantId)

    const activeContainments =
      await reader.listActive(
        normalizedTenantId,
        providerDomain,
      )

    if (activeContainments.length > 0) {
      return {
        allowed: false,
        code:
          "DURABLE_PROVIDER_DOMAIN_CONTAINED",
        tenantId: normalizedTenantId,
        providerDomain,
        activeContainments,
      }
    }

    return {
      allowed: true,
      code: "DURABLE_PROVIDER_DOMAIN_ALLOWED",
      tenantId: normalizedTenantId,
      providerDomain,
      activeContainments: [],
    }
  }

export const executeWithDurableContainmentPreflight =
  async <T>(
    reader:
      DurableProviderContainmentReader,
    input: {
      tenantId: string
      providerDomain: ProviderDomain
    },
    operation: () => Promise<T>,
  ): Promise<
    DurableContainmentPreflightResult<T>
  > => {
    const decision =
      await evaluateDurableProviderContainment(
        reader,
        input.tenantId,
        input.providerDomain,
      )

    if (!decision.allowed) {
      return {
        outcome: "blocked",
        decision,
        value: null,
      }
    }

    const value = await operation()

    return {
      outcome: "executed",
      decision,
      value,
    }
  }
