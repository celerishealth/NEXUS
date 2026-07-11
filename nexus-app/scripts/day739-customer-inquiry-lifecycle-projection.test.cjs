/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY739_MODULE;

if (!modulePath) {
  throw new Error("DAY739_MODULE is required.");
}

const {
  CustomerInquiryLifecycleError,
  projectCustomerInquiryLifecycle,
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
  publicSummary: "A sandbox quotation is ready for owner review.",
  internalPrompt: "Never expose this internal prompt.",
  createdAt: "2026-07-11T00:10:00.000Z",
  updatedAt: "2026-07-11T00:10:00.000Z",
});

const decision = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  recommendationId: "recommendation-733",
  decisionId: "decision-734",
  decision: "approved",
  privateOwnerNote: "Never expose this note.",
  createdAt: "2026-07-11T00:20:00.000Z",
  updatedAt: "2026-07-11T00:20:00.000Z",
});

const execution = Object.freeze({
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  decisionId: "decision-734",
  executionId: "execution-735",
  state: "succeeded",
  failureCode: null,
  providerTrace: "Never expose provider trace.",
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
    summary: "Sandbox recommendation completed successfully.",
    recommendation: "Review the prepared sandbox quotation.",
    nextStep: "Contact the owner for final confirmation.",
    reference: "NEXUS-SBX-735",
    status: "completed",
    mode: "sandbox",
    internalPrompt: "Never expose this.",
    providerTrace: "Never expose this.",
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
    decision: { ...decision },
    execution: { ...execution },
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

async function expectCode(action, expectedCode) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof CustomerInquiryLifecycleError &&
      error.code === expectedCode,
  );
}

async function main() {
  const preflightCounter = { calls: 0 };

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: {
          ...customerContext,
          authenticated: false,
        },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(
          createBundle(),
          preflightCounter,
        ),
      }),
    "UNAUTHENTICATED",
  );

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: customerContext,
        requestedTenantId: "tenant-b",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(
          createBundle(),
          preflightCounter,
        ),
      }),
    "CROSS_TENANT_ACCESS",
  );

  assert.equal(
    preflightCounter.calls,
    0,
    "Authentication and tenant checks must fail before repository access.",
  );

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: customerContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(null),
      }),
    "LIFECYCLE_NOT_FOUND",
  );

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: {
          ...customerContext,
          actorId: "customer-b",
        },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(createBundle()),
      }),
    "ACTOR_ACCESS_DENIED",
  );

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: {
          ...ownerContext,
          actorId: "owner-b",
        },
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(createBundle()),
      }),
    "ACTOR_ACCESS_DENIED",
  );

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: ownerContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(
          createBundle({
            recommendation: null,
            decision: { ...decision },
          }),
        ),
      }),
    "INVALID_LIFECYCLE_ORDER",
  );

  await expectCode(
    () =>
      projectCustomerInquiryLifecycle({
        context: ownerContext,
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        repository: repositoryReturning(
          createBundle({
            execution: {
              ...execution,
              tenantId: "tenant-b",
            },
          }),
        ),
      }),
    "LIFECYCLE_REFERENCE_MISMATCH",
  );

  const inquiryOnly =
    await projectCustomerInquiryLifecycle({
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

  assert.equal(inquiryOnly.status, "inquiry_received");
  assert.equal(inquiryOnly.result, null);

  const rejected =
    await projectCustomerInquiryLifecycle({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(
        createBundle({
          decision: {
            ...decision,
            decision: "rejected",
          },
          execution: null,
          release: null,
          acknowledgement: null,
        }),
      ),
    });

  assert.equal(rejected.status, "owner_rejected");
  assert.equal(rejected.ownerDecision, "rejected");
  assert.equal(rejected.result, null);

  const failedBundle = createBundle({
    execution: {
      ...execution,
      state: "failed",
      failureCode: "provider timeout / secret detail",
    },
    release: null,
    acknowledgement: null,
  });

  const failedCustomer =
    await projectCustomerInquiryLifecycle({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(failedBundle),
    });

  assert.equal(failedCustomer.status, "sandbox_failed");
  assert.equal(
    failedCustomer.failureCode,
    null,
    "Failure details must remain hidden from customers.",
  );

  const failedOwner =
    await projectCustomerInquiryLifecycle({
      context: ownerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(failedBundle),
    });

  assert.equal(failedOwner.status, "sandbox_failed");
  assert.equal(
    failedOwner.failureCode,
    "PROVIDER_TIMEOUT___SECRET_DETAIL",
  );

  const customerView =
    await projectCustomerInquiryLifecycle({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(createBundle()),
    });

  assert.equal(
    customerView.status,
    "customer_acknowledged",
  );
  assert.equal(customerView.role, "customer");
  assert.equal(customerView.releaseId, "release-737");
  assert.equal(
    customerView.acknowledgementId,
    "acknowledgement-738",
  );
  assert.equal(customerView.result.mode, "sandbox");
  assert.equal(customerView.result.status, "completed");
  assert.match(customerView.version, /^clv1_[a-f0-9]{8}$/);

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      customerView,
      "privateOwnerNote",
    ),
    false,
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      customerView,
      "providerTrace",
    ),
    false,
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      customerView.result,
      "internalPrompt",
    ),
    false,
  );

  const repeatedCustomerView =
    await projectCustomerInquiryLifecycle({
      context: customerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(createBundle()),
    });

  assert.deepEqual(
    repeatedCustomerView,
    customerView,
    "Repeated lifecycle reads must be deterministic.",
  );

  const ownerView =
    await projectCustomerInquiryLifecycle({
      context: ownerContext,
      requestedTenantId: "tenant-a",
      inquiryId: "inquiry-735",
      repository: repositoryReturning(createBundle()),
    });

  assert.equal(ownerView.status, "customer_acknowledged");
  assert.equal(ownerView.role, "owner");
  assert.equal(ownerView.ownerDecision, "approved");
  assert.equal(ownerView.failureCode, null);

  console.log("DAY 739 TARGETED TESTS PASS (12/12)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
