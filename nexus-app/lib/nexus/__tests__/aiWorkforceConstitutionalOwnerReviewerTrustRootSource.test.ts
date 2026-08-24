import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_BOUNDARY } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootSource";

describe("constitutional owner reviewer trust-root source boundary", () => {
  it("defines an isolated bootstrap-bound source without granting trust", () => {
    expect(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_RUNTIME_TRUST",
      ordinaryCallerMaySupplySource: false,
      ordinaryCallerMayOverrideSource: false,
      admissionPayloadMaySupplyAnchors: false,
      promptOrModelMaySupplyAnchors: false,
      unsignedConfigurationMayCreateTrust: false,
      existingNexusDatabaseReuseAuthorized: false,
      existingPostgresReuseAuthorized: false,
      existingSqliteReuseAuthorized: false,
      providerBootstrapReuseAuthorized: false,
      runtimeTrustEstablished: false,
      reviewerKeyTrusted: false,
      issuerTrustEstablished: false,
      admissionProjectionAuthorized: false,
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
    expect(Object.isFrozen(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SOURCE_BOUNDARY)).toBe(true);
  });
});