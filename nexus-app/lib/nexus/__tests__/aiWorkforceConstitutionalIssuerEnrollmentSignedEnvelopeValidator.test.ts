import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelope";
import { validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate } from "../aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelopeValidator";

const candidate = () => ({
  schemaVersion: CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION,
  enrollmentEvidenceId: "issuer-enrollment-1",
  enrollmentDecisionId: "enrollment-decision-1",
  reviewerAnchorId: "owner-review-anchor-1",
  reviewerId: "owner-review-identity-1",
  reviewerKeyId: "owner-review-key-1",
  signatureAlgorithm: "Ed25519",
  signatureBase64Url: randomBytes(64).toString("base64url"),
});

describe("constitutional issuer enrollment signed-envelope validator", () => {
  it("accepts a coherent envelope candidate without proving signature or enrollment", () => {
    const value = validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate(candidate());
    expect(value.validationState).toBe("VALID_SIGNED_ENVELOPE_CANDIDATE_NO_PROOF");
    expect(value.failureCodes).toEqual([]);
    expect(value.signatureVerified).toBe(false);
    expect(value.reviewerIdentityVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
  });

  it("rejects malformed signature encoding and wrong algorithm", () => {
    const value = validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate({
      ...candidate(),
      signatureAlgorithm: "HMAC-SHA256",
      signatureBase64Url: "not+base64/url",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "ALGORITHM_INVALID",
      "SIGNATURE_ENCODING_INVALID",
    ]));
    expect(value.signatureVerified).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
  });

  it("rejects a Base64URL signature with the wrong Ed25519 byte length", () => {
    const value = validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate({
      ...candidate(),
      signatureBase64Url: randomBytes(32).toString("base64url"),
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["SIGNATURE_ENCODING_INVALID"]);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });
    const value = validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.signatureVerified).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});