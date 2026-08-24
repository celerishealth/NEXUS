import type { ConstitutionalIssuerEnrollmentEvidenceCandidate } from "./aiWorkforceConstitutionalIssuerEnrollmentEvidence";
import { validateConstitutionalIssuerEnrollmentEvidenceCandidate } from "./aiWorkforceConstitutionalIssuerEnrollmentEvidenceValidator";

export const CONSTITUTIONAL_ISSUER_ENROLLMENT_DECISION_DOMAIN =
  "NEXUS_CONSTITUTIONAL_ISSUER_ENROLLMENT_DECISION_V1" as const;

export type ConstitutionalIssuerEnrollmentCanonicalPayloadFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "CANDIDATE_INVALID";

export interface ConstitutionalIssuerEnrollmentCanonicalPayloadResult {
  readonly payloadState: "CANONICAL_ENROLLMENT_PAYLOAD_READY_NO_ENROLLMENT" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerEnrollmentCanonicalPayloadFailureCode[];
  readonly canonicalPayload: string | null;
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

const result = (
  payloadState: ConstitutionalIssuerEnrollmentCanonicalPayloadResult["payloadState"],
  failureCodes: readonly ConstitutionalIssuerEnrollmentCanonicalPayloadFailureCode[],
  canonicalPayload: string | null,
): ConstitutionalIssuerEnrollmentCanonicalPayloadResult => Object.freeze({
  payloadState,
  failureCodes: Object.freeze([...failureCodes]),
  canonicalPayload,
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

export function createConstitutionalIssuerEnrollmentCanonicalPayload(
  input: unknown,
): ConstitutionalIssuerEnrollmentCanonicalPayloadResult {
  if (!isRecord(input)) {
    return result("REJECTED", ["CANDIDATE_NOT_OBJECT"], null);
  }

  try {
    const snapshot = {
      schemaVersion: input.schemaVersion,
      enrollmentEvidenceId: input.enrollmentEvidenceId,
      issuerId: input.issuerId,
      producerComponentId: input.producerComponentId,
      producerIdentityEvidenceDigest: input.producerIdentityEvidenceDigest,
      trustBindingId: input.trustBindingId,
      keyId: input.keyId,
      requestedActionClasses: Array.isArray(input.requestedActionClasses)
        ? [...input.requestedActionClasses]
        : input.requestedActionClasses,
      requestedCapabilities: Array.isArray(input.requestedCapabilities)
        ? [...input.requestedCapabilities]
        : input.requestedCapabilities,
      evidenceAuthorityPurpose: input.evidenceAuthorityPurpose,
      enrollmentDecisionId: input.enrollmentDecisionId,
      enrolledBy: input.enrolledBy,
      provenanceSourceId: input.provenanceSourceId,
      integrityState: input.integrityState,
      enrolledAt: input.enrolledAt,
    };

    const validation = validateConstitutionalIssuerEnrollmentEvidenceCandidate(snapshot);
    if (validation.validationState !== "VALID_ENROLLMENT_EVIDENCE_CANDIDATE_NO_ENROLLMENT") {
      return result("REJECTED", ["CANDIDATE_INVALID"], null);
    }

    const candidate = snapshot as ConstitutionalIssuerEnrollmentEvidenceCandidate;
    const body = JSON.stringify({
      schemaVersion: candidate.schemaVersion,
      enrollmentEvidenceId: candidate.enrollmentEvidenceId,
      issuerId: candidate.issuerId,
      producerComponentId: candidate.producerComponentId,
      producerIdentityEvidenceDigest: candidate.producerIdentityEvidenceDigest,
      trustBindingId: candidate.trustBindingId,
      keyId: candidate.keyId,
      requestedActionClasses: [...candidate.requestedActionClasses],
      requestedCapabilities: [...candidate.requestedCapabilities],
      evidenceAuthorityPurpose: candidate.evidenceAuthorityPurpose,
      enrollmentDecisionId: candidate.enrollmentDecisionId,
      enrolledBy: candidate.enrolledBy,
      provenanceSourceId: candidate.provenanceSourceId,
      integrityState: candidate.integrityState,
      enrolledAt: candidate.enrolledAt,
    });

    return result(
      "CANONICAL_ENROLLMENT_PAYLOAD_READY_NO_ENROLLMENT",
      [],
      `${CONSTITUTIONAL_ISSUER_ENROLLMENT_DECISION_DOMAIN}\n${body}`,
    );
  } catch {
    return result("REJECTED", ["CANDIDATE_ACCESS_FAILED"], null);
  }
}