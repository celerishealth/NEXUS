const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day771-compiled",
);

const {
  createPostgresAuditedInternalPilotSandboxWorkerRoute,
  PostgresAuditedInternalPilotRouteError,
} = require(
  path.join(
    compiledDirectory,
    "postgresAuditedInternalPilotSandboxWorkerRoute.js",
  ),
);

const {
  createInternalPilotCsrfDigest,
} = require(
  path.join(
    compiledDirectory,
    "internalPilotSandboxWorkerRoute.js",
  ),
);

const {
  createInternalPilotSessionTokenDigest,
} = require(
  path.join(
    compiledDirectory,
    "postgresInternalPilotSessionResolver.js",
  ),
);

const checks = [];

function check(name, run) {
  checks.push({ name, run });
}

const fixedNow = new Date(
  "2026-07-11T15:00:00.000Z",
);

const sessionToken =
  "session-token-771-abcdefghijklmnopqrstuvwxyz";

const csrfToken =
  "csrf-token-771-abcdefghijklmnopqrstuvwxyz";

const sessionDigest =
  createInternalPilotSessionTokenDigest(
    sessionToken,
  );

const csrfDigest =
  createInternalPilotCsrfDigest(
    csrfToken,
  );

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseSessionRow(overrides = {}) {
  return {
    tenant_id: "tenant-a",
    session_id: "session-771-0001",
    session_digest: sessionDigest,
    actor_id: "owner-771",
    role: "owner",
    owner_approval_granted: true,
    csrf_token_digest: csrfDigest,
    expires_at:
      "2026-07-11T16:00:00.000Z",
    ...overrides,
  };
}

function baseCommand(overrides = {}) {
  return {
    tenantId: "tenant-a",
    requestId: "request-771-0001",
    idempotencyKey: "idem-771-0001",
    batchSize: 2,
    requestedAt:
      "2026-07-11T15:00:00.000Z",
    executionMode: "sandbox",
    ...overrides,
  };
}

function baseRequest(
  command = baseCommand(),
  overrides = {},
) {
  return {
    method: "POST",
    headers: {
      origin: "https://pilot.nexus.test",
      cookie:
        `nexus_internal_pilot_session=${sessionToken}`,
      "content-type": "application/json",
      "x-nexus-internal-pilot":
        "sandbox-v1",
      "x-nexus-idempotency-key":
        command.idempotencyKey,
      "x-nexus-csrf-token": csrfToken,
    },
    bodyText: JSON.stringify(command),
    ...overrides,
  };
}

function baseCycleResult(overrides = {}) {
  return {
    tenantId: "tenant-a",
    recoveredLeaseCount: 0,
    claimedCount: 1,
    completedCount: 1,
    retryScheduledCount: 0,
    terminalFailedCount: 0,
    outcomes: [],
    ownerApprovalRequired: true,
    liveProviderExecution: "blocked",
    externalDelivery: "blocked",
    paymentExecution: "blocked",
    publicLaunch: "blocked",
    ...overrides,
  };
}

function createSessionDatabase(options = {}) {
  const queries = [];

  const sessionQuery = async (
    text,
    values = [],
  ) => {
    queries.push({
      text,
      values: clone(values),
    });

    if (options.fail) {
      throw new Error(
        "session postgres password=raw-secret failed",
      );
    }

    if (options.result) {
      return options.result(text, values);
    }

    return {
      rows: [
        baseSessionRow(
          options.rowOverrides || {},
        ),
      ],
      rowCount: 1,
    };
  };

  return {
    sessionQuery,
    sessionQueries: queries,
  };
}

function createReceiptDatabase(options = {}) {
  const records = new Map();
  const queries = [];
  let transactionCount = 0;

  function keyOf(tenantId, idempotencyKey) {
    return `${tenantId}::${idempotencyKey}`;
  }

  const client = {
    async query(text, values = []) {
      queries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day763:([a-z-]+)/,
        ) || []
      )[1];

      if (
        options.failQueryMarker &&
        marker === options.failQueryMarker
      ) {
        throw new Error(
          "receipt postgres password=raw-secret failed",
        );
      }

      if (marker === "claim-insert") {
        const [
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
          actorId,
          occurredAt,
        ] = values;

        const key = keyOf(
          tenantId,
          idempotencyKey,
        );

        if (records.has(key)) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        records.set(key, {
          tenant_id: tenantId,
          idempotency_key:
            idempotencyKey,
          request_id: requestId,
          request_digest:
            requestDigest,
          actor_id: actorId,
          state: "in_progress",
          attempt: 1,
          result_json: null,
          failure_code: null,
          created_at: occurredAt,
          updated_at: occurredAt,
        });

        return {
          rows: [],
          rowCount: 1,
        };
      }

      if (marker === "claim-select") {
        const [
          tenantId,
          idempotencyKey,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        return {
          rows: row
            ? [clone(row)]
            : [],
          rowCount: row ? 1 : 0,
        };
      }

      if (marker === "claim-retry") {
        const [
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
          row.state !== "failed" ||
          row.attempt >= 100
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "in_progress";
        row.attempt += 1;
        row.result_json = null;
        row.failure_code = null;
        row.updated_at = occurredAt;

        return {
          rows: [
            {
              attempt: row.attempt,
            },
          ],
          rowCount: 1,
        };
      }

      if (marker === "complete") {
        const [
          serializedResult,
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
          row.state !== "in_progress"
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "completed";
        row.result_json =
          JSON.parse(serializedResult);
        row.failure_code = null;
        row.updated_at = occurredAt;

        return {
          rows: [],
          rowCount: 1,
        };
      }

      if (marker === "fail") {
        const [
          failureCode,
          occurredAt,
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
        ] = values;

        const row = records.get(
          keyOf(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
          row.state !== "in_progress"
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.state = "failed";
        row.result_json = null;
        row.failure_code =
          failureCode;
        row.updated_at = occurredAt;

        return {
          rows: [],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown receipt query marker: ${marker}`,
      );
    },
  };

  const withReceiptTransaction =
    async (work) => {
      transactionCount += 1;
      return work(client);
    };

  return {
    receiptRecords: records,
    receiptQueries: queries,
    receiptKeyOf: keyOf,
    withReceiptTransaction,
    getReceiptTransactionCount:
      () => transactionCount,
  };
}

function createAuditDatabase(options = {}) {
  const records = new Map();
  const queries = [];
  let transactionCount = 0;
  let insertCount = 0;

  function keyOf(tenantId, requestId) {
    return `${tenantId}::${requestId}`;
  }

  const client = {
    async query(text, values = []) {
      queries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day770:([a-z-]+)/,
        ) || []
      )[1];

      if (
        options.failQueryMarker &&
        marker === options.failQueryMarker
      ) {
        throw new Error(
          "audit postgres password=raw-secret failed",
        );
      }

      if (marker === "audit-select") {
        const [tenantId, requestId] =
          values;

        const list =
          records.get(
            keyOf(tenantId, requestId),
          ) || [];

        const latest =
          list.length > 0
            ? list[list.length - 1]
            : null;

        return {
          rows: latest
            ? [
                {
                  tenant_id:
                    latest.tenant_id,
                  request_id:
                    latest.request_id,
                  sequence_no:
                    latest.sequence_no,
                  actor_id:
                    latest.actor_id,
                  request_digest:
                    latest.request_digest,
                  stage: latest.stage,
                  failure_code:
                    latest.failure_code,
                  record_hash:
                    latest.record_hash,
                },
              ]
            : [],
          rowCount: latest ? 1 : 0,
        };
      }

      if (marker === "audit-insert") {
        insertCount += 1;

        if (
          options.failInsertAt ===
          insertCount
        ) {
          throw new Error(
            "audit insert password=raw-secret failed",
          );
        }

        const [
          tenantId,
          requestId,
          sequenceNo,
          actorId,
          requestDigest,
          stage,
          failureCode,
          previousHash,
          recordHash,
          occurredAt,
        ] = values;

        const key = keyOf(
          tenantId,
          requestId,
        );

        const list =
          records.get(key) || [];

        list.push({
          tenant_id: tenantId,
          request_id: requestId,
          sequence_no: sequenceNo,
          actor_id: actorId,
          request_digest:
            requestDigest,
          stage,
          failure_code:
            failureCode,
          previous_hash:
            previousHash,
          record_hash: recordHash,
          occurred_at: occurredAt,
        });

        records.set(key, list);

        return {
          rows: [
            {
              sequence_no: sequenceNo,
              record_hash: recordHash,
            },
          ],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown audit query marker: ${marker}`,
      );
    },
  };

  const withAuditTransaction =
    async (work) => {
      transactionCount += 1;
      return work(client);
    };

  return {
    auditRecords: records,
    auditQueries: queries,
    auditKeyOf: keyOf,
    withAuditTransaction,
    getAuditTransactionCount:
      () => transactionCount,
  };
}

function makeHarness(options = {}) {
  const sessionDatabase =
    createSessionDatabase(
      options.sessionOptions || {},
    );

  const receiptDatabase =
    createReceiptDatabase(
      options.receiptOptions || {},
    );

  const auditDatabase =
    createAuditDatabase(
      options.auditOptions || {},
    );

  const cycleCalls = [];

  const runCycle = async (
    poolInput,
    contextInput,
    cycleInput,
  ) => {
    cycleCalls.push({
      poolInput: clone(poolInput),
      contextInput:
        clone(contextInput),
      cycleInput: clone(cycleInput),
    });

    if (options.runCycle) {
      return options.runCycle(
        poolInput,
        contextInput,
        cycleInput,
      );
    }

    return baseCycleResult();
  };

  const route =
    createPostgresAuditedInternalPilotSandboxWorkerRoute({
      tenantId: "tenant-a",
      allowedOrigins: [
        "https://pilot.nexus.test",
      ],
      sessionQuery:
        sessionDatabase.sessionQuery,
      withReceiptTransaction:
        receiptDatabase.withReceiptTransaction,
      withAuditTransaction:
        auditDatabase.withAuditTransaction,
      maxBodyBytes: 16_384,
      now: () => new Date(fixedNow),
      commandRuntime: {
        poolInput: {
          trustedPool: true,
        },
        contextInput: {
          trustedTenantContext: true,
        },
        cycleInput: {
          registry: {
            recommendation:
              async () => ({}),
          },
          leaseOwner: "worker-771",
          leaseToken:
            "lease-token-771",
          leaseSeconds: 30,
          handlerTimeoutMilliseconds:
            1000,
          retryDelaySeconds: 10,
          maxAttempts: 3,
        },
        maxBatchSize: 5,
        requestMaxAgeSeconds: 300,
        futureClockSkewSeconds: 30,
        runCycle,
      },
    });

  return {
    route,
    cycleCalls,
    ...sessionDatabase,
    ...receiptDatabase,
    ...auditDatabase,
  };
}

check("invalid audited route configuration is rejected", async () => {
  assert.throws(
    () =>
      createPostgresAuditedInternalPilotSandboxWorkerRoute({
        tenantId: "tenant-a",
        allowedOrigins: [
          "https://pilot.nexus.test",
        ],
        commandRuntime: {},
      }),
    (error) => {
      assert.ok(
        error instanceof
          PostgresAuditedInternalPilotRouteError,
      );

      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("external audit appender injection is forbidden", async () => {
  assert.throws(
    () =>
      createPostgresAuditedInternalPilotSandboxWorkerRoute({
        tenantId: "tenant-a",
        allowedOrigins: [
          "https://pilot.nexus.test",
        ],
        sessionQuery: async () => ({
          rows: [],
          rowCount: 0,
        }),
        withReceiptTransaction:
          async (work) =>
            work({ query: async () => ({
              rows: [],
              rowCount: 0,
            }) }),
        withAuditTransaction:
          async (work) =>
            work({ query: async () => ({
              rows: [],
              rowCount: 0,
            }) }),
        commandRuntime: {
          appendAudit: async () => {},
        },
      }),
    (error) => {
      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );
      return true;
    },
  );
});

check("valid request completes audited production route", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
});

check("session lookup remains tenant and digest bound", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.equal(
    harness.sessionQueries[0].values[0],
    "tenant-a",
  );

  assert.equal(
    harness.sessionQueries[0].values[1],
    sessionDigest,
  );
});

check("successful route executes sandbox worker once", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  assert.equal(
    harness.cycleCalls.length,
    1,
  );
});

check("successful route completes durable receipt", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const receipt =
    harness.receiptRecords.get(
      harness.receiptKeyOf(
        "tenant-a",
        "idem-771-0001",
      ),
    );

  assert.equal(
    receipt.state,
    "completed",
  );
});

check("successful route stores authorization and completion audit", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const audit =
    harness.auditRecords.get(
      harness.auditKeyOf(
        "tenant-a",
        "request-771-0001",
      ),
    );

  assert.deepEqual(
    audit.map((record) => record.stage),
    ["authorized", "completed"],
  );
});

check("terminal audit record is hash chained to authorization", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const audit =
    harness.auditRecords.get(
      harness.auditKeyOf(
        "tenant-a",
        "request-771-0001",
      ),
    );

  assert.equal(
    audit[1].previous_hash,
    audit[0].record_hash,
  );

  assert.match(
    audit[0].record_hash,
    /^[a-f0-9]{64}$/,
  );
});

check("audit records preserve tenant actor and request digest binding", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  const audit =
    harness.auditRecords.get(
      harness.auditKeyOf(
        "tenant-a",
        "request-771-0001",
      ),
    );

  for (const record of audit) {
    assert.equal(
      record.tenant_id,
      "tenant-a",
    );

    assert.equal(
      record.actor_id,
      "owner-771",
    );

    assert.equal(
      record.request_digest,
      response.body.requestDigest,
    );
  }
});

check("completed replay returns identical durable response", async () => {
  const harness = makeHarness();

  const first = await harness.route(
    baseRequest(),
  );

  const second = await harness.route(
    baseRequest(),
  );

  assert.deepEqual(
    second.body,
    first.body,
  );
});

check("completed replay does not duplicate worker or audit execution", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());
  await harness.route(baseRequest());

  const audit =
    harness.auditRecords.get(
      harness.auditKeyOf(
        "tenant-a",
        "request-771-0001",
      ),
    );

  assert.equal(
    harness.cycleCalls.length,
    1,
  );

  assert.equal(audit.length, 2);
});

check("idempotency conflict is blocked without new audit chain", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  const changed = baseCommand({
    requestId:
      "request-771-0002",
    batchSize: 3,
  });

  const response = await harness.route(
    baseRequest(changed),
  );

  assert.equal(response.status, 409);

  assert.equal(
    response.body.error.code,
    "IDEMPOTENCY_CONFLICT",
  );

  assert.equal(
    harness.auditRecords.size,
    1,
  );
});

check("missing session cookie is blocked before receipt and audit access", async () => {
  const request = baseRequest();
  delete request.headers.cookie;

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 401);
  assert.equal(
    harness.getReceiptTransactionCount(),
    0,
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("non-owner database session is blocked before receipt and audit", async () => {
  const harness = makeHarness({
    sessionOptions: {
      rowOverrides: {
        role: "operator",
      },
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_ROLE_REQUIRED",
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("unapproved owner session is blocked before receipt and audit", async () => {
  const harness = makeHarness({
    sessionOptions: {
      rowOverrides: {
        owner_approval_granted:
          false,
      },
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "OWNER_APPROVAL_REQUIRED",
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("untrusted origin is blocked before session database access", async () => {
  const request = baseRequest();

  request.headers.origin =
    "https://attacker.example";

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 403);
  assert.equal(
    harness.sessionQueries.length,
    0,
  );
});

check("invalid CSRF token is blocked before receipt and audit access", async () => {
  const request = baseRequest();

  request.headers[
    "x-nexus-csrf-token"
  ] =
    "csrf-token-771-different-abcdefghijklmnop";

  const harness = makeHarness();

  const response = await harness.route(
    request,
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "CSRF_TOKEN_INVALID",
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("cross-tenant command request is blocked before receipt and audit", async () => {
  const command = baseCommand({
    tenantId: "tenant-b",
  });

  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(command),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "TENANT_MISMATCH",
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("live execution request is blocked before receipt and audit", async () => {
  const command = baseCommand({
    executionMode: "live",
  });

  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(command),
  );

  assert.equal(response.status, 403);
  assert.equal(
    response.body.error.code,
    "SANDBOX_EXECUTION_REQUIRED",
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("receipt claim failure blocks audit and worker execution", async () => {
  const harness = makeHarness({
    receiptOptions: {
      failQueryMarker:
        "claim-insert",
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "RECEIPT_UNAVAILABLE",
  );
  assert.equal(
    harness.cycleCalls.length,
    0,
  );
  assert.equal(
    harness.getAuditTransactionCount(),
    0,
  );
});

check("audit select failure is fail-closed before worker execution", async () => {
  const harness = makeHarness({
    auditOptions: {
      failQueryMarker:
        "audit-select",
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "AUDIT_UNAVAILABLE",
  );
  assert.equal(
    harness.cycleCalls.length,
    0,
  );

  const receipt =
    harness.receiptRecords.get(
      harness.receiptKeyOf(
        "tenant-a",
        "idem-771-0001",
      ),
    );

  assert.equal(receipt.state, "failed");
});

check("authorization audit insert failure is fail-closed", async () => {
  const harness = makeHarness({
    auditOptions: {
      failInsertAt: 1,
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "AUDIT_UNAVAILABLE",
  );
  assert.equal(
    harness.cycleCalls.length,
    0,
  );

  const receipt =
    harness.receiptRecords.get(
      harness.receiptKeyOf(
        "tenant-a",
        "idem-771-0001",
      ),
    );

  assert.equal(receipt.state, "failed");
});

check("raw worker failure creates authorized and failed audit chain", async () => {
  const harness = makeHarness({
    runCycle: async () => {
      throw new Error(
        "provider network secret=raw-secret",
      );
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "CYCLE_EXECUTION_FAILED",
  );

  const audit =
    harness.auditRecords.get(
      harness.auditKeyOf(
        "tenant-a",
        "request-771-0001",
      ),
    );

  assert.deepEqual(
    audit.map((record) => record.stage),
    ["authorized", "failed"],
  );

  assert.equal(
    audit[1].failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("raw worker failure persists failed durable receipt", async () => {
  const harness = makeHarness({
    runCycle: async () => {
      throw new Error(
        "provider network secret=raw-secret",
      );
    },
  });

  await harness.route(baseRequest());

  const receipt =
    harness.receiptRecords.get(
      harness.receiptKeyOf(
        "tenant-a",
        "idem-771-0001",
      ),
    );

  assert.equal(receipt.state, "failed");
  assert.equal(
    receipt.failure_code,
    "CYCLE_EXECUTION_FAILED",
  );
});

check("completion audit failure converts command to safe terminal failure", async () => {
  const harness = makeHarness({
    auditOptions: {
      failInsertAt: 2,
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(response.status, 503);
  assert.equal(
    response.body.error.code,
    "AUDIT_UNAVAILABLE",
  );

  const audit =
    harness.auditRecords.get(
      harness.auditKeyOf(
        "tenant-a",
        "request-771-0001",
      ),
    );

  assert.deepEqual(
    audit.map((record) => record.stage),
    ["authorized", "failed"],
  );

  const receipt =
    harness.receiptRecords.get(
      harness.receiptKeyOf(
        "tenant-a",
        "idem-771-0001",
      ),
    );

  assert.equal(receipt.state, "failed");
});

check("raw audit infrastructure details never reach HTTP response", async () => {
  const harness = makeHarness({
    auditOptions: {
      failQueryMarker:
        "audit-select",
    },
  });

  const response = await harness.route(
    baseRequest(),
  );

  assert.doesNotMatch(
    response.body.error.message,
    /postgres|password|raw-secret/i,
  );
});

check("all audit database operations remain tenant scoped", async () => {
  const harness = makeHarness();

  await harness.route(baseRequest());

  for (const query of harness.auditQueries) {
    assert.equal(
      query.values[0],
      "tenant-a",
    );
  }
});

check("production route returns strict security headers", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(
    response.headers["cache-control"],
    "no-store",
  );

  assert.equal(
    response.headers[
      "x-content-type-options"
    ],
    "nosniff",
  );

  assert.equal(
    response.headers[
      "content-security-policy"
    ],
    "default-src 'none'; frame-ancestors 'none'",
  );

  assert.equal(
    response.headers[
      "referrer-policy"
    ],
    "no-referrer",
  );
});

check("successful audited route preserves every sandbox boundary", async () => {
  const harness = makeHarness();

  const response = await harness.route(
    baseRequest(),
  );

  assert.equal(
    response.body.ownerApprovalRequired,
    true,
  );

  assert.equal(
    response.body.liveProviderExecution,
    "blocked",
  );

  assert.equal(
    response.body.externalDelivery,
    "blocked",
  );

  assert.equal(
    response.body.paymentExecution,
    "blocked",
  );

  assert.equal(
    response.body.publicLaunch,
    "blocked",
  );
});

(async () => {
  assert.equal(
    checks.length,
    28,
    `Expected 28 targeted checks, found ${checks.length}`,
  );

  let passed = 0;

  for (const item of checks) {
    try {
      await item.run();
      passed += 1;
      console.log(`PASS: ${item.name}`);
    } catch (error) {
      console.error(`FAIL: ${item.name}`);
      console.error(error);
      process.exitCode = 1;
      return;
    }
  }

  console.log(
    `TARGETED TESTS: PASS (${passed}/${checks.length})`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
