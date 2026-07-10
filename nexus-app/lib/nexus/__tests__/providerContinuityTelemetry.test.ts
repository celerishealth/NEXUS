import { describe, expect, it } from "vitest"

import { InMemoryProviderCircuitBreaker } from "../providerCircuitBreaker"
import { InMemoryProviderContinuityTelemetry } from "../providerContinuityTelemetry"
import { InMemoryProviderRecoveryQueue } from "../providerRecoveryQueue"
import { executeObservedProviderOperation } from "../observedProviderContinuityCoordinator"

const createCircuitBreaker = () =>
  new InMemoryProviderCircuitBreaker({
    failureThreshold: 2,
    recoveryTimeoutMs: 1_000,
    halfOpenSuccessThreshold: 1,
  })

describe("provider continuity telemetry", () => {
  it("records a successful provider continuity timeline", async () => {
    let now = 100

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )

    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(
        () => now++,
      )

    const result =
      await executeObservedProviderOperation(
        {
          queueItemId: "queue-success",
          operationId: "operation-success",
          tenantId: "tenant-a",
          providerDomain: "ai",
          candidates: [
            {
              id: "ai-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => "safe-result",
            },
          ],
        },
        {
          traceId: "trace-success",
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          telemetry,
        },
      )

    expect(result.execution.ok).toBe(true)

    const timeline = telemetry.listTraceForTenant(
      "trace-success",
      "tenant-a",
    )

    expect(
      timeline.map((event) => event.type),
    ).toEqual([
      "operation-started",
      "provider-attempt-succeeded",
      "operation-succeeded",
    ])

    expect(
      telemetry.getSnapshotForTenant("tenant-a"),
    ).toMatchObject({
      tenantId: "tenant-a",
      totalEvents: 3,
      successfulAttempts: 1,
      failedAttempts: 0,
      skippedAttempts: 0,
      successfulOperations: 1,
      queuedRecoveries: 0,
    })
  })

  it("records failed attempts and queued recovery", async () => {
    let now = 200

    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      )

    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(
        () => now++,
      )

    const result =
      await executeObservedProviderOperation(
        {
          queueItemId: "queue-failure",
          operationId: "operation-failure",
          tenantId: "tenant-a",
          providerDomain: "messaging",
          candidates: [
            {
              id: "messaging-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => {
                throw new Error("provider failure")
              },
            },
            {
              id: "messaging-fallback",
              priority: 2,
              health: "unavailable",
              approvedForFallback: true,
              execute: async () => "must-not-run",
            },
          ],
        },
        {
          traceId: "trace-failure",
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          telemetry,
        },
      )

    expect(result.execution.ok).toBe(false)
    expect(result.queuedRecovery?.status).toBe(
      "pending-owner-approval",
    )

    const snapshot =
      telemetry.getSnapshotForTenant("tenant-a")

    expect(snapshot).toMatchObject({
      totalEvents: 4,
      successfulAttempts: 0,
      failedAttempts: 1,
      skippedAttempts: 1,
      successfulOperations: 0,
      queuedRecoveries: 1,
    })
  })

  it("keeps provider telemetry tenant-isolated", async () => {
    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => 300,
      )

    telemetry.record({
      eventId: "tenant-a-event",
      traceId: "trace-a",
      tenantId: "tenant-a",
      operationId: "operation-a",
      providerDomain: "database",
      type: "operation-started",
      level: "info",
    })

    telemetry.record({
      eventId: "tenant-b-event",
      traceId: "trace-b",
      tenantId: "tenant-b",
      operationId: "operation-b",
      providerDomain: "payments",
      type: "operation-started",
      level: "info",
    })

    expect(
      telemetry.listForTenant("tenant-a"),
    ).toHaveLength(1)

    expect(
      telemetry.listForTenant("tenant-a")[0]
        .eventId,
    ).toBe("tenant-a-event")

    expect(
      telemetry.listTraceForTenant(
        "trace-b",
        "tenant-a",
      ),
    ).toEqual([])
  })

  it("returns immutable event copies", () => {
    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => 400,
      )

    telemetry.record({
      eventId: "immutable-event",
      traceId: "immutable-trace",
      tenantId: "tenant-a",
      operationId: "operation-a",
      providerDomain: "ai",
      type: "operation-started",
      level: "info",
    })

    const first =
      telemetry.listForTenant("tenant-a")

    first[0].reason = "tampered"

    const second =
      telemetry.listForTenant("tenant-a")

    expect(second[0].reason).toBeNull()
  })

  it("blocks event id reuse across different events", () => {
    const telemetry =
      new InMemoryProviderContinuityTelemetry(
        () => 500,
      )

    telemetry.record({
      eventId: "shared-event-id",
      traceId: "trace-a",
      tenantId: "tenant-a",
      operationId: "operation-a",
      providerDomain: "database",
      type: "operation-started",
      level: "info",
    })

    expect(() =>
      telemetry.record({
        eventId: "shared-event-id",
        traceId: "trace-b",
        tenantId: "tenant-b",
        operationId: "operation-b",
        providerDomain: "payments",
        type: "recovery-queued",
        level: "failure",
      }),
    ).toThrow(
      "eventId is already assigned to another continuity event",
    )
  })
})
