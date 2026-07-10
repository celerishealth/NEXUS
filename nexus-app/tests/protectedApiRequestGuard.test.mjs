import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  PROTECTED_API_MAX_BODY_BYTES,
  getProtectedApiSecurityPosture,
  inspectProtectedApiRequest,
} from "../lib/nexus/protectedApiRequestGuard.mjs";

const ROUTES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
  "app/api/nexus/protected-api-security-probe/route.js",
  "app/api/nexus/controlled-action-state/route.js",
];

function createRequest({
  method = "POST",
  body = "{}",
  contentType = "application/json",
  origin,
  fetchSite,
  requestId,
  contentLength,
  url =
    "https://nexus.example/api/nexus/protected",
} = {}) {
  const headers =
    new Headers();

  if (contentType) {
    headers.set(
      "content-type",
      contentType,
    );
  }

  if (origin) {
    headers.set("origin", origin);
  }

  if (fetchSite) {
    headers.set(
      "sec-fetch-site",
      fetchSite,
    );
  }

  if (requestId) {
    headers.set(
      "x-nexus-request-id",
      requestId,
    );
  }

  if (
    contentLength !== undefined
  ) {
    headers.set(
      "content-length",
      String(contentLength),
    );
  }

  return new Request(url, {
    method,
    headers,
    body:
      method === "GET"
        ? undefined
        : body,
  });
}

test(
  "accepts a valid same-origin JSON object request",
  async () => {
    const request = createRequest({
      body:
        JSON.stringify({
          actionId: "action-668",
        }),
      origin:
        "https://nexus.example",
      fetchSite: "same-origin",
      requestId:
        "nexus-request-668",
    });

    const result =
      await inspectProtectedApiRequest(
        request,
      );

    assert.equal(result.ok, true);
    assert.equal(
      result.requestId,
      "nexus-request-668",
    );
    assert.ok(
      result.bodyByteLength > 0,
    );
  },
);

test(
  "rejects non-POST requests",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          method: "GET",
        }),
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 405);
    assert.equal(
      result.error.errorCode,
      "PROTECTED_REQUEST_METHOD_NOT_ALLOWED",
    );
  },
);

test(
  "rejects non-JSON content types",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          contentType: "text/plain",
        }),
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 415);
    assert.equal(
      result.error.errorCode,
      "PROTECTED_REQUEST_JSON_REQUIRED",
    );
  },
);

test(
  "rejects malformed JSON",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          body: '{"broken":',
        }),
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.equal(
      result.error.errorCode,
      "PROTECTED_REQUEST_JSON_INVALID",
    );
  },
);

test(
  "rejects a top-level JSON array",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          body: "[]",
        }),
      );

    assert.equal(result.ok, false);
    assert.equal(
      result.error.errorCode,
      "PROTECTED_REQUEST_OBJECT_REQUIRED",
    );
  },
);

test(
  "rejects an oversized declared body",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          contentLength:
            PROTECTED_API_MAX_BODY_BYTES +
            1,
        }),
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 413);
    assert.equal(
      result.error.errorCode,
      "PROTECTED_REQUEST_TOO_LARGE",
    );
  },
);

test(
  "rejects an oversized actual UTF-8 body",
  async () => {
    const body = JSON.stringify({
      value: "x".repeat(
        PROTECTED_API_MAX_BODY_BYTES,
      ),
    });

    const result =
      await inspectProtectedApiRequest(
        createRequest({ body }),
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 413);
  },
);

test(
  "blocks untrusted cross-origin browser requests",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          origin:
            "https://attacker.example",
          fetchSite: "cross-site",
        }),
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(
      result.error.errorCode,
      "PROTECTED_REQUEST_ORIGIN_BLOCKED",
    );
  },
);

test(
  "accepts an explicitly allowlisted origin",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          origin:
            "https://trusted.example",
          fetchSite: "same-site",
        }),
        {
          allowedOrigins: new Set([
            "https://trusted.example",
          ]),
        },
      );

    assert.equal(result.ok, true);
  },
);

test(
  "generates a safe request identifier when supplied value is invalid",
  async () => {
    const result =
      await inspectProtectedApiRequest(
        createRequest({
          requestId: "bad",
        }),
      );

    assert.equal(result.ok, true);
    assert.match(
      result.requestId,
      /^nexus-[0-9a-f-]{36}$/,
    );
  },
);

test(
  "keeps every protected POST route behind the shared guard",
  () => {
    for (const route of ROUTES) {
      const content =
        readFileSync(route, "utf8");

      assert.match(
        content,
        /inspectProtectedApiRequest/,
        route,
      );

      assert.match(
        content,
        /const requestGuard/,
        route,
      );
    }
  },
);

test(
  "reports the locked protected API security posture",
  () => {
    const posture =
      getProtectedApiSecurityPosture();

    assert.equal(
      posture.maximumBodyBytes,
      65536,
    );

    assert.equal(
      posture.realExecutionAuthorized,
      false,
    );

    assert.equal(
      posture.providerInvocationAuthorized,
      false,
    );

    assert.equal(
      posture.persistenceAuthorized,
      false,
    );

    assert.ok(
      posture.controls.includes(
        "ACTUAL_UTF8_BODY_SIZE_VALIDATION",
      ),
    );

    assert.ok(
      posture.controls.includes(
        "CROSS_SITE_BROWSER_REQUEST_BLOCKING",
      ),
    );
  },
);


