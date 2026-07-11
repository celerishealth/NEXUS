import type {
  TrustedControlledPilotOwnerIdentity,
} from "./controlledPilotAuthenticatedOwnerResumeService";

import type {
  ControlledPilotOperationStateReader,
} from "./supabaseControlledPilotOperationStateReader";

export interface ControlledPilotOperationPermissionInput {
  identity: TrustedControlledPilotOwnerIdentity;
  expectedStateVersion: number;
  stateReader:
    ControlledPilotOperationStateReader;
}

export interface ControlledPilotOperationPermissionGranted {
  permitted: true;
  code:
    "CONTROLLED_PILOT_OPERATION_PERMITTED";
  tenantId: string;
  userId: string;
  operationStatus: "active";
  stateVersion: number;
  lastTransitionAt: number;
  pilotOperationPermitted: true;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotOperationPermissionRejected {
  permitted: false;
  code:
    | "INVALID_TRUSTED_IDENTITY"
    | "AUTHENTICATION_REQUIRED"
    | "PILOT_OPERATOR_ROLE_REQUIRED"
    | "INVALID_PERMISSION_REQUEST"
    | "PILOT_STATE_READER_UNAVAILABLE"
    | "PILOT_STATE_NOT_FOUND"
    | "PILOT_STATE_TENANT_MISMATCH"
    | "PILOT_OPERATION_PAUSED"
    | "PILOT_STATE_INCONSISTENT"
    | "PILOT_STATE_VERSION_CONFLICT";
  reason: string;
  currentStateVersion?: number;
  blockingSignalId?: string;
  pilotOperationPermitted: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotOperationPermissionResult =
  | ControlledPilotOperationPermissionGranted
  | ControlledPilotOperationPermissionRejected;

function reject(
  code:
    ControlledPilotOperationPermissionRejected["code"],
  reason: string,
  details?: {
    currentStateVersion?: number;
    blockingSignalId?: string;
  },
): ControlledPilotOperationPermissionRejected {
  return {
    permitted: false,
    code,
    reason,
    ...(details?.currentStateVersion !== undefined
      ? {
          currentStateVersion:
            details.currentStateVersion,
        }
      : {}),
    ...(details?.blockingSignalId
      ? {
          blockingSignalId:
            details.blockingSignalId,
        }
      : {}),
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

  return {
    authenticated: record.authenticated,
    userId,
    tenantId,
    roles:
      record.roles as readonly string[],
  };
}

function hasStateReader(
  value: unknown,
): value is ControlledPilotOperationStateReader {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        readTenantState?: unknown;
      }
    ).readTenantState === "function"
  );
}

export async function authorizeControlledPilotOperation(
  input: ControlledPilotOperationPermissionInput,
): Promise<ControlledPilotOperationPermissionResult> {
  const identity =
    normalizeIdentity(input?.identity);

  if (!identity) {
    return reject(
      "INVALID_TRUSTED_IDENTITY",
      "Trusted operation identity is incomplete or invalid.",
    );
  }

  if (!identity.authenticated) {
    return reject(
      "AUTHENTICATION_REQUIRED",
      "An authenticated tenant session is required.",
    );
  }

  if (
    !identity.roles.includes("owner") &&
    !identity.roles.includes("operator")
  ) {
    return reject(
      "PILOT_OPERATOR_ROLE_REQUIRED",
      "The authenticated identity does not hold an allowed pilot operation role.",
    );
  }

  if (
    !Number.isSafeInteger(
      input?.expectedStateVersion,
    ) ||
    input.expectedStateVersion < 1 ||
    !hasStateReader(input?.stateReader)
  ) {
    return reject(
      "INVALID_PERMISSION_REQUEST",
      "Controlled pilot permission request is incomplete or invalid.",
    );
  }

  let stateResult;

  try {
    stateResult =
      await input.stateReader.readTenantState(
        identity.tenantId,
      );
  } catch {
    return reject(
      "PILOT_STATE_READER_UNAVAILABLE",
      "Persistent pilot state could not be read. Operation remains blocked.",
    );
  }

  if (
    stateResult.status ===
    "reader-unavailable"
  ) {
    return reject(
      "PILOT_STATE_READER_UNAVAILABLE",
      "Persistent pilot state is unavailable or invalid. Operation remains blocked.",
    );
  }

  if (
    stateResult.status ===
    "not-found"
  ) {
    return reject(
      "PILOT_STATE_NOT_FOUND",
      "No controlled pilot state exists for the authenticated tenant.",
    );
  }

  const state = stateResult.state;

  if (state.tenantId !== identity.tenantId) {
    return reject(
      "PILOT_STATE_TENANT_MISMATCH",
      "Persistent pilot state does not belong to the authenticated tenant.",
    );
  }

  if (state.operationStatus === "paused") {
    return reject(
      "PILOT_OPERATION_PAUSED",
      "Controlled pilot operation is paused by an active blocking signal.",
      {
        currentStateVersion:
          state.stateVersion,
        ...(state.blockingSignalId
          ? {
              blockingSignalId:
                state.blockingSignalId,
            }
          : {}),
      },
    );
  }

  if (
    state.operationStatus !== "active" ||
    state.blockingSignalId !== null
  ) {
    return reject(
      "PILOT_STATE_INCONSISTENT",
      "Controlled pilot state is inconsistent. Operation remains blocked.",
      {
        currentStateVersion:
          state.stateVersion,
      },
    );
  }

  if (
    state.stateVersion !==
    input.expectedStateVersion
  ) {
    return reject(
      "PILOT_STATE_VERSION_CONFLICT",
      "Controlled pilot state changed before operation authorization.",
      {
        currentStateVersion:
          state.stateVersion,
      },
    );
  }

  return {
    permitted: true,
    code:
      "CONTROLLED_PILOT_OPERATION_PERMITTED",
    tenantId: identity.tenantId,
    userId: identity.userId,
    operationStatus: "active",
    stateVersion: state.stateVersion,
    lastTransitionAt:
      state.lastTransitionAt,
    pilotOperationPermitted: true,
    liveProviderExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
