import { describe, expect, it } from "vitest";
import { createInMemoryConstitutionalTrustContextResolver } from "../aiWorkforceConstitutionalInMemoryTrustContextResolver";

describe("AI Workforce Constitutional In-Memory Trust Context Resolver — Section 6C", () => {
  it("fails closed when the bootstrap snapshot trust envelope is unverified, corrupt, or stale", async () => {
    const baseSnapshot = {
      resolverId: "owner-bootstrap-resolver-envelope-test",
      snapshotId: "snapshot-envelope-test",
      provenanceSourceId: "owner-bootstrap-source-test",
      provenanceState: "VERIFIED" as const,
      integrityState: "VERIFIED" as const,
      verifiedAt: "2026-08-22T12:55:00.000Z",
      expiresAt: "2026-08-22T13:05:00.000Z",
      trustedIssuers: {},
      sourceEvidenceRegistry: {},
      sourceEvidenceRegistryTrust: {
        registryId: "registry-envelope-test",
        provenanceSourceId: "registry-source-envelope-test",
        provenanceState: "VERIFIED" as const,
        integrityState: "VERIFIED" as const,
        verifiedAt: "2026-08-22T12:55:00.000Z",
        expiresAt: "2026-08-22T13:05:00.000Z",
      },
      verificationSecrets: {},
      now: "2026-08-22T13:00:00.000Z",
    };

    const cases = [
      {
        name: "unverified provenance",
        patch: {
          provenanceState: "UNVERIFIED" as const,
        },
        expectedFailure:
          "TRUST_CONTEXT_PROVENANCE_UNVERIFIED",
      },
      {
        name: "unverified integrity",
        patch: {
          integrityState: "UNVERIFIED" as const,
        },
        expectedFailure: "TRUST_CONTEXT_CORRUPT",
      },
      {
        name: "stale snapshot",
        patch: {
          expiresAt: "2026-08-22T12:59:59.000Z",
        },
        expectedFailure: "TRUST_CONTEXT_STALE",
      },
    ] as const;

    for (const testCase of cases) {
      const resolver =
        createInMemoryConstitutionalTrustContextResolver({
          ...baseSnapshot,
          ...testCase.patch,
        });

      const result = await resolver.resolveTrustContext({
        expectedTenantId: "tenant-1",
        expectedActorId: "actor-1",
        expectedActionId: "action-1",
        expectedActionClass: "INQUIRY_CREATE",
        expectedRequestedCapability: "CREATE_INQUIRY",
        expectedPayloadDigest: "a".repeat(64),
      });

      expect(result.resolutionState, testCase.name).toBe(
        "BLOCKED",
      );

      if (result.resolutionState !== "BLOCKED") {
        throw new Error(
          `Expected blocked snapshot: ${testCase.name}`,
        );
      }

      expect(result.failureCode, testCase.name).toBe(
        testCase.expectedFailure,
      );
      expect(result.verificationContext).toBeNull();
      expect(
        result.constitutionalExecutionAuthorityGranted,
      ).toBe(false);
      expect(result.providerExecutionAuthorized).toBe(false);
      expect(result.paymentExecutionAuthorized).toBe(false);
      expect(result.legalFilingAuthorized).toBe(false);
      expect(result.externalDeliveryAuthorized).toBe(false);
      expect(result.publicLaunchAuthorized).toBe(false);
    }
  });
  it("uses bootstrap-owned trust material and ignores caller attempts to inject trusted dependencies", async () => {
    const resolver =
      createInMemoryConstitutionalTrustContextResolver({
        resolverId: "owner-bootstrap-resolver-1",
        snapshotId: "snapshot-1",
        provenanceSourceId: "owner-bootstrap-source-1",
        provenanceState: "VERIFIED",
        integrityState: "VERIFIED",
        verifiedAt: "2026-08-22T12:55:00.000Z",
        expiresAt: "2026-08-22T13:05:00.000Z",
        trustedIssuers: {
          "trusted-issuer": {
            issuerId: "trusted-issuer",
            keyId: "trusted-key",
            status: "ACTIVE",
            trustState: "VERIFIED",
            allowedActionClasses: ["INQUIRY_CREATE"],
            allowedCapabilities: ["CREATE_INQUIRY"],
          },
        },
        sourceEvidenceRegistry: {
          ["b".repeat(64)]: {
            evidenceId: "trusted-evidence-1",
            digest: "b".repeat(64),
            provenanceSourceId: "trusted-source-1",
            provenanceState: "VERIFIED",
            lifecycleState: "ACTIVE",
            verificationState: "VERIFIED",
            conflictState: "CLEAR",
            verifiedAt: "2026-08-22T12:58:00.000Z",
            expiresAt: "2026-08-22T13:02:00.000Z",
          },
        },
        sourceEvidenceRegistryTrust: {
          registryId: "trusted-registry-1",
          provenanceSourceId: "trusted-registry-source-1",
          provenanceState: "VERIFIED",
          integrityState: "VERIFIED",
          verifiedAt: "2026-08-22T12:57:00.000Z",
          expiresAt: "2026-08-22T13:03:00.000Z",
        },
        verificationSecrets: {
          "trusted-key": "bootstrap-secret",
        },
        now: "2026-08-22T13:00:00.000Z",
      });

    const untrustedRequest = {
      expectedTenantId: "tenant-1",
      expectedActorId: "actor-1",
      expectedActionId: "action-1",
      expectedActionClass: "INQUIRY_CREATE",
      expectedRequestedCapability: "CREATE_INQUIRY",
      expectedPayloadDigest: "a".repeat(64),

      trustedIssuers: {
        attacker: {
          issuerId: "attacker",
        },
      },
      sourceEvidenceRegistry: {
        attacker: {},
      },
      sourceEvidenceRegistryTrust: {
        registryId: "attacker-registry",
      },
      verificationSecrets: {
        attacker: "attacker-secret",
      },
      now: "2099-01-01T00:00:00.000Z",
    };

    const result = await resolver.resolveTrustContext(
      untrustedRequest,
    );

    expect(result.resolutionState).toBe("RESOLVED_NO_AUTHORITY");

    if (result.resolutionState !== "RESOLVED_NO_AUTHORITY") {
      throw new Error("Expected resolved trust context.");
    }

    expect(
      Object.keys(result.verificationContext.trustedIssuers),
    ).toEqual(["trusted-issuer"]);
    expect(
      result.verificationContext.sourceEvidenceRegistryTrust
        ?.registryId,
    ).toBe("trusted-registry-1");
    expect(
      result.verificationContext.verificationSecrets,
    ).toEqual({
      "trusted-key": "bootstrap-secret",
    });
    expect(result.verificationContext.now).toBe(
      "2026-08-22T13:00:00.000Z",
    );
    expect(
      "attacker" in
        result.verificationContext.trustedIssuers,
    ).toBe(false);
    expect(
      "attacker" in
        result.verificationContext.verificationSecrets,
    ).toBe(false);

    expect(
      result.constitutionalExecutionAuthorityGranted,
    ).toBe(false);
    expect(result.providerExecutionAuthorized).toBe(false);
    expect(result.paymentExecutionAuthorized).toBe(false);
    expect(result.legalFilingAuthorized).toBe(false);
    expect(result.externalDeliveryAuthorized).toBe(false);
    expect(result.publicLaunchAuthorized).toBe(false);
  });
});