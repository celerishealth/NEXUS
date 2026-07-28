begin;

create table if not exists public.nexus_founder_commercial_evidence (
    evidence_id uuid primary key,
    tenant_id varchar(128) not null,
    owner_id varchar(128) not null,
    session_id varchar(128) not null,
    authority_epoch varchar(128) not null,
    inquiry_id uuid not null,
    evidence_kind varchar(32) not null,
    quotation_id varchar(200),
    order_id varchar(200),
    payment_id varchar(200),
    amount_minor bigint,
    currency_code char(3),
    buyer_requirement_verified boolean,
    buyer_intent_verified boolean,
    fake_or_irrelevant_lead_excluded boolean,
    owner_approved boolean,
    customer_delivery_verified boolean,
    owner_confirmed boolean,
    customer_acceptance_verified boolean,
    payment_receipt_verified boolean,
    verified_at timestamptz not null,
    evidence_payload_hash char(64) not null,
    created_at timestamptz not null default timezone('utc', now()),

    constraint nexus_founder_commercial_evidence_membership_fk
        foreign key (tenant_id, owner_id)
        references public.nexus_tenant_owner_membership (tenant_id, owner_id)
        on delete restrict,

    constraint nexus_founder_commercial_evidence_inquiry_fk
        foreign key (inquiry_id)
        references public.nexus_controlled_customer_inquiries (inquiry_id)
        on delete restrict,

    constraint nexus_founder_commercial_evidence_identity_valid check (
        length(trim(tenant_id)) between 1 and 128
        and length(trim(owner_id)) between 1 and 128
        and session_id ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{7,127}$'
        and length(trim(authority_epoch)) between 1 and 128
        and evidence_payload_hash ~ '^[a-f0-9]{64}$'
    ),

    constraint nexus_founder_commercial_evidence_kind_valid check (
        evidence_kind in (
            'qualified-lead',
            'quotation-issued',
            'order-confirmed',
            'payment-received'
        )
    ),

    constraint nexus_founder_commercial_evidence_payload_valid check (
        (
            evidence_kind = 'qualified-lead'
            and buyer_requirement_verified is true
            and buyer_intent_verified is true
            and fake_or_irrelevant_lead_excluded is true
            and quotation_id is null
            and order_id is null
            and payment_id is null
            and amount_minor is null
            and currency_code is null
            and owner_approved is null
            and customer_delivery_verified is null
            and owner_confirmed is null
            and customer_acceptance_verified is null
            and payment_receipt_verified is null
        )
        or (
            evidence_kind = 'quotation-issued'
            and quotation_id is not null
            and length(trim(quotation_id)) between 1 and 200
            and owner_approved is true
            and customer_delivery_verified is true
            and order_id is null
            and payment_id is null
            and amount_minor is null
            and currency_code is null
            and buyer_requirement_verified is null
            and buyer_intent_verified is null
            and fake_or_irrelevant_lead_excluded is null
            and owner_confirmed is null
            and customer_acceptance_verified is null
            and payment_receipt_verified is null
        )
        or (
            evidence_kind = 'order-confirmed'
            and quotation_id is not null
            and length(trim(quotation_id)) between 1 and 200
            and order_id is not null
            and length(trim(order_id)) between 1 and 200
            and owner_confirmed is true
            and customer_acceptance_verified is true
            and payment_id is null
            and amount_minor is null
            and currency_code is null
            and buyer_requirement_verified is null
            and buyer_intent_verified is null
            and fake_or_irrelevant_lead_excluded is null
            and owner_approved is null
            and customer_delivery_verified is null
            and payment_receipt_verified is null
        )
        or (
            evidence_kind = 'payment-received'
            and order_id is not null
            and length(trim(order_id)) between 1 and 200
            and payment_id is not null
            and length(trim(payment_id)) between 1 and 200
            and amount_minor between 1 and 9007199254740991
            and currency_code ~ '^[A-Z]{3}$'
            and payment_receipt_verified is true
            and quotation_id is null
            and buyer_requirement_verified is null
            and buyer_intent_verified is null
            and fake_or_irrelevant_lead_excluded is null
            and owner_approved is null
            and customer_delivery_verified is null
            and owner_confirmed is null
            and customer_acceptance_verified is null
        )
    )
);

create unique index if not exists nexus_founder_commercial_evidence_qualified_inquiry_uq
on public.nexus_founder_commercial_evidence (tenant_id, owner_id, inquiry_id)
where evidence_kind = 'qualified-lead';

create unique index if not exists nexus_founder_commercial_evidence_quotation_uq
on public.nexus_founder_commercial_evidence (tenant_id, owner_id, quotation_id)
where quotation_id is not null;

create unique index if not exists nexus_founder_commercial_evidence_order_uq
on public.nexus_founder_commercial_evidence (tenant_id, owner_id, order_id)
where order_id is not null;

create unique index if not exists nexus_founder_commercial_evidence_payment_uq
on public.nexus_founder_commercial_evidence (tenant_id, owner_id, payment_id)
where payment_id is not null;

create index if not exists nexus_founder_commercial_evidence_tenant_time_idx
on public.nexus_founder_commercial_evidence (tenant_id, owner_id, verified_at desc);

alter table public.nexus_founder_commercial_evidence enable row level security;
alter table public.nexus_founder_commercial_evidence force row level security;
revoke all on table public.nexus_founder_commercial_evidence from public;

do $$
begin
    if exists (select 1 from pg_roles where rolname = 'anon') then
        execute 'revoke all on table public.nexus_founder_commercial_evidence from anon';
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
        execute 'revoke all on table public.nexus_founder_commercial_evidence from authenticated';
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
        execute 'revoke all on table public.nexus_founder_commercial_evidence from service_role';
    end if;
end
$$;

create or replace function public.nexus_reject_founder_commercial_evidence_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    raise exception 'founder commercial evidence is append-only';
end;
$$;

revoke all on function public.nexus_reject_founder_commercial_evidence_mutation() from public;

drop trigger if exists nexus_founder_commercial_evidence_append_only
on public.nexus_founder_commercial_evidence;

create trigger nexus_founder_commercial_evidence_append_only
before update or delete on public.nexus_founder_commercial_evidence
for each row execute function public.nexus_reject_founder_commercial_evidence_mutation();

create or replace function public.nexus_append_founder_commercial_evidence(
    p_evidence_id uuid,
    p_tenant_id text,
    p_owner_id text,
    p_session_digest text,
    p_inquiry_id uuid,
    p_evidence_kind text,
    p_quotation_id text,
    p_order_id text,
    p_payment_id text,
    p_amount_minor bigint,
    p_currency_code text,
    p_buyer_requirement_verified boolean,
    p_buyer_intent_verified boolean,
    p_fake_or_irrelevant_lead_excluded boolean,
    p_owner_approved boolean,
    p_customer_delivery_verified boolean,
    p_owner_confirmed boolean,
    p_customer_acceptance_verified boolean,
    p_payment_receipt_verified boolean,
    p_verified_at timestamptz,
    p_evidence_payload_hash text
)
returns table (status text, stored_evidence_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_tenant text := trim(p_tenant_id);
    v_owner text := trim(p_owner_id);
    v_kind text := trim(p_evidence_kind);
    v_quotation text := nullif(trim(p_quotation_id), '');
    v_order text := nullif(trim(p_order_id), '');
    v_payment text := nullif(trim(p_payment_id), '');
    v_currency text := nullif(upper(trim(p_currency_code)), '');
    v_session record;
    v_existing public.nexus_founder_commercial_evidence%rowtype;
    v_inserted integer := 0;
begin
    if p_evidence_id is null
        or p_tenant_id is null or length(v_tenant) not between 1 and 128
        or p_owner_id is null or length(v_owner) not between 1 and 128
        or p_session_digest is null or p_session_digest !~ '^[a-f0-9]{64}$'
        or p_inquiry_id is null
        or v_kind not in ('qualified-lead', 'quotation-issued', 'order-confirmed', 'payment-received')
        or p_verified_at is null
        or p_verified_at > statement_timestamp()
        or p_evidence_payload_hash is null
        or p_evidence_payload_hash !~ '^[a-f0-9]{64}$'
    then
        raise exception 'invalid founder commercial evidence input';
    end if;

    select session.session_id, session.authority_epoch
    into v_session
    from public.nexus_authenticated_owner_sessions as session
    inner join public.nexus_tenant_owner_membership as membership
        on membership.tenant_id = session.tenant_id
        and membership.owner_id = session.owner_id
    inner join public.nexus_tenant as tenant
        on tenant.tenant_id = membership.tenant_id
    inner join public.nexus_owner_identity as owner_identity
        on owner_identity.owner_id = membership.owner_id
    where session.tenant_id = v_tenant
        and session.owner_id = v_owner
        and session.session_digest = p_session_digest
        and session.role = 'OWNER'
        and session.revoked_at is null
        and session.created_at <= p_verified_at
        and session.expires_at > p_verified_at
        and session.expires_at > statement_timestamp()
        and tenant.status = 'ACTIVE'
        and owner_identity.status = 'ACTIVE'
        and membership.status = 'ACTIVE'
        and membership.role = 'OWNER'
        and session.authority_epoch = membership.authority_epoch
        and length(trim(membership.authority_epoch)) > 0
    limit 1
    for share of session, membership, tenant, owner_identity;

    if not found then
        return query select 'owner-session-unavailable'::text, null::uuid;
        return;
    end if;

    perform 1
    from public.nexus_controlled_customer_inquiries as inquiry
    where inquiry.inquiry_id = p_inquiry_id
        and inquiry.tenant_id = v_tenant
        and inquiry.created_at <= p_verified_at;

    if not found then
        return query select 'inquiry-unavailable'::text, null::uuid;
        return;
    end if;

    if v_kind = 'qualified-lead' then
        if p_buyer_requirement_verified is distinct from true
            or p_buyer_intent_verified is distinct from true
            or p_fake_or_irrelevant_lead_excluded is distinct from true
            or v_quotation is not null or v_order is not null or v_payment is not null
            or p_amount_minor is not null or v_currency is not null
            or p_owner_approved is not null or p_customer_delivery_verified is not null
            or p_owner_confirmed is not null or p_customer_acceptance_verified is not null
            or p_payment_receipt_verified is not null
        then raise exception 'invalid qualified lead evidence'; end if;
    elsif v_kind = 'quotation-issued' then
        if v_quotation is null or length(v_quotation) > 200
            or p_owner_approved is distinct from true
            or p_customer_delivery_verified is distinct from true
            or v_order is not null or v_payment is not null
            or p_amount_minor is not null or v_currency is not null
            or p_buyer_requirement_verified is not null or p_buyer_intent_verified is not null
            or p_fake_or_irrelevant_lead_excluded is not null
            or p_owner_confirmed is not null or p_customer_acceptance_verified is not null
            or p_payment_receipt_verified is not null
        then raise exception 'invalid quotation evidence'; end if;

        perform 1 from public.nexus_founder_commercial_evidence as qualified
        where qualified.tenant_id = v_tenant and qualified.owner_id = v_owner
            and qualified.inquiry_id = p_inquiry_id
            and qualified.evidence_kind = 'qualified-lead'
            and qualified.verified_at <= p_verified_at;
        if not found then
            return query select 'qualified-lead-evidence-unavailable'::text, null::uuid;
            return;
        end if;
    elsif v_kind = 'order-confirmed' then
        if v_quotation is null or length(v_quotation) > 200
            or v_order is null or length(v_order) > 200
            or p_owner_confirmed is distinct from true
            or p_customer_acceptance_verified is distinct from true
            or v_payment is not null or p_amount_minor is not null or v_currency is not null
            or p_buyer_requirement_verified is not null or p_buyer_intent_verified is not null
            or p_fake_or_irrelevant_lead_excluded is not null
            or p_owner_approved is not null or p_customer_delivery_verified is not null
            or p_payment_receipt_verified is not null
        then raise exception 'invalid order evidence'; end if;

        perform 1 from public.nexus_founder_commercial_evidence as quotation
        where quotation.tenant_id = v_tenant and quotation.owner_id = v_owner
            and quotation.inquiry_id = p_inquiry_id
            and quotation.evidence_kind = 'quotation-issued'
            and quotation.quotation_id = v_quotation
            and quotation.verified_at <= p_verified_at;
        if not found then
            return query select 'quotation-evidence-unavailable'::text, null::uuid;
            return;
        end if;
    else
        if v_order is null or length(v_order) > 200
            or v_payment is null or length(v_payment) > 200
            or p_amount_minor is null or p_amount_minor < 1 or p_amount_minor > 9007199254740991
            or v_currency is null or v_currency !~ '^[A-Z]{3}$'
            or p_payment_receipt_verified is distinct from true
            or v_quotation is not null
            or p_buyer_requirement_verified is not null or p_buyer_intent_verified is not null
            or p_fake_or_irrelevant_lead_excluded is not null
            or p_owner_approved is not null or p_customer_delivery_verified is not null
            or p_owner_confirmed is not null or p_customer_acceptance_verified is not null
        then raise exception 'invalid payment evidence'; end if;

        perform 1 from public.nexus_founder_commercial_evidence as confirmed_order
        where confirmed_order.tenant_id = v_tenant and confirmed_order.owner_id = v_owner
            and confirmed_order.inquiry_id = p_inquiry_id
            and confirmed_order.evidence_kind = 'order-confirmed'
            and confirmed_order.order_id = v_order
            and confirmed_order.verified_at <= p_verified_at;
        if not found then
            return query select 'order-evidence-unavailable'::text, null::uuid;
            return;
        end if;
    end if;

    insert into public.nexus_founder_commercial_evidence (
        evidence_id, tenant_id, owner_id, session_id, authority_epoch,
        inquiry_id, evidence_kind, quotation_id, order_id, payment_id,
        amount_minor, currency_code, buyer_requirement_verified,
        buyer_intent_verified, fake_or_irrelevant_lead_excluded,
        owner_approved, customer_delivery_verified, owner_confirmed,
        customer_acceptance_verified, payment_receipt_verified,
        verified_at, evidence_payload_hash
    ) values (
        p_evidence_id, v_tenant, v_owner, v_session.session_id,
        v_session.authority_epoch, p_inquiry_id, v_kind, v_quotation,
        v_order, v_payment, p_amount_minor, v_currency,
        p_buyer_requirement_verified, p_buyer_intent_verified,
        p_fake_or_irrelevant_lead_excluded, p_owner_approved,
        p_customer_delivery_verified, p_owner_confirmed,
        p_customer_acceptance_verified, p_payment_receipt_verified,
        p_verified_at, p_evidence_payload_hash
    )
    on conflict (evidence_id) do nothing;

    get diagnostics v_inserted = row_count;
    if v_inserted = 1 then
        return query select 'recorded'::text, p_evidence_id;
        return;
    end if;

    select * into v_existing
    from public.nexus_founder_commercial_evidence
    where evidence_id = p_evidence_id;

    if not found then
        raise exception 'commercial evidence unavailable after conflict';
    end if;

    if v_existing.tenant_id <> v_tenant
        or v_existing.owner_id <> v_owner
        or v_existing.session_id <> v_session.session_id
        or v_existing.authority_epoch <> v_session.authority_epoch
        or v_existing.inquiry_id <> p_inquiry_id
        or v_existing.evidence_kind <> v_kind
        or v_existing.quotation_id is distinct from v_quotation
        or v_existing.order_id is distinct from v_order
        or v_existing.payment_id is distinct from v_payment
        or v_existing.amount_minor is distinct from p_amount_minor
        or v_existing.currency_code is distinct from v_currency
        or v_existing.buyer_requirement_verified is distinct from p_buyer_requirement_verified
        or v_existing.buyer_intent_verified is distinct from p_buyer_intent_verified
        or v_existing.fake_or_irrelevant_lead_excluded is distinct from p_fake_or_irrelevant_lead_excluded
        or v_existing.owner_approved is distinct from p_owner_approved
        or v_existing.customer_delivery_verified is distinct from p_customer_delivery_verified
        or v_existing.owner_confirmed is distinct from p_owner_confirmed
        or v_existing.customer_acceptance_verified is distinct from p_customer_acceptance_verified
        or v_existing.payment_receipt_verified is distinct from p_payment_receipt_verified
        or v_existing.verified_at <> p_verified_at
        or v_existing.evidence_payload_hash <> p_evidence_payload_hash
    then
        return query select 'binding-conflict'::text, v_existing.evidence_id;
        return;
    end if;

    return query select 'already-recorded'::text, v_existing.evidence_id;
end;
$$;

revoke all on function public.nexus_append_founder_commercial_evidence(
    uuid, text, text, text, uuid, text, text, text, text, bigint, text,
    boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean,
    timestamptz, text
) from public;

do $$
begin
    if exists (select 1 from pg_roles where rolname = 'anon') then
        execute 'revoke all on function public.nexus_append_founder_commercial_evidence(uuid,text,text,text,uuid,text,text,text,text,bigint,text,boolean,boolean,boolean,boolean,boolean,boolean,boolean,boolean,timestamptz,text) from anon';
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
        execute 'revoke all on function public.nexus_append_founder_commercial_evidence(uuid,text,text,text,uuid,text,text,text,text,bigint,text,boolean,boolean,boolean,boolean,boolean,boolean,boolean,boolean,timestamptz,text) from authenticated';
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
        execute 'grant execute on function public.nexus_append_founder_commercial_evidence(uuid,text,text,text,uuid,text,text,text,text,bigint,text,boolean,boolean,boolean,boolean,boolean,boolean,boolean,boolean,timestamptz,text) to service_role';
    end if;
end
$$;

comment on table public.nexus_founder_commercial_evidence is
    'Append-only exact-tenant, exact-owner, session-authority-bound commercial proof without customer identity or inquiry message content.';

comment on function public.nexus_append_founder_commercial_evidence(
    uuid, text, text, text, uuid, text, text, text, text, bigint, text,
    boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean,
    timestamptz, text
) is
    'Server-only append path for verified qualified-lead, quotation, order, and payment evidence. Does not authorize customer contact, delivery, order execution, payment execution, provider mutation, or public launch.';

commit;
