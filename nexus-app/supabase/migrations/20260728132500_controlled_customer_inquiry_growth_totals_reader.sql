begin;

create or replace function
    public.nexus_read_controlled_customer_inquiry_growth_totals(
        p_tenant_id text
    )
returns table (
    tenant_id text,
    total_inquiries bigint,
    unique_customers bigint
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
            'invalid controlled customer inquiry growth totals read input';
    end if;

    return query
    select
        trim(p_tenant_id)::text,
        count(*)::bigint,
        count(distinct inquiry.customer_ref)::bigint
    from public.nexus_controlled_customer_inquiries as inquiry
    where inquiry.tenant_id = trim(p_tenant_id);
end;
$$;

revoke all
on function
    public.nexus_read_controlled_customer_inquiry_growth_totals(text)
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
            on function public.nexus_read_controlled_customer_inquiry_growth_totals(text)
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
            on function public.nexus_read_controlled_customer_inquiry_growth_totals(text)
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
            on function public.nexus_read_controlled_customer_inquiry_growth_totals(text)
            to service_role
        ';
    end if;
end
$$;

comment on function
    public.nexus_read_controlled_customer_inquiry_growth_totals(text)
is
    'Server-only exact-tenant aggregate inquiry totals for read-only founder growth evidence.';

commit;
