"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");

const cycleImplementation = require(
  path.join(
    __dirname,
    "..",
    ".day760-compiled",
    "sandboxWorkerCycle.js",
  ),
);

const workerBoundary = require(
  path.join(
    __dirname,
    "..",
    ".day760-compiled",
    "sandboxWorkerExecutionBoundary.js",
  ),
);

const {
  SandboxWorkerCycleInfrastructureError,
  SandboxWorkerCycleValidationError,
  runSandboxWorkerCycle,
} = cycleImplementation;

const {
  SandboxHandlerExecutionError,
} = workerBoundary;

const TENANT_A =
  "11111111-1111-4111-8111-111111111111";

const TENANT_B =
  "22222222-2222-4222-8222-222222222222";

const ACTOR_A =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

const OUTBOX_A =
  "33333333-3333-4333-8333-333333333333";

const OUTBOX_B =
  "44444444-4444-4444-8444-444444444444";

const OUTBOX_C =
  "55555555-5555-4555-8555-555555555555";

const AGGREGATE_A =
  "66666666-6666-4666-8666-666666666666";

const AGGREGATE_B =
  "77777777-7777-4777-8777-777777777777";

const AGGREGATE_C =
  "88888888-8888-4888-8888-888888888888";

const RESULT_A =
  "99999999-9999-4999-8999-999999999999";

const RESULT_B =
  "12121212-1212-4212-8212-121212121212";

const RESULT_C =
  "13131313-1313-4313-8313-131313131313";

const LEASE_TOKEN =
  "14141414-1414-4414-8414-141414141414";

const ACTION_KIND =
  "sandbox.ai.recommendation.generate";

function claimRow({
  tenantId = TENANT_A,
  outboxId = OUTBOX_A,
  aggregateId = AGGREGATE_A,
  resultId = RESULT_A,
  attemptCount = 1,
  leaseOwner = "sandbox-worker-a",
  leaseToken = LEASE_TOKEN,
} = {}) {
  return {
    tenant_id: tenantId,
    outbox_id: outboxId,
    aggregate_type: "customer_inquiry",
    aggregate_id: aggregateId,
    action_kind: ACTION_KIND,
    idempotency_key:
      `${outboxId}-recommendation-v1`,
    payload: {
      resultId,
      customerMessage:
        "Recommend the best option.",
      businessContext: {
        businessName: "Example Store",
      },
    },
    attempt_count: attemptCount,
    lease_owner: leaseOwner,
    lease_token: leaseToken,
    lease_expires_at:
      "2026-07-11T06:00:00.000Z",
  };
}

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

  findClaim(outboxId) {
    const claims =
      this.options.claimRows || [];

    return claims.find(
      (claim) =>
        claim.outbox_id === outboxId,
    );
  }

  async query(text, values = []) {
    const normalizedText = String(text)
      .replace(/\s+/g, " ")
      .trim();

    this.calls.push({
      text: normalizedText,
      values: Array.from(values),
    });

    if (
      normalizedText === "BEGIN" ||
      normalizedText ===
        "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE" ||
      normalizedText === "COMMIT" ||
      normalizedText === "ROLLBACK"
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
        "WITH recovered AS",
      )
    ) {
      if (this.options.prepareError) {
        throw this.options.prepareError;
      }

      return {
        rows: [
          {
            recovered_count:
              String(
                this.options.recoveredCount ||
                  0,
              ),
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.startsWith(
        "WITH candidates AS",
      )
    ) {
      return {
        rows: this.options.claimRows || [],
        rowCount:
          (this.options.claimRows || [])
            .length,
      };
    }

    if (
      normalizedText.includes(
        "FROM nexus_sandbox_outbox",
      ) &&
      normalizedText.includes("FOR UPDATE")
    ) {
      const claim = this.findClaim(
        values[1],
      );

      if (!claim) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      return {
        rows: [
          {
            tenant_id: claim.tenant_id,
            outbox_id: claim.outbox_id,
            action_kind:
              claim.action_kind,
            status: "processing",
            lease_owner:
              claim.lease_owner,
            lease_token:
              claim.lease_token,
            lease_valid: true,
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.startsWith(
        "INSERT INTO nexus_sandbox_outbox_results",
      )
    ) {
      const outboxId = values[2];

      if (
        (
          this.options
            .resultInsertErrorOutboxIds ||
          []
        ).includes(outboxId)
      ) {
        throw new Error(
          "sensitive result database failure",
        );
      }

      return {
        rows: [
          {
            tenant_id: values[0],
            result_id: values[1],
            outbox_id: values[2],
            action_kind: values[3],
            payload: JSON.parse(values[4]),
            payload_canonical: values[5],
            created_at:
              "2026-07-11T05:00:00.000Z",
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.includes(
        "FROM nexus_sandbox_outbox_results",
      )
    ) {
      return {
        rows: [],
        rowCount: 0,
      };
    }

    if (
      normalizedText.startsWith(
        "UPDATE nexus_sandbox_outbox",
      ) &&
      normalizedText.includes(
        "status = 'completed'",
      ) &&
      !normalizedText.includes(
        "status = CASE",
      )
    ) {
      const outboxId = values[1];

      if (
        (
          this.options
            .completionMissingOutboxIds ||
          []
        ).includes(outboxId)
      ) {
        return {
          rows: [],
          rowCount: 0,
        };
      }

      return {
        rows: [
          {
            tenant_id: values[0],
            outbox_id: outboxId,
            status: "completed",
            completed_at:
              "2026-07-11T05:01:00.000Z",
          },
        ],
        rowCount: 1,
      };
    }

    if (
      normalizedText.startsWith(
        "UPDATE nexus_sandbox_outbox",
      ) &&
      normalizedText.includes(
        "status = CASE",
      )
    ) {
      const outboxId = values[1];

      if (
        (
          this.options
            .failureTransitionErrorOutboxIds ||
          []
        ).includes(outboxId)
      ) {
        throw new Error(
          "sensitive failure transition error",
        );
      }

      const claim = this.findClaim(
        outboxId,
      );

      const retryable = values[5];
      const maxAttempts = values[7];

      const status =
        retryable &&
        claim &&
        claim.attempt_count < maxAttempts
          ? "pending"
          : "failed";

      return {
        rows: [
          {
            tenant_id: values[0],
            outbox_id: outboxId,
            status,
            attempt_count:
              claim?.attempt_count || 1,
            available_at:
              "2026-07-11T05:10:00.000Z",
            completed_at: null,
            failed_at:
              status === "failed"
                ? "2026-07-11T05:02:00.000Z"
                : null,
            last_error_code:
              values[4],
          },
        ],
        rowCount: 1,
      };
    }

    throw new Error(
      `Unexpected fake query: ${normalizedText}`,
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

class FakeRegistry {
  constructor(executor) {
    this.actionKinds = Object.freeze([
      ACTION_KIND,
    ]);

    this.executor = executor;
    this.calls = [];
  }

  async execute(claim, options) {
    this.calls.push({
      claim,
      options,
    });

    return this.executor(
      claim,
      options,
    );
  }
}

function context(overrides = {}) {
  return {
    tenantId: TENANT_A,
    actorId: ACTOR_A,
    requestId: "request-760",
    ...overrides,
  };
}

function input(registry, overrides = {}) {
  return {
    registry,
    leaseOwner: "sandbox-worker-a",
    leaseToken: LEASE_TOKEN,
    leaseSeconds: 60,
    batchSize: 10,
    handlerTimeoutMilliseconds: 5000,
    retryDelaySeconds: 300,
    maxAttempts: 3,
    ...overrides,
  };
}

function successfulExecution(
  claim,
  overrides = {},
) {
  const resultIds = {
    [OUTBOX_A]: RESULT_A,
    [OUTBOX_B]: RESULT_B,
    [OUTBOX_C]: RESULT_C,
  };

  return {
    tenantId: claim.tenantId,
    outboxId: claim.outboxId,
    aggregateType:
      claim.aggregateType,
    aggregateId: claim.aggregateId,
    actionKind: claim.actionKind,
    idempotencyKey:
      claim.idempotencyKey,
    attemptCount: claim.attemptCount,
    leaseOwner: claim.leaseOwner,
    leaseToken: claim.leaseToken,
    resultId:
      resultIds[claim.outboxId] ||
      RESULT_A,
    payload: {
      recommendation: "approve",
      ownerApprovalRequired: true,
      liveProviderExecution:
        "blocked",
    },
    payloadCanonical:
      '{"liveProviderExecution":"blocked","ownerApprovalRequired":true,"recommendation":"approve"}',
    ...overrides,
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
    "rejects invalid tenant before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context({
            tenantId: "invalid-tenant",
          }),
          input(registry),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "rejects invalid lease token before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context(),
          input(registry, {
            leaseToken:
              "invalid-token",
          }),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "rejects invalid batch size before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context(),
          input(registry, {
            batchSize: 101,
          }),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "rejects invalid handler timeout before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context(),
          input(registry, {
            handlerTimeoutMilliseconds: 9,
          }),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "rejects excessive retry delay before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context(),
          input(registry, {
            retryDelaySeconds: 86401,
          }),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "rejects invalid retry ceiling before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context(),
          input(registry, {
            maxAttempts: 0,
          }),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "rejects missing strict registry before database access",
    async () => {
      const pool = new FakePool(
        new FakeClient(),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          pool,
          context(),
          input(null),
        ),
        SandboxWorkerCycleValidationError,
      );

      assert.equal(
        pool.connectCount,
        0,
      );
    },
  );

  await test(
    "recovers expired leases before claiming work",
    async () => {
      const client = new FakeClient({
        recoveredCount: 2,
        claimRows: [],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      const recoveryIndex =
        client.calls.findIndex(
          (call) =>
            call.text.startsWith(
              "WITH recovered AS",
            ),
        );

      const claimIndex =
        client.calls.findIndex(
          (call) =>
            call.text.startsWith(
              "WITH candidates AS",
            ),
        );

      assert.ok(recoveryIndex >= 0);
      assert.ok(claimIndex > recoveryIndex);
      assert.equal(
        result.recoveredLeaseCount,
        2,
      );
    },
  );

  await test(
    "recovers and claims inside one committed transaction",
    async () => {
      const client = new FakeClient({
        claimRows: [],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await runSandboxWorkerCycle(
        new FakePool(client),
        context(),
        input(registry),
      );

      assert.equal(
        countCall(client, "COMMIT"),
        1,
      );

      assert.equal(
        countCall(client, "ROLLBACK"),
        0,
      );
    },
  );

  await test(
    "returns clean empty summary when no work is available",
    async () => {
      const client = new FakeClient({
        claimRows: [],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(result.claimedCount, 0);
      assert.equal(result.completedCount, 0);
      assert.equal(
        result.retryScheduledCount,
        0,
      );
      assert.equal(
        result.terminalFailedCount,
        0,
      );
      assert.deepEqual(
        result.outcomes,
        [],
      );
      assert.equal(
        registry.calls.length,
        0,
      );
    },
  );

  await test(
    "sanitizes preparation database failures",
    async () => {
      const client = new FakeClient({
        prepareError: new Error(
          "secret database connection detail",
        ),
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        ),
        (error) => {
          assert.ok(
            error instanceof
              SandboxWorkerCycleInfrastructureError,
          );

          assert.equal(
            error.safeCode,
            "sandbox_worker_prepare_failed",
          );

          assert.equal(
            error.message.includes("secret"),
            false,
          );

          return true;
        },
      );
    },
  );

  await test(
    "rejects duplicate claimed outbox identities",
    async () => {
      const client = new FakeClient({
        claimRows: [
          claimRow(),
          claimRow(),
        ],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        ),
        (error) => {
          assert.equal(
            error.safeCode,
            "sandbox_duplicate_claim_detected",
          );

          return true;
        },
      );

      assert.equal(
        registry.calls.length,
        0,
      );
    },
  );

  await test(
    "executes a successfully claimed sandbox action",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        registry.calls.length,
        1,
      );

      assert.equal(
        registry.calls[0]
          .options
          .timeoutMilliseconds,
        5000,
      );

      assert.equal(
        result.completedCount,
        1,
      );

      assert.equal(
        result.outcomes[0].status,
        "completed",
      );

      assert.equal(
        result.outcomes[0].resultId,
        RESULT_A,
      );
    },
  );

  await test(
    "persists result after handler execution",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      await runSandboxWorkerCycle(
        new FakePool(client),
        context(),
        input(registry),
      );

      const insertIndex =
        client.calls.findIndex(
          (call) =>
            call.text.startsWith(
              "INSERT INTO nexus_sandbox_outbox_results",
            ),
        );

      const completionIndex =
        client.calls.findIndex(
          (call) =>
            call.text.startsWith(
              "UPDATE nexus_sandbox_outbox",
            ) &&
            call.text.includes(
              "status = 'completed'",
            ),
        );

      assert.ok(insertIndex >= 0);
      assert.ok(
        completionIndex > insertIndex,
      );
    },
  );

  await test(
    "returns deeply immutable cycle evidence",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        Object.isFrozen(result),
        true,
      );

      assert.equal(
        Object.isFrozen(
          result.outcomes,
        ),
        true,
      );

      assert.equal(
        Object.isFrozen(
          result.outcomes[0],
        ),
        true,
      );
    },
  );

  await test(
    "schedules retry for retryable handler failure",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async () => {
          throw new SandboxHandlerExecutionError(
            "sandbox_temporary_capacity",
            true,
          );
        },
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        result.retryScheduledCount,
        1,
      );

      assert.equal(
        result.outcomes[0].status,
        "retry_scheduled",
      );

      assert.equal(
        result.outcomes[0].failureCode,
        "sandbox_temporary_capacity",
      );
    },
  );

  await test(
    "records terminal failure for non-retryable handler error",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async () => {
          throw new SandboxHandlerExecutionError(
            "sandbox_invalid_business_input",
            false,
          );
        },
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        result.terminalFailedCount,
        1,
      );

      assert.equal(
        result.outcomes[0].status,
        "terminal_failed",
      );

      assert.equal(
        result.outcomes[0].failureCode,
        "sandbox_invalid_business_input",
      );
    },
  );

  await test(
    "enforces maximum attempts on retryable failure",
    async () => {
      const client = new FakeClient({
        claimRows: [
          claimRow({
            attemptCount: 3,
          }),
        ],
      });

      const registry = new FakeRegistry(
        async () => {
          throw new SandboxHandlerExecutionError(
            "sandbox_temporary_capacity",
            true,
          );
        },
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry, {
            maxAttempts: 3,
          }),
        );

      assert.equal(
        result.terminalFailedCount,
        1,
      );

      assert.equal(
        result.outcomes[0].status,
        "terminal_failed",
      );
    },
  );

  await test(
    "sanitizes unknown handler exceptions",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async () => {
          throw new Error(
            "secret handler credential",
          );
        },
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        result.outcomes[0].failureCode,
        "sandbox_worker_unexpected_error",
      );

      assert.equal(
        JSON.stringify(result).includes(
          "credential",
        ),
        false,
      );
    },
  );

  await test(
    "fails terminally on handler result binding mismatch",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(
            claim,
            {
              tenantId: TENANT_B,
            },
          ),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        result.terminalFailedCount,
        1,
      );

      assert.equal(
        result.outcomes[0].failureCode,
        "sandbox_worker_result_binding_mismatch",
      );
    },
  );

  await test(
    "schedules retry when atomic result commit fails",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
        resultInsertErrorOutboxIds: [
          OUTBOX_A,
        ],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        result.retryScheduledCount,
        1,
      );

      assert.equal(
        result.outcomes[0].failureCode,
        "sandbox_result_commit_failed",
      );
    },
  );

  await test(
    "continues to later claims after a handled failure",
    async () => {
      const client = new FakeClient({
        claimRows: [
          claimRow(),
          claimRow({
            outboxId: OUTBOX_B,
            aggregateId: AGGREGATE_B,
            resultId: RESULT_B,
          }),
        ],
      });

      const registry = new FakeRegistry(
        async (claim) => {
          if (
            claim.outboxId === OUTBOX_A
          ) {
            throw new SandboxHandlerExecutionError(
              "sandbox_invalid_business_input",
              false,
            );
          }

          return successfulExecution(
            claim,
          );
        },
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        registry.calls.length,
        2,
      );

      assert.equal(
        result.terminalFailedCount,
        1,
      );

      assert.equal(
        result.completedCount,
        1,
      );
    },
  );

  await test(
    "processes claimed records sequentially in claim order",
    async () => {
      const client = new FakeClient({
        claimRows: [
          claimRow(),
          claimRow({
            outboxId: OUTBOX_B,
            aggregateId: AGGREGATE_B,
            resultId: RESULT_B,
          }),
          claimRow({
            outboxId: OUTBOX_C,
            aggregateId: AGGREGATE_C,
            resultId: RESULT_C,
          }),
        ],
      });

      const observedOrder = [];

      const registry = new FakeRegistry(
        async (claim) => {
          observedOrder.push(
            claim.outboxId,
          );

          return successfulExecution(
            claim,
          );
        },
      );

      await runSandboxWorkerCycle(
        new FakePool(client),
        context(),
        input(registry),
      );

      assert.deepEqual(
        observedOrder,
        [
          OUTBOX_A,
          OUTBOX_B,
          OUTBOX_C,
        ],
      );
    },
  );

  await test(
    "produces exact mixed outcome counts",
    async () => {
      const client = new FakeClient({
        claimRows: [
          claimRow(),
          claimRow({
            outboxId: OUTBOX_B,
            aggregateId: AGGREGATE_B,
            resultId: RESULT_B,
          }),
          claimRow({
            outboxId: OUTBOX_C,
            aggregateId: AGGREGATE_C,
            resultId: RESULT_C,
          }),
        ],
      });

      const registry = new FakeRegistry(
        async (claim) => {
          if (
            claim.outboxId === OUTBOX_A
          ) {
            return successfulExecution(
              claim,
            );
          }

          if (
            claim.outboxId === OUTBOX_B
          ) {
            throw new SandboxHandlerExecutionError(
              "sandbox_temporary_capacity",
              true,
            );
          }

          throw new SandboxHandlerExecutionError(
            "sandbox_invalid_business_input",
            false,
          );
        },
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(result.claimedCount, 3);
      assert.equal(result.completedCount, 1);
      assert.equal(
        result.retryScheduledCount,
        1,
      );
      assert.equal(
        result.terminalFailedCount,
        1,
      );
    },
  );

  await test(
    "fails loudly when failure transition cannot persist",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
        failureTransitionErrorOutboxIds: [
          OUTBOX_A,
        ],
      });

      const registry = new FakeRegistry(
        async () => {
          throw new SandboxHandlerExecutionError(
            "sandbox_temporary_capacity",
            true,
          );
        },
      );

      await assert.rejects(
        runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        ),
        (error) => {
          assert.ok(
            error instanceof
              SandboxWorkerCycleInfrastructureError,
          );

          assert.equal(
            error.safeCode,
            "sandbox_failure_transition_failed",
          );

          assert.equal(
            error.message.includes(
              "sensitive",
            ),
            false,
          );

          return true;
        },
      );
    },
  );

  await test(
    "releases every database transaction connection",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const pool = new FakePool(client);

      await runSandboxWorkerCycle(
        pool,
        context(),
        input(registry),
      );

      assert.equal(
        client.releaseCount,
        pool.connectCount,
      );
    },
  );

  await test(
    "keeps all external-effect authority blocked",
    async () => {
      const client = new FakeClient({
        claimRows: [claimRow()],
      });

      const registry = new FakeRegistry(
        async (claim) =>
          successfulExecution(claim),
      );

      const result =
        await runSandboxWorkerCycle(
          new FakePool(client),
          context(),
          input(registry),
        );

      assert.equal(
        result.ownerApprovalRequired,
        true,
      );

      assert.equal(
        result.liveProviderExecution,
        "blocked",
      );

      assert.equal(
        result.externalDelivery,
        "blocked",
      );

      assert.equal(
        result.paymentExecution,
        "blocked",
      );

      assert.equal(
        result.publicLaunch,
        "blocked",
      );
    },
  );

  assert.equal(passed, 27);

  console.log("");
  console.log(
    "DAY 760 TARGETED TESTS: PASS (27/27)",
  );
  console.log(
    "EXPIRED LEASE RECOVERY AND CLAIM TRANSACTION: PASS",
  );
  console.log(
    "TENANT-ISOLATED WORKER ORCHESTRATION: PASS",
  );
  console.log(
    "BOUNDED SEQUENTIAL CLAIM EXECUTION: PASS",
  );
  console.log(
    "ATOMIC RESULT COMPLETION INTEGRATION: PASS",
  );
  console.log(
    "SAFE RETRY SCHEDULING: PASS",
  );
  console.log(
    "TERMINAL FAILURE INTEGRATION: PASS",
  );
  console.log(
    "MAX ATTEMPT ENFORCEMENT: PASS",
  );
  console.log(
    "RESULT BINDING DEFENCE: PASS",
  );
  console.log(
    "RAW INFRASTRUCTURE ERROR LEAKAGE: BLOCKED",
  );
  console.log(
    "OWNER APPROVAL REQUIREMENT: LOCKED",
  );
  console.log(
    "LIVE PROVIDER EXECUTION: BLOCKED",
  );
  console.log("EXTERNAL DELIVERY: BLOCKED");
  console.log("PAYMENT EXECUTION: BLOCKED");
  console.log("PUBLIC LAUNCH: BLOCKED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
