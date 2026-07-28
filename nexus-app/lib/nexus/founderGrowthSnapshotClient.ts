import {
  createFounderGrowthSnapshotFromTotals,
  type FounderGrowthSnapshot,
} from "./founderGrowthSnapshot";

export type FounderGrowthSnapshotFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface FounderGrowthSnapshotReadInput {
  accessToken: string;
  expectedTenantId: string;
  expectedOwnerActorId: string;
}

export interface FounderGrowthSnapshotResult {
  schemaVersion: "nexus-founder-growth-snapshot-v1";
  tenantId: string;
  ownerActorId: string;
  snapshot: FounderGrowthSnapshot;
  liveProviderExecutionAuthorized: false;
  providerMutationAuthorized: false;
  resumeAuthorized: false;
  customerContactAuthorized: false;
  paymentExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

export class FounderGrowthSnapshotClientError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "FounderGrowthSnapshotClientError";
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
    return "Founder growth snapshot is unavailable. No action was taken.";
  }

  return "Founder growth snapshot request failed safely. No action was taken.";
}

export async function readFounderGrowthSnapshot(
  input: FounderGrowthSnapshotReadInput,
  fetchImpl: FounderGrowthSnapshotFetch = fetch,
): Promise<FounderGrowthSnapshotResult> {
  const accessToken = readRequiredString(input?.accessToken);
  const expectedTenantId = readRequiredString(input?.expectedTenantId);
  const expectedOwnerActorId = readRequiredString(input?.expectedOwnerActorId);

  if (!accessToken) {
    throw new FounderGrowthSnapshotClientError(
      401,
      "Authentication failed or the session expired.",
    );
  }

  if (!expectedTenantId || !expectedOwnerActorId) {
    throw new FounderGrowthSnapshotClientError(
      400,
      "Authenticated tenant and founder-owner identity are required.",
    );
  }

  let response: Response;

  try {
    response = await fetchImpl(
      "/api/nexus/founder-command/growth",
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
    throw new FounderGrowthSnapshotClientError(
      0,
      "Founder growth snapshot service could not be reached. No action was taken.",
    );
  }

  if (!response.ok) {
    throw new FounderGrowthSnapshotClientError(
      response.status,
      safeMessageForStatus(response.status),
    );
  }

  let value: unknown;

  try {
    value = await response.json();
  } catch {
    throw new FounderGrowthSnapshotClientError(
      502,
      "Founder growth snapshot service returned an invalid response. No action was taken.",
    );
  }

  if (!isRecord(value)) {
    throw new FounderGrowthSnapshotClientError(
      502,
      "Founder growth snapshot response could not be safely verified.",
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
    throw new FounderGrowthSnapshotClientError(
      502,
      "Founder growth snapshot safety boundary could not be verified. No action was taken.",
    );
  }

  const schemaVersion = readRequiredString(value.schemaVersion);
  const tenantId = readRequiredString(value.tenantId);
  const ownerActorId = readRequiredString(value.ownerActorId);
  const rawSnapshot = value.snapshot;

  if (
    schemaVersion !== "nexus-founder-growth-snapshot-v1" ||
    tenantId !== expectedTenantId ||
    ownerActorId !== expectedOwnerActorId ||
    !isRecord(rawSnapshot) ||
    readRequiredString(rawSnapshot.tenantId) !== tenantId ||
    rawSnapshot.evidenceBoundary !== "VERIFIED_INQUIRY_EVIDENCE_ONLY" ||
    rawSnapshot.qualifiedLeadCount !== null ||
    rawSnapshot.quotationCount !== null ||
    rawSnapshot.orderCount !== null ||
    rawSnapshot.revenueAmount !== null ||
    rawSnapshot.liveProviderExecutionAuthorized !== false ||
    rawSnapshot.customerContactAuthorized !== false ||
    rawSnapshot.paymentExecutionAuthorized !== false ||
    rawSnapshot.publicLaunchAuthorized !== false
  ) {
    throw new FounderGrowthSnapshotClientError(
      502,
      "Founder growth snapshot identity or evidence boundary could not be verified.",
    );
  }

  let snapshot: FounderGrowthSnapshot;

  try {
    snapshot = createFounderGrowthSnapshotFromTotals({
      tenantId,
      generatedAt: readRequiredString(rawSnapshot.generatedAt) ?? "",
      totals: {
        tenantId,
        totalInquiries: rawSnapshot.totalInquiries as number,
        uniqueCustomers: rawSnapshot.uniqueCustomers as number,
      },
    });
  } catch {
    throw new FounderGrowthSnapshotClientError(
      502,
      "Founder growth snapshot aggregate evidence could not be safely verified.",
    );
  }

  return {
    schemaVersion: "nexus-founder-growth-snapshot-v1",
    tenantId,
    ownerActorId,
    snapshot,
    liveProviderExecutionAuthorized: false,
    providerMutationAuthorized: false,
    resumeAuthorized: false,
    customerContactAuthorized: false,
    paymentExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}
