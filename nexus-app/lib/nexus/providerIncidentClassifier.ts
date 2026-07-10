import type {
  ProviderContinuityEvent,
} from "./providerContinuityTelemetry"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type ProviderIncidentSeverity =
  | "medium"
  | "high"
  | "critical"

export type ProviderIncidentReasonCode =
  | "provider-execution-failed"
  | "provider-execution-skipped"
  | "all-providers-unavailable"
  | "critical-domain-interruption"
  | "multiple-provider-failures"

export interface ProviderIncidentClassification {
  traceId: string
  tenantId: string
  operationId: string
  providerDomain: ProviderDomain
  severity: ProviderIncidentSeverity
  requiresOwnerEscalation: boolean
  reasonCodes: ProviderIncidentReasonCode[]
  failedAttempts: number
  skippedAttempts: number
  queueItemId: string | null
  firstObservedAt: number
  lastObservedAt: number
}

const criticalDomains = new Set<ProviderDomain>([
  "database",
  "payments",
])

const requireSingleValue = (
  values: string[],
  fieldName: string,
): string => {
  const uniqueValues = [...new Set(values)]

  if (uniqueValues.length !== 1) {
    throw new Error(
      `continuity trace must contain exactly one ${fieldName}`,
    )
  }

  return uniqueValues[0]
}

export const classifyProviderContinuityIncident = (
  events: ProviderContinuityEvent[],
): ProviderIncidentClassification | null => {
  if (events.length === 0) {
    return null
  }

  const orderedEvents = [...events].sort(
    (left, right) => {
      if (left.occurredAt !== right.occurredAt) {
        return left.occurredAt - right.occurredAt
      }

      return left.eventId.localeCompare(right.eventId)
    },
  )

  const traceId = requireSingleValue(
    orderedEvents.map((event) => event.traceId),
    "traceId",
  )
  const tenantId = requireSingleValue(
    orderedEvents.map((event) => event.tenantId),
    "tenantId",
  )
  const operationId = requireSingleValue(
    orderedEvents.map((event) => event.operationId),
    "operationId",
  )
  const providerDomain = requireSingleValue(
    orderedEvents.map(
      (event) => event.providerDomain,
    ),
    "providerDomain",
  ) as ProviderDomain

  const recoveryEvent = orderedEvents.find(
    (event) => event.type === "recovery-queued",
  )

  if (!recoveryEvent) {
    return null
  }

  const failedAttempts = orderedEvents.filter(
    (event) =>
      event.type === "provider-attempt-failed",
  ).length

  const skippedAttempts = orderedEvents.filter(
    (event) =>
      event.type === "provider-attempt-skipped",
  ).length

  const reasonCodes: ProviderIncidentReasonCode[] = [
    "all-providers-unavailable",
  ]

  if (failedAttempts > 0) {
    reasonCodes.push("provider-execution-failed")
  }

  if (skippedAttempts > 0) {
    reasonCodes.push("provider-execution-skipped")
  }

  if (failedAttempts > 1) {
    reasonCodes.push("multiple-provider-failures")
  }

  if (criticalDomains.has(providerDomain)) {
    reasonCodes.push("critical-domain-interruption")
  }

  let severity: ProviderIncidentSeverity = "medium"

  if (
    failedAttempts > 1 ||
    criticalDomains.has(providerDomain)
  ) {
    severity = "critical"
  } else if (
    failedAttempts === 1 ||
    skippedAttempts > 1
  ) {
    severity = "high"
  }

  return {
    traceId,
    tenantId,
    operationId,
    providerDomain,
    severity,
    requiresOwnerEscalation:
      severity === "high" ||
      severity === "critical",
    reasonCodes,
    failedAttempts,
    skippedAttempts,
    queueItemId: recoveryEvent.queueItemId,
    firstObservedAt: orderedEvents[0].occurredAt,
    lastObservedAt:
      orderedEvents[orderedEvents.length - 1]
        .occurredAt,
  }
}
