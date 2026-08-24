import type { ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import { validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidator";

export const CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_DOMAIN =
  "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_V1" as const;

export type ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadFailureCode =
  | "INPUT_NOT_OBJECT"
  | "INPUT_ACCESS_FAILED"
  | "REFERENCE_INVALID"
  | "PROVENANCE_BINDING_INVALID"
  | "ALGORITHM_INVALID";

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadInput {
  readonly reference: unknown;
  readonly provenanceAuthorityId: string;
  readonly provenanceKeyId: string;
  readonly signatureAlgorithm: "Ed25519";
}

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadResult {
  readonly payloadState: "CANONICAL_PROVENANCE_PAYLOAD_READY_NO_PROOF" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadFailureCode[];
  readonly canonicalPayload: string | null;
  readonly signatureVerified: false;
  readonly provenanceRootTrusted: false;
  readonly referenceProvenanceVerified: false;
  readonly integrityVerified: false;
  readonly freshnessVerified: false;
  readonly rollbackProtectionVerified: false;
  readonly reviewerKeyTrusted: false;
  readonly runtimeTrustEstablished: false;
  readonly issuerTrustEstablished: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const result = (
  payloadState: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadResult["payloadState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadFailureCode[],
  canonicalPayload: string | null,
): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadResult => Object.freeze({
  payloadState,
  failureCodes: Object.freeze([...failureCodes]),
  canonicalPayload,
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isExactIdentifier = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value === value.trim();

export function createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload(
  input: unknown,
): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayloadResult {
  try {
    if (!isRecord(input)) {
      return result("REJECTED", ["INPUT_NOT_OBJECT"], null);
    }

    if (!isRecord(input.reference)) {
      return result("REJECTED", ["REFERENCE_INVALID"], null);
    }

    const rawReference = input.reference;
    const referenceSnapshot = {
      referenceVersion: rawReference.referenceVersion,
      referenceId: rawReference.referenceId,
      trustRootSourceId: rawReference.trustRootSourceId,
      snapshotId: rawReference.snapshotId,
      sequence: rawReference.sequence,
      expectedDigest: rawReference.expectedDigest,
      provenanceSourceId: rawReference.provenanceSourceId,
      referenceState: rawReference.referenceState,
      establishedAt: rawReference.establishedAt,
    };

    const validation = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate(referenceSnapshot);
    if (validation.validationState !== "VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["REFERENCE_INVALID"], null);
    }

    if (!isExactIdentifier(input.provenanceAuthorityId) || !isExactIdentifier(input.provenanceKeyId)) {
      return result("REJECTED", ["PROVENANCE_BINDING_INVALID"], null);
    }

    if (input.signatureAlgorithm !== "Ed25519") {
      return result("REJECTED", ["ALGORITHM_INVALID"], null);
    }

    const reference = referenceSnapshot as ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate;
    const body = JSON.stringify({
      provenanceAuthorityId: input.provenanceAuthorityId,
      provenanceKeyId: input.provenanceKeyId,
      signatureAlgorithm: input.signatureAlgorithm,
      referenceVersion: reference.referenceVersion,
      referenceId: reference.referenceId,
      trustRootSourceId: reference.trustRootSourceId,
      snapshotId: reference.snapshotId,
      sequence: reference.sequence,
      expectedDigest: reference.expectedDigest,
      provenanceSourceId: reference.provenanceSourceId,
      referenceState: reference.referenceState,
      establishedAt: reference.establishedAt,
    });

    return result(
      "CANONICAL_PROVENANCE_PAYLOAD_READY_NO_PROOF",
      [],
      `${CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_DOMAIN}\n${body}`,
    );
  } catch {
    return result("REJECTED", ["INPUT_ACCESS_FAILED"], null);
  }
}