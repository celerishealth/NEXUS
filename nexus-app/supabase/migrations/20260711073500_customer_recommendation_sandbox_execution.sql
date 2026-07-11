begin;

create table if not exists
    public.nexus_controlled_customer_sandbox_executions (
        execution_id uuid primary key,
        tenant_id text not null,
        inquiry_id uuid not null,
        recommendation_id uuid not null,
        decision_id uuid not null,
        owner_id text not null,
        execution_mode text not null,
        executor_name text not null,
        executor_version text not null,
        recommendation_content_hash text not null,
        execution_input_hash text not null,
        response_draft text not null,
        internal_notes text not null,
        risk_flags jsonb not null default '[]'::jsonb,
        status text not null,
        executed_at_epoch bigint not null,
        created_at timestamptz not null
            default timezone('utc', now()),

        constraint nexus_sandbox_execution_inquiry_fk
            foreign key (inquiry_id)
            references public.nexus_controlled_customer_inquiries (
                inquiry_id
            )
            on delete restrict,

        constraint nexus_sandbox_execution_recommendation_fk
            foreign key (recommendation_id)
            references public.nexus_controlled_customer_recommendations (
                recommendation_id
            )
            on delete restrict,

        constraint nexus_sandbox_execution_decision_fk
            foreign key (decision_id)
            references public.nexus_controlled_customer_recommendation_decisions (
                decision_id
            )
            on delete restrict,

        constraint nexus_sandbox_execution_tenant_not_blank
            check (length(trim(tenant_id)) > 0),

        constraint nexus_sandbox_execution_owner_not_blank
            check (length(trim(owner_id)) > 0),

        constraint nexus_sandbox_execution_mode_locked
            check (execution_mode = 'sandbox'),

        constraint nexus_sandbox_execution_executor_valid
            check (
                length(trim(executor_name))
                between 1 and 100
                and length(trim(executor_version))
                between 1 and 100
            ),

        constraint nexus_sandbox_execution_content_hash_valid
            check (
                recommendation_content_hash
                ~ '^[a-f0-9]{64}$'
            ),

        constraint nexus_sandbox_execution_input_hash_valid
            check (
                execution_input_hash
                ~ '^[a-f0-9]{64}$'
            ),

        constraint nexus_sandbox_execution_response_valid
            check (
                length(trim(response_draft))
                between 1 and 4000
            ),

        constraint nexus_sandbox_execution_notes_valid
            check (
                length(trim(internal_notes))
                between 1 and 4000
            ),

        constraint nexus_sandbox_execution_risk_flags_array
            check (
                jsonb_typeof(risk_flags) = 'array'
            ),

        constraint nexus_sandbox_execution_status_locked
            check (status = 'sandbox-executed'),

        constraint nexus_sandbox_execution_time_valid
            check (executed_at_epoch >= 0),

        constraint nexus_sandbox_execution_one_per_recommendation
            unique (
                tenant_id,
                recommendation_id
            ),

        constraint nexus_sandbox_execution_input_unique
            unique (
                tenant_id,
                execution_input_hash
            )
    );

create index if not exists
    nexus_sandbox_execution_tenant_time_idx
on public.nexus_controlled_customer_sandbox_executions (
    tenant_id,
    executed_at_epoch desc
);

create index if not exists
    nexus_sandbox_execution_inquiry_idx
on public.nexus_controlled_customer_sandbox_executions (
    tenant_id,
    inquiry_id
);

alter table
    public.nexus_controlled_customer_sandbox_executions
enable row level security;

alter table
    public.nexus_controlled_customer_sandbox_executions
force row level security;

revoke all
on table public.nexus_controlled_customer_sandbox_executions
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
            on table public.nexus_controlled_customer_sandbox_executions
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
            on table public.nexus_controlled_customer_sandbox_executions
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
            on table public.nexus_controlled_customer_sandbox_executions
            to service_role
        ';
    end if;
end
$$;

create or replace function
    public.nexus_execute_approved_customer_recommendation_sandbox(
        p_execution_id uuid,
        p_tenant_id text,
        p_inquiry_id uuid,
        p_recommendation_id uuid,
        p_decision_id uuid,
        p_owner_id text,
        p_recommendation_text text,
        p_rationale text,
        p_confidence numeric,
        p_recommendation_risk_flags jsonb,
        p_recommendation_input_fingerprint text,
        p_recommendation_content_hash text,
        p_execution_mode text,
        p_executor_name text,
        p_executor_version text,
        p_execution_input_hash text,
        p_response_draft text,
        p_internal_notes text,
        p_execution_risk_flags jsonb,
        p_executed_at_epoch bigint
    )
returns table (
    status text,
    execution_id uuid,
    inquiry_status text,
    execution_status text,
    stored_executed_at_epoch bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inquiry_record
        public.nexus_controlled_customer_inquiries%rowtype;

    recommendation_record
        public.nexus_controlled_customer_recommendations%rowtype;

    decision_record
        public.nexus_controlled_customer_recommendation_decisions%rowtype;

    existing_execution
        public.nexus_controlled_customer_sandbox_executions%rowtype;

    inserted_count integer := 0;
    updated_count integer := 0;
begin
    if p_execution_id is null
        or p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_inquiry_id is null
        or p_recommendation_id is null
        or p_decision_id is null
        or p_owner_id is null
        or length(trim(p_owner_id)) = 0
        or p_recommendation_text is null
        or length(trim(p_recommendation_text)) < 1
        or length(trim(p_recommendation_text)) > 4000
        or p_rationale is null
        or length(trim(p_rationale)) < 1
        or length(trim(p_rationale)) > 4000
        or p_confidence is null
        or p_confidence < 0
        or p_confidence > 1
        or p_recommendation_risk_flags is null
        or jsonb_typeof(p_recommendation_risk_flags) <> 'array'
        or p_recommendation_input_fingerprint is null
        or p_recommendation_input_fingerprint
            !~ '^[a-f0-9]{64}$'
        or p_recommendation_content_hash is null
        or p_recommendation_content_hash
            !~ '^[a-f0-9]{64}$'
        or p_execution_mode <> 'sandbox'
        or p_executor_name is null
        or length(trim(p_executor_name)) < 1
        or length(trim(p_executor_name)) > 100
        or p_executor_version is null
        or length(trim(p_executor_version)) < 1
        or length(trim(p_executor_version)) > 100
        or p_execution_input_hash is null
        or p_execution_input_hash
            !~ '^[a-f0-9]{64}$'
        or p_response_draft is null
        or length(trim(p_response_draft)) < 1
        or length(trim(p_response_draft)) > 4000
        or p_internal_notes is null
        or length(trim(p_internal_notes)) < 1
        or length(trim(p_internal_notes)) > 4000
        or p_execution_risk_flags is null
        or jsonb_typeof(p_execution_risk_flags) <> 'array'
        or p_executed_at_epoch is null
        or p_executed_at_epoch < 0
    then
        raise exception
            'invalid approved recommendation sandbox execution input';
    end if;

    /*
     * Lock the exact tenant inquiry, recommendation and owner decision.
     */
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
            null::text,
            null::bigint;

        return;
    end if;

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
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    select owner_decision.*
    into decision_record
    from public.nexus_controlled_customer_recommendation_decisions
        as owner_decision
    where owner_decision.decision_id =
            p_decision_id
        and owner_decision.tenant_id =
            trim(p_tenant_id)
        and owner_decision.inquiry_id =
            p_inquiry_id
        and owner_decision.recommendation_id =
            p_recommendation_id
    for update;

    if not found then
        return query
        select
            'decision-unavailable'::text,
            null::uuid,
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    if recommendation_record.inquiry_id <>
            p_inquiry_id
        or recommendation_record.recommendation_text <>
            trim(p_recommendation_text)
        or recommendation_record.rationale <>
            trim(p_rationale)
        or recommendation_record.confidence <>
            p_confidence
        or recommendation_record.risk_flags <>
            p_recommendation_risk_flags
        or recommendation_record.input_fingerprint <>
            p_recommendation_input_fingerprint
    then
        return query
        select
            'recommendation-snapshot-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    if decision_record.owner_id <>
            trim(p_owner_id)
        or decision_record.decision <>
            'approve'
        or decision_record.recommendation_input_fingerprint <>
            p_recommendation_input_fingerprint
        or decision_record.recommendation_content_hash <>
            p_recommendation_content_hash
    then
        return query
        select
            'approval-snapshot-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    /*
     * Safe retry recovery is checked before requiring approved state.
     */
    select execution.*
    into existing_execution
    from public.nexus_controlled_customer_sandbox_executions
        as execution
    where execution.tenant_id =
            trim(p_tenant_id)
        and execution.recommendation_id =
            p_recommendation_id;

    if found then
        if existing_execution.inquiry_id =
                p_inquiry_id
            and existing_execution.decision_id =
                p_decision_id
            and existing_execution.owner_id =
                trim(p_owner_id)
            and existing_execution.execution_mode =
                'sandbox'
            and existing_execution.executor_name =
                trim(p_executor_name)
            and existing_execution.executor_version =
                trim(p_executor_version)
            and existing_execution.recommendation_content_hash =
                p_recommendation_content_hash
            and existing_execution.execution_input_hash =
                p_execution_input_hash
            and existing_execution.response_draft =
                trim(p_response_draft)
            and existing_execution.internal_notes =
                trim(p_internal_notes)
            and existing_execution.risk_flags =
                p_execution_risk_flags
            and existing_execution.status =
                'sandbox-executed'
            and inquiry_record.status =
                'sandbox-executed'
        then
            return query
            select
                'already-executed'::text,
                existing_execution.execution_id,
                inquiry_record.status,
                existing_execution.status,
                existing_execution.executed_at_epoch;

            return;
        end if;

        return query
        select
            'execution-conflict'::text,
            existing_execution.execution_id,
            inquiry_record.status,
            existing_execution.status,
            existing_execution.executed_at_epoch;

        return;
    end if;

    if recommendation_record.status <> 'approved' then
        return query
        select
            'recommendation-state-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    if inquiry_record.status <> 'approved' then
        return query
        select
            'inquiry-state-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    insert into
        public.nexus_controlled_customer_sandbox_executions (
            execution_id,
            tenant_id,
            inquiry_id,
            recommendation_id,
            decision_id,
            owner_id,
            execution_mode,
            executor_name,
            executor_version,
            recommendation_content_hash,
            execution_input_hash,
            response_draft,
            internal_notes,
            risk_flags,
            status,
            executed_at_epoch
        )
    values (
        p_execution_id,
        trim(p_tenant_id),
        p_inquiry_id,
        p_recommendation_id,
        p_decision_id,
        trim(p_owner_id),
        'sandbox',
        trim(p_executor_name),
        trim(p_executor_version),
        p_recommendation_content_hash,
        p_execution_input_hash,
        trim(p_response_draft),
        trim(p_internal_notes),
        p_execution_risk_flags,
        'sandbox-executed',
        p_executed_at_epoch
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
            'execution-conflict'::text,
            null::uuid,
            inquiry_record.status,
            null::text,
            null::bigint;

        return;
    end if;

    update
        public.nexus_controlled_customer_inquiries
    set
        status = 'sandbox-executed'
    where inquiry_id = p_inquiry_id
        and tenant_id = trim(p_tenant_id)
        and status = 'approved';

    get diagnostics updated_count = row_count;

    if updated_count <> 1 then
        raise exception
            'customer inquiry sandbox execution transition failed';
    end if;

    return query
    select
        'executed'::text,
        p_execution_id,
        'sandbox-executed'::text,
        'sandbox-executed'::text,
        p_executed_at_epoch;
end;
$$;

revoke all
on function
    public.nexus_execute_approved_customer_recommendation_sandbox(
        uuid,
        text,
        uuid,
        uuid,
        uuid,
        text,
        text,
        text,
        numeric,
        jsonb,
        text,
        text,
        text,
        text,
        text,
        text,
        text,
        text,
        jsonb,
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
            on function public.nexus_execute_approved_customer_recommendation_sandbox(
                uuid,
                text,
                uuid,
                uuid,
                uuid,
                text,
                text,
                text,
                numeric,
                jsonb,
                text,
                text,
                text,
                text,
                text,
                text,
                text,
                text,
                jsonb,
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
            on function public.nexus_execute_approved_customer_recommendation_sandbox(
                uuid,
                text,
                uuid,
                uuid,
                uuid,
                text,
                text,
                text,
                numeric,
                jsonb,
                text,
                text,
                text,
                text,
                text,
                text,
                text,
                text,
                jsonb,
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
            on function public.nexus_execute_approved_customer_recommendation_sandbox(
                uuid,
                text,
                uuid,
                uuid,
                uuid,
                text,
                text,
                text,
                numeric,
                jsonb,
                text,
                text,
                text,
                text,
                text,
                text,
                text,
                text,
                jsonb,
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_customer_sandbox_executions
is
    'Tenant-isolated deterministic sandbox results created only from an exact authenticated owner-approved recommendation.';

comment on function
    public.nexus_execute_approved_customer_recommendation_sandbox(
        uuid,
        text,
        uuid,
        uuid,
        uuid,
        text,
        text,
        text,
        numeric,
        jsonb,
        text,
        text,
        text,
        text,
        text,
        text,
        text,
        text,
        jsonb,
        bigint
    )
is
    'Atomically verifies an exact owner approval, persists one sandbox execution result and transitions the tenant inquiry without external delivery.';

commit;
