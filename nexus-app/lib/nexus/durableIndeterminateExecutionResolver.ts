import {
  assertLeaseSafeContinuityStore,
  type ProviderContinuityDurableRecord,
  type ProviderContinuityDurableStore,
} from "./providerContinuityDurableStore"
import {
  createDurableProviderExecutionIdempotencyKey,
  createDurableProviderExecutionReceiptScope,
  validateDurableProviderExecutionReceipt,
  type DurableProviderExecutionReceiptPayload,
} from "./durableProviderExecutionGuard"
import {
  type ProviderOwnerResolutionAuthority,
  type ProviderOwnerResolutionDecision,
} from "./providerOwnerResolutionAuthority"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type IndeterminateExecutionResolutionDecision =
  ProviderOwnerResolutionDecision

export interface ResolveIndeterminateExecutionInput {
  tenantId: string
  providerDomain: ProviderDomain
  operationId: string
  decision:
    IndeterminateExecutionResolutionDecision
  authorizationToken: string
  leaseId: string
  workerId: string
  leaseTtlMs: number
}

export type ResolveIndeterminateExecutionResult =
  | {
      outcome: "applied"
      code:
        | "EXECUTION_CONFIRMED_COMPLETED"
        | "SINGLE_RETRY_AUTHORIZED"
      receipt:
        ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>
      leaseReleased: boolean
    }
  | {
      outcome: "idempotent"
      code:
        | "EXECUTION_ALREADY_COMPLETED"
        | "SINGLE_RETRY_ALREADY_AUTHORIZED"
      receipt:
        ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>
      leaseReleased: boolean
    }
  | {
      outcome: "blocked"
      code:
        | "CONTINUITY_LEASE_ALREADY_HELD"
        | "EXECUTION_RECEIPT_NOT_FOUND"
        | "COMPLETED_RECEIPT_RETRY_BLOCKED"
        | "RECEIPT_ALREADY_RETRY_AUTHORIZED"
        | "RESOLUTION_VERSION_CONFLICT"
        | "RESOLUTION_LEASE_INVALID"
        | "RESOLUTION_STALE_FENCE_TOKEN"
      receipt:
        | ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>
        | null
      leaseReleased: boolean | null
    }

const requireValue = (
  value: string | undefined,
  fieldName: string,
): string => {
  const normalizedValue =
    value?.trim() ?? ""

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

const safeReleaseLease = async (
  store: ProviderContinuityDurableStore,
  lease: {
    leaseId: string
    ownerId: string
    tenantId: string
    providerDomain: ProviderDomain
    fenceToken: number
    acquiredAt: number
    expiresAt: number
  },
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

export class DurableIndeterminateExecutionResolver {
  private readonly now: () => number

  constructor(
    private readonly store:
      ProviderContinuityDurableStore,
    private readonly ownerAuthority:
      ProviderOwnerResolutionAuthority,
    now: () => number = Date.now,
  ) {
    assertLeaseSafeContinuityStore(store)
    this.now = now
  }

  async resolve(
    input: ResolveIndeterminateExecutionInput,
  ): Promise<
    ResolveIndeterminateExecutionResult
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

    const authorization =
      this.ownerAuthority.verify({
        token: input.authorizationToken,
        tenantId,
        providerDomain:
          input.providerDomain,
        operationId,
        decision: input.decision,
      })

    const ownerId =
      authorization.ownerId
    const reason =
      authorization.reason
    const verificationReference =
      authorization.verificationReference
    const retryAuthorizationId =
      authorization.retryAuthorizationId

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
        receipt: null,
        leaseReleased: null,
      }
    }

    try {
      const idempotencyKey =
        createDurableProviderExecutionIdempotencyKey(
          tenantId,
          input.providerDomain,
          operationId,
        )

      const scope =
        createDurableProviderExecutionReceiptScope(
          tenantId,
          input.providerDomain,
          idempotencyKey,
        )

      const storedReceipt =
        await this.store.read<DurableProviderExecutionReceiptPayload>(
          scope,
        )

      if (!storedReceipt) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            acquired.lease,
            this.now,
          )

        return {
          outcome: "blocked",
          code:
            "EXECUTION_RECEIPT_NOT_FOUND",
          receipt: null,
          leaseReleased,
        }
      }

      const receipt =
        validateDurableProviderExecutionReceipt(
          storedReceipt,
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
            acquired.lease,
            this.now,
          )

        if (
          input.decision ===
          "confirm-completed"
        ) {
          return {
            outcome: "idempotent",
            code:
              "EXECUTION_ALREADY_COMPLETED",
            receipt,
            leaseReleased,
          }
        }

        return {
          outcome: "blocked",
          code:
            "COMPLETED_RECEIPT_RETRY_BLOCKED",
          receipt,
          leaseReleased,
        }
      }

      if (
        receipt.payload.status ===
          "retry-authorized" &&
        input.decision ===
          "authorize-single-retry"
      ) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            acquired.lease,
            this.now,
          )

        if (
          receipt.payload
            .retryAuthorizationId ===
              retryAuthorizationId &&
          receipt.payload
            .retryAuthorizedBy ===
              ownerId &&
          receipt.payload
            .verificationReference ===
              verificationReference
        ) {
          return {
            outcome: "idempotent",
            code:
              "SINGLE_RETRY_ALREADY_AUTHORIZED",
            receipt,
            leaseReleased,
          }
        }

        return {
          outcome: "blocked",
          code:
            "RECEIPT_ALREADY_RETRY_AUTHORIZED",
          receipt,
          leaseReleased,
        }
      }

      const resolutionTime = this.now()

      const nextPayload:
        DurableProviderExecutionReceiptPayload =
        input.decision ===
        "confirm-completed"
          ? {
              ...receipt.payload,
              status: "completed",
              ownerId,
              reason,
              completedAt:
                resolutionTime,
              verificationReference,
            }
          : {
              ...receipt.payload,
              status:
                "retry-authorized",
              ownerId,
              reason,
              completedAt: null,
              retryAuthorizationId,
              retryAuthorizedBy:
                ownerId,
              retryAuthorizedAt:
                resolutionTime,
              verificationReference,
            }

      const mutation =
        await this.store.compareAndSwap({
          scope,
          expectedVersion:
            receipt.version,
          payload: nextPayload,
          lease: acquired.lease,
          now: resolutionTime,
        })

      if (!mutation.applied) {
        const leaseReleased =
          await safeReleaseLease(
            this.store,
            acquired.lease,
            this.now,
          )

        return {
          outcome: "blocked",
          code:
            mutation.code ===
            "VERSION_CONFLICT"
              ? "RESOLUTION_VERSION_CONFLICT"
              : mutation.code ===
                "LEASE_INVALID"
                ? "RESOLUTION_LEASE_INVALID"
                : "RESOLUTION_STALE_FENCE_TOKEN",
          receipt:
            mutation.currentRecord
              ? validateDurableProviderExecutionReceipt(
                  mutation.currentRecord as
                    ProviderContinuityDurableRecord<DurableProviderExecutionReceiptPayload>,
                  {
                    operationId,
                    idempotencyKey,
                  },
                )
              : null,
          leaseReleased,
        }
      }

      const leaseReleased =
        await safeReleaseLease(
          this.store,
          acquired.lease,
          this.now,
        )

      return {
        outcome: "applied",
        code:
          input.decision ===
          "confirm-completed"
            ? "EXECUTION_CONFIRMED_COMPLETED"
            : "SINGLE_RETRY_AUTHORIZED",
        receipt: mutation.record,
        leaseReleased,
      }
    } catch (error: unknown) {
      await safeReleaseLease(
        this.store,
        acquired.lease,
        this.now,
      )

      throw error
    }
  }
}

export const createDurableIndeterminateExecutionResolver =
  (
    store: ProviderContinuityDurableStore,
    ownerAuthority:
      ProviderOwnerResolutionAuthority,
    now?: () => number,
  ): DurableIndeterminateExecutionResolver =>
    new DurableIndeterminateExecutionResolver(
      store,
      ownerAuthority,
      now,
    )
