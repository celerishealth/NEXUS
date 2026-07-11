import type {
  TrustedControlledPilotOwnerIdentity,
} from "./controlledPilotAuthenticatedOwnerResumeService";

import {
  verifyControlledPilotOwnerResumeProof,
} from "./controlledPilotOwnerResumeAuthorization";

import type {
  ControlledPilotAtomicResumeCommitStore,
} from "./supabaseControlledPilotAtomicResumeCommitStore";

export interface ControlledPilotAtomicAuditedResumeInput {
  identity: TrustedControlledPilotOwnerIdentity;
  proofToken: string;
  expectedSignalId: string;
  signingSecret: string;
  commitStore:
    ControlledPilotAtomicResumeCommitStore;
  nowEpochSeconds?: number;
}

export interface ControlledPilotAtomicAuditedResumeAuthorized {
  authorized: true;
  code:
    "ATOMIC_AUDITED_OWNER_RESUME_AUTHORIZED";
  tenantId: string;
  ownerId: string;
  signalId: string;
  tokenId: string;
  consumedAt: number;
  auditEventId: string;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: true;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotAtomicAuditedResumeRejected {
  authorized: false;
  code:
    | "INVALID_TRUSTED_IDENTITY"
    | "AUTHENTICATION_REQUIRED"
    | "TENANT_OWNER_ROLE_REQUIRED"
    | "INVALID_RESUME_REQUEST"
    | "SIGNED_PROOF_REJECTED"
    | "OWNER_BINDING_MISMATCH"
    | "ATOMIC_COMMIT_REPLAY_BLOCKED"
    | "ATOMIC_COMMIT_BINDING_CONFLICT"
    | "ATOMIC_COMMIT_REQUIRED";
  reason: string;
  verificationCode?: string;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotAtomicAuditedResumeResult =
  | ControlledPilotAtomicAuditedResumeAuthorized
  | ControlledPilotAtomicAuditedResumeRejected;

function reject(
  code:
    ControlledPilotAtomicAuditedResumeRejected["code"],
  reason: string,
  verificationCode?: string,
): ControlledPilotAtomicAuditedResumeRejected {
  return {
    authorized: false,
    code,
    reason,
    ...(verificationCode
      ? {
          verificationCode,
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

function normalizeIdentity(
  value: unknown,
): {
  authenticated: boolean;
  userId: string;
  tenantId: string;
  roles: readonly string[];
  sessionId: string | null;
} | null {
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

  if (
    typeof record.authenticated !== "boolean" ||
    !userId ||
    !tenantId ||
    !Array.isArray(record.roles) ||
    !record.roles.every(
      (role) =>
        normalizeRequiredString(role) !== null,
    )
  ) {
    return null;
  }

  const sessionId =
    record.sessionId === undefined
      ? null
      : normalizeRequiredString(
          record.sessionId,
        );

  if (
    record.sessionId !== undefined &&
    !sessionId
  ) {
    return null;
  }

  return {
    authenticated: record.authenticated,
    userId,
    tenantId,
    roles: record.roles as readonly string[],
    sessionId,
  };
}

export async function authorizeAtomicAuditedControlledPilotResume(
  input: ControlledPilotAtomicAuditedResumeInput,
): Promise<ControlledPilotAtomicAuditedResumeResult> {
  const identity =
    normalizeIdentity(input?.identity);

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
      "The authenticated identity does not hold the tenant owner role.",
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
    !Number.isInteger(nowEpochSeconds) ||
    nowEpochSeconds < 0 ||
    !input.commitStore ||
    typeof input.commitStore.commit !==
      "function"
  ) {
    return reject(
      "INVALID_RESUME_REQUEST",
      "Atomic controlled pilot resume request is incomplete or invalid.",
    );
  }

  const verification =
    verifyControlledPilotOwnerResumeProof({
      token: proofToken,
      signingSecret,
      expectedTenantId:
        identity.tenantId,
      expectedSignalId,
      nowEpochSeconds,
    });

  if (!verification.valid) {
    return reject(
      "SIGNED_PROOF_REJECTED",
      verification.reason,
      verification.code,
    );
  }

  if (
    verification.payload.ownerId !==
    identity.userId
  ) {
    return reject(
      "OWNER_BINDING_MISMATCH",
      "The signed resume proof does not belong to the authenticated tenant owner.",
    );
  }

  let commitResult;

  try {
    commitResult =
      await input.commitStore.commit({
        tokenId:
          verification.payload.tokenId,
        tenantId:
          verification.payload.tenantId,
        signalId:
          verification.payload.signalId,
        ownerId:
          verification.payload.ownerId,
        sessionId:
          identity.sessionId,
        issuedAt:
          verification.payload.issuedAt,
        expiresAt:
          verification.payload.expiresAt,
        consumedAt:
          nowEpochSeconds,
      });
  } catch {
    return reject(
      "ATOMIC_COMMIT_REQUIRED",
      "Atomic proof consumption and audit persistence failed. Pilot resume remains blocked.",
    );
  }

  if (
    commitResult.status ===
    "already-committed"
  ) {
    return reject(
      "ATOMIC_COMMIT_REPLAY_BLOCKED",
      "The owner resume proof was already atomically committed and cannot be reused.",
    );
  }

  if (
    commitResult.status ===
    "binding-conflict"
  ) {
    return reject(
      "ATOMIC_COMMIT_BINDING_CONFLICT",
      "The proof identifier conflicts with an existing tenant, owner, incident or audit binding.",
    );
  }

  if (
    commitResult.status !== "committed"
  ) {
    return reject(
      "ATOMIC_COMMIT_REQUIRED",
      "Atomic proof consumption and audit persistence were not confirmed.",
    );
  }

  return {
    authorized: true,
    code:
      "ATOMIC_AUDITED_OWNER_RESUME_AUTHORIZED",
    tenantId:
      verification.payload.tenantId,
    ownerId:
      verification.payload.ownerId,
    signalId:
      verification.payload.signalId,
    tokenId:
      verification.payload.tokenId,
    consumedAt:
      commitResult.consumedAt,
    auditEventId:
      commitResult.auditEventId,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: true,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
