"use client";

const sidebarButton = {
  background: "#111827",
  color: "white",
  border: "1px solid #334155",
  borderRadius: "12px",
  padding: "14px",
  textAlign: "left" as const,
  cursor: "pointer",
};

const sidebarLink = {
  ...sidebarButton,
  display: "grid",
  gap: "4px",
  textDecoration: "none",
};

const boundaryLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: 600,
};

export default function NexusRootSidebar() {
  return (
    <aside
      style={{
        width: "260px",
        background: "#0f172a",
        borderRight: "1px solid #1e293b",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>NEXUS</h1>
      <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
        AI Business OS
      </p>

      <nav
        aria-label="NEXUS workspace navigation"
        style={{ display: "grid", gap: "14px" }}
      >
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          Dashboard
        </button>
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 260, behavior: "smooth" })
          }
        >
          AI Brain
        </button>
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 520, behavior: "smooth" })
          }
        >
          Templates
        </button>
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 1100, behavior: "smooth" })
          }
        >
          Customers
        </button>
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 1450, behavior: "smooth" })
          }
        >
          Orders
        </button>
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 1900, behavior: "smooth" })
          }
        >
          Automation
        </button>
        <button
          type="button"
          style={sidebarButton}
          onClick={() =>
            window.scrollTo({ top: 2400, behavior: "smooth" })
          }
        >
          Settings
        </button>

        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "#334155",
            margin: "4px 0",
          }}
        />

        <a aria-label="Founder Command" href="/nexus-founder-command" style={sidebarLink}>
          <span>Founder Command</span>
          <span style={boundaryLabel}>Owner-only read access</span>
        </a>

        <a aria-label="PPA Pilot Dashboard" href="/nexus-ppa-pilot-dashboard" style={sidebarLink}>
          <span>PPA Pilot Dashboard</span>
          <span style={boundaryLabel}>Internal preview only</span>
        </a>
      </nav>
    </aside>
  );
}