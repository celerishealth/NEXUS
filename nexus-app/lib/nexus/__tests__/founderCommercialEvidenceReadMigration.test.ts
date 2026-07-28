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

describe("founder commercial evidence read migration", () => {
  it("provides a server-only exact-tenant exact-owner read function", () => {
    expect(migration).toContain(
      "create or replace function public.nexus_read_founder_commercial_evidence(",
    );
    expect(migration).toContain("p_tenant_id text");
    expect(migration).toContain("p_owner_id text");
    expect(migration).toContain(
      "and evidence.owner_id = trim(p_owner_id)",
    );
    expect(migration).toContain("and tenant.status = 'ACTIVE'");
    expect(migration).toContain(
      "and owner_identity.status = 'ACTIVE'",
    );
    expect(migration).toContain("and membership.status = 'ACTIVE'");
    expect(migration).toContain("and membership.role = 'OWNER'");
    expect(migration).toContain(
      "order by evidence.verified_at asc, evidence.evidence_id asc;",
    );
  });

  it("grants function execution only to service role without direct table access", () => {
    expect(migration).toContain(
      "security definer",
    );
    expect(migration).toContain(
      "set search_path = public, pg_temp",
    );
    expect(migration).toMatch(
      /grant execute on function public\.nexus_read_founder_commercial_evidence\(text,text\) to service_role/i,
    );
    expect(migration).toMatch(
      /revoke all on function public\.nexus_read_founder_commercial_evidence\(text,text\) from authenticated/i,
    );
    expect(migration).toMatch(
      /revoke all on function public\.nexus_read_founder_commercial_evidence\(text,text\) from anon/i,
    );
    expect(migration).not.toMatch(
      /grant\s+select[\s\S]*nexus_founder_commercial_evidence[\s\S]*service_role/i,
    );
  });
});
