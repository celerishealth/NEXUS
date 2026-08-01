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

describe("customer vertical slice status authority boundary", () => {
  const route = read(
    "app/api/nexus/customer-vertical-slice/status/route.ts",
  );
  const handler = read(
    "lib/nexus/customerVerticalSliceLocalSandboxStatus.ts",
  );

  it("exposes GET only and fails closed outside local sandbox", () => {
    expect(route).toMatch(
      /export\s+async\s+function\s+GET/,
    );
    expect(route).not.toMatch(
      /export\s+async\s+function\s+(POST|PUT|PATCH|DELETE)/,
    );
    expect(route).toMatch(
      /NEXUS_LOCAL_SANDBOX_ENABLED/,
    );
    expect(route).toMatch(
      /NODE_ENV\s*===\s*"production"/,
    );
  });

  it("requires authenticated signed access", () => {
    expect(handler).toMatch(
      /dependencies\.loadSession\(request\)/,
    );
    expect(handler).toMatch(
      /session\.authenticated\s*!==\s*true/,
    );
    expect(handler).toMatch(
      /dependencies\.verifyRequestIntegrity/,
    );
    expect(handler).toMatch(
      /REQUEST_INTEGRITY_FAILED/,
    );
  });

  it("binds tenant and actor identity exactly", () => {
    expect(handler).toMatch(
      /session\.tenantId\s*!==\s*requestedTenantId/,
    );
    expect(handler).toMatch(
      /session\.actorId\s*!==\s*state\.ownerId/,
    );
    expect(handler).toMatch(
      /session\.actorId\s*!==\s*state\.customerId/,
    );
  });

  it("remains read-only and uncached", () => {
    expect(handler).toMatch(
      /repository\.readSnapshot\(\)/,
    );
    expect(handler).toMatch(
      /cache-control":\s*"no-store,\s*max-age=0"/,
    );
    expect(handler).not.toMatch(
      /\bcompareAndSet\s*\(/,
    );
    expect(handler).not.toMatch(
      /\bwriteFile\s*\(/,
    );
  });

  it("returns explicit blocked authority markers", () => {
    expect(handler).toMatch(
      /sandboxOnly:\s*true/,
    );
    expect(handler).toMatch(
      /readOnly:\s*true/,
    );

    for (const marker of [
      "publicLaunchAuthorized",
      "paymentExecutionAuthorized",
      "liveProviderExecutionAuthorized",
      "externalDeliveryAuthorized",
      "customerContactAuthorized",
      "providerMutationAuthorized",
    ]) {
      expect(handler).toMatch(
        new RegExp(`${marker}:\\s*false`),
      );
    }
  });
});