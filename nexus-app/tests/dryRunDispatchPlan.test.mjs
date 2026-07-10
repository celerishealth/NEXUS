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

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "../lib/nexus/dryRunDispatchPlan.mjs";

const SECRET = "day-663-test-secret";
const NOW = "2026-07-10T10:00:00.000Z";

function createPipeline() {
  const action = {
    tenantId: "tenant-663",
    actionId: "action-663",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-663-test-payload",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-663",
    authorityEpoch: "epoch-663",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-663",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-663",
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
    handoff,
    now: NOW,
  });

  const claim = claimControlledExecutionIntent({
    intent,
    claim: {
      claimId: "claim-663",
      intentId: intent.intentId,
      tenantId: action.tenantId,
      actionId: action.actionId,
      ownerId: authority.ownerId,
      role: "OWNER",
      issuedAt: "2026-07-10T09:59:00.000Z",
      expiresAt: "2026-07-10T10:10:00.000Z",
    },
    replay: {
      consumedClaimIds: [],
      activeClaimExists: false,
    },
    now: NOW,
  });

  const adapterManifests = [
    {
      adapterId: "adapter-alpha",
      providerId: "provider-alpha",
      contractVersion: "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired: false,
    },
    {
      adapterId: "adapter-beta",
      providerId: "provider-beta",
      contractVersion: "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired: false,
    },
  ];

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests,
      now: NOW,
    });

  return {
    action,
    authority,
    admission,
    handoff,
    intent,
    claim,
    adapterManifests,
    plan,
  };
}

test("creates a deterministic two-provider dry-run plan", () => {
  const first = createPipeline();
  const second = createPipeline();

  assert.equal(first.plan.created, true);
  assert.equal(first.plan.reasonCodes.length, 0);
  assert.equal(first.plan.planId, second.plan.planId);
  assert.equal(first.plan.dispatchAttempts.length, 2);
  assert.match(first.plan.planId, /^[a-f0-9]{64}$/);
  assert.equal(first.plan.executionAuthorized, false);
  assert.equal(
    first.plan.providerInvocationPerformed,
    false,
  );
  assert.equal(first.plan.persistencePerformed, false);
});

test("blocks plan creation without a trusted owner claim", () => {
  const pipeline = createPipeline();

  const result =
    createDeterministicDryRunDispatchPlan({
      action: pipeline.action,
      handoff: pipeline.handoff,
      intent: pipeline.intent,
      claim: {
        ...pipeline.claim,
        claimed: false,
      },
      adapterManifests: pipeline.adapterManifests,
      now: NOW,
    });

  assert.equal(result.created, false);
  assert.ok(
    result.reasonCodes.includes(
      "TRUSTED_OWNER_CLAIM_REQUIRED",
    ),
  );
});

test("blocks missing adapter manifests", () => {
  const pipeline = createPipeline();

  const result =
    createDeterministicDryRunDispatchPlan({
      action: pipeline.action,
      handoff: pipeline.handoff,
      intent: pipeline.intent,
      claim: pipeline.claim,
      adapterManifests: [
        pipeline.adapterManifests[0],
      ],
      now: NOW,
    });

  assert.equal(result.created, false);
  assert.ok(
    result.reasonCodes.includes(
      "ADAPTER_MANIFEST_UNAVAILABLE",
    ),
  );
});

test("blocks provider and adapter binding mismatch", () => {
  const pipeline = createPipeline();

  const manifests = pipeline.adapterManifests.map(
    (manifest, index) =>
      index === 0
        ? {
            ...manifest,
            providerId: "provider-foreign",
          }
        : manifest,
  );

  const result =
    createDeterministicDryRunDispatchPlan({
      action: pipeline.action,
      handoff: pipeline.handoff,
      intent: pipeline.intent,
      claim: pipeline.claim,
      adapterManifests: manifests,
      now: NOW,
    });

  assert.equal(result.created, false);
  assert.ok(
    result.reasonCodes.includes(
      "ADAPTER_PROVIDER_BINDING_MISMATCH",
    ),
  );
});

test("simulates primary-provider success locally", () => {
  const pipeline = createPipeline();

  const outcomes = Object.fromEntries(
    pipeline.plan.dispatchAttempts.map(
      (attempt) => [
        attempt.attemptId,
        "SIMULATED_SUCCESS",
      ],
    ),
  );

  const result = simulateDryRunDispatch({
    plan: pipeline.plan,
    outcomes,
    now: NOW,
  });

  assert.equal(result.completed, true);
  assert.equal(
    result.state,
    "SIMULATED_SUCCESS_FOR_OWNER_REVIEW",
  );
  assert.equal(result.evaluatedAttempts.length, 1);
  assert.equal(
    result.selectedAttempt.providerId,
    "provider-alpha",
  );
  assert.equal(result.providerInvocationPerformed, false);
});

test("simulates failover to the second provider", () => {
  const pipeline = createPipeline();

  const outcomes = {
    [pipeline.plan.dispatchAttempts[0].attemptId]:
      "SIMULATED_RETRYABLE_FAILURE",
    [pipeline.plan.dispatchAttempts[1].attemptId]:
      "SIMULATED_SUCCESS",
  };

  const result = simulateDryRunDispatch({
    plan: pipeline.plan,
    outcomes,
    now: NOW,
  });

  assert.equal(result.completed, true);
  assert.equal(result.evaluatedAttempts.length, 2);
  assert.equal(
    result.selectedAttempt.providerId,
    "provider-beta",
  );
  assert.equal(result.externalExecutionPerformed, false);
});

test("stops simulation after permanent failure", () => {
  const pipeline = createPipeline();

  const outcomes = {
    [pipeline.plan.dispatchAttempts[0].attemptId]:
      "SIMULATED_PERMANENT_FAILURE",
    [pipeline.plan.dispatchAttempts[1].attemptId]:
      "SIMULATED_SUCCESS",
  };

  const result = simulateDryRunDispatch({
    plan: pipeline.plan,
    outcomes,
    now: NOW,
  });

  assert.equal(result.completed, true);
  assert.equal(
    result.state,
    "SIMULATED_PERMANENT_FAILURE",
  );
  assert.equal(result.evaluatedAttempts.length, 1);
  assert.equal(result.selectedAttempt, null);
});

test("reports failover exhaustion after retryable failures", () => {
  const pipeline = createPipeline();

  const outcomes = Object.fromEntries(
    pipeline.plan.dispatchAttempts.map(
      (attempt) => [
        attempt.attemptId,
        "SIMULATED_RETRYABLE_FAILURE",
      ],
    ),
  );

  const result = simulateDryRunDispatch({
    plan: pipeline.plan,
    outcomes,
    now: NOW,
  });

  assert.equal(result.completed, true);
  assert.equal(
    result.state,
    "SIMULATED_FAILOVER_EXHAUSTED",
  );
  assert.equal(result.evaluatedAttempts.length, 2);
  assert.equal(result.selectedAttempt, null);
});

test("fails closed when a simulation outcome is missing", () => {
  const pipeline = createPipeline();

  const result = simulateDryRunDispatch({
    plan: pipeline.plan,
    outcomes: {},
    now: NOW,
  });

  assert.equal(result.completed, false);
  assert.ok(
    result.reasonCodes.includes(
      "SIMULATION_OUTCOME_MISSING_OR_INVALID",
    ),
  );
});
