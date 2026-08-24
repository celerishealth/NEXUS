import { generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import { CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRoot";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelope";
import { createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload";
import { verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519 } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519Verifier";

const fixture = () => {
  const pair = generateKeyPairSync("ed25519");
  const reference = {
    referenceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION,
    referenceId: "integrity-reference-1",
    trustRootSourceId: "owner-trust-root-source-1",
    snapshotId: "snapshot-7",
    sequence: 7,
    expectedDigest: "a".repeat(64),
    provenanceSourceId: "owner-bootstrap-integrity-source-1",
    referenceState: "VERIFIED" as const,
    establishedAt: "2026-08-23T08:30:00.000Z",
  };
  const root = {
    rootVersion: CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION,
    rootId: "provenance-root-1",
    authorityId: "owner-provenance-authority-1",
    keyId: "owner-provenance-key-1",
    algorithm: "Ed25519" as const,
    publicKeyPem: pair.publicKey.export({ type: "spki", format: "pem" }).toString().trim(),
    state: "ACTIVE" as const,
    provenanceSourceId: "owner-bootstrap-provenance-source-1",
    integrityState: "VERIFIED" as const,
    provisionDecisionId: "provenance-root-provision-decision-1",
    provisionedBy: "owner-bootstrap-authority-1",
    activatedAt: "2026-08-23T08:00:00.000Z",
    verifiedAt: "2026-08-23T08:01:00.000Z",
    expiresAt: "2027-08-23T08:01:00.000Z",
  };
  const payload = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({
    reference,
    provenanceAuthorityId: root.authorityId,
    provenanceKeyId: root.keyId,
    signatureAlgorithm: "Ed25519",
  });
  if (!payload.canonicalPayload) throw new Error("fixture canonical payload failed");
  const envelope = {
    schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION,
    referenceId: reference.referenceId,
    provenanceAuthorityId: root.authorityId,
    provenanceKeyId: root.keyId,
    signatureAlgorithm: "Ed25519" as const,
    signatureBase64Url: sign(null, Buffer.from(payload.canonicalPayload, "utf8"), pair.privateKey).toString("base64url"),
  };
  return { pair, reference, root, envelope };
};

describe("constitutional owner reviewer integrity-reference provenance Ed25519 verifier", () => {
  it("proves cryptographic signature possession and exact bindings without trusting the provenance root", () => {
    const { reference, root, envelope } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(reference, envelope, root);
    expect(value.proofState).toBe("CRYPTOGRAPHIC_PROVENANCE_SIGNATURE_VALID_NO_ROOT_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.exactReferenceBindingMatched).toBe(true);
    expect(value.exactAuthorityBindingMatched).toBe(true);
    expect(value.exactKeyBindingMatched).toBe(true);
    expect(value.rootCandidateStateActive).toBe(true);
    expect(value.cryptographicSignatureValid).toBe(true);
    expect(value.signatureVerified).toBe(true);
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.provenanceRootFreshnessVerified).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.integrityVerified).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects tampered integrity-reference content despite a previously valid signature", () => {
    const { reference, root, envelope } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519({ ...reference, expectedDigest: "b".repeat(64) }, envelope, root);
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["SIGNATURE_INVALID"]);
    expect(value.cryptographicSignatureValid).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
  });

  it("fails closed on reference, authority, and key binding mismatch", () => {
    const { reference, root, envelope } = fixture();
    expect(verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(reference, { ...envelope, referenceId: "other-reference" }, root).failureCodes).toEqual(["REFERENCE_ID_BINDING_MISMATCH"]);
    expect(verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(reference, { ...envelope, provenanceAuthorityId: "other-authority" }, root).failureCodes).toEqual(["AUTHORITY_ID_BINDING_MISMATCH"]);
    expect(verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(reference, { ...envelope, provenanceKeyId: "other-key" }, root).failureCodes).toEqual(["KEY_ID_BINDING_MISMATCH"]);
  });

  it("rejects a disabled provenance-root candidate even when the signature is cryptographically valid", () => {
    const { reference, root, envelope } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(reference, envelope, { ...root, state: "DISABLED" as const });
    expect(value.proofState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["PROVENANCE_ROOT_NOT_ACTIVE"]);
    expect(value.cryptographicSignatureValid).toBe(false);
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
  });

  it("rejects a signature produced by a different Ed25519 private key", () => {
    const { reference, root, envelope } = fixture();
    const other = generateKeyPairSync("ed25519");
    const payload = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ reference, provenanceAuthorityId: root.authorityId, provenanceKeyId: root.keyId, signatureAlgorithm: "Ed25519" });
    if (!payload.canonicalPayload) throw new Error("fixture canonical payload failed");
    const wrongEnvelope = { ...envelope, signatureBase64Url: sign(null, Buffer.from(payload.canonicalPayload, "utf8"), other.privateKey).toString("base64url") };
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(reference, wrongEnvelope, root);
    expect(value.failureCodes).toEqual(["SIGNATURE_INVALID"]);
    expect(value.signatureVerified).toBe(false);
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});