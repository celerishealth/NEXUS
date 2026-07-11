import type {
  ControlledPilotResumeAuditAppendResult,
  ControlledPilotResumeAuditRecord,
  ControlledPilotResumeAuditSink,
} from "./controlledPilotResumeAuditGate";

const RPC_NAME =
  "nexus_append_controlled_pilot_resume_audit_event";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface SupabaseControlledPilotResumeAuditSinkOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface AuditRpcResponseRow {
  status?: unknown;
  stored_event_id?: unknown;
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

function normalizeOptionalString(
  value: unknown,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return normalizeRequiredString(value);
}

function normalizeSupabaseUrl(
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

function isAuditRecordValid(
  record: ControlledPilotResumeAuditRecord,
): boolean {
  const eventId =
    normalizeRequiredString(record?.eventId);

  const outcomeCode =
    normalizeRequiredString(
      record?.outcomeCode,
    );

  if (
    !eventId ||
    !outcomeCode ||
    typeof record.authorized !== "boolean" ||
    typeof record.pilotOperationPermitted !==
      "boolean" ||
    !Number.isInteger(record.attemptedAt) ||
    record.attemptedAt < 0
  ) {
    return false;
  }

  if (
    !record.authorized &&
    record.pilotOperationPermitted
  ) {
    return false;
  }

  if (record.authorized) {
    return (
      normalizeRequiredString(
        record.tenantId,
      ) !== null &&
      normalizeRequiredString(
        record.ownerId,
      ) !== null &&
      normalizeRequiredString(
        record.signalId,
      ) !== null &&
      normalizeRequiredString(
        record.tokenId,
      ) !== null &&
      record.pilotOperationPermitted
    );
  }

  return true;
}

function extractSingleRow(
  value: unknown,
): AuditRpcResponseRow | null {
  if (!Array.isArray(value) || value.length !== 1) {
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

  return row as AuditRpcResponseRow;
}

export class SupabaseControlledPilotResumeAuditSink
implements ControlledPilotResumeAuditSink {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledPilotResumeAuditSinkOptions,
  ) {
    const supabaseUrl =
      normalizeSupabaseUrl(
        options?.supabaseUrl,
      );

    const serviceRoleKey =
      normalizeRequiredString(
        options?.serviceRoleKey,
      );

    const timeoutMs =
      normalizeTimeout(
        options?.timeoutMs,
      );

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      serviceRoleKey.length <
        MINIMUM_SERVICE_ROLE_KEY_LENGTH ||
      timeoutMs === null
    ) {
      throw new Error(
        "Invalid server-only Supabase resume audit configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async appendOnce(
    record: ControlledPilotResumeAuditRecord,
  ): Promise<ControlledPilotResumeAuditAppendResult> {
    if (!isAuditRecordValid(record)) {
      return {
        status: "audit-unavailable",
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
              apikey:
                this.serviceRoleKey,
              Authorization:
                `Bearer ${this.serviceRoleKey}`,
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              p_event_id:
                record.eventId,
              p_tenant_id:
                normalizeOptionalString(
                  record.tenantId,
                ),
              p_owner_id:
                normalizeOptionalString(
                  record.ownerId,
                ),
              p_signal_id:
                normalizeOptionalString(
                  record.signalId,
                ),
              p_token_id:
                normalizeOptionalString(
                  record.tokenId,
                ),
              p_session_id:
                normalizeOptionalString(
                  record.sessionId,
                ),
              p_outcome_code:
                record.outcomeCode.trim(),
              p_authorized:
                record.authorized,
              p_pilot_operation_permitted:
                record.pilotOperationPermitted,
              p_attempted_at_epoch:
                record.attemptedAt,
            }),
            cache: "no-store",
            signal: controller.signal,
          },
        );

      if (!response.ok) {
        return {
          status: "audit-unavailable",
        };
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        return {
          status: "audit-unavailable",
        };
      }

      const row =
        extractSingleRow(payload);

      if (!row) {
        return {
          status: "audit-unavailable",
        };
      }

      if (
        row.status ===
          "binding-conflict"
      ) {
        return {
          status: "binding-conflict",
        };
      }

      const storedEventId =
        normalizeRequiredString(
          row.stored_event_id,
        );

      if (
        !storedEventId ||
        storedEventId !== record.eventId
      ) {
        return {
          status: "audit-unavailable",
        };
      }

      if (row.status === "recorded") {
        return {
          status: "recorded",
          eventId: storedEventId,
        };
      }

      if (
        row.status ===
          "already-recorded"
      ) {
        return {
          status:
            "already-recorded",
          eventId: storedEventId,
        };
      }

      return {
        status: "audit-unavailable",
      };
    } catch {
      return {
        status: "audit-unavailable",
      };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
