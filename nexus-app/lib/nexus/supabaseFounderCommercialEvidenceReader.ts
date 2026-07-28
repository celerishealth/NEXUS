import type { FounderCommercialEvidenceRecord } from "./founderCommercialEvidenceSummary";

const RPC_NAME = "nexus_read_founder_commercial_evidence";
const DEFAULT_TIMEOUT_MS = 5_000;
const MINIMUM_SERVICE_ROLE_KEY_LENGTH = 32;

type FetchFunction = typeof fetch;

export type FounderCommercialEvidenceReadResult =
  | { status: "found"; records: readonly FounderCommercialEvidenceRecord[] }
  | { status: "reader-unavailable" };

export interface SupabaseFounderCommercialEvidenceReaderOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  fetchFunction?: FetchFunction;
  timeoutMs?: number;
}

function normalizeRequiredString(value: unknown, maximumLength = 200): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maximumLength ? normalized : null;
}

function normalizeUrl(value: unknown): string | null {
  const normalized = normalizeRequiredString(value, 2_048);
  if (!normalized) return null;
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function normalizeTimeout(value: unknown): number | null {
  if (value === undefined) return DEFAULT_TIMEOUT_MS;
  return typeof value === "number" && Number.isInteger(value) && value >= 100 && value <= 30_000
    ? value
    : null;
}

function normalizeCanonicalIso(value: unknown): string | null {
  const normalized = normalizeRequiredString(value, 64);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizePositiveSafeInteger(value: unknown): number | null {
  const normalized =
    typeof value === "string" && /^[0-9]+$/.test(value) ? Number(value) : value;
  return typeof normalized === "number" &&
    Number.isSafeInteger(normalized) &&
    normalized > 0
    ? normalized
    : null;
}

function allNull(...values: unknown[]): boolean {
  return values.every((value) => value === null);
}

function parseRecord(
  value: unknown,
  expectedTenantId: string,
  expectedOwnerActorId: string,
): FounderCommercialEvidenceRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

  const row = value as Record<string, unknown>;
  const tenantId = normalizeRequiredString(row.tenant_id, 128);
  const ownerActorId = normalizeRequiredString(row.owner_id, 128);
  const evidenceId = normalizeRequiredString(row.evidence_id);
  const inquiryId = normalizeRequiredString(row.inquiry_id);
  const kind = normalizeRequiredString(row.evidence_kind, 32);
  const verifiedAt = normalizeCanonicalIso(row.verified_at);

  if (
    tenantId !== expectedTenantId ||
    ownerActorId !== expectedOwnerActorId ||
    !evidenceId ||
    !inquiryId ||
    !kind ||
    !verifiedAt
  ) return null;

  const common = { tenantId, ownerActorId, evidenceId, inquiryId, verifiedAt };

  if (kind === "qualified-lead") {
    if (
      row.buyer_requirement_verified !== true ||
      row.buyer_intent_verified !== true ||
      row.fake_or_irrelevant_lead_excluded !== true ||
      !allNull(
        row.quotation_id, row.order_id, row.payment_id, row.amount_minor,
        row.currency_code, row.owner_approved, row.customer_delivery_verified,
        row.owner_confirmed, row.customer_acceptance_verified,
        row.payment_receipt_verified,
      )
    ) return null;

    return {
      ...common,
      kind,
      buyerRequirementVerified: true,
      buyerIntentVerified: true,
      fakeOrIrrelevantLeadExcluded: true,
    };
  }

  if (kind === "quotation-issued") {
    const quotationId = normalizeRequiredString(row.quotation_id);
    if (
      !quotationId ||
      row.owner_approved !== true ||
      row.customer_delivery_verified !== true ||
      !allNull(
        row.order_id, row.payment_id, row.amount_minor, row.currency_code,
        row.buyer_requirement_verified, row.buyer_intent_verified,
        row.fake_or_irrelevant_lead_excluded, row.owner_confirmed,
        row.customer_acceptance_verified, row.payment_receipt_verified,
      )
    ) return null;

    return {
      ...common,
      kind,
      quotationId,
      ownerApproved: true,
      customerDeliveryVerified: true,
    };
  }

  if (kind === "order-confirmed") {
    const quotationId = normalizeRequiredString(row.quotation_id);
    const orderId = normalizeRequiredString(row.order_id);
    if (
      !quotationId ||
      !orderId ||
      row.owner_confirmed !== true ||
      row.customer_acceptance_verified !== true ||
      !allNull(
        row.payment_id, row.amount_minor, row.currency_code,
        row.buyer_requirement_verified, row.buyer_intent_verified,
        row.fake_or_irrelevant_lead_excluded, row.owner_approved,
        row.customer_delivery_verified, row.payment_receipt_verified,
      )
    ) return null;

    return {
      ...common,
      kind,
      orderId,
      quotationId,
      ownerConfirmed: true,
      customerAcceptanceVerified: true,
    };
  }

  if (kind === "payment-received") {
    const orderId = normalizeRequiredString(row.order_id);
    const paymentId = normalizeRequiredString(row.payment_id);
    const amountMinor = normalizePositiveSafeInteger(row.amount_minor);
    const currencyCode = normalizeRequiredString(row.currency_code, 3)?.toUpperCase();

    if (
      !orderId ||
      !paymentId ||
      amountMinor === null ||
      !currencyCode ||
      !/^[A-Z]{3}$/.test(currencyCode) ||
      row.payment_receipt_verified !== true ||
      !allNull(
        row.quotation_id, row.buyer_requirement_verified, row.buyer_intent_verified,
        row.fake_or_irrelevant_lead_excluded, row.owner_approved,
        row.customer_delivery_verified, row.owner_confirmed,
        row.customer_acceptance_verified,
      )
    ) return null;

    return {
      ...common,
      kind,
      paymentId,
      orderId,
      amountMinor,
      currencyCode,
      paymentReceiptVerified: true,
    };
  }

  return null;
}

export class SupabaseFounderCommercialEvidenceReader {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly fetchFunction: FetchFunction;
  private readonly timeoutMs: number;

  constructor(options: SupabaseFounderCommercialEvidenceReaderOptions) {
    const supabaseUrl = normalizeUrl(options?.supabaseUrl);
    const serviceRoleKey = normalizeRequiredString(options?.serviceRoleKey, 4_096);
    const timeoutMs = normalizeTimeout(options?.timeoutMs);

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      serviceRoleKey.length < MINIMUM_SERVICE_ROLE_KEY_LENGTH ||
      timeoutMs === null
    ) {
      throw new Error(
        "Invalid server-only founder commercial evidence reader configuration.",
      );
    }

    this.supabaseUrl = supabaseUrl;
    this.serviceRoleKey = serviceRoleKey;
    this.fetchFunction = options.fetchFunction ?? fetch;
    this.timeoutMs = timeoutMs;
  }

  async readTenantOwnerEvidence(
    tenantId: string,
    ownerActorId: string,
  ): Promise<FounderCommercialEvidenceReadResult> {
    const normalizedTenantId = normalizeRequiredString(tenantId, 128);
    const normalizedOwnerActorId = normalizeRequiredString(ownerActorId, 128);

    if (!normalizedTenantId || !normalizedOwnerActorId) {
      return { status: "reader-unavailable" };
    }

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);

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
            p_owner_id: normalizedOwnerActorId,
          }),
          cache: "no-store",
          signal: controller.signal,
        },
      );

      if (!response.ok) return { status: "reader-unavailable" };

      const payload: unknown = await response.json();
      if (!Array.isArray(payload)) return { status: "reader-unavailable" };

      const records: FounderCommercialEvidenceRecord[] = [];
      for (const value of payload) {
        const record = parseRecord(value, normalizedTenantId, normalizedOwnerActorId);
        if (!record) return { status: "reader-unavailable" };
        records.push(record);
      }

      return { status: "found", records: Object.freeze(records) };
    } catch {
      return { status: "reader-unavailable" };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
