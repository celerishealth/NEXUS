import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerEnrollmentEvidence";
import { createConstitutionalIssuerEnrollmentCanonicalPayload } from "../aiWorkforceConstitutionalIssuerEnrollmentCanonicalPayload";
import { CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelope";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import { verifyConstitutionalIssuerEnrollmentProof } from "../aiWorkforceConstitutionalIssuerEnrollmentProofVerifier";

const fixture = () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const enrollment = {
    schemaVersion: CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION,
    enrollmentEvidenceId: "issuer-enrollment-1",
    issuerId: "issuer-1",
    producerComponentId: "constitutional-evidence-producer-1",
    producerIdentityEvidenceDigest: "a".repeat(64),
    trustBindingId: "binding-1",
    keyId: "issuer-key-1",
    requestedActionClasses: ["INQUIRY_CREATE"],
    requestedCapabilities: ["CREATE_INQUIRY"],
    evidenceAuthorityPurpose: "constitutional-evidence-only",
    enrollmentDecisionId: "enrollment-decision-1",
    enrolledBy: "owner-review-identity-1",
    provenanceSourceId: "owner-controlled-enrollment-source-1",
    integrityState: "VERIFIED",
    enrolledAt: "2026-08-23T05:30:00.000Z",
  };
  const canonical = createConstitutionalIssuerEnrollmentCanonicalPayload(enrollment);
  if (!canonical.canonicalPayload) throw new Error("fixture canonicalization failed");
  const anchor = {
    schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION,
    anchorId: "owner-review-anchor-1",
    reviewerId: "owner-review-identity-1",
    keyId: "owner-review-key-1",
    algorithm: "Ed25519",
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
    state: "ACTIVE",
    provenanceSourceId: "owner-controlled-anchor-source-1",
    integrityState: "VERIFIED",
    provisionDecisionId: "anchor-provision-decision-1",
    provisionedBy: "owner-bootstrap-authority-1",
    activatedAt: "2026-08-23T05:00:00.000Z",
    verifiedAt: "2026-08-23T05:01:00.000Z",
    expiresAt: "2026-08-23T06:30:00.000Z",
  };
  const envelope = {
    schemaVersion: CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION,
    enrollmentEvidenceId: enrollment.enrollmentEvidenceId,
    enrollmentDecisionId: enrollment.enrollmentDecisionId,
    reviewerAnchorId: anchor.anchorId,
    reviewerId: anchor.reviewerId,
    reviewerKeyId: anchor.keyId,
    signatureAlgorithm: "Ed25519",
    signatureBase64Url: sign(null, Buffer.from(canonical.canonicalPayload, "utf8"), privateKey).toString("base64url"),
  };
  return { enrollment, envelope, anchor };
};

describe("constitutional issuer enrollment proof verifier", () => {
  it("verifies exact binding and signature while keeping reviewer key and issuer untrusted", () => {
    const { enrollment, envelope, anchor } = fixture();
    const value = verifyConstitutionalIssuerEnrollmentProof(enrollment, envelope, anchor);
    expect(value.proofState).toBe("CRYPTOGRAPHIC_ENROLLMENT_PROOF_VALID_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.exactBindingVerified).toBe(true);
    expect(value.signatureVerified).toBe(true);
    expect(value.reviewerIdentityVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
    expect(value.keyActivated).toBe(false);
    expect(value.constitutionalExecutionAuthorityGranted).toBe(false);
  });

  it("rejects reviewer identity mismatch before cryptographic proof can create trust", () => {
    const { enrollment, envelope, anchor } = fixture();
    const value = verifyConstitutionalIssuerEnrollmentProof(enrollment, { ...envelope, reviewerId: "different-reviewer" }, anchor);
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["REVIEWER_IDENTITY_BINDING_MISMATCH"]);
    expect(value.signatureVerified).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
  });

  it("rejects reviewer key binding mismatch", () => {
    const { enrollment, envelope, anchor } = fixture();
    const value = verifyConstitutionalIssuerEnrollmentProof(enrollment, { ...envelope, reviewerKeyId: "different-key" }, anchor);
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["REVIEWER_KEY_BINDING_MISMATCH"]);
    expect(value.reviewerKeyTrusted).toBe(false);
  });

  it("rejects enrollment evidence tampered after signature", () => {
    const { enrollment, envelope, anchor } = fixture();
    const value = verifyConstitutionalIssuerEnrollmentProof({ ...enrollment, requestedCapabilities: ["CREATE_INQUIRY", "CREATE_QUOTATION"] }, envelope, anchor);
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CRYPTOGRAPHIC_VERIFICATION_FAILED"]);
    expect(value.exactBindingVerified).toBe(true);
    expect(value.signatureVerified).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
  });

  it("rejects a revoked reviewer anchor even when its key can verify the signature", () => {
    const { enrollment, envelope, anchor } = fixture();
    const value = verifyConstitutionalIssuerEnrollmentProof(enrollment, envelope, { ...anchor, state: "REVOKED" });
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["REVIEWER_ANCHOR_NOT_ACTIVE_OR_VERIFIED"]);
    expect(value.signatureVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
  });

  it("fails closed when an untrusted input getter throws", () => {
    const { envelope, anchor } = fixture();
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() { throw new Error("hostile getter"); },
    });
    const value = verifyConstitutionalIssuerEnrollmentProof(hostile, envelope, anchor);
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["ENROLLMENT_EVIDENCE_INVALID"]);
    expect(value.signatureVerified).toBe(false);
    expect(value.issuerEnrolled).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});