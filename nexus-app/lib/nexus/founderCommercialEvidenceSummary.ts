export const FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_VERSION =
  "nexus-founder-commercial-evidence-summary-v1" as const;

interface CommonCommercialEvidence {
  readonly tenantId: string;
  readonly ownerActorId: string;
  readonly evidenceId: string;
  readonly inquiryId: string;
  readonly verifiedAt: string;
}

export type FounderCommercialEvidenceRecord =
  | (CommonCommercialEvidence & {
      readonly kind: "qualified-lead";
      readonly buyerRequirementVerified: true;
      readonly buyerIntentVerified: true;
      readonly fakeOrIrrelevantLeadExcluded: true;
    })
  | (CommonCommercialEvidence & {
      readonly kind: "quotation-issued";
      readonly quotationId: string;
      readonly ownerApproved: true;
      readonly customerDeliveryVerified: true;
    })
  | (CommonCommercialEvidence & {
      readonly kind: "order-confirmed";
      readonly orderId: string;
      readonly quotationId: string;
      readonly ownerConfirmed: true;
      readonly customerAcceptanceVerified: true;
    })
  | (CommonCommercialEvidence & {
      readonly kind: "payment-received";
      readonly paymentId: string;
      readonly orderId: string;
      readonly amountMinor: number;
      readonly currencyCode: string;
      readonly paymentReceiptVerified: true;
    });

export interface FounderCommercialEvidenceSummary {
  readonly version: typeof FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_VERSION;
  readonly tenantId: string;
  readonly ownerActorId: string;
  readonly generatedAt: string;
  readonly evidenceBoundary: "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY";
  readonly sourceRecordCount: number;
  readonly qualifiedLeadCount: number;
  readonly quotationCount: number;
  readonly orderCount: number;
  readonly paymentReceiptCount: number;
  readonly revenueByCurrencyMinor: Readonly<Record<string, number>>;
  readonly customerIdentityExposed: false;
  readonly inquiryMessageExposed: false;
  readonly customerContactAuthorized: false;
  readonly quotationDeliveryAuthorized: false;
  readonly orderExecutionAuthorized: false;
  readonly paymentExecutionAuthorized: false;
  readonly providerMutationAuthorized: false;
  readonly publicLaunchAuthorized: false;
}

export interface CreateFounderCommercialEvidenceSummaryInput {
  readonly tenantId: string;
  readonly ownerActorId: string;
  readonly generatedAt: string;
  readonly records: readonly FounderCommercialEvidenceRecord[];
}

function requireString(
  value: unknown,
  field: string,
  maximumLength = 200,
): string {
  if (typeof value !== "string") {
    throw new Error(field + " is invalid.");
  }

  const normalized = value.trim();

  if (!normalized || normalized.length > maximumLength) {
    throw new Error(field + " is invalid.");
  }

  return normalized;
}

function requireCanonicalIso(
  value: unknown,
  field: string,
): string {
  const normalized = requireString(value, field, 64);
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== normalized) {
    throw new Error(field + " must be a canonical ISO timestamp.");
  }

  return normalized;
}

function requireTrue(value: unknown, field: string): void {
  if (value !== true) {
    throw new Error(field + " must be verified.");
  }
}


export function createFounderCommercialEvidenceSummary(
  input: CreateFounderCommercialEvidenceSummaryInput,
): FounderCommercialEvidenceSummary {
  const tenantId = requireString(input?.tenantId, "tenantId");
  const ownerActorId = requireString(input?.ownerActorId, "ownerActorId");
  const generatedAt = requireCanonicalIso(input?.generatedAt, "generatedAt");

  if (!Array.isArray(input?.records)) {
    throw new Error("Commercial evidence records are invalid.");
  }

  const evidenceIds = new Set<string>();
  const qualifiedInquiries = new Set<string>();
  const quotations = new Map<string, string>();
  const orders = new Map<string, { inquiryId: string; quotationId: string }>();
  const payments = new Map<string, { inquiryId: string; orderId: string; amountMinor: number; currencyCode: string }>();

  for (const record of input.records) {
    if (!record || typeof record !== "object") {
      throw new Error("Commercial evidence record is invalid.");
    }

    const recordTenantId = requireString(record.tenantId, "record.tenantId");
    const recordOwnerActorId = requireString(record.ownerActorId, "record.ownerActorId");
    const evidenceId = requireString(record.evidenceId, "record.evidenceId");
    const inquiryId = requireString(record.inquiryId, "record.inquiryId");
    requireCanonicalIso(record.verifiedAt, "record.verifiedAt");

    if (recordTenantId !== tenantId || recordOwnerActorId !== ownerActorId) {
      throw new Error("Commercial evidence tenant or owner binding is invalid.");
    }

    if (evidenceIds.has(evidenceId)) {
      throw new Error("Duplicate commercial evidence ID.");
    }

    evidenceIds.add(evidenceId);

    switch (record.kind) {
      case "qualified-lead": {
        requireTrue(record.buyerRequirementVerified, "buyerRequirementVerified");
        requireTrue(record.buyerIntentVerified, "buyerIntentVerified");
        requireTrue(record.fakeOrIrrelevantLeadExcluded, "fakeOrIrrelevantLeadExcluded");

        if (qualifiedInquiries.has(inquiryId)) {
          throw new Error("Duplicate qualified-lead evidence for inquiry.");
        }

        qualifiedInquiries.add(inquiryId);
        break;
      }

      case "quotation-issued": {
        const quotationId = requireString(record.quotationId, "quotationId");
        requireTrue(record.ownerApproved, "ownerApproved");
        requireTrue(record.customerDeliveryVerified, "customerDeliveryVerified");

        if (quotations.has(quotationId)) {
          throw new Error("Duplicate quotation ID.");
        }

        quotations.set(quotationId, inquiryId);
        break;
      }

      case "order-confirmed": {
        const orderId = requireString(record.orderId, "orderId");
        const quotationId = requireString(record.quotationId, "quotationId");
        requireTrue(record.ownerConfirmed, "ownerConfirmed");
        requireTrue(record.customerAcceptanceVerified, "customerAcceptanceVerified");

        if (orders.has(orderId)) {
          throw new Error("Duplicate order ID.");
        }

        orders.set(orderId, { inquiryId, quotationId });
        break;
      }

      case "payment-received": {
        const paymentId = requireString(record.paymentId, "paymentId");
        const orderId = requireString(record.orderId, "orderId");
        const currencyCode = requireString(record.currencyCode, "currencyCode", 3).toUpperCase();

        if (!/^[A-Z]{3}$/.test(currencyCode)) {
          throw new Error("currencyCode is invalid.");
        }

        if (!Number.isSafeInteger(record.amountMinor) || record.amountMinor <= 0) {
          throw new Error("amountMinor is invalid.");
        }

        requireTrue(record.paymentReceiptVerified, "paymentReceiptVerified");

        if (payments.has(paymentId)) {
          throw new Error("Duplicate payment ID.");
        }

        payments.set(paymentId, { inquiryId, orderId, amountMinor: record.amountMinor, currencyCode });
        break;
      }

      default:
        throw new Error("Unsupported commercial evidence kind.");
    }
  }

  for (const inquiryId of quotations.values()) {
    if (!qualifiedInquiries.has(inquiryId)) {
      throw new Error("Issued quotation lacks verified qualified-lead evidence.");
    }
  }

  for (const order of orders.values()) {
    if (quotations.get(order.quotationId) !== order.inquiryId) {
      throw new Error("Confirmed order lacks matching issued quotation evidence.");
    }
  }

  const revenueByCurrencyMinor: Record<string, number> = {};

  for (const payment of payments.values()) {
    const order = orders.get(payment.orderId);

    if (!order || order.inquiryId !== payment.inquiryId) {
      throw new Error("Received payment lacks matching confirmed order evidence.");
    }

    const previous = revenueByCurrencyMinor[payment.currencyCode] ?? 0;
    const next = previous + payment.amountMinor;

    if (!Number.isSafeInteger(next)) {
      throw new Error("Revenue aggregate exceeds safe range.");
    }

    revenueByCurrencyMinor[payment.currencyCode] = next;
  }

  return Object.freeze({
    version: FOUNDER_COMMERCIAL_EVIDENCE_SUMMARY_VERSION,
    tenantId,
    ownerActorId,
    generatedAt,
    evidenceBoundary: "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY",
    sourceRecordCount: input.records.length,
    qualifiedLeadCount: qualifiedInquiries.size,
    quotationCount: quotations.size,
    orderCount: orders.size,
    paymentReceiptCount: payments.size,
    revenueByCurrencyMinor: Object.freeze({ ...revenueByCurrencyMinor }),
    customerIdentityExposed: false,
    inquiryMessageExposed: false,
    customerContactAuthorized: false,
    quotationDeliveryAuthorized: false,
    orderExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    providerMutationAuthorized: false,
    publicLaunchAuthorized: false,
  });
}
