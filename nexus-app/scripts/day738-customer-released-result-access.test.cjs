/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY738_MODULE;

if (!modulePath) {
  throw new Error("DAY738_MODULE is required.");
}

const {
  CustomerReleasedResultAccessError,
  accessReleasedCustomerResult,
} = require(modulePath);

const fixedNow = "2026-07-11T02:00:00.000Z";

const validContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  customerId: "customer-a",
});

const baseRelease = Object.freeze({
  releaseId: "crr1_abcd1234",
  releaseIdempotencyKey:
    "customer-result-release:v1:tenant-a:owner-a:customer-a:inquiry-735:decision-734:execution-735",
  tenantId: "tenant-a",
  ownerId: "owner-a",
  customerId: "customer-a",
  inquiryId: "inquiry-735",
  decisionId: "decision-734",
  executionId: "execution-735",
  status: "released",
  result: {
    summary: "Sandbox recommendation completed successfully.",
    recommendation: "Review the prepared sandbox quotation.",
    nextStep: "Contact the business owner for final confirmation.",
    reference: "NEXUS-SBX-735",
    status: "completed",
    mode: "sandbox",
    internalPrompt: "Must never be exposed.",
    providerTrace: "Must never be exposed.",
  },
  createdAt: "2026-07-11T01:00:00.000Z",
  updatedAt: "2026-07-11T01:00:00.000Z",
});

async function expectCode(action, expectedCode) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof CustomerReleasedResultAccessError &&
      error.code === expectedCode,
  );
}

function repositoryReturning(release) {
  return {
    async findReleasedResult() {
      return release;
    },

    async findAcknowledgementByIdempotencyKey() {
      return null;
    },

    async insertAcknowledgementIfAbsent({ acknowledgement }) {
      return {
        created: true,
        acknowledgement,
      };
    },
  };
}

async function main() {
  let preflightRepositoryCalls = 0;

  const preflightRepository = {
    async findReleasedResult() {
      preflightRepositoryCalls += 1;
      return { ...baseRelease };
    },

    async findAcknowledgementByIdempotencyKey() {
      preflightRepositoryCalls += 1;
      return null;
    },

    async insertAcknowledgementIfAbsent() {
      preflightRepositoryCalls += 1;
      throw new Error("Must not persist.");
    },
  };

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: {
          ...validContext,
          authenticated: false,
        },
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: false,
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "UNAUTHENTICATED",
  );

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-b",
        releaseId: "crr1_abcd1234",
        acknowledge: false,
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
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: false,
        repository: repositoryReturning(null),
        nowIso: fixedNow,
      }),
    "RELEASE_NOT_FOUND",
  );

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: false,
        repository: repositoryReturning({
          ...baseRelease,
          tenantId: "tenant-b",
        }),
        nowIso: fixedNow,
      }),
    "RELEASE_TENANT_MISMATCH",
  );

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: false,
        repository: repositoryReturning({
          ...baseRelease,
          customerId: "customer-b",
        }),
        nowIso: fixedNow,
      }),
    "RELEASE_CUSTOMER_MISMATCH",
  );

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: false,
        repository: repositoryReturning({
          ...baseRelease,
          result: {
            ...baseRelease.result,
            mode: "live",
          },
        }),
        nowIso: fixedNow,
      }),
    "INVALID_RELEASE_RECORD",
  );

  let readOnlyAcknowledgementCalls = 0;

  const readOnlyRepository = {
    async findReleasedResult({ tenantId, releaseId }) {
      assert.equal(tenantId, "tenant-a");
      assert.equal(releaseId, "crr1_abcd1234");
      return { ...baseRelease };
    },

    async findAcknowledgementByIdempotencyKey() {
      readOnlyAcknowledgementCalls += 1;
      return null;
    },

    async insertAcknowledgementIfAbsent() {
      readOnlyAcknowledgementCalls += 1;
      throw new Error("Read-only access must not acknowledge.");
    },
  };

  const readOnlyAccess = await accessReleasedCustomerResult({
    context: validContext,
    requestedTenantId: "tenant-a",
    releaseId: "crr1_abcd1234",
    acknowledge: false,
    repository: readOnlyRepository,
    nowIso: fixedNow,
  });

  assert.equal(readOnlyAccess.acknowledgement, null);
  assert.equal(readOnlyAcknowledgementCalls, 0);
  assert.equal(readOnlyAccess.result.mode, "sandbox");
  assert.equal(readOnlyAccess.result.status, "completed");
  assert.match(readOnlyAccess.result.version, /^crv1_[a-f0-9]{8}$/);

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      readOnlyAccess.result,
      "internalPrompt",
    ),
    false,
    "Internal prompt data must never enter the customer view.",
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      readOnlyAccess.result,
      "providerTrace",
    ),
    false,
    "Provider trace data must never enter the customer view.",
  );

  let storedAcknowledgement = null;
  let insertCount = 0;

  const idempotentRepository = {
    async findReleasedResult() {
      return { ...baseRelease };
    },

    async findAcknowledgementByIdempotencyKey({
      tenantId,
      acknowledgementIdempotencyKey,
    }) {
      assert.equal(tenantId, "tenant-a");

      if (storedAcknowledgement) {
        assert.equal(
          acknowledgementIdempotencyKey,
          storedAcknowledgement.acknowledgementIdempotencyKey,
        );
      }

      return storedAcknowledgement;
    },

    async insertAcknowledgementIfAbsent({ acknowledgement }) {
      insertCount += 1;

      if (!storedAcknowledgement) {
        storedAcknowledgement = acknowledgement;

        return {
          created: true,
          acknowledgement: storedAcknowledgement,
        };
      }

      return {
        created: false,
        acknowledgement: storedAcknowledgement,
      };
    },
  };

  const firstAcknowledgement =
    await accessReleasedCustomerResult({
      context: validContext,
      requestedTenantId: "tenant-a",
      releaseId: "crr1_abcd1234",
      acknowledge: true,
      repository: idempotentRepository,
      nowIso: fixedNow,
    });

  assert.equal(
    firstAcknowledgement.acknowledgement.created,
    true,
  );

  assert.equal(
    firstAcknowledgement.acknowledgement.record.status,
    "acknowledged",
  );

  assert.match(
    firstAcknowledgement.acknowledgement.record
      .acknowledgementId,
    /^cra1_[a-f0-9]{8}$/,
  );

  const secondAcknowledgement =
    await accessReleasedCustomerResult({
      context: validContext,
      requestedTenantId: "tenant-a",
      releaseId: "crr1_abcd1234",
      acknowledge: true,
      repository: idempotentRepository,
      nowIso: fixedNow,
    });

  assert.equal(
    secondAcknowledgement.acknowledgement.created,
    false,
  );

  assert.deepEqual(
    secondAcknowledgement.acknowledgement.record,
    firstAcknowledgement.acknowledgement.record,
  );

  assert.equal(
    insertCount,
    1,
    "Repeated acknowledgements must not create duplicate records.",
  );

  const conflictingRepository = {
    async findReleasedResult() {
      return { ...baseRelease };
    },

    async findAcknowledgementByIdempotencyKey() {
      return null;
    },

    async insertAcknowledgementIfAbsent({ acknowledgement }) {
      return {
        created: false,
        acknowledgement: {
          ...acknowledgement,
          customerId: "customer-conflict",
        },
      };
    },
  };

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: true,
        repository: conflictingRepository,
        nowIso: fixedNow,
      }),
    "IDEMPOTENCY_CONFLICT",
  );

  await expectCode(
    () =>
      accessReleasedCustomerResult({
        context: validContext,
        requestedTenantId: "tenant-a",
        releaseId: "crr1_abcd1234",
        acknowledge: true,
        repository: repositoryReturning({
          ...baseRelease,
        }),
        nowIso: "invalid-date",
      }),
    "INVALID_REQUEST",
  );

  console.log("DAY 738 TARGETED TESTS PASS (12/12)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
