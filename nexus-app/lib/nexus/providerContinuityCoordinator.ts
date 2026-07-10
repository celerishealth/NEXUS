import {
  executeWithProviderContinuity,
  type ProviderExecutionCandidate,
  type ProviderExecutionGuardOptions,
  type ProviderExecutionResult,
} from "./providerExecutionGuard"
import {
  InMemoryProviderRecoveryQueue,
  type ProviderDomain,
  type ProviderRecoveryQueueItem,
} from "./providerRecoveryQueue"

export interface ProviderContinuityOperation<T> {
  queueItemId: string
  operationId: string
  tenantId: string
  providerDomain: ProviderDomain
  candidates: ProviderExecutionCandidate<T>[]
  metadata?: Readonly<Record<string, string>>
}

export interface ProviderContinuityCoordinatorOptions
  extends ProviderExecutionGuardOptions {
  recoveryQueue: InMemoryProviderRecoveryQueue
}

export interface ProviderContinuityCoordinatorResult<T> {
  execution: ProviderExecutionResult<T>
  queuedRecovery: ProviderRecoveryQueueItem | null
}

export const executeProviderOperationWithRecoveryQueue =
  async <T>(
    operation: ProviderContinuityOperation<T>,
    options: ProviderContinuityCoordinatorOptions,
  ): Promise<ProviderContinuityCoordinatorResult<T>> => {
    const execution =
      await executeWithProviderContinuity(
        operation.candidates,
        options,
      )

    if (execution.ok) {
      return {
        execution,
        queuedRecovery: null,
      }
    }

    const queuedRecovery = options.recoveryQueue.enqueue({
      queueItemId: operation.queueItemId,
      operationId: operation.operationId,
      tenantId: operation.tenantId,
      providerDomain: operation.providerDomain,
      failureCode: execution.code,
      attempts: execution.attempts,
      metadata: operation.metadata,
    })

    return {
      execution,
      queuedRecovery,
    }
  }
