begin;

create or replace function public.nexus_consume_controlled_pilot_resume_proof(
    p_token_id uuid,
    p_tenant_id text,
    p_signal_id text,
    p_owner_id text,
    p_issued_at_epoch bigint,
    p_expires_at_epoch bigint,
    p_consumed_at_epoch bigint,
    p_consumption_attempt_id uuid
)
returns table (
    status text,
    consumed_at_epoch bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inserted_count integer := 0;
    existing_record
        public.nexus_controlled_pilot_resume_proof_consumptions%rowtype;
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
        or p_expires_at_epoch <= p_issued_at_epoch
        or p_consumed_at_epoch < p_issued_at_epoch
        or p_consumed_at_epoch >= p_expires_at_epoch
    then
        raise exception
            'invalid controlled pilot resume consumption input';
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
        return query
        select
            'consumed'::text,
            p_consumed_at_epoch;

        return;
    end if;

    select *
    into existing_record
    from public.nexus_controlled_pilot_resume_proof_consumptions
    where token_id = p_token_id;

    if not found then
        raise exception
            'controlled pilot resume consumption record unavailable after conflict';
    end if;

    if existing_record.tenant_id <> trim(p_tenant_id)
        or existing_record.signal_id <> trim(p_signal_id)
        or existing_record.owner_id <> trim(p_owner_id)
        or existing_record.issued_at_epoch <> p_issued_at_epoch
        or existing_record.expires_at_epoch <> p_expires_at_epoch
    then
        return query
        select
            'binding-conflict'::text,
            null::bigint;

        return;
    end if;

    return query
    select
        'already-consumed'::text,
        existing_record.consumed_at_epoch;
end;
$$;

revoke all
on function public.nexus_consume_controlled_pilot_resume_proof(
    uuid,
    text,
    text,
    text,
    bigint,
    bigint,
    bigint,
    uuid
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
            on function public.nexus_consume_controlled_pilot_resume_proof(
                uuid,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid
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
            on function public.nexus_consume_controlled_pilot_resume_proof(
                uuid,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid
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
            on function public.nexus_consume_controlled_pilot_resume_proof(
                uuid,
                text,
                text,
                text,
                bigint,
                bigint,
                bigint,
                uuid
            )
            to service_role
        ';
    end if;
end
$$;

comment on function
    public.nexus_consume_controlled_pilot_resume_proof(
        uuid,
        text,
        text,
        text,
        bigint,
        bigint,
        bigint,
        uuid
    )
is
    'Server-only atomic consume-once RPC for tenant-bound controlled pilot owner resume proofs.';

commit;
