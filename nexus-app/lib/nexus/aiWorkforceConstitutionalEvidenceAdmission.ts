import { createHmac, timingSafeEqual } from "node:crypto";
import {
  evaluateAiWorkforceConstitution,
  type AiWorkforceConstitutionDecision,
  type AiWorkforceConstitutionEvaluationInput,
} from "./aiWorkforceConstitution";

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
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

  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(value[key])}`,
      )
      .join(",")}}`;
  }

  throw new Error(
    "Constitutional admission contains an unsupported signed value.",
  );
}

function secureHexEquals(actual: string, expected: string): boolean {
  if (
    !/^[a-f0-9]{64}$/i.test(actual) ||
    !/^[a-f0-9]{64}$/i.test(expected)
  ) {
    return false;
  }

  const actualBuffer = Buffer.from(actual.toLowerCase(), "hex");
  const expectedBuffer = Buffer.from(expected.toLowerCase(), "hex");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
export const AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_VERSION =
  "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_V1" as const;

export type ConstitutionalEvidenceIssuerTrustState =
  | "VERIFIED"
  | "UNVERIFIED"
  | "DISABLED";

export type ConstitutionalEvidenceIssuerStatus =
  | "ACTIVE"
  | "DISABLED";

export interface ConstitutionalEvidenceIssuerTrustRecord {
  readonly issuerId: string;
  readonly keyId: string;
  readonly status: ConstitutionalEvidenceIssuerStatus;
  readonly trustState: ConstitutionalEvidenceIssuerTrustState;
  readonly allowedActionClasses?: readonly string[];
  readonly allowedCapabilities?: readonly string[];
}

export interface UnsignedConstitutionalEvidenceAdmissionRecord {
  readonly schemaVersion:
    "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_V1";
  readonly constitutionVersion:
    "NEXUS_AI_WORKFORCE_CONSTITUTION_V1";

  readonly tenantId: string;
  readonly actorId: string;
  readonly actionId: string;
  readonly requesterSource:
    AiWorkforceConstitutionEvaluationInput["requesterSource"];
  readonly actionClass: string;
  readonly requestedCapability: string;
  readonly payloadDigest: string;

  readonly constitutionalInput:
    AiWorkforceConstitutionEvaluationInput;

  readonly sourceEvidenceDigests: readonly string[];

  readonly evidenceIssuerId: string;
  readonly evidenceIssuerKeyId: string;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly nonce: string;

  readonly evaluatedDecision:
    AiWorkforceConstitutionDecision;
}

export interface SignedConstitutionalEvidenceAdmissionRecord
  extends UnsignedConstitutionalEvidenceAdmissionRecord {
  readonly signature: string;
}

export type ConstitutionalSourceEvidenceVerificationState =
  | "VERIFIED"
  | "UNVERIFIED";

export type ConstitutionalSourceEvidenceConflictState =
  | "CLEAR"
  | "CONFLICTING";

export type ConstitutionalSourceEvidenceProvenanceState =
  | "VERIFIED"
  | "UNVERIFIED";

export type ConstitutionalSourceEvidenceLifecycleState =
  | "ACTIVE"
  | "SUPERSEDED"
  | "REVOKED"
  | "INVALIDATED";

export interface ConstitutionalSourceEvidenceTrustRecord {
  readonly evidenceId: string;
  readonly digest: string;
  readonly provenanceSourceId: string;
  readonly provenanceState: ConstitutionalSourceEvidenceProvenanceState;
  readonly lifecycleState: ConstitutionalSourceEvidenceLifecycleState;
  readonly verificationState: ConstitutionalSourceEvidenceVerificationState;
  readonly conflictState: ConstitutionalSourceEvidenceConflictState;
  readonly verifiedAt: string;
  readonly expiresAt: string;
}
export type ConstitutionalSourceEvidenceRegistryIntegrityState =
  | "VERIFIED"
  | "UNVERIFIED";

export type ConstitutionalSourceEvidenceRegistryProvenanceState =
  | "VERIFIED"
  | "UNVERIFIED";

export interface ConstitutionalSourceEvidenceRegistryTrustEnvelope {
  readonly registryId: string;
  readonly provenanceSourceId: string;
  readonly provenanceState: ConstitutionalSourceEvidenceRegistryProvenanceState;
  readonly integrityState: ConstitutionalSourceEvidenceRegistryIntegrityState;
  readonly verifiedAt: string;
  readonly expiresAt: string;
}
export interface ConstitutionalEvidenceAdmissionVerificationContext {
  readonly expectedTenantId: string;
  readonly expectedActorId: string;
  readonly expectedActionId: string;
  readonly expectedActionClass: string;
  readonly expectedRequestedCapability: string;
  readonly expectedPayloadDigest: string;

  readonly trustedIssuers:
    Readonly<Record<string, ConstitutionalEvidenceIssuerTrustRecord>>;

  readonly sourceEvidenceRegistry?:
    Readonly<Record<string, ConstitutionalSourceEvidenceTrustRecord>>;
  readonly sourceEvidenceRegistryTrust?: ConstitutionalSourceEvidenceRegistryTrustEnvelope;

  readonly verificationSecrets:
    Readonly<Record<string, string>>;

  readonly now: string;
}

export type ConstitutionalEvidenceAdmissionFailureCode =
  | "CONSTITUTIONAL_ADMISSION_RECORD_INVALID"
  | "CONSTITUTIONAL_ADMISSION_IDENTITY_INCOMPLETE"
  | "CONSTITUTIONAL_ADMISSION_PAYLOAD_DIGEST_INVALID"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_INCOMPLETE"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_MISSING"
  | "CONSTITUTIONAL_ADMISSION_TIME_INVALID"
  | "CONSTITUTIONAL_ADMISSION_SCHEMA_VERSION_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_NONCE_INVALID"
  | "CONSTITUTIONAL_ADMISSION_SIGNATURE_INVALID"
  | "CONSTITUTIONAL_ADMISSION_NOT_YET_VALID"
  | "CONSTITUTIONAL_ADMISSION_EXPIRED"
  | "CONSTITUTIONAL_ADMISSION_CONSTITUTION_VERSION_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_TENANT_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_ACTOR_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_ACTION_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_ACTION_CLASS_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_CAPABILITY_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_PAYLOAD_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_CONSTITUTIONAL_INPUT_BINDING_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_EVALUATED_DECISION_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_CONSTITUTION_NOT_ALLOW"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_MISSING"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_TRUST_MISSING"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_IDENTITY_INVALID"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_PROVENANCE_UNVERIFIED"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_INTEGRITY_UNVERIFIED"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_STALE"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_UNVERIFIED"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_IDENTITY_INVALID"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_PROVENANCE_UNVERIFIED"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_NOT_ACTIVE"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_CONFLICTING"
  | "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_STALE"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_SCOPE_MISSING"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_ACTION_CLASS_NOT_ALLOWED"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_CAPABILITY_NOT_ALLOWED"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_UNKNOWN_OR_DISABLED"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_UNVERIFIED"
  | "CONSTITUTIONAL_ADMISSION_ISSUER_KEY_MISMATCH"
  | "CONSTITUTIONAL_ADMISSION_VERIFICATION_SECRET_MISSING";

export interface ConstitutionalEvidenceAdmissionFailureResult {
  readonly verificationState: "REJECTED";
  readonly admitted: false;
  readonly failureCodes:
    readonly ConstitutionalEvidenceAdmissionFailureCode[];
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export interface ConstitutionalEvidenceAdmissionVerifiedNoReplayResult {
  readonly verificationState: "VERIFIED_NO_REPLAY";
  readonly admitted: false;
  readonly failureCodes: readonly [];
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export type ConstitutionalEvidenceAdmissionVerificationResult =
  | ConstitutionalEvidenceAdmissionFailureResult
  | ConstitutionalEvidenceAdmissionVerifiedNoReplayResult;

/**
 * Phase-0 contract skeleton only.
 *
 * IMPORTANT:
 * - this file currently grants no constitutional admission;
 * - no caller-supplied semantic assertion is trusted;
 * - no issuer is trusted merely because it appears in input;
 * - no signature is treated as substantive legal/compliance truth;
 * - runtime integration remains blocked.
 */
export function verifyConstitutionalEvidenceAdmission(
  record: unknown,
  _context: ConstitutionalEvidenceAdmissionVerificationContext,
): ConstitutionalEvidenceAdmissionVerificationResult {
  const fail = (
    code: ConstitutionalEvidenceAdmissionFailureCode,
  ): ConstitutionalEvidenceAdmissionVerificationResult =>
    Object.freeze({
      verificationState: "REJECTED",
      admitted: false,
      failureCodes: Object.freeze([code]),
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });

  const verifiedNoReplay = (): ConstitutionalEvidenceAdmissionVerifiedNoReplayResult =>
    Object.freeze({
      verificationState: "VERIFIED_NO_REPLAY",
      admitted: false,
      failureCodes: Object.freeze([] as const),
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
  if (
    typeof record !== "object" ||
    record === null ||
    Array.isArray(record)
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_RECORD_INVALID");
  }

  const candidate = record as Record<string, unknown>;
  const requiredIdentityFields = [
    "tenantId",
    "actorId",
    "actionId",
    "actionClass",
    "requestedCapability",
  ] as const;

  if (
    requiredIdentityFields.some(
      (field) =>
        typeof candidate[field] !== "string" ||
        !(candidate[field] as string).trim(),
    )
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_IDENTITY_INCOMPLETE");
  }

  if (
    typeof candidate.payloadDigest !== "string" ||
    !/^[a-f0-9]{64}$/i.test(candidate.payloadDigest.trim())
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_PAYLOAD_DIGEST_INVALID");
  }

  if (
    typeof candidate.evidenceIssuerId !== "string" ||
    !candidate.evidenceIssuerId.trim() ||
    typeof candidate.evidenceIssuerKeyId !== "string" ||
    !candidate.evidenceIssuerKeyId.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_ISSUER_INCOMPLETE");
  }

  if (
    !Array.isArray(candidate.sourceEvidenceDigests) ||
    candidate.sourceEvidenceDigests.length === 0 ||
    candidate.sourceEvidenceDigests.some(
      (digest) =>
        typeof digest !== "string" ||
        !/^[a-f0-9]{64}$/i.test(digest.trim()),
    )
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_MISSING");
  }

  const issuedAt =
    typeof candidate.issuedAt === "string"
      ? Date.parse(candidate.issuedAt)
      : Number.NaN;
  const expiresAt =
    typeof candidate.expiresAt === "string"
      ? Date.parse(candidate.expiresAt)
      : Number.NaN;

  if (
    !Number.isFinite(issuedAt) ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= issuedAt
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_TIME_INVALID");
  }

  if (
    candidate.schemaVersion !==
    "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_ADMISSION_V1"
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_SCHEMA_VERSION_MISMATCH");
  }

  if (
    typeof candidate.nonce !== "string" ||
    !candidate.nonce.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_NONCE_INVALID");
  }

  const verificationNow = Date.parse(_context.now);

  if (!Number.isFinite(verificationNow)) {
    return fail("CONSTITUTIONAL_ADMISSION_TIME_INVALID");
  }

  if (verificationNow < issuedAt) {
    return fail("CONSTITUTIONAL_ADMISSION_NOT_YET_VALID");
  }

  if (verificationNow > expiresAt) {
    return fail("CONSTITUTIONAL_ADMISSION_EXPIRED");
  }

  if (
    candidate.constitutionVersion !==
    "NEXUS_AI_WORKFORCE_CONSTITUTION_V1"
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_CONSTITUTION_VERSION_MISMATCH");
  }

  if (
    (candidate.tenantId as string).trim() !==
    _context.expectedTenantId.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_TENANT_MISMATCH");
  }

  if (
    (candidate.actorId as string).trim() !==
    _context.expectedActorId.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_ACTOR_MISMATCH");
  }

  if (
    (candidate.actionId as string).trim() !==
    _context.expectedActionId.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_ACTION_MISMATCH");
  }

  if (
    (candidate.actionClass as string).trim() !==
    _context.expectedActionClass.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_ACTION_CLASS_MISMATCH");
  }

  if (
    (candidate.requestedCapability as string).trim() !==
    _context.expectedRequestedCapability.trim()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_CAPABILITY_MISMATCH");
  }

  if (
    (candidate.payloadDigest as string).trim().toLowerCase() !==
    _context.expectedPayloadDigest.trim().toLowerCase()
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_PAYLOAD_MISMATCH");
  }

  if (!isRecord(candidate.constitutionalInput)) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_CONSTITUTIONAL_INPUT_BINDING_MISMATCH",
    );
  }

  const constitutionalInput =
    candidate.constitutionalInput as Record<string, unknown>;

  if (
    constitutionalInput.tenantId !== candidate.tenantId ||
    constitutionalInput.actorId !== candidate.actorId ||
    constitutionalInput.requesterSource !== candidate.requesterSource ||
    constitutionalInput.actionClass !== candidate.actionClass ||
    constitutionalInput.requestedCapability !==
      candidate.requestedCapability
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_CONSTITUTIONAL_INPUT_BINDING_MISMATCH",
    );
  }

  const constitutionalEvaluation =
    evaluateAiWorkforceConstitution(candidate.constitutionalInput);

  if (
    candidate.evaluatedDecision !== constitutionalEvaluation.decision
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_EVALUATED_DECISION_MISMATCH",
    );
  }

  if (
    constitutionalEvaluation.decision !== "ALLOW_CONSTITUTIONALLY" ||
    constitutionalEvaluation.allowed !== true
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_CONSTITUTION_NOT_ALLOW",
    );
  }

  const issuerId = (candidate.evidenceIssuerId as string).trim();
  const issuerKeyId = (candidate.evidenceIssuerKeyId as string).trim();
  const trustedIssuer = _context.trustedIssuers[issuerId];

  if (!trustedIssuer || trustedIssuer.status !== "ACTIVE") {
    return fail("CONSTITUTIONAL_ADMISSION_ISSUER_UNKNOWN_OR_DISABLED");
  }

  if (trustedIssuer.trustState !== "VERIFIED") {
    return fail("CONSTITUTIONAL_ADMISSION_ISSUER_UNVERIFIED");
  }

  if (
    trustedIssuer.issuerId.trim() !== issuerId ||
    trustedIssuer.keyId.trim() !== issuerKeyId
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_ISSUER_KEY_MISMATCH");
  }

  const allowedActionClasses = trustedIssuer.allowedActionClasses;
  const allowedCapabilities = trustedIssuer.allowedCapabilities;

  if (
    !Array.isArray(allowedActionClasses) ||
    allowedActionClasses.length === 0 ||
    allowedActionClasses.some(
      (value) => typeof value !== "string" || !value.trim(),
    ) ||
    !Array.isArray(allowedCapabilities) ||
    allowedCapabilities.length === 0 ||
    allowedCapabilities.some(
      (value) => typeof value !== "string" || !value.trim(),
    )
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_ISSUER_SCOPE_MISSING");
  }

  if (
    !allowedActionClasses.some(
      (value) => value.trim() === (candidate.actionClass as string).trim(),
    )
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_ISSUER_ACTION_CLASS_NOT_ALLOWED",
    );
  }

  if (
    !allowedCapabilities.some(
      (value) =>
        value.trim() ===
        (candidate.requestedCapability as string).trim(),
    )
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_ISSUER_CAPABILITY_NOT_ALLOWED",
    );
  }

  const sourceEvidenceRegistry = _context.sourceEvidenceRegistry;

  if (!sourceEvidenceRegistry) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_MISSING",
    );
  }

  if (!_context.sourceEvidenceRegistryTrust) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_TRUST_MISSING",
    );
  }

  if (
    typeof _context.sourceEvidenceRegistryTrust.registryId !== "string" ||
    !_context.sourceEvidenceRegistryTrust.registryId.trim()
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_IDENTITY_INVALID",
    );
  }

  if (
    typeof _context.sourceEvidenceRegistryTrust.provenanceSourceId !== "string" ||
    !_context.sourceEvidenceRegistryTrust.provenanceSourceId.trim() ||
    _context.sourceEvidenceRegistryTrust.provenanceState !== "VERIFIED"
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_PROVENANCE_UNVERIFIED",
    );
  }

  if (_context.sourceEvidenceRegistryTrust.integrityState !== "VERIFIED") {
    return fail(
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_INTEGRITY_UNVERIFIED",
    );
  }

  const registryVerifiedAt = Date.parse(
    _context.sourceEvidenceRegistryTrust.verifiedAt,
  );
  const registryExpiresAt = Date.parse(
    _context.sourceEvidenceRegistryTrust.expiresAt,
  );

  if (
    !Number.isFinite(registryVerifiedAt) ||
    !Number.isFinite(registryExpiresAt) ||
    registryExpiresAt <= registryVerifiedAt ||
    verificationNow < registryVerifiedAt ||
    verificationNow > registryExpiresAt
  ) {
    return fail(
      "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_STALE",
    );
  }

  for (const digest of candidate.sourceEvidenceDigests as string[]) {
    const normalizedDigest = digest.toLowerCase();
    const matchingEvidenceRecords = Object.values(sourceEvidenceRegistry).filter(
      (record) =>
        typeof record?.digest === "string" &&
        record.digest.toLowerCase() === normalizedDigest,
    );

    if (matchingEvidenceRecords.length !== 1) {
      return fail(
        "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_REGISTRY_MISSING",
      );
    }

    const evidenceRecord = matchingEvidenceRecords[0];

    if (
      typeof evidenceRecord.evidenceId !== "string" ||
      !evidenceRecord.evidenceId.trim()
    ) {
      return fail("CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_IDENTITY_INVALID");
    }

    if (
      typeof evidenceRecord.provenanceSourceId !== "string" ||
      !evidenceRecord.provenanceSourceId.trim() ||
      evidenceRecord.provenanceState !== "VERIFIED"
    ) {
      return fail(
        "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_PROVENANCE_UNVERIFIED",
      );
    }

    if (evidenceRecord.lifecycleState !== "ACTIVE") {
      return fail("CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_NOT_ACTIVE");
    }

    if (evidenceRecord.verificationState !== "VERIFIED") {
      return fail(
        "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_UNVERIFIED",
      );
    }

    if (evidenceRecord.conflictState !== "CLEAR") {
      return fail(
        "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_CONFLICTING",
      );
    }

    const evidenceVerifiedAt = Date.parse(evidenceRecord.verifiedAt);
    const evidenceExpiresAt = Date.parse(evidenceRecord.expiresAt);

    if (
      !Number.isFinite(evidenceVerifiedAt) ||
      !Number.isFinite(evidenceExpiresAt) ||
      evidenceExpiresAt <= evidenceVerifiedAt ||
      verificationNow < evidenceVerifiedAt ||
      verificationNow > evidenceExpiresAt
    ) {
      return fail(
        "CONSTITUTIONAL_ADMISSION_SOURCE_EVIDENCE_STALE",
      );
    }
  }

  const verificationSecret =
    _context.verificationSecrets[issuerKeyId]?.trim() ?? "";

  if (!verificationSecret) {
    return fail("CONSTITUTIONAL_ADMISSION_VERIFICATION_SECRET_MISSING");
  }

  if (
    typeof candidate.signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(candidate.signature.trim())
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_SIGNATURE_INVALID");
  }

  let expectedSignature: string;

  try {
    const canonicalPayload = stableStringify({
      schemaVersion: candidate.schemaVersion,
      constitutionVersion: candidate.constitutionVersion,
      tenantId: candidate.tenantId,
      actorId: candidate.actorId,
      actionId: candidate.actionId,
      requesterSource: candidate.requesterSource,
      actionClass: candidate.actionClass,
      requestedCapability: candidate.requestedCapability,
      payloadDigest: candidate.payloadDigest,
      constitutionalInput: candidate.constitutionalInput,
      sourceEvidenceDigests: candidate.sourceEvidenceDigests,
      evidenceIssuerId: candidate.evidenceIssuerId,
      evidenceIssuerKeyId: candidate.evidenceIssuerKeyId,
      issuedAt: candidate.issuedAt,
      expiresAt: candidate.expiresAt,
      nonce: candidate.nonce,
      evaluatedDecision: candidate.evaluatedDecision,
    });

    expectedSignature = createHmac("sha256", verificationSecret)
      .update(canonicalPayload, "utf8")
      .digest("hex");
  } catch {
    return fail("CONSTITUTIONAL_ADMISSION_SIGNATURE_INVALID");
  }

  if (
    !secureHexEquals(
      candidate.signature.trim(),
      expectedSignature,
    )
  ) {
    return fail("CONSTITUTIONAL_ADMISSION_SIGNATURE_INVALID");
  }

  return verifiedNoReplay();
}