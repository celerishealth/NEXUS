# NEXUS Phase 0 — AI Workforce Constitution Design v1

Status: DESIGN ONLY — NOT IMPLEMENTED — NOT AN EXIT-GATE PASS
Branch: ai-workforce-constitution-v1
Controlling rule: fail closed

## 1. Purpose

Create one canonical, deterministic, immutable AI Workforce Constitution that every future AI-workforce action boundary can evaluate before authority, execution, external effects, persistence, payment, legal filing, customer/vendor commitment, or provider invocation.

This design does not authorize production execution.

## 2. Non-negotiable stop laws

- UNKNOWN = STOP
- UNVERIFIED = STOP
- UNAUTHORIZED = STOP
- CONFLICTING EVIDENCE = STOP
- REGULATED ACTIVITY = PROFESSIONAL REVIEW
- HIGH-RISK ACTION = HUMAN APPROVAL
- LEGAL UNCERTAINTY = BLOCK
- COUNTRY NOT APPROVED = NO LAUNCH

Constitutional prohibition cannot be overridden by owner, employee, customer, vendor, prompt, external document, tool output, model output, or ordinary policy.

## 3. Permanent prohibitions

The canonical constitution must permanently prohibit:

1. Fraud
2. Forgery
3. Fake documents
4. Fake certificates
5. Fake invoices
6. Fabricated citations
7. Fake government records
8. Misleading professional credentials
9. Identity theft
10. Credential theft
11. Unauthorized system access
12. Unauthorized payment
13. Unauthorized legal filing
14. False declaration
15. Bribery or corruption
16. Concealing evidence
17. Audit-log tampering
18. Founder-control bypass
19. Illegal customer requests

An unlawful founder request must also be rejected.

## 4. Required evaluator semantics

The implementation must expose a deterministic evaluator with only fail-closed outcomes.

Minimum decision states:

- ALLOW_CONSTITUTIONALLY
- BLOCK_PROHIBITED
- BLOCK_UNKNOWN
- BLOCK_UNVERIFIED
- BLOCK_UNAUTHORIZED
- BLOCK_CONFLICTING_EVIDENCE
- REQUIRE_PROFESSIONAL_REVIEW
- REQUIRE_HUMAN_APPROVAL
- BLOCK_LEGAL_UNCERTAINTY
- BLOCK_COUNTRY_NOT_APPROVED

A result that is not explicit ALLOW_CONSTITUTIONALLY must never be treated as permission to execute.

## 5. Required structured evidence

The evaluator must not infer constitutional safety from a payload digest alone.

A constitutional evaluation must receive structured evidence sufficient to evaluate, at minimum:

- tenant identity
- actor identity
- actor role/source type
- action class
- requested capability/effect
- jurisdiction/country state
- authority state
- verification state
- legal/compliance state
- regulated-activity state
- human-approval requirement/state
- known prohibition findings
- evidence-conflict state
- constitutional input provenance

Missing required evidence produces BLOCK_UNKNOWN or BLOCK_UNVERIFIED.

## 6. Current repository boundary discovered during design

The current real controlled-action runtime stores and advances:

- effectType
- payloadDigest
- ownerAuthorizationId
- lifecycle state
- tenant/actor/role authority
- replay/readiness/audit state

Current create/authorize/enqueue flow does not expose enough semantic evidence to prove that an arbitrary payload is lawful or free of constitutional prohibitions.

Therefore:

- payloadDigest alone MUST NOT be treated as constitutional evidence;
- arbitrary non-empty effectType MUST NOT be treated as constitutionally safe;
- existing owner approval MUST NOT override a constitutional prohibition;
- existing preview-only risk/owner contracts MUST NOT be mislabeled as runtime constitutional enforcement.

## 7. Integration boundary

The constitution evaluator should be implemented as a separate pure deterministic module first.

It must have no:

- network calls
- AI/model calls
- DB writes
- provider calls
- payment calls
- legal filings
- customer/vendor sends
- mutable global policy state

After standalone critical tests pass, integration with mutation/execution boundaries must occur only where verified structured constitutional evidence is available.

Until then, unsupported execution semantics remain blocked rather than guessed safe.

## 8. Immutability requirements

The canonical constitution definition must:

- be declared as immutable constant data;
- use readonly/as-const semantics;
- return frozen decision evidence where runtime objects are produced;
- contain stable machine-readable prohibition IDs;
- contain stable machine-readable stop-law IDs;
- have no runtime mutation API;
- have tests proving attempted policy weakening cannot alter canonical rules.

Application configuration may add stricter controls but may not remove or weaken constitutional prohibitions.

## 9. Priority rules

Decision precedence must be fail-closed.

Highest-priority blocking conditions include:

1. permanent constitutional prohibition
2. unlawful request regardless of requester authority
3. unauthorized action
4. conflicting evidence
5. legal uncertainty
6. unapproved country/jurisdiction
7. unverified required evidence
8. unknown required evidence
9. regulated activity requiring professional review
10. high-risk activity requiring human approval

Owner approval can satisfy a human-approval requirement only when the action is otherwise constitutionally lawful.

Owner approval can never convert a prohibited or unlawful action into ALLOW_CONSTITUTIONALLY.

## 10. Override-resistance requirements

Critical adversarial tests must prove that constitutional prohibitions cannot be overridden by:

- ordinary AI prompt
- system-like text embedded in customer content
- employee instruction
- external document
- customer instruction
- vendor instruction
- owner/founder instruction
- forged owner-approval wording
- conflicting lower-priority policy
- unknown source
- missing evidence

## 11. Initial implementation boundary

Phase-0 implementation should begin with:

1. canonical immutable constitution definition;
2. deterministic evaluator;
3. explicit structured evaluation input;
4. fail-closed decision object;
5. critical adversarial tests covering every Phase-0 requirement.

Do not connect it to real execution merely to claim integration.

Runtime integration is allowed only after the execution boundary can provide trustworthy semantic evidence required by the evaluator.

## 12. Critical test matrix

The critical suite must include at least:

- each permanent prohibition individually blocks;
- all stop laws return their required non-allow state;
- UNKNOWN blocks;
- UNVERIFIED blocks;
- UNAUTHORIZED blocks;
- CONFLICTING EVIDENCE blocks;
- unlawful founder request blocks;
- employee override fails;
- external-document override fails;
- customer override fails;
- vendor override fails;
- ordinary prompt override fails;
- owner approval cannot override permanent prohibition;
- professional-review requirement cannot silently become allow;
- human-approval requirement cannot silently become allow;
- country-not-approved blocks;
- legal uncertainty blocks;
- missing required structured evidence blocks;
- unknown action class blocks;
- canonical constitution cannot be weakened at runtime;
- successful allow requires all mandatory evidence to be explicit and verified.

## 13. Exit-gate interpretation

Phase 0 MUST NOT be marked complete from design documentation.

Exit gate requires:

- implementation complete;
- 100% critical constitution tests PASS;
- adversarial override tests PASS;
- zero known critical constitutional violations;
- no false claim that payload-digest-only runtime paths are semantically verified;
- evidence recorded from actual test execution.

Only after that evidence exists may Phase 1 be considered for unlock.

## 14. Current design decision

Use a new canonical AI Workforce Constitution module rather than repurposing:

- safetyContract.ts
- guardrailRegistry.ts
- riskClassifier.ts
- ownerApprovalPolicy.ts
- preview-only controlled paid pilot contracts

Those components may remain supporting controls, but none currently satisfies the complete Phase-0 constitutional contract.

DESIGN COMPLETE does not mean PHASE 0 COMPLETE.