import {
  createPostgresProviderContinuityStore,
  type PostgresProviderContinuityStore,
  type SupabaseRpcClientLike,
} from "./postgresProviderContinuityStore"

export const PROVIDER_CONTINUITY_SCHEMA_VERSION =
  "provider-continuity-durable-store-v2"

export interface ProviderContinuityReadinessChecks {
  tablesPresent: boolean
  requiredFunctionsPresent: boolean
  rowLevelSecurityEnabled: boolean
  forceRowLevelSecurityEnabled: boolean
  serviceRoleOnlyExecution: boolean
}

export interface ProviderContinuityProductionReadiness {
  schemaVersion: string
  ready: true
  checks: ProviderContinuityReadinessChecks
}

export type ProviderContinuityReadinessErrorCode =
  | "READINESS_RPC_FAILED"
  | "MALFORMED_READINESS_RESPONSE"
  | "SCHEMA_VERSION_MISMATCH"
  | "CONTINUITY_SCHEMA_NOT_READY"

export class ProviderContinuityProductionReadinessError
  extends Error
{
  constructor(
    readonly code:
      ProviderContinuityReadinessErrorCode,
    message: string,
    readonly failedChecks: string[] = [],
  ) {
    super(message)
    this.name =
      "ProviderContinuityProductionReadinessError"
  }
}

export interface ReadyProviderContinuityBootstrap {
  readiness:
    ProviderContinuityProductionReadiness
  store: PostgresProviderContinuityStore
}

const isRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value)

const readBoolean = (
  value: unknown,
  fieldName: string,
): boolean => {
  if (typeof value !== "boolean") {
    throw new ProviderContinuityProductionReadinessError(
      "MALFORMED_READINESS_RESPONSE",
      `invalid provider continuity readiness field: ${fieldName}`,
    )
  }

  return value
}

const readString = (
  value: unknown,
  fieldName: string,
): string => {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new ProviderContinuityProductionReadinessError(
      "MALFORMED_READINESS_RESPONSE",
      `invalid provider continuity readiness field: ${fieldName}`,
    )
  }

  return value
}

const parseChecks = (
  value: unknown,
): ProviderContinuityReadinessChecks => {
  if (!isRecord(value)) {
    throw new ProviderContinuityProductionReadinessError(
      "MALFORMED_READINESS_RESPONSE",
      "invalid provider continuity readiness checks",
    )
  }

  return {
    tablesPresent: readBoolean(
      value.tablesPresent,
      "checks.tablesPresent",
    ),
    requiredFunctionsPresent: readBoolean(
      value.requiredFunctionsPresent,
      "checks.requiredFunctionsPresent",
    ),
    rowLevelSecurityEnabled: readBoolean(
      value.rowLevelSecurityEnabled,
      "checks.rowLevelSecurityEnabled",
    ),
    forceRowLevelSecurityEnabled: readBoolean(
      value.forceRowLevelSecurityEnabled,
      "checks.forceRowLevelSecurityEnabled",
    ),
    serviceRoleOnlyExecution: readBoolean(
      value.serviceRoleOnlyExecution,
      "checks.serviceRoleOnlyExecution",
    ),
  }
}

const getFailedChecks = (
  checks: ProviderContinuityReadinessChecks,
): string[] =>
  Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([checkName]) => checkName)

export const probeProviderContinuityProductionReadiness =
  async (
    client: SupabaseRpcClientLike,
  ): Promise<
    ProviderContinuityProductionReadiness
  > => {
    const response = await client.rpc(
      "nexus_get_provider_continuity_store_readiness",
    )

    if (response.error) {
      throw new ProviderContinuityProductionReadinessError(
        "READINESS_RPC_FAILED",
        `provider continuity readiness RPC failed: ${response.error.message}`,
      )
    }

    if (!isRecord(response.data)) {
      throw new ProviderContinuityProductionReadinessError(
        "MALFORMED_READINESS_RESPONSE",
        "provider continuity readiness RPC returned an invalid response",
      )
    }

    const schemaVersion = readString(
      response.data.schemaVersion,
      "schemaVersion",
    )

    if (
      schemaVersion !==
      PROVIDER_CONTINUITY_SCHEMA_VERSION
    ) {
      throw new ProviderContinuityProductionReadinessError(
        "SCHEMA_VERSION_MISMATCH",
        `provider continuity schema version mismatch: expected ${PROVIDER_CONTINUITY_SCHEMA_VERSION}, received ${schemaVersion}`,
      )
    }

    const ready = readBoolean(
      response.data.ready,
      "ready",
    )

    const checks = parseChecks(
      response.data.checks,
    )

    const failedChecks = getFailedChecks(checks)

    if (!ready || failedChecks.length > 0) {
      throw new ProviderContinuityProductionReadinessError(
        "CONTINUITY_SCHEMA_NOT_READY",
        `provider continuity schema is not production-ready; failed checks: ${
          failedChecks.length > 0
            ? failedChecks.join(", ")
            : "readiness flag"
        }`,
        failedChecks,
      )
    }

    return {
      schemaVersion,
      ready: true,
      checks,
    }
  }

export const createReadyPostgresProviderContinuityStore =
  async (
    client: SupabaseRpcClientLike,
  ): Promise<ReadyProviderContinuityBootstrap> => {
    const readiness =
      await probeProviderContinuityProductionReadiness(
        client,
      )

    const store =
      createPostgresProviderContinuityStore(
        client,
      )

    return {
      readiness,
      store,
    }
  }

export const withReadyProviderContinuityStore =
  async <T>(
    client: SupabaseRpcClientLike,
    operation: (
      bootstrap:
        ReadyProviderContinuityBootstrap,
    ) => Promise<T>,
  ): Promise<T> => {
    const bootstrap =
      await createReadyPostgresProviderContinuityStore(
        client,
      )

    return operation(bootstrap)
  }

