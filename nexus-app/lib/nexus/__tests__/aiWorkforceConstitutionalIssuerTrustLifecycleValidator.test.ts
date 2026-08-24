import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerTrustLifecycle";
import { validateConstitutionalIssuerTrustLifecycleCandidate } from "../aiWorkforceConstitutionalIssuerTrustLifecycleValidator";

const candidate = () => ({
  schemaVersion: CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION,
  trustBindingId: "binding-1",
  issuerId: "issuer-1",
  activeKeyId: "key-1",
  permittedActionClasses: ["INQUIRY_CREATE"],
  permittedCapabilities: ["CREATE_INQUIRY"],
  trustState: "VERIFIED",
  status: "ACTIVE",
  keyState: "ACTIVE",
  evidenceAuthorityPurpose: "constitutional-evidence-only",
  provenanceSourceId: "owner-controlled-source-1",
  integrityState: "VERIFIED",
  reviewedBy: "owner-review-identity-1",
  reviewDecisionId: "decision-1",
  activatedAt: "2026-08-23T05:00:00.000Z",
  verifiedAt: "2026-08-23T05:01:00.000Z",
  expiresAt: "2026-08-23T06:00:00.000Z",
});

describe("constitutional issuer trust lifecycle validator", () => {
  it("accepts a coherent lifecycle candidate without establishing trust", () => {
    const value = validateConstitutionalIssuerTrustLifecycleCandidate(candidate());
    expect(value.validationState).toBe("VALID_CANDIDATE_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
    expect(value.constitutionalExecutionAuthorityGranted).toBe(false);
  });

  it("never treats caller-asserted VERIFIED labels as runtime trust", () => {
    const value = validateConstitutionalIssuerTrustLifecycleCandidate({
      ...candidate(),
      reviewedBy: "caller-self-assertion",
      provenanceSourceId: "caller-self-assertion",
    });
    expect(value.validationState).toBe("VALID_CANDIDATE_NO_TRUST");
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.providerExecutionAuthorized).toBe(false);
    expect(value.paymentExecutionAuthorized).toBe(false);
    expect(value.legalFilingAuthorized).toBe(false);
    expect(value.externalDeliveryAuthorized).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });

  it("fails closed on malformed scope, lifecycle state, or timestamp ordering", () => {
    const value = validateConstitutionalIssuerTrustLifecycleCandidate({
      ...candidate(),
      permittedCapabilities: [],
      keyState: "MAGIC_ACTIVE",
      verifiedAt: "2026-08-23T07:00:00.000Z",
      expiresAt: "2026-08-23T06:00:00.000Z",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "SCOPE_INVALID",
      "LIFECYCLE_STATE_INVALID",
      "TIMESTAMP_ORDER_INVALID",
    ]));
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
  });
  it("fails closed when an untrusted candidate getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });

    const value = validateConstitutionalIssuerTrustLifecycleCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
    expect(value.constitutionalExecutionAuthorityGranted).toBe(false);
  });
});