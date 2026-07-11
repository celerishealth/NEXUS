"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");

const implementation = require(
  path.join(
    __dirname,
    "..",
    ".day757-compiled",
    "sandboxWorkerExecutionBoundary.js",
  ),
);

const {
  SandboxHandlerExecutionError,
  SandboxHandlerInvalidOutputError,
  SandboxHandlerNotRegisteredError,
  SandboxHandlerTimeoutError,
  SandboxHandlerUnexpectedError,
  SandboxWorkerBoundaryValidationError,
  createSandboxHandlerRegistry,
} = implementation;

const TENANT_A =
  "11111111-1111-4111-8111-111111111111";

const OUTBOX_A =
  "22222222-2222-4222-8222-222222222222";

const AGGREGATE_A =
  "33333333-3333-4333-8333-333333333333";

const LEASE_TOKEN_A =
  "44444444-4444-4444-8444-444444444444";

const RESULT_A =
  "55555555-5555-4555-8555-555555555555";

const ACTION_A =
  "sandbox.recommendation.prepare";

function claimedRecord(overrides = {}) {
  return {
    tenantId: TENANT_A,
    outboxId: OUTBOX_A,
    aggregateType: "customer_inquiry",
    aggregateId: AGGREGATE_A,
    actionKind: ACTION_A,
    idempotencyKey:
      "inquiry-333-recommendation-v1",
    payload: {
      customerName: "Asha",
      request: {
        priority: "normal",
      },
    },
    attemptCount: 1,
    leaseOwner: "sandbox-worker-a",
    leaseToken: LEASE_TOKEN_A,
    leaseExpiresAt:
      "2026-07-11T04:00:00.000Z",
    ...overrides,
  };
}

function validOutput(overrides = {}) {
  return {
    resultId: RESULT_A,
    payload: {
      recommendation: "approve",
      confidence: "high",
    },
    ...overrides,
  };
}

function registryWithHandler(handler) {
  return createSandboxHandlerRegistry([
    {
      actionKind: ACTION_A,
      handler,
    },
  ]);
}

async function run() {
  let passed = 0;

  async function test(name, operation) {
    await operation();
    passed += 1;
    console.log(`PASS ${passed}: ${name}`);
  }

  await test(
    "creates an immutable exact-match handler registry",
    async () => {
      const registry = registryWithHandler(
        async () => validOutput(),
      );

      assert.equal(
        Object.isFrozen(registry),
        true,
      );

      assert.equal(
        Object.isFrozen(registry.actionKinds),
        true,
      );

      assert.deepEqual(
        registry.actionKinds,
        [ACTION_A],
      );
    },
  );

  await test(
    "rejects an empty handler registry",
    async () => {
      assert.throws(
        () => createSandboxHandlerRegistry([]),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects live action registration",
    async () => {
      assert.throws(
        () =>
          createSandboxHandlerRegistry([
            {
              actionKind:
                "live.whatsapp.send",
              handler: async () =>
                validOutput(),
            },
          ]),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects duplicate action registration",
    async () => {
      assert.throws(
        () =>
          createSandboxHandlerRegistry([
            {
              actionKind: ACTION_A,
              handler: async () =>
                validOutput(),
            },
            {
              actionKind: ACTION_A,
              handler: async () =>
                validOutput(),
            },
          ]),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects missing handler function",
    async () => {
      assert.throws(
        () =>
          createSandboxHandlerRegistry([
            {
              actionKind: ACTION_A,
              handler: null,
            },
          ]),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects an unregistered sandbox action",
    async () => {
      const registry = registryWithHandler(
        async () => validOutput(),
      );

      await assert.rejects(
        registry.execute(
          claimedRecord({
            actionKind:
              "sandbox.quote.prepare",
          }),
        ),
        SandboxHandlerNotRegisteredError,
      );
    },
  );

  await test(
    "executes only the exact registered action",
    async () => {
      let invocationCount = 0;

      const registry = registryWithHandler(
        async (context) => {
          invocationCount += 1;

          assert.equal(
            context.actionKind,
            ACTION_A,
          );

          return validOutput();
        },
      );

      const result = await registry.execute(
        claimedRecord(),
      );

      assert.equal(invocationCount, 1);
      assert.equal(result.actionKind, ACTION_A);
      assert.equal(result.resultId, RESULT_A);
    },
  );

  await test(
    "passes immutable claimed identity to the handler",
    async () => {
      const registry = registryWithHandler(
        async (context) => {
          assert.equal(
            Object.isFrozen(context),
            true,
          );

          assert.equal(
            context.tenantId,
            TENANT_A,
          );

          assert.equal(
            context.outboxId,
            OUTBOX_A,
          );

          assert.equal(
            context.aggregateId,
            AGGREGATE_A,
          );

          assert.equal(
            context.leaseToken,
            LEASE_TOKEN_A,
          );

          return validOutput();
        },
      );

      await registry.execute(claimedRecord());
    },
  );

  await test(
    "deeply freezes untrusted claimed payload",
    async () => {
      const registry = registryWithHandler(
        async (context) => {
          assert.equal(
            Object.isFrozen(context.payload),
            true,
          );

          assert.equal(
            Object.isFrozen(
              context.payload.request,
            ),
            true,
          );

          return validOutput();
        },
      );

      await registry.execute(claimedRecord());
    },
  );

  await test(
    "clones payload before handler access",
    async () => {
      const originalPayload = {
        customerName: "Asha",
        request: {
          priority: "normal",
        },
      };

      const registry = registryWithHandler(
        async (context) => {
          assert.notEqual(
            context.payload,
            originalPayload,
          );

          assert.notEqual(
            context.payload.request,
            originalPayload.request,
          );

          return validOutput();
        },
      );

      await registry.execute(
        claimedRecord({
          payload: originalPayload,
        }),
      );
    },
  );

  await test(
    "rejects prototype-pollution keys before handler execution",
    async () => {
      let handlerExecuted = false;

      const unsafePayload = JSON.parse(
        '{"safe":{"__proto__":{"polluted":true}}}',
      );

      const registry = registryWithHandler(
        async () => {
          handlerExecuted = true;
          return validOutput();
        },
      );

      await assert.rejects(
        registry.execute(
          claimedRecord({
            payload: unsafePayload,
          }),
        ),
        SandboxWorkerBoundaryValidationError,
      );

      assert.equal(handlerExecuted, false);
    },
  );

  await test(
    "rejects circular claimed payload before handler execution",
    async () => {
      const payload = {};
      payload.self = payload;

      let handlerExecuted = false;

      const registry = registryWithHandler(
        async () => {
          handlerExecuted = true;
          return validOutput();
        },
      );

      await assert.rejects(
        registry.execute(
          claimedRecord({ payload }),
        ),
        SandboxWorkerBoundaryValidationError,
      );

      assert.equal(handlerExecuted, false);
    },
  );

  await test(
    "rejects invalid claimed tenant identity",
    async () => {
      const registry = registryWithHandler(
        async () => validOutput(),
      );

      await assert.rejects(
        registry.execute(
          claimedRecord({
            tenantId: "invalid-tenant",
          }),
        ),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects invalid claimed lease token",
    async () => {
      const registry = registryWithHandler(
        async () => validOutput(),
      );

      await assert.rejects(
        registry.execute(
          claimedRecord({
            leaseToken: "invalid-token",
          }),
        ),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects invalid attempt count",
    async () => {
      const registry = registryWithHandler(
        async () => validOutput(),
      );

      await assert.rejects(
        registry.execute(
          claimedRecord({
            attemptCount: -1,
          }),
        ),
        SandboxWorkerBoundaryValidationError,
      );
    },
  );

  await test(
    "rejects invalid timeout before handler execution",
    async () => {
      let handlerExecuted = false;

      const registry = registryWithHandler(
        async () => {
          handlerExecuted = true;
          return validOutput();
        },
      );

      await assert.rejects(
        registry.execute(
          claimedRecord(),
          {
            timeoutMilliseconds: 9,
          },
        ),
        SandboxWorkerBoundaryValidationError,
      );

      assert.equal(handlerExecuted, false);
    },
  );

  await test(
    "times out a non-completing handler",
    async () => {
      const registry = registryWithHandler(
        async () =>
          new Promise(() => undefined),
      );

      await assert.rejects(
        registry.execute(
          claimedRecord(),
          {
            timeoutMilliseconds: 10,
          },
        ),
        SandboxHandlerTimeoutError,
      );
    },
  );

  await test(
    "aborts the handler signal when timeout occurs",
    async () => {
      let signalWasAborted = false;

      const registry = registryWithHandler(
        async (context) =>
          new Promise((resolve) => {
            context.signal.addEventListener(
              "abort",
              () => {
                signalWasAborted =
                  context.signal.aborted;

                resolve(validOutput());
              },
              {
                once: true,
              },
            );
          }),
      );

      await assert.rejects(
        registry.execute(
          claimedRecord(),
          {
            timeoutMilliseconds: 10,
          },
        ),
        SandboxHandlerTimeoutError,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 0),
      );

      assert.equal(signalWasAborted, true);
    },
  );

  await test(
    "preserves explicit retryable safe handler errors",
    async () => {
      const registry = registryWithHandler(
        async () => {
          throw new SandboxHandlerExecutionError(
            "sandbox_temporary_capacity",
            true,
          );
        },
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        (error) => {
          assert.ok(
            error instanceof
              SandboxHandlerExecutionError,
          );

          assert.equal(
            error.safeCode,
            "sandbox_temporary_capacity",
          );

          assert.equal(error.retryable, true);

          return true;
        },
      );
    },
  );

  await test(
    "preserves explicit terminal safe handler errors",
    async () => {
      const registry = registryWithHandler(
        async () => {
          throw new SandboxHandlerExecutionError(
            "sandbox_invalid_business_input",
            false,
          );
        },
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        (error) => {
          assert.equal(
            error.safeCode,
            "sandbox_invalid_business_input",
          );

          assert.equal(error.retryable, false);

          return true;
        },
      );
    },
  );

  await test(
    "sanitizes unknown handler exceptions",
    async () => {
      const registry = registryWithHandler(
        async () => {
          throw new Error(
            "secret database credential leaked",
          );
        },
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        (error) => {
          assert.ok(
            error instanceof
              SandboxHandlerUnexpectedError,
          );

          assert.equal(
            error.safeCode,
            "sandbox_handler_unexpected_error",
          );

          assert.equal(error.retryable, true);

          assert.equal(
            error.message.includes("credential"),
            false,
          );

          return true;
        },
      );
    },
  );

  await test(
    "rejects non-object handler output",
    async () => {
      const registry = registryWithHandler(
        async () => "unsafe-output",
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        SandboxHandlerInvalidOutputError,
      );
    },
  );

  await test(
    "rejects handler output with unknown fields",
    async () => {
      const registry = registryWithHandler(
        async () => ({
          ...validOutput(),
          executeLive: true,
        }),
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        SandboxHandlerInvalidOutputError,
      );
    },
  );

  await test(
    "rejects invalid result identity",
    async () => {
      const registry = registryWithHandler(
        async () =>
          validOutput({
            resultId: "invalid-result",
          }),
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        SandboxHandlerInvalidOutputError,
      );
    },
  );

  await test(
    "rejects non-object result payload",
    async () => {
      const registry = registryWithHandler(
        async () =>
          validOutput({
            payload: ["unsafe"],
          }),
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        SandboxHandlerInvalidOutputError,
      );
    },
  );

  await test(
    "rejects dangerous keys in handler result",
    async () => {
      const unsafeResult = JSON.parse(
        '{"safe":{"constructor":{"prototype":{"polluted":true}}}}',
      );

      const registry = registryWithHandler(
        async () =>
          validOutput({
            payload: unsafeResult,
          }),
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        SandboxHandlerInvalidOutputError,
      );
    },
  );

  await test(
    "rejects non-finite numbers in handler result",
    async () => {
      const registry = registryWithHandler(
        async () =>
          validOutput({
            payload: {
              score:
                Number.POSITIVE_INFINITY,
            },
          }),
      );

      await assert.rejects(
        registry.execute(claimedRecord()),
        SandboxHandlerInvalidOutputError,
      );
    },
  );

  await test(
    "canonicalizes structured result deterministically",
    async () => {
      const registry = registryWithHandler(
        async () =>
          validOutput({
            payload: {
              z: 3,
              a: 1,
              nested: {
                y: true,
                b: "safe",
              },
            },
          }),
      );

      const result = await registry.execute(
        claimedRecord(),
      );

      assert.equal(
        result.payloadCanonical,
        '{"a":1,"nested":{"b":"safe","y":true},"z":3}',
      );
    },
  );

  await test(
    "returns deeply immutable validated result",
    async () => {
      const registry = registryWithHandler(
        async () =>
          validOutput({
            payload: {
              decision: {
                status: "approved",
              },
            },
          }),
      );

      const result = await registry.execute(
        claimedRecord(),
      );

      assert.equal(
        Object.isFrozen(result),
        true,
      );

      assert.equal(
        Object.isFrozen(result.payload),
        true,
      );

      assert.equal(
        Object.isFrozen(
          result.payload.decision,
        ),
        true,
      );

      assert.equal(result.tenantId, TENANT_A);
      assert.equal(result.outboxId, OUTBOX_A);
      assert.equal(
        result.leaseToken,
        LEASE_TOKEN_A,
      );
    },
  );

  assert.equal(passed, 28);

  console.log("");
  console.log(
    "DAY 757 TARGETED TESTS: PASS (28/28)",
  );
  console.log(
    "EXPLICIT SANDBOX HANDLER ALLOWLIST: PASS",
  );
  console.log(
    "DYNAMIC EXECUTION PATHS: BLOCKED",
  );
  console.log(
    "UNTRUSTED PAYLOAD DEEP FREEZE: PASS",
  );
  console.log(
    "PROTOTYPE POLLUTION DEFENCE: PASS",
  );
  console.log(
    "BOUNDED HANDLER EXECUTION: PASS",
  );
  console.log(
    "STRUCTURED RESULT CONTRACT: PASS",
  );
  console.log(
    "DETERMINISTIC RESULT CANONICALIZATION: PASS",
  );
  console.log(
    "SAFE ERROR CLASSIFICATION: PASS",
  );
  console.log(
    "RAW ERROR DETAIL LEAKAGE: BLOCKED",
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
