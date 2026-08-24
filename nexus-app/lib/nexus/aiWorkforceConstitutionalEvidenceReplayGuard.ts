export const AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_REPLAY_GUARD_VERSION =
  "NEXUS_AI_WORKFORCE_CONSTITUTIONAL_EVIDENCE_REPLAY_GUARD_V1" as const;

export interface ConstitutionalEvidenceReplayIdentity {
  readonly tenantId: string;
  readonly evidenceIssuerId: string;
  readonly evidenceIssuerKeyId: string;
  readonly actionId: string;
  readonly nonce: string;
}

export interface ConstitutionalEvidenceReplayNonceScope {
  readonly tenantId: string;
  readonly evidenceIssuerId: string;
  readonly evidenceIssuerKeyId: string;
  readonly nonce: string;
}

export function createConstitutionalEvidenceReplayNonceScope(
  input: ConstitutionalEvidenceReplayIdentity,
): ConstitutionalEvidenceReplayNonceScope {
  return Object.freeze({
    tenantId: input.tenantId.trim(),
    evidenceIssuerId: input.evidenceIssuerId.trim(),
    evidenceIssuerKeyId: input.evidenceIssuerKeyId.trim(),
    nonce: input.nonce.trim(),
  });
}

export type ConstitutionalEvidenceReplayGuardFailureCode =
  | "CONSTITUTIONAL_REPLAY_IDENTITY_INVALID"
  | "CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE"
  | "CONSTITUTIONAL_REPLAY_DETECTED";

export interface ConstitutionalEvidenceReplayFailureResult {
  readonly replayState: "REJECTED";
  readonly replayAccepted: false;
  readonly failureCodes:
    readonly ConstitutionalEvidenceReplayGuardFailureCode[];
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export interface ConstitutionalEvidenceReplayReservedNoAuthorityResult {
  readonly replayState: "REPLAY_RESERVED_NO_AUTHORITY";
  readonly replayAccepted: true;
  readonly failureCodes: readonly [];
  readonly constitutionalExecutionAuthorityGranted: false;
  readonly providerExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly legalFilingAuthorized: false;
  readonly externalDeliveryAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export type ConstitutionalEvidenceReplayGuardResult =
  | ConstitutionalEvidenceReplayFailureResult
  | ConstitutionalEvidenceReplayReservedNoAuthorityResult;

export interface ConstitutionalEvidenceReplayStore {
  reserveReplayNonceScope(
    scope: ConstitutionalEvidenceReplayNonceScope,
  ): Promise<"RESERVED" | "ALREADY_USED" | "UNAVAILABLE">;
}

const replayFail = (
  code: ConstitutionalEvidenceReplayGuardFailureCode,
): ConstitutionalEvidenceReplayFailureResult =>
  Object.freeze({
    replayState: "REJECTED",
    replayAccepted: false,
    failureCodes: Object.freeze([code]),
    constitutionalExecutionAuthorityGranted: false,
    providerExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    legalFilingAuthorized: false,
    externalDeliveryAuthorized: false,
    publicLaunchAuthorized: false,
  });

const replayReservedNoAuthority =
  (): ConstitutionalEvidenceReplayReservedNoAuthorityResult =>
    Object.freeze({
      replayState: "REPLAY_RESERVED_NO_AUTHORITY",
      replayAccepted: true,
      failureCodes: Object.freeze([] as const),
      constitutionalExecutionAuthorityGranted: false,
      providerExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      legalFilingAuthorized: false,
      externalDeliveryAuthorized: false,
      publicLaunchAuthorized: false,
    });
const isValidReplayIdentity = (
  identity: ConstitutionalEvidenceReplayIdentity,
): boolean =>
  [
    identity.tenantId,
    identity.evidenceIssuerId,
    identity.evidenceIssuerKeyId,
    identity.actionId,
    identity.nonce,
  ].every(
    (value) =>
      typeof value === "string" &&
      Boolean(value.trim()),
  );

export async function guardConstitutionalEvidenceReplay(
  identity: ConstitutionalEvidenceReplayIdentity,
  store: ConstitutionalEvidenceReplayStore | null | undefined,
): Promise<ConstitutionalEvidenceReplayGuardResult> {
  if (!isValidReplayIdentity(identity)) {
    return replayFail("CONSTITUTIONAL_REPLAY_IDENTITY_INVALID");
  }

  if (!store) {
    return replayFail("CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE");
  }

  const normalizedIdentity =
    createConstitutionalEvidenceReplayIdentity(identity);

  let reservation:
    | "RESERVED"
    | "ALREADY_USED"
    | "UNAVAILABLE";

  try {
    reservation =
      await store.reserveReplayNonceScope(
      createConstitutionalEvidenceReplayNonceScope(normalizedIdentity),
    );
  } catch {
    return replayFail("CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE");
  }

  if (reservation === "ALREADY_USED") {
    return replayFail("CONSTITUTIONAL_REPLAY_DETECTED");
  }

  if (reservation !== "RESERVED") {
    return replayFail("CONSTITUTIONAL_REPLAY_STORE_UNAVAILABLE");
  }

  return replayReservedNoAuthority();
}
export function createConstitutionalEvidenceReplayIdentity(
  input: ConstitutionalEvidenceReplayIdentity,
): ConstitutionalEvidenceReplayIdentity {
  return Object.freeze({
    tenantId: input.tenantId.trim(),
    evidenceIssuerId: input.evidenceIssuerId.trim(),
    evidenceIssuerKeyId: input.evidenceIssuerKeyId.trim(),
    actionId: input.actionId.trim(),
    nonce: input.nonce.trim(),
  });
}