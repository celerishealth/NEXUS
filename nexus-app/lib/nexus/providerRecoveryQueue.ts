import type { ProviderExecutionAttempt } from "./providerExecutionGuard"

export type ProviderDomain =
  | "database"
  | "ai"
  | "messaging"
  | "payments"

export type ProviderRecoveryQueueStatus =
  | "pending-owner-approval"
  | "approved"
  | "rejected"
  | "replay-authorized"
  | "completed"

export interface ProviderRecoveryOwnerDecision {
  ownerId: string
  decision: "approved" | "rejected"
  reason: string
  decidedAt: number
}

export interface ProviderReplayAuthorization {
  queueItemId: string
  operationId: string
  tenantId: string
  providerDomain: ProviderDomain
  authorizedBy: string
  authorizedAt: number
}

export interface ProviderRecoveryQueueItem {
  queueItemId: string
  operationId: string
  tenantId: string
  providerDomain: ProviderDomain
  status: ProviderRecoveryQueueStatus
  failureCode: "ALL_PROVIDERS_UNAVAILABLE"
  attempts: ProviderExecutionAttempt[]
  metadata: Readonly<Record<string, string>>
  createdAt: number
  updatedAt: number
  ownerDecision: ProviderRecoveryOwnerDecision | null
  replayAuthorizedAt: number | null
  completedAt: number | null
}

export interface EnqueueProviderRecoveryInput {
  queueItemId: string
  operationId: string
  tenantId: string
  providerDomain: ProviderDomain
  failureCode: "ALL_PROVIDERS_UNAVAILABLE"
  attempts: ProviderExecutionAttempt[]
  metadata?: Readonly<Record<string, string>>
}

export interface ProviderRecoveryDecisionInput {
  queueItemId: string
  tenantId: string
  ownerId: string
  reason: string
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

const cloneAttempts = (
  attempts: ProviderExecutionAttempt[],
): ProviderExecutionAttempt[] =>
  attempts.map((attempt) => ({ ...attempt }))

const cloneQueueItem = (
  item: ProviderRecoveryQueueItem,
): ProviderRecoveryQueueItem => ({
  ...item,
  attempts: cloneAttempts(item.attempts),
  metadata: { ...item.metadata },
  ownerDecision: item.ownerDecision
    ? { ...item.ownerDecision }
    : null,
})

export class InMemoryProviderRecoveryQueue {
  private readonly items =
    new Map<string, ProviderRecoveryQueueItem>()

  constructor(
    private readonly now: () => number = Date.now,
  ) {}

  enqueue(
    input: EnqueueProviderRecoveryInput,
  ): ProviderRecoveryQueueItem {
    const queueItemId = requireValue(
      input.queueItemId,
      "queueItemId",
    )
    const operationId = requireValue(
      input.operationId,
      "operationId",
    )
    const tenantId = requireValue(
      input.tenantId,
      "tenantId",
    )

    const existingItem = this.items.get(queueItemId)

    if (existingItem) {
      const isSameOperation =
        existingItem.operationId === operationId &&
        existingItem.tenantId === tenantId &&
        existingItem.providerDomain === input.providerDomain

      if (!isSameOperation) {
        throw new Error(
          "queueItemId is already assigned to another operation",
        )
      }

      return cloneQueueItem(existingItem)
    }

    const createdAt = this.now()

    const item: ProviderRecoveryQueueItem = {
      queueItemId,
      operationId,
      tenantId,
      providerDomain: input.providerDomain,
      status: "pending-owner-approval",
      failureCode: input.failureCode,
      attempts: cloneAttempts(input.attempts),
      metadata: { ...(input.metadata ?? {}) },
      createdAt,
      updatedAt: createdAt,
      ownerDecision: null,
      replayAuthorizedAt: null,
      completedAt: null,
    }

    this.items.set(queueItemId, item)

    return cloneQueueItem(item)
  }

  getForTenant(
    queueItemId: string,
    tenantId: string,
  ): ProviderRecoveryQueueItem | null {
    const item = this.getTenantItemOrNull(
      queueItemId,
      tenantId,
    )

    return item ? cloneQueueItem(item) : null
  }

  listForTenant(
    tenantId: string,
  ): ProviderRecoveryQueueItem[] {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    return [...this.items.values()]
      .filter(
        (item) => item.tenantId === normalizedTenantId,
      )
      .sort((left, right) => {
        if (left.createdAt !== right.createdAt) {
          return left.createdAt - right.createdAt
        }

        return left.queueItemId.localeCompare(
          right.queueItemId,
        )
      })
      .map(cloneQueueItem)
  }

  approve(
    input: ProviderRecoveryDecisionInput,
  ): ProviderRecoveryQueueItem {
    return this.recordOwnerDecision(input, "approved")
  }

  reject(
    input: ProviderRecoveryDecisionInput,
  ): ProviderRecoveryQueueItem {
    return this.recordOwnerDecision(input, "rejected")
  }

  authorizeReplay(
    input: Omit<
      ProviderRecoveryDecisionInput,
      "reason"
    >,
  ): ProviderReplayAuthorization {
    const item = this.getTenantItem(
      input.queueItemId,
      input.tenantId,
    )
    const ownerId = requireValue(
      input.ownerId,
      "ownerId",
    )

    if (item.status !== "approved") {
      throw new Error(
        "provider recovery must be owner-approved before replay authorization",
      )
    }

    if (
      !item.ownerDecision ||
      item.ownerDecision.decision !== "approved"
    ) {
      throw new Error(
        "approved owner decision is required",
      )
    }

    const authorizedAt = this.now()

    item.status = "replay-authorized"
    item.replayAuthorizedAt = authorizedAt
    item.updatedAt = authorizedAt

    return {
      queueItemId: item.queueItemId,
      operationId: item.operationId,
      tenantId: item.tenantId,
      providerDomain: item.providerDomain,
      authorizedBy: ownerId,
      authorizedAt,
    }
  }

  markCompleted(
    queueItemId: string,
    tenantId: string,
  ): ProviderRecoveryQueueItem {
    const item = this.getTenantItem(
      queueItemId,
      tenantId,
    )

    if (item.status !== "replay-authorized") {
      throw new Error(
        "only a replay-authorized recovery item can be completed",
      )
    }

    const completedAt = this.now()

    item.status = "completed"
    item.completedAt = completedAt
    item.updatedAt = completedAt

    return cloneQueueItem(item)
  }

  private recordOwnerDecision(
    input: ProviderRecoveryDecisionInput,
    decision: "approved" | "rejected",
  ): ProviderRecoveryQueueItem {
    const item = this.getTenantItem(
      input.queueItemId,
      input.tenantId,
    )
    const ownerId = requireValue(
      input.ownerId,
      "ownerId",
    )
    const reason = requireValue(
      input.reason,
      "reason",
    )

    if (item.status !== "pending-owner-approval") {
      throw new Error(
        "owner decision can only be recorded once",
      )
    }

    const decidedAt = this.now()

    item.status =
      decision === "approved"
        ? "approved"
        : "rejected"
    item.ownerDecision = {
      ownerId,
      decision,
      reason,
      decidedAt,
    }
    item.updatedAt = decidedAt

    return cloneQueueItem(item)
  }

  private getTenantItem(
    queueItemId: string,
    tenantId: string,
  ): ProviderRecoveryQueueItem {
    const item = this.getTenantItemOrNull(
      queueItemId,
      tenantId,
    )

    if (!item) {
      throw new Error(
        "provider recovery item was not found for tenant",
      )
    }

    return item
  }

  private getTenantItemOrNull(
    queueItemId: string,
    tenantId: string,
  ): ProviderRecoveryQueueItem | null {
    const normalizedQueueItemId = requireValue(
      queueItemId,
      "queueItemId",
    )
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )
    const item = this.items.get(normalizedQueueItemId)

    if (!item || item.tenantId !== normalizedTenantId) {
      return null
    }

    return item
  }
}
