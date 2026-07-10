import {
  executeProviderOperationWithRecoveryQueue,
  type ProviderContinuityCoordinatorOptions,
  type ProviderContinuityCoordinatorResult,
  type ProviderContinuityOperation,
} from "./providerContinuityCoordinator"
import {
  InMemoryProviderContinuityTelemetry,
  type ProviderContinuityEventLevel,
  type ProviderContinuityEventType,
} from "./providerContinuityTelemetry"

export interface ObservedProviderContinuityOptions
  extends ProviderContinuityCoordinatorOptions {
  traceId: string
  telemetry: InMemoryProviderContinuityTelemetry
}

const requireTraceId = (traceId: string): string => {
  const normalizedTraceId = traceId.trim()

  if (!normalizedTraceId) {
    throw new Error("traceId is required")
  }

  return normalizedTraceId
}

const attemptEventType = (
  status: "succeeded" | "failed" | "skipped",
): ProviderContinuityEventType => {
  if (status === "succeeded") {
    return "provider-attempt-succeeded"
  }

  if (status === "failed") {
    return "provider-attempt-failed"
  }

  return "provider-attempt-skipped"
}

const attemptEventLevel = (
  status: "succeeded" | "failed" | "skipped",
): ProviderContinuityEventLevel => {
  if (status === "succeeded") {
    return "success"
  }

  if (status === "failed") {
    return "failure"
  }

  return "warning"
}

export const executeObservedProviderOperation =
  async <T>(
    operation: ProviderContinuityOperation<T>,
    options: ObservedProviderContinuityOptions,
  ): Promise<ProviderContinuityCoordinatorResult<T>> => {
    const traceId = requireTraceId(options.traceId)

    options.telemetry.record({
      eventId: `${traceId}:operation-started`,
      traceId,
      tenantId: operation.tenantId,
      operationId: operation.operationId,
      providerDomain: operation.providerDomain,
      type: "operation-started",
      level: "info",
      queueItemId: operation.queueItemId,
    })

    const result =
      await executeProviderOperationWithRecoveryQueue(
        operation,
        options,
      )

    result.execution.attempts.forEach(
      (attempt, index) => {
        options.telemetry.record({
          eventId: `${traceId}:attempt:${index}`,
          traceId,
          tenantId: operation.tenantId,
          operationId: operation.operationId,
          providerDomain: operation.providerDomain,
          type: attemptEventType(attempt.status),
          level: attemptEventLevel(attempt.status),
          providerId: attempt.providerId,
          reason: attempt.reason,
          queueItemId: operation.queueItemId,
        })
      },
    )

    if (result.execution.ok) {
      options.telemetry.record({
        eventId: `${traceId}:operation-succeeded`,
        traceId,
        tenantId: operation.tenantId,
        operationId: operation.operationId,
        providerDomain: operation.providerDomain,
        type: "operation-succeeded",
        level: "success",
        providerId: result.execution.providerId,
        reason: "provider-continuity-execution-succeeded",
        queueItemId: operation.queueItemId,
      })

      return result
    }

    options.telemetry.record({
      eventId: `${traceId}:recovery-queued`,
      traceId,
      tenantId: operation.tenantId,
      operationId: operation.operationId,
      providerDomain: operation.providerDomain,
      type: "recovery-queued",
      level: "failure",
      reason: result.execution.code,
      queueItemId:
        result.queuedRecovery?.queueItemId ??
        operation.queueItemId,
    })

    return result
  }
