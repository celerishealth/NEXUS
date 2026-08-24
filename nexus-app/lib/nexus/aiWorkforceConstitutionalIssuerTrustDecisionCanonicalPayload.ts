import type { ConstitutionalIssuerTrustLifecycleBindingCandidate } from "./aiWorkforceConstitutionalIssuerTrustLifecycle";
import { validateConstitutionalIssuerTrustLifecycleCandidate } from "./aiWorkforceConstitutionalIssuerTrustLifecycleValidator";

export const CONSTITUTIONAL_ISSUER_TRUST_DECISION_DOMAIN =
  "NEXUS_CONSTITUTIONAL_ISSUER_TRUST_DECISION_V1" as const;

export type ConstitutionalIssuerTrustDecisionPayloadFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "CANDIDATE_INVALID";

export interface ConstitutionalIssuerTrustDecisionCanonicalPayloadResult {
  readonly payloadState: "CANONICAL_PAYLOAD_READY_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerTrustDecisionPayloadFailureCode[];
  readonly canonicalPayload: string | null;
  readonly runtimeTrustEstablished: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const result = (
  payloadState: ConstitutionalIssuerTrustDecisionCanonicalPayloadResult["payloadState"],
  failureCodes: readonly ConstitutionalIssuerTrustDecisionPayloadFailureCode[],
  canonicalPayload: string | null,
): ConstitutionalIssuerTrustDecisionCanonicalPayloadResult => Object.freeze({
  payloadState,
  failureCodes: Object.freeze([...failureCodes]),
  canonicalPayload,
  runtimeTrustEstablished: false as const,
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

/**
 * Creates a domain-separated deterministic payload for a Section 6A owner
 * trust decision. Producing this payload does NOT authenticate the reviewer,
 * public key, provenance source, or candidate and grants no authority.
 */
export function createConstitutionalIssuerTrustDecisionCanonicalPayload(
  input: unknown,
): ConstitutionalIssuerTrustDecisionCanonicalPayloadResult {
  if (!isRecord(input)) {
    return result("REJECTED", ["CANDIDATE_NOT_OBJECT"], null);
  }

  try {
    const snapshot = {
      schemaVersion: input.schemaVersion,
      trustBindingId: input.trustBindingId,
      issuerId: input.issuerId,
      activeKeyId: input.activeKeyId,
      permittedActionClasses: Array.isArray(input.permittedActionClasses)
        ? [...input.permittedActionClasses]
        : input.permittedActionClasses,
      permittedCapabilities: Array.isArray(input.permittedCapabilities)
        ? [...input.permittedCapabilities]
        : input.permittedCapabilities,
      trustState: input.trustState,
      status: input.status,
      keyState: input.keyState,
      evidenceAuthorityPurpose: input.evidenceAuthorityPurpose,
      provenanceSourceId: input.provenanceSourceId,
      integrityState: input.integrityState,
      reviewedBy: input.reviewedBy,
      reviewDecisionId: input.reviewDecisionId,
      activatedAt: input.activatedAt,
      verifiedAt: input.verifiedAt,
      expiresAt: input.expiresAt,
      rotationOfKeyId: input.rotationOfKeyId,
    };

    const validation = validateConstitutionalIssuerTrustLifecycleCandidate(snapshot);
    if (validation.validationState !== "VALID_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["CANDIDATE_INVALID"], null);
    }

    const candidate = snapshot as ConstitutionalIssuerTrustLifecycleBindingCandidate;
    const body = JSON.stringify({
      schemaVersion: candidate.schemaVersion,
      trustBindingId: candidate.trustBindingId,
      issuerId: candidate.issuerId,
      activeKeyId: candidate.activeKeyId,
      permittedActionClasses: [...candidate.permittedActionClasses],
      permittedCapabilities: [...candidate.permittedCapabilities],
      trustState: candidate.trustState,
      status: candidate.status,
      keyState: candidate.keyState,
      evidenceAuthorityPurpose: candidate.evidenceAuthorityPurpose,
      provenanceSourceId: candidate.provenanceSourceId,
      integrityState: candidate.integrityState,
      reviewedBy: candidate.reviewedBy,
      reviewDecisionId: candidate.reviewDecisionId,
      activatedAt: candidate.activatedAt,
      verifiedAt: candidate.verifiedAt,
      expiresAt: candidate.expiresAt,
      rotationOfKeyId: candidate.rotationOfKeyId ?? null,
    });

    return result(
      "CANONICAL_PAYLOAD_READY_NO_TRUST",
      [],
      `${CONSTITUTIONAL_ISSUER_TRUST_DECISION_DOMAIN}\n${body}`,
    );
  } catch {
    return result("REJECTED", ["CANDIDATE_ACCESS_FAILED"], null);
  }
}