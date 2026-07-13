begin;

set transaction read only;

do $catalog_gate$
declare
  expected_tables constant text[] := array[
    'nexus_controlled_customer_inquiries',
    'nexus_controlled_customer_recommendation_decisions',
    'nexus_controlled_customer_recommendations',
    'nexus_controlled_customer_sandbox_executions',
    'nexus_controlled_pilot_health_pause_events',
    'nexus_controlled_pilot_operation_states',
    'nexus_controlled_pilot_resume_audit_events',
    'nexus_controlled_pilot_resume_proof_consumptions',
    'nexus_provider_continuity_leases',
    'nexus_provider_continuity_records',
    'nexus_provider_continuity_scope_counters'
  ];

  expected_functions constant text[] := array[
    'nexus_acquire_provider_continuity_lease',
    'nexus_append_controlled_pilot_resume_audit_event',
    'nexus_commit_controlled_pilot_health_pause',
    'nexus_commit_controlled_pilot_resume',
    'nexus_commit_controlled_pilot_state_resume',
    'nexus_compare_and_swap_provider_continuity_record',
    'nexus_consume_controlled_pilot_resume_proof',
    'nexus_create_controlled_customer_inquiry',
    'nexus_create_sandbox_customer_recommendation',
    'nexus_decide_controlled_customer_recommendation',
    'nexus_execute_approved_customer_recommendation_sandbox',
    'nexus_get_provider_continuity_store_readiness',
    'nexus_list_active_provider_containments',
    'nexus_read_controlled_pilot_operation_state',
    'nexus_read_provider_continuity_record',
    'nexus_release_provider_continuity_lease'
  ];

  finding_count integer;
begin
  select count(*)
  into finding_count
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n
    on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and c.relname = any(expected_tables);

  if finding_count <> 11 then
    raise exception
      'Expected 11 protected public tables, found %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n
    on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = any(expected_tables)
    and not c.relrowsecurity;

  if finding_count <> 0 then
    raise exception
      'Protected tables missing RLS: %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_policy policy
  join pg_catalog.pg_class c
    on c.oid = policy.polrelid
  join pg_catalog.pg_namespace n
    on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = any(expected_tables);

  if finding_count <> 0 then
    raise exception
      'Unexpected RLS policies found: %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n
    on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prokind = 'f'
    and p.proname = any(expected_functions);

  if finding_count <> 16 then
    raise exception
      'Expected 16 protected functions, found %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n
    on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = any(expected_functions)
    and not p.prosecdef;

  if finding_count <> 0 then
    raise exception
      'Functions missing SECURITY DEFINER: %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n
    on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = any(expected_functions)
    and not exists (
      select 1
      from unnest(
        coalesce(
          p.proconfig,
          array[]::text[]
        )
      ) as setting
      where setting like 'search_path=%'
    );

  if finding_count <> 0 then
    raise exception
      'Functions missing explicit search_path: %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n
    on n.oid = p.pronamespace
  cross join lateral pg_catalog.aclexplode(
    coalesce(
      p.proacl,
      pg_catalog.acldefault(
        'f',
        p.proowner
      )
    )
  ) acl
  left join pg_catalog.pg_roles role
    on role.oid = acl.grantee
  where n.nspname = 'public'
    and p.proname = any(expected_functions)
    and acl.privilege_type = 'EXECUTE'
    and (
      acl.grantee = 0
      or role.rolname in (
        'anon',
        'authenticated'
      )
    );

  if finding_count <> 0 then
    raise exception
      'Unsafe function execute grants found: %.',
      finding_count;
  end if;

  select count(distinct p.oid)
  into finding_count
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n
    on n.oid = p.pronamespace
  cross join lateral pg_catalog.aclexplode(
    coalesce(
      p.proacl,
      pg_catalog.acldefault(
        'f',
        p.proowner
      )
    )
  ) acl
  join pg_catalog.pg_roles role
    on role.oid = acl.grantee
  where n.nspname = 'public'
    and p.proname = any(expected_functions)
    and acl.privilege_type = 'EXECUTE'
    and role.rolname = 'service_role';

  if finding_count <> 16 then
    raise exception
      'Expected service_role execute on 16 functions, found %.',
      finding_count;
  end if;

  select count(*)
  into finding_count
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n
    on n.oid = c.relnamespace
  cross join lateral pg_catalog.aclexplode(
    coalesce(
      c.relacl,
      pg_catalog.acldefault(
        'r',
        c.relowner
      )
    )
  ) acl
  left join pg_catalog.pg_roles role
    on role.oid = acl.grantee
  where n.nspname = 'public'
    and c.relname = any(expected_tables)
    and (
      acl.grantee = 0
      or role.rolname in (
        'anon',
        'authenticated'
      )
    );

  if finding_count <> 0 then
    raise exception
      'Unsafe direct table grants found: %.',
      finding_count;
  end if;

  select count(distinct c.oid)
  into finding_count
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n
    on n.oid = c.relnamespace
  cross join lateral pg_catalog.aclexplode(
    coalesce(
      c.relacl,
      pg_catalog.acldefault(
        'r',
        c.relowner
      )
    )
  ) acl
  join pg_catalog.pg_roles role
    on role.oid = acl.grantee
  where n.nspname = 'public'
    and c.relname = any(expected_tables)
    and role.rolname = 'service_role';

  if finding_count <> 7 then
    raise exception
      'Expected direct service_role access on 7 tables, found %.',
      finding_count;
  end if;

  raise notice 'APPLIED CATALOG SECURITY GATE: PASS';
  raise notice 'PROTECTED TABLES / RLS: 11/11';
  raise notice 'PROTECTED FUNCTIONS: 16/16';
  raise notice 'DIRECT / FUNCTION-ONLY TABLES: 7/4';
  raise notice 'UNSAFE APPLIED GRANTS: 0';
end;
$catalog_gate$;

commit;