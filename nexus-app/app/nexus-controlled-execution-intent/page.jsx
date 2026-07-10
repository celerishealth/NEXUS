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

export const dynamic = "force-dynamic";

const SECRET =
  "nexus-day-662-dashboard-preview-secret";

const NOW = "2026-07-10T10:00:00.000Z";

function buildPipeline() {
  const action = {
    tenantId: "tenant-nexus-preview",
    actionId: "action-controlled-intent-001",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-662-dashboard-preview",
  };

  const authority = {
    tenantId: action.tenantId,
    ownerId: "owner-controlled-001",
    authorityEpoch: "authority-epoch-662",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-controlled-001",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-controlled-001",
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

  return {
    action,
    authority,
    admission,
    handoff,
    intent,
  };
}

function createClaimScenario({
  foreignOwner = false,
  replayed = false,
  activeClaimExists = false,
} = {}) {
  const pipeline = buildPipeline();

  const result = claimControlledExecutionIntent({
    intent: pipeline.intent,
    claim: {
      claimId: "claim-controlled-001",
      intentId: pipeline.intent.intentId,
      tenantId: pipeline.action.tenantId,
      actionId: pipeline.action.actionId,
      ownerId: foreignOwner
        ? "owner-foreign"
        : pipeline.authority.ownerId,
      role: "OWNER",
      issuedAt: "2026-07-10T09:59:00.000Z",
      expiresAt: "2026-07-10T10:10:00.000Z",
    },
    replay: {
      consumedClaimIds: replayed
        ? ["claim-controlled-001"]
        : [],
      activeClaimExists,
    },
    now: NOW,
  });

  return {
    intent: pipeline.intent,
    claim: result,
  };
}

function StatusCard({ title, result }) {
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
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 19 }}>
          {title}
        </h2>

        <strong
          style={{
            padding: "7px 12px",
            borderRadius: 999,
            background: result.claimed
              ? "rgba(34,197,94,0.16)"
              : "rgba(239,68,68,0.16)",
          }}
        >
          {result.claimed ? "CLAIMED" : "BLOCKED"}
        </strong>
      </div>

      <p style={{ color: "#94a3b8" }}>
        {result.state}
      </p>

      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.8,
        }}
      >
        <div>
          Owner claim:{" "}
          <strong>
            {result.claimed ? "Verified" : "Denied"}
          </strong>
        </div>

        <div>
          Claim token:{" "}
          <strong>
            {result.claimToken
              ? "Generated"
              : "Not generated"}
          </strong>
        </div>

        <div>
          Execution authorized: <strong>No</strong>
        </div>

        <div>
          Persistence performed: <strong>No</strong>
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
        {result.reasonCodes.length
          ? result.reasonCodes.join(" · ")
          : "OWNER_IDENTITY_BOUND · SINGLE_CLAIM_ACCEPTED · CONTROLLED_REVIEW_READY"}
      </div>
    </article>
  );
}

export default function ControlledExecutionIntentPage() {
  const valid = createClaimScenario();
  const replayed = createClaimScenario({
    replayed: true,
  });
  const foreignOwner = createClaimScenario({
    foreignOwner: true,
  });
  const activeClaim = createClaimScenario({
    activeClaimExists: true,
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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <p
          style={{
            letterSpacing: "0.16em",
            color: "#60a5fa",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          NEXUS DAY 662 · CONTROLLED INTENT PLANE
        </p>

        <h1
          style={{
            maxWidth: 960,
            margin: "18px 0",
            fontSize: "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          Every admitted action now becomes a controlled,
          single-owner execution intent.
        </h1>

        <p
          style={{
            maxWidth: 860,
            marginBottom: 34,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Owner authorization, provider-independent recovery,
          deterministic intent identity, tenant binding, claim
          leases, replay protection, and active-claim exclusion
          now operate through one fail-closed state machine.
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
            title="Trusted owner claim"
            result={valid.claim}
          />

          <StatusCard
            title="Replayed claim"
            result={replayed.claim}
          />

          <StatusCard
            title="Foreign owner claim"
            result={foreignOwner.claim}
          />

          <StatusCard
            title="Concurrent active claim"
            result={activeClaim.claim}
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
          <strong>Real execution remains prohibited</strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            The state machine creates preview-only intent and
            claim decisions. It performs no provider call,
            database mutation, payment, WhatsApp delivery, live
            migration, customer action, or uncontrolled AI
            execution.
          </p>
        </section>
      </div>
    </main>
  );
}
