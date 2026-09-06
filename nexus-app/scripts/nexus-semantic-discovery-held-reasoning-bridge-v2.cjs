'use strict';

const path = require('node:path');

const BRIDGE_SCHEMA =
  'NEXUS_SEMANTIC_DISCOVERY_HELD_REASONING_BRIDGE_V2';

const PIPELINE_STATUS = 'HELD';
const MATERIALIZER_STATUS = 'HOLD';
const CANONICAL_DELEGATION_STATUS = 'BLOCKED';

const PROTECTED_RUNTIME_ADAPTER_PATH =
  'tools/nexus-autonomy-v1/owner-controlled-readonly-reasoning-trusted-source-runtime-adapter.candidate.cjs';

const PROTECTED_RUNTIME_ADAPTER_INPUT_KEYS = Object.freeze([
  'manifestPublicationAuthorized',
  'seedEvidencePath',
  'seedEvidenceSha256',
]);

const SUPPORTED_EXTENSIONS = Object.freeze([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);

const DISCOVERY_ROOTS = Object.freeze([
  'app/',
  'components/',
  'lib/',
]);

const AUTHORITY_BOUNDARY = Object.freeze({
  discoveryResultAuthority: 'NONE',

  protectedRuntimeAdapterInvocationAuthorized: false,
  manifestPublicationAuthorized: false,

  reasoningExecutionAuthority: false,
  modelExecutionAuthority: false,
  queueMutationAuthority: false,
  workerExecutionAuthority: false,

  writeScopeExpanded: false,
  appWriteAuthority: false,
  componentsWriteAuthority: false,
  libWriteAuthority: false,
  toolsWriteAuthority: false,

  primaryRepoMutationAuthorized: false,
  patchApplicationAuthority: false,
  patchPromotionAuthorized: false,

  gitAddAuthority: false,
  gitCommitAuthority: false,
  gitMergeAuthority: false,
  gitPushAuthority: false,

  databaseAuthority: false,
  productionAuthority: false,
  publicLaunchAuthority: false,
  networkAuthority: false,
});

function failClosed(message) {
  throw new Error(
    `HELD_REASONING_BRIDGE_V2_FAIL_CLOSED:${message}`
  );
}

function normalizeRelativePath(value) {
  return String(value)
    .replace(/\\/g, '/')
    .replace(/^\.\/+/, '');
}

function isAllowedDiscoveryPath(relativePath) {
  const normalized = normalizeRelativePath(relativePath);

  return DISCOVERY_ROOTS.some(
    (root) => normalized.startsWith(root)
  );
}

function validateCandidate(candidate) {
  if (
    !candidate ||
    typeof candidate !== 'object' ||
    Array.isArray(candidate)
  ) {
    failClosed('CANDIDATE_OBJECT_REQUIRED');
  }

  if(candidate.candidateSourceInputVersion !== 2){
    failClosed('CANDIDATE_SOURCE_INPUT_VERSION_NOT_2');
  }

  if(
    typeof candidate.relativePath !== 'string' ||
    candidate.relativePath.length === 0
  ){
    failClosed('CANDIDATE_RELATIVE_PATH_REQUIRED');
  }

  const relativePath =
    normalizeRelativePath(candidate.relativePath);

  if(!isAllowedDiscoveryPath(relativePath)){
    failClosed(
      `CANDIDATE_OUTSIDE_DISCOVERY_ROOT:${relativePath}`
    );
  }

  if(
    relativePath === 'tools/nexus-autonomy-v1' ||
    relativePath.startsWith('tools/nexus-autonomy-v1/')
  ){
    failClosed('PROTECTED_CONTROL_PLANE_CANDIDATE_REJECTED');
  }

  const extension =
    path.posix.extname(relativePath).toLowerCase();

  if(!SUPPORTED_EXTENSIONS.includes(extension)){
    failClosed(
      `UNSUPPORTED_CANDIDATE_EXTENSION:${relativePath}`
    );
  }

  if(candidate.extension !== extension){
    failClosed(
      `CANDIDATE_EXTENSION_MISMATCH:${relativePath}`
    );
  }

  if(candidate.trackedOnly !== true){
    failClosed(
      `TRACKED_ONLY_CONTRACT_MISSING:${relativePath}`
    );
  }

  if(candidate.unchangedFromRuntimeBaseHeadOnly !== true){
    failClosed(
      `BASE_HEAD_GUARD_MISSING:${relativePath}`
    );
  }

  if(candidate.regularFileOnly !== true){
    failClosed(
      `REGULAR_FILE_GUARD_MISSING:${relativePath}`
    );
  }

  if(candidate.discoveryResultAuthority !== 'NONE'){
    failClosed(
      `DISCOVERY_AUTHORITY_NOT_NONE:${relativePath}`
    );
  }

  if(
    !Array.isArray(candidate.matchedPatterns) ||
    candidate.matchedPatterns.length === 0
  ){
    failClosed(
      `SEMANTIC_PATTERN_EVIDENCE_MISSING:${relativePath}`
    );
  }

  for(const pattern of candidate.matchedPatterns){
    if(
      typeof pattern !== 'string' ||
      pattern.length === 0
    ){
      failClosed(
        `INVALID_SEMANTIC_PATTERN:${relativePath}`
      );
    }
  }

  return Object.freeze({
    candidateSourceInputVersion: 2,
    relativePath,
    extension,
    matchedPatterns:
      Object.freeze([...candidate.matchedPatterns]),

    trackedOnly: true,
    unchangedFromRuntimeBaseHeadOnly: true,
    regularFileOnly: true,

    discoveryResultAuthority: 'NONE',
    reasoningAuthority: 'NONE',
    writeAuthority: 'NONE',
  });
}

function prepareHeldReasoningPipelineInput(input) {
  if(
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ){
    failClosed('INPUT_OBJECT_REQUIRED');
  }

  const discoveryResult = input.discoveryResult;

  if(
    !discoveryResult ||
    typeof discoveryResult !== 'object' ||
    Array.isArray(discoveryResult)
  ){
    failClosed('DISCOVERY_RESULT_REQUIRED');
  }

  if(discoveryResult.version !== 2){
    failClosed('DISCOVERY_RESULT_VERSION_NOT_2');
  }

  if(discoveryResult.discoveryOnly !== true){
    failClosed('DISCOVERY_ONLY_CONTRACT_MISSING');
  }

  if(discoveryResult.discoveryResultAuthority !== 'NONE'){
    failClosed('DISCOVERY_RESULT_AUTHORITY_NOT_NONE');
  }

  if(!Array.isArray(discoveryResult.candidates)){
    failClosed('DISCOVERY_CANDIDATES_ARRAY_REQUIRED');
  }

  if(
    discoveryResult.candidateCount !==
    discoveryResult.candidates.length
  ){
    failClosed('DISCOVERY_CANDIDATE_COUNT_MISMATCH');
  }

  if(discoveryResult.candidates.length > 128){
    failClosed('DISCOVERY_CANDIDATE_BOUND_EXCEEDED');
  }

  const candidateSourceInputs =
    discoveryResult.candidates.map(validateCandidate);

  return Object.freeze({
    schema: BRIDGE_SCHEMA,

    status: PIPELINE_STATUS,
    reason:
      'DISCOVERY_CONNECTED_EXECUTION_NOT_AUTHORIZED',

    discoverySourceVersion: 2,
    discoveryResultAuthority: 'NONE',

    candidateCount:
      candidateSourceInputs.length,

    candidateSourceInputs:
      Object.freeze(candidateSourceInputs),

    protectedRuntimeAdapter:
      Object.freeze({
        path: PROTECTED_RUNTIME_ADAPTER_PATH,

        requiredInputKeys:
          PROTECTED_RUNTIME_ADAPTER_INPUT_KEYS,

        invocationAuthorized: false,
        manifestPublicationAuthorized: false,
      }),

    materializerStatus:
      MATERIALIZER_STATUS,

    canonicalDelegationStatus:
      CANONICAL_DELEGATION_STATUS,

    authorityBoundary:
      AUTHORITY_BOUNDARY,
  });
}

module.exports = Object.freeze({
  BRIDGE_SCHEMA,
  PIPELINE_STATUS,
  MATERIALIZER_STATUS,
  CANONICAL_DELEGATION_STATUS,

  PROTECTED_RUNTIME_ADAPTER_PATH,
  PROTECTED_RUNTIME_ADAPTER_INPUT_KEYS,

  AUTHORITY_BOUNDARY,

  prepareHeldReasoningPipelineInput,
});