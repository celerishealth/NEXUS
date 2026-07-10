import type {
  DurableActiveProviderContainment,
  DurableProviderContainmentReader,
} from "./durableProviderContainmentReader"
import type {
  ProviderContinuityDurableStore,
  ProviderContinuityLease,
} from "./providerContinuityDurableStore"
import {
  assertLeaseSafeContinuityStore,
} from "./providerContinuityDurableStore"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export interface DurableProviderExecutionInput {
  tenantId: string
  providerDomain: ProviderDomain
  operationId: string
  leaseId: string
  workerId: string
  leaseTtlMs: number
  executionTimeoutMs: number
  safetyMarginMs?: number
}

export interface DurableProviderExecutionContext {
  tenantId: string
  providerDomain: ProviderDomain
  operationId: string
  idempotencyKey: string
  leaseId: string
  workerId: string
  fenceToken: number
  leaseExpiresAt: number
  signal: AbortSignal
}

export type DurableProviderExecutionResult<T> =
  | {
      outcome: "executed"
      code: "DURABLE_PROVIDER_EXECUTION_SUCCEEDED"
      value: T
      context: Omit<
        DurableProviderExecutionContext,
        "signal"
      >
      leaseReleased: boolean
    }
  | {
      outcome: "blocked"
      code:
        | "CONTINUITY_LEASE_ALREADY_HELD"
        | "DURABLE_PROVIDER_DOMAIN_CONTAINED"
        | "LEASE_SAFETY_WINDOW_EXHAUSTED"
      activeContainments:
        DurableActiveProviderContainment[]
      activeLease: ProviderContinuityLease | null
      leaseReleased: boolean | null
    }
  | {
      outcome: "failed"
      code:
        | "PROVIDER_EXECUTION_TIMEOUT"
        | "PROVIDER_EXECUTION_FAILED"
      errorName: string
      idempotencyKey: string
      fenceToken: number
      leaseReleased: boolean
      automaticRetryAuthorized: false
    }

export interface DurableProviderExecutionGuardOptions {
  store: ProviderContinuityDurableStore
  containmentReader:
    DurableProviderContainmentReader
  now?: () => number
}

class ProviderExecutionTimeoutError
  extends Error
{
  constructor(timeoutMs: number) {
    super(
      `provider operation exceeded timeout of ${timeoutMs}ms`,
    )
    this.name =
      "ProviderExecutionTimeoutError"
  }
}

const requireValue = (
  value: string,
  fieldName: string,
): string => {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`)
  }

  return normalizedValue
}

const requirePositiveInteger = (
  value: number,
  fieldName: string,
): number => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(
      `${fieldName} must be a positive integer`,
    )
  }

  return value
}

const requireNonNegativeInteger = (
  value: number,
  fieldName: string,
): number => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      `${fieldName} must be a non-negative integer`,
    )
  }

  return value
}

const createIdempotencyKey = (
  tenantId: string,
  providerDomain: ProviderDomain,
  operationId: string,
): string =>
  [
    "nexus-provider-operation-v1",
    tenantId,
    providerDomain,
    operationId,
  ]
    .map(
      (part) =>
        `${part.length}:${part}`,
    )
    .join("|")

const runAbortableOperation = async <T>(
  timeoutMs: number,
  operation: (
    signal: AbortSignal,
  ) => Promise<T>,
): Promise<T> => {
  const controller = new AbortController()

  let timeoutHandle:
    | ReturnType<typeof setTimeout>
    | undefined

  const timeoutPromise =
    new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        controller.abort()

        reject(
          new ProviderExecutionTimeoutError(
            timeoutMs,
          ),
        )
      }, timeoutMs)
    })

  try {
    return await Promise.race([
      Promise.resolve().then(() =>
        operation(controller.signal),
      ),
      timeoutPromise,
    ])
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
    }
  }
}

export class DurableProviderExecutionGuard {
  private readonly now: () => number

  constructor(
    private readonly store:
      ProviderContinuityDurableStore,
    private readonly containmentReader:
      DurableProviderContainmentReader,
    now: () => number = Date.now,
  ) {
    assertLeaseSafeContinuityStore(store)
    this.now = now
  }

  async execute<T>(
    input: DurableProviderExecutionInput,
    operation: (
      context:
        DurableProviderExecutionContext,
    ) => Promise<T>,
  ): Promise<
    DurableProviderExecutionResult<T>
  > {
    const tenantId = requireValue(
      input.tenantId,
      "tenantId",
    )
    const operationId = requireValue(
      input.operationId,
      "operationId",
    )
    const leaseId = requireValue(
      input.leaseId,
      "leaseId",
    )
    const workerId = requireValue(
      input.workerId,
      "workerId",
    )

    const leaseTtlMs =
      requirePositiveInteger(
        input.leaseTtlMs,
        "leaseTtlMs",
      )

    const executionTimeoutMs =
      requirePositiveInteger(
        input.executionTimeoutMs,
        "executionTimeoutMs",
      )

    const safetyMarginMs =
      requireNonNegativeInteger(
        input.safetyMarginMs ?? 1_000,
        "safetyMarginMs",
      )

    if (
      executionTimeoutMs +
        safetyMarginMs >=
      leaseTtlMs
    ) {
      throw new Error(
        "leaseTtlMs must exceed executionTimeoutMs plus safetyMarginMs",
      )
    }

    const acquired =
      await this.store.acquireLease({
        tenantId,
        providerDomain:
          input.providerDomain,
        leaseId,
        ownerId: workerId,
        ttlMs: leaseTtlMs,
        now: this.now(),
      })

    if (!acquired.acquired) {
      return {
        outcome: "blocked",
        code:
          "CONTINUITY_LEASE_ALREADY_HELD",
        activeContainments: [],
        activeLease:
          acquired.activeLease,
        leaseReleased: null,
      }
    }

    let leaseReleased = false

    try {
      const activeContainments =
        await this.containmentReader.listActive(
          tenantId,
          input.providerDomain,
        )

      if (activeContainments.length > 0) {
        leaseReleased =
          await this.store.releaseLease({
            lease: acquired.lease,
            now: this.now(),
          })

        return {
          outcome: "blocked",
          code:
            "DURABLE_PROVIDER_DOMAIN_CONTAINED",
          activeContainments,
          activeLease: acquired.lease,
          leaseReleased,
        }
      }

      const executionStartTime =
        this.now()

      const remainingLeaseMs =
        acquired.lease.expiresAt -
        executionStartTime

      if (
        remainingLeaseMs <=
        executionTimeoutMs +
          safetyMarginMs
      ) {
        leaseReleased =
          await this.store.releaseLease({
            lease: acquired.lease,
            now: this.now(),
          })

        return {
          outcome: "blocked",
          code:
            "LEASE_SAFETY_WINDOW_EXHAUSTED",
          activeContainments: [],
          activeLease: acquired.lease,
          leaseReleased,
        }
      }

      const idempotencyKey =
        createIdempotencyKey(
          tenantId,
          input.providerDomain,
          operationId,
        )

      const context:
        DurableProviderExecutionContext = {
        tenantId,
        providerDomain:
          input.providerDomain,
        operationId,
        idempotencyKey,
        leaseId:
          acquired.lease.leaseId,
        workerId:
          acquired.lease.ownerId,
        fenceToken:
          acquired.lease.fenceToken,
        leaseExpiresAt:
          acquired.lease.expiresAt,
        signal:
          new AbortController().signal,
      }

      try {
        const value =
          await runAbortableOperation(
            executionTimeoutMs,
            (signal) =>
              operation({
                ...context,
                signal,
              }),
          )

        leaseReleased =
          await this.store.releaseLease({
            lease: acquired.lease,
            now: this.now(),
          })

        return {
          outcome: "executed",
          code:
            "DURABLE_PROVIDER_EXECUTION_SUCCEEDED",
          value,
          context: {
            tenantId:
              context.tenantId,
            providerDomain:
              context.providerDomain,
            operationId:
              context.operationId,
            idempotencyKey:
              context.idempotencyKey,
            leaseId:
              context.leaseId,
            workerId:
              context.workerId,
            fenceToken:
              context.fenceToken,
            leaseExpiresAt:
              context.leaseExpiresAt,
          },
          leaseReleased,
        }
      } catch (error: unknown) {
        leaseReleased =
          await this.store.releaseLease({
            lease: acquired.lease,
            now: this.now(),
          })

        const timedOut =
          error instanceof
          ProviderExecutionTimeoutError

        return {
          outcome: "failed",
          code: timedOut
            ? "PROVIDER_EXECUTION_TIMEOUT"
            : "PROVIDER_EXECUTION_FAILED",
          errorName:
            error instanceof Error
              ? error.name
              : "UnknownProviderExecutionError",
          idempotencyKey,
          fenceToken:
            acquired.lease.fenceToken,
          leaseReleased,
          automaticRetryAuthorized: false,
        }
      }
    } catch (error: unknown) {
      if (!leaseReleased) {
        await this.store.releaseLease({
          lease: acquired.lease,
          now: this.now(),
        })
      }

      throw error
    }
  }
}

export const createDurableProviderExecutionGuard =
  (
    options:
      DurableProviderExecutionGuardOptions,
  ): DurableProviderExecutionGuard =>
    new DurableProviderExecutionGuard(
      options.store,
      options.containmentReader,
      options.now,
    )
