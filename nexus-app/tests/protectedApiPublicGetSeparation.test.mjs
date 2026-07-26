import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const protectedPostOnlyRoutes = [
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
  "app/api/nexus/controlled-action-state/route.js",
  "app/api/nexus/protected-api-security-probe/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
];

const requiredPostSecurityControls = [
  "inspectProtectedApiRequest",
  "inspectProtectedApiSignedEnvelope",
  "getProtectedApiReplayStore",
  "authorizeProtectedApiTenantOwnerContext",
  "enforceProtectedApiOperationalControl",
  "enforceProtectedApiRateLimit",
];

test(
  "protected diagnostic routes expose POST only and preserve the complete security chain",
  () => {
    for (const routePath of protectedPostOnlyRoutes) {
      const source = readFileSync(routePath, "utf8");

      assert.doesNotMatch(
        source,
        /export\s+async\s+function\s+GET\s*\(/,
        `${routePath} must not expose a public GET handler.`,
      );

      assert.match(
        source,
        /export\s+async\s+function\s+POST\s*\(/,
        `${routePath} must retain its protected POST handler.`,
      );

      for (const control of requiredPostSecurityControls) {
        assert.ok(
          source.includes(control),
          `${routePath} must retain ${control}.`,
        );
      }
    }
  },
);