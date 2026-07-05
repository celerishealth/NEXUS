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
      
<section className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Day 201 · Final Review</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Readiness Completion Final Review v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only final review confirming locked NEXUS vision, owner control, safety boundaries, monetization discipline, and controlled paid pilot launch readiness without execution.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-readiness-completion-final-review"
    className="mt-5 inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:border-cyan-200 hover:bg-cyan-300/10"
  >
    View Day 201 final review API
  </a>
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
    
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Day 84 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Context Assembly Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for customer memory context assembly. It checks identity scope,
                safe source boundaries, context block safety, owner-approval limits, and prohibited execution terms
                before any future real execution architecture.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Preview-only - Zero write
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Validation scope</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Business ID, customer ID, context source, risk level, and owner-approval requirements are checked.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Locked safety</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No DB memory read/write, no customer data write, no payment, no message sending, no approve/reject.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-context-assembly-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-fuchsia-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-fuchsia-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
                Day 85 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Context Injection Contract v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview contract for safe customer memory context injection rules. It defines what can be
                placed into a future AI context window while blocking real DB memory access, customer data writes,
                message sending, payments, approve/reject behavior, and risky execution.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Contract-only - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Injection scope</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Business ID, customer ID, conversation ID, source safety, risk level, and approval boundaries are checked.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Zero risky action</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No DB memory read/write, no customer data write, no payment, no message sending, no approve/reject.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-context-injection-contract
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-violet-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">
                Day 86 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Context Injection Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for safe customer memory context injection. It validates contract readiness,
                block safety, source trust, confidence, risk boundaries, and prohibited execution intents before any future
                real AI context execution.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Validator-only - Zero execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Validation scope</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms upstream contract readiness, context block safety, source trust, minimum confidence, and scope.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Locked boundaries</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No real DB memory read/write, no customer data write, no payment, no message sending, no approve/reject.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-context-injection-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-sky-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
                Day 87 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Prompt Context Contract v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview contract for safe customer memory prompt context rules. It defines how validated
                memory context may be prepared for a future AI context window while blocking real AI prompt execution,
                real DB memory access, customer data writes, message sending, payments, approve/reject behavior, and risky execution.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Prompt contract - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Prompt context scope</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms business, customer, conversation, upstream injection validation, safe source, and confidence boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Zero execution</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No real prompt execution, no DB memory read/write, no customer data write, no payment, no message sending.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-prompt-context-contract
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Day 88 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Prompt Context Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for safe customer memory prompt context. It validates upstream contract
                readiness, block safety, source trust, confidence, risky instruction patterns, risk boundaries, and
                execution intent before any future real AI model call.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Validator-only - No AI execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Prompt validation</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms contract readiness, prompt context safety, safe source, confidence, and scope boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Locked execution wall</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No AI model call, no prompt execution, no DB memory read/write, no payment, no message sending.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-prompt-context-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-amber-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
                Day 89 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Response Draft Contract v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview contract for safe customer memory response drafting rules. It defines how validated
                prompt context may support a future non-sending response draft while blocking AI model calls, prompt
                execution, real DB memory access, customer data writes, message sending, payments, approve/reject behavior,
                and risky execution.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Draft contract - No sending
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Draft scope</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms business, customer, conversation, upstream prompt validation, safe source, and confidence boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">No outbound action</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No AI model call, no response sending, no DB memory read/write, no payment, no approve/reject execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-response-draft-contract
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-orange-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-orange-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300">
                Day 90 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Response Draft Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for safe customer memory response draft previews. It validates upstream
                contract readiness, draft context safety, unsafe draft language, source trust, confidence, risk boundaries,
                and execution intent while blocking AI model calls, response generation, response sending, DB access, payments,
                approval execution, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Validator-only - No sending
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Draft validation</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms contract readiness, response draft context safety, source trust, confidence, and safe draft language.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Execution blocked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No AI model call, no response generation, no response sending, no DB memory read/write, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-response-draft-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-rose-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-rose-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-300">
                Day 91 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Owner Review Contract v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview contract for routing customer memory response drafts into owner review. It prepares
                safe review context while blocking approve/reject execution, message sending, payments, AI model calls,
                response generation, response sending, DB memory access, customer data writes, and risky execution.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Owner review - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Review routing</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms owner scope, response draft validation readiness, context safety, and review-only routing.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Execution blocked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No approve/reject execution, no AI model call, no response sending, no DB write, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-owner-review-contract
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-pink-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-pink-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-300">
                Day 92 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Owner Review Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for customer memory owner review routing. It validates owner scope,
                contract readiness, manual review instructions, draft preview safety, context trust, and high-risk routing
                while blocking approve/reject execution, owner decision execution, message sending, payments, AI model calls,
                response generation, response sending, DB memory access, customer data writes, and risky execution.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Owner review validator - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Manual review validation</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms owner scope, upstream contract readiness, safe review context, and non-executing review instructions.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Decision execution blocked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No approve/reject execution, no owner decision execution, no AI model call, no response send, no DB write.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-owner-review-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-red-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-red-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-300">
                Day 93 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Final Response Safety Gate v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview final safety gate for customer memory response handling. It checks owner review
                validation readiness, final preview text safety, context trust, risk boundaries, write boundaries, and
                execution intent while blocking AI model calls, response generation, response sending, approve/reject
                execution, owner decision execution, DB memory access, customer data writes, payments, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Final safety gate - Preview only
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Final gate checks</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms owner review validation, final response preview safety, context source trust, and risk boundaries.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Execution wall</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No AI model call, no response generation, no sending, no approval execution, no DB write, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-final-response-safety-gate
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-yellow-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-yellow-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-300">
                Day 94 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Audit Event Contract v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview contract for customer memory audit event structure. It prepares non-persisted audit
                metadata for safety decisions while blocking real audit writes, DB access, customer data writes, memory writes,
                message sending, payments, AI model calls, response generation, approve/reject execution, owner decision execution,
                and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Audit contract - No persistence
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Audit preview</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Defines audit event type, scope, safety decision, risk level, owner requirement, and subject metadata.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Persistence blocked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No real audit write, no DB write, no memory write, no customer data write, no sending, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-audit-event-contract
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-lime-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-lime-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lime-300">
                Day 95 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Audit Event Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for customer memory audit event previews. It validates audit contract readiness,
                deterministic audit preview ID, event type, safety decision, subject trust, write boundaries, and execution intent
                while blocking audit persistence, DB writes, memory writes, customer data writes, message sending, payments,
                AI model calls, response generation, approve/reject execution, owner decision execution, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Audit validator - No persistence
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Audit validation</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms preview ID, event type, safety decision, audit subject trust, source boundaries, and contract readiness.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Persistence blocked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No audit persistence, no DB write, no memory write, no customer data write, no sending, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-audit-event-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-teal-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-teal-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-300">
                Day 96 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Recovery/Fallback Contract v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview contract for customer memory recovery and fallback behavior. It defines safe fallback
                routing after the safety pipeline while blocking recovery execution, audit persistence, DB access, customer
                data writes, memory writes, message sending, payments, AI model calls, response generation, approve/reject
                execution, owner decision execution, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Recovery contract - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Zero Stop fallback</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Routes blocked, unclear, or failed pipeline states to safe fallback preview or manual owner review.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Zero Damage wall</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No recovery execution, no DB write, no memory write, no audit persistence, no sending, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-recovery-fallback-contract
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Day 97 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Recovery/Fallback Validator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview validator for customer memory recovery and fallback behavior. It validates fallback
                contract readiness, recovery mode, failed stage, fallback reason, safe fallback message, source trust,
                write boundaries, and execution intent while blocking recovery execution, audit persistence, DB access,
                customer data writes, memory writes, message sending, payments, AI model calls, response generation,
                approve/reject execution, owner decision execution, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Recovery validator - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Fallback validation</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Confirms safe fallback mode, failed stage, reason, preview message, source trust, and contract readiness.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Zero Damage wall</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No recovery execution, no DB write, no memory write, no audit persistence, no sending, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-recovery-fallback-validator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">
                Day 98 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Backend Customer Memory Full Pipeline Preview Orchestrator v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Read-only preview orchestrator for the complete customer memory safety pipeline. It summarizes every
                preview-only stage from write eligibility through recovery fallback while blocking real pipeline execution,
                DB access, audit persistence, customer data writes, memory writes, message sending, payments, AI model calls,
                response generation, approve/reject execution, owner decision execution, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Pipeline preview - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Full safety chain</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Covers write eligibility, storage, retrieval, context, prompt, response draft, owner review, final gate, audit, and fallback.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Execution blocked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No pipeline execution, no AI model call, no sending, no DB write, no audit persistence, no payment execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-full-pipeline-preview-orchestrator
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-indigo-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-indigo-950/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
                Day 99 - Customer Memory
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Customer Memory Pipeline Summary Dashboard v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Premium read-only dashboard summary for the complete customer memory safety pipeline. It shows stage
                coverage, execution wall, write wall, owner control, safety status, and fallback readiness while blocking
                pipeline execution, DB access, audit persistence, customer data writes, memory writes, message sending,
                payments, AI model calls, response generation, approve/reject execution, owner decision execution, and risky actions.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Dashboard summary - Read-only
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Stage Coverage</p>
              <p className="mt-2 text-2xl font-semibold text-indigo-200">21/21</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Full customer memory safety chain represented from write eligibility to orchestrator.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Execution Wall</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">Locked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No pipeline execution, no AI model call, no sending, no payment, no approve/reject execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Write Wall</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">Locked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No DB write, no audit persistence, no recovery write, no customer data write, no memory write.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-pipeline-summary-dashboard
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/20 bg-slate-950/80 p-6 shadow-2xl shadow-white/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white">
                Day 100 - Architecture Checkpoint
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Customer Memory Architecture Checkpoint + Build Integrity Review v1
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Major read-only checkpoint for the complete Day 78 through Day 99 customer memory foundation. It reviews
                stage coverage, build integrity, read-only boundaries, execution walls, write walls, owner control, audit
                readiness, fallback readiness, and next-phase readiness while preserving NEXUS as an owner-controlled AI
                Business Operating Layer above existing business software.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              Checkpoint - No execution
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Customer Memory Chain</p>
              <p className="mt-2 text-2xl font-semibold text-white">22 stages</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Day 78 through Day 99 checkpointed as preview-only architecture.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Execution Wall</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">Locked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No AI calls, sending, payments, approve/reject, owner decision execution, or pipeline execution.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Write Wall</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">Locked</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                No DB write, audit persistence, recovery write, memory write, or customer data write.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Route</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                /api/nexus/customer-memory-architecture-checkpoint
              </p>
            </div>
          </div>
        </section>

          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 186 · CONTROLLED PAID PILOT LAUNCH ARCHITECTURE PLANNING SUMMARY
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Architecture Planning Summary v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only preview summary for controlled paid pilot launch architecture planning. It preserves owner control,
              safety boundaries, monetization discipline, trust-first launch sequencing, and zero-risk pilot readiness.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 187 - CONTROLLED PAID PILOT LAUNCH ARCHITECTURE PLANNING CHECKPOINT
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Architecture Planning Checkpoint v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only checkpoint confirming that controlled paid pilot launch planning remains owner-controlled,
              trust-first, preview-only, and blocked from execution.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 188 - CONTROLLED PAID PILOT LAUNCH ARCHITECTURE PLANNING CONTINUITY REVIEW
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Architecture Planning Continuity Review v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only continuity review confirming that controlled paid pilot launch planning remains aligned with
              owner control, safety boundaries, trust-first sequencing, and locked NEXUS identity.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 189 - CONTROLLED PAID PILOT LAUNCH ARCHITECTURE PLANNING BOUNDARY REVIEW
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Architecture Planning Boundary Review v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only boundary review confirming that controlled paid pilot launch planning stays protected,
              owner-controlled, planning-only, and blocked from live execution.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 190 - CONTROLLED PAID PILOT LAUNCH READINESS GATE
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Gate v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only readiness gate defining what must stay protected before any controlled paid pilot launch can
              move beyond planning.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 191 - CONTROLLED PAID PILOT LAUNCH READINESS GATE VALIDATOR
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Gate Validator v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only validator confirming that controlled paid pilot launch readiness gates remain valid only for
              planning continuation, not live execution.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 192 - CONTROLLED PAID PILOT LAUNCH READINESS SUMMARY
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Summary v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only readiness summary confirming that controlled paid pilot launch planning remains aligned with
              locked NEXUS identity, owner control, safety boundaries, and trust-first monetization discipline.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 193 - CONTROLLED PAID PILOT LAUNCH READINESS CHECKPOINT
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Checkpoint v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only checkpoint confirming that controlled paid pilot launch readiness remains safe for planning
              continuity only, with owner control and trust-first launch discipline preserved.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 194 - CONTROLLED PAID PILOT LAUNCH READINESS FINAL REVIEW
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Final Review v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only final review confirming that controlled paid pilot launch readiness remains safe for planning
              continuity only, with owner control, safety boundaries, and trust-first launch discipline preserved.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 195 - CONTROLLED PAID PILOT LAUNCH READINESS FINAL VALIDATOR
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Final Validator v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only final validator confirming that controlled paid pilot launch readiness remains valid for
              planning-only continuity and blocked from live execution.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 196 - CONTROLLED PAID PILOT LAUNCH READINESS FINAL SUMMARY
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Final Summary v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only final summary confirming that controlled paid pilot launch readiness is finalized for
              planning-only continuity with locked NEXUS identity, owner control, and trust-first safety discipline.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 197 - CONTROLLED PAID PILOT LAUNCH READINESS FINAL CHECKPOINT
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Final Checkpoint v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only final checkpoint confirming that controlled paid pilot launch readiness passes for planning-only
              continuity with locked NEXUS identity, owner control, and trust-first safety discipline preserved.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 198 - CONTROLLED PAID PILOT LAUNCH READINESS COMPLETION REVIEW
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Completion Review v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only completion review confirming that controlled paid pilot launch readiness is complete for
              planning-only continuity while locked NEXUS identity, owner control, and trust-first safety discipline remain preserved.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 199 - CONTROLLED PAID PILOT LAUNCH READINESS COMPLETION VALIDATOR
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Completion Validator v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only completion validator confirming that controlled paid pilot launch readiness is complete and valid
              for planning-only continuity while owner control, locked NEXUS identity, and trust-first safety discipline remain preserved.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "16px",
            }}
          >
            <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>
              DAY 200 - CONTROLLED PAID PILOT LAUNCH READINESS COMPLETION CHECKPOINT
            </p>
            <h3 style={{ color: "#f8fafc", fontSize: "18px", marginBottom: "8px" }}>
              Controlled Paid Pilot Launch Readiness Completion Checkpoint v1
            </h3>
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, marginBottom: "10px" }}>
              Read-only completion checkpoint confirming that controlled paid pilot launch readiness is complete for
              planning-only continuity while locked NEXUS identity, owner control, and trust-first safety discipline remain preserved.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>
              No approval execution, payment execution, invoice creation, subscription activation, entitlement write,
              message sending, customer-data write, real memory read/write, audit persistence, recovery execution,
              third-party mutation, or AI model call is performed.
            </p>
          </div>
<section className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Day 201 · Final Review</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Readiness Completion Final Review v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only final review confirming locked NEXUS vision, owner control, safety boundaries, monetization discipline, and controlled paid pilot launch readiness without execution.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-readiness-completion-final-review"
    className="mt-5 inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:border-cyan-200 hover:bg-cyan-300/10"
  >
    View Day 201 final review API
  </a>
</section>

<section className="rounded-3xl border border-emerald-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Day 202 · Execution Boundary</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Execution Architecture Boundary Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only boundary contract defining what future controlled execution must require while keeping payments, invoices, subscriptions, messages, customer data, memory, audit persistence, recovery, third-party mutation, and AI calls blocked.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-execution-architecture-boundary"
    className="mt-5 inline-flex rounded-full border border-emerald-300/30 px-4 py-2 text-sm font-semibold text-emerald-100 hover:border-emerald-200 hover:bg-emerald-300/10"
  >
    View Day 202 boundary API
  </a>
</section>

<section className="rounded-3xl border border-amber-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-amber-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Day 203 · Owner Execution Gate</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Owner Execution Gate Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only owner-only execution gate contract defining the future approval boundary required before any controlled paid pilot action can move from preview/shadow mode toward real-world execution.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-owner-execution-gate"
    className="mt-5 inline-flex rounded-full border border-amber-300/30 px-4 py-2 text-sm font-semibold text-amber-100 hover:border-amber-200 hover:bg-amber-300/10"
  >
    View Day 203 owner gate API
  </a>
</section>

<section className="rounded-3xl border border-rose-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-rose-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">Day 204 · Risk Scoring</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Risk Scoring and Action Class Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only risk scoring and action-class contract defining low, medium, high, and blocked surfaces while keeping all real execution, payments, invoices, subscriptions, messages, customer data, memory, audit persistence, recovery, third-party mutation, and AI calls blocked.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-risk-scoring-action-class"
    className="mt-5 inline-flex rounded-full border border-rose-300/30 px-4 py-2 text-sm font-semibold text-rose-100 hover:border-rose-200 hover:bg-rose-300/10"
  >
    View Day 204 risk scoring API
  </a>
</section>

<section className="rounded-3xl border border-violet-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-violet-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Day 205 · Allowlist / Blocklist</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Action-Class Allowlist and Blocklist Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only action-class contract defining preview-only allowlisted actions, future eligible classes, and hard-blocked execution surfaces while preserving owner control and blocking all real mutation.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-action-class-allowlist-blocklist"
    className="mt-5 inline-flex rounded-full border border-violet-300/30 px-4 py-2 text-sm font-semibold text-violet-100 hover:border-violet-200 hover:bg-violet-300/10"
  >
    View Day 205 allowlist/blocklist API
  </a>
</section>

<section className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-sky-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Day 206 · Preview Lifecycle</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Pilot Action Preview Lifecycle Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only pilot action preview lifecycle contract defining intake, action-class lookup, risk scoring, blocked surface checks, owner review packet preview, execution eligibility preview, and safe next-step recommendation while blocking all real mutation.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-pilot-action-preview-lifecycle"
    className="mt-5 inline-flex rounded-full border border-sky-300/30 px-4 py-2 text-sm font-semibold text-sky-100 hover:border-sky-200 hover:bg-sky-300/10"
  >
    View Day 206 preview lifecycle API
  </a>
</section>

<section className="rounded-3xl border border-fuchsia-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-fuchsia-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">Day 207 · Owner Review Packet</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Owner Review Packet Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only owner review packet contract defining proposed action summary, action class, risk score, affected surface, blocked status, owner attention, audit readiness, rollback readiness, and safe next step while blocking all decisions and execution.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-owner-review-packet"
    className="mt-5 inline-flex rounded-full border border-fuchsia-300/30 px-4 py-2 text-sm font-semibold text-fuchsia-100 hover:border-fuchsia-200 hover:bg-fuchsia-300/10"
  >
    View Day 207 owner review packet API
  </a>
</section>

<section className="rounded-3xl border border-lime-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-lime-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-300">Day 208 · Execution Eligibility</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Execution Eligibility Decision Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only execution eligibility decision contract defining not-eligible, preview-only, future-eligible-after-contracts, and blocked states while preserving owner control and blocking all real decisions, mutation, persistence, payment, messaging, customer data, recovery, third-party mutation, and AI calls.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-execution-eligibility-decision"
    className="mt-5 inline-flex rounded-full border border-lime-300/30 px-4 py-2 text-sm font-semibold text-lime-100 hover:border-lime-200 hover:bg-lime-300/10"
  >
    View Day 208 eligibility API
  </a>
</section>

<section className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Day 209 · Audit Readiness</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Audit Readiness Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only audit readiness contract defining future audit fields, traceability checks, owner decision visibility, rollback linkage, and fail-closed audit requirements while blocking audit persistence and all real execution.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-audit-readiness"
    className="mt-5 inline-flex rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:border-cyan-200 hover:bg-cyan-300/10"
  >
    View Day 209 audit readiness API
  </a>
</section>

<section className="rounded-3xl border border-orange-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-orange-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">Day 210 · Rollback / Fallback Readiness</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Rollback and Fallback Readiness Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only rollback and fallback readiness contract defining future recovery controls, fallback checks, Zero Damage, Zero Stop, manual owner override, audit linkage, and fail-closed behavior while blocking all recovery execution and mutation.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-rollback-fallback-readiness"
    className="mt-5 inline-flex rounded-full border border-orange-300/30 px-4 py-2 text-sm font-semibold text-orange-100 hover:border-orange-200 hover:bg-orange-300/10"
  >
    View Day 210 rollback/fallback API
  </a>
</section>

<section className="rounded-3xl border border-red-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-red-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">Day 211 · Incident Response Readiness</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Incident Response Readiness Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only incident response readiness contract defining future severity classification, affected surface visibility, owner control, safe stop rules, rollback/audit linkage, and post-incident review while blocking all incident execution, notifications, recovery, persistence, mutation, third-party calls, and AI calls.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-incident-response-readiness"
    className="mt-5 inline-flex rounded-full border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100 hover:border-red-200 hover:bg-red-300/10"
  >
    View Day 211 incident readiness API
  </a>
</section>

<section className="rounded-3xl border border-yellow-400/20 bg-slate-950/70 p-6 shadow-2xl shadow-yellow-950/20">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-300">Day 212 · Manual Owner Override</p>
  <h2 className="mt-3 text-2xl font-bold text-white">Controlled Paid Pilot Launch Manual Owner Override Readiness Contract v1</h2>
  <p className="mt-3 text-sm leading-6 text-slate-300">
    Read-only manual owner override readiness contract preserving owner final authority, manual safe stop, escalation control, audit linkage, rollback linkage, and fail-closed behavior while blocking all override execution, notifications, recovery, persistence, mutation, third-party calls, and AI calls.
  </p>
  <a
    href="/api/nexus/controlled-paid-pilot-launch-manual-owner-override-readiness"
    className="mt-5 inline-flex rounded-full border border-yellow-300/30 px-4 py-2 text-sm font-semibold text-yellow-100 hover:border-yellow-200 hover:bg-yellow-300/10"
  >
    View Day 212 manual override API
  </a>
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

































































