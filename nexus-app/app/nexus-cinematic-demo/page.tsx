import type { CSSProperties } from "react";
import {
  getNexusDay309PremiumDemoCopyLayoutPolish,
  validateNexusDay309PremiumDemoCopyLayoutPolish
} from "@/lib/nexus/day309PremiumDemoCopyLayoutPolish";
import {
  getNexusDay310CinematicDemoReviewCheckpoint,
  validateNexusDay310CinematicDemoReviewCheckpoint
} from "@/lib/nexus/day310CinematicDemoReviewCheckpoint";
import {
  getNexusDay311CinematicDemoAccessNavigationPolish,
  validateNexusDay311CinematicDemoAccessNavigationPolish
} from "@/lib/nexus/day311CinematicDemoAccessNavigationPolish";

type StyleMap = Record<string, CSSProperties>;

const styles: StyleMap = {
  shell: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(52, 211, 153, 0.20), transparent 30%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.20), transparent 34%), radial-gradient(circle at bottom, rgba(168, 85, 247, 0.14), transparent 38%), linear-gradient(135deg, #020617 0%, #07111f 48%, #020617 100%)",
    color: "#f8fafc",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    padding: "34px"
  },
  frame: { maxWidth: "1240px", margin: "0 auto" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap"
  },
  badge: {
    border: "1px solid rgba(148, 163, 184, 0.28)",
    borderRadius: "999px",
    padding: "9px 13px",
    color: "#cbd5e1",
    background: "rgba(15, 23, 42, 0.72)",
    boxShadow: "0 0 40px rgba(15, 23, 42, 0.5)",
    fontSize: "13px"
  },
  hero: {
    border: "1px solid rgba(148, 163, 184, 0.24)",
    borderRadius: "34px",
    padding: "38px",
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.62))",
    boxShadow: "0 28px 100px rgba(0, 0, 0, 0.48)",
    backdropFilter: "blur(18px)",
    marginBottom: "24px"
  },
  eyebrow: {
    color: "#67e8f9",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: "12px",
    fontWeight: 800,
    marginBottom: "15px"
  },
  h1: {
    fontSize: "clamp(42px, 7vw, 92px)",
    lineHeight: "0.9",
    letterSpacing: "-0.08em",
    margin: 0,
    maxWidth: "1040px"
  },
  heroText: {
    color: "#cbd5e1",
    fontSize: "19px",
    lineHeight: 1.75,
    maxWidth: "920px",
    marginTop: "22px",
    marginBottom: 0
  },
  sectionTitle: {
    fontSize: "28px",
    letterSpacing: "-0.045em",
    marginTop: "32px",
    marginBottom: "14px"
  },
  navGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
    marginTop: "18px"
  },
  navCard: {
    border: "1px solid rgba(103, 232, 249, 0.23)",
    borderRadius: "24px",
    padding: "20px",
    background:
      "linear-gradient(135deg, rgba(8, 47, 73, 0.26), rgba(15, 23, 42, 0.76))",
    boxShadow: "0 18px 62px rgba(8, 47, 73, 0.22)"
  },
  label: {
    color: "#94a3b8",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    marginBottom: "11px",
    fontWeight: 800
  },
  headline: {
    fontSize: "23px",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    lineHeight: 1.08
  },
  muted: { color: "#cbd5e1", lineHeight: 1.65, marginTop: "10px" },
  status: {
    display: "inline-block",
    marginTop: "15px",
    border: "1px solid rgba(103, 232, 249, 0.34)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#a5f3fc",
    background: "rgba(8, 47, 73, 0.32)"
  },
  shield: {
    marginTop: "24px",
    border: "1px solid rgba(52, 211, 153, 0.28)",
    borderRadius: "30px",
    padding: "26px",
    background: "rgba(6, 78, 59, 0.18)"
  },
  shieldGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
    gap: "10px",
    marginTop: "15px"
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
  const polish = getNexusDay309PremiumDemoCopyLayoutPolish();
  const checkpoint = getNexusDay310CinematicDemoReviewCheckpoint();
  const access = getNexusDay311CinematicDemoAccessNavigationPolish();

  const polishValidation = validateNexusDay309PremiumDemoCopyLayoutPolish();
  const checkpointValidation = validateNexusDay310CinematicDemoReviewCheckpoint();
  const accessValidation = validateNexusDay311CinematicDemoAccessNavigationPolish();

  const safe = polishValidation.ok && checkpointValidation.ok && accessValidation.ok;

  return (
    <main style={styles.shell}>
      <div style={styles.frame}>
        <div style={styles.topBar}>
          <div style={styles.badge}>NEXUS / Premium Cinematic Demo</div>
          <div style={styles.badge}>Read-only · Preview-only · Sample data only</div>
          <div style={styles.badge}>Validation: {safe ? "SAFE" : "CHECK REQUIRED"}</div>
        </div>

        <section style={styles.hero}>
          <div style={styles.eyebrow}>Day 311 · Demo Access + Navigation Polish</div>
          <h1 style={styles.h1}>Review the command layer without unlocking execution.</h1>
          <p style={styles.heroText}>{access.accessPromise}</p>
        </section>

        <h2 style={styles.sectionTitle}>Demo Navigation</h2>
        <section style={styles.navGrid} aria-label="NEXUS cinematic demo navigation">
          {access.navigationItems.map((item) => (
            <article key={item.label} style={styles.navCard}>
              <div style={styles.label}>{item.label}</div>
              <div style={styles.headline}>{item.destination}</div>
              <div style={styles.muted}>{item.purpose}</div>
              <span style={styles.status}>{item.safetyState}</span>
            </article>
          ))}
        </section>

        <h2 style={styles.sectionTitle}>Demo Review Checkpoint</h2>
        <section style={styles.navCard} aria-label="Day 310 review checkpoint">
          <div style={styles.label}>Checkpoint Status</div>
          <div style={styles.headline}>{checkpoint.checkpointStatus}</div>
          <div style={styles.muted}>
            Day {checkpoint.day} confirms the cinematic demo phase remains read-only,
            preview-only, sample-data-only, and not launch-authorized.
          </div>
        </section>

        <h2 style={styles.sectionTitle}>Premium Positioning</h2>
        <section style={styles.navCard} aria-label="Premium positioning">
          <div style={styles.label}>NEXUS Position</div>
          <div style={styles.headline}>Owner-controlled AI Business Operating Layer</div>
          <div style={styles.muted}>{polish.premiumPositioning}</div>
        </section>

        <section style={styles.shield}>
          <h2 style={styles.sectionTitle}>Access Safety Boundary</h2>
          <p style={styles.muted}>
            Demo access improves review clarity only. It cannot launch, charge, invoice, write
            entitlements, execute GST, generate e-way bills, mutate government APIs, send messages,
            call AI models, mutate third-party systems, execute global trade, or use real customer data.
          </p>
          <div style={styles.shieldGrid}>
            {access.blockedExecutionProof.map((item) => (
              <div key={item} style={styles.shieldItem}>{item}</div>
            ))}
          </div>
        </section>

        <p style={styles.footer}>
          Route: {access.routePath}. Source: Day {access.sourceDay}. Completion:{" "}
          {access.completionResult}. Launch remains {access.launchAuthorization}.
        </p>
      </div>
    </main>
  );
}
