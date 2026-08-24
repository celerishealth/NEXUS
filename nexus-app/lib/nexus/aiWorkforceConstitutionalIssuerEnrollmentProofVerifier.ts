import type { ConstitutionalIssuerEnrollmentEvidenceCandidate } from "./aiWorkforceConstitutionalIssuerEnrollmentEvidence";
import { validateConstitutionalIssuerEnrollmentEvidenceCandidate } from "./aiWorkforceConstitutionalIssuerEnrollmentEvidenceValidator";
import { createConstitutionalIssuerEnrollmentCanonicalPayload } from "./aiWorkforceConstitutionalIssuerEnrollmentCanonicalPayload";
import type { ConstitutionalIssuerEnrollmentSignedEnvelopeCandidate } from "./aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelope";
import { validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate } from "./aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelopeValidator";
import type { ConstitutionalOwnerReviewerTrustAnchorCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustAnchor";
import { validateConstitutionalOwnerReviewerTrustAnchorCandidate } from "./aiWorkforceConstitutionalOwnerReviewerTrustAnchorValidator";
import { verifyConstitutionalIssuerTrustEd25519Proof } from "./aiWorkforceConstitutionalIssuerTrustEd25519Verifier";

export type ConstitutionalIssuerEnrollmentProofFailureCode =
  | "ENROLLMENT_EVIDENCE_INVALID"
  | "SIGNED_ENVELOPE_INVALID"
  | "REVIEWER_ANCHOR_INVALID"
  | "ENROLLMENT_BINDING_MISMATCH"
  | "REVIEWER_IDENTITY_BINDING_MISMATCH"
  | "REVIEWER_ANCHOR_BINDING_MISMATCH"
  | "REVIEWER_KEY_BINDING_MISMATCH"
  | "ALGORITHM_BINDING_MISMATCH"
  | "REVIEWER_ANCHOR_NOT_ACTIVE_OR_VERIFIED"
  | "CANONICAL_PAYLOAD_FAILED"
  | "CRYPTOGRAPHIC_VERIFICATION_FAILED"
  | "INPUT_ACCESS_FAILED";

export interface ConstitutionalIssuerEnrollmentProofVerificationResult {
  readonly proofState: "CRYPTOGRAPHIC_ENROLLMENT_PROOF_VALID_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerEnrollmentProofFailureCode[];
  readonly exactBindingVerified: boolean;
  readonly signatureVerified: boolean;
  readonly reviewerIdentityVerified: false;
  readonly reviewerKeyTrusted: false;
  readonly issuerEnrolled: false;
  readonly runtimeTrustEstablished: false;
  readonly issuerTrustEstablished: false;
  readonly keyActivated: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const result = (
  proofState: ConstitutionalIssuerEnrollmentProofVerificationResult["proofState"],
  failureCodes: readonly ConstitutionalIssuerEnrollmentProofFailureCode[],
  exactBindingVerified = false,
  signatureVerified = false,
): ConstitutionalIssuerEnrollmentProofVerificationResult => Object.freeze({
  proofState,
  failureCodes: Object.freeze([...failureCodes]),
  exactBindingVerified,
  signatureVerified,
  reviewerIdentityVerified: false as const,
  reviewerKeyTrusted: false as const,
  issuerEnrolled: false as const,
  runtimeTrustEstablished: false as const,
  issuerTrustEstablished: false as const,
  keyActivated: false as const,
  admissionProjectionAuthorized: false as const,
  constitutionalExecutionAuthorityGranted: false as const,
  providerExecutionAuthorized: false as const,
  paymentExecutionAuthorized: false as const,
  legalFilingAuthorized: false as const,
  externalDeliveryAuthorized: false as const,
  publicLaunchAuthorized: false as const,
});

/**
 * Verifies exact cross-binding and Ed25519 possession only.
 * The reviewer anchor supplied here is still an untrusted candidate; therefore
 * even a valid cryptographic proof cannot enroll or trust the issuer.
 */
export function verifyConstitutionalIssuerEnrollmentProof(
  enrollmentEvidenceInput: unknown,
  signedEnvelopeInput: unknown,
  reviewerAnchorInput: unknown,
): ConstitutionalIssuerEnrollmentProofVerificationResult {
  try {
    const enrollmentValidation = validateConstitutionalIssuerEnrollmentEvidenceCandidate(enrollmentEvidenceInput);
    if (enrollmentValidation.validationState !== "VALID_ENROLLMENT_EVIDENCE_CANDIDATE_NO_ENROLLMENT") {
      return result("REJECTED", ["ENROLLMENT_EVIDENCE_INVALID"]);
    }

    const envelopeValidation = validateConstitutionalIssuerEnrollmentSignedEnvelopeCandidate(signedEnvelopeInput);
    if (envelopeValidation.validationState !== "VALID_SIGNED_ENVELOPE_CANDIDATE_NO_PROOF") {
      return result("REJECTED", ["SIGNED_ENVELOPE_INVALID"]);
    }

    const anchorValidation = validateConstitutionalOwnerReviewerTrustAnchorCandidate(reviewerAnchorInput);
    if (anchorValidation.validationState !== "VALID_ANCHOR_CANDIDATE_NO_TRUST") {
      return result("REJECTED", ["REVIEWER_ANCHOR_INVALID"]);
    }

    const enrollment = enrollmentEvidenceInput as ConstitutionalIssuerEnrollmentEvidenceCandidate;
    const envelope = signedEnvelopeInput as ConstitutionalIssuerEnrollmentSignedEnvelopeCandidate;
    const anchor = reviewerAnchorInput as ConstitutionalOwnerReviewerTrustAnchorCandidate;

    if (
      envelope.enrollmentEvidenceId !== enrollment.enrollmentEvidenceId ||
      envelope.enrollmentDecisionId !== enrollment.enrollmentDecisionId
    ) {
      return result("REJECTED", ["ENROLLMENT_BINDING_MISMATCH"]);
    }

    if (envelope.reviewerId !== enrollment.enrolledBy || envelope.reviewerId !== anchor.reviewerId) {
      return result("REJECTED", ["REVIEWER_IDENTITY_BINDING_MISMATCH"]);
    }

    if (envelope.reviewerAnchorId !== anchor.anchorId) {
      return result("REJECTED", ["REVIEWER_ANCHOR_BINDING_MISMATCH"]);
    }

    if (envelope.reviewerKeyId !== anchor.keyId) {
      return result("REJECTED", ["REVIEWER_KEY_BINDING_MISMATCH"]);
    }

    if (envelope.signatureAlgorithm !== anchor.algorithm) {
      return result("REJECTED", ["ALGORITHM_BINDING_MISMATCH"]);
    }

    if (anchor.state !== "ACTIVE" || anchor.integrityState !== "VERIFIED") {
      return result("REJECTED", ["REVIEWER_ANCHOR_NOT_ACTIVE_OR_VERIFIED"]);
    }

    const canonical = createConstitutionalIssuerEnrollmentCanonicalPayload(enrollment);
    if (canonical.payloadState !== "CANONICAL_ENROLLMENT_PAYLOAD_READY_NO_ENROLLMENT" || !canonical.canonicalPayload) {
      return result("REJECTED", ["CANONICAL_PAYLOAD_FAILED"]);
    }

    const cryptoProof = verifyConstitutionalIssuerTrustEd25519Proof({
      signedCanonicalPayload: canonical.canonicalPayload,
      publicKeyPem: anchor.publicKeyPem,
      signatureBase64Url: envelope.signatureBase64Url,
    });

    if (cryptoProof.proofState !== "CRYPTOGRAPHIC_PROOF_VALID_NO_TRUST") {
      return result("REJECTED", ["CRYPTOGRAPHIC_VERIFICATION_FAILED"], true, false);
    }

    return result("CRYPTOGRAPHIC_ENROLLMENT_PROOF_VALID_NO_TRUST", [], true, true);
  } catch {
    return result("REJECTED", ["INPUT_ACCESS_FAILED"]);
  }
}