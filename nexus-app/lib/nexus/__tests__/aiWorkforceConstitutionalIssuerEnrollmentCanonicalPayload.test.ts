import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ISSUER_ENROLLMENT_EVIDENCE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerEnrollmentEvidence";
import {
  CONSTITUTIONAL_ISSUER_ENROLLMENT_DECISION_DOMAIN,
  createConstitutionalIssuerEnrollmentCanonicalPayload,
} from "../aiWorkforceConstitutionalIssuerEnrollmentCanonicalPayload";

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

describe("constitutional issuer enrollment canonical payload", () => {
  it("creates deterministic domain-separated enrollment payload without enrollment or trust", () => {
    const first = createConstitutionalIssuerEnrollmentCanonicalPayload(candidate());
    const second = createConstitutionalIssuerEnrollmentCanonicalPayload(candidate());
    expect(first.payloadState).toBe("CANONICAL_ENROLLMENT_PAYLOAD_READY_NO_ENROLLMENT");
    expect(first.canonicalPayload).toBe(second.canonicalPayload);
    expect(first.canonicalPayload?.startsWith(`${CONSTITUTIONAL_ISSUER_ENROLLMENT_DECISION_DOMAIN}\n`)).toBe(true);
    expect(first.issuerEnrolled).toBe(false);
    expect(first.runtimeTrustEstablished).toBe(false);
    expect(first.issuerTrustEstablished).toBe(false);
    expect(first.keyActivated).toBe(false);
  });

  it("binds requested scope changes into a different payload", () => {
    const first = createConstitutionalIssuerEnrollmentCanonicalPayload(candidate());
    const second = createConstitutionalIssuerEnrollmentCanonicalPayload({
      ...candidate(),
      requestedCapabilities: ["CREATE_INQUIRY", "CREATE_QUOTATION"],
    });
    expect(first.payloadState).toBe("CANONICAL_ENROLLMENT_PAYLOAD_READY_NO_ENROLLMENT");
    expect(second.payloadState).toBe("CANONICAL_ENROLLMENT_PAYLOAD_READY_NO_ENROLLMENT");
    expect(second.canonicalPayload).not.toBe(first.canonicalPayload);
    expect(second.issuerEnrolled).toBe(false);
  });

  it("rejects structurally invalid enrollment evidence", () => {
    const value = createConstitutionalIssuerEnrollmentCanonicalPayload({
      ...candidate(),
      producerIdentityEvidenceDigest: "bad",
    });
    expect(value.payloadState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_INVALID"]);
    expect(value.canonicalPayload).toBeNull();
    expect(value.issuerEnrolled).toBe(false);
    expect(value.issuerTrustEstablished).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });
    const value = createConstitutionalIssuerEnrollmentCanonicalPayload(hostile);
    expect(value.payloadState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.canonicalPayload).toBeNull();
    expect(value.issuerEnrolled).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});