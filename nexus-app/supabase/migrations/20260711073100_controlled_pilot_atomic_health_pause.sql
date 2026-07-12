begin;

create table if not exists
    public.nexus_controlled_pilot_health_pause_events (
        tenant_id text not null,
        signal_id text not null,
        signal_source text not null,
        severity text not null,
        observed_at_epoch bigint not null,
        previous_state_version bigint not null,
        paused_state_version bigint not null,
        created_at timestamptz not null
            default timezone('utc', now()),

        primary key (
            tenant_id,
            signal_id
        ),

        constraint nexus_health_pause_tenant_not_blank
            check (length(trim(tenant_id)) > 0),

        constraint nexus_health_pause_signal_not_blank
            check (length(trim(signal_id)) > 0),

        constraint nexus_health_pause_source_not_blank
            check (length(trim(signal_source)) > 0),

        constraint nexus_health_pause_critical_only
            check (severity = 'critical'),

        constraint nexus_health_pause_observed_time_valid
            check (observed_at_epoch >= 0),

        constraint nexus_health_pause_version_valid
            check (
                previous_state_version >= 1
                and paused_state_version =
                    previous_state_version + 1
            )
    );

create index if not exists
    nexus_health_pause_tenant_time_idx
on public.nexus_controlled_pilot_health_pause_events (
    tenant_id,
    observed_at_epoch desc
);

create index if not exists
    nexus_health_pause_signal_idx
on public.nexus_controlled_pilot_health_pause_events (
    signal_id
);

alter table
    public.nexus_controlled_pilot_health_pause_events
enable row level security;

alter table
    public.nexus_controlled_pilot_health_pause_events
force row level security;

revoke all
on table public.nexus_controlled_pilot_health_pause_events
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
            on table public.nexus_controlled_pilot_health_pause_events
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
            on table public.nexus_controlled_pilot_health_pause_events
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
            on table public.nexus_controlled_pilot_health_pause_events
            to service_role
        ';
    end if;
end
$$;

create or replace function
    public.nexus_commit_controlled_pilot_health_pause(
        p_tenant_id text,
        p_signal_id text,
        p_signal_source text,
        p_severity text,
        p_observed_at_epoch bigint,
        p_expected_state_version bigint
    )
returns table (
    status text,
    operation_status text,
    blocking_signal_id text,
    state_version bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    pilot_state
        public.nexus_controlled_pilot_operation_states%rowtype;

    existing_event
        public.nexus_controlled_pilot_health_pause_events%rowtype;

    new_state_version bigint;
    affected_count integer := 0;
begin
    if p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_signal_id is null
        or length(trim(p_signal_id)) = 0
        or p_signal_source is null
        or length(trim(p_signal_source)) = 0
        or p_severity <> 'critical'
        or p_observed_at_epoch is null
        or p_observed_at_epoch < 0
        or p_expected_state_version is null
        or p_expected_state_version < 1
    then
        raise exception
            'invalid controlled pilot critical health pause input';
    end if;

    /*
     * Idempotent retry check using the tenant and signal binding.
     */
    select event.*
    into existing_event
    from public.nexus_controlled_pilot_health_pause_events as event
    where event.tenant_id = trim(p_tenant_id)
        and event.signal_id = trim(p_signal_id);

    if found then
        select state.*
        into pilot_state
        from public.nexus_controlled_pilot_operation_states as state
        where state.tenant_id = trim(p_tenant_id);

        if existing_event.signal_source = trim(p_signal_source)
            and existing_event.severity = 'critical'
            and existing_event.observed_at_epoch =
                p_observed_at_epoch
            and pilot_state.operation_status = 'paused'
            and pilot_state.blocking_signal_id =
                trim(p_signal_id)
            and pilot_state.state_version =
                existing_event.paused_state_version
        then
            return query
            select
                'already-committed'::text,
                pilot_state.operation_status,
                pilot_state.blocking_signal_id,
                pilot_state.state_version;

            return;
        end if;

        return query
        select
            'binding-conflict'::text,
            null::text,
            null::text,
            null::bigint;

        return;
    end if;

    /*
     * Lock only the exact tenant state.
     */
    select state.*
    into pilot_state
    from public.nexus_controlled_pilot_operation_states as state
    where state.tenant_id = trim(p_tenant_id)
    for update;

    if not found then
        return query
        select
            'state-unavailable'::text,
            null::text,
            null::text,
            null::bigint;

        return;
    end if;

    if pilot_state.state_version <>
        p_expected_state_version
    then
        return query
        select
            'state-version-conflict'::text,
            pilot_state.operation_status,
            pilot_state.blocking_signal_id,
            pilot_state.state_version;

        return;
    end if;

    if pilot_state.operation_status = 'paused' then
        return query
        select
            'already-paused'::text,
            pilot_state.operation_status,
            pilot_state.blocking_signal_id,
            pilot_state.state_version;

        return;
    end if;

    if pilot_state.operation_status <> 'active'
        or pilot_state.blocking_signal_id is not null
    then
        return query
        select
            'state-inconsistent'::text,
            pilot_state.operation_status,
            pilot_state.blocking_signal_id,
            pilot_state.state_version;

        return;
    end if;

    new_state_version :=
        pilot_state.state_version + 1;

    /*
     * Event persistence and active-to-paused transition occur
     * inside this same PostgreSQL transaction.
     */
    insert into
        public.nexus_controlled_pilot_health_pause_events (
            tenant_id,
            signal_id,
            signal_source,
            severity,
            observed_at_epoch,
            previous_state_version,
            paused_state_version
        )
    values (
        trim(p_tenant_id),
        trim(p_signal_id),
        trim(p_signal_source),
        'critical',
        p_observed_at_epoch,
        pilot_state.state_version,
        new_state_version
    );

    update
        public.nexus_controlled_pilot_operation_states
    set
        operation_status = 'paused',
        blocking_signal_id = trim(p_signal_id),
        state_version = new_state_version,
        last_transition_at_epoch =
            p_observed_at_epoch,
        last_owner_id = null,
        last_resume_token_id = null,
        updated_at = timezone('utc', now())
    where tenant_id = trim(p_tenant_id)
        and operation_status = 'active'
        and blocking_signal_id is null
        and state_version =
            p_expected_state_version;

    get diagnostics affected_count = row_count;

    if affected_count <> 1 then
        raise exception
            'controlled pilot critical pause lost atomic state lock';
    end if;

    return query
    select
        'committed'::text,
        'paused'::text,
        trim(p_signal_id),
        new_state_version;
end;
$$;

revoke all
on function
    public.nexus_commit_controlled_pilot_health_pause(
        text,
        text,
        text,
        text,
        bigint,
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
            on function public.nexus_commit_controlled_pilot_health_pause(
                text,
                text,
                text,
                text,
                bigint,
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
            on function public.nexus_commit_controlled_pilot_health_pause(
                text,
                text,
                text,
                text,
                bigint,
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
            on function public.nexus_commit_controlled_pilot_health_pause(
                text,
                text,
                text,
                text,
                bigint,
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_pilot_health_pause_events
is
    'Server-only append-once critical health events that atomically pause an exact tenant controlled pilot.';

comment on function
    public.nexus_commit_controlled_pilot_health_pause(
        text,
        text,
        text,
        text,
        bigint,
        bigint
    )
is
    'Atomically persists a critical tenant health signal and transitions the exact controlled pilot from active to paused.';

commit;
