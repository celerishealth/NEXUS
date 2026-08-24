import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSource";
import {
  CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SNAPSHOT_DOMAIN,
  computeConstitutionalOwnerReviewerTrustRootSnapshotDigest,
} from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSnapshotDigest";

const makeAnchor = (anchorId: string, reviewerId: string, keyId: string) => ({
  schemaVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION,
  anchorId,
  reviewerId,
  keyId,
  algorithm: "Ed25519" as const,
  publicKeyPem: generateKeyPairSync("ed25519").publicKey.export({ type: "spki", format: "pem" }).toString(),
  state: "ACTIVE" as const,
  provenanceSourceId: `provenance-${anchorId}`,
  integrityState: "VERIFIED" as const,
  provisionDecisionId: `decision-${anchorId}`,
  provisionedBy: "owner-bootstrap-authority-1",
  activatedAt: "2026-08-23T06:00:00.000Z",
  verifiedAt: "2026-08-23T06:01:00.000Z",
  expiresAt: "2026-08-23T09:00:00.000Z",
});

const makeSnapshot = () => {
  const first = makeAnchor("anchor-b", "reviewer-b", "key-b");
  const second = makeAnchor("anchor-a", "reviewer-a", "key-a");
  return {
    sourceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION,
    sourceId: "owner-trust-root-source-1",
    snapshotId: "snapshot-1",
    sequence: 1,
    provenanceSourceId: "owner-controlled-bootstrap-1",
    integrityDigest: "0".repeat(64),
    integrityState: "VERIFIED" as const,
    verifiedAt: "2026-08-23T06:05:00.000Z",
    expiresAt: "2026-08-23T07:05:00.000Z",
    anchors: [first, second],
  };
};

describe("constitutional owner reviewer trust-root snapshot digest", () => {
  it("computes a domain-separated lowercase SHA-256 digest without establishing trust", () => {
    const value = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(makeSnapshot());
    expect(value.digestState).toBe("DIGEST_COMPUTED_NO_TRUST");
    expect(value.canonicalPayload?.startsWith(`${CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SNAPSHOT_DOMAIN}\n`)).toBe(true);
    expect(value.computedDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(value.integrityVerified).toBe(false);
    expect(value.freshnessVerified).toBe(false);
    expect(value.rollbackProtectionVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("excludes integrityDigest itself from canonical content", () => {
    const snapshot = makeSnapshot();
    const first = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(snapshot);
    const second = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest({ ...snapshot, integrityDigest: "f".repeat(64) });
    expect(first.digestState).toBe("DIGEST_COMPUTED_NO_TRUST");
    expect(second.digestState).toBe("DIGEST_COMPUTED_NO_TRUST");
    expect(second.canonicalPayload).toBe(first.canonicalPayload);
    expect(second.computedDigest).toBe(first.computedDigest);
  });

  it("canonicalizes the same logical anchor set independently of input array order", () => {
    const snapshot = makeSnapshot();
    const first = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(snapshot);
    const second = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest({ ...snapshot, anchors: [...snapshot.anchors].reverse() });
    expect(second.canonicalPayload).toBe(first.canonicalPayload);
    expect(second.computedDigest).toBe(first.computedDigest);
  });

  it("changes the digest when a bound snapshot field changes", () => {
    const snapshot = makeSnapshot();
    const first = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(snapshot);
    const second = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest({ ...snapshot, sequence: 2 });
    expect(first.digestState).toBe("DIGEST_COMPUTED_NO_TRUST");
    expect(second.digestState).toBe("DIGEST_COMPUTED_NO_TRUST");
    expect(second.computedDigest).not.toBe(first.computedDigest);
    expect(second.integrityVerified).toBe(false);
  });
});