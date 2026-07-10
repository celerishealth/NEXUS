import {
  describe,
  expect,
  it,
} from "vitest"

import type {
  DurableProviderContainmentReader,
} from "../durableProviderContainmentReader"
import {
  createDurableIndeterminateExecutionResolver,
} from "../durableIndeterminateExecutionResolver"
import {
  createDurableProviderExecutionGuard,
} from "../durableProviderExecutionGuard"
import {
  InMemoryTestProviderContinuityStore,
} from "../inMemoryTestProviderContinuityStore"
import {
  createProviderOwnerResolutionAuthority,
  ProviderOwnerAuthorityError,
} from "../providerOwnerResolutionAuthority"

const authoritySecret =
  "nexus-owner-authority-secret-for-tests-123456789"

const createClock = (
  initial = 1_000,
) => {
  let current = initial

  return {
    now: () => current++,
    peek: () => current,
    advance: (milliseconds: number) => {
      current += milliseconds
    },
  }
}

const createEmptyReader =
  (): DurableProviderContainmentReader => ({
    async listActive() {
      return []
    },
  })

const executionInput = {
  tenantId: "tenant-a",
  providerDomain: "payments" as const,
  operationId: "operation-one",
  leaseId: "execution-lease",
  workerId: "execution-worker",
  leaseTtlMs: 5_000,
  executionTimeoutMs: 500,
  safetyMarginMs: 500,
}

const createAuthority = (
  clock: ReturnType<typeof createClock>,
) =>
  createProviderOwnerResolutionAuthority({
    secret: authoritySecret,
    secretEnvironmentName:
      "NEXUS_OWNER_AUTHORIZATION_SECRET",
    maxAuthorizationTtlMs: 5_000,
    maxSessionAgeMs: 20_000,
    now: clock.now,
  })

const createActor = (
  clock: ReturnType<typeof createClock>,
  overrides?: Partial<{
    ownerId: string
    tenantId: string
    roles: string[]
    stepUpVerified: boolean
    authenticatedAt: number
    sessionExpiresAt: number
  }>,
) => ({
  ownerId: "owner-a",
  tenantId: "tenant-a",
  roles: ["owner"],
  stepUpVerified: true,
  authenticatedAt: 0,
  sessionExpiresAt:
    clock.peek() + 50_000,
  ...overrides,
})

const createToken = (
  authority:
    ReturnType<typeof createAuthority>,
  clock: ReturnType<typeof createClock>,
  input?: Partial<{
    tenantId: string
    providerDomain: "payments" | "database"
    operationId: string
    decision:
      | "confirm-completed"
      | "authorize-single-retry"
    authorizationId: string
    reason: string
    verificationReference: string
    retryAuthorizationId: string
  }>,
) => {
  const decision =
    input?.decision ??
    "confirm-completed"

  return authority.issue({
    actor: createActor(clock, {
      tenantId:
        input?.tenantId ??
        "tenant-a",
    }),
    providerDomain:
      input?.providerDomain ??
      "payments",
    operationId:
      input?.operationId ??
      "operation-one",
    decision,
    authorizationId:
      input?.authorizationId ??
      "owner-auth-001",
    reason:
      input?.reason ??
      "provider evidence reviewed",
    verificationReference:
      input?.verificationReference ??
      "provider-reference-001",
    retryAuthorizationId:
      decision ===
      "authorize-single-retry"
        ? input?.retryAuthorizationId ??
          "retry-auth-001"
        : undefined,
    ttlMs: 2_000,
  })
}

const createIndeterminateReceipt =
  async (
    store:
      InMemoryTestProviderContinuityStore,
    clock: ReturnType<typeof createClock>,
  ) => {
    const guard =
      createDurableProviderExecutionGuard({
        store,
        containmentReader:
          createEmptyReader(),
        now: clock.now,
      })

    const result = await guard.execute(
      executionInput,
      async () => {
        throw new Error(
          "ambiguous provider response",
        )
      },
    )

    expect(result).toMatchObject({
      outcome: "failed",
      manualResolutionRequired: true,
    })
  }

describe(
  "trusted owner resolution authority gate",
  () => {
    it("blocks public or weak signing secrets", () => {
      expect(() =>
        createProviderOwnerResolutionAuthority({
          secret: authoritySecret,
          secretEnvironmentName:
            "NEXT_PUBLIC_NEXUS_OWNER_SECRET",
        }),
      ).toThrow(
        new ProviderOwnerAuthorityError(
          "PUBLIC_OWNER_AUTHORITY_SECRET_BLOCKED",
          "owner authorization secret must never use a NEXT_PUBLIC environment variable",
        ),
      )

      expect(() =>
        createProviderOwnerResolutionAuthority({
          secret: "too-short",
        }),
      ).toThrow(
        new ProviderOwnerAuthorityError(
          "OWNER_AUTHORITY_SECRET_TOO_SHORT",
          "owner authorization signing secret must contain at least 32 bytes",
        ),
      )
    })

    it("requires owner role and step-up verification before signing", () => {
      const clock = createClock()
      const authority =
        createAuthority(clock)

      expect(() =>
        authority.issue({
          actor: createActor(clock, {
            roles: ["member"],
          }),
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationId:
            "auth-no-owner",
          reason: "reviewed",
          verificationReference:
            "provider-reference",
          ttlMs: 1_000,
        }),
      ).toThrow(
        new ProviderOwnerAuthorityError(
          "OWNER_ROLE_REQUIRED",
          "owner role is required for execution resolution",
        ),
      )

      expect(() =>
        authority.issue({
          actor: createActor(clock, {
            stepUpVerified: false,
          }),
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationId:
            "auth-no-step-up",
          reason: "reviewed",
          verificationReference:
            "provider-reference",
          ttlMs: 1_000,
        }),
      ).toThrow(
        new ProviderOwnerAuthorityError(
          "OWNER_STEP_UP_REQUIRED",
          "step-up owner verification is required for execution resolution",
        ),
      )
    })

    it("rejects token tampering before durable state changes", async () => {
      const clock = createClock()
      const store =
        new InMemoryTestProviderContinuityStore()
      const authority =
        createAuthority(clock)

      await createIndeterminateReceipt(
        store,
        clock,
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          authority,
          clock.now,
        )

      const token = createToken(
        authority,
        clock,
      )

      const tamperedToken =
        `${token.slice(0, -1)}${
          token.endsWith("A")
            ? "B"
            : "A"
        }`

      await expect(
        resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationToken:
            tamperedToken,
          leaseId: "resolution-lease",
          workerId:
            "resolution-worker",
          leaseTtlMs: 5_000,
        }),
      ).rejects.toMatchObject({
        code:
          "OWNER_AUTHORIZATION_TOKEN_INVALID",
      })

      const idempotencyKey =
        [
          "nexus-provider-operation-v1",
          "tenant-a",
          "payments",
          "operation-one",
        ]
          .map(
            (part) =>
              `${part.length}:${part}`,
          )
          .join("|")

      const receipt = await store.read({
        tenantId: "tenant-a",
        providerDomain: "payments",
        kind: "replay-idempotency",
        recordId: idempotencyKey,
      })

      expect(receipt).toMatchObject({
        version: 1,
        payload: {
          status: "in-flight",
        },
      })
    })

    it("rejects expired and cross-tenant authorizations", async () => {
      const clock = createClock()
      const store =
        new InMemoryTestProviderContinuityStore()
      const authority =
        createAuthority(clock)

      await createIndeterminateReceipt(
        store,
        clock,
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          authority,
          clock.now,
        )

      const expiredToken =
        authority.issue({
          actor: createActor(clock),
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationId:
            "expiring-auth",
          reason: "reviewed",
          verificationReference:
            "provider-reference",
          ttlMs: 10,
        })

      clock.advance(100)

      await expect(
        resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationToken:
            expiredToken,
          leaseId: "expired-lease",
          workerId: "worker-a",
          leaseTtlMs: 5_000,
        }),
      ).rejects.toMatchObject({
        code:
          "OWNER_AUTHORIZATION_EXPIRED",
      })

      const tenantBToken = createToken(
        authority,
        clock,
        {
          tenantId: "tenant-b",
        },
      )

      await expect(
        resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationToken:
            tenantBToken,
          leaseId:
            "cross-tenant-lease",
          workerId: "worker-a",
          leaseTtlMs: 5_000,
        }),
      ).rejects.toMatchObject({
        code:
          "OWNER_AUTHORIZATION_SCOPE_MISMATCH",
      })
    })

    it("uses signed owner identity and evidence to confirm completion", async () => {
      const clock = createClock()
      const store =
        new InMemoryTestProviderContinuityStore()
      const authority =
        createAuthority(clock)

      await createIndeterminateReceipt(
        store,
        clock,
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          authority,
          clock.now,
        )

      const token = createToken(
        authority,
        clock,
        {
          reason:
            "provider dashboard confirms completion",
          verificationReference:
            "provider-transaction-7788",
        },
      )

      const resolution =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationToken: token,
          leaseId: "resolution-lease",
          workerId:
            "resolution-worker",
          leaseTtlMs: 5_000,
        })

      expect(resolution).toMatchObject({
        outcome: "applied",
        code:
          "EXECUTION_CONFIRMED_COMPLETED",
        receipt: {
          payload: {
            status: "completed",
            ownerId: "owner-a",
            reason:
              "provider dashboard confirms completion",
            verificationReference:
              "provider-transaction-7788",
          },
        },
      })
    })

    it("cryptographically binds one manual retry to its exact owner and operation", async () => {
      const clock = createClock()
      const store =
        new InMemoryTestProviderContinuityStore()
      const authority =
        createAuthority(clock)

      await createIndeterminateReceipt(
        store,
        clock,
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          authority,
          clock.now,
        )

      const token = createToken(
        authority,
        clock,
        {
          decision:
            "authorize-single-retry",
          retryAuthorizationId:
            "retry-auth-777",
          verificationReference:
            "provider-no-side-effect-777",
        },
      )

      await expect(
        resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          authorizationToken: token,
          leaseId:
            "wrong-decision-lease",
          workerId: "worker-a",
          leaseTtlMs: 5_000,
        }),
      ).rejects.toMatchObject({
        code:
          "OWNER_AUTHORIZATION_DECISION_MISMATCH",
      })

      const authorization =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "authorize-single-retry",
          authorizationToken: token,
          leaseId: "resolution-lease",
          workerId:
            "resolution-worker",
          leaseTtlMs: 5_000,
        })

      expect(authorization).toMatchObject({
        outcome: "applied",
        code:
          "SINGLE_RETRY_AUTHORIZED",
        receipt: {
          payload: {
            status:
              "retry-authorized",
            retryAuthorizationId:
              "retry-auth-777",
            retryAuthorizedBy:
              "owner-a",
            verificationReference:
              "provider-no-side-effect-777",
          },
        },
      })

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now: clock.now,
        })

      let retryCount = 0

      const retry = await guard.execute(
        {
          ...executionInput,
          leaseId: "manual-retry-lease",
          workerId:
            "manual-retry-worker",
          manualRetryAuthorization: {
            authorizationId:
              "retry-auth-777",
            ownerId: "owner-a",
          },
        },
        async () => {
          retryCount += 1
          return "manual-retry-success"
        },
      )

      expect(retry).toMatchObject({
        outcome: "executed",
        value: "manual-retry-success",
      })

      expect(retryCount).toBe(1)
    })
  },
)
