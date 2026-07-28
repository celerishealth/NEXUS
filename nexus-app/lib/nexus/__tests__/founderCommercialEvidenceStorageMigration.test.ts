import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260728153000_founder_commercial_evidence_storage.sql",
);

const migration = readFileSync(migrationPath, "utf8");

describe("founder commercial evidence storage migration", () => {
  it("creates a privacy-safe append-only commercial evidence table", () => {
    expect(migration).toContain(
      "create table if not exists public.nexus_founder_commercial_evidence",
    );
    expect(migration).toContain("evidence_id uuid primary key");
    expect(migration).toContain("tenant_id varchar(128) not null");
    expect(migration).toContain("owner_id varchar(128) not null");
    expect(migration).toContain("session_id varchar(128) not null");
    expect(migration).toContain("authority_epoch varchar(128) not null");
    expect(migration).toContain("inquiry_id uuid not null");
    expect(migration).toContain("evidence_payload_hash char(64) not null");
    expect(migration).not.toContain("customer_ref");
    expect(migration).not.toContain("message text");
    expect(migration).not.toContain("email");
    expect(migration).not.toContain("phone");
  });

  it("supports only the verified commercial evidence chain", () => {
    for (const kind of [
      "qualified-lead",
      "quotation-issued",
      "order-confirmed",
      "payment-received",
    ]) {
      expect(migration).toContain(`'${kind}'`);
    }

    expect(migration).toContain(
      "buyer_requirement_verified is true",
    );
    expect(migration).toContain("buyer_intent_verified is true");
    expect(migration).toContain(
      "fake_or_irrelevant_lead_excluded is true",
    );
    expect(migration).toContain("owner_approved is true");
    expect(migration).toContain("customer_delivery_verified is true");
    expect(migration).toContain("owner_confirmed is true");
    expect(migration).toContain("customer_acceptance_verified is true");
    expect(migration).toContain("payment_receipt_verified is true");
    expect(migration).toContain(
      "amount_minor between 1 and 9007199254740991",
    );
    expect(migration).toContain("currency_code ~ '^[A-Z]{3}$'");
  });

  it("binds writes to an exact active owner session and authority epoch", () => {
    expect(migration).toContain(
      "create or replace function public.nexus_append_founder_commercial_evidence",
    );
    expect(migration).toContain("security definer");
    expect(migration).toContain("set search_path = public, pg_temp");
    expect(migration).toContain(
      "from public.nexus_authenticated_owner_sessions as session",
    );
    expect(migration).toContain(
      "and session.session_digest = p_session_digest",
    );
    expect(migration).toContain("and session.owner_id = v_owner");
    expect(migration).toContain("and session.role = 'OWNER'");
    expect(migration).toContain("and session.revoked_at is null");
    expect(migration).toContain(
      "and session.created_at <= p_verified_at",
    );
    expect(migration).toContain(
      "and session.expires_at > p_verified_at",
    );
    expect(migration).toContain(
      "and session.expires_at > statement_timestamp()",
    );
    expect(migration).toContain("and tenant.status = 'ACTIVE'");
    expect(migration).toContain(
      "and owner_identity.status = 'ACTIVE'",
    );
    expect(migration).toContain("and membership.status = 'ACTIVE'");
    expect(migration).toContain("and membership.role = 'OWNER'");
    expect(migration).toContain(
      "and session.authority_epoch = membership.authority_epoch",
    );
    expect(migration).toContain(
      "for share of session, membership, tenant, owner_identity",
    );
    expect(migration).toContain(
      "or p_verified_at > statement_timestamp()",
    );
  });

  it("enforces exact tenant inquiry and monotonic chain time", () => {
    expect(migration).toContain(
      "and inquiry.tenant_id = v_tenant",
    );
    expect(migration).toContain(
      "and inquiry.created_at <= p_verified_at",
    );
    expect(migration).toContain(
      "and qualified.verified_at <= p_verified_at",
    );
    expect(migration).toContain(
      "and quotation.verified_at <= p_verified_at",
    );
    expect(migration).toContain(
      "and confirmed_order.verified_at <= p_verified_at",
    );
    expect(migration).toContain(
      "'qualified-lead-evidence-unavailable'::text",
    );
    expect(migration).toContain(
      "'quotation-evidence-unavailable'::text",
    );
    expect(migration).toContain(
      "'order-evidence-unavailable'::text",
    );
  });

  it("rejects mutation and allows service-role function execution only", () => {
    expect(migration).toContain(
      "before update or delete on public.nexus_founder_commercial_evidence",
    );
    expect(migration).toContain(
      "raise exception 'founder commercial evidence is append-only'",
    );
    expect(migration).toContain(
      "revoke all on table public.nexus_founder_commercial_evidence from service_role",
    );
    expect(migration).not.toMatch(
      /grant\s+(select|insert|update|delete)[\s\S]*nexus_founder_commercial_evidence[\s\S]*service_role/i,
    );
    expect(migration).toMatch(
      /grant execute on function public\.nexus_append_founder_commercial_evidence[\s\S]*to service_role/i,
    );
    expect(migration).toMatch(
      /revoke all on function public\.nexus_append_founder_commercial_evidence[\s\S]*from authenticated/i,
    );
    expect(migration).toMatch(
      /revoke all on function public\.nexus_append_founder_commercial_evidence[\s\S]*from anon/i,
    );
  });

  it("keeps the mutation blocker invoker-only with no callable role authority", () => {
    const triggerFunction = migration.match(
      /create or replace function public\.nexus_reject_founder_commercial_evidence_mutation\(\)([\s\S]*?)\$\$;/i,
    )?.[1];

    expect(triggerFunction).toBeDefined();
    expect(triggerFunction).not.toMatch(/\bsecurity\s+definer\b/i);
    expect(migration).toContain(
      "revoke all on function public.nexus_reject_founder_commercial_evidence_mutation() from public",
    );
    expect(migration).toContain(
      "revoke all on function public.nexus_reject_founder_commercial_evidence_mutation() from anon",
    );
    expect(migration).toContain(
      "revoke all on function public.nexus_reject_founder_commercial_evidence_mutation() from authenticated",
    );
    expect(migration).toContain(
      "revoke all on function public.nexus_reject_founder_commercial_evidence_mutation() from service_role",
    );
  });

  it("provides conflict-safe idempotency without granting business authority", () => {
    expect(migration).toContain(
      "on conflict (evidence_id) do nothing",
    );
    expect(migration).toContain(
      "return query select 'binding-conflict'::text",
    );
    expect(migration).toContain(
      "return query select 'already-recorded'::text",
    );
    expect(migration).toContain(
      "Does not authorize customer contact, delivery, order execution, payment execution, provider mutation, or public launch.",
    );
  });
});
