import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSource";
import { validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSnapshotValidator";

const publicKeyPem = () => generateKeyPairSync("ed25519").publicKey.export({ type: "spki", format: "pem" }).toString();

const anchor = (anchorId = "anchor-1", keyId = "reviewer-key-1") => ({
  schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION,
  anchorId,
  reviewerId: "owner-reviewer-1",
  keyId,
  algorithm: "Ed25519",
  publicKeyPem: publicKeyPem(),
  state: "ACTIVE",
  provenanceSourceId: "owner-anchor-provenance-1",
  integrityState: "VERIFIED",
  provisionDecisionId: "anchor-provision-decision-1",
  provisionedBy: "owner-bootstrap-authority-1",
  activatedAt: "2026-08-23T06:00:00.000Z",
  verifiedAt: "2026-08-23T06:01:00.000Z",
  expiresAt: "2026-08-23T08:00:00.000Z",
});

const snapshot = () => ({
  sourceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION,
  sourceId: "owner-trust-root-source-1",
  snapshotId: "trust-root-snapshot-1",
  sequence: 1,
  provenanceSourceId: "owner-controlled-bootstrap-1",
  integrityDigest: "a".repeat(64),
  integrityState: "VERIFIED",
  verifiedAt: "2026-08-23T06:05:00.000Z",
  expiresAt: "2026-08-23T07:05:00.000Z",
  anchors: [anchor()],
});

describe("constitutional owner reviewer trust-root snapshot validator", () => {
  it("accepts a coherent snapshot candidate while establishing no trust", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate(snapshot());
    expect(value.validationState).toBe("VALID_TRUST_ROOT_SNAPSHOT_CANDIDATE_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.integrityVerified).toBe(false);
    expect(value.freshnessVerified).toBe(false);
    expect(value.rollbackProtectionVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects malformed sequence, digest, and timestamp ordering", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate({
      ...snapshot(),
      sequence: 0,
      integrityDigest: "bad",
      verifiedAt: "2026-08-23T08:00:00.000Z",
      expiresAt: "2026-08-23T07:00:00.000Z",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "SEQUENCE_INVALID",
      "INTEGRITY_DIGEST_INVALID",
      "TIMESTAMP_ORDER_INVALID",
    ]));
    expect(value.reviewerKeyTrusted).toBe(false);
  });

  it("rejects duplicate anchor or reviewer-key identities", () => {
    const first = anchor("anchor-1", "key-1");
    const value = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate({
      ...snapshot(),
      anchors: [first, { ...first, anchorId: "anchor-2" }],
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toContain("ANCHOR_KEY_ID_DUPLICATE");
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects an invalid nested anchor", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate({
      ...snapshot(),
      anchors: [{ ...anchor(), state: "UNKNOWN" }],
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toContain("ANCHOR_INVALID");
    expect(value.reviewerKeyTrusted).toBe(false);
  });

  it("does not treat caller-asserted VERIFIED integrity as proof", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate({
      ...snapshot(),
      integrityState: "VERIFIED",
    });
    expect(value.validationState).toBe("VALID_TRUST_ROOT_SNAPSHOT_CANDIDATE_NO_TRUST");
    expect(value.integrityVerified).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "sourceVersion", {
      enumerable: true,
      get() { throw new Error("hostile getter"); },
    });
    const value = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });
});