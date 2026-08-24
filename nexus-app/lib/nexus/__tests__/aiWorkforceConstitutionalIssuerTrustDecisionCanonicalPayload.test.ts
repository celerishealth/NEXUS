import { describe, expect, it } from "vitest";
import { CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION } from "../aiWorkforceConstitutionalIssuerTrustLifecycle";
import {
  CONSTITUTIONAL_ISSUER_TRUST_DECISION_DOMAIN,
  createConstitutionalIssuerTrustDecisionCanonicalPayload,
} from "../aiWorkforceConstitutionalIssuerTrustDecisionCanonicalPayload";

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

describe("constitutional issuer trust decision canonical payload", () => {
  it("creates a deterministic domain-separated payload without establishing trust", () => {
    const first = createConstitutionalIssuerTrustDecisionCanonicalPayload(candidate());
    const second = createConstitutionalIssuerTrustDecisionCanonicalPayload(candidate());
    expect(first.payloadState).toBe("CANONICAL_PAYLOAD_READY_NO_TRUST");
    expect(first.canonicalPayload).toBe(second.canonicalPayload);
    expect(first.canonicalPayload?.startsWith(`${CONSTITUTIONAL_ISSUER_TRUST_DECISION_DOMAIN}\n`)).toBe(true);
    expect(first.runtimeTrustEstablished).toBe(false);
    expect(first.admissionProjectionAuthorized).toBe(false);
    expect(first.constitutionalExecutionAuthorityGranted).toBe(false);
  });

  it("binds scope changes into a different canonical payload", () => {
    const first = createConstitutionalIssuerTrustDecisionCanonicalPayload(candidate());
    const second = createConstitutionalIssuerTrustDecisionCanonicalPayload({
      ...candidate(),
      permittedCapabilities: ["CREATE_INQUIRY", "CREATE_QUOTATION"],
    });
    expect(first.payloadState).toBe("CANONICAL_PAYLOAD_READY_NO_TRUST");
    expect(second.payloadState).toBe("CANONICAL_PAYLOAD_READY_NO_TRUST");
    expect(second.canonicalPayload).not.toBe(first.canonicalPayload);
    expect(second.runtimeTrustEstablished).toBe(false);
  });

  it("rejects a structurally invalid lifecycle candidate", () => {
    const value = createConstitutionalIssuerTrustDecisionCanonicalPayload({
      ...candidate(),
      permittedCapabilities: [],
    });
    expect(value.payloadState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_INVALID"]);
    expect(value.canonicalPayload).toBeNull();
    expect(value.runtimeTrustEstablished).toBe(false);
  });

  it("fails closed when an untrusted getter throws", () => {
    const hostile = Object.defineProperty({}, "schemaVersion", {
      enumerable: true,
      get() {
        throw new Error("hostile getter");
      },
    });
    const value = createConstitutionalIssuerTrustDecisionCanonicalPayload(hostile);
    expect(value.payloadState).toBe("REJECTED");
    expect(value.failureCodes).toEqual(["CANDIDATE_ACCESS_FAILED"]);
    expect(value.canonicalPayload).toBeNull();
    expect(value.runtimeTrustEstablished).toBe(false);
    expect(value.publicLaunchAuthorized).toBe(false);
  });
});