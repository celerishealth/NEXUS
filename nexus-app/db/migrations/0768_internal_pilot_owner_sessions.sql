BEGIN;

CREATE TABLE IF NOT EXISTS nexus_internal_pilot_owner_sessions (
    tenant_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    session_digest CHAR(64) NOT NULL,
    actor_id TEXT NOT NULL,
    role TEXT NOT NULL,
    owner_approval_granted BOOLEAN NOT NULL DEFAULT FALSE,
    csrf_token_digest CHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_internal_pilot_owner_sessions_pk
        PRIMARY KEY (tenant_id, session_digest),

    CONSTRAINT nexus_internal_pilot_owner_sessions_id_unique
        UNIQUE (tenant_id, session_id),

    CONSTRAINT nexus_internal_pilot_owner_sessions_session_id_check
        CHECK (
            session_id ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{7,127}$'
        ),

    CONSTRAINT nexus_internal_pilot_owner_sessions_digest_check
        CHECK (
            session_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_internal_pilot_owner_sessions_actor_check
        CHECK (
            actor_id ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{2,127}$'
        ),

    CONSTRAINT nexus_internal_pilot_owner_sessions_role_check
        CHECK (
            role IN ('owner', 'operator')
        ),

    CONSTRAINT nexus_internal_pilot_owner_sessions_csrf_digest_check
        CHECK (
            csrf_token_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_internal_pilot_owner_sessions_expiry_check
        CHECK (
            expires_at > created_at
        ),

    CONSTRAINT nexus_internal_pilot_owner_sessions_revocation_check
        CHECK (
            revoked_at IS NULL
            OR revoked_at >= created_at
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_internal_pilot_owner_sessions_active_lookup_idx
ON nexus_internal_pilot_owner_sessions (
    tenant_id,
    session_digest,
    expires_at
)
WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS
    nexus_internal_pilot_owner_sessions_tenant_actor_idx
ON nexus_internal_pilot_owner_sessions (
    tenant_id,
    actor_id,
    expires_at
);

COMMIT;
