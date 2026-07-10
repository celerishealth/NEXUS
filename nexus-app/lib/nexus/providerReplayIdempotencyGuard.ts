export type ProviderReplayIdempotencyState =
  | "in-flight"
  | "completed"

export class InMemoryProviderReplayIdempotencyGuard {
  private readonly states =
    new Map<string, ProviderReplayIdempotencyState>()

  begin(replayKey: string): boolean {
    const normalizedReplayKey = replayKey.trim()

    if (!normalizedReplayKey) {
      throw new Error("replayKey is required")
    }

    if (this.states.has(normalizedReplayKey)) {
      return false
    }

    this.states.set(normalizedReplayKey, "in-flight")
    return true
  }

  markCompleted(replayKey: string): void {
    const currentState = this.states.get(replayKey)

    if (currentState !== "in-flight") {
      throw new Error(
        "only an in-flight replay can be completed",
      )
    }

    this.states.set(replayKey, "completed")
  }

  releaseFailedAttempt(replayKey: string): void {
    if (this.states.get(replayKey) === "in-flight") {
      this.states.delete(replayKey)
    }
  }

  getState(
    replayKey: string,
  ): ProviderReplayIdempotencyState | null {
    return this.states.get(replayKey) ?? null
  }
}
