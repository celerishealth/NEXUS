import assert from "node:assert/strict";
import test from "node:test";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../lib/nexus/ownerAuthorizedActionAdmission.mjs";

const SECRET = "day-660-test-signing-secret";
const NOW = "2026-07-10T10:00:00.000Z";

function createInput(overrides = {}) {
  const action = {
    tenantId: "tenant-001",
    actionId: "action-001",
    actionType: "SAFE_PREVIEW_ACTION",
    payloadDigest: "sha256:payload-001",
    ...overrides.action,
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-001",
    authorityEpoch: "epoch-001",
    status: "ACTIVE",
    trustState: "VERIFIED",
    ...overrides.authority,
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-001",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-001",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
    signingSecret: SECRET,
    ...overrides.resolutionFields,
  });

  return {
    action,
    authority,
    resolution: {
      ...resolution,
      ...overrides.resolution,
    },
    replay: {
      consumedResolutionIds: [],
      consumedNonces: [],
      retryCount: 0,
      permanentOutcome: false,
      ...overrides.replay,
    },
    signingSecret:
      overrides.signingSecret === undefined
        ? SECRET
        : overrides.signingSecret,
    now: overrides.now ?? NOW,
  };
}

test("admits a correctly signed owner-controlled action preview", () => {
  const result =
    evaluateOwnerAuthorizedActionAdmission(createInput());

  assert.equal(result.admitted, true);
  assert.equal(result.reasonCodes.length, 0);
  assert.match(result.admissionToken, /^[a-f0-9]{64}$/);
  assert.equal(
    result.auditRecord.externalExecutionPerformed,
    false,
  );
  assert.equal(result.auditRecord.persistencePerformed, false);
});

test("blocks a forged signed resolution", () => {
  const input = createInput();
  input.resolution.signature = "0".repeat(64);

  const result =
    evaluateOwnerAuthorizedActionAdmission(input);

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "RESOLUTION_SIGNATURE_INVALID",
    ),
  );
});

test("blocks consumed resolution replay permanently", () => {
  const input = createInput();
  input.replay.consumedResolutionIds = [
    input.resolution.resolutionId,
  ];

  const result =
    evaluateOwnerAuthorizedActionAdmission(input);

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "RESOLUTION_REPLAY_BLOCKED",
    ),
  );
});

test("blocks consumed nonce replay", () => {
  const input = createInput();
  input.replay.consumedNonces = [input.resolution.nonce];

  const result =
    evaluateOwnerAuthorizedActionAdmission(input);

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes("NONCE_REPLAY_BLOCKED"),
  );
});

test("blocks cross-tenant authority", () => {
  const input = createInput({
    authority: {
      tenantId: "tenant-foreign",
    },
  });

  const result =
    evaluateOwnerAuthorizedActionAdmission(input);

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "TENANT_ISOLATION_VIOLATION",
    ),
  );
});

test("blocks a second retry attempt", () => {
  const result = evaluateOwnerAuthorizedActionAdmission(
    createInput({
      replay: {
        retryCount: 2,
      },
    }),
  );

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "SINGLE_RETRY_LIMIT_EXCEEDED",
    ),
  );
});

test("blocks an already permanent outcome", () => {
  const result = evaluateOwnerAuthorizedActionAdmission(
    createInput({
      replay: {
        permanentOutcome: true,
      },
    }),
  );

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "PERMANENT_OUTCOME_ALREADY_RECORDED",
    ),
  );
});

test("blocks an expired owner resolution", () => {
  const input = createInput({
    resolutionFields: {
      expiresAt: "2026-07-10T09:59:59.000Z",
    },
  });

  const result =
    evaluateOwnerAuthorizedActionAdmission(input);

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes("RESOLUTION_EXPIRED"),
  );
});

test("blocks stale authority epochs", () => {
  const input = createInput();
  input.authority.authorityEpoch = "epoch-new";

  const result =
    evaluateOwnerAuthorizedActionAdmission(input);

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "AUTHORITY_EPOCH_MISMATCH",
    ),
  );
});

test("fails closed when signing authority is unavailable", () => {
  const result = evaluateOwnerAuthorizedActionAdmission(
    createInput({
      signingSecret: "",
    }),
  );

  assert.equal(result.admitted, false);
  assert.ok(
    result.reasonCodes.includes(
      "SIGNING_AUTHORITY_UNAVAILABLE",
    ),
  );
});
