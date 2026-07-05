import type { CSSProperties } from "react";
import {
  getNexusDay302CinematicDemoDashboardStructure,
  validateNexusDay302CinematicDemoDashboardStructure
} from "@/lib/nexus/day302CinematicDemoDashboardStructure";
import {
  getNexusDay303OwnerCommandCenterVisualStory,
  validateNexusDay303OwnerCommandCenterVisualStory
} from "@/lib/nexus/day303OwnerCommandCenterVisualStory";
import {
  getNexusDay304SampleCustomerRequestSimulation,
  validateNexusDay304SampleCustomerRequestSimulation
} from "@/lib/nexus/day304SampleCustomerRequestSimulation";

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
    maxWidth: "940px"
  },
  heroText: {
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "860px",
    marginTop: "20px",
    marginBottom: 0
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "22px"
  },
  twoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
    marginBottom: "22px"
  },
  card: {
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "24px",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.68)",
    boxShadow: "0 18px 48px rgba(0, 0, 0, 0.28)"
  },
  commandCard: {
    border: "1px solid rgba(103, 232, 249, 0.24)",
    borderRadius: "26px",
    padding: "22px",
    background:
      "linear-gradient(135deg, rgba(14, 116, 144, 0.22), rgba(15, 23, 42, 0.76))",
    boxShadow: "0 18px 58px rgba(8, 47, 73, 0.24)"
  },
  requestCard: {
    border: "1px solid rgba(250, 204, 21, 0.24)",
    borderRadius: "28px",
    padding: "24px",
    background:
      "linear-gradient(135deg, rgba(113, 63, 18, 0.24), rgba(15, 23, 42, 0.76))",
    boxShadow: "0 18px 58px rgba(113, 63, 18, 0.2)",
    marginBottom: "22px"
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
  muted: { color: "#cbd5e1", lineHeight: 1.6, marginTop: "8px" },
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
  sceneTitle: { fontSize: "20px", fontWeight: 800, marginBottom: "6px" },
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
  flowStep: {
    display: "grid",
    gridTemplateColumns: "minmax(120px, 0.7fr) minmax(220px, 1.3fr) minmax(220px, 1.3fr)",
    gap: "12px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "18px",
    padding: "14px",
    background: "rgba(2, 6, 23, 0.28)",
    marginBottom: "10px"
  },
  copyStrip: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" },
  copyPill: {
    border: "1px solid rgba(168, 85, 247, 0.28)",
    borderRadius: "999px",
    padding: "10px 12px",
    background: "rgba(88, 28, 135, 0.18)",
    color: "#f3e8ff",
    fontSize: "13px"
  },
  requestLineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "16px"
  },
  requestLine: {
    border: "1px solid rgba(250, 204, 21, 0.2)",
    borderRadius: "18px",
    padding: "14px",
    background: "rgba(69, 26, 3, 0.22)"
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
  const dashboard = getNexusDay302CinematicDemoDashboardStructure();
  const story = getNexusDay303OwnerCommandCenterVisualStory();
  const simulation = getNexusDay304SampleCustomerRequestSimulation();

  const dashboardValidation = validateNexusDay302CinematicDemoDashboardStructure();
  const storyValidation = validateNexusDay303OwnerCommandCenterVisualStory();
  const simulationValidation = validateNexusDay304SampleCustomerRequestSimulation();

  const safe = dashboardValidation.ok && storyValidation.ok && simulationValidation.ok;

  return (
    <main style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.topBar}>
          <div style={styles.badge}>NEXUS / Premium Cinematic Demo</div>
          <div style={styles.badge}>Read-only · Preview-only · Sample data only</div>
          <div style={styles.badge}>Validation: {safe ? "SAFE" : "CHECK REQUIRED"}</div>
        </div>

        <section style={styles.hero}>
          <div style={styles.eyebrow}>Day 304 · Sample Customer Request Simulation</div>
          <h1 style={styles.h1}>See the request. Catch the risk. Block execution.</h1>
          <p style={styles.heroText}>{story.commandCenterPromise}</p>
          <div style={styles.copyStrip}>
            {story.cinematicCopyBlocks.map((line) => (
              <span key={line} style={styles.copyPill}>{line}</span>
            ))}
          </div>
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

        <section style={styles.requestCard} aria-label="Sample customer request simulation">
          <div style={styles.eyebrow}>Sample Request Simulation</div>
          <h2 style={styles.sectionTitle}>{simulation.sampleRequestTitle}</h2>
          <p style={styles.muted}>
            This section is cinematic and sample-only. NEXUS does not reply to customers, create
            invoices, generate payment links, execute GST, generate e-way bills, or create business
            commitments.
          </p>
          <div style={styles.requestLineGrid}>
            {simulation.sampleRequestLines.map((line) => (
              <div key={line.label} style={styles.requestLine}>
                <div style={styles.kpiLabel}>{line.label}</div>
                <div style={styles.muted}>{line.value}</div>
                <span style={styles.status}>{line.safety}</span>
              </div>
            ))}
          </div>
        </section>

        <h2 style={styles.sectionTitle}>Simulation Stages</h2>
        <section style={styles.card} aria-label="Sample request simulation stages">
          {simulation.simulationStages.map((stage) => (
            <div key={stage.stage} style={styles.flowStep}>
              <div>
                <div style={styles.kpiLabel}>{stage.stage}</div>
                <span style={styles.status}>{stage.executionState}</span>
              </div>
              <div>
                <div style={styles.sceneSubtitle}>Customer signal</div>
                <div style={styles.muted}>{stage.customerSignal}</div>
              </div>
              <div>
                <div style={styles.sceneSubtitle}>NEXUS preview</div>
                <div style={styles.muted}>{stage.nexusPreview}</div>
              </div>
            </div>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Owner Command Signals</h2>
        <section style={styles.twoGrid} aria-label="Owner command center signals">
          {story.ownerCommandSignals.map((signal) => (
            <article key={signal.label} style={styles.commandCard}>
              <div style={styles.kpiLabel}>{signal.label}</div>
              <div style={styles.kpiValue}>{signal.value}</div>
              <div style={styles.muted}>{signal.explanation}</div>
              <span style={styles.status}>{signal.status}</span>
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
            {simulation.blockedExecutionProof.map((item) => (
              <div key={item} style={styles.shieldItem}>{item}</div>
            ))}
          </div>
        </section>

        <p style={styles.footer}>
          Route: {simulation.routePath}. Source: Day {simulation.sourceDay}. Completion:{" "}
          {simulation.completionResult}. Launch remains {simulation.launchAuthorization}.
        </p>
      </div>
    </main>
  );
}
