BEGIN;

CREATE TABLE IF NOT EXISTS nexus_sandbox_outbox (
    tenant_id uuid NOT NULL,
    outbox_id uuid NOT NULL,
    aggregate_type text NOT NULL,
    aggregate_id uuid NOT NULL,
    action_kind text NOT NULL,
    payload jsonb NOT NULL,
    payload_canonical text NOT NULL,
    idempotency_key text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    attempt_count integer NOT NULL DEFAULT 0,
    available_at timestamptz NOT NULL DEFAULT now(),
    last_error_code text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT nexus_sandbox_outbox_pk
        PRIMARY KEY (tenant_id, outbox_id),

    CONSTRAINT nexus_sandbox_outbox_tenant_idempotency_uk
        UNIQUE (tenant_id, idempotency_key),

    CONSTRAINT nexus_sandbox_outbox_aggregate_type_ck
        CHECK (
            char_length(aggregate_type) BETWEEN 1 AND 64
            AND aggregate_type ~ '^[a-z0-9._-]+$'
        ),

    CONSTRAINT nexus_sandbox_outbox_action_kind_ck
        CHECK (
            char_length(action_kind) BETWEEN 1 AND 64
            AND action_kind ~ '^[a-z0-9._-]+$'
        ),

    CONSTRAINT nexus_sandbox_outbox_idempotency_key_ck
        CHECK (
            char_length(idempotency_key) BETWEEN 1 AND 128
            AND idempotency_key !~ '[[:cntrl:]]'
        ),

    CONSTRAINT nexus_sandbox_outbox_status_ck
        CHECK (
            status IN (
                'pending',
                'processing',
                'completed',
                'failed',
                'cancelled'
            )
        ),

    CONSTRAINT nexus_sandbox_outbox_attempt_count_ck
        CHECK (attempt_count >= 0),

    CONSTRAINT nexus_sandbox_outbox_payload_object_ck
        CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX IF NOT EXISTS nexus_sandbox_outbox_pending_idx
    ON nexus_sandbox_outbox (
        tenant_id,
        status,
        available_at,
        created_at,
        outbox_id
    );

ALTER TABLE nexus_sandbox_outbox
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_sandbox_outbox
    FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS nexus_sandbox_outbox_tenant_policy
    ON nexus_sandbox_outbox;

CREATE POLICY nexus_sandbox_outbox_tenant_policy
    ON nexus_sandbox_outbox
    USING (
        tenant_id =
        NULLIF(current_setting('app.tenant_id', true), '')::uuid
    )
    WITH CHECK (
        tenant_id =
        NULLIF(current_setting('app.tenant_id', true), '')::uuid
    );

CREATE OR REPLACE FUNCTION nexus_reject_sandbox_outbox_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION
        'nexus_sandbox_outbox rows cannot be deleted'
        USING ERRCODE = '55000';
END;
$$;

DROP TRIGGER IF EXISTS nexus_sandbox_outbox_no_delete
    ON nexus_sandbox_outbox;

CREATE TRIGGER nexus_sandbox_outbox_no_delete
BEFORE DELETE ON nexus_sandbox_outbox
FOR EACH ROW
EXECUTE FUNCTION nexus_reject_sandbox_outbox_delete();

CREATE OR REPLACE FUNCTION nexus_protect_sandbox_outbox_identity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.tenant_id IS DISTINCT FROM OLD.tenant_id
        OR NEW.outbox_id IS DISTINCT FROM OLD.outbox_id
        OR NEW.aggregate_type IS DISTINCT FROM OLD.aggregate_type
        OR NEW.aggregate_id IS DISTINCT FROM OLD.aggregate_id
        OR NEW.action_kind IS DISTINCT FROM OLD.action_kind
        OR NEW.payload IS DISTINCT FROM OLD.payload
        OR NEW.payload_canonical IS DISTINCT FROM OLD.payload_canonical
        OR NEW.idempotency_key IS DISTINCT FROM OLD.idempotency_key
        OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
        RAISE EXCEPTION
            'nexus_sandbox_outbox immutable identity fields cannot change'
            USING ERRCODE = '55000';
    END IF;

    NEW.updated_at := now();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS nexus_sandbox_outbox_protect_identity
    ON nexus_sandbox_outbox;

CREATE TRIGGER nexus_sandbox_outbox_protect_identity
BEFORE UPDATE ON nexus_sandbox_outbox
FOR EACH ROW
EXECUTE FUNCTION nexus_protect_sandbox_outbox_identity();

COMMIT;
