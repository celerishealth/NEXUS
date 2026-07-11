import type {
  TrustedControlledPilotOwnerIdentity,
} from "./controlledPilotAuthenticatedOwnerResumeService";

import {
  verifyControlledPilotOwnerResumeProof,
} from "./controlledPilotOwnerResumeAuthorization";

import type {
  ControlledPilotAtomicStateResumeStore,
} from "./supabaseControlledPilotAtomicStateResumeStore";

export interface ControlledPilotAtomicStateResumeInput {
  identity: TrustedControlledPilotOwnerIdentity;
  proofToken: string;
  expectedSignalId: string;
  expectedStateVersion: number;
  signingSecret: string;
  store: ControlledPilotAtomicStateResumeStore;
  nowEpochSeconds?: number;
}

export interface ControlledPilotAtomicStateResumeAuthorized {
  authorized: true;
  code:
    "CONTROLLED_PILOT_STATE_RESUME_AUTHORIZED";
  tenantId: string;
  ownerId: string;
  signalId: string;
  tokenId: string;
  operationStatus: "active";
  stateVersion: number;
  consumedAt: number;
  auditEventId: string;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: true;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotAtomicStateResumeRejected {
  authorized: false;
  code:
    | "INVALID_TRUSTED_IDENTITY"
    | "AUTHENTICATION_REQUIRED"
    | "TENANT_OWNER_ROLE_REQUIRED"
    | "INVALID_RESUME_REQUEST"
    | "SIGNED_PROOF_REJECTED"
    | "OWNER_BINDING_MISMATCH"
    | "RESUME_REPLAY_BLOCKED"
    | "PILOT_STATE_UNAVAILABLE"
    | "PILOT_STATE_VERSION_CONFLICT"
    | "PILOT_STATE_NOT_PAUSED"
    | "PILOT_SIGNAL_STATE_MISMATCH"
    | "ATOMIC_STATE_RESUME_BINDING_CONFLICT"
    | "ATOMIC_STATE_RESUME_REQUIRED";
  reason: string;
  verificationCode?: string;
  currentOperationStatus?: string;
  currentStateVersion?: number;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotAtomicStateResumeResult =
  | ControlledPilotAtomicStateResumeAuthorized
  | ControlledPilotAtomicStateResumeRejected;

function reject(
  code:
    ControlledPilotAtomicStateResumeRejected["code"],
  reason: string,
  details?: {
    verificationCode?: string;
    currentOperationStatus?: string;
    currentStateVersion?: number;
  },
): ControlledPilotAtomicStateResumeRejected {
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
    ...(details?.currentOperationStatus
      ? {
          currentOperationStatus:
            details.currentOperationStatus,
        }
      : {}),
    ...(details?.currentStateVersion !== undefined
      ? {
          currentStateVersion:
            details.currentStateVersion,
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

export async function authorizeControlledPilotAtomicStateResume(
  input: ControlledPilotAtomicStateResumeInput,
): Promise<ControlledPilotAtomicStateResumeResult> {
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
    !Number.isSafeInteger(
      input?.expectedStateVersion,
    ) ||
    input.expectedStateVersion < 1 ||
    !Number.isSafeInteger(nowEpochSeconds) ||
    nowEpochSeconds < 0 ||
    !input.store ||
    typeof input.store.commitStateResume !==
      "function"
  ) {
    return reject(
      "INVALID_RESUME_REQUEST",
      "Atomic pilot state resume request is incomplete or invalid.",
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
      {
        verificationCode:
          verification.code,
      },
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
      await input.store.commitStateResume({
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
        expectedStateVersion:
          input.expectedStateVersion,
      });
  } catch {
    return reject(
      "ATOMIC_STATE_RESUME_REQUIRED",
      "Atomic proof consumption, audit and pilot state transition failed.",
    );
  }

  if (
    commitResult.status ===
    "already-committed"
  ) {
    return reject(
      "RESUME_REPLAY_BLOCKED",
      "The signed owner resume proof has already completed its state transition.",
      {
        currentOperationStatus:
          commitResult.operationStatus,
        currentStateVersion:
          commitResult.stateVersion,
      },
    );
  }

  if (
    commitResult.status ===
    "state-unavailable"
  ) {
    return reject(
      "PILOT_STATE_UNAVAILABLE",
      "No controlled pilot state exists for the authenticated tenant.",
    );
  }

  if (
    commitResult.status ===
    "state-version-conflict"
  ) {
    return reject(
      "PILOT_STATE_VERSION_CONFLICT",
      "The controlled pilot state changed before the resume transaction completed.",
      {
        currentOperationStatus:
          commitResult.currentOperationStatus,
        currentStateVersion:
          commitResult.currentStateVersion,
      },
    );
  }

  if (
    commitResult.status ===
    "state-not-paused"
  ) {
    return reject(
      "PILOT_STATE_NOT_PAUSED",
      "The tenant controlled pilot is not currently paused.",
      {
        currentOperationStatus:
          commitResult.currentOperationStatus,
        currentStateVersion:
          commitResult.currentStateVersion,
      },
    );
  }

  if (
    commitResult.status ===
    "signal-state-mismatch"
  ) {
    return reject(
      "PILOT_SIGNAL_STATE_MISMATCH",
      "The resume proof incident does not match the tenant pilot blocking signal.",
      {
        currentOperationStatus:
          commitResult.currentOperationStatus,
        currentStateVersion:
          commitResult.currentStateVersion,
      },
    );
  }

  if (
    commitResult.status ===
    "binding-conflict"
  ) {
    return reject(
      "ATOMIC_STATE_RESUME_BINDING_CONFLICT",
      "The proof conflicts with an existing tenant, owner, incident, audit or state binding.",
    );
  }

  if (commitResult.status !== "committed") {
    return reject(
      "ATOMIC_STATE_RESUME_REQUIRED",
      "Atomic proof consumption, audit and pilot state transition were not confirmed.",
    );
  }

  return {
    authorized: true,
    code:
      "CONTROLLED_PILOT_STATE_RESUME_AUTHORIZED",
    tenantId:
      verification.payload.tenantId,
    ownerId:
      verification.payload.ownerId,
    signalId:
      verification.payload.signalId,
    tokenId:
      verification.payload.tokenId,
    operationStatus: "active",
    stateVersion:
      commitResult.stateVersion,
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
