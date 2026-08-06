"use client";

type OwnerApprovalItem = {
  id: number;
  type: string;
  input: string;
  response: string;
  status: string;
  riskLevel?: string;
  riskTags?: string[];
};

type NexusRootOwnerApprovalRoutingProps = {
  responseHistory: OwnerApprovalItem[];
  filteredApprovalRoutes: OwnerApprovalItem[];
  approveRequest: (requestId: number) => void;
  rejectRequest: (requestId: number) => void;
};

const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
};

export default function NexusRootOwnerApprovalRouting({
  responseHistory,
  filteredApprovalRoutes,
  approveRequest,
  rejectRequest,
}: NexusRootOwnerApprovalRoutingProps) {
  return (
        <section style={{ ...cardStyle, marginTop: "28px" }}>
          <h2 style={{ marginBottom: "16px" }}>Owner Approval Routing v1</h2>

              <div
                style={{
                  background: "#111827",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  padding: "14px",
                  marginBottom: "16px",
                }}
              >
                <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                  Owner Approval Review Checklist
                </p>
                <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                  <li>Verify customer request and AI response before owner decision.</li>
                  <li>Check pricing, payment, stock, delivery, return, refund, and trust risk.</li>
                  <li>Approve only when safe under owner-approved business rules.</li>
                  <li>Reject unclear, unsafe, incomplete, or policy-breaking routes.</li>
                </ul>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                  Advisory UI only. This checklist does not execute, approve, reject, or change route status.
                </p>
              </div>

          {responseHistory.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No approval routes match this filter yet.</p>
          ) : (
            filteredApprovalRoutes.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "14px",
                  background: "#020617",
                }}
              >
                <h3 style={{ marginBottom: "8px" }}>Request Type: {item.type}</h3>
                    <p style={{ color: "#94a3b8", marginBottom: "8px" }}>Request ID: {item.id}</p>
                    <p
                    style={{
                      color:
                        item.status === "Approved"
                          ? "#22c55e"
                          : item.status === "Rejected"
                            ? "#ef4444"
                            : "#facc15",
                      marginBottom: "12px",
                    }}
                  >
                    Status: {item.status}
                  </p>

                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #38bdf8",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Recovery Queue Readiness v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Failed request is held safely instead of disappearing or executing blindly.</li>
                      <li>Retry later keeps NEXUS moving without forcing unsafe action.</li>
                      <li>Owner notified keeps business control with the owner.</li>
                      <li>Audit trail preserved keeps every failure reviewable.</li>
                      <li>Customer memory preserved keeps context available after recovery.</li>
                      <li>No unsafe auto execution protects the business from system failure damage.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only recovery readiness panel. It does not retry requests, execute actions, approve routes, reject routes, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #f59e0b",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Fallback Mode Readiness v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Safe Mode activates when AI, API, or system confidence is not enough.</li>
                      <li>Owner Review Required keeps risky routes from moving automatically.</li>
                      <li>Risky Route Hold protects pricing, payment, delivery, stock, refund, and trust decisions.</li>
                      <li>Audit Log Preserved keeps the review trail visible.</li>
                      <li>Customer Memory Preserved keeps context available for owner review.</li>
                      <li>No Auto Damage keeps NEXUS from executing unsafe actions.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only fallback readiness panel. It does not execute actions, approve routes, reject routes, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #ef4444",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Owner Alert Readiness v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Alert owner when AI or API failure is detected.</li>
                      <li>Alert owner when a risky route is detected.</li>
                      <li>Alert owner when approval is pending.</li>
                      <li>Alert owner when recovery queue needs attention.</li>
                      <li>Alert owner when fallback mode is active.</li>
                      <li>Alert owner when customer trust risk is possible.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only owner alert readiness panel. It does not send alerts, execute actions, approve routes, reject routes, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #22c55e",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      System Health Sentinel v1
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      {[
                        ["AI Brain", "Active"],
                        ["Safety Layer", "Active"],
                        ["Owner Approval", "Active"],
                        ["Audit Logs", "Active"],
                        ["Customer Memory", "Active"],
                        ["Fallback Mode", "Ready"],
                        ["Zero Damage Guard", "Enabled"],
                      ].map(([healthName, healthStatus]) => (
                        <div
                          key={healthName}
                          style={{
                            background: "#111827",
                            border: "1px solid #334155",
                            borderRadius: "10px",
                            padding: "10px",
                          }}
                        >
                          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}>
                            {healthName}
                          </p>
                          <p style={{ color: "#22c55e", fontWeight: 700 }}>{healthStatus}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only health sentinel. It does not execute actions, approve routes, reject routes, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #a855f7",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Public Demo Link Preflight v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>GitHub must be clean before deployment.</li>
                      <li>Production build must pass before deployment.</li>
                      <li>.env.local must not be committed or exposed.</li>
                      <li>Public demo link must stay safe and view-only.</li>
                      <li>No real business action should execute from demo link.</li>
                      <li>No API key, secret, or private config should leak.</li>
                      <li>Phone demo becomes ready after secure deployment.</li>
                      <li>Owner Approval, Safety Layer, Audit Logs, Customer Memory, and Fallback story must remain visible.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only public demo preflight panel. It does not deploy the app, expose secrets, execute actions, approve routes, reject routes, process payments, block users, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #6366f1",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Phone/Public Link Deployment Readiness v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Local demo flow is ready for public demo preparation.</li>
                      <li>Next launch step is a secure phone/public demo link.</li>
                      <li>Vercel deployment path is the preferred demo launch route.</li>
                      <li>Environment variables must stay safe before deployment.</li>
                      <li>.env.local must never be pushed to GitHub.</li>
                      <li>Production build must pass before every deploy.</li>
                      <li>Public demo link must remain view-only and safe.</li>
                      <li>No real business action should execute from public demo mode.</li>
                      <li>Client can open the demo from phone after deployment.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only deployment readiness panel. It does not deploy the app, expose secrets, execute actions, approve routes, reject routes, process payments, block users, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #38bdf8",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Demo Launch Checklist v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Demo mode is safe and ready for client explanation.</li>
                      <li>No real business execution is triggered during demo.</li>
                      <li>AI request flow is visible.</li>
                      <li>Owner Approval is visible.</li>
                      <li>Safety Layer is visible.</li>
                      <li>Audit Logs are visible.</li>
                      <li>Customer Memory is visible.</li>
                      <li>Recovery and Fallback readiness are visible.</li>
                      <li>Subscription Access Lock readiness is visible.</li>
                      <li>Founder pitch is ready for client conversation.</li>
                      <li>Phone/public link deployment is the next launch step.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only demo launch checklist. It does not deploy the app, execute actions, approve routes, reject routes, process payments, block users, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #eab308",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Demo Mode Final Review v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>AI request flow is ready for safe demo explanation.</li>
                      <li>Owner Approval is visible for risky business decisions.</li>
                      <li>Safety Layer is visible for business damage prevention.</li>
                      <li>Audit Logs are visible for review and accountability.</li>
                      <li>Customer Memory is visible for follow-up context.</li>
                      <li>Recovery and Fallback readiness are visible for failure safety.</li>
                      <li>Subscription Access Lock readiness is visible for paid plan protection.</li>
                      <li>Demo mode is safe and does not execute real business actions.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only final demo review panel. It does not execute actions, approve routes, reject routes, process payments, block users, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #f59e0b",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Client Pitch Snapshot v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Problem: Businesses lose time, miss follow-ups, and risk wrong replies.</li>
                      <li>Solution: NEXUS handles customer requests with AI draft support and owner control.</li>
                      <li>Owner Control: Risky pricing, payment, delivery, refund, and stock decisions need approval.</li>
                      <li>Safety Layer: NEXUS catches risky routes before business damage happens.</li>
                      <li>Audit Logs: Owner can review what happened, when it happened, and why it happened.</li>
                      <li>Customer Memory: NEXUS remembers recent customer context for better follow-up.</li>
                      <li>Paid Plan Value: Subscription lock protects revenue after plan expiry.</li>
                      <li>Positioning: NEXUS is not a chatbot. It is an AI Business Operating System.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only client pitch snapshot. It does not execute actions, approve routes, reject routes, process payments, block users, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #14b8a6",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      MVP Demo Polish Panel v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>NEXUS is an AI Business Operating System, not a simple chatbot.</li>
                      <li>Customer requests are handled with AI draft support.</li>
                      <li>Risk detector protects pricing, payment, delivery, stock, refund, and trust decisions.</li>
                      <li>Owner Approval keeps risky business decisions under owner control.</li>
                      <li>Audit Logs keep every important action reviewable.</li>
                      <li>Customer Memory keeps context available for better follow-up.</li>
                      <li>Fallback and Recovery readiness protect against AI/API/system failure.</li>
                      <li>Subscription Access Lock protects paid plan revenue after expiry.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only demo polish panel. It does not execute actions, approve routes, reject routes, process payments, block users, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #22c55e",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Subscription Access Lock Readiness v1
                    </p>
                    <ul style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Active plan allows full dashboard access.</li>
                      <li>Trial plan allows limited access based on owner rules.</li>
                      <li>Expired plan locks the app until renewal.</li>
                      <li>Blocked plan allows no business access.</li>
                      <li>Renew page remains available for payment recovery.</li>
                      <li>API and business actions must be blocked after expiry.</li>
                      <li>Audit log remains preserved for owner review.</li>
                      <li>No bypass access after plan expiry.</li>
                    </ul>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only subscription lock readiness panel. It does not process payments, block real users, change auth middleware, execute actions, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #a855f7",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      MVP Demo Scenario Pack v1
                    </p>
                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>
                      <p style={{ marginBottom: "8px" }}>
                        Customer: Can you give me 40% discount and deliver today without payment confirmation?
                      </p>
                      <p style={{ marginBottom: "8px" }}>
                        AI Draft: I can help, but discount, delivery, and payment risk need owner review.
                      </p>
                      <p style={{ marginBottom: "8px" }}>
                        Risk Detector: High risk found in pricing, delivery, and payment route.
                      </p>
                      <p style={{ marginBottom: "8px" }}>
                        Owner Approval: Required before any risky business action.
                      </p>
                      <p style={{ marginBottom: "8px" }}>
                        Audit + Memory: Customer request, AI response, risk, and owner decision remain visible.
                      </p>
                      <p style={{ margin: 0 }}>
                        Fallback + Recovery: If AI/API fails, request is held safely with no auto damage.
                      </p>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only demo scenario pack. It does not execute actions, approve routes, reject routes, send alerts, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      MVP Demo Flow Panel v1
                    </p>
                    <ol style={{ color: "#cbd5e1", paddingLeft: "18px", margin: 0 }}>
                      <li>Customer request enters NEXUS.</li>
                      <li>AI response is drafted safely.</li>
                      <li>Risk detector checks business damage risk.</li>
                      <li>Owner approves or rejects risky routes.</li>
                      <li>Audit log and customer memory support review.</li>
                    </ol>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px" }}>
                      UI-only demo flow panel. It does not execute actions, approve routes, reject routes, or change backend logic.
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                    }}
                  >
                    <button
                      onClick={() => approveRequest(item.id)}
                      disabled={item.status === "Approved"}
                      style={{
                        background: "#14532d",
                        color: "#dcfce7",
                        border: "1px solid #22c55e",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        opacity: item.status === "Approved" ? 0.6 : 1,
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectRequest(item.id)}
                      disabled={item.status === "Rejected"}
                      style={{
                        background: "#450a0a",
                        color: "#fee2e2",
                        border: "1px solid #ef4444",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        opacity: item.status === "Rejected" ? 0.6 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </div>
                <div style={{ color: "#94a3b8", marginBottom: "8px" }}>
                  <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                    Customer Memory Mini v1
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "10px" }}>
                    Recent customer request and AI response memory for owner context.
                  </p>
                  <div
                    style={{
                      background: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <p style={{ color: "#f8fafc", fontWeight: 700, marginBottom: "8px" }}>
                      Audit Log Mini v1
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px" }}>
                      Audit Event: Customer request captured and AI response generated.
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px" }}>
                      Review Context: Owner can inspect the request and response before trusting any risky route.
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                      UI-only audit preview. It does not execute actions, approve routes, reject routes, or modify data.
                    </p>
                  </div>
                  Customer Input: {item.input}
                </div>
                <p style={{ color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
                  {item.response}
                </p>
              </div>
            ))
          )}
        </section>
  );
}
