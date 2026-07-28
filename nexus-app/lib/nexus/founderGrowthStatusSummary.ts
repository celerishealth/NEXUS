export interface FounderGrowthStatusCounts {
  received: number;
  recommendationPending: number;
  ownerReview: number;
  approved: number;
  rejected: number;
  sandboxExecuted: number;
  completed: number;
  failed: number;
}

export interface FounderGrowthStatusEvidence {
  tenantId: string;
  totalInquiries: number;
  latestReceivedAt: number | null;
  counts: FounderGrowthStatusCounts;
}

export interface FounderGrowthStatusSummaryInput {
  tenantId: string;
  generatedAt: string;
  evidence: FounderGrowthStatusEvidence;
}

export interface FounderGrowthStatusSummary {
  tenantId: string;
  generatedAt: string;
  evidenceBoundary: "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY";
  totalInquiries: number;
  latestReceivedAt: number | null;
  counts: Readonly<FounderGrowthStatusCounts>;
  customerIdentityExposed: false;
  inquiryMessageExposed: false;
  liveProviderExecutionAuthorized: false;
  customerContactAuthorized: false;
  paymentExecutionAuthorized: false;
  publicLaunchAuthorized: false;
}

function readRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readNonNegativeInteger(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
    ? value
    : null;
}

function isCanonicalIsoTimestamp(value: string): boolean {
  const parsed = new Date(value);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString() === value
  );
}

export function createFounderGrowthStatusSummary(
  input: FounderGrowthStatusSummaryInput,
): FounderGrowthStatusSummary {
  const tenantId = readRequiredString(input?.tenantId);
  const generatedAt = readRequiredString(input?.generatedAt);
  const evidence = input?.evidence;
  const evidenceTenantId = readRequiredString(evidence?.tenantId);
  const totalInquiries = readNonNegativeInteger(
    evidence?.totalInquiries,
  );
  const received = readNonNegativeInteger(evidence?.counts?.received);
  const recommendationPending = readNonNegativeInteger(
    evidence?.counts?.recommendationPending,
  );
  const ownerReview = readNonNegativeInteger(
    evidence?.counts?.ownerReview,
  );
  const approved = readNonNegativeInteger(evidence?.counts?.approved);
  const rejected = readNonNegativeInteger(evidence?.counts?.rejected);
  const sandboxExecuted = readNonNegativeInteger(
    evidence?.counts?.sandboxExecuted,
  );
  const completed = readNonNegativeInteger(evidence?.counts?.completed);
  const failed = readNonNegativeInteger(evidence?.counts?.failed);
  const rawLatestReceivedAt = evidence?.latestReceivedAt;
  const latestReceivedAt =
    rawLatestReceivedAt === null
      ? null
      : readNonNegativeInteger(rawLatestReceivedAt);

  if (
    !tenantId ||
    !generatedAt ||
    !isCanonicalIsoTimestamp(generatedAt) ||
    evidenceTenantId !== tenantId ||
    totalInquiries === null ||
    received === null ||
    recommendationPending === null ||
    ownerReview === null ||
    approved === null ||
    rejected === null ||
    sandboxExecuted === null ||
    completed === null ||
    failed === null ||
    (rawLatestReceivedAt !== null && latestReceivedAt === null)
  ) {
    throw new Error(
      "Founder growth status aggregate evidence is invalid.",
    );
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
    throw new Error(
      "Founder growth status aggregate evidence is inconsistent.",
    );
  }

  return Object.freeze({
    tenantId,
    generatedAt,
    evidenceBoundary:
      "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY",
    totalInquiries,
    latestReceivedAt,
    counts: Object.freeze({
      received,
      recommendationPending,
      ownerReview,
      approved,
      rejected,
      sandboxExecuted,
      completed,
      failed,
    }),
    customerIdentityExposed: false,
    inquiryMessageExposed: false,
    liveProviderExecutionAuthorized: false,
    customerContactAuthorized: false,
    paymentExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  });
}