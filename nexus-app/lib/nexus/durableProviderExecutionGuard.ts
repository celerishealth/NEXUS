import type {
  DurableActiveProviderContainment,
  DurableProviderContainmentReader,
} from "./durableProviderContainmentReader"
import {
  assertLeaseSafeContinuityStore,
  type CompareAndSwapProviderContinuityResult,
  type ProviderContinuityDurableRecord,
  type ProviderContinuityDurableStore,
  type ProviderContinuityJsonValue,
  type ProviderContinuityLease,
  type ProviderContinuityRecordScope,
} from "./providerContinuityDurableStore"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type DurableProviderExecutionReceiptStatus =
  | "in-flight"
  | "retry-authorized"
  | "completed"

export type DurableProviderExecutionReceiptPayload = {
  status: DurableProviderExecutionReceiptStatus
  operationId: string
  ownerId: string
  reason: string
  idempotencyKey: string
  fenceToken: number
  startedAt: number
  completedAt: number | null
  retryAuthorizationId: string | null
  retryAuthorizedBy: string | null
  retryAuthorizedAt: number | null
  verificationReference: string | null
  [key: string]: ProviderContinuityJsonValue
}

export interface DurableProviderManualRetryAuthorization {
  authorizationId: string
  ownerId: string
}

export interface DurableProviderExecutionInput {
  tenantId: string
  providerDomain: ProviderDomain
  operationId: string
  leaseId: string
  workerId: string
  leaseTtlMs: number
  executionTimeoutMs: number
  safetyMarginMs?: number
  manualRetryAuthorization?:
    DurableProviderManualRetryAuthorization
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
      receiptVersion: number
      leaseReleased: boolean
    }
  | {
      outcome: "blocked"
      code:
        | "CONTINUITY_LEASE_ALREADY_HELD"
        | "DURABLE_PROVIDER_DOMAIN_CONTAINED"
        | "LEASE_SAFETY_WINDOW_EXHAUSTED"
        | "PROVIDER_OPERATION_ALREADY_COMPLETED"
        | "PROVIDER_OPERATION_INDETERMINATE"
        | "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_REQUIRED"
        | "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_MISMATCH"
      activeContainments:
        DurableActiveProviderContainment[]
      activeLease: ProviderContinuityLease | null
      receipt:
        | ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>
        | null
      leaseReleased: boolean | null
      automaticRetryAuthorized: false
      manualResolutionRequired: boolean
    }
  | {
      outcome: "failed"
      code:
        | "PROVIDER_EXECUTION_TIMEOUT"
        | "PROVIDER_EXECUTION_FAILED"
      errorName: string
      idempotencyKey: string
      fenceToken: number
      receiptVersion: number
      leaseReleased: boolean
      automaticRetryAuthorized: false
      manualResolutionRequired: true
    }
  | {
      outcome: "indeterminate"
      code:
        "PROVIDER_EXECUTION_SUCCEEDED_RECEIPT_NOT_COMMITTED"
      receiptCommitCode:
        | "VERSION_CONFLICT"
        | "LEASE_INVALID"
        | "STALE_FENCE_TOKEN"
        | "RECEIPT_COMMIT_ERROR"
      idempotencyKey: string
      fenceToken: number
      leaseReleased: boolean
      automaticRetryAuthorized: false
      manualResolutionRequired: true
    }

export interface DurableProviderExecutionGuardOptions {
  store: ProviderContinuityDurableStore
  containmentReader:
    DurableProviderContainmentReader
  now?: () => number
}

export type DurableProviderExecutionReceiptErrorCode =
  | "MALFORMED_EXECUTION_RECEIPT"
  | "EXECUTION_RECEIPT_SCOPE_MISMATCH"
  | "EXECUTION_RECEIPT_CLAIM_FAILED"

export class DurableProviderExecutionReceiptError
  extends Error
{
  constructor(
    readonly code:
      DurableProviderExecutionReceiptErrorCode,
    message: string,
  ) {
    super(message)
    this.name =
      "DurableProviderExecutionReceiptError"
  }
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

const readOptionalString = (
  value: unknown,
  fieldName: string,
): string | null => {
  if (value === null || value === undefined) {
    return null
  }

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new DurableProviderExecutionReceiptError(
      "MALFORMED_EXECUTION_RECEIPT",
      `invalid durable execution receipt field: ${fieldName}`,
    )
  }

  return value
}

const readOptionalTimestamp = (
  value: unknown,
  fieldName: string,
): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new DurableProviderExecutionReceiptError(
      "MALFORMED_EXECUTION_RECEIPT",
      `invalid durable execution receipt field: ${fieldName}`,
    )
  }

  return value
}

export const createDurableProviderExecutionIdempotencyKey = (
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

export const createDurableProviderExecutionReceiptScope = (
  tenantId: string,
  providerDomain: ProviderDomain,
  idempotencyKey: string,
): ProviderContinuityRecordScope => ({
  tenantId,
  providerDomain,
  kind: "replay-idempotency",
  recordId: idempotencyKey,
})

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

export const validateDurableProviderExecutionReceipt = (
  record:
    ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>,
  expected: {
    operationId: string
    idempotencyKey: string
  },
): ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload> => {
  const payload = record.payload

  if (
    (
      payload.status !== "in-flight" &&
      payload.status !== "retry-authorized" &&
      payload.status !== "completed"
    ) ||
    typeof payload.operationId !== "string" ||
    payload.operationId.trim().length === 0 ||
    typeof payload.ownerId !== "string" ||
    payload.ownerId.trim().length === 0 ||
    typeof payload.reason !== "string" ||
    payload.reason.trim().length === 0 ||
    typeof payload.idempotencyKey !== "string" ||
    payload.idempotencyKey.trim().length === 0 ||
    typeof payload.fenceToken !== "number" ||
    !Number.isInteger(payload.fenceToken) ||
    payload.fenceToken < 1 ||
    typeof payload.startedAt !== "number" ||
    !Number.isFinite(payload.startedAt) ||
    payload.startedAt < 0
  ) {
    throw new DurableProviderExecutionReceiptError(
      "MALFORMED_EXECUTION_RECEIPT",
      "durable provider execution receipt is malformed",
    )
  }

  const completedAt = readOptionalTimestamp(
    payload.completedAt,
    "completedAt",
  )

  const retryAuthorizationId =
    readOptionalString(
      payload.retryAuthorizationId,
      "retryAuthorizationId",
    )

  const retryAuthorizedBy =
    readOptionalString(
      payload.retryAuthorizedBy,
      "retryAuthorizedBy",
    )

  const retryAuthorizedAt =
    readOptionalTimestamp(
      payload.retryAuthorizedAt,
      "retryAuthorizedAt",
    )

  const verificationReference =
    readOptionalString(
      payload.verificationReference,
      "verificationReference",
    )

  if (
    payload.status === "retry-authorized" &&
    (
      !retryAuthorizationId ||
      !retryAuthorizedBy ||
      retryAuthorizedAt === null ||
      !verificationReference
    )
  ) {
    throw new DurableProviderExecutionReceiptError(
      "MALFORMED_EXECUTION_RECEIPT",
      "manual retry receipt is missing owner authorization evidence",
    )
  }

  if (
    payload.status === "completed" &&
    completedAt === null
  ) {
    throw new DurableProviderExecutionReceiptError(
      "MALFORMED_EXECUTION_RECEIPT",
      "completed execution receipt is missing completedAt",
    )
  }

  if (
    payload.operationId !==
      expected.operationId ||
    payload.idempotencyKey !==
      expected.idempotencyKey
  ) {
    throw new DurableProviderExecutionReceiptError(
      "EXECUTION_RECEIPT_SCOPE_MISMATCH",
      "durable provider execution receipt does not match the requested operation",
    )
  }

  return {
    ...record,
    payload: {
      ...payload,
      completedAt,
      retryAuthorizationId,
      retryAuthorizedBy,
      retryAuthorizedAt,
      verificationReference,
    },
  }
}

const safeReleaseLease = async (
  store: ProviderContinuityDurableStore,
  lease: ProviderContinuityLease,
  now: () => number,
): Promise<boolean> => {
  try {
    return await store.releaseLease({
      lease,
      now: now(),
    })
  } catch {
    return false
  }
}

const createReceiptBlockedResult = (
  receipt:
    ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>,
  lease: ProviderContinuityLease,
  leaseReleased: boolean,
  code:
    | "PROVIDER_OPERATION_ALREADY_COMPLETED"
    | "PROVIDER_OPERATION_INDETERMINATE"
    | "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_REQUIRED"
    | "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_MISMATCH",
  manualResolutionRequired: boolean,
): DurableProviderExecutionResult<never> => ({
  outcome: "blocked",
  code,
  activeContainments: [],
  activeLease: lease,
  receipt,
  leaseReleased,
  automaticRetryAuthorized: false,
  manualResolutionRequired,
})

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
        receipt: null,
        leaseReleased: null,
        automaticRetryAuthorized: false,
        manualResolutionRequired: false,
      }
    }

    const lease = acquired.lease
    let callbackStarted = false

    try {
      const activeContainments =
        await this.containmentReader.listActive(
          tenantId,
          input.providerDomain,
        )

      if (activeContainments.length > 0) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            lease,
            this.now,
          )

        return {
          outcome: "blocked",
          code:
            "DURABLE_PROVIDER_DOMAIN_CONTAINED",
          activeContainments,
          activeLease: lease,
          receipt: null,
          leaseReleased,
          automaticRetryAuthorized: false,
          manualResolutionRequired: true,
        }
      }

      const executionStartTime =
        this.now()

      const remainingLeaseMs =
        lease.expiresAt -
        executionStartTime

      if (
        remainingLeaseMs <=
        executionTimeoutMs +
          safetyMarginMs
      ) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            lease,
            this.now,
          )

        return {
          outcome: "blocked",
          code:
            "LEASE_SAFETY_WINDOW_EXHAUSTED",
          activeContainments: [],
          activeLease: lease,
          receipt: null,
          leaseReleased,
          automaticRetryAuthorized: false,
          manualResolutionRequired: false,
        }
      }

      const idempotencyKey =
        createDurableProviderExecutionIdempotencyKey(
          tenantId,
          input.providerDomain,
          operationId,
        )

      const receiptScope =
        createDurableProviderExecutionReceiptScope(
          tenantId,
          input.providerDomain,
          idempotencyKey,
        )

      const existingReceipt =
        await this.store.read<DurableProviderExecutionReceiptPayload>(
          receiptScope,
        )

      let claimRecord:
        ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>

      if (existingReceipt) {
        const receipt =
          validateDurableProviderExecutionReceipt(
            existingReceipt,
            {
              operationId,
              idempotencyKey,
            },
          )

        if (
          receipt.payload.status ===
          "completed"
        ) {
          const leaseReleased =
            await safeReleaseLease(
              this.store,
              lease,
              this.now,
            )

          return createReceiptBlockedResult(
            receipt,
            lease,
            leaseReleased,
            "PROVIDER_OPERATION_ALREADY_COMPLETED",
            false,
          ) as DurableProviderExecutionResult<T>
        }

        if (
          receipt.payload.status ===
          "in-flight"
        ) {
          const leaseReleased =
            await safeReleaseLease(
              this.store,
              lease,
              this.now,
            )

          return createReceiptBlockedResult(
            receipt,
            lease,
            leaseReleased,
            "PROVIDER_OPERATION_INDETERMINATE",
            true,
          ) as DurableProviderExecutionResult<T>
        }

        if (
          !input.manualRetryAuthorization
        ) {
          const leaseReleased =
            await safeReleaseLease(
              this.store,
              lease,
              this.now,
            )

          return createReceiptBlockedResult(
            receipt,
            lease,
            leaseReleased,
            "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_REQUIRED",
            true,
          ) as DurableProviderExecutionResult<T>
        }

        const authorizationId =
          requireValue(
            input.manualRetryAuthorization
              .authorizationId,
            "manualRetryAuthorization.authorizationId",
          )

        const authorizationOwnerId =
          requireValue(
            input.manualRetryAuthorization.ownerId,
            "manualRetryAuthorization.ownerId",
          )

        if (
          receipt.payload
            .retryAuthorizationId !==
              authorizationId ||
          receipt.payload.retryAuthorizedBy !==
              authorizationOwnerId
        ) {
          const leaseReleased =
            await safeReleaseLease(
              this.store,
              lease,
              this.now,
            )

          return createReceiptBlockedResult(
            receipt,
            lease,
            leaseReleased,
            "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_MISMATCH",
            true,
          ) as DurableProviderExecutionResult<T>
        }

        const retryClaim =
          await this.store.compareAndSwap({
            scope: receiptScope,
            expectedVersion:
              receipt.version,
            payload: {
              ...receipt.payload,
              status: "in-flight",
              ownerId: workerId,
              reason:
                "provider-execution-manual-retry-claimed",
              fenceToken:
                lease.fenceToken,
              startedAt:
                executionStartTime,
              completedAt: null,
            },
            lease,
            now: this.now(),
          })

        if (!retryClaim.applied) {
          if (retryClaim.currentRecord) {
            const currentReceipt =
              validateDurableProviderExecutionReceipt(
                retryClaim.currentRecord as
                  ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>,
                {
                  operationId,
                  idempotencyKey,
                },
              )

            const leaseReleased =
              await safeReleaseLease(
                this.store,
                lease,
                this.now,
              )

            return createReceiptBlockedResult(
              currentReceipt,
              lease,
              leaseReleased,
              currentReceipt.payload.status ===
                "completed"
                ? "PROVIDER_OPERATION_ALREADY_COMPLETED"
                : "PROVIDER_OPERATION_INDETERMINATE",
              currentReceipt.payload.status !==
                "completed",
            ) as DurableProviderExecutionResult<T>
          }

          throw new DurableProviderExecutionReceiptError(
            "EXECUTION_RECEIPT_CLAIM_FAILED",
            `manual retry receipt claim failed: ${retryClaim.code}`,
          )
        }

        claimRecord = retryClaim.record
      } else {
        const claimPayload:
          DurableProviderExecutionReceiptPayload =
          {
            status: "in-flight",
            operationId,
            ownerId: workerId,
            reason:
              "provider-execution-claimed",
            idempotencyKey,
            fenceToken:
              lease.fenceToken,
            startedAt:
              executionStartTime,
            completedAt: null,
            retryAuthorizationId: null,
            retryAuthorizedBy: null,
            retryAuthorizedAt: null,
            verificationReference: null,
          }

        const claim =
          await this.store.compareAndSwap({
            scope: receiptScope,
            expectedVersion: null,
            payload: claimPayload,
            lease,
            now: this.now(),
          })

        if (!claim.applied) {
          if (claim.currentRecord) {
            const currentReceipt =
              validateDurableProviderExecutionReceipt(
                claim.currentRecord as
                  ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>,
                {
                  operationId,
                  idempotencyKey,
                },
              )

            const leaseReleased =
              await safeReleaseLease(
                this.store,
                lease,
                this.now,
              )

            return createReceiptBlockedResult(
              currentReceipt,
              lease,
              leaseReleased,
              currentReceipt.payload.status ===
                "completed"
                ? "PROVIDER_OPERATION_ALREADY_COMPLETED"
                : "PROVIDER_OPERATION_INDETERMINATE",
              currentReceipt.payload.status !==
                "completed",
            ) as DurableProviderExecutionResult<T>
          }

          throw new DurableProviderExecutionReceiptError(
            "EXECUTION_RECEIPT_CLAIM_FAILED",
            `durable provider execution receipt claim failed: ${claim.code}`,
          )
        }

        claimRecord = claim.record
      }

      const context:
        Omit<
          DurableProviderExecutionContext,
          "signal"
        > = {
        tenantId,
        providerDomain:
          input.providerDomain,
        operationId,
        idempotencyKey,
        leaseId: lease.leaseId,
        workerId: lease.ownerId,
        fenceToken:
          lease.fenceToken,
        leaseExpiresAt:
          lease.expiresAt,
      }

      let value: T

      try {
        callbackStarted = true

        value =
          await runAbortableOperation(
            executionTimeoutMs,
            (signal) =>
              operation({
                ...context,
                signal,
              }),
          )
      } catch (error: unknown) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            lease,
            this.now,
          )

        return {
          outcome: "failed",
          code:
            error instanceof
            ProviderExecutionTimeoutError
              ? "PROVIDER_EXECUTION_TIMEOUT"
              : "PROVIDER_EXECUTION_FAILED",
          errorName:
            error instanceof Error
              ? error.name
              : "UnknownProviderExecutionError",
          idempotencyKey,
          fenceToken:
            lease.fenceToken,
          receiptVersion:
            claimRecord.version,
          leaseReleased,
          automaticRetryAuthorized: false,
          manualResolutionRequired: true,
        }
      }

      const completedAt = this.now()

      const completedPayload:
        DurableProviderExecutionReceiptPayload =
        {
          ...claimRecord.payload,
          status: "completed",
          reason:
            "provider-execution-completed",
          completedAt,
        }

      let completion:
        | CompareAndSwapProviderContinuityResult<DurableProviderExecutionReceiptPayload>
        | null = null

      try {
        completion =
          await this.store.compareAndSwap({
            scope: receiptScope,
            expectedVersion:
              claimRecord.version,
            payload: completedPayload,
            lease,
            now: completedAt,
          })
      } catch {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            lease,
            this.now,
          )

        return {
          outcome: "indeterminate",
          code:
            "PROVIDER_EXECUTION_SUCCEEDED_RECEIPT_NOT_COMMITTED",
          receiptCommitCode:
            "RECEIPT_COMMIT_ERROR",
          idempotencyKey,
          fenceToken:
            lease.fenceToken,
          leaseReleased,
          automaticRetryAuthorized: false,
          manualResolutionRequired: true,
        }
      }

      if (!completion.applied) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            lease,
            this.now,
          )

        return {
          outcome: "indeterminate",
          code:
            "PROVIDER_EXECUTION_SUCCEEDED_RECEIPT_NOT_COMMITTED",
          receiptCommitCode:
            completion.code,
          idempotencyKey,
          fenceToken:
            lease.fenceToken,
          leaseReleased,
          automaticRetryAuthorized: false,
          manualResolutionRequired: true,
        }
      }

      const leaseReleased =
        await safeReleaseLease(
          this.store,
          lease,
          this.now,
        )

      return {
        outcome: "executed",
        code:
          "DURABLE_PROVIDER_EXECUTION_SUCCEEDED",
        value,
        context,
        receiptVersion:
          completion.record.version,
        leaseReleased,
      }
    } catch (error: unknown) {
      if (!callbackStarted) {
        await safeReleaseLease(
          this.store,
          lease,
          this.now,
        )
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
