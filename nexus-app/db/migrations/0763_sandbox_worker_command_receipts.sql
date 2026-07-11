BEGIN;

CREATE TABLE IF NOT EXISTS nexus_sandbox_worker_command_receipts (
    tenant_id TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    request_id TEXT NOT NULL,
    request_digest CHAR(64) NOT NULL,
    actor_id TEXT NOT NULL,
    state TEXT NOT NULL,
    attempt INTEGER NOT NULL DEFAULT 1,
    result_json JSONB,
    failure_code TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_sandbox_worker_command_receipts_pk
        PRIMARY KEY (tenant_id, idempotency_key),

    CONSTRAINT nexus_sandbox_worker_command_receipts_tenant_request_unique
        UNIQUE (tenant_id, request_id),

    CONSTRAINT nexus_sandbox_worker_command_receipts_digest_check
        CHECK (request_digest ~ '^[a-f0-9]{64}$'),

    CONSTRAINT nexus_sandbox_worker_command_receipts_state_check
        CHECK (state IN ('in_progress', 'completed', 'failed')),

    CONSTRAINT nexus_sandbox_worker_command_receipts_attempt_check
        CHECK (attempt BETWEEN 1 AND 100),

    CONSTRAINT nexus_sandbox_worker_command_receipts_result_state_check
        CHECK (
            (
                state = 'in_progress'
                AND result_json IS NULL
                AND failure_code IS NULL
            )
            OR
            (
                state = 'completed'
                AND result_json IS NOT NULL
                AND failure_code IS NULL
            )
            OR
            (
                state = 'failed'
                AND result_json IS NULL
                AND failure_code IS NOT NULL
            )
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_sandbox_worker_command_receipts_tenant_state_updated_idx
ON nexus_sandbox_worker_command_receipts (
    tenant_id,
    state,
    updated_at
);

COMMIT;
