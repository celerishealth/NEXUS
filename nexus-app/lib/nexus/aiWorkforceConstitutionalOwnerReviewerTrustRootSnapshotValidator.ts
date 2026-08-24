import { validateConstitutionalOwnerReviewerTrustAnchorCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustAnchorValidator";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootSource";

export type ConstitutionalOwnerReviewerTrustRootSnapshotValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "SOURCE_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "SEQUENCE_INVALID"
  | "INTEGRITY_DIGEST_INVALID"
  | "INTEGRITY_STATE_INVALID"
  | "TIMESTAMP_INVALID"
  | "TIMESTAMP_ORDER_INVALID"
  | "ANCHORS_INVALID"
  | "ANCHOR_INVALID"
  | "ANCHOR_ID_DUPLICATE"
  | "ANCHOR_KEY_ID_DUPLICATE";

export interface ConstitutionalOwnerReviewerTrustRootSnapshotValidationResult {
  readonly validationState: "VALID_TRUST_ROOT_SNAPSHOT_CANDIDATE_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootSnapshotValidationFailureCode[];
  readonly integrityVerified: false;
  readonly freshnessVerified: false;
  readonly rollbackProtectionVerified: false;
  readonly reviewerKeyTrusted: false;
  readonly runtimeTrustEstablished: false;
  readonly issuerTrustEstablished: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const makeResult = (
  validationState: ConstitutionalOwnerReviewerTrustRootSnapshotValidationResult["validationState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustRootSnapshotValidationFailureCode[],
): ConstitutionalOwnerReviewerTrustRootSnapshotValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
  integrityVerified: false as const,
  freshnessVerified: false as const,
  rollbackProtectionVerified: false as const,
  reviewerKeyTrusted: false as const,
  runtimeTrustEstablished: false as const,
  issuerTrustEstablished: false as const,
  admissionProjectionAuthorized: false as const,
  constitutionalExecutionAuthorityGranted: false as const,
  providerExecutionAuthorized: false as const,
  paymentExecutionAuthorized: false as const,
  legalFilingAuthorized: false as const,
  externalDeliveryAuthorized: false as const,
  publicLaunchAuthorized: false as const,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate(
  candidate: unknown,
): ConstitutionalOwnerReviewerTrustRootSnapshotValidationResult {
  try {
    if (!isRecord(candidate)) {
      return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    }

    const failures: ConstitutionalOwnerReviewerTrustRootSnapshotValidationFailureCode[] = [];

    if (candidate.sourceVersion !== CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION) {
      failures.push("SOURCE_VERSION_INVALID");
    }

    for (const value of [candidate.sourceId, candidate.snapshotId, candidate.provenanceSourceId]) {
      if (!isNonEmptyString(value)) {
        failures.push("REQUIRED_BINDING_INVALID");
        break;
      }
    }

    if (!Number.isSafeInteger(candidate.sequence) || Number(candidate.sequence) < 1) {
      failures.push("SEQUENCE_INVALID");
    }

    if (typeof candidate.integrityDigest !== "string" || !/^[a-f0-9]{64}$/.test(candidate.integrityDigest)) {
      failures.push("INTEGRITY_DIGEST_INVALID");
    }

    if (!["VERIFIED", "UNVERIFIED"].includes(String(candidate.integrityState))) {
      failures.push("INTEGRITY_STATE_INVALID");
    }

    const verifiedAt = Date.parse(String(candidate.verifiedAt));
    const expiresAt = Date.parse(String(candidate.expiresAt));
    if (![verifiedAt, expiresAt].every(Number.isFinite)) {
      failures.push("TIMESTAMP_INVALID");
    } else if (verifiedAt >= expiresAt) {
      failures.push("TIMESTAMP_ORDER_INVALID");
    }

    if (!Array.isArray(candidate.anchors) || candidate.anchors.length === 0) {
      failures.push("ANCHORS_INVALID");
    } else {
      const anchorIds = new Set<string>();
      const keyIds = new Set<string>();
      for (const anchor of candidate.anchors) {
        const validation = validateConstitutionalOwnerReviewerTrustAnchorCandidate(anchor);
        if (validation.validationState !== "VALID_ANCHOR_CANDIDATE_NO_TRUST") {
          failures.push("ANCHOR_INVALID");
          continue;
        }
        const anchorRecord = anchor as Record<string, unknown>;
        const anchorId = String(anchorRecord.anchorId);
        const keyId = String(anchorRecord.keyId);
        if (anchorIds.has(anchorId)) failures.push("ANCHOR_ID_DUPLICATE");
        else anchorIds.add(anchorId);
        if (keyIds.has(keyId)) failures.push("ANCHOR_KEY_ID_DUPLICATE");
        else keyIds.add(keyId);
      }
    }

    const uniqueFailures = [...new Set(failures)];
    return uniqueFailures.length > 0
      ? makeResult("REJECTED", uniqueFailures)
      : makeResult("VALID_TRUST_ROOT_SNAPSHOT_CANDIDATE_NO_TRUST", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}