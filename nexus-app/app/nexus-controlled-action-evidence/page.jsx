import {
  createControlledActionEvidencePreview,
} from "../../lib/nexus/controlledActionEvidencePreview.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function SummaryCard({
  title,
  value,
  detail,
}) {
  return (
    <article
      style={{
        padding: 20,
        borderRadius: 18,
        border:
          "1px solid rgba(148,163,184,0.24)",
        background:
          "rgba(15,23,42,0.84)",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: 8,
          fontSize: 25,
        }}
      >
        {value}
      </strong>

      <div
        style={{
          marginTop: 8,
          color: "#64748b",
          fontSize: 13,
          overflowWrap: "anywhere",
        }}
      >
        {detail}
      </div>
    </article>
  );
}

function VerificationCard({
  title,
  verification,
}) {
  return (
    <article
      style={{
        padding: 22,
        borderRadius: 18,
        border: verification.valid
          ? "1px solid rgba(34,197,94,0.32)"
          : "1px solid rgba(239,68,68,0.38)",
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
            background: verification.valid
              ? "rgba(34,197,94,0.16)"
              : "rgba(239,68,68,0.16)",
          }}
        >
          {verification.valid
            ? "VERIFIED"
            : "REJECTED"}
        </strong>
      </div>

      <p style={{ color: "#94a3b8" }}>
        {verification.state}
      </p>

      <div
        style={{
          color: "#cbd5e1",
          lineHeight: 1.8,
        }}
      >
        <div>
          Verified records:{" "}
          <strong>
            {
              verification
                .verifiedRecordCount
            }
          </strong>
        </div>

        <div>
          Provider invoked:{" "}
          <strong>No</strong>
        </div>

        <div>
          Persistence performed:{" "}
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
        {verification.reasonCodes.length
          ? verification.reasonCodes.join(
              " · ",
            )
          : "GENESIS_VALID · CHAIN_VALID · ROOT_HASH_VALID · BUNDLE_ID_VALID"}
      </div>
    </article>
  );
}

export default function ControlledActionEvidencePage() {
  const valid =
    createControlledActionEvidencePreview();

  const tampered =
    createControlledActionEvidencePreview({
      tamper: true,
    });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "54px 24px",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 55%)",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
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
          NEXUS DAY 666 · AUDIT EVIDENCE PLANE
        </p>

        <h1
          style={{
            maxWidth: 1000,
            margin: "18px 0",
            fontSize:
              "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          Every owner-controlled decision now
          produces independently verifiable,
          tamper-evident evidence.
        </h1>

        <p
          style={{
            maxWidth: 900,
            marginBottom: 34,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          Admission, recovery handoff, intent,
          owner claim, provider dry-run plan,
          failover simulation, and signed owner
          resolution are linked into one
          deterministic cryptographic evidence
          chain.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <SummaryCard
            title="Evidence records"
            value={
              valid.evidence.recordCount
            }
            detail="Complete protected pipeline"
          />

          <SummaryCard
            title="Bundle state"
            value={
              valid.verification.valid
                ? "VERIFIED"
                : "BLOCKED"
            }
            detail={
              valid.evidence.bundleId
            }
          />

          <SummaryCard
            title="Owner decision"
            value={
              valid.pipeline
                .ownerResolution.decision
            }
            detail="Signed and pipeline-bound"
          />

          <SummaryCard
            title="Real execution"
            value="LOCKED"
            detail="Evidence generation only"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          <VerificationCard
            title="Original evidence bundle"
            verification={
              valid.verification
            }
          />

          <VerificationCard
            title="Modified evidence bundle"
            verification={
              tampered.verification
            }
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
            Audit evidence is not execution
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            This milestone creates and verifies
            local cryptographic evidence only.
            It performs no database mutation,
            provider call, payment, WhatsApp
            delivery, customer action, live
            migration, public launch, or
            uncontrolled AI execution.
          </p>
        </section>
      </div>
    </main>
  );
}
