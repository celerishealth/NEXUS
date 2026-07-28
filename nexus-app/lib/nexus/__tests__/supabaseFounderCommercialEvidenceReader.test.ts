import { describe, expect, it, vi } from "vitest";

import { SupabaseFounderCommercialEvidenceReader } from "../supabaseFounderCommercialEvidenceReader";

const common = {
  tenant_id: "tenant-a",
  owner_id: "owner-a",
  inquiry_id: "11111111-1111-4111-8111-111111111111",
  verified_at: "2026-07-28T10:00:00+00:00",
};

const qualified = {
  ...common,
  evidence_id: "21111111-1111-4111-8111-111111111111",
  evidence_kind: "qualified-lead",
  quotation_id: null,
  order_id: null,
  payment_id: null,
  amount_minor: null,
  currency_code: null,
  buyer_requirement_verified: true,
  buyer_intent_verified: true,
  fake_or_irrelevant_lead_excluded: true,
  owner_approved: null,
  customer_delivery_verified: null,
  owner_confirmed: null,
  customer_acceptance_verified: null,
  payment_receipt_verified: null,
};

function createReader(payload: unknown) {
  const fetchFunction = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
  const reader = new SupabaseFounderCommercialEvidenceReader({
    supabaseUrl: "https://nexus-example.supabase.co",
    serviceRoleKey: "x".repeat(32),
    fetchFunction,
  });

  return { reader, fetchFunction };
}

describe("Supabase founder commercial evidence reader", () => {
  it("reads exact-tenant exact-owner verified evidence without customer data", async () => {
    const { reader, fetchFunction } = createReader([qualified]);

    await expect(
      reader.readTenantOwnerEvidence("tenant-a", "owner-a"),
    ).resolves.toEqual({
      status: "found",
      records: [
        {
          kind: "qualified-lead",
          tenantId: "tenant-a",
          ownerActorId: "owner-a",
          evidenceId: "21111111-1111-4111-8111-111111111111",
          inquiryId: "11111111-1111-4111-8111-111111111111",
          verifiedAt: "2026-07-28T10:00:00.000Z",
          buyerRequirementVerified: true,
          buyerIntentVerified: true,
          fakeOrIrrelevantLeadExcluded: true,
        },
      ],
    });

    expect(fetchFunction.mock.calls[0]?.[0]).toBe(
      "https://nexus-example.supabase.co/rest/v1/rpc/nexus_read_founder_commercial_evidence",
    );
    expect(fetchFunction.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({
        p_tenant_id: "tenant-a",
        p_owner_id: "owner-a",
      }),
      cache: "no-store",
    });
    expect(fetchFunction.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it("preserves a verified empty evidence set", async () => {
    const { reader } = createReader([]);

    await expect(
      reader.readTenantOwnerEvidence("tenant-a", "owner-a"),
    ).resolves.toEqual({ status: "found", records: [] });
  });

  it("fails closed on foreign owner or malformed evidence", async () => {
    const foreignOwner = createReader([{ ...qualified, owner_id: "owner-b" }]);
    const malformed = createReader([
      { ...qualified, buyer_intent_verified: false },
    ]);

    await expect(
      foreignOwner.reader.readTenantOwnerEvidence("tenant-a", "owner-a"),
    ).resolves.toEqual({ status: "reader-unavailable" });
    await expect(
      malformed.reader.readTenantOwnerEvidence("tenant-a", "owner-a"),
    ).resolves.toEqual({ status: "reader-unavailable" });
  });

  it("rejects invalid server-only reader configuration", () => {
    expect(
      () =>
        new SupabaseFounderCommercialEvidenceReader({
          supabaseUrl: "file:///tmp/nexus",
          serviceRoleKey: "x".repeat(32),
        }),
    ).toThrow(
      "Invalid server-only founder commercial evidence reader configuration.",
    );
  });
});
