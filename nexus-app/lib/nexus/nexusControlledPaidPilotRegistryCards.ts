export const nexusControlledPaidPilotRegistryCards = [
  {
    day: 201,
    label: "Final Review",
    title: "Controlled Paid Pilot Launch Readiness Completion Final Review v1",
    description:
      "Read-only final readiness review preserving locked NEXUS vision, owner control, safety boundaries, monetization discipline, and controlled paid pilot launch readiness.",
    href: "/api/nexus/controlled-paid-pilot-launch-readiness-completion-final-review",
    accent: "cyan",
  },
  {
    day: 202,
    label: "Execution Boundary",
    title: "Controlled Paid Pilot Launch Execution Architecture Boundary Contract v1",
    description:
      "Read-only boundary contract defining future execution requirements while keeping risky real-world actions blocked.",
    href: "/api/nexus/controlled-paid-pilot-launch-execution-architecture-boundary",
    accent: "emerald",
  },
  {
    day: 203,
    label: "Owner Execution Gate",
    title: "Controlled Paid Pilot Launch Owner Execution Gate Contract v1",
    description:
      "Read-only owner-only execution gate contract requiring future owner review, confirmation, audit readiness, rollback readiness, and fail-closed behavior.",
    href: "/api/nexus/controlled-paid-pilot-launch-owner-execution-gate",
    accent: "amber",
  },
  {
    day: 204,
    label: "Risk Scoring",
    title: "Controlled Paid Pilot Launch Risk Scoring and Action Class Contract v1",
    description:
      "Read-only risk scoring and action-class contract defining low, medium, high, and blocked action surfaces.",
    href: "/api/nexus/controlled-paid-pilot-launch-risk-scoring-action-class",
    accent: "rose",
  },
  {
    day: 205,
    label: "Allowlist / Blocklist",
    title: "Controlled Paid Pilot Launch Action-Class Allowlist and Blocklist Contract v1",
    description:
      "Read-only action-class allowlist/blocklist contract defining preview-only, future-eligible, and hard-blocked surfaces.",
    href: "/api/nexus/controlled-paid-pilot-launch-action-class-allowlist-blocklist",
    accent: "violet",
  },
  {
    day: 206,
    label: "Preview Lifecycle",
    title: "Controlled Paid Pilot Launch Pilot Action Preview Lifecycle Contract v1",
    description:
      "Read-only preview lifecycle contract covering intake, classification, risk score, blocked surface check, owner review packet, and eligibility preview.",
    href: "/api/nexus/controlled-paid-pilot-launch-pilot-action-preview-lifecycle",
    accent: "sky",
  },
  {
    day: 207,
    label: "Owner Review Packet",
    title: "Controlled Paid Pilot Launch Owner Review Packet Contract v1",
    description:
      "Read-only owner review packet contract defining required owner-facing action, risk, audit, rollback, and safe-next-step sections.",
    href: "/api/nexus/controlled-paid-pilot-launch-owner-review-packet",
    accent: "fuchsia",
  },
  {
    day: 208,
    label: "Execution Eligibility",
    title: "Controlled Paid Pilot Launch Execution Eligibility Decision Contract v1",
    description:
      "Read-only eligibility decision contract defining not-eligible, preview-only, future-eligible-after-contracts, and blocked states.",
    href: "/api/nexus/controlled-paid-pilot-launch-execution-eligibility-decision",
    accent: "lime",
  },
  {
    day: 209,
    label: "Audit Readiness",
    title: "Controlled Paid Pilot Launch Audit Readiness Contract v1",
    description:
      "Read-only audit readiness contract defining future traceability fields, owner decision visibility, rollback linkage, and fail-closed audit requirements.",
    href: "/api/nexus/controlled-paid-pilot-launch-audit-readiness",
    accent: "cyan",
  },
  {
    day: 210,
    label: "Rollback / Fallback",
    title: "Controlled Paid Pilot Launch Rollback and Fallback Readiness Contract v1",
    description:
      "Read-only rollback and fallback readiness contract protecting Zero Damage, Zero Stop, owner manual override, audit linkage, and recovery boundaries.",
    href: "/api/nexus/controlled-paid-pilot-launch-rollback-fallback-readiness",
    accent: "orange",
  },
  {
    day: 211,
    label: "Incident Response",
    title: "Controlled Paid Pilot Launch Incident Response Readiness Contract v1",
    description:
      "Read-only incident response readiness contract defining severity, affected surfaces, safe stop, rollback/audit linkage, and post-incident review.",
    href: "/api/nexus/controlled-paid-pilot-launch-incident-response-readiness",
    accent: "red",
  },
  {
    day: 212,
    label: "Manual Override",
    title: "Controlled Paid Pilot Launch Manual Owner Override Readiness Contract v1",
    description:
      "Read-only manual owner override readiness contract preserving owner final authority above AI, automation, and eligibility previews.",
    href: "/api/nexus/controlled-paid-pilot-launch-manual-owner-override-readiness",
    accent: "yellow",
  },
  {
    day: 213,
    label: "Safe Stop / Escalation",
    title: "Controlled Paid Pilot Launch Safe Stop and Manual Escalation Contract v1",
    description:
      "Read-only safe stop and manual escalation contract defining fail-closed triggers, owner-visible escalation, audit linkage, and rollback linkage.",
    href: "/api/nexus/controlled-paid-pilot-launch-safe-stop-manual-escalation",
    accent: "emerald",
  },
  {
    day: 214,
    label: "Dashboard Cleanup",
    title: "NEXUS Dashboard Registry Cleanup and Page Weight Reduction v1",
    description:
      "Read-only dashboard architecture cleanup consolidating recent safety cards into a reusable registry without changing execution or safety behavior.",
    href: "/api/nexus/dashboard-registry-cleanup-page-weight-reduction",
    accent: "cyan",
  },
  {
    day: 215,
    label: "Cleanup Validator",
    title: "NEXUS Dashboard Registry Cleanup Validator v1",
    description:
      "Read-only validator confirming the dashboard registry cleanup preserved API links, reduced page weight, and kept all NEXUS safety boundaries intact.",
    href: "/api/nexus/dashboard-registry-cleanup-validator",
    accent: "emerald",
  },
  {
    day: 216,
    label: "Integrity Checkpoint",
    title: "NEXUS Architecture Integrity Checkpoint v1",
    description:
      "Read-only architecture integrity checkpoint confirming NEXUS vision, owner control, safety, registry cleanup, Zero Damage, Zero Stop, audit readiness, rollback readiness, and execution boundaries remain preserved.",
    href: "/api/nexus/architecture-integrity-checkpoint",
    accent: "violet",
  },
  {
    day: 217,
    label: "Integrity Validator",
    title: "NEXUS Architecture Integrity Checkpoint Validator v1",
    description:
      "Read-only validator confirming the Day 216 architecture checkpoint preserves locked NEXUS vision, owner control, safety boundaries, dashboard registry discipline, and blocked execution surfaces.",
    href: "/api/nexus/architecture-integrity-checkpoint-validator",
    accent: "emerald",
  },
  {
    day: 218,
    label: "Execution Summary",
    title: "NEXUS Controlled Paid Pilot Execution Architecture Summary v1",
    description:
      "Read-only summary of controlled paid pilot execution architecture confirming owner control, safety, Zero Damage, Zero Stop, audit readiness, rollback readiness, incident readiness, manual override, safe stop, and dashboard integrity.",
    href: "/api/nexus/controlled-paid-pilot-execution-architecture-summary",
    accent: "sky",
  },
] as const;

export type NexusControlledPaidPilotRegistryCard = (typeof nexusControlledPaidPilotRegistryCards)[number];





