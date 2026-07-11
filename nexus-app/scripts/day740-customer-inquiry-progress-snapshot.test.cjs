/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY740_MODULE;

if (!modulePath) {
  throw new Error("DAY740_MODULE is required.");
}

const {
  CustomerInquiryProgressError,
  getCustomerInquiryProgress,
} = require(modulePath);

const ownerContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "owner-a",
  role: "owner",
});

const customerContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  actorId: "customer-a",
  role: "customer",
});

const inquiry = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  assignedOwnerId: "owner-a",
  status: "received",
  createdAt: "2026-07-11T00:00:00.000Z",
  updatedAt: "2026-07-11T00:00:00.000Z",
});

const recommendation = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  recommendationId: "recommendation-733",
  status: "generated",
  publicSummary:
    "A sandbox quotation is ready for owner review.",
  internalPrompt: "Must never be exposed.",
  createdAt: "2026-07-11T00:10:00.000Z",
  updatedAt: "2026-07-11T00:10:00.000Z",
});

const approvedDecision = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  recommendationId: "recommendation-733",
  decisionId: "decision-734",
  decision: "approved",
  privateOwnerNote: "Must never be exposed.",
  createdAt: "2026-07-11T00:20:00.000Z",
  updatedAt: "2026-07-11T00:20:00.000Z",
});

const succeededExecution = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  decisionId: "decision-734",
  executionId: "execution-735",
  state: "succeeded",
  failureCode: null,
  providerTrace: "Must never be exposed.",
  createdAt: "2026-07-11T00:30:00.000Z",
  updatedAt: "2026-07-11T00:31:00.000Z",
});

const release = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  executionId: "execution-735",
  releaseId: "release-737",
  status: "released",
  result: {
    summary:
      "Sandbox recommendation completed successfully.",
    recommendation:
      "Review the prepared sandbox quotation.",
    nextStep:
      "Contact the owner for final confirmation.",
    reference: "NEXUS-SBX-735",
    status: "completed",
    mode: "sandbox",
    internalPrompt: "Must never be exposed.",
    providerTrace: "Must never be exposed.",
  },
  createdAt: "2026-07-11T01:00:00.000Z",
  updatedAt: "2026-07-11T01:00:00.000Z",
});

const acknowledgement = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  executionId: "execution-735",
  releaseId: "release-737",
  acknowledgementId: "acknowledgement-738",
  status: "acknowledged",
  createdAt: "2026-07-11T02:00:00.000Z",
  updatedAt: "2026-07-11T02:00:00.000Z",
});

function createBundle(overrides = {}) {
  return {
    inquiry: { ...inquiry },
    recommendation: { ...recommendation },
    decision: { ...approvedDecision },
    execution: { ...succeededExecution },
    release: { ...release },
    acknowledgement: { ...acknowledgement },
    ...overrides,
  };
}

function repositoryReturning(bundle, counter) {
  return {
    async loadLifecycle({ tenantId, inquiryId }) {
      if (counter) {
        counter.calls += 1;
      }

      assert.equal(tenantId, "tenant-a");
      assert.equal(inquiryId, "inquiry-735");

      return bundle;
    },
  };
}

async function expectProgressCode(
  action,
  expectedCode,
) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof CustomerInquiryProgressError &&
      error.code === expectedCode,
  );
}

async function expectLifecycleCode(
  action,
  expectedCode,
) {
  await assert.rejects(
    action,
    (error) =>
      error &&
      error.name === "CustomerInquiryLifecycleError" &&
      error.code === expectedCode,
  );
}

async function main() {
  const invalidVersionCounter = { calls: 0 };

  await expectProgressCode(
    () =>
      getCustomerInquiryProgress({
        context: customerContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        knownVersion: "invalid-version",
        repository: repositoryReturning(
          createBundle(),
          invalidVersionCounter,
        ),
      }),
    "INVALID_KNOWN_VERSION",
  );

  assert.equal(
    invalidVersionCounter.calls,
    0,
    "Malformed conditional versions must fail before repository access.",
  );

  const securityCounter = { calls: 0 };

  await expectLifecycleCode(
    () =>
      getCustomerInquiryProgress({
        context: {
          ...customerContext,
          authenticated: false,
        },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(
          createBundle(),
          securityCounter,
        ),
      }),
    "UNAUTHENTICATED",
  );

  await expectLifecycleCode(
    () =>
      getCustomerInquiryProgress({
        context: customerContext,
        requestedTenantId: "tenant-b",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(
          createBundle(),
          securityCounter,
        ),
      }),
    "CROSS_TENANT_ACCESS",
  );

  assert.equal(
    securityCounter.calls,
    0,
    "Authentication and tenant checks must fail before repository access.",
  );

  const inquiryOnly =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(
        createBundle({
          recommendation: null,
          decision: null,
          execution: null,
          release: null,
          acknowledgement: null,
        }),
      ),
    });

  assert.equal(inquiryOnly.changed, true);
  assert.equal(
    inquiryOnly.snapshot.lifecycleStatus,
    "inquiry_received",
  );
  assert.equal(
    inquiryOnly.snapshot.steps[1].state,
    "current",
  );
  assert.equal(
    inquiryOnly.snapshot.actionRequired,
    false,
  );

  const recommendationReady =
    await getCustomerInquiryProgress({
      context: ownerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(
        createBundle({
          decision: null,
          execution: null,
          release: null,
          acknowledgement: null,
        }),
      ),
    });

  assert.equal(
    recommendationReady.snapshot.lifecycleStatus,
    "recommendation_ready",
  );
  assert.equal(
    recommendationReady.snapshot.actionRequired,
    true,
  );
  assert.match(
    recommendationReady.snapshot.actionMessage,
    /approve or reject/i,
  );
  assert.equal(
    recommendationReady.snapshot.steps[2].state,
    "current",
  );

  const rejected =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(
        createBundle({
          decision: {
            ...approvedDecision,
            decision: "rejected",
          },
          execution: null,
          release: null,
          acknowledgement: null,
        }),
      ),
    });

  assert.equal(
    rejected.snapshot.lifecycleStatus,
    "owner_rejected",
  );
  assert.equal(rejected.snapshot.terminal, true);
  assert.equal(
    rejected.snapshot.steps[3].state,
    "blocked",
  );
  assert.equal(
    rejected.snapshot.steps[4].state,
    "blocked",
  );
  assert.equal(
    rejected.snapshot.steps[5].state,
    "blocked",
  );

  const failedBundle = createBundle({
    execution: {
      ...succeededExecution,
      state: "failed",
      failureCode: "provider timeout / internal detail",
    },
    release: null,
    acknowledgement: null,
  });

  const failedCustomer =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(failedBundle),
    });

  assert.equal(
    failedCustomer.snapshot.lifecycleStatus,
    "sandbox_failed",
  );
  assert.equal(failedCustomer.snapshot.terminal, true);
  assert.equal(
    failedCustomer.snapshot.failureCode,
    null,
    "Customers must not receive execution failure details.",
  );

  const failedOwner =
    await getCustomerInquiryProgress({
      context: ownerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(failedBundle),
    });

  assert.equal(
    failedOwner.snapshot.failureCode,
    "PROVIDER_TIMEOUT___INTERNAL_DETAIL",
  );
  assert.equal(
    failedOwner.snapshot.actionRequired,
    true,
  );

  const succeeded =
    await getCustomerInquiryProgress({
      context: ownerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(
        createBundle({
          release: null,
          acknowledgement: null,
        }),
      ),
    });

  assert.equal(
    succeeded.snapshot.lifecycleStatus,
    "sandbox_succeeded",
  );
  assert.equal(
    succeeded.snapshot.steps[3].state,
    "complete",
  );
  assert.equal(
    succeeded.snapshot.steps[4].state,
    "current",
  );
  assert.equal(
    succeeded.snapshot.actionRequired,
    true,
  );
  assert.match(
    succeeded.snapshot.actionMessage,
    /release/i,
  );

  const released =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(
        createBundle({
          acknowledgement: null,
        }),
      ),
    });

  assert.equal(
    released.snapshot.lifecycleStatus,
    "result_released",
  );
  assert.equal(
    released.snapshot.steps[4].state,
    "complete",
  );
  assert.equal(
    released.snapshot.steps[5].state,
    "current",
  );
  assert.equal(
    released.snapshot.actionRequired,
    true,
  );
  assert.equal(
    released.snapshot.result.mode,
    "sandbox",
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      released.snapshot.result,
      "internalPrompt",
    ),
    false,
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      released.snapshot.result,
      "providerTrace",
    ),
    false,
  );

  const acknowledged =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(createBundle()),
    });

  assert.equal(
    acknowledged.snapshot.lifecycleStatus,
    "customer_acknowledged",
  );
  assert.equal(acknowledged.snapshot.terminal, true);
  assert.equal(acknowledged.snapshot.completedSteps, 6);
  assert.equal(acknowledged.snapshot.totalSteps, 6);
  assert.equal(
    acknowledged.snapshot.steps.every(
      (step) => step.state === "complete",
    ),
    true,
  );

  const unchanged =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      knownVersion: acknowledged.version,
      repository: repositoryReturning(createBundle()),
    });

  assert.deepEqual(unchanged, {
    changed: false,
    version: acknowledged.version,
    snapshot: null,
  });

  const repeated =
    await getCustomerInquiryProgress({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(createBundle()),
    });

  assert.deepEqual(
    repeated,
    acknowledged,
    "Repeated progress reads must remain deterministic.",
  );

  console.log("DAY 740 TARGETED TESTS PASS (12/12)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
