/* eslint-disable */
const assert = require("node:assert/strict");

const modulePath = process.env.DAY742_MODULE;

if (!modulePath) {
  throw new Error("DAY742_MODULE is required.");
}

const {
  CustomerVerticalSliceAuditError,
  appendVerticalSliceAuditEvent,
  verifyVerticalSliceAuditChain,
} = require(modulePath);

const fixedNow = "2026-07-11T04:00:00.000Z";

const serviceContext = Object.freeze({
  authenticated: true,
  tenantId: "tenant-a",
  serviceId: "nexus-audit-service",
  role: "service",
});

const firstSource = Object.freeze({
  eventId: "event-recommendation",
  idempotencyKey: "inquiry-735:recommendation:v1",
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  actorId: "nexus-sandbox-service",
  actorRole: "service",
  transition: "generate_recommendation",
  fromStatus: "inquiry_received",
  toStatus: "recommendation_ready",
  previousVersion: "initial-v1",
  nextVersion: "recommendation-v1",
  createdAt: "2026-07-11T03:00:00.000Z",
});

const secondSource = Object.freeze({
  eventId: "event-approval",
  idempotencyKey: "inquiry-735:approval:v1",
  tenantId: "tenant-a",
  inquiryId: "inquiry-735",
  customerId: "customer-a",
  ownerId: "owner-a",
  actorId: "owner-a",
  actorRole: "owner",
  transition: "approve_recommendation",
  fromStatus: "recommendation_ready",
  toStatus: "owner_approved",
  previousVersion: "recommendation-v1",
  nextVersion: "approval-v1",
  createdAt: "2026-07-11T03:10:00.000Z",
});

function createRepository() {
  const entries = [];
  let appendCalls = 0;

  return {
    async findBySourceEventId({
      tenantId,
      sourceEventId,
    }) {
      return (
        entries.find(
          (entry) =>
            entry.tenantId === tenantId &&
            entry.sourceEventId === sourceEventId,
        ) ?? null
      );
    },

    async findLatest({ tenantId, inquiryId }) {
      const matches = entries.filter(
        (entry) =>
          entry.tenantId === tenantId &&
          entry.inquiryId === inquiryId,
      );

      return matches.length > 0
        ? matches[matches.length - 1]
        : null;
    },

    async appendIfCurrent({
      entry,
      expectedSequence,
      expectedPreviousHash,
    }) {
      appendCalls += 1;

      const latest =
        entries.length > 0
          ? entries[entries.length - 1]
          : null;

      const actualSequence = latest
        ? latest.sequence + 1
        : 1;

      const actualPreviousHash = latest
        ? latest.hash
        : "GENESIS";

      if (
        actualSequence !== expectedSequence ||
        actualPreviousHash !== expectedPreviousHash
      ) {
        return {
          created: false,
          entry: latest ?? entry,
        };
      }

      entries.push({ ...entry });

      return {
        created: true,
        entry: { ...entry },
      };
    },

    getEntries() {
      return entries.map((entry) => ({ ...entry }));
    },

    getAppendCalls() {
      return appendCalls;
    },
  };
}

async function expectCode(action, expectedCode) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof CustomerVerticalSliceAuditError &&
      error.code === expectedCode,
  );
}

async function append(source, repository, overrides = {}) {
  return appendVerticalSliceAuditEvent({
    context: serviceContext,
    requestedTenantId: "tenant-a",
    source,
    repository,
    nowIso: fixedNow,
    ...overrides,
  });
}

async function main() {
  let preflightCalls = 0;

  const preflightRepository = {
    async findBySourceEventId() {
      preflightCalls += 1;
      return null;
    },

    async findLatest() {
      preflightCalls += 1;
      return null;
    },

    async appendIfCurrent() {
      preflightCalls += 1;
      throw new Error("Must not persist.");
    },
  };

  await expectCode(
    () =>
      appendVerticalSliceAuditEvent({
        context: {
          ...serviceContext,
          authenticated: false,
        },
        requestedTenantId: "tenant-a",
        source: firstSource,
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "UNAUTHENTICATED",
  );

  await expectCode(
    () =>
      appendVerticalSliceAuditEvent({
        context: {
          ...serviceContext,
          role: "owner",
        },
        requestedTenantId: "tenant-a",
        source: firstSource,
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "WRITER_NOT_AUTHORIZED",
  );

  await expectCode(
    () =>
      appendVerticalSliceAuditEvent({
        context: serviceContext,
        requestedTenantId: "tenant-b",
        source: firstSource,
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "CROSS_TENANT_ACCESS",
  );

  await expectCode(
    () =>
      appendVerticalSliceAuditEvent({
        context: serviceContext,
        requestedTenantId: "tenant-a",
        source: {
          ...firstSource,
          tenantId: "tenant-b",
        },
        repository: preflightRepository,
        nowIso: fixedNow,
      }),
    "SOURCE_TENANT_MISMATCH",
  );

  assert.equal(
    preflightCalls,
    0,
    "Security checks must fail before repository access.",
  );

  await expectCode(
    () =>
      append(
        {
          ...firstSource,
          previousVersion: "same-version",
          nextVersion: "same-version",
        },
        createRepository(),
      ),
    "INVALID_SOURCE_EVENT",
  );

  const repository = createRepository();

  const first = await append(
    firstSource,
    repository,
  );

  assert.equal(first.created, true);
  assert.equal(first.idempotent, false);
  assert.equal(first.entry.sequence, 1);
  assert.equal(first.entry.previousHash, "GENESIS");
  assert.match(
    first.entry.auditId,
    /^vsa1_[a-f0-9]{20}$/,
  );
  assert.match(first.entry.hash, /^[a-f0-9]{64}$/);

  const firstReplay = await append(
    firstSource,
    repository,
  );

  assert.equal(firstReplay.created, false);
  assert.equal(firstReplay.idempotent, true);
  assert.deepEqual(firstReplay.entry, first.entry);
  assert.equal(
    repository.getAppendCalls(),
    1,
    "Idempotent replay must not append another audit row.",
  );

  const second = await append(
    secondSource,
    repository,
  );

  assert.equal(second.created, true);
  assert.equal(second.entry.sequence, 2);
  assert.equal(
    second.entry.previousHash,
    first.entry.hash,
  );
  assert.equal(
    second.entry.previousVersion,
    first.entry.nextVersion,
  );

  const verified = verifyVerticalSliceAuditChain({
    tenantId: "tenant-a",
    inquiryId: "inquiry-735",
    entries: repository.getEntries(),
  });

  assert.deepEqual(verified, {
    valid: true,
    entryCount: 2,
    headHash: second.entry.hash,
    finalVersion: "approval-v1",
  });

  await expectCode(
    () =>
      append(
        {
          ...secondSource,
          eventId: "event-invalid-chain",
          idempotencyKey: "invalid-chain-key",
          previousVersion: "wrong-version",
        },
        repository,
      ),
    "CHAIN_VERSION_MISMATCH",
  );

  await expectCode(
    () =>
      append(
        {
          ...firstSource,
          transition: "release_result",
        },
        repository,
      ),
    "IDEMPOTENCY_CONFLICT",
  );

  const tampered = repository.getEntries();
  tampered[0].actorId = "tampered-actor";

  await expectCode(
    async () =>
      verifyVerticalSliceAuditChain({
        tenantId: "tenant-a",
        inquiryId: "inquiry-735",
        entries: tampered,
      }),
    "AUDIT_CHAIN_INVALID",
  );

  const sequenceGap = repository.getEntries();
  sequenceGap[1].sequence = 3;

  await expectCode(
    async () =>
      verifyVerticalSliceAuditChain({
        tenantId: "tenant-a",
        inquiryId: "inquiry-735",
        entries: sequenceGap,
      }),
    "AUDIT_CHAIN_INVALID",
  );

  const wrongTenant = repository.getEntries();

  await expectCode(
    async () =>
      verifyVerticalSliceAuditChain({
        tenantId: "tenant-b",
        inquiryId: "inquiry-735",
        entries: wrongTenant,
      }),
    "AUDIT_CHAIN_INVALID",
  );

  const concurrentRepository = createRepository();

  concurrentRepository.appendIfCurrent = async ({
    entry,
  }) => ({
    created: false,
    entry: {
      ...entry,
      sourceEventId: "different-event",
    },
  });

  await expectCode(
    () =>
      append(
        firstSource,
        concurrentRepository,
      ),
    "CONCURRENT_APPEND",
  );

  const mismatchRepository = createRepository();

  mismatchRepository.appendIfCurrent = async ({
    entry,
  }) => ({
    created: true,
    entry: {
      ...entry,
      actorId: "wrong-actor",
    },
  });

  await expectCode(
    () =>
      append(
        firstSource,
        mismatchRepository,
      ),
    "AUDIT_CHAIN_INVALID",
  );

  const emptyVerification =
    verifyVerticalSliceAuditChain({
      tenantId: "tenant-a",
      inquiryId: "inquiry-empty",
      entries: [],
    });

  assert.deepEqual(emptyVerification, {
    valid: true,
    entryCount: 0,
    headHash: "GENESIS",
    finalVersion: null,
  });

  console.log("DAY 742 TARGETED TESTS PASS (15/15)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
