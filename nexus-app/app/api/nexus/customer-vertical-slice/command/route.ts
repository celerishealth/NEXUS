import { createHash } from "node:crypto";

import {
  handleCustomerVerticalSliceHttpRequest,
} from "../../../../../lib/nexus/customerVerticalSliceHttpRoute";

import {
  requireCustomerVerticalSliceRouteDependencies,
} from "../../../../../lib/nexus/customerVerticalSliceRouteDependencies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createRouteCorrelationId(request: Request): string {
  const digest = createHash("sha256")
    .update(
      [
        request.method,
        request.url,
        request.headers.get("x-request-id") ?? "",
      ].join("|"),
      "utf8",
    )
    .digest("hex")
    .slice(0, 20);

  return `vsnr_${digest}`;
}

function unavailableResponse(
  request: Request,
): Response {
  const correlationId =
    createRouteCorrelationId(request);

  return new Response(
    JSON.stringify({
      ok: false,
      correlationId,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message:
          "The customer command service is not configured.",
        retryable: true,
      },
    }),
    {
      status: 503,
      headers: {
        "content-type":
          "application/json; charset=utf-8",
        "cache-control": "no-store, max-age=0",
        "x-content-type-options": "nosniff",
        "referrer-policy": "no-referrer",
        "x-correlation-id": correlationId,
      },
    },
  );
}

export async function POST(
  request: Request,
): Promise<Response> {
  try {
    const dependencies =
      requireCustomerVerticalSliceRouteDependencies();

    return await handleCustomerVerticalSliceHttpRequest(
      request,
      dependencies,
    );
  } catch {
    return unavailableResponse(request);
  }
}
