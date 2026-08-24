import {
  orchestrateConstitutionalEvidenceAdmission,
  type ConstitutionalEvidenceAdmissionOrchestrationResult,
} from "./aiWorkforceConstitutionalEvidenceAdmissionOrchestrator";
import type {
  ConstitutionalEvidenceReplayStore,
} from "./aiWorkforceConstitutionalEvidenceReplayGuard";
import type {
  ConstitutionalTrustContextResolutionBlocked,
  ConstitutionalTrustContextResolutionFailureCode,
  ConstitutionalTrustContextResolutionRequest,

  ConstitutionalTrustContextResolver,
} from "./aiWorkforceConstitutionalTrustContextResolver";

export const AI_WORKFORCE_CONSTITUTIONAL_TRUSTED_ADMISSION_ORCHESTRATOR_VERSION =
  "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_TRUSTED_ADMISSION_ORCHESTRATOR_V1" as const;

export interface ConstitutionalTrustedAdmissionBlocked {
  readonly orchestrationState: "TRUST_CONTEXT_BLOCKED";
  readonly admitted: false;
  readonly trustContextResolution:
    ConstitutionalTrustContextResolutionBlocked;
  readonly admissionOrchestration: null;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export interface ConstitutionalTrustedAdmissionResolvedTrustSummary {
  readonly resolutionState: "RESOLVED_NO_AUTHORITY";
  readonly failureCode: null;
  readonly resolverId: string;
  readonly verificationContext: null;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}
export interface ConstitutionalTrustedAdmissionResolvedNoAuthority {
  readonly orchestrationState: "TRUST_CONTEXT_RESOLVED_NO_AUTHORITY";
  readonly admitted: false;
  readonly trustContextResolution:
    ConstitutionalTrustedAdmissionResolvedTrustSummary;
  readonly admissionOrchestration:
    ConstitutionalEvidenceAdmissionOrchestrationResult;
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export type ConstitutionalTrustedAdmissionOrchestrationResult =
  | ConstitutionalTrustedAdmissionBlocked
  | ConstitutionalTrustedAdmissionResolvedNoAuthority;

const block = (
  failureCode: ConstitutionalTrustContextResolutionFailureCode,
): ConstitutionalTrustedAdmissionBlocked =>
  Object.freeze({
    orchestrationState: "TRUST_CONTEXT_BLOCKED",
    admitted: false,
    trustContextResolution: Object.freeze({
      resolutionState: "BLOCKED",
      failureCode,
      verificationContext: null,
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    }),
    admissionOrchestration: null,
    constitutionalExecutionAuthorityGranted: false,
    providerExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    legalFilingAuthorized: false,
    externalDeliveryAuthorized: false,
    publicLaunchAuthorized: false,
  });

const validBlockedFailureCodes = new Set([
  "TRUST_CONTEXT_RESOLVER_UNAVAILABLE",
  "TRUST_CONTEXT_RESOLVER_IDENTITY_INVALID",
  "TRUST_CONTEXT_REQUEST_INVALID",
  "TRUST_CONTEXT_BINDING_MISMATCH",
  "TRUST_CONTEXT_LOAD_FAILED",
  "TRUST_CONTEXT_PARTIAL",
  "TRUST_CONTEXT_CORRUPT",
  "TRUST_CONTEXT_STALE",
  "TRUST_CONTEXT_PROVENANCE_UNVERIFIED",
  "TRUST_CONTEXT_AMBIGUOUS",
]);

const isRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value);

const isValidResolvedVerificationContextShape = (
  value: unknown,
): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  const requiredStringFields = [
    "expectedTenantId",
    "expectedActorId",
    "expectedActionId",
    "expectedActionClass",
    "expectedRequestedCapability",
    "expectedPayloadDigest",
    "now",
  ] as const;

  if (
    requiredStringFields.some(
      (field) =>
        typeof value[field] !== "string" ||
        !(value[field] as string).trim(),
    )
  ) {
    return false;
  }

  if (
    !/^[a-f0-9]{64}$/i.test(
      value.expectedPayloadDigest as string,
    )
  ) {
    return false;
  }

  if (
    !isRecord(value.trustedIssuers) ||
    !isRecord(value.verificationSecrets)
  ) {
    return false;
  }

  if (
    value.sourceEvidenceRegistry !== undefined &&
    !isRecord(value.sourceEvidenceRegistry)
  ) {
    return false;
  }

  if (
    value.sourceEvidenceRegistryTrust !== undefined &&
    !isRecord(value.sourceEvidenceRegistryTrust)
  ) {
    return false;
  }

  return true;
};
const isValidTrustContextResolutionResult = (
  value: unknown,
): boolean => {
  if (!isRecord(value)) {
    return false;
  }

  const authorityFields = [
    "constitutionalExecutionAuthorityGranted",
    "providerExecutionAuthorized",
    "paymentExecutionAuthorized",
    "legalFilingAuthorized",
    "externalDeliveryAuthorized",
    "publicLaunchAuthorized",
  ] as const;

  if (authorityFields.some((field) => value[field] !== false)) {
    return false;
  }

  if (value.resolutionState === "BLOCKED") {
    return (
      typeof value.failureCode === "string" &&
      validBlockedFailureCodes.has(value.failureCode) &&
      value.verificationContext === null
    );
  }

  if (value.resolutionState === "RESOLVED_NO_AUTHORITY") {
    return (
      value.failureCode === null &&
      isValidResolvedVerificationContextShape(
        value.verificationContext,
      )
    );
  }

  return false;
};
const isValidTrustContextResolutionRequest = (
  value: unknown,
): value is ConstitutionalTrustContextResolutionRequest => {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const requiredStringFields = [
    "expectedTenantId",
    "expectedActorId",
    "expectedActionId",
    "expectedActionClass",
    "expectedRequestedCapability",
  ] as const;

  if (
    requiredStringFields.some(
      (field) =>
        typeof candidate[field] !== "string" ||
        !(candidate[field] as string).trim(),
    )
  ) {
    return false;
  }

  return (
    typeof candidate.expectedPayloadDigest === "string" &&
    /^[a-f0-9]{64}$/i.test(candidate.expectedPayloadDigest)
  );
};
/**
 * Section 6C boundary.
 *
 * The caller supplies request-bound identity/scope values only. Trusted issuer
 * records, source-evidence registry state, registry trust metadata,
 * verification material, and trusted time can enter admission only through
 * the resolver.
 *
 * This boundary itself grants no execution authority and does not prove any
 * concrete resolver implementation trusted.
 */
async function orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
  record: unknown,
  request: unknown,
  resolver: ConstitutionalTrustContextResolver | null | undefined,
  replayStore: ConstitutionalEvidenceReplayStore | null | undefined,
): Promise<ConstitutionalTrustedAdmissionOrchestrationResult> {
  if (!isValidTrustContextResolutionRequest(request)) {
    return block("TRUST_CONTEXT_REQUEST_INVALID");
  }

  if (!resolver) {
    return block("TRUST_CONTEXT_RESOLVER_UNAVAILABLE");
  }

  let resolverId: unknown;

  try {
    resolverId = resolver.resolverId;
  } catch {
    return block("TRUST_CONTEXT_RESOLVER_IDENTITY_INVALID");
  }

  if (
    typeof resolverId !== "string" ||
    !resolverId.trim()
  ) {
    return block("TRUST_CONTEXT_RESOLVER_IDENTITY_INVALID");
  }

  let trustContextResolution;

  try {
    trustContextResolution =
      await resolver.resolveTrustContext(request);
  } catch {
    return block("TRUST_CONTEXT_LOAD_FAILED");
  }

  try {
  if (!isValidTrustContextResolutionResult(trustContextResolution)) {
    return block("TRUST_CONTEXT_CORRUPT");
  }

  if (trustContextResolution.resolutionState === "BLOCKED") {
    return block(trustContextResolution.failureCode);
  }

  const resolvedContext = trustContextResolution.verificationContext;

  if (
    resolvedContext.expectedTenantId !== request.expectedTenantId ||
    resolvedContext.expectedActorId !== request.expectedActorId ||
    resolvedContext.expectedActionId !== request.expectedActionId ||
    resolvedContext.expectedActionClass !== request.expectedActionClass ||
    resolvedContext.expectedRequestedCapability !==
      request.expectedRequestedCapability ||
    resolvedContext.expectedPayloadDigest !== request.expectedPayloadDigest
  ) {
    return block("TRUST_CONTEXT_BINDING_MISMATCH");
  }

  const admissionOrchestration =
    await orchestrateConstitutionalEvidenceAdmission(
      record,
      trustContextResolution.verificationContext,
      replayStore,
    );

  return Object.freeze({
    orchestrationState: "TRUST_CONTEXT_RESOLVED_NO_AUTHORITY",
    admitted: false,
    trustContextResolution: Object.freeze({
      resolutionState: "RESOLVED_NO_AUTHORITY" as const,
      failureCode: null,
      resolverId,
      verificationContext: null,
      constitutionalExecutionAuthorityGranted: false as const,
      providerExecutionAuthorized: false as const,
      paymentExecutionAuthorized: false as const,
      legalFilingAuthorized: false as const,
      externalDeliveryAuthorized: false as const,
      publicLaunchAuthorized: false as const,
    }),
    admissionOrchestration,
    constitutionalExecutionAuthorityGranted: false,
    providerExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    legalFilingAuthorized: false,
    externalDeliveryAuthorized: false,
    publicLaunchAuthorized: false,
  });
  } catch {
    return block("TRUST_CONTEXT_CORRUPT");
  }
}
/**
 * Bootstrap-time Section 6C dependency boundary.
 *
 * Request-time callers receive only `orchestrate(record, request)` and cannot
 * supply or replace the bound trust-context resolver or replay store.
 *
 * Binding a resolver here does not prove that concrete resolver trusted.
 */
export interface ConstitutionalTrustedAdmissionBoundary {
  readonly orchestrate: (
    record: unknown,
    request: unknown,
  ) => Promise<ConstitutionalTrustedAdmissionOrchestrationResult>;
}

export function createConstitutionalTrustedAdmissionBoundary(
  resolver: ConstitutionalTrustContextResolver | null | undefined,
  replayStore: ConstitutionalEvidenceReplayStore | null | undefined,
): ConstitutionalTrustedAdmissionBoundary {
  return Object.freeze({
    orchestrate: (
      record: unknown,
      request: unknown,
    ) =>
      orchestrateConstitutionalEvidenceAdmissionWithTrustResolver(
        record,
        request,
        resolver,
        replayStore,
      ),
  });
}
