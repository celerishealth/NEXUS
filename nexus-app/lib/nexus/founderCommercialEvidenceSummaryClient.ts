import type { FounderCommercialEvidenceSummary } from "./founderCommercialEvidenceSummary";

export type FounderCommercialEvidenceSummaryFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface FounderCommercialEvidenceSummaryReadInput {
  accessToken: string;
  expectedTenantId: string;
  expectedOwnerActorId: string;
}

export interface FounderCommercialEvidenceSummaryResult {
  schemaVersion: "nexus-founder-commercial-evidence-summary-v1";
  tenantId: string;
  ownerActorId: string;
  summary: FounderCommercialEvidenceSummary;
  liveProviderExecutionAuthorized: false;
  providerMutationAuthorized: false;
  resumeAuthorized: false;
  customerContactAuthorized: false;
  quotationDeliveryAuthorized: false;
  orderExecutionAuthorized: false;
  paymentExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export class FounderCommercialEvidenceSummaryClientError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "FounderCommercialEvidenceSummaryClientError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(value: unknown, maximumLength = 2_048): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maximumLength
    ? normalized
    : null;
}

function readCanonicalIso(value: unknown): string | null {
  const normalized = readRequiredString(value, 64);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const canonical = parsed.toISOString();
  return canonical === normalized ? canonical : null;
}

function readNonNegativeSafeInteger(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
    ? value
    : null;
}

function readRevenueByCurrencyMinor(
  value: unknown,
): Readonly<Record<string, number>> | null {
  if (!isRecord(value)) {
    return null;
  }

  const revenue: Record<string, number> = {};

  for (const [currencyCode, amountMinor] of Object.entries(value)) {
    if (
      !/^[A-Z]{3}$/.test(currencyCode) ||
      typeof amountMinor !== "number" ||
      !Number.isSafeInteger(amountMinor) ||
      amountMinor <= 0
    ) {
      return null;
    }

    revenue[currencyCode] = amountMinor;
  }

  return Object.freeze(revenue);
}

function safeMessageForStatus(status: number): string {
  if (status === 401) {
    return "Authentication failed or the session expired.";
  }

  if (status === 403) {
    return "Founder owner authority is required.";
  }

  if (status === 503) {
    return "Founder commercial evidence summary is unavailable. No action was taken.";
  }

  return "Founder commercial evidence summary request failed safely. No action was taken.";
}

export async function readFounderCommercialEvidenceSummary(
  input: FounderCommercialEvidenceSummaryReadInput,
  fetchImpl: FounderCommercialEvidenceSummaryFetch = fetch,
): Promise<FounderCommercialEvidenceSummaryResult> {
  const accessToken = readRequiredString(input?.accessToken);
  const expectedTenantId = readRequiredString(input?.expectedTenantId, 128);
  const expectedOwnerActorId = readRequiredString(
    input?.expectedOwnerActorId,
    128,
  );

  if (!accessToken) {
    throw new FounderCommercialEvidenceSummaryClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  if (!expectedTenantId || !expectedOwnerActorId) {
    throw new FounderCommercialEvidenceSummaryClientError(
      400,
      "Authenticated tenant and founder-owner identity are required.",
    );
  }

  let response: Response;

  try {
    response = await fetchImpl(
      "/api/nexus/founder-command/commercial",
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "cache-control": "no-store",
        },
        cache: "no-store",
      },
    );
  } catch {
    throw new FounderCommercialEvidenceSummaryClientError(
      0,
      "Founder commercial evidence summary service could not be reached. No action was taken.",
    );
  }

  if (!response.ok) {
    throw new FounderCommercialEvidenceSummaryClientError(
      response.status,
      safeMessageForStatus(response.status),
    );
  }

  let value: unknown;

  try {
    value = await response.json();
  } catch {
    throw new FounderCommercialEvidenceSummaryClientError(
      502,
      "Founder commercial evidence summary service returned an invalid response. No action was taken.",
    );
  }

  if (!isRecord(value)) {
    throw new FounderCommercialEvidenceSummaryClientError(
      502,
      "Founder commercial evidence summary response could not be safely verified.",
    );
  }

  if (
    value.liveProviderExecutionAuthorized !== false ||
    value.providerMutationAuthorized !== false ||
    value.resumeAuthorized !== false ||
    value.customerContactAuthorized !== false ||
    value.quotationDeliveryAuthorized !== false ||
    value.orderExecutionAuthorized !== false ||
    value.paymentExecutionAuthorized !== false ||
    value.publicLaunchAuthorized !== false
  ) {
    throw new FounderCommercialEvidenceSummaryClientError(
      502,
      "Founder commercial evidence summary safety boundary could not be verified. No action was taken.",
    );
  }

  const schemaVersion = readRequiredString(value.schemaVersion, 128);
  const tenantId = readRequiredString(value.tenantId, 128);
  const ownerActorId = readRequiredString(value.ownerActorId, 128);
  const rawSummary = value.summary;

  if (
    schemaVersion !== "nexus-founder-commercial-evidence-summary-v1" ||
    tenantId !== expectedTenantId ||
    ownerActorId !== expectedOwnerActorId ||
    !isRecord(rawSummary) ||
    rawSummary.version !== "nexus-founder-commercial-evidence-summary-v1" ||
    readRequiredString(rawSummary.tenantId, 128) !== tenantId ||
    readRequiredString(rawSummary.ownerActorId, 128) !== ownerActorId ||
    rawSummary.evidenceBoundary !==
      "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY" ||
    rawSummary.customerIdentityExposed !== false ||
    rawSummary.inquiryMessageExposed !== false ||
    rawSummary.customerContactAuthorized !== false ||
    rawSummary.quotationDeliveryAuthorized !== false ||
    rawSummary.orderExecutionAuthorized !== false ||
    rawSummary.paymentExecutionAuthorized !== false ||
    rawSummary.providerMutationAuthorized !== false ||
    rawSummary.publicLaunchAuthorized !== false
  ) {
    throw new FounderCommercialEvidenceSummaryClientError(
      502,
      "Founder commercial evidence summary identity or evidence boundary could not be verified.",
    );
  }

  const generatedAt = readCanonicalIso(rawSummary.generatedAt);
  const sourceRecordCount = readNonNegativeSafeInteger(
    rawSummary.sourceRecordCount,
  );
  const qualifiedLeadCount = readNonNegativeSafeInteger(
    rawSummary.qualifiedLeadCount,
  );
  const quotationCount = readNonNegativeSafeInteger(rawSummary.quotationCount);
  const orderCount = readNonNegativeSafeInteger(rawSummary.orderCount);
  const paymentReceiptCount = readNonNegativeSafeInteger(
    rawSummary.paymentReceiptCount,
  );
  const revenueByCurrencyMinor = readRevenueByCurrencyMinor(
    rawSummary.revenueByCurrencyMinor,
  );

  if (
    !generatedAt ||
    sourceRecordCount === null ||
    qualifiedLeadCount === null ||
    quotationCount === null ||
    orderCount === null ||
    paymentReceiptCount === null ||
    revenueByCurrencyMinor === null ||
    sourceRecordCount !==
      qualifiedLeadCount +
        quotationCount +
        orderCount +
        paymentReceiptCount ||
    (paymentReceiptCount === 0 &&
      Object.keys(revenueByCurrencyMinor).length !== 0) ||
    (paymentReceiptCount > 0 &&
      Object.keys(revenueByCurrencyMinor).length === 0)
  ) {
    throw new FounderCommercialEvidenceSummaryClientError(
      502,
      "Founder commercial evidence summary aggregate evidence could not be safely verified.",
    );
  }

  const summary = Object.freeze({
    version: "nexus-founder-commercial-evidence-summary-v1",
    tenantId,
    ownerActorId,
    generatedAt,
    evidenceBoundary: "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY",
    sourceRecordCount,
    qualifiedLeadCount,
    quotationCount,
    orderCount,
    paymentReceiptCount,
    revenueByCurrencyMinor,
    customerIdentityExposed: false,
    inquiryMessageExposed: false,
    customerContactAuthorized: false,
    quotationDeliveryAuthorized: false,
    orderExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    providerMutationAuthorized: false,
    publicLaunchAuthorized: false,
  }) as FounderCommercialEvidenceSummary;

  return {
    schemaVersion: "nexus-founder-commercial-evidence-summary-v1",
    tenantId,
    ownerActorId,
    summary,
    liveProviderExecutionAuthorized: false,
    providerMutationAuthorized: false,
    resumeAuthorized: false,
    customerContactAuthorized: false,
    quotationDeliveryAuthorized: false,
    orderExecutionAuthorized: false,
    paymentExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
