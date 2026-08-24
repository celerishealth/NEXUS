export const CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_V1" as const;

export type ConstitutionalOwnerReviewerProvenanceAuthorityRootState =
  | "ACTIVE"
  | "DISABLED"
  | "REVOKED"
  | "RETIRED";

export interface ConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate {
  readonly rootVersion:
    typeof CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION;
  readonly rootId: string;
  readonly authorityId: string;
  readonly keyId: string;
  readonly algorithm: "Ed25519";
  readonly publicKeyPem: string;
  readonly state: ConstitutionalOwnerReviewerProvenanceAuthorityRootState;
  readonly provenanceSourceId: string;
  readonly integrityState: "VERIFIED" | "UNVERIFIED";
  readonly provisionDecisionId: string;
  readonly provisionedBy: string;
  readonly activatedAt: string;
  readonly verifiedAt: string;
  readonly expiresAt: string;
  readonly rotationOfKeyId?: string;
}

export type ConstitutionalOwnerReviewerProvenanceAuthorityRootLoadResult =
  | {
      readonly loadState: "LOADED_PROVENANCE_ROOT_CANDIDATE_NO_TRUST";
      readonly root: ConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate;
      readonly provenanceRootTrusted: false;
      readonly referenceProvenanceVerified: false;
      readonly integrityVerified: false;
      readonly reviewerKeyTrusted: false;
      readonly runtimeTrustEstablished: false;
      readonly issuerTrustEstablished: false;
      readonly constitutionalExecutionAuthorityGranted: false;
    }
  | {
      readonly loadState: "BLOCKED";
      readonly failureCode:
        | "PROVENANCE_ROOT_UNAVAILABLE"
        | "PROVENANCE_ROOT_LOAD_FAILED"
        | "PROVENANCE_ROOT_PARTIAL"
        | "PROVENANCE_ROOT_CORRUPT"
        | "PROVENANCE_ROOT_STALE"
        | "PROVENANCE_ROOT_PROVENANCE_UNVERIFIED"
        | "PROVENANCE_ROOT_ROLLBACK_DETECTED"
        | "PROVENANCE_ROOT_AMBIGUOUS";
      readonly root: null;
      readonly provenanceRootTrusted: false;
      readonly referenceProvenanceVerified: false;
      readonly integrityVerified: false;
      readonly reviewerKeyTrusted: false;
      readonly runtimeTrustEstablished: false;
      readonly issuerTrustEstablished: false;
      readonly constitutionalExecutionAuthorityGranted: false;
    };

/**
 * Bootstrap-bound public verification-root source for integrity-reference
 * provenance. Runtime verification uses public Ed25519 material only.
 * This contract does not provision or trust a real key by itself.
 */
export interface ConstitutionalOwnerReviewerProvenanceAuthorityRootSource {
  readonly sourceId: string;
  readonly load: () => Promise<ConstitutionalOwnerReviewerProvenanceAuthorityRootLoadResult>;
}

export const CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_PROVENANCE_TRUST" as const,
    ordinaryCallerMaySupplyRoot: false as const,
    ordinaryCallerMayOverrideRoot: false as const,
    requestPayloadMaySupplyPublicKey: false as const,
    promptOrModelMaySupplyPublicKey: false as const,
    unsignedConfigurationMayCreateTrust: false as const,
    hmacOwnerAuthorizationReuseAuthorized: false as const,
    privateSigningMaterialRequiredAtRuntime: false as const,
    privateSigningMaterialAcceptedFromCaller: false as const,
    existingNexusDatabaseReuseAuthorized: false as const,
    existingPostgresReuseAuthorized: false as const,
    existingSqliteReuseAuthorized: false as const,
    providerBootstrapReuseAuthorized: false as const,
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