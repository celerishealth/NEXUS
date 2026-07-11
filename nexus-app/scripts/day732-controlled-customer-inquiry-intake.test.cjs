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
    "Compiled Day 732 module paths or migration path were not provided.",
  );
}

const {
  intakeControlledCustomerInquiry,
} = require(path.resolve(compiledServicePath));

const {
  SupabaseControlledCustomerInquiryStore,
} = require(path.resolve(compiledStorePath));

const inquiryId =
  "11111111-7320-4732-8732-111111111111";

function identity(overrides = {}) {
  return {
    authenticated: true,
    userId: "operator-732",
    tenantId: "tenant-732",
    roles: ["operator"],
    sessionId: "session-732",
    ...overrides,
  };
}

class FakeInquiryStore {
  constructor(status = "created") {
    this.status = status;
    this.calls = [];
  }

  async createInquiry(record) {
    this.calls.push({
      ...record,
    });

    if (this.status === "throw") {
      throw new Error(
        "simulated inquiry storage failure",
      );
    }

    if (this.status === "created") {
      return {
        status: "created",
        inquiryId: record.inquiryId,
        receivedAt: record.receivedAt,
      };
    }

    if (
      this.status ===
      "already-created"
    ) {
      return {
        status: "already-created",
        inquiryId:
          "22222222-7320-4732-8732-222222222222",
        receivedAt: 100_000,
      };
    }

    if (
      this.status ===
      "binding-conflict"
    ) {
      return {
        status: "binding-conflict",
        existingInquiryId:
          "33333333-7320-4732-8732-333333333333",
      };
    }

    return {
      status: "store-unavailable",
    };
  }
}

function createInput(store, overrides = {}) {
  return {
    identity: identity(),
    customerRef: "customer-732",
    channel: "web",
    message:
      "Please recommend the best option for my business.",
    idempotencyKey:
      "customer-732-request-001",
    receivedAt: 100_000,
    createInquiryId: () => inquiryId,
    store,
    ...overrides,
  };
}

async function run() {
  const unauthenticatedStore =
    new FakeInquiryStore();

  const unauthenticated =
    await intakeControlledCustomerInquiry(
      createInput(
        unauthenticatedStore,
        {
          identity: identity({
            authenticated: false,
          }),
        },
      ),
    );

  assert.equal(
    unauthenticated.accepted,
    false,
  );

  assert.equal(
    unauthenticated.code,
    "AUTHENTICATION_REQUIRED",
  );

  assert.equal(
    unauthenticatedStore.calls.length,
    0,
  );

  const wrongRoleStore =
    new FakeInquiryStore();

  const wrongRole =
    await intakeControlledCustomerInquiry(
      createInput(
        wrongRoleStore,
        {
          identity: identity({
            roles: ["viewer"],
          }),
        },
      ),
    );

  assert.equal(wrongRole.accepted, false);

  assert.equal(
    wrongRole.code,
    "INQUIRY_INTAKE_ROLE_REQUIRED",
  );

  assert.equal(
    wrongRoleStore.calls.length,
    0,
  );

  const createdStore =
    new FakeInquiryStore();

  const created =
    await intakeControlledCustomerInquiry(
      createInput(createdStore),
    );

  assert.equal(created.accepted, true);

  assert.equal(
    created.code,
    "CUSTOMER_INQUIRY_CREATED",
  );

  assert.equal(
    created.inquiryId,
    inquiryId,
  );

  assert.equal(
    created.tenantId,
    "tenant-732",
  );

  assert.equal(
    created.status,
    "received",
  );

  assert.equal(
    created.aiRecommendationAuthorized,
    false,
  );

  assert.equal(
    created.ownerApprovalRequired,
    true,
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

  assert.equal(createdStore.calls.length, 1);

  /*
   * Tenant must come exclusively from trusted identity.
   */
  assert.equal(
    createdStore.calls[0].tenantId,
    "tenant-732",
  );

  assert.equal(
    createdStore.calls[0].customerRef,
    "customer-732",
  );

  assert.equal(
    createdStore.calls[0].idempotencyKey,
    "customer-732-request-001",
  );

  const duplicate =
    await intakeControlledCustomerInquiry(
      createInput(
        new FakeInquiryStore(
          "already-created",
        ),
      ),
    );

  assert.equal(duplicate.accepted, true);

  assert.equal(
    duplicate.code,
    "CUSTOMER_INQUIRY_ALREADY_CREATED",
  );

  assert.equal(
    duplicate.inquiryId,
    "22222222-7320-4732-8732-222222222222",
  );

  const conflict =
    await intakeControlledCustomerInquiry(
      createInput(
        new FakeInquiryStore(
          "binding-conflict",
        ),
      ),
    );

  assert.equal(conflict.accepted, false);

  assert.equal(
    conflict.code,
    "INQUIRY_IDEMPOTENCY_CONFLICT",
  );

  assert.equal(
    conflict.existingInquiryId,
    "33333333-7320-4732-8732-333333333333",
  );

  const unavailable =
    await intakeControlledCustomerInquiry(
      createInput(
        new FakeInquiryStore(
          "store-unavailable",
        ),
      ),
    );

  assert.equal(unavailable.accepted, false);

  assert.equal(
    unavailable.code,
    "INQUIRY_STORE_UNAVAILABLE",
  );

  const invalidMessageStore =
    new FakeInquiryStore();

  const invalidMessage =
    await intakeControlledCustomerInquiry(
      createInput(
        invalidMessageStore,
        {
          message: "   ",
        },
      ),
    );

  assert.equal(
    invalidMessage.accepted,
    false,
  );

  assert.equal(
    invalidMessage.code,
    "INVALID_INQUIRY_INPUT",
  );

  assert.equal(
    invalidMessageStore.calls.length,
    0,
  );

  const serviceRoleKey =
    "day-732-server-only-service-role-key-long-enough";

  const requests = [];

  const supabaseStore =
    new SupabaseControlledCustomerInquiryStore({
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
                  inquiry_id:
                    inquiryId,
                  stored_received_at_epoch:
                    "100000",
                },
              ];
            },
          };
        },
    });

  const persisted =
    await supabaseStore.createInquiry({
      inquiryId,
      tenantId: "tenant-732",
      customerRef: "customer-732",
      channel: "web",
      message:
        "Please recommend the best option for my business.",
      idempotencyKey:
        "customer-732-request-001",
      receivedAt: 100_000,
    });

  assert.deepEqual(persisted, {
    status: "created",
    inquiryId,
    receivedAt: 100_000,
  });

  assert.equal(requests.length, 1);

  assert.match(
    requests[0].url,
    /nexus_create_controlled_customer_inquiry$/,
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

  assert.deepEqual(requestBody, {
    p_inquiry_id: inquiryId,
    p_tenant_id: "tenant-732",
    p_customer_ref: "customer-732",
    p_channel: "web",
    p_message:
      "Please recommend the best option for my business.",
    p_idempotency_key:
      "customer-732-request-001",
    p_received_at_epoch: 100_000,
  });

  const conflictStore =
    new SupabaseControlledCustomerInquiryStore({
      supabaseUrl:
        "https://example.supabase.co",
      serviceRoleKey,
      fetchFunction: async () => ({
        ok: true,
        async json() {
          return [
            {
              status:
                "binding-conflict",
              inquiry_id:
                "44444444-7320-4732-8732-444444444444",
              stored_received_at_epoch:
                99_999,
            },
          ];
        },
      }),
    });

  assert.deepEqual(
    await conflictStore.createInquiry({
      inquiryId,
      tenantId: "tenant-732",
      customerRef: "customer-732",
      channel: "web",
      message:
        "Different content",
      idempotencyKey:
        "customer-732-request-001",
      receivedAt: 100_000,
    }),
    {
      status: "binding-conflict",
      existingInquiryId:
        "44444444-7320-4732-8732-444444444444",
    },
  );

  const migration =
    fs.readFileSync(
      path.resolve(migrationPath),
      "utf8",
    );

  assert.match(
    migration,
    /nexus_controlled_customer_inquiries/i,
  );

  assert.match(
    migration,
    /unique\s*\(\s*tenant_id,\s*idempotency_key\s*\)/i,
  );

  assert.match(
    migration,
    /on conflict\s*\(\s*tenant_id,\s*idempotency_key\s*\)/i,
  );

  assert.match(
    migration,
    /binding-conflict/i,
  );

  assert.match(
    migration,
    /already-created/i,
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
    "DAY 732 TARGETED TEST PASS: authenticated tenant inquiry intake, trusted tenant binding, persistent idempotency, duplicate recovery, content conflict blocking, server-only storage and fail-closed execution boundaries verified.",
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
