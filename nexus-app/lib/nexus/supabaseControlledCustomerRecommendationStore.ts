import type {
  ControlledCustomerRecommendationRecord,
  ControlledCustomerRecommendationStore,
  ControlledCustomerRecommendationStoreResult,
} from "./controlledCustomerRecommendationService";

const RPC_NAME =
  "nexus_create_sandbox_customer_recommendation";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface SupabaseControlledCustomerRecommendationStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface RpcRow {
  status?: unknown;
  recommendation_id?: unknown;
  inquiry_status?: unknown;
  stored_created_at_epoch?: unknown;
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

export class SupabaseControlledCustomerRecommendationStore
implements ControlledCustomerRecommendationStore {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledCustomerRecommendationStoreOptions,
  ) {
    const supabaseUrl =
      normalizeUrl(options?.supabaseUrl);

    const serviceRoleKey =
      normalizeRequiredString(
        options?.serviceRoleKey,
      );

    const timeoutMs =
      options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      serviceRoleKey.length <
        MINIMUM_SERVICE_ROLE_KEY_LENGTH ||
      !Number.isInteger(timeoutMs) ||
      timeoutMs < 100 ||
      timeoutMs > 30_000
    ) {
      throw new Error(
        "Invalid server-only recommendation store configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async createRecommendation(
    record: ControlledCustomerRecommendationRecord,
  ): Promise<ControlledCustomerRecommendationStoreResult> {
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
              p_recommendation_id:
                record.recommendationId,
              p_tenant_id:
                record.tenantId,
              p_inquiry_id:
                record.inquiryId,
              p_inquiry_message:
                record.inquiryMessage,
              p_provider_mode:
                record.providerMode,
              p_provider_name:
                record.providerName,
              p_model_name:
                record.modelName,
              p_recommendation_text:
                record.recommendationText,
              p_rationale:
                record.rationale,
              p_confidence:
                record.confidence,
              p_risk_flags:
                record.riskFlags,
              p_input_fingerprint:
                record.inputFingerprint,
              p_created_at_epoch:
                record.createdAt,
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

      const recommendationId =
        normalizeRequiredString(
          row.recommendation_id,
        ) ?? undefined;

      const inquiryStatus =
        normalizeRequiredString(
          row.inquiry_status,
        ) ?? undefined;

      const createdAt =
        normalizeInteger(
          row.stored_created_at_epoch,
        ) ?? undefined;

      if (
        row.status === "created" ||
        row.status === "already-created"
      ) {
        if (
          !recommendationId ||
          inquiryStatus !== "owner-review" ||
          createdAt === undefined
        ) {
          return {
            status: "store-unavailable",
          };
        }

        return {
          status: row.status,
          recommendationId,
          inquiryStatus: "owner-review",
          createdAt,
        };
      }

      if (
        row.status === "inquiry-unavailable" ||
        row.status ===
          "inquiry-snapshot-conflict" ||
        row.status ===
          "inquiry-state-conflict" ||
        row.status === "binding-conflict"
      ) {
        return {
          status: row.status,
          ...(recommendationId
            ? {
                existingRecommendationId:
                  recommendationId,
              }
            : {}),
          ...(inquiryStatus
            ? {
                currentInquiryStatus:
                  inquiryStatus,
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
