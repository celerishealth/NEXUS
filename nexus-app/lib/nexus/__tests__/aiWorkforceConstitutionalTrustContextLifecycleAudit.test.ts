import {
  describe,
  expect,
  it,
} from "vitest";
import {
  createConstitutionalTrustContextLifecycleAuditRecord,
  verifyConstitutionalTrustContextLifecycleAuditRecord,
} from "../aiWorkforceConstitutionalTrustContextLifecycleAudit";

const trustDigest =
  "a".repeat(64);

describe("constitutional trust-context lifecycle audit", () => {
  it("creates an immutable initial audit record without granting trust or authority", () => {
    const record =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "trust-lifecycle-1",
        eventId: "event-1",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest: trustDigest,
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason:
          "Bootstrap-oriented lifecycle evidence observation.",
      });

    expect(Object.isFrozen(record)).toBe(true);
    expect(record.trustedTimeEstablished).toBe(false);
    expect(record.productionTrustEstablished).toBe(false);
    expect(record.runtimeIntegrationAuthorized).toBe(false);
    expect(
      record.constitutionalExecutionAuthorityGranted,
    ).toBe(false);

    expect(
      verifyConstitutionalTrustContextLifecycleAuditRecord(
        record,
        null,
      ),
    ).toEqual({
      valid: true,
      failureCodes: [],
      trustedTimeEstablished: false,
      productionTrustEstablished: false,
      runtimeIntegrationAuthorized: false,
      constitutionalExecutionAuthorityGranted:
        false,
    });
  });

  it("creates a verifiable hash chain for lifecycle rotation", () => {
    const first =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "trust-lifecycle-1",
        eventId: "event-1",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest: trustDigest,
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason: "Initial observation.",
      });

    const second =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "trust-lifecycle-1",
        eventId: "event-2",
        sequence: 2,
        event: "ROTATED",
        trustContextDigest:
          "b".repeat(64),
        previousRecordDigest:
          first.recordDigest,
        observedAt:
          "2026-08-23T01:00:00.000Z",
        reason:
          "Rotation evidence observation.",
      });

    const verification =
      verifyConstitutionalTrustContextLifecycleAuditRecord(
        second,
        first.recordDigest,
      );

    expect(verification.valid).toBe(true);
    expect(verification.failureCodes).toEqual([]);
  });

  it("detects lifecycle record tampering", () => {
    const record =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "trust-lifecycle-1",
        eventId: "event-1",
        sequence: 1,
        event: "ACTIVATED",
        trustContextDigest: trustDigest,
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason: "Initial observation.",
      });

    const tampered = {
      ...record,
      reason: "tampered",
    };

    const verification =
      verifyConstitutionalTrustContextLifecycleAuditRecord(
        tampered,
        null,
      );

    expect(verification.valid).toBe(false);
    expect(verification.failureCodes).toContain(
      "TRUST_LIFECYCLE_AUDIT_DIGEST_MISMATCH",
    );
  });

  it("fails construction when a non-initial record has no chain predecessor", () => {
    expect(() =>
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "trust-lifecycle-1",
        eventId: "event-2",
        sequence: 2,
        event: "REVOKED",
        trustContextDigest: trustDigest,
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason: "Revocation observation.",
      }),
    ).toThrow(
      "Non-initial lifecycle audit record requires a previous digest.",
    );
  });

  it("records ambiguous lifecycle state without turning ambiguity into trust", () => {
    const record =
      createConstitutionalTrustContextLifecycleAuditRecord({
        lifecycleId: "trust-lifecycle-ambiguous",
        eventId: "event-ambiguous",
        sequence: 1,
        event: "AMBIGUOUS_STATE_DETECTED",
        trustContextDigest: trustDigest,
        previousRecordDigest: null,
        observedAt:
          "2026-08-23T00:00:00.000Z",
        reason:
          "Ambiguous lifecycle state observed.",
      });

    expect(record.trustedTimeEstablished).toBe(false);
    expect(record.productionTrustEstablished).toBe(false);
    expect(record.runtimeIntegrationAuthorized).toBe(false);
    expect(
      record.constitutionalExecutionAuthorityGranted,
    ).toBe(false);
  });
});