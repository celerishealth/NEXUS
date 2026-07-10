import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../../lib/nexus/ownerAuthorizedActionAdmission.mjs";
import {
  createProviderIndependentRecoveryHandoff,
} from "../../lib/nexus/providerIndependentRecoveryHandoff.mjs";

export const dynamic = "force-dynamic";

const DEMO_SECRET =
  "nexus-day-661-dashboard-preview-secret";
const NOW = "2026-07-10T10:00:00.000Z";

function createScenario({
  tenantMismatch = false,
  retryCount = 0,
  singleProvider = false,
} = {}) {
  const action = {
    tenantId: "tenant-nexus-preview",
    actionId: "action-recovery-handoff-001",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-661-dashboard-preview",
  };

  const authority = {
    tenantId: tenantMismatch
      ? "tenant-foreign"
      : action.tenantId,
    ownerId: "owner-authority-001",
    authorityEpoch: "authority-epoch-661",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-recovery-001",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-recovery-001",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
    signingSecret: DEMO_SECRET,
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
      signingSecret: DEMO_SECRET,
      now: NOW,
    });

  const adapters = [
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
  ];

  return createProviderIndependentRecoveryHandoff({
    action,
    admission,
    adapters: singleProvider
      ? [adapters[0]]
      : adapters,
    recovery: {
      retryCount,
      permanentOutcome: false,
    },
    now: NOW,
  });
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
            background: result.prepared
              ? "rgba(34,197,94,0.16)"
              : "rgba(239,68,68,0.16)",
          }}
        >
          {result.prepared ? "PREPARED" : "BLOCKED"}
        </strong>
      </div>

      <p style={{ color: "#94a3b8" }}>
        {result.mode}
      </p>

      <div
        style={{
          lineHeight: 1.8,
          color: "#cbd5e1",
        }}
      >
        <div>
          Providers ready:{" "}
          <strong>{result.failoverChain.length}</strong>
        </div>
        <div>
          Primary adapter:{" "}
          <strong>
            {result.selectedPrimaryAdapter?.adapterId ??
              "None"}
          </strong>
        </div>
        <div>
          Execution authorized: <strong>No</strong>
        </div>
        <div>
          Recovery checkpoint:{" "}
          <strong>
            {result.recoveryCheckpoint
              ? "Created"
              : "Not created"}
          </strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: "rgba(2,6,23,0.72)",
          overflowWrap: "anywhere",
          color: "#cbd5e1",
        }}
      >
        {result.reasonCodes.length
          ? result.reasonCodes.join(" · ")
          : "OWNER_ADMISSION_BOUND · MULTI_PROVIDER_FAILOVER_READY · RECOVERY_CHECKPOINT_READY"}
      </div>
    </article>
  );
}

export default function NexusRecoveryHandoffPage() {
  const valid = createScenario();
  const missingFailover = createScenario({
    singleProvider: true,
  });
  const crossTenant = createScenario({
    tenantMismatch: true,
  });
  const retryExceeded = createScenario({
    retryCount: 2,
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
          NEXUS DAY 661 · RECOVERABLE CONTROL PLANE
        </p>

        <h1
          style={{
            maxWidth: 940,
            margin: "18px 0",
            fontSize: "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          Owner-approved actions now enter a
          provider-independent recovery handoff.
        </h1>

        <p
          style={{
            maxWidth: 850,
            marginBottom: 34,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Admission identity, tenant boundaries, two-provider
          failover readiness, deterministic adapter ordering,
          single-retry permanence, and recovery checkpoints are
          evaluated together before any execution can exist.
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
            title="Provider-independent handoff"
            result={valid}
          />
          <StatusCard
            title="Missing failover provider"
            result={missingFailover}
          />
          <StatusCard
            title="Cross-tenant admission"
            result={crossTenant}
          />
          <StatusCard
            title="Retry limit exceeded"
            result={retryExceeded}
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
          <strong>Execution remains locked</strong>
          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            This milestone creates only a deterministic preview
            handoff and recovery checkpoint. It performs no
            provider call, database mutation, payment, message
            delivery, live migration, or uncontrolled AI action.
          </p>
        </section>
      </div>
    </main>
  );
}
