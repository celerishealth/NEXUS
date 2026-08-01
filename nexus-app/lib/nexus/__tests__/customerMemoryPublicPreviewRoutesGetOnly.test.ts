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

const publicPreviewRoutes = [
  "app/api/nexus/customer-memory-architecture-checkpoint/route.ts",
  "app/api/nexus/customer-memory-audit-event-contract/route.ts",
  "app/api/nexus/customer-memory-audit-event-validator/route.ts",
  "app/api/nexus/customer-memory-context-assembly-validator/route.ts",
  "app/api/nexus/customer-memory-context-injection-contract/route.ts",
  "app/api/nexus/customer-memory-context-injection-validator/route.ts",
  "app/api/nexus/customer-memory-final-response-safety-gate/route.ts",
  "app/api/nexus/customer-memory-full-pipeline-preview-orchestrator/route.ts",
  "app/api/nexus/customer-memory-owner-review-contract/route.ts",
  "app/api/nexus/customer-memory-owner-review-validator/route.ts",
  "app/api/nexus/customer-memory-pipeline-summary-dashboard/route.ts",
  "app/api/nexus/customer-memory-prompt-context-contract/route.ts",
  "app/api/nexus/customer-memory-prompt-context-validator/route.ts",
  "app/api/nexus/customer-memory-recovery-fallback-contract/route.ts",
  "app/api/nexus/customer-memory-recovery-fallback-validator/route.ts",
  "app/api/nexus/customer-memory-response-draft-contract/route.ts",
  "app/api/nexus/customer-memory-response-draft-validator/route.ts",
] as const;

function readSource(relativePath: string): string {
  return readFileSync(
    join(
      process.cwd(),
      relativePath,
    ),
    "utf8",
  );
}

describe("customer-memory public preview route boundary", () => {
  it.each(publicPreviewRoutes)(
    "%s exposes only the synthetic GET preview",
    (relativePath) => {
      const source = readSource(relativePath);

      expect(source).toMatch(
        /export\s+async\s+function\s+GET\b/,
      );
      expect(source).not.toMatch(
        /export\s+async\s+function\s+POST\b/,
      );
      expect(source).not.toMatch(
        /\bNextRequest\b/,
      );
      expect(source).toMatch(
        /method:\s*"GET"/,
      );
    },
  );

  it("keeps the root evidence panel static and non-calling", () => {
    const source = readSource(
      "components/nexus/NexusRootStaticEvidencePanels.tsx",
    );

    expect(source).not.toMatch(
      /\bfetch\s*\(/,
    );
    expect(source).not.toMatch(
      /["']use client["']/,
    );
  });
});