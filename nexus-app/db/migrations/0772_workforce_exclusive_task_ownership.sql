BEGIN;

CREATE TABLE IF NOT EXISTS nexus_workforce_task_ownership (
    tenant_id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(128) NOT NULL,
    task_sequence INTEGER NOT NULL,
    scenario_id VARCHAR(160) NOT NULL,
    ownership_version BIGINT NOT NULL,
    transition_type VARCHAR(32) NOT NULL,
    event_id VARCHAR(128) NOT NULL,
    from_employee_id VARCHAR(128),
    from_runtime_id VARCHAR(160),
    from_manifest_digest CHAR(64),
    from_runtime_digest CHAR(64),
    to_employee_id VARCHAR(128) NOT NULL,
    to_runtime_id VARCHAR(160) NOT NULL,
    to_manifest_digest CHAR(64) NOT NULL,
    to_runtime_digest CHAR(64) NOT NULL,
    previous_fence_token BIGINT,
    next_fence_token BIGINT NOT NULL,
    evidence_digest CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT nexus_workforce_task_ownership_pk
        PRIMARY KEY (
            tenant_id,
            task_sequence,
            scenario_id,
            ownership_version
        ),

    CONSTRAINT nexus_workforce_task_ownership_event_unique
        UNIQUE (
            tenant_id,
            event_id
        ),

    CONSTRAINT nexus_workforce_task_ownership_lineage_target_unique
        UNIQUE (
            tenant_id,
            owner_id,
            task_sequence,
            scenario_id,
            ownership_version,
            to_employee_id,
            to_runtime_id,
            to_manifest_digest,
            to_runtime_digest
        ),

    CONSTRAINT nexus_workforce_task_ownership_membership_fk
        FOREIGN KEY (
            tenant_id,
            owner_id
        )
        REFERENCES nexus_tenant_owner_membership (
            tenant_id,
            owner_id
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_workforce_task_ownership_lineage_fk
        FOREIGN KEY (
            tenant_id,
            owner_id,
            task_sequence,
            scenario_id,
            previous_fence_token,
            from_employee_id,
            from_runtime_id,
            from_manifest_digest,
            from_runtime_digest
        )
        REFERENCES nexus_workforce_task_ownership (
            tenant_id,
            owner_id,
            task_sequence,
            scenario_id,
            ownership_version,
            to_employee_id,
            to_runtime_id,
            to_manifest_digest,
            to_runtime_digest
        )
        ON DELETE RESTRICT,

    CONSTRAINT nexus_workforce_task_ownership_task_sequence_ck
        CHECK (
            task_sequence >= 1
        ),

    CONSTRAINT nexus_workforce_task_ownership_scenario_ck
        CHECK (
            length(btrim(scenario_id)) BETWEEN 1 AND 160
        ),

    CONSTRAINT nexus_workforce_task_ownership_event_ck
        CHECK (
            length(btrim(event_id)) BETWEEN 1 AND 128
        ),

    CONSTRAINT nexus_workforce_task_ownership_to_employee_ck
        CHECK (
            length(btrim(to_employee_id)) BETWEEN 1 AND 128
        ),

    CONSTRAINT nexus_workforce_task_ownership_to_runtime_ck
        CHECK (
            length(btrim(to_runtime_id)) BETWEEN 1 AND 160
        ),

    CONSTRAINT nexus_workforce_task_ownership_to_manifest_digest_ck
        CHECK (
            to_manifest_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_workforce_task_ownership_to_runtime_digest_ck
        CHECK (
            to_runtime_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_workforce_task_ownership_evidence_digest_ck
        CHECK (
            evidence_digest ~ '^[a-f0-9]{64}$'
        ),

    CONSTRAINT nexus_workforce_task_ownership_version_ck
        CHECK (
            ownership_version >= 1
        ),

    CONSTRAINT nexus_workforce_task_ownership_fence_ck
        CHECK (
            next_fence_token = ownership_version
            AND next_fence_token >= 1
        ),

    CONSTRAINT nexus_workforce_task_ownership_transition_ck
        CHECK (
            transition_type IN (
                'CLAIMED',
                'HANDED_OFF'
            )
        ),

    CONSTRAINT nexus_workforce_task_ownership_shape_ck
        CHECK (
            (
                transition_type = 'CLAIMED'
                AND ownership_version = 1
                AND from_employee_id IS NULL
                AND from_runtime_id IS NULL
                AND from_manifest_digest IS NULL
                AND from_runtime_digest IS NULL
                AND previous_fence_token IS NULL
                AND next_fence_token = 1
            )
            OR
            (
                transition_type = 'HANDED_OFF'
                AND ownership_version >= 2
                AND from_employee_id IS NOT NULL
                AND length(btrim(from_employee_id))
                    BETWEEN 1 AND 128
                AND from_runtime_id IS NOT NULL
                AND length(btrim(from_runtime_id))
                    BETWEEN 1 AND 160
                AND from_manifest_digest
                    ~ '^[a-f0-9]{64}$'
                AND from_runtime_digest
                    ~ '^[a-f0-9]{64}$'
                AND previous_fence_token =
                    ownership_version - 1
                AND next_fence_token =
                    previous_fence_token + 1
                AND NOT (
                    from_employee_id = to_employee_id
                    AND from_runtime_id = to_runtime_id
                )
            )
        )
);

CREATE INDEX IF NOT EXISTS
    nexus_workforce_task_ownership_latest_idx
ON nexus_workforce_task_ownership (
    tenant_id,
    task_sequence,
    scenario_id,
    ownership_version DESC
);

CREATE INDEX IF NOT EXISTS
    nexus_workforce_task_ownership_holder_idx
ON nexus_workforce_task_ownership (
    tenant_id,
    to_employee_id,
    to_runtime_id,
    ownership_version DESC
);

CREATE OR REPLACE FUNCTION
    nexus_validate_workforce_task_ownership_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current
        nexus_workforce_task_ownership%ROWTYPE;
BEGIN
    PERFORM pg_advisory_xact_lock(
        hashtextextended(
            btrim(NEW.tenant_id)
            || ':'
            || NEW.task_sequence::text
            || ':'
            || btrim(NEW.scenario_id),
            0
        )
    );

    PERFORM 1
    FROM nexus_tenant_owner_membership AS membership
    INNER JOIN nexus_tenant AS tenant
        ON tenant.tenant_id = membership.tenant_id
    INNER JOIN nexus_owner_identity AS owner_identity
        ON owner_identity.owner_id = membership.owner_id
    WHERE membership.tenant_id = btrim(NEW.tenant_id)
      AND membership.owner_id = btrim(NEW.owner_id)
      AND membership.role = 'OWNER'
      AND membership.status = 'ACTIVE'
      AND tenant.status = 'ACTIVE'
      AND owner_identity.status = 'ACTIVE'
    FOR UPDATE OF membership, tenant, owner_identity;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_OWNER_AUTHORITY_INACTIVE';
    END IF;

    SELECT *
    INTO v_current
    FROM nexus_workforce_task_ownership
    WHERE tenant_id = btrim(NEW.tenant_id)
      AND task_sequence = NEW.task_sequence
      AND scenario_id = btrim(NEW.scenario_id)
    ORDER BY ownership_version DESC
    LIMIT 1;

    IF NEW.transition_type = 'CLAIMED' THEN
        RETURN NEW;
    END IF;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_OWNERSHIP_NOT_FOUND';
    END IF;

    IF NEW.owner_id <> v_current.owner_id THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_OWNER_AUTHORITY_MISMATCH';
    END IF;

    IF
        NEW.ownership_version <>
            v_current.ownership_version + 1
        OR NEW.previous_fence_token <>
            v_current.next_fence_token
        OR NEW.next_fence_token <>
            v_current.next_fence_token + 1
        OR NEW.from_employee_id <>
            v_current.to_employee_id
        OR NEW.from_runtime_id <>
            v_current.to_runtime_id
        OR NEW.from_manifest_digest <>
            v_current.to_manifest_digest
        OR NEW.from_runtime_digest <>
            v_current.to_runtime_digest
    THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_STALE_OWNER';
    END IF;

    IF
        NEW.to_employee_id = v_current.to_employee_id
        AND NEW.to_runtime_id = v_current.to_runtime_id
    THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_HANDOFF_OWNER_UNCHANGED';
    END IF;

    IF NEW.created_at < v_current.created_at THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_TIME_REGRESSION';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS
    nexus_workforce_task_ownership_insert_guard_trg
ON nexus_workforce_task_ownership;

CREATE TRIGGER
    nexus_workforce_task_ownership_insert_guard_trg
BEFORE INSERT
ON nexus_workforce_task_ownership
FOR EACH ROW
EXECUTE FUNCTION
    nexus_validate_workforce_task_ownership_insert();
CREATE OR REPLACE FUNCTION
    nexus_reject_workforce_task_ownership_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION
        'WORKFORCE_TASK_OWNERSHIP_APPEND_ONLY';
END;
$$;

DROP TRIGGER IF EXISTS
    nexus_workforce_task_ownership_immutable_trg
ON nexus_workforce_task_ownership;

CREATE TRIGGER
    nexus_workforce_task_ownership_immutable_trg
BEFORE UPDATE OR DELETE
ON nexus_workforce_task_ownership
FOR EACH ROW
EXECUTE FUNCTION
    nexus_reject_workforce_task_ownership_mutation();

CREATE OR REPLACE FUNCTION
    nexus_claim_workforce_task_ownership(
        p_tenant_id VARCHAR,
        p_owner_id VARCHAR,
        p_task_sequence INTEGER,
        p_scenario_id VARCHAR,
        p_employee_id VARCHAR,
        p_runtime_id VARCHAR,
        p_manifest_digest CHAR(64),
        p_runtime_digest CHAR(64),
        p_event_id VARCHAR,
        p_evidence_digest CHAR(64),
        p_now TIMESTAMPTZ
    )
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_inserted INTEGER;
BEGIN
    INSERT INTO nexus_workforce_task_ownership (
        tenant_id,
        owner_id,
        task_sequence,
        scenario_id,
        ownership_version,
        transition_type,
        event_id,
        from_employee_id,
        from_runtime_id,
        from_manifest_digest,
        from_runtime_digest,
        to_employee_id,
        to_runtime_id,
        to_manifest_digest,
        to_runtime_digest,
        previous_fence_token,
        next_fence_token,
        evidence_digest,
        created_at
    )
    VALUES (
        btrim(p_tenant_id),
        btrim(p_owner_id),
        p_task_sequence,
        btrim(p_scenario_id),
        1,
        'CLAIMED',
        btrim(p_event_id),
        NULL,
        NULL,
        NULL,
        NULL,
        btrim(p_employee_id),
        btrim(p_runtime_id),
        p_manifest_digest,
        p_runtime_digest,
        NULL,
        1,
        p_evidence_digest,
        p_now
    )
    ON CONFLICT (
        tenant_id,
        task_sequence,
        scenario_id,
        ownership_version
    )
    DO NOTHING;

    GET DIAGNOSTICS
        v_inserted = ROW_COUNT;

    RETURN v_inserted = 1;
END;
$$;

CREATE OR REPLACE FUNCTION
    nexus_handoff_workforce_task_ownership(
        p_tenant_id VARCHAR,
        p_owner_id VARCHAR,
        p_task_sequence INTEGER,
        p_scenario_id VARCHAR,
        p_expected_employee_id VARCHAR,
        p_expected_runtime_id VARCHAR,
        p_expected_version BIGINT,
        p_expected_fence_token BIGINT,
        p_next_employee_id VARCHAR,
        p_next_runtime_id VARCHAR,
        p_next_manifest_digest CHAR(64),
        p_next_runtime_digest CHAR(64),
        p_event_id VARCHAR,
        p_evidence_digest CHAR(64),
        p_now TIMESTAMPTZ
    )
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_current
        nexus_workforce_task_ownership%ROWTYPE;
    v_next_version BIGINT;
    v_next_fence BIGINT;
BEGIN
    PERFORM pg_advisory_xact_lock(
        hashtextextended(
            btrim(p_tenant_id)
            || ':'
            || p_task_sequence::text
            || ':'
            || btrim(p_scenario_id),
            0
        )
    );

    SELECT *
    INTO v_current
    FROM nexus_workforce_task_ownership
    WHERE tenant_id = btrim(p_tenant_id)
      AND task_sequence = p_task_sequence
      AND scenario_id = btrim(p_scenario_id)
    ORDER BY ownership_version DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_OWNERSHIP_NOT_FOUND';
    END IF;

    IF v_current.owner_id <> btrim(p_owner_id) THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_OWNER_AUTHORITY_MISMATCH';
    END IF;

    IF
        v_current.to_employee_id <>
            btrim(p_expected_employee_id)
        OR v_current.to_runtime_id <>
            btrim(p_expected_runtime_id)
        OR v_current.ownership_version <>
            p_expected_version
        OR v_current.next_fence_token <>
            p_expected_fence_token
    THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_STALE_OWNER';
    END IF;

    IF
        v_current.to_employee_id =
            btrim(p_next_employee_id)
        AND v_current.to_runtime_id =
            btrim(p_next_runtime_id)
    THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_HANDOFF_OWNER_UNCHANGED';
    END IF;

    IF p_now < v_current.created_at THEN
        RAISE EXCEPTION
            'WORKFORCE_TASK_TIME_REGRESSION';
    END IF;

    v_next_version =
        v_current.ownership_version + 1;

    v_next_fence =
        v_current.next_fence_token + 1;

    INSERT INTO nexus_workforce_task_ownership (
        tenant_id,
        owner_id,
        task_sequence,
        scenario_id,
        ownership_version,
        transition_type,
        event_id,
        from_employee_id,
        from_runtime_id,
        from_manifest_digest,
        from_runtime_digest,
        to_employee_id,
        to_runtime_id,
        to_manifest_digest,
        to_runtime_digest,
        previous_fence_token,
        next_fence_token,
        evidence_digest,
        created_at
    )
    VALUES (
        v_current.tenant_id,
        v_current.owner_id,
        v_current.task_sequence,
        v_current.scenario_id,
        v_next_version,
        'HANDED_OFF',
        btrim(p_event_id),
        v_current.to_employee_id,
        v_current.to_runtime_id,
        v_current.to_manifest_digest,
        v_current.to_runtime_digest,
        btrim(p_next_employee_id),
        btrim(p_next_runtime_id),
        p_next_manifest_digest,
        p_next_runtime_digest,
        v_current.next_fence_token,
        v_next_fence,
        p_evidence_digest,
        p_now
    );

    RETURN TRUE;
END;
$$;

ALTER TABLE nexus_workforce_task_ownership
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE nexus_workforce_task_ownership
    FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS
    nexus_workforce_task_ownership_select_policy
ON nexus_workforce_task_ownership;

CREATE POLICY
    nexus_workforce_task_ownership_select_policy
ON nexus_workforce_task_ownership
FOR SELECT
USING (
    tenant_id =
        current_setting('app.tenant_id', true)
);

DROP POLICY IF EXISTS
    nexus_workforce_task_ownership_insert_policy
ON nexus_workforce_task_ownership;

CREATE POLICY
    nexus_workforce_task_ownership_insert_policy
ON nexus_workforce_task_ownership
FOR INSERT
WITH CHECK (
    tenant_id =
        current_setting('app.tenant_id', true)
);

COMMENT ON TABLE nexus_workforce_task_ownership IS
    'Append-only tenant-isolated authoritative ownership-transition ledger for bounded AI workforce tasks. Current ownership is the highest ownership_version for one tenant, task sequence and scenario. Every handoff is lineage-bound to the immediately previous holder and fence token.';

COMMIT;
