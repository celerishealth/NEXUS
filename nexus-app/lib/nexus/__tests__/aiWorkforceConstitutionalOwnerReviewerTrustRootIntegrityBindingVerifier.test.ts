import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSource";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import { computeConstitutionalOwnerReviewerTrustRootSnapshotDigest } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSnapshotDigest";
import { verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityBindingVerifier";

const anchor = () => ({
  schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION,
  anchorId: "anchor-1",
  reviewerId: "owner-reviewer-1",
  keyId: "owner-reviewer-key-1",
  algorithm: "Ed25519" as const,
  publicKeyPem: generateKeyPairSync("ed25519").publicKey.export({ type: "spki", format: "pem" }).toString(),
  state: "ACTIVE" as const,
  provenanceSourceId: "owner-anchor-provenance-1",
  integrityState: "VERIFIED" as const,
  provisionDecisionId: "anchor-provision-decision-1",
  provisionedBy: "owner-bootstrap-authority-1",
  activatedAt: "2026-08-23T06:00:00.000Z",
  verifiedAt: "2026-08-23T06:01:00.000Z",
  expiresAt: "2026-08-23T09:00:00.000Z",
});

const fixture = () => {
  const snapshot = {
    sourceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION,
    sourceId: "owner-trust-root-source-1",
    snapshotId: "snapshot-1",
    sequence: 7,
    provenanceSourceId: "owner-controlled-bootstrap-1",
    integrityDigest: "0".repeat(64),
    integrityState: "VERIFIED" as const,
    verifiedAt: "2026-08-23T06:05:00.000Z",
    expiresAt: "2026-08-23T07:05:00.000Z",
    anchors: [anchor()],
  };
  const digest = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(snapshot);
  if (!digest.computedDigest) throw new Error("fixture digest failed");
  const reference = {
    referenceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION,
    referenceId: "integrity-reference-1",
    trustRootSourceId: snapshot.sourceId,
    snapshotId: snapshot.snapshotId,
    sequence: snapshot.sequence,
    expectedDigest: digest.computedDigest,
    provenanceSourceId: "bootstrap-reference-provenance-1",
    referenceState: "VERIFIED" as const,
    establishedAt: "2026-08-23T06:10:00.000Z",
  };
  return { snapshot, reference };
};

describe("constitutional owner reviewer trust-root integrity binding verifier", () => {
  it("proves exact binding and digest equality while keeping integrity untrusted", () => {
    const { snapshot, reference } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding(snapshot, reference);
    expect(value.bindingState).toBe("DIGEST_BINDING_MATCH_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.exactReferenceBindingVerified).toBe(true);
    expect(value.computedDigestMatchedExpectedReference).toBe(true);
    expect(value.snapshotSelfDigestTrusted).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.integrityVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects source, snapshot, or sequence binding mismatch", () => {
    const { snapshot, reference } = fixture();
    expect(verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding(snapshot, { ...reference, trustRootSourceId: "other-source" }).failureCodes).toEqual(["SOURCE_ID_BINDING_MISMATCH"]);
    expect(verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding(snapshot, { ...reference, snapshotId: "other-snapshot" }).failureCodes).toEqual(["SNAPSHOT_ID_BINDING_MISMATCH"]);
    expect(verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding(snapshot, { ...reference, sequence: 8 }).failureCodes).toEqual(["SEQUENCE_BINDING_MISMATCH"]);
  });

  it("rejects tampered bound snapshot content against the independent expected digest", () => {
    const { snapshot, reference } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding({ ...snapshot, provenanceSourceId: "tampered-provenance" }, reference);
    expect(value.bindingState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["EXPECTED_DIGEST_MISMATCH"]);
    expect(value.exactReferenceBindingVerified).toBe(true);
    expect(value.computedDigestMatchedExpectedReference).toBe(false);
    expect(value.integrityVerified).toBe(false);
  });

  it("does not trust the snapshot self-declared integrityDigest", () => {
    const { snapshot, reference } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding({ ...snapshot, integrityDigest: "f".repeat(64) }, reference);
    expect(value.bindingState).toBe("DIGEST_BINDING_MATCH_NO_TRUST");
    expect(value.snapshotSelfDigestTrusted).toBe(false);
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.integrityVerified).toBe(false);
  });

  it("rejects malformed reference candidates before digest comparison", () => {
    const { snapshot, reference } = fixture();
    const value = verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding(snapshot, { ...reference, expectedDigest: "bad" });
    expect(value.bindingState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["REFERENCE_INVALID"]);
    expect(value.computedDigestMatchedExpectedReference).toBe(false);
  });
});