import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const EXPECTED_INTENT_SCHEMA =
  "nexus.controlled-execution-intent.v1";

const EXPECTED_CLAIM_SCHEMA =
  "nexus.controlled-execution-intent-claim.v1";

const EXPECTED_PLAN_SCHEMA =
  "nexus.deterministic-dry-run-dispatch-plan.v1";

const EXPECTED_SIMULATION_SCHEMA =
  "nexus.local-dry-run-dispatch-simulation.v1";

const APPROVE_DECISION =
  "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW";

const REJECT_DECISION =
  "REJECT_PERMANENTLY";

const REWORK_DECISION =
  "REQUIRE_REWORK";

const ALLOWED_DECISIONS = new Set([
  APPROVE_DECISION,
  REJECT_DECISION,
  REWORK_DECISION,
]);

const MAXIMUM_REVIEW_WINDOW_MS =
  15 * 60 * 1000;

function normalizeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeStringArray(value) {
  return Array.isArray(value)
    ? value
        .map(normalizeString)
        .filter(Boolean)
    : [];
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

function reviewSigningPayload(review) {
  return {
    tenantId: normalizeString(review?.tenantId),
    ownerId: normalizeString(review?.ownerId),
    actionId: normalizeString(review?.actionId),
    intentId: normalizeString(review?.intentId),
    claimId: normalizeString(review?.claimId),
    planId: normalizeString(review?.planId),
    simulationId: normalizeString(review?.simulationId),
    reviewId: normalizeString(review?.reviewId),
    nonce: normalizeString(review?.nonce),
    decision: normalizeString(review?.decision),
    issuedAt: normalizeString(review?.issuedAt),
    expiresAt: normalizeString(review?.expiresAt),
    ownerCommentDigest: normalizeString(
      review?.ownerCommentDigest,
    ),
  };
}

function calculateReviewSignature(
  review,
  signingSecret,
) {
  return createHmac("sha256", signingSecret)
    .update(canonicalize(reviewSigningPayload(review)))
    .digest("hex");
}

function signaturesMatch(expected, received) {
  if (
    !expected ||
    !received ||
    expected.length !== received.length
  ) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(received, "utf8"),
  );
}

export function createSignedOwnerSimulationReview({
  tenantId,
  ownerId,
  actionId,
  intentId,
  claimId,
  planId,
  simulationId,
  reviewId,
  nonce,
  decision,
  issuedAt,
  expiresAt,
  ownerCommentDigest = "",
  signingSecret,
}) {
  if (!normalizeString(signingSecret)) {
    throw new Error(
      "A review signing secret is required.",
    );
  }

  const unsignedReview = {
    tenantId: normalizeString(tenantId),
    ownerId: normalizeString(ownerId),
    actionId: normalizeString(actionId),
    intentId: normalizeString(intentId),
    claimId: normalizeString(claimId),
    planId: normalizeString(planId),
    simulationId: normalizeString(simulationId),
    reviewId: normalizeString(reviewId),
    nonce: normalizeString(nonce),
    decision: normalizeString(decision),
    issuedAt: normalizeString(issuedAt),
    expiresAt: normalizeString(expiresAt),
    ownerCommentDigest: normalizeString(
      ownerCommentDigest,
    ),
  };

  return Object.freeze({
    ...unsignedReview,
    signature: calculateReviewSignature(
      unsignedReview,
      signingSecret,
    ),
  });
}

export function evaluateOwnerSimulationReview(
  input = {},
) {
  const action = input.action ?? {};
  const intent = input.intent ?? {};
  const claim = input.claim ?? {};
  const plan = input.plan ?? {};
  const simulation = input.simulation ?? {};
  const review = input.review ?? {};
  const replay = input.replay ?? {};

  const signingSecret = normalizeString(
    input.signingSecret,
  );

  const now =
    normalizeString(input.now) ||
    new Date().toISOString();

  const reasonCodes = [];

  const tenantId = normalizeString(
    action.tenantId,
  );

  const actionId = normalizeString(
    action.actionId,
  );

  const ownerId = normalizeString(
    intent.ownerId,
  );

  if (
    !tenantId ||
    !actionId ||
    !normalizeString(action.actionType) ||
    !normalizeString(action.payloadDigest)
  ) {
    reasonCodes.push(
      "ACTION_IDENTITY_INCOMPLETE",
    );
  }

  if (
    intent.schemaVersion !==
    EXPECTED_INTENT_SCHEMA
  ) {
    reasonCodes.push(
      "INTENT_SCHEMA_UNTRUSTED",
    );
  }

  if (intent.created !== true) {
    reasonCodes.push(
      "CONTROLLED_INTENT_REQUIRED",
    );
  }

  if (
    normalizeString(intent.tenantId) !==
      tenantId ||
    normalizeString(intent.actionId) !==
      actionId
  ) {
    reasonCodes.push(
      "INTENT_ACTION_BINDING_MISMATCH",
    );
  }

  if (!ownerId) {
    reasonCodes.push(
      "OWNER_IDENTITY_UNAVAILABLE",
    );
  }

  if (
    claim.schemaVersion !==
    EXPECTED_CLAIM_SCHEMA
  ) {
    reasonCodes.push(
      "CLAIM_SCHEMA_UNTRUSTED",
    );
  }

  if (claim.claimed !== true) {
    reasonCodes.push(
      "TRUSTED_OWNER_CLAIM_REQUIRED",
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
    EXPECTED_PLAN_SCHEMA
  ) {
    reasonCodes.push(
      "PLAN_SCHEMA_UNTRUSTED",
    );
  }

  if (plan.created !== true) {
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
    EXPECTED_SIMULATION_SCHEMA
  ) {
    reasonCodes.push(
      "SIMULATION_SCHEMA_UNTRUSTED",
    );
  }

  if (simulation.completed !== true) {
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
    simulation.ownerReviewRequired !== true
  ) {
    reasonCodes.push(
      "OWNER_REVIEW_NOT_REQUESTED",
    );
  }

  const safetyObjects = [
    intent,
    claim,
    plan,
    simulation,
  ];

  const safetyBoundaryInvalid =
    safetyObjects.some(
      (item) =>
        item.executionAuthorized !== false ||
        item.externalExecutionPerformed !== false ||
        item.providerInvocationPerformed !== false ||
        item.persistencePerformed !== false,
    );

  if (safetyBoundaryInvalid) {
    reasonCodes.push(
      "PIPELINE_SAFETY_BOUNDARY_INVALID",
    );
  }

  const reviewTenantId = normalizeString(
    review.tenantId,
  );

  const reviewOwnerId = normalizeString(
    review.ownerId,
  );

  const reviewActionId = normalizeString(
    review.actionId,
  );

  const reviewIntentId = normalizeString(
    review.intentId,
  );

  const reviewClaimId = normalizeString(
    review.claimId,
  );

  const reviewPlanId = normalizeString(
    review.planId,
  );

  const reviewSimulationId = normalizeString(
    review.simulationId,
  );

  const reviewId = normalizeString(
    review.reviewId,
  );

  const reviewNonce = normalizeString(
    review.nonce,
  );

  const decision = normalizeString(
    review.decision,
  );

  if (
    !reviewTenantId ||
    !reviewOwnerId ||
    !reviewActionId ||
    !reviewIntentId ||
    !reviewClaimId ||
    !reviewPlanId ||
    !reviewSimulationId ||
    !reviewId ||
    !reviewNonce
  ) {
    reasonCodes.push(
      "OWNER_REVIEW_IDENTITY_INCOMPLETE",
    );
  }

  if (
    reviewTenantId !== tenantId ||
    reviewOwnerId !== ownerId ||
    reviewActionId !== actionId ||
    reviewIntentId !==
      normalizeString(intent.intentId) ||
    reviewClaimId !==
      normalizeString(claim.claimId) ||
    reviewPlanId !==
      normalizeString(plan.planId) ||
    reviewSimulationId !==
      normalizeString(simulation.simulationId)
  ) {
    reasonCodes.push(
      "OWNER_REVIEW_PIPELINE_BINDING_MISMATCH",
    );
  }

  if (!ALLOWED_DECISIONS.has(decision)) {
    reasonCodes.push(
      "OWNER_REVIEW_DECISION_INVALID",
    );
  }

  if (
    decision === APPROVE_DECISION &&
    (
      simulation.state !==
        "SIMULATED_SUCCESS_FOR_OWNER_REVIEW" ||
      !simulation.selectedAttempt
    )
  ) {
    reasonCodes.push(
      "SUCCESSFUL_SIMULATION_REQUIRED_FOR_APPROVAL",
    );
  }

  const selectedAttempt =
    simulation.selectedAttempt ?? null;

  if (
    decision === APPROVE_DECISION &&
    selectedAttempt
  ) {
    const validDispatchAttempts =
      Array.isArray(plan.dispatchAttempts)
        ? plan.dispatchAttempts
        : [];

    const selectedAttemptExists =
      validDispatchAttempts.some(
        (attempt) =>
          normalizeString(attempt.attemptId) ===
            normalizeString(
              selectedAttempt.attemptId,
            ) &&
          normalizeString(attempt.providerId) ===
            normalizeString(
              selectedAttempt.providerId,
            ) &&
          normalizeString(attempt.adapterId) ===
            normalizeString(
              selectedAttempt.adapterId,
            ),
      );

    if (!selectedAttemptExists) {
      reasonCodes.push(
        "SELECTED_PROVIDER_NOT_IN_DISPATCH_PLAN",
      );
    }
  }

  const issuedAtMs = Date.parse(
    normalizeString(review.issuedAt),
  );

  const expiresAtMs = Date.parse(
    normalizeString(review.expiresAt),
  );

  const nowMs = Date.parse(now);

  if (
    !Number.isFinite(issuedAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    !Number.isFinite(nowMs)
  ) {
    reasonCodes.push(
      "OWNER_REVIEW_TIME_INVALID",
    );
  } else {
    if (issuedAtMs > nowMs) {
      reasonCodes.push(
        "OWNER_REVIEW_NOT_YET_VALID",
      );
    }

    if (expiresAtMs <= nowMs) {
      reasonCodes.push(
        "OWNER_REVIEW_EXPIRED",
      );
    }

    if (expiresAtMs <= issuedAtMs) {
      reasonCodes.push(
        "OWNER_REVIEW_TIME_WINDOW_INVALID",
      );
    }

    if (
      expiresAtMs - issuedAtMs >
      MAXIMUM_REVIEW_WINDOW_MS
    ) {
      reasonCodes.push(
        "OWNER_REVIEW_WINDOW_TOO_LONG",
      );
    }
  }

  if (!signingSecret) {
    reasonCodes.push(
      "OWNER_REVIEW_SIGNING_AUTHORITY_UNAVAILABLE",
    );
  } else {
    const expectedSignature =
      calculateReviewSignature(
        review,
        signingSecret,
      );

    if (
      !signaturesMatch(
        expectedSignature,
        normalizeString(review.signature),
      )
    ) {
      reasonCodes.push(
        "OWNER_REVIEW_SIGNATURE_INVALID",
      );
    }
  }

  const consumedReviewIds =
    safeStringArray(
      replay.consumedReviewIds,
    );

  const consumedNonces =
    safeStringArray(
      replay.consumedNonces,
    );

  if (
    consumedReviewIds.includes(reviewId)
  ) {
    reasonCodes.push(
      "OWNER_REVIEW_REPLAY_BLOCKED",
    );
  }

  if (
    consumedNonces.includes(reviewNonce)
  ) {
    reasonCodes.push(
      "OWNER_REVIEW_NONCE_REPLAY_BLOCKED",
    );
  }

  if (
    replay.permanentResolutionExists === true
  ) {
    reasonCodes.push(
      "PERMANENT_OWNER_RESOLUTION_ALREADY_EXISTS",
    );
  }

  const accepted =
    reasonCodes.length === 0;

  let state =
    "OWNER_REVIEW_DENIED_FAIL_CLOSED";

  if (accepted) {
    if (decision === APPROVE_DECISION) {
      state =
        "APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW";
    } else if (
      decision === REJECT_DECISION
    ) {
      state =
        "REJECTED_PERMANENTLY";
    } else {
      state =
        "REWORK_REQUIRED";
    }
  }

  const resolutionId = accepted
    ? digest({
        type:
          "NEXUS_SIGNED_OWNER_SIMULATION_RESOLUTION",
        tenantId,
        ownerId,
        actionId,
        intentId: intent.intentId,
        claimId: claim.claimId,
        planId: plan.planId,
        simulationId:
          simulation.simulationId,
        reviewId,
        decision,
      })
    : null;

  const immutableDispatchCandidate =
    accepted &&
    decision === APPROVE_DECISION
      ? Object.freeze({
          schemaVersion:
            "nexus.immutable-dispatch-candidate.v1",
          candidateId: digest({
            type:
              "NEXUS_IMMUTABLE_DISPATCH_CANDIDATE",
            resolutionId,
            tenantId,
            actionId,
            providerId:
              selectedAttempt.providerId,
            adapterId:
              selectedAttempt.adapterId,
            attemptId:
              selectedAttempt.attemptId,
          }),
          resolutionId,
          tenantId,
          actionId,
          ownerId,
          intentId: intent.intentId,
          claimId: claim.claimId,
          planId: plan.planId,
          simulationId:
            simulation.simulationId,
          selectedAttemptId:
            selectedAttempt.attemptId,
          selectedProviderId:
            selectedAttempt.providerId,
          selectedAdapterId:
            selectedAttempt.adapterId,
          state:
            "CONTROLLED_EXECUTION_REVIEW_REQUIRED",
          executionAuthorized: false,
          providerInvocationPerformed: false,
          persistencePerformed: false,
        })
      : null;

  const permanentStopRecord =
    accepted &&
    decision === REJECT_DECISION
      ? Object.freeze({
          schemaVersion:
            "nexus.owner-permanent-stop-record.v1",
          permanentStopId: digest({
            type:
              "NEXUS_OWNER_PERMANENT_STOP",
            resolutionId,
            tenantId,
            actionId,
            simulationId:
              simulation.simulationId,
          }),
          resolutionId,
          tenantId,
          actionId,
          ownerId,
          blocksFutureExecution: true,
          reason:
            "OWNER_REJECTED_SIMULATED_DISPATCH",
          executionAuthorized: false,
          providerInvocationPerformed: false,
          persistencePerformed: false,
        })
      : null;

  const reworkRecord =
    accepted &&
    decision === REWORK_DECISION
      ? Object.freeze({
          schemaVersion:
            "nexus.owner-rework-record.v1",
          reworkId: digest({
            type:
              "NEXUS_OWNER_REWORK_REQUIRED",
            resolutionId,
            tenantId,
            actionId,
            simulationId:
              simulation.simulationId,
          }),
          resolutionId,
          tenantId,
          actionId,
          ownerId,
          nextState:
            "RETURN_TO_CONTROLLED_PLANNING",
          executionAuthorized: false,
          providerInvocationPerformed: false,
          persistencePerformed: false,
        })
      : null;

  return Object.freeze({
    schemaVersion:
      "nexus.signed-owner-simulation-resolution.v1",
    accepted,
    resolutionId,
    decision: accepted ? decision : null,
    state,
    immutableDispatchCandidate,
    permanentStopRecord,
    reworkRecord,
    executionAuthorized: false,
    externalExecutionPerformed: false,
    providerInvocationPerformed: false,
    persistencePerformed: false,
    reasonCodes: Object.freeze([
      ...reasonCodes,
    ]),
    auditRecord: Object.freeze({
      schemaVersion:
        "nexus.signed-owner-simulation-resolution.audit.v1",
      occurredAt: now,
      tenantId,
      actionId,
      ownerId,
      intentId: normalizeString(
        intent.intentId,
      ),
      claimId: normalizeString(
        claim.claimId,
      ),
      planId: normalizeString(
        plan.planId,
      ),
      simulationId: normalizeString(
        simulation.simulationId,
      ),
      reviewId,
      decision,
      result: state,
      permanentOutcome:
        accepted &&
        decision === REJECT_DECISION,
      reasonCodes: Object.freeze([
        ...reasonCodes,
      ]),
      executionAuthorized: false,
      externalExecutionPerformed: false,
      providerInvocationPerformed: false,
      persistencePerformed: false,
    }),
  });
}
