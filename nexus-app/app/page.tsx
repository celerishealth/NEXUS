"use client";

import { useState } from "react";

export default function Home() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Custom Prompt");
  const [selectedTemplatePrompt, setSelectedTemplatePrompt] = useState("");
  const [responseHistory, setResponseHistory] = useState<
    { id: number; type: string; input: string; response: string; status: string; riskLevel?: string; riskTags?: string[] }[]
  >([]);

  const [selectedIndustryPack, setSelectedIndustryPack] = useState("Universal Business Pack");
  const [customIndustrySector, setCustomIndustrySector] = useState("");
  const [customOwnerRule, setCustomOwnerRule] = useState("");
  const [approvalQueueFilter, setApprovalQueueFilter] = useState<"All" | "Pending Owner Approval" | "Approved" | "Rejected">("All");
  const [approvalQueueSearch, setApprovalQueueSearch] = useState("");

  const totalRequests = responseHistory.length;
  const pendingRequests = responseHistory.filter(
    (item) => item.status === "Pending Owner Approval"
  );
  const approvedRequests = responseHistory.filter(
    (item) => item.status === "Approved"
  );
  const rejectedRequests = responseHistory.filter(
    (item) => item.status === "Rejected"
  );
  const zeroStuckStatus =
    pendingRequests.length === 0 ? "Smooth" : "Review Needed";
  const industryPacks = [
    {
      title: "Universal Business Pack",
      focus:
        "Default pack for any business sector, from small shop to global enterprise.",
      rules: [
        "Understand customer request before replying.",
        "Ask for missing details instead of guessing.",
        "Keep every output draft-only until owner approval.",
        "Never promise price, stock, delivery, refund, appointment, or final billing without owner review.",
      ],
    },
    {
      title: "Custom Sector Pack",
      focus:
        "Owner-defined sector pack for any industry not listed yet.",
      rules: [
        "Use owner-provided sector name as the business context.",
        "Capture business-specific fields before final action.",
        "Treat unknown sectors safely through Universal Business rules.",
        "No sector is rejected just because it is not prelisted.",
      ],
    },
    {
      title: "Pharma Pack",
      focus:
        "Medicine orders, rate and stock replies, billing safety, dispatch timing, and owner review.",
      rules: [
        "Confirm medicine name, strength, quantity, stock, rate, GST, payment terms, and dispatch timing.",
        "Never promise stock or final billing without owner confirmation.",
        "Keep pharma output draft-only and owner-approved.",
      ],
    },
    {
      title: "Ecommerce Pack",
      focus:
        "Product enquiries, order support, delivery updates, returns, and customer follow-up.",
      rules: [
        "Confirm product, quantity, variant, address, payment status, and delivery expectation.",
        "Do not promise refund, replacement, or delivery date without owner confirmation.",
        "Keep customer support polite, short, and order-focused.",
      ],
    },
    {
      title: "Real Estate Pack",
      focus:
        "Property leads, location, budget, site visit, buyer qualification, and follow-up.",
      rules: [
        "Capture customer name, phone, location, budget, property type, and visit timing.",
        "Do not promise availability, price, or legal status without owner confirmation.",
        "Move every serious lead toward owner-reviewed follow-up.",
      ],
    },
    {
      title: "Service Business Pack",
      focus:
        "Appointments, service enquiries, follow-up, quotation draft, and customer scheduling.",
      rules: [
        "Confirm service type, customer name, location, preferred time, urgency, and contact details.",
        "Do not confirm appointment, price, or technician availability without owner review.",
        "Keep every response practical, safe, and next-action focused.",
      ],
    },
  ];

  const universalSectorCoverage = [
    "Retail",
    "Wholesale",
    "Distribution",
    "Pharma",
    "Healthcare",
    "Clinic",
    "Diagnostic",
    "Ecommerce",
    "Restaurant",
    "Hotel",
    "Real Estate",
    "Education",
    "Manufacturing",
    "Logistics",
    "Finance",
    "Legal",
    "Jewellery",
    "Salon",
    "Travel",
    "Construction",
    "Automobile",
    "Agriculture",
    "Agency",
    "SaaS",
    "Local Shop",
    "Enterprise",
    "Any Custom Sector",
  ];

  const selectedIndustryPackDetails =
    industryPacks.find((pack) => pack.title === selectedIndustryPack) ||
    industryPacks[0];

  const activeIndustryName =
    selectedIndustryPack === "Custom Sector Pack" && customIndustrySector.trim()
      ? customIndustrySector.trim()
      : selectedIndustryPackDetails.title;

  const ownerRules = [
    {
      title: "Pricing Rule",
      rule: "No discount, final price, GST change, or billing commitment without owner approval.",
      risk: "Prevents wrong pricing and margin damage.",
    },
    {
      title: "Stock Rule",
      rule: "No stock promise unless owner confirms availability.",
      risk: "Prevents false stock commitment.",
    },
    {
      title: "Payment Rule",
      rule: "No credit, advance, refund, or payment term promise without owner approval.",
      risk: "Prevents cash-flow and payment disputes.",
    },
    {
      title: "Delivery Rule",
      rule: "No dispatch time, delivery date, or logistics promise without owner confirmation.",
      risk: "Prevents customer expectation damage.",
    },
    {
      title: "Damage / Return Rule",
      rule: "No refund, replacement, return, or damage claim approval without owner review.",
      risk: "Prevents financial loss and policy misuse.",
    },
  ];

  const activeOwnerRules =
    customOwnerRule.trim().length > 0
      ? [
          ...ownerRules,
          {
            title: "Custom Owner Rule",
            rule: customOwnerRule.trim(),
            risk: "Owner-defined business protection rule.",
          },
        ]
      : ownerRules;

  function detectRequestRisks(message: string) {
    const normalizedMessage = message.toLowerCase();

    const riskRules = [
      {
        tag: "Pricing Risk",
        keywords: ["price", "rate", "discount", "mrp", "billing", "final price"],
      },
      {
        tag: "Stock Risk",
        keywords: ["stock", "available", "availability", "out of stock"],
      },
      {
        tag: "Payment Risk",
        keywords: ["payment", "credit", "advance", "refund", "due", "cash"],
      },
      {
        tag: "Delivery Risk",
        keywords: ["delivery", "dispatch", "shipping", "courier", "arrive"],
      },
      {
        tag: "Return / Damage Risk",
        keywords: ["return", "replacement", "damage", "damaged", "claim"],
      },
    ];

    const riskTags = riskRules
      .filter((risk) =>
        risk.keywords.some((keyword) => normalizedMessage.includes(keyword))
      )
      .map((risk) => risk.tag);

    return {
      riskLevel:
        riskTags.length === 0 ? "Low" : riskTags.length <= 2 ? "Medium" : "High",
      riskTags: riskTags.length === 0 ? ["No major risk detected"] : riskTags,
    };
  }

  const promptTemplates = [
{
  title: "Universal Smart Order Parser",
  description: "Parse customer orders from any business sector into order summary, missing details, bill draft, and confirmation reply.",
  prompt:
    "You are NEXUS Universal Smart Order Parser.\n\n" +
    "NEXUS is an AI Business Closing, Order, Billing, Follow-up, and Customer Support Operating System.\n\n" +
    "Your job is to read raw customer messages from WhatsApp, Instagram, website chat, email, or call notes and convert them into clean business-ready order intelligence.\n\n" +
    "Core Rules:\n" +
    "1. First identify the business sector from the message when possible.\n" +
    "2. Supported sectors include pharma distribution, e-commerce, retail, wholesale, real estate, clinic, diagnostic center, restaurant, service business, education, logistics, and custom business.\n" +
    "3. Parse customer demand clearly.\n" +
    "4. Extract product or service name, quantity, unit, size, variant, delivery location, customer details, payment details, and timeline if provided.\n" +
    "5. Find missing details required to complete and close the order.\n" +
    "5A. For pharma, wholesale, retail, and B2B orders, always check customer name, billing GST number, delivery date confirmation, rate confirmation, stock confirmation, payment terms, and dispatch timing.\n" +
    "6. Create a clean bill draft without inventing price, GST, discount, stock, availability, or delivery charge.\n" +
    "7. Create the next action for the business owner or sales team.\n" +
    "8. Create a short confirmation reply ready to send to the customer.\n" +
    "9. Use professional simple Hinglish unless the customer message is fully English.\n" +
    "10. Do not use markdown stars.\n" +
    "11. Do not add subject line unless asked.\n" +
    "12. Do not use placeholders like [Name] or [Company].\n\n" +
    "Pharma Mode Rules:\n" +
    "If the message is a pharma order, understand short medicine names and common pharma abbreviations.\n" +
    "Example: Pan 40 means Pantoprazole 40mg, PCM 650 means Paracetamol 650mg, Cetrizine means Cetirizine.\n" +
    "Identify units like box, strip, bottle, vial, ampoule, pieces.\n\n" +
    "Output format:\n\n" +
    "Detected Sector:\n" +
    "Mention sector name\n\n" +
    "Order Summary:\n" +
    "1. Product or service name - quantity unit\n\n" +
    "Delivery Location:\n" +
    "Mention location or say Not provided\n\n" +
    "Missing Details:\n" +
    "- Customer name if not provided\n" +
    "- Billing GST number if B2B billing is needed\n" +
    "- Delivery date confirmation if not provided\n" +
    "- Rate confirmation if rate is not provided\n" +
    "- Stock confirmation if stock is not provided\n" +
    "- Payment terms if not provided\n" +
    "- Dispatch timing if not provided\n\n" +
    "Bill Draft:\n" +
    "For each item, use this clean format:\n" +
    "Item: product or service name\n" +
    "Quantity: quantity\n" +
    "Unit: unit\n" +
    "Rate Status: Rate confirmation pending\n" +
    "Stock Status: Stock confirmation pending\n" +
    "Amount Status: Amount not calculated until rate is confirmed\n\n" +
    "Next Action:\n" +
    "Mention the exact next action needed to close or process the order.\n\n" +
    "Confirmation Reply:\n" +
    "Write a short professional ready-to-send customer reply.",
},
    {
      title: "Rate & Stock Reply",
      description: "Reply to medicine rate and stock enquiries.",
      prompt:
        "Create a professional pharma distributor reply. Customer is asking about medicine rate, stock, and delivery. If price or stock is not provided, ask for quantity and delivery location:",
    },
    {
      title: "Sales Follow-up",
      description: "Follow up with a medical store or retailer.",
      prompt:
        "Write a short pharma sales follow-up message for a medical store. Keep it polite, practical, and order-focused:",
    },
    {
      title: "Order Confirmation",
      description: "Confirm medicine order details clearly.",
      prompt:
        "Write a professional pharma order confirmation message. Include medicine name, quantity, delivery timing, and confirmation request if details are missing:",
    },
    {
      title: "Complaint Reply",
      description: "Handle delivery, stock, or invoice complaints.",
      prompt:
        "Write a calm and professional complaint reply for a pharma distributor. Ask for invoice number, product name, batch number, and issue details if missing:",
    },
    {
      title: "Owner Daily Summary",
      description: "Create a daily business summary for owner.",
      prompt:
        "Create a simple daily owner summary for a pharma distributor. Include enquiries, confirmed orders, follow-ups pending, complaints, and top-demand medicines:",
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

  function useTemplate(templateTitle: string, templatePrompt: string) {
    setSelectedTemplate(templateTitle);
    setSelectedTemplatePrompt(templatePrompt);
    setAiInput("");
    setAiResponse("");
  }

  async function generateResponse() {
    if (!aiInput.trim()) {
      setAiResponse("Please enter a message first.");
      return;
    }

    setAiResponse("NEXUS AI Brain is thinking...");

    try {
      const detectedRisk = detectRequestRisks(aiInput);

    const ownerRulesContext = activeOwnerRules
      .map(
        (rule) =>
          `${rule.title}: ${rule.rule} Protection: ${rule.risk}`
      )
      .join("\n");

    const industryContext = `
Active Industry Pack: ${selectedIndustryPack}
Active Sector: ${activeIndustryName}
Pack Purpose: ${selectedIndustryPackDetails.focus}
Pack Protection Rules: ${selectedIndustryPackDetails.rules.join(", ")}
`;
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
3. Do not use placeholders like [Customer Name], [Your Name], [Today's Date], [Company Name], or [Owner].
4. Do not use markdown symbols like **, ##, bullets with stars, or code blocks.
5. Do not add subject lines unless the user specifically asks for email format.
6. If price, stock, or delivery time is not provided, politely ask for quantity and location.
7. Keep the reply short, practical, and professional.
8. Write like a real business owner replying to a customer.
9. Use simple English or simple Hinglish based on the customer message.
10. Generate only the final ready-to-send message.

Selected template:
${selectedTemplate}

Template instructions:
${selectedTemplatePrompt || "Use general business assistant rules."}

Customer/business message:
${aiInput}`,
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
            status: "Pending Owner Approval",
        },
        ...prev,
      ]);
    } catch {
      setAiResponse("Failed to connect with NEXUS AI Brain.");
    }
  }

  function approveRequest(requestId: number) {
    setResponseHistory((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "Approved", ownerDecisionAt: new Date().toLocaleString() } : item
      )
    );
  }

  function rejectRequest(requestId: number) {
    setResponseHistory((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "Rejected", ownerDecisionAt: new Date().toLocaleString() } : item
      )
    );
  }

  function getOwnerDecisionAudit(status: string, ownerDecisionAt?: string) {
    if (status === "Approved") {
      return `Approved by owner at ${ownerDecisionAt ?? "decision time unavailable"}`;
    }

    if (status === "Rejected") {
      return `Rejected by owner at ${ownerDecisionAt ?? "decision time unavailable"}`;
    }

    return "Awaiting owner decision";
  }
  function getExecutionGuardLabel(status: string) {
    if (status === "Approved") return "Ready for Safe Execution";
    if (status === "Rejected") return "Permanently Blocked";
    return "Locked ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â Owner Approval Required";
  }

  function getExecutionGuardDetail(status: string) {
    if (status === "Approved") {
      return "Owner approved. NEXUS may now continue toward safe execution.";
    }

    if (status === "Rejected") {
      return "Owner rejected. NEXUS must not execute this risky action.";
    }

    return "Pending approval. NEXUS must not perform any final risky action.";
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

  const pendingApprovalCount = responseHistory.filter((item) => item.status === "Pending Owner Approval").length;
  const approvedApprovalCount = responseHistory.filter((item) => item.status === "Approved").length;
  const rejectedApprovalCount = responseHistory.filter((item) => item.status === "Rejected").length;
  const totalApprovalRoutes = responseHistory.length;
  const approvalRoutesByStatus =
    approvalQueueFilter === "All"
      ? responseHistory
      : responseHistory.filter((item) => item.status === approvalQueueFilter);

  const normalizedApprovalQueueSearch = approvalQueueSearch.trim().toLowerCase();

  const searchedApprovalRoutes =
    normalizedApprovalQueueSearch.length === 0
      ? approvalRoutesByStatus
      : approvalRoutesByStatus.filter(
          (item) =>
            item.input.toLowerCase().includes(normalizedApprovalQueueSearch) ||
            item.response.toLowerCase().includes(normalizedApprovalQueueSearch)
        );

  const filteredApprovalRoutes = [...searchedApprovalRoutes].sort(
    (a, b) => b.id - a.id
  );
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
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Dashboard</button>
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 260, behavior: "smooth" })}>AI Brain</button>
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })}>Templates</button>
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 1100, behavior: "smooth" })}>Customers</button>
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 1450, behavior: "smooth" })}>Orders</button>
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 1900, behavior: "smooth" })}>Automation</button>
          <button type="button" style={sidebarButton} onClick={() => window.scrollTo({ top: 2400, behavior: "smooth" })}>Settings</button>
        </nav>
      </aside>

      <section style={{ flex: 1, padding: "32px", overflow: "auto" }}>
        <header style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "36px", marginBottom: "8px" }}>
            NEXUS Safe Demo Mode
          </h2>
          <p style={{ color: "#94a3b8" }}>
            AI Business Operating System Demo
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
                 {activity}
              </p>
            ))}
          </div>

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

          <div style={cardStyle}>
            <h2 style={{ marginBottom: "16px" }}>Build Log</h2>
            {buildLogs.map((log) => (
              <p key={log} style={{ color: "#cbd5e1" }}>
                 {log}
              </p>
            ))}
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
          <h2 style={{ marginBottom: "16px" }}>Safety Layer v1</h2>
          <p style={{ color: "#22c55e", fontWeight: 700 }}>Safe Mode: Active</p>
          <p style={{ color: "#cbd5e1" }}>Response Mode: Draft Only</p>
          <p style={{ color: "#cbd5e1" }}>Owner Approval: Required</p>
          <p style={{ color: "#cbd5e1" }}>Raw AI Errors: Hidden</p>
          <p style={{ color: "#cbd5e1" }}>Fallback Engine: Active</p>
          <p style={{ color: "#cbd5e1" }}>Business Damage Protection: Enabled</p>
        </div>

        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: "28px",
            border: "1px solid #22c55e",
          }}
        >
          <h2 style={{ marginBottom: "16px" }}>MVP Demo Readiness Panel v1</h2>
          <p style={{ color: "#cbd5e1", marginBottom: "14px" }}>
            NEXUS demo readiness snapshot for owner review before MVP presentation.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              "Customer Memory",
              "Owner Approval",
              "Safety Layer",
              "Audit Logs",
              "Zero Damage",
            ].map((pillar) => (
              <div
                key={pillar}
                style={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ color: "#22c55e", fontWeight: 700, marginBottom: "6px" }}>
                  Ready
                </p>
                <p style={{ color: "#f8fafc", fontWeight: 700 }}>{pillar}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "14px" }}>
            UI-only readiness panel. It does not execute actions, approve routes, reject routes, or change backend logic.
          </p>
        </section>

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
                <p style={{ color: "#94a3b8", marginBottom: "8px" }}>
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





















