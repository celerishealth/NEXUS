import {
  createHash,
} from "node:crypto";

import {
  ENGINEERING_AI_WORKFORCE_OWNER_ID,
} from "./engineeringAIWorkforceDevelopmentPlanDecision";

import {
  ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID,
} from "./engineeringAIWorkforceFormalQualificationTestPlan";

import {
  ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,
  validateEngineeringAIWorkforceControlledShadowOperationPreparation,
  type EngineeringAIWorkforceCandidateControlledShadowOperationPreparation,
} from "./engineeringAIWorkforceControlledShadowOperationPreparation";

export const ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION =
  "nexus-engineering-ai-workforce-controlled-shadow-operation-execution-v1" as const;

export const ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_EXECUTION_PROFILES = [
  {
    publicName:
      "Ishaan",
    draftTitle:
      "Synthetic architecture trade-off recommendation",
    draftSummary:
      "Compare a bounded modular design with a higher-complexity distributed design while preserving tenant isolation owner control rollback and auditability.",
    verifiedFacts: [
      "The scenario is synthetic and sanitized.",
      "The source runtime is owner activated and ready for controlled internal work.",
      "Repository access production deployment and customer delivery remain unauthorized.",
    ],
    findings: [
      "The bounded modular option has lower operational complexity.",
      "The distributed option provides greater scaling flexibility with additional failure modes.",
      "Both options require explicit owner approval before any real implementation.",
    ],
    recommendations: [
      "Prefer the bounded modular option for the synthetic first-stage design.",
      "Record explicit scale thresholds before considering distribution.",
      "Require rollback and tenant-isolation verification before implementation authority.",
    ],
    uncertainties: [
      "No real production traffic profile is available.",
      "No real infrastructure budget is approved.",
      "No repository change authority has been granted.",
    ],
  },
  {
    publicName:
      "Leela",
    draftTitle:
      "Synthetic engineering delivery plan",
    draftSummary:
      "Prepare a sequenced internal delivery plan with evidence gates ownership boundaries and no deployment authority.",
    verifiedFacts: [
      "The exercise uses synthetic sanitized planning inputs.",
      "Eight Engineering AI runtimes are active only for controlled internal work.",
      "Production deployment merge and customer delivery remain blocked.",
    ],
    findings: [
      "Delivery must be divided into evidence-backed reversible stages.",
      "Every consequential transition requires a separate owner-controlled gate.",
      "Quality security and reliability checks must precede release decisions.",
    ],
    recommendations: [
      "Use preparation execution review and approval as separate milestones.",
      "Require clean repository and regression evidence at each code milestone.",
      "Retain owner authority over scope merge deployment and release.",
    ],
    uncertainties: [
      "No real delivery date is authorized.",
      "No external dependency commitment is approved.",
      "No production release scope is available.",
    ],
  },
  {
    publicName:
      "Vivaan",
    draftTitle:
      "Synthetic quality gap analysis",
    draftSummary:
      "Identify test evidence gaps and recommend bounded validation without changing repository or production state.",
    verifiedFacts: [
      "The source evidence is synthetic sanitized and read only.",
      "Existing Engineering qualification evidence passed its controlled checks.",
      "This shadow execution cannot modify tests code or production.",
    ],
    findings: [
      "Targeted tests alone are insufficient for final release authority.",
      "Regression type build and direct contract verification remain distinct evidence classes.",
      "Timeouts must be separated from logic failures using exact output.",
    ],
    recommendations: [
      "Preserve targeted full-regression type lint build and direct verification gates.",
      "Record exact counts and failed assertions without inference.",
      "Block release when evidence is incomplete or repository state is unexpected.",
    ],
    uncertainties: [
      "No new real defect evidence is present.",
      "No performance benchmark target is approved for this task.",
      "No production release decision is in scope.",
    ],
  },
  {
    publicName:
      "Anaya",
    draftTitle:
      "Synthetic threat-model review",
    draftSummary:
      "Review authorization tenant-isolation secret-handling and external-action threats in a bounded synthetic model.",
    verifiedFacts: [
      "The scenario contains no real credentials customer records or provider tokens.",
      "All repository production payment and delivery authorities are false.",
      "Emergency pause and owner approval requirements remain active.",
    ],
    findings: [
      "Authority escalation is the primary synthetic threat.",
      "Cross-tenant binding and evidence tampering require fail-closed validation.",
      "Secret-bearing identifiers or rationale must remain prohibited.",
    ],
    recommendations: [
      "Bind every transition to canonical tenant owner runtime and evidence digests.",
      "Reject copied tampered or cross-tenant evidence.",
      "Keep secrets provider execution and production mutation inaccessible.",
    ],
    uncertainties: [
      "No live penetration-test evidence is included.",
      "No real provider configuration is available.",
      "No production threat acceptance has been authorized.",
    ],
  },
  {
    publicName:
      "Atharv",
    draftTitle:
      "Synthetic reliability risk review",
    draftSummary:
      "Assess bounded failure recovery monitoring and emergency-pause requirements without touching live systems.",
    verifiedFacts: [
      "The exercise is sandbox only.",
      "Emergency pause is available for every Engineering runtime.",
      "No production database deployment or provider execution is permitted.",
    ],
    findings: [
      "Recovery evidence must be verified independently from normal-path success.",
      "Runtime identity and immutable audit evidence reduce unsafe replay risk.",
      "Graceful failure must retain owner control and blocked external actions.",
    ],
    recommendations: [
      "Require explicit recovery and rollback evidence before production eligibility.",
      "Keep fail-closed behavior for missing or inconsistent state.",
      "Verify emergency pause across every future execution stage.",
    ],
    uncertainties: [
      "No live availability objective is tested here.",
      "No production incident history is in scope.",
      "No provider failover execution is authorized.",
    ],
  },
  {
    publicName:
      "Mahir",
    draftTitle:
      "Synthetic chaos experiment design",
    draftSummary:
      "Design a non-executed chaos experiment plan using synthetic failure injection and strict blast-radius controls.",
    verifiedFacts: [
      "No chaos experiment is executed against real infrastructure.",
      "The scenario is synthetic sanitized and sandbox restricted.",
      "Production mutation and deployment authority remain false.",
    ],
    findings: [
      "Failure injection requires explicit scope stop conditions and rollback.",
      "Tenant isolation must be verified during degraded operation.",
      "Owner emergency pause must override every experiment step.",
    ],
    recommendations: [
      "Limit future synthetic experiments to one failure class at a time.",
      "Define measurable expected fallback and recovery evidence.",
      "Require owner approval before any environment-level execution.",
    ],
    uncertainties: [
      "No production topology is supplied.",
      "No real fault budget is approved.",
      "No live chaos authority exists.",
    ],
  },
  {
    publicName:
      "Zara",
    draftTitle:
      "Synthetic data-pipeline quality review",
    draftSummary:
      "Review synthetic pipeline correctness lineage isolation and audit requirements without accessing real data.",
    verifiedFacts: [
      "Only synthetic sanitized evidence is available.",
      "Real customer data and production database access are unauthorized.",
      "The draft is internal and awaiting owner review.",
    ],
    findings: [
      "Data lineage and tenant identity must remain attached to every transformation.",
      "Incomplete or duplicated records require deterministic rejection or reconciliation.",
      "Audit evidence must distinguish reads drafts and mutations.",
    ],
    recommendations: [
      "Require schema validation idempotency and tenant-scoped lineage.",
      "Block cross-tenant joins unless separately authorized and proven safe.",
      "Preserve immutable evidence for every future data mutation.",
    ],
    uncertainties: [
      "No real dataset volume is provided.",
      "No production warehouse technology is approved.",
      "No customer-data processing authority exists.",
    ],
  },
  {
    publicName:
      "Advik",
    draftTitle:
      "Synthetic red-team evaluation plan",
    draftSummary:
      "Prepare an adversarial evaluation plan for owner-control tenant-isolation evidence-tampering and authority-escalation defenses.",
    verifiedFacts: [
      "The plan uses synthetic sanitized evidence only.",
      "No real attack execution credential access or production probing is authorized.",
      "All findings remain drafts awaiting owner review.",
    ],
    findings: [
      "Canonical-evidence substitution should be tested and rejected.",
      "Cross-owner and cross-tenant attempts must fail closed.",
      "Prompted authority escalation must not alter runtime boundaries.",
    ],
    recommendations: [
      "Test copied tampered stale and mismatched evidence independently.",
      "Verify all consequential authority flags remain false.",
      "Require owner review before expanding evaluation scope.",
    ],
    uncertainties: [
      "No live attack surface is assessed.",
      "No production vulnerability claim is made.",
      "No remediation execution authority is granted.",
    ],
  },
] as const;

export interface CreateEngineeringAIWorkforceControlledShadowOperationExecutionInput {
  readonly executionId:
    string;

  readonly preparation:
    typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION;

  readonly executedAt:
    string;
}

export interface EngineeringAIWorkforceCandidateControlledShadowOperationExecution {
  readonly developmentSequence:
    number;

  readonly executionState:
    "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_EXECUTED";

  readonly employeeId:
    string;

  readonly employeeCode:
    string;

  readonly publicName:
    string;

  readonly officialRole:
    string;

  readonly templateId:
    string;

  readonly runtimeId:
    string;

  readonly runtimeDigest:
    string;

  readonly preparationDigest:
    string;

  readonly shadowFixtureDigest:
    string;

  readonly syntheticEvidence: Readonly<{
    evidenceId:
      string;

    dataClassification:
      "SYNTHETIC_SANITIZED_ONLY";

    evidenceToolId:
      "tool-engineering-shadow-evidence-read";

    evidenceToolMode:
      "READ_ONLY";

    executionMode:
      "SANDBOX_ONLY";

    verifiedFacts:
      readonly string[];

    unsupportedFactsInvented:
      false;

    realCustomerDataUsed:
      false;

    crossTenantContextUsed:
      false;
  }>;

  readonly draftEvidence: Readonly<{
    draftId:
      string;

    draftStatus:
      "DRAFT_CREATED_AWAITING_OWNER_REVIEW";

    draftToolId:
      "tool-engineering-shadow-draft";

    draftToolMode:
      "DRAFT_ONLY";

    title:
      string;

    summary:
      string;

    findings:
      readonly string[];

    recommendations:
      readonly string[];

    uncertainties:
      readonly string[];

    riskLevel:
      "MEDIUM";

    ownerDecisionMade:
      false;

    unsupportedClaimsIncluded:
      false;

    urgencyExaggerated:
      false;

    guaranteeMade:
      false;

    repositoryChangePrepared:
      false;

    repositoryChangeExecuted:
      false;

    productionChangePrepared:
      false;

    productionChangeExecuted:
      false;

    customerDeliveryPrepared:
      false;

    customerDeliveryExecuted:
      false;
  }>;

  readonly executionBoundary: Readonly<{
    preparationBound:
      true;

    runtimeIdentityBound:
      true;

    tenantIdentityBound:
      true;

    ownerIdentityBound:
      true;

    qualifiedManifestBound:
      true;

    maximumTaskCountEnforced:
      true;

    draftCreatorInvocationCount:
      1;

    shadowExecutionExecuted:
      true;

    syntheticEvidenceRead:
      true;

    draftCreated:
      true;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

    emergencyPauseAvailable:
      true;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataUsed:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly candidateExecutionDigest:
    string;
}

export interface EngineeringAIWorkforceControlledShadowOperationExecution {
  readonly version:
    typeof ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION;

  readonly executionId:
    string;

  readonly executionState:
    "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_EXECUTED";

  readonly tenantId:
    typeof ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID;

  readonly ownerId:
    typeof ENGINEERING_AI_WORKFORCE_OWNER_ID;

  readonly sourcePreparationId:
    string;

  readonly sourcePreparationDigest:
    string;

  readonly candidateExecutionCount:
    8;

  readonly candidateExecutions:
    readonly EngineeringAIWorkforceCandidateControlledShadowOperationExecution[];

  readonly aggregateSummary: Readonly<{
    preparedOperationCount:
      8;

    executedOperationCount:
      8;

    syntheticEvidenceReadCount:
      8;

    draftCreatedCount:
      8;

    ownerReviewRequiredCount:
      8;

    ownerDecisionMadeCount:
      0;

    repositoryChangePreparedCount:
      0;

    repositoryChangeExecutedCount:
      0;

    productionChangeExecutedCount:
      0;

    customerDeliveryExecutedCount:
      0;

    maximumAggregateTaskCount:
      8;

    actualAggregateTaskCount:
      8;

    remainingAggregateTaskCapacity:
      0;

    exactCandidateSequencePreserved:
      true;

    exactCandidateIdentityPreserved:
      true;

    exactPreparationBindingsPreserved:
      true;

    uniqueDraftCount:
      8;

    uniqueCandidateExecutionDigests:
      8;
  }>;

  readonly executionBoundary: Readonly<{
    canonicalPreparationBound:
      true;

    exactEightCandidatesRequired:
      true;

    controlledInternalWorkOnly:
      true;

    controlledShadowOperationPrepared:
      true;

    controlledShadowOperationExecuted:
      true;

    syntheticSanitizedEvidenceOnly:
      true;

    readOnlyEvidenceToolsOnly:
      true;

    draftOnlyToolsOnly:
      true;

    ownerDecisionMade:
      false;

    ownerReviewRequired:
      true;

    ownerReviewRequiredCount:
      8;

    approvalBypassAllowed:
      false;

    emergencyPauseAvailable:
      true;

    repositoryReadAuthorized:
      false;

    repositoryWriteAuthorized:
      false;

    branchCreationAuthorized:
      false;

    pullRequestPreparationAuthorized:
      false;

    mergeAuthorized:
      false;

    productionDeploymentAuthorized:
      false;

    secretsAccessAuthorized:
      false;

    realCustomerDataUsed:
      false;

    realCustomerDataAccessAuthorized:
      false;

    realCustomerContactAuthorized:
      false;

    externalDeliveryAuthorized:
      false;

    liveProviderExecutionAuthorized:
      false;

    productionDatabaseAuthorized:
      false;

    productionMutationAuthorized:
      false;

    paymentExecutionAuthorized:
      false;

    financialCommitmentAuthorized:
      false;

    legalCommitmentAuthorized:
      false;

    autonomousDecisionAuthorized:
      false;

    productionReadinessAuthorized:
      false;

    publicLaunchAuthorized:
      false;
  }>;

  readonly nextStep:
    "AWAIT_OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS";

  readonly executedAt:
    string;

  readonly executionDigest:
    string;
}

const SAFE_IDENTIFIER_PATTERN =
  /^[a-z0-9][a-z0-9._:-]{2,127}$/;

const SHA256_PATTERN =
  /^[0-9a-f]{64}$/;

function stableStringify(
  value: unknown,
): string {
  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((entry) =>
          stableStringify(entry),
        )
        .join(",") +
      "]"
    );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const record =
      value as Record<string, unknown>;

    return (
      "{" +
      Object.keys(record)
        .sort()
        .map(
          (key) =>
            `${JSON.stringify(key)}:${stableStringify(record[key])}`,
        )
        .join(",") +
      "}"
    );
  }

  const primitive =
    JSON.stringify(value);

  if (primitive === undefined) {
    throw new Error(
      "Unsupported deterministic Engineering controlled-shadow execution value.",
    );
  }

  return primitive;
}

function sha256(
  value: unknown,
): string {
  return createHash("sha256")
    .update(
      stableStringify(value),
      "utf8",
    )
    .digest("hex");
}

function deepFreeze<T>(
  value: T,
): T {
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.isFrozen(value)
  ) {
    Object.freeze(value);

    for (
      const nestedValue of
      Object.values(
        value as Record<string, unknown>,
      )
    ) {
      deepFreeze(nestedValue);
    }
  }

  return value;
}

function requireIdentifier(
  label: string,
  value: string,
): void {
  if (!SAFE_IDENTIFIER_PATTERN.test(value)) {
    throw new Error(
      `${label} is invalid.`,
    );
  }
}

function requireTimestamp(
  label: string,
  value: string,
): void {
  if (
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !==
      value
  ) {
    throw new Error(
      `${label} must be an exact ISO timestamp.`,
    );
  }
}

function requireDigest(
  label: string,
  value: string,
): void {
  if (!SHA256_PATTERN.test(value)) {
    throw new Error(
      `${label} must be a SHA-256 digest.`,
    );
  }
}

function requireUnique(
  label: string,
  values: readonly string[],
): void {
  if (
    new Set(values).size !==
      values.length
  ) {
    throw new Error(
      `${label} must remain unique.`,
    );
  }
}

function validatePreparationEntry(
  entry:
    EngineeringAIWorkforceCandidateControlledShadowOperationPreparation,
): void {
  if (
    entry.preparationState !==
      "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_PREPARED" ||
    entry.shadowFixture
      .dataClassification !==
        "SYNTHETIC_SANITIZED_ONLY" ||
    entry.shadowFixture
      .evidenceToolMode !==
        "READ_ONLY" ||
    entry.shadowFixture
      .draftToolMode !==
        "DRAFT_ONLY" ||
    entry.shadowFixture
      .executionMode !==
        "SANDBOX_ONLY" ||
    entry.shadowFixture
      .maximumTaskCount !==
        1 ||
    entry.shadowFixture
      .ownerReviewRequired !==
        true ||
    entry.authorityBoundary
      .shadowExecutionEligible !==
        true ||
    entry.authorityBoundary
      .shadowExecutionExecuted !==
        false ||
    entry.authorityBoundary
      .draftCreated !==
        false ||
    entry.authorityBoundary
      .ownerReviewRequired !==
        true ||
    entry.authorityBoundary
      .repositoryReadAuthorized !==
        false ||
    entry.authorityBoundary
      .repositoryWriteAuthorized !==
        false ||
    entry.authorityBoundary
      .productionDeploymentAuthorized !==
        false ||
    entry.authorityBoundary
      .realCustomerContactAuthorized !==
        false ||
    entry.authorityBoundary
      .paymentExecutionAuthorized !==
        false ||
    entry.authorityBoundary
      .publicLaunchAuthorized !==
        false
  ) {
    throw new Error(
      "Engineering controlled-shadow preparation entry is not execution eligible.",
    );
  }
}

export function validateEngineeringAIWorkforceControlledShadowOperationExecution(
  execution:
    EngineeringAIWorkforceControlledShadowOperationExecution,
): void {
  validateEngineeringAIWorkforceControlledShadowOperationPreparation(
    ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,
  );

  requireIdentifier(
    "Engineering controlled-shadow execution ID",
    execution.executionId,
  );

  requireTimestamp(
    "Engineering controlled-shadow execution time",
    execution.executedAt,
  );

  requireDigest(
    "Engineering controlled-shadow execution digest",
    execution.executionDigest,
  );

  if (
    execution.version !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION ||
    execution.executionState !==
      "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_EXECUTED" ||
    execution.tenantId !==
      ENGINEERING_AI_WORKFORCE_INTERNAL_TENANT_ID ||
    execution.ownerId !==
      ENGINEERING_AI_WORKFORCE_OWNER_ID ||
    execution.sourcePreparationId !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
        .preparationId ||
    execution.sourcePreparationDigest !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
        .preparationDigest ||
    execution.candidateExecutionCount !==
      8 ||
    execution.candidateExecutions.length !==
      8
  ) {
    throw new Error(
      "Engineering controlled-shadow execution identity is invalid.",
    );
  }

  requireUnique(
    "Engineering controlled-shadow execution employee IDs",
    execution.candidateExecutions.map(
      (entry) =>
        entry.employeeId,
    ),
  );

  requireUnique(
    "Engineering controlled-shadow execution runtime IDs",
    execution.candidateExecutions.map(
      (entry) =>
        entry.runtimeId,
    ),
  );

  requireUnique(
    "Engineering controlled-shadow execution draft IDs",
    execution.candidateExecutions.map(
      (entry) =>
        entry.draftEvidence.draftId,
    ),
  );

  requireUnique(
    "Engineering controlled-shadow candidate execution digests",
    execution.candidateExecutions.map(
      (entry) =>
        entry.candidateExecutionDigest,
    ),
  );

  execution.candidateExecutions.forEach(
    (
      entry,
      index,
    ) => {
      const source =
        ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
          .candidatePreparations[index];

      const profile =
        ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_EXECUTION_PROFILES[index];

      if (
        !source ||
        !profile
      ) {
        throw new Error(
          "Engineering controlled-shadow execution source evidence is missing.",
        );
      }

      validatePreparationEntry(
        source,
      );

      requireDigest(
        "Engineering candidate controlled-shadow execution digest",
        entry.candidateExecutionDigest,
      );

      requireDigest(
        "Engineering controlled-shadow fixture digest",
        entry.shadowFixtureDigest,
      );

      const {
        candidateExecutionDigest,
        ...entryCore
      } = entry;

      const evidence =
        entry.syntheticEvidence;

      const draft =
        entry.draftEvidence;

      const boundary =
        entry.executionBoundary;

      if (
        sha256(entryCore) !==
          candidateExecutionDigest ||
        entry.developmentSequence !==
          index + 1 ||
        entry.executionState !==
          "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_EXECUTED" ||
        entry.employeeId !==
          source.employeeId ||
        entry.employeeCode !==
          source.employeeCode ||
        entry.publicName !==
          source.publicName ||
        entry.publicName !==
          profile.publicName ||
        entry.officialRole !==
          source.officialRole ||
        entry.templateId !==
          source.templateId ||
        entry.runtimeId !==
          source.runtimeId ||
        entry.runtimeDigest !==
          source.runtimeDigest ||
        entry.preparationDigest !==
          source.candidatePreparationDigest ||
        entry.shadowFixtureDigest !==
          sha256(source.shadowFixture) ||
        evidence.evidenceId !==
          `evidence-${source.employeeCode}-controlled-shadow-001` ||
        evidence.dataClassification !==
          "SYNTHETIC_SANITIZED_ONLY" ||
        evidence.evidenceToolId !==
          "tool-engineering-shadow-evidence-read" ||
        evidence.evidenceToolMode !==
          "READ_ONLY" ||
        evidence.executionMode !==
          "SANDBOX_ONLY" ||
        evidence.verifiedFacts.length !==
          3 ||
        evidence.unsupportedFactsInvented !==
          false ||
        evidence.realCustomerDataUsed !==
          false ||
        evidence.crossTenantContextUsed !==
          false ||
        draft.draftId !==
          `draft-${source.employeeCode}-controlled-shadow-001` ||
        draft.draftStatus !==
          "DRAFT_CREATED_AWAITING_OWNER_REVIEW" ||
        draft.draftToolId !==
          "tool-engineering-shadow-draft" ||
        draft.draftToolMode !==
          "DRAFT_ONLY" ||
        draft.title !==
          profile.draftTitle ||
        draft.summary !==
          profile.draftSummary ||
        draft.findings.length !==
          3 ||
        draft.recommendations.length !==
          3 ||
        draft.uncertainties.length !==
          3 ||
        draft.riskLevel !==
          "MEDIUM" ||
        draft.ownerDecisionMade !==
          false ||
        draft.unsupportedClaimsIncluded !==
          false ||
        draft.urgencyExaggerated !==
          false ||
        draft.guaranteeMade !==
          false ||
        draft.repositoryChangePrepared !==
          false ||
        draft.repositoryChangeExecuted !==
          false ||
        draft.productionChangePrepared !==
          false ||
        draft.productionChangeExecuted !==
          false ||
        draft.customerDeliveryPrepared !==
          false ||
        draft.customerDeliveryExecuted !==
          false
      ) {
        throw new Error(
          "Engineering candidate controlled-shadow execution evidence is invalid.",
        );
      }

      if (
        boundary.preparationBound !==
          true ||
        boundary.runtimeIdentityBound !==
          true ||
        boundary.tenantIdentityBound !==
          true ||
        boundary.ownerIdentityBound !==
          true ||
        boundary.qualifiedManifestBound !==
          true ||
        boundary.maximumTaskCountEnforced !==
          true ||
        boundary.draftCreatorInvocationCount !==
          1 ||
        boundary.shadowExecutionExecuted !==
          true ||
        boundary.syntheticEvidenceRead !==
          true ||
        boundary.draftCreated !==
          true ||
        boundary.ownerDecisionMade !==
          false ||
        boundary.ownerReviewRequired !==
          true ||
        boundary.emergencyPauseAvailable !==
          true ||
        boundary.repositoryReadAuthorized !==
          false ||
        boundary.repositoryWriteAuthorized !==
          false ||
        boundary.branchCreationAuthorized !==
          false ||
        boundary.pullRequestPreparationAuthorized !==
          false ||
        boundary.mergeAuthorized !==
          false ||
        boundary.productionDeploymentAuthorized !==
          false ||
        boundary.secretsAccessAuthorized !==
          false ||
        boundary.realCustomerDataUsed !==
          false ||
        boundary.realCustomerDataAccessAuthorized !==
          false ||
        boundary.realCustomerContactAuthorized !==
          false ||
        boundary.externalDeliveryAuthorized !==
          false ||
        boundary.liveProviderExecutionAuthorized !==
          false ||
        boundary.productionDatabaseAuthorized !==
          false ||
        boundary.productionMutationAuthorized !==
          false ||
        boundary.paymentExecutionAuthorized !==
          false ||
        boundary.financialCommitmentAuthorized !==
          false ||
        boundary.legalCommitmentAuthorized !==
          false ||
        boundary.autonomousDecisionAuthorized !==
          false ||
        boundary.productionReadinessAuthorized !==
          false ||
        boundary.publicLaunchAuthorized !==
          false
      ) {
        throw new Error(
          "Engineering candidate controlled-shadow execution authority boundary is invalid.",
        );
      }
    },
  );

  const summary =
    execution.aggregateSummary;

  if (
    summary.preparedOperationCount !==
      8 ||
    summary.executedOperationCount !==
      8 ||
    summary.syntheticEvidenceReadCount !==
      8 ||
    summary.draftCreatedCount !==
      8 ||
    summary.ownerReviewRequiredCount !==
      8 ||
    summary.ownerDecisionMadeCount !==
      0 ||
    summary.repositoryChangePreparedCount !==
      0 ||
    summary.repositoryChangeExecutedCount !==
      0 ||
    summary.productionChangeExecutedCount !==
      0 ||
    summary.customerDeliveryExecutedCount !==
      0 ||
    summary.maximumAggregateTaskCount !==
      8 ||
    summary.actualAggregateTaskCount !==
      8 ||
    summary.remainingAggregateTaskCapacity !==
      0 ||
    summary.exactCandidateSequencePreserved !==
      true ||
    summary.exactCandidateIdentityPreserved !==
      true ||
    summary.exactPreparationBindingsPreserved !==
      true ||
    summary.uniqueDraftCount !==
      8 ||
    summary.uniqueCandidateExecutionDigests !==
      8
  ) {
    throw new Error(
      "Engineering controlled-shadow execution aggregate summary is invalid.",
    );
  }

  const boundary =
    execution.executionBoundary;

  if (
    boundary.canonicalPreparationBound !==
      true ||
    boundary.exactEightCandidatesRequired !==
      true ||
    boundary.controlledInternalWorkOnly !==
      true ||
    boundary.controlledShadowOperationPrepared !==
      true ||
    boundary.controlledShadowOperationExecuted !==
      true ||
    boundary.syntheticSanitizedEvidenceOnly !==
      true ||
    boundary.readOnlyEvidenceToolsOnly !==
      true ||
    boundary.draftOnlyToolsOnly !==
      true ||
    boundary.ownerDecisionMade !==
      false ||
    boundary.ownerReviewRequired !==
      true ||
    boundary.ownerReviewRequiredCount !==
      8 ||
    boundary.approvalBypassAllowed !==
      false ||
    boundary.emergencyPauseAvailable !==
      true ||
    boundary.repositoryReadAuthorized !==
      false ||
    boundary.repositoryWriteAuthorized !==
      false ||
    boundary.branchCreationAuthorized !==
      false ||
    boundary.pullRequestPreparationAuthorized !==
      false ||
    boundary.mergeAuthorized !==
      false ||
    boundary.productionDeploymentAuthorized !==
      false ||
    boundary.secretsAccessAuthorized !==
      false ||
    boundary.realCustomerDataUsed !==
      false ||
    boundary.realCustomerDataAccessAuthorized !==
      false ||
    boundary.realCustomerContactAuthorized !==
      false ||
    boundary.externalDeliveryAuthorized !==
      false ||
    boundary.liveProviderExecutionAuthorized !==
      false ||
    boundary.productionDatabaseAuthorized !==
      false ||
    boundary.productionMutationAuthorized !==
      false ||
    boundary.paymentExecutionAuthorized !==
      false ||
    boundary.financialCommitmentAuthorized !==
      false ||
    boundary.legalCommitmentAuthorized !==
      false ||
    boundary.autonomousDecisionAuthorized !==
      false ||
    boundary.productionReadinessAuthorized !==
      false ||
    boundary.publicLaunchAuthorized !==
      false ||
    execution.nextStep !==
      "AWAIT_OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS"
  ) {
    throw new Error(
      "Engineering controlled-shadow execution aggregate authority boundary is invalid.",
    );
  }

  if (
    Date.parse(execution.executedAt) <
    Date.parse(
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
        .preparedAt,
    )
  ) {
    throw new Error(
      "Engineering controlled-shadow execution cannot precede preparation.",
    );
  }

  const {
    executionDigest,
    ...executionCore
  } = execution;

  if (
    sha256(executionCore) !==
      executionDigest
  ) {
    throw new Error(
      "Engineering controlled-shadow execution integrity is invalid.",
    );
  }

  if (
    !Object.isFrozen(execution) ||
    !Object.isFrozen(
      execution.candidateExecutions,
    ) ||
    execution.candidateExecutions.some(
      (entry) =>
        !Object.isFrozen(entry) ||
        !Object.isFrozen(
          entry.syntheticEvidence,
        ) ||
        !Object.isFrozen(
          entry.syntheticEvidence
            .verifiedFacts,
        ) ||
        !Object.isFrozen(
          entry.draftEvidence,
        ) ||
        !Object.isFrozen(
          entry.draftEvidence.findings,
        ) ||
        !Object.isFrozen(
          entry.draftEvidence
            .recommendations,
        ) ||
        !Object.isFrozen(
          entry.draftEvidence
            .uncertainties,
        ) ||
        !Object.isFrozen(
          entry.executionBoundary,
        ),
    ) ||
    !Object.isFrozen(
      execution.aggregateSummary,
    ) ||
    !Object.isFrozen(
      execution.executionBoundary,
    )
  ) {
    throw new Error(
      "Engineering controlled-shadow execution must remain immutable.",
    );
  }
}

export function createEngineeringAIWorkforceControlledShadowOperationExecution(
  input:
    CreateEngineeringAIWorkforceControlledShadowOperationExecutionInput,
): EngineeringAIWorkforceControlledShadowOperationExecution {
  if (
    input.preparation !==
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION
  ) {
    throw new Error(
      "Only the canonical Engineering controlled-shadow preparation can be executed.",
    );
  }

  validateEngineeringAIWorkforceControlledShadowOperationPreparation(
    input.preparation,
  );

  requireIdentifier(
    "Engineering controlled-shadow execution ID",
    input.executionId,
  );

  requireTimestamp(
    "Engineering controlled-shadow execution time",
    input.executedAt,
  );

  const source =
    input.preparation;

  if (
    source.preparationState !==
      "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_PREPARED" ||
    source.candidatePreparations.length !==
      8 ||
    source.aggregateSummary
      .controlledShadowPreparationCount !==
        8 ||
    source.aggregateSummary
      .shadowExecutionEligibleCount !==
        8 ||
    source.aggregateSummary
      .shadowExecutionExecutedCount !==
        0 ||
    source.aggregateSummary
      .draftCreatedCount !==
        0 ||
    source.authorityBoundary
      .controlledShadowOperationPrepared !==
        true ||
    source.authorityBoundary
      .controlledShadowOperationExecuted !==
        false ||
    source.authorityBoundary
      .shadowExecutionEligible !==
        true ||
    source.nextStep !==
      "EXECUTE_ENGINEERING_CONTROLLED_SHADOW_OPERATIONS"
  ) {
    throw new Error(
      "Engineering controlled-shadow execution requires the complete prepared operation set.",
    );
  }

  if (
    Date.parse(input.executedAt) <
    Date.parse(source.preparedAt)
  ) {
    throw new Error(
      "Engineering controlled-shadow execution cannot precede preparation.",
    );
  }

  const candidateExecutions =
    source.candidatePreparations.map(
      (
        preparation,
        index,
      ) => {
        validatePreparationEntry(
          preparation,
        );

        const profile =
          ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_EXECUTION_PROFILES[index];

        if (
          !profile ||
          profile.publicName !==
            preparation.publicName
        ) {
          throw new Error(
            "Engineering controlled-shadow execution profile is not bound to the prepared specialist.",
          );
        }

        const entryCore = {
          developmentSequence:
            index + 1,

          executionState:
            "ENGINEERING_CANDIDATE_CONTROLLED_SHADOW_OPERATION_EXECUTED" as const,

          employeeId:
            preparation.employeeId,

          employeeCode:
            preparation.employeeCode,

          publicName:
            preparation.publicName,

          officialRole:
            preparation.officialRole,

          templateId:
            preparation.templateId,

          runtimeId:
            preparation.runtimeId,

          runtimeDigest:
            preparation.runtimeDigest,

          preparationDigest:
            preparation.candidatePreparationDigest,

          shadowFixtureDigest:
            sha256(
              preparation.shadowFixture,
            ),

          syntheticEvidence: {
            evidenceId:
              `evidence-${preparation.employeeCode}-controlled-shadow-001`,

            dataClassification:
              "SYNTHETIC_SANITIZED_ONLY" as const,

            evidenceToolId:
              "tool-engineering-shadow-evidence-read" as const,

            evidenceToolMode:
              "READ_ONLY" as const,

            executionMode:
              "SANDBOX_ONLY" as const,

            verifiedFacts:
              profile.verifiedFacts,

            unsupportedFactsInvented:
              false as const,

            realCustomerDataUsed:
              false as const,

            crossTenantContextUsed:
              false as const,
          },

          draftEvidence: {
            draftId:
              `draft-${preparation.employeeCode}-controlled-shadow-001`,

            draftStatus:
              "DRAFT_CREATED_AWAITING_OWNER_REVIEW" as const,

            draftToolId:
              "tool-engineering-shadow-draft" as const,

            draftToolMode:
              "DRAFT_ONLY" as const,

            title:
              profile.draftTitle,

            summary:
              profile.draftSummary,

            findings:
              profile.findings,

            recommendations:
              profile.recommendations,

            uncertainties:
              profile.uncertainties,

            riskLevel:
              "MEDIUM" as const,

            ownerDecisionMade:
              false as const,

            unsupportedClaimsIncluded:
              false as const,

            urgencyExaggerated:
              false as const,

            guaranteeMade:
              false as const,

            repositoryChangePrepared:
              false as const,

            repositoryChangeExecuted:
              false as const,

            productionChangePrepared:
              false as const,

            productionChangeExecuted:
              false as const,

            customerDeliveryPrepared:
              false as const,

            customerDeliveryExecuted:
              false as const,
          },

          executionBoundary: {
            preparationBound:
              true as const,

            runtimeIdentityBound:
              true as const,

            tenantIdentityBound:
              true as const,

            ownerIdentityBound:
              true as const,

            qualifiedManifestBound:
              true as const,

            maximumTaskCountEnforced:
              true as const,

            draftCreatorInvocationCount:
              1 as const,

            shadowExecutionExecuted:
              true as const,

            syntheticEvidenceRead:
              true as const,

            draftCreated:
              true as const,

            ownerDecisionMade:
              false as const,

            ownerReviewRequired:
              true as const,

            emergencyPauseAvailable:
              true as const,

            repositoryReadAuthorized:
              false as const,

            repositoryWriteAuthorized:
              false as const,

            branchCreationAuthorized:
              false as const,

            pullRequestPreparationAuthorized:
              false as const,

            mergeAuthorized:
              false as const,

            productionDeploymentAuthorized:
              false as const,

            secretsAccessAuthorized:
              false as const,

            realCustomerDataUsed:
              false as const,

            realCustomerDataAccessAuthorized:
              false as const,

            realCustomerContactAuthorized:
              false as const,

            externalDeliveryAuthorized:
              false as const,

            liveProviderExecutionAuthorized:
              false as const,

            productionDatabaseAuthorized:
              false as const,

            productionMutationAuthorized:
              false as const,

            paymentExecutionAuthorized:
              false as const,

            financialCommitmentAuthorized:
              false as const,

            legalCommitmentAuthorized:
              false as const,

            autonomousDecisionAuthorized:
              false as const,

            productionReadinessAuthorized:
              false as const,

            publicLaunchAuthorized:
              false as const,
          },
        };

        return deepFreeze({
          ...entryCore,

          candidateExecutionDigest:
            sha256(entryCore),
        });
      },
    );

  const executionCore = {
    version:
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION_VERSION,

    executionId:
      input.executionId,

    executionState:
      "ENGINEERING_CONTROLLED_SHADOW_OPERATIONS_EXECUTED" as const,

    tenantId:
      source.tenantId,

    ownerId:
      source.ownerId,

    sourcePreparationId:
      source.preparationId,

    sourcePreparationDigest:
      source.preparationDigest,

    candidateExecutionCount:
      8 as const,

    candidateExecutions,

    aggregateSummary: {
      preparedOperationCount:
        8 as const,

      executedOperationCount:
        8 as const,

      syntheticEvidenceReadCount:
        8 as const,

      draftCreatedCount:
        8 as const,

      ownerReviewRequiredCount:
        8 as const,

      ownerDecisionMadeCount:
        0 as const,

      repositoryChangePreparedCount:
        0 as const,

      repositoryChangeExecutedCount:
        0 as const,

      productionChangeExecutedCount:
        0 as const,

      customerDeliveryExecutedCount:
        0 as const,

      maximumAggregateTaskCount:
        8 as const,

      actualAggregateTaskCount:
        8 as const,

      remainingAggregateTaskCapacity:
        0 as const,

      exactCandidateSequencePreserved:
        true as const,

      exactCandidateIdentityPreserved:
        true as const,

      exactPreparationBindingsPreserved:
        true as const,

      uniqueDraftCount:
        8 as const,

      uniqueCandidateExecutionDigests:
        8 as const,
    },

    executionBoundary: {
      canonicalPreparationBound:
        true as const,

      exactEightCandidatesRequired:
        true as const,

      controlledInternalWorkOnly:
        true as const,

      controlledShadowOperationPrepared:
        true as const,

      controlledShadowOperationExecuted:
        true as const,

      syntheticSanitizedEvidenceOnly:
        true as const,

      readOnlyEvidenceToolsOnly:
        true as const,

      draftOnlyToolsOnly:
        true as const,

      ownerDecisionMade:
        false as const,

      ownerReviewRequired:
        true as const,

      ownerReviewRequiredCount:
        8 as const,

      approvalBypassAllowed:
        false as const,

      emergencyPauseAvailable:
        true as const,

      repositoryReadAuthorized:
        false as const,

      repositoryWriteAuthorized:
        false as const,

      branchCreationAuthorized:
        false as const,

      pullRequestPreparationAuthorized:
        false as const,

      mergeAuthorized:
        false as const,

      productionDeploymentAuthorized:
        false as const,

      secretsAccessAuthorized:
        false as const,

      realCustomerDataUsed:
        false as const,

      realCustomerDataAccessAuthorized:
        false as const,

      realCustomerContactAuthorized:
        false as const,

      externalDeliveryAuthorized:
        false as const,

      liveProviderExecutionAuthorized:
        false as const,

      productionDatabaseAuthorized:
        false as const,

      productionMutationAuthorized:
        false as const,

      paymentExecutionAuthorized:
        false as const,

      financialCommitmentAuthorized:
        false as const,

      legalCommitmentAuthorized:
        false as const,

      autonomousDecisionAuthorized:
        false as const,

      productionReadinessAuthorized:
        false as const,

      publicLaunchAuthorized:
        false as const,
    },

    nextStep:
      "AWAIT_OWNER_ENGINEERING_CONTROLLED_SHADOW_OPERATION_REVIEWS" as const,

    executedAt:
      input.executedAt,
  };

  const execution =
    deepFreeze({
      ...executionCore,

      executionDigest:
        sha256(executionCore),
    }) as EngineeringAIWorkforceControlledShadowOperationExecution;

  validateEngineeringAIWorkforceControlledShadowOperationExecution(
    execution,
  );

  return execution;
}

export const ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_EXECUTION =
  createEngineeringAIWorkforceControlledShadowOperationExecution({
    executionId:
      "engineering-ai-workforce-controlled-shadow-operation-execution-001",

    preparation:
      ENGINEERING_AI_WORKFORCE_CONTROLLED_SHADOW_OPERATION_PREPARATION,

    executedAt:
      "2026-07-23T12:40:53.924Z",
  });
