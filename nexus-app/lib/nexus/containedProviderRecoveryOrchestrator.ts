import type {
  ProviderExecutionCandidate,
} from "./providerExecutionGuard"
import {
  type ProviderIncidentContainment,
  InMemoryProviderIncidentContainmentRegistry,
} from "./providerIncidentContainment"
import {
  type ProviderContinuityIncident,
  InMemoryProviderIncidentRegistry,
} from "./providerIncidentRegistry"
import {
  executeAuthorizedProviderReplay,
  type AuthorizedProviderReplayFailure,
  type AuthorizedProviderReplayOptions,
  type AuthorizedProviderReplaySuccess,
} from "./providerRecoveryReplayExecutor"
import type {
  ProviderReplayAuthorization,
} from "./providerRecoveryQueue"

export interface ContainedProviderRecoveryOperation<T> {
  authorization: ProviderReplayAuthorization
  incidentId: string
  containmentId: string
  candidates: ProviderExecutionCandidate<T>[]
  incidentResolutionReason: string
  containmentReleaseReason: string
}

export interface ContainedProviderRecoveryOptions
  extends AuthorizedProviderReplayOptions {
  incidentRegistry:
    InMemoryProviderIncidentRegistry
  containmentRegistry:
    InMemoryProviderIncidentContainmentRegistry
}

export type ContainedProviderRecoveryBlockCode =
  | "RECOVERY_INCIDENT_NOT_FOUND"
  | "RECOVERY_CONTAINMENT_NOT_FOUND"
  | "RECOVERY_CONTAINMENT_NOT_ACTIVE"
  | "RECOVERY_SCOPE_MISMATCH"
  | "RECOVERY_INCIDENT_NOT_ACKNOWLEDGED"
  | "RECOVERY_OWNER_MISMATCH"

export interface ContainedProviderRecoveryBlocked {
  outcome: "blocked"
  code: ContainedProviderRecoveryBlockCode
  replay: null
  incident: ProviderContinuityIncident | null
  containment: ProviderIncidentContainment | null
}

export interface ContainedProviderRecoveryReplayFailed {
  outcome: "replay-failed"
  code: AuthorizedProviderReplayFailure["code"]
  replay: AuthorizedProviderReplayFailure
  incident: ProviderContinuityIncident
  containment: ProviderIncidentContainment
}

export interface ContainedProviderRecoverySucceeded<T> {
  outcome: "recovered"
  replay: AuthorizedProviderReplaySuccess<T>
  incident: ProviderContinuityIncident
  containment: ProviderIncidentContainment
}

export type ContainedProviderRecoveryResult<T> =
  | ContainedProviderRecoveryBlocked
  | ContainedProviderRecoveryReplayFailed
  | ContainedProviderRecoverySucceeded<T>

const requireReason = (
  value: string,
  fieldName: string,
): string => {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`)
  }

  return normalizedValue
}

const recoveryScopeMatches = (
  authorization: ProviderReplayAuthorization,
  incident: ProviderContinuityIncident,
  containment: ProviderIncidentContainment,
): boolean =>
  incident.tenantId === authorization.tenantId &&
  incident.operationId === authorization.operationId &&
  incident.providerDomain ===
    authorization.providerDomain &&
  incident.queueItemId === authorization.queueItemId &&
  containment.tenantId === authorization.tenantId &&
  containment.providerDomain ===
    authorization.providerDomain &&
  containment.triggerIncidentId ===
    incident.incidentId

export const executeContainedProviderRecovery =
  async <T>(
    operation: ContainedProviderRecoveryOperation<T>,
    options: ContainedProviderRecoveryOptions,
  ): Promise<ContainedProviderRecoveryResult<T>> => {
    const incidentResolutionReason = requireReason(
      operation.incidentResolutionReason,
      "incidentResolutionReason",
    )

    const containmentReleaseReason = requireReason(
      operation.containmentReleaseReason,
      "containmentReleaseReason",
    )

    const incident =
      options.incidentRegistry.getForTenant(
        operation.incidentId,
        operation.authorization.tenantId,
      )

    if (!incident) {
      return {
        outcome: "blocked",
        code: "RECOVERY_INCIDENT_NOT_FOUND",
        replay: null,
        incident: null,
        containment: null,
      }
    }

    const containment =
      options.containmentRegistry.getForTenant(
        operation.containmentId,
        operation.authorization.tenantId,
      )

    if (!containment) {
      return {
        outcome: "blocked",
        code: "RECOVERY_CONTAINMENT_NOT_FOUND",
        replay: null,
        incident,
        containment: null,
      }
    }

    if (containment.status !== "active") {
      return {
        outcome: "blocked",
        code: "RECOVERY_CONTAINMENT_NOT_ACTIVE",
        replay: null,
        incident,
        containment,
      }
    }

    if (
      !recoveryScopeMatches(
        operation.authorization,
        incident,
        containment,
      )
    ) {
      return {
        outcome: "blocked",
        code: "RECOVERY_SCOPE_MISMATCH",
        replay: null,
        incident,
        containment,
      }
    }

    if (
      incident.status !== "owner-acknowledged" ||
      !incident.ownerAcknowledgement
    ) {
      return {
        outcome: "blocked",
        code: "RECOVERY_INCIDENT_NOT_ACKNOWLEDGED",
        replay: null,
        incident,
        containment,
      }
    }

    if (
      incident.ownerAcknowledgement.ownerId !==
      operation.authorization.authorizedBy
    ) {
      return {
        outcome: "blocked",
        code: "RECOVERY_OWNER_MISMATCH",
        replay: null,
        incident,
        containment,
      }
    }

    const replay =
      await executeAuthorizedProviderReplay(
        {
          authorization: operation.authorization,
          candidates: operation.candidates,
        },
        options,
      )

    if (!replay.ok) {
      return {
        outcome: "replay-failed",
        code: replay.code,
        replay,
        incident:
          options.incidentRegistry.getForTenant(
            incident.incidentId,
            incident.tenantId,
          ) ?? incident,
        containment:
          options.containmentRegistry.getForTenant(
            containment.containmentId,
            containment.tenantId,
          ) ?? containment,
      }
    }

    const resolvedIncident =
      options.incidentRegistry.resolve({
        incidentId: incident.incidentId,
        tenantId: incident.tenantId,
        ownerId:
          operation.authorization.authorizedBy,
        reason: incidentResolutionReason,
      })

    const releasedContainment =
      options.containmentRegistry.release({
        containmentId:
          containment.containmentId,
        tenantId: containment.tenantId,
        ownerId:
          operation.authorization.authorizedBy,
        reason: containmentReleaseReason,
        resolvedIncident,
      })

    return {
      outcome: "recovered",
      replay,
      incident: resolvedIncident,
      containment: releasedContainment,
    }
  }
