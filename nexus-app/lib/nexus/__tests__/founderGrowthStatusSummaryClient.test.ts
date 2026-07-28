import { describe, expect, it, vi } from "vitest";

import { readFounderGrowthStatusSummary } from "../founderGrowthStatusSummaryClient";

function body() {
  return {
    schemaVersion: "nexus-founder-growth-status-summary-v1",
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    summary: {
      tenantId: "tenant-a",
      generatedAt: "2026-07-28T00:00:00.000Z",
      evidenceBoundary: "VERIFIED_INQUIRY_STATUS_AGGREGATES_ONLY",
      totalInquiries: 12,
      latestReceivedAt: 1722124800000,
      counts: { received: 2, recommendationPending: 2, ownerReview: 2, approved: 1, rejected: 1, sandboxExecuted: 1, completed: 2, failed: 1 },
      customerIdentityExposed: false,
      inquiryMessageExposed: false,
      liveProviderExecutionAuthorized: false,
      customerContactAuthorized: false,
      paymentExecutionAuthorized: false,
      publicLaunchAuthorized: false,
    },
    liveProviderExecutionAuthorized: false,
    providerMutationAuthorized: false,
    resumeAuthorized: false,
    customerContactAuthorized: false,
    paymentExecutionAuthorized: false,
    publicLaunchAuthorized: false,
  };
}

const input = { accessToken: "token-a", expectedTenantId: "tenant-a", expectedOwnerActorId: "owner-a" };

describe("founder growth status summary client", () => {
  it("reads exact-tenant privacy-safe status aggregates with all authority blocked", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(body()), { status: 200 }));
    const result = await readFounderGrowthStatusSummary(input, fetchImpl);
    expect(result.summary.totalInquiries).toBe(12);
    expect(result.summary.counts.ownerReview).toBe(2);
    expect(fetchImpl).toHaveBeenCalledWith("/api/nexus/founder-command/growth/status", expect.objectContaining({ method: "GET", cache: "no-store", headers: expect.objectContaining({ authorization: "Bearer token-a" }) }));
    expect(result.summary.customerIdentityExposed).toBe(false);
    expect(result.summary.inquiryMessageExposed).toBe(false);
    expect(result.liveProviderExecutionAuthorized).toBe(false);
    expect(result.customerContactAuthorized).toBe(false);
    expect(result.paymentExecutionAuthorized).toBe(false);
    expect(result.publicLaunchAuthorized).toBe(false);
  });

  it("rejects foreign-tenant status evidence", async () => {
    const value = body();
    value.tenantId = "tenant-b";
    value.summary.tenantId = "tenant-b";
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(value), { status: 200 }));
    await expect(readFounderGrowthStatusSummary(input, fetchImpl)).rejects.toThrow("Founder growth status summary identity or evidence boundary could not be verified.");
  });

  it("rejects any response granting consequential authority", async () => {
    const value = body();
    value.liveProviderExecutionAuthorized = true;
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(value), { status: 200 }));
    await expect(readFounderGrowthStatusSummary(input, fetchImpl)).rejects.toThrow("Founder growth status summary safety boundary could not be verified. No action was taken.");
  });

  it("rejects inconsistent status totals", async () => {
    const value = body();
    value.summary.counts.received = 3;
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(value), { status: 200 }));
    await expect(readFounderGrowthStatusSummary(input, fetchImpl)).rejects.toThrow("Founder growth status summary aggregate evidence could not be safely verified.");
  });

  it("rejects identity or message exposure", async () => {
    const value = body();
    value.summary.customerIdentityExposed = true;
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(value), { status: 200 }));
    await expect(readFounderGrowthStatusSummary(input, fetchImpl)).rejects.toThrow("Founder growth status summary identity or evidence boundary could not be verified.");
  });
});
