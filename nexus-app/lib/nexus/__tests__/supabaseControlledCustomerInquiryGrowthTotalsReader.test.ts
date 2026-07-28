import { describe, expect, it, vi } from "vitest";

import { SupabaseControlledCustomerInquiryGrowthTotalsReader } from "../supabaseControlledCustomerInquiryGrowthTotalsReader";

describe("Supabase controlled customer inquiry growth totals reader", () => {
  it("reads exact tenant aggregate totals without loading inquiry rows", async () => {
    const payload = [{ tenant_id: "tenant-a", total_inquiries: "12", unique_customers: "7" }];
    const fetchFunction = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    const reader = new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "https://nexus-example.supabase.co", serviceRoleKey: "x".repeat(32), fetchFunction });
    await expect(reader.readTenantGrowthTotals("tenant-a")).resolves.toEqual({ status: "found", totals: { tenantId: "tenant-a", totalInquiries: 12, uniqueCustomers: 7 } });
    expect(fetchFunction.mock.calls[0]?.[0]).toBe("https://nexus-example.supabase.co/rest/v1/rpc/nexus_read_controlled_customer_inquiry_growth_totals");
    expect(fetchFunction.mock.calls[0]?.[1]).toMatchObject({ method: "POST", body: JSON.stringify({ p_tenant_id: "tenant-a" }), cache: "no-store" });
  });
});


describe("Supabase controlled customer inquiry growth totals reader safety", () => {
  it("fails closed on foreign-tenant aggregate evidence", async () => {
    const payload = [{ tenant_id: "tenant-b", total_inquiries: "12", unique_customers: "7" }];
    const fetchFunction = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    const reader = new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "https://nexus-example.supabase.co", serviceRoleKey: "x".repeat(32), fetchFunction });
    await expect(reader.readTenantGrowthTotals("tenant-a")).resolves.toEqual({ status: "reader-unavailable" });
  });

  it("fails closed when unique customers exceed total inquiries", async () => {
    const payload = [{ tenant_id: "tenant-a", total_inquiries: "2", unique_customers: "3" }];
    const fetchFunction = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    const reader = new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "https://nexus-example.supabase.co", serviceRoleKey: "x".repeat(32), fetchFunction });
    await expect(reader.readTenantGrowthTotals("tenant-a")).resolves.toEqual({ status: "reader-unavailable" });
  });
});

describe("Supabase controlled customer inquiry growth totals reader boundaries", () => {
  it("preserves verified zero totals for a tenant with no inquiries", async () => {
    const payload = [{ tenant_id: "tenant-a", total_inquiries: "0", unique_customers: "0" }];
    const fetchFunction = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    const reader = new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "https://nexus-example.supabase.co", serviceRoleKey: "x".repeat(32), fetchFunction });
    await expect(reader.readTenantGrowthTotals("tenant-a")).resolves.toEqual({ status: "found", totals: { tenantId: "tenant-a", totalInquiries: 0, uniqueCustomers: 0 } });
  });

  it("fails closed unless the RPC returns exactly one aggregate row", async () => {
    const fetchFunction = vi.fn().mockResolvedValue(new Response("[]", { status: 200 }));
    const reader = new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "https://nexus-example.supabase.co", serviceRoleKey: "x".repeat(32), fetchFunction });
    await expect(reader.readTenantGrowthTotals("tenant-a")).resolves.toEqual({ status: "reader-unavailable" });
  });

  it("passes an abort signal to the RPC request", async () => {
    const payload = [{ tenant_id: "tenant-a", total_inquiries: "0", unique_customers: "0" }];
    const fetchFunction = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    const reader = new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "https://nexus-example.supabase.co", serviceRoleKey: "x".repeat(32), fetchFunction });
    await reader.readTenantGrowthTotals("tenant-a");
    expect(fetchFunction.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it("rejects malformed or non-http configuration URLs", () => {
    expect(() => new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "not-a-url", serviceRoleKey: "x".repeat(32) })).toThrow("Invalid server-only customer inquiry growth totals reader configuration.");
    expect(() => new SupabaseControlledCustomerInquiryGrowthTotalsReader({ supabaseUrl: "file:///tmp/nexus", serviceRoleKey: "x".repeat(32) })).toThrow("Invalid server-only customer inquiry growth totals reader configuration.");
  });
});