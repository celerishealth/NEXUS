const RPC_NAME =
  "nexus_commit_controlled_pilot_health_pause";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface ControlledPilotCriticalHealthPauseRecord {
  tenantId: string;
  signalId: string;
  signalSource: string;
  severity: "critical";
  observedAt: number;
  expectedStateVersion: number;
}

export type ControlledPilotCriticalHealthPauseCommitResult =
  | {
      status: "committed" | "already-committed";
      operationStatus: "paused";
      blockingSignalId: string;
      stateVersion: number;
    }
  | {
      status:
        | "state-unavailable"
        | "state-version-conflict"
        | "already-paused"
        | "state-inconsistent"
        | "binding-conflict"
        | "commit-unavailable";
      currentOperationStatus?: string;
      currentBlockingSignalId?: string;
      currentStateVersion?: number;
    };

export interface ControlledPilotAtomicHealthPauseStore {
  commitCriticalPause(
    record: ControlledPilotCriticalHealthPauseRecord,
  ): Promise<ControlledPilotCriticalHealthPauseCommitResult>;
}

export interface SupabaseControlledPilotAtomicHealthPauseStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface RpcRow {
  status?: unknown;
  operation_status?: unknown;
  blocking_signal_id?: unknown;
  state_version?: unknown;
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

function normalizeInteger(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    /^[0-9]+$/.test(value)
  ) {
    const parsed = Number(value);

    if (
      Number.isSafeInteger(parsed) &&
      parsed >= 0
    ) {
      return parsed;
    }
  }

  return null;
}

function normalizeUrl(
  value: unknown,
): string | null {
  const normalized =
    normalizeRequiredString(value);

  if (!normalized) {
    return null;
  }

  try {
    const parsed = new URL(normalized);

    if (
      parsed.protocol !== "https:" &&
      parsed.protocol !== "http:"
    ) {
      return null;
    }

    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function normalizeTimeout(
  value: unknown,
): number | null {
  if (value === undefined) {
    return DEFAULT_TIMEOUT_MS;
  }

  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 100 ||
    value > 30_000
  ) {
    return null;
  }

  return value;
}

function extractSingleRow(
  value: unknown,
): RpcRow | null {
  if (
    !Array.isArray(value) ||
    value.length !== 1
  ) {
    return null;
  }

  const row = value[0];

  if (
    typeof row !== "object" ||
    row === null ||
    Array.isArray(row)
  ) {
    return null;
  }

  return row as RpcRow;
}

export class SupabaseControlledPilotAtomicHealthPauseStore
implements ControlledPilotAtomicHealthPauseStore {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledPilotAtomicHealthPauseStoreOptions,
  ) {
    const supabaseUrl =
      normalizeUrl(options?.supabaseUrl);

    const serviceRoleKey =
      normalizeRequiredString(
        options?.serviceRoleKey,
      );

    const timeoutMs =
      normalizeTimeout(options?.timeoutMs);

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      serviceRoleKey.length <
        MINIMUM_SERVICE_ROLE_KEY_LENGTH ||
      timeoutMs === null
    ) {
      throw new Error(
        "Invalid server-only critical health pause store configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async commitCriticalPause(
    record: ControlledPilotCriticalHealthPauseRecord,
  ): Promise<ControlledPilotCriticalHealthPauseCommitResult> {
    const tenantId =
      normalizeRequiredString(record?.tenantId);

    const signalId =
      normalizeRequiredString(record?.signalId);

    const signalSource =
      normalizeRequiredString(
        record?.signalSource,
      );

    if (
      !tenantId ||
      !signalId ||
      !signalSource ||
      record?.severity !== "critical" ||
      !Number.isSafeInteger(record.observedAt) ||
      record.observedAt < 0 ||
      !Number.isSafeInteger(
        record.expectedStateVersion,
      ) ||
      record.expectedStateVersion < 1
    ) {
      return {
        status: "commit-unavailable",
      };
    }

    const controller = new AbortController();

    const timeoutHandle = setTimeout(
      () => controller.abort(),
      this.timeoutMs,
    );

    try {
      const response =
        await this.fetchFunction(
          `${this.supabaseUrl}/rest/v1/rpc/${RPC_NAME}`,
          {
            method: "POST",
            headers: {
              apikey: this.serviceRoleKey,
              Authorization:
                `Bearer ${this.serviceRoleKey}`,
              "Content-Type":
                "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              p_tenant_id: tenantId,
              p_signal_id: signalId,
              p_signal_source: signalSource,
              p_severity: "critical",
              p_observed_at_epoch:
                record.observedAt,
              p_expected_state_version:
                record.expectedStateVersion,
            }),
            cache: "no-store",
            signal: controller.signal,
          },
        );

      if (!response.ok) {
        return {
          status: "commit-unavailable",
        };
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        return {
          status: "commit-unavailable",
        };
      }

      const row = extractSingleRow(payload);

      if (!row || typeof row.status !== "string") {
        return {
          status: "commit-unavailable",
        };
      }

      const operationStatus =
        normalizeRequiredString(
          row.operation_status,
        ) ?? undefined;

      const blockingSignalId =
        normalizeRequiredString(
          row.blocking_signal_id,
        ) ?? undefined;

      const stateVersion =
        normalizeInteger(
          row.state_version,
        ) ?? undefined;

      if (
        row.status === "committed" ||
        row.status === "already-committed"
      ) {
        if (
          operationStatus !== "paused" ||
          blockingSignalId !== signalId ||
          stateVersion === undefined ||
          stateVersion < 1
        ) {
          return {
            status: "commit-unavailable",
          };
        }

        return {
          status: row.status,
          operationStatus: "paused",
          blockingSignalId,
          stateVersion,
        };
      }

      if (
        row.status === "state-unavailable" ||
        row.status === "state-version-conflict" ||
        row.status === "already-paused" ||
        row.status === "state-inconsistent" ||
        row.status === "binding-conflict"
      ) {
        return {
          status: row.status,
          ...(operationStatus
            ? {
                currentOperationStatus:
                  operationStatus,
              }
            : {}),
          ...(blockingSignalId
            ? {
                currentBlockingSignalId:
                  blockingSignalId,
              }
            : {}),
          ...(stateVersion !== undefined
            ? {
                currentStateVersion:
                  stateVersion,
              }
            : {}),
        };
      }

      return {
        status: "commit-unavailable",
      };
    } catch {
      return {
        status: "commit-unavailable",
      };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
