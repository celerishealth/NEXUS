BEGIN;

CREATE TABLE IF NOT EXISTS nexus_internal_pilot_command_audit (
    tenant_id TEXT NOT NULL,
    request_id TEXT NOT NULL,
    sequence_no SMALLINT NOT NULL,
    actor_id TEXT NOT NULL,
    request_digest CHAR(64) NOT NULL,
    stage TEXT NOT NULL,
    failure_code TEXT,
    previous_hash CHAR(64) NOT NULL,
    record_hash CHAR(64) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_internal_pilot_command_audit_pk
        PRIMARY KEY (
            tenant_id,
            request_id,
            sequence_no
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_stage_unique
        UNIQUE (
            tenant_id,
            request_id,
            stage
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_sequence_check
        CHECK (
            sequence_no BETWEEN 1 AND 2
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_request_check
        CHECK (
            request_id ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{7,127}$'
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_actor_check
        CHECK (
            actor_id ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{2,127}$'
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_digest_check
        CHECK (
            request_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_stage_check
        CHECK (
            stage IN (
                'authorized',
                'completed',
                'failed'
            )
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_failure_check
        CHECK (
            (
                stage = 'failed'
                AND failure_code ~ '^[A-Z][A-Z0-9_]{2,63}$'
            )
            OR
            (
                stage IN ('authorized', 'completed')
                AND failure_code IS NULL
            )
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_previous_hash_check
        CHECK (
            previous_hash ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_record_hash_check
        CHECK (
            record_hash ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_internal_pilot_command_audit_chain_position_check
        CHECK (
            (
                sequence_no = 1
                AND stage = 'authorized'
                AND previous_hash =
                    repeat('0', 64)
            )
            OR
            (
                sequence_no = 2
                AND stage IN ('completed', 'failed')
                AND previous_hash <>
                    repeat('0', 64)
            )
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_internal_pilot_command_audit_tenant_occurred_idx
ON nexus_internal_pilot_command_audit (
    tenant_id,
    occurred_at DESC
);

CREATE INDEX IF NOT EXISTS
    nexus_internal_pilot_command_audit_tenant_actor_idx
ON nexus_internal_pilot_command_audit (
    tenant_id,
    actor_id,
    occurred_at DESC
);

COMMIT;
