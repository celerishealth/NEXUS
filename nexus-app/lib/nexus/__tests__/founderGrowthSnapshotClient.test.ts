import { describe, expect, it, vi } from "vitest";

import { readFounderGrowthSnapshot } from "../founderGrowthSnapshotClient";

describe("founder growth snapshot client", () => {
  it("reads only exact-tenant aggregate evidence with all consequential authority blocked", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ schemaVersion: "nexus-founder-growth-snapshot-v1", tenantId: "tenant-a", ownerActorId: "owner-a", snapshot: { tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", evidenceBoundary: "VERIFIED_INQUIRY_EVIDENCE_ONLY", totalInquiries: 12, uniqueCustomers: 7, qualifiedLeadCount: null, quotationCount: null, orderCount: null, revenueAmount: null, liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false }, liveProviderExecutionAuthorized: false, providerMutationAuthorized: false, resumeAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false }), { status: 200 }));
    const result = await readFounderGrowthSnapshot({ accessToken: "token-a", expectedTenantId: "tenant-a", expectedOwnerActorId: "owner-a" }, fetchImpl);
    expect(result.snapshot.totalInquiries).toBe(12);
    expect(result.snapshot.uniqueCustomers).toBe(7);
    expect(fetchImpl).toHaveBeenCalledWith("/api/nexus/founder-command/growth", expect.objectContaining({ method: "GET", cache: "no-store", headers: expect.objectContaining({ authorization: "Bearer token-a" }) }));
    expect(result.liveProviderExecutionAuthorized).toBe(false);
    expect(result.customerContactAuthorized).toBe(false);
    expect(result.paymentExecutionAuthorized).toBe(false);
    expect(result.publicLaunchAuthorized).toBe(false);
  });
});


describe("founder growth snapshot client safety", () => {
  it("rejects foreign-tenant aggregate evidence", async () => {
    const body = { schemaVersion: "nexus-founder-growth-snapshot-v1", tenantId: "tenant-b", ownerActorId: "owner-a", snapshot: { tenantId: "tenant-b", generatedAt: "2026-07-28T00:00:00.000Z", evidenceBoundary: "VERIFIED_INQUIRY_EVIDENCE_ONLY", totalInquiries: 1, uniqueCustomers: 1, qualifiedLeadCount: null, quotationCount: null, orderCount: null, revenueAmount: null, liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false }, liveProviderExecutionAuthorized: false, providerMutationAuthorized: false, resumeAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false };
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    await expect(readFounderGrowthSnapshot({ accessToken: "token-a", expectedTenantId: "tenant-a", expectedOwnerActorId: "owner-a" }, fetchImpl)).rejects.toThrow("Founder growth snapshot identity or evidence boundary could not be verified.");
  });

  it("rejects any response that grants consequential authority", async () => {
    const body = { schemaVersion: "nexus-founder-growth-snapshot-v1", tenantId: "tenant-a", ownerActorId: "owner-a", snapshot: { tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", evidenceBoundary: "VERIFIED_INQUIRY_EVIDENCE_ONLY", totalInquiries: 1, uniqueCustomers: 1, qualifiedLeadCount: null, quotationCount: null, orderCount: null, revenueAmount: null, liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false }, liveProviderExecutionAuthorized: true, providerMutationAuthorized: false, resumeAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false };
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    await expect(readFounderGrowthSnapshot({ accessToken: "token-a", expectedTenantId: "tenant-a", expectedOwnerActorId: "owner-a" }, fetchImpl)).rejects.toThrow("Founder growth snapshot safety boundary could not be verified. No action was taken.");
  });
  it("rejects impossible aggregate totals", async () => {
    const body = { schemaVersion: "nexus-founder-growth-snapshot-v1", tenantId: "tenant-a", ownerActorId: "owner-a", snapshot: { tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", evidenceBoundary: "VERIFIED_INQUIRY_EVIDENCE_ONLY", totalInquiries: 1, uniqueCustomers: 2, qualifiedLeadCount: null, quotationCount: null, orderCount: null, revenueAmount: null, liveProviderExecutionAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false }, liveProviderExecutionAuthorized: false, providerMutationAuthorized: false, resumeAuthorized: false, customerContactAuthorized: false, paymentExecutionAuthorized: false, publicLaunchAuthorized: false };
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    await expect(readFounderGrowthSnapshot({ accessToken: "token-a", expectedTenantId: "tenant-a", expectedOwnerActorId: "owner-a" }, fetchImpl)).rejects.toThrow("Founder growth snapshot aggregate evidence could not be safely verified.");
  });
});