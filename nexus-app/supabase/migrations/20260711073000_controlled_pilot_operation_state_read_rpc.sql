begin;

create or replace function
    public.nexus_read_controlled_pilot_operation_state(
        p_tenant_id text
    )
returns table (
    tenant_id text,
    operation_status text,
    blocking_signal_id text,
    state_version bigint,
    last_transition_at_epoch bigint
)
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
begin
    if p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
    then
        raise exception
            'invalid controlled pilot tenant state read input';
    end if;

    return query
    select
        state.tenant_id,
        state.operation_status,
        state.blocking_signal_id,
        state.state_version,
        state.last_transition_at_epoch
    from public.nexus_controlled_pilot_operation_states as state
    where state.tenant_id = trim(p_tenant_id)
    limit 1;
end;
$$;

revoke all
on function
    public.nexus_read_controlled_pilot_operation_state(text)
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
            on function public.nexus_read_controlled_pilot_operation_state(text)
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
            on function public.nexus_read_controlled_pilot_operation_state(text)
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
            on function public.nexus_read_controlled_pilot_operation_state(text)
            to service_role
        ';
    end if;
end
$$;

comment on function
    public.nexus_read_controlled_pilot_operation_state(text)
is
    'Server-only exact-tenant state lookup used before every controlled pilot operation.';

commit;
