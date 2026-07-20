BEGIN;

CREATE TABLE IF NOT EXISTS nexus_authenticated_owner_credentials (
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    email_normalized VARCHAR(320) NOT NULL,
    password_salt_hex CHAR(32) NOT NULL,
    password_hash_hex CHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    credential_version INTEGER NOT NULL DEFAULT 1,
    failed_attempt_count INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_authenticated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_authenticated_owner_credentials_pk
        PRIMARY KEY (
            tenant_id,
            owner_id
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_membership_fk
        FOREIGN KEY (
            tenant_id,
            owner_id
        )
        REFERENCES nexus_tenant_owner_membership (
            tenant_id,
            owner_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_authenticated_owner_credentials_email_unique
        UNIQUE (
            tenant_id,
            email_normalized
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_email_check
        CHECK (
            length(email_normalized) >= 3
            AND email_normalized = lower(email_normalized)
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_salt_check
        CHECK (
            password_salt_hex ~ '^[a-f0-9]{32}$'
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_hash_check
        CHECK (
            password_hash_hex ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_status_check
        CHECK (
            status IN (
                'ACTIVE',
                'DISABLED'
            )
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_version_check
        CHECK (
            credential_version >= 1
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_failure_check
        CHECK (
            failed_attempt_count >= 0
            AND failed_attempt_count <= 5
        ),

    CONSTRAINT nexus_authenticated_owner_credentials_lock_check
        CHECK (
            locked_until IS NULL
            OR failed_attempt_count = 5
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_authenticated_owner_credentials_login_idx
ON nexus_authenticated_owner_credentials (
    tenant_id,
    email_normalized,
    status
);

CREATE TABLE IF NOT EXISTS nexus_authenticated_owner_sessions (
    tenant_id VARCHAR(128) NOT NULL,
    session_id VARCHAR(128) NOT NULL,
    session_digest CHAR(64) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    authority_epoch VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'OWNER',
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_authenticated_owner_sessions_pk
        PRIMARY KEY (
            tenant_id,
            session_digest
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_id_unique
        UNIQUE (
            tenant_id,
            session_id
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_membership_fk
        FOREIGN KEY (
            tenant_id,
            owner_id
        )
        REFERENCES nexus_tenant_owner_membership (
            tenant_id,
            owner_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_authenticated_owner_sessions_id_check
        CHECK (
            session_id ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{7,127}$'
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_digest_check
        CHECK (
            session_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_authority_check
        CHECK (
            length(authority_epoch) > 0
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_role_check
        CHECK (
            role = 'OWNER'
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_expiry_check
        CHECK (
            expires_at > created_at
        ),

    CONSTRAINT nexus_authenticated_owner_sessions_revocation_check
        CHECK (
            revoked_at IS NULL
            OR revoked_at >= created_at
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_authenticated_owner_sessions_active_lookup_idx
ON nexus_authenticated_owner_sessions (
    tenant_id,
    session_digest,
    expires_at
)
WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS
    nexus_authenticated_owner_sessions_owner_idx
ON nexus_authenticated_owner_sessions (
    tenant_id,
    owner_id,
    expires_at
);

ALTER TABLE nexus_authenticated_owner_credentials
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_authenticated_owner_credentials
    FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS
    nexus_authenticated_owner_credentials_tenant_policy
ON nexus_authenticated_owner_credentials;

CREATE POLICY
    nexus_authenticated_owner_credentials_tenant_policy
ON nexus_authenticated_owner_credentials
FOR ALL
USING (
    tenant_id =
        current_setting('app.tenant_id', true)
)
WITH CHECK (
    tenant_id =
        current_setting('app.tenant_id', true)
);

ALTER TABLE nexus_authenticated_owner_sessions
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_authenticated_owner_sessions
    FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS
    nexus_authenticated_owner_sessions_tenant_policy
ON nexus_authenticated_owner_sessions;

CREATE POLICY
    nexus_authenticated_owner_sessions_tenant_policy
ON nexus_authenticated_owner_sessions
FOR ALL
USING (
    tenant_id =
        current_setting('app.tenant_id', true)
)
WITH CHECK (
    tenant_id =
        current_setting('app.tenant_id', true)
);
COMMENT ON TABLE nexus_authenticated_owner_credentials IS
    'Owner credentials for controlled authenticated tenant access. Password plaintext is never stored.';

COMMENT ON TABLE nexus_authenticated_owner_sessions IS
    'Digest-only authenticated owner sessions bound to one tenant, owner and authority epoch.';

COMMIT;
