begin;

create table if not exists
    public.nexus_controlled_customer_recommendation_decisions (
        decision_id uuid primary key,
        tenant_id text not null,
        inquiry_id uuid not null,
        recommendation_id uuid not null,
        owner_id text not null,
        session_id text,
        decision text not null,
        decision_reason text not null,
        recommendation_input_fingerprint text not null,
        recommendation_content_hash text not null,
        decided_at_epoch bigint not null,
        created_at timestamptz not null
            default timezone('utc', now()),

        constraint nexus_owner_decision_inquiry_fk
            foreign key (inquiry_id)
            references public.nexus_controlled_customer_inquiries (
                inquiry_id
            )
            on delete restrict,

        constraint nexus_owner_decision_recommendation_fk
            foreign key (recommendation_id)
            references public.nexus_controlled_customer_recommendations (
                recommendation_id
            )
            on delete restrict,

        constraint nexus_owner_decision_tenant_not_blank
            check (length(trim(tenant_id)) > 0),

        constraint nexus_owner_decision_owner_not_blank
            check (length(trim(owner_id)) > 0),

        constraint nexus_owner_decision_value_valid
            check (
                decision in (
                    'approve',
                    'reject'
                )
            ),

        constraint nexus_owner_decision_reason_valid
            check (
                length(trim(decision_reason))
                between 1 and 1000
            ),

        constraint nexus_owner_decision_input_fingerprint_valid
            check (
                recommendation_input_fingerprint
                ~ '^[a-f0-9]{64}$'
            ),

        constraint nexus_owner_decision_content_hash_valid
            check (
                recommendation_content_hash
                ~ '^[a-f0-9]{64}$'
            ),

        constraint nexus_owner_decision_time_valid
            check (decided_at_epoch >= 0),

        constraint nexus_owner_decision_one_per_recommendation
            unique (
                tenant_id,
                recommendation_id
            )
    );

create index if not exists
    nexus_owner_decision_tenant_time_idx
on public.nexus_controlled_customer_recommendation_decisions (
    tenant_id,
    decided_at_epoch desc
);

create index if not exists
    nexus_owner_decision_inquiry_idx
on public.nexus_controlled_customer_recommendation_decisions (
    tenant_id,
    inquiry_id
);

alter table
    public.nexus_controlled_customer_recommendation_decisions
enable row level security;

alter table
    public.nexus_controlled_customer_recommendation_decisions
force row level security;

revoke all
on table
    public.nexus_controlled_customer_recommendation_decisions
from public;

do $$
begin
    if exists (
        select 1
        from pg_roles
        where rolname = 'anon'
    ) then
        execute '
            revoke all
            on table public.nexus_controlled_customer_recommendation_decisions
            from anon
        ';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'authenticated'
    ) then
        execute '
            revoke all
            on table public.nexus_controlled_customer_recommendation_decisions
            from authenticated
        ';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'service_role'
    ) then
        execute '
            grant select, insert
            on table public.nexus_controlled_customer_recommendation_decisions
            to service_role
        ';
    end if;
end
$$;

create or replace function
    public.nexus_decide_controlled_customer_recommendation(
        p_decision_id uuid,
        p_tenant_id text,
        p_inquiry_id uuid,
        p_recommendation_id uuid,
        p_owner_id text,
        p_session_id text,
        p_decision text,
        p_decision_reason text,
        p_recommendation_text text,
        p_rationale text,
        p_confidence numeric,
        p_risk_flags jsonb,
        p_recommendation_input_fingerprint text,
        p_recommendation_content_hash text,
        p_decided_at_epoch bigint
    )
returns table (
    status text,
    decision_id uuid,
    stored_decision text,
    recommendation_status text,
    inquiry_status text,
    stored_decided_at_epoch bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    recommendation_record
        public.nexus_controlled_customer_recommendations%rowtype;

    inquiry_record
        public.nexus_controlled_customer_inquiries%rowtype;

    existing_decision
        public.nexus_controlled_customer_recommendation_decisions%rowtype;

    target_status text;
    inserted_count integer := 0;
    updated_count integer := 0;
begin
    if p_decision_id is null
        or p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_inquiry_id is null
        or p_recommendation_id is null
        or p_owner_id is null
        or length(trim(p_owner_id)) = 0
        or p_decision not in (
            'approve',
            'reject'
        )
        or p_decision_reason is null
        or length(trim(p_decision_reason)) < 1
        or length(trim(p_decision_reason)) > 1000
        or p_recommendation_text is null
        or length(trim(p_recommendation_text)) < 1
        or length(trim(p_recommendation_text)) > 4000
        or p_rationale is null
        or length(trim(p_rationale)) < 1
        or length(trim(p_rationale)) > 4000
        or p_confidence is null
        or p_confidence < 0
        or p_confidence > 1
        or p_risk_flags is null
        or jsonb_typeof(p_risk_flags) <> 'array'
        or p_recommendation_input_fingerprint is null
        or p_recommendation_input_fingerprint
            !~ '^[a-f0-9]{64}$'
        or p_recommendation_content_hash is null
        or p_recommendation_content_hash
            !~ '^[a-f0-9]{64}$'
        or p_decided_at_epoch is null
        or p_decided_at_epoch < 0
    then
        raise exception
            'invalid customer recommendation owner decision input';
    end if;

    target_status :=
        case
            when p_decision = 'approve'
                then 'approved'
            else 'rejected'
        end;

    /*
     * Lock the exact tenant recommendation and inquiry.
     */
    select recommendation.*
    into recommendation_record
    from public.nexus_controlled_customer_recommendations
        as recommendation
    where recommendation.recommendation_id =
            p_recommendation_id
        and recommendation.tenant_id =
            trim(p_tenant_id)
    for update;

    if not found then
        return query
        select
            'recommendation-unavailable'::text,
            null::uuid,
            null::text,
            null::text,
            null::text,
            null::bigint;

        return;
    end if;

    select inquiry.*
    into inquiry_record
    from public.nexus_controlled_customer_inquiries
        as inquiry
    where inquiry.inquiry_id =
            p_inquiry_id
        and inquiry.tenant_id =
            trim(p_tenant_id)
    for update;

    if not found then
        return query
        select
            'inquiry-unavailable'::text,
            null::uuid,
            null::text,
            recommendation_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    /*
     * The decision must match the exact persisted recommendation.
     */
    if recommendation_record.inquiry_id <>
            p_inquiry_id
        or recommendation_record.recommendation_text <>
            trim(p_recommendation_text)
        or recommendation_record.rationale <>
            trim(p_rationale)
        or recommendation_record.confidence <>
            p_confidence
        or recommendation_record.risk_flags <>
            p_risk_flags
        or recommendation_record.input_fingerprint <>
            p_recommendation_input_fingerprint
    then
        return query
        select
            'recommendation-snapshot-conflict'::text,
            null::uuid,
            null::text,
            recommendation_record.status,
            inquiry_record.status,
            null::bigint;

        return;
    end if;

    /*
     * Check for an existing owner decision before validating
     * owner-review state so safe retries remain idempotent.
     */
    select owner_decision.*
    into existing_decision
    from public.nexus_controlled_customer_recommendation_decisions
        as owner_decision
    where owner_decision.tenant_id =
            trim(p_tenant_id)
        and owner_decision.recommendation_id =
            p_recommendation_id;

    if found then
        if existing_decision.inquiry_id =
                p_inquiry_id
            and existing_decision.owner_id =
                trim(p_owner_id)
            and existing_decision.decision =
                p_decision
            and existing_decision.decision_reason =
                trim(p_decision_reason)
            and existing_decision.recommendation_input_fingerprint =
                p_recommendation_input_fingerprint
            and existing_decision.recommendation_content_hash =
                p_recommendation_content_hash
            and recommendation_record.status =
                target_status
            and inquiry_record.status =
                target_status
        then
            return query
            select
                'already-decided'::text,
                existing_decision.decision_id,
                existing_decision.decision,
                recommendation_record.status,
                inquiry_record.status,
                existing_decision.decided_at_epoch;

            return;
        end if;

        return query
        select
            'decision-conflict'::text,
            existing_decision.decision_id,
            existing_decision.decision,
            recommendation_record.status,
            inquiry_record.status,
            existing_decision.decided_at_epoch;

        return;
    end if;

    if recommendation_record.status <>
        'owner-review'
    then
        return query
        select
            'recommendation-state-conflict'::text,
            null::uuid,
            null::text,
            recommendation_record.status,
            inquiry_record.status,
            null::bigint;

        return;
    end if;

    if inquiry_record.status <>
        'owner-review'
    then
        return query
        select
            'inquiry-state-conflict'::text,
            null::uuid,
            null::text,
            recommendation_record.status,
            inquiry_record.status,
            null::bigint;

        return;
    end if;

    insert into
        public.nexus_controlled_customer_recommendation_decisions (
            decision_id,
            tenant_id,
            inquiry_id,
            recommendation_id,
            owner_id,
            session_id,
            decision,
            decision_reason,
            recommendation_input_fingerprint,
            recommendation_content_hash,
            decided_at_epoch
        )
    values (
        p_decision_id,
        trim(p_tenant_id),
        p_inquiry_id,
        p_recommendation_id,
        trim(p_owner_id),
        nullif(trim(p_session_id), ''),
        p_decision,
        trim(p_decision_reason),
        p_recommendation_input_fingerprint,
        p_recommendation_content_hash,
        p_decided_at_epoch
    )
    on conflict (
        tenant_id,
        recommendation_id
    )
    do nothing;

    get diagnostics inserted_count = row_count;

    if inserted_count <> 1 then
        return query
        select
            'decision-conflict'::text,
            null::uuid,
            null::text,
            recommendation_record.status,
            inquiry_record.status,
            null::bigint;

        return;
    end if;

    update
        public.nexus_controlled_customer_recommendations
    set
        status = target_status
    where recommendation_id =
            p_recommendation_id
        and tenant_id =
            trim(p_tenant_id)
        and status = 'owner-review';

    get diagnostics updated_count = row_count;

    if updated_count <> 1 then
        raise exception
            'recommendation owner decision transition failed';
    end if;

    update
        public.nexus_controlled_customer_inquiries
    set
        status = target_status
    where inquiry_id =
            p_inquiry_id
        and tenant_id =
            trim(p_tenant_id)
        and status = 'owner-review';

    get diagnostics updated_count = row_count;

    if updated_count <> 1 then
        raise exception
            'inquiry owner decision transition failed';
    end if;

    return query
    select
        'decided'::text,
        p_decision_id,
        p_decision,
        target_status,
        target_status,
        p_decided_at_epoch;
end;
$$;

revoke all
on function
    public.nexus_decide_controlled_customer_recommendation(
        uuid,
        text,
        uuid,
        uuid,
        text,
        text,
        text,
        text,
        text,
        text,
        numeric,
        jsonb,
        text,
        text,
        bigint
    )
from public;

do $$
begin
    if exists (
        select 1
        from pg_roles
        where rolname = 'anon'
    ) then
        execute '
            revoke all
            on function public.nexus_decide_controlled_customer_recommendation(
                uuid,
                text,
                uuid,
                uuid,
                text,
                text,
                text,
                text,
                text,
                text,
                numeric,
                jsonb,
                text,
                text,
                bigint
            )
            from anon
        ';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'authenticated'
    ) then
        execute '
            revoke all
            on function public.nexus_decide_controlled_customer_recommendation(
                uuid,
                text,
                uuid,
                uuid,
                text,
                text,
                text,
                text,
                text,
                text,
                numeric,
                jsonb,
                text,
                text,
                bigint
            )
            from authenticated
        ';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'service_role'
    ) then
        execute '
            grant execute
            on function public.nexus_decide_controlled_customer_recommendation(
                uuid,
                text,
                uuid,
                uuid,
                text,
                text,
                text,
                text,
                text,
                text,
                numeric,
                jsonb,
                text,
                text,
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_customer_recommendation_decisions
is
    'Immutable tenant-owner approval or rejection decisions for exact sandbox recommendation snapshots.';

comment on function
    public.nexus_decide_controlled_customer_recommendation(
        uuid,
        text,
        uuid,
        uuid,
        text,
        text,
        text,
        text,
        text,
        text,
        numeric,
        jsonb,
        text,
        text,
        bigint
    )
is
    'Atomically records one authenticated owner decision and transitions the exact tenant recommendation and inquiry without executing it.';

commit;
