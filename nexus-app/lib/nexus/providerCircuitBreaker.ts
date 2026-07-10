export type ProviderCircuitState = "closed" | "open" | "half-open"

export interface ProviderCircuitBreakerPolicy {
  failureThreshold: number
  recoveryTimeoutMs: number
  halfOpenSuccessThreshold: number
}

export interface ProviderCircuitSnapshot {
  providerId: string
  state: ProviderCircuitState
  consecutiveFailures: number
  halfOpenSuccesses: number
  openedAt: number | null
  lastFailureAt: number | null
  lastSuccessAt: number | null
  probeInFlight: boolean
}

interface ProviderCircuitRecord {
  state: ProviderCircuitState
  consecutiveFailures: number
  halfOpenSuccesses: number
  openedAt: number | null
  lastFailureAt: number | null
  lastSuccessAt: number | null
  probeInFlight: boolean
}

const createRecord = (): ProviderCircuitRecord => ({
  state: "closed",
  consecutiveFailures: 0,
  halfOpenSuccesses: 0,
  openedAt: null,
  lastFailureAt: null,
  lastSuccessAt: null,
  probeInFlight: false,
})

export class InMemoryProviderCircuitBreaker {
  private readonly records = new Map<string, ProviderCircuitRecord>()

  constructor(private readonly policy: ProviderCircuitBreakerPolicy) {
    if (!Number.isInteger(policy.failureThreshold) || policy.failureThreshold < 1) {
      throw new Error("failureThreshold must be a positive integer")
    }

    if (
      !Number.isInteger(policy.recoveryTimeoutMs) ||
      policy.recoveryTimeoutMs < 1
    ) {
      throw new Error("recoveryTimeoutMs must be a positive integer")
    }

    if (
      !Number.isInteger(policy.halfOpenSuccessThreshold) ||
      policy.halfOpenSuccessThreshold < 1
    ) {
      throw new Error("halfOpenSuccessThreshold must be a positive integer")
    }
  }

  canAttempt(providerId: string, now = Date.now()): boolean {
    const record = this.getRecord(providerId)

    if (record.state === "open") {
      const openedAt = record.openedAt ?? now

      if (now - openedAt < this.policy.recoveryTimeoutMs) {
        return false
      }

      record.state = "half-open"
      record.halfOpenSuccesses = 0
      record.probeInFlight = false
    }

    if (record.state === "half-open") {
      if (record.probeInFlight) {
        return false
      }

      record.probeInFlight = true
    }

    return true
  }

  recordSuccess(providerId: string, now = Date.now()): void {
    const record = this.getRecord(providerId)

    record.lastSuccessAt = now
    record.consecutiveFailures = 0
    record.probeInFlight = false

    if (record.state === "half-open") {
      record.halfOpenSuccesses += 1

      if (
        record.halfOpenSuccesses >= this.policy.halfOpenSuccessThreshold
      ) {
        this.close(record)
      }

      return
    }

    this.close(record)
  }

  recordFailure(providerId: string, now = Date.now()): void {
    const record = this.getRecord(providerId)

    record.lastFailureAt = now
    record.consecutiveFailures += 1
    record.probeInFlight = false

    if (
      record.state === "half-open" ||
      record.consecutiveFailures >= this.policy.failureThreshold
    ) {
      record.state = "open"
      record.openedAt = now
      record.halfOpenSuccesses = 0
    }
  }

  getSnapshot(providerId: string): ProviderCircuitSnapshot {
    const record = this.getRecord(providerId)

    return {
      providerId,
      state: record.state,
      consecutiveFailures: record.consecutiveFailures,
      halfOpenSuccesses: record.halfOpenSuccesses,
      openedAt: record.openedAt,
      lastFailureAt: record.lastFailureAt,
      lastSuccessAt: record.lastSuccessAt,
      probeInFlight: record.probeInFlight,
    }
  }

  getAllSnapshots(): ProviderCircuitSnapshot[] {
    return [...this.records.keys()]
      .sort((left, right) => left.localeCompare(right))
      .map((providerId) => this.getSnapshot(providerId))
  }

  private getRecord(providerId: string): ProviderCircuitRecord {
    const normalizedProviderId = providerId.trim()

    if (!normalizedProviderId) {
      throw new Error("providerId is required")
    }

    const existingRecord = this.records.get(normalizedProviderId)

    if (existingRecord) {
      return existingRecord
    }

    const newRecord = createRecord()
    this.records.set(normalizedProviderId, newRecord)

    return newRecord
  }

  private close(record: ProviderCircuitRecord): void {
    record.state = "closed"
    record.consecutiveFailures = 0
    record.halfOpenSuccesses = 0
    record.openedAt = null
    record.probeInFlight = false
  }
}
