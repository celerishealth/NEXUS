BEGIN;

ALTER TABLE nexus_sandbox_outbox
    ADD COLUMN IF NOT EXISTS lease_owner text NULL,
    ADD COLUMN IF NOT EXISTS lease_token uuid NULL,
    ADD COLUMN IF NOT EXISTS lease_expires_at timestamptz NULL,
    ADD COLUMN IF NOT EXISTS completed_at timestamptz NULL;

UPDATE nexus_sandbox_outbox
SET
    status = 'pending',
    lease_owner = NULL,
    lease_token = NULL,
    lease_expires_at = NULL,
    last_error_code = COALESCE(
        last_error_code,
        'lease_state_initialized'
    )
WHERE status = 'processing';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'nexus_sandbox_outbox_lease_owner_ck'
    ) THEN
        ALTER TABLE nexus_sandbox_outbox
            ADD CONSTRAINT nexus_sandbox_outbox_lease_owner_ck
            CHECK (
                lease_owner IS NULL
                OR (
                    char_length(lease_owner) BETWEEN 1 AND 128
                    AND lease_owner !~ '[[:cntrl:]]'
                )
            );
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'nexus_sandbox_outbox_lease_state_ck'
    ) THEN
        ALTER TABLE nexus_sandbox_outbox
            ADD CONSTRAINT nexus_sandbox_outbox_lease_state_ck
            CHECK (
                (
                    status = 'processing'
                    AND lease_owner IS NOT NULL
                    AND lease_token IS NOT NULL
                    AND lease_expires_at IS NOT NULL
                )
                OR
                (
                    status <> 'processing'
                    AND lease_owner IS NULL
                    AND lease_token IS NULL
                    AND lease_expires_at IS NULL
                )
            );
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'nexus_sandbox_outbox_completed_state_ck'
    ) THEN
        ALTER TABLE nexus_sandbox_outbox
            ADD CONSTRAINT nexus_sandbox_outbox_completed_state_ck
            CHECK (
                (status = 'completed' AND completed_at IS NOT NULL)
                OR
                (status <> 'completed' AND completed_at IS NULL)
            );
    END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS nexus_sandbox_outbox_claim_idx
    ON nexus_sandbox_outbox (
        tenant_id,
        available_at,
        created_at,
        outbox_id
    )
    WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS nexus_sandbox_outbox_expired_lease_idx
    ON nexus_sandbox_outbox (
        tenant_id,
        lease_expires_at,
        outbox_id
    )
    WHERE status = 'processing';

COMMIT;
