'use strict';

const {
  STATUS,
  AUTHORITY_BOUNDARY,
  createHeldDecisionHandoff,
} = require(
  './nexus-pre-model-held-decision-handoff-v1.cjs'
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(
      `ASSERTION_FAILED:${message}`
    );
  }
}

function assertZeroAuthority(result, label) {
  for (
    const [key, value]
    of Object.entries(
      result.authorityBoundary
    )
  ) {
    assert(
      value === false,
      `${label}:AUTHORITY_OPEN:${key}`
    );
  }
}

const candidate = Object.freeze({
  relativePath:
    'app/api/ai/route.ts',

  lineNumber:
    30,

  sourceSha256:
    '3a33025a68e07f9b9e419ce47f4c5df770ecff3c69fdb060da004d3afda21b83',
});

const baseDecision = Object.freeze({
  status:
    'DECISION_READY',

  ready:
    true,

  missionId:
    'semantic-nullish-fallback-preserve-explicit-falsy-v1',

  semanticLane:
    'fallback-policy-v1',

  selectedFallbackPolicy:
    'nullish_only',

  oldLine:
    'const customerMessage = prompt || "";',

  proposedLine:
    'const customerMessage = prompt ?? "";',

  sourceChangeProposed:
    true,

  modelRequired:
    false,

  modelExecuted:
    false,

  patchApplicationAuthorized:
    false,

  materializerStatus:
    'HOLD',

  canonicalDelegationStatus:
    'BLOCKED',

  authorityBoundary:
    AUTHORITY_BOUNDARY,
});

const ready =
  createHeldDecisionHandoff({
    candidate,
    decisionResult:
      baseDecision,
  });

assert(
  ready.status ===
    STATUS.HELD_DECISION_READY,
  'DECISION_READY_NOT_HELD'
);

assert(
  ready.held === true,
  'READY_NOT_HELD'
);

assert(
  ready.decision.proposedLine ===
    'const customerMessage = prompt ?? "";',
  'READY_PROPOSED_LINE_MISMATCH'
);

assert(
  ready.modelExecutionAuthorized === false,
  'MODEL_EXECUTION_AUTHORIZED'
);

assert(
  ready.patchApplicationAuthorized === false,
  'PATCH_APPLICATION_AUTHORIZED'
);

assert(
  ready.materializerInvocationAuthorized === false,
  'MATERIALIZER_INVOCATION_AUTHORIZED'
);

assert(
  ready.canonicalDelegationAuthorized === false,
  'CANONICAL_DELEGATION_AUTHORIZED'
);

assert(
  ready.downstreamExecutionAuthorized === false,
  'DOWNSTREAM_EXECUTION_AUTHORIZED'
);

assert(
  ready.materializerStatus === 'HOLD',
  'MATERIALIZER_NOT_HELD'
);

assert(
  ready.canonicalDelegationStatus === 'BLOCKED',
  'CANONICAL_NOT_BLOCKED'
);

assertZeroAuthority(
  ready,
  'READY'
);

const noChangeDecision =
  Object.freeze({
    ...baseDecision,

    status:
      'NO_CHANGE',

    selectedFallbackPolicy:
      'keep_existing',

    proposedLine:
      baseDecision.oldLine,

    sourceChangeProposed:
      false,
  });

const noChange =
  createHeldDecisionHandoff({
    candidate,
    decisionResult:
      noChangeDecision,
  });

assert(
  noChange.status ===
    STATUS.HELD_NO_CHANGE,
  'NO_CHANGE_NOT_HELD'
);

assert(
  noChange.decision.oldLine ===
    noChange.decision.proposedLine,
  'NO_CHANGE_LINE_CHANGED'
);

assertZeroAuthority(
  noChange,
  'NO_CHANGE'
);

const invalidCandidate =
  createHeldDecisionHandoff({
    candidate: {
      ...candidate,
      relativePath:
        '../tools/nexus-autonomy-v1/x.cjs',
    },

    decisionResult:
      baseDecision,
  });

assert(
  invalidCandidate.status ===
    STATUS.STOP,
  'INVALID_CANDIDATE_NOT_STOP'
);

assert(
  invalidCandidate.reason ===
    'HELD_HANDOFF_CANDIDATE_INVALID',
  'INVALID_CANDIDATE_REASON_MISMATCH'
);

assertZeroAuthority(
  invalidCandidate,
  'INVALID_CANDIDATE'
);

const modelOpen =
  createHeldDecisionHandoff({
    candidate,

    decisionResult: {
      ...baseDecision,
      modelExecuted: true,
    },
  });

assert(
  modelOpen.status ===
    STATUS.STOP,
  'MODEL_OPEN_NOT_STOP'
);

assert(
  modelOpen.reason ===
    'DECISION_MODEL_BOUNDARY_OPEN',
  'MODEL_OPEN_REASON_MISMATCH'
);

assertZeroAuthority(
  modelOpen,
  'MODEL_OPEN'
);

const patchOpen =
  createHeldDecisionHandoff({
    candidate,

    decisionResult: {
      ...baseDecision,
      patchApplicationAuthorized:
        true,
    },
  });

assert(
  patchOpen.status ===
    STATUS.STOP,
  'PATCH_OPEN_NOT_STOP'
);

assert(
  patchOpen.reason ===
    'DECISION_PATCH_AUTHORITY_OPEN',
  'PATCH_OPEN_REASON_MISMATCH'
);

assertZeroAuthority(
  patchOpen,
  'PATCH_OPEN'
);

const materializerOpen =
  createHeldDecisionHandoff({
    candidate,

    decisionResult: {
      ...baseDecision,
      materializerStatus:
        'READY',
    },
  });

assert(
  materializerOpen.status ===
    STATUS.STOP,
  'MATERIALIZER_OPEN_NOT_STOP'
);

assert(
  materializerOpen.reason ===
    'DECISION_MATERIALIZER_NOT_HELD',
  'MATERIALIZER_OPEN_REASON_MISMATCH'
);

const canonicalOpen =
  createHeldDecisionHandoff({
    candidate,

    decisionResult: {
      ...baseDecision,
      canonicalDelegationStatus:
        'READY',
    },
  });

assert(
  canonicalOpen.status ===
    STATUS.STOP,
  'CANONICAL_OPEN_NOT_STOP'
);

assert(
  canonicalOpen.reason ===
    'DECISION_CANONICAL_DELEGATION_NOT_BLOCKED',
  'CANONICAL_OPEN_REASON_MISMATCH'
);

for (const value of Object.values(AUTHORITY_BOUNDARY)) {
  assert(
    value === false,
    'EXPORTED_AUTHORITY_BOUNDARY_OPEN'
  );
}

console.log('DECISION_READY_HELD=PASS');
console.log('NO_CHANGE_HELD=PASS');
console.log('INVALID_CANDIDATE_FAIL_CLOSED=PASS');
console.log('MODEL_AUTHORITY_OPEN_FAIL_CLOSED=PASS');
console.log('PATCH_AUTHORITY_OPEN_FAIL_CLOSED=PASS');
console.log('MATERIALIZER_OPEN_FAIL_CLOSED=PASS');
console.log('CANONICAL_DELEGATION_OPEN_FAIL_CLOSED=PASS');
console.log('ALL_AUTHORITY_FIELDS_ZERO=PASS');
console.log('MODEL_EXECUTED=FALSE');
console.log('PATCH_APPLIED=FALSE');
console.log('MATERIALIZER_HOLD=PASS');
console.log('CANONICAL_DELEGATION_BLOCK=PASS');
console.log('FAST_SAFE_292F_HELD_DECISION_HANDOFF_SELF_TEST=PASS');