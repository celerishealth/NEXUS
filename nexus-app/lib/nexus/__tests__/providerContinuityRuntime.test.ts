import { describe, expect, it } from "vitest"

import {
  createInMemoryProviderContinuityRuntime,
} from "../providerContinuityRuntime"

const createRuntime = () => {
  let now = 100

  return createInMemoryProviderContinuityRuntime({
    mode: "test",
    environment: "test",
    defaultTimeoutMs: 100,
    now: () => now++,
    circuitBreakerPolicy: {
      failureThreshold: 2,
      recoveryTimeoutMs: 1_000,
      halfOpenSuccessThreshold: 1,
    },
  })
}

describe(
  "provider continuity runtime composition",
  () => {
    it("hard-blocks explicit production runtime mode", () => {
      expect(() =>
        createInMemoryProviderContinuityRuntime({
          mode: "production",
          environment: "test",
        }),
      ).toThrow(
        "in-memory provider continuity runtime is forbidden in production; durable continuity storage is required",
      )
    })

    it("hard-blocks in-memory runtime inside production environment", () => {
      expect(() =>
        createInMemoryProviderContinuityRuntime({
          mode: "preview",
          environment: "production",
        }),
      ).toThrow(
        "in-memory provider continuity runtime is forbidden in production; durable continuity storage is required",
      )
    })

    it("executes a successful operation through the composed runtime", async () => {
      const runtime = createRuntime()

      const result = await runtime.execute({
        traceId: "trace-success",
        operation: {
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
              execute: async () =>
                "safe-ai-result",
            },
          ],
        },
      })

      expect(result.outcome).toBe("executed")

      if (result.outcome === "executed") {
        expect(result.continuity.execution.ok).toBe(
          true,
        )
        expect(result.incident).toBeNull()
        expect(result.containment).toBeNull()
      }

      expect(
        runtime.getTenantSnapshot("tenant-a"),
      ).toMatchObject({
        tenantId: "tenant-a",
        activeContainments: 0,
        openIncidents: 0,
        pendingOwnerRecoveryDecisions: 0,
      })
    })

    it("creates containment and blocks the next critical-domain operation", async () => {
      const runtime = createRuntime()

      const first = await runtime.execute({
        traceId: "trace-database-failure",
        operation: {
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
                  "database unavailable",
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
      })

      expect(first.outcome).toBe("executed")

      if (first.outcome === "executed") {
        expect(first.incident?.severity).toBe(
          "critical",
        )
        expect(first.containment?.status).toBe(
          "active",
        )
      }

      let blockedProviderExecuted = false

      const second = await runtime.execute({
        traceId: "trace-blocked",
        operation: {
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
                blockedProviderExecuted = true
                return "unsafe-result"
              },
            },
          ],
        },
      })

      expect(second).toMatchObject({
        outcome: "blocked",
        decision: {
          allowed: false,
          code: "PROVIDER_DOMAIN_CONTAINED",
        },
      })

      expect(blockedProviderExecuted).toBe(false)

      expect(
        runtime.getTenantSnapshot("tenant-a"),
      ).toMatchObject({
        activeContainments: 1,
        openIncidents: 1,
        pendingOwnerRecoveryDecisions: 1,
      })
    })

    it("runs the complete owner-controlled recovery lifecycle", async () => {
      const runtime = createRuntime()

      const failure = await runtime.execute({
        traceId: "trace-full-recovery",
        operation: {
          queueItemId: "queue-full-recovery",
          operationId:
            "operation-full-recovery",
          tenantId: "tenant-a",
          providerDomain: "payments",
          candidates: [
            {
              id: "payments-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => {
                throw new Error(
                  "payments provider unavailable",
                )
              },
            },
            {
              id: "payments-fallback",
              priority: 2,
              health: "unavailable",
              approvedForFallback: true,
              execute: async () =>
                "must-not-run",
            },
          ],
        },
      })

      expect(failure.outcome).toBe("executed")

      if (
        failure.outcome !== "executed" ||
        !failure.incident ||
        !failure.containment
      ) {
        throw new Error(
          "critical failure did not create incident and containment",
        )
      }

      runtime.acknowledgeIncident({
        incidentId:
          failure.incident.incidentId,
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason:
          "incident scope and provider health reviewed",
      })

      runtime.approveRecovery({
        queueItemId:
          "queue-full-recovery",
        tenantId: "tenant-a",
        ownerId: "owner-a",
        reason:
          "manual recovery replay approved",
      })

      const authorization =
        runtime.authorizeRecoveryReplay({
          queueItemId:
            "queue-full-recovery",
          tenantId: "tenant-a",
          ownerId: "owner-a",
        })

      const recovery = await runtime.recover({
        operation: {
          authorization,
          incidentId:
            failure.incident.incidentId,
          containmentId:
            failure.containment.containmentId,
          incidentResolutionReason:
            "authorized replay succeeded and provider health was verified",
          containmentReleaseReason:
            "payments continuity safely restored",
          candidates: [
            {
              id: "payments-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () =>
                "payment-recovery-success",
            },
          ],
        },
      })

      expect(recovery.outcome).toBe(
        "recovered",
      )

      if (recovery.outcome === "recovered") {
        expect(
          recovery.replay.execution.value,
        ).toBe("payment-recovery-success")

        expect(recovery.incident.status).toBe(
          "resolved",
        )

        expect(
          recovery.containment.status,
        ).toBe("released")

        expect(
          recovery.replay.queueItem.status,
        ).toBe("completed")
      }

      expect(
        runtime.evaluateDomainOperation(
          "tenant-a",
          "payments",
        ).allowed,
      ).toBe(true)

      expect(
        runtime.getTenantSnapshot("tenant-a"),
      ).toMatchObject({
        activeContainments: 0,
        openIncidents: 0,
        acknowledgedIncidents: 0,
        pendingOwnerRecoveryDecisions: 0,
        replayAuthorizedRecoveries: 0,
      })
    })

    it("keeps composed runtime state tenant-isolated", async () => {
      const runtime = createRuntime()

      await runtime.execute({
        traceId: "tenant-a-failure",
        operation: {
          queueItemId: "tenant-a-queue",
          operationId:
            "tenant-a-database-operation",
          tenantId: "tenant-a",
          providerDomain: "database",
          candidates: [
            {
              id: "database-primary",
              priority: 1,
              health: "unavailable",
              approvedForFallback: false,
              execute: async () =>
                "must-not-run",
            },
          ],
        },
      })

      const tenantASnapshot =
        runtime.getTenantSnapshot("tenant-a")

      const tenantBSnapshot =
        runtime.getTenantSnapshot("tenant-b")

      expect(
        tenantASnapshot.activeContainments,
      ).toBe(1)

      expect(
        tenantASnapshot.openIncidents,
      ).toBe(1)

      expect(
        tenantBSnapshot.activeContainments,
      ).toBe(0)

      expect(
        tenantBSnapshot.openIncidents,
      ).toBe(0)

      expect(
        tenantBSnapshot.recoveries,
      ).toEqual([])
    })
  },
)
