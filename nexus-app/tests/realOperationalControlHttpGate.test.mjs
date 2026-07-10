import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

test(
  "real HTTP operational gate verifies tenant and global emergency stops",
  () => {
    const gate =
      readFileSync(
        "scripts/nexus-real-operational-control-http-gate.mjs",
        "utf8",
      );

    assert.match(
      gate,
      /TENANT_EMERGENCY_STOP/,
    );

    assert.match(
      gate,
      /GLOBAL_EMERGENCY_MAINTENANCE/,
    );

    assert.match(
      gate,
      /PROTECTED_API_OPERATIONALLY_BLOCKED/,
    );

    assert.match(
      gate,
      /tenantOpened\.status ===\s*200/,
    );

    assert.match(
      gate,
      /globalBlocked\.status ===\s*503/,
    );

    assert.match(
      gate,
      /realNextServerVerified:\s*true/,
    );

    assert.match(
      gate,
      /productionDatabaseModified:\s*false/,
    );
  },
);

test(
  "security probe exposes operational verification without execution authority",
  () => {
    const route =
      readFileSync(
        "app/api/nexus/protected-api-security-probe/route.js",
        "utf8",
      );

    assert.match(
      route,
      /operationalControlVerified/,
    );

    assert.match(
      route,
      /operationalSecurityEventRecorded/,
    );

    assert.match(
      route,
      /executionAuthorized:\s*false/,
    );
  },
);
