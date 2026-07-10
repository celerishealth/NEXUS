import { describe, expect, it } from "vitest"

import {
  executeContainmentEnforcedProviderOperation,
} from "../containmentEnforcedProviderCoordinator"
import {
  InMemoryProviderCircuitBreaker,
} from "../providerCircuitBreaker"
import {
  InMemoryProviderContinuityTelemetry,
} from "../providerContinuityTelemetry"
import {
  InMemoryProviderIncidentContainmentRegistry,
} from "../providerIncidentContainment"
import {
  activateProviderIncidentContainment,
  checkProviderDomainOperationPermission,
} from "../providerIncidentContainmentCoordinator"
import {
  InMemoryProviderIncidentRegistry,
} from "../providerIncidentRegistry"
import {
  InMemoryProviderRecoveryQueue,
} from "../providerRecoveryQueue"

const createCircuitBreaker = () =>
  new InMemoryProviderCircuitBreaker({
    failureThreshold: 2,
    recoveryTimeoutMs: 1_000,
    halfOpenSuccessThreshold: 1,
  })

const createRuntime = () => {
  let now = 100

  return {
    nextNow: () => now++,
    circuitBreaker: createCircuitBreaker(),
    telemetry:
      new InMemoryProviderContinuityTelemetry(
        () => now++,
      ),
    recoveryQueue:
      new InMemoryProviderRecoveryQueue(
        () => now++,
      ),
    incidentRegistry:
      new InMemoryProviderIncidentRegistry(
        () => now++,
      ),
    containmentRegistry:
      new InMemoryProviderIncidentContainmentRegistry(
        () => now++,
      ),
  }
}

const openCriticalIncident = (
  runtime: ReturnType<typeof createRuntime>,
  input: {
    incidentId: string
    tenantId: string
    providerDomain: "database" | "payments"
  },
) =>
  runtime.incidentRegistry.open(
    input.incidentId,
    {
      traceId: `${input.incidentId}:trace`,
      tenantId: input.tenantId,
      operationId: `${input.incidentId}:operation`,
      providerDomain: input.providerDomain,
      severity: "critical",
      requiresOwnerEscalation: true,
      reasonCodes: [
        "all-providers-unavailable",
        "critical-domain-interruption",
      ],
      failedAttempts: 1,
      skippedAttempts: 1,
      queueItemId: `${input.incidentId}:queue`,
      firstObservedAt: 10,
      lastObservedAt: 20,
    },
  )

describe(
  "containment-enforced provider execution coordinator",
  () => {
    it("executes an allowed provider operation", async () => {
      const runtime = createRuntime()

      const result =
        await executeContainmentEnforcedProviderOperation(
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
            circuitBreaker:
              runtime.circuitBreaker,
            recoveryQueue:
              runtime.recoveryQueue,
            telemetry: runtime.telemetry,
            incidentRegistry:
              runtime.incidentRegistry,
            containmentRegistry:
              runtime.containmentRegistry,
          },
        )

      expect(result.outcome).toBe("executed")

      if (result.outcome === "executed") {
        expect(result.decision.allowed).toBe(true)
        expect(result.continuity.execution.ok).toBe(
          true,
        )
        expect(result.incident).toBeNull()
        expect(result.containment).toBeNull()
      }
    })

    it("blocks execution when tenant domain containment is active", async () => {
      const runtime = createRuntime()

      const incident = openCriticalIncident(
        runtime,
        {
          incidentId: "existing-database-incident",
          tenantId: "tenant-a",
          providerDomain: "database",
        },
      )

      const containment =
        activateProviderIncidentContainment(
          incident.incidentId,
          "tenant-a",
          {
            incidentRegistry:
              runtime.incidentRegistry,
            containmentRegistry:
              runtime.containmentRegistry,
          },
        )

      let providerExecuted = false

      const result =
        await executeContainmentEnforcedProviderOperation(
          {
            queueItemId: "queue-blocked",
            operationId: "operation-blocked",
            tenantId: "tenant-a",
            providerDomain: "database",
            candidates: [
              {
                id: "database-primary",
                priority: 1,
                health: "healthy",
                approvedForFallback: false,
                execute: async () => {
                  providerExecuted = true
                  return "unsafe-result"
                },
              },
            ],
          },
          {
            traceId: "trace-blocked",
            timeoutMs: 100,
            circuitBreaker:
              runtime.circuitBreaker,
            recoveryQueue:
              runtime.recoveryQueue,
            telemetry: runtime.telemetry,
            incidentRegistry:
              runtime.incidentRegistry,
            containmentRegistry:
              runtime.containmentRegistry,
          },
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        decision: {
          allowed: false,
          code: "PROVIDER_DOMAIN_CONTAINED",
          activeContainmentIds: [
            containment!.containmentId,
          ],
        },
      })

      expect(providerExecuted).toBe(false)

      expect(
        runtime.telemetry.listTraceForTenant(
          "trace-blocked",
          "tenant-a",
        ),
      ).toEqual([])
    })

    it("automatically creates critical incident and containment after database failure", async () => {
      const runtime = createRuntime()

      const result =
        await executeContainmentEnforcedProviderOperation(
          {
            queueItemId:
              "queue-database-failure",
            operationId:
              "operation-database-failure",
            tenantId: "tenant-a",
            providerDomain: "database",
            candidates: [
              {
                id: "database-primary",
                priority: 1,
                health: "healthy",
                approvedForFallback: false,
                execute: async () => {
                  throw new Error(
                    "database provider unavailable",
                  )
                },
              },
              {
                id: "database-fallback",
                priority: 2,
                health: "unavailable",
                approvedForFallback: true,
                execute: async () =>
                  "must-not-run",
              },
            ],
          },
          {
            traceId: "trace-database-failure",
            timeoutMs: 100,
            circuitBreaker:
              runtime.circuitBreaker,
            recoveryQueue:
              runtime.recoveryQueue,
            telemetry: runtime.telemetry,
            incidentRegistry:
              runtime.incidentRegistry,
            containmentRegistry:
              runtime.containmentRegistry,
          },
        )

      expect(result.outcome).toBe("executed")

      if (result.outcome === "executed") {
        expect(
          result.continuity.execution.ok,
        ).toBe(false)

        expect(result.incident).toMatchObject({
          tenantId: "tenant-a",
          providerDomain: "database",
          severity: "critical",
          status: "open",
        })

        expect(result.containment).toMatchObject({
          tenantId: "tenant-a",
          providerDomain: "database",
          status: "active",
        })
      }

      expect(
        checkProviderDomainOperationPermission(
          "tenant-a",
          "database",
          runtime.containmentRegistry,
        ),
      ).toMatchObject({
        allowed: false,
        code: "PROVIDER_DOMAIN_CONTAINED",
      })
    })

    it("creates a high messaging incident without containment", async () => {
      const runtime = createRuntime()

      const result =
        await executeContainmentEnforcedProviderOperation(
          {
            queueItemId:
              "queue-messaging-failure",
            operationId:
              "operation-messaging-failure",
            tenantId: "tenant-a",
            providerDomain: "messaging",
            candidates: [
              {
                id: "messaging-primary",
                priority: 1,
                health: "healthy",
                approvedForFallback: false,
                execute: async () => {
                  throw new Error(
                    "messaging provider unavailable",
                  )
                },
              },
              {
                id: "messaging-fallback",
                priority: 2,
                health: "unavailable",
                approvedForFallback: true,
                execute: async () =>
                  "must-not-run",
              },
            ],
          },
          {
            traceId:
              "trace-messaging-failure",
            timeoutMs: 100,
            circuitBreaker:
              runtime.circuitBreaker,
            recoveryQueue:
              runtime.recoveryQueue,
            telemetry: runtime.telemetry,
            incidentRegistry:
              runtime.incidentRegistry,
            containmentRegistry:
              runtime.containmentRegistry,
          },
        )

      expect(result.outcome).toBe("executed")

      if (result.outcome === "executed") {
        expect(result.incident).toMatchObject({
          providerDomain: "messaging",
          severity: "high",
          status: "open",
        })

        expect(result.containment).toBeNull()
      }

      expect(
        checkProviderDomainOperationPermission(
          "tenant-a",
          "messaging",
          runtime.containmentRegistry,
        ).allowed,
      ).toBe(true)
    })

    it("keeps execution containment tenant-isolated", async () => {
      const runtime = createRuntime()

      const incident = openCriticalIncident(
        runtime,
        {
          incidentId: "tenant-a-payment-incident",
          tenantId: "tenant-a",
          providerDomain: "payments",
        },
      )

      activateProviderIncidentContainment(
        incident.incidentId,
        "tenant-a",
        {
          incidentRegistry:
            runtime.incidentRegistry,
          containmentRegistry:
            runtime.containmentRegistry,
        },
      )

      let tenantBExecutionCount = 0

      const result =
        await executeContainmentEnforcedProviderOperation(
          {
            queueItemId: "tenant-b-queue",
            operationId:
              "tenant-b-payment-operation",
            tenantId: "tenant-b",
            providerDomain: "payments",
            candidates: [
              {
                id: "payments-primary",
                priority: 1,
                health: "healthy",
                approvedForFallback: false,
                execute: async () => {
                  tenantBExecutionCount += 1
                  return "tenant-b-safe-result"
                },
              },
            ],
          },
          {
            traceId: "tenant-b-trace",
            timeoutMs: 100,
            circuitBreaker:
              runtime.circuitBreaker,
            recoveryQueue:
              runtime.recoveryQueue,
            telemetry: runtime.telemetry,
            incidentRegistry:
              runtime.incidentRegistry,
            containmentRegistry:
              runtime.containmentRegistry,
          },
        )

      expect(result.outcome).toBe("executed")
      expect(tenantBExecutionCount).toBe(1)

      expect(
        checkProviderDomainOperationPermission(
          "tenant-a",
          "payments",
          runtime.containmentRegistry,
        ).allowed,
      ).toBe(false)

      expect(
        checkProviderDomainOperationPermission(
          "tenant-b",
          "payments",
          runtime.containmentRegistry,
        ).allowed,
      ).toBe(true)
    })

    it("does not create duplicate containment for the same critical trace", async () => {
      const runtime = createRuntime()

      const options = {
        traceId: "trace-idempotent-critical",
        timeoutMs: 100,
        circuitBreaker:
          runtime.circuitBreaker,
        recoveryQueue:
          runtime.recoveryQueue,
        telemetry: runtime.telemetry,
        incidentRegistry:
          runtime.incidentRegistry,
        containmentRegistry:
          runtime.containmentRegistry,
      }

      const operation = {
        queueItemId:
          "queue-idempotent-critical",
        operationId:
          "operation-idempotent-critical",
        tenantId: "tenant-a",
        providerDomain: "database" as const,
        candidates: [
          {
            id: "database-primary",
            priority: 1,
            health: "unavailable" as const,
            approvedForFallback: false,
            execute: async () =>
              "must-not-run",
          },
        ],
      }

      const first =
        await executeContainmentEnforcedProviderOperation(
          operation,
          options,
        )

      expect(first.outcome).toBe("executed")

      const second =
        await executeContainmentEnforcedProviderOperation(
          operation,
          options,
        )

      expect(second.outcome).toBe("blocked")

      expect(
        runtime.containmentRegistry.listForTenant(
          "tenant-a",
        ),
      ).toHaveLength(1)
    })
  },
)
