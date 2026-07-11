BEGIN;

ALTER TABLE nexus_sandbox_outbox
    ADD COLUMN IF NOT EXISTS failed_at timestamptz NULL;

UPDATE nexus_sandbox_outbox
SET failed_at = COALESCE(failed_at, updated_at, now())
WHERE status = 'failed'
  AND failed_at IS NULL;

UPDATE nexus_sandbox_outbox
SET failed_at = NULL
WHERE status <> 'failed'
  AND failed_at IS NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'nexus_sandbox_outbox_failed_state_ck'
    ) THEN
        ALTER TABLE nexus_sandbox_outbox
            ADD CONSTRAINT nexus_sandbox_outbox_failed_state_ck
            CHECK (
                (status = 'failed' AND failed_at IS NOT NULL)
                OR
                (status <> 'failed' AND failed_at IS NULL)
            );
    END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS nexus_sandbox_outbox_failed_idx
    ON nexus_sandbox_outbox (
        tenant_id,
        failed_at,
        outbox_id
    )
    WHERE status = 'failed';

COMMIT;
