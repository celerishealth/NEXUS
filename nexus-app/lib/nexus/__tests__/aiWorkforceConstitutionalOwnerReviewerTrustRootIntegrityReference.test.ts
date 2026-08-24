import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_BOUNDARY,
  CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION,
} from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";

describe("constitutional owner reviewer trust-root integrity-reference boundary", () => {
  it("defines an independent bootstrap-bound expected-digest source without establishing trust", () => {
    expect(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION).toBe(
      "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_V1",
    );
    expect(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_INTEGRITY_TRUST",
      ordinaryCallerMaySupplyReference: false,
      ordinaryCallerMayOverrideReference: false,
      requestPayloadMaySupplyExpectedDigest: false,
      promptOrModelMaySupplyExpectedDigest: false,
      snapshotMaySelfAuthenticateDigest: false,
      unsignedConfigurationMayCreateTrust: false,
      existingNexusDatabaseReuseAuthorized: false,
      existingPostgresReuseAuthorized: false,
      existingSqliteReuseAuthorized: false,
      integrityVerified: false,
      freshnessVerified: false,
      rollbackProtectionVerified: false,
      reviewerKeyTrusted: false,
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
    expect(Object.isFrozen(CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_BOUNDARY)).toBe(true);
  });
});