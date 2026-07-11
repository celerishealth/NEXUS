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
    "Compiled Day 733 module paths or migration path were not provided.",
  );
}

const {
  createControlledCustomerRecommendation,
} = require(path.resolve(compiledServicePath));

const {
  DeterministicSandboxRecommendationProvider,
} = require(path.resolve(compiledProviderPath));

const {
  SupabaseControlledCustomerRecommendationStore,
} = require(path.resolve(compiledStorePath));

const recommendationId =
  "11111111-7330-4733-8733-111111111111";

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "operator-733",
    tenantId: "tenant-733",
    roles: ["operator"],
    sessionId: "session-733",
    ...overrides,
  };
}

class FakeStateReader {
  constructor(state) {
    this.state = state;
    this.calls = [];
  }

  async readTenantState(tenantId) {
    this.calls.push(tenantId);

    return this.state;
  }
}

class FakeRecommendationStore {
  constructor(status = "created") {
    this.status = status;
    this.calls = [];
  }

  async createRecommendation(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated recommendation storage failure",
      );
    }

    if (
      this.status === "created" ||
      this.status === "already-created"
    ) {
      return {
        status: this.status,
        recommendationId:
          this.status === "created"
            ? record.recommendationId
            : "22222222-7330-4733-8733-222222222222",
        inquiryStatus: "owner-review",
        createdAt: record.createdAt,
      };
    }

    return {
      status: this.status,
      existingRecommendationId:
        "33333333-7330-4733-8733-333333333333",
      currentInquiryStatus:
        "owner-review",
    };
  }
}

function activeStateReader() {
  return new FakeStateReader({
    status: "found",
    state: {
      tenantId: "tenant-733",
      operationStatus: "active",
      blockingSignalId: null,
      stateVersion: 12,
      lastTransitionAt: 110_000,
    },
  });
}

function createInput(overrides = {}) {
  return {
    identity: identity(),
    expectedStateVersion: 12,
    stateReader: activeStateReader(),
    inquiryId:
      "aaaaaaaa-7330-4733-8733-aaaaaaaaaaaa",
    inquiryMessage:
      "Please recommend the best option within my budget.",
    provider:
      new DeterministicSandboxRecommendationProvider(),
    store:
      new FakeRecommendationStore(),
    createdAt: 110_100,
    createRecommendationId: () =>
      recommendationId,
    ...overrides,
  };
}

async function run() {
  const pausedProvider = {
    mode: "sandbox",
    providerName: "test-provider",
    modelName: "test-model",
    calls: 0,
    async generateRecommendation() {
      this.calls += 1;

      return {
        recommendationText: "test",
        rationale: "test",
        confidence: 0.5,
        riskFlags: [],
      };
    },
  };

  const pausedStore =
    new FakeRecommendationStore();

  const paused =
    await createControlledCustomerRecommendation(
      createInput({
        stateReader:
          new FakeStateReader({
            status: "found",
            state: {
              tenantId: "tenant-733",
              operationStatus: "paused",
              blockingSignalId:
                "signal-733",
              stateVersion: 12,
              lastTransitionAt:
                110_000,
            },
          }),
        provider: pausedProvider,
        store: pausedStore,
      }),
    );

  assert.equal(paused.created, false);

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

  const liveProvider = {
    mode: "live",
    providerName: "forbidden-live-provider",
    modelName: "forbidden-live-model",
    async generateRecommendation() {
      throw new Error(
        "must never execute",
      );
    },
  };

  const liveRejected =
    await createControlledCustomerRecommendation(
      createInput({
        provider: liveProvider,
      }),
    );

  assert.equal(
    liveRejected.created,
    false,
  );

  assert.equal(
    liveRejected.code,
    "SANDBOX_PROVIDER_REQUIRED",
  );

  const createdStore =
    new FakeRecommendationStore();

  const created =
    await createControlledCustomerRecommendation(
      createInput({
        store: createdStore,
      }),
    );

  assert.equal(created.created, true);

  assert.equal(
    created.code,
    "SANDBOX_RECOMMENDATION_CREATED",
  );

  assert.equal(
    created.tenantId,
    "tenant-733",
  );

  assert.equal(
    created.inquiryStatus,
    "owner-review",
  );

  assert.equal(
    created.providerMode,
    "sandbox",
  );

  assert.equal(
    created.ownerApprovalRequired,
    true,
  );

  assert.equal(
    created.customerDeliveryAuthorized,
    false,
  );

  assert.equal(
    created.sandboxExecutionAuthorized,
    false,
  );

  assert.equal(
    created.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    created.publicLaunchAuthorized,
    false,
  );

  assert.match(
    created.inputFingerprint,
    /^[a-f0-9]{64}$/,
  );

  assert.equal(createdStore.calls.length, 1);

  assert.equal(
    createdStore.calls[0].tenantId,
    "tenant-733",
  );

  assert.equal(
    createdStore.calls[0].providerMode,
    "sandbox",
  );

  assert.equal(
    createdStore.calls[0].inquiryMessage,
    "Please recommend the best option within my budget.",
  );

  const duplicate =
    await createControlledCustomerRecommendation(
      createInput({
        store:
          new FakeRecommendationStore(
            "already-created",
          ),
      }),
    );

  assert.equal(duplicate.created, true);

  assert.equal(
    duplicate.code,
    "SANDBOX_RECOMMENDATION_ALREADY_CREATED",
  );

  const conflict =
    await createControlledCustomerRecommendation(
      createInput({
        store:
          new FakeRecommendationStore(
            "binding-conflict",
          ),
      }),
    );

  assert.equal(conflict.created, false);

  assert.equal(
    conflict.code,
    "RECOMMENDATION_BINDING_CONFLICT",
  );

  const provider =
    new DeterministicSandboxRecommendationProvider();

  const draft =
    await provider.generateRecommendation({
      tenantId: "tenant-733",
      inquiryId:
        "aaaaaaaa-7330-4733-8733-aaaaaaaaaaaa",
      inquiryMessage:
        "Urgent: please recommend the best option and price.",
    });

  assert.match(
    draft.recommendationText,
    /priority|scope|budget/i,
  );

  assert.equal(
    draft.riskFlags.includes(
      "customer-expresses-urgency",
    ),
    true,
  );

  assert.equal(
    draft.confidence <= 0.68,
    true,
  );

  const serviceRoleKey =
    "day-733-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledCustomerRecommendationStore({
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
                  status: "created",
                  recommendation_id:
                    recommendationId,
                  inquiry_status:
                    "owner-review",
                  stored_created_at_epoch:
                    "110100",
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.createRecommendation({
      recommendationId,
      tenantId: "tenant-733",
      inquiryId:
        "aaaaaaaa-7330-4733-8733-aaaaaaaaaaaa",
      inquiryMessage:
        "Please recommend the best option within my budget.",
      providerMode: "sandbox",
      providerName:
        "nexus-deterministic-sandbox",
      modelName:
        "sandbox-recommendation-v1",
      recommendationText:
        "Ask for budget and priorities.",
      rationale:
        "More information is required.",
      confidence: 0.76,
      riskFlags: [],
      inputFingerprint:
        "a".repeat(64),
      createdAt: 110_100,
    });

  assert.deepEqual(persisted, {
    status: "created",
    recommendationId,
    inquiryStatus: "owner-review",
    createdAt: 110_100,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_create_sandbox_customer_recommendation$/,
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
    "tenant-733",
  );

  assert.equal(
    requestBody.p_provider_mode,
    "sandbox",
  );

  assert.equal(
    requestBody.p_inquiry_message,
    "Please recommend the best option within my budget.",
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_controlled_customer_recommendations/i,
  );

  assert.match(
    migration,
    /provider_mode = 'sandbox'/i,
  );

  assert.match(
    migration,
    /unique\s*\(\s*tenant_id,\s*inquiry_id,\s*input_fingerprint\s*\)/i,
  );

  assert.match(
    migration,
    /for update/i,
  );

  assert.match(
    migration,
    /inquiry_record\.message <> trim\(p_inquiry_message\)/i,
  );

  assert.match(
    migration,
    /status = 'owner-review'/i,
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
    "DAY 733 TARGETED TEST PASS: active-pilot enforcement, sandbox-only recommendation generation, immutable inquiry binding, persistent idempotency, atomic owner-review transition, risk flags and live execution blocking verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
