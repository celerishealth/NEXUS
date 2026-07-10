import { createHash } from "node:crypto";

const EXPECTED_ADMISSION_SCHEMA =
  "nexus.owner-authorized-action-admission.v1";

const EXPECTED_HANDOFF_SCHEMA =
  "nexus.provider-independent-recovery-handoff.v1";

const READY_STATE = "READY_FOR_OWNER_CLAIM";
const CLAIMED_STATE = "CLAIMED_FOR_CONTROLLED_REVIEW";
const MAXIMUM_CLAIM_LEASE_MS = 15 * 60 * 1000;

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

function safeStringArray(value) {
  return Array.isArray(value)
    ? value
        .map(normalizeString)
        .filter(Boolean)
    : [];
}

function buildIntentAudit({
  created,
  action,
  admission,
  handoff,
  reasonCodes,
  now,
}) {
  return Object.freeze({
    schemaVersion:
      "nexus.controlled-execution-intent.audit.v1",
    occurredAt: now,
    tenantId: normalizeString(action?.tenantId),
    actionId: normalizeString(action?.actionId),
    ownerId: normalizeString(
      admission?.auditRecord?.ownerId,
    ),
    admissionToken: normalizeString(
      admission?.admissionToken,
    ),
    handoffId: normalizeString(handoff?.handoffId),
    result: created
      ? "INTENT_CREATED_PREVIEW_ONLY"
      : "INTENT_DENIED_FAIL_CLOSED",
    reasonCodes: Object.freeze([...reasonCodes]),
    executionAuthorized: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
  });
}

export function createControlledExecutionIntent(input = {}) {
  const action = input.action ?? {};
  const admission = input.admission ?? {};
  const handoff = input.handoff ?? {};
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

  if (admission.schemaVersion !== EXPECTED_ADMISSION_SCHEMA) {
    reasonCodes.push("ADMISSION_SCHEMA_UNTRUSTED");
  }

  if (admission.admitted !== true) {
    reasonCodes.push("OWNER_AUTHORIZED_ADMISSION_REQUIRED");
  }

  if (admission.mode !== "PREVIEW_ONLY_NO_EXECUTION") {
    reasonCodes.push("ADMISSION_MODE_INVALID");
  }

  const admissionToken = normalizeString(
    admission.admissionToken,
  );

  if (!/^[a-f0-9]{64}$/.test(admissionToken)) {
    reasonCodes.push("ADMISSION_TOKEN_INVALID");
  }

  if (
    normalizeString(admission?.auditRecord?.tenantId) !==
      tenantId ||
    normalizeString(admission?.auditRecord?.actionId) !==
      actionId
  ) {
    reasonCodes.push("ADMISSION_ACTION_BINDING_MISMATCH");
  }

  const ownerId = normalizeString(
    admission?.auditRecord?.ownerId,
  );

  if (!ownerId) {
    reasonCodes.push("OWNER_IDENTITY_UNAVAILABLE");
  }

  if (handoff.schemaVersion !== EXPECTED_HANDOFF_SCHEMA) {
    reasonCodes.push("HANDOFF_SCHEMA_UNTRUSTED");
  }

  if (handoff.prepared !== true) {
    reasonCodes.push("PREPARED_RECOVERY_HANDOFF_REQUIRED");
  }

  if (handoff.mode !== "PREVIEW_ONLY_NO_EXECUTION") {
    reasonCodes.push("HANDOFF_MODE_INVALID");
  }

  const handoffId = normalizeString(handoff.handoffId);

  if (!/^[a-f0-9]{64}$/.test(handoffId)) {
    reasonCodes.push("HANDOFF_ID_INVALID");
  }

  if (
    handoff.executionAuthorized !== false ||
    handoff.externalExecutionPerformed !== false ||
    handoff.providerInvocationPerformed !== false ||
    handoff.persistencePerformed !== false
  ) {
    reasonCodes.push("HANDOFF_SAFETY_BOUNDARY_INVALID");
  }

  if (
    normalizeString(handoff?.auditRecord?.tenantId) !==
      tenantId ||
    normalizeString(handoff?.auditRecord?.actionId) !==
      actionId ||
    normalizeString(
      handoff?.auditRecord?.admissionToken,
    ) !== admissionToken
  ) {
    reasonCodes.push("HANDOFF_ACTION_BINDING_MISMATCH");
  }

  const checkpoint = handoff.recoveryCheckpoint ?? {};

  if (
    normalizeString(checkpoint.tenantId) !== tenantId ||
    normalizeString(checkpoint.actionId) !== actionId ||
    normalizeString(checkpoint.handoffId) !== handoffId
  ) {
    reasonCodes.push("RECOVERY_CHECKPOINT_BINDING_MISMATCH");
  }

  if (
    checkpoint.permanentOutcome !== false ||
    checkpoint.persistencePerformed !== false
  ) {
    reasonCodes.push("RECOVERY_CHECKPOINT_STATE_INVALID");
  }

  const failoverChain = Array.isArray(handoff.failoverChain)
    ? handoff.failoverChain
    : [];

  const providerIds = failoverChain
    .map((adapter) => normalizeString(adapter?.providerId))
    .filter(Boolean);

  if (new Set(providerIds).size < 2) {
    reasonCodes.push("PROVIDER_FAILOVER_UNAVAILABLE");
  }

  const created = reasonCodes.length === 0;

  const intentIdentity = created
    ? {
        tenantId,
        actionId,
        actionType,
        payloadDigest,
        ownerId,
        admissionToken,
        handoffId,
        recoveryCheckpointId: normalizeString(
          checkpoint.checkpointId,
        ),
        providerIds,
      }
    : null;

  const intentId = created
    ? digest({
        type: "NEXUS_CONTROLLED_EXECUTION_INTENT",
        ...intentIdentity,
      })
    : null;

  return Object.freeze({
    schemaVersion:
      "nexus.controlled-execution-intent.v1",
    created,
    intentId,
    state: created ? READY_STATE : "DENIED_FAIL_CLOSED",
    mode: "PREVIEW_ONLY_NO_EXECUTION",
    tenantId: created ? tenantId : null,
    actionId: created ? actionId : null,
    actionType: created ? actionType : null,
    ownerId: created ? ownerId : null,
    admissionToken: created ? admissionToken : null,
    handoffId: created ? handoffId : null,
    providerIds: Object.freeze([...providerIds]),
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([...reasonCodes]),
    auditRecord: buildIntentAudit({
      created,
      action,
      admission,
      handoff,
      reasonCodes,
      now,
    }),
  });
}

export function claimControlledExecutionIntent(
  input = {},
) {
  const intent = input.intent ?? {};
  const claim = input.claim ?? {};
  const replay = input.replay ?? {};
  const now =
    normalizeString(input.now) || new Date().toISOString();

  const reasonCodes = [];

  if (
    intent.schemaVersion !==
    "nexus.controlled-execution-intent.v1"
  ) {
    reasonCodes.push("INTENT_SCHEMA_UNTRUSTED");
  }

  if (intent.created !== true) {
    reasonCodes.push("VALID_EXECUTION_INTENT_REQUIRED");
  }

  if (intent.state !== READY_STATE) {
    reasonCodes.push("INTENT_NOT_AVAILABLE_FOR_CLAIM");
  }

  if (
    intent.executionAuthorized !== false ||
    intent.externalExecutionPerformed !== false ||
    intent.providerInvocationPerformed !== false ||
    intent.persistencePerformed !== false
  ) {
    reasonCodes.push("INTENT_SAFETY_BOUNDARY_INVALID");
  }

  const intentId = normalizeString(intent.intentId);
  const tenantId = normalizeString(intent.tenantId);
  const actionId = normalizeString(intent.actionId);
  const ownerId = normalizeString(intent.ownerId);

  if (!/^[a-f0-9]{64}$/.test(intentId)) {
    reasonCodes.push("INTENT_ID_INVALID");
  }

  const claimId = normalizeString(claim.claimId);
  const claimIntentId = normalizeString(claim.intentId);
  const claimTenantId = normalizeString(claim.tenantId);
  const claimActionId = normalizeString(claim.actionId);
  const claimantOwnerId = normalizeString(claim.ownerId);
  const claimantRole = normalizeString(claim.role);

  if (
    !claimId ||
    !claimIntentId ||
    !claimTenantId ||
    !claimActionId ||
    !claimantOwnerId
  ) {
    reasonCodes.push("CLAIM_IDENTITY_INCOMPLETE");
  }

  if (
    claimIntentId !== intentId ||
    claimTenantId !== tenantId ||
    claimActionId !== actionId
  ) {
    reasonCodes.push("CLAIM_INTENT_BINDING_MISMATCH");
  }

  if (
    claimantRole !== "OWNER" ||
    claimantOwnerId !== ownerId
  ) {
    reasonCodes.push("TRUSTED_OWNER_CLAIM_REQUIRED");
  }

  const consumedClaimIds = safeStringArray(
    replay.consumedClaimIds,
  );

  if (consumedClaimIds.includes(claimId)) {
    reasonCodes.push("CLAIM_REPLAY_BLOCKED");
  }

  if (replay.activeClaimExists === true) {
    reasonCodes.push("ACTIVE_CLAIM_ALREADY_EXISTS");
  }

  const issuedAtMs = Date.parse(
    normalizeString(claim.issuedAt),
  );

  const expiresAtMs = Date.parse(
    normalizeString(claim.expiresAt),
  );

  const nowMs = Date.parse(now);

  if (
    !Number.isFinite(issuedAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    !Number.isFinite(nowMs)
  ) {
    reasonCodes.push("CLAIM_TIME_INVALID");
  } else {
    if (issuedAtMs > nowMs) {
      reasonCodes.push("CLAIM_NOT_YET_VALID");
    }

    if (expiresAtMs <= nowMs) {
      reasonCodes.push("CLAIM_EXPIRED");
    }

    if (expiresAtMs <= issuedAtMs) {
      reasonCodes.push("CLAIM_TIME_WINDOW_INVALID");
    }

    if (
      expiresAtMs - issuedAtMs >
      MAXIMUM_CLAIM_LEASE_MS
    ) {
      reasonCodes.push("CLAIM_LEASE_TOO_LONG");
    }
  }

  const claimed = reasonCodes.length === 0;

  const claimToken = claimed
    ? digest({
        type: "NEXUS_SINGLE_OWNER_INTENT_CLAIM",
        intentId,
        tenantId,
        actionId,
        ownerId,
        claimId,
        issuedAt: normalizeString(claim.issuedAt),
        expiresAt: normalizeString(claim.expiresAt),
      })
    : null;

  return Object.freeze({
    schemaVersion:
      "nexus.controlled-execution-intent-claim.v1",
    claimed,
    intentId: claimed ? intentId : null,
    claimId: claimed ? claimId : null,
    claimToken,
    previousState: intent.state ?? null,
    state: claimed
      ? CLAIMED_STATE
      : "CLAIM_DENIED_FAIL_CLOSED",
    mode: "CONTROLLED_REVIEW_ONLY_NO_EXECUTION",
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([...reasonCodes]),
    auditRecord: Object.freeze({
      schemaVersion:
        "nexus.controlled-execution-intent-claim.audit.v1",
      occurredAt: now,
      tenantId,
      actionId,
      intentId,
      claimId,
      ownerId: claimantOwnerId,
      result: claimed
        ? "SINGLE_OWNER_CLAIM_ACCEPTED_PREVIEW_ONLY"
        : "CLAIM_DENIED_FAIL_CLOSED",
      reasonCodes: Object.freeze([...reasonCodes]),
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
    }),
  });
}
