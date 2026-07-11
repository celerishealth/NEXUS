const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledServicePath = process.argv[2];
const compiledProviderPath = process.argv[3];
const compiledStorePath = process.argv[4];
const migrationPath = process.argv[5];

if (
  !compiledServicePath ||
  !compiledProviderPath ||
  !compiledStorePath ||
  !migrationPath
) {
  throw new Error(
    "Compiled Day 735 module paths or migration path were not provided.",
  );
}

const {
  executeApprovedCustomerRecommendationInSandbox,
} = require(path.resolve(compiledServicePath));

const {
  DeterministicCustomerSandboxExecutionProvider,
} = require(path.resolve(compiledProviderPath));

const {
  SupabaseControlledCustomerSandboxExecutionStore,
} = require(path.resolve(compiledStorePath));

const inquiryId =
  "11111111-7350-4735-8735-111111111111";

const recommendationId =
  "22222222-7350-4735-8735-222222222222";

const decisionId =
  "33333333-7350-4735-8735-333333333333";

const executionId =
  "44444444-7350-4735-8735-444444444444";

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "owner-735",
    tenantId: "tenant-735",
    roles: ["owner"],
    sessionId: "session-735",
    ...overrides,
  };
}

class FakeStateReader {
  constructor(result) {
    this.result = result;
  }

  async readTenantState() {
    return this.result;
  }
}

function activeStateReader() {
  return new FakeStateReader({
    status: "found",
    state: {
      tenantId: "tenant-735",
      operationStatus: "active",
      blockingSignalId: null,
      stateVersion: 15,
      lastTransitionAt: 130_000,
    },
  });
}

class FakeExecutionStore {
  constructor(status = "executed") {
    this.status = status;
    this.calls = [];
  }

  async executeApprovedRecommendation(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated sandbox storage failure",
      );
    }

    if (
      this.status === "executed" ||
      this.status === "already-executed"
    ) {
      return {
        status: this.status,
        executionId:
          this.status === "executed"
            ? record.executionId
            : "55555555-7350-4735-8735-555555555555",
        inquiryStatus:
          "sandbox-executed",
        executionStatus:
          "sandbox-executed",
        executedAt:
          record.executedAt,
      };
    }

    return {
      status: this.status,
      existingExecutionId:
        "66666666-7350-4735-8735-666666666666",
      currentInquiryStatus:
        "sandbox-executed",
      currentExecutionStatus:
        "sandbox-executed",
    };
  }
}

function createInput(store, overrides = {}) {
  return {
    identity: identity(),
    expectedStateVersion: 15,
    stateReader: activeStateReader(),
    inquiryId,
    recommendationId,
    decisionId,
    ownerDecision: "approve",
    recommendationText:
      "Confirm the customer's priority and budget, then prepare one primary recommendation.",
    rationale:
      "Verified customer constraints are required before final delivery.",
    confidence: 0.76,
    recommendationRiskFlags: [],
    recommendationInputFingerprint:
      "a".repeat(64),
    recommendationContentHash:
      "b".repeat(64),
    provider:
      new DeterministicCustomerSandboxExecutionProvider(),
    store,
    executedAt: 130_100,
    createExecutionId: () =>
      executionId,
    ...overrides,
  };
}

async function run() {
  const pausedProvider = {
    mode: "sandbox",
    executorName: "test-sandbox",
    executorVersion: "v1",
    calls: 0,
    async execute() {
      this.calls += 1;

      return {
        responseDraft: "test response",
        internalNotes: "test notes",
        riskFlags: [],
      };
    },
  };

  const pausedStore =
    new FakeExecutionStore();

  const paused =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        pausedStore,
        {
          stateReader:
            new FakeStateReader({
              status: "found",
              state: {
                tenantId:
                  "tenant-735",
                operationStatus:
                  "paused",
                blockingSignalId:
                  "signal-735",
                stateVersion: 15,
                lastTransitionAt:
                  130_000,
              },
            }),
          provider:
            pausedProvider,
        },
      ),
    );

  assert.equal(paused.completed, false);

  assert.equal(
    paused.code,
    "PILOT_OPERATION_NOT_PERMITTED",
  );

  assert.equal(
    paused.permissionCode,
    "PILOT_OPERATION_PAUSED",
  );

  assert.equal(pausedProvider.calls, 0);
  assert.equal(pausedStore.calls.length, 0);

  const operatorStore =
    new FakeExecutionStore();

  const operatorRejected =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        operatorStore,
        {
          identity: identity({
            userId: "operator-735",
            roles: ["operator"],
          }),
        },
      ),
    );

  assert.equal(
    operatorRejected.completed,
    false,
  );

  assert.equal(
    operatorRejected.code,
    "TENANT_OWNER_ROLE_REQUIRED",
  );

  assert.equal(
    operatorStore.calls.length,
    0,
  );

  const rejectedDecisionStore =
    new FakeExecutionStore();

  const rejectedDecision =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        rejectedDecisionStore,
        {
          ownerDecision: "reject",
        },
      ),
    );

  assert.equal(
    rejectedDecision.completed,
    false,
  );

  assert.equal(
    rejectedDecision.code,
    "OWNER_APPROVAL_REQUIRED",
  );

  assert.equal(
    rejectedDecisionStore.calls.length,
    0,
  );

  const liveProvider = {
    mode: "live",
    executorName: "live-provider",
    executorVersion: "v1",
    async execute() {
      throw new Error(
        "live provider must never execute",
      );
    },
  };

  const liveRejected =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        new FakeExecutionStore(),
        {
          provider: liveProvider,
        },
      ),
    );

  assert.equal(
    liveRejected.completed,
    false,
  );

  assert.equal(
    liveRejected.code,
    "SANDBOX_EXECUTOR_REQUIRED",
  );

  const executionStore =
    new FakeExecutionStore();

  const executed =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(executionStore),
    );

  assert.equal(executed.completed, true);

  assert.equal(
    executed.code,
    "SANDBOX_EXECUTION_COMPLETED",
  );

  assert.equal(
    executed.tenantId,
    "tenant-735",
  );

  assert.equal(
    executed.inquiryStatus,
    "sandbox-executed",
  );

  assert.equal(
    executed.executionStatus,
    "sandbox-executed",
  );

  assert.equal(
    executed.sandboxExecutionCompleted,
    true,
  );

  assert.equal(
    executed.resultTrackingRequired,
    true,
  );

  assert.equal(
    executed.customerDeliveryAuthorized,
    false,
  );

  assert.equal(
    executed.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    executed.publicLaunchAuthorized,
    false,
  );

  assert.match(
    executed.executionInputHash,
    /^[a-f0-9]{64}$/,
  );

  assert.match(
    executed.responseDraft,
    /has not been sent/i,
  );

  assert.equal(
    executionStore.calls.length,
    1,
  );

  assert.equal(
    executionStore.calls[0].tenantId,
    "tenant-735",
  );

  assert.equal(
    executionStore.calls[0].ownerId,
    "owner-735",
  );

  assert.equal(
    executionStore.calls[0].executionMode,
    "sandbox",
  );

  const duplicate =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        new FakeExecutionStore(
          "already-executed",
        ),
      ),
    );

  assert.equal(duplicate.completed, true);

  assert.equal(
    duplicate.code,
    "SANDBOX_EXECUTION_ALREADY_COMPLETED",
  );

  assert.equal(
    duplicate.customerDeliveryAuthorized,
    false,
  );

  const approvalConflict =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        new FakeExecutionStore(
          "approval-snapshot-conflict",
        ),
      ),
    );

  assert.equal(
    approvalConflict.completed,
    false,
  );

  assert.equal(
    approvalConflict.code,
    "OWNER_APPROVAL_SNAPSHOT_CONFLICT",
  );

  const executionConflict =
    await executeApprovedCustomerRecommendationInSandbox(
      createInput(
        new FakeExecutionStore(
          "execution-conflict",
        ),
      ),
    );

  assert.equal(
    executionConflict.completed,
    false,
  );

  assert.equal(
    executionConflict.code,
    "SANDBOX_EXECUTION_CONFLICT",
  );

  const serviceRoleKey =
    "day-735-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledCustomerSandboxExecutionStore({
      supabaseUrl:
        "https://example.supabase.co/",
      serviceRoleKey,
      fetchFunction:
        async (url, options) => {
          requests.push({
            url,
            options,
          });

          return {
            ok: true,
            async json() {
              return [
                {
                  status: "executed",
                  execution_id:
                    executionId,
                  inquiry_status:
                    "sandbox-executed",
                  execution_status:
                    "sandbox-executed",
                  stored_executed_at_epoch:
                    "130100",
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.executeApprovedRecommendation({
      executionId,
      tenantId: "tenant-735",
      inquiryId,
      recommendationId,
      decisionId,
      ownerId: "owner-735",
      recommendationText:
        "Confirm the customer's priority and budget, then prepare one primary recommendation.",
      rationale:
        "Verified customer constraints are required before final delivery.",
      confidence: 0.76,
      recommendationRiskFlags: [],
      recommendationInputFingerprint:
        "a".repeat(64),
      recommendationContentHash:
        "b".repeat(64),
      executionMode: "sandbox",
      executorName:
        "nexus-customer-response-sandbox",
      executorVersion:
        "sandbox-execution-v1",
      executionInputHash:
        "c".repeat(64),
      responseDraft:
        "Thank you. This draft has not been sent.",
      internalNotes:
        "Sandbox only. No external delivery.",
      executionRiskFlags: [],
      executedAt: 130_100,
    });

  assert.deepEqual(persisted, {
    status: "executed",
    executionId,
    inquiryStatus:
      "sandbox-executed",
    executionStatus:
      "sandbox-executed",
    executedAt: 130_100,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_execute_approved_customer_recommendation_sandbox$/,
  );

  assert.equal(
    requests[0].options.headers.apikey,
    serviceRoleKey,
  );

  assert.equal(
    requests[0].options.cache,
    "no-store",
  );

  const requestBody =
    JSON.parse(
      requests[0].options.body,
    );

  assert.equal(
    requestBody.p_tenant_id,
    "tenant-735",
  );

  assert.equal(
    requestBody.p_owner_id,
    "owner-735",
  );

  assert.equal(
    requestBody.p_execution_mode,
    "sandbox",
  );

  assert.equal(
    requestBody.p_recommendation_content_hash,
    "b".repeat(64),
  );

  assert.equal(
    requestBody.p_execution_input_hash,
    "c".repeat(64),
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_controlled_customer_sandbox_executions/i,
  );

  assert.match(
    migration,
    /execution_mode = 'sandbox'/i,
  );

  assert.match(
    migration,
    /unique\s*\(\s*tenant_id,\s*recommendation_id\s*\)/i,
  );

  assert.match(
    migration,
    /decision_record\.decision <>\s*'approve'/i,
  );

  assert.match(
    migration,
    /decision_record\.recommendation_content_hash <>/i,
  );

  assert.match(
    migration,
    /for update/i,
  );

  assert.match(
    migration,
    /status = 'sandbox-executed'/i,
  );

  assert.match(
    migration,
    /already-executed/i,
  );

  assert.match(
    migration,
    /execution-conflict/i,
  );

  assert.match(
    migration,
    /enable row level security/i,
  );

  assert.match(
    migration,
    /force row level security/i,
  );

  assert.match(
    migration,
    /security definer/i,
  );

  assert.match(
    migration,
    /from authenticated/i,
  );

  assert.match(
    migration,
    /grant execute[\s\S]*to service_role/i,
  );

  console.log(
    "DAY 735 TARGETED TEST PASS: owner-approved sandbox-only execution, active-pilot enforcement, exact approval and recommendation binding, persistent idempotency, inquiry state transition, conflict blocking and zero customer delivery verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
