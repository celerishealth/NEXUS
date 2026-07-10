import assert from "node:assert/strict";
import {
  readFileSync,
} from "node:fs";
import test from "node:test";

import {
  PROTECTED_API_ENVELOPE_VERSION,
  PROTECTED_API_MAXIMUM_CLOCK_SKEW_MS,
  createProtectedApiEnvelopeHeaders,
  getProtectedApiAuthenticationPosture,
  inspectProtectedApiSignedEnvelope,
  resetProtectedApiNonceCacheForTests,
} from "../lib/nexus/protectedApiSignedEnvelope.mjs";

const SECRET =
  "day-669-protected-api-test-secret";

const URL =
  "https://nexus.example/api/nexus/controlled-action-review-console";

const NOW =
  1783680000000;

const ROUTES = [
  "app/api/nexus/owner-authorized-action-admission/route.js",
  "app/api/nexus/provider-independent-recovery-handoff/route.js",
  "app/api/nexus/controlled-execution-intent/route.js",
  "app/api/nexus/dry-run-dispatch-plan/route.js",
  "app/api/nexus/owner-simulation-review/route.js",
  "app/api/nexus/controlled-action-evidence/route.js",
  "app/api/nexus/controlled-action-review-console/route.js",
  "app/api/nexus/protected-api-security-probe/route.js",
];

function createSignedRequest({
  bodyText =
    JSON.stringify({
      actionId: "action-day-669",
    }),
  timestamp = NOW,
  nonce =
    "nonce-day-669-00000001",
  tenantId =
    "tenant-day-669",
  ownerId =
    "owner-day-669",
  secret = SECRET,
  signedUrl = URL,
  requestUrl = URL,
  mutateSignature = false,
  headers: extraHeaders = {},
} = {}) {
  const signedHeaders =
    createProtectedApiEnvelopeHeaders({
      url: signedUrl,
      method: "POST",
      bodyText,
      tenantId,
      ownerId,
      timestamp,
      nonce,
      secret,
      requestId:
        "nexus-request-day-669",
    });

  const headers =
    new Headers({
      ...signedHeaders,
      ...extraHeaders,
    });

  if (mutateSignature) {
    headers.set(
      "x-nexus-signature",
      "0".repeat(64),
    );
  }

  return new Request(requestUrl, {
    method: "POST",
    headers,
    body: bodyText,
  });
}

test.beforeEach(() => {
  resetProtectedApiNonceCacheForTests();
});

test(
  "accepts a valid signed tenant-bound owner-bound request",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, true);

    assert.equal(
      result.authorizationContext
        .tenantId,
      "tenant-day-669",
    );

    assert.equal(
      result.authorizationContext
        .ownerId,
      "owner-day-669",
    );

    assert.equal(
      result.authorizationContext
        .signatureVerified,
      true,
    );

    assert.equal(
      result.authorizationContext
        .bodyIntegrityVerified,
      true,
    );

    assert.equal(
      result.authorizationContext
        .executionAuthorized,
      false,
    );
  },
);

test(
  "blocks a forged signature",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest({
          mutateSignature: true,
        }),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 401);

    assert.equal(
      result.error.errorCode,
      "SIGNED_ENVELOPE_SIGNATURE_INVALID",
    );
  },
);

test(
  "blocks request body modification after signing",
  async () => {
    const originalBody =
      JSON.stringify({
        amount: 1,
      });

    const modifiedBody =
      JSON.stringify({
        amount: 999999,
      });

    const headers =
      createProtectedApiEnvelopeHeaders({
        url: URL,
        method: "POST",
        bodyText: originalBody,
        tenantId:
          "tenant-day-669",
        ownerId:
          "owner-day-669",
        timestamp: NOW,
        nonce:
          "nonce-day-669-body-change",
        secret: SECRET,
      });

    const request =
      new Request(URL, {
        method: "POST",
        headers,
        body: modifiedBody,
      });

    const result =
      await inspectProtectedApiSignedEnvelope(
        request,
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);

    assert.equal(
      result.error.errorCode,
      "SIGNED_ENVELOPE_BODY_DIGEST_MISMATCH",
    );
  },
);

test(
  "blocks an expired signed request",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest({
          timestamp:
            NOW -
            PROTECTED_API_MAXIMUM_CLOCK_SKEW_MS -
            1,
        }),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);

    assert.equal(
      result.error.errorCode,
      "SIGNED_ENVELOPE_EXPIRED",
    );
  },
);

test(
  "blocks a signature created for a different API path",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest({
          signedUrl:
            "https://nexus.example/api/nexus/different-route",
        }),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);

    assert.equal(
      result.error.errorCode,
      "SIGNED_ENVELOPE_SIGNATURE_INVALID",
    );
  },
);

test(
  "blocks a repeated signed nonce in the same protected process",
  async () => {
    const first =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    const second =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(first.ok, true);
    assert.equal(second.ok, false);
    assert.equal(second.status, 409);

    assert.equal(
      second.error.errorCode,
      "SIGNED_ENVELOPE_REPLAY_BLOCKED",
    );
  },
);

test(
  "blocks missing tenant or owner identity",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest({
          ownerId: "",
        }),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);

    assert.equal(
      result.error.errorCode,
      "SIGNED_ENVELOPE_IDENTITY_INVALID",
    );
  },
);

test(
  "fails closed when signing authority is unavailable",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: "",
          nowMs: NOW,
          isProduction: false,
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "SIGNED_ENVELOPE_AUTHORITY_UNAVAILABLE",
    );
  },
);

test(
  "blocks production requests without durable replay authorization",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode: "",
        },
      );

    assert.equal(result.ok, false);
    assert.equal(result.status, 503);

    assert.equal(
      result.error.errorCode,
      "DURABLE_REPLAY_PROTECTION_REQUIRED",
    );
  },
);

test(
  "permits explicitly controlled production preview mode without granting execution",
  async () => {
    const result =
      await inspectProtectedApiSignedEnvelope(
        createSignedRequest(),
        {
          secret: SECRET,
          nowMs: NOW,
          isProduction: true,
          replayMode:
            "process-local-preview",
        },
      );

    assert.equal(result.ok, true);

    assert.equal(
      result.authorizationContext
        .durableReplayPersistenceVerified,
      false,
    );

    assert.equal(
      result.authorizationContext
        .executionAuthorized,
      false,
    );
  },
);

test(
  "keeps every protected POST route behind the signed envelope guard",
  () => {
    for (const route of ROUTES) {
      const content =
        readFileSync(route, "utf8");

      assert.match(
        content,
        /inspectProtectedApiSignedEnvelope/,
        route,
      );

      assert.match(
        content,
        /const signedEnvelopeGuard/,
        route,
      );
    }
  },
);

test(
  "reports honest fail-closed authentication posture",
  () => {
    const posture =
      getProtectedApiAuthenticationPosture();

    assert.equal(
      posture.envelopeVersion,
      PROTECTED_API_ENVELOPE_VERSION,
    );

    assert.equal(
      posture.processLocalReplayProtection,
      true,
    );

    assert.equal(
      posture.durableSharedReplayProtection,
      false,
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
        "BODY_SHA256_INTEGRITY",
      ),
    );

    assert.ok(
      posture.controls.includes(
        "PRODUCTION_FAIL_CLOSED_WITHOUT_DURABLE_REPLAY_MODE",
      ),
    );
  },
);

