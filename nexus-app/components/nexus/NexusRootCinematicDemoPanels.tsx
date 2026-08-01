const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
};

export default function NexusRootCinematicDemoPanels() {
  return (
    <>
      <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "flex-start",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}>
              Cinematic Demo Story Flow v1
            </p>
            <h2 style={{ margin: 0 }}>NEXUS Business Control Room</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "760px",
              lineHeight: 1.7,
            }}>
              A safe AI operating sequence: customer risk enters, AI prepares the draft,
              NEXUS locks risky action behind owner approval, then preserves audit,
              memory, fallback, and revenue protection.
            </p>
          </div>
          <div style={{
            border: "1px solid rgba(34, 197, 94, 0.35)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#bbf7d0",
            background: "rgba(22, 163, 74, 0.12)",
            fontWeight: 800,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            UI-only demo layer
          </div>
        </div>




        <div style={{
          border: "1px solid rgba(56, 189, 248, 0.28)",
          borderRadius: "22px",
          padding: "16px",
          marginBottom: "14px",
          background: "linear-gradient(135deg, rgba(14, 116, 144, 0.18), rgba(15, 23, 42, 0.78))",
          boxShadow: "0 18px 44px rgba(2, 6, 23, 0.28)",
        }}>
          <p style={{
            margin: "0 0 10px",
            color: "#67e8f9",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Owner Command Briefing Panel v1
          </p>

          <h3 style={{
            margin: "0 0 12px",
            color: "#f8fafc",
            fontSize: "18px",
          }}>
            Owner sees the full safe business sequence before action happens.
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "10px",
          }}>
            {[
              ["01", "Customer request enters", "NEXUS captures the business request without executing risky action."],
              ["02", "AI creates safe draft", "AI prepares a response draft under Safety Layer control."],
              ["03", "Risk detector checks damage", "Pricing, stock, payment, delivery, return, and trust risk are reviewed."],
              ["04", "Owner approval protects business", "Risky routes stay locked until owner decision."],
              ["05", "Audit, memory, fallback stay ready", "Traceability, customer context, and recovery path remain preserved."],
            ].map(([step, title, description]) => (
              <div key={step} style={{
                border: "1px solid rgba(148, 163, 184, 0.18)",
                borderRadius: "16px",
                padding: "14px",
                background: "rgba(15, 23, 42, 0.72)",
              }}>
                <p style={{
                  margin: "0 0 8px",
                  color: "#22c55e",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                }}>
                  {step}
                </p>
                <h4 style={{
                  margin: "0 0 8px",
                  color: "#f8fafc",
                  fontSize: "14px",
                }}>
                  {title}
                </h4>
                <p style={{
                  margin: 0,
                  color: "#cbd5e1",
                  lineHeight: 1.55,
                  fontSize: "13px",
                }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          border: "1px solid rgba(34, 197, 94, 0.28)",
          borderRadius: "22px",
          padding: "14px",
          marginBottom: "14px",
          background: "linear-gradient(135deg, rgba(6, 78, 59, 0.22), rgba(15, 23, 42, 0.72))",
          boxShadow: "0 18px 44px rgba(2, 6, 23, 0.28)",
        }}>
          <p style={{
            margin: "0 0 10px",
            color: "#86efac",
            fontSize: "12px",
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Demo Recording Control Strip v1
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "10px",
          }}>
            {["Live Safe Demo", "Owner Controlled", "No Risky Execution", "Audit Ready", "Zero Damage Mode"].map((label) => (
              <div key={label} style={{
                border: "1px solid rgba(148, 163, 184, 0.18)",
                borderRadius: "16px",
                padding: "12px",
                background: "rgba(15, 23, 42, 0.72)",
                color: "#f8fafc",
                fontSize: "13px",
                fontWeight: 900,
                textAlign: "center",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "14px",
        }}>
          {["Mobile Cinematic Demo Polish v1", "Risk In", "AI Draft", "Owner Gate", "Audit Trail", "Fallback", "Revenue Lock"].map((label) => (
            <span key={label} style={{
              border: "1px solid rgba(103, 232, 249, 0.22)",
              borderRadius: "999px",
              padding: "8px 10px",
              color: "#cffafe",
              background: "rgba(8, 47, 73, 0.34)",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.02em",
            }}>
              {label}
            </span>
          ))}
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}>
          {[
            ["01", "Customer Risk Enters", "A risky customer request appears inside the business command center."],
            ["02", "AI Draft Created", "NEXUS prepares a controlled response draft without unsafe execution."],
            ["03", "Risk Detector Activated", "Pricing, stock, payment, delivery, return, and damage risk are classified."],
            ["04", "Owner Approval Gate Locked", "High-impact action waits for owner approval before release."],
            ["05", "Audit + Memory Preserved", "Every step stays traceable while customer context remains remembered."],
            ["06", "Fallback Ready", "Recovery path remains available so the business does not stop."],
            ["07", "Subscription Lock Protects Revenue", "Access control protects SaaS monetization and owner discipline."],
          ].map(([step, title, description]) => (
            <div key={step} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "18px",
              padding: "16px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.72))",
              boxShadow: "0 18px 40px rgba(2, 6, 23, 0.22)",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}>
                <span style={{
                  color: "#67e8f9",
                  fontWeight: 900,
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                }}>
                  {step}
                </span>
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: "#22c55e",
                  boxShadow: "0 0 18px rgba(34, 197, 94, 0.85)",
                }} />
              </div>
              <h3 style={{
                margin: "0 0 8px",
                color: "#f8fafc",
                fontSize: "16px",
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.6,
                fontSize: "14px",
              }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
