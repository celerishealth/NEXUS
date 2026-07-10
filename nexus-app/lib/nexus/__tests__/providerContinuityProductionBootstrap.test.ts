import {
  describe,
  expect,
  it,
} from "vitest"

import {
  createProviderContinuityProductionBootstrap,
  ProviderContinuityClientFactoryError,
  withProviderContinuityProductionBootstrap,
  type ProviderContinuitySupabaseServerClientFactory,
} from "../providerContinuityProductionBootstrap"
import {
  PROVIDER_CONTINUITY_SCHEMA_VERSION,
} from "../providerContinuityProductionReadiness"
import {
  ProviderContinuityCredentialError,
  validateProviderContinuityServerCredentials,
} from "../providerContinuityServerCredentialGate"
import type {
  SupabaseRpcClientLike,
} from "../postgresProviderContinuityStore"

const serviceRoleKey =
  "service-role-secret-key-for-tests-123456789"

const readyResponse = {
  schemaVersion:
    PROVIDER_CONTINUITY_SCHEMA_VERSION,
  ready: true,
  checks: {
    tablesPresent: true,
    requiredFunctionsPresent: true,
    rowLevelSecurityEnabled: true,
    forceRowLevelSecurityEnabled: true,
    serviceRoleOnlyExecution: true,
  },
}

const createReadyClient =
  (): SupabaseRpcClientLike => ({
    async rpc<T = unknown>(
      functionName: string,
    ) {
      if (
        functionName ===
        "nexus_get_provider_continuity_store_readiness"
      ) {
        return {
          data: readyResponse as T,
          error: null,
        }
      }

      return {
        data: null as T | null,
        error: null,
      }
    },
  })

const validCredentials = {
  nodeEnvironment: "production",
  runtime: "nodejs" as const,
  supabaseUrl:
    "https://nexus-example.supabase.co",
  serviceRoleKey,
  anonKey:
    "anon-public-key-for-tests-987654321",
  serviceRoleEnvironmentName:
    "SUPABASE_SERVICE_ROLE_KEY",
}

describe(
  "server-only provider continuity production bootstrap",
  () => {
    it("validates server-only production credentials", () => {
      const credentials =
        validateProviderContinuityServerCredentials(
          validCredentials,
        )

      expect(
        credentials.getServiceRoleKey(),
      ).toBe(serviceRoleKey)

      expect(
        credentials.getSafeSummary(),
      ).toEqual({
        nodeEnvironment: "production",
        runtime: "nodejs",
        supabaseOrigin:
          "https://nexus-example.supabase.co",
        serviceRoleEnvironmentName:
          "SUPABASE_SERVICE_ROLE_KEY",
        serviceRoleKey: "[REDACTED]",
      })
    })

    it("redacts the service-role key during serialization", () => {
      const credentials =
        validateProviderContinuityServerCredentials(
          validCredentials,
        )

      const serialized =
        JSON.stringify(credentials)

      expect(serialized).toContain(
        "[REDACTED]",
      )

      expect(serialized).not.toContain(
        serviceRoleKey,
      )
    })

    it("blocks browser and edge service-role bootstrap", () => {
      for (const runtime of [
        "browser",
        "edge",
        "unknown",
      ] as const) {
        expect(() =>
          validateProviderContinuityServerCredentials(
            {
              ...validCredentials,
              runtime,
            },
          ),
        ).toThrow(
          new ProviderContinuityCredentialError(
            "NODE_SERVER_RUNTIME_REQUIRED",
            "provider continuity service-role bootstrap is restricted to the Node.js server runtime",
          ),
        )
      }
    })

    it("blocks service-role secrets stored in public environment variables", () => {
      expect(() =>
        validateProviderContinuityServerCredentials(
          {
            ...validCredentials,
            serviceRoleEnvironmentName:
              "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
          },
        ),
      ).toThrow(
        new ProviderContinuityCredentialError(
          "PUBLIC_SERVICE_ROLE_ENV_BLOCKED",
          "service-role credential must never use a NEXT_PUBLIC environment variable",
        ),
      )
    })

    it("blocks anon and service-role key collision", () => {
      expect(() =>
        validateProviderContinuityServerCredentials(
          {
            ...validCredentials,
            anonKey: serviceRoleKey,
          },
        ),
      ).toThrow(
        new ProviderContinuityCredentialError(
          "SERVICE_ROLE_ANON_KEY_COLLISION",
          "Supabase service-role key must not equal the anon key",
        ),
      )
    })

    it("blocks insecure production database URLs", () => {
      expect(() =>
        validateProviderContinuityServerCredentials(
          {
            ...validCredentials,
            supabaseUrl:
              "http://nexus-example.supabase.co",
          },
        ),
      ).toThrow(
        new ProviderContinuityCredentialError(
          "HTTPS_SUPABASE_URL_REQUIRED",
          "provider continuity production Supabase URL must use HTTPS",
        ),
      )
    })

    it("does not call the client factory when credentials are unsafe", async () => {
      let factoryCalled = false

      await expect(
        createProviderContinuityProductionBootstrap(
          {
            credentials: {
              ...validCredentials,
              runtime: "browser",
            },
            clientFactory: () => {
              factoryCalled = true
              return createReadyClient()
            },
          },
        ),
      ).rejects.toMatchObject({
        code:
          "NODE_SERVER_RUNTIME_REQUIRED",
      })

      expect(factoryCalled).toBe(false)
    })

    it("creates a server client with session persistence disabled", async () => {
      const factoryCalls: Array<{
        url: string
        key: string
        options: unknown
      }> = []

      const clientFactory:
        ProviderContinuitySupabaseServerClientFactory =
        (
          url,
          key,
          options,
        ) => {
          factoryCalls.push({
            url,
            key,
            options,
          })

          return createReadyClient()
        }

      const bootstrap =
        await createProviderContinuityProductionBootstrap(
          {
            credentials: validCredentials,
            clientFactory,
          },
        )

      expect(factoryCalls).toEqual([
        {
          url:
            "https://nexus-example.supabase.co/",
          key: serviceRoleKey,
          options: {
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
          },
        },
      ])

      expect(
        bootstrap.readiness.ready,
      ).toBe(true)

      expect(
        bootstrap.store.storageKind,
      ).toBe("postgres-supabase-rpc")

      expect(
        typeof bootstrap.coordinator.transition,
      ).toBe("function")

      expect(
        JSON.stringify(
          bootstrap.credentialSummary,
        ),
      ).not.toContain(serviceRoleKey)
    })

    it("rejects a malformed server client before readiness probing", async () => {
      await expect(
        createProviderContinuityProductionBootstrap(
          {
            credentials: validCredentials,
            clientFactory: () =>
              ({}) as SupabaseRpcClientLike,
          },
        ),
      ).rejects.toEqual(
        new ProviderContinuityClientFactoryError(
          "provider continuity server client factory did not return an RPC-capable client",
        ),
      )
    })

    it("never executes protected operations when readiness fails", async () => {
      let operationExecuted = false

      const failingClient:
        SupabaseRpcClientLike = {
          async rpc<T = unknown>() {
            return {
              data: {
                ...readyResponse,
                ready: false,
                checks: {
                  ...readyResponse.checks,
                  serviceRoleOnlyExecution:
                    false,
                },
              } as T,
              error: null,
            }
          },
        }

      await expect(
        withProviderContinuityProductionBootstrap(
          {
            credentials: validCredentials,
            clientFactory: () =>
              failingClient,
          },
          async () => {
            operationExecuted = true
            return "unsafe-result"
          },
        ),
      ).rejects.toMatchObject({
        code:
          "CONTINUITY_SCHEMA_NOT_READY",
      })

      expect(operationExecuted).toBe(false)
    })

    it("executes protected operations only after credential and schema gates pass", async () => {
      let operationExecuted = false

      const result =
        await withProviderContinuityProductionBootstrap(
          {
            credentials: validCredentials,
            clientFactory: () =>
              createReadyClient(),
          },
          async (bootstrap) => {
            operationExecuted = true

            return {
              ready:
                bootstrap.readiness.ready,
              storageKind:
                bootstrap.store.storageKind,
              coordinatorAvailable:
                typeof bootstrap.coordinator
                  .transition === "function",
              credentialSummary:
                bootstrap.credentialSummary,
            }
          },
        )

      expect(operationExecuted).toBe(true)

      expect(result).toMatchObject({
        ready: true,
        storageKind:
          "postgres-supabase-rpc",
        coordinatorAvailable: true,
        credentialSummary: {
          serviceRoleKey: "[REDACTED]",
        },
      })

      expect(
        JSON.stringify(result),
      ).not.toContain(serviceRoleKey)
    })
  },
)
