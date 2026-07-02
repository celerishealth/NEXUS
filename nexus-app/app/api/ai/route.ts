import { NextResponse } from "next/server";

function getCustomerMessage(prompt: string) {
  const marker = "Customer/business message:";
  if (prompt.includes(marker)) {
    return prompt.split(marker).pop()?.trim() || prompt.trim();
  }
  return prompt.trim();
}

function normalizeMedicineName(line: string) {
  const lower = line.toLowerCase();

  if (lower.includes("pan 40") || lower.includes("pantoprazole")) {
    return "Pantoprazole 40mg";
  }

  if (lower.includes("pcm 650") || lower.includes("paracetamol")) {
    return "Paracetamol 650mg";
  }

  if (
    lower.includes("cetrizine") ||
    lower.includes("cetirizine") ||
    lower.includes("cetrizine 10mg") ||
    lower.includes("cetirizine 10mg")
  ) {
    return "Cetirizine 10mg";
  }

  return line.replace(/\s+/g, " ").trim();
}

function parseOrderLine(line: string) {
  const cleanLine = line.replace(/\s+/g, " ").trim();

  const quantityMatch = cleanLine.match(/(\d+)\s*(box|boxes|strip|strips|bottle|bottles|vial|vials|piece|pieces|pcs|pack|packs)/i);

  if (!quantityMatch) {
    return null;
  }

  const quantity = quantityMatch[1];
  const unit = quantityMatch[2].toLowerCase();

  const itemText = cleanLine.slice(0, quantityMatch.index).trim();
  const item = normalizeMedicineName(itemText);

  return {
    item,
    quantity,
    unit,
  };
}

function buildLocalFallbackResponse(prompt: string) {
  const customerMessage = prompt || "";
  const lowerMessage = customerMessage.toLowerCase();

  const looksPharma =
    lowerMessage.includes("medicine") ||
    lowerMessage.includes("tablet") ||
    lowerMessage.includes("capsule") ||
    lowerMessage.includes("syrup") ||
    lowerMessage.includes("pharma") ||
    lowerMessage.includes("chemist") ||
    lowerMessage.includes("paracetamol") ||
    lowerMessage.includes("amoxicillin") ||
    lowerMessage.includes("cetirizine") ||
    lowerMessage.includes("mg");

  const detectedSector = looksPharma
    ? "Pharma Distribution"
    : "General Business";

  const possibleOrderLines = customerMessage
    .split(/\n|,|;/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => /\d/.test(line))
    .slice(0, 10);

  const orderSummary =
    possibleOrderLines.length > 0
      ? possibleOrderLines
          .map((line, index) => `${index + 1}. ${line}`)
          .join("\n")
      : "No clear order items detected. Ask the customer for item name, quantity, and unit.";

  const billDraft =
    possibleOrderLines.length > 0
      ? possibleOrderLines
          .map((line, index) => `${index + 1}. ${line} - rate and stock must be confirmed by owner`)
          .join("\n")
      : "No bill draft created because item, quantity, rate, and stock details are not fully confirmed.";

  return `
Local Fallback Engine v1:
AI connection is unavailable, but NEXUS did not stop.

Fallback Status:
- Zero Stop: Active
- Zero Damage: Active
- Draft Only Mode: Active
- Owner Approval Required: Active
- No auto-send
- No final billing without owner review

Detected Sector:
${detectedSector}

Customer Message:
${customerMessage || "No customer message found."}

Safe Order Summary:
${orderSummary}

Missing Details To Confirm:
- Customer name
- GST number if billing requires GST
- Final rates and discounts
- Stock availability
- Delivery date
- Payment terms
- Dispatch timing

Bill Draft:
${billDraft}

Safe Owner Note:
This fallback response was generated locally because the AI connection failed or returned an unsafe/empty result. Treat this as a draft only. Do not send, bill, dispatch, or promise availability until the owner reviews and confirms all details.

Suggested Customer Reply:
Order details received. Please share customer name, GST number if required, delivery date, and payment terms. We will confirm final rate, stock, and dispatch timing after owner review.
`.trim();
}
function applySafetyLayer(response: string) {
  const safetyNote = `

Safety Layer:
Draft Only Mode
Owner Approval Required
Do not auto-send or finalize billing without business owner review.`;

  if (response.includes("Safety Layer:")) {
    return response;
  }

  return `${response}${safetyNote}`;
}

export async function POST(request: Request) {
  let prompt = "";

  try {
    const body = await request.json();
    prompt = String(body?.prompt || body?.message || body?.input || "").trim();

    if (!prompt) {
      return NextResponse.json({
        response:
          "Please enter a customer message or order details to continue.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        response: applySafetyLayer(buildLocalFallbackResponse(prompt)),
      });
    }

    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        return NextResponse.json({
          response: applySafetyLayer(buildLocalFallbackResponse(prompt)),
        });
      }

      const data = await geminiResponse.json();

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        buildLocalFallbackResponse(prompt);

      return NextResponse.json({ response: applySafetyLayer(text) });
    } catch {
      return NextResponse.json({
        response: applySafetyLayer(buildLocalFallbackResponse(prompt)),
      });
    }
  } catch {
    return NextResponse.json({
      response:
        "NEXUS is ready. Please enter the customer message again.",
    });
  }
}


