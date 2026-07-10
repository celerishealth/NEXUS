begin;

create or replace function
  public.nexus_get_provider_continuity_store_readiness()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_tables_present boolean := false;
  v_required_functions_present boolean := false;
  v_rls_enabled boolean := false;
  v_force_rls_enabled boolean := false;
  v_service_role_only boolean := false;
  v_ready boolean := false;
begin
  v_tables_present :=
    to_regclass(
      'public.nexus_provider_continuity_scope_counters'
    ) is not null
    and
    to_regclass(
      'public.nexus_provider_continuity_leases'
    ) is not null
    and
    to_regclass(
      'public.nexus_provider_continuity_records'
    ) is not null;

  v_required_functions_present :=
    to_regprocedure(
      'public.nexus_read_provider_continuity_record(text,text,text,text)'
    ) is not null
    and
    to_regprocedure(
      'public.nexus_acquire_provider_continuity_lease(text,text,text,text,integer,timestamp with time zone)'
    ) is not null
    and
    to_regprocedure(
      'public.nexus_release_provider_continuity_lease(text,text,text,text,bigint,timestamp with time zone)'
    ) is not null
    and
    to_regprocedure(
      'public.nexus_compare_and_swap_provider_continuity_record(text,text,text,text,bigint,jsonb,text,text,bigint,timestamp with time zone)'
    ) is not null;

  if v_tables_present then
    select
      count(*) = 3
      and bool_and(c.relrowsecurity),
      count(*) = 3
      and bool_and(c.relforcerowsecurity)
    into
      v_rls_enabled,
      v_force_rls_enabled
    from pg_class c
    join pg_namespace n
      on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'nexus_provider_continuity_scope_counters',
        'nexus_provider_continuity_leases',
        'nexus_provider_continuity_records'
      );
  end if;

  if v_required_functions_present then
    v_service_role_only :=
      not has_function_privilege(
        'anon',
        'public.nexus_read_provider_continuity_record(text,text,text,text)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'authenticated',
        'public.nexus_read_provider_continuity_record(text,text,text,text)',
        'EXECUTE'
      )
      and
      has_function_privilege(
        'service_role',
        'public.nexus_read_provider_continuity_record(text,text,text,text)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'anon',
        'public.nexus_acquire_provider_continuity_lease(text,text,text,text,integer,timestamp with time zone)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'authenticated',
        'public.nexus_acquire_provider_continuity_lease(text,text,text,text,integer,timestamp with time zone)',
        'EXECUTE'
      )
      and
      has_function_privilege(
        'service_role',
        'public.nexus_acquire_provider_continuity_lease(text,text,text,text,integer,timestamp with time zone)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'anon',
        'public.nexus_release_provider_continuity_lease(text,text,text,text,bigint,timestamp with time zone)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'authenticated',
        'public.nexus_release_provider_continuity_lease(text,text,text,text,bigint,timestamp with time zone)',
        'EXECUTE'
      )
      and
      has_function_privilege(
        'service_role',
        'public.nexus_release_provider_continuity_lease(text,text,text,text,bigint,timestamp with time zone)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'anon',
        'public.nexus_compare_and_swap_provider_continuity_record(text,text,text,text,bigint,jsonb,text,text,bigint,timestamp with time zone)',
        'EXECUTE'
      )
      and
      not has_function_privilege(
        'authenticated',
        'public.nexus_compare_and_swap_provider_continuity_record(text,text,text,text,bigint,jsonb,text,text,bigint,timestamp with time zone)',
        'EXECUTE'
      )
      and
      has_function_privilege(
        'service_role',
        'public.nexus_compare_and_swap_provider_continuity_record(text,text,text,text,bigint,jsonb,text,text,bigint,timestamp with time zone)',
        'EXECUTE'
      );
  end if;

  v_ready :=
    v_tables_present
    and v_required_functions_present
    and v_rls_enabled
    and v_force_rls_enabled
    and v_service_role_only;

  return jsonb_build_object(
    'schemaVersion',
      'provider-continuity-durable-store-v1',
    'ready',
      v_ready,
    'checks',
      jsonb_build_object(
        'tablesPresent',
          v_tables_present,
        'requiredFunctionsPresent',
          v_required_functions_present,
        'rowLevelSecurityEnabled',
          v_rls_enabled,
        'forceRowLevelSecurityEnabled',
          v_force_rls_enabled,
        'serviceRoleOnlyExecution',
          v_service_role_only
      )
  );
end;
$$;

revoke all on function
  public.nexus_get_provider_continuity_store_readiness()
from public, anon, authenticated;

grant execute on function
  public.nexus_get_provider_continuity_store_readiness()
to service_role;

commit;
