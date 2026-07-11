const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compiledServicePath = process.argv[2];
const compiledStorePath = process.argv[3];
const migrationPath = process.argv[4];

if (
  !compiledServicePath ||
  !compiledStorePath ||
  !migrationPath
) {
  throw new Error(
    "Compiled Day 734 module paths or migration path were not provided.",
  );
}

const {
  decideControlledCustomerRecommendation,
} = require(path.resolve(compiledServicePath));

const {
  SupabaseControlledCustomerOwnerDecisionStore,
} = require(path.resolve(compiledStorePath));

const inquiryId =
  "11111111-7340-4734-8734-111111111111";

const recommendationId =
  "22222222-7340-4734-8734-222222222222";

const decisionId =
  "33333333-7340-4734-8734-333333333333";

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "owner-734",
    tenantId: "tenant-734",
    roles: ["owner"],
    sessionId: "session-734",
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
      tenantId: "tenant-734",
      operationStatus: "active",
      blockingSignalId: null,
      stateVersion: 14,
      lastTransitionAt: 120_000,
    },
  });
}

class FakeDecisionStore {
  constructor(status = "decided") {
    this.status = status;
    this.calls = [];
  }

  async decideRecommendation(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated owner decision storage failure",
      );
    }

    if (
      this.status === "decided" ||
      this.status === "already-decided"
    ) {
      const status =
        record.decision === "approve"
          ? "approved"
          : "rejected";

      return {
        status: this.status,
        decisionId:
          this.status === "decided"
            ? record.decisionId
            : "44444444-7340-4734-8734-444444444444",
        decision: record.decision,
        recommendationStatus: status,
        inquiryStatus: status,
        decidedAt: record.decidedAt,
      };
    }

    return {
      status: this.status,
      existingDecisionId:
        "55555555-7340-4734-8734-555555555555",
      existingDecision: "reject",
      currentRecommendationStatus:
        "rejected",
      currentInquiryStatus:
        "rejected",
    };
  }
}

function createInput(store, overrides = {}) {
  return {
    identity: identity(),
    expectedStateVersion: 14,
    stateReader: activeStateReader(),
    inquiryId,
    recommendationId,
    recommendationText:
      "Ask for the customer's budget and priorities, then prepare one primary recommendation.",
    rationale:
      "More verified customer constraints are required before selecting the safest option.",
    confidence: 0.76,
    riskFlags: [],
    recommendationInputFingerprint:
      "a".repeat(64),
    decision: "approve",
    decisionReason:
      "Recommendation is safe for controlled sandbox execution.",
    store,
    decidedAt: 120_100,
    createDecisionId: () =>
      decisionId,
    ...overrides,
  };
}

async function run() {
  const pausedStore =
    new FakeDecisionStore();

  const paused =
    await decideControlledCustomerRecommendation(
      createInput(
        pausedStore,
        {
          stateReader:
            new FakeStateReader({
              status: "found",
              state: {
                tenantId:
                  "tenant-734",
                operationStatus:
                  "paused",
                blockingSignalId:
                  "signal-734",
                stateVersion: 14,
                lastTransitionAt:
                  120_000,
              },
            }),
        },
      ),
    );

  assert.equal(paused.recorded, false);

  assert.equal(
    paused.code,
    "PILOT_OPERATION_NOT_PERMITTED",
  );

  assert.equal(
    paused.permissionCode,
    "PILOT_OPERATION_PAUSED",
  );

  assert.equal(
    pausedStore.calls.length,
    0,
  );

  const operatorStore =
    new FakeDecisionStore();

  const operatorRejected =
    await decideControlledCustomerRecommendation(
      createInput(
        operatorStore,
        {
          identity: identity({
            userId: "operator-734",
            roles: ["operator"],
          }),
        },
      ),
    );

  assert.equal(
    operatorRejected.recorded,
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

  const approveStore =
    new FakeDecisionStore();

  const approved =
    await decideControlledCustomerRecommendation(
      createInput(approveStore),
    );

  assert.equal(approved.recorded, true);

  assert.equal(
    approved.code,
    "OWNER_RECOMMENDATION_APPROVED",
  );

  assert.equal(
    approved.tenantId,
    "tenant-734",
  );

  assert.equal(
    approved.ownerId,
    "owner-734",
  );

  assert.equal(
    approved.decision,
    "approve",
  );

  assert.equal(
    approved.recommendationStatus,
    "approved",
  );

  assert.equal(
    approved.inquiryStatus,
    "approved",
  );

  assert.equal(
    approved.sandboxExecutionEligible,
    true,
  );

  assert.equal(
    approved.sandboxExecutionAuthorized,
    false,
  );

  assert.equal(
    approved.customerDeliveryAuthorized,
    false,
  );

  assert.equal(
    approved.liveProviderExecutionAuthorized,
    false,
  );

  assert.equal(
    approved.publicLaunchAuthorized,
    false,
  );

  assert.match(
    approved.recommendationContentHash,
    /^[a-f0-9]{64}$/,
  );

  assert.equal(approveStore.calls.length, 1);

  assert.equal(
    approveStore.calls[0].tenantId,
    "tenant-734",
  );

  assert.equal(
    approveStore.calls[0].ownerId,
    "owner-734",
  );

  assert.equal(
    approveStore.calls[0].sessionId,
    "session-734",
  );

  const rejected =
    await decideControlledCustomerRecommendation(
      createInput(
        new FakeDecisionStore(),
        {
          decision: "reject",
          decisionReason:
            "Recommendation requires additional customer information.",
        },
      ),
    );

  assert.equal(rejected.recorded, true);

  assert.equal(
    rejected.code,
    "OWNER_RECOMMENDATION_REJECTED",
  );

  assert.equal(
    rejected.recommendationStatus,
    "rejected",
  );

  assert.equal(
    rejected.sandboxExecutionEligible,
    false,
  );

  const duplicate =
    await decideControlledCustomerRecommendation(
      createInput(
        new FakeDecisionStore(
          "already-decided",
        ),
      ),
    );

  assert.equal(duplicate.recorded, true);

  assert.equal(
    duplicate.code,
    "OWNER_RECOMMENDATION_DECISION_ALREADY_RECORDED",
  );

  assert.equal(
    duplicate.sandboxExecutionAuthorized,
    false,
  );

  const snapshotConflict =
    await decideControlledCustomerRecommendation(
      createInput(
        new FakeDecisionStore(
          "recommendation-snapshot-conflict",
        ),
      ),
    );

  assert.equal(
    snapshotConflict.recorded,
    false,
  );

  assert.equal(
    snapshotConflict.code,
    "RECOMMENDATION_SNAPSHOT_CONFLICT",
  );

  const decisionConflict =
    await decideControlledCustomerRecommendation(
      createInput(
        new FakeDecisionStore(
          "decision-conflict",
        ),
      ),
    );

  assert.equal(
    decisionConflict.recorded,
    false,
  );

  assert.equal(
    decisionConflict.code,
    "OWNER_DECISION_CONFLICT",
  );

  assert.equal(
    decisionConflict.existingDecision,
    "reject",
  );

  const serviceRoleKey =
    "day-734-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledCustomerOwnerDecisionStore({
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
                  status: "decided",
                  decision_id:
                    decisionId,
                  stored_decision:
                    "approve",
                  recommendation_status:
                    "approved",
                  inquiry_status:
                    "approved",
                  stored_decided_at_epoch:
                    "120100",
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.decideRecommendation({
      decisionId,
      tenantId: "tenant-734",
      inquiryId,
      recommendationId,
      ownerId: "owner-734",
      sessionId: "session-734",
      decision: "approve",
      decisionReason:
        "Recommendation is safe for controlled sandbox execution.",
      recommendationText:
        "Ask for the customer's budget and priorities, then prepare one primary recommendation.",
      rationale:
        "More verified customer constraints are required before selecting the safest option.",
      confidence: 0.76,
      riskFlags: [],
      recommendationInputFingerprint:
        "a".repeat(64),
      recommendationContentHash:
        "b".repeat(64),
      decidedAt: 120_100,
    });

  assert.deepEqual(persisted, {
    status: "decided",
    decisionId,
    decision: "approve",
    recommendationStatus: "approved",
    inquiryStatus: "approved",
    decidedAt: 120_100,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_decide_controlled_customer_recommendation$/,
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
    "tenant-734",
  );

  assert.equal(
    requestBody.p_owner_id,
    "owner-734",
  );

  assert.equal(
    requestBody.p_decision,
    "approve",
  );

  assert.equal(
    requestBody.p_recommendation_id,
    recommendationId,
  );

  assert.equal(
    requestBody.p_recommendation_content_hash,
    "b".repeat(64),
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_controlled_customer_recommendation_decisions/i,
  );

  assert.match(
    migration,
    /unique\s*\(\s*tenant_id,\s*recommendation_id\s*\)/i,
  );

  assert.match(
    migration,
    /for update/i,
  );

  assert.match(
    migration,
    /recommendation_record\.recommendation_text <>/i,
  );

  assert.match(
    migration,
    /recommendation_record\.input_fingerprint <>/i,
  );

  assert.match(
    migration,
    /status = target_status/i,
  );

  assert.match(
    migration,
    /already-decided/i,
  );

  assert.match(
    migration,
    /decision-conflict/i,
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
    "DAY 734 TARGETED TEST PASS: authenticated owner-only decisions, active-pilot enforcement, exact recommendation snapshot binding, immutable decision persistence, atomic approval/rejection transitions, duplicate recovery and execution blocking verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
