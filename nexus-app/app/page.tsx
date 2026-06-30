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

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleKey>(null);

  const selectedModule = modules.find((module) => module.key === activeModule);

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

  if (selectedModule) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #020617, #0f172a)",
          color: "white",
          padding: "50px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <button
          onClick={() => setActiveModule(null)}
          style={{
            marginBottom: "35px",
            padding: "12px 24px",
            background: "#1e293b",
            color: "white",
            border: "1px solid #334155",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>

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
            maxWidth: "700px",
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
            maxWidth: "800px",
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
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #020617, #0f172a)",
        color: "white",
        padding: "50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
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

      <p
        style={{
          color: "#94a3b8",
          fontSize: "18px",
          marginBottom: "40px",
        }}
      >
        AI Business Operating System control center
      </p>

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

      <button
        onClick={() => setIsLaunched(false)}
        style={{
          marginTop: "40px",
          padding: "14px 28px",
          background: "#1e293b",
          color: "white",
          border: "1px solid #334155",
          borderRadius: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </main>
  );
}