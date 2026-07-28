import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("controlled customer inquiry growth totals reader migration", () => {
  it("exposes only exact-tenant aggregate totals to the service role", () => {
    const migration = readFileSync(
      resolve(
        process.cwd(),
        "supabase/migrations/20260728132500_controlled_customer_inquiry_growth_totals_reader.sql",
      ),
      "utf8",
    ).toLowerCase();

    expect(migration).toContain(
      "nexus_read_controlled_customer_inquiry_growth_totals",
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
      "count(distinct inquiry.customer_ref)::bigint",
    );
    expect(migration).not.toContain("inquiry_id");
    expect(migration).toContain("from public");
    expect(migration).toContain("from anon");
    expect(migration).toContain("from authenticated");
    expect(migration).toContain("to service_role");
  });
});
