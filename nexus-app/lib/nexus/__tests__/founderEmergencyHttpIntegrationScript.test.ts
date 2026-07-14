import {
  readFileSync,
} from "node:fs";
import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";

const source =
  readFileSync(
    resolve(
      process.cwd(),
      "scripts/nexus-founder-emergency-http-integration.ts",
    ),
    "utf8",
  );

describe(
  "founder emergency real HTTP integration script",
  () => {
    it(
      "uses temporary SQLite and existing authentication stores",
      () => {
        expect(source).toMatch(
          /mkdtemp\(/,
        );
        expect(source).toMatch(
          /SQLiteAuthenticatedPrincipalStore/,
        );
        expect(source).toMatch(
          /SQLiteAuthenticatedTenantSessionStore/,
        );
        expect(source).toMatch(
          /SQLiteTenantOwnerBootstrapStore/,
        );
        expect(source).toMatch(
          /bootstrapTenantOwner/,
        );
      },
    );

    it(
      "starts a real local Next production server",
      () => {
        expect(source).toMatch(
          /"start"/,
        );
        expect(source).toMatch(
          /"127\.0\.0\.1"/,
        );
        expect(source).toMatch(
          /realNextServerVerified:\s*true/,
        );
      },
    );

    it(
      "stubs only the exact founder emergency RPC contracts locally",
      () => {
        expect(source).toMatch(
          /nexus_read_controlled_pilot_operation_state/,
        );
        expect(source).toMatch(
          /nexus_commit_controlled_pilot_health_pause/,
        );
        expect(source).toMatch(
          /localSupabaseStubVerified:\s*true/,
        );
      },
    );

    it(
      "verifies login status pause final status and replay through HTTP",
      () => {
        expect(source).toMatch(
          /\/api\/nexus\/auth\/session/,
        );
        expect(source).toMatch(
          /\/api\/nexus\/founder-emergency/,
        );
        expect(source).toMatch(
          /pauseStatus,\s*"already-paused"/,
        );
        expect(source).toMatch(
          /getCommitCount\(\),\s*1/,
        );
      },
    );

    it(
      "blocks browser identity override and keeps resume absent",
      () => {
        expect(source).toMatch(
          /"attacker-tenant"/,
        );
        expect(source).toMatch(
          /"attacker-owner"/,
        );
        expect(source).toMatch(
          /RESUME_ENDPOINT_ABSENT/,
        );
        expect(source).toMatch(
          /resumeAttempt\.status,\s*404/,
        );
      },
    );

    it(
      "locks production database deployment execution and resume authority",
      () => {
        expect(source).toMatch(
          /productionDatabaseModified:\s*false/,
        );
        expect(source).toMatch(
          /productionDeploymentModified:\s*false/,
        );
        expect(source).toMatch(
          /liveProviderExecutionAuthorized:\s*false/,
        );
        expect(source).toMatch(
          /resumeAuthorized:\s*false/,
        );
        expect(source).toMatch(
          /rm\(\s*temporaryRoot/,
        );
      },
    );
  },
);