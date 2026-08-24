import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelope";

export type ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "SCHEMA_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "ALGORITHM_INVALID"
  | "SIGNATURE_ENCODING_INVALID";

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationResult {
  readonly validationState: "VALID_PROVENANCE_ENVELOPE_CANDIDATE_NO_PROOF" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationFailureCode[];
  readonly signatureVerified: false;
  readonly provenanceRootTrusted: false;
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

const makeResult = (validationState: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationResult["validationState"], failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationFailureCode[]): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
  signatureVerified: false as const,
  provenanceRootTrusted: false as const,
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

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isCanonicalIdentifier = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 256 && value === value.trim();

export function validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate(candidate: unknown): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationResult {
  try {
    if (!isRecord(candidate)) return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    const failures: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidationFailureCode[] = [];
    if (candidate.schemaVersion !== CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION) failures.push("SCHEMA_VERSION_INVALID");
    for (const value of [candidate.referenceId, candidate.provenanceAuthorityId, candidate.provenanceKeyId]) {
      if (!isCanonicalIdentifier(value)) { failures.push("REQUIRED_BINDING_INVALID"); break; }
    }
    if (candidate.signatureAlgorithm !== "Ed25519") failures.push("ALGORITHM_INVALID");
    const encoded = candidate.signatureBase64Url;
    if (typeof encoded !== "string" || encoded.length === 0 || !/^[A-Za-z0-9_-]+$/.test(encoded)) {
      failures.push("SIGNATURE_ENCODING_INVALID");
    } else {
      try {
        const bytes = Buffer.from(encoded, "base64url");
        if (bytes.length !== 64 || bytes.toString("base64url") !== encoded) failures.push("SIGNATURE_ENCODING_INVALID");
      } catch { failures.push("SIGNATURE_ENCODING_INVALID"); }
    }
    const unique = [...new Set(failures)];
    return unique.length ? makeResult("REJECTED", unique) : makeResult("VALID_PROVENANCE_ENVELOPE_CANDIDATE_NO_PROOF", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}