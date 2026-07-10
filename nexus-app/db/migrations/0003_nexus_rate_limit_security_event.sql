CREATE TABLE IF NOT EXISTS nexus_protected_api_rate_limit_bucket (
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    route_key VARCHAR(512) NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    last_request_id VARCHAR(128) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_protected_api_rate_limit_bucket_pk
        PRIMARY KEY (
            tenant_id,
            owner_id,
            route_key,
            window_start
        ),

    CONSTRAINT nexus_rate_limit_window_check
        CHECK (
            window_end > window_start
        ),

    CONSTRAINT nexus_rate_limit_count_check
        CHECK (
            request_count >= 1
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_protected_api_rate_limit_expiry_idx
ON nexus_protected_api_rate_limit_bucket (
    window_end
);

CREATE TABLE IF NOT EXISTS nexus_security_event (
    event_id VARCHAR(128) PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity VARCHAR(16) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    request_id VARCHAR(128) NOT NULL,
    route_key VARCHAR(512) NOT NULL,
    decision VARCHAR(32) NOT NULL,
    metadata_json JSONB NOT NULL DEFAULT '{}'::JSONB,

    CONSTRAINT nexus_security_event_severity_check
        CHECK (
            severity IN (
                'INFO',
                'WARN',
                'HIGH'
            )
        ),

    CONSTRAINT nexus_security_event_decision_check
        CHECK (
            decision IN (
                'ALLOWED',
                'BLOCKED',
                'FAILED_CLOSED'
            )
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_security_event_tenant_time_idx
ON nexus_security_event (
    tenant_id,
    occurred_at DESC
);

CREATE INDEX IF NOT EXISTS
    nexus_security_event_type_time_idx
ON nexus_security_event (
    event_type,
    occurred_at DESC
);

COMMENT ON TABLE nexus_protected_api_rate_limit_bucket IS
    'NEXUS distributed tenant-owner-route rate limiting boundary.';

COMMENT ON TABLE nexus_security_event IS
    'NEXUS durable protected API security decision evidence.';
