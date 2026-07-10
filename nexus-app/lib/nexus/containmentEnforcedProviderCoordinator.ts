import {
  executeObservedProviderOperation,
  type ObservedProviderContinuityOptions,
} from "./observedProviderContinuityCoordinator"
import {
  activateProviderIncidentContainment,
  checkProviderDomainOperationPermission,
} from "./providerIncidentContainmentCoordinator"
import {
  InMemoryProviderIncidentContainmentRegistry,
  type ProviderDomainOperationDecision,
  type ProviderIncidentContainment,
} from "./providerIncidentContainment"
import {
  createProviderIncidentFromTrace,
} from "./providerIncidentCoordinator"
import {
  InMemoryProviderIncidentRegistry,
  type ProviderContinuityIncident,
} from "./providerIncidentRegistry"
import type {
  ProviderContinuityCoordinatorResult,
  ProviderContinuityOperation,
} from "./providerContinuityCoordinator"

export interface ContainmentEnforcedProviderOptions
  extends ObservedProviderContinuityOptions {
  incidentRegistry:
    InMemoryProviderIncidentRegistry
  containmentRegistry:
    InMemoryProviderIncidentContainmentRegistry
}

export interface ContainedProviderOperationBlocked {
  outcome: "blocked"
  decision: ProviderDomainOperationDecision
  continuity: null
  incident: null
  containment: null
}

export interface ContainedProviderOperationExecuted<T> {
  outcome: "executed"
  decision: ProviderDomainOperationDecision
  continuity:
    ProviderContinuityCoordinatorResult<T>
  incident: ProviderContinuityIncident | null
  containment:
    ProviderIncidentContainment | null
}

export type ContainmentEnforcedProviderResult<T> =
  | ContainedProviderOperationBlocked
  | ContainedProviderOperationExecuted<T>

export const executeContainmentEnforcedProviderOperation =
  async <T>(
    operation: ProviderContinuityOperation<T>,
    options: ContainmentEnforcedProviderOptions,
  ): Promise<ContainmentEnforcedProviderResult<T>> => {
    const decision =
      checkProviderDomainOperationPermission(
        operation.tenantId,
        operation.providerDomain,
        options.containmentRegistry,
      )

    if (!decision.allowed) {
      return {
        outcome: "blocked",
        decision,
        continuity: null,
        incident: null,
        containment: null,
      }
    }

    const continuity =
      await executeObservedProviderOperation(
        operation,
        options,
      )

    const incident =
      createProviderIncidentFromTrace(
        {
          traceId: options.traceId,
          tenantId: operation.tenantId,
        },
        {
          telemetry: options.telemetry,
          incidentRegistry:
            options.incidentRegistry,
        },
      )

    const containment = incident
      ? activateProviderIncidentContainment(
          incident.incidentId,
          operation.tenantId,
          {
            incidentRegistry:
              options.incidentRegistry,
            containmentRegistry:
              options.containmentRegistry,
          },
        )
      : null

    return {
      outcome: "executed",
      decision,
      continuity,
      incident,
      containment,
    }
  }
