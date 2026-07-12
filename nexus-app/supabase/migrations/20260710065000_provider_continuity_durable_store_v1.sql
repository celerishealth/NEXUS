begin;

create table if not exists public.nexus_provider_continuity_scope_counters (
  tenant_id text not null,
  provider_domain text not null
    check (
      provider_domain in (
        'database',
        'ai',
        'messaging',
        'payments'
      )
    ),
  latest_fence_token bigint not null default 0
    check (latest_fence_token >= 0),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, provider_domain)
);

create table if not exists public.nexus_provider_continuity_leases (
  tenant_id text not null,
  provider_domain text not null
    check (
      provider_domain in (
        'database',
        'ai',
        'messaging',
        'payments'
      )
    ),
  lease_id text not null,
  owner_id text not null,
  fence_token bigint not null
    check (fence_token > 0),
  acquired_at timestamptz not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, provider_domain),
  check (expires_at > acquired_at)
);

create table if not exists public.nexus_provider_continuity_records (
  tenant_id text not null,
  provider_domain text not null
    check (
      provider_domain in (
        'database',
        'ai',
        'messaging',
        'payments'
      )
    ),
  record_kind text not null
    check (
      record_kind in (
        'recovery',
        'incident',
        'containment',
        'telemetry',
        'replay-idempotency'
      )
    ),
  record_id text not null,
  version bigint not null
    check (version > 0),
  payload jsonb not null,
  updated_at timestamptz not null,
  last_fence_token bigint not null
    check (last_fence_token > 0),
  primary key (
    tenant_id,
    provider_domain,
    record_kind,
    record_id
  )
);

create index if not exists
  nexus_provider_continuity_records_scope_updated_idx
on public.nexus_provider_continuity_records (
  tenant_id,
  provider_domain,
  record_kind,
  updated_at desc
);

alter table
  public.nexus_provider_continuity_scope_counters
enable row level security;

alter table
  public.nexus_provider_continuity_leases
enable row level security;

alter table
  public.nexus_provider_continuity_records
enable row level security;

alter table
  public.nexus_provider_continuity_scope_counters
force row level security;

alter table
  public.nexus_provider_continuity_leases
force row level security;

alter table
  public.nexus_provider_continuity_records
force row level security;

revoke all on table
  public.nexus_provider_continuity_scope_counters
from public, anon, authenticated;

revoke all on table
  public.nexus_provider_continuity_leases
from public, anon, authenticated;

revoke all on table
  public.nexus_provider_continuity_records
from public, anon, authenticated;

create or replace function
  public.nexus_read_provider_continuity_record(
    p_tenant_id text,
    p_provider_domain text,
    p_record_kind text,
    p_record_id text
  )
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record
    public.nexus_provider_continuity_records%rowtype;
begin
  if nullif(trim(p_tenant_id), '') is null then
    raise exception 'tenantId is required';
  end if;

  if nullif(trim(p_record_id), '') is null then
    raise exception 'recordId is required';
  end if;

  select *
  into v_record
  from public.nexus_provider_continuity_records
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
    and record_kind = p_record_kind
    and record_id = trim(p_record_id);

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'tenantId', v_record.tenant_id,
    'providerDomain', v_record.provider_domain,
    'kind', v_record.record_kind,
    'recordId', v_record.record_id,
    'version', v_record.version,
    'payload', v_record.payload,
    'updatedAt',
      floor(
        extract(epoch from v_record.updated_at) * 1000
      )::bigint,
    'lastFenceToken', v_record.last_fence_token
  );
end;
$$;

create or replace function
  public.nexus_acquire_provider_continuity_lease(
    p_tenant_id text,
    p_provider_domain text,
    p_lease_id text,
    p_owner_id text,
    p_ttl_ms integer,
    p_now timestamptz
  )
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing
    public.nexus_provider_continuity_leases%rowtype;
  v_lease
    public.nexus_provider_continuity_leases%rowtype;
  v_fence_token bigint;
begin
  if nullif(trim(p_tenant_id), '') is null then
    raise exception 'tenantId is required';
  end if;

  if nullif(trim(p_lease_id), '') is null then
    raise exception 'leaseId is required';
  end if;

  if nullif(trim(p_owner_id), '') is null then
    raise exception 'ownerId is required';
  end if;

  if p_ttl_ms is null or p_ttl_ms < 1 then
    raise exception 'ttlMs must be a positive integer';
  end if;

  insert into
    public.nexus_provider_continuity_scope_counters (
      tenant_id,
      provider_domain,
      latest_fence_token,
      updated_at
    )
  values (
    trim(p_tenant_id),
    p_provider_domain,
    0,
    p_now
  )
  on conflict (tenant_id, provider_domain)
  do nothing;

  select latest_fence_token
  into v_fence_token
  from public.nexus_provider_continuity_scope_counters
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
  for update;

  select *
  into v_existing
  from public.nexus_provider_continuity_leases
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
  for update;

  if found and v_existing.expires_at > p_now then
    if
      v_existing.lease_id = trim(p_lease_id)
      and v_existing.owner_id = trim(p_owner_id)
    then
      return jsonb_build_object(
        'acquired', true,
        'lease', jsonb_build_object(
          'leaseId', v_existing.lease_id,
          'ownerId', v_existing.owner_id,
          'tenantId', v_existing.tenant_id,
          'providerDomain',
            v_existing.provider_domain,
          'fenceToken', v_existing.fence_token,
          'acquiredAt',
            floor(
              extract(
                epoch from v_existing.acquired_at
              ) * 1000
            )::bigint,
          'expiresAt',
            floor(
              extract(
                epoch from v_existing.expires_at
              ) * 1000
            )::bigint
        )
      );
    end if;

    return jsonb_build_object(
      'acquired', false,
      'code', 'LEASE_ALREADY_HELD',
      'activeLease', jsonb_build_object(
        'leaseId', v_existing.lease_id,
        'ownerId', v_existing.owner_id,
        'tenantId', v_existing.tenant_id,
        'providerDomain',
          v_existing.provider_domain,
        'fenceToken', v_existing.fence_token,
        'acquiredAt',
          floor(
            extract(
              epoch from v_existing.acquired_at
            ) * 1000
          )::bigint,
        'expiresAt',
          floor(
            extract(
              epoch from v_existing.expires_at
            ) * 1000
          )::bigint
      )
    );
  end if;

  update
    public.nexus_provider_continuity_scope_counters
  set
    latest_fence_token =
      latest_fence_token + 1,
    updated_at = p_now
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
  returning latest_fence_token
  into v_fence_token;

  insert into
    public.nexus_provider_continuity_leases (
      tenant_id,
      provider_domain,
      lease_id,
      owner_id,
      fence_token,
      acquired_at,
      expires_at,
      updated_at
    )
  values (
    trim(p_tenant_id),
    p_provider_domain,
    trim(p_lease_id),
    trim(p_owner_id),
    v_fence_token,
    p_now,
    p_now +
      make_interval(
        secs => p_ttl_ms::double precision / 1000
      ),
    p_now
  )
  on conflict (tenant_id, provider_domain)
  do update set
    lease_id = excluded.lease_id,
    owner_id = excluded.owner_id,
    fence_token = excluded.fence_token,
    acquired_at = excluded.acquired_at,
    expires_at = excluded.expires_at,
    updated_at = excluded.updated_at;

  select *
  into strict v_lease
  from public.nexus_provider_continuity_leases
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain;

  return jsonb_build_object(
    'acquired', true,
    'lease', jsonb_build_object(
      'leaseId', v_lease.lease_id,
      'ownerId', v_lease.owner_id,
      'tenantId', v_lease.tenant_id,
      'providerDomain', v_lease.provider_domain,
      'fenceToken', v_lease.fence_token,
      'acquiredAt',
        floor(
          extract(epoch from v_lease.acquired_at) * 1000
        )::bigint,
      'expiresAt',
        floor(
          extract(epoch from v_lease.expires_at) * 1000
        )::bigint
    )
  );
end;
$$;

create or replace function
  public.nexus_release_provider_continuity_lease(
    p_tenant_id text,
    p_provider_domain text,
    p_lease_id text,
    p_owner_id text,
    p_fence_token bigint,
    p_now timestamptz
  )
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from
    public.nexus_provider_continuity_leases
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
    and lease_id = trim(p_lease_id)
    and owner_id = trim(p_owner_id)
    and fence_token = p_fence_token;

  return found;
end;
$$;

create or replace function
  public.nexus_compare_and_swap_provider_continuity_record(
    p_tenant_id text,
    p_provider_domain text,
    p_record_kind text,
    p_record_id text,
    p_expected_version bigint,
    p_payload jsonb,
    p_lease_id text,
    p_owner_id text,
    p_fence_token bigint,
    p_now timestamptz
  )
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_latest_fence_token bigint;
  v_active_lease
    public.nexus_provider_continuity_leases%rowtype;
  v_current
    public.nexus_provider_continuity_records%rowtype;
  v_record
    public.nexus_provider_continuity_records%rowtype;
  v_next_version bigint;
begin
  if nullif(trim(p_tenant_id), '') is null then
    raise exception 'tenantId is required';
  end if;

  if nullif(trim(p_record_id), '') is null then
    raise exception 'recordId is required';
  end if;

  select latest_fence_token
  into v_latest_fence_token
  from public.nexus_provider_continuity_scope_counters
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
  for update;

  select *
  into v_current
  from public.nexus_provider_continuity_records
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
    and record_kind = p_record_kind
    and record_id = trim(p_record_id)
  for update;

  if
    v_latest_fence_token is null
    or p_fence_token < v_latest_fence_token
  then
    return jsonb_build_object(
      'applied', false,
      'code', 'STALE_FENCE_TOKEN',
      'currentRecord',
        case
          when v_current.record_id is null
            then null
          else jsonb_build_object(
            'tenantId', v_current.tenant_id,
            'providerDomain',
              v_current.provider_domain,
            'kind', v_current.record_kind,
            'recordId', v_current.record_id,
            'version', v_current.version,
            'payload', v_current.payload,
            'updatedAt',
              floor(
                extract(
                  epoch from v_current.updated_at
                ) * 1000
              )::bigint,
            'lastFenceToken',
              v_current.last_fence_token
          )
        end
    );
  end if;

  select *
  into v_active_lease
  from public.nexus_provider_continuity_leases
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
  for update;

  if
    v_active_lease.lease_id is null
    or v_active_lease.expires_at <= p_now
    or v_active_lease.lease_id <> trim(p_lease_id)
    or v_active_lease.owner_id <> trim(p_owner_id)
    or v_active_lease.fence_token <> p_fence_token
  then
    return jsonb_build_object(
      'applied', false,
      'code', 'LEASE_INVALID',
      'currentRecord',
        case
          when v_current.record_id is null
            then null
          else jsonb_build_object(
            'tenantId', v_current.tenant_id,
            'providerDomain',
              v_current.provider_domain,
            'kind', v_current.record_kind,
            'recordId', v_current.record_id,
            'version', v_current.version,
            'payload', v_current.payload,
            'updatedAt',
              floor(
                extract(
                  epoch from v_current.updated_at
                ) * 1000
              )::bigint,
            'lastFenceToken',
              v_current.last_fence_token
          )
        end
    );
  end if;

  if
    (
      p_expected_version is null
      and v_current.record_id is not null
    )
    or
    (
      p_expected_version is not null
      and (
        v_current.record_id is null
        or v_current.version <>
          p_expected_version
      )
    )
  then
    return jsonb_build_object(
      'applied', false,
      'code', 'VERSION_CONFLICT',
      'currentRecord',
        case
          when v_current.record_id is null
            then null
          else jsonb_build_object(
            'tenantId', v_current.tenant_id,
            'providerDomain',
              v_current.provider_domain,
            'kind', v_current.record_kind,
            'recordId', v_current.record_id,
            'version', v_current.version,
            'payload', v_current.payload,
            'updatedAt',
              floor(
                extract(
                  epoch from v_current.updated_at
                ) * 1000
              )::bigint,
            'lastFenceToken',
              v_current.last_fence_token
          )
        end
    );
  end if;

  v_next_version =
    coalesce(v_current.version, 0) + 1;

  insert into
    public.nexus_provider_continuity_records (
      tenant_id,
      provider_domain,
      record_kind,
      record_id,
      version,
      payload,
      updated_at,
      last_fence_token
    )
  values (
    trim(p_tenant_id),
    p_provider_domain,
    p_record_kind,
    trim(p_record_id),
    v_next_version,
    p_payload,
    p_now,
    p_fence_token
  )
  on conflict (
    tenant_id,
    provider_domain,
    record_kind,
    record_id
  )
  do update set
    version = excluded.version,
    payload = excluded.payload,
    updated_at = excluded.updated_at,
    last_fence_token =
      excluded.last_fence_token;

  select *
  into strict v_record
  from public.nexus_provider_continuity_records
  where tenant_id = trim(p_tenant_id)
    and provider_domain = p_provider_domain
    and record_kind = p_record_kind
    and record_id = trim(p_record_id);

  return jsonb_build_object(
    'applied', true,
    'record', jsonb_build_object(
      'tenantId', v_record.tenant_id,
      'providerDomain', v_record.provider_domain,
      'kind', v_record.record_kind,
      'recordId', v_record.record_id,
      'version', v_record.version,
      'payload', v_record.payload,
      'updatedAt',
        floor(
          extract(epoch from v_record.updated_at) * 1000
        )::bigint,
      'lastFenceToken',
        v_record.last_fence_token
    )
  );
end;
$$;

revoke all on function
  public.nexus_read_provider_continuity_record(
    text,
    text,
    text,
    text
  )
from public, anon, authenticated;

revoke all on function
  public.nexus_acquire_provider_continuity_lease(
    text,
    text,
    text,
    text,
    integer,
    timestamptz
  )
from public, anon, authenticated;

revoke all on function
  public.nexus_release_provider_continuity_lease(
    text,
    text,
    text,
    text,
    bigint,
    timestamptz
  )
from public, anon, authenticated;

revoke all on function
  public.nexus_compare_and_swap_provider_continuity_record(
    text,
    text,
    text,
    text,
    bigint,
    jsonb,
    text,
    text,
    bigint,
    timestamptz
  )
from public, anon, authenticated;

grant execute on function
  public.nexus_read_provider_continuity_record(
    text,
    text,
    text,
    text
  )
to service_role;

grant execute on function
  public.nexus_acquire_provider_continuity_lease(
    text,
    text,
    text,
    text,
    integer,
    timestamptz
  )
to service_role;

grant execute on function
  public.nexus_release_provider_continuity_lease(
    text,
    text,
    text,
    text,
    bigint,
    timestamptz
  )
to service_role;

grant execute on function
  public.nexus_compare_and_swap_provider_continuity_record(
    text,
    text,
    text,
    text,
    bigint,
    jsonb,
    text,
    text,
    bigint,
    timestamptz
  )
to service_role;

commit;
