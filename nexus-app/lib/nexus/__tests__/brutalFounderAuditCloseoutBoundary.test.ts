import {
  existsSync,
  readFileSync,
  readdirSync,
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

function collectRouteFiles(
  directory: string,
): string[] {
  const absoluteDirectory = join(
    process.cwd(),
    directory,
  );

  return readdirSync(
    absoluteDirectory,
    {
      withFileTypes: true,
    },
  ).flatMap((entry) => {
    const relativePath = join(
      directory,
      entry.name,
    );

    if (entry.isDirectory()) {
      return collectRouteFiles(relativePath);
    }

    return entry.isFile() &&
      entry.name === "route.ts"
      ? [relativePath.replaceAll("\\", "/")]
      : [];
  });
}

function exportedMethods(
  source: string,
): string[] {
  return [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ].filter((method) =>
    new RegExp(
      `export\\s+async\\s+function\\s+${method}\\b`,
    ).test(source),
  );
}

describe("Brutal Founder Audit closeout boundary", () => {
  it("keeps the root page as thin server orchestration", () => {
    const root = read("app/page.tsx");

    expect(root.trimEnd().split(/\r?\n/)).toHaveLength(62);
    expect(root).not.toMatch(/"use client"/);
    expect(root).not.toMatch(
      /useState\s*\(|fetch\s*\(|\/api\/|window\./,
    );
  });

  it("keeps Founder Command authenticated, memory-only, and read-only", () => {
    const page = read(
      "app/nexus-founder-command/page.tsx",
    );
    const dashboard = read(
      "components/nexus/NexusFounderCommandDashboard.tsx",
    );

    expect(page).toMatch(
      /NexusFounderCommandDashboard/,
    );
    expect(dashboard).toMatch(
      /issueFounderEmergencySession/,
    );
    expect(dashboard).toMatch(/accessToken/);
    expect(dashboard).toMatch(
      /revokeFounderEmergencySession/,
    );
    expect(dashboard).not.toMatch(
      /localStorage|sessionStorage|document\.cookie/,
    );
    expect(dashboard).not.toMatch(
      /<button[^>]*>[^<]*(execute|resume|send|pay|launch|approve)/i,
    );
  });

  it("keeps every PPA page server-static and non-operational", () => {
    const appDirectory = join(
      process.cwd(),
      "app",
    );
    const ppaPages = readdirSync(
      appDirectory,
      {
        withFileTypes: true,
      },
    )
      .filter(
        (entry) =>
          entry.isDirectory() &&
          entry.name.startsWith("nexus-ppa-"),
      )
      .map((entry) =>
        join(
          "app",
          entry.name,
          "page.tsx",
        ),
      )
      .filter((path) =>
        existsSync(join(process.cwd(), path)),
      );

    expect(ppaPages).toHaveLength(13);

    for (const path of ppaPages) {
      const source = read(path);

      expect(source).not.toMatch(/"use client"/);
      expect(source).not.toMatch(/fetch\s*\(/);
      expect(source).not.toMatch(/<form\b/);
      expect(source).not.toMatch(/<button\b/);
      expect(source).not.toMatch(/\/api\//);
      expect(source).toMatch(
        /preview|internal/i,
      );
      expect(source).toMatch(
        /blocked|unauthorized|disabled/i,
      );
    }
  });

  it("locks the exact non-GET and mixed-method API inventories", () => {
    const routes = collectRouteFiles(
      "app/api/nexus",
    );

    const nonGetRoutes = routes
      .map((path) => ({
        path,
        methods: exportedMethods(read(path)),
      }))
      .filter(({ methods }) =>
        methods.some((method) => method !== "GET"),
      );

    expect(
      nonGetRoutes.map(({ path }) => path).sort(),
    ).toEqual([
      "app/api/nexus/auth/password/change/route.ts",
      "app/api/nexus/auth/postgres/credential/activate/route.ts",
      "app/api/nexus/auth/postgres/session/revoke/route.ts",
      "app/api/nexus/auth/postgres/session/route.ts",
      "app/api/nexus/auth/session/revoke/route.ts",
      "app/api/nexus/auth/session/route.ts",
      "app/api/nexus/controlled-pilot-owner-resume-proof/route.ts",
      "app/api/nexus/controlled-pilot-recovery-gate/route.ts",
      "app/api/nexus/customer-vertical-slice/command/route.ts",
      "app/api/nexus/founder-emergency/route.ts",
      "app/api/nexus/internal/controlled-actions/route.ts",
      "app/api/nexus/onboarding/tenant/route.ts",
    ]);

    expect(
      nonGetRoutes
        .filter(({ methods }) => methods.length > 1)
        .map(({ path }) => path)
        .sort(),
    ).toEqual([
      "app/api/nexus/auth/postgres/session/route.ts",
      "app/api/nexus/controlled-pilot-owner-resume-proof/route.ts",
      "app/api/nexus/controlled-pilot-recovery-gate/route.ts",
      "app/api/nexus/founder-emergency/route.ts",
    ]);
  });

  it("keeps all non-GET routes behind authentication or bounded sandbox authority", () => {
    const routes = collectRouteFiles(
      "app/api/nexus",
    );

    for (const path of routes) {
      const source = read(path);
      const methods = exportedMethods(source);

      if (
        !methods.some((method) => method !== "GET")
      ) {
        continue;
      }

      expect(source).toMatch(
        /authenticateFounderCommandRequest|verifyAuthenticatedTenantSessionToken|loadSession|authorization|Bearer|customerVerticalSliceLocalSandbox|handleCustomerVerticalSliceHttpRequest/,
      );
      expect(source).toMatch(
        /cache-control[\s\S]{0,220}no-store/i,
      );
    }
  });

  it("keeps the bounded global guard design explicit", () => {
    for (const path of [
      "middleware.ts",
      "src/middleware.ts",
      "proxy.ts",
      "src/proxy.ts",
    ]) {
      expect(
        existsSync(join(process.cwd(), path)),
      ).toBe(false);
    }

    const config = read("next.config.ts");

    expect(config).toMatch(
      /X-Content-Type-Options/,
    );
    expect(config).toMatch(/Referrer-Policy/);
    expect(config).toMatch(/X-Frame-Options/);
    expect(config).toMatch(/Permissions-Policy/);
  });

  it("preserves blocked external authority across closeout evidence", () => {
    const evidence = [
      read(
        "lib/nexus/customerVerticalSliceLocalSandboxStatus.ts",
      ),
      read(
        "app/api/nexus/supabase-health/route.ts",
      ),
      read(
        "app/api/nexus/supabase-integration-readiness/route.ts",
      ),
      read(
        "components/nexus/NexusFounderCommandDashboard.tsx",
      ),
    ].join("\n");

    expect(evidence).not.toMatch(
      /publicLaunchAuthorized:\s*true/,
    );
    expect(evidence).not.toMatch(
      /paymentExecutionAuthorized:\s*true/,
    );
    expect(evidence).not.toMatch(
      /liveProviderExecutionAuthorized:\s*true/,
    );
    expect(evidence).not.toMatch(
      /externalDeliveryAuthorized:\s*true/,
    );
  });
});