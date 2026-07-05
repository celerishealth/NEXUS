import type { CSSProperties } from "react";
import {
  getNexusDay306SubscriptionLockVisualPanel,
  validateNexusDay306SubscriptionLockVisualPanel
} from "@/lib/nexus/day306SubscriptionLockVisualPanel";
import {
  getNexusDay307LegalSafeComplianceShieldPanel,
  validateNexusDay307LegalSafeComplianceShieldPanel
} from "@/lib/nexus/day307LegalSafeComplianceShieldPanel";

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
  complianceCard: {
    border: "1px solid rgba(52, 211, 153, 0.28)",
    borderRadius: "26px",
    padding: "22px",
    background:
      "linear-gradient(135deg, rgba(6, 78, 59, 0.24), rgba(15, 23, 42, 0.78))",
    boxShadow: "0 18px 58px rgba(6, 78, 59, 0.22)"
  },
  dangerCard: {
    border: "1px solid rgba(248, 113, 113, 0.26)",
    borderRadius: "26px",
    padding: "22px",
    background:
      "linear-gradient(135deg, rgba(127, 29, 29, 0.22), rgba(15, 23, 42, 0.76))",
    boxShadow: "0 18px 58px rgba(127, 29, 29, 0.18)"
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
    border: "1px solid rgba(52, 211, 153, 0.34)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#bbf7d0",
    background: "rgba(6, 78, 59, 0.28)"
  },
  lockedStatus: {
    display: "inline-block",
    marginTop: "14px",
    border: "1px solid rgba(251, 191, 36, 0.38)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#fde68a",
    background: "rgba(113, 63, 18, 0.28)"
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
  const subscriptionPanel = getNexusDay306SubscriptionLockVisualPanel();
  const compliancePanel = getNexusDay307LegalSafeComplianceShieldPanel();

  const subscriptionValidation = validateNexusDay306SubscriptionLockVisualPanel();
  const complianceValidation = validateNexusDay307LegalSafeComplianceShieldPanel();

  const safe = subscriptionValidation.ok && complianceValidation.ok;

  return (
    <main style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.topBar}>
          <div style={styles.badge}>NEXUS / Premium Cinematic Demo</div>
          <div style={styles.badge}>Read-only · Preview-only · Sample data only</div>
          <div style={styles.badge}>Validation: {safe ? "SAFE" : "CHECK REQUIRED"}</div>
        </div>

        <section style={styles.hero}>
          <div style={styles.eyebrow}>Day 307 · Legal-Safe Compliance Shield</div>
          <h1 style={styles.h1}>Compliance visible. Execution blocked.</h1>
          <p style={styles.heroText}>{compliancePanel.complianceShieldPromise}</p>
        </section>

        <h2 style={styles.sectionTitle}>Compliance Readiness Map</h2>
        <section style={styles.twoGrid} aria-label="Compliance readiness map">
          {compliancePanel.readinessItems.map((item) => (
            <article key={item.area} style={styles.complianceCard}>
              <div style={styles.kpiLabel}>{item.area}</div>
              <div style={styles.kpiValue}>{item.visibleState}</div>
              <div style={styles.muted}>{item.blockedExecution}</div>
              <div style={styles.muted}>{item.requiredBeforeFutureExecution}</div>
              <span style={styles.status}>readiness only</span>
            </article>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Owner Legal Rules</h2>
        <section style={styles.twoGrid} aria-label="Owner legal rules">
          {compliancePanel.ownerLegalRules.map((rule) => (
            <article key={rule} style={styles.dangerCard}>
              <div style={styles.sceneTitle}>{rule}</div>
              <span style={styles.lockedStatus}>locked</span>
            </article>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Subscription Lock Context</h2>
        <section style={styles.card} aria-label="Subscription lock context">
          <div style={styles.sceneTitle}>Paid access visible. Execution locked.</div>
          <div style={styles.muted}>{subscriptionPanel.subscriptionLockPromise}</div>
        </section>

        <section style={styles.shield}>
          <h2 style={styles.sectionTitle}>Legal-Safe Execution Shield</h2>
          <p style={styles.muted}>
            NEXUS does not launch, charge customers, create invoices, write entitlements, execute
            GST, generate e-way bills, mutate government APIs, file compliance, send messages, call
            AI models, mutate third-party systems, or use real customer data.
          </p>
          <div style={styles.shieldGrid}>
            {compliancePanel.blockedExecutionProof.map((item) => (
              <div key={item} style={styles.shieldItem}>{item}</div>
            ))}
          </div>
        </section>

        <p style={styles.footer}>
          Route: {compliancePanel.routePath}. Source: Day {compliancePanel.sourceDay}. Completion:{" "}
          {compliancePanel.completionResult}. Launch remains {compliancePanel.launchAuthorization}.
        </p>
      </div>
    </main>
  );
}
