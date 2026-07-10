import {
  InMemoryProviderCircuitBreaker,
  type ProviderCircuitSnapshot,
} from "./providerCircuitBreaker"

export type ProviderRuntimeHealth =
  | "healthy"
  | "degraded"
  | "unavailable"

export interface ProviderExecutionCandidate<T> {
  id: string
  priority: number
  health: ProviderRuntimeHealth
  approvedForFallback: boolean
  execute: () => Promise<T>
}

export interface ProviderExecutionAttempt {
  providerId: string
  status: "succeeded" | "failed" | "skipped"
  reason:
    | "execution-succeeded"
    | "execution-failed"
    | "execution-timeout"
    | "provider-unavailable"
    | "fallback-not-approved"
    | "circuit-open"
}

export interface ProviderExecutionSuccess<T> {
  ok: true
  providerId: string
  value: T
  attempts: ProviderExecutionAttempt[]
  circuitSnapshots: ProviderCircuitSnapshot[]
}

export interface ProviderExecutionFailure {
  ok: false
  code: "ALL_PROVIDERS_UNAVAILABLE"
  attempts: ProviderExecutionAttempt[]
  circuitSnapshots: ProviderCircuitSnapshot[]
}

export type ProviderExecutionResult<T> =
  | ProviderExecutionSuccess<T>
  | ProviderExecutionFailure

export interface ProviderExecutionGuardOptions {
  timeoutMs: number
  circuitBreaker: InMemoryProviderCircuitBreaker
  now?: () => number
}

class ProviderTimeoutError extends Error {
  constructor(providerId: string, timeoutMs: number) {
    super(`Provider ${providerId} exceeded timeout of ${timeoutMs}ms`)
    this.name = "ProviderTimeoutError"
  }
}

const runWithTimeout = <T>(
  providerId: string,
  timeoutMs: number,
  operation: () => Promise<T>,
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    let settled = false

    const timer = setTimeout(() => {
      if (settled) {
        return
      }

      settled = true
      reject(new ProviderTimeoutError(providerId, timeoutMs))
    }, timeoutMs)

    Promise.resolve()
      .then(operation)
      .then(
        (value) => {
          if (settled) {
            return
          }

          settled = true
          clearTimeout(timer)
          resolve(value)
        },
        (error: unknown) => {
          if (settled) {
            return
          }

          settled = true
          clearTimeout(timer)
          reject(error)
        },
      )
  })

export const executeWithProviderContinuity = async <T>(
  candidates: ProviderExecutionCandidate<T>[],
  options: ProviderExecutionGuardOptions,
): Promise<ProviderExecutionResult<T>> => {
  if (
    !Number.isInteger(options.timeoutMs) ||
    options.timeoutMs < 1
  ) {
    throw new Error("timeoutMs must be a positive integer")
  }

  const orderedCandidates = [...candidates]
    .filter((candidate) => candidate.id.trim().length > 0)
    .sort((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority
      }

      return left.id.localeCompare(right.id)
    })

  const attempts: ProviderExecutionAttempt[] = []
  const primaryProviderId = orderedCandidates[0]?.id ?? null
  const now = options.now ?? Date.now

  for (const candidate of orderedCandidates) {
    if (candidate.health === "unavailable") {
      attempts.push({
        providerId: candidate.id,
        status: "skipped",
        reason: "provider-unavailable",
      })
      continue
    }

    const isFallback = candidate.id !== primaryProviderId

    if (isFallback && !candidate.approvedForFallback) {
      attempts.push({
        providerId: candidate.id,
        status: "skipped",
        reason: "fallback-not-approved",
      })
      continue
    }

    if (!options.circuitBreaker.canAttempt(candidate.id, now())) {
      attempts.push({
        providerId: candidate.id,
        status: "skipped",
        reason: "circuit-open",
      })
      continue
    }

    try {
      const value = await runWithTimeout(
        candidate.id,
        options.timeoutMs,
        candidate.execute,
      )

      options.circuitBreaker.recordSuccess(candidate.id, now())

      attempts.push({
        providerId: candidate.id,
        status: "succeeded",
        reason: "execution-succeeded",
      })

      return {
        ok: true,
        providerId: candidate.id,
        value,
        attempts,
        circuitSnapshots:
          options.circuitBreaker.getAllSnapshots(),
      }
    } catch (error: unknown) {
      options.circuitBreaker.recordFailure(candidate.id, now())

      attempts.push({
        providerId: candidate.id,
        status: "failed",
        reason:
          error instanceof ProviderTimeoutError
            ? "execution-timeout"
            : "execution-failed",
      })
    }
  }

  return {
    ok: false,
    code: "ALL_PROVIDERS_UNAVAILABLE",
    attempts,
    circuitSnapshots:
      options.circuitBreaker.getAllSnapshots(),
  }
}
