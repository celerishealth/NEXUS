import { describe, expect, it } from "vitest"

import { InMemoryProviderCircuitBreaker } from "../providerCircuitBreaker"
import { executeWithProviderContinuity } from "../providerExecutionGuard"

const createCircuitBreaker = () =>
  new InMemoryProviderCircuitBreaker({
    failureThreshold: 2,
    recoveryTimeoutMs: 1_000,
    halfOpenSuccessThreshold: 1,
  })

describe("executeWithProviderContinuity", () => {
  it("uses the highest-priority healthy provider", async () => {
    const result = await executeWithProviderContinuity(
      [
        {
          id: "primary",
          priority: 1,
          health: "healthy",
          approvedForFallback: false,
          execute: async () => "primary-result",
        },
        {
          id: "fallback",
          priority: 2,
          health: "healthy",
          approvedForFallback: true,
          execute: async () => "fallback-result",
        },
      ],
      {
        timeoutMs: 100,
        circuitBreaker: createCircuitBreaker(),
      },
    )

    expect(result.ok).toBe(true)

    if (result.ok) {
      expect(result.providerId).toBe("primary")
      expect(result.value).toBe("primary-result")
      expect(result.attempts).toEqual([
        {
          providerId: "primary",
          status: "succeeded",
          reason: "execution-succeeded",
        },
      ])
    }
  })

  it("routes to an approved fallback after primary failure", async () => {
    const result = await executeWithProviderContinuity(
      [
        {
          id: "primary",
          priority: 1,
          health: "healthy",
          approvedForFallback: false,
          execute: async () => {
            throw new Error("primary failure")
          },
        },
        {
          id: "approved-fallback",
          priority: 2,
          health: "healthy",
          approvedForFallback: true,
          execute: async () => "fallback-result",
        },
      ],
      {
        timeoutMs: 100,
        circuitBreaker: createCircuitBreaker(),
      },
    )

    expect(result.ok).toBe(true)

    if (result.ok) {
      expect(result.providerId).toBe("approved-fallback")
      expect(result.value).toBe("fallback-result")
      expect(result.attempts).toHaveLength(2)
    }
  })

  it("never executes an unapproved fallback", async () => {
    let unapprovedFallbackExecuted = false

    const result = await executeWithProviderContinuity(
      [
        {
          id: "primary",
          priority: 1,
          health: "unavailable",
          approvedForFallback: false,
          execute: async () => "primary-result",
        },
        {
          id: "unapproved-fallback",
          priority: 2,
          health: "healthy",
          approvedForFallback: false,
          execute: async () => {
            unapprovedFallbackExecuted = true
            return "unsafe-result"
          },
        },
      ],
      {
        timeoutMs: 100,
        circuitBreaker: createCircuitBreaker(),
      },
    )

    expect(result).toMatchObject({
      ok: false,
      code: "ALL_PROVIDERS_UNAVAILABLE",
    })
    expect(unapprovedFallbackExecuted).toBe(false)
  })

  it("opens, probes and closes a provider circuit deterministically", () => {
    const circuitBreaker = createCircuitBreaker()

    circuitBreaker.recordFailure("provider-a", 0)
    expect(
      circuitBreaker.getSnapshot("provider-a").state,
    ).toBe("closed")

    circuitBreaker.recordFailure("provider-a", 1)
    expect(
      circuitBreaker.getSnapshot("provider-a").state,
    ).toBe("open")

    expect(circuitBreaker.canAttempt("provider-a", 500)).toBe(
      false,
    )

    expect(circuitBreaker.canAttempt("provider-a", 1_001)).toBe(
      true,
    )
    expect(
      circuitBreaker.getSnapshot("provider-a").state,
    ).toBe("half-open")

    circuitBreaker.recordSuccess("provider-a", 1_002)

    expect(
      circuitBreaker.getSnapshot("provider-a").state,
    ).toBe("closed")
  })

  it("fails closed when every provider is unavailable", async () => {
    const result = await executeWithProviderContinuity(
      [
        {
          id: "database-a",
          priority: 1,
          health: "unavailable",
          approvedForFallback: false,
          execute: async () => "should-not-run",
        },
        {
          id: "database-b",
          priority: 2,
          health: "unavailable",
          approvedForFallback: true,
          execute: async () => "should-not-run",
        },
      ],
      {
        timeoutMs: 100,
        circuitBreaker: createCircuitBreaker(),
      },
    )

    expect(result).toMatchObject({
      ok: false,
      code: "ALL_PROVIDERS_UNAVAILABLE",
    })
  })
})
