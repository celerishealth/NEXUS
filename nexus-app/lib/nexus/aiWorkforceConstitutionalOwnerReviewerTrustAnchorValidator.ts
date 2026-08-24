import { createPublicKey } from "node:crypto";
import { CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION } from "./aiWorkforceConstitutionalOwnerReviewerTrustAnchor";

export type ConstitutionalOwnerReviewerTrustAnchorValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "SCHEMA_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "ALGORITHM_INVALID"
  | "PUBLIC_KEY_MATERIAL_INVALID"
  | "PUBLIC_KEY_INVALID_OR_UNSUPPORTED"
  | "ANCHOR_STATE_INVALID"
  | "INTEGRITY_STATE_INVALID"
  | "TIMESTAMP_INVALID"
  | "TIMESTAMP_ORDER_INVALID";

export interface ConstitutionalOwnerReviewerTrustAnchorValidationResult {
  readonly validationState: "VALID_ANCHOR_CANDIDATE_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalOwnerReviewerTrustAnchorValidationFailureCode[];
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
  validationState: ConstitutionalOwnerReviewerTrustAnchorValidationResult["validationState"],
  failureCodes: readonly ConstitutionalOwnerReviewerTrustAnchorValidationFailureCode[],
): ConstitutionalOwnerReviewerTrustAnchorValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
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

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function validateConstitutionalOwnerReviewerTrustAnchorCandidate(
  candidate: unknown,
): ConstitutionalOwnerReviewerTrustAnchorValidationResult {
  try {
    if (!isRecord(candidate)) {
      return makeResult("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
    }

    const failures: ConstitutionalOwnerReviewerTrustAnchorValidationFailureCode[] = [];

    if (candidate.schemaVersion !== CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ANCHOR_SCHEMA_VERSION) {
      failures.push("SCHEMA_VERSION_INVALID");
    }

    for (const value of [
      candidate.anchorId,
      candidate.reviewerId,
      candidate.keyId,
      candidate.provenanceSourceId,
      candidate.provisionDecisionId,
      candidate.provisionedBy,
    ]) {
      if (!isNonEmptyString(value)) {
        failures.push("REQUIRED_BINDING_INVALID");
        break;
      }
    }

    if (candidate.algorithm !== "Ed25519") {
      failures.push("ALGORITHM_INVALID");
    }

    const publicKeyPem = candidate.publicKeyPem;
    if (
      !isNonEmptyString(publicKeyPem) ||
      !publicKeyPem.trim().startsWith("-----BEGIN PUBLIC KEY-----") ||
      !publicKeyPem.trim().endsWith("-----END PUBLIC KEY-----") ||
      publicKeyPem.includes("PRIVATE KEY")
    ) {
      failures.push("PUBLIC_KEY_MATERIAL_INVALID");
    } else {
      try {
        const publicKey = createPublicKey(publicKeyPem);
        if (publicKey.asymmetricKeyType !== "ed25519") {
          failures.push("PUBLIC_KEY_INVALID_OR_UNSUPPORTED");
        }
      } catch {
        failures.push("PUBLIC_KEY_INVALID_OR_UNSUPPORTED");
      }
    }

    if (!["ACTIVE", "DISABLED", "REVOKED", "RETIRED"].includes(String(candidate.state))) {
      failures.push("ANCHOR_STATE_INVALID");
    }

    if (!["VERIFIED", "UNVERIFIED"].includes(String(candidate.integrityState))) {
      failures.push("INTEGRITY_STATE_INVALID");
    }

    const activatedAt = Date.parse(String(candidate.activatedAt));
    const verifiedAt = Date.parse(String(candidate.verifiedAt));
    const expiresAt = Date.parse(String(candidate.expiresAt));

    if (![activatedAt, verifiedAt, expiresAt].every(Number.isFinite)) {
      failures.push("TIMESTAMP_INVALID");
    } else if (activatedAt > verifiedAt || verifiedAt >= expiresAt) {
      failures.push("TIMESTAMP_ORDER_INVALID");
    }

    if (candidate.rotationOfKeyId !== undefined && !isNonEmptyString(candidate.rotationOfKeyId)) {
      failures.push("REQUIRED_BINDING_INVALID");
    }

    const uniqueFailures = [...new Set(failures)];
    return uniqueFailures.length > 0
      ? makeResult("REJECTED", uniqueFailures)
      : makeResult("VALID_ANCHOR_CANDIDATE_NO_TRUST", []);
  } catch {
    return makeResult("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}