import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createConstitutionalTrustedAdmissionBoundary,
} from "../aiWorkforceConstitutionalTrustedAdmissionOrchestrator";
import type {
  ConstitutionalTrustContextResolutionRequest,
  ConstitutionalTrustContextResolver,
} from "../aiWorkforceConstitutionalTrustContextResolver";
import type {
  ConstitutionalEvidenceReplayStore,
} from "../aiWorkforceConstitutionalEvidenceReplayGuard";

const request: ConstitutionalTrustContextResolutionRequest = {
  expectedTenantId: "tenant-1",
  expectedActorId: "actor-1",
  expectedActionId: "action-1",
  expectedActionClass: "INQUIRY_CREATE",
  expectedRequestedCapability: "CREATE_INQUIRY",
  expectedPayloadDigest: "a".repeat(64),
};

async function orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
  record: unknown,
  requestInput: unknown,
  resolver: ConstitutionalTrustContextResolver | null | undefined,
  replayStore: ConstitutionalEvidenceReplayStore | null | undefined,
) {
  return createConstitutionalTrustedAdmissionBoundary(
    resolver,
    replayStore,
  ).orchestrate(record, requestInput);
}
function expectNoExecutionAuthority(result: {
  admitted: false;
  constitutionalExecutionAuthorityGranted: false;
  providerExecutionAuthorized: false;
  paymentExecutionAuthorized: false;
  legalFilingAuthorized: false;
  externalDeliveryAuthorized: false;
  publicLaunchAuthorized: false;
}) {
  expect(result.admitted).toBe(false);
  expect(result.constitutionalExecutionAuthorityGranted).toBe(false);
  expect(result.providerExecutionAuthorized).toBe(false);
  expect(result.paymentExecutionAuthorized).toBe(false);
  expect(result.legalFilingAuthorized).toBe(false);
  expect(result.externalDeliveryAuthorized).toBe(false);
  expect(result.publicLaunchAuthorized).toBe(false);
}

function stableStringify(value: unknown): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(record[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error("Unsupported signing value.");
}

function validAdmissionRecord() {
  const record = {
    schemaVersion:
      "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_V1",
    constitutionVersion:
      "NEXUS_AI_WORKFORCE_CONSTITUTION_V1",
    tenantId: request.expectedTenantId,
    actorId: request.expectedActorId,
    actionId: request.expectedActionId,
    requesterSource: "EMPLOYEE",
    actionClass: request.expectedActionClass,
    requestedCapability:
      request.expectedRequestedCapability,
    payloadDigest: request.expectedPayloadDigest,
    constitutionalInput: {
      tenantId: request.expectedTenantId,
      actorId: request.expectedActorId,
      requesterSource: "EMPLOYEE",
      actionClass: request.expectedActionClass,
      actionClassState: "KNOWN",
      requestedCapability:
        request.expectedRequestedCapability,
      countryState: "APPROVED",
      authorityState: "AUTHORIZED",
      verificationState: "VERIFIED",
      provenanceState: "VERIFIED",
      legalState: "LAWFUL",
      regulatedActivityState: "NOT_REGULATED",
      riskLevel: "LOW",
      humanApprovalRequirement: "NOT_REQUIRED",
      humanApprovalState: "NOT_APPLICABLE",
      evidenceState: "CLEAR",
      prohibitionFindings: [],
      constitutionalOverrideAttempted: false,
    },
    sourceEvidenceDigests: ["b".repeat(64)],
    evidenceIssuerId: "issuer-1",
    evidenceIssuerKeyId: "key-1",
    issuedAt: "2026-08-22T12:59:00.000Z",
    expiresAt: "2026-08-22T13:01:00.000Z",
    nonce: "nonce-positive-1",
    evaluatedDecision: "ALLOW_CONSTITUTIONALLY",
    signature: "",
  };

  const canonicalPayload = stableStringify({
    schemaVersion: record.schemaVersion,
    constitutionVersion: record.constitutionVersion,
    tenantId: record.tenantId,
    actorId: record.actorId,
    actionId: record.actionId,
    requesterSource: record.requesterSource,
    actionClass: record.actionClass,
    requestedCapability: record.requestedCapability,
    payloadDigest: record.payloadDigest,
    constitutionalInput: record.constitutionalInput,
    sourceEvidenceDigests: record.sourceEvidenceDigests,
    evidenceIssuerId: record.evidenceIssuerId,
    evidenceIssuerKeyId: record.evidenceIssuerKeyId,
    issuedAt: record.issuedAt,
    expiresAt: record.expiresAt,
    nonce: record.nonce,
    evaluatedDecision: record.evaluatedDecision,
  });

  record.signature = createHmac(
    "sha256",
    "verification-secret",
  )
    .update(canonicalPayload, "utf8")
    .digest("hex");

  return record;
}
describe("AI Workforce Constitutional Trusted Admission Orchestrator — Section 6C fail-closed boundary", () => {
  it("never returns resolver verification secrets to the request-time caller", async () => {
    const secretMarker =
      "SECRET_MUST_NEVER_LEAVE_TRUST_BOUNDARY";

    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-secret-redaction-1",
      async resolveTrustContext() {
        return {
          resolutionState: "RESOLVED_NO_AUTHORITY",
          failureCode: null,
          verificationContext: {
            expectedTenantId: request.expectedTenantId,
            expectedActorId: request.expectedActorId,
            expectedActionId: request.expectedActionId,
            expectedActionClass: request.expectedActionClass,
            expectedRequestedCapability:
              request.expectedRequestedCapability,
            expectedPayloadDigest: request.expectedPayloadDigest,
            trustedIssuers: {},
            sourceEvidenceRegistry: {},
            sourceEvidenceRegistryTrust: {
              registryId: "registry-redaction-1",
              provenanceSourceId:
                "registry-source-redaction-1",
              provenanceState: "VERIFIED",
              integrityState: "VERIFIED",
              verifiedAt: "2026-08-22T12:59:00.000Z",
              expiresAt: "2026-08-22T13:01:00.000Z",
            },
            verificationSecrets: {
              "secret-key": secretMarker,
            },
            now: "2026-08-22T13:00:00.000Z",
          },
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };

    const result =
      await createConstitutionalTrustedAdmissionBoundary(
        resolver,
        undefined,
      ).orchestrate({}, request);

    expect(result.orchestrationState).toBe(
      "TRUST_CONTEXT_RESOLVED_NO_AUTHORITY",
    );

    if (
      result.orchestrationState !==
      "TRUST_CONTEXT_RESOLVED_NO_AUTHORITY"
    ) {
      throw new Error("Expected resolved trusted admission result.");
    }

    expect(result.trustContextResolution.resolutionState).toBe(
      "RESOLVED_NO_AUTHORITY",
    );
    expect(
      result.trustContextResolution.verificationContext,
    ).toBeNull();
    expect(result.trustContextResolution.resolverId).toBe(
      "resolver-secret-redaction-1",
    );
    expect(JSON.stringify(result)).not.toContain(secretMarker);
    expect(JSON.stringify(result)).not.toContain(
      "verificationSecrets",
    );
    expectNoExecutionAuthority(result);
  });
  it("resolves valid trust context, reserves replay, and still grants zero authority", async () => {
    let replayCalled = 0;

    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-positive-1",
      async resolveTrustContext() {
        return {
          resolutionState: "RESOLVED_NO_AUTHORITY",
          failureCode: null,
          verificationContext: {
            expectedTenantId: request.expectedTenantId,
            expectedActorId: request.expectedActorId,
            expectedActionId: request.expectedActionId,
            expectedActionClass: request.expectedActionClass,
            expectedRequestedCapability:
              request.expectedRequestedCapability,
            expectedPayloadDigest: request.expectedPayloadDigest,
            trustedIssuers: {
              "issuer-1": {
                issuerId: "issuer-1",
                keyId: "key-1",
                status: "ACTIVE",
                trustState: "VERIFIED",
                allowedActionClasses: ["INQUIRY_CREATE"],
                allowedCapabilities: ["CREATE_INQUIRY"],
              },
            },
            sourceEvidenceRegistry: {
              ["b".repeat(64)]: {
                digest: "b".repeat(64),
                evidenceId: "evidence-1",
                provenanceSourceId: "source-1",
                provenanceState: "VERIFIED",
                lifecycleState: "ACTIVE",
                verificationState: "VERIFIED",
                conflictState: "CLEAR",
                verifiedAt: "2026-08-22T12:58:00.000Z",
                expiresAt: "2026-08-22T13:02:00.000Z",
              },
            },
            sourceEvidenceRegistryTrust: {
              registryId: "source-registry-1",
              provenanceSourceId: "registry-source-1",
              provenanceState: "VERIFIED",
              integrityState: "VERIFIED",
              verifiedAt: "2026-08-22T12:57:00.000Z",
              expiresAt: "2026-08-22T13:03:00.000Z",
            },
            verificationSecrets: {
              "key-1": "verification-secret",
            },
            now: "2026-08-22T13:00:00.000Z",
          },
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };

    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled += 1;
        return "RESERVED";
      },
    };

    const result =
      await createConstitutionalTrustedAdmissionBoundary(
        resolver,
        replayStore,
      ).orchestrate(
        validAdmissionRecord(),
        request,
      );

    expect(result.orchestrationState).toBe(
      "TRUST_CONTEXT_RESOLVED_NO_AUTHORITY",
    );
    expect(result.trustContextResolution.resolutionState).toBe(
      "RESOLVED_NO_AUTHORITY",
    );
    expect(result.admissionOrchestration?.orchestrationState).toBe(
      "REPLAY_RESERVED_NO_AUTHORITY",
    );
    expect(
      result.admissionOrchestration?.admissionVerification
        .verificationState,
    ).toBe("VERIFIED_NO_REPLAY");
    expect(replayCalled).toBe(1);
    expectNoExecutionAuthority(result);
  });

  it("fails closed when resolved trust-context inspection throws unexpectedly", async () => {
    let replayCalled = false;

    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        const verificationContext = {
          expectedTenantId: request.expectedTenantId,
          expectedActorId: request.expectedActorId,
          expectedActionId: request.expectedActionId,
          expectedActionClass: request.expectedActionClass,
          expectedRequestedCapability:
            request.expectedRequestedCapability,
          expectedPayloadDigest: request.expectedPayloadDigest,
          get trustedIssuers() {
            throw new Error("corrupt trusted issuer source");
          },
          verificationSecrets: {},
          now: "2026-08-22T13:00:00.000Z",
        };

        return {
          resolutionState: "RESOLVED_NO_AUTHORITY",
          failureCode: null,
          verificationContext,
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        } as unknown as Awaited<
          ReturnType<ConstitutionalTrustContextResolver["resolveTrustContext"]>
        >;
      },
    };

    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await createConstitutionalTrustedAdmissionBoundary(
        resolver,
        replayStore,
      ).orchestrate({}, request);

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_CORRUPT",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
  it("fails closed when a resolved trust context has a malformed verification context", async () => {
    let replayCalled = false;

    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        return {
          resolutionState: "RESOLVED_NO_AUTHORITY",
          failureCode: null,
          verificationContext: {
            expectedTenantId: request.expectedTenantId,
            expectedActorId: request.expectedActorId,
            expectedActionId: request.expectedActionId,
            expectedActionClass: request.expectedActionClass,
            expectedRequestedCapability:
              request.expectedRequestedCapability,
            expectedPayloadDigest: request.expectedPayloadDigest,
            trustedIssuers: null,
            verificationSecrets: {},
            now: "2026-08-22T13:00:00.000Z",
          },
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        } as unknown as Awaited<
          ReturnType<ConstitutionalTrustContextResolver["resolveTrustContext"]>
        >;
      },
    };

    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await createConstitutionalTrustedAdmissionBoundary(
        resolver,
        replayStore,
      ).orchestrate({}, request);

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_CORRUPT",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
  it("fails closed when the bound resolver returns a malformed runtime result", async () => {
    let replayCalled = false;

    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        return {
          resolutionState: "UNKNOWN_RUNTIME_STATE",
          failureCode: null,
          verificationContext: {},
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        } as unknown as Awaited<
          ReturnType<ConstitutionalTrustContextResolver["resolveTrustContext"]>
        >;
      },
    };

    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await createConstitutionalTrustedAdmissionBoundary(
        resolver,
        replayStore,
      ).orchestrate({}, request);

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_CORRUPT",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
  it("does not allow request-time resolver replacement after bootstrap binding", async () => {
    let boundResolverCalled = false;
    let injectedResolverCalled = false;

    const boundResolver: ConstitutionalTrustContextResolver = {
      resolverId: "bound-resolver",
      async resolveTrustContext() {
        boundResolverCalled = true;
        return {
          resolutionState: "BLOCKED",
          failureCode: "TRUST_CONTEXT_STALE",
          verificationContext: null,
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };

    const injectedResolver: ConstitutionalTrustContextResolver = {
      resolverId: "injected-resolver",
      async resolveTrustContext() {
        injectedResolverCalled = true;
        return {
          resolutionState: "BLOCKED",
          failureCode: "TRUST_CONTEXT_AMBIGUOUS",
          verificationContext: null,
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };

    const boundary =
      createConstitutionalTrustedAdmissionBoundary(
        boundResolver,
        undefined,
      );

    const invokeWithExtraArguments =
      boundary.orchestrate as unknown as (
        record: unknown,
        requestInput: unknown,
        resolverOverride: ConstitutionalTrustContextResolver,
      ) => ReturnType<typeof boundary.orchestrate>;

    const result = await invokeWithExtraArguments(
      {},
      request,
      injectedResolver,
    );

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_STALE",
    );
    expect(boundResolverCalled).toBe(true);
    expect(injectedResolverCalled).toBe(false);
    expect(result.admissionOrchestration).toBeNull();
    expectNoExecutionAuthority(result);
  });
  it("blocks an invalid request before calling the trust-context resolver", async () => {
    let resolverCalled = false;
    let replayCalled = false;
    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        resolverCalled = true;
        return {
          resolutionState: "BLOCKED",
          failureCode: "TRUST_CONTEXT_STALE",
          verificationContext: null,
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };
    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
        {
          schemaVersion: "ignored-before-trust-resolution",
        },
        {
          ...request,
          expectedTenantId: "   ",
        },
        resolver,
        replayStore,
      );

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_REQUEST_INVALID",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(resolverCalled).toBe(false);
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
  it("blocks a resolver with invalid identity before invoking it", async () => {
    let resolverCalled = false;
    let replayCalled = false;

    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "   ",
      async resolveTrustContext() {
        resolverCalled = true;
        throw new Error("must not be called");
      },
    };

    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await createConstitutionalTrustedAdmissionBoundary(
        resolver,
        replayStore,
      ).orchestrate({}, request);

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_RESOLVER_IDENTITY_INVALID",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(resolverCalled).toBe(false);
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
  it("blocks before admission when the trust-context resolver is missing", async () => {
    let replayCalled = false;
    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
        {},
        request,
        undefined,
        replayStore,
      );

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_RESOLVER_UNAVAILABLE",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });

  it("fails closed before admission when the trust-context resolver throws", async () => {
    let replayCalled = false;
    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        throw new Error("resolver unavailable");
      },
    };
    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
        {},
        request,
        resolver,
        replayStore,
      );

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_LOAD_FAILED",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });

  it("blocks resolver tampering with every request-binding field", async () => {
    const bindingFields = [
      "expectedTenantId",
      "expectedActorId",
      "expectedActionId",
      "expectedActionClass",
      "expectedRequestedCapability",
      "expectedPayloadDigest",
    ] as const;

    for (const field of bindingFields) {
      let replayCalled = false;

      const resolvedContext = {
        expectedTenantId: request.expectedTenantId,
        expectedActorId: request.expectedActorId,
        expectedActionId: request.expectedActionId,
        expectedActionClass: request.expectedActionClass,
        expectedRequestedCapability:
          request.expectedRequestedCapability,
        expectedPayloadDigest: request.expectedPayloadDigest,
        trustedIssuers: {},
        sourceEvidenceRegistry: {},
        sourceEvidenceRegistryTrust: {
          registryId: "registry-1",
          provenanceSourceId: "registry-source-1",
          provenanceState: "VERIFIED" as const,
          integrityState: "VERIFIED" as const,
          verifiedAt: "2026-08-22T12:59:00.000Z",
          expiresAt: "2026-08-22T13:01:00.000Z",
        },
        verificationSecrets: {},
        now: "2026-08-22T13:00:00.000Z",
      };

      resolvedContext[field] =
        field === "expectedPayloadDigest"
          ? "c".repeat(64)
          : "different-bound-value";

      const resolver: ConstitutionalTrustContextResolver = {
        resolverId: `resolver-binding-${field}`,
        async resolveTrustContext() {
          return {
            resolutionState: "RESOLVED_NO_AUTHORITY",
            failureCode: null,
            verificationContext: resolvedContext,
            constitutionalExecutionAuthorityGranted: false,
            providerExecutionAuthorized: false,
            paymentExecutionAuthorized: false,
            legalFilingAuthorized: false,
            externalDeliveryAuthorized: false,
            publicLaunchAuthorized: false,
          };
        },
      };

      const replayStore: ConstitutionalEvidenceReplayStore = {
        async reserveReplayNonceScope() {
          replayCalled = true;
          return "RESERVED";
        },
      };

      const result =
        await createConstitutionalTrustedAdmissionBoundary(
          resolver,
          replayStore,
        ).orchestrate({}, request);

      expect(
        result.trustContextResolution.failureCode,
        field,
      ).toBe("TRUST_CONTEXT_BINDING_MISMATCH");
      expect(result.admissionOrchestration, field).toBeNull();
      expect(replayCalled, field).toBe(false);
      expectNoExecutionAuthority(result);
    }
  });
  it("blocks when resolved trust context changes the request binding", async () => {
    let replayCalled = false;
    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        return {
          resolutionState: "RESOLVED_NO_AUTHORITY",
          failureCode: null,
          verificationContext: {
            expectedTenantId: "different-tenant",
            expectedActorId: request.expectedActorId,
            expectedActionId: request.expectedActionId,
            expectedActionClass: request.expectedActionClass,
            expectedRequestedCapability:
              request.expectedRequestedCapability,
            expectedPayloadDigest: request.expectedPayloadDigest,
            trustedIssuers: {},
            sourceEvidenceRegistry: {},
            sourceEvidenceRegistryTrust: {
              registryId: "registry-1",
              provenanceSourceId: "registry-source-1",
              provenanceState: "VERIFIED",
              integrityState: "VERIFIED",
              verifiedAt: "2026-08-22T12:59:00.000Z",
              expiresAt: "2026-08-22T13:01:00.000Z",
            },
            verificationSecrets: {},
            now: "2026-08-22T13:00:00.000Z",
          },
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };
    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
        {},
        request,
        resolver,
        replayStore,
      );

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_BINDING_MISMATCH",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
  it("preserves a resolver BLOCKED decision and never reaches replay", async () => {
    let replayCalled = false;
    const resolver: ConstitutionalTrustContextResolver = {
      resolverId: "resolver-1",
      async resolveTrustContext() {
        return {
          resolutionState: "BLOCKED",
          failureCode: "TRUST_CONTEXT_STALE",
          verificationContext: null,
          constitutionalExecutionAuthorityGranted: false,
          providerExecutionAuthorized: false,
          paymentExecutionAuthorized: false,
          legalFilingAuthorized: false,
          externalDeliveryAuthorized: false,
          publicLaunchAuthorized: false,
        };
      },
    };
    const replayStore: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result =
      await orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
        {},
        request,
        resolver,
        replayStore,
      );

    expect(result.orchestrationState).toBe("TRUST_CONTEXT_BLOCKED");
    expect(result.trustContextResolution.failureCode).toBe(
      "TRUST_CONTEXT_STALE",
    );
    expect(result.admissionOrchestration).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });
});