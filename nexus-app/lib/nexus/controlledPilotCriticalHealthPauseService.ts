import type {
  ControlledPilotAtomicHealthPauseStore,
} from "./supabaseControlledPilotAtomicHealthPauseStore";

export interface TrustedControlledPilotHealthSignal {
  tenantId: string;
  signalId: string;
  signalSource: string;
  severity: "healthy" | "degraded" | "critical";
  observedAt: number;
  expectedStateVersion: number;
}

export interface ControlledPilotCriticalHealthPauseInput {
  signal: TrustedControlledPilotHealthSignal;
  store: ControlledPilotAtomicHealthPauseStore;
}

export interface ControlledPilotCriticalHealthPauseApplied {
  applied: true;
  code:
    | "CRITICAL_HEALTH_PAUSE_COMMITTED"
    | "CRITICAL_HEALTH_PAUSE_ALREADY_COMMITTED";
  tenantId: string;
  signalId: string;
  operationStatus: "paused";
  blockingSignalId: string;
  stateVersion: number;
  pilotOperationPermitted: false;
  automaticResumeAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export interface ControlledPilotCriticalHealthPauseRejected {
  applied: false;
  code:
    | "INVALID_HEALTH_SIGNAL"
    | "CRITICAL_HEALTH_SIGNAL_REQUIRED"
    | "PILOT_STATE_UNAVAILABLE"
    | "PILOT_STATE_VERSION_CONFLICT"
    | "PILOT_ALREADY_PAUSED"
    | "PILOT_STATE_INCONSISTENT"
    | "HEALTH_PAUSE_BINDING_CONFLICT"
    | "ATOMIC_HEALTH_PAUSE_REQUIRED";
  reason: string;
  currentOperationStatus?: string;
  currentBlockingSignalId?: string;
  currentStateVersion?: number;
  pilotOperationPermitted: false;
  automaticResumeAuthorized: false;
  liveProviderExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export type ControlledPilotCriticalHealthPauseResult =
  | ControlledPilotCriticalHealthPauseApplied
  | ControlledPilotCriticalHealthPauseRejected;

function reject(
  code:
    ControlledPilotCriticalHealthPauseRejected["code"],
  reason: string,
  details?: {
    currentOperationStatus?: string;
    currentBlockingSignalId?: string;
    currentStateVersion?: number;
  },
): ControlledPilotCriticalHealthPauseRejected {
  return {
    applied: false,
    code,
    reason,
    ...(details?.currentOperationStatus
      ? {
          currentOperationStatus:
            details.currentOperationStatus,
        }
      : {}),
    ...(details?.currentBlockingSignalId
      ? {
          currentBlockingSignalId:
            details.currentBlockingSignalId,
        }
      : {}),
    ...(details?.currentStateVersion !== undefined
      ? {
          currentStateVersion:
            details.currentStateVersion,
        }
      : {}),
    pilotOperationPermitted: false,
    automaticResumeAuthorized: false,
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

function hasPauseStore(
  value: unknown,
): value is ControlledPilotAtomicHealthPauseStore {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (
      value as {
        commitCriticalPause?: unknown;
      }
    ).commitCriticalPause === "function"
  );
}

export async function pauseControlledPilotForCriticalHealth(
  input: ControlledPilotCriticalHealthPauseInput,
): Promise<ControlledPilotCriticalHealthPauseResult> {
  const signal = input?.signal;

  const tenantId =
    normalizeRequiredString(
      signal?.tenantId,
    );

  const signalId =
    normalizeRequiredString(
      signal?.signalId,
    );

  const signalSource =
    normalizeRequiredString(
      signal?.signalSource,
    );

  if (
    !tenantId ||
    !signalId ||
    !signalSource ||
    !Number.isSafeInteger(
      signal?.observedAt,
    ) ||
    signal.observedAt < 0 ||
    !Number.isSafeInteger(
      signal?.expectedStateVersion,
    ) ||
    signal.expectedStateVersion < 1 ||
    !hasPauseStore(input?.store)
  ) {
    return reject(
      "INVALID_HEALTH_SIGNAL",
      "Trusted controlled pilot health signal or atomic pause store is invalid.",
    );
  }

  if (signal.severity !== "critical") {
    return reject(
      "CRITICAL_HEALTH_SIGNAL_REQUIRED",
      "Only a verified critical health signal may force the controlled pilot pause transition.",
    );
  }

  let result;

  try {
    result =
      await input.store.commitCriticalPause({
        tenantId,
        signalId,
        signalSource,
        severity: "critical",
        observedAt: signal.observedAt,
        expectedStateVersion:
          signal.expectedStateVersion,
      });
  } catch {
    return reject(
      "ATOMIC_HEALTH_PAUSE_REQUIRED",
      "Critical health pause transaction failed. Pilot operation remains denied.",
    );
  }

  if (
    result.status === "committed" ||
    result.status === "already-committed"
  ) {
    return {
      applied: true,
      code:
        result.status === "committed"
          ? "CRITICAL_HEALTH_PAUSE_COMMITTED"
          : "CRITICAL_HEALTH_PAUSE_ALREADY_COMMITTED",
      tenantId,
      signalId,
      operationStatus: "paused",
      blockingSignalId:
        result.blockingSignalId,
      stateVersion:
        result.stateVersion,
      pilotOperationPermitted: false,
      automaticResumeAuthorized: false,
      liveProviderExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    };
  }

  const details = {
    currentOperationStatus:
      "currentOperationStatus" in result
        ? result.currentOperationStatus
        : undefined,
    currentBlockingSignalId:
      "currentBlockingSignalId" in result
        ? result.currentBlockingSignalId
        : undefined,
    currentStateVersion:
      "currentStateVersion" in result
        ? result.currentStateVersion
        : undefined,
  };

  if (result.status === "state-unavailable") {
    return reject(
      "PILOT_STATE_UNAVAILABLE",
      "No persistent controlled pilot state exists for the affected tenant.",
      details,
    );
  }

  if (
    result.status ===
    "state-version-conflict"
  ) {
    return reject(
      "PILOT_STATE_VERSION_CONFLICT",
      "The controlled pilot state changed before the critical pause transaction completed.",
      details,
    );
  }

  if (result.status === "already-paused") {
    return reject(
      "PILOT_ALREADY_PAUSED",
      "The tenant controlled pilot is already paused and remains blocked.",
      details,
    );
  }

  if (
    result.status === "state-inconsistent"
  ) {
    return reject(
      "PILOT_STATE_INCONSISTENT",
      "The persistent pilot state is inconsistent. Pilot operation remains blocked.",
      details,
    );
  }

  if (
    result.status === "binding-conflict"
  ) {
    return reject(
      "HEALTH_PAUSE_BINDING_CONFLICT",
      "The health pause signal conflicts with an existing tenant or incident binding.",
      details,
    );
  }

  return reject(
    "ATOMIC_HEALTH_PAUSE_REQUIRED",
    "Critical health event persistence and pilot pause were not atomically confirmed.",
    details,
  );
}
