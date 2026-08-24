export const CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION =
  "NEXUS_CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_V1" as const;

export type ConstitutionalIssuerEnrollmentIntegrityState =
  | "VERIFIED"
  | "UNVERIFIED";

/**
 * Section 6A issuer-enrollment evidence candidate.
 *
 * This contract records identity/binding evidence only. Possessing or
 * constructing this object does NOT enroll, activate, verify, or trust an
 * issuer and grants no admission or execution authority.
 */
export interface ConstitutionalIssuerEnrollmentEvidenceCandidate {
  readonly schemaVersion:
    typeof CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION;
  readonly enrollmentEvidenceId: string;
  readonly issuerId: string;
  readonly producerComponentId: string;
  readonly producerIdentityEvidenceDigest: string;
  readonly trustBindingId: string;
  readonly keyId: string;
  readonly requestedActionClasses: readonly string[];
  readonly requestedCapabilities: readonly string[];
  readonly evidenceAuthorityPurpose: string;
  readonly enrollmentDecisionId: string;
  readonly enrolledBy: string;
  readonly provenanceSourceId: string;
  readonly integrityState: ConstitutionalIssuerEnrollmentIntegrityState;
  readonly enrolledAt: string;
}

export const CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_ENROLLMENT_NO_TRUST" as const,
    callerSuppliedEnrollmentAccepted: false as const,
    issuerSelfEnrollmentAccepted: false as const,
    promptOrModelEnrollmentAccepted: false as const,
    ownerWordingAloneAccepted: false as const,
    unsignedConfigurationEnrollmentAccepted: false as const,
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