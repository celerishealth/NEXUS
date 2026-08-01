const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
};

export default function NexusRootMvpReadinessPanel() {
  return (
        <section
          style={{
            ...cardStyle,
            marginTop: "28px",
            border: "1px solid #22c55e",
          }}
        >
          <h2 style={{ marginBottom: "16px" }}>MVP Demo Readiness Panel v1</h2>
          <p style={{ color: "#cbd5e1", marginBottom: "14px" }}>
            NEXUS demo readiness snapshot for owner review before MVP presentation.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              "Customer Memory",
              "Owner Approval",
              "Safety Layer",
              "Audit Logs",
              "Zero Damage",
            ].map((pillar) => (
              <div
                key={pillar}
                style={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ color: "#22c55e", fontWeight: 700, marginBottom: "6px" }}>
                  Ready
                </p>
                <p style={{ color: "#f8fafc", fontWeight: 700 }}>{pillar}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "14px" }}>
            UI-only readiness panel. It does not execute actions, approve routes, reject routes, or change backend logic.
          </p>
        </section>
  );
}
