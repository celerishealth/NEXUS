begin;

create table if not exists
    public.nexus_controlled_customer_inquiries (
        inquiry_id uuid primary key,
        tenant_id text not null,
        customer_ref text not null,
        channel text not null,
        message text not null,
        idempotency_key text not null,
        status text not null default 'received',
        received_at_epoch bigint not null,
        created_at timestamptz not null
            default timezone('utc', now()),

        constraint nexus_customer_inquiry_tenant_not_blank
            check (length(trim(tenant_id)) > 0),

        constraint nexus_customer_inquiry_customer_ref_valid
            check (
                length(trim(customer_ref))
                between 1 and 200
            ),

        constraint nexus_customer_inquiry_channel_valid
            check (
                channel in (
                    'web',
                    'email',
                    'whatsapp',
                    'manual'
                )
            ),

        constraint nexus_customer_inquiry_message_valid
            check (
                length(trim(message))
                between 1 and 4000
            ),

        constraint nexus_customer_inquiry_idempotency_valid
            check (
                length(trim(idempotency_key))
                between 1 and 200
            ),

        constraint nexus_customer_inquiry_status_valid
            check (
                status in (
                    'received',
                    'recommendation-pending',
                    'owner-review',
                    'approved',
                    'rejected',
                    'sandbox-executed',
                    'completed',
                    'failed'
                )
            ),

        constraint nexus_customer_inquiry_received_time_valid
            check (received_at_epoch >= 0),

        constraint nexus_customer_inquiry_tenant_idempotency_unique
            unique (
                tenant_id,
                idempotency_key
            )
    );

create index if not exists
    nexus_customer_inquiry_tenant_status_time_idx
on public.nexus_controlled_customer_inquiries (
    tenant_id,
    status,
    received_at_epoch desc
);

create index if not exists
    nexus_customer_inquiry_tenant_customer_idx
on public.nexus_controlled_customer_inquiries (
    tenant_id,
    customer_ref,
    received_at_epoch desc
);

alter table
    public.nexus_controlled_customer_inquiries
enable row level security;

alter table
    public.nexus_controlled_customer_inquiries
force row level security;

revoke all
on table public.nexus_controlled_customer_inquiries
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
            on table public.nexus_controlled_customer_inquiries
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
            on table public.nexus_controlled_customer_inquiries
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
            on table public.nexus_controlled_customer_inquiries
            to service_role
        ';
    end if;
end
$$;

create or replace function
    public.nexus_create_controlled_customer_inquiry(
        p_inquiry_id uuid,
        p_tenant_id text,
        p_customer_ref text,
        p_channel text,
        p_message text,
        p_idempotency_key text,
        p_received_at_epoch bigint
    )
returns table (
    status text,
    inquiry_id uuid,
    stored_received_at_epoch bigint
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    inserted_count integer := 0;

    existing_inquiry
        public.nexus_controlled_customer_inquiries%rowtype;
begin
    if p_inquiry_id is null
        or p_tenant_id is null
        or length(trim(p_tenant_id)) = 0
        or p_customer_ref is null
        or length(trim(p_customer_ref)) < 1
        or length(trim(p_customer_ref)) > 200
        or p_channel not in (
            'web',
            'email',
            'whatsapp',
            'manual'
        )
        or p_message is null
        or length(trim(p_message)) < 1
        or length(trim(p_message)) > 4000
        or p_idempotency_key is null
        or length(trim(p_idempotency_key)) < 1
        or length(trim(p_idempotency_key)) > 200
        or p_received_at_epoch is null
        or p_received_at_epoch < 0
    then
        raise exception
            'invalid controlled customer inquiry input';
    end if;

    insert into
        public.nexus_controlled_customer_inquiries (
            inquiry_id,
            tenant_id,
            customer_ref,
            channel,
            message,
            idempotency_key,
            status,
            received_at_epoch
        )
    values (
        p_inquiry_id,
        trim(p_tenant_id),
        trim(p_customer_ref),
        p_channel,
        trim(p_message),
        trim(p_idempotency_key),
        'received',
        p_received_at_epoch
    )
    on conflict (
        tenant_id,
        idempotency_key
    )
    do nothing;

    get diagnostics inserted_count = row_count;

    if inserted_count = 1 then
        return query
        select
            'created'::text,
            p_inquiry_id,
            p_received_at_epoch;

        return;
    end if;

    select inquiry.*
    into existing_inquiry
    from public.nexus_controlled_customer_inquiries
        as inquiry
    where inquiry.tenant_id =
            trim(p_tenant_id)
        and inquiry.idempotency_key =
            trim(p_idempotency_key);

    if not found then
        raise exception
            'controlled inquiry unavailable after idempotency conflict';
    end if;

    if existing_inquiry.customer_ref <>
            trim(p_customer_ref)
        or existing_inquiry.channel <>
            p_channel
        or existing_inquiry.message <>
            trim(p_message)
    then
        return query
        select
            'binding-conflict'::text,
            existing_inquiry.inquiry_id,
            existing_inquiry.received_at_epoch;

        return;
    end if;

    return query
    select
        'already-created'::text,
        existing_inquiry.inquiry_id,
        existing_inquiry.received_at_epoch;
end;
$$;

revoke all
on function
    public.nexus_create_controlled_customer_inquiry(
        uuid,
        text,
        text,
        text,
        text,
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
            on function public.nexus_create_controlled_customer_inquiry(
                uuid,
                text,
                text,
                text,
                text,
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
            on function public.nexus_create_controlled_customer_inquiry(
                uuid,
                text,
                text,
                text,
                text,
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
            on function public.nexus_create_controlled_customer_inquiry(
                uuid,
                text,
                text,
                text,
                text,
                text,
                bigint
            )
            to service_role
        ';
    end if;
end
$$;

comment on table
    public.nexus_controlled_customer_inquiries
is
    'Server-only tenant-isolated intake ledger for controlled customer inquiries.';

comment on function
    public.nexus_create_controlled_customer_inquiry(
        uuid,
        text,
        text,
        text,
        text,
        text,
        bigint
    )
is
    'Atomically creates one tenant-bound customer inquiry or returns its safe idempotent duplicate.';

commit;
