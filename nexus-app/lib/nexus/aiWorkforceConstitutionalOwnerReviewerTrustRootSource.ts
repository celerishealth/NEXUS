import type { ConstitutionalOwnerReviewerTrustAnchorCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustAnchor";

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_V1" as const;

export interface ConstitutionalOwnerReviewerTrustRootSnapshotCandidate {
  readonly sourceVersion:
    typeof CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_VERSION;
  readonly sourceId: string;
  readonly snapshotId: string;
  readonly sequence: number;
  readonly provenanceSourceId: string;
  readonly integrityDigest: string;
  readonly integrityState: "VERIFIED" | "UNVERIFIED";
  readonly verifiedAt: string;
  readonly expiresAt: string;
  readonly anchors: readonly ConstitutionalOwnerReviewerTrustAnchorCandidate[];
}

export type ConstitutionalOwnerReviewerTrustRootSourceLoadResult =
  | {
      readonly loadState: "LOADED_CANDIDATE_NO_TRUST";
      readonly snapshot: ConstitutionalOwnerReviewerTrustRootSnapshotCandidate;
      readonly runtimeTrustEstablished: false;
      readonly issuerTrustEstablished: false;
      readonly admissionProjectionAuthorized: false;
      readonly constitutionalExecutionAuthorityGranted: false;
    }
  | {
      readonly loadState: "BLOCKED";
      readonly failureCode:
        | "TRUST_ROOT_SOURCE_UNAVAILABLE"
        | "TRUST_ROOT_SOURCE_LOAD_FAILED"
        | "TRUST_ROOT_SOURCE_PARTIAL"
        | "TRUST_ROOT_SOURCE_CORRUPT"
        | "TRUST_ROOT_SOURCE_STALE"
        | "TRUST_ROOT_SOURCE_PROVENANCE_UNVERIFIED"
        | "TRUST_ROOT_SOURCE_ROLLBACK_DETECTED"
        | "TRUST_ROOT_SOURCE_AMBIGUOUS";
      readonly snapshot: null;
      readonly runtimeTrustEstablished: false;
      readonly issuerTrustEstablished: false;
      readonly admissionProjectionAuthorized: false;
      readonly constitutionalExecutionAuthorityGranted: false;
    };

/**
 * Bootstrap-bound trust-root source contract. Ordinary action/request callers
 * MUST NOT supply or override this dependency per call. Implementations must
 * independently prove source integrity, freshness, provenance and rollback
 * behavior before any anchor can become trusted.
 */
export interface ConstitutionalOwnerReviewerTrustRootSource {
  readonly sourceId: string;
  readonly load: () => Promise<ConstitutionalOwnerReviewerTrustRootSourceLoadResult>;
}

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_RUNTIME_TRUST" as const,
    ordinaryCallerMaySupplySource: false as const,
    ordinaryCallerMayOverrideSource: false as const,
    admissionPayloadMaySupplyAnchors: false as const,
    promptOrModelMaySupplyAnchors: false as const,
    unsignedConfigurationMayCreateTrust: false as const,
    existingNexusDatabaseReuseAuthorized: false as const,
    existingPostgresReuseAuthorized: false as const,
    existingSqliteReuseAuthorized: false as const,
    providerBootstrapReuseAuthorized: false as const,
    runtimeTrustEstablished: false as const,
    reviewerKeyTrusted: false as const,
    issuerTrustEstablished: false as const,
    admissionProjectionAuthorized: false as const,
    constitutionalExecutionAuthorityGranted: false as const,
    providerExecutionAuthorized: false as const,
    paymentExecutionAuthorized: false as const,
    legalFilingAuthorized: false as const,
    externalDeliveryAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  });