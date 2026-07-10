import { createHash } from "node:crypto";

const EXPECTED_HANDOFF_SCHEMA =
  "nexus.provider-independent-recovery-handoff.v1";

const EXPECTED_INTENT_SCHEMA =
  "nexus.controlled-execution-intent.v1";

const EXPECTED_CLAIM_SCHEMA =
  "nexus.controlled-execution-intent-claim.v1";

const ACCEPTED_SIMULATION_RESULTS = new Set([
  "SIMULATED_SUCCESS",
  "SIMULATED_RETRYABLE_FAILURE",
  "SIMULATED_PERMANENT_FAILURE",
]);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalize(value[key])}`,
      )
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function digest(value) {
  return createHash("sha256")
    .update(canonicalize(value))
    .digest("hex");
}

function normalizeManifests(manifests) {
  if (!Array.isArray(manifests)) {
    return [];
  }

  return manifests
    .map((manifest) => ({
      adapterId: normalizeString(manifest?.adapterId),
      providerId: normalizeString(manifest?.providerId),
      contractVersion: normalizeString(
        manifest?.contractVersion,
      ),
      status: normalizeString(manifest?.status),
      supportsDryRun:
        manifest?.supportsDryRun === true,
      externalInvocationRequired:
        manifest?.externalInvocationRequired === true,
    }))
    .filter(
      (manifest) =>
        manifest.adapterId &&
        manifest.providerId &&
        manifest.contractVersion &&
        manifest.status === "READY" &&
        manifest.supportsDryRun === true &&
        manifest.externalInvocationRequired === false,
    );
}

function buildPlanAudit({
  created,
  action,
  intent,
  claim,
  planId,
  reasonCodes,
  attempts,
  now,
}) {
  return Object.freeze({
    schemaVersion:
      "nexus.dry-run-dispatch-plan.audit.v1",
    occurredAt: now,
    tenantId: normalizeString(action?.tenantId),
    actionId: normalizeString(action?.actionId),
    ownerId: normalizeString(intent?.ownerId),
    intentId: normalizeString(intent?.intentId),
    claimId: normalizeString(claim?.claimId),
    planId,
    result: created
      ? "DRY_RUN_PLAN_CREATED"
      : "DRY_RUN_PLAN_DENIED_FAIL_CLOSED",
    attemptCount: attempts.length,
    reasonCodes: Object.freeze([...reasonCodes]),
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
  });
}

export function createDeterministicDryRunDispatchPlan(
  input = {},
) {
  const action = input.action ?? {};
  const handoff = input.handoff ?? {};
  const intent = input.intent ?? {};
  const claim = input.claim ?? {};
  const now =
    normalizeString(input.now) || new Date().toISOString();

  const reasonCodes = [];

  const tenantId = normalizeString(action.tenantId);
  const actionId = normalizeString(action.actionId);
  const actionType = normalizeString(action.actionType);
  const payloadDigest = normalizeString(action.payloadDigest);

  if (!tenantId || !actionId || !actionType || !payloadDigest) {
    reasonCodes.push("ACTION_IDENTITY_INCOMPLETE");
  }

  if (handoff.schemaVersion !== EXPECTED_HANDOFF_SCHEMA) {
    reasonCodes.push("HANDOFF_SCHEMA_UNTRUSTED");
  }

  if (handoff.prepared !== true) {
    reasonCodes.push("PREPARED_HANDOFF_REQUIRED");
  }

  if (
    handoff.executionAuthorized !== false ||
    handoff.externalExecutionPerformed !== false ||
    handoff.providerInvocationPerformed !== false ||
    handoff.persistencePerformed !== false
  ) {
    reasonCodes.push("HANDOFF_SAFETY_BOUNDARY_INVALID");
  }

  if (intent.schemaVersion !== EXPECTED_INTENT_SCHEMA) {
    reasonCodes.push("INTENT_SCHEMA_UNTRUSTED");
  }

  if (intent.created !== true) {
    reasonCodes.push("CONTROLLED_INTENT_REQUIRED");
  }

  if (intent.state !== "READY_FOR_OWNER_CLAIM") {
    reasonCodes.push("INTENT_STATE_INVALID");
  }

  if (
    normalizeString(intent.tenantId) !== tenantId ||
    normalizeString(intent.actionId) !== actionId ||
    normalizeString(intent.handoffId) !==
      normalizeString(handoff.handoffId)
  ) {
    reasonCodes.push("INTENT_ACTION_BINDING_MISMATCH");
  }

  if (
    intent.executionAuthorized !== false ||
    intent.externalExecutionPerformed !== false ||
    intent.providerInvocationPerformed !== false ||
    intent.persistencePerformed !== false
  ) {
    reasonCodes.push("INTENT_SAFETY_BOUNDARY_INVALID");
  }

  if (claim.schemaVersion !== EXPECTED_CLAIM_SCHEMA) {
    reasonCodes.push("CLAIM_SCHEMA_UNTRUSTED");
  }

  if (claim.claimed !== true) {
    reasonCodes.push("TRUSTED_OWNER_CLAIM_REQUIRED");
  }

  if (
    claim.state !== "CLAIMED_FOR_CONTROLLED_REVIEW"
  ) {
    reasonCodes.push("CLAIM_STATE_INVALID");
  }

  if (
    normalizeString(claim.intentId) !==
      normalizeString(intent.intentId)
  ) {
    reasonCodes.push("CLAIM_INTENT_BINDING_MISMATCH");
  }

  if (!/^[a-f0-9]{64}$/.test(normalizeString(claim.claimToken))) {
    reasonCodes.push("CLAIM_TOKEN_INVALID");
  }

  if (
    claim.executionAuthorized !== false ||
    claim.externalExecutionPerformed !== false ||
    claim.providerInvocationPerformed !== false ||
    claim.persistencePerformed !== false
  ) {
    reasonCodes.push("CLAIM_SAFETY_BOUNDARY_INVALID");
  }

  const handoffChain = Array.isArray(handoff.failoverChain)
    ? handoff.failoverChain
    : [];

  if (handoffChain.length < 2) {
    reasonCodes.push("PROVIDER_FAILOVER_UNAVAILABLE");
  }

  const manifests = normalizeManifests(
    input.adapterManifests,
  );

  const duplicateAdapterIds =
    manifests.length !==
    new Set(
      manifests.map((manifest) => manifest.adapterId),
    ).size;

  if (duplicateAdapterIds) {
    reasonCodes.push("DUPLICATE_ADAPTER_MANIFEST_BLOCKED");
  }

  const manifestMap = new Map(
    manifests.map((manifest) => [
      manifest.adapterId,
      manifest,
    ]),
  );

  const attempts = handoffChain.map(
    (adapter, index) => {
      const adapterId = normalizeString(adapter?.adapterId);
      const providerId = normalizeString(adapter?.providerId);
      const manifest = manifestMap.get(adapterId);

      if (!manifest) {
        return {
          valid: false,
          reason: "ADAPTER_MANIFEST_UNAVAILABLE",
          adapterId,
          providerId,
          sequence: index + 1,
        };
      }

      if (manifest.providerId !== providerId) {
        return {
          valid: false,
          reason: "ADAPTER_PROVIDER_BINDING_MISMATCH",
          adapterId,
          providerId,
          sequence: index + 1,
        };
      }

      return {
        valid: true,
        sequence: index + 1,
        adapterId,
        providerId,
        contractVersion: manifest.contractVersion,
      };
    },
  );

  for (const attempt of attempts) {
    if (!attempt.valid) {
      reasonCodes.push(attempt.reason);
    }
  }

  const providerIds = attempts
    .filter((attempt) => attempt.valid)
    .map((attempt) => attempt.providerId);

  if (new Set(providerIds).size < 2) {
    reasonCodes.push("INDEPENDENT_PROVIDER_SET_REQUIRED");
  }

  const created = reasonCodes.length === 0;

  const planIdentity = created
    ? {
        tenantId,
        actionId,
        actionType,
        payloadDigest,
        handoffId: normalizeString(handoff.handoffId),
        intentId: normalizeString(intent.intentId),
        claimId: normalizeString(claim.claimId),
        claimToken: normalizeString(claim.claimToken),
        attempts: attempts.map((attempt) => ({
          sequence: attempt.sequence,
          adapterId: attempt.adapterId,
          providerId: attempt.providerId,
          contractVersion: attempt.contractVersion,
        })),
      }
    : null;

  const planId = created
    ? digest({
        type: "NEXUS_DETERMINISTIC_DRY_RUN_DISPATCH_PLAN",
        ...planIdentity,
      })
    : null;

  const dispatchAttempts = created
    ? attempts.map((attempt) =>
        Object.freeze({
          attemptId: digest({
            type: "NEXUS_DRY_RUN_ATTEMPT",
            planId,
            sequence: attempt.sequence,
            adapterId: attempt.adapterId,
            providerId: attempt.providerId,
          }),
          sequence: attempt.sequence,
          adapterId: attempt.adapterId,
          providerId: attempt.providerId,
          contractVersion: attempt.contractVersion,
          mode: "LOCAL_DRY_RUN_SIMULATION_ONLY",
          externalInvocationAllowed: false,
        }),
      )
    : [];

  return Object.freeze({
    schemaVersion:
      "nexus.deterministic-dry-run-dispatch-plan.v1",
    created,
    planId,
    state: created
      ? "READY_FOR_LOCAL_DRY_RUN_SIMULATION"
      : "PLAN_DENIED_FAIL_CLOSED",
    mode: "LOCAL_DRY_RUN_ONLY_NO_EXECUTION",
    tenantId: created ? tenantId : null,
    actionId: created ? actionId : null,
    intentId: created
      ? normalizeString(intent.intentId)
      : null,
    claimId: created
      ? normalizeString(claim.claimId)
      : null,
    dispatchAttempts: Object.freeze(dispatchAttempts),
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([...new Set(reasonCodes)]),
    auditRecord: buildPlanAudit({
      created,
      action,
      intent,
      claim,
      planId,
      reasonCodes: [...new Set(reasonCodes)],
      attempts: dispatchAttempts,
      now,
    }),
  });
}

export function simulateDryRunDispatch(input = {}) {
  const plan = input.plan ?? {};
  const outcomes = input.outcomes ?? {};
  const now =
    normalizeString(input.now) || new Date().toISOString();

  const reasonCodes = [];

  if (
    plan.schemaVersion !==
    "nexus.deterministic-dry-run-dispatch-plan.v1"
  ) {
    reasonCodes.push("PLAN_SCHEMA_UNTRUSTED");
  }

  if (plan.created !== true) {
    reasonCodes.push("VALID_DRY_RUN_PLAN_REQUIRED");
  }

  if (
    plan.state !==
    "READY_FOR_LOCAL_DRY_RUN_SIMULATION"
  ) {
    reasonCodes.push("PLAN_STATE_INVALID");
  }

  if (
    plan.executionAuthorized !== false ||
    plan.externalExecutionPerformed !== false ||
    plan.providerInvocationPerformed !== false ||
    plan.persistencePerformed !== false
  ) {
    reasonCodes.push("PLAN_SAFETY_BOUNDARY_INVALID");
  }

  const attempts = Array.isArray(plan.dispatchAttempts)
    ? plan.dispatchAttempts
    : [];

  if (attempts.length < 2) {
    reasonCodes.push("DRY_RUN_FAILOVER_CHAIN_INCOMPLETE");
  }

  const evaluatedAttempts = [];
  let selectedAttempt = null;
  let permanentFailure = false;

  if (reasonCodes.length === 0) {
    for (const attempt of attempts) {
      const attemptId = normalizeString(attempt?.attemptId);
      const simulatedResult = normalizeString(
        outcomes?.[attemptId],
      );

      if (!ACCEPTED_SIMULATION_RESULTS.has(simulatedResult)) {
        reasonCodes.push(
          "SIMULATION_OUTCOME_MISSING_OR_INVALID",
        );
        break;
      }

      const evaluated = Object.freeze({
        attemptId,
        sequence: attempt.sequence,
        adapterId: attempt.adapterId,
        providerId: attempt.providerId,
        simulatedResult,
        providerInvoked: false,
      });

      evaluatedAttempts.push(evaluated);

      if (simulatedResult === "SIMULATED_SUCCESS") {
        selectedAttempt = evaluated;
        break;
      }

      if (
        simulatedResult ===
        "SIMULATED_PERMANENT_FAILURE"
      ) {
        permanentFailure = true;
        break;
      }
    }
  }

  const completed = reasonCodes.length === 0;

  let state = "SIMULATION_DENIED_FAIL_CLOSED";

  if (completed && selectedAttempt) {
    state = "SIMULATED_SUCCESS_FOR_OWNER_REVIEW";
  } else if (completed && permanentFailure) {
    state = "SIMULATED_PERMANENT_FAILURE";
  } else if (completed) {
    state = "SIMULATED_FAILOVER_EXHAUSTED";
  }

  const simulationId = completed
    ? digest({
        type: "NEXUS_LOCAL_DRY_RUN_SIMULATION",
        planId: plan.planId,
        evaluatedAttempts,
        state,
      })
    : null;

  return Object.freeze({
    schemaVersion:
      "nexus.local-dry-run-dispatch-simulation.v1",
    completed,
    simulationId,
    planId: completed ? plan.planId : null,
    state,
    selectedAttempt,
    evaluatedAttempts: Object.freeze(evaluatedAttempts),
    ownerReviewRequired: completed,
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([...new Set(reasonCodes)]),
    auditRecord: Object.freeze({
      schemaVersion:
        "nexus.local-dry-run-dispatch-simulation.audit.v1",
      occurredAt: now,
      planId: normalizeString(plan.planId),
      simulationId,
      result: state,
      evaluatedAttemptCount: evaluatedAttempts.length,
      selectedProviderId:
        selectedAttempt?.providerId ?? null,
      reasonCodes: Object.freeze([
        ...new Set(reasonCodes),
      ]),
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
    }),
  });
}
