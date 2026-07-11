/* eslint-disable */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const runtimeModulePath =
  process.env.DAY749_RUNTIME_MODULE;

const commandRouteModulePath =
  process.env.DAY749_COMMAND_ROUTE_MODULE;

const statusRouteModulePath =
  process.env.DAY749_STATUS_ROUTE_MODULE;

const statusModulePath =
  process.env.DAY749_STATUS_MODULE;

const auditModulePath =
  process.env.DAY749_AUDIT_MODULE;

if (
  !runtimeModulePath ||
  !commandRouteModulePath ||
  !statusRouteModulePath ||
  !statusModulePath ||
  !auditModulePath
) {
  throw new Error(
    "Day 749 compiled module paths are required.",
  );
}

const {
  createFileBackedCustomerVerticalSliceRepository,
  createLocalSandboxRequestSignature,
  seedLocalSandboxInquiry,
} = require(runtimeModulePath);

const {
  POST,
} = require(commandRouteModulePath);

const {
  GET,
} = require(statusRouteModulePath);

const {
  handleCustomerVerticalSliceLocalSandboxStatus,
} = require(statusModulePath);

const {
  verifyVerticalSliceAuditChain,
} = require(auditModulePath);

function initialState(input) {
  return {
    tenantId: input.tenantId,
    inquiryId: input.inquiryId,
    customerId: input.customerId,
    ownerId: input.ownerId,
    status: "inquiry_received",
    version: `${input.tenantId}-initial-v1`,
    createdAt: "2026-07-11T10:00:00.000Z",
    updatedAt: "2026-07-11T10:00:00.000Z",
  };
}

function commandUrl() {
  return "https://nexus.local/api/nexus/customer-vertical-slice/command";
}

function statusUrl(
  tenantId,
  inquiryId,
) {
  return (
    "https://nexus.local/api/nexus/customer-vertical-slice/status" +
    `?tenantId=${encodeURIComponent(tenantId)}` +
    `&inquiryId=${encodeURIComponent(inquiryId)}`
  );
}

function signedCommandRequest(input) {
  const body = {
    requestedTenantId: input.tenantId,
    inquiryId: input.inquiryId,
    expectedVersion: input.expectedVersion,
    command: input.command,
    requestId: input.requestId,
    executionMode: "sandbox",
    externalDeliveryRequested: false,
    publicLaunchRequested: false,
  };

  const rawBody = JSON.stringify(body);
  const url = commandUrl();

  const signature =
    createLocalSandboxRequestSignature({
      secret: input.secret,
      method: "POST",
      url,
      tenantId: input.sessionTenantId ??
        input.tenantId,
      actorId: input.actorId,
      role: input.role,
      rawBody,
    });

  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization:
        `Bearer ${input.token}`,
      "x-nexus-tenant-id":
        input.sessionTenantId ??
        input.tenantId,
      "x-nexus-actor-id":
        input.actorId,
      "x-nexus-actor-role":
        input.role,
      "x-nexus-signature":
        input.signature ?? signature,
      "x-request-id":
        input.requestId,
    },
    body: rawBody,
  });
}

function signedStatusRequest(input) {
  const url = statusUrl(
    input.requestedTenantId ??
      input.tenantId,
    input.inquiryId,
  );

  const signature =
    createLocalSandboxRequestSignature({
      secret: input.secret,
      method: "GET",
      url,
      tenantId: input.tenantId,
      actorId: input.actorId,
      role: input.role,
      rawBody: "",
    });

  return new Request(url, {
    method: "GET",
    headers: {
      authorization:
        `Bearer ${input.token}`,
      "x-nexus-tenant-id":
        input.tenantId,
      "x-nexus-actor-id":
        input.actorId,
      "x-nexus-actor-role":
        input.role,
      "x-nexus-signature":
        input.signature ?? signature,
      "x-request-id":
        input.requestId,
      ...(input.etag
        ? {
            "if-none-match":
              input.etag,
          }
        : {}),
    },
  });
}

async function json(response) {
  return JSON.parse(
    await response.text(),
  );
}

async function execute(input) {
  const response = await POST(
    signedCommandRequest(input),
  );

  const body = await json(response);

  assert.equal(
    response.status,
    200,
    JSON.stringify(body),
  );

  assert.equal(body.ok, true);
  assert.equal(body.data.mode, "sandbox");

  return body.data;
}

async function main() {
  const temporaryDirectory =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "nexus-day749-",
      ),
    );

  const dataFile = path.join(
    temporaryDirectory,
    "customer-vertical-slice.json",
  );

  const token = "t".repeat(40);
  const secret = "s".repeat(40);

  process.env.NODE_ENV = "development";
  process.env.NEXUS_LOCAL_SANDBOX_ENABLED =
    "true";
  process.env.NEXUS_LOCAL_SANDBOX_TOKEN =
    token;
  process.env.NEXUS_LOCAL_SANDBOX_SECRET =
    secret;
  process.env.NEXUS_LOCAL_SANDBOX_FILE =
    dataFile;

  const tenantA = initialState({
    tenantId: "tenant-a",
    inquiryId: "inquiry-749",
    customerId: "customer-a",
    ownerId: "owner-a",
  });

  const tenantB = initialState({
    tenantId: "tenant-b",
    inquiryId: "inquiry-749",
    customerId: "customer-b",
    ownerId: "owner-b",
  });

  await seedLocalSandboxInquiry(tenantA);
  await seedLocalSandboxInquiry(tenantB);

  const prepare = await execute({
    token,
    secret,
    tenantId: "tenant-a",
    inquiryId: "inquiry-749",
    actorId:
      "nexus-sandbox-service-a",
    role: "service",
    expectedVersion:
      tenantA.version,
    command:
      "prepare_recommendation",
    requestId:
      "day749-prepare-a",
  });

  assert.equal(
    prepare.status,
    "recommendation_ready",
  );

  const ownerRecommendationStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "day749-owner-status-1",
      }),
    );

  const ownerRecommendationBody =
    await json(ownerRecommendationStatus);

  assert.equal(
    ownerRecommendationStatus.status,
    200,
  );

  assert.equal(
    ownerRecommendationBody.data.status,
    "recommendation_ready",
  );

  assert.equal(
    ownerRecommendationBody.data.nextAction,
    "owner_review_required",
  );

  assert.equal(
    ownerRecommendationBody.data.actionRequired,
    true,
  );

  const wrongCustomerStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "customer-wrong",
        role: "customer",
        requestId:
          "day749-wrong-customer",
      }),
    );

  assert.equal(
    wrongCustomerStatus.status,
    403,
  );

  const crossTenantStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        requestedTenantId: "tenant-b",
        inquiryId: "inquiry-749",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "day749-cross-tenant-status",
      }),
    );

  assert.equal(
    crossTenantStatus.status,
    403,
  );

  const serviceStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId:
          "nexus-sandbox-service-a",
        role: "service",
        requestId:
          "day749-service-status",
      }),
    );

  assert.equal(
    serviceStatus.status,
    403,
  );

  const approval = await execute({
    token,
    secret,
    tenantId: "tenant-a",
    inquiryId: "inquiry-749",
    actorId: "owner-a",
    role: "owner",
    expectedVersion:
      prepare.version,
    command:
      "approve_recommendation",
    requestId:
      "day749-approve-a",
  });

  assert.equal(
    approval.status,
    "owner_approved",
  );

  const executionStart = await execute({
    token,
    secret,
    tenantId: "tenant-a",
    inquiryId: "inquiry-749",
    actorId:
      "nexus-sandbox-service-a",
    role: "service",
    expectedVersion:
      approval.version,
    command:
      "start_sandbox_execution",
    requestId:
      "day749-start-a",
  });

  assert.equal(
    executionStart.status,
    "sandbox_executing",
  );

  const executionComplete =
    await execute({
      token,
      secret,
      tenantId: "tenant-a",
      inquiryId: "inquiry-749",
      actorId:
        "nexus-sandbox-service-a",
      role: "service",
      expectedVersion:
        executionStart.version,
      command:
        "complete_sandbox_execution",
      requestId:
        "day749-complete-a",
    });

  assert.equal(
    executionComplete.status,
    "sandbox_succeeded",
  );

  const ownerSuccessStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "day749-owner-success-status",
      }),
    );

  const ownerSuccessBody =
    await json(ownerSuccessStatus);

  assert.equal(
    ownerSuccessBody.data.nextAction,
    "owner_release_required",
  );

  assert.equal(
    ownerSuccessBody.data.actionRequired,
    true,
  );

  const release = await execute({
    token,
    secret,
    tenantId: "tenant-a",
    inquiryId: "inquiry-749",
    actorId: "owner-a",
    role: "owner",
    expectedVersion:
      executionComplete.version,
    command: "release_result",
    requestId:
      "day749-release-a",
  });

  assert.equal(
    release.status,
    "result_released",
  );

  const customerReleasedStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "customer-a",
        role: "customer",
        requestId:
          "day749-customer-release-status",
      }),
    );

  const customerReleasedBody =
    await json(customerReleasedStatus);

  assert.equal(
    customerReleasedBody.data.status,
    "result_released",
  );

  assert.equal(
    customerReleasedBody.data.nextAction,
    "customer_acknowledgement_required",
  );

  assert.equal(
    customerReleasedBody.data.actionRequired,
    true,
  );

  const acknowledgement =
    await execute({
      token,
      secret,
      tenantId: "tenant-a",
      inquiryId: "inquiry-749",
      actorId: "customer-a",
      role: "customer",
      expectedVersion:
        release.version,
      command:
        "acknowledge_result",
      requestId:
        "day749-acknowledge-a",
    });

  assert.equal(
    acknowledgement.status,
    "customer_acknowledged",
  );

  assert.equal(
    acknowledgement.receipt.auditHash,
    null,
  );

  const finalCustomerStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "customer-a",
        role: "customer",
        requestId:
          "day749-customer-final-status",
      }),
    );

  const finalCustomerBody =
    await json(finalCustomerStatus);

  assert.equal(
    finalCustomerStatus.status,
    200,
  );

  assert.equal(
    finalCustomerBody.data.status,
    "customer_acknowledged",
  );

  assert.equal(
    finalCustomerBody.data.terminal,
    true,
  );

  assert.equal(
    finalCustomerBody.data.completedSteps,
    6,
  );

  assert.equal(
    finalCustomerBody.data.totalSteps,
    6,
  );

  assert.equal(
    finalCustomerBody.data.nextAction,
    "complete",
  );

  assert.equal(
    finalCustomerBody.data.actionRequired,
    false,
  );

  const finalEtag =
    finalCustomerStatus.headers.get("etag");

  assert.match(
    finalEtag,
    /^"vss1_[a-f0-9]{24}"$/,
  );

  const unchangedStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "customer-a",
        role: "customer",
        requestId:
          "day749-customer-unchanged",
        etag: finalEtag,
      }),
    );

  assert.equal(
    unchangedStatus.status,
    304,
  );

  const badSignatureStatus =
    await GET(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "customer-a",
        role: "customer",
        requestId:
          "day749-bad-signature",
        signature: "0".repeat(64),
      }),
    );

  assert.equal(
    badSignatureStatus.status,
    403,
  );

  const advancedReplay =
    await execute({
      token,
      secret,
      tenantId: "tenant-a",
      inquiryId: "inquiry-749",
      actorId:
        "nexus-sandbox-service-a",
      role: "service",
      expectedVersion:
        tenantA.version,
      command:
        "prepare_recommendation",
      requestId:
        "day749-prepare-a",
    });

  assert.equal(
    advancedReplay.outcome,
    "replayed",
  );

  assert.equal(
    advancedReplay.status,
    "customer_acknowledged",
  );

  const restartedRepository =
    createFileBackedCustomerVerticalSliceRepository(
      dataFile,
    );

  const restartedSnapshot =
    await restartedRepository.readSnapshot();

  const restartedTenantA =
    restartedSnapshot.states.find(
      (state) =>
        state.tenantId === "tenant-a" &&
        state.inquiryId === "inquiry-749",
    );

  const restartedTenantB =
    restartedSnapshot.states.find(
      (state) =>
        state.tenantId === "tenant-b" &&
        state.inquiryId === "inquiry-749",
    );

  assert.equal(
    restartedTenantA.status,
    "customer_acknowledged",
  );

  assert.equal(
    restartedTenantB.status,
    "inquiry_received",
  );

  const tenantAEvents =
    restartedSnapshot.events.filter(
      (event) =>
        event.tenantId === "tenant-a" &&
        event.inquiryId === "inquiry-749",
    );

  const tenantAAudits =
    restartedSnapshot.audits
      .filter(
        (entry) =>
          entry.tenantId === "tenant-a" &&
          entry.inquiryId === "inquiry-749",
      )
      .sort(
        (left, right) =>
          left.sequence - right.sequence,
      );

  assert.equal(
    tenantAEvents.length,
    6,
  );

  assert.equal(
    tenantAAudits.length,
    6,
  );

  assert.equal(
    restartedSnapshot.events.filter(
      (event) =>
        event.tenantId === "tenant-b",
    ).length,
    0,
  );

  assert.equal(
    restartedSnapshot.audits.filter(
      (entry) =>
        entry.tenantId === "tenant-b",
    ).length,
    0,
  );

  const auditVerification =
    verifyVerticalSliceAuditChain({
      tenantId: "tenant-a",
      inquiryId: "inquiry-749",
      entries: tenantAAudits,
    });

  assert.equal(
    auditVerification.valid,
    true,
  );

  assert.equal(
    auditVerification.entryCount,
    6,
  );

  assert.equal(
    auditVerification.finalVersion,
    restartedTenantA.version,
  );

  const productionFailClosed =
    await handleCustomerVerticalSliceLocalSandboxStatus(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "day749-production-closed",
      }),
      {
        enabled: true,
        production: true,
        token,
        secret,
        filePath: dataFile,
      },
    );

  assert.equal(
    productionFailClosed.status,
    503,
  );

  const disabledFailClosed =
    await handleCustomerVerticalSliceLocalSandboxStatus(
      signedStatusRequest({
        token,
        secret,
        tenantId: "tenant-a",
        inquiryId: "inquiry-749",
        actorId: "owner-a",
        role: "owner",
        requestId:
          "day749-disabled-closed",
      }),
      {
        enabled: false,
        production: false,
        token,
        secret,
        filePath: dataFile,
      },
    );

  assert.equal(
    disabledFailClosed.status,
    503,
  );

  fs.rmSync(
    temporaryDirectory,
    {
      recursive: true,
      force: true,
    },
  );

  console.log(
    "DAY 749 TARGETED TESTS PASS (24/24)",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
