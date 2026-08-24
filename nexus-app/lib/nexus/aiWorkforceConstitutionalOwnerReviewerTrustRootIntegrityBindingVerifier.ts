import type { ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import { validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidator";
import type { ConstitutionalOwnerReviewerTrustRootSnapshotCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootSource";
import { validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootSnapshotValidator";
import { computeConstitutionalOwnerReviewerTrustRootSnapshotDigest } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootSnapshotDigest";

export type ConstitutionalOwnerReviewerTrustRootIntegrityBindingFailureCode =
  | "SNAPSHOT_INVALID"
  | "REFERENCE_INVALID"
  | "SOURCE_ID_BINDING_MISMATCH"
  | "SNAPSHOT_ID_BINDING_MISMATCH"
  | "SEQUENCE_BINDING_MISMATCH"
  | "SNAPSHOT_DIGEST_COMPUTATION_FAILED"
  | "EXPECTED_DIGEST_MISMATCH"
  | "INPUT_ACCESS_FAILED";

export interface ConstitutionalOwnerReviewerTrustRootIntegrityBindingVerificationResult {
  readonly bindingState: "DIGEST_BINDING_MATCH_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityBindingFailureCode[];
  readonly exactReferenceBindingVerified: boolean;
  readonly computedDigestMatchedExpectedReference: boolean;
  readonly snapshotSelfDigestTrusted: false;
  readonly referenceProvenanceVerified: false;
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

const result = (
  bindingState: ConstitutionalOwnerReviewerTrustRootIntegrityBindingVerificationResult["bindingState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityBindingFailureCode[],
  exactReferenceBindingVerified = false,
  computedDigestMatchedExpectedReference = false,
): ConstitutionalOwnerReviewerTrustRootIntegrityBindingVerificationResult => Object.freeze({
  bindingState,
  failureCodes: Object.freeze([...failureCodes]),
  exactReferenceBindingVerified,
  computedDigestMatchedExpectedReference,
  snapshotSelfDigestTrusted: false as const,
  referenceProvenanceVerified: false as const,
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

/**
 * Proves only exact reference binding plus recomputed SHA-256 equality against
 * the supplied bootstrap-reference candidate. The reference provenance is not
 * independently trusted here, so successful equality cannot establish trust.
 */
export function verifyConstitutionalOwnerReviewerTrustRootIntegrityBinding(
  snapshotInput: unknown,
  referenceInput: unknown,
): ConstitutionalOwnerReviewerTrustRootIntegrityBindingVerificationResult {
  try {
    const snapshotValidation = validateConstitutionalOwnerReviewerTrustRootSnapshotCandidate(snapshotInput);
    if (snapshotValidation.validationState !== "VALID_TRUST_ROOT_SNAPSHOT_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["SNAPSHOT_INVALID"]);
    }

    const referenceValidation = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate(referenceInput);
    if (referenceValidation.validationState !== "VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["REFERENCE_INVALID"]);
    }

    const snapshot = snapshotInput as ConstitutionalOwnerReviewerTrustRootSnapshotCandidate;
    const reference = referenceInput as ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate;

    if (reference.trustRootSourceId !== snapshot.sourceId) {
      return result("REJECTED", ["SOURCE_ID_BINDING_MISMATCH"]);
    }

    if (reference.snapshotId !== snapshot.snapshotId) {
      return result("REJECTED", ["SNAPSHOT_ID_BINDING_MISMATCH"]);
    }

    if (reference.sequence !== snapshot.sequence) {
      return result("REJECTED", ["SEQUENCE_BINDING_MISMATCH"]);
    }

    const digest = computeConstitutionalOwnerReviewerTrustRootSnapshotDigest(snapshot);
    if (digest.digestState !== "DIGEST_COMPUTED_NO_TRUST" || !digest.computedDigest) {
      return result("REJECTED", ["SNAPSHOT_DIGEST_COMPUTATION_FAILED"], true, false);
    }

    if (digest.computedDigest !== reference.expectedDigest) {
      return result("REJECTED", ["EXPECTED_DIGEST_MISMATCH"], true, false);
    }

    return result("DIGEST_BINDING_MATCH_NO_TRUST", [], true, true);
  } catch {
    return result("REJECTED", ["INPUT_ACCESS_FAILED"]);
  }
}