import type { ProviderDomain } from "./providerRecoveryQueue"

export type ProviderContinuityEventType =
  | "operation-started"
  | "provider-attempt-succeeded"
  | "provider-attempt-failed"
  | "provider-attempt-skipped"
  | "operation-succeeded"
  | "recovery-queued"

export type ProviderContinuityEventLevel =
  | "info"
  | "success"
  | "warning"
  | "failure"

export interface ProviderContinuityEvent {
  eventId: string
  traceId: string
  tenantId: string
  operationId: string
  providerDomain: ProviderDomain
  type: ProviderContinuityEventType
  level: ProviderContinuityEventLevel
  providerId: string | null
  reason: string | null
  queueItemId: string | null
  occurredAt: number
}

export interface RecordProviderContinuityEventInput {
  eventId: string
  traceId: string
  tenantId: string
  operationId: string
  providerDomain: ProviderDomain
  type: ProviderContinuityEventType
  level: ProviderContinuityEventLevel
  providerId?: string | null
  reason?: string | null
  queueItemId?: string | null
}

export interface ProviderContinuityTelemetrySnapshot {
  tenantId: string
  totalEvents: number
  successfulAttempts: number
  failedAttempts: number
  skippedAttempts: number
  successfulOperations: number
  queuedRecoveries: number
  lastEventAt: number | null
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

const cloneEvent = (
  event: ProviderContinuityEvent,
): ProviderContinuityEvent => ({ ...event })

const eventsMatch = (
  left: ProviderContinuityEvent,
  right: ProviderContinuityEvent,
): boolean =>
  left.eventId === right.eventId &&
  left.traceId === right.traceId &&
  left.tenantId === right.tenantId &&
  left.operationId === right.operationId &&
  left.providerDomain === right.providerDomain &&
  left.type === right.type &&
  left.level === right.level &&
  left.providerId === right.providerId &&
  left.reason === right.reason &&
  left.queueItemId === right.queueItemId

export class InMemoryProviderContinuityTelemetry {
  private readonly events =
    new Map<string, ProviderContinuityEvent>()

  constructor(
    private readonly now: () => number = Date.now,
  ) {}

  record(
    input: RecordProviderContinuityEventInput,
  ): ProviderContinuityEvent {
    const eventId = requireValue(
      input.eventId,
      "eventId",
    )
    const traceId = requireValue(
      input.traceId,
      "traceId",
    )
    const tenantId = requireValue(
      input.tenantId,
      "tenantId",
    )
    const operationId = requireValue(
      input.operationId,
      "operationId",
    )

    const event: ProviderContinuityEvent = {
      eventId,
      traceId,
      tenantId,
      operationId,
      providerDomain: input.providerDomain,
      type: input.type,
      level: input.level,
      providerId: input.providerId?.trim() || null,
      reason: input.reason?.trim() || null,
      queueItemId: input.queueItemId?.trim() || null,
      occurredAt: this.now(),
    }

    const existingEvent = this.events.get(eventId)

    if (existingEvent) {
      if (!eventsMatch(existingEvent, event)) {
        throw new Error(
          "eventId is already assigned to another continuity event",
        )
      }

      return cloneEvent(existingEvent)
    }

    this.events.set(eventId, event)

    return cloneEvent(event)
  }

  listForTenant(
    tenantId: string,
  ): ProviderContinuityEvent[] {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    return [...this.events.values()]
      .filter(
        (event) =>
          event.tenantId === normalizedTenantId,
      )
      .sort((left, right) => {
        if (left.occurredAt !== right.occurredAt) {
          return left.occurredAt - right.occurredAt
        }

        return left.eventId.localeCompare(
          right.eventId,
        )
      })
      .map(cloneEvent)
  }

  listTraceForTenant(
    traceId: string,
    tenantId: string,
  ): ProviderContinuityEvent[] {
    const normalizedTraceId = requireValue(
      traceId,
      "traceId",
    )

    return this.listForTenant(tenantId).filter(
      (event) => event.traceId === normalizedTraceId,
    )
  }

  getSnapshotForTenant(
    tenantId: string,
  ): ProviderContinuityTelemetrySnapshot {
    const events = this.listForTenant(tenantId)

    return {
      tenantId: requireValue(tenantId, "tenantId"),
      totalEvents: events.length,
      successfulAttempts: events.filter(
        (event) =>
          event.type === "provider-attempt-succeeded",
      ).length,
      failedAttempts: events.filter(
        (event) =>
          event.type === "provider-attempt-failed",
      ).length,
      skippedAttempts: events.filter(
        (event) =>
          event.type === "provider-attempt-skipped",
      ).length,
      successfulOperations: events.filter(
        (event) =>
          event.type === "operation-succeeded",
      ).length,
      queuedRecoveries: events.filter(
        (event) => event.type === "recovery-queued",
      ).length,
      lastEventAt:
        events.length > 0
          ? events[events.length - 1].occurredAt
          : null,
    }
  }
}
