import { CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION } from "./aiWorkforceConstitutionalIssuerEnrollmentEvidence";

export type ConstitutionalIssuerEnrollmentEvidenceValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "SCHEMA_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "IDENTITY_EVIDENCE_DIGEST_INVALID"
  | "SCOPE_INVALID"
  | "INTEGRITY_STATE_INVALID"
  | "TIMESTAMP_INVALID";

export interface ConstitutionalIssuerEnrollmentEvidenceValidationResult {
  readonly validationState: "VALID_ENROLLMENT_EVIDENCE_CANDIDATE_NO_ENROLLMENT" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerEnrollmentEvidenceValidationFailureCode[];
  readonly issuerEnrolled: false;
  readonly runtimeTrustEstablished: false;
  readonly issuerTrustEstablished: false;
  readonly keyActivated: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const makeResult = (
  validationState: ConstitutionalIssuerEnrollmentEvidenceValidationResult["validationState"],
  failureCodes: readonly ConstitutionalIssuerEnrollmentEvidenceValidationFailureCode[],
): ConstitutionalIssuerEnrollmentEvidenceValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
  issuerEnrolled: false as const,
  runtimeTrustEstablished: false as const,
  issuerTrustEstablished: false as const,
  keyActivated: false as const,
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

const isValidScope = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(isNonEmptyString) &&
  new Set(value.map((entry) => entry.trim())).size === value.length;

export function validateConstitutionalIssuerEnrollmentEvidenceCandidate(
  candidate: unknown,
): ConstitutionalIssuerEnrollmentEvidenceValidationResult {
  try {
    if (!isRecord(candidate)) {
      return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    }

    const failures: ConstitutionalIssuerEnrollmentEvidenceValidationFailureCode[] = [];

    if (candidate.schemaVersion !== CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION) {
      failures.push("SCHEMA_VERSION_INVALID");
    }

    for (const value of [
      candidate.enrollmentEvidenceId,
      candidate.issuerId,
      candidate.producerComponentId,
      candidate.trustBindingId,
      candidate.keyId,
      candidate.evidenceAuthorityPurpose,
      candidate.enrollmentDecisionId,
      candidate.enrolledBy,
      candidate.provenanceSourceId,
    ]) {
      if (!isNonEmptyString(value)) {
        failures.push("REQUIRED_BINDING_INVALID");
        break;
      }
    }

    if (
      typeof candidate.producerIdentityEvidenceDigest !== "string" ||
      !/^[a-f0-9]{64}$/.test(candidate.producerIdentityEvidenceDigest)
    ) {
      failures.push("IDENTITY_EVIDENCE_DIGEST_INVALID");
    }

    if (
      !isValidScope(candidate.requestedActionClasses) ||
      !isValidScope(candidate.requestedCapabilities)
    ) {
      failures.push("SCOPE_INVALID");
    }

    if (!["VERIFIED", "UNVERIFIED"].includes(String(candidate.integrityState))) {
      failures.push("INTEGRITY_STATE_INVALID");
    }

    if (
      typeof candidate.enrolledAt !== "string" ||
      !Number.isFinite(Date.parse(candidate.enrolledAt))
    ) {
      failures.push("TIMESTAMP_INVALID");
    }

    const uniqueFailures = [...new Set(failures)];
    return uniqueFailures.length > 0
      ? makeResult("REJECTED", uniqueFailures)
      : makeResult("VALID_ENROLLMENT_EVIDENCE_CANDIDATE_NO_ENROLLMENT", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}