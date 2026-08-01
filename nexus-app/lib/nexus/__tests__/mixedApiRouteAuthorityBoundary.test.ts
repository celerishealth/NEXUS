import {
  readdirSync,
  readFileSync,
} from "node:fs";
import {
  join,
  relative,
} from "node:path";
import {
  describe,
  expect,
  it,
} from "vitest";

function collectRouteFiles(directory: string): string[] {
  return readdirSync(directory, {
    withFileTypes: true,
  }).flatMap((entry) => {
    const fullPath = join(
      directory,
      entry.name,
    );

    if (entry.isDirectory()) {
      return collectRouteFiles(fullPath);
    }

    return entry.name === "route.ts"
      ? [fullPath]
      : [];
  });
}

function readRoute(relativePath: string): string {
  return readFileSync(
    join(
      process.cwd(),
      relativePath,
    ),
    "utf8",
  );
}

const routeRoot = join(
  process.cwd(),
  "app",
  "api",
  "nexus",
);

const mixedRoutes = collectRouteFiles(routeRoot)
  .filter((filePath) => {
    const source = readFileSync(
      filePath,
      "utf8",
    );
    const methods = Array.from(
      source.matchAll(
        /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\b/g,
      ),
      (match) => match[1],
    );

    return (
      methods.includes("GET") &&
      methods.some((method) => method !== "GET")
    );
  })
  .map((filePath) =>
    relative(
      process.cwd(),
      filePath,
    ).replaceAll("\\", "/"),
  )
  .sort();

describe("mixed NEXUS API route authority boundary", () => {
  it("allows only the four verified authenticated mixed routes", () => {
    expect(mixedRoutes).toEqual([
      "app/api/nexus/auth/postgres/session/route.ts",
      "app/api/nexus/controlled-pilot-owner-resume-proof/route.ts",
      "app/api/nexus/controlled-pilot-recovery-gate/route.ts",
      "app/api/nexus/founder-emergency/route.ts",
    ]);
  });

  it("keeps PostgreSQL session issue and resolution disabled by default and non-cacheable", () => {
    const source = readRoute(
      "app/api/nexus/auth/postgres/session/route.ts",
    );

    expect(source).toContain(
      "NEXUS_POSTGRES_AUTH_ENABLED",
    );
    expect(source).toContain(
      "NEXUS_POSTGRES_AUTH_STORAGE_MODE",
    );
    expect(source).toContain(
      "issuePostgresAuthenticatedOwnerSession",
    );
    expect(source).toContain(
      "resolvePostgresAuthenticatedOwnerSession",
    );
    expect(source).toContain(
      '"cache-control":',
    );
    expect(source).toContain(
      '"no-store"',
    );
    expect(source).toContain(
      "publicLaunchAuthorized:",
    );
    expect(source).toContain(
      "paymentExecutionAuthorized:",
    );
  });

  it.each([
    "app/api/nexus/controlled-pilot-owner-resume-proof/route.ts",
    "app/api/nexus/controlled-pilot-recovery-gate/route.ts",
  ])(
    "%s requires shared founder authentication and preserves blocked authority",
    (relativePath) => {
      const source = readRoute(relativePath);

      expect(source).toContain(
        "authenticateFounderCommandRequest",
      );
      expect(source).toContain(
        '"no-store"',
      );
      expect(source).toContain(
        "publicLaunchAuthorized:",
      );
      expect(source).toContain(
        "liveProviderExecutionAuthorized:",
      );
      expect(source).not.toMatch(
        /publicLaunchAuthorized:\s*true/,
      );
      expect(source).not.toMatch(
        /liveProviderExecutionAuthorized:\s*true/,
      );
    },
  );

  it("keeps founder emergency operations authenticated, owner-bound, disabled by default, and pause-only", () => {
    const source = readRoute(
      "app/api/nexus/founder-emergency/route.ts",
    );

    expect(source).toContain(
      "NEXUS_FOUNDER_EMERGENCY_OPERATIONS_ENABLED",
    );
    expect(source).toContain(
      "verifyAuthenticatedTenantSessionToken",
    );
    expect(source).toContain(
      "assertActiveSession",
    );
    expect(source).toContain(
      "NEXUS_FOUNDER_EMERGENCY_OWNER_ACTOR_ID",
    );
    expect(source).toContain(
      "pauseFounderEmergencyOperations",
    );
    expect(source).toContain(
      "resumeAuthorized: false",
    );
    expect(source).toContain(
      "liveProviderExecutionAuthorized:",
    );
    expect(source).not.toContain(
      "resumeFounderEmergencyOperations",
    );
  });
});