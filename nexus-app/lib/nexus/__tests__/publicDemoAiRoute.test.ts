import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  POST,
} from "../../../app/api/ai/route";

function createRequest(
  body: unknown,
): Request {
  return new Request(
    "http://localhost/api/ai",
    {
      method: "POST",
      headers: {
        "content-type":
          "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

async function readJson(
  response: Response,
): Promise<Record<string, unknown>> {
  return await response.json() as
    Record<string, unknown>;
}

describe(
  "public demo AI route",
  () => {
    it(
      "returns a local draft without calling an external provider",
      async () => {
        const fetchSpy = vi.spyOn(
          globalThis,
          "fetch",
        );

        try {
          const response = await POST(
            createRequest({
              prompt:
                "Need 10 safety helmets for delivery tomorrow.",
            }),
          );

          const body = await readJson(
            response,
          );

          expect(fetchSpy).not.toHaveBeenCalled();
          expect(response.status).toBe(200);
          expect(
            response.headers.get(
              "cache-control",
            ),
          ).toBe("no-store, max-age=0");
          expect(body).toMatchObject({
            mode:
              "LOCAL_PUBLIC_DEMO_DRAFT_ONLY",
            externalProviderCalled: false,
            ownerApprovalRequired: true,
          });
          expect(
            String(body.response),
          ).toContain(
            "Owner Approval Required",
          );
        } finally {
          fetchSpy.mockRestore();
        }
      },
    );

    it(
      "preserves message and input request aliases",
      async () => {
        for (const payload of [
          {
            message:
              "Need 5 fire extinguishers.",
          },
          {
            input:
              "Need 4 safety shoes.",
          },
        ]) {
          const response = await POST(
            createRequest(payload),
          );

          const body = await readJson(
            response,
          );

          expect(response.status).toBe(200);
          expect(body.externalProviderCalled).toBe(
            false,
          );
          expect(
            String(body.response),
          ).toContain(
            "Draft Only Mode",
          );
        }
      },
    );

    it(
      "contains no provider credential or outbound fetch capability",
      async () => {
        const source = await readFile(
          resolve(
            process.cwd(),
            "app/api/ai/route.ts",
          ),
          "utf8",
        );

        expect(source).not.toContain(
          "GEMINI_API_KEY",
        );
        expect(source).not.toContain(
          "process.env",
        );
        expect(source).not.toMatch(
          /\bfetch\s*\(/,
        );
      },
    );
    it(
      "rejects unsupported media types",
      async () => {
        const response = await POST(
          new Request(
            "http://localhost/api/ai",
            {
              method: "POST",
              headers: {
                "content-type":
                  "text/plain",
              },
              body: "unsafe",
            },
          ),
        );

        expect(response.status).toBe(415);
        expect(
          response.headers.get(
            "cache-control",
          ),
        ).toBe("no-store, max-age=0");
      },
    );

    it(
      "rejects malformed JSON, invalid shapes, and empty prompts",
      async () => {
        const malformed = await POST(
          new Request(
            "http://localhost/api/ai",
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
              },
              body: "{",
            },
          ),
        );

        const invalidShape = await POST(
          createRequest(null),
        );

        const empty = await POST(
          createRequest({
            prompt: "   ",
          }),
        );

        expect(malformed.status).toBe(400);
        expect(invalidShape.status).toBe(
          400,
        );
        expect(empty.status).toBe(400);
      },
    );

    it(
      "rejects declared and actual oversized request bodies",
      async () => {
        const declared = await POST(
          new Request(
            "http://localhost/api/ai",
            {
              method: "POST",
              headers: {
                "content-type":
                  "application/json",
                "content-length":
                  String(
                    16 * 1024 + 1,
                  ),
              },
              body: JSON.stringify({
                prompt: "safe",
              }),
            },
          ),
        );

        const actual = await POST(
          createRequest({
            prompt:
              "x".repeat(
                16 * 1024,
              ),
          }),
        );

        expect(declared.status).toBe(413);
        expect(actual.status).toBe(413);
      },
    );

    it(
      "rejects prompts beyond the bounded character limit",
      async () => {
        const response = await POST(
          createRequest({
            prompt:
              "x".repeat(8_001),
          }),
        );

        expect(response.status).toBe(413);

        const body = await readJson(
          response,
        );

        expect(body).toMatchObject({
          error:
            "Public demo AI prompt is too long.",
        });
      },
    );
  },
);
