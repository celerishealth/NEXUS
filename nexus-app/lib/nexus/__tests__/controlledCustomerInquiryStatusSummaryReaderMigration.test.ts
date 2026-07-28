import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("controlled customer inquiry status summary reader migration", () => {
  it("exposes only exact-tenant privacy-safe status aggregates to the service role", () => {
    const migration = readFileSync(
      resolve(
        process.cwd(),
        "supabase/migrations/20260728143000_controlled_customer_inquiry_status_summary_reader.sql",
      ),
      "utf8",
    ).toLowerCase();

    expect(migration).toContain(
      "nexus_read_controlled_customer_inquiry_status_summary",
    );
    expect(migration).toContain("security definer");
    expect(migration).toContain("stable");
    expect(migration).toContain(
      "set search_path = public, pg_temp",
    );
    expect(migration).toContain(
      "where inquiry.tenant_id = trim(p_tenant_id)",
    );
    expect(migration).toContain("count(*)::bigint");
    expect(migration).toContain(
      "max(inquiry.received_at_epoch)::bigint",
    );
    expect(migration).toContain("count(*) filter");
    expect(migration).not.toContain("inquiry_id");
    expect(migration).not.toContain("customer_ref");
    expect(migration).not.toContain("message text");
    expect(migration).not.toContain("idempotency_key");
    expect(migration).toContain("from public");
    expect(migration).toContain("from anon");
    expect(migration).toContain("from authenticated");
    expect(migration).toContain("to service_role");
  });
});