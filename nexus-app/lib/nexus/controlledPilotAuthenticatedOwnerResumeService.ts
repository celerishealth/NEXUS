import type {
  ControlledPilotOwnerResumeProofInvalid,
} from "./controlledPilotOwnerResumeAuthorization";

import {
  verifyControlledPilotOwnerResumeProof,
} from "./controlledPilotOwnerResumeAuthorization";

import type {
  ControlledPilotResumeProofLedger,
  ControlledPilotResumeRejected,
} from "./controlledPilotResumeConsumptionGate";

import {
  authorizeControlledPilotResume,
} from "./controlledPilotResumeConsumptionGate";

export interface TrustedControlledPilotOwnerIdentity {
  authenticated: boolean;
  userId: string;
  tenantId: string;
  roles: readonly string[];
  sessionId?: string;
}

export interface AuthenticatedControlledPilotResumeInput {
  identity: TrustedControlledPilotOwnerIdentity;
  proofToken: string;
  expectedSignalId: string;
  signingSecret: string;
  ledger: ControlledPilotResumeProofLedger;
  nowEpochSeconds?: number;
}

export interface AuthenticatedControlledPilotResumeAuthorized {
  authorized: true;
  code: "AUTHENTICATED_OWNER_RESUME_AUTHORIZED";
  tenantId: string;
  ownerId: string;
  signalId: string;
  tokenId: string;
  consumedAt: number;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: true;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface AuthenticatedControlledPilotResumeRejected {
  authorized: false;
  code:
    | "INVALID_TRUSTED_IDENTITY"
    | "AUTHENTICATION_REQUIRED"
    | "TENANT_OWNER_ROLE_REQUIRED"
    | "INVALID_RESUME_REQUEST"
    | "SIGNED_PROOF_REJECTED"
    | "OWNER_BINDING_MISMATCH"
    | "RESUME_AUTHORIZATION_REJECTED";
  reason: string;
  verificationCode?:
    ControlledPilotOwnerResumeProofInvalid["code"];
  authorizationCode?:
    ControlledPilotResumeRejected["code"];
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type AuthenticatedControlledPilotResumeResult =
  | AuthenticatedControlledPilotResumeAuthorized
  | AuthenticatedControlledPilotResumeRejected;

interface NormalizedTrustedIdentity {
  authenticated: boolean;
  userId: string;
  tenantId: string;
  roles: readonly string[];
  sessionId: string | null;
}

function reject(
  code: AuthenticatedControlledPilotResumeRejected["code"],
  reason: string,
  details?: {
    verificationCode?:
      ControlledPilotOwnerResumeProofInvalid["code"];
    authorizationCode?:
      ControlledPilotResumeRejected["code"];
  },
): AuthenticatedControlledPilotResumeRejected {
  return {
    authorized: false,
    code,
    reason,
    ...(details?.verificationCode
      ? {
          verificationCode:
            details.verificationCode,
        }
      : {}),
    ...(details?.authorizationCode
      ? {
          authorizationCode:
            details.authorizationCode,
        }
      : {}),
    automaticResumeAuthorized: false,
    pilotOperationPermitted: false,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

function normalizeRequiredString(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

function normalizeRoles(
  value: unknown,
): readonly string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalizedRoles: string[] = [];

  for (const role of value) {
    const normalizedRole =
      normalizeRequiredString(role);

    if (!normalizedRole) {
      return null;
    }

    if (!normalizedRoles.includes(normalizedRole)) {
      normalizedRoles.push(normalizedRole);
    }
  }

  return normalizedRoles;
}

function normalizeTrustedIdentity(
  value: unknown,
): NormalizedTrustedIdentity | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const record =
    value as Record<string, unknown>;

  const userId =
    normalizeRequiredString(record.userId);

  const tenantId =
    normalizeRequiredString(record.tenantId);

  const roles =
    normalizeRoles(record.roles);

  const sessionId =
    record.sessionId === undefined
      ? null
      : normalizeRequiredString(
          record.sessionId,
        );

  if (
    typeof record.authenticated !== "boolean" ||
    !userId ||
    !tenantId ||
    !roles ||
    (
      record.sessionId !== undefined &&
      !sessionId
    )
  ) {
    return null;
  }

  return {
    authenticated: record.authenticated,
    userId,
    tenantId,
    roles,
    sessionId,
  };
}

function isValidEpochSecond(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
  );
}

export async function authorizeAuthenticatedControlledPilotOwnerResume(
  input: AuthenticatedControlledPilotResumeInput,
): Promise<AuthenticatedControlledPilotResumeResult> {
  const identity =
    normalizeTrustedIdentity(
      input?.identity,
    );

  if (!identity) {
    return reject(
      "INVALID_TRUSTED_IDENTITY",
      "Trusted authentication identity is incomplete or invalid.",
    );
  }

  if (!identity.authenticated) {
    return reject(
      "AUTHENTICATION_REQUIRED",
      "An authenticated tenant-owner session is required.",
    );
  }

  if (!identity.roles.includes("owner")) {
    return reject(
      "TENANT_OWNER_ROLE_REQUIRED",
      "The authenticated identity does not have the tenant owner role.",
    );
  }

  const proofToken =
    normalizeRequiredString(
      input?.proofToken,
    );

  const expectedSignalId =
    normalizeRequiredString(
      input?.expectedSignalId,
    );

  const signingSecret =
    normalizeRequiredString(
      input?.signingSecret,
    );

  const nowEpochSeconds =
    input?.nowEpochSeconds ??
    Math.floor(Date.now() / 1000);

  if (
    !proofToken ||
    !expectedSignalId ||
    !signingSecret ||
    !isValidEpochSecond(nowEpochSeconds)
  ) {
    return reject(
      "INVALID_RESUME_REQUEST",
      "Authenticated resume request input is incomplete or invalid.",
    );
  }

  /*
   * The expected tenant comes only from the trusted
   * authenticated identity. No caller-provided tenant
   * identifier is accepted by this service.
   */
  const verification =
    verifyControlledPilotOwnerResumeProof({
      token: proofToken,
      signingSecret,
      expectedTenantId: identity.tenantId,
      expectedSignalId,
      nowEpochSeconds,
    });

  if (!verification.valid) {
    return reject(
      "SIGNED_PROOF_REJECTED",
      verification.reason,
      {
        verificationCode:
          verification.code,
      },
    );
  }

  /*
   * Owner binding is checked before atomic consumption.
   * A valid tenant proof belonging to another owner must
   * not be consumed by the current authenticated session.
   */
  if (
    verification.payload.ownerId !==
    identity.userId
  ) {
    return reject(
      "OWNER_BINDING_MISMATCH",
      "The signed resume proof does not belong to the authenticated owner.",
    );
  }

  const authorization =
    await authorizeControlledPilotResume({
      proofToken,
      signingSecret,
      expectedTenantId:
        identity.tenantId,
      expectedSignalId,
      ledger: input.ledger,
      nowEpochSeconds,
    });

  if (!authorization.authorized) {
    return reject(
      "RESUME_AUTHORIZATION_REJECTED",
      authorization.reason,
      {
        authorizationCode:
          authorization.code,
      },
    );
  }

  if (
    authorization.proof.ownerId !==
      identity.userId ||
    authorization.proof.tenantId !==
      identity.tenantId ||
    authorization.proof.signalId !==
      expectedSignalId
  ) {
    return reject(
      "RESUME_AUTHORIZATION_REJECTED",
      "Consumed proof bindings do not match the trusted authenticated identity.",
    );
  }

  return {
    authorized: true,
    code:
      "AUTHENTICATED_OWNER_RESUME_AUTHORIZED",
    tenantId:
      authorization.proof.tenantId,
    ownerId:
      authorization.proof.ownerId,
    signalId:
      authorization.proof.signalId,
    tokenId:
      authorization.proof.tokenId,
    consumedAt:
      authorization.consumption.consumedAt,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: true,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
