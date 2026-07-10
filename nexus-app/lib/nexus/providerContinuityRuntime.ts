import {
  InMemoryProviderCircuitBreaker,
  type ProviderCircuitBreakerPolicy,
} from "./providerCircuitBreaker"
import {
  executeContainmentEnforcedProviderOperation,
  type ContainmentEnforcedProviderResult,
} from "./containmentEnforcedProviderCoordinator"
import {
  executeContainedProviderRecovery,
  type ContainedProviderRecoveryOperation,
  type ContainedProviderRecoveryResult,
} from "./containedProviderRecoveryOrchestrator"
import {
  InMemoryProviderContinuityTelemetry,
  type ProviderContinuityTelemetrySnapshot,
} from "./providerContinuityTelemetry"
import {
  InMemoryProviderIncidentContainmentRegistry,
  type ProviderDomainOperationDecision,
} from "./providerIncidentContainment"
import {
  InMemoryProviderIncidentRegistry,
  type ProviderContinuityIncident,
  type ProviderIncidentOwnerActionInput,
} from "./providerIncidentRegistry"
import {
  InMemoryProviderRecoveryQueue,
  type ProviderRecoveryDecisionInput,
  type ProviderRecoveryQueueItem,
  type ProviderReplayAuthorization,
} from "./providerRecoveryQueue"
import {
  InMemoryProviderReplayIdempotencyGuard,
} from "./providerReplayIdempotencyGuard"
import type {
  ProviderContinuityOperation,
} from "./providerContinuityCoordinator"
import type {
  ProviderDomain,
} from "./providerRecoveryQueue"

export type ProviderContinuityRuntimeMode =
  | "test"
  | "preview"
  | "production"

export interface CreateProviderContinuityRuntimeOptions {
  mode: ProviderContinuityRuntimeMode
  environment?: string
  defaultTimeoutMs?: number
  now?: () => number
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy
}

export interface ExecuteRuntimeProviderOperationInput<T> {
  traceId: string
  operation: ProviderContinuityOperation<T>
  timeoutMs?: number
}

export interface RecoverRuntimeProviderOperationInput<T> {
  operation: ContainedProviderRecoveryOperation<T>
  timeoutMs?: number
}

export interface ProviderContinuityRuntimeSnapshot {
  tenantId: string
  telemetry: ProviderContinuityTelemetrySnapshot
  incidents: ProviderContinuityIncident[]
  recoveries: ProviderRecoveryQueueItem[]
  totalContainments: number
  activeContainments: number
  openIncidents: number
  acknowledgedIncidents: number
  pendingOwnerRecoveryDecisions: number
  replayAuthorizedRecoveries: number
}

const defaultCircuitBreakerPolicy:
  ProviderCircuitBreakerPolicy = {
    failureThreshold: 2,
    recoveryTimeoutMs: 30_000,
    halfOpenSuccessThreshold: 1,
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

export class InMemoryProviderContinuityRuntime {
  readonly circuitBreaker:
    InMemoryProviderCircuitBreaker

  readonly recoveryQueue:
    InMemoryProviderRecoveryQueue

  readonly telemetry:
    InMemoryProviderContinuityTelemetry

  readonly incidentRegistry:
    InMemoryProviderIncidentRegistry

  readonly containmentRegistry:
    InMemoryProviderIncidentContainmentRegistry

  readonly replayIdempotencyGuard:
    InMemoryProviderReplayIdempotencyGuard

  private constructor(
    readonly mode: Exclude<
      ProviderContinuityRuntimeMode,
      "production"
    >,
    private readonly defaultTimeoutMs: number,
    private readonly now: () => number,
    circuitBreakerPolicy:
      ProviderCircuitBreakerPolicy,
  ) {
    this.circuitBreaker =
      new InMemoryProviderCircuitBreaker(
        circuitBreakerPolicy,
      )

    this.recoveryQueue =
      new InMemoryProviderRecoveryQueue(this.now)

    this.telemetry =
      new InMemoryProviderContinuityTelemetry(
        this.now,
      )

    this.incidentRegistry =
      new InMemoryProviderIncidentRegistry(
        this.now,
      )

    this.containmentRegistry =
      new InMemoryProviderIncidentContainmentRegistry(
        this.now,
      )

    this.replayIdempotencyGuard =
      new InMemoryProviderReplayIdempotencyGuard()
  }

  static create(
    options: CreateProviderContinuityRuntimeOptions,
  ): InMemoryProviderContinuityRuntime {
    const environment = (
      options.environment ??
      process.env.NODE_ENV ??
      "development"
    )
      .trim()
      .toLowerCase()

    if (
      options.mode === "production" ||
      environment === "production"
    ) {
      throw new Error(
        "in-memory provider continuity runtime is forbidden in production; durable continuity storage is required",
      )
    }

    const defaultTimeoutMs =
      requirePositiveInteger(
        options.defaultTimeoutMs ?? 5_000,
        "defaultTimeoutMs",
      )

    return new InMemoryProviderContinuityRuntime(
      options.mode,
      defaultTimeoutMs,
      options.now ?? Date.now,
      options.circuitBreakerPolicy ??
        defaultCircuitBreakerPolicy,
    )
  }

  async execute<T>(
    input: ExecuteRuntimeProviderOperationInput<T>,
  ): Promise<ContainmentEnforcedProviderResult<T>> {
    const traceId = requireValue(
      input.traceId,
      "traceId",
    )

    return executeContainmentEnforcedProviderOperation(
      input.operation,
      {
        traceId,
        timeoutMs: requirePositiveInteger(
          input.timeoutMs ??
            this.defaultTimeoutMs,
          "timeoutMs",
        ),
        now: this.now,
        circuitBreaker: this.circuitBreaker,
        recoveryQueue: this.recoveryQueue,
        telemetry: this.telemetry,
        incidentRegistry: this.incidentRegistry,
        containmentRegistry:
          this.containmentRegistry,
      },
    )
  }

  acknowledgeIncident(
    input: ProviderIncidentOwnerActionInput,
  ): ProviderContinuityIncident {
    return this.incidentRegistry.acknowledge(
      input,
    )
  }

  approveRecovery(
    input: ProviderRecoveryDecisionInput,
  ): ProviderRecoveryQueueItem {
    return this.recoveryQueue.approve(input)
  }

  rejectRecovery(
    input: ProviderRecoveryDecisionInput,
  ): ProviderRecoveryQueueItem {
    return this.recoveryQueue.reject(input)
  }

  authorizeRecoveryReplay(
    input: Omit<
      ProviderRecoveryDecisionInput,
      "reason"
    >,
  ): ProviderReplayAuthorization {
    return this.recoveryQueue.authorizeReplay(
      input,
    )
  }

  async recover<T>(
    input: RecoverRuntimeProviderOperationInput<T>,
  ): Promise<ContainedProviderRecoveryResult<T>> {
    return executeContainedProviderRecovery(
      input.operation,
      {
        timeoutMs: requirePositiveInteger(
          input.timeoutMs ??
            this.defaultTimeoutMs,
          "timeoutMs",
        ),
        now: this.now,
        circuitBreaker: this.circuitBreaker,
        recoveryQueue: this.recoveryQueue,
        idempotencyGuard:
          this.replayIdempotencyGuard,
        incidentRegistry:
          this.incidentRegistry,
        containmentRegistry:
          this.containmentRegistry,
      },
    )
  }

  evaluateDomainOperation(
    tenantId: string,
    providerDomain: ProviderDomain,
  ): ProviderDomainOperationDecision {
    return this.containmentRegistry
      .evaluateOperation(
        tenantId,
        providerDomain,
      )
  }

  getTenantSnapshot(
    tenantId: string,
  ): ProviderContinuityRuntimeSnapshot {
    const normalizedTenantId = requireValue(
      tenantId,
      "tenantId",
    )

    const incidents =
      this.incidentRegistry.listForTenant(
        normalizedTenantId,
      )

    const recoveries =
      this.recoveryQueue.listForTenant(
        normalizedTenantId,
      )

    const containments =
      this.containmentRegistry.listForTenant(
        normalizedTenantId,
      )

    return {
      tenantId: normalizedTenantId,
      telemetry:
        this.telemetry.getSnapshotForTenant(
          normalizedTenantId,
        ),
      incidents,
      recoveries,
      totalContainments: containments.length,
      activeContainments:
        containments.filter(
          (containment) =>
            containment.status === "active",
        ).length,
      openIncidents:
        incidents.filter(
          (incident) =>
            incident.status === "open",
        ).length,
      acknowledgedIncidents:
        incidents.filter(
          (incident) =>
            incident.status ===
            "owner-acknowledged",
        ).length,
      pendingOwnerRecoveryDecisions:
        recoveries.filter(
          (recovery) =>
            recovery.status ===
            "pending-owner-approval",
        ).length,
      replayAuthorizedRecoveries:
        recoveries.filter(
          (recovery) =>
            recovery.status ===
            "replay-authorized",
        ).length,
    }
  }
}

export const createInMemoryProviderContinuityRuntime = (
  options: CreateProviderContinuityRuntimeOptions,
): InMemoryProviderContinuityRuntime =>
  InMemoryProviderContinuityRuntime.create(
    options,
  )
