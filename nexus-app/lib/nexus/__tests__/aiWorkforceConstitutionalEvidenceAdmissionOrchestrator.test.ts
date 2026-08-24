import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { orchestrateConstitutionalEvidenceAdmission } from "../aiWorkforceConstitutionalEvidenceAdmissionOrchestrator";
import type { ConstitutionalEvidenceAdmissionVerificationContext } from "../aiWorkforceConstitutionalEvidenceAdmission";
import type { ConstitutionalEvidenceReplayStore } from "../aiWorkforceConstitutionalEvidenceReplayGuard";

const context: ConstitutionalEvidenceAdmissionVerificationContext = {
  expectedTenantId: "tenant-1",
  expectedActorId: "actor-1",
  expectedActionId: "action-1",
  expectedActionClass: "INQUIRY_CREATE",
  expectedRequestedCapability: "CREATE_INQUIRY",
  expectedPayloadDigest: "a".repeat(64),
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
};

function baseRecord() {
  return {
    schemaVersion:
      "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_V1",
    constitutionVersion: "NEXUS_AI_WORKFORCE_CONSTITUTION_V1",
    tenantId: "tenant-1",
    actorId: "actor-1",
    actionId: "action-1",
    requesterSource: "EMPLOYEE",
    actionClass: "INQUIRY_CREATE",
    requestedCapability: "CREATE_INQUIRY",
    payloadDigest: "a".repeat(64),
    constitutionalInput: {
      tenantId: "tenant-1",
      actorId: "actor-1",
      requesterSource: "EMPLOYEE",
      actionClass: "INQUIRY_CREATE",
      actionClassState: "KNOWN",
      requestedCapability: "CREATE_INQUIRY",
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
    nonce: "nonce-1",
    evaluatedDecision: "ALLOW_CONSTITUTIONALLY",
    signature: "c".repeat(64),
  };
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

function signRecord(record: ReturnType<typeof baseRecord>): string {
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

  return createHmac("sha256", "verification-secret")
    .update(canonicalPayload, "utf8")
    .digest("hex");
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

describe("AI Workforce Constitutional Evidence Admission Orchestrator — Phase 0 fail-closed contract", () => {
  it("does not call replay store when admission verification is rejected", async () => {
    let replayCalled = false;
    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayCalled = true;
        return "RESERVED";
      },
    };

    const result = await orchestrateConstitutionalEvidenceAdmission(
      null,
      context,
      store,
    );

    expect(result.orchestrationState).toBe("ADMISSION_REJECTED");
    expect(result.admissionVerification.verificationState).toBe("REJECTED");
    expect(result.replayGuard).toBeNull();
    expect(replayCalled).toBe(false);
    expectNoExecutionAuthority(result);
  });

  it("blocks when verified admission has no replay store", async () => {
    const record = baseRecord();
    record.signature = signRecord(record);

    const result = await orchestrateConstitutionalEvidenceAdmission(
      record,
      context,
      null,
    );

    expect(result.orchestrationState).toBe("REPLAY_BLOCKED");
    expect(result.admissionVerification.verificationState).toBe(
      "VERIFIED_NO_REPLAY",
    );
    expect(result.replayGuard?.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE",
    ]);
    expectNoExecutionAuthority(result);
  });

  it("blocks a detected replay after verified admission", async () => {
    const record = baseRecord();
    record.signature = signRecord(record);

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(identity) {
        expect(identity).toEqual({
          tenantId: "tenant-1",
          evidenceIssuerId: "issuer-1",
          evidenceIssuerKeyId: "key-1",
          nonce: "nonce-1",
        });
        return "ALREADY_USED";
      },
    };

    const result = await orchestrateConstitutionalEvidenceAdmission(
      record,
      context,
      store,
    );

    expect(result.orchestrationState).toBe("REPLAY_BLOCKED");
    expect(result.replayGuard?.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_DETECTED",
    ]);
    expectNoExecutionAuthority(result);
  });

  it("blocks reuse of the same nonce for a different verified payload", async () => {
    const usedScopes = new Set<string>();

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope(scope) {
        const key = JSON.stringify(scope);
        if (usedScopes.has(key)) {
          return "ALREADY_USED";
        }
        usedScopes.add(key);
        return "RESERVED";
      },
    };

    const firstRecord = baseRecord();
    firstRecord.signature = signRecord(firstRecord);

    const first = await orchestrateConstitutionalEvidenceAdmission(
      firstRecord,
      context,
      store,
    );

    const secondRecord = baseRecord();
    secondRecord.payloadDigest = "d".repeat(64);
    secondRecord.signature = signRecord(secondRecord);

    const second = await orchestrateConstitutionalEvidenceAdmission(
      secondRecord,
      {
        ...context,
        expectedPayloadDigest: "d".repeat(64),
      },
      store,
    );

    expect(first.orchestrationState).toBe(
      "REPLAY_RESERVED_NO_AUTHORITY",
    );
    expect(first.replayGuard?.replayAccepted).toBe(true);
    expect(first.replayGuard?.failureCodes).toEqual([]);
    expectNoExecutionAuthority(first);

    expect(second.admissionVerification.verificationState).toBe(
      "VERIFIED_NO_REPLAY",
    );
    expect(second.orchestrationState).toBe("REPLAY_BLOCKED");
    expect(second.replayGuard?.replayAccepted).toBe(false);
    expect(second.replayGuard?.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_DETECTED",
    ]);
    expectNoExecutionAuthority(second);
    expect(usedScopes.size).toBe(1);
  });
  it("fails closed when the replay store throws after verified admission", async () => {
    const record = baseRecord();
    record.signature = signRecord(record);

    let replayStoreCallCount = 0;

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayStoreCallCount += 1;
        throw new Error("replay store failure");
      },
    };

    const result = await orchestrateConstitutionalEvidenceAdmission(
      record,
      context,
      store,
    );

    expect(result.admissionVerification.verificationState).toBe(
      "VERIFIED_NO_REPLAY",
    );
    expect(result.orchestrationState).toBe("REPLAY_BLOCKED");
    expect(result.replayGuard?.replayState).toBe("REJECTED");
    expect(result.replayGuard?.replayAccepted).toBe(false);
    expect(result.replayGuard?.failureCodes).toEqual([
      "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE",
    ]);
    expect(replayStoreCallCount).toBe(1);
    expectNoExecutionAuthority(result);
  });
  it("still refuses authority after a fresh replay reservation", async () => {
    const record = baseRecord();
    record.signature = signRecord(record);

    let replayStoreCallCount = 0;

    const store: ConstitutionalEvidenceReplayStore = {
      async reserveReplayNonceScope() {
        replayStoreCallCount += 1;
        return "RESERVED";
      },
    };

    const result = await orchestrateConstitutionalEvidenceAdmission(
      record,
      context,
      store,
    );

    expect(result.orchestrationState).toBe(
      "REPLAY_RESERVED_NO_AUTHORITY",
    );
    expect(result.admissionVerification.verificationState).toBe(
      "VERIFIED_NO_REPLAY",
    );
    expect(result.replayGuard?.replayState).toBe(
      "REPLAY_RESERVED_NO_AUTHORITY",
    );
    expect(result.replayGuard?.replayAccepted).toBe(true);
    expect(result.replayGuard?.failureCodes).toEqual([]);
    expect(replayStoreCallCount).toBe(1);
    expectNoExecutionAuthority(result);
  });
});