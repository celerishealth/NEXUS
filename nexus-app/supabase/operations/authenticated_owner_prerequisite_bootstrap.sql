\set ON_ERROR_STOP on

BEGIN;

SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '30s';
SET LOCAL idle_in_transaction_session_timeout = '30s';

SET LOCAL nexus.bootstrap.tenant_id
  TO :'tenant_id';

SET LOCAL nexus.bootstrap.tenant_display_name
  TO :'tenant_display_name';

SET LOCAL nexus.bootstrap.owner_id
  TO :'owner_id';

SET LOCAL nexus.bootstrap.authority_epoch
  TO :'authority_epoch';

SELECT pg_advisory_xact_lock(
  hashtextextended(
    'NEXUS_AUTHENTICATED_OWNER_PREREQUISITE_BOOTSTRAP_V1',
    0
  )
);

DO $bootstrap$
DECLARE
  v_tenant_id TEXT :=
    current_setting(
      'nexus.bootstrap.tenant_id'
    );

  v_tenant_display_name TEXT :=
    current_setting(
      'nexus.bootstrap.tenant_display_name'
    );

  v_owner_id TEXT :=
    current_setting(
      'nexus.bootstrap.owner_id'
    );

  v_authority_epoch TEXT :=
    current_setting(
      'nexus.bootstrap.authority_epoch'
    );
BEGIN
  IF
    v_tenant_id <> btrim(v_tenant_id)
    OR length(v_tenant_id) < 1
    OR length(v_tenant_id) > 128
    OR v_tenant_display_name <>
      btrim(v_tenant_display_name)
    OR length(v_tenant_display_name) < 1
    OR length(v_tenant_display_name) > 200
    OR v_owner_id <> btrim(v_owner_id)
    OR length(v_owner_id) < 1
    OR length(v_owner_id) > 128
    OR v_authority_epoch <>
      btrim(v_authority_epoch)
    OR length(v_authority_epoch) < 1
    OR length(v_authority_epoch) > 128
  THEN
    RAISE EXCEPTION USING
      MESSAGE =
        'NEXUS authenticated-owner prerequisite bootstrap input contract is invalid.';
  END IF;

  INSERT INTO public.nexus_tenant (
    tenant_id,
    display_name,
    status
  )
  VALUES (
    v_tenant_id,
    v_tenant_display_name,
    'ACTIVE'
  )
  ON CONFLICT (tenant_id)
  DO NOTHING;

  IF NOT EXISTS (
    SELECT 1
    FROM public.nexus_tenant
    WHERE tenant_id = v_tenant_id
      AND display_name =
        v_tenant_display_name
      AND status = 'ACTIVE'
  )
  THEN
    RAISE EXCEPTION USING
      MESSAGE =
        'NEXUS tenant prerequisite conflicts with existing state.';
  END IF;

  INSERT INTO public.nexus_owner_identity (
    owner_id,
    status
  )
  VALUES (
    v_owner_id,
    'ACTIVE'
  )
  ON CONFLICT (owner_id)
  DO NOTHING;

  IF NOT EXISTS (
    SELECT 1
    FROM public.nexus_owner_identity
    WHERE owner_id = v_owner_id
      AND status = 'ACTIVE'
  )
  THEN
    RAISE EXCEPTION USING
      MESSAGE =
        'NEXUS owner prerequisite conflicts with existing state.';
  END IF;

  INSERT INTO public.nexus_tenant_owner_membership (
    tenant_id,
    owner_id,
    role,
    status,
    authority_epoch
  )
  VALUES (
    v_tenant_id,
    v_owner_id,
    'OWNER',
    'ACTIVE',
    v_authority_epoch
  )
  ON CONFLICT (
    tenant_id,
    owner_id
  )
  DO NOTHING;

  IF NOT EXISTS (
    SELECT 1
    FROM public.nexus_tenant_owner_membership
    WHERE tenant_id = v_tenant_id
      AND owner_id = v_owner_id
      AND role = 'OWNER'
      AND status = 'ACTIVE'
      AND authority_epoch =
        v_authority_epoch
  )
  THEN
    RAISE EXCEPTION USING
      MESSAGE =
        'NEXUS owner-membership prerequisite conflicts with existing state.';
  END IF;
END
$bootstrap$;

WITH verification AS (
  SELECT
    (
      SELECT count(*)
      FROM public.nexus_tenant
      WHERE tenant_id =
        current_setting(
          'nexus.bootstrap.tenant_id'
        )
        AND display_name =
          current_setting(
            'nexus.bootstrap.tenant_display_name'
          )
        AND status = 'ACTIVE'
    ) AS tenant_count,

    (
      SELECT count(*)
      FROM public.nexus_owner_identity
      WHERE owner_id =
        current_setting(
          'nexus.bootstrap.owner_id'
        )
        AND status = 'ACTIVE'
    ) AS owner_count,

    (
      SELECT count(*)
      FROM public.nexus_tenant_owner_membership
      WHERE tenant_id =
        current_setting(
          'nexus.bootstrap.tenant_id'
        )
        AND owner_id =
          current_setting(
            'nexus.bootstrap.owner_id'
          )
        AND role = 'OWNER'
        AND status = 'ACTIVE'
        AND authority_epoch =
          current_setting(
            'nexus.bootstrap.authority_epoch'
          )
    ) AS membership_count
)
SELECT format(
  'NEXUS_AUTHENTICATED_OWNER_PREREQUISITE_BOOTSTRAP=TENANT:%s/OWNER:%s/MEMBERSHIP:%s/ACTIVE_OWNER_MEMBERSHIP:%s',
  tenant_count,
  owner_count,
  membership_count,
  membership_count
)
FROM verification;

COMMIT;
