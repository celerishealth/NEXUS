import {
  randomUUID,
} from "node:crypto";

import type {
  ControlledPilotResumeProofConsumptionRecord,
  ControlledPilotResumeProofConsumptionResult,
  ControlledPilotResumeProofLedger,
} from "./controlledPilotResumeConsumptionGate";

const RPC_NAME =
  "nexus_consume_controlled_pilot_resume_proof";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface SupabaseControlledPilotResumeLedgerOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
  createAttemptId?: () => string;
}

export type SupabaseControlledPilotResumeLedgerFactoryResult =
  | {
      ok: true;
      ledger: SupabaseControlledPilotResumeProofLedger;
    }
  | {
      ok: false;
      code:
        | "SUPABASE_URL_MISSING"
        | "SUPABASE_SERVICE_ROLE_KEY_MISSING"
        | "SUPABASE_CONFIGURATION_INVALID";
      reason: string;
    };

interface RpcResponseRow {
  status?: unknown;
  consumed_at_epoch?: unknown;
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

function isConsumptionRecordValid(
  record: ControlledPilotResumeProofConsumptionRecord,
): boolean {
  return (
    normalizeRequiredString(record?.tokenId) !== null &&
    normalizeRequiredString(record?.tenantId) !== null &&
    normalizeRequiredString(record?.signalId) !== null &&
    normalizeRequiredString(record?.ownerId) !== null &&
    normalizeEpochSecond(record?.issuedAt) !== null &&
    normalizeEpochSecond(record?.expiresAt) !== null &&
    normalizeEpochSecond(record?.consumedAt) !== null &&
    record.expiresAt > record.issuedAt &&
    record.consumedAt >= record.issuedAt &&
    record.consumedAt < record.expiresAt
  );
}

function extractSingleRpcRow(
  value: unknown,
): RpcResponseRow | null {
  if (Array.isArray(value)) {
    if (value.length !== 1) {
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

    return row as RpcResponseRow;
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    return value as RpcResponseRow;
  }

  return null;
}

export class SupabaseControlledPilotResumeProofLedger
implements ControlledPilotResumeProofLedger {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;
  private readonly createAttemptId: () => string;

  constructor(
    options: SupabaseControlledPilotResumeLedgerOptions,
  ) {
    const supabaseUrl =
      normalizeSupabaseUrl(options?.supabaseUrl);

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
        "Invalid server-only Supabase resume ledger configuration.",
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

  async consumeOnce(
    record: ControlledPilotResumeProofConsumptionRecord,
  ): Promise<ControlledPilotResumeProofConsumptionResult> {
    if (!isConsumptionRecordValid(record)) {
      return {
        status: "ledger-unavailable",
      };
    }

    const attemptId =
      normalizeRequiredString(
        this.createAttemptId(),
      );

    if (!attemptId) {
      return {
        status: "ledger-unavailable",
      };
    }

    const controller = new AbortController();

    const timeoutHandle = setTimeout(
      () => controller.abort(),
      this.timeoutMs,
    );

    try {
      const response = await this.fetchFunction(
        `${this.supabaseUrl}/rest/v1/rpc/${RPC_NAME}`,
        {
          method: "POST",
          headers: {
            apikey: this.serviceRoleKey,
            Authorization:
              `Bearer ${this.serviceRoleKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            p_token_id: record.tokenId,
            p_tenant_id: record.tenantId,
            p_signal_id: record.signalId,
            p_owner_id: record.ownerId,
            p_issued_at_epoch: record.issuedAt,
            p_expires_at_epoch: record.expiresAt,
            p_consumed_at_epoch: record.consumedAt,
            p_consumption_attempt_id: attemptId,
          }),
          cache: "no-store",
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        return {
          status: "ledger-unavailable",
        };
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        return {
          status: "ledger-unavailable",
        };
      }

      const row = extractSingleRpcRow(payload);

      if (!row) {
        return {
          status: "ledger-unavailable",
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

      if (row.status === "already-consumed") {
        if (consumedAt === null) {
          return {
            status: "ledger-unavailable",
          };
        }

        return {
          status: "already-consumed",
          consumedAt,
        };
      }

      if (row.status === "consumed") {
        if (
          consumedAt === null ||
          consumedAt < record.issuedAt ||
          consumedAt >= record.expiresAt
        ) {
          return {
            status: "ledger-unavailable",
          };
        }

        return {
          status: "consumed",
          consumedAt,
        };
      }

      return {
        status: "ledger-unavailable",
      };
    } catch {
      return {
        status: "ledger-unavailable",
      };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}

export function createSupabaseControlledPilotResumeLedgerFromEnvironment(
  environment:
    Record<string, string | undefined>,
  fetchFunction: FetchFunction = fetch,
): SupabaseControlledPilotResumeLedgerFactoryResult {
  const supabaseUrl =
    normalizeRequiredString(
      environment.SUPABASE_URL,
    );

  if (!supabaseUrl) {
    return {
      ok: false,
      code: "SUPABASE_URL_MISSING",
      reason:
        "SUPABASE_URL is unavailable. Resume authorization remains blocked.",
    };
  }

  const serviceRoleKey =
    normalizeRequiredString(
      environment.SUPABASE_SERVICE_ROLE_KEY,
    );

  if (!serviceRoleKey) {
    return {
      ok: false,
      code:
        "SUPABASE_SERVICE_ROLE_KEY_MISSING",
      reason:
        "SUPABASE_SERVICE_ROLE_KEY is unavailable. Resume authorization remains blocked.",
    };
  }

  try {
    return {
      ok: true,
      ledger:
        new SupabaseControlledPilotResumeProofLedger({
          supabaseUrl,
          serviceRoleKey,
          fetchFunction,
        }),
    };
  } catch {
    return {
      ok: false,
      code:
        "SUPABASE_CONFIGURATION_INVALID",
      reason:
        "Server-only Supabase resume ledger configuration is invalid.",
    };
  }
}
