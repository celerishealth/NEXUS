import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_BOUNDARY,
  CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION,
} from "../aiWorkforceConstitutionalOwnerReviewerTrustAnchor";

describe("constitutional owner reviewer trust-anchor boundary", () => {
  it("defines a non-trusting owner-reviewer public-key anchor contract", () => {
    expect(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION).toBe(
      "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_V1",
    );
    expect(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_RUNTIME_TRUST",
      callerSuppliedAnchorAcceptedAsTrust: false,
      admissionPayloadAnchorAcceptedAsTrust: false,
      promptOrModelAnchorAcceptedAsTrust: false,
      unsignedConfigurationAnchorAcceptedAsTrust: false,
      privateKeyMaterialRequiredAtRuntime: false,
      runtimeTrustEstablished: false,
      issuerTrustEstablished: false,
      admissionProjectionAuthorized: false,
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
    expect(Object.isFrozen(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_BOUNDARY)).toBe(true);
  });
});