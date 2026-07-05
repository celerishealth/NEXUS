import type { CSSProperties } from "react";
import {
  getNexusDay307LegalSafeComplianceShieldPanel,
  validateNexusDay307LegalSafeComplianceShieldPanel
} from "@/lib/nexus/day307LegalSafeComplianceShieldPanel";
import {
  getNexusDay308GuidedDemoStoryMode,
  validateNexusDay308GuidedDemoStoryMode
} from "@/lib/nexus/day308GuidedDemoStoryMode";

type StyleMap = Record<string, CSSProperties>;

const styles: StyleMap = {
  shell: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(52, 211, 153, 0.18), transparent 32%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 34%), radial-gradient(circle at bottom, rgba(168, 85, 247, 0.12), transparent 36%), linear-gradient(135deg, #020617 0%, #07111f 48%, #020617 100%)",
    color: "#f8fafc",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    padding: "32px"
  },
  frame: { maxWidth: "1220px", margin: "0 auto" },
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
    maxWidth: "980px"
  },
  heroText: {
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "900px",
    marginTop: "20px",
    marginBottom: 0
  },
  sceneStack: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
    marginTop: "22px"
  },
  sceneCard: {
    border: "1px solid rgba(103, 232, 249, 0.24)",
    borderRadius: "28px",
    padding: "24px",
    background:
      "linear-gradient(135deg, rgba(8, 47, 73, 0.28), rgba(15, 23, 42, 0.78))",
    boxShadow: "0 18px 58px rgba(8, 47, 73, 0.22)"
  },
  fourGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "16px"
  },
  miniPanel: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "18px",
    padding: "14px",
    background: "rgba(2, 6, 23, 0.26)"
  },
  kpiLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    marginBottom: "10px"
  },
  sceneTitle: { fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em" },
  muted: { color: "#cbd5e1", lineHeight: 1.6, marginTop: "8px" },
  sectionTitle: {
    fontSize: "26px",
    letterSpacing: "-0.04em",
    marginTop: "30px",
    marginBottom: "14px"
  },
  status: {
    display: "inline-block",
    marginTop: "14px",
    border: "1px solid rgba(103, 232, 249, 0.34)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#a5f3fc",
    background: "rgba(8, 47, 73, 0.32)"
  },
  narrationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px"
  },
  narrationCard: {
    border: "1px solid rgba(168, 85, 247, 0.24)",
    borderRadius: "20px",
    padding: "16px",
    background: "rgba(88, 28, 135, 0.16)",
    color: "#f3e8ff"
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
  footer: { color: "#94a3b8", marginTop: "26px", fontSize: "13px", lineHeight: 1.7 }
};

export default function NexusCinematicDemoPage() {
  const compliancePanel = getNexusDay307LegalSafeComplianceShieldPanel();
  const storyMode = getNexusDay308GuidedDemoStoryMode();

  const complianceValidation = validateNexusDay307LegalSafeComplianceShieldPanel();
  const storyValidation = validateNexusDay308GuidedDemoStoryMode();

  const safe = complianceValidation.ok && storyValidation.ok;

  return (
    <main style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.topBar}>
          <div style={styles.badge}>NEXUS / Guided Cinematic Demo</div>
          <div style={styles.badge}>Read-only · Preview-only · Sample data only</div>
          <div style={styles.badge}>Validation: {safe ? "SAFE" : "CHECK REQUIRED"}</div>
        </div>

        <section style={styles.hero}>
          <div style={styles.eyebrow}>Day 308 · Guided Demo Story Mode</div>
          <h1 style={styles.h1}>A movie-style operating story with execution locked.</h1>
          <p style={styles.heroText}>{storyMode.storyModePromise}</p>
        </section>

        <section style={styles.sceneStack} aria-label="Guided demo story scenes">
          {storyMode.guidedScenes.map((scene) => (
            <article key={scene.scene} style={styles.sceneCard}>
              <div style={styles.kpiLabel}>{scene.scene}</div>
              <div style={styles.sceneTitle}>{scene.cinematicTitle}</div>
              <div style={styles.fourGrid}>
                <div style={styles.miniPanel}>
                  <div style={styles.kpiLabel}>Owner sees</div>
                  <div style={styles.muted}>{scene.ownerSees}</div>
                </div>
                <div style={styles.miniPanel}>
                  <div style={styles.kpiLabel}>NEXUS detects</div>
                  <div style={styles.muted}>{scene.nexusDetects}</div>
                </div>
                <div style={styles.miniPanel}>
                  <div style={styles.kpiLabel}>Safety gate</div>
                  <div style={styles.muted}>{scene.safetyGate}</div>
                </div>
                <div style={styles.miniPanel}>
                  <div style={styles.kpiLabel}>Execution boundary</div>
                  <div style={styles.muted}>{scene.executionBoundary}</div>
                </div>
              </div>
              <span style={styles.status}>{scene.visualStatus}</span>
            </article>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Demo Narration</h2>
        <section style={styles.narrationGrid} aria-label="Demo narration">
          {storyMode.demoNarration.map((line) => (
            <div key={line} style={styles.narrationCard}>
              {line}
            </div>
          ))}
        </section>

        <section style={styles.shield}>
          <h2 style={styles.sectionTitle}>Legal-Safe Story Shield</h2>
          <p style={styles.muted}>{compliancePanel.complianceShieldPromise}</p>
          <div style={styles.shieldGrid}>
            {storyMode.blockedExecutionProof.map((item) => (
              <div key={item} style={styles.shieldItem}>{item}</div>
            ))}
          </div>
        </section>

        <p style={styles.footer}>
          Route: {storyMode.routePath}. Source: Day {storyMode.sourceDay}. Completion:{" "}
          {storyMode.completionResult}. Launch remains {storyMode.launchAuthorization}.
        </p>
      </div>
    </main>
  );
}
