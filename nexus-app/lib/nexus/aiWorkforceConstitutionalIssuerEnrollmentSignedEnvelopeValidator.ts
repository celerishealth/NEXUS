import { CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION } from "./aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelope";

export type ConstitutionalIssuerEnrollmentSignedEnvelopeValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "SCHEMA_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "ALGORITHM_INVALID"
  | "SIGNATURE_ENCODING_INVALID";

export interface ConstitutionalIssuerEnrollmentSignedEnvelopeValidationResult {
  readonly validationState: "VALID_SIGNED_ENVELOPE_CANDIDATE_NO_PROOF" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerEnrollmentSignedEnvelopeValidationFailureCode[];
  readonly signatureVerified: false;
  readonly reviewerIdentityVerified: false;
  readonly reviewerKeyTrusted: false;
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
  validationState: ConstitutionalIssuerEnrollmentSignedEnvelopeValidationResult["validationState"],
  failureCodes: readonly ConstitutionalIssuerEnrollmentSignedEnvelopeValidationFailureCode[],
): ConstitutionalIssuerEnrollmentSignedEnvelopeValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
  signatureVerified: false as const,
  reviewerIdentityVerified: false as const,
  reviewerKeyTrusted: false as const,
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

export function validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate(
  candidate: unknown,
): ConstitutionalIssuerEnrollmentSignedEnvelopeValidationResult {
  try {
    if (!isRecord(candidate)) {
      return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    }

    const failures: ConstitutionalIssuerEnrollmentSignedEnvelopeValidationFailureCode[] = [];

    if (candidate.schemaVersion !== CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION) {
      failures.push("SCHEMA_VERSION_INVALID");
    }

    for (const value of [
      candidate.enrollmentEvidenceId,
      candidate.enrollmentDecisionId,
      candidate.reviewerAnchorId,
      candidate.reviewerId,
      candidate.reviewerKeyId,
    ]) {
      if (!isNonEmptyString(value)) {
        failures.push("REQUIRED_BINDING_INVALID");
        break;
      }
    }

    if (candidate.signatureAlgorithm !== "Ed25519") {
      failures.push("ALGORITHM_INVALID");
    }

    const signatureBase64Url = candidate.signatureBase64Url;
    if (
      !isNonEmptyString(signatureBase64Url) ||
      !/^[A-Za-z0-9_-]+$/.test(signatureBase64Url)
    ) {
      failures.push("SIGNATURE_ENCODING_INVALID");
    } else {
      try {
        const signature = Buffer.from(signatureBase64Url, "base64url");
        if (signature.length !== 64) {
          failures.push("SIGNATURE_ENCODING_INVALID");
        }
      } catch {
        failures.push("SIGNATURE_ENCODING_INVALID");
      }
    }

    const uniqueFailures = [...new Set(failures)];
    return uniqueFailures.length > 0
      ? makeResult("REJECTED", uniqueFailures)
      : makeResult("VALID_SIGNED_ENVELOPE_CANDIDATE_NO_PROOF", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}