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

describe("public Supabase health response redaction", () => {
  const healthRoute = read(
    "app/api/nexus/supabase-health/route.ts",
  );
  const readinessRoute = read(
    "app/api/nexus/supabase-integration-readiness/route.ts",
  );

  it("keeps both public routes read-only and uncached", () => {
    for (const route of [
      healthRoute,
      readinessRoute,
    ]) {
      expect(route).toMatch(
        /export\s+async\s+function\s+GET/,
      );
      expect(route).not.toMatch(
        /export\s+async\s+function\s+(POST|PUT|PATCH|DELETE)/,
      );
      expect(route).toMatch(
        /Cache-Control[\s\S]{0,100}no-store/,
      );
    }
  });

  it("does not return per-key configuration checks", () => {
    expect(healthRoute).not.toMatch(
      /\bchecks\s*:\s*result\.checks/,
    );
    expect(readinessRoute).not.toMatch(
      /\bchecks\s*:\s*result\.checks/,
    );
  });

  it("does not return missing environment-key names", () => {
    expect(healthRoute).not.toMatch(
      /missingRequiredKeys\s*:\s*result\.missingRequiredKeys/,
    );
    expect(readinessRoute).not.toMatch(
      /missingRequiredConfiguration\s*:\s*result\.missingRequiredConfiguration/,
    );
  });

  it("never exposes privileged configuration identifiers", () => {
    for (const route of [
      healthRoute,
      readinessRoute,
    ]) {
      expect(route).not.toMatch(
        /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_DATABASE_URL/,
      );
      expect(route).not.toMatch(
        /NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY/,
      );
    }
  });

  it("returns only bounded readiness and safety evidence", () => {
    expect(healthRoute).toMatch(
      /status:\s*result\.status/,
    );
    expect(healthRoute).toMatch(
      /readyForBaseClient:\s*[\s\S]{0,80}result\.readyForBaseClient/,
    );
    expect(healthRoute).toMatch(
      /secretValuesExposed:\s*[\s\S]{0,80}result\.secretValuesExposed/,
    );
    expect(healthRoute).toMatch(
      /databaseConnectionAttempted:\s*[\s\S]{0,80}result\.databaseConnectionAttempted/,
    );
    expect(readinessRoute).toMatch(
      /ready:\s*result\.ready/,
    );
    expect(readinessRoute).toMatch(
      /lockedBoundaries:\s*[\s\S]{0,80}result\.lockedBoundaries/,
    );
  });
});