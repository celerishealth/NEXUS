export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_V1" as const;

export type ConstitutionalOwnerReviewerTrustAnchorState =
  | "ACTIVE"
  | "DISABLED"
  | "REVOKED"
  | "RETIRED";

export type ConstitutionalOwnerReviewerTrustAnchorIntegrityState =
  | "VERIFIED"
  | "UNVERIFIED";

/**
 * Candidate description of an owner-reviewer public-key trust anchor.
 *
 * This structure is NOT itself a trust root. Runtime callers, admission
 * payloads, prompts, models, employees, or unsigned configuration MUST NOT
 * establish trust merely by supplying this shape.
 */
export interface ConstitutionalOwnerReviewerTrustAnchorCandidate {
  readonly schemaVersion:
    typeof CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION;
  readonly anchorId: string;
  readonly reviewerId: string;
  readonly keyId: string;
  readonly algorithm: "Ed25519";
  readonly publicKeyPem: string;
  readonly state: ConstitutionalOwnerReviewerTrustAnchorState;
  readonly provenanceSourceId: string;
  readonly integrityState: ConstitutionalOwnerReviewerTrustAnchorIntegrityState;
  readonly provisionDecisionId: string;
  readonly provisionedBy: string;
  readonly activatedAt: string;
  readonly verifiedAt: string;
  readonly expiresAt: string;
  readonly rotationOfKeyId?: string;
}

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_RUNTIME_TRUST" as const,
    callerSuppliedAnchorAcceptedAsTrust: false as const,
    admissionPayloadAnchorAcceptedAsTrust: false as const,
    promptOrModelAnchorAcceptedAsTrust: false as const,
    unsignedConfigurationAnchorAcceptedAsTrust: false as const,
    privateKeyMaterialRequiredAtRuntime: false as const,
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