import { createHash } from "node:crypto";
import type { ConstitutionalOwnerReviewerTrustAnchorCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import type { ConstitutionalOwnerReviewerTrustRootSnapshotCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootSource";
import { validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootSnapshotValidator";

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SNAPSHOT_DOMAIN =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SNAPSHOT_V1" as const;

export type ConstitutionalOwnerReviewerTrustRootSnapshotDigestFailureCode =
  | "SNAPSHOT_INVALID"
  | "SNAPSHOT_ACCESS_FAILED";

export interface ConstitutionalOwnerReviewerTrustRootSnapshotDigestResult {
  readonly digestState: "DIGEST_COMPUTED_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootSnapshotDigestFailureCode[];
  readonly canonicalPayload: string | null;
  readonly computedDigest: string | null;
  readonly integrityVerified: false;
  readonly freshnessVerified: false;
  readonly rollbackProtectionVerified: false;
  readonly reviewerKeyTrusted: false;
  readonly runtimeTrustEstablished: false;
  readonly issuerTrustEstablished: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly publicLaunchAuthorized: false;
}

const result = (
  digestState: ConstitutionalOwnerReviewerTrustRootSnapshotDigestResult["digestState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustRootSnapshotDigestFailureCode[],
  canonicalPayload: string | null,
  computedDigest: string | null,
): ConstitutionalOwnerReviewerTrustRootSnapshotDigestResult => Object.freeze({
  digestState,
  failureCodes: Object.freeze([...failureCodes]),
  canonicalPayload,
  computedDigest,
  integrityVerified: false as const,
  freshnessVerified: false as const,
  rollbackProtectionVerified: false as const,
  reviewerKeyTrusted: false as const,
  runtimeTrustEstablished: false as const,
  issuerTrustEstablished: false as const,
  constitutionalExecutionAuthorityGranted: false as const,
  publicLaunchAuthorized: false as const,
});

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const canonicalAnchor = (anchor: ConstitutionalOwnerReviewerTrustAnchorCandidate) => ({
  schemaVersion: anchor.schemaVersion,
  anchorId: anchor.anchorId,
  reviewerId: anchor.reviewerId,
  keyId: anchor.keyId,
  algorithm: anchor.algorithm,
  publicKeyPem: anchor.publicKeyPem,
  state: anchor.state,
  provenanceSourceId: anchor.provenanceSourceId,
  integrityState: anchor.integrityState,
  provisionDecisionId: anchor.provisionDecisionId,
  provisionedBy: anchor.provisionedBy,
  activatedAt: anchor.activatedAt,
  verifiedAt: anchor.verifiedAt,
  expiresAt: anchor.expiresAt,
  rotationOfKeyId: anchor.rotationOfKeyId ?? null,
});

export function computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(
  input: unknown,
): ConstitutionalOwnerReviewerTrustRootSnapshotDigestResult {
  try {
    const validation = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate(input);
    if (validation.validationState !== "VALID_TRUST_ROOT_SNAPSHOT_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["SNAPSHOT_INVALID"], null, null);
    }

    const snapshot = input as ConstitutionalOwnerReviewerTrustRootSnapshotCandidate;
    const anchors = [...snapshot.anchors]
      .sort((left, right) =>
        compareText(left.anchorId, right.anchorId) ||
        compareText(left.keyId, right.keyId) ||
        compareText(left.reviewerId, right.reviewerId),
      )
      .map(canonicalAnchor);

    const body = JSON.stringify({
      sourceVersion: snapshot.sourceVersion,
      sourceId: snapshot.sourceId,
      snapshotId: snapshot.snapshotId,
      sequence: snapshot.sequence,
      provenanceSourceId: snapshot.provenanceSourceId,
      integrityState: snapshot.integrityState,
      verifiedAt: snapshot.verifiedAt,
      expiresAt: snapshot.expiresAt,
      anchors,
    });

    const canonicalPayload =
      `${CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SNAPSHOT_DOMAIN}\n${body}`;
    const computedDigest = createHash("sha256")
      .update(canonicalPayload, "utf8")
      .digest("hex");

    return result("DIGEST_COMPUTED_NO_TRUST", [], canonicalPayload, computedDigest);
  } catch {
    return result("REJECTED", ["SNAPSHOT_ACCESS_FAILED"], null, null);
  }
}