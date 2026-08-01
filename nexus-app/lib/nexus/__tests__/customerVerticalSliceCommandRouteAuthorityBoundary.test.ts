import {
  readFileSync,
} from "node:fs";
import {
  join,
} from "node:path";
import {
  describe,
  expect,
  it,
} from "vitest";

function read(relativePath: string): string {
  return readFileSync(
    join(process.cwd(), relativePath),
    "utf8",
  );
}

describe("customer vertical slice command route authority boundary", () => {
  const route = read(
    "app/api/nexus/customer-vertical-slice/command/route.ts",
  );
  const httpRoute = read(
    "lib/nexus/customerVerticalSliceHttpRoute.ts",
  );
  const runtime = read(
    "lib/nexus/customerVerticalSliceLocalSandboxRuntime.ts",
  );
  const handler = read(
    "lib/nexus/customerVerticalSliceCommandHandler.ts",
  );

  it("exposes only a no-store POST command route", () => {
    expect(route).toMatch(
      /export async function POST/,
    );
    expect(route).not.toMatch(
      /export async function (GET|PUT|PATCH|DELETE)/,
    );
    expect(route).toMatch(
      /cache-control[\s\S]*no-store/i,
    );
  });

  it("fails closed unless the local sandbox runtime is configured", () => {
    expect(route).toMatch(
      /ensureCustomerVerticalSliceLocalSandboxRuntimeConfigured/,
    );
    expect(route).toMatch(
      /if \(!configured\)[\s\S]*unavailableResponse/,
    );
    expect(runtime).toMatch(
      /process\.env\.NODE_ENV === "production"[\s\S]*return false/,
    );
    expect(runtime).toMatch(
      /NEXUS_LOCAL_SANDBOX_ENABLED !== "true"[\s\S]*return false/,
    );
    expect(runtime).toMatch(
      /token\.length < 32[\s\S]*secret\.length < 32/,
    );
  });

  it("requires bearer authentication and signed request integrity", () => {
    expect(runtime).toMatch(
      /authorization === `Bearer \$\{token\}`/,
    );
    expect(runtime).toMatch(
      /createHmac\("sha256", input\.secret\)/,
    );
    expect(runtime).toMatch(
      /timingSafeEqual/,
    );
    expect(runtime).toMatch(
      /x-nexus-signature/,
    );
    expect(httpRoute).toMatch(
      /dependencies\.loadSession\(request\)/,
    );
    expect(httpRoute).toMatch(
      /dependencies\.verifyRequestIntegrity/,
    );
  });

  it("requires authenticated identity and exact tenant binding", () => {
    expect(handler).toMatch(
      /input\.session\.authenticated !== true/,
    );
    expect(handler).toMatch(
      /sessionTenantId !== body\.requestedTenantId/,
    );
    expect(handler).toMatch(
      /status: 403[\s\S]*COMMAND_FORBIDDEN/,
    );
    expect(httpRoute).toMatch(
      /auditContext\.tenantId !== session\.tenantId\.trim\(\)/,
    );
  });

  it("keeps live execution, external delivery and public launch unauthorized", () => {
    expect(handler).toMatch(
      /executionMode: "sandbox" \| "live"/,
    );
    expect(handler).toMatch(
      /externalDeliveryRequested: boolean/,
    );
    expect(handler).toMatch(
      /publicLaunchRequested: boolean/,
    );
    expect(handler).toMatch(
      /LIVE_EXECUTION_NOT_AUTHORIZED/,
    );
    expect(handler).toMatch(
      /EXTERNAL_DELIVERY_NOT_AUTHORIZED/,
    );
    expect(handler).toMatch(
      /PUBLIC_LAUNCH_NOT_AUTHORIZED/,
    );
  });
});