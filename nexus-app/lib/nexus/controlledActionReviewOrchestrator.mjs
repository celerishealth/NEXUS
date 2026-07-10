import {
  evaluateOwnerAuthorizedActionAdmission,
} from "./ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "./providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "./controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "./dryRunDispatchPlan.mjs";

import {
  evaluateOwnerSimulationReview,
} from "./ownerSimulationReview.mjs";

import {
  createControlledActionEvidenceBundle,
  verifyControlledActionEvidenceBundle,
} from "./controlledActionEvidenceBundle.mjs";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function uniqueReasonCodes(values) {
  return [
    ...new Set(
      values
        .flat()
        .map(normalizeString)
        .filter(Boolean),
    ),
  ];
}

function createStage({
  key,
  label,
  passed,
  state,
  reasonCodes = [],
}) {
  return Object.freeze({
    key,
    label,
    passed,
    state,
    reasonCodes: Object.freeze(
      uniqueReasonCodes([reasonCodes]),
    ),
  });
}

function createSimulationOutcomes(plan, mode) {
  const attempts = Array.isArray(plan?.dispatchAttempts)
    ? plan.dispatchAttempts
    : [];

  const outcomes = {};

  attempts.forEach((attempt, index) => {
    if (mode === "PRIMARY_SUCCESS") {
      outcomes[attempt.attemptId] =
        "SIMULATED_SUCCESS";
      return;
    }

    if (mode === "FAILOVER_SUCCESS") {
      outcomes[attempt.attemptId] =
        index === 0
          ? "SIMULATED_RETRYABLE_FAILURE"
          : "SIMULATED_SUCCESS";
      return;
    }

    if (mode === "PERMANENT_FAILURE") {
      outcomes[attempt.attemptId] =
        index === 0
          ? "SIMULATED_PERMANENT_FAILURE"
          : "SIMULATED_SUCCESS";
      return;
    }

    if (mode === "FAILOVER_EXHAUSTED") {
      outcomes[attempt.attemptId] =
        "SIMULATED_RETRYABLE_FAILURE";
    }
  });

  return outcomes;
}

function createPreparedStages({
  admission,
  handoff,
  intent,
  claim,
  plan,
  simulation,
}) {
  return Object.freeze([
    createStage({
      key: "admission",
      label: "Owner-authorized admission",
      passed: admission.admitted === true,
      state: admission.admitted
        ? "ADMITTED"
        : "BLOCKED",
      reasonCodes: admission.reasonCodes,
    }),
    createStage({
      key: "handoff",
      label: "Provider-independent handoff",
      passed: handoff.prepared === true,
      state: handoff.prepared
        ? "PREPARED"
        : "BLOCKED",
      reasonCodes: handoff.reasonCodes,
    }),
    createStage({
      key: "intent",
      label: "Controlled execution intent",
      passed: intent.created === true,
      state: intent.state,
      reasonCodes: intent.reasonCodes,
    }),
    createStage({
      key: "claim",
      label: "Single-owner claim",
      passed: claim.claimed === true,
      state: claim.state,
      reasonCodes: claim.reasonCodes,
    }),
    createStage({
      key: "plan",
      label: "Provider dry-run plan",
      passed: plan.created === true,
      state: plan.state,
      reasonCodes: plan.reasonCodes,
    }),
    createStage({
      key: "simulation",
      label: "Local failover simulation",
      passed: simulation.completed === true,
      state: simulation.state,
      reasonCodes: simulation.reasonCodes,
    }),
  ]);
}

function determinePreparationState(stages) {
  const failed = stages.find(
    (stage) => !stage.passed,
  );

  if (!failed) {
    return "READY_FOR_SIGNED_OWNER_REVIEW";
  }

  return `BLOCKED_AT_${failed.key.toUpperCase()}`;
}

export function prepareControlledActionReviewPipeline(
  input = {},
) {
  const action = input.action ?? {};
  const authority = input.authority ?? {};
  const now =
    normalizeString(input.now) ||
    new Date().toISOString();

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action,
      authority,
      resolution: input.resolution,
      replay: input.admissionReplay,
      signingSecret: input.signingSecret,
      now,
    });

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters: input.adapters,
      recovery: input.recovery,
      now,
    });

  const intent =
    createControlledExecutionIntent({
      action,
      admission,
      handoff,
      now,
    });

  const claimInput = {
    ...(input.claim ?? {}),
    intentId:
      input.claim?.intentId ??
      intent.intentId,
    tenantId:
      input.claim?.tenantId ??
      action.tenantId,
    actionId:
      input.claim?.actionId ??
      action.actionId,
    ownerId:
      input.claim?.ownerId ??
      authority.ownerId,
    role:
      input.claim?.role ?? "OWNER",
  };

  const claim =
    claimControlledExecutionIntent({
      intent,
      claim: claimInput,
      replay: input.claimReplay,
      now,
    });

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests:
        input.adapterManifests,
      now,
    });

  const outcomes =
    input.outcomes ??
    createSimulationOutcomes(
      plan,
      normalizeString(
        input.simulationMode,
      ),
    );

  const simulation =
    simulateDryRunDispatch({
      plan,
      outcomes,
      now,
    });

  const stages = createPreparedStages({
    admission,
    handoff,
    intent,
    claim,
    plan,
    simulation,
  });

  const preparedForOwnerReview =
    stages.every((stage) => stage.passed);

  return Object.freeze({
    schemaVersion:
      "nexus.controlled-action-review-preparation.v1",
    preparedForOwnerReview,
    state:
      determinePreparationState(stages),
    action,
    authority,
    admission,
    handoff,
    intent,
    claim,
    plan,
    simulation,
    stages,
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
  });
}

function determineFinalState({
  prepared,
  ownerResolution,
  evidence,
  verification,
}) {
  if (!prepared.preparedForOwnerReview) {
    return prepared.state;
  }

  if (!ownerResolution.accepted) {
    return "BLOCKED_AT_OWNER_REVIEW";
  }

  if (
    !evidence.created ||
    !verification.valid
  ) {
    return "BLOCKED_AT_AUDIT_EVIDENCE";
  }

  if (
    ownerResolution.decision ===
    "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW"
  ) {
    return "OWNER_APPROVED_CANDIDATE_VERIFIED";
  }

  if (
    ownerResolution.decision ===
    "REJECT_PERMANENTLY"
  ) {
    return "OWNER_REJECTED_PERMANENTLY_VERIFIED";
  }

  if (
    ownerResolution.decision ===
    "REQUIRE_REWORK"
  ) {
    return "OWNER_REWORK_REQUIRED_VERIFIED";
  }

  return "BLOCKED_AT_OWNER_DECISION";
}

function determineNextRequiredAction(state) {
  const actions = {
    READY_FOR_SIGNED_OWNER_REVIEW:
      "SIGNED_OWNER_REVIEW_REQUIRED",

    OWNER_APPROVED_CANDIDATE_VERIFIED:
      "CONTROLLED_EXECUTION_REVIEW_REQUIRED",

    OWNER_REJECTED_PERMANENTLY_VERIFIED:
      "NO_FURTHER_ACTION_PERMITTED",

    OWNER_REWORK_REQUIRED_VERIFIED:
      "RETURN_TO_CONTROLLED_PLANNING",
  };

  return actions[state] ??
    "REMEDIATE_BLOCKING_CONTROL";
}

export function finalizeControlledActionReviewPipeline(
  input = {},
) {
  const prepared = input.prepared ?? {};
  const now =
    normalizeString(input.now) ||
    new Date().toISOString();

  const ownerResolution =
    evaluateOwnerSimulationReview({
      action: prepared.action,
      intent: prepared.intent,
      claim: prepared.claim,
      plan: prepared.plan,
      simulation: prepared.simulation,
      review: input.review,
      replay: input.reviewReplay,
      signingSecret: input.signingSecret,
      now,
    });

  const evidence =
    createControlledActionEvidenceBundle({
      action: prepared.action,
      admission: prepared.admission,
      handoff: prepared.handoff,
      intent: prepared.intent,
      claim: prepared.claim,
      plan: prepared.plan,
      simulation: prepared.simulation,
      ownerResolution,
      generatedAt:
        normalizeString(input.generatedAt) ||
        now,
    });

  const verification =
    verifyControlledActionEvidenceBundle(
      evidence,
    );

  const stages = Object.freeze([
    ...(Array.isArray(prepared.stages)
      ? prepared.stages
      : []),

    createStage({
      key: "ownerReview",
      label: "Signed owner resolution",
      passed:
        ownerResolution.accepted === true,
      state: ownerResolution.state,
      reasonCodes:
        ownerResolution.reasonCodes,
    }),

    createStage({
      key: "evidence",
      label: "Tamper-evident audit bundle",
      passed:
        evidence.created === true &&
        verification.valid === true,
      state: verification.state,
      reasonCodes: [
        ...(evidence.reasonCodes ?? []),
        ...(verification.reasonCodes ?? []),
      ],
    }),
  ]);

  const state = determineFinalState({
    prepared,
    ownerResolution,
    evidence,
    verification,
  });

  const completed =
    prepared.preparedForOwnerReview === true &&
    ownerResolution.accepted === true &&
    evidence.created === true &&
    verification.valid === true;

  return Object.freeze({
    schemaVersion:
      "nexus.unified-controlled-action-review.v1",
    completed,
    state,
    nextRequiredAction:
      determineNextRequiredAction(state),
    decision:
      ownerResolution.decision ?? null,
    selectedProviderId:
      prepared.simulation
        ?.selectedAttempt
        ?.providerId ?? null,
    stages,
    prepared,
    ownerResolution,
    evidence,
    verification,
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    publicLaunchAuthorized: false,
    paymentAutomationAuthorized: false,
    whatsappAutoSendAuthorized: false,
    uncontrolledAiActionAuthorized: false,
  });
}
