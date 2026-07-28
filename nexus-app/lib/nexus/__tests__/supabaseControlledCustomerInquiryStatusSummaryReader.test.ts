import { describe, expect, it, vi } from "vitest";

import { SupabaseControlledCustomerInquiryStatusSummaryReader } from "../supabaseControlledCustomerInquiryStatusSummaryReader";

const validRow = {
  tenant_id: "tenant-a",
  total_inquiries: "12",
  latest_received_at_epoch: "1200",
  received_count: "3",
  recommendation_pending_count: "1",
  owner_review_count: "2",
  approved_count: "2",
  rejected_count: "1",
  sandbox_executed_count: "1",
  completed_count: "1",
  failed_count: "1",
};

function createReader(payload: unknown) {
  const fetchFunction = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), { status: 200 }),
  );
  const reader =
    new SupabaseControlledCustomerInquiryStatusSummaryReader({
      supabaseUrl: "https://nexus-example.supabase.co",
      serviceRoleKey: "x".repeat(32),
      fetchFunction,
    });

  return { reader, fetchFunction };
}

describe("Supabase controlled customer inquiry status summary reader", () => {
  it("reads one exact-tenant reconciled status aggregate row", async () => {
    const { reader, fetchFunction } = createReader([validRow]);

    await expect(
      reader.readTenantStatusSummary("tenant-a"),
    ).resolves.toEqual({
      status: "found",
      evidence: {
        tenantId: "tenant-a",
        totalInquiries: 12,
        latestReceivedAt: 1200,
        counts: {
          received: 3,
          recommendationPending: 1,
          ownerReview: 2,
          approved: 2,
          rejected: 1,
          sandboxExecuted: 1,
          completed: 1,
          failed: 1,
        },
      },
    });

    expect(fetchFunction.mock.calls[0]?.[0]).toBe(
      "https://nexus-example.supabase.co/rest/v1/rpc/nexus_read_controlled_customer_inquiry_status_summary",
    );
    expect(fetchFunction.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({ p_tenant_id: "tenant-a" }),
      cache: "no-store",
    });
    expect(fetchFunction.mock.calls[0]?.[1]?.signal).toBeInstanceOf(
      AbortSignal,
    );
  });

  it("fails closed on foreign-tenant evidence", async () => {
    const { reader } = createReader([
      { ...validRow, tenant_id: "tenant-b" },
    ]);

    await expect(
      reader.readTenantStatusSummary("tenant-a"),
    ).resolves.toEqual({ status: "reader-unavailable" });
  });

  it("fails closed when status counts do not reconcile", async () => {
    const { reader } = createReader([
      { ...validRow, failed_count: "0" },
    ]);

    await expect(
      reader.readTenantStatusSummary("tenant-a"),
    ).resolves.toEqual({ status: "reader-unavailable" });
  });

  it("preserves verified zero totals with a null latest timestamp", async () => {
    const { reader } = createReader([
      {
        tenant_id: "tenant-a",
        total_inquiries: "0",
        latest_received_at_epoch: null,
        received_count: "0",
        recommendation_pending_count: "0",
        owner_review_count: "0",
        approved_count: "0",
        rejected_count: "0",
        sandbox_executed_count: "0",
        completed_count: "0",
        failed_count: "0",
      },
    ]);

    await expect(
      reader.readTenantStatusSummary("tenant-a"),
    ).resolves.toMatchObject({
      status: "found",
      evidence: {
        totalInquiries: 0,
        latestReceivedAt: null,
      },
    });
  });

  it("fails closed when nonzero totals have no latest timestamp", async () => {
    const { reader } = createReader([
      { ...validRow, latest_received_at_epoch: null },
    ]);

    await expect(
      reader.readTenantStatusSummary("tenant-a"),
    ).resolves.toEqual({ status: "reader-unavailable" });
  });

  it("requires exactly one aggregate row and valid configuration", async () => {
    const { reader } = createReader([]);

    await expect(
      reader.readTenantStatusSummary("tenant-a"),
    ).resolves.toEqual({ status: "reader-unavailable" });

    expect(
      () =>
        new SupabaseControlledCustomerInquiryStatusSummaryReader({
          supabaseUrl: "file:///tmp/nexus",
          serviceRoleKey: "x".repeat(32),
        }),
    ).toThrow(
      "Invalid server-only customer inquiry status summary reader configuration.",
    );
  });
});