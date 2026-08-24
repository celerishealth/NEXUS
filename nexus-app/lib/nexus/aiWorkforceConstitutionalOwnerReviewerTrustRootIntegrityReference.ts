export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_V1" as const;

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate {
  readonly referenceVersion:
    typeof CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION;
  readonly referenceId: string;
  readonly trustRootSourceId: string;
  readonly snapshotId: string;
  readonly sequence: number;
  readonly expectedDigest: string;
  readonly provenanceSourceId: string;
  readonly referenceState: "VERIFIED" | "UNVERIFIED";
  readonly establishedAt: string;
}

export type ConstitutionalOwnerReviewerTrustRootIntegrityReferenceLoadResult =
  | {
      readonly loadState: "LOADED_REFERENCE_CANDIDATE_NO_TRUST";
      readonly reference: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate;
      readonly integrityVerified: false;
      readonly reviewerKeyTrusted: false;
      readonly runtimeTrustEstablished: false;
      readonly issuerTrustEstablished: false;
      readonly constitutionalExecutionAuthorityGranted: false;
    }
  | {
      readonly loadState: "BLOCKED";
      readonly failureCode:
        | "INTEGRITY_REFERENCE_UNAVAILABLE"
        | "INTEGRITY_REFERENCE_LOAD_FAILED"
        | "INTEGRITY_REFERENCE_PARTIAL"
        | "INTEGRITY_REFERENCE_CORRUPT"
        | "INTEGRITY_REFERENCE_PROVENANCE_UNVERIFIED"
        | "INTEGRITY_REFERENCE_AMBIGUOUS";
      readonly reference: null;
      readonly integrityVerified: false;
      readonly reviewerKeyTrusted: false;
      readonly runtimeTrustEstablished: false;
      readonly issuerTrustEstablished: false;
      readonly constitutionalExecutionAuthorityGranted: false;
    };

/**
 * Bootstrap-bound independent integrity-reference source.
 * Ordinary request/action callers must not provide or override this source.
 * A loaded candidate is not trusted merely because its state says VERIFIED.
 */
export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceSource {
  readonly sourceId: string;
  readonly load: () => Promise<ConstitutionalOwnerReviewerTrustRootIntegrityReferenceLoadResult>;
}

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_INTEGRITY_TRUST" as const,
    ordinaryCallerMaySupplyReference: false as const,
    ordinaryCallerMayOverrideReference: false as const,
    requestPayloadMaySupplyExpectedDigest: false as const,
    promptOrModelMaySupplyExpectedDigest: false as const,
    snapshotMaySelfAuthenticateDigest: false as const,
    unsignedConfigurationMayCreateTrust: false as const,
    existingNexusDatabaseReuseAuthorized: false as const,
    existingPostgresReuseAuthorized: false as const,
    existingSqliteReuseAuthorized: false as const,
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