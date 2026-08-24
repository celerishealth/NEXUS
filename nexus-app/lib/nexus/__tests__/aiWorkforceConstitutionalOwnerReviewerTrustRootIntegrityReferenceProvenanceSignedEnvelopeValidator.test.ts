import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelope";
import { validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidator";

const candidate = () => ({
  schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION,
  referenceId: "integrity-reference-1",
  provenanceAuthorityId: "owner-provenance-authority-1",
  provenanceKeyId: "owner-provenance-key-1",
  signatureAlgorithm: "Ed25519" as const,
  signatureBase64Url: randomBytes(64).toString("base64url"),
});

describe("constitutional owner reviewer integrity-reference provenance envelope validator", () => {
  it("accepts a coherent 64-byte Ed25519 envelope without proving signature or trust", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate(candidate());
    expect(value.validationState).toBe("VALID_PROVENANCE_ENVELOPE_CANDIDATE_NO_PROOF");
    expect(value.failureCodes).toEqual([]);
    expect(value.signatureVerified).toBe(false);
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects malformed bindings and wrong algorithm", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate({ ...candidate(), provenanceAuthorityId: " owner-provenance-authority-1 ", signatureAlgorithm: "HS256" });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining(["REQUIRED_BINDING_INVALID", "ALGORITHM_INVALID"]));
    expect(value.signatureVerified).toBe(false);
  });

  it("rejects malformed or wrong-length Base64URL signatures", () => {
    const malformed = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate({ ...candidate(), signatureBase64Url: "not+base64/url" });
    expect(malformed.failureCodes).toContain("SIGNATURE_ENCODING_INVALID");
    const short = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate({ ...candidate(), signatureBase64Url: randomBytes(32).toString("base64url") });
    expect(short.failureCodes).toContain("SIGNATURE_ENCODING_INVALID");
    expect(short.referenceProvenanceVerified).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", { enumerable: true, get() { throw new Error("hostile getter"); } });
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.signatureVerified).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});