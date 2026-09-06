'use strict';

const HANDOFF_SCHEMA =
  'NEXUS_PRE_MODEL_HELD_DECISION_HANDOFF_V1';

const APPROVED_MISSION_ID =
  'semantic-nullish-fallback-preserve-explicit-falsy-v1';

const SEMANTIC_LANE =
  'fallback-policy-v1';

const SUPPORTED_ROOTS =
  Object.freeze([
    'app',
    'components',
    'lib',
  ]);

const SUPPORTED_EXTENSIONS =
  Object.freeze([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.cjs',
  ]);

const STATUS =
  Object.freeze({
    HELD_DECISION_READY:
      'HELD_DECISION_READY',

    HELD_NO_CHANGE:
      'HELD_NO_CHANGE',

    STOP:
      'STOP',
  });

const AUTHORITY_BOUNDARY =
  Object.freeze({
    ownerDecisionGenerated: false,
    ownerAuthorityGenerated: false,
    activationTokenGenerated: false,

    executionAuthorizationGenerated: false,
    executionAuthorityGenerated: false,

    reasoningExecutionAuthority: false,
    modelExecutionAuthority: false,

    queueMutationAuthority: false,
    workerExecutionAuthority: false,

    primaryRepoMutationAuthorized: false,
    newFileAuthority: false,
    sourceMutationAuthority: false,

    patchApplicationAuthority: false,
    patchPromotionAuthorized: false,

    materializerAuthority: false,
    canonicalDelegationAuthority: false,

    gitAuthority: false,
    databaseAuthority: false,
    productionAuthority: false,
    networkAuthority: false,
  });

function isPlainRecord(value) {
  if(
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ){
    return false;
  }

  const proto =
    Object.getPrototypeOf(value);

  return (
    proto === Object.prototype ||
    proto === null
  );
}

function exactKeys(value, expected) {
  const actual =
    Object.keys(value).sort();

  const wanted =
    [...expected].sort();

  return (
    actual.length === wanted.length &&
    actual.every(
      (key, index) =>
        key === wanted[index]
    )
  );
}

function stop(reason) {
  return Object.freeze({
    schema: HANDOFF_SCHEMA,
    status: STATUS.STOP,
    reason,
    held: true,

    materializerStatus: 'HOLD',

    canonicalDelegationStatus:
      'BLOCKED',

    downstreamExecutionAuthorized:
      false,

    authorityBoundary:
      AUTHORITY_BOUNDARY,
  });
}

function validRelativePath(relativePath) {
  if(
    typeof relativePath !== 'string' ||
    relativePath.length < 1 ||
    relativePath.startsWith('/') ||
    relativePath.includes('\\') ||
    relativePath.includes('../') ||
    relativePath.includes('/../')
  ){
    return false;
  }

  const parts =
    relativePath.split('/');

  if(parts.length < 2){
    return false;
  }

  if(
    !SUPPORTED_ROOTS.includes(
      parts[0]
    )
  ){
    return false;
  }

  const lower =
    relativePath.toLowerCase();

  return SUPPORTED_EXTENSIONS.some(
    (extension) =>
      lower.endsWith(extension)
  );
}

function allAuthorityZero(boundary) {
  if(!isPlainRecord(boundary)){
    return false;
  }

  for(const value of Object.values(boundary)){
    if(value !== false){
      return false;
    }
  }

  return true;
}

function validateCandidate(candidate) {
  if(
    !isPlainRecord(candidate) ||
    !exactKeys(
      candidate,
      [
        'relativePath',
        'lineNumber',
        'sourceSha256',
      ]
    )
  ){
    return false;
  }

  if(
    !validRelativePath(
      candidate.relativePath
    )
  ){
    return false;
  }

  if(
    !Number.isInteger(
      candidate.lineNumber
    ) ||
    candidate.lineNumber < 1
  ){
    return false;
  }

  if(
    typeof candidate.sourceSha256 !==
      'string' ||
    !/^[0-9a-f]{64}$/.test(
      candidate.sourceSha256
    )
  ){
    return false;
  }

  return true;
}

function validateDecision(decision) {
  if(!isPlainRecord(decision)){
    return 'DECISION_RESULT_INVALID';
  }

  if(
    decision.ready !== true
  ){
    return 'DECISION_NOT_READY';
  }

  if(
    decision.missionId !==
      APPROVED_MISSION_ID
  ){
    return 'DECISION_MISSION_ID_MISMATCH';
  }

  if(
    decision.semanticLane !==
      SEMANTIC_LANE
  ){
    return 'DECISION_SEMANTIC_LANE_MISMATCH';
  }

  if(
    decision.modelRequired !== false ||
    decision.modelExecuted !== false
  ){
    return 'DECISION_MODEL_BOUNDARY_OPEN';
  }

  if(
    decision.patchApplicationAuthorized !==
      false
  ){
    return 'DECISION_PATCH_AUTHORITY_OPEN';
  }

  if(
    decision.materializerStatus !==
      'HOLD'
  ){
    return 'DECISION_MATERIALIZER_NOT_HELD';
  }

  if(
    decision.canonicalDelegationStatus !==
      'BLOCKED'
  ){
    return 'DECISION_CANONICAL_DELEGATION_NOT_BLOCKED';
  }

  if(
    !allAuthorityZero(
      decision.authorityBoundary
    )
  ){
    return 'DECISION_FORBIDDEN_AUTHORITY_OPEN';
  }

  if(
    typeof decision.oldLine !==
      'string' ||
    typeof decision.proposedLine !==
      'string'
  ){
    return 'DECISION_LINE_CONTRACT_INVALID';
  }

  if(
    decision.status ===
      'DECISION_READY'
  ){
    if(
      decision.selectedFallbackPolicy !==
        'nullish_only'
    ){
      return 'DECISION_READY_POLICY_MISMATCH';
    }

    if(
      decision.sourceChangeProposed !==
        true
    ){
      return 'DECISION_READY_CHANGE_FLAG_MISMATCH';
    }

    if(
      decision.oldLine ===
        decision.proposedLine
    ){
      return 'DECISION_READY_LINE_UNCHANGED';
    }

    return null;
  }

  if(
    decision.status ===
      'NO_CHANGE'
  ){
    if(
      decision.selectedFallbackPolicy !==
        'keep_existing'
    ){
      return 'NO_CHANGE_POLICY_MISMATCH';
    }

    if(
      decision.sourceChangeProposed !==
        false
    ){
      return 'NO_CHANGE_FLAG_MISMATCH';
    }

    if(
      decision.oldLine !==
        decision.proposedLine
    ){
      return 'NO_CHANGE_LINE_CHANGED';
    }

    return null;
  }

  return 'DECISION_STATUS_UNSUPPORTED';
}

function createHeldDecisionHandoff(input) {
  if(
    !isPlainRecord(input) ||
    !exactKeys(
      input,
      [
        'candidate',
        'decisionResult',
      ]
    )
  ){
    return stop(
      'HELD_HANDOFF_INPUT_INVALID'
    );
  }

  if(
    !validateCandidate(
      input.candidate
    )
  ){
    return stop(
      'HELD_HANDOFF_CANDIDATE_INVALID'
    );
  }

  const decisionFailure =
    validateDecision(
      input.decisionResult
    );

  if(decisionFailure !== null){
    return stop(
      decisionFailure
    );
  }

  const noChange =
    input.decisionResult.status ===
      'NO_CHANGE';

  return Object.freeze({
    schema: HANDOFF_SCHEMA,

    status:
      noChange
        ? STATUS.HELD_NO_CHANGE
        : STATUS.HELD_DECISION_READY,

    reason:
      noChange
        ? 'HOST_APPROVED_NO_CHANGE_HELD_NON_EXECUTING'
        : 'HOST_APPROVED_DECISION_HELD_NON_EXECUTING',

    held: true,

    missionId:
      APPROVED_MISSION_ID,

    semanticLane:
      SEMANTIC_LANE,

    candidate:
      Object.freeze({
        relativePath:
          input.candidate.relativePath,

        lineNumber:
          input.candidate.lineNumber,

        sourceSha256:
          input.candidate.sourceSha256,
      }),

    decision:
      Object.freeze({
        selectedFallbackPolicy:
          input.decisionResult
            .selectedFallbackPolicy,

        oldLine:
          input.decisionResult.oldLine,

        proposedLine:
          input.decisionResult
            .proposedLine,

        sourceChangeProposed:
          input.decisionResult
            .sourceChangeProposed,
      }),

    modelExecutionAuthorized: false,
    patchApplicationAuthorized: false,
    materializerInvocationAuthorized:
      false,
    canonicalDelegationAuthorized:
      false,

    downstreamExecutionAuthorized:
      false,

    materializerStatus: 'HOLD',

    canonicalDelegationStatus:
      'BLOCKED',

    authorityBoundary:
      AUTHORITY_BOUNDARY,
  });
}

module.exports =
  Object.freeze({
    HANDOFF_SCHEMA,
    APPROVED_MISSION_ID,
    SEMANTIC_LANE,
    SUPPORTED_ROOTS,
    SUPPORTED_EXTENSIONS,
    STATUS,
    AUTHORITY_BOUNDARY,
    createHeldDecisionHandoff,
  });