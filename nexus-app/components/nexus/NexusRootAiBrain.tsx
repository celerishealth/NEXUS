"use client";

import NexusRootOwnerApprovalRouting from "@/components/nexus/NexusRootOwnerApprovalRouting";
import { useState } from "react";
import type { ReactNode } from "react";

type NexusRootAiBrainProps = {
  children: ReactNode;
};

export default function NexusRootAiBrain({ children }: NexusRootAiBrainProps) {
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Custom Prompt");
  const [selectedTemplatePrompt, setSelectedTemplatePrompt] = useState("");
  const [responseHistory, setResponseHistory] = useState<
    { id: number; type: string; input: string; response: string; status: string; riskLevel?: string; riskTags?: string[] }[]
  >([]);

  const [selectedIndustryPack] = useState("Universal Business Pack");
  const [customIndustrySector] = useState("");
  const [customOwnerRule] = useState("");
  const [approvalQueueFilter] = useState<"All" | "Pending Owner Approval" | "Approved" | "Rejected">("All");
  const [approvalQueueSearch] = useState("");

  void (responseHistory.length);
  const pendingRequests = responseHistory.filter(
    (item) => item.status === "Pending Owner Approval"
  );
  void (responseHistory.filter(
    (item) => item.status === "Approved"
  ));
  void (responseHistory.filter(
    (item) => item.status === "Rejected"
  ));
  void (pendingRequests.length === 0 ? "Smooth" : "Review Needed");
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

  void ([
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
  ]);

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



  function handleTemplateSelection(templateTitle: string, templatePrompt: string) {
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
      void (detectRequestRisks(aiInput));

    void (activeOwnerRules
      .map(
        (rule) =>
          `${rule.title}: ${rule.rule} Protection: ${rule.risk}`
      )
      .join("\n"));

    void (`
Active Industry Pack: ${selectedIndustryPack}
Active Sector: ${activeIndustryName}
Pack Purpose: ${selectedIndustryPackDetails.focus}
Pack Protection Rules: ${selectedIndustryPackDetails.rules.join(", ")}
`);
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


  function copyResponse() {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
  }

  function clearResponse() {
    setAiInput("");
    setAiResponse("");
    setSelectedTemplate("Custom Prompt");
  }

  void (responseHistory.filter((item) => item.status === "Pending Owner Approval").length);
  void (responseHistory.filter((item) => item.status === "Approved").length);
  void (responseHistory.filter((item) => item.status === "Rejected").length);
  void (responseHistory.length);
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
  return (
    <>
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
                onClick={() => handleTemplateSelection(template.title, template.prompt)}
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
      {children}
        <NexusRootOwnerApprovalRouting
          responseHistory={responseHistory}
          filteredApprovalRoutes={filteredApprovalRoutes}
          approveRequest={approveRequest}
          rejectRequest={rejectRequest}
        />
    </>
  );
}

const cardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "22px",
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
