import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";

export type ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "REFERENCE_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "SEQUENCE_INVALID"
  | "EXPECTED_DIGEST_INVALID"
  | "REFERENCE_STATE_INVALID"
  | "ESTABLISHED_AT_INVALID";

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationResult {
  readonly validationState: "VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationFailureCode[];
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

const makeResult = (
  validationState: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationResult["validationState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationFailureCode[],
): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate(
  candidate: unknown,
): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationResult {
  try {
    if (!isRecord(candidate)) {
      return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    }

    const failures: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidationFailureCode[] = [];

    if (candidate.referenceVersion !== CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION) {
      failures.push("REFERENCE_VERSION_INVALID");
    }

    for (const value of [
      candidate.referenceId,
      candidate.trustRootSourceId,
      candidate.snapshotId,
      candidate.provenanceSourceId,
    ]) {
      if (!isNonEmptyString(value)) {
        failures.push("REQUIRED_BINDING_INVALID");
        break;
      }
    }

    if (!Number.isSafeInteger(candidate.sequence) || Number(candidate.sequence) < 1) {
      failures.push("SEQUENCE_INVALID");
    }

    if (typeof candidate.expectedDigest !== "string" || !/^[a-f0-9]{64}$/.test(candidate.expectedDigest)) {
      failures.push("EXPECTED_DIGEST_INVALID");
    }

    if (!["VERIFIED", "UNVERIFIED"].includes(String(candidate.referenceState))) {
      failures.push("REFERENCE_STATE_INVALID");
    }

    if (typeof candidate.establishedAt !== "string" || !Number.isFinite(Date.parse(candidate.establishedAt))) {
      failures.push("ESTABLISHED_AT_INVALID");
    }

    const uniqueFailures = [...new Set(failures)];
    return uniqueFailures.length > 0
      ? makeResult("REJECTED", uniqueFailures)
      : makeResult("VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}