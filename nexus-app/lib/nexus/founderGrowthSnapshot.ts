export type FounderGrowthInquiryChannel =
  | "web"
  | "email"
  | "whatsapp"
  | "manual";

export type FounderGrowthInquiryStatus =
  | "received"
  | "recommendation-pending"
  | "owner-review"
  | "approved"
  | "rejected"
  | "sandbox-executed"
  | "completed"
  | "failed";
export interface FounderGrowthInquiryEvidence {
  inquiryId: string;
  tenantId: string;
  customerRef: string;
  channel: FounderGrowthInquiryChannel;
  status: FounderGrowthInquiryStatus;
  receivedAt: number;
}

export interface FounderGrowthSnapshotInput {
  tenantId: string;
  generatedAt: string;
  inquiries: readonly FounderGrowthInquiryEvidence[];
}

export interface FounderGrowthSnapshot {
  tenantId: string;
  generatedAt: string;
  evidenceBoundary: "VERIFIED_INQUIRY_EVIDENCE_ONLY";
  totalInquiries: number;
  uniqueCustomers: number;
  qualifiedLeadCount: null;
  quotationCount: null;
  orderCount: null;
  revenueAmount: null;
  liveProviderExecutionAuthorized: false;
  customerContactAuthorized: false;
  paymentExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

const ALLOWED_CHANNELS: readonly FounderGrowthInquiryChannel[] = [
  "web",
  "email",
  "whatsapp",
  "manual",
];

function readRequiredString(
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

function isCanonicalIsoTimestamp(
  value: string,
): boolean {
  const parsed = new Date(value);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString() === value
  );
}

export function createFounderGrowthSnapshot(
  input: FounderGrowthSnapshotInput,
): FounderGrowthSnapshot {
  const tenantId =
    readRequiredString(input?.tenantId);
  const generatedAt =
    readRequiredString(input?.generatedAt);

  if (
    !tenantId ||
    !generatedAt ||
    !isCanonicalIsoTimestamp(generatedAt) ||
    !Array.isArray(input?.inquiries)
  ) {
    throw new Error(
      "Founder growth snapshot input is invalid.",
    );
  }

  const inquiryIds = new Set<string>();
  const customers = new Set<string>();

  for (const inquiry of input.inquiries) {
    const inquiryId =
      readRequiredString(inquiry?.inquiryId);
    const inquiryTenantId =
      readRequiredString(inquiry?.tenantId);
    const customerRef =
      readRequiredString(inquiry?.customerRef);

    if (
      !inquiryId ||
      inquiryIds.has(inquiryId) ||
      inquiryTenantId !== tenantId ||
      !customerRef ||
      !ALLOWED_CHANNELS.includes(
        inquiry.channel,
      ) ||
      !(["received", "recommendation-pending", "owner-review", "approved", "rejected", "sandbox-executed", "completed", "failed"] as const).includes(inquiry.status) ||
      !Number.isSafeInteger(
        inquiry.receivedAt,
      ) ||
      inquiry.receivedAt < 0
    ) {
      throw new Error(
        "Founder growth inquiry evidence is invalid.",
      );
    }

    inquiryIds.add(inquiryId);
    customers.add(customerRef);
  }

  return Object.freeze({
    tenantId,
    generatedAt,
    evidenceBoundary:
      "VERIFIED_INQUIRY_EVIDENCE_ONLY",
    totalInquiries:
      input.inquiries.length,
    uniqueCustomers:
      customers.size,
    qualifiedLeadCount: null,
    quotationCount: null,
    orderCount: null,
    revenueAmount: null,
    liveProviderExecutionAuthorized:
      false,
    customerContactAuthorized:
      false,
    paymentExecutionAuthorized:
      false,
    publicLaunchAuthorized:
      false,
  });
}


export interface FounderGrowthTotalsEvidence {
  tenantId: string;
  totalInquiries: number;
  uniqueCustomers: number;
}

export interface FounderGrowthSnapshotFromTotalsInput {
  tenantId: string;
  generatedAt: string;
  totals: FounderGrowthTotalsEvidence;
}

export function createFounderGrowthSnapshotFromTotals(
  input: FounderGrowthSnapshotFromTotalsInput,
): FounderGrowthSnapshot {
  const tenantId = readRequiredString(input?.tenantId);
  const generatedAt = readRequiredString(input?.generatedAt);
  const totals = input?.totals;
  const totalsTenantId = readRequiredString(totals?.tenantId);

  if (
    !tenantId ||
    !generatedAt ||
    !isCanonicalIsoTimestamp(generatedAt) ||
    !totals ||
    totalsTenantId !== tenantId ||
    !Number.isSafeInteger(totals.totalInquiries) ||
    totals.totalInquiries < 0 ||
    !Number.isSafeInteger(totals.uniqueCustomers) ||
    totals.uniqueCustomers < 0 ||
    totals.uniqueCustomers > totals.totalInquiries
  ) {
    throw new Error(
      "Founder growth aggregate evidence is invalid.",
    );
  }

  return Object.freeze({
    tenantId,
    generatedAt,
    evidenceBoundary:
      "VERIFIED_INQUIRY_EVIDENCE_ONLY",
    totalInquiries: totals.totalInquiries,
    uniqueCustomers: totals.uniqueCustomers,
    qualifiedLeadCount: null,
    quotationCount: null,
    orderCount: null,
    revenueAmount: null,
    liveProviderExecutionAuthorized: false,
    customerContactAuthorized: false,
    paymentExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  });
}