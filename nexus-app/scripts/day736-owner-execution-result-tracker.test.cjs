/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY736_MODULE;

if (!modulePath) {
  throw new Error("DAY736_MODULE is required.");
}

const {
  OwnerExecutionResultAccessError,
  trackOwnerExecutionResult,
} = require(modulePath);

const baseRecord = Object.freeze({
  tenantId: "tenant-a",
  ownerId: "owner-a",
  inquiryId: "inquiry-735",
  decisionId: "decision-734",
  executionId: "execution-735",
  idempotencyKey: "tenant-a:inquiry-735:decision-734",
  state: "succeeded",
  publicResult: {
    summary: "Sandbox recommendation executed successfully.",
    mode: "sandbox",
  },
  failureCode: null,
  createdAt: "2026-07-11T00:00:00.000Z",
  updatedAt: "2026-07-11T00:01:00.000Z",
});

const validContext = Object.freeze({
  authenticated: true,
  ownerId: "owner-a",
  tenantId: "tenant-a",
});

async function expectAccessCode(action, expectedCode) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof OwnerExecutionResultAccessError &&
      error.code === expectedCode,
  );
}

async function main() {
  let repositoryCalls = 0;

  const repository = {
    async findLatestByInquiry({ tenantId, inquiryId }) {
      repositoryCalls += 1;
      assert.equal(tenantId, "tenant-a");
      assert.equal(inquiryId, "inquiry-735");
      return { ...baseRecord };
    },
  };

  await expectAccessCode(
    () =>
      trackOwnerExecutionResult({
        context: { ...validContext, authenticated: false },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository,
      }),
    "UNAUTHENTICATED",
  );

  await expectAccessCode(
    () =>
      trackOwnerExecutionResult({
        context: validContext,
        requestedTenantId: "tenant-b",
        inquiryId: "inquiry-735",
        repository,
      }),
    "CROSS_TENANT_ACCESS",
  );

  assert.equal(
    repositoryCalls,
    0,
    "Cross-tenant requests must fail before repository access.",
  );

  const missing = await trackOwnerExecutionResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    repository: {
      async findLatestByInquiry() {
        return null;
      },
    },
  });

  assert.deepEqual(missing, {
    found: false,
    tenantId: "tenant-a",
    inquiryId: "inquiry-735",
    status: "not_started",
    version: null,
    executionId: null,
    decisionId: null,
    idempotencyKey: null,
    updatedAt: null,
    result: null,
    failureCode: null,
  });

  await expectAccessCode(
    () =>
      trackOwnerExecutionResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: {
          async findLatestByInquiry() {
            return { ...baseRecord, tenantId: "tenant-b" };
          },
        },
      }),
    "RECORD_TENANT_MISMATCH",
  );

  await expectAccessCode(
    () =>
      trackOwnerExecutionResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: {
          async findLatestByInquiry() {
            return { ...baseRecord, ownerId: "owner-b" };
          },
        },
      }),
    "RECORD_OWNER_MISMATCH",
  );

  await expectAccessCode(
    () =>
      trackOwnerExecutionResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: {
          async findLatestByInquiry() {
            return { ...baseRecord, inquiryId: "inquiry-other" };
          },
        },
      }),
    "RECORD_INQUIRY_MISMATCH",
  );

  const succeeded = await trackOwnerExecutionResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    repository,
  });

  assert.equal(succeeded.found, true);
  assert.equal(succeeded.status, "succeeded");
  assert.equal(succeeded.executionId, "execution-735");
  assert.equal(succeeded.idempotencyKey, baseRecord.idempotencyKey);
  assert.deepEqual(succeeded.result, baseRecord.publicResult);
  assert.equal(succeeded.failureCode, null);
  assert.match(succeeded.version, /^erv1_[a-f0-9]{8}$/);

  const failed = await trackOwnerExecutionResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    repository: {
      async findLatestByInquiry() {
        return {
          ...baseRecord,
          state: "failed",
          publicResult: {
            unsafeInternalDetail: "must not be exposed",
          },
          failureCode: "provider timeout / raw detail",
        };
      },
    },
  });

  assert.equal(failed.status, "failed");
  assert.equal(failed.result, null);
  assert.equal(failed.failureCode, "PROVIDER_TIMEOUT___RAW_DETAIL");

  const firstRead = await trackOwnerExecutionResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    repository,
  });

  const secondRead = await trackOwnerExecutionResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    inquiryId: "inquiry-735",
    repository,
  });

  assert.deepEqual(
    firstRead,
    secondRead,
    "Repeated reads must produce the same deterministic result.",
  );

  assert.equal(
    repositoryCalls,
    3,
    "Each authorized tracking request must perform exactly one repository read.",
  );

  console.log("DAY 736 TARGETED TESTS PASS (9/9)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
