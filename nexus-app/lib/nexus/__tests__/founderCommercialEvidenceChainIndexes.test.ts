import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260728153000_founder_commercial_evidence_storage.sql",
  ),
  "utf8",
);

describe("founder commercial evidence chain indexes", () => {
  it("keeps identifiers unique within their originating evidence stage", () => {
    expect(migration).toContain(
      "where evidence_kind = 'quotation-issued';",
    );
    expect(migration).toContain(
      "where evidence_kind = 'order-confirmed';",
    );
    expect(migration).toContain(
      "where evidence_kind = 'payment-received';",
    );
    expect(migration).not.toContain("where quotation_id is not null;");
    expect(migration).not.toContain("where order_id is not null;");
    expect(migration).not.toContain("where payment_id is not null;");
  });
});
