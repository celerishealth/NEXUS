import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_BOUNDARY,
  CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION,
} from "../aiWorkforceConstitutionalIssuerTrustLifecycle";

describe("constitutional issuer trust lifecycle boundary", () => {
  it("keeps the Section 6A lifecycle seam non-trusting and non-executing", () => {
    expect(CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION).toBe(
      "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_V1",
    );
    expect(CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_RUNTIME_TRUST",
      callerSuppliedTrustAccepted: false,
      unsignedConfigurationCreatesTrust: false,
      ownerWordingAloneCreatesTrust: false,
      admissionPayloadCreatesTrust: false,
      verificationMaterialAcceptedFromCaller: false,
      runtimeTrustEstablished: false,
      admissionProjectionAuthorized: false,
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
    expect(Object.isFrozen(CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_BOUNDARY)).toBe(true);
  });
});