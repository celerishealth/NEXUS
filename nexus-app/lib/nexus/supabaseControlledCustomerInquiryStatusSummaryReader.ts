import type { FounderGrowthStatusEvidence } from "./founderGrowthStatusSummary";

const RPC_NAME =
  "nexus_read_controlled_customer_inquiry_status_summary";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export type ControlledCustomerInquiryStatusSummaryReadResult =
  | {
      status: "found";
      evidence: FounderGrowthStatusEvidence;
    }
  | {
      status: "reader-unavailable";
    };

export interface SupabaseControlledCustomerInquiryStatusSummaryReaderOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

function normalizeRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeUrl(value: unknown): string | null {
  const normalized = normalizeRequiredString(value);

  if (!normalized) {
    return null;
  }

  try {
    const parsed = new URL(normalized);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function normalizeTimeout(value: unknown): number | null {
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

function normalizeNonNegativeInteger(value: unknown): number | null {
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  ) {
    return value;
  }

  if (typeof value === "string" && /^[0-9]+$/.test(value)) {
    const parsed = Number(value);

    if (Number.isSafeInteger(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return null;
}

function normalizeNullableNonNegativeInteger(
  value: unknown,
): number | null | undefined {
  if (value === null) {
    return null;
  }

  const normalized = normalizeNonNegativeInteger(value);
  return normalized === null ? undefined : normalized;
}

export class SupabaseControlledCustomerInquiryStatusSummaryReader {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options: SupabaseControlledCustomerInquiryStatusSummaryReaderOptions,
  ) {
    const supabaseUrl = normalizeUrl(options?.supabaseUrl);
    const serviceRoleKey = normalizeRequiredString(
      options?.serviceRoleKey,
    );
    const timeoutMs = normalizeTimeout(options?.timeoutMs);

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      serviceRoleKey.length < MINIMUM_SERVICE_ROLE_KEY_LENGTH ||
      timeoutMs === null
    ) {
      throw new Error(
        "Invalid server-only customer inquiry status summary reader configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction = options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async readTenantStatusSummary(
    tenantId: string,
  ): Promise<ControlledCustomerInquiryStatusSummaryReadResult> {
    const normalizedTenantId = normalizeRequiredString(tenantId);

    if (!normalizedTenantId) {
      return { status: "reader-unavailable" };
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
            Authorization: `Bearer ${this.serviceRoleKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            p_tenant_id: normalizedTenantId,
          }),
          cache: "no-store",
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        return { status: "reader-unavailable" };
      }

      const payload: unknown = await response.json();

      if (!Array.isArray(payload) || payload.length !== 1) {
        return { status: "reader-unavailable" };
      }

      const value = payload[0];

      if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
      ) {
        return { status: "reader-unavailable" };
      }

      const row = value as Record<string, unknown>;
      const rowTenantId = normalizeRequiredString(row.tenant_id);
      const totalInquiries = normalizeNonNegativeInteger(
        row.total_inquiries,
      );
      const latestReceivedAt = normalizeNullableNonNegativeInteger(
        row.latest_received_at_epoch,
      );
      const received = normalizeNonNegativeInteger(row.received_count);
      const recommendationPending = normalizeNonNegativeInteger(
        row.recommendation_pending_count,
      );
      const ownerReview = normalizeNonNegativeInteger(
        row.owner_review_count,
      );
      const approved = normalizeNonNegativeInteger(row.approved_count);
      const rejected = normalizeNonNegativeInteger(row.rejected_count);
      const sandboxExecuted = normalizeNonNegativeInteger(
        row.sandbox_executed_count,
      );
      const completed = normalizeNonNegativeInteger(row.completed_count);
      const failed = normalizeNonNegativeInteger(row.failed_count);

      if (
        rowTenantId !== normalizedTenantId ||
        totalInquiries === null ||
        latestReceivedAt === undefined ||
        received === null ||
        recommendationPending === null ||
        ownerReview === null ||
        approved === null ||
        rejected === null ||
        sandboxExecuted === null ||
        completed === null ||
        failed === null
      ) {
        return { status: "reader-unavailable" };
      }

      const statusTotal =
        received +
        recommendationPending +
        ownerReview +
        approved +
        rejected +
        sandboxExecuted +
        completed +
        failed;

      if (
        !Number.isSafeInteger(statusTotal) ||
        statusTotal !== totalInquiries ||
        (totalInquiries === 0 && latestReceivedAt !== null) ||
        (totalInquiries > 0 && latestReceivedAt === null)
      ) {
        return { status: "reader-unavailable" };
      }

      return {
        status: "found",
        evidence: {
          tenantId: rowTenantId,
          totalInquiries,
          latestReceivedAt,
          counts: {
            received,
            recommendationPending,
            ownerReview,
            approved,
            rejected,
            sandboxExecuted,
            completed,
            failed,
          },
        },
      };
    } catch {
      return { status: "reader-unavailable" };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}