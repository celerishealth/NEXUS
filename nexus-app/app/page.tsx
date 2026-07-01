"use client";

import { useState } from "react";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Custom Prompt");
  const [responseHistory, setResponseHistory] = useState<
    { id: number; type: string; input: string; response: string }[]
  >([]);

  const promptTemplates = [
    {
      title: "Customer Reply",
      description: "Create a polite reply for a customer question.",
      prompt:
        "Write a professional customer reply for this customer message. Keep it clear, polite, and helpful:",
    },
    {
      title: "Sales Follow-up",
      description: "Follow up with a potential customer.",
      prompt:
        "Write a short and professional sales follow-up message for this customer:",
    },
    {
      title: "Order Confirmation",
      description: "Confirm an order with clear details.",
      prompt:
        "Write a professional order confirmation message for this customer:",
    },
    {
      title: "Complaint Reply",
      description: "Handle a customer complaint politely.",
      prompt:
        "Write a calm and professional complaint reply for this customer issue:",
    },
    {
      title: "Business Advice",
      description: "Give simple business advice.",
      prompt:
        "Give practical business advice for this situation. Keep it simple and action-focused:",
    },
  ];

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
    "NEXUS v2 frontend started",
    "Home screen completed",
    "Launch button completed",
    "Dashboard completed",
    "Sidebar completed",
    "AI Brain basic system completed",
    "GitHub backup completed",
    "Production build passed",
    "Day 4 prompt templates added",
  ];

  function useTemplate(templateTitle: string, templatePrompt: string) {
    setSelectedTemplate(templateTitle);
    setAiInput(templatePrompt + "\n\n");
  }

  async function generateResponse() {
    if (!aiInput.trim()) {
      setAiResponse("Please enter a message first.");
      return;
    }

    setAiResponse("NEXUS AI Brain is thinking...");

    try {
      const apiResponse = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `You are NEXUS AI Brain, a professional AI business assistant for distributors, shops, and service businesses.

Your job:
Create a ready-to-send business reply for the selected template.

Rules:
1. Do not say "I do not have access to real-time data".
2. Do not mention website links, placeholders, or customer service numbers unless the user provided them.
3. If price, stock, or delivery time is not provided, politely ask for quantity and location.
4. Keep the reply short, practical, and professional.
5. Write like a real business owner replying to a customer.
6. Use simple English.
7. Do not over-explain.

Selected template: ${selectedTemplate}

Customer/business message:
${aiInput}

Generate only the final reply message.`,
        }),
      });

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        setAiResponse(data?.error || "AI request failed.");
        return;
      }

      const finalResponse = data?.response || "No response generated.";

      setAiResponse(finalResponse);

      setResponseHistory((prev) => [
        {
          id: Date.now(),
          type: selectedTemplate,
          input: aiInput,
          response: finalResponse,
        },
        ...prev,
      ]);
    } catch {
      setAiResponse("Failed to connect with NEXUS AI Brain.");
    }
  }

  function copyResponse() {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
  }

  function clearResponse() {
    setAiInput("");
    setAiResponse("");
    setSelectedTemplate("Custom Prompt");
  }

  if (!isLaunched) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 50%, #111827 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <section
          style={{
            maxWidth: "900px",
            width: "100%",
            border: "1px solid #1d4ed8",
            borderRadius: "24px",
            padding: "48px",
            background: "rgba(15, 23, 42, 0.9)",
            boxShadow: "0 0 40px rgba(37, 99, 235, 0.35)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "56px", marginBottom: "16px" }}>NEXUS</h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "20px",
              lineHeight: "1.6",
              marginBottom: "32px",
            }}
          >
            AI Business Operating System for sales, support, customer replies,
            follow-ups, orders, complaints, and business advice.
          </p>

          <button
            onClick={() => setIsLaunched(true)}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "16px 28px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Launch NEXUS
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        display: "flex",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: "260px",
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>NEXUS</h1>
        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
          AI Business OS
        </p>

        <nav style={{ display: "grid", gap: "14px" }}>
          <button style={sidebarButton}>Dashboard</button>
          <button style={sidebarButton}>AI Brain</button>
          <button style={sidebarButton}>Templates</button>
          <button style={sidebarButton}>Customers</button>
          <button style={sidebarButton}>Orders</button>
          <button style={sidebarButton}>Automation</button>
          <button style={sidebarButton}>Settings</button>
        </nav>
      </aside>

      <section style={{ flex: 1, padding: "32px", overflow: "auto" }}>
        <header style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "36px", marginBottom: "8px" }}>
            NEXUS Dashboard
          </h2>
          <p style={{ color: "#94a3b8" }}>
            Day 4 goal: AI Brain Prompt Templates
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div style={cardStyle}>
            <h3>System Health</h3>
            <p style={{ color: "#22c55e", fontSize: "28px" }}>Online</p>
          </div>

          <div style={cardStyle}>
            <h3>AI Brain</h3>
            <p style={{ color: "#38bdf8", fontSize: "28px" }}>Ready</p>
          </div>

          <div style={cardStyle}>
            <h3>Build Status</h3>
            <p style={{ color: "#a78bfa", fontSize: "28px" }}>Clean</p>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
            AI Brain Prompt Templates
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            {promptTemplates.map((template) => (
              <button
                key={template.title}
                onClick={() => useTemplate(template.title, template.prompt)}
                style={{
                  background:
                    selectedTemplate === template.title ? "#1d4ed8" : "#111827",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
                  {template.title}
                </h3>
                <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
                  {template.description}
                </p>
              </button>
            ))}
          </div>

          <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
            Selected Template: <b>{selectedTemplate}</b>
          </p>

          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Type any business or customer message here..."
            style={{
              width: "100%",
              minHeight: "140px",
              background: "#020617",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "16px",
              fontSize: "15px",
              marginBottom: "16px",
            }}
          />

          <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <button onClick={generateResponse} style={primaryButton}>
              Generate Response
            </button>

            <button onClick={copyResponse} style={secondaryButton}>
              Copy Response
            </button>

            <button onClick={clearResponse} style={dangerButton}>
              Clear Response
            </button>
          </div>

          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              whiteSpace: "pre-wrap",
              color: "#e5e7eb",
              minHeight: "120px",
            }}
          >
            {aiResponse || "NEXUS AI response will appear here."}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "28px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "16px" }}>Recent Activity</h2>
            {recentActivities.map((activity) => (
              <p key={activity} style={{ color: "#cbd5e1" }}>
                ✅ {activity}
              </p>
            ))}
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginBottom: "16px" }}>Build Log</h2>
            {buildLogs.map((log) => (
              <p key={log} style={{ color: "#cbd5e1" }}>
                🧱 {log}
              </p>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: "28px" }}>
          <h2 style={{ marginBottom: "16px" }}>Response History</h2>

          {responseHistory.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No response history yet.</p>
          ) : (
            responseHistory.map((item) => (
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
                <h3 style={{ marginBottom: "8px" }}>{item.type}</h3>
                <p style={{ color: "#94a3b8", marginBottom: "8px" }}>
                  Input: {item.input}
                </p>
                <p style={{ color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
                  {item.response}
                </p>
              </div>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
};

const sidebarButton = {
  background: "#111827",
  color: "white",
  border: "1px solid #334155",
  borderRadius: "12px",
  padding: "14px",
  textAlign: "left" as const,
  cursor: "pointer",
};

const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 20px",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButton = {
  background: "#334155",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 20px",
  cursor: "pointer",
  fontWeight: "bold",
};

const dangerButton = {
  background: "#991b1b",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 20px",
  cursor: "pointer",
  fontWeight: "bold",
};
