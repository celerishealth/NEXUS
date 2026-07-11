import type {
  ControlledCustomerSandboxExecutionRecord,
  ControlledCustomerSandboxExecutionStore,
  ControlledCustomerSandboxExecutionStoreResult,
} from "./controlledCustomerSandboxExecutionService";

const RPC_NAME =
  "nexus_execute_approved_customer_recommendation_sandbox";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface SupabaseControlledCustomerSandboxExecutionStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface RpcRow {
  status?: unknown;
  execution_id?: unknown;
  inquiry_status?: unknown;
  execution_status?: unknown;
  stored_executed_at_epoch?: unknown;
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

export class SupabaseControlledCustomerSandboxExecutionStore
implements ControlledCustomerSandboxExecutionStore {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledCustomerSandboxExecutionStoreOptions,
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
        "Invalid server-only sandbox execution store configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async executeApprovedRecommendation(
    record: ControlledCustomerSandboxExecutionRecord,
  ): Promise<ControlledCustomerSandboxExecutionStoreResult> {
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
              p_execution_id:
                record.executionId,
              p_tenant_id:
                record.tenantId,
              p_inquiry_id:
                record.inquiryId,
              p_recommendation_id:
                record.recommendationId,
              p_decision_id:
                record.decisionId,
              p_owner_id:
                record.ownerId,
              p_recommendation_text:
                record.recommendationText,
              p_rationale:
                record.rationale,
              p_confidence:
                record.confidence,
              p_recommendation_risk_flags:
                record.recommendationRiskFlags,
              p_recommendation_input_fingerprint:
                record.recommendationInputFingerprint,
              p_recommendation_content_hash:
                record.recommendationContentHash,
              p_execution_mode:
                record.executionMode,
              p_executor_name:
                record.executorName,
              p_executor_version:
                record.executorVersion,
              p_execution_input_hash:
                record.executionInputHash,
              p_response_draft:
                record.responseDraft,
              p_internal_notes:
                record.internalNotes,
              p_execution_risk_flags:
                record.executionRiskFlags,
              p_executed_at_epoch:
                record.executedAt,
            }),
            cache: "no-store",
            signal: controller.signal,
          },
        );

      if (!response.ok) {
        return {
          status: "store-unavailable",
        };
      }

      let payload: unknown;

      try {
        payload = await response.json();
      } catch {
        return {
          status: "store-unavailable",
        };
      }

      const row = extractSingleRow(payload);

      if (!row || typeof row.status !== "string") {
        return {
          status: "store-unavailable",
        };
      }

      const executionId =
        normalizeRequiredString(
          row.execution_id,
        ) ?? undefined;

      const inquiryStatus =
        normalizeRequiredString(
          row.inquiry_status,
        ) ?? undefined;

      const executionStatus =
        normalizeRequiredString(
          row.execution_status,
        ) ?? undefined;

      const executedAt =
        normalizeInteger(
          row.stored_executed_at_epoch,
        ) ?? undefined;

      if (
        row.status === "executed" ||
        row.status === "already-executed"
      ) {
        if (
          !executionId ||
          inquiryStatus !==
            "sandbox-executed" ||
          executionStatus !==
            "sandbox-executed" ||
          executedAt === undefined
        ) {
          return {
            status: "store-unavailable",
          };
        }

        return {
          status: row.status,
          executionId,
          inquiryStatus:
            "sandbox-executed",
          executionStatus:
            "sandbox-executed",
          executedAt,
        };
      }

      if (
        row.status === "inquiry-unavailable" ||
        row.status === "recommendation-unavailable" ||
        row.status === "decision-unavailable" ||
        row.status === "recommendation-snapshot-conflict" ||
        row.status === "approval-snapshot-conflict" ||
        row.status === "recommendation-state-conflict" ||
        row.status === "inquiry-state-conflict" ||
        row.status === "execution-conflict"
      ) {
        return {
          status: row.status,
          ...(executionId
            ? {
                existingExecutionId:
                  executionId,
              }
            : {}),
          ...(inquiryStatus
            ? {
                currentInquiryStatus:
                  inquiryStatus,
              }
            : {}),
          ...(executionStatus
            ? {
                currentExecutionStatus:
                  executionStatus,
              }
            : {}),
        };
      }

      return {
        status: "store-unavailable",
      };
    } catch {
      return {
        status: "store-unavailable",
      };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
