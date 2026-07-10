import {
  runCriticalRiskAudit,
} from "../../lib/nexus/criticalRiskBurnDown.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ControlCard({ control }) {
  return (
    <article
      style={{
        padding: 18,
        borderRadius: 16,
        border: control.passed
          ? "1px solid rgba(34,197,94,0.3)"
          : "1px solid rgba(239,68,68,0.4)",
        background: "rgba(15,23,42,0.84)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: 14 }}>
          {control.id}
        </strong>

        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            background: control.passed
              ? "rgba(34,197,94,0.16)"
              : "rgba(239,68,68,0.16)",
          }}
        >
          {control.status}
        </span>
      </div>

      <p
        style={{
          marginBottom: 0,
          color: "#94a3b8",
          fontSize: 13,
        }}
      >
        Severity: {control.severity}
      </p>
    </article>
  );
}

export default function NexusRiskBurnDownPage() {
  const report = runCriticalRiskAudit({
    repositoryRoot: process.cwd(),
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "52px 24px",
        color: "#f8fafc",
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 56%)",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            color: "#60a5fa",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.16em",
          }}
        >
          NEXUS DAY 664 · CRITICAL RISK GATE
        </p>

        <h1
          style={{
            margin: "18px 0",
            maxWidth: 960,
            fontSize: "clamp(34px, 6vw, 66px)",
            lineHeight: 1,
          }}
        >
          Zero known Critical and High risk is now a
          machine-enforced development gate.
        </h1>

        <p
          style={{
            maxWidth: 880,
            color: "#94a3b8",
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          The complete owner-controlled pipeline, tenant
          isolation, signatures, replay protection, provider
          independence, claim exclusivity, dry-run failover,
          protected routes, and secret exposure boundaries are
          tested together before development can continue.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            margin: "32px 0",
          }}
        >
          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background: "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Development gate
            </div>
            <strong style={{ fontSize: 28 }}>
              {report.developmentGatePassed
                ? "PASS"
                : "BLOCKED"}
            </strong>
          </article>

          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background: "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Open Critical
            </div>
            <strong style={{ fontSize: 28 }}>
              {report.knownCriticalRiskCount}
            </strong>
          </article>

          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background: "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Open High
            </div>
            <strong style={{ fontSize: 28 }}>
              {report.knownHighRiskCount}
            </strong>
          </article>

          <article
            style={{
              padding: 20,
              borderRadius: 18,
              background: "rgba(15,23,42,0.84)",
            }}
          >
            <div style={{ color: "#94a3b8" }}>
              Controls passed
            </div>
            <strong style={{ fontSize: 28 }}>
              {report.passedControlCount}/
              {report.totalControlCount}
            </strong>
          </article>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 14,
          }}
        >
          {report.controls.map((control) => (
            <ControlCard
              key={control.id}
              control={control}
            />
          ))}
        </section>

        <section
          style={{
            marginTop: 28,
            padding: 22,
            borderRadius: 18,
            border: "1px solid rgba(96,165,250,0.28)",
            background: "rgba(30,58,138,0.16)",
          }}
        >
          <strong>Launch remains locked</strong>

          <p
            style={{
              marginBottom: 0,
              color: "#bfdbfe",
              lineHeight: 1.7,
            }}
          >
            Passing this development gate does not authorize
            public launch, provider execution, database
            mutation, payments, WhatsApp auto-send, live
            migrations, customer actions, or uncontrolled AI
            behavior.
          </p>
        </section>
      </div>
    </main>
  );
}
