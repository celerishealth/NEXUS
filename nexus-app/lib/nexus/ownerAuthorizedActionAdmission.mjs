import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const REQUIRED_DECISION = "APPROVE";
const ACTIVE_AUTHORITY_STATUS = "ACTIVE";
const VERIFIED_TRUST_STATE = "VERIFIED";
const MAX_RETRY_COUNT = 1;

function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`);

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function safeStringArray(value) {
  return Array.isArray(value)
    ? value.filter((entry) => typeof entry === "string")
    : [];
}

function resolutionSigningPayload(resolution) {
  return {
    actionId: normalizeString(resolution?.actionId),
    authorityEpoch: normalizeString(resolution?.authorityEpoch),
    decision: normalizeString(resolution?.decision),
    expiresAt: normalizeString(resolution?.expiresAt),
    issuedAt: normalizeString(resolution?.issuedAt),
    nonce: normalizeString(resolution?.nonce),
    ownerId: normalizeString(resolution?.ownerId),
    resolutionId: normalizeString(resolution?.resolutionId),
    tenantId: normalizeString(resolution?.tenantId),
  };
}

function calculateSignature(resolution, signingSecret) {
  return createHmac("sha256", signingSecret)
    .update(canonicalize(resolutionSigningPayload(resolution)))
    .digest("hex");
}

function signaturesMatch(expected, received) {
  if (!expected || !received || expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(received, "utf8"),
  );
}

function buildAuditRecord({
  admitted,
  action,
  authority,
  resolution,
  reasonCodes,
  now,
}) {
  return Object.freeze({
    schemaVersion: "nexus.owner-action-admission.audit.v1",
    occurredAt: now,
    tenantId: normalizeString(action?.tenantId),
    actionId: normalizeString(action?.actionId),
    actionType: normalizeString(action?.actionType),
    ownerId: normalizeString(authority?.ownerId),
    resolutionId: normalizeString(resolution?.resolutionId),
    authorityEpoch: normalizeString(authority?.authorityEpoch),
    result: admitted ? "ADMITTED_PREVIEW_ONLY" : "DENIED_FAIL_CLOSED",
    reasonCodes: Object.freeze([...reasonCodes]),
    previewOnly: true,
    externalExecutionPerformed: false,
    persistencePerformed: false,
  });
}

export function createSignedOwnerResolution({
  tenantId,
  ownerId,
  actionId,
  resolutionId,
  authorityEpoch,
  nonce,
  issuedAt,
  expiresAt,
  decision = REQUIRED_DECISION,
  signingSecret,
}) {
  if (!normalizeString(signingSecret)) {
    throw new Error("A signing secret is required.");
  }

  const unsignedResolution = {
    tenantId: normalizeString(tenantId),
    ownerId: normalizeString(ownerId),
    actionId: normalizeString(actionId),
    resolutionId: normalizeString(resolutionId),
    authorityEpoch: normalizeString(authorityEpoch),
    nonce: normalizeString(nonce),
    issuedAt: normalizeString(issuedAt),
    expiresAt: normalizeString(expiresAt),
    decision: normalizeString(decision),
  };

  return Object.freeze({
    ...unsignedResolution,
    signature: calculateSignature(unsignedResolution, signingSecret),
  });
}

export function evaluateOwnerAuthorizedActionAdmission(input = {}) {
  const action = input.action ?? {};
  const authority = input.authority ?? {};
  const resolution = input.resolution ?? {};
  const replay = input.replay ?? {};
  const signingSecret = normalizeString(input.signingSecret);
  const now = normalizeString(input.now) || new Date().toISOString();
  const reasonCodes = [];

  const actionTenantId = normalizeString(action.tenantId);
  const actionId = normalizeString(action.actionId);
  const payloadDigest = normalizeString(action.payloadDigest);

  const authorityTenantId = normalizeString(authority.tenantId);
  const authorityOwnerId = normalizeString(authority.ownerId);
  const authorityEpoch = normalizeString(authority.authorityEpoch);

  const resolutionTenantId = normalizeString(resolution.tenantId);
  const resolutionOwnerId = normalizeString(resolution.ownerId);
  const resolutionActionId = normalizeString(resolution.actionId);
  const resolutionId = normalizeString(resolution.resolutionId);
  const resolutionEpoch = normalizeString(resolution.authorityEpoch);
  const resolutionNonce = normalizeString(resolution.nonce);

  if (
    !actionTenantId ||
    !actionId ||
    !normalizeString(action.actionType) ||
    !payloadDigest
  ) {
    reasonCodes.push("ACTION_IDENTITY_INCOMPLETE");
  }

  if (
    !authorityTenantId ||
    !authorityOwnerId ||
    !authorityEpoch
  ) {
    reasonCodes.push("OWNER_AUTHORITY_INCOMPLETE");
  }

  if (
    !resolutionTenantId ||
    !resolutionOwnerId ||
    !resolutionActionId ||
    !resolutionId ||
    !resolutionEpoch ||
    !resolutionNonce
  ) {
    reasonCodes.push("SIGNED_RESOLUTION_INCOMPLETE");
  }

  if (
    actionTenantId !== authorityTenantId ||
    actionTenantId !== resolutionTenantId
  ) {
    reasonCodes.push("TENANT_ISOLATION_VIOLATION");
  }

  if (actionId !== resolutionActionId) {
    reasonCodes.push("ACTION_BINDING_MISMATCH");
  }

  if (authorityOwnerId !== resolutionOwnerId) {
    reasonCodes.push("OWNER_BINDING_MISMATCH");
  }

  if (authorityEpoch !== resolutionEpoch) {
    reasonCodes.push("AUTHORITY_EPOCH_MISMATCH");
  }

  if (normalizeString(authority.status) !== ACTIVE_AUTHORITY_STATUS) {
    reasonCodes.push("OWNER_AUTHORITY_NOT_ACTIVE");
  }

  if (normalizeString(authority.trustState) !== VERIFIED_TRUST_STATE) {
    reasonCodes.push("OWNER_AUTHORITY_NOT_VERIFIED");
  }

  if (normalizeString(resolution.decision) !== REQUIRED_DECISION) {
    reasonCodes.push("OWNER_APPROVAL_ABSENT");
  }

  const issuedAtMs = Date.parse(normalizeString(resolution.issuedAt));
  const expiresAtMs = Date.parse(normalizeString(resolution.expiresAt));
  const nowMs = Date.parse(now);

  if (
    !Number.isFinite(issuedAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    !Number.isFinite(nowMs)
  ) {
    reasonCodes.push("RESOLUTION_TIME_INVALID");
  } else {
    if (issuedAtMs > nowMs) {
      reasonCodes.push("RESOLUTION_NOT_YET_VALID");
    }

    if (expiresAtMs <= nowMs) {
      reasonCodes.push("RESOLUTION_EXPIRED");
    }

    if (expiresAtMs <= issuedAtMs) {
      reasonCodes.push("RESOLUTION_TIME_WINDOW_INVALID");
    }
  }

  if (!signingSecret) {
    reasonCodes.push("SIGNING_AUTHORITY_UNAVAILABLE");
  } else {
    const expectedSignature = calculateSignature(
      resolution,
      signingSecret,
    );

    if (
      !signaturesMatch(
        expectedSignature,
        normalizeString(resolution.signature),
      )
    ) {
      reasonCodes.push("RESOLUTION_SIGNATURE_INVALID");
    }
  }

  const consumedResolutionIds = safeStringArray(
    replay.consumedResolutionIds,
  );
  const consumedNonces = safeStringArray(replay.consumedNonces);
  const retryCount = Number(replay.retryCount ?? 0);

  if (consumedResolutionIds.includes(resolutionId)) {
    reasonCodes.push("RESOLUTION_REPLAY_BLOCKED");
  }

  if (consumedNonces.includes(resolutionNonce)) {
    reasonCodes.push("NONCE_REPLAY_BLOCKED");
  }

  if (
    !Number.isInteger(retryCount) ||
    retryCount < 0 ||
    retryCount > MAX_RETRY_COUNT
  ) {
    reasonCodes.push("SINGLE_RETRY_LIMIT_EXCEEDED");
  }

  if (replay.permanentOutcome === true) {
    reasonCodes.push("PERMANENT_OUTCOME_ALREADY_RECORDED");
  }

  const admitted = reasonCodes.length === 0;

  const admissionToken = admitted
    ? createHash("sha256")
        .update(
          canonicalize({
            tenantId: actionTenantId,
            actionId,
            payloadDigest,
            ownerId: authorityOwnerId,
            authorityEpoch,
            resolutionId,
            resolutionNonce,
          }),
        )
        .digest("hex")
    : null;

  return Object.freeze({
    schemaVersion: "nexus.owner-authorized-action-admission.v1",
    admitted,
    mode: "PREVIEW_ONLY_NO_EXECUTION",
    admissionToken,
    retryPolicy: Object.freeze({
      maximumRetryCount: MAX_RETRY_COUNT,
      currentRetryCount: Number.isInteger(retryCount)
        ? retryCount
        : null,
      permanentOutcomeLocked: replay.permanentOutcome === true,
    }),
    reasonCodes: Object.freeze([...reasonCodes]),
    auditRecord: buildAuditRecord({
      admitted,
      action,
      authority,
      resolution,
      reasonCodes,
      now,
    }),
  });
}
