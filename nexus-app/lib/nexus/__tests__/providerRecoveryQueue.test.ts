import { describe, expect, it } from "vitest"

import { InMemoryProviderCircuitBreaker } from "../providerCircuitBreaker"
import { executeProviderOperationWithRecoveryQueue } from "../providerContinuityCoordinator"
import { InMemoryProviderRecoveryQueue } from "../providerRecoveryQueue"

const createCircuitBreaker = () =>
  new InMemoryProviderCircuitBreaker({
    failureThreshold: 2,
    recoveryTimeoutMs: 1_000,
    halfOpenSuccessThreshold: 1,
  })

describe("provider recovery queue", () => {
  it("does not queue a successful provider operation", async () => {
    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(() => 100)

    const result =
      await executeProviderOperationWithRecoveryQueue(
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
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
        },
      )

    expect(result.execution.ok).toBe(true)
    expect(result.queuedRecovery).toBeNull()
    expect(
      recoveryQueue.listForTenant("tenant-a"),
    ).toEqual([])
  })

  it("queues total provider failure for owner approval", async () => {
    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(() => 200)

    const result =
      await executeProviderOperationWithRecoveryQueue(
        {
          queueItemId: "queue-failure",
          operationId: "operation-failure",
          tenantId: "tenant-a",
          providerDomain: "messaging",
          metadata: {
            channel: "whatsapp-preview",
          },
          candidates: [
            {
              id: "messaging-primary",
              priority: 1,
              health: "unavailable",
              approvedForFallback: false,
              execute: async () => "must-not-run",
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
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
        },
      )

    expect(result.execution.ok).toBe(false)
    expect(result.queuedRecovery).toMatchObject({
      queueItemId: "queue-failure",
      operationId: "operation-failure",
      tenantId: "tenant-a",
      providerDomain: "messaging",
      status: "pending-owner-approval",
      failureCode: "ALL_PROVIDERS_UNAVAILABLE",
    })

    expect(
      Object.keys(result.queuedRecovery ?? {}),
    ).not.toContain("execute")
  })

  it("requires owner approval before replay authorization", () => {
    let now = 300
    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(() => now)

    recoveryQueue.enqueue({
      queueItemId: "queue-owner-gate",
      operationId: "operation-owner-gate",
      tenantId: "tenant-a",
      providerDomain: "database",
      failureCode: "ALL_PROVIDERS_UNAVAILABLE",
      attempts: [],
    })

    expect(() =>
      recoveryQueue.authorizeReplay({
        queueItemId: "queue-owner-gate",
        tenantId: "tenant-a",
        ownerId: "owner-a",
      }),
    ).toThrow(
      "provider recovery must be owner-approved before replay authorization",
    )

    now = 301

    const approved = recoveryQueue.approve({
      queueItemId: "queue-owner-gate",
      tenantId: "tenant-a",
      ownerId: "owner-a",
      reason: "provider health manually verified",
    })

    expect(approved.status).toBe("approved")

    now = 302

    const authorization =
      recoveryQueue.authorizeReplay({
        queueItemId: "queue-owner-gate",
        tenantId: "tenant-a",
        ownerId: "owner-a",
      })

    expect(authorization).toEqual({
      queueItemId: "queue-owner-gate",
      operationId: "operation-owner-gate",
      tenantId: "tenant-a",
      providerDomain: "database",
      authorizedBy: "owner-a",
      authorizedAt: 302,
    })
  })

  it("blocks cross-tenant recovery access", () => {
    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(() => 400)

    recoveryQueue.enqueue({
      queueItemId: "queue-private",
      operationId: "operation-private",
      tenantId: "tenant-a",
      providerDomain: "payments",
      failureCode: "ALL_PROVIDERS_UNAVAILABLE",
      attempts: [],
    })

    expect(
      recoveryQueue.getForTenant(
        "queue-private",
        "tenant-b",
      ),
    ).toBeNull()

    expect(() =>
      recoveryQueue.approve({
        queueItemId: "queue-private",
        tenantId: "tenant-b",
        ownerId: "owner-b",
        reason: "unauthorized cross-tenant decision",
      }),
    ).toThrow(
      "provider recovery item was not found for tenant",
    )
  })

  it("keeps queue insertion idempotent", () => {
    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(() => 500)

    const first = recoveryQueue.enqueue({
      queueItemId: "queue-idempotent",
      operationId: "operation-idempotent",
      tenantId: "tenant-a",
      providerDomain: "ai",
      failureCode: "ALL_PROVIDERS_UNAVAILABLE",
      attempts: [],
    })

    const second = recoveryQueue.enqueue({
      queueItemId: "queue-idempotent",
      operationId: "operation-idempotent",
      tenantId: "tenant-a",
      providerDomain: "ai",
      failureCode: "ALL_PROVIDERS_UNAVAILABLE",
      attempts: [],
    })

    expect(second).toEqual(first)
    expect(
      recoveryQueue.listForTenant("tenant-a"),
    ).toHaveLength(1)
  })

  it("prevents rejected recovery from being replayed", () => {
    const recoveryQueue =
      new InMemoryProviderRecoveryQueue(() => 600)

    recoveryQueue.enqueue({
      queueItemId: "queue-rejected",
      operationId: "operation-rejected",
      tenantId: "tenant-a",
      providerDomain: "messaging",
      failureCode: "ALL_PROVIDERS_UNAVAILABLE",
      attempts: [],
    })

    recoveryQueue.reject({
      queueItemId: "queue-rejected",
      tenantId: "tenant-a",
      ownerId: "owner-a",
      reason: "unsafe provider state",
    })

    expect(() =>
      recoveryQueue.authorizeReplay({
        queueItemId: "queue-rejected",
        tenantId: "tenant-a",
        ownerId: "owner-a",
      }),
    ).toThrow(
      "provider recovery must be owner-approved before replay authorization",
    )
  })
})
