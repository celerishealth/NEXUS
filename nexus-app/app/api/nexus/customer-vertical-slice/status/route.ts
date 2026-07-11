import { join } from "node:path";

import {
  handleCustomerVerticalSliceLocalSandboxStatus,
} from "../../../../../lib/nexus/customerVerticalSliceLocalSandboxStatus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
): Promise<Response> {
  return handleCustomerVerticalSliceLocalSandboxStatus(
    request,
    {
      enabled:
        process.env.NEXUS_LOCAL_SANDBOX_ENABLED ===
        "true",
      production:
        process.env.NODE_ENV === "production",
      token:
        process.env.NEXUS_LOCAL_SANDBOX_TOKEN ?? "",
      secret:
        process.env.NEXUS_LOCAL_SANDBOX_SECRET ?? "",
      filePath:
        process.env.NEXUS_LOCAL_SANDBOX_FILE?.trim() ||
        join(
          process.cwd(),
          ".nexus-data",
          "customer-vertical-slice.json",
        ),
    },
  );
}
