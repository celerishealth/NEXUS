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

const createClock = (
  initial = 100,
) => {
  let now = initial

  return () => now++
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

describe(
  "owner-controlled indeterminate execution resolution",
  () => {
    it("allows verified completion and permanently blocks duplicate execution", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock()

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      const failed = await guard.execute(
        executionInput,
        async () => {
          throw new Error(
            "provider response lost",
          )
        },
      )

      expect(failed).toMatchObject({
        outcome: "failed",
        manualResolutionRequired: true,
      })

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          now,
        )

      const resolution =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision: "confirm-completed",
          ownerId: "owner-a",
          reason:
            "provider dashboard confirms transaction completed",
          verificationReference:
            "provider-transaction-7788",
          leaseId: "resolution-lease",
          workerId: "resolution-worker",
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
            verificationReference:
              "provider-transaction-7788",
          },
        },
      })

      let duplicateExecuted = false

      const duplicate = await guard.execute(
        {
          ...executionInput,
          leaseId: "duplicate-lease",
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

    it("requires exact owner authorization before one manual retry", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(200)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      await guard.execute(
        executionInput,
        async () => {
          throw new Error(
            "confirmed provider rejection",
          )
        },
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          now,
        )

      const authorization =
        await resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "authorize-single-retry",
          ownerId: "owner-a",
          reason:
            "provider confirms no transaction was created",
          verificationReference:
            "provider-search-no-result-991",
          retryAuthorizationId:
            "retry-auth-001",
          leaseId: "resolution-lease",
          workerId: "resolution-worker",
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
              "retry-auth-001",
            retryAuthorizedBy:
              "owner-a",
          },
        },
      })

      let unauthorizedExecuted = false

      const withoutAuthorization =
        await guard.execute(
          {
            ...executionInput,
            leaseId:
              "missing-auth-lease",
          },
          async () => {
            unauthorizedExecuted = true
            return "unsafe-result"
          },
        )

      expect(
        withoutAuthorization,
      ).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_REQUIRED",
      })

      expect(unauthorizedExecuted).toBe(
        false,
      )

      const wrongAuthorization =
        await guard.execute(
          {
            ...executionInput,
            leaseId:
              "wrong-auth-lease",
            manualRetryAuthorization: {
              authorizationId:
                "wrong-auth",
              ownerId: "owner-a",
            },
          },
          async () => "unsafe-result",
        )

      expect(wrongAuthorization).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_MANUAL_RETRY_AUTHORIZATION_MISMATCH",
      })

      let retryExecutionCount = 0

      const retry = await guard.execute(
        {
          ...executionInput,
          leaseId: "manual-retry-lease",
          workerId: "manual-retry-worker",
          manualRetryAuthorization: {
            authorizationId:
              "retry-auth-001",
            ownerId: "owner-a",
          },
        },
        async () => {
          retryExecutionCount += 1
          return "manual-retry-success"
        },
      )

      expect(retry).toMatchObject({
        outcome: "executed",
        value: "manual-retry-success",
      })

      const duplicate = await guard.execute(
        {
          ...executionInput,
          leaseId:
            "post-retry-duplicate",
          manualRetryAuthorization: {
            authorizationId:
              "retry-auth-001",
            ownerId: "owner-a",
          },
        },
        async () => {
          retryExecutionCount += 1
          return "unsafe-duplicate"
        },
      )

      expect(duplicate).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_ALREADY_COMPLETED",
      })

      expect(retryExecutionCount).toBe(1)
    })

    it("consumes retry authorization before callback and blocks another retry after failure", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(300)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      await guard.execute(
        executionInput,
        async () => {
          throw new Error(
            "first ambiguous failure",
          )
        },
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          now,
        )

      await resolver.resolve({
        tenantId: "tenant-a",
        providerDomain: "payments",
        operationId: "operation-one",
        decision:
          "authorize-single-retry",
        ownerId: "owner-a",
        reason:
          "provider confirms no side effect",
        verificationReference:
          "verification-300",
        retryAuthorizationId:
          "retry-auth-300",
        leaseId: "resolver-lease",
        workerId: "resolver-worker",
        leaseTtlMs: 5_000,
      })

      const retryFailure =
        await guard.execute(
          {
            ...executionInput,
            leaseId:
              "authorized-retry-lease",
            manualRetryAuthorization: {
              authorizationId:
                "retry-auth-300",
              ownerId: "owner-a",
            },
          },
          async () => {
            throw new Error(
              "second ambiguous failure",
            )
          },
        )

      expect(retryFailure).toMatchObject({
        outcome: "failed",
        manualResolutionRequired: true,
      })

      let thirdExecutionStarted = false

      const thirdAttempt =
        await guard.execute(
          {
            ...executionInput,
            leaseId: "third-lease",
            manualRetryAuthorization: {
              authorizationId:
                "retry-auth-300",
              ownerId: "owner-a",
            },
          },
          async () => {
            thirdExecutionStarted = true
            return "unsafe-third-attempt"
          },
        )

      expect(thirdAttempt).toMatchObject({
        outcome: "blocked",
        code:
          "PROVIDER_OPERATION_INDETERMINATE",
      })

      expect(thirdExecutionStarted).toBe(
        false,
      )
    })

    it("never permits a completed receipt to be reopened for retry", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(400)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      await guard.execute(
        executionInput,
        async () => "completed",
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          now,
        )

      const result = await resolver.resolve({
        tenantId: "tenant-a",
        providerDomain: "payments",
        operationId: "operation-one",
        decision:
          "authorize-single-retry",
        ownerId: "owner-a",
        reason: "unsafe reopen attempt",
        verificationReference:
          "unsafe-reference",
        retryAuthorizationId:
          "unsafe-retry-auth",
        leaseId: "resolver-lease",
        workerId: "resolver-worker",
        leaseTtlMs: 5_000,
      })

      expect(result).toMatchObject({
        outcome: "blocked",
        code:
          "COMPLETED_RECEIPT_RETRY_BLOCKED",
      })
    })

    it("requires provider verification evidence before resolution", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
        )

      await expect(
        resolver.resolve({
          tenantId: "tenant-a",
          providerDomain: "database",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          ownerId: "owner-a",
          reason: "reviewed",
          verificationReference: "",
          leaseId: "resolver-lease",
          workerId: "resolver-worker",
          leaseTtlMs: 5_000,
        }),
      ).rejects.toThrow(
        "verificationReference is required",
      )
    })

    it("keeps receipt resolution tenant-isolated", async () => {
      const store =
        new InMemoryTestProviderContinuityStore()
      const now = createClock(500)

      const guard =
        createDurableProviderExecutionGuard({
          store,
          containmentReader:
            createEmptyReader(),
          now,
        })

      await guard.execute(
        executionInput,
        async () => {
          throw new Error(
            "tenant-a failure",
          )
        },
      )

      const resolver =
        createDurableIndeterminateExecutionResolver(
          store,
          now,
        )

      const tenantBResolution =
        await resolver.resolve({
          tenantId: "tenant-b",
          providerDomain: "payments",
          operationId: "operation-one",
          decision:
            "confirm-completed",
          ownerId: "owner-b",
          reason:
            "unauthorized resolution",
          verificationReference:
            "unauthorized-reference",
          leaseId:
            "tenant-b-resolution-lease",
          workerId:
            "tenant-b-resolution-worker",
          leaseTtlMs: 5_000,
        })

      expect(tenantBResolution).toEqual({
        outcome: "blocked",
        code:
          "EXECUTION_RECEIPT_NOT_FOUND",
        receipt: null,
        leaseReleased: true,
      })
    })
  },
)
