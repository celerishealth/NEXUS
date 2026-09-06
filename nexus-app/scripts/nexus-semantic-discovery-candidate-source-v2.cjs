'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const DISCOVERY_ROOTS = Object.freeze([
  'app',
  'components',
  'lib',
]);

const SUPPORTED_EXTENSIONS = Object.freeze([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);

const PROTECTED_ROOTS = Object.freeze([
  'tools/nexus-autonomy-v1',
]);

const DISCOVERY_RESULT_AUTHORITY = 'NONE';

const AUTHORITY_BOUNDARY = Object.freeze({
  writeScopeExpanded: false,
  appWriteAuthority: false,
  componentsWriteAuthority: false,
  libWriteAuthority: false,
  toolsWriteAuthority: false,
  patchApplicationAuthority: false,
  gitMutationAuthority: false,
  queueMutationAuthority: false,
  modelExecutionAuthority: false,
  databaseAuthority: false,
  productionAuthority: false,
  networkAuthority: false,
});

function failClosed(message) {
  throw new Error(`DISCOVERY_ONLY_V2_FAIL_CLOSED:${message}`);
}

function normalizeRepoRelativePath(value) {
  return String(value).replace(/\\/g, '/').replace(/^\.\/+/, '');
}

function isInsideDiscoveryRoot(relativePath) {
  const normalized = normalizeRepoRelativePath(relativePath);

  return DISCOVERY_ROOTS.some(
    (root) => normalized === root || normalized.startsWith(`${root}/`)
  );
}

function isInsideProtectedRoot(relativePath) {
  const normalized = normalizeRepoRelativePath(relativePath);

  return PROTECTED_ROOTS.some(
    (root) => normalized === root || normalized.startsWith(`${root}/`)
  );
}

function isExcludedTestPath(relativePath) {
  const normalized = normalizeRepoRelativePath(relativePath).toLowerCase();
  const base = path.posix.basename(normalized);

  if (
    normalized.includes('/__tests__/') ||
    normalized.includes('/test/') ||
    normalized.includes('/tests/') ||
    normalized.includes('/spec/')
  ) {
    return true;
  }

  if (
    /\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(base) ||
    /(?:^|[-_.])self[-_.]?test\.(ts|tsx|js|jsx|mjs|cjs)$/.test(base)
  ) {
    return true;
  }

  return false;
}

function getExtension(relativePath) {
  return path.posix.extname(normalizeRepoRelativePath(relativePath)).toLowerCase();
}

function assertValidInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    failClosed('INPUT_OBJECT_REQUIRED');
  }

  if (typeof input.repoRoot !== 'string' || input.repoRoot.trim().length === 0) {
    failClosed('REPO_ROOT_REQUIRED');
  }

  if (
    typeof input.runtimeBaseHead !== 'string' ||
    !/^[0-9a-f]{40,64}$/i.test(input.runtimeBaseHead)
  ) {
    failClosed('EXACT_RUNTIME_BASE_HEAD_REQUIRED');
  }

  if (
    !Array.isArray(input.semanticPatterns) ||
    input.semanticPatterns.length === 0
  ) {
    failClosed('HOST_RECOGNIZED_SEMANTIC_PATTERNS_REQUIRED');
  }

  if (input.semanticPatterns.length > 32) {
    failClosed('SEMANTIC_PATTERN_BOUND_EXCEEDED');
  }

  for (const pattern of input.semanticPatterns) {
    if (typeof pattern !== 'string' || pattern.length === 0) {
      failClosed('NON_EMPTY_STRING_PATTERN_REQUIRED');
    }

    if (pattern.length > 512) {
      failClosed('SEMANTIC_PATTERN_LENGTH_BOUND_EXCEEDED');
    }
  }
}

function runGitReadOnly(repoRoot, args) {
  try {
    return execFileSync('git', args, {
      cwd: repoRoot,
      encoding: 'buffer',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const stderr =
      error && error.stderr ? Buffer.from(error.stderr).toString('utf8').trim() : '';

    failClosed(`READ_ONLY_GIT_QUERY_FAILED:${stderr || 'UNKNOWN'}`);
  }
}

function parseNullSeparated(buffer) {
  return Buffer.from(buffer)
    .toString('utf8')
    .split('\0')
    .filter((value) => value.length > 0)
    .map(normalizeRepoRelativePath);
}

function resolveSafeRegularFile(repoRootReal, relativePath) {
  if (!isInsideDiscoveryRoot(relativePath)) {
    return null;
  }

  if (isInsideProtectedRoot(relativePath)) {
    return null;
  }

  if (isExcludedTestPath(relativePath)) {
    return null;
  }

  if (!SUPPORTED_EXTENSIONS.includes(getExtension(relativePath))) {
    return null;
  }

  const absolutePath = path.resolve(repoRootReal, ...relativePath.split('/'));

  let stat;
  try {
    stat = fs.lstatSync(absolutePath);
  } catch {
    return null;
  }

  if (stat.isSymbolicLink()) {
    return null;
  }

  if (!stat.isFile()) {
    return null;
  }

  let realPath;
  try {
    realPath = fs.realpathSync.native(absolutePath);
  } catch {
    return null;
  }

  const relativeRealPath = path.relative(repoRootReal, realPath);

  if (
    relativeRealPath === '' ||
    relativeRealPath === '..' ||
    relativeRealPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeRealPath)
  ) {
    return null;
  }

  return {
    absolutePath,
    realPath,
    stat,
  };
}

function discoverCandidateSourceV2(input) {
  assertValidInput(input);

  const repoRoot = path.resolve(input.repoRoot);
  const repoRootReal = fs.realpathSync.native(repoRoot);

  const maxCandidates =
    Number.isInteger(input.maxCandidates) && input.maxCandidates > 0
      ? Math.min(input.maxCandidates, 128)
      : 64;

  const maxFileBytes =
    Number.isInteger(input.maxFileBytes) && input.maxFileBytes > 0
      ? Math.min(input.maxFileBytes, 1024 * 1024)
      : 512 * 1024;

  const tracked = parseNullSeparated(
    runGitReadOnly(repoRootReal, [
      'ls-files',
      '-z',
      '--',
      ...DISCOVERY_ROOTS,
    ])
  );

  const changedSinceRuntimeBaseHead = new Set(
    parseNullSeparated(
      runGitReadOnly(repoRootReal, [
        'diff',
        '--name-only',
        '-z',
        input.runtimeBaseHead,
        '--',
        ...DISCOVERY_ROOTS,
      ])
    )
  );

  const patterns = Array.from(new Set(input.semanticPatterns));
  const results = [];

  for (const relativePath of tracked) {
    if (results.length >= maxCandidates) {
      break;
    }

    if (changedSinceRuntimeBaseHead.has(relativePath)) {
      continue;
    }

    const safeFile = resolveSafeRegularFile(repoRootReal, relativePath);

    if (!safeFile) {
      continue;
    }

    if (safeFile.stat.size > maxFileBytes) {
      continue;
    }

    let sourceText;
    try {
      sourceText = fs.readFileSync(safeFile.realPath, 'utf8');
    } catch {
      continue;
    }

    const matchedPatterns = patterns.filter((pattern) =>
      sourceText.includes(pattern)
    );

    if (matchedPatterns.length === 0) {
      continue;
    }

    results.push(
      Object.freeze({
        candidateSourceInputVersion: 2,
        relativePath,
        extension: getExtension(relativePath),
        matchedPatterns: Object.freeze([...matchedPatterns]),
        trackedOnly: true,
        unchangedFromRuntimeBaseHeadOnly: true,
        regularFileOnly: true,
        discoveryResultAuthority: DISCOVERY_RESULT_AUTHORITY,
      })
    );
  }

  return Object.freeze({
    version: 2,
    discoveryOnly: true,
    discoveryRoots: DISCOVERY_ROOTS,
    supportedExtensions: SUPPORTED_EXTENSIONS,
    protectedRoots: PROTECTED_ROOTS,
    discoveryResultAuthority: DISCOVERY_RESULT_AUTHORITY,
    authorityBoundary: AUTHORITY_BOUNDARY,
    candidateCount: results.length,
    candidates: Object.freeze(results),
  });
}

module.exports = Object.freeze({
  DISCOVERY_ROOTS,
  SUPPORTED_EXTENSIONS,
  PROTECTED_ROOTS,
  DISCOVERY_RESULT_AUTHORITY,
  AUTHORITY_BOUNDARY,
  discoverCandidateSourceV2,
});