import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_BOUNDARY,
  CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION,
} from "../aiWorkforceConstitutionalIssuerEnrollmentEvidence";

describe("constitutional issuer enrollment evidence boundary", () => {
  it("defines enrollment evidence without enrolling or trusting an issuer", () => {
    expect(CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION).toBe(
      "NEXUS_CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_V1",
    );
    expect(CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_ENROLLMENT_NO_TRUST",
      callerSuppliedEnrollmentAccepted: false,
      issuerSelfEnrollmentAccepted: false,
      promptOrModelEnrollmentAccepted: false,
      ownerWordingAloneAccepted: false,
      unsignedConfigurationEnrollmentAccepted: false,
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
    expect(Object.isFrozen(CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_BOUNDARY)).toBe(true);
  });
});