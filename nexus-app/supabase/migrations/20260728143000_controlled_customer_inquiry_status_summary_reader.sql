begin;

create or replace function
    public.nexus_read_controlled_customer_inquiry_status_summary(
        p_tenant_id text
    )
returns table (
    tenant_id text,
    total_inquiries bigint,
    latest_received_at_epoch bigint,
    received_count bigint,
    recommendation_pending_count bigint,
    owner_review_count bigint,
    approved_count bigint,
    rejected_count bigint,
    sandbox_executed_count bigint,
    completed_count bigint,
    failed_count bigint
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
            'invalid controlled customer inquiry status summary read input';
    end if;

    return query
    select
        trim(p_tenant_id)::text,
        count(*)::bigint,
        max(inquiry.received_at_epoch)::bigint,
        count(*) filter (where inquiry.status = 'received')::bigint,
        count(*) filter (where inquiry.status = 'recommendation-pending')::bigint,
        count(*) filter (where inquiry.status = 'owner-review')::bigint,
        count(*) filter (where inquiry.status = 'approved')::bigint,
        count(*) filter (where inquiry.status = 'rejected')::bigint,
        count(*) filter (where inquiry.status = 'sandbox-executed')::bigint,
        count(*) filter (where inquiry.status = 'completed')::bigint,
        count(*) filter (where inquiry.status = 'failed')::bigint
    from public.nexus_controlled_customer_inquiries as inquiry
    where inquiry.tenant_id = trim(p_tenant_id);
end;
$$;

revoke all
on function
    public.nexus_read_controlled_customer_inquiry_status_summary(text)
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
            on function public.nexus_read_controlled_customer_inquiry_status_summary(text)
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
            on function public.nexus_read_controlled_customer_inquiry_status_summary(text)
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
            on function public.nexus_read_controlled_customer_inquiry_status_summary(text)
            to service_role
        ';
    end if;
end
$$;

comment on function
    public.nexus_read_controlled_customer_inquiry_status_summary(text)
is
    'Server-only exact-tenant privacy-safe inquiry status aggregates for read-only founder evidence.';

commit;