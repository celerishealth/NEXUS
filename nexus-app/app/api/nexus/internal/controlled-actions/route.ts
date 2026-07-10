import { resolve } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  ControlledActionCommandGateway,
} from "@/lib/nexus/controlledActionCommandGateway";
import {
  PersistentControlledActionVerticalSlice,
} from "@/lib/nexus/persistentControlledActionVerticalSlice";
import {
  calculateGatewayReplayExpiry,
  PersistentControlledActionGatewayReplayGuard,
  verifySignedControlledActionGatewayEnvelope,
} from "@/lib/nexus/signedControlledActionGatewayEnvelope";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const actionStatePath = resolve(
  process.cwd(),
  process.env.NEXUS_CONTROLLED_ACTION_STATE_PATH ??
    ".nexus-runtime/controlled-action-state.json",
);

const replayStatePath = resolve(
  process.cwd(),
  process.env.NEXUS_GATEWAY_REPLAY_STATE_PATH ??
    ".nexus-runtime/controlled-action-gateway-replay.json",
);

const gateway = new ControlledActionCommandGateway(
  new PersistentControlledActionVerticalSlice(
    actionStatePath,
  ),
);

const replayGuard =
  new PersistentControlledActionGatewayReplayGuard(
    replayStatePath,
  );

function readClockSkewMs(): number {
  const rawValue =
    process.env.NEXUS_GATEWAY_MAX_CLOCK_SKEW_MS ??
    "300000";

  const parsedValue = Number(rawValue);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 1 ||
    parsedValue > 900_000
  ) {
    throw new Error(
      "NEXUS_GATEWAY_MAX_CLOCK_SKEW_MS must be between 1 and 900000.",
    );
  }

  return parsedValue;
}

function errorStatus(message: string): number {
  if (
    message.includes("signature") ||
    message.includes("key is unknown") ||
    message.includes("envelope is stale") ||
    message.includes("issued too far")
  ) {
    return 401;
  }

  if (message.includes("replay")) {
    return 409;
  }

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
    process.env
      .NEXUS_CONTROLLED_ACTION_GATEWAY_ENABLED !==
    "true"
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

  const keyId =
    process.env.NEXUS_INTERNAL_GATEWAY_KEY_ID?.trim() ??
    "primary";

  const signingSecret =
    process.env
      .NEXUS_INTERNAL_GATEWAY_SIGNING_SECRET?.trim() ??
    "";

  if (!signingSecret) {
    return NextResponse.json(
      {
        error:
          "Internal gateway signing secret is not configured.",
        liveProviderExecutionAuthorized: false,
      },
      {
        status: 503,
      },
    );
  }

  try {
    const maxClockSkewMs = readClockSkewMs();
    const now = new Date().toISOString();
    const rawEnvelope: unknown =
      await request.json();

    const envelope =
      verifySignedControlledActionGatewayEnvelope(
        rawEnvelope,
        {
          [keyId]: signingSecret,
        },
        {
          now,
          maxClockSkewMs,
        },
      );

    const replayExpiresAt =
      calculateGatewayReplayExpiry(
        envelope.issuedAt,
        maxClockSkewMs,
      );

    const reserved = await replayGuard.reserve(
      envelope.keyId,
      envelope.nonce,
      now,
      replayExpiresAt,
    );

    if (!reserved) {
      return NextResponse.json(
        {
          error:
            "Signed gateway request replay detected.",
          liveProviderExecutionAuthorized: false,
        },
        {
          status: 409,
          headers: {
            "cache-control": "no-store",
          },
        },
      );
    }

    const response = await gateway.execute(
      envelope.context,
      envelope.command,
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
        : "Unknown signed gateway failure.";

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
