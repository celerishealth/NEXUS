begin;

create or replace function
    public.nexus_commit_controlled_pilot_resume(
        p_token_id uuid,
        p_tenant_id text,
        p_signal_id text,
        p_owner_id text,
        p_issued_at_epoch bigint,
        p_expires_at_epoch bigint,
        p_consumed_at_epoch bigint,
        p_consumption_attempt_id uuid,
        p_audit_event_id uuid,
        p_session_id text
    )
returns table (
    status text,
    consumed_at_epoch bigint,
    audit_event_id uuid
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inserted_count integer := 0;

    existing_consumption
        public.nexus_controlled_pilot_resume_proof_consumptions%rowtype;

    existing_audit
        public.nexus_controlled_pilot_resume_audit_events%rowtype;
begin
    if p_token_id is null
        or p_consumption_attempt_id is null
        or p_audit_event_id is null
        or p_audit_event_id <> p_token_id
        or p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_signal_id is null
        or length(trim(p_signal_id)) = 0
        or p_owner_id is null
        or length(trim(p_owner_id)) = 0
        or p_issued_at_epoch is null
        or p_expires_at_epoch is null
        or p_consumed_at_epoch is null
        or p_expires_at_epoch <= p_issued_at_epoch
        or p_consumed_at_epoch < p_issued_at_epoch
        or p_consumed_at_epoch >= p_expires_at_epoch
    then
        raise exception
            'invalid controlled pilot atomic resume commit input';
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

    if inserted_count = 1 then
        /*
         * This insert is intentionally in the same function transaction.
         * If it fails, PostgreSQL rolls back the proof consumption insert.
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
            p_audit_event_id,
            trim(p_tenant_id),
            trim(p_owner_id),
            trim(p_signal_id),
            p_token_id,
            nullif(trim(p_session_id), ''),
            'ATOMIC_AUTHENTICATED_OWNER_RESUME_AUTHORIZED',
            true,
            true,
            p_consumed_at_epoch
        );

        return query
        select
            'committed'::text,
            p_consumed_at_epoch,
            p_audit_event_id;

        return;
    end if;

    select *
    into existing_consumption
    from public.nexus_controlled_pilot_resume_proof_consumptions
    where token_id = p_token_id;

    if not found then
        raise exception
            'controlled pilot consumption unavailable after token conflict';
    end if;

    if existing_consumption.tenant_id <> trim(p_tenant_id)
        or existing_consumption.signal_id <> trim(p_signal_id)
        or existing_consumption.owner_id <> trim(p_owner_id)
        or existing_consumption.issued_at_epoch <> p_issued_at_epoch
        or existing_consumption.expires_at_epoch <> p_expires_at_epoch
    then
        return query
        select
            'binding-conflict'::text,
            null::bigint,
            null::uuid;

        return;
    end if;

    select *
    into existing_audit
    from public.nexus_controlled_pilot_resume_audit_events
    where event_id = p_audit_event_id;

    if not found then
        /*
         * Consumption without its matching successful audit is not
         * accepted as a completed atomic authorization.
         */
        return query
        select
            'binding-conflict'::text,
            null::bigint,
            null::uuid;

        return;
    end if;

    if existing_audit.tenant_id <> trim(p_tenant_id)
        or existing_audit.owner_id <> trim(p_owner_id)
        or existing_audit.signal_id <> trim(p_signal_id)
        or existing_audit.token_id <> p_token_id
        or existing_audit.outcome_code
            <> 'ATOMIC_AUTHENTICATED_OWNER_RESUME_AUTHORIZED'
        or existing_audit.authorized <> true
        or existing_audit.pilot_operation_permitted <> true
        or existing_audit.attempted_at_epoch
            <> existing_consumption.consumed_at_epoch
    then
        return query
        select
            'binding-conflict'::text,
            null::bigint,
            null::uuid;

        return;
    end if;

    return query
    select
        'already-committed'::text,
        existing_consumption.consumed_at_epoch,
        existing_audit.event_id;
end;
$$;

revoke all
on function
    public.nexus_commit_controlled_pilot_resume(
        uuid,
        text,
        text,
        text,
        bigint,
        bigint,
        bigint,
        uuid,
        uuid,
        text
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
            on function public.nexus_commit_controlled_pilot_resume(
                uuid,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid,
                uuid,
                text
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
            on function public.nexus_commit_controlled_pilot_resume(
                uuid,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid,
                uuid,
                text
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
            on function public.nexus_commit_controlled_pilot_resume(
                uuid,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid,
                uuid,
                text
            )
            to service_role
        ';
    end if;
end
$$;

comment on function
    public.nexus_commit_controlled_pilot_resume(
        uuid,
        text,
        text,
        text,
        bigint,
        bigint,
        bigint,
        uuid,
        uuid,
        text
    )
is
    'Server-only atomic transaction that consumes one owner resume proof and persists its successful authorization audit together.';

commit;
