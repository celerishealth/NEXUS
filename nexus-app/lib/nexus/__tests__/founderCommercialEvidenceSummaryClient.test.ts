import { describe, expect, it, vi } from "vitest";

import { readFounderCommercialEvidenceSummary } from "../founderCommercialEvidenceSummaryClient";

function body() {
  return {
    schemaVersion: "nexus-founder-commercial-evidence-summary-v1",
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    summary: {
      version: "nexus-founder-commercial-evidence-summary-v1",
      tenantId: "tenant-a",
      ownerActorId: "owner-a",
      generatedAt: "2026-07-28T10:30:00.000Z",
      evidenceBoundary:
        "VERIFIED_OWNER_BOUND_COMMERCIAL_EVIDENCE_ONLY",
      sourceRecordCount: 4,
      qualifiedLeadCount: 1,
      quotationCount: 1,
      orderCount: 1,
      paymentReceiptCount: 1,
      revenueByCurrencyMinor: { INR: 125000 },
      customerIdentityExposed: false,
      inquiryMessageExposed: false,
      customerContactAuthorized: false,
      quotationDeliveryAuthorized: false,
      orderExecutionAuthorized: false,
      paymentExecutionAuthorized: false,
      providerMutationAuthorized: false,
      publicLaunchAuthorized: false,
    },
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

const input = {
  accessToken: "token-a",
  expectedTenantId: "tenant-a",
  expectedOwnerActorId: "owner-a",
};

describe("founder commercial evidence summary client", () => {
  it("reads exact-tenant exact-owner verified commercial aggregates with all authority blocked", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(body()), { status: 200 }),
      );

    const result = await readFounderCommercialEvidenceSummary(
      input,
      fetchImpl,
    );

    expect(result.summary.qualifiedLeadCount).toBe(1);
    expect(result.summary.quotationCount).toBe(1);
    expect(result.summary.orderCount).toBe(1);
    expect(result.summary.paymentReceiptCount).toBe(1);
    expect(result.summary.revenueByCurrencyMinor).toEqual({
      INR: 125000,
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/nexus/founder-command/commercial",
      expect.objectContaining({
        method: "GET",
        cache: "no-store",
        headers: expect.objectContaining({
          authorization: "Bearer token-a",
        }),
      }),
    );
    expect(result.liveProviderExecutionAuthorized).toBe(false);
    expect(result.customerContactAuthorized).toBe(false);
    expect(result.quotationDeliveryAuthorized).toBe(false);
    expect(result.orderExecutionAuthorized).toBe(false);
    expect(result.paymentExecutionAuthorized).toBe(false);
    expect(result.publicLaunchAuthorized).toBe(false);
  });

  it("rejects foreign-owner commercial evidence", async () => {
    const value = body();
    value.ownerActorId = "owner-b";
    value.summary.ownerActorId = "owner-b";
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(value), { status: 200 }),
      );

    await expect(
      readFounderCommercialEvidenceSummary(input, fetchImpl),
    ).rejects.toThrow(
      "Founder commercial evidence summary identity or evidence boundary could not be verified.",
    );
  });

  it("rejects any response granting consequential authority", async () => {
    const value = body();
    value.quotationDeliveryAuthorized = true;
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(value), { status: 200 }),
      );

    await expect(
      readFounderCommercialEvidenceSummary(input, fetchImpl),
    ).rejects.toThrow(
      "Founder commercial evidence summary safety boundary could not be verified. No action was taken.",
    );
  });

  it("rejects inconsistent commercial aggregate totals", async () => {
    const value = body();
    value.summary.sourceRecordCount = 5;
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(value), { status: 200 }),
      );

    await expect(
      readFounderCommercialEvidenceSummary(input, fetchImpl),
    ).rejects.toThrow(
      "Founder commercial evidence summary aggregate evidence could not be safely verified.",
    );
  });

  it("rejects customer identity or inquiry-message exposure", async () => {
    const value = body();
    value.summary.customerIdentityExposed = true;
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(value), { status: 200 }),
      );

    await expect(
      readFounderCommercialEvidenceSummary(input, fetchImpl),
    ).rejects.toThrow(
      "Founder commercial evidence summary identity or evidence boundary could not be verified.",
    );
  });
});
