export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_V1" as const;

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate {
  readonly schemaVersion: typeof CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_SCHEMA_VERSION;
  readonly referenceId: string;
  readonly provenanceAuthorityId: string;
  readonly provenanceKeyId: string;
  readonly signatureAlgorithm: "Ed25519";
  readonly signatureBase64Url: string;
}

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_SIGNATURE_PROOF_NO_PROVENANCE_TRUST" as const,
    callerSuppliedEnvelopeAcceptedAsProof: false as const,
    callerSuppliedPublicKeyAcceptedAsTrust: false as const,
    privateSigningMaterialAcceptedFromCaller: false as const,
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