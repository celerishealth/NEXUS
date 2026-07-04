import { nexusTrustPilotReadinessDashboardSummary } from "@/lib/nexus/nexusTrustPilotReadinessDashboardSummary";

export default function TrustPilotReadinessDashboardPreviewPage() {
  const summary = nexusTrustPilotReadinessDashboardSummary;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 34%), #020617",
        color: "#e5e7eb",
        padding: "40px",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <section style={{ maxWidth: "1180px", margin: "0 auto", display: "grid", gap: "24px" }}>
        <div
          style={{
            border: "1px solid #1e3a8a",
            borderRadius: "24px",
            padding: "28px",
            background: "rgba(15, 23, 42, 0.9)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.36)",
          }}
        >
          <p
            style={{
              color: "#38bdf8",
              fontSize: "13px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "0 0 12px",
              fontWeight: 800,
            }}
          >
            Day 116 · Trust + Pilot Readiness
          </p>
          <h1 style={{ fontSize: "42px", lineHeight: 1.05, margin: "0 0 14px", color: "#f8fafc" }}>
            NEXUS Pilot Trust Dashboard Preview
          </h1>
          <p style={{ maxWidth: "860px", color: "#cbd5e1", fontSize: "16px", lineHeight: 1.7, margin: 0 }}>
            Read-only Shadow Mode dashboard surface for proving trust before any real pilot. No execution, no writes,
            no real customer data access, no AI calls, no message sending, no payment execution, and no third-party mutation.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {summary.dashboardSummaryCards.map((card) => (
            <article
              key={card.title}
              style={{
                border: "1px solid #334155",
                borderRadius: "18px",
                padding: "20px",
                background: card.status === "preview-ready" ? "rgba(15, 23, 42, 0.92)" : "rgba(69, 26, 3, 0.38)",
              }}
            >
              <p
                style={{
                  color: card.status === "preview-ready" ? "#22c55e" : "#f59e0b",
                  margin: "0 0 10px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontWeight: 800,
                }}
              >
                {card.status}
              </p>
              <h2 style={{ color: "#f8fafc", margin: "0 0 10px", fontSize: "20px" }}>{card.title}</h2>
              <p style={{ color: "#cbd5e1", lineHeight: 1.6, margin: 0, fontSize: "14px" }}>{card.message}</p>
            </article>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          <section style={{ border: "1px solid #334155", borderRadius: "20px", padding: "22px", background: "rgba(15, 23, 42, 0.9)" }}>
            <h2 style={{ margin: "0 0 14px", color: "#f8fafc" }}>Readiness</h2>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", lineHeight: 1.8 }}>
              <li>Dashboard preview ready: {String(summary.dashboardReadiness.dashboardPreviewReady)}</li>
              <li>Real pilot blocked: {String(summary.dashboardReadiness.realPilotBlocked)}</li>
              <li>Real execution blocked: {String(summary.dashboardReadiness.realExecutionBlocked)}</li>
              <li>All cards execution-blocked: {String(summary.dashboardReadiness.allCardsExecutionBlocked)}</li>
            </ul>
          </section>

          <section style={{ border: "1px solid #334155", borderRadius: "20px", padding: "22px", background: "rgba(15, 23, 42, 0.9)" }}>
            <h2 style={{ margin: "0 0 14px", color: "#f8fafc" }}>Required Warnings</h2>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", lineHeight: 1.8 }}>
              {summary.requiredDashboardWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </section>
        </div>

        <section style={{ border: "1px solid #334155", borderRadius: "20px", padding: "22px", background: "rgba(15, 23, 42, 0.9)" }}>
          <h2 style={{ margin: "0 0 14px", color: "#f8fafc" }}>Blocked Until Approved Real Architecture</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            {summary.blockedDashboardActions.map((action) => (
              <div
                key={action}
                style={{
                  border: "1px solid #7f1d1d",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  color: "#fecaca",
                  background: "rgba(127, 29, 29, 0.18)",
                  fontSize: "13px",
                }}
              >
                {action}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
