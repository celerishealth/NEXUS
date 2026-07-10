import type {
  ProviderContinuityIncident,
} from "./providerIncidentRegistry"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type ProviderIncidentContainmentStatus =
  | "active"
  | "released"

export interface ProviderIncidentContainmentRelease {
  ownerId: string
  reason: string
  releasedAt: number
}

export interface ProviderIncidentContainment {
  containmentId: string
  tenantId: string
  providerDomain: ProviderDomain
  triggerIncidentId: string
  status: ProviderIncidentContainmentStatus
  reason: "critical-provider-incident"
  activatedAt: number
  updatedAt: number
  release: ProviderIncidentContainmentRelease | null
}

export interface ReleaseProviderIncidentContainmentInput {
  containmentId: string
  tenantId: string
  ownerId: string
  reason: string
  resolvedIncident: ProviderContinuityIncident
}

export interface ProviderDomainOperationDecision {
  allowed: boolean
  code:
    | "PROVIDER_DOMAIN_OPERATION_ALLOWED"
    | "PROVIDER_DOMAIN_CONTAINED"
  tenantId: string
  providerDomain: ProviderDomain
  activeContainmentIds: string[]
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

const cloneContainment = (
  containment: ProviderIncidentContainment,
): ProviderIncidentContainment => ({
  ...containment,
  release: containment.release
    ? { ...containment.release }
    : null,
})

export class InMemoryProviderIncidentContainmentRegistry {
  private readonly containments =
    new Map<string, ProviderIncidentContainment>()

  constructor(
    private readonly now: () => number = Date.now,
  ) {}

  activateFromIncident(
    incident: ProviderContinuityIncident,
  ): ProviderIncidentContainment | null {
    if (
      incident.severity !== "critical" ||
      !incident.requiresOwnerEscalation
    ) {
      return null
    }

    if (incident.status === "resolved") {
      throw new Error(
        "resolved provider incident cannot activate containment",
      )
    }

    const containmentId = [
      incident.tenantId,
      incident.incidentId,
      "provider-containment",
    ].join(":")

    const existingContainment =
      this.containments.get(containmentId)

    if (existingContainment) {
      return cloneContainment(existingContainment)
    }

    const activatedAt = this.now()

    const containment: ProviderIncidentContainment = {
      containmentId,
      tenantId: incident.tenantId,
      providerDomain: incident.providerDomain,
      triggerIncidentId: incident.incidentId,
      status: "active",
      reason: "critical-provider-incident",
      activatedAt,
      updatedAt: activatedAt,
      release: null,
    }

    this.containments.set(
      containmentId,
      containment,
    )

    return cloneContainment(containment)
  }

  getForTenant(
    containmentId: string,
    tenantId: string,
  ): ProviderIncidentContainment | null {
    const containment =
      this.getTenantContainmentOrNull(
        containmentId,
        tenantId,
      )

    return containment
      ? cloneContainment(containment)
      : null
  }

  listForTenant(
    tenantId: string,
  ): ProviderIncidentContainment[] {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    return [...this.containments.values()]
      .filter(
        (containment) =>
          containment.tenantId ===
          normalizedTenantId,
      )
      .sort((left, right) => {
        if (left.activatedAt !== right.activatedAt) {
          return left.activatedAt - right.activatedAt
        }

        return left.containmentId.localeCompare(
          right.containmentId,
        )
      })
      .map(cloneContainment)
  }

  listActiveForScope(
    tenantId: string,
    providerDomain: ProviderDomain,
  ): ProviderIncidentContainment[] {
    return this.listForTenant(tenantId).filter(
      (containment) =>
        containment.providerDomain ===
          providerDomain &&
        containment.status === "active",
    )
  }

  evaluateOperation(
    tenantId: string,
    providerDomain: ProviderDomain,
  ): ProviderDomainOperationDecision {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    const activeContainments =
      this.listActiveForScope(
        normalizedTenantId,
        providerDomain,
      )

    if (activeContainments.length > 0) {
      return {
        allowed: false,
        code: "PROVIDER_DOMAIN_CONTAINED",
        tenantId: normalizedTenantId,
        providerDomain,
        activeContainmentIds:
          activeContainments.map(
            (containment) =>
              containment.containmentId,
          ),
      }
    }

    return {
      allowed: true,
      code: "PROVIDER_DOMAIN_OPERATION_ALLOWED",
      tenantId: normalizedTenantId,
      providerDomain,
      activeContainmentIds: [],
    }
  }

  release(
    input: ReleaseProviderIncidentContainmentInput,
  ): ProviderIncidentContainment {
    const containment =
      this.getTenantContainment(
        input.containmentId,
        input.tenantId,
      )

    const ownerId = requireValue(
      input.ownerId,
      "ownerId",
    )
    const reason = requireValue(
      input.reason,
      "reason",
    )

    if (containment.status !== "active") {
      throw new Error(
        "only an active provider containment can be released",
      )
    }

    if (
      input.resolvedIncident.incidentId !==
        containment.triggerIncidentId ||
      input.resolvedIncident.tenantId !==
        containment.tenantId ||
      input.resolvedIncident.providerDomain !==
        containment.providerDomain
    ) {
      throw new Error(
        "resolved provider incident does not match containment",
      )
    }

    if (input.resolvedIncident.status !== "resolved") {
      throw new Error(
        "provider incident must be owner-acknowledged and resolved before containment release",
      )
    }

    const releasedAt = this.now()

    containment.status = "released"
    containment.updatedAt = releasedAt
    containment.release = {
      ownerId,
      reason,
      releasedAt,
    }

    return cloneContainment(containment)
  }

  private getTenantContainment(
    containmentId: string,
    tenantId: string,
  ): ProviderIncidentContainment {
    const containment =
      this.getTenantContainmentOrNull(
        containmentId,
        tenantId,
      )

    if (!containment) {
      throw new Error(
        "provider containment was not found for tenant",
      )
    }

    return containment
  }

  private getTenantContainmentOrNull(
    containmentId: string,
    tenantId: string,
  ): ProviderIncidentContainment | null {
    const normalizedContainmentId = requireValue(
      containmentId,
      "containmentId",
    )
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    const containment =
      this.containments.get(
        normalizedContainmentId,
      )

    if (
      !containment ||
      containment.tenantId !== normalizedTenantId
    ) {
      return null
    }

    return containment
  }
}
