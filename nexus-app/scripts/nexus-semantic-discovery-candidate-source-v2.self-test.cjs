'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  DISCOVERY_ROOTS,
  SUPPORTED_EXTENSIONS,
  PROTECTED_ROOTS,
  DISCOVERY_RESULT_AUTHORITY,
  AUTHORITY_BOUNDARY,
  discoverCandidateSourceV2,
} = require('./nexus-semantic-discovery-candidate-source-v2.cjs');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION_FAILED:${message}`);
  }
}

function runGit(repo, args) {
  return execFileSync('git', args, {
    cwd: repo,
    encoding: 'utf8',
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function write(repo, relativePath, content) {
  const target = path.join(repo, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

const fixtureRoot = path.join(
  __dirname,
  `.fast-safe-284b-fixture-${process.pid}-${Date.now()}`
);

let fixtureCreated = false;

try {
  fs.mkdirSync(fixtureRoot, { recursive: false });
  fixtureCreated = true;

  runGit(fixtureRoot, ['init']);
  runGit(fixtureRoot, ['config', 'user.email', 'nexus-self-test@example.invalid']);
  runGit(fixtureRoot, ['config', 'user.name', 'NEXUS Synthetic Self Test']);

  const semanticPattern = 'NEXUS_SYNTHETIC_SEMANTIC_PATTERN_V2';

  const supportedFiles = [
    'app/a.ts',
    'app/b.tsx',
    'components/c.js',
    'components/d.jsx',
    'lib/e.mjs',
    'lib/f.cjs',
  ];

  for (const relativePath of supportedFiles) {
    write(
      fixtureRoot,
      relativePath,
      `export const marker = '${semanticPattern}';\n`
    );
  }

  write(
    fixtureRoot,
    'app/no-match.ts',
    "export const marker = 'NO_MATCH';\n"
  );

  write(
    fixtureRoot,
    'app/excluded.test.ts',
    `export const marker = '${semanticPattern}';\n`
  );

  write(
    fixtureRoot,
    'components/excluded.spec.jsx',
    `export const marker = '${semanticPattern}';\n`
  );

  write(
    fixtureRoot,
    'lib/__tests__/excluded.js',
    `export const marker = '${semanticPattern}';\n`
  );

  write(
    fixtureRoot,
    'app/unsupported.txt',
    semanticPattern
  );

  write(
    fixtureRoot,
    'tools/nexus-autonomy-v1/protected.cjs',
    `module.exports = '${semanticPattern}';\n`
  );

  runGit(fixtureRoot, ['add', '.']);
  runGit(fixtureRoot, ['commit', '-m', 'synthetic base']);

  const baseHead = runGit(fixtureRoot, ['rev-parse', 'HEAD']);

  write(
    fixtureRoot,
    'app/changed-after-base.ts',
    `export const marker = '${semanticPattern}';\n`
  );

  runGit(fixtureRoot, ['add', 'app/changed-after-base.ts']);
  runGit(fixtureRoot, ['commit', '-m', 'add changed candidate']);

  write(
    fixtureRoot,
    'app/untracked.ts',
    `export const marker = '${semanticPattern}';\n`
  );

  const result = discoverCandidateSourceV2({
    repoRoot: fixtureRoot,
    runtimeBaseHead: baseHead,
    semanticPatterns: [semanticPattern],
    maxCandidates: 64,
    maxFileBytes: 1024 * 1024,
  });

  assert(result.version === 2, 'VERSION_NOT_2');
  assert(result.discoveryOnly === true, 'DISCOVERY_ONLY_NOT_TRUE');
  assert(
    result.discoveryResultAuthority === 'NONE',
    'DISCOVERY_AUTHORITY_NOT_NONE'
  );

  assert(
    JSON.stringify([...DISCOVERY_ROOTS]) ===
      JSON.stringify(['app', 'components', 'lib']),
    'DISCOVERY_ROOTS_MISMATCH'
  );

  assert(
    JSON.stringify([...SUPPORTED_EXTENSIONS]) ===
      JSON.stringify(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']),
    'SUPPORTED_EXTENSIONS_MISMATCH'
  );

  assert(
    PROTECTED_ROOTS.includes('tools/nexus-autonomy-v1'),
    'PROTECTED_ROOT_MISSING'
  );

  assert(
    DISCOVERY_RESULT_AUTHORITY === 'NONE',
    'EXPORTED_DISCOVERY_AUTHORITY_NOT_NONE'
  );

  assert(
    AUTHORITY_BOUNDARY.writeScopeExpanded === false,
    'WRITE_SCOPE_EXPANDED'
  );

  assert(
    AUTHORITY_BOUNDARY.appWriteAuthority === false &&
      AUTHORITY_BOUNDARY.componentsWriteAuthority === false &&
      AUTHORITY_BOUNDARY.libWriteAuthority === false &&
      AUTHORITY_BOUNDARY.toolsWriteAuthority === false,
    'WRITE_AUTHORITY_PRESENT'
  );

  assert(
    AUTHORITY_BOUNDARY.modelExecutionAuthority === false &&
      AUTHORITY_BOUNDARY.queueMutationAuthority === false &&
      AUTHORITY_BOUNDARY.databaseAuthority === false &&
      AUTHORITY_BOUNDARY.productionAuthority === false &&
      AUTHORITY_BOUNDARY.networkAuthority === false,
    'FORBIDDEN_AUTHORITY_PRESENT'
  );

  const paths = result.candidates.map((candidate) => candidate.relativePath);

  assert(
    result.candidateCount === 6,
    `EXPECTED_6_CANDIDATES_GOT_${result.candidateCount}`
  );

  for (const relativePath of supportedFiles) {
    assert(
      paths.includes(relativePath),
      `SUPPORTED_FILE_MISSING:${relativePath}`
    );
  }

  assert(!paths.includes('app/no-match.ts'), 'NO_MATCH_FILE_ADMITTED');
  assert(!paths.includes('app/excluded.test.ts'), 'TEST_FILE_ADMITTED');
  assert(
    !paths.includes('components/excluded.spec.jsx'),
    'SPEC_FILE_ADMITTED'
  );
  assert(
    !paths.includes('lib/__tests__/excluded.js'),
    'TEST_DIRECTORY_FILE_ADMITTED'
  );
  assert(!paths.includes('app/unsupported.txt'), 'UNSUPPORTED_FILE_ADMITTED');
  assert(!paths.includes('app/untracked.ts'), 'UNTRACKED_FILE_ADMITTED');
  assert(
    !paths.includes('app/changed-after-base.ts'),
    'CHANGED_SINCE_BASE_FILE_ADMITTED'
  );
  assert(
    !paths.includes('tools/nexus-autonomy-v1/protected.cjs'),
    'PROTECTED_CONTROL_PLANE_ADMITTED'
  );

  for (const candidate of result.candidates) {
    assert(
      candidate.candidateSourceInputVersion === 2,
      `CANDIDATE_VERSION_MISMATCH:${candidate.relativePath}`
    );
    assert(
      candidate.trackedOnly === true,
      `TRACKED_ONLY_FALSE:${candidate.relativePath}`
    );
    assert(
      candidate.unchangedFromRuntimeBaseHeadOnly === true,
      `BASE_HEAD_GUARD_FALSE:${candidate.relativePath}`
    );
    assert(
      candidate.regularFileOnly === true,
      `REGULAR_FILE_GUARD_FALSE:${candidate.relativePath}`
    );
    assert(
      candidate.discoveryResultAuthority === 'NONE',
      `CANDIDATE_AUTHORITY_NOT_NONE:${candidate.relativePath}`
    );
    assert(
      candidate.matchedPatterns.length === 1 &&
        candidate.matchedPatterns[0] === semanticPattern,
      `SEMANTIC_MATCH_CONTRACT_FAILED:${candidate.relativePath}`
    );
  }

  let invalidInputFailedClosed = false;

  try {
    discoverCandidateSourceV2({
      repoRoot: fixtureRoot,
      runtimeBaseHead: baseHead,
      semanticPatterns: [],
    });
  } catch (error) {
    invalidInputFailedClosed =
      String(error.message).includes(
        'DISCOVERY_ONLY_V2_FAIL_CLOSED:HOST_RECOGNIZED_SEMANTIC_PATTERNS_REQUIRED'
      );
  }

  assert(invalidInputFailedClosed, 'INVALID_INPUT_DID_NOT_FAIL_CLOSED');

  console.log('SYNTHETIC_SUPPORTED_EXTENSIONS=6/6_PASS');
  console.log('SYNTHETIC_DISCOVERY_ROOTS=APP_COMPONENTS_LIB_PASS');
  console.log('SYNTHETIC_EXACT_SEMANTIC_PATTERN=PASS');
  console.log('SYNTHETIC_TRACKED_ONLY=PASS');
  console.log('SYNTHETIC_UNCHANGED_FROM_RUNTIME_BASE_HEAD_ONLY=PASS');
  console.log('SYNTHETIC_TEST_SPEC_EXCLUSION=PASS');
  console.log('SYNTHETIC_UNSUPPORTED_EXTENSION_EXCLUSION=PASS');
  console.log('SYNTHETIC_PROTECTED_CONTROL_PLANE_EXCLUSION=PASS');
  console.log('SYNTHETIC_DISCOVERY_RESULT_AUTHORITY_NONE=PASS');
  console.log('SYNTHETIC_WRITE_AUTHORITY_ZERO=PASS');
  console.log('SYNTHETIC_INVALID_INPUT_FAIL_CLOSED=PASS');
  console.log('FAST_SAFE_284B_SYNTHETIC_SELF_TEST=PASS');
} finally {
  if (fixtureCreated) {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }

  console.log(
    `SYNTHETIC_FIXTURE_CLEANED=${!fs.existsSync(fixtureRoot) ? 'TRUE' : 'FALSE'}`
  );
}