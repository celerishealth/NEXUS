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
  "founder emergency real browser E2E integration",
  () => {
    it(
      "launches a real local Chromium executable through playwright-core",
      () => {
        expect(source).toMatch(
          /from "playwright-core"/,
        );
        expect(source).toMatch(
          /NEXUS_LOCAL_BROWSER_EXECUTABLE/,
        );
        expect(source).toMatch(
          /chromium\.launch/,
        );
      },
    );

    it(
      "renders the real Next page and locates the founder control",
      () => {
        expect(source).toMatch(
          /browserPage\.goto/,
        );
        expect(source).toMatch(
          /Founder Emergency Pause/,
        );
        expect(source).toMatch(
          /Workspace ID/,
        );
      },
    );

    it(
      "performs owner login and verifies active state in the browser",
      () => {
        expect(source).toMatch(
          /Authenticate and verify status/,
        );
        expect(source).toMatch(
          /Authenticated founder emergency status verified\./,
        );
        expect(source).toMatch(
          /"ACTIVE"/,
        );
      },
    );

    it(
      "requires explicit confirmation and verifies one atomic pause",
      () => {
        expect(source).toMatch(
          /Open emergency-pause confirmation/,
        );
        expect(source).toMatch(
          /Confirm emergency pause/,
        );
        expect(source).toMatch(
          /browserCommitCount,\s*1/,
        );
        expect(source).toMatch(
          /"PAUSED"/,
        );
      },
    );

    it(
      "performs authenticated logout and verifies the locked browser state",
      () => {
        expect(source).toMatch(
          /Log out and revoke session/,
        );
        expect(source).toMatch(
          /Authenticated logout verified\./,
        );
        expect(source).toMatch(
          /postLogoutRefreshCount/,
        );
        expect(source).toMatch(
          /postLogoutPauseCount/,
        );
      },
    );

    it(
      "keeps RPC identity live execution production data and resume locked",
      () => {
        expect(source).toMatch(
          /REAL_BROWSER_RPC_IDENTITY_AUTHENTICATED/,
        );
        expect(source).toMatch(
          /REAL_BROWSER_RESUME_CONTROL_ABSENT/,
        );
        expect(source).toMatch(
          /productionDatabaseModified:\s*false/,
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