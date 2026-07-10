import { createHash } from "node:crypto";

const EXPECTED_ADMISSION_SCHEMA =
  "nexus.owner-authorized-action-admission.v1";
const MAXIMUM_RETRY_COUNT = 1;

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

function normalizeAdapters(adapters, requiredCapability) {
  if (!Array.isArray(adapters)) {
    return [];
  }

  return adapters
    .map((adapter) => ({
      adapterId: normalizeString(adapter?.adapterId),
      providerId: normalizeString(adapter?.providerId),
      status: normalizeString(adapter?.status),
      priority: Number(adapter?.priority),
      capabilities: Array.isArray(adapter?.capabilities)
        ? adapter.capabilities
            .map(normalizeString)
            .filter(Boolean)
        : [],
    }))
    .filter(
      (adapter) =>
        adapter.adapterId &&
        adapter.providerId &&
        adapter.status === "HEALTHY" &&
        Number.isInteger(adapter.priority) &&
        adapter.priority >= 0 &&
        adapter.capabilities.includes(requiredCapability),
    )
    .sort(
      (left, right) =>
        left.priority - right.priority ||
        left.adapterId.localeCompare(right.adapterId),
    );
}

function buildAuditRecord({
  prepared,
  action,
  admission,
  reasonCodes,
  failoverChain,
  now,
}) {
  return Object.freeze({
    schemaVersion:
      "nexus.provider-independent-recovery-handoff.audit.v1",
    occurredAt: now,
    tenantId: normalizeString(action?.tenantId),
    actionId: normalizeString(action?.actionId),
    admissionToken: normalizeString(admission?.admissionToken),
    result: prepared
      ? "HANDOFF_PREPARED_PREVIEW_ONLY"
      : "HANDOFF_DENIED_FAIL_CLOSED",
    reasonCodes: Object.freeze([...reasonCodes]),
    providerCount: failoverChain.length,
    providerIds: Object.freeze(
      failoverChain.map((entry) => entry.providerId),
    ),
    persistencePerformed: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
  });
}

export function createProviderIndependentRecoveryHandoff(
  input = {},
) {
  const action = input.action ?? {};
  const admission = input.admission ?? {};
  const recovery = input.recovery ?? {};
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

  const admissionAudit = admission.auditRecord ?? {};

  if (
    normalizeString(admissionAudit.tenantId) !== tenantId ||
    normalizeString(admissionAudit.actionId) !== actionId
  ) {
    reasonCodes.push("ADMISSION_ACTION_BINDING_MISMATCH");
  }

  if (
    admissionAudit.externalExecutionPerformed !== false ||
    admissionAudit.persistencePerformed !== false
  ) {
    reasonCodes.push("ADMISSION_SAFETY_BOUNDARY_INVALID");
  }

  if (admissionAudit.result !== "ADMITTED_PREVIEW_ONLY") {
    reasonCodes.push("ADMISSION_AUDIT_RESULT_INVALID");
  }

  const retryCount = Number(recovery.retryCount ?? 0);

  if (
    !Number.isInteger(retryCount) ||
    retryCount < 0 ||
    retryCount > MAXIMUM_RETRY_COUNT
  ) {
    reasonCodes.push("RECOVERY_RETRY_LIMIT_EXCEEDED");
  }

  if (recovery.permanentOutcome === true) {
    reasonCodes.push("PERMANENT_OUTCOME_ALREADY_RECORDED");
  }

  const failoverChain = normalizeAdapters(
    input.adapters,
    actionType,
  );

  const adapterIds = failoverChain.map(
    (adapter) => adapter.adapterId,
  );
  const providerIds = failoverChain.map(
    (adapter) => adapter.providerId,
  );

  if (new Set(adapterIds).size !== adapterIds.length) {
    reasonCodes.push("DUPLICATE_ADAPTER_ID_BLOCKED");
  }

  if (failoverChain.length === 0) {
    reasonCodes.push("HEALTHY_CAPABLE_ADAPTER_UNAVAILABLE");
  }

  if (new Set(providerIds).size < 2) {
    reasonCodes.push("PROVIDER_FAILOVER_UNAVAILABLE");
  }

  const prepared = reasonCodes.length === 0;

  const handoffIdentity = prepared
    ? {
        tenantId,
        actionId,
        actionType,
        payloadDigest,
        admissionToken,
        retryCount,
        adapterIds,
        providerIds,
      }
    : null;

  const handoffId = prepared
    ? digest({
        type: "NEXUS_PROVIDER_INDEPENDENT_HANDOFF",
        ...handoffIdentity,
      })
    : null;

  const recoveryCheckpoint = prepared
    ? Object.freeze({
        schemaVersion:
          "nexus.provider-independent-recovery-checkpoint.v1",
        checkpointId: digest({
          type: "NEXUS_RECOVERY_CHECKPOINT",
          handoffId,
          retryCount,
          permanentOutcome: false,
        }),
        handoffId,
        tenantId,
        actionId,
        retryCount,
        maximumRetryCount: MAXIMUM_RETRY_COUNT,
        permanentOutcome: false,
        nextState: "CONTROLLED_EXECUTION_REVIEW_REQUIRED",
        ownerReauthorizationRequiredAfterFailure:
          retryCount >= MAXIMUM_RETRY_COUNT,
        persistencePerformed: false,
      })
    : null;

  return Object.freeze({
    schemaVersion:
      "nexus.provider-independent-recovery-handoff.v1",
    prepared,
    mode: "PREVIEW_ONLY_NO_EXECUTION",
    handoffId,
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    selectedPrimaryAdapter: prepared
      ? Object.freeze({ ...failoverChain[0] })
      : null,
    failoverChain: Object.freeze(
      failoverChain.map((adapter) =>
        Object.freeze({ ...adapter }),
      ),
    ),
    recoveryCheckpoint,
    reasonCodes: Object.freeze([...reasonCodes]),
    auditRecord: buildAuditRecord({
      prepared,
      action,
      admission,
      reasonCodes,
      failoverChain,
      now,
    }),
  });
}
