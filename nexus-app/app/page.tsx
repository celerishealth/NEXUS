"use client";

import { useState } from "react";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);

  const cards = [
    {
      title: "AI Brain",
      description: "Central intelligence for business decisions and customer replies.",
    },
    {
      title: "WhatsApp Hub",
      description: "One control center for customer WhatsApp communication.",
    },
    {
      title: "CRM",
      description: "Lead, customer, order, and follow-up management system.",
    },
    {
      title: "Automation Logs",
      description: "Track every action, message, error, and system event.",
    },
  ];

  if (isLaunched) {
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
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                borderRadius: "18px",
                padding: "28px",
                boxShadow: "0 0 25px rgba(37, 99, 235, 0.20)",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "14px",
                }}
              >
                {card.title}
              </h2>

              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.6",
                }}
              >
                {card.description}
              </p>
            </div>
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