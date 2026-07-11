begin;

create table if not exists
    public.nexus_controlled_pilot_operation_states (
        tenant_id text primary key,
        operation_status text not null,
        blocking_signal_id text,
        state_version bigint not null default 1,
        last_transition_at_epoch bigint not null,
        last_owner_id text,
        last_resume_token_id uuid,
        created_at timestamptz not null
            default timezone('utc', now()),
        updated_at timestamptz not null
            default timezone('utc', now()),

        constraint nexus_pilot_state_tenant_not_blank
            check (length(trim(tenant_id)) > 0),

        constraint nexus_pilot_state_status_valid
            check (
                operation_status in (
                    'paused',
                    'active'
                )
            ),

        constraint nexus_pilot_state_version_valid
            check (state_version >= 1),

        constraint nexus_pilot_state_transition_time_valid
            check (last_transition_at_epoch >= 0),

        constraint nexus_pilot_state_signal_consistency
            check (
                (
                    operation_status = 'paused'
                    and blocking_signal_id is not null
                    and length(trim(blocking_signal_id)) > 0
                )
                or
                (
                    operation_status = 'active'
                    and blocking_signal_id is null
                )
            )
    );

create index if not exists
    nexus_pilot_state_status_idx
on public.nexus_controlled_pilot_operation_states (
    operation_status,
    updated_at desc
);

alter table
    public.nexus_controlled_pilot_operation_states
enable row level security;

alter table
    public.nexus_controlled_pilot_operation_states
force row level security;

revoke all
on table public.nexus_controlled_pilot_operation_states
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
            on table public.nexus_controlled_pilot_operation_states
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
            on table public.nexus_controlled_pilot_operation_states
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
            on table public.nexus_controlled_pilot_operation_states
            to service_role
        ';
    end if;
end
$$;

create or replace function
    public.nexus_commit_controlled_pilot_state_resume(
        p_token_id uuid,
        p_tenant_id text,
        p_signal_id text,
        p_owner_id text,
        p_session_id text,
        p_issued_at_epoch bigint,
        p_expires_at_epoch bigint,
        p_consumed_at_epoch bigint,
        p_consumption_attempt_id uuid,
        p_expected_state_version bigint
    )
returns table (
    status text,
    operation_status text,
    state_version bigint,
    consumed_at_epoch bigint,
    audit_event_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inserted_count integer := 0;
    new_state_version bigint;

    pilot_state
        public.nexus_controlled_pilot_operation_states%rowtype;

    existing_consumption
        public.nexus_controlled_pilot_resume_proof_consumptions%rowtype;

    existing_audit
        public.nexus_controlled_pilot_resume_audit_events%rowtype;
begin
    if p_token_id is null
        or p_consumption_attempt_id is null
        or p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_signal_id is null
        or length(trim(p_signal_id)) = 0
        or p_owner_id is null
        or length(trim(p_owner_id)) = 0
        or p_issued_at_epoch is null
        or p_expires_at_epoch is null
        or p_consumed_at_epoch is null
        or p_expected_state_version is null
        or p_expected_state_version < 1
        or p_expires_at_epoch <= p_issued_at_epoch
        or p_consumed_at_epoch < p_issued_at_epoch
        or p_consumed_at_epoch >= p_expires_at_epoch
    then
        raise exception
            'invalid controlled pilot atomic state resume input';
    end if;

    /*
     * Fast idempotency check for a previously committed token.
     */
    select *
    into existing_consumption
    from public.nexus_controlled_pilot_resume_proof_consumptions
    where token_id = p_token_id;

    if found then
        select *
        into existing_audit
        from public.nexus_controlled_pilot_resume_audit_events
        where event_id = p_token_id;

        select *
        into pilot_state
        from public.nexus_controlled_pilot_operation_states
        where tenant_id = trim(p_tenant_id);

        if existing_consumption.tenant_id = trim(p_tenant_id)
            and existing_consumption.signal_id = trim(p_signal_id)
            and existing_consumption.owner_id = trim(p_owner_id)
            and existing_consumption.issued_at_epoch = p_issued_at_epoch
            and existing_consumption.expires_at_epoch = p_expires_at_epoch
            and existing_audit.event_id = p_token_id
            and existing_audit.tenant_id = trim(p_tenant_id)
            and existing_audit.owner_id = trim(p_owner_id)
            and existing_audit.signal_id = trim(p_signal_id)
            and existing_audit.token_id = p_token_id
            and existing_audit.authorized = true
            and existing_audit.pilot_operation_permitted = true
            and pilot_state.operation_status = 'active'
            and pilot_state.last_resume_token_id = p_token_id
        then
            return query
            select
                'already-committed'::text,
                pilot_state.operation_status,
                pilot_state.state_version,
                existing_consumption.consumed_at_epoch,
                existing_audit.event_id;

            return;
        end if;

        return query
        select
            'binding-conflict'::text,
            null::text,
            null::bigint,
            null::bigint,
            null::uuid;

        return;
    end if;

    /*
     * Lock the exact tenant state before validating and transitioning it.
     */
    select *
    into pilot_state
    from public.nexus_controlled_pilot_operation_states
    where tenant_id = trim(p_tenant_id)
    for update;

    if not found then
        return query
        select
            'state-unavailable'::text,
            null::text,
            null::bigint,
            null::bigint,
            null::uuid;

        return;
    end if;

    if pilot_state.state_version <> p_expected_state_version then
        return query
        select
            'state-version-conflict'::text,
            pilot_state.operation_status,
            pilot_state.state_version,
            null::bigint,
            null::uuid;

        return;
    end if;

    if pilot_state.operation_status <> 'paused' then
        return query
        select
            'state-not-paused'::text,
            pilot_state.operation_status,
            pilot_state.state_version,
            null::bigint,
            null::uuid;

        return;
    end if;

    if pilot_state.blocking_signal_id <> trim(p_signal_id) then
        return query
        select
            'signal-state-mismatch'::text,
            pilot_state.operation_status,
            pilot_state.state_version,
            null::bigint,
            null::uuid;

        return;
    end if;

    insert into
        public.nexus_controlled_pilot_resume_proof_consumptions (
            token_id,
            tenant_id,
            signal_id,
            owner_id,
            issued_at_epoch,
            expires_at_epoch,
            consumed_at_epoch,
            consumption_attempt_id
        )
    values (
        p_token_id,
        trim(p_tenant_id),
        trim(p_signal_id),
        trim(p_owner_id),
        p_issued_at_epoch,
        p_expires_at_epoch,
        p_consumed_at_epoch,
        p_consumption_attempt_id
    )
    on conflict (token_id)
    do nothing;

    get diagnostics inserted_count = row_count;

    if inserted_count <> 1 then
        return query
        select
            'binding-conflict'::text,
            null::text,
            null::bigint,
            null::bigint,
            null::uuid;

        return;
    end if;

    /*
     * Audit and state transition are part of this same transaction.
     * Any failure rolls back the proof consumption as well.
     */
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
        p_token_id,
        trim(p_tenant_id),
        trim(p_owner_id),
        trim(p_signal_id),
        p_token_id,
        nullif(trim(p_session_id), ''),
        'ATOMIC_PILOT_STATE_RESUME_AUTHORIZED',
        true,
        true,
        p_consumed_at_epoch
    );

    new_state_version :=
        pilot_state.state_version + 1;

    update
        public.nexus_controlled_pilot_operation_states
    set
        operation_status = 'active',
        blocking_signal_id = null,
        state_version = new_state_version,
        last_transition_at_epoch = p_consumed_at_epoch,
        last_owner_id = trim(p_owner_id),
        last_resume_token_id = p_token_id,
        updated_at = timezone('utc', now())
    where tenant_id = trim(p_tenant_id)
        and state_version = p_expected_state_version
        and operation_status = 'paused'
        and blocking_signal_id = trim(p_signal_id);

    get diagnostics inserted_count = row_count;

    if inserted_count <> 1 then
        raise exception
            'controlled pilot state transition lost atomic lock';
    end if;

    return query
    select
        'committed'::text,
        'active'::text,
        new_state_version,
        p_consumed_at_epoch,
        p_token_id;
end;
$$;

revoke all
on function
    public.nexus_commit_controlled_pilot_state_resume(
        uuid,
        text,
        text,
        text,
        text,
        bigint,
        bigint,
        bigint,
        uuid,
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
            on function public.nexus_commit_controlled_pilot_state_resume(
                uuid,
                text,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid,
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
            on function public.nexus_commit_controlled_pilot_state_resume(
                uuid,
                text,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid,
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
            on function public.nexus_commit_controlled_pilot_state_resume(
                uuid,
                text,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid,
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_pilot_operation_states
is
    'Server-only tenant pilot state with incident binding, optimistic versioning and controlled resume history.';

comment on function
    public.nexus_commit_controlled_pilot_state_resume(
        uuid,
        text,
        text,
        text,
        text,
        bigint,
        bigint,
        bigint,
        uuid,
        bigint
    )
is
    'Atomically consumes a tenant owner proof, records the authorization audit and transitions the matching tenant pilot from paused to active.';

commit;
