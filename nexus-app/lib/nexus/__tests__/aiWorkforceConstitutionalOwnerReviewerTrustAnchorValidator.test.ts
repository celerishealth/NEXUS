import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import { validateConstitutionalOwnerReviewerTrustAnchorCandidate } from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchorValidator";

const publicKeyPem = () => {
  const { publicKey } = generateKeyPairSync("ed25519");
  return publicKey.export({ type: "spki", format: "pem" }).toString();
};

const candidate = () => ({
  schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION,
  anchorId: "owner-review-anchor-1",
  reviewerId: "owner-review-identity-1",
  keyId: "owner-review-key-1",
  algorithm: "Ed25519",
  publicKeyPem: publicKeyPem(),
  state: "ACTIVE",
  provenanceSourceId: "owner-controlled-anchor-source-1",
  integrityState: "VERIFIED",
  provisionDecisionId: "anchor-provision-decision-1",
  provisionedBy: "owner-bootstrap-authority-1",
  activatedAt: "2026-08-23T05:00:00.000Z",
  verifiedAt: "2026-08-23T05:01:00.000Z",
  expiresAt: "2026-08-23T06:00:00.000Z",
});

describe("constitutional owner reviewer trust-anchor validator", () => {
  it("accepts a coherent Ed25519 anchor candidate without establishing trust", () => {
    const value = validateConstitutionalOwnerReviewerTrustAnchorCandidate(candidate());
    expect(value.validationState).toBe("VALID_ANCHOR_CANDIDATE_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
    expect(value.constitutionalExecutionAuthorityGranted).toBe(false);
  });

  it("rejects malformed or unsupported public-key material", () => {
    const value = validateConstitutionalOwnerReviewerTrustAnchorCandidate({
      ...candidate(),
      publicKeyPem: "-----BEGIN PUBLIC KEY-----\\nAAAA\\n-----END PUBLIC KEY-----",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toContain("PUBLIC_KEY_INVALID_OR_UNSUPPORTED");
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects bad state, integrity state, and timestamp ordering", () => {
    const value = validateConstitutionalOwnerReviewerTrustAnchorCandidate({
      ...candidate(),
      state: "MAGIC_ACTIVE",
      integrityState: "MAGIC_VERIFIED",
      verifiedAt: "2026-08-23T07:00:00.000Z",
      expiresAt: "2026-08-23T06:00:00.000Z",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "ANCHOR_STATE_INVALID",
      "INTEGRITY_STATE_INVALID",
      "TIMESTAMP_ORDER_INVALID",
    ]));
    expect(value.issuerTrustEstablished).toBe(false);
  });

  it("fails closed when an untrusted candidate getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });
    const value = validateConstitutionalOwnerReviewerTrustAnchorCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});