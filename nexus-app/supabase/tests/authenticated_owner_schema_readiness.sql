START TRANSACTION READ ONLY;

DO $authenticated_owner_schema_readiness$
DECLARE
  expected_constraint_names CONSTANT text[] := ARRAY[
    'nexus_authenticated_owner_credentials_pk',
    'nexus_authenticated_owner_credentials_membership_fk',
    'nexus_authenticated_owner_credentials_email_unique',
    'nexus_authenticated_owner_credentials_email_check',
    'nexus_authenticated_owner_credentials_salt_check',
    'nexus_authenticated_owner_credentials_hash_check',
    'nexus_authenticated_owner_credentials_status_check',
    'nexus_authenticated_owner_credentials_version_check',
    'nexus_authenticated_owner_credentials_failure_check',
    'nexus_authenticated_owner_credentials_lock_check',
    'nexus_authenticated_owner_sessions_pk',
    'nexus_authenticated_owner_sessions_id_unique',
    'nexus_authenticated_owner_sessions_membership_fk',
    'nexus_authenticated_owner_sessions_id_check',
    'nexus_authenticated_owner_sessions_digest_check',
    'nexus_authenticated_owner_sessions_authority_check',
    'nexus_authenticated_owner_sessions_role_check',
    'nexus_authenticated_owner_sessions_expiry_check',
    'nexus_authenticated_owner_sessions_revocation_check'
  ];

  expected_index_names CONSTANT text[] := ARRAY[
    'nexus_authenticated_owner_credentials_login_idx',
    'nexus_authenticated_owner_sessions_active_lookup_idx',
    'nexus_authenticated_owner_sessions_owner_idx'
  ];

  finding_count integer;
BEGIN
  IF current_setting('transaction_read_only') <> 'on' THEN
    RAISE EXCEPTION
      'Authenticated-owner schema readiness requires a read-only transaction.';
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_class AS relation
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
  WHERE namespace.nspname = 'public'
    AND relation.relkind IN ('r', 'p')
    AND relation.relname IN (
      'nexus_authenticated_owner_credentials',
      'nexus_authenticated_owner_sessions'
    );

  IF finding_count <> 2 THEN
    RAISE EXCEPTION
      'Expected two authenticated-owner tables, found %.',
      finding_count;
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_class AS relation
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
  WHERE namespace.nspname = 'public'
    AND relation.relname IN (
      'nexus_authenticated_owner_credentials',
      'nexus_authenticated_owner_sessions'
    )
    AND relation.relkind IN ('r', 'p')
    AND relation.relrowsecurity
    AND relation.relforcerowsecurity;

  IF finding_count <> 2 THEN
    RAISE EXCEPTION
      'Authenticated-owner tables do not both enforce RLS.';
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_policy AS policy
  JOIN pg_catalog.pg_class AS relation
    ON relation.oid = policy.polrelid
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
  WHERE namespace.nspname = 'public'
    AND (
      (
        relation.relname =
          'nexus_authenticated_owner_credentials'
        AND policy.polname =
          'nexus_authenticated_owner_credentials_tenant_policy'
      )
      OR
      (
        relation.relname =
          'nexus_authenticated_owner_sessions'
        AND policy.polname =
          'nexus_authenticated_owner_sessions_tenant_policy'
      )
    )
    AND policy.polcmd = '*'
    AND position(
      'app.tenant_id'
      IN pg_catalog.pg_get_expr(
        policy.polqual,
        policy.polrelid,
        true
      )
    ) > 0
    AND position(
      'app.tenant_id'
      IN pg_catalog.pg_get_expr(
        policy.polwithcheck,
        policy.polrelid,
        true
      )
    ) > 0;

  IF finding_count <> 2 THEN
    RAISE EXCEPTION
      'Authenticated-owner tenant policies are incomplete or invalid.';
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_constraint AS constraint_object
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = constraint_object.connamespace
  WHERE namespace.nspname = 'public'
    AND constraint_object.conname =
      ANY(expected_constraint_names);

  IF finding_count <> 19 THEN
    RAISE EXCEPTION
      'Expected 19 authenticated-owner constraints, found %.',
      finding_count;
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_indexes
  WHERE schemaname = 'public'
    AND indexname =
      ANY(expected_index_names);

  IF finding_count <> 3 THEN
    RAISE EXCEPTION
      'Expected three authenticated-owner indexes, found %.',
      finding_count;
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_attribute AS attribute
  JOIN pg_catalog.pg_class AS relation
    ON relation.oid = attribute.attrelid
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
  WHERE namespace.nspname = 'public'
    AND relation.relname IN (
      'nexus_authenticated_owner_credentials',
      'nexus_authenticated_owner_sessions'
    )
    AND attribute.attnum > 0
    AND NOT attribute.attisdropped
    AND attribute.attname IN (
      'password_salt_hex',
      'password_hash_hex',
      'session_digest'
    );

  IF finding_count <> 3 THEN
    RAISE EXCEPTION
      'Authenticated-owner digest and hash columns are incomplete.';
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_attribute AS attribute
  JOIN pg_catalog.pg_class AS relation
    ON relation.oid = attribute.attrelid
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
  WHERE namespace.nspname = 'public'
    AND relation.relname IN (
      'nexus_authenticated_owner_credentials',
      'nexus_authenticated_owner_sessions'
    )
    AND attribute.attnum > 0
    AND NOT attribute.attisdropped
    AND attribute.attname IN (
      'password',
      'password_plaintext',
      'session_token',
      'raw_session_token'
    );

  IF finding_count <> 0 THEN
    RAISE EXCEPTION
      'Unsafe plaintext credential or raw-token columns were found.';
  END IF;

  SELECT count(*)
  INTO finding_count
  FROM pg_catalog.pg_class AS relation
  JOIN pg_catalog.pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
  CROSS JOIN LATERAL pg_catalog.aclexplode(
    coalesce(
      relation.relacl,
      pg_catalog.acldefault(
        'r',
        relation.relowner
      )
    )
  ) AS privilege
  LEFT JOIN pg_catalog.pg_roles AS grantee_role
    ON grantee_role.oid = privilege.grantee
  WHERE namespace.nspname = 'public'
    AND relation.relname IN (
      'nexus_authenticated_owner_credentials',
      'nexus_authenticated_owner_sessions'
    )
    AND (
      privilege.grantee = 0
      OR grantee_role.rolname IN (
        'anon',
        'authenticated'
      )
    );

  IF finding_count <> 0 THEN
    RAISE EXCEPTION
      'Unsafe public, anon or authenticated table privileges were found.';
  END IF;
END
$authenticated_owner_schema_readiness$;

SELECT
  'NEXUS_AUTHENTICATED_OWNER_SCHEMA_READINESS=2_TABLES/2_POLICIES/19_CONSTRAINTS/3_INDEXES';

ROLLBACK;
