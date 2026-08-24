export const CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION =
  "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_V1" as const;

export type ConstitutionalIssuerLifecycleStatus =
  | "ACTIVE"
  | "DISABLED"
  | "REVOKED"
  | "RETIRED";

export type ConstitutionalIssuerLifecycleTrustState =
  | "VERIFIED"
  | "UNVERIFIED";

export type ConstitutionalIssuerLifecycleKeyState =
  | "ACTIVE"
  | "DISABLED"
  | "REVOKED"
  | "RETIRED"
  | "EXPIRED";

export type ConstitutionalIssuerLifecycleIntegrityState =
  | "VERIFIED"
  | "UNVERIFIED";

/**
 * Section 6A lifecycle source candidate.
 *
 * This shape is NOT a runtime trust root and MUST NOT be accepted directly
 * from an action caller, employee, model, prompt, admission payload, or UI.
 */
export interface ConstitutionalIssuerTrustLifecycleBindingCandidate {
  readonly schemaVersion:
    typeof CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION;
  readonly trustBindingId: string;
  readonly issuerId: string;
  readonly activeKeyId: string;
  readonly permittedActionClasses: readonly string[];
  readonly permittedCapabilities: readonly string[];
  readonly trustState: ConstitutionalIssuerLifecycleTrustState;
  readonly status: ConstitutionalIssuerLifecycleStatus;
  readonly keyState: ConstitutionalIssuerLifecycleKeyState;
  readonly evidenceAuthorityPurpose: string;
  readonly provenanceSourceId: string;
  readonly integrityState: ConstitutionalIssuerLifecycleIntegrityState;
  readonly reviewedBy: string;
  readonly reviewDecisionId: string;
  readonly activatedAt: string;
  readonly verifiedAt: string;
  readonly expiresAt: string;
  readonly rotationOfKeyId?: string;
}

export const CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_BOUNDARY =
  Object.freeze({
    boundaryState: "CONTRACT_ONLY_NO_RUNTIME_TRUST" as const,
    callerSuppliedTrustAccepted: false as const,
    unsignedConfigurationCreatesTrust: false as const,
    ownerWordingAloneCreatesTrust: false as const,
    admissionPayloadCreatesTrust: false as const,
    verificationMaterialAcceptedFromCaller: false as const,
    runtimeTrustEstablished: false as const,
    admissionProjectionAuthorized: false as const,
    constitutionalExecutionAuthorityGranted: false as const,
    providerExecutionAuthorized: false as const,
    paymentExecutionAuthorized: false as const,
    legalFilingAuthorized: false as const,
    externalDeliveryAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  });