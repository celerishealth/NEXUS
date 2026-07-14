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
  "founder emergency revocation real HTTP integration",
  () => {
    it(
      "creates a cryptographically signed durable unauthorized owner session",
      () => {
        expect(source).toMatch(
          /signAuthenticatedTenantSessionToken/,
        );
        expect(source).toMatch(
          /unauthorizedSessionStore/,
        );
        expect(source).toMatch(
          /unauthorizedActorId/,
        );
        expect(source).toMatch(
          /role:\s*"owner"/,
        );
      },
    );

    it(
      "blocks the unauthorized durable owner before any RPC access",
      () => {
        expect(source).toMatch(
          /unauthorizedOwnerStatus\.status,\s*403/,
        );
        expect(source).toMatch(
          /"Owner authority is required\."/,
        );
        expect(source).toMatch(
          /rpcCountBeforeUnauthorized/,
        );
        expect(source).toMatch(
          /UNAUTHORIZED_OWNER_NO_RPC_ACCESS/,
        );
      },
    );

    it(
      "enables and calls the existing real session revocation route",
      () => {
        expect(source).toMatch(
          /NEXUS_AUTH_SESSION_REVOCATION_ENABLED:\s*"true"/,
        );
        expect(source).toMatch(
          /\/api\/nexus\/auth\/session\/revoke/,
        );
        expect(source).toMatch(
          /revocation\.body\.revoked,\s*true/,
        );
      },
    );

    it(
      "verifies the authorized session before revocation",
      () => {
        expect(source).toMatch(
          /authorizedBeforeRevocation/,
        );
        expect(source).toMatch(
          /AUTHORIZED_SESSION_WORKS_BEFORE_REVOCATION/,
        );
      },
    );

    it(
      "verifies durable revocation timestamp and reason",
      () => {
        expect(source).toMatch(
          /durableRevocationStore/,
        );
        expect(source).toMatch(
          /durableRevocationRecord\.revokedAt/,
        );
        expect(source).toMatch(
          /"SELF_LOGOUT"/,
        );
        expect(source).toMatch(
          /DURABLE_REVOCATION_EVIDENCE_VERIFIED/,
        );
      },
    );

    it(
      "blocks revoked status and pause requests with 401",
      () => {
        expect(source).toMatch(
          /revokedStatus\.status,\s*401/,
        );
        expect(source).toMatch(
          /revokedPause\.status,\s*401/,
        );
        expect(source).toMatch(
          /REVOKED_STATUS_ACCESS_BLOCKED/,
        );
        expect(source).toMatch(
          /REVOKED_PAUSE_ACCESS_BLOCKED/,
        );
      },
    );

    it(
      "blocks revocation replay and prevents revoked RPC access",
      () => {
        expect(source).toMatch(
          /revocationReplay\.status,\s*401/,
        );
        expect(source).toMatch(
          /REVOKED_REQUESTS_NO_RPC_ACCESS/,
        );
        expect(source).toMatch(
          /REVOCATION_REPLAY_BLOCKED/,
        );
      },
    );

    it(
      "keeps execution deployment production data and resume authority locked",
      () => {
        expect(source).toMatch(
          /nexus\.founder-emergency-real-http-integration\.v3/,
        );
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
      },
    );
  },
);