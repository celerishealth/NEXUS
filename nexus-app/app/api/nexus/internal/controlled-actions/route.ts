import { timingSafeEqual } from "node:crypto";
import { resolve } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  ControlledActionCommandGateway,
  type ControlledActionGatewayCommand,
  isControlledActionGatewayRole,
} from "@/lib/nexus/controlledActionCommandGateway";
import {
  PersistentControlledActionVerticalSlice,
} from "@/lib/nexus/persistentControlledActionVerticalSlice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statePath = resolve(
  process.cwd(),
  process.env.NEXUS_CONTROLLED_ACTION_STATE_PATH ??
    ".nexus-runtime/controlled-action-state.json",
);

const gateway = new ControlledActionCommandGateway(
  new PersistentControlledActionVerticalSlice(statePath),
);

function secureEquals(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function errorStatus(message: string): number {
  if (
    message.includes("not permitted") ||
    message.includes("tenant mismatch") ||
    message.includes("authenticated actor") ||
    message.includes("system tenant context")
  ) {
    return 403;
  }

  return 400;
}

export async function POST(request: NextRequest) {
  if (
    process.env.NEXUS_CONTROLLED_ACTION_GATEWAY_ENABLED !== "true"
  ) {
    return NextResponse.json(
      {
        error:
          "Controlled-action command gateway is disabled by default.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  const configuredSecret =
    process.env.NEXUS_INTERNAL_GATEWAY_SECRET?.trim() ?? "";

  if (!configuredSecret) {
    return NextResponse.json(
      {
        error: "Internal gateway secret is not configured.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  const suppliedSecret =
    request.headers.get("x-nexus-gateway-secret") ?? "";

  if (!secureEquals(suppliedSecret, configuredSecret)) {
    return NextResponse.json(
      {
        error: "Unauthorized internal gateway request.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 401,
      },
    );
  }

  const tenantId =
    request.headers.get("x-nexus-tenant-id")?.trim() ?? "";
  const actorId =
    request.headers.get("x-nexus-actor-id")?.trim() ?? "";
  const requestId =
    request.headers.get("x-nexus-request-id")?.trim() ?? "";
  const roleHeader =
    request.headers.get("x-nexus-role")?.trim() ?? "";

  if (!isControlledActionGatewayRole(roleHeader)) {
    return NextResponse.json(
      {
        error: "Invalid or missing internal gateway role.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 403,
      },
    );
  }

  try {
    const command =
      (await request.json()) as ControlledActionGatewayCommand;

    const response = await gateway.execute(
      {
        tenantId,
        actorId,
        requestId,
        role: roleHeader,
      },
      command,
    );

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown controlled-action gateway failure.";

    return NextResponse.json(
      {
        error: message,
        liveProviderExecutionAuthorized: false,
      },
      {
        status: errorStatus(message),
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }
}
