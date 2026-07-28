import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createFounderGrowthSnapshot,
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
