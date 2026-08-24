import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import {
  CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_DOMAIN,
  createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload,
} from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload";

const reference = () => ({
  referenceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION,
  referenceId: "integrity-reference-1",
  trustRootSourceId: "owner-trust-root-source-1",
  snapshotId: "snapshot-7",
  sequence: 7,
  expectedDigest: "a".repeat(64),
  provenanceSourceId: "owner-bootstrap-integrity-source-1",
  referenceState: "VERIFIED" as const,
  establishedAt: "2026-08-23T08:30:00.000Z",
});

const input = () => ({
  reference: reference(),
  provenanceAuthorityId: "owner-provenance-authority-1",
  provenanceKeyId: "owner-provenance-key-1",
  signatureAlgorithm: "Ed25519" as const,
});

describe("constitutional owner reviewer integrity-reference provenance canonical payload", () => {
  it("creates the exact deterministic domain-separated locked payload without proving trust", () => {
    const first = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload(input());
    const second = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload(input());
    expect(first.payloadState).toBe("CANONICAL_PROVENANCE_PAYLOAD_READY_NO_PROOF");
    expect(first.canonicalPayload).toBe(second.canonicalPayload);
    expect(first.canonicalPayload?.startsWith(`${CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_DOMAIN}\n`)).toBe(true);
    const body = first.canonicalPayload!.split("\n").slice(1).join("\n");
    expect(body).toBe(JSON.stringify({
      provenanceAuthorityId: "owner-provenance-authority-1",
      provenanceKeyId: "owner-provenance-key-1",
      signatureAlgorithm: "Ed25519",
      referenceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION,
      referenceId: "integrity-reference-1",
      trustRootSourceId: "owner-trust-root-source-1",
      snapshotId: "snapshot-7",
      sequence: 7,
      expectedDigest: "a".repeat(64),
      provenanceSourceId: "owner-bootstrap-integrity-source-1",
      referenceState: "VERIFIED",
      establishedAt: "2026-08-23T08:30:00.000Z",
    }));
    expect(first.signatureVerified).toBe(false);
    expect(first.provenanceRootTrusted).toBe(false);
    expect(first.referenceProvenanceVerified).toBe(false);
    expect(first.integrityVerified).toBe(false);
    expect(first.runtimeTrustEstablished).toBe(false);
  });

  it("binds authority, key, and complete integrity-reference semantic changes", () => {
    const first = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload(input());
    const authorityChanged = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ ...input(), provenanceAuthorityId: "owner-provenance-authority-2" });
    const keyChanged = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ ...input(), provenanceKeyId: "owner-provenance-key-2" });
    const digestChanged = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ ...input(), reference: { ...reference(), expectedDigest: "b".repeat(64) } });
    expect(authorityChanged.canonicalPayload).not.toBe(first.canonicalPayload);
    expect(keyChanged.canonicalPayload).not.toBe(first.canonicalPayload);
    expect(digestChanged.canonicalPayload).not.toBe(first.canonicalPayload);
  });

  it("rejects invalid reference, provenance bindings, or algorithm", () => {
    const badReference = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ ...input(), reference: { ...reference(), expectedDigest: "bad" } });
    const badBinding = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ ...input(), provenanceAuthorityId: " owner-provenance-authority-1 " });
    const badAlgorithm = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({ ...input(), signatureAlgorithm: "HS256" });
    expect(badReference.failureCodes).toEqual(["REFERENCE_INVALID"]);
    expect(badBinding.failureCodes).toEqual(["PROVENANCE_BINDING_INVALID"]);
    expect(badAlgorithm.failureCodes).toEqual(["ALGORITHM_INVALID"]);
    expect(badAlgorithm.signatureVerified).toBe(false);
    expect(badAlgorithm.referenceProvenanceVerified).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "reference", {
      enumerable: true,
      get() { throw new Error("hostile getter"); },
    });
    const value = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload(hostile);
    expect(value.payloadState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["INPUT_ACCESS_FAILED"]);
    expect(value.canonicalPayload).toBeNull();
    expect(value.provenanceRootTrusted).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});