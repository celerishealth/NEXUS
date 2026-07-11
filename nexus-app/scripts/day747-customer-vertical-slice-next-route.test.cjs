/* eslint-disable */
const assert = require("node:assert/strict");

const registryModulePath =
  process.env.DAY747_REGISTRY_MODULE;

const routeModulePath =
  process.env.DAY747_ROUTE_MODULE;

if (!registryModulePath || !routeModulePath) {
  throw new Error(
    "DAY747_REGISTRY_MODULE and DAY747_ROUTE_MODULE are required.",
  );
}

const registryModule = require(
  registryModulePath,
);

const {
  CustomerVerticalSliceRouteDependencyError,
  createCustomerVerticalSliceRouteDependencyRegistry,
  configureCustomerVerticalSliceRouteDependencies,
  areCustomerVerticalSliceRouteDependenciesConfigured,
} = registryModule;

const {
  POST,
  runtime,
  dynamic,
} = require(routeModulePath);

const auditContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  serviceId: "nexus-audit-service",
  role: "service",
});

function createDependencies(options = {}) {
  let sessionCalls = 0;
  let integrityCalls = 0;
  let rateLimiterCalls = 0;
  let transactionCalls = 0;

  const dependencies = {
    async loadSession() {
      sessionCalls += 1;

      return (
        options.session ?? {
          authenticated: true,
          tenantId: "tenant-a",
          actorId: "owner-a",
          role: "owner",
        }
      );
    },

    async verifyRequestIntegrity() {
      integrityCalls += 1;

      return options.integrityVerified === true;
    },

    auditContext,

    rateLimiter: {
      async consume() {
        rateLimiterCalls += 1;

        return {
          allowed: true,
          retryAfterSeconds: 0,
        };
      },
    },

    repository: {
      async runInTransaction() {
        transactionCalls += 1;

        throw new Error(
          "Repository must not be reached in this test.",
        );
      },
    },

    nowIso: "2026-07-11T09:00:00.000Z",

    counters() {
      return {
        sessionCalls,
        integrityCalls,
        rateLimiterCalls,
        transactionCalls,
      };
    },
  };

  return dependencies;
}

function createRequest() {
  return new Request(
    "https://nexus.local/api/nexus/customer-vertical-slice/command",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "day-747-request",
      },
      body: JSON.stringify({
        requestedTenantId: "tenant-a",
        inquiryId: "inquiry-735",
        expectedVersion: "version-1",
        command: "release_result",
        requestId: "day-747-request",
        executionMode: "sandbox",
        externalDeliveryRequested: false,
        publicLaunchRequested: false,
      }),
    },
  );
}

async function readBody(response) {
  return JSON.parse(
    await response.text(),
  );
}

async function expectRegistryCode(
  action,
  expectedCode,
) {
  assert.throws(
    action,
    (error) =>
      error instanceof
        CustomerVerticalSliceRouteDependencyError &&
      error.code === expectedCode,
  );
}

async function main() {
  assert.equal(runtime, "nodejs");
  assert.equal(dynamic, "force-dynamic");

  const isolatedRegistry =
    createCustomerVerticalSliceRouteDependencyRegistry();

  assert.equal(
    isolatedRegistry.isConfigured(),
    false,
  );

  await expectRegistryCode(
    () => isolatedRegistry.require(),
    "ROUTE_DEPENDENCIES_NOT_CONFIGURED",
  );

  await expectRegistryCode(
    () =>
      isolatedRegistry.configure({
        loadSession: null,
      }),
    "INVALID_ROUTE_DEPENDENCIES",
  );

  const dependencies =
    createDependencies();

  const firstConfiguration =
    isolatedRegistry.configure(
      dependencies,
    );

  assert.deepEqual(firstConfiguration, {
    configured: true,
    idempotent: false,
  });

  assert.equal(
    isolatedRegistry.isConfigured(),
    true,
  );

  assert.equal(
    isolatedRegistry.require(),
    dependencies,
  );

  const idempotentConfiguration =
    isolatedRegistry.configure(
      dependencies,
    );

  assert.deepEqual(
    idempotentConfiguration,
    {
      configured: false,
      idempotent: true,
    },
  );

  await expectRegistryCode(
    () =>
      isolatedRegistry.configure(
        createDependencies(),
      ),
    "ROUTE_DEPENDENCIES_ALREADY_CONFIGURED",
  );

  assert.equal(
    areCustomerVerticalSliceRouteDependenciesConfigured(),
    false,
  );

  const unavailable = await POST(
    createRequest(),
  );

  const unavailableBody =
    await readBody(unavailable);

  assert.equal(unavailable.status, 503);
  assert.equal(
    unavailableBody.error.code,
    "SERVICE_UNAVAILABLE",
  );
  assert.equal(
    unavailableBody.error.retryable,
    true,
  );
  assert.equal(
    JSON.stringify(unavailableBody).includes(
      "ROUTE_DEPENDENCIES_NOT_CONFIGURED",
    ),
    false,
  );
  assert.equal(
    unavailable.headers.get("cache-control"),
    "no-store, max-age=0",
  );
  assert.match(
    unavailable.headers.get(
      "x-correlation-id",
    ),
    /^vsnr_[a-f0-9]{20}$/,
  );

  const configuredDependencies =
    createDependencies({
      integrityVerified: false,
    });

  const singletonConfiguration =
    configureCustomerVerticalSliceRouteDependencies(
      configuredDependencies,
    );

  assert.deepEqual(
    singletonConfiguration,
    {
      configured: true,
      idempotent: false,
    },
  );

  assert.equal(
    areCustomerVerticalSliceRouteDependenciesConfigured(),
    true,
  );

  const delegated = await POST(
    createRequest(),
  );

  const delegatedBody =
    await readBody(delegated);

  assert.equal(delegated.status, 403);
  assert.equal(
    delegatedBody.error.code,
    "REQUEST_INTEGRITY_FAILED",
  );

  assert.deepEqual(
    configuredDependencies.counters(),
    {
      sessionCalls: 1,
      integrityCalls: 1,
      rateLimiterCalls: 0,
      transactionCalls: 0,
    },
  );

  const singletonReplay =
    configureCustomerVerticalSliceRouteDependencies(
      configuredDependencies,
    );

  assert.deepEqual(singletonReplay, {
    configured: false,
    idempotent: true,
  });

  assert.equal(
    delegated.headers.get(
      "cache-control",
    ),
    "no-store, max-age=0",
  );

  console.log(
    "DAY 747 TARGETED TESTS PASS (12/12)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
