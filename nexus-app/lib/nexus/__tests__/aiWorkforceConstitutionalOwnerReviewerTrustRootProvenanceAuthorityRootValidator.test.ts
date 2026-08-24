import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRoot";
import { validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRootValidator";

const publicKeyPem = () => generateKeyPairSync("ed25519").publicKey.export({ type: "spki", format: "pem" }).toString().trim();

const candidate = () => ({
  rootVersion: CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION,
  rootId: "provenance-root-1",
  authorityId: "owner-provenance-authority-1",
  keyId: "owner-provenance-key-1",
  algorithm: "Ed25519" as const,
  publicKeyPem: publicKeyPem(),
  state: "ACTIVE" as const,
  provenanceSourceId: "owner-bootstrap-provenance-source-1",
  integrityState: "VERIFIED" as const,
  provisionDecisionId: "provenance-root-provision-decision-1",
  provisionedBy: "owner-bootstrap-authority-1",
  activatedAt: "2026-08-23T08:00:00.000Z",
  verifiedAt: "2026-08-23T08:01:00.000Z",
  expiresAt: "2027-08-23T08:01:00.000Z",
});

describe("constitutional owner reviewer provenance-authority root validator", () => {
  it("accepts a coherent Ed25519 root candidate without establishing trust", () => {
    const value = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate(candidate());
    expect(value.validationState).toBe("VALID_PROVENANCE_ROOT_CANDIDATE_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.integrityVerified).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects malformed binding, algorithm, and lifecycle state", () => {
    const value = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate({
      ...candidate(),
      authorityId: "  ",
      algorithm: "HS256",
      state: "UNKNOWN",
      integrityState: "TRUSTED",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "ROOT_BINDING_INVALID",
      "ALGORITHM_INVALID",
      "ROOT_STATE_INVALID",
      "INTEGRITY_STATE_INVALID",
    ]));
    expect(value.provenanceRootTrusted).toBe(false);
  });

  it("rejects non-Ed25519 or malformed public verification material", () => {
    const malformed = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate({
      ...candidate(),
      publicKeyPem: "-----BEGIN PUBLIC KEY-----bad-----END PUBLIC KEY-----",
    });
    expect(malformed.validationState).toBe("REJECTED");
    expect(malformed.failureCodes).toContain("PUBLIC_KEY_MATERIAL_INVALID");
    const rsaPem = generateKeyPairSync("rsa", { modulusLength: 2048 }).publicKey.export({ type: "spki", format: "pem" }).toString().trim();
    const wrongType = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate({ ...candidate(), publicKeyPem: rsaPem });
    expect(wrongType.validationState).toBe("REJECTED");
    expect(wrongType.failureCodes).toContain("PUBLIC_KEY_INVALID_OR_UNSUPPORTED");
  });

  it("requires canonical timestamps and valid lifecycle ordering", () => {
    const invalid = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate({
      ...candidate(),
      activatedAt: "2026-08-23T08:02:00.000Z",
      verifiedAt: "2026-08-23T08:01:00.000Z",
    });
    expect(invalid.validationState).toBe("REJECTED");
    expect(invalid.failureCodes).toContain("TIMESTAMP_ORDER_INVALID");
    const nonCanonical = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate({
      ...candidate(),
      verifiedAt: "2026-08-23T08:01:00Z",
    });
    expect(nonCanonical.failureCodes).toContain("TIMESTAMP_INVALID");
  });

  it("rejects rotation self-reference", () => {
    const value = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate({
      ...candidate(),
      rotationOfKeyId: "owner-provenance-key-1",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toContain("ROTATION_SELF_REFERENCE");
    expect(value.referenceProvenanceVerified).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "rootVersion", {
      enumerable: true,
      get() { throw new Error("hostile getter"); },
    });
    const value = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });
});