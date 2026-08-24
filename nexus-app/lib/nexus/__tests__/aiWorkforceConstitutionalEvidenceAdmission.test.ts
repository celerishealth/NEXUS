import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  verifyConstitutionalEvidenceAdmission,
  type ConstitutionalEvidenceAdmissionVerificationContext,
} from "../aiWorkforceConstitutionalEvidenceAdmission";

const context: ConstitutionalEvidenceAdmissionVerificationContext = {
  expectedTenantId: "tenant-1",
  expectedActorId: "actor-1",
  expectedActionId: "action-1",
  expectedActionClass: "INQUIRY_CREATE",
  expectedRequestedCapability: "CREATE_INQUIRY",
  expectedPayloadDigest: "a".repeat(64),
  trustedIssuers: {},
  verificationSecrets: {},
  now: "2026-08-22T13:00:00.000Z",
};

const trustedContext: ConstitutionalEvidenceAdmissionVerificationContext = {
  ...context,
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

function stableStringifyForSignature(value: unknown): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringifyForSignature).join(",")}]`;
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
          `${JSON.stringify(key)}:${stableStringifyForSignature(record[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error("Unsupported test signing value.");
}

function signRecord(
  record: ReturnType<typeof baseRecord>,
  secret: string,
): string {
  const canonicalPayload = stableStringifyForSignature({
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

  return createHmac("sha256", secret)
    .update(canonicalPayload, "utf8")
    .digest("hex");
}
function expectAllExecutionAuthorityFalse(
  result: ReturnType<typeof verifyConstitutionalEvidenceAdmission>,
) {
  expect(result.admitted).toBe(false);
  expect(result.constitutionalExecutionAuthorityGranted).toBe(false);
  expect(result.providerExecutionAuthorized).toBe(false);
  expect(result.paymentExecutionAuthorized).toBe(false);
  expect(result.legalFilingAuthorized).toBe(false);
  expect(result.externalDeliveryAuthorized).toBe(false);
  expect(result.publicLaunchAuthorized).toBe(false);
}

describe("AI Workforce Constitutional Evidence Admission — Phase 0 fail-closed contract", () => {
  it("rejects a non-object record", () => {
    const result = verifyConstitutionalEvidenceAdmission(null, context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_RECORD_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects incomplete identity binding", () => {
    const record = baseRecord();
    record.actionId = "";
    const result = verifyConstitutionalEvidenceAdmission(record, context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_IDENTITY_INCOMPLETE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an invalid payload digest", () => {
    const record = baseRecord();
    record.payloadDigest = "not-a-sha256";
    const result = verifyConstitutionalEvidenceAdmission(record, context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_PAYLOAD_DIGEST_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects incomplete issuer identity", () => {
    const record = baseRecord();
    record.evidenceIssuerId = "";
    const result = verifyConstitutionalEvidenceAdmission(record, context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_INCOMPLETE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects missing source evidence digests", () => {
    const record = baseRecord();
    record.sourceEvidenceDigests = [];
    const result = verifyConstitutionalEvidenceAdmission(record, context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects invalid admission time bounds", () => {
    const record = baseRecord();
    record.expiresAt = record.issuedAt;
    const result = verifyConstitutionalEvidenceAdmission(record, context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_TIME_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects constitutional-input binding mismatch", () => {
    const record = baseRecord();
    record.constitutionalInput.tenantId = "different-tenant";

    const result = verifyConstitutionalEvidenceAdmission(
      record,
      trustedContext,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_CONSTITUTIONAL_INPUT_BINDING_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects stored evaluated-decision mismatch", () => {
    const record = baseRecord();
    record.evaluatedDecision = "BLOCK_UNKNOWN";

    const result = verifyConstitutionalEvidenceAdmission(
      record,
      trustedContext,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_EVALUATED_DECISION_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects a Constitution evaluation that is not ALLOW", () => {
    const record = baseRecord();
    record.constitutionalInput.legalState = "UNLAWFUL";
    record.evaluatedDecision = "BLOCK_PROHIBITED";

    const result = verifyConstitutionalEvidenceAdmission(
      record,
      trustedContext,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_CONSTITUTION_NOT_ALLOW",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an unknown issuer", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), context);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_UNKNOWN_OR_DISABLED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects a disabled issuer", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      trustedIssuers: {
        "issuer-1": {
          issuerId: "issuer-1",
          keyId: "key-1",
          status: "DISABLED",
          trustState: "VERIFIED",
        },
      },
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_UNKNOWN_OR_DISABLED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an unverified issuer", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      trustedIssuers: {
        "issuer-1": {
          issuerId: "issuer-1",
          keyId: "key-1",
          status: "ACTIVE",
          trustState: "UNVERIFIED",
        },
      },
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects issuer key mismatch", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      trustedIssuers: {
        "issuer-1": {
          issuerId: "issuer-1",
          keyId: "different-key",
          status: "ACTIVE",
          trustState: "VERIFIED",
        },
      },
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_KEY_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects a trusted issuer with missing scope", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      trustedIssuers: {
        "issuer-1": {
          issuerId: "issuer-1",
          keyId: "key-1",
          status: "ACTIVE",
          trustState: "VERIFIED",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_SCOPE_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an action class outside issuer scope", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      trustedIssuers: {
        "issuer-1": {
          ...trustedContext.trustedIssuers["issuer-1"],
          allowedActionClasses: ["QUOTATION_CREATE"],
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_ACTION_CLASS_NOT_ALLOWED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects a capability outside issuer scope", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      trustedIssuers: {
        "issuer-1": {
          ...trustedContext.trustedIssuers["issuer-1"],
          allowedCapabilities: ["CREATE_QUOTATION"],
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ISSUER_CAPABILITY_NOT_ALLOWED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects a missing source-evidence registry", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: undefined,
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects when the required source-evidence digest is absent from the registry", () => {
    const requiredDigest = "b".repeat(64);
    const differentDigest = "d".repeat(64);
    const record = baseRecord();
    record.sourceEvidenceDigests = [requiredDigest];

    const result = verifyConstitutionalEvidenceAdmission(record, {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [differentDigest]: {
          digest: differentDigest,
          evidenceId: "evidence-other",
          provenanceSourceId: "source-other",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata with an invalid time window", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        verifiedAt: "2026-08-22T13:01:00.000Z",
        expiresAt: "2026-08-22T13:01:00.000Z",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_STALE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata with malformed timestamps", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        verifiedAt: "not-a-time",
        expiresAt: "also-not-a-time",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_STALE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata that is not yet valid", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        verifiedAt: "2026-08-22T13:00:01.000Z",
        expiresAt: "2026-08-22T13:03:00.000Z",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_STALE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects stale source-evidence registry trust metadata", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        verifiedAt: "2026-08-22T12:55:00.000Z",
        expiresAt: "2026-08-22T12:59:59.000Z",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_STALE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata with unverified integrity", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        integrityState: "UNVERIFIED",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_INTEGRITY_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata with an empty provenance source identity", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        provenanceSourceId: "   ",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_PROVENANCE_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata with unverified provenance", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        provenanceState: "UNVERIFIED",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_PROVENANCE_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source-evidence registry trust metadata with an empty registry identity", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: {
        ...trustedContext.sourceEvidenceRegistryTrust!,
        registryId: "   ",
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_IDENTITY_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects when source-evidence registry trust metadata is missing", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistryTrust: undefined,
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_TRUST_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects duplicate registry records resolving to the same source-evidence digest", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        "registry-entry-1": {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
        "registry-entry-2": {
          digest,
          evidenceId: "evidence-2",
          provenanceSourceId: "source-2",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source evidence with an empty evidence identity", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "   ",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_IDENTITY_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source evidence with an empty provenance source identity", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "   ",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_PROVENANCE_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects source evidence with unverified provenance", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "UNVERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_PROVENANCE_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects superseded source evidence", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "SUPERSEDED",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_NOT_ACTIVE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects invalidated source evidence", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "INVALIDATED",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_NOT_ACTIVE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects revoked source evidence", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "REVOKED",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_NOT_ACTIVE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects unverified source evidence", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "UNVERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_UNVERIFIED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects conflicting source evidence", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CONFLICTING",
          verifiedAt: "2026-08-22T12:58:00.000Z",
          expiresAt: "2026-08-22T13:02:00.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_CONFLICTING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects stale source evidence", () => {
    const digest = "b".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      sourceEvidenceRegistry: {
        [digest]: {
          digest,
          evidenceId: "evidence-1",
          provenanceSourceId: "source-1",
          provenanceState: "VERIFIED",
          lifecycleState: "ACTIVE",
          verificationState: "VERIFIED",
          conflictState: "CLEAR",
          verifiedAt: "2026-08-22T12:57:00.000Z",
          expiresAt: "2026-08-22T12:59:59.000Z",
        },
      },
    });

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_STALE",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects missing verification secret", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      verificationSecrets: {},
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_VERIFICATION_SECRET_MISSING",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an ALLOW-preserving semantic tamper through signature binding", () => {
    const record = baseRecord();
    record.signature = signRecord(record, "verification-secret");

    record.constitutionalInput.riskLevel = "MEDIUM";

    const result = verifyConstitutionalEvidenceAdmission(
      record,
      trustedContext,
    );

    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SIGNATURE_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });
  it("rejects an invalid record signature", () => {
    const result = verifyConstitutionalEvidenceAdmission(
      baseRecord(),
      trustedContext,
    );
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SIGNATURE_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("verifies evidence without replay and still refuses admission authority", () => {
    const record = baseRecord();
    record.signature = signRecord(record, "verification-secret");

    const result = verifyConstitutionalEvidenceAdmission(
      record,
      trustedContext,
    );

    expect(result.verificationState).toBe("VERIFIED_NO_REPLAY");
    expect(result.failureCodes).toEqual([]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects Constitution version mismatch", () => {
    const record = baseRecord();
    record.constitutionVersion = "WRONG_CONSTITUTION_VERSION";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_CONSTITUTION_VERSION_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects tenant mismatch", () => {
    const record = baseRecord();
    record.tenantId = "different-tenant";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_TENANT_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects actor mismatch", () => {
    const record = baseRecord();
    record.actorId = "different-actor";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ACTOR_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects action identity mismatch", () => {
    const record = baseRecord();
    record.actionId = "different-action";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ACTION_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects action-class mismatch", () => {
    const record = baseRecord();
    record.actionClass = "DIFFERENT_ACTION_CLASS";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_ACTION_CLASS_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects requested-capability mismatch", () => {
    const record = baseRecord();
    record.requestedCapability = "DIFFERENT_CAPABILITY";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_CAPABILITY_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects payload-digest mismatch", () => {
    const record = baseRecord();
    record.payloadDigest = "d".repeat(64);
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_PAYLOAD_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects admission schema-version mismatch", () => {
    const record = baseRecord();
    record.schemaVersion = "WRONG_ADMISSION_SCHEMA";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_SCHEMA_VERSION_MISMATCH",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects a blank nonce", () => {
    const record = baseRecord();
    record.nonce = "";
    const result = verifyConstitutionalEvidenceAdmission(record, trustedContext);
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_NONCE_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an invalid verification clock", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      now: "not-a-timestamp",
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_TIME_INVALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an admission that is not yet valid", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      now: "2026-08-22T12:58:59.000Z",
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_NOT_YET_VALID",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("rejects an expired admission", () => {
    const result = verifyConstitutionalEvidenceAdmission(baseRecord(), {
      ...trustedContext,
      now: "2026-08-22T13:01:01.000Z",
    });
    expect(result.failureCodes).toEqual([
      "CONSTITUTIONAL_ADMISSION_EXPIRED",
    ]);
    expectAllExecutionAuthorityFalse(result);
  });

  it("returns immutable failure evidence", () => {
    const result = verifyConstitutionalEvidenceAdmission(null, context);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.failureCodes)).toBe(true);
  });
});