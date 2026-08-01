const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
};

export default function NexusRootArchitectureEvidencePanels() {
  return (
    <>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#facc15",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Owner Decision Matrix v1
            </p>
            <h2 style={{ margin: 0 }}>Owner Decision Matrix</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "760px",
              lineHeight: 1.65,
            }}>
              NEXUS shows the owner what must be checked before any risky business route can move forward.
              This is a safe UI layer only; it does not approve, reject, execute, or change route status.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(250, 204, 21, 0.35)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#fef3c7",
            background: "rgba(113, 63, 18, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Owner gate locked
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Pricing Risk", "Rate, discount, margin, or wrong quote damage."],
            ["Stock Risk", "Unavailable, wrong quantity, or false stock promise."],
            ["Payment Risk", "Unclear payment, credit, refund, or collection exposure."],
            ["Delivery Risk", "Wrong timeline, wrong address, delay, or commitment risk."],
            ["Return / Damage Risk", "Replacement, return, damaged goods, or policy conflict."],
            ["Customer Trust Risk", "Tone, promise, relationship, or reputation damage."],
            ["Final Owner Gate", "Owner must approve before risky business action moves forward."],
          ].map(([title, detail]) => (
            <div key={title} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.62))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <h3 style={{
                margin: "0 0 8px",
                color: "#f8fafc",
                fontSize: "15px",
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Owner Approval Evidence Panel v1
            </p>
            <h2 style={{ margin: 0 }}>Owner Approval Evidence</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "760px",
              lineHeight: 1.65,
            }}>
              Before any risky route reaches owner decision, NEXUS presents the evidence needed
              to protect business trust, money, stock, delivery, and audit discipline.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(167, 139, 250, 0.35)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ede9fe",
            background: "rgba(76, 29, 149, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Evidence before approval
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Customer Request", "Original customer message remains visible before owner decision."],
            ["AI Draft", "AI response stays in draft mode until safety review is complete."],
            ["Detected Risk", "Risk category and impact are visible before approval."],
            ["Business Impact", "Owner sees what could affect money, trust, stock, or delivery."],
            ["Recommended Owner Action", "NEXUS guides owner toward approve, reject, or review."],
            ["Audit Proof", "Decision evidence remains traceable for future review."],
          ].map(([title, detail]) => (
            <div key={title} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(49, 46, 129, 0.32))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <h3 style={{
                margin: "0 0 8px",
                color: "#f8fafc",
                fontSize: "15px",
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {detail}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only evidence panel. It does not approve, reject, execute, change payment state,
          or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Risk Decision Timeline v1
            </p>
            <h2 style={{ margin: 0 }}>Risk Decision Timeline</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "760px",
              lineHeight: 1.65,
            }}>
              NEXUS shows the safe path of a risky customer request before any owner-controlled business action moves forward.
              This keeps the business protected without changing approval behavior.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(56, 189, 248, 0.35)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#cffafe",
            background: "rgba(8, 47, 73, 0.28)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Safe route visible
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["01", "Request Received", "Customer message enters NEXUS safely."],
            ["02", "AI Draft Prepared", "AI creates a draft, not an unsafe action."],
            ["03", "Risk Detected", "Risk detector checks possible business damage."],
            ["04", "Evidence Reviewed", "Owner sees request, draft, risk, and impact proof."],
            ["05", "Owner Decision Required", "Risky route waits behind owner approval gate."],
            ["06", "Audit Saved", "Decision path stays traceable for review."],
            ["07", "Recovery Ready", "Fallback path remains ready so business does not stop."],
          ].map(([step, title, detail]) => (
            <div key={step} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(8, 47, 73, 0.28))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#67e8f9",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.12em",
              }}>
                {step}
              </p>
              <h3 style={{
                margin: "0 0 8px",
                color: "#f8fafc",
                fontSize: "15px",
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {detail}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only timeline. It does not approve, reject, execute, change payment state,
          or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#34d399",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Audit Chain Integrity Panel v1
            </p>
            <h2 style={{ margin: 0 }}>Audit Chain Integrity</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "760px",
              lineHeight: 1.65,
            }}>
              NEXUS keeps every risky decision traceable from customer input to owner gate, decision proof,
              and recovery path. This protects the business from hidden execution and unclear responsibility.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(52, 211, 153, 0.35)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#bbf7d0",
            background: "rgba(6, 78, 59, 0.24)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Audit chain locked
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Customer Input Captured", "Original customer request remains part of the decision trail."],
            ["AI Draft Stored", "AI response draft stays visible before any owner-controlled action."],
            ["Risk Classification Saved", "Risk type and business exposure remain traceable."],
            ["Owner Gate Timestamp", "Owner review stage is clearly separated from AI draft creation."],
            ["Decision Proof Locked", "Approval or rejection proof stays linked to the route."],
            ["Recovery Path Linked", "Fallback and recovery context remain available if action is unsafe."],
            ["No Hidden Execution", "Nothing risky moves forward without visible owner control."],
          ].map(([title, detail]) => (
            <div key={title} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(6, 78, 59, 0.28))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <h3 style={{
                margin: "0 0 8px",
                color: "#f8fafc",
                fontSize: "15px",
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {detail}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only audit integrity layer. It does not approve, reject, execute, change payment state,
          or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#f472b6",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Customer Memory Proof Panel v1
            </p>
            <h2 style={{ margin: 0 }}>Customer Memory Proof</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "760px",
              lineHeight: 1.65,
            }}>
              NEXUS keeps customer context useful for safer replies while protecting boundaries.
              Memory supports owner decisions, but it does not expose unrelated customer data.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(244, 114, 182, 0.35)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#fce7f3",
            background: "rgba(131, 24, 67, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Memory stays controlled
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Customer Context Remembered", "Useful customer context remains available for safer business replies."],
            ["Previous Requests Linked", "Prior customer requests stay connected to current review context."],
            ["Risk History Visible", "Repeated risk patterns remain visible before owner decision."],
            ["Trust Notes Preserved", "Customer trust signals stay available without creating unsafe promises."],
            ["Owner Decision Context", "Owner sees memory context before approving a risky route."],
            ["Future Reply Safer", "Stored context helps reduce repeated mistakes in future replies."],
            ["No Memory Leak", "Customer memory stays scoped and does not expose unrelated data."],
          ].map(([title, detail]) => (
            <div key={title} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(131, 24, 67, 0.26))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <h3 style={{
                margin: "0 0 8px",
                color: "#f8fafc",
                fontSize: "15px",
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {detail}
              </p>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only customer memory proof layer. It does not store new memory, expose private data,
          approve, reject, execute, or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#facc15",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Competitor Attack Map v1
            </p>
            <h2 style={{ margin: 0 }}>Competitor Attack Map</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "800px",
              lineHeight: 1.65,
            }}>
              NEXUS tracks competitor categories and answers them with owner control, zero damage discipline,
              audit proof, customer memory, fallback recovery, and no hidden execution.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(250, 204, 21, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#fef9c3",
            background: "rgba(113, 63, 18, 0.24)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Category war-room
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["CRM Suites", "Record-heavy systems can miss risky action control.", "Owner Approval + Audit Proof"],
            ["ERP Suites", "Operational modules can become complex and slow.", "Zero Damage + Business Rules"],
            ["Work OS", "Task workflows do not guarantee safe business decisions.", "Decision Gate + Evidence Trail"],
            ["AI Agent Builders", "Agents can act fast without enough business protection.", "No Hidden Execution"],
            ["Helpdesk AI", "Support automation can overpromise refunds, discounts, or delivery.", "Risk Detector + Owner Gate"],
            ["Automation Tools", "Workflows execute steps but may not understand damage risk.", "Safety Layer + Fallback Recovery"],
            ["Ecommerce Support Apps", "Store support can handle tickets but not full owner-safe command control.", "Customer Memory + Revenue Lock"],
          ].map(([category, weakness, weapon]) => (
            <div key={category} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(113, 63, 18, 0.24))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#fde68a",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {category}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {weakness}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                NEXUS Counter-Weapon: {weapon}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only competitor attack map. It does not call external services, approve, reject,
          execute, change payment state, or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#fb7185",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Competitor Weakness Matrix v1
            </p>
            <h2 style={{ margin: 0 }}>Competitor Weakness Matrix</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "800px",
              lineHeight: 1.65,
            }}>
              NEXUS attacks the market from the damage-control angle: competitors may move fast,
              automate tasks, or manage records, but NEXUS protects the owner before risky action.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(251, 113, 133, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ffe4e6",
            background: "rgba(127, 29, 29, 0.24)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Weaknesses exposed
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Speed Without Safety", "Fast AI can damage price, refund, delivery, stock, or trust.", "Risk First"],
            ["Automation Without Owner Gate", "Workflows can execute before owner review.", "Owner Controlled"],
            ["CRM Without Damage Control", "Customer records do not stop unsafe business actions.", "Zero Damage"],
            ["ERP Complexity", "Large systems slow down small business owners.", "Simple Command Control"],
            ["Agent Risk", "Autonomous agents can act without full business context.", "No Hidden Execution"],
            ["Support AI Overpromise", "Support bots may promise refunds, discounts, or delivery incorrectly.", "Approval Locked"],
            ["No Recovery Discipline", "Many tools fail without a clear fallback route.", "Fallback Ready"],
          ].map(([weakness, danger, answer]) => (
            <div key={weakness} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(127, 29, 29, 0.24))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#fecdd3",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {weakness}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {danger}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                NEXUS Answer: {answer}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only competitor weakness matrix. It does not call external services, approve, reject,
          execute, change payment state, or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              NEXUS Moat Dashboard v1
            </p>
            <h2 style={{ margin: 0 }}>NEXUS Moat Dashboard</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS does not compete as a generic CRM, ERP, chatbot, or workflow tool.
              Its moat is business safety: owner control, audit proof, controlled memory,
              fallback recovery, subscription protection, and zero damage discipline.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(56, 189, 248, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#e0f2fe",
            background: "rgba(12, 74, 110, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Moat locked
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Safety Moat", "Risk is detected before business damage happens.", "Zero Damage"],
            ["Owner Control Moat", "High-impact decisions stay under owner approval.", "Owner Gate"],
            ["Audit Proof Moat", "Every risky route stays traceable and reviewable.", "Evidence Locked"],
            ["Customer Memory Moat", "Context improves replies without leaking unrelated data.", "Scoped Memory"],
            ["Fallback Recovery Moat", "Business continuity stays protected if AI or route fails.", "Zero Stop"],
            ["Subscription Lock Moat", "Access control protects SaaS revenue discipline.", "Revenue Protected"],
            ["Category Creation Moat", "NEXUS builds a safety-first AI Business Operating System category.", "Not a Clone"],
          ].map(([moat, proof, lock]) => (
            <div key={moat} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(12, 74, 110, 0.26))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bae6fd",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {moat}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {proof}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only moat dashboard. It does not call external services, approve, reject,
          execute, change payment state, or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              MVP Launch Readiness Panel v1
            </p>
            <h2 style={{ margin: 0 }}>MVP Launch Readiness</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS is checked against launch-critical proof points before demo release:
              story clarity, owner control, risk protection, audit proof, memory, fallback,
              competitor moat, and revenue lock visibility.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(167, 139, 250, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ede9fe",
            background: "rgba(76, 29, 149, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Launch proof mode
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Demo Story Ready", "Customer request, AI draft, risk check, owner gate, audit, memory, fallback, and lock are visible.", "Story Clear"],
            ["Owner Control Visible", "The owner can see that risky business movement does not happen secretly.", "Control Clear"],
            ["Risk Protection Visible", "Pricing, stock, payment, delivery, return, and trust risk stay visible before action.", "Risk Clear"],
            ["Audit Proof Visible", "Every important decision has evidence and traceability for review.", "Proof Clear"],
            ["Customer Memory Visible", "Customer context improves future replies without leaking unrelated data.", "Memory Clear"],
            ["Fallback Recovery Visible", "Recovery path remains ready so business does not stop if AI or route fails.", "Recovery Clear"],
            ["Competitor Moat Visible", "NEXUS shows why it is not a CRM, ERP, chatbot, or automation clone.", "Moat Clear"],
            ["Revenue Lock Visible", "Subscription and access-control discipline protect the SaaS business model.", "Revenue Clear"],
          ].map(([readiness, proof, status]) => (
            <div key={readiness} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(76, 29, 149, 0.26))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#ddd6fe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {readiness}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {proof}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Status: {status}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only MVP launch readiness panel. It does not call external services, approve, reject,
          execute, change payment state, or modify risky route behavior.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#22d3ee",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Demo Script Control Panel v1
            </p>
            <h2 style={{ margin: 0 }}>Demo Script Control Panel</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS demo must show one clean business story: customer request enters,
              AI prepares a safe draft, risk is detected, owner approval protects the business,
              audit proof is saved, memory improves context, fallback stays ready, and the owner sees control.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(34, 211, 238, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#cffafe",
            background: "rgba(8, 145, 178, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Recording ready
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Opening Hook", "Show NEXUS as a safety-first AI Business Operating System, not a chatbot.", "Start Strong"],
            ["Customer Request Scene", "A real customer request enters the business control room.", "Request Visible"],
            ["AI Draft Scene", "AI prepares a response draft without executing risky action.", "Draft Safe"],
            ["Risk Detection Scene", "Pricing, payment, stock, delivery, return, and trust risk are checked.", "Risk Visible"],
            ["Owner Approval Scene", "Owner sees the decision before anything risky moves forward.", "Owner Gate"],
            ["Audit Proof Scene", "Decision evidence stays traceable for review and recovery.", "Proof Saved"],
            ["Customer Memory Scene", "Useful customer context stays available without memory leak.", "Memory Scoped"],
            ["Fallback Recovery Scene", "If AI or route fails, recovery path protects business continuity.", "Zero Stop"],
            ["Closing CTA", "End with NEXUS protecting revenue, trust, speed, and control.", "Close Premium"],
          ].map(([scene, purpose, status]) => (
            <div key={scene} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(8, 145, 178, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#a5f3fc",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {scene}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Script Step: {status}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          UI-only demo script control panel. It does not call external services, approve, reject,
          execute, change payment state, or modify risky route behavior.
        </p>
      </div>

























      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#2dd4bf",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Context Assembly Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Context Assembly Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory context assembly contract defines how future safe memory context can be
              assembled for AI replies: retrieval validation, scoped memory, matched record ids, retention proof,
              audit proof, and timeline proof. It still reads no real database memory.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(45, 212, 191, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ccfbf1",
            background: "rgba(19, 78, 74, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Context assembly only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Retrieval Validation", "Context assembly requires safe retrieval request validation.", "No invalid retrieval"],
            ["Safe Memory Context", "Only sanitized, scoped, useful memory can enter future reply context.", "No raw sensitive context"],
            ["Matched Records", "Context must link to future memory record ids.", "No untraceable context"],
            ["Scope Proof", "Tenant and customer scope proof remains visible.", "No scope bypass"],
            ["Retention Proof", "Expired memory cannot enter future reply context.", "No expired memory"],
            ["Audit Proof", "Context assembly stays traceable for owner review.", "No hidden memory access"],
            ["Timeline Proof", "Assembly must carry assembledAt timestamp.", "No missing timeline"],
            ["Execution Lock", "Contract never reads real DB memory, writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(19, 78, 74, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#99f6e4",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory context assembly route added at /api/nexus/customer-memory-context-assembly.
          It is read-only and does not read real DB memory, create memory records, write memory, delete memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#0d9488",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Retrieval Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Retrieval Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory retrieval validator checks future retrieval request safety:
              required fields, allowed purpose, tenant boundary, customer boundary, audit event link,
              and timeline proof before any future memory context can be used.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(13, 148, 136, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ccfbf1",
            background: "rgba(19, 78, 74, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Retrieval validation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Required Fields", "Future retrieval request must include every locked request field.", "No incomplete request"],
            ["Allowed Purpose", "Retrieval must serve reply, support, order, trust, or owner review.", "No random memory read"],
            ["Tenant Boundary", "Retrieval stays inside one business account.", "No business leak"],
            ["Customer Boundary", "Retrieval stays inside one customer scope.", "No customer leak"],
            ["Audit Event Link", "Retrieval request must link to audit trail.", "No invisible access"],
            ["Timeline Proof", "Retrieval request must carry requestedAt timestamp.", "No missing timeline"],
            ["Real Read Lock", "Validator does not read real DB memory.", "No DB read now"],
            ["Execution Lock", "Validator never writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(19, 78, 74, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#99f6e4",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory retrieval validator route added at /api/nexus/customer-memory-retrieval-validator.
          It is read-only and does not read real DB memory, create memory records, write memory, delete memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#14b8a6",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Retrieval Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Retrieval Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory retrieval contract defines how future safe memory context can be requested:
              tenant boundary, customer boundary, retrieval purpose, audit event link, timeline proof,
              scoped output, retention proof, and audit visibility.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(20, 184, 166, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ccfbf1",
            background: "rgba(19, 78, 74, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Retrieval contract only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Tenant Boundary", "Future retrieval must stay inside one business account.", "No business leak"],
            ["Customer Boundary", "Future retrieval must stay inside one customer scope.", "No customer leak"],
            ["Retrieval Purpose", "Memory context requires business-safe purpose.", "No random memory read"],
            ["Audit Event Link", "Retrieval request must link to audit trail.", "No invisible access"],
            ["Safe Memory Context", "Only sanitized, scoped, retention-valid memory can appear.", "No raw sensitive output"],
            ["Matched Records", "Every context item must be traceable to memory records.", "No untraceable context"],
            ["Retention Proof", "Expired memory must not appear in future context.", "No expired memory use"],
            ["Execution Lock", "Contract never reads real DB memory, writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([field, purpose, lock]) => (
            <div key={field} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(19, 78, 74, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#99f6e4",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {field}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory retrieval contract route added at /api/nexus/customer-memory-retrieval-contract.
          It is read-only and does not read real DB memory, create memory records, write memory, delete memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#0891b2",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Storage Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Storage Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory storage validator checks future storage record safety:
              required fields, tenant boundary, customer boundary, sanitized memory, retention,
              audit proof, review queue link, eligibility status, and timeline proof.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(8, 145, 178, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#cffafe",
            background: "rgba(8, 145, 178, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Storage validation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Required Fields", "Future memory record must include every storage field.", "No incomplete record"],
            ["Tenant Boundary", "Memory record stays inside one business account.", "No business leak"],
            ["Customer Boundary", "Memory record stays inside one customer scope.", "No customer leak"],
            ["Sanitized Memory", "Record must not contain raw sensitive signals.", "No raw sensitive memory"],
            ["Retention Proof", "Record must carry visible expiry discipline.", "No forever memory"],
            ["Audit Proof", "Record must link to source audit event.", "No missing origin"],
            ["Review Queue Link", "Record must link to review queue item.", "No silent creation"],
            ["Eligibility Status", "Record must carry allowed write eligibility status.", "No unsafe write"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(8, 145, 178, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#a5f3fc",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory storage validator route added at /api/nexus/customer-memory-storage-validator.
          It is read-only and does not create memory records, write memory, delete memory, approve, reject,
          send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#06b6d4",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Storage Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Storage Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory storage contract defines the future safe memory record shape:
              tenant boundary, customer boundary, sanitized memory, category, retention, source audit proof,
              review queue link, review decision, audit link status, write eligibility status, and timeline.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(6, 182, 212, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#cffafe",
            background: "rgba(8, 145, 178, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Storage contract only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Memory Record ID", "Unique id for every future memory record.", "No invisible record"],
            ["Tenant Boundary", "Memory stays inside one business account.", "No business leak"],
            ["Customer Boundary", "Memory stays inside one customer scope.", "No customer leak"],
            ["Sanitized Memory", "Only sanitized business memory can be stored in future.", "No raw sensitive memory"],
            ["Retention Until", "Every memory record carries expiry discipline.", "No forever memory"],
            ["Source Audit Proof", "Memory links back to original audit event.", "No missing origin"],
            ["Review Queue Link", "Memory links back to queue candidate.", "No silent creation"],
            ["Write Eligibility Status", "Final eligibility status remains visible.", "No unsafe write"],
          ].map(([field, purpose, lock]) => (
            <div key={field} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(8, 145, 178, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#a5f3fc",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {field}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory storage contract route added at /api/nexus/customer-memory-storage-contract.
          It is read-only and does not create memory records, write memory, delete memory, approve, reject,
          send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#22d3ee",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Final Write Eligibility Gate v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Final Write Eligibility Gate</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS final memory write eligibility gate combines write gate proof, review queue validation,
              decision validation, and audit-link validation before any future customer memory storage can exist.
              This route still writes nothing.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(34, 211, 238, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#cffafe",
            background: "rgba(8, 145, 178, 0.22)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Final eligibility only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Write Gate Proof", "Candidate must pass scope, sanitization, retention, and usefulness preview.", "No unsafe candidate"],
            ["Queue Validation", "Review queue item shape must be valid.", "No broken queue"],
            ["Decision Validation", "Review decision must be valid and policy-aligned.", "No invalid decision"],
            ["Audit Link Validation", "Decision must link to source audit event and queue candidate.", "No missing proof"],
            ["Owner Safe Boundary", "Future memory write still requires owner-safe flow.", "No silent write"],
            ["Execution Lock", "Gate never creates, writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(8, 145, 178, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#a5f3fc",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory final write eligibility route added at /api/nexus/customer-memory-final-write-eligibility.
          It is read-only and does not create audit links, create queue items, write memory, delete memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#3b82f6",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Review Audit Link Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Review Audit Link Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory review audit link validator checks future audit-link safety:
              required fields, source audit proof, queue candidate, tenant/customer boundary,
              decision validator result, reviewer trace, and timeline proof.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(59, 130, 246, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#dbeafe",
            background: "rgba(30, 64, 175, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Audit link validation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Required Fields", "Future audit link must include every locked contract field.", "No incomplete link"],
            ["Source Audit Proof", "Decision must link back to original audit event.", "No missing origin"],
            ["Queue Candidate", "Decision must link to review queue candidate.", "No orphan decision"],
            ["Tenant Customer Boundary", "Audit link stays inside correct tenant and customer.", "No cross-scope link"],
            ["Decision Validator Result", "Validator result must remain visible.", "No validation bypass"],
            ["Reviewer Trace", "Reviewer identity or system trace must remain visible.", "No invisible reviewer"],
            ["Timeline Proof", "Linked timestamp supports investigation and recovery.", "No missing timeline"],
            ["Execution Lock", "Validator never creates, writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bfdbfe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory review audit link validator route added at /api/nexus/customer-memory-review-audit-link-validator.
          It is read-only and does not create audit links, create queue items, write memory, delete memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#60a5fa",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Review Audit Link Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Review Audit Link Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory review audit link contract connects every future memory review decision
              back to source audit proof, queue candidate, tenant scope, customer scope, validator result,
              reviewer trace, and timeline before any future memory write can exist.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(96, 165, 250, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#dbeafe",
            background: "rgba(30, 64, 175, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Audit link contract only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Source Audit Event", "Decision links back to original audit event.", "No missing origin proof"],
            ["Queue Item", "Decision links to memory review queue candidate.", "No orphan decision"],
            ["Tenant Scope", "Audit link stays inside correct business account.", "No cross-business link"],
            ["Customer Scope", "Audit link stays inside correct customer boundary.", "No cross-customer link"],
            ["Decision Value", "Review decision must match locked policy values.", "No unknown decision"],
            ["Validator Result", "Decision validator result stays visible.", "No validation bypass"],
            ["Reviewer Trace", "Reviewer identity or system trace stays visible.", "No invisible reviewer"],
            ["Timeline Proof", "Link timestamp supports investigation and recovery.", "No missing timeline"],
          ].map(([field, purpose, lock]) => (
            <div key={field} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bfdbfe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {field}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory review audit link route added at /api/nexus/customer-memory-review-audit-link.
          It is read-only and does not create audit links, create queue items, write memory, delete memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Review Decision Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Review Decision Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory review decision validator checks future decision safety:
              allowed decision, future-write eligibility proof, blocked decision discipline, reviewer trace,
              and timestamp proof — without executing any write.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(29, 78, 216, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#dbeafe",
            background: "rgba(30, 64, 175, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Decision validation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Allowed Decision", "Decision must match locked policy values.", "No unknown decision"],
            ["Write Eligibility Proof", "Future-write eligible needs scope, sanitization, retention, and usefulness proof.", "No unsafe write"],
            ["Blocked Decision", "Blocked decisions stay blocked and never trigger writes.", "No blocked execution"],
            ["Reviewer Trace", "Decision preview must carry reviewer trace.", "No invisible reviewer"],
            ["Timeline Proof", "Decision preview must carry createdAt timestamp.", "No missing timeline"],
            ["Execution Lock", "Validator never creates, writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bfdbfe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory review decision validator route added at /api/nexus/customer-memory-review-decision-validator.
          It is read-only and does not create queue items, write memory, delete memory, approve, reject,
          send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Review Decision Policy v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Review Decision Policy</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory review decision policy defines future review outcomes:
              pending review, future-write eligible, blocked sensitive, blocked not useful,
              blocked scope mismatch, and expired before review — without executing any write.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(37, 99, 235, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#dbeafe",
            background: "rgba(30, 64, 175, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Decision policy only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Pending Review", "Memory candidate waits for owner-safe review.", "No silent write"],
            ["Future Write Eligible", "Candidate passed checks but still writes nothing now.", "No write now"],
            ["Blocked Sensitive", "Sensitive or unsafe information blocks memory candidate.", "No sensitive memory"],
            ["Blocked Not Useful", "Non-useful context does not become business memory.", "No random memory"],
            ["Blocked Scope Mismatch", "Tenant or customer mismatch blocks the candidate.", "No cross-scope memory"],
            ["Expired Before Review", "Stale candidate is blocked before future write.", "No stale memory"],
          ].map(([decision, meaning, lock]) => (
            <div key={decision} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bfdbfe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {decision}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {meaning}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory review decision route added at /api/nexus/customer-memory-review-decision.
          It is read-only and does not create queue items, write memory, delete memory, approve, reject,
          send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#0284c7",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Review Queue Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Review Queue Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory review queue validator checks future queue item shape before any memory
              is written: required fields, sanitized candidate, scope proof, sanitization proof, and valid owner review status.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(2, 132, 199, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#e0f2fe",
            background: "rgba(7, 89, 133, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Queue validation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Required Fields", "Future queue item must include every contract field.", "No incomplete item"],
            ["Sanitized Candidate", "Queue item must not contain raw sensitive memory.", "No raw secret queue"],
            ["Scope Proof", "Tenant and customer scope proof must remain visible.", "No scope bypass"],
            ["Sanitization Proof", "Sensitive signal handling proof must remain visible.", "No hidden sensitive data"],
            ["Review Status", "Queue item must carry valid owner review status.", "No silent memory write"],
            ["Execution Lock", "Validator never creates, writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(7, 89, 133, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bae6fd",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory review queue validator route added at /api/nexus/customer-memory-review-queue-validator.
          It is read-only and does not create queue items, write memory, delete memory, approve, reject,
          send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#0ea5e9",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Review Queue Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Review Queue Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS customer memory review queue contract defines the future safe queue item shape before
              any memory is written: tenant, customer, sanitized candidate, category, retention, source audit,
              scope proof, sanitization proof, owner review status, and timeline.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(14, 165, 233, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#e0f2fe",
            background: "rgba(12, 74, 110, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Queue contract only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Queue Item ID", "Unique id for every future memory review candidate.", "No invisible candidate"],
            ["Tenant Boundary", "Memory review must stay inside one business account.", "No business leak"],
            ["Customer Boundary", "Memory review must stay inside one customer scope.", "No customer leak"],
            ["Sanitized Candidate", "Only sanitized memory candidate can enter future review.", "No raw secret review"],
            ["Retention Window", "Every candidate carries expiry and review discipline.", "No forever memory"],
            ["Source Audit Event", "Memory candidate links back to original audit proof.", "No missing origin"],
            ["Scope Proof", "Tenant and customer scope result remains visible.", "No scope bypass"],
            ["Owner Review Status", "Future write requires explicit review status.", "No silent memory write"],
          ].map(([field, purpose, lock]) => (
            <div key={field} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(12, 74, 110, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bae6fd",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {field}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory review queue route added at /api/nexus/customer-memory-review-queue.
          It is read-only and does not create queue items, write memory, delete memory, approve, reject,
          send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#38bdf8",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Write Gate v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Write Gate</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend customer memory write gate previews whether future memory is eligible for storage:
              scope-safe, sanitized, retention-safe, business-useful, and owner-safe. This route still writes nothing.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(56, 189, 248, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#e0f2fe",
            background: "rgba(7, 89, 133, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Write gate preview only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Scope Validation", "Memory must match tenant and customer boundary.", "No cross-scope write"],
            ["Sanitization Check", "Sensitive signals must be removed or blocked first.", "No secret write"],
            ["Retention Check", "Memory category must follow retention discipline.", "No forever memory"],
            ["Business Usefulness", "Memory must help support, order, delivery, complaint, or trust continuity.", "No random memory"],
            ["Future Eligibility", "Gate can mark future write eligibility without writing anything.", "No write now"],
            ["Execution Lock", "Gate never writes, deletes, sends, pays, approves, rejects, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(7, 89, 133, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bae6fd",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory write gate route added at /api/nexus/customer-memory-write-gate.
          It is read-only and does not write memory, delete memory, approve, reject, send messages,
          write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#84cc16",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Retention Policy v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Retention Policy</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend customer memory retention policy defines how long future memory should remain useful
              before review, expiry, or blocking — without writing, deleting, or executing anything.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(132, 204, 22, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ecfccb",
            background: "rgba(63, 98, 18, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Retention preview only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Business Preference", "Useful preference stays reviewable for 180 days.", "No stale preference forever"],
            ["Support Context", "Complaint or replacement context stays reviewable for 90 days.", "No old complaint confusion"],
            ["Order Context", "Order and delivery context stays reviewable for 120 days.", "No outdated order context"],
            ["Trust Context", "Angry or waiting state stays reviewable for 60 days.", "No permanent negative label"],
            ["Sensitive Context", "OTP, password, card, CVV, and UPI PIN retain for 0 days.", "No sensitive memory"],
            ["Retention Lock", "Policy never writes, deletes, sends, pays, approves, or executes.", "Safe route only"],
          ].map(([rule, purpose, lock]) => (
            <div key={rule} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(63, 98, 18, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#d9f99d",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {rule}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory retention route added at /api/nexus/customer-memory-retention.
          It is read-only and does not write memory, delete memory, approve, reject, send messages,
          write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#22c55e",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Sanitizer v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Sanitizer</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend customer memory sanitizer previews how sensitive details are removed before future
              memory review, while preserving safe business context like delivery, order, complaint, and follow-up needs.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(34, 197, 94, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#dcfce7",
            background: "rgba(20, 83, 45, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Sanitization preview only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Email Redaction", "Full email addresses are removed from memory preview.", "Email protected"],
            ["Phone Redaction", "Full phone numbers are removed from memory preview.", "Phone protected"],
            ["OTP Block", "OTP values are blocked from memory storage.", "OTP protected"],
            ["Password Block", "Passwords and secrets are blocked from memory storage.", "Secret protected"],
            ["Payment Secret Block", "UPI PIN, CVV, card, and bank secrets are blocked.", "Money protected"],
            ["Business Context Preserve", "Safe delivery, order, complaint, and follow-up context stays visible.", "Context preserved"],
          ].map(([rule, purpose, lock]) => (
            <div key={rule} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(20, 83, 45, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bbf7d0",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {rule}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory sanitizer route added at /api/nexus/customer-memory-sanitizer. It is read-only and does not write memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#14b8a6",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Scope Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Scope Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend customer memory scope validator checks that future memory stays inside the correct
              business and customer boundary before any memory storage exists.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(20, 184, 166, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ccfbf1",
            background: "rgba(19, 78, 74, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Scope validation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Tenant Scope Check", "Memory must belong to one business account only.", "No business leak"],
            ["Customer Scope Check", "One customer context must not leak into another customer reply.", "No customer leak"],
            ["Allowed Context Check", "Memory stays limited to business preference, support, order, or trust context.", "No unrelated memory"],
            ["Blocked Signal Check", "Secrets, OTPs, payment credentials, and passwords are blocked.", "No unsafe storage"],
            ["Scope Preview", "Route validates memory scope without writing anything.", "No memory write"],
            ["Execution Lock", "Validator never approves, rejects, pays, sends, writes, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(19, 78, 74, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#99f6e4",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory scope route added at /api/nexus/customer-memory-scope. It is read-only and does not write memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#2dd4bf",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Customer Memory Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Customer Memory Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend customer memory contract defines what future memory can safely remember:
              business preferences, support context, order context, and trust context — while blocking
              payment secrets, unrelated personal data, cross-tenant leakage, and unsafe profile storage.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(45, 212, 191, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ccfbf1",
            background: "rgba(15, 118, 110, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Memory contract only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Business Preference", "Preferred category, delivery preference, or buying pattern.", "Allowed context"],
            ["Support Context", "Open issue, complaint status, or replacement follow-up.", "Allowed context"],
            ["Order Context", "Requested product type, quantity interest, and delivery expectation.", "Allowed context"],
            ["Trust Context", "Angry, confused, waiting, or careful-handling customer state.", "Allowed context"],
            ["Payment Secrets", "Passwords, OTPs, UPI PIN, card data, and credentials are blocked.", "Blocked memory"],
            ["Cross-Tenant Leak", "One business memory must never leak into another business.", "Blocked memory"],
          ].map(([memory, meaning, lock]) => (
            <div key={memory} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(15, 118, 110, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#99f6e4",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {memory}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {meaning}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend customer memory route added at /api/nexus/customer-memory. It is read-only and does not write memory,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#f472b6",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Audit Redaction Policy v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Audit Redaction Policy</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend audit redaction policy protects future audit views from exposing sensitive
              customer details while keeping risk, owner decision, guardrail proof, and recovery context visible.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(244, 114, 182, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#fce7f3",
            background: "rgba(131, 24, 67, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Redaction preview only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Phone Redaction", "Future audit views should not expose full phone numbers unnecessarily.", "Phone protected"],
            ["Email Redaction", "Future audit views should not expose full email addresses unnecessarily.", "Email protected"],
            ["Payment Redaction", "Future audit views protect payment references and money-sensitive values.", "Money protected"],
            ["Address Redaction", "Future audit views avoid exposing full delivery address details.", "Location protected"],
            ["Tenant Scope", "Redaction must never mix audit context across businesses.", "Tenant boundary"],
            ["Decision Proof", "Redaction protects sensitive data without hiding owner decision proof.", "Proof preserved"],
          ].map(([rule, purpose, lock]) => (
            <div key={rule} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(131, 24, 67, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#fbcfe8",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {rule}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend audit redaction route added at /api/nexus/audit-redaction. It is read-only and does not create records,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Audit Event Validator v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Audit Event Validator</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend audit validator checks future audit event shape before storage exists:
              required fields, tenant boundary, owner decision proof, and guardrail trace visibility.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(167, 139, 250, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ede9fe",
            background: "rgba(76, 29, 149, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Validation preview only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Required Field Check", "Future audit event must include every required contract field.", "No incomplete event"],
            ["Tenant Boundary Check", "Audit event must belong to one business account.", "No cross-tenant confusion"],
            ["Owner Decision Check", "Risky event must carry owner decision proof before execution.", "No owner bypass"],
            ["Guardrail Trace Check", "Safety result must stay visible for review.", "No silent safety failure"],
            ["Validation Preview", "Route validates event shape without saving anything.", "No data write"],
            ["Execution Lock", "Validator never approves, rejects, pays, sends, writes, or executes.", "Safe route only"],
          ].map(([check, purpose, lock]) => (
            <div key={check} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(76, 29, 149, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#ddd6fe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {check}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend audit validator route added at /api/nexus/audit-validator. It is read-only and does not create records,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#c084fc",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Audit Event Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Audit Event Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend audit contract defines the future proof structure for every important decision:
              event id, tenant boundary, original customer request, AI draft, risk level, owner decision,
              guardrail result, and timestamp.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(192, 132, 252, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#f3e8ff",
            background: "rgba(88, 28, 135, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Audit contract only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Event ID", "Unique trace id for every future audit event.", "No invisible decision"],
            ["Tenant ID", "Business account boundary for multi-tenant safety.", "No cross-business mix"],
            ["Customer Request", "Original customer input stays traceable.", "No missing source"],
            ["AI Draft", "AI suggestion remains visible before owner decision.", "No hidden output"],
            ["Risk Level", "Risk classification is linked to the event.", "No unclassified movement"],
            ["Owner Decision", "Owner decision is required before risky execution.", "No owner bypass"],
            ["Guardrail Result", "Safety result remains reviewable.", "No silent safety failure"],
            ["Created At", "Timestamp supports future investigation and recovery.", "No missing timeline"],
          ].map(([field, purpose, lock]) => (
            <div key={field} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(88, 28, 135, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#e9d5ff",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {field}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend audit contract route added at /api/nexus/audit. It is read-only and does not create records,
          approve, reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#60a5fa",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Owner Approval Policy v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Owner Approval Policy</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend owner approval policy decides when risk must be held for owner review:
              high-risk and medium-risk contexts stay behind the owner gate, while low-risk context
              remains read-only until production execution is built.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(96, 165, 250, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#dbeafe",
            background: "rgba(30, 64, 175, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Policy evaluation only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["High Risk", "Owner approval required before any risky movement.", "Queue for owner review"],
            ["Medium Risk", "Owner review required before execution.", "Review before execution"],
            ["Low Risk", "Allowed only as read-only review until execution layer exists.", "Read-only review"],
            ["Unknown Risk", "Unknown risk level is blocked by default.", "Owner review required"],
            ["Owner Gate", "No risky action moves without owner visibility.", "No hidden execution"],
            ["Execution Lock", "Policy never approves, rejects, sends, pays, writes, or executes.", "Safe route only"],
          ].map(([policy, meaning, action]) => (
            <div key={policy} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#bfdbfe",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {policy}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {meaning}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Action: {action}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend owner policy route added at /api/nexus/owner-policy. It is read-only and does not approve,
          reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#f97316",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Risk Classifier v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Risk Classifier</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend risk classifier safely identifies pricing, payment, stock, delivery,
              return damage, and customer trust risks before any business action moves forward.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(249, 115, 22, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ffedd5",
            background: "rgba(124, 45, 18, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Classification only
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Pricing Risk", "Rate, discount, margin, or quote issue detected.", "Owner approval"],
            ["Payment Risk", "Payment, refund, invoice, charge, or billing issue detected.", "Money protected"],
            ["Stock Risk", "Stock, availability, shortage, or inventory issue detected.", "Supply protected"],
            ["Delivery Risk", "Dispatch, delay, shipping, or urgent delivery issue detected.", "Promise protected"],
            ["Return Damage Risk", "Return, replacement, damage, broken item, or complaint detected.", "Loss protected"],
            ["Customer Trust Risk", "Angry customer, fraud, legal, or trust risk detected.", "Brand protected"],
          ].map(([risk, signal, lock]) => (
            <div key={risk} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(124, 45, 18, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#fed7aa",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {risk}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {signal}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend risk route added at /api/nexus/risk. It is read-only and does not approve,
          reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#fb7185",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Guardrail Registry v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Guardrail Registry</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend guardrail registry defines what must be blocked before risky execution:
              unsafe actions, owner bypass, payment movement, customer message sending, data writes,
              memory leaks, provider failure, and missing audit proof.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(251, 113, 133, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#ffe4e6",
            background: "rgba(136, 19, 55, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Guardrails live
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Risky Action Blocklist", "Blocks unsafe business movement before execution.", "Zero Damage"],
            ["Owner Approval Requirement", "Keeps risky movement behind owner approval.", "Owner Control"],
            ["Payment State Lock", "Prevents unsafe billing, refund, or charge changes.", "Revenue Discipline"],
            ["Message Send Lock", "Prevents unsafe customer message dispatch.", "Customer Trust"],
            ["Data Write Lock", "Prevents read-only routes from writing business data.", "Data Integrity"],
            ["Memory Scope Lock", "Prevents unrelated memory from leaking into replies.", "Memory Safety"],
            ["Provider Failure Lock", "Keeps fallback recovery ready if AI or provider fails.", "Zero Stop"],
            ["Audit Trace Requirement", "Requires evidence for important AI decisions.", "Audit Proof"],
          ].map(([guardrail, purpose, protects]) => (
            <div key={guardrail} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(136, 19, 55, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#fecdd3",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {guardrail}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Protects: {protects}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend guardrail route added at /api/nexus/guardrails. It is read-only and does not approve,
          reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#facc15",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Safety Contract v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Safety Contract</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend safety contract defines the non-negotiable rules before real execution:
              owner approval, zero damage, audit proof, scoped memory, fallback recovery,
              and subscription discipline.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(250, 204, 21, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#fef9c3",
            background: "rgba(113, 63, 18, 0.26)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Safety contract live
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Owner Approval Required", "Risky business movement waits for owner approval.", "No hidden execution"],
            ["Zero Damage", "Pricing, payment, stock, delivery, return, and trust stay protected.", "No unsafe automation"],
            ["Audit Proof", "Important AI decisions remain traceable.", "No silent decision path"],
            ["Scoped Customer Memory", "Useful context improves replies without exposing unrelated data.", "No memory leak"],
            ["Fallback Recovery", "Business continuity stays protected if AI or provider fails.", "No business stop"],
            ["Subscription Discipline", "SaaS access respects plan and payment state before production execution.", "No revenue leak"],
          ].map(([rule, meaning, block]) => (
            <div key={rule} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(113, 63, 18, 0.24))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#fde68a",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {rule}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {meaning}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Block: {block}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend safety contract route added at /api/nexus/safety. It is read-only and does not approve,
          reject, send messages, write customer data, change payment state, or execute risky actions.
        </p>
      </div>
      <div style={cardStyle}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "14px",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              color: "#34d399",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}>
              Backend Foundation Map v1
            </p>
            <h2 style={{ margin: 0 }}>Backend Foundation Map</h2>
            <p style={{
              margin: "10px 0 0",
              color: "#cbd5e1",
              maxWidth: "820px",
              lineHeight: 1.65,
            }}>
              NEXUS backend foundation now has a safe status route and locked foundation map:
              tenant isolation, owner control, audit proof, scoped customer memory, fallback recovery,
              and subscription discipline.
            </p>
          </div>

          <div style={{
            border: "1px solid rgba(52, 211, 153, 0.38)",
            borderRadius: "999px",
            padding: "10px 14px",
            color: "#d1fae5",
            background: "rgba(6, 95, 70, 0.24)",
            fontWeight: 900,
            fontSize: "13px",
            whiteSpace: "nowrap",
          }}>
            Backend foundation live
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {[
            ["Tenant Core", "Future businesses stay separated before production data.", "No cross-data mix"],
            ["Owner Control Core", "Risky business movement waits for owner approval.", "No hidden execution"],
            ["Audit Core", "Important AI decisions remain traceable.", "Audit proof required"],
            ["Customer Memory Core", "Useful context improves replies without leaking unrelated data.", "No memory leak"],
            ["Fallback Core", "Business continues if AI, route, or provider fails.", "Zero Stop"],
            ["Subscription Core", "SaaS access stays controlled by plan and payment state.", "Revenue protected"],
          ].map(([layer, purpose, lock]) => (
            <div key={layer} style={{
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: "16px",
              padding: "14px",
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(6, 95, 70, 0.22))",
              boxShadow: "0 14px 32px rgba(2, 6, 23, 0.2)",
            }}>
              <p style={{
                margin: "0 0 8px",
                color: "#a7f3d0",
                fontSize: "12px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                {layer}
              </p>
              <p style={{
                margin: "0 0 10px",
                color: "#cbd5e1",
                lineHeight: 1.55,
                fontSize: "13px",
              }}>
                {purpose}
              </p>
              <div style={{
                border: "1px solid rgba(34, 197, 94, 0.28)",
                borderRadius: "999px",
                padding: "8px 10px",
                color: "#bbf7d0",
                background: "rgba(20, 83, 45, 0.22)",
                fontSize: "12px",
                fontWeight: 900,
              }}>
                Lock: {lock}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          margin: "14px 0 0",
          color: "#cbd5e1",
          fontSize: "12px",
          lineHeight: 1.6,
        }}>
          Backend foundation route added at /api/nexus/status. It does not approve, reject,
          send messages, change payment state, or execute risky business actions.
        </p>
      </div>
    </>
  );
}
