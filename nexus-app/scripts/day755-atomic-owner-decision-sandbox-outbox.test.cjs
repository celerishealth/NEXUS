"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day755-compiled",
    "atomicOwnerDecisionSandboxOutbox.js",
  ),
);

const {
  AtomicOwnerDecisionAuthorityError,
  AtomicOwnerDecisionPersistenceError,
  AtomicOwnerDecisionValidationError,
  commitApprovedOwnerDecisionWithSandboxOutbox,
} = implementation;

const {
  SandboxOutboxIdempotencyConflictError,
} = require(
  path.join(
    __dirname,
    "..",
    ".day755-compiled",
    "transactionalSandboxOutbox.js",
  ),
);

const TENANT_A =
  "11111111-1111-4111-8111-111111111111";

const TENANT_B =
  "22222222-2222-4222-8222-222222222222";

const OWNER_A =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

const OWNER_B =
  "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const DECISION_A =
  "33333333-3333-4333-8333-333333333333";

const INQUIRY_A =
  "44444444-4444-4444-8444-444444444444";

const OUTBOX_A =
  "55555555-5555-4555-8555-555555555555";

const AUDIT_A =
  "66666666-6666-4666-8666-666666666666";

class FakeClient {
  constructor(options = {}) {
    this.options = options;
    this.calls = [];
    this.releaseCount = 0;

    this.context = {
      tenantId: null,
      actorId: null,
      requestId: null,
    };
  }

  async query(text, values = []) {
    const normalizedText = String(text)
      .replace(/\s+/g, " ")
      .trim();

    this.calls.push({
      text: normalizedText,
      values: Array.from(values),
    });

    if (normalizedText === "BEGIN") {
      return {
        rows: [],
        rowCount: 0,
      };
    }

    if (
      normalizedText ===
      "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE"
    ) {
      return {
        rows: [],
        rowCount: 0,
      };
    }

    if (
      normalizedText.includes(
        "set_config('app.tenant_id'",
      )
    ) {
      this.context = {
        tenantId: values[0],
        actorId: values[1],
        requestId: values[2],
      };

      return {
        rows: [],
        rowCount: 1,
      };
    }

    if (
      normalizedText.includes(
        "current_setting('app.tenant_id'",
      )
    ) {
      return {
        rows: [
          {
            tenant_id: this.context.tenantId,
            actor_id: this.context.actorId,
            request_id: this.context.requestId,
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.startsWith(
        "UPDATE nexus_customer_inquiries",
      )
    ) {
      if (this.options.decisionQueryError) {
        throw this.options.decisionQueryError;
      }

      return {
        rows: [],
        rowCount: 1,
      };
    }

    if (
      normalizedText.startsWith(
        "INSERT INTO nexus_sandbox_outbox",
      )
    ) {
      if (this.options.outboxInsertError) {
        throw this.options.outboxInsertError;
      }

      if (this.options.outboxConflict) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      const payload = JSON.parse(values[5]);

      return {
        rows: [
          {
            tenant_id:
              this.options.outboxTenantId ||
              this.context.tenantId,
            outbox_id: values[1],
            aggregate_type: values[2],
            aggregate_id: values[3],
            action_kind: values[4],
            idempotency_key: values[7],
            payload,
            payload_canonical: values[6],
            status: "pending",
            created_at:
              "2026-07-11T02:00:00.000Z",
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.includes(
        "FROM nexus_sandbox_outbox",
      )
    ) {
      if (!this.options.existingOutbox) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      return {
        rows: [
          {
            tenant_id:
              this.options.existingOutbox.tenantId ||
              this.context.tenantId,
            outbox_id:
              this.options.existingOutbox.outboxId ||
              OUTBOX_A,
            aggregate_type:
              this.options.existingOutbox
                .aggregateType ||
              "customer_inquiry",
            aggregate_id:
              this.options.existingOutbox
                .aggregateId ||
              INQUIRY_A,
            action_kind:
              this.options.existingOutbox.actionKind ||
              "sandbox.recommendation.prepare",
            idempotency_key:
              this.options.existingOutbox
                .idempotencyKey ||
              "decision-333-execution-v1",
            payload:
              this.options.existingOutbox.payload ||
              {
                customerName: "Asha",
                ownerDecisionId: DECISION_A,
                ownerAuditRecordId: AUDIT_A,
                ownerDecisionVersion: 8,
              },
            payload_canonical:
              this.options.existingOutbox
                .payloadCanonical ||
              '{"customerName":"Asha","ownerAuditRecordId":"66666666-6666-4666-8666-666666666666","ownerDecisionId":"33333333-3333-4333-8333-333333333333","ownerDecisionVersion":8}',
            status:
              this.options.existingOutbox.status ||
              "pending",
            created_at:
              "2026-07-11T02:00:00.000Z",
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText === "COMMIT" ||
      normalizedText === "ROLLBACK"
    ) {
      return {
        rows: [],
        rowCount: 0,
      };
    }

    throw new Error(
      `Unexpected fake PostgreSQL query: ${normalizedText}`,
    );
  }

  release() {
    this.releaseCount += 1;
  }
}

class FakePool {
  constructor(client) {
    this.client = client;
    this.connectCount = 0;
  }

  async connect() {
    this.connectCount += 1;
    return this.client;
  }
}

function transactionContext(overrides = {}) {
  return {
    tenantId: TENANT_A,
    actorId: OWNER_A,
    requestId: "request-755",
    ...overrides,
  };
}

function validInput(overrides = {}) {
  return {
    decisionId: DECISION_A,
    inquiryId: INQUIRY_A,
    ownerId: OWNER_A,
    expectedVersion: 7,
    outboxId: OUTBOX_A,
    actionKind:
      "sandbox.recommendation.prepare",
    idempotencyKey:
      "decision-333-execution-v1",
    payload: {
      customerName: "Asha",
    },
    ...overrides,
  };
}

function persistedDecision(overrides = {}) {
  return {
    tenantId: TENANT_A,
    decisionId: DECISION_A,
    inquiryId: INQUIRY_A,
    ownerId: OWNER_A,
    status: "approved",
    version: 8,
    auditRecordId: AUDIT_A,
    ...overrides,
  };
}

function persistenceCallback(
  overrides = {},
  observed = {},
) {
  return async (sql, input) => {
    observed.context = sql.context;
    observed.input = input;

    await sql.query(
      `
        UPDATE nexus_customer_inquiries
        SET owner_decision = 'approved'
        WHERE tenant_id = $1::uuid
          AND inquiry_id = $2::uuid
          AND version = $3::integer
      `,
      [
        sql.context.tenantId,
        input.inquiryId,
        input.expectedVersion,
      ],
    );

    return persistedDecision(overrides);
  };
}

function countCall(client, exactText) {
  return client.calls.filter(
    (call) => call.text === exactText,
  ).length;
}

async function run() {
  let passed = 0;

  async function test(name, operation) {
    await operation();
    passed += 1;
    console.log(`PASS ${passed}: ${name}`);
  }

  await test(
    "rejects non-owner authority before acquiring a connection",
    async () => {
      const pool = new FakePool(new FakeClient());

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          pool,
          transactionContext({
            actorId: OWNER_B,
          }),
          validInput(),
          persistenceCallback(),
        ),
        AtomicOwnerDecisionAuthorityError,
      );

      assert.equal(pool.connectCount, 0);
    },
  );

  await test(
    "rejects non-sandbox action kinds before acquiring a connection",
    async () => {
      const pool = new FakePool(new FakeClient());

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          pool,
          transactionContext(),
          validInput({
            actionKind: "live.whatsapp.send",
          }),
          persistenceCallback(),
        ),
        AtomicOwnerDecisionValidationError,
      );

      assert.equal(pool.connectCount, 0);
    },
  );

  await test(
    "rejects invalid expected version before acquiring a connection",
    async () => {
      const pool = new FakePool(new FakeClient());

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          pool,
          transactionContext(),
          validInput({
            expectedVersion: -1,
          }),
          persistenceCallback(),
        ),
        AtomicOwnerDecisionValidationError,
      );

      assert.equal(pool.connectCount, 0);
    },
  );

  await test(
    "rejects reserved audit binding payload keys",
    async () => {
      const pool = new FakePool(new FakeClient());

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          pool,
          transactionContext(),
          validInput({
            payload: {
              ownerDecisionId:
                "forged-decision",
            },
          }),
          persistenceCallback(),
        ),
        AtomicOwnerDecisionValidationError,
      );

      assert.equal(pool.connectCount, 0);
    },
  );

  await test(
    "persists owner decision inside verified tenant transaction",
    async () => {
      const client = new FakeClient();
      const observed = {};

      await commitApprovedOwnerDecisionWithSandboxOutbox(
        new FakePool(client),
        transactionContext(),
        validInput(),
        persistenceCallback({}, observed),
      );

      assert.equal(
        observed.context.tenantId,
        TENANT_A,
      );

      assert.equal(
        observed.context.actorId,
        OWNER_A,
      );

      assert.equal(
        observed.input.inquiryId,
        INQUIRY_A,
      );
    },
  );

  await test(
    "persists the owner decision before inserting outbox intent",
    async () => {
      const client = new FakeClient();

      await commitApprovedOwnerDecisionWithSandboxOutbox(
        new FakePool(client),
        transactionContext(),
        validInput(),
        persistenceCallback(),
      );

      const decisionIndex =
        client.calls.findIndex((call) =>
          call.text.startsWith(
            "UPDATE nexus_customer_inquiries",
          ),
        );

      const outboxIndex =
        client.calls.findIndex((call) =>
          call.text.startsWith(
            "INSERT INTO nexus_sandbox_outbox",
          ),
        );

      assert.ok(decisionIndex >= 0);
      assert.ok(outboxIndex > decisionIndex);
    },
  );

  await test(
    "binds outbox payload to decision audit and version",
    async () => {
      const client = new FakeClient();

      await commitApprovedOwnerDecisionWithSandboxOutbox(
        new FakePool(client),
        transactionContext(),
        validInput(),
        persistenceCallback(),
      );

      const outboxCall =
        client.calls.find((call) =>
          call.text.startsWith(
            "INSERT INTO nexus_sandbox_outbox",
          ),
        );

      assert.ok(outboxCall);

      const payload = JSON.parse(
        outboxCall.values[5],
      );

      assert.equal(
        payload.ownerDecisionId,
        DECISION_A,
      );

      assert.equal(
        payload.ownerAuditRecordId,
        AUDIT_A,
      );

      assert.equal(
        payload.ownerDecisionVersion,
        8,
      );
    },
  );

  await test(
    "commits only after both decision and outbox succeed",
    async () => {
      const client = new FakeClient();

      await commitApprovedOwnerDecisionWithSandboxOutbox(
        new FakePool(client),
        transactionContext(),
        validInput(),
        persistenceCallback(),
      );

      const outboxIndex =
        client.calls.findIndex((call) =>
          call.text.startsWith(
            "INSERT INTO nexus_sandbox_outbox",
          ),
        );

      const commitIndex =
        client.calls.findIndex(
          (call) => call.text === "COMMIT",
        );

      assert.ok(commitIndex > outboxIndex);
      assert.equal(countCall(client, "COMMIT"), 1);
      assert.equal(
        countCall(client, "ROLLBACK"),
        0,
      );
    },
  );

  await test(
    "returns immutable atomic result",
    async () => {
      const client = new FakeClient();

      const result =
        await commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback(),
        );

      assert.equal(Object.isFrozen(result), true);
      assert.equal(
        Object.isFrozen(result.outbox),
        true,
      );
      assert.equal(result.tenantId, TENANT_A);
      assert.equal(result.decisionId, DECISION_A);
      assert.equal(result.auditRecordId, AUDIT_A);
      assert.equal(result.decisionVersion, 8);
      assert.equal(result.outbox.inserted, true);
    },
  );

  await test(
    "rolls back when owner decision persistence fails",
    async () => {
      const client = new FakeClient();

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          async (sql) => {
            await sql.query(
              "UPDATE nexus_customer_inquiries SET owner_decision = 'approved'",
            );

            throw new Error(
              "owner decision write failed",
            );
          },
        ),
        /owner decision write failed/,
      );

      assert.equal(countCall(client, "COMMIT"), 0);
      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rolls back when outbox persistence fails",
    async () => {
      const client = new FakeClient({
        outboxInsertError: new Error(
          "outbox write failed",
        ),
      });

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback(),
        ),
        /outbox write failed/,
      );

      assert.equal(countCall(client, "COMMIT"), 0);
      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rolls back on conflicting idempotency intent",
    async () => {
      const client = new FakeClient({
        outboxConflict: true,
        existingOutbox: {
          actionKind:
            "sandbox.quote.prepare",
        },
      });

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback(),
        ),
        SandboxOutboxIdempotencyConflictError,
      );

      assert.equal(countCall(client, "COMMIT"), 0);
      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rejects cross-tenant persisted owner decision",
    async () => {
      const client = new FakeClient();

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback({
            tenantId: TENANT_B,
          }),
        ),
        AtomicOwnerDecisionPersistenceError,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rejects mismatched persisted decision identity",
    async () => {
      const client = new FakeClient();

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback({
            decisionId:
              "77777777-7777-4777-8777-777777777777",
          }),
        ),
        AtomicOwnerDecisionPersistenceError,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rejects a decision that is not explicitly approved",
    async () => {
      const client = new FakeClient();

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback({
            status: "rejected",
          }),
        ),
        AtomicOwnerDecisionPersistenceError,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rejects incorrect optimistic version advancement",
    async () => {
      const client = new FakeClient();

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback({
            version: 9,
          }),
        ),
        AtomicOwnerDecisionPersistenceError,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rejects missing durable audit identity",
    async () => {
      const client = new FakeClient();

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback({
            auditRecordId: "",
          }),
        ),
        AtomicOwnerDecisionValidationError,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "rejects cross-tenant outbox result",
    async () => {
      const client = new FakeClient({
        outboxTenantId: TENANT_B,
      });

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback(),
        ),
        AtomicOwnerDecisionPersistenceError,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        1,
      );
    },
  );

  await test(
    "reuses an identical existing outbox intent idempotently",
    async () => {
      const client = new FakeClient({
        outboxConflict: true,
        existingOutbox: {},
      });

      const result =
        await commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(client),
          transactionContext(),
          validInput(),
          persistenceCallback(),
        );

      assert.equal(result.outbox.inserted, false);
      assert.equal(countCall(client, "COMMIT"), 1);
      assert.equal(
        countCall(client, "ROLLBACK"),
        0,
      );
    },
  );

  await test(
    "always releases the PostgreSQL connection",
    async () => {
      const successClient = new FakeClient();

      await commitApprovedOwnerDecisionWithSandboxOutbox(
        new FakePool(successClient),
        transactionContext(),
        validInput(),
        persistenceCallback(),
      );

      assert.equal(
        successClient.releaseCount,
        1,
      );

      const failedClient = new FakeClient({
        outboxInsertError: new Error(
          "expected outbox failure",
        ),
      });

      await assert.rejects(
        commitApprovedOwnerDecisionWithSandboxOutbox(
          new FakePool(failedClient),
          transactionContext(),
          validInput(),
          persistenceCallback(),
        ),
      );

      assert.equal(
        failedClient.releaseCount,
        1,
      );
    },
  );

  assert.equal(passed, 20);

  console.log("");
  console.log(
    "DAY 755 TARGETED TESTS: PASS (20/20)",
  );
  console.log(
    "ATOMIC OWNER DECISION AND OUTBOX COMMIT: PASS",
  );
  console.log("OWNER AUTHORITY BINDING: PASS");
  console.log(
    "OPTIMISTIC VERSION BINDING: PASS",
  );
  console.log("DECISION AUDIT BINDING: PASS");
  console.log(
    "TRANSACTION ROLLBACK SAFETY: PASS",
  );
  console.log(
    "IDEMPOTENT OUTBOX REPLAY: PASS",
  );
  console.log(
    "SANDBOX ACTION ALLOWLIST: PASS",
  );
  console.log(
    "CROSS-TENANT RESULT DEFENCE: PASS",
  );
  console.log(
    "LIVE PROVIDER EXECUTION: BLOCKED",
  );
  console.log("EXTERNAL DELIVERY: BLOCKED");
  console.log("PAYMENT EXECUTION: BLOCKED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
