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

const pagePaths = [
  "app/nexus-ppa-inquiry-workflow/page.tsx",
  "app/nexus-ppa-dashboard-validator/page.tsx",
  "app/nexus-ppa-operating-summary/page.tsx",
  "app/nexus-ppa-owner-approval/page.tsx",
  "app/nexus-ppa-pilot-readiness/page.tsx",
  "app/nexus-ppa-quotation-audit/page.tsx",
  "app/nexus-ppa-risk-engine/page.tsx",
] as const;

function readPage(relativePath: string): string {
  return readFileSync(
    join(process.cwd(), relativePath),
    "utf8",
  );
}

describe("PPA static preview page completeness", () => {
  it.each(pagePaths)(
    "%s contains no empty evidence lists",
    (relativePath) => {
      const source = readPage(relativePath);

      expect(source).not.toMatch(
        /<(ul|ol)[^>]*>\s*<\/\1>/i,
      );
    },
  );

  it.each(pagePaths)(
    "%s preserves the controlled internal preview boundary",
    (relativePath) => {
      const source = readPage(relativePath);

      expect(source).toMatch(
        /controlled internal|internal pilot|internal NEXUS/i,
      );
      expect(source).toMatch(
        /public launch/i,
      );
      expect(source).toMatch(
        /unauthorized|blocked|disabled|off/i,
      );
    },
  );

  it.each(pagePaths)(
    "%s remains static and exposes no operational controls",
    (relativePath) => {
      const source = readPage(relativePath);

      expect(source).not.toMatch(
        /["']use client["']/,
      );
      expect(source).not.toMatch(
        /\bfetch\s*\(|\/api\//,
      );
      expect(source).not.toMatch(
        /<form\b|onSubmit=|<button\b/i,
      );
    },
  );

  it("completes the PPA inquiry workflow evidence without enabling execution", () => {
    const source = readPage(
      "app/nexus-ppa-inquiry-workflow/page.tsx",
    );

    expect(source).toMatch(
      /Sample Customer Inquiry[\s\S]*logo projector light[\s\S]*quantity[\s\S]*delivery city/i,
    );
    expect(source).toMatch(
      /Safe NEXUS Draft[\s\S]*draft only[\s\S]*owner review/i,
    );
    expect(source).toMatch(
      /Locked Boundary[\s\S]*public launch[\s\S]*(unauthorized|blocked|disabled)/i,
    );
    expect(source).toMatch(
      /customer contact[\s\S]*(unauthorized|blocked|disabled)/i,
    );
    expect(source).toMatch(
      /payment[\s\S]*(unauthorized|blocked|disabled)/i,
    );
  });});