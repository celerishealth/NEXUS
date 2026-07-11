BEGIN;

CREATE TABLE IF NOT EXISTS nexus_sandbox_outbox_results (
    tenant_id uuid NOT NULL,
    result_id uuid NOT NULL,
    outbox_id uuid NOT NULL,
    action_kind text NOT NULL,
    payload jsonb NOT NULL,
    payload_canonical text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT nexus_sandbox_outbox_results_pk
        PRIMARY KEY (tenant_id, result_id),

    CONSTRAINT nexus_sandbox_outbox_results_outbox_uk
        UNIQUE (tenant_id, outbox_id),

    CONSTRAINT nexus_sandbox_outbox_results_outbox_fk
        FOREIGN KEY (tenant_id, outbox_id)
        REFERENCES nexus_sandbox_outbox (tenant_id, outbox_id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    CONSTRAINT nexus_sandbox_outbox_results_action_kind_ck
        CHECK (
            char_length(action_kind) BETWEEN 9 AND 128
            AND action_kind ~ '^sandbox\.[a-z0-9][a-z0-9._-]*$'
        ),

    CONSTRAINT nexus_sandbox_outbox_results_payload_object_ck
        CHECK (jsonb_typeof(payload) = 'object'),

    CONSTRAINT nexus_sandbox_outbox_results_payload_size_ck
        CHECK (
            char_length(payload_canonical)
            BETWEEN 2 AND 65536
        )
);

CREATE INDEX IF NOT EXISTS nexus_sandbox_outbox_results_created_idx
    ON nexus_sandbox_outbox_results (
        tenant_id,
        created_at,
        result_id
    );

ALTER TABLE nexus_sandbox_outbox_results
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_sandbox_outbox_results
    FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS nexus_sandbox_outbox_results_tenant_policy
    ON nexus_sandbox_outbox_results;

CREATE POLICY nexus_sandbox_outbox_results_tenant_policy
    ON nexus_sandbox_outbox_results
    USING (
        tenant_id =
        NULLIF(current_setting('app.tenant_id', true), '')::uuid
    )
    WITH CHECK (
        tenant_id =
        NULLIF(current_setting('app.tenant_id', true), '')::uuid
    );

CREATE OR REPLACE FUNCTION nexus_reject_sandbox_result_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION
        'nexus_sandbox_outbox_results rows are append-only'
        USING ERRCODE = '55000';
END;
$$;

DROP TRIGGER IF EXISTS nexus_sandbox_outbox_results_no_update
    ON nexus_sandbox_outbox_results;

CREATE TRIGGER nexus_sandbox_outbox_results_no_update
BEFORE UPDATE ON nexus_sandbox_outbox_results
FOR EACH ROW
EXECUTE FUNCTION nexus_reject_sandbox_result_mutation();

DROP TRIGGER IF EXISTS nexus_sandbox_outbox_results_no_delete
    ON nexus_sandbox_outbox_results;

CREATE TRIGGER nexus_sandbox_outbox_results_no_delete
BEFORE DELETE ON nexus_sandbox_outbox_results
FOR EACH ROW
EXECUTE FUNCTION nexus_reject_sandbox_result_mutation();

COMMIT;
