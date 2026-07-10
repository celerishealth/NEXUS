import assert from "node:assert/strict";
import test from "node:test";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../lib/nexus/ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "../lib/nexus/providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "../lib/nexus/controlledExecutionIntent.mjs";

const SECRET = "day-662-test-secret";
const NOW = "2026-07-10T10:00:00.000Z";

function createPipeline(overrides = {}) {
  const action = {
    tenantId: "tenant-662",
    actionId: "action-662",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-662-test-payload",
    ...overrides.action,
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-662",
    authorityEpoch: "epoch-662",
    status: "ACTIVE",
    trustState: "VERIFIED",
    ...overrides.authority,
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-662",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-662",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
    signingSecret: SECRET,
  });

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action,
      authority,
      resolution,
      replay: {
        consumedResolutionIds: [],
        consumedNonces: [],
        retryCount: 0,
        permanentOutcome: false,
      },
      signingSecret: SECRET,
      now: NOW,
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters: [
        {
          adapterId: "adapter-alpha",
          providerId: "provider-alpha",
          status: "HEALTHY",
          priority: 1,
          capabilities: ["SAFE_DRAFT_ADMISSION"],
        },
        {
          adapterId: "adapter-beta",
          providerId: "provider-beta",
          status: "HEALTHY",
          priority: 2,
          capabilities: ["SAFE_DRAFT_ADMISSION"],
        },
      ],
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      now: NOW,
    });

  const intent = createControlledExecutionIntent({
    action,
    admission,
    handoff:
      overrides.handoff === undefined
        ? handoff
        : overrides.handoff,
    now: NOW,
  });

  return {
    action,
    authority,
    admission,
    handoff,
    intent,
  };
}

function createClaimInput(pipeline, overrides = {}) {
  return {
    intent: pipeline.intent,
    claim: {
      claimId: "claim-662",
      intentId: pipeline.intent.intentId,
      tenantId: pipeline.action.tenantId,
      actionId: pipeline.action.actionId,
      ownerId: pipeline.authority.ownerId,
      role: "OWNER",
      issuedAt: "2026-07-10T09:59:00.000Z",
      expiresAt: "2026-07-10T10:10:00.000Z",
      ...overrides.claim,
    },
    replay: {
      consumedClaimIds: [],
      activeClaimExists: false,
      ...overrides.replay,
    },
    now: overrides.now ?? NOW,
  };
}

test("creates a deterministic controlled execution intent", () => {
  const first = createPipeline();
  const second = createPipeline();

  assert.equal(first.intent.created, true);
  assert.equal(first.intent.reasonCodes.length, 0);
  assert.equal(
    first.intent.intentId,
    second.intent.intentId,
  );
  assert.match(first.intent.intentId, /^[a-f0-9]{64}$/);
  assert.equal(
    first.intent.state,
    "READY_FOR_OWNER_CLAIM",
  );
  assert.equal(first.intent.executionAuthorized, false);
  assert.equal(
    first.intent.providerInvocationPerformed,
    false,
  );
  assert.equal(first.intent.persistencePerformed, false);
});

test("blocks intent creation from an unprepared handoff", () => {
  const pipeline = createPipeline();

  const unsafeHandoff = {
    ...pipeline.handoff,
    prepared: false,
    handoffId: null,
  };

  const result = createControlledExecutionIntent({
    action: pipeline.action,
    admission: pipeline.admission,
    handoff: unsafeHandoff,
    now: NOW,
  });

  assert.equal(result.created, false);
  assert.ok(
    result.reasonCodes.includes(
      "PREPARED_RECOVERY_HANDOFF_REQUIRED",
    ),
  );
});

test("blocks handoff and action binding mismatch", () => {
  const pipeline = createPipeline();

  const mismatchedHandoff = {
    ...pipeline.handoff,
    auditRecord: {
      ...pipeline.handoff.auditRecord,
      tenantId: "tenant-foreign",
    },
  };

  const result = createControlledExecutionIntent({
    action: pipeline.action,
    admission: pipeline.admission,
    handoff: mismatchedHandoff,
    now: NOW,
  });

  assert.equal(result.created, false);
  assert.ok(
    result.reasonCodes.includes(
      "HANDOFF_ACTION_BINDING_MISMATCH",
    ),
  );
});

test("blocks unsafe handoff execution flags", () => {
  const pipeline = createPipeline();

  const unsafeHandoff = {
    ...pipeline.handoff,
    executionAuthorized: true,
  };

  const result = createControlledExecutionIntent({
    action: pipeline.action,
    admission: pipeline.admission,
    handoff: unsafeHandoff,
    now: NOW,
  });

  assert.equal(result.created, false);
  assert.ok(
    result.reasonCodes.includes(
      "HANDOFF_SAFETY_BOUNDARY_INVALID",
    ),
  );
});

test("accepts a valid single-owner claim", () => {
  const pipeline = createPipeline();

  const result = claimControlledExecutionIntent(
    createClaimInput(pipeline),
  );

  assert.equal(result.claimed, true);
  assert.equal(result.reasonCodes.length, 0);
  assert.equal(
    result.state,
    "CLAIMED_FOR_CONTROLLED_REVIEW",
  );
  assert.match(result.claimToken, /^[a-f0-9]{64}$/);
  assert.equal(result.executionAuthorized, false);
  assert.equal(result.persistencePerformed, false);
});

test("blocks replayed claim identifiers", () => {
  const pipeline = createPipeline();

  const result = claimControlledExecutionIntent(
    createClaimInput(pipeline, {
      replay: {
        consumedClaimIds: ["claim-662"],
      },
    }),
  );

  assert.equal(result.claimed, false);
  assert.ok(
    result.reasonCodes.includes(
      "CLAIM_REPLAY_BLOCKED",
    ),
  );
});

test("blocks a foreign owner claim", () => {
  const pipeline = createPipeline();

  const result = claimControlledExecutionIntent(
    createClaimInput(pipeline, {
      claim: {
        ownerId: "owner-foreign",
      },
    }),
  );

  assert.equal(result.claimed, false);
  assert.ok(
    result.reasonCodes.includes(
      "TRUSTED_OWNER_CLAIM_REQUIRED",
    ),
  );
});

test("blocks a concurrent active claim", () => {
  const pipeline = createPipeline();

  const result = claimControlledExecutionIntent(
    createClaimInput(pipeline, {
      replay: {
        activeClaimExists: true,
      },
    }),
  );

  assert.equal(result.claimed, false);
  assert.ok(
    result.reasonCodes.includes(
      "ACTIVE_CLAIM_ALREADY_EXISTS",
    ),
  );
});

test("blocks an expired claim lease", () => {
  const pipeline = createPipeline();

  const result = claimControlledExecutionIntent(
    createClaimInput(pipeline, {
      claim: {
        issuedAt: "2026-07-10T09:40:00.000Z",
        expiresAt: "2026-07-10T09:50:00.000Z",
      },
    }),
  );

  assert.equal(result.claimed, false);
  assert.ok(
    result.reasonCodes.includes("CLAIM_EXPIRED"),
  );
});

test("blocks claim leases longer than fifteen minutes", () => {
  const pipeline = createPipeline();

  const result = claimControlledExecutionIntent(
    createClaimInput(pipeline, {
      claim: {
        issuedAt: "2026-07-10T09:55:00.000Z",
        expiresAt: "2026-07-10T10:20:00.000Z",
      },
    }),
  );

  assert.equal(result.claimed, false);
  assert.ok(
    result.reasonCodes.includes(
      "CLAIM_LEASE_TOO_LONG",
    ),
  );
});
