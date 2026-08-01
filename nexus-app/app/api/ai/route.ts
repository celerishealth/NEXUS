import { NextResponse } from "next/server";

const MAX_PUBLIC_DEMO_AI_REQUEST_BYTES =
  16 * 1024;

const MAX_PUBLIC_DEMO_AI_PROMPT_CHARACTERS =
  8_000;

const PUBLIC_DEMO_AI_RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
} as const;

function jsonResponse(
  body: Readonly<Record<string, unknown>>,
  status = 200,
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers:
      PUBLIC_DEMO_AI_RESPONSE_HEADERS,
  });
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

export async function POST(
  request: Request,
): Promise<NextResponse> {
  const contentType =
    request.headers
      .get("content-type")
      ?.toLowerCase() ?? "";

  if (
    !contentType.startsWith(
      "application/json",
    )
  ) {
    return jsonResponse(
      {
        error:
          "Content-Type must be application/json.",
      },
      415,
    );
  }

  const declaredLength =
    request.headers.get(
      "content-length",
    );

  if (declaredLength !== null) {
    const parsedLength =
      Number.parseInt(
        declaredLength,
        10,
      );

    if (
      !Number.isFinite(parsedLength) ||
      parsedLength < 0
    ) {
      return jsonResponse(
        {
          error:
            "Content-Length is invalid.",
        },
        400,
      );
    }

    if (
      parsedLength >
      MAX_PUBLIC_DEMO_AI_REQUEST_BYTES
    ) {
      return jsonResponse(
        {
          error:
            "Public demo AI request is too large.",
        },
        413,
      );
    }
  }

  let rawBody = "";

  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse(
      {
        error:
          "Public demo AI request body could not be read.",
      },
      400,
    );
  }

  const actualBodyBytes =
    new TextEncoder()
      .encode(rawBody)
      .byteLength;

  if (
    actualBodyBytes >
    MAX_PUBLIC_DEMO_AI_REQUEST_BYTES
  ) {
    return jsonResponse(
      {
        error:
          "Public demo AI request is too large.",
      },
      413,
    );
  }

  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonResponse(
      {
        error:
          "Public demo AI request must contain valid JSON.",
      },
      400,
    );
  }

  if (
    parsedBody === null ||
    typeof parsedBody !== "object" ||
    Array.isArray(parsedBody)
  ) {
    return jsonResponse(
      {
        error:
          "Public demo AI request must contain a JSON object.",
      },
      400,
    );
  }

  const body =
    parsedBody as Record<
      string,
      unknown
    >;

  const candidate =
    body.prompt ??
    body.message ??
    body.input ??
    "";

  const prompt =
    typeof candidate === "string"
      ? candidate.trim()
      : "";

  if (!prompt) {
    return jsonResponse(
      {
        error:
          "Please enter a customer message or order details to continue.",
      },
      400,
    );
  }

  if (
    prompt.length >
    MAX_PUBLIC_DEMO_AI_PROMPT_CHARACTERS
  ) {
    return jsonResponse(
      {
        error:
          "Public demo AI prompt is too long.",
      },
      413,
    );
  }

  return jsonResponse({
    response: applySafetyLayer(
      buildLocalFallbackResponse(
        prompt,
      ),
    ),
    mode:
      "LOCAL_PUBLIC_DEMO_DRAFT_ONLY",
    externalProviderCalled: false,
    ownerApprovalRequired: true,
  });
}