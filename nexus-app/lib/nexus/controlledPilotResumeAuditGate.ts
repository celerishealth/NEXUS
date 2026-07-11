import {
  randomUUID,
} from "node:crypto";

import type {
  AuthenticatedControlledPilotResumeInput,
  AuthenticatedControlledPilotResumeRejected,
} from "./controlledPilotAuthenticatedOwnerResumeService";

import {
  authorizeAuthenticatedControlledPilotOwnerResume,
} from "./controlledPilotAuthenticatedOwnerResumeService";

export interface ControlledPilotResumeAuditRecord {
  eventId: string;
  tenantId: string | null;
  ownerId: string | null;
  signalId: string | null;
  tokenId: string | null;
  sessionId: string | null;
  outcomeCode: string;
  authorized: boolean;
  pilotOperationPermitted: boolean;
  attemptedAt: number;
}

export type ControlledPilotResumeAuditAppendResult =
  | {
      status: "recorded";
      eventId: string;
    }
  | {
      status: "already-recorded";
      eventId: string;
    }
  | {
      status: "binding-conflict";
    }
  | {
      status: "audit-unavailable";
    };

export interface ControlledPilotResumeAuditSink {
  appendOnce(
    record: ControlledPilotResumeAuditRecord,
  ): Promise<ControlledPilotResumeAuditAppendResult>;
}

export interface AuditedControlledPilotResumeInput
extends AuthenticatedControlledPilotResumeInput {
  auditSink: ControlledPilotResumeAuditSink;
  createAuditEventId?: () => string;
}

export interface AuditedControlledPilotResumeAuthorized {
  authorized: true;
  code:
    "AUDITED_AUTHENTICATED_OWNER_RESUME_AUTHORIZED";
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

export interface AuditedControlledPilotResumeRejected {
  authorized: false;
  code:
    | "INVALID_AUDIT_CONFIGURATION"
    | "AUDIT_PERSISTENCE_REQUIRED"
    | "AUDITED_RESUME_REJECTED";
  reason: string;
  resumeCode?:
    | AuthenticatedControlledPilotResumeRejected["code"];
  auditEventId?: string;
  automaticResumeAuthorized: false;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type AuditedControlledPilotResumeResult =
  | AuditedControlledPilotResumeAuthorized
  | AuditedControlledPilotResumeRejected;

function reject(
  code: AuditedControlledPilotResumeRejected["code"],
  reason: string,
  details?: {
    resumeCode?:
      AuthenticatedControlledPilotResumeRejected["code"];
    auditEventId?: string;
  },
): AuditedControlledPilotResumeRejected {
  return {
    authorized: false,
    code,
    reason,
    ...(details?.resumeCode
      ? {
          resumeCode: details.resumeCode,
        }
      : {}),
    ...(details?.auditEventId
      ? {
          auditEventId:
            details.auditEventId,
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

function hasAuditSink(
  value: unknown,
): value is ControlledPilotResumeAuditSink {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        appendOnce?: unknown;
      }
    ).appendOnce === "function"
  );
}

function extractPresentedIdentityString(
  value: unknown,
): string | null {
  return normalizeRequiredString(value);
}

export async function authorizeAndAuditControlledPilotOwnerResume(
  input: AuditedControlledPilotResumeInput,
): Promise<AuditedControlledPilotResumeResult> {
  if (
    !input ||
    !hasAuditSink(input.auditSink)
  ) {
    return reject(
      "INVALID_AUDIT_CONFIGURATION",
      "Persistent resume audit storage is unavailable. Pilot resume remains blocked.",
    );
  }

  const attemptedAt =
    input.nowEpochSeconds ??
    Math.floor(Date.now() / 1000);

  if (
    !Number.isInteger(attemptedAt) ||
    attemptedAt < 0
  ) {
    return reject(
      "INVALID_AUDIT_CONFIGURATION",
      "Resume audit time is invalid. Pilot resume remains blocked.",
    );
  }

  const createAuditEventId =
    input.createAuditEventId ??
    randomUUID;

  const auditEventId =
    normalizeRequiredString(
      createAuditEventId(),
    );

  if (!auditEventId) {
    return reject(
      "INVALID_AUDIT_CONFIGURATION",
      "Resume audit event identity could not be created.",
    );
  }

  const resumeResult =
    await authorizeAuthenticatedControlledPilotOwnerResume(
      input,
    );

  const presentedIdentity =
    input.identity;

  const auditRecord:
    ControlledPilotResumeAuditRecord = {
      eventId: auditEventId,
      tenantId: resumeResult.authorized
        ? resumeResult.tenantId
        : extractPresentedIdentityString(
            presentedIdentity?.tenantId,
          ),
      ownerId: resumeResult.authorized
        ? resumeResult.ownerId
        : extractPresentedIdentityString(
            presentedIdentity?.userId,
          ),
      signalId: resumeResult.authorized
        ? resumeResult.signalId
        : normalizeRequiredString(
            input.expectedSignalId,
          ),
      tokenId: resumeResult.authorized
        ? resumeResult.tokenId
        : null,
      sessionId:
        extractPresentedIdentityString(
          presentedIdentity?.sessionId,
        ),
      outcomeCode: resumeResult.code,
      authorized:
        resumeResult.authorized,
      pilotOperationPermitted:
        resumeResult.pilotOperationPermitted,
      attemptedAt,
    };

  let auditResult:
    ControlledPilotResumeAuditAppendResult;

  try {
    auditResult =
      await input.auditSink.appendOnce(
        auditRecord,
      );
  } catch {
    return reject(
      "AUDIT_PERSISTENCE_REQUIRED",
      "Resume authorization could not be persistently audited. Pilot operation remains blocked.",
    );
  }

  if (
    !auditResult ||
    (
      auditResult.status !== "recorded" &&
      auditResult.status !==
        "already-recorded"
    ) ||
    auditResult.eventId !== auditEventId
  ) {
    return reject(
      "AUDIT_PERSISTENCE_REQUIRED",
      "Resume authorization audit was not safely persisted. Pilot operation remains blocked.",
    );
  }

  if (!resumeResult.authorized) {
    return reject(
      "AUDITED_RESUME_REJECTED",
      resumeResult.reason,
      {
        resumeCode:
          resumeResult.code,
        auditEventId,
      },
    );
  }

  return {
    authorized: true,
    code:
      "AUDITED_AUTHENTICATED_OWNER_RESUME_AUTHORIZED",
    tenantId: resumeResult.tenantId,
    ownerId: resumeResult.ownerId,
    signalId: resumeResult.signalId,
    tokenId: resumeResult.tokenId,
    consumedAt: resumeResult.consumedAt,
    auditEventId,
    automaticResumeAuthorized: false,
    pilotOperationPermitted: true,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
