import { NextResponse } from "next/server";
import {
  validateNexusDay306SubscriptionLockVisualPanel
} from "@/lib/nexus/day306SubscriptionLockVisualPanel";

export const dynamic = "force-static";

export async function GET() {
  const validation = validateNexusDay306SubscriptionLockVisualPanel();

  return NextResponse.json({
    ok: validation.ok,
    route: "day-306-subscription-lock-visual-panel-smoke-preview-only",
    validation
  });
}
