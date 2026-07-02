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
  const customerMessage = getCustomerMessage(prompt);
  const lines = customerMessage
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const orderItems = lines
    .map(parseOrderLine)
    .filter(Boolean) as { item: string; quantity: string; unit: string }[];

  const deliveryLine = lines.find((line) =>
    line.toLowerCase().startsWith("delivery")
  );

  const deliveryLocation = deliveryLine
    ? deliveryLine.replace(/delivery/i, "").trim() || "Not provided"
    : "Not provided";

  const looksPharma =
    customerMessage.toLowerCase().includes("pan 40") ||
    customerMessage.toLowerCase().includes("pcm") ||
    customerMessage.toLowerCase().includes("cetrizine") ||
    customerMessage.toLowerCase().includes("cetirizine") ||
    customerMessage.toLowerCase().includes("mg");

  const detectedSector = looksPharma
    ? "Pharma Distribution"
    : "General Business";

  const orderSummary =
    orderItems.length > 0
      ? orderItems
          .map(
            (item, index) =>
              `${index + 1}. ${item.item} - ${item.quantity} ${item.unit}`
          )
          .join("\n")
      : "No clear order items detected. Please ask customer for item name, quantity, and unit.";

  const billDraft =
    orderItems.length > 0
      ? orderItems
          .map(
            (item) =>
              `Item: ${item.item}\nQuantity: ${item.quantity}\nUnit: ${item.unit}\nRate Status: Rate confirmation pending\nStock Status: Stock confirmation pending\nAmount Status: Amount not calculated until rate is confirmed`
          )
          .join("\n\n")
      : "Bill draft pending until clear item and quantity are received.";

  return `NEXUS Smart Parser Response
Order processed successfully through NEXUS Continuity Engine.

Detected Sector:
${detectedSector}

Order Summary:
${orderSummary}

Delivery Location:
${deliveryLocation}

Missing Details:
- Customer name
- Billing GST number
- Delivery date confirmation
- Rate confirmation
- Stock confirmation
- Payment terms
- Dispatch timing

Bill Draft:
${billDraft}

Next Action:
Confirm customer name, GST number, rates, stock availability, payment terms, and dispatch timing before final billing.

Confirmation Reply:
Order details received. Please share customer name, GST number, delivery date, and payment terms. We will confirm rate, stock, and dispatch timing shortly.`;
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


