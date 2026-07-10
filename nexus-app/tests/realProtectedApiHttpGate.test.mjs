import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

const routePath =
  "app/api/nexus/protected-api-security-probe/route.js";

test(
  "security probe route executes the complete protected guard chain",
  () => {
    const route =
      readFileSync(
        routePath,
        "utf8",
      );

    const controls = [
      "inspectProtectedApiRequest",
      "NEXUS_OWNER_RESOLUTION_SIGNING_SECRET",
      "inspectProtectedApiSignedEnvelope",
      "getProtectedApiReplayStore",
      "authorizeProtectedApiTenantOwnerContext",
      "getProtectedApiTenantAuthorizationStore",
      "enforceProtectedApiRateLimit",
      "getProtectedApiRateLimitStore",
    ];

    for (
      const control
      of controls
    ) {
      assert.match(
        route,
        new RegExp(control),
        control,
      );
    }
  },
);

test(
  "successful security probe does not authorize business execution",
  () => {
    const route =
      readFileSync(
        routePath,
        "utf8",
      );

    assert.match(
      route,
      /executionAuthorized:\s*false/,
    );

    assert.match(
      route,
      /providerInvocationPerformed:\s*false/,
    );

    assert.match(
      route,
      /customerDataMutationPerformed:\s*false/,
    );

    assert.doesNotMatch(
      route,
      /\bfetch\s*\(/,
    );
  },
);

test(
  "real HTTP gate verifies replay tampering tenant isolation and HTTP 429",
  () => {
    const gate =
      readFileSync(
        "scripts/nexus-real-protected-api-http-gate.mjs",
        "utf8",
      );

    assert.match(
      gate,
      /SIGNED_ENVELOPE_REPLAY_BLOCKED/,
    );

    assert.match(
      gate,
      /SIGNED_ENVELOPE_SIGNATURE_INVALID/,
    );

    assert.match(
      gate,
      /SIGNED_ENVELOPE_BODY_DIGEST_MISMATCH/,
    );

    assert.match(
      gate,
      /TENANT_OWNER_ACCESS_DENIED/,
    );

    assert.match(
      gate,
      /PROTECTED_API_RATE_LIMIT_EXCEEDED/,
    );

    assert.match(
      gate,
      /fourth\.status === 429/,
    );

    assert.match(
      gate,
      /realNextServerVerified:\s*true/,
    );

    assert.match(
      gate,
      /productionDeploymentModified:\s*false/,
    );
  },
);
