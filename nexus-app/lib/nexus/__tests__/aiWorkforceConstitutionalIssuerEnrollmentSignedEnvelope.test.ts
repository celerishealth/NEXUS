import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_BOUNDARY,
  CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION,
} from "../aiWorkforceConstitutionalIssuerEnrollmentSignedEnvelope";

describe("constitutional issuer enrollment signed-envelope boundary", () => {
  it("binds reviewer signature metadata without proving signature, anchor trust, or enrollment", () => {
    expect(CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_SCHEMA_VERSION).toBe(
      "NEXUS_CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_V1",
    );
    expect(CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_SIGNATURE_PROOF_NO_ENROLLMENT",
      callerSuppliedEnvelopeAcceptedAsProof: false,
      callerSuppliedAnchorAcceptedAsTrust: false,
      signatureVerified: false,
      reviewerIdentityVerified: false,
      reviewerKeyTrusted: false,
      issuerEnrolled: false,
      runtimeTrustEstablished: false,
      issuerTrustEstablished: false,
      keyActivated: false,
      admissionProjectionAuthorized: false,
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
    expect(Object.isFrozen(CONSTITUTIONAL_ISSUER_ENROLLMENT_SIGNED_ENVELOPE_BOUNDARY)).toBe(true);
  });
});