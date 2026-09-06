'use strict';

const {
  BRIDGE_SCHEMA,
  PIPELINE_STATUS,
  MATERIALIZER_STATUS,
  CANONICAL_DELEGATION_STATUS,
  PROTECTED_RUNTIME_ADAPTER_PATH,
  PROTECTED_RUNTIME_ADAPTER_INPUT_KEYS,
  AUTHORITY_BOUNDARY,
  prepareHeldReasoningPipelineInput,
} = require('./nexus-semantic-discovery-held-reasoning-bridge-v2.cjs');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED:${message}`);
  }
}

function expectFailClosed(fn, expectedReason) {
  let failedClosed = false;

  try {
    fn();
  } catch (error) {
    failedClosed =
      String(error && error.message).includes(
        `HELD_REASONING_BRIDGE_V2_FAIL_CLOSED:${expectedReason}`
      );
  }

  assert(
    failedClosed,
    `EXPECTED_FAIL_CLOSED:${expectedReason}`
  );
}

assert(
  BRIDGE_SCHEMA ===
    'NEXUS_SEMANTIC_DISCOVERY_HELD_REASONING_BRIDGE_V2',
  'BRIDGE_SCHEMA_MISMATCH'
);

assert(
  PIPELINE_STATUS === 'HELD',
  'PIPELINE_NOT_HELD'
);

assert(
  MATERIALIZER_STATUS === 'HOLD',
  'MATERIALIZER_NOT_HELD'
);

assert(
  CANONICAL_DELEGATION_STATUS === 'BLOCKED',
  'CANONICAL_DELEGATION_NOT_BLOCKED'
);

assert(
  PROTECTED_RUNTIME_ADAPTER_PATH ===
    'tools/nexus-autonomy-v1/owner-controlled-readonly-reasoning-trusted-source-runtime-adapter.candidate.cjs',
  'PROTECTED_ADAPTER_PATH_MISMATCH'
);

assert(
  JSON.stringify([...PROTECTED_RUNTIME_ADAPTER_INPUT_KEYS]) ===
    JSON.stringify([
      'manifestPublicationAuthorized',
      'seedEvidencePath',
      'seedEvidenceSha256',
    ]),
  'PROTECTED_ADAPTER_INPUT_KEYS_MISMATCH'
);

assert(
  AUTHORITY_BOUNDARY.discoveryResultAuthority === 'NONE',
  'DISCOVERY_RESULT_AUTHORITY_NOT_NONE'
);

const forbiddenAuthorityKeys = [
  'protectedRuntimeAdapterInvocationAuthorized',
  'manifestPublicationAuthorized',

  'reasoningExecutionAuthority',
  'modelExecutionAuthority',
  'queueMutationAuthority',
  'workerExecutionAuthority',

  'writeScopeExpanded',
  'appWriteAuthority',
  'componentsWriteAuthority',
  'libWriteAuthority',
  'toolsWriteAuthority',

  'primaryRepoMutationAuthorized',
  'patchApplicationAuthority',
  'patchPromotionAuthorized',

  'gitAddAuthority',
  'gitCommitAuthority',
  'gitMergeAuthority',
  'gitPushAuthority',

  'databaseAuthority',
  'productionAuthority',
  'publicLaunchAuthority',
  'networkAuthority',
];

for (const key of forbiddenAuthorityKeys) {
  assert(
    AUTHORITY_BOUNDARY[key] === false,
    `FORBIDDEN_AUTHORITY_OPEN:${key}`
  );
}

const discoveryResult = Object.freeze({
  version: 2,
  discoveryOnly: true,
  discoveryResultAuthority: 'NONE',
  candidateCount: 2,
  candidates: Object.freeze([
    Object.freeze({
      candidateSourceInputVersion: 2,
      relativePath: 'app/example.ts',
      extension: '.ts',
      matchedPatterns: Object.freeze([
        'export ',
      ]),
      trackedOnly: true,
      unchangedFromRuntimeBaseHeadOnly: true,
      regularFileOnly: true,
      discoveryResultAuthority: 'NONE',
    }),

    Object.freeze({
      candidateSourceInputVersion: 2,
      relativePath: 'components/example.jsx',
      extension: '.jsx',
      matchedPatterns: Object.freeze([
        'import ',
      ]),
      trackedOnly: true,
      unchangedFromRuntimeBaseHeadOnly: true,
      regularFileOnly: true,
      discoveryResultAuthority: 'NONE',
    }),
  ]),
});

const held = prepareHeldReasoningPipelineInput({
  discoveryResult,
});

assert(
  held.schema === BRIDGE_SCHEMA,
  'OUTPUT_SCHEMA_MISMATCH'
);

assert(
  held.status === 'HELD',
  'OUTPUT_PIPELINE_NOT_HELD'
);

assert(
  held.reason ===
    'DISCOVERY_CONNECTED_EXECUTION_NOT_AUTHORIZED',
  'OUTPUT_HOLD_REASON_MISMATCH'
);

assert(
  held.discoverySourceVersion === 2,
  'OUTPUT_DISCOVERY_VERSION_MISMATCH'
);

assert(
  held.discoveryResultAuthority === 'NONE',
  'OUTPUT_DISCOVERY_AUTHORITY_NOT_NONE'
);

assert(
  held.candidateCount === 2 &&
    held.candidateSourceInputs.length === 2,
  'OUTPUT_CANDIDATE_COUNT_MISMATCH'
);

for (const candidate of held.candidateSourceInputs) {
  assert(
    candidate.candidateSourceInputVersion === 2,
    `OUTPUT_CANDIDATE_VERSION_MISMATCH:${candidate.relativePath}`
  );

  assert(
    candidate.discoveryResultAuthority === 'NONE',
    `OUTPUT_DISCOVERY_AUTHORITY_PRESENT:${candidate.relativePath}`
  );

  assert(
    candidate.reasoningAuthority === 'NONE',
    `OUTPUT_REASONING_AUTHORITY_PRESENT:${candidate.relativePath}`
  );

  assert(
    candidate.writeAuthority === 'NONE',
    `OUTPUT_WRITE_AUTHORITY_PRESENT:${candidate.relativePath}`
  );

  assert(
    candidate.trackedOnly === true,
    `OUTPUT_TRACKED_GUARD_MISSING:${candidate.relativePath}`
  );

  assert(
    candidate.unchangedFromRuntimeBaseHeadOnly === true,
    `OUTPUT_BASE_HEAD_GUARD_MISSING:${candidate.relativePath}`
  );

  assert(
    candidate.regularFileOnly === true,
    `OUTPUT_REGULAR_FILE_GUARD_MISSING:${candidate.relativePath}`
  );
}

assert(
  held.protectedRuntimeAdapter.path ===
    PROTECTED_RUNTIME_ADAPTER_PATH,
  'OUTPUT_PROTECTED_ADAPTER_PATH_MISMATCH'
);

assert(
  held.protectedRuntimeAdapter.invocationAuthorized === false,
  'PROTECTED_ADAPTER_INVOCATION_OPEN'
);

assert(
  held.protectedRuntimeAdapter.manifestPublicationAuthorized === false,
  'MANIFEST_PUBLICATION_OPEN'
);

assert(
  held.materializerStatus === 'HOLD',
  'OUTPUT_MATERIALIZER_NOT_HELD'
);

assert(
  held.canonicalDelegationStatus === 'BLOCKED',
  'OUTPUT_CANONICAL_DELEGATION_NOT_BLOCKED'
);

for (const key of forbiddenAuthorityKeys) {
  assert(
    held.authorityBoundary[key] === false,
    `OUTPUT_FORBIDDEN_AUTHORITY_OPEN:${key}`
  );
}

const noWork = prepareHeldReasoningPipelineInput({
  discoveryResult: Object.freeze({
    version: 2,
    discoveryOnly: true,
    discoveryResultAuthority: 'NONE',
    candidateCount: 0,
    candidates: Object.freeze([]),
  }),
});

assert(
  noWork.status === 'HELD' &&
    noWork.candidateCount === 0,
  'NO_WORK_NOT_PRESERVED_AS_HELD'
);

expectFailClosed(
  () =>
    prepareHeldReasoningPipelineInput({
      discoveryResult: {
        version: 2,
        discoveryOnly: true,
        discoveryResultAuthority: 'WRITE',
        candidateCount: 0,
        candidates: [],
      },
    }),
  'DISCOVERY_RESULT_AUTHORITY_NOT_NONE'
);

expectFailClosed(
  () =>
    prepareHeldReasoningPipelineInput({
      discoveryResult: {
        version: 2,
        discoveryOnly: true,
        discoveryResultAuthority: 'NONE',
        candidateCount: 1,
        candidates: [
          {
            candidateSourceInputVersion: 2,
            relativePath:
              'tools/nexus-autonomy-v1/protected.cjs',
            extension: '.cjs',
            matchedPatterns: ['require('],
            trackedOnly: true,
            unchangedFromRuntimeBaseHeadOnly: true,
            regularFileOnly: true,
            discoveryResultAuthority: 'NONE',
          },
        ],
      },
    }),
  'CANDIDATE_OUTSIDE_DISCOVERY_ROOT:tools/nexus-autonomy-v1/protected.cjs'
);

expectFailClosed(
  () =>
    prepareHeldReasoningPipelineInput({
      discoveryResult: {
        version: 2,
        discoveryOnly: true,
        discoveryResultAuthority: 'NONE',
        candidateCount: 1,
        candidates: [
          {
            candidateSourceInputVersion: 2,
            relativePath: 'app/example.ts',
            extension: '.ts',
            matchedPatterns: ['export '],
            trackedOnly: true,
            unchangedFromRuntimeBaseHeadOnly: true,
            regularFileOnly: true,
            discoveryResultAuthority: 'WRITE',
          },
        ],
      },
    }),
  'DISCOVERY_AUTHORITY_NOT_NONE:app/example.ts'
);

console.log('HELD_BRIDGE_SCHEMA=PASS');
console.log('HELD_PIPELINE_STATUS=PASS');
console.log('MATERIALIZER_HOLD=PASS');
console.log('CANONICAL_DELEGATION_BLOCK=PASS');
console.log('PROTECTED_ADAPTER_INVOCATION_AUTHORIZED=FALSE_PASS');
console.log('MANIFEST_PUBLICATION_AUTHORIZED=FALSE_PASS');
console.log('DISCOVERY_RESULT_AUTHORITY_NONE=PASS');
console.log('REASONING_EXECUTION_AUTHORITY_ZERO=PASS');
console.log('MODEL_EXECUTION_AUTHORITY_ZERO=PASS');
console.log('QUEUE_MUTATION_AUTHORITY_ZERO=PASS');
console.log('WRITE_AUTHORITY_ZERO=PASS');
console.log('GIT_MUTATION_AUTHORITY_ZERO=PASS');
console.log('DATABASE_AUTHORITY_ZERO=PASS');
console.log('PRODUCTION_AUTHORITY_ZERO=PASS');
console.log('NETWORK_AUTHORITY_ZERO=PASS');
console.log('CANDIDATE_SOURCE_INPUT_V2=PASS');
console.log('NO_WORK_HELD_PATH=PASS');
console.log('FAIL_CLOSED_NEGATIVE_CASES=PASS');
console.log('FAST_SAFE_286B_HELD_BRIDGE_SYNTHETIC_SELF_TEST=PASS');