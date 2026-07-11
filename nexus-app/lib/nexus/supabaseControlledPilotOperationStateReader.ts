const RPC_NAME =
  "nexus_read_controlled_pilot_operation_state";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface ControlledPilotOperationState {
  tenantId: string;
  operationStatus: "paused" | "active";
  blockingSignalId: string | null;
  stateVersion: number;
  lastTransitionAt: number;
}

export type ControlledPilotOperationStateReadResult =
  | {
      status: "found";
      state: ControlledPilotOperationState;
    }
  | {
      status: "not-found";
    }
  | {
      status: "reader-unavailable";
    };

export interface ControlledPilotOperationStateReader {
  readTenantState(
    tenantId: string,
  ): Promise<ControlledPilotOperationStateReadResult>;
}

export interface SupabaseControlledPilotOperationStateReaderOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface RpcStateRow {
  tenant_id?: unknown;
  operation_status?: unknown;
  blocking_signal_id?: unknown;
  state_version?: unknown;
  last_transition_at_epoch?: unknown;
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

function normalizeNullableString(
  value: unknown,
): string | null | undefined {
  if (value === null) {
    return null;
  }

  const normalized =
    normalizeRequiredString(value);

  return normalized ?? undefined;
}

function normalizeNonNegativeInteger(
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

export class SupabaseControlledPilotOperationStateReader
implements ControlledPilotOperationStateReader {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledPilotOperationStateReaderOptions,
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
        "Invalid server-only controlled pilot state reader configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async readTenantState(
    tenantId: string,
  ): Promise<ControlledPilotOperationStateReadResult> {
    const normalizedTenantId =
      normalizeRequiredString(tenantId);

    if (!normalizedTenantId) {
      return {
        status: "reader-unavailable",
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
              p_tenant_id:
                normalizedTenantId,
            }),
            cache: "no-store",
            signal: controller.signal,
          },
        );

      if (!response.ok) {
        return {
          status: "reader-unavailable",
        };
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        return {
          status: "reader-unavailable",
        };
      }

      if (!Array.isArray(payload)) {
        return {
          status: "reader-unavailable",
        };
      }

      if (payload.length === 0) {
        return {
          status: "not-found",
        };
      }

      if (payload.length !== 1) {
        return {
          status: "reader-unavailable",
        };
      }

      const row = payload[0];

      if (
        typeof row !== "object" ||
        row === null ||
        Array.isArray(row)
      ) {
        return {
          status: "reader-unavailable",
        };
      }

      const stateRow =
        row as RpcStateRow;

      const storedTenantId =
        normalizeRequiredString(
          stateRow.tenant_id,
        );

      const operationStatus =
        stateRow.operation_status;

      const blockingSignalId =
        normalizeNullableString(
          stateRow.blocking_signal_id,
        );

      const stateVersion =
        normalizeNonNegativeInteger(
          stateRow.state_version,
        );

      const lastTransitionAt =
        normalizeNonNegativeInteger(
          stateRow.last_transition_at_epoch,
        );

      if (
        storedTenantId !== normalizedTenantId ||
        (
          operationStatus !== "paused" &&
          operationStatus !== "active"
        ) ||
        blockingSignalId === undefined ||
        stateVersion === null ||
        stateVersion < 1 ||
        lastTransitionAt === null
      ) {
        return {
          status: "reader-unavailable",
        };
      }

      if (
        operationStatus === "paused" &&
        blockingSignalId === null
      ) {
        return {
          status: "reader-unavailable",
        };
      }

      if (
        operationStatus === "active" &&
        blockingSignalId !== null
      ) {
        return {
          status: "reader-unavailable",
        };
      }

      return {
        status: "found",
        state: {
          tenantId: storedTenantId,
          operationStatus,
          blockingSignalId,
          stateVersion,
          lastTransitionAt,
        },
      };
    } catch {
      return {
        status: "reader-unavailable",
      };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
