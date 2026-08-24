import { describe, expect, it } from "vitest";
import {
  CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_BOUNDARY,
  CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION,
} from "../aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRoot";

describe("constitutional owner reviewer provenance-authority root boundary", () => {
  it("defines a bootstrap-bound public Ed25519 root source without establishing trust", () => {
    expect(CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION).toBe(
      "NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_V1",
    );
    expect(CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_BOUNDARY).toEqual({
      boundaryState: "CONTRACT_ONLY_NO_PROVENANCE_TRUST",
      ordinaryCallerMaySupplyRoot: false,
      ordinaryCallerMayOverrideRoot: false,
      requestPayloadMaySupplyPublicKey: false,
      promptOrModelMaySupplyPublicKey: false,
      unsignedConfigurationMayCreateTrust: false,
      hmacOwnerAuthorizationReuseAuthorized: false,
      privateSigningMaterialRequiredAtRuntime: false,
      privateSigningMaterialAcceptedFromCaller: false,
      existingNexusDatabaseReuseAuthorized: false,
      existingPostgresReuseAuthorized: false,
      existingSqliteReuseAuthorized: false,
      providerBootstrapReuseAuthorized: false,
      provenanceRootTrusted: false,
      referenceProvenanceVerified: false,
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
    expect(Object.isFrozen(CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_BOUNDARY)).toBe(true);
  });
});