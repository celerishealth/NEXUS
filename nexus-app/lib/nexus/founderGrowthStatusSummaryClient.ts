import {
  createFounderGrowthStatusSummary,
  type FounderGrowthStatusSummary,
} from "./founderGrowthStatusSummary";

export type FounderGrowthStatusSummaryFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface FounderGrowthStatusSummaryReadInput {
  accessToken: string;
  expectedTenantId: string;
  expectedOwnerActorId: string;
}

export interface FounderGrowthStatusSummaryResult {
  schemaVersion: "nexus-founder-growth-status-summary-v1";
  tenantId: string;
  ownerActorId: string;
  summary: FounderGrowthStatusSummary;
  liveProviderExecutionAuthorized: false;
  providerMutationAuthorized: false;
  resumeAuthorized: false;
  customerContactAuthorized: false;
  paymentExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export class FounderGrowthStatusSummaryClientError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "FounderGrowthStatusSummaryClientError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function safeMessageForStatus(status: number): string {
  if (status === 401) {
    return "Authentication failed or the session expired.";
  }

  if (status === 403) {
    return "Founder owner authority is required.";
  }

  if (status === 503) {
    return "Founder growth status summary is unavailable. No action was taken.";
  }

  return "Founder growth status summary request failed safely. No action was taken.";
}

export async function readFounderGrowthStatusSummary(
  input: FounderGrowthStatusSummaryReadInput,
  fetchImpl: FounderGrowthStatusSummaryFetch = fetch,
): Promise<FounderGrowthStatusSummaryResult> {
  const accessToken = readRequiredString(input?.accessToken);
  const expectedTenantId = readRequiredString(input?.expectedTenantId);
  const expectedOwnerActorId = readRequiredString(input?.expectedOwnerActorId);

  if (!accessToken) {
    throw new FounderGrowthStatusSummaryClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  if (!expectedTenantId || !expectedOwnerActorId) {
    throw new FounderGrowthStatusSummaryClientError(
      400,
      "Authenticated tenant and founder-owner identity are required.",
    );
  }

  let response: Response;

  try {
    response = await fetchImpl(
      "/api/nexus/founder-command/growth/status",
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
    throw new FounderGrowthStatusSummaryClientError(
      0,
      "Founder growth status summary service could not be reached. No action was taken.",
    );
  }

  if (!response.ok) {
    throw new FounderGrowthStatusSummaryClientError(
      response.status,
      safeMessageForStatus(response.status),
    );
  }

  let value: unknown;

  try {
    value = await response.json();
  } catch {
    throw new FounderGrowthStatusSummaryClientError(
      502,
      "Founder growth status summary service returned an invalid response. No action was taken.",
    );
  }

  if (!isRecord(value)) {
    throw new FounderGrowthStatusSummaryClientError(
      502,
      "Founder growth status summary response could not be safely verified.",
    );
  }

  if (
    value.liveProviderExecutionAuthorized !== false ||
    value.providerMutationAuthorized !== false ||
    value.resumeAuthorized !== false ||
    value.customerContactAuthorized !== false ||
    value.paymentExecutionAuthorized !== false ||
    value.publicLaunchAuthorized !== false
  ) {
    throw new FounderGrowthStatusSummaryClientError(
      502,
      "Founder growth status summary safety boundary could not be verified. No action was taken.",
    );
  }

  const schemaVersion = readRequiredString(value.schemaVersion);
  const tenantId = readRequiredString(value.tenantId);
  const ownerActorId = readRequiredString(value.ownerActorId);
  const rawSummary = value.summary;

  if (
    schemaVersion !== "nexus-founder-growth-status-summary-v1" ||
    tenantId !== expectedTenantId ||
    ownerActorId !== expectedOwnerActorId ||
    !isRecord(rawSummary) ||
    readRequiredString(rawSummary.tenantId) !== tenantId ||
    rawSummary.evidenceBoundary !== "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY" ||
    !isRecord(rawSummary.counts) ||
    rawSummary.customerIdentityExposed !== false ||
    rawSummary.inquiryMessageExposed !== false ||
    rawSummary.liveProviderExecutionAuthorized !== false ||
    rawSummary.customerContactAuthorized !== false ||
    rawSummary.paymentExecutionAuthorized !== false ||
    rawSummary.publicLaunchAuthorized !== false
  ) {
    throw new FounderGrowthStatusSummaryClientError(
      502,
      "Founder growth status summary identity or evidence boundary could not be verified.",
    );
  }

  let summary: FounderGrowthStatusSummary;

  try {
    summary = createFounderGrowthStatusSummary({
      tenantId,
      generatedAt: readRequiredString(rawSummary.generatedAt) ?? "",
      evidence: {
        tenantId,
        totalInquiries: rawSummary.totalInquiries as number,
        latestReceivedAt: rawSummary.latestReceivedAt as number | null,
        counts: {
          received: rawSummary.counts.received as number,
          recommendationPending: rawSummary.counts.recommendationPending as number,
          ownerReview: rawSummary.counts.ownerReview as number,
          approved: rawSummary.counts.approved as number,
          rejected: rawSummary.counts.rejected as number,
          sandboxExecuted: rawSummary.counts.sandboxExecuted as number,
          completed: rawSummary.counts.completed as number,
          failed: rawSummary.counts.failed as number,
        },
      },
    });
  } catch {
    throw new FounderGrowthStatusSummaryClientError(
      502,
      "Founder growth status summary aggregate evidence could not be safely verified.",
    );
  }

  return {
    schemaVersion: "nexus-founder-growth-status-summary-v1",
    tenantId,
    ownerActorId,
    summary,
    liveProviderExecutionAuthorized: false,
    providerMutationAuthorized: false,
    resumeAuthorized: false,
    customerContactAuthorized: false,
    paymentExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
