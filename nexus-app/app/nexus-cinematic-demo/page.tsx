import type { CSSProperties } from "react";
import {
  getNexusDay302CinematicDemoDashboardStructure,
  validateNexusDay302CinematicDemoDashboardStructure
} from "@/lib/nexus/day302CinematicDemoDashboardStructure";

type StyleMap = Record<string, CSSProperties>;

const styles: StyleMap = {
  shell: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(52, 211, 153, 0.18), transparent 32%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 34%), linear-gradient(135deg, #020617 0%, #07111f 48%, #020617 100%)",
    color: "#f8fafc",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    padding: "32px"
  },
  frame: {
    maxWidth: "1180px",
    margin: "0 auto"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap"
  },
  badge: {
    border: "1px solid rgba(148, 163, 184, 0.28)",
    borderRadius: "999px",
    padding: "8px 12px",
    color: "#cbd5e1",
    background: "rgba(15, 23, 42, 0.72)",
    boxShadow: "0 0 40px rgba(15, 23, 42, 0.5)",
    fontSize: "13px"
  },
  hero: {
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: "32px",
    padding: "34px",
    background: "rgba(15, 23, 42, 0.78)",
    boxShadow: "0 24px 90px rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(16px)",
    marginBottom: "22px"
  },
  eyebrow: {
    color: "#67e8f9",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "14px"
  },
  h1: {
    fontSize: "clamp(38px, 7vw, 82px)",
    lineHeight: "0.92",
    letterSpacing: "-0.07em",
    margin: 0,
    maxWidth: "920px"
  },
  heroText: {
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "820px",
    marginTop: "20px",
    marginBottom: 0
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "22px"
  },
  card: {
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "24px",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.68)",
    boxShadow: "0 18px 48px rgba(0, 0, 0, 0.28)"
  },
  kpiLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    marginBottom: "10px"
  },
  kpiValue: {
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.04em"
  },
  muted: {
    color: "#cbd5e1",
    lineHeight: 1.6,
    marginTop: "8px"
  },
  sectionTitle: {
    fontSize: "26px",
    letterSpacing: "-0.04em",
    marginTop: "30px",
    marginBottom: "14px"
  },
  sceneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px"
  },
  sceneTitle: {
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "6px"
  },
  sceneSubtitle: {
    color: "#67e8f9",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "10px"
  },
  status: {
    display: "inline-block",
    marginTop: "14px",
    border: "1px solid rgba(103, 232, 249, 0.32)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#a5f3fc",
    background: "rgba(8, 47, 73, 0.32)"
  },
  shield: {
    marginTop: "22px",
    border: "1px solid rgba(52, 211, 153, 0.26)",
    borderRadius: "28px",
    padding: "24px",
    background: "rgba(6, 78, 59, 0.18)"
  },
  shieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "10px",
    marginTop: "14px"
  },
  shieldItem: {
    border: "1px solid rgba(52, 211, 153, 0.2)",
    borderRadius: "16px",
    padding: "12px",
    color: "#d1fae5",
    background: "rgba(2, 44, 34, 0.35)"
  },
  footer: {
    color: "#94a3b8",
    marginTop: "26px",
    fontSize: "13px",
    lineHeight: 1.7
  }
};

export default function NexusCinematicDemoPage() {
  const dashboard = getNexusDay302CinematicDemoDashboardStructure();
  const validation = validateNexusDay302CinematicDemoDashboardStructure();

  return (
    <main style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.topBar}>
          <div style={styles.badge}>NEXUS / Premium Cinematic Demo</div>
          <div style={styles.badge}>Read-only · Preview-only · Sample data only</div>
          <div style={styles.badge}>Validation: {validation.ok ? "SAFE" : "CHECK REQUIRED"}</div>
        </div>

        <section style={styles.hero}>
          <div style={styles.eyebrow}>Day 302 · Owner-Controlled Operating Layer</div>
          <h1 style={styles.h1}>The owner cockpit before business execution.</h1>
          <p style={styles.heroText}>{dashboard.heroPromise}</p>
        </section>

        <section style={styles.grid} aria-label="NEXUS cinematic demo KPI cards">
          {dashboard.demoKpis.map((item) => (
            <article key={item.label} style={styles.card}>
              <div style={styles.kpiLabel}>{item.label}</div>
              <div style={styles.kpiValue}>{item.value}</div>
              <div style={styles.muted}>{item.detail}</div>
              <span style={styles.status}>{item.safety}</span>
            </article>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Cinematic Demo Scenes</h2>
        <section style={styles.sceneGrid} aria-label="NEXUS cinematic demo scenes">
          {dashboard.demoScenes.map((scene) => (
            <article key={scene.title} style={styles.card}>
              <div style={styles.sceneTitle}>{scene.title}</div>
              <div style={styles.sceneSubtitle}>{scene.subtitle}</div>
              <div style={styles.muted}>{scene.story}</div>
              <span style={styles.status}>{scene.status}</span>
            </article>
          ))}
        </section>

        <section style={styles.shield}>
          <h2 style={styles.sectionTitle}>Legal-Safe Shield</h2>
          <p style={styles.muted}>
            This cinematic demo does not launch, activate payment, create invoices, execute GST,
            generate e-way bills, send messages, call AI models, mutate third-party systems, or use
            real customer data.
          </p>
          <div style={styles.shieldGrid}>
            {dashboard.safetyShield.map((item) => (
              <div key={item} style={styles.shieldItem}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <p style={styles.footer}>
          Route: {dashboard.routePath}. Source: Day {dashboard.sourceDay}. Completion:{" "}
          {dashboard.completionResult}. Launch remains {dashboard.launchAuthorization}.
        </p>
      </div>
    </main>
  );
}
