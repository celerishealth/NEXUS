import {
  describe,
  expect,
  it,
} from "vitest";

import nextConfig from "../../../next.config";

describe("global Next.js security headers", () => {
  it("applies the bounded browser security baseline to every route", async () => {
    expect(nextConfig.headers).toBeTypeOf("function");

    const rules = await nextConfig.headers?.();

    expect(rules).toEqual([
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]);
  });

  it("does not introduce a global CSP or cache policy without compatibility evidence", async () => {
    const rules = await nextConfig.headers?.();
    const headerNames = rules
      ?.flatMap((rule) => rule.headers)
      .map((header) => header.key.toLowerCase()) ?? [];

    expect(headerNames).not.toContain(
      "content-security-policy",
    );
    expect(headerNames).not.toContain(
      "cache-control",
    );
    expect(headerNames).not.toContain(
      "strict-transport-security",
    );
  });
});