import {
  randomUUID,
} from "node:crypto";

const RPC_NAME =
  "nexus_commit_controlled_pilot_resume";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface ControlledPilotAtomicResumeCommitRecord {
  tokenId: string;
  tenantId: string;
  signalId: string;
  ownerId: string;
  sessionId: string | null;
  issuedAt: number;
  expiresAt: number;
  consumedAt: number;
}

export type ControlledPilotAtomicResumeCommitResult =
  | {
      status: "committed";
      tokenId: string;
      consumedAt: number;
      auditEventId: string;
    }
  | {
      status: "already-committed";
      tokenId: string;
      consumedAt: number;
      auditEventId: string;
    }
  | {
      status: "binding-conflict";
    }
  | {
      status: "commit-unavailable";
    };

export interface ControlledPilotAtomicResumeCommitStore {
  commit(
    record: ControlledPilotAtomicResumeCommitRecord,
  ): Promise<ControlledPilotAtomicResumeCommitResult>;
}

export interface SupabaseControlledPilotAtomicResumeCommitStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
  createAttemptId?: () => string;
}

interface RpcRow {
  status?: unknown;
  consumed_at_epoch?: unknown;
  audit_event_id?: unknown;
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

function normalizeEpochSecond(
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

function isRecordValid(
  record: ControlledPilotAtomicResumeCommitRecord,
): boolean {
  return (
    normalizeRequiredString(record?.tokenId) !== null &&
    normalizeRequiredString(record?.tenantId) !== null &&
    normalizeRequiredString(record?.signalId) !== null &&
    normalizeRequiredString(record?.ownerId) !== null &&
    (
      record.sessionId === null ||
      normalizeOptionalString(record.sessionId) !== null
    ) &&
    normalizeEpochSecond(record?.issuedAt) !== null &&
    normalizeEpochSecond(record?.expiresAt) !== null &&
    normalizeEpochSecond(record?.consumedAt) !== null &&
    record.expiresAt > record.issuedAt &&
    record.consumedAt >= record.issuedAt &&
    record.consumedAt < record.expiresAt
  );
}

function extractSingleRow(
  payload: unknown,
): RpcRow | null {
  if (
    !Array.isArray(payload) ||
    payload.length !== 1
  ) {
    return null;
  }

  const row = payload[0];

  if (
    typeof row !== "object" ||
    row === null ||
    Array.isArray(row)
  ) {
    return null;
  }

  return row as RpcRow;
}

export class SupabaseControlledPilotAtomicResumeCommitStore
implements ControlledPilotAtomicResumeCommitStore {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;
  private readonly createAttemptId: () => string;

  constructor(
    options:
      SupabaseControlledPilotAtomicResumeCommitStoreOptions,
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
        "Invalid server-only atomic resume commit configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
    this.createAttemptId =
      options.createAttemptId ?? randomUUID;
  }

  async commit(
    record: ControlledPilotAtomicResumeCommitRecord,
  ): Promise<ControlledPilotAtomicResumeCommitResult> {
    if (!isRecordValid(record)) {
      return {
        status: "commit-unavailable",
      };
    }

    const attemptId =
      normalizeRequiredString(
        this.createAttemptId(),
      );

    if (!attemptId) {
      return {
        status: "commit-unavailable",
      };
    }

    /*
     * The token UUID is also the deterministic audit event UUID.
     * This makes retries idempotent and binding-verifiable.
     */
    const auditEventId = record.tokenId;

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
              p_token_id:
                record.tokenId,
              p_tenant_id:
                record.tenantId,
              p_signal_id:
                record.signalId,
              p_owner_id:
                record.ownerId,
              p_issued_at_epoch:
                record.issuedAt,
              p_expires_at_epoch:
                record.expiresAt,
              p_consumed_at_epoch:
                record.consumedAt,
              p_consumption_attempt_id:
                attemptId,
              p_audit_event_id:
                auditEventId,
              p_session_id:
                normalizeOptionalString(
                  record.sessionId,
                ),
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

      if (!row) {
        return {
          status: "commit-unavailable",
        };
      }

      if (row.status === "binding-conflict") {
        return {
          status: "binding-conflict",
        };
      }

      const consumedAt =
        normalizeEpochSecond(
          row.consumed_at_epoch,
        );

      const storedAuditEventId =
        normalizeRequiredString(
          row.audit_event_id,
        );

      if (
        consumedAt === null ||
        consumedAt < record.issuedAt ||
        consumedAt >= record.expiresAt ||
        storedAuditEventId !== auditEventId
      ) {
        return {
          status: "commit-unavailable",
        };
      }

      if (row.status === "committed") {
        return {
          status: "committed",
          tokenId: record.tokenId,
          consumedAt,
          auditEventId:
            storedAuditEventId,
        };
      }

      if (
        row.status === "already-committed"
      ) {
        return {
          status: "already-committed",
          tokenId: record.tokenId,
          consumedAt,
          auditEventId:
            storedAuditEventId,
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
