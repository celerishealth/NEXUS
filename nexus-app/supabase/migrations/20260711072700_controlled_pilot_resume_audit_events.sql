begin;

create table if not exists
    public.nexus_controlled_pilot_resume_audit_events (
        event_id uuid primary key,
        tenant_id text,
        owner_id text,
        signal_id text,
        token_id uuid,
        session_id text,
        outcome_code text not null,
        authorized boolean not null,
        pilot_operation_permitted boolean not null,
        attempted_at_epoch bigint not null,
        created_at timestamptz not null
            default timezone('utc', now()),

        constraint nexus_resume_audit_outcome_not_blank
            check (length(trim(outcome_code)) > 0),

        constraint nexus_resume_audit_attempt_time_valid
            check (attempted_at_epoch >= 0),

        constraint nexus_resume_audit_authorized_bindings_required
            check (
                authorized = false
                or (
                    tenant_id is not null
                    and length(trim(tenant_id)) > 0
                    and owner_id is not null
                    and length(trim(owner_id)) > 0
                    and signal_id is not null
                    and length(trim(signal_id)) > 0
                    and token_id is not null
                    and pilot_operation_permitted = true
                )
            ),

        constraint nexus_resume_audit_no_false_permission
            check (
                authorized = true
                or pilot_operation_permitted = false
            )
    );

create index if not exists
    nexus_resume_audit_tenant_time_idx
on public.nexus_controlled_pilot_resume_audit_events (
    tenant_id,
    attempted_at_epoch desc
);

create index if not exists
    nexus_resume_audit_signal_time_idx
on public.nexus_controlled_pilot_resume_audit_events (
    signal_id,
    attempted_at_epoch desc
);

create index if not exists
    nexus_resume_audit_token_idx
on public.nexus_controlled_pilot_resume_audit_events (
    token_id
)
where token_id is not null;

alter table
    public.nexus_controlled_pilot_resume_audit_events
enable row level security;

alter table
    public.nexus_controlled_pilot_resume_audit_events
force row level security;

revoke all
on table public.nexus_controlled_pilot_resume_audit_events
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
            on table public.nexus_controlled_pilot_resume_audit_events
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
            on table public.nexus_controlled_pilot_resume_audit_events
            from authenticated
        ';
    end if;
end
$$;

create or replace function
    public.nexus_append_controlled_pilot_resume_audit_event(
        p_event_id uuid,
        p_tenant_id text,
        p_owner_id text,
        p_signal_id text,
        p_token_id uuid,
        p_session_id text,
        p_outcome_code text,
        p_authorized boolean,
        p_pilot_operation_permitted boolean,
        p_attempted_at_epoch bigint
    )
returns table (
    status text,
    stored_event_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inserted_count integer := 0;
    existing_record
        public.nexus_controlled_pilot_resume_audit_events%rowtype;
begin
    if p_event_id is null
        or p_outcome_code is null
        or length(trim(p_outcome_code)) = 0
        or p_authorized is null
        or p_pilot_operation_permitted is null
        or p_attempted_at_epoch is null
        or p_attempted_at_epoch < 0
        or (
            p_authorized = true
            and (
                p_tenant_id is null
                or length(trim(p_tenant_id)) = 0
                or p_owner_id is null
                or length(trim(p_owner_id)) = 0
                or p_signal_id is null
                or length(trim(p_signal_id)) = 0
                or p_token_id is null
                or p_pilot_operation_permitted <> true
            )
        )
        or (
            p_authorized = false
            and p_pilot_operation_permitted = true
        )
    then
        raise exception
            'invalid controlled pilot resume audit event';
    end if;

    insert into
        public.nexus_controlled_pilot_resume_audit_events (
            event_id,
            tenant_id,
            owner_id,
            signal_id,
            token_id,
            session_id,
            outcome_code,
            authorized,
            pilot_operation_permitted,
            attempted_at_epoch
        )
    values (
        p_event_id,
        nullif(trim(p_tenant_id), ''),
        nullif(trim(p_owner_id), ''),
        nullif(trim(p_signal_id), ''),
        p_token_id,
        nullif(trim(p_session_id), ''),
        trim(p_outcome_code),
        p_authorized,
        p_pilot_operation_permitted,
        p_attempted_at_epoch
    )
    on conflict (event_id)
    do nothing;

    get diagnostics inserted_count = row_count;

    if inserted_count = 1 then
        return query
        select
            'recorded'::text,
            p_event_id;

        return;
    end if;

    select *
    into existing_record
    from public.nexus_controlled_pilot_resume_audit_events
    where event_id = p_event_id;

    if not found then
        raise exception
            'controlled pilot resume audit event unavailable after conflict';
    end if;

    if existing_record.tenant_id
            is distinct from nullif(trim(p_tenant_id), '')
        or existing_record.owner_id
            is distinct from nullif(trim(p_owner_id), '')
        or existing_record.signal_id
            is distinct from nullif(trim(p_signal_id), '')
        or existing_record.token_id
            is distinct from p_token_id
        or existing_record.session_id
            is distinct from nullif(trim(p_session_id), '')
        or existing_record.outcome_code
            <> trim(p_outcome_code)
        or existing_record.authorized
            <> p_authorized
        or existing_record.pilot_operation_permitted
            <> p_pilot_operation_permitted
        or existing_record.attempted_at_epoch
            <> p_attempted_at_epoch
    then
        return query
        select
            'binding-conflict'::text,
            existing_record.event_id;

        return;
    end if;

    return query
    select
        'already-recorded'::text,
        existing_record.event_id;
end;
$$;

revoke all
on function
    public.nexus_append_controlled_pilot_resume_audit_event(
        uuid,
        text,
        text,
        text,
        uuid,
        text,
        text,
        boolean,
        boolean,
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
            on function public.nexus_append_controlled_pilot_resume_audit_event(
                uuid,
                text,
                text,
                text,
                uuid,
                text,
                text,
                boolean,
                boolean,
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
            on function public.nexus_append_controlled_pilot_resume_audit_event(
                uuid,
                text,
                text,
                text,
                uuid,
                text,
                text,
                boolean,
                boolean,
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
            on function public.nexus_append_controlled_pilot_resume_audit_event(
                uuid,
                text,
                text,
                text,
                uuid,
                text,
                text,
                boolean,
                boolean,
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_pilot_resume_audit_events
is
    'Server-only immutable audit trail for controlled pilot owner resume attempts.';

comment on function
    public.nexus_append_controlled_pilot_resume_audit_event(
        uuid,
        text,
        text,
        text,
        uuid,
        text,
        text,
        boolean,
        boolean,
        bigint
    )
is
    'Server-only append-once RPC for controlled pilot resume authorization audit events.';

commit;
