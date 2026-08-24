export const CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION =
  "NEXUS_CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_V1" as const;

/**
 * Signature envelope for a canonical Section 6A issuer-enrollment decision.
 *
 * This contract binds the claimed reviewer/anchor/key identity to the
 * signature metadata, but does NOT establish that the anchor is trusted,
 * that the signature is valid, or that the issuer is enrolled.
 */
export interface ConstitutionalIssuerEnrollmentSignedEnvelopeCandidate {
  readonly schemaVersion:
    typeof CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION;
  readonly enrollmentEvidenceId: string;
  readonly enrollmentDecisionId: string;
  readonly reviewerAnchorId: string;
  readonly reviewerId: string;
  readonly reviewerKeyId: string;
  readonly signatureAlgorithm: "Ed25519";
  readonly signatureBase64Url: string;
}

export const CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_SIGNATURE_PROOF_NO_ENROLLMENT" as const,
    callerSuppliedEnvelopeAcceptedAsProof: false as const,
    callerSuppliedAnchorAcceptedAsTrust: false as const,
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