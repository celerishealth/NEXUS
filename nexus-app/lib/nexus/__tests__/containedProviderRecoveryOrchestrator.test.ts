import { describe, expect, it } from "vitest"

import {
  executeContainedProviderRecovery,
} from "../containedProviderRecoveryOrchestrator"
import {
  InMemoryProviderCircuitBreaker,
} from "../providerCircuitBreaker"
import {
  InMemoryProviderIncidentContainmentRegistry,
} from "../providerIncidentContainment"
import {
  checkProviderDomainOperationPermission,
} from "../providerIncidentContainmentCoordinator"
import {
  InMemoryProviderIncidentRegistry,
} from "../providerIncidentRegistry"
import {
  InMemoryProviderRecoveryQueue,
} from "../providerRecoveryQueue"
import {
  InMemoryProviderReplayIdempotencyGuard,
} from "../providerReplayIdempotencyGuard"

const createCircuitBreaker = () =>
  new InMemoryProviderCircuitBreaker({
    failureThreshold: 2,
    recoveryTimeoutMs: 1_000,
    halfOpenSuccessThreshold: 1,
  })

const createRecoveryRuntime = (
  input?: {
    tenantId?: string
    acknowledgeIncident?: boolean
    acknowledgementOwnerId?: string
  },
) => {
  let now = 100

  const tenantId =
    input?.tenantId ?? "tenant-a"
  const ownerId = "owner-a"

  const recoveryQueue =
    new InMemoryProviderRecoveryQueue(
      () => now++,
    )

  recoveryQueue.enqueue({
    queueItemId: "queue-recovery",
    operationId: "operation-recovery",
    tenantId,
    providerDomain: "database",
    failureCode: "ALL_PROVIDERS_UNAVAILABLE",
    attempts: [],
  })

  recoveryQueue.approve({
    queueItemId: "queue-recovery",
    tenantId,
    ownerId,
    reason: "recovery manually approved",
  })

  const authorization =
    recoveryQueue.authorizeReplay({
      queueItemId: "queue-recovery",
      tenantId,
      ownerId,
    })

  const incidentRegistry =
    new InMemoryProviderIncidentRegistry(
      () => now++,
    )

  const incident = incidentRegistry.open(
    "database-recovery-incident",
    {
      traceId: "database-recovery-trace",
      tenantId,
      operationId: "operation-recovery",
      providerDomain: "database",
      severity: "critical",
      requiresOwnerEscalation: true,
      reasonCodes: [
        "all-providers-unavailable",
        "critical-domain-interruption",
      ],
      failedAttempts: 1,
      skippedAttempts: 1,
      queueItemId: "queue-recovery",
      firstObservedAt: 10,
      lastObservedAt: 20,
    },
  )

  if (input?.acknowledgeIncident !== false) {
    incidentRegistry.acknowledge({
      incidentId: incident.incidentId,
      tenantId,
      ownerId:
        input?.acknowledgementOwnerId ??
        ownerId,
      reason: "critical incident reviewed",
    })
  }

  const containmentRegistry =
    new InMemoryProviderIncidentContainmentRegistry(
      () => now++,
    )

  const containment =
    containmentRegistry.activateFromIncident(
      incident,
    )

  return {
    tenantId,
    ownerId,
    authorization,
    recoveryQueue,
    incidentRegistry,
    containmentRegistry,
    incident,
    containment: containment!,
    idempotencyGuard:
      new InMemoryProviderReplayIdempotencyGuard(),
    circuitBreaker: createCircuitBreaker(),
  }
}

const createOptions = (
  runtime: ReturnType<
    typeof createRecoveryRuntime
  >,
) => ({
  timeoutMs: 100,
  circuitBreaker: runtime.circuitBreaker,
  recoveryQueue: runtime.recoveryQueue,
  idempotencyGuard:
    runtime.idempotencyGuard,
  incidentRegistry:
    runtime.incidentRegistry,
  containmentRegistry:
    runtime.containmentRegistry,
})

describe(
  "contained provider recovery orchestrator",
  () => {
    it("completes authorized replay, resolves incident and releases containment", async () => {
      const runtime =
        createRecoveryRuntime()

      const result =
        await executeContainedProviderRecovery(
          {
            authorization:
              runtime.authorization,
            incidentId:
              runtime.incident.incidentId,
            containmentId:
              runtime.containment
                .containmentId,
            incidentResolutionReason:
              "authorized replay completed successfully",
            containmentReleaseReason:
              "database provider continuity restored",
            candidates: [
              {
                id: "database-primary",
                priority: 1,
                health: "healthy",
                approvedForFallback: false,
                execute: async () =>
                  "database-recovered",
              },
            ],
          },
          createOptions(runtime),
        )

      expect(result.outcome).toBe(
        "recovered",
      )

      if (result.outcome === "recovered") {
        expect(
          result.replay.execution.value,
        ).toBe("database-recovered")

        expect(result.incident.status).toBe(
          "resolved",
        )

        expect(
          result.containment.status,
        ).toBe("released")

        expect(
          result.replay.queueItem.status,
        ).toBe("completed")
      }

      expect(
        checkProviderDomainOperationPermission(
          runtime.tenantId,
          "database",
          runtime.containmentRegistry,
        ).allowed,
      ).toBe(true)
    })

    it("blocks replay before owner acknowledgement", async () => {
      const runtime =
        createRecoveryRuntime({
          acknowledgeIncident: false,
        })

      let providerExecuted = false

      const result =
        await executeContainedProviderRecovery(
          {
            authorization:
              runtime.authorization,
            incidentId:
              runtime.incident.incidentId,
            containmentId:
              runtime.containment
                .containmentId,
            incidentResolutionReason:
              "must not resolve",
            containmentReleaseReason:
              "must not release",
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
          createOptions(runtime),
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "RECOVERY_INCIDENT_NOT_ACKNOWLEDGED",
      })

      expect(providerExecuted).toBe(false)
      expect(
        runtime.containmentRegistry
          .getForTenant(
            runtime.containment
              .containmentId,
            runtime.tenantId,
          )?.status,
      ).toBe("active")
    })

    it("blocks recovery when acknowledgement owner differs from replay owner", async () => {
      const runtime =
        createRecoveryRuntime({
          acknowledgementOwnerId:
            "different-owner",
        })

      let providerExecuted = false

      const result =
        await executeContainedProviderRecovery(
          {
            authorization:
              runtime.authorization,
            incidentId:
              runtime.incident.incidentId,
            containmentId:
              runtime.containment
                .containmentId,
            incidentResolutionReason:
              "must not resolve",
            containmentReleaseReason:
              "must not release",
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
          createOptions(runtime),
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code: "RECOVERY_OWNER_MISMATCH",
      })

      expect(providerExecuted).toBe(false)
    })

    it("blocks mismatched incident and replay scope", async () => {
      const runtime =
        createRecoveryRuntime()

      let providerExecuted = false

      const result =
        await executeContainedProviderRecovery(
          {
            authorization: {
              ...runtime.authorization,
              operationId:
                "tampered-operation",
            },
            incidentId:
              runtime.incident.incidentId,
            containmentId:
              runtime.containment
                .containmentId,
            incidentResolutionReason:
              "must not resolve",
            containmentReleaseReason:
              "must not release",
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
          createOptions(runtime),
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code: "RECOVERY_SCOPE_MISMATCH",
      })

      expect(providerExecuted).toBe(false)
    })

    it("keeps incident and containment active after failed replay", async () => {
      const runtime =
        createRecoveryRuntime()

      const result =
        await executeContainedProviderRecovery(
          {
            authorization:
              runtime.authorization,
            incidentId:
              runtime.incident.incidentId,
            containmentId:
              runtime.containment
                .containmentId,
            incidentResolutionReason:
              "must not resolve",
            containmentReleaseReason:
              "must not release",
            candidates: [
              {
                id: "database-primary",
                priority: 1,
                health: "healthy",
                approvedForFallback: false,
                execute: async () => {
                  throw new Error(
                    "provider still unavailable",
                  )
                },
              },
            ],
          },
          createOptions(runtime),
        )

      expect(result).toMatchObject({
        outcome: "replay-failed",
        code: "REPLAY_EXECUTION_FAILED",
      })

      expect(
        runtime.incidentRegistry
          .getForTenant(
            runtime.incident.incidentId,
            runtime.tenantId,
          )?.status,
      ).toBe("owner-acknowledged")

      expect(
        runtime.containmentRegistry
          .getForTenant(
            runtime.containment
              .containmentId,
            runtime.tenantId,
          )?.status,
      ).toBe("active")

      expect(
        runtime.recoveryQueue
          .getForTenant(
            runtime.authorization.queueItemId,
            runtime.tenantId,
          )?.status,
      ).toBe("replay-authorized")
    })

    it("blocks cross-tenant recovery without provider execution", async () => {
      const runtime =
        createRecoveryRuntime({
          tenantId: "tenant-a",
        })

      let providerExecuted = false

      const result =
        await executeContainedProviderRecovery(
          {
            authorization: {
              ...runtime.authorization,
              tenantId: "tenant-b",
            },
            incidentId:
              runtime.incident.incidentId,
            containmentId:
              runtime.containment
                .containmentId,
            incidentResolutionReason:
              "unauthorized resolution",
            containmentReleaseReason:
              "unauthorized release",
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
          createOptions(runtime),
        )

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "RECOVERY_INCIDENT_NOT_FOUND",
      })

      expect(providerExecuted).toBe(false)
    })

    it("blocks reuse after completed recovery", async () => {
      const runtime =
        createRecoveryRuntime()

      let executionCount = 0

      const operation = {
        authorization:
          runtime.authorization,
        incidentId:
          runtime.incident.incidentId,
        containmentId:
          runtime.containment.containmentId,
        incidentResolutionReason:
          "authorized recovery completed",
        containmentReleaseReason:
          "containment safely released",
        candidates: [
          {
            id: "database-primary",
            priority: 1,
            health: "healthy" as const,
            approvedForFallback: false,
            execute: async () => {
              executionCount += 1
              return "safe-result"
            },
          },
        ],
      }

      const first =
        await executeContainedProviderRecovery(
          operation,
          createOptions(runtime),
        )

      const second =
        await executeContainedProviderRecovery(
          operation,
          createOptions(runtime),
        )

      expect(first.outcome).toBe(
        "recovered",
      )

      expect(second).toMatchObject({
        outcome: "blocked",
        code:
          "RECOVERY_CONTAINMENT_NOT_ACTIVE",
      })

      expect(executionCount).toBe(1)
    })
  },
)
