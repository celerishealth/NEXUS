import type {
  ControlledCustomerInquiryRecord,
  ControlledCustomerInquiryStore,
  ControlledCustomerInquiryStoreResult,
} from "./controlledCustomerInquiryIntakeService";

const RPC_NAME =
  "nexus_create_controlled_customer_inquiry";

const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export interface SupabaseControlledCustomerInquiryStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

interface RpcRow {
  status?: unknown;
  inquiry_id?: unknown;
  stored_received_at_epoch?: unknown;
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

function isRecordValid(
  record: ControlledCustomerInquiryRecord,
): boolean {
  return (
    normalizeRequiredString(record?.inquiryId) !== null &&
    normalizeRequiredString(record?.tenantId) !== null &&
    normalizeRequiredString(record?.customerRef) !== null &&
    normalizeRequiredString(record?.message) !== null &&
    normalizeRequiredString(record?.idempotencyKey) !== null &&
    (
      record?.channel === "web" ||
      record?.channel === "email" ||
      record?.channel === "whatsapp" ||
      record?.channel === "manual"
    ) &&
    Number.isSafeInteger(record?.receivedAt) &&
    record.receivedAt >= 0
  );
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

export class SupabaseControlledCustomerInquiryStore
implements ControlledCustomerInquiryStore {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(
    options:
      SupabaseControlledCustomerInquiryStoreOptions,
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
        "Invalid server-only customer inquiry store configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction =
      options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async createInquiry(
    record: ControlledCustomerInquiryRecord,
  ): Promise<ControlledCustomerInquiryStoreResult> {
    if (!isRecordValid(record)) {
      return {
        status: "store-unavailable",
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
              p_inquiry_id:
                record.inquiryId,
              p_tenant_id:
                record.tenantId,
              p_customer_ref:
                record.customerRef,
              p_channel:
                record.channel,
              p_message:
                record.message,
              p_idempotency_key:
                record.idempotencyKey,
              p_received_at_epoch:
                record.receivedAt,
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

      const storedInquiryId =
        normalizeRequiredString(
          row.inquiry_id,
        );

      const storedReceivedAt =
        normalizeNonNegativeInteger(
          row.stored_received_at_epoch,
        );

      if (
        !storedInquiryId ||
        storedReceivedAt === null
      ) {
        return {
          status: "store-unavailable",
        };
      }

      if (
        row.status ===
        "binding-conflict"
      ) {
        return {
          status: "binding-conflict",
          existingInquiryId:
            storedInquiryId,
        };
      }

      if (row.status === "created") {
        if (
          storedInquiryId !==
          record.inquiryId
        ) {
          return {
            status: "store-unavailable",
          };
        }

        return {
          status: "created",
          inquiryId: storedInquiryId,
          receivedAt: storedReceivedAt,
        };
      }

      if (
        row.status ===
        "already-created"
      ) {
        return {
          status: "already-created",
          inquiryId: storedInquiryId,
          receivedAt: storedReceivedAt,
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
