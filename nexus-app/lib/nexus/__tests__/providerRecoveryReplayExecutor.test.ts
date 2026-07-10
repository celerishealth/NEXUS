import { describe, expect, it } from "vitest"

import { InMemoryProviderCircuitBreaker } from "../providerCircuitBreaker"
import { InMemoryProviderRecoveryQueue } from "../providerRecoveryQueue"
import { executeAuthorizedProviderReplay } from "../providerRecoveryReplayExecutor"
import { InMemoryProviderReplayIdempotencyGuard } from "../providerReplayIdempotencyGuard"

const createCircuitBreaker = () =>
  new InMemoryProviderCircuitBreaker({
    failureThreshold: 3,
    recoveryTimeoutMs: 1_000,
    halfOpenSuccessThreshold: 1,
  })

const createAuthorizedRecovery = (
  tenantId = "tenant-a",
) => {
  let now = 100

  const recoveryQueue =
    new InMemoryProviderRecoveryQueue(() => now)

  recoveryQueue.enqueue({
    queueItemId: "queue-replay",
    operationId: "operation-replay",
    tenantId,
    providerDomain: "ai",
    failureCode: "ALL_PROVIDERS_UNAVAILABLE",
    attempts: [],
  })

  now = 101

  recoveryQueue.approve({
    queueItemId: "queue-replay",
    tenantId,
    ownerId: "owner-a",
    reason: "provider health manually verified",
  })

  now = 102

  const authorization =
    recoveryQueue.authorizeReplay({
      queueItemId: "queue-replay",
      tenantId,
      ownerId: "owner-a",
    })

  return {
    recoveryQueue,
    authorization,
  }
}

describe("authorized provider replay executor", () => {
  it("executes an authorized replay and completes its queue item", async () => {
    const {
      recoveryQueue,
      authorization,
    } = createAuthorizedRecovery()

    const idempotencyGuard =
      new InMemoryProviderReplayIdempotencyGuard()

    const result =
      await executeAuthorizedProviderReplay(
        {
          authorization,
          candidates: [
            {
              id: "ai-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => "recovered-result",
            },
          ],
        },
        {
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          idempotencyGuard,
        },
      )

    expect(result.ok).toBe(true)

    if (result.ok) {
      expect(result.execution.value).toBe(
        "recovered-result",
      )
      expect(result.queueItem.status).toBe("completed")
      expect(
        idempotencyGuard.getState(result.replayKey),
      ).toBe("completed")
    }
  })

  it("blocks duplicate replay after successful completion", async () => {
    const {
      recoveryQueue,
      authorization,
    } = createAuthorizedRecovery()

    const idempotencyGuard =
      new InMemoryProviderReplayIdempotencyGuard()

    let executionCount = 0

    const operation = {
      authorization,
      candidates: [
        {
          id: "ai-primary",
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

    const options = {
      timeoutMs: 100,
      circuitBreaker: createCircuitBreaker(),
      recoveryQueue,
      idempotencyGuard,
    }

    const first =
      await executeAuthorizedProviderReplay(
        operation,
        options,
      )

    const second =
      await executeAuthorizedProviderReplay(
        operation,
        options,
      )

    expect(first.ok).toBe(true)
    expect(second).toMatchObject({
      ok: false,
      code: "REPLAY_ALREADY_COMPLETED",
    })
    expect(executionCount).toBe(1)
  })

  it("blocks a concurrent duplicate replay", async () => {
    const {
      recoveryQueue,
      authorization,
    } = createAuthorizedRecovery()

    const idempotencyGuard =
      new InMemoryProviderReplayIdempotencyGuard()

    let releaseExecution:
      | ((value: string) => void)
      | undefined

    const pendingExecution = new Promise<string>(
      (resolve) => {
        releaseExecution = resolve
      },
    )

    const operation = {
      authorization,
      candidates: [
        {
          id: "ai-primary",
          priority: 1,
          health: "healthy" as const,
          approvedForFallback: false,
          execute: async () => pendingExecution,
        },
      ],
    }

    const options = {
      timeoutMs: 1_000,
      circuitBreaker: createCircuitBreaker(),
      recoveryQueue,
      idempotencyGuard,
    }

    const firstPromise =
      executeAuthorizedProviderReplay(
        operation,
        options,
      )

    const duplicate =
      await executeAuthorizedProviderReplay(
        operation,
        options,
      )

    expect(duplicate).toMatchObject({
      ok: false,
      code: "REPLAY_ALREADY_IN_FLIGHT",
    })

    releaseExecution?.("completed-result")

    const first = await firstPromise
    expect(first.ok).toBe(true)
  })

  it("releases a failed attempt without automatic retry", async () => {
    const {
      recoveryQueue,
      authorization,
    } = createAuthorizedRecovery()

    const idempotencyGuard =
      new InMemoryProviderReplayIdempotencyGuard()

    const failed =
      await executeAuthorizedProviderReplay(
        {
          authorization,
          candidates: [
            {
              id: "ai-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => {
                throw new Error("provider still unhealthy")
              },
            },
          ],
        },
        {
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          idempotencyGuard,
        },
      )

    expect(failed).toMatchObject({
      ok: false,
      code: "REPLAY_EXECUTION_FAILED",
    })

    expect(
      recoveryQueue.getForTenant(
        authorization.queueItemId,
        authorization.tenantId,
      )?.status,
    ).toBe("replay-authorized")

    expect(
      idempotencyGuard.getState(
        failed.replayKey,
      ),
    ).toBeNull()

    const explicitSecondAttempt =
      await executeAuthorizedProviderReplay(
        {
          authorization,
          candidates: [
            {
              id: "ai-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => "manual-retry-success",
            },
          ],
        },
        {
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          idempotencyGuard,
        },
      )

    expect(explicitSecondAttempt.ok).toBe(true)
  })

  it("blocks tampered replay authorization", async () => {
    const {
      recoveryQueue,
      authorization,
    } = createAuthorizedRecovery()

    let executed = false

    const result =
      await executeAuthorizedProviderReplay(
        {
          authorization: {
            ...authorization,
            authorizedBy: "different-owner",
          },
          candidates: [
            {
              id: "ai-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => {
                executed = true
                return "unsafe-result"
              },
            },
          ],
        },
        {
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          idempotencyGuard:
            new InMemoryProviderReplayIdempotencyGuard(),
        },
      )

    expect(result).toMatchObject({
      ok: false,
      code: "REPLAY_AUTHORIZATION_MISMATCH",
    })
    expect(executed).toBe(false)
  })

  it("blocks cross-tenant replay access", async () => {
    const {
      recoveryQueue,
      authorization,
    } = createAuthorizedRecovery("tenant-a")

    let executed = false

    const result =
      await executeAuthorizedProviderReplay(
        {
          authorization: {
            ...authorization,
            tenantId: "tenant-b",
          },
          candidates: [
            {
              id: "ai-primary",
              priority: 1,
              health: "healthy",
              approvedForFallback: false,
              execute: async () => {
                executed = true
                return "unsafe-result"
              },
            },
          ],
        },
        {
          timeoutMs: 100,
          circuitBreaker: createCircuitBreaker(),
          recoveryQueue,
          idempotencyGuard:
            new InMemoryProviderReplayIdempotencyGuard(),
        },
      )

    expect(result).toMatchObject({
      ok: false,
      code: "REPLAY_NOT_AUTHORIZED",
    })
    expect(executed).toBe(false)
  })
})
