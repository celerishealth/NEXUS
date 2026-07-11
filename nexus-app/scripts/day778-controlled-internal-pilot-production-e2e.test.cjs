const assert = require("node:assert/strict");
const path = require("node:path");

const compiledDirectory = path.join(
  process.cwd(),
  ".day778-compiled",
);

const {
  createControlledInternalPilotProductionServer,
  ControlledInternalPilotProductionServerError,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotProductionServer.js",
  ),
);

const {
  createControlledInternalPilotOwnerConsole,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotOwnerConsole.js",
  ),
);

const {
  INTERNAL_PILOT_WORKER_ROUTE_PATH,
} = require(
  path.join(
    compiledDirectory,
    "controlledInternalPilotProductionApiRouter.js",
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const fixedNow = new Date(
  "2026-07-11T22:00:00.000Z",
);

const authoritySessionToken =
  "authority-session-token-778-abcdefghijklmnopqrstuvwxyz";

const authorityCsrfToken =
  "authority-csrf-token-778-abcdefghijklmnopqrstuvwxyz";

function createDeterministicRandom() {
  let counter = 20;

  return (size) => {
    const value = Buffer.alloc(
      size,
      counter,
    );

    counter += 1;
    return value;
  };
}

function createPersistentInfrastructure() {
  const sessions = new Map();
  const receipts = new Map();
  const audits = new Map();

  const sessionQueries = [];
  const lifecycleQueries = [];
  const receiptQueries = [];
  const auditQueries = [];
  const cycleCalls = [];

  let lifecycleTransactions = 0;
  let receiptTransactions = 0;
  let auditTransactions = 0;

  function sessionKey(
    tenantId,
    sessionId,
  ) {
    return `${tenantId}::${sessionId}`;
  }

  function receiptKey(
    tenantId,
    idempotencyKey,
  ) {
    return `${tenantId}::${idempotencyKey}`;
  }

  function auditKey(
    tenantId,
    requestId,
  ) {
    return `${tenantId}::${requestId}`;
  }

  sessions.set(
    sessionKey(
      "tenant-a",
      "session-778-authority",
    ),
    {
      tenant_id: "tenant-a",
      session_id:
        "session-778-authority",
      session_digest:
        createInternalPilotSessionTokenDigest(
          authoritySessionToken,
        ),
      actor_id: "owner-778",
      role: "owner",
      owner_approval_granted: true,
      csrf_token_digest:
        createInternalPilotCsrfDigest(
          authorityCsrfToken,
        ),
      expires_at:
        "2026-07-12T00:00:00.000Z",
      revoked_at: null,
      created_at:
        "2026-07-11T21:00:00.000Z",
      updated_at:
        "2026-07-11T21:00:00.000Z",
    },
  );

  const sessionQuery = async (
    text,
    values = [],
  ) => {
    sessionQueries.push({
      text,
      values: clone(values),
    });

    const [
      tenantId,
      sessionDigest,
      currentTime,
    ] = values;

    const row = [
      ...sessions.values(),
    ].find(
      (candidate) =>
        candidate.tenant_id ===
          tenantId &&
        candidate.session_digest ===
          sessionDigest &&
        candidate.revoked_at ===
          null &&
        new Date(
          candidate.expires_at,
        ).getTime() >
          new Date(
            currentTime,
          ).getTime(),
    );

    return {
      rows: row
        ? [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              session_digest:
                row.session_digest,
              actor_id:
                row.actor_id,
              role: row.role,
              owner_approval_granted:
                row.owner_approval_granted,
              csrf_token_digest:
                row.csrf_token_digest,
              expires_at:
                row.expires_at,
            },
          ]
        : [],
      rowCount: row ? 1 : 0,
    };
  };

  const lifecycleClient = {
    async query(text, values = []) {
      lifecycleQueries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day772:([a-z-]+)/,
        ) || []
      )[1];

      if (marker === "session-insert") {
        const [
          tenantId,
          sessionId,
          sessionDigest,
          actorId,
          csrfTokenDigest,
          expiresAt,
          issuedAt,
        ] = values;

        const row = {
          tenant_id: tenantId,
          session_id: sessionId,
          session_digest:
            sessionDigest,
          actor_id: actorId,
          role: "owner",
          owner_approval_granted:
            true,
          csrf_token_digest:
            csrfTokenDigest,
          expires_at: expiresAt,
          revoked_at: null,
          created_at: issuedAt,
          updated_at: issuedAt,
        };

        sessions.set(
          sessionKey(
            tenantId,
            sessionId,
          ),
          row,
        );

        return {
          rows: [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              actor_id:
                row.actor_id,
              role: row.role,
              owner_approval_granted:
                row.owner_approval_granted,
              expires_at:
                row.expires_at,
              revoked_at:
                row.revoked_at,
            },
          ],
          rowCount: 1,
        };
      }

      if (marker === "session-revoke") {
        const [
          tenantId,
          sessionId,
          actorId,
          revokedAt,
        ] = values;

        const row = sessions.get(
          sessionKey(
            tenantId,
            sessionId,
          ),
        );

        if (
          !row ||
          row.actor_id !== actorId ||
          row.revoked_at !== null
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        row.revoked_at = revokedAt;
        row.updated_at = revokedAt;

        return {
          rows: [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              actor_id:
                row.actor_id,
              revoked_at:
                row.revoked_at,
            },
          ],
          rowCount: 1,
        };
      }

      if (marker === "session-read") {
        const [
          tenantId,
          sessionId,
          actorId,
        ] = values;

        const row = sessions.get(
          sessionKey(
            tenantId,
            sessionId,
          ),
        );

        if (
          !row ||
          row.actor_id !== actorId
        ) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        return {
          rows: [
            {
              tenant_id:
                row.tenant_id,
              session_id:
                row.session_id,
              actor_id:
                row.actor_id,
              revoked_at:
                row.revoked_at,
            },
          ],
          rowCount: 1,
        };
      }

      throw new Error(
        `Unknown lifecycle marker: ${marker}`,
      );
    },
  };

  const receiptClient = {
    async query(text, values = []) {
      receiptQueries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day763:([a-z-]+)/,
        ) || []
      )[1];

      if (marker === "claim-insert") {
        const [
          tenantId,
          idempotencyKey,
          requestId,
          requestDigest,
          actorId,
          occurredAt,
        ] = values;

        const key = receiptKey(
          tenantId,
          idempotencyKey,
        );

        if (receipts.has(key)) {
          return {
            rows: [],
            rowCount: 0,
          };
        }

        receipts.set(key, {
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

        const row = receipts.get(
          receiptKey(
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

        const row = receipts.get(
          receiptKey(
            tenantId,
            idempotencyKey,
          ),
        );

        if (
          !row ||
          row.request_id !== requestId ||
          row.request_digest !==
            requestDigest ||
          row.state !== "failed"
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

        const row = receipts.get(
          receiptKey(
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

        const row = receipts.get(
          receiptKey(
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
        `Unknown receipt marker: ${marker}`,
      );
    },
  };

  const auditClient = {
    async query(text, values = []) {
      auditQueries.push({
        text,
        values: clone(values),
      });

      const marker = (
        text.match(
          /nexus-day770:([a-z-]+)/,
        ) || []
      )[1];

      if (marker === "audit-select") {
        const [
          tenantId,
          requestId,
        ] = values;

        const list =
          audits.get(
            auditKey(
              tenantId,
              requestId,
            ),
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
                  stage:
                    latest.stage,
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

        const key = auditKey(
          tenantId,
          requestId,
        );

        const list =
          audits.get(key) || [];

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
          record_hash:
            recordHash,
          occurred_at: occurredAt,
        });

        audits.set(key, list);

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
        `Unknown audit marker: ${marker}`,
      );
    },
  };

  return {
    sessions,
    receipts,
    audits,
    sessionQueries,
    lifecycleQueries,
    receiptQueries,
    auditQueries,
    cycleCalls,
    sessionKey,
    receiptKey,
    auditKey,
    sessionQuery,

    async withLifecycleTransaction(
      work,
    ) {
      lifecycleTransactions += 1;
      return work(lifecycleClient);
    },

    async withReceiptTransaction(
      work,
    ) {
      receiptTransactions += 1;
      return work(receiptClient);
    },

    async withAuditTransaction(
      work,
    ) {
      auditTransactions += 1;
      return work(auditClient);
    },

    getLifecycleTransactions() {
      return lifecycleTransactions;
    },

    getReceiptTransactions() {
      return receiptTransactions;
    },

    getAuditTransactions() {
      return auditTransactions;
    },

    async runCycle(
      poolInput,
      contextInput,
      cycleInput,
    ) {
      cycleCalls.push({
        poolInput: clone(poolInput),
        contextInput:
          clone(contextInput),
        cycleInput: {
          leaseOwner:
            cycleInput.leaseOwner,
          leaseToken:
            cycleInput.leaseToken,
        },
      });

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
      };
    },
  };
}

function createServer(
  infrastructure,
  tenantId = "tenant-a",
) {
  return createControlledInternalPilotProductionServer({
    tenantId,
    allowedOrigins: [
      "https://pilot.nexus.test",
    ],
    allowedHosts: [
      "pilot.nexus.test",
    ],
    sessionQuery:
      infrastructure.sessionQuery,
    withLifecycleTransaction:
      infrastructure.withLifecycleTransaction,
    withReceiptTransaction:
      infrastructure.withReceiptTransaction,
    withAuditTransaction:
      infrastructure.withAuditTransaction,
    now: () => new Date(fixedNow),
    randomBytes:
      infrastructure.randomBytes ||
      createDeterministicRandom(),
    maxCookieHeaderBytes: 4096,
    maxRouteBodyBytes: 16_384,
    maxRequestBodyBytes: 65_536,
    maxResponseBodyBytes: 65_536,
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
        leaseOwner:
          "worker-778",
        leaseToken:
          "lease-token-778",
        leaseSeconds: 30,
        handlerTimeoutMilliseconds:
          1000,
        retryDelaySeconds: 10,
        maxAttempts: 3,
      },
      maxBatchSize: 5,
      requestMaxAgeSeconds: 300,
      futureClockSkewSeconds: 30,
      runCycle:
        infrastructure.runCycle,
    },
  });
}

function createBrowserHarness(
  infrastructure,
) {
  infrastructure.randomBytes =
    createDeterministicRandom();

  let server =
    createServer(infrastructure);

  let cookieHeader =
    `nexus_internal_pilot_session=${authoritySessionToken}`;

  let issuedCsrfToken = null;
  let issuedCookie = null;

  const fetchCalls = [];

  async function browserFetch(
    input,
    init,
  ) {
    const headers =
      new Headers(init.headers);

    headers.set(
      "origin",
      "https://pilot.nexus.test",
    );

    if (cookieHeader) {
      headers.set(
        "cookie",
        cookieHeader,
      );
    }

    const request =
      new Request(
        `https://pilot.nexus.test${input}`,
        {
          ...init,
          headers,
        },
      );

    fetchCalls.push({
      path: input,
      body: init.body,
      headers:
        Object.fromEntries(
          headers.entries(),
        ),
    });

    const response =
      await server(request);

    const responseClone =
      response.clone();

    let responseBody = null;

    try {
      responseBody =
        await responseClone.json();
    } catch {
      responseBody = null;
    }

    const setCookie =
      response.headers.get(
        "set-cookie",
      );

    if (setCookie) {
      const firstPart =
        setCookie.split(";")[0];

      const separator =
        firstPart.indexOf("=");

      const name =
        firstPart.slice(
          0,
          separator,
        );

      const value =
        firstPart.slice(
          separator + 1,
        );

      if (value === "") {
        cookieHeader = "";
      } else {
        cookieHeader =
          `${name}=${value}`;

        issuedCookie =
          cookieHeader;
      }
    }

    if (
      responseBody &&
      responseBody.operation ===
        "issue"
    ) {
      issuedCsrfToken =
        responseBody.csrfToken;
    }

    return response;
  }

  const ownerConsole =
    createControlledInternalPilotOwnerConsole({
      tenantId: "tenant-a",
      authorityCsrfToken,
      fetch: browserFetch,
      now: () =>
        new Date(fixedNow),
      createRequestId: () =>
        "request-778-0001",
      createIdempotencyKey: () =>
        "idem-778-0001",
      maxBatchSize: 5,
    });

  return {
    ownerConsole,
    fetchCalls,

    restartServer() {
      server =
        createServer(
          infrastructure,
        );
    },

    getCookieHeader() {
      return cookieHeader;
    },

    getIssuedCookie() {
      return issuedCookie;
    },

    getIssuedCsrfToken() {
      return issuedCsrfToken;
    },

    async callWithOldSession(
      cookie,
      csrfToken,
    ) {
      const command = {
        tenantId: "tenant-a",
        requestId:
          "request-778-after-revoke",
        idempotencyKey:
          "idem-778-after-revoke",
        batchSize: 1,
        requestedAt:
          fixedNow.toISOString(),
        executionMode: "sandbox",
      };

      return server(
        new Request(
          "https://pilot.nexus.test" +
          INTERNAL_PILOT_WORKER_ROUTE_PATH,
          {
            method: "POST",
            headers: {
              origin:
                "https://pilot.nexus.test",
              cookie,
              "content-type":
                "application/json",
              "x-nexus-internal-pilot":
                "sandbox-v1",
              "x-nexus-csrf-token":
                csrfToken,
              "x-nexus-idempotency-key":
                command.idempotencyKey,
            },
            body:
              JSON.stringify(command),
          },
        ),
      );
    },
  };
}

async function setupCompletedRun() {
  const infrastructure =
    createPersistentInfrastructure();

  const browser =
    createBrowserHarness(
      infrastructure,
    );

  await browser.ownerConsole.issueSession({
    ttlSeconds: 3600,
  });

  const completed =
    await browser.ownerConsole.runSandboxCycle({
      batchSize: 2,
    });

  return {
    infrastructure,
    browser,
    completed,
  };
}

check("invalid production server configuration is rejected", async () => {
  assert.throws(
    () =>
      createControlledInternalPilotProductionServer({
        tenantId: "tenant-a",
      }),
    (error) => {
      assert.ok(
        error instanceof
          ControlledInternalPilotProductionServerError,
      );

      assert.equal(
        error.code,
        "INVALID_CONFIGURATION",
      );

      return true;
    },
  );
});

check("external command audit authority injection is blocked", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  assert.throws(
    () =>
      createControlledInternalPilotProductionServer({
        tenantId: "tenant-a",
        allowedOrigins: [
          "https://pilot.nexus.test",
        ],
        allowedHosts: [
          "pilot.nexus.test",
        ],
        sessionQuery:
          infrastructure.sessionQuery,
        withLifecycleTransaction:
          infrastructure.withLifecycleTransaction,
        withReceiptTransaction:
          infrastructure.withReceiptTransaction,
        withAuditTransaction:
          infrastructure.withAuditTransaction,
        commandRuntime: {
          appendAudit:
            async () => {},
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

check("trusted authority issues session through full production stack", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  const browser =
    createBrowserHarness(
      infrastructure,
    );

  const snapshot =
    await browser.ownerConsole.issueSession({
      ttlSeconds: 3600,
    });

  assert.equal(
    snapshot.phase,
    "session-ready",
  );

  assert.equal(
    snapshot.activeSessionId !== null,
    true,
  );
});

check("issued session persists in shared database", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  const browser =
    createBrowserHarness(
      infrastructure,
    );

  const snapshot =
    await browser.ownerConsole.issueSession({
      ttlSeconds: 3600,
    });

  assert.equal(
    infrastructure.sessions.has(
      infrastructure.sessionKey(
        "tenant-a",
        snapshot.activeSessionId,
      ),
    ),
    true,
  );
});

check("issued session database stores digest instead of raw token", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  const browser =
    createBrowserHarness(
      infrastructure,
    );

  await browser.ownerConsole.issueSession({
    ttlSeconds: 3600,
  });

  const issuedCookie =
    browser.getIssuedCookie();

  const rawToken =
    issuedCookie.split("=")[1];

  const databaseText =
    JSON.stringify(
      [...infrastructure.sessions.values()],
    );

  assert.doesNotMatch(
    databaseText,
    new RegExp(rawToken),
  );

  assert.match(
    databaseText,
    new RegExp(
      createInternalPilotSessionTokenDigest(
        rawToken,
      ),
    ),
  );
});

check("issued session remains tenant and owner bound", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  const browser =
    createBrowserHarness(
      infrastructure,
    );

  const snapshot =
    await browser.ownerConsole.issueSession({
      ttlSeconds: 3600,
    });

  const row =
    infrastructure.sessions.get(
      infrastructure.sessionKey(
        "tenant-a",
        snapshot.activeSessionId,
      ),
    );

  assert.equal(
    row.tenant_id,
    "tenant-a",
  );

  assert.equal(
    row.actor_id,
    "owner-778",
  );

  assert.equal(
    row.owner_approval_granted,
    true,
  );
});

check("owner completes full audited sandbox worker cycle", async () => {
  const {
    completed,
  } = await setupCompletedRun();

  assert.equal(
    completed.phase,
    "completed",
  );

  assert.equal(
    completed.lastRun.replay,
    false,
  );

  assert.equal(
    completed.lastRun.result.completedCount,
    1,
  );
});

check("worker cycle executes exactly once on first request", async () => {
  const {
    infrastructure,
  } = await setupCompletedRun();

  assert.equal(
    infrastructure.cycleCalls.length,
    1,
  );
});

check("completed command receipt persists durably", async () => {
  const {
    infrastructure,
  } = await setupCompletedRun();

  const receipt =
    infrastructure.receipts.get(
      infrastructure.receiptKey(
        "tenant-a",
        "idem-778-0001",
      ),
    );

  assert.equal(
    receipt.state,
    "completed",
  );

  assert.equal(
    receipt.attempt,
    1,
  );
});

check("authorization and completion audit records persist", async () => {
  const {
    infrastructure,
  } = await setupCompletedRun();

  const audit =
    infrastructure.audits.get(
      infrastructure.auditKey(
        "tenant-a",
        "request-778-0001",
      ),
    );

  assert.deepEqual(
    audit.map(
      (record) => record.stage,
    ),
    [
      "authorized",
      "completed",
    ],
  );
});

check("persistent audit terminal record is hash chained", async () => {
  const {
    infrastructure,
  } = await setupCompletedRun();

  const audit =
    infrastructure.audits.get(
      infrastructure.auditKey(
        "tenant-a",
        "request-778-0001",
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

check("receipt and audit preserve trusted owner binding", async () => {
  const {
    infrastructure,
  } = await setupCompletedRun();

  const receipt =
    infrastructure.receipts.get(
      infrastructure.receiptKey(
        "tenant-a",
        "idem-778-0001",
      ),
    );

  const audit =
    infrastructure.audits.get(
      infrastructure.auditKey(
        "tenant-a",
        "request-778-0001",
      ),
    );

  assert.equal(
    receipt.actor_id,
    "owner-778",
  );

  assert.equal(
    audit[0].actor_id,
    "owner-778",
  );
});

check("server restart preserves issued session authentication", async () => {
  const {
    browser,
  } = await setupCompletedRun();

  browser.restartServer();

  const replay =
    await browser.ownerConsole.replayLastRun();

  assert.equal(
    replay.phase,
    "completed",
  );

  assert.equal(
    replay.lastRun.replay,
    true,
  );
});

check("restart replay reuses exact persisted command", async () => {
  const {
    browser,
  } = await setupCompletedRun();

  browser.restartServer();

  await browser.ownerConsole.replayLastRun();

  const workerCalls =
    browser.fetchCalls.filter(
      (call) =>
        call.path ===
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
    );

  assert.equal(
    workerCalls[0].body,
    workerCalls[1].body,
  );

  assert.equal(
    workerCalls[0].headers[
      "x-nexus-idempotency-key"
    ],
    workerCalls[1].headers[
      "x-nexus-idempotency-key"
    ],
  );
});

check("restart replay does not duplicate worker execution", async () => {
  const {
    infrastructure,
    browser,
  } = await setupCompletedRun();

  browser.restartServer();

  await browser.ownerConsole.replayLastRun();

  assert.equal(
    infrastructure.cycleCalls.length,
    1,
  );
});

check("restart replay does not duplicate durable audit records", async () => {
  const {
    infrastructure,
    browser,
  } = await setupCompletedRun();

  browser.restartServer();

  await browser.ownerConsole.replayLastRun();

  const audit =
    infrastructure.audits.get(
      infrastructure.auditKey(
        "tenant-a",
        "request-778-0001",
      ),
    );

  assert.equal(
    audit.length,
    2,
  );
});

check("restart replay keeps receipt completed without new attempt", async () => {
  const {
    infrastructure,
    browser,
  } = await setupCompletedRun();

  browser.restartServer();

  await browser.ownerConsole.replayLastRun();

  const receipt =
    infrastructure.receipts.get(
      infrastructure.receiptKey(
        "tenant-a",
        "idem-778-0001",
      ),
    );

  assert.equal(
    receipt.state,
    "completed",
  );

  assert.equal(
    receipt.attempt,
    1,
  );
});

check("owner console clearly reports restart replay", async () => {
  const {
    browser,
  } = await setupCompletedRun();

  browser.restartServer();

  const snapshot =
    await browser.ownerConsole.replayLastRun();

  assert.match(
    snapshot.statusMessage,
    /replay verified/i,
  );
});

check("session revocation persists through production stack", async () => {
  const {
    infrastructure,
    browser,
    completed,
  } = await setupCompletedRun();

  const sessionId =
    completed.activeSessionId;

  const snapshot =
    await browser.ownerConsole.revokeSession();

  const row =
    infrastructure.sessions.get(
      infrastructure.sessionKey(
        "tenant-a",
        sessionId,
      ),
    );

  assert.equal(
    snapshot.phase,
    "revoked",
  );

  assert.notEqual(
    row.revoked_at,
    null,
  );
});

check("session revocation clears browser cookie", async () => {
  const {
    browser,
  } = await setupCompletedRun();

  await browser.ownerConsole.revokeSession();

  assert.equal(
    browser.getCookieHeader(),
    "",
  );
});

check("revoked session remains rejected after server restart", async () => {
  const {
    browser,
  } = await setupCompletedRun();

  const oldCookie =
    browser.getIssuedCookie();

  const issuedCsrf =
    browser.getIssuedCsrfToken();

  await browser.ownerConsole.revokeSession();

  browser.restartServer();

  const response =
    await browser.callWithOldSession(
      oldCookie,
      issuedCsrf,
    );

  const body =
    await response.json();

  assert.equal(
    response.status,
    401,
  );

  assert.equal(
    body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
});

check("cross-tenant server cannot authenticate tenant A session", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  const tenantBServer =
    createServer(
      infrastructure,
      "tenant-b",
    );

  const command = {
    tenantId: "tenant-b",
    requestId:
      "request-778-tenant-b",
    idempotencyKey:
      "idem-778-tenant-b",
    batchSize: 1,
    requestedAt:
      fixedNow.toISOString(),
    executionMode: "sandbox",
  };

  const response =
    await tenantBServer(
      new Request(
        "https://pilot.nexus.test" +
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          method: "POST",
          headers: {
            origin:
              "https://pilot.nexus.test",
            cookie:
              `nexus_internal_pilot_session=${authoritySessionToken}`,
            "content-type":
              "application/json",
            "x-nexus-internal-pilot":
              "sandbox-v1",
            "x-nexus-csrf-token":
              authorityCsrfToken,
            "x-nexus-idempotency-key":
              command.idempotencyKey,
          },
          body:
            JSON.stringify(command),
        },
      ),
    );

  const body =
    await response.json();

  assert.equal(
    response.status,
    401,
  );

  assert.equal(
    body.error.code,
    "AUTHENTICATION_REQUIRED",
  );
});

check("client-forged identity is blocked at real Fetch boundary", async () => {
  const infrastructure =
    createPersistentInfrastructure();

  const server =
    createServer(infrastructure);

  const response =
    await server(
      new Request(
        "https://pilot.nexus.test" +
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
        {
          method: "POST",
          headers: {
            origin:
              "https://pilot.nexus.test",
            cookie:
              `nexus_internal_pilot_session=${authoritySessionToken}`,
            "content-type":
              "application/json",
            "x-nexus-internal-pilot":
              "sandbox-v1",
            "x-nexus-csrf-token":
              authorityCsrfToken,
            "x-nexus-actor-id":
              "attacker",
          },
          body: "{}",
        },
      ),
    );

  const body =
    await response.json();

  assert.equal(
    response.status,
    400,
  );

  assert.equal(
    body.error.code,
    "IDENTITY_HEADER_FORBIDDEN",
  );

  assert.equal(
    infrastructure.cycleCalls.length,
    0,
  );
});

check("owner workflow sends sandbox-only execution mode", async () => {
  const {
    browser,
  } = await setupCompletedRun();

  const workerCall =
    browser.fetchCalls.find(
      (call) =>
        call.path ===
        INTERNAL_PILOT_WORKER_ROUTE_PATH,
    );

  const command =
    JSON.parse(workerCall.body);

  assert.equal(
    command.executionMode,
    "sandbox",
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(
      command,
      "liveProviderExecution",
    ),
    false,
  );
});

check("full E2E result keeps owner approval locked", async () => {
  const {
    completed,
  } = await setupCompletedRun();

  assert.equal(
    completed.ownerApprovalRequired,
    true,
  );
});

check("full E2E result blocks live execution and external delivery", async () => {
  const {
    completed,
  } = await setupCompletedRun();

  assert.equal(
    completed.liveProviderExecution,
    "blocked",
  );

  assert.equal(
    completed.externalDelivery,
    "blocked",
  );
});

check("full E2E result blocks payment and public launch", async () => {
  const {
    completed,
  } = await setupCompletedRun();

  assert.equal(
    completed.paymentExecution,
    "blocked",
  );

  assert.equal(
    completed.publicLaunch,
    "blocked",
  );
});

check("persistent E2E uses durable lifecycle receipt and audit transactions", async () => {
  const {
    infrastructure,
  } = await setupCompletedRun();

  assert.ok(
    infrastructure.getLifecycleTransactions() >= 1,
  );

  assert.ok(
    infrastructure.getReceiptTransactions() >= 2,
  );

  assert.equal(
    infrastructure.getAuditTransactions(),
    2,
  );
});

check("production server restart keeps shared persistent data intact", async () => {
  const {
    infrastructure,
    browser,
  } = await setupCompletedRun();

  const before = {
    sessions:
      infrastructure.sessions.size,
    receipts:
      infrastructure.receipts.size,
    audits:
      infrastructure.audits.size,
  };

  browser.restartServer();

  const after = {
    sessions:
      infrastructure.sessions.size,
    receipts:
      infrastructure.receipts.size,
    audits:
      infrastructure.audits.size,
  };

  assert.deepEqual(
    after,
    before,
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
    } catch (error) {
      console.error(
        `FAIL: ${item.name}`,
      );
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
