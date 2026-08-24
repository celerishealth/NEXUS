import type {
  ConstitutionalEvidenceAdmissionVerificationContext,
  ConstitutionalEvidenceIssuerTrustRecord,
  ConstitutionalSourceEvidenceRegistryTrustEnvelope,
  ConstitutionalSourceEvidenceTrustRecord,
} from "./aiWorkforceConstitutionalEvidenceAdmission";
import type {
  ConstitutionalTrustContextResolutionFailureCode,
  ConstitutionalTrustContextResolutionRequest,
  ConstitutionalTrustContextResolutionResult,
  ConstitutionalTrustContextResolver,
} from "./aiWorkforceConstitutionalTrustContextResolver";

/**
 * Bootstrap-owned in-memory trust snapshot.
 *
 * This implementation performs no DB, environment, network, provider,
 * payment, filing, or external execution access.
 *
 * Creating this snapshot does NOT by itself prove the supplied trust material
 * independently trustworthy. It is a concrete Section 6C construction seam
 * for isolated verification and later owner-controlled bootstrap wiring.
 */
export interface ConstitutionalInMemoryTrustContextSnapshot {
  readonly resolverId: string;
  readonly snapshotId: string;
  readonly provenanceSourceId: string;
  readonly provenanceState: "VERIFIED" | "UNVERIFIED";
  readonly integrityState: "VERIFIED" | "UNVERIFIED";
  readonly verifiedAt: string;
  readonly expiresAt: string;
  readonly trustedIssuers:
    Readonly<Record<string, ConstitutionalEvidenceIssuerTrustRecord>>;
  readonly sourceEvidenceRegistry:
    Readonly<Record<string, ConstitutionalSourceEvidenceTrustRecord>>;
  readonly sourceEvidenceRegistryTrust:
    ConstitutionalSourceEvidenceRegistryTrustEnvelope;
  readonly verificationSecrets: Readonly<Record<string, string>>;
  readonly now: string;
}

const block = (
  failureCode: ConstitutionalTrustContextResolutionFailureCode,
): ConstitutionalTrustContextResolutionResult =>
  Object.freeze({
    resolutionState: "BLOCKED" as const,
    failureCode,
    verificationContext: null,
    constitutionalExecutionAuthorityGranted: false as const,
    providerExecutionAuthorized: false as const,
    paymentExecutionAuthorized: false as const,
    legalFilingAuthorized: false as const,
    externalDeliveryAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  });

export function createInMemoryConstitutionalTrustContextResolver(
  snapshot: ConstitutionalInMemoryTrustContextSnapshot,
): ConstitutionalTrustContextResolver {
  const resolverId = snapshot.resolverId.trim();
  const snapshotId = snapshot.snapshotId;
  const snapshotProvenanceSourceId =
    snapshot.provenanceSourceId;
  const snapshotProvenanceState =
    snapshot.provenanceState;
  const snapshotIntegrityState =
    snapshot.integrityState;
  const snapshotVerifiedAt = snapshot.verifiedAt;
  const snapshotExpiresAt = snapshot.expiresAt;

  const trustedIssuers = Object.freeze(
    Object.fromEntries(
      Object.entries(snapshot.trustedIssuers).map(
        ([key, record]) => [
          key,
          Object.freeze({
            ...record,
            allowedActionClasses:
              record.allowedActionClasses === undefined
                ? undefined
                : Object.freeze([...record.allowedActionClasses]),
            allowedCapabilities:
              record.allowedCapabilities === undefined
                ? undefined
                : Object.freeze([...record.allowedCapabilities]),
          }),
        ],
      ),
    ),
  ) as Readonly<
    Record<string, ConstitutionalEvidenceIssuerTrustRecord>
  >;

  const sourceEvidenceRegistry = Object.freeze(
    Object.fromEntries(
      Object.entries(snapshot.sourceEvidenceRegistry).map(
        ([key, record]) => [
          key,
          Object.freeze({ ...record }),
        ],
      ),
    ),
  ) as Readonly<
    Record<string, ConstitutionalSourceEvidenceTrustRecord>
  >;

  const sourceEvidenceRegistryTrust = Object.freeze({
    ...snapshot.sourceEvidenceRegistryTrust,
  });

  const verificationSecrets = Object.freeze({
    ...snapshot.verificationSecrets,
  });

  const trustedNow = snapshot.now;

  return Object.freeze({
    resolverId,

    async resolveTrustContext(
      request: ConstitutionalTrustContextResolutionRequest,
    ): Promise<ConstitutionalTrustContextResolutionResult> {
      if (!resolverId) {
        return block("TRUST_CONTEXT_RESOLVER_IDENTITY_INVALID");
      }

      const trustedNowMs = Date.parse(trustedNow);
      const snapshotVerifiedAtMs =
        Date.parse(snapshotVerifiedAt);
      const snapshotExpiresAtMs =
        Date.parse(snapshotExpiresAt);

      if (
        typeof snapshotId !== "string" ||
        !snapshotId.trim() ||
        typeof snapshotProvenanceSourceId !== "string" ||
        !snapshotProvenanceSourceId.trim() ||
        !Number.isFinite(trustedNowMs) ||
        !Number.isFinite(snapshotVerifiedAtMs) ||
        !Number.isFinite(snapshotExpiresAtMs) ||
        snapshotVerifiedAtMs >= snapshotExpiresAtMs ||
        trustedNowMs < snapshotVerifiedAtMs
      ) {
        return block("TRUST_CONTEXT_CORRUPT");
      }

      if (snapshotProvenanceState !== "VERIFIED") {
        return block(
          "TRUST_CONTEXT_PROVENANCE_UNVERIFIED",
        );
      }

      if (snapshotIntegrityState !== "VERIFIED") {
        return block("TRUST_CONTEXT_CORRUPT");
      }

      if (trustedNowMs >= snapshotExpiresAtMs) {
        return block("TRUST_CONTEXT_STALE");
      }

      const verificationContext:
        ConstitutionalEvidenceAdmissionVerificationContext =
        Object.freeze({
          expectedTenantId: request.expectedTenantId,
          expectedActorId: request.expectedActorId,
          expectedActionId: request.expectedActionId,
          expectedActionClass: request.expectedActionClass,
          expectedRequestedCapability:
            request.expectedRequestedCapability,
          expectedPayloadDigest: request.expectedPayloadDigest,
          trustedIssuers,
          sourceEvidenceRegistry,
          sourceEvidenceRegistryTrust,
          verificationSecrets,
          now: trustedNow,
        });

      return Object.freeze({
        resolutionState: "RESOLVED_NO_AUTHORITY" as const,
        failureCode: null,
        verificationContext,
        constitutionalExecutionAuthorityGranted: false as const,
        providerExecutionAuthorized: false as const,
        paymentExecutionAuthorized: false as const,
        legalFilingAuthorized: false as const,
        externalDeliveryAuthorized: false as const,
        publicLaunchAuthorized: false as const,
      });
    },
  });
}