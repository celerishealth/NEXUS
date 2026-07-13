START TRANSACTION READ ONLY;

DO $runtime_read_only_guard$
BEGIN
  IF current_setting('transaction_read_only') <> 'on' THEN
    RAISE EXCEPTION 'NEXUS runtime interface verification requires a read-only transaction.';
  END IF;
END
$runtime_read_only_guard$;

WITH
expected_tables(object_name) AS (
  VALUES
    ('nexus_controlled_customer_inquiries'),
    ('nexus_controlled_customer_recommendation_decisions'),
    ('nexus_controlled_customer_recommendations'),
    ('nexus_controlled_customer_sandbox_executions'),
    ('nexus_controlled_pilot_health_pause_events'),
    ('nexus_controlled_pilot_operation_states'),
    ('nexus_controlled_pilot_resume_audit_events'),
    ('nexus_controlled_pilot_resume_proof_consumptions'),
    ('nexus_provider_continuity_leases'),
    ('nexus_provider_continuity_records'),
    ('nexus_provider_continuity_scope_counters')
),
expected_functions(object_name) AS (
  VALUES
    ('nexus_acquire_provider_continuity_lease'),
    ('nexus_append_controlled_pilot_resume_audit_event'),
    ('nexus_commit_controlled_pilot_health_pause'),
    ('nexus_commit_controlled_pilot_resume'),
    ('nexus_commit_controlled_pilot_state_resume'),
    ('nexus_compare_and_swap_provider_continuity_record'),
    ('nexus_consume_controlled_pilot_resume_proof'),
    ('nexus_create_controlled_customer_inquiry'),
    ('nexus_create_sandbox_customer_recommendation'),
    ('nexus_decide_controlled_customer_recommendation'),
    ('nexus_execute_approved_customer_recommendation_sandbox'),
    ('nexus_get_provider_continuity_store_readiness'),
    ('nexus_list_active_provider_containments'),
    ('nexus_read_controlled_pilot_operation_state'),
    ('nexus_read_provider_continuity_record'),
    ('nexus_release_provider_continuity_lease')
),
table_objects AS (
  SELECT
    expected.object_name,
    relation.oid,
    relation.relkind,
    relation.relpersistence,
    relation.relrowsecurity,
    relation.relforcerowsecurity,
    relation.relreplident
  FROM expected_tables AS expected
  JOIN pg_namespace AS namespace
    ON namespace.nspname = 'public'
  JOIN pg_class AS relation
    ON relation.relnamespace = namespace.oid
   AND relation.relname = expected.object_name
   AND relation.relkind IN ('r', 'p')
),
function_objects AS (
  SELECT
    expected.object_name,
    procedure.oid,
    procedure.provolatile,
    procedure.proisstrict,
    procedure.prosecdef,
    procedure.proparallel,
    procedure.pronargdefaults,
    procedure.proconfig,
    procedure.prosrc,
    language.lanname
  FROM expected_functions AS expected
  JOIN pg_namespace AS namespace
    ON namespace.nspname = 'public'
  JOIN pg_proc AS procedure
    ON procedure.pronamespace = namespace.oid
   AND procedure.proname = expected.object_name
  JOIN pg_language AS language
    ON language.oid = procedure.prolang
),
inventory AS (
  SELECT
    (SELECT count(*) FROM expected_tables) AS expected_table_count,
    (SELECT count(*) FROM table_objects) AS applied_table_count,
    (SELECT count(*) FROM expected_functions) AS expected_function_count,
    (SELECT count(*) FROM function_objects) AS applied_function_count
),
inventory_guard AS (
  SELECT
    1 / CASE
      WHEN expected_table_count = applied_table_count
       AND expected_function_count = applied_function_count
      THEN 1
      ELSE 0
    END AS verified
  FROM inventory
),
runtime_lines(line) AS (
  SELECT format(
    'TABLE|%s|KIND=%s|PERSISTENCE=%s|RLS=%s|FORCE_RLS=%s|REPLICA_IDENTITY=%s',
    table_object.object_name,
    table_object.relkind,
    table_object.relpersistence,
    table_object.relrowsecurity,
    table_object.relforcerowsecurity,
    table_object.relreplident
  )
  FROM table_objects AS table_object

  UNION ALL

  SELECT format(
    'COLUMN|%s|POSITION=%s|NAME=%s|TYPE=%s|NOT_NULL=%s|IDENTITY=%s|GENERATED=%s|COLLATION=%s|DEFAULT=%s',
    table_object.object_name,
    attribute.attnum,
    attribute.attname,
    format_type(attribute.atttypid, attribute.atttypmod),
    attribute.attnotnull,
    attribute.attidentity,
    attribute.attgenerated,
    COALESCE(collation.collname, ''),
    COALESCE(pg_get_expr(attribute_default.adbin, attribute_default.adrelid, false), '')
  )
  FROM table_objects AS table_object
  JOIN pg_attribute AS attribute
    ON attribute.attrelid = table_object.oid
   AND attribute.attnum > 0
   AND NOT attribute.attisdropped
  LEFT JOIN pg_attrdef AS attribute_default
    ON attribute_default.adrelid = attribute.attrelid
   AND attribute_default.adnum = attribute.attnum
  LEFT JOIN pg_collation AS collation
    ON collation.oid = attribute.attcollation
   AND attribute.attcollation <> 0

  UNION ALL

  SELECT format(
    'CONSTRAINT|%s|NAME=%s|TYPE=%s|DEFINITION=%s',
    table_object.object_name,
    constraint_object.conname,
    constraint_object.contype,
    pg_get_constraintdef(constraint_object.oid, false)
  )
  FROM table_objects AS table_object
  JOIN pg_constraint AS constraint_object
    ON constraint_object.conrelid = table_object.oid

  UNION ALL

  SELECT format(
    'INDEX|%s|NAME=%s|DEFINITION=%s',
    table_object.object_name,
    index_relation.relname,
    pg_get_indexdef(index_object.indexrelid, 0, false)
  )
  FROM table_objects AS table_object
  JOIN pg_index AS index_object
    ON index_object.indrelid = table_object.oid
  JOIN pg_class AS index_relation
    ON index_relation.oid = index_object.indexrelid

  UNION ALL

  SELECT format(
    'TRIGGER|%s|NAME=%s|DEFINITION=%s',
    table_object.object_name,
    trigger_object.tgname,
    pg_get_triggerdef(trigger_object.oid, false)
  )
  FROM table_objects AS table_object
  JOIN pg_trigger AS trigger_object
    ON trigger_object.tgrelid = table_object.oid
   AND NOT trigger_object.tgisinternal

  UNION ALL

  SELECT format(
    'FUNCTION|%s|ARGS=%s|RESULT=%s|LANGUAGE=%s|VOLATILITY=%s|STRICT=%s|SECURITY_DEFINER=%s|PARALLEL=%s|CONFIG=%s|DEFAULT_COUNT=%s|BODY_MD5=%s',
    function_object.object_name,
    pg_get_function_identity_arguments(function_object.oid),
    pg_get_function_result(function_object.oid),
    function_object.lanname,
    function_object.provolatile,
    function_object.proisstrict,
    function_object.prosecdef,
    function_object.proparallel,
    COALESCE(
      (
        SELECT string_agg(config_item, ',' ORDER BY config_item)
        FROM unnest(
          COALESCE(function_object.proconfig, ARRAY[]::text[])
        ) AS config_values(config_item)
      ),
      ''
    ),
    function_object.pronargdefaults,
    md5(function_object.prosrc)
  )
  FROM function_objects AS function_object
),
canonical_runtime_interface AS (
  SELECT string_agg(line, E'\n' ORDER BY line) AS value
  FROM runtime_lines
),
results(ordinal, result) AS (
  SELECT
    1,
    format(
      'NEXUS_RUNTIME_INTERFACE_INVENTORY=%s_TABLES/%s_FUNCTIONS',
      inventory.applied_table_count,
      inventory.applied_function_count
    )
  FROM inventory

  UNION ALL

  SELECT
    2,
    'NEXUS_RUNTIME_INTERFACE_FINGERPRINT=' || md5(canonical_runtime_interface.value)
  FROM canonical_runtime_interface
)
SELECT results.result
FROM results
CROSS JOIN inventory_guard
ORDER BY results.ordinal;

ROLLBACK;
