import {
  createProductionDurableContinuityCoordinator,
  type ProductionDurableContinuityCoordinator,
} from "./durableContinuityTransactionCoordinator"
import {
  createPostgresDurableProviderContainmentReader,
  type PostgresDurableProviderContainmentReader,
} from "./durableProviderContainmentReader"
import {
  createReadyPostgresProviderContinuityStore,
  type ProviderContinuityProductionReadiness,
} from "./providerContinuityProductionReadiness"
import type {
  PostgresProviderContinuityStore,
  SupabaseRpcClientLike,
} from "./postgresProviderContinuityStore"
import {
  validateProviderContinuityServerCredentials,
  type ProviderContinuityCredentialSummary,
  type ProviderContinuityServerCredentialInput,
} from "./providerContinuityServerCredentialGate"

export interface ProviderContinuitySupabaseServerClientOptions {
  auth: {
    persistSession: false
    autoRefreshToken: false
    detectSessionInUrl: false
  }
  global: {
    headers: {
      "X-NEXUS-RUNTIME":
        "provider-continuity-server"
    }
  }
}

export type ProviderContinuitySupabaseServerClientFactory =
  (
    supabaseUrl: string,
    serviceRoleKey: string,
    options:
      ProviderContinuitySupabaseServerClientOptions,
  ) => SupabaseRpcClientLike

export interface CreateProviderContinuityProductionBootstrapInput {
  credentials:
    ProviderContinuityServerCredentialInput
  clientFactory:
    ProviderContinuitySupabaseServerClientFactory
}

export interface ProviderContinuityProductionBootstrap {
  credentialSummary:
    ProviderContinuityCredentialSummary
  readiness:
    ProviderContinuityProductionReadiness
  store: PostgresProviderContinuityStore
  coordinator:
    ProductionDurableContinuityCoordinator
  containmentReader:
    PostgresDurableProviderContainmentReader
}

export class ProviderContinuityClientFactoryError
  extends Error
{
  constructor(message: string) {
    super(message)
    this.name =
      "ProviderContinuityClientFactoryError"
  }
}

const serverClientOptions:
  ProviderContinuitySupabaseServerClientOptions =
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-NEXUS-RUNTIME":
          "provider-continuity-server",
      },
    },
  }

const assertRpcClient = (
  client: SupabaseRpcClientLike,
): SupabaseRpcClientLike => {
  if (
    !client ||
    typeof client.rpc !== "function"
  ) {
    throw new ProviderContinuityClientFactoryError(
      "provider continuity server client factory did not return an RPC-capable client",
    )
  }

  return client
}

export const createProviderContinuityProductionBootstrap =
  async (
    input:
      CreateProviderContinuityProductionBootstrapInput,
  ): Promise<
    ProviderContinuityProductionBootstrap
  > => {
    const credentials =
      validateProviderContinuityServerCredentials(
        input.credentials,
      )

    const client = assertRpcClient(
      input.clientFactory(
        credentials.supabaseUrl,
        credentials.getServiceRoleKey(),
        serverClientOptions,
      ),
    )

    const readyStore =
      await createReadyPostgresProviderContinuityStore(
        client,
      )

    const coordinator =
      createProductionDurableContinuityCoordinator(
        readyStore.store,
      )

    const containmentReader =
      createPostgresDurableProviderContainmentReader(
        client,
      )

    return {
      credentialSummary:
        credentials.getSafeSummary(),
      readiness: readyStore.readiness,
      store: readyStore.store,
      coordinator,
      containmentReader,
    }
  }

export const withProviderContinuityProductionBootstrap =
  async <T>(
    input:
      CreateProviderContinuityProductionBootstrapInput,
    operation: (
      bootstrap:
        ProviderContinuityProductionBootstrap,
    ) => Promise<T>,
  ): Promise<T> => {
    const bootstrap =
      await createProviderContinuityProductionBootstrap(
        input,
      )

    return operation(bootstrap)
  }
