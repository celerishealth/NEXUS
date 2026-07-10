import {
  InMemoryProviderIncidentContainmentRegistry,
  type ProviderDomainOperationDecision,
  type ProviderIncidentContainment,
} from "./providerIncidentContainment"
import {
  InMemoryProviderIncidentRegistry,
} from "./providerIncidentRegistry"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export interface ProviderIncidentContainmentOptions {
  incidentRegistry: InMemoryProviderIncidentRegistry
  containmentRegistry:
    InMemoryProviderIncidentContainmentRegistry
}

export const activateProviderIncidentContainment = (
  incidentId: string,
  tenantId: string,
  options: ProviderIncidentContainmentOptions,
): ProviderIncidentContainment | null => {
  const incident =
    options.incidentRegistry.getForTenant(
      incidentId,
      tenantId,
    )

  if (!incident) {
    throw new Error(
      "provider incident was not found for tenant",
    )
  }

  return options.containmentRegistry
    .activateFromIncident(incident)
}

export interface ReleaseResolvedContainmentInput {
  containmentId: string
  incidentId: string
  tenantId: string
  ownerId: string
  reason: string
}

export const releaseResolvedProviderContainment = (
  input: ReleaseResolvedContainmentInput,
  options: ProviderIncidentContainmentOptions,
): ProviderIncidentContainment => {
  const incident =
    options.incidentRegistry.getForTenant(
      input.incidentId,
      input.tenantId,
    )

  if (!incident) {
    throw new Error(
      "provider incident was not found for tenant",
    )
  }

  return options.containmentRegistry.release({
    containmentId: input.containmentId,
    tenantId: input.tenantId,
    ownerId: input.ownerId,
    reason: input.reason,
    resolvedIncident: incident,
  })
}

export const checkProviderDomainOperationPermission = (
  tenantId: string,
  providerDomain: ProviderDomain,
  containmentRegistry:
    InMemoryProviderIncidentContainmentRegistry,
): ProviderDomainOperationDecision =>
  containmentRegistry.evaluateOperation(
    tenantId,
    providerDomain,
  )
