import type {
  ControlledPilotAtomicHealthPauseStore,
  ControlledPilotCriticalHealthPauseCommitResult,
} from "./supabaseControlledPilotAtomicHealthPauseStore";
import type {
  ControlledPilotOperationState,
  ControlledPilotOperationStateReader,
} from "./supabaseControlledPilotOperationStateReader";

export type FounderEmergencyStatusResult =
  | {
      status: "ready";
      state: ControlledPilotOperationState;
    }
  | {
      status: "state-not-found" | "state-unavailable";
    };

export type FounderEmergencyPauseResult =
  | {
      status: "paused" | "already-paused";
      signalId: string;
      state: ControlledPilotOperationState;
    }
  | {
      status:
        | "state-not-found"
        | "state-unavailable"
        | "state-conflict"
        | "pause-unavailable"
        | "pause-verification-failed";
    };

export interface FounderEmergencyPauseInput {
  tenantId: string;
  signalId: string;
  observedAt: number;
}

export interface FounderEmergencyOperationsDependencies {
  stateReader: ControlledPilotOperationStateReader;
  pauseStore: ControlledPilotAtomicHealthPauseStore;
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

function isValidStateForTenant(
  state: ControlledPilotOperationState,
  tenantId: string,
): boolean {
  return (
    state.tenantId === tenantId &&
    (
      state.operationStatus === "active" ||
      state.operationStatus === "paused"
    ) &&
    Number.isInteger(state.stateVersion) &&
    state.stateVersion >= 1 &&
    Number.isFinite(state.lastTransitionAt)
  );
}

function mapCommitFailure(
  result: ControlledPilotCriticalHealthPauseCommitResult,
): FounderEmergencyPauseResult {
  if (
    result.status === "state-version-conflict" ||
    result.status === "already-paused" ||
    result.status === "binding-conflict"
  ) {
    return {
      status: "state-conflict",
    };
  }

  if (result.status === "state-unavailable") {
    return {
      status: "state-unavailable",
    };
  }

  return {
    status: "pause-unavailable",
  };
}

export async function readFounderEmergencyStatus(
  tenantId: string,
  stateReader: ControlledPilotOperationStateReader,
): Promise<FounderEmergencyStatusResult> {
  const normalizedTenantId =
    normalizeRequiredString(tenantId);

  if (!normalizedTenantId) {
    return {
      status: "state-unavailable",
    };
  }

  const result =
    await stateReader.readTenantState(
      normalizedTenantId,
    );

  if (result.status === "not-found") {
    return {
      status: "state-not-found",
    };
  }

  if (result.status !== "found") {
    return {
      status: "state-unavailable",
    };
  }

  if (
    !isValidStateForTenant(
      result.state,
      normalizedTenantId,
    )
  ) {
    return {
      status: "state-unavailable",
    };
  }

  return {
    status: "ready",
    state: result.state,
  };
}

export async function pauseFounderEmergencyOperations(
  input: FounderEmergencyPauseInput,
  dependencies: FounderEmergencyOperationsDependencies,
): Promise<FounderEmergencyPauseResult> {
  const tenantId =
    normalizeRequiredString(input?.tenantId);

  const signalId =
    normalizeRequiredString(input?.signalId);

  if (
    !tenantId ||
    !signalId ||
    !Number.isFinite(input?.observedAt) ||
    input.observedAt <= 0
  ) {
    return {
      status: "pause-unavailable",
    };
  }

  const current =
    await readFounderEmergencyStatus(
      tenantId,
      dependencies.stateReader,
    );

  if (current.status === "state-not-found") {
    return {
      status: "state-not-found",
    };
  }

  if (current.status !== "ready") {
    return {
      status: "state-unavailable",
    };
  }

  if (current.state.operationStatus === "paused") {
    return {
      status: "already-paused",
      signalId:
        current.state.blockingSignalId ??
        signalId,
      state: current.state,
    };
  }

  const commit =
    await dependencies.pauseStore
      .commitCriticalPause({
        tenantId,
        signalId,
        signalSource:
          "founder-emergency-operations",
        severity: "critical",
        observedAt: input.observedAt,
        expectedStateVersion:
          current.state.stateVersion,
      });

  if (
    commit.status !== "committed" &&
    commit.status !== "already-committed"
  ) {
    return mapCommitFailure(commit);
  }

  if (
    commit.operationStatus !== "paused" ||
    commit.blockingSignalId !== signalId ||
    commit.stateVersion <
      current.state.stateVersion
  ) {
    return {
      status: "pause-verification-failed",
    };
  }

  const verified =
    await readFounderEmergencyStatus(
      tenantId,
      dependencies.stateReader,
    );

  if (
    verified.status !== "ready" ||
    verified.state.operationStatus !==
      "paused" ||
    verified.state.blockingSignalId !==
      signalId ||
    verified.state.stateVersion !==
      commit.stateVersion
  ) {
    return {
      status: "pause-verification-failed",
    };
  }

  return {
    status: "paused",
    signalId,
    state: verified.state,
  };
}