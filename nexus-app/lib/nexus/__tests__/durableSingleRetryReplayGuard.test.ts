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
} from "../providerOwnerResolutionAuthority"

const authoritySecret =
  "nexus-owner-retry-replay-secret-for-tests-123456789"

const createClock = (
  initial = 1_000,
) => {
  let current = initial

  return {
    now: () => current++,
    peek: () => current,
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
  operationId:
    "single-retry-operation",
  leaseId: "initial-execution-lease",
  workerId:
    "initial-execution-worker",
  leaseTtlMs: 10_000,
  executionTimeoutMs: 1_000,
  safetyMarginMs: 1_000,
}

const createAuthority = (
  clock: ReturnType<typeof createClock>,
) =>
  createProviderOwnerResolutionAuthority({
    secret: authoritySecret,
    secretEnvironmentName:
      "NEXUS_OWNER_AUTHORIZATION_SECRET",
    maxAuthorizationTtlMs: 10_000,
    maxSessionAgeMs: 20_000,
    now: clock.now,
  })

const issueAuthorization = (
  authority:
    ReturnType<typeof createAuthority>,
  clock: ReturnType<typeof createClock>,
  input: {
    decision:
      | "confirm-completed"
      | "authorize-single-retry"
    authorizationId: string
    retryAuthorizationId?: string
    verificationReference: string
  },
): string =>
  authority.issue({
    actor: {
      ownerId: "owner-a",
      tenantId: "tenant-a",
      roles: ["owner"],
      stepUpVerified: true,
      authenticatedAt: 0,
      sessionExpiresAt:
        clock.peek() + 100_000,
    },
    providerDomain: "payments",
    operationId:
      "single-retry-operation",
    decision: input.decision,
    authorizationId:
      input.authorizationId,
    reason:
      "provider evidence reviewed by owner",
    verificationReference:
      input.verificationReference,
    retryAuthorizationId:
      input.retryAuthorizationId,
    ttlMs: 5_000,
  })

const createFailedInitialExecution =
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
          "initial ambiguous provider failure",
        )
      },
    )

    expect(result).toMatchObject({
      outcome: "failed",
      automaticRetryAuthorized: false,
      manualResolutionRequired: true,
    })

    return guard
  }

describe(
  "single retry permanence and authorization replay guard",
  () => {
    it("permanently blocks old and new retry authorizations after the single retry is consumed", async () => {
      const clock = createClock()

      const store =
        new InMemoryTestProviderContinuityStore()

      const guard =
        await createFailedInitialExecution(
          store,
          clock,
        )

      const authority =
        createAuthority(clock)

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          authority,
          clock.now,
        )

      const firstRetryToken =
        issueAuthorization(
          authority,
          clock,
          {
            decision:
              "authorize-single-retry",
            authorizationId:
              "owner-authorization-one",
            retryAuthorizationId:
              "retry-authorization-one",
            verificationReference:
              "provider-no-side-effect-one",
          },
        )

      const firstAuthorization =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId:
            "single-retry-operation",
          decision:
            "authorize-single-retry",
          authorizationToken:
            firstRetryToken,
          leaseId:
            "first-resolution-lease",
          workerId:
            "first-resolution-worker",
          leaseTtlMs: 10_000,
        })

      expect(
        firstAuthorization,
      ).toMatchObject({
        outcome: "applied",
        code:
          "SINGLE_RETRY_AUTHORIZED",
        receipt: {
          payload: {
            status:
              "retry-authorized",
            retryAuthorizationId:
              "retry-authorization-one",
          },
        },
      })

      let retryExecutionCount = 0

      const consumedRetry =
        await guard.execute(
          {
            ...executionInput,
            leaseId:
              "consumed-retry-lease",
            workerId:
              "consumed-retry-worker",
            manualRetryAuthorization: {
              authorizationId:
                "retry-authorization-one",
              ownerId: "owner-a",
            },
          },
          async () => {
            retryExecutionCount += 1

            throw new Error(
              "manual retry also returned an ambiguous failure",
            )
          },
        )

      expect(consumedRetry).toMatchObject({
        outcome: "failed",
        automaticRetryAuthorized: false,
        manualResolutionRequired: true,
      })

      expect(retryExecutionCount).toBe(1)

      const secondRetryToken =
        issueAuthorization(
          authority,
          clock,
          {
            decision:
              "authorize-single-retry",
            authorizationId:
              "owner-authorization-two",
            retryAuthorizationId:
              "retry-authorization-two",
            verificationReference:
              "provider-no-side-effect-two",
          },
        )

      const secondAuthorization =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId:
            "single-retry-operation",
          decision:
            "authorize-single-retry",
          authorizationToken:
            secondRetryToken,
          leaseId:
            "second-resolution-lease",
          workerId:
            "second-resolution-worker",
          leaseTtlMs: 10_000,
        })

      expect(
        secondAuthorization,
      ).toMatchObject({
        outcome: "blocked",
        code:
          "SINGLE_RETRY_ALREADY_CONSUMED",
        receipt: {
          payload: {
            status: "in-flight",
            retryAuthorizationId:
              "retry-authorization-one",
          },
        },
      })

      const replayedFirstToken =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId:
            "single-retry-operation",
          decision:
            "authorize-single-retry",
          authorizationToken:
            firstRetryToken,
          leaseId:
            "replayed-resolution-lease",
          workerId:
            "replayed-resolution-worker",
          leaseTtlMs: 10_000,
        })

      expect(
        replayedFirstToken,
      ).toMatchObject({
        outcome: "blocked",
        code:
          "SINGLE_RETRY_ALREADY_CONSUMED",
      })

      let forbiddenExecutionCount = 0

      const forbiddenRetry =
        await guard.execute(
          {
            ...executionInput,
            leaseId:
              "forbidden-extra-retry",
            workerId:
              "forbidden-extra-worker",
            manualRetryAuthorization: {
              authorizationId:
                "retry-authorization-two",
              ownerId: "owner-a",
            },
          },
          async () => {
            forbiddenExecutionCount += 1
            return "unsafe-extra-retry"
          },
        )

      expect(forbiddenRetry).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_INDETERMINATE",
      })

      expect(
        forbiddenExecutionCount,
      ).toBe(0)
    })

    it("still permits signed confirm-completed resolution after the consumed retry becomes ambiguous", async () => {
      const clock = createClock(10_000)

      const store =
        new InMemoryTestProviderContinuityStore()

      const guard =
        await createFailedInitialExecution(
          store,
          clock,
        )

      const authority =
        createAuthority(clock)

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          authority,
          clock.now,
        )

      const retryToken =
        issueAuthorization(
          authority,
          clock,
          {
            decision:
              "authorize-single-retry",
            authorizationId:
              "retry-owner-authorization",
            retryAuthorizationId:
              "single-retry-id",
            verificationReference:
              "provider-first-verification",
          },
        )

      await resolver.resolve({
        tenantId: "tenant-a",
        providerDomain: "payments",
        operationId:
          "single-retry-operation",
        decision:
          "authorize-single-retry",
        authorizationToken: retryToken,
        leaseId:
          "retry-resolution-lease",
        workerId:
          "retry-resolution-worker",
        leaseTtlMs: 10_000,
      })

      await guard.execute(
        {
          ...executionInput,
          leaseId:
            "authorized-retry-lease",
          workerId:
            "authorized-retry-worker",
          manualRetryAuthorization: {
            authorizationId:
              "single-retry-id",
            ownerId: "owner-a",
          },
        },
        async () => {
          throw new Error(
            "provider response lost after manual retry",
          )
        },
      )

      const completionToken =
        issueAuthorization(
          authority,
          clock,
          {
            decision:
              "confirm-completed",
            authorizationId:
              "completion-authorization",
            verificationReference:
              "provider-final-confirmation-9001",
          },
        )

      const completion =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId:
            "single-retry-operation",
          decision:
            "confirm-completed",
          authorizationToken:
            completionToken,
          leaseId:
            "completion-resolution-lease",
          workerId:
            "completion-resolution-worker",
          leaseTtlMs: 10_000,
        })

      expect(completion).toMatchObject({
        outcome: "applied",
        code:
          "EXECUTION_CONFIRMED_COMPLETED",
        receipt: {
          payload: {
            status: "completed",
            verificationReference:
              "provider-final-confirmation-9001",
            retryAuthorizationId:
              "single-retry-id",
          },
        },
      })

      let duplicateExecuted = false

      const duplicate =
        await guard.execute(
          {
            ...executionInput,
            leaseId:
              "post-completion-duplicate",
            workerId:
              "post-completion-worker",
          },
          async () => {
            duplicateExecuted = true
            return "unsafe-duplicate"
          },
        )

      expect(duplicate).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_ALREADY_COMPLETED",
      })

      expect(duplicateExecuted).toBe(false)
    })
  },
)
