import {
  classifyProviderContinuityIncident,
} from "./providerIncidentClassifier"
import {
  InMemoryProviderIncidentRegistry,
  type ProviderContinuityIncident,
} from "./providerIncidentRegistry"
import {
  InMemoryProviderContinuityTelemetry,
} from "./providerContinuityTelemetry"

export interface CreateProviderIncidentInput {
  traceId: string
  tenantId: string
}

export interface CreateProviderIncidentOptions {
  telemetry: InMemoryProviderContinuityTelemetry
  incidentRegistry:
    InMemoryProviderIncidentRegistry
}

export const createProviderIncidentFromTrace = (
  input: CreateProviderIncidentInput,
  options: CreateProviderIncidentOptions,
): ProviderContinuityIncident | null => {
  const events =
    options.telemetry.listTraceForTenant(
      input.traceId,
      input.tenantId,
    )

  const classification =
    classifyProviderContinuityIncident(events)

  if (!classification) {
    return null
  }

  const incidentId = [
    classification.tenantId,
    classification.traceId,
    "provider-continuity-incident",
  ].join(":")

  return options.incidentRegistry.open(
    incidentId,
    classification,
  )
}
