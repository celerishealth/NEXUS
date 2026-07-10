import assert from "node:assert/strict";
import test from "node:test";

import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../lib/nexus/ownerAuthorizedActionAdmission.mjs";
import {
  createProviderIndependentRecoveryHandoff,
} from "../lib/nexus/providerIndependentRecoveryHandoff.mjs";

const SECRET = "day-661-test-secret";
const NOW = "2026-07-10T10:00:00.000Z";

function createInput(overrides = {}) {
  const action = {
    tenantId: "tenant-661",
    actionId: "action-661",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-661-test-payload",
    ...overrides.action,
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-661",
    authorityEpoch: "epoch-661",
    status: "ACTIVE",
    trustState: "VERIFIED",
    ...overrides.authority,
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-661",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-661",
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

  return {
    action,
    admission:
      overrides.admission === undefined
        ? admission
        : overrides.admission,
    adapters:
      overrides.adapters ?? [
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
      ...overrides.recovery,
    },
    now: NOW,
  };
}

test("prepares a deterministic two-provider recovery handoff", () => {
  const first =
    createProviderIndependentRecoveryHandoff(
      createInput(),
    );
  const second =
    createProviderIndependentRecoveryHandoff(
      createInput(),
    );

  assert.equal(first.prepared, true);
  assert.equal(first.reasonCodes.length, 0);
  assert.equal(first.handoffId, second.handoffId);
  assert.equal(first.failoverChain.length, 2);
  assert.equal(
    first.selectedPrimaryAdapter.adapterId,
    "adapter-alpha",
  );
  assert.match(first.handoffId, /^[a-f0-9]{64}$/);
  assert.match(
    first.recoveryCheckpoint.checkpointId,
    /^[a-f0-9]{64}$/,
  );
  assert.equal(first.executionAuthorized, false);
  assert.equal(first.providerInvocationPerformed, false);
  assert.equal(first.persistencePerformed, false);
});

test("blocks handoff when owner admission was denied", () => {
  const input = createInput();
  input.admission = {
    ...input.admission,
    admitted: false,
    admissionToken: null,
  };

  const result =
    createProviderIndependentRecoveryHandoff(input);

  assert.equal(result.prepared, false);
  assert.ok(
    result.reasonCodes.includes(
      "OWNER_AUTHORIZED_ADMISSION_REQUIRED",
    ),
  );
});

test("blocks handoff without a second provider", () => {
  const input = createInput();
  input.adapters = [input.adapters[0]];

  const result =
    createProviderIndependentRecoveryHandoff(input);

  assert.equal(result.prepared, false);
  assert.ok(
    result.reasonCodes.includes(
      "PROVIDER_FAILOVER_UNAVAILABLE",
    ),
  );
});

test("blocks adapters without the required capability", () => {
  const input = createInput();
  input.adapters = input.adapters.map((adapter) => ({
    ...adapter,
    capabilities: ["UNRELATED_CAPABILITY"],
  }));

  const result =
    createProviderIndependentRecoveryHandoff(input);

  assert.equal(result.prepared, false);
  assert.ok(
    result.reasonCodes.includes(
      "HEALTHY_CAPABLE_ADAPTER_UNAVAILABLE",
    ),
  );
});

test("blocks cross-tenant admission binding", () => {
  const input = createInput({
    action: {
      tenantId: "tenant-original",
    },
  });

  input.action = {
    ...input.action,
    tenantId: "tenant-foreign",
  };

  const result =
    createProviderIndependentRecoveryHandoff(input);

  assert.equal(result.prepared, false);
  assert.ok(
    result.reasonCodes.includes(
      "ADMISSION_ACTION_BINDING_MISMATCH",
    ),
  );
});

test("blocks retry counts above the single-retry limit", () => {
  const result =
    createProviderIndependentRecoveryHandoff(
      createInput({
        recovery: {
          retryCount: 2,
        },
      }),
    );

  assert.equal(result.prepared, false);
  assert.ok(
    result.reasonCodes.includes(
      "RECOVERY_RETRY_LIMIT_EXCEEDED",
    ),
  );
});

test("blocks an already permanent outcome", () => {
  const result =
    createProviderIndependentRecoveryHandoff(
      createInput({
        recovery: {
          permanentOutcome: true,
        },
      }),
    );

  assert.equal(result.prepared, false);
  assert.ok(
    result.reasonCodes.includes(
      "PERMANENT_OUTCOME_ALREADY_RECORDED",
    ),
  );
});

test("orders provider adapters deterministically", () => {
  const input = createInput();

  input.adapters = [
    {
      ...input.adapters[1],
      priority: 9,
    },
    {
      ...input.adapters[0],
      priority: 3,
    },
  ];

  const result =
    createProviderIndependentRecoveryHandoff(input);

  assert.equal(result.prepared, true);
  assert.equal(
    result.selectedPrimaryAdapter.adapterId,
    "adapter-alpha",
  );
});
