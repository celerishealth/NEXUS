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
import {
  getNexusDay305AiRiskRadarOwnerApprovalFlow,
  validateNexusDay305AiRiskRadarOwnerApprovalFlow
} from "@/lib/nexus/day305AiRiskRadarOwnerApprovalFlow";

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
    maxWidth: "960px"
  },
  heroText: {
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: 1.7,
    maxWidth: "900px",
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
  riskCard: {
    border: "1px solid rgba(248, 113, 113, 0.26)",
    borderRadius: "26px",
    padding: "22px",
    background:
      "linear-gradient(135deg, rgba(127, 29, 29, 0.25), rgba(15, 23, 42, 0.78))",
    boxShadow: "0 18px 58px rgba(127, 29, 29, 0.22)"
  },
  approvalCard: {
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
  dangerStatus: {
    display: "inline-block",
    marginTop: "14px",
    border: "1px solid rgba(248, 113, 113, 0.35)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#fecaca",
    background: "rgba(127, 29, 29, 0.25)"
  },
  flowStep: {
    display: "grid",
    gridTemplateColumns: "minmax(140px, 0.7fr) minmax(220px, 1.2fr) minmax(220px, 1.2fr) minmax(220px, 1.2fr)",
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
  const riskFlow = getNexusDay305AiRiskRadarOwnerApprovalFlow();

  const dashboardValidation = validateNexusDay302CinematicDemoDashboardStructure();
  const storyValidation = validateNexusDay303OwnerCommandCenterVisualStory();
  const simulationValidation = validateNexusDay304SampleCustomerRequestSimulation();
  const riskFlowValidation = validateNexusDay305AiRiskRadarOwnerApprovalFlow();

  const safe =
    dashboardValidation.ok &&
    storyValidation.ok &&
    simulationValidation.ok &&
    riskFlowValidation.ok;

  return (
    <main style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.topBar}>
          <div style={styles.badge}>NEXUS / Premium Cinematic Demo</div>
          <div style={styles.badge}>Read-only · Preview-only · Sample data only</div>
          <div style={styles.badge}>Validation: {safe ? "SAFE" : "CHECK REQUIRED"}</div>
        </div>

        <section style={styles.hero}>
          <div style={styles.eyebrow}>Day 305 · AI Risk Radar + Owner Approval</div>
          <h1 style={styles.h1}>Risk appears before action. Owner stays final.</h1>
          <p style={styles.heroText}>{riskFlow.riskRadarPromise}</p>
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

        <h2 style={styles.sectionTitle}>AI Risk Radar</h2>
        <section style={styles.twoGrid} aria-label="AI risk radar preview">
          {riskFlow.riskSignals.map((signal) => (
            <article key={signal.risk} style={styles.riskCard}>
              <div style={styles.kpiLabel}>{signal.risk}</div>
              <div style={styles.sceneTitle}>{signal.whyItMatters}</div>
              <div style={styles.muted}>{signal.ownerGate}</div>
              <span style={styles.dangerStatus}>{signal.severity}</span>
            </article>
          ))}
        </section>

        <section style={styles.approvalCard} aria-label="Owner approval cinematic flow">
          <div style={styles.eyebrow}>Owner Approval Flow</div>
          <h2 style={styles.sectionTitle}>Every risky path stops at the owner gate.</h2>
          <p style={styles.muted}>
            This is a cinematic preview only. It does not approve, reject, override, recover, roll
            back, send, charge, invoice, file tax, mutate systems, or execute trade.
          </p>
          {riskFlow.approvalFlow.map((step) => (
            <div key={step.step} style={styles.flowStep}>
              <div>
                <div style={styles.kpiLabel}>{step.step}</div>
                <span style={styles.status}>{step.executionState}</span>
              </div>
              <div>
                <div style={styles.sceneSubtitle}>Radar view</div>
                <div style={styles.muted}>{step.radarView}</div>
              </div>
              <div>
                <div style={styles.sceneSubtitle}>Owner decision</div>
                <div style={styles.muted}>{step.ownerDecision}</div>
              </div>
              <div>
                <div style={styles.sceneSubtitle}>NEXUS boundary</div>
                <div style={styles.muted}>{step.nexusBoundary}</div>
              </div>
            </div>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Sample Request Context</h2>
        <section style={styles.card} aria-label="Sample customer request context">
          <div style={styles.sceneTitle}>{simulation.sampleRequestTitle}</div>
          <div style={styles.muted}>
            Sample request remains preview-only. No customer reply, invoice, payment link, GST,
            e-way bill, delivery promise, AI call, or third-party mutation is executed.
          </div>
        </section>

        <section style={styles.shield}>
          <h2 style={styles.sectionTitle}>Legal-Safe Shield</h2>
          <p style={styles.muted}>
            NEXUS remains an owner-controlled AI Business Operating Layer. This demo does not
            launch, activate payment, create invoices, execute GST, generate e-way bills, send
            messages, call AI models, mutate third-party systems, or use real customer data.
          </p>
          <div style={styles.shieldGrid}>
            {riskFlow.blockedExecutionProof.map((item) => (
              <div key={item} style={styles.shieldItem}>{item}</div>
            ))}
          </div>
        </section>

        <p style={styles.footer}>
          Route: {riskFlow.routePath}. Source: Day {riskFlow.sourceDay}. Completion:{" "}
          {riskFlow.completionResult}. Launch remains {riskFlow.launchAuthorization}.
        </p>
      </div>
    </main>
  );
}
