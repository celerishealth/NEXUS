import {
  executeWithProviderContinuity,
  type ProviderExecutionCandidate,
  type ProviderExecutionGuardOptions,
  type ProviderExecutionFailure,
  type ProviderExecutionSuccess,
} from "./providerExecutionGuard"
import {
  InMemoryProviderRecoveryQueue,
  type ProviderRecoveryQueueItem,
  type ProviderReplayAuthorization,
} from "./providerRecoveryQueue"
import { InMemoryProviderReplayIdempotencyGuard } from "./providerReplayIdempotencyGuard"

export interface AuthorizedProviderReplayOperation<T> {
  authorization: ProviderReplayAuthorization
  candidates: ProviderExecutionCandidate<T>[]
}

export interface AuthorizedProviderReplayOptions
  extends ProviderExecutionGuardOptions {
  recoveryQueue: InMemoryProviderRecoveryQueue
  idempotencyGuard:
    InMemoryProviderReplayIdempotencyGuard
}

export interface AuthorizedProviderReplaySuccess<T> {
  ok: true
  replayKey: string
  execution: ProviderExecutionSuccess<T>
  queueItem: ProviderRecoveryQueueItem
}

export interface AuthorizedProviderReplayFailure {
  ok: false
  code:
    | "REPLAY_NOT_AUTHORIZED"
    | "REPLAY_AUTHORIZATION_MISMATCH"
    | "REPLAY_ALREADY_IN_FLIGHT"
    | "REPLAY_ALREADY_COMPLETED"
    | "REPLAY_EXECUTION_FAILED"
  replayKey: string
  execution?: ProviderExecutionFailure
  queueItem: ProviderRecoveryQueueItem | null
}

export type AuthorizedProviderReplayResult<T> =
  | AuthorizedProviderReplaySuccess<T>
  | AuthorizedProviderReplayFailure

const createReplayKey = (
  authorization: ProviderReplayAuthorization,
): string =>
  [
    authorization.tenantId,
    authorization.queueItemId,
    authorization.operationId,
    authorization.providerDomain,
    authorization.authorizedBy,
    authorization.authorizedAt,
  ].join(":")

const authorizationMatchesQueueItem = (
  authorization: ProviderReplayAuthorization,
  queueItem: ProviderRecoveryQueueItem,
): boolean =>
  queueItem.queueItemId === authorization.queueItemId &&
  queueItem.operationId === authorization.operationId &&
  queueItem.tenantId === authorization.tenantId &&
  queueItem.providerDomain ===
    authorization.providerDomain &&
  queueItem.replayAuthorizedAt ===
    authorization.authorizedAt &&
  queueItem.ownerDecision?.decision === "approved" &&
  queueItem.ownerDecision.ownerId ===
    authorization.authorizedBy

export const executeAuthorizedProviderReplay =
  async <T>(
    operation: AuthorizedProviderReplayOperation<T>,
    options: AuthorizedProviderReplayOptions,
  ): Promise<AuthorizedProviderReplayResult<T>> => {
    const replayKey = createReplayKey(
      operation.authorization,
    )

    const existingState =
      options.idempotencyGuard.getState(replayKey)

    if (existingState === "in-flight") {
      return {
        ok: false,
        code: "REPLAY_ALREADY_IN_FLIGHT",
        replayKey,
        queueItem: options.recoveryQueue.getForTenant(
          operation.authorization.queueItemId,
          operation.authorization.tenantId,
        ),
      }
    }

    if (existingState === "completed") {
      return {
        ok: false,
        code: "REPLAY_ALREADY_COMPLETED",
        replayKey,
        queueItem: options.recoveryQueue.getForTenant(
          operation.authorization.queueItemId,
          operation.authorization.tenantId,
        ),
      }
    }

    const queueItem =
      options.recoveryQueue.getForTenant(
        operation.authorization.queueItemId,
        operation.authorization.tenantId,
      )

    if (
      !queueItem ||
      queueItem.status !== "replay-authorized" ||
      queueItem.replayAuthorizedAt === null
    ) {
      return {
        ok: false,
        code: "REPLAY_NOT_AUTHORIZED",
        replayKey,
        queueItem,
      }
    }

    if (
      !authorizationMatchesQueueItem(
        operation.authorization,
        queueItem,
      )
    ) {
      return {
        ok: false,
        code: "REPLAY_AUTHORIZATION_MISMATCH",
        replayKey,
        queueItem,
      }
    }

    if (!options.idempotencyGuard.begin(replayKey)) {
      const state =
        options.idempotencyGuard.getState(replayKey)

      return {
        ok: false,
        code:
          state === "completed"
            ? "REPLAY_ALREADY_COMPLETED"
            : "REPLAY_ALREADY_IN_FLIGHT",
        replayKey,
        queueItem,
      }
    }

    try {
      const execution =
        await executeWithProviderContinuity(
          operation.candidates,
          options,
        )

      if (!execution.ok) {
        options.idempotencyGuard.releaseFailedAttempt(
          replayKey,
        )

        return {
          ok: false,
          code: "REPLAY_EXECUTION_FAILED",
          replayKey,
          execution,
          queueItem:
            options.recoveryQueue.getForTenant(
              operation.authorization.queueItemId,
              operation.authorization.tenantId,
            ),
        }
      }

      const completedQueueItem =
        options.recoveryQueue.markCompleted(
          operation.authorization.queueItemId,
          operation.authorization.tenantId,
        )

      options.idempotencyGuard.markCompleted(replayKey)

      return {
        ok: true,
        replayKey,
        execution,
        queueItem: completedQueueItem,
      }
    } catch (error: unknown) {
      options.idempotencyGuard.releaseFailedAttempt(
        replayKey,
      )

      throw error
    }
  }
