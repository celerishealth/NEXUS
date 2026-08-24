import {
  CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION,
} from "./aiWorkforceConstitutionalIssuerTrustLifecycle";

export type ConstitutionalIssuerTrustLifecycleValidationFailureCode =
  | "CANDIDATE_NOT_OBJECT"
  | "CANDIDATE_ACCESS_FAILED"
  | "SCHEMA_VERSION_INVALID"
  | "REQUIRED_BINDING_INVALID"
  | "SCOPE_INVALID"
  | "LIFECYCLE_STATE_INVALID"
  | "TIMESTAMP_INVALID"
  | "TIMESTAMP_ORDER_INVALID";

export interface ConstitutionalIssuerTrustLifecycleValidationResult {
  readonly validationState: "VALID_CANDIDATE_NO_TRUST" | "REJECTED";
  readonly failureCodes: readonly ConstitutionalIssuerTrustLifecycleValidationFailureCode[];
  readonly runtimeTrustEstablished: false;
  readonly admissionProjectionAuthorized: false;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

const result = (
  validationState: ConstitutionalIssuerTrustLifecycleValidationResult["validationState"],
  failureCodes: readonly ConstitutionalIssuerTrustLifecycleValidationFailureCode[],
): ConstitutionalIssuerTrustLifecycleValidationResult => Object.freeze({
  validationState,
  failureCodes: Object.freeze([...failureCodes]),
  runtimeTrustEstablished: false as const,
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

const isValidScope = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every(isNonEmptyString) &&
  new Set(value.map((entry) => entry.trim())).size === value.length;

export function validateConstitutionalIssuerTrustLifecycleCandidate(
  candidate: unknown,
): ConstitutionalIssuerTrustLifecycleValidationResult {
  try {
  if (!isRecord(candidate)) {
    return result("REJECTED", ["CANDIDATE_NOT_OBJECT"]);
  }

  const failures: ConstitutionalIssuerTrustLifecycleValidationFailureCode[] = [];

  if (candidate.schemaVersion !== CONSTITUTIONAL_ISSUER_TRUST_LIFECYCLE_SCHEMA_VERSION) {
    failures.push("SCHEMA_VERSION_INVALID");
  }

  const requiredBindings = [
    candidate.trustBindingId,
    candidate.issuerId,
    candidate.activeKeyId,
    candidate.evidenceAuthorityPurpose,
    candidate.provenanceSourceId,
    candidate.reviewedBy,
    candidate.reviewDecisionId,
  ];

  if (requiredBindings.some((value) => !isNonEmptyString(value))) {
    failures.push("REQUIRED_BINDING_INVALID");
  }

  if (!isValidScope(candidate.permittedActionClasses) || !isValidScope(candidate.permittedCapabilities)) {
    failures.push("SCOPE_INVALID");
  }

  if (
    !["ACTIVE", "DISABLED", "REVOKED", "RETIRED"].includes(String(candidate.status)) ||
    !["VERIFIED", "UNVERIFIED"].includes(String(candidate.trustState)) ||
    !["ACTIVE", "DISABLED", "REVOKED", "RETIRED", "EXPIRED"].includes(String(candidate.keyState)) ||
    !["VERIFIED", "UNVERIFIED"].includes(String(candidate.integrityState))
  ) {
    failures.push("LIFECYCLE_STATE_INVALID");
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
    ? result("REJECTED", uniqueFailures)
    : result("VALID_CANDIDATE_NO_TRUST", []);
  } catch {
    return result("REJECTED", ["CANDIDATE_ACCESS_FAILED"]);
  }
}