import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../../lib/nexus/ownerAuthorizedActionAdmission.mjs";

import {
  createProviderIndependentRecoveryHandoff,
} from "../../lib/nexus/providerIndependentRecoveryHandoff.mjs";

import {
  claimControlledExecutionIntent,
  createControlledExecutionIntent,
} from "../../lib/nexus/controlledExecutionIntent.mjs";

import {
  createDeterministicDryRunDispatchPlan,
  simulateDryRunDispatch,
} from "../../lib/nexus/dryRunDispatchPlan.mjs";

import {
  createSignedOwnerSimulationReview,
  evaluateOwnerSimulationReview,
} from "../../lib/nexus/ownerSimulationReview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET =
  "nexus-day-665-dashboard-secret";

const NOW =
  "2026-07-10T10:00:00.000Z";

function buildScenario({
  decision,
  forged = false,
  replayed = false,
}) {
  const action = {
    tenantId:
      "tenant-owner-review-preview",
    actionId:
      "action-owner-review-preview",
    actionType:
      "SAFE_DRAFT_ADMISSION",
    payloadDigest:
      "sha256:owner-review-preview",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId:
      "owner-review-preview",
    authorityEpoch:
      "owner-review-epoch-665",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const admissionResolution =
    createSignedOwnerResolution({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      resolutionId:
        "admission-resolution-665",
      authorityEpoch:
        authority.authorityEpoch,
      nonce:
        "admission-nonce-665",
      issuedAt:
        "2026-07-10T09:55:00.000Z",
      expiresAt:
        "2026-07-10T10:15:00.000Z",
      signingSecret: SECRET,
    });

  const admission =
    evaluateOwnerAuthorizedActionAdmission({
      action,
      authority,
      resolution:
        admissionResolution,
      replay: {
        consumedResolutionIds: [],
        consumedNonces: [],
        retryCount: 0,
        permanentOutcome: false,
      },
      signingSecret: SECRET,
      now: NOW,
    });

  const adapters = [
    {
      adapterId:
        "adapter-alpha-review",
      providerId:
        "provider-alpha-review",
      status: "HEALTHY",
      priority: 1,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
    {
      adapterId:
        "adapter-beta-review",
      providerId:
        "provider-beta-review",
      status: "HEALTHY",
      priority: 2,
      capabilities: [
        "SAFE_DRAFT_ADMISSION",
      ],
    },
  ];

  const handoff =
    createProviderIndependentRecoveryHandoff({
      action,
      admission,
      adapters,
      recovery: {
        retryCount: 0,
        permanentOutcome: false,
      },
      now: NOW,
    });

  const intent =
    createControlledExecutionIntent({
      action,
      admission,
      handoff,
      now: NOW,
    });

  const claim =
    claimControlledExecutionIntent({
      intent,
      claim: {
        claimId:
          "owner-review-claim-665",
        intentId: intent.intentId,
        tenantId: action.tenantId,
        actionId: action.actionId,
        ownerId: authority.ownerId,
        role: "OWNER",
        issuedAt:
          "2026-07-10T09:59:00.000Z",
        expiresAt:
          "2026-07-10T10:10:00.000Z",
      },
      replay: {
        consumedClaimIds: [],
        activeClaimExists: false,
      },
      now: NOW,
    });

  const adapterManifests =
    adapters.map((adapter) => ({
      adapterId: adapter.adapterId,
      providerId: adapter.providerId,
      contractVersion:
        "nexus.adapter.contract.v1",
      status: "READY",
      supportsDryRun: true,
      externalInvocationRequired:
        false,
    }));

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests,
      now: NOW,
    });

  const outcomes = Object.fromEntries(
    plan.dispatchAttempts.map(
      (attempt, index) => [
        attempt.attemptId,
        index === 0
          ? "SIMULATED_RETRYABLE_FAILURE"
          : "SIMULATED_SUCCESS",
      ],
    ),
  );

  const simulation =
    simulateDryRunDispatch({
      plan,
      outcomes,
      now: NOW,
    });

  const review =
    createSignedOwnerSimulationReview({
      tenantId: action.tenantId,
      ownerId: authority.ownerId,
      actionId: action.actionId,
      intentId: intent.intentId,
      claimId: claim.claimId,
      planId: plan.planId,
      simulationId:
        simulation.simulationId,
      reviewId:
        `review-${decision.toLowerCase()}`,
      nonce:
        `nonce-${decision.toLowerCase()}`,
      decision,
      issuedAt:
        "2026-07-10T10:00:00.000Z",
      expiresAt:
        "2026-07-10T10:10:00.000Z",
      ownerCommentDigest:
        "sha256:owner-reviewed",
      signingSecret: SECRET,
    });

  const finalReview = forged
    ? {
        ...review,
        signature: "0".repeat(64),
      }
    : review;

  return evaluateOwnerSimulationReview({
    action,
    intent,
    claim,
    plan,
    simulation,
    review: finalReview,
    replay: {
      consumedReviewIds: replayed
        ? [review.reviewId]
        : [],
      consumedNonces: [],
      permanentResolutionExists:
        false,
    },
    signingSecret: SECRET,
    now: NOW,
  });
}

function ReviewCard({
  title,
  resolution,
}) {
  return (
    <article
      style={{
        padding: 22,
        borderRadius: 18,
        border:
          "1px solid rgba(148,163,184,0.24)",
        background:
          "rgba(15,23,42,0.84)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 19,
          }}
        >
          {title}
        </h2>

        <strong
          style={{
            padding: "7px 12px",
            borderRadius: 999,
            background:
              resolution.accepted
                ? "rgba(34,197,94,0.16)"
                : "rgba(239,68,68,0.16)",
          }}
        >
          {resolution.accepted
            ? "ACCEPTED"
            : "BLOCKED"}
        </strong>
      </div>

      <p style={{ color: "#94a3b8" }}>
        {resolution.state}
      </p>

      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.8,
        }}
      >
        <div>
          Signed owner decision:{" "}
          <strong>
            {resolution.decision ??
              "Invalid"}
          </strong>
        </div>

        <div>
          Dispatch candidate:{" "}
          <strong>
            {resolution
              .immutableDispatchCandidate
              ? "Created"
              : "Not created"}
          </strong>
        </div>

        <div>
          Permanent stop:{" "}
          <strong>
            {resolution
              .permanentStopRecord
              ? "Created"
              : "No"}
          </strong>
        </div>

        <div>
          Execution authorized:{" "}
          <strong>No</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background:
            "rgba(2,6,23,0.72)",
          color: "#cbd5e1",
          overflowWrap: "anywhere",
        }}
      >
        {resolution.reasonCodes.length
          ? resolution.reasonCodes.join(
              " · ",
            )
          : "SIGNATURE_VALID · PIPELINE_BOUND · OWNER_RESOLUTION_IMMUTABLE"}
      </div>
    </article>
  );
}

export default function OwnerReviewPage() {
  const approved = buildScenario({
    decision:
      "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
  });

  const rejected = buildScenario({
    decision:
      "REJECT_PERMANENTLY",
  });

  const forged = buildScenario({
    decision:
      "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
    forged: true,
  });

  const replayed = buildScenario({
    decision:
      "APPROVE_FOR_CONTROLLED_EXECUTION_REVIEW",
    replayed: true,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "54px 24px",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 54%)",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            letterSpacing: "0.16em",
            color: "#60a5fa",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          NEXUS DAY 665 · OWNER REVIEW PLANE
        </p>

        <h1
          style={{
            maxWidth: 980,
            margin: "18px 0",
            fontSize:
              "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          No simulated dispatch advances
          without a fresh, signed owner
          resolution.
        </h1>

        <p
          style={{
            maxWidth: 880,
            marginBottom: 34,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          The owner can approve for another
          controlled review stage, reject
          permanently, or require rework.
          Signatures, tenant binding, pipeline
          identity, expiry, replay prevention,
          and permanent outcomes remain
          fail-closed.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 18,
          }}
        >
          <ReviewCard
            title="Signed owner approval"
            resolution={approved}
          />

          <ReviewCard
            title="Permanent owner rejection"
            resolution={rejected}
          />

          <ReviewCard
            title="Forged review signature"
            resolution={forged}
          />

          <ReviewCard
            title="Replayed owner review"
            resolution={replayed}
          />
        </section>

        <section
          style={{
            marginTop: 28,
            padding: 22,
            borderRadius: 18,
            border:
              "1px solid rgba(96,165,250,0.25)",
            background:
              "rgba(30,58,138,0.16)",
          }}
        >
          <strong>
            Approval is not execution
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            An approved result creates only an
            immutable candidate for another
            controlled review stage. No
            provider, database, payment,
            WhatsApp channel, customer action,
            migration, or AI action is
            executed.
          </p>
        </section>
      </div>
    </main>
  );
}
