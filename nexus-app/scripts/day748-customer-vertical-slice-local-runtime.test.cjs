/* eslint-disable */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const runtimeModulePath =
  process.env.DAY748_RUNTIME_MODULE;

const routeModulePath =
  process.env.DAY748_ROUTE_MODULE;

if (!runtimeModulePath || !routeModulePath) {
  throw new Error(
    "DAY748_RUNTIME_MODULE and DAY748_ROUTE_MODULE are required.",
  );
}

const {
  LocalSandboxRuntimeError,
  createFileBackedCustomerVerticalSliceRepository,
  createLocalSandboxRequestSignature,
  createLocalSandboxRouteDependencies,
  seedLocalSandboxInquiry,
} = require(runtimeModulePath);

const {
  POST,
} = require(routeModulePath);

function initialState(
  tenantId,
  customerId,
  ownerId,
) {
  return {
    tenantId,
    inquiryId: "inquiry-748",
    customerId,
    ownerId,
    status: "inquiry_received",
    version: `${tenantId}-initial-v1`,
    createdAt: "2026-07-11T09:00:00.000Z",
    updatedAt: "2026-07-11T09:00:00.000Z",
  };
}

function commandBody(
  tenantId,
  expectedVersion,
  requestId,
  overrides = {},
) {
  return {
    requestedTenantId: tenantId,
    inquiryId: "inquiry-748",
    expectedVersion,
    command: "prepare_recommendation",
    requestId,
    executionMode: "sandbox",
    externalDeliveryRequested: false,
    publicLaunchRequested: false,
    ...overrides,
  };
}

function signedRequest(input) {
  const url =
    "https://nexus.local/api/nexus/customer-vertical-slice/command";

  const rawBody = JSON.stringify(input.body);

  const signature =
    createLocalSandboxRequestSignature({
      secret: input.secret,
      method: "POST",
      url,
      tenantId: input.tenantId,
      actorId: input.actorId,
      role: input.role,
      rawBody,
    });

  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${input.token}`,
      "x-nexus-tenant-id": input.tenantId,
      "x-nexus-actor-id": input.actorId,
      "x-nexus-actor-role": input.role,
      "x-nexus-signature":
        input.signature ?? signature,
      "x-request-id": input.body.requestId,
    },
    body: rawBody,
  });
}

async function readBody(response) {
  return JSON.parse(await response.text());
}

async function main() {
  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "nexus-day748-"),
  );

  const dataFile = path.join(
    tempDirectory,
    "vertical-slice.json",
  );

  const token = "t".repeat(40);
  const secret = "s".repeat(40);

  assert.throws(
    () =>
      createLocalSandboxRouteDependencies({
        token,
        secret,
        filePath: dataFile,
        production: true,
      }),
    (error) =>
      error instanceof LocalSandboxRuntimeError &&
      error.code === "LOCAL_SANDBOX_NOT_ALLOWED",
  );

  assert.throws(
    () =>
      createLocalSandboxRouteDependencies({
        token: "short",
        secret,
        filePath: dataFile,
        production: false,
      }),
    (error) =>
      error instanceof LocalSandboxRuntimeError &&
      error.code ===
        "INVALID_LOCAL_SANDBOX_CONFIGURATION",
  );

  process.env.NODE_ENV = "development";
  process.env.NEXUS_LOCAL_SANDBOX_ENABLED = "true";
  process.env.NEXUS_LOCAL_SANDBOX_TOKEN = token;
  process.env.NEXUS_LOCAL_SANDBOX_SECRET = secret;
  process.env.NEXUS_LOCAL_SANDBOX_FILE = dataFile;

  const tenantAState = initialState(
    "tenant-a",
    "customer-a",
    "owner-a",
  );

  const tenantBState = initialState(
    "tenant-b",
    "customer-b",
    "owner-b",
  );

  const tenantASeed =
    await seedLocalSandboxInquiry(
      tenantAState,
    );

  assert.deepEqual(tenantASeed, {
    created: true,
    idempotent: false,
  });

  const tenantASeedReplay =
    await seedLocalSandboxInquiry(
      tenantAState,
    );

  assert.deepEqual(tenantASeedReplay, {
    created: false,
    idempotent: true,
  });

  await seedLocalSandboxInquiry(
    tenantBState,
  );

  const tenantARequest = signedRequest({
    token,
    secret,
    tenantId: "tenant-a",
    actorId: "nexus-sandbox-service-a",
    role: "service",
    body: commandBody(
      "tenant-a",
      "tenant-a-initial-v1",
      "tenant-a-request-1",
    ),
  });

  const tenantAResponse =
    await POST(tenantARequest);

  const tenantABody =
    await readBody(tenantAResponse);

  assert.equal(tenantAResponse.status, 200);
  assert.equal(tenantABody.ok, true);
  assert.equal(
    tenantABody.data.status,
    "recommendation_ready",
  );
  assert.equal(
    tenantABody.data.mode,
    "sandbox",
  );

  const restartedRepository =
    createFileBackedCustomerVerticalSliceRepository(
      dataFile,
    );

  const afterTenantA =
    await restartedRepository.readSnapshot();

  const persistedTenantA =
    afterTenantA.states.find(
      (state) =>
        state.tenantId === "tenant-a" &&
        state.inquiryId === "inquiry-748",
    );

  const untouchedTenantB =
    afterTenantA.states.find(
      (state) =>
        state.tenantId === "tenant-b" &&
        state.inquiryId === "inquiry-748",
    );

  assert.equal(
    persistedTenantA.status,
    "recommendation_ready",
  );

  assert.equal(
    untouchedTenantB.status,
    "inquiry_received",
  );

  assert.equal(
    afterTenantA.events.filter(
      (event) =>
        event.tenantId === "tenant-a",
    ).length,
    1,
  );

  assert.equal(
    afterTenantA.audits.filter(
      (entry) =>
        entry.tenantId === "tenant-a",
    ).length,
    1,
  );

  const tenantAReplay =
    await POST(
      signedRequest({
        token,
        secret,
        tenantId: "tenant-a",
        actorId:
          "nexus-sandbox-service-a",
        role: "service",
        body: commandBody(
          "tenant-a",
          "tenant-a-initial-v1",
          "tenant-a-request-1",
        ),
      }),
    );

  const tenantAReplayBody =
    await readBody(tenantAReplay);

  assert.equal(
    tenantAReplayBody.data.outcome,
    "replayed",
  );

  const invalidSignatureResponse =
    await POST(
      signedRequest({
        token,
        secret,
        tenantId: "tenant-a",
        actorId:
          "nexus-sandbox-service-a",
        role: "service",
        body: commandBody(
          "tenant-a",
          persistedTenantA.version,
          "invalid-signature-request",
        ),
        signature: "0".repeat(64),
      }),
    );

  assert.equal(
    invalidSignatureResponse.status,
    403,
  );

  const crossTenantResponse =
    await POST(
      signedRequest({
        token,
        secret,
        tenantId: "tenant-a",
        actorId:
          "nexus-sandbox-service-a",
        role: "service",
        body: commandBody(
          "tenant-b",
          "tenant-b-initial-v1",
          "cross-tenant-request",
        ),
      }),
    );

  assert.equal(
    crossTenantResponse.status,
    403,
  );

  const liveModeResponse =
    await POST(
      signedRequest({
        token,
        secret,
        tenantId: "tenant-a",
        actorId:
          "nexus-sandbox-service-a",
        role: "service",
        body: commandBody(
          "tenant-a",
          persistedTenantA.version,
          "live-mode-request",
          {
            executionMode: "live",
          },
        ),
      }),
    );

  assert.equal(liveModeResponse.status, 403);

  const tenantBResponse =
    await POST(
      signedRequest({
        token,
        secret,
        tenantId: "tenant-b",
        actorId:
          "nexus-sandbox-service-b",
        role: "service",
        body: commandBody(
          "tenant-b",
          "tenant-b-initial-v1",
          "tenant-b-request-1",
        ),
      }),
    );

  assert.equal(tenantBResponse.status, 200);

  const finalRestartedRepository =
    createFileBackedCustomerVerticalSliceRepository(
      dataFile,
    );

  const finalSnapshot =
    await finalRestartedRepository.readSnapshot();

  assert.equal(
    finalSnapshot.states.find(
      (state) =>
        state.tenantId === "tenant-a",
    ).status,
    "recommendation_ready",
  );

  assert.equal(
    finalSnapshot.states.find(
      (state) =>
        state.tenantId === "tenant-b",
    ).status,
    "recommendation_ready",
  );

  assert.equal(
    finalSnapshot.events.length,
    2,
  );

  assert.equal(
    finalSnapshot.audits.length,
    2,
  );

  assert.equal(
    finalSnapshot.audits[0].tenantId !==
      finalSnapshot.audits[1].tenantId,
    true,
  );

  fs.rmSync(tempDirectory, {
    recursive: true,
    force: true,
  });

  console.log(
    "DAY 748 TARGETED TESTS PASS (16/16)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
