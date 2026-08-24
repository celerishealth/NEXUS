import { verify as verifyEd25519 } from "node:crypto";
import type { ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import { validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidator";
import type { ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelope";
import { validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeValidator";
import type { ConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRoot";
import { validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRootValidator";
import { createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload";

export type ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationFailureCode =
  | "REFERENCE_INVALID"
  | "ENVELOPE_INVALID"
  | "PROVENANCE_ROOT_INVALID"
  | "REFERENCE_ID_BINDING_MISMATCH"
  | "AUTHORITY_ID_BINDING_MISMATCH"
  | "KEY_ID_BINDING_MISMATCH"
  | "PROVENANCE_ROOT_NOT_ACTIVE"
  | "CANONICAL_PAYLOAD_FAILED"
  | "SIGNATURE_INVALID"
  | "CRYPTOGRAPHIC_VERIFICATION_FAILED"
  | "INPUT_ACCESS_FAILED";

export interface ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationResult {
  readonly proofState: "CRYPTOGRAPHIC_PROVENANCE_SIGNATURE_VALID_NO_ROOT_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationFailureCode[];
  readonly exactReferenceBindingMatched: boolean;
  readonly exactAuthorityBindingMatched: boolean;
  readonly exactKeyBindingMatched: boolean;
  readonly rootCandidateStateActive: boolean;
  readonly cryptographicSignatureValid: boolean;
  readonly signatureVerified: boolean;
  readonly provenanceRootTrusted: false;
  readonly provenanceRootFreshnessVerified: false;
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
  proofState: ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationResult["proofState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationFailureCode[],
  exactReferenceBindingMatched = false,
  exactAuthorityBindingMatched = false,
  exactKeyBindingMatched = false,
  rootCandidateStateActive = false,
  cryptographicSignatureValid = false,
): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationResult => Object.freeze({
  proofState,
  failureCodes: Object.freeze([...failureCodes]),
  exactReferenceBindingMatched,
  exactAuthorityBindingMatched,
  exactKeyBindingMatched,
  rootCandidateStateActive,
  cryptographicSignatureValid,
  signatureVerified: cryptographicSignatureValid,
  provenanceRootTrusted: false as const,
  provenanceRootFreshnessVerified: false as const,
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

export function verifyConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519(
  referenceInput: unknown,
  envelopeInput: unknown,
  provenanceRootInput: unknown,
): ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceEd25519VerificationResult {
  try {
    const referenceValidation = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate(referenceInput);
    if (referenceValidation.validationState !== "VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["REFERENCE_INVALID"]);
    }

    const envelopeValidation = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate(envelopeInput);
    if (envelopeValidation.validationState !== "VALID_PROVENANCE_ENVELOPE_CANDIDATE_NO_PROOF") {
      return result("REJECTED", ["ENVELOPE_INVALID"]);
    }

    const rootValidation = validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate(provenanceRootInput);
    if (rootValidation.validationState !== "VALID_PROVENANCE_ROOT_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["PROVENANCE_ROOT_INVALID"]);
    }

    const reference = referenceInput as ConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate;
    const envelope = envelopeInput as ConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceSignedEnvelopeCandidate;
    const root = provenanceRootInput as ConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate;

    if (envelope.referenceId !== reference.referenceId) {
      return result("REJECTED", ["REFERENCE_ID_BINDING_MISMATCH"]);
    }

    if (envelope.provenanceAuthorityId !== root.authorityId) {
      return result("REJECTED", ["AUTHORITY_ID_BINDING_MISMATCH"], true, false, false);
    }

    if (envelope.provenanceKeyId !== root.keyId) {
      return result("REJECTED", ["KEY_ID_BINDING_MISMATCH"], true, true, false);
    }

    if (root.state !== "ACTIVE") {
      return result("REJECTED", ["PROVENANCE_ROOT_NOT_ACTIVE"], true, true, true, false);
    }

    const payload = createConstitutionalOwnerReviewerTrustRootIntegrityReferenceProvenanceCanonicalPayload({
      reference,
      provenanceAuthorityId: envelope.provenanceAuthorityId,
      provenanceKeyId: envelope.provenanceKeyId,
      signatureAlgorithm: envelope.signatureAlgorithm,
    });

    if (payload.payloadState !== "CANONICAL_PROVENANCE_PAYLOAD_READY_NO_PROOF" || payload.canonicalPayload === null) {
      return result("REJECTED", ["CANONICAL_PAYLOAD_FAILED"], true, true, true, true);
    }

    let cryptographicSignatureValid = false;
    try {
      cryptographicSignatureValid = verifyEd25519(
        null,
        Buffer.from(payload.canonicalPayload, "utf8"),
        root.publicKeyPem,
        Buffer.from(envelope.signatureBase64Url, "base64url"),
      );
    } catch {
      return result("REJECTED", ["CRYPTOGRAPHIC_VERIFICATION_FAILED"], true, true, true, true);
    }

    if (!cryptographicSignatureValid) {
      return result("REJECTED", ["SIGNATURE_INVALID"], true, true, true, true, false);
    }

    return result(
      "CRYPTOGRAPHIC_PROVENANCE_SIGNATURE_VALID_NO_ROOT_TRUST",
      [],
      true,
      true,
      true,
      true,
      true,
    );
  } catch {
    return result("REJECTED", ["INPUT_ACCESS_FAILED"]);
  }
}