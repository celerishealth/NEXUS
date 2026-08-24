import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerEnrollmentEvidence";
import { validateConstitutionalIssuerEnrollmentEvidenceCandidate } from "../aiWorkforceConstitutionalIssuerEnrollmentEvidenceValidator";

const candidate = () => ({
  schemaVersion: CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION,
  enrollmentEvidenceId: "issuer-enrollment-1",
  issuerId: "issuer-1",
  producerComponentId: "constitutional-evidence-producer-1",
  producerIdentityEvidenceDigest: "a".repeat(64),
  trustBindingId: "binding-1",
  keyId: "key-1",
  requestedActionClasses: ["INQUIRY_CREATE"],
  requestedCapabilities: ["CREATE_INQUIRY"],
  evidenceAuthorityPurpose: "constitutional-evidence-only",
  enrollmentDecisionId: "enrollment-decision-1",
  enrolledBy: "owner-enrollment-authority-1",
  provenanceSourceId: "owner-controlled-enrollment-source-1",
  integrityState: "VERIFIED",
  enrolledAt: "2026-08-23T05:30:00.000Z",
});

describe("constitutional issuer enrollment evidence validator", () => {
  it("accepts coherent evidence without enrolling or trusting the issuer", () => {
    const value = validateConstitutionalIssuerEnrollmentEvidenceCandidate(candidate());
    expect(value.validationState).toBe("VALID_ENROLLMENT_EVIDENCE_CANDIDATE_NO_ENROLLMENT");
    expect(value.failureCodes).toEqual([]);
    expect(value.issuerEnrolled).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
    expect(value.keyActivated).toBe(false);
    expect(value.admissionProjectionAuthorized).toBe(false);
    expect(value.constitutionalExecutionAuthorityGranted).toBe(false);
  });

  it("rejects malformed identity digest and empty or duplicate scopes", () => {
    const value = validateConstitutionalIssuerEnrollmentEvidenceCandidate({
      ...candidate(),
      producerIdentityEvidenceDigest: "not-a-digest",
      requestedActionClasses: ["INQUIRY_CREATE", "INQUIRY_CREATE"],
      requestedCapabilities: [],
    });
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(expect.arrayContaining([
      "IDENTITY_EVIDENCE_DIGEST_INVALID",
      "SCOPE_INVALID",
    ]));
    expect(value.issuerEnrolled).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
  });

  it("does not treat caller-asserted VERIFIED integrity as independent enrollment proof", () => {
    const value = validateConstitutionalIssuerEnrollmentEvidenceCandidate({
      ...candidate(),
      integrityState: "VERIFIED",
      enrolledBy: "caller-asserted-owner",
      provenanceSourceId: "caller-asserted-source",
    });
    expect(value.validationState).toBe("VALID_ENROLLMENT_EVIDENCE_CANDIDATE_NO_ENROLLMENT");
    expect(value.issuerEnrolled).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.keyActivated).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });
    const value = validateConstitutionalIssuerEnrollmentEvidenceCandidate(hostile);
    expect(value.validationState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.issuerEnrolled).toBe(false);
    expect(value.runtimeTrustEstablished).toBe(false);
  });
});