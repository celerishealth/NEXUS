"use client";

import { useState } from "react";

type ModuleKey = "ai-brain" | "whatsapp-hub" | "crm" | "automation-logs" | null;

const modules = [
  {
    key: "ai-brain" as const,
    title: "AI Brain",
    description: "Central intelligence for business decisions and customer replies.",
    status: "Active Foundation",
    points: [
      "AI reply engine",
      "Business decision support",
      "Customer message understanding",
      "Future: Gemini / OpenAI API connection",
    ],
  },
  {
    key: "whatsapp-hub" as const,
    title: "WhatsApp Hub",
    description: "One control center for customer WhatsApp communication.",
    status: "Coming Next",
    points: [
      "Customer WhatsApp inbox",
      "Auto reply system",
      "Message history",
      "Future: Twilio / Meta API connection",
    ],
  },
  {
    key: "crm" as const,
    title: "CRM",
    description: "Lead, customer, order, and follow-up management system.",
    status: "Coming Next",
    points: [
      "Lead database",
      "Customer profile",
      "Order tracking",
      "Follow-up reminder system",
    ],
  },
  {
    key: "automation-logs" as const,
    title: "Automation Logs",
    description: "Track every action, message, error, and system event.",
    status: "Coming Next",
    points: [
      "System activity logs",
      "Error tracking",
      "Message delivery status",
      "Owner daily report",
    ],
  },
];

const healthItems = [
  { name: "Frontend", value: "Online" },
  { name: "Dashboard", value: "Ready" },
  { name: "AI Brain", value: "Foundation" },
  { name: "GitHub Backup", value: "Safe" },
];

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleKey>(null);

  const selectedModule = modules.find((module) => module.key === activeModule);

  function goHome() {
    setIsLaunched(false);
    setActiveModule(null);
  }

  if (!isLaunched) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at center, #0f172a, #020617)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "64px",
              letterSpacing: "4px",
              textShadow: "0 0 25px #60a5fa",
              marginBottom: "12px",
            }}
          >
            NEXUS
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#cbd5e1",
              marginBottom: "35px",
            }}
          >
            AI Business Operating System
          </p>

          <button
            onClick={() => setIsLaunched(true)}
            style={{
              padding: "15px 40px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(37, 99, 235, 0.8)",
            }}
          >
            Launch NEXUS
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #0f172a)",
        color: "white",
        display: "flex",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "rgba(2, 6, 23, 0.92)",
          borderRight: "1px solid rgba(59, 130, 246, 0.25)",
          padding: "28px 20px",
          boxShadow: "0 0 30px rgba(37, 99, 235, 0.18)",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            letterSpacing: "3px",
            textShadow: "0 0 18px #60a5fa",
            marginBottom: "6px",
          }}
        >
          NEXUS
        </h2>

        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "30px" }}>
          Command Center
        </p>

        <button
          onClick={() => setActiveModule(null)}
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "14px 16px",
            textAlign: "left",
            background: activeModule === null ? "#2563eb" : "#0f172a",
            color: "white",
            border: "1px solid #334155",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Dashboard
        </button>

        {modules.map((module) => (
          <button
            key={module.key}
            onClick={() => setActiveModule(module.key)}
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "14px 16px",
              textAlign: "left",
              background: activeModule === module.key ? "#2563eb" : "#0f172a",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            {module.title}
          </button>
        ))}

        <button
          onClick={goHome}
          style={{
            width: "100%",
            marginTop: "28px",
            padding: "14px 16px",
            textAlign: "left",
            background: "#1e293b",
            color: "white",
            border: "1px solid #334155",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Back to Home
        </button>
      </aside>

      <section style={{ flex: 1, padding: "32px 50px 50px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            borderRadius: "18px",
            padding: "16px 22px",
            marginBottom: "35px",
            boxShadow: "0 0 22px rgba(37, 99, 235, 0.14)",
          }}
        >
          <div>
            <strong style={{ fontSize: "18px" }}>System Health</strong>
            <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: "14px" }}>
              NEXUS local development environment
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(34, 197, 94, 0.15)",
                border: "1px solid rgba(34, 197, 94, 0.45)",
                color: "#bbf7d0",
                padding: "8px 12px",
                borderRadius: "999px",
                fontSize: "13px",
              }}
            >
              Online
            </span>

            <span
              style={{
                background: "rgba(37, 99, 235, 0.18)",
                border: "1px solid rgba(96, 165, 250, 0.45)",
                color: "#bfdbfe",
                padding: "8px 12px",
                borderRadius: "999px",
                fontSize: "13px",
              }}
            >
              Day 2 Build
            </span>
          </div>
        </div>

        {selectedModule ? (
          <>
            <h1
              style={{
                fontSize: "52px",
                marginBottom: "12px",
                textShadow: "0 0 20px #60a5fa",
              }}
            >
              {selectedModule.title}
            </h1>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "20px",
                marginBottom: "25px",
                maxWidth: "760px",
                lineHeight: "1.6",
              }}
            >
              {selectedModule.description}
            </p>

            <div
              style={{
                display: "inline-block",
                background: "rgba(37, 99, 235, 0.18)",
                border: "1px solid rgba(96, 165, 250, 0.45)",
                borderRadius: "999px",
                padding: "10px 18px",
                marginBottom: "35px",
                color: "#bfdbfe",
              }}
            >
              Status: {selectedModule.status}
            </div>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                borderRadius: "18px",
                padding: "30px",
                maxWidth: "850px",
                boxShadow: "0 0 25px rgba(37, 99, 235, 0.20)",
              }}
            >
              <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>
                Module Capabilities
              </h2>

              <ul style={{ color: "#cbd5e1", lineHeight: "2", fontSize: "18px" }}>
                {selectedModule.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <h1
              style={{
                fontSize: "48px",
                marginBottom: "10px",
                letterSpacing: "2px",
                textShadow: "0 0 20px #60a5fa",
              }}
            >
              NEXUS Dashboard
            </h1>

            <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "30px" }}>
              AI Business Operating System control center
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "16px",
                marginBottom: "35px",
              }}
            >
              {healthItems.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: "rgba(15, 23, 42, 0.85)",
                    border: "1px solid rgba(59, 130, 246, 0.30)",
                    borderRadius: "16px",
                    padding: "20px",
                  }}
                >
                  <p style={{ color: "#94a3b8", marginBottom: "8px" }}>
                    {item.name}
                  </p>
                  <h3 style={{ fontSize: "24px" }}>{item.value}</h3>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              {modules.map((module) => (
                <button
                  key={module.key}
                  onClick={() => setActiveModule(module.key)}
                  style={{
                    textAlign: "left",
                    background: "rgba(15, 23, 42, 0.85)",
                    color: "white",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    borderRadius: "18px",
                    padding: "28px",
                    boxShadow: "0 0 25px rgba(37, 99, 235, 0.20)",
                    cursor: "pointer",
                  }}
                >
                  <h2 style={{ fontSize: "24px", marginBottom: "14px" }}>
                    {module.title}
                  </h2>

                  <p style={{ color: "#cbd5e1", lineHeight: "1.6" }}>
                    {module.description}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}