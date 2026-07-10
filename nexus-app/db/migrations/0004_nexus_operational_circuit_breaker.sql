CREATE TABLE IF NOT EXISTS nexus_protected_api_operational_state (
    tenant_id VARCHAR(128) NOT NULL,
    route_key VARCHAR(512) NOT NULL,
    mode VARCHAR(32) NOT NULL,
    reason_code VARCHAR(128) NOT NULL,
    authority_epoch VARCHAR(128) NOT NULL,
    changed_by_owner_id VARCHAR(128) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_protected_api_operational_state_pk
        PRIMARY KEY (
            tenant_id,
            route_key
        ),

    CONSTRAINT nexus_operational_state_mode_check
        CHECK (
            mode IN (
                'OPEN',
                'BLOCKED',
                'MAINTENANCE'
            )
        ),

    CONSTRAINT nexus_operational_state_authority_check
        CHECK (
            LENGTH(authority_epoch) >= 8
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_operational_state_updated_idx
ON nexus_protected_api_operational_state (
    updated_at DESC
);

COMMENT ON TABLE nexus_protected_api_operational_state IS
    'NEXUS durable global, tenant, route, and tenant-route emergency control boundary. Global OPEN initialization is mandatory.';
