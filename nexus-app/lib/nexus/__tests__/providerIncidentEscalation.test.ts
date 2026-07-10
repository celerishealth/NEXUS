import { describe, expect, it } from "vitest"

import {
  createProviderIncidentFromTrace,
} from "../providerIncidentCoordinator"
import {
  classifyProviderContinuityIncident,
} from "../providerIncidentClassifier"
import {
  InMemoryProviderIncidentRegistry,
} from "../providerIncidentRegistry"
import {
  InMemoryProviderContinuityTelemetry,
} from "../providerContinuityTelemetry"

const recordSuccessfulTrace = (
  telemetry: InMemoryProviderContinuityTelemetry,
) => {
  telemetry.record({
    eventId: "success-start",
    traceId: "trace-success",
    tenantId: "tenant-a",
    operationId: "operation-success",
    providerDomain: "ai",
    type: "operation-started",
    level: "info",
  })

  telemetry.record({
    eventId: "success-attempt",
    traceId: "trace-success",
    tenantId: "tenant-a",
    operationId: "operation-success",
    providerDomain: "ai",
    type: "provider-attempt-succeeded",
    level: "success",
    providerId: "ai-primary",
  })

  telemetry.record({
    eventId: "success-operation",
    traceId: "trace-success",
    tenantId: "tenant-a",
    operationId: "operation-success",
    providerDomain: "ai",
    type: "operation-succeeded",
    level: "success",
    providerId: "ai-primary",
  })
}

const recordFailedTrace = (
  telemetry: InMemoryProviderContinuityTelemetry,
  providerDomain:
    | "database"
    | "ai"
    | "messaging"
    | "payments",
  traceId: string,
  tenantId: string,
) => {
  telemetry.record({
    eventId: `${traceId}:start`,
    traceId,
    tenantId,
    operationId: `${traceId}:operation`,
    providerDomain,
    type: "operation-started",
    level: "info",
  })

  telemetry.record({
    eventId: `${traceId}:failed`,
    traceId,
    tenantId,
    operationId: `${traceId}:operation`,
    providerDomain,
    type: "provider-attempt-failed",
    level: "failure",
    providerId: `${providerDomain}-primary`,
    reason: "execution-failed",
  })

  telemetry.record({
    eventId: `${traceId}:skipped`,
    traceId,
    tenantId,
    operationId: `${traceId}:operation`,
    providerDomain,
    type: "provider-attempt-skipped",
    level: "warning",
    providerId: `${providerDomain}-fallback`,
    reason: "provider-unavailable",
  })

  telemetry.record({
    eventId: `${traceId}:queued`,
    traceId,
    tenantId,
    operationId: `${traceId}:operation`,
    providerDomain,
    type: "recovery-queued",
    level: "failure",
    reason: "ALL_PROVIDERS_UNAVAILABLE",
    queueItemId: `${traceId}:queue`,
  })
}

describe("provider incident severity and owner escalation", () => {
  it("does not create an incident for a successful trace", () => {
    let now = 100

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )

    recordSuccessfulTrace(telemetry)

    const incident =
      createProviderIncidentFromTrace(
        {
          traceId: "trace-success",
          tenantId: "tenant-a",
        },
        {
          telemetry,
          incidentRegistry:
            new InMemoryProviderIncidentRegistry(
              () => now++,
            ),
        },
      )

    expect(incident).toBeNull()
  })

  it("classifies a messaging interruption as high severity", () => {
    let now = 200

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )

    recordFailedTrace(
      telemetry,
      "messaging",
      "trace-messaging",
      "tenant-a",
    )

    const classification =
      classifyProviderContinuityIncident(
        telemetry.listTraceForTenant(
          "trace-messaging",
          "tenant-a",
        ),
      )

    expect(classification).toMatchObject({
      tenantId: "tenant-a",
      providerDomain: "messaging",
      severity: "high",
      requiresOwnerEscalation: true,
      failedAttempts: 1,
      skippedAttempts: 1,
      queueItemId: "trace-messaging:queue",
    })
  })

  it("classifies database interruption as critical", () => {
    let now = 300

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )

    recordFailedTrace(
      telemetry,
      "database",
      "trace-database",
      "tenant-a",
    )

    const incident =
      createProviderIncidentFromTrace(
        {
          traceId: "trace-database",
          tenantId: "tenant-a",
        },
        {
          telemetry,
          incidentRegistry:
            new InMemoryProviderIncidentRegistry(
              () => now++,
            ),
        },
      )

    expect(incident).toMatchObject({
      providerDomain: "database",
      severity: "critical",
      status: "open",
      requiresOwnerEscalation: true,
    })

    expect(incident?.reasonCodes).toContain(
      "critical-domain-interruption",
    )
  })

  it("requires owner acknowledgement before resolution", () => {
    let now = 400

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )
    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )

    recordFailedTrace(
      telemetry,
      "payments",
      "trace-payments",
      "tenant-a",
    )

    const incident =
      createProviderIncidentFromTrace(
        {
          traceId: "trace-payments",
          tenantId: "tenant-a",
        },
        {
          telemetry,
          incidentRegistry,
        },
      )

    expect(incident).not.toBeNull()

    expect(() =>
      incidentRegistry.resolve({
        incidentId: incident!.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason: "provider restored",
      }),
    ).toThrow(
      "provider incident requires owner acknowledgement before resolution",
    )

    const acknowledged =
      incidentRegistry.acknowledge({
        incidentId: incident!.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason: "incident reviewed",
      })

    expect(acknowledged.status).toBe(
      "owner-acknowledged",
    )

    const resolved = incidentRegistry.resolve({
      incidentId: incident!.incidentId,
      tenantId: "tenant-a",
      ownerId: "owner-a",
      reason: "provider health and replay verified",
    })

    expect(resolved.status).toBe("resolved")
    expect(resolved.resolution?.ownerId).toBe(
      "owner-a",
    )
  })

  it("blocks cross-tenant incident access and actions", () => {
    let now = 500

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )
    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )

    recordFailedTrace(
      telemetry,
      "ai",
      "trace-private",
      "tenant-a",
    )

    const incident =
      createProviderIncidentFromTrace(
        {
          traceId: "trace-private",
          tenantId: "tenant-a",
        },
        {
          telemetry,
          incidentRegistry,
        },
      )

    expect(
      incidentRegistry.getForTenant(
        incident!.incidentId,
        "tenant-b",
      ),
    ).toBeNull()

    expect(() =>
      incidentRegistry.acknowledge({
        incidentId: incident!.incidentId,
        tenantId: "tenant-b",
        ownerId: "owner-b",
        reason: "unauthorized action",
      }),
    ).toThrow(
      "provider incident was not found for tenant",
    )
  })

  it("keeps incident creation idempotent", () => {
    let now = 600

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )
    const incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        () => now++,
      )

    recordFailedTrace(
      telemetry,
      "messaging",
      "trace-idempotent",
      "tenant-a",
    )

    const options = {
      telemetry,
      incidentRegistry,
    }

    const first =
      createProviderIncidentFromTrace(
        {
          traceId: "trace-idempotent",
          tenantId: "tenant-a",
        },
        options,
      )

    const second =
      createProviderIncidentFromTrace(
        {
          traceId: "trace-idempotent",
          tenantId: "tenant-a",
        },
        options,
      )

    expect(second).toEqual(first)
    expect(
      incidentRegistry.listForTenant("tenant-a"),
    ).toHaveLength(1)
  })
})
