CREATE TABLE IF NOT EXISTS nexus_controlled_action (
    tenant_id VARCHAR(128) NOT NULL,
    action_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    action_type VARCHAR(128) NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    payload_json JSONB NOT NULL,
    payload_sha256 CHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_controlled_action_pk
        PRIMARY KEY (
            tenant_id,
            action_id
        ),

    CONSTRAINT nexus_controlled_action_idempotency_unique
        UNIQUE (
            tenant_id,
            idempotency_key
        ),

    CONSTRAINT nexus_controlled_action_payload_hash_check
        CHECK (
            payload_sha256 ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_controlled_action_version_check
        CHECK (
            version >= 1
        ),

    CONSTRAINT nexus_controlled_action_state_check
        CHECK (
            state IN (
                'CREATED',
                'PENDING_OWNER_REVIEW',
                'APPROVED_FOR_DRY_RUN',
                'SIMULATED',
                'APPROVED_FOR_CONTROLLED_EXECUTION_REVIEW',
                'REWORK_REQUIRED',
                'REJECTED'
            )
        ),

    CONSTRAINT nexus_controlled_action_tenant_fk
        FOREIGN KEY (tenant_id)
        REFERENCES nexus_tenant (tenant_id)
        ON DELETE RESTRICT,

    CONSTRAINT nexus_controlled_action_owner_fk
        FOREIGN KEY (owner_id)
        REFERENCES nexus_owner_identity (owner_id)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS
    nexus_controlled_action_state_idx
ON nexus_controlled_action (
    tenant_id,
    state,
    updated_at DESC
);

CREATE TABLE IF NOT EXISTS nexus_controlled_action_event (
    tenant_id VARCHAR(128) NOT NULL,
    action_id VARCHAR(128) NOT NULL,
    sequence INTEGER NOT NULL,
    event_id VARCHAR(128) NOT NULL,
    from_state VARCHAR(64),
    to_state VARCHAR(64) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    request_id VARCHAR(128) NOT NULL,
    authority_epoch VARCHAR(128) NOT NULL,
    previous_evidence_hash CHAR(64) NOT NULL,
    evidence_hash CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT nexus_controlled_action_event_pk
        PRIMARY KEY (
            tenant_id,
            action_id,
            sequence
        ),

    CONSTRAINT nexus_controlled_action_event_id_unique
        UNIQUE (event_id),

    CONSTRAINT nexus_controlled_action_event_action_fk
        FOREIGN KEY (
            tenant_id,
            action_id
        )
        REFERENCES nexus_controlled_action (
            tenant_id,
            action_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_controlled_action_event_sequence_check
        CHECK (
            sequence >= 1
        ),

    CONSTRAINT nexus_controlled_action_previous_hash_check
        CHECK (
            previous_evidence_hash ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_controlled_action_evidence_hash_check
        CHECK (
            evidence_hash ~ '^[a-f0-9]{64}$'
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_controlled_action_event_time_idx
ON nexus_controlled_action_event (
    tenant_id,
    action_id,
    created_at ASC
);

COMMENT ON TABLE nexus_controlled_action IS
    'NEXUS tenant-isolated controlled business-action state. No EXECUTED state exists.';

COMMENT ON TABLE nexus_controlled_action_event IS
    'NEXUS append-only hash-linked controlled-action state-transition evidence.';
