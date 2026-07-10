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

export const dynamic = "force-dynamic";

const SECRET =
  "nexus-day-663-dashboard-preview-secret";

const NOW = "2026-07-10T10:00:00.000Z";

function buildPipeline() {
  const action = {
    tenantId: "tenant-nexus-preview",
    actionId: "action-dry-run-001",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-663-dashboard-preview",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-dry-run-001",
    authorityEpoch: "authority-epoch-663",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-dry-run-001",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-dry-run-001",
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
      claimId: "claim-dry-run-001",
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

  const plan =
    createDeterministicDryRunDispatchPlan({
      action,
      handoff,
      intent,
      claim,
      adapterManifests: [
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
      ],
      now: NOW,
    });

  return {
    plan,
  };
}

function createSimulation(mode) {
  const { plan } = buildPipeline();

  const outcomes = {};

  plan.dispatchAttempts.forEach((attempt, index) => {
    if (mode === "PRIMARY_SUCCESS") {
      outcomes[attempt.attemptId] =
        "SIMULATED_SUCCESS";
    } else if (mode === "FAILOVER_SUCCESS") {
      outcomes[attempt.attemptId] =
        index === 0
          ? "SIMULATED_RETRYABLE_FAILURE"
          : "SIMULATED_SUCCESS";
    } else if (mode === "PERMANENT_FAILURE") {
      outcomes[attempt.attemptId] =
        index === 0
          ? "SIMULATED_PERMANENT_FAILURE"
          : "SIMULATED_SUCCESS";
    } else {
      outcomes[attempt.attemptId] =
        "SIMULATED_RETRYABLE_FAILURE";
    }
  });

  return simulateDryRunDispatch({
    plan,
    outcomes,
    now: NOW,
  });
}

function StatusCard({ title, simulation }) {
  return (
    <article
      style={{
        padding: 22,
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.24)",
        background: "rgba(15,23,42,0.84)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 19 }}>
          {title}
        </h2>

        <strong
          style={{
            padding: "7px 12px",
            borderRadius: 999,
            background:
              simulation.state ===
              "SIMULATED_SUCCESS_FOR_OWNER_REVIEW"
                ? "rgba(34,197,94,0.16)"
                : "rgba(245,158,11,0.16)",
          }}
        >
          {simulation.completed
            ? "SIMULATED"
            : "BLOCKED"}
        </strong>
      </div>

      <p style={{ color: "#94a3b8" }}>
        {simulation.state}
      </p>

      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.8,
        }}
      >
        <div>
          Attempts evaluated:{" "}
          <strong>
            {simulation.evaluatedAttempts.length}
          </strong>
        </div>

        <div>
          Selected provider:{" "}
          <strong>
            {simulation.selectedAttempt?.providerId ??
              "None"}
          </strong>
        </div>

        <div>
          Owner review required:{" "}
          <strong>
            {simulation.ownerReviewRequired
              ? "Yes"
              : "No"}
          </strong>
        </div>

        <div>
          Provider invoked: <strong>No</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: "rgba(2,6,23,0.72)",
          color: "#cbd5e1",
          overflowWrap: "anywhere",
        }}
      >
        {simulation.reasonCodes.length
          ? simulation.reasonCodes.join(" · ")
          : simulation.evaluatedAttempts
              .map(
                (attempt) =>
                  `${attempt.providerId}: ${attempt.simulatedResult}`,
              )
              .join(" · ")}
      </div>
    </article>
  );
}

export default function NexusDryRunDispatchPage() {
  const primarySuccess =
    createSimulation("PRIMARY_SUCCESS");

  const failoverSuccess =
    createSimulation("FAILOVER_SUCCESS");

  const permanentFailure =
    createSimulation("PERMANENT_FAILURE");

  const exhausted =
    createSimulation("FAILOVER_EXHAUSTED");

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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: "0.16em",
            color: "#60a5fa",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          NEXUS DAY 663 · PROVIDER DRY-RUN PLANE
        </p>

        <h1
          style={{
            maxWidth: 980,
            margin: "18px 0",
            fontSize: "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          Claimed actions now produce a deterministic,
          provider-independent dry-run dispatch plan.
        </h1>

        <p
          style={{
            maxWidth: 870,
            marginBottom: 34,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Adapter contracts, provider ordering, local failure
          simulation, failover selection, permanent failure,
          exhaustion, and owner review are now visible before
          any provider can be invoked.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 18,
          }}
        >
          <StatusCard
            title="Primary provider succeeds"
            simulation={primarySuccess}
          />

          <StatusCard
            title="Fallback provider succeeds"
            simulation={failoverSuccess}
          />

          <StatusCard
            title="Permanent provider failure"
            simulation={permanentFailure}
          />

          <StatusCard
            title="Failover chain exhausted"
            simulation={exhausted}
          />
        </section>

        <section
          style={{
            marginTop: 28,
            padding: 22,
            borderRadius: 18,
            border: "1px solid rgba(96,165,250,0.25)",
            background: "rgba(30,58,138,0.16)",
          }}
        >
          <strong>Local simulation only</strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            No provider endpoint, database, payment system,
            WhatsApp channel, customer workflow, migration, or
            AI execution is contacted. Every result is locally
            simulated and remains subject to owner review.
          </p>
        </section>
      </div>
    </main>
  );
}
