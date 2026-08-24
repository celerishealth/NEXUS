import { createPublicKey } from "node:crypto";
import { CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION } from "./aiWorkforceConstitutionalOwnerReviewerTrustRootProvenanceAuthorityRoot";

export type ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "ROOT_VERSION_INVALID"
  | "ROOT_BINDING_INVALID"
  | "ALGORITHM_INVALID"
  | "PUBLIC_KEY_MATERIAL_INVALID"
  | "PUBLIC_KEY_INVALID_OR_UNSUPPORTED"
  | "ROOT_STATE_INVALID"
  | "INTEGRITY_STATE_INVALID"
  | "TIMESTAMP_INVALID"
  | "TIMESTAMP_ORDER_INVALID"
  | "ROTATION_KEY_ID_INVALID"
  | "ROTATION_SELF_REFERENCE";

export interface ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationResult {
  readonly validationState: "VALID_PROVENANCE_ROOT_CANDIDATE_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationFailureCode[];
  readonly provenanceRootTrusted: false;
  readonly referenceProvenanceVerified: false;
  readonly integrityVerified: false;
  readonly freshnessVerified: false;
  readonly rollbackProtectionVerified: false;
  readonly reviewerKeyTrusted: false;
  readonly runtimeTrustEstablished: false;
  readonly issuerTrustEstablished: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const makeResult = (
  validationState: ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationResult["validationState"],
  failureCodes: readonly ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationFailureCode[],
): ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
  provenanceRootTrusted: false as const,
  referenceProvenanceVerified: false as const,
  integrityVerified: false as const,
  freshnessVerified: false as const,
  rollbackProtectionVerified: false as const,
  reviewerKeyTrusted: false as const,
  runtimeTrustEstablished: false as const,
  issuerTrustEstablished: false as const,
  admissionProjectionAuthorized: false as const,
  constitutionalExecutionAuthorityGranted: false as const,
  providerExecutionAuthorized: false as const,
  paymentExecutionAuthorized: false as const,
  legalFilingAuthorized: false as const,
  externalDeliveryAuthorized: false as const,
  publicLaunchAuthorized: false as const,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isCanonicalIdentifier = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length >= 1 &&
  value.length <= 256 &&
  value === value.trim();

const parseCanonicalIso = (value: unknown): number | null => {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  try {
    return new Date(parsed).toISOString() === value ? parsed : null;
  } catch {
    return null;
  }
};

export function validateConstitutionalOwnerReviewerProvenanceAuthorityRootCandidate(
  candidate: unknown,
): ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationResult {
  try {
    if (!isRecord(candidate)) {
      return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    }

    const failures: ConstitutionalOwnerReviewerProvenanceAuthorityRootValidationFailureCode[] = [];

    if (candidate.rootVersion !== CONSTITUTIONAL_OWNER_REVIEWER_PROVENANCE_AUTHORITY_ROOT_VERSION) {
      failures.push("ROOT_VERSION_INVALID");
    }

    for (const value of [
      candidate.rootId,
      candidate.authorityId,
      candidate.keyId,
      candidate.provenanceSourceId,
      candidate.provisionDecisionId,
      candidate.provisionedBy,
    ]) {
      if (!isCanonicalIdentifier(value)) {
        failures.push("ROOT_BINDING_INVALID");
        break;
      }
    }

    if (candidate.algorithm !== "Ed25519") {
      failures.push("ALGORITHM_INVALID");
    }

    if (
      typeof candidate.publicKeyPem !== "string" ||
      candidate.publicKeyPem.length < 64 ||
      candidate.publicKeyPem.length > 4096 ||
      candidate.publicKeyPem !== candidate.publicKeyPem.trim() ||
      !candidate.publicKeyPem.startsWith("-----BEGIN PUBLIC KEY-----") ||
      !candidate.publicKeyPem.endsWith("-----END PUBLIC KEY-----") ||
      candidate.publicKeyPem.includes("PRIVATE KEY")
    ) {
      failures.push("PUBLIC_KEY_MATERIAL_INVALID");
    } else {
      try {
        const key = createPublicKey(candidate.publicKeyPem);
        if (key.asymmetricKeyType !== "ed25519") {
          failures.push("PUBLIC_KEY_INVALID_OR_UNSUPPORTED");
        }
      } catch {
        failures.push("PUBLIC_KEY_INVALID_OR_UNSUPPORTED");
      }
    }

    if (!["ACTIVE", "DISABLED", "REVOKED", "RETIRED"].includes(String(candidate.state))) {
      failures.push("ROOT_STATE_INVALID");
    }

    if (!["VERIFIED", "UNVERIFIED"].includes(String(candidate.integrityState))) {
      failures.push("INTEGRITY_STATE_INVALID");
    }

    const activatedAt = parseCanonicalIso(candidate.activatedAt);
    const verifiedAt = parseCanonicalIso(candidate.verifiedAt);
    const expiresAt = parseCanonicalIso(candidate.expiresAt);
    if (activatedAt === null || verifiedAt === null || expiresAt === null) {
      failures.push("TIMESTAMP_INVALID");
    } else if (activatedAt > verifiedAt || verifiedAt >= expiresAt) {
      failures.push("TIMESTAMP_ORDER_INVALID");
    }

    if (candidate.rotationOfKeyId !== undefined) {
      if (!isCanonicalIdentifier(candidate.rotationOfKeyId)) {
        failures.push("ROTATION_KEY_ID_INVALID");
      } else if (candidate.rotationOfKeyId === candidate.keyId) {
        failures.push("ROTATION_SELF_REFERENCE");
      }
    }

    const uniqueFailures = [...new Set(failures)];
    return uniqueFailures.length > 0
      ? makeResult("REJECTED", uniqueFailures)
      : makeResult("VALID_PROVENANCE_ROOT_CANDIDATE_NO_TRUST", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}