CREATE TABLE IF NOT EXISTS nexus_protected_api_nonce (
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    nonce_hash CHAR(64) NOT NULL,
    request_id VARCHAR(128) NOT NULL,
    pathname VARCHAR(512) NOT NULL,
    body_sha256 CHAR(64) NOT NULL,
    consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_protected_api_nonce_pk
        PRIMARY KEY (
            tenant_id,
            owner_id,
            nonce_hash
        ),

    CONSTRAINT nexus_protected_api_nonce_hash_check
        CHECK (
            nonce_hash ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_protected_api_body_hash_check
        CHECK (
            body_sha256 ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_protected_api_nonce_expiry_check
        CHECK (
            expires_at > consumed_at
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_protected_api_nonce_expiry_idx
ON nexus_protected_api_nonce (
    expires_at
);

COMMENT ON TABLE nexus_protected_api_nonce IS
    'NEXUS atomic replay-prevention ledger. A unique tenant-owner-nonce hash can be consumed only once.';
