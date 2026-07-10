import type {
  ProviderIncidentClassification,
  ProviderIncidentReasonCode,
  ProviderIncidentSeverity,
} from "./providerIncidentClassifier"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type ProviderIncidentStatus =
  | "open"
  | "owner-acknowledged"
  | "resolved"

export interface ProviderIncidentOwnerAcknowledgement {
  ownerId: string
  reason: string
  acknowledgedAt: number
}

export interface ProviderIncidentResolution {
  ownerId: string
  reason: string
  resolvedAt: number
}

export interface ProviderContinuityIncident {
  incidentId: string
  traceId: string
  tenantId: string
  operationId: string
  providerDomain: ProviderDomain
  severity: ProviderIncidentSeverity
  status: ProviderIncidentStatus
  requiresOwnerEscalation: boolean
  reasonCodes: ProviderIncidentReasonCode[]
  failedAttempts: number
  skippedAttempts: number
  queueItemId: string | null
  firstObservedAt: number
  lastObservedAt: number
  createdAt: number
  updatedAt: number
  ownerAcknowledgement:
    | ProviderIncidentOwnerAcknowledgement
    | null
  resolution: ProviderIncidentResolution | null
}

export interface ProviderIncidentOwnerActionInput {
  incidentId: string
  tenantId: string
  ownerId: string
  reason: string
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

const cloneIncident = (
  incident: ProviderContinuityIncident,
): ProviderContinuityIncident => ({
  ...incident,
  reasonCodes: [...incident.reasonCodes],
  ownerAcknowledgement:
    incident.ownerAcknowledgement
      ? { ...incident.ownerAcknowledgement }
      : null,
  resolution: incident.resolution
    ? { ...incident.resolution }
    : null,
})

const incidentMatchesClassification = (
  incident: ProviderContinuityIncident,
  classification: ProviderIncidentClassification,
): boolean =>
  incident.traceId === classification.traceId &&
  incident.tenantId === classification.tenantId &&
  incident.operationId ===
    classification.operationId &&
  incident.providerDomain ===
    classification.providerDomain &&
  incident.severity === classification.severity &&
  incident.requiresOwnerEscalation ===
    classification.requiresOwnerEscalation &&
  incident.failedAttempts ===
    classification.failedAttempts &&
  incident.skippedAttempts ===
    classification.skippedAttempts &&
  incident.queueItemId ===
    classification.queueItemId &&
  incident.firstObservedAt ===
    classification.firstObservedAt &&
  incident.lastObservedAt ===
    classification.lastObservedAt &&
  incident.reasonCodes.length ===
    classification.reasonCodes.length &&
  incident.reasonCodes.every(
    (reasonCode, index) =>
      reasonCode ===
      classification.reasonCodes[index],
  )

export class InMemoryProviderIncidentRegistry {
  private readonly incidents =
    new Map<string, ProviderContinuityIncident>()

  constructor(
    private readonly now: () => number = Date.now,
  ) {}

  open(
    incidentId: string,
    classification: ProviderIncidentClassification,
  ): ProviderContinuityIncident {
    const normalizedIncidentId = requireValue(
      incidentId,
      "incidentId",
    )

    const existingIncident =
      this.incidents.get(normalizedIncidentId)

    if (existingIncident) {
      if (
        !incidentMatchesClassification(
          existingIncident,
          classification,
        )
      ) {
        throw new Error(
          "incidentId is already assigned to another provider incident",
        )
      }

      return cloneIncident(existingIncident)
    }

    const createdAt = this.now()

    const incident: ProviderContinuityIncident = {
      incidentId: normalizedIncidentId,
      traceId: classification.traceId,
      tenantId: classification.tenantId,
      operationId: classification.operationId,
      providerDomain:
        classification.providerDomain,
      severity: classification.severity,
      status: "open",
      requiresOwnerEscalation:
        classification.requiresOwnerEscalation,
      reasonCodes: [
        ...classification.reasonCodes,
      ],
      failedAttempts:
        classification.failedAttempts,
      skippedAttempts:
        classification.skippedAttempts,
      queueItemId: classification.queueItemId,
      firstObservedAt:
        classification.firstObservedAt,
      lastObservedAt:
        classification.lastObservedAt,
      createdAt,
      updatedAt: createdAt,
      ownerAcknowledgement: null,
      resolution: null,
    }

    this.incidents.set(
      normalizedIncidentId,
      incident,
    )

    return cloneIncident(incident)
  }

  getForTenant(
    incidentId: string,
    tenantId: string,
  ): ProviderContinuityIncident | null {
    const incident = this.getTenantIncidentOrNull(
      incidentId,
      tenantId,
    )

    return incident
      ? cloneIncident(incident)
      : null
  }

  listForTenant(
    tenantId: string,
  ): ProviderContinuityIncident[] {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    return [...this.incidents.values()]
      .filter(
        (incident) =>
          incident.tenantId === normalizedTenantId,
      )
      .sort((left, right) => {
        if (left.createdAt !== right.createdAt) {
          return left.createdAt - right.createdAt
        }

        return left.incidentId.localeCompare(
          right.incidentId,
        )
      })
      .map(cloneIncident)
  }

  acknowledge(
    input: ProviderIncidentOwnerActionInput,
  ): ProviderContinuityIncident {
    const incident = this.getTenantIncident(
      input.incidentId,
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

    if (incident.status !== "open") {
      throw new Error(
        "only an open provider incident can be acknowledged",
      )
    }

    const acknowledgedAt = this.now()

    incident.status = "owner-acknowledged"
    incident.ownerAcknowledgement = {
      ownerId,
      reason,
      acknowledgedAt,
    }
    incident.updatedAt = acknowledgedAt

    return cloneIncident(incident)
  }

  resolve(
    input: ProviderIncidentOwnerActionInput,
  ): ProviderContinuityIncident {
    const incident = this.getTenantIncident(
      input.incidentId,
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

    if (
      incident.status !== "owner-acknowledged" ||
      !incident.ownerAcknowledgement
    ) {
      throw new Error(
        "provider incident requires owner acknowledgement before resolution",
      )
    }

    const resolvedAt = this.now()

    incident.status = "resolved"
    incident.resolution = {
      ownerId,
      reason,
      resolvedAt,
    }
    incident.updatedAt = resolvedAt

    return cloneIncident(incident)
  }

  private getTenantIncident(
    incidentId: string,
    tenantId: string,
  ): ProviderContinuityIncident {
    const incident = this.getTenantIncidentOrNull(
      incidentId,
      tenantId,
    )

    if (!incident) {
      throw new Error(
        "provider incident was not found for tenant",
      )
    }

    return incident
  }

  private getTenantIncidentOrNull(
    incidentId: string,
    tenantId: string,
  ): ProviderContinuityIncident | null {
    const normalizedIncidentId = requireValue(
      incidentId,
      "incidentId",
    )
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )
    const incident =
      this.incidents.get(normalizedIncidentId)

    if (
      !incident ||
      incident.tenantId !== normalizedTenantId
    ) {
      return null
    }

    return incident
  }
}
