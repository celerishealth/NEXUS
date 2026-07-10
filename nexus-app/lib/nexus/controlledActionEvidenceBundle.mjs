import { createHash } from "node:crypto";

const EXPECTED_SCHEMAS = Object.freeze({
  admission:
    "nexus.owner-authorized-action-admission.v1",
  handoff:
    "nexus.provider-independent-recovery-handoff.v1",
  intent:
    "nexus.controlled-execution-intent.v1",
  claim:
    "nexus.controlled-execution-intent-claim.v1",
  plan:
    "nexus.deterministic-dry-run-dispatch-plan.v1",
  simulation:
    "nexus.local-dry-run-dispatch-simulation.v1",
  ownerResolution:
    "nexus.signed-owner-simulation-resolution.v1",
});

const STAGE_ORDER = Object.freeze([
  "OWNER_AUTHORIZED_ADMISSION",
  "PROVIDER_INDEPENDENT_HANDOFF",
  "CONTROLLED_EXECUTION_INTENT",
  "SINGLE_OWNER_CLAIM",
  "DRY_RUN_DISPATCH_PLAN",
  "LOCAL_FAILOVER_SIMULATION",
  "SIGNED_OWNER_RESOLUTION",
]);

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
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

function isSha256(value) {
  return /^[a-f0-9]{64}$/.test(
    normalizeString(value),
  );
}

function uniqueStrings(values) {
  return [
    ...new Set(
      values
        .map(normalizeString)
        .filter(Boolean),
    ),
  ];
}

function hasLockedSafetyBoundary(value) {
  return (
    value?.executionAuthorized === false &&
    value?.externalExecutionPerformed === false &&
    value?.providerInvocationPerformed === false &&
    value?.persistencePerformed === false
  );
}

function createEvidenceRecord({
  sequence,
  stage,
  previousHash,
  payload,
}) {
  const recordHash = digest({
    type: "NEXUS_CONTROLLED_ACTION_EVIDENCE_RECORD",
    sequence,
    stage,
    previousHash,
    payload,
  });

  return Object.freeze({
    sequence,
    stage,
    previousHash,
    payload: Object.freeze(payload),
    recordHash,
  });
}

export function createControlledActionEvidenceBundle(
  input = {},
) {
  const action = input.action ?? {};
  const admission = input.admission ?? {};
  const handoff = input.handoff ?? {};
  const intent = input.intent ?? {};
  const claim = input.claim ?? {};
  const plan = input.plan ?? {};
  const simulation = input.simulation ?? {};
  const ownerResolution =
    input.ownerResolution ?? {};

  const generatedAt =
    normalizeString(input.generatedAt) ||
    new Date().toISOString();

  const reasonCodes = [];

  const tenantId = normalizeString(
    action.tenantId,
  );

  const actionId = normalizeString(
    action.actionId,
  );

  const actionType = normalizeString(
    action.actionType,
  );

  const payloadDigest = normalizeString(
    action.payloadDigest,
  );

  const ownerId = normalizeString(
    intent.ownerId,
  );

  if (
    !tenantId ||
    !actionId ||
    !actionType ||
    !payloadDigest
  ) {
    reasonCodes.push(
      "ACTION_IDENTITY_INCOMPLETE",
    );
  }

  if (
    admission.schemaVersion !==
      EXPECTED_SCHEMAS.admission ||
    admission.admitted !== true ||
    !isSha256(admission.admissionToken)
  ) {
    reasonCodes.push(
      "VALID_OWNER_ADMISSION_REQUIRED",
    );
  }

  if (
    normalizeString(
      admission?.auditRecord?.tenantId,
    ) !== tenantId ||
    normalizeString(
      admission?.auditRecord?.actionId,
    ) !== actionId
  ) {
    reasonCodes.push(
      "ADMISSION_ACTION_BINDING_MISMATCH",
    );
  }

  if (
    handoff.schemaVersion !==
      EXPECTED_SCHEMAS.handoff ||
    handoff.prepared !== true ||
    !isSha256(handoff.handoffId)
  ) {
    reasonCodes.push(
      "VALID_RECOVERY_HANDOFF_REQUIRED",
    );
  }

  if (
    normalizeString(
      handoff?.auditRecord?.tenantId,
    ) !== tenantId ||
    normalizeString(
      handoff?.auditRecord?.actionId,
    ) !== actionId ||
    normalizeString(
      handoff?.auditRecord?.admissionToken,
    ) !==
      normalizeString(
        admission.admissionToken,
      )
  ) {
    reasonCodes.push(
      "HANDOFF_PIPELINE_BINDING_MISMATCH",
    );
  }

  if (
    intent.schemaVersion !==
      EXPECTED_SCHEMAS.intent ||
    intent.created !== true ||
    !isSha256(intent.intentId)
  ) {
    reasonCodes.push(
      "VALID_CONTROLLED_INTENT_REQUIRED",
    );
  }

  if (
    normalizeString(intent.tenantId) !==
      tenantId ||
    normalizeString(intent.actionId) !==
      actionId ||
    normalizeString(intent.handoffId) !==
      normalizeString(handoff.handoffId)
  ) {
    reasonCodes.push(
      "INTENT_PIPELINE_BINDING_MISMATCH",
    );
  }

  if (!ownerId) {
    reasonCodes.push(
      "OWNER_IDENTITY_UNAVAILABLE",
    );
  }

  if (
    claim.schemaVersion !==
      EXPECTED_SCHEMAS.claim ||
    claim.claimed !== true ||
    !isSha256(claim.claimToken)
  ) {
    reasonCodes.push(
      "VALID_OWNER_CLAIM_REQUIRED",
    );
  }

  if (
    normalizeString(claim.intentId) !==
    normalizeString(intent.intentId)
  ) {
    reasonCodes.push(
      "CLAIM_INTENT_BINDING_MISMATCH",
    );
  }

  if (
    plan.schemaVersion !==
      EXPECTED_SCHEMAS.plan ||
    plan.created !== true ||
    !isSha256(plan.planId)
  ) {
    reasonCodes.push(
      "VALID_DRY_RUN_PLAN_REQUIRED",
    );
  }

  if (
    normalizeString(plan.tenantId) !==
      tenantId ||
    normalizeString(plan.actionId) !==
      actionId ||
    normalizeString(plan.intentId) !==
      normalizeString(intent.intentId) ||
    normalizeString(plan.claimId) !==
      normalizeString(claim.claimId)
  ) {
    reasonCodes.push(
      "PLAN_PIPELINE_BINDING_MISMATCH",
    );
  }

  if (
    simulation.schemaVersion !==
      EXPECTED_SCHEMAS.simulation ||
    simulation.completed !== true ||
    !isSha256(simulation.simulationId)
  ) {
    reasonCodes.push(
      "COMPLETED_SIMULATION_REQUIRED",
    );
  }

  if (
    normalizeString(simulation.planId) !==
    normalizeString(plan.planId)
  ) {
    reasonCodes.push(
      "SIMULATION_PLAN_BINDING_MISMATCH",
    );
  }

  if (
    ownerResolution.schemaVersion !==
      EXPECTED_SCHEMAS.ownerResolution ||
    ownerResolution.accepted !== true ||
    !isSha256(ownerResolution.resolutionId)
  ) {
    reasonCodes.push(
      "ACCEPTED_OWNER_RESOLUTION_REQUIRED",
    );
  }

  const ownerResolutionAudit =
    ownerResolution.auditRecord ?? {};

  if (
    normalizeString(
      ownerResolutionAudit.tenantId,
    ) !== tenantId ||
    normalizeString(
      ownerResolutionAudit.actionId,
    ) !== actionId ||
    normalizeString(
      ownerResolutionAudit.ownerId,
    ) !== ownerId ||
    normalizeString(
      ownerResolutionAudit.intentId,
    ) !== normalizeString(intent.intentId) ||
    normalizeString(
      ownerResolutionAudit.claimId,
    ) !== normalizeString(claim.claimId) ||
    normalizeString(
      ownerResolutionAudit.planId,
    ) !== normalizeString(plan.planId) ||
    normalizeString(
      ownerResolutionAudit.simulationId,
    ) !==
      normalizeString(
        simulation.simulationId,
      )
  ) {
    reasonCodes.push(
      "OWNER_RESOLUTION_PIPELINE_BINDING_MISMATCH",
    );
  }

  const protectedStages = [
    handoff,
    intent,
    claim,
    plan,
    simulation,
    ownerResolution,
  ];

  if (
    protectedStages.some(
      (stage) =>
        !hasLockedSafetyBoundary(stage),
    )
  ) {
    reasonCodes.push(
      "PIPELINE_SAFETY_BOUNDARY_INVALID",
    );
  }

  if (
    admission?.auditRecord
      ?.externalExecutionPerformed !== false ||
    admission?.auditRecord
      ?.persistencePerformed !== false
  ) {
    reasonCodes.push(
      "ADMISSION_SAFETY_BOUNDARY_INVALID",
    );
  }

  const providerIds = uniqueStrings(
    Array.isArray(plan.dispatchAttempts)
      ? plan.dispatchAttempts.map(
          (attempt) => attempt?.providerId,
        )
      : [],
  );

  if (providerIds.length < 2) {
    reasonCodes.push(
      "INDEPENDENT_PROVIDER_EVIDENCE_REQUIRED",
    );
  }

  const created = reasonCodes.length === 0;

  if (!created) {
    return Object.freeze({
      schemaVersion:
        "nexus.controlled-action-evidence-bundle.v1",
      created: false,
      bundleId: null,
      bundleRootHash: null,
      records: Object.freeze([]),
      verificationRequired: true,
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
      reasonCodes: Object.freeze([
        ...new Set(reasonCodes),
      ]),
    });
  }

  const identity = Object.freeze({
    tenantId,
    actionId,
    actionType,
    payloadDigest,
    ownerId,
    admissionToken:
      admission.admissionToken,
    handoffId: handoff.handoffId,
    intentId: intent.intentId,
    claimId: claim.claimId,
    claimToken: claim.claimToken,
    planId: plan.planId,
    simulationId:
      simulation.simulationId,
    ownerResolutionId:
      ownerResolution.resolutionId,
  });

  const genesisHash = digest({
    type:
      "NEXUS_CONTROLLED_ACTION_EVIDENCE_GENESIS",
    identity,
  });

  const stagePayloads = [
    {
      stage: STAGE_ORDER[0],
      payload: {
        schemaVersion:
          admission.schemaVersion,
        admitted: admission.admitted,
        admissionToken:
          admission.admissionToken,
        ownerId:
          admission.auditRecord.ownerId,
        authorityEpoch:
          admission.auditRecord.authorityEpoch,
        result:
          admission.auditRecord.result,
      },
    },
    {
      stage: STAGE_ORDER[1],
      payload: {
        schemaVersion:
          handoff.schemaVersion,
        prepared: handoff.prepared,
        handoffId: handoff.handoffId,
        recoveryCheckpointId:
          handoff.recoveryCheckpoint
            ?.checkpointId ?? null,
        providerIds,
      },
    },
    {
      stage: STAGE_ORDER[2],
      payload: {
        schemaVersion:
          intent.schemaVersion,
        created: intent.created,
        intentId: intent.intentId,
        ownerId: intent.ownerId,
        state: intent.state,
      },
    },
    {
      stage: STAGE_ORDER[3],
      payload: {
        schemaVersion:
          claim.schemaVersion,
        claimed: claim.claimed,
        claimId: claim.claimId,
        claimToken: claim.claimToken,
        state: claim.state,
      },
    },
    {
      stage: STAGE_ORDER[4],
      payload: {
        schemaVersion:
          plan.schemaVersion,
        created: plan.created,
        planId: plan.planId,
        state: plan.state,
        attempts:
          plan.dispatchAttempts.map(
            (attempt) => ({
              attemptId:
                attempt.attemptId,
              sequence:
                attempt.sequence,
              adapterId:
                attempt.adapterId,
              providerId:
                attempt.providerId,
              contractVersion:
                attempt.contractVersion,
            }),
          ),
      },
    },
    {
      stage: STAGE_ORDER[5],
      payload: {
        schemaVersion:
          simulation.schemaVersion,
        completed:
          simulation.completed,
        simulationId:
          simulation.simulationId,
        state: simulation.state,
        selectedAttempt:
          simulation.selectedAttempt
            ? {
                attemptId:
                  simulation
                    .selectedAttempt
                    .attemptId,
                adapterId:
                  simulation
                    .selectedAttempt
                    .adapterId,
                providerId:
                  simulation
                    .selectedAttempt
                    .providerId,
              }
            : null,
        evaluatedAttemptCount:
          simulation.evaluatedAttempts
            .length,
      },
    },
    {
      stage: STAGE_ORDER[6],
      payload: {
        schemaVersion:
          ownerResolution.schemaVersion,
        accepted:
          ownerResolution.accepted,
        resolutionId:
          ownerResolution.resolutionId,
        decision:
          ownerResolution.decision,
        state:
          ownerResolution.state,
        immutableCandidateId:
          ownerResolution
            .immutableDispatchCandidate
            ?.candidateId ?? null,
        permanentStopId:
          ownerResolution
            .permanentStopRecord
            ?.permanentStopId ?? null,
        reworkId:
          ownerResolution
            .reworkRecord
            ?.reworkId ?? null,
      },
    },
  ];

  const records = [];
  let previousHash = genesisHash;

  stagePayloads.forEach(
    ({ stage, payload }, index) => {
      const record = createEvidenceRecord({
        sequence: index + 1,
        stage,
        previousHash,
        payload,
      });

      records.push(record);
      previousHash = record.recordHash;
    },
  );

  const bundleRootHash = previousHash;

  const bundleId = digest({
    type:
      "NEXUS_CONTROLLED_ACTION_EVIDENCE_BUNDLE",
    identity,
    genesisHash,
    bundleRootHash,
    recordCount: records.length,
  });

  return Object.freeze({
    schemaVersion:
      "nexus.controlled-action-evidence-bundle.v1",
    created: true,
    bundleId,
    generatedAt,
    identity,
    genesisHash,
    bundleRootHash,
    recordCount: records.length,
    records: Object.freeze(records),
    verificationRequired: true,
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([]),
    auditRecord: Object.freeze({
      schemaVersion:
        "nexus.controlled-action-evidence-bundle.audit.v1",
      generatedAt,
      tenantId,
      actionId,
      ownerId,
      bundleId,
      bundleRootHash,
      result:
        "TAMPER_EVIDENT_BUNDLE_CREATED",
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
    }),
  });
}

export function verifyControlledActionEvidenceBundle(
  bundle = {},
) {
  const reasonCodes = [];

  if (
    bundle.schemaVersion !==
    "nexus.controlled-action-evidence-bundle.v1"
  ) {
    reasonCodes.push(
      "EVIDENCE_BUNDLE_SCHEMA_UNTRUSTED",
    );
  }

  if (bundle.created !== true) {
    reasonCodes.push(
      "CREATED_EVIDENCE_BUNDLE_REQUIRED",
    );
  }

  if (
    !isSha256(bundle.bundleId) ||
    !isSha256(bundle.genesisHash) ||
    !isSha256(bundle.bundleRootHash)
  ) {
    reasonCodes.push(
      "EVIDENCE_BUNDLE_HASH_IDENTITY_INVALID",
    );
  }

  if (
    bundle.executionAuthorized !== false ||
    bundle.externalExecutionPerformed !== false ||
    bundle.providerInvocationPerformed !== false ||
    bundle.persistencePerformed !== false
  ) {
    reasonCodes.push(
      "EVIDENCE_BUNDLE_SAFETY_BOUNDARY_INVALID",
    );
  }

  const identity = bundle.identity ?? {};

  const expectedGenesisHash = digest({
    type:
      "NEXUS_CONTROLLED_ACTION_EVIDENCE_GENESIS",
    identity,
  });

  if (
    expectedGenesisHash !==
    normalizeString(bundle.genesisHash)
  ) {
    reasonCodes.push(
      "EVIDENCE_GENESIS_HASH_MISMATCH",
    );
  }

  const records = Array.isArray(bundle.records)
    ? bundle.records
    : [];

  if (
    records.length !== STAGE_ORDER.length ||
    bundle.recordCount !== records.length
  ) {
    reasonCodes.push(
      "EVIDENCE_RECORD_COUNT_INVALID",
    );
  }

  let previousHash = expectedGenesisHash;

  records.forEach((record, index) => {
    const expectedStage =
      STAGE_ORDER[index];

    if (
      record.sequence !== index + 1 ||
      record.stage !== expectedStage
    ) {
      reasonCodes.push(
        "EVIDENCE_STAGE_ORDER_INVALID",
      );
    }

    if (
      normalizeString(record.previousHash) !==
      previousHash
    ) {
      reasonCodes.push(
        "EVIDENCE_CHAIN_LINK_MISMATCH",
      );
    }

    const expectedRecordHash = digest({
      type:
        "NEXUS_CONTROLLED_ACTION_EVIDENCE_RECORD",
      sequence: record.sequence,
      stage: record.stage,
      previousHash:
        record.previousHash,
      payload: record.payload,
    });

    if (
      expectedRecordHash !==
      normalizeString(record.recordHash)
    ) {
      reasonCodes.push(
        "EVIDENCE_RECORD_TAMPERING_DETECTED",
      );
    }

    previousHash = expectedRecordHash;
  });

  if (
    previousHash !==
    normalizeString(bundle.bundleRootHash)
  ) {
    reasonCodes.push(
      "EVIDENCE_ROOT_HASH_MISMATCH",
    );
  }

  const expectedBundleId = digest({
    type:
      "NEXUS_CONTROLLED_ACTION_EVIDENCE_BUNDLE",
    identity,
    genesisHash: expectedGenesisHash,
    bundleRootHash: previousHash,
    recordCount: records.length,
  });

  if (
    expectedBundleId !==
    normalizeString(bundle.bundleId)
  ) {
    reasonCodes.push(
      "EVIDENCE_BUNDLE_ID_MISMATCH",
    );
  }

  const valid = reasonCodes.length === 0;

  return Object.freeze({
    schemaVersion:
      "nexus.controlled-action-evidence-verification.v1",
    valid,
    bundleId:
      normalizeString(bundle.bundleId) ||
      null,
    verifiedRecordCount:
      valid ? records.length : 0,
    state: valid
      ? "EVIDENCE_INTEGRITY_VERIFIED"
      : "EVIDENCE_INTEGRITY_REJECTED",
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([
      ...new Set(reasonCodes),
    ]),
  });
}
