# NEXUS Phase 0 — Constitutional Evidence Admission Design v1

Status: DESIGN ONLY — NO RUNTIME AUTHORITY — NOT AN EXIT-GATE PASS
Branch: ai-workforce-constitution-v1
Controlling rule: untrusted semantic assertions never become constitutional truth

## 1. Purpose

Define the minimum trusted evidence boundary required before the AI Workforce Constitution may be connected to any persistence, mutation, execution, provider, payment, legal-filing, customer/vendor-contact, or public-launch boundary.

This contract does not authorize execution.

## 2. Proven repository fact

Current authenticated runtime can establish tenant identity, actor identity, session identity, membership role, owner authority, workspace identity, and sandbox operational boundaries.

Current repository inspection did not identify a trusted runtime authority that independently proves all constitutional semantic facts required for:
- jurisdiction/country state;
- legal/compliance state;
- constitutional verification state;
- constitutional provenance state;
- regulated-activity state;
- constitutional evidence-conflict state;
- permanent-prohibition findings.

Therefore raw caller-supplied values for those fields MUST NOT be accepted as trusted constitutional evidence.

## 3. Required trust separation

Three concepts MUST remain separate:

1. Authenticated identity evidence
   - who is acting;
   - which tenant/session/role applies.

2. Constitutional semantic evidence
   - whether the action is lawful, verified, provenance-verified, jurisdiction-approved, non-prohibited, and appropriately reviewed.

3. Execution authority
   - whether any actual mutation, provider call, payment, filing, external send, or public launch may occur.

ALLOW_CONSTITUTIONALLY is not execution authority.

## 4. Constitutional Evidence Admission Record

Any future runtime constitutional admission record MUST bind at minimum:

- schemaVersion
- constitutionVersion
- tenantId
- actorId
- requesterSource
- actionId or deterministic operation identity
- actionClass
- requestedCapability
- payloadDigest
- countryState
- authorityState
- verificationState
- provenanceState
- legalState
- regulatedActivityState
- riskLevel
- humanApprovalRequirement
- humanApprovalState
- evidenceState
- prohibitionFindings
- constitutionalOverrideAttempted
- sourceEvidenceDigests
- evidenceIssuerId
- evidenceIssuerTrustState
- evaluatedDecision
- evaluatorReasonCodes
- admissionDigest

## 5. Trusted-source rule

The admission boundary MUST reject evidence when any constitutional semantic state is supplied only by:
- request JSON;
- customer/vendor content;
- AI/model output;
- employee prompt;
- arbitrary tool output;
- UI state;
- unsigned client metadata;
- payloadDigest alone;
- owner approval wording alone.

A signature or HMAC proves integrity/source possession only. It does not prove that a legal, jurisdictional, verification, provenance, regulated-activity, risk, or prohibition claim is substantively true.

## 6. Evidence issuer requirements

A future constitutional evidence issuer MUST:
- have an explicit machine identity;
- have a narrowly scoped evidence-authority role;
- expose the source evidence used for every semantic conclusion;
- bind those sources by digest;
- distinguish VERIFIED, UNVERIFIED, UNKNOWN, and CONFLICTING;
- fail closed when a required source is missing, stale, ambiguous, or inconsistent;
- never infer legal approval merely from owner approval;
- never infer country approval from locale/timezone alone;
- never infer provenance from payloadDigest alone;
- never self-authorize execution.

The mechanism for establishing each issuer as trusted is NOT YET IMPLEMENTED and MUST be proven before runtime integration.

## 6A. Constitutional evidence issuer trust lifecycle contract

Before any issuer may appear as `ACTIVE` + `VERIFIED` in a runtime trusted-issuer registry, the trust-establishment process MUST satisfy all of the following:

- issuer identity MUST be explicit, unique, stable, and independently attributable to the component or service actually producing constitutional evidence;
- issuer trust MUST NOT be established from the issuer's own assertion, caller input, prompt text, model output, employee request, owner wording alone, unsigned configuration, or possession of an issuerId string;
- an independent owner-controlled trust decision MUST bind the exact issuerId, active keyId, permitted action classes, permitted capabilities, trust state, status, and evidence-authority purpose;
- issuer scopes MUST follow least privilege and MUST fail closed when absent, empty, malformed, broader than reviewed authority, or inconsistent with the verified trust decision;
- cryptographic verification material MUST be provisioned independently from ordinary request payloads and MUST NOT be accepted from the admission record being verified;
- verification secrets or private signing material MUST NOT be logged, embedded in evidence payloads, exposed to callers, committed to source control, or derived from untrusted request data;
- key activation MUST be explicit; an unknown, retired, revoked, disabled, expired, mismatched, or ambiguously active key MUST fail closed;
- key rotation MUST create a new independently reviewed key binding and MUST NOT silently widen issuer scope;
- issuer revocation or disablement MUST take effect fail-closed for all later admissions using that issuer or key;
- trust-state changes, scope changes, key activation, key rotation, revocation, and disablement MUST produce immutable audit evidence identifying what changed, why, when, and under whose authorized decision;
- source-evidence authority MUST remain separate from execution authority; an issuer capable of asserting verified evidence MUST NOT thereby gain provider, payment, legal-filing, external-delivery, mutation, or public-launch authority;
- every semantic conclusion emitted by an issuer MUST remain traceable to independently resolvable source-evidence digests with freshness, verification-state, and conflict-state evidence;
- issuer trust MUST NOT convert UNKNOWN, UNVERIFIED, stale, ambiguous, conflicting, missing, or legally uncertain source evidence into VERIFIED evidence;
- compromise suspicion, key-custody uncertainty, unexplained signature behavior, audit inconsistency, or inability to independently verify the current trust binding MUST immediately degrade the issuer to fail-closed behavior;
- restoration from a revoked, disabled, compromised, or uncertain state MUST require a fresh independent trust decision and new evidence; previous trust MUST NOT be assumed to revive automatically;
- runtime trust data MUST be loaded from an owner-controlled source whose integrity, freshness, provenance, rollback behavior, and failure mode are independently testable;
- inability to load or verify the trusted-issuer registry, source-evidence registry, or required verification material MUST fail closed and MUST NOT fall back to caller-provided values.

Required proof before runtime integration includes, at minimum:

1. issuer enrollment evidence;
2. independent trust-verification evidence;
3. least-privilege scope evidence;
4. key-provisioning and key-custody evidence;
5. key-rotation and revocation tests;
6. disabled/unknown/mismatched-key adversarial tests;
7. source-evidence lineage and conflict/freshness tests;
8. trust-registry unavailable/corrupt/stale fail-closed tests;
9. immutable audit evidence for trust lifecycle changes;
10. explicit proof that issuer trust grants no execution authority.

This section defines the trust lifecycle contract only. No issuer is currently proven trusted, and no runtime trusted-issuer infrastructure is authorized or proven by this document.
### 6A.1 Owner-reviewer trust-root snapshot integrity binding decision — LOCKED

For the Phase-0 owner-reviewer trust-root source seam, deterministic snapshot integrity MUST use the following exact contract before any implementation may claim digest verification:

- the digest algorithm is SHA-256 and the serialized digest representation is exactly 64 lowercase hexadecimal characters;
- the digest input is a domain-separated deterministic canonical payload beginning with `NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_SNAPSHOT_V1`;
- `integrityDigest` itself MUST be excluded from the canonical payload to prevent self-reference;
- the canonical payload MUST bind, without silently weakening or omitting fields: `sourceVersion`, `sourceId`, `snapshotId`, `sequence`, `provenanceSourceId`, `integrityState`, `verifiedAt`, `expiresAt`, and the complete validated reviewer-anchor set;
- every canonical reviewer anchor MUST bind its complete contract fields: `schemaVersion`, `anchorId`, `reviewerId`, `keyId`, `algorithm`, `publicKeyPem`, `state`, `provenanceSourceId`, `integrityState`, `provisionDecisionId`, `provisionedBy`, `activatedAt`, `verifiedAt`, `expiresAt`, and `rotationOfKeyId` with absence represented deterministically;
- anchor array order supplied by an untrusted source MUST NOT alter the digest for the same logical anchor set; after structural validation, anchors MUST be canonicalized in deterministic ascending order by `anchorId`, then `keyId`, then `reviewerId`; duplicate or ambiguous anchor/key identities remain fail-closed;
- canonicalization MUST bind exact validated string values rather than silently trimming, case-folding, rewriting PEM material, or otherwise changing semantic input;
- recomputing a SHA-256 digest from the same untrusted snapshot proves only deterministic content binding. It MUST NOT by itself establish trusted integrity, provenance, ownership, freshness, rollback protection, reviewer-key trust, issuer trust, or execution authority;
- a future `integrityVerified=true` decision requires the recomputed digest to match an independently obtained bootstrap-bound expected digest or equivalent independently authenticated integrity reference. The snapshot's own `integrityDigest` claim MUST NOT be its own trust root;
- freshness MUST be evaluated independently against a trusted runtime time source and the exact `verifiedAt` / `expiresAt` validity window; caller-provided time MUST NOT create freshness proof;
- rollback protection MUST compare `sequence` against an independently retained monotonic trust-root checkpoint or equivalent owner-controlled rollback evidence. A snapshot cannot prove its own non-rollback state merely by carrying a sequence number;
- integrity match, freshness success, and rollback success remain separate gates. Failure or uncertainty in any gate MUST fail closed;
- none of these gates grants mutation, provider, payment, legal-filing, external-delivery, public-launch, or other execution authority.

This decision defines deterministic integrity semantics only. It does not prove that an owner-controlled bootstrap integrity reference, trusted time source, or monotonic rollback checkpoint currently exists.

### 6A.2 Integrity-reference provenance root decision — LOCKED

The independent expected-digest reference introduced for the owner-reviewer trust-root snapshot MUST have provenance authenticated through a separate bootstrap-bound verification root. The following rules are mandatory before any implementation may set `referenceProvenanceVerified=true`:

- existing HMAC owner-authorization/signature utilities MUST NOT be reused as the provenance trust root because their shared secrets are supplied through ordinary function or constructor inputs and their independent bootstrap provenance is not established;
- caller-supplied secrets, request payloads, prompts, model output, employee input, unsigned configuration, environment-variable names alone, database records, provider responses, and the integrity reference itself MUST NOT provision or replace the provenance verification root;
- provenance verification MUST use asymmetric verification so runtime verification requires public verification material only; private signing material MUST remain outside the verifier and MUST NOT be committed, logged, returned, embedded in payloads, or accepted from the action/request path;
- the Phase-0 provenance-proof algorithm is Ed25519; a future provenance envelope MUST bind the complete integrity-reference contract, including `referenceVersion`, `referenceId`, `trustRootSourceId`, `snapshotId`, `sequence`, `expectedDigest`, `provenanceSourceId`, `referenceState`, and `establishedAt`, under a domain-separated deterministic canonical payload;
- the provenance envelope MUST additionally bind an explicit provenance-authority identity and key identity so an otherwise valid signature from the wrong authority or key fails closed;
- the Ed25519 public verification key MUST be loaded from a bootstrap-bound provenance-root source that ordinary callers cannot supply or override; merely placing a public key in a candidate object or unsigned runtime configuration MUST NOT establish provenance trust;
- provenance-root source integrity, authenticity, lifecycle state, key activation, rotation, revocation, ambiguity handling, and failure behavior MUST be independently testable before runtime trust may be claimed;
- a cryptographically valid Ed25519 signature proves possession of the corresponding private key only. `referenceProvenanceVerified=true` requires both valid signature binding and independently trusted provenance-root verification material;
- failure to load the provenance root, unknown or mismatched authority/key identity, invalid signature, revoked/disabled/expired key, ambiguous active key, malformed canonical payload, or uncertain key provenance MUST fail closed;
- provenance verification remains separate from snapshot digest equality, freshness, rollback protection, reviewer-key trust, issuer trust, and execution authority;
- no provenance success may itself authorize mutation, provider execution, payment, legal filing, external delivery, or public launch.

This decision defines the provenance-authentication architecture only. It does not prove that a real owner-controlled Ed25519 provenance authority, private-key custody process, bootstrap public-key source, rotation/revocation mechanism, or deployment provisioning path currently exists.

### 6A.3 Integrity-reference provenance canonical payload and signed-envelope decision — LOCKED

The Phase-0 integrity-reference provenance proof MUST use the following exact deterministic payload and envelope contract:

- the canonical signing domain is exactly `NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_V1`;
- canonical payload construction MUST first require a structurally valid integrity-reference candidate; malformed or inaccessible candidates MUST fail closed before a signing payload is produced;
- the canonical JSON body MUST bind fields in this exact order: `provenanceAuthorityId`, `provenanceKeyId`, `signatureAlgorithm`, `referenceVersion`, `referenceId`, `trustRootSourceId`, `snapshotId`, `sequence`, `expectedDigest`, `provenanceSourceId`, `referenceState`, `establishedAt`;
- `signatureAlgorithm` in the canonical body MUST be exactly `Ed25519`;
- canonicalization MUST preserve the exact already-validated integrity-reference strings and MUST NOT trim, case-fold, rewrite, normalize, or silently substitute semantic values;
- the final signing payload is exactly `<domain> + newline + JSON.stringify(canonicalBody)` using the locked field order above;
- the provenance signed-envelope schema version is exactly `NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE_ENVELOPE_V1`;
- a provenance envelope candidate MUST contain exactly the semantic bindings `schemaVersion`, `referenceId`, `provenanceAuthorityId`, `provenanceKeyId`, `signatureAlgorithm`, and `signatureBase64Url`;
- `signatureAlgorithm` MUST be `Ed25519`; `signatureBase64Url` MUST decode as exactly 64 signature bytes; malformed encoding or wrong length MUST fail closed;
- envelope `referenceId`, `provenanceAuthorityId`, and `provenanceKeyId` MUST later match the exact canonical payload/reference and provenance-root identity used for verification; a valid signature under the wrong authority/key MUST fail closed;
- the signature bytes themselves MUST NOT be included inside the canonical payload;
- private signing material MUST NOT be accepted by the runtime verifier, canonical-payload constructor, envelope validator, request path, prompt, model, admission payload, or ordinary caller;
- structural envelope validity proves only that the candidate has the required shape and metadata. It MUST NOT set `signatureVerified`, `provenanceRootTrusted`, `referenceProvenanceVerified`, `integrityVerified`, `reviewerKeyTrusted`, `runtimeTrustEstablished`, or any execution-authority flag to true;
- a future cryptographic signature success proves only Ed25519 possession/binding until the provenance-root verification material is independently established as trusted according to Section 6A.2;
- no canonical-payload or envelope success grants mutation, provider, payment, legal-filing, external-delivery, public-launch, issuer-trust, or constitutional execution authority.

This decision fixes serialization and envelope semantics only. It does not generate a private key, sign an integrity reference, provision a provenance authority, trust a provenance root, or authorize runtime integration.

### 6A.4 Bootstrap verification-root release provenance boundary — LOCKED

The repository audit found no existing independently authenticated release/build provenance mechanism suitable for elevating the integrity-reference provenance root to trusted status. The following boundary is therefore mandatory:

- existing final-release-freeze and final-market-decision logic MAY remain engineering/readiness evidence but MUST NOT be treated as cryptographic provenance-root authentication;
- an expected Git commit, ancestry check, `origin/main` equality, clean working tree, successful tests, lint, typecheck, or production build proves repository/build consistency only within the observed Git/tooling context; none of these facts alone authenticates who authorized or produced that source/build;
- package-lock dependency integrity digests authenticate fetched package bytes against registry metadata and MUST NOT be interpreted as NEXUS application, release, owner, or provenance-root authenticity;
- no existing tracked CI/workflow attestation, Sigstore, Cosign, SLSA provenance, signed release artifact, signed build artifact, verified Git commit/tag signature, or configured Git signing identity was proven by the Phase-0 audit;
- therefore a public Ed25519 provenance-authority key embedded in source code, bundled into a build, loaded from an environment variable, read from an unsigned file, or supplied through deployment configuration MUST remain a verification-material candidate only; its presence MUST NOT set `provenanceRootTrusted=true`;
- a Git commit hash, source-file hash, build hash, manifest hash, or public-key fingerprint MAY bind bytes but MUST NOT bootstrap its own authenticity. Self-referential digest checks MUST NOT create trust;
- `provenanceRootTrusted=true` MUST remain impossible until runtime is presented with independently authenticated bootstrap evidence whose trust ultimately originates outside the ordinary request, model, application database, provider response, unsigned runtime configuration, and the candidate application artifact itself;
- the future bootstrap evidence mechanism MUST explicitly bind the provenance authority identity, provenance key identity, Ed25519 public verification material or its exact cryptographic fingerprint, intended NEXUS constitutional trust-root purpose, lifecycle state, and the release/deployment identity in which that root is authorized;
- the future bootstrap verifier MUST fail closed for missing evidence, unknown authority/key, release or deployment mismatch, malformed evidence, revoked/disabled key, ambiguous active root, rollback, or inability to authenticate the evidence chain;
- until such independent bootstrap evidence is implemented and externally provisioned, all Phase-0 provenance-root source, root validator, integrity-reference provenance envelope, and Ed25519 possession-verification successes MUST keep `provenanceRootTrusted=false`, `referenceProvenanceVerified=false`, `integrityVerified=false`, `reviewerKeyTrusted=false`, `runtimeTrustEstablished=false`, and every execution-authority flag false;
- no local Phase-0 test fixture, generated key pair, environment variable, repository constant, Git state, or unsigned deployment metadata may satisfy this missing bootstrap requirement.

This decision deliberately terminates the current implementation path at a fail-closed trust boundary rather than manufacturing a circular root of trust. It defines what additional independently authenticated deployment/release evidence is required before provenance-root trust may ever be elevated; it does not create that trust or authorize production integration.

### 6A.5 External bootstrap evidence unblock gate — LOCKED / BLOCKED

Phase-0 provenance-root trust is intentionally BLOCKED at this boundary. No further implementation may set `provenanceRootTrusted=true` until independently authenticated external bootstrap evidence exists and is reviewable. The minimum unblock evidence is:

1. **Owner-controlled provenance authority identity** — a stable authority identifier approved through an owner-controlled process outside the ordinary NEXUS request/model/runtime path.
2. **Externally generated Ed25519 provenance key pair** — private signing material generated and retained outside the NEXUS application runtime, repository, logs, database, prompts, model context, test fixtures, and deployment configuration.
3. **Public verification material evidence** — the exact Ed25519 public key or cryptographic fingerprint bound to the approved provenance authority and key identity.
4. **Independent bootstrap authentication evidence** — evidence showing how the runtime/deployment operator authenticated that public verification material without trusting the candidate application artifact, unsigned environment values, application database, provider response, or request payload itself.
5. **Purpose binding** — explicit authorization that the key is for `NEXUS_CONSTITUTIONAL_OWNER_REVIEWER_TRUST_ROOT_INTEGRITY_REFERENCE_PROVENANCE` and not for a generic or unrelated signing purpose.
6. **Release/deployment binding** — an independently authenticated identity for the NEXUS release/deployment in which that provenance root is authorized, with mismatch required to fail closed.
7. **Lifecycle evidence** — independently reviewable activation state plus revocation, disablement, retirement, rotation, and ambiguous-active-key handling rules.
8. **Rollback evidence** — an independently maintained monotonic or equivalent anti-rollback checkpoint so an older previously valid provenance root cannot silently replace a newer authorized root.
9. **Trusted-time evidence where lifecycle decisions require time** — runtime time used for activation/expiry decisions must originate from a separately trusted mechanism; candidate-supplied timestamps or caller-supplied `now` values cannot establish freshness.
10. **Custody and recovery evidence** — owner-approved private-key custody, backup/recovery, compromise response, and replacement procedure must exist before real signing is relied upon.

Until every required item above has both implementation evidence and required real-world/operator evidence, the following values remain hard-blocked:

- `provenanceRootTrusted=false`;
- `referenceProvenanceVerified=false`;
- `integrityVerified=false`;
- `freshnessVerified=false`;
- `rollbackProtectionVerified=false`;
- `reviewerKeyTrusted=false`;
- `runtimeTrustEstablished=false`;
- `issuerTrustEstablished=false`;
- `admissionProjectionAuthorized=false`;
- all mutation, provider, payment, legal-filing, external-delivery, public-launch, and constitutional execution authority remains false.

Automated unit tests using generated key pairs may verify cryptographic mechanics but MUST NOT satisfy this unblock gate. Repository hashes, Git state, build success, environment variables, unsigned files, local operator assertions, and application-produced evidence MUST NOT be promoted into independent bootstrap authentication evidence.

**Exit gate:** Section 6A provenance-root trust work remains `BLOCKED_EXTERNAL_BOOTSTRAP_EVIDENCE_REQUIRED` until the external evidence above is supplied, independently reviewed, and then connected through a separately designed fail-closed verifier. This blocker does not authorize creating, storing, exporting, or provisioning any real private key during Phase-0 implementation work.

## 6B. Constitutional source-evidence trust lifecycle contract

Before any source-evidence record may satisfy a constitutional semantic claim at runtime, the source-evidence lifecycle MUST satisfy all of the following:

- every evidence item MUST have an independently resolvable identity and digest that binds the exact evidence content used for the constitutional conclusion;
- source evidence MUST have explicit provenance identifying where it came from and how that provenance was verified;
- evidence verification state MUST distinguish at least VERIFIED and UNVERIFIED, and absence of verification MUST fail closed;
- evidence conflict state MUST distinguish CLEAR and CONFLICTING, and any unresolved or ambiguous conflict MUST fail closed;
- freshness MUST be explicit and machine-verifiable using verifiedAt and expiresAt or an equivalent bounded validity contract;
- stale, expired, missing, unverifiable, ambiguously resolved, duplicated-with-conflict, or provenance-uncertain evidence MUST NOT satisfy a constitutional semantic claim;
- the same digest MUST NOT resolve to multiple materially conflicting trusted records; any such condition MUST fail closed;
- evidence corrections, supersession, withdrawal, revocation, or invalidation MUST produce a new immutable audit event and MUST NOT silently rewrite historical evidence;
- a later correction or revocation MUST prevent future admissions from treating superseded or invalidated evidence as currently VERIFIED;
- source-evidence registry integrity, freshness, provenance, and availability MUST be independently verifiable and MUST NOT be established from caller-provided registry contents;
- caller payloads, model output, prompts, employee assertions, unsigned metadata, owner wording alone, and payloadDigest alone MUST NOT create trusted source evidence;
- issuer trust MUST NOT upgrade UNKNOWN, UNVERIFIED, stale, conflicting, ambiguous, missing, revoked, or legally uncertain evidence into VERIFIED evidence;
- evidence lineage MUST permit reconstruction from semantic conclusion -> sourceEvidenceDigest -> source-evidence record -> verified provenance;
- inability to resolve every required sourceEvidenceDigest exactly once to current VERIFIED + CLEAR + fresh evidence MUST fail closed;
- registry unavailability, corruption, stale registry state, partial load, inconsistent replication, or inability to prove registry freshness MUST fail closed;
- source-evidence authority remains separate from execution authority and grants no mutation, provider, payment, legal-filing, external-delivery, or public-launch authority.

Required proof before runtime integration includes, at minimum:

1. deterministic digest-binding tests;
2. exact-one-resolution tests for every required sourceEvidenceDigest;
3. VERIFIED versus UNVERIFIED adversarial tests;
4. CLEAR versus CONFLICTING adversarial tests;
5. freshness, expiry, and stale-evidence tests;
6. duplicate/conflicting-record fail-closed tests;
7. provenance-verification and provenance-mismatch tests;
8. correction, supersession, revocation, and invalidation tests;
9. registry unavailable/corrupt/stale/partial-load fail-closed tests;
10. lineage reconstruction evidence;
11. immutable audit evidence for evidence lifecycle changes;
12. explicit proof that trusted source evidence grants no execution authority.

This section defines the source-evidence trust lifecycle contract only. No runtime source-evidence registry is currently proven trusted, and no source-evidence infrastructure is authorized or proven by this document.
### 6B.1 Source-evidence artifact and semantic-claim binding separation — LOCKED

Repository audit found no generic constitutional evidence envelope that simultaneously provides versioned content typing, deterministic content digest binding, semantic-claim binding, provenance/lifecycle state, and fail-closed reconstruction. Therefore Section 6B MUST use two separate contracts rather than allowing raw evidence objects to directly assert constitutional truth.

#### A. Source-evidence artifact contract

A future constitutional source-evidence artifact MUST bind at minimum:

- `schemaVersion`;
- `evidenceId`;
- `evidenceType`;
- `contentSchemaVersion`;
- `contentDigest`;
- `provenanceSourceId`;
- `observedAt` or equivalent source observation time where applicable;
- `createdAt`;

The artifact digest/content binding MUST satisfy all of the following:

- `contentDigest` MUST bind the exact evidence content bytes or an exact separately locked deterministic canonical representation;
- the canonicalization algorithm and byte encoding MUST be design-locked before implementation; ordinary `JSON.stringify` over arbitrary/untrusted object property order MUST NOT be assumed sufficient merely because domain-specific repository modules use it internally;
- `evidenceId`, `evidenceType`, `contentSchemaVersion`, and provenance identity MUST NOT be silently normalized into materially different semantics during digest construction;
- structural validity or digest equality proves content binding only and MUST NOT by itself establish provenance verification, legal truth, jurisdiction approval, constitutional verification, freshness, conflict clearance, issuer trust, or execution authority;
- source evidence MAY use type-specific content schemas. Section 6B does not require one giant universal payload containing every constitutional evaluator field;
- caller/model/prompt/employee/customer/vendor/unsigned metadata MUST NOT create a trusted source-evidence artifact merely by supplying a matching digest.

#### B. Semantic-claim binding contract

A separate future semantic-claim binding MUST connect one constitutional conclusion to the exact source-evidence artifacts relied upon for that conclusion. It MUST bind at minimum:

- `claimSchemaVersion`;
- `claimId`;
- `constitutionVersion`;
- `claimType`;
- `claimValue`;
- `sourceEvidenceDigests`;
- `evidenceIssuerId`;
- `issuedAt`;
- `expiresAt` where the claim is time-bounded;

The semantic-claim boundary MUST satisfy all of the following:

- `claimType` identifies the exact constitutional semantic dimension being asserted; generic free-text conclusions MUST NOT silently become evaluator state;
- `claimValue` MUST be validated against the locked allowed values for that claim type before it can be projected into constitutional evaluation input;
- every required `sourceEvidenceDigest` MUST resolve exactly once through the Section 6B source-evidence lifecycle and MUST be current VERIFIED + CLEAR + fresh with verified provenance before that evidence may support a semantic claim;
- one source-evidence artifact MAY support multiple claims only when each claim explicitly names that digest and the issuer is authorized for each claim type;
- a claim MUST NOT inherit trust merely because another claim uses the same evidence digest;
- missing, stale, revoked, superseded, invalidated, ambiguous, conflicting, provenance-uncertain, or unresolvable source evidence MUST make the affected semantic claim fail closed;
- claim binding MUST preserve reconstruction: semantic conclusion -> claim binding -> sourceEvidenceDigest(s) -> exact source-evidence artifact -> verified provenance/lifecycle evidence;
- issuer trust and source-evidence trust remain separate gates. A trusted issuer cannot upgrade untrusted evidence, and trusted evidence cannot grant an issuer authority it does not possess;
- claim success MUST NOT itself grant mutation, provider, payment, legal-filing, external-delivery, public-launch, or other execution authority.

#### C. Constitutional projection boundary

The evaluator-facing fields such as `countryState`, `authorityState`, `verificationState`, `provenanceState`, `legalState`, `regulatedActivityState`, `riskLevel`, `humanApprovalRequirement`, `humanApprovalState`, `evidenceState`, and `prohibitionFindings` MUST NOT be populated from raw caller assertions merely because those field names exist in an admission record. A future projection layer must derive each externally sourced semantic value only from validated semantic-claim bindings whose evidence chain satisfies Sections 6A and 6B.

Local/runtime facts that are independently established by another already-proven authority boundary MAY use their own narrowly scoped trusted mechanism, but they MUST NOT be mislabeled as Section 6B source-evidence proof without satisfying this contract.

This design step defines separation and minimum bindings only. It does NOT yet lock the exact evidence-content canonical byte representation, claim-type registry, issuer scopes for each claim type, provenance authentication mechanism, trusted registry implementation, persistence mechanism, or execution integration. All such trust remains unproven and fail-closed.

### 6B.2 Canonical source-evidence content byte representation — LOCKED

Repository audit established that the strongest reusable safety pattern is a strict JSON-subset boundary: plain objects only, deterministic key ordering, finite numbers only, rejection of unsupported JavaScript values, rejection of circular references, prototype-pollution key blocking, and bounded depth/node/serialized-size limits. Section 6B adopts those safety properties as design requirements but does NOT directly reuse any DB-coupled, HMAC-coupled, sandbox-execution, provider, or production persistence implementation.

#### A. Allowed canonical content domain

A constitutional source-evidence content value MUST be a plain JSON object whose prototype is exactly `Object.prototype` or `null`. Its recursively reachable values MAY contain only:

- `null`;
- strings;
- booleans;
- finite JSON numbers;
- arrays of allowed values;
- plain JSON objects of allowed values.

The following MUST fail closed before canonicalization:

- `undefined`;
- functions;
- symbols;
- `bigint`;
- `NaN`, positive infinity, or negative infinity;
- negative zero (`-0`), because ordinary JSON number serialization collapses it to `0`;
- `Date`, `Buffer`, typed arrays, Map, Set, RegExp, Error, class instances, or any other non-plain object;
- circular or repeated-active-path references that form a cycle;
- object keys `__proto__`, `prototype`, or `constructor`;
- values exceeding the separately enforced maximum traversal depth, node count, or canonical byte length.

Strings and object keys MUST be preserved exactly as supplied after structural validation. No trimming, case folding, Unicode normalization, locale transformation, or semantic coercion is permitted by the canonicalizer. Type-specific evidence schemas MAY impose their own additional validation before this canonicalization boundary.

#### B. Deterministic canonical text

Canonical text MUST be produced recursively using these exact rules:

1. `null` -> ASCII text `null`.
2. Boolean `true` or `false` -> ASCII text `true` or `false`.
3. Finite non-negative-zero JSON number -> ECMAScript `JSON.stringify(number)` result; if serialization does not return a string, fail closed.
4. String -> ECMAScript `JSON.stringify(string)` result with no pre-normalization.
5. Array -> `[` + each element canonicalized in original array order and joined with `,` + `]`. Array order is semantic and MUST NOT be sorted.
6. Plain object -> enumerate own enumerable string keys only; reject blocked keys; sort keys by deterministic ascending JavaScript string ordering using a comparison that does not depend on locale; output `{` + each `JSON.stringify(key)` + `:` + canonicalized value, joined with `,` + `}`.
7. Encountering any value outside the allowed domain MUST fail closed rather than omit, coerce, stringify generically, or substitute `null`.

Canonicalization MUST NOT invoke getters intentionally as a trust mechanism. Future implementation MUST defensively validate property descriptors or otherwise ensure hostile accessors cannot create time-of-check/time-of-use drift, side effects, or different canonical bytes across repeated reads. This hostile-accessor handling remains an implementation gate and MUST be adversarially tested before PASS.

#### C. Canonical bytes and content digest

The canonical text MUST be encoded as UTF-8 bytes with no BOM and no trailing newline. `contentDigest` MUST be lowercase 64-hex SHA-256 over the following domain-separated byte sequence:

`NEXUS_CONSTITUTIONAL_SOURCE_EVIDENCE_CONTENT_V1` + single LF byte (`0x0A`) + UTF-8 canonical-content bytes.

The domain separator is part of the digest input and MUST be exact. No CRLF substitution, surrounding whitespace, pretty printing, locale-dependent encoding, platform-default encoding, or alternate newline convention is permitted.

Digest equality proves only that the same locked canonical content bytes were presented under this domain. It does NOT prove provenance, issuer authority, legal truth, jurisdictional validity, freshness, conflict clearance, lifecycle validity, reviewer trust, runtime trust, or execution authority.

#### D. Resource and ambiguity limits

Before a source-evidence content artifact can be accepted, a future implementation MUST apply explicit finite limits for maximum traversal depth, maximum visited-node count, maximum object-key count where needed, maximum array length where needed, and maximum canonical UTF-8 byte length. Exact numeric limits are NOT locked by this design step and must be selected and tested before implementation is admitted.

Duplicate JSON object names created by parsing external textual JSON MUST be rejected or otherwise prevented before this canonicalizer receives the object; a parser that silently overwrites an earlier duplicate key MUST NOT be treated as proof that the original source text was unambiguous.
External textual JSON therefore MUST pass through a duplicate-member-name-aware parsing boundary before ordinary JavaScript object materialization. Plain `JSON.parse` alone MUST NOT satisfy this requirement because duplicate object member names may be silently collapsed using last-value-wins semantics. The future implementation MUST reject a duplicate member name at every object nesting level before canonicalization, regardless of whether the duplicate values are identical, different, security-sensitive, or later ignored by a schema. Duplicate-member rejection establishes only textual structural unambiguity and grants no provenance, issuer trust, reviewer trust, runtime trust, admission authority, or execution authority.
#### External textual JSON raw-byte ingestion boundary

Any future HTTP, Fetch `Request`, worker, adapter, file, message, or equivalent external textual-JSON ingress that feeds constitutional source-evidence parsing MUST preserve and validate the original request bytes before text parsing or semantic admission.

- The ingress MUST read the body as raw bytes before decoding. On a Fetch `Request` boundary, `request.arrayBuffer()` is the established NEXUS precedent; an equivalent runtime primitive MAY be used only if it preserves the exact received bytes.
- Maximum ingress-body size MUST be enforced against the actual raw-byte length, such as `bodyBytes.byteLength`, before UTF-8 decoding. JavaScript string length or re-encoded text length MUST NOT substitute for original received-byte length.
- When a valid declared `Content-Length` is available and applicable, it MUST match the actual received raw-byte length exactly; mismatch MUST fail closed before parsing. The established NEXUS precedent is `REQUEST_BODY_LENGTH_MISMATCH`.
- Text decoding MUST use strict UTF-8 semantics that reject malformed byte sequences rather than replacing them. On the established Node/Fetch boundary this is `new TextDecoder("utf-8", { fatal: true })`; an equivalent decoder MAY be used only if malformed UTF-8 is rejected fail-closed.
- A body-read failure, malformed UTF-8 sequence, raw-byte limit violation, declared/actual length mismatch, unsupported transfer/content encoding, or other ambiguity that prevents proof of the exact original textual bytes MUST fail closed before `JSON.parse`, canonicalization, provenance verification, issuer trust, reviewer trust, runtime trust, admission, or execution authority.
- Successful raw-byte reading and strict UTF-8 decoding prove only that an unambiguous UTF-8 text representation was obtained within the ingress envelope. They establish no provenance, authenticity, truth, freshness, issuer authority, reviewer trust, runtime trust, admission authority, or execution authority.

This step locks canonical semantics only. It does NOT yet create the source-evidence artifact implementation, parser, type-specific content schemas, semantic-claim registry, lifecycle persistence, provenance authentication, trusted time, rollback protection, issuer authorization, or constitutional projection. All trust and execution authority remain fail-closed.

### 6B.3 Hostile accessor and property-descriptor boundary — LOCKED

Phase-0 validators already prove a fail-closed precedent for throwing untrusted getters by converting candidate-access exceptions into rejected no-trust results. That precedent is necessary but insufficient for canonical source-evidence content because a non-throwing accessor could still execute side effects, return different values on repeated reads, mutate sibling properties, or create time-of-check/time-of-use drift. Constitutional canonicalization therefore MUST reject accessors before reading content values.

#### A. Descriptor-only property discovery

For every plain object traversed by the constitutional source-evidence canonicalizer:

- own property metadata MUST be obtained through descriptor APIs such as `Object.getOwnPropertyDescriptors` or equivalent non-value-reading descriptor inspection;
- the canonicalizer MUST NOT discover a property and then read it through `value[key]`, `Reflect.get`, spread syntax, `Object.assign`, destructuring, generic cloning, or any other operation that can invoke an accessor;
- every own enumerable string property included in canonical content MUST have a data descriptor containing a `value`;
- any own enumerable accessor descriptor containing a getter or setter MUST fail closed before that accessor can execute;
- non-enumerable application-defined properties MUST NOT silently become canonical content; type-specific schemas MUST NOT rely on hidden non-enumerable state as evidence semantics;
- any own symbol property MUST fail closed rather than be silently ignored, because the locked canonical representation has no symbol-key encoding;
- blocked string keys `__proto__`, `prototype`, and `constructor` remain prohibited even when they are ordinary own data properties.

#### B. Descriptor snapshot value rule

After descriptor validation, recursive canonicalization MUST consume the captured data-descriptor `value` rather than re-reading the original object property. This ensures each property value is taken from one validated descriptor snapshot and prevents a later getter/property replacement from changing the bytes during the same traversal.

The implementation MUST still enforce cycle detection on object identities reached through captured descriptor values. Reusing the same non-cyclic object in separate branches MAY be permitted only if active-path cycle detection proves there is no recursive cycle; a globally repeated object reference MUST NOT automatically be treated as a cycle merely because it appeared in an already-completed branch.

#### C. Array safety

Arrays remain semantically ordered. Before canonicalizing an array, the implementation MUST ensure indexed elements cannot invoke hostile accessors. Numeric element descriptors that participate in the array value MUST be ordinary data descriptors. Accessor-backed array indexes MUST fail closed before invocation. Sparse-array semantics MUST be explicitly resolved by implementation tests; the implementation MUST NOT silently convert a hole into `null`, `undefined`, or another value unless that behavior is separately design-locked.

Inherited properties are never canonical content. Mutation of the input object during traversal MUST NOT be relied upon for correctness. The canonicalizer MUST produce bytes only from the validated descriptor snapshot or fail closed when it cannot establish an unambiguous snapshot.

#### D. Failure semantics and remaining gate

Any descriptor-inspection failure, proxy trap failure, hostile accessor presence, symbol-key presence, blocked-key presence, ambiguous sparse-array behavior, or inconsistent property snapshot MUST produce structural rejection with all provenance, issuer, lifecycle, reviewer, runtime, admission, and execution trust remaining false.

This design step does NOT yet lock numeric traversal/resource limits and does NOT implement the canonicalizer. Exact maximum depth, node count, key/array bounds, and canonical UTF-8 byte length remain a separate gate. No DB, provider, HMAC, private-key, trusted-time, rollback, mutation, public-launch, or execution authority is introduced.

### 6B.4 Canonical source-evidence resource limits — LOCKED

Repository audit found repeated independent JSON-boundary precedent for maximum traversal depth 24, maximum total traversed nodes 5000, and maximum canonical representation size 65536. No defensible generic constitutional precedent was found for a smaller independent per-object property limit or per-array item limit; observed values such as 20, 100, and 1000 are domain-specific list, handler, registry, or evidence-retention limits and MUST NOT be silently generalized into constitutional source-evidence semantics.

#### A. V1 global hard limits

The V1 constitutional source-evidence canonicalizer MUST enforce:

- maximum traversal depth: `24`;
- maximum total canonical-value node count: `5000`;
- maximum canonical UTF-8 content byte length: `65536` bytes;
- maximum own entries inspected for any single container before recursive canonicalization: `5000`, derived from the global node ceiling as a preflight denial-of-service bound rather than as a semantic content limit.

Depth counting MUST start at `0` for the root content object. A child value is depth `parent + 1`; any value whose depth would exceed `24` MUST fail closed.

Node counting MUST include the root and every recursively canonicalized JSON value, including primitive values, arrays, and objects. Object property names are not separate nodes, but their encoded bytes contribute to the canonical UTF-8 byte limit. Any attempt to traverse node `5001` MUST fail closed.

The `65536` limit applies to UTF-8 bytes of the canonical content text itself, measured with an explicit UTF-8 byte-count operation such as `Buffer.byteLength(canonicalText, "utf8")`; JavaScript UTF-16 character count MUST NOT be substituted for this constitutional byte limit. The separately locked domain separator and LF used for `contentDigest` are digest framing and are not counted as evidence-content bytes.

#### B. Container preflight and dense arrays

Before recursively reading captured descriptor values, a container with more than `5000` own entries relevant to structural inspection MUST fail closed. This preflight exists to prevent an obviously impossible container from consuming unbounded traversal work before the global node limit can reject it. It does NOT mean a 5000-element container will necessarily pass; the total node ceiling still applies and normally makes such a container exceed the V1 budget once the root/container node is counted.

Arrays MUST be dense from index `0` through `length - 1`. A missing indexed own data descriptor is a sparse-array hole and MUST fail closed. Accessor-backed indexes remain prohibited under Section 6B.3. Array `length` MUST be a valid ordinary array length, and an array whose length exceeds `5000` MUST fail preflight. Own symbol properties MUST fail closed. Own enumerable non-index string properties on an array MUST fail closed rather than be silently omitted from canonical meaning.

For plain objects, every enumerable own string property contributes one recursively visited value toward the global node limit. Symbol properties remain prohibited. Blocked keys remain prohibited. No independent smaller semantic key-count limit is introduced in V1 because repository evidence does not justify one.

#### C. Failure and trust semantics

Exceeding depth, node, container-entry, array-length, or canonical UTF-8 byte limits MUST produce structural rejection. Resource-limit success proves only that content fits the bounded canonicalization envelope; it establishes no provenance, authenticity, legal truth, freshness, conflict clearance, issuer authority, reviewer trust, runtime trust, admission authority, or execution authority.

These numeric limits are V1 constitutional canonicalization limits and may change only through an explicit versioned design change with migration and compatibility analysis. This step still does NOT implement the canonicalizer, source-evidence artifact, semantic-claim projection, provenance registry, trusted time, rollback protection, DB persistence, provider access, payment, legal filing, public launch, or external execution.

### 6B.5 Source-evidence digest identity and registry binding — LOCKED

Repository audit found that the current Phase-0 admission seam resolves each `sourceEvidenceDigest` by comparing it with a generic `ConstitutionalSourceEvidenceTrustRecord.digest`, but that legacy `digest` field is not currently recomputed from or structurally bound to exact evidence content. Section 6B.2 separately defines `contentDigest` as the domain-separated SHA-256 of the exact canonical source-evidence content. V1 therefore removes this semantic ambiguity by defining one source-content digest identity rather than inventing an unnecessary second whole-artifact digest.

#### A. Exact digest identity

For V1 constitutional source evidence:

- `sourceEvidenceDigest` and `contentDigest` are the SAME cryptographic value and MUST have identical semantics;
- every entry in a semantic claim's `sourceEvidenceDigests` array MUST be the exact lowercase `contentDigest` of the referenced source-evidence artifact;
- the digest MUST be exactly 64 lowercase hexadecimal characters produced by the Section 6B.2 domain-separated canonical-content SHA-256 construction;
- uppercase hexadecimal, whitespace-trimmed alternatives, case-folded values, or any other normalized representation MUST NOT be treated as a second acceptable canonical digest form;
- V1 does NOT define or require a separate `artifactDigest`, `envelopeDigest`, or registry-record digest for source-evidence resolution. If such a digest is introduced later, it requires an explicit versioned design change and MUST NOT silently replace `sourceEvidenceDigest`.

#### B. Registry record binding

A future V1 source-evidence registry record MUST expose the artifact's exact `contentDigest`. The current generic Phase-0 trust-record field named `digest` is a transitional pre-implementation seam only and MUST NOT be represented as proven content binding merely because it contains a 64-hex value.

Before a registry record may satisfy a semantic claim, the future implementation MUST independently recompute the artifact `contentDigest` from the exact validated canonical content and require exact equality with the registry record's `contentDigest`. A caller-supplied digest, registry-supplied digest, or issuer-supplied digest without this recomputation MUST fail closed.

Resolution MUST remain exact-one: each required `sourceEvidenceDigest` MUST resolve to exactly one current source-evidence artifact record. Zero matches or more than one match MUST fail closed, even when duplicate records claim identical content, because duplicate registry identity is ambiguous at the constitutional lineage boundary.

The registry map/object key, if one exists, is an indexing implementation detail and MUST NOT itself establish digest identity, content integrity, provenance, lifecycle state, or trust. Verification MUST use the validated record value and recomputed canonical content digest.

#### C. Metadata and lifecycle separation

`contentDigest` binds exact evidence content only. It does NOT cryptographically bind mutable/current trust-registry metadata such as `provenanceState`, `lifecycleState`, `verificationState`, `conflictState`, `verifiedAt`, or `expiresAt`. Those fields remain separately authenticated lifecycle/trust assertions whose provenance, integrity, freshness, correction, supersession, revocation, and invalidation behavior MUST satisfy the rest of Section 6B.

Artifact identity fields such as `evidenceId`, `evidenceType`, `contentSchemaVersion`, `provenanceSourceId`, `observedAt`, and `createdAt` remain explicit source-evidence artifact bindings and MUST be structurally validated and retained for lineage. Their existence MUST NOT alter the locked meaning of `contentDigest` as the digest of canonical evidence content only.

A single `contentDigest` MUST NOT silently become trusted merely because it resolves to an artifact with plausible metadata. Exact content binding, artifact identity, provenance verification, lifecycle validity, conflict clearance, freshness, registry trust, issuer authority, and semantic-claim validity remain independent fail-closed gates.

#### D. Current-code consequence

The current admission implementation's case-insensitive comparison between `sourceEvidenceDigests` and legacy `record.digest` is NOT the final V1 constitutional source-evidence binding and MUST NOT be treated as runtime trust proof. Future implementation work must migrate this seam to the locked lowercase `contentDigest` semantics and add deterministic recomputation from exact canonical content before any Section 6B PASS can be claimed.

This step is design-only. It does NOT modify the admission verifier, source-evidence registry type, HMAC admission mechanics, DB, persistence, provider access, private-key material, trusted time, rollback protection, payment, legal filing, public launch, or any execution-authority boundary. All runtime trust and execution authority remain fail-closed.

### 6B.6 Canonical source-evidence result and failure contract — LOCKED

Repository audit established a consistent Phase-0 fail-closed result pattern: deterministic construction utilities return an explicit successful no-trust state or `REJECTED`, expose immutable failure-code arrays, convert inaccessible/hostile candidate access into stable failure codes, return null computed artifacts on rejection, and keep every trust or execution-authority projection false. The V1 constitutional source-evidence canonicalizer MUST follow the same contract rather than throwing ordinary validation failures to its caller.

#### A. Result shape

The future `ConstitutionalSourceEvidenceCanonicalContentResult` MUST expose at minimum:

- `canonicalizationState`: exactly `CANONICAL_SOURCE_EVIDENCE_CONTENT_READY_NO_TRUST` or `REJECTED`;
- `failureCodes`: immutable array of locked failure-code values;
- `canonicalContent`: canonical JSON text on success, otherwise `null`;
- `contentDigest`: exact Section 6B.2 lowercase digest on success, otherwise `null`;
- `contentBindingVerified`: always `false` at this construction boundary because computing a digest is not independent trust verification;
- `provenanceVerified`: always `false`;
- `lifecycleVerified`: always `false`;
- `conflictClearanceVerified`: always `false`;
- `freshnessVerified`: always `false`;
- `issuerTrustEstablished`: always `false`;
- `runtimeTrustEstablished`: always `false`;
- `admissionProjectionAuthorized`: always `false`;
- `constitutionalExecutionAuthorityGranted`: always `false`;
- `providerExecutionAuthorized`: always `false`;
- `paymentExecutionAuthorized`: always `false`;
- `legalFilingAuthorized`: always `false`;
- `externalDeliveryAuthorized`: always `false`;
- `publicLaunchAuthorized`: always `false`.

A successful canonicalization result MUST have an empty failure-code array. A rejected result MUST have at least one failure code and MUST return both `canonicalContent=null` and `contentDigest=null`. Result objects and failure-code arrays MUST be immutable.

#### B. Locked V1 failure codes

The canonicalizer failure-code union MUST distinguish at least:

- `CONTENT_NOT_PLAIN_OBJECT` — root content is not a plain object with prototype exactly `Object.prototype` or `null`;
- `CONTENT_ACCESS_FAILED` — descriptor/prototype/own-key inspection throws, a proxy trap throws, or equivalent structural inspection cannot be completed safely;
- `UNSUPPORTED_VALUE` — encountered `undefined`, function, symbol value, bigint, Date, Buffer, typed array, Map, Set, RegExp, Error, class instance, or another value outside the locked JSON subset;
- `NON_FINITE_NUMBER` — encountered `NaN`, positive infinity, or negative infinity;
- `NEGATIVE_ZERO` — encountered numeric `-0`;
- `BLOCKED_KEY` — encountered own string key `__proto__`, `prototype`, or `constructor`;
- `SYMBOL_KEY_PRESENT` — encountered any own symbol property;
- `ACCESSOR_PROPERTY_PRESENT` — an included object property or array index is accessor-backed rather than an ordinary data descriptor;
- `NON_PLAIN_OBJECT` — a recursively reachable non-array object is not a permitted plain object;
- `CIRCULAR_REFERENCE` — active traversal path encounters an already-active object identity;
- `SPARSE_ARRAY` — array index in `0..length-1` lacks the required own data descriptor;
- `ARRAY_EXTRA_PROPERTY` — array contains an enumerable own non-index string property that would otherwise be silently omitted from array semantics;
- `DEPTH_LIMIT_EXCEEDED` — traversal would exceed depth `24`;
- `NODE_LIMIT_EXCEEDED` — traversal would exceed `5000` total canonical-value nodes;
- `CONTAINER_ENTRY_LIMIT_EXCEEDED` — structural preflight observes more than `5000` own entries relevant to inspection;
- `ARRAY_LENGTH_LIMIT_EXCEEDED` — array length exceeds `5000`;
- `CANONICAL_BYTE_LIMIT_EXCEEDED` — canonical UTF-8 content would exceed `65536` bytes;
- `CANONICAL_SERIALIZATION_FAILED` — an otherwise admitted primitive/key cannot be converted under the exact locked canonical serialization rule or an invariant required to produce unambiguous canonical text fails.

Failure codes MUST describe structural/canonicalization failure only. They MUST NOT claim provenance failure, legal invalidity, lifecycle revocation, reviewer distrust, or execution denial unless that separate layer actually performed such a verification.

#### C. Failure collection semantics

The implementation MAY return the first deterministically encountered failure rather than attempting to enumerate every hostile-input defect. It MUST NOT continue traversing attacker-controlled content merely to accumulate additional diagnostics after a fail-closed condition is established. For validations that are safely available from one already-captured descriptor snapshot, multiple failures MAY be accumulated only when doing so does not invoke additional untrusted behavior. Duplicate failure codes MUST be de-duplicated before return.

Thrown exceptions originating from hostile property/proxy inspection MUST be caught at the public canonicalization boundary and represented as `CONTENT_ACCESS_FAILED`; expected hostile input MUST NOT escape as an uncaught exception. Programmer defects and environment failures MUST NOT be silently relabeled as successful canonicalization.

#### D. Success semantics

`CANONICAL_SOURCE_EVIDENCE_CONTENT_READY_NO_TRUST` means only that the supplied source-evidence content satisfied the locked V1 structural, descriptor, resource, canonical-text, UTF-8, and digest-construction rules. It does NOT prove that the evidence is authentic, true, current, conflict-free, legally valid, provenance-verified, lifecycle-valid, issuer-authorized, registry-trusted, admissible, or executable.

This design step does NOT create the canonicalizer implementation, source-evidence artifact validator, semantic-claim binding implementation, registry migration, provenance verifier, lifecycle store, trusted time, rollback protection, DB integration, provider access, payment, legal filing, public launch, or execution authority.

## 6C. Constitutional verification-context trust boundary

The admission verifier and orchestrator MUST NOT treat a caller-constructed verification context as an independent trust root.

Before runtime integration:

- trusted issuer records MUST be resolved from an owner-controlled trusted source satisfying Section 6A, not accepted from the action caller, employee, model, prompt, admission payload, provider response, UI state, or arbitrary orchestration input;
- source-evidence registry records and registry trust metadata MUST be resolved from an owner-controlled trusted source satisfying Section 6B, not accepted from caller-supplied registry objects or caller-declared `VERIFIED` states;
- verification secrets or equivalent cryptographic verification material MUST be independently provisioned and MUST NOT be supplied by the action caller or derived from the admission payload;
- the runtime orchestration boundary MUST separate untrusted action/request inputs from trusted verification dependencies;
- a runtime caller MUST NOT be able to promote itself, an issuer, a source-evidence record, or a registry into trusted state merely by constructing a `ConstitutionalEvidenceAdmissionVerificationContext`;
- trusted verification dependencies MUST be loaded or resolved through an independently testable owner-controlled trust-context resolver/provider boundary;
- trust-context load failure, partial load, corruption, stale trust state, provenance uncertainty, ambiguous resolver result, or unavailable verification material MUST fail closed;
- tests that inject in-memory verification contexts MAY be used as isolated unit-test fixtures, but those fixtures MUST NOT be represented as proof of runtime trust establishment;
- the current `orchestrateConstitutionalEvidenceAdmission(record, verificationContext, replayStore)` signature MUST NOT be considered runtime-safe merely because its injected context passes structural validation;
- production/runtime integration MUST remain BLOCKED until the trust-context construction path itself is independently implemented, verified, adversarially tested, and evidenced;
- satisfying this trust-context boundary grants no execution, provider, payment, legal-filing, external-delivery, mutation, or public-launch authority.

Required proof before runtime integration includes, at minimum:

1. proof that ordinary callers cannot provide or override trusted issuer records;
2. proof that ordinary callers cannot provide or override trusted source-evidence registry records or registry trust metadata;
3. proof that ordinary callers cannot provide or override verification secrets/material;
4. resolver/provider unavailable, corrupt, stale, partial, and ambiguous fail-closed tests;
5. provenance and integrity evidence for every trust-context component;
6. immutable audit evidence for trust-context lifecycle changes where applicable;
7. proof that unit-test fixtures are not reachable as runtime trust sources;
8. explicit proof that a valid trust context still grants no execution authority.

This section defines the verification-context trust boundary only. A Section 6C resolver contract, bootstrap-bound trusted-admission boundary, and in-memory trust-context resolver are implemented and covered by targeted fail-closed tests; however, the in-memory resolver is a bootstrap/test-oriented trust-material snapshot and does not by itself prove a production-grade independently provisioned owner-controlled runtime trust provider. The direct injectable verification-context API MUST NOT be treated as a trusted runtime integration boundary, and production/runtime integration remains blocked until the concrete owner-controlled trust source, provisioning, provenance, integrity, lifecycle, persistence, and operational isolation are independently implemented and proven.
### 6C lifecycle-audit implementation evidence — TARA V1

A dedicated constitutional trust-context lifecycle audit-record contract is implemented with deterministic SHA-256 record binding, predecessor-digest chaining, explicit activation/rotation/disablement/revocation/retirement and failure/ambiguity event representation, structural validation, and tamper detection. The audit contract hard-codes `trustedTimeEstablished=false`, `productionTrustEstablished=false`, `runtimeIntegrationAuthorized=false`, and `constitutionalExecutionAuthorityGranted=false`; therefore an audit record cannot itself promote trust or execution authority.

This local implementation evidence does **not** prove durable production audit persistence, independently trusted time, independently provisioned verification material, external bootstrap authentication, production owner-controlled trust-provider lifecycle, multi-host consistency, or production runtime integration. Those boundaries remain blocked.
### 6C isolated durable lifecycle-audit persistence evidence — TARA V1

An isolated SQLite V1 persistence implementation now stores the constitutional trust-context lifecycle audit chain with persistence-layer sequence uniqueness, WAL mode, `synchronous=FULL`, `BEGIN IMMEDIATE` append transactions, read-after-write chain verification, restart persistence, and database triggers that reject ordinary UPDATE and DELETE mutation. Targeted isolated tests verify restart durability, append-only enforcement, detection of persisted-record mutation when the append-only trigger is deliberately bypassed in the isolated test environment, and independent-process single-winner/idempotent append behavior.

This is local persistence evidence only. The SHA-256 chain is tamper-evident but is **not** an independently authenticated signature or external trust root. It does not prove protection against an attacker who can rewrite the database and recompute the entire unauthenticated chain, hardware/power-loss durability under every failure mode, multi-host or split-brain consistency, independently trusted time, independently provisioned verification material, external provenance bootstrap, production owner-controlled trust-provider lifecycle, or production runtime integration. Existing NEXUS PostgreSQL/Supabase/database environments remain outside this proof and were not authorized for use.

## 7. Admission integrity requirements

A future admission implementation SHOULD use deterministic canonicalization and immutable records.

If signed admission is introduced, it MUST bind:
- tenant;
- actor;
- action/operation identity;
- action class;
- requested capability;
- payload digest;
- constitution version;
- semantic evidence values;
- source evidence digests;
- issuer identity;
- issued-at / expiry where applicable;
- nonce or replay identity where applicable.

Any mismatch MUST fail closed.

## 7A. Replay nonce uniqueness scope

For Phase-0 constitutional evidence, a nonce MUST be single-use within the exact:

- tenantId;
- evidenceIssuerId;
- evidenceIssuerKeyId.

The nonce uniqueness decision MUST NOT be weakened by actionId, actionClass, requestedCapability, payloadDigest, or other mutable operation fields.

Therefore, after a nonce has been reserved for one verified admission under the same tenant + issuer + issuer-key scope, reuse of that nonce for any different action or payload under that same scope MUST fail closed as replay.

actionId and payloadDigest remain mandatory signed admission bindings and MAY be retained as replay evidence metadata, but they MUST NOT create a second valid uniqueness namespace for an already-used nonce.

Replay-store unavailability, ambiguity, conflicting reservation evidence, or inability to prove atomic single-use reservation MUST fail closed.

This replay rule grants no constitutional execution authority. A successful nonce reservation proves only that the verified evidence record passed the Phase-0 replay gate.

## 7B. Durable replay-store implementation contract

Any future persistent implementation of the Phase-0 constitutional replay store MUST satisfy all of the following before runtime integration may be considered:

- enforce one atomic winner for each exact normalized `(tenantId, evidenceIssuerId, evidenceIssuerKeyId, nonce)` scope;
- concurrent attempts for the same scope MUST NOT both return `RESERVED`;
- after one successful reservation, every later reservation attempt for the same scope MUST return `ALREADY_USED`, including attempts using a different actionId, action class, capability, or payload;
- reservation durability MUST survive process restart and service restart; an acknowledged `RESERVED` result MUST NOT disappear after restart;
- a crash, timeout, partial write, ambiguous commit result, split-brain condition, or inability to determine whether reservation committed MUST fail closed and MUST NOT be treated as a fresh reservation;
- the durable uniqueness mechanism MUST be enforced by the persistence layer itself, not only by in-process memory, pre-check logic, or application-level timing;
- normalization used for the persisted uniqueness key MUST be exactly compatible with the Phase-0 nonce-scope constructor;
- persistence corruption, duplicate conflicting records, unavailable storage, migration uncertainty, or inconsistent read/write evidence MUST fail closed;
- reservation evidence MAY retain actionId, payloadDigest, timestamps, and audit metadata, but those fields MUST NOT weaken or partition the nonce uniqueness namespace;
- no successful replay reservation grants constitutional execution authority, provider authority, payment authority, legal-filing authority, external-delivery authority, or public-launch authority;
- the persistent replay implementation MUST NOT reuse, migrate, modify, connect to, or depend on the existing NEXUS production/development database or PostgreSQL cluster unless separately reviewed and explicitly authorized by the owner;
- any future durable replay persistence must first be designed and proven in an isolated store/environment with its own connection configuration, lifecycle, rollback procedure, adversarial concurrency tests, restart tests, and evidence package;
- no `DATABASE_URL`-backed replay implementation may be invoked merely to prove this design contract.

This section defines requirements only. No persistent replay store is authorized or proven by this document.

### 7B implementation evidence status — TARA V1

Machine evidence currently proves an isolated SQLite V1 replay store with persistence-layer uniqueness over the exact normalized `(tenantId, evidenceIssuerId, evidenceIssuerKeyId, nonce)` namespace, restart durability, true independent-process single-winner behavior, malformed-store fail-closed behavior, storage-unavailable fail-closed behavior, and a durable `in_progress` → `reserved` protocol that prevents an acknowledged nonce-consumption intent from becoming fresh merely because the process restarts.

This evidence does **not** authorize production/runtime integration and does **not** prove hardware/power-loss durability, multi-host or split-brain behavior, production provisioning, production trust-source lifecycle, or use of any existing NEXUS PostgreSQL/Supabase/database environment. Those boundaries remain blocked until separately implemented, isolated, reviewed, and proven.

The replay store itself grants no constitutional, provider, payment, legal, external-send, public-launch, or production authority.

## 8. Runtime integration rule

AI-workforce runtime integration is BLOCKED until:
1. a constitutional evidence issuer has been enrolled under the Section 6A trust lifecycle contract;
2. the Section 6A issuer trust binding, least-privilege scopes, active key, lifecycle controls, and required trust evidence have been independently verified and proven;
3. every required source-evidence item satisfies the Section 6B trust lifecycle contract and the source-evidence registry, provenance, exact-one digest resolution, VERIFIED + CLEAR state, freshness, conflict handling, correction/revocation behavior, and required evidence proofs have been independently verified and proven;
4. an owner-controlled trust-context resolver/provider satisfying Section 6C has been implemented and proven so ordinary callers cannot provide or override trusted issuers, source-evidence registry data, registry trust metadata, or verification material;
5. the resulting admission is bound to the exact tenant/action/capability/payload;
6. the Constitution evaluator returns ALLOW_CONSTITUTIONALLY;
7. a durable replay store satisfying Section 7B has been implemented in an isolated environment and proven with atomic single-winner, same-scope replay, concurrency/race, restart-durability, crash/ambiguity fail-closed, and persistence-isolation evidence;
8. all separate execution-authority gates still pass.

No Asha, Riya, Meera, generic controlled-action, inquiry, recommendation, provider, payment, legal-filing, or public-launch boundary may treat raw caller semantic claims as satisfying this contract.

## 9. Current Phase-0 consequence

The canonical Constitution module and its standalone adversarial tests may continue to be verified independently.

Runtime constitutional enforcement MUST NOT be claimed complete until the Section 6A issuer-trust lifecycle, Section 6B source-evidence trust lifecycle, Section 6C owner-controlled verification-context trust boundary, and Section 7B durable replay-store requirements are implemented, independently verified, adversarially tested, and evidenced.

This design intentionally blocks unsafe integration rather than guessing semantic truth.