import type {
  ConstitutionalEvidenceAdmissionVerificationContext,
} from "./aiWorkforceConstitutionalEvidenceAdmission";

export const AI_WORKFORCE_CONSTITUTIONAL_TRUST_CONTEXT_RESOLVER_VERSION =
  "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_TRUST_CONTEXT_RESOLVER_V1" as const;

/**
 * Untrusted/request-bound values only.
 *
 * Trusted issuers, source-evidence registry data, registry trust metadata,
 * verification secrets/material, and trusted time MUST NOT be supplied here.
 */
export interface ConstitutionalTrustContextResolutionRequest {
  readonly expectedTenantId: string;
  readonly expectedActorId: string;
  readonly expectedActionId: string;
  readonly expectedActionClass: string;
  readonly expectedRequestedCapability: string;
  readonly expectedPayloadDigest: string;
}

export type ConstitutionalTrustContextResolutionFailureCode =
  | "TRUST_CONTEXT_RESOLVER_UNAVAILABLE"
  | "TRUST_CONTEXT_RESOLVER_IDENTITY_INVALID"
  | "TRUST_CONTEXT_REQUEST_INVALID"
  | "TRUST_CONTEXT_BINDING_MISMATCH"
  | "TRUST_CONTEXT_LOAD_FAILED"
  | "TRUST_CONTEXT_PARTIAL"
  | "TRUST_CONTEXT_CORRUPT"
  | "TRUST_CONTEXT_STALE"
  | "TRUST_CONTEXT_PROVENANCE_UNVERIFIED"
  | "TRUST_CONTEXT_AMBIGUOUS";

export interface ConstitutionalTrustContextResolutionBlocked {
  readonly resolutionState: "BLOCKED";
  readonly failureCode: ConstitutionalTrustContextResolutionFailureCode;
  readonly verificationContext: null;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export interface ConstitutionalTrustContextResolvedNoAuthority {
  readonly resolutionState: "RESOLVED_NO_AUTHORITY";
  readonly failureCode: null;
  readonly verificationContext:
    ConstitutionalEvidenceAdmissionVerificationContext;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export type ConstitutionalTrustContextResolutionResult =
  | ConstitutionalTrustContextResolutionBlocked
  | ConstitutionalTrustContextResolvedNoAuthority;

/**
 * Section 6C boundary contract.
 *
 * Implementations must independently resolve owner-controlled trust material.
 * This interface intentionally exposes no caller parameters for trusted issuer
 * records, source-evidence registry records, registry trust metadata,
 * verification secrets/material, or trusted verification time.
 *
 * Merely implementing this interface does not prove a resolver trusted.
 */
export interface ConstitutionalTrustContextResolver {
  readonly resolverId: string;

  resolveTrustContext(
    request: ConstitutionalTrustContextResolutionRequest,
  ): Promise<ConstitutionalTrustContextResolutionResult>;
}