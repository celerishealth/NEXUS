BEGIN;

CREATE TABLE IF NOT EXISTS nexus_customer_vertical_slice_state (
    tenant_id TEXT NOT NULL,
    inquiry_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    status TEXT NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_customer_vertical_slice_state_pk
        PRIMARY KEY (tenant_id, inquiry_id),

    CONSTRAINT nexus_customer_vertical_slice_state_tenant_check
        CHECK (length(btrim(tenant_id)) BETWEEN 1 AND 256),

    CONSTRAINT nexus_customer_vertical_slice_state_inquiry_check
        CHECK (length(btrim(inquiry_id)) BETWEEN 1 AND 256),

    CONSTRAINT nexus_customer_vertical_slice_state_customer_check
        CHECK (length(btrim(customer_id)) BETWEEN 1 AND 256),

    CONSTRAINT nexus_customer_vertical_slice_state_owner_check
        CHECK (length(btrim(owner_id)) BETWEEN 1 AND 256),

    CONSTRAINT nexus_customer_vertical_slice_state_version_check
        CHECK (length(btrim(version)) BETWEEN 1 AND 512),

    CONSTRAINT nexus_customer_vertical_slice_state_status_check
        CHECK (
            status IN (
                'inquiry_received',
                'recommendation_ready',
                'owner_approved',
                'owner_rejected',
                'sandbox_executing',
                'sandbox_succeeded',
                'sandbox_failed',
                'result_released',
                'customer_acknowledged'
            )
        ),

    CONSTRAINT nexus_customer_vertical_slice_state_time_check
        CHECK (updated_at >= created_at)
);

CREATE TABLE IF NOT EXISTS nexus_customer_vertical_slice_event (
    tenant_id TEXT NOT NULL,
    event_id TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    inquiry_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    transition TEXT NOT NULL,
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    previous_version TEXT NOT NULL,
    next_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_customer_vertical_slice_event_pk
        PRIMARY KEY (tenant_id, event_id),

    CONSTRAINT nexus_customer_vertical_slice_event_idempotency_uk
        UNIQUE (tenant_id, idempotency_key),

    CONSTRAINT nexus_customer_vertical_slice_event_state_fk
        FOREIGN KEY (tenant_id, inquiry_id)
        REFERENCES nexus_customer_vertical_slice_state (
            tenant_id,
            inquiry_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_customer_vertical_slice_event_role_check
        CHECK (actor_role IN ('owner', 'customer', 'service')),

    CONSTRAINT nexus_customer_vertical_slice_event_transition_check
        CHECK (
            transition IN (
                'generate_recommendation',
                'approve_recommendation',
                'reject_recommendation',
                'start_sandbox_execution',
                'complete_sandbox_execution',
                'fail_sandbox_execution',
                'release_result',
                'acknowledge_result'
            )
        ),

    CONSTRAINT nexus_customer_vertical_slice_event_from_status_check
        CHECK (
            from_status IN (
                'inquiry_received',
                'recommendation_ready',
                'owner_approved',
                'owner_rejected',
                'sandbox_executing',
                'sandbox_succeeded',
                'sandbox_failed',
                'result_released',
                'customer_acknowledged'
            )
        ),

    CONSTRAINT nexus_customer_vertical_slice_event_to_status_check
        CHECK (
            to_status IN (
                'inquiry_received',
                'recommendation_ready',
                'owner_approved',
                'owner_rejected',
                'sandbox_executing',
                'sandbox_succeeded',
                'sandbox_failed',
                'result_released',
                'customer_acknowledged'
            )
        ),

    CONSTRAINT nexus_customer_vertical_slice_event_version_change_check
        CHECK (previous_version <> next_version)
);

CREATE TABLE IF NOT EXISTS nexus_customer_vertical_slice_audit (
    tenant_id TEXT NOT NULL,
    audit_id TEXT NOT NULL,
    inquiry_id TEXT NOT NULL,
    sequence INTEGER NOT NULL,
    source_event_id TEXT NOT NULL,
    source_idempotency_key TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    transition TEXT NOT NULL,
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    previous_version TEXT NOT NULL,
    next_version TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    hash TEXT NOT NULL,
    recorded_by_service_id TEXT NOT NULL,
    source_created_at TIMESTAMPTZ NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_customer_vertical_slice_audit_pk
        PRIMARY KEY (tenant_id, audit_id),

    CONSTRAINT nexus_customer_vertical_slice_audit_sequence_uk
        UNIQUE (tenant_id, inquiry_id, sequence),

    CONSTRAINT nexus_customer_vertical_slice_audit_source_event_uk
        UNIQUE (tenant_id, source_event_id),

    CONSTRAINT nexus_customer_vertical_slice_audit_source_key_uk
        UNIQUE (tenant_id, source_idempotency_key),

    CONSTRAINT nexus_customer_vertical_slice_audit_state_fk
        FOREIGN KEY (tenant_id, inquiry_id)
        REFERENCES nexus_customer_vertical_slice_state (
            tenant_id,
            inquiry_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_customer_vertical_slice_audit_event_fk
        FOREIGN KEY (tenant_id, source_event_id)
        REFERENCES nexus_customer_vertical_slice_event (
            tenant_id,
            event_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_customer_vertical_slice_audit_sequence_check
        CHECK (sequence >= 1),

    CONSTRAINT nexus_customer_vertical_slice_audit_role_check
        CHECK (actor_role IN ('owner', 'customer', 'service')),

    CONSTRAINT nexus_customer_vertical_slice_audit_hash_check
        CHECK (hash ~ '^[a-f0-9]{64}$'),

    CONSTRAINT nexus_customer_vertical_slice_audit_previous_hash_check
        CHECK (
            previous_hash = 'GENESIS'
            OR previous_hash ~ '^[a-f0-9]{64}$'
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_customer_vertical_slice_event_inquiry_idx
ON nexus_customer_vertical_slice_event (
    tenant_id,
    inquiry_id,
    created_at
);

CREATE INDEX IF NOT EXISTS
    nexus_customer_vertical_slice_audit_inquiry_idx
ON nexus_customer_vertical_slice_audit (
    tenant_id,
    inquiry_id,
    sequence
);

ALTER TABLE nexus_customer_vertical_slice_state
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_customer_vertical_slice_state
    FORCE ROW LEVEL SECURITY;

ALTER TABLE nexus_customer_vertical_slice_event
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_customer_vertical_slice_event
    FORCE ROW LEVEL SECURITY;

ALTER TABLE nexus_customer_vertical_slice_audit
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_customer_vertical_slice_audit
    FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS
    nexus_customer_vertical_slice_state_tenant_policy
ON nexus_customer_vertical_slice_state;

CREATE POLICY
    nexus_customer_vertical_slice_state_tenant_policy
ON nexus_customer_vertical_slice_state
FOR ALL
USING (
    tenant_id = current_setting('app.tenant_id', true)
)
WITH CHECK (
    tenant_id = current_setting('app.tenant_id', true)
);

DROP POLICY IF EXISTS
    nexus_customer_vertical_slice_event_select_policy
ON nexus_customer_vertical_slice_event;

CREATE POLICY
    nexus_customer_vertical_slice_event_select_policy
ON nexus_customer_vertical_slice_event
FOR SELECT
USING (
    tenant_id = current_setting('app.tenant_id', true)
);

DROP POLICY IF EXISTS
    nexus_customer_vertical_slice_event_insert_policy
ON nexus_customer_vertical_slice_event;

CREATE POLICY
    nexus_customer_vertical_slice_event_insert_policy
ON nexus_customer_vertical_slice_event
FOR INSERT
WITH CHECK (
    tenant_id = current_setting('app.tenant_id', true)
);

DROP POLICY IF EXISTS
    nexus_customer_vertical_slice_audit_select_policy
ON nexus_customer_vertical_slice_audit;

CREATE POLICY
    nexus_customer_vertical_slice_audit_select_policy
ON nexus_customer_vertical_slice_audit
FOR SELECT
USING (
    tenant_id = current_setting('app.tenant_id', true)
);

DROP POLICY IF EXISTS
    nexus_customer_vertical_slice_audit_insert_policy
ON nexus_customer_vertical_slice_audit;

CREATE POLICY
    nexus_customer_vertical_slice_audit_insert_policy
ON nexus_customer_vertical_slice_audit
FOR INSERT
WITH CHECK (
    tenant_id = current_setting('app.tenant_id', true)
);

CREATE OR REPLACE FUNCTION
    nexus_block_vertical_slice_append_only_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION
        'NEXUS append-only records cannot be updated or deleted';
END;
$$;

DROP TRIGGER IF EXISTS
    nexus_customer_vertical_slice_event_immutable
ON nexus_customer_vertical_slice_event;

CREATE TRIGGER
    nexus_customer_vertical_slice_event_immutable
BEFORE UPDATE OR DELETE
ON nexus_customer_vertical_slice_event
FOR EACH ROW
EXECUTE FUNCTION
    nexus_block_vertical_slice_append_only_mutation();

DROP TRIGGER IF EXISTS
    nexus_customer_vertical_slice_audit_immutable
ON nexus_customer_vertical_slice_audit;

CREATE TRIGGER
    nexus_customer_vertical_slice_audit_immutable
BEFORE UPDATE OR DELETE
ON nexus_customer_vertical_slice_audit
FOR EACH ROW
EXECUTE FUNCTION
    nexus_block_vertical_slice_append_only_mutation();

COMMIT;
