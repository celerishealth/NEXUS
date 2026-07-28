import { describe, expect, it } from "vitest";

import {
  createFounderCommercialEvidenceSummary,
  type FounderCommercialEvidenceRecord,
} from "../founderCommercialEvidenceSummary";

function validRecords(): FounderCommercialEvidenceRecord[] {
  return [
    {
      kind: "qualified-lead",
      tenantId: "tenant-a",
      ownerActorId: "owner-a",
      evidenceId: "evidence-qualified-1",
      inquiryId: "inquiry-1",
      verifiedAt: "2026-07-28T10:00:00.000Z",
      buyerRequirementVerified: true,
      buyerIntentVerified: true,
      fakeOrIrrelevantLeadExcluded: true,
    },
    {
      kind: "quotation-issued",
      tenantId: "tenant-a",
      ownerActorId: "owner-a",
      evidenceId: "evidence-quotation-1",
      inquiryId: "inquiry-1",
      verifiedAt: "2026-07-28T10:05:00.000Z",
      quotationId: "quotation-1",
      ownerApproved: true,
      customerDeliveryVerified: true,
    },
    {
      kind: "order-confirmed",
      tenantId: "tenant-a",
      ownerActorId: "owner-a",
      evidenceId: "evidence-order-1",
      inquiryId: "inquiry-1",
      verifiedAt: "2026-07-28T10:10:00.000Z",
      orderId: "order-1",
      quotationId: "quotation-1",
      ownerConfirmed: true,
      customerAcceptanceVerified: true,
    },
    {
      kind: "payment-received",
      tenantId: "tenant-a",
      ownerActorId: "owner-a",
      evidenceId: "evidence-payment-1",
      inquiryId: "inquiry-1",
      verifiedAt: "2026-07-28T10:15:00.000Z",
      paymentId: "payment-1",
      orderId: "order-1",
      amountMinor: 125000,
      currencyCode: "INR",
      paymentReceiptVerified: true,
    },
  ];
}

function create(records: readonly FounderCommercialEvidenceRecord[]) {
  return createFounderCommercialEvidenceSummary({
    tenantId: "tenant-a",
    ownerActorId: "owner-a",
    generatedAt: "2026-07-28T11:00:00.000Z",
    records,
  });
}

describe("founder commercial evidence summary", () => {
  it("counts only a complete verified commercial evidence chain", () => {
    const summary = create(validRecords().reverse());

    expect(summary.qualifiedLeadCount).toBe(1);
    expect(summary.quotationCount).toBe(1);
    expect(summary.orderCount).toBe(1);
    expect(summary.paymentReceiptCount).toBe(1);
    expect(summary.revenueByCurrencyMinor).toEqual({ INR: 125000 });
    expect(summary.customerIdentityExposed).toBe(false);
    expect(summary.inquiryMessageExposed).toBe(false);
    expect(summary.customerContactAuthorized).toBe(false);
    expect(summary.paymentExecutionAuthorized).toBe(false);
    expect(summary.publicLaunchAuthorized).toBe(false);
    expect(Object.isFrozen(summary)).toBe(true);
    expect(Object.isFrozen(summary.revenueByCurrencyMinor)).toBe(true);
  });

  it("returns zero metrics when no verified evidence exists", () => {
    const summary = create([]);

    expect(summary.qualifiedLeadCount).toBe(0);
    expect(summary.quotationCount).toBe(0);
    expect(summary.orderCount).toBe(0);
    expect(summary.paymentReceiptCount).toBe(0);
    expect(summary.revenueByCurrencyMinor).toEqual({});
  });

  it("rejects foreign tenant or owner evidence", () => {
    const records = validRecords();
    records[0] = { ...records[0], tenantId: "tenant-b" };

    expect(() => create(records)).toThrow(
      "Commercial evidence tenant or owner binding is invalid.",
    );
  });

  it("does not count an unverified quotation delivery", () => {
    const records = validRecords();
    records[1] = {
      ...records[1],
      customerDeliveryVerified: false,
    } as unknown as FounderCommercialEvidenceRecord;

    expect(() => create(records)).toThrow(
      "customerDeliveryVerified must be verified.",
    );
  });

  it("rejects an issued quotation without qualified-lead evidence", () => {
    const records = validRecords().filter(
      (record) => record.kind !== "qualified-lead",
    );

    expect(() => create(records)).toThrow(
      "Issued quotation lacks verified qualified-lead evidence.",
    );
  });

  it("rejects an order without matching issued quotation evidence", () => {
    const records = validRecords().filter(
      (record) => record.kind !== "quotation-issued",
    );

    expect(() => create(records)).toThrow(
      "Confirmed order lacks matching issued quotation evidence.",
    );
  });

  it("rejects payment without matching confirmed order evidence", () => {
    const records = validRecords().filter(
      (record) => record.kind !== "order-confirmed",
    );

    expect(() => create(records)).toThrow(
      "Received payment lacks matching confirmed order evidence.",
    );
  });

  it("rejects duplicate commercial evidence IDs", () => {
    const records = validRecords();
    records[1] = {
      ...records[1],
      evidenceId: records[0].evidenceId,
    };

    expect(() => create(records)).toThrow(
      "Duplicate commercial evidence ID.",
    );
  });

  it("rejects duplicate qualified-lead evidence for one inquiry", () => {
    const records = validRecords();
    records.push({ ...records[0], evidenceId: "evidence-qualified-2" });

    expect(() => create(records)).toThrow(
      "Duplicate qualified-lead evidence for inquiry.",
    );
  });

  it("rejects duplicate quotation IDs", () => {
    const records = validRecords();
    records.push({
      ...records[1],
      evidenceId: "evidence-quotation-2",
    });

    expect(() => create(records)).toThrow("Duplicate quotation ID.");
  });

  it("rejects invalid payment currency and amount evidence", () => {
    const invalidCurrency = validRecords();
    invalidCurrency[3] = {
      ...invalidCurrency[3],
      currencyCode: "RUPEE",
    } as FounderCommercialEvidenceRecord;

    expect(() => create(invalidCurrency)).toThrow(
      "currencyCode is invalid.",
    );

    const invalidAmount = validRecords();
    invalidAmount[3] = {
      ...invalidAmount[3],
      amountMinor: 0,
    } as unknown as FounderCommercialEvidenceRecord;

    expect(() => create(invalidAmount)).toThrow(
      "amountMinor is invalid.",
    );
  });

  it("rejects non-canonical verification timestamps", () => {
    const records = validRecords();
    records[0] = {
      ...records[0],
      verifiedAt: "2026-07-28T10:00:00Z",
    };

    expect(() => create(records)).toThrow(
      "record.verifiedAt must be a canonical ISO timestamp.",
    );
  });
});
