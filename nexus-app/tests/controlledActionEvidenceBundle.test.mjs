import assert from "node:assert/strict";
import test from "node:test";

import {
  createControlledActionEvidenceBundle,
  verifyControlledActionEvidenceBundle,
} from "../lib/nexus/controlledActionEvidenceBundle.mjs";

import {
  buildControlledActionEvidencePipeline,
  createControlledActionEvidencePreview,
} from "../lib/nexus/controlledActionEvidencePreview.mjs";

test(
  "creates a deterministic complete evidence bundle",
  () => {
    const first =
      createControlledActionEvidencePreview();

    const second =
      createControlledActionEvidencePreview();

    assert.equal(
      first.evidence.created,
      true,
    );

    assert.equal(
      first.evidence.recordCount,
      7,
    );

    assert.equal(
      first.evidence.bundleId,
      second.evidence.bundleId,
    );

    assert.equal(
      first.evidence.bundleRootHash,
      second.evidence.bundleRootHash,
    );

    assert.match(
      first.evidence.bundleId,
      /^[a-f0-9]{64}$/,
    );

    assert.match(
      first.evidence.bundleRootHash,
      /^[a-f0-9]{64}$/,
    );

    assert.equal(
      first.evidence.executionAuthorized,
      false,
    );

    assert.equal(
      first.evidence
        .providerInvocationPerformed,
      false,
    );

    assert.equal(
      first.evidence.persistencePerformed,
      false,
    );
  },
);

test(
  "independently verifies the original evidence chain",
  () => {
    const preview =
      createControlledActionEvidencePreview();

    assert.equal(
      preview.verification.valid,
      true,
    );

    assert.equal(
      preview.verification.state,
      "EVIDENCE_INTEGRITY_VERIFIED",
    );

    assert.equal(
      preview.verification
        .verifiedRecordCount,
      7,
    );

    assert.equal(
      preview.verification
        .executionAuthorized,
      false,
    );
  },
);

test(
  "detects modification of a simulation evidence record",
  () => {
    const preview =
      createControlledActionEvidencePreview({
        tamper: true,
      });

    assert.equal(
      preview.verification.valid,
      false,
    );

    assert.ok(
      preview.verification.reasonCodes.includes(
        "EVIDENCE_RECORD_TAMPERING_DETECTED",
      ),
    );
  },
);

test(
  "detects a broken evidence chain link",
  () => {
    const preview =
      createControlledActionEvidencePreview();

    const modified =
      JSON.parse(
        JSON.stringify(preview.evidence),
      );

    modified.records[3].previousHash =
      "0".repeat(64);

    const verification =
      verifyControlledActionEvidenceBundle(
        modified,
      );

    assert.equal(
      verification.valid,
      false,
    );

    assert.ok(
      verification.reasonCodes.includes(
        "EVIDENCE_CHAIN_LINK_MISMATCH",
      ),
    );
  },
);

test(
  "blocks bundle creation after cross-tenant evidence substitution",
  () => {
    const pipeline =
      buildControlledActionEvidencePipeline();

    const alteredAdmission = {
      ...pipeline.admission,
      auditRecord: {
        ...pipeline.admission.auditRecord,
        tenantId: "tenant-foreign-666",
      },
    };

    const result =
      createControlledActionEvidenceBundle({
        ...pipeline,
        admission: alteredAdmission,
      });

    assert.equal(result.created, false);

    assert.ok(
      result.reasonCodes.includes(
        "ADMISSION_ACTION_BINDING_MISMATCH",
      ),
    );
  },
);

test(
  "blocks bundle creation from an unaccepted owner resolution",
  () => {
    const pipeline =
      buildControlledActionEvidencePipeline();

    const result =
      createControlledActionEvidenceBundle({
        ...pipeline,
        ownerResolution: {
          ...pipeline.ownerResolution,
          accepted: false,
          resolutionId: null,
        },
      });

    assert.equal(result.created, false);

    assert.ok(
      result.reasonCodes.includes(
        "ACCEPTED_OWNER_RESOLUTION_REQUIRED",
      ),
    );
  },
);

test(
  "blocks evidence creation when an execution flag is enabled",
  () => {
    const pipeline =
      buildControlledActionEvidencePipeline();

    const unsafePlan = {
      ...pipeline.plan,
      executionAuthorized: true,
    };

    const result =
      createControlledActionEvidenceBundle({
        ...pipeline,
        plan: unsafePlan,
      });

    assert.equal(result.created, false);

    assert.ok(
      result.reasonCodes.includes(
        "PIPELINE_SAFETY_BOUNDARY_INVALID",
      ),
    );
  },
);

test(
  "creates evidence for a permanent owner rejection",
  () => {
    const pipeline =
      buildControlledActionEvidencePipeline({
        decision: "REJECT_PERMANENTLY",
      });

    const evidence =
      createControlledActionEvidenceBundle(
        pipeline,
      );

    const verification =
      verifyControlledActionEvidenceBundle(
        evidence,
      );

    assert.equal(evidence.created, true);
    assert.equal(verification.valid, true);

    assert.equal(
      evidence.records[6]
        .payload.decision,
      "REJECT_PERMANENTLY",
    );

    assert.match(
      evidence.records[6]
        .payload.permanentStopId,
      /^[a-f0-9]{64}$/,
    );

    assert.equal(
      evidence.records[6]
        .payload.immutableCandidateId,
      null,
    );
  },
);

test(
  "fails verification when the bundle identity is altered",
  () => {
    const preview =
      createControlledActionEvidencePreview();

    const modified =
      JSON.parse(
        JSON.stringify(preview.evidence),
      );

    modified.identity.ownerId =
      "owner-foreign-666";

    const verification =
      verifyControlledActionEvidenceBundle(
        modified,
      );

    assert.equal(
      verification.valid,
      false,
    );

    assert.ok(
      verification.reasonCodes.includes(
        "EVIDENCE_GENESIS_HASH_MISMATCH",
      ),
    );

    assert.ok(
      verification.reasonCodes.includes(
        "EVIDENCE_BUNDLE_ID_MISMATCH",
      ),
    );
  },
);
