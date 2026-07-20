BEGIN;

CREATE TABLE IF NOT EXISTS public.nexus_tenant (
    tenant_id VARCHAR(128) PRIMARY KEY,
    display_name VARCHAR(200) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_tenant_status_check
        CHECK (
            status IN (
                'ACTIVE',
                'SUSPENDED',
                'CLOSED'
            )
        )
);

CREATE TABLE IF NOT EXISTS public.nexus_owner_identity (
    owner_id VARCHAR(128) PRIMARY KEY,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_owner_identity_status_check
        CHECK (
            status IN (
                'ACTIVE',
                'REVOKED',
                'DISABLED'
            )
        )
);

CREATE TABLE IF NOT EXISTS public.nexus_tenant_owner_membership (
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'OWNER',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    authority_epoch VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_tenant_owner_membership_pk
        PRIMARY KEY (
            tenant_id,
            owner_id
        ),

    CONSTRAINT nexus_tenant_owner_membership_tenant_fk
        FOREIGN KEY (tenant_id)
        REFERENCES public.nexus_tenant (tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT nexus_tenant_owner_membership_owner_fk
        FOREIGN KEY (owner_id)
        REFERENCES public.nexus_owner_identity (owner_id)
        ON DELETE RESTRICT,

    CONSTRAINT nexus_tenant_owner_membership_role_check
        CHECK (
            role = 'OWNER'
        ),

    CONSTRAINT nexus_tenant_owner_membership_status_check
        CHECK (
            status IN (
                'ACTIVE',
                'SUSPENDED',
                'REVOKED'
            )
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_tenant_owner_membership_owner_idx
ON public.nexus_tenant_owner_membership (
    owner_id,
    status
);

COMMENT ON TABLE public.nexus_tenant IS
    'NEXUS tenant security boundary. Only ACTIVE tenants may use protected APIs.';

COMMENT ON TABLE public.nexus_owner_identity IS
    'NEXUS durable owner identity status boundary.';

COMMENT ON TABLE public.nexus_tenant_owner_membership IS
    'NEXUS durable tenant-owner authorization mapping. Cross-tenant access is denied unless an ACTIVE OWNER membership exists.';
ALTER TABLE public.nexus_tenant
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.nexus_tenant
FORCE ROW LEVEL SECURITY;

ALTER TABLE public.nexus_owner_identity
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.nexus_owner_identity
FORCE ROW LEVEL SECURITY;

ALTER TABLE public.nexus_tenant_owner_membership
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.nexus_tenant_owner_membership
FORCE ROW LEVEL SECURITY;

REVOKE ALL
ON TABLE public.nexus_tenant
FROM public, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.nexus_tenant
TO service_role;

REVOKE ALL
ON TABLE public.nexus_owner_identity
FROM public, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.nexus_owner_identity
TO service_role;

REVOKE ALL
ON TABLE public.nexus_tenant_owner_membership
FROM public, anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.nexus_tenant_owner_membership
TO service_role;

COMMIT;
