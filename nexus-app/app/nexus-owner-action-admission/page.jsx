import {
  createSignedOwnerResolution,
  evaluateOwnerAuthorizedActionAdmission,
} from "../../lib/nexus/ownerAuthorizedActionAdmission.mjs";

export const dynamic = "force-dynamic";

const DEMO_SECRET = "nexus-day-660-dashboard-preview-secret";

function createScenario({
  replayed = false,
  tenantMismatch = false,
  retryCount = 0,
}) {
  const now = "2026-07-10T10:00:00.000Z";

  const action = {
    tenantId: "tenant-nexus-preview",
    actionId: "action-owner-controlled-001",
    actionType: "SAFE_DRAFT_ADMISSION",
    payloadDigest: "sha256:day-660-safe-preview",
  };

  const authority = {
    tenantId: tenantMismatch
      ? "tenant-cross-boundary"
      : action.tenantId,
    ownerId: "owner-authority-001",
    authorityEpoch: "authority-epoch-009",
    status: "ACTIVE",
    trustState: "VERIFIED",
  };

  const resolution = createSignedOwnerResolution({
    tenantId: action.tenantId,
    ownerId: authority.ownerId,
    actionId: action.actionId,
    resolutionId: "resolution-owner-001",
    authorityEpoch: authority.authorityEpoch,
    nonce: "nonce-owner-001",
    issuedAt: "2026-07-10T09:55:00.000Z",
    expiresAt: "2026-07-10T10:15:00.000Z",
    signingSecret: DEMO_SECRET,
  });

  return evaluateOwnerAuthorizedActionAdmission({
    action,
    authority,
    resolution,
    replay: {
      consumedResolutionIds: replayed
        ? [resolution.resolutionId]
        : [],
      consumedNonces: [],
      retryCount,
      permanentOutcome: false,
    },
    signingSecret: DEMO_SECRET,
    now,
  });
}

function ResultCard({ title, result }) {
  return (
    <article
      style={{
        border: "1px solid rgba(148,163,184,0.25)",
        borderRadius: 18,
        padding: 22,
        background: "rgba(15,23,42,0.82)",
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
        <h2 style={{ margin: 0, fontSize: 19 }}>{title}</h2>
        <strong
          style={{
            borderRadius: 999,
            padding: "7px 12px",
            background: result.admitted
              ? "rgba(34,197,94,0.15)"
              : "rgba(239,68,68,0.15)",
          }}
        >
          {result.admitted ? "ADMITTED" : "BLOCKED"}
        </strong>
      </div>

      <p style={{ color: "#94a3b8", marginBottom: 10 }}>
        {result.mode}
      </p>

      <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
        <div>
          Tenant isolated:{" "}
          <strong>
            {result.reasonCodes.includes(
              "TENANT_ISOLATION_VIOLATION",
            )
              ? "No"
              : "Yes"}
          </strong>
        </div>
        <div>
          Retry count:{" "}
          <strong>
            {String(result.retryPolicy.currentRetryCount)}
          </strong>
        </div>
        <div>
          External execution: <strong>Never performed</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: "rgba(2,6,23,0.7)",
          color: "#cbd5e1",
          overflowWrap: "anywhere",
        }}
      >
        {result.reasonCodes.length
          ? result.reasonCodes.join(" · ")
          : "OWNER_AUTHORITY_VERIFIED · SIGNATURE_VALID · REPLAY_CLEAR"}
      </div>
    </article>
  );
}

export default function OwnerActionAdmissionPage() {
  const valid = createScenario({});
  const replayed = createScenario({ replayed: true });
  const crossTenant = createScenario({ tenantMismatch: true });
  const retryExceeded = createScenario({ retryCount: 2 });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "54px 24px",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 52%)",
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
          NEXUS DAY 660 · OWNER CONTROL PLANE
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
            maxWidth: 900,
            margin: "18px 0",
          }}
        >
          Durable action admission—before execution is ever possible.
        </h1>

        <p
          style={{
            maxWidth: 820,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
            marginBottom: 34,
          }}
        >
          Trusted owner authority, signed resolution integrity,
          tenant isolation, permanent outcomes, and single-retry
          replay protection now converge through one fail-closed
          admission boundary.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          <ResultCard
            title="Verified owner decision"
            result={valid}
          />
          <ResultCard
            title="Resolution replay attempt"
            result={replayed}
          />
          <ResultCard
            title="Cross-tenant authority"
            result={crossTenant}
          />
          <ResultCard
            title="Second retry attempt"
            result={retryExceeded}
          />
        </section>

        <section
          style={{
            marginTop: 28,
            borderRadius: 18,
            padding: 22,
            border: "1px solid rgba(96,165,250,0.25)",
            background: "rgba(30,58,138,0.16)",
          }}
        >
          <strong>Locked safety boundary</strong>
          <p
            style={{
              color: "#bfdbfe",
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            Preview and admission evaluation only. No payment,
            message send, database mutation, live migration,
            provider execution, or uncontrolled AI action is
            authorized by this milestone.
          </p>
        </section>
      </div>
    </main>
  );
}
