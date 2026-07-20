START TRANSACTION READ ONLY;

WITH inventory AS (
    SELECT
        (
            SELECT COUNT(*)
            FROM public.nexus_tenant
        ) AS tenant_count,
        (
            SELECT COUNT(*)
            FROM public.nexus_owner_identity
        ) AS owner_count,
        (
            SELECT COUNT(*)
            FROM public.nexus_tenant_owner_membership
        ) AS membership_count,
        (
            SELECT COUNT(*)
            FROM public.nexus_tenant_owner_membership AS membership
            INNER JOIN public.nexus_tenant AS tenant
                ON tenant.tenant_id = membership.tenant_id
            INNER JOIN public.nexus_owner_identity AS owner_identity
                ON owner_identity.owner_id = membership.owner_id
            WHERE membership.role = 'OWNER'
              AND membership.status = 'ACTIVE'
              AND tenant.status = 'ACTIVE'
              AND owner_identity.status = 'ACTIVE'
              AND LENGTH(TRIM(membership.authority_epoch)) > 0
        ) AS active_owner_membership_count,
        (
            SELECT COUNT(*)
            FROM public.nexus_authenticated_owner_credentials
        ) AS credential_count,
        (
            SELECT COUNT(*)
            FROM public.nexus_authenticated_owner_sessions
        ) AS session_count
)
SELECT FORMAT(
    'NEXUS_AUTHENTICATED_OWNER_MEMBERSHIP_INVENTORY=TENANTS:%s/OWNERS:%s/MEMBERSHIPS:%s/ACTIVE_OWNER_MEMBERSHIPS:%s/CREDENTIALS:%s/SESSIONS:%s',
    tenant_count,
    owner_count,
    membership_count,
    active_owner_membership_count,
    credential_count,
    session_count
)
FROM inventory;

ROLLBACK;
