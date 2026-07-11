/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY737_MODULE;

if (!modulePath) {
  throw new Error("DAY737_MODULE is required.");
}

const {
  OwnerCustomerResultReleaseError,
  releaseOwnerApprovedCustomerResult,
} = require(modulePath);

const fixedNow = "2026-07-11T01:00:00.000Z";

const validContext = Object.freeze({
  authenticated: true,
  ownerId: "owner-a",
  tenantId: "tenant-a",
});

const baseExecution = Object.freeze({
  tenantId: "tenant-a",
  ownerId: "owner-a",
  customerId: "customer-a",
  inquiryId: "inquiry-735",
  decisionId: "decision-734",
  executionId: "execution-735",
  state: "succeeded",
  publicResult: {
    summary: "Sandbox recommendation completed successfully.",
    recommendation: "Review the prepared sandbox quotation.",
    nextStep: "Contact the business owner for final confirmation.",
    reference: "NEXUS-SBX-735",
    internalPrompt: "This field must never enter the customer projection.",
    providerTrace: "This field must remain private.",
  },
  failureCode: null,
  updatedAt: "2026-07-11T00:59:00.000Z",
});

async function expectCode(action, expectedCode) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof OwnerCustomerResultReleaseError &&
      error.code === expectedCode,
  );
}

function repositoryReturning(execution) {
  return {
    async findExecution() {
      return execution;
    },
    async findReleaseByIdempotencyKey() {
      return null;
    },
    async insertReleaseIfAbsent({ release }) {
      return {
        created: true,
        release,
      };
    },
  };
}

async function main() {
  let preflightRepositoryCalls = 0;

  const preflightRepository = {
    async findExecution() {
      preflightRepositoryCalls += 1;
      return { ...baseExecution };
    },
    async findReleaseByIdempotencyKey() {
      preflightRepositoryCalls += 1;
      return null;
    },
    async insertReleaseIfAbsent() {
      preflightRepositoryCalls += 1;
      throw new Error("Must not persist.");
    },
  };

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: {
          ...validContext,
          authenticated: false,
        },
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "UNAUTHENTICATED",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-b",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "CROSS_TENANT_ACCESS",
  );

  assert.equal(
    preflightRepositoryCalls,
    0,
    "Authentication and tenant checks must fail before repository access.",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning(null),
        nowIso: fixedNow,
      }),
    "EXECUTION_NOT_FOUND",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning({
          ...baseExecution,
          tenantId: "tenant-b",
        }),
        nowIso: fixedNow,
      }),
    "EXECUTION_TENANT_MISMATCH",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning({
          ...baseExecution,
          ownerId: "owner-b",
        }),
        nowIso: fixedNow,
      }),
    "EXECUTION_OWNER_MISMATCH",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning({
          ...baseExecution,
          customerId: "customer-b",
        }),
        nowIso: fixedNow,
      }),
    "EXECUTION_CUSTOMER_MISMATCH",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning({
          ...baseExecution,
          inquiryId: "inquiry-other",
        }),
        nowIso: fixedNow,
      }),
    "EXECUTION_INQUIRY_MISMATCH",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning({
          ...baseExecution,
          state: "failed",
          failureCode: "SANDBOX_FAILURE",
        }),
        nowIso: fixedNow,
      }),
    "EXECUTION_NOT_SUCCEEDED",
  );

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: repositoryReturning({
          ...baseExecution,
          publicResult: {
            recommendation: "Missing required customer summary.",
          },
        }),
        nowIso: fixedNow,
      }),
    "UNSAFE_CUSTOMER_RESULT",
  );

  let storedRelease = null;
  let insertCount = 0;

  const idempotentRepository = {
    async findExecution({ tenantId, executionId }) {
      assert.equal(tenantId, "tenant-a");
      assert.equal(executionId, "execution-735");
      return { ...baseExecution };
    },

    async findReleaseByIdempotencyKey({
      tenantId,
      releaseIdempotencyKey,
    }) {
      assert.equal(tenantId, "tenant-a");

      if (storedRelease) {
        assert.equal(
          releaseIdempotencyKey,
          storedRelease.releaseIdempotencyKey,
        );
      }

      return storedRelease;
    },

    async insertReleaseIfAbsent({ release }) {
      insertCount += 1;

      if (!storedRelease) {
        storedRelease = release;
        return {
          created: true,
          release: storedRelease,
        };
      }

      return {
        created: false,
        release: storedRelease,
      };
    },
  };

  const firstRelease = await releaseOwnerApprovedCustomerResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    customerId: "customer-a",
    inquiryId: "inquiry-735",
    executionId: "execution-735",
    repository: idempotentRepository,
    nowIso: fixedNow,
  });

  assert.equal(firstRelease.created, true);
  assert.equal(firstRelease.release.status, "released");
  assert.equal(firstRelease.release.result.mode, "sandbox");
  assert.equal(firstRelease.release.result.status, "completed");
  assert.equal(
    firstRelease.release.result.summary,
    "Sandbox recommendation completed successfully.",
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      firstRelease.release.result,
      "internalPrompt",
    ),
    false,
    "Internal prompt data must not enter the customer result.",
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      firstRelease.release.result,
      "providerTrace",
    ),
    false,
    "Provider trace data must not enter the customer result.",
  );

  assert.match(firstRelease.release.releaseId, /^crr1_[a-f0-9]{8}$/);

  const secondRelease = await releaseOwnerApprovedCustomerResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    customerId: "customer-a",
    inquiryId: "inquiry-735",
    executionId: "execution-735",
    repository: idempotentRepository,
    nowIso: fixedNow,
  });

  assert.equal(secondRelease.created, false);
  assert.deepEqual(secondRelease.release, firstRelease.release);
  assert.equal(
    insertCount,
    1,
    "Repeated release requests must not create duplicate records.",
  );

  const conflictingRepository = {
    async findExecution() {
      return { ...baseExecution };
    },

    async findReleaseByIdempotencyKey() {
      return null;
    },

    async insertReleaseIfAbsent({ release }) {
      return {
        created: false,
        release: {
          ...release,
          customerId: "customer-conflict",
        },
      };
    },
  };

  await expectCode(
    () =>
      releaseOwnerApprovedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        customerId: "customer-a",
        inquiryId: "inquiry-735",
        executionId: "execution-735",
        repository: conflictingRepository,
        nowIso: fixedNow,
      }),
    "IDEMPOTENCY_CONFLICT",
  );

  console.log("DAY 737 TARGETED TESTS PASS (12/12)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
