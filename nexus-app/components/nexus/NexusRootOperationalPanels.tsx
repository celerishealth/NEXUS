const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
};

const recentActivities = [
  "Day 2: Dashboard created",
  "Day 2: Sidebar added",
  "Day 2: System Health section added",
  "Day 3: AI Brain input box added",
  "Day 3: Dummy AI response added",
  "Day 3: Response history added",
  "Day 4: Prompt templates started",
];

const buildLogs = [
  "Day 83 backend customer memory context assembly contract v1 added",
  "Day 82 backend customer memory retrieval validator v1 added",
  "Day 81 backend customer memory retrieval contract v1 added",
  "Day 80 backend customer memory storage validator v1 added",
  "Day 79 backend customer memory storage contract v1 added",
  "Day 78 backend customer memory final write eligibility gate v1 added",
  "Day 77 backend customer memory review audit link validator v1 added",
  "Day 76 backend customer memory review audit link contract v1 added",
  "Day 75 backend customer memory review decision validator v1 added",
  "Day 74 backend customer memory review decision policy v1 added",
  "Day 73 backend customer memory review queue validator v1 added",
  "Day 72 backend customer memory review queue contract v1 added",
  "Day 71 backend customer memory write gate v1 added",
  "Day 70 backend customer memory retention policy v1 added",
  "Day 69 backend customer memory sanitizer v1 added",
  "Day 68 backend customer memory scope validator v1 added",
  "Day 67 backend customer memory contract v1 added",
  "Day 66 backend audit redaction policy v1 added",
  "Day 65 backend audit event validator v1 added",
  "Day 64 backend audit event contract v1 added",
  "Day 63 backend owner approval policy v1 added",
  "Day 62 backend risk classifier v1 added",
  "Day 61 backend guardrail registry v1 added",
  "Day 60 backend safety contract v1 added",
  "Day 59 backend foundation map v1 added",
  "Day 58 demo script control panel v1 added",
  "Day 57 MVP launch readiness panel v1 added",
  "Day 56 NEXUS moat dashboard v1 added",
  "Day 55 competitor weakness matrix v1 added",
  "Day 54 competitor attack map v1 added",
  "Day 53 customer memory proof panel v1 added",
  "Day 52 audit chain integrity panel v1 added",
  "Day 51 risk decision timeline v1 added",
  "Day 50 owner approval evidence panel v1 added",
  "Day 49 owner decision matrix v1 added",
  "Day 48 owner command briefing panel v1 added",
  "Day 47 demo recording control strip v1 added",
  "Day 46 mobile cinematic demo polish v1 added",
  "Day 45 cinematic demo story flow v1 added",
  "NEXUS v2 frontend started",
  "Home screen completed",
  "Launch button completed",
  "Dashboard completed",
  "Sidebar completed",
  "AI Brain basic system completed",
  "GitHub backup completed",
  "Production build passed",
  "Day 4 prompt templates added",
  "Day 8 disaster recovery plan added",
  "Day 8 safety layer v1 added",
  "Day 8 production build passed",
];

export function NexusRootRecentActivityPanel() {
  return (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "16px" }}>Recent Activity</h2>
            {recentActivities.map((activity) => (
              <p key={activity} style={{ color: "#cbd5e1" }}>
                 {activity}
              </p>
            ))}
          </div>
  );
}

export function NexusRootBuildLogPanel() {
  return (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "16px" }}>Build Log</h2>
            {buildLogs.map((log) => (
              <p key={log} style={{ color: "#cbd5e1" }}>
                 {log}
              </p>
            ))}
          </div>
  );
}

export function NexusRootSafetyLayerPanel() {
  return (
      <div style={cardStyle}>
          <h2 style={{ marginBottom: "16px" }}>Safety Layer v1</h2>
          <p style={{ color: "#22c55e", fontWeight: 700 }}>Safe Mode: Active</p>
          <p style={{ color: "#cbd5e1" }}>Response Mode: Draft Only</p>
          <p style={{ color: "#cbd5e1" }}>Owner Approval: Required</p>
          <p style={{ color: "#cbd5e1" }}>Raw AI Errors: Hidden</p>
          <p style={{ color: "#cbd5e1" }}>Fallback Engine: Active</p>
          <p style={{ color: "#cbd5e1" }}>Business Damage Protection: Enabled</p>
        </div>
  );
}
