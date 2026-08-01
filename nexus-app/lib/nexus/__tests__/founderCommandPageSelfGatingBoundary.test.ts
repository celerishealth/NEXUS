import {
  existsSync,
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

describe("founder command page self-gating boundary", () => {
  const page = read(
    "app/nexus-founder-command/page.tsx",
  );
  const dashboard = read(
    "components/nexus/NexusFounderCommandDashboard.tsx",
  );
  const snapshotClient = read(
    "lib/nexus/founderCommandSnapshotClient.ts",
  );
  const emergencyClient = read(
    "lib/nexus/founderEmergencyClient.ts",
  );

  it("keeps global middleware or proxy absent by deliberate bounded design", () => {
    expect(
      existsSync(join(process.cwd(), "middleware.ts")),
    ).toBe(false);
    expect(
      existsSync(join(process.cwd(), "src/middleware.ts")),
    ).toBe(false);
    expect(
      existsSync(join(process.cwd(), "proxy.ts")),
    ).toBe(false);
    expect(
      existsSync(join(process.cwd(), "src/proxy.ts")),
    ).toBe(false);
  });

  it("renders no founder data outside the authenticated client dashboard", () => {
    expect(page).toMatch(
      /<NexusFounderCommandDashboard\s*\/>/,
    );
    expect(page).not.toMatch(
      /\bfetch\s*\(|authorization|Bearer|accessToken/,
    );
  });

  it("requires explicit founder authentication before loading snapshots", () => {
    expect(dashboard).toMatch(
      /issueFounderEmergencySession/,
    );
    expect(dashboard).toMatch(
      /issuedSession\.accessToken/,
    );
    expect(dashboard).toMatch(
      /readFounderCommandSnapshot/,
    );
    expect(snapshotClient).toMatch(
      /authorization:\s*`Bearer \$\{accessToken\}`/,
    );
  });

  it("keeps the browser session in component memory only", () => {
    expect(dashboard).toMatch(
      /useState<FounderEmergencySession \| null>/,
    );
    expect(dashboard).not.toMatch(
      /localStorage|sessionStorage|document\.cookie/i,
    );
    expect(dashboard).toMatch(
      /setSession\(null\)/,
    );
    expect(dashboard).toMatch(
      /setPassword\(""\)/,
    );
  });

  it("revokes logout and preserves read-only authority", () => {
    expect(dashboard).toMatch(
      /revokeFounderEmergencySession/,
    );
    expect(dashboard).toMatch(
      /No execution or resume action was performed/,
    );
    expect(emergencyClient).toMatch(
      /method:\s*"POST"/,
    );
    expect(dashboard).toMatch(
      /Customer contact[\s\S]*payments[\s\S]*public launch remain unauthorized/i,
    );
  });
});