import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReference";
import { validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate } from "../aiWorkforceConstitutionalOwnerReviewerTrustRootIntegrityReferenceValidator";

const candidate = () => ({
  referenceVersion: CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_VERSION,
  referenceId: "trust-root-integrity-reference-1",
  trustRootSourceId: "owner-trust-root-source-1",
  snapshotId: "snapshot-1",
  sequence: 1,
  expectedDigest: "a".repeat(64),
  provenanceSourceId: "owner-bootstrap-integrity-source-1",
  referenceState: "VERIFIED",
  establishedAt: "2026-08-23T06:30:00.000Z",
});

describe("constitutional owner reviewer trust-root integrity-reference validator", () => {
  it("accepts a coherent reference candidate without establishing provenance or trust", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate(candidate());
    expect(value.validationState).toBe("VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST");
    expect(value.failureCodes).toEqual([]);
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.integrityVerified).toBe(false);
    expect(value.reviewerKeyTrusted).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("rejects malformed sequence and expected digest", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate({
      ...candidate(),
      sequence: 0,
      expectedDigest: "BAD-DIGEST",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "SEQUENCE_INVALID",
      "EXPECTED_DIGEST_INVALID",
    ]));
    expect(value.integrityVerified).toBe(false);
  });

  it("rejects invalid reference state and timestamp", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate({
      ...candidate(),
      referenceState: "TRUSTED",
      establishedAt: "not-a-time",
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "REFERENCE_STATE_INVALID",
      "ESTABLISHED_AT_INVALID",
    ]));
    expect(value.referenceProvenanceVerified).toBe(false);
  });

  it("does not treat caller-asserted VERIFIED state as provenance proof", () => {
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate({
      ...candidate(),
      referenceState: "VERIFIED",
      provenanceSourceId: "caller-asserted-provenance",
    });
    expect(value.validationState).toBe("VALID_INTEGRITY_REFERENCE_CANDIDATE_NO_TRUST");
    expect(value.referenceProvenanceVerified).toBe(false);
    expect(value.integrityVerified).toBe(false);
    expect(value.rollbackProtectionVerified).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "referenceVersion", {
      enumerable: true,
      get() { throw new Error("hostile getter"); },
    });
    const value = validateConstitutionalOwnerReviewerTrustRootIntegrityReferenceCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.integrityVerified).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });
});