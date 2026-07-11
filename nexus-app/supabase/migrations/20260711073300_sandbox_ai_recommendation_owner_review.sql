begin;

create table if not exists
    public.nexus_controlled_customer_recommendations (
        recommendation_id uuid primary key,
        tenant_id text not null,
        inquiry_id uuid not null,
        provider_mode text not null,
        provider_name text not null,
        model_name text not null,
        recommendation_text text not null,
        rationale text not null,
        confidence numeric(5,4) not null,
        risk_flags jsonb not null default '[]'::jsonb,
        input_fingerprint text not null,
        status text not null default 'owner-review',
        created_at_epoch bigint not null,
        created_at timestamptz not null
            default timezone('utc', now()),

        constraint nexus_recommendation_inquiry_fk
            foreign key (inquiry_id)
            references public.nexus_controlled_customer_inquiries (
                inquiry_id
            )
            on delete restrict,

        constraint nexus_recommendation_tenant_not_blank
            check (length(trim(tenant_id)) > 0),

        constraint nexus_recommendation_sandbox_only
            check (provider_mode = 'sandbox'),

        constraint nexus_recommendation_provider_not_blank
            check (
                length(trim(provider_name))
                between 1 and 100
            ),

        constraint nexus_recommendation_model_not_blank
            check (
                length(trim(model_name))
                between 1 and 100
            ),

        constraint nexus_recommendation_text_valid
            check (
                length(trim(recommendation_text))
                between 1 and 4000
            ),

        constraint nexus_recommendation_rationale_valid
            check (
                length(trim(rationale))
                between 1 and 4000
            ),

        constraint nexus_recommendation_confidence_valid
            check (
                confidence >= 0
                and confidence <= 1
            ),

        constraint nexus_recommendation_risk_flags_array
            check (
                jsonb_typeof(risk_flags) = 'array'
            ),

        constraint nexus_recommendation_fingerprint_valid
            check (
                input_fingerprint ~ '^[a-f0-9]{64}$'
            ),

        constraint nexus_recommendation_status_valid
            check (
                status in (
                    'owner-review',
                    'approved',
                    'rejected'
                )
            ),

        constraint nexus_recommendation_created_time_valid
            check (created_at_epoch >= 0),

        constraint nexus_recommendation_input_unique
            unique (
                tenant_id,
                inquiry_id,
                input_fingerprint
            )
    );

create index if not exists
    nexus_recommendation_tenant_status_time_idx
on public.nexus_controlled_customer_recommendations (
    tenant_id,
    status,
    created_at_epoch desc
);

create index if not exists
    nexus_recommendation_tenant_inquiry_idx
on public.nexus_controlled_customer_recommendations (
    tenant_id,
    inquiry_id
);

alter table
    public.nexus_controlled_customer_recommendations
enable row level security;

alter table
    public.nexus_controlled_customer_recommendations
force row level security;

revoke all
on table public.nexus_controlled_customer_recommendations
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
            on table public.nexus_controlled_customer_recommendations
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
            on table public.nexus_controlled_customer_recommendations
            from authenticated
        ';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'service_role'
    ) then
        execute '
            grant select, insert, update
            on table public.nexus_controlled_customer_recommendations
            to service_role
        ';
    end if;
end
$$;

create or replace function
    public.nexus_create_sandbox_customer_recommendation(
        p_recommendation_id uuid,
        p_tenant_id text,
        p_inquiry_id uuid,
        p_inquiry_message text,
        p_provider_mode text,
        p_provider_name text,
        p_model_name text,
        p_recommendation_text text,
        p_rationale text,
        p_confidence numeric,
        p_risk_flags jsonb,
        p_input_fingerprint text,
        p_created_at_epoch bigint
    )
returns table (
    status text,
    recommendation_id uuid,
    inquiry_status text,
    stored_created_at_epoch bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inquiry_record
        public.nexus_controlled_customer_inquiries%rowtype;

    existing_recommendation
        public.nexus_controlled_customer_recommendations%rowtype;

    inserted_count integer := 0;
    updated_count integer := 0;
begin
    if p_recommendation_id is null
        or p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_inquiry_id is null
        or p_inquiry_message is null
        or length(trim(p_inquiry_message)) < 1
        or length(trim(p_inquiry_message)) > 4000
        or p_provider_mode <> 'sandbox'
        or p_provider_name is null
        or length(trim(p_provider_name)) < 1
        or length(trim(p_provider_name)) > 100
        or p_model_name is null
        or length(trim(p_model_name)) < 1
        or length(trim(p_model_name)) > 100
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
        or p_input_fingerprint is null
        or p_input_fingerprint !~ '^[a-f0-9]{64}$'
        or p_created_at_epoch is null
        or p_created_at_epoch < 0
    then
        raise exception
            'invalid sandbox customer recommendation input';
    end if;

    /*
     * Lock the exact tenant inquiry and verify that the caller's
     * immutable inquiry snapshot matches persistent storage.
     */
    select inquiry.*
    into inquiry_record
    from public.nexus_controlled_customer_inquiries
        as inquiry
    where inquiry.inquiry_id = p_inquiry_id
        and inquiry.tenant_id = trim(p_tenant_id)
    for update;

    if not found then
        return query
        select
            'inquiry-unavailable'::text,
            null::uuid,
            null::text,
            null::bigint;

        return;
    end if;

    if inquiry_record.message <> trim(p_inquiry_message) then
        return query
        select
            'inquiry-snapshot-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::bigint;

        return;
    end if;

    if inquiry_record.status not in (
        'received',
        'recommendation-pending',
        'owner-review'
    ) then
        return query
        select
            'inquiry-state-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::bigint;

        return;
    end if;

    insert into
        public.nexus_controlled_customer_recommendations (
            recommendation_id,
            tenant_id,
            inquiry_id,
            provider_mode,
            provider_name,
            model_name,
            recommendation_text,
            rationale,
            confidence,
            risk_flags,
            input_fingerprint,
            status,
            created_at_epoch
        )
    values (
        p_recommendation_id,
        trim(p_tenant_id),
        p_inquiry_id,
        'sandbox',
        trim(p_provider_name),
        trim(p_model_name),
        trim(p_recommendation_text),
        trim(p_rationale),
        p_confidence,
        p_risk_flags,
        p_input_fingerprint,
        'owner-review',
        p_created_at_epoch
    )
    on conflict (
        tenant_id,
        inquiry_id,
        input_fingerprint
    )
    do nothing;

    get diagnostics inserted_count = row_count;

    if inserted_count = 1 then
        update
            public.nexus_controlled_customer_inquiries
        set
            status = 'owner-review'
        where inquiry_id = p_inquiry_id
            and tenant_id = trim(p_tenant_id)
            and status in (
                'received',
                'recommendation-pending',
                'owner-review'
            );

        get diagnostics updated_count = row_count;

        if updated_count <> 1 then
            raise exception
                'customer inquiry owner-review transition failed';
        end if;

        return query
        select
            'created'::text,
            p_recommendation_id,
            'owner-review'::text,
            p_created_at_epoch;

        return;
    end if;

    select recommendation.*
    into existing_recommendation
    from public.nexus_controlled_customer_recommendations
        as recommendation
    where recommendation.tenant_id =
            trim(p_tenant_id)
        and recommendation.inquiry_id =
            p_inquiry_id
        and recommendation.input_fingerprint =
            p_input_fingerprint;

    if not found then
        raise exception
            'sandbox recommendation unavailable after conflict';
    end if;

    if existing_recommendation.provider_mode <> 'sandbox'
        or existing_recommendation.provider_name <>
            trim(p_provider_name)
        or existing_recommendation.model_name <>
            trim(p_model_name)
        or existing_recommendation.recommendation_text <>
            trim(p_recommendation_text)
        or existing_recommendation.rationale <>
            trim(p_rationale)
        or existing_recommendation.confidence <>
            p_confidence
        or existing_recommendation.risk_flags <>
            p_risk_flags
    then
        return query
        select
            'binding-conflict'::text,
            existing_recommendation.recommendation_id,
            inquiry_record.status,
            existing_recommendation.created_at_epoch;

        return;
    end if;

    if inquiry_record.status <> 'owner-review' then
        update
            public.nexus_controlled_customer_inquiries
        set
            status = 'owner-review'
        where inquiry_id = p_inquiry_id
            and tenant_id = trim(p_tenant_id)
            and status in (
                'received',
                'recommendation-pending'
            );

        get diagnostics updated_count = row_count;

        if updated_count <> 1 then
            return query
            select
                'inquiry-state-conflict'::text,
                existing_recommendation.recommendation_id,
                inquiry_record.status,
                existing_recommendation.created_at_epoch;

            return;
        end if;
    end if;

    return query
    select
        'already-created'::text,
        existing_recommendation.recommendation_id,
        'owner-review'::text,
        existing_recommendation.created_at_epoch;
end;
$$;

revoke all
on function
    public.nexus_create_sandbox_customer_recommendation(
        uuid,
        text,
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
            on function public.nexus_create_sandbox_customer_recommendation(
                uuid,
                text,
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
            on function public.nexus_create_sandbox_customer_recommendation(
                uuid,
                text,
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
            on function public.nexus_create_sandbox_customer_recommendation(
                uuid,
                text,
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
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_customer_recommendations
is
    'Tenant-isolated sandbox AI recommendation drafts requiring explicit owner review before any execution.';

comment on function
    public.nexus_create_sandbox_customer_recommendation(
        uuid,
        text,
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
        bigint
    )
is
    'Atomically persists one sandbox recommendation and transitions the exact tenant inquiry to owner review.';

commit;
