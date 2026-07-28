import { describe, expect, it } from "vitest";

import { createFounderGrowthStatusSummary } from "../founderGrowthStatusSummary";

const counts = {
  received: 3,
  recommendationPending: 1,
  ownerReview: 2,
  approved: 2,
  rejected: 1,
  sandboxExecuted: 1,
  completed: 1,
  failed: 1,
};

describe("founder growth status summary", () => {
  it("creates reconciled privacy-safe exact-tenant status evidence", () => {
    const summary = createFounderGrowthStatusSummary({
      tenantId: "tenant-a",
      generatedAt: "2026-07-28T00:00:00.000Z",
      evidence: {
        tenantId: "tenant-a",
        totalInquiries: 12,
        latestReceivedAt: 12,
        counts,
      },
    });

    expect(summary.totalInquiries).toBe(12);
    expect(summary.counts.ownerReview).toBe(2);
    expect(summary.evidenceBoundary).toBe(
      "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY",
    );
    expect(summary.customerIdentityExposed).toBe(false);
    expect(summary.inquiryMessageExposed).toBe(false);
    expect(summary.liveProviderExecutionAuthorized).toBe(false);
    expect(summary.customerContactAuthorized).toBe(false);
    expect(summary.paymentExecutionAuthorized).toBe(false);
    expect(summary.publicLaunchAuthorized).toBe(false);
  });

  it("rejects foreign-tenant aggregate evidence", () => {
    expect(() =>
      createFounderGrowthStatusSummary({
        tenantId: "tenant-a",
        generatedAt: "2026-07-28T00:00:00.000Z",
        evidence: {
          tenantId: "tenant-b",
          totalInquiries: 12,
          latestReceivedAt: 12,
          counts,
        },
      }),
    ).toThrow(
      "Founder growth status aggregate evidence is invalid.",
    );
  });

  it("rejects status counts that do not reconcile to the total", () => {
    expect(() =>
      createFounderGrowthStatusSummary({
        tenantId: "tenant-a",
        generatedAt: "2026-07-28T00:00:00.000Z",
        evidence: {
          tenantId: "tenant-a",
          totalInquiries: 13,
          latestReceivedAt: 12,
          counts,
        },
      }),
    ).toThrow(
      "Founder growth status aggregate evidence is inconsistent.",
    );
  });

  it("requires null latest inquiry time only for verified zero totals", () => {
    expect(
      createFounderGrowthStatusSummary({
        tenantId: "tenant-a",
        generatedAt: "2026-07-28T00:00:00.000Z",
        evidence: {
          tenantId: "tenant-a",
          totalInquiries: 0,
          latestReceivedAt: null,
          counts: {
            received: 0,
            recommendationPending: 0,
            ownerReview: 0,
            approved: 0,
            rejected: 0,
            sandboxExecuted: 0,
            completed: 0,
            failed: 0,
          },
        },
      }).latestReceivedAt,
    ).toBeNull();

    expect(() =>
      createFounderGrowthStatusSummary({
        tenantId: "tenant-a",
        generatedAt: "2026-07-28T00:00:00.000Z",
        evidence: {
          tenantId: "tenant-a",
          totalInquiries: 12,
          latestReceivedAt: null,
          counts,
        },
      }),
    ).toThrow(
      "Founder growth status aggregate evidence is inconsistent.",
    );
  });
});