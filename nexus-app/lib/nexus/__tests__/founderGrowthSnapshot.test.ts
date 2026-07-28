import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createFounderGrowthSnapshot,
  createFounderGrowthSnapshotFromTotals,
  type FounderGrowthInquiryEvidence,
} from "../founderGrowthSnapshot";

const firstInquiry: FounderGrowthInquiryEvidence = {
  inquiryId:
    "11111111-1111-4111-8111-111111111111",
  tenantId:
    "tenant-a",
  customerRef:
    "customer-a",
  channel:
    "manual",
  status:
    "received",
  receivedAt:
    1,
};

describe(
  "founder growth snapshot",
  () => {
    it(
      "reports only verified inquiry evidence and leaves commercial metrics unavailable",
      () => {
        const snapshot =
          createFounderGrowthSnapshot({
            tenantId:
              "tenant-a",
            generatedAt:
              "2026-07-28T00:00:00.000Z",
            inquiries: [
              firstInquiry,
            ],
          });

        expect(snapshot).toMatchObject({
          tenantId:
            "tenant-a",
          evidenceBoundary:
            "VERIFIED_INQUIRY_EVIDENCE_ONLY",
          totalInquiries:
            1,
          uniqueCustomers:
            1,
          qualifiedLeadCount:
            null,
          quotationCount:
            null,
          orderCount:
            null,
          revenueAmount:
            null,
          liveProviderExecutionAuthorized:
            false,
          customerContactAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          publicLaunchAuthorized:
            false,
        });
      },
    );

    it(
      "counts repeated inquiries from one customer without inflating unique customers",
      () => {
        const snapshot =
          createFounderGrowthSnapshot({
            tenantId:
              "tenant-a",
            generatedAt:
              "2026-07-28T00:00:00.000Z",
            inquiries: [
              firstInquiry,
              {
                ...firstInquiry,
                inquiryId:
                  "22222222-2222-4222-8222-222222222222",
                receivedAt:
                  2,
              },
            ],
          });

        expect(snapshot.totalInquiries)
          .toBe(2);
        expect(snapshot.uniqueCustomers)
          .toBe(1);
      },
    );

    it(
      "blocks inquiry evidence belonging to another tenant",
      () => {
        expect(() =>
          createFounderGrowthSnapshot({
            tenantId:
              "tenant-a",
            generatedAt:
              "2026-07-28T00:00:00.000Z",
            inquiries: [
              {
                ...firstInquiry,
                tenantId:
                  "tenant-b",
              },
            ],
          }),
        ).toThrow(
          "Founder growth inquiry evidence is invalid.",
        );
      },
    );

    it(
      "blocks duplicate inquiry evidence from inflating totals",
      () => {
        expect(() =>
          createFounderGrowthSnapshot({
            tenantId:
              "tenant-a",
            generatedAt:
              "2026-07-28T00:00:00.000Z",
            inquiries: [
              firstInquiry,
              firstInquiry,
            ],
          }),
        ).toThrow(
          "Founder growth inquiry evidence is invalid.",
        );
      },
    );

    it(
      "rejects a non-canonical snapshot timestamp",
      () => {
        expect(() =>
          createFounderGrowthSnapshot({
            tenantId:
              "tenant-a",
            generatedAt:
              "2026-07-28",
            inquiries: [],
          }),
        ).toThrow(
          "Founder growth snapshot input is invalid.",
        );
      },
    );
  },
);


describe("founder growth snapshot lifecycle evidence", () => {
  it("counts a verified inquiry after it advances to owner review", () => {
    const inquiry = { inquiryId: "22222222-2222-4222-8222-222222222222", tenantId: "tenant-a", customerRef: "customer-b", channel: "web" as const, status: "owner-review" as const, receivedAt: 2 };
    const snapshot = createFounderGrowthSnapshot({ tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", inquiries: [inquiry] });
    expect(snapshot.totalInquiries).toBe(1);
    expect(snapshot.uniqueCustomers).toBe(1);
  });
});

describe("founder growth snapshot aggregate evidence", () => {
  it("creates an exact snapshot from verified tenant totals", () => {
    const snapshot = createFounderGrowthSnapshotFromTotals({ tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", totals: { tenantId: "tenant-a", totalInquiries: 12, uniqueCustomers: 7 } });
    expect(snapshot.totalInquiries).toBe(12);
    expect(snapshot.uniqueCustomers).toBe(7);
    expect(snapshot.qualifiedLeadCount).toBeNull();
  });

  it("blocks foreign-tenant or impossible aggregate totals", () => {
    expect(() => createFounderGrowthSnapshotFromTotals({ tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", totals: { tenantId: "tenant-b", totalInquiries: 2, uniqueCustomers: 1 } })).toThrow();
    expect(() => createFounderGrowthSnapshotFromTotals({ tenantId: "tenant-a", generatedAt: "2026-07-28T00:00:00.000Z", totals: { tenantId: "tenant-a", totalInquiries: 2, uniqueCustomers: 3 } })).toThrow();
  });
});