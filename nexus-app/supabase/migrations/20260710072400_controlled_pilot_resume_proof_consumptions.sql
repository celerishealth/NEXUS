begin;

create table if not exists public.nexus_controlled_pilot_resume_proof_consumptions (
    token_id uuid primary key,
    tenant_id text not null,
    signal_id text not null,
    owner_id text not null,
    issued_at_epoch bigint not null,
    expires_at_epoch bigint not null,
    consumed_at_epoch bigint not null,
    consumption_attempt_id uuid not null unique,
    created_at timestamptz not null default timezone('utc', now()),

    constraint nexus_resume_consumption_tenant_not_blank
        check (length(trim(tenant_id)) > 0),

    constraint nexus_resume_consumption_signal_not_blank
        check (length(trim(signal_id)) > 0),

    constraint nexus_resume_consumption_owner_not_blank
        check (length(trim(owner_id)) > 0),

    constraint nexus_resume_consumption_valid_lifetime
        check (expires_at_epoch > issued_at_epoch),

    constraint nexus_resume_consumption_valid_consumed_time
        check (
            consumed_at_epoch >= issued_at_epoch
            and consumed_at_epoch < expires_at_epoch
        )
);

create index if not exists
    nexus_resume_consumption_tenant_signal_idx
on public.nexus_controlled_pilot_resume_proof_consumptions (
    tenant_id,
    signal_id,
    consumed_at_epoch desc
);

create index if not exists
    nexus_resume_consumption_expiry_idx
on public.nexus_controlled_pilot_resume_proof_consumptions (
    expires_at_epoch
);

alter table
    public.nexus_controlled_pilot_resume_proof_consumptions
enable row level security;

alter table
    public.nexus_controlled_pilot_resume_proof_consumptions
force row level security;

revoke all
on table public.nexus_controlled_pilot_resume_proof_consumptions
from public;

do $$
begin
    if exists (
        select 1
        from pg_roles
        where rolname = 'anon'
    ) then
        execute
            'revoke all on table public.nexus_controlled_pilot_resume_proof_consumptions from anon';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'authenticated'
    ) then
        execute
            'revoke all on table public.nexus_controlled_pilot_resume_proof_consumptions from authenticated';
    end if;

    if exists (
        select 1
        from pg_roles
        where rolname = 'service_role'
    ) then
        execute
            'grant select, insert, update on table public.nexus_controlled_pilot_resume_proof_consumptions to service_role';
    end if;
end
$$;

comment on table
    public.nexus_controlled_pilot_resume_proof_consumptions
is
    'Server-only, tenant-bound, atomic consume-once ledger for controlled pilot owner resume proofs.';

comment on column
    public.nexus_controlled_pilot_resume_proof_consumptions.consumption_attempt_id
is
    'Unique database attempt identifier used to distinguish first consumption from replay under atomic upsert.';

commit;
